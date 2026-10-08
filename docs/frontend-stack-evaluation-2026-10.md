# Frontend stack evaluation — 2026-10

A fresh look at where to take the public site, five months after the Astro work in `future-plans.md` and `astro-migration-plan.md` stalled. Covers the current code, the `astro-rewrite` branch, and the state of the relevant frameworks as of 2026-10-08.

## Recommendation

**Finish the Astro rewrite on Astro 7, extract the Studio and upgrade it to Sanity v6, and keep Cloudflare as the host.**

The decision is clearer now than it was in May:

- The `astro-rewrite` branch is further along than the old notes suggest. All four public pages are ported, it builds against production data in ~10 s, and it ships **zero JavaScript**. Bumping it from Astro 6 to Astro 7 required no code changes.
- The current Next 14 site is on an unsupported version. Next 14 stopped receiving security fixes in October 2025. Next 15 stops on 2026-10-21. Only 16.x is patched after that.
- Next 16 can still run this site as a Pages Router static export, so "upgrade Next" is a real, cheaper-than-expected option (see Option B). It is the right choice only if you value staying in React/Next over output size and simplicity. It keeps ~130 KB of compressed JS and a large inline JSON payload on every page, for a site with no meaningful interactivity.
- No new framework since May beats Astro for this shape of site. Eleventy (now "Build Awesome") is the only serious alternative, and its ownership/rebrand situation makes it a worse multi-year bet right now.
- The Studio upgrade is unavoidable on every path. Sanity v3 has had no release since July 2025; current is v6. Once the Studio is its own project, the upgrade is small.

Remaining effort on the Astro path, from the current branch: roughly **3–5 days** including Studio upgrade, parity QA, and cutover.

## What changed since May

| Area | May 2026 assumption | Now (2026-10-08) |
|---|---|---|
| Next.js | 16 current, 14 "on its way out" | 16.4.0 current. 14.x **unsupported** since 2025-10-26 (last release 14.2.35, 2025-12-11). 15.x maintenance ends 2026-10-21. |
| Next + Pages Router | Expected to be squeezed out | Still supported in 16.4, no removal announced. Next 16 accepts React 18 for Pages Router. Next 17 is announced (Cache Components default), no date. |
| Astro | 6.x, independent company | 7.3.8 (7.0 released 2026-06-22). Team joined Cloudflare 2026-01-16. Still MIT, static still the default. |
| Sanity Studio | v5 current | v6 current (6.18.0). v3 has had no release since 3.99.0 (2025-07-11). |
| Cloudflare Pages | The host | Not deprecated, but Cloudflare now says "start new projects with Workers". Workers Builds got deploy hooks 2026-04-01. |
| Eleventy | Independent, minimalist | Renamed **Build Awesome** (2026-03-03) under Font Awesome ownership. v3.1.6 stable, v4 in alpha. |

## Measured: current site vs. the Astro branch

Measured today. "Live" is `https://www.whats.se`. "Astro" is the `astro-rewrite` branch built locally against the production dataset.

| | Live (Next 14) | Astro branch |
|---|---|---|
| JS files on home page | 9 (8 for modern browsers; polyfills is `nomodule`) | 0 |
| JS transferred, home (brotli) | ~127 KB (~395 KB uncompressed) | 0 |
| Home HTML (gzip) | 50.5 KB, of which 168 KB uncompressed is the inline `__NEXT_DATA__` JSON | 9.0 KB |
| Build time | not measured | 10 s for 67 pages (Astro 6), 9 s (Astro 7) |
| Output size | not measured | 2.1 MB (mostly font files) |
| Images | Sanity CDN, `auto=format` | Sanity CDN, `auto=format` (same URLs, same LQIP) |

The image story is the same on both: Sanity's CDN does resizing and format negotiation. The difference is everything around the images: React, the Next runtime, and the serialized page props that the browser downloads and executes so it can hydrate pages that have nothing to hydrate.

## What the site needs

Unchanged from `future-plans.md`, restated as requirements:

- ~30 project pages, 5 category pages, one about/contact page. All buildable at build time from Sanity.
- Image-heavy. Sanity CDN handles transforms; the framework only needs to emit good `<img srcset>` markup.
- Portable Text with two custom marks (highlight, link).
- Interactivity: hover states (CSS) and a back link (one inline handler). No client state.
- Rebuild on publish via Sanity webhook → Cloudflare deploy hook.
- Editors need a Studio somewhere.

Anything that ships a client runtime by default is solving a problem this site does not have.

## Options

### A. Astro 7 — resume the branch (recommended)

