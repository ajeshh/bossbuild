// BOSS · record drift — the check that a status still describes the code.
//
// The bug these guard against is the one that motivated the module: BOSS's own backlog had 18
// records claiming work was unbuilt that had already shipped. The FIRST version of the checker
// compared a record to its index row — document to document — and would have passed every one of
// them. So the tests that matter here are the two DIRECTIONS, not the formatting.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { recordDrift, driftLine } from '../src/records.js';

const project = (records = [], files = []) => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-records-'));
  mkdirSync(join(dir, 'docs', 'ideas'), { recursive: true });
  for (const [name, front] of records) {
    writeFileSync(join(dir, 'docs', 'ideas', name), `---\n${front}\n---\n\n# ${name}\n`);
  }
  for (const f of files) {
    mkdirSync(join(dir, f.split('/').slice(0, -1).join('/') || '.'), { recursive: true });
    writeFileSync(join(dir, f), 'x');
  }
  return dir;
};
const kinds = (dir) => recordDrift(dir).map((f) => f.kind);

test('THE disease: a record says unbuilt and the artifact is already there', () => {
  const d = project(
    [['IDEA-001-checkout.md', 'id: IDEA-001\nstatus: exploring\nproof: src/checkout.ts']],
    ['src/checkout.ts'],
  );
  assert.deepEqual(kinds(d), ['built-not-recorded']);
  rmSync(d, { recursive: true, force: true });
});

test('the other direction: a record claims shipped and the repo cannot show it', () => {
  const d = project([['IDEA-001-x.md', 'id: IDEA-001\nstatus: shipped\nproof: src/gone.ts']]);
  assert.deepEqual(kinds(d), ['claimed-not-built']);
  rmSync(d, { recursive: true, force: true });
});

test('a record that agrees with the repo is silent, in both directions', () => {
  const d = project(
    [['IDEA-001-a.md', 'id: IDEA-001\nstatus: shipped\nproof: src/a.ts'],
      ['IDEA-002-b.md', 'id: IDEA-002\nstatus: building\nproof: src/b.ts']],
    ['src/a.ts'],
  );
  assert.deepEqual(recordDrift(d), []);
  rmSync(d, { recursive: true, force: true });
});

// The exception has to be DECLARED, not inferred — that is the whole bargain. A built-but-blocked
// record is legitimate (IDEA-047 needs a bought domain, which is not a build task); a built-and-
// silent one is the bug.
test('proof_note: buys the built-but-not-done state, and only when written', () => {
  const withNote = project(
    [['IDEA-001-x.md', 'id: IDEA-001\nstatus: building\nproof: site/try.html\nproof_note: built, waiting on the domain']],
    ['site/try.html'],
  );
  assert.deepEqual(recordDrift(withNote), []);
  rmSync(withNote, { recursive: true, force: true });

  const without = project(
    [['IDEA-001-x.md', 'id: IDEA-001\nstatus: building\nproof: site/try.html']],
    ['site/try.html'],
  );
  assert.deepEqual(kinds(without), ['built-not-recorded']);
  rmSync(without, { recursive: true, force: true });
});

test('`proof: none` is a legitimate answer — some records produce a decision, not a file', () => {
  const d = project([['IDEA-012-audit.md', 'id: IDEA-012\nstatus: shipped\nproof: none\nproof_note: became the backlog']]);
  assert.deepEqual(recordDrift(d), []);
  rmSync(d, { recursive: true, force: true });
});

// A founder never asked for this convention. Failing their project for not adopting it is how a
// check gets switched off — so it stays quiet until they ask for everything.
test('REGRESSION: a founder with no `proof:` anywhere is never nagged', () => {
  const d = project([['IDEA-001-x.md', 'id: IDEA-001\nstatus: exploring'], ['IDEA-002-y.md', 'id: IDEA-002\nstatus: building']]);
  assert.equal(driftLine(d), null, 'boss status must stay silent');
  assert.deepEqual(recordDrift(d).map((f) => f.quiet), [true, true], 'still offered under --all');
  rmSync(d, { recursive: true, force: true });
});

test('two files claiming one id is caught — every reference to it is ambiguous', () => {
  const d = project([
    ['IDEA-059-a.md', 'id: IDEA-059\nstatus: shipped\nproof: none\nproof_note: x'],
    ['IDEA-059-b.md', 'id: IDEA-059\nstatus: building\nproof: src/nope.ts'],
  ]);
  assert.ok(kinds(d).includes('duplicate-id'));
  rmSync(d, { recursive: true, force: true });
});

test('an off-vocabulary status is caught — five spellings of "shipped" is how this rotted', () => {
  const d = project([['IDEA-001-x.md', 'id: IDEA-001\nstatus: implemented\nproof: src/a.ts']], ['src/a.ts']);
  assert.deepEqual(kinds(d), ['off-vocabulary']);
  rmSync(d, { recursive: true, force: true });
});

test('the status line leads with the good news, because that half is work they did', () => {
  const d = project(
    [['IDEA-001-x.md', 'id: IDEA-001\nstatus: exploring\nproof: src/done.ts']],
    ['src/done.ts'],
  );
  assert.match(driftLine(d).head, /already finished/);
  rmSync(d, { recursive: true, force: true });
});

test('REGRESSION: a malformed record never throws — boss status must not die on it', () => {
  const d = mkdtempSync(join(tmpdir(), 'boss-records-'));
  mkdirSync(join(d, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(d, 'docs', 'ideas', 'IDEA-001-x.md'), 'no frontmatter at all');
  assert.doesNotThrow(() => recordDrift(d));
  assert.equal(driftLine(d), null);
  rmSync(d, { recursive: true, force: true });
});

test('a project with no record folders at all is not a finding', () => {
  const d = mkdtempSync(join(tmpdir(), 'boss-records-'));
  assert.deepEqual(recordDrift(d), []);
  rmSync(d, { recursive: true, force: true });
});
