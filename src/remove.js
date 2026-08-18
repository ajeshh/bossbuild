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

import { readFileSync, writeFileSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { homedir } from 'node:os';
import { STAGES_DIR } from './paths.js';
import { sameAsTemplate } from './scaffold.js';

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


function templateSource(layers, rel) {
  for (const stageId of [...layers].reverse()) {
    const p = join(STAGES_DIR, stageId, 'template', rel);
    if (existsSync(p)) return p;
  }
  return null;
}

export function planRemove(projectDir, stamp) {
  const pname = stamp.name;
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
      if (MARKER.test(body)) { MARKER.lastIndex = 0; blocks.push({ rel, abs }); }
      else if (sameAsTemplate(body, readFileSync(templateSource(layers, rel) || abs, 'utf8'), pname)) {
        files.push({ rel, kind: 'file' });
      } else {
        edited.push({ rel, kind: 'file' });
      }
      continue;
    }

    const src = templateSource(layers, rel);
    let changed = false;
    try { changed = src ? !sameAsTemplate(readFileSync(abs, 'utf8'), readFileSync(src, 'utf8'), pname) : false; }
    catch { changed = false; }
    (changed ? edited : files).push({ rel, kind: 'file' });
  }

  // BOSS's own state dir. Always BOSS's — the manifest, config, and the conscience's private notes.
  const bossDir = existsSync(join(projectDir, '.boss'));

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

  return { layers, files, edited, blocks, bossDir, kept, settings: planSettings(projectDir, layers) };
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
  if (!removed) return null;
  const merged = { ...cur };
  if (Object.keys(hooks).length) merged.hooks = hooks; else delete merged.hooks;
  return { rel, merged, removed };
}

export function applyRemove(projectDir, plan) {
  const done = [];
  for (const f of plan.files) {
    try { rmSync(join(projectDir, f.rel), { force: true }); done.push(f.rel); } catch { /* report as not-done */ }
  }
  for (const b of plan.blocks) {
    try {
      const body = readFileSync(b.abs, 'utf8').replace(MARKER, '');
      // Only BOSS's block was in there — nothing of the founder's to preserve.
      if (!body.trim()) { rmSync(b.abs, { force: true }); done.push(`${b.rel} (removed — it was all BOSS)`); }
      else { writeFileSync(b.abs, body.replace(/\n{3,}/g, '\n\n')); done.push(`${b.rel} (BOSS block excised, your content kept)`); }
    } catch { /* skip */ }
  }
  if (plan.settings) {
    try {
      writeFileSync(join(projectDir, plan.settings.rel), JSON.stringify(plan.settings.merged, null, 2) + '\n');
      done.push(`${plan.settings.rel} (${plan.settings.removed} BOSS hook registration(s) removed)`);
    } catch { /* skip */ }
  }
  if (plan.bossDir) {
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
  const dir = join(homedir(), '.boss');
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
