import type { QuizExercise } from '@/types';

export const quizExercises: QuizExercise[] = [
  // ============ JUNIOR - JavaScript Fundamentals ============
  {
    id: 'quiz_js_001',
    type: 'quiz',
    title: 'Array Methods - filter & map',
    description: 'Comprendre le chaînage des méthodes de tableau',
    question: 'Que retourne [1, 2, 3].filter(x => x > 1).map(x => x * 2) ?',
    code: 'const result = [1, 2, 3].filter(x => x > 1).map(x => x * 2);',
    options: ['[2, 4, 6]', '[4, 6]', '[2, 3]', '[1, 4, 6]'],
    correctIndex: 1,
    explanation:
      'filter(x => x > 1) garde [2, 3], puis map(x => x * 2) transforme en [4, 6].',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'filter', 'map'],
    xp: 10,
  },
  {
    id: 'quiz_js_002',
    type: 'quiz',
    title: 'Typeof Operator',
    description: 'Connaître les types JavaScript',
    question: 'Que retourne typeof [] ?',
    code: 'console.log(typeof []);',
    options: ['"array"', '"object"', '"undefined"', '"Array"'],
    correctIndex: 1,
    explanation:
      'En JavaScript, les arrays sont des objets. typeof [] retourne "object". Pour vérifier si c\'est un array, utilise Array.isArray().',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['types', 'typeof', 'arrays'],
    xp: 10,
  },
  {
    id: 'quiz_js_003',
    type: 'quiz',
    title: 'Spread Operator',
    description: 'Comprendre le spread operator',
    question: 'Que retourne [...[1, 2], ...[3, 4]] ?',
    code: 'const result = [...[1, 2], ...[3, 4]];',
    options: ['[[1, 2], [3, 4]]', '[1, 2, 3, 4]', '[[1, 2, 3, 4]]', 'Error'],
    correctIndex: 1,
    explanation:
      'Le spread operator (...) "étale" les éléments. Les deux arrays sont fusionnés en un seul: [1, 2, 3, 4].',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['spread', 'arrays'],
    xp: 10,
  },
  {
    id: 'quiz_js_004',
    type: 'quiz',
    title: 'Destructuring',
    description: 'Maîtriser la déstructuration',
    question: 'Quelle est la valeur de b après cette ligne ?',
    code: 'const { a, b = 10 } = { a: 5 };',
    options: ['undefined', '5', '10', 'Error'],
    correctIndex: 2,
    explanation:
      'La déstructuration permet des valeurs par défaut. b n\'existe pas dans l\'objet, donc b = 10.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['destructuring', 'objects'],
    xp: 10,
  },
  {
    id: 'quiz_js_005',
    type: 'quiz',
    title: 'Array reduce',
    description: 'Comprendre reduce',
    question: 'Que retourne [1, 2, 3, 4].reduce((acc, val) => acc + val, 0) ?',
    code: 'const result = [1, 2, 3, 4].reduce((acc, val) => acc + val, 0);',
    options: ['[1, 2, 3, 4]', '10', '24', '0'],
    correctIndex: 1,
    explanation:
      'reduce accumule les valeurs. 0 + 1 + 2 + 3 + 4 = 10.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'reduce'],
    xp: 10,
  },
  {
    id: 'quiz_js_006',
    type: 'quiz',
    title: 'Nullish Coalescing',
    description: 'Comprendre l\'opérateur ??',
    question: 'Que retourne null ?? "default" ?',
    code: 'const result = null ?? "default";',
    options: ['null', '"default"', 'undefined', 'Error'],
    correctIndex: 1,
    explanation:
      'L\'opérateur ?? retourne le côté droit si le côté gauche est null ou undefined.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['nullish', 'operators'],
    xp: 10,
  },
  {
    id: 'quiz_js_007',
    type: 'quiz',
    title: 'Optional Chaining',
    description: 'Utiliser le chaînage optionnel',
    question: 'Que retourne user?.address?.city si user = {} ?',
    code: 'const user = {};\nconst result = user?.address?.city;',
    options: ['Error', 'null', 'undefined', '""'],
    correctIndex: 2,
    explanation:
      'Le chaînage optionnel (?.) retourne undefined si une propriété n\'existe pas, sans lever d\'erreur.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['optional-chaining', 'objects'],
    xp: 10,
  },

  // ============ JUNIOR - Algorithms ============
  {
    id: 'quiz_algo_001',
    type: 'quiz',
    title: 'Complexité - Linear Search',
    description: 'Analyser la complexité algorithmique',
    question: 'Quelle est la complexité temporelle d\'une recherche linéaire ?',
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
    correctIndex: 1,
    explanation:
      'La recherche linéaire parcourt au maximum tous les éléments une fois, donc O(n).',
    difficulty: 'junior',
    category: 'algorithms-searching',
    tags: ['complexity', 'big-o', 'search'],
    xp: 10,
  },
  {
    id: 'quiz_algo_002',
    type: 'quiz',
    title: 'Complexité - Binary Search',
    description: 'Comprendre la recherche binaire',
    question: 'Quelle est la complexité temporelle d\'une recherche binaire ?',
    options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
    correctIndex: 3,
    explanation:
      'La recherche binaire divise l\'espace de recherche par 2 à chaque itération, donc O(log n).',
    difficulty: 'junior',
    category: 'algorithms-searching',
    tags: ['complexity', 'big-o', 'binary-search'],
    xp: 10,
  },
  {
    id: 'quiz_algo_003',
    type: 'quiz',
    title: 'Complexité - Nested Loops',
    description: 'Analyser les boucles imbriquées',
    question: 'Quelle est la complexité de ce code ?',
    code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i, j);
  }
}`,
    options: ['O(n)', 'O(n²)', 'O(2n)', 'O(n log n)'],
    correctIndex: 1,
    explanation:
      'Deux boucles imbriquées de 0 à n donnent n * n = n² opérations.',
    difficulty: 'junior',
    category: 'algorithms-sorting',
    tags: ['complexity', 'big-o', 'loops'],
    xp: 10,
  },

  // ============ MID - Async/Promises ============
  {
    id: 'quiz_async_001',
    type: 'quiz',
    title: 'Promise.all',
    description: 'Comprendre Promise.all',
    question: 'Que se passe-t-il si une des promises dans Promise.all() échoue ?',
    options: [
      'Les autres promises continuent',
      'Tout échoue immédiatement',
      'Elle est ignorée',
      'Retourne un tableau mixte',
    ],
    correctIndex: 1,
    explanation:
      'Promise.all() échoue dès qu\'une promise est rejetée (fail-fast). Utilise Promise.allSettled() pour attendre toutes les promises.',
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['promises', 'async'],
    xp: 15,
  },
  {
    id: 'quiz_async_002',
    type: 'quiz',
    title: 'Event Loop',
    description: 'Comprendre l\'event loop',
    question: 'Dans quel ordre s\'affichent ces logs ?',
    code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
    correctIndex: 1,
    explanation:
      'Les microtasks (Promises) s\'exécutent avant les macrotasks (setTimeout). Ordre: sync (1,4), microtask (3), macrotask (2).',
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['event-loop', 'promises', 'setTimeout'],
    xp: 15,
  },
  {
    id: 'quiz_async_003',
    type: 'quiz',
    title: 'Async/Await Error Handling',
    description: 'Gérer les erreurs avec async/await',
    question: 'Comment attraper une erreur dans une fonction async ?',
    options: [
      '.catch() sur la fonction',
      'try/catch dans la fonction',
      'Les deux sont valides',
      'Aucune des deux',
    ],
    correctIndex: 2,
    explanation:
      'Les erreurs async peuvent être attrapées avec try/catch à l\'intérieur ou .catch() à l\'extérieur.',
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['async', 'error-handling'],
    xp: 15,
  },

  // ============ MID - Design Patterns ============
  {
    id: 'quiz_pattern_001',
    type: 'quiz',
    title: 'Singleton Pattern',
    description: 'Identifier le pattern Singleton',
    question: 'Quel pattern est utilisé ici ?',
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
      'Le Singleton garantit une seule instance d\'une classe avec getInstance().',
    difficulty: 'mid',
    category: 'design-patterns',
    tags: ['singleton', 'patterns'],
    xp: 15,
  },
  {
    id: 'quiz_pattern_002',
    type: 'quiz',
    title: 'Observer Pattern',
    description: 'Comprendre le pattern Observer',
    question: 'Quel pattern permet de notifier plusieurs objets d\'un changement ?',
    options: ['Singleton', 'Factory', 'Observer', 'Strategy'],
    correctIndex: 2,
    explanation:
      'L\'Observer permet à un sujet de notifier automatiquement ses observateurs de changements.',
    difficulty: 'mid',
    category: 'design-patterns',
    tags: ['observer', 'patterns'],
    xp: 15,
  },
  {
    id: 'quiz_pattern_003',
    type: 'quiz',
    title: 'Factory Pattern',
    description: 'Identifier le pattern Factory',
    question: 'Quel est l\'avantage principal du pattern Factory ?',
    options: [
      'Garantir une seule instance',
      'Découpler la création d\'objets',
      'Observer les changements',
      'Décorer les objets',
    ],
    correctIndex: 1,
    explanation:
      'Le Factory découple la logique de création, permettant de créer des objets sans exposer la logique de création.',
    difficulty: 'mid',
    category: 'design-patterns',
    tags: ['factory', 'patterns'],
    xp: 15,
  },

  // ============ MID - React 19 ============
  {
    id: 'quiz_react_001',
    type: 'quiz',
    title: 'useOptimistic',
    description: 'Comprendre useOptimistic de React 19',
    question: 'Quel est le rôle principal du hook useOptimistic ?',
    options: [
      'Optimiser les re-renders automatiquement',
      'Mettre à jour l\'UI immédiatement avant la confirmation serveur',
      'Compiler le code React plus rapidement',
      'Gérer les erreurs de façon optimiste',
    ],
    correctIndex: 1,
    explanation:
      'useOptimistic permet de montrer un état "optimiste" à l\'utilisateur pendant qu\'une action async s\'exécute.',
    difficulty: 'mid',
    category: 'react-19-features',
    tags: ['react-19', 'hooks', 'useOptimistic'],
    xp: 15,
  },
  {
    id: 'quiz_react_002',
    type: 'quiz',
    title: 'React Compiler',
    description: 'Comprendre le React Compiler',
    question: 'Que fait le React Compiler en React 19 ?',
    options: [
      'Compile JSX en JavaScript',
      'Mémorise automatiquement les composants et valeurs',
      'Convertit TypeScript en JavaScript',
      'Optimise les images',
    ],
    correctIndex: 1,
    explanation:
      'Le React Compiler mémorise automatiquement, rendant useMemo, useCallback et memo souvent inutiles.',
    difficulty: 'mid',
    category: 'react-19-features',
    tags: ['react-19', 'compiler', 'optimization'],
    xp: 15,
  },
  {
    id: 'quiz_react_003',
    type: 'quiz',
    title: 'forwardRef en React 19',
    description: 'Changements de forwardRef',
    question: 'En React 19, comment passer une ref à un composant enfant ?',
    options: [
      'Utiliser forwardRef obligatoirement',
      'Passer ref directement comme prop',
      'Utiliser useImperativeHandle',
      'Ce n\'est pas possible',
    ],
    correctIndex: 1,
    explanation:
      'En React 19, les refs peuvent être passées directement comme props sans forwardRef.',
    difficulty: 'mid',
    category: 'react-19-features',
    tags: ['react-19', 'refs', 'forwardRef'],
    xp: 15,
  },

  // ============ SENIOR - Advanced ============
  {
    id: 'quiz_senior_001',
    type: 'quiz',
    title: 'Complexité Merge Sort',
    description: 'Analyser Merge Sort',
    question: 'Quelle est la complexité spatiale du Merge Sort ?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation:
      'Merge Sort nécessite un espace auxiliaire de O(n) pour fusionner les sous-tableaux.',
    difficulty: 'senior',
    category: 'algorithms-sorting',
    tags: ['merge-sort', 'complexity', 'space'],
    xp: 20,
  },
  {
    id: 'quiz_senior_002',
    type: 'quiz',
    title: 'SOLID - Single Responsibility',
    description: 'Principes SOLID',
    question: 'Que signifie le "S" dans SOLID ?',
    options: [
      'Secure Coding',
      'Single Responsibility Principle',
      'Simple Design',
      'Separation of Concerns',
    ],
    correctIndex: 1,
    explanation:
      'Single Responsibility Principle : une classe ne doit avoir qu\'une seule raison de changer.',
    difficulty: 'senior',
    category: 'clean-code',
    tags: ['solid', 'principles', 'architecture'],
    xp: 20,
  },
  {
    id: 'quiz_senior_003',
    type: 'quiz',
    title: 'REST vs GraphQL',
    description: 'Comparer REST et GraphQL',
    question: 'Quel est l\'avantage principal de GraphQL sur REST ?',
    options: [
      'Plus rapide',
      'Évite l\'over-fetching et under-fetching',
      'Plus simple à implémenter',
      'Meilleure sécurité',
    ],
    correctIndex: 1,
    explanation:
      'GraphQL permet de demander exactement les données nécessaires, évitant over/under-fetching.',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['graphql', 'rest', 'api'],
    xp: 20,
  },

  // ============ ADDITIONAL JUNIOR - More Fundamentals ============
  {
    id: 'quiz_js_008',
    type: 'quiz',
    title: 'Array includes',
    description: 'Vérifier la présence d\'un élément',
    question: 'Que retourne [1, 2, 3].includes(2) ?',
    code: 'const result = [1, 2, 3].includes(2);',
    options: ['1', 'true', 'false', '2'],
    correctIndex: 1,
    explanation:
      'includes() retourne true si l\'élément est présent dans le tableau.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'includes'],
    xp: 10,
  },
  {
    id: 'quiz_js_009',
    type: 'quiz',
    title: 'String Template Literals',
    description: 'Utiliser les template strings',
    question: 'Que retourne `Hello ${1 + 2}` ?',
    code: 'const result = `Hello ${1 + 2}`;',
    options: ['"Hello ${1 + 2}"', '"Hello 3"', '"Hello 1 + 2"', 'Error'],
    correctIndex: 1,
    explanation:
      'Les template literals évaluent les expressions dans ${}. 1 + 2 = 3.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['strings', 'template-literals'],
    xp: 10,
  },
  {
    id: 'quiz_js_010',
    type: 'quiz',
    title: 'Array findIndex',
    description: 'Trouver l\'index d\'un élément',
    question: 'Que retourne [5, 12, 8].findIndex(x => x > 10) ?',
    code: 'const result = [5, 12, 8].findIndex(x => x > 10);',
    options: ['12', '1', '2', '-1'],
    correctIndex: 1,
    explanation:
      'findIndex() retourne l\'index du premier élément satisfaisant la condition. 12 est à l\'index 1.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'findIndex'],
    xp: 10,
  },
  {
    id: 'quiz_js_011',
    type: 'quiz',
    title: 'Object.keys',
    description: 'Récupérer les clés d\'un objet',
    question: 'Que retourne Object.keys({a: 1, b: 2}) ?',
    code: 'const result = Object.keys({a: 1, b: 2});',
    options: ['[1, 2]', '["a", "b"]', '{a: 1, b: 2}', '["a: 1", "b: 2"]'],
    correctIndex: 1,
    explanation:
      'Object.keys() retourne un tableau contenant les clés de l\'objet.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['objects', 'keys'],
    xp: 10,
  },
  {
    id: 'quiz_js_012',
    type: 'quiz',
    title: 'Array every',
    description: 'Vérifier tous les éléments',
    question: 'Que retourne [2, 4, 6].every(x => x % 2 === 0) ?',
    code: 'const result = [2, 4, 6].every(x => x % 2 === 0);',
    options: ['[true, true, true]', 'true', 'false', '3'],
    correctIndex: 1,
    explanation:
      'every() retourne true si tous les éléments satisfont la condition. Tous sont pairs.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'every'],
    xp: 10,
  },
  {
    id: 'quiz_js_013',
    type: 'quiz',
    title: 'Truthy/Falsy Values',
    description: 'Comprendre les valeurs truthy et falsy',
    question: 'Lesquelles de ces valeurs sont falsy en JavaScript ?',
    options: [
      '0, "", null, undefined',
      '0, "0", null, []',
      '0, false, {}, undefined',
      '"", [], {}, null',
    ],
    correctIndex: 0,
    explanation:
      'Les valeurs falsy sont: false, 0, "", null, undefined, NaN. Les tableaux et objets vides sont truthy.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['truthy', 'falsy', 'conditions'],
    xp: 10,
  },

  // ============ ADDITIONAL MID - More Advanced ============
  {
    id: 'quiz_async_004',
    type: 'quiz',
    title: 'Promise.race',
    description: 'Comprendre Promise.race',
    question: 'Que retourne Promise.race([promise1, promise2]) ?',
    options: [
      'Un tableau avec les deux résultats',
      'La première promise résolue ou rejetée',
      'La promise la plus rapide résolue uniquement',
      'Toutes les promises en parallèle',
    ],
    correctIndex: 1,
    explanation:
      'Promise.race() retourne la première promise qui se termine, que ce soit en succès ou en échec.',
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['promises', 'race', 'async'],
    xp: 15,
  },
  {
    id: 'quiz_algo_004',
    type: 'quiz',
    title: 'Stack vs Queue',
    description: 'Différencier Stack et Queue',
    question: 'Quelle structure de données utilise le principe LIFO ?',
    options: ['Queue', 'Stack', 'Array', 'LinkedList'],
    correctIndex: 1,
    explanation:
      'Stack utilise LIFO (Last In, First Out). Queue utilise FIFO (First In, First Out).',
    difficulty: 'mid',
    category: 'data-structures',
    tags: ['stack', 'queue', 'data-structures'],
    xp: 15,
  },
  {
    id: 'quiz_algo_005',
    type: 'quiz',
    title: 'HashMap Complexity',
    description: 'Complexité des opérations HashMap',
    question: 'Quelle est la complexité moyenne d\'un lookup dans une HashMap ?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctIndex: 2,
    explanation:
      'Les HashMaps offrent un accès en O(1) en moyenne grâce au hashing.',
    difficulty: 'mid',
    category: 'data-structures',
    tags: ['hashmap', 'complexity', 'data-structures'],
    xp: 15,
  },
  {
    id: 'quiz_pattern_004',
    type: 'quiz',
    title: 'Strategy Pattern',
    description: 'Identifier le pattern Strategy',
    question: 'Quand utiliser le pattern Strategy ?',
    options: [
      'Pour créer un seul objet global',
      'Pour encapsuler des algorithmes interchangeables',
      'Pour observer des changements',
      'Pour décorer des objets',
    ],
    correctIndex: 1,
    explanation:
      'Le Strategy permet de définir une famille d\'algorithmes et de les rendre interchangeables.',
    difficulty: 'mid',
    category: 'design-patterns',
    tags: ['strategy', 'patterns'],
    xp: 15,
  },
  {
    id: 'quiz_react_004',
    type: 'quiz',
    title: 'useEffect Cleanup',
    description: 'Nettoyage dans useEffect',
    question: 'Quand la fonction de cleanup de useEffect est-elle appelée ?',
    options: [
      'Au premier render uniquement',
      'Avant chaque re-exécution de l\'effet et au unmount',
      'Seulement au unmount du composant',
      'Jamais automatiquement',
    ],
    correctIndex: 1,
    explanation:
      'Le cleanup s\'exécute avant chaque nouvelle exécution de l\'effet ET quand le composant se démonte.',
    difficulty: 'mid',
    category: 'react-hooks',
    tags: ['react', 'useEffect', 'cleanup'],
    xp: 15,
  },

  // ============ ADDITIONAL SENIOR - Expert Level ============
  {
    id: 'quiz_senior_004',
    type: 'quiz',
    title: 'Event Loop - Microtasks',
    description: 'Comprendre les microtasks en profondeur',
    question: 'Dans quel ordre s\'exécutent ces logs ?',
    code: `Promise.resolve().then(() => console.log('1'));
