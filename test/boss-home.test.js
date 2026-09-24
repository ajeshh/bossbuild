// `BOSS_HOME` moves BOSS's machine-local state (IDEA-121). A throwaway run points it at a temp dir
// and the real ~/.boss is never written, so "prune your /tmp rows afterwards" stops depending on
// anyone remembering to do it.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

test('boss new registers under BOSS_HOME and leaves HOME/.boss alone', () => {
  const home = project({});
  const state = project({});
  execFileSync('node', [join(BOSS_ROOT, 'bin', 'boss'), 'new', 'app', '--yes'], {
    cwd: home, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home, BOSS_HOME: state },
  });
  assert.ok(existsSync(join(state, 'registry.json')), 'the registry is written under BOSS_HOME');
  assert.match(readFileSync(join(state, 'registry.json'), 'utf8'), /"app"/);
  assert.ok(!existsSync(join(home, '.boss', 'registry.json')), 'HOME/.boss is never touched');
});
