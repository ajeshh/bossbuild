import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { bossVersion, STAGE_ORDER, resolveStageId } from './paths.js';
import { applyStage, applyStageSafe, appendClaudeBlock, appendMarkedBlock, readStageManifest } from './scaffold.js';
import { registerProject, listProjects, findByPath, retireProject, reviveProject } from './registry.js';
import { planSync, applySync, computeSettingsMerge } from './sync.js';
import { learn, LIBRARY_CATEGORIES } from './learn.js';
import { statusConscience, consciencePause, conscienceResume, conscienceMute, conscienceUnmute, conscienceActivity } from './conscience.js';
import { board, boardHtml } from './board.js';
import { map } from './map.js';
import { brain } from './brain.js';
import { insights } from './insights.js';
import { renderTeam, addCollaborator, removeCollaborator, isTeam, resolveIdentity } from './team.js';

const STAMP = '.boss/manifest.json';

// Quiet text for the terminal (matches brain.js/conscience.js). No-op when not a TTY.
const dim = (s) => (process.stdout.isTTY ? `\x1b[90m${s}\x1b[0m` : s);

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

  console.log(`\n  ✦ Created ${name} — ${manifest.name} mode (${stageId}, BOSS ${bossVersion()})`);
  console.log(`    agents: ${stamp.agents.join(', ') || '—'}`);
  console.log(`    skills: ${stamp.skills.join(', ') || '—'}`);
  console.log(`\n  Next:`);
  console.log(`    cd ${name}`);
  console.log(`    code ${name}        # or open the folder in your editor (Cursor, etc.)`);
  console.log(`    claude              # open Claude Code (works in the terminal or the editor panel)`);
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
  // Default to the lightest register (Quickstart); `--mode mvp` etc. adopts higher
  // when the app has already earned it (real users, a real build).
  const stageId = flags.mode ? resolveStageId(flags.mode) : STAGE_ORDER[0];
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
      `1. **Capture before you build** (every idea → \`IDEA-NNN\`; see \`docs/ideas/INDEX.md\`).\n` +
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

  console.log(`\n  ✦ Adopted ${name} into BOSS — ${manifest.name} mode (${stageId}, BOSS ${bossVersion()})`);
  console.log(`    ${copied.length} file(s) added · ${skipped.length} of yours left untouched${claudePreexisted ? ' · CLAUDE.md preserved (BOSS block appended)' : ''}`);
  console.log(`    skills: ${stamp.skills.join(', ') || '—'}`);
  console.log(`\n  Next:`);
  console.log(`    claude              # open Claude Code here`);
  console.log(`    > /welcome              # what BOSS added + how the conscience works`);
  if (flags.ai) {
    console.log(`    > /comprehend           # AI-native: read this repo, tailor the scaffold + seed the venture brain`);
  }
  console.log(`    boss map                # what's available · boss unlock <mode> to grow`);
  console.log('');
}

function cmdUnlock(args) {
  const layer = args[0];
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  if (!layer) return fail(`usage: boss unlock <mode>   (current: ${stamp.mode || stamp.stage})`);

  const target = resolveStageId(layer);
  if (!target) return fail(`unknown mode '${layer}'. options: ${STAGE_ORDER.join(', ')}`);
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
  console.log(`\n  ✦ Unlocked ${m.name} mode (${target}).`);
  if (applied.appendedClaude) console.log(`    + appended ${m.name} working rules to CLAUDE.md`);
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

function cmdStatus(args) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  const f = parseArgs(args || []);
  // `boss status --conscience` — drill into the conscience-state surface
  // (asked-for by eng-builder / indie-hacker / vibe-virtuoso personas in
  // v0.19 reactions: "I want to see what fired and why").
  if (f.conscience) {
    console.log(`\n  ${stamp.name}`);
    return statusConscience(process.cwd());
  }
  const current = bossVersion();
  console.log(`\n  ${stamp.name}`);
  console.log(`    mode:         ${stamp.mode || stamp.stage}  (${stamp.stage})`);
  console.log(`    layers:       ${stamp.installedLayers.join(' → ')}`);
  console.log(`    BOSS pinned:  ${stamp.bossVersion}`);
  console.log(`    BOSS current: ${current}`);
  if (stamp.bossVersion !== current) {
    console.log(`    ⟳ newer practices available — run /boss-sync to review the diff`);
  }
  console.log('');
}

