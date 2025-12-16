import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useExerciseStore } from '@/stores/exerciseStore';
import {
  ArrowLeft,
  CheckCircle,
  Play,
  Code,
  HelpCircle,
  Eye,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Exercise, ExerciseCategory } from '@/types';

const CATEGORY_TITLES: Record<ExerciseCategory, string> = {
  'javascript-fundamentals': 'JavaScript Fundamentals',
  'typescript': 'TypeScript',
  'algorithms-sorting': 'Algorithmes - Tri',
  'algorithms-searching': 'Algorithmes - Recherche',
  'algorithms-recursion': 'Algorithmes - Récursion',
  'data-structures': 'Structures de Données',
  'async-promises': 'Async & Promises',
  'fetch-api': 'Fetch API',
  'react-hooks': 'React Hooks',
  'react-19-features': 'React 19 Features',
  'design-patterns': 'Design Patterns',
  'testing': 'Testing',
  'system-design': 'System Design',
  'clean-code': 'Clean Code',
};

const TYPE_ICONS = {
  quiz: HelpCircle,
  challenge: Code,
  review: Eye,
  fetch: Globe,
};

const TYPE_LABELS = {
  quiz: 'Quiz',
  challenge: 'Code Challenge',
  review: 'Code Review',
  fetch: 'Fetch API',
};

export function PathDetail() {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const { getExercises, isExerciseCompleted, completedExercises } = useExerciseStore();

  if (!pathId) {
    return null;
  }

  const category = pathId as ExerciseCategory;
  const exercises = getExercises({ category });
  const categoryTitle = CATEGORY_TITLES[category] || pathId;

  const completedCount = exercises.filter((e) =>
    completedExercises.some((c) => c.exerciseId === e.id)
  ).length;
  const progressPercent = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  // Group by type
  const exercisesByType = exercises.reduce(
    (acc, ex) => {
      if (!acc[ex.type]) acc[ex.type] = [];
      acc[ex.type].push(ex);
      return acc;
    },
    {} as Record<Exercise['type'], Exercise[]>
  );

  const renderExerciseCard = (exercise: Exercise) => {
    const Icon = TYPE_ICONS[exercise.type];
    const completed = isExerciseCompleted(exercise.id);

    return (
      <Link key={exercise.id} to={`/exercise/id/${exercise.id}`}>
        <Card
          className={cn(
            'hover:shadow-md transition-all cursor-pointer',
            completed && 'border-green-500 bg-green-50/50 dark:bg-green-950/20'
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {TYPE_LABELS[exercise.type]}
                </Badge>
              </div>
              {completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Badge
                  className={cn(
                    exercise.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
                    exercise.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
                    exercise.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
                  )}
                >
                  +{exercise.xp} XP
                </Badge>
              )}
            </div>
            <CardTitle className="text-base mt-2">{exercise.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {exercise.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {exercise.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/learn')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux parcours
        </Button>
      </div>

      {/* Path Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{categoryTitle}</CardTitle>
              <CardDescription>
                {exercises.length} exercices disponibles
              </CardDescription>
            </div>
            {exercises.length > 0 && (
              <Link to={`/exercise/id/${exercises[0].id}`}>
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  {completedCount > 0 ? 'Continuer' : 'Commencer'}
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">
                {completedCount}/{exercises.length} complétés
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Exercises by Type */}
      {Object.entries(exercisesByType).map(([type, typeExercises]) => {
        const TypeIcon = TYPE_ICONS[type as Exercise['type']];
        return (
          <section key={type}>
            <div className="flex items-center gap-2 mb-4">
              <TypeIcon className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                {TYPE_LABELS[type as Exercise['type']]}
              </h2>
              <Badge variant="secondary">{typeExercises.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeExercises.map(renderExerciseCard)}
            </div>
          </section>
        );
      })}

      {exercises.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Aucun exercice disponible pour ce parcours pour l'instant.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/learn')}
            >
              Voir les autres parcours
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
