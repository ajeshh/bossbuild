import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { bossVersion, STAGE_ORDER, resolveStageId } from './paths.js';
import { applyStage, applyStageSafe, appendClaudeBlock, appendMarkedBlock, readStageManifest } from './scaffold.js';
import { registerProject, listProjects, findByPath, retireProject, reviveProject, deregisterProject } from './registry.js';
import { planSync, applySync, computeSettingsMerge } from './sync.js';
import { learn, LIBRARY_CATEGORIES } from './learn.js';
import { printCraft } from './craft.js';
import { printChangelog } from './changelog.js';
import { detectStage } from './detect.js';
import { printUpdate, updateNote, installKind, updateCommand } from './update.js';
import { planRemove, applyRemove, machineState, removeMachineState } from './remove.js';
import { statusConscience, consciencePause, conscienceResume, conscienceMute, conscienceUnmute, conscienceActivity } from './conscience.js';
import { board, boardHtml, collectBoard, computeNext } from './board.js';
import { map, renderLadder } from './map.js';
import { modeWord } from './modes.js';
import { brain } from './brain.js';
import { insights } from './insights.js';
import { renderTeam, addCollaborator, removeCollaborator, isTeam, resolveIdentity } from './team.js';
import { dim, bold, ok, warn, err } from './ui.js';
import { parseArgs } from './args.js';

const STAMP = '.boss/manifest.json';

function stageVars(name, stageId, mode) {
  return {
    PROJECT_NAME: name,
    DATE: new Date().toISOString().slice(0, 10),
    BOSS_VERSION: bossVersion(),
    STAGE: stageId,
    MODE: mode || stageId,
  };
}

function writeStamp(targetDir, stamp) {
  mkdirSync(join(targetDir, '.boss'), { recursive: true });
  writeFileSync(join(targetDir, STAMP), JSON.stringify(stamp, null, 2) + '\n');
}

function readStamp(dir) {
  const file = join(dir, STAMP);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
}

// A mode's skill list is a wall the moment you adopt above Quickstart — MVP is 44 names, which is
// the exact Principle #2 inversion v0.130.0 fixed for `boss map` (68 lines → 45). Name the few a
// founder acts on first, count the rest, and point at the surface that exists to list them.
function skillsLine(skills, limit = 8) {
  if (!skills.length) return '—';
  if (skills.length <= limit) return skills.join(', ');
  return `${skills.slice(0, limit).join(', ')} … +${skills.length - limit} more (\`boss map\`)`;
}

function cmdNew(args) {
  const name = args.find((a) => !a.startsWith('--'));
  const aiNative = args.includes('--ai'); // IDEA-022 Track 3 — additive, opt-in
  if (!name) return fail('usage: boss new <project-name> [--ai]');
  const targetDir = resolve(process.cwd(), name);
  if (existsSync(targetDir)) return fail(`'${name}' already exists here.`);

  const stageId = STAGE_ORDER[0]; // L0-quickstart
  const manifest = readStageManifest(stageId);
  mkdirSync(targetDir, { recursive: true });
  applyStage(stageId, targetDir, stageVars(name, stageId, manifest.name));

  const stamp = {
    name,
    bossVersion: bossVersion(),
    stage: stageId,
    mode: manifest.name,
    installedLayers: [stageId],
    agents: manifest.agents || [],
    skills: manifest.skills || [],
    hooks: manifest.hooks || [],
    loops: manifest.loops || [],
    createdAt: new Date().toISOString(),
  };
  writeStamp(targetDir, stamp);

  // User-tunable defaults the /boss spin-up skill reads. Separate from manifest.json
  // (the install record) so users can edit prefs without touching the layer ledger.
  writeFileSync(
    join(targetDir, '.boss', 'config.json'),
    JSON.stringify({
      github: 'ask',          // ask | always | never — create a remote when an idea lands
      visibility: 'private',  // private | public
      license: 'proprietary', // proprietary | MIT | Apache-2.0 | AGPL-3.0
      // Optional founder-cohort declaration (v0.20.0+). When set, the conscience
      // hook includes the cohort in its additionalContext so Claude composes the
      // voice appropriately for the cohort — first-product gets teaching;
      // returning-founder gets a harder question; vibe-virtuoso gets sharper
      // architecture. Options: vibe-coder-newbie | eng-builder | non-tech-founder
      // | first-product | vibe-virtuoso | indie-hacker | returning-founder |
      // domain-expert | null. /boss skill asks during spin-up; user can edit later.
      cohort: null,
      // Opt-in share-up (IDEA-021/024). Default OFF — BOSS never sends usage anywhere on its own.
      // `boss insights` reads your trace locally; `/feedback` sends only what you explicitly approve.
      // If a future version offers to share anonymized loop-closure signals UP to improve BOSS, it
      // is gated on this flag being true AND a per-send confirmation. Telemetry is never a default.
      shareUp: false,
      // AI-native augmentation (IDEA-022 Track 3, opt-in via `--ai`). When true, `/comprehend` tailors
      // the scaffold to what BOSS understands (seeds the venture brain, fills the overview). The
      // deterministic template scaffold above is ALWAYS the reversible base — this only augments it.
      aiNative,
    }, null, 2) + '\n',
  );

  try {
    execSync('git init -q', { cwd: targetDir });
  } catch { /* git optional */ }

  registerProject({
    name,
    path: targetDir,
    stage: stageId,
    mode: manifest.name,
    bossVersion: bossVersion(),
    createdAt: stamp.createdAt,
  });

  console.log(`\n  ${ok('✦')} Created ${bold(name)} — ${manifest.name} mode (${stageId}, BOSS ${bossVersion()})`);
  console.log(`    agents: ${stamp.agents.join(', ') || '—'}`);
  console.log(`    skills: ${skillsLine(stamp.skills)}`);
  console.log(`\n  ${bold('Next')} ${dim('(these run in your terminal)')}`);
  console.log(`    cd ${name}`);
  console.log(`    code ${name}        # or open the folder in your editor (Cursor, etc.)`);
  console.log(`    claude              # open Claude Code (works in the terminal or the editor panel)`);
  console.log(`    ${dim('then, inside Claude:')}`);
  console.log(`    > /boss <your idea>     # spin up — a sentence, a doc, a deck, or a link`);
  console.log(`                            #   (first time? /welcome · already written it down? /import <file|url>)`);
  if (aiNative) {
    console.log(`    > /comprehend           # AI-native: tailor the scaffold to what BOSS understands (augments, never replaces)`);
  }
  console.log('');
}

