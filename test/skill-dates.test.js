// A shipped skill never carries the install date (IDEA-121).
//
// `{{DATE}}` is filled when BOSS WRITES a file — at scaffold, and at every `boss sync`. Inside a
// skill that is always the wrong day: the template is filled in later, by the model, when the
// skill runs. Measured before the fix: 24 of them in 16 files, so a sync three days after install
// listed 9 skill files as `~ changed` with no upstream change (the noise that hides a real one), and
// /cost-review told the model to write `REVIEW-<install date>.md`. A runtime date is written as
// `YYYY-MM-DD`, the convention the other twenty already used.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { BOSS_ROOT, STAGE_ORDER } from '../src/paths.js';

const walk = (dir, out = []) => {
  let names = [];
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

test('no shipped skill file carries {{DATE}} — the install date is never the day the skill runs', () => {
  const offenders = [];
  for (const stage of STAGE_ORDER) {
    for (const f of walk(join(BOSS_ROOT, 'stages', stage, 'template', '.claude', 'skills'))) {
      if (readFileSync(f, 'utf8').includes('{{DATE}}')) offenders.push(relative(BOSS_ROOT, f));
    }
  }
  assert.deepEqual(offenders, [], 'write a runtime date as YYYY-MM-DD');
});
