import type { FetchChallenge } from '@/types';

export const fetchExercises: FetchChallenge[] = [
  // ============ JUNIOR - Basic Fetch ============
  {
    id: 'fetch_001',
    type: 'fetch',
    title: 'Récupérer des utilisateurs',
    description: `Objectif : Faire ta première requête HTTP avec fetch().

Ce que tu dois faire :
1. Utilise fetch() pour appeler l'API
2. Attends la réponse avec await
3. Convertis la réponse en JSON avec .json()
4. Retourne les données

L'API JSONPlaceholder est une API gratuite pour s'entraîner.
L'endpoint te retournera un tableau d'utilisateurs.

Rappel syntaxe :
const response = await fetch(url);
const data = await response.json();`,
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    starterCode: `async function getUsers() {
  // Utilise fetch pour récupérer les utilisateurs
  // L'endpoint est : https://jsonplaceholder.typicode.com/users
  // N'oublie pas d'utiliser await !
  // Retourne les données JSON

}`,
    expectedResponse: {
      type: 'array',
      minLength: 1,
    },
    hints: [
      'Commence par fetch() avec l\'URL de l\'endpoint',
      'N\'oublie pas await devant fetch()',
      'Utilise .json() sur la response pour parser le JSON',
      'N\'oublie pas await devant .json() aussi !',
    ],
    solution: `async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}`,
    difficulty: 'junior',
    category: 'fetch-api',
    tags: ['fetch', 'async', 'api', 'get'],
    xp: 20,
  },
  {
    id: 'fetch_002',
    type: 'fetch',
    title: 'Récupérer un post spécifique',
    description:
      'Récupère le post avec l\'id 1 depuis JSONPlaceholder.',
    endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    starterCode: `async function getData() {
  // Récupère le post avec l'id 1
  // Endpoint : https://jsonplaceholder.typicode.com/posts/1
  // Retourne l'objet JSON

}`,
    expectedResponse: {
      type: 'object',
      requiredFields: ['id', 'title', 'body', 'userId'],
    },
    hints: [
      'C\'est similaire à l\'exercice précédent',
      'L\'URL contient déjà l\'id du post',
      'Le résultat sera un objet, pas un tableau',
    ],
    solution: `async function getData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  return data;
}`,
    difficulty: 'junior',
    category: 'fetch-api',
    tags: ['fetch', 'async', 'api', 'get'],
    xp: 20,
  },
  {
    id: 'fetch_003',
    type: 'fetch',
    title: 'Récupérer les todos',
    description:
      'Récupère la liste des todos et filtre uniquement ceux complétés.',
    endpoint: 'https://jsonplaceholder.typicode.com/todos',
    method: 'GET',
    starterCode: `async function getData() {
  // 1. Récupère tous les todos
  // 2. Filtre pour garder seulement completed: true
  // 3. Retourne les todos complétés

}`,
    expectedResponse: {
      type: 'array',
      minLength: 1,
    },
    hints: [
      'D\'abord fetch les todos',
      'Utilise .filter() sur le tableau',
      'Filtre sur la propriété "completed"',
    ],
    solution: `async function getData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await response.json();
  return todos.filter(todo => todo.completed === true);
}`,
    difficulty: 'junior',
    category: 'fetch-api',
    tags: ['fetch', 'filter', 'api'],
    xp: 25,
  },

  // ============ MID - POST/PUT/DELETE ============
  {
    id: 'fetch_004',
    type: 'fetch',
    title: 'Créer un nouveau post (POST)',
    description:
      'Envoie une requête POST pour créer un nouveau post.',
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    starterCode: `async function postData() {
  // Crée un nouveau post avec:
  // - title: "Mon post"
  // - body: "Contenu du post"
  // - userId: 1
  //
  // N'oublie pas les headers Content-Type !

}`,
    expectedResponse: {
      type: 'object',
      requiredFields: ['id'],
    },
    hints: [
      'Utilise la méthode POST dans les options de fetch',
      'Ajoute headers: { "Content-Type": "application/json" }',
      'Utilise JSON.stringify() pour le body',
    ],
    solution: `async function postData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Mon post',
      body: 'Contenu du post',
      userId: 1,
    }),
  });
  const data = await response.json();
  return data;
}`,
    difficulty: 'mid',
    category: 'fetch-api',
    tags: ['fetch', 'post', 'api'],
    xp: 30,
  },
  {
    id: 'fetch_005',
    type: 'fetch',
    title: 'Mettre à jour un post (PUT)',
    description:
      'Utilise PUT pour mettre à jour le titre du post 1.',
    endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'PUT',
    starterCode: `async function updateData() {
  // Met à jour le post 1 avec:
  // - id: 1
  // - title: "Titre modifié"
  // - body: "Nouveau contenu"
  // - userId: 1

}`,
    expectedResponse: {
      type: 'object',
      requiredFields: ['id', 'title'],
    },
    hints: [
      'PUT remplace entièrement la ressource',
      'L\'URL inclut l\'id du post à modifier',
      'Le body doit contenir toutes les propriétés',
    ],
    solution: `async function updateData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      title: 'Titre modifié',
      body: 'Nouveau contenu',
      userId: 1,
    }),
  });
  const data = await response.json();
  return data;
}`,
    difficulty: 'mid',
    category: 'fetch-api',
    tags: ['fetch', 'put', 'api'],
    xp: 30,
  },
  {
    id: 'fetch_006',
    type: 'fetch',
    title: 'Supprimer un post (DELETE)',
    description:
      'Supprime le post avec l\'id 1.',
    endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'DELETE',
    starterCode: `async function deleteData() {
  // Supprime le post 1
  // Retourne un objet vide si succès

}`,
    expectedResponse: {
      type: 'object',
    },
    hints: [
      'DELETE n\'a pas besoin de body',
      'JSONPlaceholder retourne un objet vide {}',
      'N\'oublie pas d\'utiliser await',
    ],
    solution: `async function deleteData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
}`,
    difficulty: 'mid',
    category: 'fetch-api',
    tags: ['fetch', 'delete', 'api'],
    xp: 25,
  },

  // ============ MID - Error Handling ============
  {
    id: 'fetch_007',
    type: 'fetch',
    title: 'Gestion des erreurs',
    description:
      'Récupère des données et gère les erreurs HTTP correctement.',
    endpoint: 'https://jsonplaceholder.typicode.com/users/1',
    method: 'GET',
    starterCode: `async function fetchData() {
  // Récupère l'utilisateur 1
  // Vérifie si response.ok est true
  // Si non, lance une erreur
  // Sinon retourne les données

}`,
    expectedResponse: {
      type: 'object',
      requiredFields: ['id', 'name', 'email'],
    },
    hints: [
      'response.ok est true si status est 200-299',
      'Utilise throw new Error() pour les erreurs',
      'try/catch peut entourer le tout',
    ],
    solution: `async function fetchData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  const data = await response.json();
  return data;
}`,
    difficulty: 'mid',
    category: 'fetch-api',
    tags: ['fetch', 'error-handling', 'api'],
    xp: 30,
  },

  // ============ SENIOR - Advanced Patterns ============
  {
    id: 'fetch_008',
    type: 'fetch',
    title: 'Requêtes parallèles',
    description:
      'Récupère les utilisateurs ET les posts en parallèle avec Promise.all.',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    starterCode: `async function getData() {
  // Récupère en parallèle:
  // - https://jsonplaceholder.typicode.com/users
  // - https://jsonplaceholder.typicode.com/posts
  //
  // Retourne { users, posts }

}`,
    expectedResponse: {
      type: 'object',
      requiredFields: ['users', 'posts'],
    },
    hints: [
      'Utilise Promise.all() avec un tableau de fetches',
      'Chaque fetch retourne une promise',
      'Déstructure les résultats',
    ],
    solution: `async function getData() {
  const [usersRes, postsRes] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users'),
    fetch('https://jsonplaceholder.typicode.com/posts'),
  ]);

  const [users, posts] = await Promise.all([
    usersRes.json(),
    postsRes.json(),
  ]);

  return { users, posts };
}`,
    difficulty: 'senior',
    category: 'fetch-api',
    tags: ['fetch', 'promise-all', 'parallel'],
    xp: 40,
  },
  {
    id: 'fetch_009',
    type: 'fetch',
    title: 'Fetch avec Timeout',
    description:
      'Implémente un fetch avec un timeout de 5 secondes.',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    starterCode: `async function fetchData() {
  // Récupère les utilisateurs
  // Avec un timeout de 5000ms
  // Si timeout dépassé, lance une erreur
  // Hint: utilise AbortController

}`,
    expectedResponse: {
      type: 'array',
      minLength: 1,
    },
    hints: [
      'Crée un AbortController',
      'Passe controller.signal dans les options fetch',
      'Utilise setTimeout pour appeler controller.abort()',
      'N\'oublie pas de clearTimeout si succès',
    ],
    solution: `async function fetchData() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}`,
    difficulty: 'senior',
    category: 'fetch-api',
    tags: ['fetch', 'abort', 'timeout'],
    xp: 40,
  },
  {
    id: 'fetch_010',
    type: 'fetch',
    title: 'Fetch avec Retry',
    description:
      'Implémente un fetch qui réessaie 3 fois en cas d\'échec.',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    starterCode: `async function getData() {
  // Récupère les utilisateurs
  // En cas d'erreur, réessaie jusqu'à 3 fois
  // Avec un délai de 1 seconde entre chaque essai

}`,
    expectedResponse: {
      type: 'array',
      minLength: 1,
    },
    hints: [
      'Utilise une boucle for avec un compteur',
      'Catch l\'erreur et réessaie',
      'Ajoute un délai avec new Promise + setTimeout',
      'Lance l\'erreur après le dernier essai',
    ],
    solution: `async function getData() {
  const maxRetries = 3;
  const delay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('HTTP Error');
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}`,
    difficulty: 'senior',
    category: 'fetch-api',
    tags: ['fetch', 'retry', 'resilience'],
    xp: 45,
  },
];
