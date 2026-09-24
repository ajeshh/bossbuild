// `boss conscience pause` and `mute`, end to end: the CLI writes the switch, and the HOOK honours
// it. Both halves were untested (IDEA-121 tier 4). The half that matters is the hook: a pause the
// hook ignores is a promise the founder was made and not kept, and a pause that never expires is
// a conscience switched off for good by a command that said "for 1h".

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');

function mvpFiring() {
  const home = project({});
  const env = { ...process.env, NO_COLOR: '1', HOME: home, USERPROFILE: home, BOSS_HOME: join(home, '.bh') };
  const boss = (args, cwd) => execFileSync('node', [BIN, ...args], { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  boss(['new', 'app', '--yes'], home);
  const dir = join(home, 'app');
  boss(['unlock', 'mvp', '--yes'], dir);
  // Three dated devlog entries and no extraction record: the capture moment's gate (moment-capture.yml m-cap-001).
  writeFileSync(join(dir, 'docs', 'devlog.md'), '# Devlog\n\n## 2026-09-01\n\nx\n\n## 2026-09-02\n\ny\n\n## 2026-09-03\n\nz\n');
  let n = 0;
  const hook = () => {
    // Nor the cross-session memory of what was voiced: this file tests pause and mute, and a loop
    // voiced on the same condition a call ago is otherwise quiet for a week, by design.
    rmSync(join(env.BOSS_HOME, 'projects'), { recursive: true, force: true });
    const r = spawnSync('node', [join(dir, '.claude', 'hooks', 'conscience.js')], {
      cwd: dir, env: { ...env, CLAUDE_PROJECT_DIR: dir }, encoding: 'utf8',
      // A new session each call: "said once this session" must not be what silences it.
      input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: 'build it', cwd: dir, session_id: `s${++n}` }),
    });
    return r.stdout ? JSON.parse(r.stdout).hookSpecificOutput.moment : null;
  };
  const config = join(dir, '.boss', 'config.json');
  return { dir, boss, hook, config };
}

test('pause silences the hook; an expired pause lets it speak and clears itself', () => {
  const { dir, boss, hook, config } = mvpFiring();
  assert.equal(hook(), 'capture', 'the fixture fires before anything is switched off');
  boss(['conscience', 'pause', '--for', '1h'], dir);
  assert.equal(hook(), null, 'paused means silent');

  const cfg = JSON.parse(readFileSync(config, 'utf8'));
  cfg.conscience.expires = new Date(Date.now() - 1000).toISOString();
  writeFileSync(config, JSON.stringify(cfg));
  assert.equal(hook(), 'capture', 'past its expiry, the pause no longer holds');
  assert.notEqual(JSON.parse(readFileSync(config, 'utf8')).conscience?.mode, 'paused', 'and the hook cleared it');
});

test('resume ends a pause with no expiry', () => {
  const { dir, boss, hook } = mvpFiring();
  boss(['conscience', 'pause', '--until-resume'], dir);
  assert.equal(hook(), null);
  boss(['conscience', 'resume'], dir);
  assert.equal(hook(), 'capture');
});

test('mute silences one moment; unmute brings it back', () => {
  const { dir, boss, hook } = mvpFiring();
  boss(['conscience', 'mute', 'capture', '--for', '1h'], dir);
  assert.equal(hook(), null, 'the muted moment is dropped');
  boss(['conscience', 'unmute', 'capture'], dir);
  assert.equal(hook(), 'capture');
});
