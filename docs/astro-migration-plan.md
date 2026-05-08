# Astro migration — detailed plan

A focused technical plan for porting the public site from Next 14 to Astro. Companion to `future-plans.md` (which covers the *why*); this doc is the *how*.

## Scope & assumptions

- **In scope:** porting `pages/` + `src/components/`, `src/services/`, `src/lib/`, `src/hooks/`, `src/utils/`, `src/types.ts` from Next/React to Astro. Reorganizing the deploy. Rewriting the image component.
- **Out of scope (deliberately):** Sanity v3 → v5 upgrade. That's a separate workstream and would be the same effort whether on Next or Astro. We migrate Sanity v3 *as-is* in this plan; the v5 upgrade can happen on the Astro codebase after.
- **Studio extraction is in scope** because it simplifies the migration — `app/(studio)/` is the entire reason this project has dual-router complexity. Moving Studio to its own deploy removes that.
- **No design changes.** Visual output should be byte-identical (or close to it) when the migration is done. Refactors and improvements come *after*, on the new stack, where they're cheaper.

## What changes vs. what stays the same

### Stays the same
- Sanity content, dataset, and schemas (v3 stays v3 for now)
- All GROQ queries (lift `src/services/sanity.ts` over almost verbatim)
- TypeScript types in `src/types.ts`
- Tailwind config and design tokens (`what-white`, `what-red-01`, custom fonts, custom cursors)
- Cloudflare Pages as host
- `public/_redirects` (with one rule removed; see below)
- Sanity → Cloudflare deploy hook
- Node 22 LTS

### Changes mechanically (structure, not logic)
- `pages/*.tsx` → `src/pages/*.astro` (Astro uses `src/pages/` not `pages/`)
- React function components in `src/components/**/*.tsx` → `.astro` files
- `getStaticProps` / `getStaticPaths` (Next) → frontmatter fetches + `getStaticPaths` (Astro — same name, slightly different return shape)
- `next/link` → plain `<a>` (Astro hydrates them efficiently; no framework router for static sites)
- `next/font/google` → `@fontsource/montserrat` + `@fontsource/ibm-plex-mono` CSS imports
- `useRouter` → `Astro.url.pathname` (in frontmatter) or `<script>` (for `history.back()`)
- Env vars: `NEXT_PUBLIC_SANITY_*` → `PUBLIC_SANITY_*`

### Changes substantively (need real attention)
- **Image rendering** — biggest piece, see below
- **Portable Text** — switch from `@portabletext/react` to `astro-portabletext`
- **Studio extraction** — `app/(studio)/` becomes its own project

---

## The image pipeline (the actually-hard part)

### How it works today

The current setup is *already* mostly bypassing Next's image processing:

```tsx
// src/components/atoms/SanityImage.tsx
const { width, height, ...sanityImage } = useSanityImage(img, options);
return <Image {...sanityImage} placeholder="blur" blurDataURL={img.metadata.lqip} />;
```

- `useSanityImage` (from `next-sanity-image`) returns `{ src, srcSet, width, height, loader, ... }` where the URLs point directly at `cdn.sanity.io` with width/format/quality query params.
- `next/image` then renders an `<img>` with that srcset, plus a low-quality base64 blur placeholder and a wrapper div for layout-shift prevention.
- **Sanity's CDN does the actual heavy lifting:** format negotiation (`?fm=auto` returns AVIF/WebP/JPEG depending on browser Accept header), resize (`?w=`), and quality (`?q=`).

So the only Next-specific value-adds are:
1. The blur-up placeholder swap
2. `priority` → `loading="eager"` + `fetchpriority="high"`
3. `width`/`height` attribute injection for CLS prevention
4. Lazy loading by default

All four are replicable with native HTML attributes.

### Astro's three options

**Option A — Astro's built-in `<Image>` from `astro:assets` for remote images.** ❌ Wrong tool.

Astro's `<Image>` was designed for *local* images: assets in your repo that get processed by `sharp` at build time. As of Astro 4, you can configure `image.remotePatterns` to allow remote URLs, but Astro then downloads each image at build time, processes it locally, and emits build artifacts. For a CMS with hundreds of high-res images, this means:
- Build times balloon (sharp re-processing every image at every breakpoint)
- Output bundle bloats into the GB range
- You replace Sanity CDN's smart format negotiation with a fixed build-time set of formats
- Cloudflare Pages has per-file and total-deploy size limits you'd hit fast

