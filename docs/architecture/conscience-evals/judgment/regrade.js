#!/usr/bin/env node
// Conscience JUDGMENT eval — re-grade half (v0.35.0). PAID, OUT-OF-BAND. ZERO-DEP.
//
// The calibrator. For each judgment case it runs the LIVE model twice —
//   1. DECISION: give the model the exact voice frame the hook injects + the
//      bounded read the instruction names + a neutral "founder keeps building"
//      turn. Capture: fire a nudge, or stay silent?
//   2. JUDGE: a second call grades that nudge against the case's rubric
//      (must_reference / must_not), returning a small structured verdict.
// — then writes transcripts/<moment>/<id>.json STAMPED with the current
// voice-hash (shared with replay.js via moments.js, so they can't disagree).
// replay.js then grades the recorded decision against the human label on every
// commit (free) and trips STALE when the frame or the model changes.
//
// This is also the RECALIBRATION ENGINE (IDEA-014): re-run it on a new model and
// the transcripts refresh; replay shows what changed. Riding the model curve =
// running this when the curve moves.
//
// ZERO-DEP: Node built-in `fetch` POSTs to the Anthropic API directly (no SDK).
// Never on the commit path; never imported by src/; never in the npm `files`
// allowlist (lives under docs/, which doesn't ship).
//
// Usage:
//   ANTHROPIC_API_KEY=… node regrade.js            # grade all moments, write transcripts
//   ANTHROPIC_API_KEY=… node regrade.js drift      # grade one moment
//   node regrade.js --dry-run                       # verify the pipeline, no API, no spend
//   BOSS_REGRADE_MODEL=claude-… node regrade.js     # override the model (default: opus 4.8)

import { readFileSync, writeFileSync, mkdirSync, existsSync, realpathSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseYaml } from '../lib/yaml-eval.js';
import { voiceFrame, voiceHash } from './moments.js';
import { DEVLOG_FIXTURES } from './fixtures-devlog.js';
import { CAPTURELOG_FIXTURES } from './fixtures-capturelog.js';
import { EXTRACT_DEVLOG_FIXTURES } from './fixtures-devlog-extract.js';
import { SUSTAINING_DEVLOGS } from './fixtures-sustaining.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const MOMENT_FILTER = argv.find((a) => !a.startsWith('--')) || null;
const MODEL = process.env.BOSS_REGRADE_MODEL || 'claude-opus-4-8';
const API_KEY = process.env.ANTHROPIC_API_KEY || null;

// Keep the last ~5 dated entries from a fixture (the bounded read the drift /
// caution instructions name — never the whole project).
function lastEntries(text, headerRe, n = 5) {
  const lines = String(text || '').split('\n');
  const starts = [];
  lines.forEach((l, i) => { if (headerRe.test(l)) starts.push(i); });
  if (!starts.length) return String(text || '').trim();
  const keep = starts.slice(0, n); // fixtures are newest-first
  const lastKeep = keep[keep.length - 1];
  // include through the line before the (n+1)th header, or EOF
  const end = starts[n] !== undefined ? starts[n] : lines.length;
  return lines.slice(starts[0], end).join('\n').trim();
}

