# Portfolio Redesign Progress

## Current status

**Status:** Interaction-repair pass + second design wave complete locally. Scroll/menu are probe-verified deterministic at 390/768/1440; hero, dock, works, and trail carry the new "signal instrument" signatures. Ready for review and deployment.

The project has been rebuilt from the legacy static site into a FigCraft-designed Next.js application using the **Red Signal Editorial** direction.

## Completed

### 1. Discovery and audit

- Audited the existing static HTML/CSS/JS portfolio.
- Reviewed `shaahid.in` as the editorial/motion reference.
- Identified existing content, projects, APIs, assets, accessibility issues, and performance concerns.
- Loaded relevant local skills for portfolio design, premium visual direction, redesign, frontend architecture, and Three.js.

### 2. FigCraft connection

- Installed project MCP configuration at `D:\Portfolio-Site-main\.mcp.json`.
- Verified FigCraft CLI `0.16.0`.
- Verified headless MCP mode.
- Switched to attached mode on `127.0.0.1:7979`.
- Confirmed live edits appear in the visible FigCraft app.
- Added `design/start-figcraft-live.ps1`.

### 3. Design system

Created `design/codered-red-signal.figcraft` with 12 boards:

1. Design tokens
2. Desktop hero
3. Mobile hero
4. Motion notes
5. Project system
6. Stack/activity/contact/footer
7. Desktop menu overlay
8. Mobile menu overlay
9. Mobile work/contact flow
10. Booking modal
11. Social preview
12. UI states

Exports are stored in `design/exports/`.

### 4. Frontend implementation

Implemented:

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4 token system
- Geist Sans and Geist Mono
- Motion viewport/menu transitions
- Lenis smooth scrolling with reduced-motion safeguards
- Lazy-loaded Three.js hero signal scene
- Editorial hero, narrative, stack/activity, contact, and footer
- Reference-inspired Works section with sticky media heading, media-first project cards, metadata rows, and pixel-grid CTA
- Desktop/mobile menu overlay
- Booking modal
- GitHub contribution graph
- Visitor counter
- Copy-to-clipboard `npx coderedxbt` chip
- Custom 404 page
- SEO metadata, canonical URL, Open Graph image, robots, and sitemap

### 5. API migration

Implemented App Router API routes:

- `GET /api/health`
- `GET /api/github-contributions?username=codeREDxbt`
- `POST /api/visitor-increment`
- `POST /api/booking`

Preserved:

- Input validation
- Rate limiting
- CORS allowlist
- Security headers
- Discord booking webhook support
- Visitor counter fallback
- GitHub contribution fallback behavior

### 6. Repository cleanup

- Moved legacy implementation to `legacy/static-site/`.
- Moved public assets into `public/`.
- Updated `README.md`.
- Updated `deploy.ps1`.
- Updated `.gitignore`.
- Cleaned `.env.example`.
- Removed obsolete ESLint configuration.

## Validation

Latest local checks passed:

```text
npm run lint       PASS
npm run typecheck  PASS
npm test           PASS — 3 tests
npm run build      PASS
```

Production build summary:

- Homepage first-load JS: 167 KB
- Shared JS: 103 KB
- Static home page generated
- Dynamic API routes generated
- Robots and sitemap generated

Runtime checks passed:

- Homepage returned 200
- Health API returned 200
- GitHub API returned 200
- Visitor API returned 200 with fallback count
- Booking validation returned expected 400 for invalid data
- CORS headers verified
- One `h1`
- No missing image alt attributes
- No external links missing `noopener`
- Canonical, OG, Twitter, robots, and sitemap metadata verified

## Dependency status

Dependencies were upgraded to the latest compatible versions:

- Next.js 16.4.5
- React 19.3.1
- Motion 14.10.1
- Three.js 0.187.0
- Tailwind CSS 4.3.5
- ESLint 10.14.0
- Prettier 3.9.10
- TypeScript 6.0.3
- sharp 0.35.x (dev-only, asset pipeline)

TypeScript 7.0.2 is available, but the official Next.js ESLint chain currently depends on `typescript-eslint`, which supports TypeScript `<6.1.0`. TypeScript 6.0.3 is therefore the latest fully validated compatible version.

A Next 16 production preview was started at `http://localhost:3000` and validated successfully.

## Git history

```text
4ed47e9 Docs: add FigCraft-first portfolio redesign plan
623675e Feat: rebuild portfolio with Next.js red signal design
009ec02 Docs: add portfolio redesign progress tracker
```

The local branch is currently ahead of `origin/main`; changes have not been pushed or deployed publicly.

## Session 2 — interaction repairs + signature redesigns

### Repairs (probe-verified first, before any redesign)

