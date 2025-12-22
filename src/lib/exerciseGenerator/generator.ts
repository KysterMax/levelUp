import type { QuizExercise } from '@/types/exercise';
import type {
  QuizTemplate,
  GeneratedVariables,
  GenerateOptions,
  VariableConstraints,
} from './types';
import {
  VARIABLE_NAMES,
  PERSON_NAMES,
  getRandomElement,
  getRandomElements,
  randomInRange,
  seededRandom,
  generateExerciseId,
} from './pools';
import quizTemplates from './templates/quizTemplates';

/**
 * Exercise Generator - Creates dynamic exercises from templates
 */

/**
 * Generate random variables based on constraints
 */
function generateVariables(
  constraints?: VariableConstraints,
  seed: number = Date.now()
): GeneratedVariables {
  const numberMin = constraints?.numberRange?.min ?? 1;
  const numberMax = constraints?.numberRange?.max ?? 10;
  const arrayMin = constraints?.arrayLength?.min ?? 4;
  const arrayMax = constraints?.arrayLength?.max ?? 6;

  // Generate base variables
  const names = getRandomElements(VARIABLE_NAMES, 2, seed);
  const arrayLength = randomInRange(arrayMin, arrayMax, seed + 100);

  // Generate array with unique values
  const array: number[] = [];
  for (let i = 0; i < arrayLength; i++) {
    array.push(randomInRange(1, 10, seed + 200 + i));
  }

  return {
    name: names[0],
    name2: names[1],
    number: randomInRange(numberMin, numberMax, seed + 300),
    number2: randomInRange(numberMin, numberMax, seed + 400),
    string: getRandomElement(PERSON_NAMES, seed + 500),
    string2: getRandomElement(PERSON_NAMES, seed + 600),
    array,
    array2: getRandomElements(PERSON_NAMES, 4, seed + 700),
    object: generateContextObject(seed + 800),
    result: null,
    seed,
  };
}

/**
 * Generate a context object for more complex templates
 */
function generateContextObject(seed: number): Record<string, unknown> {
  const nullishValues = [null, undefined, 0, '', 'value'];
  const typeofValues = ['[]', '{}', 'null', '42', '"hello"', 'true', 'undefined'];

  return {
    nullishValue: getRandomElement(nullishValues, seed),
    typeofValue: getRandomElement(typeofValues, seed + 100),
    user: {
      id: randomInRange(1, 100, seed + 200),
      name: getRandomElement(PERSON_NAMES, seed + 300),
      age: randomInRange(18, 60, seed + 400),
    },
  };
}

/**
 * Replace template placeholders with actual values
 */
function replacePlaceholders(
  template: string,
  vars: GeneratedVariables
): string {
  return template
    .replace(/\{\{NAME\}\}/g, vars.name)
    .replace(/\{\{NAME2\}\}/g, vars.name2)
    .replace(/\{\{NUMBER\}\}/g, String(vars.number))
    .replace(/\{\{NUMBER2\}\}/g, String(vars.number2))
    .replace(/\{\{STRING\}\}/g, vars.string)
    .replace(/\{\{STRING2\}\}/g, vars.string2)
    .replace(/\{\{ARRAY\}\}/g, vars.array.join(', '))
    .replace(/\{\{ARRAY2\}\}/g, vars.array2.join(', '))
    .replace(/\{\{OBJECT\}\}/g, JSON.stringify(vars.object))
    .replace(/\{\{RESULT\}\}/g, String(vars.result))
    .replace(/\{\{VALUE\}\}/g, String(vars.object.nullishValue ?? 'null'));
}

/**
 * Generate a quiz exercise from a template
 */
export function generateQuizFromTemplate(
  template: QuizTemplate,
  seed: number = Date.now()
): QuizExercise {
  const vars = generateVariables(template.variableConstraints, seed);

  // Calculate result for explanation
  if (template.id.includes('reduce')) {
    vars.result = (vars.array as number[]).reduce((a, b) => a + b, 0);
  }

  const options = template.optionsGenerator(vars);
  const correctIndex = template.correctIndexGenerator(vars);

  return {
    id: generateExerciseId('quiz', seed),
    type: 'quiz',
    title: replacePlaceholders(template.titleTemplate, vars),
    description: replacePlaceholders(template.descriptionTemplate, vars),
    question: replacePlaceholders(template.questionTemplate, vars),
    code: template.codeTemplate
      ? replacePlaceholders(template.codeTemplate, vars)
      : undefined,
    options,
    correctIndex,
    explanation: replacePlaceholders(template.explanationTemplate, vars),
    difficulty: template.difficulty,
    category: template.category,
    tags: [...template.tags, 'generated'],
    xp: template.xp,
  };
}

/**
 * Generate multiple quiz exercises
 */
export function generateQuizzes(
  count: number,
  options?: GenerateOptions
): QuizExercise[] {
  const exercises: QuizExercise[] = [];
  const usedTemplates = new Set<string>();
  const baseSeed = options?.seed ?? Date.now();

  let filteredTemplates = quizTemplates;

  // Filter by difficulty
  if (options?.difficulty) {
    filteredTemplates = filteredTemplates.filter(
      t => t.difficulty === options.difficulty
    );
  }

  // Filter by category
  if (options?.category) {
    filteredTemplates = filteredTemplates.filter(
      t => t.category === options.category
    );
  }

  for (let i = 0; i < count && i < filteredTemplates.length * 3; i++) {
    const seed = baseSeed + i * 1000;
    const templateIndex = Math.floor(seededRandom(seed) * filteredTemplates.length);
    const template = filteredTemplates[templateIndex];

    // Avoid too many from same template
    const templateUseCount = [...usedTemplates].filter(
      t => t.startsWith(template.id)
    ).length;

    if (templateUseCount < 2) {
      const exercise = generateQuizFromTemplate(template, seed);

      // Check if not in excludeIds
      if (!options?.excludeIds?.includes(exercise.id)) {
        exercises.push(exercise);
        usedTemplates.add(`${template.id}_${i}`);
      }
    }
  }

  return exercises;
}

/**
 * Generate a single random quiz
 */
export function generateRandomQuiz(options?: GenerateOptions): QuizExercise {
  const seed = options?.seed ?? Date.now();
  let templates = quizTemplates;

  if (options?.difficulty) {
    templates = templates.filter(t => t.difficulty === options.difficulty);
  }

  if (options?.category) {
    templates = templates.filter(t => t.category === options.category);
  }

  const template = getRandomElement(templates, seed);
  return generateQuizFromTemplate(template, seed);
}

/**
 * Generate a daily quiz (consistent for the day)
 */
export function generateDailyQuiz(): QuizExercise {
  const today = new Date();
  const daySeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return generateRandomQuiz({ seed: daySeed });
}

/**
 * Generate exercises for a practice session
 */
export function generatePracticeSession(
  difficulty: 'junior' | 'mid' | 'senior',
  count: number = 5
): QuizExercise[] {
  const seed = Date.now();

  return generateQuizzes(count, {
    difficulty,
    seed,
  });
}

/**
 * Get available template count by category
 */
export function getTemplateStats(): Record<string, number> {
  const stats: Record<string, number> = {};

  for (const template of quizTemplates) {
    const key = `${template.category}_${template.difficulty}`;
    stats[key] = (stats[key] || 0) + 1;
  }

  return stats;
}

// Export templates for inspection
export { quizTemplates };
