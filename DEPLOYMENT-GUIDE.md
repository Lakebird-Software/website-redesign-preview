# Deploy the Lakebird redesign preview to GitHub Pages

Repository: `https://github.com/Lakebird-Software/website-redesign-preview`

Preview URL: `https://lakebird-software.github.io/website-redesign-preview/`

## 1. Upload the files

1. Extract `lakebird-software-homepage-source.zip` on your computer.
2. Open the preview repository on GitHub.
3. Choose **Add file → Upload files**.
4. Upload the extracted project's contents so that `astro.config.mjs`, `package.json`, `src/`, `public/` and `.github/` are at the repository root. Do not upload a parent folder containing all of them.
5. Commit to `main`.

For easiest folder-preserving upload on Windows, GitHub Desktop can be used: clone the empty preview repository, copy the extracted project contents into the cloned folder, then commit and push.

## 2. Enable Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the Source.
3. Save if GitHub presents a Save button.

## 3. Check deployment

1. Open the **Actions** tab.
2. Open `Deploy Lakebird Software to GitHub Pages`.
3. Wait for both Build and Deploy jobs to finish successfully.
4. Open `https://lakebird-software.github.io/website-redesign-preview/`.

## Notes

- This preview project is configured with Astro `base: '/website-redesign-preview'`. Do not remove it while deploying to this repository.
- The existing production repository is separate and is not modified.
- All pages carry `noindex,nofollow` metadata for preview use. Review this before production launch.
- Privacy routes are placeholders only and must not be used as official legal policy pages.
- App pages are temporary navigation destinations until their individual designs are completed.
