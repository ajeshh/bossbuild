// The ladder — "does it already exist, what rung is it on, and what seam does it leave?"
//
// WHY THIS EXISTS: sync compared FILE to FILE. It could say `.claude/skills/landing/SKILL.md`
// changed by 40 lines; it could not say the founder HAS a landing page and it is now behind the
// practice. Distribution without adoption — every improvement to a capability was unreachable by
// everyone who had already used it. The discipline is library/practices/seed-to-scale.md; the data
// is registry/surface-ladder.json; this is the cheap deterministic half that reads both.
//
// WHAT THIS DELIBERATELY IS NOT: a classifier. It reports CANDIDATES, never conclusions — the same
// split detect.js draws. A path list can see `app/page.tsx`; it cannot see a landing page in Framer,
// a smoke gate called `verify`, or whether the page that exists is any good. That judgment belongs
// to the model at a skill's step 0, and the ledger carries an `alsoLookFor` note telling it where to
// look. A confident wrong "you already have this" costs more than a miss, so the patterns are tight
// on purpose and everything loose is left to the reader with the wide context.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from './paths.js';

export const LADDER_FILE = join(BOSS_ROOT, 'registry', 'surface-ladder.json');

// Quickstart → MVP → V1 → Scale. Same order as STAGE_ORDER, in the founder-facing names the
// ledger and every skill use.
export const RUNGS = ['Quickstart', 'MVP', 'V1', 'Scale'];

const STAGE_TO_RUNG = {
  'L0-quickstart': 'Quickstart',
  'L1-mvp': 'MVP',
  'L2-v1': 'V1',
  'L3-scale': 'Scale',
};

