// earned — the skills a rung holds back until the project has earned them.
//
// `boss unlock mvp` used to lay down 28 skills in one move: 17 → 45 verbs in the host's slash
// menu, opening on /ai-cost, /ai-failure-states, /ai-first-init, with /money, /trust and /landing
// resident on every turn of a project that had not shipped anything. `boss map` already FOLDED the
// post-launch seven until a FEAT shipped — but a fold is a display choice, and the founder lives in
// the slash menu, which BOSS cannot fold. The only lever there is whether the file exists.
//
// So a stage manifest may declare `earned`: a map from one of its skill-list fields to the
// predicate that earns it —
//
//   "earned": { "postLaunch": "shipped", "aiMediated": "llm-in-source" }
//
// At unlock those skills are not laid down; the project stamp records them under `deferred`. When
// the predicate comes true, `boss sync` lays the group down (it is `new` in the plan, nothing
// special) and `boss status` says so in the meantime. Principle 2 — arrives when earned — as a
// mechanism rather than a fold. Two predicates, both frontmatter- or file-true, never guessed:
//
//   shipped        a FEAT in the board's Shipped column (the same read `boss map` folds on)
//   llm-in-source  the founder's code calls a model — the cost-budget loop's own entry regex,
//                  over the same source globs, so the moment that nudges toward /ai-cost is the
//                  moment that can install it
//   ui-in-source   the founder's code styles a screen — the design-tokens loop's own entry
//                  pattern, at ONE file instead of that loop's three: `/design-tokens-init` says it
//                  runs "at the first UI commit", and `/ux-check` reviews UI that exists. A CLI, an
//                  API or a data pipeline never sees either (IDEA-121, the MVP unlock cliff).
//
// Backwards compatible: a stamp with no `deferred` (every project unlocked before this) has
// everything on disk already and nothing here changes.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STAGES_DIR } from './paths.js';
import { collectBoard } from './board.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';
import { classifyLoop } from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';

export const PREDICATES = ['shipped', 'llm-in-source', 'ui-in-source'];

// "Does the code call a model" is the cost-budget loop's ENTRY predicate, evaluated by the hook's
// own runtime. This file used to hold a verbatim copy of that loop's regex — "one regex, two
// readers" — which drifted the moment either was edited, and which matched ITSELF: the copy sat in
// `src/`, so BOSS's own conscience fired the cost and failure-mode moments on 43 of 57 prompts off
// this line (IDEA-121). Now there is one definition, in the loop file, and one evaluator.
const COST_LOOP = join(STAGES_DIR, 'L1-mvp', 'template', '.boss', 'loops', 'cost-budget-loop.md');
const TOKENS_LOOP = join(STAGES_DIR, 'L1-mvp', 'template', '.boss', 'loops', 'design-tokens-loop.md');

/** Has this project shipped? A FEAT in Shipped on the board (frontmatter-true), or a repo that was
 * already live when adopted — `boss adopt` read a deploy config or CI plus tests and said "shipped
 * and tested" out loud; the stamp records it as `shippedBefore` so the after-you-ship verbs are not
 * folded away from an app with users (IDEA-118). False when nothing can be read. */
export function hasShipped(projectDir) {
  try {
    const stamp = JSON.parse(readFileSync(join(projectDir, '.boss', 'manifest.json'), 'utf8'));
    if (stamp.shippedBefore === true) return true;
  } catch { /* no stamp — the board decides */ }
  try {
    return collectBoard(projectDir).cards.some((c) => c.column === 'Shipped' && /^FEAT/i.test(c.id));
  } catch { return false; }
}

/** For `boss adopt`: which of a stage's earned groups are already earned by the repo being adopted
 * (evaluated now, with `shippedBefore` standing in for the board), and which stay held. Returns
 * `{ skip, deferred }` — skill names to keep off disk, and the groups to record on the stamp. */
export function holdAtAdopt(manifest, projectDir, { shippedBefore = false } = {}) {
  const skip = [];
  const deferred = {};
  for (const g of earnedGroups(manifest)) {
    const earned = g.until === 'shipped' ? (shippedBefore || hasShipped(projectDir)) : PREDICATE[g.until] ? PREDICATE[g.until](projectDir) : false;
    if (earned) continue;
    skip.push(...g.skills);
    deferred[g.group] = g.skills;
  }
  return { skip, deferred };
}

