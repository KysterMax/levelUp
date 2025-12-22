import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useExerciseStore } from '@/stores/exerciseStore';
import { Lock, BookOpen, Code, Zap, Brain, Palette, TestTube, Globe, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Difficulty, ExerciseCategory } from '@/types';

interface LearningPath {
  id: ExerciseCategory;
  title: string;
  description: string;
  icon: typeof BookOpen;
  difficulty: Difficulty;
  color: string;
}

const ALL_PATHS: LearningPath[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Variables, types, fonctions, arrays, objets et ES6+',
    icon: Code,
    difficulty: 'junior',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'algorithms-searching',
    title: 'Algorithmes - Recherche',
    description: 'Recherche linéaire, binaire, complexité Big O',
    icon: Brain,
    difficulty: 'junior',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'algorithms-sorting',
    title: 'Algorithmes - Tri',
    description: 'Bubble sort, Merge sort, Quick sort',
    icon: Brain,
    difficulty: 'mid',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 'async-promises',
    title: 'Async & Promises',
    description: 'Promises, async/await, event loop',
    icon: Zap,
    difficulty: 'mid',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'fetch-api',
    title: 'Fetch API',
    description: 'GET, POST, PUT, DELETE, gestion d\'erreurs',
    icon: Globe,
    difficulty: 'junior',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns',
    description: 'Singleton, Factory, Observer, Strategy',
    icon: Palette,
    difficulty: 'mid',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'react-19-features',
    title: 'React 19 Patterns',
    description: 'useOptimistic, React Compiler, refs as props',
    icon: Code,
    difficulty: 'mid',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'react-hooks',
    title: 'React Hooks',
    description: 'useState, useEffect, custom hooks',
    icon: Code,
    difficulty: 'mid',
    color: 'from-sky-500 to-indigo-500',
  },
  {
    id: 'data-structures',
    title: 'Structures de Données',
    description: 'Stack, Queue, LinkedList, Trees',
    icon: Brain,
    difficulty: 'mid',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Types, interfaces, generics, type guards',
    icon: Code,
    difficulty: 'mid',
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 'clean-code',
    title: 'Clean Code & Security',
    description: 'SOLID, refactoring, bonnes pratiques, sécurité',
    icon: Eye,
    difficulty: 'senior',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'testing',
    title: 'Testing',
    description: 'Unit tests, integration tests, TDD',
    icon: TestTube,
    difficulty: 'senior',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Architecture, APIs, scaling',
    icon: Brain,
    difficulty: 'senior',
    color: 'from-amber-500 to-yellow-500',
  },
];

export function Learn() {
  const user = useCurrentUser();
  const { getExercises, completedExercises } = useExerciseStore();

  if (!user) return null;

  const isPathUnlocked = (path: LearningPath) => {
    // Junior paths are always unlocked
    if (path.difficulty === 'junior') return true;
    // Mid paths unlock at level 6+
    if (path.difficulty === 'mid' && user.stats.level >= 6) return true;
    // Senior paths unlock at level 15+
    if (path.difficulty === 'senior' && user.stats.level >= 15) return true;
    return false;
  };

  const getPathStats = (pathId: ExerciseCategory) => {
    const exercises = getExercises({ category: pathId });
    const completed = completedExercises.filter((c) =>
      exercises.some((e) => e.id === c.exerciseId)
    );
    return {
      total: exercises.length,
      completed: completed.length,
    };
  };

  const pathsByDifficulty = {
    junior: ALL_PATHS.filter((p) => p.difficulty === 'junior'),
    mid: ALL_PATHS.filter((p) => p.difficulty === 'mid'),
    senior: ALL_PATHS.filter((p) => p.difficulty === 'senior'),
  };

  const renderPathCard = (path: LearningPath) => {
    const Icon = path.icon;
    const unlocked = isPathUnlocked(path);
    const stats = getPathStats(path.id);
    const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return (
      <Card
        key={path.id}
        className={cn(
          'relative overflow-hidden transition-all',
          unlocked ? 'hover:shadow-md cursor-pointer' : 'opacity-60'
        )}
      >
        <div className={cn('h-1 bg-gradient-to-r', path.color)} />

        {!unlocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Niveau {path.difficulty === 'mid' ? '6' : '15'}+ requis
              </p>
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                path.color
              )}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <Badge
              className={cn(
                path.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
                path.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
                path.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
              )}
            >
              {path.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-base mt-3">{path.title}</CardTitle>
          <CardDescription className="text-sm">{path.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">
                {stats.completed}/{stats.total} exercices
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {unlocked && stats.total > 0 && (
            <Link to={`/learn/${path.id}`}>
              <Button className="w-full mt-4" variant="outline">
                {stats.completed > 0 ? 'Continuer' : 'Commencer'}
              </Button>
            </Link>
          )}

          {stats.total === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Bientôt disponible
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Parcours d'apprentissage</h1>
        <p className="text-muted-foreground">
          Progresse à travers les différents parcours pour monter en compétences
        </p>
      </div>

      {/* Junior Track */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Junior
          </Badge>
          <h2 className="text-lg font-semibold">Fondamentaux</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathsByDifficulty.junior.map(renderPathCard)}
        </div>
      </section>

      {/* Mid Track */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
            Mid
          </Badge>
          <h2 className="text-lg font-semibold">Niveau Intermédiaire</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathsByDifficulty.mid.map(renderPathCard)}
        </div>
      </section>

      {/* Senior Track */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            Senior
          </Badge>
          <h2 className="text-lg font-semibold">Niveau Avancé</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathsByDifficulty.senior.map(renderPathCard)}
        </div>
      </section>
    </div>
  );
}
