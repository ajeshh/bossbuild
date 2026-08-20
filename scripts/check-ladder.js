#!/usr/bin/env node
// check:ladder — the authoring gate for library/practices/seed-to-scale.md.
//
// WHY THIS EXISTS: the three questions (does it exist · what rung · what seam) are worthless as a
// habit. BOSS shipped ~47 skills and exactly four of them ever asked whether the founder already had
// the thing, because nothing forced the question at authoring time. This is that forcing function —
// a new capability cannot ship without someone deciding whether it produces something durable, and
// if it does, what rung it belongs to and what seam it leaves.
//
// It is also the loud half of a silent failure: readLadder() swallows a parse error and returns {},
// which quietly disables artifact-awareness across sync and status. A malformed ledger fails HERE.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { STAGE_ORDER, STAGES_DIR, BOSS_ROOT } from '../src/paths.js';
import { RUNGS } from '../src/ladder.js';

const LEDGER = join(BOSS_ROOT, 'registry', 'surface-ladder.json');
const problems = [];
const fail = (m) => problems.push(m);

let raw;
try {
  raw = JSON.parse(readFileSync(LEDGER, 'utf8'));
} catch (e) {
  console.error(`\n  ✗ registry/surface-ladder.json does not parse — ${e.message}`);
  console.error('    Everything downstream (boss sync, boss status) fails SILENTLY on this.\n');
  process.exit(1);
}

const exempt = raw._exempt || {};
const entries = Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));

// Every skill BOSS ships must be classified: durable (in the ladder) or not (in _exempt).
const shipped = new Map();
for (const stageId of STAGE_ORDER) {
  const mf = join(STAGES_DIR, stageId, 'manifest.json');
  if (!existsSync(mf)) continue;
  for (const s of JSON.parse(readFileSync(mf, 'utf8')).skills || []) {
    if (!shipped.has(s)) shipped.set(s, stageId);
  }
}

for (const [skill, stageId] of shipped) {
  const inLadder = Object.hasOwn(entries, skill);
  const isExempt = Object.hasOwn(exempt, skill);
  if (!inLadder && !isExempt) {
    fail(`${skill} (${stageId}) is in neither the ladder nor _exempt.\n`
      + `      Decide: does a founder ever say "update mine" about what it makes, or only "make another"?\n`
      + `      Durable → add rung + produces + seam to registry/surface-ladder.json.\n`
      + `      Append-only → add it to _exempt with a one-line reason.`);
  }
  if (inLadder && isExempt) fail(`${skill} is in BOTH the ladder and _exempt — pick one.`);
}

for (const name of Object.keys(exempt)) {
  if (name.startsWith('_')) continue;
  if (!shipped.has(name)) fail(`_exempt lists "${name}", which no stage manifest ships. Stale entry.`);
  if (!String(exempt[name]).trim()) fail(`_exempt["${name}"] has no reason. A bare exemption is a shrug.`);
}

// Each ladder entry must be complete, and its skill must actually carry the step 0.
for (const [name, e] of Object.entries(entries)) {
  const at = (m) => fail(`${name}: ${m}`);

  if (!shipped.has(name)) { at('no stage manifest ships this skill.'); continue; }
  if (!RUNGS.includes(e.rung)) at(`rung "${e.rung}" is not one of ${RUNGS.join(' / ')}.`);
  if (!e.produces?.what) at('produces.what is missing — sync and status both render it.');
  if (!(e.produces?.files || []).length && !(e.produces?.deps || []).length) {
    at('produces has neither files nor deps, so nothing can ever detect it.');
  }
  // A seam claim must carry its boundary and its reason; a null seam must carry its reason too.
  // "Nothing to plant here" is a complete answer — an unexplained one is not.
  if (!e.seamWhy) at('seamWhy is missing. A seam without a reason is ceremony; a null without one is a shrug.');
  if (e.seam && !e.seamNot) {
    at('has a seam but no seamNot. The boundary is the only thing stopping a seam growing into the practice.');
  }
  if (e.seam && e.seam.length > 260) at('seam is too long to be a seam. A column, a stub, a folder, or a habit.');

  const stage = shipped.get(name);
  const f = join(STAGES_DIR, stage, 'template', '.claude', 'skills', name, 'SKILL.md');
  if (!existsSync(f)) { at(`SKILL.md not found at ${f}`); continue; }
  const body = readFileSync(f, 'utf8');
  if (!e.stepZeroMarker) { at('stepZeroMarker is missing — nothing pins the skill text to this entry.'); continue; }
  if (!body.includes(e.stepZeroMarker)) {
    at(`SKILL.md is missing its step 0. Expected to find: "${e.stepZeroMarker}"\n`
      + `      A ladder entry whose skill never asks the question is a ledger describing a discipline nobody runs.`);
  }
}

if (problems.length) {
  console.error(`\n  ✗ ladder: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`    • ${p}\n`);
  console.error('  The discipline: library/practices/seed-to-scale.md\n');
  process.exit(1);
}

const seams = Object.values(entries).filter((e) => e.seam).length;
console.log(`  ✓ ladder: ${Object.keys(entries).length} durable capabilities `
  + `(${seams} with a seam, ${Object.keys(entries).length - seams} honestly without), `
  + `${Object.keys(exempt).length - 1} exempt, every shipped skill classified.`);
