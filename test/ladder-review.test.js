// The model moves, the ladders follow (IDEA-137 · C11) — scripts/check-freshness.js readLadders().
// docs/ECOSYSTEMS.md carries a § Revisions table; each ladder stamps `anatomy: N`, the revision it
// was last reviewed against. A ladder behind a revision that asks for a review is named, with what
// it missed. Cadence can't see this: the guide changes on an event, not on a clock.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { readLadders } from '../scripts/check-freshness.js';

const GUIDE = `# The ecosystem of ecosystems

Read [ECOSYSTEMS](ECOSYSTEMS.md) — the guide.

## Revisions

| Rev | Date | What changed | A ladder must |
|---|---|---|---|
| 1 | 2026-10-04 | Drafted | review — plant against it |
| 2 | 2026-10-04 | A typo in the lineage | nothing |
| 3 | 2026-10-05 | Step 2 gains the purpose line | review — write the purpose line |

## Something else
| 9 | not a revision row |
`;

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'boss-ladders-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), text);
  }
  return root;
}
const fm = (extra) => `---\nid: X\ntype: practice\n${extra}---\n\n# body\n`;

test('a ladder behind a review revision is named, with each revision it missed', () => {
  const root = fixture({
    'docs/ECOSYSTEMS.md': GUIDE,
    'library/practices/design-system.md': fm('anatomy: 1\n'),
  });
  try {
    const r = readLadders(root);
    assert.equal(r.current, 3);
    assert.equal(r.ladders.length, 1);
    assert.deepEqual(r.ladders[0].missed.map((m) => m.rev), [3]); // rev 2 asks nothing
    assert.match(r.ladders[0].missed[0].must, /purpose line/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('a ladder at the current revision is silent', () => {
  const root = fixture({
    'docs/ECOSYSTEMS.md': GUIDE,
    'docs/ideas/IDEA-138-claims.md': fm('anatomy: 3\n'),
  });
  try {
    const r = readLadders(root);
    assert.equal(r.ladders.length, 1);
    assert.deepEqual(r.ladders[0].missed, []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('anatomy: 0 — the source the model was read from, never reviewed — misses every review', () => {
  const root = fixture({
    'docs/ECOSYSTEMS.md': GUIDE,
    'library/practices/design-system.md': fm('anatomy: 0\n'),
  });
  try {
    assert.deepEqual(readLadders(root).ladders[0].missed.map((m) => m.rev), [1, 3]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('a practice with no anatomy: is not a ladder — silent', () => {
  const root = fixture({
    'docs/ECOSYSTEMS.md': GUIDE,
    'library/practices/mcp.md': fm('curve: protocol\n'),
  });
  try {
    assert.deepEqual(readLadders(root).ladders, []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('a malformed stamp is a problem, not a silent pass', () => {
  const root = fixture({
    'docs/ECOSYSTEMS.md': GUIDE,
    'library/practices/design-system.md': fm('anatomy: latest\n'),
  });
  try {
    assert.match(readLadders(root).ladders[0].problem, /anatomy/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('the other files that cite the guide are listed to read, never stamped', () => {
  const root = fixture({
    'docs/ECOSYSTEMS.md': GUIDE,
    'docs/ENGINEERING.md': 'Built against `docs/ECOSYSTEMS.md`.\n',
    'docs/ideas/IDEA-200-x.md': fm('anatomy: 3\n') + 'see ECOSYSTEMS.md\n',
  });
  try {
    const r = readLadders(root);
    assert.deepEqual(r.citers, ['docs/ENGINEERING.md']); // the ladder is not also a citer
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('no guide (a clone without docs/) → null, nothing reported', () => {
  const root = fixture({ 'library/practices/design-system.md': fm('anatomy: 1\n') });
  try {
    assert.equal(readLadders(root), null);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
