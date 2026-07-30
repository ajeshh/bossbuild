#!/usr/bin/env node
// Wayfinding-drift check (IDEA-035) — catch stale *prose* before 20 releases do.
//
//   npm run check:wayfinding   (or it runs as a courtesy nudge at the end of gen:docs)
//
// The generated wayfinding (boss map, CHEATSHEET.md, SKILLS.md) is drift-proof —
// it's rebuilt from src/modes.js every time. The *hand-authored* prose isn't, and
// nothing flagged when GUIDE.md fell behind the manifest (the v0.68 manual de-rot
// pass was the symptom). This is the cheapest slice: grep GUIDE.md — the one prose
// doc *meant* to walk the whole ladder — against the manifest skill lists, and
// nudge on any skill that appears in NO rung.
//
// THE TRAP (read before "fixing" a warning): most prose is drift-resistant *by
// design* (IDEA-018). README/`/welcome` deliberately DON'T enumerate skills — they
// point at `boss map`. So this check guards ONLY GUIDE.md (the comprehensive doc),
// never blanket coverage. And it NUDGES, never blocks — exit 0 by default. The
// maintainer decides; a drift check that fails a commit is the ceremony BOSS refuses.
//
// `--strict` exits 1 on drift. That is NOT a reversal of the restraint above — it's
// the maintainer deciding, once, at the one moment where the decision is actually
// theirs to make: `npm run release`. Interactive runs stay a nudge. (The 56 releases
// this check spent reporting into an empty room are why the release path needs teeth
// the working path doesn't — REVIEW-2026-07-28 §E3.)

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from '../src/paths.js';
import { loadModes } from '../src/modes.js';

// Skills deliberately NOT part of the founder walkthrough — internal meta-skills
// invoked by other skills or run as housekeeping, not steps a founder is walked
// through. Exempt so the nudge doesn't cry wolf — but it's PRINTED, never silent,
// so an exemption that's gone wrong stays visible. Keep this list short and earned.
const NOT_IN_WALKTHROUGH = new Set([
  'extract',            // deliberate internal skill judgment (see /vet skill)
  'drift-deep',         // deliberate internal skill judgment (see /vet skill)
  'boss-learn',         // meta: evolve BOSS's own library (UP/DOWN) — a contributor action, not a founder build step
  'design-tokens-init', // internal init helper invoked by design setup, not a standalone walkthrough step
]);

// Match `/skill` not followed by another name char or hyphen, so `/boss` doesn't
// match inside `/boss-sync` (and vice-versa).
const mentioned = (prose, skill) => new RegExp(`/${skill}(?![\\w-])`).test(prose);

export function checkWayfindingDrift() {
  const guide = readFileSync(join(BOSS_ROOT, 'docs', 'GUIDE.md'), 'utf8');
  const flagged = [];
  const exempt = [];
  for (const mode of loadModes()) {
    if (!mode.authored) continue;
    for (const skill of mode.skills || []) {
      if (mentioned(guide, skill)) continue;
      (NOT_IN_WALKTHROUGH.has(skill) ? exempt : flagged).push({ mode: mode.name, skill });
    }
  }
  return { flagged, exempt };
}

export function reportWayfindingDrift() {
  const { flagged, exempt } = checkWayfindingDrift();
  if (!flagged.length) {
    console.log('  ✦ Wayfinding: every manifest skill is named in GUIDE.md.');
  } else {
    console.log(`  ⚠ Wayfinding drift — ${flagged.length} manifest skill(s) in NO GUIDE.md rung:`);
    for (const { mode, skill } of flagged) console.log(`      · /${skill}  (${mode})`);
    console.log('    These shipped but the one doc meant to walk the whole ladder never mentions');
    console.log('    them. Add a line where it fits — or, if it\'s genuinely internal, add it to');
    console.log('    NOT_IN_WALKTHROUGH in scripts/check-wayfinding-drift.js. Nudge, not a gate.');
  }
  if (exempt.length) {
    console.log(`    (exempt as internal, not in GUIDE by design: ${exempt.map((e) => '/' + e.skill).join(', ')})`);
  }
  return flagged.length;
}

// Run as CLI. Exit 0 by default — nudge, never enforce (IDEA-035 restraint).
// `--strict` (used by `npm run release`) exits 1 on drift.
if (import.meta.url === `file://${process.argv[1]}`) {
  const drift = reportWayfindingDrift();
  const strict = process.argv.includes('--strict');
  if (strict && drift) {
    console.log('    --strict: failing the release. Name them in GUIDE.md, or exempt them.');
  }
  process.exit(strict && drift ? 1 : 0);
}
