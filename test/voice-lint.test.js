// voice-lint is the mechanical half of IDEA-123 — how BOSS talks. It is report-only, so a silent drift
// in what it counts would go unnoticed; these pin its edges. Length is deliberately NOT tested as a
// threshold: BOSS's rule is proportionality (conscience-voicing.md rules 2 + 4), never a word count.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findTics, skillPointers, internalLabels, lint } from '../docs/architecture/conscience-evals/judgment/voice-lint.js';

test('a sign-off repeated across different cases is a tic; mid-sentence English is not', () => {
  const nudges = [
    'You built auth and billing. None of it tests the bet. Your call.',
    'Four captures, four products. Pick one first. Your call.',
    'The same retry wrapper, twice. Worth one helper? Your call.',
    'Nothing here is the same as last week, and that is fine to leave.',
  ];
  const tics = findTics(nudges);
  assert.deepEqual(tics.map((t) => [t.phrase, t.count]), [['your call', 3]]);
});

test("apostrophes don't split words into fake tics", () => {
  const tics = findTics(["What's the test? Go.", "What's the risk? Go.", "What's next? Go."]);
  assert.ok(!tics.some((t) => /\bs\b/.test(t.phrase)), JSON.stringify(tics));
});

test('skill pointers are counted once each', () => {
  assert.deepEqual(skillPointers('Try `/canvas`, then `/interview`; `/canvas` again.'), ['/canvas', '/interview']);
});

test('internal labels are caught; ordinary words that share a name are not', () => {
  assert.equal(internalLabels('This drifts (manipulation axis) from the plan.').length, 1);
  assert.equal(internalLabels('Recorded in IDEA-123.').length, 1);
  assert.equal(internalLabels('That could manipulate how people feel about it.').length, 0);
});

test('only fired nudges with text are linted', () => {
  const r = lint([
    { id: 'a', decision: 'fires', nudge: 'One line. Your call.' },
    { id: 'b', decision: 'silent', nudge: '' },
  ]);
  assert.equal(r.fired, 1);
});
