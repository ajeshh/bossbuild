---
id: DEC-006
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-20
reversibility: reversible
revisit_by: 2026-11-20
---

# DEC-006 — One venture coach, whose remit scales by rung

> Occasioned by Ajesh, 2026-08-20: *"i really feel like mentor-money, fundraising, and pitch could be
> baked into vc or incubator coach role or something like that? it just continues to scale in what
> they have as their skill set."* Related: [DEC-005](DEC-005-one-designer-one-architect.md) (the
> merge precedent and the independence line), IDEA-064
> (naming, which this defers to).

## Context

Asked earlier the same day *"why 4 mentors?"*, I argued against merging on the grounds that
`/consult`'s divergence mechanism would die — its only worked example is literally *"fundraising says
raise now to fund the GTM motion; business says your unit economics aren't ready."* **That objection
was partly right and stated too strongly.** Merging removes one divergence pair; it does not kill the
mechanism, which still has `architect` ↔ `founder` (build speed vs. the bet) and `customers` ↔ the
money lens (growth vs. margin).

The second framing is different from the first, and it is the one that changes the answer:
**a role whose skillset scales, rather than roles that arrive.**

Two pieces of evidence:

**BOSS ships a heavier org than the thing it models.** Its own one-line description is *"a
just-in-time startup incubator."* A real incubator does not staff three specialists for money, the
raise, and the story — **one partner covers all three**, and gets deeper as the company does. This is
the same shape as the finding that drove [DEC-005](DEC-005-one-designer-one-architect.md): BOSS
shipped a `ui-designer`/`ux-designer` split to founders while running a single `designer` itself.

**The founder cannot tell which of the three to ask.** That is what `/consult` exists to solve — and
needing a router to *find a mentor* is a smell about the roster, not a feature of the router.

## Decision

**`mentor-capital` + `mentor-fundraising` + `mentor-pitch` become ONE role, seated at MVP, whose remit
widens by rung.**

1. **Seated at MVP**, where `mentor-capital` already sits (v0.189.0 moved it there because `/money`'s
   central step — *the first price, said out loud* — names it as owner).
2. **Its remit scales rather than its chair count.** At MVP it is the money-and-model lens. At V1 the
   raise question and the story become live. At Scale it holds all three at operating depth. **This
   is new for BOSS: capability that grows *inside* an agent, rather than agents appearing.** It is
   arguably more faithful to "just-in-time" than the additive roster — the coach is there from the
   start and deepens, which is what an incubator relationship actually looks like.
3. **`mentor-founder` does NOT fold in.** It stays the Quickstart cornerstone. It asks *is this worth
   building at all* — a prior question to *how does it sustain itself*, and the one lens that must
   still be able to say "none of this should exist."
4. **The name is NOT decided here.** Candidates: `mentor-capital`, `mentor-backing`,
   `mentor-venture`, `mentor-coach`. It goes through IDEA-064's
   persona check, per DEC-005's rule: **subtract before rename, or you rename twice.**

## Why

- **It matches the product's own metaphor.** BOSS calls itself an incubator; an incubator coach is
  that made literal. Three specialists is a consulting firm.
- **Ajesh's argument is the architectural one.** *"It continues to scale in what they have as their
  skill set"* describes growth-in-place, and BOSS's mode ladder is otherwise entirely
  arrival-based. A roster that only ever grows by *addition* will keep producing the lumpiness
  v0.189.0 just corrected (1 / 3 / 4 / 0 across the rungs).
- **The rename pass just churned this roster.** Merging now is one migration; merging later is a
  second, on names founders have already synced. `supersedes.json` now has ten agent entries and the
  path is exercised.
- **The divergence loss is one pair, not the mechanism.** And a merged coach can be instructed to
  surface the tension explicitly — see the guard below.

## 🔴 The guard this decision must carry

DEC-005 refused to fold schema into the architect because *"an agent that also owns the schema is
being asked 'is this premature?' by someone with a stake in the answer being no. Advisory
independence is the whole reason the line exists."*

**The same pressure exists here, in a weaker but real form.** `mentor-fundraising`'s entire value is
**defaulting to "not yet."** Merge it with the role that helps build the deck, and *"should you
raise?"* is being answered by someone whose other half exists to make raising go well. The deck is a
work product; its existence pulls toward using it.

It is weaker than the schema case — the coach does not *produce* the raise, the founder does, and
there is no artifact to self-review on the **whether** question. But it is not zero. So:

- **"Not yet" is a hard, named stance in the merged prompt** — not a position it weighs and averages.
  It must be able to say *"the honest answer is don't raise, and I am the one who'd help you if you
  did."*
- **It must surface its own internal tension**, in `/consult` and out of it: *"the raise case says X;
  the economics say Y"* — the same sentence the panel used to get from two agents. Structurally less
  guaranteed than two chairs, and therefore written down as a requirement rather than assumed.
- **It never drafts a deck while the raise question is open.** Story work for customers and hires is
  always fine; a *pitch deck* is downstream of a decided raise.

## Falsifier

*What would prove this wrong, and by when?*

1. **The independence eroded.** If, across **n ≥ 2 real sessions**, the merged coach is asked *should
   I raise* and answers without ever voicing the not-yet default — or produces deck work while the
   question is open — the guard failed and the fundraising lens needs its own chair back.
2. **The tension stopped surfacing.** If `/consult` panels including this coach stop showing any
   internal money-vs-raise disagreement over **n ≥ 3 panels** where one plainly exists, then
   "one agent, please disagree with yourself" does not work and separate agents were doing real
   structural work.
3. **The scaling remit never scaled.** If founders at MVP only ever get pricing help and the V1/Scale
   depth never materialises, the merge bought simplicity by quietly dropping two lenses.

**Check at `revisit_by` 2026-11-20, or on the second occurrence of any, whichever is first.**

## Consequences

- **Three agent files become one**; `supersedes.json` gains three more `kind: "agent"` entries with
  `migrate:` lines. It already carries ten, so the path is proven.
- **`/consult` needs rewriting in three places** — the seating line, the lens map (*"a raise question
  → fundraising + money + founder"* collapses), and **the worked divergence example, which is
  currently this exact pair.** A replacement example must come from a pair that still exists.
- **Manifest churn:** L1 gains the merged role; L2 loses two agents and is left with **zero** — it
  would hold `/board`, `/design-library` and the drift loop, and no agents at all. That is worth
  looking at directly rather than discovering later.
- **`docs/MENTORS.md`, `boundary.json` and the mentor practitioner lineages** (Skok, Janz,
  Osterwalder, Ramanujam, Raskin, Miller, Neumeier) all consolidate into one file. The lineage list
  gets long; that is a real readability cost of the merge and is accepted.
- **The honest cost:** three sharp, self-explanatory names are replaced by one broader one, and
  `eng-builder`/`returning-founder` cohorts who know exactly what "fundraising mentor" means lose a
  precise handle. Accepted for the same reason DEC-005 accepted it — the beginner cohorts are the
  ones the mode ladder exists to serve.
