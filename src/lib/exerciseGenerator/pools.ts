/**
 * Variable pools for dynamic exercise generation
 * These provide diverse, realistic data for generated exercises
 */

// Variable names (programming-related)
export const VARIABLE_NAMES = [
  'count', 'total', 'sum', 'result', 'value',
  'items', 'data', 'users', 'products', 'orders',
  'price', 'quantity', 'index', 'length', 'size',
  'name', 'email', 'age', 'score', 'level',
  'max', 'min', 'average', 'temp', 'current',
  'first', 'last', 'next', 'prev', 'target',
];

// Function names
export const FUNCTION_NAMES = [
  'calculate', 'process', 'transform', 'filter', 'validate',
  'getTotal', 'findMax', 'sortItems', 'fetchData', 'updateUser',
  'handleClick', 'submitForm', 'loadData', 'saveConfig', 'parseInput',
];

// Person names for scenarios
export const PERSON_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
  'Frank', 'Grace', 'Henry', 'Iris', 'Jack',
  'Kate', 'Leo', 'Maya', 'Noah', 'Olivia',
  'Paul', 'Quinn', 'Rose', 'Sam', 'Tara',
];

// Product names for e-commerce scenarios
export const PRODUCT_NAMES = [
  'Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard',
  'Mouse', 'Headphones', 'Camera', 'Speaker', 'Watch',
  'Book', 'Shirt', 'Shoes', 'Bag', 'Coffee',
];

// Programming languages/technologies
export const TECH_NAMES = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
  'Node.js', 'Python', 'Go', 'Rust', 'Java',
];

// Number pools by range
export const NUMBER_POOLS = {
  small: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  medium: [10, 15, 20, 25, 30, 42, 50, 75, 99, 100],
  large: [100, 150, 200, 250, 500, 750, 999, 1000, 1500, 2000],
  prices: [9.99, 19.99, 29.99, 49.99, 99.99, 149.99, 199.99, 299.99],
  percentages: [10, 15, 20, 25, 30, 40, 50, 75, 80, 90],
};

// String arrays for various contexts
export const STRING_ARRAYS = {
  fruits: ['apple', 'banana', 'orange', 'grape', 'mango', 'kiwi', 'peach'],
  colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'],
  cities: ['Paris', 'London', 'Tokyo', 'New York', 'Berlin', 'Sydney'],
  languages: ['JavaScript', 'Python', 'Java', 'Go', 'Rust', 'TypeScript'],
  status: ['pending', 'active', 'completed', 'cancelled', 'archived'],
};

// Number arrays for algorithm exercises
export const NUMBER_ARRAYS = {
  sorted: [
    [1, 2, 3, 4, 5],
    [1, 3, 5, 7, 9],
    [2, 4, 6, 8, 10],
    [10, 20, 30, 40, 50],
  ],
  unsorted: [
    [5, 2, 8, 1, 9],
    [3, 1, 4, 1, 5, 9],
    [7, 2, 5, 3, 8, 1],
    [64, 34, 25, 12, 22, 11, 90],
  ],
  withDuplicates: [
    [1, 2, 2, 3, 4],
    [5, 5, 5, 5, 5],
    [1, 1, 2, 2, 3, 3],
  ],
  negative: [
    [-5, -2, 0, 3, 7],
    [-10, -5, 0, 5, 10],
    [-3, -1, 0, 1, 3],
  ],
};

// Object templates for user-related exercises
export const USER_OBJECTS = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 28, role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 34, role: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 22, role: 'user' },
  { id: 4, name: 'Diana', email: 'diana@example.com', age: 31, role: 'moderator' },
];

// Product objects for e-commerce exercises
export const PRODUCT_OBJECTS = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 50, category: 'electronics' },
  { id: 2, name: 'Phone', price: 699.99, stock: 120, category: 'electronics' },
  { id: 3, name: 'Book', price: 19.99, stock: 200, category: 'books' },
  { id: 4, name: 'Shirt', price: 29.99, stock: 75, category: 'clothing' },
];

// API response templates
export const API_RESPONSES = {
  success: { status: 'success', data: null, message: 'Operation completed' },
  error: { status: 'error', error: 'Something went wrong', code: 500 },
  paginated: { data: [], page: 1, totalPages: 10, totalItems: 100 },
};

// Code snippets for review exercises
export const CODE_SNIPPETS = {
  badPractices: [
    `var x = 1; // using var instead of const/let`,
    `for (var i = 0; i < arr.length; i++) {} // var in loop`,
    `arr.forEach(item => { return item; }); // forEach with return`,
    `if (value == null) {} // loose equality`,
    `setTimeout(() => {}, 0); // magic number`,
  ],
  securityIssues: [
    `eval(userInput); // code injection`,
    `innerHTML = userInput; // XSS vulnerability`,
    `document.write(data); // XSS risk`,
  ],
  performanceIssues: [
    `arr.filter(x => x > 0).map(x => x * 2).forEach(x => {})`,
    `for (let i = 0; i < arr.length; i++) { for (let j = 0; j < arr.length; j++) {} }`,
  ],
};

// Scenarios for contextual exercises
export const SCENARIOS = {
  ecommerce: [
    'Calcule le total du panier avec une remise',
    'Filtre les produits par catégorie et prix',
    'Trie les commandes par date',
  ],
  userManagement: [
    'Valide les données utilisateur',
    'Filtre les utilisateurs actifs',
    'Calcule les statistiques des utilisateurs',
  ],
  dataProcessing: [
    'Transforme les données API',
    'Agrège les données par catégorie',
    'Nettoie et formate les entrées',
  ],
};

/**
 * Get a random element from an array
 */
export function getRandomElement<T>(arr: T[], seed?: number): T {
  const index = seed !== undefined
    ? Math.floor(seededRandom(seed) * arr.length)
    : Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Get multiple random elements from an array (without duplicates)
 */
export function getRandomElements<T>(arr: T[], count: number, seed?: number): T[] {
  const shuffled = [...arr];
  let currentSeed = seed ?? 0;
  const random = seed !== undefined ? () => seededRandom(currentSeed++) : Math.random;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * Seeded random number generator for reproducible exercises
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate a random number in a range
 */
export function randomInRange(min: number, max: number, seed?: number): number {
  const random = seed !== undefined ? seededRandom(seed) : Math.random();
  return Math.floor(random * (max - min + 1)) + min;
}

/**
 * Generate a unique ID for exercises
 */
export function generateExerciseId(type: string, seed: number): string {
  const timestamp = Date.now().toString(36);
  const random = Math.floor(seededRandom(seed) * 1000).toString(36);
  return `${type}_gen_${timestamp}_${random}`;
}

/**
 * Shuffle an array with optional seed
 */
export function shuffleArray<T>(arr: T[], seed?: number): T[] {
  const result = [...arr];
  let currentSeed = seed ?? 0;
  const random = seed !== undefined ? () => seededRandom(currentSeed++) : Math.random;

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
