// gitdates — one pass over the log replaces one `git log -1` per record.
//
// The claim under test is not "it renders"; it is that the two maps answer exactly what the
// per-path calls answered (newest add, latest touch, directories as pathspecs, prose as
// nothing), and that a whole `boss status` costs a fixed number of git spawns however many
// records the project has. The second half is asserted with a PATH shim that counts.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, chmodSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { gitDates, firstAdded, lastTouched, forgetGitDates } from '../src/gitdates.js';
import { collectBoard } from '../src/board.js';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'boss-gitdates-'));
  git(dir, 'init', '-q');
  git(dir, 'config', 'user.email', 't@t.t');
  git(dir, 'config', 'user.name', 't');
  return dir;
}
function commit(dir, files, { date } = {}) {
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), body);
  }
  git(dir, 'add', '-A');
  const env = date ? { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : process.env;
  execFileSync('git', ['commit', '-qm', 'c'], { cwd: dir, env, stdio: 'ignore' });
}

test('firstAdded / lastTouched agree with the per-path git log -1 calls they replaced', () => {
  const dir = repo();
  commit(dir, { 'docs/ideas/IDEA-001.md': 'a', 'src/thing.js': '1' }, { date: '2026-01-05T12:00:00Z' });
  commit(dir, { 'docs/ideas/IDEA-001.md': 'b' }, { date: '2026-02-10T12:00:00Z' });
  commit(dir, { 'docs/design/tokens.css': 'x' }, { date: '2026-03-01T12:00:00Z' });
  commit(dir, { 'docs/design/guide.md': 'y' }, { date: '2026-03-15T12:00:00Z' });
  forgetGitDates(dir);

  const ref = (args) => git(dir, 'log', ...args) || null;
  // a file edited after it was added: added date ≠ touched date
  assert.equal(firstAdded(dir, 'docs/ideas/IDEA-001.md'), ref(['--diff-filter=A', '--format=%as', '-1', '--', 'docs/ideas/IDEA-001.md']));
  assert.equal(firstAdded(dir, 'docs/ideas/IDEA-001.md'), '2026-01-05');
  assert.equal(lastTouched(dir, 'docs/ideas/IDEA-001.md'), '2026-02-10');
  // a directory behaves like the pathspec did: the newest thing beneath it
  assert.equal(firstAdded(dir, 'docs/design'), ref(['--diff-filter=A', '--format=%as', '-1', '--', 'docs/design']));
  assert.equal(firstAdded(dir, 'docs/design/'), '2026-03-15');
  // prose in a proof: field matched nothing before and matches nothing now
  assert.equal(firstAdded(dir, 'REFUTED (the proposed cure), n=0 (founder demand)'), null);
  assert.equal(firstAdded(dir, 'none'), null);
  assert.equal(firstAdded(dir, ''), null);
  rmSync(dir, { recursive: true, force: true });
});

test('not a checkout → null, never a throw', () => {
  const dir = mkdtempSync(join(tmpdir(), 'boss-gitdates-norepo-'));
  forgetGitDates(dir);
  assert.equal(gitDates(dir), null);
  assert.equal(firstAdded(dir, 'anything.md'), null);
  assert.equal(lastTouched(dir, 'anything.md'), null);
  rmSync(dir, { recursive: true, force: true });
});

test('a whole board costs a fixed number of git spawns, however many records there are', () => {
  const dir = repo();
  const files = {};
  for (let i = 1; i <= 40; i++) {
    files[`docs/ideas/IDEA-${String(i).padStart(3, '0')}-x.md`] =
      `---\nid: IDEA-${String(i).padStart(3, '0')}\nstatus: ${i % 2 ? 'building' : 'shipped'}\nproof: ${i % 2 ? 'none' : `src/f${i}.js`}\n---\n\n# I${i}\n`;
    files[`src/f${i}.js`] = String(i);
  }
  commit(dir, files);

  // A git shim on PATH that counts invocations, then hands off to the real git.
  const shimDir = mkdtempSync(join(tmpdir(), 'boss-gitshim-'));
  const log = join(shimDir, 'calls.log');
  const real = execFileSync(process.platform === 'win32' ? 'where' : 'which', ['git'], { encoding: 'utf8' }).split(/\r?\n/)[0].trim();
  if (process.platform === 'win32') {
    writeFileSync(join(shimDir, 'git.cmd'), `@echo off\r\necho %* >> "${log}"\r\n"${real}" %*\r\n`);
  } else {
    writeFileSync(join(shimDir, 'git'), `#!/bin/sh\necho "$@" >> "${log}"\nexec "${real}" "$@"\n`);
    chmodSync(join(shimDir, 'git'), 0o755);
  }
  const out = execFileSync(process.execPath,
    ['-e', `import('${new URL('../src/board.js', import.meta.url).href}').then(m => { const { cards } = m.collectBoard(${JSON.stringify(dir)}); console.log(cards.length, cards.filter(c => c.shippedOn).length); })`],
    { encoding: 'utf8', env: { ...process.env, PATH: `${shimDir}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}` } }).trim();
  const [count, dated] = out.split(' ').map(Number);
  assert.equal(count, 40, 'every record is on the board');
  assert.equal(dated, 20, 'every shipped record got a derived date');
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').filter(Boolean) : [];
  assert.ok(calls.length <= 2, `40 records must not mean 40+ git spawns — saw ${calls.length}:\n${calls.slice(0, 5).join('\n')}`);
  rmSync(dir, { recursive: true, force: true });
  rmSync(shimDir, { recursive: true, force: true });
});
