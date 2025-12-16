-- LevelUp.dev Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  initial_level TEXT DEFAULT 'junior' CHECK (initial_level IN ('junior', 'mid', 'senior')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  title TEXT DEFAULT 'junior-padawan',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 0,
  total_challenges INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  sound_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  daily_goal INTEGER DEFAULT 3 CHECK (daily_goal >= 1 AND daily_goal <= 10),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXERCISE RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0, -- in seconds
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one result per user per exercise
  UNIQUE(user_id, exercise_id)
);

-- ============================================
-- DAILY PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,

  -- Unique constraint: one entry per user per day
  UNIQUE(user_id, date)
);

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one badge per user
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- UNLOCKED PATHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS unlocked_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one path per user
  UNIQUE(user_id, path_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_exercise_results_user ON exercise_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_exercise ON exercise_results(exercise_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user ON daily_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_date ON daily_progress(date);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(total_xp DESC);

-- ============================================
-- LEADERBOARD VIEW (All Time)
-- ============================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id as user_id,
  p.username,
  p.avatar_url,
  s.total_xp,
  s.level,
  s.current_streak,
  ROW_NUMBER() OVER (ORDER BY s.total_xp DESC) as rank
FROM profiles p
JOIN user_stats s ON p.id = s.user_id
ORDER BY s.total_xp DESC;

-- ============================================
-- WEEKLY LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT
  p.id as user_id,
  p.username,
  p.avatar_url,
  COALESCE(SUM(dp.xp_earned), 0) as weekly_xp,
  s.level,
  s.current_streak,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(dp.xp_earned), 0) DESC) as rank
FROM profiles p
JOIN user_stats s ON p.id = s.user_id
LEFT JOIN daily_progress dp ON p.id = dp.user_id
  AND dp.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.id, p.username, p.avatar_url, s.level, s.current_streak
ORDER BY weekly_xp DESC;

-- ============================================
-- FUNCTION: Get user rank
-- ============================================
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT rank INTO user_rank
  FROM leaderboard
  WHERE user_id = p_user_id;

  RETURN COALESCE(user_rank, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Update streak on activity
-- ============================================
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  curr_streak INTEGER;
  long_streak INTEGER;
BEGIN
  -- Get current stats
  SELECT last_activity_date, current_streak, longest_streak
  INTO last_date, curr_streak, long_streak
  FROM user_stats
  WHERE user_id = NEW.user_id;

  -- If no previous activity or first time
  IF last_date IS NULL THEN
    curr_streak := 1;
  -- If activity was yesterday, increment streak
  ELSIF last_date = CURRENT_DATE - 1 THEN
    curr_streak := curr_streak + 1;
  -- If activity was today, keep current streak
  ELSIF last_date = CURRENT_DATE THEN
    -- No change
    NULL;
  -- If more than 1 day gap, reset streak
  ELSE
    curr_streak := 1;
  END IF;

  -- Update longest streak if needed
  IF curr_streak > long_streak THEN
    long_streak := curr_streak;
  END IF;

  -- Update user_stats
  UPDATE user_stats
  SET
    current_streak = curr_streak,
    longest_streak = long_streak,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for streak update
DROP TRIGGER IF EXISTS trigger_update_streak ON daily_progress;
CREATE TRIGGER trigger_update_streak
AFTER INSERT ON daily_progress
FOR EACH ROW
EXECUTE FUNCTION update_streak();

-- ============================================
-- FUNCTION: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)));

  -- Create initial stats
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);

  -- Create initial settings
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);

  -- Unlock default path
  INSERT INTO unlocked_paths (user_id, path_id)
  VALUES (NEW.id, 'javascript-fundamentals');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_paths ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Stats: Users can read all (for leaderboard), update their own
CREATE POLICY "Stats are viewable by everyone" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Settings: Private to each user
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Exercise Results: Private to each user
CREATE POLICY "Users can view own results" ON exercise_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON exercise_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own results" ON exercise_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Daily Progress: Private to each user
CREATE POLICY "Users can view own progress" ON daily_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON daily_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON daily_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User Badges: Public read, private write
CREATE POLICY "Badges are viewable by everyone" ON user_badges
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Unlocked Paths: Private to each user
CREATE POLICY "Users can view own paths" ON unlocked_paths
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own paths" ON unlocked_paths
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- GRANT ACCESS TO VIEWS
-- ============================================
GRANT SELECT ON leaderboard TO authenticated;
GRANT SELECT ON leaderboard TO anon;
GRANT SELECT ON weekly_leaderboard TO authenticated;
GRANT SELECT ON weekly_leaderboard TO anon;
