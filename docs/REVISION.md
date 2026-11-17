# Dark theme, copy, and motion revision

> Historical first dark-theme revision. The follow-up [project-led visual upgrade](VISUAL-UPGRADE.md) replaces the hero grid with authentic application screenshots and adds distinct project layouts.

This is a refinement of the existing portfolio components, not a new application. The dependency files, build configuration, Actions workflow, custom domain, project accomplishments, experience, and current resume PDF were preserved. Nothing was pushed or deployed.

## Recovered palette

The earlier theme is present in commit `6646fb5`, before modernization commit `b3890eb`:

```sh
git show 6646fb5:src/App.jsx
git show 6646fb5:src/index.css
git show 6646fb5:src/assets/wave-haikei.svg
git show 6646fb5:tailwind.config.js
```

The old Tailwind configuration did not define custom theme colors; they were in component classes, CSS, and SVG assets. `App.jsx` used `#0d0a20` as the page background, and the navigation/header artwork used `#5b42f5`. The old gradient also used `#5c51d6`; it was not restored because a solid navy foundation better fits the requested restraint.

| Purpose | Current value | Reason |
| --- | --- | --- |
| Page background | `#0d0a20` | Exact original navy |
| Primary controls and accent lines | `#5b42f5` | Exact original purple |
| Main text | `#f4f1ff` | Soft white, close to the original white |
| Secondary text | `#b8b1d0` | Readable supporting text on dark surfaces |
| Violet text | `#b6a5ff` | Lighter than the original saturated accent for text contrast |
| Card surfaces | `#151129` / `#1c1735` | Depth without glass, glow, or large gradients |

`src/index.css` centralizes these values. Existing responsive card columns and section structure remain. Engineering diagrams have subdued project-specific surfaces. The hero has one pointer-responsive grid, not a constantly moving background. The favicon, browser theme color, and social sharing image match the restored palette.

## Copy review

The hero now states the name, role, Queens College graduation date, and areas of work directly, with **View Projects** and **Download Resume** actions. Its introduction is editable as `profile.introduction` in `src/data/portfolio.js`.

The headings are **Projects**, **Experience**, **About Me**, **Education**, **Technical Skills**, and **Contact**. The About Me text covers backend/full-stack interests, how APIs/databases/background jobs fit together, recent projects, and one sentence about One Piece.

Removed the project taglines, numbered editorial labels, field note, separate personal-interest disclosure, decorative diagram labels, repeated diagram captions, and footer slogan. This includes “Curious about what’s underneath,” “Shipping with a team,” “Built with curiosity. Refined with tests,” “Good answers start with reliable data,” and “Have something worth building?” Social sharing metadata and the social image no longer contain the slogans either.

Project descriptions are direct. All project metrics, engineering highlights, benchmarks, statuses, links, technologies, planned-feature qualifications, experience, education, and skills were compared to the starting commit and verified unchanged. The housing project uses its full name. Diagrams remain actual diagrams rather than fabricated product screenshots.

## Motion code checkpoint

### `Reveal` — shared entrance pattern

`src/components/Reveal.jsx` uses the existing Framer Motion `m` component and `whileInView`. A block moves up **14 pixels** and changes opacity from **0.65 to 1** over **420 ms** on its first viewport entry. The same easing is used throughout. Its optional `delay` is used for a short hero sequence and small skill-group staggers, not for every paragraph.

`initial={false}` is intentional: prerendered HTML starts readable, so JavaScript failure or unavailable intersection observation cannot strand content at zero opacity. The hero's last item starts after only 160 ms. `useReducedMotion` omits the animation entirely; `MotionConfig` still applies the user preference globally.

### `Hero` — pointer-responsive grid

`src/components/Hero.jsx` updates two motion values in `moveGrid`; `useSpring` gently follows them. It reads viewport coordinates instead of measuring element layout on every pointer event, and does not update React state during movement. Movement is bounded to roughly ten horizontal and eight vertical pixels. `resetGrid` returns it to its origin when the pointer leaves.

Only a mouse can move it. Touch input and reduced-motion preferences skip the handler, and the pattern is hidden on small screens. It has no idle animation or frame loop when settled. Text and controls do not move with the grid.

### `ProjectGraphic` — request trace

