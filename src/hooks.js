// boss hooks — the opt-in hooks: list, enable, disable.
//
// Ten hooks shipped as files into every `.claude/hooks/`, switched off, and the on-switch was to
// open one, find the "TO TURN IT ON" block in its header, and paste it into settings.json by
// hand. The humane read of that: ten inert scripts in a tree the founder did not ask for, and the
// one act that would make any of them useful was the fiddliest thing BOSS asked anyone to do. So:
// nothing lands until asked, and asking is one command. `enable` copies the file from the template
// and registers the exact block the file's own header carries — one source for both, so the
// header cannot lie about the registration. `disable` reverses both. `boss sync` keeps enabled
// hooks current and leaves the rest alone (a file that is not there is not managed).
//
// Projects scaffolded before this have all ten on disk, unregistered; nothing changes for them —
// sync still updates those files, `enable` still registers, `disable` still unregisters.

import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { writeFileAtomic } from './atomic.js';
import { join, dirname } from 'node:path';
import { dim } from './ui.js';
import { STAGES_DIR, STAGE_ORDER } from './paths.js';
import { readStageManifest, sameAsTemplate } from './scaffold.js';

const MARKER = /TO TURN IT ON/;

/** The header block after "TO TURN IT ON", parsed: { hooks: { Event: [ … ] } } — or null. */
export function parseOnSwitch(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => MARKER.test(l));
  if (start < 0) return null;
  // The block begins at the first `"hooks":` line after the marker (older headers carry a sentence
  // between the two) and ends at the first blank comment line or the first non-comment line.
  const body = [];
  let inBlock = false;
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (!l.startsWith('//')) break;
    const t = l.replace(/^\/\/ ?/, '');
    if (!inBlock) { if (/^\s*"hooks"\s*:/.test(t)) inBlock = true; else continue; }
    if (!t.trim()) break;
    body.push(t);
  }
  try {
    const obj = JSON.parse(`{${body.join('\n')}}`);
    return obj.hooks && typeof obj.hooks === 'object' ? obj : null;
  } catch { return null; }
}

/** Every opt-in hook a stage ships: [{ name, stage, src }] in ladder order. */
export function optionalHooks(layers = STAGE_ORDER) {
  const out = [];
  for (const stageId of layers) {
    let m;
    try { m = readStageManifest(stageId); } catch { continue; }
    for (const name of m.optionalHooks || []) {
      out.push({ name, stage: stageId, src: join(STAGES_DIR, stageId, 'template', '.claude', 'hooks', `${name}.js`) });
    }
  }
  return out;
}

function settingsPath(projectDir) { return join(projectDir, '.claude', 'settings.json'); }
function readSettings(projectDir) {
  try { return JSON.parse(readFileSync(settingsPath(projectDir), 'utf8')); } catch { return {}; }
}
/**
 * settings.json for a read-modify-write: {} when absent, and a refusal when it won't parse. Reading
 * an unparseable file as {} and writing it back erased a founder's permissions, the conscience's
 * registration and the secret-path deny floor (test/unparseable-settings-left-alone.test.js).
 */
export function readSettingsForWrite(projectDir) {
  const p = settingsPath(projectDir);
  if (!existsSync(p)) return {};
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch {
    throw new Error(`.claude/settings.json can't be parsed, so BOSS won't write over it — fix the JSON (a stray comma is the usual one) and retry.`);
  }
}
function commandsOf(entry) { return (entry.hooks || []).map((h) => h.command || ''); }

/** Is this hook registered in the project's settings.json? */
export function isRegistered(projectDir, name) {
  const s = readSettings(projectDir);
  const needle = `/.claude/hooks/${name}.js`;
  return Object.values(s.hooks || {}).some((entries) => (entries || []).some((e) => commandsOf(e).some((c) => c.includes(needle))));
}

/**
 * Enable: copy the file (substituting nothing — hooks carry no placeholders) and merge the
 * header's block into settings.json, deduplicated on the command string. Returns { file, registered }.
 */
export function enableHook(projectDir, name, layers) {
  const hook = optionalHooks(layers).find((h) => h.name === name);
  if (!hook) throw new Error(`no opt-in hook named '${name}' in this project's rungs — \`boss hooks\` lists them`);
  const text = readFileSync(hook.src, 'utf8');
  const sw = parseOnSwitch(text);
  if (!sw) throw new Error(`${name}.js has no parseable "TO TURN IT ON" block — the file cannot say how to register itself`);
  const dest = join(projectDir, '.claude', 'hooks', `${name}.js`);
  mkdirSync(dirname(dest), { recursive: true });
  const file = !existsSync(dest);
  if (file) writeFileSync(dest, text);
  const s = readSettingsForWrite(projectDir);
  s.hooks = s.hooks || {};
  let registered = false;
  for (const [event, entries] of Object.entries(sw.hooks)) {
    s.hooks[event] = s.hooks[event] || [];
    for (const entry of entries) {
      const already = s.hooks[event].some((e) => commandsOf(e).some((c) => c.includes(`/.claude/hooks/${name}.js`)));
      if (!already) { s.hooks[event].push(entry); registered = true; }
    }
  }
  mkdirSync(dirname(settingsPath(projectDir)), { recursive: true });
  writeFileAtomic(settingsPath(projectDir), JSON.stringify(s, null, 2) + '\n');
  return { file, registered };
}

/**
 * Disable: unregister, and remove the file ONLY if it is still BOSS's copy — then `enable` really
 * does bring it back. A file the founder changed is unregistered and KEPT (RVW-109: the code that
 * deletes decides what is safe to delete; `boss remove` already worked this way). Returns
 * { unregistered, removed, kept }.
 */
export function disableHook(projectDir, name) {
  const s = readSettingsForWrite(projectDir);
  let unregistered = false;
  for (const [event, entries] of Object.entries(s.hooks || {})) {
    const kept = (entries || []).filter((e) => !commandsOf(e).some((c) => c.includes(`/.claude/hooks/${name}.js`)));
    if (kept.length !== (entries || []).length) unregistered = true;
    if (kept.length) s.hooks[event] = kept; else delete s.hooks[event];
  }
  if (s.hooks && !Object.keys(s.hooks).length) delete s.hooks;
  if (unregistered) writeFileAtomic(settingsPath(projectDir), JSON.stringify(s, null, 2) + '\n');
  const dest = join(projectDir, '.claude', 'hooks', `${name}.js`);
  if (!existsSync(dest)) return { unregistered, removed: false, kept: false };
  // Hooks carry no placeholders, so "unchanged" is the shipped text; any rung's copy will do. No
  // shipped copy to compare against means BOSS can't show it is its own — keep it.
  const src = optionalHooks().find((h) => h.name === name)?.src;
  const ours = src && existsSync(src) && sameAsTemplate(readFileSync(dest, 'utf8'), readFileSync(src, 'utf8'));
  if (!ours) return { unregistered, removed: false, kept: true };
  rmSync(dest);
  return { unregistered, removed: true, kept: false };
}

// The commit guard's one line after `new`, `adopt` and `sync` install it. Moved from cli.js
// (IDEA-160 S0).
// IDEA-142 — one line, only when something changed or the founder's own hook holds the slot.
export function commitGuardLine(r) {
  if (r.state === 'installed') {
    console.log(`    ${dim('commits are checked for keys before they reach git history (skip once: git commit --no-verify)')}`);
  } else if (r.state === 'theirs' || r.state === 'hooks-path') {
    console.log(`    ${dim(`your own pre-commit hook is kept; to check commits for keys, call .claude/hooks/lib/commit-secrets.js from it`)}`);
  }
}
