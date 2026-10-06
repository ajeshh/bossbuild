// The small things a first command meets (IDEA-150 A1–A3, A6). Each was reproduced before the fix:
//   · `boss new "my proj"` printed `cd my proj`, which fails when pasted;
//   · errors stopped without naming the next step (`new .` never said `adopt`; a bad `--mode` never
//     listed the modes; `hooks` outside a project skipped the shared way-out);
//   · an unknown flag was ignored — `status --bogus` exited 0, and `status --json` printed prose to an
//     agent that asked for JSON, which nothing told it;
//   · `--json` failures wrote prose to stderr.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { HELP } from '../src/help.js';
import { KNOWN_FLAGS } from '../src/args.js';
import { project, cleanup } from './helpers.js';

after(cleanup);
const BIN = join(BOSS_ROOT, 'bin', 'boss');
function boss(args, cwd) {
  try {
    const out = execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd, USERPROFILE: cwd, BOSS_HOME: join(cwd, '.boss-home') },
    });
    return { code: 0, out, err: '' };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || ''), err: e.stderr || '' };
  }
}
const bossProject = () => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], skills: ['idea'], hooks: [], loops: [],
  }),
  '.boss/config.json': JSON.stringify({ cohort: null }),
});

test('A1: the printed `cd` line survives a name with a space', () => {
  const dir = project({});
  const r = boss(['new', 'my proj'], dir);
  assert.equal(r.code, 0, r.out);
  const want = process.platform === 'win32' ? 'cd "my proj"' : "cd 'my proj'";
  assert.ok(r.out.includes(want), `expected ${want} in:\n${r.out}`);
});

test('A2: `new` on a folder that exists names `boss adopt`', () => {
  const dir = project({});
  mkdirSync(join(dir, 'taken'));
  const r = boss(['new', 'taken'], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /boss adopt/);
});

test('A2: an unknown --mode on adopt lists the modes it takes', () => {
  const dir = project({});
  const r = boss(['adopt', '--mode', 'mvpp'], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /quickstart \| mvp \| v1 \| scale/);
});

test('A2: `hooks enable` outside a project gives the shared way out', () => {
  const dir = project({});
  const r = boss(['hooks', 'enable', 'secrets-guard'], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /isn't a BOSS project/);
});

test('A3: a flag no command knows fails, with the nearest real one', () => {
  const dir = bossProject();
  const typo = boss(['board', '--nxt'], dir);
  assert.equal(typo.code, 1);
  assert.match(typo.out, /--nxt/);
  assert.match(typo.out, /--next/);
  assert.equal(boss(['status', '--bogus'], dir).code, 1);
});

test('A3: --json on a command with no JSON output says so instead of printing prose', () => {
  const dir = bossProject();
  const r = boss(['status', '--json'], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /boss board --json/);
});

test('A3: a real flag still works', () => {
  const dir = bossProject();
  assert.equal(boss(['board', '--next'], dir).code, 0);
});

test('A6: a --json failure writes one JSON object to stderr and nothing to stdout', () => {
  const dir = project({});
  const r = boss(['board', '--json'], dir);
  assert.equal(r.code, 1);
  const parsed = JSON.parse(r.err.trim());
  assert.match(parsed.error, /isn't a BOSS project/);
  assert.equal(r.out.trim(), r.err.trim(), 'stdout stays empty');
});

test('every flag help documents and every flag a shipped skill passes is a known flag', () => {
  const seen = new Set();
  for (const v of Object.values(HELP)) for (const m of JSON.stringify(v).match(/--[a-z][a-z0-9-]*/g) || []) seen.add(m.slice(2));
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.md') ? [join(d, e.name)] : []);
  for (const f of [...walk(join(BOSS_ROOT, 'stages')), ...walk(join(BOSS_ROOT, 'plugin', 'skills'))]) {
    for (const line of readFileSync(f, 'utf8').match(/`boss [a-z]+[^`]*`/g) || []) {
      for (const m of line.match(/--[a-z][a-z0-9-]*/g) || []) seen.add(m.slice(2));
    }
  }
  // Named in a skill as specced and not built (plugin/skills/welcome: `boss new --idea`, IDEA-099).
  const NOT_BUILT = new Set(['idea']);
  const missing = [...seen].filter((f) => !KNOWN_FLAGS.has(f) && !NOT_BUILT.has(f));
  assert.deepEqual(missing, [], 'add these to KNOWN_FLAGS in src/args.js');
});
