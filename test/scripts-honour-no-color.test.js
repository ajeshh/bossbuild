// scripts-honour-no-color — a script styles through src/ui.js, so NO_COLOR is honoured (IDEA-136 · F4).
//
// check-boundary and check-deployed each carried their own ANSI helpers, and printed escape codes
// with NO_COLOR=1 set — the one convention src/ui.js exists to keep.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';

test('REGRESSION: check-boundary prints no escape codes under NO_COLOR', () => {
  const env = { ...process.env, NO_COLOR: '1' };
  delete env.FORCE_COLOR; // any value but '0' — even '' — forces colour back on (src/ui.js)
  const r = spawnSync('node', [join(BOSS_ROOT, 'scripts', 'check-boundary.js')], { env, encoding: 'utf8' });
  assert.doesNotMatch(r.stdout + r.stderr, /\x1b\[/);
});

test('no script defines its own ANSI styling', () => {
  for (const f of readdirSync(join(BOSS_ROOT, 'scripts')).filter((n) => n.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(join(BOSS_ROOT, 'scripts', f), 'utf8'), /=> `\\x1b\[/, `${f} styles via src/ui.js`);
  }
});
