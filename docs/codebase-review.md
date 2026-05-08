# Codebase review — 2026-05

A read-through of the full source tree (~50 source files) at the start of the maintenance pass. Companion to `security-updates.md`, which covers dependencies; this doc covers code quality, design choices, and concrete cleanup opportunities.

## At a glance

- **Size:** ~50 TS/TSX source files, 4 public routes, 5 Sanity document types
- **Stack:** Next.js 14 (Pages Router for site + App Router for `/admin`), React 18, TypeScript strict, Tailwind 3, Sanity v3
- **Build target:** Static export (`output: 'export'`) → no Node server in production
- **Overall health:** **Solid for a small brochure site.** Architecture is appropriate, code is readable, types are strict. Main concerns are stale deps (covered separately) and a handful of small inconsistencies that have crept in over time. No structural rewrites needed.

## Architecture

### Routing split (deliberate, works well)
- `pages/` — public site, all rendered at build time via `getStaticProps`/`getStaticPaths`
  - `index.tsx` (featured projects)
  - `[category].tsx` (filtered projects)
  - `projekt/[project].tsx` (project detail)
  - `studio.tsx` (about/contact page — confusingly named, this is *not* the Sanity Studio)
- `app/(studio)/admin/` — App-Router route group hosting the embedded Sanity Studio (mounted via `next-sanity/studio`)

The duplication of `pages/_document.tsx` and `app/layout.tsx` (both set `lang="sv"` and `bg-what-white cursor-dot`) is the only real friction here.

### Data flow
All Sanity reads go through one module: `src/services/sanity.ts`. Each function is a hand-written GROQ query with manually-typed return values. Pages call these in `getStaticProps` and pass results down as props.

Image asset projection (`"mainImage": mainImage.asset->`) is consistent across queries — good. Resolved assets carry `metadata.dimensions` and `metadata.lqip`, which the rendering side relies on.

### Content model
Five document types: `category`, `project`, `employee`, `settings`, `studio`. `settings` and `studio` are singletons, enforced in `sanity.config.ts` (delete/unpublish/duplicate stripped, hidden from "new" menu).

Three places use a "manually-curated ordering with everything else appended" pattern:
- `category.sortedProjects` → `getProjectsByCategory()` + `getSortedArray()`
- `studio.sortedEmployees` → `getEmployees()` + `getSortedArray()`
- `settings.featuredProjects` (used as-is on home, no append-rest)

`getSortedArray<T extends { _id: string }>` in `src/utils/getSortedArray.ts` is a generic, reusable 7-line utility — nice abstraction.

### Components
Atomic design: 7 atoms, 4 molecules, 6 organisms, 1 template. Hierarchy is genuine (atoms compose into molecules, etc.) — not just a folder convention.

`SanityImage` (atom) wraps `next/image` + `useNextSanityImage` + LQIP blur — single source of truth for image rendering on the public site.

