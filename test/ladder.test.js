// The ladder — does it already exist, what rung is it on, what seam does it leave.
//
// The invariant these protect is the one that made the feature necessary: BOSS could tell a founder
// a FILE changed and never that the THING they built was affected. So the assertions are about
// artifact-awareness end to end (a repo that has a landing page must be TOLD it has one), not about
// the matcher in isolation — an internal-only test would pass while sync stayed silent.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import {
  readLadder, assess, detectArtifact, projectRung, nextSeam, built, hasRealWork, RUNGS,
} from '../src/ladder.js';
import { project, cleanup } from './helpers.js';

after(cleanup);

const BIN = join(BOSS_ROOT, 'bin', 'boss');
const LADDER = readLadder();

function boss(args, cwd) {
  try {
    return {
      code: 0,
      out: execFileSync('node', [BIN, ...args], {
        cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NO_COLOR: '1', HOME: cwd },
      }),
    };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}

const stamp = (over = {}) => ({
  name: 'testproj', bossVersion: '0.0.1', stage: 'L1-mvp', mode: 'MVP',
  installedLayers: ['L0-quickstart', 'L1-mvp'], agents: [], hooks: [], loops: [],
  skills: ['landing', 'ship', 'measure'], ...over,
});

// Carries a source file: `nextSeam` is gated on the project having actually started, and a
// fixture without one would make every seam assertion pass for the wrong reason.
const mvpProject = (extra = {}) => project({
  '.boss/manifest.json': JSON.stringify(stamp()),
  '.boss/config.json': JSON.stringify({ cohort: null }),
  'src/index.js': 'export const x = 1;',
  ...extra,
});

// --- detection ------------------------------------------------------------

test('an exact path, a wildcard segment, and a trailing ** all detect', () => {
  const dir = project({
    'docs/ideas/CANVAS.md': '# canvas',
    'docs/features/FEAT-003-thing.md': '# feat',
    'docs/evals/set.yml': 'cases: []',
  });
  assert.equal(detectArtifact(dir, { produces: { files: ['docs/ideas/CANVAS.md'] } }).exists, true);
  assert.equal(detectArtifact(dir, { produces: { files: ['docs/features/FEAT-*.md'] } }).exists, true);
  assert.equal(detectArtifact(dir, { produces: { files: ['docs/evals/**'] } }).exists, true);
});

test('an EMPTY directory is not an artifact — a folder is not the thing', () => {
  const dir = project({ 'keep.txt': 'x' });
  execFileSync('mkdir', ['-p', join(dir, 'docs', 'evals')]);
  assert.equal(detectArtifact(dir, { produces: { files: ['docs/evals/**'] } }).exists, false);
});

test('deps detection reads both dependencies and devDependencies, and misses cleanly', () => {
  const dir = project({
    'package.json': JSON.stringify({ dependencies: { stripe: '^14' }, devDependencies: { 'posthog-js': '^1' } }),
  });
  assert.equal(detectArtifact(dir, { produces: { deps: ['stripe'] } }).exists, true);
  assert.equal(detectArtifact(dir, { produces: { deps: ['posthog-js'] } }).exists, true);
  assert.equal(detectArtifact(dir, { produces: { deps: ['@paddle/paddle-js'] } }).exists, false);
});

test('a project with no package.json does not crash deps detection', () => {
  const dir = project({ 'a.txt': 'x' });
  assert.equal(detectArtifact(dir, { produces: { deps: ['stripe'] } }).exists, false);
});

// --- the rung comparison --------------------------------------------------

test('rung position is read from installed layers, not the mode label alone', () => {
  assert.equal(projectRung(stamp()), 'MVP');
  assert.equal(projectRung(stamp({ installedLayers: ['L0-quickstart'] })), 'Quickstart');
  assert.equal(projectRung(stamp({ installedLayers: [], stage: 'L2-v1', mode: 'V1' })), 'V1');
});

test('below / at / above are all reachable and mean what they say', () => {
  const dir = mvpProject();
  assert.equal(assess(dir, 'landing', stamp()).position, 'at');       // MVP capability, MVP project
  assert.equal(assess(dir, 'incident', stamp()).position, 'below');   // Scale capability
  assert.equal(assess(dir, 'canvas', stamp()).position, 'above');     // Quickstart capability
});

// --- the seam contract ----------------------------------------------------

test('every ladder entry declares a valid rung and a reason for its seam decision', () => {
  for (const [name, e] of Object.entries(LADDER)) {
    assert.ok(RUNGS.includes(e.rung), `${name}: rung "${e.rung}" not on the ladder`);
    assert.ok(e.seamWhy, `${name}: a seam needs a reason and so does a null one`);
    if (e.seam) assert.ok(e.seamNot, `${name}: a seam without a boundary grows into the practice`);
  }
});

test('nextSeam offers ONE seam, from above the rung, and never one already planted', () => {
  const dir = mvpProject();
  const s = nextSeam(dir, stamp());
  assert.ok(s, 'an MVP project with nothing built should have an open seam');
  assert.equal(s.position, 'below', 'a seam is only ever the answer to "above your rung"');
  assert.equal(s.exists, false);
  assert.equal(typeof s.seam, 'string');
});

