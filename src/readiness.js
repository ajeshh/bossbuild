// Readiness to climb a rung — the half of the train line BOSS could always have computed.
// IDEA-076, v0.266.0.
//
// WHAT WAS TRUE BEFORE THIS FILE. `renderLadder` printed four station NAMES and bolded one, and
// `graduationHint` was a fixed sentence read straight out of the manifest — the same words on a
// project's first day and its fortieth. Exactly ONE rung ever named a bar before you crossed it:
// `boss unlock scale` (IDEA-040), hard-coded inline in `cmdUnlock`. So the two rungs founders
// actually climb — Quickstart→MVP and MVP→V1 — unlocked in total silence, and the one rung almost
// nobody reaches was the one that spoke.
//
// TWO FOUNDERS ASKED FOR THIS, AND NEITHER ASKED FOR A PROGRESS BAR. EVID-001's words were
// "knowing exactly where i am like a train line, seeing my progress"; EVID-003 independently asked
// for orientation. Both are `stated-pain` — nobody has been OBSERVED failing at this — which is
// why this file builds the half that is CHECKABLE and refuses the half that is not:
//
//   · No percentage, no "2 of 3", no counter of any kind. `library/deceptive-patterns.json` has
//     `engage-streaks-variable-rewards` as a live row, and IDEA-065's rule is already law in
//     src/orientation.js: A PROGRESS SURFACE THAT CANNOT GO DOWN IS A COMFORT DEVICE. Every
//     condition here is a fresh read of durable records, so all of them can go back to unmet —
//     supersede an EVID, empty the roster, and the surface says so.
//   · Nothing is counted that only measures ACTIVITY. "Skills not yet run" would be a denominator
//     built from an inventory rather than a truth — it would improve when BOSS ships fewer skills
//     and worsen when it ships more, which is the metric shape this repo keeps catching.
//   · `unknown` IS A FIRST-CLASS STATE, and it is the honest default. BOSS cannot see whether real
//     users are hitting your app or whether you can name a coordination symptom. Those conditions
//     are NAMED and left unjudged. A condition BOSS silently treats as met because it cannot see it
//     is a fake gate, which is worse than no gate.
//   · It NEVER BLOCKS. House rule, and older than this file. `boss unlock` proceeds regardless;
//     the bar is said out loud so a deviation is a choice rather than an accident.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectBoard } from './board.js';
import { roster } from './team.js';
import { readEvidenceContext } from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';

const MET = 'met';
const UNMET = 'unmet';
const UNKNOWN = 'unknown';

// A condition BOSS cannot check. Named, never judged, and never counted toward `cleared`.
const prose = (text) => ({ text, state: UNKNOWN, detail: null });

function ideaCount(projectDir) {
  const dir = join(projectDir, 'docs', 'ideas');
  if (!existsSync(dir)) return 0;
  try {
    return readdirSync(dir).filter((f) => /^IDEA-\d+.*\.md$/.test(f) && !/-canvas\.md$/.test(f)).length;
  } catch { return 0; }
}

function shippedCount(projectDir) {
  try {
    const { cards } = collectBoard(projectDir);
    return cards.filter((c) => c.column === 'Shipped').length;
  } catch { return 0; }
}

