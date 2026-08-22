#!/usr/bin/env node
// Conscience eval runner — zero-dep Node.
//
// Loads moment-1-caution.yml + moment-2-done.yml, constructs synthetic
// project state in a temp dir per example, invokes the conscience hook,
// parses its output, asserts against expected_detection.
//
// Spec: ./README.md, ../../loops/eval.md
//
// Usage:   node docs/architecture/conscience-evals/runner.js
//          (from anywhere — script resolves repo root from its own location)
//
// Exit: 0 if all non-skipped cases pass; 1 otherwise.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, cpSync, readdirSync, utimesSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { parseYaml, reconcileCases } from './lib/yaml-eval.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const HOOK_DIR = join(REPO_ROOT, 'stages/L0-quickstart/template/.claude/hooks');
const HOOK = join(HOOK_DIR, 'conscience.js');
// Load loops from both Quickstart AND MVP — the eval suite covers moments
// emitted by loops at either stage. The hook reads `docs/loops/*.md` from the
// project; both stages' loops coexist post-`boss unlock mvp`.
const LOOPS_DIRS = [
  join(REPO_ROOT, 'stages/L0-quickstart/template/docs/loops'),
  join(REPO_ROOT, 'stages/L1-mvp/template/docs/loops'),
];

// YAML parsing moved to ./lib/yaml-eval.js (v0.32.0) so judgment/replay.js
// can parse the same eval-file subset without duplicating the parser.

// ---------------------------------------------------------------------------
// Fixtures — synthetic file contents referenced by eval YAML via { fixture: <name> }.
// The minimal YAML parser doesn't support multi-line scalars, so multi-line file
// content lives here, keyed by name. v0.27.0+ (when cost / failure-mode / coherence
// evals landed and needed arbitrary src/ + docs/ state).
// ---------------------------------------------------------------------------

