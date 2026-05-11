# Astro Migration — Iteration 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure this repo into a monorepo with `/site/` (Astro public site) and `/studio/` (extracted Sanity v3 Studio) alongside the existing Next code, reaching a preview-deployable Astro site at visual parity with current production. No production cutover in this iteration.

**Architecture:** Two new pnpm subprojects coexist with the untouched Next code at the repo root. `/studio/` is a standalone Sanity v3 Studio running locally only (no new hosted URL). `/site/` is an Astro 5 static-export project that consumes the same Sanity dataset. Production keeps building from the root unchanged.

**Tech Stack:** Astro 6 (static export), Sanity v3 (existing), Tailwind v4 with CSS-first config (`@theme` directives, no JS config), `@sanity/client`, `@sanity/image-url`, `astro-portabletext`, `@fontsource/*` for fonts, pnpm for new subprojects.

**Note (added 2026-05-08 during execution):** The Task 4 scaffold installed Astro 6 + Tailwind v4 instead of the originally-spec'd Astro 5 + Tailwind v3 (a result of dispatching `astro@latest`). After review, the user opted to stay on current versions. Tasks 5–12 below have been amended to use Tailwind v4 CSS-first config (`@theme` directives) instead of a JS `tailwind.config.ts`. Class names in components are unchanged because v4 derives utilities from `@theme` variables (e.g., `--color-what-white` produces `bg-what-white`, `text-what-white`).

**Spec:** `docs/superpowers/specs/2026-05-08-astro-migration-iteration-1-design.md`

**Critical workflow note:** Per `CLAUDE.md`, every `git commit`/`git push` requires explicit user approval at execution time. The "Commit" steps in this plan describe the message and staging, but the executor must pause and obtain approval before running each `git commit`.

**No automated tests.** This codebase has no test runner. Verification in each task uses real commands (build, dev server, curl, browser, Lighthouse) and observable output. Each task includes a verification step with expected output.

---

## File Structure Overview

End-state directories created or modified by this plan:

```
whats/
├── site/                          # NEW — Astro public site
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── astro.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro
│   │   │   ├── [category].astro
│   │   │   ├── projekt/[project].astro
│   │   │   └── studio.astro
│   │   ├── layouts/
│   │   │   └── Page.astro
│   │   ├── components/
│   │   │   ├── atoms/  (H1, H2, Section, TextLarge, TextMedium, TextUppercase, SanityImage)
│   │   │   ├── molecules/  (EmployeeCard, FilterBar, ImageGrid, ProjectCard)
│   │   │   ├── organisms/  (Footer, Header, Nav, ProjectHeader, ProjectInfoBox, ProjectsGrid)
│   │   │   └── portable-text/  (Highlight, Link, Block)
│   │   ├── lib/
│   │   │   ├── config.ts
│   │   │   ├── sanityClient.ts
│   │   │   └── imageBuilder.ts
│   │   ├── services/sanity.ts
│   │   ├── utils/getSortedArray.ts
│   │   ├── types.ts
│   │   └── styles/global.css
│   ├── public/
│   │   ├── _redirects
│   │   ├── cursor-point.svg, cursor-red-point.svg, favicon.png
│   ├── .env.development, .env.production
│   └── README.md
├── studio/                        # NEW — extracted Sanity v3 Studio
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   ├── deskStructure.ts
│   ├── schemas/                   # verbatim copy from app/(studio)/schemas/
│   ├── .env.development, .env.production
│   └── README.md
├── docs/superpowers/plans/
│   └── 2026-05-08-astro-migration-iteration-1.md   # this file
└── pages/, app/, src/, public/, next.config.mjs, tailwind.config.ts, package.json, ...   # UNTOUCHED legacy Next
```

---

## Task 1 — Monorepo skeleton (#52)

**Files:**
- Create: `site/.gitkeep`, `studio/.gitkeep`
- Modify: `README.md` (top-level, may already exist as the existing project README)

Mark the boundaries before any subproject scaffolding so the diff is small and obvious.

- [ ] **Step 1: Verify branch and clean state**

