import {
  readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import {
  STAGES_DIR, bossVersion, resolveStageId,
} from './paths.js';
import { readStageManifest, sameAsTemplate } from './scaffold.js';
import { readSupersedes, findSupersede } from './supersede.js';
import { stillDeferred, newlyEarned, markLaidDown } from './earned.js';
import { readLadder, assess } from './ladder.js';
import { provenance, recordManaged, backupManaged, readLedger } from './managed.js';
import { isoDay } from './clock.js';

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
function managedFiles(stageId, manifest, projectDir = null) {
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
  // BOSS-owned rules (IDEA-124). `.claude/rules/` also holds the founder's own — `your-app-code.md`
  // is a template they rewrite — so only rules a manifest names are BOSS's; the rest are theirs and
  // never touched. Without this list a rule BOSS ships reached new projects and never existing ones.
  for (const r of manifest.rules || []) {
    out.push({
      kind: 'rule',
      name: r,
      src: join(base, 'rules', `${r}.md`),
      rel: join('.claude', 'rules', `${r}.md`),
    });
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
  // Since `boss hooks enable` (src/hooks.js) an opt-in hook lands only when asked, so one that is
  // not on disk is not managed: sync neither proposes it as `new` nor keeps it. One that IS on
  // disk — enabled, or laid down by a pre-2026-09 scaffold — is kept current exactly as before.
  for (const h of manifest.optionalHooks || []) {
    if (projectDir && !existsSync(join(projectDir, '.claude', 'hooks', `${h}.js`))) continue;
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
  // The hooks' own package.json pins `"type": "module"`. Without it Node takes the module type from
  // the founder's nearest package.json, and `"type": "commonjs"` (npm init's default) made every
  // hook exit 1 at import — the conscience silently dead on every prompt (IDEA-121). Scaffold copies
  // it; this line is what reaches a project scaffolded before it existed.
  const hooksPkg = join(base, 'hooks', 'package.json');
  if (existsSync(hooksPkg)) {
    out.push({ kind: 'hook-lib', name: 'package.json', src: hooksPkg, rel: join('.claude', 'hooks', 'package.json') });
  }
  // Loop specs live in .boss/loops/ (they are the hook's data; docs/ is the founder's). Each is
  // a managed markdown file with YAML frontmatter that the runtime parses.
  for (const l of manifest.loops || []) {
    out.push({
      kind: 'loop',
      name: l,
      src: join(stageRoot, '.boss', 'loops', `${l}.md`),
      rel: join('.boss', 'loops', `${l}.md`),
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

// A hook's identity is `command` PLUS `args`. Since v0.299.0 the shipped hooks are exec form
// (`command: "node"`, the script path in `args`) — keying on `command` alone would make every
// BOSS hook look like every other, and an old shell-form entry would never match the new one.
export function hookKey(h) {
  return [h && h.command, ...((h && h.args) || [])].filter(Boolean).join(' ');
}

function eventCommands(entries) {
  const cmds = new Set();
  for (const entry of entries || []) {
    for (const h of entry.hooks || []) if (hookKey(h)) cmds.add(hookKey(h));
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
  {
    // v0.299.0 — shell form → exec form. `node "$CLAUDE_PROJECT_DIR/…"` is POSIX syntax; on native
    // Windows without Git Bash, Claude Code runs hooks through PowerShell, where that variable is
    // undefined and the conscience silently never fires. Exec form (`args`, no shell) is
    // substituted by Claude Code itself on every OS. Drop the shell-form entry; the additive merge
    // registers the exec-form one. Matches ONLY an entry with no `args` — an exec-form entry that
    // happens to mention the same path is the new form and stays.
    matches: (cmd, h) => !(h && h.args) && /\$CLAUDE_PROJECT_DIR\/\.claude\/hooks\/(conscience|reentry)\.js/.test(cmd),
    action: 'drop',
    note: 'v0.299.0 migration: hooks moved to exec form (runs under PowerShell on Windows too)',
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
          if (m.matches(h.command || '', h)) return m.action !== 'drop';
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
  const migrated = [];
  // Apply hook-command migrations first (e.g. v0.18.0 bash→node) so stale entries
  // don't masquerade as already-present and block the new entry from being added.
  if (applyHookMigrations(merged)) changed = true;
  // v0.218.0 — the ONE permission key BOSS will remove, and only at one exact value.
  //
  // BOSS shipped `"defaultMode": "auto"` in the L0 template from v0.141.0. From Claude Code
  // v2.1.142, `auto` does not take effect in a PROJECT settings file at all — and its presence
  // makes the host fall back to its built-in default INSTEAD of reading the founder's own
  // `~/.claude/settings.json`. So the line BOSS wrote does nothing it claims and silently
  // outranks a standing choice the founder made for their whole machine.
  //
  // Every other value (`plan`, `acceptEdits`, `default`) IS honored from a project file, and is
  // the founder's to keep — so the predicate is exact-match on `auto`, never a blanket delete.
  // Removing it can only move behavior TOWARD what they actually configured, which is the same
  // monotonic property that makes the deny floor safe to merge. Reported, never silent.
  if (merged.permissions?.defaultMode === 'auto') {
    delete merged.permissions.defaultMode;
    migrated.push('defaultMode: "auto" (inert in a project file since Claude Code v2.1.142, and it was overriding your own ~/.claude setting)');
    changed = true;
  }
  for (const stageId of layers) {
    for (const [event, tEntries] of Object.entries(templateHooks(stageId))) {
      merged.hooks ||= {};
      merged.hooks[event] ||= [];
      const present = eventCommands(merged.hooks[event]);
      for (const entry of tEntries) {
        const cmds = (entry.hooks || []).map(hookKey).filter(Boolean);
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
  return { changed, merged, rel, migrated };
}

function substitute(body, vars) {
  for (const [k, v] of Object.entries(vars)) body = body.replaceAll(`{{${k}}}`, v);
  return body;
}

// A cheap, dependency-free change signal: how many lines differ between two
// versions (positional compare + length delta). Enough to flag a file as worth
// reviewing; the /boss-sync skill does the real side-by-side read.
function lineDelta(oldText, newText) {
  const a = oldText.split(/\r?\n/);
  const b = newText.split(/\r?\n/);
  let diff = Math.abs(a.length - b.length);
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

// Compute what a sync would do for a project, without writing anything.
// Returns { entries, layers, pin, current, drift }.
// Orphans — things BOSS installed into this project and no longer ships.
//
// THE SAFETY BOUNDARY, and it is the whole design: an orphan candidate must have been STAMPED by
// BOSS. `.boss/manifest.json` is the install ledger — if a name isn't in it, BOSS never put it
// there, which means it is the founder's own skill or agent and is none of sync's business. Walking
// `.claude/skills/` and diffing against the manifest would be the obvious implementation and it
// would eventually propose deleting a founder's work. It is not worth the convenience.
//
// Two further guards, because a wrong removal costs trust that a wrong ADD never does:
//   - `edited: true` when the file on disk differs from what BOSS last shipped. A founder who
//     changed a skill has adopted it; that gets said out loud before anything is proposed.
//   - `present: false` when they already deleted it themselves. Report it as resolved, not as work.
function planOrphans(projectDir, stamp, layers) {
  const live = { agent: new Set(), skill: new Set(), hook: new Set() };
  for (const stageId of layers) {
    let m;
    try { m = readStageManifest(stageId); } catch { continue; }
    (m.agents || []).forEach((a) => live.agent.add(a));
    (m.skills || []).forEach((s) => live.skill.add(s));
    [...(m.hooks || []), ...(m.optionalHooks || [])].forEach((h) => live.hook.add(h));
  }

  const ledger = readSupersedes();
  const out = [];
  // Loops moved from docs/loops/ to .boss/loops/. A copy still at the old path is read by the
  // runtime only when the new one is absent, so once sync has laid the new set down it is dead
  // weight in the founder's docs/ — reported here, removed only on --remove like every orphan.
  for (const l of stamp.loops || []) {
    const rel = join('docs', 'loops', `${l}.md`);
    const abs = join(projectDir, rel);
    if (!existsSync(abs)) continue;
    // Edited if it differs from what BOSS ships for that loop (same text, either path); a founder
    // who tuned a `min:` there keeps it — reported, never removed.
    let edited = null;
    for (const stageId of layers) {
      const src = join(STAGES_DIR, stageId, 'template', '.boss', 'loops', `${l}.md`);
      if (!existsSync(src)) continue;
      try { edited = readFileSync(abs, 'utf8') !== readFileSync(src, 'utf8'); } catch { edited = null; }
      break;
    }
    out.push({ kind: 'loop', name: l, rel, present: true, edited, moved: join('.boss', 'loops', `${l}.md`) });
  }
  const consider = (kind, names) => {
    for (const name of names || []) {
      if (live[kind].has(name)) continue;
      const rel = kind === 'agent' ? join('.claude', 'agents', `${name}.md`)
        : kind === 'skill' ? join('.claude', 'skills', name)
          : join('.claude', 'hooks', `${name}.js`);
      const abs = join(projectDir, rel);
      const present = existsSync(abs);
      out.push({
        kind,
        name,
        rel,
        present,
        // Tri-state on purpose: true / false / null-for-unknowable. See orphanEdited.
        edited: present
          ? orphanEdited(projectDir, kind, name, layers,
            { PROJECT_NAME: stamp.name, STAGE: stamp.stage, MODE: stamp.mode })
          : false,
        supersede: findSupersede(kind, name, ledger),
      });
    }
  };
  consider('agent', stamp.agents);
  consider('skill', stamp.skills);
  consider('hook', stamp.hooks);
  return out;
}

// Did the founder change this after BOSS shipped it? THREE answers, and the third is the honest one:
//   true   — differs from the template BOSS still has. Theirs now; never removed.
//   false  — matches. Safe to remove on request.
//   null   — UNKNOWABLE. BOSS deleted the template, so there is nothing left to compare against.
//
// That third case is not an edge case, it is the NORMAL case for a real retirement: the release
// that stops shipping a skill also deletes its template, so by the time a founder syncs, the
// comparison basis is gone. Returning `false` there — which the first cut did — would quietly
// assert "you didn't change this" at exactly the moment BOSS cannot know, and then delete
// a customisation on `--remove`. Unknown is reported as unknown and shown to the founder before
// they consent. (The durable fix is a content hash in the stamp at write time; noted, not built —
// it changes the stamp format, and consent plus an honest "I can't tell" covers the risk today.)
export function orphanEdited(projectDir, kind, name, layers, vars = {}) {
  const rel = kind === 'agent' ? join('.claude', 'agents', `${name}.md`)
    : kind === 'skill' ? join('.claude', 'skills', name, 'SKILL.md')
      : join('.claude', 'hooks', `${name}.js`);
  const abs = join(projectDir, rel);
  if (!existsSync(abs)) return null;
  for (const stageId of layers) {
    const base = join(STAGES_DIR, stageId, 'template', '.claude');
    const src = kind === 'agent' ? join(base, 'agents', `${name}.md`)
      : kind === 'skill' ? join(base, 'skills', name, 'SKILL.md')
        : join(base, 'hooks', `${name}.js`);
    if (!existsSync(src)) continue;
    try {
      // Shared with `boss remove` (src/scaffold.js). NOTE `vars`, not `name`: the first cut passed
      // the ORPHAN's name where the PROJECT's belonged — wrong value, and invisible because the
      // comparison still mostly worked.
      return !sameAsTemplate(readFileSync(abs, 'utf8'), readFileSync(src, 'utf8'), vars);
    } catch { return null; }
  }
  return null;
}

// Stamp the provenance ledger for a fresh install (scaffold / unlock). Derived from the SAME
// `managedFiles()` the plan walks, deliberately: two lists of "what BOSS manages" would drift,
// and a ledger that disagrees with the planner is worse than none — it would confidently report
// "you edited this" about a file BOSS never wrote.
// ── THE CLAUDE.md BLOCK ─────────────────────────────────────────────────────────────────────
// Every rung past Quickstart appends its rules to the project's CLAUDE.md between
// `<!-- boss:<rung> start/end -->` markers, and that block was written ONCE, at unlock, and never
// again — the one always-loaded BOSS text a founder's session reads on every turn, and the one
// thing sync could not update (IDEA-121). A trim or a fixed rule reached new projects only.
//
// The block is a REGION of a file the founder owns, so it gets the file rules at region scope:
// same ledger (key `CLAUDE.md#boss:<rung>`), same tri-state, same backup, same --keep-mine and
// --force. A block the founder deleted is never re-added: absence is an answer, not drift.
const CLAUDE_FILE = 'CLAUDE.md';
const blockKey = (stageId) => `${CLAUDE_FILE}#boss:${stageId}`;

function findBlock(text, stageId) {
  const start = `<!-- boss:${stageId} start -->\n`;
  const end = `\n<!-- boss:${stageId} end -->`;
  const i = text.indexOf(start);
  if (i < 0) return null;
  const j = text.indexOf(end, i + start.length);
  if (j < 0) return null;
  return { from: i + start.length, to: j, body: text.slice(i + start.length, j) };
}

// The block BOSS would write for this rung today, or null when the rung carries none.
function templateBlock(stageId, vars) {
  const f = join(STAGES_DIR, stageId, 'template', 'claude-append.md');
  if (!existsSync(f)) return null;
  return substitute(readFileSync(f, 'utf8'), vars).trim();
}

function planClaudeBlock(projectDir, stageId, vars) {
  const body = templateBlock(stageId, vars);
  if (body === null) return null;
  const dest = join(projectDir, CLAUDE_FILE);
  if (!existsSync(dest)) return null;
  const cur = readFileSync(dest, 'utf8');
  const b = findBlock(cur, stageId);
  if (!b) return null;
  const status = b.body.trim() === body ? 'ok' : 'changed';
  return {
    kind: 'claude-block',
    name: stageId,
    rel: CLAUDE_FILE,
    ledgerKey: blockKey(stageId),
    body,
    status,
    edited: status === 'changed' ? provenance(projectDir, blockKey(stageId), b.body.trim()) : false,
    delta: status === 'changed' ? lineDelta(b.body.trim(), body) : 0,
  };
}

// Rewrite one block in place, reading the file fresh so two blocks in one file cannot undo each other.
function writeClaudeBlock(projectDir, stageId, body) {
  const dest = join(projectDir, CLAUDE_FILE);
  const cur = readFileSync(dest, 'utf8');
  const b = findBlock(cur, stageId);
  if (!b) return false;
  writeFileSync(dest, cur.slice(0, b.from) + body + cur.slice(b.to));
  return true;
}

// Record every block on disk that is exactly what BOSS would write now. Only those: stamping a
// block the founder shaped would report it as BOSS's next time and hand it to the overwrite.
function stampClaudeBlocks(projectDir, layers, exclude = new Set()) {
  const dest = join(projectDir, CLAUDE_FILE);
  if (!existsSync(dest)) return;
  const text = readFileSync(dest, 'utf8');
  const entries = [];
  for (const stageId of layers || []) {
    if (exclude.has(blockKey(stageId))) continue;
    let manifest;
    try { manifest = readStageManifest(stageId); } catch { continue; }
    const body = templateBlock(stageId, { STAGE: stageId, MODE: manifest.name });
    const b = findBlock(text, stageId);
    if (body !== null && b && b.body.trim() === body) entries.push({ rel: blockKey(stageId), text: body });
  }
  recordManaged(projectDir, entries);
}

export function stampManaged(projectDir, layers, exclude = []) {
  const skip = new Set(exclude);
  const entries = [];
  for (const stageId of layers || []) {
    let manifest;
    try { manifest = readStageManifest(stageId); } catch { continue; }
    for (const f of managedFiles(stageId, manifest, projectDir)) {
      // A file BOSS deliberately did NOT write — because the founder had edited it — must never
      // be stamped: recording their bytes as BOSS's would report the file as untouched next run
      // and hand the overwrite straight back to the bug this ledger exists to close.
      if (skip.has(f.rel)) continue;
      const abs = join(projectDir, f.rel);
      if (!existsSync(abs)) continue;
      try { entries.push({ rel: f.rel, text: readFileSync(abs, 'utf8') }); } catch { /* skip */ }
    }
  }
  recordManaged(projectDir, entries);
  stampClaudeBlocks(projectDir, layers, skip);
  return entries.length;
}

export function planSync(projectDir, stamp) {
  const current = bossVersion();
  const vars = {
    PROJECT_NAME: stamp.name,
    DATE: isoDay(),
    BOSS_VERSION: current,
  };

  // Canonicalize + dedupe the installed layers, preserving order.
  const layers = [];
  for (const raw of stamp.installedLayers || [stamp.stage]) {
    const c = canonicalLayer(raw);
    if (c && !layers.includes(c)) layers.push(c);
  }

  const ladder = readLadder();
  // Skills a rung is holding back until earned (src/earned.js): not part of this plan while the
  // predicate is false — they would show as `new` every sync and be laid down before their time.
  // Once the predicate holds they ARE `new`, and the ordinary path installs them.
  const held = stillDeferred(projectDir, stamp);
  // A file BOSS wrote (the ledger never forgets an entry) that is no longer on disk was removed
  // by the founder. For an agent or a rule that is a decision — they split `coder`, or retired
  // `designer` — and planning it as `new` put it straight back on the next --apply, so "delete
  // the agent you no longer need" could not stick (IDEA-124). `declined` is reported, never
  // written; `--force` restores it. Kept to agents and rules: a skill is a tree, and a hook is
  // wired into settings.json, so a missing one of those is more likely damage than a decision.
  const ledger = readLedger(projectDir);
  const DECLINABLE = new Set(['agent', 'rule']);
  const entries = [];
  for (const stageId of layers) {
    let manifest;
    try {
      manifest = readStageManifest(stageId);
    } catch {
      continue; // stage not authored in this BOSS version — skip
    }
    for (const f of managedFiles(stageId, manifest, projectDir)) {
      if (!existsSync(f.src)) continue; // manifest lists it but template lacks it
      if ((f.kind === 'skill' || f.kind === 'skill-resource') && held.has(f.name.split('/')[0])) continue;
      const next = substitute(readFileSync(f.src, 'utf8'), {
        ...vars, STAGE: stageId, MODE: manifest.name,
      });
      const dest = join(projectDir, f.rel);
      const exists = existsSync(dest);
      const cur = exists ? readFileSync(dest, 'utf8') : '';
      let status = 'ok';
      if (!exists) status = (DECLINABLE.has(f.kind) && ledger[f.rel]) ? 'declined' : 'new';
      else if (cur !== next) status = 'changed';
      // Did the founder shape this, or did BOSS move on? A `changed` status alone cannot say —
      // it is true in both cases and means opposite things. `null` where BOSS has no record.
      const edited = status === 'changed' ? provenance(projectDir, f.rel, cur) : false;
      // THE ADOPTION HALF (see library/practices/seed-to-scale.md). A file diff can say this skill
      // changed by 40 lines; it cannot say the founder HAS a landing page and it is now behind the
      // practice. Both directions matter and they are different founders:
      //   `changed` + artifact → the practice moved under work they already shipped.
      //   `new`     + artifact → adopt just installed a generator onto a repo that already has one.
      // Reported as a CANDIDATE, never a conclusion — /boss-sync reads the CHANGELOG and judges
      // whether the change is worth their attention. Silent when the artifact isn't there.
      let affects = null;
      if (f.kind === 'skill' && status !== 'ok') {
        const a = assess(projectDir, f.name, stamp, ladder);
        if (a && a.exists) {
          affects = {
            what: a.what, evidence: a.evidence, more: a.more, alsoLookFor: a.alsoLookFor,
          };
        }
      }
      entries.push({ ...f, stageId, status, next, edited, delta: exists ? lineDelta(cur, next) : 0, affects });
    }
    const block = planClaudeBlock(projectDir, stageId, { ...vars, STAGE: stageId, MODE: manifest.name });
    if (block) entries.push({ ...block, stageId });
  }

  return {
    entries,
    layers,
    pin: stamp.bossVersion,
    current,
    drift: stamp.bossVersion !== current,
    settings: computeSettingsMerge(projectDir, layers),
    orphans: planOrphans(projectDir, stamp, layers),
  };
}

// Apply a plan: write new/changed files and return the canonicalized stamp
// fields the caller should persist (it owns writeStamp + registry).
export function applySync(projectDir, plan, stamp, opts = {}) {
  // BOSS refused to DELETE a file the founder had edited — *"the founder changed it, which makes
  // it theirs"* — and then overwrote that same file without asking, three functions down. Same
  // file, same edit, opposite treatment, and on a `.claude/` that plenty of projects gitignore
  // the overwrite is not even recoverable. The remove path's ethic now governs both:
  //
  //   edited === true  → never written. Reported, and `/boss-sync` (or --force) does the merge.
  //   edited === null  → BOSS has no record (every project scaffolded before the ledger). Backed
  //                      up, then written: refusing would break updates for every existing
  //                      project, and overwriting blind is the bug.
  //   edited === false → BOSS wrote it and nobody touched it. Written.
  const written = [];
  const skipped = [];
  const toBackUp = [];
  const force = opts.force === true;
  // `--keep-mine` acts on the tri-state's THIRD value, which nothing acted on before. `null`
  // means BOSS has no record of writing this file — and `provenance()`'s own comment names two
  // causes for that: BOSS wrote it before the ledger existed, OR **it never wrote it at all**.
  // The default collapses both into "probably ours, back it up and replace", which is right for
  // the first cause and wrong for the second: a founder's own `.claude/agents/coder.md`, or a
  // repo `boss adopt` took on that already had one, is replaced and reported as `~ changed` —
  // the same words a routine BOSS update gets. The backup makes it recoverable; nothing made it
  // VISIBLE. Changing the default would break updates for every pre-ledger project (which is why
  // it is not changed here), so the opt-out is the fix: `--keep-mine` leaves every unclaimed file
  // alone and applies the rest.
  const keepMine = opts.keepMine === true;
  for (const e of plan.entries) {
    if (e.status === 'ok') continue;
    if (e.status === 'declined' && !force) continue;
    if (e.status === 'changed' && e.edited === true && !force) { skipped.push(e); continue; }
    if (e.status === 'changed' && e.edited === null && keepMine) { skipped.push(e); continue; }
    if (e.status === 'changed' && (e.edited === null || (e.edited === true && force))) toBackUp.push(e.rel);
  }
  const backupDir = backupManaged(projectDir, toBackUp);
  for (const e of plan.entries) {
    if (e.status === 'ok') continue;
    if (e.status === 'declined' && !force) continue;
    if (skipped.includes(e)) continue;
    if (e.kind === 'claude-block') {
      if (writeClaudeBlock(projectDir, e.name, e.body)) written.push(e);
      continue;
    }
    const dest = join(projectDir, e.rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, e.next);
    written.push(e);
  }
  // Record what BOSS just wrote — AND every managed file that was already up to date. Recording
  // only the writes leaves the untouched majority permanently `null`, so the first time any of
  // them changes upstream it gets backed up as "provenance unknown" forever. A sync is the moment
  // BOSS knows the whole tree; stamp the whole tree. Skipped files are excluded by name.
  stampManaged(projectDir, plan.layers, skipped.map((e) => e.ledgerKey || e.rel));
  // Groups whose predicate came true were in this plan as `new` and are on disk now; say so in
  // the stamp, so status stops announcing them and the next plan treats them as ordinary.
  const earned = newlyEarned(projectDir, stamp).filter((g) => g.skills.every((sk) => existsSync(join(projectDir, '.claude', 'skills', sk, 'SKILL.md'))));
  if (earned.length) markLaidDown(stamp, earned);
  // What is STILL held back after that, so the reconciled stamp below does not list it as installed.
  const heldNow = stillDeferred(projectDir, stamp);

  // Removal is OPT-IN, always. `--apply` writes and reports; only `--remove` deletes. DEC-003:
  // BOSS names what changed, the founder decides, and then BOSS does the work — a sync that
  // silently deleted a skill would be the one place BOSS decided for them, and it would do it to
  // files in a repo it was invited into. An edited orphan is never removed even with --remove;
  // the founder changed it, which makes it theirs.
  const removed = [];
  if (opts.remove) {
    for (const o of plan.orphans || []) {
      if (!o.present || o.edited === true) continue; // null (unknowable) removes on consent; true never does
      try {
        rmSync(join(projectDir, o.rel), { recursive: true, force: true });
        removed.push(o);
      } catch { /* a removal that fails is reported as not-removed, never as done */ }
    }
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
      (m.skills || []).forEach((s) => { if (!heldNow.has(s)) skills.add(s); });
      (m.hooks || []).forEach((h) => hooks.add(h));
      (m.loops || []).forEach((l) => loops.add(l));
    } catch { /* skip unauthored */ }
  }
  const top = plan.layers[plan.layers.length - 1];
  let topMode = stamp.mode;
  try { topMode = readStageManifest(top).name; } catch { /* keep */ }

  // The stamp must keep naming what is actually ON DISK. Reconciling it to the current manifest
  // union alone — which is what this did before orphans existed — would drop a retired skill from
  // the ledger while its files stayed in `.claude/`. The next sync would then have no record BOSS
  // ever installed it, so the safety boundary above ("only remove what BOSS stamped") would refuse
  // to touch it, and it would sit there unexplained forever. An orphan we chose not to remove is
  // still installed, so it stays stamped until it's gone.
  const stillInstalled = new Set(
    (plan.orphans || [])
      .filter((o) => o.present && !removed.some((r) => r.kind === o.kind && r.name === o.name))
      .map((o) => `${o.kind}:${o.name}`),
  );
  const keep = (kind, set, prev) => {
    for (const n of prev || []) if (stillInstalled.has(`${kind}:${n}`)) set.add(n);
    return [...set];
  };

  return {
    written,
    skipped,
    backupDir,
    removed,
    stamp: {
      ...stamp,
      stage: top,
      mode: topMode,
      installedLayers: plan.layers,
      agents: keep('agent', agents, stamp.agents),
      skills: keep('skill', skills, stamp.skills),
      hooks: keep('hook', hooks, stamp.hooks),
      loops: [...loops],
      bossVersion: plan.current,
    },
  };
}