### Styling
Tailwind with three custom tokens worth knowing:
- Colors: `what-white` (#F2EFEB), `what-red-01` (#FF0222)
- Fonts: `font-what` (Montserrat), `font-what-mono` (IBM Plex Mono), loaded via `next/font/google` in `_app.tsx`
- Custom cursors `cursor-dot` / `cursor-pointer` from SVGs in `public/`

## Strengths

1. **Right-sized stack.** Static export + headless CMS is the correct choice for a brochure site. No SSR complexity, no runtime server to secure or scale.
2. **Single data entry point.** `src/services/sanity.ts` contains every GROQ query the site uses. Easy to audit, easy to extend.
3. **Strict TypeScript with central types.** `src/types.ts` is the canonical model. `tsconfig.json` has `strict: true`.
4. **Singleton enforcement.** `sanity.config.ts` correctly hides `settings`/`studio` from new-doc menus and strips destructive actions. Editors can't accidentally create duplicates.
5. **Generic sort-merge utility.** `getSortedArray` is small, generic, and used consistently.
6. **Image rendering done properly.** LQIP blur placeholders, custom Sanity loader, `priority` flag for above-the-fold cards, sensible `sizes` attributes.
7. **Defensive page composition.** `pages/_app.tsx` falls back to `src/config/defaults.ts` for `title`/`email`/`footerText` if Sanity settings are missing.
8. **Localized for editors.** Schema titles and descriptions are in Swedish — matches the audience.
9. **Almost no code-debt markers.** One `eslint-disable-next-line` and one `as` cast in the entire repo. No `@ts-ignore`, no `TODO`/`FIXME`/`HACK`.

## Weaknesses

### Real issues (worth fixing)

1. **Dead duplicate file: `src/serializers.tsx`.** Not imported anywhere. The actually-used file is `src/lib/serializers.tsx` (different content). Confusing to readers.
2. **`callto:` instead of `tel:`** in `EmployeeCard.tsx` and `pages/studio.tsx`. `callto:` is non-standard (Skype-era) and won't trigger native dialers on most devices.
3. **`router.back()` with no fallback** in `pages/projekt/[project].tsx`. If a user lands directly on a project URL (shared link, search result), the "tillbaka" button does nothing. Should fall back to `/` when there's no history.
4. **No CMS-driven alt text.** Image alt texts are hardcoded (`'image for project ' + title`). Sanity images support `alt` natively; should be added to schemas and projected through GROQ for accessibility.
5. **Implicit dependency on image projection shape.** `ImageGrid` and `ProjectHeader` read `img.metadata.dimensions.width/height` directly. If a future GROQ query forgets `asset->`, this crashes at runtime with no type-system warning. The `Project.images` type is `{ asset: SanityImageAssetDocument }[]` but the `metadata` reach-through isn't represented in the type.
6. **`mainImage` vs. `images[0]` conflation.** Project schema has a `mainImage` field, but `ProjectHeader` uses `images[0]` as the hero, then `[project].tsx` does `images.slice(1)` for the grid. `mainImage` is used for OG meta and card thumbnails. So changing the order of `images` in the CMS silently changes the visual hero. This is undocumented and surprising.
7. **`TextUppercase.tsx` exports a function literally named `TextMedium`** — copy-paste leftover. Default exports save you here, but `console.log` and React DevTools will show the wrong name.
8. **Unused `white` prop on `TextLarge`.** Declared in the interface, never read.
9. **Body className duplicated between `pages/_document.tsx` and `app/layout.tsx`** (`bg-what-white cursor-dot` + `lang="sv"`). Will drift over time. Currently aligned, but no enforcement.
10. **Footer's title link uses `<a href="/">` instead of `next/link`** — inconsistent with the rest of the codebase, causes a full page reload.
11. **Exact-pinned dependencies** in `package.json` (no caret prefixes for most deps). This is why `npm update` couldn't move `next` from 14.1.0 to 14.2.x in the security pass. Worth loosening to `^` for non-breaking ranges.

### Small smells

12. **`onMouseEnter`/`onMouseLeave` + `useState` for hover** in `ProjectCard.tsx`. Pure CSS via Tailwind `group-hover:` would be cleaner, render-free, and work for keyboard focus.
13. **Hardcoded `og:url`** (`https://www.whats.se`) in `_app.tsx`. Should be derived from current path or env var.
14. **No `tel:` / `mailto:` consistency.** Mail uses `mailto:` correctly; phone doesn't. (See item 2.)
15. **`Section` atom hardcodes its own padding** (`mx-8 sm:mx-16`). A layout primitive that prescribes its own outer margin is awkward to compose. Minor.
16. **GROQ queries return manually-typed shapes.** Sanity v3+ supports TypeGen / `defineQuery` to generate types from queries. Would catch schema drift at build time. Real value only after the Sanity v3→v5 upgrade.
17. **No SEO assets.** No `sitemap.xml`, no `robots.txt`, no JSON-LD structured data, no `apple-touch-icon`, no `theme-color`. For an architecture firm site, JSON-LD `Organization` + project structured data would pay off in search.
18. **No fallback OG image.** Project pages set `og:image`, but `index.tsx` and `[category].tsx` don't. Add a default to `settings`.
19. **No CI.** No `.github/workflows`. Lint and build aren't enforced anywhere; relies on the deployer (Vercel/Netlify, judging by `_redirects` and `next.config.mjs`) to catch failures.
20. **`@types/node` 20 with Node 22 runtime.** Works but mismatched. Bump to `@types/node@22`.

## Low-hanging fruit (prioritized)

These are all small (≤30 min each) and require no architectural decisions. Roughly ordered by user-visible impact / risk reduction.

| # | Change | Effort | Impact |
|---|---|---|---|
| 1 | Delete unused `src/serializers.tsx` | 1 min | Code clarity |
| 2 | `callto:` → `tel:` in EmployeeCard + studio.tsx | 2 min | Mobile UX |
| 3 | Add `Link href="/"` fallback to "tillbaka" button | 5 min | UX for direct landings |
| 4 | Loosen `package.json` exact pins to `^` (non-breaking) | 5 min | Future maintainability |
| 5 | Rename `TextUppercase` function to match file | 1 min | DevX |
| 6 | Remove unused `white` prop from `TextLarge` | 1 min | Dead code |
| 7 | Footer title link → `next/link` | 2 min | Consistency / no full reload |
| 8 | Replace ProjectCard hover state with `group-hover:` | 10 min | Less re-rendering, keyboard focus |
| 9 | Add `apple-touch-icon`, `theme-color`, sized icons | 10 min | Mobile polish, SEO |
| 10 | Bump `@types/node` from 20 → 22 to match runtime | 1 min | Type accuracy |
| 11 | Add `robots.txt` and a generated `sitemap.xml` | 30 min (`next-sitemap`) | SEO |
| 12 | Add JSON-LD `Organization` block in `_app.tsx` | 15 min | SEO |
| 13 | Add CMS-controlled default OG image in `settings` schema | 20 min | Social sharing |
| 14 | Consolidate `_document.tsx` and `app/layout.tsx` body class into a shared constant | 5 min | Drift prevention |

## Bigger improvements (need a decision, not a quick task)

These are worth knowing about but aren't drop-in fixes:

- **Project image model.** Decide whether `mainImage` or `images[0]` is the hero, and make the schema + components reflect that one decision. Probably: drop `mainImage` from the project schema, derive everything (hero, OG, card) from `images[0]`. Or: keep `mainImage`, use it for the hero too, and let `images` be only the grid. Either way, it should be consistent.
- **Image alt text from CMS.** Add `alt: string` to project image arrays in the schema; project through GROQ; pass through `SanityImage`. Mild migration: existing images have no alt set.
- **Type safety on GROQ queries.** Adopt Sanity TypeGen after the v5 upgrade. Replaces manual `Promise<Project>` annotations with generated types tied to actual query shape.
- **Move public route content to App Router** if/when going to Next 15+. Currently mixed-router setup is fine, but reduces cognitive overhead long-term. Not urgent — and `getStaticProps` works fine as is.

## Files worth looking at (ground truth)

- `src/services/sanity.ts` — every GROQ query
- `src/types.ts` — every type used by the public site
- `src/utils/getSortedArray.ts` — the sort-merge pattern
- `app/(studio)/sanity.config.ts` — singleton enforcement, plugins
- `app/(studio)/deskStructure.ts` — Studio sidebar layout
- `next.config.mjs` — static export + image config
- `tailwind.config.ts` — design tokens
