import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore, LEVEL_TEST_QUESTIONS } from '@/stores/onboardingStore';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LevelTestQuestion() {
  const { currentQuestionIndex, answerQuestion } = useOnboardingStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const question = LEVEL_TEST_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / LEVEL_TEST_QUESTIONS.length) * 100;
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;

    if (!hasAnswered) {
      setHasAnswered(true);
    } else {
      answerQuestion(selectedAnswer);
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  };

  const getLevelBadge = () => {
    switch (question.level) {
      case 'basic':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Fondamentaux</Badge>;
      case 'intermediate':
        return <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">Algorithmes</Badge>;
      case 'advanced':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Design Patterns</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-violet-600">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-muted-foreground">/ {LEVEL_TEST_QUESTIONS.length}</span>
            </div>
            {getLevelBadge()}
          </div>
          <Progress value={progress} className="h-2" />
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {question.code && (
            <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono">
              <code>{question.code}</code>
            </pre>
          )}

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctIndex;

              let optionStyle = 'border-border hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950';

              if (hasAnswered) {
                if (isCorrectOption) {
                  optionStyle = 'border-green-500 bg-green-50 dark:bg-green-950';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'border-red-500 bg-red-50 dark:bg-red-950';
                }
              } else if (isSelected) {
                optionStyle = 'border-violet-500 bg-violet-50 dark:bg-violet-950';
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
                    <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-mono">{option}</span>
                  </div>
                  {hasAnswered && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {hasAnswered && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500" />
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
              <p className="font-medium mb-1">
                {isCorrect ? '✨ Correct !' : '💡 Explication'}
              </p>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600"
          >
            {hasAnswered ? (
              <>
                {currentQuestionIndex < LEVEL_TEST_QUESTIONS.length - 1 ? 'Question suivante' : 'Voir mon résultat'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Valider ma réponse'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
