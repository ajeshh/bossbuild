---
id: DEC-009
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-21
reversibility: reversible
revisit_by: 2026-11-21
---

# DEC-009 — BOSS stays an incubator, and stops assuming a business

> The charter question raised by IDEA-067.
> Occasioned by Ajesh, 2026-08-21: *"one of the assumption is that all products are built for profit.
> what about creative commons, open source, just for fun and other kind of ideas… how do we support
> from the business end those.. **or release them from needing, but building other support** for
> those items."*

## Context

Audited on the assumption that commercial intent was baked in everywhere. **It isn't.** Licensing is
handled and argued (`/boss` offers MIT / Apache-2.0 / AGPL-3.0; the proprietary default rests on a
correct reversibility argument — *a permissive grant, once published, cannot be revoked*).
`mentor-capital` already holds *"open-source / free… OR not monetized at all (some tools should stay
free)"* as a first-class structure. `/money` is stage-gated. `margin-trap-loop` is dormant
pre-revenue. `/sunset` is the standing precedent that not every project must grow.

The assumption lived in **one load-bearing place and one structural absence**:

1. **The canvas's `Business Model` cell was the only cell in its group with no condition on it**, so
   it was live for every project and counted toward the Quickstart→MVP graduation gate. Its humane
   prompt — *"How will you sustain this without compromising your promise?"* — was **already
   intent-neutral**. Only the *sharpen* assumed money (*"who pays, how much"*). A founder who will
   never charge had to fabricate a revenue line or read as permanently unfinished.
2. **BOSS has one declaration axis where it arguably needs two.** All eight cohorts answer *"how much
   do you already know?"* None answers *"what is this for?"*

**BOSS is its own counter-example.** It is MIT-licensed, and its own canvas answers that cell with
*"calm-company / OSS / patronage… no pricing decision is honest before then"* — **a well-written
deferral in a cell that had no honest way to hold one.**

## Decision

**BOSS remains a just-in-time startup incubator. It stops *assuming* a business.** Those are
different things, and only the second was ever a defect.

1. **The `Business Model` cell stays live for every project, and its sharpen gains a second branch.**
   Sustainability without revenue is *hours, other people, and an ending*: what keeps this alive, who
   else could carry it, what happens when you get bored or busy or hit by a bus, and what would make
   you stop. **This is a harder question than pricing, not a softer one** — most open-source projects
   die of maintainer exhaustion, not of a missing business model.
2. **`/money` gains a "this isn't trying to earn" branch that stops rather than routes.** Its Step 0
   read *where you are in the arc* and had no branch for *not being in it*, so an OSS founder was
   told to run `/interview` or `/pretotype` **to go get a yes they never wanted.** That was BOSS
   selling, and it is now refused by name.
3. **No `intent` axis is built.** Rung 2 of IDEA-067 — a declared field beside `cohort` gating cells
   and re-scoping FEAT-025 — is **deliberately not built.** n=0.
4. **No second body of non-commercial support is built.** Maintainer burnout, contributor pipeline,
   governance-as-succession, funding-for-sustenance: all real, all captured in IDEA-067 rung 3, all
   **n=0 and not to be built on imagination.**
5. **The positioning does not change.** BOSS still says incubator, still says fundable/hireable
   venture. **A non-commercial project is never blocked and never made to lie; it is simply not the
   case BOSS is built around.** Saying otherwise on the website would claim a body of support that
   does not exist — the [[dev-workspace-described-as-shipped]] failure, pointed at a new surface.

## Why

- **It is the smallest change that removes the actual harm.** The harm was never "BOSS lacks OSS
  features." It was that a founder had to **fabricate an answer or stall at a gate** — and the canvas
  explicitly forbids the first. One sharpen branch and one router branch fix that completely.
- **The cell never needed re-framing, only a second branch.** *"How will you sustain this"* was
  already the right question. That is composition over an existing prompt, not an addition —
  EVID-001's mandate, satisfied without argument.
- **The mechanism already existed.** [[DEC-004]] established that a dormant cell never counts against
  graduation, and three neighbouring cells are already conditional. Nothing new was invented.
- **Widening the charter at n=0 is the failure this repo keeps catching.** IDEA-065 and IDEA-066 were
  both parked for exactly this. A second declaration axis, built for a user who has not appeared, is
  the same move wearing a more principled hat.
- **Refusing to sell is a humane position, not a gap.** *"Some tools should stay free"* is BOSS's own
  line. A conscience that nudges toward monetization to fill a cell is the thing BOSS warns about.

## Falsifier

*What would prove this wrong, and by when?*

1. **The graceful handling isn't enough.** If, across **n ≥ 2 real projects**, a non-commercial
   founder gets through the canvas honestly and then hits a *second* wall — the post-launch arc,
   `/comp-eval`, `mentor-capital`, the FEAT-025 render — then the problem was structural after all
   and the `intent` axis is warranted.
2. **The second branch gets fabricated anyway.** If founders answer the sustainability branch with
   the same hand-waving the revenue branch produced (*"I'll maintain it indefinitely"*), the question
   is not doing work and needs a sharper form or a real gate.
3. **The refusal reads as dismissal.** If a founder experiences `/money`'s new stop as *BOSS doesn't
   care about my project* rather than *this verb doesn't apply*, the voice is wrong even though the
   routing is right.

**Check at `revisit_by` 2026-11-21, or on the second occurrence of any, whichever is first.**

## Consequences

- **IDEA-067 rungs 2 and 3 are `deferred`, not open work** — decisions with a written re-open
  trigger, per the `deferred` vocabulary.
- **The website is deliberately untouched.** BOSS handles this quietly and does not advertise it.
  ⚠️ **The accepted cost:** a CC/OSS founder evaluating BOSS has no way to know they won't be pushed
  toward a business model, and may not try it. That is a real acquisition cost, knowingly taken —
  and it is the honest trade for not claiming support that isn't built.
- **BOSS's own canvas can now be re-answered honestly.** Its Business Model cell holds a deferral
  because no other shape was available; the second branch is the shape it needed. Worth doing on the
  next canvas pass — the tool's own record is the first place this should show.
- **`/sunset` gains an upstream partner.** *"What would make you stop?"* now gets asked at canvas
  time rather than only at the end.
