# Hosting — Cloudflare Pages

Working notes on how this site is deployed and what could move from the dashboard into the repo.

## Current state

The site is hosted on **Cloudflare Pages**, serving the static export from `out/`. **The only hosting-related file currently in the repo is `public/_redirects`.** Everything else lives in the Cloudflare dashboard.

### In the repo
- `public/_redirects` — copied to `out/_redirects` on build. Two rules:
  ```
  /projekt    /          301
  /admin/*    /admin      301
  ```
  The first redirects the bare `/projekt` (which has no page) to home. The second collapses any `/admin/<anything>` deep link back to `/admin` — needed because the embedded Sanity Studio handles its own client-side routing under `/admin`, and Cloudflare doesn't know those sub-paths exist as pre-rendered files.

### In the Cloudflare dashboard *(fill in from console)*

| Setting | Value |
|---|---|
| Project name | _TODO_ |
| Production branch | `main` |
| Build command | `npm run build` (assumed) |
| Build output directory | `out` |
| Node version | _TODO_ — should match `.nvmrc` (22.16.0) |
| Env var: `NEXT_PUBLIC_SANITY_PROJECT_ID` | `lu0lnnx1` (also in `.env`) |
| Env var: `NEXT_PUBLIC_SANITY_DATASET` | `production` (preview branches: `development`?) |
| Custom domain | _TODO_ — `whats.se` / `www.whats.se`? |
| Page Rules / Transform Rules | _TODO_ |
| Custom HTTP headers (dashboard-set) | _TODO_ |
| Deploy hooks | ✅ Sanity → Cloudflare Pages deploy hook is configured and rebuilds on content changes (confirmed working) |
| Preview deployments | _TODO_ — enabled? for which branches? |

> If anything in this table changes, update it here. This file is the recovery doc if the Cloudflare project is ever lost or migrated.

## Code-based configuration options for Cloudflare Pages

Cloudflare Pages supports several files that, if present in the build output, override or extend dashboard settings. Anything here is **version-controlled, reviewable, and reverts cleanly** — strict improvement over dashboard-only config.

### 1. `public/_headers` — custom HTTP response headers *(recommended)*

A plain-text file (same format as Netlify's). Each block is a path pattern followed by indented `Header: value` lines.

For a static brochure site + a Sanity Studio mounted under `/admin`, a reasonable starting point:

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN

# Long cache for fingerprinted Next.js static assets
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# Long cache for fonts (next/font writes them hashed under /_next/static/media/)
/_next/static/media/*
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML — it's the rebuild trigger when content changes
/*.html
  Cache-Control: public, max-age=0, must-revalidate
/
  Cache-Control: public, max-age=0, must-revalidate
```

Note: `Content-Security-Policy` is intentionally **not** in the example above. CSP for the embedded Sanity Studio at `/admin` is non-trivial — Studio loads from `*.sanity.io`, `*.sanity.studio`, `cdn.sanity.io`, and uses inline styles + workers. If you want CSP, plan a separate session and start with `Content-Security-Policy-Report-Only` to discover what Studio needs before enforcing.

### 2. `public/_redirects` — expand the existing file

Already in use. Can carry more rules as needed. Useful patterns:

```
# Force apex → www (or the reverse, depending on your canonical)
https://whats.se/*           https://www.whats.se/:splat   301

# Legacy URLs from the old site, if any
/gamla-projekt/:slug         /projekt/:slug                301
```

(The apex/www rule may already be set up via Cloudflare's bulk redirect / page rules — check before adding.)

### 3. `public/_routes.json` — fine-grained routing for Pages Functions

Only relevant if Pages Functions get added. Skip for now — the site has no dynamic backend.

### 4. `functions/` directory — Pages Functions

Cloudflare's edge-runtime serverless functions. Not needed today (everything is static + client-side Sanity), but useful future hooks:
- `/api/contact` — a contact form handler that emails / writes to Sanity
- `/api/revalidate` — a webhook endpoint Sanity calls on content changes (would need a different deploy flow than pure static export)
- Custom OG image generation per project

These would require giving up `output: 'export'` (or running them as a separate worker) — bigger architectural decision, not a small change.

### 5. `wrangler.toml` — only if adopting Functions or moving to Workers

Currently unnecessary. Add only when introducing Pages Functions or migrating to a Workers deploy.

### 6. CI-driven deploys via GitHub Actions *(optional)*

Cloudflare Pages auto-builds on push to `main` by default. If you want more control (e.g., run lint + a build smoke test before publishing, deploy from a different runner, deploy only on tagged releases), a `.github/workflows/deploy.yml` using `cloudflare/wrangler-action` or `cloudflare/pages-action` is the standard approach.

For a small brochure site, the default git-push-triggered Pages build is fine. Worth setting up CI **just for `npm run lint` and `npm run build`** as a PR check, regardless of deployment.

### 7. Sanity → Cloudflare deploy webhook ✅ already configured

Editors changing content in `/admin` would otherwise not trigger a rebuild — the static export is locked at last build time. This is already wired up: a Sanity webhook hits a Cloudflare Pages deploy hook on content changes, and rebuilds reliably.

If it ever needs re-creation: Cloudflare Pages → Settings → Builds & deployments → **Deploy hooks** to mint a URL, then Sanity → Manage → API → **Webhooks** to point at it (scope it to the `production` dataset). Document the resulting hook URL in the dashboard table above.

## Suggested order of operations

1. **Fill in the dashboard table above** (5 min in the Cloudflare console).
2. **Add `public/_headers`** with the security + cache headers from §1. Low risk, high value, easily rolled back.
3. *(Later)* Add a minimal GitHub Actions workflow that runs `npm run lint && npm run build` on PRs, so config drift gets caught before deploy.
4. *(Much later)* If/when contact forms or other dynamic features are added, revisit `functions/` and the `output: 'export'` decision together.

The Sanity → Cloudflare deploy webhook is already in place and rebuilding on content changes — no action needed there.

## What to keep in the dashboard

Some things are genuinely dashboard-only and that's fine:
- DNS records, SSL/TLS mode, custom domain bindings
- Account-level WAF / bot management / DDoS settings
- Analytics, speed insights, Web Analytics token
- Env var **values** (the names go here as documentation; the secrets stay in the dashboard)

The goal isn't to put everything in code — it's to make sure the things that *behave like code* (redirects, headers, build settings) are reviewable in PRs and recoverable from the repo alone.
