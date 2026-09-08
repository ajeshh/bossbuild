// BOSS person-state — where the conscience's PER-PERSON memory lives (DEC-015).
//
// DEC-001 split the venture brain by nature: `read.md` is about the VENTURE and commits;
// `relationship.md`, `conscience-log.jsonl` and `trace.jsonl` are about a PERSON and stay
// private. That cut is right and is unchanged. What was wrong was the implementation:
// "private" was built as "gitignored inside the working directory", which is only the same
// thing as "per person" while a person has ONE working directory.
//
// Claude Code's Remote Control spawns sessions in their own git worktree. A worktree is the
// SAME PERSON in a different directory, and it carries tracked files only — so it arrives with
// `brain/read.md` and WITHOUT the two files that record what the conscience already said.
// The conscience then re-fires nudges the founder already overrode, which is the single worst
// failure available to a thing whose credibility is restraint.
//
// So per-person state is keyed to the PERSON + PROJECT and lives outside the tree, beside the
// registry that is already per-machine. `src/remove.js` had already reached this conclusion for
// the removal backup — "`~/.boss/` is per-person by construction" — and never applied it to the
// live state.
//
// THE KEY comes from `.boss/manifest.json`, which is TRACKED: byte-identical in every worktree
// of the same project, present in a fresh clone, and unchanged when a directory is renamed or
// moved. No git shell-out — this runs inside a UserPromptSubmit hook, where a spawned process
// per prompt is the exact cost that makes five other hooks ship dormant.
//
// MIGRATION is read-both-write-new and NEVER destructive: if the machine-local file is absent
// and a legacy in-project one exists, it is COPIED up and the original is left where it is.
// A path change must not be able to lose a founder's history (2026-08-21).
//
// FALLBACK: no readable manifest means no stable key, so the legacy in-project path is returned
// unchanged. A directory that is not a BOSS project behaves exactly as it did before.

import { existsSync, mkdirSync, readFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';

// The three files DEC-015 moves. `cost-log.jsonl` deliberately does NOT move: spend reads as a
// venture fact a cofounder plausibly should see, which is a different question with a different
// answer, and bundling it would smuggle a second decision through this one.
export const PERSON_FILES = ['conscience-log.jsonl', 'trace.jsonl', join('brain', 'relationship.md')];

const keyCache = new Map();

// A stable id for this project, from the tracked install record. `name` alone would collide
// across two projects with the same name on one machine; `createdAt` disambiguates them and is
// written once, at scaffold, and never rewritten.
export function projectKey(projectDir) {
  if (keyCache.has(projectDir)) return keyCache.get(projectDir);
  let key = null;
  try {
    const m = JSON.parse(readFileSync(join(projectDir, '.boss', 'manifest.json'), 'utf8'));
    if (m && typeof m.name === 'string' && m.name.trim()) {
      const slug = m.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32);
      const h = createHash('sha256').update(`${m.name} ${m.createdAt || ''}`).digest('hex').slice(0, 8);
      key = `${slug || 'project'}-${h}`;
    }
  } catch { /* no manifest, unreadable, or not a BOSS project — fall back below */ }
  keyCache.set(projectDir, key);
  return key;
}

export function personStateDir(projectDir) {
  const key = projectKey(projectDir);
  return key ? join(homedir(), '.boss', 'projects', key) : null;
}

// The path to read from and write to. `rel` is one of PERSON_FILES.
//
// Callers get a plain path back and do not need to know a migration happened — which is the
// point: every existing read/append site changes by one function call, and none of them grows
// a branch that could behave differently on the two sides of the move.
export function personStatePath(projectDir, rel) {
  const legacy = join(projectDir, '.boss', rel);
  const dir = personStateDir(projectDir);
  if (!dir) return legacy;
  const current = join(dir, rel);
  try {
    if (!existsSync(current) && existsSync(legacy)) {
      mkdirSync(dirname(current), { recursive: true });
      copyFileSync(legacy, current);   // copy, never move — the original stays
    }
  } catch { /* a failed migration must not break the session; the read below just finds nothing */ }
  return current;
}

// For appends: guarantees the directory exists. Separate from the reader so a pure read never
// creates an empty tree in the founder's home for a project whose conscience has never spoken.
export function personStatePathForWrite(projectDir, rel) {
  const p = personStatePath(projectDir, rel);
  try { mkdirSync(dirname(p), { recursive: true }); } catch { /* append will fail silently */ }
  return p;
}
