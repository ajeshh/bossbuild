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
// TWO MORE CHECKS SINCE v0.309.0, both reading the index's `Status` column and the API-shape floor:
//   - DEPRECATED IMPORT — a row marked `deprecated → X` is a component the agent must not copy, and
//     the agent copies whatever import it finds. When a write adds a reference to one, it names the
//     replacement. Fires on ANY component-shaped file (pages import components too), once per write
//     that adds the reference, never for the deprecated component's own file.
//   - THE BOOLEAN PILE — `isPrimary isLarge isDanger` on one component is eight undesigned states
//     and the shape a model produces by default. When a component's props reach three `isX`-shaped
//     booleans and this write added one, it asks for an enumerated `variant`/`size` instead.
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

// The text this write ADDED — a Write's content, an Edit's new_string, a MultiEdit's new_strings.
const addedText = (input) => {
  if (typeof input.content === 'string') return input.content;
  if (typeof input.new_string === 'string') return input.new_string;
  if (Array.isArray(input.edits)) return input.edits.map((e) => e.new_string || '').join('\n');
  return '';
};
// `isPrimary?: boolean` · `hasIcon: Boolean` · `var isLarge: Bool` — the prefixed-boolean prop shape.
const BOOL_PROP = /\b((?:is|has|show|hide|can|should)[A-Z]\w*)\??\s*:\s*(?:boolean|Boolean|Bool)\b/g;
const boolProps = (text) => [...new Set([...text.matchAll(BOOL_PROP)].map((m) => m[1]))];

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
  const index = readFileSync(indexPath, 'utf8');
  const added = addedText(input);
  const notes = [];

  // --- Deprecated import: the Status column, read at the moment it matters. -----------------
  // A row ends `… | deprecated → `Surface` |` (either arrow). Any component-shaped file can import
  // a deprecated one — pages most of all — so this runs before the "is it a component?" gate.
  const deprecated = new Map();
  for (const line of index.split(/\r?\n/)) {
    const row = line.match(/^\|\s*\**`?([A-Za-z][\w-]*)`?\**\s*\|/);
    const st = line.match(/deprecated\s*(?:→|->)\s*`?([A-Za-z][\w.-]*)`?/i);
    if (row && st && row[1].toLowerCase() !== st[1].toLowerCase()) deprecated.set(row[1], st[1]);
  }
  for (const [old, next] of deprecated) {
    if (old === name) continue; // the deprecated component's own file is allowed to exist
    if (new RegExp(`\\b${old}\\b`).test(added)) {
      notes.push(
        `\`${old}\` is marked **deprecated → \`${next}\`** in \`${INDEX_REL}\` and this write just ` +
        `referenced it. Use \`${next}\`. The old row stays until its last import is gone — this is ` +
        `one of the imports keeping it alive.`
      );
    }
  }

  const isComponent = !NOT_A_COMPONENT.test(name) &&
    // Either it lives in a components directory, or it is PascalCase — the two conventions that
    // actually signal "this is a component" across web and native.
    (COMPONENT_DIR.test(path) || /^[A-Z][A-Za-z0-9]*$/.test(name));

  // --- The boolean pile: the API-shape floor, checked where the props are written. ----------
  if (isComponent && boolProps(added).length) {
    let whole = added;
    try { whole = readFileSync(join(projectDir, path), 'utf8'); } catch { /* not on disk yet */ }
    const pile = boolProps(whole);
    if (pile.length >= 3) {
      notes.push(
        `\`${name}\` now carries ${pile.length} prefixed boolean props (${pile.map((b) => `\`${b}\``).join(', ')}) — ` +
        `that is ${2 ** pile.length} combinations, and nobody designed most of them. The API-shape ` +
        `floor: **enumerated variants, not boolean piles** — \`variant="…"\` / \`size="…"\` with the ` +
        `states you actually drew. Booleans that are genuinely independent (\`disabled\`, \`loading\`) ` +
        `are fine; ones that describe *which kind* are a variant wearing a boolean's name.`
      );
    }
  }

  // Already indexed? Then this is an edit to a known component and the three-way question is
  // settled. Word-boundary match so `Button` doesn't mask `CTAButton`.
  const indexed = new RegExp(`\\b${name.replace(/[^\w]/g, '')}\\b`).test(index);
  if (!isComponent || indexed) {
    if (notes.length) out(`component-reuse-guard: ${notes.join(' ')}`);
    process.exit(0);
  }

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
    (notes.length ? `component-reuse-guard: ${notes.join(' ')}\n\n` : '') +
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
