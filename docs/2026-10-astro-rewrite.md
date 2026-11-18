# 2026-10: Rewrite from Next.js to Astro

A record of what changed and why, for anyone wondering later how the repo ended up this way.

## What we did

- Rebuilt the public site in Astro as a fully static site with no client-side JavaScript. It looks and behaves the same as the Next.js version, and the URLs are unchanged.
- Moved the Sanity Studio out of the website into its own project, upgraded it from Sanity v3 to v6, and hosted it on Sanity at https://whats.sanity.studio. Once the new site is live, the old `/admin` address redirects there.
- Kept Sanity as the CMS, its image CDN for images, and Cloudflare Pages as the host on the same domain.
- Ran the new site in parallel on a separate Cloudflare Pages preview, so it could be checked before the domain was switched to it.
- Changed the page title to "What! Arkitektur, en del av Reflex Arkitekter" after the company became part of Reflex.

## Why

- **The old stack was out of support.** The site ran on Next.js 14, which no longer received security fixes, and Sanity v3. Staying meant a forced upgrade either way.
- **Next.js was more than the site needs.** It is a small portfolio site whose content changes a few times a month. It needs static pages and images, not a JavaScript framework running in the browser.
- **Embedding the Studio made the site complex.** Hosting the Studio inside the site was the only reason the project mixed two Next.js routers. Separating them made both simpler to maintain and upgrade.
- **Astro fits a static, content-driven site.** It renders everything at build time, ships no JavaScript by default, and integrates well with Sanity. The resulting site is lighter and scored higher in Lighthouse than the Next.js version.

## What we deliberately did not change

- **The design.** The goal was the same output on a maintainable stack. Design changes were left for later.
- **Hosting.** We stayed on Cloudflare Pages rather than Workers, because the domain's DNS is managed outside Cloudflare.
- **Images.** We kept Sanity's image CDN rather than processing images at build time, which keeps builds fast.
