// `boss team share` (PROG-005 T4, option A): the folders that never go to git — interview notes, the
// inbox, rival notes — shared with a team through a folder it already syncs.
//
// What must hold: git never sees the links (a trailing-slash ignore rule matches only a real folder,
// so a link would be committed with a local path in it); nothing is deleted on the way in or out; a
// file already in the shared folder is never overwritten; the path lives per person, never in the
// repo; and a link whose drive isn't there is said, not silently empty.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync, readdirSync, rmSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

const made = [];
after(() => { cleanup(); for (const d of made) rmSync(d, { recursive: true, force: true }); });

const BIN = join(BOSS_ROOT, 'bin', 'boss');
const scratch = (p) => { const d = mkdtempSync(join(tmpdir(), p)); made.push(d); return d; };
function boss(args, cwd, home) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home, BOSS_HOME: join(home, '.boss-home') },
    });
  } catch (e) { return (e.stdout || '') + (e.stderr || ''); }
}
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const isLink = (p) => lstatSync(p).isSymbolicLink();

function founder(name = 'app') {
  const home = project({});
  boss(['new', name, '--yes'], home, home);
  const dir = join(home, name);
  if (!existsSync(join(dir, '.git'))) git(dir, 'init', '-q');
  return { home, dir };
}

test('sharing links the three folders, copies what was there, and git sees none of it', () => {
  const { home, dir } = founder();
  mkdirSync(join(dir, 'docs', 'evidence'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'evidence', 'EVID-001-a-call.md'), 'what she said\n');
  const drive = scratch('drive-');
  const out = boss(['team', 'share', drive], dir, home);
  assert.match(out, /Shared through/);
  for (const n of ['evidence', 'source', 'competition']) assert.ok(isLink(join(dir, 'docs', n)), `docs/${n} is a link`);
  assert.equal(readFileSync(join(drive, 'evidence', 'EVID-001-a-call.md'), 'utf8'), 'what she said\n');
  const backups = readdirSync(join(dir, '.boss', 'backups'));
  assert.ok(backups.some((b) => b.startsWith('share-')), 'the local folder is kept, not deleted');
  const status = git(dir, 'status', '--porcelain', '--untracked-files=all', '--', 'docs');
  assert.doesNotMatch(status, /docs\/(evidence|source|competition)/, 'no link reaches git');
  assert.ok(!readdirSync(dir).includes('share.json') && !existsSync(join(dir, '.boss', 'share.json')), 'the path is per person, not in the repo');
});

test('a file already in the shared folder is never overwritten; both copies are kept', () => {
  const { home, dir } = founder();
  const drive = scratch('drive-');
  mkdirSync(join(drive, 'evidence'), { recursive: true });
  writeFileSync(join(drive, 'evidence', 'EVID-001.md'), 'the team copy\n');
  mkdirSync(join(dir, 'docs', 'evidence'), { recursive: true });
  writeFileSync(join(dir, 'docs', 'evidence', 'EVID-001.md'), 'my local copy\n');
  const out = boss(['team', 'share', drive], dir, home);
  assert.match(out, /kept apart/);
  assert.equal(readFileSync(join(drive, 'evidence', 'EVID-001.md'), 'utf8'), 'the team copy\n');
  const b = readdirSync(join(dir, '.boss', 'backups')).find((x) => x.startsWith('share-'));
  assert.equal(readFileSync(join(dir, '.boss', 'backups', b, 'evidence', 'EVID-001.md'), 'utf8'), 'my local copy\n');
});

test('a teammate links to the same folder and reads the same notes', () => {
  const drive = scratch('drive-');
  const a = founder('a');
  mkdirSync(join(a.dir, 'docs', 'evidence'), { recursive: true });
  writeFileSync(join(a.dir, 'docs', 'evidence', 'EVID-002.md'), 'shared\n');
  boss(['team', 'share', drive], a.dir, a.home);
  const b = founder('b');
  boss(['team', 'share', drive], b.dir, b.home);
  assert.equal(readFileSync(join(b.dir, 'docs', 'evidence', 'EVID-002.md'), 'utf8'), 'shared\n');
});

test('refuses a folder inside the repo, or one that does not exist', () => {
  const { home, dir } = founder();
  mkdirSync(join(dir, 'shared'), { recursive: true });
  assert.match(boss(['team', 'share', join(dir, 'shared')], dir, home), /inside this repo/);
  assert.match(boss(['team', 'share', join(dir, 'nope')], dir, home), /is not a folder/);
});

test('--off makes each folder local again from what the shared folder holds; the shared folder is untouched', () => {
  const { home, dir } = founder();
  const drive = scratch('drive-');
  boss(['team', 'share', drive], dir, home);
  writeFileSync(join(drive, 'source', 'deck.pdf'), 'pdf');
  boss(['team', 'share', '--off'], dir, home);
  assert.ok(!isLink(join(dir, 'docs', 'source')));
  assert.equal(readFileSync(join(dir, 'docs', 'source', 'deck.pdf'), 'utf8'), 'pdf');
  assert.equal(readFileSync(join(drive, 'source', 'deck.pdf'), 'utf8'), 'pdf', 'the team still has it');
});

test('a link whose drive is not there is said, not silently empty', () => {
  const { home, dir } = founder();
  const drive = scratch('drive-');
  boss(['team', 'share', drive], dir, home);
  rmSync(drive, { recursive: true, force: true });
  assert.match(boss(['team', 'share'], dir, home), /the shared folder is not there.*drive connected/);
});
