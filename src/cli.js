// `boss <verb>` — the dispatcher. One switch maps each verb to a `cmd<Verb>` handler; this is the only
// module `bin/boss` imports, and nothing else imports it. Failures go through `fail()`; src never calls
// process.exit() — handlers set process.exitCode, and `bin/boss` is the one place that exits.

import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve, basename, delimiter, relative } from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { bossVersion, STAGE_ORDER, resolveStageId, BOSS_HOME, BOSS_ROOT } from './paths.js';
import { writeFileAtomic } from './atomic.js';
import { stageVars, applyStage, applyStageSafe, appendClaudeBlock, appendGitignoreBlock, appendMarkedBlock, readStageManifest, recordIgnoreOffered } from './scaffold.js';
import { STAMP, readStamp, writeStamp, registerProject, listProjects, findByPath, retireProject, reviveProject, deregisterProject, projectPin, onDisk } from './registry.js';
import { cmdSync, stampManaged, computeSettingsMerge } from './sync.js';
import { readInbox, inboxProblems, INBOX_DIR } from './inbox.js';
import { share, unshare, shareStatus } from './share.js';
import { readClaims, standing, existingDirs, SOURCE_DIRS, NEW_DAYS, FADE_DAYS } from './sources.js';
import { earnedGroups, newlyEarned, describeUntil, describeEarned, holdAtAdopt } from './earned.js';
import { commitGuardLine, enableHook, disableHook, isRegistered, optionalHooks as shippedOptionalHooks } from './hooks.js';
import { learn, LEARN_CATEGORIES, SHIPPED_CLASSES, SHELF_CATEGORIES } from './learn.js';
import { printCraft } from './craft.js';
import { printChangelog, cmpVersion, versionLine } from './changelog.js';
import { detectStage, inferSourceGlobs } from './detect.js';
import { printUpdate, updateNote, versionChange, versionChangeLine, cmdRemoveGlobal } from './update.js';
import { printCredit } from './credit.js';
import { cmdRemove } from './remove.js';
import { built, nextSeam } from './ladder.js';
import { statusConscience, consciencePause, conscienceResume, conscienceMute, conscienceUnmute, conscienceActivity } from './conscience.js';
import { board, boardHtml, collectBoard, computeNext } from './board.js';
import { readPrograms } from './programs.js';
import { playbookHtml, questionsLine, hasVerb } from './playbook.js';
import { designHtml } from './design.js';
import { recap } from './recap.js';
import { map, renderLadder } from './map.js';
import { modeWord, loadModes } from './modes.js';
import { brain } from './brain.js';
import { insights } from './insights.js';
import { gistWork, recordDrift, driftLine, nextId, idCensus, timeline, programs, grownRecords } from './records.js';
import { renderTeam, addCollaborator, removeCollaborator, isTeam, resolveIdentity } from './team.js';
import { printReentry, printEvidenceHeadway, printIntent, printResumeWindow } from './orientation.js';
import { readiness, renderReadiness } from './readiness.js';
import { dim, bold, ok, warn, err, shellArg } from './ui.js';
import { fail, failNotAProject, setJsonErrors } from './fail.js';
import { parseArgs, KNOWN_FLAGS } from './args.js';
import { lookup, terms } from './glossary.js';
import { HELP, SYMBOLS } from './help.js';
import { helpHtml } from './help-html.js';
import { homeHtml, homeUrl } from './home.js';
import { isoDay } from './clock.js';
import { installCommitGuard } from '../stages/L0-quickstart/template/.claude/hooks/lib/commit-secrets.js';

// A mode's skill list is a wall the moment you adopt above Quickstart — MVP is 44 names, which is
// the exact Principle #2 inversion v0.130.0 fixed for `boss map` (68 lines → 45). Name the few a
// founder acts on first, count the rest, and point at the surface that exists to list them.
function skillsLine(skills, limit = 8) {
  if (!skills.length) return '—';
  if (skills.length <= limit) return skills.join(', ');
  return `${skills.slice(0, limit).join(', ')} … +${skills.length - limit} more (\`boss map\`)`;
}

// Is `claude` somewhere this shell would find it? `boss new` and `adopt` tell the founder to type it,
// and when it isn't installed that line is a dead end. Also looks where Claude Code's local installer
// puts it. Said only when it's missing (IDEA-150 A5).
function claudeInstalled(env = process.env) {
  const exts = process.platform === 'win32' ? ['.exe', '.cmd', '.ps1', ''] : [''];
  const dirs = (env.PATH || '').split(delimiter).filter(Boolean);
  const home = env.HOME || env.USERPROFILE || '';
  if (home) dirs.push(join(home, '.claude', 'local'), join(home, '.claude', 'local', 'node_modules', '.bin'));
  return dirs.some((d) => exts.some((x) => existsSync(join(d, 'claude' + x))));
}
const CLAUDE_MISSING = '                        # not installed yet? https://claude.com/claude-code';

