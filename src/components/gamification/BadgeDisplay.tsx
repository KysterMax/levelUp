import { useUserStore } from '@/stores/userStore';
import { BADGES, type Badge as BadgeType, type BadgeRarity } from '@/types/gamification';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  className?: string;
  showAll?: boolean;
  maxDisplay?: number;
}

const RARITY_STYLES: Record<BadgeRarity, string> = {
  common: 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
  rare: 'bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700',
  epic: 'bg-violet-50 border-violet-300 dark:bg-violet-950 dark:border-violet-700',
  legendary: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 dark:from-amber-950 dark:to-orange-950 dark:border-amber-600',
};

function BadgeItem({ badge, earned }: { badge: BadgeType; earned: boolean }) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center p-3 rounded-xl border-2 transition-all',
        earned ? RARITY_STYLES[badge.rarity] : 'bg-gray-100 border-gray-200 opacity-40 dark:bg-gray-900 dark:border-gray-700',
        earned && 'hover:scale-105 cursor-pointer'
      )}
      title={earned ? badge.description : `${badge.name} - À débloquer`}
    >
      <span className={cn('text-3xl', !earned && 'grayscale')}>{badge.icon}</span>
      <p className={cn('text-xs font-medium mt-1 text-center', !earned && 'text-muted-foreground')}>
        {badge.name}
      </p>
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/50">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </div>
  );
}

export function BadgeDisplay({ className, showAll = false, maxDisplay = 6 }: BadgeDisplayProps) {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const earnedBadges = user.earnedBadges;

  const badgesToShow = showAll
    ? BADGES
    : BADGES.slice(0, maxDisplay);

  const earnedCount = earnedBadges.length;
  const totalCount = BADGES.length;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Badges</h3>
        <span className="text-sm text-muted-foreground">
          {earnedCount} / {totalCount}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {badgesToShow.map((badge) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            earned={earnedBadges.includes(badge.id)}
          />
        ))}
      </div>
      {!showAll && BADGES.length > maxDisplay && (
        <p className="text-center text-sm text-muted-foreground">
          +{BADGES.length - maxDisplay} autres badges à découvrir
        </p>
      )}
    </div>
  );
}
