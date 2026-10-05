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
// AT V1 THE INDEX MOVES, AND THE GUARD FOLLOWS IT. `/design-library` replaces COMPONENTS.md with a
// one-line pointer and carries every row into `docs/design/library/manifest.json`. Until IDEA-137
// this guard read only COMPONENTS.md, found zero rows in the pointer, and fell silent — the reuse
// and deprecated-import checks stopped exactly when a project scaled, and nothing could see it. The
// manifest, when it exists, is the index; COMPONENTS.md is the fallback. registry/flows.json declares
// both reads, so check-refs names it if either end moves again.
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
// AND FOR CODE (IDEA-136 · A5): the same question for a new exported helper — `formatAmount` written
// beside a `formatPrice` nobody looked for. The index here is the helper table the guard reads from the
// founder's `.claude/rules/engineering.md`; no table, or an empty one, means no opinion. Code gets four answers, not three: reuse, widen, INLINE back when widening would take a new
// parameter plus a new conditional for one caller (the sign of the wrong abstraction), or copy it and
// note it — duplication is cheaper than the wrong abstraction, and the third copy shows the real shape.
// Once per name, recorded in the trace. Agents copy-paste on the third or fourth repeat unless nudged
// (one practitioner's agent-built app, 2026); a name check misses a helper written under another name,
// so the job column is scored too.
//
// TO TURN IT ON — add to .claude/settings.json (same block as design-tokens-guard; both can share it):
//   "hooks": { "PostToolUse": [ { "matcher": "Edit|Write|MultiEdit",
//     "hooks": [ { "type": "command",
//                  "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/component-reuse-guard.js\"",
//                  "timeout": 5 } ] } ] }
//
// THE TRACE: each three-way question is one line in `.boss/trace.jsonl` ({ kind: "component-new" }),
// so the design page can later say whether it was answered — a row, a merge, or nothing (IDEA-113).
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const INDEX_REL = join('docs', 'design', 'COMPONENTS.md');
const MANIFEST_REL = join('docs', 'design', 'library', 'manifest.json');

// The manifest's components as index rows, so one reader serves both rungs:
// | `Name` | purpose | `import` | status |
const manifestAsIndex = (json) => (JSON.parse(json).components || [])
  .filter((c) => c && c.name)
  .map((c) => `| \`${c.name}\` | ${String(c.purpose || '').replace(/\|/g, '/')} | \`${c.import || ''}\` | ${c.status || ''} |`)
  .join('\n');
const COMPONENT_EXT = /\.(tsx|jsx|vue|svelte|astro|swift|kt|dart)$/i;
// A components directory by any of its usual names, on any platform separator.
const COMPONENT_DIR = /(^|[\\/])(components?|ui|widgets|views|elements)[\\/]/i;
const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|coverage|\.next|\.svelte-kit)[\\/]|\.(test|spec|stories)\./i;
// Barrels and pages are not components. A page is a composition; flagging it would be noise.
// Exact names in any case (App.tsx, index.ts); page-shaped suffixes case-sensitively (DashboardPage).
// KEEP IN STEP with src/design.js — this file ships alone and can't import it; the two drifted once
// (IDEA-136 · F2) and test/not-a-component-parity.test.js now holds them.
const notAComponent = (n) => /^(index|main|app|page|layout|route|root)$/i.test(n) || /(Page|Route|Layout)$/.test(n);

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

// "CTAButton" -> ["cta","button"] · "user_card" -> ["user","card"]. Cheap, good enough to find
// the near-name that matters, which is the whole job.
const words = (name) => name
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // "CTAButton" -> "CTA Button"
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


