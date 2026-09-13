// BOSS task hygiene — the keeper for the EMERGENT task list (IDEA-094 Part 0).
//
// THE PROBLEM, in the founder's words: "it forgets what it was trying to accomplish as it ids
// tasks, and then it needs to reassess everything it built in the chat session to recollect."
//
// BOSS's checklist machinery was all aimed at the PLANNED list — a FEAT's acceptance criteria,
// written at spec time, ticked at `/close`. The list that actually goes missing is the EMERGENT
// one: the tasks identified WHILE working, which were never in the FEAT because nobody knew about
// them an hour ago.
//
// WHY THIS IS A HOOK AND NOT A SENTENCE IN CLAUDE.md. A sentence asking the model to write things
// down is a filter, and BOSS's own verdict on filters is on record (src/brain.js, Ajesh):
// "a rule that depends on someone remembering is not a mechanism." This can be a real check
// because the host hands hooks the session transcript's path on stdin, so how long the session has
// been running — and whether anything durable moved during it — is readable from OUTSIDE the model.
//
// ⚠️ HOST-VERSION-DEPENDENT. What this reads, and what it stopped reading:
//   · v0.293.0 read the session's `TodoWrite` list out of the transcript and compared the time the
//     list last moved against the newest durable file. Claude Code 2.1.268 stopped offering
//     `TodoWrite`/`TaskCreate` on current models (retained: Claude 3.x, Opus 4.0–4.7, Sonnet
//     4.0–4.6, Haiku 4.5) — so on every default model the list never existed and the moment went
//     permanently silent, two weeks after shipping, and nothing could tell (RVW-098). The primitive
//     is not read any more, on any model; re-enabling it would mean writing a host env key into a
//     founder's config, which BOSS declined.
//   · What it reads NOW is only the transcript file's TIMES (created / last written) and the
//     durable files' mtimes. No transcript format is parsed. The remaining dependency is the one
//     fact in the hook's stdin contract — `transcript_path` — and if that goes, this returns null.
// Everything below fails SILENT and fails OPEN: an unreadable transcript produces no signal, never
// an error and never a guess. A missed nudge costs nothing; a false one spends trust, and on a
// per-turn hook it spends it fast.
//
// WHAT THE GATE IS NOW. The list was only ever the trigger; the judgment — "are there items that
// exist in this conversation and nowhere else?" — was always the model's, and the model can see
// its own conversation. So the gate is time-only: the session has been running for a real stretch,
// and nothing durable has been written for that same stretch. Coarser than before, honest about
// it (confidence stays 'medium', the frame says what was and wasn't checked), and it cannot rot
// with a tool's name.
//
// WHAT IT DELIBERATELY DOES NOT DO: read the transcript's contents. Text matching a model's
// prose against a file's contents would false-positive constantly, and the first thing a founder
// would do is turn it off. This compares TIMES, exactly like `outpaced_by` and `harvest-loop`. That
// makes the signal a GATE, not a finding — the frame says so, and the model does the judgment.

import { statSync } from 'node:fs';
import { join } from 'node:path';

// The session has to have been going for this long before its record can be "trailing" it. Short
// sessions are ordinary working state; forty-five minutes is where a chat has accumulated enough
// that its found tasks are worth a durable line.
const MIN_SESSION_MS = 45 * 60 * 1000;

// And nothing durable has moved for this long, measured against the session's last activity. A
// founder who is writing things down should never be nudged about writing things down. The window
// is the same length as the session floor on purpose: "you have been working for 45 minutes and
// nothing on disk has moved in 45 minutes" is one sentence, not two thresholds.
const MIN_STALE_MS = 45 * 60 * 1000;

// A transcript whose last write is older than this is a session being RESUMED after a gap, not a
// session that has been working — its record is not trailing anything yet. Stay silent until it
// has actually run.
const MAX_IDLE_MS = 30 * 60 * 1000;

// Where the emergent list is supposed to live, newest wins. `feature-context.md` is the designated
// home (MVP). `docs/devlog.md` is the fallback and the fairness clause: a founder who is actively
// writing things down should not be nudged about writing things down, whichever file they used.
const DURABLE = ['.claude/rules/feature-context.md', 'docs/devlog.md'];

// The transcript's own two times. `birthtimeMs` is 0 on filesystems that do not record creation
// time; a session whose start cannot be read has no length, and silence is the answer.
function sessionTimes(transcriptPath) {
  try {
    const st = statSync(transcriptPath);
    const start = st.birthtimeMs > 0 ? st.birthtimeMs : 0;
    const last = st.mtimeMs;
    if (!start || !last || last < start) return null;
    return { start, last };
  } catch {
    return null;
  }
}

function newestDurable(projectDir) {
  let newest = 0;
  let which = null;
  for (const rel of DURABLE) {
    try {
      const m = statSync(join(projectDir, rel)).mtimeMs;
      if (m > newest) { newest = m; which = rel; }
    } catch { /* not every rung ships every file */ }
  }
  return { at: newest, path: which };
}

/**
 * @returns a conscience signal, or null to stay silent.
 *
 * Silent when: no transcript · its times can't be read · the session is shorter than
 * MIN_SESSION_MS · it has been idle longer than MAX_IDLE_MS (a resume, not a run) · no durable
 * file exists at all (a project with no devlog has not lost its notes, it has not started) · or
 * something durable was written within MIN_STALE_MS of the session's last activity — which is the
 * whole behaviour this exists to encourage.
 */
export function detectTaskHygiene(projectDir, transcriptPath, now = Date.now()) {
  if (!transcriptPath) return null;
  const session = sessionTimes(transcriptPath);
  if (!session) return null;

  if (session.last - session.start < MIN_SESSION_MS) return null;
  if (now - session.last > MAX_IDLE_MS) return null;

  const durable = newestDurable(projectDir);
  if (!durable.path) return null;
  if (session.last - durable.at < MIN_STALE_MS) return null;

  return {
    loop_id: 'task-hygiene',
    type: 'stalled',
    moment: 'task-hygiene',
    // Deliberately not 'high'. This is a timestamp proxy for a content question, and since
    // v0.315.0 it cannot see the list at all — only that the session ran and the record did not.
    confidence: 'medium',
    evidence: {
      session_minutes: Math.round((session.last - session.start) / 60000),
      durable_file: durable.path,
      durable_stale_minutes: Math.round((session.last - durable.at) / 60000),
    },
    suppress_if: [],
  };
}
