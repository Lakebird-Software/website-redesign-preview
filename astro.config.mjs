import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages project site for the Lakebird redesign preview repository.
export default defineConfig({
  site: 'https://lakebird-software.github.io',
  base: '/website-redesign-preview',
  integrations: [react()],
  output: 'static',
  build: {
    assets: '_assets',
  },
});
