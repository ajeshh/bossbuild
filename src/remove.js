// `boss remove` — take BOSS back out of a project, and off the machine.
//
// WHY THIS EXISTS: adopting BOSS into an existing repo writes ~91 files. Nothing took them back
// out. `boss retire` sounds like the answer and isn't — it marks a *venture* as ended and says so:
// "the repo stays; only the status changed."
//
// "Non-destructive" answered *will you break my stuff?* It never answered *can I get out?* — and
// for a founder standing in a codebase they care about, the second is the bigger question.
// PRINCIPLE #5 is optionality by default: defaults preserve future choices rather than foreclosing
// them. Adoption being a one-way door in practice contradicted that, however reversible each
// individual write was. **A clean exit is what makes the entrance safe to try.**
//
// THE BOUNDARY IS DERIVED, NOT LISTED. The complete set of paths BOSS can ever write is the union
// of the installed stages' template trees. Anything at one of those paths is a candidate; anything
// else in the repo is the founder's and is never touched. That matters most for `docs/`, which
// after a week of use holds THEIR ideas and decisions right next to BOSS's scaffold — a naive
// `rm -rf docs` during a back-out would destroy the very work BOSS was there to help produce.
//
// Same three guards as sync's orphan removal (v0.155.0), for the same reason:
//   · only what BOSS wrote        · never what the founder edited        · consent is a separate act

import { readFileSync, writeFileSync, existsSync, readdirSync, rmSync, statSync, mkdirSync, cpSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { STAGES_DIR, BOSS_HOME } from './paths.js';
import { sameAsTemplate, readStageManifest } from './scaffold.js';

const MARKER = /<!-- boss:[^>]*? start -->[\s\S]*?<!-- boss:[^>]*? end -->\n?/g;

// Every relative path an installed stage's template can write into the project.
function templatePaths(layers) {
  const out = new Set();
  for (const stageId of layers) {
    const root = join(STAGES_DIR, stageId, 'template');
    if (!existsSync(root)) continue;
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const abs = join(dir, e.name);
        if (e.isDirectory()) { walk(abs); continue; }
        // claude-append.md is folded into CLAUDE.md at scaffold time and never lands as a file.
        if (e.name === 'claude-append.md') continue;
        out.add(relative(root, abs));
      }
    };
    walk(root);
  }
  return out;
}


// Which layer's template a project file came from, and the vars IT was rendered with.
//
// The stamp records the project's CURRENT stage. After `boss unlock mvp` that's `L1-mvp`/`MVP` —
// but L0's agents were written when it was `L0-quickstart`/`Quickstart`, so comparing them against
// an L1-rendered template can never match. Three untouched agents and CLAUDE.md survived every
// removal because of it. Per-file layer, not per-project.
function templateSource(layers, rel) {
  for (const stageId of [...layers].reverse()) {
    const p = join(STAGES_DIR, stageId, 'template', rel);
    if (existsSync(p)) {
      let mode = stageId;
      try { mode = readStageManifest(stageId).name; } catch { /* fall back to the id */ }
      return { path: p, stageId, mode };
    }
  }
  return null;
}

