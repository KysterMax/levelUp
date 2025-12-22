import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  allExercises,
  getExerciseById,
  getExercisesByType,
  getExercisesByDifficulty,
  getExercisesByCategory,
  getRandomExercise,
} from '@/data/exercises';
import type { Exercise, Difficulty } from '@/types';

interface CompletedExercise {
  exerciseId: string;
  completedAt: Date;
  score: number;
  timeSpent: number;
  attempts: number;
}

interface DailyChallenge {
  date: string; // YYYY-MM-DD format
  exerciseId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

// Get today's date as YYYY-MM-DD
const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Simple hash function for deterministic selection
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Deterministic daily exercise selection - personalized per user
const getDailyExerciseId = (
  dateString: string,
  userId?: string,
  userLevel?: Difficulty,
  completedIds?: Set<string>
): string => {
  // Create a seed from date + userId for deterministic but personalized selection
  const seed = hashString(dateString + (userId || 'anonymous'));

  // Filter exercises based on user context
  let candidates = [...allExercises];

  // 1. Filter out completed exercises (if provided)
  if (completedIds && completedIds.size > 0) {
    const uncompleted = candidates.filter(ex => !completedIds.has(ex.id));
    if (uncompleted.length > 0) {
      candidates = uncompleted;
    }
    // If all completed, keep all candidates (training mode)
  }

  // 2. Filter by user level - prioritize exercises at or below user level
  if (userLevel) {
    const levelOrder: Difficulty[] = ['junior', 'mid', 'senior'];
    const userLevelIndex = levelOrder.indexOf(userLevel);

    // Get exercises at user's level or one below
    const appropriateLevel = candidates.filter(ex => {
      const exLevelIndex = levelOrder.indexOf(ex.difficulty);
      return exLevelIndex <= userLevelIndex && exLevelIndex >= userLevelIndex - 1;
    });

    if (appropriateLevel.length > 0) {
      candidates = appropriateLevel;
    }
  }

  // 3. Use seeded selection for consistency within the day
  const index = seed % candidates.length;
  return candidates[index].id;
};

interface ExerciseState {
  // Completed exercises tracking
  completedExercises: CompletedExercise[];

  // Daily challenge tracking
  dailyChallenges: DailyChallenge[];

  // Current exercise session
  currentExerciseId: string | null;
  sessionStartTime: number | null;

  // Actions
  startExercise: (exerciseId: string) => void;
  completeExercise: (exerciseId: string, score: number, timeSpent: number) => void;
  resetExercise: (exerciseId: string) => void;

  // Daily challenge actions
  completeDailyChallenge: (score: number) => void;

  // Getters
  isExerciseCompleted: (exerciseId: string) => boolean;
  getExerciseScore: (exerciseId: string) => number | null;
  getCompletedCount: () => number;
  getCompletedCountByType: (type: Exercise['type']) => number;
  getCompletedCountByDifficulty: (difficulty: Difficulty) => number;

  // Daily challenge getters
  getTodayChallenge: (userId?: string, userLevel?: Difficulty) => { exercise: Exercise; completed: boolean; score?: number } | null;
  isDailyChallengeCompleted: () => boolean;
  getDailyChallengeStreak: () => number;

  // Exercise fetching (from static data)
  getExercise: (id: string) => Exercise | undefined;
  getExercises: (filters?: {
    type?: Exercise['type'];
    difficulty?: Difficulty;
    category?: string;
  }) => Exercise[];
  getRandomExercise: (
    type?: Exercise['type'],
    difficulty?: Difficulty
  ) => Exercise | undefined;
  getNextExercise: (currentId: string) => Exercise | undefined;

  // Smart exercise selection (filters out completed)
  getNewExercise: (
    type?: Exercise['type'],
    userLevel?: Difficulty
  ) => Exercise | undefined;
  getTrainingExercise: (
    type?: Exercise['type']
  ) => Exercise | undefined;
  getUncompletedCount: () => number;
  getCompletedExercisesList: () => Exercise[];
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      completedExercises: [],
      dailyChallenges: [],
      currentExerciseId: null,
      sessionStartTime: null,

