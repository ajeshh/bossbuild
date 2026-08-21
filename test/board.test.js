// The board projection — the surface most of BOSS reads state through.
//
// Every test below locks a rule the code already claims in a comment. The two marked
// REGRESSION are the audit's shipped bugs (REVIEW-2026-07-28 §A1): they failed before
// v0.129.0 and are the reason this file exists.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { collectBoard, canvassedIdeas, computeNext, computeStuck, boardJson, renderBoardCard } from '../src/board.js';
import { project, cleanup, idea, feat, canvas, daysAgo } from './helpers.js';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

after(cleanup);

const col = (cards, id) => cards.find((c) => c.id === id)?.column;

test('no docs/ideas dir → empty, flagged, never throws', () => {
  const { cards, hasIdeasDir } = collectBoard(project({ 'README.md': 'hi' }));
  assert.equal(hasIdeasDir, false);
  assert.deepEqual(cards, []);
});

test('an idea with no canvas is Captured; with a real canvas it is Taking shape', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/IDEA-002.md': idea('IDEA-002'),
    'docs/ideas/IDEA-002-canvas.md': canvas('IDEA-002', 'Nobody will pay for this'),
  });
  const { cards } = collectBoard(dir);
  assert.equal(col(cards, 'IDEA-001'), 'Captured');
  assert.equal(col(cards, 'IDEA-002'), 'Taking shape');
});

test('a canvas whose riskiest assumption is still the placeholder does NOT count', () => {
  // The distinction the whole "pressure-tested" claim rests on: a canvas FILE is not a
  // canvas that says anything. `riskiestNamed()` rejects the italic placeholder.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/IDEA-001-canvas.md': canvas('IDEA-001', null),
  });
  assert.equal(col(collectBoard(dir).cards, 'IDEA-001'), 'Captured');
  assert.deepEqual(canvassedIdeas(dir).ids, []);
});

test('REGRESSION §A1: prose mentioning /canvas never counts as pressure-tested', () => {
  // The shipped bug: `/canvas/i.test(body)` matched the near-universal "next step: run
  // /canvas", so BOSS reported 38 canvassed of 55 ideas with zero canvases on disk.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { body: 'Next step: I should run /canvas on this someday.' }),
  });
  assert.deepEqual(canvassedIdeas(dir).ids, [], 'prose must not count');
  assert.equal(col(collectBoard(dir).cards, 'IDEA-001'), 'Captured');
});

test('REGRESSION §A1: a -canvas.md file is state, not a card and not an idea', () => {
  // Second inflation from the same fix: `-canvas.md` matched /^IDEA-\d+/ and was counted
  // as its own idea, so one captured idea reported as two.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/IDEA-001-canvas.md': canvas('IDEA-001', 'A real risk'),
  });
  const ids = collectBoard(dir).cards.map((c) => c.id);
  assert.deepEqual(ids, ['IDEA-001'], 'the canvas must not appear as its own card');
});

test('canvassedIdeas counts ideas that graduated past the canvas', () => {
  // Being promoted to a FEAT does not un-pressure-test an idea.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'building' }),
    'docs/ideas/IDEA-001-canvas.md': canvas('IDEA-001', 'A real risk'),
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { source: 'IDEA-001' }),
  });
  assert.deepEqual(canvassedIdeas(dir).ids, ['IDEA-001']);
});

test('a project-level CANVAS.md is its own fact, not an idea count', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/CANVAS.md': canvas('venture', 'The venture bet'),
  });
  const r = canvassedIdeas(dir);
  assert.equal(r.projectCanvas, true);
  assert.deepEqual(r.ids, [], 'a venture canvas is not N pressure-tested ideas');
});

test('a promoted idea is represented by its FEAT, never double-counted', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'building' }),
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { source: 'IDEA-001' }),
  });
  const { cards } = collectBoard(dir);
  assert.deepEqual(cards.map((c) => c.id), ['FEAT-001']);
});

test('FEAT status maps to a column; shipped leaves Building', () => {
  const dir = project({
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { status: 'building' }),
    'docs/ideas/FEAT-002.md': feat('FEAT-002', { status: 'shipped', shipped_on: daysAgo(2) }),
    'docs/ideas/FEAT-003.md': feat('FEAT-003', { status: 'blocked' }),
  });
  const { cards } = collectBoard(dir);
  assert.equal(col(cards, 'FEAT-001'), 'Building');
  assert.equal(col(cards, 'FEAT-002'), 'Shipped');
  assert.equal(col(cards, 'FEAT-003'), 'Building');
  assert.equal(cards.find((c) => c.id === 'FEAT-003').blocked, true);
});

