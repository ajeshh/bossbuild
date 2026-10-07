#!/usr/bin/env node
// BOSS reentry hook — a SessionStart hook. REGISTERED BY DEFAULT (IDEA-077).
//
// WHAT IT DOES: when you come back to a project after a few days, it hands Claude the two facts
// you left behind — what you last landed, and what you said you'd do next — so the session opens
// where you stopped instead of asking you to remember.
//
// WHY IT EXISTS: BOSS already computed this answer. `/close` writes it, `/log` writes it, and
// `boss status` has read it back since v0.231.0 — but only if the founder remembers to type a CLI
// command. `src/brain.js` records the rule this violates, in Ajesh's own words: **"people can
// forget close — a rule that depends on someone remembering is not a mechanism."** That rule was
// applied to the brain's CONTENTS and never to the ritual that produces them. This is the runner
// the MVP overlay's rule 0 ("Open the session before you work in it") never had.
//
// WHY IT IS REGISTERED WHEN THE OTHER FIVE HOOKS ARE DORMANT — the cost argument does not carry
// over, and it is worth being precise rather than making an exception quietly:
//   · `conscience.js` is ALREADY registered by default and fires on EVERY prompt.
//   · This fires ONCE per session start. It is strictly cheaper than what already ships on.
//   · An orientation hook nobody switches on cannot orient anyone. Dormant is the right default
//     for a hook that adds a CHECK; it is the wrong default for one that answers a question the
//     founder is already asking.
//
// WHY IT MATTERS MORE THAN IT USED TO: Claude Code's Remote Control serves a local session to
// claude.ai and the phone. Every other orientation answer BOSS has — `boss status`, `boss map`,
// `boss board`, `boss brain` — is a terminal command, and a founder on a phone has no terminal.
// A hook fires wherever the keyboard is. See IDEA-081.
//
// WHEN IT STAYS SILENT, which is most of the time and is the requirement rather than the fallback:
//   · fewer than REENTRY_DAYS (3) since the last devlog entry — someone who worked yesterday does
//     not need to be told what they were doing;
//   · no `docs/devlog.md` at all — a Quickstart project has not gone quiet, it has not started,
//     and this hook is silent by construction there until `/log` exists at MVP;
//   · the session did not actually START — `source` is `clear` or `compact`, which are mid-session
//     events. The away-read and the open-work list stay out of those (see the next section);
//   · it already fired for this same devlog date — opening three sessions in an afternoon should
//     not replay the same line three times. The marker lives in the per-person state dir (DEC-015),
//     so it is keyed to you and this project and survives a worktree.
//
// ONE MORE JOB, ON EVERY REAL ARRIVAL (IDEA-142): lay down the commit-time key check if this clone
// lacks it. Git copies no hooks, so a cofounder's fresh clone arrives without it — and may never have
// installed the BOSS CLI that `boss sync --apply` needs. This hook already runs from the repo, so it
// is the one place that reaches them. It writes only into a free slot (never over their own
// pre-commit, never past `core.hooksPath`), and the session hears about it once — the write is to
// their `.git/`, and a write nobody is told about is not one BOSS makes.
//
// THE WORK IN FLIGHT, ON EVERY SESSION START — compaction and /clear included (IDEA-153). A
// compaction keeps the chat's summary and drops path-scoped rules and every task found mid-session
// that was never written down; the host's own answer is a SessionStart hook on the `compact` source,
// and this hook used to return early on exactly that source. Now every start re-loads the work in
// flight from its records (`lib/working-state.js`: the worktree's record, else the building FEATs,
// each with its program; else the venture idea). It reads; it writes nothing. Silent when no work is
// in flight. After a compaction it also says the record wins where the summary disagrees.
//
// ⛔ IT NEVER FIRES AT SOMEONE WHO IS AWAY. It fires when they COME BACK, which is the only moment
// it can observe and the only kind one — and per DEC-016 that is now a decision, not a limit.
//
// Output contract (Claude Code SessionStart): `{ hookSpecificOutput: { hookEventName, additionalContext } }`
// on stdout is added to the session's context. Empty output = nothing added. Always exits 0:
// a hook that breaks the session is worse than one that occasionally misses a cue.

import process from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { reentryRead } from './lib/reentry.js';
import { personStatePathForWrite } from './lib/person-state.js';

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

// Only a real arrival counts. `clear` and `compact` are the founder mid-session; `startup` and
// `resume` are the two ways a session actually begins.
const ARRIVALS = new Set(['startup', 'resume']);

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    // If nothing is piped in, don't hang the session. `.unref()` matters as much as the timeout:
    // without it the timer keeps the event loop alive for the full second AFTER `end` already
    // resolved, so every fire cost a second of latency it never needed.
    setTimeout(() => resolve(data), 1000).unref();
  });
}

