// Readiness to climb a rung — see src/readiness.js. What is guarded here is not the wording, it
// is the four properties that keep this from becoming the progress bar IDEA-076 refuses:
//
//   1. it can GO DOWN (supersede the evidence, the surface retracts)
//   2. what BOSS cannot check stays UNJUDGED and never counts toward "cleared"
//   3. it NEVER BLOCKS the unlock
//   4. `boss status` stays SILENT until every checkable leg is met
//
// Test 1 is the load-bearing one. IDEA-065's rule is that a progress surface which cannot go down
// is a comfort device, and the only way to know this one can is to make it.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { readiness } from '../src/readiness.js';
import { project, cleanup, idea } from './helpers.js';

after(cleanup);
const BIN = join(BOSS_ROOT, 'bin', 'boss');

function boss(args, cwd) {
  try {
    return execFileSync('node', [BIN, ...args], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NO_COLOR: '1', HOME: cwd },
    });
  } catch (e) { return (e.stdout || '') + (e.stderr || ''); }
}

const evid = (id, grade, status = 'active') =>
  `---\nid: ${id}\ntype: evidence\nowner: "@t"\nstatus: ${status}\ndate: 2026-09-01\ngrade: ${grade}\n---\n\n# ${id} — a signal\n`;

const quickstart = (extra = {}) => project({
  '.boss/manifest.json': JSON.stringify({
    name: 'p', bossVersion: '0.0.1', stage: 'L0-quickstart', mode: 'Quickstart',
    installedLayers: ['L0-quickstart'], agents: [], hooks: [], loops: [], skills: ['idea'],
  }),
  '.boss/config.json': '{}',
  ...extra,
});

test('Quickstart has no bar — there is nothing behind it to have earned', () => {
  assert.equal(readiness('L0-quickstart', quickstart()), null);
});

test('a condition BOSS cannot check is never counted as met', () => {
  const dir = quickstart({
    'docs/ideas/IDEA-001-a.md': idea('IDEA-001'),
    'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain'),
  });
  const r = readiness('L1-mvp', dir);
  assert.equal(r.cleared, true);          // both CHECKABLE legs are met
  assert.equal(r.checkable, 2);
  assert.equal(r.unknowns, 1);            // and the third is still unjudged
  const unknown = r.conditions.find((c) => c.state === 'unknown');
  assert.ok(unknown, 'the unjudged condition must still be NAMED, not dropped');
  // "cleared" must never be reachable from unknowns alone.
  assert.equal(readiness('L2-v1', quickstart()).cleared, false);
});

test('the readiness surface GOES DOWN when the record behind it is superseded', () => {
  const dir = quickstart({
    'docs/ideas/IDEA-001-a.md': idea('IDEA-001'),
    'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain'),
  });
  assert.equal(readiness('L1-mvp', dir).cleared, true);
  assert.match(boss(['status'], dir), /Ready for MVP/);

  writeFileSync(join(dir, 'docs/evidence/EVID-001-a.md'), evid('EVID-001', 'stated-pain', 'superseded'));
  assert.equal(readiness('L1-mvp', dir).cleared, false, 'a retracted signal must retract the readiness');
  assert.doesNotMatch(boss(['status'], dir), /Ready for MVP/);
});

test('boss status says nothing about climbing until every checkable leg is met', () => {
  // An idea but no evidence: half met is not a message, it is silence.
  const dir = quickstart({ 'docs/ideas/IDEA-001-a.md': idea('IDEA-001') });
  assert.doesNotMatch(boss(['status'], dir), /Ready for/);
});

test('boss status never renders a tally — no percentage, no "n of m"', () => {
  const dir = quickstart({
    'docs/ideas/IDEA-001-a.md': idea('IDEA-001'),
    'docs/evidence/EVID-001-a.md': evid('EVID-001', 'stated-pain'),
  });
  const out = boss(['status'], dir);
  assert.match(out, /Ready for MVP/);
  assert.doesNotMatch(out, /\d+\s*of\s*\d+/);
  assert.doesNotMatch(out, /\d+%/);
});

test('unlock names the bar and crosses it anyway — BOSS never blocks', () => {
  const dir = quickstart();                      // nothing captured, nothing learned
  const out = boss(['unlock', 'mvp'], dir);
  assert.match(out, /MVP mode pays for itself/);
  assert.match(out, /nothing in docs\/ideas\/ yet/);
  assert.match(out, /Unlocking anyway/);
  assert.match(out, /Unlocked MVP mode/, 'the unmet bar must not have stopped the unlock');
  const stamp = JSON.parse(readFileSync(join(dir, '.boss/manifest.json'), 'utf8'));
  assert.ok(stamp.installedLayers.includes('L1-mvp'));
});

test('every rung that can be climbed to names a bar — Scale is no longer the only one', () => {
  const dir = quickstart();
  for (const stage of ['L1-mvp', 'L2-v1', 'L3-scale']) {
    const r = readiness(stage, dir);
    assert.ok(r && r.conditions.length > 0, `${stage} must name what earns it`);
    assert.ok(r.lead.length > 0);
  }
});
