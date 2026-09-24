// The opt-in secrets-guard hook, driven the way the host drives it: a PreToolUse event on stdin,
// a decision on stdout. It had no direct test, and IDEA-121 found five ways past it — shell
// punctuation around `.env`, input redirection, the Grep tool, and key files the settings.json
// deny floor already named. Each is a case here; so is what it must keep allowing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

const HOOK = join(BOSS_ROOT, 'stages', 'L0-quickstart', 'template', '.claude', 'hooks', 'secrets-guard.js');
const run = (tool_name, tool_input) => {
  const r = spawnSync('node', [HOOK], { input: JSON.stringify({ tool_name, tool_input }), encoding: 'utf8' });
  assert.equal(r.status, 0, 'the hook always exits 0');
  return r.stdout ? JSON.parse(r.stdout).hookSpecificOutput.permissionDecision : 'allow';
};

test('the bypasses the review found are caught', () => {
  for (const command of [
    'cat .env|head', 'cat <.env', 'x=$(cat .env)', 'cat .env; echo', 'cat .env&&true',
    'grep KEY .env*', 'cat `echo .env`', 'cat ~/.ssh/id_rsa', 'cat ~/.aws/credentials',
    'cat certs/server.pem', 'openssl rsa -in deploy.key', 'cat ./secrets/prod.json', 'cat .env.local',
  ]) assert.equal(run('Bash', { command }), 'ask', command);
});

test('Read, Edit and Grep of a secret are refused outright', () => {
  assert.equal(run('Read', { file_path: '/app/.env' }), 'deny');
  assert.equal(run('Read', { file_path: '/home/me/.ssh/id_ed25519' }), 'deny');
  assert.equal(run('Edit', { file_path: 'config/tls.key' }), 'deny');
  assert.equal(run('Grep', { pattern: 'API', path: '.env' }), 'deny');
  assert.equal(run('Grep', { pattern: 'API', glob: '.env*' }), 'deny');
  assert.equal(run('Grep', { pattern: 'x', path: 'secrets/' }), 'deny');
});

test('ordinary work is left alone', () => {
  for (const command of [
    'npm test', 'cat src/environment.js', 'ls -la', 'node -e "process.env.PORT"',
    // A public key is not a secret. (Under `.ssh/` it still asks: that directory is on the deny
    // floor whole, and the hook never guards less than the floor.)
    'cat keyboard.md', 'cat deploy/id_ed25519.pub', 'git log --oneline',
  ]) assert.equal(run('Bash', { command }), 'allow', command);
  assert.equal(run('Read', { file_path: 'src/env.ts' }), 'allow');
  assert.equal(run('Read', { file_path: 'docs/monkey.md' }), 'allow');
  assert.equal(run('Grep', { pattern: 'process.env', path: 'src' }), 'allow');
  assert.equal(run('Glob', { pattern: '**/.env' }), 'allow', 'Glob returns names, never contents');
});

test('fail-open: garbage in, allow out', () => {
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});
