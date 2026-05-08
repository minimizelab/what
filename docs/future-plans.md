# Future plans — if we were starting over today

A green-field thought experiment. Not a migration plan, not a commitment — a brainstorm about what stack would actually fit this site if we rebuilt from scratch in 2026.

## The site, honestly described

Setting the stack question aside, what is this site, *really*?

- ~10–30 project pages, a handful of category index pages, a contact/about page
- Images are the product (architecture firm portfolio); everything else is supporting structure
- Content is updated by editors via Sanity, but probably not frequently — measured in "a few times a month" not "every hour"
- Two pieces of interactivity that actually need JS: hover/touch states on cards, and the category filter (which is just a set of `<Link>`s — arguably *no* JS)
- One "app-like" surface: the embedded Sanity Studio at `/admin`, which is itself a heavy React SPA but is fully isolated from the public site
- Audience is mostly Swedish, mostly desktop + mobile mix, no anonymous-personalization, no auth, no cart, no real-time anything

That description fits **a static, content-driven brochure site with a CMS**. It does *not* fit anything Next.js's recent direction is optimizing for (server components, streaming, partial prerendering, edge SSR, server actions). Using Next here today is using a Formula 1 car to drive to the corner shop — it works, it's even fine, but it's a *lot* of machinery.

## The case for moving off Next.js

Things that are actively bad about staying on Next for this use case:

1. **Framework churn.** The dependency review showed Next is 2 majors behind, with steady breaking changes (caching defaults, async APIs, App Router migration pressure). Every 6 months there's a non-trivial maintenance bill.
2. **Bundle weight.** Even with `output: 'export'`, every page hydrates with React + the Next runtime. For pages that are essentially static HTML, that's tens of kilobytes of JS shipped for ~zero interactive behavior.
3. **Cognitive overhead.** The Pages-Router-vs-App-Router split (forced on this codebase to host the Sanity Studio under `/admin`) is a permanent papercut. Anyone new has to read CLAUDE.md to understand why the project has both.
4. **Mismatch in defaults.** Next's mental model is "smart server, dynamic by default, opt out into static." This site's mental model is "static by default, opt in to dynamic if needed." Those defaults fight each other.

Things that are still *fine* about Next here:
- Static export works; build output is just HTML/CSS/JS that any host serves
- `next/image` + custom Sanity loader is a real strength
- Sanity ecosystem has the best Next integration of any framework

So: Next isn't broken. It's just *more than this site needs*.

## Candidates worth weighing

### Astro — the leading candidate

**Why it fits:**
- "Ship zero JS by default" is the exact model for this site
- `.astro` components feel like JSX-flavored HTML — quick to write, easy to read, no React-isms unless you want them
- `<Image>` and `<Picture>` components are first-class, with built-in responsive handling and format negotiation (AVIF/WebP). Plays well with remote images from Sanity CDN.
- Islands architecture for the rare interactive bits (e.g. a filter UI that reacts client-side, if ever wanted) — drop a React/Svelte/Vue component into a single island, ship JS only for that island
- `@sanity/astro` is an official, maintained integration. Visual Editing and live preview are supported.
- Build times are very fast; HMR is excellent
- Smaller dependency surface than Next — fewer transitive packages, fewer CVEs to chase
- Static-first, with SSR as an opt-in adapter if ever needed (Cloudflare Pages adapter exists)

**Wrinkles:**
- The embedded Sanity Studio at `/admin` doesn't fit Astro's model as cleanly. **The honest answer: don't embed it.** Move the Studio to either (a) Sanity's free `*.sanity.studio` hosting (e.g. `whatarkitektur.sanity.studio`) or (b) a separate Cloudflare Pages project at `admin.whats.se`. Editors bookmark a different URL — small workflow change, big simplification.
- It's a different framework. Real rewrite, not a port. Estimated 1–2 weeks of focused work for someone who knows Astro; longer if learning it.
- Smaller talent pool than Next in Sweden — but the site is small enough that this matters less than for a product team.

### SvelteKit (with `adapter-static`)

**Why it fits:**
- Compiled output, very small JS payload
- Static export is well-supported
- Component model is concise

**Wrinkles:**
- More "framework" than Astro for what we need — if the goal is *less* framework, SvelteKit is sideways, not down
- Sanity integration is community-maintained, less polished
- Different ecosystem; no real reason to pick this over Astro for *this* site

### Eleventy (11ty)

