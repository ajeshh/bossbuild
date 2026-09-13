#!/usr/bin/env node
// BOSS release gate (v0.129.0) — the one command that has to pass before a release.
//
//   npm run release            run every check, fail on the first hard problem
//   npm run release -- --fast  skip the eval gate (structure + docs only)
//
// WHY THIS EXISTS — the finding that produced it (REVIEW-2026-07-28 §E3):
// BOSS already had the right de-rot tools. `gen-docs.js` regenerates CHEATSHEET/SKILLS
// from the manifests; `check-wayfinding-drift.js` catches prose falling behind. Both
// worked. Both were manual npm scripts wired to nothing. So `docs/CHEATSHEET.md` sat at
// "current as of v0.72.0" for **56 consecutive releases** while the README described those
// same files as "generated from the source, so they never drift," and nobody was lying —
// the loop that checks just never ran.
//
// That is the exact failure BOSS exists to catch in a founder's project: a system growing
// faster than the loops that check it. The fix is not more discipline; it's one gate on the
// path the work actually takes. This is that gate.
//
// PRINCIPLE #2 NOTE (it applies to BOSS's own tooling too): every check here earns its
// place by having ALREADY caught a real shipped bug — no speculative checks, no lint
// theater. Interactive runs of the underlying scripts stay nudges; only `release` has teeth.