      startExercise: (exerciseId) => {
        set({
          currentExerciseId: exerciseId,
          sessionStartTime: Date.now(),
        });
      },

      completeExercise: (exerciseId, score, timeSpent) => {
        const { completedExercises } = get();
        const existingIndex = completedExercises.findIndex(
          (e) => e.exerciseId === exerciseId
        );

        const completedExercise: CompletedExercise = {
          exerciseId,
          completedAt: new Date(),
          score,
          timeSpent,
          attempts: existingIndex >= 0 ? completedExercises[existingIndex].attempts + 1 : 1,
        };

        if (existingIndex >= 0) {
          // Update existing
          const updated = [...completedExercises];
          updated[existingIndex] = completedExercise;
          set({ completedExercises: updated });
        } else {
          // Add new
          set({ completedExercises: [...completedExercises, completedExercise] });
        }

        set({ currentExerciseId: null, sessionStartTime: null });
      },

      resetExercise: (exerciseId) => {
        const { completedExercises } = get();
        set({
          completedExercises: completedExercises.filter(
            (e) => e.exerciseId !== exerciseId
          ),
        });
      },

      // Daily challenge actions
      completeDailyChallenge: (score) => {
        const today = getTodayString();
        const exerciseId = getDailyExerciseId(today);
        const { dailyChallenges } = get();

        const existingIndex = dailyChallenges.findIndex((dc) => dc.date === today);

        const challenge: DailyChallenge = {
          date: today,
          exerciseId,
          completed: true,
          completedAt: new Date(),
          score,
        };

        if (existingIndex >= 0) {
          const updated = [...dailyChallenges];
          updated[existingIndex] = challenge;
          set({ dailyChallenges: updated });
        } else {
          set({ dailyChallenges: [...dailyChallenges, challenge] });
        }
      },

      // Daily challenge getters - personalized per user
      getTodayChallenge: (userId?: string, userLevel?: Difficulty) => {
        const today = getTodayString();
        const { completedExercises, dailyChallenges } = get();

        // Check if we already have a challenge for today (consistency)
        const existingChallenge = dailyChallenges.find((dc) => dc.date === today);

        let exerciseId: string;

        if (existingChallenge) {
          // Use existing challenge for consistency
          exerciseId = existingChallenge.exerciseId;
        } else {
          // Generate new personalized challenge
          const completedIds = new Set(completedExercises.map(c => c.exerciseId));
          exerciseId = getDailyExerciseId(today, userId, userLevel, completedIds);
        }

        const exercise = getExerciseById(exerciseId);
        if (!exercise) return null;

        return {
          exercise,
          completed: existingChallenge?.completed ?? false,
          score: existingChallenge?.score,
        };
      },

      isDailyChallengeCompleted: () => {
        const today = getTodayString();
        const { dailyChallenges } = get();
        return dailyChallenges.some((dc) => dc.date === today && dc.completed);
      },

