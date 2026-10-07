// `boss sync` and .gitignore (PROG-005 T3).
//
// Sensitive research stays on the founder's machine — by sensitivity, not by being research:
// `docs/evidence/` holds other people's words, and a repo can go public in one click with its history. New projects get the rules from
// the template. Existing ones never would have — sync did not touch .gitignore, and adopt's merge
// stops at its own marker — so sync now adds rules a later BOSS ships, only ones it never offered
// before (every BOSS block says "delete a line to commit that file"), and says plainly when the
// files are already committed, because ignoring does not take them out of git.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');
function boss(args, cwd, home) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home, BOSS_HOME: join(home, '.boss-home') },
    });
  } catch (e) { return (e.stdout || '') + (e.stderr || ''); }
}
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

const RESEARCH = ['docs/evidence', 'docs/source', 'docs/competition'];
const rules = (dir) => readFileSync(join(dir, '.gitignore'), 'utf8').split('\n').map((l) => l.trim());
const offered = join('.boss', 'ignore-offered.json');

function fresh() {
  const home = project({});
  boss(['new', 'app', '--yes'], home, home);
  return { home, dir: join(home, 'app') };
}

// As if scaffolded by a BOSS from before the rules: none of the four lines, and no record.
function olderProject() {
  const { home, dir } = fresh();
  const p = join(dir, '.gitignore');
  writeFileSync(p, readFileSync(p, 'utf8').split('\n').filter((l) => !RESEARCH.includes(l.trim())).join('\n'));
  rmSync(join(dir, offered), { force: true });
  return { home, dir };
}

test('a new project ignores research and interviews from its first commit', () => {
  const { dir } = fresh();
  for (const r of RESEARCH) assert.ok(rules(dir).includes(r), `${r} is ignored`);
  const seen = JSON.parse(readFileSync(join(dir, offered), 'utf8'));
  for (const r of RESEARCH) assert.ok(seen.includes(r), `${r} is recorded as offered`);
});

test('sync brings the rules to a project scaffolded before them, and says which', () => {
  const { home, dir } = olderProject();
  const preview = boss(['sync'], dir, home);
  for (const r of RESEARCH) assert.match(preview, new RegExp(`\\+ ignore\\s+${r}`));
  assert.ok(!rules(dir).includes('docs/evidence'), 'a preview writes nothing');
  boss(['sync', '--apply'], dir, home);
  for (const r of RESEARCH) assert.ok(rules(dir).includes(r), `${r} added on --apply`);
  assert.ok(existsSync(join(dir, offered)));
});

test('a line the founder deletes stays deleted', () => {
  const { home, dir } = fresh();
  const p = join(dir, '.gitignore');
  writeFileSync(p, readFileSync(p, 'utf8').split('\n').filter((l) => l.trim() !== 'docs/competition').join('\n'));
  const out = boss(['sync', '--apply'], dir, home);
  assert.doesNotMatch(out, /\+ ignore\s+docs\/competition\b/);
  assert.ok(!rules(dir).includes('docs/competition'), 'BOSS offered it once; removing it was a decision');
});

test('already-committed interviews are named, and sync does not pretend to remove them', () => {
  const { home, dir } = olderProject();
  if (!existsSync(join(dir, '.git'))) git(dir, 'init', '-q');
  mkdirSync(join(dir, 'docs', 'evidence'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'evidence', 'EVID-001-a-call.md'), '# a call\n');
  git(dir, 'add', 'docs/evidence/EVID-001-a-call.md');
  git(dir, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'evidence');
  const out = boss(['sync'], dir, home);
  assert.match(out, /docs\/evidence.*already committed/);
  assert.match(out, /does not take these out of your repository or its history/);
  assert.match(out, /git rm -r --cached docs\/evidence/);
  boss(['sync', '--apply'], dir, home);
  assert.ok(git(dir, 'ls-files', 'docs/evidence/').includes('EVID-001'), 'still tracked — the founder decides, not sync');
});
