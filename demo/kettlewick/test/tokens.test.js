import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { render } from '../scripts/tokens.js';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

test('the stack token files match docs/design/tokens.json', () => {
  const { css, ts } = render(JSON.parse(read('../docs/design/tokens.json')));
  assert.equal(read('../src/styles/tokens.css'), css, 'run node scripts/tokens.js');
  assert.equal(read('../src/styles/tokens.ts'), ts, 'run node scripts/tokens.js');
});

test('a deprecated token is not in the stack files', () => {
  assert.ok(!read('../src/styles/tokens.css').includes('placeholder'));
});
