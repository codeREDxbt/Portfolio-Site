# codeRED Portfolio Redesign Plan

> Source of truth for the FigCraft-first redesign.  
> Reference direction: `https://www.shaahid.in` — adapted for Vinayak/codeRED, not copied verbatim.

## 1. Current-state audit

### Existing stack

- Static `index.html`, `style.css`, and `script.js`.
- Vercel serverless functions in `api/`.
- No React/Next framework currently implemented.
- Deployment target: Vercel.
- CLI card package exists at `cli/` (`npx coderedxbt`).
- No Git repository detected from the workspace root; initialize version control before the rebuild.

### Existing content worth preserving

- Name/identity: Vinayak Vashisth / codeRED.
- Positioning: Web3 × full-stack developer.
- Email: `codeREDx07@proton.me`.
- GitHub: `https://github.com/codeREDxbt`.
- LinkedIn: `https://www.linkedin.com/in/vinayak-vashisth-6b8204331`.
- X: `https://x.com/codeREDxbt`.
- Resume: `01 Resume Vinayak.pdf`.
- NPX card: `npx coderedxbt`.
- Booking flow with `/api/booking`.
- GitHub contribution endpoint.
- Visitor counter endpoint.

### Current projects

1. **Veilpay** — production-oriented multi-chain wallet with protocol-specific address isolation and fiat on/off-ramp. Current build; strongest lead project.
2. **PayTrack** — employee attendance, overtime, and payroll dashboard. Strong polished product visual.
3. **StellarPulse** — real-time Stellar explorer and analytics platform. Strong technical/data angle.
4. **MediChainAI** — AI-powered decentralized medical records and diagnostics.
5. **Blockademia.live** — Web3 learning and certification platform.
6. **Aptos LMS** — no-code LMS dApp with Move smart contracts.

Recommended hierarchy: feature four projects prominently, then place the remaining two in a compact archive/list treatment.

### Current UX/visual problems

- Generic dark glassmorphism and starfield treatment.
- Too many simultaneous effects: particles, cursor trail, parallax, floating avatar, pulse/bounce, auto-scroll.
- Project cards are duplicated for infinite scrolling, hurting semantics and maintainability.
- No `prefers-reduced-motion` support.
- Many external links lack `rel="noopener noreferrer"`.
- CSS has duplicated sections and stale rules.
- `README.md`, `package.json`, and tests reference an absent Express `server.js`.
- `npm test` is a placeholder; included server tests cannot run against the current file layout.
- CSP currently allows broad inline scripts/styles and should be tightened after implementation.

## 2. Design objective

Create a premium, editorial, design-engineer portfolio that feels closer to a high-end independent studio site than a template portfolio.

The 30-second answer must be obvious:

1. Who: Vinayak Vashisth / codeRED.
2. What: full-stack and Web3 engineer with strong product/interface instincts.
3. Proof: Veilpay, PayTrack, StellarPulse, Blockademia, and selected technical work.
4. Action: view work, book a call, email, or download resume.

## 3. Creative direction

### Direction name

**Red Signal Editorial**

A restrained, dark, editorial interface with precise typography, generous negative space, project metadata, smooth mask reveals, and one controlled red “signal” motif representing codeRED.

### What to borrow from the reference

- Calm editorial confidence.
- Numbered narrative sections.
- Large typography with character/line reveals.
- Project rows with role, year, stack, and live links.
- Menu overlay with staggered navigation.
- Smooth scroll and subtle parallax.
- Minimal but memorable footer.

### What should be different

- Stronger engineering credibility and proof.
- codeRED red accent instead of neutral-only styling.
- One ambient WebGL/Three.js moment rather than several unrelated effects.
- Project presentation tailored to Web3/product engineering.
- Keep the NPX command as a distinctive developer-portfolio detail.
- Keep booking and GitHub activity, but redesign them as focused utility sections instead of visual clutter.

## 4. Information architecture

Single-page first, with room for case-study routes later.

1. **Navigation / menu**
   - Index, Work, Stack, Resume, Contact.
   - Social links in menu/footer.
2. **Hero**
   - Name, role, location/status, concise positioning statement.
   - Primary CTA: View Work.
   - Secondary CTA: Book a Call.
   - Ambient red-signal WebGL/visual motif.
   - Small `npx coderedxbt` command chip.
