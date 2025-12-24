import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUserStore } from '@/stores/userStore';
import { BADGES } from '@/types/gamification';
import type { Badge } from '@/types/gamification';

/**
 * Hook that checks and unlocks badges automatically based on user stats.
 * Should be used in a component that's always mounted (like MainLayout).
 */
export function useBadgeChecker() {
  const user = useCurrentUser();
  const earnBadge = useUserStore((state) => state.earnBadge);

  // Track badges we've already processed in this session to prevent duplicates
  const processedBadgesRef = useRef<Set<string>>(new Set());
  // Track if we're currently processing to prevent race conditions
  const isProcessingRef = useRef(false);

  const checkBadges = useCallback(() => {
    if (!user || isProcessingRef.current) return;

    isProcessingRef.current = true;

    const earnedBadges = new Set(user.earnedBadges);
    const stats = user.stats;

    // Check each badge
    BADGES.forEach((badge) => {
      // Skip already earned badges
      if (earnedBadges.has(badge.id)) {
        processedBadgesRef.current.add(badge.id);
        return;
      }

      // Skip badges we've already processed in this session
      if (processedBadgesRef.current.has(badge.id)) return;

      const isUnlocked = checkBadgeRequirement(badge, stats);

      if (isUnlocked) {
        // Mark as processed BEFORE calling earnBadge to prevent duplicates
        processedBadgesRef.current.add(badge.id);
        earnBadge(badge.id);

        // Show toast notification for new badge
        showBadgeNotification(badge);
      }
    });

    isProcessingRef.current = false;
  }, [user, earnBadge]);

  useEffect(() => {
    checkBadges();
  }, [checkBadges]);
}

/**
 * Check if a badge requirement is met based on user stats
 */
function checkBadgeRequirement(
  badge: Badge,
  stats: {
    currentStreak: number;
    longestStreak: number;
    totalExercises: number;
    totalXP: number;
    level: number;
    fastestExerciseTime: number;
    consecutivePerfectScores: number;
    bestPerfectStreak: number;
    totalChallenges: number;
    totalReviews: number;
    totalFetchExercises: number;
  }
): boolean {
  const { requirement } = badge;

  switch (requirement.type) {
    case 'streak':
      // Check both current and longest streak
      return stats.currentStreak >= requirement.value || stats.longestStreak >= requirement.value;

    case 'exercises_completed':
      return stats.totalExercises >= requirement.value;

    case 'xp_earned':
      return stats.totalXP >= requirement.value;

    case 'level_reached':
      return stats.level >= requirement.value;

    case 'speed':
      // Speed badge: completed an exercise in under X seconds
      // fastestExerciseTime is 0 if never tracked, so we need > 0 check
      return stats.fastestExerciseTime > 0 && stats.fastestExerciseTime <= requirement.value;

    case 'perfect_score':
      // Perfect score streak badge
      return stats.bestPerfectStreak >= requirement.value;

    case 'category_mastery':
      // Check category-specific completion counts
      if (requirement.category === 'algorithms') {
        return stats.totalChallenges >= requirement.value;
      } else if (requirement.category === 'review') {
        return stats.totalReviews >= requirement.value;
      } else if (requirement.category === 'fetch') {
        return stats.totalFetchExercises >= requirement.value;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Show a toast notification for a newly earned badge
 */
function showBadgeNotification(badge: Badge) {
  const rarityColors = {
    common: '🎖️',
    rare: '💎',
    epic: '🌟',
    legendary: '👑',
  };

  const rarityEmoji = rarityColors[badge.rarity];

  // Use badge ID as toast ID to prevent duplicate notifications
  toast.success(
    `${rarityEmoji} Nouveau badge débloqué !`,
    {
      id: `badge-${badge.id}`,
      description: `${badge.icon} ${badge.name} - ${badge.description}`,
      duration: 5000,
    }
  );
}

/**
 * Get badge progress for display
 */
export function getBadgeProgress(
  badge: Badge,
  stats: {
    currentStreak: number;
    totalExercises: number;
    totalXP: number;
    level: number;
    fastestExerciseTime: number;
    bestPerfectStreak: number;
    totalChallenges: number;
    totalReviews: number;
    totalFetchExercises: number;
  }
): { current: number; target: number; percent: number } {
  const { requirement } = badge;
  let current = 0;
  const target = requirement.value;

  switch (requirement.type) {
    case 'streak':
      current = stats.currentStreak;
      break;
    case 'exercises_completed':
      current = stats.totalExercises;
      break;
    case 'xp_earned':
      current = stats.totalXP;
      break;
    case 'level_reached':
      current = stats.level;
      break;
    case 'speed':
      // For speed badges, show 1 if achieved, 0 otherwise
      current = stats.fastestExerciseTime > 0 && stats.fastestExerciseTime <= requirement.value ? 1 : 0;
      return { current, target: 1, percent: current * 100 };
    case 'perfect_score':
      current = stats.bestPerfectStreak;
      break;
    case 'category_mastery':
      if (requirement.category === 'algorithms') {
        current = stats.totalChallenges;
      } else if (requirement.category === 'review') {
        current = stats.totalReviews;
      } else if (requirement.category === 'fetch') {
        current = stats.totalFetchExercises;
      }
      break;
  }

  return {
    current,
    target,
    percent: Math.min((current / target) * 100, 100),
  };
}
