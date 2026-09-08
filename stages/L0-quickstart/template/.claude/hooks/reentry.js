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
//     events. Firing there would be the over-fire the conscience spends its whole design avoiding;
//   · it already fired for this same devlog date — opening three sessions in an afternoon should
//     not replay the same line three times. The marker lives in the per-person state dir (DEC-015),
//     so it is keyed to you and this project and survives a worktree.
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

  if (!ARRIVALS.has(source)) return;

  const read = reentryRead(projectDir);
  if (!read) return;
  if (alreadyGiven(read.date)) return;

  const last = read.landed || read.feat;
  const lines = [
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

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: lines.join('\n'),
    },
  }));
};

main().catch(() => { /* fail-open, always */ });
