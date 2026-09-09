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

// --- what reaches `boss status`, and what stays in `boss records` -----------------------------
// `cmdStatus` said it carried "ONLY the direction that is good news" while `driftLine` fell back to
// "N records no longer match your repo" whenever there was no good news — so the orientation surface
// grew the chore line it promised not to carry. Observed on a project whose only findings were
// missing `from:` fields. These pin the boundary in both directions.

test('REGRESSION: a chore-only project is silent on `boss status` — chores live in `boss records`', () => {
  // A FEAT with no `from:` is a real finding (`unlinked-promotion`) and a real chore. It is exactly
  // the shape that used to print "3 records no longer match your repo" above a founder's board.
  const d = project([
    ['FEAT-001-a.md', 'id: FEAT-001\nstatus: building\nproof: none\nproof_note: x'],
    ['FEAT-002-b.md', 'id: FEAT-002\nstatus: building\nproof: none\nproof_note: x'],
  ]);
  assert.ok(recordDrift(d).length > 0, 'the findings still exist — this is about WHERE they surface');
  assert.equal(driftLine(d), null, 'boss status is not a chore list');
  rmSync(d, { recursive: true, force: true });
});

test('a duplicate id DOES reach status — it is not untidy, it makes every reference ambiguous', () => {
  const d = project([
    ['IDEA-059-a.md', 'id: IDEA-059\nstatus: shipped\nproof: none\nproof_note: x'],
    ['IDEA-059-b.md', 'id: IDEA-059\nstatus: shipped\nproof: none\nproof_note: x'],
  ]);
  const line = driftLine(d);
  assert.ok(line, 'a claimed-twice id is worth interrupting for');
  assert.match(line.head, /IDEA-059/, 'names the id, so it can be acted on without a second command');
  assert.match(line.head, /ambiguous/, 'phrased as the consequence, not the count');
  rmSync(d, { recursive: true, force: true });
});

test('good news still outranks a duplicate id — the positive register leads when there is one', () => {
  const d = project(
    [
      ['IDEA-001-x.md', 'id: IDEA-001\nstatus: exploring\nproof: src/done.ts'],
      ['IDEA-059-a.md', 'id: IDEA-059\nstatus: shipped\nproof: none\nproof_note: x'],
      ['IDEA-059-b.md', 'id: IDEA-059\nstatus: shipped\nproof: none\nproof_note: x'],
    ],
    ['src/done.ts'],
  );
  assert.match(driftLine(d).head, /already finished/);
  rmSync(d, { recursive: true, force: true });
});

// --- the field that looks answered ------------------------------------------------------------
// The bug BOSS shipped: the `/spec` FEAT template wrote `source: IDEA-NNN` while the skill body
// and this checker both read `from:`. A missing field gets reported; a misspelled one does not —
// which makes this the quietest way a record goes wrong.

test('a near-miss field name is caught — the value is a record id, so it was a reach for `from:`', () => {
  const d = project([['FEAT-001-x.md', 'id: FEAT-001\nstatus: building\nfrom: none\nproof: none\nsource: IDEA-007']]);
  assert.ok(kinds(d).includes('stale-field'));
  assert.match(recordDrift(d).find((f) => f.kind === 'stale-field').what, /nothing reads `source:`/);
  rmSync(d, { recursive: true, force: true });
});

test('free-form `source:` prose is NOT flagged — a whitelist would fail people for annotating', () => {
  const d = project([['IDEA-001-x.md', 'id: IDEA-001\nstatus: exploring\nproof: none\nsource: Ajesh, 2026-08-20 — "what if the board rolled up?"']]);
  assert.deepEqual(kinds(d).filter((k) => k === 'stale-field'), []);
  rmSync(d, { recursive: true, force: true });
});

test('`shipped:` is flagged whatever its value — no reader opens it, the board reads `shipped_on:`', () => {
  const d = project([['IDEA-001-x.md', 'id: IDEA-001\nstatus: shipped\nproof: none\nshipped: 2026-05-21 (v0.18.0)']]);
  assert.ok(kinds(d).includes('stale-field'));
  rmSync(d, { recursive: true, force: true });
});

test('`building_since:` left on a shipped record is the record saying two things at once', () => {
  const d = project([['FEAT-001-x.md', 'id: FEAT-001\nstatus: shipped\nfrom: none\nproof: none\nbuilding_since: 2026-06-20\nshipped_on: 2026-06-21']]);
  assert.ok(recordDrift(d).some((f) => f.kind === 'stale-field' && /building_since/.test(f.what)));
  rmSync(d, { recursive: true, force: true });
});

test('a tidy finding never reaches `boss status` — that surface is for where-am-I, not chores', () => {
  const d = project([['FEAT-001-x.md', 'id: FEAT-001\nstatus: building\nfrom: none\nproof: none\nimplements: IDEA-007']]);
  assert.ok(kinds(d).includes('stale-field'));
  assert.equal(driftLine(d), null);
  rmSync(d, { recursive: true, force: true });
});

// --- the split: scope that grew and moved to a new id ---------------------------------------
// BOSS improvised this four times and never named it. FEAT-023 ↔ IDEA-040 is the worked example
// done right — and the link lived in two differently-named free-form fields no reader opened.

