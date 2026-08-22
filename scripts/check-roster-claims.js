#!/usr/bin/env node
// BOSS · roster claims — does hand-typed prose still agree with the manifests?
//
// WHY THIS EXISTS (v0.210.0): the README sold "**Eight advisors** ... business, fundraising,
// pitch and talent at V1." Six ship. `mentor-fundraising` and `mentor-pitch` were absorbed into
// `mentor-capital` at v0.189.0 (DEC-006), and V1 seats NOBODY, deliberately. The claim sat on
// the npm and GitHub front page for 14 releases.
//
// EVERY EXISTING CHECK LOOKED STRAIGHT PAST IT, and the reason is the interesting part:
//   · check-refs class 4 matches AGENT NAMES (`mentor-fundraising`). The README said the same
//     thing in PROSE — "business, fundraising, pitch and talent" — with no `mentor-` to match on.
//   · check-site validates the generated site, and the site CANNOT drift here: gen-site.js
//     derives its roster counts from stages/*/manifest.json via src/modes.js, "never typed by
//     hand". README.md is the one roster surface that is still typed by hand.
// Third instance in one session of a rule enforced on one surface and unread on another.
//
// WHAT IT CHECKS, and deliberately only this: a NUMBER next to a roster noun. "Eight advisors",
// "6 mentors", "five builders". Those are checkable against the manifests with no judgment and
// no second word list to maintain.
//
// SECOND CLASS, added v0.212.0 — VERIFICATION claims. The same disease at a different noun:
// README told founders the gate-eval suite was "143 passing" when it was 152, and
// docs/PATTERNS.md advertised "57 cases" of unit tests against a real 181 and "43
// golden-transcript cases" against 50. registry/dogfood.json justified an EXEMPTION with
// "143 eval cases". Four surfaces, all hand-typed, all drifted, none read by anything.
//
// The two classes have DIFFERENT truth sources and that difference is the finding:
//   · unit tests are TRACKED (`test/`), so the count is derivable and this file guards it.
//   · the eval counts need the suite RUN, which this gate deliberately does not do (it is the
//     fast one). `npm run release` runs it and checks all five phrasings. Listed here, not
//     checked here — so a clean run of this file is never mistaken for eval coverage.
//
// v0.213.0 — the suite is now TRACKED (DEC-013), so those claims became verifiable from a fresh
// clone for the first time. Before that they were unverifiable by anyone, which is what made
// four of them wrong for nine releases. The cases and runners are tests and are tracked; the
// recorded transcripts stay local, because a voice-hash marks them STALE when a frame is edited.
//
// The file keeps its v0.210.0 name so the changelog entry that introduced it stays navigable.
//
// WHAT IT DOES NOT CHECK, stated so nobody reads a clean run as more than it is: prose that
// ENUMERATES a roster without counting it ("architect, GTM and cofounder at MVP") is still
// unguarded. Catching that needs either a hand-maintained vocabulary — which is the thing this
// file refuses to become, because a second list drifts from the first — or real judgment about
// whether a bare word like "business" or "pitch" is naming an agent or just being English.
// The count is the half that is mechanical. The enumeration is the half that is not.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { loadModes } from '../src/modes.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';

const STRICT = process.argv.includes('--strict');

const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
                nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14 };

// Roster nouns → how to count the real thing from the manifests.
const NOUNS = {
  advisors: 'mentors', advisor: 'mentors', mentors: 'mentors', mentor: 'mentors',
  builders: 'builders', builder: 'builders',
  agents: 'agents', agent: 'agents',
};

// `loadModes()` returns agent NAMES (strings). The `mentor-` prefix is the class marker —
// docs/MENTORS.md: "the prefix keeps the two classes legible" — so it is also the only thing
// that needs reading here. Deriving it beats a second list, which is the whole point.
function truth() {
  const names = loadModes().flatMap((m) => m.agents);
  return {
    agents: names.length,
    mentors: names.filter((n) => n.startsWith('mentor-')).length,
    builders: names.filter((n) => !n.startsWith('mentor-')).length,
  };
}

