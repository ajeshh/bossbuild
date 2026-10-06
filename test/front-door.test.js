// The front door's quick wins (IDEA-152, PROG-004). Each one was read off the old behaviour first:
//   · the `/` menu showed no hint of what to type — the usage sat at the end of a description the
//     menu truncates, and no skill carried `argument-hint`;
//   · `boss unlock` with no mode failed with the syntax while knowing the next rung;
//   · nothing printed where you are in one line, for a status bar or a prompt;
//   · bare `boss` inside a project printed the full manual instead of where you are.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup, idea } from './helpers.js';

after(cleanup);
const BIN = join(BOSS_ROOT, 'bin', 'boss');
function boss(args, cwd) {
  try {
    const out = execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd, USERPROFILE: cwd, BOSS_HOME: join(cwd, '.boss-home') },
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}
const bossProject = (files = {}) => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], skills: ['idea'], hooks: [], loops: [],
  }),
  '.boss/config.json': JSON.stringify({ cohort: null }),
  ...files,
});

// Where a hint says more than the usage tail can (two forms in one tail, or a parenthetical).
const HINT_DIFFERS = new Set(['idea', 'board']);

function shippedSkills() {
  const out = [];
  const roots = readdirSync(join(BOSS_ROOT, 'stages')).map((s) => join(BOSS_ROOT, 'stages', s, 'template', '.claude', 'skills'));
  roots.push(join(BOSS_ROOT, 'plugin', 'skills'));
  for (const dir of roots) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const f = join(dir, name, 'SKILL.md');
      if (existsSync(f)) out.push({ name, text: readFileSync(f, 'utf8') });
    }
  }
  return out;
}

test('Q1: every skill that takes an argument says what to type in `argument-hint`', () => {
  const skills = shippedSkills();
  assert.ok(skills.length > 40, `expected the shipped skills, found ${skills.length}`);
  for (const { name, text } of skills) {
    const fm = text.split('\n---')[0];
    const tail = ((fm.match(/^description:.*Usage - \/\S+\s*(.*)$/m) || [])[1] || '').trim();
    const hint = (fm.match(/^argument-hint:\s*(.*)$/m) || [])[1];
    if (!tail) { assert.equal(hint, undefined, `${name} takes no argument but carries a hint`); continue; }
    assert.ok(hint, `${name}: usage takes "${tail}" but there is no argument-hint`);
    if (!HINT_DIFFERS.has(name)) assert.equal(JSON.parse(hint), tail, `${name}: argument-hint drifted from its Usage tail`);
  }
});

test('Q2: `boss unlock` with no mode names the next one and installs nothing', () => {
  const dir = bossProject();
  const r = boss(['unlock'], dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /boss unlock mvp/);
  assert.doesNotMatch(r.out, /Unlocking/);
  const m = JSON.parse(readFileSync(join(dir, '.boss', 'manifest.json'), 'utf8'));
  assert.deepEqual(m.installedLayers, ['L0-quickstart']);
});

test('Q3: `boss status --line` is one plain line; outside a project it is silent', () => {
  const dir = bossProject({ 'docs/ideas/IDEA-001-x.md': idea('IDEA-001', { status: 'building' }) });
  const r = boss(['status', '--line'], dir);
  assert.equal(r.code, 0, r.out);
  assert.equal(r.out.trim().split('\n').length, 1, r.out);
  assert.match(r.out, /^BOSS · Quickstart · building IDEA-001$/m);
  const outside = boss(['status', '--line'], project({}));
  assert.equal(outside.code, 0);
  assert.equal(outside.out, '');
});

test('Q4: bare `boss` in a project says where you are; outside it is the manual', () => {
  const r = boss([], bossProject());
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /Quickstart/);
  assert.match(r.out, /boss help/);
  assert.doesNotMatch(r.out, /Keeping current/);
  const outside = boss([], project({}));
  assert.match(outside.out, /Keeping current/);
});
