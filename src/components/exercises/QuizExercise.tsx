import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sounds } from '@/lib/sounds';
import type { QuizExercise as QuizExerciseType } from '@/types';
import { XP_REWARDS } from '@/types/gamification';

interface QuizExerciseProps {
  exercise: QuizExerciseType;
  onComplete: (correct: boolean, xpEarned: number, timeSpent: number) => void;
}

export function QuizExercise({ exercise, onComplete }: QuizExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const isCorrect = selectedAnswer === exercise.correctIndex;

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || hasAnswered) return;
    setHasAnswered(true);
    // Play sound based on answer
    if (selectedAnswer === exercise.correctIndex) {
      sounds.correct();
    } else {
      sounds.incorrect();
    }
  };

  const handleContinue = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const xpEarned = isCorrect ? XP_REWARDS.quiz_correct : XP_REWARDS.quiz_incorrect;
    onComplete(isCorrect, xpEarned, timeSpent);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{exercise.category}</Badge>
          <Badge
            className={cn(
              exercise.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
              exercise.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
              exercise.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
            )}
          >
            {exercise.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg">{exercise.question}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {exercise.code && (
          <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono">
            <code>{exercise.code}</code>
          </pre>
        )}

        <div className="space-y-3">
          {exercise.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === exercise.correctIndex;

            let optionStyle = 'border-border hover:border-primary hover:bg-primary/5';

            if (hasAnswered) {
              if (isCorrectOption) {
                optionStyle = 'border-green-500 bg-green-50 dark:bg-green-950';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-red-500 bg-red-50 dark:bg-red-950';
              } else {
                optionStyle = 'border-border opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'border-primary bg-primary/10';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={hasAnswered}
                className={cn(
                  'w-full p-4 text-left rounded-lg border-2 transition-all flex items-center justify-between',
                  optionStyle
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-medium text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-mono text-sm">{option}</span>
                </div>
                {hasAnswered && isCorrectOption && (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            className={cn(
              'p-4 rounded-lg border-l-4',
              isCorrect
                ? 'bg-green-50 border-green-500 dark:bg-green-950'
                : 'bg-amber-50 border-amber-500 dark:bg-amber-950'
            )}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">
                  {isCorrect ? 'Correct ! +' + XP_REWARDS.quiz_correct + ' XP' : 'Pas tout à fait...'}
                </p>
                <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!hasAnswered ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="min-w-32"
            >
              Valider
            </Button>
          ) : (
            <Button onClick={handleContinue} className="min-w-32">
              Continuer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
