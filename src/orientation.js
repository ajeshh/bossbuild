// The two orientation reads `boss status` could not answer (EVID-001, facets 3 + 5).
//
// 1. RE-ENTRY — "how long have I been away, and what was I doing?" The founder's own
//    words: *"I forget what feature I'm building / get ADHD."* `/close` already writes
//    the answer into `docs/devlog.md` and `docs/RESUME.md` every session; nothing ever
//    read it back. The MVP overlay says "read RESUME first thing next session" — as the
//    tail of a rule about session END, with no runner behind it. This is the runner.
//
// 2. EVIDENCE HEADWAY — "what have I actually learned?" `boss status` renders *ticket*
//    headway (the last shipped FEAT). The EVID ledger — the three-rung grade ladder
//    `/evidence` writes — has exactly one consumer today, the conscience hook, and only
//    once a moment is already firing. A founder cannot see it at all.
//
// BOTH ARE COMPOSITIONS. No new skill, no new loop, no new command — EVID-001's mandate
// is compose + SUBTRACT, and the founder's own stated fear is app bloat (Risk #1).
//
// WHY NOT A CONSCIENCE MOMENT: a 20th loop is surface. `boss status` is already the
// where-am-I command; these are where-am-I answers. They go where the question is asked.
//
// THE HUMANE SHAPE IS INHERITED FROM `quiet_for` (loop-runtime.js, v0.206.0): a CLI can
// only ever run while the founder is HERE. It can never observe an absence in real time.
// So the re-entry read does not fire AT someone who is away — it fires when they COME
// BACK, which is both the only observable moment and the only kind one.
//
// AND THE ANTI-FLATTERY RULE (IDEA-065): a progress surface that cannot go down is a
// comfort device. Every rung is printed including its zeros — so "none yet" and "not
// counted" stop looking the same (the failure `check:site`'s citation gauge shipped for
// 12 practices). No percentage, no total-only count, no streak. Streaks are a live entry
// in BOSS's own dark-pattern catalog (`engage-streaks-variable-rewards`); the honest
// register is orientation, not dopamine.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readEvidenceContext } from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';
import { dim, bold, ok, warn } from './ui.js';

// Days away before the re-entry line is worth printing. A founder who worked yesterday
// does not need to be told what they were doing; one back after a week does. Three days
// is the span over which "what was I building" actually stops being obvious — and the
// cost of being wrong is one dim line, in both directions.
export const REENTRY_DAYS = 3;

const DATE_HEADING = /^##\s+(\d{4}-\d{2}-\d{2})\s*$/;
const DAY_MS = 86400000;

// The newest dated entry in docs/devlog.md — the record `/log` writes and `/close`
// appends to. Parsed from CONTENT, not mtime: a fresh clone resets every mtime, and the
// date the founder worked is a fact that survives the checkout.
//
// The devlog is append-newest-at-top by convention, but this scans every heading and
// takes the max rather than trusting position — a founder who appended at the bottom
// once should not get a stale answer, and ordering is a convention, not a guarantee.
export function readDevlogHead(projectDir) {
  const f = join(projectDir, 'docs', 'devlog.md');
  if (!existsSync(f)) return null;
  let lines;
  try { lines = readFileSync(f, 'utf8').split('\n'); } catch { return null; }

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
        // A skill that writes an empty field is being honest ("blanks are honest" —
        // /log rule 3). Report the blank as absent rather than as an empty string.
        return v && !/^_?\(?(tbd|none|n\/a)\)?_?$/i.test(v) ? v : null;
      }
    }
    return null;
  };

  return { date: best.date, landed: field('Landed'), next: field('Next'), feat: field('FEAT') };
}

// Whole days between the newest devlog date and now. Null when there is no devlog to
// read — an absence of record is not an absence of work, and saying "back after 0 days"
// to someone who never ran `/log` would be inventing a fact.
export function awayDays(projectDir, nowMs = Date.now()) {
  const head = readDevlogHead(projectDir);
  if (!head) return null;
  const then = Date.parse(`${head.date}T00:00:00Z`);
  if (Number.isNaN(then)) return null;
  // Compare date-to-date in UTC so a session at 23:00 and one at 01:00 the next day
  // read as one day apart, not two hours.
  const today = Math.floor(nowMs / DAY_MS) * DAY_MS;
  return Math.max(0, Math.round((today - then) / DAY_MS));
}

