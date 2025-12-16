import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { levelUpCelebration } from '@/lib/confetti';
import { sounds } from '@/lib/sounds';
import type { Badge as BadgeType } from '@/types/gamification';

interface BadgeUnlockModalProps {
  badge: BadgeType | null;
  open: boolean;
  onClose: () => void;
}

const RARITY_COLORS = {
  common: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  epic: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  legendary: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

const RARITY_GLOW = {
  common: 'shadow-slate-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-violet-400/50',
  legendary: 'shadow-amber-400/50',
};

export function BadgeUnlockModal({ badge, open, onClose }: BadgeUnlockModalProps) {
  useEffect(() => {
    if (open && badge) {
      levelUpCelebration();
      sounds.badge();
    }
  }, [open, badge]);

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Nouveau Badge !</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6 space-y-4">
          <div
            className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl
                        bg-gradient-to-br from-amber-100 to-orange-100
                        dark:from-amber-900/50 dark:to-orange-900/50
                        shadow-lg ${RARITY_GLOW[badge.rarity]}
                        animate-pulse`}
          >
            {badge.icon}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">{badge.name}</h3>
            <Badge className={RARITY_COLORS[badge.rarity]}>{badge.rarity}</Badge>
            <p className="text-muted-foreground">{badge.description}</p>
          </div>
          <Button onClick={onClose} className="w-full mt-4">
            Super !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
