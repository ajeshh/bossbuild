// End-to-end CLI behaviour — exit codes, and the cross-surface agreement invariant.
//
// These shell out to `bin/boss` because that is the contract a founder actually touches;
// an assertion on an internal function would not have caught the audit's headline bug
// (two surfaces each individually "correct", disagreeing with each other).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { collectBoard, canvassedIdeas } from '../src/board.js';
import { updateNote, installKind, updateCommand, PKG } from '../src/update.js';
import { project, cleanup, idea, feat, canvas } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

// Run boss in a dir. Returns { code, out }. NO_COLOR so assertions match plain text,
// and HOME redirected so tests never touch the real ~/.boss registry.
function boss(args, cwd, home, extraEnv = {}) {
  try {
    const out = execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: home || cwd, ...extraEnv },
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

// --- boss changelog -------------------------------------------------------
//
// v0.152.0 — `/boss-sync`'s narration step pointed at `registry/CHANGELOG.md` "from the BOSS
// source repo", which no founder project has. Without a reachable form, sync degrades from
// "here's what's new and why" to "14 files changed" — the blind sync the skill exists to
// prevent. These pin the reachability and the two-hop honesty.

test('boss changelog defaults to the cut since THIS project pin', () => {
  const p = bossProject();
  const r = boss(['changelog'], p);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /this project: 0\.0\.1/, 'should name the pin it is cutting from');
  // Assert the BEHAVIOUR, not a fixed version. This pinned 0.151.0 when written (v0.152.0);
  // the list caps at 25, so that number aged out of the window and the test failed on an
  // unrelated release. What it means is "the newest release is in the cut" — which stays true.
  const newest = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
  assert.ok(r.out.includes(newest), `the newest release (${newest}) should be listed`);
  assert.doesNotMatch(r.out, /registry\/CHANGELOG\.md/, 'never expose BOSS-repo-only paths');
});

test('REGRESSION: a pin equal to the install says so WITHOUT claiming BOSS is current', () => {
  const cur = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
  const p = bossProject({
    '.boss/manifest.json': JSON.stringify({
      name: 'testproj', bossVersion: cur, stage: 'L0-quickstart', mode: 'Quickstart',
      installedLayers: ['L0-quickstart'], agents: [], skills: [], hooks: [], loops: [],
    }),
  });
  const r = boss(['changelog'], p);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /Nothing new/, 'should say there is nothing since the pin');
  // The two-hop trap: "nothing new" only means the INSTALL and the PROJECT agree. If BOSS
  // lets a founder read that as "I am up to date", they can sit 50 releases behind forever
  // and be told they are current every single time.
  assert.match(r.out, /install/i, 'must distinguish install-current from project-current');
  assert.match(r.out, /npm i -g oyeboss@latest|brew upgrade/, 'must name how to update the TOOL');
});

test('boss changelog --since overrides the pin, and --all ignores both', () => {
  const p = bossProject();
  const since = boss(['changelog', '--since', '0.149.0'], p);
  assert.equal(since.code, 0, since.out);
  // REGRESSION: this used to assert the OLDEST included release (`0.150.0`) appeared in the
  // list. The list is capped for readability and folds the tail into "… +N older", so that
  // assertion was a time bomb — it passed until enough releases shipped to push 0.150.0 into
  // the fold, then failed for a reason unrelated to the behaviour under test. Assert the
  // CONTRACT instead: the --since base is honoured, something newer than it is shown, and
  // anything older is excluded. None of those depend on how many releases fit on screen.
  assert.match(since.out, /since 0\.149\.0/, '--since should override the project pin');
  const current = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
  assert.match(since.out, new RegExp(current.replace(/\./g, '\\.')), 'the newest release is always shown');
  assert.doesNotMatch(since.out, /^\s+0\.148\.0/m, '--since should exclude older releases');
  const all = boss(['changelog', '--all'], p);
  assert.match(all.out, /0\.1\.0|0\.2\.0/, '--all should reach the earliest releases');
});

