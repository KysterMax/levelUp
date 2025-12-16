import type { CodeChallenge } from '@/types';

export const challengeExercises: CodeChallenge[] = [
  // ============ JUNIOR - Basic Algorithms ============
  {
    id: 'challenge_001',
    type: 'challenge',
    title: 'Binary Search',
    description: `Objectif : Implémente l'algorithme de recherche binaire (dichotomie).

Contexte : Tu reçois un tableau de nombres DÉJÀ TRIÉ en ordre croissant et une valeur cible.

Ce que tu dois faire :
1. Trouve l'index de la valeur cible dans le tableau
2. Si la valeur n'existe pas, retourne -1

Principe de la recherche binaire :
- Compare la cible avec l'élément du milieu
- Si égal → trouvé !
- Si cible < milieu → cherche dans la moitié gauche
- Si cible > milieu → cherche dans la moitié droite
- Répète jusqu'à trouver ou épuiser les options`,
    starterCode: `function binarySearch(arr: number[], target: number): number {
  // arr est trié en ordre croissant
  // Retourne l'index de target, ou -1 si non trouvé

}`,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 3], expected: 2, description: 'Élément au milieu' },
      { input: [[1, 2, 3, 4, 5], 1], expected: 0, description: 'Premier élément' },
      { input: [[1, 2, 3, 4, 5], 5], expected: 4, description: 'Dernier élément' },
      { input: [[1, 2, 3, 4, 5], 6], expected: -1, description: 'Élément absent' },
    ],
    hints: [
      'Utilise deux pointeurs : left et right',
      'Calcule le milieu avec Math.floor((left + right) / 2)',
      'Compare l\'élément du milieu avec target pour décider où chercher',
    ],
    solution: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
    difficulty: 'junior',
    category: 'algorithms-searching',
    tags: ['binary-search', 'algorithms'],
    xp: 25,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'challenge_002',
    type: 'challenge',
    title: 'Reverse String',
    description: `Objectif : Inverse une chaîne de caractères.

Ce que tu dois faire :
- Prends une chaîne comme "hello"
- Retourne la chaîne inversée : "olleh"

Contrainte : Tu ne peux PAS utiliser la méthode .reverse()

Exemples :
- "hello" → "olleh"
- "world" → "dlrow"
- "a" → "a"
- "" → ""`,
    starterCode: `function reverseString(str: string): string {
  // Retourne la chaîne inversée
  // Interdit d'utiliser .reverse()

}`,
    testCases: [
      { input: ['hello'], expected: 'olleh', description: 'Mot simple' },
      { input: ['world'], expected: 'dlrow', description: 'Autre mot' },
      { input: ['a'], expected: 'a', description: 'Un seul caractère' },
      { input: [''], expected: '', description: 'Chaîne vide' },
    ],
    hints: [
      'Tu peux utiliser une boucle for qui parcourt de la fin au début',
      'Ou utiliser split() puis construire une nouvelle chaîne',
      'Pense à la technique des deux pointeurs',
    ],
    solution: `function reverseString(str: string): string {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}`,
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['strings', 'algorithms'],
    xp: 20,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_003',
    type: 'challenge',
    title: 'FizzBuzz',
    description:
      'Retourne un tableau de 1 à n où les multiples de 3 sont "Fizz", de 5 sont "Buzz", et des deux sont "FizzBuzz".',
    starterCode: `function fizzBuzz(n: number): (string | number)[] {
  // Retourne un tableau de 1 à n
  // Multiple de 3 -> "Fizz"
  // Multiple de 5 -> "Buzz"
  // Multiple de 3 ET 5 -> "FizzBuzz"
  // Sinon -> le nombre

}`,
    testCases: [
      {
        input: [5],
        expected: [1, 2, 'Fizz', 4, 'Buzz'],
        description: 'De 1 à 5',
      },
      {
        input: [15],
        expected: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'],
        description: 'De 1 à 15',
      },
      { input: [1], expected: [1], description: 'Juste 1' },
    ],
    hints: [
      'Commence par vérifier si divisible par 3 ET 5',
      'Utilise l\'opérateur modulo (%)',
      'L\'ordre des conditions est important',
    ],
    solution: `function fizzBuzz(n: number): (string | number)[] {
  const result: (string | number)[] = [];

  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(i);
    }
  }

  return result;
}`,
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['loops', 'conditions'],
    xp: 20,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_004',
    type: 'challenge',
    title: 'Two Sum',
    description: `Objectif : Trouve deux nombres dont la somme égale une valeur cible.

Ce que tu reçois :
- Un tableau de nombres (nums)
- Une valeur cible (target)

Ce que tu dois retourner :
- Les INDICES (positions) des deux nombres dont la somme = target
- Il existe toujours exactement une solution

Exemple :
nums = [2, 7, 11, 15], target = 9
→ Retourne [0, 1] car nums[0] + nums[1] = 2 + 7 = 9

Astuce : Une HashMap peut t'aider à optimiser !`,
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Retourne les indices des deux nombres
  // dont la somme égale target
  // Il existe toujours une solution unique

}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: '2 + 7 = 9' },
      { input: [[3, 2, 4], 6], expected: [1, 2], description: '2 + 4 = 6' },
      { input: [[3, 3], 6], expected: [0, 1], description: '3 + 3 = 6' },
    ],
    hints: [
      'Solution naïve : deux boucles imbriquées O(n²)',
      'Solution optimale : utilise une Map pour stocker les valeurs vues',
      'Pour chaque nombre, cherche si (target - nombre) existe dans la Map',
    ],
    solution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
    difficulty: 'junior',
    category: 'algorithms-searching',
    tags: ['arrays', 'hashmap'],
    xp: 25,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_005',
    type: 'challenge',
    title: 'Palindrome Check',
    description: 'Vérifie si une chaîne est un palindrome (ignore la casse et les espaces).',
    starterCode: `function isPalindrome(str: string): boolean {
  // Retourne true si str est un palindrome
  // Ignore la casse et les espaces

}`,
    testCases: [
      { input: ['racecar'], expected: true, description: 'Palindrome simple' },
      { input: ['A man a plan a canal Panama'], expected: true, description: 'Avec espaces' },
      { input: ['hello'], expected: false, description: 'Non palindrome' },
      { input: [''], expected: true, description: 'Chaîne vide' },
    ],
    hints: [
      'Normalise d\'abord la chaîne (minuscules, sans espaces)',
      'Compare le premier et dernier caractère, puis avance',
      'Tu peux aussi comparer avec la version inversée',
    ],
    solution: `function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}`,
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['strings', 'two-pointers'],
    xp: 20,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },

  // ============ MID - Intermediate Algorithms ============
  {
    id: 'challenge_006',
    type: 'challenge',
    title: 'Merge Sort',
    description: `Objectif : Implémente l'algorithme de tri fusion (Merge Sort).

Principe "Diviser pour régner" :
1. DIVISER : Coupe le tableau en deux moitiés
2. CONQUÉRIR : Trie récursivement chaque moitié
3. FUSIONNER : Combine les deux moitiés triées

Comment fusionner deux tableaux triés :
- Compare les premiers éléments de chaque tableau
- Prends le plus petit, ajoute-le au résultat
- Répète jusqu'à ce que tous les éléments soient ajoutés

Cas de base : Un tableau de 0 ou 1 élément est déjà trié.

Exemple : [3, 1, 4, 1] → [1, 1] + [3, 4] → [1, 1, 3, 4]`,
    starterCode: `function mergeSort(arr: number[]): number[] {
  // Implémente le tri fusion
  // Divise, trie récursivement, fusionne

}`,
    testCases: [
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9], description: 'Tableau mixte' },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5], description: 'Ordre inverse' },
      { input: [[1]], expected: [1], description: 'Un élément' },
      { input: [[]], expected: [], description: 'Tableau vide' },
    ],
    hints: [
      'Divise le tableau en deux moitiés',
      'Appelle récursivement mergeSort sur chaque moitié',
      'Fusionne les deux moitiés triées avec une fonction merge',
    ],
    solution: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    difficulty: 'mid',
    category: 'algorithms-sorting',
    tags: ['merge-sort', 'recursion', 'divide-conquer'],
    xp: 35,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_007',
    type: 'challenge',
    title: 'Quick Sort',
    description: 'Implémente l\'algorithme de tri rapide (Quick Sort).',
    starterCode: `function quickSort(arr: number[]): number[] {
  // Implémente le tri rapide
  // Choisis un pivot, partitionne, trie récursivement

}`,
    testCases: [
      { input: [[3, 6, 8, 10, 1, 2, 1]], expected: [1, 1, 2, 3, 6, 8, 10], description: 'Tableau mixte' },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5], description: 'Ordre inverse' },
      { input: [[1]], expected: [1], description: 'Un élément' },
    ],
    hints: [
      'Choisis un pivot (souvent le dernier élément)',
      'Place les éléments plus petits à gauche, plus grands à droite',
      'Applique récursivement sur les deux parties',
    ],
    solution: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    difficulty: 'mid',
    category: 'algorithms-sorting',
    tags: ['quick-sort', 'recursion', 'divide-conquer'],
    xp: 35,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
  },
  {
    id: 'challenge_008',
    type: 'challenge',
    title: 'Fibonacci avec Mémoïsation',
    description: 'Calcule le n-ième nombre de Fibonacci avec mémoïsation.',
    starterCode: `function fibonacci(n: number): number {
  // Retourne le n-ième nombre de Fibonacci
  // Utilise la mémoïsation pour optimiser
  // F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)

}`,
    testCases: [
      { input: [0], expected: 0, description: 'F(0)' },
      { input: [1], expected: 1, description: 'F(1)' },
      { input: [10], expected: 55, description: 'F(10)' },
      { input: [20], expected: 6765, description: 'F(20)' },
    ],
    hints: [
      'La récursion naïve est O(2^n) - trop lent !',
      'Stocke les résultats déjà calculés dans un objet ou Map',
      'Vérifie le cache avant de calculer',
    ],
    solution: `function fibonacci(n: number): number {
  const memo: Record<number, number> = {};

  function fib(n: number): number {
    if (n in memo) return memo[n];
    if (n <= 1) return n;

    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
  }

  return fib(n);
}`,
    difficulty: 'mid',
    category: 'algorithms-recursion',
    tags: ['fibonacci', 'memoization', 'dynamic-programming'],
    xp: 30,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_009',
    type: 'challenge',
    title: 'Valid Parentheses',
    description: `Objectif : Vérifie si une chaîne de parenthèses est valide (bien équilibrée).

Types de parenthèses supportés : (), [], {}

Règles pour être valide :
1. Chaque parenthèse ouvrante doit avoir une fermante correspondante
2. Les parenthèses doivent être fermées dans le bon ordre
3. Pas de fermante avant son ouvrante

Exemples valides :
- "()" → true
- "()[]{}" → true
- "{[]}" → true (imbrication correcte)

Exemples invalides :
- "(]" → false (mauvaise correspondance)
- "([)]" → false (croisement interdit)
- "(" → false (non fermée)

Astuce : Utilise une pile (stack) !`,
    starterCode: `function isValid(s: string): boolean {
  // Vérifie si les parenthèses sont équilibrées
  // Types: (), [], {}

}`,
    testCases: [
      { input: ['()'], expected: true, description: 'Parenthèses simples' },
      { input: ['()[]{}'], expected: true, description: 'Tous les types' },
      { input: ['(]'], expected: false, description: 'Non correspondant' },
      { input: ['{[]}'], expected: true, description: 'Imbriqué' },
      { input: ['([)]'], expected: false, description: 'Croisé invalide' },
    ],
    hints: [
      'Utilise une pile (stack)',
      'Pour chaque ouvrante, empile-la',
      'Pour chaque fermante, vérifie si elle correspond au sommet',
    ],
    solution: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
    difficulty: 'mid',
    category: 'data-structures',
    tags: ['stack', 'strings'],
    xp: 30,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },

  // ============ SENIOR - Advanced Algorithms ============
  {
    id: 'challenge_010',
    type: 'challenge',
    title: 'LRU Cache',
    description: 'Implémente un cache LRU (Least Recently Used) avec get et put en O(1).',
    starterCode: `class LRUCache {
  constructor(capacity: number) {
    // Initialise le cache avec la capacité donnée
  }

  get(key: number): number {
    // Retourne la valeur ou -1 si non trouvée
  }

  put(key: number, value: number): void {
    // Insère ou met à jour la valeur
    // Évince l'élément LRU si capacité dépassée
  }
}`,
    testCases: [
      {
        input: [['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]],
        expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
        description: 'Opérations LRU complètes',
      },
    ],
    hints: [
      'Utilise une Map pour O(1) lookup',
      'La Map JS maintient l\'ordre d\'insertion',
      'Supprime et réinsère pour marquer comme récemment utilisé',
    ],
    solution: `class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`,
    difficulty: 'senior',
    category: 'data-structures',
    tags: ['cache', 'design', 'hashmap'],
    xp: 45,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(capacity)',
  },
  {
    id: 'challenge_011',
    type: 'challenge',
    title: 'Longest Substring Without Repeating',
    description: 'Trouve la longueur de la plus longue sous-chaîne sans caractères répétés.',
    starterCode: `function lengthOfLongestSubstring(s: string): number {
  // Retourne la longueur de la plus longue sous-chaîne
  // sans caractères qui se répètent

}`,
    testCases: [
      { input: ['abcabcbb'], expected: 3, description: '"abc" est la plus longue' },
      { input: ['bbbbb'], expected: 1, description: 'Tous identiques' },
      { input: ['pwwkew'], expected: 3, description: '"wke" ou "kew"' },
      { input: [''], expected: 0, description: 'Chaîne vide' },
    ],
    hints: [
      'Technique sliding window',
      'Utilise un Set pour tracker les caractères actuels',
      'Déplace la fenêtre quand tu trouves un doublon',
    ],
    solution: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
    difficulty: 'senior',
    category: 'algorithms-searching',
    tags: ['sliding-window', 'hashset', 'strings'],
    xp: 40,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, m))',
  },
  {
    id: 'challenge_012',
    type: 'challenge',
    title: 'Debounce Function',
    description: 'Implémente une fonction debounce qui limite les appels répétés.',
    starterCode: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // Retourne une fonction qui n'exécute func
  // qu'après "wait" ms sans nouvel appel

}`,
    testCases: [
      {
        input: ['test'],
        expected: 'delayed',
        description: 'Exécute après délai',
      },
    ],
    hints: [
      'Utilise setTimeout et clearTimeout',
      'Stocke le timeoutId dans une closure',
      'Annule le timeout précédent à chaque appel',
    ],
    solution: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}`,
    difficulty: 'senior',
    category: 'javascript-fundamentals',
    tags: ['debounce', 'closures', 'timing'],
    xp: 35,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
  },

  // ============ ADDITIONAL JUNIOR - More Basic Algorithms ============
  {
    id: 'challenge_013',
    type: 'challenge',
    title: 'Count Vowels',
    description: 'Compte le nombre de voyelles dans une chaîne.',
    starterCode: `function countVowels(str: string): number {
  // Compte les voyelles (a, e, i, o, u)
  // Insensible à la casse

}`,
    testCases: [
      { input: ['hello'], expected: 2, description: 'e et o' },
      { input: ['AEIOU'], expected: 5, description: 'Toutes les voyelles en majuscule' },
      { input: ['rhythm'], expected: 0, description: 'Pas de voyelles' },
      { input: [''], expected: 0, description: 'Chaîne vide' },
    ],
    hints: [
      'Convertis en minuscules avec toLowerCase()',
      'Utilise includes() ou un Set pour vérifier les voyelles',
      'filter() ou reduce() peuvent être utiles',
    ],
    solution: `function countVowels(str: string): number {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  return [...str.toLowerCase()].filter(char => vowels.has(char)).length;
}`,
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['strings', 'counting'],
    xp: 15,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'challenge_014',
    type: 'challenge',
    title: 'Find Maximum',
    description: 'Trouve le plus grand nombre dans un tableau sans utiliser Math.max.',
    starterCode: `function findMax(arr: number[]): number {
  // Trouve le maximum sans Math.max
  // Retourne -Infinity si tableau vide

}`,
    testCases: [
      { input: [[1, 5, 3, 9, 2]], expected: 9, description: 'Tableau normal' },
      { input: [[-5, -1, -10]], expected: -1, description: 'Nombres négatifs' },
      { input: [[42]], expected: 42, description: 'Un seul élément' },
      { input: [[]], expected: -Infinity, description: 'Tableau vide' },
    ],
    hints: [
      'Initialise max à -Infinity',
      'Parcours le tableau et compare chaque élément',
      'Tu peux aussi utiliser reduce()',
    ],
    solution: `function findMax(arr: number[]): number {
  if (arr.length === 0) return -Infinity;

  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
    difficulty: 'junior',
    category: 'algorithms-searching',
    tags: ['arrays', 'max'],
    xp: 15,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'challenge_015',
    type: 'challenge',
    title: 'Remove Duplicates',
    description: 'Supprime les doublons d\'un tableau en préservant l\'ordre.',
    starterCode: `function removeDuplicates(arr: number[]): number[] {
  // Retourne un nouveau tableau sans doublons
  // Préserve l'ordre d'apparition

}`,
    testCases: [
      { input: [[1, 2, 2, 3, 3, 3]], expected: [1, 2, 3], description: 'Doublons consécutifs' },
      { input: [[1, 2, 1, 2, 1]], expected: [1, 2], description: 'Doublons éparpillés' },
      { input: [[]], expected: [], description: 'Tableau vide' },
      { input: [[5]], expected: [5], description: 'Un élément' },
    ],
    hints: [
      'Un Set permet de tracker les éléments vus',
      'filter() avec un Set est une solution élégante',
      'Ou utilise simplement [...new Set(arr)]',
    ],
    solution: `function removeDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  return arr.filter(item => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}`,
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'duplicates', 'set'],
    xp: 20,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_016',
    type: 'challenge',
    title: 'Capitalize Words',
    description: 'Met en majuscule la première lettre de chaque mot.',
    starterCode: `function capitalizeWords(str: string): string {
  // Capitalise la première lettre de chaque mot
  // "hello world" -> "Hello World"

}`,
    testCases: [
      { input: ['hello world'], expected: 'Hello World', description: 'Deux mots' },
      { input: ['javaScript is fun'], expected: 'JavaScript Is Fun', description: 'Trois mots' },
      { input: ['a'], expected: 'A', description: 'Une lettre' },
      { input: [''], expected: '', description: 'Chaîne vide' },
    ],
    hints: [
      'split(\' \') pour séparer les mots',
      'charAt(0).toUpperCase() + slice(1) pour capitaliser',
      'join(\' \') pour reconstruire la chaîne',
    ],
    solution: `function capitalizeWords(str: string): string {
  if (!str) return '';
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}`,
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['strings', 'capitalize'],
    xp: 15,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },

  // ============ ADDITIONAL MID - More Intermediate ============
  {
    id: 'challenge_017',
    type: 'challenge',
    title: 'Flatten Array',
    description: 'Aplatis un tableau imbriqué sur un niveau.',
    starterCode: `function flatten(arr: any[]): any[] {
  // Aplatis le tableau sur un niveau
  // [[1, 2], [3, 4]] -> [1, 2, 3, 4]

}`,
    testCases: [
      { input: [[[1, 2], [3, 4]]], expected: [1, 2, 3, 4], description: 'Deux sous-tableaux' },
      { input: [[[1], [2, 3], [4]]], expected: [1, 2, 3, 4], description: 'Trois sous-tableaux' },
      { input: [[1, [2, 3], 4]], expected: [1, 2, 3, 4], description: 'Mixte' },
      { input: [[]], expected: [], description: 'Tableau vide' },
    ],
    hints: [
      'flat() est la solution native',
      'Ou utilise reduce avec concat',
      'spread operator peut aussi aider',
    ],
    solution: `function flatten(arr: any[]): any[] {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? val : [val]);
  }, []);
}`,
    difficulty: 'mid',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'flatten'],
    xp: 25,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_018',
    type: 'challenge',
    title: 'Group By',
    description: 'Groupe les éléments d\'un tableau par une propriété.',
    starterCode: `function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  // Groupe les éléments par la valeur de 'key'
  // [{name: 'a', type: 1}, {name: 'b', type: 1}]
  // -> { '1': [{name: 'a', type: 1}, {name: 'b', type: 1}] }

}`,
    testCases: [
      {
        input: [[{ name: 'a', type: 1 }, { name: 'b', type: 2 }, { name: 'c', type: 1 }], 'type'],
        expected: { '1': [{ name: 'a', type: 1 }, { name: 'c', type: 1 }], '2': [{ name: 'b', type: 2 }] },
        description: 'Grouper par type',
      },
    ],
    hints: [
      'Utilise reduce pour construire l\'objet résultat',
      'La clé doit être convertie en string',
      'Initialise chaque groupe comme tableau vide',
    ],
    solution: `function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}`,
    difficulty: 'mid',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'groupBy', 'reduce'],
    xp: 30,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'challenge_019',
    type: 'challenge',
    title: 'Deep Clone',
    description: 'Clone profondément un objet sans utiliser JSON.',
    starterCode: `function deepClone<T>(obj: T): T {
  // Clone profondément l'objet
  // Gère les objets et tableaux imbriqués

}`,
    testCases: [
      {
        input: [{ a: 1, b: { c: 2 } }],
        expected: { a: 1, b: { c: 2 } },
        description: 'Objet imbriqué',
      },
      {
        input: [[1, [2, 3]]],
        expected: [1, [2, 3]],
        description: 'Tableau imbriqué',
      },
    ],
    hints: [
      'Vérifie si c\'est un objet ou un tableau',
      'Récursion pour les valeurs imbriquées',
      'Gère les cas null et primitifs',
    ],
    solution: `function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}`,
    difficulty: 'mid',
    category: 'javascript-fundamentals',
    tags: ['clone', 'recursion', 'objects'],
    xp: 30,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },

  // ============ ADDITIONAL SENIOR - Expert Level ============
  {
    id: 'challenge_020',
    type: 'challenge',
    title: 'Throttle Function',
    description: 'Implémente une fonction throttle qui limite les appels.',
    starterCode: `function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  // Exécute func au maximum une fois par 'limit' ms

}`,
    testCases: [
      {
        input: ['test'],
        expected: 'throttled',
        description: 'Limite les appels',
      },
    ],
    hints: [
      'Track le dernier temps d\'exécution',
      'Compare avec Date.now()',
      'N\'exécute que si assez de temps s\'est écoulé',
    ],
    solution: `function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
}`,
    difficulty: 'senior',
    category: 'javascript-fundamentals',
    tags: ['throttle', 'closures', 'timing'],
    xp: 35,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'challenge_021',
    type: 'challenge',
    title: 'Curry Function',
    description: 'Implémente une fonction curry.',
    starterCode: `function curry(fn: (...args: any[]) => any): (...args: any[]) => any {
  // Retourne une version curryfiée de fn
  // curry(add)(1)(2) === add(1, 2)

}`,
    testCases: [
      {
        input: [['add', 1, 2]],
        expected: 3,
        description: 'Addition curryfiée',
      },
    ],
    hints: [
      'Compte le nombre d\'arguments de fn (fn.length)',
      'Accumule les arguments jusqu\'à en avoir assez',
      'Utilise la récursion ou une closure',
    ],
    solution: `function curry(fn: (...args: any[]) => any): (...args: any[]) => any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
}`,
    difficulty: 'senior',
    category: 'javascript-fundamentals',
    tags: ['curry', 'functional', 'closures'],
    xp: 40,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
  },

  // ============ TYPESCRIPT CHALLENGES - Junior ============
  {
    id: 'challenge_ts_001',
    type: 'challenge',
    title: 'Typer une fonction',
    description: `Objectif : Ajoute les types TypeScript à cette fonction qui calcule la somme de deux nombres.

