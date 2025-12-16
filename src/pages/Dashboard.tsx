import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageTransition, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/animated';
import { useUserStore } from '@/stores/userStore';
import { useExerciseStore, getTotalExercisesCount } from '@/stores/exerciseStore';
import { StreakCounter, LevelIndicator, BadgeDisplay, DailyGoal, DailyChallenge } from '@/components/gamification';
import { getXPForNextLevel } from '@/types/user';
import { BookOpen, Code, Eye, Zap, ArrowRight, Target, Globe, Dumbbell, Flame, Play } from 'lucide-react';
import { SERIES_PRESETS } from '@/types/gamification';
import { cn } from '@/lib/utils';
import type { Difficulty, ExerciseCategory } from '@/types';

const QUICK_ACTIONS = [
  {
    id: 'quiz',
    title: 'Quiz Rapide',
    description: 'Test tes connaissances',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    xp: '+10 XP',
  },
  {
    id: 'challenge',
    title: 'Code Challenge',
    description: 'Résous un défi algo',
    icon: Code,
    color: 'from-violet-500 to-purple-500',
    xp: '+25 XP',
  },
  {
    id: 'fetch',
    title: 'Fetch API',
    description: 'Appels API REST',
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    xp: '+20 XP',
  },
  {
    id: 'review',
    title: 'Code Review',
    description: 'Trouve les bugs',
    icon: Eye,
    color: 'from-amber-500 to-orange-500',
    xp: '+20 XP',
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
  {
    id: 'react-19-features',
    title: 'React 19 Patterns',
    description: 'Nouveaux hooks et patterns 2025',
    progress: 0,
    total: 18,
    difficulty: 'mid',
  },
];

export function Dashboard() {
  const user = useUserStore((state) => state.user);
  const { getExercises, completedExercises } = useExerciseStore();

  if (!user) return null;

  const { progress: xpProgress } = getXPForNextLevel(user.stats.totalXP);

  // Get real progress for learning paths
  const getPathProgress = (pathId: ExerciseCategory) => {
    const exercises = getExercises({ category: pathId });
    const completed = completedExercises.filter((c) =>
      exercises.some((e) => e.id === c.exerciseId)
    );
    return { completed: completed.length, total: exercises.length };
  };

  return (
    <PageTransition className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Salut, {user.username} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Prêt à monter en compétences aujourd'hui ?
          </p>
        </div>
        <LevelIndicator size="lg" />
      </div>

      {/* Daily Goal + Stats Row */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Goal - Takes 1 column on large screens */}
        <StaggerItem>
          <DailyGoal />
        </StaggerItem>

        {/* Stats Overview - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        <StaggerItem>
        <HoverScale>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold text-amber-500">{user.stats.totalXP}</p>
              </div>
              <Zap className="w-8 h-8 text-amber-500 opacity-50" />
            </div>
            <Progress value={xpProgress} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
        </HoverScale>
        </StaggerItem>

        <StaggerItem>
        <HoverScale>
        <Card>
          <CardContent className="pt-6">
            <StreakCounter size="lg" />
          </CardContent>
        </Card>
        </HoverScale>
        </StaggerItem>

        <StaggerItem>
        <HoverScale>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exercices</p>
                <p className="text-2xl font-bold">{user.stats.totalExercises}</p>
              </div>
              <Target className="w-8 h-8 text-violet-500 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {user.stats.totalQuizzes} quiz · {user.stats.totalChallenges} challenges
            </p>
          </CardContent>
        </Card>
        </HoverScale>
        </StaggerItem>

        <StaggerItem>
        <HoverScale>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <p className="text-2xl font-bold">{user.stats.level}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 capitalize">
              {user.stats.title.replace('-', ' ')}
            </p>
          </CardContent>
        </Card>
        </HoverScale>
        </StaggerItem>
        </div>
      </StaggerContainer>

      {/* Daily Challenge + Quick Actions Row */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Challenge */}
        <StaggerItem>
          <DailyChallenge />
        </StaggerItem>

        {/* Quick Actions */}
        <StaggerItem className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.id} to={`/exercise/${action.id}`}>
                <HoverScale scale={1.03}>
                <Card className="group hover:shadow-md transition-all cursor-pointer overflow-hidden">
                  <div className={cn('h-1 bg-gradient-to-r', action.color)} />
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                          action.color
                        )}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="secondary">{action.xp}</Badge>
                    </div>
                    <h3 className="font-semibold mt-3 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
                </HoverScale>
              </Link>
            );
          })}
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Series Workouts */}
      <StaggerItem>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Séries d'entraînement</h2>
          </div>
          <Link to="/series">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERIES_PRESETS.slice(0, 3).map((series) => (
            <HoverScale key={series.id}>
              <Link to={`/series/${series.id}`}>
                <Card className="group cursor-pointer hover:shadow-md transition-all h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {series.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {series.description}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 shrink-0">
                        +{series.xpBonus} XP
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span>{series.exerciseCount} exercices</span>
                      </div>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        <Play className="w-3 h-3 mr-1" />
                        Go
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </HoverScale>
          ))}
        </div>
      </StaggerItem>

      {/* Learning Paths */}
      <StaggerContainer>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Parcours d'apprentissage</h2>
          <Link to="/learn">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_PATHS.filter((path) => user.unlockedPaths.includes(path.id)).map((path) => {
            const progress = getPathProgress(path.id as ExerciseCategory);
            const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
            return (
              <StaggerItem key={path.id}>
              <Link to={`/learn/${path.id}`}>
                <HoverScale>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{path.title}</CardTitle>
                      <Badge
                        className={cn(
                          path.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
                          path.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
                          path.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
                        )}
                      >
                        {path.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                </HoverScale>
              </Link>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>

      {/* Training Mode Section */}
      <StaggerItem>
      <HoverScale>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-base">Mode Entraînement</CardTitle>
            </div>
            <Badge variant="secondary">
              {completedExercises.length}/{getTotalExercisesCount()} complétés
            </Badge>
          </div>
          <CardDescription>
            Refais les exercices que tu as déjà terminés pour t'améliorer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedExercises.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { type: 'quiz', label: 'Quiz', icon: Zap, color: 'from-blue-500 to-cyan-500' },
                { type: 'challenge', label: 'Challenges', icon: Code, color: 'from-violet-500 to-purple-500' },
                { type: 'fetch', label: 'Fetch API', icon: Globe, color: 'from-green-500 to-emerald-500' },
                { type: 'review', label: 'Code Review', icon: Eye, color: 'from-amber-500 to-orange-500' },
              ].map((item) => {
                const Icon = item.icon;
                const completedOfType = completedExercises.filter((c) => {
                  const exercise = getExercises({ type: item.type as 'quiz' | 'challenge' | 'fetch' | 'review' }).find(e => e.id === c.exerciseId);
                  return !!exercise;
                }).length;

                if (completedOfType === 0) return null;

                return (
                  <Link key={item.type} to={`/exercise/${item.type}?training=true`}>
                    <div className="group p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer">
                      <div className={cn(
                        'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2',
                        item.color
                      )}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {completedOfType} disponible{completedOfType > 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Complète des exercices pour débloquer l'entraînement</p>
            </div>
          )}
        </CardContent>
      </Card>
      </HoverScale>
      </StaggerItem>

      {/* Badges Preview */}
      <StaggerItem>
      <HoverScale>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Mes badges</CardTitle>
            <Link to="/achievements">
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <BadgeDisplay maxDisplay={6} />
        </CardContent>
      </Card>
      </HoverScale>
      </StaggerItem>
    </PageTransition>
  );
}