// boss adopt — bring BOSS into an ALREADY-STARTED repo, non-destructively.
// "Lite BOSS" is the design, not a fallback (Principle 2): adopt at the lightest
// register that matches where the app already is, then `boss unlock` upward on
// evidence. ≈ a safe scaffold (copy-if-absent) + settings merge + stamp + register.
function cmdAdopt(args) {
  const flags = parseArgs(args);
  const targetDir = process.cwd();
  if (existsSync(join(targetDir, STAMP))) {
    return fail('already a BOSS project (.boss/manifest.json here). Use `boss sync` to update or `boss unlock <mode>` to add a mode.');
  }
  // Read how far along the repo already is, unless the founder named a mode. Adopting a
  // half-built app at Quickstart hands it the idea-capture arc it finished months ago; the old
  // default did that every time and told the founder to figure the mode out themselves. The
  // detection is deliberately cheap and SHOWN (see src/detect.js) — it caps at MVP and never
  // auto-climbs to V1, because ceremony added is ceremony sync cannot yet remove.
  const detected = flags.mode ? null : detectStage(targetDir);
  const stageId = flags.mode ? resolveStageId(flags.mode) : detected.stage;
  if (!stageId) return fail(`unknown mode '${flags.mode}'.`);
  let manifest;
  try { manifest = readStageManifest(stageId); }
  catch { return fail(`mode '${flags.mode}' isn't authored yet.`); }

  const name = basename(targetDir);

  // 1. Non-destructive scaffold of the FULL chain up to the target mode — adopting
  //    at MVP must also lay down Quickstart's foundation (welcome/boss/triage/...),
  //    exactly as `boss new` + `boss unlock mvp` would. Copy-if-absent throughout.
  const chain = STAGE_ORDER
    .slice(0, STAGE_ORDER.indexOf(stageId) + 1)
    .filter((s) => { try { readStageManifest(s); return true; } catch { return false; } });
  const claudePreexisted = existsSync(join(targetDir, 'CLAUDE.md'));
  const agentsPreexisted = existsSync(join(targetDir, 'AGENTS.md'));
  const copied = [];
  const skipped = [];
  for (const s of chain) {
    const m = readStageManifest(s);
    const r = applyStageSafe(s, targetDir, stageVars(name, s, m.name));
    copied.push(...r.copied);
    skipped.push(...r.skipped);
  }

  // 2a. If the repo already had an AGENTS.md, we skipped the template's — leave
  //     the founder's host-neutral rules intact and append BOSS's as a marked block
  //     (so BOSS's working discipline lands alongside theirs).
  if (agentsPreexisted) {
    appendMarkedBlock(join(targetDir, 'AGENTS.md'), 'adopt',
      `## BOSS working rules — adopted ${stageVars(name, stageId, manifest.name).DATE}\n\n` +
      `1. **Capture before you build** (every idea → an \`IDEA-NNN\` file in \`docs/ideas/\`).\n` +
      `2. **Stack-neutral until decided.** 3. **Docs are source of truth, not chat.**\n` +
      `4. **Small, reversible steps.** 5. **Ask before irreversible actions.** 6. **Don't over-build.**\n` +
      `7. **Grow through modes** (Quickstart → MVP → V1 → Scale): \`boss unlock <mode>\`.`);
  }

  // 2b. If the repo already had a CLAUDE.md, we skipped the template's — leave the
  //     founder's rules intact, import the (now-present) AGENTS.md so the rules
  //     reach Claude, and append a small marked BOSS orientation block.
  if (claudePreexisted) {
    appendClaudeBlock('adopt', targetDir,
      `@AGENTS.md\n\n` +
      `## BOSS — adopted ${stageVars(name, stageId, manifest.name).DATE}\n\n` +
      `This repo was adopted into BOSS at **${manifest.name}** mode (non-destructively — your files were untouched).\n` +
      `Host-neutral working rules are imported from \`@AGENTS.md\` above. New: \`.claude/skills/\` + \`.claude/agents/\` for this mode, a conscience hook, and \`docs/\` capture surfaces.\n` +
      `Run **\`/welcome\`** to orient, **\`/boss\`** to spin up an idea, or **\`boss map\`** to see what's available.\n` +
      `Grow ceremony as the project earns it: \`boss unlock <mode>\`.`);
  }

  // 3. Stamp .boss/ (mode + not-self-hosted) so it's a real BOSS project. Agents /
  //    skills / hooks / loops are the UNION across the installed chain.
  const u = { agents: new Set(), skills: new Set(), hooks: new Set(), loops: new Set() };
  for (const s of chain) {
    const m = readStageManifest(s);
    (m.agents || []).forEach((x) => u.agents.add(x));
    (m.skills || []).forEach((x) => u.skills.add(x));
    (m.hooks || []).forEach((x) => u.hooks.add(x));
    (m.loops || []).forEach((x) => u.loops.add(x));
  }
  const stamp = {
    name, bossVersion: bossVersion(), stage: stageId, mode: manifest.name,
    installedLayers: chain, agents: [...u.agents], skills: [...u.skills],
    hooks: [...u.hooks], loops: [...u.loops],
    createdAt: new Date().toISOString(), adopted: true,
  };
  writeStamp(targetDir, stamp);
  // config.json only if absent — never clobber a founder's prefs.
  const cfgPath = join(targetDir, '.boss', 'config.json');
  if (!existsSync(cfgPath)) {
    writeFileSync(cfgPath, JSON.stringify({
      github: 'ask', visibility: 'private', license: 'proprietary', cohort: null, shareUp: false,
      aiNative: !!flags.ai, // IDEA-022 Track 3 — `/comprehend` reads the adopted repo to tailor + seed the brain
    }, null, 2) + '\n');
  }

  // 4. Merge the conscience hook registration into settings.json (additive —
  //    preserves the founder's permissions + any hooks they already wired).
  const settings = computeSettingsMerge(targetDir, chain);
  if (settings && settings.changed) {
    const dest = join(targetDir, settings.rel);
    mkdirSync(join(targetDir, '.claude'), { recursive: true });
    writeFileSync(dest, JSON.stringify(settings.merged, null, 2) + '\n');
  }

  // 5. Register as a normal (not self-hosted) project — rides the usual sync loop.
  registerProject({
    name, path: targetDir, stage: stageId, mode: manifest.name,
    bossVersion: bossVersion(), createdAt: stamp.createdAt,
  });

  console.log(`\n  ${ok('✦')} Adopted ${bold(name)} into BOSS — ${manifest.name} mode (${stageId}, BOSS ${bossVersion()})`);
  if (detected) {
    console.log(`    ${dim('read from your repo:')} ${detected.why.join(' · ')}`);
    if (detected.beyond) {
      console.log(`    ${warn('▸')} this looks past MVP — shipped and tested. ${bold('boss unlock v1')} adds the design`);
      console.log(`      system, db and board discipline ${dim("when you want it; BOSS won't climb there on its own.")}`);
    }
  }
  // `skipped` counts COLLISIONS — files BOSS declined to overwrite because you already had them.
  // Printing it unconditionally produced "0 of yours left untouched" on a clean adopt, which reads
  // as "we touched everything" — the exact opposite of adopt's promise, at the moment of maximum
  // trust anxiety. Nothing of yours is ever written; say that, and only count collisions when there
  // were some.
  const preserved = [
    skipped.length ? `${skipped.length} of yours kept as-is` : null,
    claudePreexisted ? 'CLAUDE.md preserved (BOSS block appended)' : null,
  ].filter(Boolean);
  console.log(`    ${copied.length} file(s) added · nothing of yours overwritten${preserved.length ? ` · ${preserved.join(' · ')}` : ''}`);
  console.log(`    skills: ${skillsLine(stamp.skills)}`);
  console.log(`\n  ${bold('Next')}`);
  console.log(`    claude              # open Claude Code here ${dim('(terminal)')}`);
  console.log(`    > /welcome              # what BOSS added + how the conscience works ${dim('(inside Claude)')}`);
  console.log(`    > /comprehend           # have BOSS read this repo${flags.ai ? '' : ' (optional)'} — tailor the scaffold + seed`);
  console.log(`                            #   the venture brain. Additive and reversible; diff or revert anything.`);
  console.log(`    boss map                # what's available · boss unlock <mode> to grow ${dim('(terminal)')}`);
  console.log('');
}

