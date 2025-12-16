import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Sun,
  Moon,
  Monitor,
  Target,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setSoundEnabled } from '@/lib/sounds';

export function Settings() {
  const user = useUserStore((state) => state.user);
  const { updateSettings, resetProgress } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  const { reset: resetOnboarding } = useOnboardingStore();
  const navigate = useNavigate();

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!user) return null;

  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    setSoundEnabled(enabled);
    toast.success(enabled ? 'Sons activés' : 'Sons désactivés');
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled });
    toast.success(enabled ? 'Notifications activées' : 'Notifications désactivées');
  };

  const handleDailyGoalChange = (value: number[]) => {
    updateSettings({ dailyGoal: value[0] });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleResetProgress = () => {
    // Clear exercise progress from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('levelup_code_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Reset user stats but keep account
    toast.success('Progression réinitialisée');
    setShowResetDialog(false);
  };

  const handleDeleteAccount = () => {
    // Clear all localStorage
    localStorage.clear();
    resetProgress();
    resetOnboarding();
    toast.success('Compte supprimé');
    setShowDeleteDialog(false);
    navigate('/');
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Clair', icon: Sun },
    { value: 'dark' as const, label: 'Sombre', icon: Moon },
    { value: 'system' as const, label: 'Système', icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Personnalise ton expérience</p>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Apparence</CardTitle>
          <CardDescription>Choisis ton thème préféré</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={theme === value ? 'default' : 'outline'}
                className={cn(
                  'flex-1 gap-2',
                  theme === value && 'ring-2 ring-primary ring-offset-2'
                )}
                onClick={() => handleThemeChange(value)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Objectif quotidien
          </CardTitle>
          <CardDescription>
            Nombre d'exercices à compléter chaque jour
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Exercices par jour</span>
            <Badge variant="secondary" className="text-lg px-3">
              {user.settings.dailyGoal}
            </Badge>
          </div>
          <Slider
            value={[user.settings.dailyGoal]}
            onValueChange={handleDailyGoalChange}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 (Facile)</span>
            <span>5 (Moyen)</span>
            <span>10 (Intense)</span>
          </div>
        </CardContent>
      </Card>

      {/* Sound & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sons & Notifications</CardTitle>
          <CardDescription>Gère les alertes et les sons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Effets sonores</p>
                <p className="text-sm text-muted-foreground">
                  Sons pour XP, level up, badges
                </p>
              </div>
            </div>
            <Switch
              checked={user.settings.soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          <div className="border-t" />

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.settings.notificationsEnabled ? (
                <Bell className="w-5 h-5 text-amber-500" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Rappels de streak quotidien
                </p>
              </div>
            </div>
            <Switch
              checked={user.settings.notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zone de danger
          </CardTitle>
          <CardDescription>
            Actions irréversibles sur ton compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Reset Progress */}
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <RotateCcw className="w-4 h-4" />
                Réinitialiser ma progression
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Réinitialiser la progression ?</DialogTitle>
                <DialogDescription>
                  Cela effacera tout ton code sauvegardé dans les exercices.
                  Ton XP, niveau et badges seront conservés.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleResetProgress}>
                  Réinitialiser
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Account */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Supprimer le compte ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Toutes tes données seront
                  définitivement supprimées : XP, niveau, badges, progression.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Supprimer définitivement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="bg-gradient-to-br from-violet-50 to-amber-50 dark:from-violet-950/30 dark:to-amber-950/30">
        <CardContent className="pt-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-violet-500 to-amber-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="font-bold">LevelUp.dev</h3>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground mt-2">
            Made with 💜 for developers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
