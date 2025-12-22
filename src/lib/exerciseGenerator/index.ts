/**
 * Dynamic Exercise Generator
 *
 * This module provides functionality to generate unique exercises
 * dynamically from templates with randomized variables.
 *
 * Usage:
 * ```ts
 * import { generateRandomQuiz, generateDailyQuiz, generatePracticeSession } from '@/lib/exerciseGenerator';
 *
 * // Generate a random quiz
 * const quiz = generateRandomQuiz();
 *
 * // Generate today's daily quiz (consistent for the day)
 * const dailyQuiz = generateDailyQuiz();
 *
 * // Generate a practice session
 * const session = generatePracticeSession('junior', 5);
 * ```
 */

export {
  generateQuizFromTemplate,
  generateQuizzes,
  generateRandomQuiz,
  generateDailyQuiz,
  generatePracticeSession,
  getTemplateStats,
  quizTemplates,
} from './generator';

export type {
  QuizTemplate,
  ChallengeTemplate,
  ReviewTemplate,
  GeneratedVariables,
  GenerateOptions,
  VariableConstraints,
  VariablePool,
} from './types';

export {
  VARIABLE_NAMES,
  FUNCTION_NAMES,
  PERSON_NAMES,
  PRODUCT_NAMES,
  NUMBER_POOLS,
  NUMBER_ARRAYS,
  STRING_ARRAYS,
  USER_OBJECTS,
  PRODUCT_OBJECTS,
  getRandomElement,
  getRandomElements,
  randomInRange,
  seededRandom,
  shuffleArray,
} from './pools';
