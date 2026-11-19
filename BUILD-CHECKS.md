# Version 2.1.1 source checks

Checks run in the preparation environment:

- TypeScript transpilation of `src/scripts/site.ts`: passed with zero syntax diagnostics.
- CSS parsing for `global.css`, `v2.css` and `v21.css`: passed with zero parser errors.
- Particle terrain script contains one initializer and one invocation.
- The full Astro production build was not run in this environment: dependency installation timed out, and the available local Node runtime is 22.16.0 while this project declares Node >=22.23.4.

Your existing GitHub Actions workflow uses Node 24 and should perform the full production build after upload. Confirm both Build and Deploy are green before relying on the new preview.
