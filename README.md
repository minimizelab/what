# whats.se

Public website for What! Arkitektur.

## Repository layout (migration in progress)

This repo is mid-migration from Next.js to Astro. Until the cutover lands:

- `site/` — Astro public site, deployed to the `what-astro` preview project on Cloudflare Pages
- `studio/` — standalone Sanity v6 Studio, hosted at https://whats.sanity.studio
- Root (`pages/`, `app/`, `src/`, `next.config.mjs`, …) — current Next.js production site, still building and deploying

Hosting, Studio and cutover details are in `docs/hosting.md`.

## Running things

Node and pnpm versions are pinned in `mise.toml`. Run `mise install` once to get them.

- **Current production site (Next.js, root):** `npm run dev`
- **Astro public site:** `cd site && pnpm dev`
- **Sanity Studio:** `cd studio && pnpm dev`
