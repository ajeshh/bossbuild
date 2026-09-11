// DEC-015 + DEC-016 — where per-person conscience state lives, and who BOSS may interrupt.
//
// The headline test is `two worktrees of one project share one conscience memory`. It encodes
// the defect directly: before DEC-015, per-person state was "gitignored inside the working
// directory", which is only the same thing as "per person" while a person has one working
// directory. Remote Control spawns sessions in their own git worktree — the same person, a
// different directory — so the conscience arrived remembering the venture and having forgotten
// every nudge it fired, and re-nagged a founder who had already overridden it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import {
  projectKey, personStatePath, personStateDir,
} from '../stages/L0-quickstart/template/.claude/hooks/lib/person-state.js';
import { recordBrainEntry } from '../src/brain.js';
import { BOSS_ROOT } from '../src/paths.js';

// Every test here writes under a redirected HOME. `os.homedir()` reads $HOME on POSIX, so this
// is what keeps the suite out of the real ~/.boss — the same isolation `boss()` does by env.
const HOME = mkdtempSync(join(tmpdir(), 'boss-home-'));
process.env.HOME = HOME;
process.env.USERPROFILE = HOME;   // `os.homedir()` reads THIS on Windows, not $HOME (IDEA-095)
assert.equal(homedir(), HOME, 'HOME redirection failed — refusing to write to a real home dir');

// A project whose `.boss/manifest.json` is byte-identical to another's, which is exactly what a
// git worktree produces: the manifest is TRACKED, so every checkout of the project carries it.
function projectWith(manifest, files = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'boss-proj-'));
  mkdirSync(join(dir, '.boss', 'brain'), { recursive: true });
  if (manifest) writeFileSync(join(dir, '.boss', 'manifest.json'), JSON.stringify(manifest));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), body);
  }
  return dir;
}

const MANIFEST = { name: 'acme', createdAt: '2026-09-01T00:00:00.000Z', stage: 'L0-quickstart' };

test('two worktrees of one project share one conscience memory (DEC-015)', () => {
  // THE regression. Two different directories, one project — because that is what
  // `git worktree add` makes, and it is how Remote Control spawns a session.
  const laptop = projectWith(MANIFEST);
  const worktree = projectWith(MANIFEST);

  assert.notEqual(laptop, worktree, 'the two checkouts must be different directories');
  assert.equal(projectKey(laptop), projectKey(worktree), 'same project, same key');
  assert.equal(
    personStatePath(laptop, 'conscience-log.jsonl'),
    personStatePath(worktree, 'conscience-log.jsonl'),
    'a nudge recorded in one checkout must be visible from the other — otherwise the conscience re-nags',
  );
});

test('two DIFFERENT projects that share a name do not share memory', () => {
  // `name` alone would collide for anyone who scaffolds two projects called "app".
  const a = projectWith({ name: 'app', createdAt: '2026-01-01T00:00:00.000Z' });
  const b = projectWith({ name: 'app', createdAt: '2026-06-01T00:00:00.000Z' });
  assert.notEqual(projectKey(a), projectKey(b));
});

test('a legacy in-project log is copied up and the original is left alone (DEC-015)', () => {
  // Read-both-write-new, and never destructive: a path change must not be able to lose a
  // founder's history. That is the 2026-08-21 lesson, applied to a migration instead of a delete.
  const legacy = '{"ts":"2026-08-20","moments":[{"moment":"drift"}]}\n';
  const dir = projectWith(MANIFEST, { '.boss/conscience-log.jsonl': legacy });

  const resolved = personStatePath(dir, 'conscience-log.jsonl');
  assert.notEqual(resolved, join(dir, '.boss', 'conscience-log.jsonl'), 'should resolve out of the tree');
  assert.equal(readFileSync(resolved, 'utf8'), legacy, 'history must survive the move');
  assert.ok(existsSync(join(dir, '.boss', 'conscience-log.jsonl')), 'the original is COPIED, never moved');
});

test('a directory with no manifest behaves exactly as it did before (DEC-015)', () => {
  // No stable key means no machine-local home. A non-BOSS directory — and every test that
  // builds a bare fixture — must be untouched by this change rather than half-migrated.
  const dir = projectWith(null);
  assert.equal(projectKey(dir), null);
  assert.equal(personStateDir(dir), null);
  assert.equal(personStatePath(dir, 'conscience-log.jsonl'), join(dir, '.boss', 'conscience-log.jsonl'));
});

test('relationship headlines never land in the index that COMMITS (DEC-001 residual)', () => {
  // `.boss/brain/index.json` is tracked and carried `kind: 'relationship'` headlines — "flagged
  // X, they did Y" — so one founder's nudge history reached the other through the index even
  // while `relationship.md` was correctly private. DEC-001 named this and deferred it.
  const dir = projectWith(MANIFEST);
  recordBrainEntry(dir, { headline: 'the venture read', kind: 'read' });
  recordBrainEntry(dir, { headline: 'flagged drift, they overrode it', kind: 'relationship' });

  const tracked = JSON.parse(readFileSync(join(dir, '.boss', 'brain', 'index.json'), 'utf8'));
  const kinds = tracked.entries.map((e) => e.kind);
  assert.deepEqual(kinds, ['read'], 'the committed index must carry venture reads only');
  assert.ok(
    !JSON.stringify(tracked).includes('overrode'),
    'a relationship headline reached the tracked index — that is the leak DEC-001 forbids',
  );

  const personal = JSON.parse(readFileSync(join(personStateDir(dir), 'brain', 'index.json'), 'utf8'));
  assert.deepEqual(personal.entries.map((e) => e.headline), ['flagged drift, they overrode it']);
});

test('no shipped surface can interrupt a founder who is away (DEC-016)', () => {
  // DEC-016 has no implementation — its whole content is that BOSS keeps not doing something,
  // which is precisely the kind of decision that rots into a comment nobody honours. Remote
  // Control made the capability real (`PushNotification` reaches the phone), so the assertion
  // is written now, while it is trivially true and therefore cheap to lock in.
  //
  // Scoped to CALL SITES on purpose. The word may legitimately appear in prose — this decision
  // discusses it, and `src/orientation.js` cites it precisely so nobody re-derives the old rule —
  // so comments are stripped before matching. Full-line comments only, never a blunt regex over
  // string literals: a false NEGATIVE in a safety assertion is far worse than a false positive.
  //
  // What this can and cannot see, stated plainly rather than implied: it catches a shell-out or a
  // JS call. It does NOT read the prose a hook prints or a skill instructs, which is the other way
  // BOSS could ask for a push. That half has no mechanical check and is held by DEC-016 alone.
  const SENDERS = /osascript|display\s+notification|terminal-notifier|node-notifier|notify-send|PushNotification\s*\(|new\s+Notification\s*\(/;
  const stripComments = (src) => src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  const offenders = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'node_modules') walk(abs); continue; }
      if (!e.name.endsWith('.js')) continue;
      if (SENDERS.test(stripComments(readFileSync(abs, 'utf8')))) offenders.push(abs.replace(BOSS_ROOT + '/', ''));
    }
  };
  for (const root of ['src', 'stages']) walk(join(BOSS_ROOT, root));
  assert.deepEqual(offenders, [], `DEC-016: BOSS never initiates contact with an absent founder — ${offenders.join(', ')}`);
});
