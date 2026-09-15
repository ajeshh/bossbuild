// Re-render the front door's proof strip: the three generated pages (playbook, design space, board)
// as they actually render for the demo venture, screenshotted from site/demo/ — never drawn, never
// mocked (FEAT-039: a demo prettier than what `boss` prints is a lie). Same recipe as gen-og.js: ask
// headless Chrome, commit the PNGs under web/, let gen-site copy them. Chrome renders at 1280 CSS px
// and a device scale of 0.5, so the desktop layout arrives at 640×440 without a resize step.
//   npm run gen:site && npm run gen:proof   — needs Chrome on the machine.
import { existsSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PROOF_PAGES = ['playbook', 'design', 'board'];
export const proofAsset = (p) => `proof-${p}.png`;

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

for (const p of PROOF_PAGES) {
  const page = join(ROOT, 'site', 'demo', `${p}.html`);
  if (!existsSync(page)) {
    console.error(`  gen:proof — ${page} is not built; run npm run gen:site first.`);
    process.exit(1);
  }
  const out = join(ROOT, 'web', proofAsset(p));
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--window-size=1280,880', '--force-device-scale-factor=0.5',
    `--screenshot=${out}`, `file://${page}`,
  ], { stdio: 'ignore' });
  copyFileSync(out, join(ROOT, 'site', proofAsset(p)));
  console.log(`  ✦ ${proofAsset(p)} rendered → web/ (${Math.round(statSync(out).size / 1024)} KB)`);
}
