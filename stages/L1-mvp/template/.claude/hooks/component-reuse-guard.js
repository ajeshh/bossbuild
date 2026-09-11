#!/usr/bin/env node
// BOSS component-reuse-guard — a PostToolUse hook (OPT-IN). The boundary under "reuse first."
//
// WHY IT EXISTS: the design system's oldest unenforced rule is *reuse first, extend second, create
// last.* `docs/design/COMPONENTS.md` made it possible to CHECK — an index the agent can open instead
// of a sentence it has to remember. That was a better filter. It was still a filter: nothing noticed
// when a component got written without ever consulting it.
//
// And "create" is the path of least resistance for a generating model. Writing a new file is easier
// than reading an existing one and widening it, so the default silently lands on *new* every time,
// and the cost lands later: `Button`, `CTAButton`, `PrimaryButton` — the pattern-reinvention failure
// mode, arriving one reasonable-looking decision at a time.
//
// THE ASYMMETRY THAT MAKES THIS WORTH A HOOK: forking is cheap NOW and expensive forever. Extending
// is slightly expensive now and free forever. A model optimizes for now, because now is the only
// thing in its context.
//
// WHAT IT DOES: when a component-shaped file is written and its name has no row in the index, hand
// the agent the rows it should have compared against, and ask the three-way question — is this
// REUSE, ADJUST, or NEW? Advisory, never blocking.
//
// THE TELL IT CARRIES, because the question is genuinely hard: **match on the JOB, not the look.**
//   - same job, different look     -> a VARIANT of the existing one (a prop, not a file)
//   - same job, slightly different -> WIDEN the existing one
//   - different job, same look     -> genuinely NEW (the resemblance is a coincidence)
//   - can't tell                   -> it is probably a variant; forking is the expensive mistake
//
// THE JIT GATE: it does NOTHING unless `docs/design/COMPONENTS.md` exists. No index, no opinion —
// a founder who hasn't run `/design-tokens-init` is not doing anything wrong, and a hook that nags
// them is the unearned ceremony BOSS refuses (Principle #2). The index IS the opt-in signal.
//
// WHY IT STAYS QUIET IN PRACTICE: it fires only on files whose name is not already in the index —
// i.e. once per new component, not once per edit. Editing `Button.tsx` forever is silent.
//
// TO TURN IT ON — add to .claude/settings.json (same block as design-tokens-guard; both can share it):
//   "hooks": { "PostToolUse": [ { "matcher": "Edit|Write|MultiEdit",
//     "hooks": [ { "type": "command",
//                  "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/component-reuse-guard.js\"",
//                  "timeout": 5 } ] } ] }
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const INDEX_REL = join('docs', 'design', 'COMPONENTS.md');
const COMPONENT_EXT = /\.(tsx|jsx|vue|svelte|astro|swift|kt|dart)$/i;
// A components directory by any of its usual names, on any platform separator.
const COMPONENT_DIR = /(^|[\\/])(components?|ui|widgets|views|elements)[\\/]/i;
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|coverage|\.next|\.svelte-kit)[\\/]|\.(test|spec|stories)\./i;
// Barrels and pages are not components. A page is a composition; flagging it would be noise.
const NOT_A_COMPONENT = /^(index|main|app|page|layout|route|root)$/i;

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

// "CTAButton" -> ["cta","button"] · "user_card" -> ["user","card"]. Cheap, good enough to find
// the near-name that matters, which is the whole job.
const words = (name) => name
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[_\-.]/g, ' ')
  .toLowerCase().split(/\s+/).filter(Boolean);

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();

  // --- The JIT gate: no index, no opinion. --------------------------------------------------
  const indexPath = join(projectDir, INDEX_REL);
  if (!existsSync(indexPath)) process.exit(0);

  const input = event.tool_input || {};
  const path = input.file_path || '';
  if (!path || SKIP_PATH.test(path) || !COMPONENT_EXT.test(path)) process.exit(0);

  const name = basename(path, extname(path));
  if (NOT_A_COMPONENT.test(name)) process.exit(0);
  // Either it lives in a components directory, or it is PascalCase — the two conventions that
  // actually signal "this is a component" across web and native.
  if (!COMPONENT_DIR.test(path) && !/^[A-Z][A-Za-z0-9]*$/.test(name)) process.exit(0);

  const index = readFileSync(indexPath, 'utf8');

  // Already indexed? Then this is an edit to a known component and there is nothing to ask.
  // Word-boundary match so `Button` doesn't mask `CTAButton`.
  if (new RegExp(`\\b${name.replace(/[^\w]/g, '')}\\b`).test(index)) process.exit(0);

  // --- Find what it should have been compared against. --------------------------------------
  // Table rows look like: | `Button` | primary and secondary actions | `import …` | … |
  const rows = [];
  for (const line of index.split(/\r?\n/)) {
    const m = line.match(/^\|\s*\**`?([A-Za-z][\w-]*)`?\**\s*\|([^|]*)\|/);
    if (!m) continue;
    const [, rowName, purpose] = m;
    if (/^(component|id|pattern)$/i.test(rowName)) continue; // header
    rows.push({ name: rowName, purpose: purpose.trim() });
  }
  if (!rows.length) process.exit(0); // a skeleton index has nothing to compare against

  const mine = new Set(words(name));
  const scored = rows
    .map((r) => ({ ...r, shared: words(r.name).filter((w) => mine.has(w)).length }))
    .sort((a, b) => b.shared - a.shared);
  const near = scored.filter((r) => r.shared > 0).slice(0, 3);

  const listing = (near.length ? near : scored.slice(0, 5))
    .map((r) => `\`${r.name}\`${r.purpose ? ` (${r.purpose})` : ''}`)
    .join(', ');

  const nearNote = near.length
    ? ` **\`${name}\` shares a name with ${near.map((r) => `\`${r.name}\``).join(' / ')}** — that is the ` +
      `canonical tell of a variant that got forked into a file.`
    : '';

  out(
    `component-reuse-guard: \`${name}\` was just written to \`${path}\` and has no row in ` +
    `\`${INDEX_REL}\`. Before continuing, answer the three-way question the index exists for — ` +
    `**reuse, adjust, or new?**${nearNote} Already there: ${listing}. ` +
    `Match on the JOB, not the look: same job and a different look is a **variant** (a prop, not a ` +
    `file); same job and a slightly different need means **widen** the existing one; a different job ` +
    `that happens to look similar is genuinely **new**. If you cannot tell, it is probably a variant — ` +
    `forking is cheap now and expensive forever, while extending is slightly expensive now and free ` +
    `forever. If it IS new, say why in one line and add its row to the index in this same change; an ` +
    `index that lags the code is one the next search will trust and be wrong about.`
  );
} catch {
  process.exit(0); // fail-open
}
