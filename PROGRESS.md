# Portfolio Redesign Progress

## Current status

**Status:** Case-study pages shipped locally (`/work/[slug]` for the four featured projects, SSG + per-project OG). Everything validated green. **Not yet pushed** — the user holds the push to review the drafted case-study copy first.

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

## Session 3 — roster overhaul + tuner preview fix

### Content & roster (`src/data/portfolio.ts`)

- Featured four are now **Veilpay, FreelancePay, Avisky, VaultPass**; PayTrack and StellarPulse move to the archive (StellarPulse keeps its "$30 USD" award note).
- New optional `award` field on `Project` (e.g. "$250 USD — Stellar Journey to Mastery", "Client project").
- Archive rows (`Projects.tsx`): prefer `liveUrl` over repo, render award pills, and expand on hover/focus (grid-rows 0fr→1fr accordion revealing description + stack).

### Assets & art

- Featured covers regenerated at **1600×686 (2.332:1)** to match the tuner's 21/9 screen 1:1 — zero `object-cover` crop. New art for Avisky (node-graph radar), FreelancePay (Soroban escrow code + milestone rail), VaultPass (ZK membership gate); Veilpay re-rendered.
- Hero glitch plate: the codeRED mark now bleeds ~28% past the plate edges (`scale-[1.28]`, padding removed) — cropped by the frame for the glitch-poster look.
- SiteNav wordmark: grotesque with the red accent half (matches the boot wordmark).

### Fix — dead space in tuner preview boxes

The station was a side-by-side grid: the `.tuner-screen` frame stretched to the dossier column's height (grid `align: stretch`) while the image stayed width-locked at 21/9, leaving a ~164px empty band under the cover (most visible in light theme). The station is now **one centered lockup**: the screen's width derives from the viewport height (`min(100%, calc(38vh*21/9))`) so the 2.33:1 cover always fills the frame edge-to-edge, and the dossier band below (meta + host, decoded title + award pill, 3-column case file, Open feed CTA) aligns to the screen's exact width. Probe-verified: screen 798×342 vs media 796×340 (1px border), zero dead space; stage raised to 68vh.

- `ProjectMedia` gained a `fill` prop (fills its parent instead of owning an aspect ratio); list/card usages unchanged.
- Journey constellation node spacing now adapts to the roster size (`60 + i*520/(n-1)`) so the map always fills its 640-wide frame.

### Build pipeline — production builds now use webpack

Turbopack build (Next 16.4.5) **deterministically fails to emit the dynamically-imported `RibbonField` chunk**: the prerendered HTML references it, the file is never written to `.next/static/chunks` → runtime `ChunkLoadError` → hydration stalls (no tuner, no dock pill). Reproduced across three clean builds (`.next` deleted, config variations). `npm run build` now runs `next build --webpack`; dev stays on Turbopack. Revisit after a Next upgrade.

### Probe tooling hardening (`D:\Portfolio-Site-main\*.mjs`, not committed)

- Hydration-aware waits (boot cleared + `#work` + dock pill mounted) with a `documentElement`-null guard during navigation.
- Mobile runs now emulate `pointer: coarse` / `hover: none` (headless reports `pointer: fine` by default, which needlessly spins up software WebGL at 390px).
- Page errors + eval exceptions are surfaced to stderr (silent `undefined` results masqueraded as layout bugs before).
- Trail assertion is roster-aware: parses the rendered `NN / MM` counter and verifies the final node activates on the real user path (scroll to page bottom).

### Validation (this session)

```text
npm run lint       PASS
npm run typecheck  PASS (in build)
npm test           PASS — 3 tests
npm run build      PASS (webpack)
```

`final-check.mjs` at 390/768/1440 — **ALL GREEN**: boot clear, one H1, anchor tween + target focus at 96px, tuner station transitions with distinct readings, trail progression + final node at page bottom (7/8), footer reveal, menu open/Escape/navigate. Tuner geometry probe: no dead band, covers served at 2.332. Screenshots verified in both themes.

## Session 4 — case-study pages (`/work/[slug]`)

### Content model (`src/data/portfolio.ts`)

