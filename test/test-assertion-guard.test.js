// test-assertion-guard — an edit that loosens a test, in a turn that also changed the code (IDEA-136 · A9).
//
// Agents do edit tests to make them pass (ImpossibleBench, 2025 — measured under impossible tasks; the
// everyday rate is unmeasured), and in one agent-built app the threshold the agent kept loosening was
// the one with no self-correction message. So this guard says nothing about a test edit on its own —
// writing and fixing tests is normal work. It speaks only when a test edit REMOVES assertions or ADDS a
// skip while non-test source also has uncommitted changes, and asks for the reason. Never blocks.
// As with every guard, the load-bearing behaviour is the silence.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { project, cleanup } from './helpers.js';

after(cleanup);
const HOOK = join(process.cwd(), 'stages', 'L1-mvp', 'template', '.claude', 'hooks', 'test-assertion-guard.js');

function run(dir, toolInput, toolName = 'Edit') {
  const stdout = execFileSync('node', [HOOK], {
    input: JSON.stringify({ cwd: dir, tool_name: toolName, tool_input: toolInput }), encoding: 'utf8',
  });
  return stdout.trim() ? JSON.parse(stdout).hookSpecificOutput.additionalContext : '';
}
const git = (dir, ...a) => execFileSync('git', a, { cwd: dir, stdio: 'ignore' });
function repo({ sourceChanged }) {
  const dir = project({ 'src/price.ts': 'export const price = () => 1\n', 'test/price.test.ts': "expect(price()).toBe(1)\nexpect(price()).toBeGreaterThan(0)\n" });
  git(dir, 'init', '-q'); git(dir, 'add', '.'); git(dir, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'init');
  if (sourceChanged) writeFileSync(join(dir, 'src', 'price.ts'), 'export const price = () => 2\n');
  return dir;
}
const LOOSEN = { file_path: 'test/price.test.ts', old_string: "expect(price()).toBe(1)\nexpect(price()).toBeGreaterThan(0)", new_string: "expect(price()).toBeGreaterThan(0)" };

test('SILENT when a test loses an assertion but no source changed (editing tests is normal work)', () => {
  assert.equal(run(repo({ sourceChanged: false }), LOOSEN), '');
});

test('SILENT when a test edit adds assertions, even with source changed', () => {
  assert.equal(run(repo({ sourceChanged: true }), { file_path: 'test/price.test.ts', old_string: 'expect(price()).toBe(1)', new_string: "expect(price()).toBe(2)\nexpect(price()).not.toBe(0)" }), '');
});

test('SILENT on a non-test file, and outside a git repo', () => {
  assert.equal(run(repo({ sourceChanged: true }), { file_path: 'src/price.ts', old_string: 'assert(x)', new_string: '' }), '');
  const bare = project({ 'test/a.test.ts': 'expect(1).toBe(1)\n' });
  assert.equal(run(bare, { file_path: 'test/a.test.ts', old_string: 'expect(1).toBe(1)', new_string: '' }), '');
});

test('REGRESSION: names an assertion removed from a test while source changed, and asks why', () => {
  const out = run(repo({ sourceChanged: true }), LOOSEN);
  assert.match(out, /price\.test\.ts/);
  assert.match(out, /1 assertion/);
  assert.match(out, /src\/price\.ts/, 'names the source that changed alongside it');
  assert.match(out, /behaviour change/i, 'carries the rule: only an intended behaviour change edits an existing test');
});

test('REGRESSION: names a skip added to a test while source changed', () => {
  const out = run(repo({ sourceChanged: true }), { file_path: 'test/price.test.ts', old_string: "test('price', () => {", new_string: "test.skip('price', () => {" });
  assert.match(out, /skip/i);
});

test('fails open on garbage input', () => {
  const out = execFileSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.equal(out, '');
});