const FIXTURES = {
  // LLM SDK call sites — each fires the entry predicate of cost-budget-loop AND
  // ai-failure-state-loop (they share entry — both failure modes coexist at the
  // first call). Use *_with_logger / *_with_handler variants to isolate one of
  // the two loops in a single test.
  anthropic_call:
    `import Anthropic from '@anthropic-ai/sdk';\nconst client = new Anthropic();\nexport async function ask(t) {\n  return client.messages.create({ model: 'claude-haiku-4-5', max_tokens: 64, messages: [{ role: 'user', content: t }] });\n}\n`,
  openai_call:
    `import OpenAI from 'openai';\nconst client = new OpenAI();\nexport async function ask(t) {\n  return client.chat.completions.create({ model: 'gpt-5-mini', messages: [{ role: 'user', content: t }] });\n}\n`,
  vercel_ai_call:
    `import { generateText } from 'ai';\nexport async function ask(t) {\n  return generateText({ model: 'x', prompt: t });\n}\n`,
  vercel_ai_stream:
    `import { streamText } from 'ai';\nexport async function ask(t) {\n  return streamText({ model: 'x', prompt: t });\n}\n`,
  no_llm_code:
    `export function add(a, b) { return a + b; }\nexport const SAFE = true;\n`,

  // Cost-budget-loop EXIT artifacts. Pair budget_doc + cost_logger_ref to close cost.
  cost_budget_doc:
    `---\nid: ai-cost-budget\ntype: budget\nowner: pm\nstatus: declared\nupdated: 2026-05-24\n---\n# AI cost budget\n- Per user, per day: $5\n`,
  cost_logger_ref:
    `import { logCall } from './ai-cost-logger';\nexport async function wrapped(t) {\n  const r = await callModel(t);\n  logCall({ feat: 'FEAT-001', model: 'x', inputTokens: 0, outputTokens: 0 });\n  return r;\n}\n`,

  // Evidence ledger fixtures (IDEA-045, v0.98). EVID-NNN files under docs/evidence/.
  // These do NOT affect DETECTION (the gate is predicate-only) — they exist to prove
  // the drift/caution gate stays byte-identical when a project has accumulated
  // evidence. The voicing SHARPENING they induce (specific when stated-pain-only,
  // quieter when commitment exists) is judgment-layer, covered by judgment/.
  evid_stated_pain:
    `---\nid: EVID-001\ntype: evidence\nowner: "@you"\nstatus: active\ndate: 2026-06-30\nsource: coffee chat, ops lead at a mid-market SaaS\nmethod: interview\ngrade: stated-pain\nassumption: teams will switch from spreadsheets for weekly planning\n---\n# EVID-001 — she said the spreadsheet is "a nightmare every Monday"\nShe complained about it unprompted. No sign she's tried alternatives; no ask made yet.\n`,
  evid_commitment:
    `---\nid: EVID-002\ntype: evidence\nowner: "@you"\nstatus: active\ndate: 2026-07-01\nsource: same ops lead\nmethod: commitment-test\ngrade: commitment\nassumption: teams will switch from spreadsheets for weekly planning\n---\n# EVID-002 — she booked a 30-min pilot call and looped in her manager\nGave up a calendar slot and her manager's time — a real cost, not a compliment.\n`,

  // Failure-state-loop EXIT artifacts. Pair failure_states_doc + failure_handlers_ref to close failure-mode.
  failure_states_doc:
    `---\nid: ai-failure-states\ntype: design-decisions\nowner: pm\nstatus: declared\nupdated: 2026-05-24\n---\n# AI failure states\n## 1. Garbage output\n## 2. Refusal\n`,
  failure_handlers_ref:
    `export function handleGarbageResponse(raw) { return null; }\nexport function handleRefusal(t) { return null; }\nexport function handleHallucination() { return null; }\n`,

  // Design-tokens-loop ENTRY — style declarations. The loop's entry threshold
  // is min: 3 across src/**. _low has exactly 3 matches; _high has 11+ for
  // high-confidence assertions.
  style_decls_low:
    `import React from 'react';\nexport const A = () => <div className="foo">a</div>;\nexport const B = () => <div className="bar">b</div>;\nexport const C = () => <div className="baz">c</div>;\n`,
  style_decls_high:
    `import React from 'react';\n` +
    `export const A = () => <div className="a">a</div>;\n`.repeat(12),
  style_decls_two:
    `import React from 'react';\nexport const A = () => <div className="foo">a</div>;\nexport const B = () => <div className="bar">b</div>;\n`,
  style_styled_components:
    `import styled from 'styled-components';\nconst A = styled.div\`color: red\`;\nconst B = styled.div\`color: blue\`;\nconst C = styled.div\`color: green\`;\n`,
  style_inline_objects:
    `import React from 'react';\nexport const A = () => <div style={{color: 'red'}}>a</div>;\nexport const B = () => <div style={{color: 'blue'}}>b</div>;\nexport const C = () => <div style={{color: 'green'}}>c</div>;\n`,

  // Design-tokens-loop EXIT artifacts.
  design_tokens_doc:
    `---\nid: design-tokens\ntype: design\nowner: pm\nstatus: declared\nupdated: 2026-05-24\n---\n# Design tokens\n`,
  token_refs:
    `import { token } from './tokens';\nexport const color = token.primary;\nexport const space = \`var(--space-2)\`;\nexport const bg = colors.background;\n`,

  // Empty file (for cases that test "file exists but empty").
  empty: '',

  // Devlog fixtures (v0.29 — extraction-loop entry signal is ≥3 dated entries).
  devlog_3_entries:
    `---\nid: DEVLOG\ntype: devlog\nowner: pm\nstatus: active\n---\n\n# Devlog\n\n## 2026-05-22\n- Landed: scaffold the CLI shape.\n- Next: wire the first FEAT.\n\n## 2026-05-21\n- Landed: PRD captured as IDEA-001.\n- Next: pretotype the demand assumption.\n\n## 2026-05-20\n- Landed: project scaffolded.\n- Next: capture the rough idea.\n`,
  devlog_2_entries:
    `---\nid: DEVLOG\ntype: devlog\nowner: pm\nstatus: active\n---\n\n# Devlog\n\n## 2026-05-22\n- Landed: scaffold.\n\n## 2026-05-21\n- Landed: PRD.\n`,
  devlog_5_entries:
    `---\nid: DEVLOG\ntype: devlog\nowner: pm\nstatus: active\n---\n\n# Devlog\n\n## 2026-05-24\n- Landed: FEAT-002 shipped.\n\n## 2026-05-23\n- Landed: smoke gate green.\n\n## 2026-05-22\n- Landed: spec written.\n\n## 2026-05-21\n- Landed: canvas closed.\n\n## 2026-05-20\n- Landed: scaffold.\n`,

  // verification-loop fixtures (v0.168 — moment `unverified`). A FEAT's `status:` line
  // must be a REAL newline for the `^status:` multiline predicate to match, which is
  // exactly why these live here and not inline in the YAML.
  feat_shipped:
    `---\nid: FEAT-001\ntype: feature\nowner: pm\nstatus: shipped\n---\n\n# FEAT-001 — signup\n\n## Acceptance criteria\n- A new user can create an account with an email and a password.\n- A duplicate email is rejected with a visible message.\n`,
  feat_shipped_2:
    `---\nid: FEAT-002\ntype: feature\nowner: pm\nstatus: shipped\n---\n\n# FEAT-002 — login\n\n## Acceptance criteria\n- An existing user can sign in and land on their dashboard.\n`,
  feat_done:
    `---\nid: FEAT-004\ntype: feature\nowner: pm\nstatus: done\n---\n\n# FEAT-004 — billing\n\n## Acceptance criteria\n- A user can add a card and see the charge on their receipt.\n`,
  feat_building:
    `---\nid: FEAT-001\ntype: feature\nowner: pm\nstatus: building\n---\n\n# FEAT-001 — signup\n\n## Acceptance criteria\n- A new user can create an account with an email and a password.\n`,
  smoke_config:
    `{ "command": "npm run smoke", "configuredAt": "2026-08-20T00:00:00.000Z" }\n`,

  // Rung-4 fixtures (v0.179.0 — verification-loop's guarded second exit). The GUARD reads
  // the FEAT: only a record that names a negative path turns rung 4 on. `feat_shipped`
  // above deliberately has no Paths section, which is what keeps every pre-v0.178 case
  // byte-identical — the guard is unmet there, so the second exit is vacuously satisfied.
  feat_shipped_negative_path:
    `---\nid: FEAT-005\ntype: feature\nowner: pm\nstatus: shipped\n---\n\n# FEAT-005 — order history\n\n## Acceptance criteria\n- A signed-in user sees their own past orders, newest first.\n\n## Paths that must not break\n- **Money path:** checkout completes and the order appears in history.\n- **Negative path:** user A must not be able to read user B's orders; RLS on \`orders\` keyed to \`tenant_id\`.\n`,
  // Same FEAT shape, negative-path line ABSENT — a single-user tool that answered honestly.
  feat_shipped_paths_no_negative:
    `---\nid: FEAT-006\ntype: feature\nowner: pm\nstatus: shipped\n---\n\n# FEAT-006 — export to CSV\n\n## Acceptance criteria\n- The user can download their own data as a CSV.\n\n## Paths that must not break\n- **Money path:** export is the paid tier's headline action.\n`,
  // A negative path on a FEAT still in `building` — a plan, not an exposure. The guard
  // requires shipped|done in the SAME file, mirroring the entry predicate's own logic.
  feat_building_negative_path:
    `---\nid: FEAT-007\ntype: feature\nowner: pm\nstatus: building\n---\n\n# FEAT-007 — shared workspaces\n\n## Acceptance criteria\n- A user can invite a teammate into a workspace.\n\n## Paths that must not break\n- **Negative path:** a member of workspace A must not read workspace B's documents.\n`,
  // The EXIT artifact: a red-team report that records a negative-path RESULT. The pattern
  // is deliberately loose (`Negative path`) — closing should be easy, opening should not.
  rt_negative_path_pass:
    `---\nid: RT-2026-08-20\ntype: red-team\nowner: pm\nstatus: recorded\n---\n\n# Red-team — 2026-08-20\n\n## Paths\n- **Money path:** pass — real Stripe test-mode checkout, order row written.\n- **Negative path:** pass — as user A, GET /api/orders/8812 (user B's) returned 403.\n`,
  // A red-team report that ran the secrets half only — no negative-path result. Proves the
  // exit pattern is a real assertion and not just "any RT file exists".
  rt_secrets_only:
    `---\nid: RT-2026-08-19\ntype: red-team\nowner: pm\nstatus: recorded\n---\n\n# Red-team — 2026-08-19\n\n## Pre-ship app-security\n- **Secrets in bundle:** pass — no keys in the client build.\n- **OWASP basics:** pass.\n`,
  app_source:
    `export function handler(req) {\n  return { status: 200, body: 'ok' };\n}\n`,

  // Cost-review record fixture (v0.30 — closes cost-review-loop).
  cost_review_record:
    `---\nid: REVIEW-2026-05-27\ntype: cost-review\nowner: pm\nstatus: recorded\ncreated: 2026-05-27\nwindow: last 7 days\n---\n\n# AI cost review — 2026-05-27\n\n## Headline\nOn-budget; one outlier worth investigating.\n\n## Numbers\n- **Window:** 2026-05-20 to 2026-05-27\n- **Total spend:** $12.34  (240 calls, 8 users, 3 FEATs)\n- **Per-user/day:** observed $0.22 (median) vs. declared $5.00 budget\n`,

  // Margin-trap-loop fixtures (v0.118 — JOB 4). The raw per-call ledger the /ai-cost
  // logger writes; the margin-trap entry needs it to EXIST (there's real cost-per-user
  // + a retry trail to read). No existing fixture creates .boss/cost-log.jsonl, so
  // requiring it keeps every prior case byte-identical — margin-trap never opens in them.
  cost_log_sample:
    `{"ts":"2026-07-18T14:02:11Z","feat":"FEAT-007","model":"claude-haiku-4-5","userId":"u_abc","input_tokens":1240,"output_tokens":89,"estimated_usd":0.0017}\n{"ts":"2026-07-18T14:05:44Z","feat":"FEAT-007","model":"claude-haiku-4-5","userId":"u_abc","input_tokens":1310,"output_tokens":74,"estimated_usd":0.0018}\n{"ts":"2026-07-18T14:09:02Z","feat":"FEAT-007","model":"claude-haiku-4-5","userId":"u_def","input_tokens":980,"output_tokens":120,"estimated_usd":0.0015}\n`,
  // A cost review that HAS looked at the margin — closes margin-trap (exit satisfied).
  cost_review_with_margin:
    `---\nid: REVIEW-2026-07-20\ntype: cost-review\nowner: pm\nstatus: recorded\ncreated: 2026-07-20\nwindow: last 7 days\n---\n\n# AI cost review — 2026-07-20\n\n## Numbers\n- **Total spend:** $41.20  (610 calls, 22 users, 2 FEATs)\n- **Gross margin:** ~57% at the current $12/mo price — heaviest users near break-even.\n`,
  // A cost review whose margin line uses the "% of revenue" phrasing — exercises the
  // exit pattern's OR breadth (proves the marker isn't hard-coded to "gross margin").
  cost_review_margin_pct:
    `---\nid: REVIEW-2026-07-21\ntype: cost-review\nowner: pm\nstatus: recorded\ncreated: 2026-07-21\nwindow: last 7 days\n---\n\n# AI cost review — 2026-07-21\n\n## Numbers\n- **Total spend:** $38.90  (540 calls, 20 users)\n- Per-active-user cost is ~9% of revenue this window; watching the power-user tail.\n`,

  // sustaining-loop fixtures (v0.206.0 — the commons half). Paired with `age_days:` on the
  // file spec, which is the only way to reach a `quiet_for` predicate from this harness.
  devlog_worked_then_stopped:
    `# Devlog\n\n- 2026-05-30 wired the importer\n- 2026-06-01 shipped it, tidied the README\n`,
  // A canvas answering the SECOND (non-revenue) branch of the Business Model cell — the
  // arrangement this moment exists to notice has quietly stopped being true.
  canvas_sustained_by_hours:
    `---\nid: canvas\ntype: canvas\n---\n\n# Canvas\n\n| Cell | Answer |\n|---|---|\n| **Business Model** | Not monetized. Sustained by me, a few hours a week, indefinitely. |\n`,
  // The same cell after the founder came back and revised it to what is actually true —
  // the outcome this moment wants, and therefore the thing that must silence it.
  canvas_sustained_revised:
    `---\nid: canvas\ntype: canvas\n---\n\n# Canvas\n\n| Cell | Answer |\n|---|---|\n| **Business Model** | Not monetized. A weekend a month, honestly — and that is fine. |\n`,

  // A git reflog line — `.git/logs/HEAD` is touched on EVERY commit, so it is the
  // stack-neutral answer to "has this repo seen any activity". See m-sust-107.
  git_reflog_line:
    `0000000000000000000000000000000000000000 4f2a1c9 Someone <s@example.com> 1755800000 +0000\tcommit (initial): first\n`,

  // Extraction-record fixtures.
  extraction_record_up:
    `---\nid: EXTR-001\ntype: extraction\nowner: pm\nstatus: recorded\ncreated: 2026-05-24\ntrigger: devlog-3-entries\n---\n\n# EXTR-001 — first extraction\n\n## Candidate 1: cohort-aware framing\n- **What it is:** the cohort branch pattern.\n- **Route:** UP\n- **Rationale:** stack-neutral; used in 4+ skills already.\n`,
  extraction_record_not_yet:
    `---\nid: EXTR-001\ntype: extraction\nowner: pm\nstatus: recorded\ncreated: 2026-05-24\ntrigger: devlog-3-entries\n---\n\n# EXTR-001 — pause and look\n\n## What didn't make the cut\nNothing load-bearing enough yet.\n- **Route:** NOT-YET (none of the candidates earned a route).\n`,

  // Founder-team fixtures (v0.84 — coordination-loop, IDEA-037 slice 5b).
  // team_config: a .boss/config.json with a cofounder on the roster — fires the
  // coordination entry's `"handle"` match. solo_config has an empty team (no match).
  team_config:
    `{\n  "github": "ask",\n  "team": [{ "handle": "@sam", "name": "Sam Rivera", "added": "2026-05-20" }]\n}\n`,
  solo_config:
    `{\n  "github": "ask",\n  "team": []\n}\n`,
  // dec_record: a recorded shared decision — satisfies the coordination EXIT
  // (`docs/decisions/DEC-*.md` with an `id: DEC-` line).
  dec_record:
    `---\nid: DEC-001\ntype: decision\nowner: "@ajeshh"\ndecided_by: founder\nstatus: decided\ncreated: 2026-05-22\nreversibility: costly\n---\n\n# DEC-001 — use SQLite for the MVP\n\n## Decision\nSQLite for now; revisit at real concurrent load.\n`,
};

