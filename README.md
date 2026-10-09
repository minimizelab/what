# whats.se

Public website for What! Arkitektur.

## Repository layout

- `site/` — Astro public site, served at https://www.whats.se from Cloudflare Pages
- `studio/` — Sanity v6 Studio, hosted at https://whats.sanity.studio

Hosting and Studio details are in `docs/hosting.md`. `docs/2026-10-astro-rewrite.md` explains how the repo got here.

## Running things

Node and pnpm versions are pinned in `mise.toml`. Run `mise install` once to get them.

- **Public site:** `cd site && pnpm dev`
- **Sanity Studio:** `cd studio && pnpm dev`