This is the wrong direction. Sanity CDN already does what `astro:assets` is trying to do, *better*, on demand.

**Option B — Plain `<img>` with Sanity URL builder.** ✅ Recommended.

Same approach the Next code already takes underneath, but expressed in a single `.astro` component with no framework runtime. Concretely:

```astro
---
// src/components/SanityImage.astro
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '../lib/sanityClient';
import type { SanityImageAssetDocument } from '@sanity/client';

interface Props {
  asset: SanityImageAssetDocument;
  alt: string;
  sizes?: string;
  priority?: boolean;
  class?: string;
  fill?: boolean; // mimics Next's <Image fill />
}

const {
  asset,
  alt,
  sizes = '100vw',
  priority = false,
  class: className,
  fill = false,
} = Astro.props;

const builder = imageUrlBuilder(sanityClient);
const widths = [320, 640, 960, 1280, 1920, 2560];

const srcSet = widths
  .map(w =>
    `${builder.image(asset).width(w).auto('format').quality(75).url()} ${w}w`
  )
  .join(', ');

const src = builder.image(asset).width(1280).auto('format').quality(75).url();
const { width: nativeW, height: nativeH } = asset.metadata.dimensions;
const lqip = asset.metadata.lqip;

const fillStyle = fill
  ? 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;'
  : '';
const lqipStyle = lqip ? `background:url(${lqip}) center/cover no-repeat;` : '';
---

<img
  src={src}
  srcset={srcSet}
  sizes={sizes}
  width={nativeW}
  height={nativeH}
  loading={priority ? 'eager' : 'lazy'}
  decoding="async"
  fetchpriority={priority ? 'high' : 'auto'}
  alt={alt}
  class={className}
  style={`${fillStyle}${lqipStyle}`}
/>
```

That's ~40 lines. It covers everything `next/image` was doing for this site, with **zero JavaScript shipped to the client**.

LQIP behavior here: the base64 data URL is the `<img>`'s background, so the blur shows during loading. Once the real image decodes, it covers the background. No fade transition, but visually clean. If a fade is wanted, that's another 10 lines of CSS + a small `<script>` that flips a class on `load`.

**Option C — `@sanity/astro` integration's image component.**

Sanity ships an official Astro integration. Provides the Sanity client, optional Visual Editing, and (in current versions) image rendering helpers. Worth evaluating in a spike, but Option B is simpler, gives full control over breakpoints and LQIP behavior, and avoids another dependency. Adopt `@sanity/astro` later if Visual Editing or other features become useful — that's an additive change, not a blocker.

### Migration of image-using components

The interface barely changes. Existing call sites:

| Current Next call | Astro equivalent |
|---|---|
| `<SanityImage img={asset} alt="..." width={w} height={h} sizes="..." />` | `<SanityImage asset={asset} alt="..." sizes="..." />` (width/height read from asset metadata) |
| `<SanityImage img={asset} fill priority className="object-cover" />` | `<SanityImage asset={asset} fill priority class="object-cover" />` |
| `<SanityImage img={asset} blur={false} priority />` (logo) | `<SanityImage asset={asset} priority />` (LQIP applies if present; harmless on logo) |

Minor name changes: `img` → `asset`, `className` → `class`. Mechanical.

### Performance comparison

| Aspect | Next (current) | Astro (Option B) |
|---|---|---|
| Sanity CDN format negotiation (AVIF/WebP/JPEG) | ✅ `?fm=auto` | ✅ `?fm=auto` |
| Responsive `srcset` | ✅ via `next-sanity-image` | ✅ via Sanity URL builder |
| LQIP blur placeholder | ✅ via `placeholder="blur"` | ✅ via inline CSS background |
| Layout-shift prevention | ✅ width/height attrs | ✅ width/height attrs |
| Lazy loading | ✅ default | ✅ `loading="lazy"` |
| Above-fold priority hint | ✅ `priority` prop | ✅ `loading="eager"` + `fetchpriority="high"` |
| JS shipped per image | next/image runtime + React | 0 |
| DOM overhead | wrapper div + img | bare img |
| Configurable srcset breakpoints | hard (default set) | easy (one array) |

