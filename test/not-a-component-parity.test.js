// not-a-component-parity — `boss design` and the shipped reuse guard must agree on what is not a
// component (IDEA-136 · F2).
//
// They are two copies on purpose: the guard ships into a founder's repo as a single file and cannot
// import src/. That is exactly how they drifted — design excluded *Page/*Route/*Layout and the guard
// didn't, so the guard asked "reuse, adjust, or new?" about files the design page never lists; and the
// design page listed `App` as a component because its copy had no case-insensitive match. A copy a
// boundary forces is pinned by a test, or it drifts (docs/ENGINEERING.md, principle 2).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const line = (rel) => {
  const src = readFileSync(join(BOSS_ROOT, rel), 'utf8');
  const m = src.match(/^const notAComponent = .*$/m);
  assert.ok(m, `${rel} defines notAComponent on one line`);
  return m[0];
};

test('the design page and the reuse guard define notAComponent identically', () => {
  assert.equal(
    line('stages/L1-mvp/template/.claude/hooks/component-reuse-guard.js'),
    line('src/design.js'));
});
