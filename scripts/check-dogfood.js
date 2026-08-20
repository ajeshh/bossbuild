#!/usr/bin/env node
// BOSS · dogfood coverage — does BOSS actually run the capabilities it ships?
//
// WHY THIS EXISTS. Ajesh, after three separate drift findings in one session: *"the problem seems
// more widespread."* It was. BOSS ships 9 record types and 5 machine logs; an audit of its own
// repo — its first and only real project, 185 releases in — found it exercises 4 record types and
// **zero** logs. `FEAT-022` declared the venture brain *"now complete"* at v0.65.0 and BOSS has
// never written one. `/extract` encodes **PRINCIPLE #1**, the UP/DOWN router that defines what
// BOSS *is*, and has produced **zero** records in 156 releases.
//
// This is the same disease as the backlog drift and the missing changelog entry, one level up:
// **BOSS instructs, and nothing verifies the instruction was followed.** A capability nobody has
// ever run is not shipped, it is published — and the difference shows up the first time a founder
// runs it and hits something the author would have caught in five minutes of use.
//
// WHAT IT ENFORCES, and what it deliberately does not. Every artifact a shipped capability tells
// someone to write is classified `exercised`, `exempt` (with a reason) or `owed` (with a reason).
// **Unclassified fails.** `owed` does NOT fail — a gate that is red forever is a gate you bypass,
// and a bypassed gate is a dead one (the exact way the last three checkers died here). `owed` is
// counted and printed on every release until someone acts, which is the most a checker can
// honestly do about work that requires a human to go and do it.
//
// The forcing function is the same one `check:ladder` provides for the surface ladder: a new
// artifact-writing capability cannot ship without someone deciding which of the three it is.
//
// Zero-dep by rule. `--strict` is accepted for symmetry; unclassified already fails.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = join(ROOT, 'registry', 'dogfood.json');

if (!existsSync(LEDGER)) {
  console.error('\n  registry/dogfood.json is missing — the ledger this check reads.\n');
  process.exit(1);
}

let ledger;
try {
  ledger = JSON.parse(readFileSync(LEDGER, 'utf8'));
} catch (e) {
  // Loudly, on purpose. v0.179.0's readLadder() swallowed a parse error and silently disabled
  // artifact-awareness across two commands; the only symptom was two lines quietly not printing.
  console.error(`\n  registry/dogfood.json does not parse: ${e.message}\n`);
  process.exit(1);
}

const VERDICTS = new Set(['exercised', 'exempt', 'owed']);
const rows = Array.isArray(ledger.artifacts) ? ledger.artifacts : [];
const problems = [];
const owed = [];
const drifted = [];

for (const r of rows) {
  if (!r.path) { problems.push(['(no path)', 'entry has no `path`']); continue; }
  if (!VERDICTS.has(r.verdict)) {
    problems.push([r.path, `verdict "${r.verdict}" — must be one of: ${[...VERDICTS].join(' | ')}`]);
    continue;
  }
  // A reason that is absent, or so short it was inherited rather than re-read. v0.178.0's
  // boundary ledger caught its own entries reading "Ships at L2." on first run.
  if (r.verdict !== 'exercised' && (!r.why || r.why.trim().length < 40)) {
    problems.push([r.path, `verdict "${r.verdict}" needs a reason someone can disagree with (got ${r.why ? `${r.why.trim().length} chars` : 'none'})`]);
    continue;
  }
  // The ledger is a claim about the repo, so check it against the repo — the same rule
  // `boss records` applies to every idea's `proof:`. A glob-shaped path (`docs/rfcs/RFC-NNN`)
  // names a convention rather than a file and is checked as a directory.
  const p = r.path.replace(/\/[A-Z]{3,4}-NNN$/, '');
  const there = existsSync(join(ROOT, p));
  if (r.verdict === 'exercised' && !there) {
    drifted.push([r.path, 'marked `exercised` and it is not there — BOSS stopped running its own capability']);
  }
  if (r.verdict === 'owed' && there) {
    drifted.push([r.path, 'marked `owed` and it EXISTS — BOSS started doing this; update the ledger']);
  }
  if (r.verdict === 'owed') owed.push(r);
}

const exercised = rows.filter((r) => r.verdict === 'exercised').length;
const exempt = rows.filter((r) => r.verdict === 'exempt').length;

console.log(`\nBOSS · dogfood coverage — ${rows.length} shipped artifacts\n`);

if (problems.length || drifted.length) {
  if (problems.length) {
    console.log(`  UNCLASSIFIED OR UNJUSTIFIED — ${problems.length}`);
    console.log('  Every artifact a shipped capability writes must be exercised, exempt, or owed.');
    for (const [a, b] of problems) console.log(`      ${a}\n        -> ${b}`);
    console.log('');
  }
  if (drifted.length) {
    console.log(`  THE LEDGER DISAGREES WITH THE REPO — ${drifted.length}`);
    console.log('  The ledger is a claim about this repo, checked against this repo.');
    for (const [a, b] of drifted) console.log(`      ${a}\n        -> ${b}`);
    console.log('');
  }
  console.log(`  ${problems.length + drifted.length} total. Exit 1.\n`);
  process.exit(1);
}

console.log(`  ${exercised} exercised · ${exempt} exempt (with a reason) · ${owed.length} owed\n`);

if (owed.length) {
  console.log('  OWED — applies to BOSS, and BOSS has never done it:');
  for (const r of owed) console.log(`      ${r.path}\n        ${r.capability}`);
  console.log('');
  console.log('  These do not fail the gate: a gate that is red forever is a gate you bypass.');
  console.log('  They print every release instead. A capability nobody has ever run is not');
  console.log('  shipped, it is published — and the gap shows up first in a founder\'s project.\n');
} else {
  console.log('  BOSS runs everything it ships, or has said why not.\n');
}
process.exit(0);