// --- Code helpers (IDEA-136 · A5) ------------------------------------------------------------------
const RULES_REL = join('.claude', 'rules', 'engineering.md');
const CODE_EXT = /\.(ts|mts|cts|js|mjs|cjs|py|go|rb|rs|java|cs|php)$/i;
const CODE_TEST = /(^|[\\/])(tests?|__tests__|spec)[\\/]|(^|[\\/])test_[^\\/]+\.py$|_test\.(go|py|rb)$/i;
const EXPORTS = [
  /\bexport\s+(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/g,
  /\bexport\s+(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/g,
  /^def\s+([A-Za-z]\w*)\s*\(/gm,            // Python, module level, not _private
  /^func\s+([A-Z]\w*)\s*\(/gm,               // Go, exported
  /\bpub\s+(?:async\s+)?fn\s+([A-Za-z_]\w*)/g, // Rust
];
// undefined → not a code file (the design branch decides) · '' → silent · string → the question.
function helperQuestion(projectDir, input) {
  const path = String(input.file_path || '');
  if (!path || !CODE_EXT.test(path) || SKIP_PATH.test(path) || CODE_TEST.test(path)) return undefined;
  let rules;
  try { rules = readFileSync(join(projectDir, RULES_REL), 'utf8'); } catch { return ''; }
  const sec = rules.split(/^## /m).find((b) => /^find this before you write one/i.test(b));
  if (!sec) return '';
  const rows = sec.split(/\r?\n/).filter((l) => /^\|/.test(l)).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .filter((c) => c.length >= 2 && c[1] && !/^-+$/.test(c[1].replace(/[:\s]/g, '')) && !/^use$/i.test(c[1]));
  if (!rows.length) return ''; // an empty table has nothing to compare against
  const added = addedText(input);
  const names = [...new Set(EXPORTS.flatMap((re) => [...added.matchAll(re)].map((m) => m[1])))];
  const tableText = sec;
  let asked = '';
  try { asked = readFileSync(join(projectDir, '.boss', 'trace.jsonl'), 'utf8'); } catch { /* none yet */ }
  const fresh = names.filter((n) => !new RegExp(`\\b${n.replace(/[$]/g, '\\$')}\\b`).test(tableText)
    && !asked.includes(`"kind":"helper-new","name":"${n}"`));
  if (!fresh.length) return '';
  const name = fresh[0];
  const mine = new Set(words(name));
  const scored = rows.map((c) => ({
    need: c[0], use: c[1],
    shared: words(c[1].replace(/[`()]/g, ' ')).filter((w) => mine.has(w)).length * 2
      + new Set(c[0].toLowerCase().split(/[^a-z0-9]+/).filter((w) => mine.has(w))).size,
  })).sort((a, b) => b.shared - a.shared);
  const near = scored.filter((r) => r.shared > 0).slice(0, 3);
  const rel = path.startsWith(projectDir) ? path.slice(projectDir.length + 1).replace(/\\/g, '/') : path;
  try { appendFileSync(join(projectDir, '.boss', 'trace.jsonl'), JSON.stringify({ ts: new Date().toISOString(), kind: 'helper-new', name, path: rel, near: near.map((r) => r.use) }) + '\n'); } catch { /* the trace is optional */ }
  const nearLine = near.length
    ? ` **Near it: ${near.map((r) => `${r.use}${r.need ? ` (${r.need})` : ''}`).join(' · ')}.**`
    : ` Already in the table: ${scored.slice(0, 4).map((r) => r.use).join(' · ')}.`;
  return `component-reuse-guard: \`${name}\` is a new exported helper in \`${rel}\` with no row in the ` +
    `helper table in \`${RULES_REL.replace(/\\/g, '/')}\`.${nearLine} Before keeping it: **reuse** the one that exists; ` +
    `**widen** it if it's the same job — unless that takes a new parameter *and* a new conditional for ` +
    `this one caller, which is the sign of the wrong abstraction: then **inline** instead; or, if you ` +
    `can't tell, **copy it and note it** with a row in the table — the third copy shows what the shared ` +
    `shape really is. If it's new and will be used again, add its row in this same change.`;
}

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();

  // Code files take the helper branch and never reach the component one (IDEA-136 · A5).
  const codeNote = helperQuestion(projectDir, event.tool_input || {});
  if (codeNote !== undefined) { if (codeNote) out(codeNote); process.exit(0); }

  // --- The JIT gate: no index, no opinion. The manifest (V1) wins over the authored index. ----
  const manifestPath = join(projectDir, MANIFEST_REL);
  const indexPath = join(projectDir, INDEX_REL);
  let index = null;
  let indexRel = INDEX_REL;
  if (existsSync(manifestPath)) {
    try { index = manifestAsIndex(readFileSync(manifestPath, 'utf8')); indexRel = MANIFEST_REL; } catch { index = null; }
  }
  if (index == null && existsSync(indexPath)) index = readFileSync(indexPath, 'utf8');
  if (index == null) process.exit(0);
  const atV1 = indexRel === MANIFEST_REL;

  const input = event.tool_input || {};
  const path = input.file_path || '';
  if (!path || SKIP_PATH.test(path) || !COMPONENT_EXT.test(path)) process.exit(0);

  const name = basename(path, extname(path));
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
        `\`${old}\` is marked **deprecated → \`${next}\`** in \`${indexRel}\` and this write just ` +
        `referenced it. Use \`${next}\`. The old row stays until its last import is gone — this is ` +
        `one of the imports keeping it alive.`
      );
    }
  }

  const isComponent = !notAComponent(name) &&
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

  // Score the job as well as the name: `Badge` must find a `Tag` whose purpose says "status badge".
  // A synonym is how the canonical component hides (RVW-110). A name match still weighs more.
  const mine = new Set(words(name));
  const jobWords = (text) => text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const scored = rows
    .map((r) => {
      const byName = words(r.name).filter((w) => mine.has(w)).length;
      const byJob = new Set(jobWords(r.purpose).filter((w) => mine.has(w))).size;
      return { ...r, byName, shared: byName * 2 + byJob };
    })
    .sort((a, b) => b.shared - a.shared);
  const near = scored.filter((r) => r.shared > 0).slice(0, 3);
  const sameName = near.filter((r) => r.byName > 0);

  const listing = (near.length ? near : scored.slice(0, 5))
    .map((r) => `\`${r.name}\`${r.purpose ? ` (${r.purpose})` : ''}`)
    .join(', ');

  const nearNote = sameName.length
    ? ` **\`${name}\` shares a name with ${sameName.map((r) => `\`${r.name}\``).join(' / ')}** — that is the ` +
      `canonical tell of a variant that got forked into a file.`
    : near.length
      ? ` **What it's for already names this job: ${near.map((r) => `\`${r.name}\``).join(' / ')}** — ` +
        `a different name for the same job is the likeliest reuse.`
      : '';

  // One line in the trace per question asked — { kind: "component-new", name, path, near } — so
  // `boss design` can say later whether the question got answered: a row, a merge, or nothing.
  try { appendFileSync(join(projectDir, '.boss', 'trace.jsonl'), JSON.stringify({ ts: new Date().toISOString(), kind: 'component-new', name, path: (path.startsWith(projectDir) ? path.slice(projectDir.length + 1) : path).replace(/\\/g, '/'), near: near.map((r) => r.name) }) + '\n'); } catch { /* the trace is optional */ }
  out(
    (notes.length ? `component-reuse-guard: ${notes.join(' ')}\n\n` : '') +
    `component-reuse-guard: \`${name}\` was just written to \`${path}\` and has no row in ` +
    `\`${indexRel}\`. Before continuing, answer the three-way question the index exists for — ` +
    `**reuse, adjust, or new?**${nearNote} Already there: ${listing}. ` +
    `Match on the JOB, not the look: same job and a different look is a **variant** (a prop, not a ` +
    `file); same job and a slightly different need means **widen** the existing one; a different job ` +
    `that happens to look similar is genuinely **new**. If you cannot tell, it is probably a variant — ` +
    `forking is cheap now and expensive forever, while extending is slightly expensive now and free ` +
    `forever. If it IS new, say why in one line — as the **Why it exists** line of ` +
    `\`docs/design/components/${name}.md\` (the usage page; \`/design-review\` fills the rest) — and ` +
    (atV1
      ? `re-run \`/design-library\` so the manifest carries it; `
      : `add its row to the index in this same change; `) +
    `an index that lags the code is one the next search ` +
    `will trust and be wrong about. \`boss design\` lists components with no row and no page.`
  );
} catch {
  process.exit(0); // fail-open
}
