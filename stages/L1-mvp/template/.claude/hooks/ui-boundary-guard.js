#!/usr/bin/env node
// BOSS ui-boundary-guard — a PostToolUse hook (OPT-IN). The boundary under "imports flow one way."
//
// WHY IT EXISTS: `/design-tokens-init` writes one sentence into CLAUDE.md — `ui/` knows nothing about
// the product, `features/` never reaches into another feature, `app/` composes the rest — and that
// sentence is a FILTER: it holds for exactly as long as every future prompt remembers it. The mature
// systems that keep this rule (Feature-Sliced Design's layer rule, bulletproof-react's
// shared → features → app) keep it with a linter, because the failure is not dramatic. It is one
// reasonable-looking import: a Button that reaches up into `features/billing` for a price format, a
// feature that pulls a sibling's internal hook because it was right there. Each is cheap now. Each
// makes `ui/` un-extractable and two features un-separable, forever.
//
// WHAT IT DOES: when a file inside a layered layout is written, it reads the imports that were just
// added and names the ones that point the wrong way — UP (ui → features, ui → app, features → app)
// or SIDEWAYS into another feature's internals. It says which rule, and what the fix usually is:
// move the shared thing DOWN, route through the other feature's public `index`, or pass it in as a
// prop or child. Advisory, never blocking.
//
// THE JIT GATE: it does NOTHING unless the layout is actually layered — a `features/` (or
// `modules/`, `domains/`) directory AND a `ui/`-layer directory beside it, at the root the written
// file belongs to. A flat `components/` folder is not wrong; it is earlier. No layers, no opinion.
//
// STACK-NEUTRAL BY PATH, NOT BY SYNTAX: it reads `from '…'`, `import '…'`, `require('…')` and
// Dart's `import 'package:…/features/…'`. Module-name imports with no path (`import Foundation`)
// are ignored — a boundary it cannot resolve is not a boundary it guesses at.
//
// TO TURN IT ON — add to .claude/settings.json (same block as design-tokens-guard; they share it):
//   "hooks": { "PostToolUse": [ { "matcher": "Edit|Write|MultiEdit",
//     "hooks": [ { "type": "command",
//                  "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/ui-boundary-guard.js\"",
//                  "timeout": 5 } ] } ] }
//
// Fail-open: any surprise exits 0 silently. A missed warning is fine; a broken session is not.

import { readFileSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';

// Layer rank: imports may point at the same rank or LOWER, never higher.
const LAYERS = [
  { rank: 0, name: 'ui', dirs: ['ui', 'components', 'shared', 'design-system', 'primitives'] },
  { rank: 1, name: 'features', dirs: ['features', 'modules', 'domains'] },
  { rank: 2, name: 'app', dirs: ['app', 'pages', 'routes'] },
];
const DIR_TO_LAYER = new Map();
for (const l of LAYERS) for (const d of l.dirs) DIR_TO_LAYER.set(d, l);

const SOURCE_EXT = /\.(tsx?|jsx?|mjs|cjs|vue|svelte|astro|dart)$/i;
const SKIP_PATH = /(^|\/)(node_modules|dist|build|out|coverage|\.next|\.svelte-kit)\//i;
const IMPORT_RE = /(?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*)['"]([^'"\n]+)['"]/g;

const out = (additionalContext) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext },
  }));
  process.exit(0);
};

const norm = (p) => String(p).replace(/\\/g, '/');

// The text this write ADDED — a Write's content, an Edit's new_string, a MultiEdit's new_strings.
// Only new imports are judged, so an old violation in a file being edited elsewhere stays quiet;
// the guard speaks once, when the line lands.
function addedText(input) {
  if (typeof input.content === 'string') return input.content;
  if (typeof input.new_string === 'string') return input.new_string;
  if (Array.isArray(input.edits)) return input.edits.map((e) => e.new_string || '').join('\n');
  return '';
}

