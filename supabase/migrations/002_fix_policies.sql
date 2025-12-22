-- Fix RLS Policies - Drop existing and recreate
-- Run this if you get "policy already exists" errors

-- ============================================
-- DROP EXISTING POLICIES
-- ============================================

-- Profiles policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- User stats policies
DROP POLICY IF EXISTS "User stats are viewable by everyone" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

-- User settings policies
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;

-- Exercise results policies
DROP POLICY IF EXISTS "Users can view own exercise results" ON public.exercise_results;
DROP POLICY IF EXISTS "Users can insert own exercise results" ON public.exercise_results;
DROP POLICY IF EXISTS "Users can update own exercise results" ON public.exercise_results;

-- Daily progress policies
DROP POLICY IF EXISTS "Users can view own daily progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Users can insert own daily progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Users can update own daily progress" ON public.daily_progress;

-- User badges policies
DROP POLICY IF EXISTS "User badges are viewable by everyone" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;

-- Unlocked paths policies
DROP POLICY IF EXISTS "Users can view own unlocked paths" ON public.unlocked_paths;
DROP POLICY IF EXISTS "Users can insert own unlocked paths" ON public.unlocked_paths;

-- ============================================
-- RECREATE POLICIES
-- ============================================

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

-- Done!
SELECT 'RLS Policies recreated successfully!' as status;