test('nextSeam skips capabilities gated on a condition the CLI cannot evaluate', () => {
  const dir = project({
    '.boss/manifest.json': JSON.stringify(stamp({ installedLayers: ['L0-quickstart'], stage: 'L0-quickstart', mode: 'Quickstart' })),
  });
  const s = nextSeam(dir, stamp({ installedLayers: ['L0-quickstart'] }));
  assert.ok(!s?.appliesWhen, 'a conditional capability must not be nudged about from a path list');
});

test('a planted seam stops being offered', () => {
  const bare = mvpProject();
  const before = nextSeam(bare, stamp());
  const after = nextSeam(mvpProject({
    [LADDER[before.name].produces.files?.[0] || 'docs/onboarding.md']: 'planted',
  }), stamp());
  assert.notEqual(after?.name, before.name, 'the seam BOSS just asked for must not be asked for again');
});

// --- end to end: the behaviour that made this necessary -------------------

test('boss status names what is already built rather than only what is missing', () => {
  const dir = mvpProject({ 'app/page.tsx': '<h1>hi</h1>', 'vercel.json': '{}' });
  const r = boss(['status'], dir);
  assert.equal(r.code, 0);
  assert.match(r.out, /Already built:/);
  assert.match(r.out, /the landing page/);
  assert.match(r.out, /a deploy config/);
});

test('boss status stays silent about built work when there is none to claim', () => {
  const r = boss(['status'], mvpProject());
  assert.equal(r.code, 0);
  assert.ok(!r.out.includes('Already built:'), 'an empty repo must not be told what it has');
});

test('sync tells a founder who HAS the artifact that the skill making it changed', () => {
  const dir = mvpProject({ 'app/page.tsx': '<h1>hi</h1>' });
  const r = boss(['sync'], dir);
  assert.equal(r.code, 0);
  assert.match(r.out, /you already have.*the landing page/s);
  assert.match(r.out, /app\/page\.tsx/);
  assert.match(r.out, /Syncing the skill does NOT/);
});

test('sync says nothing about artifacts the project does not have', () => {
  const r = boss(['sync'], mvpProject());
  assert.equal(r.code, 0);
  assert.ok(!r.out.includes('you already have'), 'a false "you have this" costs more than a miss');
});

// --- the authoring gate ---------------------------------------------------

test('every ladder entry pins a step 0 that its SKILL.md actually carries', () => {
  const stages = { Quickstart: 'L0-quickstart', MVP: 'L1-mvp', V1: 'L2-v1', Scale: 'L3-scale' };
  for (const [name, e] of Object.entries(LADDER)) {
    assert.ok(e.stepZeroMarker, `${name}: nothing pins the skill text to this entry`);
    // Find the skill wherever it ships — its rung is not necessarily its stage.
    const found = Object.values(stages)
      .map((s) => join(BOSS_ROOT, 'stages', s, 'template', '.claude', 'skills', name, 'SKILL.md'))
      .filter((p) => { try { readFileSync(p); return true; } catch { return false; } });
    assert.ok(found.length, `${name}: no SKILL.md anywhere`);
    assert.ok(
      found.some((p) => readFileSync(p, 'utf8').includes(e.stepZeroMarker)),
      `${name}: SKILL.md never asks the question this entry describes`,
    );
  }
});

test('a skill is never both durable and exempt — the gate\'s completeness invariant', () => {
  const raw = JSON.parse(readFileSync(join(BOSS_ROOT, 'registry', 'surface-ladder.json'), 'utf8'));
  const exempt = Object.keys(raw._exempt || {}).filter((k) => !k.startsWith('_'));
  assert.deepEqual(exempt.filter((n) => Object.hasOwn(LADDER, n)), [],
    'a skill cannot be both durable and exempt');
  assert.ok(exempt.length, 'an empty exempt list means the gate is classifying nothing');
});

// --- the quiet-when-empty guarantee --------------------------------------

test('a scaffold with no work yet is offered NO seam — it is at its rung, not below one', () => {
  const bare = project({
    '.boss/manifest.json': JSON.stringify(stamp({
      installedLayers: ['L0-quickstart'], stage: 'L0-quickstart', mode: 'Quickstart',
    })),
  });
  assert.equal(hasRealWork(bare), false);
  assert.equal(nextSeam(bare, stamp({ installedLayers: ['L0-quickstart'] })), null,
    'naming a seam for a feature that does not exist is the over-shooting the practice warns about');
});

test('the scaffold\'s own empty docs dirs do not read as work — only a real record does', () => {
  const withTemplate = project({
    '.boss/manifest.json': JSON.stringify(stamp()),
    'docs/ideas/README.md': 'how to capture an idea',
  });
  assert.equal(hasRealWork(withTemplate), false, 'a shipped README is BOSS\'s, not the founder\'s work');
  const withIdea = project({
    '.boss/manifest.json': JSON.stringify(stamp()),
    'docs/ideas/IDEA-001-a-thing.md': '# a thing',
  });
  assert.equal(hasRealWork(withIdea), true);
});

test('boss status on a fresh scaffold names neither built work nor a seam', () => {
  const bare = project({
    '.boss/manifest.json': JSON.stringify(stamp({
      installedLayers: ['L0-quickstart'], stage: 'L0-quickstart', mode: 'Quickstart',
    })),
    '.boss/config.json': JSON.stringify({ cohort: null }),
  });
  const r = boss(['status'], bare);
  assert.equal(r.code, 0);
  assert.ok(!r.out.includes('Already built:'));
  assert.ok(!r.out.includes('Not yet ('), 'an empty project is exactly where BOSS should stay quiet');
});
