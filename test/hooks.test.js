// boss hooks — opt-in hooks land when asked, registered from their own header, and leave cleanly.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { applyStage, readStageManifest } from '../src/scaffold.js';
import { parseOnSwitch, optionalHooks, enableHook, disableHook, isRegistered } from '../src/hooks.js';
import { planSync } from '../src/sync.js';
import { forgetGitDates } from '../src/gitdates.js';

after(cleanup);
const vars = { PROJECT_NAME: 'x', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart' };

test('every opt-in hook a stage ships carries a parseable on-switch in its own header', () => {
  const all = optionalHooks();
  assert.ok(all.length >= 10, `saw ${all.length}`);
  for (const h of all) {
    const sw = parseOnSwitch(readFileSync(h.src, 'utf8'));
    assert.ok(sw, `${h.name}: no parseable "TO TURN IT ON" block`);
    const events = Object.keys(sw.hooks);
    assert.equal(events.length, 1, `${h.name}: one event`);
    const cmds = sw.hooks[events[0]].flatMap((e) => e.hooks.map((x) => x.command));
    assert.ok(cmds.some((c) => c.includes(`/.claude/hooks/${h.name}.js`)), `${h.name}: the block registers its own file`);
  }
});

test('scaffold lays down the two always-on hooks and none of the opt-in ones', () => {
  const dir = project({});
  applyStage('L0-quickstart', dir, vars);
  applyStage('L1-mvp', dir, { ...vars, STAGE: 'L1-mvp', MODE: 'MVP' });
  const onDisk = readdirSync(join(dir, '.claude', 'hooks')).filter((f) => f.endsWith('.js')).sort();
  assert.deepEqual(onDisk, ['conscience.js', 'reentry.js']);
  const held = [...readStageManifest('L0-quickstart').optionalHooks, ...readStageManifest('L1-mvp').optionalHooks];
  assert.ok(held.length >= 10);
});

test('enable lays the file down and registers it; twice is idempotent; disable reverses both', () => {
  const dir = project({});
  applyStage('L0-quickstart', dir, vars);
  applyStage('L1-mvp', dir, { ...vars, STAGE: 'L1-mvp', MODE: 'MVP' });
  const layers = ['L0-quickstart', 'L1-mvp'];
  assert.equal(isRegistered(dir, 'smoke-guard'), false);
  const r1 = enableHook(dir, 'smoke-guard', layers);
  assert.deepEqual(r1, { file: true, registered: true });
  assert.ok(existsSync(join(dir, '.claude', 'hooks', 'smoke-guard.js')));
  assert.equal(isRegistered(dir, 'smoke-guard'), true);
  const s = JSON.parse(readFileSync(join(dir, '.claude', 'settings.json'), 'utf8'));
  assert.ok(s.hooks.UserPromptSubmit, 'the always-on registrations survive the merge');
  assert.equal(s.hooks.Stop.length, 1);
  const r2 = enableHook(dir, 'smoke-guard', layers);
  assert.deepEqual(r2, { file: false, registered: false }, 'no duplicate registration, no rewrite');
  assert.equal(JSON.parse(readFileSync(join(dir, '.claude', 'settings.json'), 'utf8')).hooks.Stop.length, 1);

  // sync manages the enabled one and ignores the rest
  forgetGitDates(dir);
  const stamp = { name: 'x', bossVersion: '0.0.0', stage: 'L1-mvp', mode: 'MVP', installedLayers: layers, skills: [] };
  const opt = planSync(dir, stamp).entries.filter((e) => e.kind === 'optional-hook').map((e) => e.name);
  assert.deepEqual(opt, ['smoke-guard'], 'only the enabled hook is managed');

  const r3 = disableHook(dir, 'smoke-guard');
  assert.deepEqual(r3, { unregistered: true, removed: true, kept: false });
  assert.equal(existsSync(join(dir, '.claude', 'hooks', 'smoke-guard.js')), false);
  const after_ = JSON.parse(readFileSync(join(dir, '.claude', 'settings.json'), 'utf8'));
  assert.equal(after_.hooks.Stop, undefined);
  assert.ok(after_.hooks.UserPromptSubmit, 'and the always-on ones are untouched');
  assert.throws(() => enableHook(dir, 'nope', layers), /no opt-in hook named/);
});

// RVW-109 lesson 4 — the code that deletes decides what is safe to delete. `disable` removed the
// file unconditionally and then said `enable` "brings it back": true for BOSS's copy, false for a
// founder's uncommitted edit, which was gone. `boss remove` already keeps what the founder changed.
test('disable keeps a hook the founder edited — unregistered, never deleted', () => {
  const dir = project({});
  const layers = ['L0-quickstart', 'L1-mvp'];
  applyStage('L0-quickstart', dir, vars);
  enableHook(dir, 'secrets-guard', layers);
  const file = join(dir, '.claude', 'hooks', 'secrets-guard.js');
  writeFileSync(file, readFileSync(file, 'utf8') + '// my own tweak\n');
  const r = disableHook(dir, 'secrets-guard');
  assert.deepEqual(r, { unregistered: true, removed: false, kept: true });
  assert.match(readFileSync(file, 'utf8'), /my own tweak/, 'the edit survives');
  assert.equal(isRegistered(dir, 'secrets-guard'), false, 'and it is off');
  enableHook(dir, 'secrets-guard', layers);
  assert.match(readFileSync(file, 'utf8'), /my own tweak/, 'enable re-registers the kept file, never overwrites it');
});
