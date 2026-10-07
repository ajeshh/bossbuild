// src/install.js — the three commands that lay a stage into a project: `boss new` (an empty folder),
// `boss adopt` (a repo already under way) and `boss unlock` (the next mode, into a project BOSS is
// already in). They share a job and their helpers, so they share a module (IDEA-160 Q3). The file
// copying itself is scaffold.js's; this is the part a founder reads.

import { bossVersion, STAGE_ORDER, resolveStageId } from './paths.js';
import { stageVars, applyStage, readStageManifest } from './scaffold.js';
import { readStamp, writeStamp, registerProject } from './registry.js';
import { stampManaged } from './sync.js';
import { earnedGroups, describeUntil, holdAtAdopt } from './earned.js';
import { modeWord, skillsLine } from './modes.js';
import { readiness, renderReadiness } from './readiness.js';
import { dim, bold, ok, warn } from './ui.js';
import { fail, failNotAProject } from './fail.js';

// The role-shift ladder (IDEA-053). Each rung quietly asks the founder to become someone slightly
// different — builder → seller → operator → leader. Named once, at the founder's own invoked unlock;
// never a hook, never an assessment, never a "level." Describes the SITUATION, never the person
// (IDEA-019). Staying at a rung forever is legitimate — the same dignity the README extends to
// projects extends to people. Full ladder + failure modes: library/practices/founder-role-shifts.md.
const ROLE_SHIFT = {
  'L1-mvp': [
    "This rung's hardest work isn't in the editor. What tends to move an MVP is afternoons spent",
    "talking to strangers about their problem — the tool half is /interview and /pretotype; the",
    "personal half is that asking feels worse than building, and matters more. Builder → seller.",
  ],
  'L2-v1': [
    "You're about to have users — which means support, incidents, and churn. The operator's question",
    "tends to replace the builder's here: not \"what should I make?\" but \"is what I made working for",
    "the people paying for it?\" Seller → operator.",
  ],
  'L3-scale': [
    "This rung is about becoming dispensable in the right places — giving away your Legos. The work",
    "shifts from doing to setting up the conditions for others to do. Operator → leader.",
  ],
};

function previewUnlock(stamp) {
  const next = STAGE_ORDER[STAGE_ORDER.indexOf(stamp.stage) + 1];
  const here = stamp.mode || stamp.stage;
  if (!next) return console.log(`\n  ${bold(here)} is the top rung — nothing left to unlock.\n`);
  let nextName = modeWord(next);
  try { nextName = readStageManifest(next).name || nextName; } catch { /* unauthored rung */ }
  console.log(`\n  ${dim('You are here:')} ${here}   ${dim('next:')} ${bold(nextName)}`);
  const bar = readiness(next, process.cwd());
  if (bar) {
    console.log('');
    for (const line of renderReadiness(bar, { bold, dim, ok, warn }, { preview: true })) console.log(line);
  }
  console.log(`\n  ${bold(`boss unlock ${modeWord(next)}`)} ${dim('when you are — it never blocks.')}\n`);
}

