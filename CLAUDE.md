# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow rules

- **Never run `git commit`, `git push`, `git merge`, or any branch-modifying / history-rewriting git command without explicit approval from the user for that specific action.** Approval for one commit/push does not extend to the next one — ask each time. Read-only git commands (`status`, `diff`, `log`, `fetch`, `branch -v`, etc.) are fine without asking.

## Project

`whats.se` — public website for What! Arkitektur. Content (projects, categories, employees, site settings) lives in Sanity (project `lu0lnnx1`) and is pulled at build time via GROQ. Hosted as a static site on Cloudflare Pages.

Two independent projects, with no workspace tooling between them:

| Path | What | Package manager |
|---|---|---|
| `site/` | Astro 7 public site, served at www.whats.se | pnpm |
| `studio/` | Sanity v6 Studio, hosted at https://whats.sanity.studio | pnpm |

Hosting, deploys and dashboard settings are described in `docs/hosting.md`.

## Toolchain

Node and pnpm are pinned in `mise.toml` (Node 26.11.1, pnpm 12.9.1). Run `mise install` once. Cloudflare Pages takes the Node version from the `NODE_VERSION` env var in the dashboard; keep it in sync with `mise.toml`.

## Commands

Astro site (`cd site`):
- `pnpm dev` — dev server at http://localhost:4321
- `pnpm build` — static build to `site/out/`
- `pnpm check` — `astro check` (type checking for `.astro` and `.ts`)

Studio (`cd studio`):
- `pnpm dev` — Studio at http://localhost:3333 against the `development` dataset
- `pnpm typecheck`, `pnpm lint`, `pnpm build`

No test runner is configured in either project.

## Astro site (`site/`)

Fully static (`output: 'static'`, `outDir: './out'`). No UI framework integration — components are plain `.astro` files and the site ships no client-side JavaScript; keep it that way.

`build.format: 'file'` + `trailingSlash: 'never'` keep the URLs the site has always had (`/bostad`, served from `bostad.html`); don't change them.

### Data layer
All Sanity reads go through **`site/src/services/sanity.ts`** — a single object exposing `getSettings`, `getProjects`, `getCategory`, `getProjectsByCategory`, `getEmployees`, `getStudio`. The `@sanity/client` instance is in `src/lib/sanityClient.ts`, configured from `src/lib/config.ts`. Env vars are declared in the `env.schema` in `astro.config.mjs` and read through `astro:env/server`.

Add new queries to `sanity.ts` rather than calling the client from a page. Each query is a named `defineQuery` constant so Sanity TypeGen can type it. After changing a query or a schema, run `pnpm typegen` in `studio/`; it regenerates `studio/schema.json` and `site/src/sanity.types.ts` (both committed, never hand-edited). `src/types.ts` holds short aliases of the generated query result types. Image assets are projected with `"mainImage": mainImage.asset->` so consumers get the resolved asset document; follow that pattern.

Several documents store a manually curated ordering as a separate array of references (`category.sortedProjects`, `studio.sortedEmployees`, `settings.featuredProjects`). Fetch all items and the curated order, then merge with `getSortedArray<T>(allItems, sortedRefs)` from `src/utils/getSortedArray.ts`. See `src/pages/[category].astro` and `src/pages/studio.astro`.

### Pages and components
- Pages in `src/pages/`: `index.astro`, `[category].astro`, `projekt/[project].astro`, `studio.astro`. Data is fetched in frontmatter; dynamic routes use `getStaticPaths`.
- Every page wraps content in `src/layouts/Page.astro` (head/meta, `Header`, `Footer`, global CSS).
- Components follow atomic design under `src/components/` — `atoms/`, `molecules/`, `organisms/`, plus `portable-text/`.

### Styling
Tailwind v4 via `@tailwindcss/vite`. There is no `tailwind.config` — tokens are defined in `@theme` in `src/styles/global.css`:
- Colors `what-white` (#F2EFEB), `what-red-01` (#FF0222)
- Fonts `font-what` (Montserrat) and `font-what-mono` (IBM Plex Mono), loaded through the Astro Fonts API (`fonts` in `astro.config.mjs`, `<Font>` in `layouts/Page.astro`) from Google Fonts
- `content` breakpoint / container at 1792px
- Custom cursors `.cursor-dot` / `.cursor-pointer` (SVGs in `public/`) and a few legacy utilities (`.pt-67`, `.pt-75`, `.pt-111`, `.h-500`) are hand-written classes, since v4 doesn't generate them from theme values

### Images
Use `src/components/atoms/SanityImage.astro` for Sanity images. It builds a `srcset` through `src/lib/imageBuilder.ts` (`@sanity/image-url`) with fixed candidate widths and `fit=clip`, and uses the asset's LQIP as a background placeholder (`placeholder={false}` turns it off). Don't use Astro's `<Image>` for Sanity assets.

### Portable Text
Rendered with `astro-portabletext`. Component maps live in `src/lib/portableTextComponents.ts` (`projectTextComponents`, `studioTextComponents`); the mark and block components are in `src/components/portable-text/`.

### Environment
`site/.env.development` and `site/.env.production` (committed, non-secret) set `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. Local overrides go in `.env*.local` (gitignored).

## Sanity Studio (`studio/`)

Standalone Sanity v6 Studio. Defaults to the `development` dataset; target production explicitly with `SANITY_STUDIO_DATASET=production pnpm dev`, and only with care. It is hosted at https://whats.sanity.studio (`pnpm deploy`); `/admin` on the site redirects there.

Schemas live in `studio/schemas/` (registered in `schema.ts`):
- Documents: `category`, `project`, `employee`, `settings`, `studio`
- Objects: `richText`

`settings` and `studio` are **singletons**, registered with the built-in `document.singletons` API (beta) in `sanity.config.ts`, which also strips `unpublish`/`delete`. Don't add a second instance.