Ce que tu dois faire :
1. Ajoute le type des paramètres a et b (ce sont des nombres)
2. Ajoute le type de retour de la fonction

La fonction doit retourner la somme de a et b.`,
    starterCode: `// Ajoute les types aux paramètres et au retour
function add(a, b) {
  return a + b;
}`,
    testCases: [
      { input: [2, 3], expected: 5, description: 'add(2, 3) = 5' },
      { input: [-1, 1], expected: 0, description: 'add(-1, 1) = 0' },
      { input: [0, 0], expected: 0, description: 'add(0, 0) = 0' },
    ],
    hints: [
      'Les paramètres sont des nombres : utilisez le type "number"',
      'Syntaxe pour typer un paramètre : (param: type)',
      'Syntaxe pour typer le retour : function name(): returnType',
    ],
    solution: `function add(a: number, b: number): number {
  return a + b;
}`,
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'functions', 'basic-types'],
    xp: 15,
  },
  {
    id: 'challenge_ts_002',
    type: 'challenge',
    title: 'Créer une interface User',
    description: `Objectif : Crée une interface TypeScript pour représenter un utilisateur.

L'interface doit avoir ces propriétés :
- id : un nombre (obligatoire)
- name : une chaîne de caractères (obligatoire)
- email : une chaîne de caractères (obligatoire)
- age : un nombre (OPTIONNEL - l'utilisateur peut ne pas avoir renseigné son âge)

Ensuite, crée un objet "user" qui respecte cette interface.`,
    starterCode: `// Crée l'interface User avec les propriétés demandées
interface User {
  // Ajoute les propriétés ici
}

// Crée un objet user qui respecte l'interface
const user: User = {
  // Ajoute les valeurs ici
};`,
    testCases: [
      { input: [], expected: true, description: 'User a les propriétés requises' },
    ],
    hints: [
      'Pour rendre une propriété optionnelle, utilise le ? : age?: number',
      'Toutes les propriétés texte sont de type string',
      'N\'oublie pas de mettre des valeurs dans l\'objet user',
    ],
    solution: `interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};`,
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'interfaces', 'optional'],
    xp: 20,
  },
  {
    id: 'challenge_ts_003',
    type: 'challenge',
    title: 'Tableau typé',
    description: `Objectif : Crée une fonction qui filtre les nombres pairs d'un tableau.

