# Update the Lakebird preview repository using Chrome

This package is for the preview repository only:

`https://github.com/Lakebird-Software/website-redesign-preview`

It does not modify the production repository.

## Upload the updated files

1. Download `lakebird-software-homepage-v2-preview.zip` and extract it on Windows.
2. Open the extracted `project` folder. Upload the **contents** of `project`, not the outer `project` folder itself.
3. In Chrome, open the preview repository and choose **Add file → Upload files**.
4. Drag the extracted project contents into the upload area. Include `.github` if it is visible. In Windows File Explorer, enable **View → Show → Hidden items** if necessary.
5. If the browser upload omits the hidden `.github` directory, keep the currently working workflow in the repository; it can continue to build the project. Do not create a second workflow with a different name.
6. Commit the updates directly to `main`.
7. Open **Actions** and verify the latest run's Build and Deploy jobs are green.
8. Open `https://lakebird-software.github.io/website-redesign-preview/` and hard-refresh with `Ctrl + Shift + R`.

If GitHub reports a path conflict or won't replace existing files, stop and share a screenshot before deleting anything. Keep the existing production repository untouched.

## Notes

- The `astro.config.mjs` base path is `/website-redesign-preview`; keep it for the preview repository.
- The `src/pages/privacy/index.astro` route is the Lakebird Software website privacy page at `/privacy/`.
- The three individual app privacy routes remain placeholders until the approved app-specific policy text is supplied.
- App screenshots and the company logo can be added to `public/images/brand/`, `public/images/finly/`, `public/images/gps-camera/` and `public/images/filtra/`.
- The GPS Camera Play badge currently links to a Play Store search because its direct listing URL has not yet been supplied.
