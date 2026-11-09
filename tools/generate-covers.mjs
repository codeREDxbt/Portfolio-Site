// Asset pipeline — designed covers for featured projects + a knocked-out,
// re-graded codeRED mark for the hero glitch plate.
//
// Covers: SVG artboards (1600×900, site tokens, shared frame/grain/folio)
// rasterized to PNG with sharp (librsvg). Deterministic — same output every run.
//
// Mark: pixel-level chroma knockout of the white backdrop + watermark grays,
// hot grade on the reds, warm ink on the blacks, transparent PNG out.
//
// Run: node tools/generate-covers.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_COVERS = join(ROOT, 'public', 'images', 'projects');
const OUT_BRAND = join(ROOT, 'public', 'brand');

const T = {
  bg: '#0c0a09',
  surface: '#171513',
  strong: '#211d1a',
  ink: '#f5f2ed',
  muted: '#a6a09b',
  dim: '#8d867c',
  line: '#292524',
  red: '#e5484d',
  hot: '#ff6b70',
};

const MONO = 'Consolas, ui-monospace, monospace';
const SANS = 'Arial, sans-serif';

/* Shared frame: hairline grid, grain, registration ticks, folio microcopy. */
function frame(id, folio) {
  return `
  <defs>
    <pattern id="grid-${id}" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="${T.strong}" stroke-width="1"/>
    </pattern>
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.045 0"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="${T.bg}"/>
  <rect width="1600" height="900" fill="url(#grid-${id})" opacity="0.5"/>
  <g stroke="${T.dim}" stroke-width="1.5" fill="none" opacity="0.85">
    <path d="M44 70V44H70M1530 44H1556V70M44 830V856H70M1530 856H1556V830"/>
  </g>
  <text x="70" y="86" font-family="${MONO}" font-size="19" letter-spacing="5" fill="${T.dim}">CODERED / COVER ${id}</text>
  <text x="1530" y="86" text-anchor="end" font-family="${MONO}" font-size="19" letter-spacing="5" fill="${T.red}">${folio}</text>`;
}

/* Title lockup, bottom-left: mono role line over a heavy grotesque title. */
function lockup(title, role, year) {
  return `
  <text x="70" y="716" font-family="${MONO}" font-size="21" letter-spacing="6" fill="${T.dim}">${role} · ${year}</text>
  <text x="66" y="800" font-family="${SANS}" font-size="96" font-weight="800" letter-spacing="-3" fill="${T.ink}">${title}<tspan fill="${T.red}">.</tspan></text>
  <rect x="70" y="826" width="120" height="2" fill="${T.red}"/>`;
}

/* ── Veilpay: multi-chain wallet → orbit system, chain nodes, ramp line ── */
function artVeilpay() {
  const cx = 1010;
  const cy = 400;
  const nodes = [
    { a: -0.35, r: 120, label: '0x7F…A21' },
    { a: 0.9, r: 200, label: '0x3C…88F' },
    { a: 2.4, r: 200, label: '0xB1…0D4' },
    { a: 3.6, r: 290, label: '0x9E…77B' },
  ];
  const nodeSvg = nodes
    .map((n) => {
      const x = cx + Math.cos(n.a) * n.r;
      const y = cy + Math.sin(n.a) * n.r;
      return `
      <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${T.line}" stroke-width="1"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${T.bg}" stroke="${T.muted}" stroke-width="2"/>
      <text x="${(x + 18).toFixed(1)}" y="${(y + 5).toFixed(1)}" font-family="${MONO}" font-size="15" fill="${T.dim}">${n.label}</text>`;
    })
    .join('');
  return `
    <g fill="none" stroke="${T.red}" stroke-opacity="0.28">
      <circle cx="${cx}" cy="${cy}" r="120"/>
      <circle cx="${cx}" cy="${cy}" r="200" stroke-opacity="0.2"/>
      <circle cx="${cx}" cy="${cy}" r="290" stroke-opacity="0.14"/>
    </g>
    <path d="M360 640 L ${cx - 26} ${cy + 26}" stroke="${T.red}" stroke-width="2" fill="none"/>
    <path d="M348 622 L360 640 L342 644 Z" fill="${T.red}"/>
    ${nodeSvg}
    <circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${T.red}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="12" fill="${T.hot}"/>
    <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${T.red}" stroke-opacity="0.3" stroke-dasharray="6 10"/>
    <text x="${cx}" y="${cy + 96}" text-anchor="middle" font-family="${MONO}" font-size="16" letter-spacing="4" fill="${T.dim}">FIAT RAMP ↔ CHAINS</text>`;
}