test('aging + review-due are frontmatter-true, never guessed from mtime', () => {
  const dir = project({
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { building_since: daysAgo(40) }),
    'docs/ideas/FEAT-002.md': feat('FEAT-002'), // no building_since → no age signal
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { next_review: daysAgo(3) }),
    'docs/ideas/IDEA-002.md': idea('IDEA-002', { next_review: daysAgo(-30) }), // future
  });
  const { cards } = collectBoard(dir);
  assert.equal(cards.find((c) => c.id === 'FEAT-001').aging, true);
  assert.equal(cards.find((c) => c.id === 'FEAT-002').aging, false);
  assert.equal(cards.find((c) => c.id === 'FEAT-002').ageDays, null, 'no date → no guess');
  assert.equal(cards.find((c) => c.id === 'IDEA-001').reviewDue, true);
  assert.equal(cards.find((c) => c.id === 'IDEA-002').reviewDue, false);
});

test('computeNext puts finishing before starting, and only suggests pressure-testing when nothing is further along', () => {
  const busy = project({
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { building_since: daysAgo(30) }),
    'docs/ideas/IDEA-009.md': idea('IDEA-009'),
  });
  const n = computeNext(collectBoard(busy).cards);
  assert.equal(n.finish[0].id, 'FEAT-001');
  assert.deepEqual(n.pressure, [], 'do not suggest new work while something is in build');

  const idle = project({ 'docs/ideas/IDEA-009.md': idea('IDEA-009') });
  assert.equal(computeNext(collectBoard(idle).cards).pressure[0].id, 'IDEA-009');
});

test('blocked work is separated from finishable work', () => {
  const dir = project({
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { status: 'blocked' }),
    'docs/ideas/FEAT-002.md': feat('FEAT-002', { status: 'building' }),
  });
  const n = computeNext(collectBoard(dir).cards);
  assert.deepEqual(n.finish.map((c) => c.id), ['FEAT-002']);
  assert.deepEqual(n.unblock.map((c) => c.id), ['FEAT-001']);
});

test('priority: high floats to the top of its column', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001'),
    'docs/ideas/IDEA-002.md': idea('IDEA-002', { priority: 'high' }),
  });
  const captured = collectBoard(dir).cards.filter((c) => c.column === 'Captured');
  const json = boardJson(dir, 'p');
  assert.equal(captured.length, 2);
  assert.equal(json.cards.filter((c) => c.column === 'Captured')[0].id, 'IDEA-002');
});

test('only a @handle counts as a person owner (roles and blanks do not)', () => {
  const dir = project({
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { owner: '"@octocat"' }),
    'docs/ideas/FEAT-002.md': feat('FEAT-002', { owner: 'pm' }),
  });
  const { cards } = collectBoard(dir);
  assert.equal(cards.find((c) => c.id === 'FEAT-001').owner, '@octocat');
  assert.equal(cards.find((c) => c.id === 'FEAT-002').owner, null);
});

test('computeStuck gathers blocked, aging and review-due without overlap in blocked', () => {
  const dir = project({
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { status: 'blocked', next_review: daysAgo(5) }),
  });
  const s = computeStuck(collectBoard(dir).cards);
  assert.equal(s.blocked.length, 1);
  assert.equal(s.reviewDue.length, 0, 'a blocked card is reported as blocked, not as review-due');
});

test('boardJson is a stable machine contract', () => {
  const dir = project({ 'docs/ideas/IDEA-001.md': idea('IDEA-001') });
  const j = boardJson(dir, 'proj');
  assert.equal(j.project, 'proj');
  assert.deepEqual(j.columns, ['Captured', 'Taking shape', 'Building', 'Shipped']);
  assert.equal(j.total, 1);
  for (const k of ['counts', 'cards', 'next', 'stuck']) assert.ok(k in j, `missing ${k}`);
  for (const k of ['id', 'title', 'column', 'priority', 'owner', 'blocked', 'reviewDue', 'aging']) {
    assert.ok(k in j.cards[0], `card missing ${k}`);
  }
});

