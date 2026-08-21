---
id: canvas-drift-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah]
entry:
  - outpaced_by:
      path_glob: docs/ideas/FEAT-*.md
      behind: docs/ideas/*-canvas.md
      pattern: 'status:\s*shipped'
      min: 3
exit:
  - outpaced_by:
      path_glob: docs/ideas/*-canvas.md
      behind: docs/ideas/FEAT-*.md
      min: 1
drift_moment: outpaced
---

# Loop: outpaced (MVP)

**The second half of the harvest, and the one BOSS's own repo proved it needed.**

[`harvest-loop`](../../../../L0-quickstart/template/docs/loops/harvest-loop.md) closed the first half:
evidence lands, and the picture of the *user* doesn't move. It deliberately left the canvas alone,
and the reason it gave was right — *"evidence bearing on a canvas cell is a looser mapping, and a
looser mapping means more false fires on the one loop whose whole risk is crying wolf."*

**This loop watches a different relationship, and it is a much tighter one.** Not *evidence*
outpacing the canvas — **shipped work** outpacing it. A canvas describes a product. When features
have shipped and the canvas hasn't moved since, it describes a product that no longer exists. There
is no ambiguity about whether shipping bears on "what is this thing"; it definitionally does.

## The n=1 that argued for it

BOSS's own canvas sat at **v0.3 for 80 days while ~154 releases shipped.** By the time anyone looked,
its roster cell named **eight retired agents** and listed three internal-only surfaces as founder
features. Nothing in BOSS noticed — because nothing in BOSS was watching this relationship. It was
found by hand, twice, on two different surfaces, in two consecutive releases.

## What it watches

**Entry** — three or more FEATs whose status starts with `shipped` are newer than the canvas.
**Exit** — the canvas is newer than the newest FEAT: it caught up.

Three, not one, because one shipped feature rarely changes what a canvas *claims*. Three is the point
at which the product has plausibly moved out from under its own description.

## Why `pattern:` exists on the predicate

`outpaced_by` gained an optional content filter for this loop, and it is what keeps it honest.
Without it the entry would read *"three FEAT files changed"* — which fires when a founder **drafts**
three specs. Drafting specs is building; the canvas is not stale because you are working. It is stale
because things **shipped**. The filter matches the base status word (`status: shipped`), never the
whole value, because `shipped (v0.3 — the pull half)` is well-formed and comparing the full string is
the exact bug that mis-filed 12 of 31 cards on BOSS's own board.

## Why the moment is judgment-gated

The predicate counts files and compares times. **It cannot tell whether what shipped changed anything
the canvas asserts.** A bug fix, an internal refactor, a dependency bump — all shipped, none of them
touching Story, Modes of Engagement or Promises. So `outpaced` is in `JUDGE_MOMENTS`: the model reads
the shipped FEATs and the canvas before deciding whether there is anything to say, and **silence is a
common correct output.**

## The line it holds

Same line as `harvest`, and for the same reason: **never rewrite the canvas silently, and never offer
to.** A canvas carries a `version:` and a change history, and both are worth something only because a
human decided each time that the picture had shifted. An artifact refreshed in the background is a
snapshot nobody took.

**And the ask is a pass, never a re-aim.** *"Two cells look out of date"* is one step. *"Re-run your
whole canvas"* is a project, and a conscience that hands out projects gets muted.
