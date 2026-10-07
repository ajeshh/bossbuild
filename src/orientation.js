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
import { hasVerb } from './playbook.js';
import { bossVersion, STAGE_ORDER } from './paths.js';
import { readStageManifest } from './scaffold.js';
import { readStamp } from './registry.js';
import { newlyEarned, describeEarned } from './earned.js';
import { updateNote } from './update.js';
import { built, nextSeam } from './ladder.js';
import { statusConscience } from './conscience.js';
import { collectBoard, computeNext } from './board.js';
import { readPrograms } from './programs.js';
import { renderLadder } from './map.js';
import { modeWord, skillsLine } from './modes.js';
import { driftLine } from './records.js';
import { readiness } from './readiness.js';
import { failNotAProject } from './fail.js';
import { parseArgs } from './args.js';

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
    console.log(`    ${dim(hasVerb('/close', projectDir) ? 'No "next" was recorded — `/close` writes one, and it is what makes the next return cheap.' : 'No "next" was recorded — `/close` writes one when MVP is unlocked; until then, a line at the top of your idea doc does the same job.')}`);
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

// `boss status --line` — where you are in one plain line, for a status bar or a prompt (Claude Code's
// `statusLine`, a Starship module): mode, then the one thing in focus, picked the way
// printFocusAndHeadway picks it. No colour, no count of anything done — a position, never a score.
export function statusLine(projectDir, stamp, { brand = true } = {}) {
  const parts = [...(brand ? ['BOSS'] : []), stamp.mode || stamp.stage];
  try {
    const { cards } = collectBoard(projectDir);
    const { finish, start, pressure, pick } = computeNext(cards);
    if (finish.length) parts.push(`building ${finish[0].id}${finish.length > 1 ? ` (+${finish.length - 1})` : ''}`);
    else if (start.length) parts.push(`ready to build ${start[0].id}`);
    else if (pressure.length) parts.push(`next: pressure-test ${pressure[0].id}`);
    else if (pick.length) parts.push('next: pick the piece the venture needs first');
  } catch { /* a status bar never breaks on a malformed record */ }
  return parts.join(' · ');
}

// ── `boss status` — the command (IDEA-160 S3, from cli.js). The reads above are its parts.
// What you've already BUILT, and the one seam that's open (library/practices/seed-to-scale.md).
// The positive half of orientation: not "here's what you're missing" but "here's what's real."
// Both halves stay silent when they can't be derived honestly — an empty repo gets neither line.
export function printBuiltAndSeam(projectDir, stamp) {
  let have = [];
  let seam = null;
  try {
    have = built(projectDir, stamp);
    seam = nextSeam(projectDir, stamp);
  } catch { return; }

  if (have.length) {
    const names = have.map((h) => h.what);
    const shown = names.slice(0, 4).join(dim(' · '));
    const rest = names.length > 4 ? dim(`  +${names.length - 4} more`) : '';
    console.log(`    ▸ ${bold('Already built:')}   ${shown}${rest}`);
  }
  // Record drift — but only what a founder would want interrupted for: work they finished and did
  // not write down (the good news), or an id claimed by two files (the one finding that is not a
  // chore, because it makes every reference to that id ambiguous). Everything else is real and
  // lives in `boss records`; `boss status` is not a chore list. This restraint is now ENFORCED in
  // `driftLine`, not just described here — it used to fall back to a chore line whenever there was
  // no good news, which is how this surface grew the thing this comment says it doesn't carry.
  try {
    const d = driftLine(projectDir);
    if (d) console.log(`    ${dim('▸ Records:')}        ${d.head} — ${dim('boss records')}`);
  } catch { /* never let a malformed record break status */ }

  // ONE seam, never a list — see nextSeam. Phrased as the cheap thing, not as a chore, because
  // this is the only case where "not yet" would otherwise cost them something unrecoverable.
  if (seam) {
    console.log(`    ${dim(`▸ Not yet (${seam.rung}):`)}  ${seam.what} — ${dim('but the cheap half is worth it now:')}`);
    console.log(`      ${seam.seam}`);
  }
}

