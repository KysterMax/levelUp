import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  UserStats,
  UserSettings,
  Difficulty,
  ExerciseResult,
} from '@/types';
import { getLevelFromXP, DEFAULT_USER_SETTINGS } from '@/types/user';
import { StorageKeys } from '@/lib/storage';

interface UserState {
  user: User | null;
  isLoading: boolean;

  // Actions
  initializeUser: (username: string, initialLevel: Difficulty, customUnlockedPaths?: string[]) => void;
  addXP: (amount: number) => void;
  completeExercise: (result: ExerciseResult) => void;
  updateStreak: () => void;
  earnBadge: (badgeId: string) => void;
  unlockPath: (pathId: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetProgress: () => void;
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function createInitialStats(): UserStats {
  return {
    totalXP: 0,
    level: 1,
    title: 'junior-padawan',
    currentStreak: 0,
    longestStreak: 0,
    totalExercises: 0,
    totalQuizzes: 0,
    totalChallenges: 0,
    totalReviews: 0,
    averageScore: 0,
  };
}

function createInitialUser(username: string, initialLevel: Difficulty, customUnlockedPaths?: string[]): User {
  let unlockedPaths: string[];

  if (customUnlockedPaths && customUnlockedPaths.length > 0) {
    // Use custom paths from onboarding
    unlockedPaths = customUnlockedPaths;
  } else {
    // Fallback to default paths based on level
    unlockedPaths = ['javascript-fundamentals'];

    if (initialLevel === 'mid' || initialLevel === 'senior') {
      unlockedPaths.push('algorithms-basic', 'async-promises', 'clean-code');
    }

    if (initialLevel === 'senior') {
      unlockedPaths.push('design-patterns', 'react-19-features', 'system-design');
    }
  }

  return {
    id: generateUserId(),
    username,
    createdAt: new Date(),
    lastActiveAt: new Date(),
    initialLevel,
    stats: createInitialStats(),
    exerciseResults: {},
    dailyProgress: [],
    unlockedPaths,
    earnedBadges: [],
    settings: DEFAULT_USER_SETTINGS,
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      initializeUser: (username: string, initialLevel: Difficulty, customUnlockedPaths?: string[]) => {
        const user = createInitialUser(username, initialLevel, customUnlockedPaths);
        set({ user });
      },

      addXP: (amount: number) => {
        const { user } = get();
        if (!user) return;

        const newTotalXP = user.stats.totalXP + amount;
        const { level, title } = getLevelFromXP(newTotalXP);

        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              totalXP: newTotalXP,
              level,
              title,
            },
            lastActiveAt: new Date(),
          },
        });
      },

      completeExercise: (result: ExerciseResult) => {
        const { user, addXP, updateStreak } = get();
        if (!user) return;

        const today = getTodayString();
        const existingProgress = user.dailyProgress.find(p => p.date === today);

        const updatedDailyProgress = existingProgress
          ? user.dailyProgress.map(p =>
              p.date === today
                ? {
                    ...p,
                    xpEarned: p.xpEarned + result.xpEarned,
                    exercisesCompleted: p.exercisesCompleted + 1,
                  }
                : p
            )
          : [
              ...user.dailyProgress,
              { date: today, xpEarned: result.xpEarned, exercisesCompleted: 1 },
            ];

        // Update exercise type counter
        const exerciseType = result.exerciseId.split('_')[0];
        const statsUpdate: Partial<UserStats> = {
          totalExercises: user.stats.totalExercises + 1,
        };

        if (exerciseType === 'quiz') {
          statsUpdate.totalQuizzes = user.stats.totalQuizzes + 1;
        } else if (exerciseType === 'challenge' || exerciseType === 'fetch') {
          statsUpdate.totalChallenges = user.stats.totalChallenges + 1;
        } else if (exerciseType === 'review') {
          statsUpdate.totalReviews = user.stats.totalReviews + 1;
        }

        set({
          user: {
            ...user,
            exerciseResults: {
              ...user.exerciseResults,
              [result.exerciseId]: result,
            },
            dailyProgress: updatedDailyProgress,
            stats: {
              ...user.stats,
              ...statsUpdate,
            },
          },
        });

        addXP(result.xpEarned);
        updateStreak();
      },

      updateStreak: () => {
        const { user } = get();
        if (!user) return;

        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        const hasActivityToday = user.dailyProgress.some(p => p.date === today);
        const hasActivityYesterday = user.dailyProgress.some(p => p.date === yesterdayString);

        let newStreak = user.stats.currentStreak;

        if (hasActivityToday) {
          if (hasActivityYesterday || user.stats.currentStreak === 0) {
            newStreak = Math.max(user.stats.currentStreak, 1);
          }
        }

        // Check if streak was broken (no activity yesterday and today is first activity)
        if (!hasActivityYesterday && hasActivityToday && user.stats.currentStreak > 0) {
          newStreak = 1;
        }

        // Increment streak if this is new activity today
        const todayProgress = user.dailyProgress.find(p => p.date === today);
        if (todayProgress && todayProgress.exercisesCompleted === 1 && hasActivityYesterday) {
          newStreak = user.stats.currentStreak + 1;
        }

        const longestStreak = Math.max(user.stats.longestStreak, newStreak);

        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              currentStreak: newStreak,
              longestStreak,
            },
          },
        });
      },

      earnBadge: (badgeId: string) => {
        const { user } = get();
        if (!user || user.earnedBadges.includes(badgeId)) return;

        set({
          user: {
            ...user,
            earnedBadges: [...user.earnedBadges, badgeId],
          },
        });
      },

      unlockPath: (pathId: string) => {
        const { user } = get();
        if (!user || user.unlockedPaths.includes(pathId)) return;

        set({
          user: {
            ...user,
            unlockedPaths: [...user.unlockedPaths, pathId],
          },
        });
      },

      updateSettings: (settings: Partial<UserSettings>) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            settings: {
              ...user.settings,
              ...settings,
            },
          },
        });
      },

      resetProgress: () => {
        set({ user: null });
      },
    }),
    {
      name: StorageKeys.USER,
    }
  )
);
