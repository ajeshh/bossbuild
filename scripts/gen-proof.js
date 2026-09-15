// Re-render the front door's proof strip: the three generated pages (playbook, design space, board)
// as they actually render for the demo venture, screenshotted from site/demo/ — never drawn, never
// mocked (FEAT-039: a demo prettier than what `boss` prints is a lie). Same recipe as gen-og.js: ask
// headless Chrome, commit the results under web/, let gen-site copy them.
//
// Three things learned the first evening (IDEA-117):
//   - Chrome follows the machine's appearance, so the strip silently went dark at sunset. The scheme
//     is pinned with `--blink-settings=preferredColorScheme=1` (1 is light; 0 is dark — the enum reads
//     backwards). `data-theme="light"` on the root was tried first and only half-applied: the board's
//     own dark media rules do not read it.
//   - Chrome renders at 1280 CSS px with a device scale of 0.5 (its floor), so the PNG is 640×440.
//   - The machine has no WebP encoder, but Chrome is one: a canvas `toDataURL('image/webp')` in a
//     second headless pass writes proof-*.webp (640) and proof-*-320.webp; the PNG stays as the
//     `src` fallback. 51 KB → 18 KB and 6 KB, for the same pixels.
//   npm run gen:site && npm run gen:proof   — needs Chrome on the machine.
import { existsSync, copyFileSync, statSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { PROOF_PAGES } from './proof-assets.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const CHROMES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = CHROMES.find((c) => existsSync(c));
if (!chrome) {
  console.error('  gen:proof — no Chrome found (set CHROME=/path).');
  process.exit(1);
}
const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;
const ship = (name) => copyFileSync(join(ROOT, 'web', name), join(ROOT, 'site', name));

// 1. The PNGs, in the light scheme.
for (const p of PROOF_PAGES) {
  const page = join(ROOT, 'site', 'demo', `${p}.html`);
  if (!existsSync(page)) {
    console.error(`  gen:proof — ${page} is not built; run npm run gen:site first.`);
    process.exit(1);
  }
  const out = join(ROOT, 'web', `proof-${p}.png`);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--blink-settings=preferredColorScheme=1',
    '--window-size=1280,880', '--force-device-scale-factor=0.5',
    `--screenshot=${out}`, `file://${page}`,
  ], { stdio: 'ignore' });
  ship(`proof-${p}.png`);
  console.log(`  ✦ proof-${p}.png rendered → web/ (${kb(out)})`);
}

// 2. The WebPs, encoded by Chrome from the PNGs it just made.
const dir = mkdtempSync(join(tmpdir(), 'boss-proof-'));
const enc = join(dir, 'encode.html');
writeFileSync(enc, `<!doctype html><meta charset="utf-8"><body><script>
const pages = ${JSON.stringify(PROOF_PAGES)};
const root = ${JSON.stringify(`file://${join(ROOT, 'web')}/`)};
(async () => {
  for (const p of pages) {
    const img = new Image();
    await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = root + 'proof-' + p + '.png'; });
    for (const w of [640, 320]) {
      const c = document.createElement('canvas');
      c.width = w; c.height = Math.round(img.height * w / img.width);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const pre = document.createElement('pre');
      pre.id = p + '-' + w; pre.textContent = c.toDataURL('image/webp', 0.82);
      document.body.appendChild(pre);
    }
  }
  document.body.appendChild(Object.assign(document.createElement('i'), { id: 'done' }));
})();
</script></body>`);
const dom = execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--allow-file-access-from-files',
  '--virtual-time-budget=10000', '--dump-dom', `file://${enc}`,
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
if (!dom.includes('id="done"')) {
  console.error('  gen:proof — the WebP pass did not finish; the PNGs stand alone.');
  process.exit(1);
}
for (const p of PROOF_PAGES) {
  for (const w of [640, 320]) {
    const m = dom.match(new RegExp(`<pre id="${p}-${w}">data:image/webp;base64,([^<]+)</pre>`));
    if (!m) { console.error(`  gen:proof — no WebP for ${p} @${w}`); process.exit(1); }
    const name = w === 640 ? `proof-${p}.webp` : `proof-${p}-${w}.webp`;
    writeFileSync(join(ROOT, 'web', name), Buffer.from(m[1], 'base64'));
    ship(name);
    console.log(`  ✦ ${name} encoded → web/ (${kb(join(ROOT, 'web', name))})`);
  }
}
