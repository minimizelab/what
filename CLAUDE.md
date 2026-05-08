# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow rules

- **Never run `git commit`, `git push`, `git merge`, or any branch-modifying / history-rewriting git command without explicit approval from the user for that specific action.** Approval for one commit/push does not extend to the next one — ask each time. Read-only git commands (`status`, `diff`, `log`, `fetch`, `branch -v`, etc.) are fine without asking.

## Project

`whats.se` — public website for What! Arkitektur. Next.js 14 frontend statically exported, with an embedded Sanity Studio admin at `/admin`. Content (projects, categories, employees, site settings) lives in Sanity and is pulled at build time via GROQ.

## Commands

- `npm run dev` — Next dev server (http://localhost:3000). Studio at `/admin`.
- `npm run build` — Static export (writes to `out/`, since `next.config.mjs` sets `output: 'export'`).
- `npm run start` — Serve the production build.
- `npm run lint` — `next lint` (ESLint with `eslint:recommended` + `next/core-web-vitals` + `prettier`).

No test runner is configured.

Node version is pinned to `22.x` (`.nvmrc` → 22.16.0). Use that exact major or `npm install` will reject (`engines` enforced).

## Architecture

### Two routers in one app
This is a hybrid Pages-Router + App-Router project, deliberately split:

- **Public site → `pages/`** (Pages Router). All visitor-facing pages: `index.tsx`, `[category].tsx`, `projekt/[project].tsx`, `studio.tsx`. They use `getStaticProps` / `getStaticPaths` and render at build time — required because the whole site is statically exported.
- **Sanity Studio → `app/(studio)/admin/`** (App Router). The `(studio)` route group hosts the embedded Sanity Studio (mounted via `next-sanity/studio`), its `sanity.config.ts`, schemas, and desk structure. `app/layout.tsx` is the App-Router root layout but only the `/admin` subtree actually uses it.

When adding a new public page, use Pages Router conventions and `getStaticProps`. Don't add public pages under `app/` — `output: 'export'` plus the existing pattern assumes Pages Router for the site.

### Data layer
All Sanity reads go through **`src/services/sanity.ts`** — a single object exposing `getSettings`, `getProject(s)`, `getCategory`, `getProjectsByCategory`, `getEmployees`, `getStudio`. Each function is a GROQ query against the `next-sanity` client configured in `src/lib/sanityClient.ts` + `src/lib/config.ts` (uses `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`, `useCdn: false`).

When adding a new query, add it to `sanity.ts` rather than calling the client directly from a page — the rest of the codebase assumes this single entry point. Image assets are normally projected with `"mainImage": mainImage.asset->` so consumers get the resolved asset document; follow that pattern.

### Sanity content model
Schemas live in `app/(studio)/schemas/` (registered in `schema.ts`):
- Documents: `category`, `project`, `employee`, `settings`, `studio`
- Objects: `richText`

`settings` and `studio` are **singletons** (enforced in `sanity.config.ts` — `unpublish`/`delete`/`duplicate` actions are stripped and they're hidden from `newDocumentOptions`). Don't add a second instance; edit the existing one.

Several documents store a manually-curated ordering as a separate array of references (e.g. `category.sortedProjects`, `studio.sortedEmployees`, `settings.featuredProjects`). The pattern is: fetch all items, fetch the curated order, then call `getSortedArray<T>(allItems, sortedRefs)` from `src/utils/getSortedArray.ts` to merge them. See `pages/[category].tsx` and `pages/studio.tsx` for the canonical usage.

### Components
Atomic design under `src/components/` — `atoms/`, `molecules/`, `organisms/`, `templates/`. Pages compose `templates/Page.tsx` (which renders `Header` + `Nav` + content + filter bar) and pass settings + a `filterBar` slot.

### Styling
Tailwind, with project-specific tokens in `tailwind.config.ts`:
- Custom colors: `what-white` (#F2EFEB), `what-red-01` (#FF0222)
- Custom fonts: `font-what` (Montserrat) and `font-what-mono` (IBM Plex Mono), loaded via `next/font/google` in `pages/_app.tsx` and exposed as CSS variables
- Custom cursors `cursor-dot` / `cursor-pointer` use SVGs in `public/`
- `screens.content: 1792px` is the max content width breakpoint

### Portable Text
Rich text rendering uses `@portabletext/react` with custom serializers in `src/lib/serializers.tsx` (note: there's also a `src/serializers.tsx` — the `lib/` one is the one currently imported).

### Image handling
`next.config.mjs` uses a custom image loader and whitelists `cdn.sanity.io`. Sanity image URLs are built via `src/lib/imageBuilder.ts` and the `useSanityImage` hook in `src/hooks/`. Use these rather than `<Image>` defaults.

## Environment variables

Required at build/dev time:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Files: `.env`, `.env.development`, `.env.production` (already present).
