// Kettlewick, live (IDEA-149): the demo's records laid down as a working project — BOSS's own
// `adopt`, a history from the records' dates, its own BOSS_HOME — and the guards that keep it out
// of any other checkout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { layDown } from '../scripts/demo.js';
import { coverageProblems, shippedSkills, COVERAGE, LEAVES_NOTHING } from '../scripts/check-demo.js';
import { BOSS_ROOT } from '../src/paths.js';

test('the demo lays down as an adopted MVP project with a dated history, and boss runs in it', () => {
  const base = mkdtempSync(join(tmpdir(), 'boss-demo-live-'));
  try {
    const r = layDown({ dir: join(base, 'k') });
    const m = JSON.parse(readFileSync(join(r.project, '.boss', 'manifest.json'), 'utf8'));
    assert.equal(m.stage, 'L1-mvp');
    assert.equal(m.adopted, true, 'installed by adopt, not stamped');
    assert.equal(m.cohort, 'non-tech-founder');
    assert.equal(m.deferred, undefined, `adopt held nothing back — the demo has earned every MVP skill: ${JSON.stringify(m.deferred)}`);
    assert.ok(!existsSync(join(r.project, 'project.json')), "the demo's stand-in manifest stays behind");
    const days = execFileSync('git', ['log', '--format=%ad', '--date=short'], { cwd: r.project, encoding: 'utf8' }).trim().split('\n');
    assert.ok(days.length > 10 && days.at(-1) === '2026-05-12', `history from the records' dates: ${days.at(-1)} … ${days[0]}`);
    assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: r.project, encoding: 'utf8' }), '', 'the install is committed');
    const out = execFileSync(process.execPath, [join(BOSS_ROOT, 'bin', 'boss'), 'board'], { cwd: r.project, encoding: 'utf8', env: { ...process.env, BOSS_HOME: r.home, NO_COLOR: '1' } });
    assert.match(out, /FEAT-003/);
    assert.equal(layDown({ dir: join(base, 'k') }).reused, true, 'a second run reuses it');
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test('it refuses a folder it did not make, and any folder inside a git checkout', () => {
  const base = mkdtempSync(join(tmpdir(), 'boss-demo-guard-'));
  try {
    mkdirSync(join(base, 'theirs'));
    writeFileSync(join(base, 'theirs', 'keep.txt'), 'mine');
    assert.throws(() => layDown({ dir: join(base, 'theirs'), fresh: true }), /isn't a demo this script made/);
    assert.equal(readFileSync(join(base, 'theirs', 'keep.txt'), 'utf8'), 'mine');
    assert.throws(() => layDown({ dir: join(BOSS_ROOT, 'never-here') }), /inside the git checkout/);
    assert.ok(!existsSync(join(BOSS_ROOT, 'never-here')));
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test('every skill a project at the demo\'s stage ships has a record on the demo, or a named reason it leaves none', () => {
  assert.deepEqual(coverageProblems(), []);
  for (const sk of shippedSkills()) assert.ok(COVERAGE[sk] || LEAVES_NOTHING[sk], sk);
});

test('a new skill with nothing on the demo fails coverage', () => {
  const root = mkdtempSync(join(tmpdir(), 'boss-demo-cov-'));
  try {
    for (const [st, sk] of [['L0-quickstart', 'idea'], ['L1-mvp', 'brand-new-verb'], ['L2-v1', 'not-yet-shipped']]) {
      mkdirSync(join(root, 'stages', st, 'template', '.claude', 'skills', sk), { recursive: true });
      writeFileSync(join(root, 'stages', st, 'template', '.claude', 'skills', sk, 'SKILL.md'), '---\nname: x\n---\n');
    }
    const p = coverageProblems(root);
    assert.equal(p.length, 1, p.join('\n'));
    assert.match(p[0], /^\/brand-new-verb ships at this stage/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('every folder a shipped verb writes has a place on the home and demo pages', async () => {
  const { GROUPS, WRITES } = await import('../src/places.js');
  const placed = new Set(GROUPS.flatMap((g) => g.folders));
  for (const [sk, [glob]] of Object.entries(COVERAGE)) {
    if (!glob.startsWith('docs/')) continue;
    const dir = glob.slice(0, glob.lastIndexOf('/'));
    assert.ok(placed.has(dir) && WRITES[dir], `/${sk} writes ${dir}/, which "Where things live" never shows`);
  }
});
