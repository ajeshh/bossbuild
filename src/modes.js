// Shared mode + skill metadata — the SINGLE source both `boss map` (live, in a
// founder's project) and scripts/gen-docs.js (static, in the BOSS repo) read,
// so the live map and the generated cheatsheet can never disagree about what a
// mode adds. This is the de-rot mechanism (IDEA-018): the per-mode lists are
// derived from the manifests + SKILL.md frontmatter, never hand-typed.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { STAGES_DIR, STAGE_ORDER } from './paths.js';
import { readStageManifest } from './scaffold.js';
import { field } from './frontmatter.js';

// Display name for a rung even when it isn't authored yet (no manifest.json).
const STAGE_NAMES = {
  'L0-quickstart': 'Quickstart',
  'L1-mvp': 'MVP',
  'L2-v1': 'V1',
  'L3-scale': 'Scale',
};

// The standing commands — true in every mode (the git-cheatsheet core). Lives here
// rather than in a generator because BOTH generators need it (the cheatsheet and the
// website's quick guide); two copies is how the cheatsheet drifted the first time.
export const STANDING_COMMANDS = [
  // `help` sits first because it is the only entry that needs no prior knowledge, and because
  // it was missing from a list whose stated job is the commands that always work. Found by
  // check:help at v0.275.0: the wayfinding map pointed at `boss help` for "get oriented for
  // the first time" and the gate refused it as a command that does not exist. The command
  // existed; the list of always-available commands did not include the one you reach for
  // when you know nothing.
  ['boss help [<command>|glossary|symbols|hooks] [--html]', 'every command, what a word means, the glyphs \u2014 or the whole guide as a page'],
  ['boss new <name>', 'scaffold a new project (Quickstart mode)'],
  ['boss adopt', 'bring BOSS into a repo you already started'],
  ['boss map', 'live cheatsheet: where you are + what\u2019s one unlock away'],
  ['boss status [--conscience]', 'mode / pinned version / drift (+ loop states)'],
  ['boss board', 'what\u2019s in flight (captured \u2192 shipped)'],
  ['boss recap [--md]', 'what happened this week, read back out of your own records'],
  ['boss id [TYPE]', 'the next free record number \u2014 computed, never counted by hand'],
  ['boss records', 'check the record set: duplicate IDs, off-vocabulary status, broken promotions'],
  ['boss unlock <mode>', 'climb a rung: quickstart \u2192 mvp \u2192 v1 \u2192 scale'],
  ['boss team [add @user]', 'who\u2019s on the venture (solo by default)'],
  ['boss conscience pause --for 8h', 'silence the whole conscience for a bounded sprint'],
  ['boss conscience mute <moment>', 'turn down ONE moment; unmute to bring it back'],
  ['boss remove', 'take BOSS back out \u2014 preview first, --apply to do it'],
  ['/boss-sync', 'pull the latest BOSS practices into this project'],
];

// The mode word a user types into `boss unlock` (strips the L#- level prefix).
export function modeWord(stageId) {
  return stageId.replace(/^l\d+-/i, '');
}

