#!/usr/bin/env node
// BOSS conscience hook (v0.18.0+) — generic, loop-driven.
//
// Fires on UserPromptSubmit. Reads docs/loops/*.md from the project, classifies
// each loop's state against the predicate-based runtime, returns structured
// signals for any loop drifting. Claude composes the voice; the hook ships a
// schema (Liu's discipline).
//
// Output schema:
//   { hookSpecificOutput: {
//       hookEventName: "UserPromptSubmit",
//       signals: [{ loop_id, type, moment, confidence, evidence, suppress_if }, ...],
//       // For back-compat with v0.16 eval-runner: mirror first signal's fields.
//       moment, confidence, evidence, suppress_if,
//       additionalContext: "..." } }
//
// Always exits 0. Empty output = no signal = stay silent.

import { detectSignals, composeContext, readCohort, readBrainContext, readRelationshipContext, readEvidenceContext, readPauseState, clearPauseState, readMuteState, isMomentMuted, clearExpiredMutes, logActivity } from './lib/loop-runtime.js';
import { detectTaskHygiene } from './lib/task-hygiene.js';
import process from 'node:process';

// The one signal that is NOT loop-driven (IDEA-094 Part 0). Every other moment reads files in the
// project; this one reads the session's own task list out of the host transcript, whose path the
// host hands us on stdin. It is folded in HERE rather than shipped as a second hook, for three
// reasons worth keeping: nothing new has to be registered, there stays exactly one surface that
// speaks, and it inherits `/pause`, per-moment mute and the frequency ledger for free — so a
// founder can turn this down the same way they turn down anything else BOSS says.
//
// Reading stdin is new for this hook and it is on the hot path, so the budget is small and the
// failure is silence. A TTY means nothing is piped (the eval runner, a hand-run), and that path
// resolves immediately rather than paying the timeout.
const HOOK_STDIN_MS = 300;

function readHookInput() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) { resolve(null); return; }
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { data += c; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(null));
    setTimeout(() => resolve(data), HOOK_STDIN_MS).unref();
  });
}

async function transcriptPath() {
  try {
    const raw = await readHookInput();
    if (!raw || !raw.trim()) return null;
    return JSON.parse(raw).transcript_path || null;
  } catch {
    return null;
  }
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

try {
  // Check pause state first (IDEA-011 v0.23.0+). When paused-and-not-expired,
  // exit silent — the founder explicitly asked for this. When paused-and-expired,
  // auto-clear and continue normally. The auto-resume IS the kindness.
  const pause = readPauseState(projectDir);
  if (pause && pause.mode === 'paused') {
    if (!pause.expires || new Date(pause.expires) > new Date()) {
      process.exit(0);
    }
    // Expired — clear the pause; the hook resumes normal operation.
    clearPauseState(projectDir);
  }

  const detected = detectSignals(projectDir);

  // Task hygiene rides alongside the loops rather than inside them: a loop predicate reads files in
  // the project, and this reads the session. It is appended AFTER the loop signals so an ordinary
  // drift moment still leads — the emergent list is real, but it never outranks the founder
  // building the wrong thing. Fails to null on anything unexpected, so a project on a host whose
  // transcript format has moved is byte-identical to one before this shipped.
  const task = detectTaskHygiene(projectDir, await transcriptPath());
  if (task) detected.push(task);

  if (detected.length === 0) {
    process.exit(0);
  }

  // Per-moment mute (v0.72.0) — the founder turned this specific moment down.
  // Surgical sibling of pause: drop only signals whose moment is muted-and-unexpired,
  // then prune any expired mutes (the per-moment silent auto-resume). If muting
  // leaves nothing to say, exit silent, exactly like pause.
  clearExpiredMutes(projectDir);
  const mutes = readMuteState(projectDir);
  const signals = detected.filter((s) => !isMomentMuted(mutes, s.moment));
  if (signals.length === 0) {
    process.exit(0);
  }

  const cohort = readCohort(projectDir);
  // Continuity (IDEA-022 Track 4): only read when a moment is already firing (past
  // the silent early-exit) — bounded + cost-disciplined. null when no brain yet.
  const brain = readBrainContext(projectDir);
  // Learning (the relationship half): how recent nudges landed, so the conscience
  // calibrates instead of repeating. null when no relationship log yet.
  const relationship = readRelationshipContext(projectDir);
  // Evidence (IDEA-045): the conscience gets eyes on docs/evidence/ — a cheap
  // frontmatter projection (counts by grade + most recent). Read only once a moment
  // is already firing (past the silent early-exit), same as brain/relationship.
  // null when no evidence yet → additionalContext byte-identical to before.
  const evidence = readEvidenceContext(projectDir);
  const additionalContext = composeContext(signals, { cohort, brain, relationship, evidence });

  // Frequency ledger (v0.34) — correctness-invisible side effect; only fires
  // reach here (past the silent early-exit). Records facts (moments, judge-bool,
  // injected char count), never estimates. Remove this line and the conscience
  // output below is byte-identical.
  logActivity(projectDir, signals, additionalContext, cohort);

  const first = signals[0];

  const out = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      signals,
      moment: first.moment,
      confidence: first.confidence,
      evidence: first.evidence,
      suppress_if: first.suppress_if || [],
      cohort,
      additionalContext,
    },
  };
  process.stdout.write(JSON.stringify(out));
} catch (e) {
  // Fail silent — the conscience must never block the user's prompt.
  // Errors are written to stderr for the developer to see; hookOutput is empty
  // so the user's session continues normally.
  process.stderr.write(`[conscience hook error] ${e.message}\n`);
}

process.exit(0);
