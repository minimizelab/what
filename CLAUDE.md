# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow rules

- **Never run `git commit`, `git push`, `git merge`, or any branch-modifying / history-rewriting git command without explicit approval from the user for that specific action.** Approval for one commit/push does not extend to the next one — ask each time. Read-only git commands (`status`, `diff`, `log`, `fetch`, `branch -v`, etc.) are fine without asking.

## Project

`whats.se` — public website for What! Arkitektur. Content (projects, categories, employees, site settings) lives in Sanity (project `lu0lnnx1`) and is pulled at build time via GROQ. Hosted as a static site on Cloudflare Pages.

The repo is **mid-migration from Next.js to Astro** (branch `astro-rewrite`). Three independent projects live side by side, with no workspace tooling between them:

| Path | What | Package manager | Status |
|---|---|---|---|
| `site/` | Astro 7 public site | pnpm | New. Target of the migration. |
| `studio/` | Standalone Sanity v6 Studio | pnpm | New. Runs locally only for now. |
| Root (`pages/`, `app/`, `src/`, `next.config.mjs`, …) | Next.js 14 site + embedded Studio at `/admin` | npm | Legacy. Still what production builds and deploys from `main`. |

New public-site work goes in `site/`. Touch the root Next app only for fixes that must reach production before the cutover. The cutover (deleting the root Next app) is a separate, not-yet-made decision; see `docs/superpowers/specs/2026-05-08-astro-migration-iteration-1-design.md` and `docs/astro-migration-plan.md`.

## Toolchain

Node and pnpm are pinned in `mise.toml` (Node 26.11.1, pnpm 12.9.1). Run `mise install` once. `.nvmrc` must stay in sync with the Node version in `mise.toml` — Cloudflare Pages reads `.nvmrc`. The root `package.json` enforces `engines` (`node 26.x`, `npm 11.x`).

## Commands

Astro site (`cd site`):
- `pnpm dev` — dev server at http://localhost:4321
- `pnpm build` — static build to `site/out/`
- `pnpm check` — `astro check` (type checking for `.astro` and `.ts`)

Studio (`cd studio`):
- `pnpm dev` — Studio at http://localhost:3333 against the `development` dataset
- `pnpm typecheck`, `pnpm lint`, `pnpm build`

Legacy Next site (repo root):
- `npm run dev`, `npm run build` (static export to `out/`), `npm run lint`

No test runner is configured in any project.

## Astro site (`site/`)

Fully static (`output: 'static'`, `outDir: './out'`). No UI framework integration — components are plain `.astro` files with no client-side hydration.

### Data layer
All Sanity reads go through **`site/src/services/sanity.ts`** — a single object exposing `getSettings`, `getProject(s)`, `getCategory`, `getProjectsByCategory`, `getEmployees`, `getStudio`. The `@sanity/client` instance is in `src/lib/sanityClient.ts`, configured from `src/lib/config.ts` (`PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`, `useCdn: false`).

Add new queries to `sanity.ts` rather than calling the client from a page. Image assets are projected with `"mainImage": mainImage.asset->` so consumers get the resolved asset document; follow that pattern. Shared types are in `src/types.ts`.

Several documents store a manually curated ordering as a separate array of references (`category.sortedProjects`, `studio.sortedEmployees`, `settings.featuredProjects`). Fetch all items and the curated order, then merge with `getSortedArray<T>(allItems, sortedRefs)` from `src/utils/getSortedArray.ts`. See `src/pages/[category].astro` and `src/pages/studio.astro`.

### Pages and components
- Pages in `src/pages/`: `index.astro`, `[category].astro`, `projekt/[project].astro`, `studio.astro`. Data is fetched in frontmatter; dynamic routes use `getStaticPaths`.
- Every page wraps content in `src/layouts/Page.astro` (head/meta, `Header`, `Footer`, global CSS).
- Components follow atomic design under `src/components/` — `atoms/`, `molecules/`, `organisms/`, plus `portable-text/`.

### Styling
Tailwind v4 via `@tailwindcss/vite`. There is no `tailwind.config` — tokens are defined in `@theme` in `src/styles/global.css`:
- Colors `what-white` (#F2EFEB), `what-red-01` (#FF0222)
- Fonts `font-what` (Montserrat) and `font-what-mono` (IBM Plex Mono), self-hosted via `@fontsource` imports in the same file
- `content` breakpoint / container at 1792px
- Custom cursors `.cursor-dot` / `.cursor-pointer` (SVGs in `public/`) and a few legacy utilities (`.pt-67`, `.pt-75`, `.pt-111`, `.h-500`) are hand-written classes, since v4 doesn't generate them from theme values

### Images
Use `src/components/atoms/SanityImage.astro` for Sanity images. It builds a `srcset` through `src/lib/imageBuilder.ts` (`@sanity/image-url`) and uses the asset's LQIP as a background placeholder. Don't use Astro's `<Image>` for Sanity assets.

### Portable Text
Rendered with `astro-portabletext`. Component maps live in `src/lib/portableTextComponents.ts` (`projectTextComponents`, `studioTextComponents`); the mark and block components are in `src/components/portable-text/`.

### Environment
`site/.env.development` and `site/.env.production` (committed, non-secret) set `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. Local overrides go in `.env*.local` (gitignored).

## Sanity Studio (`studio/`)

Standalone Sanity v6 Studio. Defaults to the `development` dataset; target production explicitly with `SANITY_STUDIO_DATASET=production pnpm dev`, and only with care. Editors still use `/admin` on the live Next site.

Schemas live in `studio/schemas/` (registered in `schema.ts`):
- Documents: `category`, `project`, `employee`, `settings`, `studio`
- Objects: `richText`

`settings` and `studio` are **singletons** (enforced in `sanity.config.ts` — `unpublish`/`delete`/`duplicate` actions are stripped and they're hidden from new-document options). Don't add a second instance.

`studio/schemas/` is currently identical to the legacy `app/(studio)/schemas/`. Until the cutover, a schema change has to be made in both places, because production editors use the legacy copy.

## Legacy Next site (repo root)

Pages Router for the public site (`pages/`, `getStaticProps`), App Router only for the embedded Studio under `app/(studio)/admin/`. Data layer in `src/services/sanity.ts`, env vars `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`. The root `tsconfig.json` excludes `site/` and `studio/` so `next build` doesn't type-check them. Production redirects are in `public/_redirects`.
