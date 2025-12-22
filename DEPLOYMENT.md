# Guide de Déploiement - LevelUp.dev

## 1. Configuration Supabase

### Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un compte
2. Crée un nouveau projet
3. Note l'**URL** et la **clé anon** dans Settings > API

### Exécuter les migrations

1. Va dans **SQL Editor** dans ton dashboard Supabase
2. Copie et exécute le contenu de `supabase/migrations/001_initial_schema.sql`

### Configurer l'authentification GitHub

1. Va dans **Authentication > Providers > GitHub**
2. Active GitHub
3. Crée une OAuth App sur GitHub :
   - Va sur [GitHub Developer Settings](https://github.com/settings/developers)
   - Clique "New OAuth App"
   - **Application name**: LevelUp.dev
   - **Homepage URL**: `https://ton-domaine.com`
   - **Authorization callback URL**: `https://ton-projet.supabase.co/auth/v1/callback`
4. Copie le **Client ID** et **Client Secret** dans Supabase

## 2. Variables d'environnement

### Développement local

Crée un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta-cle-anon
```

### Production (Vercel)

Dans les settings de ton projet Vercel, ajoute :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://ton-projet.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `ta-cle-anon` |

### Production (Netlify)

Dans Site settings > Environment variables :

- `VITE_SUPABASE_URL` = `https://ton-projet.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `ta-cle-anon`

## 3. Déploiement

### Vercel (Recommandé)

```bash
# Installe Vercel CLI
npm i -g vercel

# Déploie
vercel
```

Ou connecte ton repo GitHub à Vercel pour le déploiement automatique.

### Netlify

```bash
# Build
npm run build

# Le dossier dist/ est prêt à être déployé
```

Ou connecte ton repo GitHub à Netlify.

### Build manuel

```bash
npm run build
# Sers le dossier dist/ avec n'importe quel serveur statique
```

## 4. Configuration post-déploiement

### Mettre à jour les URLs de callback

Après le déploiement, mets à jour :

1. **GitHub OAuth App** : Change le callback URL vers ton domaine de prod
2. **Supabase** : Dans Authentication > URL Configuration :
   - Site URL: `https://ton-domaine.com`
   - Redirect URLs: `https://ton-domaine.com/**`

## 5. Vérification

Vérifie que tout fonctionne :

- [ ] L'app se charge sans erreur
- [ ] L'authentification GitHub fonctionne
- [ ] Les données sont sauvegardées dans Supabase
- [ ] Le classement affiche les vrais utilisateurs
- [ ] L'XP s'accumule correctement

## Structure des tables Supabase

| Table | Description |
|-------|-------------|
| `profiles` | Profils utilisateurs (username, avatar) |
| `user_stats` | Stats de jeu (XP, niveau, streak) |
| `user_settings` | Préférences (thème, sons) |
| `exercise_results` | Résultats des exercices |
| `daily_progress` | Progression quotidienne |
| `user_badges` | Badges obtenus |
| `unlocked_paths` | Parcours débloqués |

## Vues

| Vue | Description |
|-----|-------------|
| `leaderboard` | Classement global par XP total |
| `weekly_leaderboard` | Classement hebdomadaire |

## Troubleshooting

### L'app fonctionne en mode offline

Vérifie que les variables d'environnement sont correctement définies et que le build a été refait après les avoir ajoutées.

### Erreur "RLS policy violation"

Les politiques RLS sont strictes. Vérifie que l'utilisateur est bien authentifié avant d'accéder aux données.

### GitHub OAuth ne fonctionne pas

Vérifie que le callback URL dans GitHub correspond exactement à celui de Supabase.
