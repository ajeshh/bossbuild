// BOSS re-entry — "how long have I been away, and what was I doing?" (IDEA-077)
//
// The FACTS only. No rendering, no voice, no console. Two surfaces consume this and they must
// never disagree about the answer:
//
//   · `boss status` (src/orientation.js) — the terminal read, for a founder who runs the CLI.
//   · the `reentry` SessionStart hook (L1) — the same answer, at the moment the question is
//     actually asked, for a founder whose keyboard is a phone and who has no terminal at all.
//
// This module exists BECAUSE of that second surface. The logic was written for `boss status` in
// v0.231.0 and lived in `src/`, which does not ship to a project — so the hook could not have
// reused it, and a second copy is how two surfaces end up individually correct and disagreeing
// with each other (the failure `test/cli.test.js` was written against).
//
// Zero-dep, host-neutral, no side effects. The devlog is the source: `/log` writes it and
// `/close` appends to it, and it is TRACKED, so it survives a fresh clone and a git worktree.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Days away before the re-entry line is worth printing. A founder who worked yesterday does not
// need to be told what they were doing; one back after a week does. Three days is the span over
// which "what was I building" actually stops being obvious — and the cost of being wrong is one
// dim line, in both directions.
export const REENTRY_DAYS = 3;

// The date first; anything after it is the founder's title for the day (`## 2026-09-12 (later —
// the vet sweep)`). It was a bare-date match until IDEA-102 found four of six entries in BOSS's own
// devlog carried a suffix and `boss status` was quoting a session three weeks stale.
const DATE_HEADING = /^##\s+(\d{4}-\d{2}-\d{2})(?:\s|$)/;
const DAY_MS = 86400000;

// The newest dated entry in docs/devlog.md — the record `/log` writes and `/close` appends to.
// Parsed from CONTENT, not mtime: a fresh clone resets every mtime, and the date the founder
// worked is a fact that survives the checkout.
//
// The devlog is append-newest-at-top by convention, but this scans every heading and takes the
// max rather than trusting position — a founder who appended at the bottom once should not get a
// stale answer, and ordering is a convention, not a guarantee.
export function readDevlogHead(projectDir) {
  const f = join(projectDir, 'docs', 'devlog.md');
  if (!existsSync(f)) return null;
  let lines;
  try { lines = readFileSync(f, 'utf8').split(/\r?\n/); } catch { return null; }

  let best = null; // { date, start }
  for (let i = 0; i < lines.length; i += 1) {
    const m = DATE_HEADING.exec(lines[i]);
    if (m && (!best || m[1] > best.date)) best = { date: m[1], start: i };
  }
  if (!best) return null;

  // Read that entry's bullets, stopping at the next `## ` heading.
  const field = (label) => {
    const re = new RegExp(`^\\s*-\\s+\\*\\*${label}:?\\*\\*\\s*(.*)$`, 'i');
    for (let i = best.start + 1; i < lines.length; i += 1) {
      if (/^##\s/.test(lines[i])) break;
      const m = re.exec(lines[i]);
      if (m) {
        const v = m[1].trim();
        // A skill that writes an empty field is being honest ("blanks are honest" — /log rule 3).
        // Report the blank as absent rather than as an empty string.
        return v && !/^_?\(?(tbd|none|n\/a)\)?_?$/i.test(v) ? v : null;
      }
    }
    return null;
  };

  return { date: best.date, landed: field('Landed'), next: field('Next'), feat: field('FEAT') };
}

// Whole days between the newest devlog date and now. Null when there is no devlog to read — an
// absence of record is not an absence of work, and saying "back after 0 days" to someone who
// never ran `/log` would be inventing a fact.
export function awayDays(projectDir, nowMs = Date.now()) {
  const head = readDevlogHead(projectDir);
  if (!head) return null;
  const then = Date.parse(`${head.date}T00:00:00Z`);
  if (Number.isNaN(then)) return null;
  // Compare date-to-date in UTC so a session at 23:00 and one at 01:00 the next day read as one
  // day apart, not two hours.
  const today = Math.floor(nowMs / DAY_MS) * DAY_MS;
  return Math.max(0, Math.round((today - then) / DAY_MS));
}

// The whole decision, in one place, so both surfaces answer it identically: is there anything
// worth saying on re-entry, and what is it? Null means STAY SILENT, which is the common case and
// the correct one — silence on the day after a session is the requirement, not the fallback.
export function reentryRead(projectDir, { now = Date.now(), threshold = REENTRY_DAYS } = {}) {
  const head = readDevlogHead(projectDir);
  if (!head) return null;
  const days = awayDays(projectDir, now);
  if (days == null || days < threshold) return null;
  return { days, date: head.date, landed: head.landed, next: head.next, feat: head.feat };
}