// The orientation core of `boss status` (EVID-001): what you're building right now,
// and that you're making headway. Reads the same board projection so status, board,
// and insights all agree on "in flight." Prints nothing it can't derive honestly.
export function printFocusAndHeadway(projectDir, { adopted = false } = {}) {
  let cards;
  try { ({ cards } = collectBoard(projectDir)); } catch { return; }
  const { finish, start, pressure, pick } = computeNext(cards);
  console.log('');
  if (finish.length) {
    const f = finish[0];
    const more = finish.length > 1 ? dim(`   (+${finish.length - 1} more in flight)`) : '';
    // Every other branch of this if-chain ends in a command, and this one — the branch a founder
    // in build hits every single day — used to end in a full stop. So the highest-priority line on
    // the surface was the only one with nothing to DO, while three lower-priority lines below it
    // each carried a pointer. That is the exact complaint EVID-001 filed: *"I forget what feature
    // I'm building."* Being told the id is not the same as being told how to get back into it.
    // The card is the answer — goal, acceptance criteria, the paths that must not break — and it
    // is a read of a file that already exists, not a new surface.
    console.log(`    ▸ ${bold('Building now:')}    ${f.id} — ${f.title}${more}   ${dim(`→ boss board ${f.id}`)}`);
    // Part of a program with a record? Say which, and where its shared rules are (IDEA-145 G5).
    let prog = null;
    const fc = cards.find((c) => c.id === f.id);   // computeNext's entries are trimmed; the card has it
    try { prog = fc && fc.program ? readPrograms(projectDir).get(fc.program) : null; } catch { prog = null; }
    if (prog) console.log(`      ${dim(`part of ${prog.title} — its rules: ${prog.file}`)}`);
  } else if (start.length) {
    // `/spec` is an MVP verb; on a Quickstart project the arrow says where it comes from instead
    // of pointing at a command that is not installed (the playbook's gate, IDEA-118).
    console.log(`    ▸ ${bold('Ready to build:')}  ${start[0].id} — ${start[0].title}   ${dim(hasVerb('/spec', projectDir) ? '→ /spec' : '→ boss unlock mvp, then /spec')}`);
  } else if (pressure.length) {
    console.log(`    ▸ ${bold('Next:')}            pressure-test ${pressure[0].id}   ${dim('→ /canvas')}`);
  } else if (pick.length) {
    // A venture on file, pressure-tested, and only captured capabilities: the next step is a choice,
    // not a verb — which piece does the venture need first (IDEA-114 slice 2).
    console.log(`    ▸ ${bold('Next:')}            pick the piece the venture needs first — ${pick.map((p) => p.id).join(', ')}   ${dim('→ `status: ready`, then /spec')}`);
  } else if (adopted) {
    // An empty board in an ADOPTED repo is the expected state, not a prompt. The old line told
    // someone who had just handed BOSS a shipped app with tests, CI and a deploy config to go
    // "capture an idea" — one line above `Already built: a deploy config · the landing page`, so
    // the same screen both saw their work and asked them to start. What they have not done is let
    // BOSS read it.
    console.log(`    ▸ ${dim('Nothing captured yet — expected here.')} ${bold('/read-repo')} ${dim('reads what you have built and says where you stand.')}`);
  } else if (cards.some((c) => c.column === 'Shipped')) {
    // Everything on the board has shipped. "Nothing in flight yet — capture an idea" is what an
    // empty board says; said to someone who just shipped, it reads as BOSS having forgotten. The
    // headway line below carries what shipped; this one carries the two doors that open after it.
    console.log(`    ▸ ${dim('Nothing in flight — the board is all shipped. /spec the next piece, or /idea what came up while building.')}`);
  } else {
    console.log(`    ▸ ${dim('Nothing in flight yet — /boss or /idea to capture an idea.')}`);
  }
  // Headway — the positive register BOSS lacks: the most recently shipped FEAT and how
  // long ago. Real shipped_on dates only; omitted (never guessed) when absent.
  const shipped = cards
    .filter((c) => c.column === 'Shipped' && /^FEAT/i.test(c.id) && c.shippedAgeDays != null)
    .sort((a, b) => a.shippedAgeDays - b.shippedAgeDays)[0];
  if (shipped) {
    const when = shipped.shippedAgeDays === 0 ? 'today' : `${shipped.shippedAgeDays}d ago`;
    console.log(`    ${ok('✓')} ${bold('Recent headway:')}  shipped ${shipped.id} ${dim(`(${when})`)}`);
  }
}

// A project scaffolded within the last day. Used to hold back tool-upkeep chatter on a first
// run — never to hide a fact about the founder's own work, which is why it is scoped to one line.
export function justScaffolded(stamp) {
  if (!stamp || !stamp.createdAt) return false;
  const t = Date.parse(stamp.createdAt);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 24 * 60 * 60 * 1000;
}