function resolveFileContent(spec) {
  if (typeof spec.content === 'string') return spec.content;
  if (spec.fixture && Object.prototype.hasOwnProperty.call(FIXTURES, spec.fixture)) {
    return FIXTURES[spec.fixture];
  }
  return '';
}

// ---------------------------------------------------------------------------
// Project-state builder — materialize synthetic docs/ideas/ tree in temp dir.
// ---------------------------------------------------------------------------

function buildIdeaFile(idea, dates) {
  const lines = [
    '---',
    `id: ${idea.file.replace(/\.md$/, '')}`,
    `type: idea`,
    `owner: pm`,
    `status: ${idea.status || 'seedling'}`,
    'created: 2026-05-01',
    '---',
    '',
    `# ${idea.file}`,
    '',
    '## Current shape',
    '- **What:** synthetic test idea',
    '',
    '## Capture log',
  ];
  const n = idea.capture_log_entries || 0;
  const dateList = dates && dates.length === n
    ? dates
    : Array.from({ length: n }, (_, i) => `2026-05-${String(Math.min(22, i + 1)).padStart(2, '0')}`);
  for (let i = 0; i < n; i++) {
    lines.push(`- ${dateList[i]} — synthetic capture entry ${i + 1}`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildCanvasFile(ideaFile, canvas) {
  const baseName = ideaFile.replace(/\.md$/, '');
  const canvasFile = `${baseName}-canvas.md`;
  let raText = canvas.riskiest_assumption_text;
  // Honor the "missing line" case
  const hasLine = canvas.riskiest_assumption_line_present !== false;
  const body = [
    '---',
    `id: ${baseName}-canvas`,
    'type: canvas',
    'owner: pm',
    'status: drafting',
    'version: 0.1',
    'updated: 2026-05-22',
    '---',
    '',
    `# Humane Product Canvas — ${baseName}`,
    '',
    '## 🎯 Incubation heartbeat',
  ];
  if (hasLine) {
    if (raText === undefined || raText === '') {
      body.push(`- **Riskiest assumption:** `);
    } else {
      body.push(`- **Riskiest assumption:** ${raText}`);
    }
  }
  // Experiment / validation-plan line (v0.31 — drift-loop's exit artifact).
  // Default: absent (legacy cases test the riskiest-assumption gate only). With
  // `experiment_text` it's a real plan (satisfies drift-loop's exit); with
  // `experiment_placeholder: true` it's the `_(...)_` stub (does NOT satisfy exit).
  if (canvas.experiment_text !== undefined && canvas.experiment_text !== '') {
    body.push(`- **Experiment this week:** ${canvas.experiment_text}`);
  } else if (canvas.experiment_placeholder) {
    body.push(`- **Experiment this week:** _(the smallest test to prove/disprove it)_`);
  }
  body.push('');
  return { file: canvasFile, body: body.join('\n') };
}

function buildProjectDir(example) {
  const tempBase = join(tmpdir(), `boss-evals-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  mkdirSync(tempBase, { recursive: true });

  // Copy loop specs so the v0.18+ generic runtime can read them at hook time.
  // The runtime expects docs/loops/*.md in the project root. v0.27.0+: load
  // from BOTH Quickstart and MVP so cost / failure-mode / coherence evals
  // (loops live in L1-mvp) can run alongside caution / done (loops in L0).
  const projectLoopsDir = join(tempBase, 'docs', 'loops');
  mkdirSync(projectLoopsDir, { recursive: true });
  for (const dir of LOOPS_DIRS) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.md')) cpSync(join(dir, f), join(projectLoopsDir, f));
    }
  }

  const state = example.project_state || {};
  // Honor the "dir doesn't exist" case
  if (state.ideas_dir_exists === false) {
    return tempBase;
  }

  const ideasDir = join(tempBase, 'docs', 'ideas');
  mkdirSync(ideasDir, { recursive: true });

  if (Array.isArray(state.ideas)) {
    for (const idea of state.ideas) {
      writeFileSync(join(ideasDir, idea.file), buildIdeaFile(idea, idea.capture_log_dates));
      if (idea.canvas && typeof idea.canvas === 'object') {
        const c = buildCanvasFile(idea.file, idea.canvas);
        writeFileSync(join(ideasDir, c.file), c.body);
      }
    }
  }

  // v0.27.0+: arbitrary file materialization for non-idea project state.
  // src_files / docs_files / other_files: lists of { path, fixture?, content? }
  // objects where `path` is project-relative. `fixture` references the FIXTURES
  // registry above; `content` is a raw one-line string. Used by cost / failure-
  // mode / coherence evals to materialize synthetic src/ + docs/ files.
  const fileGroups = ['src_files', 'docs_files', 'other_files'];
  for (const group of fileGroups) {
    if (!Array.isArray(state[group])) continue;
    for (const f of state[group]) {
      const target = join(tempBase, f.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, resolveFileContent(f));
      // `age_days` (v0.208.0) — backdate the file's mtime. Needed because the harness
      // materializes every fixture NOW, so a file is always zero days old, and the
      // `quiet_for` predicate (v0.206.0, `sustaining`) measures days since last change.
      // Without this the harness could not open that door AT ALL — it would have reported
      // a clean sweep on a moment it structurally could not reach, which is the failure
      // this whole eval surface exists to prevent. Any future time-based predicate needs it.
      if (f.age_days) {
        const when = new Date(Date.now() - f.age_days * 86400000);
        utimesSync(target, when, when);
      }
    }
  }

  return tempBase;
}

// ---------------------------------------------------------------------------
// Hook invocation
// ---------------------------------------------------------------------------

function runHook(projectDir) {
  try {
    const env = { ...process.env, CLAUDE_PROJECT_DIR: projectDir };
    // v0.18.0+: hook is Node-based; the runtime reads docs/loops/*.md in the
    // project to decide what to evaluate. Predecessor was `bash conscience.sh`.
    const out = execSync(`node "${HOOK}"`, { env, encoding: 'utf8' });
    return out.trim() ? JSON.parse(out) : { fires: false };
  } catch (e) {
    return { error: e.message };
  }
}

// Normalize the hook's output to a comparable shape: { fires, moment, ... }
// Current hook returns:
//   { hookSpecificOutput: { hookEventName, additionalContext } }
// (or nothing → fires:false)
// After refactor it will return: { hookSpecificOutput: { ..., moment, confidence, evidence, suppress_if } }
function normalizeHookOutput(raw) {
  if (!raw || raw.error) return { fires: false, error: raw?.error };
  const out = raw.hookSpecificOutput;
  if (!out) return { fires: false };
  const signals = Array.isArray(out.signals) ? out.signals : [];
  const moments = signals.map((s) => s.moment).filter(Boolean);
  return {
    fires: true,
    moment: out.moment || (out.additionalContext?.includes('validation drift') ? 'caution' : 'unknown'),
    moments, // v0.27.0+: full list, used by multi-moment assertions
    confidence: out.confidence,
    evidence: out.evidence,
    suppress_if: out.suppress_if || [],
    signals,
  };
}

// ---------------------------------------------------------------------------
// Assertion
// ---------------------------------------------------------------------------

const SKIP_FEATURES = new Set([
  // Examples that test features not yet implemented in the hook
  'signal_text_violation',  // moment-2 signal-language eval — separate runner
  'user_in_unrelated_work', // suppress_if requires user-prompt awareness
  'recently_fired_in_session',
  'state_unchanged_since_last_fire',
  'acknowledged_in_devlog',
  'canvas_actively_being_edited',
  'single_session_brainstorm',
  // single_idea_deepening (m1-snf-021): no predicate can make the depth-vs-avoidance
  // call, so the GATE skips it. RESOLVED in v0.33 — covered by the judgment surface
  // (judgment/caution.judgment.yml). Stays skipped here by design, not by omission.
  'single_idea_deepening',
]);

function shouldSkip(example) {
  const exp = example.expected_detection || {};
  if (exp.signal_text_violation) return 'signal-text eval (separate runner)';
  if (Array.isArray(exp.suppress_if) && exp.suppress_if.length > 0) {
    const unimplemented = exp.suppress_if.filter((s) => SKIP_FEATURES.has(s));
    if (unimplemented.length) return `suppress_if not yet implemented: ${unimplemented.join(', ')}`;
  }
  // Moment-2 has no hook detector today; everything is skipped pending /canvas skill behavior testing.
  if (exp.moment === 'done') return 'moment-2 lives in /canvas skill prompt, not the hook';
  // Examples mentioning project_mode, claude_md_amendments, recent_fires need session/state — not testable yet.
  const ps = example.project_state || {};
  if (ps.claude_md_amendments) return 'project-config override not yet implemented';
  if (ps.recent_fires) return 'session-state tracking not yet implemented';
  if (ps.devlog) return 'devlog awareness not yet implemented';
  if (ps.last_fire_state_hash_matches_current !== undefined) return 'session-state tracking not yet implemented';
  return null;
}

function assertEqual(actual, expected) {
  if (expected.fires === false) {
    return actual.fires === false
      ? { ok: true }
      : { ok: false, reason: `expected no fire, got fire (moment=${actual.moment})` };
  }
  if (expected.fires === true) {
    if (actual.fires !== true) return { ok: false, reason: 'expected fire, got no fire' };
    // v0.27.0+: multi-moment assertion. If expected.moments is provided, every
    // listed moment must be in the actual signals list (set inclusion, order
    // doesn't matter). Useful for cases where multiple loops share an entry
    // (e.g., cost-budget-loop + ai-failure-state-loop both fire at the first
    // LLM SDK call).
    if (Array.isArray(expected.moments) && expected.moments.length) {
      const actualSet = new Set(actual.moments || []);
      const missing = expected.moments.filter((m) => !actualSet.has(m));
      if (missing.length) {
        return { ok: false, reason: `expected moments ${expected.moments.join(',')} — missing: ${missing.join(',')}; got: ${[...actualSet].join(',')}` };
      }
      return { ok: true };
    }
    if (expected.moment && actual.moment && expected.moment !== actual.moment) {
      // For single-moment expectations, also check it appears in the signals
      // list (the first signal isn't always deterministic when multiple fire).
      if (Array.isArray(actual.moments) && actual.moments.includes(expected.moment)) {
        return { ok: true };
      }
      return { ok: false, reason: `expected moment=${expected.moment}, got moment=${actual.moment}` };
    }
    return { ok: true };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function loadMoment(name) {
  const path = join(__dirname, name);
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, 'utf8');
  const cases = parseYaml(raw);
  // Fail LOUDLY on a case the parser silently dropped. See reconcileCases —
  // a wrapped scalar once cost 6 of 7 cases while this suite printed green.
  const problems = reconcileCases(raw, cases, name);
  if (problems.length) {
    console.error(`\n  \u2717 eval file will not load cleanly:\n`);
    for (const p of problems) console.error(`    \u00b7 ${p}\n`);
    process.exit(1);
  }
  return cases;
}

function color(s, code) {
  if (!process.stdout.isTTY) return s;
  return `\x1b[${code}m${s}\x1b[0m`;
}
const green = (s) => color(s, '32');
const red = (s) => color(s, '31');
const yellow = (s) => color(s, '33');
const dim = (s) => color(s, '90');

function main() {
  // DISCOVERED, not hand-listed (v0.208.0). This was twelve `loadMoment('moment-x.yml')` calls
  // and a hand-typed count printout — so a new eval set was INVISIBLE until someone remembered
  // to register it, and the suite would report a clean sweep without ever loading it. It had
  // already drifted: `moment-unverified.yml` was loaded but missing from the printout, so the
  // per-set counts did not add up to the total anyone read. A suite that cannot see its own
  // cases is the same shape as a checker that reads one surface of two.
  const sets = readdirSync(__dirname)
    .filter((f) => f.startsWith('moment-') && f.endsWith('.yml'))
    .sort()
    .map((f) => ({ label: f.replace(/^moment-|\.yml$/g, ''), cases: loadMoment(f) }));
  const all = sets.flatMap((s) => s.cases);

  console.log(`\n  conscience-evals · ${all.length} examples loaded  ${sets.length} sets`);
  const pad = Math.max(...sets.map((s) => s.label.length)) + 2;
  for (const set of sets) console.log(`    ${(set.label + ':').padEnd(pad)} ${String(set.cases.length).padStart(3)}`);
  console.log('');

  const results = { passed: [], failed: [], skipped: [], errors: [] };
  const byFailureMode = {}; // for the summary

  for (const ex of all) {
    const skipReason = shouldSkip(ex);
    if (skipReason) {
      results.skipped.push({ id: ex.id, reason: skipReason });
      continue;
    }

    let tempDir;
    try {
      tempDir = buildProjectDir(ex);
      const raw = runHook(tempDir);
      const actual = normalizeHookOutput(raw);
      const expected = ex.expected_detection || {};
      const result = assertEqual(actual, expected);

      if (result.ok) {
        results.passed.push({ id: ex.id });
        console.log(`  ${green('✓')} ${ex.id}  ${dim(ex.scenario || '')}`);
      } else {
        results.failed.push({ id: ex.id, reason: result.reason, scenario: ex.scenario, failure_mode: ex.failure_mode });
        if (ex.failure_mode) {
          byFailureMode[ex.failure_mode] = (byFailureMode[ex.failure_mode] || 0) + 1;
        }
        console.log(`  ${red('✗')} ${ex.id}  ${ex.scenario || ''}`);
        console.log(`      ${red('→')} ${result.reason}`);
      }
    } catch (e) {
      results.errors.push({ id: ex.id, error: e.message });
      console.log(`  ${red('!')} ${ex.id}  runtime error: ${e.message}`);
    } finally {
      if (tempDir && existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
    }
  }

  // Summary
  console.log(`\n  ── summary ──`);
  console.log(`    ${green('passed:')}  ${results.passed.length}`);
  console.log(`    ${red('failed:')}  ${results.failed.length}`);
  console.log(`    ${yellow('skipped:')} ${results.skipped.length}  ${dim('(features not yet implemented)')}`);
  if (results.errors.length) console.log(`    ${red('errors:')}  ${results.errors.length}`);

  if (results.failed.length) {
    console.log(`\n  failed by category:`);
    const byCat = {};
    for (const f of results.failed) {
      const cat = f.failure_mode || (f.scenario?.startsWith('Three') ? 'should-fire' : 'uncategorized');
      byCat[cat] = (byCat[cat] || 0) + 1;
    }
    for (const [cat, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${red(String(n).padStart(3))}  ${cat}`);
    }
  }

  if (results.skipped.length) {
    console.log(`\n  skipped by reason (top 5):`);
    const byReason = {};
    for (const s of results.skipped) byReason[s.reason] = (byReason[s.reason] || 0) + 1;
    const top = Object.entries(byReason).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [r, n] of top) console.log(`    ${yellow(String(n).padStart(3))}  ${r}`);
  }

  console.log('');
  process.exit(results.failed.length + results.errors.length > 0 ? 1 : 0);
}

main();
