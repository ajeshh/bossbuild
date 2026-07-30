// Scaffolding, sync and the stage ladder — the machinery that writes into a founder's
// repo. The non-destructive guarantees here are the ones that cost trust if they break.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveStageId, STAGE_ORDER } from '../src/paths.js';
import { loadModes, modeWord, skillGloss } from '../src/modes.js';
import { readStageManifest, appendMarkedBlock, applyStageSafe } from '../src/scaffold.js';
import { canonicalLayer, computeSettingsMerge, planSync } from '../src/sync.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

// --- the ladder -----------------------------------------------------------

test('resolveStageId accepts the full id, the level, and the mode word', () => {
  for (const input of ['L1-mvp', 'l1', 'mvp', 'MVP']) {
    assert.equal(resolveStageId(input), 'L1-mvp', `failed on ${input}`);
  }
  assert.equal(resolveStageId('v9'), undefined);
  assert.equal(resolveStageId(''), undefined);
  assert.equal(resolveStageId(undefined), undefined);
});

test('modeWord strips the level prefix — the vocabulary users actually type', () => {
  assert.deepEqual(STAGE_ORDER.map(modeWord), ['quickstart', 'mvp', 'v1', 'scale']);
});

test('canonicalLayer maps a stale pin forward by level', () => {
  assert.equal(canonicalLayer('L0-sketch'), 'L0-quickstart');
  assert.equal(canonicalLayer('L1-mvp'), 'L1-mvp');
  assert.equal(canonicalLayer('nonsense'), undefined);
});

test('every authored stage has the fields the CLI and docs read', () => {
  for (const m of loadModes().filter((x) => x.authored)) {
    assert.ok(m.name, `${m.id} has no name`);
    assert.ok(m.summary, `${m.id} has no summary`);
    assert.ok(Array.isArray(m.skills), `${m.id} skills not an array`);
    assert.ok(Array.isArray(m.headline), `${m.id} headline not an array`);
  }
});

test('REGRESSION §A2: every manifest entry resolves to a real template file', () => {
  // L3 declared `operate-loop` with no spec for four releases; `boss unlock scale` stamped
  // it into every project and both sync and the conscience skipped it silently.
  for (const stageId of STAGE_ORDER) {
    let m;
    try { m = readStageManifest(stageId); } catch { continue; }
    const base = join(process.cwd(), 'stages', stageId, 'template');
    for (const s of m.skills || []) {
      assert.ok(existsSync(join(base, '.claude', 'skills', s, 'SKILL.md')), `${stageId}: skill ${s} has no SKILL.md`);
    }
    for (const a of m.agents || []) {
      assert.ok(existsSync(join(base, '.claude', 'agents', `${a}.md`)), `${stageId}: agent ${a} has no file`);
    }
    for (const l of m.loops || []) {
      assert.ok(existsSync(join(base, 'docs', 'loops', `${l}.md`)), `${stageId}: loop ${l} has no spec`);
    }
  }
});

test('a headline never names a skill the rung does not have', () => {
  // A stale headline would silently shrink `boss map`'s preview to nothing.
  for (const m of loadModes().filter((x) => x.authored)) {
    for (const h of m.headline) {
      assert.ok(m.skills.includes(h), `${m.id}: headline '${h}' is not in skills`);
    }
  }
});

test('skillGloss splits the house description format', () => {
  assert.deepEqual(skillGloss('/does/not/exist'), { gloss: '', usage: '' });
});

// --- non-destructive adopt ------------------------------------------------

test('appendMarkedBlock is idempotent — re-applying is a no-op', () => {
  const dir = project({ 'CLAUDE.md': '# Mine\n\nmy rules\n' });
  const f = join(dir, 'CLAUDE.md');
  assert.equal(appendMarkedBlock(f, 'adopt', 'BOSS block'), true);
  assert.equal(appendMarkedBlock(f, 'adopt', 'BOSS block'), false, 'second apply must be a no-op');
  const body = readFileSync(f, 'utf8');
  assert.match(body, /# Mine/, "the founder's content survives");
  assert.equal((body.match(/boss:adopt start/g) || []).length, 1);
});

test('applyStageSafe never clobbers a file the founder already has', () => {
  const dir = project({ 'CLAUDE.md': 'MINE — DO NOT TOUCH\n' });
  const r = applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'p', DATE: '2026-01-01', BOSS_VERSION: '0.0.0', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), 'MINE — DO NOT TOUCH\n');
  assert.ok(r.skipped.some((p) => p.endsWith('CLAUDE.md')), 'CLAUDE.md should be reported as skipped');
  assert.ok(r.copied.length > 0, 'other files should still land');
});

