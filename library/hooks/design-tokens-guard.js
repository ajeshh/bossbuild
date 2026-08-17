#!/usr/bin/env node
// BOSS design-tokens-guard — a PostToolUse hook (OPT-IN; the boundary the design practice prescribes).
//
// WHY IT EXISTS: `library/practices/design-system.md` names "the 47 blues" as the signature
// AI-design drift — every screen derives slightly different colors until no single source of truth
// survives. Its prescribed prevention was *"reference tokens by name in every prompt."* That is a
// **filter**: it depends on every future prompt remembering. The same lesson `agent-security.md`
// took from CVE-2026-22708 applies here — **bound the capability, don't enumerate the route.** What
// actually stops the 47 blues is a check that fires on a raw hex. This is that check.
//
// WHAT IT DOES: after a write to a style-bearing file, scan for hardcoded style values — hex colors,
// rgb()/hsl() literals, and numeric Tailwind palette classes — and hand Claude the token vocabulary
// it should have used instead. Advisory, never blocking (PostToolUse cannot block; the tool already ran).
//
// THE JIT RULE THAT KEEPS IT QUIET: it does NOTHING unless a tokens file exists. No token system
// means no opinion — a founder who hasn't run `/design-tokens-init` is not doing anything wrong, and
// a hook that nags them is the unearned ceremony BOSS warns against (Principle #2). The tokens file
// IS the opt-in signal, which is why `/design-tokens-init` is the natural place to turn this on.
//
// WHY OPT-IN: a PostToolUse hook fires a process after every matching tool call — real latency. Ship
// it dormant; the founder turns it on when the UI is worth keeping. Registration IS the on-switch.
//
// TO TURN IT ON — add to .claude/settings.json:
//   "hooks": {
//     "PostToolUse": [
//       { "matcher": "Edit|Write|MultiEdit",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/design-tokens-guard.js\"",
//                      "timeout": 5 } ] }
//     ]
//   }
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAX_REPORTED = 6;          // don't flood the context with 40 identical findings
const TOKENS_CANDIDATES = [
  join('docs', 'design', 'DESIGN_TOKENS.md'),
  join('docs', 'DESIGN_TOKENS.md'),
  'DESIGN_TOKENS.md',
];

// Style-bearing files only. A hex in a README or a JSON fixture is not design drift.
const STYLE_EXT = /\.(css|scss|sass|less|styl|tsx|jsx|ts|js|mjs|vue|svelte|astro|html)$/i;
// Never lint the token system itself, generated output, or tests.
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|coverage|\.next|\.svelte-kit)[\\/]|DESIGN_TOKENS|tokens\.(css|js|ts|json)$|\.(test|spec|stories)\./i;

const TAILWIND_UTIL = 'bg|text|border|ring|fill|stroke|from|via|to|divide|outline|shadow|decoration|accent|caret|placeholder';
const TAILWIND_HUE = 'slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const CHECKS = [
  { label: 'hex color',        re: new RegExp(`#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b`, 'g') },
  { label: 'rgb()/hsl()',      re: /\b(?:rgba?|hsla?)\s*\(/g },
  { label: 'palette class',    re: new RegExp(`\\b(?:${TAILWIND_UTIL})-(?:${TAILWIND_HUE})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`, 'g') },
];

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();

  // --- The JIT gate: no token system, no opinion. ------------------------------------------
  const tokensRel = TOKENS_CANDIDATES.find((p) => existsSync(join(projectDir, p)));
  if (!tokensRel) process.exit(0);

  const input = event.tool_input || {};
  const path = input.file_path || input.notebook_path || '';
  if (!path || !STYLE_EXT.test(path) || SKIP_PATH.test(path)) process.exit(0);

  // Only look at what this call actually wrote — not the whole file. A pre-existing hex the
  // founder already decided to keep is not this hook's business; drift is what's NEW.
  let written = '';
  if (typeof input.content === 'string') written = input.content;            // Write
  else if (typeof input.new_string === 'string') written = input.new_string; // Edit
  else if (Array.isArray(input.edits)) {                                     // MultiEdit
    written = input.edits.map((e) => e && e.new_string).filter(Boolean).join('\n');
  }
  if (!written.trim()) process.exit(0);

  const found = [];
  for (const { label, re } of CHECKS) {
    for (const m of written.matchAll(re)) {
      // `rgba? (` matches include the paren — trim it so the message reads as a value, not a fragment.
      found.push({ label, value: m[0].replace(/\s*\($/, '()') });
      if (found.length > 200) break; // pathological file guard
    }
  }
  if (!found.length) process.exit(0);

  // De-dupe by literal value, keep source order.
  const seen = new Set();
  const unique = found.filter((f) => !seen.has(f.value) && seen.add(f.value));
  const shown = unique.slice(0, MAX_REPORTED);
  const extra = unique.length - shown.length;

  // --- Point at the token, don't just complain. --------------------------------------------
  // Pull semantic token names out of the tokens doc so the message carries the actual
  // vocabulary. A warning that names no alternative just gets acknowledged and ignored.
  let vocab = [];
  try {
    const doc = readFileSync(join(projectDir, tokensRel), 'utf8');
    const names = new Set();
    for (const m of doc.matchAll(/`(--[\w-]*color[\w-]*|color\.[\w.-]+|[\w-]*\.color\.[\w.-]+)`/gi)) {
      names.add(m[1]);
    }
    vocab = [...names].slice(0, 8);
  } catch { /* vocabulary is a nicety, not a requirement */ }

  const list = shown.map((f) => `\`${f.value}\` (${f.label})`).join(', ');
  const tail = extra > 0 ? `, and ${extra} more` : '';
  const suggest = vocab.length
    ? ` The semantic tokens in \`${tokensRel}\` include: ${vocab.map((v) => `\`${v}\``).join(', ')}.`
    : ` Read \`${tokensRel}\` and use a semantic token name.`;

  out(
    `design-tokens-guard: hardcoded style values were just written to \`${path}\` — ${list}${tail}. ` +
    `This project has a token system, so raw values are drift ("the 47 blues": each screen derives ` +
    `slightly different colors until no single source of truth survives).${suggest} ` +
    `Replace the raw values with token references, or — if this one is a deliberate exception — say ` +
    `so out loud and record it, rather than leaving it to look like an accident.`
  );
} catch {
  process.exit(0); // fail-open on any matching/IO error
}