Expected outcome: same image quality, smaller payload, simpler code.

### Verification checklist for the image migration

When porting:
1. Build the Astro version, view-source on a project page, confirm srcset URLs all hit `cdn.sanity.io` (not your domain).
2. In DevTools network panel, throttle to slow 3G, refresh — confirm LQIP shows during load.
3. Lighthouse mobile audit — should match or beat Next baseline on LCP and CLS.
4. View an image at multiple viewport widths, confirm browser fetches the right srcset entry.
5. Confirm `fetchpriority="high"` is applied to above-fold images (Header logo, ProjectCard `prio`, ProjectHeader hero).

---

## Other concerns

### Portable Text

Two surfaces use it: project descriptions (`ProjectHeader.tsx`) and the studio page (`pages/studio.tsx`). Both use the same custom serializers (highlight mark in red).

`@portabletext/react` is React-only. In Astro:
- Use **`astro-portabletext`** (community package, well-maintained). Same API shape — pass `value` and components — but renders to `.astro` output. Custom mark renderers are written as `.astro` components.
- Alternative: keep `@portabletext/react` and render as a React island (`<PortableText client:load />`). Works, but ships React for what could be static HTML. Not recommended.

The current `src/lib/serializers.tsx` (highlight mark) has one rule: wrap children in a span with `text-what-red-01`. In `astro-portabletext`, that becomes a tiny `Highlight.astro` component:

```astro
---
const { node } = Astro.props;
---
<span class="text-what-red-01"><slot /></span>
```

The block-level `Block` override used in the studio page (`<p className="lg:w-2/3 w-full text-3xl">`) becomes the same pattern. ~5 small `.astro` files, replacing ~10 lines of JSX serializers. Net wash.

### Fonts

`pages/_app.tsx` uses `next/font/google` to self-host Montserrat and IBM Plex Mono with automatic preload, FOIT prevention, and CSS variable injection.

In Astro, the standard replacement is **`@fontsource/montserrat` + `@fontsource/ibm-plex-mono`**:

```astro
---
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/ibm-plex-mono/400.css';
---
```

Imported in the layout once. Tailwind config keeps `var(--font-montserrat)` style references — define those CSS variables in a global stylesheet:

```css
:root {
  --font-montserrat: 'Montserrat', system-ui, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', monospace;
}
```

Done. Slightly less automated than `next/font` (no automatic per-page preload optimization) but the cost is tiny for two fonts and the result is essentially identical in practice.

### Routing

| Next (Pages Router) | Astro |
|---|---|
| `pages/index.tsx` | `src/pages/index.astro` |
| `pages/[category].tsx` | `src/pages/[category].astro` |
| `pages/projekt/[project].tsx` | `src/pages/projekt/[project].astro` |
| `pages/studio.tsx` | `src/pages/studio.astro` |
| `getStaticProps` | frontmatter top-of-file |
| `getStaticPaths` (returns `{ paths, fallback }`) | `getStaticPaths` (returns `[{ params, props }]`) |
| `<Link href="...">` | `<a href="...">` (no client-side router for fully static sites) |
| `useRouter().asPath` | `Astro.url.pathname` (in frontmatter) |
| `useRouter().back()` | `<button onclick="history.back()">` (1-line script) |

### Components

Of 18 components in `src/components/`, ~16 are static React function components that take props and return JSX. Those become `.astro` files mechanically:

- Frontmatter fence (`---`) at top
- Destructure `Astro.props`
- Body becomes the JSX, except `className` → `class`, `{condition && <X />}` works the same in Astro

Two have client state:
- **`ProjectCard.tsx`** — `useState`/`onMouseEnter`/`onMouseLeave` for hover. Replace with pure CSS (`group/group-hover:` Tailwind classes). No JS needed. Already flagged as low-hanging fruit in `codebase-review.md`.
- **`FilterBar.tsx`** — uses `useRouter` to highlight the active link. Replace with `Astro.url.pathname` in frontmatter. No JS needed.

So **zero React islands required for the public site.** All HTML, all static, all server-rendered at build time.

### Data layer

