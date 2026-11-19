# Lakebird Software — Homepage Preview (Version 2.1.1)

Preview website: https://lakebird-software.github.io/website-redesign-preview/

This is the preview repository only. The production repository `Lakebird-Software/Lakebird-Software.github.io` is not changed by this package.

## Version 2.1.1 refinements

- Full-bleed ocean particle terrain spanning the Hero and Studio introduction, with a soft lower fade so no square canvas edge is visible.
- Pointer and click/tap ripple mapping uses normalized canvas coordinates in the shader, locking the response to the exact visible cursor position across aspect ratios.
- Denser, evenly distributed particles with slow, low-frequency ocean movement and one broad, slow click/tap ripple with a soft trailing trough (no rapid multi-ring effect).
- Scroll progress influences the terrain drift while ordinary browser scrolling remains natural.
- Mobile-adaptive particle density and renderer resolution; touch taps create ripples without treating a scroll gesture as a click.
- Minimal right-edge section navigator: icon-only markers, a thin centre track, moving illuminated active marker, no numbers or capsule border, theme-aware visibility.
- Dark-theme large accent headings use a cyan-to-indigo text gradient; white text remains white. Light-theme headings retain solid accessible colours.
- Section overlines no longer display the requested numbering.
- Contact copy updated to the approved friendly wording; the support email remains the only contact channel.
- Brand statement moved into its own animated closing section above the footer.
- Footer is now a separate deep-navy section with ambient lighting and larger links.
- Existing app-specific identities, Google Play badges, app and website privacy links remain in place.

## Important upload note

Keep the existing working `.github` directory in your GitHub repository. This update package intentionally excludes `.github` so it cannot overwrite your current deployment workflow.

Upload the **contents** of the extracted `project` folder to the root of `Lakebird-Software/website-redesign-preview`, replacing the old website files but preserving `.github`.

Do not upload the enclosing `project` folder as a nested directory.

## GitHub Pages preview configuration

- Astro `base`: `/website-redesign-preview`
- Node.js: use Node 24 in the existing workflow.
- Build command: `npm run build`
- Output directory: `dist`
- Pages source: GitHub Actions

After committing to `main`, confirm that both the build and deploy jobs pass in the Actions tab.

## Assets you can replace later

- `public/images/brand/`
- `public/images/finly/`
- `public/images/gps-camera/`
- `public/images/filtra/`

Current screen artwork is illustrative placeholder UI. Replace it with original logos and screenshots when ready.

## Privacy pages

`/privacy/` contains the Lakebird Software website privacy policy draft. The individual app privacy destinations are still placeholders until the approved app-specific policies are supplied. Review the website policy before production launch and update it when hosting, fonts, analytics, contact or embedded services change.

## Local development

Use Node.js 24:

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```
