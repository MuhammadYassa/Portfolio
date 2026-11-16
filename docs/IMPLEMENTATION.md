# Implementation and code understanding checkpoint

## What was retained and why

This remains a single-page React/Vite portfolio. The existing Header, Hero, NavBar, AboutMe, Projects, Project, Reveal, Contact, and Footer component roles were retained and refactored. The purple identity and interactive name lettering remain in a quieter form. Tailwind CSS and Framer Motion remain; no new production framework or service was added.

The old project content described beginner Java apps, used hover-only descriptions, and included fixed-height sections, deeply nested headings, redundant routers, icon-only controls, an external form processor, CDN fonts/icons, and substantial tilt effects. Those elements prevented an accessible, current presentation. Their outdated implementations and assets were removed. The unused loading screen was also removed. A new Experience section presents the supplied internship separately.

## How the page works

### Content first: `src/data/portfolio.js`

`profile`, `projects`, `experience`, and `skills` contain the editable facts. Components render this data; they do not fetch a CMS or project statistics at runtime. The metrics are the supplied November 2026 snapshot, not live counters. `contentYear` keeps the static snapshot and prerendered copyright consistent, including across a year boundary. Update it when refreshing the portfolio.

`projects` explicitly separates live WatchMate, the housing platform under development, and the academic team project. Housing's future address resolution, datasets, and AI functionality are described as planned. The DNRcast audience metric stays attached to the broader app. Only verified public repository URLs were added; no housing/renter demo was invented.

### Composition: `App`, `Header`, and the sections

`App` in `src/App.jsx` defines the reading order: hero, projects, experience, about/education/skills, contact, footer. It includes one main landmark and a skip link. Projects get the earliest substantive position and the most space.

`Hero` uses an oversized name with per-letter hover treatment, restrained introductory writing, a project CTA, `ResumeLink`, and a field note that links directly to the housing project. The original purple/name-letter idea survives without the old full-screen effects. `AboutMe` uses native `details` for the small One Piece note, which works without application state.

### Project presentation: `Project` and `ProjectGraphic`

`Projects` maps the data into the reusable `Project` component. Each article exposes its status, description, technologies, always-visible highlights, and verified links. Optional metrics are definition lists. The live and repository links have `noopener noreferrer`.

`ProjectGraphic` renders small HTML/CSS architecture and workflow diagrams. They have accessible descriptions and explicit captions identifying them as diagrams. The WatchMate graphic explains the API, database, cache, and async import arrangement. The housing graphic shows discover/validate/merge. These are not fabricated product screens; no screenshot assets for the current projects were supplied in the checkout. A newly added project should receive its own diagram branch or an authentic optimized screenshot with dimensions and meaningful alt text.

### Interaction: `NavBar`, `Reveal`, `ResumeLink`

`NavBar` uses native fragment links instead of a React router. The only local state is the mobile disclosure. `aria-expanded` reports its state, `aria-controls` links the button to the panel, link selection closes it, and `closeOnEscape` closes it and restores focus. This is an inline disclosure, so it needs no modal focus trap. Hidden mobile links are excluded from keyboard focus by CSS `display: none`.

`Reveal` keeps the existing animation boundary with much less behavior. Its content starts visible; intersection observation only adds a small entrance movement. `useReducedMotion` disables that movement. `MotionConfig` applies the user preference globally, and CSS disables smooth scrolling, transitions, and hover transforms when reduced motion is requested. `LazyMotion`/`m` limit the Motion features used by the page.

`ResumeLink` reads `profile.resume`. Until the current PDF exists, its label is **Request my resume** and it opens a preaddressed email request. Once `/resume.pdf` is configured, it becomes **Resume PDF** and opens the actual file. No old file or fake download was substituted. `check-build.mjs` deliberately fails if a configured PDF is absent or has an invalid PDF signature.

### Styling: `src/index.css`

The theme uses warm paper, dark ink, and muted purple; project graphics add restrained green and sand. System fonts eliminate render-blocking font providers and font-related shifts. Shared shell, section, button, card, metric, and typography rules keep spacing consistent. Media queries adapt columns, navigation, cards, and text at tablet/mobile widths, down to 320 pixels. Tailwind 4's Vite integration replaces the old PostCSS setup; its scanner is scoped to `src/` so audit reports and test artifacts cannot inflate the stylesheet.

### Build and SEO: `prerender.mjs`, `main.jsx`, `check-build.mjs`

Vite builds the client. `prerender.mjs` then asks Vite to build a temporary server entry, renders the **same** `App` using React's production server renderer, writes the markup into `dist/index.html`, and deletes only its fixed temporary output under `node_modules/.cache/portfolio-ssr`. No server is deployed. `main.jsx` hydrates existing production markup; in development it creates the root normally.

