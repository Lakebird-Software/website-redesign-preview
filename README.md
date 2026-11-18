# Lakebird Software — Website Redesign Preview

This is the **preview** version of the Lakebird Software website. It is configured for the GitHub Pages project URL:

`https://lakebird-software.github.io/website-redesign-preview/`

The original production repository (`Lakebird-Software.github.io`) is separate and is not changed by this project.

## Included

- Astro static website with responsive homepage
- Midnight Aurora visual system, dark default and optional light theme
- GSAP motion and Three.js hero particle field
- Finly, GPS Camera and Filtra overview sections
- Temporary app routes and clearly labelled privacy-policy placeholders
- GitHub Actions workflow for automatic GitHub Pages deployment

## Upload this project to the preview repository

1. Download and extract the ZIP.
2. Open `https://github.com/Lakebird-Software/website-redesign-preview`.
3. Upload the **contents** of the extracted folder to the repository root. Do not upload the enclosing folder as a nested folder.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
6. Open the **Actions** tab and confirm that `Deploy Lakebird Software to GitHub Pages` completes successfully.
7. Visit `https://lakebird-software.github.io/website-redesign-preview/`.

The workflow uses Node 24 and installs/builds the Astro project on GitHub-hosted runners. A local Node installation is not required just to deploy.

## Important preview settings

- `astro.config.mjs` is configured with `base: '/website-redesign-preview'`. Keep this setting while the site lives in this repository.
- All internal navigation links and canonical/social image paths are base-aware.
- All pages currently use `noindex,nofollow` so this public preview is not intentionally indexed by search engines. Remove/change this setting when preparing the production website.
- Do not copy this preview configuration unchanged into the production `Lakebird-Software.github.io` repository. The production site is at the domain root and needs `base` removed.

## Before launch

1. Replace the temporary brand mark with the official Lakebird logo.
2. Replace illustrative app screens with actual screenshots and app icons.
3. Confirm the GPS Camera direct Google Play listing URL.
4. Design the three full product pages.
5. Replace privacy placeholders with the exact approved policies. The current placeholders are **not legal privacy policies**.
6. Confirm the support email address.
7. Test mobile navigation, theme switching, all links, touch behaviour and reduced-motion mode.

## Run locally (optional)

Install Node.js 24, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:4321/website-redesign-preview/` if using Astro's configured base path in the local preview; if your dev server serves at root, use the URL Astro prints in the terminal.

Create and preview a production build with:

```bash
npm run build
npm run preview
```
