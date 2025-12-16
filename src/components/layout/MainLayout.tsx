import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { XPBar, LevelIndicator, StreakCounter, LevelUpNotification } from '@/components/gamification';
import { Home, BookOpen, Trophy, User, Menu, X, BarChart3, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Accueil', icon: Home },
  { path: '/learn', label: 'Apprendre', icon: BookOpen },
  { path: '/leaderboard', label: 'Classement', icon: Crown },
  { path: '/statistics', label: 'Stats', icon: BarChart3 },
  { path: '/achievements', label: 'Succès', icon: Trophy },
  { path: '/profile', label: 'Profil', icon: User },
];

export function MainLayout({ children }: MainLayoutProps) {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Level Up Notification */}
      <LevelUpNotification />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">LevelUp.dev</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button
                    variant={location.pathname === path ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* User Stats */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:block">
                <StreakCounter size="sm" />
              </div>
              <LevelIndicator size="sm" showTitle={false} />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* XP Bar - Desktop */}
          <div className="hidden md:block pb-3">
            <XPBar showDetails={false} />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-2 space-y-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === path ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="container mx-auto px-4 pb-3">
              <XPBar />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                location.pathname === path
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </div>
  );
}