// --- boss update ----------------------------------------------------------
//
// v0.156.0 — the two-hop trap's second half. `boss status` compares a project against the
// INSTALLED package, so "up to date" only ever meant "your project matches your install", never
// "your install is current". A founder who never updated the tool got told they were fine forever,
// and the more stale they were the more confident the reassurance.
//
// No test here touches the network. The fetch is deliberately the only impure part; everything
// that decides what a founder SEES is pure and pinned below.

test('updateNote never claims currency it has not checked', () => {
  // The default state for every founder who has never run `boss update`. Saying nothing would
  // reproduce exactly the silence this feature exists to break.
  assert.equal(updateNote('0.150.0', null).state, 'unknown');
  assert.equal(updateNote('0.150.0', {}).state, 'unknown');
  assert.equal(updateNote('0.150.0', { checked: 'garbage', latest: null }).state, 'unknown');
});

test('REGRESSION: a behind install is reported as behind, with the right upgrade command', () => {
  const n = updateNote('0.150.0', { checked: new Date().toISOString(), latest: '0.199.0' });
  assert.equal(n.state, 'behind');
  assert.equal(n.latest, '0.199.0');
  assert.ok(n.cmd, 'must name how to fix it, not just that it is broken');
});

test('a check older than a week decays back to unknown, not to current', () => {
  // A stale "you were current 8 months ago" is indistinguishable from a fresh one to a reader,
  // and it is the same false reassurance wearing a timestamp.
  const old = { checked: '2026-01-01T00:00:00.000Z', latest: '0.150.0' };
  assert.equal(updateNote('0.150.0', old, Date.parse('2026-08-17T00:00:00.000Z')).state, 'unknown');
  const fresh = { checked: '2026-08-16T00:00:00.000Z', latest: '0.150.0' };
  assert.equal(updateNote('0.150.0', fresh, Date.parse('2026-08-17T00:00:00.000Z')).state, 'current');
});

test('being AHEAD of the registry is never reported as behind', () => {
  // The maintainer-and-source-checkout case. It must not nag, and `printUpdate` says the useful
  // thing instead: everything since the published version is invisible to everyone else.
  const n = updateNote('0.155.0', { checked: new Date().toISOString(), latest: '0.97.0' });
  assert.equal(n.state, 'current');
});

test('the upgrade command matches how BOSS was actually installed', () => {
  // Telling a Homebrew user to run `npm i -g` is advice that fails silently — they run it, nothing
  // changes, and they conclude the check is broken.
  assert.equal(updateCommand(installKind('/opt/homebrew/Cellar/boss/0.1.0')), 'brew upgrade boss');
  assert.equal(updateCommand(installKind('/usr/local/lib/node_modules/oyeboss')), 'npm i -g oyeboss@latest');
  assert.match(updateCommand(installKind('/Users/x/Projects/bossbuild')), /git pull/);
});

test('REGRESSION: the package name BOSS checks is the package name BOSS tells you to install', () => {
  // v0.177.0 renamed npm `bossbuild` → `oyeboss`. The name lives in two places that must agree:
  // the registry URL `boss update` polls, and the command it prints. Change one and not the other
  // and the failure is SILENT — BOSS cheerfully checks a package nobody can install, or tells you
  // to install one it never looks at. Neither throws; both are wrong.
  assert.equal(PKG, JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).name,
    'src/update.js PKG must equal package.json name');
  assert.ok(updateCommand('npm').includes(PKG), 'the printed npm install command must name PKG');
});

test('boss update is offline-safe — it never exits non-zero for lack of network', () => {
  // A founder on a plane gets a shrug, not a failure. Forced offline via a bogus proxy so no
  // request can succeed regardless of the machine running the suite.
  const p = bossProject();
  const r = boss(['update'], p, undefined, {
    HTTPS_PROXY: 'http://127.0.0.1:9', HTTP_PROXY: 'http://127.0.0.1:9', NO_PROXY: '',
  });
  assert.equal(r.code, 0, `must exit 0 offline:\n${r.out}`);
});
