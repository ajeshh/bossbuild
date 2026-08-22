#!/usr/bin/env node
// Conscience JUDGMENT re-grade — KEYLESS path (IDEA: keyless-judgment-regrade).
// ZERO-DEP. NO API KEY. NO CREDITS.
//
// regrade.js is the PAID, out-of-band calibrator: it POSTs to the Anthropic API,
// so it needs ANTHROPIC_API_KEY and burns credits. This runner does the same job
// through the model you're ALREADY talking to — Claude Code in-session subagents.
// It never touches the network and never asks for a key.
//
// It is not self-driving: it can't spawn subagents by itself. The `/regrade`
// skill (docs/architecture/conscience-evals/judgment + .claude/skills/regrade)
// drives it. The three commands below are the machine surface that skill uses:
//
//   1. node regrade-keyless.js emit [moment]
//        → JSON { cases: [{ moment, id, system, user }] }   (DECISION prompts)
//          Run each through a subagent. It returns the nudge text, or SILENT.
//
//   2. node regrade-keyless.js judge-prompts <decisionsFile> [moment]
//        → JSON { judges: [{ moment, id, system, user }] }   (JUDGE prompts)
//          Built from the recorded decisions. Run each through a SECOND, independent
//          subagent (the grader must not be the decider). It returns minified JSON.
//
//   3. node regrade-keyless.js write <decisionsFile> [judgesFile]
//        → writes transcripts/<moment>/<id>.json in the exact format replay.js
//          reads (same voice-hash stamping as regrade.js). Commit them; replay
//          grades against them free on every commit.
//
// decisionsFile schema (array): [{ moment, id, decision:"fires"|"silent", nudge:"…" }]
// judgesFile schema   (array): [{ moment, id, verdict:"pass"|"fail",
//                                 names_specific_gap?:bool, violates_must_not?:bool }]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { voiceHash } from './moments.js';
import { MOMENTS, decisionPrompts, judgePrompts, loadCases } from './regrade.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const cmd = argv[0];

const momentsFor = (filter) => Object.keys(MOMENTS).filter((m) => !filter || m === filter);
const die = (msg) => { console.error(msg); process.exit(1); };

// --- 1. emit decision prompts ----------------------------------------------
function emit(filter) {
  const cases = [];
  for (const moment of momentsFor(filter)) {
    for (const c of loadCases(moment)) {
      const dp = decisionPrompts(moment, c);
      cases.push({ moment, id: c.id, system: dp.system, user: dp.user });
    }
  }
  process.stdout.write(JSON.stringify({ cases }, null, 2) + '\n');
}

// --- 2. build judge prompts from recorded decisions ------------------------
function judgePromptsCmd(decisionsFile, filter) {
  if (!decisionsFile) die('usage: regrade-keyless.js judge-prompts <decisionsFile> [moment]');
  const decisions = JSON.parse(readFileSync(decisionsFile, 'utf8'));
  const byKey = new Map(decisions.map((d) => [`${d.moment}/${d.id}`, d]));
  const judges = [];
  for (const moment of momentsFor(filter)) {
    for (const c of loadCases(moment)) {
      const d = byKey.get(`${moment}/${c.id}`);
      if (!d) continue; // no decision recorded for this case — skip
      const fires = d.decision === 'fires' || d.decision === true;
      const jp = judgePrompts(c, fires, fires ? (d.nudge || '') : '');
      judges.push({ moment, id: c.id, system: jp.system, user: jp.user });
    }
  }
  process.stdout.write(JSON.stringify({ judges }, null, 2) + '\n');
}

// --- 3. write replay-compatible transcripts --------------------------------
function write(decisionsFile, judgesFile) {
  if (!decisionsFile) die('usage: regrade-keyless.js write <decisionsFile> [judgesFile]');
  const decisions = JSON.parse(readFileSync(decisionsFile, 'utf8'));
  const judges = judgesFile ? JSON.parse(readFileSync(judgesFile, 'utf8')) : [];
  const judgeByKey = new Map(judges.map((j) => [`${j.moment}/${j.id}`, j]));

  // Index cases so we can compute label_match against the human label.
  const caseByKey = new Map();
  for (const moment of Object.keys(MOMENTS))
    for (const c of loadCases(moment)) caseByKey.set(`${moment}/${c.id}`, c);

  const now = new Date().toISOString();
  const perMoment = {};
  let written = 0, mismatches = 0;

  for (const d of decisions) {
    const key = `${d.moment}/${d.id}`;
    const c = caseByKey.get(key);
    if (!c) { console.warn(`  ! unknown case ${key} — skipped`); continue; }
    const fires = d.decision === 'fires' || d.decision === true;
    const j = judgeByKey.get(key) || {};

    const ej = c.expected_judgment || {};
    const labelMatch = Array.isArray(ej.acceptable)
      ? ej.acceptable.includes(fires ? 'fires' : 'silent')
      : fires === ej.fires;
    if (!labelMatch) mismatches++;

    const outDir = join(__dirname, 'transcripts', d.moment);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${d.id}.json`), JSON.stringify({
      recorded_against_voice_hash: voiceHash(d.moment),
      model: 'claude-code-subagent (keyless)',
      recorded_at: now,
      decision: fires ? 'fires' : 'silent',
      named_gap: !!j.names_specific_gap,
      judge_verdict: j.verdict || 'unjudged',
      label_match: labelMatch,
      nudge_excerpt: String(d.nudge || '').slice(0, 200),
    }, null, 2) + '\n');
    written++;
    perMoment[d.moment] = (perMoment[d.moment] || 0) + 1;
  }

  console.log(`\n  keyless re-grade — transcripts written: ${written}`);
  for (const [m, n] of Object.entries(perMoment)) console.log(`    ${m}: ${n}`);
  console.log(`    label mismatches: ${mismatches}  ${mismatches ? '(model disagreed with a human label — investigate)' : '(model agrees with every label)'}`);
  console.log(`\n  Commit the transcripts; replay.js grades against them every commit.\n`);
}

switch (cmd) {
  case 'emit': emit(argv[1] || null); break;
  case 'judge-prompts': judgePromptsCmd(argv[1], argv[2] || null); break;
  case 'write': write(argv[1], argv[2] || null); break;
  default:
    die(`conscience JUDGMENT re-grade — KEYLESS (no API key, no credits)\n\n` +
        `  node regrade-keyless.js emit [moment]                     decision prompts → JSON\n` +
        `  node regrade-keyless.js judge-prompts <decisions> [moment]  judge prompts → JSON\n` +
        `  node regrade-keyless.js write <decisions> [judges]         write transcripts\n\n` +
        `  Driven by the /regrade skill. See judgment/README.md.`);
}
