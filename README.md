# Lakebird Software — Homepage Preview V2.2

Preview URL: https://lakebird-software.github.io/website-redesign-preview/

This project is for the preview repository only. It does not modify the production repository `Lakebird-Software/Lakebird-Software.github.io`.

## V2.2 scope

- Separate horizontal, perspective-based 3D ocean terrain in the Hero.
- Separate React Bits Classic ambient particle system for the non-Hero sections, using the supplied component source and Lakebird colour palette.
- Ambient particles use one shared transparent layer; existing section background colours are retained.
- The section navigator, app showcases, closing section and footer follow the approved Lakebird homepage design.
- Responsive device placeholders and screenshot frames preserve portrait proportions on mobile; uploaded screenshots use `object-fit: contain` by default.
- Dark is the default theme with an optional light theme.
- Website privacy page and separate temporary app-policy routes are included.

## Preview deployment

- GitHub Pages project base: `/website-redesign-preview`
- Build command: `npm run build`
- Output directory: `dist`
- Use Node.js 24 in GitHub Actions.
- Keep the preview repository's existing `.github/workflows/deploy.yml` when uploading this update. The ZIP intentionally excludes `.github`.

See `UPDATE-IN-CHROME.md` for the browser upload steps and `DEPLOYMENT-GUIDE.md` for deployment notes.

## Add your original assets later

Place your original files in:

- `public/images/brand/`
- `public/images/finly/`
- `public/images/gps-camera/`
- `public/images/filtra/`

See `public/images/README.md` for suggested names and usage. Use `ResponsiveScreenshot.astro` for image frames. Do not stretch screenshots; use `kind="phone"` for portrait app screens, and reserve `kind="photo"` for photographs that are intentionally cropped.

## Local preview

Requires Node.js >=22.23.4 (Node 24 recommended).

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Privacy note

`/privacy/` contains the Lakebird Software website privacy policy draft. The individual app privacy routes remain clearly identified placeholders until the approved app-specific policy text is inserted. Review the website policy before any production launch, especially if hosting, fonts, analytics, embedded services or contact practices change.
