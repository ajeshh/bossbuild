// test-env-isolation — the suite never inherits the shell's BOSS_HOME (IDEA-136 · F8).
// test/env-guard.js clears it; this holds the two npm scripts to preloading it, because a run
// without the preload wrote a registry and a `boss remove` backup into a developer's BOSS_HOME.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

test('REGRESSION: npm test and test:ci preload the env guard', () => {
  const { scripts } = JSON.parse(readFileSync(join(BOSS_ROOT, 'package.json'), 'utf8'));
  for (const name of ['test', 'test:ci']) {
    assert.match(scripts[name], /node --test --import \.\/test\/env-guard\.js /, `${name} preloads test/env-guard.js`);
  }
});

test('under the guard, BOSS_HOME is not set in a test process', () => {
  assert.equal(process.env.BOSS_HOME, undefined);
});
