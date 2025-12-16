import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/animated';
import { useUserStore } from '@/stores/userStore';
import { useExerciseStore, getTotalExercisesCount, getCategoryStats } from '@/stores/exerciseStore';
import { getXPForNextLevel } from '@/types/user';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, Clock, Target, Zap, Trophy, BarChart3 } from 'lucide-react';

// Colors for charts
const COLORS = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];

const TYPE_LABELS: Record<string, string> = {
  quiz: 'Quiz',
  challenge: 'Challenges',
  fetch: 'Fetch API',
  review: 'Code Review',
};

export function Statistics() {
  const user = useUserStore((state) => state.user);
  const { completedExercises, getExercises } = useExerciseStore();

  if (!user) return null;

  const xpInfo = getXPForNextLevel(user.stats.totalXP);
  const xpToNextLevel = xpInfo.next - xpInfo.current;
  const totalExercises = getTotalExercisesCount();
  const categoryStats = getCategoryStats();

  // Calculate weekly activity (last 7 days)
  const weeklyData = useMemo(() => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const completed = completedExercises.filter((ex) => {
        const exDate = new Date(ex.completedAt).toISOString().split('T')[0];
        return exDate === dateStr;
      }).length;

      data.push({
        day: days[date.getDay()],
        exercices: completed,
        date: dateStr,
      });
    }

    return data;
  }, [completedExercises]);

  // Calculate exercise type distribution
  const typeDistribution = useMemo(() => {
    const types: Record<string, number> = {
      quiz: 0,
      challenge: 0,
      fetch: 0,
      review: 0,
    };

    completedExercises.forEach((completed) => {
      const allExercises = getExercises();
      const exercise = allExercises.find((ex) => ex.id === completed.exerciseId);
      if (exercise) {
        types[exercise.type] = (types[exercise.type] || 0) + 1;
      }
    });

    return Object.entries(types)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: TYPE_LABELS[name] || name,
        value,
      }));
  }, [completedExercises, getExercises]);

  // Calculate category performance
  const categoryPerformance = useMemo(() => {
    const performance: Record<string, { total: number; completed: number; avgScore: number }> = {};

    Object.entries(categoryStats).forEach(([category, total]) => {
      const completed = completedExercises.filter((c) => {
        const exercise = getExercises().find((ex) => ex.id === c.exerciseId);
        return exercise?.category === category;
      });

      const avgScore = completed.length > 0
        ? completed.reduce((sum, c) => sum + c.score, 0) / completed.length
        : 0;

      performance[category] = {
        total: total as number,
        completed: completed.length,
        avgScore: Math.round(avgScore),
      };
    });

    return Object.entries(performance)
      .filter(([, data]) => data.completed > 0)
      .map(([name, data]) => ({
        name: name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        completed: data.completed,
        score: data.avgScore,
      }))
      .slice(0, 6);
  }, [categoryStats, completedExercises, getExercises]);

  // Calculate average time per exercise
  const avgTimePerExercise = useMemo(() => {
    if (completedExercises.length === 0) return 0;
    const totalTime = completedExercises.reduce((sum, ex) => sum + (ex.timeSpent || 0), 0);
    return Math.round(totalTime / completedExercises.length);
  }, [completedExercises]);

  // Format time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Calculate completion rate
  const completionRate = Math.round((completedExercises.length / totalExercises) * 100);

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground">Analyse de ta progression</p>
      </div>

      {/* Key Stats */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">XP Total</p>
                  <p className="text-2xl font-bold text-amber-500">{user.stats.totalXP}</p>
                </div>
                <Zap className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {xpToNextLevel} XP → Niveau {user.stats.level + 1}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exercices</p>
                  <p className="text-2xl font-bold">{completedExercises.length}</p>
                </div>
                <Target className="w-8 h-8 text-violet-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completionRate}% complétés ({totalExercises} total)
              </p>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temps moyen</p>
                  <p className="text-2xl font-bold">{formatTime(avgTimePerExercise)}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                par exercice
              </p>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Série max</p>
                  <p className="text-2xl font-bold">{user.stats.longestStreak}</p>
                </div>
                <Trophy className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                jours consécutifs
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Activité hebdomadaire</CardTitle>
                  <CardDescription>Exercices complétés par jour</CardDescription>
                </div>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="day"
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="exercices"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                      name="Exercices"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Type Distribution */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Répartition par type</CardTitle>
                  <CardDescription>Distribution des exercices complétés</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {typeDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {typeDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>Complète des exercices pour voir les statistiques</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </div>

      {/* Category Performance */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Performance par catégorie</CardTitle>
                <CardDescription>Score moyen et exercices complétés</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {categoryPerformance.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fill: 'currentColor' }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="#8B5CF6" name="Complétés" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="score" fill="#22C55E" name="Score (%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p>Complète des exercices pour voir les statistiques par catégorie</p>
              </div>
            )}
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Recent Achievements */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                <p className="text-3xl font-bold text-violet-600">{user.stats.totalQuizzes}</p>
                <p className="text-sm text-muted-foreground">Quiz réussis</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-3xl font-bold text-blue-600">{user.stats.totalChallenges}</p>
                <p className="text-sm text-muted-foreground">Challenges résolus</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                <p className="text-3xl font-bold text-green-600">{user.stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <p className="text-3xl font-bold text-amber-600">{user.earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges obtenus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}
