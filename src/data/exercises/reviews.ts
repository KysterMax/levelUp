import type { CodeReview } from '@/types';

export const reviewExercises: CodeReview[] = [
  // ============ JUNIOR - Basic Issues ============
  {
    id: 'review_001',
    type: 'review',
    title: 'Fetch API Issues',
    description:
      'Ce code fait un appel API mais contient plusieurs problèmes. Trouve-les tous !',
    code: `async function fetchUsers() {
  const response = fetch('/api/users');
  const data = response.json();

  for (var i = 0; i < data.length; i++) {
    console.log(data[i].name);
  }

  return data;
}

async function updateUser(id, name) {
  fetch('/api/users/' + id, {
    method: 'POST',
    body: { name: name }
  });
}`,
    issues: [
      {
        line: 2,
        type: 'bug',
        description: 'Manque le await devant fetch()',
        severity: 'high',
      },
      {
        line: 3,
        type: 'bug',
        description: 'Manque le await devant response.json()',
        severity: 'high',
      },
      {
        line: 5,
        type: 'style',
        description: 'Utiliser let ou const au lieu de var',
        severity: 'low',
      },
      {
        line: 12,
        type: 'bug',
        description: 'POST devrait être PUT ou PATCH pour une mise à jour',
        severity: 'medium',
      },
      {
        line: 13,
        type: 'bug',
        description: 'Le body doit être JSON.stringify() et headers Content-Type manquants',
        severity: 'high',
      },
    ],
    difficulty: 'junior',
    category: 'fetch-api',
    tags: ['fetch', 'async', 'bugs'],
    xp: 20,
  },
  {
    id: 'review_002',
    type: 'review',
    title: 'Array Methods Mistakes',
    description:
      'Ce code manipule des tableaux mais contient des erreurs courantes.',
    code: `function processUsers(users) {
  // Trouve l'utilisateur admin
  const admin = users.find(u => u.role = 'admin');

  // Filtre les utilisateurs actifs
  const activeUsers = users.filter(u => {
    u.isActive === true;
  });

  // Double tous les scores
  const scores = users.map(u => u.score).map(s * 2);

  // Supprime le premier utilisateur
  users.shift();

  return { admin, activeUsers, scores, users };
}`,
    issues: [
      {
        line: 3,
        type: 'bug',
        description: 'Utilise = au lieu de === dans la condition (affectation au lieu de comparaison)',
        severity: 'high',
      },
      {
        line: 7,
        type: 'bug',
        description: 'Manque le return dans le callback de filter',
        severity: 'high',
      },
      {
        line: 11,
        type: 'bug',
        description: 'Syntaxe invalide: s * 2 devrait être s => s * 2',
        severity: 'high',
      },
      {
        line: 14,
        type: 'bug',
        description: 'shift() modifie le tableau original (mutation), peut causer des bugs',
        severity: 'medium',
      },
    ],
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['arrays', 'bugs', 'methods'],
    xp: 20,
  },
  {
    id: 'review_003',
    type: 'review',
    title: 'Variable Scope Issues',
    description:
      'Ce code a des problèmes de portée de variables.',
    code: `function getUserData() {
  if (true) {
    var username = 'john';
    let email = 'john@test.com';
  }

  console.log(username);
  console.log(email);

  for (var i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log(i);
    }, 100);
  }
}`,
    issues: [
      {
        line: 3,
        type: 'style',
        description: 'var a une portée fonction, utilise let/const pour une portée bloc',
        severity: 'low',
      },
      {
        line: 8,
        type: 'bug',
        description: 'email n\'est pas accessible hors du bloc if (ReferenceError)',
        severity: 'high',
      },
      {
        line: 10,
        type: 'bug',
        description: 'var dans une boucle avec setTimeout affichera 3 trois fois. Utilise let.',
        severity: 'high',
      },
    ],
    difficulty: 'junior',
    category: 'javascript-fundamentals',
    tags: ['scope', 'var', 'let', 'closures'],
    xp: 20,
  },

  // ============ MID - Async & Logic Issues ============
  {
    id: 'review_004',
    type: 'review',
    title: 'Promise Handling Errors',
    description:
      'Ce code gère des Promises mais avec plusieurs anti-patterns.',
    code: `async function loadData() {
  try {
    const users = await fetchUsers();
    const posts = await fetchPosts();
    const comments = await fetchComments();

    return { users, posts, comments };
  } catch {
    console.log('Error');
  }
}

async function processItem(item) {
  const result = await validateItem(item);
  if (result) {
    await saveItem(item);
    return true;
  }
  return;
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    fetch('/api/users/' + id)
      .then(res => res.json())
      .then(data => resolve(data));
  });
}`,
    issues: [
      {
        line: 3,
        type: 'performance',
        description: 'Les 3 fetches sont séquentiels alors qu\'ils pourraient être parallèles avec Promise.all',
        severity: 'medium',
      },
      {
        line: 8,
        type: 'bug',
        description: 'Le catch ignore l\'erreur (error variable non utilisée) et ne la relance pas',
        severity: 'high',
      },
      {
        line: 18,
        type: 'style',
        description: 'return sans valeur est implicitement undefined, préférer return false explicite',
        severity: 'low',
      },
      {
        line: 21,
        type: 'bug',
        description: 'Anti-pattern Promise constructor: la fonction retourne déjà une Promise, pas besoin de wrapper',
        severity: 'medium',
      },
      {
        line: 24,
        type: 'bug',
        description: 'Le reject n\'est jamais appelé en cas d\'erreur fetch',
        severity: 'high',
      },
    ],
    difficulty: 'mid',
    category: 'async-promises',
    tags: ['promises', 'async', 'error-handling'],
    xp: 25,
  },
  {
    id: 'review_005',
    type: 'review',
    title: 'React Component Issues',
    description:
      'Ce composant React contient plusieurs problèmes de performance et de logique.',
    code: `import { useState, useEffect } from 'react';

function UserList({ userId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  });

  const handleClick = () => {
    console.log('clicked');
  };

  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {sortedUsers.map(user => (
        <div onClick={handleClick}>
          {user.name}
        </div>
      ))}
    </div>
  );
}`,
    issues: [
      {
        line: 14,
        type: 'bug',
        description: 'useEffect sans tableau de dépendances cause une boucle infinie',
        severity: 'high',
      },
      {
        line: 21,
        type: 'bug',
        description: 'sort() mute le tableau original, provoquant des re-renders inattendus',
        severity: 'high',
      },
      {
        line: 26,
        type: 'bug',
        description: 'Manque la prop key sur l\'élément mappé',
        severity: 'high',
      },
      {
        line: 7,
        type: 'bug',
        description: 'userId est passé en props mais jamais utilisé dans le fetch',
        severity: 'medium',
      },
    ],
    difficulty: 'mid',
    category: 'react-hooks',
    tags: ['react', 'hooks', 'useEffect', 'performance'],
    xp: 30,
  },
  {
    id: 'review_006',
    type: 'review',
    title: 'TypeScript Type Issues',
    description:
      'Ce code TypeScript a des problèmes de typage.',
    code: `interface User {
  id: number;
  name: string;
  email?: string;
}

function processUser(user: any) {
  console.log(user.name.toUpperCase());
  console.log(user.email.toLowerCase());
  return user.age * 2;
}

function getUsers(): User[] {
  const response = fetch('/api/users');
  return response;
}

const users: User[] = [
  { id: 1, name: 'John' },
  { id: '2', name: 'Jane', email: 'jane@test.com' }
];`,
    issues: [
      {
        line: 7,
        type: 'style',
        description: 'Utiliser any détruit les bénéfices de TypeScript, utiliser User',
        severity: 'medium',
      },
      {
        line: 9,
        type: 'bug',
        description: 'email est optionnel mais accédé sans vérification (possible undefined)',
        severity: 'high',
      },
      {
        line: 10,
        type: 'bug',
        description: 'age n\'existe pas dans l\'interface User',
        severity: 'high',
      },
      {
        line: 14,
        type: 'bug',
        description: 'fetch retourne Promise<Response>, pas User[] (manque await et .json())',
        severity: 'high',
      },
      {
        line: 20,
        type: 'bug',
        description: 'id est typé number mais "2" est une string',
        severity: 'high',
      },
    ],
    difficulty: 'mid',
    category: 'typescript',
    tags: ['typescript', 'types', 'safety'],
    xp: 30,
  },

  // ============ SENIOR - Architecture & Security ============
  {
    id: 'review_007',
    type: 'review',
    title: 'Security Vulnerabilities',
    description:
      'Ce code contient des failles de sécurité. Identifie-les.',
    code: `app.get('/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ' + req.params.id;
  db.execute(query);
});

app.post('/search', (req, res) => {
  const html = '<div>' + req.body.searchTerm + '</div>';
  res.send(html);
});

function loadScript(url) {
  eval('import("' + url + '")');
}

localStorage.setItem('authToken', token);
localStorage.setItem('creditCard', cardNumber);`,
    issues: [
      {
        line: 2,
        type: 'security',
        description: 'SQL Injection: concaténation directe dans la requête. Utiliser des paramètres préparés.',
        severity: 'high',
      },
      {
        line: 7,
        type: 'security',
        description: 'XSS (Cross-Site Scripting): le contenu utilisateur est injecté sans échappement',
        severity: 'high',
      },
      {
        line: 11,
        type: 'security',
        description: 'eval() avec des données externes est extrêmement dangereux',
        severity: 'high',
      },
      {
        line: 15,
        type: 'security',
        description: 'Données sensibles dans localStorage (accessible via XSS). Préférer httpOnly cookies.',
        severity: 'high',
      },
    ],
    difficulty: 'senior',
    category: 'clean-code',
    tags: ['security', 'xss', 'sql-injection'],
    xp: 35,
  },
  {
    id: 'review_008',
    type: 'review',
    title: 'Performance Anti-patterns',
    description:
      'Ce code a des problèmes de performance significatifs.',
    code: `function processData(items) {
  let result = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (items[i].id === items[j].parentId) {
        result.push({ ...items[i], child: items[j] });
      }
    }
  }

  items.forEach(item => {
    document.getElementById('container').innerHTML += '<div>' + item.name + '</div>';
  });

  const users = items.map(i => i.user);
  const uniqueUsers = [...new Set(users.map(u => JSON.stringify(u)))].map(u => JSON.parse(u));

  return { result, uniqueUsers };
}`,
    issues: [
      {
        line: 4,
        type: 'performance',
        description: 'Boucle imbriquée O(n²). Utiliser une Map pour lookup O(1).',
        severity: 'high',
      },
      {
        line: 13,
        type: 'performance',
        description: 'innerHTML dans une boucle cause des reflows répétés. Construire le HTML puis l\'insérer une fois.',
        severity: 'high',
      },
      {
        line: 17,
        type: 'performance',
        description: 'JSON.stringify/parse pour dédupliquer est coûteux. Utiliser un identifiant unique.',
        severity: 'medium',
      },
    ],
    difficulty: 'senior',
    category: 'clean-code',
    tags: ['performance', 'optimization', 'big-o'],
    xp: 35,
  },
  {
    id: 'review_009',
    type: 'review',
    title: 'Clean Code Violations',
    description:
      'Ce code viole plusieurs principes de clean code.',
    code: `function calc(a, b, c, d, e, f, g, h) {
  let x = 0;
  if (a > 0) {
    if (b > 0) {
      if (c === 'add') {
        x = a + b;
      } else if (c === 'sub') {
        x = a - b;
      } else if (c === 'mul') {
        x = a * b;
      } else if (c === 'div') {
        x = a / b;
      }
    }
  }
  // TODO: handle d, e, f, g, h later
  return x;
}

class UserManager {
  getUser(id) { /* ... */ }
  saveUser(user) { /* ... */ }
  deleteUser(id) { /* ... */ }
  sendEmail(user, message) { /* ... */ }
  generateReport(users) { /* ... */ }
  validatePassword(password) { /* ... */ }
  encryptData(data) { /* ... */ }
}`,
    issues: [
      {
        line: 1,
        type: 'style',
        description: 'Trop de paramètres (8). Utiliser un objet de configuration.',
        severity: 'medium',
      },
      {
        line: 1,
        type: 'style',
        description: 'Noms de variables non descriptifs (calc, a, b, x). Utiliser des noms explicites.',
        severity: 'medium',
      },
      {
        line: 3,
        type: 'style',
        description: 'Nested if excessifs (arrow anti-pattern). Utiliser early returns ou switch.',
        severity: 'medium',
      },
      {
        line: 16,
        type: 'bug',
        description: 'Paramètres d, e, f, g, h non utilisés - code mort.',
        severity: 'high',
      },
      {
        line: 20,
        type: 'style',
        description: 'Classe fait trop de choses (God Class). Viole Single Responsibility Principle.',
        severity: 'high',
      },
    ],
    difficulty: 'senior',
    category: 'clean-code',
    tags: ['clean-code', 'solid', 'refactoring'],
    xp: 35,
  },
];
