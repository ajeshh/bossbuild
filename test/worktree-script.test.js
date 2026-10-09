// IDEA-120 — one worktree per piece of work, which chat windows join. Each case below is a finding
// from the 2026-10-05 trial, reproduced in a throwaway repo shaped like this one: a directory ignored
// whole that still holds tracked files, an ignored `.claude/`, a peer's dirty file in the main
// checkout. Symlinks need privileges on Windows; this is BOSS's own tooling, run on macOS/Linux.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BOSS_ROOT, STAGES_DIR } from '../src/paths.js';
import { openWork } from '../stages/L0-quickstart/template/.claude/hooks/lib/open-work.js';

const skip = process.platform === 'win32' && 'symlinks need privileges on Windows';
const dirs = [];
after(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });

const SCRIPT = join(BOSS_ROOT, 'scripts', 'worktree.js');
const run = (cwd, ...a) => spawnSync('node', [SCRIPT, ...a], { cwd, encoding: 'utf8' });

function mainRepo() {
  const d = realpathSync(mkdtempSync(join(tmpdir(), 'boss-wt-')));
  dirs.push(d);
  const g = (...a) => execFileSync('git', a, { cwd: d, stdio: 'pipe', encoding: 'utf8' }).trim();
  g('init', '-q', '-b', 'main'); g('config', 'user.email', 't@t'); g('config', 'user.name', 't');
  const w = (p, s) => { mkdirSync(join(d, p, '..'), { recursive: true }); writeFileSync(join(d, p), s); };
  w('.gitignore', 'secret/\nnotes.md\ndocs/*\n!docs/verdicts/\n.claude/\n');
  w('README.md', 'one\n');
  w('docs/verdicts/a.md', 'tracked\n');
  g('add', '-A'); g('commit', '-qm', 'init');
  w('secret/key.txt', 'only copy\n');
  w('notes.md', 'mine\n');
  w('docs/private.md', 'ignored, in a dir that holds tracked files\n');
  w('.claude/settings.json', '{}\n');
  return { d, g };
}

test('create: branches from local HEAD, links the ignored records, never shadows a tracked file', { skip }, () => {
  const { d, g } = mainRepo();
  const r = run(d, 'IDEA-7');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Created idea-7 on work\/idea-7 at local HEAD/);
  const wt = join(d, '.claude', 'worktrees', 'idea-7');
  assert.equal(readlinkSync(join(wt, 'secret')), join(d, 'secret'), 'a link to the one copy');
  assert.ok(lstatSync(join(wt, 'docs', 'private.md')).isSymbolicLink(), 'an ignored child of a mixed dir is linked');
  assert.ok(!lstatSync(join(wt, 'docs', 'verdicts', 'a.md')).isSymbolicLink(), "the worktree's tracked copy stays its own");
  assert.ok(!lstatSync(join(wt, '.claude')).isSymbolicLink(), '.claude is never linked whole — it holds worktrees/');
  assert.ok(lstatSync(join(wt, '.claude', 'settings.json')).isSymbolicLink());
  assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: wt, encoding: 'utf8' }), '', 'no link shows as untracked');
  assert.equal(g('rev-parse', 'HEAD'), execFileSync('git', ['rev-parse', 'HEAD'], { cwd: wt, encoding: 'utf8' }).trim());

  const again = run(d, 'IDEA-7');
  assert.equal(again.status, 0);
  assert.match(again.stdout, /Joining idea-7/, 'a second window joins the same work');
  assert.match(run(d).stdout, /idea-7 \(no commits yet\)/);
});

test('land fast-forwards main; a dirty file in the main checkout stops it with nothing moved', { skip }, () => {
  const { d, g } = mainRepo();
  run(d, 'IDEA-7'); run(d, 'IDEA-8');
  const wt7 = join(d, '.claude', 'worktrees', 'idea-7');
  const wt8 = join(d, '.claude', 'worktrees', 'idea-8');
  writeFileSync(join(wt7, 'NEW.md'), 'seven\n');
  execFileSync('git', ['add', 'NEW.md'], { cwd: wt7 }); execFileSync('git', ['commit', '-qm', 'seven'], { cwd: wt7 });
  writeFileSync(join(wt8, 'README.md'), 'eight\n');
  execFileSync('git', ['commit', '-qam', 'eight'], { cwd: wt8 });

  const open = openWork(d);
  assert.deepEqual(open.items.map((i) => [i.name, i.ahead]), [['idea-7', 1], ['idea-8', 1]]);

  const ok = run(d, 'land', 'IDEA-7');
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.equal(readFileSync(join(d, 'NEW.md'), 'utf8'), 'seven\n', 'main has the work');

  writeFileSync(join(d, 'README.md'), 'a session working in main\n');
  const blocked = run(d, 'land', 'IDEA-8');
  assert.equal(blocked.status, 1);
  assert.match(blocked.stdout, /uncommitted changes to README\.md.*Nothing moved/s);
  assert.equal(readFileSync(join(d, 'README.md'), 'utf8'), 'a session working in main\n', "the peer's edit is untouched");
  assert.equal(g('log', '-1', '--format=%s'), 'seven', 'main did not move');
});