**State of the branch.** 16 commits from 2026-05-11. Monorepo with `/site` (Astro) and `/studio` (standalone Sanity v3). All atoms, molecules, organisms, the layout, Portable Text serializers, and all four pages are ported. `SanityImage.astro` builds srcset URLs against the Sanity CDN with LQIP backgrounds. Not done: final parity verification, preview deploy, Studio upgrade, cutover.

**Verified today:**
- Builds unchanged on Astro 6.3.1: 67 pages, 0 JS files.
- Upgraded to Astro 7.3.6, `astro-portabletext` 1.0.1, `@sanity/client` 8, Tailwind 4.3.3: builds with no code changes, still 0 JS.
- `pnpm audit`: 37 advisories on the May lockfile, **2** after the upgrade (`http-cache-semantics`, `source-map-js`, both transitive build-time deps).
- Astro 7's new HTML whitespace handling (`compressHTML: 'jsx'`) changes the markup between inline elements. Needs a visual check; it can be set back if it causes spacing differences.

**Pros**
- Zero JS by default; the static output is plain HTML + CSS. Fastest possible result for this site.
- One routing model, no Pages/App Router split, no React.
- The work is mostly done. Remaining effort is QA and cutover, not porting.
- Static stays first-class in Astro's docs. Cloudflare owns the team, which is the host you already use; static deploys need no adapter.
- Sanity's own docs cover Astro (`@sanity/astro` 3.5.1 supports Astro 2–7; Sanity recommends `astro-portabletext` and plain `<img>` with `@sanity/image-url` — which is what the branch does).
- Dependency vulnerabilities only exist at build time. Nothing from `node_modules` runs in production.

