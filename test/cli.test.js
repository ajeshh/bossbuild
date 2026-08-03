// End-to-end CLI behaviour — exit codes, and the cross-surface agreement invariant.
//
// These shell out to `bin/boss` because that is the contract a founder actually touches;
// an assertion on an internal function would not have caught the audit's headline bug
// (two surfaces each individually "correct", disagreeing with each other).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { collectBoard, canvassedIdeas } from '../src/board.js';
import { project, cleanup, idea, feat, canvas } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

// Run boss in a dir. Returns { code, out }. NO_COLOR so assertions match plain text,
// and HOME redirected so tests never touch the real ~/.boss registry.
function boss(args, cwd, home) {
  try {
    const out = execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: home || cwd },
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}

const bossProject = (extra = {}) => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'testproj', bossVersion: '0.0.1', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], skills: ['triage', 'canvas'], hooks: [], loops: [],
  }),
  '.boss/config.json': JSON.stringify({ cohort: null }),
  ...extra,
});

// --- exit codes -----------------------------------------------------------

test('an unknown command exits non-zero with a did-you-mean, not a manual dump', () => {
  const r = boss(['boad'], bossProject());
  assert.equal(r.code, 1);
  assert.match(r.out, /unknown command/);
  assert.match(r.out, /Did you mean.*board/);
  assert.ok(!r.out.includes('Start here'), 'an error must not dump the whole help');
});

test('running outside a BOSS project fails clearly rather than half-working', () => {
  const empty = project({});
  for (const cmd of [['status'], ['board'], ['map'], ['sync']]) {
    const r = boss(cmd, empty);
    assert.equal(r.code, 1, `${cmd[0]} should exit 1`);
    assert.match(r.out, /not a BOSS project/);
  }
});

test('unlock rejects an unknown mode in the vocabulary it accepts', () => {
  const r = boss(['unlock', 'v9'], bossProject());
  assert.equal(r.code, 1);
  assert.match(r.out, /quickstart \| mvp \| v1 \| scale/, 'must answer in mode words, not stage ids');
  assert.ok(!r.out.includes('L0-quickstart'), 'internal stage ids must not leak into the error');
});

test('help and version exit 0 and say something', () => {
  const dir = bossProject();
  assert.equal(boss(['version'], dir).code, 0);
  assert.match(boss(['version'], dir).out, /^\d+\.\d+\.\d+/);
  const h = boss(['help'], dir);
  assert.equal(h.code, 0);
  assert.match(h.out, /Start here/);
  assert.match(h.out, /run inside Claude Code/, 'the two command languages must be cued');
});

test('help columns align — every description starts at the same column', () => {
  const out = boss(['help'], bossProject()).out;
  const cols = out.split('\n')
    .filter((l) => /^ {4}boss /.test(l) && l.includes('  '))
    .map((l) => l.search(/\s{2,}\S/) === -1 ? null : l.length - l.replace(/^(\s*\S+(?: \S+)*?)\s{2,}/, '').length)
    .filter(Boolean);
  assert.ok(cols.length > 5, 'expected several command rows');
  assert.equal(new Set(cols).size, 1, `descriptions start at ${[...new Set(cols)].join(', ')} — expected one column`);
});

// --- the invariant that motivated the audit -------------------------------

test('REGRESSION §A1: boss board and boss insights never disagree about the same files', () => {
  // The shipped bug: insights said "1 canvassed" while board said "0 taking shape" on the
  // same directory in the same second, because each computed "pressure-tested" its own way.
  const dir = bossProject({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { body: 'Next step: run /canvas on this.' }),
    'docs/ideas/IDEA-002.md': idea('IDEA-002'),
    'docs/ideas/IDEA-002-canvas.md': canvas('IDEA-002', 'They will not switch tools'),
  });
  const { cards } = collectBoard(dir);
  const takingShape = cards.filter((c) => c.column === 'Taking shape').map((c) => c.id);
  assert.deepEqual(takingShape, ['IDEA-002']);
  assert.deepEqual(canvassedIdeas(dir).ids, ['IDEA-002'],
    'the two surfaces must resolve to the same set, not merely the same count');
});

