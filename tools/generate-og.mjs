// Social preview card (og.png, 1200×630) — the red-signal editorial card:
// warm black field, concentric signal rings with a wave crossing them, and
// the current tagline. sharp (librsvg) rasterizes the SVG to PNG.
// Run: node tools/generate-og.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'images', 'og.png');

const MONO = 'Consolas, ui-monospace, monospace';
const SANS = 'Arial, sans-serif';

const rings = [56, 100, 144, 188]
  .map(
    (r, i) =>
      `<circle cx="978" cy="298" r="${r}" fill="none" stroke="#e5484d" stroke-width="1.5" opacity="${0.5 - i * 0.11}"/>`
  )
  .join('');

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0c0a09"/>

  <!-- signal motif: rings + wave -->
  ${rings}
  <circle cx="978" cy="298" r="46" fill="#e5484d" opacity="0.22"/>
  <path d="M 690 466 C 770 466, 782 148, 872 148 S 956 436, 1056 436 S 1168 168, 1240 168"
        fill="none" stroke="#e5484d" stroke-width="1.5" opacity="0.55"/>

  <!-- wordmark -->
  <text x="72" y="88" font-family="${SANS}" font-size="27" font-weight="bold" fill="#f5f2ed">code<tspan fill="#e5484d">RED</tspan></text>

  <!-- eyebrow -->
  <text x="72" y="172" font-family="${MONO}" font-size="14" letter-spacing="4" fill="#a6a09b">VINAYAK VASHISTH  /  FULL-STACK ENGINEER</text>

  <!-- headline -->
  <text font-family="${SANS}" font-size="64" font-weight="bold" fill="#f5f2ed">
    <tspan x="72" y="284">Building secure,</tspan>
    <tspan x="72" y="360">expressive products</tspan>
    <tspan x="72" y="436">for the web.</tspan>
  </text>

  <!-- tagline -->
  <text x="72" y="500" font-family="${MONO}" font-size="16" letter-spacing="5" fill="#e5484d">BACKEND TO PIXEL.</text>

  <!-- footer row -->
  <text x="72" y="556" font-family="${MONO}" font-size="13" letter-spacing="3" fill="#8d867c">WEB3 · SAAS · PRODUCT</text>
  <text x="1128" y="556" text-anchor="end" font-family="${SANS}" font-size="15" fill="#f5f2ed">coderedxbt.dev</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log('og.png written:', OUT);
