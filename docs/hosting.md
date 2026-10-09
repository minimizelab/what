# Hosting

Reference for where the site and Studio run and how they are configured. Most of this lives in dashboards, so this file is the recovery doc if a project is lost or has to be recreated. Update it when a setting changes.

## Domain and DNS

- DNS for `whats.se` is managed at **one.com**, not Cloudflare.
- `www.whats.se` is a CNAME to `what-website.pages.dev`.
- The apex `whats.se` is redirected to `https://www.whats.se` by one.com (302).

Because DNS is outside Cloudflare, zone features (Speed Brain, Cloudflare Images, Workers custom domains) are unavailable. Pages custom domains work with a plain CNAME.

## Cloudflare Pages

Account: **What! Arkitektur**. Both projects build from GitHub `minimizelab/what`.

| Setting | `what-website` (production) | `what-astro` (Astro preview) |
|---|---|---|
| Serves | `www.whats.se`, `what-website.pages.dev` | `what-astro.pages.dev` |
| Production branch | `main` | `astro-rewrite` |
| Root directory | repo root | `site` |
| Build command | `npx next build` | `pnpm build` |
| Output directory | `out` | `out` |
| Env vars | `NEXT_PUBLIC_SANITY_PROJECT_ID=lu0lnnx1`, `NEXT_PUBLIC_SANITY_DATASET=production`, `NODE_VERSION=22.16.0` | `PUBLIC_SANITY_PROJECT_ID=lu0lnnx1`, `PUBLIC_SANITY_DATASET=production`, `NODE_VERSION=26.11.1`, `PNPM_VERSION=12.9.1` |
| Preview deployments | all branches | none; builds only when files under `site/` change (watch path `site/*`; Pages supports a single `*`, which matches across `/`) |
| Web Analytics | on | on |
| Deploy hook | called by the Sanity webhook | none; rebuild manually |

`NODE_VERSION` in the dashboard overrides `.nvmrc`.

### In the repo

- `site/public/_redirects`: `/projekt` → `/`, and `/admin`, `/admin/*` → the hosted Studio.
- `site/public/_headers`: long-term caching for `/_astro/*`, security headers, and the `Speculation-Rules` header pointing at `site/public/speculation-rules.json`.
- The legacy Next site uses `public/_redirects` at the repo root.

### Content rebuilds

A Sanity webhook on the `production` dataset calls the `what-website` deploy hook when content changes. To recreate it: Pages project → Settings → Builds & deployments → Deploy hooks, then sanity.io/manage → API → Webhooks.

## Sanity

- Project `lu0lnnx1`, datasets `production` and `development`.
- The standalone Studio in `studio/` is hosted by Sanity at **https://whats.sanity.studio** (`appId` in `studio/sanity.cli.ts`). Deploy with `pnpm deploy` in `studio/`; it builds against `production` (`studio/.env.production`).
- The legacy embedded Studio is served at `/admin` on the Next site until it is retired.
- CORS origins with credentials must include every Studio host (`https://whats.sanity.studio`, and `https://www.whats.se` while `/admin` exists). Manage them with `npx sanity cors list|add|delete` in `studio/`.

## Moving production to the Astro site

1. In `what-website`, change the build settings to the `what-astro` values above, including the env vars.
2. Merge `astro-rewrite` into `main` straight away. A webhook build that runs between the two steps fails without replacing the live site.
3. To roll back, use Pages' rollback to the last Next deployment and revert the build settings, or the next webhook build will use the Astro settings again.
