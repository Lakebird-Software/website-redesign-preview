# Lakebird image assets

Place original logos and screenshots in the matching folders:

- `brand/` — Lakebird Software logo and brand artwork.
- `finly/` — Finly app icon and screenshots.
- `gps-camera/` — GPS Camera app icon and screenshots.
- `filtra/` — Filtra app icon and approved preview screenshots.

Suggested file names:

- `brand/lakebird-logo.svg`
- `brand/lakebird-mark.svg`
- `finly/app-icon.png`
- `finly/dashboard.png`
- `finly/analytics.png`
- `gps-camera/app-icon.png`
- `gps-camera/camera-preview.png`
- `gps-camera/map-preview.png`
- `filtra/app-icon.png`
- `filtra/preview.png`

Use `ResponsiveScreenshot.astro` to present app screenshots. Choose `kind="phone"` for portrait screenshots, `kind="tablet"` for tablet imagery, `kind="landscape"` for landscape screenshots, `kind="square"` for icons/artwork, and `kind="photo"` only for photographs intended to fill and crop.

Screenshot images use `object-fit: contain`, preserving the source proportions. Photo frames use `object-fit: cover` intentionally.

The CSS phone mockups currently shown on the homepage are illustrative placeholders. Replace them with actual app screenshots only after verifying that the screenshot and app version are current.