`src/services/sanity.ts` ports almost unchanged. Two small edits:
- Replace `import { client } from '../lib/sanityClient'` — the underlying `next-sanity` package becomes plain `@sanity/client`. API is the same (`client.fetch(groq\`...\`)`).
- `src/lib/sanityClient.ts`: swap `import { createClient } from 'next-sanity'` for `import { createClient } from '@sanity/client'`. Drop `next-sanity` dependency.

GROQ queries in `sanity.ts` are byte-identical. Nothing to relearn.

The data fetching pattern in pages becomes:

```astro
---
// src/pages/index.astro
import sanity from '../services/sanity';
import Page from '../components/templates/Page.astro';
import FilterBar from '../components/molecules/FilterBar.astro';
import ProjectsGrid from '../components/organisms/ProjectsGrid.astro';

const settings = await sanity.getSettings();
---

<Page settings={settings} title={settings.title}>
  <FilterBar slot="filterBar" categories={settings.categoriesOrder ?? []} />
  <ProjectsGrid projects={settings.featuredProjects ?? []} />
</Page>
```

Exactly the same logic as `pages/index.tsx` today, just with frontmatter in place of `getStaticProps`.

---

## Build & deployment

**Honest answer: very few unknowns here.**

| Concern | Status |
|---|---|
| Build command | `astro build` (configurable script in `package.json`) |
| Output dir | `dist/` by default; set `outDir: 'out'` in `astro.config.mjs` to keep Cloudflare config unchanged |
| Static output shape | Folder per route + `_astro/` subfolder for hashed assets — same shape as Next's `out/` |
| Build time | Faster than Next for sites this size (no React hydration step). Expect <30s. |
| Cloudflare Pages compatibility | First-class. CF detects Astro automatically. No special adapter needed for static. |
| `public/_redirects` | Carries over directly. **Remove** the `/admin/* /admin 301` rule (Studio is no longer here). Keep `/projekt / 301`. |
| `public/_headers` (if added) | Carries over directly |
| Env vars | Rename `NEXT_PUBLIC_SANITY_*` → `PUBLIC_SANITY_*` in code and in Cloudflare dashboard |
| Sanity → Cloudflare deploy hook | Unchanged. The hook URL doesn't care what built the site. |
| Node version | Astro fully supports Node 22 LTS |
| Preview deployments | Cloudflare Pages handles per-branch previews identically |

The only deployment-side action items are: (1) update env var names, (2) trim `_redirects`, (3) update Cloudflare's "build command" if needed (`npm run build` can stay if `package.json` script is updated to call `astro build`).

---

## Studio extraction

Move `app/(studio)/` to a standalone Sanity Studio project, deployed independently.

### Steps

1. Create a new repo or directory: `whats-studio/` (could be a sibling of this repo, or a new branch named `studio` — but separate repos are cleaner).
2. `npm create sanity@latest` to scaffold a fresh v3 Studio project at the same Sanity project ID + dataset.
3. Copy `app/(studio)/sanity.config.ts`, `deskStructure.ts`, and `schemas/` into the new project. The schemas are framework-agnostic Sanity v3 — no changes needed.
4. Choose a deploy target:
   - **Easiest:** `sanity deploy` → hosted at `whatarkitektur.sanity.studio` (free, zero ops, but URL is on `*.sanity.studio`).
   - **Branded:** Deploy as a separate Cloudflare Pages project at `admin.whats.se` (custom domain, slight ops overhead).