function cmdUnlock(args) {
  const layer = args[0];
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  if (!layer) return fail(`usage: boss unlock <mode>   (current: ${stamp.mode || stamp.stage})`);

  const target = resolveStageId(layer);
  // Speak the words `unlock` actually accepts, not the internal stage ids — `boss help
  // unlock` already documents `quickstart | mvp | v1 | scale`, and an error that answers in
  // a different vocabulary than the one it takes is its own small betrayal (§C6).
  if (!target) return fail(`unknown mode '${layer}'. options: ${STAGE_ORDER.map(modeWord).join(' | ')}`);
  if (stamp.installedLayers.includes(target)) return fail(`${target} already installed.`);

  // Scale names its bar before you cross it (IDEA-040 trigger discipline, made a moment). It never
  // blocks — the house rule — but Scale is the mode most tempted by premature ceremony, so it says
  // out loud what earns the ceremony. Missing a leg is fine; carrying unearned ceremony is the cost.
  if (target === 'L3-scale') {
    console.log('\n  Scale-mode discipline pays for itself when three things are true:');
    console.log('    · revenue that recurs (a first-dollar EVID or better)');
    console.log('    · at least one non-founder in the work (`boss team` roster)');
    console.log('    · a coordination symptom you can name (a dropped handoff, a decision nobody');
    console.log('      owned, a 3am incident)');
    console.log(dim('  Missing one? That\'s fine — but you\'ll be carrying ceremony you haven\'t earned.'));
    console.log(dim('  Unlocking anyway (BOSS never blocks); the deviation is yours to own.'));
  }

  let m, applied;
  try {
    m = readStageManifest(target);
    applied = applyStage(target, process.cwd(), stageVars(stamp.name, target, m.name));
  } catch (e) {
    return fail(`${target} not authored yet — ${e.message}`);
  }

  stamp.stage = target;
  stamp.mode = m.name;
  stamp.installedLayers.push(target);
  stamp.agents = [...new Set([...(stamp.agents || []), ...(m.agents || [])])];
  stamp.skills = [...new Set([...(stamp.skills || []), ...(m.skills || [])])];
  stamp.hooks = [...new Set([...(stamp.hooks || []), ...(m.hooks || [])])];
  stamp.loops = [...new Set([...(stamp.loops || []), ...(m.loops || [])])];
  writeStamp(process.cwd(), stamp);
  registerProject({ name: stamp.name, path: process.cwd(), stage: target, mode: m.name, bossVersion: bossVersion() });
  console.log(`\n  ${ok('✦')} Unlocked ${bold(m.name + ' mode')} (${target}).`);
  if (applied.appendedClaude) console.log(`    ${ok('+')} appended ${m.name} working rules to CLAUDE.md`);
  const note = ROLE_SHIFT[target];
  if (note) {
    console.log(`\n  ${dim('— what this rung tends to ask of you —')}`);
    for (const line of note) console.log(`  ${line}`);
  }
  console.log('');
}

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

// The orientation core of `boss status` (EVID-001): what you're building right now,
// and that you're making headway. Reads the same board projection so status, board,
// and insights all agree on "in flight." Prints nothing it can't derive honestly.
function printFocusAndHeadway(projectDir) {
  let cards;
  try { ({ cards } = collectBoard(projectDir)); } catch { return; }
  const { finish, start, pressure } = computeNext(cards);
  console.log('');
  if (finish.length) {
    const f = finish[0];
    const more = finish.length > 1 ? dim(`   (+${finish.length - 1} more in flight)`) : '';
    console.log(`    ▸ ${bold('Building now:')}    ${f.id} — ${f.title}${more}`);
  } else if (start.length) {
    console.log(`    ▸ ${bold('Ready to build:')}  ${start[0].id} — ${start[0].title}   ${dim('→ /spec')}`);
  } else if (pressure.length) {
    console.log(`    ▸ ${bold('Next:')}            pressure-test ${pressure[0].id}   ${dim('→ /canvas')}`);
  } else {
    console.log(`    ▸ ${dim('Nothing in flight yet — /boss or /triage to capture an idea.')}`);
  }
  // Headway — the positive register BOSS lacks: the most recently shipped FEAT and how
  // long ago. Real shipped_on dates only; omitted (never guessed) when absent.
  const shipped = cards
    .filter((c) => c.column === 'Shipped' && /^FEAT/i.test(c.id) && c.shippedAgeDays != null)
    .sort((a, b) => a.shippedAgeDays - b.shippedAgeDays)[0];
  if (shipped) {
    const when = shipped.shippedAgeDays === 0 ? 'today' : `${shipped.shippedAgeDays}d ago`;
    console.log(`    ${ok('✓')} ${bold('Recent headway:')}  shipped ${shipped.id} ${dim(`(${when})`)}`);
  }
}

async function cmdStatus(args) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  const f = parseArgs(args || []);
  // `boss status --conscience` — drill into the conscience-state surface
  // (asked-for by eng-builder / indie-hacker / vibe-virtuoso personas in
  // v0.19 reactions: "I want to see what fired and why").
  if (f.conscience) {
    console.log(`\n  ${bold(stamp.name)}`);
    return await statusConscience(process.cwd(), { verbose: !!(f.verbose || f.v) });
  }
  const current = bossVersion();
  console.log(`\n  ${bold(stamp.name)}`);
  // Lead with orientation, not version metadata: where you are on the ladder, what
  // you're building right now, and whether you're moving (EVID-001 — a founder can't
  // tell any of these three today). Composed from the board projection; degrades
  // silently if the board can't be read.
  console.log(`  ▸ ${bold('You are here:')} ${stamp.mode || stamp.stage}`);
  console.log(`    ${renderLadder(stamp.installedLayers, stamp.stage)}`);
  printFocusAndHeadway(process.cwd());
  console.log('');
  console.log(`    ${dim('layers:')}       ${stamp.installedLayers.join(' → ')}`);
  console.log(`    ${dim('BOSS pinned:')}  ${stamp.bossVersion}   ${dim('current:')} ${current}`);
  if (stamp.bossVersion !== current) {
    console.log(`    ${warn('⟳')} newer practices available — ${bold('boss changelog')} ${dim('to read what changed,')}`);
    console.log(`      ${bold('/boss-sync')} ${dim('to review the diff and apply it (inside Claude)')}`);
  } else {
    console.log(`    ${dim('up to date with the BOSS installed here.')}`);
  }
  // Hop 1, answered from cache only — `boss status` must never make a network call (see
  // src/update.js). "Up to date with your install" is a different claim from "your install is
  // current", and conflating them is how a founder sits fifty releases behind feeling fine.
  const u = updateNote();
  if (u.state === 'behind') {
    console.log(`    ${warn('⟳')} your INSTALL is behind too — ${bold(u.latest)} is published. ${bold(u.cmd)}`);
  } else if (u.state === 'unknown') {
    console.log(`    ${dim(`whether the install itself is current: unchecked${u.age ? ` for ${u.age}d` : ''} — ${'boss update'}`)}`);
  }
  console.log('');
}

function cmdBoard(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  if (args.includes('--html')) {
    const out = boardHtml(process.cwd(), stamp.name);
    console.log(`\n  ${ok('✦')} Visual board → ${out}`);
    console.log('    A read of your files. Re-run `boss board --html` to refresh.\n');
    // Best-effort open in the default browser; printing the path is the contract.
    const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    try { spawn(opener, [out], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref(); } catch { /* path already printed */ }
    return;
  }
  // A retired project's board still reads honestly (nothing is deleted) — just note it once,
  // quietly, so the board isn't mistaken for a live one (IDEA-044 — /sunset).
  if (stamp.status === 'retired') {
    console.log(dim(`\n  ⊘ ${stamp.name} was retired ${stamp.retired_on || ''} — this is the record, not a live board. \`boss retire --undo\` to reopen.`));
  }
  // Owner lens (founder layer slice 2b): show `@owner` on cards only when this is a
  // team (dormant-solo); `--mine` narrows to the cards I own.
  const me = args.includes('--mine') ? resolveIdentity().handle : null;
  board(process.cwd(), stamp.name, {
    next: args.includes('--next'),
    blocked: args.includes('--blocked'),
    json: args.includes('--json'),
    all: args.includes('--all'),
    owners: isTeam(process.cwd()),
    mine: me ? '@' + me : null,
  });
}

function cmdMap(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  // `--next` expands the next rung's full skill list; the default keeps the preview
  // to that rung's headline few (IDEA-055 follow-on / REVIEW-2026-07-28 §C1).
  map(process.cwd(), stamp, { next: args.includes('--next'), all: args.includes('--all') });
}

function cmdBrain(args) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  try {
    brain(process.cwd(), stamp, args);
  } catch (e) {
    return fail(e.message);
  }
}

