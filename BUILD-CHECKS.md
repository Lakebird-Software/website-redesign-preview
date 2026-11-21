# Lakebird Software Homepage V2.3 — Source Checks

## Included implementation checks

- Preview Astro base remains `/website-redesign-preview`; no production repository or deployment workflow is included.
- Hero ocean terrain remains a dedicated Canvas 2D perspective surface and stays separate from React Bits Classic.
- React Bits visibility now follows the live viewport position of THE STUDIO and Footer: its fixed overlay starts at the Studio boundary, fades in below that edge, and is clipped at the Footer top.
- Hero 01–07 counter removed; the portfolio proof is separated into a non-overlapping avatar group and copy/status block.
- Contact headline uses the approved two-line wording and full available content width.
- Brand-closing CTA uses the supplied ridge-border/cutout/inset-glow interaction, with light/dark theme-specific colours.
- Finly and GPS Camera Explore CTAs use the supplied circular-fill animation and diagonal-to-upward arrow rotation, with product-specific accent colours.
- Google Play badge uses the supplied four-colour Play icon and two-line copy; the footer badge links to the supplied developer profile.
- Product descriptions, feature points and CTA labels have larger responsive type.
- Header/footer brand mark is typography-only; the decorative symbol is removed and wordmark type is slightly larger.
- Footer background wordmark is constrained by the shared site container, spaced 38 CSS pixels below the footer columns, and shines more slowly/brighter.
- Reduced-motion rules remain in place; no new package dependencies were added.

## Validation status

- All project CSS files passed recursive stylesheet/declaration parsing with zero parser errors.
- `site.ts` and `ocean-terrain.ts` passed the TypeScript syntax/type pass with temporary ambient declarations for the unavailable external GSAP modules; the source changes introduce no new TypeScript diagnostics.
- Static source assertions passed for the approved heading, links, component selectors, version metadata, and preview base path.
- Confirmed the deployment archive excludes `.github`, so the existing preview workflow can be retained.
- A full Astro production build could not be run: the installed Node runtime is v22.16.0 (below the declared >=22.23.4 requirement), and `npm install` timed out before dependencies could be retrieved. GitHub Actions on Node 24 remains the authoritative build/deploy check.

## Manual QA after upload

- Desktop and mobile: React Bits appears from the first Studio edge, never in Hero or Footer.
- Desktop and mobile: verify Hero portfolio proof does not overlap or wrap awkwardly.
- Dark/light themes: inspect both CTA animation styles and Google Play badge contrast.
- Product cards: verify Finly/GPS fill motion, arrow rotation, larger copy, and badge destinations.
- Contact: verify the two-line heading and full-width balance at desktop widths, with natural mobile wrapping.
- Footer: confirm column-to-wordmark spacing, content-bound alignment, slow bright shine and desktop single-row copyright/tagline/back-to-top layout.
- Reduced-motion: verify particle, shine and CTA transitions remain disabled/reduced.
