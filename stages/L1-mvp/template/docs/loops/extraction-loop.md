---
id: extraction-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah (PRINCIPLE #1 — pause to extract patterns)]
also_relevant: [Brad Frost (atomic design as extraction), Bret Victor (the principle of the principle), Don Norman (affordances emerge from use)]
entry:
  - count_at_least:
      path_glob: docs/devlog.md
      pattern: '^## \d{4}-\d{2}-\d{2}'
      min: 3
exit:
  - count_at_least:
      path_glob: docs/extractions/EXTR-*.md
      pattern: '^- \*\*Route:\*\*'
      min: 1
drift_moment: capture
---

# Loop: extraction (MVP) — PRINCIPLE #1's own discipline

> *"BOSS is always scaffolding, but scaffolding is the motion, not the goal. At every natural
> breakpoint — a mode transition, a shipped feature, the third time the same work repeats —
> **pause and sort the pattern two ways:** UP into BOSS as a reusable superset practice. DOWN
> into the app as core functionality."* — PRINCIPLE #1.

For 28 releases the conscience has surfaced caution / done / restraint / coherence / cost /
failure-mode. **PRINCIPLE #1's own discipline had no moment.** Capture-the-reusable was named
in PRINCIPLES.md but undetected by the system meant to encode the principles. v0.29 closes
that — not perfectly (predicate-based heuristics can't see *reusability* — only the model can),
but enough to nudge the founder toward `/extract` at the *breakpoint inflection*.

The loop fires the `capture` moment when a founder has accumulated meaningful work
(heuristic: ≥3 devlog entries) and hasn't yet recorded an extraction decision (an EXTR-NNN
file). The skill `/extract` is the actual judgment — it reads recent work and proposes
specific UP / DOWN routes; the loop just **opens the door** at the inflection.

This is the first hook-runner loop whose entry is *time-of-work* rather than *predicate-of-
file-state*. The heuristic is intentionally simple (devlog entry count); we lean on the model
running `/extract` for the real judgment. The pattern sets a precedent for future moments that
can't be detected by file regex alone.

## Entry artifact

`docs/devlog.md` contains ≥3 dated entries (regex: `^## \d{4}-\d{2}-\d{2}`). Threshold of 3
mirrors PRINCIPLE #1's *"the third time the same work repeats"* signal. Fewer entries = not
yet at a natural breakpoint; the founder is still in initial-build motion.

The devlog is the right surface to gate on because the `/log` skill already produces dated
entries, the `/close` skill nudges devlog discipline at session end, and the format is
stable. Future versions may add complementary entry signals (`boss unlock` recently fired;
FEAT-NNN status flipped to `shipped`; library/ recently grew); for v0.29 the devlog-count
heuristic is enough to mark the inflection.

## Purpose

Surface PRINCIPLE #1 at the right time. Not too early (a founder mid-first-build doesn't have
extractables yet); not too late (by the time copy-paste duplication is everywhere, extraction
is a refactor cost, not a discipline). Three devlog entries is the *"you've shipped something,
now look at what's worth keeping"* inflection.

When the loop opens, the conscience emits a `capture` moment in its own voice: *"You've been
in flow for a few sessions. Pause-extract time. Run `/extract` — it'll look at recent work and
propose 1-3 candidates routed UP (into BOSS's library) or DOWN (into the app's core)."* Never
blocks; the founder decides.

## Exit artifact

≥1 file in `docs/extractions/` matching `EXTR-*.md` with at least one `- **Route:**` line
recorded. The skill `/extract` writes these. The presence of *any* extraction record closes
the loop — the discipline IS the practice of pausing-and-routing, not the volume of
extractions.

To re-open the loop, the founder OR a future BOSS version refreshes the heuristic. v0.29
ships the **first-inflection** version of this loop. Future versions may add recurring re-
opening (e.g., 5+ devlog entries since the most recent extraction); for now, once the
founder has practiced extraction once, the discipline is theirs.

## Drift

Entry satisfied (≥3 devlog entries) AND exit not satisfied (no EXTR-NNN files) → loop is
open → conscience emits `capture` moment.

Confidence is **medium by default** (the heuristic is broad; not every 3-devlog moment is a
real breakpoint), but the skill /extract sharpens this at runtime — if /extract reads recent
work and finds nothing extractable, it records that fact (`- **Route:** none-yet — nothing
loadbearing-enough; check again in N entries`) and the loop closes. So the loop opens broadly,
the judgment narrows.

The voice (cohort-aware via v0.20's framing): name the inflection in one line, point at
`/extract`, hand the decision back. Particularly important to **NOT** sound like a "you've
been productive!" reward — that's the performative-warmth failure mode the voice work has
been catching. Plain seasoned-hand: *"three sessions in — worth pausing to see what's worth
keeping?"*

## How to remix

- **Skip:** legitimate when the founder is in pure-exploration mode and hasn't shipped
  anything yet (the devlog entries are all *"tried X, didn't work"* — no extractables).
  Override:
  ```
  - **OVERRIDE:** skipped `extraction-loop` — rationale: <e.g., devlog entries are all
    exploration / dead-end notes; nothing has stuck enough to be extractable yet; revisit
    after first shipped FEAT>.
  ```
- **Swap discipline:** Frost atomic-design lens (extract atoms → molecules → organisms) vs.
  Ajesh's UP/DOWN router (extract to BOSS library OR to app core) vs. a stack-native pattern
  (e.g., Ruby on Rails *"extract a concern"*). The loop's exit predicate checks for *any*
  extraction record, not a specific framing.
- **Author your own:** project-specific extraction discipline (e.g., a `prompt-extraction-
  loop` for projects where the load-bearing reusable artifact is prompts, not code; or a
  `schema-extraction-loop` for projects where structured-output schemas keep multiplying).

## When this loop re-opens (today: not automatic)

v0.29 ships the first-inflection version. The loop closes after one extraction record and
stays closed. To re-open, the founder deletes/archives old extractions OR a future BOSS
extends the predicate vocabulary with time-aware checks (*"N devlog entries since last
extraction"*). The skill `/extract` is re-runnable anytime; the conscience just doesn't auto-
nudge after the first time.

## Cite

PRINCIPLE #1 — the rule this loop encodes, finally. *"Pause to extract patterns. UP into BOSS
as a reusable superset practice. DOWN into the app as core functionality. `/extract` is
therefore a two-destination router."* The loop is the *when*; `/extract` (and `boss learn`, the CLI under its UP half)
are the *how*.
