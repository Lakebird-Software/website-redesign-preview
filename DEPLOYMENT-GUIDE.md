# Update the Lakebird preview from Chrome

1. Download and extract the Version 2.1 ZIP.
2. Open the extracted `project` folder.
3. In the GitHub repository `Lakebird-Software/website-redesign-preview`, keep the existing `.github` folder and its working `workflows/deploy.yml` file.
4. Replace the other old website files and folders with the contents of the extracted `project` folder. The ZIP intentionally omits `.github`.
5. Include hidden files such as `.nojekyll` if shown by Windows Explorer.
6. Do not upload the outer `project` directory as a nested folder. Upload its contents into the repository root.
7. Commit directly to `main`, for example: `Refine homepage terrain and navigation — V2.1`.
8. Open the Actions tab and verify that Build and Deploy both complete successfully.
9. Hard-refresh the preview in Chrome with Ctrl + Shift + R.

Preview URL: https://lakebird-software.github.io/website-redesign-preview/

The production repository is not part of this update.


## What changed in this update

- Particle mouse and click/tap positions are mapped in normalized canvas coordinates and evaluated in screen space in the shader. This avoids the previous ray/plane offset and makes the effect align with the visible pointer.
- Particle spacing is tighter for a smoother surface.
- Click/tap waves use one broad, slow crest with a soft trailing trough.
- The stage canvas is explicitly full-bleed, with top/bottom fades and no visible square canvas edge.
- Mobile continues to use normal vertical scrolling; only tap gestures trigger a ripple.
