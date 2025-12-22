import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { QuizExercise, CodeChallenge, CodeReview, FetchChallenge } from '@/components/exercises';
import { XPGainAnimation } from '@/components/gamification';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCompleteExercise } from '@/hooks/useCompleteExercise';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Shuffle, Star, Sparkles, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import { celebrateSuccess, xpGainEffect } from '@/lib/confetti';
import type { Exercise as ExerciseType, ExerciseResult } from '@/types';

export function Exercise() {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { completeExercise: completeUserExercise } = useCompleteExercise();
  const {
    getExercise,
    getNewExercise,
    getTrainingExercise,
    startExercise,
    completeExercise: completeStoreExercise,
    completeDailyChallenge,
    getUncompletedCount,
  } = useExerciseStore();

  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Check URL params
  const isDailyChallenge = searchParams.get('daily') === 'true';
  const isTrainingMode = searchParams.get('training') === 'true';
  const userLevel = user?.initialLevel;

  useEffect(() => {
    setIsLoading(true);

    // Small delay for loading UX
    setTimeout(() => {
      let foundExercise: ExerciseType | undefined;

      if (id) {
        // Direct exercise by ID
        foundExercise = getExercise(id);
      } else if (type) {
        const exerciseType = type as ExerciseType['type'];

        if (isTrainingMode) {
          // Training mode - get completed exercises only
          foundExercise = getTrainingExercise(exerciseType);
        } else {
          // Normal mode - get new exercises (uncompleted), filtered by user level
          foundExercise = getNewExercise(exerciseType, userLevel);
        }
      }

      if (foundExercise) {
        setExercise(foundExercise);
        startExercise(foundExercise.id);
      }

      setIsLoading(false);
    }, 300);
  }, [type, id, getExercise, getNewExercise, getTrainingExercise, startExercise, isTrainingMode, userLevel]);

  const handleComplete = (success: boolean, xpEarned: number, timeSpent: number) => {
    if (!exercise) return;

    // Apply daily challenge bonus (+50% XP)
    let finalXP = xpEarned;
    if (isDailyChallenge && success) {
      const bonusXP = Math.round(xpEarned * 0.5);
      finalXP = xpEarned + bonusXP;
    }

    const result: ExerciseResult = {
      exerciseId: exercise.id,
      completed: success,
      score: success ? 100 : 50,
      xpEarned: finalXP,
      timeSpent,
      attempts: 1,
      completedAt: new Date(),
    };

    // Update user stats
    completeUserExercise(result);

    // Update exercise store
    completeStoreExercise(exercise.id, result.score, timeSpent);

    // If daily challenge, mark as completed
    if (isDailyChallenge && success) {
      completeDailyChallenge(result.score);
    }

    // Trigger confetti and XP animation
    setEarnedXP(finalXP);
    setShowXPAnimation(true);

    if (success) {
      celebrateSuccess();
    } else {
      xpGainEffect();
    }

    const bonusText = isDailyChallenge && success ? ' (Bonus défi quotidien !)' : '';
    toast.success(`+${finalXP} XP gagnés !${bonusText}`, {
      description: success ? 'Excellent travail !' : 'Continue comme ça !',
    });

    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleNextExercise = () => {
    if (!exercise) return;

    let nextExercise: ExerciseType | undefined;

    if (isTrainingMode) {
      nextExercise = getTrainingExercise(exercise.type);
    } else {
      nextExercise = getNewExercise(exercise.type, userLevel);
    }

    if (nextExercise) {
      setExercise(nextExercise);
      startExercise(nextExercise.id);
    } else {
      toast.info('Tu as fait tous les exercices de ce type !', {
        description: 'Essaie le mode entraînement pour les refaire.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!exercise) {
    const uncompletedCount = getUncompletedCount();
    const allDone = uncompletedCount === 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {allDone ? (
          <>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold">Félicitations !</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Tu as complété tous les exercices disponibles.
              Utilise le mode entraînement pour t'améliorer !
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button onClick={() => navigate(`/exercise/${type}?training=true`)}>
                <Dumbbell className="w-4 h-4 mr-2" />
                Mode Entraînement
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Exercice non trouvé</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <XPGainAnimation
        amount={earnedXP}
        show={showXPAnimation}
        onComplete={() => setShowXPAnimation(false)}
      />

      {/* Daily Challenge Banner */}
      {isDailyChallenge && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                Challenge du Jour
                <Sparkles className="w-4 h-4" />
              </h3>
              <p className="text-sm text-white/80">Bonus +50% XP si tu réussis !</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            +50% XP
          </Badge>
        </div>
      )}

      {/* Training Mode Banner */}
      {isTrainingMode && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Mode Entraînement</h3>
              <p className="text-sm text-white/80">Refais des exercices pour t'améliorer</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            Révision
          </Badge>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        {!isDailyChallenge && (
          <Button variant="outline" onClick={handleNextExercise}>
            <Shuffle className="w-4 h-4 mr-2" />
            Autre exercice
          </Button>
        )}
      </div>

      {exercise.type === 'quiz' && (
        <QuizExercise
          exercise={exercise}
          onComplete={(correct, xp, time) => handleComplete(correct, xp, time)}
        />
      )}

      {exercise.type === 'challenge' && (
        <CodeChallenge
          exercise={exercise}
          onComplete={(success, xp, time) => handleComplete(success, xp, time)}
        />
      )}

      {exercise.type === 'review' && (
        <CodeReview
          exercise={exercise}
          onComplete={(score, xp, time) => handleComplete(score >= 80, xp, time)}
        />
      )}

      {exercise.type === 'fetch' && (
        <FetchChallenge
          exercise={exercise}
          onComplete={(success, xp, time) => handleComplete(success, xp, time)}
        />
      )}
    </div>
  );
}