function cmdNew(args) {
  const name = args.find((a) => !a.startsWith('--'));
  const aiNative = args.includes('--ai'); // IDEA-022 Track 3 — additive, opt-in
  if (!name) return fail('usage: boss new <project-name> [--ai]');
  const targetDir = resolve(process.cwd(), name);
  if (existsSync(targetDir)) return fail(`'${name}' already exists here. To bring BOSS into a folder you already have, run \`boss adopt\` inside it.`);

  const stageId = STAGE_ORDER[0]; // L0-quickstart
  const manifest = readStageManifest(stageId);
  mkdirSync(targetDir, { recursive: true });
  applyStage(stageId, targetDir, stageVars(name, stageId, manifest.name));
  stampManaged(targetDir, [stageId]);   // provenance from the first write, not from the first sync
  recordIgnoreOffered(targetDir, [stageId]); // so a line the founder deletes stays deleted at sync

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
  const guard = installCommitGuard(targetDir);

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
  commitGuardLine(guard);
  console.log(`\n  ${bold('Next')} ${dim('(these run in your terminal)')}`);
  console.log(`    cd ${shellArg(name)}`);
  console.log(`    code .              # or open the folder in your editor (Cursor, etc.)`);
  console.log(`    claude              # open Claude Code (works in the terminal or the editor panel)`);
  if (!claudeInstalled()) console.log(dim(CLAUDE_MISSING));
  console.log(`    ${dim('then, inside Claude:')}`);
  console.log(`    > /boss <your idea>     # spin up — a sentence, a doc, a deck, or a link`);
  console.log(`                            #   (first time? /welcome · already written it down? /inbox <file|url>)`);
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
  if (!stageId) return fail(`unknown mode '${flags.mode}'. options: ${STAGE_ORDER.map(modeWord).join(' | ')}`);
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
  // The same holds `boss unlock` keeps, evaluated against the repo being adopted: a rung's
  // earned-gated skills stay off disk until earned (a live repo — deploy config or CI, plus tests
  // — counts as shipped; a model call in the source counts as calling a model), and the opt-in
  // hooks stay off until `boss hooks enable`. Adopt used to lay down all of both (IDEA-118).
  const shippedBefore = Boolean(detected && detected.beyond);
  const deferred = {};
  const heldSkills = [];
  for (const s of chain) {
    const m = readStageManifest(s);
    const hold = holdAtAdopt(m, targetDir, { shippedBefore });
    const r = applyStageSafe(s, targetDir, stageVars(name, s, m.name), { skipSkills: hold.skip });
    stampManaged(targetDir, [s]);
    copied.push(...r.copied);
    skipped.push(...r.skipped);
    if (Object.keys(hold.deferred).length) deferred[s] = hold.deferred;
    heldSkills.push(...hold.skip);
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
  if (!gitignorePreexisted) recordIgnoreOffered(targetDir, chain);

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
    installedLayers: chain, agents: [...u.agents], skills: [...u.skills].filter((sk) => !heldSkills.includes(sk)),
    hooks: [...u.hooks], loops: [...u.loops],
    createdAt: new Date().toISOString(), adopted: true,
    ...(shippedBefore ? { shippedBefore: true } : {}),
    ...(Object.keys(deferred).length ? { deferred } : {}),
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
  if (settings?.unparseable) console.log(`  ${warn('!')} ${settings.unparseable}`);
  if (settings && settings.changed) {
    const dest = join(targetDir, settings.rel);
    mkdirSync(join(targetDir, '.claude'), { recursive: true });
    writeFileAtomic(dest, JSON.stringify(settings.merged, null, 2) + '\n');
  }

  // 5. Register as a normal (not self-hosted) project — rides the usual sync loop.
  registerProject({
    name, path: targetDir, stage: stageId, mode: manifest.name,
    bossVersion: bossVersion(), createdAt: stamp.createdAt,
  });

  console.log(`\n  ${ok('✦')} Adopted ${bold(name)} into BOSS — ${manifest.name} mode (${stageId}, BOSS ${bossVersion()})`);
  commitGuardLine(installCommitGuard(targetDir));
  if (detected) {
    console.log(`    ${dim('read from your repo:')} ${detected.why.join(' · ')}`);
    if (detected.beyond) {
      console.log(`    ${warn('▸')} this looks past MVP — shipped and tested. ${bold('boss unlock v1')} adds the design`);
      console.log(`      system, db and board discipline ${dim("when you want it; BOSS won't climb there on its own.")}`);
    }
  }
  // What stays held back, and what earns it — the line `boss unlock` prints, for the same reason.
  for (const [s, groups] of Object.entries(deferred)) {
    const m = readStageManifest(s);
    for (const [group, sk] of Object.entries(groups)) {
      const until = (m.earned || {})[group];
      console.log(`    ${dim('·')} ${dim(`${sk.length} held back ${describeUntil(until)}:`)} ${skillsLine(sk, 3).replace(/ \(`boss map`\)$/, '')} ${dim(`— \`boss sync\` lays ${sk.length === 1 ? 'it' : 'them'} down then.`)}`);
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
  if (!claudeInstalled()) console.log(dim(CLAUDE_MISSING));
  console.log(`    > /read-repo            # start here — BOSS reads what you've built and says where you stand.`);
  console.log(`                            #   Additive and reversible; diff or revert anything.`);
  console.log(`    > /welcome              # then, if you want it: what BOSS added + how the conscience works`);
  console.log(`    boss map                # what's available · boss unlock <mode> to grow ${dim('(terminal)')}`);
  console.log('');
}

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

function cmdUnlock(args) {
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

// `boss status --line` — where you are in one plain line, for a status bar or a prompt (Claude Code's
// `statusLine`, a Starship module): mode, then the one thing in focus, picked the way
// printFocusAndHeadway picks it. No colour, no count of anything done — a position, never a score.
export function statusLine(projectDir, stamp, { brand = true } = {}) {
  const parts = [...(brand ? ['BOSS'] : []), stamp.mode || stamp.stage];
  try {
    const { cards } = collectBoard(projectDir);
    const { finish, start, pressure, pick } = computeNext(cards);
    if (finish.length) parts.push(`building ${finish[0].id}${finish.length > 1 ? ` (+${finish.length - 1})` : ''}`);
    else if (start.length) parts.push(`ready to build ${start[0].id}`);
    else if (pressure.length) parts.push(`next: pressure-test ${pressure[0].id}`);
    else if (pick.length) parts.push('next: pick the piece the venture needs first');
  } catch { /* a status bar never breaks on a malformed record */ }
  return parts.join(' · ');
}

// The orientation core of `boss status` (EVID-001): what you're building right now,
// and that you're making headway. Reads the same board projection so status, board,
// and insights all agree on "in flight." Prints nothing it can't derive honestly.
function printFocusAndHeadway(projectDir, { adopted = false } = {}) {
  let cards;
  try { ({ cards } = collectBoard(projectDir)); } catch { return; }
  const { finish, start, pressure, pick } = computeNext(cards);
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
    // Part of a program with a record? Say which, and where its shared rules are (IDEA-145 G5).
    let prog = null;
    const fc = cards.find((c) => c.id === f.id);   // computeNext's entries are trimmed; the card has it
    try { prog = fc && fc.program ? readPrograms(projectDir).get(fc.program) : null; } catch { prog = null; }
    if (prog) console.log(`      ${dim(`part of ${prog.title} — its rules: ${prog.file}`)}`);
  } else if (start.length) {
    // `/spec` is an MVP verb; on a Quickstart project the arrow says where it comes from instead
    // of pointing at a command that is not installed (the playbook's gate, IDEA-118).
    console.log(`    ▸ ${bold('Ready to build:')}  ${start[0].id} — ${start[0].title}   ${dim(hasVerb('/spec', projectDir) ? '→ /spec' : '→ boss unlock mvp, then /spec')}`);
  } else if (pressure.length) {
    console.log(`    ▸ ${bold('Next:')}            pressure-test ${pressure[0].id}   ${dim('→ /canvas')}`);
  } else if (pick.length) {
    // A venture on file, pressure-tested, and only captured capabilities: the next step is a choice,
    // not a verb — which piece does the venture need first (IDEA-114 slice 2).
    console.log(`    ▸ ${bold('Next:')}            pick the piece the venture needs first — ${pick.map((p) => p.id).join(', ')}   ${dim('→ `status: ready`, then /spec')}`);
  } else if (adopted) {
    // An empty board in an ADOPTED repo is the expected state, not a prompt. The old line told
    // someone who had just handed BOSS a shipped app with tests, CI and a deploy config to go
    // "capture an idea" — one line above `Already built: a deploy config · the landing page`, so
    // the same screen both saw their work and asked them to start. What they have not done is let
    // BOSS read it.
    console.log(`    ▸ ${dim('Nothing captured yet — expected here.')} ${bold('/read-repo')} ${dim('reads what you have built and says where you stand.')}`);
  } else if (cards.some((c) => c.column === 'Shipped')) {
    // Everything on the board has shipped. "Nothing in flight yet — capture an idea" is what an
    // empty board says; said to someone who just shipped, it reads as BOSS having forgotten. The
    // headway line below carries what shipped; this one carries the two doors that open after it.
    console.log(`    ▸ ${dim('Nothing in flight — the board is all shipped. /spec the next piece, or /idea what came up while building.')}`);
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
  const f = parseArgs(args || []);
  // `--line` feeds a status bar or a prompt, which runs in every folder: outside a project it prints
  // nothing and exits 0 rather than an error into someone's prompt (PROG-004).
  if (f.line) {
    const stamp = readStamp(process.cwd());
    if (stamp) console.log(statusLine(process.cwd(), stamp));
    return;
  }
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
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
  for (const g of newlyEarned(process.cwd(), stamp)) {
    console.log(`    ${ok('▸')} ${bold('Earned:')}          ${skillsLine(g.skills, 3).replace(/ \(`boss map`\)$/, '')} ${dim(`— ${describeEarned(g.until)}. \`boss sync\` lays ${g.skills.length === 1 ? 'it' : 'them'} down.`)}`);
  }
  // Toward what (IDEA-097): the founder's own sentence for "it worked", if they gave one.
  // Silent otherwise — see src/orientation.js.
  printIntent(process.cwd());
  // Ticket headway is what printFocusAndHeadway just rendered (the last shipped FEAT).
  // This is the other half, and the half that can be wrong: what the work actually
  // taught you. Shipping is motion; evidence is the part that moves the bet.
  printEvidenceHeadway(process.cwd());
  // The briefing's window (IDEA-102): one line when docs/RESUME.md has outgrown what a session
  // should read first, silent otherwise. It says MOVE, never trim — the history has a home.
  printResumeWindow(process.cwd());
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
    // "Everything BOSS can check" read as the whole bar when V1's bar is one checkable condition
    // and two it cannot see. No tally (readiness.js refuses one on purpose); the unknowns are
    // named as yours, in words (IDEA-118).
    const scope = nextBar.unknowns ? 'what BOSS can check is in place; the rest is yours to judge —' : 'everything BOSS can check is in place —';
    console.log(`    ${ok('✓')} ${bold(`Ready for ${nextName}:`)} ${dim(scope)} ${bold(`boss unlock ${modeWord(nextStage)}`)} ${dim('when you are.')}`);
  }
  printBuiltAndSeam(process.cwd(), stamp);
  console.log('');
  console.log(`    ${dim('modes:')}        ${stamp.installedLayers.map(modeWord).join(' → ')}`);
  console.log(`    ${dim('BOSS pinned:')}  ${stamp.bossVersion || 'unknown'}   ${dim('current:')} ${current}`);
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

// `boss playbook` — the founder's canvas as boxes, one self-contained page in .boss/ (FEAT-026).
// Same contract as `board --html`: a pure projection of the files, re-run to refresh, the path
// is printed and `--open` is best-effort. It asks nothing (the frame is a toggle on the page).
function cmdPlaybook(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  const { out, data } = playbookHtml(process.cwd(), stamp.name);
  const { ledger, canvas, error } = data;
  console.log(`\n  ${ok('✦')} Playbook → ${out}`);
  printHome(stamp);
  console.log(`    ${canvas ? `docs/ideas/${canvas.file}` : 'no canvas yet — every box is a question; /canvas fills them'} · ${ledger.backed} of ${ledger.live} cells backed by evidence · ${ledger.signals} signal${ledger.signals === 1 ? '' : 's'}`);
  if (error) console.error(`    ${warn('!')} ${error}`);
  // The pull (IDEA-111): the page's holes, read back — the founder sees what's open without opening
  // it. `--questions` lists each one with its verb; the page carries the prompt behind each.
  // Day 0 — no IDEA doc at all — collapses to the board's one sentence: thirty-two questions before
  // there is an idea is a wall, and every one of them waits on the same first step (IDEA-118).
  if (!data.idea) console.log(`    nothing to read yet — \`/boss <your idea>\` starts it; the page holds the ${data.questions.length} questions it will grow into.`);
  else console.log(`    ${questionsLine(data.questions)}`);
  if (args.includes('--questions') && data.questions.length) {
    console.log('');
    for (const q of data.questions) console.log(`    ${dim('·')} ${q.title} ${dim('—')} ${q.line}`);
  }
  console.log('    A read of your files. Re-run `boss playbook` to refresh.\n');
  if (args.includes('--open')) {
    const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    try { spawn(opener, [out], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref(); } catch { /* path already printed */ }
  }
}

// Every page command rewrites the home (.boss/index.html) and prints IT as the bookmark, not the
// page: one link to all of them, in a folder Finder hides (IDEA-144). homeUrl is pathToFileURL, not
// `file://` + a path: on Windows that printed `file://C:\\Users\\…`, which no browser opens.
function printHome(stamp) {
  homeHtml(process.cwd(), stamp.name);
  console.log(`    ${dim('bookmark:')} ${homeUrl(process.cwd())} ${dim('— one page for all of them')}`);
}

// `boss design` — the founder's design system as one page in .boss/, a sibling of the playbook
// (FEAT-030). Same contract: a pure projection of docs/design/*, docs/BRAND.md and the DECs;
// contrast computed for the declared pairs; every hole a hole; re-run to refresh.
function cmdDesign(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  const { out, data } = designHtml(process.cwd(), stamp.name);
  const filled = data.slots.filter(([, ok]) => ok).length;
  console.log(`\n  ${ok('✦')} Design → ${out}`);
  printHome(stamp);
  console.log(`    ${data.tokens.source || 'no tokens file yet — /design-tokens-init writes docs/design/tokens.json'} · ${filled} of ${data.slots.length} slots filled · ${data.pairs.length} contrast pair${data.pairs.length === 1 ? '' : 's'} computed · ${data.findings} finding${data.findings === 1 ? '' : 's'}`);
  if (data.tokens.error) console.error(`    ${warn('!')} ${data.tokens.error}`);
  // The pull, as the playbook has it: the open slots read back, in build order, each with the verb
  // that fills it and the moment that earns it. `--questions` lists them. Nothing filled at all
  // collapses to one sentence, as the playbook and the board do on day 0 (IDEA-118).
  if (!filled) console.log(`    nothing to read yet — the first real screen earns this page; it holds the ${data.questions.length} slots that wait on it${hasVerb('/design-tokens-init', process.cwd()) ? ' (/design-tokens-init starts it)' : ' (/design-tokens-init starts it, at MVP)'}.`);
  else console.log(`    ${questionsLine(data.questions)}`);
  if (args.includes('--questions') && data.questions.length) {
    console.log('');
    for (const q of data.questions) console.log(`    ${dim('·')} ${q.title} ${dim('—')} ${q.line} ${dim('· ' + q.moment)}`);
  }
  console.log('    A read of your files. Re-run `boss design` to refresh.\n');
  if (args.includes('--open')) {
    const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    try { spawn(opener, [out], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref(); } catch { /* path already printed */ }
  }
}

function cmdBoard(args = []) {
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  if (args.includes('--html')) {
    const out = boardHtml(process.cwd(), stamp.name);
    console.log(`\n  ${ok('✦')} Visual board → ${out}`);
    printHome(stamp);
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
  // `--program <slug|PROG-NNN>` takes a value, so that value is not a card id (IDEA-145).
  const pi = args.indexOf('--program');
  const program = pi !== -1 ? (args[pi + 1] && !args[pi + 1].startsWith('-') ? args[pi + 1] : '') : null;
  if (program === '') { console.error('  `--program` needs a name — a slug or a PROG id. `boss records --programs` lists them.'); process.exitCode = 1; return; }
  const card = args.find((a, i) => !a.startsWith('-') && !(pi !== -1 && i === pi + 1)) || null;
  board(process.cwd(), stamp.name, {
    card,
    program,
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
    // A graduated program says what it is, and how much of its own backlog is open — the tasks
    // that live in the program record rather than as members (IDEA-145).
    if (p.record) {
      const tasks = p.record.work.open ? ` · ${p.record.work.open} task${p.record.work.open === 1 ? '' : 's'} open in ${p.record.file}` : '';
      console.log(`      ${p.record.title}${dim(tasks)}`);
    }
    for (const m of p.members) {
      const done = (m.status || '').startsWith('shipped');
      console.log(`      ${done ? dim(m.id) : m.id}  ${dim((m.status || '').split('(')[0].trim())}`);
    }
  }
  const stuck = progs.filter((p) => p.open && !p.shipped);
  if (stuck.length) {
    console.log(`\n  ${bold(`${stuck[0].name}`)} has ${stuck[0].open} open and nothing shipped — the umbrella to look at first.`);
  }
  // IDEA-145 E5 — offered, never done. One line per grown record; the founder decides.
  let grown = [];
  try { grown = grownRecords(dir); } catch { grown = []; }
  if (grown.length) {
    console.log(`\n  ${bold('Might want to be a program')} ${dim('— still in flight, and holding several efforts in one file')}`);
    for (const g of grown) {
      const what = [g.work.openTracks.length > 1 ? `${g.work.openTracks.length} tracks open (${g.work.openTracks.join(' ')})` : '', `${g.work.open} items open`].filter(Boolean).join(' · ');
      console.log(`    ${g.id.padEnd(10)} ${dim(what)}`);
    }
    console.log(dim('    The pieces that could ship alone become members; the rest stay as its tasks.'));
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
    'broken-amend': 'BROKEN AMENDMENT LINK',
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
      if (f.kind === 'broken-amend') {
        console.log(dim('  A later feature changed what a shipped one promised. The shipped record has to'));
        console.log(dim('  say so, or whoever reads it still sees the old promise.'));
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
    } else if (sub === 'share') {
      return cmdTeamShare(rest);
    } else if (sub && sub !== 'list') {
      return fail(`unknown subcommand 'team ${sub}'. options: (none) | add | remove | share`);
    }
    console.log(renderTeam(process.cwd()));
  } catch (e) {
    return fail(e.message);
  }
}

// `boss team share` (PROG-005 T4): the three folders that never go to git — interview notes, the
// inbox, rival notes — shared with a team through a folder it already syncs. src/share.js says why
// a drive and not a repo or a server, and how nothing gets deleted on the way.
function cmdTeamShare(rest) {
  const f = parseArgs(rest);
  const where = f._[0];
  const dir = process.cwd();
  if (f.off) {
    const r = unshare(dir);
    console.log(`\n  ${ok('✦')} Sharing off. Each folder is back on this machine, copied from the shared folder:`);
    for (const x of r) console.log(`    ${x.state === 'copied-back' ? ok('✓') : dim('·')} docs/${x.name}/${x.state === 'copied-back' ? `  ${dim(`← ${x.from}`)}` : `  ${dim('(was already local)')}`}`);
    console.log(`  ${dim('The shared folder is untouched; your teammates still have it.')}\n`);
    return;
  }
  if (!where) {
    const st = shareStatus(dir);
    console.log(`\n  ${bold('Shared with the team')} ${dim('— the folders that never go to git')}`);
    for (const x of st.folders) {
      const mark = x.state === 'linked' ? ok('✓') : x.state === 'broken' ? warn('!') : dim('·');
      const note = x.state === 'linked' ? dim(`→ ${x.target}`)
        : x.state === 'broken' ? `${warn('the shared folder is not there')} ${dim(`(${x.target}) — is the drive connected?`)}`
          : dim(x.state === 'local' ? 'on this machine only' : 'not created yet');
      console.log(`    ${mark} docs/${x.name}/  ${note}`);
    }
    if (!st.setting) {
      console.log(`\n  ${dim('Not shared. To share with a cofounder, point at a folder your team already syncs:')}`);
      console.log(`    ${bold('boss team share <path to the shared folder for this project>')}`);
      console.log(`  ${dim('Each teammate runs it once, with their own path to the same folder.')}`);
    }
    console.log('');
    return;
  }
  const { root, results } = share(dir, where);
  console.log(`\n  ${ok('✦')} Shared through ${bold(root)}`);
  for (const r of results) {
    const extra = r.state === 'already' ? dim('already linked')
      : `${dim('linked')}${r.copied ? dim(` · ${r.copied} file(s) copied in`) : ''}${r.conflicts?.length ? ` · ${warn(`${r.conflicts.length} differ — yours kept`)}` : ''}`;
    console.log(`    ${ok('✓')} docs/${r.name}/  ${extra}`);
    for (const c of r.conflicts || []) console.log(`        ${warn('≠')} ${c} ${dim('— the shared copy differs; yours is in')} ${r.backedUp}`);
  }
  console.log(`\n  ${dim('Your own copies are in .boss/backups/ — nothing was deleted. These folders still never go to git;')}`);
  console.log(`  ${dim('the drive is what shares them, and deleting a file there deletes it for everyone.')}`);
  console.log(`  ${dim('Each teammate runs')} ${bold('boss team share <their path>')} ${dim('once.')} ${bold('boss team share --off')} ${dim('undoes it.')}\n`);
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
  const today = isoDay();
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

// Source standing (PROG-005 B5): who to read first, counted from the claim rows /scout writes. An
// order with its reason — never a score — so a famous name gets no head start and a new voice that
// held up gets in. src/sources.js says how it counts.
function cmdSources(args) {
  const f = parseArgs(args);
  const dirs = f._.length ? f._.map((d) => resolve(process.cwd(), d)) : existingDirs(process.cwd(), SOURCE_DIRS);
  const { rows, tilt } = standing(readClaims(dirs));
  if (f.json) { console.log(JSON.stringify({ rows, tilt }, null, 2)); return; }
  if (!rows.length) {
    console.log(`\n  ${dim('No claim rows yet.')} ${bold('/scout')} ${dim('writes them — one per claim, with who said it and whether it held up.')}`);
    console.log(`  ${dim('Standing is counted from those rows, so it starts with your first research pass.')}\n`);
    return;
  }
  console.log(`\n  ${bold('Sources')} ${dim(`— who to read first, from what has held up · ${tilt.total} source(s), ${tilt.newThisYear} first seen this year`)}`);
  const mark = { new: ok('+'), 'held up': ok('✓'), fading: warn('~'), 'no record yet': dim('·'), 'not held up': warn('×') };
  for (const r of rows) {
    const tally = `${r.held} held${r.killed ? ` · ${r.killed} didn't` : ''}${r.unverified ? ` · ${r.unverified} untested` : ''}`;
    const when = r.lastHeld ? ` · last held ${r.lastHeld}` : '';
    console.log(`    ${mark[r.label]} ${r.source}  ${dim(`${r.label} — ${tally}${when}`)}`);
  }
  console.log(`\n  ${dim(`new: first held in the last ${NEW_DAYS} days · fading: nothing held in ${FADE_DAYS}. An order to read in, not a verdict —`)}`);
  console.log(`  ${dim('a high place never makes a new claim true; it still gets tested like a stranger\'s.')}\n`);
}

// The inbox view (PROG-005 T2): what came in, what is still unsorted, and where the rest went.
// Read-only — nothing moves; /scout sort stamps an item, this only reads the stamps.
function cmdInbox(args) {
  const f = parseArgs(args);
  const dir = resolve(process.cwd(), f._[0] || INBOX_DIR);
  const items = readInbox(dir);
  if (f.json) { console.log(JSON.stringify(items || [], null, 2)); return; }
  const rel = relative(process.cwd(), dir) || '.';
  const trouble = inboxProblems(dir);
  if (trouble.brokenLink) {
    console.log(`\n  ${warn('!')} ${bold(`${rel}/`)} ${dim('points at')} ${trouble.brokenLink}${dim(", which isn't there — is the shared drive connected? Nothing is lost; it's just not reachable from here.")}\n`);
    return;
  }
  if (!items) {
    console.log(`\n  ${dim(`No inbox here yet (${rel}/).`)} ${bold('/inbox <file, link or paste>')} ${dim('starts one.')}\n`);
    return;
  }
  const by = (st) => items.filter((i) => i.state === st);
  const short = (t) => { const c = String(t).split(/ \(| — /)[0]; return c.length > 60 ? `${c.slice(0, 59)}…` : c; };
  const fresh = by('new'), held = by('held'), sorted = by('sorted'), ref = by('reference');
  console.log(`\n  ${bold('inbox')} ${dim(`— ${rel}/ · ${items.length} item(s)`)}`);
  if (trouble.ledgerError) console.log(`    ${warn('!')} ${dim(`couldn't read ${rel}/.inbox.json — showing everything as new until it's fixed`)}`);
  if (items.length && !fresh.length) console.log(`    ${ok('✓')} ${dim('Nothing waiting.')}`);
  if (!items.length) console.log(`    ${dim('empty —')} ${bold('/inbox <file, link or paste>')} ${dim('brings something in.')}`);
  if (fresh.length) {
    console.log(`\n  ${bold(`New (${fresh.length})`)} ${dim('— not sorted yet:')} ${bold('/inbox')} ${dim('sorts them')}`);
    for (const i of fresh) console.log(`    ${warn('•')} ${i.name}`);
  }
  if (held.length) {
    console.log(`\n  ${bold(`Held (${held.length})`)} ${dim('— labelled, never committed, held until the project has a home for it')}`);
    for (const i of held) console.log(`    ${dim('◦')} ${i.name}  ${dim(i.kind)}`);
  }
  if (sorted.length) {
    console.log(`\n  ${bold(`Sorted (${sorted.length})`)}`);
    for (const i of sorted) console.log(`    ${ok('✓')} ${i.name}${i.to ? `  ${dim('→')} ${short(i.to)}` : ''}${/^\d{4}-/.test(i.sorted || '') ? `  ${dim(i.sorted)}` : ''}`);
  }
  if (ref.length) {
    console.log(`\n  ${bold(`Reference (${ref.length})`)} ${dim('— kept, nothing to file')}`);
    for (const i of ref) console.log(`    ${dim('·')} ${i.name}`);
  }
  console.log('');
}

function cmdLearn(args) {
  const f = parseArgs(args);
  let res;
  try {
    res = learn({
      srcPath: f._[0],
      category: f.as,
      mode: typeof f.mode === 'string' ? f.mode : undefined,
      note: typeof f.note === 'string' ? f.note : undefined,
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
  console.log(`    Added under ${bold('## Unreleased')} in registry/CHANGELOG.md — VERSION does not move; the releaser stamps it.`);
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
  'new', 'adopt', 'unlock', 'status', 'board', 'playbook', 'design', 'recap', 'map', 'brain', 'insights', 'records', 'id', 'inbox', 'sources',
  'team', 'list', 'retire', 'credit', 'remove', 'uninstall', 'sync', 'learn', 'craft',
  'changelog', 'whatsnew', 'update', 'outdated', 'conscience', 'hooks', 'version', 'help',
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
    does: 'Catches hardcoded colors (hex, rgb()/hsl(), palette classes like bg-blue-500) the moment they\'re written, and hands Claude your token names instead. Silent until a DESIGN_TOKENS.md exists — no token system, no opinion. It reads `docs/design/tokens.json` (DTCG) for names and `$deprecated`, and the tokens doc\'s `Deprecated` table: a write that references a retired token is told its successor, so a rename never has to be a deletion.',
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
    does: "Asks the question that keeps a codebase a system. When a component gets written whose name has no row in `docs/design/COMPONENTS.md`, it hands Claude the ones that already exist — near-names first — and asks: reuse, adjust, or new? It carries the test, because the question is hard: match on the JOB, not the look. Fires once per new component name, never on an edit to one you already have, and never at all until the index exists. It also reads the index's `Status` column — a write that references a component marked `deprecated → X` is told to use `X` — and the API-shape floor: three `isX`-style booleans on one component is eight undesigned states, and it asks for an enumerated `variant` instead. For code: a new exported helper with no row in your engineering file's helper table gets the same question, with a fourth answer — inline it back when widening would need a new parameter and a new conditional for one caller.",
    cost: 'a process after each file write',
    worth: "you have more than a couple of components and want to keep it that way — writing a new file is easier for a model than reading an existing one and widening it, so `create` is the default unless something asks. This is what stops Button, CTAButton and PrimaryButton",
  },
  {
    name: 'design-decisions-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: "Hands the agent the product's OWN design decisions at the moment a UI write touches their situation — a `PAT-n` the product grew (its rule and its anti-pattern), a Do / Don't pair from the style guide, an exception recorded at that path, a nesting a component's usage page ruled out (`Never inside` / `Never holds`, when the write opens both tags). Three lines at most, once per file per decision, never a seeded prompt and never BOSS's opinion. Silent until `PATTERNS.md` has an Ours row, the style guide a Do / Don't pair, or a usage page a Never line. Each fire is one line in `.boss/trace.jsonl`, which is what the divergence number reads.",
    cost: 'a process after each UI file write',
    worth: "you have decided things — the page (`boss design`) shows them, this is what keeps the next screen from quietly diverging while nobody is looking at the page",
  },
  {
    name: 'ui-boundary-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: "Keeps imports flowing one way — `ui/` → `features/` → `app/`. When a file inside a layered layout gains an import that points UP (a system component reaching into a feature, a feature reaching into the app shell) or SIDEWAYS into another feature's internals, it names the crossing and the usual fix: move the shared piece down, import from the other feature's `index`, or pass it in as a prop. Reads paths, not syntax, so it works for TS/JS, Vue, Svelte, Astro and Dart alike. Silent unless the project actually has a `features/` directory beside a `ui/` or `components/` one — a flat components folder is earlier, not wrong.",
    cost: 'a process after each file write (it reads only the imports the write added)',
    worth: "your app has grown past one folder of components — one reasonable-looking upward import is cheap today and makes `ui/` un-extractable and two features un-separable forever. This is the linter the mature systems keep for exactly this rule, without a stack-specific linter",
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
  {
    name: 'smoke-guard',
    event: 'Stop',
    mode: 'MVP',
    does: "Runs your smoke command (the one `/smoke` saved to `.boss/smoke.json`) when Claude finishes a turn that touched source, and hands a red result back as a reason to keep going — once. Green is one line; nothing changed, nothing runs; docs-only turns are ignored. It never blocks twice on the same failure. The engineering counterpart of the design guards above: `/smoke` documents the gate, this is what runs it before the commit.",
    cost: 'your smoke command, once per turn that changed source',
    worth: "you have a smoke configured and want it to actually hold — an agent that says \"done\" is the moment the gate is least likely to be remembered, and a red base is what the next change builds on",
  },
  {
    name: 'test-assertion-guard',
    event: 'PostToolUse',
    mode: 'MVP',
    does: "Names a test edit that removes an assertion or adds a skip while the code beside it also changed, and asks for the reason — a bug fix adds a test; only a real change in behaviour edits one. Says nothing about ordinary test-writing, and nothing outside a git repo. Never blocks.",
    cost: 'a process after each file write; a git status only when a test file lost an assertion',
    worth: 'an agent writes most of your tests and your code — loosening a test until it passes is the shortest path to green, and the one you can\'t see in a diff you didn\'t read',
  },
];

// `boss hooks` — list the opt-in hooks; `enable <name>` lays one down AND registers it from the
// block in its own header; `disable <name>` reverses both. Nothing lands at scaffold any more.
function cmdHooks(args) {
  const { _: pos } = parseArgs(args);
  const [sub, name] = pos;
  if (!sub) return printHooks(process.cwd());
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  const layers = stamp.installedLayers || [stamp.stage];
  if (sub === 'enable') {
    if (!name) return fail('usage: boss hooks enable <name>   (`boss hooks` lists them)');
    try {
      const r = enableHook(process.cwd(), name, layers);
      console.log(`\n  ${ok('✦')} ${bold('/' + name)} is on${r.file ? ' — file laid down' : ''}${r.registered ? ', registered in .claude/settings.json' : ' (was already registered)'}.`);
      console.log(`  ${dim('It runs from the next Claude Code session. `boss hooks disable ' + name + '` turns it off.')}\n`);
    } catch (e) { return fail(e.message); }
    return;
  }
  if (sub === 'disable') {
    if (!name) return fail('usage: boss hooks disable <name>');
    const r = disableHook(process.cwd(), name);
    if (!r.unregistered && !r.removed && !r.kept) return fail(`'${name}' was not on.`);
    if (r.kept) {
      console.log(`\n  ${ok('✦')} ${bold('/' + name)} is off${r.unregistered ? ', unregistered' : ''}. ${bold('Your file is kept')} — it differs from the one BOSS ships,`);
      console.log(`  so it's yours: \`boss hooks enable ${name}\` turns it back on as it is; delete .claude/hooks/${name}.js to be rid of it.\n`);
      return;
    }
    console.log(`\n  ${ok('✦')} ${bold('/' + name)} is off${r.removed ? ' — file removed' : ''}${r.unregistered ? ', unregistered' : ''}. \`boss hooks enable ${name}\` brings it back.\n`);
    return;
  }
  return fail(`unknown subcommand 'hooks ${sub}'. options: (none) | enable <name> | disable <name>`);
}

function printHooks(projectDir = null) {
  console.log(`\n  ${bold('Opt-in hooks')}  ${dim('— off until you ask; one command turns one on')}\n`);
  console.log(`  ${OPTIONAL_HOOKS.length} hooks are available. None is laid down until \`boss hooks enable <name>\`, which`);
  console.log(`  copies the file and registers it in one move. The mode column is when each one becomes available.`);
  console.log(`  ${dim('Two hooks are already ON and are not listed here: `conscience` (the nudges) and')}`);
  console.log(`  ${dim('`reentry` (hands Claude where you left off when you come back after a few days).')}`);
  console.log(`  That is deliberate: a hook runs a process on every matching event, and BOSS won't`);
  console.log(`  spend your latency without you asking. ${dim('An unregistered script costs nothing.')}\n`);
  for (const h of OPTIONAL_HOOKS) {
    const on = projectDir && isRegistered(projectDir, h.name);
    console.log(`  ${bold('/' + h.name.padEnd(26))} ${dim(h.event)} ${dim('· ' + h.mode)}${on ? `  ${ok('on')}` : ''}`);
    console.log(`    ${h.does}`);
    console.log(`    ${dim('costs:')} ${h.cost}`);
    console.log(`    ${dim('worth it when:')} ${h.worth}\n`);
  }
  console.log(`  ${bold('To turn one on')}   ${bold('boss hooks enable <name>')}   ${dim('· off again: boss hooks disable <name>')}`);
  console.log(`  ${dim('The registration in .claude/settings.json is the on-switch; `boss sync` keeps enabled hooks current.')}\n`);
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
  console.log(row('boss board --program <name>', 'one program\'s cards · `boss board PROG-NNN` = the program'));
  console.log(row('boss board --next|--blocked|--json', 'what to pick up · what\'s stuck · JSON (agent-readable)'));
  console.log(row('boss playbook [--open] [--questions]', 'your venture as one page in .boss/ — holes stay holes; --questions lists what\'s open'));
  console.log(row('boss design [--open] [--questions]', 'your design system as one page in .boss/ — holes stay holes; --questions lists what\'s open, with the moment that earns it'));
  console.log(row('boss status [--conscience]', 'mode + pinned version + drift (--conscience: loop states)'));
  console.log(row('boss unlock <mode>', 'move up a mode: quickstart → mvp → v1 → scale'));
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

function printDoorstep(stamp) {
  console.log(`\n  ${bold(stamp.name)}   ${dim(statusLine(process.cwd(), stamp, { brand: false }))}\n`);
  const row = (cmd, desc) => `    ${bold(cmd.padEnd(22))} ${dim(desc)}`;
  console.log(row('boss status', 'the full read: where you are, what moved, what is next'));
  console.log(row('boss board --next', 'what to pick up'));
  console.log(row('boss unlock', 'the next mode and what it asks of you'));
  console.log(row('boss help', 'every command'));
  console.log(`\n  ${dim('Inside Claude Code: /boss and say what you are trying to do.')}\n`);
}

function cmdHelp(args) {
  const topic = args.find((a) => !a.startsWith('-'));
  // `--html` is a RENDERER, not a topic: it answers the same questions as everything below,
  // for someone who would rather read a page than a terminal. Same posture as
  // `boss board --html` — writes into .boss/, re-run to refresh, nothing to maintain.
  if (args.includes('--html')) return cmdHelpHtml();
  if (!topic) return printHelp();
  if (topic === 'symbols' || topic === 'symbol' || topic === 'legend') return printSymbols();
  if (topic === 'hooks' || topic === 'hook') return printHooks(process.cwd());
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
  printHome(stamp);
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

// Commands that print JSON on --json. Anywhere else the flag used to be ignored and the command
// printed prose to a caller that had asked for JSON, with nothing saying so.
const JSON_COMMANDS = new Set(['board', 'inbox', 'sources']);

// A flag no command reads is a typo: refuse it and name the nearest real one, rather than run the
// command as if it weren't there (`boss board --nxt` printed the whole board and exited 0).
function unknownFlag(cmd, args) {
  for (const a of args) {
    if (!a.startsWith('--') || a === '--') continue;
    const name = a.slice(2).split('=')[0];
    if (name === 'json' && !JSON_COMMANDS.has(cmd)) {
      fail(`\`boss ${cmd}\` has no --json output. \`boss board --json\` does.`);
      return true;
    }
    if (KNOWN_FLAGS.has(name)) continue;
    let best = null, bestD = Infinity;
    for (const f of KNOWN_FLAGS) { const d = editDistance(name, f); if (d < bestD) { bestD = d; best = f; } }
    fail(`unknown flag ${bold('--' + name)}.${best && bestD <= 2 ? ` Did you mean ${bold('--' + best)}?` : ''} \`boss help ${cmd}\` lists what it takes.`);
    return true;
  }
  return false;
}

export async function run(argv) {
  const [cmd, ...args] = argv;
  setJsonErrors(args.includes('--json'));
  if (KNOWN_COMMANDS.includes(cmd) && unknownFlag(cmd, args)) return;
  // Once per update, to a person at a terminal: never into piped or --json output, and not ahead
  // of `boss whatsnew`, which is already the answer (IDEA-151).
  if (process.stdout.isTTY && !argv.includes('--json')) {
    const change = versionChange();
    if (change && !['changelog', 'whatsnew', 'version', '--version', '-v'].includes(cmd)) console.log(`\n${versionChangeLine(change)}`);
  }
  switch (cmd) {
    case 'new': return cmdNew(args);
    case 'adopt': return cmdAdopt(args);
    case 'unlock': return cmdUnlock(args);
    case 'status': return cmdStatus(args);
    case 'board': return cmdBoard(args);
    case 'playbook': return cmdPlaybook(args);
    case 'design': return cmdDesign(args);
    case 'recap': return cmdRecap(args);
    case 'map': return cmdMap(args);
    case 'brain': return cmdBrain(args);
    case 'insights': return cmdInsights();
    case 'records': return cmdRecords(args);
    case 'id': return cmdId(args);
    case 'inbox': return cmdInbox(args);
    case 'sources': return cmdSources(args);
    case 'team': return cmdTeam(args);
    case 'list': return cmdList(args);
    case 'retire': return cmdRetire(args);
    case 'credit': return void (process.exitCode = printCredit(args));
    case 'remove': case 'uninstall': return parseArgs(args).global ? cmdRemoveGlobal(args) : cmdRemove(args);
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
    case 'hooks': return cmdHooks(args);
    case 'version': case '--version': case '-v': {
      const checkout = existsSync(join(BOSS_ROOT, '.git'));
      let unreleasedText = '';
      if (checkout) try { unreleasedText = readFileSync(join(BOSS_ROOT, 'registry', 'CHANGELOG.md'), 'utf8'); } catch { /* none */ }
      return console.log(versionLine(bossVersion(), { checkout, unreleasedText }));
    }
    case undefined: {
      // Bare `boss` inside a project answers "where am I" before "what can I type" (PROG-004) — the
      // manual is one word away. Outside a project there is nowhere to be, so it is the manual.
      const stamp = readStamp(process.cwd());
      if (stamp) return printDoorstep(stamp);
      return cmdHelp(args);
    }
    case 'help': case '--help': case '-h':
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
