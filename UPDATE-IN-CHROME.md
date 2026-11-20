# Update the Lakebird preview using Chrome

1. Download and extract this ZIP.
2. Open the extracted `project` folder.
3. Open `https://github.com/Lakebird-Software/website-redesign-preview`.
4. Keep the existing `.github` folder and its `workflows/deploy.yml` file.
5. Replace all other repository files and folders with the contents of this `project` folder. Upload hidden files such as `.nojekyll` too. Do not upload the outer `project` folder itself.
6. Commit directly to `main`.
7. Open the Actions tab and verify that both Build and Deploy are green.
8. Review the preview at `https://lakebird-software.github.io/website-redesign-preview/`.

The ZIP deliberately excludes `.github` so your working GitHub Pages workflow can be retained. Do not delete or replace that folder.
