# Lakebird Software — Homepage Preview V2.2.1

Preview URL: https://lakebird-software.github.io/website-redesign-preview/

This project is for the preview repository only. It does not modify the production repository `Lakebird-Software/Lakebird-Software.github.io`.

## V2.2.1 refinements

- Hero-only horizontal perspective ocean terrain based on the supplied Canvas projection reference.
- Broad, visible, slow click/touch ripples with pointer-to-world coordinate mapping.
- Separate React Bits Classic ambient particles for sections after the Hero and before the Footer; the supplied `Particles.jsx` component source is preserved unchanged.
- Ambient particles are clipped out of the Hero until it has fully left the viewport, and clipped at the Footer's top edge.
- Finly-inspired particle palette retained; original section background colours remain unchanged.
- Updated footer wordmark: content-container alignment, increased letter and word spacing, animated left-to-right shine, and a single desktop copyright/tagline/back-to-top row.
- Responsive app placeholder screens scale uniformly; uploaded screenshots preserve their intrinsic aspect ratios and use `object-fit: contain`.
- Separate brand-closing section, clean Studio and Contact backgrounds, dark/light themes, app routes, and privacy routes retained.

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