export async function cmdStatus(args) {
  const f = parseArgs(args || []);
  // `--line` feeds a status bar or a prompt, which runs in every folder: outside a project it prints
  // nothing and exits 0 rather than an error into someone's prompt (PROG-004).
  if (f.line) {
    const stamp = readStamp(process.cwd());
    if (stamp) console.log(statusLine(process.cwd(), stamp));
    return;
  }
  const stamp = readStamp(process.cwd());
  if (!stamp) return failNotAProject();
  // `boss status --conscience` — drill into the conscience-state surface
  // (asked-for by eng-builder / indie-hacker / vibe-virtuoso personas in
  // v0.19 reactions: "I want to see what fired and why").
  if (f.conscience) {
    console.log(`\n  ${bold(stamp.name)}`);
    return await statusConscience(process.cwd(), { verbose: !!(f.verbose || f.v) });
  }
  const current = bossVersion();
  console.log(`\n  ${bold(stamp.name)}`);
  // The bridge back comes FIRST when there is one. A founder returning after a week
  // needs "what was I doing" before they need "which rung am I on" — and this is the
  // only moment BOSS can ever observe the gap (see src/orientation.js). Silent when
  // they were here yesterday, and silent when there's no devlog to bridge from.
  printReentry(process.cwd());
  // Then orientation, not version metadata: where you are on the ladder, what
  // you're building right now, and whether you're moving (EVID-001 — a founder can't
  // tell any of these three today). Composed from the board projection; degrades
  // silently if the board can't be read.
  console.log(`  ▸ ${bold('You are here:')} ${stamp.mode || stamp.stage}`);
  console.log(`    ${renderLadder(stamp.installedLayers, stamp.stage)}`);
  printFocusAndHeadway(process.cwd(), { adopted: stamp.adopted === true });
  for (const g of newlyEarned(process.cwd(), stamp)) {
    console.log(`    ${ok('▸')} ${bold('Earned:')}          ${skillsLine(g.skills, 3).replace(/ \(`boss map`\)$/, '')} ${dim(`— ${describeEarned(g.until)}. \`boss sync\` lays ${g.skills.length === 1 ? 'it' : 'them'} down.`)}`);
  }
  // Toward what (IDEA-097): the founder's own sentence for "it worked", if they gave one.
  // Silent otherwise — see src/orientation.js.
  printIntent(process.cwd());
  // Ticket headway is what printFocusAndHeadway just rendered (the last shipped FEAT).
  // This is the other half, and the half that can be wrong: what the work actually
  // taught you. Shipping is motion; evidence is the part that moves the bet.
  printEvidenceHeadway(process.cwd());
  // The briefing's window (IDEA-102): one line when docs/RESUME.md has outgrown what a session
  // should read first, silent otherwise. It says MOVE, never trim — the history has a home.
  printResumeWindow(process.cwd());
  // The one place the CLIMB question gets answered without being asked, and it is one line that
  // prints only when every leg BOSS can check is in place. Silent otherwise, on purpose (IDEA-076):
  // a founder mid-rung gets nothing, the way the re-entry line stays quiet for someone who worked
  // yesterday. And it can go back to silence — supersede the EVID behind it and this stops
  // printing. That is what keeps it off the comfort-device list: a surface that cannot go down is
  // not a status, it is a trophy. The unmet and unknown legs are NOT rendered here; they belong at
  // `boss unlock`, the moment of crossing, where there is room to say what they are.
  const nextStage = STAGE_ORDER[STAGE_ORDER.indexOf(stamp.stage) + 1];
  const nextBar = nextStage ? readiness(nextStage, process.cwd()) : null;
  if (nextBar && nextBar.cleared) {
    // The rung's NAME to read ("MVP"), its WORD to type ("mvp") — `boss unlock` takes the latter
    // and printing the label back at a founder as a command is how a copy-paste fails.
    let nextName = modeWord(nextStage);
    try { nextName = readStageManifest(nextStage).name || nextName; } catch { /* unauthored rung */ }
    // "Everything BOSS can check" read as the whole bar when V1's bar is one checkable condition
    // and two it cannot see. No tally (readiness.js refuses one on purpose); the unknowns are
    // named as yours, in words (IDEA-118).
    const scope = nextBar.unknowns ? 'what BOSS can check is in place; the rest is yours to judge —' : 'everything BOSS can check is in place —';
    console.log(`    ${ok('✓')} ${bold(`Ready for ${nextName}:`)} ${dim(scope)} ${bold(`boss unlock ${modeWord(nextStage)}`)} ${dim('when you are.')}`);
  }
  printBuiltAndSeam(process.cwd(), stamp);
  console.log('');
  console.log(`    ${dim('modes:')}        ${stamp.installedLayers.map(modeWord).join(' → ')}`);
  console.log(`    ${dim('BOSS pinned:')}  ${stamp.bossVersion || 'unknown'}   ${dim('current:')} ${current}`);
  if (stamp.bossVersion !== current) {
    console.log(`    ${warn('⟳')} newer practices available — ${bold('boss changelog')} ${dim('to read what changed,')}`);
    console.log(`      ${bold('/boss-sync')} ${dim('to review the diff and apply it (inside Claude)')}`);
  } else {
    console.log(`    ${dim('up to date with the BOSS installed here.')}`);
  }
  // Hop 1, answered from cache only — `boss status` must never make a network call (see
  // src/update.js). "Up to date with your install" is a different claim from "your install is
  // current", and conflating them is how a founder sits fifty releases behind feeling fine.
  const u = updateNote();
  if (u.state === 'behind') {
    console.log(`    ${warn('⟳')} your INSTALL is behind too — ${bold(u.latest)} is published. ${bold(u.cmd)}`);
  } else if (u.state === 'unknown' && !justScaffolded(stamp)) {
    // Withheld on a project's first day, and only that line. The staleness it reports is the
    // MACHINE's (when `boss update` last asked npm), not this project's — so a folder created
    // ninety seconds ago opened with "unchecked for 19d", which reads as *you are already behind
    // on something* at the one moment a founder has done nothing to be behind on. The claim was
    // true and the framing was a nag. `behind` still prints on day one: that one is a fact about
    // an install that IS out of date, and withholding it would be the dishonest direction.
    console.log(`    ${dim(`whether the install itself is current: unchecked${u.age ? ` for ${u.age}d` : ''} — ${'boss update'}`)}`);
  }
  console.log('');
}
