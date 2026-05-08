# Security & dependency updates — 2026-05

Working document for the dependency-refresh effort on the `security-updates` branch. Site is small, statically exported, and has no issue tracker — this file is the issue tracker.

## Context

- Site was built a few years ago and has not been actively maintained.
- Production is a static export (`output: 'export'` in `next.config.mjs`). **No Next.js server runs in production**, which dramatically narrows the actual attack surface — most Next.js CVEs concern middleware, SSR, the image-optimizer API, server actions, or cache poisoning, none of which apply here.
- `/admin` route hosts the embedded Sanity Studio (also pre-rendered + client-side-only after that). Studio talks to `cdn.sanity.io` directly.
- Node is on `22.16.0` (current LTS) — no action needed there.

## Baseline (before any work)

`npm audit`: **37 vulnerabilities** (1 low, 22 moderate, 12 high, 2 critical).

Key version gaps vs. latest at time of audit:

| Package | Pinned | Latest | Gap |
|---|---|---|---|
| `next` | 14.1.0 (exact) | 16.2.5 | 2 majors |
| `react` / `react-dom` | 18.2.0 (exact) | 19.2.6 | 1 major |
| `@sanity/vision` | 3.28.0 | 5.24.0 | 2 majors |
| `next-sanity` | 7.1.0 | 12.4.5 | 5 majors |
| `@portabletext/react` | 3.0.11 | 6.2.0 | 3 majors |
| `sanity-plugin-media` | 2.2.5 | 4.2.0 | 2 majors |
| `tailwindcss` | 3.4.1 | 4.2.4 | major rewrite |
| `eslint` / `eslint-config-next` | 8.56 / 14.1 | 10.3 / 16.2 | flat-config jump |
| `typescript` | 5.3.3 | 6.0.3 | 1 major |

`package.json` uses **exact pins** (no caret) for most load-bearing deps, which is why `npm update` alone can't move them.

## Plan

### Tier 1 — Easy wins (low risk, in-major patches)
- [x] `npm update` — pulls all in-major patches
- [ ] Bump `next` 14.1.0 → latest `14.2.x` (drop-in; closes the critical CVE + 6 other Next CVEs)
- [ ] Bump `@sanity/vision`, `sanity-plugin-media`, `groq` to latest `3.x` (stay on Sanity v3)
- [ ] Bump `typescript` 5.3 → latest `5.x`
- [ ] Re-run `npm audit` and confirm site still builds + serves

### Tier 2 — Moderate, half-day each
- [ ] Sanity v3 → v5 (Studio side: `@sanity/vision`, `sanity-plugin-media`, schemas in `app/(studio)/`)
- [ ] `next-sanity` 7 → current major (pair with the Sanity bump)
- [ ] `@portabletext/react` 3 → 6 (refactor `src/lib/serializers.tsx`; also delete the unused duplicate `src/serializers.tsx`)

### Tier 3 — Bigger lifts (defer unless time allows)
- [ ] React 18 → 19 + Next 14 → 15 (paired)
- [ ] Next 15 → 16
- [ ] Tailwind 3 → 4 (CSS-first config rewrite — custom tokens `what-white`, `what-red-01`, `font-what`, custom cursors all need to migrate)
- [ ] ESLint 8 → 9 (flat config)

## Current progress

**Branch:** `security-updates` (off `main` at `ac180e9`)

- ✅ `npm update` run — vulnerabilities **37 → 22** (1 critical, 12 high, 9 moderate)
- ✅ Site verified working after update — `npm run dev` boots, `/`, `/studio`, `/admin` all return 200, no compile or runtime errors
- ⏳ Next: bump `next` to latest `14.2.x` to clear the remaining critical CVE

## Remaining vulnerabilities after `npm update`, by impact

| Group | Severity | Affects production? | Resolved by |
|---|---|---|---|
| `next` 14.1.0 (incl. critical Middleware authz bypass) | critical/high | Build pipeline only (static export ⇒ no Next runtime in prod) | Next 14.2.x bump (Tier 1) |
| Sanity v3 stack: `@sanity/cli`, `sanity`, `@sanity/ui`, `@sanity/vision`, `next-sanity`, `sanity-plugin-media`, `prismjs`, `react-refractor`, `refractor`, `postcss` | high/moderate | Studio only (`/admin`) | Sanity v3 → v5 (Tier 2) |
| ESLint stack: `eslint-config-next`, `@next/eslint-plugin-next`, `@typescript-eslint/*`, `glob`, `minimatch` | high | **No — dev/lint only** | ESLint 9 + Next 15+ (Tier 3) |
