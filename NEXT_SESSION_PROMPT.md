# Next Session Prompt — codeRED Portfolio Wow-Factor Pass

Use this prompt at the start of the next session.

---

We are continuing a portfolio overhaul for Vinayak Vashisth / codeRED. The project is at:

```text
D:\Portfolio-Site-main\Portfolio-Site-main
```

The first complete redesign has already been designed in FigCraft and implemented. I loved the first draft. Do not restart from scratch. Build on top of the existing direction and make it feel more distinctive, premium, memorable, and personal.

## Current state

- Stack: Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, Motion, Lenis, Three.js.
- Design direction: **Red Signal Editorial**.
- Main design file: `design/codered-red-signal.figcraft`.
- Design exports: `design/exports/`.
- Plan: `DESIGN_PLAN.md`.
- Progress tracker: `PROGRESS.md`.
- Current implementation: `src/`.
- Legacy reference: `legacy/static-site/`.
- Preview command: `npm run dev` or `npm run build && npm start`.
- FigCraft live mode: `powershell -NoProfile -ExecutionPolicy Bypass -File .\design\start-figcraft-live.ps1`.
- MCP config for FigCraft is in the outer workspace at `D:\Portfolio-Site-main\.mcp.json`.

## Goal for this pass

Push the portfolio from “excellent first draft” to “memorable design-engineer identity piece”.

The site should feel like codeRED, not like a polished clone of shaahid.in. Keep the restraint and editorial quality, but add stronger personal authorship, signature interactions, and more cinematic detail.

## What to improve

### 1. Identity and voice

- Make the site feel recognizably codeRED within the first five seconds.
- Improve the hero copy so it sounds specific to Vinayak, not generic.
- Use the red signal motif as a coherent identity system across hero, projects, menu, footer, OG image, and micro-interactions.
- Explore a stronger verbal identity: terse, technical, confident, product-minded.
- Avoid generic phrases like “I build cool stuff” or template portfolio copy.

### 2. Hero wow factor

- Prototype 2–3 stronger hero concepts in FigCraft before coding.
- Improve the Three.js signal scene: make it more sculptural, alive, and intentional.
- Consider particle braids, orbital chains, signal pulses, red wireframe geometry, shader distortion, or a subtle identity mark formed from points.
- Add pointer-reactive depth without making the site feel gimmicky.
- Maintain static and reduced-motion fallbacks.
- Keep the hero content readable and fast on mobile.

### 3. Motion choreography

- Create a more deliberate motion system: entry timing, section reveals, menu transitions, project transitions, hover states, and scroll-linked moments.
- Use Motion for UI/layout transitions.
- Use Anime.js only where timeline choreography is clearly better than Motion.
- Use Lenis only where it improves feel without breaking native behavior.
- Add reduced-motion alternatives for every animation.
- Avoid constant particle spawning or scroll listeners that cause reflow.

### 4. Project storytelling

- Make each featured project feel like a mini case study, not just a card.
- Add project-specific visual treatments and metadata.
- Consider expandable project rows, modal case studies, or dedicated routes if justified.
- Show process, role, stack, decisions, and outcomes where real information exists.
- Do not invent fake metrics. If impact numbers are unknown, use qualitative outcomes.
- Keep Veilpay, PayTrack, StellarPulse, and Blockademia as the primary featured set unless a better order emerges.

### 5. Design details

- Improve typography hierarchy and letter spacing.
- Add tasteful annotations, coordinate marks, captions, or engineering details.
- Use hairlines, masks, and asymmetric spacing for editorial quality.
- Improve hover states and active states.
- Add a more polished booking modal interaction.
- Make the mobile experience feel designed, not just responsive.

### 6. Technical excellence

- Keep the initial homepage fast.
- Dynamic-import or lazy-load heavy visuals.
- Keep Three.js isolated and dispose GPU resources correctly.
- Maintain strong accessibility: focus states, semantic HTML, keyboard support, reduced motion.
- Keep API behavior and security intact.
- Run lint, typecheck, tests, and a production build before finishing.
- Update `PROGRESS.md` before the session ends.

## Available resources

Use the local skill library at `X:\skills`. Search it first and load only relevant skills.

Potentially useful skills:

- `interactive-portfolio`
- `high-end-visual-design`
- `design-spells`
- `anti-slop-design`
- `ui-motion`
- `fixing-motion-performance`
- `frontend-lighthouse`
- `browser-testing-with-devtools`
- `threejs-skills`
- `threejs-shaders`
- `threejs-postprocessing`
- `threejs-interaction`
- `animejs-animation`
- `vercel-react-view-transitions`

External libraries/resources available or worth considering:

- Motion
- Anime.js
- Three.js
- postprocessing
- Lottie if there is a real vector animation use case
- Remotion only if producing a launch/social video, not required for the site
- FigCraft MCP for design iteration

Do not add every library. Use only what materially improves the experience.

## Required workflow

1. Read `DESIGN_PLAN.md`, `PROGRESS.md`, and inspect the current site.
2. Audit the first draft for generic or weak moments.
3. Create or update FigCraft boards before major visual coding.
4. Prototype the strongest 2–3 improvements.
5. Implement the selected direction.
6. Validate with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
7. Check the production preview locally.
8. Update `PROGRESS.md`.
9. Commit the work with a clear message.

## Constraints

- Do not remove the current project without preserving it in Git.
- Do not break the API routes or booking flow.
- Do not sacrifice accessibility for visuals.
- Do not make the site slow just to add effects.
- Do not produce generic AI slop.
- Do not copy proprietary assets or text from the reference site.
- Do not take screenshots if the active agent has no vision capability; use FigCraft document inspection, DOM checks, browser tooling, and exported files instead.

## Expected outcome

A stronger second-draft portfolio that feels:

- More personal to Vinayak/codeRED
- More cinematic and memorable
- More refined in typography and motion
- More credible as a design engineer portfolio
- Still fast, accessible, and production-ready

Start by reviewing the current site and proposing the highest-impact upgrades, then proceed autonomously through design and implementation.
