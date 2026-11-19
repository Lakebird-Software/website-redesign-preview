# Lakebird Software preview — deployment guide

1. Download and extract the ZIP.
2. Open `https://github.com/Lakebird-Software/website-redesign-preview` in Chrome.
3. Choose **Add file → Upload files**.
4. Upload the extracted project's contents, including the `.github` folder. If the browser file chooser hides dot-folders, upload `.github/workflows/deploy.yml` separately by creating `.github/workflows/deploy.yml` in GitHub's web editor.
5. Commit to the `main` branch.
6. Confirm **Settings → Pages → Build and deployment → Source = GitHub Actions**.
7. Open the Actions tab and verify both jobs pass.
8. Preview at `https://lakebird-software.github.io/website-redesign-preview/`.

The production website repository is not affected by changes in this preview repository.
