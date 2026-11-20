# Lakebird Software Homepage V2.2 — Build and QA checks

## Source-level checks performed in the packaging environment

- Confirmed every local Astro component import in the page/component/layout source points to an existing file.
- Confirmed dynamic application routes define `getStaticPaths()` and generate `finly`, `gps-camera`, and `filtra`.
- Confirmed dynamic privacy routes define `getStaticPaths()` and generate the three app policy destinations.
- Confirmed the Hero ocean terrain uses a separate canvas and a horizontal XZ-plane particle surface.
- Confirmed the ambient React Bits component is the supplied `Particles-JS-CSS` source (same source bytes as the uploaded attachment); its original particle interaction implementation is preserved, with a `paused` prop used to suspend rendering when hidden.
- Confirmed the Hero and ambient particle systems are separate components and the ambient layer is activated after the Hero and faded before the footer.
- Parsed project CSS with `tinycss2`; no CSS parse errors were found.
- Transpiled the TypeScript site script and React particle components with the installed TypeScript compiler for syntax diagnostics.
- Checked the responsive screenshot styles: phone frames use a 9:19.5 ratio, image content uses `object-fit: contain`, and CSS screen placeholders scale uniformly using their container width rather than retaining fixed tall mobile heights.
- Checked the GitHub Pages Astro base path is `/website-redesign-preview`.

## Full production build limitation

A complete `astro build` was **not run in this environment**. The available Node runtime is v22.16.0, while this project declares Node >=22.23.4, and attempting to fetch a newer Node runtime timed out. The project's existing GitHub Actions workflow should run Node 24 and perform the authoritative build after upload.

Please verify both the Build and Deploy jobs are green in GitHub Actions before treating the update as deployed.

## Manual QA after deployment

- Desktop Chrome: Hero ocean surface, exact cursor placement, click ripples, section navigator, product cards and footer.
- Mobile Chrome: no stretched device screens, no distorted uploaded screenshots, no horizontal overflow, tap ripple only on taps (not scroll gestures), and usable section navigation.
- Dark and light themes: text contrast, navigation visibility, app cards and ambient particle blending.
- Reduced motion: ambient particles and motion-heavy effects are suppressed or simplified.
