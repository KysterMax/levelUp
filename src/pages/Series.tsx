import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageTransition, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/animated';
import { QuizExercise, CodeChallenge, CodeReview, FetchChallenge } from '@/components/exercises';
import { XPGainAnimation } from '@/components/gamification';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCompleteExercise } from '@/hooks/useCompleteExercise';
import { useExerciseStore } from '@/stores/exerciseStore';
import { SERIES_PRESETS } from '@/types/gamification';
import type { Exercise, ExerciseResult } from '@/types';
import { ArrowLeft, Zap, Trophy, Target, Play, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { celebrateSuccess } from '@/lib/confetti';
import { cn } from '@/lib/utils';

// Series selection screen
function SeriesSelection({ onSelect }: { onSelect: (seriesId: string) => void }) {
  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Séries d'entraînement</h1>
        <p className="text-muted-foreground">Choisis une série pour t'entraîner et gagner des bonus XP</p>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERIES_PRESETS.map((series) => (
          <StaggerItem key={series.id}>
            <HoverScale>
              <Card
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => onSelect(series.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{series.name}</CardTitle>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      +{series.xpBonus} XP
                    </Badge>
                  </div>
                  <CardDescription>{series.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        {series.exerciseCount} exercices
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {series.difficulty === 'mixed' ? 'Varié' : series.difficulty}
                      </Badge>
                    </div>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Commencer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </HoverScale>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}

// Series progress screen
function SeriesProgress({
  series,
  exercises,
  currentIndex,
  scores,
  totalXP,
  onComplete,
  onExit,
}: {
  series: typeof SERIES_PRESETS[0];
  exercises: Exercise[];
  currentIndex: number;
  scores: number[];
  totalXP: number;
  onComplete: (success: boolean, xp: number, time: number) => void;
  onExit: () => void;
}) {
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const currentExercise = exercises[currentIndex];
  const progressPercent = ((currentIndex) / exercises.length) * 100;

  const handleExerciseComplete = (success: boolean, xp: number, time: number) => {
    setEarnedXP(xp);
    setShowXPAnimation(true);
    onComplete(success, xp, time);
  };

  if (!currentExercise) return null;

  return (
    <div className="space-y-4">
      <XPGainAnimation
        amount={earnedXP}
        show={showXPAnimation}
        onComplete={() => setShowXPAnimation(false)}
      />

      {/* Series header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quitter la série
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Zap className="w-3 h-3" />
            {totalXP} XP
          </Badge>
          <Badge variant="outline">
            {currentIndex + 1}/{exercises.length}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{series.name}</span>
          <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <div className="flex gap-1">
          {exercises.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                idx < currentIndex
                  ? scores[idx] >= 80
                    ? 'bg-green-500'
                    : 'bg-amber-500'
                  : idx === currentIndex
                    ? 'bg-violet-500'
                    : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      {/* Current exercise - key forces remount on exercise change */}
      {currentExercise.type === 'quiz' && (
        <QuizExercise
          key={currentExercise.id}
          exercise={currentExercise}
          onComplete={(correct, xp, time) => handleExerciseComplete(correct, xp, time)}
        />
      )}
      {currentExercise.type === 'challenge' && (
        <CodeChallenge
          key={currentExercise.id}
          exercise={currentExercise}
          onComplete={(success, xp, time) => handleExerciseComplete(success, xp, time)}
        />
      )}
      {currentExercise.type === 'review' && (
        <CodeReview
          key={currentExercise.id}
          exercise={currentExercise}
          onComplete={(score, xp, time) => handleExerciseComplete(score >= 80, xp, time)}
        />
      )}
      {currentExercise.type === 'fetch' && (
        <FetchChallenge
          key={currentExercise.id}
          exercise={currentExercise}
          onComplete={(success, xp, time) => handleExerciseComplete(success, xp, time)}
        />
      )}
    </div>
  );
}

// Series completion screen
function SeriesComplete({
  series,
  scores,
  totalXP,
  bonusXP,
  onRestart,
  onExit,
}: {
  series: typeof SERIES_PRESETS[0];
  scores: number[];
  totalXP: number;
  bonusXP: number;
  onRestart: () => void;
  onExit: () => void;
}) {
  const perfectCount = scores.filter((s) => s >= 100).length;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  useEffect(() => {
    celebrateSuccess();
  }, []);

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
        <Trophy className="w-10 h-10 text-white" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Série Terminée !</h1>
        <p className="text-muted-foreground">{series.name}</p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-amber-500">{totalXP + bonusXP}</p>
              <p className="text-sm text-muted-foreground">XP gagnés</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">{avgScore}%</p>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-violet-500">{perfectCount}</p>
              <p className="text-sm text-muted-foreground">Parfaits</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span>XP des exercices</span>
              <span className="font-medium">{totalXP} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm text-amber-600">
              <span>Bonus série complète</span>
              <span className="font-medium">+{bonusXP} XP</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onExit}>
              Retour
            </Button>
            <Button className="flex-1" onClick={onRestart}>
              <Flame className="w-4 h-4 mr-2" />
              Refaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}

// Main Series component
export function Series() {
  const { seriesId } = useParams<{ seriesId?: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { completeExercise } = useCompleteExercise();
  const { getExercises, completeExercise: completeStoreExercise } = useExerciseStore();

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(seriesId || null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const series = SERIES_PRESETS.find((s) => s.id === selectedSeriesId);

  // Generate exercises for the series
  const generateExercises = useCallback((series: typeof SERIES_PRESETS[0]) => {
    const allExercises = getExercises();
    const selectedExercises: Exercise[] = [];
    const usedIds = new Set<string>();

    // Filter by type
    const availableExercises = allExercises.filter((ex) =>
      series.exerciseTypes.includes(ex.type)
    );

    // Filter by difficulty if not mixed
    const filteredExercises = series.difficulty === 'mixed'
      ? availableExercises
      : availableExercises.filter((ex) => ex.difficulty === series.difficulty);

    // Randomly select exercises
    const shuffled = [...filteredExercises].sort(() => Math.random() - 0.5);

    for (const exercise of shuffled) {
      if (selectedExercises.length >= series.exerciseCount) break;
      if (!usedIds.has(exercise.id)) {
        selectedExercises.push(exercise);
        usedIds.add(exercise.id);
      }
    }

    return selectedExercises;
  }, [getExercises]);

  // Initialize series
  useEffect(() => {
    if (series && exercises.length === 0) {
      const generatedExercises = generateExercises(series);
      setExercises(generatedExercises);
    }
  }, [series, exercises.length, generateExercises]);

  const handleSeriesSelect = (id: string) => {
    setSelectedSeriesId(id);
    const selectedSeries = SERIES_PRESETS.find((s) => s.id === id);
    if (selectedSeries) {
      const generatedExercises = generateExercises(selectedSeries);
      setExercises(generatedExercises);
      setCurrentIndex(0);
      setScores([]);
      setTotalXP(0);
      setIsComplete(false);
    }
  };

  const handleExerciseComplete = (success: boolean, xp: number, time: number) => {
    if (!series || !exercises[currentIndex]) return;

    const exercise = exercises[currentIndex];
    const score = success ? 100 : 50;

    // Update scores and XP
    setScores((prev) => [...prev, score]);
    setTotalXP((prev) => prev + xp);

    // Complete exercise in stores
    const result: ExerciseResult = {
      exerciseId: exercise.id,
      completed: success,
      score,
      xpEarned: xp,
      timeSpent: time,
      attempts: 1,
      completedAt: new Date(),
    };
    completeExercise(result);
    completeStoreExercise(exercise.id, score, time);

    // Move to next exercise or complete series
    setTimeout(() => {
      if (currentIndex + 1 >= exercises.length) {
        // Series complete - add bonus XP
        setIsComplete(true);
        completeExercise({
          exerciseId: `series-${series.id}`,
          completed: true,
          score: 100,
          xpEarned: series.xpBonus,
          timeSpent: 0,
          attempts: 1,
          completedAt: new Date(),
        });
        toast.success(`Série terminée ! +${series.xpBonus} XP bonus`);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  const handleRestart = () => {
    if (series) {
      const generatedExercises = generateExercises(series);
      setExercises(generatedExercises);
      setCurrentIndex(0);
      setScores([]);
      setTotalXP(0);
      setIsComplete(false);
    }
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  if (!user) return null;

  // Show selection if no series selected
  if (!selectedSeriesId || !series) {
    return <SeriesSelection onSelect={handleSeriesSelect} />;
  }

  // Show completion screen
  if (isComplete && series) {
    return (
      <SeriesComplete
        series={series}
        scores={scores}
        totalXP={totalXP}
        bonusXP={series.xpBonus}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    );
  }

  // Show exercise progress
  return (
    <SeriesProgress
      series={series}
      exercises={exercises}
      currentIndex={currentIndex}
      scores={scores}
      totalXP={totalXP}
      onComplete={handleExerciseComplete}
      onExit={handleExit}
    />
  );
}