queueMicrotask(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    options: ['4, 1, 2, 3', '1, 2, 3, 4', '4, 2, 1, 3', '4, 1, 3, 2'],
    correctIndex: 0,
    explanation:
      'Le code synchrone (4) s\'exécute d\'abord, puis les microtasks dans l\'ordre de leur ajout (1, 2, 3).',
    difficulty: 'senior',
    category: 'async-promises',
    tags: ['event-loop', 'microtasks', 'advanced'],
    xp: 20,
  },
  {
    id: 'quiz_senior_005',
    type: 'quiz',
    title: 'WeakMap vs Map',
    description: 'Différences entre WeakMap et Map',
    question: 'Quel est l\'avantage principal de WeakMap sur Map ?',
    options: [
      'Plus rapide',
      'Accepte tout type de clé',
      'Permet le garbage collection des clés',
      'Itérable facilement',
    ],
    correctIndex: 2,
    explanation:
      'WeakMap n\'empêche pas le garbage collection des objets utilisés comme clés.',
    difficulty: 'senior',
    category: 'javascript-fundamentals',
    tags: ['weakmap', 'memory', 'gc'],
    xp: 20,
  },
  {
    id: 'quiz_senior_006',
    type: 'quiz',
    title: 'Dependency Injection',
    description: 'Comprendre l\'injection de dépendances',
    question: 'Quel est l\'avantage principal de la Dependency Injection ?',
    options: [
      'Rendre le code plus rapide',
      'Réduire la taille du bundle',
      'Faciliter les tests et le découplage',
      'Améliorer la sécurité',
    ],
    correctIndex: 2,
    explanation:
      'La DI permet d\'injecter des mocks pour les tests et réduit le couplage entre classes.',
    difficulty: 'senior',
    category: 'design-patterns',
    tags: ['di', 'testing', 'architecture'],
    xp: 20,
  },

  // ============ TYPESCRIPT - Junior ============
  {
    id: 'quiz_ts_001',
    type: 'quiz',
    title: 'Interface vs Type',
    description: 'Différences entre interface et type alias en TypeScript',
    question: 'Quelle est la principale différence entre interface et type en TypeScript ?',
    code: `interface User { name: string; }
type UserType = { name: string; };`,
    options: [
      'Aucune différence, c\'est identique',
      'Les interfaces peuvent être étendues/mergées, les types non',
      'Les types sont plus rapides à compiler',
      'Les interfaces ne supportent pas les méthodes',
    ],
    correctIndex: 1,
    explanation:
      'Les interfaces peuvent être étendues avec extends et automatiquement fusionnées (declaration merging). Les types utilisent & pour combiner et ne se fusionnent pas.',
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'interface', 'type'],
    xp: 10,
  },
  {
    id: 'quiz_ts_002',
    type: 'quiz',
    title: 'Type Annotation Basique',
    description: 'Comprendre les annotations de type',
    question: 'Comment déclarer une variable qui peut être soit un string soit un number ?',
    options: [
      'let x: string & number',
      'let x: string | number',
      'let x: string, number',
      'let x: (string, number)',
    ],
    correctIndex: 1,
    explanation:
      'L\'opérateur | (pipe) crée un type union. x: string | number signifie que x peut être un string OU un number.',
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'union', 'types'],
    xp: 10,
  },
  {
    id: 'quiz_ts_003',
    type: 'quiz',
    title: 'Type de retour',
    description: 'Spécifier le type de retour d\'une fonction',
    question: 'Quel est le type de retour de cette fonction ?',
    code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`,
    options: [
      'void',
      'any',
      'string',
      'unknown',
    ],
    correctIndex: 2,
    explanation:
      'Le type après les parenthèses (: string) indique le type de retour. Ici, la fonction retourne un string.',
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'functions', 'return-type'],
    xp: 10,
  },
  {
    id: 'quiz_ts_004',
    type: 'quiz',
    title: 'Optional Properties',
    description: 'Propriétés optionnelles dans les interfaces',
    question: 'Comment rendre la propriété "age" optionnelle ?',
    code: `interface User {
  name: string;
  age: number;  // Comment rendre optionnelle ?
}`,
    options: [
      'age: number | undefined',
      'age?: number',
      'age: number = undefined',
      'optional age: number',
    ],
    correctIndex: 1,
    explanation:
      'Le ? après le nom de la propriété la rend optionnelle. age?: number est équivalent à age: number | undefined.',
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'interface', 'optional'],
    xp: 10,
  },
  {
    id: 'quiz_ts_005',
    type: 'quiz',
    title: 'Array Typing',
    description: 'Typer un tableau en TypeScript',
    question: 'Quelles sont les deux syntaxes valides pour typer un tableau de nombres ?',
    options: [
      'number[] et Array<number>',
      'number[] et [number]',
      'Array(number) et number[]',
      'numbers et number[]',
    ],
    correctIndex: 0,
    explanation:
      'number[] et Array<number> sont deux syntaxes équivalentes pour typer un tableau de nombres.',
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'arrays', 'generics'],
    xp: 10,
  },
  {
    id: 'quiz_ts_006',
    type: 'quiz',
    title: 'Readonly',
    description: 'Propriétés en lecture seule',
    question: 'Que se passe-t-il si on essaie de modifier user.id ?',
    code: `interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: 'John' };
