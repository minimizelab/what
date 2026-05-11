# Astro migration — iteration 1 design spec

**Date:** 2026-05-08
**Branch:** `astro-rewrite`
**Scope:** GitHub issues [#52](https://github.com/minimizelab/what/issues/52), [#53](https://github.com/minimizelab/what/issues/53), [#54](https://github.com/minimizelab/what/issues/54), [#55](https://github.com/minimizelab/what/issues/55), [#56](https://github.com/minimizelab/what/issues/56).
**Out:** [#57](https://github.com/minimizelab/what/issues/57) cutover, [#51](https://github.com/minimizelab/what/issues/51) Sanity v5.

Companion to `docs/astro-migration-plan.md` (the deep technical reference) and `docs/future-plans.md` (the why). This document captures the execution-specific decisions for the first migration iteration.

## Summary

Restructure the repo into a monorepo with two new subprojects — `/site/` (Astro public site) and `/studio/` (extracted Sanity v3 Studio) — alongside the existing Next codebase at the repo root. The Next site keeps building and deploying to production unchanged throughout this iteration. A new preview Cloudflare Pages project, pointing at `/site/`, becomes the side-by-side parity test artifact. The extracted Studio runs only locally during this iteration; no new hosted Studio URL is published.

End of iteration: the Astro preview matches production at visual parity. The cutover is a separate decision made later, not now.

## Decisions made during brainstorming

| Decision | Value |
|---|---|
| Iteration scope | Issues #52–#56 (no cutover) |
| Studio hosting in this iteration | None — extract structurally, run locally only |
| Future Studio hosting target | `admin.whats.se` on Cloudflare Pages (deferred) |
| Sanity major version | v3 — no upgrade in this iteration |
| Parity bar | Visually identical, small adjustments allowed where reproduction is hard (documented) |
| Package manager (new subprojects) | pnpm |
| Workspace tooling | None — `/site` and `/studio` are independent pnpm projects |
| Branch | `astro-rewrite` off `main` at `850cff3` |

## Repository layout (end state of iteration)

```
whats/
├── site/                      # Astro public site (new, pnpm)
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── astro.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── lib/                # sanityClient, config, imageBuilder
│   │   ├── services/sanity.ts  # GROQ queries
│   │   ├── types.ts
│   │   └── styles/             # global.css with font variables
│   ├── public/
│   │   ├── _redirects          # carried over from public/_redirects, but the /admin rule is dropped (no Studio in /site)
│   │   ├── cursor-point.svg, cursor-red-point.svg, favicon.png
│   └── .env.development, .env.production
├── studio/                    # Extracted Sanity v3 Studio (new, pnpm)
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   ├── deskStructure.ts
│   ├── schemas/                # verbatim copy from app/(studio)/schemas/
│   └── .env.development, .env.production
├── docs/                       # gains the spec file (this doc)
├── pages/, app/, src/, public/, next.config.mjs, package.json, ...   # legacy Next, untouched
└── README.md
```

No workspace manifest at the repo root; the root `package.json` continues to be the Next site's manifest until the cutover (#57) deletes it. The two pnpm subprojects are siblings with no shared dependencies or build orchestration.

## Studio extraction (`/studio/`) — with data-loss safety

The Studio is **the** risk surface in this iteration because it touches the live content. Mitigations enforced procedurally.

### Procedure

1. **Backup the production dataset.** ✅ Already completed by the project owner before this iteration starts (manual `sanity dataset export`). The archive is the recovery point if anything goes sideways during extraction. No further backup action needed inside this iteration.

2. **Scaffold `/studio` fresh** using `pnpm create sanity@latest` (Sanity v3 template). Point at the existing project: `projectId: lu0lnnx1`. Default dataset for new Studio: `development`.

3. **Copy schemas verbatim** from `app/(studio)/schemas/`. This includes the recently-merged `link` annotation in `richText.ts` (PR #60). Do not edit, refactor, or "improve" any schema during extraction. Byte-identical copy.

4. **Copy `sanity.config.ts` and `deskStructure.ts` verbatim** from `app/(studio)/`. Update `basePath` if needed (probably remove it — the standalone Studio doesn't mount under `/admin`).

5. **Default local dev to the `development` dataset.** Local `/studio` at `localhost:3333` connects to `development`, not `production`. Production-dataset access requires an explicit `--dataset production` flag and conscious intent. This prevents accidental edits from a casual local-Studio browser tab.

6. **No `sanity deploy`.** No new managed Studio URL. No new Cloudflare Pages project for the Studio. `/studio` exists in the repo and runs locally only.

7. **Verification while on the development dataset:**
   - Schemas load without errors
   - Document types appear in the desk structure as expected (singletons still gated, hidden types still hidden)
   - Validation rules behave the same (URL field on `link` annotation, email field on `employee`, slug blacklist on `category`)
   - Sample a few of the `richText` fields, confirm the link annotation and highlight decorator both work

8. **Production-dataset spot-check (read-mostly):**
   - Explicitly start Studio with `--dataset production`
   - Browse one project, one category, the singletons (settings + studio) — confirm they all open and render every field
   - **Do not edit anything.** Close the tab when done.

9. **Throughout this iteration, the old `/admin` on the production Next site stays live.** Editors continue using it. No URL change, no comms.

### Why this is safe

- The extracted `/studio` connects to the same Sanity Cloud project as `/admin` — content lives in Sanity Cloud, not in either deploy. Extraction doesn't move or copy content.
- No `sanity deploy` means no second hosted Studio that could diverge.
- Schemas are byte-identical, so validation rules match exactly. No surprise tightening that would invalidate existing content.
- The `development` dataset default for local work means a forgotten browser tab can't edit production.
- The backup is the explicit recovery point if any of the above assumptions is wrong.

## Astro foundation (`/site/`)

### Scaffold

```
cd <repo root>
pnpm create astro@latest site -- --template minimal --typescript strict --no-install
cd site
pnpm install
pnpm dlx astro add tailwind --yes
```

### Configuration

- `astro.config.mjs`: set `outDir: 'out'` (matches Cloudflare's current `out` setting, smoothing the eventual cutover). `site: 'https://www.whats.se'` for canonical URL generation if needed later.
- `tsconfig.json`: keep Astro's strict default.
- `tailwind.config.ts`: copy verbatim from repo root. Update `content` globs to point at `./src/**/*.{astro,ts,tsx}` instead of the old paths.

### Data layer

- Install `@sanity/client` and `@sanity/image-url`. Do not install `next-sanity`.
- Port `src/services/sanity.ts` → `site/src/services/sanity.ts`. GROQ queries unchanged. Replace the `next-sanity` `createClient` import with `@sanity/client`'s `createClient` — same constructor signature.
- Port `src/lib/sanityClient.ts`, `src/lib/config.ts` → `site/src/lib/`.
- Port `src/types.ts` → `site/src/types.ts` (already includes the `images?:` optional fix from PR #62).
- Port `src/utils/getSortedArray.ts` → `site/src/utils/`.

### Environment variables

`/site/.env.development`:
```
PUBLIC_SANITY_PROJECT_ID=lu0lnnx1
PUBLIC_SANITY_DATASET=development
```
`/site/.env.production`:
```
PUBLIC_SANITY_PROJECT_ID=lu0lnnx1
PUBLIC_SANITY_DATASET=production
```

Astro reads `import.meta.env.PUBLIC_*` (analogous to Next's `NEXT_PUBLIC_*`). Update `site/src/lib/config.ts` to read these. The Cloudflare dashboard env-var renames are part of the future cutover (#57), not this iteration.

### Fonts

- Install `@fontsource/montserrat` (weights 400, 500) and `@fontsource/ibm-plex-mono` (weight 400).
- Create `site/src/styles/global.css` defining CSS variables:
  ```css
  :root {
    --font-montserrat: 'Montserrat', system-ui, sans-serif;
    --font-ibm-plex-mono: 'IBM Plex Mono', monospace;
  }
  ```
- Import font CSS plus `global.css` once in the base layout (created in the component-port phase).
- Tailwind config keeps `font-what: ['var(--font-montserrat)']` and `font-what-mono: ['var(--font-ibm-plex-mono)']` references — they resolve to the CSS variables.

## Image pipeline (`SanityImage.astro`)

Per `docs/astro-migration-plan.md` § "The image pipeline (the actually-hard part)". Restated here for completeness:

- Plain `<img>` driven by `@sanity/image-url`'s builder
- Default srcset widths: `[320, 640, 960, 1280, 1920, 2560]`, all URLs `.auto('format').quality(75)`
- `width`/`height` attributes from `asset.metadata.dimensions` to prevent CLS
- LQIP placeholder via inline CSS `background:url(${asset.metadata.lqip}) center/cover no-repeat;`
- `loading="eager" fetchpriority="high"` when `priority` prop set, else `loading="lazy" fetchpriority="auto"`
- `decoding="async"` always
- `fill` prop renders `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;` for absolute-positioned images (logo, project card thumbnails)

### Validation gate (must pass before component-port phase)

1. View-source on a project page: srcset URLs all hit `cdn.sanity.io`, none hit localhost or `*.pages.dev`
2. DevTools network panel, slow 3G throttle, refresh: LQIP background visible during load
3. Lighthouse mobile audit on a representative project hero (e.g. `/projekt/kyrkeby`): LCP and CLS match or beat current production
4. Resize viewport across all breakpoints: browser picks the appropriate srcset entry
5. Above-fold images receive `fetchpriority="high"`; below-fold receive `loading="lazy"`

If any gate fails, stop and reassess before continuing.

## Component & page port (`/site/src/`)

Translation from `.tsx` to `.astro`. Mostly mechanical — frontmatter for props/data, body for JSX-flavored HTML, `class` instead of `className`. Component-by-component mapping:

### Atoms
- `H1`, `H2`, `Section`, `TextLarge`, `TextMedium`, `TextUppercase` — mechanical ports
- **Fold in fix:** `TextUppercase` exports a function named `TextMedium` (cosmetic bug from copy-paste). Rename to match the file.
- **Fold in fix:** `TextLarge` declares an unused `white` prop. Remove it.
- `SanityImage.astro` — already designed above.

### Molecules
- `EmployeeCard` — fold in `callto:` → `tel:` fix
- `FilterBar` — replace `useRouter().asPath` with `Astro.url.pathname` for active-link styling. No island.
- `ImageGrid` — port as-is, including the centered-portrait logic
- `ProjectCard` — **drop the React state**. Replace `useState`/`onMouseEnter`/`onMouseLeave` with Tailwind `group/group-hover:text-what-red-01`. No island.

### Organisms
- `Footer` — title link uses Astro's `<a>` (no `next/link` needed for static; Astro handles it natively)
- `Header`, `Nav`, `ProjectHeader`, `ProjectInfoBox`, `ProjectsGrid` — mechanical

### Templates
- `Page` — convert to a layout file: `site/src/layouts/Page.astro`. Use named `<slot name="filterBar">` for the optional filter bar slot. Body content uses the default `<slot />`.

### Pages

| Next (Pages Router) | Astro |
|---|---|
| `pages/index.tsx` | `site/src/pages/index.astro` |
| `pages/[category].tsx` | `site/src/pages/[category].astro` |
| `pages/projekt/[project].tsx` | `site/src/pages/projekt/[project].astro` |
| `pages/studio.tsx` | `site/src/pages/studio.astro` |

For dynamic routes (`[category].astro`, `projekt/[project].astro`), export `getStaticPaths` from the frontmatter returning an array of `{ params, props }`. Astro shape, not Next shape.

For `projekt/[project].astro`: replace `useRouter().back()` with a `<button onclick="history.back()">` plus a `<a href="/">tillbaka</a>` fallback link for direct landings. This folds in the codebase-review.md improvement.

### Portable Text

- Install `astro-portabletext`
- Carry over both serializers in `src/lib/serializers.tsx`:
  - **Highlight** decorator: `Highlight.astro` component — `<span class="text-what-red-01"><slot /></span>`
  - **Link** annotation (from merged PR #60): `Link.astro` component — `<a class="underline hover:text-what-red-01 focus:text-what-red-01 cursor-pointer">` with external-link detection (`https?://` → `target="_blank" rel="noopener noreferrer"`)
- Custom `Block` overrides used inline in `studio.tsx` and `projekt/[project].tsx`: ported as the same overrides on the Astro side.
- **Fold in cleanup:** delete the dead `src/serializers.tsx` (not imported anywhere) — it doesn't get a port.

### Recently-merged work to carry over (specific call-outs)

- **PR #60** (Portable Text links): both the schema (already in `/studio` via the verbatim copy) and the renderer (ported above as `Link.astro`)
- **PR #62** (text-only project safety): `images?:` optional type already in `src/types.ts` and ports over directly; the `?? []` defaults at call sites carry into the Astro components

### Expected outcome

**Zero React islands for the public site.** Every interactive bit (hover, filter, back button) handled with CSS or a 1-line inline `<script>`. Verify in the browser DevTools that `window.React` is undefined and no `client:*` directives appear in source.

## Verification — definition of done for this iteration

1. **Build clean:** `cd site && pnpm run build` produces `site/out/` with every route and every project page, no errors. `cd studio && pnpm run dev` boots without errors.

2. **Preview Cloudflare Pages project** created and connected to the `astro-rewrite` branch with root directory `site`, build command `pnpm run build`, and output directory `out`. URL is a non-production `*.pages.dev` subdomain. Preview env vars set to `PUBLIC_SANITY_PROJECT_ID=lu0lnnx1` and `PUBLIC_SANITY_DATASET=production` so the preview reads the same content production reads. **Setup is manual via the Cloudflare dashboard** by the project owner — the spec provides the settings; this iteration doesn't automate dashboard configuration.

3. **Visual parity** at desktop and mobile breakpoints on every route:
   - `/` (home, featured projects)
   - `/bostad`, `/landskap`, `/ombyggnad`, and at least 2 other categories
   - `/projekt/kyrkeby` and at least 4 other project deep links (cover variety: rich text body, image grid sizes, with/without awards, with/without collaborators)
   - `/studio` (the public about/contact page)

   Visually identical is the bar. Document any unavoidable small adjustments in the spec or a follow-up note.

4. **Lighthouse mobile** on `/`, `/bostad`, and one project page. Performance, accessibility, and best-practices scores match or beat current production.

5. **Portable Text link rendering:** find at least one project (or temporarily edit one in the development dataset for the test) with a link annotation in body content. Confirm the link renders with the correct styling and external-link behavior.

6. **Text-only project rendering:** find a project without images (or temporarily configure one in the development dataset, then point `/site` preview at development for the check). Confirm the page renders without crashing, no hero image, no `og:image` meta tag emitted.

7. **No JavaScript shipped beyond Astro's defaults:** view source on a page, confirm there's no React bundle, no client hydration markers.

8. **Studio sanity:** local `/studio` boots, schemas load, validation works. Production-dataset spot-check completed without making any edits.

## Out of scope (deliberately)

- **#57 cutover.** The production Cloudflare Pages project keeps building from the repo root. No env var renames, no production routing changes.
- **#51 Sanity v3 → v5.** Separate workstream.
- **Production deploy of `/studio`.** Studio runs locally only. The `admin.whats.se` decision happens after this iteration.
- **Content-model cleanup** (`mainImage` vs `images[0]` overlap from `codebase-review.md`). Behavior preserved as-is.
- **CMS-driven alt text.** Schema change deferred.
- **SEO additions** (sitemap.xml, robots.txt, JSON-LD, apple-touch-icon, theme-color). Deferred.
- **`public/_headers` for security/cache headers** (`docs/hosting.md`). Belongs to the cutover.
- **CI** (lint/build on PR). Deferred.
- **GROQ TypeGen.** Deferred — natural fit after the Sanity v5 upgrade.
- **Workspace tooling** (pnpm workspaces / turbo). Add only when cross-project type sharing becomes necessary.

## Cross-references

- `docs/astro-migration-plan.md` — the technical reference (image pipeline rationale, framework comparison, etc.). This spec assumes that document as background.
- `docs/codebase-review.md` — low-hanging-fruit list. A subset folded in during the component port.
- `docs/future-plans.md` — the why-Astro framing.
- `docs/hosting.md` — Cloudflare specifics, including the `_headers` work deferred to cutover.
- `docs/security-updates.md` — Sanity v5 forced-clock context. Tracked separately as issue #51.

## Risks specific to this iteration

| Risk | Likelihood | Mitigation |
|---|---|---|
| Schema drift between old `app/(studio)/` and new `/studio/` | Low (verbatim copy enforced) | Procedure step 3 requires byte-identical copy. Code review the diff. |
| Accidental edit to production from local `/studio` browser tab | Low (development dataset default) | Procedure step 5 enforces development as the local default. |
| Sanity dataset corrupted by misconfigured `/studio` | Very low | Procedure step 1 (backup) is the recovery point. |
| Image pipeline ships visibly different from Next baseline | Low | Validation gate after `SanityImage.astro` is built; halt if gate fails. |
| Astro's Tailwind integration disagrees with the existing config | Low | `tailwind.config.ts` carries over; Astro's integration is well-tested. Update content globs only. |
| `astro-portabletext` doesn't cover the existing rich text marks | Low | Rich text uses one decorator + one annotation; both well within scope. Re-verify after install. |
| `import.meta.env.PUBLIC_*` substitution misses something | Low | Audit all env-var reads after porting; build will fail loudly on missing values. |
| Preview Pages project misconfiguration leaks to production | Low | Preview is a separate Pages project from production. Production project untouched. |

## Open questions to revisit at cutover (not now)

- Studio hosting at `admin.whats.se`: timing, DNS, comms to editors
- Whether the cutover commit removes the old code in one chunk or over multiple commits
- Rollback window length after cutover (suggested: keep preview project alive for 30 days)
- When to schedule the Sanity v5 upgrade (#51) — before or after Astro cutover
