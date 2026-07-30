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
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { loadModes } from '../src/modes.js';
import { dim, bold, ok, warn, err } from '../src/ui.js';

const VERSION = readFileSync(join(BOSS_ROOT, 'VERSION'), 'utf8').trim();
const fast = process.argv.includes('--fast');

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
}

// --- 1b. the unit suite ---------------------------------------------------
// Cheap (<1s) and it locks every bug this audit found, so it runs early — a red suite
// makes the rest of the gate's output noise.
{
  const r = run('node', ['--test', 'test/board.test.js', 'test/conscience.test.js', 'test/scaffold.test.js', 'test/cli.test.js']);
  const pass = (r.out.match(/^. pass (\d+)/m) || [, '?'])[1];
  const fail = (r.out.match(/^. fail (\d+)/m) || [, '?'])[1];
  record('unit tests', r.code === 0 && fail === '0', `${pass} passed · ${fail} failed`);
  if (r.code !== 0) console.log(r.out.split('\n').filter((l) => /^✖|AssertionError|at Test/.test(l)).slice(0, 20).join('\n'));
}

// --- 2. manifest wiring ---------------------------------------------------
// Caught: L3's phantom `operate-loop`, and the `coherence` moment shipped with no frame.
{
  const r = run('node', [join('scripts', 'check-manifests.js'), '--strict']);
  record('manifest wiring', r.code === 0,
    r.code === 0 ? 'every entry resolves · every moment voiced' : 'see output below');
  if (r.code !== 0) console.log(r.out.trimEnd());
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

// --- 4. wayfinding prose -------------------------------------------------
{
  const r = run('node', [join('scripts', 'check-wayfinding-drift.js'), '--strict']);
  record('GUIDE.md names every skill', r.code === 0, r.code === 0 ? '' : 'see output below');
  if (r.code !== 0) console.log(r.out.trimEnd());
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

// --- 7. RESUME.md stays readable (report, not a gate) -------------------
{
  const p = join(BOSS_ROOT, 'docs', 'RESUME.md');
  if (existsSync(p)) {
    const lines = readFileSync(p, 'utf8').split('\n').length;
    record('RESUME.md length', lines <= 400,
      `${lines} lines${lines > 400 ? ' — a read-every-session doc past ~400 lines stops being read; archive older entries' : ''}`, true);
  }
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
  if (gatePassed != null) {
    const claims = [
      ['README.md', /gate-eval suite \((\d+) passing\)/],
      ['docs/PATTERNS.md', /\*\*(\d+) cases \/ 0 failures\*\*/],
    ];
    for (const [f, re] of claims) {
      const m = readFileSync(join(BOSS_ROOT, f), 'utf8').match(re);
      if (!m) continue;
      record(`${f} eval-count claim`, Number(m[1]) === gatePassed,
        `says ${m[1]}, gate says ${gatePassed}`);
    }
  }
} else {
  console.log(`  ${dim('· conscience eval gate skipped (--fast)')}`);
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
console.log(`  ${dim('Remaining by hand: registry/CHANGELOG.md entry · /tmp scaffold smoke-test · commit.')}\n`);
