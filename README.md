# Lakebird Software — Homepage Preview V2.3

Preview URL: https://lakebird-software.github.io/website-redesign-preview/

This project is for the preview repository only. It does not modify the production repository `Lakebird-Software/Lakebird-Software.github.io`.

## V2.3 refinements

- React Bits Classic now begins at the exact visible top edge of THE STUDIO and feathers in below the Hero/Studio divider. It is clipped before the Footer and never appears over the Hero or Footer. The supplied `Particles.jsx` component source and animation settings are retained.
- Removed the Hero's 01–07 counter and restructured the portfolio proof row to prevent the three app-initial circles and product-count/status text from overlapping.
- Expanded the START A CONVERSATION headline across the available panel width, with the approved two-line wording.
- Added the Uiverse ridge-border cutout-and-glow interaction to the brand-closing “Explore our applications” link, with separate dark/light colours.
- Recreated the supplied Uiverse product Explore animation for Finly and GPS Camera: 700ms circular fill, 45-degree to 90-degree arrow rotation, and product-specific colours.
- Increased product-card paragraph, feature-list and CTA text sizes while preserving responsive card layouts.
- Rebuilt the Google Play badge using the supplied multicolour Play mark and two-line “GET IT ON / Google Play” treatment. Published-app badges retain their app destinations; the footer badge links to the Lakebird Software developer profile.
- Removed the decorative bird symbol from the header/footer brand mark and slightly increased the typographic wordmark size.
- Footer background wordmark remains aligned to the content container, now sits closer to the footer columns, and uses a slower, brighter shine. The footer copyright, centred tagline and Back-to-top remain in one desktop row.
- Existing dark/light theme support, mobile card structure, Hero ocean terrain, screenshot proportions, section navigation and product/privacy routes remain in place.

## Preview deployment

- GitHub Pages project base: `/website-redesign-preview`
- Build command: `npm run build`
- Output directory: `dist`
- Use Node.js 24 in GitHub Actions.
- Keep the preview repository's existing `.github/workflows/deploy.yml` when uploading this update. The ZIP intentionally excludes `.github`.

See `UPDATE-IN-CHROME.md` for browser upload steps and `DEPLOYMENT-GUIDE.md` for deployment notes.

## Add original assets later

Place original assets in `public/images/brand/`, `public/images/finly/`, `public/images/gps-camera/`, and `public/images/filtra/`. See `public/images/README.md` for suggested names. Use `ResponsiveScreenshot.astro` for image frames. Phone screenshots use a portrait frame and `object-fit: contain`; use `kind="photo"` only for photographs intended to crop.

## Local preview

Requires Node.js >=22.23.4 (Node 24 recommended).

```bash
npm install
npm run dev
```

Production build: `npm run build`.

## Privacy note

`/privacy/` contains the Lakebird Software website privacy policy draft. Individual app-policy routes remain clearly identified placeholders until approved app-specific policies are inserted. Review the website policy before a production launch, especially if hosting, fonts, analytics, embedded services or contact practices change.