test('placeholders are substituted in copied files only', () => {
  const dir = project({});
  applyStageSafe('L0-quickstart', dir, {
    PROJECT_NAME: 'zebra', DATE: '2026-01-01', BOSS_VERSION: '9.9.9', STAGE: 'L0-quickstart', MODE: 'Quickstart',
  });
  const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  assert.match(claude, /zebra/);
  assert.ok(!claude.includes('{{PROJECT_NAME}}'), 'no unsubstituted placeholders may ship');
});

// --- settings merge -------------------------------------------------------

test('settings merge is additive and idempotent — a founder keeps their own config', () => {
  const dir = project({
    '.claude/settings.json': JSON.stringify({
      permissions: { allow: ['Bash(my-tool:*)'] },
      hooks: { UserPromptSubmit: [{ matcher: '', hooks: [{ type: 'command', command: 'my-own-hook.sh' }] }] },
    }, null, 2),
  });
  const first = computeSettingsMerge(dir, ['L0-quickstart']);
  assert.equal(first.changed, true);
  assert.deepEqual(first.merged.permissions.allow, ['Bash(my-tool:*)'], 'permissions untouched');
  const cmds = first.merged.hooks.UserPromptSubmit.flatMap((e) => e.hooks.map((h) => h.command));
  assert.ok(cmds.includes('my-own-hook.sh'), "the founder's hook survives");
  assert.ok(cmds.some((c) => c.includes('conscience.js')), "BOSS's hook is registered");

  writeFileSync(join(dir, '.claude', 'settings.json'), JSON.stringify(first.merged, null, 2));
  assert.equal(computeSettingsMerge(dir, ['L0-quickstart']).changed, false, 're-merging must be a no-op');
});

test('the v0.18 bash→node hook migration drops the stale command', () => {
  const dir = project({
    '.claude/settings.json': JSON.stringify({
      hooks: { UserPromptSubmit: [{ matcher: '', hooks: [{ type: 'command', command: 'bash .claude/hooks/conscience.sh' }] }] },
    }),
  });
  const cmds = computeSettingsMerge(dir, ['L0-quickstart']).merged.hooks.UserPromptSubmit
    .flatMap((e) => e.hooks.map((h) => h.command));
  assert.ok(!cmds.some((c) => c.includes('conscience.sh')), 'the stale bash entry must be removed');
  assert.ok(cmds.some((c) => c.includes('conscience.js')), 'the node entry must be present');
});

test('a corrupt settings.json does not crash the merge', () => {
  const dir = project({ '.claude/settings.json': '{ this is not json' });
  assert.doesNotThrow(() => computeSettingsMerge(dir, ['L0-quickstart']));
});

// --- sync planning --------------------------------------------------------

test('planSync marks missing files new, edited files changed, identical files ok', () => {
  const dir = project({});
  mkdirSync(join(dir, '.boss'), { recursive: true });
  const stamp = { name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'] };

  const fresh = planSync(dir, stamp);
  assert.ok(fresh.entries.length > 0);
  assert.ok(fresh.entries.every((e) => e.status === 'new'), 'an empty project is all-new');
  assert.equal(fresh.drift, true, 'a stale pin is drift');

  // Write one file exactly as planned → it becomes ok; then edit it → changed.
  const target = fresh.entries.find((e) => e.kind === 'skill');
  mkdirSync(join(dir, target.rel, '..'), { recursive: true });
  writeFileSync(join(dir, target.rel), target.next);
  assert.equal(planSync(dir, stamp).entries.find((e) => e.rel === target.rel).status, 'ok');

  writeFileSync(join(dir, target.rel), target.next + '\nlocal edit\n');
  const edited = planSync(dir, stamp).entries.find((e) => e.rel === target.rel);
  assert.equal(edited.status, 'changed');
  assert.ok(edited.delta > 0, 'a changed file reports a line delta');
});

test('dormant hooks are synced but never auto-registered', () => {
  // §C7: they shipped once at scaffold and were then never updated again, because no
  // manifest list claimed them — a security fix to secrets-guard.js would never have
  // reached an existing project. `optionalHooks` syncs the FILE; the registration stays
  // the founder's on-switch, so syncing must NOT turn anything on.
  const dir = project({});
  const plan = planSync(dir, {
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', installedLayers: ['L0-quickstart'],
  });
  const optional = plan.entries.filter((e) => e.kind === 'optional-hook').map((e) => e.name);
  assert.ok(optional.includes('secrets-guard'), 'secrets-guard must be sync-managed');
  assert.ok(optional.includes('memory-cue'), 'memory-cue must be sync-managed');

  const registered = JSON.stringify(plan.settings.merged);
  for (const h of optional) {
    assert.ok(!registered.includes(`${h}.js`), `${h} must stay unregistered — dormant means dormant`);
  }
});

test('planSync canonicalises and dedupes installed layers', () => {
  const dir = project({});
  const plan = planSync(dir, {
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart',
    installedLayers: ['L0-sketch', 'L0-quickstart', 'L1-mvp'],
  });
  assert.deepEqual(plan.layers, ['L0-quickstart', 'L1-mvp']);
});
