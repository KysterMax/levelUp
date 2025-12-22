import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageTransition, HoverScale } from '@/components/ui/animated';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useExerciseStore, getTotalExercisesCount } from '@/stores/exerciseStore';
import { DailyChallenge, BadgeDisplay } from '@/components/gamification';
import { getXPForNextLevel } from '@/types/user';
import {
  BookOpen,
  Zap,
  ArrowRight,
  Target,
  Flame,
  Play,
  Calendar,
  Trophy,
  TrendingUp,
  Code,
  FileSearch,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { SERIES_PRESETS } from '@/types/gamification';
import { cn } from '@/lib/utils';
import type { Difficulty, ExerciseCategory } from '@/types';

// Exercise type action blocks
const EXERCISE_ACTIONS = [
  {
    type: 'quiz',
    label: 'Quiz',
    description: 'Teste tes connaissances',
    icon: HelpCircle,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    xp: '10 XP',
  },
  {
    type: 'challenge',
    label: 'Challenge',
    description: 'Résous des problèmes',
    icon: Code,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 dark:bg-violet-900/20',
    textColor: 'text-violet-600 dark:text-violet-400',
    xp: '25 XP',
  },
  {
    type: 'fetch',
    label: 'Fetch API',
    description: 'Appels HTTP & API',
    icon: Globe,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    xp: '20 XP',
  },
  {
    type: 'review',
    label: 'Code Review',
    description: 'Analyse du code',
    icon: FileSearch,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    xp: '20 XP',
  },
];

interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  difficulty: Difficulty;
}

const LEARNING_PATHS: LearningPathItem[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Variables, fonctions, arrays, objets',
    progress: 0,
    total: 20,
    difficulty: 'junior',
  },
  {
    id: 'algorithms-basic',
    title: 'Algorithmes de Base',
    description: 'Tri, recherche, complexité',
    progress: 0,
    total: 15,
    difficulty: 'junior',
  },
  {
    id: 'async-promises',
    title: 'Async & Fetch',
    description: 'Promises, async/await, API calls',
    progress: 0,
    total: 12,
    difficulty: 'junior',
  },
];

// Simple activity data for the week
const getWeekActivity = () => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return days.map((day, i) => ({
    day,
    value: Math.floor(Math.random() * 100),
    isToday: i === new Date().getDay() - 1,
  }));
};

