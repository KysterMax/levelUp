import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Target, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { streakCelebration } from '@/lib/confetti';

interface DailyGoalProps {
  goalXP?: number;
  goalExercises?: number;
  compact?: boolean;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function DailyGoal({ goalXP = 50, goalExercises = 3, compact = false }: DailyGoalProps) {
  const user = useCurrentUser();
  const [hasAnimated, setHasAnimated] = useState(false);

  if (!user) return null;

  const today = getTodayString();
  const todayProgress = user.dailyProgress.find((p) => p.date === today);

  const xpToday = todayProgress?.xpEarned || 0;
  const exercisesToday = todayProgress?.exercisesCompleted || 0;

  const xpProgress = Math.min((xpToday / goalXP) * 100, 100);
  const exercisesProgress = Math.min((exercisesToday / goalExercises) * 100, 100);

  const goalReached = xpToday >= goalXP;

  // Trigger celebration when goal is reached
  useEffect(() => {
    if (goalReached && !hasAnimated) {
      setHasAnimated(true);
      streakCelebration();
    }
  }, [goalReached, hasAnimated]);

  // Reset animation flag at midnight
  useEffect(() => {
    const checkDate = () => {
      const currentDate = getTodayString();
      if (currentDate !== today) {
        setHasAnimated(false);
      }
    };
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [today]);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-amber-200 dark:text-amber-900"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${xpProgress}, 100`}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-500',
                goalReached ? 'text-green-500' : 'text-amber-500'
              )}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {goalReached ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Flame className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {goalReached ? 'Objectif atteint !' : 'Objectif du jour'}
          </p>
          <p className="text-xs text-muted-foreground">
            {xpToday}/{goalXP} XP
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      goalReached && 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30'
    )}>
      <div className={cn(
        'h-1 bg-gradient-to-r',
        goalReached ? 'from-green-500 to-emerald-500' : 'from-amber-500 to-orange-500'
      )} />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {goalReached ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Objectif atteint !
              </>
            ) : (
              <>
                <Target className="w-5 h-5 text-amber-500" />
                Objectif du jour
              </>
            )}
          </CardTitle>
          <Flame className={cn(
            'w-5 h-5',
            user.stats.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'
          )} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* XP Progress Circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-muted/20"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray={`${xpProgress}, 100`}
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-700 ease-out',
                  goalReached ? 'text-green-500' : 'text-amber-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Zap className={cn(
                'w-5 h-5',
                goalReached ? 'text-green-500' : 'text-amber-500'
              )} />
              <span className="text-xs font-bold">{xpToday}</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>XP aujourd'hui</span>
                <span className="font-medium">{xpToday}/{goalXP}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    goalReached ? 'bg-green-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Exercices</span>
                <span className="font-medium">{exercisesToday}/{goalExercises}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    exercisesToday >= goalExercises ? 'bg-green-500' : 'bg-violet-500'
                  )}
                  style={{ width: `${exercisesProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!goalReached && (
          <Link to="/exercise/quiz">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Continuer à gagner des XP
            </Button>
          </Link>
        )}

        {goalReached && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Reviens demain pour maintenir ton streak !</p>
            <p className="mt-1 text-xs">
              Streak actuel : <span className="font-bold text-orange-500">{user.stats.currentStreak} jours</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
