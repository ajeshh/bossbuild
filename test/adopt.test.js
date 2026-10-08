// `boss adopt` — the path most people actually arrive on, tested against the RESULT rather than
// against the template.
//
// WHY THIS FILE EXISTS. `check-manifests` enforces a real rule: every agent a stage ships must be
// NAMED in that stage's CLAUDE.md contribution, "otherwise it will never be invoked." It reads the
// TEMPLATE. Nothing read the adopted result — and a repo that already has a CLAUDE.md never
// receives the template's, so the Quickstart layer (the only place `coder`, `mentor-founder` and
// `prompt-coach` are named) simply did not land. Three of the four day-one agents shipped into the
// repo and were invocable by nothing.
//
// Found by RUNNING adopt against six real-shaped repos, not by reading it — a Next.js app with
// tests and a deploy config, a half-finished side project, a Python CLI, a monorepo, a repo that
// already had CLAUDE.md + AGENTS.md, and a nearly-empty one. The mechanics were sound in all six
// (their permissions, env, own hook and own skill all survived the merge). Every finding was
// orientation: who BOSS thinks it is talking to, and what it tells them to do next.
//
// So these assert the two things the template-scoped gate structurally cannot see.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { project, cleanup } from './helpers.js';

after(cleanup);
const BIN = join(BOSS_ROOT, 'bin', 'boss');

const boss = (args, cwd) => {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd, USERPROFILE: cwd },
    });
  } catch (e) { return (e.stdout || '') + (e.stderr || ''); }
};

// A repo that already has a CLAUDE.md — the common arrival, since anyone who would adopt BOSS is
// already using Claude Code and already wrote one.
function repoWithClaudeMd() {
  const dir = project({
    'package.json': '{"name":"myapp","scripts":{"test":"jest"}}',
    'CLAUDE.md': '# CLAUDE.md — myapp\n\nMy own rules.\n',
    'src/a.ts': 'export const a = 1;\n',
    'src/b.ts': 'export const b = 2;\n',
  });
  execFileSync('git', ['init', '-q'], { cwd: dir });
  boss(['adopt', '--apply'], dir);
  return dir;
}

test('REGRESSION: every agent adopt installs is named in the resulting CLAUDE.md', () => {
  const dir = repoWithClaudeMd();
  const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  const installed = readdirSync(join(dir, '.claude', 'agents')).map((f) => f.replace(/\.md$/, ''));
  assert.ok(installed.length >= 4, 'the fixture must actually install agents');
  const unnamed = installed.filter((a) => !claude.includes(a));
  assert.deepEqual(unnamed, [], `agents installed but named nowhere — nothing can invoke them: ${unnamed.join(', ')}`);
});

test("the founder's own CLAUDE.md is preserved, not replaced", () => {
  const dir = repoWithClaudeMd();
  const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  assert.match(claude, /My own rules\./);
  assert.match(claude, /<!-- boss:adopt start -->/);
});

test('an adopted repo is pointed at /read-repo first, not at the empty-folder arc', () => {
  const dir = repoWithClaudeMd();
  const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
  const block = claude.slice(claude.indexOf('<!-- boss:adopt start -->'));
  const readRepo = block.indexOf('/read-repo');
  const welcome = block.indexOf('/welcome');
  assert.ok(readRepo >= 0, 'the adopt block must name /read-repo');
  assert.ok(welcome === -1 || readRepo < welcome, '/read-repo must come before /welcome for an adopted repo');
});

test('boss status does not tell an adopted repo to go capture an idea', () => {
  const dir = repoWithClaudeMd();
  const out = boss(['status'], dir);
  // The old line landed one row above "Already built: …", so the same screen both saw their work
  // and asked them to start. An empty board is the EXPECTED state here, not a prompt.
  assert.doesNotMatch(out, /Nothing in flight yet/);
  assert.match(out, /Nothing captured yet — expected here/);
  assert.match(out, /read-repo/);
});

test("a fresh `boss new` project keeps the capture prompt — the fix is scoped to adopted", () => {
  const dir = project({});
  const out = boss(['new', 'fresh'], dir);
  assert.match(out, /Created fresh/);
  assert.match(boss(['status'], join(dir, 'fresh')), /Nothing in flight yet/);
});

test("adopt does not overwrite a founder's own Claude Code settings", () => {
  const dir = project({
    'package.json': '{"name":"g"}',
    '.claude/settings.json': JSON.stringify({
      permissions: { allow: ['Bash(npm test)'] },
      env: { MY_FLAG: '1' },
      hooks: { UserPromptSubmit: [{ matcher: '', hooks: [{ type: 'command', command: 'node .claude/hooks/mine.js' }] }] },
    }),
    'src/a.ts': 'export const a = 1;\n',
  });
  mkdirSync(join(dir, '.claude', 'hooks'), { recursive: true });
  writeFileSync(join(dir, '.claude', 'hooks', 'mine.js'), 'process.exit(0)\n');
  execFileSync('git', ['init', '-q'], { cwd: dir });
  boss(['adopt', '--apply'], dir);
  const s = JSON.parse(readFileSync(join(dir, '.claude', 'settings.json'), 'utf8'));
  assert.deepEqual(s.permissions.allow, ['Bash(npm test)'], 'their allow rules must survive');
  assert.equal(s.env.MY_FLAG, '1', 'their env must survive');
  const cmds = (s.hooks.UserPromptSubmit || []).flatMap((e) => (e.hooks || []).map((h) => [h.command, ...(h.args || [])].join(' ')));
  assert.ok(cmds.some((c) => c.includes('mine.js')), 'their own hook must survive');
  assert.ok(cmds.some((c) => c.includes('conscience.js')), "BOSS's hook must be added alongside");
  assert.ok((s.permissions.deny || []).length > 0, 'the secrets deny-list must be merged in');
});

