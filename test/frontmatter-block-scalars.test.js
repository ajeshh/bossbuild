// Block scalars in frontmatter (v0.269.0).
//
// `frontmatter()` took whatever followed the colon on the SAME line, so `gist: >` parsed to the
// literal string ">". Ten of BOSS's own records write a folded gist and all ten rendered as ">" on
// `boss board` — the surface built to make ideas findable showed a punctuation mark instead of the
// idea, including IDEA-076, the highest-evidence record in the pool. The same gap surfaced in
// check-backlog as `says "shipped" but ">" is NOT on disk`. One parser, two symptoms.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frontmatter } from '../src/frontmatter.js';
import { cardGist } from '../src/board.js';

const doc = (fm) => `---\n${fm}\n---\n\n# A record\n\nSome opening prose that is long enough to be a real gist on its own.\n`;

test('a folded scalar folds — line breaks become spaces, a blank line stays a break', () => {
  const fm = frontmatter(doc('id: X\ngist: >\n  Line one\n  and line two.\n\n  A second paragraph.\nstatus: shipped'));
  assert.equal(fm.gist, 'Line one and line two.\nA second paragraph.');
  assert.equal(fm.status, 'shipped', 'the key AFTER the block must still parse');
  assert.equal(fm.id, 'X');
});

test('a literal scalar keeps its line breaks', () => {
  const fm = frontmatter(doc('lit: |\n  keep\n  these\nafter: yes'));
  assert.equal(fm.lit, 'keep\nthese');
  assert.equal(fm.after, 'yes');
});

test('chomping indicators are accepted, not treated as a value', () => {
  for (const ind of ['>-', '>+', '|-', '|+']) {
    const fm = frontmatter(doc(`gist: ${ind}\n  real content here\nstatus: shipped`));
    assert.equal(fm.gist, 'real content here', `${ind} must not parse as a value`);
  }
});

test('REGRESSION: a block scalar never parses as its own marker', () => {
  // The whole bug, in one line.
  const fm = frontmatter(doc('gist: >\n  The ladder shows four station NAMES.'));
  assert.notEqual(fm.gist, '>');
  assert.match(fm.gist, /station NAMES/);
});

test('inline values are untouched — quotes, colons and empty values all behave as before', () => {
  const fm = frontmatter(doc('owner: "@handle"\nnote: a value: with a colon\nblank:\nid: Y'));
  assert.equal(fm.owner, '"@handle"');
  assert.equal(fm.note, 'a value: with a colon');
  assert.equal(fm.blank, '');
  assert.equal(fm.id, 'Y');
});

test('a card gist gets ONE rule regardless of where it came from', () => {
  // The frontmatter path used to skip firstSentence entirely, which was invisible only because a
  // folded gist parsed to ">" and an inline one is short by convention.
  const long = 'The ladder shows four station NAMES and bolds the one you are at. '
    + 'A founder spends weeks inside a single rung and the surface never changes. '
    + 'That is the whole complaint, restated at length so this cannot fit on a card.';
  const g = cardGist(doc(`gist: >\n  ${long}`), { gist: long });
  assert.equal(g, 'The ladder shows four station NAMES and bolds the one you are at.');
  assert.ok(g.length <= 200, 'a board card is scannable or it is a document');
});