/** Does the founder's code call a model? The cost-budget loop's entry predicate, run by the hook
 * runtime against the project — same pattern, same exclusions, same `sourceGlobs`. Fails closed. */
export function llmInSource(projectDir) {
  try {
    const loop = parseFrontmatter(readFileSync(COST_LOOP, 'utf8'));
    if (!loop?.entry) return false;
    const { entry } = classifyLoop({ entry: loop.entry, exit: [] }, projectDir);
    return entry.all_ok && !entry.results.some((r) => r.evidence?.blind);
  } catch { return false; }
}

/** Does the founder's code style a screen? The design-tokens loop's entry pattern and source globs,
 * lowered to one file: the loop waits for SPREAD (three files) before it nudges, but the skills it
 * points at belong from the first styled file. Fails closed. */
export function uiInSource(projectDir) {
  try {
    const loop = parseFrontmatter(readFileSync(TOKENS_LOOP, 'utf8'));
    const count = (loop?.entry || []).map((p) => p.count_at_least).find(Boolean);
    if (!count) return false;
    const entry = [{ count_at_least: { ...count, min: 1, min_files: 1 } }];
    const res = classifyLoop({ entry, exit: [] }, projectDir).entry;
    return res.all_ok && !res.results.some((r) => r.evidence?.blind);
  } catch { return false; }
}

const PREDICATE = { shipped: hasShipped, 'llm-in-source': llmInSource, 'ui-in-source': uiInSource };

/** [{ group, until, skills }] for a stage manifest — empty when it declares none. */
export function earnedGroups(manifest) {
  const out = [];
  for (const [group, until] of Object.entries(manifest.earned || {})) {
    const skills = Array.isArray(manifest[group]) ? manifest[group] : [];
    if (skills.length && PREDICATES.includes(until)) out.push({ group, until, skills });
  }
  return out;
}

/** Skill names a fresh unlock of `manifest` should hold back. */
export function heldBack(manifest) {
  return [...new Set(earnedGroups(manifest).flatMap((g) => g.skills))];
}

/** What the stamp says is still deferred, evaluated now: [{ stage, group, until, skills, earned }]. */
export function deferredState(projectDir, stamp) {
  const out = [];
  for (const [stageId, groups] of Object.entries(stamp.deferred || {})) {
    for (const [group, skills] of Object.entries(groups || {})) {
      if (!Array.isArray(skills) || !skills.length) continue;
      let until = null;
      try { until = (JSON.parse(readFileSync(join(STAGES_DIR, stageId, 'manifest.json'), 'utf8')).earned || {})[group] || null; } catch { /* stage gone */ }
      const pred = PREDICATE[until];
      out.push({ stage: stageId, group, until, skills, earned: pred ? pred(projectDir) : false });
    }
  }
  return out;
}

/** Skill names still held back right now (predicate false). */
export function stillDeferred(projectDir, stamp) {
  return new Set(deferredState(projectDir, stamp).filter((d) => !d.earned).flatMap((d) => d.skills));
}

/** Groups whose predicate has come true and which are not laid down yet. */
export function newlyEarned(projectDir, stamp) {
  return deferredState(projectDir, stamp).filter((d) => d.earned);
}

/** Drop laid-down groups from the stamp's `deferred` and add their skills to `skills`. Mutates. */
export function markLaidDown(stamp, groups) {
  for (const g of groups) {
    const stage = stamp.deferred?.[g.stage];
    if (stage) { delete stage[g.group]; if (!Object.keys(stage).length) delete stamp.deferred[g.stage]; }
    stamp.skills = [...new Set([...(stamp.skills || []), ...g.skills])];
  }
  if (stamp.deferred && !Object.keys(stamp.deferred).length) delete stamp.deferred;
  return stamp;
}

// One line for `boss unlock`: what is held back and what earns it.
export function describeUntil(until) {
  return until === 'shipped' ? 'after the first FEAT ships'
    : until === 'llm-in-source' ? 'when the app first calls a model'
      : until === 'ui-in-source' ? 'when the app gets its first styled screen'
        : 'when earned';
}

// And for `boss status`, once it has happened.
export function describeEarned(until) {
  return until === 'shipped' ? 'a FEAT shipped'
    : until === 'llm-in-source' ? 'the app calls a model now'
      : until === 'ui-in-source' ? 'the app has a screen now'
        : 'earned';
}
