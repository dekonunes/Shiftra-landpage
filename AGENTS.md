<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the React/TypeScript app. The landing page lives in `src/pages/landing/` with section components under `src/pages/landing/components/` and hooks in `src/pages/landing/hooks/`.
- Shared utilities are in `src/lib/` (e.g., `cn.ts`), global styles in `src/index.css`, and app bootstrap in `src/main.tsx` and `src/App.tsx`.
- Translations live in `src/i18n/` (`en.json`, `pt-BR.json`, `es.json`), and static assets are in `public/assets/landing/`.
- Build outputs go to `dist/`. Reference requirements and product copy in `LANDING_PAGE.md`.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite dev server at http://localhost:5173.
- `npm run build` runs `tsc -b` then creates a production bundle.
- `npm run lint` runs ESLint across the repo.
- `npm run preview` serves the production build locally.
- `npm run generate-webp` converts PNG assets to WebP; it runs automatically via `prebuild`.

## Coding Style & Naming Conventions
- TypeScript + React with strict typing; prefer explicit types for exported APIs.
- Indentation is 2 spaces. Use Tailwind utility classes and semantic tokens (`bg-background`, `text-foreground`) instead of raw hex.
- Component names use `PascalCase` (e.g., `HeroSection.tsx`), hooks use `useThing.ts`, and i18n keys use `camelCase`/nested objects.
- Lint with ESLint; run `npm run lint` before opening a PR.

## Testing Guidelines
- No automated test suite is configured yet. Validate changes with `npm run build` and manual UI checks.
- For UI changes, verify responsive behavior (mobile/tablet/desktop) and i18n strings in all locales.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative sentences (e.g., “Add pricing section animations.”).
- PRs should describe the change, link related issues, and include screenshots or recordings for visual updates.
- If you touch copy or UI text, update all locale files in `src/i18n/`.
- If you add images, place them in `public/assets/landing/` and run `npm run generate-webp`.

## Security & Configuration Tips
- Keep environment-specific values out of source control; use local `.env` files if needed.
- The Node version is pinned via Volta (`package.json`); align your local version with it.