The WatchMate graphic in `src/components/Project.jsx` exposes **Trace cached request**, a normal keyboard/touch-accessible button. A local counter restarts a single **1.4-second** CSS sequence. The interface, API, and Redis highlights appear in request/response order, with a small packet between interface and API. MySQL and background imports do not pulse during this cache-hit example.

This illustrates **React → API → Redis → API → React**. It is not a real network request or a claim that every request is a cache hit. The explanatory text is an `aria-live="polite"` region. Its minimum height reserves space for either message, preventing a layout change when it updates. Reduced motion removes the visual sequence while the same button still exposes the request path as text. No new service, endpoint, or unfinished feature is implied.

### CSS interactions and navigation

Project cards lift four pixels and reveal a thin accent border on fine-pointer hover; their diagrams move only two pixels. Keyboard focus reveals the accent without moving the card. Touch users get the same information and controls without hover. Links reveal an underline; buttons have small hover/press feedback.

The existing mobile-menu state and Escape/focus handling remain in `NavBar`. CSS adds a brief opacity/translation disclosure using discrete display transitions. Older browsers fall back to the normal disclosure without affecting navigation. No modal, router, scroll hijacking, or focus trap was added.

The reduced-motion media query disables CSS transitions, the request keyframes, hover transforms, and smooth scrolling. The shared Motion wrapper and hook disable the JavaScript-driven entrances and pointer effect. Each animation finishes; none loops indefinitely.

## Reproduce and inspect

```sh
npm run lint
npm run build
npm run test:browser
npm run preview
```

Preview: **http://127.0.0.1:4173/**. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`; the tests use installed Chrome. Video recording needs `npx playwright install ffmpeg` once. Linux/CI's existing `npx playwright install --with-deps chromium` includes the recorder. No workflow edit was needed.

The browser suite regenerates these ignored local artifacts:

- `test-results/portfolio-1440.png`
- `test-results/portfolio-390.png`
- `test-results/portfolio-768.png` and `portfolio-320.png`
- `test-results/motion-1440.webm`
- `test-results/motion-390.webm`
- `test-results/motion-metrics-1440.json` and `motion-metrics-390.json`

The screenshots use reduced motion so offscreen viewport effects cannot affect their appearance. The recordings use normal motion; the 390-pixel recording uses a touch-enabled mobile context. `tests/motion.spec.js` checks the grid response, menu interaction, actual request keyframes, exclusion of unrelated branches, stable card height, finished animations, and layout-shift measurements. `tests/portfolio.spec.js` checks the exact recovered background/button colors, real PDF download and filename, asset errors, keyboard navigation, no-JavaScript content, four layouts, and automated WCAG A/AA checks.

## Verified results

- `npm run lint`: passed, zero warnings.
- `npm run build`: passed, including prerendering, local assets, anchors, production CSP, CNAME, and PDF checks.
- `npm run test:browser`: **7 passed in 17.8 seconds** on the final complete run.
- Automated WCAG A/AA checks: zero violations at 1440, 768, 390, and 320 pixels; no horizontal overflow. The computed page background and primary button color match the recovered palette exactly.
- The browser downloaded the real PDF as `Muhammad-Yassa-Resume.pdf`, checked its HTTP response and PDF signature, and exercised navigation and reduced motion.
- Both normal-motion recordings measured **zero layout shift**, stable project-card height, and **no long tasks during the measured interaction window**. The startup observations were one 243 ms task on desktop and one 50 ms task on mobile, before that window. The measurements are recorded with timestamps in the JSON artifacts.
- Production JavaScript is 327.27 KB raw / 105.97 KB gzip; CSS is 21.19 KB raw / 5.83 KB gzip. No production dependency was added.
- `npm audit --audit-level=low`: zero known findings. Dependency files and security/deployment configuration have no diff.
- Resume checksum and the comparison of protected project/experience/education/skills data passed. Desktop/mobile screenshots were visually inspected, and recording frames were checked.

These are local Chrome observations, not a cross-device 60 FPS guarantee or a Lighthouse score. Safari/Firefox and physical mobile devices were not tested. Automated accessibility checks do not establish complete WCAG conformance.

The PDF's SHA-256 remains `137A56C3E6437008F1217961891A4E3F9E0834AFC25E2053DDBF6075093ABBB2`. The build continues validating the PDF signature. The checkout tracks `dist/index.html`, so the build also regenerates that existing tracked artifact; deployment still builds `dist` through the unchanged workflow.
