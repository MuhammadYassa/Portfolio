# Miniature NYC

The interactive neighborhood sits immediately after the existing introduction and before Projects. The hero, resume, navigation, full project descriptions, experience, education, contact information, security policy, SEO, and deployment settings remain in place.

## The experience

- **WatchMate / cinema:** illuminated marquee, rooftop screen, ticket-hall doors, warm windows. Preview uses the existing 100-user and 4,298-episode metrics and links to the live application and repository.
- **NYC Housing Intelligence / residential block:** two apartment buildings, fire escapes, rooftop water tank, and an animated data conduit. Preview reports 856,614 imported tax-lot records and 230 passing tests. It explicitly distinguishes the implemented MapPLUTO pipeline from the broader platform still in development. The neighborhood is an illustration, not actual parcel geometry.
- **Renter Dispute Assistant / civic hall:** columned portico, pediment, steps and violet flag. Preview describes case workflows, evidence management, and official PDF form preparation.
- **DNR Events / recording studio:** recording indicator, animated waveform, rooftop ventilation and antenna. Preview covers the internship, approximately 900 daily active users, and the daily Sudoku and puzzle API work.

Hover highlights the building's footprint and windows. Selecting a building glides the scene toward its part of the neighborhood and opens a contextual preview. Pointer movement adds a small amount of parallax. A cab periodically crosses the street, and a train passes through the exposed edge of the miniature's base. Ambient motion can be paused.

The four location buttons provide an equivalent way to explore. On phones they sit between the scene and preview. They avoid requiring precision taps on the illustration. The previews are inline regions, so there is no focus trap and visitors can continue to the ordinary project sections at any time.

## Code walkthrough

### Geometry and rendering: `src/components/city/CityScene.jsx`

`point(x, y, z)` projects the same small world coordinate system onto SVG: screen X is `400 + x - y`; screen Y is `190 + (x + y) * 0.48 - z`. `Face`, `Line`, and `Box` use this projection, keeping buildings, streets, sidewalks, windows, and furnishings aligned. SVG painter order follows the back-to-front arrangement of the four blocks.

`Building` and `Windows` share facade and cornice construction. Each location adds its own authored architectural details. `WaterTank`, `Tree`, `Lamp`, and `Sign` cover the recurring street and rooftop details. No downloaded models, raster textures, WebGL context, or new runtime dependency is needed. The SVG has 714 elements.

`Location` wraps each building in a focusable SVG group with `role="button"`, a meaningful accessible name, `aria-pressed`, and `aria-controls`. Enter and Space activate it. A footprint provides a high-contrast focus boundary. Selection uses the same callback as the native HTML location controls.

### State and previews: `src/components/city/MiniatureCity.jsx`

`selected` is the single source of truth for both the camera class and preview content. Project descriptions, metrics, and URLs come from `src/data/portfolio.js`; the city does not maintain a second copy of those facts. A ref remembers the last activating control. Closing the preview or pressing Escape returns focus there, without scrolling the page.

The inline live region announces preview changes without stealing keyboard focus. Its links lead to the full project/experience sections and the existing external destinations. External links retain `noopener noreferrer`.

Pointer parallax writes two CSS custom properties directly, avoiding a React render for each pointer event. It ignores touch input and is disabled when motion is paused or reduced. Pointer exit resets the offset.

### Animation lifecycle: `src/components/city/city.css`

CSS handles camera interpolation, preview entrances, cab/train movement, data flow, screen brightness, and waveform activity. There is no application-owned continuous render loop, animation timer, canvas, or GPU resource to dispose of.

An `IntersectionObserver` pauses ambient SVG animations when the showcase leaves the viewport. A document visibility listener also pauses them in a hidden tab. The effect disconnects the observer and removes the listener on unmount. The pause button affects ambient animation and prevents camera/preview animation while retaining fully visible project content. `prefers-reduced-motion` removes all city animation, transitions, camera transforms, and pointer parallax.

