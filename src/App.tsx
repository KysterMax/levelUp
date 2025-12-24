import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { MainLayout } from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

// Lazy load pages for code splitting
const Auth = lazy(() => import('@/pages/Auth').then(m => ({ default: m.Auth })));
const Onboarding = lazy(() => import('@/pages/Onboarding').then(m => ({ default: m.Onboarding })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Learn = lazy(() => import('@/pages/Learn').then(m => ({ default: m.Learn })));
const PathDetail = lazy(() => import('@/pages/PathDetail').then(m => ({ default: m.PathDetail })));
const Exercise = lazy(() => import('@/pages/Exercise').then(m => ({ default: m.Exercise })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const Achievements = lazy(() => import('@/pages/Achievements').then(m => ({ default: m.Achievements })));
const Statistics = lazy(() => import('@/pages/Statistics').then(m => ({ default: m.Statistics })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));
const Series = lazy(() => import('@/pages/Series').then(m => ({ default: m.Series })));
const Leaderboard = lazy(() => import('@/pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then(m => ({ default: m.ResetPassword })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}

// Custom hook to check if user is authenticated (works with both localStorage and Supabase)
function useIsAuthenticated() {
  const localUser = useUserStore((state) => state.user);
  const supabaseUser = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  if (isSupabaseConfigured()) {
    // With Supabase: need user + profile (profile indicates onboarding completed)
    return { isAuthenticated: !!supabaseUser, hasCompletedOnboarding: !!profile?.initial_level };
  }

  // Without Supabase: use localStorage
  return { isAuthenticated: !!localUser, hasCompletedOnboarding: !!localUser };
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCompletedOnboarding } = useIsAuthenticated();

  if (!isAuthenticated) {
    // Redirect to auth if Supabase is configured, otherwise to onboarding
    return <Navigate to={isSupabaseConfigured() ? '/auth' : '/'} replace />;
  }

  if (isSupabaseConfigured() && !hasCompletedOnboarding) {
    // User is logged in but hasn't completed onboarding
    return <Navigate to="/onboarding" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

function App() {
  const localUser = useUserStore((state) => state.user);
  const { user: supabaseUser, profile, isInitialized, initialize } = useAuthStore();

  // Initialize Supabase auth on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      initialize();
    }
  }, [initialize]);

  // Show loader while Supabase is initializing
  if (isSupabaseConfigured() && !isInitialized) {
    return <PageLoader />;
  }

  // Determine if user should access protected routes
  const isAuthenticated = isSupabaseConfigured() ? !!supabaseUser : !!localUser;
  const hasCompletedOnboarding = isSupabaseConfigured() ? !!profile?.initial_level : !!localUser;

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth page - only when Supabase is configured */}
          {isSupabaseConfigured() && (
            <>
              <Route
                path="/auth"
                element={isAuthenticated ? <Navigate to={hasCompletedOnboarding ? '/dashboard' : '/onboarding'} replace /> : <Auth />}
              />
              <Route path="/reset-password" element={<ResetPassword />} />
            </>
          )}

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              isSupabaseConfigured()
                ? (isAuthenticated ? (hasCompletedOnboarding ? <Navigate to="/dashboard" replace /> : <Onboarding />) : <Navigate to="/auth" replace />)
                : (localUser ? <Navigate to="/dashboard" replace /> : <Onboarding />)
            }
          />

          {/* Root route */}
          <Route
            path="/"
            element={
              isSupabaseConfigured()
                ? <Navigate to={isAuthenticated ? (hasCompletedOnboarding ? '/dashboard' : '/onboarding') : '/auth'} replace />
                : (localUser ? <Navigate to="/dashboard" replace /> : <Onboarding />)
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:pathId"
            element={
              <ProtectedRoute>
                <PathDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/:type"
            element={
              <ProtectedRoute>
                <Exercise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/id/:id"
            element={
              <ProtectedRoute>
                <Exercise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/series/:seriesId?"
            element={
              <ProtectedRoute>
                <Series />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
