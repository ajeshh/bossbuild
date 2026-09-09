// `boss learn` — where a promoted pattern lands, and why the shelf may never hold a second copy.
//
// WHY THIS FILE EXISTS: `library/agents|skills|hooks` used to be a landing zone that nothing read
// and nothing deployed from. `applyStage()` and `managedFiles()` resolve only `stages/<id>/template/`,
// so anything routed UP had to be hand-copied into a template to ship — and then the two copies
// drifted. By v0.245.0, four of the eight artifacts with a twin were stale on the library side, two
// of them still carrying defects already fixed on the shipped copy. Reconciliation was a chore
// someone had to remember, which `src/brain.js` already records as the thing that is not a mechanism.
//
// The fix was subtraction, so the guard has to be structural: nothing may put a shipped artifact
// class back on the shelf, and `boss learn` has to refuse the ambiguity rather than pick a rung.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT, STAGE_ORDER } from '../src/paths.js';
import { learn, SHELF_CATEGORIES, SHIPPED_CLASSES, LEARN_CATEGORIES } from '../src/learn.js';

test('the shelf holds no artifact class that ships', () => {
  for (const cls of SHIPPED_CLASSES) {
    assert.equal(
      existsSync(join(BOSS_ROOT, 'library', cls)), false,
      `library/${cls}/ is back. It is read by nothing and deployed from nothing, so every file in `
      + 'it is a second copy waiting to drift. An agent, skill or hook belongs in a stage template.',
    );
  }
});

// The stronger form of the same rule, and the one that would have caught the original drift: no
// file on the shelf may share a basename with something that ships. A filename collision here is
// either a mirror re-forming or two things claiming one name — both worth stopping.
test('no shelf file shares a name with a shipped artifact', () => {
  const shipped = new Set();
  for (const stage of STAGE_ORDER) {
    const claude = join(BOSS_ROOT, 'stages', stage, 'template', '.claude');
    for (const cls of SHIPPED_CLASSES) {
      const dir = join(claude, cls);
      if (existsSync(dir)) for (const n of readdirSync(dir)) shipped.add(n);
    }
  }
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const n of readdirSync(dir)) {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) walk(p);
      else {
        assert.equal(
          shipped.has(n), false,
          `library/ holds '${n}', which also ships from a stage template. Two copies of one `
          + 'artifact is the drift this shelf was cut back to prevent.',
        );
      }
    }
  };
  walk(join(BOSS_ROOT, 'library'));
});

test('a shipped class refuses to land without a mode', () => {
  for (const cls of SHIPPED_CLASSES) {
    assert.throws(
      () => learn({ srcPath: 'VERSION', category: cls, confirmed: true }),
      new RegExp(`--as ${cls} also needs --mode`),
      `learn --as ${cls} must refuse rather than guess a rung — the rung decides who ever gets it.`,
    );
  }
});

test('the shelf is exactly what has a reader, and the lists are the whole surface', () => {
  // `practices` is the only category with a home that needs no rung, because it is the only one
  // with a reader that resolves from the installed package (`boss craft` → PRACTICES_DIR).
  // `memory-seed` was the fifth and went in v0.249.0: its premise — seeds every new project starts
  // with — was a mechanism for what IDEA-080/DEC-015 had already answered NO at v0.245.0.
  assert.deepEqual(SHELF_CATEGORIES, ['practices']);
  assert.deepEqual(LEARN_CATEGORIES, [...SHIPPED_CLASSES, ...SHELF_CATEGORIES]);
  assert.equal(
    existsSync(join(BOSS_ROOT, 'library', 'memory-seed')), false,
    'library/memory-seed/ is back. Durable memory is machine-local and person-scoped — BOSS does '
    + 'not seed, manage or ship anyone\'s memory store (IDEA-080 / DEC-015).',
  );
});

// The reason the shelf was cut back at all: a folder nothing reads is a place to put things and
// forget them. This asserts the surviving shelf against the ONE path `src/paths.js` exports, so a
// new folder here has to come with a reader rather than an intention.
test('every folder on the shelf has a reader', () => {
  const readable = new Set(['practices']);
  for (const n of readdirSync(join(BOSS_ROOT, 'library'))) {
    if (!statSync(join(BOSS_ROOT, 'library', n)).isDirectory()) continue;
    assert.equal(
      readable.has(n), true,
      `library/${n}/ has no reader in src/. Every previous folder in this position — agents, skills, `
      + 'hooks, memory-seed — was a dead drop that drifted or outlived its premise. Add the reader, '
      + 'or do not add the folder.',
    );
  }
});

// A file the manifest does not claim never syncs — `managedFiles()` iterates the manifest. If
// `boss learn` copied without registering, it would move the dead drop instead of closing it, so
// the promise is checked against the shipped code rather than left to the comment above it.
test('learn registers a shipped artifact in the stage manifest', () => {
  const src = readFileSync(join(BOSS_ROOT, 'src', 'learn.js'), 'utf8');
  assert.match(src, /manifest\.json/, 'learn.js must read the stage manifest to register an artifact');
  assert.match(src, /arr\.includes\(entry\)/, 'registration must be deduped — concurrent sessions append twice');
});
