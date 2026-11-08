# codeRED Portfolio — Red Signal Editorial

A redesigned portfolio for Vinayak Vashisth / codeRED, built from a FigCraft-first design system and implemented as a modern Next.js application.

## Stack

- Next.js 16 + React 19 + TypeScript 6 (latest lint-compatible TypeScript)
- Tailwind CSS 4 design tokens
- Motion for viewport/menu transitions
- Lenis for reduced-motion-safe smooth scrolling
- Three.js for the lazy-loaded hero signal scene
- Vercel App Router serverless API routes
- Vitest for route validation

## Design artifacts

The design source and exports live in `design/`:

- `codered-red-signal.figcraft` — editable 12-board design file.
- `design/exports/` — review PNGs for desktop, mobile, menu, projects, booking, UI states, and social preview.
- `DESIGN_PLAN.md` — full creative and technical plan.

To watch FigCraft live while an agent edits:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\design\start-figcraft-live.ps1
```

## Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## API routes

- `GET /api/health`
- `GET /api/github-contributions?username=codeREDxbt`
- `POST /api/visitor-increment`
- `POST /api/booking`

The booking route accepts `{ name, email, date, time }`, validates payloads, applies rate limits, and optionally sends a Discord webhook when `DISCORD_WEBHOOK_URL` is configured.

## Legacy implementation

The original static HTML/CSS/JS implementation is preserved under `legacy/static-site/` for reference only. It is excluded from linting and the active Next.js build.

## Deployment

The app is ready for Vercel. Set the production root to this directory and provide `DISCORD_WEBHOOK_URL` if booking notifications are required.