**Cons**
- Major-version churn: 6.0 (2026-03-10) and 7.0 (2026-06-22) came 3.5 months apart after the Cloudflare deal. Earlier cadence was about one major a year. For this site, the 6→7 upgrade was free, but expect a yearly upgrade task.
- Cloudflare ownership pulls new features toward server rendering and Workers. Not a problem for static output today; worth watching.
- Smaller hiring pool than Next. Low impact for a site this size.
- Portable Text has two competing Astro packages now (`astro-portabletext` and Sanity's fork `@portabletext/astro` 0.2.0). Pick one; the branch uses the one Sanity's docs recommend.
- Astro's own `<Image>` would download and re-encode Sanity images with sharp at build time if `cdn.sanity.io` were allowlisted. Don't allowlist it. This also avoids the 2026-08 sharp/libheif RCE advisory path.

**Remaining effort:** 3–5 days. See "Plan" below.

### B. Stay on Next — upgrade to 16, keep Pages Router and static export

The cheapest way to get back onto a supported version.

**What it takes:**
- `next` 14 → 16.4. Pages Router, `getStaticProps`/`getStaticPaths`, and `output: 'export'` are unchanged.
- Remove `images.domains` (deprecated; irrelevant with the custom loader).
- Replace `next lint` (removed in 16) with the ESLint CLI and flat config.
- Verify the build under Turbopack (now the default for `next build`).
- **Extract the Studio anyway.** Current `next-sanity` (13.3.4) needs Next 16, React 19.2.3+, and Sanity v5/v6, and only supports embedding via App Router. Keeping the embed drags the whole site to React 19 and keeps the router split. Moving it to its own project lets the site stay on React 18 if wanted.

**Pros**
- Smallest code change. Estimated 1–2 days plus the Studio work.
- Static export and Pages Router are still documented and supported.
- Most 2025–2026 Next CVEs (middleware bypass, React2Shell RCE, image optimizer, Server Actions, ISR) do not apply to a static export.
- Familiar stack, largest talent pool.

**Cons**
- Keeps ~130 KB compressed JS and the inline props JSON on every page. The site stays measurably slower than it needs to be.
- Pages Router is "supported, but we recommend migrating to App Router" in the 16.4 docs. Next 17 is announced with no statement on Pages Router. The pressure to move to App Router does not go away, and that migration is the expensive one.
- Next majors are annual with a 2-year support window. You will be back here in ~2 years at the latest.
- Advisory volume is high: ~41 Next.js advisories Jan–Sep 2026, in batches. Most are irrelevant to static export, but each batch means triaging and bumping.
- Next's direction (Cache Components, server-first) keeps moving away from what this site is.

### C. Eleventy / Build Awesome

**Pros**
- Zero JS by default. Smallest JS-ecosystem footprint (~130 packages, ~176 with `eleventy-img`).
- Slow, careful release history on the v3 line.
- Sanity integration is just `@sanity/client` in a `_data` file plus `@portabletext/to-html`. No lock-in.

**Cons**
- Governance: acquired by Font Awesome (2024), renamed to Build Awesome (2026-03), a first Kickstarter pulled, a paid "Pro" tier announced. v4 is in alpha under a new package name. The core stays open source, but the direction is less predictable than it was.
- Templating is Nunjucks/Liquid/WebC; TypeScript templates work but without front matter and with weaker typing than Astro.
- Would be a second full rewrite. The Astro branch would be discarded.

Verdict: the right pick if you want the absolute minimum of tooling and are comfortable with Nunjucks. Not worth throwing away a finished Astro port for.

### D. SvelteKit with `adapter-static` and `csr = false`

**Pros**
- With `csr = false` on every page, ships no JS. Leanest JS-option footprint (~72 packages).
- Official Sanity SvelteKit template; `@portabletext/svelte` is maintained.

**Cons**
- SvelteKit 3.0 shipped 2026-10-01 with a long list of breaking changes. Too new to start on.
- An app framework configured into a static generator. Default behavior (router + hydration) is the opposite of what you want; you are opting out on every page.
- Full rewrite.

Verdict: credible, but no advantage over Astro for this site.

### E. Hugo

**Pros**
- Single Go binary, no npm dependencies (Tailwind still needs its CLI). Smallest security surface of any option.
- Now has official Sanity support: `transform.PortableText` (v0.145+) and a documented GROQ content adapter.

**Cons**
- Portable Text goes through Markdown; custom marks (highlight, link styling) need render-hook workarounds.
- Go templates: untyped, no components. Biggest DX step down.
- Still 0.x with breaking changes in minors (e.g. 0.146 template system rewrite).

Verdict: only if minimizing dependencies outranks everything else.

### Not a good fit

| Option | Reason |
|---|---|
| Nuxt 4 | ~676 packages; full Vue hydration by default. Zero-JS is possible (`noScripts`) but fighting the defaults. |
| React Router v8 (framework mode) | Prerender emits `.data` files and hydrates. No documented zero-JS mode. |
| TanStack Start | Still RC a year after the RC announcement; near-daily releases. |
| Lume, Zola, VitePress 2, Vike, Waku | Deno-only, Portable Text gaps, alpha, 0.x, or RC respectively. Nothing new in 2025–2026 displaces Astro. |

## Comparison

| | Astro 7 | Next 16 export | Eleventy | SvelteKit static | Hugo |
|---|---|---|---|---|---|
| Client JS per page | 0 (verified) | ~130 KB br + props JSON | 0 | 0 with `csr=false` | 0 |
| Remaining effort | 3–5 days (branch exists) | 2–4 days incl. Studio | ~1–2 weeks | ~1–2 weeks | ~2 weeks |
| Sanity + Portable Text | Official docs, maintained PT package | Best-in-class, but needs React 19 / App Router for Studio embed | DIY, simple | Official template | Via Markdown |
| Upgrade churn | ~1 major/yr (2 in 2026) | 1 major/yr, 2-yr support | Slow on v3; v4 in flux | 3.0 just shipped | Breaking 0.x minors |
| Prod security surface | Static files only | Static files only | Static files only | Static files only | Static files only |
| Build-time deps | ~260–390 packages | Large (Next + React + SWC) | ~130–176 | ~72 | 1 binary |

The production security surface is the same for every option because they all produce static files on Cloudflare. The differences are in page weight, code simplicity, and how often you are forced to do upgrade work.

## Decisions that apply to every option

### Studio: extract it and upgrade to v6

- **Upgrade path.** v3 → v4 is a Node-floor bump only. v4 → v5 requires React 19.2. v5 → v6 requires Node ≥22.12, enables React strict mode in dev, and switches default search to `groq2024`. Schemas are unchanged across all three. The repo already uses `structureTool`. Both plugins have current versions: `@sanity/vision` 6.18 and `sanity-plugin-media` 6.3.3 (peer `sanity ^5 || ^6`); check the media plugin's config for changes since 2.x.
- **Hosting.**
  - `sanity deploy` to `<name>.sanity.studio`: free, zero ops, auto-updates for minor versions. Custom domain on the free plan is unclear (the pricing page lists custom domains as not included on Free; unverified whether that covers hosted Studios).
  - Self-host the built Studio on Cloudflare at `admin.whats.se`: needs a CORS origin added in Sanity, and one more Cloudflare project. Auto-updates still work for Studios built with Sanity's tooling.
  - Recommendation: `sanity deploy` first. Move to `admin.whats.se` only if editors care about the URL.
- **Do it before or with the site cutover.** The extracted Studio on the branch is still pinned to v3; bump it to v6 rather than shipping a new v3 deploy.

### Hosting: stay on Cloudflare Pages for the cutover

- Pages is not deprecated. Static assets are free and unlimited on both Pages and Workers.
- Moving to Workers + static assets is optional and can happen later. It needs a wrangler config, explicit `not_found_handling`, and re-creating the deploy hook under Workers Builds. `_redirects` and `_headers` work the same.
- Doing the framework change and the hosting change separately keeps each cutover small.

### Node

- Astro 7 and Sanity v6 both need Node ≥22.12. The repo's 22.16 is fine.
- Node 22 leaves maintenance LTS in April 2027. Plan the move to Node 24 LTS within the next six months; set it in `.nvmrc` and in Cloudflare's build environment together.

### Keep images on the Sanity CDN

- Keep the branch's approach: plain `<img>` with `@sanity/image-url`, `auto=format`, LQIP from asset metadata.
- Do not route Sanity images through Astro's build-time image pipeline.
- Watch Sanity free-plan bandwidth (100 GB/month). Whether image CDN traffic counts toward it is not documented explicitly.

## Plan (Astro path)

1. **Refresh the branch.** Rebase `astro-rewrite` onto `main`. Bump `/site` to Astro 7, `astro-portabletext` 1.x, `@sanity/client` 8. Add `pnpm.onlyBuiltDependencies` so installs are non-interactive. Check the `compressHTML` whitespace change visually.
2. **Studio to v6.** Bump `/studio` from v3 straight to v6 (React 19.2, `@sanity/cli` 7, plugins). Verify against the `development` dataset, then a read-only check against `production`. Deploy with `sanity deploy`.
3. **Parity QA.** Preview deploy of `/site` on a separate Cloudflare Pages project. Side-by-side every route against production. Lighthouse comparison. Fix differences.
4. **Fold in cheap fixes from `codebase-review.md`** where the port did not already: `tel:` links, back-link fallback (done on the branch), CMS-driven alt text, `robots.txt` + sitemap (`@astrojs/sitemap`).
5. **Cutover.** Point the production Pages project at `/site`: build command, output dir, `PUBLIC_SANITY_*` env vars, `NODE_VERSION`. Keep the deploy hook. Remove the `/admin/*` redirect, or replace it with a redirect to the new Studio URL so editors' bookmarks keep working.
6. **Clean up.** Delete the Next code and root `package.json` after a stable week. Add Renovate or Dependabot for `/site` and `/studio` so upgrades arrive as small PRs instead of yearly projects.

Steps 1–2 are each about a day. Step 3 is the variable one.

## Not verified

- Visual parity of the Astro 7 build. It builds; no screenshot comparison was done.
- Whether Sanity's hosted Studio supports a custom domain on the free plan.
- Whether Sanity image CDN traffic counts against the 100 GB/month bandwidth limit.
- `sanity-plugin-media` config changes between 2.x and 6.x.
- Next 17 timing and its plans for the Pages Router.
- Whether the 2026-08 Astro/sharp AVIF advisory applies to build-time optimization (moot if Sanity images are not processed by Astro).
- Eleventy/Build Awesome v4 stable date and what the paid tier contains.
- Effort estimates are judgement, not measurement.

## Sources

**Next.js**
- Support policy: https://nextjs.org/support-policy
- Next 16 blog: https://nextjs.org/blog/next-16
- Next 16.4 blog: https://nextjs.org/blog/next-16-4
- v16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Static exports: https://nextjs.org/docs/app/guides/static-exports
- React2Shell advisory: https://nextjs.org/blog/CVE-2025-66478
- Advisories: https://github.com/vercel/next.js/security/advisories

**Astro**
- Astro 7 blog: https://astro.build/blog/astro-7/
- v7 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v7/
- Astro joins Cloudflare: https://blog.cloudflare.com/astro-joins-cloudflare/
- Images: https://docs.astro.build/en/guides/images/
- Advisories: https://github.com/withastro/astro/security/advisories

**Sanity**
- Studio v6: https://www.sanity.io/blog/sanity-studio-v6
- v5 → v6: https://www.sanity.io/docs/help/v5-to-v6
- v4 → v5: https://www.sanity.io/docs/help/v4-to-v5
- Astro images and Portable Text: https://www.sanity.io/docs/astro/images-and-portable-text-astro
- Pricing: https://www.sanity.io/pricing
- Deployment: https://www.sanity.io/docs/studio/deployment

**Cloudflare**
- Migrating from Pages to Workers: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- Workers Builds deploy hooks: https://developers.cloudflare.com/changelog/2026-04-01-deploy-hooks

**Other frameworks**
- Eleventy / Build Awesome: https://www.11ty.dev/blog/build-awesome/
- SvelteKit 3.0: https://github.com/sveltejs/kit/releases/tag/%40sveltejs/kit%403.0.0
- SvelteKit page options: https://svelte.dev/docs/kit/page-options
- Hugo Portable Text: https://gohugo.io/functions/transform/portabletext/
- Nuxt mostly-static sites: https://nuxt.com/docs/4.x/guide/recipes/mostly-static-sites

Package versions and release dates checked with `npm view` on 2026-10-08.
