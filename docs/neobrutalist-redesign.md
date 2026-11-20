# Neobrutalist portfolio design

The redesign uses the visual language of printed NYC posters and a personal fieldbook: oversized name typography, hard-edged exhibit framing, an editorial project spread, and an open experience/skills ledger. The interface has a dark foundation; color marks a change of subject or an action. The name and miniature city remain the two major interactive experiences.

Research informed the composition before implementation. [NN/g's neobrutalism guide](https://www.nngroup.com/articles/neobrutalism/) describes the balance between expressive type, hard shadows, contrast, and usability. [Minick's working style example](https://minick.studio/styles/neobrutalism) reinforces consistent border weights and disciplined flat color. These are design references, not templates or sources for portfolio content.

## Materials and typography

Tokens live in `src/design-system.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#17151F` | Page foundation, text on accents, borders |
| `--lime` | `#D9FA63` | Main action, city title bar, data exhibit, contact |
| `--lilac` | `#A58AFF` | City shadow, name control, renter insert, about spread |
| `--coral` | `#FF8B72` | Flagship WatchMate spread, punctuation, experience date |
| `--cream` | `#F3EEE5` | Primary text, education document, secondary controls |
| `--surface` | `#24212C` | Quiet city preview and notes |
| `--muted` | `#C0BAC9` | Secondary text on ink |
| `--line` | `#514B5B` | Quiet dividers on ink |

Bricolage Grotesque 800 is the display face across the name, headings, and major metrics. Manrope supplies readable body text and controls. Both are existing, self-hosted OFL assets; no font dependency or third-party font request was added. The unused Instrument Serif preload was removed. Primary prose and engineering highlights use 16px text; compact metadata uses 12–14px.

Accent surfaces use ink text, rather than light text on bright backgrounds. Border weight is 2px. Hard shadows use 3px for small controls, 5px for normal controls, and 7–9px for major frames. Corners are square. The cinematic scene retains its atmospheric shading; the surrounding interface uses flat fills.

## Composition walkthrough

- **Navigation:** a tilted MY monogram and an index strip, including direct access to Experience. The existing mobile disclosure, Escape handling, current-section tracking, and no-JavaScript navigation remain.
- **Hero:** a larger two-line interactive name, with a smaller professional introduction and a static coral geometric emblem. Tablet introduces a separate introduction row; mobile stacks the text with direct project and resume access.
- **City:** a lime exhibit title bar and lilac hard shadow frame the original dimensional neighborhood. A quiet ink preview panel and cream location rail provide clear controls. The city stacks at 900px so tablet users get a useful scene width and readable project details.
- **WatchMate:** the large coral feature gives authentic application screenshots the leading visual position. Usage metrics, the Redis benchmark and its caveat, security/background-processing/testing accomplishments, and technology list remain visible.
- **Housing:** an open asymmetric spread pairs the existing interactive ingestion diagram with the project narrative. The lime data plate emphasizes actual imported records and test results. The implemented/planned distinction remains explicit.
- **Renter:** a smaller, indented lilac insert preserves the workflow and individual contributions without competing with the flagship.
- **Experience:** a large side heading, date label, and open engineering ledger replace a repeated card pattern.
- **About and education:** a lilac biography spread contains one cream education document. Skills use ruled rows, rather than another card grid.
- **Contact:** a lime typographic sign-off with direct email and tactile GitHub, LinkedIn, and resume controls.

## Interaction preservation

`KineticName.jsx` and `kineticPhysics.js` are unchanged. Entrance choreography, pointer deformation, neighbor coupling, dragging, click/tap waves, touch handling, cancellation, idle-loop suspension, and live reduced-motion changes use the original system. Only `kinetic-name.css` changes its size, cream/lime/coral treatment, offset letter shadow, and lilac pluck control. The reduced-motion ink control is preserved.

`CityScene.jsx` is unchanged. `MiniatureCity.jsx` adds a presentation stylesheet and a static title bar; its state, selection handlers, camera classes, parallax writes, visibility lifecycle, pause behavior, fallback, and focus restoration are unchanged. `city.css` only changes the stacking breakpoint. `city-frame.css` owns the presentation overrides, leaving the scene animation lifecycle in its original file.

Other interactions support these features: buttons depress into their hard shadows, selected pipeline stages settle into their frame, navigation changes fill, text-link underlines extend, and screenshot hover gently changes brightness. UI timing uses `--ui-time: 160ms`. The existing global reduced-motion preference disables CSS transitions and animations as well as the original component-specific motion handling.

## Files and local recovery

The pre-edit repository was clean. The recoverable local tag is `checkpoint-before-neobrutalist-20261119` at `7ede787`. No push or deployment was performed.

Key files:

- `src/design-system.css`: tokens, typography, layout, controls, responsive rules.
- `src/index.css`: Tailwind and design-system entry point.
- `src/components/Hero.jsx`, `Navigation.jsx`, `Projects.jsx`, `Contact.jsx`: presentation markup.
- `src/components/kinetic/kinetic-name.css`: name styling.
- `src/components/city/city-frame.css`, `city.css`, `MiniatureCity.jsx`: exhibit framing and responsive layout.
- `index.html`, `public/favicon.svg`, `public/favicon.png`, `public/social-card.png`: theme metadata and refreshed identity/share assets.
- `tests/motion.spec.js`: updates the old purple hover expectation to the new cream state; behavioral assertions remain.
- `scripts/review-preview.mjs`: full-page, hero, and individual-section review captures.

Verified content, the resume PDF, dependency manifests, scene/physics implementations, SEO content, CNAME, and deployment workflow are unchanged. The existing build regenerates the prerendered `dist/index.html`.

## Reproducing review artifacts

On Windows, run `npm.cmd run check`, start `npm.cmd run preview -- --port 4173 --strictPort`, then run `npm.cmd run test:browser` and `node scripts/review-preview.mjs`. Tests clear `test-results` when they start; run the visual review script after the tests to retain both sets of artifacts.

- Full-page screenshots: `test-results/review-1440.png`, `review-768.png`, `review-390.png`.
- Hero screenshots: `test-results/hero-1440.png`, `hero-768.png`, `hero-390.png`.
- Individual sections: `test-results/review-{section}-{width}.png`.
- Name recordings: `test-results/kinetic-interaction-1440.webm`, `kinetic-interaction-390.webm`.
- City recordings: `test-results/city-interaction-1440.webm`, `city-interaction-390.webm`.
- Rendering and layout metrics: `test-results/*metrics*.json`, `city-rendering.json`, `kinetic-frame-times.json`.

These ignored local artifacts are available in the workspace and are regenerated by the commands above. Chrome mobile/touch emulation is not physical-device testing; automated axe checks are not a manual screen-reader audit.

## Verification results — November 19, 2026

- `npm.cmd run check`: passed ESLint with zero warnings, Vite production build, prerendering, and production content/asset/anchor/metadata/resume checks. Lint also passed after the final review-script changes.
- `npm.cmd audit --json`: zero vulnerabilities across all severity levels. No dependencies were added or changed.
- `npm.cmd run test:browser`: **18 passed in 2.8 minutes** on the final site build. Coverage includes letter entrance, pointer response, neighbor motion, drag, click/touch wave, cancellation, resize, keyboard activation, live reduced-motion changes, city hit targets and camera/parallax, preview switching/closing, focus restoration, pause/offscreen lifecycle, GPU-disabled fallback, screenshot modal, ingestion stages, navigation, and no-JavaScript behavior.
- Automated axe WCAG A/AA checks passed at 1440, 768, 390, and 320px, including interactive city previews and the screenshot modal. No horizontal overflow was found. Focus states were exercised by keyboard tests.
- Full-page, hero, and individual-section captures were generated at **1440, 768, and 390px**. Desktop, tablet, and mobile compositions and the major sections were visually inspected. The tablet city was refined to stack after the first review. The review script also confirms all three pipeline stages fit inside their fixed panel without clipping at each of these widths.
- Name, city, and general UI interaction recordings measured **0 cumulative layout shift** at desktop and mobile widths. The tests found no browser console/runtime errors in these sequences.
- The real resume downloaded successfully with the expected filename, PDF signature, and unchanged SHA-256 hash. All project destinations and GitHub returned HTTP 200. LinkedIn returned **999**, its automated-request block; its existing URL is preserved, but its destination could not be independently confirmed with this check. The email link retains the verified address.
- The five primary color pairs with ink have calculated contrast ratios of **15.62:1 cream**, **15.30:1 lime**, **6.60:1 lilac**, **7.90:1 coral**, and **9.55:1 muted text**. All exceed 4.5:1 for normal text.
- Local Chrome name-animation sampling: median **16.7ms**, 95th percentile **17ms** over 120 frames. The GPU/WebGL-disabled city run sampled median **16.7ms**, 95th percentile **33.4ms**; task time in separate two-second windows fell from **341ms visible** to **16ms offscreen**. These are local diagnostic measurements, not physical-device performance guarantees.
- Final production JavaScript: **363.77kB / 117.79kB gzip**; CSS: **47.11kB / 10.43kB gzip**. The animation engines and SVG scene remain intact.
- Actual WebM recordings were saved for both features at 1440 and 390px. The checkpoint and all changes remain local; nothing was pushed or deployed.
