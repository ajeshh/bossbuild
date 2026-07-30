---
name: judge-traces
description: Error analysis on your real session traces — the Hamel/Shankar discipline applied to your own work. Reads .boss/trace.jsonl (what agents actually did), helps you sort what went wrong into a binary pass/fail failure taxonomy, and routes the real failure modes to /boss-learn. The deliberate, founder-invoked reader for the auto-log trace substrate. Usage - /judge-traces [last N | all]
---

# /judge-traces — read your real traces, find the real failure modes

The 2026 eval discipline (Hamel Husain / Shreya Shankar) is blunt: **error analysis on real traces is
60–80% of the work, and almost no one looks.** `/judge-traces` is "look" — at *your* sessions, not at
golden cases someone imagined. It reads the trace your work already leaves and helps you turn it into a
failure taxonomy you can act on.

This is the **deliberate reader** for the `auto-log` trace substrate (`library/hooks/auto-log.js`). The
hook *collects* (passively, when enabled); this skill *judges* (deliberately, when you ask). They're
kept apart on purpose — collection is never judgment.

## Prerequisite (and graceful degrade)

Reads `.boss/trace.jsonl`. If it doesn't exist or is empty, say so plainly and stop — don't invent
data:
> *"No trace yet. `auto-log` is dormant by default (a SubagentStop hook has a per-subagent cost). Turn
> it on in `.claude/settings.json` — the registration block to paste is in the header of
> `.claude/hooks/auto-log.js`, already in this project — and the trace will accumulate as
> agents do work. Come back here once there's something to read."*

Never fabricate a taxonomy from no data. An honest "nothing to judge yet" is the correct output.

## How to run it

**1. Read the traces.** Load `.boss/trace.jsonl` (each line: `ts`, `session`, `agent`, `files`,
`file_count`). Default to the last ~30; `all` reads everything; `last N` reads N.

**2. Surface the shape, factually first.** Before judging: which agents did what, how often, on which
files. This is the cheap deterministic pass — counts, not opinions. (Hamel's cost hierarchy: cheap
assertions before any judgment.)

**3. Help the founder do error analysis — binary, not scored.** Walk the traces and sort what you can
see into **pass / fail**, never a 1–5 score. Failure modes to look for in agent work:
- `wrong-files` — an agent touched files outside its lane (a coder editing docs, a doc agent editing src)
- `thrash` — the same files churned across many sessions with no shipped outcome
- `silent-scope-creep` — a small ask that fanned into a large diff
- `no-trace-of-the-point` — sessions of work with nothing that maps to a named FEAT / risk
- `<your own>` — the taxonomy is yours; name the modes *you* actually see

**One expert, not a committee** (Hamel): *you* own what "fail" means for this project. Don't average
opinions — make the call.

**4. Don't let the judge grade its own homework.** Where a trace looks like a failure, the read is a
*separate* pass from whatever produced it — and judge the **trajectory** (did the path make sense),
not just whether the endpoint happened to be fine. A right outcome via a wrong path is still a finding.

**5. Route the real modes.** A failure mode that recurs is a candidate for `/boss-learn` — UP (a
practice/guard for every project) or DOWN (a fix in this app). A one-off is just a one-off; don't
systematize noise. Name the count: *"`wrong-files` appeared 4× across 3 sessions — worth a guard."*

## Output

A short report: the factual shape (agents × files × frequency), then the binary failure taxonomy with
counts, then the 1–3 modes worth routing to `/boss-learn`. Keep it to what the trace actually shows.

## Rules

- **No data → no taxonomy.** Honest "nothing yet" beats a fabricated one.
- **Binary, not Likert.** Pass/fail forces the decision; scores hide it.
- **Counts are the signal.** A failure that recurs matters; a one-off doesn't. Lead with frequency.
- **Local-only.** The trace is this machine's; nothing leaves it. This skill reads, never sends.
- **Collection ≠ judgment.** `auto-log` collects passively; this judges deliberately. Never fuse them
  into an always-on auto-grader — that's the trap (the conscience would be grading every session
  unprompted). Judgment is a thing you choose to do.