// README.md ONLY, and the narrowness is the point — it follows this file's own reasoning
// rather than scanning everything it can reach. `web/` and `site/` cannot drift here:
// gen-site derives every roster count from stages/*/manifest.json, "never typed by hand",
// and the build runs in the release gate. Scanning them adds no coverage and costs
// precision — the first run over `web/` produced two findings and BOTH were false: one page
// QUOTES "15 agents" as the hypothetical it exists to prevent, and another says "most tools
// would make that three advisors" about other people's tools. Neither is a claim about
// BOSS's roster, and no amount of regex reliably tells a claim from a quotation or a
// counterfactual. A check that cries wolf is a check somebody switches off.
function surfaces() {
  return existsSync(join(BOSS_ROOT, 'README.md')) ? ['README.md'] : [];
}

const real = truth();
const findings = [];

// A number (word or digit), optionally one adjective, then a PLURAL roster noun.
// Plural-only on purpose: "one mentor" / "a single agent" is almost always English rather
// than a roster count ("you don't get one mentor per question"), and a check that cries wolf
// on ordinary prose is a check somebody switches off. Under-firing is the right direction —
// the same argument the conscience's own predicates make.
const RE = new RegExp(`\\b(${Object.keys(WORDS).join('|')}|\\d{1,3})\\b(?:\\s+[a-z-]+)?\\s+(${Object.keys(NOUNS).filter((n) => n.endsWith('s')).join('|')})\\b`, 'gi');

for (const rel of surfaces()) {
  const text = readFileSync(join(BOSS_ROOT, rel), 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      const raw = m[1].toLowerCase();
      const claimed = WORDS[raw] ?? Number(raw);
      const key = NOUNS[m[2].toLowerCase()];
      const actual = real[key];
      if (!Number.isFinite(claimed) || claimed !== actual) {
        findings.push({ file: rel, line: i + 1, claim: m[0].trim(), claimed, actual, key });
      }
    }
  });
}

// ── SECOND CLASS: verification claims ───────────────────────────────────────────────
//
// Truth for unit tests is derivable from TRACKED files and is exact: every test in this repo
// is declared at column 0 as `test(`, none nested, so the static count equals the runtime
// pass count. Verified at v0.212.0 — 181 both ways. If nested tests ever appear this goes
// wrong QUIETLY, so it asserts the shape rather than trusting it.
function unitTestTruth() {
  const dir = join(BOSS_ROOT, 'test');
  if (!existsSync(dir)) return null;
  let total = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.test.js'))) {
    const body = readFileSync(join(dir, f), 'utf8');
    total += (body.match(/^test\(/gm) || []).length;
    // `[ \t]` not `\s`: in JS `\s` matches \n, so `^\s+test\(` fires on any blank line
    // before a top-level test — which it did, on the first run, reporting 181 as UNCOUNTABLE.
    if (/^[ \t]+test\(/m.test(body)) return null;   // nested — the static count is no longer exact
  }
  return total;
}

// Phrasings taken from the four surfaces as actually written, not invented. A novel phrasing
// is invisible here, which is the same honest limit the roster half declares above.
const VERIFIED_CLAIMS = [
  { key: 'unitTests', label: 'unit tests', re: /\b(\d{1,4})\s+unit tests?\b/gi },
  { key: 'unitTests', label: 'unit tests', re: /unit tests[^\n]*?\*\*(\d{1,4}) cases?\*\*/gi },
];

// Same shape, no truth source in TRACKED files. Listed, never failed.
//
// `release` is the one thing that can check these, because it RUNS the local suite — but it
// only ever matched two phrasings, and it is not what sessions actually run (that is `npm test`
// and `npm run check`). The two it does cover are mirrored here so this report can say which
// claims are merely local-only and which are unguarded everywhere. Keep the pair in sync: if
// release.js grows a claim regex, add it here.
const RELEASE_GUARDED = [
  /gate-eval suite \((\d+) passing\)/,
  /\*\*(\d+) cases \/ 0 failures\*\*/,
  /(\d+)-case eval gate/,
  /(\d+) eval cases/,
  /(\d+) golden-transcript cases/,
];

const UNVERIFIABLE_CLAIMS = [
  { label: 'gate-eval cases',  re: /\b(\d{1,4})[- ]case eval gate\b/gi },
  { label: 'gate-eval cases',  re: /gate-eval suite \((\d{1,4}) passing\)/gi },
  { label: 'gate-eval cases',  re: /\b(\d{1,4}) eval cases?\b/gi },
  { label: 'gate-eval cases',  re: /\*\*(\d{1,4}) cases? \/ 0 failures\*\*/gi },
  { label: 'judgment cases',   re: /\b(\d{1,4}) golden-transcript cases?\b/gi },
];

const VERIFY_SURFACES = ['README.md', 'docs/PATTERNS.md', 'registry/dogfood.json']
  .filter((f) => existsSync(join(BOSS_ROOT, f)));

const units = unitTestTruth();
const verifyFindings = [];
const unverifiable = [];

for (const rel of VERIFY_SURFACES) {
  const lines = readFileSync(join(BOSS_ROOT, rel), 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const c of VERIFIED_CLAIMS) {
      for (const m of line.matchAll(c.re)) {
        const claimed = Number(m[1]);
        const actual = c.key === 'unitTests' ? units : null;
        if (actual != null && claimed !== actual) {
          verifyFindings.push({ file: rel, line: i + 1, claim: m[0].trim(), claimed, actual, key: c.label });
        }
      }
    }
    for (const c of UNVERIFIABLE_CLAIMS) {
      for (const m of line.matchAll(c.re)) {
        unverifiable.push({ file: rel, line: i + 1, claim: m[0].trim(), key: c.label,
          rel: RELEASE_GUARDED.some((g) => g.test(m[0])) });
      }
    }
  });
}

