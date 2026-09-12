// smoke-guard — the Stop-hook runner for the smoke gate `/smoke` only documents.
//
// As with every guard BOSS ships, the load-bearing behavior is the SILENCE: no `.boss/smoke.json`
// means no opinion; a tree with only docs changed means nothing to smoke; the same tree twice means
// the answer is already known. Then the one thing it does when it speaks: hand red back ONCE, and
// never block a second time on the same failure — a Stop hook that blocks twice is a loop.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);

const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'smoke-guard.js');

function run(dir, extra = {}) {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, hook_event_name: 'Stop', stop_hook_active: false, ...extra }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
  });
  return stdout.trim() ? JSON.parse(stdout) : null;
}

function git(dir, ...args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

// A git repo with one committed source file, so `git status` has a clean baseline to diff against.
function repo(files = {}, smokeCommand) {
  const dir = project({ 'src/app.js': 'export const ok = 1;\n', ...files });
  git(dir, 'init', '-q');
  git(dir, '-c', 'user.email=t@t', '-c', 'user.name=t', 'add', '-A');
  git(dir, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '-m', 'base');
  if (smokeCommand) {
    mkdirSync(join(dir, '.boss'), { recursive: true });
    writeFileSync(join(dir, '.boss', 'smoke.json'), JSON.stringify({ command: smokeCommand, configuredAt: '2026-01-01' }));
  }
  return dir;
}

test('stays SILENT when no smoke is configured (the JIT gate — /smoke is the opt-in)', () => {
  const dir = repo();
  writeFileSync(join(dir, 'src', 'app.js'), 'export const ok = 2;\n');
  assert.equal(run(dir), null, 'no .boss/smoke.json means nothing honest to run');
});

test('stays SILENT when only docs changed', () => {
  const dir = repo({}, 'exit 1');
  mkdirSync(join(dir, 'docs'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'devlog.md'), '# log\n');
  writeFileSync(join(dir, 'README.md'), '# hi\n');
  assert.equal(run(dir), null, 'a devlog entry is not a reason to boot the app');
});

test('reports green in one line when source changed and the smoke passes', () => {
  const dir = repo({}, 'exit 0');
  writeFileSync(join(dir, 'src', 'app.js'), 'export const ok = 2;\n');
  const out = run(dir);
  assert.ok(out && out.systemMessage, 'green is reported, not swallowed — "report clean results before a commit"');
  assert.match(out.systemMessage, /✓ smoke/);
  assert.equal(out.decision, undefined, 'green never blocks');
  const state = JSON.parse(readFileSync(join(dir, '.boss', 'smoke-guard.json'), 'utf8'));
  assert.equal(state.result, 'green');
});

test('hands red back as a reason to keep going — with the failing chunk', () => {
  const dir = repo({}, 'echo "TypeError: boom at app.js:3" >&2; exit 1');
  writeFileSync(join(dir, 'src', 'app.js'), 'export const ok = 2;\n');
  const out = run(dir);
  assert.equal(out.decision, 'block', 'red on this turn\'s changes is the one thing this hook exists to say');
  assert.match(out.reason, /✗ smoke/);
  assert.match(out.reason, /TypeError: boom/, 'the first failing chunk travels with the verdict');
  assert.match(out.reason, /say plainly why red is expected/i, 'red is information, not a wall');
});

test('never blocks twice on the same failure (stop_hook_active is the loop guard)', () => {
  const dir = repo({}, 'exit 1');
  writeFileSync(join(dir, 'src', 'app.js'), 'export const ok = 2;\n');
  const first = run(dir);
  assert.equal(first.decision, 'block');
  // Claude "fixed" something, the tree moved, and the host says we are already continuing because
  // of a Stop hook. Report, do not block.
  writeFileSync(join(dir, 'src', 'app.js'), 'export const ok = 3;\n');
  const second = run(dir, { stop_hook_active: true });
  assert.equal(second.decision, undefined, 'a second block on the same red is an infinite loop');
  assert.match(second.systemMessage, /still red/);
});

test('stays SILENT on the same tree it already ran on', () => {
  const dir = repo({}, 'exit 0');
  writeFileSync(join(dir, 'src', 'app.js'), 'export const ok = 2;\n');
  assert.ok(run(dir).systemMessage);
  assert.equal(run(dir), null, 'nothing changed since the last run — the answer is already on disk');
});

test('the file itself carries its on-switch — a Stop registration block a founder can paste', () => {
  const src = readFileSync(HOOK, 'utf8');
  assert.match(src, /"Stop": \[/, 'the TO TURN IT ON snippet names the event');
  assert.match(src, /smoke-guard\.js/);
  assert.ok(existsSync(HOOK));
});