export function planRemove(projectDir, stamp) {
  // Render each template with the values IT was scaffolded with — see templateSource.
  const varsFor = (src) => ({ PROJECT_NAME: stamp.name, STAGE: src?.stageId || stamp.stage, MODE: src?.mode || stamp.mode });
  const layers = stamp.installedLayers || [stamp.stage];
  const paths = templatePaths(layers);

  const files = [];   // BOSS's, unedited → safe to delete
  const edited = [];  // BOSS's, changed by the founder → kept, and named
  const blocks = [];  // CLAUDE.md / AGENTS.md — excise BOSS's marked block, keep the file

  for (const rel of [...paths].sort()) {
    const abs = join(projectDir, rel);
    if (!existsSync(abs)) continue;

    // Never delete these outright: the founder's own rules may live alongside BOSS's block, and
    // BOSS may have appended rather than created. Excise the marked block instead; the file only
    // goes if nothing but whitespace is left, which is derivable rather than guessed.
    if (rel === 'CLAUDE.md' || rel === 'AGENTS.md') {
      const body = readFileSync(abs, 'utf8');
      const csrc = templateSource(layers, rel);
      if (MARKER.test(body)) {
        MARKER.lastIndex = 0;
        blocks.push({ rel, abs, vars: varsFor(csrc), tplRest: csrc ? readFileSync(csrc.path, 'utf8') : null });
      } else if (csrc && sameAsTemplate(body, readFileSync(csrc.path, 'utf8'), varsFor(csrc))) {
        files.push({ rel, kind: 'file' });
      } else {
        edited.push({ rel, kind: 'file' });
      }
      continue;
    }

    const src = templateSource(layers, rel);
    let changed = false;
    try { changed = src ? !sameAsTemplate(readFileSync(abs, 'utf8'), readFileSync(src.path, 'utf8'), varsFor(src)) : false; }
    catch { changed = false; }
    (changed ? edited : files).push({ rel, kind: 'file' });
  }

  // BOSS's own state dir. Mostly BOSS's — the manifest, config, the conscience's log.
  const bossDir = existsSync(join(projectDir, '.boss'));

  // ...but NOT all of it. `.boss/brain/*.md` is model-owned PROSE about the founder's venture, and
  // `boss brain` tells them in as many words: "This is yours to correct — edit .boss/brain/read.md
  // if the read is wrong." Deleting a thing you told someone was theirs, with no way to take it
  // with them, is the `exit-no-export` row of BOSS's own deceptive-pattern catalog — and it
  // contradicts this file's own opening claim that a clean exit is what makes the entrance safe.
  // So the prose is EXPORTED into `docs/`, which the boundary above already protects, and only
  // then is the state dir removed. Machine state goes; the reasoning trail stays.
  const brainProse = [];
  const brainDir = join(projectDir, '.boss', 'brain');
  if (existsSync(brainDir)) {
    try {
      for (const e of readdirSync(brainDir)) if (e.endsWith('.md')) brainProse.push(e);
    } catch { /* skip */ }
  }

  // Founder content that shares a directory with BOSS's scaffold. Counted so the preview can SAY
  // what survives — "your 12 files under docs/ stay" is the sentence that makes this safe to run.
  const kept = [];
  const countKept = (dir) => {
    const abs = join(projectDir, dir);
    if (!existsSync(abs)) return;
    const walk = (d) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) { walk(p); continue; }
        const rel = relative(projectDir, p);
        if (!paths.has(rel)) kept.push(rel);
      }
    };
    walk(abs);
  };
  countKept('docs');
  countKept(join('.claude', 'skills'));
  countKept(join('.claude', 'agents'));

  return { name: stamp.name, layers, files, edited, blocks, bossDir, brainProse, kept, settings: planSettings(projectDir, layers) };
}

// Un-merge only the hook registrations BOSS added. The founder's own hooks, their permissions and
// their defaultMode are untouched. The `deny` floor is deliberately LEFT: a deny entry can only
// ever restrict, so removing it would quietly widen what an agent may do on the way out — a
// parting gift nobody asked for.
function planSettings(projectDir, layers) {
  const rel = join('.claude', 'settings.json');
  const abs = join(projectDir, rel);
  if (!existsSync(abs)) return null;
  let cur;
  try { cur = JSON.parse(readFileSync(abs, 'utf8')); } catch { return null; }

  const bossCmds = new Set();
  for (const stageId of layers) {
    const t = join(STAGES_DIR, stageId, 'template', '.claude', 'settings.json');
    if (!existsSync(t)) continue;
    try {
      const hooks = JSON.parse(readFileSync(t, 'utf8')).hooks || {};
      for (const entries of Object.values(hooks)) {
        for (const entry of entries || []) for (const h of entry.hooks || []) if (h.command) bossCmds.add(h.command);
      }
    } catch { /* skip */ }
  }
  if (!bossCmds.size || !cur.hooks) return null;

  let removed = 0;
  const hooks = {};
  for (const [event, entries] of Object.entries(cur.hooks)) {
    const keptEntries = [];
    for (const entry of entries || []) {
      const keep = (entry.hooks || []).filter((h) => {
        const drop = bossCmds.has(h.command) || /\.claude[/\\]hooks[/\\]conscience\.js/.test(h.command || '');
        if (drop) removed++;
        return !drop;
      });
      if (keep.length) keptEntries.push({ ...entry, hooks: keep });
    }
    if (keptEntries.length) hooks[event] = keptEntries;
  }
  // Untouched since BOSS wrote it? Then it's BOSS's file, and removal takes it back.
  const tpl = layers.map((s) => join(STAGES_DIR, s, 'template', '.claude', 'settings.json'))
    .reverse().find((x) => existsSync(x));
  const untouched = tpl && sameAsTemplate(JSON.stringify(cur, null, 2), readFileSync(tpl, 'utf8'), {});
  if (untouched) return { rel, drop: true, removed };

  if (!removed) return null;
  const merged = { ...cur };
  if (Object.keys(hooks).length) merged.hooks = hooks; else delete merged.hooks;
  return { rel, merged, removed };
}

