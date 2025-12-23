import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ExerciseResult } from '@/types';
import type { Database } from '@/types/database';

type UserStatsRow = Database['public']['Tables']['user_stats']['Row'];
type UserStatsUpdate = Database['public']['Tables']['user_stats']['Update'];
type ExerciseResultInsert = Database['public']['Tables']['exercise_results']['Insert'];

/**
 * Hook unifié pour compléter un exercice
 * Fonctionne avec localStorage (mode offline) et Supabase (mode online)
 */
export function useCompleteExercise() {
  const localCompleteExercise = useUserStore((state) => state.completeExercise);
  const supabaseUser = useAuthStore((state) => state.user);
  const fetchStats = useAuthStore((state) => state.fetchStats);

  const completeExercise = async (result: ExerciseResult) => {
    console.log('[useCompleteExercise] Starting completion:', {
      exerciseId: result.exerciseId,
      xpEarned: result.xpEarned,
      isSupabaseConfigured: isSupabaseConfigured(),
      hasSupabaseUser: !!supabaseUser
    });

    // Mode Supabase - update database
    if (isSupabaseConfigured() && supabaseUser) {
      try {
        console.log('[useCompleteExercise] Using Supabase mode');

        // Get current stats with timeout
        const { data: currentStats, error: fetchError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();

        if (fetchError || !currentStats) {
          console.error('[useCompleteExercise] Error fetching stats:', fetchError);

          // Try to create stats row if it doesn't exist
          if (fetchError?.code === 'PGRST116') {
            console.log('[useCompleteExercise] No stats row found, creating one...');
            const { error: createError } = await supabase
              .from('user_stats')
              .insert({ user_id: supabaseUser.id } as never);

            if (createError) {
              console.error('[useCompleteExercise] Failed to create stats:', createError);
            } else {
              console.log('[useCompleteExercise] Stats row created, retrying...');
              // Retry with new stats row
              localCompleteExercise(result);
              return;
            }
          }

          // Fallback to local storage
          console.log('[useCompleteExercise] Falling back to localStorage');
          localCompleteExercise(result);
          return;
        }

        const stats = currentStats as UserStatsRow;
        console.log('[useCompleteExercise] Current stats:', { total_xp: stats.total_xp });

        // Determine exercise type from ID
        const exerciseType = result.exerciseId.split('_')[0];

        // Calculate new stats
        const updates: UserStatsUpdate = {
          total_xp: stats.total_xp + result.xpEarned,
          total_exercises: stats.total_exercises + 1,
          updated_at: new Date().toISOString(),
        };

        // Update type-specific counter
        if (exerciseType === 'quiz') {
          updates.total_quizzes = (stats.total_quizzes || 0) + 1;
        } else if (exerciseType === 'challenge') {
          updates.total_challenges = (stats.total_challenges || 0) + 1;
        } else if (exerciseType === 'review') {
          updates.total_reviews = (stats.total_reviews || 0) + 1;
        }

        // Update streak if needed
        const today = new Date().toISOString().split('T')[0];
        const lastActive = stats.last_activity_date;

        if (lastActive !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastActive === yesterdayStr) {
            const newStreak = stats.current_streak + 1;
            updates.current_streak = newStreak;
            updates.longest_streak = Math.max(stats.longest_streak, newStreak);
          } else {
            updates.current_streak = 1;
          }
          updates.last_activity_date = today;
        }

        // Save exercise result
        const exerciseResultInsert: ExerciseResultInsert = {
          user_id: supabaseUser.id,
          exercise_id: result.exerciseId,
          score: result.score,
          xp_earned: result.xpEarned,
          time_spent: result.timeSpent,
          attempts: result.attempts,
          completed_at: result.completedAt?.toISOString() || new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('exercise_results')
          .upsert(exerciseResultInsert as never, { onConflict: 'user_id,exercise_id' });

        if (insertError) {
          console.error('[useCompleteExercise] Error inserting exercise result:', insertError);
        }

        // Update stats
        const { error: updateError } = await supabase
          .from('user_stats')
          .update(updates as never)
          .eq('user_id', supabaseUser.id);

        if (updateError) {
          console.error('[useCompleteExercise] Error updating stats:', updateError);
        }

        console.log('[useCompleteExercise] Stats updated, new XP:', updates.total_xp);

        // Refresh stats in store
        await fetchStats();
        console.log('[useCompleteExercise] Supabase completion done');
      } catch (error) {
        console.error('[useCompleteExercise] Error completing exercise in Supabase:', error);
        // Fallback to local storage
        localCompleteExercise(result);
      }
    } else {
      // Mode localStorage
      console.log('[useCompleteExercise] Using localStorage mode');
      localCompleteExercise(result);
      console.log('[useCompleteExercise] localStorage completion done');
    }
  };

  return { completeExercise };
}
