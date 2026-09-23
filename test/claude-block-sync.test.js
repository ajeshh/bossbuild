// `boss sync` and the CLAUDE.md block (IDEA-121).
//
// Each rung past Quickstart appends its rules to CLAUDE.md between `<!-- boss:<rung> start/end -->`
// markers. That block was written once, at unlock, and never again — so a trimmed or corrected
// rule reached new projects only, while every existing one kept loading the old text on every
// turn. The block is a region of a file the founder owns, so it follows the file rules at region
// scope: replaced when BOSS wrote it and nobody touched it, left alone when the founder changed
// it, backed up when BOSS has no record, and never put back once deleted.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { readLedger, recordManaged } from '../src/managed.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');
function boss(args, cwd, home) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home },
    });
  } catch (e) { return (e.stdout || '') + (e.stderr || ''); }
}

const KEY = 'CLAUDE.md#boss:L1-mvp';
const START = '<!-- boss:L1-mvp start -->\n';
const END = '\n<!-- boss:L1-mvp end -->';
const template = () => readFileSync(join(BOSS_ROOT, 'stages', 'L1-mvp', 'template', 'claude-append.md'), 'utf8')
  .replaceAll('{{MODE}}', 'MVP').trim();
const blockOf = (text) => { const i = text.indexOf(START); return i < 0 ? null : text.slice(i + START.length, text.indexOf(END, i)); };
const withBlock = (text, body) => { const i = text.indexOf(START) + START.length; return text.slice(0, i) + body + text.slice(text.indexOf(END, i)); };

function mvp() {
  const home = project({});
  boss(['new', 'app', '--yes'], home, home);
  const dir = join(home, 'app');
  boss(['unlock', 'mvp', '--yes'], dir, home);
  const claude = join(dir, 'CLAUDE.md');
  // The founder's own line, outside every marker — sync must never touch it.
  writeFileSync(claude, readFileSync(claude, 'utf8') + '\nMy own rule: ship on Fridays.\n');
  return { dir, home, claude };
}

test('unlock records the block it wrote, so the first sync knows it is BOSS\'s', () => {
  const { dir, claude } = mvp();
  assert.equal(blockOf(readFileSync(claude, 'utf8')).trim(), template());
  assert.ok(readLedger(dir)[KEY], 'the block is in the provenance ledger from its first write');
});

test('a block BOSS wrote and nobody touched is brought up to date, and nothing outside it moves', () => {
  const { dir, home, claude } = mvp();
  // As if unlocked under an older BOSS: the old text, recorded as BOSS's.
  writeFileSync(claude, withBlock(readFileSync(claude, 'utf8'), 'OLD RULES FROM AN EARLIER BOSS'));
  recordManaged(dir, [{ rel: KEY, text: 'OLD RULES FROM AN EARLIER BOSS' }]);
  assert.match(boss(['sync'], dir, home), /claude-block\/L1-mvp/);
  boss(['sync', '--apply'], dir, home);
  const after = readFileSync(claude, 'utf8');
  assert.equal(blockOf(after).trim(), template());
  assert.ok(after.includes('My own rule: ship on Fridays.'), 'the founder\'s line outside the markers is untouched');
  assert.ok(after.startsWith('# CLAUDE.md'), 'the Quickstart part above is untouched');
});

test('a block the founder changed is left alone and named', () => {
  const { dir, home, claude } = mvp();
  const edited = withBlock(readFileSync(claude, 'utf8'), template() + '\n- **My team rule.** Pair on migrations.');
  writeFileSync(claude, edited);
  // Make BOSS's copy differ too, so there is something it would like to write.
  recordManaged(dir, [{ rel: KEY, text: template() }]);
  const out = boss(['sync', '--apply'], dir, home);
  assert.equal(readFileSync(claude, 'utf8'), edited, 'byte-identical — the founder\'s edit stands');
  assert.match(out, /you changed/);
});

test('with no record, the block is backed up before it is replaced — and --keep-mine leaves it', () => {
  const { dir, home, claude } = mvp();
  const ledger = JSON.parse(readFileSync(join(dir, '.boss', 'managed.json'), 'utf8'));
  delete ledger[KEY];
  writeFileSync(join(dir, '.boss', 'managed.json'), JSON.stringify(ledger));
  const old = withBlock(readFileSync(claude, 'utf8'), 'PRE-LEDGER TEXT');
  writeFileSync(claude, old);

  boss(['sync', '--apply', '--keep-mine'], dir, home);
  assert.equal(readFileSync(claude, 'utf8'), old, '--keep-mine: nothing BOSS cannot vouch for is replaced');

  boss(['sync', '--apply'], dir, home);
  assert.equal(blockOf(readFileSync(claude, 'utf8')).trim(), template());
  const backups = join(dir, '.boss', 'backups');
  const saved = readdirSync(backups).map((d) => join(backups, d, 'CLAUDE.md')).filter(existsSync);
  assert.ok(saved.some((f) => readFileSync(f, 'utf8') === old), 'the whole file as it was is in .boss/backups/');
});

test('a block the founder deleted is not put back', () => {
  const { dir, home, claude } = mvp();
  const text = readFileSync(claude, 'utf8');
  const i = text.indexOf(START);
  const j = text.indexOf(END) + END.length;
  const without = text.slice(0, i) + text.slice(j);
  writeFileSync(claude, without);
  assert.ok(!/claude-block/.test(boss(['sync'], dir, home)));
  boss(['sync', '--apply'], dir, home);
  assert.equal(readFileSync(claude, 'utf8'), without);
});
