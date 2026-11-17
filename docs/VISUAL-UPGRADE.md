# Project-led visual upgrade — November 17, 2026

This revision keeps the current writing, original navy/purple palette, portfolio facts, resume, framework, and deployment strategy. It changes the composition and project presentation. No source was pushed or publicly deployed, and no DNS or repository setting was changed.

## Design choices

- The floating hero grid and its pointer handlers were removed completely. The two-column hero now balances the name and introduction against actual WatchMate screenshots, with a smaller MapPLUTO/PostGIS import panel tied to the housing project. The complete composition remains visible on mobile.
- WatchMate is the featured project: a full-width desktop/mobile application showcase, a larger metric strip, engineering highlights, and the existing smaller cached-request interaction. The screenshot demonstrates the actual public home page, not an invented authenticated tracking dashboard.
- Housing uses a distinct green/navy data presentation. The record count comes from the existing project data. Discover, Validate, and Merge controls explain implemented import stages; the planned datasets, address resolution, and AI work remain explicitly unfinished in the project text. No synthetic tax-lot map or live monitoring dashboard was invented.
- Renter Dispute Assistant has a smaller presentation appropriate for an academic team project. Its current descriptions, team attribution, and nonbinding-assessment qualification remain.
- A timeline treatment for experience, an offset education panel, category rails for skills, and restrained section background changes provide progression without adding sections or slogans. The `my.` identity and original `#0d0a20` / `#5b42f5` foundation remain.

## Authentic image provenance

`public/projects/watchmate-desktop.jpg` and `watchmate-mobile.jpg` were captured directly from **https://www.mywatchmate.us/** on November 17, 2026 at 1440×900 and 390×844 respectively. Both captures were visually inspected. No account was used, no app behavior was altered, and no UI or user activity was fabricated.

The desktop JPEG is 97,381 bytes and the mobile JPEG is 49,728 bytes. The same local assets are reused in the hero and featured project. They require no iframe, remote image host, live API request, tracking service, or runtime access to WatchMate. Explicit dimensions reserve layout space; hero images load eagerly and the featured copies use lazy loading.

To refresh after a genuine application change, run `node scripts/capture-watchmate.mjs` with the same installed browser channel as the tests, then visually review both new files. It waits only for visible images, with a bounded timeout, so an offscreen lazy image cannot hang the capture. Update `src/data/projectMedia.js` if captured dimensions or paths change. The public capture README records its origin and date.

## Main code changes and motion checkpoint

| File | Responsibility |
| --- | --- |
| `src/components/Hero.jsx` | Existing copy and CTAs in a two-column layout, with meaningful project visuals instead of the grid. |
| `src/components/WatchMatePreview.jsx` | Shared authentic screenshot composition, browser/phone framing, image dimensions, priority/loading, alt text, and working preview links. The featured screenshot gets a small viewport entrance; the entire long project article does not animate. |
| `src/components/DepthPanel.jsx` | Reusable, bounded project-panel tilt. Motion values and springs update transforms, not React state. Bounds are measured on pointer entry rather than every move. Rotation is limited to ±2.5 degrees and resets on exit or keyboard focus. Touch and reduced motion skip it. |
| `src/components/HousingPipeline.jsx` | Compact hero link plus the full interactive import diagram. Each stage uses a normal `aria-pressed` button and a polite description region with reserved height. Stages arrive once when entering view; this is an explanation of the implemented process, not a live import status display. |
| `src/components/Project.jsx` | Preserved project facts with three different compositions. WatchMate's real UI gets visual priority, housing uses a side-by-side data layout, and the academic project stays simpler. |
| `src/components/ProjectGraphic.jsx` | Existing architecture/request trace and academic workflow, extracted from `Project` so its presentation stays manageable. The actual cached-request path remains unchanged. |
| `src/components/NavBar.jsx` | Existing disclosure and keyboard behavior plus an active-section indicator driven by IntersectionObserver. Native fragment navigation remains. |
| `src/data/projectMedia.js` | Screenshot paths, dimensions, and alternative text. Portfolio writing and factual data stay untouched in `portfolio.js`. |
| `src/styles/showcase.css` | Composition, real-image framing, project-specific layouts, depth, finite panel entrances, responsive behavior, and reduced-motion handling. Shared tokens and basic styles remain in `index.css`; `main.jsx` loads the showcase styles afterward. |

Panel entrances finish in less than a second, with only a small stagger. Pipeline stages animate once on viewport entry. There are no particles, fake terminals, infinite ambient loops, typing effects, scroll hijacking, or new animation dependencies. The existing reduced-motion CSS disables these sequences and transitions; the pointer component also checks the preference in JavaScript. Content starts visible in prerendered HTML and remains readable without JavaScript. Important accomplishments are never hidden behind the new interactions.

## Verification

- `npm run lint`: passed, zero warnings.
- `npm run build`: passed, including production prerendering, local assets, anchors, CSP, CNAME, and resume-PDF checks.
- `npm run test:browser -- --workers=1`: **7 passed in 35.8 seconds** in the final complete run. The serial run avoids measuring concurrent accessibility/screenshot work in the motion browser.
- Normal-motion overflow checks and reduced-motion accessibility/layout checks passed at **1440, 768, 390, and 320 pixels**. Axe reported zero automated WCAG A/AA violations.
- Mouse tilt, mobile menu, keyboard navigation and focus return, touch interactions, the cache-request trace, housing-stage selection, active navigation, screenshot loading, real PDF download, and no-JavaScript content passed.
- The final desktop and touch-mobile recordings measured **zero layout shift and no long tasks**, including during the measured interaction window. Earlier concurrent runs and one earlier isolated desktop run did record long tasks, so this is a dated local observation, not a guarantee of 60 FPS on all hardware.
- `npm audit --audit-level=low`: zero known findings. No dependency change was needed.
- Checksums match the starting working tree for `src/data/portfolio.js`, `public/resume.pdf`, package/lock files, Vite config, and CNAME. The Pages workflow has no new change. Existing uncommitted work from the preceding revision was preserved.
- Production JavaScript: **333.14 KB raw / 107.67 KB gzip**. CSS: **35.81 KB raw / 8.73 KB gzip**. Both screenshot assets together are approximately 147 KB and are cached/reused within the page.

New local artifacts, regenerated by browser tests:

- `test-results/portfolio-1440.png` and `portfolio-390.png` — full-page desktop and mobile screenshots.
- `test-results/portfolio-768.png` and `portfolio-320.png` — additional responsive captures.
- `test-results/motion-1440.webm` and `motion-390.webm` — actual browser recordings.
- `test-results/motion-metrics-1440.json` and `motion-metrics-390.json` — measured layout shifts and long tasks.

For a reproducible local preview, run `npm run build` followed by `npm run preview` and visit **http://127.0.0.1:4173/**. `node scripts/review-showcase.mjs` can capture an additional four-width visual review against that running preview. Windows PowerShell may require `npm.cmd`; recording uses the previously installed Playwright FFmpeg binary and installed Chrome. Linux/CI retains its existing Chromium setup.

Visual screenshots and recording frames were reviewed. No physical-device, Safari, Firefox, Lighthouse, field-performance, or public-deployment check was performed. Automated accessibility results are not a complete WCAG conformance assessment. The existing tracked `dist/index.html` was regenerated by the build; the deployment process itself remains unchanged.
