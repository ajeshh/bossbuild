// A settings.json BOSS can't parse is left exactly as it was — never read as {} and written back.
//
// The bug this holds (reproduced 2026-10-05): one trailing comma in a founder's
// .claude/settings.json, then `boss hooks enable secrets-guard`. readSettings() swallowed the parse
// error as {}, enableHook() wrote that back with one hook in it, and reported success. The file went
// from 1,971 bytes to 281: the founder's permissions.allow, the conscience's registration and the
// whole secret-path deny floor were gone. computeSettingsMerge (adopt, sync) had the same shape.
// config.readConfigForWrite already refuses for .boss/config.json; settings.json now does too.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { applyStage } from '../src/scaffold.js';
import { enableHook, disableHook } from '../src/hooks.js';
import { computeSettingsMerge } from '../src/sync.js';

after(cleanup);
const vars = { PROJECT_NAME: 'x', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart' };
const BROKEN = '{\n  "permissions": { "allow": ["Bash(npm test)",] }\n}\n';

function brokenProject() {
  const dir = project({});
  applyStage('L0-quickstart', dir, vars);
  mkdirSync(join(dir, '.claude'), { recursive: true });
  writeFileSync(join(dir, '.claude', 'settings.json'), BROKEN);
  return dir;
}
const settingsOf = (dir) => readFileSync(join(dir, '.claude', 'settings.json'), 'utf8');

test('enable refuses an unparseable settings.json and leaves it byte-for-byte', () => {
  const dir = brokenProject();
  assert.throws(() => enableHook(dir, 'secrets-guard', ['L0-quickstart']), /settings\.json can't be parsed/);
  assert.equal(settingsOf(dir), BROKEN);
});

test('disable refuses an unparseable settings.json and leaves it byte-for-byte', () => {
  const dir = brokenProject();
  assert.throws(() => disableHook(dir, 'secrets-guard', ['L0-quickstart']), /settings\.json can't be parsed/);
  assert.equal(settingsOf(dir), BROKEN);
});

test('the adopt/sync merge skips it and says why, rather than merging into an empty object', () => {
  const dir = brokenProject();
  const r = computeSettingsMerge(dir, ['L0-quickstart']);
  assert.equal(r.changed, false);
  assert.equal(r.merged, null);
  assert.match(r.unparseable, /settings\.json can't be parsed/);
  assert.equal(settingsOf(dir), BROKEN);
});
