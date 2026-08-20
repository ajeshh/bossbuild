// The board projection — the surface most of BOSS reads state through.
//
// Every test below locks a rule the code already claims in a comment. The two marked
// REGRESSION are the audit's shipped bugs (REVIEW-2026-07-28 §A1): they failed before
// v0.129.0 and are the reason this file exists.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { collectBoard, canvassedIdeas, computeNext, computeStuck, boardJson } from '../src/board.js';
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