/* ── PayTrack: payroll ops → timesheet bars, clock dial, overtime readout ── */
function artPaytrack() {
  const rows = [
    ['MON', 300, false],
    ['TUE', 300, false],
    ['WED', 380, true],
    ['THU', 300, false],
    ['FRI', 340, true],
  ];
  const sheet = rows
    .map(([day, w, ot], i) => {
      const y = 240 + i * 64;
      return `
      <text x="760" y="${y + 20}" font-family="${MONO}" font-size="17" fill="${T.dim}">${day}</text>
      <rect x="830" y="${y}" width="300" height="22" fill="${T.strong}"/>
      <rect x="830" y="${y}" width="${w - 140}" height="22" fill="${T.muted}" opacity="0.55"/>
      ${ot ? `<rect x="${830 + w - 280}" y="${y}" width="120" height="22" fill="${T.red}"/>` : ''}`;
    })
    .join('');

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const x1 = 1300 + Math.cos(a) * 88;
    const y1 = 380 + Math.sin(a) * 88;
    const x2 = 1300 + Math.cos(a) * 100;
    const y2 = 380 + Math.sin(a) * 100;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${T.muted}" stroke-width="2"/>`;
  }).join('');

  return `
    ${sheet}
    <g>
      <circle cx="1300" cy="380" r="112" fill="none" stroke="${T.line}" stroke-width="2"/>
      <circle cx="1300" cy="380" r="112" fill="none" stroke="${T.red}" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="520 184" transform="rotate(-90 1300 380)"/>
      ${ticks}
      <line x1="1300" y1="380" x2="1300" y2="312" stroke="${T.ink}" stroke-width="3" stroke-linecap="round"/>
      <line x1="1300" y1="380" x2="1352" y2="412" stroke="${T.red}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="1300" cy="380" r="7" fill="${T.red}"/>
      <text x="1300" y="540" text-anchor="middle" font-family="${MONO}" font-size="17" letter-spacing="3" fill="${T.dim}">OVERTIME +6.5H</text>
    </g>
    <text x="760" y="590" font-family="${MONO}" font-size="17" letter-spacing="3" fill="${T.dim}">WEEK 42 — PUNCH LOG</text>`;
}


/* ── StellarPulse: network explorer → node graph, pulse sweep, ledger ticks ── */
function artStellarpulse() {
  // deterministic scatter (seeded LCG) — same graph every render
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pts = Array.from({ length: 26 }, () => ({
    x: 700 + rand() * 720,
    y: 170 + rand() * 420,
  }));
  const edges = [];
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 150) edges.push([pts[i], pts[j]]);
    }
  }
  const edgeSvg = edges
    .map(([a, b]) => `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${T.line}" stroke-width="1"/>`)
    .join('');
  const nodeSvg = pts
    .map((p, i) => {
      const hot = i % 8 === 0;
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${hot ? 7 : 4}" fill="${hot ? T.hot : T.muted}" ${hot ? '' : 'opacity="0.7"'}/>`;
    })
    .join('');
  const pulse = '700,470 780,470 800,430 830,510 826,470 900,470 920,400 946,500 962,470 1060,470 1080,436 1100,470 1220,470 1242,410 1266,492 1284,470 1420,470';
  return `
    ${edgeSvg}
    ${nodeSvg}
    <polyline points="${pulse}" fill="none" stroke="${T.red}" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="700" y="150" font-family="${MONO}" font-size="17" letter-spacing="3" fill="${T.dim}">LIVE LEDGER STREAM — STELLAR</text>
    <text x="1420" y="600" text-anchor="end" font-family="${MONO}" font-size="15" fill="${T.dim}">+ LEDGER 84,221,908</text>`;
}