// Copy `.boss/` aside before removal deletes it — and NOT into the project.
//
// WHY THIS EXISTS: the preview's own reassurance was false. `boss remove` printed *"commit first
// if you want a one-command undo — then `git checkout .` restores everything"*, and `git checkout .`
// restores none of `.boss/conscience-log.jsonl`, `cost-log.jsonl`, `trace.jsonl`,
// `brain/relationship.md`, `backups/` or `board.html` — because the `.gitignore` BOSS itself ships
// tells git to forget exactly those. The undo BOSS offered on the way out did not cover the files
// BOSS had told git not to see. On 2026-08-21 that cost this repo its own conscience log,
// permanently, when an assistant ran `--apply` in the wrong directory.
//
// It is the same asymmetry `sync --force` closed in v0.197.0, one function over: sync grew a
// backup before it overwrote, and remove kept deleting without one.
//
// WHY THE MACHINE DIR AND NOT `.boss-removed-…/` IN THE PROJECT: `brain/relationship.md` is
// per-person conscience state that [[DEC-001]] says never travels to a cofounder, and BOSS ships a
// `.gitignore` rule saying so. A copy parked in the project is NOT covered by that rule, so the
// first `git add -A` after an exit would commit the one file BOSS promised would stay local —
// a safety net that leaks the thing it was saving. `~/.boss/` is per-person by construction, and
// `boss remove --global` already walks and NAMES every file under it, so the parked copy shows up
// in the other exit's preview without a line of new code.
export function backupStateDir(projectDir, name, { root = BOSS_HOME, when } = {}) {
  const src = join(projectDir, '.boss');
  if (!existsSync(src)) return null;
  const stamp = (when || new Date().toISOString()).slice(0, 19).replace(/[:T]/g, '-');
  const slug = String(name || 'project').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'project';
  const dir = join(root, 'removed', `${slug}-${stamp}`);
  // A copy inside the directory about to be deleted is not a copy. Only reachable when the
  // project IS the home dir, but backupManaged's rule is absolute: a backup that did not
  // survive must never be reported as done.
  if (dir === src || dir.startsWith(src + sep)) return null;
  try {
    mkdirSync(dir, { recursive: true });
    cpSync(src, dir, { recursive: true });
  } catch {
    return null;   // a backup that fails must never be reported as done — backupManaged's rule
  }
  let files = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(d, e.name)); else files++;
    }
  };
  try { walk(dir); } catch { /* counted best-effort; the copy is what matters */ }
  return files ? { dir, files } : null;
}

