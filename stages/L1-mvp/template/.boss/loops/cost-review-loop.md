---
id: cost-review-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Husain (the cadence the eval-quality loop demands), Ajesh Shah (PRINCIPLE #1 applied to spend — the discipline only works when both halves run)]
also_relevant: [Liu (structured outputs make cost-attribution mechanical), Maurya (running-the-business cadence)]
entry:
  - exists: { path: docs/ai-cost-budget.md }
exit:
  - count_at_least:
      path_glob: docs/cost-reviews/REVIEW-*.md
      pattern: '^- \*\*Total spend:\*\*'
      min: 1
drift_moment: cost-stale
---

# Loop: cost-review (MVP) — the cadence the budget doc declared

> An audit named this as a discipline hole: *"`/ai-cost`'s weekly review cadence is
> declared in `docs/ai-cost-budget.md` but no skill reads `.boss/cost-log.jsonl`. The cadence
> is unenforced."* This loop closes that. /ai-cost declares the budget; /cost-review reads the
> ledger; both halves required.

The loop opens once the founder has run `/ai-cost` and a budget doc exists. Until at least
one cost-review file is recorded, the loop emits the `cost-stale` moment — *"you declared
the budget; you haven't looked at the ledger yet."* The first review closes the loop.

This is the **second time-of-work entry pattern** (after extraction-loop). Entry is
*budget declared* (a deontic gate — once you commit to budget discipline you also commit to
read it); exit is *first review recorded*. Future versions may add recurring re-opening when
predicates gain time-awareness.

## Entry artifact

`docs/ai-cost-budget.md` exists. This is the same exit predicate as cost-budget-loop, just
shifted in role: the moment cost-budget-loop closes (budget declared + logger wired), the
cost-review-loop opens (now read what you wired). The two loops form a sequence: declare →
read → declare-adjustments → read-again.

## Purpose

Force the reading half of the discipline. Most projects ship `/ai-cost` and then never look
at the ledger; the budget becomes aspirational. This loop closes the gap between *"we
declared"* and *"we know."* The skill `/cost-review` is the actual read; the loop opens the
door at the first reasonable moment (immediately after the budget is declared).

## Exit artifact

≥1 file matching `docs/cost-reviews/REVIEW-*.md` containing a `^- \*\*Total spend:\*\*` line.
The `/cost-review` skill writes these. The presence of *any* review with real numbers closes
the loop; the discipline IS the practice of reading, not the volume of reviews.

To re-open the loop (for recurring weekly reviews), the founder can either:
- Rename or archive old reviews into a sub-directory (`docs/cost-reviews/archive/`) — old
  files no longer match the glob; loop re-opens.
- Or simply re-run `/cost-review` weekly; the existence of a *newer* review doesn't change
  the loop state today (predicate vocabulary doesn't compare file ages — same gap that
  extraction-loop hit; same trade-off).

The loop is the **first-review inflection.** Future versions may add time-aware
predicates (*"latest review file's mtime is older than 7 days"*) to enforce recurring cadence.

## Drift

Entry satisfied (budget doc exists) AND exit not satisfied (no review file) → loop is open →
conscience emits `cost-stale` moment.

Confidence: low immediately after the budget is declared (the founder might still be in
mid-session running other discipline skills; ledger may be empty); medium if the budget is
older than a session or two; high if real spend has accumulated in the ledger without a
review on record.

The voice (cohort-aware): name the unread-ledger gap in one line, point
at `/cost-review`, hand the decision back. Don't sound like a productivity-reward;
*"you declared a budget — worth looking at what actually happened?"* lands better than
*"great, time to review!"*

## How to remix

- **Skip:** legitimate when the ledger is genuinely empty (no LLM calls yet — though usually
  in that case `cost-budget-loop` is still open and this one shouldn't fire yet) OR when the
  founder is in a single concentrated build session and reviewing-then-restarting would just
  fragment attention. Override:
  ```
  - **OVERRIDE:** skipped `cost-review-loop` — rationale: <e.g., ledger has < 50 entries;
    not yet enough signal to surface; re-check after FEAT-NNN ships>.
  ```
- **Swap discipline:** Maurya's running-the-business weekly review vs. Husain's eval-quality
  loop (review the eval set + costs together) vs. Liu's structured-outputs lens (track
  cost-per-structured-schema-shape, not just per-call). Loop's exit predicate just needs
  *some* review with real numbers; the discipline framing is the founder's.
- **Author your own:** a complementary review loop (e.g., `eval-review-loop` for re-running
  eval sets weekly; `failure-state-review-loop` for confirming declared handlers actually
  caught the recurring failures). Same time-of-work pattern.

## When this loop re-opens (today: requires founder action)

This is the first-review version. Once a review file exists, the loop stays closed —
even if the review is stale (older than the cadence the doc claims). The recurring version
is gated on the predicate vocabulary gaining time-awareness; same dependency as
extraction-loop.

For now: founders running the weekly cadence either re-run the skill or rotate old reviews
into an archive directory. The conscience doesn't auto-nudge after the first read.

## Cite

Husain (look-at-your-data, applied to spend not just quality — *"almost all AI cost problems
are visible in the ledger, and almost no one keeps one OR reads it"*). Ajesh Shah (PRINCIPLE
#1 applied recursively: declaring is half; reading is the other half; both required).
Maurya (running-the-business cadence — the review IS the running). Liu (structured outputs
make per-call cost-attribution mechanical, not vibes).
