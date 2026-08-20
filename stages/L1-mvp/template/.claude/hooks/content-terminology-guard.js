#!/usr/bin/env node
// BOSS content-terminology-guard — a PostToolUse hook (OPT-IN). The design system's content half,
// given the one boundary it can actually have.
//
// WHY IT EXISTS: `boss craft design-system` ships a content layer — voice traits, a tone-by-context
// table, and a terminology list — and states plainly that **there is no regex for off-voice.** Voice
// and tone are filters: they depend on the next prompt remembering. Terminology is the exception,
// because it is a *word list*, and a word list is checkable. This is that check, and it is the ONLY
// part of the content layer that gets one. Do not extend this hook to "tone" — it cannot be done
// with a regex, and a check that pretends otherwise is worse than no check.
//
// WHY IT MATTERS: renaming a core noun late hits copy, routes, schema, tests and every prompt at
// once, so terminology is the cheapest content rule to write and the most expensive to fix. And the
// model reverts to the mean harder on words than on values — nobody has to prompt an LLM into
// writing "Oops! Something went wrong." That IS the mean. It's the 47 blues, in sentences.
//
// WHAT IT DOES: after a write, scan the **string literals and JSX text that was just written** for
// words the project's terminology table says never to use, and hand back the word it should be.
//
// WHY ONLY STRINGS: the style guide's own rule is *"pick the user's word over the internal one —
// the product says `team`, and the code can say whatever it likes."* So identifiers, imports, paths,
// URLs and class names are deliberately out of scope. A hook that renamed variables would be
// enforcing a rule nobody wrote.
//
// THE JIT RULE THAT KEEPS IT QUIET: it does NOTHING unless STYLE_GUIDE.md has a filled-in
// `## Terminology` table. No terminology list means no opinion — a founder who hasn't authored one
// is not doing anything wrong, and a hook that nags them is unearned ceremony (PRINCIPLE #2).
//
// WHY OPT-IN: a PostToolUse hook fires a process after every matching tool call — real latency.
// Ship it dormant; registration IS the on-switch, offered once by `/design-tokens-init`.
//
// TO TURN IT ON — add to .claude/settings.json:
//   "hooks": {
//     "PostToolUse": [
//       { "matcher": "Edit|Write|MultiEdit",
//         "hooks": [ { "type": "command",
//                      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/content-terminology-guard.js\"",
//                      "timeout": 5 } ] }
//     ]
//   }
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAX_REPORTED = 5;
const STYLE_GUIDE_CANDIDATES = [
  join('docs', 'design', 'STYLE_GUIDE.md'),
  join('docs', 'STYLE_GUIDE.md'),
  'STYLE_GUIDE.md',
];

// Files that can carry user-facing copy.
const COPY_EXT = /\.(tsx|jsx|ts|js|mjs|vue|svelte|astro|html|md|mdx|json|ya?ml)$/i;
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|coverage|\.next|\.svelte-kit)[\\/]|STYLE_GUIDE|DESIGN_TOKENS|\.(test|spec|stories)\./i;

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

// Parse the `## Terminology` table: | Use | Never | Because |
// Unfilled placeholder rows (`<the word>`) are skipped — a skeleton is not a decision.
function parseTerminology(md) {
  const sec = md.split(/^##\s+/m).find((s) => /^terminology\b/i.test(s));
  if (!sec) return [];
  const pairs = [];
  for (const line of sec.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
    if (cells.length < 2) continue;
    const [use, never] = cells;
    if (!use || !never) continue;
    if (/^-+$/.test(use) || /^use$/i.test(use)) continue;      // header / separator
    if (/^[<[]/.test(use) || /^[<[]/.test(never)) continue;     // unfilled placeholder
    const banned = never.split(/[,/]| or /i)
      .map((w) => w.replace(/[`*_"']/g, '').trim())
      .filter((w) => w && w.length > 2 && !/^[<[]/.test(w));
    if (banned.length) pairs.push({ use: use.replace(/[`*_]/g, '').trim(), banned });
  }
  return pairs;
}

// Pull only the *copy* out of what was written: quoted string literals and JSX/HTML text nodes.
// Deliberately excludes identifiers, imports, paths, URLs and class attributes.
function extractCopy(src, path) {
  if (/\.(md|mdx)$/i.test(path)) return src;                    // markdown is copy
  const chunks = [];
  const stripped = src
    .replace(/^\s*import\s.+$/gm, '')
    .replace(/^\s*(?:export\s+)?from\s.+$/gm, '');
  // string literals
  for (const m of stripped.matchAll(/(['"`])((?:\\.|(?!\1)[^\\]){2,200})\1/g)) {
    const v = m[2];
    if (/^[./#@]|^https?:|^[\w-]+\/[\w-]+$/.test(v)) continue;  // paths, urls, imports
    if (/^[a-z-]+(\s+[a-z-]+)*$/i.test(v) && /\b(flex|grid|px-|py-|mt-|text-|bg-)\b/.test(v)) continue; // class strings
    chunks.push(v);
  }
  // JSX / HTML text nodes
  for (const m of stripped.matchAll(/>([^<>{}\n]{3,200})</g)) chunks.push(m[1]);
  return chunks.join('\n');
}

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();

  // --- The JIT gate: no terminology table, no opinion. --------------------------------------
  const sgRel = STYLE_GUIDE_CANDIDATES.find((p) => existsSync(join(projectDir, p)));
  if (!sgRel) process.exit(0);

  let terms = [];
  try { terms = parseTerminology(readFileSync(join(projectDir, sgRel), 'utf8')); } catch { process.exit(0); }
  if (!terms.length) process.exit(0);

  const input = event.tool_input || {};
  const path = input.file_path || input.notebook_path || '';
  if (!path || !COPY_EXT.test(path) || SKIP_PATH.test(path)) process.exit(0);

  // Only what THIS call wrote. A pre-existing word the founder already decided to keep is not
  // this hook's business; drift is what's NEW.
  let written = '';
  if (typeof input.content === 'string') written = input.content;
  else if (typeof input.new_string === 'string') written = input.new_string;
  else if (Array.isArray(input.edits)) {
    written = input.edits.map((e) => e && e.new_string).filter(Boolean).join('\n');
  }
  if (!written.trim()) process.exit(0);

  const copy = extractCopy(written, path);
  if (!copy.trim()) process.exit(0);

  const hits = [];
  for (const { use, banned } of terms) {
    for (const word of banned) {
      const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (re.test(copy)) { hits.push({ word, use }); break; }
    }
    if (hits.length >= MAX_REPORTED) break;
  }
  if (!hits.length) process.exit(0);

  const list = hits.map((h) => `\`${h.word}\` → \`${h.use}\``).join(', ');
  out(
    `content-terminology-guard: user-facing copy just written to \`${path}\` uses wording this ` +
    `project's terminology table rules out — ${list}. ` +
    `One word per concept: inconsistent nouns read as two different products, and renaming later ` +
    `hits copy, routes, schema and tests at once. The table is in \`${sgRel}\` (## Terminology). ` +
    `Fix the strings — identifiers and paths are deliberately out of scope, so only the copy needs ` +
    `to change. If this is a deliberate exception, say so and record it in the style guide's ` +
    `Exceptions table rather than leaving it to look like an accident.`
  );
} catch {
  process.exit(0);
}
