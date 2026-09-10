#!/usr/bin/env node
// BOSS · published state — can a stranger actually install what this repo says it is?
//
// WHY THIS EXISTS (2026-08-23): the README sells three equal install paths. One of them had been
// serving a build from 38 releases earlier for over two weeks.
//
//   repo VERSION  0.217.0   ·   npm oyeboss  0.215.0   ·   tap Formula/oyeboss.rb  0.179.0
//
// Nothing was broken. Nothing existed. There is no CI, there are zero git tags, package.json has no
// publish script, and the formula lives in a second repo (ajeshh/homebrew-boss) that nothing here
// has ever written to. Both publish steps were hand-typed from memory, and memory did what memory
// does: npm got remembered most times, the tap got remembered twice in two months.
//
// THE GATE THAT SHOULD HAVE CARRIED IT DIDN'T NAME IT. `release.js` calls itself "the one command
// that has to pass before a release" and signs off with an enumeration of what's left by hand —
// "registry/CHANGELOG.md entry · /tmp scaffold smoke-test · commit." It stops at `commit`. Someone
// following the gate's own closing instructions ships a green check and believes they released.
// That is `release.js`'s own header comment happening to `release.js`: *"Both worked. Both were
// manual npm scripts wired to nothing."*
//
// AND THE STALE HALF WAS ACTIVELY LYING. src/update.js tells a Homebrew install to run
// `brew upgrade boss`. Against a formula pinned at 0.179.0 that command succeeds, changes nothing,
// and reports success — the exact self-confirming silence update.js was written to end, arriving
// through the one door update.js can't see.
//
// WHY THE TAP IS THE WORSE HALF, structurally: the formula's `url` is the npm tarball, so the tap
// can never be fresher than npm. Two stale links in a chain, and only the second one is advertised
// to macOS users as a first-class install.
//
// WHAT IT CHECKS, and the thresholds, which are the load-bearing design decision:
//
//   · npm vs VERSION — soft at a gap of 1, HARD at 2+. This gate runs BEFORE you publish, so at
//     release time npm is behind by exactly one by construction. Failing on that would be the
//     unsatisfiable gate release.js explicitly refuses to build for the generated docs ("a gate you
//     have to bypass to use is a gate you stop using"). A gap of 2 means a whole release cycle
//     completed and nobody published — the first moment the miss is real rather than expected.
//
//   · tap vs NPM, not vs VERSION — HARD at 1+. The formula can only ever point at a tarball that
//     exists, so npm latest is the only honest target; grading it against VERSION would demand a
//     404. And unlike npm there is no by-construction lag: at gate time the tap should already
//     equal npm. Any gap at all is a step someone skipped.
//
// OFFLINE IS NOT A FINDING. Both lookups are public unauthenticated GETs for a version string, they
// time out fast, and a plane is a normal place to work. No network → say so, exit 0, check nothing.
// Same line src/update.js already holds: a shrug, never a stack trace, never a non-zero exit.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { cmpVersion } from '../src/changelog.js';
import { PKG } from '../src/update.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';

const STRICT = process.argv.includes('--strict');
const TIMEOUT_MS = 5000;

// The tap is a second repo with no checkout guaranteed anywhere, so read the PUBLISHED formula
// rather than a local tap that may itself be un-fetched. What a stranger's `brew install` resolves
// is the only version that matters here.
//
// VIA THE API, NOT raw.githubusercontent.com, and the reason is a bug this check hit on its own
// first run: raw is CDN-cached for ~5 minutes, so the very first `check:published` after pushing a
// tap bump read the PREVIOUS formula and reported the fix as still broken. Harmless in that
// direction — but the same window runs the other way, and a gate that can report a stale PASS for
// five minutes after someone reverts a formula is worse than no gate. The contents API is
// authoritative and rate-limits at 60/hr unauthenticated, which is far more than a release gate
// needs; raw stays as the fallback for the rate-limited case, where being 5 minutes stale beats
// being blind.
const TAP_API = 'https://api.github.com/repos/ajeshh/homebrew-boss/contents/Formula/oyeboss.rb';
const TAP_RAW = 'https://raw.githubusercontent.com/ajeshh/homebrew-boss/HEAD/Formula/oyeboss.rb';
const NPM_LATEST = `https://registry.npmjs.org/${PKG}/latest`;

const VERSION = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();

async function get(url, as = 'json', headers = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return { body: as === 'json' ? await res.json() : await res.text() };
  } catch (e) {
    return { error: e?.name === 'AbortError' ? 'timed out' : 'no network', offline: true };
  } finally {
    clearTimeout(timer);
  }
}

// The three fields a bump has to move together. Read all three, because a formula whose url and
// test assertion disagree installs one version and then verifies a different one.
export function readFormula(text) {
  const url = text.match(/url\s+"[^"]*\/oyeboss-(\d+\.\d+\.\d+)\.tgz"/)?.[1] ?? null;
  const sha = text.match(/sha256\s+"([0-9a-f]{64})"/)?.[1] ?? null;
  const test = text.match(/assert_match\s+"(\d+\.\d+\.\d+)"/)?.[1] ?? null;
  return { url, sha, test };
}

console.log(`\n  ${bold('BOSS published state')}  ${dim('· repo v' + VERSION)}\n`);

const [npmRes, tapRes] = await Promise.all([
  get(NPM_LATEST),
  // Fall back to the cached raw copy only if the API is unavailable — never silently, so the
  // fallback is visible in the output rather than being mistaken for a fresh read.
  get(TAP_API, 'text', { accept: 'application/vnd.github.raw', 'user-agent': 'boss-check-published' })
    .then((r) => (r.error ? get(TAP_RAW, 'text').then((f) => (f.error ? f : { ...f, stale: true })) : r)),
]);

