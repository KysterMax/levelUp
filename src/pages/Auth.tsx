import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock, User, Github, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getLocalUserData, migrateLocalDataToSupabase } from '@/lib/syncLocalData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGitHub, resetPassword, isLoading, user, profile, fetchProfile, fetchStats, fetchSettings } = useAuthStore();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  // Handle OAuth callback - check for access_token in hash or code in query
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const queryParams = new URLSearchParams(location.search);

      // Check if this is an OAuth callback
      if (hashParams.has('access_token') || queryParams.has('code')) {
        setIsProcessingOAuth(true);

        try {
          // Supabase will automatically handle the OAuth token from the URL
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error('OAuth callback error:', error);
            toast.error('Erreur lors de la connexion avec GitHub');
            setIsProcessingOAuth(false);
            return;
          }

          if (session?.user) {
            // Fetch user data
            await fetchProfile();
            await fetchStats();
            await fetchSettings();

            toast.success('Connexion avec GitHub réussie !');

            // Redirect based on profile status
            const currentProfile = useAuthStore.getState().profile;
            if (currentProfile?.initial_level) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/onboarding', { replace: true });
            }
          }
        } catch (err) {
          console.error('OAuth processing error:', err);
          toast.error('Erreur lors du traitement de l\'authentification');
        }

        setIsProcessingOAuth(false);
      }
    };

    handleOAuthCallback();
  }, [location, navigate, fetchProfile, fetchStats, fetchSettings]);

  // If already authenticated, redirect
  useEffect(() => {
    if (user && !isProcessingOAuth) {
      if (profile?.initial_level) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, profile, navigate, isProcessingOAuth]);

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMigrationOffer, setShowMigrationOffer] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  const localData = getLocalUserData();

  const handleGitHubLogin = async () => {
    const { error } = await signInWithGitHub();
    if (error) {
      toast.error(error);
    }
  };

  const handleMigration = async (shouldMigrate: boolean) => {
    if (shouldMigrate && pendingUserId) {
      setIsMigrating(true);
      const result = await migrateLocalDataToSupabase(pendingUserId);
      setIsMigrating(false);

      if (result.success && result.migrated) {
        toast.success(`Migration réussie ! ${result.migrated.xp} XP, ${result.migrated.exercises} exercices récupérés`);
      } else {
        toast.error(result.error || 'Erreur lors de la migration');
      }
    }

    setShowMigrationOffer(false);
    setPendingUserId(null);
    navigate('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Connexion réussie !');

      if (localData.hasData) {
        const user = useAuthStore.getState().user;
        if (user) {
          setPendingUserId(user.id);
          setShowMigrationOffer(true);
          return;
        }
      }

      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    if (username.length < 3) {
      toast.error('Le nom d\'utilisateur doit faire au moins 3 caractères');
      return;
    }

    const { error } = await signUp(email, password, username);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Compte créé ! Vérifie tes emails pour confirmer ton compte.');
      setMode('login');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await resetPassword(email);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Email de réinitialisation envoyé !');
      setMode('login');
    }
  };

  // Show loading state while processing OAuth
  if (isProcessingOAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Github className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Connexion en cours...</h2>
            <p className="text-muted-foreground text-sm mt-1">Authentification avec GitHub</p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      </div>
    );
  }

  // Migration offer modal
  if (showMigrationOffer && localData.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Données locales détectées !</CardTitle>
            <CardDescription>
              Tu as des données de progression en local. Veux-tu les transférer vers ton compte ?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">XP accumulé</span>
                <span className="font-semibold text-violet-600">{localData.user.stats.totalXP} XP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exercices complétés</span>
                <span className="font-semibold">{localData.user.stats.totalExercises}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Badges gagnés</span>
                <span className="font-semibold">{localData.user.earnedBadges?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-semibold">Niveau {localData.user.stats.level}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleMigration(false)}
                disabled={isMigrating}
              >
                Non merci
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                onClick={() => handleMigration(true)}
                disabled={isMigrating}
              >
                {isMigrating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Transférer
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Les données locales seront supprimées après le transfert
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-100 to-amber-100 dark:from-violet-950 dark:to-amber-950 items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          {/* Illustration */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-violet-200 to-amber-200 dark:from-violet-900 dark:to-amber-900 rounded-full flex items-center justify-center">
              <span className="text-9xl">🚀</span>
            </div>
            {/* Floating elements */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center text-2xl animate-bounce">
              💻
            </div>
            <div className="absolute bottom-8 right-4 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-xl animate-pulse">
              ⚡
            </div>
            <div className="absolute top-1/2 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-lg">
              ✓
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Deviens un meilleur dev
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Pratique avec des exercices interactifs, gagne de l'XP et débloque des badges tout en progressant.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-600">50+</p>
              <p className="text-sm text-slate-500">Exercices</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">4</p>
              <p className="text-sm text-slate-500">Types</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">10+</p>
              <p className="text-sm text-slate-500">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-amber-600 bg-clip-text text-transparent">
              LevelUp.dev
            </h1>
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                  Bon retour !
                </h2>
                <p className="text-slate-500 mt-1">
                  Connecte-toi pour continuer ta progression
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ton@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Se connecter
                </Button>
              </form>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* GitHub Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleGitHubLogin}
                disabled={isLoading}
              >
                <Github className="w-5 h-5 mr-2" />
                Continuer avec GitHub
              </Button>

              {/* Register Link */}
              <p className="text-center text-slate-500">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-violet-600 font-medium hover:underline"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setMode('login')}
                  className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </button>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                  Créer un compte
                </h2>
                <p className="text-slate-500 mt-1">
                  Rejoins la communauté et commence à progresser
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="TonPseudo"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      minLength={3}
                      maxLength={20}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="ton@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Créer mon compte
                </Button>
              </form>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* GitHub Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleGitHubLogin}
                disabled={isLoading}
              >
                <Github className="w-5 h-5 mr-2" />
                S'inscrire avec GitHub
              </Button>
            </div>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setMode('login')}
                  className="flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </button>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                  Mot de passe oublié
                </h2>
                <p className="text-slate-500 mt-1">
                  Entre ton email pour recevoir un lien de réinitialisation
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="ton@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Envoyer le lien
                </Button>
              </form>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-slate-400">
            En créant un compte, tu acceptes nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
