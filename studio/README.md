# whats.se — Sanity Studio

Sanity v6 Studio for the whats.se site, hosted at https://whats.sanity.studio. Deploy with `pnpm deploy`, which builds against the `production` dataset.

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
- `pnpm typegen` extracts the schema to `schema.json` and generates `../site/src/sanity.types.ts` from the site's GROQ queries.
- `/admin` on the public site redirects here.
