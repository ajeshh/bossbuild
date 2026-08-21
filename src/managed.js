// src/managed.js — the provenance ledger: what BOSS itself wrote, and what it looked like
// when it did.
//
// It exists because `boss sync` could not answer the one question that decides whether an
// overwrite is safe: *did the founder change this, or did BOSS move on?* A `changed` status
// means only "on-disk differs from incoming", which is true in both cases and means opposite
// things. Without a record, the two are indistinguishable — so `--apply` treated every
// difference as staleness and wrote over it.
//
// The asymmetry that made this worth fixing: `--remove` already refused to delete a file the
// founder had edited (*"the founder changed it, which makes it theirs"*), while `--apply`
// overwrote the same file unconditionally, three functions away. BOSS would not delete your
// work and would replace it.
//
// The ledger is a flat { relative-path: sha256 } map at `.boss/managed.json`. Not in
// `manifest.json`: the manifest is a description of the install a human reads and edits, and
// hashes are machine bookkeeping that would bury it.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const LEDGER = ['.boss', 'managed.json'];

export const fileHash = (text) => createHash('sha256').update(String(text)).digest('hex');

export function readLedger(projectDir) {
  const p = join(projectDir, ...LEDGER);
  if (!existsSync(p)) return {};
  // A corrupt ledger must degrade to "I don't know", never to "unchanged" — the whole point
  // is that the unknown case is handled safely.
  try { const v = JSON.parse(readFileSync(p, 'utf8')); return (v && typeof v === 'object') ? v : {}; } catch { return {}; }
}

export function writeLedger(projectDir, ledger) {
  const p = join(projectDir, ...LEDGER);
  mkdirSync(dirname(p), { recursive: true });
  const sorted = Object.fromEntries(Object.entries(ledger).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(p, JSON.stringify(sorted, null, 2) + '\n');
}

// Record what BOSS just wrote. `entries` are { rel, text } — the content as written, so the
// next run compares against the same bytes.
export function recordManaged(projectDir, entries) {
  if (!entries || !entries.length) return;
  const ledger = readLedger(projectDir);
  for (const e of entries) ledger[e.rel] = fileHash(e.text);
  writeLedger(projectDir, ledger);
}

// Record files already on disk (the scaffold path, which copies a tree rather than composing
// strings). Absolute paths in, relative keys out.
export function recordManagedPaths(projectDir, absPaths) {
  const entries = [];
  for (const abs of absPaths || []) {
    try { entries.push({ rel: relative(projectDir, abs), text: readFileSync(abs, 'utf8') }); }
    catch { /* binary or vanished — an unrecorded file is `null`, which is the safe answer */ }
  }
  recordManaged(projectDir, entries);
}

// TRI-STATE, and the third value is the honest one — same shape as `orphanEdited`:
//   false — byte-identical to what BOSS wrote. Safe to overwrite.
//   true  — differs from what BOSS wrote. The founder's now; never overwritten silently.
//   null  — UNKNOWABLE. No ledger entry, because BOSS wrote this before the ledger existed
//           (every project scaffolded before this release) or never wrote it at all.
//
// `null` is the NORMAL case for a while, not an edge case, and it is why `--apply` backs a
// file up instead of either refusing (which would break updates for every existing project)
// or overwriting (which is the bug).
export function provenance(projectDir, rel, currentText) {
  const recorded = readLedger(projectDir)[rel];
  if (!recorded) return null;
  return fileHash(currentText) !== recorded;
}

// Copy files aside before they are overwritten. Returns the backup dir (relative), or null if
// nothing needed saving. `.boss/backups/` — inside the project, because a founder who wants
// their edit back should not have to know where a tool put it.
export function backupManaged(projectDir, rels, when) {
  if (!rels || !rels.length) return null;
  const stamp = (when || new Date().toISOString()).slice(0, 19).replace(/[:T]/g, '-');
  const relDir = join('.boss', 'backups', stamp);
  let saved = 0;
  for (const rel of rels) {
    const src = join(projectDir, rel);
    if (!existsSync(src)) continue;
    const dest = join(projectDir, relDir, rel);
    mkdirSync(dirname(dest), { recursive: true });
    try { cpSync(src, dest); saved++; } catch { /* a backup that fails must not be reported as done */ }
  }
  return saved ? relDir : null;
}
