// Supabase Database Types
// Generated types for the LevelUp.dev database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          initial_level: 'junior' | 'mid' | 'senior';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          initial_level?: 'junior' | 'mid' | 'senior';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          initial_level?: 'junior' | 'mid' | 'senior';
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
          user_id: string;
          total_xp: number;
          level: number;
          title: string;
          current_streak: number;
          longest_streak: number;
          total_exercises: number;
          total_quizzes: number;
          total_challenges: number;
          total_reviews: number;
          last_activity_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_xp?: number;
          level?: number;
          title?: string;
          current_streak?: number;
          longest_streak?: number;
          total_exercises?: number;
          total_quizzes?: number;
          total_challenges?: number;
          total_reviews?: number;
          last_activity_date?: string | null;
          updated_at?: string;
        };
        Update: {
          total_xp?: number;
          level?: number;
          title?: string;
          current_streak?: number;
          longest_streak?: number;
          total_exercises?: number;
          total_quizzes?: number;
          total_challenges?: number;
          total_reviews?: number;
          last_activity_date?: string | null;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          sound_enabled: boolean;
          notifications_enabled: boolean;
          daily_goal: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          sound_enabled?: boolean;
          notifications_enabled?: boolean;
          daily_goal?: number;
          updated_at?: string;
        };
        Update: {
          theme?: 'light' | 'dark' | 'system';
          sound_enabled?: boolean;
          notifications_enabled?: boolean;
          daily_goal?: number;
          updated_at?: string;
        };
      };
      exercise_results: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          score: number;
          xp_earned: number;
          time_spent: number;
          attempts: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          score: number;
          xp_earned: number;
          time_spent: number;
          attempts?: number;
          completed_at?: string;
        };
        Update: {
          score?: number;
          xp_earned?: number;
          time_spent?: number;
          attempts?: number;
          completed_at?: string;
        };
      };
      daily_progress: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          xp_earned: number;
          exercises_completed: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          xp_earned?: number;
          exercises_completed?: number;
        };
        Update: {
          xp_earned?: number;
          exercises_completed?: number;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          badge_id?: string;
          earned_at?: string;
        };
      };
      unlocked_paths: {
        Row: {
          id: string;
          user_id: string;
          path_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          path_id: string;
          unlocked_at?: string;
        };
        Update: {
          path_id?: string;
          unlocked_at?: string;
        };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          user_id: string;
          username: string;
          avatar_url: string | null;
          total_xp: number;
          level: number;
          current_streak: number;
          rank: number;
        };
      };
      weekly_leaderboard: {
        Row: {
          user_id: string;
          username: string;
          avatar_url: string | null;
          weekly_xp: number;
          level: number;
          current_streak: number;
          rank: number;
        };
      };
    };
    Functions: {
      get_user_rank: {
        Args: { p_user_id: string };
        Returns: number;
      };
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserStats = Database['public']['Tables']['user_stats']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type ExerciseResultDB = Database['public']['Tables']['exercise_results']['Row'];
export type DailyProgressDB = Database['public']['Tables']['daily_progress']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];
export type UnlockedPath = Database['public']['Tables']['unlocked_paths']['Row'];
export type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row'];
