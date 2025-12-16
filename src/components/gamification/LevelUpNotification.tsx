import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { levelUpCelebration } from '@/lib/confetti';
import { useUserStore } from '@/stores/userStore';
import { sounds } from '@/lib/sounds';
import { Star, Sparkles } from 'lucide-react';

export function LevelUpNotification() {
  const user = useUserStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [displayedLevel, setDisplayedLevel] = useState<number | null>(null);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize on first render
    if (previousLevel === null) {
      setPreviousLevel(user.stats.level);
      return;
    }

    // Check if level increased
    if (user.stats.level > previousLevel) {
      setDisplayedLevel(user.stats.level);
      setOpen(true);
      levelUpCelebration();
      sounds.levelUp();
      setPreviousLevel(user.stats.level);
    }
  }, [user?.stats.level, previousLevel]);

  if (!displayedLevel) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Level Up !
            <Sparkles className="w-6 h-6 text-amber-500" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-5xl font-bold text-white">{displayedLevel}</span>
            </div>
            <div className="absolute -top-2 -right-2">
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-spin-slow" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {user?.stats.title && (
                <span className="capitalize">{user.stats.title.replace('-', ' ')}</span>
              )}
            </h3>
            <p className="text-muted-foreground">
              Tu as atteint le niveau {displayedLevel} !
            </p>
          </div>

          <Button onClick={() => setOpen(false)} className="w-full mt-4">
            Continue ton ascension !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