Ce que tu dois faire :
1. Type le paramètre "numbers" comme un tableau de nombres
2. Type le retour de la fonction
3. Implémente la logique de filtrage

Rappel : Un nombre est pair si number % 2 === 0`,
    starterCode: `// Type les paramètres et le retour, puis implémente
function filterEven(numbers) {
  // Retourne uniquement les nombres pairs
}`,
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6], description: 'Filtre les pairs' },
      { input: [[1, 3, 5]], expected: [], description: 'Aucun pair' },
      { input: [[2, 4, 6]], expected: [2, 4, 6], description: 'Tous pairs' },
    ],
    hints: [
      'Un tableau de nombres se type : number[]',
      'Utilise la méthode filter() des tableaux',
      'La condition pour pair : n % 2 === 0',
    ],
    solution: `function filterEven(numbers: number[]): number[] {
  return numbers.filter(n => n % 2 === 0);
}`,
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'arrays', 'filter'],
    xp: 20,
  },

  // ============ TYPESCRIPT CHALLENGES - Mid ============
  {
    id: 'challenge_ts_004',
    type: 'challenge',
    title: 'Fonction générique identity',
    description: `Objectif : Crée une fonction générique qui retourne son argument sans le modifier.

Une fonction générique utilise un "type parameter" (souvent appelé T) qui sera déterminé
lors de l'appel de la fonction.