3. **Intro / Approach / Now**
   - `[01] Intro`: concise identity and product engineering summary.
   - `[02] Approach`: security, clarity, performance, shipping.
   - `[03] Now`: currently building Veilpay; open to select opportunities.
4. **Featured Work**
   - Four large editorial project entries with media, role, year, stack, live/repo links.
   - Two archive entries in a compact list.
5. **Stack / Systems**
   - Grouped by product engineering, Web3, backend/data, and workflow.
   - Avoid a large decorative icon wall.
6. **Proof / Activity**
   - GitHub contribution visualization.
   - Small metrics only if they are real and useful.
7. **Contact**
   - Large statement, email, booking CTA, resume.
   - Footer with socials and visitor count if retained.

## 5. Visual system

### Color

- Background: warm off-black `#0C0A09`.
- Elevated surface: `#171513`.
- Primary text: `#F5F2ED`.
- Muted text: `#A6A09B`.
- Dim text: `#6F6963`.
- Hairline: `rgba(245, 242, 237, 0.10)`.
- Accent red: `#E5484D`.
- Accent red soft: `rgba(229, 72, 77, 0.14)`.
- Success green, GitHub only: `#67C792`.

Use red sparingly: active states, signal lines, key labels, hover details, and the 3D motif.

### Typography

- Display/body: **Geist** or **Geist Sans**.
- Metadata/code: **Geist Mono**.
- Occasional handwritten annotation: **Shantell Sans**, only for tiny annotations.

Do not use the current browser fallback stack as the visible design font.

### Layout

- Max content width around `1120–1200px`.
- Large section spacing: `120–180px` desktop, `72–96px` mobile.
- Editorial two-column metadata/body rhythm.
- Hairline dividers instead of heavy boxed cards where possible.
- Project media can break the grid slightly for energy.

### Surfaces

- Mostly flat, deep surfaces with hairline borders.
- Use blur only for fixed navigation/menu overlays.
- Avoid generic heavy card shadows.
- Use subtle grain/noise as a fixed non-interactive layer if performance allows.

## 6. Motion language

### Principles

- Motion should feel weighted and intentional.
- Animate only `transform` and `opacity`.
- Use viewport triggers rather than raw scroll listeners.
- Every animation must have a reduced-motion alternative.

### Signature interactions

- Initial page load: short, staggered line/character reveal.
- Menu: full-screen overlay, staggered links, subtle background dim.
- Section entry: masked text reveal plus gentle fade-up.
- Project rows: media reveals through a mask; metadata staggers in.
- Project hover: media scales `1.015–1.03`, title shifts slightly, red signal line expands.
- Smooth scroll: Lenis-style inertia on capable devices.
- 3D hero: slow ambient motion and pointer parallax only; no continuous DOM particle spawning.

## 7. 3D / graphics scope

Use one controlled WebGL moment in the hero:

- Abstract red-signal object: particle constellation, wireframe signal core, or braided line structure.
- Slow rotation/idle movement.
- Pointer-follow camera drift limited to a few degrees.
- Static CSS/SVG fallback for reduced motion, mobile constraints, or WebGL failure.
- Load dynamically after the initial content render.

Do not add pathtracing, physics, or heavy postprocessing unless a later prototype proves it is worth the cost.

## 8. Recommended technical stack

Move to a componentized frontend rather than patching the current monolith.

- **Next.js + TypeScript**: routing, metadata, image optimization, maintainable components.
- **Tailwind CSS**: token-driven styling and responsive implementation.
- **Motion**: UI transitions, layout transitions, viewport reveals.
- **Lenis**: smooth scrolling where appropriate.
- **Three.js**: one dynamically loaded hero scene.
- **Anime.js**: optional for a highly specific text/timeline sequence; do not mix it with Motion without a clear reason.
- **FigCraft**: design system, screen design, and exportable references.
- **Remotion/video stack**: not required for the site itself; reserve for a future launch reel or social preview video.

Suggested initial dependencies: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `motion`, `lenis`, `three`, and development tooling. Add Three types and testing tools as needed.

## 9. API and backend plan

Preserve the current serverless behavior while cleaning up routing.

Required endpoints:

- `GET /api/health`
- `GET /api/github-contributions?username=codeREDxbt`
- `POST /api/visitor-increment`
- `POST /api/booking`

Implementation options:

1. Keep compatible Vercel handlers during migration, then convert to Next route handlers.
2. Convert immediately to `app/api/*/route.ts` with shared validation, rate limiting, CORS, and error helpers.

