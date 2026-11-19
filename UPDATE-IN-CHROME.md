# Upload Homepage V2.1 using Chrome

**Keep your existing `.github` folder.** The update ZIP does not contain `.github`.

1. Extract the ZIP.
2. Open `project`.
3. In GitHub, open `Lakebird-Software/website-redesign-preview`.
4. Delete or replace the existing website files and folders except `.github`.
5. Use **Add file → Upload files** and upload all contents of `project` into the repository root.
6. Include `.nojekyll` and other hidden files.
7. Commit to `main` with message `Refine homepage terrain and navigation — V2.1`.
8. Check **Actions** for a green Build and Deploy result.
9. Hard-refresh https://lakebird-software.github.io/website-redesign-preview/ with Ctrl + Shift + R.

The current working `.github/workflows/deploy.yml` must stay in the repository.
