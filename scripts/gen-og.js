// Re-render the share card (web/og.png) from scripts/og-card.html. The card carries the mark, and
// the mark is read from web/boss-logo-mark.svg through scripts/mark.js — never retyped — so this
// script fills {{MARK_PATHS}} and then asks headless Chrome for the 1200×630 PNG. The PNG is a
// binary the site build copies and must not touch (gen-site.js ROOT_ASSETS); this is the one
// place it is made. `node scripts/gen-og.js` — needs Chrome on the machine; prints the path it used.
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PARTS, AUTHORED } from './mark.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(ROOT, 'scripts', 'og-card.html'), 'utf8');
const paths = PARTS.map((p) => `<path fill="${p.role === 'face' ? AUTHORED.face : AUTHORED.bowl}" d="${p.d}"/>`).join('');
const html = src.replace('{{MARK_PATHS}}', paths);
const dir = mkdtempSync(join(tmpdir(), 'boss-og-'));
const page = join(dir, 'og-card.html');
writeFileSync(page, html);

const CHROMES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = CHROMES.find((c) => existsSync(c));
if (!chrome) {
  console.error(`  gen:og — no Chrome found (set CHROME=/path). The resolved card is at ${page}; render it at 1200×630 to web/og.png.`);
  process.exit(1);
}
const out = join(ROOT, 'web', 'og.png');
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', `--screenshot=${out}`, `file://${page}`], { stdio: 'ignore' });
console.log(`  ✦ og.png rendered → web/og.png (${chrome})`);
