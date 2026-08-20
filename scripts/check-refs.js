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
//   5. WORKSPACE  — a shipped file naming a SKILL that lives only in BOSS's gitignored /.claude/.
//                   Added v0.178.0, after a boundary review found `/vet`, `/recalibrate`,
//                   `/practice-refresh` and `/humane-refresh` named in fifteen shipped files and
//                   installed for nobody. `src/craft.js` printed one to a founder's terminal.
//                   Classes 3 and 4 both nearly caught this and both missed, for reasons worth
//                   keeping: class 3 had the right idea ("a reference is a dependency") but scanned
//                   only `stages/`, while `library/` and `src/` ship too; class 4 had the right
//                   scope but polices agent names only. The direction is the same one already
//                   noted above — /.claude/ is invisible to grep AND to every checker, so it
//                   leaks both ways.
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
const findings = { links: [], predicates: [], escapes: [], agents: [], workspaceSkills: [] };

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

const SHIPPED_ROOTS_DOCS = [`stages${sep}`, `library${sep}`, `src${sep}`, `bin${sep}`];

// --- 3b. shipped files pointing at docs that never leave this repo ----------------------
// The same principle as class 3, aimed at the tier nobody declared. `docs/*.md` splits in two:
// `IDS.md` is copied into every scaffold and resolves in a founder's project; `MENTORS.md`,
// `GUIDE.md`, `CHEATSHEET.md`, `SKILLS.md`, `HUMANE.md`, `PATTERNS.md` and `GUIDE-teams.md` are
// tracked here, published to the website, and installed NOWHERE — they are absent from the npm
// `files:` list and from every template.
//
// WHAT THIS CAUGHT ON ITS FIRST RUN: six shipped files sent founders to `docs/MENTORS.md`.
// Four V1 mentor agents said "create it from the artifact mapping in docs/MENTORS.md if absent"
// and `stages/L0-quickstart/template/CLAUDE.md` — the file EVERY project gets — said "more
// mentors unlock per mode (see docs/MENTORS.md)". None of those projects has the file.
//
// Membership is computed, not listed: a doc is repo-only when no template ships a file of that
// name. Add `docs/FOO.md` to a template tomorrow and this check stops flagging it, with no edit
// here — the same reason class 4 reads its vocabulary off disk.
const templateDocs = new Set(
  walk(join(ROOT, 'stages'))
    .filter((f) => rel(f).includes(`template${sep}docs${sep}`))
    .map((f) => f.slice(f.lastIndexOf(sep) + 1)),
);
//
// TWO ways a `docs/*.md` is NOT this bug, and both must be excluded or the check cries wolf:
//   · a template ships it (`IDS.md`) — it resolves in the founder's project;
//   · `.gitignore` hides it (`RESUME.md`, `mentor-practitioners.md`) — that name belongs to the
//     FOUNDER's own file, written at runtime by `/close`. BOSS's private copy is a coincidence of
//     naming, not a reference. The first cut of this check flagged four `/close` and `/log` call
//     sites for pointing at the file they themselves create.
// `.gitignore` is the tier-1 declaration this repo already has, so it is the discriminator rather
// than a hand-kept exclusion list — one fewer place to forget.
const gitignored = new Set(
  readFileSync(join(ROOT, '.gitignore'), 'utf8').split('\n')
    .map((l) => l.trim()).filter((l) => l.startsWith('docs/'))
    .map((l) => l.slice('docs/'.length).replace(/\/$/, '')),
);
const REPO_ONLY_DOCS = existsSync(join(ROOT, 'docs'))
  ? readdirSync(join(ROOT, 'docs'))
    .filter((f) => f.endsWith('.md') && !templateDocs.has(f) && !gitignored.has(f))
  : [];

