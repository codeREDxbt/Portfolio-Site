# Follow-up Prompt — codeRED Portfolio: fix motion/menu, then hero + dock + trail exploration

Use this prompt at the start of the next session.

---

We are continuing the codeRED portfolio for Vinayak Vashisth at:

```text
D:\Portfolio-Site-main\Portfolio-Site-main
```

Do not restart from scratch. A LOT is already built and loved. Fix what's broken first, then explore options where marked.

## Current state (what exists now)

- Stack: Next.js 16, React 19, TypeScript 6, Tailwind 4, Motion, Lenis, Three.js.
- Design: "Red Signal Editorial" — dark `#0c0a09` / ivory `#f7f2e8` themes, red `#e5484d`, tokens in `src/app/globals.css`, theme toggle with circular View Transition, no-flash init in `layout.tsx`.
- Boot: `PageLoader.tsx` — signal-acquisition sequence (counter, masked wordmark, status lines) → wordmark docks into the header logo → `codered:release` + `codered:dock` events → `SignalScene` answers with intro ramp + one hot pulse ring.
- Hero: "Nameplate" — `Vinayak Vashisth.` as H1, static red role line, portrait plate (`/brand/photo.jpg`) with caption, "In this edition" project index, meta rail (Role/Based/Status/Contact email), full-bleed `SignalScene` field (wave terrain + grid + streaks + orbiters + origin glow).
- Works: sticky stacked deck with case-file dossier cards (`challenge/decision/outcome` in `portfolio.ts`), hover cursor chip + parallax, sticky heading with hover-secret radar pill.
- Journey ("Trace / Signal log"): sticky slot-machine odometer year + entries from real project data.
- Menu: bottom-center dock pill (`DockNav`) → full-screen "lamp" menu (`SiteMenu`) — warm glow + filament flicker stagger; inert + focus management.
- Footer: curtain reveal (fixed behind page, `--footer-h` measured), red hairline sweep, mega wordmark w/ per-letter hover, ticker (desktop), direct-line CTA, IST clock, visitor count.
- Audit wave DONE: contrast tokens, Lenis focus-chasing, deck offsets (12.25rem/10rem), footer mobile shrink, modal scroll/focus fixes, API hardening. Reports: `D:\Portfolio-Site-main\audit\*.md`.
- Tooling: CDP probe scripts at `D:\Portfolio-Site-main\*.mjs` (real headless Edge verification), Lighthouse via `CHROME_PATH` + npx, concept specs at `D:\Portfolio-Site-main\concepts\`.

## FIRST — fix what's broken (do not redesign before these are fixed + probe-verified)

1. **Scroll animation is not working right.**
   Investigate the Lenis ↔ Motion interaction end to end: deck scale/dim, Journey odometer tracking, hero scroll fade, anchor handler, footer reveal. Suspects: Lenis lerp vs `useScroll` measurements after content height changes; audit's deck offset bump pushing pin points; Lenis yanking programmatic scrolls; IO thresholds vs Lenis velocity. Reproduce at 390/768/1440 with the CDP probes, fix, re-probe until sticky/scroll behavior is smooth and deterministic.

2. **Menu open/close is not working right.**
   Reproduce with `D:\Portfolio-Site-main\menu-probe.mjs` + manual: dock pill → SiteMenu. Check: pill label sync, AnimatePresence exit completeness, z-order (menu z-40 vs dock z-50), inert application/removal, Escape path, focus in/out, body overflow lock, double handlers between DockNav and SiteMenu. Fix and re-probe.

## THEN — hero needs real options (user is not satisfied yet)

The nameplate layout may stay or go — the dissatisfaction is the overall vibe/background. Prototype 2–3 directions and pick the strongest:

- **A. Retune the field** — keep the terrain but make it decisively better: stronger origin glow, denser instrument grid, more legible pointer ripple, better balance around the portrait plate.
- **B. Portrait-forward** — field goes quiet/subdued; the portrait gets the treatment (red duotone/grade, caption furniture, plate annotations); type stays nameplate.
- **C. Pure typographic hero** — kill the WebGL; giant name with the signal living INSIDE the type (blend/mask/shimmer), grain + one signal line. Fastest, boldest.
- **D. New background entirely** — shader-only flowing ribbons/beams (no points), or a slow signal map. Keep GPU budget identical or lower.

Whichever wins: keep the 30-second test (name/role/work/contact on the fold), keep `data-booting` choreography, keep reduced-motion + coarse fallbacks.

## Dock overhaul — options to evaluate

Current: bottom-center pill → full-screen lamp menu. Evaluate:

- **A. Keep + polish** — magnetic pill, pill→overlay shared-layout morph (Motion layoutId), lamp items land with filament flicker (exists).
- **B. Command palette (⌘K)** — the menu becomes an engineer's command menu: fuzzy-find sections/projects/actions ("book a call", "copy npx", theme toggle). Very codeRED. Keep pill as visual trigger + ⌘K hotkey.
- **C. Minimal top bar** — inline links on desktop, overlay only on mobile; dock removed.
- **D. Side rail** — fixed left rail with mono labels + lamp glow on open.

## Trail ("Trace / Signal log") — needs to be unique

Current: sticky odometer + entry rows. Evaluate:

- **A. Terminal log** — entries render like a signal log being typed (mono, cursor, timestamps); scroll reveals each line.
- **B. Constellation map** — milestones as nodes on a faint signal grid, connected by drawn lines; scroll pans the constellation.
- **C. Horizontal scrub** — the year scrubs a horizontal timeline rail with event markers (ties into the instrument language).
- **D. Keep odometer, add expansion** — each entry expands to show the project inline when active.

## Constraints

- Do not break: API routes, booking flow, theme system, reduced-motion paths, mobile.
- Keep the boot loader + dock handshake intact unless a hero option explicitly replaces it.
- Validate everything: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, plus CDP probes + Lighthouse.
- No invented metrics or fake content. Real data only (`src/data/portfolio.ts`).
- Update `PROGRESS.md` before the session ends. Commit with a clear message.

## Expected outcome

A site where scroll + menu are provably smooth, the hero finally feels like *his* portfolio, and the dock + trail carry signatures nobody else's portfolio has.

