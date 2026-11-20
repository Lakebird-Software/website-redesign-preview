# Upload Lakebird Software Homepage V2.2 using Chrome

This package is for the preview repository only:
`Lakebird-Software/website-redesign-preview`

## Keep the working deployment workflow

Do **not** delete or replace the existing `.github` folder. Keep:

- `.github/`
- `.github/workflows/deploy.yml`

The update package intentionally excludes `.github`.

## Replace the website files

1. Download and extract the V2.2 ZIP.
2. Open the extracted `project` folder.
3. Open `https://github.com/Lakebird-Software/website-redesign-preview` in Chrome.
4. Keep `.github`; delete or replace the other old website files and folders.
5. Use **Add file → Upload files**.
6. Upload all contents inside the extracted `project` folder into the repository root (not the enclosing `project` folder).
7. Include hidden files such as `.nojekyll`.
8. Commit directly to `main` with message: `Update Lakebird homepage to V2.2`.
9. Open the Actions tab and confirm both Build and Deploy jobs are green.
10. Hard refresh the preview URL with Ctrl + Shift + R:
    `https://lakebird-software.github.io/website-redesign-preview/`

## Images and screenshots

Replace assets in:

- `public/images/brand/`
- `public/images/finly/`
- `public/images/gps-camera/`
- `public/images/filtra/`

Use the `ResponsiveScreenshot.astro` component for supplied images. Choose the correct `kind` (`phone`, `tablet`, `landscape`, `square`, or `photo`). Phone screenshots preserve a portrait frame and use `object-fit: contain`; only intentionally cropped photos use `kind="photo"`.

## Do not deploy to production yet

The production repository `Lakebird-Software/Lakebird-Software.github.io` is not changed by this package. Test the preview first on desktop and mobile.