      getDailyChallengeStreak: () => {
        const { dailyChallenges } = get();
        if (dailyChallenges.length === 0) return 0;

        // Sort by date descending
        const sorted = [...dailyChallenges]
          .filter((dc) => dc.completed)
          .sort((a, b) => b.date.localeCompare(a.date));

        if (sorted.length === 0) return 0;

        // Check if today or yesterday is in the streak
        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        // Streak must include today or yesterday
        if (sorted[0].date !== today && sorted[0].date !== yesterdayStr) {
          return 0;
        }

        // Count consecutive days
        let streak = 1;
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = new Date(sorted[i].date);
          const next = new Date(sorted[i + 1].date);
          const diffDays = Math.round((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }

        return streak;
      },

      isExerciseCompleted: (exerciseId) => {
        return get().completedExercises.some((e) => e.exerciseId === exerciseId);
      },

      getExerciseScore: (exerciseId) => {
        const completed = get().completedExercises.find(
          (e) => e.exerciseId === exerciseId
        );
        return completed?.score ?? null;
      },

      getCompletedCount: () => {
        return get().completedExercises.length;
      },

      getCompletedCountByType: (type) => {
        const { completedExercises } = get();
        const exercisesOfType = getExercisesByType(type);
        return completedExercises.filter((c) =>
          exercisesOfType.some((e) => e.id === c.exerciseId)
        ).length;
      },

      getCompletedCountByDifficulty: (difficulty) => {
        const { completedExercises } = get();
        const exercisesOfDiff = getExercisesByDifficulty(difficulty);
        return completedExercises.filter((c) =>
          exercisesOfDiff.some((e) => e.id === c.exerciseId)
        ).length;
      },

      // Static data getters
      getExercise: (id) => getExerciseById(id),

      getExercises: (filters) => {
        let exercises = allExercises;

        if (filters?.type) {
          exercises = exercises.filter((e) => e.type === filters.type);
        }
        if (filters?.difficulty) {
          exercises = exercises.filter((e) => e.difficulty === filters.difficulty);
        }
        if (filters?.category) {
          exercises = exercises.filter((e) => e.category === filters.category);
        }

        return exercises;
      },

      getRandomExercise: (type, difficulty) => getRandomExercise(type, difficulty),

      getNextExercise: (currentId) => {
        const currentExercise = getExerciseById(currentId);
        if (!currentExercise) return undefined;

        // Get exercises of same category and difficulty
        const sameCategory = getExercisesByCategory(currentExercise.category);
        const sameDifficulty = sameCategory.filter(
          (e) => e.difficulty === currentExercise.difficulty
        );

        // Find current index and get next
        const currentIndex = sameDifficulty.findIndex((e) => e.id === currentId);
        if (currentIndex >= 0 && currentIndex < sameDifficulty.length - 1) {
          return sameDifficulty[currentIndex + 1];
        }

        // If no more in same category/difficulty, get random of same type
        return getRandomExercise(currentExercise.type, currentExercise.difficulty);
      },

      // Smart exercise selection - filters out completed exercises
      getNewExercise: (type, userLevel) => {
        const { completedExercises } = get();
        const completedIds = new Set(completedExercises.map((c) => c.exerciseId));

        let filtered = allExercises.filter((ex) => !completedIds.has(ex.id));

        if (type) {
          filtered = filtered.filter((ex) => ex.type === type);
        }

        // Filter by user level - show exercises at or below user's level
        if (userLevel) {
          const levelOrder: Difficulty[] = ['junior', 'mid', 'senior'];
          const userLevelIndex = levelOrder.indexOf(userLevel);
          filtered = filtered.filter((ex) => {
            const exLevelIndex = levelOrder.indexOf(ex.difficulty);
            return exLevelIndex <= userLevelIndex;
          });
        }

        if (filtered.length === 0) {
          // If all exercises are completed, return any exercise (training mode fallback)
          return getRandomExercise(type, userLevel);
        }

        return filtered[Math.floor(Math.random() * filtered.length)];
      },

      // Training mode - returns only completed exercises
      getTrainingExercise: (type) => {
        const { completedExercises } = get();
        const completedIds = new Set(completedExercises.map((c) => c.exerciseId));

        let filtered = allExercises.filter((ex) => completedIds.has(ex.id));

        if (type) {
          filtered = filtered.filter((ex) => ex.type === type);
        }

        if (filtered.length === 0) return undefined;

        return filtered[Math.floor(Math.random() * filtered.length)];
      },

      getUncompletedCount: () => {
        const { completedExercises } = get();
        const completedIds = new Set(completedExercises.map((c) => c.exerciseId));
        return allExercises.filter((ex) => !completedIds.has(ex.id)).length;
      },

      getCompletedExercisesList: () => {
        const { completedExercises } = get();
        const completedIds = new Set(completedExercises.map((c) => c.exerciseId));
        return allExercises.filter((ex) => completedIds.has(ex.id));
      },
    }),
    {
      name: 'levelup-exercises',
      partialize: (state) => ({
        completedExercises: state.completedExercises,
        dailyChallenges: state.dailyChallenges,
      }),
    }
  )
);

// Export helper to get all exercises count
export const getTotalExercisesCount = () => allExercises.length;

// Export helper for category stats
export const getCategoryStats = () => {
  const categories = new Map<string, number>();
  allExercises.forEach((ex) => {
    categories.set(ex.category, (categories.get(ex.category) || 0) + 1);
  });
  return Object.fromEntries(categories);
};
