// `boss records --gists` — the work-list for the one line the board shows (v0.270.0).
//
// The CLI is zero-dependency and deterministic: it renders what is in the file and CANNOT write a
// sentence. So the split is deliberate — the CLI FINDS the records whose board line was never
// chosen, and `/idea gist` (a skill, where a model can actually read the record) WRITES it into
// `gist:`. A stored line is also better than one generated per render: reviewable, stable, and it
// commits with the record instead of quietly changing underneath the founder.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { gistWork } from '../src/records.js';
import { cardGist } from '../src/board.js';
import { project, cleanup, idea } from './helpers.js';

after(cleanup);

// Its own function, not a filter over recordDrift: none of this is WRONG, and drift means wrong.
const gists = (dir) => gistWork(dir);
const LONG = 'A single unbroken clause that just keeps going and going without ever reaching a full stop so that the renderer has no sentence boundary to cut on and must clip it instead, which is the whole condition being detected here';

test('a record with no gist is named — the board line is derived, not chosen', () => {
  const dir = project({ 'docs/ideas/IDEA-001-a.md': idea('IDEA-001', { body: 'Some opening prose.' }) });
  assert.equal(gists(dir).length, 1);
  assert.match(gists(dir)[0].what, /opening prose/);
});

test('a gist that renders whole is NOT a finding, however long the field is', () => {
  // Tested through the real renderer: cardGist takes the first SENTENCE before clipping, so a long
  // field whose opening sentence is short renders perfectly. Flagging on raw length would report a
  // problem the founder cannot see — which is how a checker starts crying wolf and gets ignored.
  // The opening sentence must clear MIN_SENTENCE (60) — below that `firstSentence` does not treat
  // the full stop as a break, so a very short lead-in does NOT save a long field. That is the
  // renderer's real rule, and this test asserts the renderer rather than an assumption about it.
  const short = 'A properly sized opening sentence that carries the whole idea on its own. ' + LONG;
  const dir = project({ 'docs/ideas/IDEA-002-b.md': idea('IDEA-002', { gist: short }) });
  assert.equal(gists(dir).length, 0);
  assert.ok(!cardGist('', { gist: short }).endsWith('…'));
});

test('a gist that still reads as a paragraph IS a finding — it is cut mid-thought', () => {
  const dir = project({ 'docs/ideas/IDEA-003-c.md': idea('IDEA-003', { gist: LONG }) });
  assert.equal(gists(dir).length, 1);
  assert.match(gists(dir)[0].what, /mid-thought/);
});

test('scoped to what the board renders — a DEC has no board line to be missing', () => {
  const dir = project({
    'docs/decisions/DEC-001-x.md': '---\nid: DEC-001\ntype: decision\nowner: pm\nstatus: shipped\n---\n\n# A decision\n',
    'docs/evidence/EVID-001-y.md': '---\nid: EVID-001\ntype: evidence\nowner: pm\nstatus: active\ngrade: stated-pain\n---\n\n# A signal\n',
  });
  assert.equal(gists(dir).length, 0, 'flagging a record the board never shows is a defect on a surface that does not exist');
});

test('the finding is QUIET — it is work, not drift, and never interrupts boss status', () => {
  const dir = project({ 'docs/ideas/IDEA-004-d.md': idea('IDEA-004') });
  assert.equal(gists(dir)[0].quiet, true);
});

test('writing a gist resolves the finding', () => {
  const before = project({ 'docs/ideas/IDEA-005-e.md': idea('IDEA-005', { body: 'Opening prose.' }) });
  assert.equal(gists(before).length, 1);
  const after = project({ 'docs/ideas/IDEA-005-e.md': idea('IDEA-005', { gist: 'The one line that brings the idea back six weeks later.', body: 'Opening prose.' }) });
  assert.equal(gists(after).length, 0);
});