5. Update editor bookmarks. Internal email noting the URL change.
6. From the public site repo: delete `app/(studio)/`, delete `pages/studio.tsx` reference to it (the page name is misleading — it's the public about-us page, not the Studio. Keeping it.), delete the `app/layout.tsx` (no longer needed since no App Router routes remain).

### Why this simplifies the migration

Without the Studio embed:
- No App Router involvement at all
- No `app/layout.tsx` to maintain alongside the layout component
- No mental tax of "wait, which router is this file in?"
- `next-sanity/studio` dependency goes away
- `sanity-plugin-media` and other Studio-only deps stay in the Studio project, off the public site's tree

The public site becomes just `src/pages/` + `src/components/` + `src/services/` + `public/`. Clean.

---

## Migration order (suggested sequence)

A working order that keeps each step verifiable:

1. **Scaffold the Astro project** in a new branch (`astro-rewrite`). Get `astro dev` running, Tailwind installed (`npx astro add tailwind`), Sanity client wired up.
2. **Port the data layer.** Copy `src/services/sanity.ts`, `src/lib/sanityClient.ts`, `src/types.ts`. Swap `next-sanity` for `@sanity/client`. Verify a hard-coded query works in `astro dev`.
3. **Port the image component.** Build `SanityImage.astro` per the design above. Verify on a single test page that an image renders, srcset is right, LQIP shows.
4. **Port atoms.** `H1`, `H2`, `Section`, `TextLarge`, `TextMedium`, `TextUppercase` — pure CSS wrappers. Mechanical.
5. **Port molecules + organisms.** `ProjectCard`, `ProjectsGrid`, `EmployeeCard`, `FilterBar`, `Footer`, `Header`, `Nav`, `ImageGrid`, `ProjectHeader`, `ProjectInfoBox`. Convert `useRouter` and hover state along the way.
6. **Port the layout template.** `templates/Page.astro`.
7. **Port pages.** `index.astro` first (simplest), then `[category].astro`, then `studio.astro`, then `projekt/[project].astro`.
8. **Set up Portable Text.** Install `astro-portabletext`, port the highlight serializer.
9. **Wire fonts.** `@fontsource/*` imports in the layout, CSS variables in global stylesheet.
10. **Set up `_redirects` and `_headers` in `public/`.**
11. **Test parity.** Side-by-side compare the live Next site and a local Astro build for every route. Lighthouse audit comparison.
12. **Extract the Studio** to its own repo / deploy. Update Sanity webhook to point at the new Pages project (URL is the same).
13. **Cut over.** Update Cloudflare Pages settings on the production project: build command, output dir, env var names. Deploy the Astro branch to `main`.
14. **Decommission.** Delete the old code from `main` after a stable production day. Keep the old `main` as a backup branch for 30 days.

Steps 1–3 are the validation phase: if the image pipeline works, the rest is execution.

---

## Risks & unknowns

| Risk | Likelihood | Mitigation |
|---|---|---|
| Sanity CDN srcset performs worse than `next-sanity-image` defaults | Low | Same underlying CDN; manually tuneable breakpoints likely *better* |
| LQIP technique looks worse than Next's blur-up | Low | Both use the same base64 data URL; visual difference negligible |
| `astro-portabletext` doesn't cover an edge case in the existing rich text | Low | Project rich text is simple (one custom mark, no annotations, no embedded objects). Well within the package's scope. |
| Cloudflare Pages build environment quirk | Very low | Astro is officially supported by Cloudflare Pages |
| Editors confused by Studio URL change | Medium | One-time change; communicate before cutover. Bookmark update is trivial. |
| Some `next/font` performance edge case lost | Low | Two fonts only. `@fontsource` covers the standard case. |
| `Astro.url.pathname` doesn't match `useRouter().asPath` exactly | Low | Both return absolute pathname; verify on `[category]` page where it's used for active link styling. |
| Build output structure breaks the existing `_redirects` or causes 404s | Low | Static HTML output, route-per-folder — same shape as Next's static export. |

The image pipeline is the one place where a spike is genuinely worthwhile *before* committing to the rewrite. Steps 1–3 in the migration order above are exactly that spike. If they go cleanly, the rest is execution.

---

## Effort estimate

Realistic for someone with Astro experience: **~1 week of focused work, possibly 1.5.**

Rough breakdown:
- Day 1: Scaffold + data layer + image component spike (steps 1–3). The validation phase.
- Day 2: Atoms + molecules + organisms (steps 4–5). Mechanical port.
- Day 3: Layout + pages + Portable Text + fonts (steps 6–9). The integration day.
- Day 4: Redirects/headers, parity testing, Lighthouse comparison (steps 10–11). Polish.
- Day 5: Studio extraction + deploy cutover (steps 12–13). The risk-bearing day.
- Day 6 (buffer): Bug fixing from the cutover.

For someone learning Astro: add 2–3 days of friction, mostly in days 1 and 3.

This is comparable to (or slightly less than) the cost of getting the Next stack fully current, with the difference that the end state is materially simpler.
