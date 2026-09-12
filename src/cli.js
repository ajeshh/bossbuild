import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve, basename, sep } from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { bossVersion, STAGE_ORDER, resolveStageId, isBossRepo, BOSS_HOME } from './paths.js';
import { applyStage, applyStageSafe, appendClaudeBlock, appendGitignoreBlock, appendMarkedBlock, readStageManifest } from './scaffold.js';
import { registerProject, listProjects, findByPath, retireProject, reviveProject, deregisterProject, projectPin, onDisk } from './registry.js';
import { planSync, applySync, stampManaged, computeSettingsMerge } from './sync.js';
import { learn, LEARN_CATEGORIES, SHIPPED_CLASSES, SHELF_CATEGORIES } from './learn.js';
import { printCraft } from './craft.js';
import { printChangelog, cmpVersion } from './changelog.js';
import { detectStage, inferSourceGlobs } from './detect.js';
import { printUpdate, updateNote, installKind, uninstallCommand } from './update.js';
import { printCredit } from './credit.js';
import { planRemove, applyRemove, machineState, removeMachineState } from './remove.js';
import { built, nextSeam } from './ladder.js';
import { statusConscience, consciencePause, conscienceResume, conscienceMute, conscienceUnmute, conscienceActivity } from './conscience.js';
import { board, boardHtml, collectBoard, computeNext } from './board.js';
import { recap } from './recap.js';
import { map, renderLadder } from './map.js';
import { modeWord, loadModes } from './modes.js';
import { brain } from './brain.js';
import { insights } from './insights.js';
import { gistWork, recordDrift, driftLine, nextId, idCensus, timeline, programs } from './records.js';
import { renderTeam, addCollaborator, removeCollaborator, isTeam, resolveIdentity } from './team.js';
import { printReentry, printEvidenceHeadway, printIntent } from './orientation.js';
import { readiness, renderReadiness } from './readiness.js';
import { dim, bold, ok, warn, err } from './ui.js';
import { parseArgs } from './args.js';
import { lookup, terms } from './glossary.js';
import { HELP, SYMBOLS } from './help.js';
import { helpHtml } from './help-html.js';

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
  stampManaged(targetDir, [stageId]);   // provenance from the first write, not from the first sync

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
      visibility: 'private',  // private | public — the STARTING state, not the answer. A repo minutes
                              // old, before anyone has looked for a key in it, isn't published by reflex.
                              // /boss offers public as a peer option at repo-creation time.
      // null = UNDECIDED, and BOSS does not decide it (DEC-011). It used to scaffold as
      // 'proprietary' on a correct argument — a permissive grant, once published, cannot be
      // revoked — that was quietly doing a second job as the ANSWER. The argument survives in
      // /boss's ask, next to its counterpart (a project never opened quietly stays closed).
      // Options: MIT | Apache-2.0 | AGPL-3.0 | CC-BY-SA-4.0 | proprietary | "undecided" | null
      // `null` means NOBODY HAS ASKED; "undecided" means they were asked at the moment it became
      // real (`/ship`'s pre-flight) and chose to wait. Two states, because otherwise the question
      // either never returns or returns forever. Same distinction as dropped-vs-deferred (v0.204.0).
      license: null,
      // Optional founder-cohort declaration (v0.20.0+). When set, the conscience
      // hook includes the cohort in its additionalContext so Claude composes the
      // voice appropriately for the cohort — first-product gets teaching;
      // returning-founder gets a harder question; vibe-virtuoso gets sharper
      // architecture. Options: vibe-coder-newbie | eng-builder | non-tech-founder
      // | first-product | vibe-virtuoso | indie-hacker | returning-founder |
      // domain-expert | null. /boss skill asks during spin-up; user can edit later.
      cohort: null,
      // 🔴 `shareUp` and `aiNative` were written here until v0.252.0 and read by NOTHING — not src/,
      // not a hook, not one shipped skill. Two different reasons, and the first is the sharper:
      //
      // `shareUp: false` gated a share-up pipe that was subsequently REFUSED (IDEA-021 — only the
      // opt-in *contract* could ever re-open, and the pipe stays refused regardless). It read to a
      // founder as a privacy setting, and setting it `true` did nothing. **A pre-set opt-in flag for
      // an unbuilt feature is a consent trap**: someone flipping it today consents to nothing
      // specific, and a future version reading it would inherit an agreement nobody could have
      // understood. The honest position is that BOSS sends nothing, which needs no field. When a
      // share contract is genuinely built, it writes its own key and asks at that moment.
      //
      // `aiNative` recorded the `--ai` flag, and `adopt`'s comment claimed `/read-repo` read it
      // back. `/read-repo` never mentioned it. The flag still does its job as a LOCAL — it prints
      // the extra line below — but persisting it bought nothing.
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
    console.log(`    > /read-repo           # AI-native: tailor the scaffold to what BOSS understands (augments, never replaces)`);
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
  //    at MVP must also lay down Quickstart's foundation (welcome/boss/idea/...),
  //    exactly as `boss new` + `boss unlock mvp` would. Copy-if-absent throughout.
  const chain = STAGE_ORDER
    .slice(0, STAGE_ORDER.indexOf(stageId) + 1)
    .filter((s) => { try { readStageManifest(s); return true; } catch { return false; } });
  const claudePreexisted = existsSync(join(targetDir, 'CLAUDE.md'));
  const agentsPreexisted = existsSync(join(targetDir, 'AGENTS.md'));
  const gitignorePreexisted = existsSync(join(targetDir, '.gitignore'));
  const copied = [];
  const skipped = [];
  for (const s of chain) {
    const m = readStageManifest(s);
    const r = applyStageSafe(s, targetDir, stageVars(name, s, m.name));
    stampManaged(targetDir, [s]);
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
    // THE AGENT ROSTER IS THE LOAD-BEARING HALF, and it was missing until v0.265.0. A repo that
    // already has a CLAUDE.md never receives the template's — so the Quickstart layer, which is the
    // ONLY place `coder`, `mentor-founder` and `prompt-coach` are named, never lands. Three of the
    // four day-one agents shipped into the repo and were named nowhere, which is the exact condition
    // `check-manifests` fails a release for ("it will never be invoked"). That gate reads the
    // TEMPLATE; nothing read the ADOPTED RESULT, so the rule held for `boss new` and quietly did not
    // for `boss adopt` — on the path that is most people's first contact with BOSS.
    //
    // Derived from the manifests, never typed: this block cannot drift from what was installed.
    const roster = [...new Set(chain.flatMap((s) => readStageManifest(s).agents || []))];
    appendClaudeBlock('adopt', targetDir,
      `@AGENTS.md\n\n` +
      `## BOSS — adopted ${stageVars(name, stageId, manifest.name).DATE}\n\n` +
      `This repo was adopted into BOSS at **${manifest.name}** mode (non-destructively — your files were untouched).\n` +
      `Host-neutral working rules are imported from \`@AGENTS.md\` above. New: \`.claude/skills/\` + \`.claude/agents/\` for this mode, a conscience hook, and \`docs/\` capture surfaces.\n\n` +
      `**Start with \`/read-repo\`** — it reads what you've actually built and says where you stand, which is the useful first thing to know about a repo that already exists. Then \`/welcome\` if you want the tour, and \`boss map\` for everything available.\n\n` +
      `**Agents you can call by name:** ${roster.map((a) => `\`${a}\``).join(', ')}. \`boss map\` lists the skills.\n\n` +
      `Grow ceremony as the project earns it: \`boss unlock <mode>\`.`);
  }

  // 2c. If the repo already had a .gitignore, we skipped the template's — and that file is
  //     what keeps `.boss/brain/relationship.md` (per-person conscience state, DEC-001) out of
  //     a shared repo. Merge BOSS's rules in as a marked `#` block instead of shipping the
  //     guarantee in a file this path never installs. Only rules they lack are added.
  const ignored = gitignorePreexisted ? appendGitignoreBlock(chain, targetDir) : { added: [], applied: false };

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
    // `sourceGlobs` is written ONLY when the tree actually shows us where the code is. A null
    // inference stays absent rather than being stamped with the default: an absent key means
    // "nobody has said", and the conscience can then report honestly that it could not look.
    // A key written as a guess would make a wrong answer look like the founder's own decision.
    const sourceGlobs = inferSourceGlobs(targetDir);
    writeFileSync(cfgPath, JSON.stringify({
      // license: null — undecided, and BOSS doesn't decide it (DEC-011). See `boss new` above.
      github: 'ask', visibility: 'private', license: null, cohort: null,
      ...(sourceGlobs ? { sourceGlobs } : {}),
      // `shareUp` and `aiNative` dropped v0.252.0 — nothing read either. See `boss new` above.
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
    ignored.applied ? `.gitignore merged (${ignored.added.length} rule(s) added)` : null,
  ].filter(Boolean);
  console.log(`    ${copied.length} file(s) added · nothing of yours overwritten${preserved.length ? ` · ${preserved.join(' · ')}` : ''}`);
  console.log(`    skills: ${skillsLine(stamp.skills)}`);
  // `/read-repo` leads here, and `/welcome` follows it. The order is the point: someone adopting
  // BOSS has already built the thing, so the first useful sentence BOSS can say is about THEIR
  // repo, not about BOSS. `/welcome`'s own tour opens on an empty folder and walks the capture
  // arc — read to someone with a working codebase, that is a tool that didn't bother to look.
  console.log(`\n  ${bold('Next')}`);
  console.log(`    claude              # open Claude Code here ${dim('(terminal)')}`);
  console.log(`    > /read-repo            # start here — BOSS reads what you've built and says where you stand.`);
  console.log(`                            #   Additive and reversible; diff or revert anything.`);
  console.log(`    > /welcome              # then, if you want it: what BOSS added + how the conscience works`);
  console.log(`    boss map                # what's available · boss unlock <mode> to grow ${dim('(terminal)')}`);
  console.log('');
}

function cmdUnlock(args) {
  const layer = args[0];
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  if (!layer) return fail(`usage: boss unlock <mode>   (current: ${stamp.mode || stamp.stage})`);

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

  let m, applied;
  try {
    m = readStageManifest(target);
    applied = applyStage(target, process.cwd(), stageVars(stamp.name, target, m.name));
    stampManaged(process.cwd(), [target]);
  } catch (e) {
    return fail(`${target} not authored yet — ${e.message}`);
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
  stamp.skills = [...new Set([...(stamp.skills || []), ...(m.skills || [])])];
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

  // Say what actually arrived, and where to go next — the parity `boss new` has always had and this
  // did not. `boss new` installs 3 agents and 16 skills and prints both plus an explicit Next block;
  // `boss unlock mvp` installs 7 agents, 28 skills and 14 loops and used to print two lines. The
  // BIGGER change was the quieter one, and a founder was left to discover a doubled surface on their
  // own. Counts come from the mode's own manifest, so this is the delta that just landed — not the
  // cumulative install, which is what `boss map` is for.
  const arrived = [
    [(m.agents || []).length, 'agent'],
    [(m.skills || []).length, 'skill'],
    [(m.loops || []).length, 'loop'],
  ].filter(([n]) => n > 0).map(([n, w]) => `${n} ${w}${n === 1 ? '' : 's'}`);
  if (arrived.length) {
    console.log(`\n  ${bold('Now available')} ${dim(`(${arrived.join(' · ')})`)}`);
    if ((m.agents || []).length) console.log(`    agents: ${skillsLine(m.agents)}`);
    if ((m.skills || []).length) console.log(`    skills: ${skillsLine(m.skills)}`);
  }

  const note = ROLE_SHIFT[target];
  if (note) {
    console.log(`\n  ${dim('— what this rung tends to ask of you —')}`);
    for (const line of note) console.log(`  ${line}`);
  }

  // Two reads, not a first move. Which command actually comes next depends on what this project
  // already has captured, and `boss status` is the surface that computes that — so point at it
  // rather than hardcoding a per-rung guess that is wrong for any founder who arrived mid-stream.
  console.log(`\n  ${bold('Next')}`);
  console.log(`    boss map              ${dim('# everything this rung just added')}`);
  console.log(`    boss status           ${dim('# where that leaves you, and what to pick up')}`);
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

// What you've already BUILT, and the one seam that's open (library/practices/seed-to-scale.md).
// The positive half of orientation: not "here's what you're missing" but "here's what's real."
// Both halves stay silent when they can't be derived honestly — an empty repo gets neither line.
function printBuiltAndSeam(projectDir, stamp) {
  let have = [];
  let seam = null;
  try {
    have = built(projectDir, stamp);
    seam = nextSeam(projectDir, stamp);
  } catch { return; }

  if (have.length) {
    const names = have.map((h) => h.what);
    const shown = names.slice(0, 4).join(dim(' · '));
    const rest = names.length > 4 ? dim(`  +${names.length - 4} more`) : '';
    console.log(`    ▸ ${bold('Already built:')}   ${shown}${rest}`);
  }
  // Record drift — but only what a founder would want interrupted for: work they finished and did
  // not write down (the good news), or an id claimed by two files (the one finding that is not a
  // chore, because it makes every reference to that id ambiguous). Everything else is real and
  // lives in `boss records`; `boss status` is not a chore list. This restraint is now ENFORCED in
  // `driftLine`, not just described here — it used to fall back to a chore line whenever there was
  // no good news, which is how this surface grew the thing this comment says it doesn't carry.
  try {
    const d = driftLine(projectDir);
    if (d) console.log(`    ${dim('▸ Records:')}        ${d.head} — ${dim('boss records')}`);
  } catch { /* never let a malformed record break status */ }

  // ONE seam, never a list — see nextSeam. Phrased as the cheap thing, not as a chore, because
  // this is the only case where "not yet" would otherwise cost them something unrecoverable.
  if (seam) {
    console.log(`    ${dim(`▸ Not yet (${seam.rung}):`)}  ${seam.what} — ${dim('but the cheap half is worth it now:')}`);
    console.log(`      ${seam.seam}`);
  }
}

// The orientation core of `boss status` (EVID-001): what you're building right now,
// and that you're making headway. Reads the same board projection so status, board,
// and insights all agree on "in flight." Prints nothing it can't derive honestly.
function printFocusAndHeadway(projectDir, { adopted = false } = {}) {
  let cards;
  try { ({ cards } = collectBoard(projectDir)); } catch { return; }
  const { finish, start, pressure } = computeNext(cards);
  console.log('');
  if (finish.length) {
    const f = finish[0];
    const more = finish.length > 1 ? dim(`   (+${finish.length - 1} more in flight)`) : '';
    // Every other branch of this if-chain ends in a command, and this one — the branch a founder
    // in build hits every single day — used to end in a full stop. So the highest-priority line on
    // the surface was the only one with nothing to DO, while three lower-priority lines below it
    // each carried a pointer. That is the exact complaint EVID-001 filed: *"I forget what feature
    // I'm building."* Being told the id is not the same as being told how to get back into it.
    // The card is the answer — goal, acceptance criteria, the paths that must not break — and it
    // is a read of a file that already exists, not a new surface.
    console.log(`    ▸ ${bold('Building now:')}    ${f.id} — ${f.title}${more}   ${dim(`→ boss board ${f.id}`)}`);
  } else if (start.length) {
    console.log(`    ▸ ${bold('Ready to build:')}  ${start[0].id} — ${start[0].title}   ${dim('→ /spec')}`);
  } else if (pressure.length) {
    console.log(`    ▸ ${bold('Next:')}            pressure-test ${pressure[0].id}   ${dim('→ /canvas')}`);
  } else if (adopted) {
    // An empty board in an ADOPTED repo is the expected state, not a prompt. The old line told
    // someone who had just handed BOSS a shipped app with tests, CI and a deploy config to go
    // "capture an idea" — one line above `Already built: a deploy config · the landing page`, so
    // the same screen both saw their work and asked them to start. What they have not done is let
    // BOSS read it.
    console.log(`    ▸ ${dim('Nothing captured yet — expected here.')} ${bold('/read-repo')} ${dim('reads what you have built and says where you stand.')}`);
  } else {
    console.log(`    ▸ ${dim('Nothing in flight yet — /boss or /idea to capture an idea.')}`);
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
  if (!stamp) return failNotAProject();
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
  // The bridge back comes FIRST when there is one. A founder returning after a week
  // needs "what was I doing" before they need "which rung am I on" — and this is the
  // only moment BOSS can ever observe the gap (see src/orientation.js). Silent when
  // they were here yesterday, and silent when there's no devlog to bridge from.
  printReentry(process.cwd());
  // Then orientation, not version metadata: where you are on the ladder, what
  // you're building right now, and whether you're moving (EVID-001 — a founder can't
  // tell any of these three today). Composed from the board projection; degrades
  // silently if the board can't be read.
  console.log(`  ▸ ${bold('You are here:')} ${stamp.mode || stamp.stage}`);
  console.log(`    ${renderLadder(stamp.installedLayers, stamp.stage)}`);
  printFocusAndHeadway(process.cwd(), { adopted: stamp.adopted === true });
  // Toward what (IDEA-097): the founder's own sentence for "it worked", if they gave one.
  // Silent otherwise — see src/orientation.js.
  printIntent(process.cwd());
  // Ticket headway is what printFocusAndHeadway just rendered (the last shipped FEAT).
  // This is the other half, and the half that can be wrong: what the work actually
  // taught you. Shipping is motion; evidence is the part that moves the bet.
  printEvidenceHeadway(process.cwd());
  // The one place the CLIMB question gets answered without being asked, and it is one line that
  // prints only when every leg BOSS can check is in place. Silent otherwise, on purpose (IDEA-076):
  // a founder mid-rung gets nothing, the way the re-entry line stays quiet for someone who worked
  // yesterday. And it can go back to silence — supersede the EVID behind it and this stops
  // printing. That is what keeps it off the comfort-device list: a surface that cannot go down is
  // not a status, it is a trophy. The unmet and unknown legs are NOT rendered here; they belong at
  // `boss unlock`, the moment of crossing, where there is room to say what they are.
  const nextStage = STAGE_ORDER[STAGE_ORDER.indexOf(stamp.stage) + 1];
  const nextBar = nextStage ? readiness(nextStage, process.cwd()) : null;
  if (nextBar && nextBar.cleared) {
    // The rung's NAME to read ("MVP"), its WORD to type ("mvp") — `boss unlock` takes the latter
    // and printing the label back at a founder as a command is how a copy-paste fails.
    let nextName = modeWord(nextStage);
    try { nextName = readStageManifest(nextStage).name || nextName; } catch { /* unauthored rung */ }
    console.log(`    ${ok('✓')} ${bold(`Ready for ${nextName}:`)} ${dim('everything BOSS can check is in place —')} ${bold(`boss unlock ${modeWord(nextStage)}`)} ${dim('when you are.')}`);
  }
  printBuiltAndSeam(process.cwd(), stamp);
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
  } else if (u.state === 'unknown' && !justScaffolded(stamp)) {
    // Withheld on a project's first day, and only that line. The staleness it reports is the
    // MACHINE's (when `boss update` last asked npm), not this project's — so a folder created
    // ninety seconds ago opened with "unchecked for 19d", which reads as *you are already behind
    // on something* at the one moment a founder has done nothing to be behind on. The claim was
    // true and the framing was a nag. `behind` still prints on day one: that one is a fact about
    // an install that IS out of date, and withholding it would be the dishonest direction.
    console.log(`    ${dim(`whether the install itself is current: unchecked${u.age ? ` for ${u.age}d` : ''} — ${'boss update'}`)}`);
  }
  console.log('');
}

// A project scaffolded within the last day. Used to hold back tool-upkeep chatter on a first
// run — never to hide a fact about the founder's own work, which is why it is scoped to one line.
function justScaffolded(stamp) {
  if (!stamp || !stamp.createdAt) return false;
  const t = Date.parse(stamp.createdAt);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 24 * 60 * 60 * 1000;
}

// boss recap — what happened, from the records already written. See src/recap.js for why it is a
// composition and not a new surface.
function cmdRecap(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  const flags = parseArgs(args);
  recap(process.cwd(), stamp.name, {
    markdown: args.includes('--md') || args.includes('--markdown'),
    days: flags.days,
    since: flags.since,
  });
}

function cmdBoard(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
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
  // ...but never in front of `--json`, which is a machine contract: one courtesy line printed
  // above the object makes every consumer's JSON.parse throw.
  if (stamp.status === 'retired' && !args.includes('--json')) {
    console.log(dim(`\n  ⊘ ${stamp.name} was retired ${stamp.retired_on || ''} — this is the record, not a live board. \`boss retire --undo\` to reopen.`));
  }
  // Owner lens (founder layer slice 2b): show `@owner` on cards only when this is a
  // team (dormant-solo); `--mine` narrows to the cards I own.
  const me = args.includes('--mine') ? resolveIdentity().handle : null;
  // A bare argument is a card id — `boss board IDEA-004`, or just `boss board 4`. The terminal's
  // equivalent of hovering one card: what is this, where is it, what does its status actually say.
  const card = args.find((a) => !a.startsWith('-')) || null;
  board(process.cwd(), stamp.name, {
    card,
    next: args.includes('--next'),
    blocked: args.includes('--blocked'),
    json: args.includes('--json'),
    all: args.includes('--all'),
    detail: args.includes('--detail') || args.includes('-d'),
    owners: isTeam(process.cwd()),
    mine: me ? '@' + me : null,
  });
}

function cmdMap(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  // `--next` expands the next rung's full skill list; the default keeps the preview
  // to that rung's headline few (IDEA-055 follow-on / REVIEW-2026-07-28 §C1).
  map(process.cwd(), stamp, { next: args.includes('--next'), all: args.includes('--all') });
}

function cmdBrain(args) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  try {
    brain(process.cwd(), stamp, args);
  } catch (e) {
    return fail(e.message);
  }
}

// `boss records` — the deliberate reader for record drift. See src/records.js for why this
// ships at all: BOSS shipped the rules for keeping a project's memory and shipped no way to tell
// when they stopped being true, which is exactly how BOSS's own memory got 21 records wrong.
// `boss id` — the allocation half. `boss records` catches a collision after the fact; this stops
// one happening. See src/records.js: BOSS's own site called this gap out by name, and it had
// already bitten (two files claimed IDEA-059 on the same day).
function cmdId(args) {
  const dir = process.cwd();
  const prefix = args.find((a) => /^[A-Za-z]{3,4}$/.test(a));
  if (prefix) {
    const id = nextId(dir, prefix);
    if (!id) { console.log(`\n  Not a record prefix: ${prefix}\n`); process.exitCode = 1; return; }
    console.log(id);   // bare, so a skill or a script can use it directly
    return;
  }
  const census = idCensus(dir);
  console.log(`\n  ${bold('Next free record numbers')}   ${dim(dir)}\n`);
  if (!census.size) {
    console.log(dim('  No records yet. Your first one is IDEA-001.\n'));
    return;
  }
  for (const [p, highest] of [...census].sort()) {
    console.log(`    ${bold(`${p}-${String(highest + 1).padStart(3, '0')}`)}   ${dim(`highest in use: ${p}-${String(highest).padStart(3, '0')}`)}`);
  }
  console.log(dim('\n  Computed from every .md under docs/ — filenames and prose both, because a'));
  console.log(dim('  number reserved in an index is taken even when no file exists yet.\n'));
}

// The transition half of Ajesh's ask, and the reason it is DERIVED rather than stamped: a date
// someone has to remember to write is another rule with no mechanism, and it rots exactly the way
// every other rule here rotted. Git already knows. See src/records.js.
function recordTimeline(dir) {
  let rows = [];
  try { rows = timeline(dir); } catch { rows = []; }
  const dated = rows.filter((r) => r.captured);
  console.log(`\n  ${bold('BOSS records')} ${dim('· timeline')}   ${dim(dir)}\n`);
  if (!dated.length) {
    console.log(dim('  No dates to derive — this needs a git history, and records that are committed.\n'));
    return;
  }
  for (const r of dated) {
    const ship = r.shipped
      ? `${r.shipped}${r.lagDays !== null ? dim(`  (${r.lagDays}d)`) : ''}`
      : dim(r.status === 'shipped' ? 'shipped — no date derivable' : '—');
    console.log(`    ${bold(r.id.padEnd(9))} ${dim('captured')} ${r.captured}   ${dim('built')} ${ship}`);
  }
  const shipped = dated.filter((r) => r.lagDays !== null);
  if (shipped.length) {
    const med = shipped.map((r) => r.lagDays).sort((a, b) => a - b)[Math.floor(shipped.length / 2)];
    console.log(`\n  ${shipped.length} of ${dated.length} have a build date. ${bold(`Median idea → built: ${med} days.`)}`);
  }
  console.log(dim('\n  Derived from git: a record\'s first commit, and its proof: artifact\'s first commit.'));
  console.log(dim('  Nobody stamps these, so they cannot drift from what actually happened.\n'));
}

// The umbrella view, at its seed rung. See src/records.js for why this is a frontmatter field
// and not a record type yet — the graduation is real, and it is earned by having something to say
// that belongs to no single member, never by a member count.
function recordPrograms(dir) {
  let progs = [];
  try { progs = programs(dir); } catch { progs = []; }
  console.log(`\n  ${bold('BOSS records')} ${dim('· programs')}   ${dim(dir)}\n`);
  if (!progs.length) {
    console.log(dim('  No programs yet. Add `program: <a-short-slug>` to records that belong together —'));
    console.log(dim('  it costs one line and nothing has to be created first.\n'));
    return;
  }
  for (const p of progs) {
    const bar = `${'▮'.repeat(p.shipped)}${dim('▯'.repeat(p.open))}`;
    console.log(`    ${bold(p.name.padEnd(22))} ${bar}  ${dim(`${p.shipped} shipped · ${p.open} open`)}`);
    for (const m of p.members) {
      const done = (m.status || '').startsWith('shipped');
      console.log(`      ${done ? dim(m.id) : m.id}  ${dim((m.status || '').split('(')[0].trim())}`);
    }
  }
  const stuck = progs.filter((p) => p.open && !p.shipped);
  if (stuck.length) {
    console.log(`\n  ${bold(`${stuck[0].name}`)} has ${stuck[0].open} open and nothing shipped — the umbrella to look at first.`);
  }
  console.log(dim('\n  A program is one frontmatter line until it earns a file. When there is something to'));
  console.log(dim('  write down that belongs to NO single member — why these go together, what got'));
  console.log(dim('  decided across them — give it a PROG record and point `program:` at that id.\n'));
}

function cmdRecords(args) {
  const all = args.includes('--all');
  const dir = process.cwd();
  if (args.includes('--timeline')) return recordTimeline(dir);
  if (args.includes('--programs')) return recordPrograms(dir);
  // `--gists` is its own door because this class is WORK, not drift. It is quiet by default (a
  // founder opening `boss records` wants what is wrong, and none of this is wrong), and burying
  // 39 quality items inside `--all` next to the no-proof list is the same as not shipping them.
  const gistsOnly = args.includes('--gists');
  let found = [];
  try { found = recordDrift(dir); } catch { /* fall through to the empty case */ }
  const shown = gistsOnly ? gistWork(dir) : (all ? found : found.filter((f) => !f.quiet));

  console.log(`\n  ${bold('BOSS records')}   ${dim(dir)}\n`);
  if (!shown.length) {
    console.log(`  ${ok('✦')} Your records still match your repo.\n`);
    console.log(dim("  A status is a claim about your code. This is the check that they agree —"));
    console.log(dim("  mostly so that work you already finished doesn't sit there looking undone."));
    if (!all && found.length) console.log(dim(`\n  ${found.length} record(s) carry no \`proof:\` to check — boss records --all`));
    console.log('');
    return;
  }
  const LABEL = {
    'built-not-recorded': 'ALREADY BUILT, NOT RECORDED',
    'claimed-not-built': 'CLAIMED, NOT THERE',
    'duplicate-id': 'DUPLICATE ID',
    'off-vocabulary': 'OFF-VOCABULARY STATUS',
    'unlinked-promotion': 'BROKEN PROMOTION LINK',
    'broken-split': 'BROKEN SPLIT LINK',
    'stale-field': 'FIELD NOTHING READS',
    'no-proof': 'NOTHING TO CHECK AGAINST',
    'derived-gist': 'THE BOARD LINE NOBODY WROTE',
  };
  let last = null;
  for (const f of shown) {
    if (f.kind !== last) {
      last = f.kind;
      console.log(`  ${bold(LABEL[f.kind] || f.kind)}`);
      if (f.kind === 'built-not-recorded') {
        console.log(dim('  You finished these and the record still says otherwise. Left alone, this is'));
        console.log(dim('  how a thing gets built twice.'));
      }
      if (f.kind === 'broken-split') {
        console.log(dim('  Scope that grew and moved to a new id. The record it left has to say so —'));
        console.log(dim('  otherwise the only way to find the rest of the work is to already know.'));
      }
      if (f.kind === 'derived-gist') {
        console.log(dim('  The one line `boss board --detail` shows for these was never chosen — it is'));
        console.log(dim('  whatever sentence opened the file, or a paragraph cut mid-thought. Nothing is'));
        console.log(dim('  broken; it is just the line future-you reads to remember which idea this was.'));
        console.log(dim('  `/idea gist <ID>` reads the record whole and writes one.'));
      }
      if (f.kind === 'stale-field') {
        console.log(dim('  These look answered and are read by nothing — the quietest way a record goes'));
        console.log(dim('  wrong, because a missing field gets reported and a misspelled one does not.'));
      }
    }
    console.log(`      ${f.id}  ${dim(f.file)}\n        ${f.what}`);
  }
  console.log(`\n  ${shown.length} finding(s). Update the record, or add a \`proof_note:\` saying why`);
  console.log(`  it is built and still not done (blocked, partial, waiting on someone).\n`);
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
  if (!stamp) return failNotAProject();
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
  if (!stamp) return failNotAProject();
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

// `boss list` — the portfolio view, and the one that has to be honest about two things it used
// to get wrong for a founder running several projects at once.
//
// It printed the REGISTRY's copy of each pin, which `boss unlock` could set to a version the
// project had never taken (fixed above), and it never compared that number to the installed BOSS
// — so the command billed as "all connected projects" was the one surface that could not tell you
// any of them were behind. `boss insights` had computed exactly that for releases, in a view about
// venture graduation, where nobody looks for it. Same fact, two renderings, ONE reader
// (`projectPin`): this is composition, not a second implementation.
//
// It also listed rows for projects that are no longer on disk as though they were live, because a
// registry keyed by absolute path cannot see a `mv`. Those are named now, and `--prune` is the exit.
function cmdList(args = []) {
  const projects = listProjects();
  if (!projects.length) {
    console.log('\n  No projects registered yet. Run `boss new <name>`.\n');
    return;
  }
  const current = bossVersion();
  const rows = projects.map((p) => ({ ...p, pin: projectPin(p), here: onDisk(p) }));
  const ghosts = rows.filter((r) => !r.here);
  if (args.includes('--prune')) return listPrune(ghosts, args.includes('--apply'));

  const live = rows.filter((r) => r.here);
  // Retired projects (IDEA-044) fold to the bottom, quiet — the shipped_on archive pattern
  // applied at the portfolio level. Active projects read first; retired ones are honest, not hidden.
  const active = live.filter((p) => p.status !== 'retired');
  const retired = live.filter((p) => p.status === 'retired');
  console.log(`\n  ${bold(active.length + ' connected project(s)')}:\n`);
  for (const p of active) {
    // A pin equal to the install is NOT marked. Restraint is the point (IDEA-055): the glyph
    // means "there is something to do here", so putting one on every row would mean nothing.
    const behind = p.pin && cmpVersion(p.pin, current) < 0;
    // Ahead of the install is a real state too — a source checkout, or a project synced by a
    // newer BOSS than the one now installed. Saying "behind" there would be false in the
    // direction that matters, so it gets its own mark rather than being folded into current.
    const ahead = p.pin && cmpVersion(p.pin, current) > 0;
    const mark = behind ? `  ${warn('⟳')}` : ahead ? `  ${dim('↑')}` : '';
    console.log(`    ${p.name.padEnd(20)} ${(p.mode || p.stage || '?').padEnd(12)} BOSS@${p.pin || '?'}${mark}`);
    console.log(`    ${''.padEnd(20)} ${p.path}`);
  }

  const behind = active.filter((p) => p.pin && cmpVersion(p.pin, current) < 0);
  if (behind.length) {
    console.log(`\n  ${warn('⟳')} ${behind.length} of ${active.length} behind the installed ${bold(current)}: ${behind.map((p) => p.name).join(', ')}`);
    console.log(`    ${dim('`boss changelog` in one to read what changed, `/boss-sync` inside Claude to')}`);
    console.log(`    ${dim('review the diff and apply it. Each project is its own decision — there is no')}`);
    console.log(`    ${dim('sync-all, on purpose.')}`);
  }
  if (active.some((p) => p.pin && cmpVersion(p.pin, current) > 0)) {
    console.log(`    ${dim('↑ pinned ahead of the BOSS you have installed — update the tool: `boss update`.')}`);
  }

  if (retired.length) {
    console.log(`\n  ${retired.length} retired:`);
    for (const p of retired) {
      console.log(`    ${dim(p.name.padEnd(20) + ' retired ' + (p.retired_on || '—'))}`);
    }
  }
  if (ghosts.length) {
    console.log(`\n  ${ghosts.length} registered but not on disk:`);
    for (const g of ghosts) console.log(`    ${dim(g.name.padEnd(20) + ' ' + g.path)}`);
    console.log(`    ${dim('Moved or deleted. `boss list --prune` drops the rows; nothing on disk is touched.')}`);
  }
  console.log('');
}

// Drop registry rows whose project is gone. Preview by default, `--apply` is the consent — the
// same shape as every other destructive verb in BOSS.
//
// This deletes NOTHING on disk, because by definition there is nothing there to delete: it edits
// one machine-local JSON file. That is also why it is not `boss remove`, which is the exit for a
// project you can still stand inside — the whole problem with a ghost is that you cannot.
function listPrune(ghosts, apply) {
  if (!ghosts.length) {
    console.log(`\n  ${ok('✦')} Every registered project is on disk. Nothing to prune.\n`);
    return;
  }
  console.log(`\n  ${bold(`${ghosts.length} registered project(s) not on disk`)}:\n`);
  for (const g of ghosts) {
    console.log(`    ${g.name.padEnd(20)} ${(g.mode || g.stage || '?').padEnd(12)} BOSS@${g.pin || '?'}`);
    console.log(`    ${''.padEnd(20)} ${dim(g.path)}`);
  }
  if (!apply) {
    console.log(`\n  Preview only. ${bold('boss list --prune --apply')} ${dim('drops these rows from')}`);
    console.log(`  ${dim(`${BOSS_HOME}/registry.json. Nothing on disk is touched.`)}`);
    console.log(`\n  ${dim('If one of these is on a drive that is merely unmounted, leave it — the row is')}`);
    console.log(`  ${dim('the only record that project was ever connected.')}\n`);
    return;
  }
  let n = 0;
  for (const g of ghosts) { if (deregisterProject(g.path)) n++; }
  console.log(`\n  ${ok('✦')} Dropped ${n} row(s) from the registry.`);
  console.log(`  ${dim('A project you bring back re-registers on the next `boss adopt` or `boss sync --apply` there.')}\n`);
}

// `boss remove` — the exit. Preview by default; `--apply` is the consent.
function cmdRemove(args) {
  const f = parseArgs(args || []);

  // `--global` is the OTHER exit: BOSS off the machine, not out of a project. Different act,
  // different blast radius, so it never happens as a side effect of the project one.
  if (f.global) {
    const { dir, files } = machineState();
    const cmd = uninstallCommand(installKind());
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
  if (!stamp) return failNotAProject();
  // BOSS is self-hosted, so its own repo IS a BOSS project and `remove` works on it perfectly —
  // which is the problem. On 2026-08-21 an assistant cleaning up after a throwaway test ran
  // `--apply` here instead of in /tmp and took BOSS's own state dir with it. Nothing was wrong
  // with the command; it was pointed one directory too far up.
  const selfHosted = isBossRepo(process.cwd());
  const plan = planRemove(process.cwd(), stamp);
  const total = plan.files.length + plan.blocks.length + (plan.bossDir ? 1 : 0);

  console.log(`\n  ${bold(stamp.name + ' — remove BOSS')}`);
  console.log(`    ${dim('layers:')} ${plan.layers.join(' → ')}\n`);

  console.log(`  ${bold('Would remove')} ${dim(`— ${plan.files.length} file(s) BOSS wrote, unchanged since`)}`);
  const head = plan.files.slice(0, 6).map((x) => x.rel);
  for (const r of head) console.log(`    ${warn('−')} ${r}`);
  if (plan.files.length > head.length) console.log(`    ${dim(`… +${plan.files.length - head.length} more`)}`);
  if (plan.bossDir) console.log(`    ${warn('−')} .boss/   ${dim("(mode, config, the conscience's log)")}`);
  if (plan.brainProse && plan.brainProse.length) {
    console.log(`    ${ok('→')} docs/venture-brain.md   ${dim(`(the venture brain, exported first — ${plan.brainProse.length} file(s); it was yours to edit, so it leaves with you)`)}`);
  }
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

  // The undo, stated accurately. This line used to promise that `git checkout .` "restores
  // everything" — and it cannot restore `.boss/`, because the .gitignore BOSS itself ships tells
  // git to forget the conscience log, the cost log, the trace, per-person brain state and the
  // backups. A reassurance that is false about the one directory git cannot see is worse than none.
  const sayUndo = () => {
    console.log(`  ${dim('Commit first and `git checkout .` brings back every TRACKED file.')}`);
    console.log(`  ${dim('It cannot bring back `.boss/` — BOSS gitignores its own logs and per-person state,')}`);
    console.log(`  ${dim(`so git never saw them. --apply copies .boss/ to ${BOSS_HOME}/removed/ first;`)}`);
    console.log(`  ${dim('that copy is the only undo those files have.')}`);
  };

  if (selfHosted) {
    console.log(`\n  ${warn('!')} ${bold("This is BOSS's own source checkout")} ${dim('— the repo that ships BOSS, not a project')}`);
    console.log(`    ${dim('BOSS was installed into. `--apply` here deletes BOSS\'s own state. It refuses')}`);
    console.log(`    ${dim('without `--yes`, which is the same consent `boss learn` asks for when it is')}`);
    console.log(`    ${dim('about to write to a checkout you are not standing in.')}`);
  }

  if (!f.apply) {
    console.log(`\n  Preview only. ${bold('boss remove --apply')} does it.`);
    sayUndo();
    console.log(`  ${dim('Taking BOSS off the machine instead? `boss remove --global`.')}\n`);
    return;
  }

  if (selfHosted && !f.yes) {
    console.log(`\n  ${err('✗')} ${bold('Refusing')} ${dim('— that would remove BOSS from BOSS.')}`);
    console.log(`    ${dim('If you meant a throwaway, you are one directory too far up: `cd` there first.')}`);
    console.log(`    ${dim('If you really mean this repo, `boss remove --apply --yes`.')}\n`);
    return;
  }

  const done = applyRemove(process.cwd(), plan);
  // Deregister, never retire: `retire` is a VENTURE OUTCOME that `boss insights` reports on, and
  // removing BOSS says nothing about whether the venture is alive. Marking it retired would have
  // BOSS reporting a death that didn't happen.
  try { deregisterProject(process.cwd()); } catch { /* registry is best-effort */ }
  console.log(`\n  ${ok('✦')} BOSS removed — ${done.length} path(s). Your work is untouched.`);
  if (plan.backup) {
    console.log(`    ${ok('→')} ${plan.backup.files} file(s) from .boss/ copied to ${plan.backup.dir}`);
    console.log(`      ${dim('git could not have restored those — delete the copy whenever you like.')}`);
  } else if (plan.bossDir) {
    // Said out loud rather than swallowed: a silent failure here is how you find out the net
    // was missing only when you reach for it.
    console.log(`    ${warn('!')} ${dim('.boss/ could not be copied aside — it is gone and git never had it.')}`);
  }
  console.log(`    ${dim('`git status` shows exactly what changed. `boss adopt` any time you want it back.')}\n`);
  void total;
}

function cmdSync(args) {
  const { _: pos, apply, remove, force, 'keep-mine': keepMine } = parseArgs(args);
  void pos;
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();

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
      // Three states, three words. `? unclaimed` is the one that was missing: BOSS has no record
      // of writing this file, so it may be the founder's own — and it used to render as
      // `~ changed`, the same words a routine BOSS update gets. Recoverable (it is backed up)
      // but indistinguishable, which is the half that mattered.
      const mark = e.status === 'new'
        ? ok('+ new    ')
        : (e.edited === null ? warn(`? unclaimed (${e.delta} lines)`) : warn(`~ changed (${e.delta} lines)`));
      console.log(`    ${mark}  ${e.kind}/${e.name}  →  ${e.rel}`);
      // The unit of an update is the ARTIFACT, not the file — a founder who has the thing this
      // skill makes is the only one for whom "it changed" means anything.
      if (e.affects) {
        const evidence = e.affects.evidence.join(', ')
          + (e.affects.more ? ` +${e.affects.more} more` : '');
        console.log(`    ${dim('           ↳ you already have')} ${bold(e.affects.what)} ${dim(`— ${evidence}`)}`);
      }
    }
    const unclaimed = changed.filter((e) => e.status === 'changed' && e.edited === null);
    if (unclaimed.length) {
      console.log('');
      console.log(`    ${warn('?')} ${bold(`${unclaimed.length} file(s) BOSS has no record of writing.`)} ${dim('Either it wrote them before it')}`);
      console.log(`      ${dim('kept a ledger, or they are yours and share a name with something BOSS ships.')}`);
      console.log(`      ${dim('--apply copies them to')} ${bold('.boss/backups/')} ${dim('and replaces them.')} ${bold('boss sync --apply --keep-mine')}`);
      console.log(`      ${dim('leaves them alone and applies everything else.')}`);
    }
    if (settingsChanged) {
      console.log(`    ${warn('~ merge')}    settings/hooks + deny floor  →  ${plan.settings.rel}`);
      console.log(`    ${dim('              (additive — adds hook registrations and secret-path denies;')}`);
      console.log(`    ${dim('               never touches your allow list)')}`);
      // The one subtraction sync will ever make, so it gets named in full rather than folded
      // into "additive". A line BOSS wrote and got wrong is BOSS's to take back — out loud.
      for (const m of plan.settings.migrated || []) {
        console.log(`    ${warn('− fix')}      removes a line BOSS itself shipped:`);
        console.log(`    ${dim(`               ${m}`)}`);
        console.log(`    ${dim('               your mode preference is yours again — set it in ~/.claude/settings.json')}`);
      }
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

  const affecting = changed.filter((e) => e.affects);
  if (affecting.length) {
    console.log(`\n    ${dim(`${affecting.length} of these make something you already built. Syncing the skill does NOT`)}`);
    console.log(`    ${dim('change your work — `/boss-sync` reads what actually changed and tells you')}`);
    console.log(`    ${dim("whether any of it is worth applying to what's already there.")}`);
  }

  // Files the founder shaped. Named before anything is written, because the whole point is that
  // they get a say — and a list that appears only AFTER the write is a receipt, not a choice.
  const yours = changed.filter((e) => e.edited === true);
  if (yours.length) {
    console.log(`\n    ${warn('⚠')}  ${yours.length} of these you changed after BOSS wrote them:`);
    for (const e of yours) console.log(`         ${e.kind}/${e.name}  ${dim('→ ' + e.rel)}`);
    console.log(`    ${dim('Not overwritten. `/boss-sync` in Claude reads both versions and merges;')}`);
    console.log(`    ${dim('`boss sync --apply --force` takes BOSS\'s version (a copy is kept in .boss/backups/).')}`);
  }
  const unknown = changed.filter((e) => e.edited === null);
  if (unknown.length) {
    console.log(`\n    ${dim(`${unknown.length} predate the provenance ledger — BOSS cannot tell whether you`)}`);
    console.log(`    ${dim('changed them, so each is copied to `.boss/backups/` before being written.')}`);
  }

  if (!apply) {
    console.log('\n  Preview only. Run `boss sync --apply` to write these and bump the pin,');
    console.log('  or use `/boss-sync` in Claude for a reviewed, narrated update.\n');
    return;
  }

  const { written, skipped, backupDir, removed, stamp: next } = applySync(process.cwd(), plan, stamp, { remove, force, keepMine });
  writeStamp(process.cwd(), next);
  registerProject({
    name: next.name, path: process.cwd(), stage: next.stage, mode: next.mode, bossVersion: next.bossVersion,
  });
  console.log(`\n  ${ok('✦')} Synced ${written.length} file(s)${removed.length ? `, removed ${removed.length}` : ''}; pin now ${bold(next.bossVersion)}.`);
  if (skipped.length) {
    // Two reasons to skip, and they are not the same claim. "You changed them" is TRUE for an
    // edited managed file and FALSE for an unclaimed one — there, BOSS simply has no record, which
    // is the whole reason --keep-mine exists. Telling a founder they changed a file they never
    // touched is a small lie that makes the next decision worse.
    const skippedEdited = skipped.filter((e) => e.edited === true);
    const skippedUnclaimed = skipped.filter((e) => e.edited === null);
    if (skippedEdited.length) {
      console.log(`    ${warn('⚠')}  ${skippedEdited.length} left alone — you changed them: ${skippedEdited.map((e) => e.name).join(', ')}`);
    }
    if (skippedUnclaimed.length) {
      console.log(`    ${warn('?')}  ${skippedUnclaimed.length} left alone — BOSS has no record of writing them: ${skippedUnclaimed.map((e) => e.name).join(', ')}`);
    }
    console.log(`    ${dim('`/boss-sync` merges them; `--force` takes BOSS\'s version.')}`);
  }
  if (backupDir) console.log(`    ${dim(`previous versions kept in ${backupDir}`)}`);
  if (written.length || removed.length) {
    console.log(`    ${dim('Review with `git diff` — and note `.claude/` is gitignored in some projects,')}`);
    console.log(`    ${dim('in which case the backup above is the only way back.')}`);
  }
  console.log('');
}

function cmdLearn(args) {
  const f = parseArgs(args);
  const versionKind = f.major ? 'major' : f.patch ? 'patch' : 'minor';
  let res;
  try {
    res = learn({
      srcPath: f._[0],
      category: f.as,
      mode: typeof f.mode === 'string' ? f.mode : undefined,
      note: typeof f.note === 'string' ? f.note : undefined,
      versionKind,
      explicitVersion: typeof f.version === 'string' ? f.version : undefined,
      confirmed: f.yes === true,
    });
  } catch (e) {
    return fail(e.message);
  }
  console.log(`\n  ${ok('✦')} Learned ${bold(res.name)} UP into ${res.dest}`);
  if (res.registered) {
    console.log(res.registered.added
      ? `    Registered in the ${res.stageId} manifest as ${bold(res.registered.key)} — without that it would never sync.`
      : `    Already listed in the ${res.stageId} manifest as ${bold(res.registered.key)}; left as-is.`);
    if (res.category === 'hooks') {
      console.log(`    ${dim('Filed as OPTIONAL. Whether it fires for every founder is a decision, not a side effect.')}`);
    }
  }
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
      if (!stamp) return failNotAProject();
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

// The most common error BOSS can produce, and it used to be a dead end. Ten commands each said
// `not a BOSS project (no .boss/manifest.json here).` — which names an internal path a
// non-technical founder has never heard of, states a fact, and stops. The overwhelmingly likely
// cause is mundane and recoverable: they ran `boss new demo` and never `cd demo`, or they are one
// directory up from the project they mean. BOSS already knows every project on this machine — it
// keeps a registry and `boss list` reads it — so the recovery was always computable and simply
// never offered. An error that knows the answer and withholds it is the least forgivable kind.
function failNotAProject() {
  console.error(`  ${err('Error')} this folder isn't a BOSS project.`);
  let projects = [];
  try { projects = (listProjects() || []).filter((p) => p && p.path && p.status !== 'retired'); } catch { /* registry optional */ }
  if (projects.length) {
    const here = projects.filter((p) => p.path.startsWith(process.cwd() + sep));
    if (here.length) {
      // The single likeliest case: they are standing one level above the project they mean.
      console.error(dim(`  ${here.length === 1 ? 'It looks like it is' : 'They look like they are'} just below you:`));
      for (const p of here.slice(0, 3)) console.error(`    cd ${basename(p.path)}`);
    } else {
      console.error(dim(`  You have ${projects.length} project${projects.length === 1 ? '' : 's'} on this machine — \`boss list\` shows where.`));
    }
  }
  console.error(dim('  Starting something new? `boss new <name>`. Already have a repo? `boss adopt` inside it.'));
  process.exitCode = 1;
}

// --- Help (IDEA-055) ------------------------------------------------------
// Grouped so a first-timer isn't handed a 20-line wall at uniform weight:
// Start here / Everyday / Conscience / Keeping current. `boss help <command>`
// drills in; `boss help symbols` explains the glyph vocabulary. The two command
// LANGUAGES are cued explicitly — `boss …` is the shell, `/…` runs inside Claude.

// 🔴 This list is the typo suggester's whole vocabulary, and it had drifted from the `switch` in
// `run()` — the real vocabulary — by SIX commands: `records`, `id`, `credit`, `uninstall`,
// `whatsnew`, `outdated`. Nearly a quarter of the surface, and `records`/`id` are named 14 times in
// shipped founder text.
//
// The harm was not a missing hint, it was a WRONG one. `boss idd` answered *"Did you mean boss
// new?"* — the command that CREATES A PROJECT — because `id` was not in the list to be one edit
// away; `boss outdate` pointed at `update` while `outdated` sat one edit away. A suggester that
// cannot see a command does not fall silent, it confidently names the nearest thing it can see.
//
// Kept as a list rather than derived, because a `switch` is not parseable at runtime without
// reading our own source — but `test/cli-vocabulary.test.js` asserts the two agree, so the claim is
// checked rather than restated. (Same rule as `check-refs` class 4: build the vocabulary from what
// actually exists, never from a hand-kept copy of it.) Flags are excluded on purpose: `--help` is
// not a plausible typo for a bare word, and suggesting it would be noise.
const KNOWN_COMMANDS = [
  'new', 'adopt', 'unlock', 'status', 'board', 'recap', 'map', 'brain', 'insights', 'records', 'id',
  'team', 'list', 'retire', 'credit', 'remove', 'uninstall', 'sync', 'learn', 'craft',
  'changelog', 'whatsnew', 'update', 'outdated', 'conscience', 'version', 'help',
];

// Per-command detail for `boss help <command>`. Kept tight — a usage line, a
// sentence of what/why, then examples. The grouped overview is the front door;
// this is the second click.

// The glyph vocabulary, in one place (`boss help symbols`). Every surface uses
// these; nowhere else explained them (IDEA-055).

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
    mode: 'Quickstart',
    does: 'Stops a tool from reading a secret\'s CONTENTS into the model\'s context — denies Read/Edit of .env and secrets/, asks before a Bash command or MCP call that references one.',
    cost: 'a process on EVERY tool call',
    worth: 'regulated / PHI / high-stakes work, where the deny-list floor in settings.json isn\'t enough',
  },
  {
    name: 'memory-cue',
    event: 'UserPromptSubmit',
    mode: 'Quickstart',
    does: 'Notices when you say something durable ("from now on…", "no, don\'t…", "perfect, keep doing…") and nudges Claude to save it to project memory. It never writes the memory itself.',
    cost: 'a process per prompt, silent unless a pattern matches',
    worth: 'you keep repeating the same correction across sessions',
  },
  {
    name: 'auto-log',
    event: 'SubagentStop',
    mode: 'MVP',
    does: 'Appends one honest line per writer-subagent to .boss/trace.jsonl — what it touched, when. Local-only, append-only, never sent anywhere. This is the substrate /judge-traces reads.',
    cost: 'a process after every subagent',
    worth: 'you want /judge-traces to have anything to read (it is empty until this is on)',
  },
  {
    name: 'design-tokens-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: 'Catches hardcoded colors (hex, rgb()/hsl(), palette classes like bg-blue-500) the moment they\'re written, and hands Claude your token names instead. Silent until a DESIGN_TOKENS.md exists — no token system, no opinion.',
    cost: 'a process after each file write',
    worth: 'you have a token system and want it to actually hold — a prompt convention is a filter, this is the check',
  },
  {
    name: 'contrast-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: "The one accessibility check that is arithmetic rather than a judgment. When your tokens file changes it computes the WCAG contrast ratio for every text-on-surface pair you have DECLARED and names the ones under AA (4.5:1 body, 3.0:1 large). Fixes belong in the tokens, so one change fixes every screen. It says its own scope every time: text over an image, a gradient or a translucent overlay composites at runtime, needs a rendered page, and stays `not checked` — never a pass.",
    cost: 'a process after each file write (it only reads tokens files)',
    worth: "you have colour tokens — this is the cheapest real accessibility mechanism in BOSS and the only one that needs no browser. Everything else it could check is a judgment; this is a published formula over two numbers. Background: `boss craft accessibility`",
  },
  {
    name: 'component-reuse-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: "Asks the question that keeps a codebase a system. When a component gets written whose name has no row in `docs/design/COMPONENTS.md`, it hands Claude the ones that already exist — near-names first — and asks: reuse, adjust, or new? It carries the test, because the question is hard: match on the JOB, not the look. Fires once per new component name, never on an edit to one you already have, and never at all until the index exists.",
    cost: 'a process after each file write',
    worth: "you have more than a couple of components and want to keep it that way — writing a new file is easier for a model than reading an existing one and widening it, so `create` is the default unless something asks. This is what stops Button, CTAButton and PrimaryButton",
  },
  {
    name: 'schema-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: 'Catches a migration that creates a table without row-level security — the leak behind CVE-2025-48757 (170+ apps) and MoltBook (1.5M tokens, a founder who wrote no code). Reports the two failures apart: RLS never enabled, and RLS on with no policy. Silent unless you are writing a migration or schema file.',
    cost: 'a process after each file write',
    worth: 'your app talks to a database with a public/anon key — this is the only half that can PREVENT it, because it fires while the migration is still being written',
  },
  {
    name: 'content-terminology-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: 'Scans the strings and JSX text you just wrote for words your terminology table says not to use, and hands back the word it should be. Strings only — your code can call it whatever it likes. Silent until STYLE_GUIDE.md has a filled-in Terminology table.',
    cost: 'a process after each file write',
    worth: 'you have authored a terminology list and want it to hold — renaming a core noun late hits copy, routes, schema, tests and every prompt at once',
  },
];

function printHooks() {
  console.log(`\n  ${bold('Optional hooks')}  ${dim('— shipped with your project, switched OFF')}\n`);
  console.log(`  ${OPTIONAL_HOOKS.length} hooks land in \`.claude/hooks/\` and do nothing until you register them.`);
  console.log(`  The mode column is when each one ARRIVES — a Quickstart project has the first two.`);
  console.log(`  ${dim('Two hooks are already ON and are not listed here: `conscience` (the nudges) and')}`);
  console.log(`  ${dim('`reentry` (hands Claude where you left off when you come back after a few days).')}`);
  console.log(`  That is deliberate: a hook runs a process on every matching event, and BOSS won't`);
  console.log(`  spend your latency without you asking. ${dim('An unregistered script costs nothing.')}\n`);
  for (const h of OPTIONAL_HOOKS) {
    console.log(`  ${bold('/' + h.name.padEnd(26))} ${dim(h.event)} ${dim('· ' + h.mode)}`);
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
  const paint = { ok, warn, dim, plain: (s) => s };
  for (const [g, meaning, tone] of SYMBOLS) console.log(`    ${paint[tone](g)}   ${meaning}`);
  console.log('');
}

// Every skill name BOSS ships, across all rungs — for `boss help <skill>`, which is the single most
// likely help query a founder types and was the one that silently failed.
function allSkillNames() {
  try { return [...new Set(loadModes().flatMap((m) => m.skills || []))]; } catch { return []; }
}

function printCommandHelp(name) {
  const h = HELP[name];
  // An unknown topic used to fall through to `printHelp()` — the full overview, with no error, no
  // acknowledgement that anything had been asked, and exit 0. The same unknown word typed one
  // position to the left (`boss frobnicate`) got a real error WITH a did-you-mean, from a
  // Levenshtein helper defined a few lines below this one. Help was the surface least willing to
  // admit it had not understood, which is exactly backwards: it is where someone goes when they
  // are already lost.
  if (!h) {
    const bare = name.replace(/^\//, '');
    const isSkill = allSkillNames().includes(bare);

    // The WORD before the command. `boss help symbols` explained the glyphs and `boss help <command>`
    // explained the commands, and neither explained the vocabulary — so a founder who met "cohort" or
    // "seam" or "stated-pain" in a status line had nowhere to go. That gap is widest for the cohorts
    // BOSS says it serves: the ones least likely to have met "pretotype", and least likely to ask.
    // Checked BEFORE the skill branch, because someone typing `boss help canvas` usually wants to know
    // what a canvas IS — being told only where to run it answers a question they did not ask.
    const g = lookup(bare);
    if (g) {
      console.log(`\n  ${bold(g.term)}\n`);
      console.log(`    ${g.what}`);
      if (g.more) console.log(`\n    ${dim(g.more)}`);
      // Both halves when the term is also a skill: the idea, then where to run it.
      if (isSkill) console.log(`\n    ${dim('Run it')} ${bold('/' + bare)} ${dim('— inside Claude Code, not the shell.')}`);
      if (g.see) console.log(`\n    ${dim('you meet it at:')} ${g.see}`);
      console.log('');
      return;
    }

    // A skill with no glossary entry: still better than the overview. `/canvas`, `/spec`, `/idea`
    // are the names a founder sees most — in `boss map`, in `boss status`, in every conscience nudge
    // — so `boss help <skill>` is natural, and the two command LANGUAGES are what is not yet learned.
    if (isSkill) {
      console.error(`\n  ${warn('⚠')} ${bold('/' + bare)} is a ${bold('skill')}, not a ${bold('boss')} command.`);
      console.error(`    Skills run ${bold('inside Claude Code')}: open the project with \`claude\`, then type ${bold('/' + bare)}.`);
      console.error(dim(`    \`boss map\` lists every skill you have and what each one is for.`));
      console.error('');
      process.exitCode = 1;
      return;
    }

    const near = nearestCommand(bare) || nearestTerm(bare);
    fail(`no help topic '${name}'.${near ? ` Did you mean ${bold('boss help ' + near)}?` : ''}`);
    console.error(dim(`  Topics: a command name · a ${bold('word')} you ran into (\`boss help glossary\`) · ${bold('symbols')} · ${bold('hooks')}.`));
    console.error(dim(`  \`boss help\` on its own lists every command.`));
    return;
  }
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
  console.log(row('boss recap [--md]', 'what happened this week, from your own records; --md to paste'));
  console.log(row('boss board <ID> | --detail', 'one card in full · a line under every card'));
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
  console.log(row('boss learn <p> --as <c>', 'promote a pattern UP into BOSS (shelf, or a mode)'));
  console.log(row('boss craft [name]', "read BOSS's practice shelf (the craft behind the skills)"));
  console.log(row('boss list [--prune]', 'every project on this machine · which are behind'));
  console.log(row('boss retire [--undo]', 'end a project honestly (reversible)'));
  console.log(row('boss remove [--apply]', 'take BOSS back out of this project · --global for the machine'));
  console.log(row('boss version', 'the installed BOSS version'));

  console.log(`\n  ${dim('modes:')} Quickstart ${dim('(capture)')} · MVP ${dim('(build)')} · V1 ${dim('(ship)')} · Scale ${dim('(grow)')}`);
  // `glossary` sits second on purpose: after "a command you saw", the next thing someone needs is
  // "a word you saw", and that was the one this footer never offered.
  console.log(`  ${dim('boss help <command>')} for detail · ${dim('boss help glossary')} what a word means · ${dim('boss help symbols')} glyphs · ${dim('boss help hooks')} optional hooks`);
  console.log(`  ${dim('boss help --html')} the same thing as a page you can read, scoped to this project`);
  console.log(`  ${dim('Commands starting with / (e.g. /boss, /canvas) run inside Claude Code, not the shell.')}\n`);
}

function cmdHelp(args) {
  const topic = args.find((a) => !a.startsWith('-'));
  // `--html` is a RENDERER, not a topic: it answers the same questions as everything below,
  // for someone who would rather read a page than a terminal. Same posture as
  // `boss board --html` — writes into .boss/, re-run to refresh, nothing to maintain.
  if (args.includes('--html')) return cmdHelpHtml();
  if (!topic) return printHelp();
  if (topic === 'symbols' || topic === 'symbol' || topic === 'legend') return printSymbols();
  if (topic === 'hooks' || topic === 'hook') return printHooks();
  if (topic === 'glossary' || topic === 'terms' || topic === 'words') return printGlossary();
  return printCommandHelp(topic);
}

// `boss help --html` — the sit-down read. Needs a project, because the whole point is that it
// describes THIS install rather than the superset the website describes. Outside a project there
// is nothing to scope it to, so it says so instead of rendering all 48 skills as if they were
// available (which is the exact failure the website has and this surface exists to fix).
function cmdHelpHtml() {
  const stamp = readStamp(process.cwd());
  if (!stamp) {
    console.error(`  ${err('Error')} no BOSS project here — ${bold('boss help --html')} describes the project you are standing in.`);
    console.error(dim('  Run it inside a project, or `boss help` for the general reference.'));
    process.exitCode = 1;
    return;
  }
  const out = helpHtml(process.cwd(), stamp);
  console.log(`\n  ${ok('✦')} Guide → ${out}`);
  console.log(`    ${dim('Everything this project has, and why. A read of your install — re-run to refresh.')}\n`);
}

// The index, not the content — one line each, and the definition is one command away. Printing 30
// full definitions would be the wall `boss map` was fixed for in v0.130.0.
function printGlossary() {
  console.log(`\n  ${bold('Words')}  ${dim('— what BOSS means by them. `boss help <word>` for any of these.')}\n`);
  const list = terms();
  const width = Math.max(...list.map((t) => t.length));
  for (const t of list) {
    const g = lookup(t);
    // Truncate the WHOLE definition at a word boundary rather than taking the first sentence: several
    // entries open with a short one ("The first mode.", "A captured thought, `IDEA-NNN`.") and a
    // sentence-cut index line told the reader nothing they could not guess from the word itself.
    const cap = 66;
    const w = g.what;
    const gloss = w.length > cap ? w.slice(0, w.lastIndexOf(' ', cap)).trimEnd() + '…' : w;
    console.log(`    ${t.padEnd(width + 2)} ${dim(gloss)}`);
  }
  console.log(`\n  ${dim('Not here? `boss help <command>` for a command, `boss help symbols` for the glyphs.')}`);
  console.log('');
}

// Did-you-mean across the vocabulary, same Levenshtein as commands. A founder misremembering a WORD
// is at least as likely as one mistyping a command, and was the case with no suggestion at all.
function nearestTerm(input) {
  let best = null, bestD = Infinity;
  for (const t of terms()) {
    const d = editDistance(input, t);
    if (d < bestD) { bestD = d; best = t; }
  }
  return bestD <= 3 ? best : null;
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
    case 'recap': return cmdRecap(args);
    case 'map': return cmdMap(args);
    case 'brain': return cmdBrain(args);
    case 'insights': return cmdInsights();
    case 'records': return cmdRecords(args);
    case 'id': return cmdId(args);
    case 'team': return cmdTeam(args);
    case 'list': return cmdList(args);
    case 'retire': return cmdRetire(args);
    case 'credit': return void (process.exitCode = printCredit(args));
    case 'remove': case 'uninstall': return cmdRemove(args);
    case 'sync': return cmdSync(args);
    case 'learn': return cmdLearn(args);
    case 'craft': {
      const f = parseArgs(args || []);
      return void (process.exitCode = printCraft(f._[0], {
        outline: !!f.outline,
        prose: !!f.prose,
        shape: f.shape,
        surface: f.surface,
        minors: !!f.minors,
      }));
    }
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