// Per-moment: assemble the bounded read the model is told to look at.
export const MOMENTS = {
  drift: {
    casesFile: 'drift.judgment.yml',
    boundedRead(c) {
      const idea = c.project_state.ideas[0];
      const risk = idea.canvas.riskiest_assumption_text;
      const ref = c.project_state.docs_files.find((f) => f.path === 'docs/devlog.md').content_ref;
      const dev = lastEntries(DEVLOG_FIXTURES[ref], /^## \d{4}-\d{2}-\d{2}/);
      return `The canvas names this riskiest assumption:\n  "${risk}"\n\nThe ~5 most recent devlog entries:\n${dev}\n\n(No "Experiment this week" validation plan is recorded yet.)`;
    },
  },
  caution: {
    casesFile: 'caution.judgment.yml',
    boundedRead(c) {
      const idea = c.project_state.ideas[0];
      const cap = CAPTURELOG_FIXTURES[idea.capture_log_ref];
      return `The active idea's capture log (no riskiest assumption named yet):\n${String(cap).trim()}`;
    },
  },
  capture: {
    casesFile: 'capture.judgment.yml',
    boundedRead(c) {
      const dev = lastEntries(EXTRACT_DEVLOG_FIXTURES[c.project_state.devlog_ref], /^## \d{4}-\d{2}-\d{2}/);
      return `The ~5 most recent devlog entries (no extraction decision recorded yet):\n${dev}`;
    },
  },
  // The gateless moment (IDEA-039): no project_state to materialize — the read
  // surface is the `context` (the founder's situation + this turn + any prior
  // consent on the concern). That IS the bounded read.
  humane: {
    casesFile: 'humane.judgment.yml',
    boundedRead(c) {
      const ctx = c.context || {};
      const consent = ctx.prior_consent && ctx.prior_consent !== 'none'
        ? `\n\nPrior consent on this concern: ${ctx.prior_consent}`
        : '';
      return `What the founder is building / doing:\n${ctx.situation}\n\nThis turn:\n${ctx.asking || '(continuing to build)'}${consent}`;
    },
  },
  // sustaining (v0.208.0). Context-shaped like `humane` rather than project_state-shaped:
  // the bounded read the frame instructs is the Business Model cell plus the last few
  // devlog entries, and nothing else. The devlog entries carry DATES on purpose — computing
  // the elapsed time is always possible, and stating it is banned in every case. A ban is
  // only a real test when the banned thing was within reach.
  sustaining: {
    casesFile: 'sustaining.judgment.yml',
    boundedRead(c) {
      const ctx = c.context || {};
      const prior = ctx.prior_firing ? `\n\nActivity ledger (.boss/conscience-log.jsonl): ${ctx.prior_firing}` : '';
      return `The canvas's Business Model cell says:\n  "${ctx.business_model_cell}"\n\nThe most recent devlog entries:\n${String(SUSTAINING_DEVLOGS[ctx.devlog_ref] || '').trim()}\n\nToday is ${ctx.today}.${prior}`;
    },
  },
};

// ---- the two model calls ---------------------------------------------------

async function callClaude(system, user, maxTokens) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}

export function decisionPrompts(moment, c) {
  // The humane moment is gateless — there is no "neutral prompt" framing; the
  // founder is actively in the work below, and the model must judge it.
  const turn = moment === 'humane'
    ? `The founder is in the middle of the work described below. Per the instruction above, decide whether to surface a humane nudge now.`
    : `The founder has just submitted a neutral "let's keep building" prompt. Per the instruction above, decide whether to surface a nudge.`;
  const system = `You are BOSS's conscience, operating as a UserPromptSubmit hook signal. Follow this instruction exactly:\n\n${voiceFrame(moment)}\n\n${turn} Output ONLY the nudge text you would surface, OR — if you would stay silent — output ONLY the single token: SILENT`;
  return { system, user: MOMENTS[moment].boundedRead(c) };
}

export function judgePrompts(c, fires, nudge) {
  const ej = c.expected_judgment || {};
  const expected = Array.isArray(ej.acceptable)
    ? `Either firing or silence is acceptable here.`
    : `The correct decision is to ${ej.fires ? 'FIRE a nudge' : 'stay SILENT'}.`;
  const ref = (ej.must_reference || []).map((x) => `- ${x}`).join('\n') || '(none)';
  const not = (ej.must_not || []).map((x) => `- ${x}`).join('\n') || '(none)';
  const system = `You grade a conscience nudge against a rubric. Output ONLY minified JSON, no prose: {"names_specific_gap":boolean,"references_required":boolean,"violates_must_not":boolean,"verdict":"pass"|"fail"}`;
  const user = `${expected}\nThe conscience ${fires ? 'FIRED this nudge' : 'stayed SILENT'}.\nNudge text: ${fires ? JSON.stringify(nudge) : '(silent)'}\n\nMust reference (if it fired):\n${ref}\n\nMust NOT do:\n${not}\n\nGrade: verdict "pass" iff the decision matches the correct one AND (if fired) it references the required points and violates none of the must-nots. If silence was correct and it stayed silent, pass.`;
  return { system, user };
}

export function parseJudge(text) {
  try {
    const m = String(text).match(/\{[\s\S]*\}/);
    if (!m) return { verdict: 'fail', parse_error: true };
    const j = JSON.parse(m[0]);
    if (j.verdict !== 'pass' && j.verdict !== 'fail') j.verdict = 'fail';
    return j;
  } catch { return { verdict: 'fail', parse_error: true }; }
}

// ---- run -------------------------------------------------------------------

export function loadCases(moment) {
  return parseYaml(readFileSync(join(__dirname, MOMENTS[moment].casesFile), 'utf8'));
}

async function regradeMoment(moment) {
  const cases = loadCases(moment);
  const hash = voiceHash(moment);
  const outDir = join(__dirname, 'transcripts', moment);
  if (!DRY) mkdirSync(outDir, { recursive: true });
  console.log(`\n  ── ${moment} ── ${cases.length} cases · model ${MODEL} · hash ${hash.slice(0, 12)}…`);

  let written = 0, mismatches = 0;
  for (const c of cases) {
    const dp = decisionPrompts(moment, c);
    const jpPreview = c; // assembled below after decision
    if (DRY) {
      // Verify assembly only — touch every fixture/ref so a broken case throws here, not in prod.
      MOMENTS[moment].boundedRead(c);
      judgePrompts(c, true, 'sample nudge');
      continue;
    }
    try {
      const decision = await callClaude(dp.system, dp.user, 600);
      const fires = !/^\s*SILENT\s*$/i.test(decision);
      const nudge = fires ? decision : '';
      const jp = judgePrompts(c, fires, nudge);
      const judge = parseJudge(await callClaude(jp.system, jp.user, 200));

      const ej = c.expected_judgment || {};
      const labelMatch = Array.isArray(ej.acceptable)
        ? ej.acceptable.includes(fires ? 'fires' : 'silent')
        : fires === ej.fires;
      if (!labelMatch) mismatches++;

      writeFileSync(join(outDir, `${c.id}.json`), JSON.stringify({
        recorded_against_voice_hash: hash,
        model: MODEL,
        recorded_at: new Date().toISOString(),
        decision: fires ? 'fires' : 'silent',
        named_gap: !!judge.names_specific_gap,
        judge_verdict: judge.verdict,
        label_match: labelMatch,
        nudge_excerpt: nudge.slice(0, 200),
      }, null, 2) + '\n');
      written++;
      console.log(`    ${labelMatch ? '✓' : '✗'} ${c.id}  decided=${fires ? 'fire' : 'silent'}  judge=${judge.verdict}`);
    } catch (e) {
      console.log(`    ! ${c.id}  ${e.message}`);
    }
  }
  return { written, mismatches, total: cases.length };
}

async function main() {
  const moments = Object.keys(MOMENTS).filter((m) => !MOMENT_FILTER || m === MOMENT_FILTER);

  if (DRY) {
    console.log(`\n  conscience JUDGMENT re-grade — DRY RUN (no API, no spend)`);
    let n = 0;
    for (const m of moments) {
      const cases = loadCases(m);
      for (const c of cases) { MOMENTS[m].boundedRead(c); judgePrompts(c, true, 'x'); decisionPrompts(m, c); n++; }
      console.log(`    ✓ ${m}: ${cases.length} cases assemble (bounded read + decision + judge prompts) cleanly`);
    }
    // Parser check against a canned model response — verifies the risky parse path.
    const probe = parseJudge('thinking... {"names_specific_gap":true,"references_required":true,"violates_must_not":false,"verdict":"pass"}');
    console.log(`    ✓ judge parser: verdict=${probe.verdict} names_gap=${probe.names_specific_gap}`);
    // Show one full prompt pair so the assembly is eyeballable.
    const sample = decisionPrompts(moments[0], loadCases(moments[0])[0]);
    console.log(`\n  sample DECISION prompt (${moments[0]}, first case):`);
    console.log(`  ─ system (head) ─ ${sample.system.slice(0, 140).replace(/\n/g, ' ')}…`);
    console.log(`  ─ user ─\n${sample.user.split('\n').map((l) => '    ' + l).join('\n')}`);
    console.log(`\n  ${n} cases verified. Set ANTHROPIC_API_KEY and drop --dry-run to grade for real.\n`);
    return;
  }

  if (!API_KEY) {
    console.log(`\n  conscience JUDGMENT re-grade — PAID, OUT-OF-BAND`);
    console.log(`  ANTHROPIC_API_KEY not set. You don't need it — prefer the KEYLESS path:`);
    console.log(`    • /regrade  (skill)             grade via in-session subagents — no key, no credits`);
    console.log(`    • node regrade-keyless.js       the machine surface the skill drives`);
    console.log(`  Or, if you have credits and want the out-of-band paid path:`);
    console.log(`    • node regrade.js --dry-run     verify the pipeline (no spend), or`);
    console.log(`    • ANTHROPIC_API_KEY=… node regrade.js   grade for real.`);
    console.log(`  replay.js holds the line meanwhile (well-formedness + coverage + tripwire).\n`);
    process.exit(0);
  }

  console.log(`\n  conscience JUDGMENT re-grade — LIVE · model ${MODEL}`);
  let totW = 0, totM = 0, tot = 0;
  for (const m of moments) {
    const r = await regradeMoment(m);
    totW += r.written; totM += r.mismatches; tot += r.total;
  }
  console.log(`\n  ── summary ──`);
  console.log(`    transcripts written: ${totW}/${tot}`);
  console.log(`    label mismatches:    ${totM}  ${totM ? '(the model disagreed with a human label — investigate: model drift, or the label is wrong)' : '(model agrees with every label)'}`);
  console.log(`\n  Transcripts stay LOCAL (DEC-013) — they carry a voice-hash and go STALE when a`);
  console.log(`  frame is edited, so they are not tracked. replay.js grades against them here.\n`);
}

// Only auto-run when invoked directly (`node regrade.js` / `npm run regrade`).
// Importing this module (e.g. to reuse decisionPrompts/MOMENTS) must NOT spend.
const invokedDirectly = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((e) => { console.error(`regrade failed: ${e.message}`); process.exit(1); });
}
