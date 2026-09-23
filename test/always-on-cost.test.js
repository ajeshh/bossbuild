// The always-on context bill — IDEA-085. A skill's `description:` is loaded so the HOST can decide
// when the skill applies, which means it is in the founder's context on EVERY turn whether or not
// the skill ever runs. v0.258.0 cut the CLAUDE.md half of this bill; this guards the other half.
//
// The check in scripts/check-manifests.js is the gate. What is guarded HERE is that the gate has
// teeth — a check verified only by watching it pass is a check that has been a silent no-op twice
// in this repo's history.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, writeFileSync, cpSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { BOSS_ROOT, STAGE_ORDER } from '../src/paths.js';
import { cleanup } from './helpers.js';

after(cleanup);
const CAP = 420;

// The gate-has-teeth tests below break a description ON PURPOSE and watch the gate go red. They
// used to do that to the shipped file in the working tree and restore it in `finally` — while
// `node --test` runs files in parallel and six peer sessions `git status` the same tree. A kill
// mid-run would have committed "Rule #1" into a founder's skill. So the gate runs against a
// throwaway copy of everything check-manifests reads; the working tree is never written.
const sandboxes = [];
after(() => { for (const d of sandboxes.splice(0)) rmSync(d, { recursive: true, force: true }); });
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), 'boss-gate-'));
  sandboxes.push(root);
  for (const part of ['src', 'scripts', 'stages', 'library', 'plugin', '.claude-plugin', 'VERSION', 'package.json']) {
    if (existsSync(join(BOSS_ROOT, part))) cpSync(join(BOSS_ROOT, part), join(root, part), { recursive: true });
  }
  return root;
}
function gateExit(root) {
  try {
    execFileSync('node', [join(root, 'scripts', 'check-manifests.js'), '--strict'],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return 0;
  } catch (e) { return e.status; }
}

function descriptions() {
  const out = [];
  for (const stage of STAGE_ORDER) {
    const dir = join(BOSS_ROOT, 'stages', stage, 'template', '.claude', 'skills');
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const f = join(dir, name, 'SKILL.md');
      if (!existsSync(f)) continue;
      const line = readFileSync(f, 'utf8').split('\n').find((l) => l.startsWith('description:')) || '';
      out.push({ stage, name, file: f, bytes: Buffer.byteLength(line, 'utf8') + 1 });
    }
  }
  return out;
}

test('no shipped skill description exceeds the always-on cap', () => {
  const over = descriptions().filter((d) => d.bytes > CAP);
  assert.deepEqual(over.map((d) => `${d.stage}/${d.name} ${d.bytes}B`), []);
});

test('the cap is enforced by a gate that actually fails', () => {
  // Make it fail on purpose, then put it back. The alternative — trusting a green run — is how
  // check-refs shipped its citation class as a no-op twice.
  const root = sandbox();
  const victim = descriptions().find((d) => d.stage === 'L1-mvp').file.replace(BOSS_ROOT, root);
  writeFileSync(victim, readFileSync(victim, 'utf8').replace(/^description: /m, `description: ${'x'.repeat(CAP)} `));
  assert.equal(gateExit(root), 1, 'an oversized description must fail the release gate');
});

test('an agent description over the cap fails the gate too — agents are listed on every turn as well', () => {
  const root = sandbox();
  const victim = join(root, 'stages', 'L1-mvp', 'template', '.claude', 'agents', 'tester.md');
  writeFileSync(victim, readFileSync(victim, 'utf8').replace(/^description: /m, `description: ${'x'.repeat(CAP)} `));
  assert.equal(gateExit(root), 1, 'an oversized agent description must fail the release gate');
});
test('a " #" in a description fails the gate — YAML reads it as a comment and the host truncates there', () => {
  // Found by running /skill-doctor in a scaffolded project (2026-09-12): /extract listed at "< 20"
  // tokens because its description said "PRINCIPLE #1". Same proof shape as the cap test above.
  const root = sandbox();
  const victim = descriptions().find((d) => d.stage === 'L1-mvp').file.replace(BOSS_ROOT, root);
  writeFileSync(victim, readFileSync(victim, 'utf8').replace(/^description: /m, 'description: Rule #1 of this skill - '));
  assert.equal(gateExit(root), 1, 'a description with " #" must fail the release gate');
});

test('a BOSS version stamp or record id in a shipped skill body fails the gate', () => {
  const root = sandbox();
  const victim = descriptions().find((d) => d.stage === 'L1-mvp').file.replace(BOSS_ROOT, root);
  writeFileSync(victim, readFileSync(victim, 'utf8') + '\n\nUntil v0.284.0 this deleted the wrong one (IDEA-097).\n');
  assert.equal(gateExit(root), 1, "BOSS's bookkeeping in the founder's brief must fail the release gate");
  assert.equal(gateExit(sandbox()), 0, 'and the unmodified tree passes it');
});

test('no shipped skill description contains " #"', () => {
  const dir = (stage) => join(BOSS_ROOT, 'stages', stage, 'template', '.claude', 'skills');
  const bad = [];
  for (const stage of STAGE_ORDER) {
    if (!existsSync(dir(stage))) continue;
    for (const name of readdirSync(dir(stage))) {
      const f = join(dir(stage), name, 'SKILL.md');
      if (!existsSync(f)) continue;
      const line = readFileSync(f, 'utf8').split('\n').find((l) => l.startsWith('description:')) || '';
      if (/ #/.test(line)) bad.push(`${stage}/${name}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('/evidence is the one capture verb — and keeps the two halves a merge was feared to lose', () => {
  // IDEA-086 kept three verbs and put a routing line at the door, because a merge "would cost
  // /interview's prep half and /research's synthesis half." The board assessment (2026-09-12)
  // merged anyway — the founder could not tell the three apart from the menu — and the cost was
  // avoided by keeping both halves: prep stays the whole of /interview; synthesis is /evidence's
  // digest. This holds those two facts, so the merge can never quietly drop either.
  const f = join(BOSS_ROOT, 'stages/L0-quickstart/template/.claude/skills/evidence/SKILL.md');
  const s = readFileSync(f, 'utf8');
  assert.match(s, /\/interview/, 'the door for a conversation that has not happened yet is still named');
  assert.doesNotMatch(s, /\/research\b/, '/research is retired; nothing points a founder at it');
  assert.match(s, /verbatim/i, "the synthesis half — the pain in the founder's user's own words");
  assert.match(s, /workarounds/i, 'the synthesis half — what they do today');
  assert.match(s, /led the witness/i, 'the epistemics half at transcript scale');
  const prep = readFileSync(join(BOSS_ROOT, 'stages/L0-quickstart/template/.claude/skills/interview/SKILL.md'), 'utf8');
  assert.match(prep, /## PREP/, 'the prep half is still the whole of /interview');
  assert.doesNotMatch(prep, /## DEBRIEF/, 'and the debrief half no longer lives there');
});
