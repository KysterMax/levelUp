import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Star, Clock, Sparkles, CheckCircle, Code, HelpCircle, Eye, Globe, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
  quiz: HelpCircle,
  challenge: Code,
  review: Eye,
  fetch: Globe,
};

const TYPE_LABELS = {
  quiz: 'Quiz',
  challenge: 'Code Challenge',
  review: 'Code Review',
  fetch: 'Fetch API',
};

export function DailyChallenge() {
  const getTodayChallenge = useExerciseStore((state) => state.getTodayChallenge);
  const getDailyChallengeStreak = useExerciseStore((state) => state.getDailyChallengeStreak);

  const challenge = getTodayChallenge();
  const streak = getDailyChallengeStreak();

  if (!challenge) return null;

  const { exercise, completed, score } = challenge;
  const bonusXP = Math.round(exercise.xp * 0.5); // 50% bonus XP
  const totalXP = exercise.xp + bonusXP;

  const Icon = TYPE_ICONS[exercise.type];

  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      completed
        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30'
        : 'border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30'
    )}>
      {/* Decorative top with sparkles */}
      <div className={cn(
        'h-1.5 bg-gradient-to-r',
        completed ? 'from-green-500 to-emerald-500' : 'from-amber-500 via-orange-500 to-amber-500'
      )} />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              completed ? 'bg-green-500' : 'bg-gradient-to-br from-amber-500 to-orange-500'
            )}>
              {completed ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <Star className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Challenge du Jour
                {!completed && <Sparkles className="w-4 h-4 text-amber-500" />}
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <Badge variant="outline" className="gap-1 border-orange-300 text-orange-600">
                <Flame className="w-3 h-3" />
                {streak}
              </Badge>
            )}
            <Badge className={cn(
              'gap-1',
              completed
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
            )}>
              {completed ? `${score}%` : `+${totalXP} XP`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Exercise Info */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            exercise.difficulty === 'junior' && 'bg-blue-100 dark:bg-blue-900/50',
            exercise.difficulty === 'mid' && 'bg-violet-100 dark:bg-violet-900/50',
            exercise.difficulty === 'senior' && 'bg-amber-100 dark:bg-amber-900/50'
          )}>
            <Icon className={cn(
              'w-5 h-5',
              exercise.difficulty === 'junior' && 'text-blue-600 dark:text-blue-400',
              exercise.difficulty === 'mid' && 'text-violet-600 dark:text-violet-400',
              exercise.difficulty === 'senior' && 'text-amber-600 dark:text-amber-400'
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{exercise.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {exercise.description}
            </p>
          </div>
        </div>

        {/* Tags and difficulty */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {TYPE_LABELS[exercise.type]}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                'text-xs',
                exercise.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
                exercise.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
                exercise.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
              )}
            >
              {exercise.difficulty}
            </Badge>
          </div>
          {!completed && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Bonus +{bonusXP} XP</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {completed ? (
          <div className="text-center py-2">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Challenge complété aujourd'hui !
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Reviens demain pour un nouveau défi
            </p>
          </div>
        ) : (
          <Link to={`/exercise/id/${exercise.id}?daily=true`}>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Star className="w-4 h-4 mr-2" />
              Relever le défi
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
