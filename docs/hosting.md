# Hosting

Reference for where the site and Studio run and how they are configured. Most of this lives in dashboards, so this file is the recovery doc if a project is lost or has to be recreated. Update it when a setting changes.

## Domain and DNS

- DNS for `whats.se` is managed at **one.com**, not Cloudflare.
- `www.whats.se` is a CNAME to `what-website.pages.dev`.
- The apex `whats.se` is redirected to `https://www.whats.se` by one.com (302).

Because DNS is outside Cloudflare, zone features (Speed Brain, Cloudflare Images, Workers custom domains) are unavailable. Pages custom domains work with a plain CNAME.

## Cloudflare Pages

Account: **What! Arkitektur**. Project **`what-website`**, built from GitHub `minimizelab/what`.

| Setting | Value |
|---|---|
| Serves | `www.whats.se`, `what-website.pages.dev` |
| Production branch | `main` |
| Root directory | `site` |
| Build command | `pnpm build` |
| Output directory | `out` |
| Env vars | `PUBLIC_SANITY_PROJECT_ID=lu0lnnx1`, `PUBLIC_SANITY_DATASET=production`, `NODE_VERSION=26.11.1`, `PNPM_VERSION=12.9.1` |
| Preview deployments | all branches |
| Web Analytics | on |
| Deploy hook | called by the Sanity webhook |

`NODE_VERSION` must match `mise.toml`. Build watch paths, if set, take a single `*` that matches across `/` (`site/*`, not `site/**`).

### In the repo

- `site/public/_redirects`: `/projekt` → `/`, and `/admin`, `/admin/*` → the hosted Studio.
- `site/public/_headers`: long-term caching for `/_astro/*`, security headers, and the `Speculation-Rules` header pointing at `site/public/speculation-rules.json`.

### Content rebuilds

A Sanity webhook on the `production` dataset calls the `what-website` deploy hook when content changes. To recreate it: Pages project → Settings → Builds & deployments → Deploy hooks, then sanity.io/manage → API → Webhooks.

## Sanity

- Project `lu0lnnx1`, datasets `production` and `development`.
- The standalone Studio in `studio/` is hosted by Sanity at **https://whats.sanity.studio** (`appId` in `studio/sanity.cli.ts`). Deploy with `pnpm deploy` in `studio/`; it builds against `production` (`studio/.env.production`).
- CORS origins with credentials must include every Studio host (`https://whats.sanity.studio`). Manage them with `npx sanity cors list|add|delete` in `studio/`.
