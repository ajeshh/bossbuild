// src/config.js — the one reader/writer for a project's `.boss/config.json`.
//
// Three modules each had their own copy of "read the config, tolerate a corrupt file"
// (`conscience.js`, `team.js`, plus a third `readCohort` that re-implemented what the
// hook runtime already exported to that same file). Consolidated per REVIEW-2026-07-28 §D1.
//
// The file holds a founder's PREFERENCES (cohort, license, visibility, the roster, the
// conscience's pause/mute state), so every read is forgiving — a hand-edited config with a
// stray comma must never take the CLI down — and every write preserves the keys it doesn't
// own. `conscience` and `conscienceMutes` are deliberately separate top-level keys so
// pause/resume (which overwrite `conscience` wholesale) can never wipe a per-moment mute.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const configPath = (projectDir) => join(projectDir, '.boss', 'config.json');

// Read the config, or {} if absent/corrupt. Never throws.
export function readConfig(projectDir) {
  const p = configPath(projectDir);
  if (!existsSync(p)) return {};
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return {}; }
}

// Read the config, or throw the founder-facing "not a BOSS project" error. Used by the
// commands that genuinely cannot proceed without it (pause/mute write into it).
export function readConfigOrFail(projectDir) {
  const path = configPath(projectDir);
  if (!existsSync(path)) throw new Error('not a BOSS project (no .boss/config.json here).');
  return { path, cfg: JSON.parse(readFileSync(path, 'utf8')) };
}

export function writeConfig(pathOrDir, cfg) {
  const p = pathOrDir.endsWith('.json') ? pathOrDir : configPath(pathOrDir);
  writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
}

// The founder-cohort declaration, or null. Null means "compose the voice generically" —
// an unset cohort is a legitimate state, never a prompt to fill something in.
export function readCohort(projectDir) {
  return readConfig(projectDir).cohort || null;
}
