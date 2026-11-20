# Lakebird Software Homepage V2.2.1 — Source Checks

## Checks included in this package

- Dynamic app and privacy route sources retained with static `getStaticPaths()` definitions.
- Hero ocean terrain is a dedicated Canvas 2D perspective surface, separate from the React Bits particle system.
- Hero pointer coordinates are transformed from viewport coordinates to canvas coordinates before world-space interaction.
- Click/touch ripples are broad, slow and visibly amplified; touch movement is thresholded so ordinary scrolling does not trigger a ripple.
- React Bits Classic component source is retained unchanged from the user-supplied source. A controller pauses it when outside its allowed sections.
- Ambient visibility is disabled while any part of the Hero remains visible and its fixed overlay is clipped before the Footer.
- CSS-built app-screen artwork scales uniformly through a `ResizeObserver`, preserving proportions on narrow screens. Real uploaded screenshots use aspect-ratio frames and `object-fit: contain`.
- Footer wordmark is constrained to the site content container, has increased letter/word spacing, and includes a repeating CSS shimmer. Footer copyright, centred tagline, and Back-to-top are one row on desktop.
- Local component imports and route references should resolve; deployment workflow retained separately in the user's GitHub repository.

## Build limitation

A full local Astro production build was not executed in this packaging environment. The local Node runtime is v22.16.0, below the project's declared Node requirement (>=22.23.4), and dependency retrieval has previously timed out. The project's GitHub Actions workflow should use Node 24. Treat the GitHub Actions Build and Deploy results as the authoritative production-build check.

## Manual QA after upload

- Chrome desktop: ocean perspective, pointer mapping, click ripples, scroll behavior, ambient particles, navigator and footer.
- Chrome mobile: touch ripples (without scroll-triggered bursts), no stretched placeholder screens or screenshots, no horizontal overflow.
- Dark and light modes: contrast and navigation visibility.
- Reduced motion: particle and shine animations are disabled or reduced.
