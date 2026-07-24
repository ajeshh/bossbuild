// boss map — the live cheatsheet (IDEA-018). Where you are on the ladder, what
// you can run right now (grouped by the rung that unlocked it), and what's one
// unlock away. Like `boss board`, it's a pure render of state the project
// already holds — the .boss stamp + the installed SKILL.md files — so there is
// nothing to maintain and nothing to drift.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { STAGE_ORDER } from './paths.js';
import { loadModes, packageSkillMd, skillGloss, modeWord } from './modes.js';
import { dim, bold } from './ui.js';

function projectSkillMd(projectDir, name) {
  return join(projectDir, '.claude', 'skills', name, 'SKILL.md');
}

// The mode ladder as one styled "you are here" line — the train line a real founder
// asked for (EVID-001, facet 1). Climbed rungs read plain, the current rung is bold,
// the rungs ahead are dim. Shared by `boss map` and `boss status` so both orient the
// founder identically. Composed from state that already exists (STAGE_ORDER + the
// installed layers) — no new surface.
export function renderLadder(installedLayers, deepestId) {
  const byId = Object.fromEntries(loadModes().map((m) => [m.id, m]));
  const installed = (installedLayers && installedLayers.length) ? installedLayers : [deepestId];
  const rung = (id) => {
    const nm = (byId[id] && byId[id].name) || id.replace(/^L\d+-/, '');
    if (id === deepestId) return bold(nm);
    return installed.includes(id) ? nm : dim(nm);
  };
  return STAGE_ORDER.map(rung).join(dim(' → '));
}

// Gloss for an installed skill: prefer the project's OWN copy (truthful about
// local edits), fall back to the package stage that defines it.
function installedGloss(projectDir, name, definedIn) {
  const own = projectSkillMd(projectDir, name);
  if (existsSync(own)) return skillGloss(own);
  if (definedIn) return skillGloss(packageSkillMd(definedIn, name));
  return { gloss: '', usage: '' };
}

export function renderMap(projectDir, stamp) {
  const modes = loadModes();
  const byId = Object.fromEntries(modes.map((m) => [m.id, m]));
  // skill name -> the stage id that first introduces it (ladder order).
  const skillStage = {};
  for (const m of modes) for (const s of m.skills || []) if (!(s in skillStage)) skillStage[s] = m.id;

  const installed = stamp.installedLayers || [stamp.stage];
  const deepest = installed[installed.length - 1];

  // Scannable, single-line glosses. Substitute the project name into any
  // not-yet-installed (package) gloss so the "one unlock away" preview reads as
  // what the founder would actually get. skillGloss already hands us the first
  // sentence; only cap runaway ones, and cap at a WORD boundary so we never cut
  // mid-word (IDEA-055 — the old 64-char slice left "...as a…" dangling).
  const CAP = 78;
  const fit = (g) => {
    let t = (g || '').replace(/\{\{PROJECT_NAME\}\}/g, stamp.name).replace(/\{\{[^}]+\}\}/g, '').trim();
    if (t.length <= CAP) return t;
    const cut = t.slice(0, CAP);
    const sp = cut.lastIndexOf(' ');
    return (sp > CAP * 0.6 ? cut.slice(0, sp) : cut).trimEnd() + '…';
  };

  const lines = [];
  lines.push('');
  lines.push(`  ${bold(stamp.name + ' · map')}`);
  lines.push(`  ▸ ${bold('You are here:')} ${stamp.mode || stamp.stage}`);
  lines.push(`    ${renderLadder(installed, deepest)}`);
  lines.push('');

  // Available now — grouped by the rung that unlocked each skill, ladder order.
  // These are /skills — they run INSIDE Claude Code, not the shell (IDEA-055 cue).
  lines.push(`  ${bold('Available now')}  ${dim('— /skills, run inside Claude Code')}`);
  for (const layerId of STAGE_ORDER) {
    if (!installed.includes(layerId)) continue;
    const mode = byId[layerId];
    const skillsHere = (stamp.skills || []).filter((s) => skillStage[s] === layerId).sort();
    if (!skillsHere.length) continue;
    lines.push(`    ${bold(mode.name)}`);
    for (const s of skillsHere) {
      const { gloss } = installedGloss(projectDir, s, layerId);
      lines.push(`      ${'/' + s.padEnd(18)} ${dim(fit(gloss))}`);
    }
  }
  lines.push('');

  // One unlock away — read the next rung's skills from the package (not yet
  // installed here), so the founder sees what they'd gain before committing.
  const idx = STAGE_ORDER.indexOf(deepest);
  const nextId = idx >= 0 ? STAGE_ORDER[idx + 1] : null;
  if (nextId) {
    const next = byId[nextId];
    if (next && next.authored) {
      lines.push(`  ${bold('One unlock away: ' + next.name)}   ${dim('→  boss unlock ' + modeWord(nextId))}`);
      for (const s of next.skills || []) {
        const { gloss } = skillGloss(packageSkillMd(nextId, s));
        lines.push(`      ${'/' + s.padEnd(18)} ${dim(fit(gloss))}`);
      }
      if (next.graduationHint) lines.push(`    ${dim(next.graduationHint)}`);
    } else if (next) {
      lines.push(`  ${bold('One unlock away: ' + next.name)} ${dim('— not authored yet.')}`);
    }
    lines.push('');
  }

  // Standing controls — always available, mode-independent (the git-cheatsheet core).
  // These are `boss …` shell commands (except /boss-sync, which runs in Claude).
  lines.push(`  ${bold('Anytime')}  ${dim('— boss … commands, run in your terminal')}`);
  lines.push(`    boss board [--html]              ${dim('what\'s in flight (captured → shipped); --html = visual kanban')}`);
  lines.push(`    boss brain                       ${dim('the conscience\'s read on this venture')}`);
  lines.push(`    boss insights                    ${dim('how far your ventures have gotten (local)')}`);
  lines.push(`    boss team [add @user]            ${dim('who\'s on the venture — add a cofounder (solo by default)')}`);
  lines.push(`    boss status --conscience         ${dim('loop states + cohort + recent overrides')}`);
  lines.push(`    boss conscience pause --for 8h   ${dim('silence the whole conscience for a sprint')}`);
  lines.push(`    boss conscience mute <moment>    ${dim('turn down just one nudge (drift|caution|…)')}`);
  lines.push(`    /boss-sync                       ${dim('pull the latest BOSS practices into this project (in Claude)')}`);
  lines.push('');
  lines.push(`  ${dim('The map is a read of your install. To change it, climb a rung: boss unlock <mode>.')}`);
  lines.push(`  ${dim('boss help symbols for the glyph legend · boss help <command> for detail')}`);
  lines.push('');
  return lines.join('\n');
}

export function map(projectDir, stamp) {
  console.log(renderMap(projectDir, stamp));
}
