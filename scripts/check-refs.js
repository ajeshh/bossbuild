#!/usr/bin/env node
// BOSS · reference integrity — does everything BOSS points at actually exist?
//
// WHY THIS EXISTS: the same bug landed three times in one week.
//   · RLS was named by `/ship` and unwritable by `db-architect`
//   · `STYLE_GUIDE.md` was read by three consumers and written by nothing
//   · the practice shelf was cited by 25 shipped files and reachable from none of them
// Each was found by accident, while touching adjacent code. **A reference is a dependency,
// and BOSS had no check that its dependencies resolved.**
//
// And the failure that motivated the SCRIPT rather than more unit tests: fixing the third one
// took two passes. The first regex missed a link form, and "I fixed them all" was wrong — stated
// confidently, in a changelog. A sweep you run by hand is a sweep you can believe you finished.
// This is the standing version of that sweep.
//
// Three classes, because they fail differently:
//   1. LINKS      — a relative markdown link with no file behind it.
//   2. PREDICATES — a loop spec asserting `exists:` on a path that doesn't. A loop whose ENTRY
//                   predicate can never be true is silently dead, not loud. (`docs/loops/eval.md`
//                   was dead from v0.18.0 to v0.148.0 this way — 130 versions.)
//   3. ESCAPES    — a SHIPPED file pointing at something only BOSS's own repo has. It resolves
//                   here and dangles in every founder's project, which is the worst kind: it
//                   passes every check run from this directory.
//
// Zero-dep by rule. Exit 1 on any finding so CI and `npm test` can gate on it.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules', '.boss', 'coverage', 'dist']);

// Placeholders are not links. `FEAT-NNN-<slug>.md` is a pattern a skill tells the model to
// fill in — flagging it would train everyone to ignore this script, which is how a checker dies.
const PLACEHOLDER = /[<>{}]|NNN|…|\{\{/;

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const md = files.filter((f) => f.endsWith('.md'));
const rel = (p) => relative(ROOT, p);
const findings = { links: [], predicates: [], escapes: [] };

// --- 1. relative markdown links --------------------------------------------------------
const LINK = /\[[^\]]*\]\(([^)#\s]+)(?:#[^)]*)?\)/g;
for (const f of md) {
  const inTemplate = rel(f).startsWith(`stages${sep}`) && rel(f).includes(`template${sep}`);
  for (const m of readFileSync(f, 'utf8').matchAll(LINK)) {
    const t = m[1];
    if (/^(https?:|mailto:|#)/.test(t) || PLACEHOLDER.test(t)) continue;
    // A template file's relative links resolve inside the FOUNDER's project, where the stage
    // layers are flattened into one .claude/. Checking them against this repo's layout would
    // produce false positives (e.g. an L1 skill linking a sibling L0 skill).
    if (inTemplate && t.startsWith('..')) continue;
    if (!existsSync(resolve(dirname(f), t))) findings.links.push([rel(f), t]);
  }
}

// --- 2. loop-spec predicates -----------------------------------------------------------
// Only BOSS's OWN loops: a template loop's paths are relative to a founder's repo.
const PRED = /^\s*(?:-\s*)?(?:exists|path|path_glob):\s*(\S+)\s*$/gm;
for (const f of md.filter((x) => rel(x).startsWith(`docs${sep}loops${sep}`))) {
  const seen = new Set();
  for (const m of readFileSync(f, 'utf8').matchAll(PRED)) {
    const t = m[1];
    if (PLACEHOLDER.test(t) || t.includes('*') || seen.has(t)) continue;
    seen.add(t);
    if (!existsSync(join(ROOT, t))) findings.predicates.push([rel(f), t]);
  }
}

// --- 3. shipped files escaping into BOSS's own repo -------------------------------------
// `/extract` is the one legitimate mention: it documents promoting a pattern UP *into* library/.
// Both forms must end in a real filename. A shipped skill saying `docs/ideas/IDEA-001-<slug>.md`
// is describing where the FOUNDER's first idea goes — correct, and not an escape. Requiring an
// extension is what separates "names a file" from "names a numbering convention"; without it the
// match stops at the `<` and the placeholder guard never sees the pattern that would clear it.
const ESCAPE = /\b(library\/(?:practices|skills|agents|hooks)\/[A-Za-z0-9._/-]+\.\w+|docs\/ideas\/IDEA-\d+[A-Za-z0-9._-]*\.md)/g;
for (const f of files.filter((x) => rel(x).startsWith(`stages${sep}`) && /\.(md|js|json)$/.test(x))) {
  if (rel(f).includes(`skills${sep}extract${sep}`)) continue;
  for (const m of readFileSync(f, 'utf8').matchAll(ESCAPE)) {
    if (PLACEHOLDER.test(m[1])) continue;
    findings.escapes.push([rel(f), m[1]]);
  }
}

const total = Object.values(findings).reduce((n, a) => n + a.length, 0);
const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`;

console.log(`\nBOSS · reference integrity — ${md.length} markdown files, ${files.length} files scanned\n`);

if (!total) {
  console.log('  Everything BOSS points at exists.\n');
  console.log('  A reference is a dependency. This is the check that they resolve —');
  console.log('  run it after any sweep, because "I fixed them all" is the claim most');
  console.log('  often made and least often true.\n');
  process.exit(0);
}

const report = (key, title, why) => {
  const rows = findings[key];
  if (!rows.length) return;
  console.log(`  ${title} — ${plural(rows.length, 'finding')}`);
  console.log(`  ${why}`);
  for (const [f, t] of rows) console.log(`      ${f}\n        -> ${t}`);
  console.log('');
};

report('links', 'BROKEN LINKS', 'a relative link with no file behind it.');
report('predicates', 'DEAD PREDICATES',
  'a loop asserting on a missing path — it can never open or never close, silently.');
report('escapes', 'ESCAPED REFERENCES',
  "a SHIPPED file pointing at something only BOSS's repo has; it dangles in every project.\n  Use `boss craft <name>` for practices; drop or restate references to BOSS's own IDEA files.");

console.log(`  ${total} total. Exit 1.\n`);
process.exit(1);