// --- IDEA-118 — adopt keeps the holds `boss new` / `boss unlock` keep ------------------------------
// Adopt used to lay down a rung's entire skill list and every opt-in hook, so the path most founders
// meet first got twelve verbs and ten guards the other path withholds until earned or asked for.
test('adopt at MVP holds the earned groups and the opt-in hooks like unlock does; a live repo counts as shipped', () => {
  const files = {
    'package.json': '{"name":"x"}', 'vercel.json': '{}',
    'test/a.test.js': "test('x',()=>{})\n", '.github/workflows/ci.yml': 'on: push\n',
  };
  for (let i = 0; i < 7; i++) files[`src/m${i}.js`] = `export const f${i} = ${i}\n`;
  const dir = project(files);
  const out = boss(['adopt', '--apply'], dir);
  assert.match(out, /MVP mode/);
  const skills = readdirSync(join(dir, '.claude', 'skills'));
  // shipped before adoption → the after-you-ship verbs are on disk, not folded away from a live app
  for (const s of ['health', 'onboard', 'landing']) assert.ok(skills.includes(s), `${s} laid down — the repo is live`);
  // nothing calls a model → that group stays held, and the line says what earns it
  for (const s of ['ai-cost', 'evals', 'ai-failure-states']) assert.ok(!skills.includes(s), `${s} held`);
  assert.match(out, /3 held back when the app first calls a model/);
  // opt-in hooks stay off disk until `boss hooks enable`
  const hooks = readdirSync(join(dir, '.claude', 'hooks'));
  assert.ok(!hooks.includes('secrets-guard.js') && !hooks.includes('smoke-guard.js'), 'opt-in hooks held');
  assert.ok(hooks.includes('conscience.js'), 'the always-on hook lands');
  const stamp = JSON.parse(readFileSync(join(dir, '.boss', 'manifest.json'), 'utf8'));
  assert.equal(stamp.shippedBefore, true);
  // no styled screen either (plain modules) → the UI group is held too
  assert.match(out, /1 held back when the app gets its first styled screen/);
  assert.deepEqual(Object.keys(stamp.deferred['L1-mvp']), ['aiMediated', 'uiBuilt']);
  assert.ok(!stamp.skills.includes('ai-cost') && stamp.skills.includes('health'));
  // and the map does not tell a live app its after-you-ship verbs are "for after you ship"
  assert.doesNotMatch(boss(['map'], dir), /for after you ship/);
});

test('a small repo adopts at Quickstart and the why line names what it found and the bar', () => {
  const dir = project({ 'package.json': '{"name":"x"}', 'src/a.js': '1\n', 'test/a.test.js': '1\n', 'vercel.json': '{}' });
  const out = boss(['adopt', '--apply'], dir);
  assert.match(out, /Quickstart mode/);
  assert.match(out, /2 source file\(s\) — MVP starts at 5 with a build manifest · package\.json · tests · deploy config \(vercel\.json\)/);
});

// --- IDEA-163 — adopt shows its plan before it writes ------------------------------------------
// `boss sync` and `boss remove` previewed and acted on `--apply`; adopt wrote on its first run,
// into a repo that already had its own way of working (EVID-006).

test('bare adopt writes nothing and says what it would add, change and not see', () => {
  const dir = project({
    'package.json': '{"name":"myapp"}',
    'CLAUDE.md': '# my rules\n',
    '.gitignore': 'node_modules/\n',
    'docs/features/FEAT-001-login/README.md': '---\nid: FEAT-001\nstatus: building\n---\n# Login\n',
    'docs/features/FEAT-002-cart/README.md': '---\nid: FEAT-002\nstatus: shipped\n---\n# Cart\n',
    'docs/design/FEAT-001-review.md': '# a review named after a FEAT is not a record\n',
  });
  const before = readdirSync(dir).sort();
  const out = boss(['adopt'], dir);
  assert.deepEqual(readdirSync(dir).sort(), before, 'nothing written');
  assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), '# my rules\n');
  assert.match(out, /Nothing is written yet/);
  assert.match(out, /CLAUDE\.md\s+a marked BOSS block/);
  assert.match(out, /\.gitignore\s+\d+ rule\(s\) added/);
  assert.match(out, /docs\/features\/FEAT-\*\/README\.md \(2\)/);
  assert.doesNotMatch(out, /docs\/design/, 'a file named after a FEAT without its frontmatter is not a record');
  assert.match(out, /boss adopt --apply/);
});

test('the preview promises the files --apply lays down', () => {
  const dir = project({ 'package.json': '{"name":"myapp"}', 'src/a.js': 'export const a = 1;\n' });
  const promised = Number(/What it adds — (\d+) new file/.exec(boss(['adopt'], dir))[1]);
  const added = Number(/(\d+) file\(s\) added/.exec(boss(['adopt', '--apply'], dir))[1]);
  assert.equal(added, promised);
});
