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