Run from repo root:
```bash
git status -sb
```
Expected:
```
## astro-rewrite
```
No uncommitted changes (besides this plan file's parent dir, which is already committed).

- [ ] **Step 2: Create empty `/site` and `/studio` directories**

```bash
mkdir -p site studio
touch site/.gitkeep studio/.gitkeep
```

- [ ] **Step 3: Add a top-level README explaining the monorepo state**

If a top-level `README.md` already exists from `create-next-app`, replace its content. Otherwise create it. Write the following to `README.md`:

```markdown
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
```

- [ ] **Step 4: Verify directory layout**

```bash
ls -la site studio
```
Expected: each directory exists with just `.gitkeep` inside.

- [ ] **Step 5: Stage and commit (REQUIRES USER APPROVAL)**

```bash
git add site/ studio/ README.md
git status
```

Then prompt the user for approval and commit:
```bash
git commit -m "Scaffold monorepo: add empty /site and /studio dirs

Create empty subproject directories for the in-flight Astro migration.
Legacy Next code at the repo root is untouched and continues to
build/deploy as before.

Refs #52"
```

---

## Task 2 — Scaffold `/studio` Sanity project (#53 part 1)

**Files:**
- Create: `studio/package.json`, `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `studio/tsconfig.json`, `studio/.gitignore`, `studio/.env.development`, `studio/.env.production`, `studio/README.md`
- Delete: `studio/.gitkeep`

- [ ] **Step 1: Scaffold using Sanity v3's `create-sanity` package**

Run from repo root:
```bash
rm studio/.gitkeep
pnpm create sanity@3 --project lu0lnnx1 --dataset development --template clean --output-path studio --visibility public -y
```

If the flags are rejected (newer create-sanity versions changed CLI), fall back to interactive mode:
```bash
pnpm create sanity@3
```
Answer prompts:
- Login: use existing account (project owner's Sanity login)
- Select project: `lu0lnnx1` (whats.se)
- Default dataset config: `development`
- Project output path: `./studio`
- Template: `Clean project with no predefined schema types`
- Use TypeScript: Yes
- Add configuration files: Yes
- Package manager: pnpm

Expected: `studio/` populated with `package.json`, `sanity.config.ts`, `sanity.cli.ts`, `tsconfig.json`, `schemas/`, etc.

- [ ] **Step 2: Pin Sanity to v3 in `studio/package.json`**

Open `studio/package.json` and confirm `"sanity"` is on `^3.x.x`. If the scaffold installed v4 or v5, manually pin it. Edit dependencies:

```json
{
  "dependencies": {
    "sanity": "^3.99.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "styled-components": "^6.1.0"
  }
}
```

Then reinstall:
```bash
cd studio && pnpm install
```

- [ ] **Step 3: Add `studio/README.md`**

```markdown
# whats.se — Sanity Studio

Extracted Sanity v3 Studio for the whats.se site. Runs locally only during this migration iteration; no hosted URL.

## Run locally

```bash
pnpm install
pnpm dev   # opens at http://localhost:3333, connected to the `development` dataset
```

To explicitly target the production dataset (read-mostly spot-checks only — be careful):

```bash
pnpm dev -- --dataset production
```

## Notes

- Project ID is `lu0lnnx1` (hardcoded in `sanity.config.ts`).
- Schemas are copied verbatim from `app/(studio)/schemas/` in the parent repo. Do not edit them here during this iteration.
- Editors continue to use the production `/admin` URL on the live Next site. This standalone Studio is for verification only.
```

- [ ] **Step 4: Add `studio/.env.development` and `studio/.env.production`**

```bash
echo "SANITY_STUDIO_DATASET=development" > studio/.env.development
echo "SANITY_STUDIO_DATASET=production" > studio/.env.production
```

(Sanity reads `SANITY_STUDIO_*` env vars at Studio build time. These files document the conventional values; the actual dataset used at runtime is set by `sanity.config.ts`.)

- [ ] **Step 5: Verify the empty scaffold runs**

```bash
cd studio
pnpm dev
```

Expected: Studio boots on `http://localhost:3333`, says "No document types defined" or similar (because schemas haven't been copied yet). Stop with Ctrl-C.

- [ ] **Step 6: Stage and commit (REQUIRES USER APPROVAL)**

```bash
git add studio/
git status
```

Then prompt user and commit:
```bash
git commit -m "Scaffold standalone Sanity v3 Studio in /studio

Empty scaffold pointing at the existing whats.se project
(lu0lnnx1) with the development dataset as default. Schemas
copied in a follow-up commit.

Refs #53"
```

---

## Task 3 — Copy schemas and verify Studio (#53 part 2)

**Files:**
- Modify: `studio/sanity.config.ts`, `studio/schemas/` (replace with verbatim copy)
- Create: `studio/deskStructure.ts`
- Delete: scaffold's auto-generated `studio/schemaTypes/` (or whatever the scaffold made)

- [ ] **Step 1: Wipe scaffold-generated schemas**

```bash
rm -rf studio/schemaTypes studio/schemas
mkdir studio/schemas
```

- [ ] **Step 2: Copy schemas verbatim from `app/(studio)/schemas/`**

```bash
cp -R "app/(studio)/schemas/." studio/schemas/
```

Verify:
```bash
diff -r "app/(studio)/schemas/" studio/schemas/
```
Expected: no output (identical).

- [ ] **Step 3: Copy `deskStructure.ts`**

```bash
cp "app/(studio)/deskStructure.ts" studio/deskStructure.ts
```

- [ ] **Step 4: Replace `studio/sanity.config.ts` with one matching the legacy `app/(studio)/sanity.config.ts`**

Write the following to `studio/sanity.config.ts`:

```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import schema from './schemas/schema';
import deskStructure from './deskStructure';

const projectId = 'lu0lnnx1';
const dataset = process.env.SANITY_STUDIO_DATASET || 'development';

const singletons = ['settings', 'studio'];

export default defineConfig({
  title: 'what',
  projectId,
  dataset,
  plugins: [structureTool({ structure: deskStructure }), visionTool(), media()],
  schema: {
    types: schema,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (templateItem) => !singletons.includes(templateItem.templateId)
        );
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (singletons.includes(schemaType)) {
        return prev.filter(
          ({ action }) =>
            !['unpublish', 'delete', 'duplicate'].includes(action ?? '')
        );
      }
      return prev;
    },
  },
});
```

(Differences from the legacy config: hardcoded `projectId` instead of `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!`; reads dataset from `SANITY_STUDIO_DATASET` with `development` fallback; no `basePath: '/admin'` since this Studio is standalone.)

- [ ] **Step 5: Install peer dependencies the schemas need**

```bash
cd studio
pnpm add @sanity/vision sanity-plugin-media react-icons yup
```

- [ ] **Step 6: Boot Studio against development dataset**

```bash
pnpm dev
```

Open `http://localhost:3333` in browser. Expected:
- Studio loads without errors
- Sidebar shows: "Inställningar" (settings singleton), "Studio" (studio singleton), divider, then category/employee/project document type lists
- Clicking a document type opens a list (may be empty if development dataset has no content — that's fine)
- Clicking "Inställningar" or "Studio" opens the singleton editor with all the expected fields visible (Swedish labels)

Stop with Ctrl-C.

- [ ] **Step 7: Production dataset spot-check (read-only)**

```bash
pnpm dev -- --dataset production
```

Open `http://localhost:3333` again. Expected:
- Studio loads connected to production
- Clicking "Projekt" shows the real project list (~59 projects)
- Open one project — confirm every field renders, including images, rich-text body with link annotations, and references to categories
- Open "Inställningar" and "Studio" singletons — confirm content matches what's live on production

**DO NOT EDIT ANYTHING.** Close the browser tab when done. Ctrl-C the dev server.

- [ ] **Step 8: Stage and commit (REQUIRES USER APPROVAL)**

```bash
git add studio/
git status
```

Then prompt user and commit:
```bash
git commit -m "Copy schemas verbatim into standalone /studio

Schemas, desk structure, and Sanity config carried over byte-identical
from app/(studio)/. The standalone Studio now boots locally against the
development dataset by default and has been spot-checked against the
production dataset without making edits.

Refs #53"
```

---

## Task 4 — Scaffold `/site` Astro project (#54 part 1)

**Files:**
- Create: `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/src/pages/index.astro` (scaffold default — will be replaced later), `site/public/favicon.svg` (scaffold default), `site/.gitignore`, `site/README.md`
- Delete: `site/.gitkeep`

- [ ] **Step 1: Scaffold Astro project**

```bash
rm site/.gitkeep
pnpm create astro@latest site -- --template minimal --typescript strict --no-install --skip-houston --no-git --add tailwind --yes
```

If flags fail (Astro CLI changes), fall back to interactive:
```bash
pnpm create astro@latest site
```
Answer:
- How would you like to start? → Empty project (or "Minimal" if "Empty" isn't offered)
- Install dependencies? → No (we'll do it explicitly)
- Initialize a git repo? → No (we're inside an existing repo)
- Add typescript? → Yes, strict
- Add integrations? → Add Tailwind

- [ ] **Step 2: Install dependencies**

```bash
cd site
pnpm install
```

- [ ] **Step 3: Configure `site/astro.config.mjs` for static export with output dir matching Cloudflare's current setting**

Write:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  outDir: './out',
  site: 'https://www.whats.se',
  integrations: [tailwind({ applyBaseStyles: false })],
});
```

(`applyBaseStyles: false` because we'll provide our own `global.css` that defines the design tokens. Tailwind's preflight will still apply — we just turn off Astro's auto-injection so we control the order.)

- [ ] **Step 4: Add `site/README.md`**

```markdown
# whats.se — Astro public site

The Astro-based public site, in development. Coexists with the legacy Next.js code at the repo root until cutover.

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
```

- [ ] **Step 5: Verify the scaffold builds**

```bash
pnpm build
```
Expected: `Build Complete!` with one route generated (`out/index.html`). No errors.

- [ ] **Step 6: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/
git status
```

Then prompt user and commit:
```bash
git commit -m "Scaffold Astro project in /site with Tailwind

Empty Astro 5 project configured for static export, outputting to
site/out/ to match Cloudflare Pages' current build settings. Tailwind
installed via the official integration with applyBaseStyles disabled
so we can supply our own design-token stylesheet.

Refs #54"
```

---

## Task 5 — Tailwind v4 design tokens and global styles (#54 part 2)

**Files:**
- Modify: `site/src/styles/global.css` (replace the bare `@import "tailwindcss"` from the scaffold with the full design-token CSS)
- Copy: `public/cursor-point.svg`, `public/cursor-red-point.svg`, `public/favicon.png`, `public/_redirects` → `site/public/`

(No `tailwind.config.ts` — Tailwind v4 uses CSS-first `@theme` config, defined inline in the stylesheet.)

- [ ] **Step 1: Rewrite `site/src/styles/global.css`**

Replace the existing one-line `@import "tailwindcss";` with this complete file. The `@theme` block defines every custom token the legacy `tailwind.config.ts` had, in Tailwind v4 syntax. Each `--color-*`, `--font-*`, `--breakpoint-*`, `--container-*`, etc. auto-generates the corresponding utility classes (`bg-what-white`, `font-what`, `content:` variant, `max-w-screen-content`, etc.).

```css
@import "tailwindcss";

@theme {
  /* Custom design tokens for what! arkitektur — equivalent to the legacy
     tailwind.config.ts extensions. */

  /* Brand colors */
  --color-what-white: #F2EFEB;
  --color-what-red-01: #FF0222;

  /* Custom font families (CSS vars are populated by @fontsource imports
     in Task 7, plus the :root block below as a static fallback). */
  --font-what: 'Montserrat', system-ui, sans-serif;
  --font-what-mono: 'IBM Plex Mono', monospace;

  /* Custom breakpoint + container so `content:` variant works as a media
     query and `max-w-screen-content` works as a max-width utility. */
  --breakpoint-content: 1792px;
  --container-content: 1792px;
}

/* Body baseline (replaces legacy <body className="bg-what-white cursor-dot">) */
body {
  background-color: var(--color-what-white);
  font-family: var(--font-what);
  font-weight: 500;
  cursor: url(/cursor-point.svg) 6.8 6.8, auto;
}

/* Custom cursor utility classes — Tailwind v4 doesn't auto-generate `cursor-*`
   utilities from theme variables for non-standard cursor values (which are
   url() strings, not keyword cursors). Define explicitly. */
.cursor-dot {
  cursor: url(/cursor-point.svg) 6.8 6.8, auto;
}
.cursor-pointer {
  cursor: url(/cursor-red-point.svg) 6.8 6.8, pointer;
}

/* Custom percentage padding utilities used by the project/employee card
   aspect ratios. Tailwind v4 doesn't generate arbitrary-keyed padding
   utilities from theme; explicit. */
.pt-67 {
  padding-top: 67%;
}
.pt-75 {
  padding-top: 75%;
}
.pt-111 {
  padding-top: 111%;
}

/* Custom fixed-pixel height (legacy `height: { 500: '500px' }`). */
.h-500 {
  height: 500px;
}
```

(The custom utility classes for cursor, percent padding, and fixed height are written explicitly because Tailwind v4's auto-generation from `@theme` doesn't cover non-standard token shapes well. Class names are kept identical to the legacy site so component class lists port cleanly.)

- [ ] **Step 3: Copy static public assets**

```bash
cp public/cursor-point.svg public/cursor-red-point.svg public/favicon.png site/public/
cp public/_redirects site/public/
```

- [ ] **Step 4: Edit `site/public/_redirects` to drop the `/admin` rule**

Open `site/public/_redirects`. Replace with:

```
/projekt    /          301
```

(The `/admin/* /admin 301` rule from the legacy file is removed — the Astro `/site` has no Studio at `/admin`.)

- [ ] **Step 5: Verify build still works**

```bash
cd site
pnpm build
ls out/
```
Expected: `out/` contains `index.html` and the copied static files (`cursor-point.svg`, `cursor-red-point.svg`, `favicon.png`, `_redirects`).

- [ ] **Step 6: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/src/styles/global.css site/public/
git status
```

Then prompt and commit:
```bash
git commit -m "Carry over design tokens to Tailwind v4 and static assets

global.css defines @theme variables for the brand colors, fonts,
breakpoint+container, plus explicit utility classes for the legacy
cursor, percent-padding, and fixed-height tokens that Tailwind v4
doesn't auto-generate. Public assets (cursors, favicon) and the
trimmed _redirects (no /admin rule) copied into site/public/.

Refs #54"
```

---

## Task 6 — Port data layer (sanity client, services, types, utils) (#54 part 3)

**Files:**
- Create: `site/src/lib/config.ts`, `site/src/lib/sanityClient.ts`, `site/src/lib/imageBuilder.ts`, `site/src/services/sanity.ts`, `site/src/utils/getSortedArray.ts`, `site/src/types.ts`, `site/.env.development`, `site/.env.production`

- [ ] **Step 1: Install Sanity client packages**

```bash
cd site
pnpm add @sanity/client @sanity/image-url groq
```

- [ ] **Step 2: Create `site/.env.development` and `site/.env.production`**

```bash
cat > .env.development <<EOF
PUBLIC_SANITY_PROJECT_ID=lu0lnnx1
PUBLIC_SANITY_DATASET=development
EOF

cat > .env.production <<EOF
PUBLIC_SANITY_PROJECT_ID=lu0lnnx1
PUBLIC_SANITY_DATASET=production
EOF
```

- [ ] **Step 3: Write `site/src/lib/config.ts`**

```ts
import type { ClientConfig } from '@sanity/client';

const config: ClientConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-07',
  useCdn: false,
};

export default config;
```

- [ ] **Step 4: Write `site/src/lib/sanityClient.ts`**

```ts
import { createClient } from '@sanity/client';
import config from './config';

export const client = createClient(config);
```

- [ ] **Step 5: Write `site/src/lib/imageBuilder.ts`**

```ts
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './sanityClient';

const builder = imageUrlBuilder(client);

export const imageBuilder = (img: SanityImageSource) => builder.image(img);
```

- [ ] **Step 6: Write `site/src/types.ts`**

(Verbatim copy of legacy `src/types.ts`, including the `images?:` optional fix from PR #62.)

```ts
import type { SanityImageAssetDocument } from '@sanity/client';
import type { PortableTextBlock } from '@portabletext/types';

export type Category = {
  path: Path;
  title: string;
  sortedProjects?: Project[];
  _id: string;
};

export type Project = {
  title: string;
  path: Path;
  slug: string;
  subTitle: string;
  mainImage?: SanityImageAssetDocument;
  textBody: PortableTextBlock[];
  description: string;
  images?: { asset: SanityImageAssetDocument }[];
  categories: Category[];
  credits?: string;
  _id: string;
} & ProjectData;

type ProjectData = {
  assignment?: string;
  location?: string;
  clients?: string[];
  size?: string;
  collaborators?: string[];
  year?: string;
  awards?: string[];
};

type Path = {
  current: string;
};

export type Settings = {
  title: string;
  email: string;
  address: string[];
  emailJob: string;
  phone: string;
  featuredProjects?: Project[];
  categoriesOrder: Category[];
  logotype: SanityImageAssetDocument;
};

export type Employee = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  image: SanityImageAssetDocument;
  titles: string;
};

export type Studio = {
  title: string;
  employees: Employee[];
  textContent: string;
  pageContent: PortableTextBlock[];
  images: { asset: SanityImageAssetDocument }[];
};
```

(`DefaultPageProps` from the legacy types is dropped — not needed in Astro since pages don't share a wrapper prop type.)

- [ ] **Step 7: Install Portable Text types**

```bash
pnpm add -D @portabletext/types
```

- [ ] **Step 8: Write `site/src/utils/getSortedArray.ts`**

```ts
const getSortedArray = <T extends { _id: string }>(
  all: T[],
  sorted?: T[]
): T[] => {
  if (!sorted) return all;
  const sortedIds = sorted.map((item) => item._id);
  const allNonSorted = all.filter((item) => !sortedIds.includes(item._id));
  return [...sorted, ...allNonSorted];
};

export default getSortedArray;
```

- [ ] **Step 9: Write `site/src/services/sanity.ts`**

(GROQ queries identical to legacy `src/services/sanity.ts`.)

```ts
import groq from 'groq';
import { client } from '../lib/sanityClient';
import type { Project, Category, Settings, Employee, Studio } from '../types';

const getCategories = async (): Promise<Category[]> => {
  const categories = await client.fetch(groq`*[_type == "category"]`);
  return categories;
};

const getCategory = (slug?: string): Promise<Category> =>
  client.fetch(
    groq`*[_type == "category" && path.current == $slug][0]{..., sortedProjects[]->{..., "mainImage":mainImage.asset->, categories[]->}}`,
    { slug }
  );

const getProjects = (): Promise<Project[]> =>
  client.fetch(
    groq`*[_type == "project"] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`
  );

const getProject = (slug?: string): Promise<Project> =>
  client.fetch(
    groq`*[_type == "project" && path.current == $slug][0]{..., "mainImage":mainImage.asset->, categories[]->, images[]{...,asset->}}`,
    { slug }
  );

const getProjectsByCategory = (category: string): Promise<Project[]> =>
  client.fetch(
    groq`*[_type == "project" && references($category)] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`,
    { category }
  );

const getSettings = (): Promise<Settings> =>
  client.fetch(
    groq`*[_type == "settings"][0]{..., "logotype":logotype.asset->,featuredProjects[]->{..., "mainImage":mainImage.asset->, categories[]->}, categoriesOrder[]->{...}}`
  );

const getEmployees = (): Promise<Employee[]> =>
  client.fetch(
    groq`*[_type == "employee"] | order(name asc) {_id, name, email, phone, titles, "image":image.asset->}`
  );

const getStudio = (): Promise<Studio> =>
  client.fetch(
    groq`*[_type == "studio"][0]{...,"employees":sortedEmployees[]->{_id, name, email, phone, titles, "image":image.asset->}}`
  );

const sanityService = {
  getStudio,
  getCategories,
  getCategory,
  getProjects,
  getProject,
  getProjectsByCategory,
  getSettings,
  getEmployees,
};

export default sanityService;
```

- [ ] **Step 10: Add a temporary debug page to verify the data layer works**

Create `site/src/pages/test.astro`:

```astro
---
import sanity from '../services/sanity';

const settings = await sanity.getSettings();
---

<html>
  <body>
    <h1>Sanity debug</h1>
    <p>Project ID: {import.meta.env.PUBLIC_SANITY_PROJECT_ID}</p>
    <p>Dataset: {import.meta.env.PUBLIC_SANITY_DATASET}</p>
    <pre>{JSON.stringify(settings, null, 2)}</pre>
  </body>
</html>
```

- [ ] **Step 11: Verify the debug page in dev mode**

```bash
pnpm dev
```

Open `http://localhost:4321/test` in browser. Expected: page shows project ID `lu0lnnx1`, dataset `development`, and a JSON blob with the development dataset's `settings` document (may be empty `{}` if dev dataset has no content — that's fine, what matters is no errors).

Try with production dataset to verify GROQ end-to-end:
```bash
PUBLIC_SANITY_DATASET=production pnpm dev
```

Reload `http://localhost:4321/test`. Expected: JSON shows the real settings (title, email, address, featuredProjects array with real titles).

Ctrl-C the dev server.

- [ ] **Step 12: Delete the temporary debug page**

```bash
rm src/pages/test.astro
```

(Don't ship the debug page; we've used it to validate the layer.)

- [ ] **Step 13: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/.env.development site/.env.production site/src/lib site/src/services site/src/types.ts site/src/utils site/package.json site/pnpm-lock.yaml
git status
```

Then prompt and commit:
```bash
git commit -m "Port Sanity data layer to /site

Carry over sanity service, client, types, and getSortedArray utility
unchanged in logic. Replace next-sanity's createClient with
@sanity/client directly. Env vars renamed to PUBLIC_* per Astro
convention. GROQ queries verified end-to-end against both development
and production datasets via a throwaway debug page (not committed).

Refs #54"
```

---

## Task 7 — Set up fonts and base body styles (#54 part 4)

**Files:**
- Modify: `site/src/styles/global.css`
- Install: `@fontsource/montserrat`, `@fontsource/ibm-plex-mono`

- [ ] **Step 1: Install font packages**

```bash
cd site
pnpm add @fontsource/montserrat @fontsource/ibm-plex-mono
```

- [ ] **Step 2: Update `site/src/styles/global.css` to prepend font imports**

The file already exists from Task 5 with `@import "tailwindcss"`, the `@theme` block, body styles, and custom utility classes. **Prepend** the three `@fontsource` imports at the very top of the file (CSS imports must come before any other rules). The complete file after this edit should look like:

```css
@import '@fontsource/montserrat/400.css';
@import '@fontsource/montserrat/500.css';
@import '@fontsource/ibm-plex-mono/400.css';

@import "tailwindcss";

@theme {
  /* Custom design tokens for what! arkitektur — equivalent to the legacy
     tailwind.config.ts extensions. */

  /* Brand colors */
  --color-what-white: #F2EFEB;
  --color-what-red-01: #FF0222;

  /* Custom font families (CSS vars are populated by @fontsource imports
     in Task 7, plus the :root block below as a static fallback). */
  --font-what: 'Montserrat', system-ui, sans-serif;
  --font-what-mono: 'IBM Plex Mono', monospace;

  /* Custom breakpoint + container so `content:` variant works as a media
     query and `max-w-screen-content` works as a max-width utility. */
  --breakpoint-content: 1792px;
  --container-content: 1792px;
}

/* Body baseline (replaces legacy <body className="bg-what-white cursor-dot">) */
body {
  background-color: var(--color-what-white);
  font-family: var(--font-what);
  font-weight: 500;
  cursor: url(/cursor-point.svg) 6.8 6.8, auto;
}

/* Custom cursor utility classes — Tailwind v4 doesn't auto-generate `cursor-*`
   utilities from theme variables for non-standard cursor values (which are
   url() strings, not keyword cursors). Define explicitly. */
.cursor-dot {
  cursor: url(/cursor-point.svg) 6.8 6.8, auto;
}
.cursor-pointer {
  cursor: url(/cursor-red-point.svg) 6.8 6.8, pointer;
}

/* Custom percentage padding utilities used by the project/employee card
   aspect ratios. Tailwind v4 doesn't generate arbitrary-keyed padding
   utilities from theme; explicit. */
.pt-67 {
  padding-top: 67%;
}
.pt-75 {
  padding-top: 75%;
}
.pt-111 {
  padding-top: 111%;
}

/* Custom fixed-pixel height (legacy `height: { 500: '500px' }`). */
.h-500 {
  height: 500px;
}
```

(The `@fontsource` packages ship CSS files that register `@font-face` declarations using the same font names as our `@theme` variables (`'Montserrat'`, `'IBM Plex Mono'`), so no further wiring is needed — once these imports are present, the fonts render correctly via the `--font-what` / `--font-what-mono` tokens.)

- [ ] **Step 3: Verify the global stylesheet imports work**

Temporarily add a test page `site/src/pages/font-test.astro`:

```astro
---
import '../styles/global.css';
---
<html>
  <body>
    <h1 style="font-family: var(--font-montserrat)">Montserrat 500</h1>
    <p style="font-family: var(--font-ibm-plex-mono)">IBM Plex Mono 400</p>
  </body>
</html>
```

Run `pnpm dev`, open `http://localhost:4321/font-test`, confirm in DevTools > Computed that both fonts are loaded (not falling back to system-ui or monospace).

Delete the test page:
```bash
rm src/pages/font-test.astro
```

Ctrl-C.

- [ ] **Step 4: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/package.json site/pnpm-lock.yaml site/src/styles/global.css
git status
```

Then prompt and commit:
```bash
git commit -m "Add self-hosted fonts via @fontsource

Replaces next/font/google. Montserrat 400/500 and IBM Plex Mono 400
loaded via CSS imports; CSS variables remain the source of truth for
Tailwind font-family tokens.

Refs #54"
```

---

## Task 8 — Implement SanityImage.astro (#55)

**Files:**
- Create: `site/src/components/atoms/SanityImage.astro`

The validation gate: this component must produce visual parity with `next/image` + `next-sanity-image` before any further component porting.

- [ ] **Step 1: Write `site/src/components/atoms/SanityImage.astro`**

```astro
---
import { imageBuilder } from '../../lib/imageBuilder';
import type { SanityImageAssetDocument } from '@sanity/client';

interface Props {
  asset: SanityImageAssetDocument;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  class?: string;
}

const {
  asset,
  alt,
  sizes = '100vw',
  priority = false,
  fill = false,
  class: className,
} = Astro.props;

const widths = [320, 640, 960, 1280, 1920, 2560];

const srcSet = widths
  .map(
    (w) =>
      `${imageBuilder(asset).width(w).auto('format').quality(75).url()} ${w}w`
  )
  .join(', ');

const src = imageBuilder(asset).width(1280).auto('format').quality(75).url();
const nativeWidth = asset.metadata?.dimensions?.width;
const nativeHeight = asset.metadata?.dimensions?.height;
const lqip = asset.metadata?.lqip;

const styles: string[] = [];
if (fill) {
  styles.push(
    'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;'
  );
}
if (lqip) {
  styles.push(`background:url(${lqip}) center/cover no-repeat;`);
}
const style = styles.join('') || undefined;
---

<img
  src={src}
  srcset={srcSet}
  sizes={sizes}
  width={nativeWidth}
  height={nativeHeight}
  loading={priority ? 'eager' : 'lazy'}
  decoding="async"
  fetchpriority={priority ? 'high' : 'auto'}
  alt={alt}
  class={className}
  style={style}
/>
```

- [ ] **Step 2: Build a verification page that renders a real Sanity image**

Create `site/src/pages/image-test.astro`:

```astro
---
import sanity from '../services/sanity';
import SanityImage from '../components/atoms/SanityImage.astro';
import '../styles/global.css';

const settings = await sanity.getSettings();
const projects = await sanity.getProjects();
const sample = projects[0]; // first project
---

<html>
  <body class="bg-what-white">
    <main style="max-width: 1280px; margin: 0 auto; padding: 2rem;">
      <h1>Image pipeline verification</h1>
      <h2>Logotype (priority, fill)</h2>
      <div style="position: relative; width: 240px; height: 80px;">
        <SanityImage
          asset={settings.logotype}
          alt="Logotype"
          fill
          priority
          sizes="240px"
          class="object-contain object-bottom"
        />
      </div>
      <h2>Sample project hero (priority)</h2>
      {sample?.mainImage && (
        <SanityImage
          asset={sample.mainImage}
          alt={`Hero for ${sample.title}`}
          sizes="(min-width: 1280px) 1280px, 100vw"
          priority
        />
      )}
      <h2>Below-fold image (lazy)</h2>
      {sample?.mainImage && (
        <SanityImage
          asset={sample.mainImage}
          alt={`Lazy ${sample.title}`}
          sizes="(min-width: 1280px) 1280px, 100vw"
        />
      )}
    </main>
  </body>
</html>
```

- [ ] **Step 3: Verify against production data**

```bash
cd site
PUBLIC_SANITY_DATASET=production pnpm dev
```

Open `http://localhost:4321/image-test`. In DevTools:
- **Elements panel:** Inspect the `<img>` tags. Confirm `srcset` contains 6 URLs, all pointing at `cdn.sanity.io` with `?w=` params. Confirm `width`/`height` attributes are set.
- **Network panel:** Reload with cache disabled and "Slow 3G" throttling. Confirm a low-quality blurred image (the LQIP) is visible as a background while the full image is fetching.
- **First image** has `fetchpriority="high"` and `loading="eager"`. **Last image** has `loading="lazy"`.
- **Format negotiation:** check the Content-Type of one of the loaded images. On a modern browser it should be `image/avif` or `image/webp`.

Resize browser window to mobile (~375px wide) and refresh. Confirm the browser fetches a smaller srcset entry (e.g. the 640w or 320w URL).

- [ ] **Step 4: Lighthouse parity check**

In Chrome DevTools > Lighthouse, run a mobile audit on `http://localhost:4321/image-test`. Note the LCP and CLS scores.

Compare against the current production site (`https://www.whats.se/projekt/<sample-slug>`):
- Open production in a separate window
- Run the same Lighthouse audit
- LCP and CLS on the Astro test page must be **≤** production's values (lower is better for both)

If parity isn't met, halt and reassess before proceeding. Investigate: srcset breakpoints, image quality, missing `fetchpriority`, etc.

- [ ] **Step 5: Delete the verification page**

```bash
rm src/pages/image-test.astro
```

- [ ] **Step 6: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/src/components/atoms/SanityImage.astro
git status
```

Then prompt and commit:
```bash
git commit -m "Implement SanityImage.astro

Plain <img> driven by @sanity/image-url. Renders responsive srcset
across six breakpoints, LQIP placeholder via inline CSS background,
width/height attrs from asset metadata for CLS prevention, and
loading/fetchpriority hints based on a priority prop. Zero JS
shipped per image. Verified against production data and matches
Next baseline on Lighthouse LCP/CLS.

Refs #55"
```

---

## Task 9 — Port atoms with cleanups (#56 part 1)

**Files:**
- Create: `site/src/components/atoms/H1.astro`, `H2.astro`, `Section.astro`, `TextLarge.astro`, `TextMedium.astro`, `TextUppercase.astro`

(`SanityImage.astro` was already done in Task 8.)

- [ ] **Step 1: `site/src/components/atoms/H1.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<h1 class:list={['text-2xl', className]}><slot /></h1>
```

- [ ] **Step 2: `site/src/components/atoms/H2.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<h2 class:list={['text-xl', className]}><slot /></h2>
```

- [ ] **Step 3: `site/src/components/atoms/Section.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<section class:list={['mx-8 sm:mx-16', className]}><slot /></section>
```

- [ ] **Step 4: `site/src/components/atoms/TextLarge.astro`**

(Drops the unused `white` prop from the legacy component.)

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<p class:list={['text-lg', className]}><slot /></p>
```

- [ ] **Step 5: `site/src/components/atoms/TextMedium.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<p class:list={['text-md', className]}><slot /></p>
```

- [ ] **Step 6: `site/src/components/atoms/TextUppercase.astro`**

(Legacy file was internally named `TextMedium` due to copy-paste; the `.astro` file name is the source of truth here so no naming bug.)

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<p class:list={['uppercase tracking-wider text-xs', className]}><slot /></p>
```

- [ ] **Step 7: Verify atoms compile**

```bash
cd site
pnpm build
```
Expected: build succeeds (no actual rendered content yet since no page consumes these — but they must at least parse).

- [ ] **Step 8: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/src/components/atoms/
git status
```

Then prompt and commit:
```bash
git commit -m "Port atom components to .astro

Mechanical port of H1, H2, Section, TextLarge, TextMedium, and
TextUppercase. Drops the unused white prop on TextLarge. The
TextUppercase function-name vs file-name mismatch in the legacy
code is implicitly fixed since the .astro file name is canonical.

Refs #56"
```

---

## Task 10 — Port molecules and organisms (#56 part 2)

**Files:**
- Create: `site/src/components/molecules/EmployeeCard.astro`, `FilterBar.astro`, `ImageGrid.astro`, `ProjectCard.astro`
- Create: `site/src/components/organisms/Footer.astro`, `Header.astro`, `Nav.astro`, `ProjectHeader.astro`, `ProjectInfoBox.astro`, `ProjectsGrid.astro`

Two cleanups folded in: `callto:` → `tel:` (EmployeeCard) and React-state hover → Tailwind `group-hover:` (ProjectCard). One change: `FilterBar` uses `Astro.url.pathname` instead of `useRouter().asPath`.

- [ ] **Step 1: `site/src/components/molecules/EmployeeCard.astro`**

```astro
---
import SanityImage from '../atoms/SanityImage.astro';
import TextMedium from '../atoms/TextMedium.astro';
import type { Employee } from '../../types';

interface Props {
  employee: Employee;
}
const { employee } = Astro.props;
---

<div class="flex flex-col">
  <div class="relative block flex-1 mb-2 pt-111">
    {employee.image && (
      <SanityImage
        class="object-cover object-center"
        asset={employee.image}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        alt={`image of employee ${employee.name}`}
      />
    )}
  </div>
  <TextMedium class="leading-snug text-what-red-01">{employee.name}</TextMedium>
  <TextMedium class="leading-snug">{employee.titles}</TextMedium>
  <TextMedium class="leading-snug">
    <a class="hover:text-what-red-01 cursor-pointer" href={`mailto:${employee.email}`}>
      {employee.email}
    </a>
  </TextMedium>
  <TextMedium class="leading-snug">
    <a class="hover:text-what-red-01 cursor-pointer" href={`tel:${employee.phone}`}>
      {employee.phone}
    </a>
  </TextMedium>
</div>
```

(`callto:` from legacy code → `tel:`.)

- [ ] **Step 2: `site/src/components/molecules/FilterBar.astro`**

```astro
---
import type { Category } from '../../types';

interface Props {
  categories: Category[];
}
const { categories } = Astro.props;
const pathname = Astro.url.pathname;
const onHome = pathname === '/' || pathname === '';
---

<div class="flex flex-row flex-wrap pt-8 gap-x-3 gap-y-2">
  <a
    href="/"
    class:list={[
      'cursor-pointer hover:text-what-red-01 text-base',
      onHome && 'text-what-red-01',
    ]}
  >
    Utvalt
  </a>
  {categories.map((category) => {
    const active = pathname === `/${category.path.current}`;
    return (
      <span>
        <a
          href={`/${category.path.current}`}
          class:list={[
            'cursor-pointer hover:text-what-red-01 text-base',
            active && 'text-what-red-01',
          ]}
        >
          {category.title}
        </a>
      </span>
    );
  })}
</div>
```

- [ ] **Step 3: `site/src/components/molecules/ImageGrid.astro`**

```astro
---
import SanityImage from '../atoms/SanityImage.astro';
import type { SanityImageAssetDocument } from '@sanity/client';

interface Props {
  images: SanityImageAssetDocument[];
}
const { images } = Astro.props;

const isLandscape = (img: SanityImageAssetDocument) =>
  (img.metadata?.dimensions?.height ?? 0) <
  (img.metadata?.dimensions?.width ?? 0);

const portraitImages = images.filter((img) => !isLandscape(img));
const centeredImgId =
  portraitImages.length % 2 === 1
    ? portraitImages[portraitImages.length - 1]?._id
    : undefined;
---

<div class="grid grid-cols-4 grid-flow-row-dense gap-10 items-center justify-center">
  {images.map((img) => (
    <div
      class:list={[
        'col-span-4 h-full flex justify-center items-center',
        !isLandscape(img) && 'md:col-span-2',
        img._id === centeredImgId && 'md:col-start-2',
      ]}
    >
      <SanityImage
        asset={img}
        alt=""
        sizes="(min-width: 1792px) 1792px, 100vw"
      />
    </div>
  ))}
</div>
```

(Legacy code mutated `portraitImages` with `.pop()` to compute `centeredImg`. Astro frontmatter avoids mutation; same result.)

- [ ] **Step 4: `site/src/components/molecules/ProjectCard.astro`**

(Replaces `useState`/`onMouseEnter`/`onMouseLeave` with Tailwind `group/group-hover:`. No JS island.)

```astro
---
import SanityImage from '../atoms/SanityImage.astro';
import type { Project } from '../../types';

interface Props {
  project: Project;
  prio?: boolean;
}
const { project, prio = false } = Astro.props;
const projectPath = `/projekt/${project.path.current}`;
---

<div class="flex flex-col group">
  <a
    href={projectPath}
    class="relative block flex-1 cursor-pointer pt-75"
  >
    {project.mainImage && (
      <SanityImage
        class="object-cover object-center"
        asset={project.mainImage}
        fill
        sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 67vw, 134vw"
        priority={prio}
        alt={`image for project ${project.title}`}
      />
    )}
  </a>
  <a
    href={projectPath}
    class="pt-2 self-start cursor-pointer text-base hover:text-what-red-01 group-hover:text-what-red-01"
  >
    {project.title}
  </a>
</div>
```

- [ ] **Step 5: `site/src/components/organisms/Footer.astro`**

```astro
---
interface Props {
  email: string;
  title: string;
}
const { email, title } = Astro.props;
---

<footer>
  <section class="mx-8 sm:mx-16 flex flex-row justify-between py-12 flex-wrap">
    <a class="md:text-3xl text-2xl hover:text-what-red-01 cursor-pointer" href="/">
      {title}
    </a>
    <a class="md:text-3xl text-2xl hover:text-what-red-01 cursor-pointer" href={`mailto:${email}`}>
      {email}
    </a>
  </section>
</footer>
```

- [ ] **Step 6: `site/src/components/organisms/Nav.astro`**

```astro
---
---
<nav class="flex flex-col lg:flex-row space-x-6 h-full items-end justify-end">
  <p class="md:text-3xl text-2xl hover:text-what-red-01">
    <a href="/" class="cursor-pointer">Projekt</a>
  </p>
  <p class="md:text-3xl text-2xl hover:text-what-red-01">
    <a href="/studio" class="cursor-pointer">Studio</a>
  </p>
</nav>
```

- [ ] **Step 7: `site/src/components/organisms/Header.astro`**

```astro
---
import SanityImage from '../atoms/SanityImage.astro';
import Nav from './Nav.astro';
import type { SanityImageAssetDocument } from '@sanity/client';

interface Props {
  class?: string;
  logotype: SanityImageAssetDocument;
}
const { class: className, logotype } = Astro.props;
---

<header class:list={['pb-8 flex flex-col justify-between', className]}>
  <div class="flex flex-row justify-between items-start w-100 mt-8 mb-6">
    <div class="flex flex-col justify-items-end sm:mr-4 mr-0 pb-1.5 w-60">
      <a href="/" class="cursor-pointer relative block h-20">
        <SanityImage
          fill
          priority
          asset={logotype}
          class="object-contain object-bottom"
          alt="Logotype"
          sizes="240px"
        />
      </a>
    </div>
    <Nav />
  </div>
  <slot name="filterBar" />
</header>
```

(`blur={false}` from legacy code is dropped — the SanityImage component now derives LQIP usage from the presence of `metadata.lqip`. For the logotype, the LQIP shows briefly during load; if that's visually objectionable, add an explicit `noLqip` prop in a follow-up.)

- [ ] **Step 8: `site/src/components/organisms/ProjectInfoBox.astro`**

```astro
---
import TextMedium from '../atoms/TextMedium.astro';
import type { Project } from '../../types';

interface Props {
  project: Project;
}
const { project } = Astro.props;
const { assignment, clients, awards, year, location, size, collaborators } =
  project;

type Row = { title: string; value: string | string[] | undefined };
const rows: Row[] = [
  { title: 'Uppdrag', value: assignment },
  { title: 'Beställare', value: clients },
  { title: 'Samarbetspartners', value: collaborators },
  { title: 'Plats', value: location },
  { title: 'Storlek', value: size },
  { title: 'År', value: year },
  { title: 'Utmärkelser', value: awards },
].filter((r) => r.value !== undefined && r.value !== null) as Row[];
---

<table>
  <tbody>
    {rows.map((row) => (
      <tr>
        <td class="align-top pb-3 pr-4 sm:pr-10 lg:whitespace-nowrap">
          <TextMedium class="font-medium">{row.title}</TextMedium>
        </td>
        {typeof row.value === 'string' ? (
          <td class="align-top pb-3 lg:whitespace-nowrap font-what-mono">
            <TextMedium>{row.value}</TextMedium>
          </td>
        ) : (
          <td class="align-top pb-3 lg:whitespace-nowrap font-what-mono">
            {(row.value as string[]).map((item, i) => (
              <TextMedium>{item}</TextMedium>
            ))}
          </td>
        )}
      </tr>
    ))}
  </tbody>
</table>
```

(The legacy `assignment` field on Project is typed as `string` even though the schema is `string[]`. Project schema: it's an array. I'm preserving the union here since the legacy site handles both branches. If this turns out to be schema/code drift, that's a separate bug to file.)

- [ ] **Step 9: `site/src/components/organisms/ProjectHeader.astro` (interim version, no PortableText yet)**

To keep the build green between Task 10 and Task 11 (astro-portabletext isn't installed until Task 11), the first version of ProjectHeader omits the rich-text rendering and shows a placeholder. Task 11 Step 4 replaces the placeholder with the real `<PortableText />` call.

```astro
---
import SanityImage from '../atoms/SanityImage.astro';
import H1 from '../atoms/H1.astro';
import ProjectInfoBox from './ProjectInfoBox.astro';
import type { Project } from '../../types';

interface Props {
  project: Project;
}
const { project } = Astro.props;
const { title } = project;
const images = project.images ?? [];
const mainImage = images[0]?.asset;
---

<div class="mb-10 lg:mb-20 space-y-10 lg:space-y-20 flex flex-col">
  {mainImage && (
    <div class="w-full flex items-center justify-center">
      <SanityImage
        asset={mainImage}
        alt={`image for project ${title}`}
        sizes="(min-width: 1440px) 1280px, 100vw"
        priority
      />
    </div>
  )}
  <div class="max-w-5xl space-y-6 self-center">
    <H1 class="!text-4xl text-what-red-01">{title}</H1>
    <div class="flex flex-row flex-wrap lg:flex-nowrap justify-between lg:space-y-0 space-y-8 space-x-0 lg:space-x-16">
      <div>
        <!-- TODO Task 11: render textBody via astro-portabletext with projectTextComponents -->
      </div>
      <div>
        <ProjectInfoBox project={project} />
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 10: `site/src/components/organisms/ProjectsGrid.astro`**

```astro
---
import ProjectCard from '../molecules/ProjectCard.astro';
import type { Project } from '../../types';

interface Props {
  projects: Project[];
}
const { projects } = Astro.props;
---

<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-8">
  {projects.map((project, i) => (
    <ProjectCard project={project} prio={i < 3} />
  ))}
</div>
```

- [ ] **Step 11: Verify components compile (build still green)**

```bash
cd site
pnpm build
```
Expected: build succeeds. No pages consume these yet, but they must parse and typecheck.

- [ ] **Step 12: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/src/components/molecules site/src/components/organisms
git status
```

Then prompt and commit:
```bash
git commit -m "Port molecule and organism components to .astro

Mechanical port with three folded-in fixes:
- EmployeeCard: callto: -> tel: for the phone link
- ProjectCard: useState hover replaced with Tailwind group-hover
- FilterBar: useRouter().asPath replaced with Astro.url.pathname

ProjectHeader temporarily uses an empty portableTextComponents stub;
the real serializers arrive in Task 11.

Refs #56"
```

---

## Task 11 — Portable Text serializers and base layout (#56 part 3)

**Files:**
- Create: `site/src/components/portable-text/Highlight.astro`, `Link.astro`, `Block.astro`
- Create: `site/src/lib/portableTextComponents.ts`
- Create: `site/src/layouts/Page.astro`
- Modify: `site/src/components/organisms/ProjectHeader.astro` (swap stub for real import)
- Install: `astro-portabletext`

- [ ] **Step 1: Install `astro-portabletext`**

```bash
cd site
pnpm add astro-portabletext
```

- [ ] **Step 2: Write the three Portable Text component overrides**

`site/src/components/portable-text/Highlight.astro` (the existing decorator):

```astro
---
---
<span class="text-what-red-01"><slot /></span>
```

`site/src/components/portable-text/Link.astro` (the annotation added in PR #60):

```astro
---
interface Props {
  node: { href?: string };
}
const { node } = Astro.props;
const href = node?.href ?? '';
const isExternal = /^https?:\/\//.test(href);
---
<a
  href={href}
  class="underline hover:text-what-red-01 focus:text-what-red-01 cursor-pointer"
  target={isExternal ? '_blank' : undefined}
  rel={isExternal ? 'noopener noreferrer' : undefined}
>
  <slot />
</a>
```

`site/src/components/portable-text/BlockProject.astro` (the block override for project descriptions — small body text):

```astro
---
---
<p class="text-md"><slot /></p>
```

`site/src/components/portable-text/BlockStudio.astro` (the block override for the studio about page — wide large body text):

```astro
---
---
<p class="lg:w-2/3 w-full text-3xl"><slot /></p>
```

(Two separate components instead of one parameterized component, because `astro-portabletext` registers block overrides by reference and doesn't pass through consumer-supplied props.)

- [ ] **Step 3: Write `site/src/lib/portableTextComponents.ts` as the shared component map**

```ts
import type { SomePortableTextComponents } from 'astro-portabletext/types';
import Highlight from '../components/portable-text/Highlight.astro';
import Link from '../components/portable-text/Link.astro';
import BlockProject from '../components/portable-text/BlockProject.astro';
import BlockStudio from '../components/portable-text/BlockStudio.astro';

export const projectTextComponents: SomePortableTextComponents = {
  mark: {
    highlight: Highlight,
    link: Link,
  },
  type: {},
  block: {
    normal: BlockProject,
  },
};

export const studioTextComponents: SomePortableTextComponents = {
  mark: {
    highlight: Highlight,
    link: Link,
  },
  type: {},
  block: {
    normal: BlockStudio,
  },
};
```

If `astro-portabletext` exports a different type name than `SomePortableTextComponents` at install time, inspect `node_modules/astro-portabletext/dist/types/...` for the canonical type and adapt the import. The two exports — `projectTextComponents` and `studioTextComponents` — must remain.

- [ ] **Step 4: Finalize `ProjectHeader.astro` with PortableText**

Replace the interim ProjectHeader from Task 10 step 9 with the full version:

```astro
---
import SanityImage from '../atoms/SanityImage.astro';
import H1 from '../atoms/H1.astro';
import ProjectInfoBox from './ProjectInfoBox.astro';
import { PortableText } from 'astro-portabletext';
import { projectTextComponents } from '../../lib/portableTextComponents';
import type { Project } from '../../types';

interface Props {
  project: Project;
}
const { project } = Astro.props;
const { title, textBody } = project;
const images = project.images ?? [];
const mainImage = images[0]?.asset;
---

<div class="mb-10 lg:mb-20 space-y-10 lg:space-y-20 flex flex-col">
  {mainImage && (
    <div class="w-full flex items-center justify-center">
      <SanityImage
        asset={mainImage}
        alt={`image for project ${title}`}
        sizes="(min-width: 1440px) 1280px, 100vw"
        priority
      />
    </div>
  )}
  <div class="max-w-5xl space-y-6 self-center">
    <H1 class="!text-4xl text-what-red-01">{title}</H1>
    <div class="flex flex-row flex-wrap lg:flex-nowrap justify-between lg:space-y-0 space-y-8 space-x-0 lg:space-x-16">
      <div>
        <PortableText value={textBody} components={projectTextComponents} />
      </div>
      <div>
        <ProjectInfoBox project={project} />
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 5: Write `site/src/layouts/Page.astro` (the layout template)**

```astro
---
import '../styles/global.css';
import Header from '../components/organisms/Header.astro';
import Footer from '../components/organisms/Footer.astro';
import type { Settings } from '../types';

interface Props {
  settings: Settings;
  title?: string;
  class?: string;
  ogImage?: string;
  ogTitle?: string;
}
const {
  settings,
  title = settings?.title ?? 'What! Arkitektur',
  class: className,
  ogImage,
  ogTitle,
} = Astro.props;
---

<!doctype html>
<html lang="sv">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    <meta property="og:url" content="https://www.whats.se" />
    <meta property="og:title" content={ogTitle ?? title} />
    <meta property="og:type" content="website" />
    {ogImage && <meta property="og:image" content={ogImage} />}
  </head>
  <body class="bg-what-white font-what font-medium">
    <div class="w-full min-h-screen flex flex-row justify-center">
      <div class="max-w-screen-content w-full flex flex-col">
        <section class="mx-8 sm:mx-16 flex flex-col flex-1">
          <Header logotype={settings.logotype}>
            <slot name="filterBar" slot="filterBar" />
          </Header>
          <main class:list={['flex flex-col flex-1', className]}>
            <slot />
          </main>
        </section>
        <Footer
          email={settings?.email ?? 'info@whats.se'}
          title="What! Arkitektur"
        />
      </div>
    </div>
  </body>
</html>
```

(Combines the legacy `_app.tsx` (font wrapper, max-width, footer), `_document.tsx`/`app/layout.tsx` (body class, lang), and `templates/Page.tsx` (Header + main + Section) into a single layout. Pages pass `settings` as a prop and content as the default slot, plus an optional filter-bar named slot.)

- [ ] **Step 6: Verify build still works after the stub replacement**

```bash
cd site
pnpm build
```
Expected: success.

- [ ] **Step 7: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/package.json site/pnpm-lock.yaml site/src/components/portable-text site/src/lib/portableTextComponents.ts site/src/layouts site/src/components/organisms/ProjectHeader.astro
git status
```

Then prompt and commit:
```bash
git commit -m "Add Portable Text serializers and base Page layout

Install astro-portabletext, port highlight + link marks and the
custom block override. ProjectHeader swaps the stub for the real
component map.

Page.astro layout consolidates the legacy _app.tsx, _document.tsx /
app/layout.tsx, and templates/Page.tsx into one file with a default
slot for content and a named filterBar slot.

Refs #56"
```

---

## Task 12 — Port all four pages (#56 part 4)

**Files:**
- Create: `site/src/pages/index.astro`, `site/src/pages/[category].astro`, `site/src/pages/projekt/[project].astro`, `site/src/pages/studio.astro`
- Overwrite: the scaffold's default `site/src/pages/index.astro` from Task 4

- [ ] **Step 1: `site/src/pages/index.astro`**

```astro
---
import Page from '../layouts/Page.astro';
import FilterBar from '../components/molecules/FilterBar.astro';
import ProjectsGrid from '../components/organisms/ProjectsGrid.astro';
import sanity from '../services/sanity';

const settings = await sanity.getSettings();
---

<Page settings={settings} title={settings.title} class="pb-8">
  <FilterBar slot="filterBar" categories={settings.categoriesOrder ?? []} />
  <ProjectsGrid projects={settings.featuredProjects ?? []} />
</Page>
```

- [ ] **Step 2: `site/src/pages/[category].astro`**

```astro
---
import Page from '../layouts/Page.astro';
import FilterBar from '../components/molecules/FilterBar.astro';
import ProjectsGrid from '../components/organisms/ProjectsGrid.astro';
import sanity from '../services/sanity';
import getSortedArray from '../utils/getSortedArray';
import type { Project } from '../types';

export async function getStaticPaths() {
  const settings = await sanity.getSettings();
  return settings.categoriesOrder.map((category) => ({
    params: { category: category.path.current },
    props: { categoryId: category._id, categorySlug: category.path.current },
  }));
}

const { categoryId, categorySlug } = Astro.props;

const [settings, category, allProjects] = await Promise.all([
  sanity.getSettings(),
  sanity.getCategory(categorySlug),
  sanity.getProjectsByCategory(categoryId),
]);

if (!category) {
  return Astro.redirect('/404');
}

const projects = getSortedArray<Project>(allProjects, category.sortedProjects);
---

<Page settings={settings} title={settings.title}>
  <FilterBar slot="filterBar" categories={settings.categoriesOrder} />
  <ProjectsGrid projects={projects} />
</Page>
```

(Astro's `getStaticPaths` returns `[{ params, props }]` — `props` flows directly into `Astro.props` on the page. No `fallback: false` equivalent needed; static export uses only the paths returned here.)

- [ ] **Step 3: `site/src/pages/projekt/[project].astro`**

```astro
---
import Page from '../../layouts/Page.astro';
import ProjectHeader from '../../components/organisms/ProjectHeader.astro';
import ImageGrid from '../../components/molecules/ImageGrid.astro';
import { imageBuilder } from '../../lib/imageBuilder';
import sanity from '../../services/sanity';
import type { Project } from '../../types';

export async function getStaticPaths() {
  const projects = await sanity.getProjects();
  return projects.map((project) => ({
    params: { project: project.path.current },
  }));
}

const { project: projectSlug } = Astro.params;

const [project, settings] = await Promise.all([
  sanity.getProject(projectSlug),
  sanity.getSettings(),
]);

const allImages = project.images ?? [];
const gridImages = allImages.slice(1).map((obj) => obj.asset);
const ogImageSrc = project.mainImage
  ? imageBuilder(project.mainImage).width(1200).height(630).url()
  : undefined;
---

<Page
  settings={settings}
  title={project.title}
  class="items-center"
  ogImage={ogImageSrc}
  ogTitle={project.title}
>
  <article class="w-full max-w-7xl flex flex-col">
    <ProjectHeader project={project} />
    <ImageGrid images={gridImages} />
    <div class="flex flex-col-reverse items-start sm:flex-row justify-between mt-8">
      <a
        href="/"
        class="underline hover:text-what-red-01 cursor-pointer"
        onclick="event.preventDefault(); if (window.history.length > 1) { window.history.back(); } else { window.location.href = '/'; }"
      >
        tillbaka
      </a>
      <p>{project.credits}</p>
    </div>
  </article>
</Page>
```

(The "tillbaka" anchor combines `history.back()` with a `/` fallback for direct landings — the codebase-review.md improvement. The `onclick` does the history check; the `href="/"` is the JS-disabled fallback that takes the user home.)

- [ ] **Step 4: `site/src/pages/studio.astro`**

```astro
---
import Page from '../layouts/Page.astro';
import EmployeeCard from '../components/molecules/EmployeeCard.astro';
import TextMedium from '../components/atoms/TextMedium.astro';
import { PortableText } from 'astro-portabletext';
import { studioTextComponents } from '../lib/portableTextComponents';
import sanity from '../services/sanity';
import getSortedArray from '../utils/getSortedArray';
import type { Employee } from '../types';

const socials: { title: string; link: string }[] = [
  { title: 'Instagram', link: 'https://www.instagram.com/whatarkitektur/' },
  { title: 'LinkedIn', link: 'https://se.linkedin.com/company/whatarkitektur' },
  { title: 'Facebook', link: 'https://www.facebook.com/whatark/' },
];

const [allEmployees, studio, settings] = await Promise.all([
  sanity.getEmployees(),
  sanity.getStudio(),
  sanity.getSettings(),
]);
const employees = getSortedArray<Employee>(allEmployees, studio.employees);
---

<Page settings={settings} class="pb-8">
  <div class="flex flex-col items-start">
    <PortableText value={studio.pageContent} components={studioTextComponents} />
    <div class="flex flex-row mt-10 w-full">
      <TextMedium class="font-medium w-32">Telefon</TextMedium>
      <TextMedium class="flex-1 font-what-mono">
        <a class="hover:text-what-red-01 cursor-pointer" href={`tel:${settings.phone}`}>
          {settings.phone}
        </a>
      </TextMedium>
    </div>
    <div class="flex flex-row mt-4 w-full">
      <TextMedium class="font-medium w-32">Mail</TextMedium>
      <TextMedium class="flex-1 font-what-mono">
        <a class="hover:text-what-red-01 cursor-pointer" href={`mailto:${settings.email}`}>
          {settings.email}
        </a>
      </TextMedium>
    </div>
    <div class="flex flex-row mt-4 w-full">
      <TextMedium class="font-medium w-32">Address</TextMedium>
      <TextMedium class="flex flex-col flex-1 font-what-mono">
        {settings.address.map((line) => <span>{line}</span>)}
      </TextMedium>
    </div>
    <div class="flex flex-row mt-4 w-full">
      <TextMedium class="font-medium w-32">Jobb</TextMedium>
      <TextMedium class="flex-1 font-what-mono">
        Skicka CV & portfolio till{' '}
        <a class="hover:text-what-red-01 cursor-pointer" href={`mailto:${settings.emailJob}`}>
          {settings.emailJob}
        </a>
      </TextMedium>
    </div>
    <div class="flex flex-row mt-4 w-full">
      <TextMedium class="font-medium w-32">Socialt</TextMedium>
      <TextMedium class="flex flex-col flex-1 font-what-mono">
        {socials.map((social) => (
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={social.link}
              class="hover:text-what-red-01 cursor-pointer"
            >
              {social.title}
            </a>
          </span>
        ))}
      </TextMedium>
    </div>
  </div>
  <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {employees.map((employee) => <EmployeeCard employee={employee} />)}
  </div>
</Page>
```

(`callto:` → `tel:` here as well.)

- [ ] **Step 5: Full build with production dataset**

```bash
cd site
PUBLIC_SANITY_DATASET=production pnpm build
```
Expected: build succeeds. Output shows ~59 project pages built under `out/projekt/<slug>/index.html`, plus category pages, plus root and studio.

- [ ] **Step 6: Boot the dev server and smoke-test**

```bash
PUBLIC_SANITY_DATASET=production pnpm dev
```

In browser, with the legacy site open in another tab (`http://localhost:3000` if running, or production URL `https://www.whats.se`):

- `http://localhost:4321/` — featured projects render in a grid identical to production
- `http://localhost:4321/bostad` — category filter highlights "bostad", projects render
- `http://localhost:4321/projekt/<a-real-slug>` — hero image, rich-text body (with Portable Text marks if any), info box, image grid, "tillbaka" link
- `http://localhost:4321/studio` — about/contact page renders, employee grid renders, all contact info correct

Click around. Verify hover states on project cards (red text on hover via group-hover), filter bar active state on category pages.

Ctrl-C the dev server.

- [ ] **Step 7: Stage and commit (REQUIRES USER APPROVAL)**

```bash
cd ..
git add site/src/pages
git status
```

Then prompt and commit:
```bash
git commit -m "Port all four public pages to .astro

Index, [category], projekt/[project], and studio (the public
about/contact page, not the Sanity Studio). Replaces useRouter with
Astro.url.pathname and getStaticProps with frontmatter awaits.
The 'tillbaka' button gains a / fallback for direct landings.
All callto: phone links become tel:.

Refs #56"
```

---

## Task 13 — Final verification and preview-deploy commit

**Files:**
- Possibly modify: `site/src/components/molecules/ImageGrid.astro`, other components if visual diff turns up regressions

The definition of done from the spec.

- [ ] **Step 1: Production-dataset build**

```bash
cd site
PUBLIC_SANITY_DATASET=production pnpm build
```
Expected: build succeeds, `out/` contains every route. Page counts roughly match the legacy build (4 top-level routes + ~5 category pages + ~59 project pages).

- [ ] **Step 2: Serve the build locally and smoke-test**

```bash
pnpm dlx serve out
```

In browser, navigate to the served URL (typically `http://localhost:3000`):
- `/` renders
- A category page renders (try each of the categories)
- A few project pages render — pick ones with varied content (one with rich text body, one with an image grid, one with awards, ideally one that's text-only to verify the text-only fix)
- `/studio` (the about page) renders

Ctrl-C the static server.

- [ ] **Step 3: View-source verification**

`curl http://localhost:3000/` after restarting `pnpm dlx serve out`, or use the browser's view-source.

Check:
- No `<script>` tags from Astro (other than potentially the inline `onclick` on the tillbaka button) — confirm zero React bundle, zero client hydration
- All `srcset` URLs point at `cdn.sanity.io`
- `<html lang="sv">` is set
- `<title>` is the settings title

- [ ] **Step 4: Side-by-side parity check against current production**

Open `https://www.whats.se` and the local Astro build side-by-side at desktop (1440px viewport) and mobile (375px viewport). Walk through:
- `/` — featured projects grid
- `/bostad`, `/landskap`, `/ombyggnad` — category filters
- 4–5 project deep links covering content variety
- `/studio`

Note any visible regressions in a scratch document. Document acceptable small adjustments per the spec's parity bar B (visually identical, small adjustments allowed where reproduction is hard). Fix obvious bugs by editing the component file (most likely targets: ProjectHeader spacing, ImageGrid centering edge cases, Header logo aspect).

- [ ] **Step 5: Lighthouse parity check**

Mobile Lighthouse audit on three pages:
- Local Astro `/` vs production `https://www.whats.se/`
- Local Astro `/bostad` vs production `https://www.whats.se/bostad`
- Local Astro `/projekt/<pick-one>` vs production equivalent

Performance, Accessibility, Best Practices, SEO. Astro must match or beat production on each metric. If a metric regresses materially (>5 points), investigate.

- [ ] **Step 6: Portable Text link rendering check**

If any project's `textBody` in production has a `link` annotation (the feature from PR #60), navigate to that project on the local Astro build. Verify:
- The link renders with `underline` + red on hover
- External link (`http://...`) opens in a new tab with `noopener noreferrer`
- Internal/`mailto:`/`tel:`/relative link stays in the same tab

If no project currently has a link in body content, ask the user to add one to a test project on the development dataset, then point `/site` at development and verify.

- [ ] **Step 7: Text-only project rendering check**

Identify or temporarily configure a project with no images in the development dataset. Switch `/site` to development:
```bash
PUBLIC_SANITY_DATASET=development pnpm build
pnpm dlx serve out
```

Navigate to the text-only project. Verify:
- Page renders without crashing
- No hero image (the `{mainImage && ...}` guard skips it)
- View-source: no `<meta property="og:image">` tag emitted
- Image grid section is absent or empty

- [ ] **Step 8: Final fix-up commit (REQUIRES USER APPROVAL)**

If steps 4–7 surfaced any fixes, stage them:
```bash
cd ..
git add site/src/components site/src/pages site/src/layouts
git status
```

Then prompt and commit:
```bash
git commit -m "Visual parity adjustments after side-by-side verification

[Summarize specific tweaks if any.]

Refs #56"
```

If no fixes were needed, skip this commit.

- [ ] **Step 9: Push the branch for Cloudflare Pages preview deploy (REQUIRES USER APPROVAL)**

Push:
```bash
git push -u origin astro-rewrite
```

After push, the user will set up a *new* Cloudflare Pages project pointing at this branch with:
- Production branch: leave at default (Cloudflare Pages auto-deploys all branches)
- Root directory: `site`
- Build command: `pnpm run build`
- Output directory: `out`
- Environment variables: `PUBLIC_SANITY_PROJECT_ID=lu0lnnx1`, `PUBLIC_SANITY_DATASET=production`
- Node version: `22`

(Setup is manual via the Cloudflare dashboard; this plan does not automate dashboard configuration.)

- [ ] **Step 10: Verify the preview deploy**

Once Cloudflare reports the deploy is live, open the preview URL (typically `<branch>.<project>.pages.dev` or similar).

Re-run steps 4–7 against the preview URL. Confirm:
- All routes render
- Visual parity holds in the real CDN environment
- Lighthouse on the deployed site matches local
- Image srcset still hits cdn.sanity.io
- `X-Robots-Tag: noindex` is present on the response headers (Cloudflare Pages preview defaults; verify with `curl -I <preview-url>`)

If anything regresses between local and preview, investigate the difference (CDN caching, environment variables, build output differences).

- [ ] **Step 11: Update the spec doc with deployment URL**

Once verified, edit `docs/superpowers/specs/2026-05-08-astro-migration-iteration-1-design.md` to add a "Deployment" section near the top recording the preview URL. Commit (REQUIRES USER APPROVAL):

```bash
git add docs/superpowers/specs/2026-05-08-astro-migration-iteration-1-design.md
```

```bash
git commit -m "Record preview deploy URL in iteration-1 spec"
```

Then push the commit.

---

## End-of-iteration definition of done (echoed from spec)

- [ ] `cd site && pnpm run build` clean, ~63+ pages generated (`/`, `/studio`, ~5 categories, ~59 projects)
- [ ] `/studio` boots locally on development dataset; production spot-checked without edits
- [ ] Preview Cloudflare Pages project is live and renders all routes
- [ ] Visual parity confirmed on every route at desktop + mobile
- [ ] Lighthouse matches or beats current production
- [ ] Portable Text link rendering verified
- [ ] Text-only project rendering verified (no crash, no `og:image` tag)
- [ ] No React bundle shipped to the public site (`window.React === undefined`)
- [ ] Iteration scope (#52, #53, #54, #55, #56) complete; cutover (#57) deliberately deferred
