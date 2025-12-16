export type Difficulty = 'junior' | 'mid' | 'senior';

export type ExerciseCategory =
  | 'javascript-fundamentals'
  | 'typescript'
  | 'algorithms-sorting'
  | 'algorithms-searching'
  | 'algorithms-recursion'
  | 'data-structures'
  | 'async-promises'
  | 'fetch-api'
  | 'react-hooks'
  | 'react-19-features'
  | 'design-patterns'
  | 'testing'
  | 'system-design'
  | 'clean-code';

export type ExerciseType = 'quiz' | 'challenge' | 'fetch' | 'review';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: ExerciseCategory;
  tags: string[];
  xp: number;
}

export interface QuizExercise extends BaseExercise {
  type: 'quiz';
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestCase {
  input: unknown[];
  expected: unknown;
  description: string;
}

export interface CodeChallenge extends BaseExercise {
  type: 'challenge';
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  solution: string;
  timeLimit?: number;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface FetchChallenge extends BaseExercise {
  type: 'fetch';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  starterCode: string;
  expectedResponse: {
    type: 'array' | 'object';
    minLength?: number;
    requiredFields?: string[];
  };
  mockData?: unknown;
  hints: string[];
  solution: string;
}

export type IssueSeverity = 'low' | 'medium' | 'high';
export type IssueType = 'bug' | 'performance' | 'style' | 'security';

export interface CodeIssue {
  line: number;
  type: IssueType;
  description: string;
  severity: IssueSeverity;
}

export interface CodeReview extends BaseExercise {
  type: 'review';
  code: string;
  issues: CodeIssue[];
}

export type Exercise = QuizExercise | CodeChallenge | FetchChallenge | CodeReview;

export interface ExerciseResult {
  exerciseId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  timeSpent: number;
  attempts: number;
  completedAt?: Date;
}
