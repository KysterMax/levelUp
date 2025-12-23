import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, ArrowRight, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseCompleteModalProps {
  open: boolean;
  success: boolean;
  xpEarned: number;
  hasMoreExercises: boolean;
  onContinue: () => void;
  onDashboard: () => void;
}

export function ExerciseCompleteModal({
  open,
  success,
  xpEarned,
  hasMoreExercises,
  onContinue,
  onDashboard,
}: ExerciseCompleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center',
                success
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-gradient-to-br from-amber-500 to-orange-500'
              )}
            >
              {success ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <DialogTitle className="text-xl">
            {success ? 'Bien joué !' : 'Pas mal !'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {success
              ? 'Tu as réussi cet exercice avec succès.'
              : 'Continue à t\'entraîner pour t\'améliorer.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-2xl font-bold text-amber-500">+{xpEarned} XP</span>
        </div>

        <div className="flex flex-col gap-3">
          {hasMoreExercises && (
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Exercice suivant
            </Button>
          )}
          <Button
            variant={hasMoreExercises ? 'outline' : 'default'}
            onClick={onDashboard}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
