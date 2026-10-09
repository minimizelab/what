// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  outDir: './out',
  site: 'https://www.whats.se',
  // Matches the legacy Next export (`bostad.html`), which Cloudflare Pages
  // serves at `/bostad` without redirecting to a trailing slash.
  build: { format: 'file' },
  trailingSlash: 'never',
  env: {
    schema: {
      PUBLIC_SANITY_PROJECT_ID: envField.string({
        context: 'server',
        access: 'public',
      }),
      PUBLIC_SANITY_DATASET: envField.enum({
        context: 'server',
        access: 'public',
        values: ['production', 'development'],
      }),
    },
  },
  // Same Google Fonts files and subsets as the legacy next/font setup.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-ibm-plex-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
