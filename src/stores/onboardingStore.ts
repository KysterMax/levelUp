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

// Pool de questions par niveau - une question aléatoire sera choisie dans chaque niveau
const QUESTION_POOL: Record<'basic' | 'intermediate' | 'advanced', LevelTestQuestion[]> = {
  basic: [
    {
      id: 'basic-1',
      level: 'basic',
      question: 'Que retourne ce code ?',
      code: `const arr = [1, 2, 3];
console.log(arr.map(x => x * 2));`,
      options: ['[1, 2, 3]', '[2, 4, 6]', 'undefined', 'Error'],
      correctIndex: 1,
      explanation: 'La méthode map() crée un nouveau tableau avec les résultats de l\'appel d\'une fonction sur chaque élément.',
    },
    {
      id: 'basic-2',
      level: 'basic',
      question: 'Que retourne typeof null ?',
      code: `console.log(typeof null);`,
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctIndex: 2,
      explanation: 'C\'est un bug historique de JavaScript. typeof null retourne "object" même si null n\'est pas un objet.',
    },
    {
      id: 'basic-3',
      level: 'basic',
      question: 'Que retourne ce code ?',
      code: `const x = [1, 2, 3];
const y = x;
y.push(4);
console.log(x.length);`,
      options: ['3', '4', 'undefined', 'Error'],
      correctIndex: 1,
      explanation: 'Les tableaux sont passés par référence. x et y pointent vers le même tableau en mémoire.',
    },
    {
      id: 'basic-4',
      level: 'basic',
      question: 'Quelle méthode permet de filtrer un tableau ?',
      code: `const nums = [1, 2, 3, 4, 5];
// Garder uniquement les nombres pairs`,
      options: ['nums.map()', 'nums.filter()', 'nums.reduce()', 'nums.find()'],
      correctIndex: 1,
      explanation: 'filter() crée un nouveau tableau avec les éléments qui passent le test de la fonction callback.',
    },
    {
      id: 'basic-5',
      level: 'basic',
      question: 'Que retourne ce code ?',
      code: `console.log('5' + 3);
console.log('5' - 3);`,
      options: ['"53" et 2', '8 et 2', '"53" et "53"', 'Error'],
      correctIndex: 0,
      explanation: 'L\'opérateur + concatène avec les strings, mais - convertit en nombre. Donc "5" + 3 = "53" et "5" - 3 = 2.',
    },
  ],
  intermediate: [
    {
      id: 'intermediate-1',
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
      explanation: 'Cette recherche linéaire parcourt le tableau une fois dans le pire cas, donc O(n).',
    },
    {
      id: 'intermediate-2',
      level: 'intermediate',
      question: 'Que fait la méthode Promise.all() ?',
      options: [
        'Exécute les promesses une par une',
        'Retourne la première promesse résolue',
        'Attend que toutes les promesses soient résolues',
        'Annule toutes les promesses en cours',
      ],
      correctIndex: 2,
      explanation: 'Promise.all() attend que toutes les promesses soient résolues et retourne un tableau des résultats.',
    },
    {
      id: 'intermediate-3',
      level: 'intermediate',
      question: 'Quelle est la complexité de la recherche binaire ?',
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correctIndex: 2,
      explanation: 'La recherche binaire divise l\'espace de recherche par 2 à chaque itération, donc O(log n).',
    },
    {
      id: 'intermediate-4',
      level: 'intermediate',
      question: 'Que retourne ce code async ?',
      code: `async function test() {
  return 'Hello';
}
console.log(test());`,
      options: ['"Hello"', 'Promise { "Hello" }', 'undefined', 'Error'],
      correctIndex: 1,
      explanation: 'Une fonction async retourne toujours une Promise, même si on retourne une valeur simple.',
    },
    {
      id: 'intermediate-5',
      level: 'intermediate',
      question: 'Quelle structure de données utilise LIFO ?',
      options: ['Queue', 'Stack', 'Array', 'LinkedList'],
      correctIndex: 1,
      explanation: 'Stack (pile) utilise Last In First Out. Le dernier élément ajouté est le premier retiré.',
    },
  ],
  advanced: [
    {
      id: 'advanced-1',
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
      explanation: 'Le pattern Singleton garantit qu\'une classe n\'a qu\'une seule instance.',
    },
    {
      id: 'advanced-2',
      level: 'advanced',
      question: 'Quel pattern est utilisé par addEventListener ?',
      code: `button.addEventListener('click', handler);`,
      options: ['Singleton', 'Observer', 'Factory', 'Strategy'],
      correctIndex: 1,
      explanation: 'Le pattern Observer permet de notifier plusieurs objets d\'un changement d\'état.',
    },
    {
      id: 'advanced-3',
      level: 'advanced',
      question: 'Quelle est la complexité spatiale du tri fusion (Merge Sort) ?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 2,
      explanation: 'Merge Sort nécessite O(n) espace supplémentaire pour stocker les sous-tableaux temporaires.',
    },
    {
      id: 'advanced-4',
      level: 'advanced',
      question: 'Qu\'est-ce que le principe SOLID "L" (Liskov) ?',
      options: [
        'Les classes doivent avoir une seule responsabilité',
        'Les sous-classes doivent pouvoir remplacer leurs classes parentes',
        'Dépendre des abstractions, pas des implémentations',
        'Les interfaces doivent être spécifiques',
      ],
      correctIndex: 1,
      explanation: 'Liskov Substitution : les objets d\'une sous-classe doivent pouvoir remplacer ceux de la classe parente.',
    },
    {
      id: 'advanced-5',
      level: 'advanced',
      question: 'Quel pattern permet de créer des objets sans spécifier leur classe exacte ?',
      code: `function createUser(type) {
  if (type === 'admin') return new Admin();
  if (type === 'guest') return new Guest();
  return new User();
}`,
      options: ['Singleton', 'Observer', 'Factory', 'Decorator'],
      correctIndex: 2,
      explanation: 'Le pattern Factory crée des objets sans exposer la logique de création au client.',
    },
  ],
};

// Fonction pour sélectionner des questions aléatoires
function selectRandomQuestions(): LevelTestQuestion[] {
  const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return [
    getRandomItem(QUESTION_POOL.basic),
    getRandomItem(QUESTION_POOL.intermediate),
    getRandomItem(QUESTION_POOL.advanced),
  ];
}

// Questions actuelles (seront randomisées au démarrage du test)
export let LEVEL_TEST_QUESTIONS: LevelTestQuestion[] = selectRandomQuestions();

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
        // Régénérer les questions aléatoirement à chaque nouveau test
        LEVEL_TEST_QUESTIONS = selectRandomQuestions();
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
