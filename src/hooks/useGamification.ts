import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { BADGES, XP_REWARDS } from '@/types/gamification';
import { LEVEL_THRESHOLDS } from '@/types/user';
import type { Badge } from '@/types/gamification';

interface XPGain {
  amount: number;
  source: string;
  timestamp: number;
}

interface UseGamificationReturn {
  // XP & Level
  currentXP: number;
  currentLevel: number;
  currentTitle: string;
  xpToNextLevel: number;
  xpProgress: number; // 0-100 percentage
  levelProgress: { current: number; next: number; percentage: number };

  // Streak
  currentStreak: number;
  longestStreak: number;
  isStreakActive: boolean;

  // Badges
  earnedBadges: Badge[];
  availableBadges: Badge[];
  nextBadge: Badge | null;
  checkAndAwardBadges: () => Badge[];

  // XP Animation
  recentXPGains: XPGain[];
  showXPGain: (amount: number, source: string) => void;
  clearXPGains: () => void;

  // Level Up Detection
  hasLeveledUp: boolean;
  newLevel: number | null;
  acknowledgeLevelUp: () => void;

  // Daily Goal
  dailyGoal: number;
  dailyProgress: number;
  isDailyGoalMet: boolean;
}

/**
 * Hook for managing gamification features
 * Tracks XP, levels, badges, streaks, and provides animation triggers
 */