function cmdBoard(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  if (args.includes('--html')) {
    const out = boardHtml(process.cwd(), stamp.name);
    console.log(`\n  ✦ Visual board → ${out}`);
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

function cmdMap() {
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
  map(process.cwd(), stamp);
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
      const msg = r.added ? `\n  ✦ Added ${r.handle} to the venture.`
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
      console.log(r.removed ? '\n  ✦ Removed from the venture.' : '\n  Not on the roster.');
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
    console.log(`\n  ✦ ${stamp.name} is active again. Nothing was ever deleted.\n`);
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  stamp.status = 'retired';
  stamp.retired_on = today;
  writeStamp(process.cwd(), stamp);
  retireProject(process.cwd(), today);
  console.log(`\n  ✦ ${stamp.name} retired ${today}. A real experiment that returned an answer.`);
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
  console.log(`\n  ${active.length} connected project(s):\n`);
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

// Minimal flag parser: returns { _: [positionals], flag: value|true }.
function parseArgs(args) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith('--')) { out[key] = next; i++; }
      else out[key] = true;
    } else {
      out._.push(a);
    }
  }
  return out;
}

function cmdSync(args) {
  const { _: pos, apply } = parseArgs(args);
  void pos;
  const stamp = readStamp(process.cwd());
  if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');

  const plan = planSync(process.cwd(), stamp);
  const changed = plan.entries.filter((e) => e.status !== 'ok');
  const settingsChanged = !!(plan.settings && plan.settings.changed);

  console.log(`\n  ${stamp.name} — sync`);
  console.log(`    pin:    ${plan.pin}${plan.drift ? `  →  current ${plan.current}` : '  (current)'}`);
  console.log(`    layers: ${plan.layers.join(' → ')}\n`);

  if (!changed.length && !settingsChanged) {
    console.log('    ✓ BOSS-managed skills/agents/hooks are up to date.');
    if (plan.drift && !apply) console.log('    (run `boss sync --apply` to bump the pin to current.)');
  } else {
    for (const e of changed) {
      const mark = e.status === 'new' ? '+ new    ' : `~ changed (${e.delta} lines)`;
      console.log(`    ${mark}  ${e.kind}/${e.name}  →  ${e.rel}`);
    }
    if (settingsChanged) {
      console.log(`    ~ merge    settings/hooks  →  ${plan.settings.rel}  (additive — keeps your permissions)`);
    }
  }

  if (!apply) {
    console.log('\n  Preview only. Run `boss sync --apply` to write these and bump the pin,');
    console.log('  or use `/boss-sync` in Claude for a reviewed, narrated update.\n');
    return;
  }

  const { written, stamp: next } = applySync(process.cwd(), plan, stamp);
  writeStamp(process.cwd(), next);
  registerProject({
    name: next.name, path: process.cwd(), stage: next.stage, mode: next.mode, bossVersion: next.bossVersion,
  });
  console.log(`\n  ✦ Synced ${written.length} file(s); pin now ${next.bossVersion}.`);
  if (written.length) console.log('    Review the changes with `git diff` before committing.\n');
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
    });
  } catch (e) {
    return fail(e.message);
  }
  console.log(`\n  ✦ Learned ${res.name} UP into ${res.dest}`);
  console.log(`    BOSS ${res.prev} → ${res.next}  (VERSION + package.json + CHANGELOG updated)`);
  console.log(`    in ${res.root}`);
  console.log('    Review, then commit. Connected projects pull it via `boss sync` / `/boss-sync`.\n');
}