export function cmdUnlock(args) {
  const layer = args[0];
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  // No mode given: BOSS knows the next rung, so it names it and shows its bar instead of failing with
  // the syntax (PROG-004: a missing argument names the obvious one). A preview — nothing installs.
  if (!layer) return previewUnlock(stamp);

  const target = resolveStageId(layer);
  // Speak the words `unlock` actually accepts, not the internal stage ids — `boss help
  // unlock` already documents `quickstart | mvp | v1 | scale`, and an error that answers in
  // a different vocabulary than the one it takes is its own small betrayal (§C6).
  if (!target) return fail(`unknown mode '${layer}'. options: ${STAGE_ORDER.map(modeWord).join(' | ')}`);
  if (stamp.installedLayers.includes(target)) return fail(`${target} already installed.`);

  // Every rung names its bar before you cross it, and READS the legs it can actually check
  // (IDEA-076). This used to be a hard-coded block for L3-scale alone (IDEA-040), which meant the
  // one rung almost nobody reaches was the only one that spoke, while Quickstart→MVP and MVP→V1 —
  // the two founders actually climb — unlocked in silence. It still never blocks; see
  // src/readiness.js for why the unknowns stay unjudged instead of quietly passing.
  const bar = readiness(target, process.cwd());
  if (bar) {
    console.log('');
    for (const line of renderReadiness(bar, { bold, dim, ok, warn })) console.log(line);
  }

  // A SKIPPED rung, named before you cross it — the same shape as Scale's bar above, for the same
  // reason. Every stage manifest declares `requires:` (L2-v1 requires L1-mvp) and until now NOTHING
  // read it: `modes.js` parsed the field into the mode object and no consumer ever looked. So
  // `boss unlock v1` from Quickstart succeeded in silence and left a project with `/board` — the
  // cross-FEAT sequencing surface — and no `/spec` to make a FEAT with, no `/smoke`, no `/log`, no
  // `/close`. The whole build loop, skipped, with no signal that anything had been.
  //
  // It still doesn't block: BOSS never blocks, and a founder who adopted a half-built repo may
  // genuinely want V1's design surface without MVP's spec ceremony. But "never blocks" is not the
  // same as "never mentions", and Scale has had the honest version of this since IDEA-040.
  const missing = STAGE_ORDER.slice(0, STAGE_ORDER.indexOf(target))
    .filter((id) => !stamp.installedLayers.includes(id));
  if (missing.length) {
    const names = missing.map((id) => modeWord(id));
    console.log(`\n  ${warn('⚠')} This skips ${names.join(' and ')}.`);
    for (const id of missing) {
      let skipped = [];
      try { skipped = readStageManifest(id).skills || []; } catch { /* unauthored rung, nothing to name */ }
      if (skipped.length) {
        console.log(`    ${modeWord(id)} is where ${skillsLine(skipped.slice(0, 4), 4).replace(/ \(`boss map`\)$/, '')} live.`);
      }
    }
    console.log(dim('  Unlocking anyway (BOSS never blocks); the deviation is yours to own.'));
    console.log(dim(`  Want them too? \`boss unlock ${names[0]}\` — additive, and it will not move you back down.`));
  }

  let m, applied, held = [], hold = { skip: [], deferred: {} };
  try {
    m = readStageManifest(target);
    // A group the project has ALREADY earned arrives with the rung, as it does at adopt: an app that
    // calls a model was told its AI skills were "held back when the app first calls a model" and left
    // them off disk until a sync (IDEA-139 T7, found by the planting test).
    hold = holdAtAdopt(m, process.cwd());
    held = hold.skip;
    applied = applyStage(target, process.cwd(), stageVars(stamp.name, target, m.name), { skipSkills: held });
    stampManaged(process.cwd(), [target]);
  } catch (e) {
    return fail(`${target} not authored yet — ${e.message}`);
  }
  // What this rung holds back until earned, recorded so `boss sync` knows what to lay down later
  // and what to leave alone until then (src/earned.js).
  const groups = earnedGroups(m).filter((g) => hold.deferred[g.group]);
  if (groups.length) {
    stamp.deferred = stamp.deferred || {};
    stamp.deferred[target] = Object.fromEntries(groups.map((g) => [g.group, g.skills]));
  }

  stamp.installedLayers.push(target);
  // The DEEPEST rung installed, never simply the one just unlocked. This used to be
  // `stamp.stage = target` unconditionally, which meant unlocking a lower rung you had skipped
  // moved you BACKWARDS: a founder at V1 who realised they were missing `/spec` ran
  // `boss unlock mvp` — the only recovery available — and `boss status` then reported
  // "You are here: MVP" with V1 still installed underneath. The one action that repaired the skip
  // was also the action that misreported where they were, which is the worst possible pairing:
  // the recovery path silently corrupted the thing a founder consults to know if it worked.
  // `installedLayers` is now the source of truth and its ORDER of arrival is not its depth.
  const deepest = STAGE_ORDER.filter((id) => stamp.installedLayers.includes(id)).pop() || target;
  stamp.stage = deepest;
  stamp.mode = deepest === target ? m.name : (readStageManifest(deepest).name || deepest);
  stamp.agents = [...new Set([...(stamp.agents || []), ...(m.agents || [])])];
  stamp.skills = [...new Set([...(stamp.skills || []), ...(m.skills || []).filter((sk) => !held.includes(sk))])];
  stamp.hooks = [...new Set([...(stamp.hooks || []), ...(m.hooks || [])])];
  stamp.loops = [...new Set([...(stamp.loops || []), ...(m.loops || [])])];
  writeStamp(process.cwd(), stamp);
  // THE PIN IS THE PROJECT'S, NOT THE INSTALL'S. Unlocking installs ONE new layer at the current
  // vintage; every layer already here keeps whatever vintage it was last synced at, and
  // `stamp.bossVersion` — which unlock deliberately never touches — is that older, honest number.
  // Writing `bossVersion()` here (as this did until v0.239.0) told the registry the WHOLE project
  // was current the moment a founder climbed a rung, and `boss list` printed it: a project pinned
  // at 0.6.0 reporting as 0.180.0 because someone unlocked MVP. That is the self-confirming
  // silence `boss update` exists to break — the more layers you had behind, the more confidently
  // the portfolio said you were fine. The manifest was right the whole time; only the copy lied.
  registerProject({ name: stamp.name, path: process.cwd(), stage: target, mode: m.name, bossVersion: stamp.bossVersion });
  console.log(`\n  ${ok('✦')} Unlocked ${bold(m.name + ' mode')} (${target}).`);
  if (applied.appendedClaude) console.log(`    ${ok('+')} appended ${m.name} working rules to CLAUDE.md`);
  for (const g of groups) {
    console.log(`    ${dim('·')} ${dim(`${g.skills.length} held back ${describeUntil(g.until)}:`)} ${skillsLine(g.skills, 3).replace(/ \(`boss map`\)$/, '')} ${dim(`— \`boss sync\` lays ${g.skills.length === 1 ? 'it' : 'them'} down then.`)}`);
  }

  // Say what actually arrived, and where to go next — the parity `boss new` has always had and this
  // did not. `boss new` installs 3 agents and 16 skills and prints both plus an explicit Next block;
  // `boss unlock mvp` installs 7 agents, 28 skills and 14 loops and used to print two lines. The
  // BIGGER change was the quieter one, and a founder was left to discover a doubled surface on their
  // own. Counts come from the mode's own manifest, so this is the delta that just landed — not the
  // cumulative install, which is what `boss map` is for.
  // Held-back skills are not "available" — they are on disk when earned, and the lines above said so.
  const landed = (m.skills || []).filter((sk) => !held.includes(sk));
  // Said the way a founder uses it (IDEA-123): the loop they'll run, not a receipt of every agent and
  // skill name. Loops are the conscience's machinery, so they're not counted to the founder at all.
  const arrived = [
    [(m.agents || []).length, 'agent'],
    [landed.length, 'skill'],
  ].filter(([n]) => n > 0).map(([n, w]) => `${n} ${w}${n === 1 ? '' : 's'}`);
  if (arrived.length) {
    console.log(`\n  ${bold('This unlock adds')} ${dim(`(${arrived.join(' · ')})`)}`);
    const loop = (m.coreLoop || []).map((st) => (Array.isArray(st) ? st : [st]).map((k) => `/${k}`).join(' or '));
    if (loop.length) console.log(`    the loop you'll run: ${loop.join(' → ')}`);
  }

  const note = ROLE_SHIFT[target];
  if (note) {
    console.log(`\n  ${dim('— what this mode tends to ask of you —')}`);
    for (const line of note) console.log(`  ${line}`);
  }

  // Two reads, not a first move. Which command actually comes next depends on what this project
  // already has captured, and `boss status` is the surface that computes that — so point at it
  // rather than hardcoding a per-rung guess that is wrong for any founder who arrived mid-stream.
  console.log(`\n  ${bold('Next')}`);
  console.log(`    boss map              ${dim('# everything this mode just added')}`);
  console.log(`    boss status           ${dim('# where that leaves you, and what to pick up')}`);
  console.log('');
}