- New optional `caseStudy` on `Project`: `{ lede, challenge[], decision[], outcome[] }` — the tuner keeps the one-line `caseFile`; the page carries paragraphs.
- Drafted for the featured four, grounded in public sources (veilpayapp.com, the public Veilpay monorepo README, freelancepayxbt.vercel.app, avisky.in, vaultpassxbt.vercel.app) — **no invented metrics**; only facts already public (chains, protocols, feature names, real awards). **Copy is drafted-for-review: read it before pushing.**
- Grounding corrections worth knowing: Veilpay is an Expo/React Native mobile wallet + Express/Prisma/Postgres/Redis merchant backend with Circom/snarkjs circuits and EIP-5564 stealth addresses (the site's `stack` field stayed as-is); VaultPass runs on Midnight *preview* with Lace/1AM wallets; AviQ's "20 tests / 1,000 MCQs" is the product's own content spec, not an impact metric.

### Route (`src/app/work/[slug]/page.tsx` — first dynamic route)

- SSG via `generateStaticParams` (featured-with-caseStudy only), `dynamicParams = false`, `notFound()` otherwise; first `generateMetadata` in the repo — `{title} — Case File | codeRED`, canonical, per-project OG image (the 1600×686 cover).
- Page: minimal chrome (SmoothScroll + SiteNav only — no boot, dock, or curtain footer); `[ CASE FILE — NN/04 ]` kicker + award chip, `.hero-line` title, lede, meta rail, CTAs (Open feed / Source / ← Back to works), cover in the `.tuner-screen` frame language with static brackets, three numbered chapters (Challenge/Decision/Outcome) with a sticky "signal path" anchor rail (desktop), "Next transmission" panel wrapping 04→01, thin mono footer.
- Supporting changes: `SiteNav` brand `#index` → `/#index` (now a `next/link`, works from sub-pages); `ProjectMedia` gained `linked={false}` (plain frame, no outbound anchor/chip) + `sizes` prop; `TunerStation` + `TunerStationListItem` gained a ghost `Read case file →` pill next to Open feed (active-station `tabIndex` gating preserved); `sitemap.ts` lists all four case pages.

### Validation (this session)

```text
npm run lint       PASS
npm run typecheck  PASS
npm test           PASS — 6 tests (new projects.test.ts: unique slugs, complete caseStudy, covers on disk)
npm run build      PASS (webpack) — /work/[slug] prerendered ● x4
```

Runtime (`next start`): all four slugs 200; `/work/paytrack` (archived) and unknown slugs 404; one H1, canonical, per-project OG verified in HTML; sitemap lists all routes. Killed a **stale `next start` (PID 3060) left over from the interrupted session** that was holding port 3000 and serving the pre-case-study build. Browser pass (IAB): tuner "Read case file →" navigates to the case page; dark + light themes verified visually at 1440; VaultPass next-transmission wraps to Veilpay; 390px mobile renders clean (rail hidden, CTAs wrap).

### Fix — mobile cover crop ("overlapping" ghost text)

User report: at mobile width a stray "pay." fragment overlapped the first project image. Root cause: the list fallback's media frame was `aspect-[16/10]` below `md`, so `object-cover` cropped ~16% off each side of the 2.33:1 designed covers — slicing the bottom-left title lockup down to "…pay." peeking out from the frame edge (verified by hiding `#work img`: fragment gone). Fix: `ProjectMedia`'s non-fill frame is now `aspect-[21/9]` at all widths (the aspect the covers were designed for; only `TunerStationListItem` uses non-fill). Verified at 390px: covers render edge-to-edge, full lockups intact, dossier + CTAs clean.

## Pending

### Review

- **Review the drafted case-study copy in `src/data/portfolio.ts` (Session 4) — this is the current push blocker.**
- Review the FigCraft boards visually in the open FigCraft app.
- Review the local site in a browser.
- Confirm the final project order and copy.
- Decide whether Veilpay remains the lead project without a screenshot.

### Optional polish

- Hero scale was adjusted after review so the headline fits standard desktop viewports.
- Veilpay now links to the live product at `https://www.veilpayapp.com`.
- Use `NEXT_SESSION_PROMPT.md` for the next identity/wow-factor pass.
- ~~Add individual case-study pages.~~ **Done (Session 4).**
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