function cmdInsights() {
  // Read-your-own-trace lens (IDEA-021): works across all registered projects on this machine,
  // so it doesn't require being inside a BOSS project. Local-only; nothing is sent.
  insights(process.cwd());
}

function cmdTeam(args) {
  // The venture's people (founder layer slice 2, IDEA-037/FEAT-021). Dormant-solo:
  // an empty roster reads as a solo venture and changes nothing else.
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  const [sub, ...rest] = args;
  const handle = rest.find((a) => !a.startsWith('--'));
  const name = rest.filter((a) => a !== handle && !a.startsWith('--')).join(' ').trim() || null;
  try {
    if (sub === 'add') {
      if (!handle) return fail('usage: boss team add <@github-username> ["Name"]');
      const firstCofounder = !isTeam(process.cwd()); // solo → team transition
      const r = addCollaborator(process.cwd(), handle, name);
      const msg = r.added ? `\n  ${ok('✦')} Added ${r.handle} to the venture.`
        : r.self ? `\n  ${r.handle} is you — you're already on the venture.`
        : `\n  ${r.handle} is already on the venture.`;
      console.log(msg);
      // One-time, on the solo→team transition: point the new partnership at the
      // consent conversation (founder layer slice 5 / ai-adoption-culture practice).
      if (r.added && firstCofounder) {
        console.log('\n  You\'re a team now. Before you divide the work, have the AI consent + norms');
        console.log('  conversation — ask `mentor-cofounder` to walk you through it (who automates what,');
        console.log('  what stays human, "would I be proud to hand this to my cofounder?").');
      }
    } else if (sub === 'remove') {
      if (!handle) return fail('usage: boss team remove <@github-username>');
      const r = removeCollaborator(process.cwd(), handle);
      console.log(r.removed ? `\n  ${ok('✦')} Removed from the venture.` : '\n  Not on the roster.');
    } else if (sub && sub !== 'list') {
      return fail(`unknown subcommand 'team ${sub}'. options: (none) | add | remove`);
    }
    console.log(renderTeam(process.cwd()));
  } catch (e) {
    return fail(e.message);
  }
}

// `boss retire` (IDEA-044 — /sunset movement 3). Flips the current project to `retired`
// in both the local stamp and the registry. Reversible (`--undo`); nothing is deleted.
// The model half — the honest post-mortem + the harvest — lives in the /sunset skill;
// this is only the clean state change (predicate/runner split).
function cmdRetire(args) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  const f = parseArgs(args || []);
  if (f.undo) {
    delete stamp.status; delete stamp.retired_on;
    writeStamp(process.cwd(), stamp);
    reviveProject(process.cwd());
    console.log(`\n  ${ok('✦')} ${bold(stamp.name)} is active again. Nothing was ever deleted.\n`);
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  stamp.status = 'retired';
  stamp.retired_on = today;
  writeStamp(process.cwd(), stamp);
  retireProject(process.cwd(), today);
  console.log(`\n  ${ok('✦')} ${bold(stamp.name)} retired ${today}. A real experiment that returned an answer.`);
  console.log(`    The repo stays; only the status changed. Run \`boss retire --undo\` to reopen it.\n`);
}

function cmdList() {
  const projects = listProjects();
  if (!projects.length) {
    console.log('\n  No projects registered yet. Run `boss new <name>`.\n');
    return;
  }
  // Retired projects (IDEA-044) fold to the bottom, quiet — the shipped_on archive pattern
  // applied at the portfolio level. Active projects read first; retired ones are honest, not hidden.
  const active = projects.filter((p) => p.status !== 'retired');
  const retired = projects.filter((p) => p.status === 'retired');
  console.log(`\n  ${bold(active.length + ' connected project(s)')}:\n`);
  for (const p of active) {
    console.log(`    ${p.name.padEnd(20)} ${(p.mode || p.stage || '?').padEnd(12)} BOSS@${p.bossVersion || '?'}`);
    console.log(`    ${''.padEnd(20)} ${p.path}`);
  }
  if (retired.length) {
    console.log(`\n  ${retired.length} retired:`);
    for (const p of retired) {
      console.log(`    ${dim(p.name.padEnd(20) + ' retired ' + (p.retired_on || '—'))}`);
    }
  }
  console.log('');
}

// `boss remove` — the exit. Preview by default; `--apply` is the consent.
function cmdRemove(args) {
  const f = parseArgs(args || []);

  // `--global` is the OTHER exit: BOSS off the machine, not out of a project. Different act,
  // different blast radius, so it never happens as a side effect of the project one.
  if (f.global) {
    const { dir, files } = machineState();
    const cmd = updateCommand(installKind()).replace(/^npm i -g bossbuild@latest$/, 'npm uninstall -g bossbuild')
      .replace(/^brew upgrade boss$/, 'brew uninstall boss').replace(/^git pull && npm i -g \.$/, 'npm uninstall -g bossbuild');
    console.log(`\n  ${bold('Remove BOSS from this machine')}\n`);
    console.log(`    ${bold(cmd)}   ${dim('— removes the CLI')}`);
    console.log(`\n  ${dim('Machine-local state BOSS keeps outside any project:')} ${dim(dir)}`);
    for (const x of files) console.log(`    ${dim('·')} ${x}`);
    if (!files.length) console.log(`    ${dim('(none)')}`);
    // The non-obvious, reassuring half.
    console.log(`\n  ${dim('Your projects keep working either way — the conscience hook runs from the project')}`);
    console.log(`  ${dim("(node .claude/hooks/conscience.js) and doesn't call this CLI. You'd lose the `boss`")}`);
    console.log(`  ${dim('verbs, not the in-project experience. To take BOSS out of a project, run `boss remove` there.')}`);
    if (files.length && !f.apply) {
      console.log(`\n  ${dim('`boss remove --global --apply` deletes that state dir. The CLI itself is npm/brew\'s to remove.')}\n`);
    } else if (files.length && f.apply) {
      console.log(`\n  ${removeMachineState() ? ok('✦') + ` removed ${dir}` : err('✗') + ` could not remove ${dir}`}\n`);
    } else console.log('');
    return;
  }

  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  const plan = planRemove(process.cwd(), stamp);
  const total = plan.files.length + plan.blocks.length + (plan.bossDir ? 1 : 0);

  console.log(`\n  ${bold(stamp.name + ' — remove BOSS')}`);
  console.log(`    ${dim('layers:')} ${plan.layers.join(' → ')}\n`);

  console.log(`  ${bold('Would remove')} ${dim(`— ${plan.files.length} file(s) BOSS wrote, unchanged since`)}`);
  const head = plan.files.slice(0, 6).map((x) => x.rel);
  for (const r of head) console.log(`    ${warn('−')} ${r}`);
  if (plan.files.length > head.length) console.log(`    ${dim(`… +${plan.files.length - head.length} more`)}`);
  if (plan.bossDir) console.log(`    ${warn('−')} .boss/   ${dim("(mode, config, the conscience's private notes)")}`);
  for (const b of plan.blocks) console.log(`    ${warn('~')} ${b.rel}   ${dim('— BOSS block excised, the rest of the file kept')}`);
  if (plan.settings?.drop) console.log(`    ${warn('−')} ${plan.settings.rel}   ${dim("— BOSS wrote it and you never changed it, so it goes with BOSS")}`);
  else if (plan.settings) console.log(`    ${warn('~')} ${plan.settings.rel}   ${dim(`— ${plan.settings.removed} BOSS hook registration(s) only; your permissions, your own hooks and the secret-path deny floor all stay`)}`);

  // The half that makes this safe to run: say what SURVIVES, by name.
  console.log(`\n  ${bold('Would keep')}`);
  console.log(`    ${ok('✓')} everything BOSS didn't write — your code, and anything you authored`);
  if (plan.kept.length) {
    console.log(`    ${ok('✓')} ${bold(String(plan.kept.length))} file(s) you made under docs/ and .claude/ — e.g. ${plan.kept.slice(0, 3).join(', ')}${plan.kept.length > 3 ? ' …' : ''}`);
  }
  if (plan.edited.length) {
    console.log(`    ${ok('✓')} ${plan.edited.length} BOSS file(s) ${bold('you edited')} — yours now, never removed:`);
    for (const e of plan.edited.slice(0, 4)) console.log(`        ${e.rel}`);
    if (plan.edited.length > 4) console.log(`        ${dim(`… +${plan.edited.length - 4} more`)}`);
  }

  if (!f.apply) {
    console.log(`\n  Preview only. ${bold('boss remove --apply')} does it.`);
    console.log(`  ${dim('Commit first if you want a one-command undo — then `git checkout .` restores everything.')}`);
    console.log(`  ${dim('Taking BOSS off the machine instead? `boss remove --global`.')}\n`);
    return;
  }

  const done = applyRemove(process.cwd(), plan);
  // Deregister, never retire: `retire` is a VENTURE OUTCOME that `boss insights` reports on, and
  // removing BOSS says nothing about whether the venture is alive. Marking it retired would have
  // BOSS reporting a death that didn't happen.
  try { deregisterProject(process.cwd()); } catch { /* registry is best-effort */ }
  console.log(`\n  ${ok('✦')} BOSS removed — ${done.length} path(s). Your work is untouched.`);
  console.log(`    ${dim('`git status` shows exactly what changed. `boss adopt` any time you want it back.')}\n`);
  void total;
}

