// earned — a rung holds some skills back until the project has earned them (src/earned.js).
//
// What is asserted: the manifest declares the groups; unlock does not lay them down; the two
// predicates are file-true; sync leaves a held group alone while its predicate is false and lays
// it down the moment it is true; and the stamp names only what is on disk at every step. The
// numbers matter — this is the mechanism under "MVP opens on 16 verbs, not 28".

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';
import { readStageManifest, applyStage } from '../src/scaffold.js';
import { heldBack, earnedGroups, llmInSource, hasShipped, stillDeferred, newlyEarned, markLaidDown } from '../src/earned.js';
import { planSync, applySync } from '../src/sync.js';
import { forgetGitDates } from '../src/gitdates.js';

after(cleanup);

const L1 = readStageManifest('L1-mvp');
const vars = { PROJECT_NAME: 'x', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L1-mvp', MODE: 'MVP' };

function mvpProject() {
  const dir = project({ 'docs/ideas/.keep': '' });
  applyStage('L0-quickstart', dir, vars);
  const held = heldBack(L1);
  applyStage('L1-mvp', dir, vars, { skipSkills: held });
  const stamp = {
    name: 'x', bossVersion: '0.0.0', stage: 'L1-mvp', mode: 'MVP',
    installedLayers: ['L0-quickstart', 'L1-mvp'],
    skills: L1.skills.filter((s) => !held.includes(s)),
    deferred: { 'L1-mvp': Object.fromEntries(earnedGroups(L1).map((g) => [g.group, g.skills])) },
  };
  return { dir, stamp, held };
}

test('the MVP manifest holds back the post-launch seven and the AI-mediated five', () => {
  const groups = earnedGroups(L1);
  assert.deepEqual(groups.map((g) => [g.group, g.until, g.skills.length]),
    [['postLaunch', 'shipped', 7], ['aiMediated', 'llm-in-source', 5]]);
  assert.equal(heldBack(L1).length, 12);
  for (const s of heldBack(L1)) assert.ok(L1.skills.includes(s), `${s} must be a skill of the rung`);
});

test('unlock lays down the rung without the held-back skills', () => {
  const { dir, held } = mvpProject();
  const onDisk = readdirSync(join(dir, '.claude', 'skills'));
  for (const s of held) assert.ok(!onDisk.includes(s), `${s} must not be on disk at unlock`);
  assert.ok(onDisk.includes('spec') && onDisk.includes('smoke'), 'the loop is on disk');
  const l0 = readStageManifest('L0-quickstart').skills.length;
  assert.equal(onDisk.length, l0 + (L1.skills.length - held.length), 'L0 + the MVP skills that are not held');
});

test('llm-in-source reads the same call shapes as the cost-budget loop, only under source roots', () => {
  const dir = project({ 'src/a.ts': 'const r = await client.chat.completions.create({});\n' });
  assert.equal(llmInSource(dir), true);
  const quiet = project({ 'src/a.ts': 'export const x = 1;\n', 'docs/notes.md': 'we use openai\n' });
  assert.equal(llmInSource(quiet), false, 'a mention in docs is not a call in source');
  const custom = project({ 'Sources/App/ai.swift': 'let a = Anthropic()\n', '.boss/config.json': '{"sourceGlobs":["Sources/**"]}' });
  assert.equal(llmInSource(custom), true, 'sourceGlobs in .boss/config.json names the roots');
});

test('sync leaves a held group alone while its predicate is false', () => {
  const { dir, stamp, held } = mvpProject();
  forgetGitDates(dir);
  const plan = planSync(dir, stamp);
  const added = plan.entries.filter((e) => e.status === 'new').map((e) => e.name.split('/')[0]);
  for (const s of held) assert.ok(!added.includes(s), `${s} must not be proposed before it is earned`);
  assert.equal(stillDeferred(dir, stamp).size, 12);
  assert.deepEqual(newlyEarned(dir, stamp), []);
});

test('a shipped FEAT earns the post-launch group; sync lays it down and the stamp follows', () => {
  const { dir, stamp } = mvpProject();
  writeFileSync(join(dir, 'docs', 'ideas', 'FEAT-001-x.md'), '---\nid: FEAT-001\nstatus: shipped\nproof: docs/x.md\n---\n\n# X\n');
  writeFileSync(join(dir, 'docs', 'x.md'), 'x');
  forgetGitDates(dir);
  assert.equal(hasShipped(dir), true);
  assert.deepEqual(newlyEarned(dir, stamp).map((g) => g.group), ['postLaunch']);
  assert.equal(stillDeferred(dir, stamp).size, 5, 'the AI group is still held');

  const plan = planSync(dir, stamp);
  const added = plan.entries.filter((e) => e.status === 'new' && e.kind === 'skill').map((e) => e.name);
  assert.deepEqual(added.sort(), [...L1.postLaunch].sort(), 'exactly the earned group is new');
  const { stamp: next } = applySync(dir, plan, stamp, {});
  for (const s of L1.postLaunch) assert.ok(existsSync(join(dir, '.claude', 'skills', s, 'SKILL.md')), `${s} laid down`);
  assert.deepEqual(next.deferred, { 'L1-mvp': { aiMediated: L1.aiMediated } }, 'only the AI group stays deferred');
  for (const s of L1.postLaunch) assert.ok(next.skills.includes(s));
  for (const s of L1.aiMediated) assert.ok(!next.skills.includes(s), `${s} is not on disk and must not be stamped`);
  assert.equal(next.skills.length, readdirSync(join(dir, '.claude', 'skills')).length, 'the stamp names what is on disk');

  // A second sync is quiet.
  const again = planSync(dir, next);
  assert.equal(again.entries.filter((e) => e.status === 'new').length, 0);
});

test('a project stamped before this existed (no `deferred`) is untouched', () => {
  const dir = project({});
  applyStage('L0-quickstart', dir, vars);
  applyStage('L1-mvp', dir, vars);
  const stamp = { name: 'x', bossVersion: '0.0.0', stage: 'L1-mvp', mode: 'MVP', installedLayers: ['L0-quickstart', 'L1-mvp'], skills: [...L1.skills] };
  forgetGitDates(dir);
  assert.equal(stillDeferred(dir, stamp).size, 0);
  const plan = planSync(dir, stamp);
  assert.equal(plan.entries.filter((e) => e.status === 'new').length, 0, 'everything is already on disk');
  const { stamp: next } = applySync(dir, plan, stamp, {});
  assert.equal(next.deferred, undefined);
  assert.equal(next.skills.length, L1.skills.length + readStageManifest('L0-quickstart').skills.length);
});

test('markLaidDown removes a group and collapses an empty deferred map', () => {
  const stamp = { skills: ['a'], deferred: { 'L1-mvp': { g: ['b', 'c'] } } };
  markLaidDown(stamp, [{ stage: 'L1-mvp', group: 'g', skills: ['b', 'c'] }]);
  assert.deepEqual(stamp, { skills: ['a', 'b', 'c'] });
});