import { execFileSync, execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { loadModes } from '../src/modes.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';
import { RESUME_WINDOW, resumeLines } from '../src/orientation.js';

import { unreleased, unreleasedHasContent, nextVersion, stampUnreleased } from '../src/changelog.js';

const fast = process.argv.includes('--fast');

// --- --stamp: turn `## Unreleased` into the next version (DEC-019, 2026-09-13) ---------------
// Capabilities land as commits plus a bullet under `## Unreleased`; VERSION does not move. The
// releaser — at publish — runs `npm run release -- --stamp`: the heading becomes the next number
// and today's date, VERSION / package.json / plugin.json move with it, and the gate below then
// verifies the result. Explicit on purpose: a session running the gate "to check" must never mint
// a version, because minting one per capability is the habit this retires.
if (process.argv.includes('--stamp')) {
  const clPath = join(BOSS_ROOT, 'registry', 'CHANGELOG.md');
  const cl = readFileSync(clPath, 'utf8');
  const current = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
  if (!unreleasedHasContent(cl)) {
    console.log(`\n  ${warn('⚠')} Nothing under \`## Unreleased\` — nothing to stamp. VERSION stays ${current}.\n`);
    process.exit(0);
  }
  const next = nextVersion(current);
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  writeFileSync(clPath, stampUnreleased(cl, next, date));
  writeFileSync(join(BOSS_ROOT, 'VERSION'), `${next}\n`);
  for (const f of ['package.json', join('.claude-plugin', 'plugin.json')]) {
    const abs = join(BOSS_ROOT, f);
    const doc = JSON.parse(readFileSync(abs, 'utf8'));
    doc.version = next;
    writeFileSync(abs, JSON.stringify(doc, null, 2) + '\n');
  }
  const bullets = unreleased(readFileSync(clPath, 'utf8')).body.length; // now empty; report from before
  console.log(`\n  ${ok('✦')} Stamped ${bold('v' + next)} — \`## Unreleased\` is now \`## ${next} — ${date}\`; VERSION, package.json and plugin.json moved with it.`);
  void bullets;
}

const VERSION = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();

const results = [];
const record = (name, pass, detail, soft = false) => {
  results.push({ name, pass, detail, soft });
  const mark = pass ? ok('✓') : soft ? warn('⚠') : err('✗');
  console.log(`  ${mark} ${name}${detail ? `  ${dim(detail)}` : ''}`);
};

const run = (cmd, args) => {
  try {
    return { code: 0, out: execFileSync(cmd, args, { cwd: BOSS_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
};

console.log(`\n  ${bold('BOSS release gate')}  ${dim('· v' + VERSION + (fast ? ' · --fast' : ''))}\n`);

// --- 1. VERSION and package.json agree ------------------------------------
// They have drifted before (RESUME notes package.json sat at 0.97.0 while VERSION moved).
{
  const pkg = JSON.parse(readFileSync(join(BOSS_ROOT, 'package.json'), 'utf8'));
  record('VERSION ↔ package.json', pkg.version === VERSION,
    pkg.version === VERSION ? VERSION : `VERSION ${VERSION} vs package.json ${pkg.version}`);
  // The plugin manifest pins its own version, and Claude Code only updates an installed plugin
  // when that string moves — a stale one is a plugin frozen at the release it was written in
  // (DEC-017). Same check, third copy of the same number.
  const plugin = JSON.parse(readFileSync(join(BOSS_ROOT, '.claude-plugin', 'plugin.json'), 'utf8'));
  record('VERSION ↔ .claude-plugin/plugin.json', plugin.version === VERSION,
    plugin.version === VERSION ? VERSION : `VERSION ${VERSION} vs plugin.json ${plugin.version}`);

  // --- 1a. the number is honest --------------------------------------------------------------
  // Since DEC-019 a capability no longer bumps VERSION, so VERSION equal to HEAD's with new work
  // in the tree is the ORDINARY state, not a collision. What still cannot be true: VERSION older
  // than what is committed here or on origin (a stale read), or VERSION ahead of HEAD without a
  // CHANGELOG entry for it (a bump by hand, skipping the stamp), or a stamped version whose
  // `## Unreleased` above it still carries content (stamped, then kept landing under the old heading).
  {
    const semver = (v) => String(v || '').trim().split('.').map(Number);
    const newer = (a, b) => { const [x, y] = [semver(a), semver(b)]; for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
    const committed = (ref) => { const r = run('git', ['show', `${ref}:VERSION`]); return r.code === 0 ? r.out.trim() : null; };
    const head = committed('HEAD');
    const origin = committed('origin/main');
    const cl = readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8');
    const hasEntry = new RegExp(`^## ${VERSION.replace(/\./g, '\\.')}\\b`, 'm').test(cl);
    let verdict = null;
    if (head && newer(head, VERSION)) verdict = `HEAD already carries ${head} — this tree read VERSION before a peer stamped; re-read`;
    else if (origin && newer(origin, VERSION)) verdict = `origin/main already carries ${origin} — pull first`;
    else if (head && newer(VERSION, head) && !hasEntry) verdict = `VERSION was bumped to ${VERSION} by hand with no CHANGELOG entry — \`npm run release -- --stamp\` is how a version is made`;
    else if (!hasEntry) verdict = `no \`## ${VERSION}\` entry in the CHANGELOG`;
    const pending = unreleasedHasContent(cl);
    record('VERSION is honest', !verdict, verdict || `${VERSION}${head === VERSION ? ' = HEAD' : ` > ${head || '(no commit)'}`}${pending ? ' · work under ## Unreleased awaits a stamp' : ''}`);
  }
}

// --- 1b. the unit suite ---------------------------------------------------
// Cheap (<1s) and it locks every bug this audit found, so it runs early — a red suite
// makes the rest of the gate's output noise.
//
// DISCOVERED, never listed. This was a hardcoded four-file list, so `design-tokens-guard.test.js`
// and `ladder.test.js` were both invisible to the release gate while `npm test` ran them — the gate
// reported 107 passing out of 131. A gate that silently covers a subset is the same defect class as
// a check resolving against the wrong surface: it reads green for the exact reason it should not.
{
  const files = readdirSync(join(BOSS_ROOT, 'test'))
    .filter((f) => f.endsWith('.test.js'))
    .sort()
    .map((f) => join('test', f));
  const r = run('node', ['--test', ...files]);
  const pass = (r.out.match(/^. pass (\d+)/m) || [, '?'])[1];
  const fail = (r.out.match(/^. fail (\d+)/m) || [, '?'])[1];
  record('unit tests', r.code === 0 && fail === '0', `${pass} passed · ${fail} failed`);
  if (r.code !== 0) console.log(r.out.split('\n').filter((l) => /^✖|AssertionError|at Test/.test(l)).slice(0, 20).join('\n'));
}

// --- 3. generated docs are current ---------------------------------------
// Regenerate, then ask git whether that changed anything. If it did, the COMMITTED versions
// were stale — the 56-release bug — and they are now fixed ON DISK, so this release cannot
// ship them stale. That report is therefore ADVISORY, not blocking: blocking it would be
// unsatisfiable by construction (you commit *after* the gate passes, so the first run after
// any staleness could never go green, and a gate you have to bypass to use is a gate you
// stop using — the exact way these checks got ignored in the first place).
// What stays HARD: the generator erroring, and the version stamp inside the output being
// wrong. Those are real "don't ship this" conditions.
{
  const GEN = ['docs/CHEATSHEET.md', 'docs/SKILLS.md'];
  const r = run('node', [join('scripts', 'gen-docs.js')]);
  if (r.code !== 0) {
    record('generated docs', false, 'gen-docs.js failed');
    console.log(r.out.trimEnd());
  } else {
    let dirty = '';
    try { dirty = execSync(`git diff --name-only -- ${GEN.join(' ')}`, { cwd: BOSS_ROOT, encoding: 'utf8' }).trim(); }
    catch { /* not a git checkout — skip */ }
    record('generated docs current', !dirty,
      dirty ? `were stale — regenerated ${dirty.split('\n').length} file(s) on disk; include them in this commit` : GEN.join(' · '),
      true);
  }
  // The stamped version inside the generated docs must match VERSION.
  for (const f of GEN) {
    const p = join(BOSS_ROOT, f);
    if (!existsSync(p)) { record(`${f} present`, false, 'missing'); continue; }
    const m = readFileSync(p, 'utf8').match(/current as of \*\*v([\d.]+)\*\*/);
    record(`${f} stamp`, !!m && m[1] === VERSION, m ? `v${m[1]}` : 'no version stamp found');
  }
}

// --- 3b. the website ------------------------------------------------------
// Same discipline as the generated docs, pointed at site/. The roster, the skill
// reference and every count on the site are derived from the stage manifests, so a
// release can never ship a website that disagrees with the product. (Typing "15 agents"
// into a page by hand is precisely how CHEATSHEET.md drifted for 56 releases.)
// Soft on staleness (it regenerates on disk — commit it), HARD on the generator
// erroring or the version stamp being wrong.
{
  const r = run('node', [join('scripts', 'gen-site.js')]);
  if (r.code !== 0) {
    record('generated site', false, 'gen-site.js failed');
    console.log(r.out.trimEnd());
  } else {
    let dirty = '';
    try { dirty = execSync('git diff --name-only -- site/ web/', { cwd: BOSS_ROOT, encoding: 'utf8' }).trim(); }
    catch { /* not a git checkout — skip */ }
    record('generated site current', !dirty,
      dirty ? `was stale — regenerated ${dirty.split('\n').length} file(s) on disk; include them in this commit` : 'site/ up to date',
      true);
  }
  const dataPath = join(BOSS_ROOT, 'web', '_data.json');
  if (!existsSync(dataPath)) {
    record('site/_data.json present', false, 'missing');
  } else {
    const d = JSON.parse(readFileSync(dataPath, 'utf8'));
    record('site version stamp', d.version === VERSION, d.version ? `v${d.version}` : 'no version');
    // A website that quietly reports zero agents is worse than one that is a release behind.
    record('site roster non-empty', d.agents > 0 && d.skills > 0, `${d.agents} agents · ${d.skills} skills`);
  }
}

// --- 3c. the standing gates, once ------------------------------------------------------
// Eight checkers used to be re-implemented here, each with its own wording, and the same
// checkers were listed again in package.json — two lists, and they disagreed: v0.212.0 named
// "a checker in one gate is a checker half-installed" and five were still half-installed at
// v0.323.0 (check-help, check-refs, check-boundary, check-pattern-coverage, check-deployed).
// The list now lives in ONE place, package.json's `check`, and this gate runs it. A checker is
// in the gate or it is not. It runs here, after regeneration, because check-site reads the
// regenerated site. Everything a checker itself treats as advisory still exits 0 there and so
// stays advisory here; nothing got stricter by moving.
//
// What the folded blocks each caught, so the reasons are not lost with the wording: L3's
// phantom operate-loop and a moment with no frame (manifests) · two practices with no
// frontmatter that no refresh discipline could see (freshness) · ~47 skills of which four asked
// whether the founder already had the thing (ladder) · 21 of 64 records disagreeing with their
// own INDEX row (backlog) · a shipped brain BOSS had never written (dogfood) · four advertised
// counts drifted (roster) · a site promising a command that no longer existed (site) · a GUIDE
// that named 45 of 48 skills (wayfinding).
{
  const r = run('npm', ['run', 'check', '--silent']);
  record('standing gates (npm run check)', r.code === 0,
    r.code === 0 ? 'every checker in package.json `check` is green' : 'see output below');
  if (r.code !== 0) console.log(r.out.trimEnd());
  // A release is exactly the moment the website goes stale: something shipped, and the page
  // describing it didn't move. Soft (never block a release on prose) but named loudly.
  const trailing = (r.out.match(/(\d+) trailing/) || [, '0'])[1];
  record('website keeps up', trailing === '0',
    trailing === '0' ? 'no page trails what it documents'
      : `${trailing} page(s) document something that changed since they were reviewed — npm run check:site`,
    true);
}

// --- 5. no "not authored yet" claim about an authored mode ---------------
// README said "Scale is stubbed" and GUIDE said "Not authored yet" for 21 releases after
// Scale shipped slices 1-2. A mode's authored-ness is knowable; assert against it.
{
  const authored = loadModes().filter((m) => m.authored).map((m) => m.name);
  const problems = [];
  // Find the not-authored PHRASE first, then look only at the text immediately around it
  // for a mode name. Matching "any authored mode named anywhere on the line" reported the
  // same README sentence four times — and a gate that cries wolf is a gate someone turns
  // off, which is how the checks got ignored in the first place.
  const PHRASE = /(stubbed|not authored yet|isn't authored|not yet authored)/gi;
  for (const f of ['README.md', 'docs/GUIDE.md', 'docs/CHEATSHEET.md']) {
    const text = readFileSync(join(BOSS_ROOT, f), 'utf8');
    for (const m of text.matchAll(PHRASE)) {
      const before = text.slice(Math.max(0, m.index - 60), m.index);
      const after = text.slice(m.index, m.index + 40);
      const named = authored.find((name) => new RegExp(`\\b${name}\\b`).test(before + after));
      if (!named) continue; // phrase about something other than a mode — not our business
      const line = text.slice(0, m.index).split('\n').length;
      const snippet = (before.split('\n').pop() + m[0]).trim().slice(-84);
      problems.push(`${f}:${line} — ${named} IS authored: "…${snippet}"`);
    }
  }
  record('no stale "not authored" claims', problems.length === 0, problems.length ? '' : `${authored.length} authored mode(s)`);
  for (const p of problems) console.log(`      ${dim('·')} ${p}`);
}

// --- 6. context budget (report, not a gate) ------------------------------
// BOSS ships context-discipline.md; measure itself against it. A number that grows every
// release should be visible at the moment you decide to release.
{
  const walk = (d, out = []) => {
    for (const n of readdirSync(d)) {
      const f = join(d, n);
      if (statSync(f).isDirectory()) walk(f, out);
      else if (n === 'SKILL.md' || (f.includes(`${'.claude'}/agents/`) && n.endsWith('.md'))) out.push(f);
    }
    return out;
  };
  let chars = 0, n = 0;
  for (const f of walk(join(BOSS_ROOT, 'stages'))) {
    const m = readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const d = (m[1].match(/^description:\s*(.*)$/m) || [, ''])[1];
    if (d) { chars += d.length; n++; }
  }
  const tokens = Math.round(chars / 4);
  record('standing context budget', tokens <= 12000,
    `${n} descriptions ≈ ${tokens.toLocaleString()} tok at full unlock${tokens > 12000 ? ' — over the 12k ceiling' : ''}`, true);
}

// --- 7. RESUME.md stays inside its window --------------------------------
// Was an advisory here at ~400 lines, and the file reached 737 two days after an archive pass —
// an advisory in the script nobody runs is a gate on paper. The hard check now lives in
// `check-dogfood.js` (part of `npm run check`, step 4 above) at the window `/close` ships and
// `boss status` reads (IDEA-102). This line only reports what that gate already enforced.
{
  const lines = resumeLines(BOSS_ROOT);
  if (lines != null) record('RESUME.md window', lines <= RESUME_WINDOW, `${lines} of ${RESUME_WINDOW} lines`);
}

// --- 8. the eval gate ---------------------------------------------------
// Last because it's the slow one. Also parses the passed count so the README's claim
// about it can be checked against reality rather than memory.
let gatePassed = null;
if (!fast) {
  const r = run('node', ['docs/architecture/conscience-evals/runner.js']);
  const m = r.out.match(/passed:\s*(\d+)/);
  const failed = (r.out.match(/failed:\s*(\d+)/) || [, '?'])[1];
  gatePassed = m ? Number(m[1]) : null;
  record('conscience eval gate', r.code === 0 && failed === '0',
    gatePassed != null ? `${gatePassed} passed · ${failed} failed` : 'could not parse runner output');
  if (r.code !== 0 || failed !== '0') console.log(r.out.split('\n').slice(-25).join('\n'));

  // Every doc that quotes the gate's number, checked against the number. Both README and
  // PATTERNS.md had drifted (105 vs the real 129) — a claim about your own rigour is the
  // worst one to leave stale, so the gate verifies it rather than trusting a memory.
  //
  // v0.212.0 — this guard was CORRECT and still let four numbers rot, because it only knew
  // two phrasings. README said "143 passing" and PATTERNS "143 cases / 0 failures" — both
  // matched — while `registry/dogfood.json` said "a 143-case eval gate" and "143 eval cases"
  // in the same breath, and PATTERNS advertised "43 golden-transcript cases" against 50.
  // Three surfaces the regex could not see. Truth for the judgment half is a case count, not
  // a run, so it is derived separately.
  const judgmentTruth = (() => {
    const d = join(BOSS_ROOT, 'docs', 'architecture', 'conscience-evals', 'judgment');
    if (!existsSync(d)) return null;
    let n = 0;
    for (const f of readdirSync(d).filter((x) => x.endsWith('.judgment.yml'))) {
      n += (readFileSync(join(d, f), 'utf8').match(/^\s*- id:/gm) || []).length;
    }
    return n || null;
  })();

  const claims = [
    ['README.md', /gate-eval suite \((\d+) passing\)/, gatePassed],
    ['docs/PATTERNS.md', /\*\*(\d+) cases \/ 0 failures\*\*/, gatePassed],
    ['registry/dogfood.json', /(\d+)-case eval gate/, gatePassed],
    ['registry/dogfood.json', /(\d+) eval cases/, gatePassed],
    ['docs/PATTERNS.md', /(\d+) golden-transcript cases/, judgmentTruth],
  ];
  for (const [f, re, truth] of claims) {
    if (truth == null) continue;
    const m = readFileSync(join(BOSS_ROOT, f), 'utf8').match(re);
    if (!m) continue;
    record(`${f} — "${m[0]}"`, Number(m[1]) === truth, `says ${m[1]}, truth is ${truth}`);
  }
} else {
  console.log(`  ${dim('· conscience eval gate skipped (--fast)')}`);
}

// --- 9. can a stranger install what this repo says it is? ----------------
// Added 2026-08-23, after the tap was found serving a build from 38 releases earlier for over two
// weeks — `brew install ajeshh/boss/boss` handing out 0.179.0 while this file signed off "Ready to
// release v0.217.0" every time. THIS GATE IS WHY IT LASTED. It verified the CONTENT of a release
// exhaustively and then closed with a hand-step list that stopped at `commit`, so a releaser doing
// exactly what it said never reached `npm publish` and never touched the formula at all.
//
// Both thresholds live in check-published.js and are the whole design (npm soft at a gap of 1,
// because this gate runs BEFORE you publish; the tap graded against npm rather than VERSION,
// because a formula cannot reference an unpublished tarball). Offline exits 0 and checks nothing —
// a release must never be blocked by a plane.
{
  const r = run('node', [join('scripts', 'check-published.js'), '--strict']);
  const offline = /No network/.test(r.out);
  // ADVISORY, loudly. Publishing is Ajesh's act and nobody else's (CLAUDE.md), so between his
  // publishes this line is red for every session that releases — seventeen versions behind on
  // 2026-09-12 — and a gate that is red for weeks by construction is a gate that gets stepped over,
  // which is how the tap sat 38 releases stale with this file signing off every time. It prints,
  // it names the number, and the closing hand-step list says what to run. It does not block.
  record('published state', r.code === 0,
    offline ? 'skipped — no network'
      : r.code === 0 ? 'npm and the Homebrew tap serve this repo'
        : 'an advertised install path is stale — npm run check:external says how far; publishing is by hand',
    true);
  if (r.code !== 0) console.log(r.out.trimEnd());
}

// --- verdict -------------------------------------------------------------
const hard = results.filter((r) => !r.pass && !r.soft);
const soft = results.filter((r) => !r.pass && r.soft);
console.log('');
if (hard.length) {
  console.log(`  ${err('✗ ' + hard.length + ' blocking problem(s))').replace('))', ')')} — not ready to release.`);
  console.log(`  ${dim('Fix these, then re-run `npm run release`.')}\n`);
  process.exit(1);
}
console.log(`  ${ok('✦')} ${bold('Ready to release v' + VERSION)}${soft.length ? dim(`  (${soft.length} advisory note(s) above)`) : ''}`);
console.log(unreleasedHasContent(readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8'))
  ? `  ${dim('Work is waiting under `## Unreleased`. To publish it: ')}${bold('npm run stamp')}${dim(' (makes the version) · commit,')}`
  : `  ${dim('Remaining by hand: /tmp scaffold smoke-test · commit,')}`);
// Publishing was missing from this list for the whole life of the gate, and the omission was the
// bug: everything above verifies a release that, followed literally, never leaves the machine.
console.log(`  ${dim('then')} ${bold('npm publish')} ${dim('·')} ${bold('npm run bump:formula')} ${dim('· push the tap.')}`);
console.log(`  ${dim('Those last three are what a stranger actually installs. `npm run check:published` grades them.')}\n`);