/* ── Blockademia: on-chain learning → certificate seal + module chain ── */
function artBlockademia() {
  const modules = ['MOD 01', 'MOD 02', 'MOD 03', 'MOD 04'];
  const chain = modules
    .map((label, i) => {
      const x = 720 + i * 200;
      const y = 520 - i * 84;
      const link =
        i < modules.length - 1
          ? `<line x1="${x + 150}" y1="${y}" x2="${x + 200}" y2="${y - 84}" stroke="${T.red}" stroke-width="2" stroke-dasharray="4 6"/>`
          : '';
      return `
      <g>
        <rect x="${x}" y="${y}" width="150" height="64" rx="8" fill="${T.surface}" stroke="${T.line}"/>
        <rect x="${x}" y="${y}" width="6" height="64" fill="${i === 3 ? T.red : T.dim}"/>
        <text x="${x + 22}" y="${y + 40}" font-family="${MONO}" font-size="18" letter-spacing="2" fill="${T.muted}">${label}</text>
      </g>
      ${link}`;
    })
    .join('');

  return `
    <g transform="translate(1240 300)">
      <circle r="120" fill="none" stroke="${T.line}" stroke-width="2"/>
      <circle r="88" fill="none" stroke="${T.red}" stroke-width="2" stroke-opacity="0.6"/>
      <circle r="80" fill="none" stroke="${T.dim}" stroke-width="1" stroke-dasharray="3 6"/>
      <path d="M-26 2 L-8 20 L30 -20" fill="none" stroke="${T.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-30 78 L-46 116 L-16 96 L0 122 L16 96 L46 116 L30 78" fill="${T.red}" opacity="0.85"/>
    </g>
    ${chain}
    <text x="720" y="620" font-family="${MONO}" font-size="17" letter-spacing="3" fill="${T.dim}">VERIFIED ON-CHAIN CERTIFICATION</text>`;
}


/* ── Logo knockout: white backdrop + watermark grays → transparent; ── */
/* ── reds hot-graded, blacks warmed to the site's ink ── */
async function knockoutMark() {
  const src = join(OUT_BRAND, 'codeRED-logo.png');
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;

    if (max > 205 && sat < 28) {
      data[i + 3] = 0; // white backdrop / watermark → gone
      continue;
    }
    if (max > 168 && sat < 26) {
      data[i + 3] = Math.round(255 * ((205 - max) / 37)); // soft edge roll-off
      continue;
    }
    // hot grade: push the reds toward signal red
    if (r > g + 40 && r > b + 40) {
      data[i] = Math.min(255, Math.round(r * 1.1 + 16));
      data[i + 1] = Math.max(0, Math.round(g * 0.82));
      data[i + 2] = Math.max(0, Math.round(b * 0.85));
    }
  }

  const out = join(OUT_BRAND, 'codered-mark.png');
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  return out;
}

const COVERS = [
  { id: 'veilpay', title: 'Veilpay', role: 'MULTI-CHAIN WALLET', year: '2026', folio: 'PAYMENTS', art: artVeilpay },
  { id: 'paytrack', title: 'PayTrack', role: 'PAYROLL &amp; ATTENDANCE', year: '2025', folio: 'OPERATIONS', art: artPaytrack },
  { id: 'stellarpulse', title: 'StellarPulse', role: 'NETWORK EXPLORER', year: '2025', folio: 'STELLAR', art: artStellarpulse },
  { id: 'blockademia', title: 'Blockademia', role: 'DECENTRALIZED LEARNING', year: '2025', folio: 'WEB3 EDU', art: artBlockademia },
];

async function main() {
  for (const cover of COVERS) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      ${frame(String(COVERS.indexOf(cover) + 1).padStart(2, '0'), cover.folio)}
      ${cover.art()}
      ${lockup(cover.title, cover.role, cover.year)}
      <rect width="1600" height="900" filter="url(#grain-${String(COVERS.indexOf(cover) + 1).padStart(2, '0')})"/>
    </svg>`;
    const out = join(OUT_COVERS, `cover-${cover.id}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
    console.log('cover →', out);
  }

  const mark = await knockoutMark();
  console.log('mark →', mark);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

