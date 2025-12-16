import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, UserStats, UserSettings } from '@/types/database';

interface AuthState {
  // Auth state
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  stats: UserStats | null;
  settings: UserSettings | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;

  // Profile actions
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateUsername: (username: string) => Promise<{ error: string | null }>;
  setInitialLevel: (level: 'junior' | 'mid' | 'senior', unlockedPaths: string[]) => Promise<void>;

  // Data fetching
  fetchProfile: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSettings: () => Promise<void>;

  // Clear error
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  stats: null,
  settings: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      set({ isLoading: false, isInitialized: true });
      return;
    }

    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user, session });
        await get().fetchProfile();
        await get().fetchStats();
        await get().fetchSettings();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user ?? null, session });

        if (event === 'SIGNED_IN' && session?.user) {
          await get().fetchProfile();
          await get().fetchStats();
          await get().fetchSettings();
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null, stats: null, settings: null });
        }
      });

      set({ isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false, isInitialized: true, error: 'Erreur de connexion' });
    }
  },

  signUp: async (email, password, username) => {
    set({ isLoading: true, error: null });

    try {
      // Check if username is available
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        set({ isLoading: false });
        return { error: 'Ce nom d\'utilisateur est déjà pris' };
      }

      // Sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error: translateAuthError(error.message) };
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
      }

      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: 'Une erreur est survenue' };
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error: translateAuthError(error.message) };
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
        await get().fetchProfile();
        await get().fetchStats();
        await get().fetchSettings();
      }

      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: 'Une erreur est survenue' };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      profile: null,
      stats: null,
      settings: null,
      isLoading: false,
    });
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      set({ isLoading: false });

      if (error) {
        return { error: translateAuthError(error.message) };
      }

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: 'Une erreur est survenue' };
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    const { error } = await (supabase as any)
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      }));
    }
  },

  updateUsername: async (username) => {
    const { user } = get();
    if (!user) return { error: 'Non connecté' };

    // Check if username is available
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .neq('id', user.id)
      .single();

    if (existingUser) {
      return { error: 'Ce nom d\'utilisateur est déjà pris' };
    }

    const { error } = await (supabase as any)
      .from('profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      return { error: 'Erreur lors de la mise à jour' };
    }

    set((state) => ({
      profile: state.profile ? { ...state.profile, username } : null,
    }));

    return { error: null };
  },

  setInitialLevel: async (level, unlockedPaths) => {
    const { user } = get();
    if (!user) return;

    // Update profile with initial level
    await (supabase as any)
      .from('profiles')
      .update({ initial_level: level })
      .eq('id', user.id);

    // Insert unlocked paths
    const pathInserts = unlockedPaths.map((pathId) => ({
      user_id: user.id,
      path_id: pathId,
    }));

    await (supabase as any)
      .from('unlocked_paths')
      .upsert(pathInserts, { onConflict: 'user_id,path_id' });

    await get().fetchProfile();
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      set({ profile: data });
    }
  },

  fetchStats: async () => {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      set({ stats: data });
    }
  },

  fetchSettings: async () => {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      set({ settings: data });
    }
  },

  clearError: () => set({ error: null }),
}));

// Helper to translate Supabase auth errors to French
function translateAuthError(message: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Email ou mot de passe incorrect',
    'Email not confirmed': 'Veuillez confirmer votre email',
    'User already registered': 'Un compte existe déjà avec cet email',
    'Password should be at least 6 characters': 'Le mot de passe doit faire au moins 6 caractères',
    'Unable to validate email address: invalid format': 'Format d\'email invalide',
    'Email rate limit exceeded': 'Trop de tentatives, réessayez plus tard',
  };

  return translations[message] || message;
}
