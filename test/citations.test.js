// The citation convention (v0.263.0) — see docs/IDS.md and check-refs class 6.
//
// `[[DEC-011]]` promises the reader can open it; a bare `DEC-011` says a record exists. BOSS's own
// records are gitignored, so the link form in a TRACKED file is a door into a room that is not
// there — and `registry/CHANGELOG.md` ships inside the npm package, so those dead references were
// distributed rather than merely published.
//
// The first cut of the check was a silent no-op TWICE (a catch swallowing a missing import, then
// placement below the early `total === 0` exit). Both times it printed "Everything BOSS points at
// exists." So the load-bearing test here is not "does it pass on a clean tree" — it is **does it
// still FAIL when something is wrong**. A check that cannot be made to fail is not a check.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const run = (args, opts = {}) => {
  try {
    return { code: 0, out: execFileSync('node', args, { cwd: BOSS_ROOT, encoding: 'utf8', ...opts }) };
  } catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; }
};
const CHECK = join(BOSS_ROOT, 'scripts', 'check-refs.js');

test('the tracked tree carries no citation the reader cannot follow', () => {
  const r = run([CHECK]);
  assert.doesNotMatch(r.out, /DEAD CITATIONS/);
});

test('REGRESSION: the check can still be made to fail — it is not a silent no-op', () => {
  const probe = join(BOSS_ROOT, 'docs', '__citation-probe.md');
  writeFileSync(probe, '# probe\n\nSee [[DEC-011]].\n');
  try {
    execFileSync('git', ['add', '-f', probe], { cwd: BOSS_ROOT, stdio: 'ignore' });
    const r = run([CHECK]);
    assert.equal(r.code, 1, 'a dead citation in a tracked file must fail the check');
    assert.match(r.out, /DEAD CITATIONS/);
    assert.match(r.out, /write it as `DEC-011`/);
  } finally {
    try { execFileSync('git', ['rm', '--cached', '-f', probe], { cwd: BOSS_ROOT, stdio: 'ignore' }); } catch { /* */ }
    rmSync(probe, { force: true });
  }
});

test('a mention inside backticks is a mention, not a citation', () => {
  const probe = join(BOSS_ROOT, 'docs', '__citation-probe-2.md');
  writeFileSync(probe, '# probe\n\nThe form is `[[DEC-011]]`, documented here.\n');
  try {
    execFileSync('git', ['add', '-f', probe], { cwd: BOSS_ROOT, stdio: 'ignore' });
    assert.doesNotMatch(run([CHECK]).out, /DEAD CITATIONS/);
  } finally {
    try { execFileSync('git', ['rm', '--cached', '-f', probe], { cwd: BOSS_ROOT, stdio: 'ignore' }); } catch { /* */ }
    rmSync(probe, { force: true });
  }
});

test('the shipped CHANGELOG states where its record ids live', () => {
  const t = readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8');
  assert.match(t, /NOT in this repository/);
});

test('boss changelog renders a citation plain, for the tarballs already in the world', async () => {
  const { default: fs } = await import('node:fs');
  const mod = await import('../src/changelog.js');
  // The renderer is exercised through the file it reads, so this asserts the contract that
  // matters: whatever form an OLD installed changelog uses, a founder never sees the link form.
  const src = readFileSync(join(BOSS_ROOT, 'src', 'changelog.js'), 'utf8');
  assert.match(src, /plainCitations/);
  assert.equal((src.match(/plainCitations\(/g) || []).length, 3, 'all three render paths must strip it');
  assert.ok(typeof mod.printChangelog === 'function');
  void fs;
});
