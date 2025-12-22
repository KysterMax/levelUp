import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getLevelFromXP } from '@/types/user';
import type { User } from '@/types/user';

/**
 * Hook unifié pour récupérer l'utilisateur courant
 * Fonctionne avec localStorage (mode offline) et Supabase (mode online)
 */
export function useCurrentUser(): User | null {
  const localUser = useUserStore((state) => state.user);
  const supabaseUser = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const stats = useAuthStore((state) => state.stats);

  // Mode Supabase
  if (isSupabaseConfigured() && supabaseUser) {
    const totalXP = stats?.total_xp || 0;
    const { level, title } = getLevelFromXP(totalXP);

    // Convertir les données Supabase en format User local
    return {
      id: supabaseUser.id,
      username: profile?.username || supabaseUser.user_metadata?.user_name || 'Utilisateur',
      avatarUrl: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at),
      lastActiveAt: stats?.updated_at ? new Date(stats.updated_at) : new Date(),
      initialLevel: (profile?.initial_level as 'junior' | 'mid' | 'senior') || 'junior',
      stats: {
        totalXP,
        level,
        title,
        currentStreak: stats?.current_streak || 0,
        longestStreak: stats?.longest_streak || 0,
        totalExercises: stats?.total_exercises || 0,
        totalQuizzes: stats?.total_quizzes || 0,
        totalChallenges: stats?.total_challenges || 0,
        totalReviews: stats?.total_reviews || 0,
        totalFetchExercises: 0,
        fastestExerciseTime: 0,
        consecutivePerfectScores: 0,
        bestPerfectStreak: 0,
        averageScore: 0,
      },
      exerciseResults: {},
      dailyProgress: [],
      unlockedPaths: ['javascript-fundamentals', 'algorithms-basic', 'async-promises'],
      earnedBadges: [],
      settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        theme: 'system' as const,
        dailyGoal: 50,
      },
    };
  }

  // Mode localStorage
  if (localUser) {
    return localUser;
  }

  return null;
}

/**
 * Hook pour vérifier si l'utilisateur est authentifié
 */
export function useIsAuthenticated(): boolean {
  const localUser = useUserStore((state) => state.user);
  const supabaseUser = useAuthStore((state) => state.user);

  if (isSupabaseConfigured()) {
    return !!supabaseUser;
  }

  return !!localUser;
}
