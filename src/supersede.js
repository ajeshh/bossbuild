// The supersede ledger — reading how BOSS's own way of doing something changed.
//
// WHY THIS EXISTS: `boss sync` could add and modify, and its policy was literally "nothing is
// removed." Two consequences, both structural:
//   1. A skill BOSS retired stayed in every project that ever synced, next to its replacement.
//      So the subtraction pass EVID-001 mandates could never actually reach a founder — syncing
//      would only ever GROW their surface, which is the opposite of the point.
//   2. DEC-003's fourth step — "if they say yes, BOSS does the migration" — was a promise the sync
//      layer could not keep. `/comprehend` can refactor a founder's own code on request; nothing
//      could carry them across a change in BOSS's way of working.
//
// This module is the small half: read the ledger, answer "what happened to this thing, and why."
// `planSync` finds the orphan on disk; without this it could only say "gone", which is a deletion
// with no reason attached — the exact thing that makes an update feel like something done TO you.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOSS_ROOT } from './paths.js';
import { cmpVersion } from './changelog.js';

const LEDGER = join(BOSS_ROOT, 'registry', 'supersedes.json');

export function readSupersedes() {
  if (!existsSync(LEDGER)) return [];
  try {
    const parsed = JSON.parse(readFileSync(LEDGER, 'utf8'));
    return Array.isArray(parsed.supersedes) ? parsed.supersedes : [];
  } catch {
    // A malformed ledger must never break `boss sync`. The founder loses the explanation, not the
    // update — and the orphan is still reported, just without a reason.
    return [];
  }
}

// What happened to `name`, if BOSS recorded it. `since` filtering is the caller's job: an entry
// older than the project's pin describes a change that project already lived through.
export function findSupersede(kind, name, entries = readSupersedes()) {
  return entries.find((e) => e.kind === kind && e.removed === name) || null;
}

// Entries strictly newer than a pin — what this project has NOT yet been told about.
export function supersedesSince(pin, entries = readSupersedes()) {
  if (!pin) return entries;
  return entries.filter((e) => cmpVersion(e.since, pin) > 0);
}