for (const f of files.filter((x) => /\.(md|js|json)$/.test(x))) {
  const r = rel(f);
  if (!SHIPPED_ROOTS_DOCS.some((x) => r.startsWith(x))) continue;
  const text = readFileSync(f, 'utf8');
  const seen = new Set();
  for (const d of REPO_ONLY_DOCS) {
    if (seen.has(d) || !new RegExp(`docs/${d.replace('.', '\\.')}`).test(text)) continue;
    seen.add(d);
    findings.escapes.push([r, `docs/${d} — tracked here, installed nowhere (no template ships it)`]);
  }
}

// --- 3c. shipped files pointing INTO a repo-only docs SUBDIRECTORY ---------------------
// Class 3 hard-coded the one subdirectory that had bitten it (`docs/ideas/IDEA-*.md`) and class 3b
// only ever read `docs/*.md` at the top level. So the whole middle tier — `docs/research/`,
// `docs/dossier/`, `docs/architecture/`, `docs/source/`, `docs/business/` — was uncovered, and
// SEVEN shipped files pointed into it. The worst sat in `stages/L1-mvp/template/docs/loops/
// coordination-loop.md`, which is scaffolded into EVERY MVP project: it sent a founder's repo to
// `docs/research/IDEA-037-...md`, a file that has never been in their repo. `check:refs` printed
// "Everything BOSS points at exists" across 485 files the whole time. A check reading green for
// the exact reason it should not — the third time that shape has shown up (v0.171.0 resolved
// against the wrong tree; v0.179.0's release gate enumerated four test files by hand).
//
// THE DISCRIMINATOR, and it has to be this one: **does the path resolve in BOSS's own repo?**
// `docs/<sub>/` names are overwhelmingly RUNTIME conventions in a founder's project — `/red-team`
// writes `docs/red-team/`, `db-architect` writes `docs/architecture/schema.md`, `/decide` writes
// `docs/decisions/DEC-NNN.md`. Those are correct and must never be flagged. What separates them
// from the bug is that the founder's file does not exist HERE. A path that resolves here, inside a
// directory `.gitignore` declares local and no template ships, is by construction BOSS's own file —
// and it dangles in every install. That is class 3's original sentence, applied to subdirectories.
//
// Membership is computed from `.gitignore` + the templates, never listed, for the same reason as
// 3b: add `docs/foo/` to a template tomorrow and this stops flagging it with no edit here.
const shippedDocDirs = new Set(
  walk(join(ROOT, 'stages'))
    .map((f) => rel(f))
    .filter((r) => r.includes(`template${sep}docs${sep}`))
    .map((r) => r.split(`template${sep}docs${sep}`)[1].split(sep)[0]),
);
const repoOnlyDocDirs = readFileSync(join(ROOT, '.gitignore'), 'utf8').split('\n')
  .map((l) => l.trim())
  .filter((l) => l.startsWith('docs/') && l.endsWith('/'))
  .map((l) => l.slice('docs/'.length, -1))
  .filter((d) => !shippedDocDirs.has(d));

// ONE exception, and it is the trap class 3b already documented in its own words: a name can
// belong to BOTH repos. `docs/design/BRAND.md` is BOSS's own brand doc AND the founder-supplied
// brand doc `/landing` and `/pretotype` read — both hedge in the same breath ("or the project's
// brand doc", "if they exist"), because no shipped capability creates it. Resolving here is a
// coincidence of naming, not a reference, exactly as `RESUME.md` is for `/close`. It is listed
// rather than computed because nothing on disk can tell the two apart: BOSS having the file is
// the very thing that makes it look like a bug. Keep this list at the length you can justify —
// every entry is a hole, and the reason must survive being read out loud.
const SHARED_NAMES = new Set(['docs/design/BRAND.md']);