// The bridge back. Silent below the threshold, and silent when there is nothing to
// bridge from — a project with no devlog has not gone quiet, it has not started.
export function printReentry(projectDir, { now = Date.now(), threshold = REENTRY_DAYS } = {}) {
  const head = readDevlogHead(projectDir);
  if (!head) return false;
  const days = awayDays(projectDir, now);
  if (days == null || days < threshold) return false;

  const last = head.landed || head.feat;
  console.log('');
  console.log(`  ▸ ${bold(`Back after ${days} days.`)}${last ? `  ${dim(`Last session (${head.date}):`)} ${last}` : `  ${dim(`Last logged ${head.date}.`)}`}`);
  if (head.next) {
    console.log(`    ${bold('You said next:')}   ${head.next}`);
  } else {
    // No `Next` recorded is worth naming once, plainly: it is the field that makes the
    // return cheap, and the founder is the only one who can fill it.
    console.log(`    ${dim('No "next" was recorded — `/close` writes one, and it is what makes the next return cheap.')}`);
  }
  console.log('');
  return true;
}

// What the ledger DIRECTORY holds, before any grading. Kept separate from the runtime's
// `readEvidenceContext` for two reasons, both about not letting an absence pass as a zero:
//
//   1. That function collapses "no directory" and "nothing graded" into one null, and
//      those are different facts a founder deserves the difference between.
//   2. It counts only GRADED files. An EVID written without a grade is therefore invisible
//      to it — so a founder who forgets the `grade:` field makes the ledger look tidier,
//      which is the shape of metric BOSS keeps catching (`check:site`'s citation gauge read
//      95% clean because uncounted practices never reached the denominator). Counting the
//      ungraded here is what stops the ladder from being a comfort device.
//
// Eligibility mirrors `readEvidenceContext` exactly — same filename pattern, same
// `type: evidence` requirement, same superseded exclusion, same parser — so the two can
// never drift into disagreeing about what is on file.
const GRADES = new Set(['stated-pain', 'observed-behavior', 'commitment']);

function evidenceShape(projectDir) {
  const dir = join(projectDir, 'docs', 'evidence');
  if (!existsSync(dir)) return { eligible: 0, ungraded: 0 };
  let names;
  try { names = readdirSync(dir).filter((n) => /^EVID-\d+.*\.md$/.test(n)); } catch { return { eligible: 0, ungraded: 0 }; }
  let eligible = 0;
  let ungraded = 0;
  for (const n of names) {
    let fm;
    try { fm = parseFrontmatter(readFileSync(join(dir, n), 'utf8')); } catch { continue; }
    if (!fm || fm.type !== 'evidence' || fm.status === 'superseded') continue;
    eligible += 1;
    if (!GRADES.has(fm.grade)) ungraded += 1;
  }
  return { eligible, ungraded };
}

// What you have actually learned — the counterpart to "Recent headway", which counts
// shipped features. Shipping is motion; this is the part that can be wrong.
//
// Every rung prints, zeros included. The ladder is the point: a column of stated-pain
// with nothing beside it is the honest read of most pre-PMF projects, and hiding the
// empty rungs would turn a ladder into a score.
export function printEvidenceHeadway(projectDir) {
  const shape = evidenceShape(projectDir);
  if (shape.eligible === 0) {
    console.log(`    ▸ ${bold('What you\'ve learned:')} ${dim('nothing captured yet —')} ${bold('/evidence')} ${dim('records what a real person said or did.')}`);
    return;
  }
  const ev = readEvidenceContext(projectDir);
  if (!ev) {
    // Files exist but none carry a grade the ladder recognizes. Say that, rather than
    // reporting zero — an ungraded signal is uncounted, not absent.
    console.log(`    ▸ ${bold('What you\'ve learned:')} ${dim('evidence on file, none graded —')} ${dim('a signal without a grade cannot be weighed.')}`);
    return;
  }
  const c = ev.counts;
  const rung = (n, label) => (n > 0 ? `${n} ${label}` : dim(`${n} ${label}`));
  const ladder = [
    rung(c['stated-pain'], 'stated-pain'),
    rung(c['observed-behavior'], 'observed'),
    rung(c.commitment, 'commitment'),
    // Never silently dropped: an ungraded EVID is a signal you collected and did not
    // weigh, which is a different state from not having collected it.
    ...(shape.ungraded > 0 ? [warn(`${shape.ungraded} ungraded`)] : []),
  ].join(dim(' · '));
  const strongest = c.commitment > 0 ? ok('✓') : '▸';
  console.log(`    ${strongest} ${bold('What you\'ve learned:')} ${ladder}`);

  // One honest line when the ladder is bottom-heavy. This is the whole humane point of
  // the surface: stated pain is the cheapest grade to collect and the easiest to mistake
  // for traction.
  if (c['observed-behavior'] === 0 && c.commitment === 0) {
    console.log(`      ${dim('Nothing observed yet — a compliment is not a receipt.')} ${bold('/interview')} ${dim('turns a conversation into a graded signal.')}`);
  }
}