// Per-rung bars. The key is the rung being CLIMBED TO, because that is what `boss unlock` names.
// L0 has no bar: it is the entry, and there is nothing behind it to have earned.
const BARS = {
  'L1-mvp': (dir) => {
    const ideas = ideaCount(dir);
    const ev = readEvidenceContext(dir);
    const signals = ev ? ev.total : 0;
    return {
      lead: 'MVP mode pays for itself when three things are true:',
      conditions: [
        {
          text: 'an idea captured you can actually build from',
          state: ideas > 0 ? MET : UNMET,
          detail: ideas > 0 ? `${ideas} on file` : 'nothing in docs/ideas/ yet — /idea',
        },
        {
          // Deliberately "any signal", not "an observed one". /prototype is a legitimate
          // build-first start (IDEA-030) and BOSS does not rank the lean cycle's two entrances.
          text: 'at least one real signal on file — something a person actually said or did',
          state: signals > 0 ? MET : UNMET,
          detail: signals > 0 ? `${signals} graded` : 'nothing in docs/evidence/ yet — /interview',
        },
        prose('and you know roughly what the first working version has to do'),
      ],
    };
  },

  'L2-v1': (dir) => {
    const shipped = shippedCount(dir);
    return {
      lead: 'V1 mode pays for itself when three things are true:',
      conditions: [
        {
          text: 'something actually shipped — a FEAT that reached Shipped',
          state: shipped > 0 ? MET : UNMET,
          detail: shipped > 0 ? `${shipped} on the board` : 'nothing on the board has shipped yet',
        },
        // BOSS can read your repo; it cannot read your traffic. Saying "no real users" from a
        // silent analytics file would be an assertion about the world made from an absence.
        prose('real users hitting it, not just you'),
        prose('more than one screen — a design system needs something to be consistent ACROSS'),
      ],
    };
  },

  'L3-scale': (dir) => {
    const ev = readEvidenceContext(dir);
    const commitments = ev ? ev.counts.commitment : 0;
    const team = roster(dir).length;
    return {
      lead: 'Scale-mode discipline pays for itself when three things are true:',
      conditions: [
        {
          text: 'revenue that recurs (a first-dollar EVID or better)',
          state: commitments > 0 ? MET : UNMET,
          detail: commitments > 0 ? `${commitments} commitment-grade` : 'no commitment-grade evidence on file',
        },
        {
          text: 'at least one non-founder in the work',
          state: team > 0 ? MET : UNMET,
          detail: team > 0 ? `${team} on the roster` : 'solo — `boss team add @handle "Name"`',
        },
        prose('a coordination symptom you can name — a dropped handoff, a decision nobody owned, a 3am incident'),
      ],
    };
  },
};

// The bar for climbing to `targetStage`, or null when that rung has none.
//
// `cleared` is TRUE only when there is at least one checkable condition and every one of them is
// met. It says "everything BOSS can check is in place" and never "you are ready" — the unknowns
// are real conditions that stay unjudged, and collapsing them into a verdict is the exact fake
// gate this file exists to refuse.
export function readiness(targetStage, projectDir) {
  const build = BARS[targetStage];
  if (!build) return null;
  const { lead, conditions } = build(projectDir);
  const checkable = conditions.filter((c) => c.state !== UNKNOWN);
  return {
    lead,
    conditions,
    checkable: checkable.length,
    cleared: checkable.length > 0 && checkable.every((c) => c.state === MET),
    unknowns: conditions.length - checkable.length,
  };
}

// Rendered at the moment of crossing. Markers are per-condition STATE, never a tally: there is no
// "2 of 3" line here on purpose, and there must never be one.
export function renderReadiness(r, { bold, dim, ok, warn }) {
  const out = [`  ${r.lead}`];
  for (const c of r.conditions) {
    if (c.state === MET) out.push(`    ${ok('✓')} ${c.text}${c.detail ? dim(`  (${c.detail})`) : ''}`);
    else if (c.state === UNMET) out.push(`    ${warn('·')} ${c.text}${c.detail ? dim(`  (${c.detail})`) : ''}`);
    // Unjudged, and it looks unjudged: no marker a reader could mistake for a verdict.
    else out.push(`      ${dim(c.text)}`);
  }
  if (r.unknowns > 0) {
    out.push(dim(`  The unmarked ones BOSS cannot check — they are yours to judge, not its.`));
  }
  out.push(dim('  Missing one? That\'s fine — but you\'ll be carrying ceremony you haven\'t earned.'));
  out.push(dim('  Unlocking anyway (BOSS never blocks); the deviation is yours to own.'));
  return out;
}
