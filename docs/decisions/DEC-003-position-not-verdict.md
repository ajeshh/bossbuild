---
id: DEC-003
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-17
reversibility: reversible
revisit_by: 2026-11-17
---

# DEC-003 — Position, not verdict: BOSS names, the founder chooses, BOSS then does the work

> BOSS's third dogfooded `/decide`. Settles the shape of two things at once — the adopt-time read
> (shipped v0.154.0) and the supersede path in `boss sync` (still to build). Related:
> [DEC-001](DEC-001-founder-layer-brain-cut.md) (the founder/brain cut).

## Context

The release-readiness pass (2026-08-17) found the adopt-an-existing-project path to be the weakest in
the product — while being the path *most* people who try BOSS will take, since they arrive with a
repo. v0.153.0 fixed the mechanics (adopt reads the repo, caps at MVP, offers `/comprehend`, `/welcome`
branches). That left the open question the mechanics couldn't answer: **what should BOSS actually say
to a founder about work they already built?**

The tempting answer was a **report card** — read the repo, grade it, hand back recommendations. It
tests well as a demo. It also collides head-on with the README's own promise (*"Refuses to nag.
**Refuses to grade.**"*), and it lands as a first impression on work the founder is likely defensive
about. The adjacent temptation was to quantify the payoff (*"you'll ship 30% faster"*) — for which
BOSS has **n=1, `stated-pain`, no observed session.**

A second, related question was open in `boss sync`: BOSS's own practices change, and sometimes what
changes is that **an approach BOSS previously taught is now wrong.** `planSync` has no vocabulary for
that — it can add and modify, and its stated policy is *"nothing is removed."*

## Decision

**One principle, applied in both places: BOSS names what it sees, the founder decides, and then BOSS
does the work.**

- **Position, never a verdict.** The adopt-time read reports *where you are* — with the evidence
  attached, and with an explicit account of **what BOSS can't see** (usage, retention, cost, why they
  built it, what they already abandoned). No score, letter, percentage, maturity level or
  traffic-light, ever.
- **Options, never a recommendation dressed as a menu.** Two or three, each with what it would change
  *about their week* and what it costs — always including the legitimate *"nothing yet — keep
  building."*
- **What changes, never what you'll gain.** Describe the new working model honestly. **No quantified
  benefit claims** until there is evidence for one.
- **Abandonment gets named, once, with evidence — and then it's their call.** When something they
  built is working against them, say so plainly and stop. Don't refactor to prove it; don't ask twice;
  record the "no" in `/decide` so it isn't re-litigated next session.
- **If they say yes, BOSS does the migration.** This is the half that makes it fair: naming a problem
  and leaving them with it is a critique; naming it and then doing the work is help.

## Why

- **It makes the founder think instead of comply** (Ajesh, 2026-08-17): *"I like position, because it
  makes the founder think, vs just blind assessment; it provides them with options and how to
  integrate, vs force."* A verdict invites agreement or defensiveness — neither is thinking. A
  position invites a decision.
- **A grade is a dark pattern in this seat.** BOSS's whole differentiator is the humane lens
  (Principle #6). Grading someone's unpaid, unfinished, personal work to create the motivation to
  adopt your tool is manufactured inadequacy. It would make BOSS the thing it warns against.
- **Quantified gains would be BOSS self-fooling.** The product exists to stop founders confusing a
  convincing demo for evidence. Claiming a measured benefit BOSS has never measured is that exact
  failure, committed by BOSS, on its front porch.
- **Forced migration breaks the override grammar.** Every other loop in BOSS is overridable and
  records the override. A sync that silently rewrites how a founder works would be the one place BOSS
  decided *for* them.

## Falsifier

*What would prove this wrong, and by when?* If a real founder (n≥1, **observed behaviour**, not
stated) runs the adopt-time read and asks for a straight verdict — *"just tell me if this is any
good"* — twice or more, the no-grade rule is serving BOSS's principles at the user's expense and gets
revisited. **Check at `revisit_by` 2026-11-17, or on the second such request, whichever is first.**

## Consequences

- `/comprehend` gains a **Position** section (the read, before any write) and an **abandonment**
  section with a fixed name → decide → *then* refactor sequence. **No new skill** — EVID-001's
  compose-and-subtract holds.
- **`boss sync` needs a supersede vocabulary and a removal concept** to honour the second half. This
  is now the top of the queue, and it also gates the subtraction pass: `planSync`
  cannot remove, so merging skills would leave the originals in every project that ever synced.
- The honest cost: BOSS will read as **less impressive in a demo** than a tool that hands back a
  scorecard. Accepted deliberately.