export function applyRemove(projectDir, plan, opts = {}) {
  const done = [];
  for (const f of plan.files) {
    try { rmSync(join(projectDir, f.rel), { force: true }); done.push(f.rel); } catch { /* report as not-done */ }
  }
  for (const b of plan.blocks) {
    try {
      const body = readFileSync(b.abs, 'utf8').replace(MARKER, '');
      // Only BOSS's block was in there — nothing of the founder's to preserve.
      const rest = body.replace(/\n{3,}/g, '\n\n');
      // Nothing left, or what IS left is still BOSS's own template — a `boss new` project that
      // later unlocked a mode has L0's whole CLAUDE.md plus L1's marked block, so excising the
      // block alone left the template behind as a stray file.
      if (!rest.trim() || (b.tplRest && sameAsTemplate(rest, b.tplRest, b.vars))) {
        rmSync(b.abs, { force: true }); done.push(`${b.rel} (removed — it was all BOSS)`);
      } else { writeFileSync(b.abs, rest); done.push(`${b.rel} (BOSS block excised, your content kept)`); }
    } catch { /* skip */ }
  }
  if (plan.settings) {
    const abs = join(projectDir, plan.settings.rel);
    try {
      if (plan.settings.drop) { rmSync(abs, { force: true }); done.push(`${plan.settings.rel} (removed — BOSS wrote it and you never changed it)`); }
      else {
        writeFileSync(abs, JSON.stringify(plan.settings.merged, null, 2) + '\n');
        done.push(`${plan.settings.rel} (${plan.settings.removed} BOSS hook registration(s) removed)`);
      }
    } catch { /* skip */ }
  }
  if (plan.brainProse && plan.brainProse.length) {
    try {
      const parts = [
        '# Venture brain — exported on the way out',
        '',
        "BOSS wrote this read of your venture over time, and it was always yours to correct. It is",
        'plain markdown and depends on nothing — keep it, edit it, or delete it.',
        '',
      ];
      for (const name of plan.brainProse) {
        parts.push(`## ${name}`, '');
        try { parts.push(readFileSync(join(projectDir, '.boss', 'brain', name), 'utf8').trim(), ''); }
        catch { /* skip an unreadable one rather than lose the rest */ }
      }
      const out = join(projectDir, 'docs', 'venture-brain.md');
      if (existsSync(join(projectDir, 'docs'))) {
        writeFileSync(out, parts.join('\n') + '\n');
        done.push(`docs/venture-brain.md (exported — ${plan.brainProse.length} brain file(s) kept as plain markdown)`);
      }
    } catch { /* an export that fails must never block the removal */ }
  }
  if (plan.bossDir) {
    // Backup FIRST, and record it on the plan so the caller can name the path it printed a
    // promise about. A failed copy returns null and the removal still proceeds — refusing to
    // exit because a safety net failed would trap the founder in the tool.
    plan.backup = backupStateDir(projectDir, plan.name, opts);
    try { rmSync(join(projectDir, '.boss'), { recursive: true, force: true }); done.push('.boss/'); } catch { /* skip */ }
  }
  // Prune directories BOSS emptied — but never one that still holds the founder's files.
  for (const dir of ['.claude/hooks/lib', '.claude/hooks', '.claude/skills', '.claude/agents', '.claude', 'docs/loops', 'docs/evidence']) {
    const abs = join(projectDir, dir);
    try {
      if (existsSync(abs) && statSync(abs).isDirectory() && readdirSync(abs).length === 0) rmSync(abs, { recursive: true, force: true });
    } catch { /* skip */ }
  }
  return done;
}

// --- the machine half ---------------------------------------------------------------------
// The other exit, and it's a different one: `boss remove` takes BOSS out of a PROJECT; this takes
// it off the MACHINE. Worth stating plainly because the two are easy to confuse, and because the
// reassuring half is non-obvious — the conscience hook runs
// `node "$CLAUDE_PROJECT_DIR/.claude/hooks/conscience.js"` and imports only from `./lib/`, so
// uninstalling the CLI does NOT break projects that still have BOSS in them. You lose the `boss`
// verbs; the in-project experience keeps working.
export function machineState() {
  const dir = BOSS_HOME;
  if (!existsSync(dir)) return { dir, files: [] };
  const files = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p); else files.push(relative(dir, p));
    }
  };
  walk(dir);
  return { dir, files };
}

export function removeMachineState() {
  const { dir } = machineState();
  try { rmSync(dir, { recursive: true, force: true }); return true; } catch { return false; }
}

export { sep };
