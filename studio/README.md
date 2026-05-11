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