// Split an absolute-ish posix path into { root, layer, rest } at its FIRST layer directory.
// "src/features/billing/ui/Price.tsx" -> { root: "src", layer: features, rest: ["billing","ui","Price.tsx"] }
function locate(path) {
  const parts = norm(path).split('/').filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const layer = DIR_TO_LAYER.get(parts[i].toLowerCase());
    if (layer) return { root: parts.slice(0, i).join('/'), layer, rest: parts.slice(i + 1) };
  }
  return null;
}

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // fail-open
}

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();
  const input = event.tool_input || {};
  const filePath = input.file_path ? norm(input.file_path) : '';
  if (!filePath || SKIP_PATH.test(filePath) || !SOURCE_EXT.test(filePath)) process.exit(0);

  // Work in project-relative posix form so aliases and relatives resolve against the same root.
  const rel = filePath.startsWith(norm(projectDir) + '/')
    ? filePath.slice(norm(projectDir).length + 1)
    : filePath.replace(/^\//, '');
  const here = locate(rel);
  if (!here) process.exit(0); // not inside any layer — nothing to judge

  // --- The JIT gate: layered layout present at this root, or no opinion. --------------------
  const rootAbs = join(projectDir, ...here.root.split('/').filter(Boolean));
  const hasDir = (names) => names.some((d) => existsSync(join(rootAbs, d)));
  if (!hasDir(LAYERS[1].dirs) || !hasDir(LAYERS[0].dirs)) process.exit(0);

  const text = addedText(input);
  if (!text) process.exit(0);
  const fileDir = posix.dirname(rel);
  const findings = [];

  for (const m of text.matchAll(IMPORT_RE)) {
    let spec = m[1].trim();
    if (spec.startsWith('package:')) spec = spec.replace(/^package:[^/]+\//, `${here.root ? here.root + '/' : ''}`);
    let target;
    if (spec.startsWith('.')) target = posix.normalize(posix.join(fileDir, spec));
    else if (/^[@~#]\//.test(spec)) target = posix.join(here.root, spec.slice(2));
    else if (/^(src|lib)\//.test(spec)) target = spec;
    else if (DIR_TO_LAYER.has(spec.split('/')[0].toLowerCase())) target = posix.join(here.root, spec);
    else continue; // a package, a bare module — not a boundary this can see
    const there = locate(target);
    if (!there || there.root !== here.root) continue;

    if (there.layer.rank > here.layer.rank) {
      findings.push(
        `\`${spec}\` — **${here.layer.name}/ importing from ${there.layer.name}/** points UP. ` +
        `\`${here.layer.name}/\` must not know \`${there.layer.name}/\` exists. Move the shared piece ` +
        `down to \`${LAYERS[Math.min(here.layer.rank, there.layer.rank)].name}/\`, or pass it in as a ` +
        `prop or child from the layer that does know.`
      );
      continue;
    }
    if (there.layer.rank === 1 && here.layer.rank === 1) {
      const mine = here.rest[0];
      const theirs = there.rest[0];
      const deep = there.rest.length > 1 && !/^index(\.[a-z]+)?$/i.test(there.rest[1] || '');
      if (mine && theirs && mine !== theirs && deep) {
        findings.push(
          `\`${spec}\` — **feature \`${mine}\` reaching into feature \`${theirs}\`'s internals** ` +
          `(\`${there.rest.slice(1).join('/')}\`). A feature's public surface is its \`index\`; anything ` +
          `deeper is its own business. Import from \`${there.layer.dirs[0]}/${theirs}\` (the index), or ` +
          `if both features need it, it is not a feature's — move it down to \`ui/\` or \`shared/\`.`
        );
      }
    }
  }

  if (!findings.length) process.exit(0);

  out(
    `ui-boundary-guard: \`${rel}\` just gained ${findings.length === 1 ? 'an import that crosses' : `${findings.length} imports that cross`} ` +
    `the one-way rule (\`ui/\` → \`features/\` → \`app/\`; a feature never reaches into ` +
    `another's internals):\n- ${findings.join('\n- ')}\n` +
    `Each of these is cheap now and makes \`ui/\` un-extractable or two features un-separable later. ` +
    `If the crossing is deliberate, say why in one line where the import is — a boundary crossed on ` +
    `purpose with a reason is a decision; one crossed silently is drift.`
  );
} catch {
  process.exit(0); // fail-open
}
