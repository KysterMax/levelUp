import { Progress } from '@/components/ui/progress';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getXPForNextLevel } from '@/types/user';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPBarProps {
  className?: string;
  showDetails?: boolean;
}

export function XPBar({ className, showDetails = true }: XPBarProps) {
  const user = useCurrentUser();

  if (!user) return null;

  const { current, next, progress } = getXPForNextLevel(user.stats.totalXP);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-medium">{user.stats.totalXP} XP</span>
        </div>
        {showDetails && (
          <span className="text-muted-foreground">
            {current} / {next} XP
          </span>
        )}
      </div>
      <Progress
        value={progress}
        className="h-2.5 bg-amber-100 dark:bg-amber-950"
      />
      {showDetails && (
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(next - current)} XP pour le niveau suivant
        </p>
      )}
    </div>
  );
}
