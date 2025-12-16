import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/animated';
import { useUserStore } from '@/stores/userStore';
import { Trophy, Medal, Flame, Zap, Crown, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/gamification';

// Mock leaderboard data - simulates other users
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

// Weekly leaderboard (subset with different order)
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

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
        <Crown className="w-4 h-4 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
      <span className="text-sm font-medium text-muted-foreground">{rank}</span>
    </div>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
  showWeeklyXP = false,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  showWeeklyXP?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg transition-colors',
        isCurrentUser
          ? 'bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800'
          : 'hover:bg-muted/50'
      )}
    >
      <RankBadge rank={entry.rank} />

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
        {entry.username.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium truncate', isCurrentUser && 'text-violet-600 dark:text-violet-400')}>
            {entry.username}
          </span>
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs">
              Toi
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Niveau {entry.level}</span>
          {entry.streak > 0 && (
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              {entry.streak}j
            </span>
          )}
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <div className="flex items-center gap-1 font-bold text-amber-500">
          <Zap className="w-4 h-4" />
          {entry.xp.toLocaleString()}
        </div>
        <span className="text-xs text-muted-foreground">
          {showWeeklyXP ? 'cette semaine' : 'XP total'}
        </span>
      </div>
    </div>
  );
}

function TopThree({ entries }: { entries: LeaderboardEntry[] }) {
  const top3 = entries.slice(0, 3);
  const [first, second, third] = top3;

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {/* Second Place */}
      {second && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xl font-bold mb-2">
            {second.username.charAt(0)}
          </div>
          <span className="font-medium text-sm truncate max-w-[80px]">{second.username}</span>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Zap className="w-3 h-3" />
            {second.xp.toLocaleString()}
          </div>
          <div className="w-20 h-16 bg-gray-200 dark:bg-gray-700 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500">2</span>
          </div>
        </div>
      )}

      {/* First Place */}
      {first && (
        <div className="flex flex-col items-center -mt-4">
          <Crown className="w-8 h-8 text-yellow-500 mb-1" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-2 ring-4 ring-yellow-200 dark:ring-yellow-900">
            {first.username.charAt(0)}
          </div>
          <span className="font-bold truncate max-w-[100px]">{first.username}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Zap className="w-4 h-4" />
            {first.xp.toLocaleString()}
          </div>
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">1</span>
          </div>
        </div>
      )}

      {/* Third Place */}
      {third && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white text-xl font-bold mb-2">
            {third.username.charAt(0)}
          </div>
          <span className="font-medium text-sm truncate max-w-[80px]">{third.username}</span>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Zap className="w-3 h-3" />
            {third.xp.toLocaleString()}
          </div>
          <div className="w-20 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">3</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Leaderboard() {
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('all-time');

  if (!user) return null;

  // Insert current user into leaderboard
  const insertUserIntoLeaderboard = (leaderboard: LeaderboardEntry[], isWeekly = false) => {
    const userXP = isWeekly ? Math.floor(user.stats.totalXP * 0.1) : user.stats.totalXP; // Mock weekly XP
    const userEntry: LeaderboardEntry = {
      rank: 0,
      userId: 'current_user',
      username: user.username,
      xp: userXP,
      level: user.stats.level,
      streak: user.stats.currentStreak,
    };

    // Find user's position
    const sorted = [...leaderboard, userEntry].sort((a, b) => b.xp - a.xp);
    return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
  };

  const allTimeLeaderboard = insertUserIntoLeaderboard(MOCK_LEADERBOARD);
  const weeklyLeaderboard = insertUserIntoLeaderboard(MOCK_WEEKLY, true);

  const currentUserRankAllTime = allTimeLeaderboard.find((e) => e.userId === 'current_user')?.rank || 0;
  const currentUserRankWeekly = weeklyLeaderboard.find((e) => e.userId === 'current_user')?.rank || 0;

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Classement
          </h1>
          <p className="text-muted-foreground">Compare-toi aux autres développeurs</p>
        </div>
      </div>

      {/* User's Current Rank Summary */}
      <StaggerContainer className="grid grid-cols-2 gap-4">
        <StaggerItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ton rang global</p>
                  <p className="text-3xl font-bold">#{currentUserRankAllTime}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                  <p className="text-3xl font-bold">#{currentUserRankWeekly}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Leaderboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-time" className="gap-2">
            <Trophy className="w-4 h-4" />
            Tous les temps
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <Flame className="w-4 h-4" />
            Cette semaine
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="mt-4 space-y-4">
          {/* Top 3 Podium */}
          <Card>
            <CardContent className="pt-6">
              <TopThree entries={allTimeLeaderboard} />
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Classement complet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {allTimeLeaderboard.map((entry) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  isCurrentUser={entry.userId === 'current_user'}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4 space-y-4">
          {/* Top 3 Podium */}
          <Card>
            <CardContent className="pt-6">
              <TopThree entries={weeklyLeaderboard} />
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Top de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weeklyLeaderboard.map((entry) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  isCurrentUser={entry.userId === 'current_user'}
                  showWeeklyXP
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Motivation Card */}
      <StaggerItem>
        <Card className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Continue comme ça !</h3>
                <p className="text-white/80 text-sm">
                  {currentUserRankAllTime <= 5
                    ? 'Tu es dans le top 5 ! Maintiens ta position !'
                    : currentUserRankAllTime <= 10
                      ? `Plus que ${currentUserRankAllTime - 5} places pour le top 5 !`
                      : `Complète des exercices pour monter dans le classement !`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}
