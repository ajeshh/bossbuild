// src/install.js — the three commands that lay a stage into a project: `boss new` (an empty folder),
// `boss adopt` (a repo already under way) and `boss unlock` (the next mode, into a project BOSS is
// already in). They share a job and their helpers, so they share a module (IDEA-160 Q3). The file
// copying itself is scaffold.js's; this is the part a founder reads.

import { mkdirSync, existsSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { join, resolve, delimiter, basename, dirname, relative, sep } from 'node:path';
import { execSync } from 'node:child_process';
import { homedir } from 'node:os';
import { bossVersion, STAGE_ORDER, resolveStageId, BOSS_HOME, STAGES_DIR } from './paths.js';
import { stageVars, applyStage, readStageManifest, recordIgnoreOffered, applyStageSafe, planStageSafe, gitignoreRulesToAdd, appendClaudeBlock, appendGitignoreBlock, appendMarkedBlock } from './scaffold.js';
import { readStamp, writeStamp, registerProject, STAMP } from './registry.js';
import { stampManaged, computeSettingsMerge } from './sync.js';
import { earnedGroups, describeUntil, holdAtAdopt } from './earned.js';
import { modeWord, skillsLine, whereLabel } from './modes.js';
import { readiness, renderReadiness } from './readiness.js';
import { dim, bold, ok, warn, shellArg } from './ui.js';
import { fail, failNotAProject } from './fail.js';
import { commitGuardLine } from './hooks.js';
import { installCommitGuard } from '../stages/L0-quickstart/template/.claude/hooks/lib/commit-secrets.js';
import { recordFiles } from '../stages/L0-quickstart/template/.claude/hooks/lib/record-files.js';
import { writeFileAtomic } from './atomic.js';
import { recordManaged, readLedger } from './managed.js';
import { detectStage, inferSourceGlobs, unreadRecords, projectName } from './detect.js';
import { parseArgs } from './args.js';




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
  const here = whereLabel(stamp);
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

// The commit adopt started from — the reconcile's baseline (IDEA-163). Git already keeps the before;
// what was missing is a fixed point to compare against. `dirty` = uncommitted work the baseline won't hold.
function gitBaseline(dir) {
  const run = (cmd) => execSync(cmd, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    const sha = run('git rev-parse HEAD');
    return { sha, dirty: run('git status --porcelain').split('\n').filter(Boolean).length };
  } catch { return null; }
}

// SECURITY — floor 1 of DEC-024, the bare `adopt --apply`: the safety floor and nothing else. Deny
// and ask rules for the AI (no hooks registered), the secrets pre-commit check, the `.gitignore`
// block, a stamp at `floor: 1` and a registry row. Every floor above stands on it. One plan, read
// by the preview and carried out by the apply, so what the preview promises is what lands.
const SECURITY_LAYER = 'L0-quickstart';
const SECRETS_SCRIPT = join('.claude', 'hooks', 'lib', 'commit-secrets.js');

function planSecurity(targetDir) {
  const settings = computeSettingsMerge(targetDir, [SECURITY_LAYER], { hooks: false });
  let before = {};
  try { before = JSON.parse(readFileSync(join(targetDir, settings.rel), 'utf8')); } catch { /* none yet */ }
  const perms = (o, k) => (o?.permissions?.[k] || []).length;
  const scriptTheirs = existsSync(join(targetDir, SECRETS_SCRIPT));
  const preCommit = installCommitGuard(targetDir, { dry: true, assumeScript: true });
  return {
    settings,
    deny: settings.merged ? perms(settings.merged, 'deny') - perms(before, 'deny') : 0,
    ask: settings.merged ? perms(settings.merged, 'ask') - perms(before, 'ask') : 0,
    settingsExisted: existsSync(join(targetDir, settings.rel)),
    scriptTheirs,
    preCommit,
    ignoreRules: gitignoreRulesToAdd([SECURITY_LAYER], targetDir),
    ignoreExisted: existsSync(join(targetDir, '.gitignore')),
  };
}

function securityLines(plan) {
  const out = [];
  if (plan.settings.unparseable) out.push(['.claude/settings.json', `can't be read, so left alone: ${plan.settings.unparseable}`]);
  else {
    out.push(['.claude/settings.json', `${plan.deny} deny and ${plan.ask} ask rule(s) for the AI${plan.settingsExisted ? '; your permissions and hooks kept' : ' (a new file)'}`]);
    for (const m of plan.settings.migrated || []) out.push(['', `${warn('−')} and removes ${m}`]);
  }
  out.push([SECRETS_SCRIPT.split(sep).join('/'), plan.scriptTheirs ? 'you already have one — yours is kept' : 'the secrets check, one file']);
  const g = plan.preCommit;
  out.push([g.state === 'hooks-path' ? g.path : '.git/hooks',
    g.state === 'would-install' ? 'a pre-commit hook that runs it before each commit (shared by every worktree of this repo)'
      : g.state === 'current' ? 'already there from BOSS'
        : g.state === 'theirs' ? 'left alone — you have a pre-commit hook; BOSS says how to call the check from it'
          : g.state === 'hooks-path' ? 'left alone — core.hooksPath points here; BOSS says how to call the check'
            : 'skipped — not a git repo']);
  out.push(['.gitignore', plan.ignoreRules.length ? `${plan.ignoreRules.length} rule(s) in a marked block — what stays on your machine${plan.ignoreExisted ? '' : ' (a new file)'}` : 'nothing to add — you have every rule']);
  out.push(['.boss/manifest.json', 'floor 1, Security — and the commit it started from']);
  out.push([BOSS_HOME === join(homedir(), '.boss') ? '~/.boss' : BOSS_HOME, 'this project registered, so `boss list` finds it']);
  return out;
}

function applySecurity({ targetDir, name, nameFrom, detected }) {
  const plan = planSecurity(targetDir);
  const baseline = gitBaseline(targetDir);
  if (!plan.scriptTheirs) {
    mkdirSync(dirname(join(targetDir, SECRETS_SCRIPT)), { recursive: true });
    cpSync(join(STAGES_DIR, SECURITY_LAYER, 'template', SECRETS_SCRIPT), join(targetDir, SECRETS_SCRIPT));
    recordManaged(targetDir, [{ rel: SECRETS_SCRIPT, text: readFileSync(join(targetDir, SECRETS_SCRIPT), 'utf8') }]);
  }
  if (plan.settings.unparseable) console.log(`  ${warn('!')} ${plan.settings.unparseable}`);
  for (const m of plan.settings.migrated || []) console.log(`  ${warn('−')} .claude/settings.json: removed ${m}`);
  if (plan.settings.changed) {
    mkdirSync(join(targetDir, '.claude'), { recursive: true });
    writeFileAtomic(join(targetDir, plan.settings.rel), JSON.stringify(plan.settings.merged, null, 2) + '\n');
  }
  const ignored = appendGitignoreBlock([SECURITY_LAYER], targetDir);
  const createdAt = new Date().toISOString();
  writeStamp(targetDir, {
    name, bossVersion: bossVersion(), floor: 1,
    installedLayers: [], agents: [], skills: [], hooks: [], loops: [],
    createdAt, adopted: true,
    ...(baseline ? { adoptedFrom: baseline.sha } : {}),
    // What was already the founder's among the files Security touches — a later climb reads this,
    // never its own collisions, to say what is theirs (pre-land review, IDEA-163).
    theirs: {
      files: [
        ...(plan.scriptTheirs ? [SECRETS_SCRIPT] : []),
        ...(plan.settingsExisted ? [plan.settings.rel] : []),
        ...(plan.ignoreExisted ? ['.gitignore'] : []),
      ].map((r) => r.split(sep).join('/')),
      skills: [],
    },
  });
  registerProject({ name, path: targetDir, floor: 1, bossVersion: bossVersion(), createdAt });

  console.log(`\n  ${ok('✦')} ${bold(name)} is on the Security floor ${dim(`(named from ${nameFrom}, BOSS ${bossVersion()})`)}`);
  console.log(`    ${plan.deny} deny and ${plan.ask} ask rule(s) for the AI · ${ignored.applied ? `.gitignore merged (${ignored.added.length} rule(s) added)` : '.gitignore already had them'}`);
  commitGuardLine(installCommitGuard(targetDir));
  console.log(`    ${dim('Nothing else: no skills, agents or docs, and your CLAUDE.md is untouched.')}`);
  console.log(`\n  ${bold('Going further')}`);
  const m = detected ? modeWord(detected.stage) : 'quickstart';
  console.log(`    boss adopt --mode ${m}     ${dim(`the whole of BOSS — this repo reads as ${m}. Shows the plan; --apply takes it.`)}`);
  console.log(`    boss remove             ${dim('previews taking Security back out')}\n`);
}

// The plan `boss adopt --apply` would carry out, computed by the same steps and written nowhere.
// It answers the three things someone with a working repo asks first: where do I stand, what
// do you add, and what of mine do you touch. Then what BOSS can't see, and how to take less.
function previewAdopt({ security, targetDir, name, nameFrom, stageId, manifest, chain, detected, shippedBefore, named }) {
  const rel = (f) => relative(targetDir, f).split(sep).join('/');
  const ledger = readLedger(targetDir);
  const planned = new Set();
  const kept = new Set();
  const deferred = [];
  for (const s of chain) {
    const m = readStageManifest(s);
    const hold = holdAtAdopt(m, targetDir, { shippedBefore });
    const r = planStageSafe(s, targetDir, { skipSkills: hold.skip });
    // A later mode meets an earlier one's file on disk in a real run; here it isn't, so dedupe.
    r.copied.map(rel).forEach((f) => planned.add(f));
    r.skipped.filter((f) => !ledger[relative(targetDir, f)]).map(rel).forEach((f) => kept.add(f));   // BOSS's own (from Security) aren't yours
    for (const [group, sk] of Object.entries(hold.deferred)) deferred.push({ s, group, sk, until: (m.earned || {})[group] });
  }
  planned.delete('claude-append.md'); // folded into CLAUDE.md, never left behind
  const files = [...planned];
  const under = (p) => files.filter((f) => f.startsWith(p));
  const names = (p, re) => [...new Set(under(p).map((f) => (re.exec(f.slice(p.length)) || [])[1]).filter(Boolean))];
  const skills = names('.claude/skills/', /^([^/]+)\//);
  const agents = names('.claude/agents/', /^([^/]+)\.md$/);
  const hooks = names('.claude/hooks/', /^([^/]+)\.js$/);
  const docs = under('docs/');
  const other = files.filter((f) => !/^(\.claude\/(skills|agents|hooks)\/|docs\/|\.boss\/)/.test(f));

  const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));
  const line = (label, text) => console.log(`    ${pad(label, 13)}${text}`);
  console.log(`\n  ${bold('boss adopt')} — what BOSS would do to ${bold(name)}. ${dim('Nothing is written yet.')}`);

  console.log(`\n  ${bold('Where you stand')}`);
  console.log(`    called ${bold(name)} ${dim(`— from ${nameFrom}`)}`);
  console.log(security ? `    reads as ${manifest.name} ${dim('— the mode the whole of BOSS would start at')}` : `    ${manifest.name} mode${named ? dim(' — the mode you named') : ''}`);
  if (detected) console.log(`    ${dim('read from your repo:')} ${detected.why.join(' · ')}`);
  if (detected && detected.beyond) console.log(`    ${warn('▸')} this looks past MVP — shipped and tested. ${dim("BOSS won't climb past MVP on its own; `boss unlock v1` later if you want it.")}`);
  const base = gitBaseline(targetDir);
  if (!base) console.log(`    ${warn('!')} not a git repo with a commit yet — there is nothing to compare against later. ${dim('Commit first.')}`);
  else if (base.dirty) console.log(`    ${warn('!')} ${base.dirty} uncommitted change(s). ${dim(`Commit first: adopt records the commit it starts from (${base.sha.slice(0, 7)}) as the before.`)}`);
  else console.log(`    ${dim(`Starts from ${base.sha.slice(0, 7)} — what you had, to compare against later.`)}`);
  if (!security) console.log(`    ${dim('The full read — what you built and what is missing — is /read-repo, once BOSS is in.')}`);

  if (security) {
    const sec = planSecurity(targetDir);
    const pad = (x, n) => x + ' '.repeat(Math.max(1, n - x.length));
    console.log(`\n  ${bold('What Security lays down')} ${dim('— the safety floor every floor of BOSS stands on')}`);
    const lines = securityLines(sec);
    const w = Math.max(...lines.map(([f]) => f.length)) + 2;
    for (const [f, what] of lines) console.log(`    ${pad(f, w)}${what}`);
    console.log(`    ${dim('Nothing else: no skills, agents or docs, and your CLAUDE.md is untouched.')}`);
    const m = detected ? modeWord(detected.stage) : 'quickstart';
    console.log(`\n  ${bold('Going further')}`);
    console.log(`    boss adopt --mode ${m}     ${dim(`the plan for the whole of BOSS — this repo reads as ${m}`)}`);
    console.log(`\n  ${bold('boss adopt --apply')} takes Security.\n`);
    return;
  }

  console.log(`\n  ${bold('What it adds')} ${dim(`— ${files.length} new file(s); none of yours is replaced`)}`);
  if (skills.length) line(`${skills.length} skills`, skillsLine(skills).replace(/ \(`boss map`\)$/, ''));
  if (agents.length) line(`${agents.length} agents`, agents.join(', '));
  if (hooks.length) line(`${hooks.length} hooks`, `${hooks.slice(0, 4).join(', ')}${hooks.length > 4 ? ` … +${hooks.length - 4}` : ''} ${dim('(scripts; only the registered ones run)')}`);
  if (docs.length) line('docs/', `${docs.length} file(s): ${docs.slice(0, 4).map((f) => f.slice(5)).join(', ')}${docs.length > 4 ? ' …' : ''}`);
  if (under('.boss/').length) line('.boss/', "BOSS's own state for this project (mode, config)");
  if (other.length) line('other', other.slice(0, 4).join(', ') + (other.length > 4 ? ' …' : ''));
  for (const d of deferred) console.log(`    ${dim(`· ${d.sk.length} held back ${describeUntil(d.until)}: ${d.sk.join(', ')}`)}`);

  console.log(`\n  ${bold('What it changes of yours')}`);
  const touched = [];
  for (const f of ['CLAUDE.md', 'AGENTS.md']) {
    if (existsSync(join(targetDir, f))) touched.push([f, 'a marked BOSS block added at the end; the rest untouched']);
  }
  if (existsSync(join(targetDir, '.gitignore'))) {
    const rules = gitignoreRulesToAdd(chain, targetDir);
    if (rules.length) touched.push(['.gitignore', `${rules.length} rule(s) added in a marked block — what stays on your machine`]);
  }
  const settings = computeSettingsMerge(targetDir, chain);
  if (settings?.unparseable) touched.push(['.claude/settings.json', `can't be read, so left alone: ${settings.unparseable}`]);
  else if (settings?.changed && existsSync(join(targetDir, settings.rel))) {
    let before = {};
    try { before = JSON.parse(readFileSync(join(targetDir, settings.rel), 'utf8')); } catch { /* counted from empty */ }
    const count = (o) => Object.values(o?.hooks || {}).reduce((n, a) => n + a.length, 0);
    const perms = (o) => ['deny', 'ask'].reduce((n, k) => n + (o?.permissions?.[k] || []).length, 0);
    const parts = [`${count(settings.merged) - count(before)} hook registration(s)`, `${perms(settings.merged) - perms(before)} deny/ask rule(s)`];
    const removes = settings.migrated || [];
    touched.push(['.claude/settings.json', `${parts.join(' and ')} added${removes.length ? '' : '; your permissions and hooks kept'}`]);
    // The one line the merge takes OUT, said by name — adopt used to make it silently (IDEA-163).
    for (const m of removes) touched.push(['', `${warn('−')} and removes ${m}`]);
  }
  if (existsSync(join(targetDir, '.git'))) touched.push(['.git/hooks', 'a pre-commit check for keys, unless you already have a pre-commit hook']);
  touched.push([BOSS_HOME === join(homedir(), '.boss') ? '~/.boss' : BOSS_HOME, 'this project registered, so `boss list` and `boss sync` find it']);
  for (const [f, what] of touched) line(f, what);
  for (const [f] of touched) kept.delete(f);   // merged into, and said so above — not "kept as-is"
  if (kept.size) console.log(`    ${dim(`kept as-is — you already have ${kept.size}: ${[...kept].slice(0, 3).join(', ')}${kept.size > 3 ? ' …' : ''}`)}`);

  const unread = unreadRecords(targetDir);
  // Records already where BOSS looks are found too — said, so silence never stands for "none".
  const home = new Map();
  for (const r of recordFiles(targetDir)) {
    const flat = r.rel.endsWith(`/${r.name}`);
    const dir = r.rel.slice(0, r.rel.lastIndexOf(`/${r.name}`));
    const k = flat ? `${dir}/${r.kind}-*.md` : `${dir}/${r.kind}-*/${r.rel.split('/').pop()}`;
    home.set(k, (home.get(k) || 0) + 1);
  }
  if (unread.length || home.size) {
    console.log(`\n  ${bold('Where you keep things')}`);
    for (const [k, n] of home) console.log(`    ${k} ${dim(`(${n}) — found where BOSS looks`)}`);
    for (const u of unread) console.log(`    ${u.pattern} ${dim(`(${u.count})`)}`);
    if (unread.length) {
      console.log(`    ${dim(`BOSS reads them where they are — the board, boss id and session start included — and`)}`);
      console.log(`    ${dim(`notes the folder${unread.length > 1 ? 's' : ''} in .boss/config.json (layout.records). Nothing is moved.`)}`);
    }
  }

  console.log(`\n  ${bold('Taking less')}`);
  if (stageId !== STAGE_ORDER[0]) console.log(`    boss adopt --mode ${modeWord(STAGE_ORDER[0])}     ${dim('the smallest set; grow later with `boss unlock`')}`);
  console.log(`    ${dim('Two hooks run from the start: the conscience (an occasional nudge) and reentry')}`);
  console.log(`    ${dim('(where you left off). Every other hook stays off until `boss hooks enable <name>`.')}`);
  console.log(`    boss remove             ${dim('afterwards, previews taking all of it back out')}`);
  console.log(`\n  ${bold('boss adopt --apply')}${stageId !== detected?.stage && named ? ` --mode ${modeWord(stageId)}` : ''} does it.\n`);
}

