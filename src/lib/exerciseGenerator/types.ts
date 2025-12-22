import type { Difficulty, ExerciseCategory, ExerciseType } from '@/types/exercise';

/**
 * Types for the dynamic exercise generation system
 */

// Variable pools for randomization
export interface VariablePool {
  names: string[];
  numbers: number[];
  strings: string[];
  arrays: {
    numbers: number[][];
    strings: string[][];
  };
  objects: Record<string, unknown>[];
}

// Template placeholders
export type TemplatePlaceholder =
  | '{{NAME}}'
  | '{{NAME2}}'
  | '{{NUMBER}}'
  | '{{NUMBER2}}'
  | '{{STRING}}'
  | '{{STRING2}}'
  | '{{ARRAY}}'
  | '{{ARRAY2}}'
  | '{{OBJECT}}'
  | '{{RESULT}}';

// Quiz template
export interface QuizTemplate {
  id: string;
  type: 'quiz';
  titleTemplate: string;
  descriptionTemplate: string;
  questionTemplate: string;
  codeTemplate?: string;
  optionsGenerator: (vars: GeneratedVariables) => string[];
  correctIndexGenerator: (vars: GeneratedVariables) => number;
  explanationTemplate: string;
  difficulty: Difficulty;
  category: ExerciseCategory;
  tags: string[];
  xp: number;
  variableConstraints?: VariableConstraints;
}

// Challenge template
export interface ChallengeTemplate {
  id: string;
  type: 'challenge';
  titleTemplate: string;
  descriptionTemplate: string;
  starterCodeTemplate: string;
  testCaseGenerator: (vars: GeneratedVariables) => Array<{
    input: unknown[];
    expected: unknown;
    description: string;
  }>;
  hintsTemplate: string[];
  solutionTemplate: string;
  difficulty: Difficulty;
  category: ExerciseCategory;
  tags: string[];
  xp: number;
  timeComplexity?: string;
  spaceComplexity?: string;
  variableConstraints?: VariableConstraints;
}

// Code Review template
export interface ReviewTemplate {
  id: string;
  type: 'review';
  titleTemplate: string;
  descriptionTemplate: string;
  codeGenerator: (vars: GeneratedVariables) => string;
  issuesGenerator: (vars: GeneratedVariables) => Array<{
    line: number;
    type: 'bug' | 'performance' | 'style' | 'security';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  difficulty: Difficulty;
  category: ExerciseCategory;
  tags: string[];
  xp: number;
  variableConstraints?: VariableConstraints;
}

export type ExerciseTemplate = QuizTemplate | ChallengeTemplate | ReviewTemplate;

// Constraints for variable generation
export interface VariableConstraints {
  numberRange?: { min: number; max: number };
  arrayLength?: { min: number; max: number };
  stringLength?: { min: number; max: number };
  unique?: boolean;
}

// Generated variables for a specific exercise instance
export interface GeneratedVariables {
  name: string;
  name2: string;
  number: number;
  number2: number;
  string: string;
  string2: string;
  array: number[];
  array2: string[];
  object: Record<string, unknown>;
  result: unknown;
  seed: number;
}

// Exercise generation options
export interface GenerateOptions {
  difficulty?: Difficulty;
  category?: ExerciseCategory;
  type?: ExerciseType;
  excludeIds?: string[];
  seed?: number;
}
