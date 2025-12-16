import type { Difficulty, ExerciseResult } from './exercise';

export type UserLevel =
  | 'junior-padawan'
  | 'junior-developer'
  | 'mid-developer'
  | 'senior-developer'
  | 'principal-engineer';

export interface UserStats {
  totalXP: number;
  level: number;
  title: UserLevel;
  currentStreak: number;
  longestStreak: number;
  totalExercises: number;
  totalQuizzes: number;
  totalChallenges: number;
  totalReviews: number;
  averageScore: number;
}

export interface DailyProgress {
  date: string;
  xpEarned: number;
  exercisesCompleted: number;
}

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: Date;
  lastActiveAt: Date;

  // Initial level from onboarding test
  initialLevel: Difficulty;

  // Stats
  stats: UserStats;

  // Exercise progress
  exerciseResults: Record<string, ExerciseResult>;

  // Streak tracking
  dailyProgress: DailyProgress[];

  // Unlocked paths
  unlockedPaths: string[];

  // Badges earned
  earnedBadges: string[];

  // Settings
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  dailyGoal: number;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  soundEnabled: true,
  notificationsEnabled: true,
  dailyGoal: 3,
};

export const LEVEL_THRESHOLDS: { minXP: number; level: number; title: UserLevel }[] = [
  { minXP: 0, level: 1, title: 'junior-padawan' },
  { minXP: 100, level: 2, title: 'junior-padawan' },
  { minXP: 200, level: 3, title: 'junior-padawan' },
  { minXP: 350, level: 4, title: 'junior-padawan' },
  { minXP: 500, level: 5, title: 'junior-padawan' },
  { minXP: 700, level: 6, title: 'junior-developer' },
  { minXP: 900, level: 7, title: 'junior-developer' },
  { minXP: 1150, level: 8, title: 'junior-developer' },
  { minXP: 1400, level: 9, title: 'junior-developer' },
  { minXP: 1700, level: 10, title: 'junior-developer' },
  { minXP: 2000, level: 11, title: 'mid-developer' },
  { minXP: 2400, level: 12, title: 'mid-developer' },
  { minXP: 2900, level: 13, title: 'mid-developer' },
  { minXP: 3500, level: 14, title: 'mid-developer' },
  { minXP: 4200, level: 15, title: 'mid-developer' },
  { minXP: 5000, level: 16, title: 'mid-developer' },
  { minXP: 5900, level: 17, title: 'mid-developer' },
  { minXP: 6900, level: 18, title: 'mid-developer' },
  { minXP: 8000, level: 19, title: 'mid-developer' },
  { minXP: 9200, level: 20, title: 'mid-developer' },
  { minXP: 10500, level: 21, title: 'senior-developer' },
  { minXP: 12000, level: 22, title: 'senior-developer' },
  { minXP: 13600, level: 23, title: 'senior-developer' },
  { minXP: 15300, level: 24, title: 'senior-developer' },
  { minXP: 17100, level: 25, title: 'senior-developer' },
  { minXP: 19000, level: 26, title: 'senior-developer' },
  { minXP: 21000, level: 27, title: 'senior-developer' },
  { minXP: 23100, level: 28, title: 'senior-developer' },
  { minXP: 25300, level: 29, title: 'senior-developer' },
  { minXP: 27600, level: 30, title: 'senior-developer' },
  { minXP: 30000, level: 31, title: 'principal-engineer' },
];

export function getLevelFromXP(xp: number): { level: number; title: UserLevel } {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      return { level: LEVEL_THRESHOLDS[i].level, title: LEVEL_THRESHOLDS[i].title };
    }
  }
  return { level: 1, title: 'junior-padawan' };
}

export function getXPForNextLevel(currentXP: number): { current: number; next: number; progress: number } {
  const currentLevel = getLevelFromXP(currentXP);
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel.level)!;
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel.level + 1);

  if (!nextThreshold) {
    return { current: currentXP, next: currentXP, progress: 100 };
  }

  const xpInCurrentLevel = currentXP - currentThreshold.minXP;
  const xpNeededForLevel = nextThreshold.minXP - currentThreshold.minXP;
  const progress = Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);

  return {
    current: xpInCurrentLevel,
    next: xpNeededForLevel,
    progress,
  };
}
