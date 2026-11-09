// Asset pipeline — designed covers for featured projects + the knocked-out,
// re-graded codeRED mark. Each cover speaks the project's own design language
// (accent, geometry, mood) inside one shared editorial frame. Dense, full-bleed
// compositions — no dead space. sharp (librsvg) rasterizes 1600×900 PNGs.
// Run: node tools/generate-covers.mjs
import sharp from 'sharp';
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
};

const MONO = 'Consolas, ui-monospace, monospace';
const SANS = 'Arial, sans-serif';
const SERIF = 'Georgia, serif';

/* Shared frame: hairline grid, grain, registration ticks, folio in the
   project's accent, and a scrim so the lockup stays legible over dense art. */
/* Covers render at 21:9 (1600×686) — the exact tuner-screen aspect, so
   object-cover never crops the composition. */
function frame(id, folio, accent) {
  return `
  <defs>
    <pattern id="grid-${id}" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="${T.strong}" stroke-width="1"/>
    </pattern>
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.045 0"/>
    </filter>
    <linearGradient id="scrim-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${T.bg}" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="${T.bg}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${T.bg}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="686" fill="${T.bg}"/>
  <rect width="1600" height="686" fill="url(#grid-${id})" opacity="0.5"/>
  <g stroke="${T.dim}" stroke-width="1.5" fill="none" opacity="0.85">
    <path d="M44 70V44H70M1530 44H1556V70M44 616V642H70M1530 642H1556V616"/>
  </g>
  <text x="70" y="86" font-family="${MONO}" font-size="19" letter-spacing="5" fill="${T.dim}">CODERED / COVER ${id}</text>
  <text x="1530" y="86" text-anchor="end" font-family="${MONO}" font-size="19" letter-spacing="5" fill="${accent}">${folio}</text>`;
}

function lockup(id, title, role, year, accent) {
  return `
  <rect x="0" y="400" width="940" height="286" fill="url(#scrim-${id})"/>
  <text x="70" y="506" font-family="${MONO}" font-size="21" letter-spacing="6" fill="${T.muted}">${role} · ${year}</text>
  <text x="66" y="610" font-family="${SANS}" font-size="96" font-weight="800" letter-spacing="-4" fill="${T.ink}">${title}<tspan fill="${accent}">.</tspan></text>
  <rect x="70" y="634" width="150" height="3" fill="${accent}"/>`;
}

/* ── Veilpay — amber-gold vault: shield core, 7+ chain orbits, stealth fan ── */
function artVeilpay() {
  const accent = '#d4a94e';
  const hot = '#f0c869';
  const cx = 1120;
  const cy = 330;
  const chains = ['ETH', 'SOL', 'XLM', 'XMR', 'ZEC', 'BASE', 'MID'];
  const nodes = chains
    .map((label, i) => {
      const a = -0.5 + (i / chains.length) * Math.PI * 2;
      const r = i % 2 === 0 ? 300 : 210;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      return `
      <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${accent}" stroke-opacity="0.25"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${T.bg}" stroke="${accent}" stroke-width="2"/>
      <text x="${(x + 16).toFixed(1)}" y="${(y + 5).toFixed(1)}" font-family="${MONO}" font-size="16" letter-spacing="2" fill="${T.muted}">${label}</text>`;
    })
    .join('');
  return `
    <g fill="none" stroke="${accent}">
      <circle cx="${cx}" cy="${cy}" r="140" stroke-opacity="0.5"/>
      <circle cx="${cx}" cy="${cy}" r="210" stroke-opacity="0.3"/>
      <circle cx="${cx}" cy="${cy}" r="300" stroke-opacity="0.18"/>
      <circle cx="${cx}" cy="${cy}" r="420" stroke-opacity="0.1"/>
      <circle cx="${cx}" cy="${cy}" r="560" stroke-opacity="0.06"/>
    </g>
    ${nodes}
    <path d="M${cx} ${cy - 78} L${cx + 62} ${cy - 46} V${cy + 22} C${cx + 62} ${cy + 66} ${cx + 30} ${cy + 92} ${cx} ${cy + 108} C${cx - 30} ${cy + 92} ${cx - 62} ${cy + 66} ${cx - 62} ${cy + 22} V${cy - 46} Z"
      fill="${T.surface}" stroke="${accent}" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy - 6}" r="14" fill="none" stroke="${hot}" stroke-width="3"/>
    <rect x="${cx - 4}" y="${cy + 6}" width="8" height="34" rx="4" fill="${hot}"/>
    <text x="${cx}" y="${cy + 130}" text-anchor="middle" font-family="${MONO}" font-size="16" letter-spacing="4" fill="${T.dim}">ZK PROOFS · STEALTH ADDRESSES</text>
    <text x="700" y="190" font-family="${SERIF}" font-style="italic" font-size="44" fill="${accent}">private by default.</text>
    <g font-family="${MONO}" font-size="15" fill="${T.dim}">
      <text x="380" y="505">0x7F3…A21F</text>
      <path d="M540 500 L760 435 M540 500 L760 500 M540 500 L760 565" stroke="${accent}" stroke-opacity="0.5" stroke-width="1.5" fill="none"/>
      <text x="780" y="440" fill="${accent}">0x1A…9C0E ★</text>
      <text x="780" y="505" fill="${accent}">0xB2…77D4 ★</text>
      <text x="780" y="570" fill="${accent}">0x8E…31B9 ★</text>
      <text x="700" y="600" font-size="13" letter-spacing="2" fill="${T.dim}">ONE-TIME STEALTH ADDRESSES</text>
    </g>`;
}