if (repoOnlyDocDirs.length) {
  const SUBDIR = new RegExp(`\\bdocs/(${repoOnlyDocDirs.join('|')})/[A-Za-z0-9._/-]+\\.\\w+`, 'g');
  for (const f of files.filter((x) => /\.(md|js|json)$/.test(x))) {
    const r = rel(f);
    if (!SHIPPED_ROOTS_DOCS.some((x) => r.startsWith(x))) continue;
    const seen = new Set();
    for (const m of readFileSync(f, 'utf8').matchAll(SUBDIR)) {
      const p = m[0];
      if (PLACEHOLDER.test(p) || seen.has(p) || SHARED_NAMES.has(p)) continue;
      // Resolves here = BOSS's own file. Does not resolve = the founder's, written at runtime.
      if (!existsSync(join(ROOT, p))) continue;
      seen.add(p);
      findings.escapes.push([r, `${p} — resolves in BOSS's repo only (docs/${m[1]}/ is gitignored and no template ships it)`]);
    }
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

// Backticks required: `mentor-humane` is a reference a founder can act on; the same word loose in a
// sentence is usually the concept, not the agent.
// Scope note: EVERYTHING under stages/, not just `template/*.md`. The narrower first cut missed two
// — a `voice-keeper` mention in the shipped conscience runtime (`moment-frames.js`, a .js file) and
// `mentor-operations` in `stages/L3-scale/README.md` (outside template/). Both ship. The unit test
// in test/scaffold.test.js walks the same ground; two checkers that disagree about scope is how the
// gap reopens.
// RETIRED SKILLS (added v0.157.0). The agent check below was built when a phantom AGENT bit; the
// first real retirement — four skills merged into two — proved skills are the same class and the
// gate didn't cover them. **Fourteen** shipped files and practices still pointed at `/pmf-check`,
// `/retain`, `/first-dollar` and `/monetize` after they were deleted.
//
// Scoped to the supersede ledger rather than "any /name that isn't a shipped skill": the ledger is
// exactly the set BOSS knows it retired, which makes this precise and false-positive-free. A broad
// pattern would flag `/tmp`, `/dev/null` and every `/verb` in ordinary prose — and a checker that
// cries wolf is one people learn to skip, which is how BOSS's last three checkers died.
// **The retiring release has to clean up after itself. That is the whole point of the check.**
const FOUNDER_FACING = new Set([
  'README.md', 'PRINCIPLES.md',
  join('docs', 'GUIDE.md'), join('docs', 'GUIDE-teams.md'),
  join('docs', 'CHEATSHEET.md'), join('docs', 'SKILLS.md'),
]);

const RETIRED = (() => {
  try {
    const led = JSON.parse(readFileSync(join(ROOT, 'registry', 'supersedes.json'), 'utf8'));
    return (led.supersedes || []).filter((e) => e.kind === 'skill')
      .map((e) => ({ name: e.removed, by: e.replacedBy }));
  } catch { return []; }
})();
for (const f of files.filter((x) => /\.(md|json)$/.test(x))) {
  const r = rel(f);
  // History may name them: the ledger does by definition, and CHANGELOG / RESUME / decisions /
  // research record things that actually happened. But the FOUNDER-FACING docs under `docs/` are
  // exactly as live as a shipped file — excluding all of `docs/` was a scope error in this check's
  // first cut, and it would have let `docs/GUIDE.md` keep pointing at a verb nobody has.
  const historyDoc = r.startsWith(`registry${sep}`)
    || (r.startsWith(`docs${sep}`) && !FOUNDER_FACING.has(r));
  if (historyDoc) continue;
  const text = readFileSync(f, 'utf8');
  for (const { name, by } of RETIRED) {
    // `/name` as a VERB — deliberately not `docs/name/`, which is where a founder's existing
    // artifacts live. The retirement promises those files stay exactly where they are.
    // The SUCCESSOR is allowed to name what it replaced — that isn't a dangling pointer, it's the
    // signpost. A founder who knew `/retain` searches for it and must land on `/health`.
    if (by && r.includes(`${sep}skills${sep}${by}${sep}`)) continue;
    if (new RegExp(`(?<![\\w/])/${name}\\b`).test(text)) {
      findings.agents.push([r, `/${name} — retired skill${by ? `, now /${by}` : ''}`]);
    }
  }
}

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

// --- 5. workspace-only skills named in shipped files ------------------------------------
// THE HOLE THIS PLUGS: class 4 polices AGENT names and the retired-skill ledger polices verbs
// BOSS deliberately removed. Neither covers the third way a name can dangle — a skill that was
// never retired and never shipped, because it was authored in BOSS's own gitignored `/.claude/`
// and stayed there. `/vet`, `/recalibrate`, `/practice-refresh` and `/humane-refresh` were named
// in fifteen shipped files while existing for nobody but BOSS.
//
// Two scope corrections this check makes, and both are why the earlier classes missed it:
//   · SURFACE. Class 3 scans `stages/` only. But `library/` and `src/` ship too (package.json
//     `files:`), and that is where most of these lived — `src/craft.js` printed "/practice-refresh"
//     to a founder's real terminal, and nine practices a founder reads via `boss craft` named
//     `/vet`. A checker scoped to the templates cannot see the shelf or the CLI.
//   · LINK FORM. Class 1 resolves relative links with existsSync — so a link into
//     `../../.claude/skills/humane-refresh/SKILL.md` PASSES here and dangles in every install.
//     That is class 3's own stated failure mode ("it resolves here and dangles"), reached by a
//     path class 3's regex doesn't match. Hence form (b) below.
//
// Vocabulary from disk, never a regex over prose — same rule as class 4, same reason.
const skillDirs = (dir) => (existsSync(dir)
  ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : []);

const SHIPPED_SKILLS = new Set(
  readdirSync(join(ROOT, 'stages'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => skillDirs(join(ROOT, 'stages', e.name, 'template', '.claude', 'skills'))),
);
const WORKSPACE_SKILLS = skillDirs(join(ROOT, '.claude', 'skills'))
  .filter((n) => !SHIPPED_SKILLS.has(n));

// Everything a founder can end up holding: the templates, the practice shelf, and the CLI itself.
const SHIPPED_ROOTS = [`stages${sep}`, `library${sep}`, `src${sep}`, `bin${sep}`];

// `provenance:` is the internal build record BY DECLARATION — it says how BOSS came to believe a
// practice, and "vetted via /vet RVW-005" is a true statement about BOSS's own history. That field
// is not published (gen-site renders `provenance_public:`), so it is the one place these names are
// allowed to stand. Strip those lines rather than exempting whole files: the same practice's BODY
// must still be clean, because the body is what `boss craft` prints.
const stripProvenance = (t) => t.replace(/^provenance:[\s\S]*?(?=\n[a-z_]+:|\n---)/m, '');

for (const f of files.filter((x) => /\.(md|js|json)$/.test(x))) {
  const r = rel(f);
  if (r.startsWith(`stages${sep}`) && r.includes(`${sep}skills${sep}boss-learn${sep}`)) continue;
  if (!SHIPPED_ROOTS.some((s) => r.startsWith(s)) && !FOUNDER_FACING.has(r)) continue;
  const text = stripProvenance(readFileSync(f, 'utf8'));
  const seen = new Set();
  for (const n of WORKSPACE_SKILLS) {
    if (seen.has(n)) continue;
    // (a) the verb, and (b) any path into a workspace skill's directory.
    const verb = new RegExp(`(?<![\\w/])/${n}\\b`).test(text);
    const path = new RegExp(`\\.claude/skills/${n}\\b`).test(text);
    if (!verb && !path) continue;
    seen.add(n);
    findings.workspaceSkills.push([r, `/${n} — BOSS-only (gitignored /.claude/skills/) — ships to nobody${path ? ', linked by path' : ''}`]);
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

report('workspaceSkills', 'WORKSPACE-ONLY SKILLS',
  "a SHIPPED file naming a skill that exists only in BOSS's gitignored /.claude/ workspace.\n  It resolves when you run it from here and dangles in every founder's install. Either ship it\n  under stages/<id>/template/.claude/skills/, or say what the founder actually does instead.");

console.log(`  ${total} total. Exit 1.\n`);
process.exit(1);