// --- derived ship dates + the timeline ------------------------------------------------------
// SHIPPED BROKEN ONCE, in the same session it was written: the `execFileSync` import never landed
// (the replace matched a different argument order), so `gitFirst` threw ReferenceError, the
// try/catch swallowed it, and EVERY derived date silently became null. The only symptom was an
// empty timeline strip — the same failure shape as v0.179.0's readLadder() returning {}. These
// assert the dates are real, because "it renders" was exactly what was true while it was broken.
test('a shipped FEAT with no shipped_on: still gets a date, derived from the repo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-board-tl-'));
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 't@t.t'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 't'], { cwd: dir });
  mkdirSync(join(dir, 'docs', 'ideas'), { recursive: true });
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'src', 'thing.js'), 'export const x = 1;\n');
  writeFileSync(join(dir, 'docs', 'ideas', 'FEAT-001-thing.md'),
    '---\nid: FEAT-001\nstatus: shipped\nproof: src/thing.js\n---\n\n# The thing\n');
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-qm', 'thing'], { cwd: dir });

  const card = collectBoard(dir).cards.find((c) => c.id === 'FEAT-001');
  assert.ok(card, 'the FEAT should be on the board');
  assert.match(card.shippedOn || '', /^\d{4}-\d{2}-\d{2}$/,
    'no shipped_on: in frontmatter — the date must come from the proof artifact\'s first commit');
  rmSync(dir, { recursive: true, force: true });
});

test('REGRESSION: a coding error in date derivation throws instead of silently nulling', async () => {
  // The catch must not swallow ReferenceError/TypeError — that is how it shipped broken.
  const src = readFileSync(new URL('../src/board.js', import.meta.url), 'utf8');
  assert.match(src, /if \(e instanceof ReferenceError \|\| e instanceof TypeError\) throw e;/,
    'gitFirst must re-throw programming errors, not fail open on them');
  assert.match(src, /^import \{ execFileSync \} from 'node:child_process';$/m,
    'the import that was missing the first time');
});

// --- the status ladder (v0.192.0) --------------------------------------------
// docs/IDS.md declares the vocabulary as `<base-word> (free-form detail)` and calls the detail
// ENCOURAGED. The board compared the whole string, so every well-formed detailed status fell
// through into Captured — 12 of BOSS's own cards, 8 shipped and 4 in build, filed as raw ideas.

test('REGRESSION: a status with free-form detail lands in the right column', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'shipped (v0.104.0 — the one question in `/close`)' }),
    'docs/ideas/IDEA-002.md': idea('IDEA-002', { status: 'building (items 1-4 done, unreleased; 5-7 open)' }),
    'docs/ideas/FEAT-001.md': feat('FEAT-001', { status: 'shipped (keystone)' }),
  });
  const { cards } = collectBoard(dir);
  assert.equal(col(cards, 'IDEA-001'), 'Shipped', 'detail after the base word must not demote it');
  assert.equal(col(cards, 'IDEA-002'), 'Building');
  assert.equal(col(cards, 'FEAT-001'), 'Shipped');
});

test('deferred and dropped are parked — out of the flow, never deleted', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'deferred (trigger-gated)' }),
    'docs/ideas/IDEA-002.md': idea('IDEA-002', { status: 'dropped' }),
    'docs/ideas/IDEA-003.md': idea('IDEA-003', { status: 'exploring' }),
  });
  const { cards } = collectBoard(dir);
  assert.equal(cards.find((c) => c.id === 'IDEA-001').parked, true);
  assert.equal(cards.find((c) => c.id === 'IDEA-002').parked, true);
  assert.equal(cards.find((c) => c.id === 'IDEA-003').parked, false);
  // still present — the reasoning is the point
  assert.equal(cards.length, 3);
});

test('parked work is never offered as the next thing to pick up', () => {
  // The failure this prevents: `--next` telling the agent to /canvas an idea whose own record
  // says the deferral is settled and DO-NOT-REHASH.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'deferred (trigger-gated)' }),
  });
  const { cards } = collectBoard(dir);
  const { pressure, finish, start } = computeNext(cards);
  assert.deepEqual([...pressure, ...finish, ...start], []);
  assert.deepEqual(computeStuck(cards).reviewDue, []);
});

test('the JSON contract counts what the board renders, parked reported separately', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'deferred' }),
    'docs/ideas/IDEA-002.md': idea('IDEA-002', { status: 'exploring' }),
  });
  const j = boardJson(dir, 'p');
  assert.equal(j.counts.Captured, 1, 'a parked card must not inflate a column count');
  assert.equal(j.total, 1);
  assert.equal(j.parked.length, 1);
  assert.equal(j.cards.length, 1, 'parked cards are reported in `parked`, not smuggled into a column');
});