/* ── FreelancePay — teal escrow terminal: contract code + receipt + milestones ── */
function artFreelancepay() {
  const accent = '#2dd4bf';
  const hot = '#5eead4';
  const codeLines = [
    ['// milestone escrow — soroban', T.dim],
    ['let escrow = Escrow::new(env);', T.ink],
    ['escrow.fund(5_000_USDC);', accent],
    ['ship(code).then(release);', hot],
    ['// no trust req. zero fees.', T.dim],
  ];
  const code = codeLines
    .map(([line, color], i) => `<text x="700" y="${250 + i * 38}" font-family="${MONO}" font-size="21" fill="${color}">${line}</text>`)
    .join('');
  const milestones = ['CONNECT', 'FUND', 'SHIP', 'RELEASE']
    .map((label, i) => {
      const x = 700 + i * 200;
      return `
      <circle cx="${x}" cy="540" r="10" fill="${i < 4 ? accent : T.line}"/>
      ${i < 3 ? `<line x1="${x + 10}" y1="540" x2="${x + 190}" y2="540" stroke="${accent}" stroke-width="2" stroke-opacity="0.5"/>` : ''}
      <text x="${x}" y="578" text-anchor="middle" font-family="${MONO}" font-size="14" letter-spacing="2" fill="${T.dim}">${label}</text>`;
    })
    .join('');
  return `
    <rect x="660" y="170" width="640" height="300" rx="12" fill="${T.surface}" stroke="${T.line}"/>
    <rect x="660" y="170" width="640" height="38" rx="12" fill="${T.strong}"/>
    <circle cx="686" cy="189" r="6" fill="${accent}"/>
    <circle cx="708" cy="189" r="6" fill="${T.dim}"/>
    <circle cx="730" cy="189" r="6" fill="${T.dim}"/>
    <text x="756" y="195" font-family="${MONO}" font-size="15" fill="${T.dim}">escrow.rs</text>
    ${code}
    <rect x="1150" y="360" width="330" height="110" rx="10" fill="${T.bg}" stroke="${accent}" stroke-opacity="0.6"/>
    <text x="1170" y="392" font-family="${MONO}" font-size="15" fill="${T.dim}">RECEIPT // ESCROW_FUNDED</text>
    <text x="1170" y="425" font-family="${MONO}" font-size="19" fill="${hot}">5,000.00 USDC</text>
    <text x="1170" y="452" font-family="${MONO}" font-size="13" fill="${T.dim}">Tx 0x8f…39a1 · STELLAR</text>
    ${milestones}
    <text x="700" y="130" font-family="${MONO}" font-size="17" letter-spacing="4" fill="${T.dim}">TRUSTLESS MILESTONE ESCROW</text>`;
}



/* ── VaultPass — electric-blue ZK gate: vault rings, redacted witness, proof ── */
function artVaultpass() {
  const accent = '#3b5bff';
  const hot = '#6b8bff';
  const rows = [
    ['valid_proof', 'true', true],
    ['credential', '██████████', false],
    ['identity', '██████████', false],
  ];
  const proofRows = rows
    .map(([k, v, ok], i) => `
      <text x="700" y="${390 + i * 38}" font-family="${MONO}" font-size="20" fill="${T.dim}">${k}:</text>
      <text x="940" y="${390 + i * 38}" font-family="${MONO}" font-size="20" fill="${ok ? hot : T.strong}">${v}</text>`)
    .join('');
  return `
    <g fill="none" stroke="${accent}">
      <circle cx="1150" cy="300" r="90" stroke-opacity="0.9" stroke-width="2"/>
      <circle cx="1150" cy="300" r="150" stroke-opacity="0.4"/>
      <circle cx="1150" cy="300" r="230" stroke-opacity="0.2"/>
      <circle cx="1150" cy="300" r="330" stroke-opacity="0.1"/>
      <circle cx="1150" cy="300" r="450" stroke-opacity="0.06"/>
    </g>
    <g transform="translate(1150 300)">
      <rect x="-34" y="-20" width="68" height="56" rx="8" fill="${T.surface}" stroke="${accent}" stroke-width="2.5"/>
      <path d="M-18 -20 v-14 a18 18 0 0 1 36 0 v-14" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <circle cy="6" r="8" fill="${hot}"/>
      <rect x="-3" y="10" width="6" height="14" rx="3" fill="${hot}"/>
    </g>
    <path d="M700 320 C 860 300, 960 300, 1040 300" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="8 8"/>
    <path d="M1016 308 L1044 320 L1016 332 Z" fill="${accent}"/>
    <text x="700" y="280" font-family="${MONO}" font-size="16" letter-spacing="3" fill="${T.dim}">PRIVATE WITNESS IN</text>
    ${proofRows}
    <text x="700" y="530" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${T.dim}">MIDNIGHT · ZERO-KNOWLEDGE MEMBERSHIP</text>`;
}

