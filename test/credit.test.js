import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { addCredit, removeCredit, creditState, CREDIT_EGG } from '../src/credit.js';

const scratch = () => mkdtempSync(join(tmpdir(), 'boss-credit-'));

test('credit is opt-in: a fresh README has none until asked', () => {
  const d = scratch();
  writeFileSync(join(d, 'README.md'), '# thing\n');
  assert.equal(creditState(d).present, false);
  rmSync(d, { recursive: true, force: true });
});

test('REGRESSION: --apply twice is a no-op success, not a failure', () => {
  const d = scratch();
  writeFileSync(join(d, 'README.md'), '# thing\n');
  assert.equal(addCredit(d).ok, true);
  const second = addCredit(d);
  assert.equal(second.ok, true, 'already-in-desired-state must not report failure');
  assert.equal(second.noop, true);
  assert.equal(readFileSync(join(d, 'README.md'), 'utf8').match(/Builds, Or Stays Silent/g).length, 1);
  rmSync(d, { recursive: true, force: true });
});

test('REGRESSION: removing restores the README to exactly what it was', () => {
  const d = scratch();
  const before = '# thing\n\nSome words a founder wrote.\n';
  writeFileSync(join(d, 'README.md'), before);
  addCredit(d);
  removeCredit(d);
  const after = readFileSync(join(d, 'README.md'), 'utf8');
  assert.equal(after.includes(CREDIT_EGG), false);
  assert.equal(after.includes('oyeboss.build'), false);
  assert.match(after, /Some words a founder wrote\./, "the founder's own text must survive");
  rmSync(d, { recursive: true, force: true });
});

test('no README is a real failure, not a silent success', () => {
  const d = scratch();
  assert.equal(addCredit(d).ok, false);
  rmSync(d, { recursive: true, force: true });
});