// --- the gist -----------------------------------------------------------------
// The card was an id and a title, and after sixty records a title is not a reminder.

test('an authored `gist:` wins over anything derivable', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { gist: 'The authored line.', body: 'Some other opening prose that is long enough to be chosen.' }),
  });
  assert.equal(collectBoard(dir).cards[0].gist, 'The authored line.');
});

test('with no `gist:`, the record\'s own opening prose fills the silence', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', { body: 'A board that shows what is in flight, so the arc is visible at a glance.' }),
  });
  assert.equal(collectBoard(dir).cards[0].gist, 'A board that shows what is in flight, so the arc is visible at a glance.');
});

test('the gist skips headings, banners and throat-clearing', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', {
      body: '## The gap\n\n> Capture, don\'t build (CLAUDE.md #3). BOSS has no way to end a project honestly, harvest what it taught, and mark it retired.',
    }),
  });
  const g = collectBoard(dir).cards[0].gist;
  assert.ok(!g.startsWith('The gap'), 'a section heading names a section, not the idea');
  assert.ok(!/Capture, don't build/.test(g), 'the boilerplate opener is not a reminder');
  assert.ok(g.startsWith('BOSS has no way to end a project'), g);
});

test('the gist does not split a sentence on an abbreviation', () => {
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', {
      body: 'Define the minimum host contract a different agent (e.g. Codex) would have to satisfy before it could host the conscience.',
    }),
  });
  assert.ok(/Codex/.test(collectBoard(dir).cards[0].gist), 'e.g. is not a sentence break');
});

test('a title is no longer truncated at collect time — the page wraps, the terminal clips', () => {
  const long = 'Temple culture layer — human-agent collaboration as decision infrastructure';
  const dir = project({ 'docs/ideas/IDEA-001.md': idea('IDEA-001', { title: long }) });
  assert.equal(collectBoard(dir).cards[0].title, long);
});

test('REGRESSION: a PARKED banner must not become the card\'s gist', () => {
  // Introduced and caught in the same release: parking a record puts a banner at the top of the
  // file, which became the first prose block — four cards stopped saying what they were and
  // started saying "PARKED 2026-08-20". The disposition is in `status:`; the gist is the subject.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', {
      body: '> **PARKED 2026-08-20** (Ajesh: "park it"). `deferred` is the deliberate status — a\n'
        + '> decision, not a backlog item — and the re-open trigger is at the foot of this file.\n>\n'
        + '> **The record already said this.** Its own open questions close with "not yet".\n\n'
        + '## Current shape\n\nA way to end a project honestly, harvest what it taught, and mark it retired.',
    }),
  });
  const g = collectBoard(dir).cards[0].gist;
  assert.ok(!/PARKED|deferred is the deliberate/i.test(g), `banner leaked into the gist: ${g}`);
  assert.ok(g.startsWith('A way to end a project honestly'), g);
});

test('a leading blockquote that is NOT a banner is still the best gist available', () => {
  // The other half of the same rule: several records open by quoting the founder, and that quote
  // is the sharpest sentence in the file. Only a disposition word triggers the skip.
  const dir = project({
    'docs/ideas/IDEA-001.md': idea('IDEA-001', {
      body: '> *"I may have jotted the idea anywhere — a doc, an Obsidian note. I wish I could\n'
        + '> just point at a file and have it brought in."*\n\n## Current shape\n\nLater prose.',
    }),
  });
  const g = collectBoard(dir).cards[0].gist;
  assert.ok(/jotted the idea anywhere/.test(g), g);
});

test('a card that has not shipped never shows a shipped date', () => {
  // `shippedOn` is derived from the `proof:` artifact's first commit, which exists for plenty of
  // in-flight records. Printing it on a Building card claims the thing shipped.
  const dir = project({ 'docs/ideas/IDEA-001.md': idea('IDEA-001', { status: 'building', shipped_on: '2026-01-01' }) });
  const { cards } = collectBoard(dir);
  const out = renderBoardCard('p', { cards, hasIdeasDir: true }, 'IDEA-001');
  assert.ok(!/shipped\s+2026-01-01/.test(out), out);
  assert.ok(/column\s+Building/.test(out));
});