**Why it fits:**
- Most minimalist option that's still ergonomic
- Pure static, near-zero runtime overhead
- Templating-first (Nunjucks/Liquid/etc.) — refreshingly old-school

**Wrinkles:**
- You'd reinvent the responsive image story (or pull in `@11ty/eleventy-img` and configure it). Doable but more work than Astro's batteries-included version.
- Component composition is weaker than Astro — you'd be writing more templating, less JSX-like UI
- Probably too bare for an image-heavy design-conscious site without significant scaffolding

### Hugo

**Why it fits:**
- Fastest builds of anything on this list (Go-compiled, sub-second builds even for thousands of pages)
- Very mature, very stable

**Wrinkles:**
- Go templating is an acquired taste, especially after years of JSX
- Sanity integration would mean writing your own GROQ-fetch step at build time — workable but bespoke
- Would feel like a step backward in DX

### Stay on Next.js, but pin and patch

The honest baseline.

**Why it might fit:**
- It already works
- The static-export setup means you're insulated from most Next runtime CVEs (as documented in `security-updates.md`)
- Migration cost is zero
- Cost is just periodic dependency upkeep — maybe 1 day per year if disciplined

**Why it might not:**
- The maintenance cost compounds: each year the version gap widens, and the eventual migration (e.g. Next 18 dropping Pages Router fully) becomes a forced project on someone else's timeline
- Every new feature added carries Next's complexity tax for no benefit

## Deployment model

Cloudflare Pages with static deploy is already the right answer. None of the candidates above change that — they all output static files that Cloudflare Pages serves identically.

Worth noting:
- Sanity CDN handles image transformations (resize, crop, format) on the fly. That's already optimal and doesn't change with the framework choice.
- Astro can also use a Cloudflare Pages **adapter** for SSR if dynamic features ever become necessary (e.g. a contact form that posts somewhere). That's a clean upgrade path: start static, add Pages Functions later if needed.

## Recommendation

If we were starting today, my pick is:

> **Astro + Sanity + Cloudflare Pages, with the Sanity Studio hosted separately on `*.sanity.studio` or `admin.whats.se`.**

Reasoning:
- Matches the actual shape of the site (static, content-driven, image-heavy)
- Reduces shipped JS from "React + Next runtime + page code" to "≈0 unless you need an island"
- Removes the Pages-Router/App-Router schism by removing the reason for it
- Keeps the parts that already work: Sanity as the CMS, Cloudflare Pages as the host, GROQ as the query language
- Gives a clean upgrade path to dynamic features (Astro SSR adapter) without forcing them now

Effort to migrate, rough estimate: **1–2 focused weeks** for someone with Astro experience. Component translation is mostly mechanical (atoms → `.astro` files); the data layer (`src/services/sanity.ts`) ports over almost unchanged; the trickiest part is decomposing the Studio embed.

## Astro rewrite vs. keeping Next current — direct comparison

The natural follow-up question: isn't keeping Next up-to-date *less* work than a rewrite? Honestly, **no — they're in the same ballpark for a site this small.**

### Effort comparison

Getting fully current on the existing stack means: Next 14 → 15/16, React 18 → 19, Sanity 3 → 5, `next-sanity` 7 → 12, ESLint 8 → 9, the `@portabletext/react` 3 → 6 refactor, plus dealing with whatever third-party libs lag React 19. Realistically **3–8 days** if it goes smoothly, more if not.

Astro rewrite: **5–10 days** for the same person. Most of the work is mechanical (component-by-component port + Sanity Studio extracted to its own deploy). Data layer ports almost unchanged.

So the difference isn't dramatic — but the **shape of the cost** is very different:

- **Next upgrade is known boring work.** A sequence of small annoying migrations, each with its own gotchas, none of which earn the user anything visible. You end up exactly where you started, just on newer dependency versions.
- **Astro rewrite is unknown work with upside.** Real learning curve in places, but the result is a smaller, faster, cleaner codebase that you'll genuinely want to come back to. End state is materially better, not just newer.

### The App Router migration is the canary

Last time I tried to push the public pages over to App Router, it was harder than expected and earned the user nothing. That pain point is **still ahead on the Next path** — Pages Router isn't deprecated yet, but Vercel's center of gravity has clearly moved, and every year on Pages Router the divergence widens. Astro doesn't have this schism at all. There's one routing model.

### Is "stay on Next 14, just patch" realistic long-term?

