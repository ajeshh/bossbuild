---
id: design-pattern-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah (PRINCIPLE #1 — pause and sort the pattern UP or DOWN)]
also_relevant: [Brad Frost (atomic design as extraction), Christopher Alexander (a pattern is a recurring problem with a solution), Nathan Curtis (systems that don't decay are curated, not authored once)]
entry:
  - exists: { path: docs/design/PATTERNS.md }
  - count_at_least:
      path_glob: docs/design/reviews/*.md
      pattern: '^#'
      min: 3
      min_files: 3
exit:
  - count_at_least:
      path_glob: docs/design/PATTERNS.md
      pattern: 'PAT-\d+'
      min: 1
drift_moment: capture
---

# Loop: design-pattern (MVP) — the design language grows, or it doesn't

> *"At every natural breakpoint — a mode transition, a shipped feature, **the third time the same
> work repeats** — pause and sort the pattern two ways."* — PRINCIPLE #1.

`extraction-loop` applies that rule to the *work*. This applies it to the *design*, and the design
half needs its own moment because the two breakpoints are different: the work's inflection is a
devlog entry, the design's is a **review**.

**What this loop actually detects: three or more design reviews have happened and the product has
never named a pattern of its own.** That is all. It is a count and an absence, exactly like
`extraction-loop` — and for the same stated reason: a predicate cannot see whether something is
*reusable*. Only the model can. The loop opens the door at the inflection; `/extract` and
`/design-review` do the judgment.

## Why *reviews*, and not components

The obvious predicate would be *"N components exist and no pattern does."* It was rejected for two
reasons worth writing down, because the second one generalizes:

- **The component index moves rungs.** `COMPONENTS.md` is authored at MVP and superseded by the
  generated manifest at V1, so a predicate pointed at it would quietly stop working at exactly the
  moment the project got more sophisticated. A predicate that breaks on graduation is worse than none.
- **Components are not where patterns come from.** A pattern is a recurring *decision*, and decisions
  happen in reviews. Counting components would ask *"is this product big yet?"* when the question is
  **"has this product been thinking, and did any of it stick?"**

Three reviews with nothing learned is the honest shape of that question. A founder who has reviewed
three screens has made the same call more than once — about an empty state, about what a destructive
action says, about how the model admits it is unsure. If none of it reached `PATTERNS.md`, the
product is re-deciding every time, which is the exact cost the pattern layer exists to remove.

## What the moment says

The `capture` frame, pointed at design. Not *"you are missing a document"* — the seeded rows are
already there and already useful. The honest version is narrower and more interesting:

> *Three reviews in, and every pattern in your set is still one BOSS handed you. Anything you've now
> decided twice?*

Then offer the concrete next action, never the vocabulary word: re-read the last three reviews and
name the repeat. `/extract` is the skill if they want the full UP/DOWN sort; adding a row by hand is
a complete answer and usually the right one.

## What closes it

One `PAT-N` row in the **Ours** table. Not a count, not a quality bar — **one**, because the thing
being established is that the product learns at all, and a loop that keeps firing after the founder
has answered it is a loop they will turn off.

## The honest limits

- **It cannot tell a real pattern from a row typed to close the loop.** Nothing can. The same is true
  of `extraction-loop`, and the answer is the same: the cost of a bad row is one line in a file the
  founder owns, and the cost of never prompting is a design language that never forms.
- **It cannot see near-duplicate components** — that is `/design-library`'s manifest at V1, which
  computes them from the code. This loop's signal is *reviews without learning*; that one's is
  *components that repeat*. They are complementary, and neither is the other.
- **It says nothing about the seeded rows.** A product whose only patterns are the ones BOSS shipped
  is not doing anything wrong at review one or two. At review three it is worth asking, once.

## Where it routes

`/extract` (the UP/DOWN sort) · `/design-review` step 4b (the twice-is-a-pattern threshold) ·
`docs/design/PATTERNS.md` **Ours** table. A pattern that proves out beyond this product is a
`/extract` candidate for the shelf it came from — which is the UP half, and the reason this loop
is a member of PRINCIPLE #1 rather than a design convenience.