export function Dashboard() {
  const user = useCurrentUser();
  const { getExercises, completedExercises } = useExerciseStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const { progress: xpProgress, next: xpNext, current: xpCurrent } = getXPForNextLevel(user.stats.totalXP);
  const weekActivity = getWeekActivity();

  const getPathProgress = (pathId: ExerciseCategory) => {
    const exercises = getExercises({ category: pathId });
    const completed = completedExercises.filter((c) =>
      exercises.some((e) => e.id === c.exerciseId)
    );
    return { completed: completed.length, total: exercises.length };
  };

  // Stats for overview
  const stats = [
    {
      label: 'XP Total',
      value: user.stats.totalXP,
      color: 'bg-amber-500',
      icon: Zap,
    },
    {
      label: 'Streak',
      value: user.stats.currentStreak,
      suffix: ' jours',
      color: 'bg-orange-500',
      icon: Flame,
    },
    {
      label: 'Exercices',
      value: user.stats.totalExercises,
      color: 'bg-emerald-500',
      icon: Target,
    },
    {
      label: 'Niveau',
      value: user.stats.level,
      color: 'bg-blue-500',
      icon: Trophy,
    },
  ];

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Hello {user.username} 👋
        </h1>
        <p className="text-muted-foreground">
          Let's learn something new today!
        </p>
      </div>

      {/* Top Row - Stats + Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        {stats.map((stat) => (
          <HoverScale key={stat.label}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow py-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-2 h-2 rounded-full', stat.color)} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">
                  {stat.value}
                  {stat.suffix && <span className="text-sm font-normal text-muted-foreground">{stat.suffix}</span>}
                </p>
              </CardContent>
            </Card>
          </HoverScale>
        ))}
      </div>

      {/* Exercise Action Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {EXERCISE_ACTIONS.map((action) => (
          <HoverScale key={action.type}>
            <Link to={`/exercise/${action.type}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden py-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0',
                      action.color
                    )}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {action.label}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Badge className={cn('text-xs', action.bgLight, action.textColor)}>
                      {action.xp}
                    </Badge>
                    <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </HoverScale>
        ))}
      </div>

      {/* Main Grid - 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Activity + Performance Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Activity Hours */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Activité</h3>
                  <Badge variant="outline" className="text-xs">Cette semaine</Badge>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                  {weekActivity.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col justify-end h-24">
                        <div
                          className={cn(
                            'w-full rounded-t-md transition-all',
                            day.isToday ? 'bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/30'
                          )}
                          style={{ height: `${Math.max(day.value, 10)}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-xs',
                        day.isToday ? 'font-bold text-blue-500' : 'text-muted-foreground'
                      )}>
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time spent</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.stats.totalExercises * 5}</span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">min</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Lessons Done</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.stats.totalExercises}</span>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">{Math.round((user.stats.totalExercises / getTotalExercisesCount()) * 100)}%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Performance</h3>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-6">
                  {/* Circular Progress */}
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${xpProgress * 2.51} 251`}
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{Math.round(xpProgress)}%</span>
                      <span className="text-xs text-muted-foreground">Level {user.stats.level}</span>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quiz</span>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{user.stats.totalQuizzes}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Challenges</span>
                      <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">{user.stats.totalChallenges}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{user.stats.totalReviews}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">XP Progress</span>
                    <span className="text-sm font-medium">{xpCurrent}/{xpNext} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Series */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Séries d'entraînement</h3>
                <Link to="/series">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Voir tout
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SERIES_PRESETS.slice(0, 3).map((series) => (
                  <HoverScale key={series.id}>
                    <Link to={`/series/${series.id}`}>
                      <div className="p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate group-hover:text-blue-500 transition-colors">
                              {series.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{series.exerciseCount} exercices</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">+{series.xpBonus} XP</Badge>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500">
                            <Play className="w-3 h-3 mr-1" />
                            Go
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </HoverScale>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Paths - Horizontal Grid */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Parcours d'apprentissage</h3>
                <Link to="/learn">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Voir tout
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEARNING_PATHS.filter((path) => user.unlockedPaths.includes(path.id)).slice(0, 3).map((path) => {
                  const progress = getPathProgress(path.id as ExerciseCategory);
                  const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                  return (
                    <HoverScale key={path.id}>
                      <Link to={`/learn/${path.id}`}>
                        <div className="p-3 rounded-lg border hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer h-full">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                              path.difficulty === 'junior' ? 'bg-blue-100 dark:bg-blue-900/30' :
                              path.difficulty === 'mid' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                            )}>
                              <BookOpen className={cn(
                                'w-4 h-4',
                                path.difficulty === 'junior' ? 'text-blue-500' :
                                path.difficulty === 'mid' ? 'text-violet-500' : 'text-amber-500'
                              )} />
                            </div>
                            <h4 className="font-medium text-sm truncate flex-1">{path.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{path.description}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercent} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground shrink-0">{progress.completed}/{progress.total}</span>
                          </div>
                        </div>
                      </Link>
                    </HoverScale>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-5">
          {/* Daily Challenge - Featured */}
          <DailyChallenge />

          {/* Calendar/Streak */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Streak Calendar</h3>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                  <div key={`day-${idx}`} className="text-center text-xs text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 28 }, (_, i) => {
                  const isActive = Math.random() > 0.5;
                  const isToday = i === new Date().getDate() - 1;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'aspect-square rounded-md flex items-center justify-center text-xs transition-colors',
                        isToday && 'ring-2 ring-primary',
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-muted/30 dark:bg-muted/10'
                      )}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-lg">
                <Flame className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-lg">{user.stats.currentStreak}</span>
                <span className="text-sm text-muted-foreground">jours de streak</span>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Badges</h3>
                <Link to="/achievements">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-500">
                    Voir tout
                  </Button>
                </Link>
              </div>
              <BadgeDisplay maxDisplay={4} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