if (npmRes.offline && tapRes.offline) {
  console.log(`  ${dim('No network — skipped. This check needs two public GETs and nothing else.')}\n`);
  process.exit(0);
}

const findings = [];

// --- npm ------------------------------------------------------------------
let npmLatest = null;
if (npmRes.error) {
  console.log(`  ${warn('⚠')} npm  ${dim(`couldn't read the registry (${npmRes.error})`)}`);
} else {
  npmLatest = npmRes.body?.version ?? null;
  const gap = npmLatest ? cmpVersion(VERSION, npmLatest) : null;
  if (!npmLatest) {
    console.log(`  ${warn('⚠')} npm  ${dim('registry response had no version')}`);
  } else if (gap <= 0) {
    console.log(`  ${ok('✓')} npm  ${dim(`${PKG}@${npmLatest} — repo is not ahead`)}`);
  } else {
    const behind = releasesBetween(npmLatest, VERSION);
    const hard = behind >= 2;
    console.log(`  ${hard ? err('✗') : warn('⚠')} npm  ${bold(`${PKG}@${npmLatest}`)} ${dim(`vs repo ${VERSION}`)} — ${bold(String(behind))} unpublished`);
    if (hard) findings.push(`npm is ${behind} releases behind VERSION — a full release cycle shipped without \`npm publish\`.`);
    else console.log(`      ${dim('One ahead is normal mid-release — you publish after this gate passes.')}`);
  }
}

// --- the tap --------------------------------------------------------------
if (tapRes.error) {
  // v0.274.0 — a 404 used to be reported the same way as a timeout: one warn line, no finding,
  // and the summary still printed "Every advertised install path serves what this repo says it
  // is." Found by triggering it — renaming the formula made the advertised path 404 and the gate
  // PASSED. The two failures are not the same kind of thing:
  //   · 404 is DEFINITIVE. The formula is not where this repo tells strangers it is, so
  //     `brew install` fails for everyone. That is the exact condition this gate exists to catch.
  //   · a timeout, a 5xx or a rate-limit means UNKNOWN, and the honest report is "not checked".
  const notFound = String(tapRes.error).includes('404');
  if (notFound) {
    console.log(`  ${err('✗')} tap  ${dim('no formula at the advertised path (HTTP 404)')}`);
    findings.push('The tap has no formula where this repo points — `brew install` is broken for everyone. '
      + 'Either the formula was renamed here and not pushed to the tap, or the tap path is wrong.');
  } else {
    console.log(`  ${warn('⚠')} tap  ${dim(`couldn't read the formula (${tapRes.error}) — NOT CHECKED, not a pass`)}`);
  }
} else {
  const f = readFormula(tapRes.body);
  if (!f.url) {
    console.log(`  ${err('✗')} tap  ${dim('could not parse a version out of Formula/oyeboss.rb')}`);
    findings.push('Formula/oyeboss.rb has no readable `url` version — the bump script cannot target it either.');
  } else {
    // Internal coherence first: url, sha and test assertion must describe ONE version.
    if (f.test && f.test !== f.url) {
      console.log(`  ${err('✗')} tap  ${dim('formula disagrees with itself —')} url ${bold(f.url)} ${dim('vs test')} ${bold(f.test)}`);
      findings.push(`Formula/oyeboss.rb installs ${f.url} and asserts ${f.test}: \`brew test\` verifies a version it did not install.`);
    }
    if (!f.sha) findings.push('Formula/oyeboss.rb has no sha256 — Homebrew cannot verify the tarball it downloads.');

    const target = npmLatest ?? VERSION;
    const gap = cmpVersion(target, f.url);
    if (gap <= 0) {
      console.log(`  ${ok('✓')} tap  ${dim(`Formula/oyeboss.rb at ${f.url} — matches npm`)}${tapRes.stale ? ` ${warn('(via the ~5-min CDN cache — API unavailable)')}` : ''}`);
    } else {
      const behind = releasesBetween(f.url, target);
      console.log(`  ${err('✗')} tap  ${bold(f.url)} ${dim(`vs npm ${target}`)} — ${bold(String(behind))} behind`);
      findings.push(`Formula/oyeboss.rb is ${behind} releases behind npm — \`brew install ajeshh/boss/boss\` serves ${f.url}.`);
    }
  }
}

// How many CHANGELOG entries sit strictly between two versions — the honest unit. "16 versions
// behind" counted off the minor number would be a guess; the changelog knows what actually shipped.
function releasesBetween(low, high) {
  try {
    const text = readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8');
    const all = [...text.matchAll(/^##\s+(\d+\.\d+\.\d+)/gm)].map((m) => m[1]);
    const n = all.filter((v) => cmpVersion(v, low) > 0 && cmpVersion(v, high) <= 0).length;
    if (n) return n;
  } catch { /* fall through to the arithmetic guess */ }
  return Math.abs(cmpVersion(high, low));
}

console.log('');
if (!findings.length) {
  console.log(`  ${ok('✦')} Every advertised install path serves what this repo says it is.\n`);
  process.exit(0);
}

console.log(`  ${err(`${findings.length} finding${findings.length > 1 ? 's' : ''} — an advertised install path is not serving this repo.`)}\n`);
for (const f of findings) console.log(`      ${dim('·')} ${f}`);
console.log(`\n  ${dim('Fix the tap with `npm run bump:formula` (computes the sha256 and moves all three fields).')}`);
console.log(`  ${dim('Fix npm with `npm publish`. Neither is automated — that absence IS the bug this catches.')}\n`);

process.exit(STRICT ? 1 : 0);
