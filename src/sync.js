import {
  readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import {
  STAGES_DIR, bossVersion, resolveStageId,
} from './paths.js';
import { readStageManifest } from './scaffold.js';

// Resolve a possibly-stale layer id (e.g. an old "L0-sketch" pin) to the
// canonical current stage id by its level prefix. Returns undefined if it
// can't be mapped at all.
export function canonicalLayer(layerId) {
  return (
    resolveStageId(layerId) ||
    resolveStageId((String(layerId).match(/^l\d+/i) || [])[0]) ||
    undefined
  );
}

// Every file under a skill's directory EXCEPT its SKILL.md body, as paths relative
// to that directory. Recursive, so reference/deeper.md and templates/x/y.md both come
// back. Returns [] for a skill that is still a single file (the common case).
function walkSkillResources(skillDir, prefix = '') {
  if (!existsSync(skillDir)) return [];
  const out = [];
  for (const entry of readdirSync(skillDir, { withFileTypes: true })) {
    const rel = prefix ? join(prefix, entry.name) : entry.name;
    if (entry.isDirectory()) {
      out.push(...walkSkillResources(join(skillDir, entry.name), rel));
    } else if (entry.name !== 'SKILL.md') {
      out.push(rel);
    }
  }
  return out;
}

// The files BOSS manages for a stage: one .md per agent, one SKILL.md per skill,
// plus any resources the skill bundles alongside it.
// Each entry maps a source template file → its path inside the project.
function managedFiles(stageId, manifest) {
  const stageRoot = join(STAGES_DIR, stageId, 'template');
  const base = join(stageRoot, '.claude');
  const out = [];
  for (const a of manifest.agents || []) {
    out.push({
      kind: 'agent',
      name: a,
      src: join(base, 'agents', `${a}.md`),
      rel: join('.claude', 'agents', `${a}.md`),
    });
  }
  for (const s of manifest.skills || []) {
    out.push({
      kind: 'skill',
      name: s,
      src: join(base, 'skills', s, 'SKILL.md'),
      rel: join('.claude', 'skills', s, 'SKILL.md'),
    });
    // Bundled resources — anything else under the skill's directory (reference/,
    // templates/, examples/). Progressive disclosure means a skill is increasingly a
    // TREE, not one file: the SKILL.md body stays short and defers the rarely-needed
    // material to files loaded on demand. Those files are just as managed as the body,
    // and syncing only SKILL.md reproduces exactly the dormant-hook bug fixed below —
    // shipped once at scaffold, never updated again. Same fix, same reason.
    for (const rel of walkSkillResources(join(base, 'skills', s))) {
      out.push({
        kind: 'skill-resource',
        name: `${s}/${rel}`,
        src: join(base, 'skills', s, rel),
        rel: join('.claude', 'skills', s, rel),
      });
    }
  }
  for (const h of manifest.hooks || []) {
    // Hook scripts may be .js (v0.18.0+ Node-based) or .sh (legacy). Prefer .js
    // when present; fall back to .sh for backwards-compatibility with legacy stages.
    const jsSrc = join(base, 'hooks', `${h}.js`);
    const shSrc = join(base, 'hooks', `${h}.sh`);
    const ext = existsSync(jsSrc) ? 'js' : 'sh';
    out.push({
      kind: 'hook',
      name: h,
      src: ext === 'js' ? jsSrc : shSrc,
      rel: join('.claude', 'hooks', `${h}.${ext}`),
    });
  }
  // Dormant, opt-in hooks (secrets-guard, memory-cue, auto-log). They ship UNREGISTERED
  // by design — a PreToolUse/SubagentStop hook costs latency on every call, so the founder
  // turns one on deliberately by adding it to settings.json. But because they were in no
  // manifest list, `managedFiles` never saw them: they were written once at scaffold and
  // then NEVER updated again, including if a security fix landed in secrets-guard.js
  // (REVIEW-2026-07-28 §C7). `optionalHooks` syncs the FILE without registering it — the
  // registration stays the founder's on-switch, which is the whole point of dormant.
  for (const h of manifest.optionalHooks || []) {
    out.push({
      kind: 'optional-hook',
      name: h,
      src: join(base, 'hooks', `${h}.js`),
      rel: join('.claude', 'hooks', `${h}.js`),
    });
  }
  // Hook library files (helpers like loop-runtime, yaml parser) — non-manifest;
  // discovered by scanning the template's hooks/lib/ dir if present.
  const libDir = join(base, 'hooks', 'lib');
  if (existsSync(libDir)) {
    for (const f of readdirSync(libDir)) {
      if (!f.endsWith('.js')) continue;
      out.push({
        kind: 'hook-lib',
        name: f,
        src: join(libDir, f),
        rel: join('.claude', 'hooks', 'lib', f),
      });
    }
  }
  // Loop specs (IDEA-008, v0.18.0+) live in docs/loops/. Each is a managed
  // markdown file with YAML frontmatter that the runtime parses.
  for (const l of manifest.loops || []) {
    out.push({
      kind: 'loop',
      name: l,
      src: join(stageRoot, 'docs', 'loops', `${l}.md`),
      rel: join('docs', 'loops', `${l}.md`),
    });
  }
  return out;
}

// Hook *scripts* sync like any managed file (above). Their *registration* lives in
// settings.json — a user-editable file — so we merge it in additively instead of
// overwriting: BOSS owns the hook entries it ships, the user owns everything else
// (their own hooks, `allow`, `defaultMode`). Matched by command, so re-syncing is idempotent.
function templateHooks(stageId) {
  const f = join(STAGES_DIR, stageId, 'template', '.claude', 'settings.json');
  if (!existsSync(f)) return {};
  try { return JSON.parse(readFileSync(f, 'utf8')).hooks || {}; } catch { return {}; }
}

// The `permissions.deny` floor is the ONE permission key BOSS also merges (v0.141.0).
// Everything else under `permissions` stays user-owned.
//
// Why deny is the exception: a deny entry is *monotonically safe* — adding one can only
// ever restrict what the agent may do, never grant. So merging it additively can't break a
// project or widen its surface, which is exactly the property `allow` and `defaultMode`
// lack (both would silently grant). Before this, the floor shipped only via `boss new`, so
// a hardening fix could never reach a project already in the wild — a security floor that
// can't be updated is not a floor. Never removes an entry; the founder can always delete
// one and it will come back on the next sync, which is the intended nag.
function templateDenies(stageId) {
  const f = join(STAGES_DIR, stageId, 'template', '.claude', 'settings.json');
  if (!existsSync(f)) return [];
  try {
    return JSON.parse(readFileSync(f, 'utf8')).permissions?.deny || [];
  } catch { return []; }
}

function eventCommands(entries) {
  const cmds = new Set();
  for (const entry of entries || []) {
    for (const h of entry.hooks || []) if (h.command) cmds.add(h.command);
  }
  return cmds;
}

// One-time hook-command migrations: when BOSS refactors a hook (e.g. bash → node
// in v0.18.0), existing projects need their old command entries replaced, not
// merely supplemented (otherwise both old + new fire, and the old points at a
// file that's been removed). Each migration matches the old command and either
// rewrites or removes that entry. Keep the list short and dated — these are
// load-bearing for in-the-wild projects.
const HOOK_MIGRATIONS = [
  {
    // v0.18.0 — conscience hook moved from bash to node. The shipped file
    // (conscience.sh) is no longer in the template; leaving its registration
    // would mean Claude Code invokes a missing script. Drop the stale entry;
    // the additive merge then registers the new node command.
    matches: (cmd) => /conscience\.sh/i.test(cmd),
    action: 'drop',
    note: 'v0.18.0 migration: conscience hook moved from bash to node',
  },
];

function applyHookMigrations(merged) {
  if (!merged.hooks) return false;
  let changed = false;
  for (const event of Object.keys(merged.hooks)) {
    const entries = merged.hooks[event] || [];
    for (const entry of entries) {
      const before = entry.hooks ? entry.hooks.length : 0;
      entry.hooks = (entry.hooks || []).filter((h) => {
        for (const m of HOOK_MIGRATIONS) {
          if (m.matches(h.command || '')) return m.action !== 'drop';
        }
        return true;
      });
      if ((entry.hooks?.length || 0) !== before) changed = true;
    }
    // Remove empty entry containers (an entry with no hooks left).
    merged.hooks[event] = entries.filter((e) => (e.hooks || []).length > 0);
  }
  return changed;
}

// Merge BOSS-owned hook registrations from the installed layers into the project's
// settings.json. Returns { changed, merged, rel } — caller writes `merged` on apply.
export function computeSettingsMerge(projectDir, layers) {
  const rel = join('.claude', 'settings.json');
  const dest = join(projectDir, rel);
  let merged = {};
  if (existsSync(dest)) {
    try { merged = JSON.parse(readFileSync(dest, 'utf8')); } catch { merged = {}; }
  }
  let changed = false;
  // Apply hook-command migrations first (e.g. v0.18.0 bash→node) so stale entries
  // don't masquerade as already-present and block the new entry from being added.
  if (applyHookMigrations(merged)) changed = true;
  for (const stageId of layers) {
    for (const [event, tEntries] of Object.entries(templateHooks(stageId))) {
      merged.hooks ||= {};
      merged.hooks[event] ||= [];
      const present = eventCommands(merged.hooks[event]);
      for (const entry of tEntries) {
        const cmds = (entry.hooks || []).map((h) => h.command).filter(Boolean);
        if (cmds.length && cmds.every((c) => present.has(c))) continue; // already registered
        merged.hooks[event].push(JSON.parse(JSON.stringify(entry)));
        cmds.forEach((c) => present.add(c));
        changed = true;
      }
    }
    // The deny floor — additive only (see templateDenies above).
    const denies = templateDenies(stageId);
    if (denies.length) {
      merged.permissions ||= {};
      merged.permissions.deny ||= [];
      const have = new Set(merged.permissions.deny);
      for (const pattern of denies) {
        if (have.has(pattern)) continue;
        merged.permissions.deny.push(pattern);
        have.add(pattern);
        changed = true;
      }
    }
  }
  return { changed, merged, rel };
}

function substitute(body, vars) {
  for (const [k, v] of Object.entries(vars)) body = body.replaceAll(`{{${k}}}`, v);
  return body;
}

// A cheap, dependency-free change signal: how many lines differ between two
// versions (positional compare + length delta). Enough to flag a file as worth
// reviewing; the /boss-sync skill does the real side-by-side read.
function lineDelta(oldText, newText) {
  const a = oldText.split('\n');
  const b = newText.split('\n');
  let diff = Math.abs(a.length - b.length);
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

// Compute what a sync would do for a project, without writing anything.
// Returns { entries, layers, pin, current, drift }.
export function planSync(projectDir, stamp) {
  const current = bossVersion();
  const vars = {
    PROJECT_NAME: stamp.name,
    DATE: new Date().toISOString().slice(0, 10),
    BOSS_VERSION: current,
  };

  // Canonicalize + dedupe the installed layers, preserving order.
  const layers = [];
  for (const raw of stamp.installedLayers || [stamp.stage]) {
    const c = canonicalLayer(raw);
    if (c && !layers.includes(c)) layers.push(c);
  }

  const entries = [];
  for (const stageId of layers) {
    let manifest;
    try {
      manifest = readStageManifest(stageId);
    } catch {
      continue; // stage not authored in this BOSS version — skip
    }
    for (const f of managedFiles(stageId, manifest)) {
      if (!existsSync(f.src)) continue; // manifest lists it but template lacks it
      const next = substitute(readFileSync(f.src, 'utf8'), {
        ...vars, STAGE: stageId, MODE: manifest.name,
      });
      const dest = join(projectDir, f.rel);
      const exists = existsSync(dest);
      const cur = exists ? readFileSync(dest, 'utf8') : '';
      let status = 'ok';
      if (!exists) status = 'new';
      else if (cur !== next) status = 'changed';
      entries.push({ ...f, stageId, status, next, delta: exists ? lineDelta(cur, next) : 0 });
    }
  }

  return {
    entries,
    layers,
    pin: stamp.bossVersion,
    current,
    drift: stamp.bossVersion !== current,
    settings: computeSettingsMerge(projectDir, layers),
  };
}

// Apply a plan: write new/changed files and return the canonicalized stamp
// fields the caller should persist (it owns writeStamp + registry).
export function applySync(projectDir, plan, stamp) {
  const written = [];
  for (const e of plan.entries) {
    if (e.status === 'ok') continue;
    const dest = join(projectDir, e.rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, e.next);
    written.push(e);
  }

  // Merge BOSS-owned hook registrations into settings.json (additive — preserves
  // the user's permissions and their own hooks).
  if (plan.settings && plan.settings.changed) {
    const dest = join(projectDir, plan.settings.rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, JSON.stringify(plan.settings.merged, null, 2) + '\n');
    written.push({ kind: 'settings', name: 'settings.json', rel: plan.settings.rel });
  }

  // Reconcile the stamp to current canonical layers + the union of their
  // agents/skills/hooks/loops, and bump the pin. Mode/stage track the most-mature layer.
  const agents = new Set();
  const skills = new Set();
  const hooks = new Set();
  const loops = new Set();
  for (const stageId of plan.layers) {
    try {
      const m = readStageManifest(stageId);
      (m.agents || []).forEach((a) => agents.add(a));
      (m.skills || []).forEach((s) => skills.add(s));
      (m.hooks || []).forEach((h) => hooks.add(h));
      (m.loops || []).forEach((l) => loops.add(l));
    } catch { /* skip unauthored */ }
  }
  const top = plan.layers[plan.layers.length - 1];
  let topMode = stamp.mode;
  try { topMode = readStageManifest(top).name; } catch { /* keep */ }

  return {
    written,
    stamp: {
      ...stamp,
      stage: top,
      mode: topMode,
      installedLayers: plan.layers,
      agents: [...agents],
      skills: [...skills],
      hooks: [...hooks],
      loops: [...loops],
      bossVersion: plan.current,
    },
  };
}
