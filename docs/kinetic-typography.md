# Kinetic hero typography

The hero name is a small spring-connected lettering toy. Bricolage Grotesque at weight 800 and optical size 96 replaces the hero's Instrument Serif. The upright, broad shapes give the name a playful display voice while the existing ivory and lilac colors connect it to the miniature NYC. The name occupies two deliberate lines at every breakpoint. The rest of the portfolio's typography, content, navigation, projects, city, links, and hosting configuration are preserved.

The font is a self-hosted, 21.7 kB Latin WOFF2 asset with its SIL Open Font License in `public/fonts`. It makes no runtime request to Google Fonts. Source: [Google Fonts Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque).

## Interactions

- **Entrance:** alternating rotations and horizontal offsets, with the two words arriving from opposite vertical directions. Characters release into the spring solver 38 ms apart. Translation, rotation, and elastic deformation settle together, with readable text remaining present throughout. There is no repeating idle animation.
- **Proximity:** letters within a distance-weighted radius repel the pointer, lift, tilt, and stretch. Fast movement contributes a bounded impulse that decays over 110 ms. Adjacent letters transmit a small amount of movement through their connecting springs.
- **Drag:** each letter can be pulled with mouse, touch, or pen. A stiffer spring follows the captured pointer, and a hyperbolic tangent progressively resists excessive displacement. Faint outlines mark the original positions. Neighboring letters respond to the tug. Release returns everything home with a little rotation and squash/stretch.
- **Pluck:** clicking or tapping a letter launches a wave outward from that character. The separate “Give it a pluck” button launches the same wave from the middle and supports Enter and Space. The wave applies upward velocity and alternating angular impulses, staggered by distance from its origin. Repeated activation replaces pending impulses rather than accumulating timers.
- **Reduced motion:** no entrance, magnetic movement, dragging, or wave. The heading stays readable and the control instead exchanges the two ink colors without animation. A live media-query subscription stops an animation immediately when the preference changes.

## Code walkthrough

`src/components/kinetic/KineticName.jsx` owns the semantic heading, decorative character slots, accessible play control, and reduced-motion subscription. It creates the physics system in an effect and destroys it during cleanup. Pointer movement does not set React state. `Hero.jsx` only replaces the old heading and removes its parent reveal animation so that two entrance systems do not compete.

`src/components/kinetic/kineticPhysics.js` has five main parts:

1. **Measurement:** cache each untransformed slot's center and dimensions after fonts are ready. A resize observer invalidates the cache. No bounding rectangles are read in the physics solver.
2. **Input:** pointer events update one small pointer or drag record. Pointer capture keeps a drag attached outside the heading. A tap is a release with less than 6 px of pointer travel; cancellation never launches a wave.
3. **Forces:** each letter has position and velocity for x, y, rotation, and stretch. The translation solver uses `acceleration = stiffness * (target - position) - damping * velocity + neighborForce`. Neighbor force uses a snapshot of the previous step, so iteration order does not favor one direction.
4. **Integration and rendering:** a fixed 1/120-second solver step with a capped frame delta handles variable refresh rates and delayed frames. The resting spring uses stiffness 190 and damping 17; the held letter uses 520 and 31 for a firmer response. Rotation and stretch have independent damped springs. Velocity feeds stretch during release. The renderer writes only a `translate3d / rotate / scale` transform for each glyph.
5. **Lifecycle:** animation frames run only while motion needs resolving or a letter is held. A stationary pointer can retain a settled deformation without a running frame loop. Leaving returns letters to their exact original transforms. Scrolling or window blur cancels a drag. Resizing, leaving the viewport, hiding the document, or unmounting clears motion and capture. All observers, listeners, and frames are cleaned up.

`src/components/kinetic/kinetic-name.css` contains the display treatment, container-relative sizing, outline anchors, focus-compatible control, and touch behavior. Original character slots stay in layout, so transforms cannot reflow the heading or content below it. Rotation and stretch are included in a viewport guard so even spring overshoot stays inside the screen edges. Mobile movement is scaled to 65 percent. Only character slots reserve touch gestures; the spaces around them and the rest of the page scroll normally.

## Accessibility and performance