// IDEA-158: a records-only land got the code review's question, which had nothing to find.
test('the diff picks the review: text for records and docs only, code for anything else', { skip }, () => {
  const { d } = mainRepo();
  run(d, 'IDEA-7');
  const wt = join(d, '.claude', 'worktrees', 'idea-7');
  const commit = (p, s) => { writeFileSync(join(wt, p), s); execFileSync('git', ['add', p], { cwd: wt }); execFileSync('git', ['commit', '-qm', p], { cwd: wt }); };
  commit('IDEA-7.md', 'a record\n');
  const text = run(d, 'review', 'IDEA-7');
  assert.equal(text.status, 0, text.stdout + text.stderr);
  assert.match(text.stdout, /calls for a text review: 1 file, records and docs only/);
  assert.match(text.stdout, /say what the record says/);
  commit('tool.js', 'export {}\n');
  const code = run(d, 'review', 'IDEA-7');
  assert.match(code.stdout, /calls for a code review: 1 of 2 files not records or docs/);
  assert.match(code.stdout, /code {2}tool\.js/);
  const landed = run(d, 'land', 'IDEA-7');
  assert.equal(landed.status, 0, landed.stdout + landed.stderr);
  assert.match(landed.stdout, /The diff called for a code review/);
});

test('skipping the review needs a why, and the why is kept as a note on the tip', { skip }, () => {
  const { d, g } = mainRepo();
  run(d, 'IDEA-7');
  const wt = join(d, '.claude', 'worktrees', 'idea-7');
  writeFileSync(join(wt, 'IDEA-7.md'), 'a record\n');
  execFileSync('git', ['add', 'IDEA-7.md'], { cwd: wt }); execFileSync('git', ['commit', '-qm', 'seven'], { cwd: wt });
  const bare = run(d, 'land', 'IDEA-7', '--skip-review');
  assert.equal(bare.status, 1);
  assert.match(bare.stdout, /needs a why/);
  assert.equal(g('log', '-1', '--format=%s'), 'init', 'nothing landed without a why');
  const ok = run(d, 'land', 'IDEA-7', '--skip-review', 'one record, nothing to find');
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.match(ok.stdout, /Skipped the text review.*Why: one record, nothing to find/);
  assert.equal(g('notes', '--ref=review', 'show', 'HEAD'), 'text review skipped: one record, nothing to find');
});

test('done removes the links, never their targets, then the worktree and its merged branch', { skip }, () => {
  const { d, g } = mainRepo();
  run(d, 'IDEA-7');
  const r = run(d, 'done', 'IDEA-7');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(!existsSync(join(d, '.claude', 'worktrees', 'idea-7')));
  assert.equal(readFileSync(join(d, 'secret', 'key.txt'), 'utf8'), 'only copy\n', 'the original survives');
  assert.equal(readFileSync(join(d, '.claude', 'settings.json'), 'utf8'), '{}\n');
  assert.equal(g('branch', '--list', 'work/idea-7'), '');
});

test('a session start names the open work once, and is silent with none', { skip }, () => {
  const { d } = mainRepo();
  const home = mkdtempSync(join(tmpdir(), 'boss-home-'));
  dirs.push(home);
  const start = (cwd) => spawnSync('node', [join(STAGES_DIR, 'L0-quickstart', 'template', '.claude', 'hooks', 'reentry.js')], {
    input: JSON.stringify({ source: 'startup' }), encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: cwd, BOSS_HOME: home },
  });
  assert.equal(start(d).stdout, '', 'no worktrees, nothing said');
  run(d, 'IDEA-7');
  const fromMain = JSON.parse(start(d).stdout).hookSpecificOutput.additionalContext;
  assert.match(fromMain, /Open work in this repo, one worktree each: idea-7 \(no commits yet\) at /);
  assert.match(fromMain, /in the main checkout/);
  const inside = JSON.parse(start(join(d, '.claude', 'worktrees', 'idea-7')).stdout).hookSpecificOutput.additionalContext;
  assert.match(inside, /in idea-7's worktree, so what changes here is idea-7's/);
});

test('a work id is a name, never a path', () => {
  const r = run(tmpdir(), '../../etc');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /not a work id/);
});