export function readLadder(file = LADDER_FILE) {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    const out = {};
    for (const [k, v] of Object.entries(raw)) {
      if (k.startsWith('_')) continue;
      out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function rungIndex(rung) {
  const i = RUNGS.indexOf(rung);
  return i === -1 ? null : i;
}

// The rung the project is INSTALLED at. Not the rung its work is at — that gap is exactly the
// information /comprehend exists to read, and a path list has no business guessing it.
export function projectRung(stamp) {
  if (!stamp) return null;
  const byLayers = (stamp.installedLayers || [])
    .map((l) => STAGE_TO_RUNG[l])
    .filter(Boolean);
  if (byLayers.length) return byLayers[byLayers.length - 1];
  return STAGE_TO_RUNG[stamp.stage] || (RUNGS.includes(stamp.mode) ? stamp.mode : null);
}

// Path patterns: an exact path, one `*` wildcard inside a single segment, or a trailing `**`
// meaning "this directory, with something in it". Deliberately not a glob engine — every pattern
// in the ledger is one of those three shapes, and a real glob invites patterns that need one.
function matchFilePattern(projectDir, pattern) {
  const segs = pattern.split('/');
  const hits = [];

  if (segs[segs.length - 1] === '**') {
    const dir = join(projectDir, ...segs.slice(0, -1));
    try {
      if (statSync(dir).isDirectory() && readdirSync(dir).length) {
        hits.push(segs.slice(0, -1).join('/') + '/');
      }
    } catch { /* not there */ }
    return hits;
  }

  const wildAt = segs.findIndex((s) => s.includes('*'));
  if (wildAt === -1) {
    const abs = join(projectDir, pattern);
    if (existsSync(abs)) hits.push(pattern);
    return hits;
  }

  const parent = join(projectDir, ...segs.slice(0, wildAt));
  // Escape the literal parts, then let `*` mean "anything but a separator".
  const rx = new RegExp(`^${segs[wildAt].split('*').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')}$`);
  let entries;
  try { entries = readdirSync(parent); } catch { return hits; }
  for (const name of entries) {
    if (!rx.test(name)) continue;
    const rest = segs.slice(wildAt + 1);
    const relPath = [...segs.slice(0, wildAt), name, ...rest].join('/');
    if (!rest.length) { hits.push(relPath); continue; }
    if (existsSync(join(projectDir, relPath))) hits.push(relPath);
  }
  return hits;
}

function matchDeps(projectDir, names) {
  const pkgPath = join(projectDir, 'package.json');
  if (!existsSync(pkgPath)) return [];
  let pkg;
  try { pkg = JSON.parse(readFileSync(pkgPath, 'utf8')); } catch { return []; }
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return names.filter((n) => Object.hasOwn(all, n)).map((n) => `package.json → ${n}`);
}

// Look for what the founder ALREADY BUILT. Returns the evidence, capped — the point is "you have
// one of these", not an inventory, and a wall of paths reads as a scan report rather than a fact.
const EVIDENCE_CAP = 4;

export function detectArtifact(projectDir, entry) {
  const produces = entry?.produces || {};
  const found = [];
  for (const p of produces.files || []) {
    if (found.length >= EVIDENCE_CAP) break;
    found.push(...matchFilePattern(projectDir, p));
  }
  if (found.length < EVIDENCE_CAP && (produces.deps || []).length) {
    found.push(...matchDeps(projectDir, produces.deps));
  }
  const unique = [...new Set(found)];
  return {
    exists: unique.length > 0,
    evidence: unique.slice(0, EVIDENCE_CAP),
    more: Math.max(0, unique.length - EVIDENCE_CAP),
  };
}

// The three questions, answered for one capability against one project.
//
// `position` is the rung comparison and it drives everything downstream:
//   'at'    → run it. This is what JIT means.
//   'below' → the project is EARLIER than the capability. Don't run it; offer the seam.
//   'above' → the project is FURTHER ALONG. Run it, drop the 101.
export function assess(projectDir, name, stamp, ladder = readLadder()) {
  const entry = ladder[name];
  if (!entry) return null;

  const mine = projectRung(stamp);
  const theirs = entry.rung;
  const a = rungIndex(mine);
  const b = rungIndex(theirs);
  let position = null;
  if (a !== null && b !== null) position = a === b ? 'at' : (a < b ? 'below' : 'above');

  const artifact = detectArtifact(projectDir, entry);
  return {
    name,
    rung: theirs,
    rungNote: entry.rungNote || null,
    appliesWhen: entry.appliesWhen || null,
    projectRung: mine,
    position,
    what: entry.produces?.what || name,
    alsoLookFor: entry.alsoLookFor || null,
    seam: entry.seam || null,
    seamNot: entry.seamNot || null,
    seamWhy: entry.seamWhy || null,
    ...artifact,
  };
}

export function assessAll(projectDir, stamp, ladder = readLadder()) {
  return Object.keys(ladder)
    .map((n) => assess(projectDir, n, stamp, ladder))
    .filter(Boolean);
}

// What the project has ALREADY BUILT, in the founder's words. EVID-001's missing positive register:
// ~120 releases spoke only in the conscience's caution voice, and a founder who cannot tell where
// they are asked for "a train line, seeing my progress." This is that read and it is derived from
// real evidence on disk, never a score — BOSS refuses to grade.
export function built(projectDir, stamp, ladder = readLadder()) {
  return assessAll(projectDir, stamp, ladder).filter((a) => a.exists);
}

// Has this project started building at all? A cheap, bounded look — NOT detect.js's walk, which is
// capped at 4000 files and is far too much work for a line in `boss status`.
//
// This gates the seam, and the reason is the practice's own guardrail. "Below the rung" only means
// something once there is work for the seam to attach to. A fresh scaffold with no code and no
// captured idea is not *below* MVP — it is *at* Quickstart, doing Quickstart's work, and telling it
// to "write down what working means for the feature" names a feature that does not exist. That is
// the over-shooting seed-to-scale explicitly warns about, and an empty project is exactly where a
// tool most needs to stay quiet.
const WORK_DIRS = ['src', 'app', 'lib', 'pages', 'components', 'server', 'api'];
const WORK_DOCS = ['docs/features', 'docs/ideas'];

export function hasRealWork(projectDir) {
  for (const d of WORK_DIRS) {
    try { if (readdirSync(join(projectDir, d)).length) return true; } catch { /* absent */ }
  }
  for (const d of WORK_DOCS) {
    try {
      // The scaffold ships these directories with a README/template in them, so "non-empty" is not
      // the signal — a real IDEA-NNN or FEAT-NNN record is.
      if (readdirSync(join(projectDir, d)).some((f) => /^(IDEA|FEAT)-\d+/.test(f))) return true;
    } catch { /* absent */ }
  }
  return false;
}

// The one seam worth naming: closest rung above where they are, real seam, nothing built yet.
//
// ONE, deliberately. A list of everything they could plant is a checklist, and a checklist is what
// the JIT boundary exists to refuse — the founder would read six "not yet"s as six chores. Closest
// rung first because it is the one about to matter, and `position === 'below'` because a seam is
// only ever the answer to "this is above your rung"; at or above it, you run the thing itself.
export function nextSeam(projectDir, stamp, ladder = readLadder()) {
  if (!hasRealWork(projectDir)) return null;
  const open = assessAll(projectDir, stamp, ladder)
    // `appliesWhen` is a condition only a reader with the repo can settle ("does this project have
    // an LLM in control flow?"). Skipping those here is the same rule detect.js follows: a
    // confident wrong nudge costs more than a missed one, and the model at a skill's step 0 is
    // the surface that CAN judge it. They stay fully visible to detection, which is evidence-based.
    .filter((a) => !a.appliesWhen)
    .filter((a) => a.position === 'below' && a.seam && !a.exists)
    .sort((x, y) => rungIndex(x.rung) - rungIndex(y.rung));
  return open[0] || null;
}
