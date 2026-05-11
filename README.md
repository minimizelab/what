# whats.se

Public website for What! Arkitektur.

## Repository layout (migration in progress)

This repo is mid-migration from Next.js to Astro. Until the cutover lands:

- `site/` — Astro public site (under construction, deploys to a preview Cloudflare Pages project)
- `studio/` — extracted Sanity v3 Studio (runs locally only during this iteration)
- Root (`pages/`, `app/`, `src/`, `next.config.mjs`, …) — current Next.js production site, still building and deploying

See `docs/superpowers/specs/2026-05-08-astro-migration-iteration-1-design.md` for the plan.

## Running things

- **Current production site (Next.js, root):** `npm run dev`
- **Astro public site:** `cd site && pnpm dev`
- **Sanity Studio:** `cd studio && pnpm dev`
