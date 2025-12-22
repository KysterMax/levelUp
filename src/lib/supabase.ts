import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Feature flag: set to true when Supabase auth is ready
const SUPABASE_AUTH_ENABLED = true;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Running in offline mode with localStorage.'
  );
}

// Create a typed Supabase client
// When credentials are missing, we still create a client for type safety
// but isSupabaseConfigured() will return false
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);

// Helper to check if Supabase is configured and enabled
export const isSupabaseConfigured = () => {
  // Temporarily disabled - set SUPABASE_AUTH_ENABLED to true when ready
  return SUPABASE_AUTH_ENABLED && !!(supabaseUrl && supabaseAnonKey);
};
