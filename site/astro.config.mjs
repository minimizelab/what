// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  outDir: './out',
  site: 'https://www.whats.se',
  vite: {
    plugins: [tailwindcss()],
  },
});
