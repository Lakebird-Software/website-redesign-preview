import { defineConfig } from 'astro/config';

// GitHub Pages project site for the Lakebird redesign preview repository.
export default defineConfig({
  site: 'https://lakebird-software.github.io',
  base: '/website-redesign-preview',
  output: 'static',
  build: {
    assets: '_assets',
  },
});
