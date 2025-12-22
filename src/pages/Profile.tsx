import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUserStore } from '@/stores/userStore';
import { useExerciseStore, getTotalExercisesCount } from '@/stores/exerciseStore';
import { XPBar, LevelIndicator, BadgeDisplay } from '@/components/gamification';
import {
  Calendar,
  Zap,
  Target,
  Trophy,
  Settings,
  Trash2,
  Code,
  HelpCircle,
  Eye,
  Globe,
  Flame,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Profile() {
  const user = useCurrentUser();
  const resetProgress = useUserStore((state) => state.resetProgress);
  const { completedExercises, getCompletedCountByType } = useExerciseStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleReset = () => {
    if (window.confirm('Es-tu sûr de vouloir réinitialiser ta progression ? Cette action est irréversible.')) {
      resetProgress();
      navigate('/');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate completion stats
  const totalExercises = getTotalExercisesCount();
  const completedCount = completedExercises.length;
  const completionPercent = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  // Exercise type stats
  const exerciseTypes = [
    {
      type: 'quiz' as const,
      label: 'Quiz',
      icon: HelpCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      count: getCompletedCountByType('quiz'),
    },
    {
      type: 'challenge' as const,
      label: 'Challenges',
      icon: Code,
      color: 'bg-violet-500',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      count: getCompletedCountByType('challenge'),
    },
    {
      type: 'review' as const,
      label: 'Reviews',
      icon: Eye,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      count: getCompletedCountByType('review'),
    },
    {
      type: 'fetch' as const,
      label: 'Fetch API',
      icon: Globe,
      color: 'bg-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      count: getCompletedCountByType('fetch'),
    },
  ];

  // Calculate average score
  const avgScore =
    completedExercises.length > 0
      ? Math.round(
          completedExercises.reduce((acc, e) => acc + e.score, 0) / completedExercises.length
        )
      : 0;

  // Calculate total time spent (in minutes)
  const totalTimeMinutes = Math.round(
    completedExercises.reduce((acc, e) => acc + e.timeSpent, 0) / 60
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-3xl bg-gradient-to-br from-violet-500 to-amber-500 text-white">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <div className="mt-2">
                <LevelIndicator size="md" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Membre depuis {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <XPBar />
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6 text-center">
            <Zap className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold">{user.stats.totalXP.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">XP Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/30 border-violet-200 dark:border-violet-800">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto text-violet-500 mb-2" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Exercices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{user.stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Streak actuel</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">Score moyen</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progression globale</CardTitle>
          <CardDescription>
            {completedCount} sur {totalExercises} exercices complétés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Complétion totale</span>
              <span className="font-medium">{completionPercent.toFixed(1)}%</span>
            </div>
            <Progress value={completionPercent} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{user.stats.longestStreak}</p>
              <p className="text-sm text-muted-foreground">Meilleur streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{totalTimeMinutes}</p>
              <p className="text-sm text-muted-foreground">Minutes d'entraînement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par type</CardTitle>
          <CardDescription>Exercices complétés par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exerciseTypes.map(({ type, label, icon: Icon, color, bgColor, count }) => (
              <div
                key={type}
                className={cn(
                  'p-4 rounded-lg text-center',
                  bgColor
                )}
              >
                <div className={cn('w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2', color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mes badges</CardTitle>
              <CardDescription>
                {user.earnedBadges.length} badges débloqués
              </CardDescription>
            </div>
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <BadgeDisplay showAll />
        </CardContent>
      </Card>

      {/* Unlocked Paths */}
      <Card>
        <CardHeader>
          <CardTitle>Parcours débloqués</CardTitle>
          <CardDescription>
            Tes parcours d'apprentissage disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.unlockedPaths.map((path) => (
              <Badge key={path} variant="secondary" className="capitalize">
                {path.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription>
            Cette action supprimera définitivement toute ta progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleReset}>
            <Trash2 className="w-4 h-4 mr-2" />
            Réinitialiser ma progression
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
