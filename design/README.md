# FigCraft Design Workspace

## Live mode

Start the visible FigCraft app with MCP control:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\design\start-figcraft-live.ps1
```

Keep the FigCraft window open. The workspace MCP config at `D:\Portfolio-Site-main\.mcp.json` attaches to `127.0.0.1:7979`.

## Current artifacts

- `codered-red-signal.figcraft` — editable 12-board design file.
- `build_red_signal_figcraft.py` — initial token/hero/motion boards.
- `expand_red_signal_figcraft.py` — project system, stack/activity/contact, and menu overlays.
- `finalize_red_signal_figcraft.py` — mobile work/contact, booking modal, social preview, and UI states.

### Exported review images

- `exports/tokens-concept.png` — 360×900 color/type/spacing board.
- `exports/desktop-concept.png` — 1440×1240 desktop hero and narrative direction.
- `exports/mobile-concept.png` — 390×844 mobile hero direction.
- `exports/motion-concept.png` — 420×844 motion notes.
- `exports/projects-concept.png` — 1440×1660 featured work and archive system.
- `exports/contact-concept.png` — 1440×1100 stack, activity, contact, and footer.
- `exports/menu-concept.png` — 1440×900 desktop menu overlay.
- `exports/mobile-menu-concept.png` — 390×844 mobile menu overlay.
- `exports/mobile-work-concept.png` — 390×2000 mobile work/contact flow.
- `exports/booking-concept.png` — 1200×800 booking modal.
- `exports/og-concept.png` — 1200×630 social preview.
- `exports/ui-states-concept.png` — 900×700 buttons, inputs, chips, and focus/error states.
- `exports/works-reference-concept.png` — 1440×1200 reference-inspired Works system pass.

## Notes

- FigCraft currently uses Inter as the local rendering stand-in; production should use Geist/Geist Mono.
- The design now covers the primary page, responsive behavior, menu overlay, booking modal, project system, UI states, and social image.
- The next step is implementation against these boards, with visual exports used as review references.