export function useGamification(): UseGamificationReturn {
  const user = useUserStore((state) => state.user);
  const { earnBadge } = useUserStore();
  const { getCompletedCount, getDailyChallengeStreak } = useExerciseStore();

  // Local state for animations
  const [recentXPGains, setRecentXPGains] = useState<XPGain[]>([]);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [hasLeveledUp, setHasLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  // Current stats
  const currentXP = user?.stats.totalXP ?? 0;
  const currentLevel = user?.stats.level ?? 1;
  const currentTitle = user?.stats.title ?? 'junior-padawan';
  const currentStreak = user?.stats.currentStreak ?? 0;
  const longestStreak = user?.stats.longestStreak ?? 0;

  // Calculate XP progress to next level
  const levelProgress = useMemo(() => {
    const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel);
    const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);

    if (!currentThreshold) {
      return { current: 0, next: 100, percentage: 0 };
    }

    const currentMin = currentThreshold.minXP;
    const nextMin = nextThreshold?.minXP ?? currentMin + 500;
    const xpInLevel = currentXP - currentMin;
    const xpNeeded = nextMin - currentMin;
    const percentage = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

    return {
      current: xpInLevel,
      next: xpNeeded,
      percentage,
    };
  }, [currentXP, currentLevel]);

  const xpToNextLevel = levelProgress.next - levelProgress.current;
  const xpProgress = levelProgress.percentage;

  // Level up detection
  useEffect(() => {
    if (previousLevel === null) {
      setPreviousLevel(currentLevel);
      return;
    }

    if (currentLevel > previousLevel) {
      setHasLeveledUp(true);
      setNewLevel(currentLevel);
    }

    setPreviousLevel(currentLevel);
  }, [currentLevel, previousLevel]);

  const acknowledgeLevelUp = useCallback(() => {
    setHasLeveledUp(false);
    setNewLevel(null);
  }, []);

  // Badge management
  const earnedBadgeIds = useMemo(() => new Set(user?.earnedBadges ?? []), [user?.earnedBadges]);

  const earnedBadges = useMemo(() => {
    return BADGES.filter((b) => earnedBadgeIds.has(b.id));
  }, [earnedBadgeIds]);

  const availableBadges = useMemo(() => {
    return BADGES.filter((b) => !earnedBadgeIds.has(b.id));
  }, [earnedBadgeIds]);

  // Find next achievable badge
  const nextBadge = useMemo<Badge | null>(() => {
    const completedCount = getCompletedCount();
    const dailyStreak = getDailyChallengeStreak();

    for (const badge of availableBadges) {
      // Check different badge conditions
      if (badge.id === 'first-exercise' && completedCount >= 1) {
        return badge;
      }
      if (badge.id === 'first-streak' && currentStreak >= 3) {
        return badge;
      }
      if (badge.id === 'perfect-week' && currentStreak >= 7) {
        return badge;
      }
      if (badge.id === 'exercise-10' && completedCount >= 10) {
        return badge;
      }
      if (badge.id === 'exercise-50' && completedCount >= 50) {
        return badge;
      }
      if (badge.id === 'exercise-100' && completedCount >= 100) {
        return badge;
      }
      if (badge.id === 'daily-champion' && dailyStreak >= 30) {
        return badge;
      }
    }

    return availableBadges[0] ?? null;
  }, [availableBadges, currentStreak, getCompletedCount, getDailyChallengeStreak]);

  // Check and award badges based on current progress
  const checkAndAwardBadges = useCallback((): Badge[] => {
    const newlyEarned: Badge[] = [];
    const completedCount = getCompletedCount();
    const dailyStreak = getDailyChallengeStreak();

    const badgeConditions: Record<string, boolean> = {
      'first-exercise': completedCount >= 1,
      'first-streak': currentStreak >= 3,
      'perfect-week': currentStreak >= 7,
      'exercise-10': completedCount >= 10,
      'exercise-50': completedCount >= 50,
      'exercise-100': completedCount >= 100,
      'daily-champion': dailyStreak >= 30,
      'level-5': currentLevel >= 5,
      'level-10': currentLevel >= 10,
      'level-20': currentLevel >= 20,
    };

    for (const badge of BADGES) {
      if (earnedBadgeIds.has(badge.id)) continue;

      const condition = badgeConditions[badge.id];
      if (condition) {
        earnBadge(badge.id);
        newlyEarned.push(badge);
      }
    }

    return newlyEarned;
  }, [currentLevel, currentStreak, earnBadge, earnedBadgeIds, getCompletedCount, getDailyChallengeStreak]);

  // XP animation helpers
  const showXPGain = useCallback((amount: number, source: string) => {
    const gain: XPGain = {
      amount,
      source,
      timestamp: Date.now(),
    };
    setRecentXPGains((prev) => [...prev, gain]);

    // Auto-clear after animation
    setTimeout(() => {
      setRecentXPGains((prev) => prev.filter((g) => g.timestamp !== gain.timestamp));
    }, 2000);
  }, []);

  const clearXPGains = useCallback(() => {
    setRecentXPGains([]);
  }, []);

  // Streak status
  const isStreakActive = useMemo(() => {
    if (!user?.dailyProgress) return false;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    return user.dailyProgress.some(
      (p) => p.date === today || p.date === yesterdayStr
    );
  }, [user?.dailyProgress]);

  // Daily goal
  const dailyGoal = user?.settings.dailyGoal ?? 3;
  const dailyProgress = useMemo(() => {
    if (!user?.dailyProgress) return 0;

    const today = new Date().toISOString().split('T')[0];
    const todayProgress = user.dailyProgress.find((p) => p.date === today);
    return todayProgress?.exercisesCompleted ?? 0;
  }, [user?.dailyProgress]);

  const isDailyGoalMet = dailyProgress >= dailyGoal;

  return {
    currentXP,
    currentLevel,
    currentTitle,
    xpToNextLevel,
    xpProgress,
    levelProgress,
    currentStreak,
    longestStreak,
    isStreakActive,
    earnedBadges,
    availableBadges,
    nextBadge,
    checkAndAwardBadges,
    recentXPGains,
    showXPGain,
    clearXPGains,
    hasLeveledUp,
    newLevel,
    acknowledgeLevelUp,
    dailyGoal,
    dailyProgress,
    isDailyGoalMet,
  };
}

/**
 * Hook for calculating XP rewards
 */
export function useXPCalculator() {
  const calculateQuizXP = useCallback((correct: boolean, difficulty: string, hintsUsed: number) => {
    let base = correct ? XP_REWARDS.quiz_correct : XP_REWARDS.quiz_incorrect;

    // Difficulty multiplier
    if (difficulty === 'mid') base *= 1.2;
    if (difficulty === 'senior') base *= 1.5;

    // Hint penalty
    base *= Math.max(0.5, 1 - hintsUsed * 0.1);

    return Math.round(base);
  }, []);

  const calculateChallengeXP = useCallback(
    (passed: boolean, difficulty: string, hintsUsed: number, solutionRevealed: boolean) => {
      let base = passed ? XP_REWARDS.challenge_complete : XP_REWARDS.challenge_partial;

      // Difficulty multiplier
      if (difficulty === 'mid') base *= 1.3;
      if (difficulty === 'senior') base *= 1.6;

      // Hint penalty
      base *= Math.max(0.5, 1 - hintsUsed * 0.1);

      // Solution penalty
      if (solutionRevealed) base *= 0.25;

      return Math.round(base);
    },
    []
  );

  return {
    calculateQuizXP,
    calculateChallengeXP,
    XP_REWARDS,
  };
}
