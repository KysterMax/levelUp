import { useMemo } from 'react';
import { useExerciseStore, getTotalExercisesCount, getCategoryStats } from '@/stores/exerciseStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { allExercises } from '@/data/exercises';
import type { Difficulty, ExerciseCategory } from '@/types';

interface CategoryProgress {
  category: ExerciseCategory;
  total: number;
  completed: number;
  percentage: number;
}

interface DifficultyProgress {
  difficulty: Difficulty;
  total: number;
  completed: number;
  percentage: number;
}

interface TypeProgress {
  type: 'quiz' | 'challenge' | 'fetch' | 'review';
  total: number;
  completed: number;
  percentage: number;
}

interface UseProgressReturn {
  // Overall progress
  totalExercises: number;
  completedExercises: number;
  overallPercentage: number;
  remainingExercises: number;

  // Progress by category
  categoryProgress: CategoryProgress[];
  getCategoryProgress: (category: ExerciseCategory) => CategoryProgress | undefined;

  // Progress by difficulty
  difficultyProgress: DifficultyProgress[];
  getDifficultyProgress: (difficulty: Difficulty) => DifficultyProgress | undefined;

  // Progress by type
  typeProgress: TypeProgress[];
  getTypeProgress: (type: 'quiz' | 'challenge' | 'fetch' | 'review') => TypeProgress | undefined;

  // Unlocked paths
  unlockedPaths: string[];
  isPathUnlocked: (pathId: string) => boolean;

  // Recent activity
  recentlyCompleted: string[]; // Exercise IDs
  dailyProgress: { date: string; exercisesCompleted: number; xpEarned: number }[];

  // Recommendations
  recommendedCategories: ExerciseCategory[];
  suggestedNextExercise: string | null;
}

/**
 * Hook for tracking and displaying user progress
 */
export function useProgress(): UseProgressReturn {
  const { completedExercises, getCompletedCount, getCompletedCountByDifficulty, getCompletedCountByType } =
    useExerciseStore();
  const user = useCurrentUser();

  const totalExercises = getTotalExercisesCount();
  const completedCount = getCompletedCount();
  const completedIds = useMemo(
    () => new Set(completedExercises.map((c) => c.exerciseId)),
    [completedExercises]
  );

  // Calculate category progress
  const categoryProgress = useMemo<CategoryProgress[]>(() => {
    const stats = getCategoryStats();
    const categories = Object.keys(stats) as ExerciseCategory[];

    return categories.map((category) => {
      const total = stats[category];
      const completed = allExercises.filter(
        (ex) => ex.category === category && completedIds.has(ex.id)
      ).length;

      return {
        category,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [completedIds]);

  // Calculate difficulty progress
  const difficultyProgress = useMemo<DifficultyProgress[]>(() => {
    const difficulties: Difficulty[] = ['junior', 'mid', 'senior'];

    return difficulties.map((difficulty) => {
      const total = allExercises.filter((ex) => ex.difficulty === difficulty).length;
      const completed = getCompletedCountByDifficulty(difficulty);

      return {
        difficulty,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [getCompletedCountByDifficulty]);

  // Calculate type progress
  const typeProgress = useMemo<TypeProgress[]>(() => {
    const types: Array<'quiz' | 'challenge' | 'fetch' | 'review'> = ['quiz', 'challenge', 'fetch', 'review'];

    return types.map((type) => {
      const total = allExercises.filter((ex) => ex.type === type).length;
      const completed = getCompletedCountByType(type);

      return {
        type,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [getCompletedCountByType]);

  // Get recently completed exercises
  const recentlyCompleted = useMemo(() => {
    return [...completedExercises]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10)
      .map((c) => c.exerciseId);
  }, [completedExercises]);

  // Recommend categories with low completion
  const recommendedCategories = useMemo<ExerciseCategory[]>(() => {
    return categoryProgress
      .filter((cp) => cp.percentage < 50 && cp.total > 0)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3)
      .map((cp) => cp.category);
  }, [categoryProgress]);

  // Suggest next exercise (uncompleted, matches user level)
  const suggestedNextExercise = useMemo<string | null>(() => {
    const userLevel = user?.initialLevel || 'junior';
    const levelOrder: Difficulty[] = ['junior', 'mid', 'senior'];
    const userLevelIndex = levelOrder.indexOf(userLevel);

    const uncompleted = allExercises.filter((ex) => {
      if (completedIds.has(ex.id)) return false;
      const exLevelIndex = levelOrder.indexOf(ex.difficulty);
      return exLevelIndex <= userLevelIndex;
    });

    if (uncompleted.length === 0) return null;

    // Prefer exercises from recommended categories
    const fromRecommended = uncompleted.filter((ex) =>
      recommendedCategories.includes(ex.category)
    );

    if (fromRecommended.length > 0) {
      return fromRecommended[Math.floor(Math.random() * fromRecommended.length)].id;
    }

    return uncompleted[Math.floor(Math.random() * uncompleted.length)].id;
  }, [completedIds, user?.initialLevel, recommendedCategories]);

  // Helper functions
  const getCategoryProgress = (category: ExerciseCategory) =>
    categoryProgress.find((cp) => cp.category === category);

  const getDifficultyProgress = (difficulty: Difficulty) =>
    difficultyProgress.find((dp) => dp.difficulty === difficulty);

  const getTypeProgress = (type: 'quiz' | 'challenge' | 'fetch' | 'review') =>
    typeProgress.find((tp) => tp.type === type);

  const isPathUnlocked = (pathId: string) =>
    user?.unlockedPaths.includes(pathId) ?? false;

  return {
    totalExercises,
    completedExercises: completedCount,
    overallPercentage: totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0,
    remainingExercises: totalExercises - completedCount,
    categoryProgress,
    getCategoryProgress,
    difficultyProgress,
    getDifficultyProgress,
    typeProgress,
    getTypeProgress,
    unlockedPaths: user?.unlockedPaths ?? [],
    isPathUnlocked,
    recentlyCompleted,
    dailyProgress: user?.dailyProgress ?? [],
    recommendedCategories,
    suggestedNextExercise,
  };
}

/**
 * Hook for getting progress on a specific learning path
 */
export function usePathProgress(pathId: string) {
  const { completedExercises } = useExerciseStore();
  const user = useCurrentUser();

  const completedIds = useMemo(
    () => new Set(completedExercises.map((c) => c.exerciseId)),
    [completedExercises]
  );

  const pathExercises = useMemo(() => {
    return allExercises.filter((ex) => ex.category === pathId);
  }, [pathId]);

  const completed = useMemo(() => {
    return pathExercises.filter((ex) => completedIds.has(ex.id)).length;
  }, [pathExercises, completedIds]);

  const isUnlocked = user?.unlockedPaths.includes(pathId) ?? false;

  return {
    pathId,
    isUnlocked,
    total: pathExercises.length,
    completed,
    percentage: pathExercises.length > 0 ? Math.round((completed / pathExercises.length) * 100) : 0,
    exercises: pathExercises,
    nextExercise: pathExercises.find((ex) => !completedIds.has(ex.id)),
  };
}
