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
    // Mode Supabase - update database
    if (isSupabaseConfigured() && supabaseUser) {
      try {
        // Get current stats
        const { data: currentStats, error: fetchError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .single();

        if (fetchError || !currentStats) {
          console.error('Error fetching stats:', fetchError);
          // Fallback to local storage
          localCompleteExercise(result);
          return;
        }

        const stats = currentStats as UserStatsRow;

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
        // Note: fetch exercises are counted in total_exercises but no specific counter

        // Update streak if needed
        const today = new Date().toISOString().split('T')[0];
        const lastActive = stats.last_activity_date;

        if (lastActive !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastActive === yesterdayStr) {
            // Continue streak
            const newStreak = stats.current_streak + 1;
            updates.current_streak = newStreak;
            updates.longest_streak = Math.max(stats.longest_streak, newStreak);
          } else {
            // Reset streak (gap in activity)
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

        await supabase
          .from('exercise_results')
          .upsert(exerciseResultInsert as never, { onConflict: 'user_id,exercise_id' });

        // Update stats
        await supabase
          .from('user_stats')
          .update(updates as never)
          .eq('user_id', supabaseUser.id);

        // Refresh stats in store
        await fetchStats();
      } catch (error) {
        console.error('Error completing exercise in Supabase:', error);
        // Fallback to local storage
        localCompleteExercise(result);
      }
    } else {
      // Mode localStorage
      localCompleteExercise(result);
    }
  };

  return { completeExercise };
}