- **Scroll manager** (`src/lib/scroll.ts`): shared Lenis registry, counted page-scroll locks for overlays, content-resize re-measurement, and one `navigateToElement` path for anchor focus+scroll. Fixed the Lenis↔focus race where anchor clicks were yanked by the focus-chase handler (focus is suppressed for the anchor's own target, then the tween starts after overlay unlock).
- **Focus-chase hardening:** never scrolls for elements inside `position: fixed` UI (dock pill, header, dialogs) — this was the "menu click glitches a scroll" bug (0 → 650px jump on first click, verified via CDP trace).
- **DockNav hit target:** hide/reveal is opacity-only — the pill never moves between press and release, so the first click can't be swallowed mid-animation.
- **Menu modal correctness:** portaled dialog, full background inert, Tab trap, Escape, focus returns to the dock trigger; menu-owned links navigate deterministically after close.
- **Journey tracking:** `useScroll` offsets corrected to `start center → end center`; entries progress evenly (probe: 0 → 2 → 4 → 5 across the list).

### Redesigns (user-selected)

- **Hero — "Station":** nameplate layout kept; the old point-terrain is replaced by `three/RibbonField.tsx` — five additive 3D light ribbons (a few hundred vertices vs 10.8k points) that bend toward the pointer and flare on `codered:retune`/`codered:dock`. The eyebrow is a channel readout (`CH 01 · Full-stack Engineer`) that detunes into glyph static and locks onto the next role facet every ~4.2s (`ChannelReadout.tsx`), armed only after boot dock; reduced motion gets static text. The portrait plate is now a **glitch plate** (`glitch-*` CSS): photo ⇄ codeRED mark swap in slice bursts on an 8s cycle with a red scanline flash and synced caption crossfade (`SIG/002 — VINAYAK` ⇄ `SIG/001 — CODERED`). The logo's white backdrop is dropped via `mix-blend-mode: multiply`, so the mark reads as an embossed emblem on both themes. Pure CSS — no JS, no listeners; pauses under `data-booting`; reduced motion collapses to the plain portrait.
- **Dock — lamp menu (kept):** the full-screen lamp menu stays the menu (user preference over a ⌘K palette, which was prototyped and then removed). It now runs on the repaired modal core: portaled dialog, inert background, counted scroll lock, Tab trap, Escape/backdrop close, focus returns to the dock pill, and internal links hand focus to their destination via the shared `navigateToElement` path.
- **Works — LOCK-ON tuner:** `WorkTuner.tsx` + `TunerStation.tsx` replace the stacked deck. Sticky receiver stage, frequency ruler with spring needle on a **shared percentage scale with the station dots** — inside each hold zone the needle's target snaps to the exact detent so the spring wobbles into the dot and rests at 0px drift (probe-verified on all four stations); clickable nodes seek via Lenis. HUD with live MHz + signal bars, per-station detune curve (tune-in/hold/detune), title decode, acquisition brackets, and dead-air static (`NoiseCanvas`, 12fps 2D noise) that the cursor wipes clear via a radial mask. Mobile/coarse/reduced → plain editorial list (`TunerStationListItem`).
- **Trail — Constellation:** `Journey.tsx` renders milestones as nodes on a faint SVG instrument grid; connectors draw with scroll progress (`pathLength`), the map pans against the entry list, and the active node locks red with a ping. Odometer removed.

### Asset pipeline (`tools/generate-covers.mjs`, sharp)

- **Designed covers for all four featured projects** — one coherent system (hairline grid, grain, registration ticks, folio microcopy, heavy grotesque lockup), per-project geometry from each product's domain: Veilpay = chain-orbit system + fiat ramp, PayTrack = punch-log bars + clock dial + red overtime, StellarPulse = seeded node graph + pulse sweep + ledger ticks, Blockademia = module chain + certificate seal. Rasterized 1600×900 PNGs via sharp/librsvg; deterministic re-runs.
- **codeRED mark knockout:** the hero glitch plate no longer blend-modes the white-backed logo — the mark is now a true transparent asset (`public/brand/codered-mark.png`): pixel-level chroma knockout of the white backdrop and watermark grays (69% of pixels knocked out), reds hot-graded, blacks warmed to the site ink. The glitch layer just adds a signal drop-shadow glow.

### Removed

- `SiteMenu.tsx`, `WorkStack.tsx`, `StackCard.tsx`, `three/SignalScene.tsx`, `HeroSignalLine.tsx`, `.stack-card` CSS, signal-type scan CSS.

### Validation (this session)

```text
npm run lint       PASS
npm run typecheck  PASS
npm test           PASS — 3 tests
npm run build      PASS
```

CDP probes (real headless Edge): `final-check.mjs` at 390/768/1440 — boot clear, one H1, anchor tween + target focus at 96px, tuner station transitions (Veilpay → StellarPulse), trail progression (0 → 4 → 5), footer reveal, palette open/Escape/Enter-navigate all pass. `motion-probe2.mjs` — reduced-motion and coarse-pointer paths verified (no canvas, no Three chunk, static hero). `hero-probe.mjs` — retune cycles and ribbon canvas alive.

Lighthouse (headless Edge): **accessibility 1.0, best-practices 1.0, SEO 1.0**, performance 0.68 — LCP 4.8s is dominated by the deliberate ~1.8s boot sequence (the LCP nameplate animates in after the curtain lifts) plus software-GL lab conditions; FCP 0.9s, CLS 0, TBT 520ms. Acceptable for a portfolio with a signature boot; revisit only if real-user RUM says otherwise.

## Pending

### Review

- Review the FigCraft boards visually in the open FigCraft app.
- Review the local site in a browser.
- Confirm the final project order and copy.
- Decide whether Veilpay remains the lead project without a screenshot.

### Optional polish

- Hero scale was adjusted after review so the headline fits standard desktop viewports.
- Veilpay now links to the live product at `https://www.veilpayapp.com`.
- Use `NEXT_SESSION_PROMPT.md` for the next identity/wow-factor pass.
- Add individual case-study pages.
- Add more project impact metrics.
- Add a designed light mode if desired.
- Add Playwright/browser-based visual regression tests.
- Add Lighthouse CI.
- Add analytics only if privacy-friendly and necessary.
- Consider Remotion later for a launch reel or social video.

### Deployment

Run the full validation sequence, then push:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
git push origin main
```

Or use:

```powershell
.\deploy.ps1
```

## Maintenance rule

Update this file whenever a major phase, design decision, validation result, deployment, or feature scope changes.
