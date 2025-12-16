import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore, LEVEL_TEST_QUESTIONS } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Trophy, Star, Rocket, Target, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setOnboardingCompleted } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { levelUpCelebration } from '@/lib/confetti';

// Map path IDs to display names
const PATH_DISPLAY_NAMES: Record<string, string> = {
  'javascript-fundamentals': 'JavaScript Fundamentals',
  'algorithms-basic': 'Algorithmes de Base',
  'async-promises': 'Async & Fetch',
  'react-19-features': 'React 19 Patterns',
  'clean-code': 'Clean Code',
  'design-patterns': 'Design Patterns',
  'system-design': 'System Design',
};

export function LevelResult() {
  const { score, determinedLevel, levelResult, username } = useOnboardingStore();
  const { initializeUser } = useUserStore();
  const { setInitialLevel } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    levelUpCelebration();
  }, []);

  const handleStart = async () => {
    if (determinedLevel) {
      setIsSubmitting(true);
      const unlockedPaths = levelResult?.unlockedPaths || [];

      if (isSupabaseConfigured()) {
        // With Supabase: save level to database
        await setInitialLevel(determinedLevel, unlockedPaths);
      } else {
        // Without Supabase: use localStorage
        if (username) {
          initializeUser(username, determinedLevel, unlockedPaths);
          setOnboardingCompleted();
        }
      }

      setIsSubmitting(false);
      navigate('/dashboard');
    }
  };

  // Get icon based on level
  const getIcon = () => {
    switch (determinedLevel) {
      case 'junior':
        return Star;
      case 'mid':
        return Rocket;
      case 'senior':
        return Trophy;
      default:
        return Target;
    }
  };

  // Get badge color based on level
  const getBadgeColor = () => {
    switch (determinedLevel) {
      case 'junior':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'mid':
        return 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300';
      case 'senior':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const Icon = getIcon();
  const badgeColor = getBadgeColor();
  const color = levelResult?.color || 'from-blue-500 to-cyan-500';

  const title = levelResult?.title || 'Developer';
  const description = levelResult?.description || 'Bienvenue !';
  const unlockedPaths = levelResult?.unlockedPaths || [];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-lg shadow-xl overflow-hidden">
        <div className={cn('h-2 bg-gradient-to-r', color)} />

        <CardHeader className="text-center space-y-4 pt-8">
          <div
            className={cn(
              'mx-auto w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg',
              color
            )}
          >
            <Icon className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">Bienvenue, {username} !</p>
            <CardTitle className="text-2xl">
              Tu es{' '}
              <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', color)}>
                {title}
              </span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          <div className="flex justify-center gap-2">
            {[...Array(LEVEL_TEST_QUESTIONS.length)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  i < score ? 'bg-green-500 scale-110' : 'bg-gray-300 dark:bg-gray-600'
                )}
              />
            ))}
          </div>

          <p className="text-lg font-medium">
            Score : <span className="text-violet-600">{score}</span> / {LEVEL_TEST_QUESTIONS.length}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Parcours débloqués :</p>
            <div className="flex flex-wrap gap-2">
              {unlockedPaths.map((pathId) => (
                <Badge key={pathId} variant="secondary" className={badgeColor}>
                  {PATH_DISPLAY_NAMES[pathId] || pathId}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={isSubmitting}
            className={cn(
              'w-full h-12 text-lg bg-gradient-to-r hover:opacity-90 transition-opacity',
              color
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Commencer mon parcours
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Tu pourras débloquer plus de parcours en gagnant de l'XP
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