Ce que tu dois faire :
1. Ajoute un paramètre de type générique <T>
2. Type le paramètre "value" avec ce type T
3. Type le retour avec T
4. Retourne simplement value

Exemple d'utilisation :
- identity<string>("hello") retourne "hello" (type string)
- identity<number>(42) retourne 42 (type number)`,
    starterCode: `// Crée une fonction générique
function identity(value) {
  // Retourne la valeur telle quelle
}`,
    testCases: [
      { input: ['hello'], expected: 'hello', description: 'identity("hello") = "hello"' },
      { input: [42], expected: 42, description: 'identity(42) = 42' },
      { input: [true], expected: true, description: 'identity(true) = true' },
    ],
    hints: [
      'Syntaxe générique : function name<T>(param: T): T',
      'T est un placeholder pour le type réel',
      'La fonction ne fait que retourner son argument',
    ],
    solution: `function identity<T>(value: T): T {
  return value;
}`,
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'generics', 'identity'],
    xp: 25,
  },
  {
    id: 'challenge_ts_005',
    type: 'challenge',
    title: 'Type Guard personnalisé',
    description: `Objectif : Crée un type guard pour vérifier si une valeur est un objet User.

Un type guard est une fonction qui retourne un "type predicate" (param is Type).
Elle permet à TypeScript de "narrow" (réduire) le type après un if.

