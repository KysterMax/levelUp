-- LevelUp.dev - Supabase Schema
-- Run this migration in your Supabase SQL Editor

-- ============================================
-- 1. TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  initial_level TEXT NOT NULL DEFAULT 'junior' CHECK (initial_level IN ('junior', 'mid', 'senior')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'Junior Developer',
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_exercises INTEGER NOT NULL DEFAULT 0,
  total_quizzes INTEGER NOT NULL DEFAULT 0,
  total_challenges INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  daily_goal INTEGER NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exercise results table
CREATE TABLE IF NOT EXISTS public.exercise_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- Daily progress table
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  exercises_completed INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- User badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Unlocked paths table
CREATE TABLE IF NOT EXISTS public.unlocked_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, path_id)
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_exercise_results_user_id ON public.exercise_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_exercise_id ON public.exercise_results(exercise_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON public.daily_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_xp ON public.user_stats(total_xp DESC);

-- ============================================
-- 3. VIEWS
-- ============================================

-- Global leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id AS user_id,
  p.username,
  p.avatar_url,
  COALESCE(s.total_xp, 0) AS total_xp,
  COALESCE(s.level, 1) AS level,
  COALESCE(s.current_streak, 0) AS current_streak,
  ROW_NUMBER() OVER (ORDER BY COALESCE(s.total_xp, 0) DESC) AS rank
FROM public.profiles p
LEFT JOIN public.user_stats s ON p.id = s.user_id
ORDER BY total_xp DESC;

-- Weekly leaderboard view
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT
  p.id AS user_id,
  p.username,
  p.avatar_url,
  COALESCE(SUM(dp.xp_earned), 0) AS weekly_xp,
  COALESCE(s.level, 1) AS level,
  COALESCE(s.current_streak, 0) AS current_streak,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(dp.xp_earned), 0) DESC) AS rank
FROM public.profiles p
LEFT JOIN public.user_stats s ON p.id = s.user_id
LEFT JOIN public.daily_progress dp ON p.id = dp.user_id
  AND dp.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.id, p.username, p.avatar_url, s.level, s.current_streak
ORDER BY weekly_xp DESC;

-- ============================================
-- 4. FUNCTIONS
-- ============================================

-- Function to get user rank
CREATE OR REPLACE FUNCTION public.get_user_rank(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT rank INTO user_rank
  FROM public.leaderboard
  WHERE user_id = p_user_id;

  RETURN COALESCE(user_rank, 0);
END;
$$;

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION public.calculate_level(xp INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level formula: each level requires more XP
  -- Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, etc.
  RETURN GREATEST(1, FLOOR(SQRT(xp / 50)) + 1)::INTEGER;
END;
$$;

-- Function to get title from level
CREATE OR REPLACE FUNCTION public.get_title(lvl INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN CASE
    WHEN lvl >= 30 THEN 'Legendary Developer'
    WHEN lvl >= 25 THEN 'Master Developer'
    WHEN lvl >= 21 THEN 'Senior Developer'
    WHEN lvl >= 16 THEN 'Advanced Developer'
    WHEN lvl >= 11 THEN 'Intermediate Developer'
    WHEN lvl >= 6 THEN 'Junior Developer'
    ELSE 'Apprentice Developer'
  END;
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create user stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  -- Create user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  -- Unlock default paths
  INSERT INTO public.unlocked_paths (user_id, path_id)
  VALUES
    (NEW.id, 'javascript-fundamentals'),
    (NEW.id, 'algorithms-basic'),
    (NEW.id, 'async-promises');

  RETURN NEW;
END;
$$;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user stats after exercise completion
CREATE OR REPLACE FUNCTION public.update_stats_on_exercise()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_level INTEGER;
  new_title TEXT;
  current_stats RECORD;
BEGIN
  -- Get current stats
  SELECT * INTO current_stats FROM public.user_stats WHERE user_id = NEW.user_id;

  -- Calculate new level
  new_level := public.calculate_level(current_stats.total_xp + NEW.xp_earned);
  new_title := public.get_title(new_level);

  -- Update stats
  UPDATE public.user_stats
  SET
    total_xp = total_xp + NEW.xp_earned,
    total_exercises = total_exercises + 1,
    level = new_level,
    title = new_title,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- Update daily progress
  INSERT INTO public.daily_progress (user_id, date, xp_earned, exercises_completed)
  VALUES (NEW.user_id, CURRENT_DATE, NEW.xp_earned, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    xp_earned = daily_progress.xp_earned + NEW.xp_earned,
    exercises_completed = daily_progress.exercises_completed + 1;

  RETURN NEW;
END;
$$;

-- Trigger for exercise completion
DROP TRIGGER IF EXISTS on_exercise_completed ON public.exercise_results;
CREATE TRIGGER on_exercise_completed
  AFTER INSERT ON public.exercise_results
  FOR EACH ROW EXECUTE FUNCTION public.update_stats_on_exercise();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_paths ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User stats policies
CREATE POLICY "User stats are viewable by everyone"
  ON public.user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Exercise results policies
CREATE POLICY "Users can view own exercise results"
  ON public.exercise_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise results"
  ON public.exercise_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise results"
  ON public.exercise_results FOR UPDATE
  USING (auth.uid() = user_id);

-- Daily progress policies
CREATE POLICY "Users can view own daily progress"
  ON public.daily_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily progress"
  ON public.daily_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily progress"
  ON public.daily_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Unlocked paths policies
CREATE POLICY "Users can view own unlocked paths"
  ON public.unlocked_paths FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlocked paths"
  ON public.unlocked_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.user_stats TO anon, authenticated;
GRANT SELECT, UPDATE ON public.user_stats TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.exercise_results TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.daily_progress TO authenticated;
GRANT SELECT, INSERT ON public.user_badges TO authenticated;
GRANT SELECT, INSERT ON public.unlocked_paths TO authenticated;

-- Grant access to views
GRANT SELECT ON public.leaderboard TO anon, authenticated;
GRANT SELECT ON public.weekly_leaderboard TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_user_rank(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_level(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_title(INTEGER) TO anon, authenticated;