This adds a small build step in exchange for immediately readable HTML and crawlable content without running client JavaScript. Keep browser-only APIs inside handlers/effects so future components remain prerender-safe. Use the same data and initial state on server and browser to prevent hydration mismatches. The browser tests catch console/hydration errors; the build checks catch missing anchors and assets. If the temporary SSR entry ever changes filename after a Vite update, the build will fail rather than silently ship an empty portfolio.

`index.html` holds canonical, description, Open Graph, Twitter, favicon, and social card references. `robots.txt` and `sitemap.xml` advertise the root URL. The social PNG is generated from a local SVG and is not a third-party asset. Domain changes require updating all of these together with Pages settings; `CNAME` cannot replace those settings.

### Production policy and workflow

`production-csp` in `vite.config.js` injects a same-origin content policy during production builds. Inline styles are allowed for Motion; inline scripts and remote resource hosts are not. Development intentionally omits the policy for Vite refresh/HMR. GitHub Pages cannot supply arbitrary application response headers through this repository, and a meta policy cannot enforce `frame-ancestors`.

The Pages workflow separates validation/artifact creation from privileged deployment. Actions are pinned, checkout credentials are not persisted, PRs cannot publish, deployment jobs are serialized, and only the deploy job can write Pages deployments. Future audit or browser failures stop publication. DNS and actual repository Pages settings remain external controls; a passing local build cannot repair them.

## Dependency modernization and security findings

Installed and compatibility-checked: React/React DOM 19.3.1, Vite 8.3.8, React plugin 6.3.0, Tailwind CSS/Vite plugin 4.3.5, Framer Motion 14.14.0, ESLint 10.15.0, Hooks plugin 7.1.1, and Refresh plugin 0.5.8. Node 22.20.0 was available locally and satisfies Vite's engine; CI targets Node 24 LTS. Versions and peer relationships were queried from npm. The supported ESLint 10 migration also removes the React lint plugin whose declared peer support stops at ESLint 9. Core linting, Hooks/Refresh rules, browser tests, and axe remain enabled.

Removed `tailwind` (an unrelated backend framework, not Tailwind CSS), `gh-pages`, both router packages, unused type packages, the old PostCSS/autoprefixer toolchain, and obsolete dependencies pulled by those packages. The locked dependency count dropped substantially; see the snapshots for exact trees. No forced audit remediation or blanket major-version override was used. Compatible transitive updates resolved the remaining `yaml` finding after the main cleanup.

The initial audit invocation reported **78 affected packages** (7 low, 25 moderate, 43 high, 3 critical). The subsequent saved pre-change audit returned **48** (5 low, 13 moderate, 28 high, 2 critical); both invocations used the old dependency inputs, but their returned counts differed. `audit-before.json` preserves the 48-package result, rather than pretending it is the 78-package response. These counts describe affected package entries, not 48 independent, exploitable vulnerabilities in the deployed static page.

| Finding family in saved baseline | Exposure and remediation |
| --- | --- |
| Critical lodash code injection/prototype pollution and proxy-addr IP spoofing | Pulled into the unnecessary backend `tailwind` tree. Removed that entire unused production dependency graph; no backend is deployed. |
| High Express/body-parser/qs/path-to-regexp/jsonwebtoken/ws and associated packages | Unnecessary server framework transitive dependencies, removed with `tailwind`. |
| High React Router redirect/XSS advisories | Router was used only for fragment navigation. Removed the routers and use native links. |
| High Vite / Rollup / PostCSS / source-map-js / glob and other tooling entries | Updated/replaced the build toolchain and compatible transitives; development servers bind to loopback. These are distinct from the shipped static application exposure. |
| High brace-expansion/flatted and moderate yaml in intermediate installs | Removed outdated lint dependency paths and refreshed compatible transitives. Final audits capture the remaining state. |
| CDN styling/icon dependencies and external contact submission | Removed to shrink external trust and collection surfaces. Direct email is used instead. |
| Workflow token scope and mutable action tags | Scoped job permissions, pinned verified official action commits, disabled credential persistence, added dependency maintenance. |

Representative baseline advisories: [lodash template command injection](https://github.com/advisories/GHSA-35jh-r3h4-6jhm), [proxy-addr IP spoofing](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), [Router open redirect XSS](https://github.com/advisories/GHSA-2w69-qvjg-hvjx), [YAML stack overflow](https://github.com/advisories/GHSA-48c2-rrv3-qjmp). The full titles, severities, ranges, dependency paths, and registry links are in the saved baseline JSON.

Final all-dependency and production-only results are saved separately in `audit-after.json` and `audit-production.json`. Zero known registry findings is a dated observation, not a guarantee of vulnerability-free software. See the verification report for executed checks and limitations.