/* ── Avisky — indigo aviation: trajectory arc, waypoints, telemetry strip ── */
function artAvisky() {
  const accent = '#4f46e5';
  const hot = '#818cf8';
  // great-arc trajectory across the canvas with waypoints
  const waypoints = [
    [640, 430], [800, 370], [980, 320], [1160, 280], [1330, 250], [1470, 230],
  ];
  const dots = waypoints
    .map(([x, y], i) => `
      <circle cx="${x}" cy="${y}" r="7" fill="${i === waypoints.length - 1 ? hot : T.bg}" stroke="${accent}" stroke-width="2"/>
      <text x="${x}" y="${y - 18}" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${T.dim}">WPT 0${i + 1}</text>`)
    .join('');
  const telemetry = [
    ['ALT', '34,000 FT'], ['HDG', '072°'], ['GS', '448 KT'], ['CADETS', '5.2K'],
  ]
    .map(([k, v], i) => {
      const x = 660 + i * 210;
      return `
      <rect x="${x}" y="500" width="180" height="64" rx="8" fill="${T.surface}" stroke="${T.line}"/>
      <text x="${x + 18}" y="526" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${T.dim}">${k}</text>
      <text x="${x + 18}" y="554" font-family="${MONO}" font-size="19" fill="${hot}">${v}</text>`;
    })
    .join('');
  return `
    <path d="M560 480 C 760 380, 1050 290, 1520 220" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="10 8"/>
    ${dots}
    <g transform="translate(1230 240) rotate(-14)">
      <path d="M0 -46 L34 34 L0 18 L-34 34 Z" fill="${accent}"/>
      <circle r="90" fill="none" stroke="${accent}" stroke-opacity="0.3"/>
      <circle r="130" fill="none" stroke="${accent}" stroke-opacity="0.15"/>
    </g>
    ${telemetry}
    <text x="640" y="140" font-family="${MONO}" font-size="17" letter-spacing="4" fill="${T.dim}">AI-POWERED AVIATION LEARNING · TRAJECTORY LIVE</text>
    <text x="640" y="196" font-family="${SERIF}" font-style="italic" font-size="40" fill="${accent}">Dream to reality.</text>`;
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
      data[i + 3] = 0;
      continue;
    }
    if (max > 168 && sat < 26) {
      data[i + 3] = Math.round(255 * ((205 - max) / 37));
      continue;
    }
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
  {
    id: 'veilpay', title: 'Veilpay', role: 'PRIVATE MULTI-CHAIN WALLET', year: '2026',
    folio: 'PAYMENTS · ZK', accent: '#d4a94e', art: artVeilpay,
  },
  {
    id: 'freelancepay', title: 'FreelancePay', role: 'MILESTONE ESCROW · STELLAR', year: '2025',
    folio: '$250 STELLAR AWARD', accent: '#2dd4bf', art: artFreelancepay,
  },
  {
    id: 'avisky', title: 'Avisky', role: 'AI AVIATION LEARNING', year: '2026',
    folio: 'CLIENT PROJECT', accent: '#4f46e5', art: artAvisky,
  },
  {
    id: 'vaultpass', title: 'VaultPass', role: 'ZK MEMBERSHIP GATE', year: '2025',
    folio: '$30 AWARD · MIDNIGHT', accent: '#3b5bff', art: artVaultpass,
  },
];

async function main() {
  for (const [index, cover] of COVERS.entries()) {
    const id = String(index + 1).padStart(2, '0');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="686" viewBox="0 0 1600 686">
      ${frame(id, cover.folio, cover.accent)}
      ${cover.art()}
      ${lockup(id, cover.title, cover.role, cover.year, cover.accent)}
      <rect width="1600" height="900" filter="url(#grain-${id})"/>
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

