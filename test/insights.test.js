// `boss insights` — the portfolio read (src/insights.js), untested until IDEA-121 tier 4. What is
// asserted is what a founder would be misled by if it broke: an empty machine says so, a retired
// venture is reported as an ending rather than dropped, and a project that moved is counted as
// gone, not silently folded into the total.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

function machine() {
  const home = project({});
  const env = { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home, BOSS_HOME: join(home, '.bh') };
  const boss = (args, cwd = home) => execFileSync('node', [BIN, ...args], { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return { home, boss };
}

test('an empty machine says there is nothing yet, and how to start', () => {
  const { boss } = machine();
  assert.match(boss(['insights']), /No projects registered yet/);
});

test('live, retired and moved projects are each reported as what they are', () => {
  const { home, boss } = machine();
  for (const n of ['live', 'ended', 'moved']) boss(['new', n, '--yes']);
  boss(['retire', '--yes'], join(home, 'ended'));
  rmSync(join(home, 'moved'), { recursive: true, force: true });

  const out = boss(['insights']);
  assert.match(out, /2 project\(s\) on this machine/, 'the moved one is not counted as here');
  assert.match(out, /\+1 registered but not on disk/, 'but it is not hidden either');
  assert.match(out, /1 retired/, 'a retirement is an outcome, reported');
  assert.match(out, /local · nothing sent/);
});
