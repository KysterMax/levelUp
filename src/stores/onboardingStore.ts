import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty } from '@/types';

export interface LevelTestQuestion {
  id: string;
  level: 'basic' | 'intermediate' | 'advanced';
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LevelResult {
  level: Difficulty;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockedPaths: string[];
}

interface OnboardingState {
  currentStep: 'welcome' | 'test' | 'result';
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  determinedLevel: Difficulty | null;
  levelResult: LevelResult | null;
  username: string;
  hasCompletedOnboarding: boolean;

  // Actions
  setUsername: (name: string) => void;
  startTest: () => void;
  answerQuestion: (answerIndex: number) => void;
  calculateResult: () => void;
  reset: () => void;
  skipOnboarding: () => void;
}

export const LEVEL_TEST_QUESTIONS: LevelTestQuestion[] = [
  {
    id: 'q1-fundamentals',
    level: 'basic',
    question: 'Que retourne ce code ?',
    code: `const arr = [1, 2, 3];
console.log(arr.map(x => x * 2));`,
    options: ['[1, 2, 3]', '[2, 4, 6]', 'undefined', 'Error'],
    correctIndex: 1,
    explanation:
      'La méthode map() crée un nouveau tableau avec les résultats de l\'appel d\'une fonction sur chaque élément. Ici, chaque élément est multiplié par 2.',
  },
  {
    id: 'q2-algorithms',
    level: 'intermediate',
    question: 'Quelle est la complexité temporelle de cette fonction ?',
    code: `function find(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
    correctIndex: 1,
    explanation:
      'Cette recherche linéaire parcourt le tableau une fois dans le pire cas, donc la complexité est O(n) où n est la taille du tableau.',
  },
  {
    id: 'q3-patterns',
    level: 'advanced',
    question: 'Quel design pattern est utilisé ici ?',
    code: `class Logger {
  private static instance: Logger;
  private constructor() {}

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}`,
    options: ['Factory', 'Observer', 'Singleton', 'Decorator'],
    correctIndex: 2,
    explanation:
      'Le pattern Singleton garantit qu\'une classe n\'a qu\'une seule instance et fournit un point d\'accès global à cette instance.',
  },
];

export const LEVEL_RESULTS: Record<string, LevelResult> = {
  'junior-beginner': {
    level: 'junior',
    title: 'Junior Padawan',
    description: 'Tu débutes ton voyage ! Les fondamentaux t\'attendent.',
    icon: '🌱',
    color: 'from-green-500 to-emerald-500',
    unlockedPaths: ['javascript-fundamentals', 'algorithms-basic'],
  },
  'junior-dev': {
    level: 'junior',
    title: 'Junior Developer',
    description: 'Bonne base ! Tu peux explorer plus de parcours.',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    unlockedPaths: ['javascript-fundamentals', 'algorithms-basic', 'async-promises'],
  },
  'mid-dev': {
    level: 'mid',
    title: 'Mid Developer',
    description: 'Impressionnant ! Tous les parcours sont débloqués.',
    icon: '🚀',
    color: 'from-violet-500 to-purple-500',
    unlockedPaths: ['javascript-fundamentals', 'algorithms-basic', 'async-promises', 'react-19-features'],
  },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 'welcome',
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      determinedLevel: null,
      levelResult: null,
      username: '',
      hasCompletedOnboarding: false,

      setUsername: (name: string) => {
        set({ username: name });
      },

      startTest: () => {
        set({
          currentStep: 'test',
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
        });
      },

      answerQuestion: (answerIndex: number) => {
        const { currentQuestionIndex, answers, score } = get();
        const question = LEVEL_TEST_QUESTIONS[currentQuestionIndex];
        const isCorrect = answerIndex === question.correctIndex;

        const newAnswers = [...answers, answerIndex];
        const newScore = isCorrect ? score + 1 : score;

        if (currentQuestionIndex < LEVEL_TEST_QUESTIONS.length - 1) {
          set({
            answers: newAnswers,
            score: newScore,
            currentQuestionIndex: currentQuestionIndex + 1,
          });
        } else {
          set({
            answers: newAnswers,
            score: newScore,
            currentStep: 'result',
          });
          get().calculateResult();
        }
      },

      calculateResult: () => {
        const { score } = get();
        let resultKey: string;

        if (score <= 1) {
          resultKey = 'junior-beginner';
        } else if (score === 2) {
          resultKey = 'junior-dev';
        } else {
          resultKey = 'mid-dev';
        }

        const levelResult = LEVEL_RESULTS[resultKey];

        set({
          determinedLevel: levelResult.level,
          levelResult,
          hasCompletedOnboarding: true,
        });
      },

      reset: () => {
        set({
          currentStep: 'welcome',
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          determinedLevel: null,
          levelResult: null,
          username: '',
          hasCompletedOnboarding: false,
        });
      },

      skipOnboarding: () => {
        const levelResult = LEVEL_RESULTS['junior-dev'];
        set({
          determinedLevel: levelResult.level,
          levelResult,
          hasCompletedOnboarding: true,
          currentStep: 'result',
        });
      },
    }),
    {
      name: 'levelup-onboarding',
    }
  )
);
