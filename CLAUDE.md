# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Start dev server (localhost:3000)
yarn build            # Production build
yarn lint             # ESLint check
yarn lint:fix         # ESLint with auto-fix
yarn test             # Jest with coverage (80% threshold)
yarn test-watch       # Jest in watch mode
npx jest path/to/file # Run a single test file
yarn type-check       # TypeScript check (tsc --noEmit)
yarn ci-checks        # Runs lint, type-check, and test sequentially
```

Pre-commit hooks (Husky + lint-staged) run ESLint, Prettier, and type-checking on staged files.

## Architecture

**Next.js 15 App Router** application for KS2 spelling practice. Uses CSS Modules for styling (not Tailwind).

### Data flow

- **Authentication**: Clerk (`@clerk/nextjs`). All routes except `/` are protected via `src/middleware.ts`.
- **Database**: MongoDB Atlas. Single `users` collection stores all user data including words, word sets, and test results. Connection via singleton client in `src/lib/mongoClient.ts`.
- **Mutations**: Next.js Server Actions in `src/actions/` — no REST API for data mutations. Client components call server actions directly.
- **TTS**: Azure Speech SDK exposed via API route at `/api/tts/[word]`. Called from client via `src/utils/sayTestWord.ts`.

### Key directories

- `src/actions/` — Server actions for all DB reads/writes. Most call `initialiseUser()` first to ensure the user exists.
- `src/components/` — React components with co-located CSS modules. Interactive components use `'use client'`.
- `src/utils/` — Pure utilities (spell check, word selection algorithm, progress stats, speech).
- `src/constants/words.ts` — Platform word lists for year 3-4 and year 5-6, assigned to new users.
- `src/types/types.ts` — Shared TypeScript types (`DbUser`, `Word`, `WordSet`, etc.).

### Test page lifecycle

The test page (`src/app/test/`) has two modes (`?mode=auto` or `?mode=manual`) and cycles through states: notStarted → test → review → revise → finished/cancelled. The Review component handles marking and calls `addTestResults()` on completion.

### Auto word selection

`src/utils/wordSelection.ts` picks words based on the user's test history, year group preferences, and optional inclusion of custom words. Recalculated after each test.

## Environment Variables

Required in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `MONGODB_URI`, `MONGODB_DB`, `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`.

## Quality Gates

Before opening a PR, all three checks must pass:

1. `yarn lint` — no lint errors
2. `yarn type-check` — no type errors
3. `yarn test` — all tests pass with 80% coverage

If a check fails, fix the issue and re-run. Do not open a PR with failing checks.

## Code Style

- Prettier: 120 char width, single quotes, trailing commas
- ESLint: Airbnb config + TypeScript + Prettier integration
