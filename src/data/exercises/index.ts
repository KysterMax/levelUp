import { quizExercises } from './quiz';
import { challengeExercises } from './challenges';
import { fetchExercises } from './fetch';
import { reviewExercises } from './reviews';
import type { Exercise, Difficulty } from '@/types';

// All exercises combined
export const allExercises: Exercise[] = [
  ...quizExercises,
  ...challengeExercises,
  ...fetchExercises,
  ...reviewExercises,
];

// Get exercises by type
export const getExercisesByType = (type: Exercise['type']) => {
  return allExercises.filter((ex) => ex.type === type);
};

// Get exercises by difficulty
export const getExercisesByDifficulty = (difficulty: Difficulty) => {
  return allExercises.filter((ex) => ex.difficulty === difficulty);
};

// Get exercises by category
export const getExercisesByCategory = (category: string) => {
  return allExercises.filter((ex) => ex.category === category);
};

// Get a random exercise
export const getRandomExercise = (
  type?: Exercise['type'],
  difficulty?: Difficulty
): Exercise | undefined => {
  let filtered = allExercises;

  if (type) {
    filtered = filtered.filter((ex) => ex.type === type);
  }
  if (difficulty) {
    filtered = filtered.filter((ex) => ex.difficulty === difficulty);
  }

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// Get exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return allExercises.find((ex) => ex.id === id);
};

// Export individual collections
export { quizExercises, challengeExercises, fetchExercises, reviewExercises };
