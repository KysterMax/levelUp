import type { QuizTemplate } from '../types';

/**
 * Quiz templates for dynamic exercise generation
 * Each template can generate multiple unique quiz questions
 */

export const quizTemplates: QuizTemplate[] = [
  // Array filter + map
  {
    id: 'quiz_tpl_filter_map',
    type: 'quiz',
    titleTemplate: 'Array Methods - filter & map',
    descriptionTemplate: 'Comprendre le chaînage des méthodes de tableau',
    questionTemplate: 'Que retourne [{{ARRAY}}].filter(x => x > {{NUMBER}}).map(x => x * 2) ?',
    codeTemplate: 'const result = [{{ARRAY}}].filter(x => x > {{NUMBER}}).map(x => x * 2);',
    optionsGenerator: (vars) => {
      const arr = vars.array as number[];
      const threshold = vars.number;
      const correct = arr.filter(x => x > threshold).map(x => x * 2);

      // Generate plausible wrong answers
      const wrongOptions = [
        arr.map(x => x * 2).filter(x => x > threshold), // Wrong order
        arr.filter(x => x >= threshold).map(x => x * 2), // >= instead of >
        arr.filter(x => x > threshold), // No map
      ];

      const options = [
        JSON.stringify(correct),
        ...wrongOptions.map(opt => JSON.stringify(opt)),
      ];

      return shuffleOptions(options, vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const arr = vars.array as number[];
      const threshold = vars.number;
      const correct = JSON.stringify(arr.filter(x => x > threshold).map(x => x * 2));
      const options = quizTemplates[0].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'filter(x => x > {{NUMBER}}) garde les éléments supérieurs à {{NUMBER}}, puis map(x => x * 2) les double.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'filter', 'map'],
    xp: 10,
    variableConstraints: {
      numberRange: { min: 1, max: 5 },
      arrayLength: { min: 4, max: 6 },
    },
  },

  // Array reduce sum
  {
    id: 'quiz_tpl_reduce_sum',
    type: 'quiz',
    titleTemplate: 'Array reduce - Somme',
    descriptionTemplate: 'Calculer une somme avec reduce',
    questionTemplate: 'Que retourne [{{ARRAY}}].reduce((acc, val) => acc + val, 0) ?',
    codeTemplate: 'const result = [{{ARRAY}}].reduce((acc, val) => acc + val, 0);',
    optionsGenerator: (vars) => {
      const arr = vars.array as number[];
      const correct = arr.reduce((acc, val) => acc + val, 0);

      const wrongOptions = [
        arr.reduce((acc, val) => acc * val, 1), // Product instead of sum
        arr.length, // Length
        correct + arr[0], // Off by first element
      ];

      return shuffleOptions([
        String(correct),
        ...wrongOptions.map(String),
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const arr = vars.array as number[];
      const correct = String(arr.reduce((acc, val) => acc + val, 0));
      const options = quizTemplates[1].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'reduce accumule les valeurs. La somme de [{{ARRAY}}] avec acc initial de 0 donne {{RESULT}}.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'reduce'],
    xp: 10,
  },

  // Array find
  {
    id: 'quiz_tpl_array_find',
    type: 'quiz',
    titleTemplate: 'Array find',
    descriptionTemplate: 'Trouver le premier élément correspondant',
    questionTemplate: 'Que retourne [{{ARRAY}}].find(x => x > {{NUMBER}}) ?',
    codeTemplate: 'const result = [{{ARRAY}}].find(x => x > {{NUMBER}});',
    optionsGenerator: (vars) => {
      const arr = vars.array as number[];
      const threshold = vars.number;
      const correct = arr.find(x => x > threshold);

      const lastMatch = [...arr].reverse().find(x => x > threshold);
      const allMatches = arr.filter(x => x > threshold);

      return shuffleOptions([
        correct === undefined ? 'undefined' : String(correct),
        lastMatch === undefined ? 'undefined' : String(lastMatch),
        JSON.stringify(allMatches),
        '-1',
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const arr = vars.array as number[];
      const threshold = vars.number;
      const correct = arr.find(x => x > threshold);
      const correctStr = correct === undefined ? 'undefined' : String(correct);
      const options = quizTemplates[2].optionsGenerator(vars);
      return options.indexOf(correctStr);
    },
    explanationTemplate: 'find() retourne le PREMIER élément satisfaisant la condition, pas un tableau.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'find'],
    xp: 10,
  },

  // Spread operator
  {
    id: 'quiz_tpl_spread',
    type: 'quiz',
    titleTemplate: 'Spread Operator',
    descriptionTemplate: 'Comprendre le spread operator',
    questionTemplate: 'Que retourne [...[{{NUMBER}}, {{NUMBER2}}], 10, 20] ?',
    codeTemplate: 'const result = [...[{{NUMBER}}, {{NUMBER2}}], 10, 20];',
    optionsGenerator: (vars) => {
      const n1 = vars.number;
      const n2 = vars.number2;

      return shuffleOptions([
        JSON.stringify([n1, n2, 10, 20]), // Correct
        JSON.stringify([[n1, n2], 10, 20]), // Nested array
        JSON.stringify([n1, n2, [10, 20]]), // Wrong side nested
        'Error', // Error option
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const n1 = vars.number;
      const n2 = vars.number2;
      const correct = JSON.stringify([n1, n2, 10, 20]);
      const options = quizTemplates[3].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'Le spread operator (...) "étale" les éléments du tableau. [{{NUMBER}}, {{NUMBER2}}] est fusionné avec [10, 20].',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['spread', 'arrays'],
    xp: 10,
  },

  // Destructuring with default
  {
    id: 'quiz_tpl_destructuring',
    type: 'quiz',
    titleTemplate: 'Destructuring avec valeur par défaut',
    descriptionTemplate: 'Maîtriser la déstructuration',
    questionTemplate: 'Quelle est la valeur de {{NAME}} après cette ligne ?',
    codeTemplate: 'const { a, {{NAME}} = {{NUMBER}} } = { a: 5 };',
    optionsGenerator: (vars) => {
      return shuffleOptions([
        String(vars.number), // Correct - default value
        'undefined', // No default case
        '5', // Value of a
        'Error',
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const correct = String(vars.number);
      const options = quizTemplates[4].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'La déstructuration permet des valeurs par défaut. {{NAME}} n\'existe pas dans l\'objet, donc {{NAME}} = {{NUMBER}}.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['destructuring', 'objects'],
    xp: 10,
  },

  // Nullish coalescing
  {
    id: 'quiz_tpl_nullish',
    type: 'quiz',
    titleTemplate: 'Nullish Coalescing',
    descriptionTemplate: 'Comprendre l\'opérateur ??',
    questionTemplate: 'Que retourne {{NAME}} ?? "default" si {{NAME}} = {{VALUE}} ?',
    codeTemplate: 'const {{NAME}} = {{VALUE}};\nconst result = {{NAME}} ?? "default";',
    optionsGenerator: (vars) => {
      // value can be null, undefined, 0, or ""
      const value = vars.object.nullishValue as string | null | undefined | number;
      let correct: string;

      if (value === null || value === undefined) {
        correct = '"default"';
      } else {
        correct = JSON.stringify(value);
      }

      return shuffleOptions([
        correct,
        '"default"',
        'null',
        'undefined',
      ].filter((v, i, arr) => arr.indexOf(v) === i), vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const value = vars.object.nullishValue as string | null | undefined | number;
      let correct: string;

      if (value === null || value === undefined) {
        correct = '"default"';
      } else {
        correct = JSON.stringify(value);
      }

      const options = quizTemplates[5].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'L\'opérateur ?? retourne le côté droit SEULEMENT si le côté gauche est null ou undefined (pas pour 0 ou "").',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['nullish', 'operators'],
    xp: 10,
  },

  // Promise.all behavior
  {
    id: 'quiz_tpl_promise_all',
    type: 'quiz',
    titleTemplate: 'Promise.all - Comportement',
    descriptionTemplate: 'Comprendre Promise.all',
    questionTemplate: 'Si une des {{NUMBER}} promises dans Promise.all() est rejetée, que se passe-t-il ?',
    codeTemplate: `const promises = [
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
];
Promise.all(promises).then(console.log).catch(console.error);`,
    optionsGenerator: (vars) => {
      return shuffleOptions([
        'Tout échoue immédiatement avec le rejet',
        'Les autres promises continuent et on obtient [1, undefined, 3]',
        'On obtient [1, "Error", 3]',
        'Le programme crash',
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      return quizTemplates[6].optionsGenerator(vars).indexOf('Tout échoue immédiatement avec le rejet');
    },
    explanationTemplate: 'Promise.all() échoue dès qu\'une promise est rejetée (fail-fast). Utilise Promise.allSettled() pour attendre toutes les promises.',
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['promises', 'async'],
    xp: 15,
  },

  // typeof operator
  {
    id: 'quiz_tpl_typeof',
    type: 'quiz',
    titleTemplate: 'Typeof Operator',
    descriptionTemplate: 'Connaître les types JavaScript',
    questionTemplate: 'Que retourne typeof {{VALUE}} ?',
    codeTemplate: 'console.log(typeof {{VALUE}});',
    optionsGenerator: (vars) => {
      const value = vars.object.typeofValue;
      const typeMap: Record<string, string> = {
        '[]': '"object"',
        '{}': '"object"',
        'null': '"object"',
        '42': '"number"',
        '"hello"': '"string"',
        'true': '"boolean"',
        'undefined': '"undefined"',
        '(() => {})': '"function"',
      };

      const correct = typeMap[String(value)] || '"object"';

      return shuffleOptions([
        correct,
        '"array"',
        '"undefined"',
        '"null"',
      ].filter((v, i, arr) => arr.indexOf(v) === i), vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const value = vars.object.typeofValue;
      const typeMap: Record<string, string> = {
        '[]': '"object"',
        '{}': '"object"',
        'null': '"object"',
        '42': '"number"',
        '"hello"': '"string"',
        'true': '"boolean"',
        'undefined': '"undefined"',
        '(() => {})': '"function"',
      };

      const correct = typeMap[String(value)] || '"object"';
      const options = quizTemplates[7].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'En JavaScript, typeof retourne le type primitif. Attention : typeof [] et typeof null retournent "object".',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['types', 'typeof'],
    xp: 10,
  },

  // Array includes
  {
    id: 'quiz_tpl_includes',
    type: 'quiz',
    titleTemplate: 'Array includes',
    descriptionTemplate: 'Vérifier la présence d\'un élément',
    questionTemplate: 'Que retourne [{{ARRAY}}].includes({{NUMBER}}) ?',
    codeTemplate: 'const result = [{{ARRAY}}].includes({{NUMBER}});',
    optionsGenerator: (vars) => {
      const arr = vars.array as number[];
      const target = vars.number;
      const correct = arr.includes(target);

      return shuffleOptions([
        String(correct),
        String(!correct),
        String(arr.indexOf(target)),
        'undefined',
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const arr = vars.array as number[];
      const target = vars.number;
      const correct = String(arr.includes(target));
      const options = quizTemplates[8].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'includes() retourne un booléen : true si l\'élément est présent, false sinon.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'includes'],
    xp: 10,
  },

  // Object.keys
  {
    id: 'quiz_tpl_object_keys',
    type: 'quiz',
    titleTemplate: 'Object.keys',
    descriptionTemplate: 'Récupérer les clés d\'un objet',
    questionTemplate: 'Que retourne Object.keys({ {{NAME}}: 1, {{NAME2}}: 2 }) ?',
    codeTemplate: 'const result = Object.keys({ {{NAME}}: 1, {{NAME2}}: 2 });',
    optionsGenerator: (vars) => {
      const correct = JSON.stringify([vars.name, vars.name2]);

      return shuffleOptions([
        correct,
        '[1, 2]',
        `{ ${vars.name}: 1, ${vars.name2}: 2 }`,
        `["${vars.name}: 1", "${vars.name2}: 2"]`,
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const correct = JSON.stringify([vars.name, vars.name2]);
      const options = quizTemplates[9].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'Object.keys() retourne un tableau contenant les clés de l\'objet sous forme de strings.',
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['objects', 'keys'],
    xp: 10,
  },

  // Complexity - O(n)
  {
    id: 'quiz_tpl_complexity_linear',
    type: 'quiz',
    titleTemplate: 'Complexité - Boucle simple',
    descriptionTemplate: 'Analyser la complexité algorithmique',
    questionTemplate: 'Quelle est la complexité temporelle de ce code ?',
    codeTemplate: `function {{NAME}}(arr) {
  let {{NAME2}} = 0;
  for (let i = 0; i < arr.length; i++) {
    {{NAME2}} += arr[i];
  }
  return {{NAME2}};
}`,
    optionsGenerator: (vars) => {
      return shuffleOptions([
        'O(n)',
        'O(1)',
        'O(n²)',
        'O(log n)',
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const options = quizTemplates[10].optionsGenerator(vars);
      return options.indexOf('O(n)');
    },
    explanationTemplate: 'Une seule boucle parcourant tous les éléments une fois = O(n) (linéaire).',
    difficulty: 'junior',
    category: 'algorithms-searching',
    tags: ['complexity', 'big-o'],
    xp: 10,
  },

  // Complexity - O(n²)
  {
    id: 'quiz_tpl_complexity_quadratic',
    type: 'quiz',
    titleTemplate: 'Complexité - Boucles imbriquées',
    descriptionTemplate: 'Analyser les boucles imbriquées',
    questionTemplate: 'Quelle est la complexité de ce code ?',
    codeTemplate: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    console.log(i * j);
  }
}`,
    optionsGenerator: (vars) => {
      return shuffleOptions([
        'O(n²)',
        'O(n)',
        'O(2n)',
        'O(n log n)',
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const options = quizTemplates[11].optionsGenerator(vars);
      return options.indexOf('O(n²)');
    },
    explanationTemplate: 'Deux boucles imbriquées de 0 à n donnent n × n = n² opérations.',
    difficulty: 'junior',
    category: 'algorithms-sorting',
    tags: ['complexity', 'big-o', 'loops'],
    xp: 10,
  },

  // Event loop
  {
    id: 'quiz_tpl_event_loop',
    type: 'quiz',
    titleTemplate: 'Event Loop',
    descriptionTemplate: 'Comprendre l\'event loop',
    questionTemplate: 'Dans quel ordre s\'affichent ces logs ?',
    codeTemplate: `console.log('{{NUMBER}}');
setTimeout(() => console.log('{{NUMBER2}}'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    optionsGenerator: (vars) => {
      const n1 = vars.number;
      const n2 = vars.number2;

      return shuffleOptions([
        `${n1}, 4, 3, ${n2}`,
        `${n1}, ${n2}, 3, 4`,
        `${n1}, 4, ${n2}, 3`,
        `${n1}, 3, 4, ${n2}`,
      ], vars.seed);
    },
    correctIndexGenerator: (vars) => {
      const n1 = vars.number;
      const n2 = vars.number2;
      const correct = `${n1}, 4, 3, ${n2}`;
      const options = quizTemplates[12].optionsGenerator(vars);
      return options.indexOf(correct);
    },
    explanationTemplate: 'Les microtasks (Promises) s\'exécutent avant les macrotasks (setTimeout). Ordre: sync, microtask, macrotask.',
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['event-loop', 'promises', 'setTimeout'],
    xp: 15,
  },
];

/**
 * Shuffle options while tracking the correct answer
 */
function shuffleOptions(options: string[], seed: number): string[] {
  const result = [...options];
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export default quizTemplates;