**Realistic for ~12 more months. Not indefinitely.**

Vercel backports security fixes to current major + previous major. Next 16 is current, 15 is previous, 14 is on its way out. The patch pipeline will dry up sometime in the next year.

For a static-export site, that matters less than it sounds — most Next CVEs don't apply (covered in `security-updates.md`). But:
- The dev/lint toolchain (`eslint-config-next`, `@next/eslint-plugin-next`) ages on the same clock and will start showing unpatched CVEs in `npm audit`.
- Third-party packages will start dropping Next 14 + React 18 from their peer deps. `next-sanity` already has — its current major needs Next 15+.
- React 18 itself has another 1–2 years of comfortable support, so React isn't the bottleneck.

### The bigger ticking clock is Sanity, not Next

Sanity v3 is in maintenance mode; v5 is current. The high-severity vulnerabilities in the Sanity tree (`@sanity/cli`, `@sanity/ui`, `prismjs` via Studio) won't get fixed in v3. **You have to move Sanity within the next year regardless of frontend choice.**

This changes the math: if you're going to do a Sanity v3 → v5 upgrade anyway, doing it as part of an Astro rewrite is the same work, not extra work. You wouldn't want to do the Sanity migration on Next *and then* do Astro later — that's the migration done twice.

### Refined recommendation

Two reasonable paths, depending on appetite:

**Path A — Astro now (if you have appetite for a focused 1–2 week project in the next few months).**
- Math works out: similar effort to the alternative
- Avoids the App Router migration pain entirely
- Folds the mandatory Sanity upgrade into one project, not two
- End state is materially better — smaller bundle, no router schism, less framework overhead

**Path B — Minimal patch now, revisit in 3–6 months.**
- Finish the easy wins on the `security-updates` branch (Next 14.1 → 14.2.x, in-major Sanity patches)
- Stay on Next 14 + Sanity 3 through autumn
- When the Sanity v3 → v5 forced migration comes due, that's the natural decision point — and at that moment, Astro is a better answer than upgrading Sanity on Next, because you'd already be doing the Sanity work

**What I would explicitly *not* recommend:** a serious Next 14 → 15 + React 18 → 19 + Sanity 3 → 5 upgrade pass on the current stack. That's the worst of both worlds — significant work, no user-facing benefit, and you're still on Next at the end of it.

The real decision is **"Astro now" vs. "small fix now, Astro later"** — both are sensible. "Stay on Next forever" is not on the table.

## What we should *not* do

- **Don't migrate "for fun".** The current site works. A rewrite is justified only if the maintenance/quality return outweighs the rewrite cost. For a site that gets one or two design tweaks a year, the math is borderline.
- **Don't half-migrate.** Astro alongside Next, or a piecemeal page-by-page port, doubles complexity. If we go, we go all the way in one branch.
- **Don't pick a framework without first checking who'll maintain the site in 3 years.** If the answer is "the same person who built the Next version", Astro is fine — they'll learn it once. If the answer is "a junior dev at the agency", Next is the safer-by-popularity choice even with its overhead.

## Decision points to revisit later

These are *not* decisions to make now — they're flags to think about when (if) a rewrite gets greenlit:

1. **Studio hosting:** sanity.studio managed (zero ops, but `*.sanity.studio` URL) vs. own subdomain (more polish, slightly more maintenance)
2. **Image strategy:** keep using Sanity CDN's transformations (current approach, optimal), or pre-process at build time with Astro's image pipeline (more control, larger build artifacts)
3. **Type safety on queries:** adopt Sanity TypeGen at the rewrite (covered in `codebase-review.md`) so GROQ + types are coupled from day one
4. **Content modeling cleanup:** revisit the `mainImage` vs `images[0]` overlap (see codebase-review.md item 6) before re-implementing it on the new stack
5. **A11y baseline:** introduce CMS-driven alt text and a real Lighthouse a11y pass at the rewrite — easier to bake in than retrofit

## Bottom line

For *this* site — small, static, image-heavy, infrequently updated, no real interactivity — Astro is a better-fit tool than current-day Next. The rewrite cost is roughly the same as keeping Next current, and a forced Sanity v3 → v5 migration is coming due within ~12 months regardless of stack.

The real decision is **"Astro now" vs. "small fix now, Astro at the Sanity-migration moment."** Both are reasonable; pick based on appetite. "Stay on Next forever, just patching" is not realistic past about a year.
