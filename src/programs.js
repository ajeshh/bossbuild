// BOSS · programs — the umbrella's own record, and the record that has grown into one.
//
// WHY THIS EXISTS. `program:` started as one frontmatter line (records.js says why), with a
// graduation — a `PROG-NNN` record — documented and deliberately unbuilt. The first one was made
// by hand on 2026-10-05 (PROG-001, the website), and the readers printed it as a bare id: the
// title, the gist and the program's own backlog were invisible to every view of it. This reads
// the record, so `boss records --programs` and the board can say what the umbrella IS.
//
// The second half is IDEA-145's rule E5, *grown*: a record still in flight that holds several
// TRACKS of work — checklist items carrying their own ids (C1…C8, N3…N14) — is a program wearing
// an idea's clothes. Measured on BOSS's own records before choosing the line: length is the wrong
// test (a 657-line record was all shipped narrative); tracks and open items are the right one.
// The readers OFFER the elevation; nothing here moves a record or writes a file.
//
// Its own module because both records.js and board.js read it, and board.js may not import
// records.js (records imports board — IDEA-136 F1 removed exactly that cycle once).
//
// Zero-dep, never throws at a caller.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { frontmatter, baseStatus } from './frontmatter.js';

export const PROGRAM_DIR = 'docs/programs';
const PROGRAM_FILE = /^(PROG-\d+)[-.].*\.md$/;

// The line, from IDEA-145 E5. Either alone is enough: three tracks is three efforts sharing a
// file; twelve open items in one track is a backlog, which is what a program holds.
export const GROWN = { tracks: 3, open: 12 };

// Every checklist line in the record, ticked or not, and the TRACK letter of any that carry an
// id: `- [ ] **N3 · …`, `- [x] C0.1 · …`, `- [x] **R1** · …`. An item with no id counts toward
// open/done but names no track — a plain to-do list is one track at most. `openTracks` keeps only
// the tracks with something still open: a finished track is history, not an effort in flight
// (found running it on a scaffold — a record whose tracks were all done read as "grown").
export function workShape(text) {
  const boxes = String(text || '').match(/^[ \t]*[-*][ \t]+\[[ xX]\][^\n]*/gm) || [];
  const open = boxes.filter((b) => /\[ \]/.test(b)).length;
  const tracks = new Set();
  const openTracks = new Set();
  for (const b of boxes) {
    const m = b.match(/\][ \t]+(?:\*\*)?([A-Z])\d+(?:\.\d+)?\b/);
    if (!m) continue;
    tracks.add(m[1]);
    if (/\[ \]/.test(b)) openTracks.add(m[1]);
  }
  return { open, done: boxes.length - open, tracks: [...tracks].sort(), openTracks: [...openTracks].sort() };
}

const IN_FLIGHT_NOT = new Set(['shipped', 'done', 'deferred', 'dropped', 'killed']);

/** True when an in-flight record has grown past the E5 line. */
export function isGrown(status, shape) {
  if (IN_FLIGHT_NOT.has(baseStatus(status))) return false;
  return (shape.openTracks || []).length >= GROWN.tracks || shape.open >= GROWN.open;
}

function titleOf(text, id) {
  const m = String(text).match(/^#\s+(.+)$/m);
  if (!m) return id;
  // `# PROG-001 — The website` → `The website`
  return m[1].replace(new RegExp(`^${id}\\s*[—–:-]\\s*`), '').trim();
}

/** `PROG-1`, `prog-001`, `1` → `PROG-001` — the padding the card view already does for ids. */
export function programId(raw) {
  const s = String(raw || '').trim().toUpperCase();
  const m = s.match(/^(?:PROG-)?(\d+)$/);
  return m ? `PROG-${m[1].padStart(3, '0')}` : s;
}

/** Map of PROG id → { id, file, title, gist, status, work } for every PROG record on disk. */
export function readPrograms(projectDir) {
  const out = new Map();
  const dir = join(projectDir, PROGRAM_DIR);
  if (!existsSync(dir)) return out;
  let names = [];
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names.sort()) {
    const m = n.match(PROGRAM_FILE);
    if (!m) continue;
    try {
      const text = readFileSync(join(dir, n), 'utf8');
      const fm = frontmatter(text) || {};
      const id = fm.id || m[1];
      out.set(id, {
        id,
        file: `${PROGRAM_DIR}/${n}`,
        title: titleOf(text, id),
        gist: fm.gist || '',
        status: fm.status || '',
        work: workShape(text),
      });
    } catch { /* an unreadable record is skipped, never fatal */ }
  }
  return out;
}
