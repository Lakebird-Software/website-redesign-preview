# Lakebird Software V2.3 preview deployment

- Repository: `Lakebird-Software/website-redesign-preview`
- Pages URL: `https://lakebird-software.github.io/website-redesign-preview/`
- Pages source: GitHub Actions
- Build: `npm run build`
- Build output: `dist`
- Node: 24

Keep `.github/workflows/deploy.yml` in the repository. The project archive excludes `.github` intentionally. After uploading the project contents to the repository root, commit to `main`; GitHub Actions will build and deploy. Check both jobs before using the preview as a validated release.
