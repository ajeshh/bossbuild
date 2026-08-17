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
// Four classes, because they fail differently:
//   1. LINKS      — a relative markdown link with no file behind it.
//   2. PREDICATES — a loop spec asserting `exists:` on a path that doesn't. A loop whose ENTRY
//                   predicate can never be true is silently dead, not loud. (`docs/loops/eval.md`
//                   was dead from v0.18.0 to v0.148.0 this way — 130 versions.)
//   3. ESCAPES    — a SHIPPED file pointing at something only BOSS's own repo has. It resolves
//                   here and dangles in every founder's project, which is the worst kind: it
//                   passes every check run from this directory.
//   4. AGENTS     — a founder-facing file naming an agent the founder's install does not contain.
//                   Added v0.151.0, after the release-readiness pass found the README selling
//                   BOSS's gitignored `/.claude/` dev workspace as founder features: "nine
//                   advisors ... humane" (eight ship, `mentor-humane` ships nowhere), a "builder
//                   team (designer, voice-keeper, prompt-coach)" (none ship), and "eight
//                   proto-personas you can show features to" (none ship — they react to BOSS).
//                   `docs/GUIDE.md` sent founders to `mentor-humane` from the *health/legal/money/
//                   safety* branch, the highest-stakes page in the guide.
//                   THE HOLE THIS PLUGS: classes 1-3 check paths, and `check-wayfinding-drift`
//                   checks skills. Nothing checked AGENT names — so an agent named in public docs
//                   and existing nowhere passed every gate. Same principle as class 3 ("a
//                   reference is a dependency"), applied to the one reference class it skipped.
//                   Note the direction: `/.claude/` is gitignored, so it is invisible to `grep`
//                   AND to every checker. It has now leaked BOTH ways — stale names hid inside it
//                   during the rebrand, then it got advertised as product here.
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
const findings = { links: [], predicates: [], escapes: [], agents: [] };

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
// `registry/` added v0.152.0. The regex covered `library/` and `docs/ideas/` but not the
// changelog — so `/boss-sync`'s narration step ("read `registry/CHANGELOG.md` from the BOSS source
// repo") escaped the v0.149.0 gate untouched. That step is the whole reason sync is *reviewed*
// rather than blind, and it pointed at a directory no founder project has.
// `/boss-learn` joins `/extract` on the allowlist: both DESCRIBE what `boss learn` writes into
// BOSS's own repo (it bumps a VERSION and prepends a CHANGELOG entry there). That's a description
// of the UP direction, not a pointer the founder is meant to follow.
const ESCAPE = /\b(library\/(?:practices|skills|agents|hooks)\/[A-Za-z0-9._/-]+\.\w+|docs\/ideas\/IDEA-\d+[A-Za-z0-9._-]*\.md|registry\/CHANGELOG\.md)/g;
const ESCAPE_OK = [`skills${sep}extract${sep}`, `skills${sep}boss-learn${sep}`];
for (const f of files.filter((x) => rel(x).startsWith(`stages${sep}`) && /\.(md|js|json)$/.test(x))) {
  if (ESCAPE_OK.some((s) => rel(f).includes(s))) continue;
  for (const m of readFileSync(f, 'utf8').matchAll(ESCAPE)) {
    if (PLACEHOLDER.test(m[1])) continue;
    findings.escapes.push([rel(f), m[1]]);
  }
}

// --- 4. agents named in founder-facing files -------------------------------------------
// The vocabulary is built from agents that ACTUALLY EXIST on disk, never from a regex over prose —
// `persona-cohort` and `persona-reaction` are hyphenated English in two shipped skills, and a
// pattern-matching version of this check would flag both. A checker that cries wolf gets ignored,
// which is how the last three checkers died.
const agentNames = (dir) => (existsSync(dir)
  ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3))
  : []);

const SHIPPED_AGENTS = new Set(
  readdirSync(join(ROOT, 'stages'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => agentNames(join(ROOT, 'stages', e.name, 'template', '.claude', 'agents'))),
);
const BOSS_ONLY_AGENTS = new Set(
  agentNames(join(ROOT, '.claude', 'agents')).filter((n) => !SHIPPED_AGENTS.has(n)),
);

// `docs/MENTORS.md` is the roster/boundary doc — naming the BOSS-only agents, and saying which
// side of the line each sits on, is its entire job. Exempting it is the same call
// `check-wayfinding-drift` makes for its three internal skills.
const AGENT_EXEMPT = new Set([join('docs', 'MENTORS.md')]);
const FOUNDER_FACING = new Set([
  'README.md', 'PRINCIPLES.md',
  join('docs', 'GUIDE.md'), join('docs', 'GUIDE-teams.md'),
  join('docs', 'CHEATSHEET.md'), join('docs', 'SKILLS.md'),
]);

// Backticks required: `mentor-humane` is a reference a founder can act on; the same word loose in a
// sentence is usually the concept, not the agent.
// Scope note: EVERYTHING under stages/, not just `template/*.md`. The narrower first cut missed two
// — a `voice-keeper` mention in the shipped conscience runtime (`moment-frames.js`, a .js file) and
// `mentor-operations` in `stages/L3-scale/README.md` (outside template/). Both ship. The unit test
// in test/scaffold.test.js walks the same ground; two checkers that disagree about scope is how the
// gap reopens.
const AGENT_REF = /`([a-z][a-z0-9-]*)`/g;
for (const f of files.filter((x) => /\.(md|js|json)$/.test(x))) {
  const r = rel(f);
  if (AGENT_EXEMPT.has(r)) continue;
  const shipped = r.startsWith(`stages${sep}`);
  if (!shipped && !FOUNDER_FACING.has(r)) continue;
  const seen = new Set();
  for (const m of readFileSync(f, 'utf8').matchAll(AGENT_REF)) {
    const n = m[1];
    if (seen.has(n) || SHIPPED_AGENTS.has(n)) continue;
    // Two ways to be wrong: it lives only in BOSS's private workspace, or it exists nowhere at all.
    // The `mentor-` namespace is unambiguous enough to police for typos and never-built advisors.
    const why = BOSS_ONLY_AGENTS.has(n) ? "BOSS-only (gitignored /.claude/) — ships to nobody"
      : /^mentor-/.test(n) ? 'exists nowhere — not shipped, not even in BOSS\'s workspace'
        : null;
    if (!why) continue;
    seen.add(n);
    findings.agents.push([r, `${n} — ${why}`]);
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
report('agents', 'PHANTOM AGENTS',
  "a founder-facing file naming an agent the founder's install does not contain.\n  Either ship it under stages/<id>/template/.claude/agents/, or name the mechanism that\n  actually delivers the job (a skill, the conscience, a practice) instead.");

console.log(`  ${total} total. Exit 1.\n`);
process.exit(1);
