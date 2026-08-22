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
// WHAT IT DOES NOT CHECK, stated so nobody reads a clean run as more than it is: prose that
// ENUMERATES a roster without counting it ("architect, GTM and cofounder at MVP") is still
// unguarded. Catching that needs either a hand-maintained vocabulary — which is the thing this
// file refuses to become, because a second list drifts from the first — or real judgment about
// whether a bare word like "business" or "pitch" is naming an agent or just being English.
// The count is the half that is mechanical. The enumeration is the half that is not.

import { readFileSync, existsSync } from 'node:fs';
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

console.log(`\n  ${bold('BOSS · roster claims')} ${dim(`— ${real.agents} agents (${real.builders} builders · ${real.mentors} mentors), from stages/*/manifest.json`)}\n`);

if (!findings.length) {
  console.log(`  ${ok('Every counted roster claim matches the manifests.')}\n`);
  console.log(`  ${dim('Counts only. Prose that ENUMERATES a roster without counting it is still')}`);
  console.log(`  ${dim('unguarded — see this file\'s header for why that half is not mechanical.')}\n`);
  process.exit(0);
}

console.log(`  ${err(`${findings.length} finding${findings.length > 1 ? 's' : ''} — a hand-typed count disagrees with the manifests.`)}\n`);
for (const f of findings) {
  console.log(`      ${f.file}:${f.line}`);
  console.log(`        "${f.claim}" ${dim('→')} ${f.claimed} claimed, ${bold(String(f.actual))} actual ${dim(`(${f.key})`)}`);
}
console.log(`\n  ${dim('The site cannot drift here — gen-site derives these from the manifests.')}`);
console.log(`  ${dim('README.md is the one roster surface still typed by hand.')}\n`);
process.exit(STRICT ? 1 : 0);