// Once per devlog date, not once per session. Returns true if this read has already been given.
function alreadyGiven(date) {
  const f = personStatePathForWrite(projectDir, 'reentry-seen');
  try {
    if (readFileSync(f, 'utf8').trim() === date) return true;
  } catch { /* no marker yet */ }
  try { writeFileSync(f, `${date}\n`); } catch { /* a marker we cannot write just means it repeats */ }
  return false;
}

const main = async () => {
  let source = 'startup';
  try {
    const raw = await readStdin();
    if (raw.trim()) source = JSON.parse(raw).source || 'startup';
  } catch { /* unparseable input — treat as a normal startup rather than going silent */ }

  const lines = [];

  // The work in flight — every source, because a compaction and a /clear are exactly when the chat's
  // copy of it is gone (IDEA-153).
  let current = null;
  try {
    const { openWork } = await import('./lib/open-work.js');
    current = (openWork(projectDir) || {}).current || null;
  } catch { /* fail-open */ }
  try {
    const { workingState } = await import('./lib/working-state.js');
    const state = workingState(projectDir, { worktree: current });
    if (state) lines.push(...workingStateLines(state, source));
  } catch { /* fail-open */ }

  if (!ARRIVALS.has(source)) {
    if (lines.length) emit(lines);
    return;
  }

  // Dynamic and caught: a project mid-sync without the lib must still get its session start.
  try {
    const { installCommitGuard } = await import('./lib/commit-secrets.js');
    if (installCommitGuard(projectDir).state === 'installed') {
      lines.push(
        'BOSS just turned on its commit check for this clone (.git/hooks/pre-commit): a commit carrying',
        'a key-shaped secret is stopped before it reaches git history. Tell the founder in one short line',
        'at a natural point — it is a write to their .git — and that `git commit --no-verify` skips it once.',
        '',
      );
    }
  } catch { /* fail-open */ }

  // Open work (IDEA-120): each chat window is its own session and can't see another's. If pieces of
  // work have their own worktrees, name them once, so a new window can say "that's mine" and join
  // it rather than build a second copy in the shared checkout. Silent when there are none.
  try {
    const { openWork, describe } = await import('./lib/open-work.js');
    const open = openWork(projectDir);
    if (open && open.items.length) lines.push(...openWorkLines(open, describe));
  } catch { /* fail-open */ }

  const read = reentryRead(projectDir);
  if (read && !alreadyGiven(read.date)) lines.push(...reentryLines(read));
  if (!lines.length) return;
  emit(lines);
};

function emit(lines) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: lines.join('\n'),
    },
  }));
}

function workingStateLines(state, source) {
  const why = source === 'compact'
    ? 'The conversation was just compacted. This is the work in flight, read from its records rather than the summary — where the two disagree, the record is right. If this session found a task, a decision or a question that is in neither, write it into the record now (a FEAT\'s *Found while building* / *Open questions*, a program\'s *Tasks* / *Open questions*), before it is lost a second time.'
    : source === 'clear'
      ? 'The context was just cleared. This is the work in flight, read from its records; read the record itself before changing code.'
      : 'The work in flight, read from its records. Use it to orient; do not recite it, and do not start on it unless the founder\'s first message does.';
  return [why, '', state.text, ''];
}

function openWorkLines(open, describe) {
  const shown = open.items.slice(0, 6);
  const more = open.items.length - shown.length;
  return [
    `Open work in this repo, one worktree each: ${shown.map((i) => `${describe(i)} at ${i.path}`).join(' · ')}${more ? ` · +${more} more` : ''}.`,
    open.current
      ? `This session is in ${open.current}'s worktree, so what changes here is ${open.current}'s. If the founder's first message is about different work, say which worktree it belongs in before changing anything.`
      : `This session is in the main checkout. If the founder's first message is part of one of these, name it in one line and offer to continue there (enter the worktree by path). New work: offer it its own worktree before editing. Otherwise say nothing about this list.`,
    '',
  ];
}

function reentryLines(read) {
  const last = read.landed || read.feat;
  return [
    `The founder is back after ${read.days} days away. Their own record of where they stopped:`,
    last ? `- Last session (${read.date}): ${last}` : `- Last logged ${read.date}; they did not record what landed.`,
    read.next
      ? `- They said next: ${read.next}`
      : '- No "next" was recorded. `/close` writes one, and it is what makes the next return cheap.',
    '',
    'Open with this in one or two lines — where they left off and what they said was next — then ask',
    'what they want to do. Do not greet them, do not remark on the absence beyond the fact above, and',
    'do not summarise the project. If their first message is already about something else, drop it',
    'entirely and follow them: this is a way back in, never an agenda.',
  ];
}

main().catch(() => { /* fail-open, always */ });
