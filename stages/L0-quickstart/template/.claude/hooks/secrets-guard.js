#!/usr/bin/env node
// BOSS secrets-guard — a PreToolUse hook (OPT-IN; high-stakes ceiling, NOT a universal default).
//
// WHY OPT-IN (read before registering): a PreToolUse hook fires a process on EVERY tool call —
// real per-call latency. The universal, zero-cost floor is the `permissions.deny` block in
// settings.json (ships with every BOSS project). This hook is the *ceiling*: broader coverage
// (Bash bypasses beyond `cat`, MCP tools, skills added later) for contexts where the stakes justify
// the cost — regulated / PHI / `domain-expert` cohort work. Registering it everywhere by default
// would be the always-on machinery BOSS warns founders against (PRINCIPLE #2 / R&H #1). See
// `boss craft context-discipline`.
//
// TO TURN IT ON — add this to .claude/settings.json (the registration IS the on-switch; an
// unregistered script costs nothing):
//   "hooks": {
//     "PreToolUse": [
//       { "matcher": "",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/secrets-guard.js\"",
//                      "timeout": 5 } ] }
//     ]
//   }
//
// WHAT IT DOES: never let a tool read secret CONTENTS into the model's context (the leak).
//   - Read / Edit / NotebookEdit of a secrets file  -> DENY (no reason to load a secret into context).
//   - Bash command referencing a secrets path        -> ASK  (don't hard-block legit `.env` *creation*;
//                                                             surface it to the human instead).
//   - MCP tool call whose input references a secret   -> ASK  (unknown semantics; let the human judge).
//   - everything else                                  -> ALLOW.
// Fail-open: any parse/runtime surprise exits 0 (allow). A guard that breaks the session is worse
// than one that occasionally misses — the deny-list floor still hard-blocks the common vectors.
//
// Output contract (Claude Code PreToolUse): JSON on stdout with a permissionDecision, exit 0.

import fs from 'node:fs';

// A path is "secret" if its basename is .env / .env.<suffix>, or it sits under a secrets/ segment.
const SECRET_RE = /(^|[\/\s'"=:])\.env(\.[\w.-]+)?($|[\/\s'"])|(^|[\/\s'"=:])secrets\//i;

const touchesSecret = (s) => typeof s === 'string' && SECRET_RE.test(s);

const decide = (decision, reason) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decision,           // "deny" | "ask"
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
};

let event;
try {
  event = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open: unreadable/!JSON input -> allow
}

const tool = event.tool_name || '';
const input = event.tool_input || {};

try {
  if (/^(Read|Edit|NotebookEdit)$/.test(tool)) {
    const p = input.file_path || input.notebook_path || '';
    if (touchesSecret(p)) {
      decide('deny',
        `secrets-guard: refusing to ${tool} a secrets file (${p}). Reading secret contents into ` +
        `context risks leakage. Read secrets from the environment at runtime, or use a secret manager.`);
    }
  } else if (tool === 'Bash') {
    if (touchesSecret(input.command || '')) {
      decide('ask',
        `secrets-guard: this Bash command references a secrets path. Approve only if it does NOT ` +
        `read secret contents into the session (e.g. creating/appending a .env is fine; cat/grep is not).`);
    }
  } else if (tool.startsWith('mcp__')) {
    if (touchesSecret(JSON.stringify(input))) {
      decide('ask',
        `secrets-guard: this MCP tool call references a secrets path. Approve only if it will not ` +
        `expose secret contents to the session.`);
    }
  }
} catch {
  process.exit(0); // fail-open on any matching error
}

process.exit(0); // allow everything else
