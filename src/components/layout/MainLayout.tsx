import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useBadgeChecker } from '@/hooks/useBadgeChecker';
import { isSupabaseConfigured } from '@/lib/supabase';
import { LevelUpNotification } from '@/components/gamification';
import {
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  Crown,
  LogOut,
  Settings,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getXPForNextLevel } from '@/types/user';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/learn', label: 'Apprendre', icon: BookOpen },
  { path: '/leaderboard', label: 'Classement', icon: Crown },
  { path: '/statistics', label: 'Statistiques', icon: BarChart3 },
  { path: '/achievements', label: 'Succès', icon: Trophy },
];

export function MainLayout({ children }: MainLayoutProps) {
  const user = useCurrentUser();
  const resetProgress = useUserStore((state) => state.resetProgress);
  const signOut = useAuthStore((state) => state.signOut);
  const location = useLocation();
  const navigate = useNavigate();

  // Check and unlock badges automatically
  useBadgeChecker();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await signOut();
      navigate('/auth');
    } else {
      resetProgress();
      navigate('/');
    }
  };

  if (!user) return null;

  const { progress: xpProgress, next: xpNext, current: xpCurrent } = getXPForNextLevel(user.stats.totalXP);

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Level Up Notification */}
      <LevelUpNotification />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r lg:bg-background">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <span className="font-bold text-lg">LevelUp.dev</span>
            <p className="text-xs text-muted-foreground">Learn & Grow</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-11',
                  location.pathname === path && 'bg-primary/10 text-primary font-medium'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t space-y-4">
          {/* XP Progress */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Level {user.stats.level}</span>
              <span className="text-xs text-muted-foreground">{xpCurrent}/{xpNext} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold">{user.stats.currentStreak} jours</p>
              <p className="text-xs text-muted-foreground">Streak actuel</p>
            </div>
          </div>

          {/* User Profile Link */}
          <Link to="/profile">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-white">{user.username[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.stats.title.replace('-', ' ')}</p>
              </div>
            </div>
          </Link>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2">
            <Link to="/settings" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                Paramètres
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <span className="font-bold">LevelUp.dev</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{user.stats.currentStreak}</span>
            </div>
            <ThemeToggle />
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">{user.username[0].toUpperCase()}</span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.slice(0, 5).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0',
                location.pathname === path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
