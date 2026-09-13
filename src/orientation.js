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
// ⚠️ READ THIS BEFORE RE-DERIVING THE RULE ABOVE (DEC-016). The sentence is true of a CLI
// and stays true. The INFERENCE it invites — "so BOSS cannot reach an absent founder" — is
// no longer true of BOSS: with Claude Code's Remote Control connected, `PushNotification`
// reaches the founder's phone. The restraint is therefore a DECISION now, not a limit, and
// it is recorded as one. **BOSS never initiates contact with an absent founder** — not
// because it can't, but because a tool that pings you when you stop using it is the dark
// pattern BOSS ships a catalog against. Do not "fix" this by adding a push when the reason
// is good; the reasons will always be good. See docs/decisions/DEC-016.
//
// AND THE ANTI-FLATTERY RULE (IDEA-065): a progress surface that cannot go down is a
// comfort device. Every rung is printed including its zeros — so "none yet" and "not
// counted" stop looking the same (the failure `check:site`'s citation gauge shipped for
// 12 practices). No percentage, no total-only count, no streak. Streaks are a live entry
// in BOSS's own dark-pattern catalog (`engage-streaks-variable-rewards`); the honest
// register is orientation, not dopamine.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readEvidenceContext, readIntentContext } from '../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js';
import { parseFrontmatter } from '../stages/L0-quickstart/template/.claude/hooks/lib/yaml.js';
import { REENTRY_DAYS, readDevlogHead, awayDays, reentryRead } from '../stages/L0-quickstart/template/.claude/hooks/lib/reentry.js';
import { dim, bold, ok, warn } from './ui.js';

// The re-entry FACTS now live in the TEMPLATE lib, because the `reentry` SessionStart hook
// ships into the project and cannot import from `src/`. One implementation, two surfaces —
// `boss status` here and the hook there — so they can never drift into disagreeing about how
// long someone has been away (IDEA-077). The address stays this module: every existing
// importer names it, and the implementation moving is not their business.
export { REENTRY_DAYS, readDevlogHead, awayDays };

// The bridge back. Silent below the threshold, and silent when there is nothing to
// bridge from — a project with no devlog has not gone quiet, it has not started.
export function printReentry(projectDir, { now = Date.now(), threshold = REENTRY_DAYS } = {}) {
  // The DECISION is shared too, not just the parsing — `reentryRead` is what the hook calls, so
  // the two surfaces cannot disagree about whether there is anything worth saying.
  const head = reentryRead(projectDir, { now, threshold });
  if (!head) return false;
  const days = head.days;

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

// Toward what. `boss status` answers "where am I" (the rung) and "what am I doing" (the
// focus); this is the one line that says what the founder said it was FOR (IDEA-097). Their
// sentence, not BOSS's paraphrase, and only when they gave one — a founder who skipped the
// question sees nothing here, not a prompt to fill it in. It is not a target and it does not
// move: it is printed so the two lines above it have something to be measured against.
export function printIntent(projectDir) {
  const intent = readIntentContext(projectDir);
  if (!intent) return false;
  const why = intent.motivation ? dim(` (${intent.motivation})`) : '';
  if (intent.success) {
    console.log(`    ▸ ${bold('Toward:')} “${intent.success}”${why}`);
  } else {
    console.log(`    ▸ ${bold('Toward:')} ${intent.motivation}`);
  }
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

// The briefing's window (IDEA-102). `docs/RESUME.md` is the file every session reads FIRST, which
// makes it a magnet: anything that wants to be seen next session gets written there, and the file
// BOSS's own tree read at session start reached 737 lines two days after an archive pass. The
// shipped practice (context-discipline, *Session-state docs*) already said the cure — decide the
// compaction rule while the file is small, and make the window a NUMBER — and BOSS's own file
// carried no number. This is the runner for that rule: one line when the briefing is past its
// window, silent otherwise. Lines, not tokens, because lines are what `wc -l` and the founder can
// both count; the number is deliberately generous — a briefing that needs 200 lines is already
// carrying history, and `/close` says where history goes (the devlog, which is what the re-entry
// read above actually parses).
export const RESUME_WINDOW = 200;

export function resumeLines(projectDir) {
  const f = join(projectDir, 'docs', 'RESUME.md');
  if (!existsSync(f)) return null;
  try { return readFileSync(f, 'utf8').split(/\r?\n/).length; } catch { return null; }
}

export function printResumeWindow(projectDir, { window = RESUME_WINDOW } = {}) {
  const lines = resumeLines(projectDir);
  if (lines == null || lines <= window) return false;
  console.log(`    ${warn('!')} ${bold('docs/RESUME.md')} ${dim(`is ${lines} lines — past its ${window}-line window. It is a briefing: move what has shipped to the devlog (\`/close\` does this), don't trim it.`)}`);
  return true;
}