Ce que tu dois faire :
1. L'interface User est déjà définie (id: number, name: string)
2. Crée la fonction isUser qui :
   - Prend un paramètre "value" de type unknown
   - Retourne un type predicate : value is User
   - Vérifie que value est un objet non-null
   - Vérifie que value a une propriété "id" de type number
   - Vérifie que value a une propriété "name" de type string`,
    starterCode: `interface User {
  id: number;
  name: string;
}

// Crée le type guard
function isUser(value: unknown): value is User {
  // Vérifie si value est un User valide
}`,
    testCases: [
      { input: [{ id: 1, name: 'John' }], expected: true, description: 'User valide' },
      { input: [{ id: 'abc', name: 'John' }], expected: false, description: 'id invalide' },
      { input: [null], expected: false, description: 'null n\'est pas un User' },
      { input: [{ name: 'John' }], expected: false, description: 'id manquant' },
    ],
    hints: [
      'Vérifie d\'abord : typeof value === "object" && value !== null',
      'Cast temporaire : (value as User).id pour accéder aux propriétés',
      'Vérifie le type de chaque propriété avec typeof',
    ],
    solution: `interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof (value as User).id === 'number' &&
    typeof (value as User).name === 'string'
  );
}`,
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'type-guards', 'narrowing'],
    xp: 30,
  },
  {
    id: 'challenge_ts_006',
    type: 'challenge',
    title: 'Utility Type - Créer Required',
    description: `Objectif : Implémente ton propre utility type "MyRequired<T>" qui rend toutes les propriétés obligatoires.

