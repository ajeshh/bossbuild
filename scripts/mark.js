// The mark — the built B (DEC-021, 2026-09-14). Ajesh drew it (web/boss-logo-mark.svg): a cap and
// two left facets in one colour, two curved ribbons in the other, the seams between the parts left
// as ground so you can see it was assembled. Build Out Solid Stuff, as an object.
//
// This module is the ONE reader of that file. Nothing retypes the paths: the site's lockup, the
// favicon, the demo ribbon and the share card all come through here, the way every hex on the site
// comes through tokens.css. Two cuts:
//   · the large cut is the file, verbatim;
//   · the small cut (≤ ~24px) insets every part toward its own centre so the seams GROW as the mark
//     shrinks. Rendered plain at 16px the parts fuse into a blob (Ajesh: "when it shrinks, it kinda
//     looses and becomes blobby") — the seams are ~14 units on a 512 grid, a third of a pixel. An
//     8% inset per part makes them ~2px at 16px, and the silhouette stays a built B.
// Colours are per use, never in the paths: the faces take --color-mark-face and the ribbons
// --color-mark-bowl on the site (cornflower + persimmon on ice; the authored sky + persimmon on
// deep); the favicon gets literals because a data: URI cannot read a custom property.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MARK_FILE = join(ROOT, 'web', 'boss-logo-mark.svg');
// The authored colours — read from the file's own comment so a recolour there is a recolour here.
const SRC = readFileSync(MARK_FILE, 'utf8');
const FACE_HEX = (SRC.match(/Sky Blue:\s*(#[0-9A-Fa-f]{6})/) || [])[1] || '#55BDF5';
const BOWL_HEX = (SRC.match(/Persimmon:\s*(#[0-9A-Fa-f]{6})/) || [])[1] || '#FF7148';
export const AUTHORED = { face: FACE_HEX, bowl: BOWL_HEX };
export const VIEWBOX = (SRC.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 512 512';

// Every <path>, classified by the colour the author gave it: the face colour is structure, the
// other is the bowl. The d attribute is normalised to one line.
export const PARTS = [...SRC.matchAll(/<path\s+fill="(#[0-9A-Fa-f]{6})"\s+d="([^"]+)"/g)].map(([, fill, d]) => ({
  role: fill.toUpperCase() === FACE_HEX.toUpperCase() ? 'face' : 'bowl',
  d: d.replace(/\s+/g, ' ').trim(),
}));
if (PARTS.length < 2) throw new Error(`mark.js read ${PARTS.length} path(s) from ${MARK_FILE} — expected the five parts`);

// A part's centre, from the coordinates in its path (control points included — near enough for an inset).
function centre(d) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

// The mark's own bounds (the file leaves margin around it), so the lockup is not a small B in a big box.
const BOUNDS = (() => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of PARTS) {
    const nums = p.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
    for (let i = 0; i + 1 < nums.length; i += 2) { minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]); minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]); }
  }
  const pad = 6;
  return { x: minX - pad, y: minY - pad, w: maxX - minX + 2 * pad, h: maxY - minY + 2 * pad };
})();
export const TIGHT_VIEWBOX = `${BOUNDS.x} ${BOUNDS.y} ${BOUNDS.w} ${BOUNDS.h}`;

const INSET = 0.86; // the small cut's per-part scale

/**
 * The mark as inline SVG.
 * @param {object} o
 * @param {'large'|'small'} [o.cut]   small = seams widened for ≤ ~24px
 * @param {string} [o.face]           fill for the cap and facets (default: the site's custom property)
 * @param {string} [o.bowl]           fill for the ribbons
 * @param {string} [o.cls]            class on the <svg>
 * @param {boolean} [o.tight]         crop the viewBox to the mark (default true)
 */
export function markSvg({ cut = 'large', face = 'var(--color-mark-face)', bowl = 'var(--color-mark-bowl)', cls = 'mark', tight = true } = {}) {
  const paths = PARTS.map((p) => {
    const fill = p.role === 'face' ? face : bowl;
    if (cut !== 'small') return `<path fill="${fill}" d="${p.d}"/>`;
    const [cx, cy] = centre(p.d);
    return `<path fill="${fill}" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${INSET}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})" d="${p.d}"/>`;
  }).join('');
  return `<svg class="${cls}" viewBox="${tight ? TIGHT_VIEWBOX : VIEWBOX}" aria-hidden="true" focusable="false">${paths}</svg>`;
}

// The favicon: the small cut with literal colours (a data: URI cannot read a custom property), and
// the ice-ground pair — cornflower reads on a light tab bar (3.2) and a dark one (4.9); the authored
// sky is 1.8 on white and would vanish next to a light tab.
export function faviconDataUri({ face, bowl }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${TIGHT_VIEWBOX}">` + PARTS.map((p) => {
    const [cx, cy] = centre(p.d);
    return `<path fill="${p.role === 'face' ? face : bowl}" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${INSET}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})" d="${p.d}"/>`;
  }).join('') + '</svg>';
  return `data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'")}`;
}
