# whats.se — Sanity Studio

Extracted Sanity v6 Studio for the whats.se site. Runs locally only during this migration iteration; no hosted URL.

## Run locally

```bash
pnpm install
pnpm dev   # opens at http://localhost:3333, connected to the `development` dataset
```

To explicitly target the production dataset (read-mostly spot-checks only — be careful):

```bash
SANITY_STUDIO_DATASET=production pnpm dev
```

## Notes

- Project ID is `lu0lnnx1` (hardcoded in `sanity.config.ts`).
- `schemas/` is identical to `app/(studio)/schemas/`, which the live Next site's `/admin` Studio uses. Until the Next site is retired, make any schema change in both copies in the same commit.
- `pnpm typegen` extracts the schema to `schema.json` and generates `../site/src/sanity.types.ts` from the site's GROQ queries.
- Editors continue to use the production `/admin` URL on the live Next site. This standalone Studio is for verification only.