user.id = 2; // ?`,
    options: [
      'Ça fonctionne normalement',
      'Erreur à l\'exécution',
      'Erreur de compilation TypeScript',
      'La valeur est ignorée silencieusement',
    ],
    correctIndex: 2,
    explanation:
      'readonly empêche la modification après l\'initialisation. TypeScript lève une erreur à la compilation, pas à l\'exécution.',
    difficulty: 'junior',
    category: 'typescript',
    tags: ['typescript', 'readonly', 'immutability'],
    xp: 10,
  },

  // ============ TYPESCRIPT - Mid ============
  {
    id: 'quiz_ts_007',
    type: 'quiz',
    title: 'Generics Basiques',
    description: 'Comprendre les génériques',
    question: 'Que représente T dans cette fonction ?',
    code: `function identity<T>(arg: T): T {
  return arg;
}`,
    options: [
      'Un type fixe appelé T',
      'Un paramètre de type générique',
      'Une variable TypeScript spéciale',
      'Le type "Template"',
    ],
    correctIndex: 1,
    explanation:
      'T est un paramètre de type générique. Il sera remplacé par le type réel lors de l\'appel : identity<string>("hello") ou inféré automatiquement.',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'generics'],
    xp: 15,
  },
  {
    id: 'quiz_ts_008',
    type: 'quiz',
    title: 'Utility Type - Partial',
    description: 'Comprendre Partial<T>',
    question: 'Que fait Partial<User> ?',
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;`,
    options: [
      'Supprime toutes les propriétés',
      'Rend toutes les propriétés optionnelles',
      'Rend toutes les propriétés readonly',
      'Crée une copie du type User',
    ],
    correctIndex: 1,
    explanation:
      'Partial<T> transforme toutes les propriétés en optionnelles. PartialUser = { id?: number; name?: string; email?: string; }',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'utility-types', 'partial'],
    xp: 15,
  },
  {
    id: 'quiz_ts_009',
    type: 'quiz',
    title: 'Utility Type - Pick & Omit',
    description: 'Sélectionner ou exclure des propriétés',
    question: 'Que contient le type UserPreview ?',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;`,
    options: [
      '{ email: string; password: string; }',
      '{ id: number; name: string; }',
      '{ id: number; name: string; email: string; password: string; }',
      '{ name: string; }',
    ],
    correctIndex: 1,
    explanation:
      'Pick<T, K> sélectionne uniquement les propriétés listées. Ici, seuls id et name sont gardés.',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'utility-types', 'pick'],
    xp: 15,
  },
  {
    id: 'quiz_ts_010',
    type: 'quiz',
    title: 'Type Guard - typeof',
    description: 'Narrowing avec typeof',
    question: 'Quel type a "value" dans le bloc if ?',
    code: `function process(value: string | number) {
  if (typeof value === 'string') {
    // Quel type ici ?
    console.log(value.toUpperCase());
  }
}`,
    options: [
      'string | number',
      'string',
      'unknown',
      'any',
    ],
    correctIndex: 1,
    explanation:
      'TypeScript fait du "narrowing" : après le check typeof, il sait que value est un string dans ce bloc.',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'type-guards', 'narrowing'],
    xp: 15,
  },
  {
    id: 'quiz_ts_011',
    type: 'quiz',
    title: 'Type Guard - in operator',
    description: 'Narrowing avec l\'opérateur in',
    question: 'Pourquoi ce code compile sans erreur ?',
    code: `interface Cat { meow(): void; }
interface Dog { bark(): void; }

function speak(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow(); // Pourquoi c'est OK ?
  }
}`,
    options: [
      'TypeScript ignore les erreurs dans les if',
      'Le check "in" narrow le type vers Cat',
      'meow existe sur les deux types',
      'any est utilisé implicitement',
    ],
    correctIndex: 1,
    explanation:
      'L\'opérateur "in" sert de type guard. Si "meow" existe dans animal, TypeScript sait que c\'est un Cat.',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'type-guards', 'in-operator'],
    xp: 15,
  },
  {
    id: 'quiz_ts_012',
    type: 'quiz',
    title: 'Discriminated Unions',
    description: 'Unions discriminées pour le pattern matching',
    question: 'Quel est le "discriminant" dans ce code ?',
    code: `type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

function handle(result: Result) {
  if (result.status === 'success') {
    console.log(result.data);
  }
}`,
    options: [
      'data',
      'message',
      'status',
      'Result',
    ],
    correctIndex: 2,
    explanation:
      'Le discriminant est la propriété commune (status) avec des valeurs littérales différentes. Elle permet de différencier les types.',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'discriminated-unions', 'pattern-matching'],
    xp: 15,
  },
  {
    id: 'quiz_ts_013',
    type: 'quiz',
    title: 'Generic Constraints',
    description: 'Contraindre un type générique',
    question: 'Que signifie extends dans ce contexte ?',
    code: `function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}`,
    options: [
      'T hérite d\'une classe',
      'T doit avoir une propriété length',
      'T est égal au type { length: number }',
      'T peut être n\'importe quel type',
    ],
    correctIndex: 1,
    explanation:
      'extends ici est une contrainte : T doit au minimum avoir une propriété length de type number. Strings et arrays sont valides.',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'generics', 'constraints'],
    xp: 15,
  },
  {
    id: 'quiz_ts_014',
    type: 'quiz',
    title: 'keyof Operator',
    description: 'Extraire les clés d\'un type',
    question: 'Quel est le type de Keys ?',
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

type Keys = keyof User;`,
    options: [
      'string',
      '"id" | "name" | "email"',
      'string[]',
      '["id", "name", "email"]',
    ],
    correctIndex: 1,
    explanation:
      'keyof extrait les clés d\'un type comme une union de string literals : "id" | "name" | "email".',
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'keyof', 'mapped-types'],
    xp: 15,
  },

  // ============ TYPESCRIPT - Senior ============
  {
    id: 'quiz_ts_015',
    type: 'quiz',
    title: 'Conditional Types',
    description: 'Types conditionnels avancés',
    question: 'Quel est le type de Result ?',
    code: `type IsString<T> = T extends string ? 'yes' : 'no';

type Result = IsString<'hello'>;`,
    options: [
      'string',
      '"yes"',
      '"no"',
      'boolean',
    ],
    correctIndex: 1,
    explanation:
      '"hello" extends string (c\'est un sous-type), donc la condition est vraie et Result = "yes".',
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'conditional-types', 'advanced'],
    xp: 20,
  },
  {
    id: 'quiz_ts_016',
    type: 'quiz',
    title: 'Infer Keyword',
    description: 'Inférence dans les types conditionnels',
    question: 'Que fait le keyword "infer" ici ?',
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Result = ReturnType<() => string>;`,
    options: [
      'Il infère le type de retour R de la fonction',
      'Il crée un nouveau type R',
      'Il vérifie si R existe',
      'Il convertit T en R',
    ],
    correctIndex: 0,
    explanation:
      'infer capture (infère) le type de retour de la fonction dans R. ReturnType<() => string> = string.',
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'infer', 'conditional-types'],
    xp: 20,
  },
  {
    id: 'quiz_ts_017',
    type: 'quiz',
    title: 'Mapped Types',
    description: 'Transformer les propriétés d\'un type',
    question: 'Que produit ce mapped type ?',
    code: `type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User { id: number; name: string; }
type ReadonlyUser = Readonly<User>;`,
    options: [
      'Un type avec uniquement les clés de User',
      'Un type identique à User',
      'Un type où toutes les propriétés sont readonly',
      'Un type vide {}',
    ],
    correctIndex: 2,
    explanation:
      'Ce mapped type itère sur toutes les clés de T et ajoute readonly à chaque propriété. Résultat : { readonly id: number; readonly name: string; }',
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'mapped-types', 'readonly'],
    xp: 20,
  },
  {
    id: 'quiz_ts_018',
    type: 'quiz',
    title: 'Template Literal Types',
    description: 'Types avec template literals',
    question: 'Quel est le type de EventNames ?',
    code: `type Event = 'click' | 'focus';
type EventNames = \`on\${Capitalize<Event>}\`;`,
    options: [
      '"onClick" | "onFocus"',
      '"onclick" | "onfocus"',
      'string',
      '"on" | "Click" | "Focus"',
    ],
    correctIndex: 0,
    explanation:
      'Les template literal types combinent strings. Capitalize transforme "click" en "Click", donnant "onClick" | "onFocus".',
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'template-literal-types', 'advanced'],
    xp: 20,
  },
  {
    id: 'quiz_ts_019',
    type: 'quiz',
    title: 'never Type',
    description: 'Comprendre le type never',
    question: 'Quand une fonction a-t-elle le type de retour never ?',
    code: `function fail(message: string): never {
  throw new Error(message);
}`,
    options: [
      'Quand elle retourne undefined',
      'Quand elle ne retourne jamais (throw ou boucle infinie)',
      'Quand elle retourne null',
      'Quand elle n\'a pas de return statement',
    ],
    correctIndex: 1,
    explanation:
      'never signifie que la fonction ne retourne jamais : elle throw une erreur ou boucle infiniment. void signifie qu\'elle ne retourne rien (undefined).',
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'never', 'return-types'],
    xp: 20,
  },
  {
    id: 'quiz_ts_020',
    type: 'quiz',
    title: 'Type Assertion vs Type Guard',
    description: 'Différence entre assertion et guard',
    question: 'Quelle est la différence entre ces deux approches ?',
    code: `// Approach 1: Type Assertion
const a = someValue as string;

// Approach 2: Type Guard
if (typeof someValue === 'string') {
  const b = someValue;
}`,
    options: [
      'Aucune différence, c\'est identique',
      'L\'assertion est vérifiée au runtime, pas le guard',
      'Le guard est vérifié au runtime, pas l\'assertion',
      'Les deux sont vérifiés au runtime',
    ],
    correctIndex: 2,
    explanation:
      'L\'assertion (as) dit à TS de te faire confiance sans vérification. Le type guard vérifie réellement le type à l\'exécution, c\'est plus sûr.',
    difficulty: 'senior',
    category: 'typescript',
    tags: ['typescript', 'type-assertion', 'type-guard'],
    xp: 20,
  },

  // ============ SYSTEM DESIGN - Junior ============
  {
    id: 'quiz_sd_001',
    type: 'quiz',
    title: 'API REST - Méthodes HTTP',
    description: 'Comprendre les méthodes HTTP de base',
    question: 'Quelle méthode HTTP utilise-t-on pour créer une nouvelle ressource ?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctIndex: 1,
    explanation:
      'POST est utilisé pour créer une nouvelle ressource. GET pour lire, PUT pour mettre à jour, DELETE pour supprimer.',
    difficulty: 'junior',
    category: 'system-design',
    tags: ['rest', 'http', 'api'],
    xp: 10,
  },
  {
    id: 'quiz_sd_002',
    type: 'quiz',
    title: 'Codes de statut HTTP',
    description: 'Connaître les codes de réponse courants',
    question: 'Que signifie un code de statut 404 ?',
    options: [
      'Requête réussie',
      'Erreur serveur',
      'Ressource non trouvée',
      'Non autorisé',
    ],
    correctIndex: 2,
    explanation:
      '404 = Not Found. 200 = OK, 500 = Server Error, 401 = Unauthorized, 403 = Forbidden.',
    difficulty: 'junior',
    category: 'system-design',
    tags: ['http', 'status-codes', 'api'],
    xp: 10,
  },
  {
    id: 'quiz_sd_003',
    type: 'quiz',
    title: 'JSON vs XML',
    description: 'Formats d\'échange de données',
    question: 'Pourquoi JSON est-il préféré à XML pour les APIs modernes ?',
    options: [
      'JSON est plus sécurisé',
      'JSON est plus léger et facile à parser',
      'XML ne supporte pas le texte',
      'JSON est un standard plus ancien',
    ],
    correctIndex: 1,
    explanation:
      'JSON est plus compact, plus lisible et natif en JavaScript (JSON.parse/stringify). XML est plus verbeux avec ses balises.',
    difficulty: 'junior',
    category: 'system-design',
    tags: ['json', 'xml', 'api'],
    xp: 10,
  },
  {
    id: 'quiz_sd_004',
    type: 'quiz',
    title: 'Client-Server Architecture',
    description: 'Architecture de base du web',
    question: 'Dans une architecture client-serveur, qui initie les requêtes ?',
    options: [
      'Toujours le serveur',
      'Toujours le client',
      'Les deux peuvent initier',
      'Ni l\'un ni l\'autre',
    ],
    correctIndex: 1,
    explanation:
      'En HTTP standard, le client (navigateur) initie toujours les requêtes. Le serveur répond. Pour du temps réel, on utilise WebSockets.',
    difficulty: 'junior',
    category: 'system-design',
    tags: ['architecture', 'client-server', 'http'],
    xp: 10,
  },

  // ============ SYSTEM DESIGN - Mid ============
  {
    id: 'quiz_sd_005',
    type: 'quiz',
    title: 'Base de données - SQL vs NoSQL',
    description: 'Choisir le bon type de base de données',
    question: 'Quand privilégier une base NoSQL comme MongoDB ?',
    options: [
      'Quand on a besoin de transactions ACID complexes',
      'Quand les données ont une structure variable/flexible',
      'Quand on doit faire des jointures complexes',
      'Quand la cohérence est prioritaire',
    ],
    correctIndex: 1,
    explanation:
      'NoSQL excelle pour les données sans schéma fixe. SQL est meilleur pour les relations complexes, transactions ACID et cohérence forte.',
    difficulty: 'mid',
    category: 'system-design',
    tags: ['database', 'sql', 'nosql', 'mongodb'],
    xp: 15,
  },
  {
    id: 'quiz_sd_006',
    type: 'quiz',
    title: 'Caching - Stratégies',
    description: 'Comprendre le caching',
    question: 'Quel est le principal avantage du caching ?',
    options: [
      'Réduire l\'espace disque utilisé',
      'Améliorer la sécurité',
      'Réduire la latence et la charge serveur',
      'Simplifier le code',
    ],
    correctIndex: 2,
    explanation:
      'Le cache stocke les données fréquemment accédées en mémoire rapide, évitant les requêtes répétées à la base de données.',
    difficulty: 'mid',
    category: 'system-design',
    tags: ['caching', 'performance', 'redis'],
    xp: 15,
  },
  {
    id: 'quiz_sd_007',
    type: 'quiz',
    title: 'Load Balancer',
    description: 'Répartition de charge',
    question: 'Quel est le rôle d\'un load balancer ?',
    options: [
      'Crypter les données en transit',
      'Distribuer le trafic entre plusieurs serveurs',
      'Stocker les données utilisateur',
      'Compiler le code source',
    ],
    correctIndex: 1,
    explanation:
      'Un load balancer répartit les requêtes entrantes entre plusieurs serveurs pour éviter la surcharge et améliorer la disponibilité.',
    difficulty: 'mid',
    category: 'system-design',
    tags: ['load-balancer', 'scalability', 'infrastructure'],
    xp: 15,
  },
  {
    id: 'quiz_sd_008',
    type: 'quiz',
    title: 'Microservices vs Monolithe',
    description: 'Architecture logicielle',
    question: 'Quel est un inconvénient des microservices ?',
    options: [
      'Impossible à scaler',
      'Code trop couplé',
      'Complexité opérationnelle accrue',
      'Performance toujours meilleure',
    ],
    correctIndex: 2,
    explanation:
      'Les microservices ajoutent de la complexité : déploiement, monitoring, communication réseau, debugging distribué. À éviter si pas nécessaire.',
    difficulty: 'mid',
    category: 'system-design',
    tags: ['microservices', 'monolith', 'architecture'],
    xp: 15,
  },
  {
    id: 'quiz_sd_009',
    type: 'quiz',
    title: 'Authentication - JWT',
    description: 'Comprendre les JSON Web Tokens',
    question: 'Que contient un JWT (JSON Web Token) ?',
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    options: [
      'Uniquement le mot de passe crypté',
      'Header, Payload (données) et Signature',
      'Uniquement les permissions utilisateur',
      'L\'adresse IP du client',
    ],
    correctIndex: 1,
    explanation:
      'Un JWT a 3 parties séparées par des points : Header (algorithme), Payload (données/claims), Signature (vérification).',
    difficulty: 'mid',
    category: 'system-design',
    tags: ['jwt', 'authentication', 'security'],
    xp: 15,
  },
  {
    id: 'quiz_sd_010',
    type: 'quiz',
    title: 'Rate Limiting',
    description: 'Protéger son API',
    question: 'Pourquoi implémenter du rate limiting sur une API ?',
    options: [
      'Pour accélérer les requêtes',
      'Pour limiter les abus et attaques DDoS',
      'Pour compresser les données',
      'Pour améliorer le SEO',
    ],
    correctIndex: 1,
    explanation:
      'Le rate limiting limite le nombre de requêtes par client/IP sur une période. Protège contre les abus et maintient la qualité de service.',
    difficulty: 'mid',
    category: 'system-design',
    tags: ['rate-limiting', 'security', 'api'],
    xp: 15,
  },

  // ============ SYSTEM DESIGN - Senior ============
  {
    id: 'quiz_sd_011',
    type: 'quiz',
    title: 'CAP Theorem',
    description: 'Théorème fondamental des systèmes distribués',
    question: 'Selon le théorème CAP, un système distribué ne peut garantir que 2 sur 3 de :',
    options: [
      'Cost, Availability, Performance',
      'Consistency, Availability, Partition tolerance',
      'Cache, API, Persistence',
      'Concurrency, Atomicity, Parallelism',
    ],
    correctIndex: 1,
    explanation:
      'CAP : Consistency (données à jour), Availability (toujours répondre), Partition tolerance (fonctionner malgré pannes réseau). On doit sacrifier l\'un des trois.',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['cap-theorem', 'distributed-systems', 'architecture'],
    xp: 20,
  },
  {
    id: 'quiz_sd_012',
    type: 'quiz',
    title: 'Sharding',
    description: 'Partitionnement horizontal des données',
    question: 'Qu\'est-ce que le database sharding ?',
    options: [
      'Répliquer les données sur plusieurs serveurs',
      'Diviser les données horizontalement sur plusieurs bases',
      'Crypter les données sensibles',
      'Compresser les tables volumineuses',
    ],
    correctIndex: 1,
    explanation:
      'Le sharding divise les données par clé (ex: user_id % 4) sur plusieurs bases. Différent de la réplication qui copie toutes les données.',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['sharding', 'database', 'scalability'],
    xp: 20,
  },
  {
    id: 'quiz_sd_013',
    type: 'quiz',
    title: 'Event-Driven Architecture',
    description: 'Architecture événementielle',
    question: 'Quel est l\'avantage principal d\'une architecture event-driven ?',
    options: [
      'Code plus simple à écrire',
      'Découplage fort entre les services',
      'Latence toujours plus faible',
      'Pas besoin de message queue',
    ],
    correctIndex: 1,
    explanation:
      'Les événements permettent le découplage : les producteurs n\'ont pas besoin de connaître les consommateurs. Facilite l\'évolution et la scalabilité.',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['event-driven', 'architecture', 'kafka'],
    xp: 20,
  },
  {
    id: 'quiz_sd_014',
    type: 'quiz',
    title: 'CQRS Pattern',
    description: 'Command Query Responsibility Segregation',
    question: 'Que sépare le pattern CQRS ?',
    options: [
      'Frontend et Backend',
      'Lecture et Écriture des données',
      'Tests et Production',
      'Cache et Base de données',
    ],
    correctIndex: 1,
    explanation:
      'CQRS sépare les modèles de lecture (Query) et d\'écriture (Command). Permet d\'optimiser chaque partie indépendamment.',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['cqrs', 'architecture', 'patterns'],
    xp: 20,
  },
  {
    id: 'quiz_sd_015',
    type: 'quiz',
    title: 'CDN - Content Delivery Network',
    description: 'Distribution de contenu',
    question: 'Comment un CDN améliore-t-il les performances ?',
    options: [
      'En compressant le code JavaScript',
      'En rapprochant le contenu des utilisateurs géographiquement',
      'En minifiant le HTML',
      'En optimisant les requêtes SQL',
    ],
    correctIndex: 1,
    explanation:
      'Un CDN place des copies du contenu statique sur des serveurs edge dans le monde entier, réduisant la latence pour les utilisateurs distants.',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['cdn', 'performance', 'infrastructure'],
    xp: 20,
  },
  {
    id: 'quiz_sd_016',
    type: 'quiz',
    title: 'Database Indexing',
    description: 'Optimisation des requêtes',
    question: 'Quel est le trade-off principal des index en base de données ?',
    options: [
      'Plus de sécurité mais moins de données',
      'Lectures plus rapides mais écritures plus lentes',
      'Requêtes plus simples mais résultats incomplets',
      'Plus de stockage mais moins de backup',
    ],
    correctIndex: 1,
    explanation:
      'Les index accélèrent les SELECT mais ralentissent INSERT/UPDATE/DELETE car l\'index doit être maintenu. Ne pas sur-indexer !',
    difficulty: 'senior',
    category: 'system-design',
    tags: ['database', 'indexing', 'performance'],
    xp: 20,
  },

  // ============ TESTING - Junior ============
  {
    id: 'quiz_test_001',
    type: 'quiz',
    title: 'Types de Tests',
    description: 'Comprendre les différents types de tests',
    question: 'Quel type de test vérifie une fonction isolée ?',
    options: [
      'Test E2E (End-to-End)',
      'Test d\'intégration',
      'Test unitaire',
      'Test de charge',
    ],
    correctIndex: 2,
    explanation:
      'Les tests unitaires testent une unité de code isolée (fonction, classe). Les tests d\'intégration testent plusieurs modules ensemble.',
    difficulty: 'junior',
    category: 'testing',
    tags: ['testing', 'unit-tests', 'basics'],
    xp: 10,
  },
  {
    id: 'quiz_test_002',
    type: 'quiz',
    title: 'AAA Pattern',
    description: 'Structure d\'un test',
    question: 'Que signifie le pattern AAA en testing ?',
    code: `test('should add numbers', () => {
  // ???
  const a = 2, b = 3;
  // ???
  const result = add(a, b);
  // ???
  expect(result).toBe(5);
});`,
    options: [
      'Assert, Act, Arrange',
      'Arrange, Act, Assert',
      'Action, Analysis, Assertion',
      'Add, Apply, Assert',
    ],
    correctIndex: 1,
    explanation:
      'AAA = Arrange (préparer les données), Act (exécuter le code), Assert (vérifier le résultat). Structure claire et lisible.',
    difficulty: 'junior',
    category: 'testing',
    tags: ['testing', 'aaa', 'best-practices'],
    xp: 10,
  },
  {
    id: 'quiz_test_003',
    type: 'quiz',
    title: 'expect() et Matchers',
    description: 'Assertions de base',
    question: 'Quel matcher utiliser pour vérifier qu\'un array contient un élément ?',
    code: `const fruits = ['apple', 'banana', 'orange'];
expect(fruits).???('banana');`,
    options: [
      'toBe',
      'toEqual',
      'toContain',
      'toHave',
    ],
    correctIndex: 2,
    explanation:
      'toContain vérifie qu\'un array contient un élément. toBe compare les références, toEqual compare les valeurs en profondeur.',
    difficulty: 'junior',
    category: 'testing',
    tags: ['testing', 'matchers', 'vitest'],
    xp: 10,
  },
  {
    id: 'quiz_test_004',
    type: 'quiz',
    title: 'Test Coverage',
    description: 'Couverture de code',
    question: 'Qu\'est-ce que la couverture de code (code coverage) ?',
    options: [
      'Le nombre de tests dans le projet',
      'Le pourcentage de code exécuté par les tests',
      'Le temps d\'exécution des tests',
      'Le nombre de bugs trouvés',
    ],
    correctIndex: 1,
    explanation:
      'La couverture mesure quel % du code est exécuté pendant les tests. 80%+ est un bon objectif, mais 100% n\'est pas toujours utile.',
    difficulty: 'junior',
    category: 'testing',
    tags: ['testing', 'coverage', 'metrics'],
    xp: 10,
  },

  // ============ TESTING - Mid ============
  {
    id: 'quiz_test_005',
    type: 'quiz',
    title: 'Mocking',
    description: 'Simuler des dépendances',
    question: 'Pourquoi utilise-t-on des mocks dans les tests ?',
    code: `vi.mock('./api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ name: 'John' }))
}));`,
    options: [
      'Pour accélérer les tests',
      'Pour isoler le code testé de ses dépendances externes',
      'Pour générer des données aléatoires',
      'Pour tester plusieurs fois en parallèle',
    ],
    correctIndex: 1,
    explanation:
      'Les mocks remplacent les vraies dépendances (API, DB) par des versions contrôlées. Permet d\'isoler le code et de tester tous les scénarios.',
    difficulty: 'mid',
    category: 'testing',
    tags: ['testing', 'mocking', 'vitest'],
    xp: 15,
  },
  {
    id: 'quiz_test_006',
    type: 'quiz',
    title: 'Testing Async Code',
    description: 'Tester du code asynchrone',
    question: 'Quelle est la bonne façon de tester une fonction async ?',
    code: `async function fetchData() {
  const res = await fetch('/api/data');
  return res.json();
}`,
    options: [
      'test("works", () => { fetchData(); expect(true).toBe(true); })',
      'test("works", async () => { const data = await fetchData(); expect(data).toBeDefined(); })',
      'test("works", () => { expect(fetchData()).toBe(data); })',
      'test("works", callback => { fetchData().then(callback); })',
    ],
    correctIndex: 1,
    explanation:
      'Avec async/await, le test doit être async et await le résultat. Sinon le test finit avant que la Promise ne se résolve.',
    difficulty: 'mid',
    category: 'testing',
    tags: ['testing', 'async', 'promises'],
    xp: 15,
  },
  {
    id: 'quiz_test_007',
    type: 'quiz',
    title: 'Spy vs Mock vs Stub',
    description: 'Différences entre les doublures de test',
    question: 'Quelle est la différence entre un spy et un mock ?',
    options: [
      'Aucune, ce sont des synonymes',
      'Un spy observe les appels, un mock les remplace complètement',
      'Un spy est pour les fonctions, un mock pour les objets',
      'Un spy est plus rapide qu\'un mock',
    ],
    correctIndex: 1,
    explanation:
      'Spy : observe les appels tout en gardant l\'implémentation originale. Mock : remplace complètement la fonction avec un comportement défini.',
    difficulty: 'mid',
    category: 'testing',
    tags: ['testing', 'spy', 'mock', 'stub'],
    xp: 15,
  },
  {
    id: 'quiz_test_008',
    type: 'quiz',
    title: 'React Testing Library',
    description: 'Tester des composants React',
    question: 'Quel est le principe central de React Testing Library ?',
    code: `// Comment trouver un élément ?
render(<Button>Click me</Button>);
screen.getBy???(???)`,
    options: [
      'Tester l\'implémentation interne du composant',
      'Tester comme un utilisateur interagit avec le composant',
      'Tester uniquement les props',
      'Tester le Virtual DOM directement',
    ],
    correctIndex: 1,
    explanation:
      'RTL encourage de tester le comportement, pas l\'implémentation. Utiliser getByRole, getByText plutôt que les classes CSS ou IDs.',
    difficulty: 'mid',
    category: 'testing',
    tags: ['testing', 'react', 'rtl'],
    xp: 15,
  },
  {
    id: 'quiz_test_009',
    type: 'quiz',
    title: 'Test Pyramid',
    description: 'Stratégie de testing',
    question: 'Selon la pyramide des tests, quel type de test devrait être le plus nombreux ?',
    options: [
      'Tests E2E (End-to-End)',
      'Tests d\'intégration',
      'Tests unitaires',
      'Tests manuels',
    ],
    correctIndex: 2,
    explanation:
      'Pyramide : Beaucoup de tests unitaires (rapides, isolés), moins de tests d\'intégration, très peu de tests E2E (lents, fragiles).',
    difficulty: 'mid',
    category: 'testing',
    tags: ['testing', 'strategy', 'pyramid'],
    xp: 15,
  },
  {
    id: 'quiz_test_010',
    type: 'quiz',
    title: 'beforeEach et afterEach',
    description: 'Setup et teardown',
    question: 'À quoi sert beforeEach dans un test ?',
    code: `describe('UserService', () => {
  beforeEach(() => {
    // ???
  });

  test('should create user', () => { ... });
  test('should delete user', () => { ... });
});`,
    options: [
      'Exécuter du code une fois avant tous les tests',
      'Exécuter du code avant chaque test individuel',
      'Définir des variables globales',
      'Importer des modules',
    ],
    correctIndex: 1,
    explanation:
      'beforeEach s\'exécute avant CHAQUE test du describe. Parfait pour reset l\'état. beforeAll s\'exécute une seule fois au début.',
    difficulty: 'mid',
    category: 'testing',
    tags: ['testing', 'setup', 'lifecycle'],
    xp: 15,
  },

  // ============ TESTING - Senior ============
  {
    id: 'quiz_test_011',
    type: 'quiz',
    title: 'TDD - Test Driven Development',
    description: 'Développement piloté par les tests',
    question: 'Quel est le cycle TDD correct ?',
    options: [
      'Code → Test → Refactor',
      'Red → Green → Refactor',
      'Test → Debug → Deploy',
      'Plan → Code → Test',
    ],
    correctIndex: 1,
    explanation:
      'TDD : Red (écrire un test qui échoue), Green (écrire le code minimum pour passer), Refactor (améliorer sans casser les tests).',
    difficulty: 'senior',
    category: 'testing',
    tags: ['testing', 'tdd', 'methodology'],
    xp: 20,
  },
  {
    id: 'quiz_test_012',
    type: 'quiz',
    title: 'Snapshot Testing',
    description: 'Tests par snapshot',
    question: 'Quand le snapshot testing est-il le plus approprié ?',
    options: [
      'Pour tester la logique métier complexe',
      'Pour détecter les changements inattendus dans le rendu UI',
      'Pour tester les performances',
      'Pour remplacer tous les autres types de tests',
    ],
    correctIndex: 1,
    explanation:
      'Les snapshots détectent les changements de structure/rendu. Utile pour la UI, mais attention aux faux positifs et snapshots trop gros.',
    difficulty: 'senior',
    category: 'testing',
    tags: ['testing', 'snapshot', 'ui'],
    xp: 20,
  },
  {
    id: 'quiz_test_013',
    type: 'quiz',
    title: 'Property-Based Testing',
    description: 'Tests basés sur les propriétés',
    question: 'Quel est l\'avantage du property-based testing par rapport aux tests classiques ?',
    code: `// Test classique
expect(reverse(reverse('hello'))).toBe('hello');

// Property-based
fc.assert(fc.property(fc.string(), (s) => {
  return reverse(reverse(s)) === s;
}));`,
    options: [
      'Tests plus rapides à exécuter',
      'Génère automatiquement de nombreux cas de test',
      'Pas besoin d\'écrire d\'assertions',
      'Fonctionne uniquement avec les strings',
    ],
    correctIndex: 1,
    explanation:
      'Le property-based testing génère des centaines d\'inputs aléatoires pour vérifier qu\'une propriété tient toujours. Trouve des edge cases imprévus.',
    difficulty: 'senior',
    category: 'testing',
    tags: ['testing', 'property-based', 'fast-check'],
    xp: 20,
  },
  {
    id: 'quiz_test_014',
    type: 'quiz',
    title: 'Contract Testing',
    description: 'Tests de contrat API',
    question: 'Que vérifient les tests de contrat (contract tests) ?',
    options: [
      'Que le code respecte les conventions de style',
      'Que le serveur et le client respectent le même contrat d\'API',
      'Que les tests ont une couverture suffisante',
      'Que le code est bien documenté',
    ],
    correctIndex: 1,
    explanation:
      'Les contract tests vérifient que producteur et consommateur d\'API sont compatibles. Évite les problèmes d\'intégration en production.',
    difficulty: 'senior',
    category: 'testing',
    tags: ['testing', 'contract', 'pact'],
    xp: 20,
  },
  {
    id: 'quiz_test_015',
    type: 'quiz',
    title: 'Flaky Tests',
    description: 'Tests instables',
    question: 'Qu\'est-ce qu\'un "flaky test" et pourquoi est-ce problématique ?',
    options: [
      'Un test trop lent - ralentit la CI',
      'Un test qui passe ou échoue de manière non-déterministe',
      'Un test sans assertions',
      'Un test qui teste trop de choses',
    ],
    correctIndex: 1,
    explanation:
      'Un flaky test échoue parfois sans raison claire (timing, ordre, état partagé). Érode la confiance dans la suite de tests et doit être fixé en priorité.',
    difficulty: 'senior',
    category: 'testing',
    tags: ['testing', 'flaky', 'reliability'],
    xp: 20,
  },
  {
    id: 'quiz_test_016',
    type: 'quiz',
    title: 'Mutation Testing',
    description: 'Qualité des tests',
    question: 'Comment le mutation testing évalue-t-il la qualité des tests ?',
    options: [
      'En mesurant le temps d\'exécution',
      'En comptant le nombre de tests',
      'En modifiant le code et vérifiant si les tests échouent',
      'En analysant la complexité cyclomatique',
    ],
    correctIndex: 2,
    explanation:
      'Le mutation testing introduit des bugs (mutations) dans le code. Si les tests passent toujours, ils ne sont pas assez robustes pour détecter ces bugs.',
    difficulty: 'senior',
    category: 'testing',
    tags: ['testing', 'mutation', 'quality'],
    xp: 20,
  },
];