test('with no docs/ideas at all, the board says so instead of faking columns', () => {
  const out = boss(['board'], bossProject()).out;
  assert.match(out, /no docs\/ideas\/ here/);
});

test('with an empty docs/ideas, every column shows — the empty cell IS the diagnostic', () => {
  // Deliberate design (IDEA-015): empty columns are shown, not hidden, so "motion but no
  // evidence" is more visible here than in a normal kanban, not less.
  const dir = bossProject({ 'docs/ideas/INDEX.md': '# Ideas\n' });
  const out = boss(['board'], dir).out;
  assert.match(out, /Nothing captured yet/);
  for (const c of ['Captured', 'Taking shape', 'Building', 'Shipped']) {
    assert.match(out, new RegExp(c), `${c} column must show even when empty`);
  }
});

test('boss board --json is parseable and matches the rendered counts', () => {
  const dir = bossProject({
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/FEAT-001.md': feat('FEAT-001'),
  });
  const j = JSON.parse(boss(['board', '--json'], dir).out);
  assert.equal(j.total, 2);
  assert.equal(j.counts.Captured, 1);
  assert.equal(j.counts.Building, 1);
});

// --- output discipline ----------------------------------------------------

test('NO_COLOR is honoured — no ANSI escapes reach a pipe', () => {
  const out = boss(['help'], bossProject()).out;
  // eslint-disable-next-line no-control-regex
  assert.ok(!/\x1b\[/.test(out), 'NO_COLOR must strip every escape sequence');
});

test('the post-launch arc folds until something ships, then opens by itself', () => {
  // §C1/§E1: at MVP a founder with one idea was read 44 skills, 9 of them about retention,
  // pricing and trust — for a product with no users. Nothing is removed or disabled; the fold
  // is a read of real state (a FEAT in the Shipped column), so it opens without being asked.
  const mvp = {
    '.boss/manifest.json': JSON.stringify({
      name: 'p', bossVersion: '0.0.1', stage: 'L1-mvp', mode: 'MVP',
      installedLayers: ['L0-quickstart', 'L1-mvp'],
      agents: [], hooks: [], loops: [],
      skills: ['triage', 'spec', 'smoke', 'measure', 'pmf-check', 'retain', 'trust'],
    }),
    '.boss/config.json': '{}',
  };

  const preLaunch = project({ ...mvp, 'docs/ideas/IDEA-001.md': idea('IDEA-001') });
  const folded = boss(['map'], preLaunch).out;
  assert.match(folded, /for after you ship/, 'post-launch skills must fold before launch');
  assert.ok(!/^ +\/measure/m.test(folded), '/measure must not be listed pre-launch');
  assert.match(boss(['map', '--all'], preLaunch).out, /^ +\/measure/m, '--all must open the fold');

  const shipped = project({ ...mvp, 'docs/ideas/FEAT-001.md': feat('FEAT-001', { status: 'shipped', shipped_on: '2026-08-01' }) });
  const open = boss(['map'], shipped).out;
  assert.ok(!/for after you ship/.test(open), 'a shipped FEAT must open the fold with no flag');
  assert.match(open, /^ +\/measure/m, '/measure is the work once something is live');
});

test('boss map previews the next rung without dumping it', () => {
  // §C1: the preview used to print all 28 of MVP's skills to an empty Quickstart project.
  const dir = bossProject();
  const short = boss(['map'], dir).out;
  const full = boss(['map', '--next'], dir).out;
  assert.match(short, /One unlock away: MVP/);
  assert.match(short, /\+\d+ more when you get there/, 'the preview must fold');
  assert.ok(full.split('\n').length > short.split('\n').length, '--next must show more');
  assert.ok(!full.includes('more when you get there'), '--next must not fold');
});
