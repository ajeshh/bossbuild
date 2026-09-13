---
id: EXTR-001
type: extraction
owner: product-lead
status: recorded
created: 2026-08-20
trigger: third-repetition
---

# EXTR-001 — a fact the repo already knows should never be a field someone has to remember

## Recent context

The 2026-08-20 arc (v0.181.0 → v0.187.0) started as a backlog audit and turned into a run of the
same bug wearing different clothes. 21 of 64 records disagreed with reality. `shipped_on:` and
`building_since:` had existed since IDEA-034 and almost nothing carried them. `proof:` was invented
to fix the first problem and immediately raised the second — another field, another thing to
remember. Then the venture brain turned out to be empty in BOSS's own repo after 185 releases,
because it is written by `/close` and people forget `/close`.

**Third repetition is the trigger.** Ajesh named it directly: *"people can forget close, how do we
work around that."*

## Candidate 1: derive-don't-stamp

- **What it is:** when a fact is already recoverable from the repo, BOSS derives it instead of
  asking a human to record it. A date comes from `git log --diff-filter=A` on the artifact. A ship
  event comes from a `proof:` path appearing. A conscience's memory floor comes from the records and
  the frequency ledger it already has. The human is asked only for what a machine cannot get:
  **judgment**.
- **Where it lives now:** `src/records.js` (`timeline`, `idCensus`), `src/board.js` (`gitFirst` →
  `shipped_on`/`building_since` fallback), `src/brain.js` (`derivedFacts`),
  `stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js` (`deriveBrainFacts`).
- **Route:** **UP**
- **Rationale:** it is not one feature, it is a design rule that decided four separate builds in one
  week and would have prevented at least two older bugs (`shipped_on:` rotting unfilled; the brain
  being one skipped ritual from empty). It is stack-neutral and applies to any project keeping
  records — exactly the reuse test. **The sharper form: a rule that depends on someone remembering
  is not a mechanism, it is a preference with good intentions.**
- **If UP:** target `library/practices/derive-dont-stamp.md`. Pairs with `seed-to-scale.md` (the
  seam question) and `documentation.md` (which currently tells founders to keep records without
  saying which fields should never have been fields).
- **The boundary that stops it overreaching:** derive FACTS, never judgment, and **label the
  derived layer as derived**. `boss brain` says *"facts, not a read."* The conscience is handed
  *"[derived from the repo — FACTS, not a considered read]"*. A machine-assembled summary that a
  reader mistakes for considered judgment is worse than an empty file, because an empty file is
  honest about being empty.

## Candidate 2: the two-layer floor (derived floor, authored ceiling)

- **What it is:** the specific shape the above takes when a ritual is involved. The mechanism
  supplies a floor that always exists; the ritual adds a ceiling when it runs. Neither blocks the
  other, and the ritual is never made mandatory to get baseline value.
- **Where it lives now:** `readBrainContext` falling back to `deriveBrainFacts`; `boss brain`
  rendering derived facts under an absent read.
- **Route:** **UP**, folded into candidate 1 rather than as its own practice.
- **Rationale:** on its own it is a paragraph, not a practice. Splitting it would create two docs
  that have to agree — the failure `design-system.md`'s withdrawn split already taught (v0.148.0).

## What didn't make the cut

- **`proof:` as a general convention** — NOT-YET. It works, but it has existed for one week in one
  repo. Promoting a field into the library on n=1 is how `library/` fills with things nobody
  validated. **Re-open condition:** a second project (or a real founder) uses `boss records` and the
  field survives contact.
- **The `program:` umbrella** — NOT-YET, same reason and stated more sharply in its own record: the
  graduation to `PROG-NNN` is deliberately unbuilt until a real program needs it.
- **`check:backlog` / `check:dogfood` as shipped gates** — DOWN, already done, and deliberately NOT
  up: they are BOSS's own release machinery. The founder-facing half is `boss records`, which
  already crossed.
