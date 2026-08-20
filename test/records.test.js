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
import { recordDrift, driftLine, nextId } from '../src/records.js';

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

// --- allocation ---------------------------------------------------------------------------
// The website said this out loud before it was true: allocation was "a sentence in a skill file
// telling an agent to count, not code that computes." These are the code that computes.

test('the next id is computed, and prose counts — a number reserved in an index is taken', () => {
  const d = mkdtempSync(join(tmpdir(), 'boss-records-'));
  mkdirSync(join(d, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(d, 'docs', 'IDS.md'), '| `IDEA-NNN` | an idea | `docs/ideas/` |\n');
  writeFileSync(join(d, 'docs', 'ideas', 'IDEA-001-a.md'), '---\nid: IDEA-001\nstatus: shipped\n---\n');
  assert.equal(nextId(d, 'IDEA'), 'IDEA-002');
  // a planning doc reserves 007 with no file behind it — the counter must not hand it out again
  writeFileSync(join(d, 'docs', 'ideas', 'INDEX.md'), 'next up: IDEA-007 the big one\n');
  assert.equal(nextId(d, 'IDEA'), 'IDEA-008');
  rmSync(d, { recursive: true, force: true });
});

// The first cut swept /[A-Z]{3,4}-\d+/ and confidently returned CVE-2027 and SHA-257 as next free
// numbers, having found a vulnerability id and a hash algorithm in the prose.
test('REGRESSION: only prefixes DECLARED in IDS.md count — not everything shaped like an id', () => {
  const d = mkdtempSync(join(tmpdir(), 'boss-records-'));
  mkdirSync(join(d, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(d, 'docs', 'IDS.md'), '| `IDEA-NNN` | an idea | `docs/ideas/` |\n');
  writeFileSync(join(d, 'docs', 'ideas', 'IDEA-001-a.md'),
    '---\nid: IDEA-001\nstatus: shipped\n---\n\nMitigates CVE-2026-1234 using SHA-256.\n');
  assert.equal(nextId(d, 'CVE'), null, 'CVE is not a record type here');
  assert.equal(nextId(d, 'IDEA'), 'IDEA-002');
  rmSync(d, { recursive: true, force: true });
});

// --- per-type vocabulary ------------------------------------------------------------------
// The seven-word ladder is the LIFECYCLE vocabulary. Applying it to every prefix reported BOSS's
// own three decisions and its one evidence file as broken on the first run.
test('REGRESSION: DEC/EVID are not held to the IDEA lifecycle vocabulary', () => {
  const d = mkdtempSync(join(tmpdir(), 'boss-records-'));
  mkdirSync(join(d, 'docs', 'decisions'), { recursive: true });
  mkdirSync(join(d, 'docs', 'evidence'), { recursive: true });
  writeFileSync(join(d, 'docs', 'decisions', 'DEC-001-x.md'), '---\nid: DEC-001\nstatus: decided\n---\n');
  writeFileSync(join(d, 'docs', 'evidence', 'EVID-001-y.md'), '---\nid: EVID-001\nstatus: captured\n---\n');
  assert.deepEqual(recordDrift(d), [], 'a decision is not "shipped" and evidence is not "building"');
  rmSync(d, { recursive: true, force: true });
});

// --- promotion linkage --------------------------------------------------------------------
test('a FEAT that cannot name the idea it came from is an orphan', () => {
  const d = project([['FEAT-001-x.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nproof_note: x']]);
  assert.ok(kinds(d).includes('unlinked-promotion'));
  rmSync(d, { recursive: true, force: true });
});

test('a promotion pointing at a record that does not exist is caught, both directions', () => {
  const d = project([
    ['IDEA-001-a.md', 'id: IDEA-001\nstatus: shipped\nproof: none\nproof_note: x\npromoted_to: FEAT-099'],
    ['FEAT-001-b.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nproof_note: x\nfrom: IDEA-099'],
  ]);
  assert.equal(kinds(d).filter((k) => k === 'unlinked-promotion').length, 2);
  rmSync(d, { recursive: true, force: true });
});

test('`from: none` is a real answer — some features never had an idea', () => {
  const d = project([['FEAT-001-x.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nproof_note: x\nfrom: none']]);
  assert.deepEqual(recordDrift(d), []);
  rmSync(d, { recursive: true, force: true });
});

// Caught on a real fresh scaffold: BOSS's OWN shipped docs use example ids to explain the system
// (docs/IDS.md shows IDEA-014 → FEAT-003), and the first cut counted them as taken. A brand-new
// project was offered IDEA-045 as its first idea.
test('REGRESSION: example ids in documentation are illustrations, not reservations', () => {
  const d = mkdtempSync(join(tmpdir(), 'boss-records-'));
  mkdirSync(join(d, 'docs', 'loops'), { recursive: true });
  mkdirSync(join(d, 'docs', 'ideas'), { recursive: true });
  writeFileSync(join(d, 'docs', 'IDS.md'),
    '| `IDEA-NNN` | an idea | `docs/ideas/` |\n\nPromote IDEA-014 into FEAT-003 when it earns it.\n');
  writeFileSync(join(d, 'docs', 'loops', 'capture-loop.md'), 'e.g. IDEA-005 was captured this way.\n');
  assert.equal(nextId(d, 'IDEA'), 'IDEA-001', 'a brand-new project starts at 001');
  // ...but a number reserved in the founder's OWN index is still taken.
  writeFileSync(join(d, 'docs', 'ideas', 'INDEX.md'), 'reserved: IDEA-009 for the big one\n');
  assert.equal(nextId(d, 'IDEA'), 'IDEA-010');
  rmSync(d, { recursive: true, force: true });
});
