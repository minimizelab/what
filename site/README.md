# whats.se — Astro public site

The public site, built with Astro as a fully static site and deployed to Cloudflare Pages.

## Run locally

```bash
pnpm install
pnpm dev    # http://localhost:4321
pnpm build  # writes static site to ./out/
```

## Environment

Reads from `.env.development` (dev mode) and `.env.production` (build mode):

- `PUBLIC_SANITY_PROJECT_ID=lu0lnnx1`
- `PUBLIC_SANITY_DATASET=production` (or `development`)
