import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/animated';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, Medal, Flame, Zap, Crown, TrendingUp, Users, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/gamification';

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
      {entry.avatarUrl ? (
        <img
          src={entry.avatarUrl}
          alt={entry.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {entry.username.charAt(0).toUpperCase()}
        </div>
      )}

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
          {second.avatarUrl ? (
            <img src={second.avatarUrl} alt={second.username} className="w-16 h-16 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xl font-bold mb-2">
              {second.username.charAt(0)}
            </div>
          )}
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
          {first.avatarUrl ? (
            <img src={first.avatarUrl} alt={first.username} className="w-20 h-20 rounded-full object-cover mb-2 ring-4 ring-yellow-200 dark:ring-yellow-900" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-2 ring-4 ring-yellow-200 dark:ring-yellow-900">
              {first.username.charAt(0)}
            </div>
          )}
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
          {third.avatarUrl ? (
            <img src={third.avatarUrl} alt={third.username} className="w-16 h-16 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white text-xl font-bold mb-2">
              {third.username.charAt(0)}
            </div>
          )}
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
  const user = useCurrentUser();
  const [activeTab, setActiveTab] = useState('all-time');
  const {
    allTimeLeaderboard: fetchedAllTime,
    weeklyLeaderboard: fetchedWeekly,
    isLoading,
    currentUserId,
    refetch,
  } = useLeaderboard();

  if (!user) return null;

  // Insert current user into leaderboard if not already present (for mock mode)
  const insertUserIntoLeaderboard = (leaderboard: LeaderboardEntry[], isWeekly = false): LeaderboardEntry[] => {
    // Si l'utilisateur est déjà dans le classement (mode Supabase), ne pas l'ajouter
    if (currentUserId && leaderboard.some(e => e.userId === currentUserId)) {
      return leaderboard;
    }

    const userXP = isWeekly ? Math.floor(user.stats.totalXP * 0.1) : user.stats.totalXP;
    const userEntry: LeaderboardEntry = {
      rank: 0,
      userId: 'current_user',
      username: user.username,
      avatarUrl: user.avatarUrl,
      xp: userXP,
      level: user.stats.level,
      streak: user.stats.currentStreak,
    };

    // Find user's position
    const sorted = [...leaderboard, userEntry].sort((a, b) => b.xp - a.xp);
    return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
  };

  const allTimeLeaderboard = insertUserIntoLeaderboard(fetchedAllTime);
  const weeklyLeaderboard = insertUserIntoLeaderboard(fetchedWeekly, true);

  // Trouver le rang de l'utilisateur actuel
  const currentUserIdToFind = currentUserId || 'current_user';
  const currentUserRankAllTime = allTimeLeaderboard.find((e) => e.userId === currentUserIdToFind)?.rank || 0;
  const currentUserRankWeekly = weeklyLeaderboard.find((e) => e.userId === currentUserIdToFind)?.rank || 0;

  // Loading state
  if (isLoading) {
    return (
      <PageTransition className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement du classement...</p>
        </div>
      </PageTransition>
    );
  }

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
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
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
                  isCurrentUser={entry.userId === currentUserIdToFind}
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
                  isCurrentUser={entry.userId === currentUserIdToFind}
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
