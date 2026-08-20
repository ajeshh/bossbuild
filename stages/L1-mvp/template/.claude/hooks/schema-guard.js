#!/usr/bin/env node
// BOSS schema-guard — a PostToolUse hook (OPT-IN; the prevention half of `boss craft data-schema`).
//
// WHY IT EXISTS: schema review before code used to mean an agent you had to remember to consult
// before writing a migration — at exactly the moment you are least likely to. Same reasoning BOSS
// uses for the humane lens: *an advisor you can decline to open is weaker than a check that fires.*
// One rule here is mechanically checkable, and it is the one that matters most: **enable RLS in the
// same migration that creates the table.**
//
// THE FAILURE IT CATCHES is the best-evidenced one in the whole vibe-coded stack, and it is a
// DATA-MODEL failure, not a deployment one:
//   · CVE-2025-48757 (Lovable/Supabase class) — AI-generated frontends called the database directly
//     with the public anon key, relying on RLS nobody configured. 303 endpoints across 170+ apps
//     leaked PII and third-party keys.
//   · MoltBook — a hardcoded database key plus disabled RLS leaked 1.5M API tokens and 35K emails.
//     The founder wrote no code at all.
// `/ship`'s pre-flight and `/red-team`'s pre-ship pass are the DETECTION half. They can only catch
// it once it is built; this is the half that can prevent it, because it fires while the migration
// is still being written.
//
// WHY IT IS INVISIBLE WITHOUT A CHECK: a table with no policy is a *missing security property*,
// not a functional defect. The app works perfectly. No happy-path test and no amount of clicking
// will surface it — which is why "review the schema" as a habit does not hold, and a check does.
//
// TWO DISTINCT FAILURES, deliberately reported apart (the agent was explicit that they differ):
//   · RLS never enabled          → a perfect policy enforces nothing.
//   · RLS enabled, no policy     → denies everything, which reads as a broken app and gets
//                                  "fixed" by turning RLS back off. That is the dangerous one.
//
// THE JIT RULE THAT KEEPS IT QUIET: it only ever looks at migration/schema files. A founder with
// no database is not doing anything wrong and never hears from it. Writing a migration IS the
// opt-in signal (Principle #2 — no unearned ceremony).
//
// WHY OPT-IN: a PostToolUse hook fires a process after every matching tool call — real latency.
// Ship it dormant; registration IS the on-switch.
//
// TO TURN IT ON — add to .claude/settings.json:
//   "hooks": {
//     "PostToolUse": [
//       { "matcher": "Edit|Write|MultiEdit",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/schema-guard.js\"",
//                      "timeout": 5 } ] }
//     ]
//   }
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAX_REPORTED = 6;

// Migration / schema surfaces only. A `CREATE TABLE` inside a README or a test fixture is not a
// schema decision, and neither is one in a seed script.
const SCHEMA_PATH = /(^|[\\/])(migrations?|supabase|prisma|drizzle|db|database|schema)[\\/]|\.(sql|prisma)$|(^|[\\/])schema\.[\w.]+$/i;
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|coverage|\.next|fixtures?|seeds?|__tests__)[\\/]|\.(test|spec)\./i;

// A quoted, bracketed or bare identifier, optionally schema-qualified: catches "users",
// [users], `users`, public.users.
const IDENT = String.raw`(?:"([^"]+)"|\[([^\]]+)\]|` + '`([^`]+)`' + String.raw`|([A-Za-z_][\w$]*))`;
const CREATE_TABLE = new RegExp(
  String.raw`\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:${IDENT}\s*\.\s*)?${IDENT}`, 'gi');
const ENABLE_RLS = /\bALTER\s+TABLE\s+[^;]*?\bENABLE\s+ROW\s+LEVEL\s+SECURITY/gi;
const CREATE_POLICY = /\bCREATE\s+POLICY\b[^;]*?\bON\s+[^;]*/gi;

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

