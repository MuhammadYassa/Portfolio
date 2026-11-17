# Verification — November 16, 2026

> Historical first-modernization results. The subsequent dark-theme revision includes the current resume PDF and additional motion tests; see [REVISION.md](REVISION.md) and its referenced current local artifacts.

This report covers the local Windows checkout. Production deployment, public TLS issuance, and GitHub Actions execution were not performed. Content uses the supplied task brief because no current resume PDF was present.

## Executed checks

| Command / check | Result |
| --- | --- |
| `npm ci` | Passed. Clean install from the regenerated lockfile; 161 packages installed, 168 audited by the installer. |
| `npm run lint` | Passed, zero warnings; ESLint 10, Hooks and Refresh rules. |
| `npm run build` | Passed. Client build, production React prerender, and artifact checks. |
| `npm audit --json` | Exit 0, zero findings across all dependencies; saved as `audit-after.json`. |
| `npm audit --omit=dev --json` | Exit 0, zero production findings; saved as `audit-production.json`. |
| `npm run test:browser` | All 5 Playwright tests passed in installed Google Chrome against `vite preview` (19.7 seconds). |
| Development server + headless Chrome smoke | HTTP 200; React refresh preamble and interactive personal note worked, with no browser errors. An initial terminal-only selector encoding issue was corrected before this passing check. |
| Repeated build hashes | All 10 generated artifacts had identical SHA-256 hashes across consecutive unchanged production builds. |
| `npm run social-card` | Passed; generated 1200×630 PNG from the authored SVG using installed Chrome. PNG is approximately 36 KB. |
| Current files and local Git history heuristic secret scan | Zero matches for common GitHub, AWS and Google key formats and private-key headers; no credentials printed. This is not a comprehensive secret-detection audit. |
| Workflow/YAML | Parsed successfully by Prettier; official action tag-to-commit refs checked through GitHub API. Remote execution not performed. |

The full audit snapshot reports 208 dependency entries including platform-specific optional packages. This differs from the 168 packages audited by the install command on this Windows machine. Registry counts are not equivalent to JavaScript shipped to visitors.

## Browser coverage and visual review

- No page errors, console errors, or HTTP 4xx/5xx asset responses in the production browser test.
- Anchor destinations and unique IDs checked by the build; project navigation and field-note navigation exercised in the browser.
- No horizontal document overflow at **1440, 768, 390 and 320 pixels**.
- Axe WCAG 2 A/AA and WCAG 2.1 AA tags: zero automated violations at those four widths.
- Mobile menu: Enter to open, Tab into links, Escape to close and return focus, selecting a link closes the menu.
- Reduced-motion preference: smooth scroll disabled, native personal note opens, back-to-top link works.
- Prerendered project and email content are readable with JavaScript disabled.
- Full-page desktop and mobile screenshots were inspected. Local artifacts: `test-results/portfolio-1440.png`, `portfolio-768.png`, `portfolio-390.png`, and `portfolio-320.png`.
- The first test run had a test-locator failure: it searched for “Menu +” after the button correctly changed to “Close ×”. The locator was fixed to use the stable `aria-controls` relationship; the final five-test run passed. Initial prerender development warnings were resolved by rendering with React's production entry.

## Assets, metadata, and links

The build verifies all local `src`/`href` asset references, the favicon, social PNG, robots file, sitemap, the canonical CNAME value, unique IDs, one primary heading, prerendered content, production CSP, and the absence of the old external integrations. The configured resume is format-checked when present.

- WatchMate: `https://mywatchmate.us` returned 308 to `https://www.mywatchmate.us/`, which returned HTTP 200. This verifies the frontend response, not every feature or backend endpoint.
- GitHub: profile returned HTTP 200. WatchMate, NYC-Housing-Intelligence-Platform and CSCI370S26_Final_Project were confirmed public through the GitHub repository API; the renter README confirms the project identity. Public source trees for WatchMate/backend and frontend exposed no screenshot assets matching PNG/JPG/WebP, so the portfolio uses labeled engineering diagrams.
- LinkedIn: configured to the supplied URL; automated request returned LinkedIn's HTTP 999 restriction. Profile content could not be independently checked. Verify in a normal signed-in browser.
- Email: correct `mailto:` address and request subject are present. Delivery was not tested; no email was sent.
- Resume: no PDF was supplied or found. There is no broken download link; the prominent CTA opens a resume-request email. Adding and reviewing the latest PDF remains an owner action.

## Performance observations

Production JavaScript: **325.51 KB raw / 105.33 KB gzip**. CSS: **19.30 KB raw / 5.43 KB gzip**. The page uses system fonts and local CSS/HTML diagrams instead of runtime image downloads and remote fonts/icons. Prerendered HTML contains the portfolio before JavaScript hydration. No Lighthouse or real-world Core Web Vitals measurement was run; bundle size and layout checks are not a substitute for field performance data.

## Remaining verification limits

No current resume PDF, screen-reader session, Safari/Firefox execution, real mobile hardware run, public TLS provisioning, GitHub Actions execution, or actual deployment was available/performed. Automated axe checks are not a guarantee of full WCAG conformance. The Pages administrative API returned 404 with available access; its actual publishing mode still requires the owner's settings UI. DNS and HTTPS remain external launch actions detailed in `DEPLOYMENT.md`.
