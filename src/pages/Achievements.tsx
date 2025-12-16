import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { useExerciseStore, getTotalExercisesCount } from '@/stores/exerciseStore';
import { BADGES } from '@/types/gamification';
import type { BadgeRarity } from '@/types/gamification';
import { Trophy, Target, Flame, Zap, Star, Code, CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | BadgeRarity | 'earned' | 'locked';

export function Achievements() {
  const user = useUserStore((state) => state.user);
  const { completedExercises } = useExerciseStore();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!user) return null;

  const earnedCount = user.earnedBadges.length;
  const totalCount = BADGES.length;
  const progressPercent = (earnedCount / totalCount) * 100;

  // Calculate detailed progress
  const totalExercises = getTotalExercisesCount();
  const completedCount = completedExercises.length;

  const stats = {
    streak: { current: user.stats.currentStreak, target: 30, label: 'Streak actuel' },
    exercises: { current: completedCount, target: totalExercises, label: 'Exercices complétés' },
    xp: { current: user.stats.totalXP, target: 10000, label: 'XP gagnés' },
    level: { current: user.stats.level, target: 30, label: 'Niveau actuel' },
  };

  // Get badge progress
  const getBadgeProgress = (badge: typeof BADGES[0]) => {
    const { requirement } = badge;
    let current = 0;
    const target = requirement.value;

    switch (requirement.type) {
      case 'streak':
        current = user.stats.currentStreak;
        break;
      case 'exercises_completed':
        current = user.stats.totalExercises;
        break;
      case 'xp_earned':
        current = user.stats.totalXP;
        break;
      case 'level_reached':
        current = user.stats.level;
        break;
      case 'speed':
        // Speed badges are binary - either achieved or not
        current = 0; // Would need to track fastest completion time
        break;
      case 'perfect_score':
        current = 0; // Would need to track consecutive perfect scores
        break;
      case 'category_mastery':
        // Handle category-specific progress
        if (requirement.category === 'algorithms') {
          current = user.stats.totalChallenges;
        } else if (requirement.category === 'review') {
          current = user.stats.totalReviews;
        } else if (requirement.category === 'fetch') {
          // Count fetch exercises from completed
          current = completedExercises.filter(c => {
            // Approximate - would need exercise type lookup
            return c.exerciseId.includes('fetch');
          }).length;
        }
        break;
    }

    return { current, target, percent: Math.min((current / target) * 100, 100) };
  };

  // Filter badges
  const filteredBadges = BADGES.filter((badge) => {
    const isEarned = user.earnedBadges.includes(badge.id);
    if (filter === 'earned') return isEarned;
    if (filter === 'locked') return !isEarned;
    if (filter === 'common' || filter === 'rare' || filter === 'epic' || filter === 'legendary') {
      return badge.rarity === filter;
    }
    return true;
  });

  const RARITY_COLORS = {
    common: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    epic: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    legendary: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };

  const RARITY_BORDER = {
    common: 'border-slate-300 dark:border-slate-600',
    rare: 'border-blue-400 dark:border-blue-600',
    epic: 'border-violet-400 dark:border-violet-600',
    legendary: 'border-amber-400 dark:border-amber-600',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with big trophy */}
      <div className="text-center py-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-2">
          {earnedCount} badges sur {totalCount} débloqués
        </p>
        <div className="max-w-md mx-auto mt-4">
          <Progress value={progressPercent} className="h-3" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{stats.streak.current}</p>
            <p className="text-xs text-muted-foreground">{stats.streak.label}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto text-violet-500 mb-2" />
            <p className="text-2xl font-bold">{stats.exercises.current}</p>
            <p className="text-xs text-muted-foreground">{stats.exercises.label}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6 text-center">
            <Zap className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold">{stats.xp.current.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{stats.xp.label}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 text-center">
            <Star className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{stats.level.current}</p>
            <p className="text-xs text-muted-foreground">{stats.level.label}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tous
        </Button>
        <Button
          size="sm"
          variant={filter === 'earned' ? 'default' : 'outline'}
          onClick={() => setFilter('earned')}
          className="gap-1"
        >
          <CheckCircle className="w-3 h-3" />
          Débloqués
        </Button>
        <Button
          size="sm"
          variant={filter === 'locked' ? 'default' : 'outline'}
          onClick={() => setFilter('locked')}
          className="gap-1"
        >
          <Lock className="w-3 h-3" />
          À débloquer
        </Button>
        <div className="w-px h-6 bg-border self-center" />
        <Button
          size="sm"
          variant={filter === 'common' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('common')}
        >
          Common
        </Button>
        <Button
          size="sm"
          variant={filter === 'rare' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('rare')}
          className="text-blue-600"
        >
          Rare
        </Button>
        <Button
          size="sm"
          variant={filter === 'epic' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('epic')}
          className="text-violet-600"
        >
          Epic
        </Button>
        <Button
          size="sm"
          variant={filter === 'legendary' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('legendary')}
          className="text-amber-600"
        >
          Legendary
        </Button>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isEarned = user.earnedBadges.includes(badge.id);
          const progress = getBadgeProgress(badge);

          return (
            <Card
              key={badge.id}
              className={cn(
                'relative overflow-hidden transition-all',
                isEarned && 'ring-2 ring-green-500',
                !isEarned && 'opacity-75 hover:opacity-100',
                RARITY_BORDER[badge.rarity]
              )}
            >
              {/* Rarity indicator */}
              <div className={cn('absolute top-0 right-0 px-2 py-0.5 text-xs rounded-bl', RARITY_COLORS[badge.rarity])}>
                {badge.rarity}
              </div>

              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Badge Icon */}
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all',
                    isEarned
                      ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50'
                      : 'bg-muted grayscale'
                  )}>
                    {badge.icon}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{badge.name}</h3>
                      {isEarned && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{badge.description}</p>
                  </div>
                </div>

                {/* Progress */}
                {!isEarned && (
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{progress.current}/{progress.target}</span>
                    </div>
                    <Progress value={progress.percent} className="h-1.5" />
                  </div>
                )}

                {isEarned && (
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Débloqué !
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Aucun badge dans cette catégorie</p>
          </CardContent>
        </Card>
      )}

      {/* Motivation Card */}
      <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
        <CardContent className="py-8 text-center">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Continue comme ça !</h3>
          <p className="opacity-90 max-w-md mx-auto">
            Chaque exercice te rapproche d'un nouveau badge.
            {earnedCount < totalCount && ` Plus que ${totalCount - earnedCount} badges à débloquer !`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
