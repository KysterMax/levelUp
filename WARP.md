# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands
Package manager: `pnpm` (see `pnpm-lock.yaml`).

- Install deps:
  - `pnpm install`
- Run dev server (Vite):
  - `pnpm dev`
- Production build:
  - `pnpm build` (runs `tsc -b` then `vite build`)
- Preview production build locally:
  - `pnpm preview`
- Lint:
  - `pnpm lint`
  - Lint a single file: `pnpm exec eslint src/pages/Dashboard.tsx`
- Typecheck only (without bundling):
  - `pnpm exec tsc -b`
- Tests:
  - No test runner is currently configured (no `test` script in `package.json`).

## Runtime configuration
- Supabase is optional.
  - Env vars are documented in `.env.example`:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
  - When these are missing, the app runs in “offline mode” and persists user/progress to `localStorage`.
- Supabase schema (manual): `supabase/schema.sql`.

## High-level architecture
### App entry + routing
- Entry: `src/main.tsx` renders `src/App.tsx`.
- `src/App.tsx` sets up `react-router-dom` routes and lazy-loads page modules.
- Most authenticated routes are wrapped by `ProtectedRoute`, which renders the shared shell `src/components/layout/MainLayout.tsx`.

### Two persistence/auth modes (Supabase vs offline)
The codebase supports two modes, selected by `src/lib/supabase.ts`:

- Supabase mode (when env vars are present)
  - `src/stores/authStore.ts` (Zustand) owns:
    - Supabase `session`/`user`
    - profile/stats/settings rows fetched from Supabase tables
    - onboarding completion is inferred from `profile.initial_level`
  - `src/pages/Auth.tsx` handles sign-in/sign-up/password reset.
  - `src/components/onboarding/LevelResult.tsx` persists initial level + unlocked paths via `authStore.setInitialLevel()`.

- Offline mode (when env vars are absent)
  - `src/stores/userStore.ts` persists a local `User` model (stats, settings, unlocked paths, exercise results) to `localStorage`.
  - `src/stores/onboardingStore.ts` drives the onboarding flow (`welcome` → `test` → `result`).
  - `src/lib/storage.ts` defines the localStorage keys/prefix.

Note: Several UI surfaces (e.g. `MainLayout` and gamification widgets) read from `useUserStore`. If you extend Supabase mode, check whether the UI expects `userStore.user` to be present and keep stores in sync (or refactor to use `authStore` data throughout).

### Exercises + progress tracking
- Exercise content is static TypeScript data:
  - `src/data/exercises/*.ts` → combined in `src/data/exercises/index.ts` as `allExercises`.
- Runtime progress is tracked in `src/stores/exerciseStore.ts` (Zustand + `persist`):
  - `completedExercises` and `dailyChallenges` are stored under `localStorage` key `levelup-exercises`.
  - Daily challenge selection is deterministic from the date (see `getDailyExerciseId`).
- Exercise session/rendering flow:
  - `src/pages/Exercise.tsx` picks an exercise based on route params:
    - `/exercise/:type` (new exercise)
    - `/exercise/:type?training=true` (completed-only “training mode”)
    - `/exercise/id/:id` (explicit exercise)
    - `/exercise/:type?daily=true` (daily challenge UI + XP bonus)
  - It renders one of `src/components/exercises/*` (`QuizExercise`, `CodeChallenge`, `CodeReview`, `FetchChallenge`).

### Gamification
- `src/hooks/useGamification.ts` derives XP/level progress, streak state, and badge awarding.
- Badge/XP definitions live in `src/types/gamification.ts` and level thresholds in `src/types/user.ts`.
- UI widgets are in `src/components/gamification/*` (XP bar, streak counter, badges, daily goal, etc.).

### UI system / conventions
- Shadcn UI-style components live in `src/components/ui/*` (Radix-based primitives).
- Import alias: `@` → `src` (configured in `vite.config.ts` and `tsconfig.json`).
- Tailwind is configured via `@tailwindcss/vite` (see `vite.config.ts`) and styles are rooted at `src/index.css`.

### Build + deploy
- Vite config: `vite.config.ts`.
  - Includes PWA setup (`vite-plugin-pwa`) and runtime caching rules.
- Vercel SPA rewrites + build config: `vercel.json`.