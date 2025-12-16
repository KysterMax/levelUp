import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Rocket, Code, Trophy, Zap } from 'lucide-react';

export function WelcomeScreen() {
  const [name, setName] = useState('');
  const { setUsername, startTest } = useOnboardingStore();
  const profile = useAuthStore((state) => state.profile);

  // Get username from Supabase profile if available
  const supabaseUsername = profile?.username || '';
  const isSupabaseMode = isSupabaseConfigured();

  // Set name from Supabase profile
  useEffect(() => {
    if (isSupabaseMode && supabaseUsername) {
      setName(supabaseUsername);
    }
  }, [isSupabaseMode, supabaseUsername]);

  const handleStart = () => {
    const finalName = isSupabaseMode ? supabaseUsername : name.trim();
    if (finalName) {
      setUsername(finalName);
      startTest();
    }
  };

  const features = [
    { icon: Code, title: 'Exercices Pratiques', description: 'Quiz, challenges de code, code review' },
    { icon: Zap, title: 'Algorithmes & Fetch', description: 'Tri, recherche, appels API' },
    { icon: Trophy, title: 'Gamification', description: 'XP, badges, streaks, niveaux' },
    { icon: Rocket, title: 'Progression', description: 'De Junior à Senior Developer' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">🚀</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-amber-600 bg-clip-text text-transparent">
            LevelUp.dev
          </CardTitle>
          <CardDescription className="text-lg">
            Passe de Junior à Senior avec des exercices gamifiés
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Icon className="w-5 h-5 text-violet-500 mb-2" />
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>

          {/* Only show username input if not using Supabase */}
          {!isSupabaseMode && (
            <div className="space-y-3">
              <label htmlFor="username" className="text-sm font-medium">
                Comment tu t'appelles ?
              </label>
              <input
                id="username"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton pseudo..."
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                autoFocus
              />
            </div>
          )}

          {/* Show welcome message when using Supabase */}
          {isSupabaseMode && supabaseUsername && (
            <div className="text-center py-2">
              <p className="text-lg">
                Bienvenue, <span className="font-semibold text-violet-600">{supabaseUsername}</span> !
              </p>
            </div>
          )}

          <Button
            onClick={handleStart}
            disabled={isSupabaseMode ? !supabaseUsername : !name.trim()}
            className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600"
          >
            Commencer le test de niveau
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            3 questions pour déterminer ton niveau de départ
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
