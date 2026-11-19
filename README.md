# Lakebird Software — Website Redesign Preview (Version 2.0)

Preview website: `https://lakebird-software.github.io/website-redesign-preview/`

This repository is separate from the production site (`Lakebird-Software.github.io`). Uploading this project does not change the production website.

## Version 2.0 additions

- Finly-inspired Lakebird website palette: Deep Space Blue, Blue-Green, Sky Blue, Amber Flame and Princeton Orange.
- Optional light appearance based on Filtra's Clarity Pro colours; dark remains the default.
- Three.js ocean-like particle terrain with pointer movement, click/touch ripples and scroll-driven wave motion.
- Right-edge Living Section Navigator with section icons, active marker movement and section tooltips.
- Restrained 3D spotlight/tilt effects for application cards on fine-pointer devices.
- Animated footer lighting and ambient particles.
- Official Google Play download badge artwork linked to the published app destinations.
- Dedicated Lakebird Software website privacy policy at `/privacy/`.
- Individual app policy routes remain placeholders until each app's approved policy text is supplied.
- Dynamic app and app-privacy routes use function-scoped `getStaticPaths()` definitions.

## Publish with GitHub Pages

1. Extract the ZIP.
2. Upload the **contents** of the extracted folder to the root of `Lakebird-Software/website-redesign-preview`.
3. Commit to `main`.
4. In **Settings → Pages**, choose **GitHub Actions** as the source.
5. Check the Actions tab for a green Build and Deploy run.

The workflow uses Node 24, `npm install` and `npm run build`, then deploys the `dist` directory.

## Preview path

`astro.config.mjs` intentionally uses `base: '/website-redesign-preview'`. Do not remove this while deploying to this repository. The production repository is hosted at the domain root and will need a separate production configuration.

All pages include `noindex,nofollow` while this is a public review preview. Change the robots metadata and sitemap strategy before production launch.

## Images you can replace later

Put original files in these folders:

- `public/images/brand/`
- `public/images/finly/`
- `public/images/gps-camera/`
- `public/images/filtra/`

Current app screen artwork is illustrative and is clearly labelled as a placeholder. Replace it with actual screenshots after you upload them. Keep filenames referenced by the relevant components or update the components to match your filenames.

## Google Play badge

The site uses Google's official English “Get it on Google Play” badge image from Google's badge asset endpoint, without recolouring or cropping it. Google's guidance says to use the badge to link to downloads, keep it legible, and not alter its appearance. The badge is kept above the recommended 28px minimum digital height. See [Google Play badge guidance](https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/).

## Website privacy policy

The company website policy is at `/privacy/`. It covers this website and its contact links, not the internal operation of the Android apps. The FINLY, GPS Camera and Filtra policy routes are intentionally still placeholders; replace them with the approved app-specific policies before using those URLs in Play Console.

The website policy describes current implementation details including GitHub Pages hosting, Google Fonts requests, local theme preference storage, and email contact. Re-check it whenever the site adds analytics, cookies, forms, embeds, or other third-party services.

## Local preview (optional)

Use Node.js 24:

```bash
npm install
npm run dev
```

Open the local URL printed by Astro. For production build validation:

```bash
npm run build
npm run preview
```