There is still one H1, with one accessible text node, “Muhammad Yassa.” The visual letters and punctuation are hidden from assistive technology. The animated name is decorative, so keyboard users have one useful control rather than fourteen letter stops. Its native button semantics, visible focus, and keyboard activation are retained. The original heading also remains visible in prerendered HTML without JavaScript. Text selection outside the letter slots is unaffected.

No dependencies were added. The solver works on fourteen glyphs, uses GPU-friendly transforms, caches measurements, removes `will-change` after movement, and sleeps when settled. There are no global pointer-move handlers or permanent idle frame loops. Existing Framer Motion remains responsible for the rest of the site. The name uses its own subscribed reduced-motion query because the installed Framer Motion hook only reads the initial preference.

## Validation and artifacts

The tests in `tests/kinetic.spec.js` exercise the entrance; desktop proximity; actual mouse and Chrome-emulated touch drags; neighbor response; spring-back; real letter clicks and taps; repeated keyboard waves; focus indication; pointer cancellation; window blur; resize and scroll interruptions; extreme screen-edge pulls at 320, 390, and 1440 pixels; live reduced-motion changes; and the city immediately after playing with the name. They record video and sample layout shift and frame timing. Existing tests cover portfolio content, resume download bytes, navigation, screenshot dialogs, pipeline controls, no-JavaScript rendering, automated accessibility, and city exploration.

Run from the repository root:

```powershell
npm.cmd run lint
npm.cmd run build
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort
# In another terminal; the suite reuses the local preview above.
npx.cmd playwright test --reporter=line
```

Using a directly owned Vite process avoids the existing Windows nested npm preview teardown hang. Stop the preview when finished. Browser testing uses installed headless Chrome, including touch emulation; this is not a physical iPhone/Android test or a manual screen-reader audit.

Artifacts generated under the ignored `test-results/` directory include:

- `kinetic-1440-rest.png`, `kinetic-390-rest.png`, `kinetic-768-rest.png`
- `kinetic-1440-entrance.png`, `kinetic-390-entrance.png`
- `kinetic-1440-magnetic.png`, `kinetic-1440-drag.png`, `kinetic-390-drag.png`
- `kinetic-1440-pluck.png`, `kinetic-390-pluck.png`, `kinetic-390-reduced.png`
- `kinetic-interaction-1440.webm`, `kinetic-interaction-390.webm`
- `kinetic-metrics-1440.json`, `kinetic-metrics-390.json`, `kinetic-frame-times.json`
- Existing whole-page screenshots at 1440, 768, 390, and 320 pixels and the city interaction artifacts.

Videos record the actual entrance and interactions. The desktop recording is scaled to 1280 by 978 to limit capture overhead; screenshots use the actual viewport resolution. Performance observers include capture and other page work, so long-task counts are not an isolated physics benchmark. Frame timing is a local headless measurement and does not guarantee a frame rate on other hardware.

The recoverable local checkpoint before this feature is **`960defc`**, which includes the existing miniature NYC work. No push or deployment is part of this change.

### Results from November 19, 2026

- Lint and production build passed, including prerender, production CSP, local assets, anchors, CNAME, and resume checks.
- The full browser suite passed **18 tests**. The four kinetic tests passed again after the final font-preload adjustment and additional stationary-pointer and native-touch-scroll assertions.
- Automated WCAG A/AA checks and overflow checks passed at 1440, 768, 390, and 320 pixels. Extreme first/last letter pulls also stayed inside the viewport at 320, 390, and 1440 pixels.
- Recorded desktop and touch sequences produced no browser console/page errors. The final sequences measured approximately **0.00006 layout shift on desktop** and **0 on mobile**.
- The two-second pluck sample recorded **121 frame intervals**, **16.7 ms median**, and **17.0 ms 95th percentile** in local headless Chrome. Long-task observers saw one 53 ms task on desktop and two 55–56 ms tasks on mobile across the captured page interactions; these include capture and page work.
- Desktop, tablet, mobile, entrance, magnetic, drag, and reduced-motion stills were visually inspected. Frames were also decoded from both actual WebM recordings to inspect the captured output.
- Final whole-site client assets: JavaScript **363.79 kB / 117.68 kB gzip** and CSS **41.23 kB / 9.97 kB gzip**. The new font is **21,748 bytes**. No dependencies were added.
