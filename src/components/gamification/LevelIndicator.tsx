import { useUserStore } from '@/stores/userStore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserLevel } from '@/types';

interface LevelIndicatorProps {
  className?: string;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LEVEL_CONFIG: Record<UserLevel, { label: string; emoji: string; color: string }> = {
  'junior-padawan': {
    label: 'Junior Padawan',
    emoji: '🌱',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  'junior-developer': {
    label: 'Junior Developer',
    emoji: '💻',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  },
  'mid-developer': {
    label: 'Mid Developer',
    emoji: '🚀',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  },
  'senior-developer': {
    label: 'Senior Developer',
    emoji: '⭐',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
  'principal-engineer': {
    label: 'Principal Engineer',
    emoji: '👑',
    color: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900 dark:to-orange-900 dark:text-amber-300',
  },
};

export function LevelIndicator({ className, showTitle = true, size = 'md' }: LevelIndicatorProps) {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const { level, title } = user.stats;
  const config = LEVEL_CONFIG[title];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          size === 'sm' && 'w-6 h-6 text-xs',
          size === 'md' && 'w-8 h-8 text-sm',
          size === 'lg' && 'w-12 h-12 text-lg',
          'bg-gradient-to-br from-violet-500 to-amber-500 text-white shadow-md'
        )}
      >
        {level}
      </div>
      {showTitle && (
        <Badge variant="secondary" className={cn(sizeClasses[size], config.color)}>
          <span className="mr-1">{config.emoji}</span>
          {config.label}
        </Badge>
      )}
    </div>
  );
}