function cmdSync(args) {
  const { _: pos, apply, remove } = parseArgs(args);
  void pos;
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');

  const plan = planSync(process.cwd(), stamp);
  const changed = plan.entries.filter((e) => e.status !== 'ok');
  const settingsChanged = !!(plan.settings && plan.settings.changed);
  // An orphan the founder already deleted is history, not work. Only surface what's still here.
  const orphans = (plan.orphans || []).filter((o) => o.present);

  console.log(`\n  ${bold(stamp.name + ' — sync')}`);
  console.log(`    pin:    ${plan.pin}${plan.drift ? `  →  current ${plan.current}` : '  (current)'}`);
  console.log(`    layers: ${plan.layers.join(' → ')}\n`);

  if (!changed.length && !settingsChanged) {
    console.log(`    ${ok('✓')} BOSS-managed skills/agents/hooks are up to date.`);
    if (plan.drift && !apply) console.log('    (run `boss sync --apply` to bump the pin to current.)');
  } else {
    for (const e of changed) {
      const mark = e.status === 'new' ? ok('+ new    ') : warn(`~ changed (${e.delta} lines)`);
      console.log(`    ${mark}  ${e.kind}/${e.name}  →  ${e.rel}`);
    }
    if (settingsChanged) {
      console.log(`    ${warn('~ merge')}    settings/hooks + deny floor  →  ${plan.settings.rel}`);
      console.log(`    ${dim('              (additive — adds hook registrations and secret-path denies;')}`);
      console.log(`    ${dim('               never touches your allow list or defaultMode)')}`);
    }
  }

  // Retired by BOSS, still on disk. Reported ALWAYS, removed only on explicit `--remove`
  // (DEC-003: BOSS names what changed, the founder decides, then BOSS does the work). A removal
  // with no reason attached is just a deletion, so each one carries what replaced it and why.
  if (orphans.length) {
    console.log(`\n  ${bold('No longer shipped by BOSS')} ${dim('— still in your project')}`);
    for (const o of orphans) {
      const s = o.supersede;
      const arrow = s?.replacedBy ? `  →  now ${bold(`/${s.replacedBy}`)}` : '';
      console.log(`    ${warn('−')} ${o.kind}/${bold(o.name)}${arrow}   ${dim(o.rel)}`);
      if (s?.why) console.log(`        ${dim(s.why)}`);
      if (s?.migrate) console.log(`        ${dim(`what changes: ${s.migrate}`)}`);
      if (!s) console.log(`        ${dim("BOSS has no record of why this went — review it before removing.")}`);
      if (o.edited === true) console.log(`        ${warn('you edited this')} ${dim("— kept even with --remove; it's yours now.")}`);
      else if (o.edited === null) console.log(`        ${dim("BOSS can no longer tell whether you changed this (its template is gone) — check `git log` on it first.")}`);
    }
    const removable = orphans.filter((o) => o.edited !== true).length;
    if (!remove) {
      console.log(`\n    ${dim(`Nothing is deleted without asking. \`boss sync --apply --remove\` removes ${removable === orphans.length ? 'these' : `the ${removable} unedited one(s)`};`)}`);
      console.log(`    ${dim('`/boss-sync` in Claude walks the migration with you first.')}`);
    }
  }

  if (!apply) {
    console.log('\n  Preview only. Run `boss sync --apply` to write these and bump the pin,');
    console.log('  or use `/boss-sync` in Claude for a reviewed, narrated update.\n');
    return;
  }

  const { written, removed, stamp: next } = applySync(process.cwd(), plan, stamp, { remove });
  writeStamp(process.cwd(), next);
  registerProject({
    name: next.name, path: process.cwd(), stage: next.stage, mode: next.mode, bossVersion: next.bossVersion,
  });
  console.log(`\n  ${ok('✦')} Synced ${written.length} file(s)${removed.length ? `, removed ${removed.length}` : ''}; pin now ${bold(next.bossVersion)}.`);
  if (written.length || removed.length) console.log('    Review the changes with `git diff` before committing.\n');
  else console.log('');
}

function cmdLearn(args) {
  const f = parseArgs(args);
  const versionKind = f.major ? 'major' : f.patch ? 'patch' : 'minor';
  let res;
  try {
    res = learn({
      srcPath: f._[0],
      category: f.as,
      note: typeof f.note === 'string' ? f.note : undefined,
      versionKind,
      explicitVersion: typeof f.version === 'string' ? f.version : undefined,
      confirmed: f.yes === true,
    });
  } catch (e) {
    return fail(e.message);
  }
  console.log(`\n  ${ok('✦')} Learned ${bold(res.name)} UP into ${res.dest}`);
  console.log(`    BOSS ${res.prev} → ${res.next}  (VERSION + package.json + CHANGELOG updated)`);
  console.log(`    in ${res.root}   ${dim('(' + res.how + ')')}`);
  console.log('    Review, then commit. Connected projects pull it via `boss sync` / `/boss-sync`.\n');
}

// Async because the conscience surface now resolves the PROJECT's loop-runtime (§A4) —
// `await` matters here: without it a thrown error becomes an unhandled rejection instead
// of the clean one-line failure `boss conscience mute drfit` is supposed to produce.
async function cmdConscience(args) {
  const [sub, ...rest] = args;
  const flags = parseArgs(rest);
  try {
    if (sub === 'pause') return consciencePause(flags);
    if (sub === 'resume') return conscienceResume();
    if (sub === 'mute') return await conscienceMute(flags);
    if (sub === 'unmute') return conscienceUnmute(flags);
    if (sub === 'activity') return conscienceActivity(process.cwd());
    if (sub === 'cost') return conscienceActivity(process.cwd(), { asCost: true });
    if (sub === 'status' || !sub) {
      const stamp = readStamp(process.cwd());
      if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
      console.log(`\n  ${bold(stamp.name)}`);
      return await statusConscience(process.cwd(), { verbose: !!(flags.verbose || flags.v) });
    }
    return fail(`unknown subcommand 'conscience ${sub}'. options: pause | resume | mute | unmute | status | activity | cost`);
  } catch (e) {
    return fail(e.message);
  }
}

function fail(msg) {
  console.error(`  ${err('Error')} ${msg}`);
  process.exitCode = 1;
}

// --- Help (IDEA-055) ------------------------------------------------------
// Grouped so a first-timer isn't handed a 20-line wall at uniform weight:
// Start here / Everyday / Conscience / Keeping current. `boss help <command>`
// drills in; `boss help symbols` explains the glyph vocabulary. The two command
// LANGUAGES are cued explicitly — `boss …` is the shell, `/…` runs inside Claude.

const KNOWN_COMMANDS = [
  'new', 'adopt', 'unlock', 'status', 'board', 'map', 'brain', 'insights',
  'team', 'list', 'retire', 'remove', 'sync', 'learn', 'craft', 'changelog', 'update', 'conscience', 'version', 'help',
];

// Per-command detail for `boss help <command>`. Kept tight — a usage line, a
// sentence of what/why, then examples. The grouped overview is the front door;
// this is the second click.
const HELP = {
  new: {
    usage: 'boss new <name> [--ai]',
    what: 'Scaffold a fresh project in the lightest mode (Quickstart) and register it. Adds a screen-sized CLAUDE.md, the capture surfaces, and the conscience hook; git-inits.',
    examples: ['boss new my-app', 'boss new my-app --ai   # let /comprehend tailor the scaffold'],
    see: ['adopt', 'unlock', 'map'],
  },
  adopt: {
    usage: 'boss adopt [--mode <m>] [--ai]',
    what: 'Bring BOSS into an already-started repo, non-destructively — your files are untouched, BOSS lands at the lightest register that fits. --mode mvp adopts higher when the app has earned it.',
    examples: ['boss adopt', 'boss adopt --mode mvp   # already has real users'],
    see: ['new', 'unlock'],
  },
  unlock: {
    usage: 'boss unlock <mode>   (quickstart | mvp | v1 | scale)',
    what: 'Add the next mode\'s skills/agents/loops. Additive — nothing is ever removed, and each unlock is your call. Modes scale ceremony to evidence; a project that stays in Quickstart forever is legitimate.',
    examples: ['boss unlock mvp', 'boss unlock v1'],
    see: ['map', 'status'],
  },
  status: {
    usage: 'boss status [--conscience] [--verbose]',
    what: 'This project at a glance: mode, installed layers, pinned vs current BOSS version, and any drift. --conscience shows the loop states, cohort, and recent overrides; add --verbose for the full ledger.',
    examples: ['boss status', 'boss status --conscience', 'boss status --conscience --verbose'],
    see: ['map', 'sync', 'conscience'],
  },
  board: {
    usage: 'boss board [--html] [--next|--blocked|--json] [--all] [--mine]',
    what: 'A live read of what\'s in flight (Captured → Taking shape → Building → Shipped), derived from your files — never a document you maintain. --html opens a visual kanban; --next/--blocked/--json are the agent-readable views.',
    examples: ['boss board', 'boss board --next', 'boss board --html'],
    see: ['insights', 'brain'],
  },
  map: {
    usage: 'boss map [--next] [--all]',
    what: 'The live cheatsheet for THIS project: where you are on the ladder, what each installed skill does, and a short preview of what the next unlock adds. A pure read of your install — nothing to maintain, nothing to drift. --next expands the full list of what the next rung would add; --all also shows the post-launch skills, which stay folded until you have shipped something.',
    examples: ['boss map', 'boss map --next   # everything the next rung adds', 'boss map --all    # including the post-launch arc'],
    see: ['status', 'unlock'],
  },
  brain: {
    usage: 'boss brain [--diff|--relationship]   ·   boss brain forget --before <date>',
    what: 'The conscience\'s persistent read on this venture (its POV, in plain English). --diff shows how it evolved; --relationship shows what it said and what you did with it. forget evicts old reads (living memory, founder-invoked).',
    examples: ['boss brain', 'boss brain --relationship'],
    see: ['status', 'conscience'],
  },
  insights: {
    usage: 'boss insights',
    what: 'Read the honest trace your own work already leaves, across every project on this machine: where each loop stands (idea → canvas → build), cycle time, kill-speed. Measures graduation, never activity. Local-only — nothing is sent.',
    examples: ['boss insights'],
    see: ['board', 'list'],
  },
  team: {
    usage: 'boss team [add @user ["Name"] | remove @user]',
    what: 'Who\'s on the venture. Solo by default and dormant — adding a cofounder lights up the team layer (shared decisions, the partnership mentor). Keyed on GitHub identity; never fabricated.',
    examples: ['boss team', 'boss team add @octocat "Mona"'],
    see: ['board', 'list'],
  },
  list: {
    usage: 'boss list',
    what: 'Every BOSS project connected on this machine, active first, retired ones folded quietly at the bottom.',
    examples: ['boss list'],
    see: ['insights', 'status'],
  },
  retire: {
    usage: 'boss retire [--undo]',
    what: 'End a project honestly — mark it retired (reversible; nothing is deleted). The /sunset skill inside Claude runs the post-mortem and harvest; this is just the clean state change.',
    examples: ['boss retire', 'boss retire --undo'],
    see: ['list', 'insights'],
  },
  sync: {
    usage: 'boss sync [--apply] [--remove]',
    what: "Pull current BOSS skills/agents/hooks into this project (the DOWN direction). Without --apply it previews the diff only. It also lists anything BOSS installed here and has since RETIRED, with what replaced it and why — but `--apply` never deletes: removal is a separate, explicit `--remove`, and something you edited is never removed at all. Only files BOSS itself stamped are ever candidates; your own skills and agents are invisible to sync. For a reviewed, narrated update — and the actual migration to whatever replaced a retired verb — use /boss-sync inside Claude instead.",
    examples: ['boss sync', 'boss sync --apply', 'boss sync --apply --remove'],
    see: ['status', 'changelog', 'learn'],
  },
  update: {
    usage: 'boss update',
    what: "Check whether the BOSS you have INSTALLED is the latest published one, and print the exact upgrade command for how you installed it (npm, Homebrew, or a git checkout). This is the one thing `boss status` cannot tell you on its own: it compares a project against your installed package, so 'up to date' has always meant 'your project matches your install' — never 'your install is current'. Runs a single public version lookup, ONLY when you invoke it: no project data leaves your machine, and `boss status` reads the cached result rather than ever making a call itself. Offline is fine — it shrugs and tells you the last thing it knew.",
    examples: ['boss update'],
    see: ['status', 'changelog', 'sync'],
  },
  remove: {
    usage: 'boss remove [--apply]   ·   boss remove --global [--apply]',
    what: "Take BOSS back out. Without --apply it previews only. It removes what BOSS WROTE and nothing else: files you authored are never touched, a BOSS file you EDITED is yours and is kept, your CLAUDE.md keeps everything except BOSS's marked block, and settings.json loses only BOSS's hook registrations — your permissions, your own hooks and the secret-path deny floor all stay (removing a deny would widen access on the way out). That boundary matters most in docs/, where your ideas and decisions sit in the same tree as BOSS's scaffold. `--global` is the OTHER exit: it prints the uninstall command for how you installed BOSS and lists the machine-local state in ~/.boss. Note your projects keep working after a global uninstall — the conscience hook runs from the project and doesn't call this CLI.",
    examples: ['boss remove', 'boss remove --apply', 'boss remove --global'],
    see: ['adopt', 'retire', 'sync'],
  },
  changelog: {
    usage: 'boss changelog [--since X.Y.Z] [--full] [--all]',
    what: "What changed in BOSS. Inside a project it defaults to the cut that matters — everything since THIS project's pin, which is the question you have the moment `boss status` says newer practices are available. The changelog ships inside the package, so this works from any project and is always exactly as current as your installed version. `/boss-sync` narrates from these entries; this is where they come from. Note what it can and can't tell you: it compares your project against the BOSS you have INSTALLED, so \"nothing new\" means your install and your project agree — not that your install is current. Updating the tool (`npm i -g bossbuild@latest`, or `brew upgrade boss`) is a separate step from updating a project.",
    examples: ['boss changelog', 'boss changelog --full', 'boss changelog --since 0.140.0', 'boss changelog --all'],
    see: ['sync', 'status'],
  },
  craft: {
    usage: 'boss craft [name] [--outline]',
    what: "Read BOSS's practice shelf — the craft the skills and agents are built on. The shelf ships inside the package, so it works from any project and is always exactly as current as your installed version. With no argument it lists every practice; with a name (prefixes work) it prints that one. This is BOSS's shelf, read-only — your own team's craft notes live in /practice as PRAC-NNN records. The shelf listing shows each practice's length and flags anything past 2\u00d7 the median \u2014 a shelf that only ever grows is how a toolkit becomes a framework, so those are subtraction candidates for the next refresh, and --outline maps a long one before you pull it whole.",
    examples: ['boss craft', 'boss craft testing-with-agents', 'boss craft testing', 'boss craft design-system --outline'],
    see: ['sync', 'learn'],
  },
  learn: {
    usage: `boss learn <path> --as <category> [--yes]   (${LIBRARY_CATEGORIES.join(' | ')})`,
    what: 'Promote a proven pattern UP into the BOSS library so every future project inherits it. This writes into the BOSS SOURCE checkout — usually not the repo you\'re standing in — bumping its VERSION and CHANGELOG, so it names the target and asks before writing unless you pass --yes. Set BOSS_SRC to point it somewhere specific. The judgment layer over this is /boss-learn inside Claude (a two-way UP/DOWN router).',
    examples: ['boss learn ./my-practice.md --as practices', 'BOSS_SRC=~/code/bossbuild boss learn ./p.md --as practices --yes'],
    see: ['sync'],
  },
  conscience: {
    usage: 'boss conscience <pause|resume|mute|unmute|status|activity>',
    what: 'Control and inspect the conscience. pause silences everything for a bounded sprint; mute turns down one nudge (say, drift) while the rest keep speaking; activity is the over-fire check; status shows what\'s open and any recorded overrides.',
    examples: [
      'boss conscience pause --for 8h',
      'boss conscience mute drift --for 7d',
      'boss conscience resume',
      'boss conscience activity',
    ],
    see: ['status', 'brain'],
  },
  version: { usage: 'boss version', what: 'Print the installed BOSS version.', examples: ['boss version'], see: [] },
};

// The glyph vocabulary, in one place (`boss help symbols`). Every surface uses
// these; nowhere else explained them (IDEA-055).
const SYMBOLS = [
  [ok('✦'), 'done — a thing happened and it worked'],
  [ok('✓'), 'passing / closed / up to date'],
  [warn('⚠'), 'worth a look — a soft warning, not a failure'],
  [warn('⟳'), 'newer BOSS practices available (drift)'],
  ['▸', 'you are here / a section heading'],
  [dim('·'), 'quiet — dormant, stale, or nothing to report'],
  [dim('⊘'), 'retired (the record stays; only the status changed)'],
  ['⏸', 'the conscience is paused'],
  ['⌛', 'aging in build — open a while; finish it or /revalidate'],
  ['↻', 'review due (a paused item\'s next_review date has passed)'],
  ['⬆', 'priority: high'],
  ['→', 'next / points to'],
];

// `boss help hooks` — the three dormant hooks, what each costs, and how to turn one on.
//
// These ship into every project UNREGISTERED on purpose (a PreToolUse hook fires a process
// on every tool call), and that decision is right. What was wrong is that the only place
// it was written down was a comment INSIDE the JavaScript file (§C7) — so a non-technical
// founder, an explicitly targeted cohort, could never find them, and `/judge-traces` was
// advertised in `boss map` while its data source stayed off with no way to know.
//
// A help TOPIC, not a new command: BOSS has 48 skills and the standing instruction is
// compose, don't add.
const OPTIONAL_HOOKS = [
  {
    name: 'secrets-guard',
    event: 'PreToolUse',
    does: 'Stops a tool from reading a secret\'s CONTENTS into the model\'s context — denies Read/Edit of .env and secrets/, asks before a Bash command or MCP call that references one.',
    cost: 'a process on EVERY tool call',
    worth: 'regulated / PHI / high-stakes work, where the deny-list floor in settings.json isn\'t enough',
  },
  {
    name: 'memory-cue',
    event: 'UserPromptSubmit',
    does: 'Notices when you say something durable ("from now on…", "no, don\'t…", "perfect, keep doing…") and nudges Claude to save it to project memory. It never writes the memory itself.',
    cost: 'a process per prompt, silent unless a pattern matches',
    worth: 'you keep repeating the same correction across sessions',
  },
  {
    name: 'auto-log',
    event: 'SubagentStop',
    does: 'Appends one honest line per writer-subagent to .boss/trace.jsonl — what it touched, when. Local-only, append-only, never sent anywhere. This is the substrate /judge-traces reads.',
    cost: 'a process after every subagent',
    worth: 'you want /judge-traces to have anything to read (it is empty until this is on)',
  },
  {
    name: 'design-tokens-guard',
    event: 'PostToolUse',
    does: 'Catches hardcoded colors (hex, rgb()/hsl(), palette classes like bg-blue-500) the moment they\'re written, and hands Claude your token names instead. Silent until a DESIGN_TOKENS.md exists — no token system, no opinion.',
    cost: 'a process after each file write',
    worth: 'you have a token system and want it to actually hold — a prompt convention is a filter, this is the check',
  },
];

function printHooks() {
  console.log(`\n  ${bold('Optional hooks')}  ${dim('— shipped with your project, switched OFF')}\n`);
  console.log(`  ${OPTIONAL_HOOKS.length} hooks land in \`.claude/hooks/\` and do nothing until you register them.`);
  console.log(`  That is deliberate: a hook runs a process on every matching event, and BOSS won't`);
  console.log(`  spend your latency without you asking. ${dim('An unregistered script costs nothing.')}\n`);
  for (const h of OPTIONAL_HOOKS) {
    console.log(`  ${bold('/' + h.name.padEnd(20))} ${dim(h.event)}`);
    console.log(`    ${h.does}`);
    console.log(`    ${dim('costs:')} ${h.cost}`);
    console.log(`    ${dim('worth it when:')} ${h.worth}\n`);
  }
  console.log(`  ${bold('To turn one on')}`);
  console.log('    Each file\'s header has the exact settings.json block to paste — open');
  console.log(`    ${dim('.claude/hooks/<name>.js')} and copy the "TO TURN IT ON" snippet into`);
  console.log(`    ${dim('.claude/settings.json')}. The registration IS the on-switch.`);
  console.log(`\n  ${dim('`boss sync` keeps these files current whether or not you\'ve turned them on.')}\n`);
}

