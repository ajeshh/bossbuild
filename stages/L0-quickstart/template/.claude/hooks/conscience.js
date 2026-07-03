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
