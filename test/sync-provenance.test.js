// The provenance ledger — `boss sync` and the question it could not answer.
//
// The bug these lock: `--remove` refused to delete a file the founder had edited ("the founder
// changed it, which makes it theirs") while `--apply` overwrote that same file unconditionally,
// three functions away. On a `.claude/` that many projects gitignore, that overwrite is not even
// recoverable — `git diff` shows nothing and there is no history to revert from.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileHash, readLedger, recordManaged, provenance, backupManaged } from '../src/managed.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const write = (dir, rel, text) => {
  const p = join(dir, rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, text);
};

test('provenance is TRI-state, and the third value is the honest one', () => {
  const dir = project({ 'README.md': 'x' });
  const rel = '.claude/agents/coder.md';

  // No record at all — BOSS cannot know, and must say so rather than guess "unchanged".
  assert.equal(provenance(dir, rel, 'anything'), null, 'no ledger entry must be null, never false');

  recordManaged(dir, [{ rel, text: 'as BOSS wrote it' }]);
  assert.equal(provenance(dir, rel, 'as BOSS wrote it'), false, 'byte-identical → not edited');
  assert.equal(provenance(dir, rel, 'as BOSS wrote it\n+ my note'), true, 'differs → the founder\'s');
});

test('a corrupt ledger degrades to "I do not know", never to "unchanged"', () => {
  // The failure direction that matters: reporting `false` on a broken ledger would hand the
  // overwrite straight back to the bug it exists to close.
  const dir = project({ 'README.md': 'x' });
  write(dir, '.boss/managed.json', '{ this is not json');
  assert.deepEqual(readLedger(dir), {});
  assert.equal(provenance(dir, '.claude/agents/coder.md', 'whatever'), null);
});

test('recording is per-file and additive — one sync never forgets an earlier one', () => {
  const dir = project({ 'README.md': 'x' });
  recordManaged(dir, [{ rel: 'a.md', text: 'A' }]);
  recordManaged(dir, [{ rel: 'b.md', text: 'B' }]);
  const l = readLedger(dir);
  assert.equal(l['a.md'], fileHash('A'));
  assert.equal(l['b.md'], fileHash('B'));
});

test('backupManaged copies aside and reports honestly when there is nothing to save', () => {
  const dir = project({ 'README.md': 'x' });
  write(dir, '.claude/agents/coder.md', 'the founder\'s version');
  const relDir = backupManaged(dir, ['.claude/agents/coder.md'], '2026-08-21T12:00:00');
  assert.ok(relDir, 'a real file must produce a backup dir');
  assert.equal(readFileSync(join(dir, relDir, '.claude/agents/coder.md'), 'utf8'), 'the founder\'s version');
  // A backup of nothing is null, not an empty directory the founder has to wonder about.
  assert.equal(backupManaged(dir, [], '2026-08-21T12:00:00'), null);
  assert.equal(backupManaged(dir, ['.claude/agents/ghost.md'], '2026-08-21T12:00:00'), null);
});

test('the backup path never escapes .boss/backups/', () => {
  const dir = project({ 'README.md': 'x' });
  write(dir, '.claude/agents/coder.md', 'v');
  const relDir = backupManaged(dir, ['.claude/agents/coder.md'], '2026-08-21T12:00:00');
  assert.ok(relDir.startsWith(join('.boss', 'backups')), relDir);
  assert.ok(existsSync(join(dir, '.boss', 'backups')));
  assert.equal(readdirSync(join(dir, '.boss', 'backups')).length, 1);
});

// --- the apply path, which is where the bug actually lived ---------------------------------
import { planSync, applySync, stampManaged } from '../src/sync.js';

// A minimal project standing in for a scaffolded one: real layers, a real managed file on disk.
function synced(overrides = {}) {
  const dir = project({ 'README.md': 'x' });
  const stamp = {
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], skills: [], hooks: [], ...overrides,
  };
  return { dir, stamp };
}

test('REGRESSION: --apply never overwrites a file the founder edited', () => {
  const { dir, stamp } = synced();
  // Install for real, which is what stamps provenance.
  const plan0 = planSync(dir, stamp);
  applySync(dir, plan0, stamp, {});

  const target = plan0.entries.find((e) => e.kind === 'agent');
  assert.ok(target, 'the L0 template must ship at least one agent for this test to mean anything');

  // The founder makes it theirs, and BOSS moves on independently.
  const mine = readFileSync(join(dir, target.rel), 'utf8') + '\n## MY NOTE\nkeep this.\n';
  writeFileSync(join(dir, target.rel), mine);

  const plan = planSync(dir, { ...stamp, bossVersion: '0.0.1' });
  const entry = plan.entries.find((e) => e.rel === target.rel);
  assert.equal(entry.status, 'changed');
  assert.equal(entry.edited, true, 'BOSS must know this one is the founder\'s');

  const res = applySync(dir, plan, stamp, {});
  assert.ok(res.skipped.some((e) => e.rel === target.rel), 'it must be reported as left alone');
  assert.match(readFileSync(join(dir, target.rel), 'utf8'), /keep this\./, 'the edit must survive');
});

test('--force overwrites, but the founder can always get their version back', () => {
  const { dir, stamp } = synced();
  applySync(dir, planSync(dir, stamp), stamp, {});
  const target = planSync(dir, stamp).entries.find((e) => e.kind === 'agent');
  writeFileSync(join(dir, target.rel), 'ONLY MY WORDS\n');

  const res = applySync(dir, planSync(dir, stamp), stamp, { force: true });
  assert.ok(res.backupDir, 'a forced overwrite must leave a way back');
  assert.equal(readFileSync(join(dir, res.backupDir, target.rel), 'utf8'), 'ONLY MY WORDS\n');
  assert.ok(!/ONLY MY WORDS/.test(readFileSync(join(dir, target.rel), 'utf8')));
});

test('a skipped file keeps BOSS\'s original hash — it is not re-stamped as BOSS\'s own', () => {
  // The subtle way this could have re-broken itself: stamping the whole tree after a sync would
  // record the FOUNDER's bytes for a file BOSS deliberately did not write, so the next run would
  // read it as untouched and overwrite it silently.
  const { dir, stamp } = synced();
  applySync(dir, planSync(dir, stamp), stamp, {});
  const target = planSync(dir, stamp).entries.find((e) => e.kind === 'agent');
  const before = readLedger(dir)[target.rel];

  writeFileSync(join(dir, target.rel), readFileSync(join(dir, target.rel), 'utf8') + '\nmine\n');
  applySync(dir, planSync(dir, stamp), stamp, {});

  assert.equal(readLedger(dir)[target.rel], before, 'the ledger must still hold BOSS\'s version');
  assert.equal(planSync(dir, stamp).entries.find((e) => e.rel === target.rel).edited, true,
    'and it must still read as edited on the next run');
});

test('provenance is never back-filled onto files BOSS did not write', () => {
  // BOSS's own repo is the live example: a hand-built .claude/ that shares filenames with shipped
  // templates. Stamping it would mark hand-written files as BOSS's and make them overwritable.
  const dir = project({ 'README.md': 'x' });
  mkdirSync(join(dir, '.claude', 'agents'), { recursive: true });
  writeFileSync(join(dir, '.claude', 'agents', 'mentor-founder.md'), 'hand-written, never scaffolded');
  assert.deepEqual(readLedger(dir), {}, 'merely existing on disk must not create provenance');
  assert.equal(provenance(dir, '.claude/agents/mentor-founder.md', 'hand-written, never scaffolded'), null);
});
