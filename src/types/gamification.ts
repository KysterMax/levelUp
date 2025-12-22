export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  unlockedAt?: Date;

  // Requirements to unlock
  requirement: BadgeRequirement;
}

export type BadgeRequirementType =
  | 'streak'
  | 'exercises_completed'
  | 'xp_earned'
  | 'category_mastery'
  | 'speed'
  | 'perfect_score'
  | 'level_reached';

export interface BadgeRequirement {
  type: BadgeRequirementType;
  value: number;
  category?: string;
}

export interface Achievement {
  id: string;
  type: 'badge_earned' | 'level_up' | 'streak_milestone' | 'path_completed';
  title: string;
  description: string;
  xpBonus: number;
  achievedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  exerciseIds: string[];
  completed: boolean;
  xpBonus: number;
}

// Series (workout) types
export interface Series {
  id: string;
  name: string;
  description: string;
  exerciseCount: number;
  exerciseTypes: ('quiz' | 'challenge' | 'fetch' | 'review')[];
  difficulty: 'junior' | 'mid' | 'senior' | 'mixed';
  xpBonus: number; // Bonus XP for completing the series
  timeLimit?: number; // Optional time limit in seconds
}

export interface SeriesProgress {
  seriesId: string;
  exerciseIds: string[];
  currentIndex: number;
  scores: number[];
  startedAt: Date;
  completedAt?: Date;
  totalXP: number;
}

export const SERIES_PRESETS: Series[] = [
  {
    id: 'quick-warmup',
    name: 'Échauffement Rapide',
    description: '5 quiz pour te mettre en jambes',
    exerciseCount: 5,
    exerciseTypes: ['quiz'],
    difficulty: 'junior',
    xpBonus: 25,
  },
  {
    id: 'code-sprint',
    name: 'Sprint Code',
    description: '5 challenges de code variés',
    exerciseCount: 5,
    exerciseTypes: ['challenge'],
    difficulty: 'mixed',
    xpBonus: 50,
  },
  {
    id: 'api-master',
    name: 'Maître des API',
    description: '5 exercices Fetch API',
    exerciseCount: 5,
    exerciseTypes: ['fetch'],
    difficulty: 'mixed',
    xpBonus: 40,
  },
  {
    id: 'full-workout',
    name: 'Entraînement Complet',
    description: '10 exercices variés de tous types',
    exerciseCount: 10,
    exerciseTypes: ['quiz', 'challenge', 'fetch', 'review'],
    difficulty: 'mixed',
    xpBonus: 100,
  },
  {
    id: 'review-session',
    name: 'Session Review',
    description: '5 exercices de code review',
    exerciseCount: 5,
    exerciseTypes: ['review'],
    difficulty: 'mixed',
    xpBonus: 40,
  },
];

export const XP_REWARDS = {
  quiz_correct: 10,
  quiz_incorrect: 2,
  challenge_complete: 25,
  challenge_partial: 10,
  review_complete: 20,
  fetch_complete: 20,
  streak_bonus: 5,
  perfect_score_bonus: 10,
  speed_bonus: 5,
  daily_challenge_bonus: 15,
  series_completion_bonus: 25,
} as const;

export const BADGES: Badge[] = [
  {
    id: 'first-streak',
    name: 'Première Flamme',
    description: '3 jours consécutifs d\'exercices',
    icon: '🔥',
    rarity: 'common',
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'perfect-week',
    name: 'Semaine Parfaite',
    description: '7 jours de streak',
    icon: '🎯',
    rarity: 'rare',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'month-warrior',
    name: 'Guerrier du Mois',
    description: '30 jours de streak',
    icon: '⚔️',
    rarity: 'epic',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'century',
    name: 'Centurion',
    description: '100 exercices complétés',
    icon: '💪',
    rarity: 'rare',
    requirement: { type: 'exercises_completed', value: 100 },
  },
  {
    id: 'speed-demon',
    name: 'Éclair',
    description: 'Terminer un exercice en moins de 30 secondes',
    icon: '🚀',
    rarity: 'common',
    requirement: { type: 'speed', value: 30 },
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: '10 scores parfaits d\'affilée',
    icon: '✨',
    rarity: 'epic',
    requirement: { type: 'perfect_score', value: 10 },
  },
  {
    id: 'algorithm-master',
    name: 'Maître des Algos',
    description: '50 challenges d\'algorithmes',
    icon: '🧠',
    rarity: 'epic',
    requirement: { type: 'category_mastery', value: 50, category: 'algorithms' },
  },
  {
    id: 'code-reviewer',
    name: 'Œil de Lynx',
    description: '50 code reviews complétées',
    icon: '👀',
    rarity: 'rare',
    requirement: { type: 'category_mastery', value: 50, category: 'review' },
  },
  {
    id: 'api-specialist',
    name: 'Spécialiste API',
    description: '30 challenges Fetch API',
    icon: '🌐',
    rarity: 'rare',
    requirement: { type: 'category_mastery', value: 30, category: 'fetch' },
  },
  {
    id: 'senior-status',
    name: 'Statut Senior',
    description: 'Atteindre le niveau Senior Developer',
    icon: '👑',
    rarity: 'legendary',
    requirement: { type: 'level_reached', value: 21 },
  },
];