const nameOf = (m, base) => (m[base] || m[base + 1] || m[base + 2] || m[base + 3] || '').toLowerCase();

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();

  const input = event.tool_input || {};
  const path = input.file_path || input.notebook_path || '';
  if (!path || !SCHEMA_PATH.test(path) || SKIP_PATH.test(path)) process.exit(0);

  // Only what this call actually wrote. A pre-existing table the founder already ruled on is not
  // this hook's business — what is new is what can still be changed cheaply.
  let written = '';
  if (typeof input.content === 'string') written = input.content;
  else if (typeof input.new_string === 'string') written = input.new_string;
  else if (Array.isArray(input.edits)) {
    written = input.edits.map((e) => e && e.new_string).filter(Boolean).join('\n');
  }
  if (!written.trim()) process.exit(0);

  const created = [];
  for (const m of written.matchAll(CREATE_TABLE)) {
    const name = nameOf(m, 5) || nameOf(m, 1);
    if (name) created.push(name);
    if (created.length > 100) break;
  }
  if (!created.length) process.exit(0);

  const rlsFor = written.match(ENABLE_RLS) || [];
  const policyFor = written.match(CREATE_POLICY) || [];
  const mentions = (blocks, t) => blocks.some((b) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(b));

  const noRls = [];
  const noPolicy = [];
  for (const t of [...new Set(created)]) {
    if (!mentions(rlsFor, t)) noRls.push(t);
    else if (!mentions(policyFor, t)) noPolicy.push(t);
  }
  if (!noRls.length && !noPolicy.length) process.exit(0);

  // Sharpen the wording when the stack is the one the CVE class actually hit — a client that
  // reaches the database directly with a publishable key.
  let clientKeyStack = false;
  try {
    for (const p of ['package.json', join('supabase', 'config.toml'), 'firebase.json']) {
      if (!existsSync(join(projectDir, p))) continue;
      if (p !== 'package.json') { clientKeyStack = true; break; }
      if (/@supabase\/|firebase|@firebase\//i.test(readFileSync(join(projectDir, p), 'utf8'))) {
        clientKeyStack = true; break;
      }
    }
  } catch { /* fail-open on the sharpening only */ }

  const lines = [];
  if (noRls.length) {
    lines.push(`Row-level security is never enabled for: ${noRls.slice(0, MAX_REPORTED).map((t) => `\`${t}\``).join(', ')}`
      + (noRls.length > MAX_REPORTED ? ` (+${noRls.length - MAX_REPORTED} more)` : ''));
  }
  if (noPolicy.length) {
    lines.push(`RLS is ON but no policy is defined for: ${noPolicy.slice(0, MAX_REPORTED).map((t) => `\`${t}\``).join(', ')}`
      + ` — that denies **everything**, which reads as a broken app and usually gets "fixed" by turning RLS back off.`);
  }

  out([
    '⚠️  **schema-guard** — a table was created without its access policy in the same migration.',
    '',
    ...lines.map((l) => `- ${l}`),
    '',
    clientKeyStack
      ? '**This stack reaches the database from the client with a publishable key.** Anyone who opens '
        + 'the browser console can read that key — the only thing standing between your users and the '
        + 'internet is a rule someone has to write. That is CVE-2025-48757 (303 endpoints, 170+ apps) '
        + 'and MoltBook (1.5M tokens, 35K emails).'
      : '**Enabling RLS and writing a policy are two different acts.** RLS off with a perfect policy '
        + 'enforces nothing; RLS on with no policy denies everything. Verify both, per table.',
    '',
    'For each table above, answer three questions and put the answer **in this migration**, not in a '
    + 'dashboard (a policy clicked into a dashboard is invisible to review, absent from a fresh '
    + 'environment, and gone at the next rebuild):',
    '1. Who can read a row?  2. Who can write it?  3. **Which column proves it?** (usually an owner '
    + 'or tenant id). A table whose answer is "the app checks" is unprotected the moment anything '
    + 'else — an agent, a script, a leaked key — talks to the database.',
    '',
    'Then demand the negative test: log in as A, ask for B\'s row, assert nothing comes back. '
    + 'Full practice: `boss craft data-schema`. This is advisory — if this table is genuinely public '
    + 'reference data, say so in the migration and move on.',
  ].join('\n'));
} catch {
  process.exit(0); // fail-open
}