Preferred: convert immediately, but preserve request/response contracts so the frontend behavior remains stable.

Backend requirements:

- Rate limits retained.
- Input validation retained.
- Discord webhook booking notification retained via `DISCORD_WEBHOOK_URL`.
- GitHub API failure fallback retained.
- No secrets committed.
- Tests call route handlers directly instead of depending on a missing Express server.

## 10. FigCraft design workflow

FigCraft MCP is configured at `D:\Portfolio-Site-main\.mcp.json` and verified against FigCraft `0.16.0`. The active configuration uses attached mode at `127.0.0.1:7979`, so design edits are visible live in the desktop app. Start it with `design/start-figcraft-live.ps1` before reconnecting the MCP client. Headless mode remains available by replacing the MCP args with `mcp --no-system-fonts --automation-read-root D:/Portfolio-Site-main --automation-write-root D:/Portfolio-Site-main`.

Design artifacts to create before coding:

1. **Design tokens board**
   - Colors, type scale, spacing, radii, borders, focus states.
2. **Desktop home concept**
   - 1440px-wide artboard showing hero, intro/approach, first project entry, and navigation/menu state.
3. **Mobile home concept**
   - 390px-wide artboard proving the editorial structure works without relying on hover or WebGL.
4. **Project system board**
   - Featured project template, archive row template, image treatment, metadata layout, hover annotations.
5. **Motion annotation board**
   - Entry order, easing notes, reduced-motion fallbacks, 3D behavior notes.
6. **Exports**
   - PNG previews for review and implementation comparison.

Suggested file path: `design/codered-red-signal.figcraft`.  
Suggested export path: `design/exports/`.

## 11. Implementation sequence

### Phase 0 — Safety and repository hygiene

- Initialize Git if absent.
- Commit or archive the current working version.
- Keep the existing static site available until the replacement is verified.

### Phase 1 — FigCraft design

- Build the token board and first desktop/mobile concepts.
- Export review PNGs.
- Lock typography, spacing, project order, and hero direction.

### Phase 2 — Next.js foundation

- Scaffold Next.js + TypeScript + Tailwind.
- Port content into structured data files.
- Add fonts, metadata, sitemap, robots, Open Graph image, and base layout.

### Phase 3 — Core UI

- Build navigation/menu, hero, numbered sections, project list, stack, activity, contact, and footer.
- Ensure semantic HTML and responsive behavior before heavy animation.

### Phase 4 — Motion and 3D

- Add Motion viewport reveals and menu transitions.
- Add Lenis behind capability checks.
- Add lazy-loaded Three.js hero scene.
- Add reduced-motion and WebGL fallbacks.

### Phase 5 — APIs and integrations

- Migrate serverless endpoints.
- Preserve booking flow, GitHub graph, visitor counter, and resume links.
- Add robust loading/error/empty states.

### Phase 6 — QA and launch

- Run lint, typecheck, tests, production build.
- Test desktop/mobile breakpoints and keyboard navigation.
- Run Lighthouse and accessibility checks.
- Verify Vercel deployment, headers, sitemap, and Open Graph output.

## 12. Quality gates

### Performance

- Initial route remains server-rendered/static where possible.
- Initial JS target: under ~180KB gzip before optional 3D chunk.
- Lazy-load Three.js and noncritical visuals.
- LCP under 2.0s on good mobile connection.
- CLS under 0.05.
- INP under 200ms.
- Images converted to modern formats with explicit dimensions.

### Accessibility

- Semantic landmarks and one clear `h1`.
- Visible focus states.
- Keyboard-accessible menu, project links, and booking modal.
- `prefers-reduced-motion` fully respected.
- Color contrast checked.
- External links use `rel="noopener noreferrer"`.

### SEO/share

- Unique title and description.
- Canonical URL.
- Open Graph and Twitter metadata.
- Valid sitemap and robots configuration.
- Purpose-designed OG image rather than reusing the logo.

## 13. First design decision to lock

The first FigCraft pass should compare two hero treatments:

- **A — Editorial Signal:** large typographic statement, right-side metadata, subtle red line/particle motif.
- **B — Object-Led:** typographic left column with a more visible abstract red WebGL object on the right.

Recommended default: **A — Editorial Signal**, because it matches the reference’s restraint and leaves room for the codeRED identity to feel distinctive rather than decorative.