function cmdConscience(args) {
  const [sub, ...rest] = args;
  const flags = parseArgs(rest);
  try {
    if (sub === 'pause') return consciencePause(flags);
    if (sub === 'resume') return conscienceResume();
    if (sub === 'mute') return conscienceMute(flags);
    if (sub === 'unmute') return conscienceUnmute(flags);
    if (sub === 'activity') return conscienceActivity(process.cwd());
    if (sub === 'cost') return conscienceActivity(process.cwd(), { asCost: true });
    if (sub === 'status' || !sub) {
      const stamp = readStamp(process.cwd());
      if (!stamp) return fail('not a BOSS project (no .boss/manifest.json here).');
      console.log(`\n  ${stamp.name}`);
      return statusConscience(process.cwd());
    }
    return fail(`unknown subcommand 'conscience ${sub}'. options: pause | resume | mute | unmute | status | activity | cost`);
  } catch (e) {
    return fail(e.message);
  }
}

function fail(msg) {
  console.error(`  boss: ${msg}`);
  process.exitCode = 1;
}

export function run(argv) {
  const [cmd, ...args] = argv;
  switch (cmd) {
    case 'new': return cmdNew(args);
    case 'adopt': return cmdAdopt(args);
    case 'unlock': return cmdUnlock(args);
    case 'status': return cmdStatus(args);
    case 'board': return cmdBoard(args);
    case 'map': return cmdMap();
    case 'brain': return cmdBrain(args);
    case 'insights': return cmdInsights();
    case 'team': return cmdTeam(args);
    case 'list': return cmdList();
    case 'retire': return cmdRetire(args);
    case 'sync': return cmdSync(args);
    case 'learn': return cmdLearn(args);
    case 'conscience': return cmdConscience(args);
    case 'version': case '--version': case '-v':
      return console.log(bossVersion());
    default:
      console.log(`BOSS ${bossVersion()}\n`);
      console.log('  boss new <name> [--ai]   scaffold a new project in Quickstart mode + register it (--ai: tailor via /comprehend)');
      console.log('  boss adopt [--mode <m>] [--ai]  bring BOSS into an already-started repo, non-destructively (--ai: comprehend it)');
      console.log('  boss unlock <mode>       level up: quickstart → mvp → v1 → scale');
      console.log('  boss status              this project: mode, pinned version, drift');
      console.log('  boss status --conscience this project: loop states + cohort + recent overrides');
      console.log('  boss map                 live cheatsheet: where you are + what\'s one unlock away');
      console.log('  boss board [--html]      a live read of what\'s in flight (captured → shipped); --html opens a visual kanban');
      console.log('  boss board --next|--blocked|--json   what to pick up next · what\'s not moving · the projection as JSON (agent-readable)');
      console.log('  boss board --mine        (team) narrow the board to the cards you own (owner: @you)');
      console.log('  boss brain [--diff|--relationship]  the conscience\'s read (POV); --diff = how it evolved; --relationship = what it said & what you did');
      console.log('  boss brain forget --before <date>   evict old reads (living memory; founder-invoked)');
      console.log('  boss insights            read your own projects\' trace: where each loop stands (local · nothing sent)');
      console.log('  boss team [add @user|remove @user]   who\'s on the venture (solo by default; add a cofounder to light up the team layer)');
      console.log('  boss list                all connected projects');
      console.log('  boss retire [--undo]     end a project honestly: mark it retired (reversible; the /sunset skill runs the post-mortem)');
      console.log('  boss sync [--apply]      pull current BOSS skills/agents/hooks into this project (DOWN)');
      console.log(`  boss learn <p> --as <c>  promote a pattern UP into the library (${LIBRARY_CATEGORIES.join('|')})`);
      console.log('  boss conscience pause    silence the conscience for a bounded session [--for 8h|--until-resume]');
      console.log('  boss conscience resume   re-enable the conscience');
      console.log('  boss conscience mute     silence ONE moment (drift|caution|…) [--for 7d|--until-resume]');
      console.log('  boss conscience unmute   un-silence a moment (or --all)');
      console.log('  boss conscience activity how often the conscience fires (over-fire check; alias: cost)');
      console.log('  boss version             BOSS version\n');
      console.log('  modes: Quickstart (capture an idea) · MVP (build it) · V1 (ship it) · Scale (grow it)\n');
  }
}
