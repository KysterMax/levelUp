import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakCounter({ className, size = 'md' }: StreakCounterProps) {
  const user = useCurrentUser();

  if (!user) return null;

  const { currentStreak, longestStreak } = user.stats;
  const isOnFire = currentStreak >= 3;

  const sizeClasses = {
    sm: {
      container: 'gap-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
      subtext: 'text-xs',
    },
    md: {
      container: 'gap-2',
      icon: 'w-5 h-5',
      text: 'text-base',
      subtext: 'text-xs',
    },
    lg: {
      container: 'gap-3',
      icon: 'w-8 h-8',
      text: 'text-2xl',
      subtext: 'text-sm',
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className={cn('flex items-center', styles.container, className)}>
      <div
        className={cn(
          'relative',
          isOnFire && 'animate-pulse'
        )}
      >
        <Flame
          className={cn(
            styles.icon,
            currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
          )}
        />
        {isOnFire && (
          <Flame
            className={cn(
              'absolute inset-0 text-red-500 opacity-50 blur-sm',
              styles.icon
            )}
          />
        )}
      </div>
      <div>
        <p className={cn('font-bold', styles.text)}>
          {currentStreak} <span className="font-normal text-muted-foreground">jours</span>
        </p>
        {size !== 'sm' && longestStreak > 0 && (
          <p className={cn('text-muted-foreground flex items-center gap-1', styles.subtext)}>
            <Calendar className="w-3 h-3" />
            Record : {longestStreak}
          </p>
        )}
      </div>
    </div>
  );
}