export function cmdUnlock(args) {
  const layer = args[0];
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  // Modes live only in the Boardroom (DEC-024). From Security, unlock laid Quickstart down and left the
  // project marked floor 1, past adopt's guard for the founder's own files (pre-land review, IDEA-163).
  if (stamp.floor === 1) return fail('this project is on the Security floor, which has no modes. `boss adopt --mode <quickstart|mvp>` shows the plan for the whole of BOSS; add --apply to take it.');
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

export function cmdNew(args) {
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
export function cmdAdopt(args) {
  const flags = parseArgs(args);
  const targetDir = process.cwd();
  // A project on the Security floor (DEC-024) climbs to the whole of BOSS through this door with
  // `--mode`; any other stamp means adopt has already run here.
  const prior = existsSync(join(targetDir, STAMP)) ? (() => { try { return readStamp(targetDir); } catch { return null; } })() : null;
  if (existsSync(join(targetDir, STAMP)) && !(prior && prior.floor === 1 && flags.mode)) {
    if (prior && prior.floor === 1) return fail('this project is on the Security floor. `boss adopt --mode <quickstart|mvp>` previews the whole of BOSS from here; add --apply to take it.');
    return fail('already a BOSS project (.boss/manifest.json here). Use `boss sync` to update or `boss unlock <mode>` to add a mode.');
  }
  // Read how far along the repo already is, unless the founder named a mode. Adopting a
  // half-built app at Quickstart hands it the idea-capture arc it finished months ago; the old
  // default did that every time and told the founder to figure the mode out themselves. The
  // detection is deliberately cheap and SHOWN (see src/detect.js) — it caps at MVP and never
  // auto-climbs to V1, because ceremony added is ceremony sync cannot yet remove.
  // Always read: `--mode` picks the mode, but whether the repo has already shipped still decides which
  // skills are held (IDEA-118) — skipping detection under --mode lost that.
  const detected = detectStage(targetDir);
  const stageId = flags.mode ? resolveStageId(flags.mode) : detected.stage;
  if (!stageId) return fail(`unknown mode '${flags.mode}'. options: ${STAGE_ORDER.map(modeWord).join(' | ')}`);
  let manifest;
  try { manifest = readStageManifest(stageId); }
  catch { return fail(`mode '${flags.mode}' isn't authored yet.`); }

  const { name, from: nameFrom } = projectName(targetDir);

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
  // DEC-024: a bare adopt takes Security — the safety floor and nothing else. `--mode` is the whole of
  // BOSS at that mode (modes live only in the Boardroom).
  const security = !flags.mode;
  // Preview first, like `boss sync` and `boss remove`: adopt was the one door that wrote on its
  // first run, into a repo that already had its own way of working (IDEA-163, EVID-006).
  if (security && flags.apply) return applySecurity({ targetDir, name, nameFrom, detected });
  if (!flags.apply) return previewAdopt({ security, targetDir, name, nameFrom, stageId, manifest, chain, detected, shippedBefore, named: Boolean(flags.mode) });
  const baseline = gitBaseline(targetDir);   // read before anything is written
  // The founder's files a template path collides with, read before anything is written. They are
  // theirs, never BOSS's: stamping them as managed recorded their bytes as an unedited BOSS file, and
  // the next `boss sync --apply` overwrote their own tester.md and smoke/SKILL.md (IDEA-163). A later
  // mode's collision with an earlier mode's fresh copy is BOSS's own file and is still stamped.
  // On a climb from Security, the files Security wrote are BOSS's; what was theirs then is in its stamp.
  const ledger = readLedger(targetDir);
  const securityWrote = new Set(prior && prior.floor === 1 ? [SECRETS_SCRIPT, join('.claude', 'settings.json'), '.gitignore'] : []);
  const priorTheirs = new Set(((prior && prior.theirs) || {}).files || []);
  const collided = [...new Set(chain.flatMap((s) => planStageSafe(s, targetDir).skipped))].map((f) => relative(targetDir, f))
    .filter((r) => !ledger[r] && (!securityWrote.has(r) || priorTheirs.has(r.split(sep).join('/'))));
  const skillsDir = join('.claude', 'skills');
  const theirSkills = collided.filter((r) => dirname(r) === skillsDir).map((r) => basename(r));
  const theirs = collided.filter((r) => dirname(r) !== skillsDir);   // native separators, like the ledger's join()
  const deferred = {};
  const heldSkills = [];
  for (const s of chain) {
    const m = readStageManifest(s);
    const hold = holdAtAdopt(m, targetDir, { shippedBefore });
    const r = applyStageSafe(s, targetDir, stageVars(name, s, m.name), { skipSkills: hold.skip });
    stampManaged(targetDir, [s], [...theirs, ...theirSkills.map((n) => join(skillsDir, n, 'SKILL.md'))]);
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
    createdAt: (prior && prior.createdAt) || new Date().toISOString(), adopted: true,
    ...(prior && prior.adoptedFrom ? { adoptedFrom: prior.adoptedFrom } : baseline ? { adoptedFrom: baseline.sha } : {}),
    floor: 5,   // the Boardroom: the whole of BOSS, where modes live (DEC-024)
    // What the repo already had where BOSS ships a file: theirs, so `boss sync` leaves it alone.
    // Always written, empty or not: an absent `theirs` is how sync knows a repo predates it.
    theirs: { files: theirs.map((r) => r.split(sep).join('/')), skills: theirSkills },
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
    // Where this repo keeps its records, as the preview said (IDEA-163). Absent when nothing was found.
    const records = [...new Set(unreadRecords(targetDir).map((u) => u.dir))];
    writeFileSync(cfgPath, JSON.stringify({
      // license: null — undecided, and BOSS doesn't decide it (DEC-011). See `boss new` above.
      github: 'ask', visibility: 'private', license: null, cohort: null,
      ...(sourceGlobs ? { sourceGlobs } : {}),
      ...(records.length ? { layout: { records } } : {}),
      // `shareUp` and `aiNative` dropped v0.252.0 — nothing read either. See `boss new` above.
    }, null, 2) + '\n');
  }

  // 4. Merge the conscience hook registration into settings.json (additive —
  //    preserves the founder's permissions + any hooks they already wired).
  const settings = computeSettingsMerge(targetDir, chain);
  if (settings?.unparseable) console.log(`  ${warn('!')} ${settings.unparseable}`);
  for (const m of settings?.migrated || []) console.log(`  ${warn('−')} .claude/settings.json: removed ${m}`);
  if (settings && settings.changed) {
    const dest = join(targetDir, settings.rel);
    mkdirSync(join(targetDir, '.claude'), { recursive: true });
    writeFileAtomic(dest, JSON.stringify(settings.merged, null, 2) + '\n');
  }

  // 5. Register as a normal (not self-hosted) project — rides the usual sync loop.
  registerProject({
    name, path: targetDir, stage: stageId, mode: manifest.name, floor: 5,
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
    theirs.length + theirSkills.length ? `${theirs.length + theirSkills.length} of yours kept as-is` : null,
    claudePreexisted ? 'CLAUDE.md preserved (BOSS block appended)' : null,
    ignored.applied ? `.gitignore merged (${ignored.added.length} rule(s) added)` : null,
  ].filter(Boolean);
  console.log(`    ${copied.filter((f) => basename(f) !== 'claude-append.md').length} file(s) added · nothing of yours overwritten${preserved.length ? ` · ${preserved.join(' · ')}` : ''}`);
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