// The ordered ladder. Unauthored stages (no manifest — e.g. Scale today) come
// back as { authored: false } so callers can show the rung without faking
// content for it.
export function loadModes() {
  return STAGE_ORDER.map((id) => {
    try {
      const m = readStageManifest(id);
      return {
        authored: true,
        id,
        name: m.name || STAGE_NAMES[id] || id,
        summary: m.summary || '',
        agents: m.agents || [],
        skills: m.skills || [],
        // The few skills worth naming when previewing a rung you haven't unlocked yet
        // (REVIEW-2026-07-28 §C1: `boss map` printed all 28 of MVP's skills to a founder
        // with an empty Quickstart project — a 45-line wall, 64% of it unavailable, which
        // is premature ceremony rendered as text and a direct hit on EVID-001's "I can't
        // tell where I am / I'm worried about bloat"). Empty = show them all (fine for a
        // rung with 1–3 skills). `boss map --next` always shows the full list.
        headline: m.headline || [],
        // The ORDERED spine of this rung — the sequence a founder actually repeats here, in the
        // order they repeat it. `boss map` renders these first, in this order, ahead of the
        // alphabetical remainder, so the rung's loop is visible instead of buried.
        //
        // NOT the same field as `headline` above, and the difference is the whole point:
        //   · `headline` is a PREVIEW subset — the few skills most worth naming to someone who
        //     has not unlocked this rung yet. Curated to entice; order is not meaningful.
        //   · `coreLoop` is a SEQUENCE for someone standing IN the rung. Order IS the content.
        // MVP's differ for exactly that reason: `/pretotype` is a compelling preview and is not
        // part of the repeating loop; `/log` is a dull preview and is.
        //
        // Each rung's loop is TAKEN FROM ITS OWN AUTHORED WORKING RULES, never invented here —
        // MVP's from `claude-append.md` rule 5 ("open → spec → build → smoke → log → close"),
        // Quickstart's from its CLAUDE.md ("capture → talk to one person → pressure-test"), with
        // `/evidence` as the step `/canvas` hands its one-week experiment to. `/interview` joined
        // the sequence in v0.258.0: Quickstart shipped the two verbs that turn a conversation into
        // a graded signal and narrated an arc that never told anyone to have one, so the rung's
        // loop went capture → canvas — pressure-testing an idea against nothing but the founder.
        // Empty = no declared loop, render
        // alphabetically as before; V1 and Scale ship 2 skills and 1, where ordering earns nothing.
        coreLoop: m.coreLoop || [],
        // Skills whose moment only arrives once something is LIVE — the "After you ship" arc
        // (GUIDE.md groups them the same way). `boss map` folds these to a single line until the
        // project has actually shipped a FEAT, so a founder at MVP with one idea isn't read a menu
        // of nine verbs about retention and pricing (REVIEW-2026-07-28 §C1 / §E1). Nothing is
        // removed or disabled — they install, they run, they're one flag away.
        postLaunch: m.postLaunch || [],
        // Skills that are not about building the founder's company — BOSS's own upkeep
        // (`/boss-sync`, `/feedback`) and the verbs that END something
        // (`/sunset`). `boss map` folds these behind one line, always, because a rung's list
        // is answering *what do I do next for my company* and these four never are. Distinct
        // from `postLaunch`, which folds work that is real but not yet EARNED; this folds work
        // that is real and simply is not the founder's job. Nothing is disabled — `boss map
        // --all` opens both folds, and every one of them still runs by name.
        //
        // WHY THIS EXISTS AT ALL: five of Quickstart's sixteen verbs were about BOSS or about
        // endings, read to a founder who had not yet captured an idea. That is Principle 2
        // violated in BOSS's own front door.
        aside: m.aside || [],
        loops: m.loops || [],
        hooks: m.hooks || [],
        requires: m.requires || null,
        unlocksNext: m.unlocksNext || null,
        graduationHint: m.graduationHint || '',
      };
    } catch {
      return { authored: false, id, name: STAGE_NAMES[id] || id, agents: [], skills: [], loops: [] };
    }
  });
}

// The SKILL.md for a skill inside the PACKAGE (a given stage's template).
export function packageSkillMd(stageId, name) {
  return join(STAGES_DIR, stageId, 'template', '.claude', 'skills', name, 'SKILL.md');
}

// Split a SKILL.md description into a one-line gloss + a usage hint. Descriptions
// follow the house format "<gloss sentence>. … Usage - /name <args>". Returns
// { gloss, usage } — empty strings when the file is missing or has no description.
export function skillGloss(skillMdPath) {
  if (!existsSync(skillMdPath)) return { gloss: '', usage: '' };
  const desc = field(readFileSync(skillMdPath, 'utf8'), 'description');
  if (!desc) return { gloss: '', usage: '' };
  const u = desc.search(/\bUsage\s*[-:]/i);
  const body = (u === -1 ? desc : desc.slice(0, u)).trim();
  const usage = u === -1 ? '' : desc.slice(u).replace(/^Usage\s*[-:]\s*/i, '').trim();
  // First sentence of the body is the gloss.
  const dot = body.indexOf('. ');
  let gloss = dot === -1 ? body : body.slice(0, dot + 1);
  gloss = gloss.replace(/\.$/, '').trim();
  return { gloss, usage };
}