SVG is also the fallback: the same architecture works with GPU/WebGL disabled. Prerendering includes the static neighborhood and a no-JavaScript explanation linking to the ordinary Projects and Experience sections.

## Verification and artifacts

Run `npm.cmd run check` and `npm.cmd run test:browser` on Windows. The browser configuration uses installed Chrome, serial workers, and a 60-second per-test limit so screenshot/video capture does not compete across workers. Elsewhere the existing Playwright browser selection applies.

The city tests exercise actual SVG hit targets, HTML location controls, hover, pointer parallax, touch, switching and closing previews, external URL attributes, Enter/Space/Tab/Escape, focus restoration, opening previews while paused, reduced motion, offscreen animation suspension, browser errors, automated WCAG A/AA checks, layout shift, and horizontal overflow. Existing tests cover the rest of the portfolio, including no-JavaScript navigation and the real resume download.

`test-results/` is already ignored by Git. Browser tests regenerate:

- `city-1440-overview.png`, `city-1440-watchmate.png`, `city-1440-housing.png`
- `city-390-overview.png`, `city-390-watchmate.png`, `city-390-housing.png`
- `city-interaction-1440.webm`, `city-interaction-390.webm`
- `city-metrics-1440.json`, `city-metrics-390.json`, `city-rendering.json`
- `city-software-rendering.png` and existing whole-portfolio responsive screenshots

The city-only stills hide the sticky site header and skip link during capture to avoid those fixed elements being overlaid on a stitched screenshot. Interaction recordings retain the real interface.

The software-rendering test launches a separate Chrome process with `--disable-gpu --disable-webgl`, verifies that a WebGL context cannot be created, and exercises a real project selection. It samples two seconds of frame intervals and records Chrome task/script time in two-second visible and offscreen windows. These are local headless measurements, not a physical-device benchmark or a general FPS guarantee. The long-task logs from the interaction tests include the cost of screenshot and axe analysis; they are not an isolated runtime benchmark.

All four new external project destinations returned HTTP 200 in a separate HEAD check. Automated axe checks complement keyboard/touch tests; they are not a complete manual screen-reader audit. Mobile testing uses Chrome touch emulation, not physical iOS or Android hardware.

### Results from November 18, 2026

- `npm.cmd run check`: passed lint, production build, prerendering, and the existing production-content/asset/anchor checks.
- Full browser suite: **14 passed**. After the final camera-framing and subway-placement adjustments, the five city tests passed again.
- No automated WCAG A/AA violations or horizontal overflow at 1440, 768, 390, and 320 pixels. City previews were additionally checked with axe after interaction at 1440 and 390 pixels.
- No browser errors in the recorded pointer/touch sequences. Both final sequences measured **0 layout shift**; the earlier full run measured approximately 0.0025 on desktop and 0 on mobile.
- GPU/WebGL-disabled run: median frame interval **16.7 ms**, 95th percentile **33.3 ms**, and 106 sampled intervals in approximately two seconds. In separate two-second windows, browser task time was **359.7 ms visible** versus **18.3 ms offscreen**; script time was **0.75 ms** versus **0.23 ms**. This suggests rendering/painting rather than application JavaScript accounts for most active work in this fallback configuration.
- Final total production assets: JavaScript **357.39 kB / 115.10 kB gzip**; CSS **37.84 kB / 9.21 kB gzip**. These are whole-site totals, not the city's incremental bundle size. No dependencies were added.
- Desktop and mobile stills were visually inspected. The actual WebM recordings were saved, and a frame was decoded from the desktop recording to verify the captured interaction output.

The initial run with three concurrent browser workers hit 30-second limits during capture/analysis. The committed test configuration runs serially with a 60-second limit. A separate Windows preview process was used for the successful final runs to avoid a hung npm/Vite preview teardown; it was stopped after validation.

The recoverable local checkpoint is `checkpoint-before-miniature-nyc-20261118` at `8cd8982`. Nothing was pushed or deployed.