// ── report ──────────────────────────────────────────────────────────────────────────
console.log(`\n  ${bold('BOSS · counted claims')} ${dim(`— ${real.agents} agents (${real.builders} builders · ${real.mentors} mentors) from stages/*/manifest.json · ${units == null ? 'unit tests UNCOUNTABLE' : `${units} unit tests`} from test/`)}\n`);

if (!findings.length) {
  console.log(`  ${ok('Every counted roster claim matches the manifests.')}`);
} else {
  console.log(`  ${err(`${findings.length} roster finding${findings.length > 1 ? 's' : ''} — a hand-typed count disagrees with the manifests.`)}\n`);
  for (const f of findings) {
    console.log(`      ${f.file}:${f.line}`);
    console.log(`        "${f.claim}" ${dim('→')} ${f.claimed} claimed, ${bold(String(f.actual))} actual ${dim(`(${f.key})`)}`);
  }
}

if (units == null) {
  console.log(`  ${warn('Unit-test count skipped — a nested test() appeared, so the static count is no longer exact.')}`);
} else if (!verifyFindings.length) {
  console.log(`  ${ok('Every counted unit-test claim matches test/.')}`);
} else {
  console.log(`\n  ${err(`${verifyFindings.length} verification finding${verifyFindings.length > 1 ? 's' : ''} — advertised test counts disagree with test/.`)}\n`);
  for (const f of verifyFindings) {
    console.log(`      ${f.file}:${f.line}`);
    console.log(`        "${f.claim}" ${dim('→')} ${f.claimed} claimed, ${bold(String(f.actual))} actual ${dim(`(${f.key})`)}`);
  }
}

if (unverifiable.length) {
  console.log(`\n  ${dim(`${unverifiable.length} eval claim${unverifiable.length > 1 ? 's' : ''} in tracked prose — checked by \`npm run release\`, not here:`)}\n`);
  for (const f of unverifiable) {
    console.log(`      ${f.file}:${f.line}  ${dim('·')} "${f.claim}" ${dim(`(${f.key})`)}` +
      (f.rel ? ` ${dim('— npm run release checks this')}` : ` ${bold('— unguarded everywhere')}`));
  }
  const bare = unverifiable.filter((f) => !f.rel).length;
  console.log(`\n  ${dim('Verifying these needs the suite RUN, which this gate does not do — it is the fast one.')}`);
  console.log(`  ${dim('The suite is TRACKED as of v0.213.0 (DEC-013), so a fresh clone can now check them;')}`);
  console.log(`  ${dim('before that nobody could, which is how four went wrong for nine releases.')}`);
  if (bare) console.log(`  ${warn(`${bare} of ${unverifiable.length} are unguarded in release.js too — add the phrasing there.`)}`);
}

console.log(`\n  ${dim('Counts only. Prose that ENUMERATES without counting is still unguarded — see the header.')}\n`);

const hard = findings.length + verifyFindings.length;
process.exit(hard && STRICT ? 1 : 0);
