// IDEA-142 T1 — a key is stopped at the commit, not found later by /ship. Reproduced 2026-10-05: a
// fresh `boss new` project committed a Stripe-live-shaped string with no word, and `/ship`'s own text
// says the history is the one-way door.
//
// Fake keys are ASSEMBLED at runtime: a literal key shape in this file would trip every secret
// scanner pointed at BOSS's public repo, this one included.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { STAGES_DIR } from '../src/paths.js';
import { scan, isEnvFile, installCommitGuard, SHIM } from '../stages/L0-quickstart/template/.claude/hooks/lib/commit-secrets.js';

const dirs = [];
after(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });

const k = (...parts) => parts.join('');
const STRIPE = k('sk', '_live_', '51Habc', 'DEFghiJKLmnoPQRstu');
const AWS = k('AK', 'IA', 'ABCDEFGHIJ234567');
const PEM = k('-----BEGIN ', 'RSA PRIVATE', ' KEY-----');
const jwt = (payload) => k('eyJhbGciOiJIUzI1NiJ9.', Buffer.from(JSON.stringify(payload)).toString('base64url'), '.sigsigsigsigsig');

const diff = (file, ...lines) => `+++ b/${file}\n@@ -0,0 +1,${lines.length} @@\n${lines.map((l) => '+' + l).join('\n')}\n`;

test('the shapes it is sure of are caught, with file and line, and the key is never in the finding', () => {
  const found = scan(diff('src/pay.js', 'const ok = 1;', `const key = "${STRIPE}";`) + diff('infra.tf', `id = "${AWS}"`) + diff('deploy/key', PEM));
  assert.deepEqual(found.map((f) => `${f.file}:${f.line} ${f.what}`), [
    'src/pay.js:2 Stripe live key', 'infra.tf:1 AWS access key', 'deploy/key:1 private key',
  ]);
  assert.ok(!JSON.stringify(found).includes(STRIPE.slice(8)), 'the matched text never travels');
});

test('Supabase: the service-role key is caught, the anon key is public by design and passes', () => {
  assert.equal(scan(diff('a.js', `k = "${jwt({ role: 'service_role' })}"`)).length, 1);
  assert.equal(scan(diff('a.js', `k = "${jwt({ role: 'anon' })}"`)).length, 0);
});

test('what would cry wolf is left alone — test-mode keys, look-alike class names, removed lines', () => {
  const quiet = scan(
    diff('a.js', k('const t = "sk', '_test_', '51Habc', 'DEFghiJKLmnoPQRstu";'), 'className="sk-loading-skeleton-wrapper-large"', 'password = "hunter2"')
    + `+++ b/b.js\n@@ -1 +0,0 @@\n-const key = "${STRIPE}";\n`,
  );
  assert.deepEqual(quiet, []);
});

test('a force-added .env is named; the committed examples are not', () => {
  assert.ok(isEnvFile('.env') && isEnvFile('api/.env.production'));
  assert.ok(!isEnvFile('.env.example') && !isEnvFile('.env.sample') && !isEnvFile('env.js'));
});

function repo() {
  const d = mkdtempSync(join(tmpdir(), 'boss-commitguard-'));
  dirs.push(d);
  const g = (...a) => execFileSync('git', a, { cwd: d, stdio: 'pipe' });
  g('init', '-q'); g('config', 'user.email', 't@t'); g('config', 'user.name', 't');
  const lib = join(d, '.claude', 'hooks', 'lib');
  mkdirSync(lib, { recursive: true });
  cpSync(join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'hooks', 'lib', 'commit-secrets.js'), join(lib, 'commit-secrets.js'));
  cpSync(join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'hooks', 'package.json'), join(d, '.claude', 'hooks', 'package.json'));
  return { d, g };
}

test('end to end: the shim stops a commit carrying a key and lets a clean one through', { skip: process.platform === 'win32' && 'hook exec bit' }, () => {
  const { d, g } = repo();
  assert.equal(installCommitGuard(d).state, 'installed');
  assert.ok(statSync(join(d, '.git', 'hooks', 'pre-commit')).mode & 0o100, 'the shim is executable');
  writeFileSync(join(d, 'pay.js'), `const key = "${STRIPE}";\n`);
  g('add', 'pay.js');
  const blocked = spawnSync('git', ['commit', '-qm', 'pay'], { cwd: d, encoding: 'utf8' });
  assert.notEqual(blocked.status, 0, 'the commit is stopped');
  assert.match(blocked.stderr, /pay\.js:1\s+Stripe live key/);
  assert.ok(!blocked.stderr.includes(STRIPE), 'the key is not printed');
  writeFileSync(join(d, 'pay.js'), 'const key = process.env.STRIPE_KEY;\n');
  g('add', 'pay.js');
  assert.equal(spawnSync('git', ['commit', '-qm', 'pay'], { cwd: d }).status, 0, 'a clean commit goes through');
  assert.equal(installCommitGuard(d).state, 'current', 'idempotent');
});

test("a founder's own pre-commit, or core.hooksPath, is never overwritten", () => {
  const { d, g } = repo();
  const own = join(d, '.git', 'hooks', 'pre-commit');
  writeFileSync(own, '#!/bin/sh\nnpm test\n');
  assert.equal(installCommitGuard(d).state, 'theirs');
  assert.equal(readFileSync(own, 'utf8'), '#!/bin/sh\nnpm test\n');

  const other = repo();
  other.g('config', 'core.hooksPath', '.husky');
  assert.equal(installCommitGuard(other.d).state, 'hooks-path');
  g('status'); // the first repo is still a repo
});

test('an older shim of ours is refreshed in place', () => {
  const { d } = repo();
  const p = join(d, '.git', 'hooks', 'pre-commit');
  writeFileSync(p, '#!/bin/sh\n# boss: commit-secrets — old\nexit 0\n');
  assert.equal(installCommitGuard(d).state, 'installed');
  assert.equal(readFileSync(p, 'utf8'), SHIM);
});

// IDEA-142 — a cofounder's fresh clone has no hooks (git copies none) and may have no BOSS CLI.
// The reentry hook runs from the repo at session start, so it is what lays the shim down there.
test('a fresh clone gets the check at session start, says so once, and never on clear/compact', () => {
  const { d } = repo();
  cpSync(join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'hooks'), join(d, '.claude', 'hooks'), { recursive: true });
  const home = mkdtempSync(join(tmpdir(), 'boss-home-'));
  dirs.push(home);
  const start = (source) => spawnSync('node', [join(d, '.claude', 'hooks', 'reentry.js')], {
    input: JSON.stringify({ source }), encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: d, BOSS_HOME: home },
  });
  const shim = join(d, '.git', 'hooks', 'pre-commit');

  assert.equal(start('compact').stdout, '', 'mid-session events write nothing');
  assert.throws(() => statSync(shim), 'and lay nothing down');

  const first = start('startup');
  assert.match(JSON.parse(first.stdout).hookSpecificOutput.additionalContext, /commit check for this clone/);
  assert.equal(readFileSync(shim, 'utf8'), SHIM);
  assert.equal(start('startup').stdout, '', 'already there: silent');
});
