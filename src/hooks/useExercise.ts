import { useState, useCallback, useEffect } from 'react';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useUserStore } from '@/stores/userStore';
import type { Exercise, ExerciseResult } from '@/types';

interface UseExerciseOptions {
  exerciseId: string;
  autoStart?: boolean;
}

interface UseExerciseReturn {
  // Exercise data
  exercise: Exercise | undefined;
  isLoading: boolean;
  isCompleted: boolean;
  previousScore: number | null;

  // Session state
  isStarted: boolean;
  timeElapsed: number;
  currentHintIndex: number;
  showSolution: boolean;

  // Actions
  start: () => void;
  complete: (score: number, correct: boolean) => void;
  reset: () => void;
  showNextHint: () => void;
  revealSolution: () => void;

  // Navigation
  nextExercise: Exercise | undefined;
  hasNext: boolean;
}

/**
 * Hook for managing a single exercise session
 * Handles timing, hints, completion, and XP rewards
 */
export function useExercise({ exerciseId, autoStart = true }: UseExerciseOptions): UseExerciseReturn {
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);

  // Store hooks
  const {
    getExercise,
    isExerciseCompleted,
    getExerciseScore,
    completeExercise: storeCompleteExercise,
    resetExercise: storeResetExercise,
    getNextExercise,
  } = useExerciseStore();

  const { completeExercise: userCompleteExercise } = useUserStore();

  // Get exercise data
  const exercise = getExercise(exerciseId);
  const isCompleted = isExerciseCompleted(exerciseId);
  const previousScore = getExerciseScore(exerciseId);
  const nextExercise = getNextExercise(exerciseId);

  // Timer effect
  useEffect(() => {
    if (!isStarted || !startTime) return;

    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, startTime]);

  // Auto-start effect
  useEffect(() => {
    if (autoStart && exercise && !isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
  }, [autoStart, exercise, isStarted]);

  // Reset state when exercise changes
  useEffect(() => {
    setIsStarted(false);
    setStartTime(null);
    setTimeElapsed(0);
    setCurrentHintIndex(-1);
    setShowSolution(false);
  }, [exerciseId]);

  const start = useCallback(() => {
    setIsStarted(true);
    setStartTime(Date.now());
  }, []);

  const complete = useCallback(
    (score: number, correct: boolean) => {
      if (!exercise) return;

      const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

      // Calculate XP based on score and hints used
      let xpEarned = exercise.xp;

      // Reduce XP if hints were used
      if (currentHintIndex >= 0) {
        const hintPenalty = 0.1 * (currentHintIndex + 1); // 10% per hint
        xpEarned = Math.floor(xpEarned * (1 - hintPenalty));
      }

      // Reduce XP if solution was revealed
      if (showSolution) {
        xpEarned = Math.floor(xpEarned * 0.25); // 75% penalty
      }

      // Reduce XP for incorrect answers
      if (!correct) {
        xpEarned = Math.floor(xpEarned * 0.5);
      }

      // Ensure minimum XP
      xpEarned = Math.max(1, xpEarned);

      const result: ExerciseResult = {
        exerciseId,
        completed: true,
        score,
        xpEarned,
        timeSpent,
        attempts: 1,
        completedAt: new Date(),
      };

      // Update both stores
      storeCompleteExercise(exerciseId, score, timeSpent);
      userCompleteExercise(result);

      setIsStarted(false);
    },
    [exercise, exerciseId, startTime, currentHintIndex, showSolution, storeCompleteExercise, userCompleteExercise]
  );

  const reset = useCallback(() => {
    storeResetExercise(exerciseId);
    setIsStarted(false);
    setStartTime(null);
    setTimeElapsed(0);
    setCurrentHintIndex(-1);
    setShowSolution(false);
  }, [exerciseId, storeResetExercise]);

  const showNextHint = useCallback(() => {
    if (!exercise) return;

    const maxHints = 'hints' in exercise ? exercise.hints.length : 0;
    if (currentHintIndex < maxHints - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  }, [exercise, currentHintIndex]);

  const revealSolution = useCallback(() => {
    setShowSolution(true);
  }, []);

  return {
    exercise,
    isLoading: !exercise,
    isCompleted,
    previousScore,
    isStarted,
    timeElapsed,
    currentHintIndex,
    showSolution,
    start,
    complete,
    reset,
    showNextHint,
    revealSolution,
    nextExercise,
    hasNext: !!nextExercise,
  };
}

/**
 * Hook for getting daily challenge data
 */
export function useDailyChallenge() {
  const { getTodayChallenge, isDailyChallengeCompleted, completeDailyChallenge, getDailyChallengeStreak } =
    useExerciseStore();

  const todayChallenge = getTodayChallenge();
  const isCompleted = isDailyChallengeCompleted();
  const streak = getDailyChallengeStreak();

  const complete = useCallback(
    (score: number) => {
      completeDailyChallenge(score);
    },
    [completeDailyChallenge]
  );

  return {
    exercise: todayChallenge?.exercise,
    isCompleted,
    score: todayChallenge?.score,
    streak,
    complete,
  };
}