function printSymbols() {
  console.log(`\n  ${bold('Symbols')}  ${dim('— the glyph vocabulary, shared across boss map / board / status')}\n`);
  for (const [g, meaning] of SYMBOLS) console.log(`    ${g}   ${meaning}`);
  console.log('');
}

function printCommandHelp(name) {
  const h = HELP[name];
  if (!h) return printHelp(); // unknown topic → the overview
  console.log(`\n  ${bold(h.usage)}\n`);
  console.log(`    ${h.what}`);
  if (h.examples?.length) {
    console.log(`\n    ${dim('examples')}`);
    for (const ex of h.examples) console.log(`      ${ex}`);
  }
  if (h.see?.length) console.log(`\n    ${dim('see also:')} ${h.see.map((s) => 'boss help ' + s).join(' · ')}`);
  console.log('');
}

// The grouped overview. Group headers are bold so the eye has anchors; the two
// command languages are cued in the footer.
function printHelp() {
  // 34, not 30: three rows (`boss board --next|--blocked|--json` and friends) overran a
  // 30-wide column, so their descriptions started one space in while every other row's
  // started at column 35 — visible in the very first thing a new user sees (§C5).
  const row = (cmd, desc) => `    ${cmd.padEnd(34)} ${dim(desc)}`;
  console.log(`\n  ${bold('BOSS')} ${bossVersion()}   ${dim('· a just-in-time startup incubator. Make it real.')}\n`);

  console.log(`  ${bold('Start here')}`);
  console.log(row('boss new <name> [--ai]', 'scaffold a new project (Quickstart) + register it'));
  console.log(row('boss adopt [--mode <m>] [--ai]', 'bring BOSS into an already-started repo, non-destructively'));
  console.log(row('boss map [--next|--all]', 'live cheatsheet: where you are + what\'s one unlock away'));

  console.log(`\n  ${bold('Everyday')}`);
  console.log(row('boss board [--html]', 'what\'s in flight (captured → shipped); --html = kanban'));
  console.log(row('boss board --next|--blocked|--json', 'what to pick up · what\'s stuck · JSON (agent-readable)'));
  console.log(row('boss status [--conscience]', 'mode + pinned version + drift (--conscience: loop states)'));
  console.log(row('boss unlock <mode>', 'climb a rung: quickstart → mvp → v1 → scale'));
  console.log(row('boss brain [--diff|--relationship]', 'the conscience\'s read on this venture'));
  console.log(row('boss insights', 'how far your ventures have gotten (local · nothing sent)'));
  console.log(row('boss team [add @user]', 'who\'s on the venture (solo by default)'));

  console.log(`\n  ${bold('Conscience')}`);
  console.log(row('boss conscience pause [--for 8h]', 'silence everything for a bounded sprint'));
  console.log(row('boss conscience mute <moment>', 'turn down one nudge (drift|caution|…)'));
  console.log(row('boss conscience activity', 'how often it fires (over-fire check)'));
  console.log(`    ${dim('resume · unmute · status round it out — boss help conscience')}`);

  console.log(`\n  ${bold('Keeping current')}`);
  console.log(row('boss sync [--apply]', 'pull current BOSS practices into this project (DOWN)'));
  console.log(row('boss changelog [--full]', "what's changed in BOSS since this project's pin"));
  console.log(row('boss update', 'is the BOSS you have installed the latest one?'));
  console.log(row('boss learn <p> --as <c>', 'promote a pattern UP into the library'));
  console.log(row('boss craft [name]', "read BOSS's practice shelf (the craft behind the skills)"));
  console.log(row('boss list', 'all connected projects'));
  console.log(row('boss retire [--undo]', 'end a project honestly (reversible)'));
  console.log(row('boss remove [--apply]', 'take BOSS back out of this project · --global for the machine'));
  console.log(row('boss version', 'the installed BOSS version'));

  console.log(`\n  ${dim('modes:')} Quickstart ${dim('(capture)')} · MVP ${dim('(build)')} · V1 ${dim('(ship)')} · Scale ${dim('(grow)')}`);
  console.log(`  ${dim('boss help <command>')} for detail · ${dim('boss help symbols')} glyphs · ${dim('boss help hooks')} optional hooks`);
  console.log(`  ${dim('Commands starting with / (e.g. /boss, /canvas) run inside Claude Code, not the shell.')}\n`);
}

