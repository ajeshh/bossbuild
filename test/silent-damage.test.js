// The four silent-damage bugs from the 2026-09-23 review (IDEA-121), each held by a test that fails
// on the old code. What they share: nothing crashed, nothing warned, and something was gone.
//
// 1. A torn or unparseable ~/.boss/registry.json read as "no projects"; the next save wrote that back.
//    Concurrent writers (the norm on this machine) also lost entries: 30 registrations kept 26.
// 2. `boss team add` on a config.json with a stray comma erased every other key.
// 3. `boss learn` bumped VERSION and put a numbered section above `## Unreleased` (DEC-019).
// 4. The shipped hooks died at import in a project whose package.json says "type": "commonjs".

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BOSS_ROOT } from '../src/paths.js';
import { appendUnreleased } from '../src/learn.js';

const dirs = [];
const scratch = () => { const d = mkdtempSync(join(tmpdir(), 'boss-damage-')); dirs.push(d); return d; };
after(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });

const REGISTRY = pathToFileURL(join(BOSS_ROOT, 'src', 'registry.js')).href;
const homeEnv = (home) => ({ ...process.env, HOME: home, USERPROFILE: home });

test('a registry that cannot be parsed is refused by a writer, never overwritten with an empty list', () => {
  const home = scratch();
  mkdirSync(join(home, '.boss'));
  const torn = '{"projects":[{"path":"/a","name":"a"},{"path":"/b","na';
  writeFileSync(join(home, '.boss', 'registry.json'), torn);
  const r = spawnSync(process.execPath, ['--input-type=module', '-e',
    `import { registerProject } from ${JSON.stringify(REGISTRY)}; registerProject({ path: '/c', name: 'c' });`],
  { env: homeEnv(home), encoding: 'utf8' });
  assert.notEqual(r.status, 0, 'the write must refuse');
  assert.match(r.stderr, /can't be parsed/);
  assert.equal(readFileSync(join(home, '.boss', 'registry.json'), 'utf8'), torn, 'the file is exactly as it was');
});

test('concurrent registrations all survive', async () => {
  const home = scratch();
  const N = 12;
  const PER = 3;
  const run = (i) => new Promise((resolve, reject) => {
    const code = `import { registerProject } from ${JSON.stringify(REGISTRY)};
      for (let k = 0; k < ${PER}; k++) registerProject({ path: '/p${i}-' + k, name: 'p${i}-' + k });`;
    const c = spawn(process.execPath, ['--input-type=module', '-e', code], { env: homeEnv(home), stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    c.stderr.on('data', (d) => { err += d; });
    c.on('exit', (s) => (s === 0 ? resolve() : reject(new Error(err))));
  });
  await Promise.all(Array.from({ length: N }, (_, i) => run(i)));
  const data = JSON.parse(readFileSync(join(home, '.boss', 'registry.json'), 'utf8'));
  assert.equal(data.projects.length, N * PER, 'every registration is on disk — none lost to a race');
});

test('`boss team add` refuses a config.json it cannot parse, and leaves it untouched', () => {
  const dir = scratch();
  mkdirSync(join(dir, '.boss'));
  const typo = '{\n  "github": "me/app",\n  "visibility": "private",\n  "license": "MIT",\n}\n';
  writeFileSync(join(dir, '.boss', 'manifest.json'), '{ "bossVersion": "0.326.0", "stages": ["L0-quickstart"] }\n');
  writeFileSync(join(dir, '.boss', 'config.json'), typo);
  const r = spawnSync(process.execPath, [join(BOSS_ROOT, 'bin', 'boss'), 'team', 'add', '@someone', 'Some One'],
    { cwd: dir, env: { ...homeEnv(dir), NO_COLOR: '1' }, encoding: 'utf8' });
  assert.match(r.stdout + r.stderr, /can't be parsed/);
  assert.equal(readFileSync(join(dir, '.boss', 'config.json'), 'utf8'), typo, 'github/visibility/license still there');
});

test('`boss learn` records under ## Unreleased and never picks a version', () => {
  const dir = scratch();
  const file = join(dir, 'CHANGELOG.md');
  writeFileSync(file, '# BOSS Changelog\n\nPreamble.\n\n## Unreleased\n\n- an earlier bullet\n\n## 0.326.0 — 2026-09-14\n\n- old\n');
  appendUnreleased(file, ['Learned `x` into `y`.']);
  const out = readFileSync(file, 'utf8');
  assert.ok(!/## 0\.327/.test(out), 'no new version heading');
  const unreleased = out.slice(out.indexOf('## Unreleased'), out.indexOf('## 0.326.0'));
  assert.ok(unreleased.includes('- an earlier bullet') && unreleased.includes('- Learned `x` into `y`.'), unreleased);
  assert.ok(out.indexOf('## Unreleased') < out.indexOf('## 0.326.0'), 'Unreleased stays on top');

  // No Unreleased section yet: one is opened above the first version, never below it.
  writeFileSync(file, '# BOSS Changelog\n\n## 0.326.0 — 2026-09-14\n\n- old\n');
  appendUnreleased(file, ['z']);
  const out2 = readFileSync(file, 'utf8');
  assert.ok(out2.indexOf('## Unreleased\n\n- z') >= 0 && out2.indexOf('## Unreleased') < out2.indexOf('## 0.326.0'), out2);
});

test('the shipped hooks load in a project whose package.json says "type": "commonjs"', () => {
  const dir = scratch();
  cpSync(join(BOSS_ROOT, 'stages', 'L0-quickstart', 'template', '.claude', 'hooks'), join(dir, '.claude', 'hooks'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), '{ "name": "app", "type": "commonjs" }\n');
  for (const hook of ['conscience.js', 'reentry.js']) {
    const r = spawnSync(process.execPath, [join(dir, '.claude', 'hooks', hook)], {
      cwd: dir, input: JSON.stringify({ session_id: 't', prompt: 'hi', cwd: dir }), encoding: 'utf8', env: homeEnv(dir),
    });
    assert.equal(r.status, 0, `${hook} exited ${r.status}: ${r.stderr.slice(0, 300)}`);
  }
});