C'est l'inverse de Partial<T>. Si une interface a des propriétés optionnelles (?),
MyRequired<T> doit les rendre obligatoires.

Ce que tu dois faire :
1. Crée un mapped type qui itère sur toutes les clés de T
2. Utilise le modificateur -? pour retirer l'optionalité
3. Garde le même type pour chaque propriété

Rappel mapped type : { [K in keyof T]: T[K] }
Le -? retire le ? des propriétés optionnelles.`,
    starterCode: `// Implémente MyRequired pour rendre toutes les props obligatoires
type MyRequired<T> = {
  // Utilise un mapped type avec -?
};

// Test - ne pas modifier
interface PartialUser {
  id?: number;
  name?: string;
}

type FullUser = MyRequired<PartialUser>;
// Devrait être : { id: number; name: string; }`,
    testCases: [
      { input: [], expected: true, description: 'Les props sont obligatoires' },
    ],
    hints: [
      'Mapped type : [K in keyof T]',
      '-? retire l\'optionalité : [K in keyof T]-?',
      'Le type de la valeur reste T[K]',
    ],
    solution: `type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

interface PartialUser {
  id?: number;
  name?: string;
}

type FullUser = MyRequired<PartialUser>;`,
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'mapped-types', 'utility-types'],
    xp: 30,
  },
  {
    id: 'challenge_ts_007',
    type: 'challenge',
    title: 'Fonction avec Generics contraints',
    description: `Objectif : Crée une fonction générique getProperty qui récupère une propriété d'un objet de façon type-safe.

La fonction doit :
1. Prendre un objet de type T
2. Prendre une clé K qui doit être une clé valide de T (constraint avec keyof)
3. Retourner la valeur correspondante avec le bon type T[K]

Exemple :
getProperty({ name: 'John', age: 30 }, 'name') // retourne 'John' (type string)
getProperty({ name: 'John', age: 30 }, 'age')  // retourne 30 (type number)`,
    starterCode: `// Crée la fonction avec les bons types génériques
function getProperty(obj, key) {
  return obj[key];
}`,
    testCases: [
      { input: [{ name: 'John', age: 30 }, 'name'], expected: 'John', description: 'Récupère name' },
      { input: [{ name: 'John', age: 30 }, 'age'], expected: 30, description: 'Récupère age' },
      { input: [{ x: 1, y: 2 }, 'x'], expected: 1, description: 'Récupère x' },
    ],
    hints: [
      'Deux paramètres de type : <T, K extends keyof T>',
      'obj est de type T, key est de type K',
      'Le retour est de type T[K] (indexed access type)',
    ],
    solution: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'generics', 'keyof', 'constraints'],
    xp: 30,
  },

  // ============ TYPESCRIPT CHALLENGES - Senior ============
  {
    id: 'challenge_ts_008',
    type: 'challenge',
    title: 'Discriminated Union avec exhaustive check',
    description: `Objectif : Crée un système de gestion d'actions Redux-style avec vérification exhaustive.

Tu dois :
1. Créer les types d'actions avec un discriminant "type"
2. Créer un type union de toutes les actions
3. Implémenter un reducer qui gère chaque action
4. Utiliser le pattern "exhaustive check" avec never pour garantir que tous les cas sont traités

Actions à supporter :
- INCREMENT : augmente count de 1
- DECREMENT : diminue count de 1
- SET : définit count à la valeur payload.value

Le exhaustive check utilise le fait que si tous les cas sont traités dans le switch,
le default case aura le type never (aucune valeur possible).`,
    starterCode: `// Définis les types d'action
type IncrementAction = { type: 'INCREMENT' };
type DecrementAction = { type: 'DECREMENT' };
type SetAction = { type: 'SET'; payload: { value: number } };

// Union de toutes les actions
type Action = IncrementAction | DecrementAction | SetAction;

interface State {
  count: number;
}

// Implémente le reducer avec exhaustive check
function reducer(state: State, action: Action): State {
  // switch sur action.type
  // N'oublie pas le default case avec exhaustive check
}

// Helper pour exhaustive check (ne pas modifier)
function assertNever(x: never): never {
  throw new Error('Unexpected action: ' + x);
}`,
    testCases: [
      { input: [{ count: 0 }, { type: 'INCREMENT' }], expected: { count: 1 }, description: 'INCREMENT' },
      { input: [{ count: 5 }, { type: 'DECREMENT' }], expected: { count: 4 }, description: 'DECREMENT' },
      { input: [{ count: 0 }, { type: 'SET', payload: { value: 10 } }], expected: { count: 10 }, description: 'SET' },
    ],
    hints: [
      'Utilise switch (action.type) pour le pattern matching',
      'Retourne un nouvel objet state pour chaque case',
      'Dans default, appelle assertNever(action) pour le exhaustive check',
    ],
    solution: `type IncrementAction = { type: 'INCREMENT' };
type DecrementAction = { type: 'DECREMENT' };
type SetAction = { type: 'SET'; payload: { value: number } };

type Action = IncrementAction | DecrementAction | SetAction;

interface State {
  count: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'SET':
      return { count: action.payload.value };
    default:
      return assertNever(action);
  }
}

function assertNever(x: never): never {
  throw new Error('Unexpected action: ' + x);
}`,
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'discriminated-unions', 'redux', 'exhaustive-check'],
    xp: 40,
  },
  {
    id: 'challenge_ts_009',
    type: 'challenge',
    title: 'Conditional Type - ExtractReturnType',
    description: `Objectif : Implémente un utility type qui extrait le type de retour d'une fonction.

Tu vas recréer le utility type ReturnType<T> de TypeScript.

Comment ça marche :
1. Utilise un conditional type avec extends
2. Si T est une fonction, utilise "infer R" pour capturer le type de retour
3. Sinon, retourne never

Syntaxe infer :
T extends (...args: any[]) => infer R ? R : never
- infer R "capture" le type de retour dans R
- Si T match le pattern fonction, on retourne R
- Sinon on retourne never`,
    starterCode: `// Implémente ExtractReturnType
type ExtractReturnType<T> = // Ton code ici

// Tests - ne pas modifier
type Test1 = ExtractReturnType<() => string>; // string
type Test2 = ExtractReturnType<(x: number) => boolean>; // boolean
type Test3 = ExtractReturnType<() => { name: string }>; // { name: string }`,
    testCases: [
      { input: [], expected: true, description: 'ExtractReturnType fonctionne' },
    ],
    hints: [
      'Pattern conditional type : T extends X ? Y : Z',
      'Pattern fonction : (...args: any[]) => infer R',
      'infer R capture le type de retour dans R',
    ],
    solution: `type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Test1 = ExtractReturnType<() => string>;
type Test2 = ExtractReturnType<(x: number) => boolean>;
type Test3 = ExtractReturnType<() => { name: string }>;`,
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'conditional-types', 'infer', 'utility-types'],
    xp: 40,
  },
  {
    id: 'challenge_ts_010',
    type: 'challenge',
    title: 'Builder Pattern typé',
    description: `Objectif : Implémente un Builder Pattern type-safe pour créer des objets User.

Le Builder doit :
1. Avoir des méthodes chaînables (setName, setEmail, setAge)
2. Chaque méthode retourne this pour permettre le chaînage
3. La méthode build() retourne un User complet

Bonus type-safety :
- Les méthodes retournent "this" pour le chaînage
- build() ne doit être appelable que si tous les champs requis sont définis

Pour cet exercice, on se concentre sur le chaînage basique.`,
    starterCode: `interface User {
  name: string;
  email: string;
  age?: number;
}

class UserBuilder {
  private user: Partial<User> = {};

  // Implémente setName - retourne this pour chaînage
  setName(name: string): this {
    // Ton code
  }

  // Implémente setEmail - retourne this pour chaînage
  setEmail(email: string): this {
    // Ton code
  }

  // Implémente setAge - retourne this pour chaînage
  setAge(age: number): this {
    // Ton code
  }

  // Implémente build - retourne User
  build(): User {
    // Vérifie que name et email sont définis
    // Retourne le User construit
  }
}`,
    testCases: [
      {
        input: [],
        expected: { name: 'John', email: 'john@example.com', age: 30 },
        description: 'Builder crée un User complet'
      },
    ],
    hints: [
      'Chaque setter : this.user.prop = value; return this;',
      'build() doit vérifier que name et email existent',
      'Utilise une assertion ou throw si des props manquent',
    ],
    solution: `interface User {
  name: string;
  email: string;
  age?: number;
}

class UserBuilder {
  private user: Partial<User> = {};

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  setAge(age: number): this {
    this.user.age = age;
    return this;
  }

  build(): User {
    if (!this.user.name || !this.user.email) {
      throw new Error('Name and email are required');
    }
    return this.user as User;
  }
}`,
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'builder-pattern', 'classes', 'design-patterns'],
    xp: 40,
  },
];