function cmdHelp(args) {
  const topic = args.find((a) => !a.startsWith('-'));
  if (!topic) return printHelp();
  if (topic === 'symbols' || topic === 'symbol' || topic === 'legend') return printSymbols();
  if (topic === 'hooks' || topic === 'hook') return printHooks();
  return printCommandHelp(topic);
}

// Levenshtein for the did-you-mean nudge — tiny, zero-dep.
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

function nearestCommand(input) {
  let best = null, bestD = Infinity;
  for (const c of KNOWN_COMMANDS) {
    const d = editDistance(input, c);
    if (d < bestD) { bestD = d; best = c; }
  }
  return bestD <= 3 ? best : null; // only suggest when it's plausibly a typo
}

export async function run(argv) {
  const [cmd, ...args] = argv;
  switch (cmd) {
    case 'new': return cmdNew(args);
    case 'adopt': return cmdAdopt(args);
    case 'unlock': return cmdUnlock(args);
    case 'status': return cmdStatus(args);
    case 'board': return cmdBoard(args);
    case 'map': return cmdMap(args);
    case 'brain': return cmdBrain(args);
    case 'insights': return cmdInsights();
    case 'team': return cmdTeam(args);
    case 'list': return cmdList();
    case 'retire': return cmdRetire(args);
    case 'remove': case 'uninstall': return cmdRemove(args);
    case 'sync': return cmdSync(args);
    case 'learn': return cmdLearn(args);
    case 'craft': return void (process.exitCode = printCraft(
      args.find((a) => !a.startsWith('--')),
      { outline: args.includes('--outline') },
    ));
    case 'changelog': case 'whatsnew': {
      const f = parseArgs(args || []);
      return void (process.exitCode = printChangelog({
        since: typeof f.since === 'string' ? f.since : null,
        all: !!f.all,
        full: !!f.full,
        // In a BOSS project the interesting cut is "since MY pin" — the question a founder has
        // the moment `boss status` says newer practices are available.
        pin: readStamp(process.cwd())?.bossVersion || null,
      }));
    }
    case 'update': case 'outdated': return void printUpdate().then((c) => { process.exitCode = c; });
    case 'conscience': return cmdConscience(args);
    case 'version': case '--version': case '-v':
      return console.log(bossVersion());
    case undefined: case 'help': case '--help': case '-h':
      return cmdHelp(args);
    default: {
      // An unknown command shouldn't silently dump the manual — say so first, offer
      // the nearest match, then point at help. Exit non-zero (IDEA-055 P0.3).
      const guess = nearestCommand(cmd);
      console.error(`  ${err('Error')} unknown command ${bold("'" + cmd + "'")}.${guess ? ` Did you mean ${bold('boss ' + guess)}?` : ''}`);
      console.error(`  Run ${bold('boss help')} to see everything boss can do.`);
      process.exitCode = 1;
    }
  }
}
