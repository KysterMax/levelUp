import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { LeaderboardEntry } from '@/types/gamification';
import type { Database } from '@/types/database';

type LeaderboardRow = Database['public']['Views']['leaderboard']['Row'];
type WeeklyLeaderboardRow = Database['public']['Views']['weekly_leaderboard']['Row'];

// Mock leaderboard data - used when Supabase is not configured
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'user_1', username: 'CodeMaster', xp: 15420, level: 28, streak: 45 },
  { rank: 2, userId: 'user_2', username: 'AlgoNinja', xp: 12850, level: 24, streak: 32 },
  { rank: 3, userId: 'user_3', username: 'DevQueen', xp: 11200, level: 22, streak: 28 },
  { rank: 4, userId: 'user_4', username: 'ByteRunner', xp: 9800, level: 20, streak: 21 },
  { rank: 5, userId: 'user_5', username: 'ReactPro', xp: 8500, level: 18, streak: 18 },
  { rank: 6, userId: 'user_6', username: 'TypeScriptFan', xp: 7200, level: 16, streak: 14 },
  { rank: 7, userId: 'user_7', username: 'AsyncAwait', xp: 6100, level: 14, streak: 12 },
  { rank: 8, userId: 'user_8', username: 'CleanCoder', xp: 5400, level: 13, streak: 9 },
  { rank: 9, userId: 'user_9', username: 'BugHunter', xp: 4800, level: 12, streak: 7 },
  { rank: 10, userId: 'user_10', username: 'JuniorDev', xp: 4200, level: 11, streak: 5 },
  { rank: 11, userId: 'user_11', username: 'StackOverflow', xp: 3600, level: 10, streak: 4 },
  { rank: 12, userId: 'user_12', username: 'GitMaster', xp: 3100, level: 9, streak: 3 },
  { rank: 13, userId: 'user_13', username: 'CSSWizard', xp: 2700, level: 8, streak: 2 },
  { rank: 14, userId: 'user_14', username: 'NodeRunner', xp: 2300, level: 7, streak: 2 },
  { rank: 15, userId: 'user_15', username: 'APIBuilder', xp: 1900, level: 6, streak: 1 },
];

const MOCK_WEEKLY: LeaderboardEntry[] = [
  { rank: 1, userId: 'user_3', username: 'DevQueen', xp: 1850, level: 22, streak: 7 },
  { rank: 2, userId: 'user_7', username: 'AsyncAwait', xp: 1620, level: 14, streak: 7 },
  { rank: 3, userId: 'user_1', username: 'CodeMaster', xp: 1480, level: 28, streak: 7 },
  { rank: 4, userId: 'user_5', username: 'ReactPro', xp: 1200, level: 18, streak: 5 },
  { rank: 5, userId: 'user_2', username: 'AlgoNinja', xp: 980, level: 24, streak: 4 },
  { rank: 6, userId: 'user_8', username: 'CleanCoder', xp: 850, level: 13, streak: 6 },
  { rank: 7, userId: 'user_4', username: 'ByteRunner', xp: 720, level: 20, streak: 3 },
  { rank: 8, userId: 'user_6', username: 'TypeScriptFan', xp: 650, level: 16, streak: 4 },
  { rank: 9, userId: 'user_10', username: 'JuniorDev', xp: 580, level: 11, streak: 5 },
  { rank: 10, userId: 'user_9', username: 'BugHunter', xp: 450, level: 12, streak: 2 },
];

interface UseLeaderboardReturn {
  allTimeLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  currentUserId: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer le classement depuis Supabase ou utiliser les données mock
 */
export function useLeaderboard(): UseLeaderboardReturn {
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabaseUser = useAuthStore((state) => state.user);
  const currentUserId = supabaseUser?.id || null;

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Si Supabase n'est pas configuré, utiliser les données mock
    if (!isSupabaseConfigured()) {
      setAllTimeLeaderboard(MOCK_LEADERBOARD);
      setWeeklyLeaderboard(MOCK_WEEKLY);
      setIsLoading(false);
      return;
    }

    try {
      // Récupérer le classement global depuis la vue Supabase
      const { data: allTimeData, error: allTimeError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true })
        .limit(50);

      if (allTimeError) {
        throw new Error(allTimeError.message);
      }

      // Transformer les données Supabase en format LeaderboardEntry
      const allTimeEntries: LeaderboardEntry[] = ((allTimeData || []) as LeaderboardRow[]).map((row) => ({
        rank: row.rank,
        userId: row.user_id,
        username: row.username,
        xp: row.total_xp,
        level: row.level,
        streak: row.current_streak,
        avatarUrl: row.avatar_url ?? undefined,
      }));

      setAllTimeLeaderboard(allTimeEntries);

      // Récupérer le classement hebdomadaire
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('weekly_leaderboard')
        .select('*')
        .order('rank', { ascending: true })
        .limit(50);

      if (weeklyError) {
        // Si la vue weekly n'existe pas, générer à partir de allTime
        console.warn('Weekly leaderboard view not available:', weeklyError.message);
        setWeeklyLeaderboard(allTimeEntries.slice(0, 10));
      } else {
        const weeklyEntries: LeaderboardEntry[] = ((weeklyData || []) as WeeklyLeaderboardRow[]).map((row) => ({
          rank: row.rank,
          userId: row.user_id,
          username: row.username,
          xp: row.weekly_xp,
          level: row.level,
          streak: row.current_streak,
          avatarUrl: row.avatar_url ?? undefined,
        }));
        setWeeklyLeaderboard(weeklyEntries);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      // Fallback aux données mock en cas d'erreur
      setAllTimeLeaderboard(MOCK_LEADERBOARD);
      setWeeklyLeaderboard(MOCK_WEEKLY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    allTimeLeaderboard,
    weeklyLeaderboard,
    isLoading,
    error,
    currentUserId,
    refetch: fetchLeaderboard,
  };
}
