# Lakebird Software V2.2 — Deployment guide

## Target

Deploy only to the preview site:

`https://lakebird-software.github.io/website-redesign-preview/`

Repository:

`https://github.com/Lakebird-Software/website-redesign-preview`

## Required settings

- Repository visibility: Public.
- Settings → Pages → Build and deployment → Source: GitHub Actions.
- Existing `.github/workflows/deploy.yml` must remain in the repository.
- Workflow should install dependencies, run `npm run build`, and upload `dist/` as the Pages artifact.
- Node.js 24 is recommended for the build.

## Update procedure

1. Keep `.github` in the repository.
2. Replace all other site files with the contents of this project's `project` folder.
3. Commit to `main`.
4. Monitor Actions and confirm both Build and Deploy succeed.
5. Hard-refresh the preview URL.

Do not copy this preview project to the production repository until it has been reviewed and approved on desktop and mobile.
