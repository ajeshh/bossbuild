// boss recap — see src/recap.js. Two things are worth guarding and they are both about honesty
// rather than formatting: an empty section must PRINT as empty (a summary that only shows the
// good weeks is a comfort device), and a record git cannot date must be REPORTED as undatable
// rather than silently dropped out of the window.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { resolveWindow, collectRecap, renderRecap } from '../src/recap.js';
import { project, cleanup } from './helpers.js';

after(cleanup);
const BIN = join(BOSS_ROOT, 'bin', 'boss');
const DAY = 86400000;
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString().slice(0, 10);

function boss(args, cwd) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd },
    });
  } catch (e) { return (e.stdout || '') + (e.stderr || ''); }
}

const proj = (extra = {}) => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'p', bossVersion: '0.0.1', stage: 'L1-mvp', mode: 'MVP',
    installedLayers: ['L0-quickstart', 'L1-mvp'],
    agents: [], hooks: [], loops: [], skills: ['idea', 'log', 'evidence'],
  }),
  '.boss/config.json': '{}',
  ...extra,
});

test('the window is 7 days by default, and --since wins over --days', () => {
  const now = Date.parse('2026-09-08T12:00:00Z');
  assert.equal(resolveWindow({}, now).from, '2026-09-01');
  assert.equal(resolveWindow({ days: 14 }, now).from, '2026-08-25');
  assert.equal(resolveWindow({ since: '2026-01-01', days: 3 }, now).from, '2026-01-01');
  assert.equal(resolveWindow({ days: 'nonsense' }, now).from, '2026-09-01');
});

test('an empty week prints every section as empty — it does not hide the rows', () => {
  const dir = proj({ 'docs/devlog.md': '# devlog\n' });
  const out = boss(['recap'], dir);
  assert.match(out, /Nothing logged in this window/);
  assert.match(out, /No new evidence/);
  assert.match(out, /Nothing recorded/);
  assert.match(out, /Nothing new captured/);
  // No canvas is a different fact from a canvas with no assumption named.
  assert.match(out, /No canvas yet/);
});

test('a devlog that has never been written says so — not "nothing logged"', () => {
  const out = boss(['recap'], proj());
  assert.match(out, /No devlog yet/);
  assert.doesNotMatch(out, /Nothing logged in this window/);
});

test('devlog entries inside the window are read, and ones outside are not', () => {
  const dir = proj({
    'docs/devlog.md': `# devlog\n\n## ${daysAgo(2)}\n- **Landed:** the invite flow\n\n## ${daysAgo(40)}\n- **Landed:** ancient history\n`,
  });
  const out = boss(['recap'], dir);
  assert.match(out, /the invite flow/);
  assert.doesNotMatch(out, /ancient history/);
});

test('records git cannot date are reported, never silently dropped', () => {
  const dir = proj({
    'docs/evidence/EVID-001-a-signal.md': '---\nid: EVID-001\ntype: evidence\nstatus: active\ngrade: stated-pain\n---\n\n# EVID-001 — a signal\n',
  });
  // Not a git checkout: the recap must say the dates are unavailable rather than report a clean
  // empty week, which would read as "nothing happened" when the truth is "I could not tell".
  const out = boss(['recap'], dir);
  assert.match(out, /not a git checkout/i);
});

test('--md prints paste-ready markdown with no terminal decoration', () => {
  const dir = proj({ 'docs/devlog.md': `# devlog\n\n## ${daysAgo(1)}\n- **Landed:** a thing\n` });
  const out = boss(['recap', '--md'], dir);
  assert.match(out, /^## p — \d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}/m);
  assert.match(out, /^### Landed$/m);
  assert.match(out, /^- .*a thing/m);
  assert.doesNotMatch(out, /paste-ready markdown/);   // the terminal footer must not leak into it
});

test('the bet is printed whether or not the answer flatters', () => {
  const dir = proj({
    'docs/ideas/CANVAS.md': '# canvas\n\n- **Riskiest assumption:** that anyone will pay for this\n',
  });
  const d = collectRecap(dir, {});
  const out = renderRecap('p', d, {});
  assert.match(out, /that anyone will pay for this/);
  assert.match(out, /Nothing this week tested it/);
});

test('a canvas whose assumption cell is still the placeholder is not treated as named', () => {
  const dir = proj({
    'docs/ideas/CANVAS.md': '# canvas\n\n- **Riskiest assumption:** _(name the one thing)_\n',
  });
  assert.match(renderRecap('p', collectRecap(dir, {}), {}), /no riskiest assumption filled in/);
});