test('a split is legible from BOTH ends, or it is only findable by someone who already knows', () => {
  const d = project([
    ['FEAT-001-a.md', 'id: FEAT-001\nstatus: shipped\nfrom: none\nproof: none\nspun_to: IDEA-009 (the rest of the scope)'],
    ['IDEA-009-b.md', 'id: IDEA-009\nstatus: ready\nproof: none'],
  ]);
  assert.ok(kinds(d).includes('broken-split'), 'IDEA-009 does not point back');
  rmSync(d, { recursive: true, force: true });

  const ok = project([
    ['FEAT-001-a.md', 'id: FEAT-001\nstatus: shipped\nfrom: none\nproof: none\nspun_to: IDEA-009 (the rest of the scope)'],
    ['IDEA-009-b.md', 'id: IDEA-009\nstatus: ready\nproof: none\nspun_from: FEAT-001 (scope that grew past the spec)'],
  ]);
  assert.deepEqual(kinds(ok).filter((k) => k === 'broken-split'), [], 'both ends named → nothing to report');
  rmSync(ok, { recursive: true, force: true });
});

test('a split pointing at a record that does not exist is caught', () => {
  const d = project([
    ['FEAT-001-a.md', 'id: FEAT-001\nstatus: shipped\nfrom: none\nproof: none\nspun_to: IDEA-404'],
  ]);
  assert.ok(recordDrift(d).some((f) => f.kind === 'broken-split' && /no such record/.test(f.what)));
});

test('free-form `spun_from:` provenance is never a link — three of BOSS\'s four uses are prose', () => {
  // `spun_from: "what's-missing gap pass 2026-06-20 (Ajesh — ...)"` is real, correct usage. A
  // check that flagged it would fail people for annotating their own records.
  const d = project([
    ['IDEA-001-a.md', 'id: IDEA-001\nstatus: ready\nproof: none\nspun_from: "what\'s-missing gap pass 2026-06-20 (Ajesh)"'],
  ]);
  assert.deepEqual(kinds(d).filter((k) => k === 'broken-split'), []);
});

test('the leading token is the link and the rest is free detail — same rule as a status', () => {
  const d = project([
    ['FEAT-001-a.md', 'id: FEAT-001\nstatus: shipped\nfrom: none\nproof: none\nspun_to: IDEA-009 thread 3 (split when 1-2 shipped)'],
    ['IDEA-009-b.md', 'id: IDEA-009\nstatus: ready\nproof: none\nspun_from: FEAT-001 thread 3 (the V1 rung)'],
  ]);
  assert.deepEqual(kinds(d).filter((k) => k === 'broken-split'), [], 'detail after the id must not break the link');
});

test('`spun_from:` duplicating `from:` is the promotion said twice, not a split', () => {
  // FEAT-023 carried both. Reporting it as a missing reciprocal would send someone to add a
  // `spun_to:` that should not exist — a split is scope LEAVING a record, not its origin.
  const d = project([
    ['IDEA-001-a.md', 'id: IDEA-001\nstatus: shipped\nproof: none\npromoted_to: FEAT-001'],
    ['FEAT-001-b.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nfrom: IDEA-001\nspun_from: IDEA-001 research realignment'],
  ]);
  const f = recordDrift(d).find((x) => x.kind === 'broken-split');
  assert.ok(f, 'the duplicate is worth reporting');
  assert.match(f.what, /duplicates `from: IDEA-001`/);
});

// --- reciprocity: the half the docs always claimed and nothing checked ------------------------
// docs/IDS.md: "a promotion is legible from both ends, and that part IS enforced
// (`npm run check:backlog`)" — and check-backlog.js did not contain the string `promoted_to`.
// The shipped IDS said "`boss records` checks both directions", which was half-true: it verified
// each TARGET EXISTS, never that the two point at each other.

test('a promotion that reads from one end only is caught', () => {
  const d = project([
    ['IDEA-001-a.md', 'id: IDEA-001\nstatus: building\nproof: none'],
    ['FEAT-001-b.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nfrom: IDEA-001'],
  ]);
  const f = recordDrift(d).find((x) => x.kind === 'unlinked-promotion');
  assert.ok(f, 'IDEA-001 never says promoted_to');
  assert.match(f.what, /does not say `promoted_to: FEAT-001`/);
});

test('two records can no longer both pass while disagreeing about the same promotion', () => {
  // Each end existed, so the old existence-only check passed both — and the promotion was still
  // ambiguous, which is the IDEA-059 problem wearing the link's clothes.
  const d = project([
    ['IDEA-001-a.md', 'id: IDEA-001\nstatus: building\nproof: none\npromoted_to: FEAT-001'],
    ['IDEA-002-c.md', 'id: IDEA-002\nstatus: building\nproof: none'],
    ['FEAT-001-b.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nfrom: IDEA-002'],
  ]);
  const found = recordDrift(d).filter((x) => x.kind === 'unlinked-promotion');
  assert.ok(found.some((f) => /the two ends disagree/.test(f.what)), 'IDEA-001 -> FEAT-001 disagrees');
});

test('a reciprocal promotion reports nothing — including one idea to several FEATs', () => {
  const d = project([
    ['IDEA-001-a.md', 'id: IDEA-001\nstatus: building\nproof: none\npromoted_to: FEAT-001, FEAT-002'],
    ['FEAT-001-b.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nfrom: IDEA-001'],
    ['FEAT-002-c.md', 'id: FEAT-002\nstatus: shipped\nproof: none\nfrom: IDEA-001'],
  ]);
  assert.deepEqual(kinds(d).filter((k) => k === 'unlinked-promotion'), [],
    'IDEA-037 -> FEAT-021 + FEAT-023 is BOSS\'s own shape and must stay clean');
});

test('`from: none` needs no reciprocal — a feature can come straight from a conversation', () => {
  const d = project([
    ['FEAT-001-b.md', 'id: FEAT-001\nstatus: shipped\nproof: none\nfrom: none\nfrom_note: from a customer call'],
  ]);
  assert.deepEqual(kinds(d).filter((k) => k === 'unlinked-promotion'), []);
});
