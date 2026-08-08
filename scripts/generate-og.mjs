/**
 * Generates the static brand assets that must exist as real files:
 *   public/og-default.png   1200x630 share card
 *   public/favicon.svg      scalable monogram
 *   public/favicon.ico      32x32 (PNG-in-ICO, for /favicon.ico requests)
 *   public/apple-touch-icon.png  180x180
 *
 * Run with `npm run og`. The outputs are committed, so this never runs in CI.
 *
 * The share card draws the same hypotrochoid guilloché the site renders on
 * canvas, computed here as SVG path data — so the card and the page are the
 * same artwork rather than two things that merely resemble each other.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(root, 'public');
mkdirSync(publicDir, { recursive: true });

const INK = '#0e100d';
const PARCHMENT = '#ede7da';
const BRASS = '#c2a36b';
const MUTED = '#a39c8b';

/** Same curve as src/scripts/art.ts, emitted as an SVG path. */
function rosettePath(cx, cy, outer, { p, q, d, phase = 0, steps = 620 }) {
  const r = q / p;
  const a = 1 - r;
  const scale = outer / (a + d);
  const ratio = a / r;
  const turns = q;

  let out = '';
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * Math.PI * 2 * turns;
    const x = cx + (a * Math.cos(t + phase) + d * Math.cos(ratio * t + phase)) * scale;
    const y = cy + (a * Math.sin(t + phase) - d * Math.sin(ratio * t + phase)) * scale;
    out += `${s === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return out;
}

function rosetteGroup(cx, cy, outer, spec, copies, stroke, width, alpha) {
  let paths = '';
  for (let c = 0; c < copies; c++) {
    const phase = (c / copies) * Math.PI * 2;
    const swell = 1 + Math.sin((c / copies) * Math.PI) * 0.06;
    paths += `<path d="${rosettePath(cx, cy, outer, { ...spec, d: spec.d * swell, phase })}" />`;
  }
  return `<g fill="none" stroke="${stroke}" stroke-width="${width}" opacity="${alpha}">${paths}</g>`;
}

/* ------------------------------------------------------------------ OG card */

const W = 1200;
const H = 630;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>

  <!-- engraved rosette, anchored right and bled off the edge -->
  <g>
    ${rosetteGroup(980, 315, 300, { p: 13, q: 5, d: 0.33 }, 22, BRASS, 1, 0.5)}
    ${rosetteGroup(980, 315, 300, { p: 17, q: 7, d: 0.25 }, 26, BRASS, 0.8, 0.34)}
  </g>

  <!-- hairline frame -->
  <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="${BRASS}" stroke-width="1" opacity="0.4"/>

  <!-- monogram roundel -->
  <g transform="translate(96, 96)" fill="none" stroke="${BRASS}" stroke-linecap="square">
    <circle cx="30" cy="30" r="28.5" stroke-width="1" opacity="0.6"/>
    <circle cx="30" cy="30" r="25" stroke-width="0.6" opacity="0.4"/>
    <path d="M18 20 V40 M18 30 H30 M30 20 V40" stroke-width="2"/>
    <path d="M35 40 V20 H45 M35 30 H42" stroke-width="2"/>
  </g>

  <text x="96" y="330" fill="${PARCHMENT}" font-family="Georgia, 'Times New Roman', serif" font-size="96" letter-spacing="-1">Hirad Fazeli</text>

  <line x1="96" y1="370" x2="300" y2="370" stroke="${BRASS}" stroke-width="2"/>

  <text x="96" y="424" fill="${BRASS}" font-family="Georgia, 'Times New Roman', serif" font-size="40">Founder &amp; Engineer</text>

  <text x="96" y="474" fill="${MUTED}" font-family="Consolas, 'Courier New', monospace" font-size="23" letter-spacing="1.5">Building ZEEberton — a live map for pet owners</text>

  <text x="96" y="540" fill="${MUTED}" font-family="Consolas, 'Courier New', monospace" font-size="20" letter-spacing="3" opacity="0.8">HIRADFAZELI.GITHUB.IO</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(resolve(publicDir, 'og-default.png'));

/* ------------------------------------------------------------------ favicon */

// Filled brass disc so the mark stays readable at 16px, with the HF knocked
// through in the page's ink colour.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="32" fill="${BRASS}"/>
  <g stroke="${INK}" stroke-width="5" stroke-linecap="square" fill="none">
    <path d="M17 21 V43 M17 32 H30 M30 21 V43"/>
    <path d="M38 43 V21 H49 M38 31 H46"/>
  </g>
</svg>`;

writeFileSync(resolve(publicDir, 'favicon.svg'), faviconSvg);

const png32 = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(resolve(publicDir, 'apple-touch-icon.png'));

// Minimal ICO wrapping a single PNG (the Vista-era form every current browser
// reads). sharp has no ICO encoder, and this avoids another dependency.
const ico = Buffer.concat([
  Buffer.from([0, 0, 1, 0, 1, 0]), // reserved, type=icon, count=1
  (() => {
    const e = Buffer.alloc(16);
    e.writeUInt8(32, 0); // width
    e.writeUInt8(32, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png32.length, 8);
    e.writeUInt32LE(22, 12); // offset past header + entry
    return e;
  })(),
  png32,
]);
writeFileSync(resolve(publicDir, 'favicon.ico'), ico);

console.log('Generated: og-default.png, favicon.svg, favicon.ico, apple-touch-icon.png');
