// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  outDir: './out',
  site: 'https://www.whats.se',
  // Matches the legacy Next export (`bostad.html`), which Cloudflare Pages
  // serves at `/bostad` without redirecting to a trailing slash.
  build: { format: 'file' },
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
});
