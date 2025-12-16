import { supabase } from './supabase';
import { StorageKeys, getItem, clearAll } from './storage';
import type { User } from '@/types';

interface LocalUserData {
  user: User | null;
  hasData: boolean;
}

// Check if there's local data to migrate
export function getLocalUserData(): LocalUserData {
  const user = getItem<{ state: { user: User } }>(StorageKeys.USER);
  const localUser = user?.state?.user || null;

  return {
    user: localUser,
    hasData: !!(localUser && localUser.stats && localUser.stats.totalXP > 0),
  };
}

// Migrate local data to Supabase
export async function migrateLocalDataToSupabase(userId: string): Promise<{
  success: boolean;
  error?: string;
  migrated?: {
    xp: number;
    exercises: number;
    badges: number;
  };
}> {
  const { user: localUser, hasData } = getLocalUserData();

  if (!hasData || !localUser) {
    return { success: true, migrated: { xp: 0, exercises: 0, badges: 0 } };
  }

  try {
    // 1. Update user stats
    const { error: statsError } = await (supabase as any)
      .from('user_stats')
      .update({
        total_xp: localUser.stats.totalXP,
        level: localUser.stats.level,
        title: localUser.stats.title,
        current_streak: localUser.stats.currentStreak,
        longest_streak: localUser.stats.longestStreak,
        total_exercises: localUser.stats.totalExercises,
        total_quizzes: localUser.stats.totalQuizzes,
        total_challenges: localUser.stats.totalChallenges,
        total_reviews: localUser.stats.totalReviews,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (statsError) {
      console.error('Error migrating stats:', statsError);
      return { success: false, error: 'Erreur lors de la migration des stats' };
    }

    // 2. Migrate exercise results
    const exerciseResults = Object.entries(localUser.exerciseResults || {});
    if (exerciseResults.length > 0) {
      const resultsToInsert = exerciseResults.map(([exerciseId, result]) => ({
        user_id: userId,
        exercise_id: exerciseId,
        score: (result as any).score || 100,
        xp_earned: (result as any).xpEarned || 0,
        time_spent: (result as any).timeSpent || 0,
        attempts: (result as any).attempts || 1,
        completed_at: (result as any).completedAt || new Date().toISOString(),
      }));

      await (supabase as any)
        .from('exercise_results')
        .upsert(resultsToInsert, { onConflict: 'user_id,exercise_id' });
    }

    // 3. Migrate badges
    const badges = localUser.earnedBadges || [];
    if (badges.length > 0) {
      const badgesToInsert = badges.map((badgeId: string) => ({
        user_id: userId,
        badge_id: badgeId,
      }));

      await (supabase as any)
        .from('user_badges')
        .upsert(badgesToInsert, { onConflict: 'user_id,badge_id' });
    }

    // 4. Migrate unlocked paths
    const paths = localUser.unlockedPaths || [];
    if (paths.length > 0) {
      const pathsToInsert = paths.map((pathId: string) => ({
        user_id: userId,
        path_id: pathId,
      }));

      await (supabase as any)
        .from('unlocked_paths')
        .upsert(pathsToInsert, { onConflict: 'user_id,path_id' });
    }

    // 5. Migrate daily progress
    const dailyProgress = localUser.dailyProgress || [];
    if (dailyProgress.length > 0) {
      const progressToInsert = dailyProgress.map((dp: any) => ({
        user_id: userId,
        date: dp.date,
        xp_earned: dp.xpEarned || 0,
        exercises_completed: dp.exercisesCompleted || 0,
      }));

      await (supabase as any)
        .from('daily_progress')
        .upsert(progressToInsert, { onConflict: 'user_id,date' });
    }

    // Clear local data after successful migration
    clearAll();

    return {
      success: true,
      migrated: {
        xp: localUser.stats.totalXP,
        exercises: exerciseResults.length,
        badges: badges.length,
      },
    };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: 'Erreur lors de la migration' };
  }
}

// Check if migration is needed
export function shouldOfferMigration(): boolean {
  const { hasData } = getLocalUserData();
  return hasData;
}
