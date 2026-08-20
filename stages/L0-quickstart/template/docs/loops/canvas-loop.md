---
id: canvas-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ash Maurya, Ajesh Shah]
also_relevant: [David J. Bland, Eric Ries]
entry:
  - count_at_least:
      path_glob: docs/ideas/IDEA-*.md
      pattern: '^- [0-9]{4}-[0-9]{2}-[0-9]{2}'
      not_path_glob: docs/ideas/*-canvas.md
      exclude_files_matching: '^status:\s+dropped'
      min: 3
exit:
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      pattern: 'Riskiest assumption:\*\*\s+[^_].*[a-zA-Z0-9]{3,}'
      related_idea_not_matching: '^status:\s+dropped'
drift_moment: caution
---

# Loop: canvas (Quickstart)

The validation-discipline loop. The founder has captured enough thinking that *which bet is real*
becomes a live question. This loop closes when at least one active idea has a sharp riskiest
assumption — the gating cell of the Humane Product Canvas.

This loop's drift IS moment #1 of the conscience — the "what does this prove?" caution. Until
v0.18.0 the detector was hand-coded in bash; now it's a generic predicate evaluation on this
loop's entry/exit.

## Entry artifact

≥3 dated capture-log entries across active (non-dropped) idea files. That's the threshold where
"capture mode" stops being honest exploration and starts being avoidance of validation.

The threshold is generous on purpose. Two captures is a brainstorm; three is starting to be a
pattern. The conscience speaks gently here; it doesn't lecture.

## Purpose

Pressure-test ideas as humane businesses (Ajesh Shah's Humane Product Canvas) with sharp Lean/
Maurya-style commercial prompts. Filled just-in-time. The riskiest-assumption cell is the gate.

The `/canvas` skill is how this loop is run.

## Exit artifact

≥1 active idea has a canvas (`IDEA-NNN-canvas.md`) with a *real* riskiest-assumption line — at
least 3 alphanumeric chars, not a placeholder, not a single `?`. The regex tightening (v0.16.0)
specifically rejects `_(...)`, `_TBD_`, `?`, and other minimal-substance fills.

The exit also filters by *active idea* — a filled canvas for a dropped idea doesn't satisfy the
exit (validation discipline on something the founder has walked away from doesn't demonstrate
validation discipline on something they're still chasing).

## Drift

`entry: satisfied` (≥3 active captures) AND `exit: not satisfied` (no canvas has a real
riskiest assumption) = loop is OPEN.

When open, the conscience emits a `caution` signal. The model composes the voice (per
`boss-voice` memory: seasoned hand who doesn't need credit; assume intelligence; never assume
knowledge). The signal hands a frame and an ask, never canned copy.

## How to remix

- **Skip:** rarely legitimate. If you're skipping the canvas, you're betting your time on a bet
  you haven't pressure-tested. Override grammar:
  ```
  ## YYYY-MM-DD
  - **OVERRIDE:** skipped `canvas-loop` on IDEA-NNN — rationale: <why this specific
    idea doesn't need it (e.g. micro-project, throwaway, similar product previously
    validated)>.
  ```
- **Swap discipline:** the Humane Product Canvas is one of many possible frameworks. Ash Maurya's
  Lean Canvas, Osterwalder's Business Model Canvas, or the smaller "one-pager test" are all
  legitimate alternatives. Same loop type (entry, exit predicates); different practice. Note in
  the canvas file's frontmatter (`framework: lean-canvas`).
- **Author your own:** a *domain-specific* pressure-test loop (e.g., a regulatory-canvas-loop
  for a medical product; a fairness-canvas-loop for an algorithmic system). Author the loop
  spec; `/boss-learn` UP if generalizable.

## When this loop re-opens

- An idea sharpens enough that its previously-filled canvas needs a new pass (frequent;
  canvases are snapshots not blueprints — re-open is normal)
- A new active idea is captured without a canvas (re-opens for that specific idea)
- The riskiest-assumption test ran and *disconfirmed* — exit no longer satisfied
