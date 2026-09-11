// BOSS task hygiene — the keeper for the EMERGENT task list (IDEA-094 Part 0).
//
// THE PROBLEM, in the founder's words: "it forgets what it was trying to accomplish as it ids
// tasks, and then it needs to reassess everything it built in the chat session to recollect."
//
// BOSS's checklist machinery was all aimed at the PLANNED list — a FEAT's acceptance criteria,
// written at spec time, ticked at `/close`. The list that actually goes missing is the EMERGENT
// one: the tasks identified WHILE working, which were never in the FEAT because nobody knew about
// them an hour ago. BOSS had no artifact for it, and the host's primitive for it (`TodoWrite`) was
// never once mentioned in the shipped surface — the same blind spot IDEA-077 found for
// `SessionStart`.
//
// WHY THIS IS A HOOK AND NOT A SENTENCE IN CLAUDE.md. A sentence asking the model to write things
// down is a filter, and BOSS's own verdict on filters is on record (src/brain.js, Ajesh):
// "a rule that depends on someone remembering is not a mechanism." This can be a real check
// because the host writes every tool call, inputs included, into the session transcript, and hands
// hooks its path on stdin. So the list the model is holding is readable from OUTSIDE the model.
//
// ⚠️ HOST-VERSION-DEPENDENT, CHECKED 2026-09-10. Two facts with a date on them:
//   · `~/.claude/todos/` does NOT exist on this version — the transcript is the only route.
//   · The transcript is JSONL, one object per line, each with `timestamp` and a `message.content`
//     array whose `tool_use` blocks carry `name` and `input`.
// Both will rot. Everything below fails SILENT and fails OPEN: an unreadable or unfamiliar
// transcript produces no signal, never an error and never a guess. A missed nudge costs nothing;
// a false one spends trust, and on a per-turn hook it spends it fast.
//
// WHAT IT DELIBERATELY DOES NOT DO: match todo text against file contents. Wording differs between
// a todo and the line someone writes down, so text matching would false-positive constantly and
// the first thing a founder would do is turn it off. This compares TIMES, exactly like
// `outpaced_by` and `harvest-loop`: the list moved, and nothing durable moved after it. That makes
// the signal a GATE, not a finding — the frame says so, and the model does the judgment.

import { readFileSync, statSync, openSync, readSync, closeSync } from 'node:fs';
import { join } from 'node:path';

// Read at most this much from the END of the transcript. A live session's file runs to megabytes
// and this hook has a 5-second budget it shares with the loop runtime. Reading the tail means a
// TodoWrite older than the window is invisible — which UNDER-fires, the safe direction.
const TAIL_BYTES = 256 * 1024;

// Below this, staying quiet is right. One or two open items is ordinary working state that the
// model is actively holding; it is at four-plus, across a long session, that the list starts
// outliving the attention on it.
const MIN_OPEN = 3;

// Where the emergent list is supposed to live, newest wins. `feature-context.md` is the designated
// home (MVP). `docs/devlog.md` is the fallback and the fairness clause: a founder who is actively
// writing things down should not be nudged about writing things down, whichever file they used.
const DURABLE = ['.claude/rules/feature-context.md', 'docs/devlog.md'];

// The list has to be AHEAD by a real margin, not by a clock artifact. The two times being compared
// come from different places — an ISO string the host wrote into the transcript, and a filesystem
// mtime — and `utimes` truncates fractional seconds on some filesystems, so a founder who writes a
// file the instant after the list moves can land microscopically "behind" it. Found by a test that
// set both to `now` and got a signal. A ten-minute floor removes that whole class, and it makes
// the signal more conservative in the direction that matters: it fires when a file is genuinely
// trailing, never when someone is actively working in both.
const MIN_STALE_MS = 10 * 60 * 1000;

function tail(path, bytes) {
  let fd;
  try {
    const size = statSync(path).size;
    const start = Math.max(0, size - bytes);
    const len = size - start;
    if (len <= 0) return '';
    const buf = Buffer.alloc(len);
    fd = openSync(path, 'r');
    readSync(fd, buf, 0, len, start);
    return buf.toString('utf8');
  } catch {
    return '';
  } finally {
    if (fd !== undefined) { try { closeSync(fd); } catch { /* nothing to do */ } }
  }
}

// The last TodoWrite in the window, with the time it happened. Returns null for "nothing found",
// which is a complete and common answer — a session that never identified a task has no list to
// lose, and this must be silent for it.
function lastTodoList(text) {
  const lines = text.split(/\r?\n/);
  // Drop the first line: a tail read almost always begins mid-object.
  for (let i = lines.length - 1; i >= 1; i -= 1) {
    const line = lines[i];
    if (!line || line.indexOf('"TodoWrite"') === -1) continue;
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    const content = obj && obj.message && obj.message.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (!block || block.type !== 'tool_use' || block.name !== 'TodoWrite') continue;
      const todos = block.input && block.input.todos;
      if (!Array.isArray(todos)) continue;
      const at = Date.parse(obj.timestamp);
      return { todos, at: Number.isNaN(at) ? 0 : at };
    }
  }
  return null;
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
 * Silent when: no transcript · no TodoWrite in the window · fewer than MIN_OPEN open items ·
 * no durable file exists at all (a project with no devlog has not lost its notes, it has not
 * started) · or the newest durable write is less than MIN_STALE_MS behind the list, which covers
 * both the case that matters — something was written down after the list moved, the whole
 * behaviour this exists to encourage — and the clock artifact that makes those two times
 * unreliable at second resolution.
 */
export function detectTaskHygiene(projectDir, transcriptPath) {
  if (!transcriptPath) return null;
  const text = tail(transcriptPath, TAIL_BYTES);
  if (!text) return null;

  const list = lastTodoList(text);
  if (!list) return null;

  const open = list.todos.filter((t) => t && t.status !== 'completed');
  if (open.length < MIN_OPEN) return null;

  const durable = newestDurable(projectDir);
  if (!durable.path) return null;
  if (!list.at) return null;
  if (list.at - durable.at < MIN_STALE_MS) return null;

  const minutes = Math.floor((list.at - durable.at) / 60000);
  return {
    loop_id: 'task-hygiene',
    type: 'stalled',
    moment: 'task-hygiene',
    // Deliberately not 'high'. This reads host state through a format BOSS does not own, and it
    // is a timestamp proxy for a content question. The frame is written to match that.
    confidence: 'medium',
    evidence: {
      open: open.length,
      total: list.todos.length,
      in_progress: open.filter((t) => t.status === 'in_progress').length,
      durable_file: durable.path,
      durable_stale_minutes: minutes,
      // The first few, so the frame can be specific instead of talking about "your tasks".
      sample: open.slice(0, 3).map((t) => String(t.content || '').slice(0, 80)),
    },
    suppress_if: [],
  };
}
