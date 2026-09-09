---
id: DEC-008
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-20
reversibility: reversible
revisit_by: 2026-11-20
---

# DEC-008 — Desk research is context, not evidence, and never becomes an `EVID`

> The blocker named in IDEA-066's open
> question 2, which gated its remaining Tier-1 items. Related:
> [DEC-004](DEC-004-canvas-frames-humane-as-floor.md) (the answer store),
> FEAT-025 (holes render, never fill).

## Context

`/comp-eval` shipped in v0.190.0 and produces findings about the world: what a rival charges, what
they do, where they're weak. The four Tier-1 items behind it — market sizing, pricing anchors,
channel research, why-now evidence — produce the same *kind* of thing. All of it needs somewhere to
live and some notion of how much to trust it.

The obvious move was to reuse `EVID-NNN`. It already exists, it already carries grades, and it is
already what the conscience reads. **That is the trap.**

`EVID`'s ladder does not describe confidence in general. It describes **what a person did**:

- `stated-pain` — someone *said* it hurts. Weakest; talk is nearly free.
- `observed-behavior` — you *watched* them struggle, reach for a workaround, or bounce.
- `commitment` — they gave up something real: time, money, reputation, a calendar slot.

**A competitor's pricing page did not do any of those things.** Filing it on that ladder is not a
loose fit, it is a category error — there is no rung it could honestly occupy.

## 🔴 The consequence that actually decides this

The conscience **reads the evidence ledger**. `/evidence` says so plainly: the conscience *"gets
quieter when commitments exist."* The whole design assumes the ledger is expensive to fill, because
filling it means talking to people.

**If desk research counted as `EVID`, a founder could raise their evidence grade by googling.** An
afternoon of competitor research would quiet the exact nudge that exists to push them toward a real
conversation — and it would do it while the riskiest assumption remained completely untested. That
inverts the ledger's entire purpose, and it would be almost invisible, because the records would look
legitimate.

## Decision

**Desk research is context. It lives in the artifact it informs, with per-claim provenance, and it
never becomes an `EVID`.**

1. **Findings live where they are used**, not in a parallel store. Competitors in
   `docs/competition/`; market size in the canvas People cell; pricing anchors in Business Model;
   why-now in Story. There is **no `RESEARCH-NNN` record type** and no new ID.
2. **Provenance travels with the claim, not with a grade**: a **source URL** and a **`checked` date**,
   or the claim is marked `unverified`. This is `/comp-eval`'s rule generalised — it was written for
   the case where fabrication is most tempting, and it turns out to be the right rule everywhere.
3. **The `EVID` ladder is untouched and stays about people.** No fourth rung, no `desk` grade, no
   "research-grade" variant. A ladder that grades two different kinds of thing grades neither.
4. **Desk research can *motivate* an `EVID`, never substitute for one.** Learning that three rivals
   charge $40 is context; watching a customer switch from one is evidence. The honest move when
   research raises a question is to point at `/interview`.
5. **The renders read both, and label the difference.** `boss case` and the canvas cite research with
   its source and evidence with its grade, **visibly distinguished**. A data room that blurs
   "we found this on their pricing page" into "we verified this with customers" is the
   FEAT-025 Layer-3 failure wearing a citation.

## Why

- **It protects the one number that matters.** The persona's `synthetic% · real%` ledger and the
  conscience's evidence read are only meaningful if "real" means *a person did something*. Desk
  research entering that pool is the same failure as the persona refreshing itself silently:
  a synthetic read laundered into a real one.
- **It is compose-not-add.** `/comp-eval` already demonstrated the pattern end to end. Nothing new is
  needed — no ID type, no ladder, no store. EVID-001's mandate holds.
- **Provenance is a better fit than grading for this class of claim.** A pricing page is either
  currently true or currently stale; it is not weakly or strongly true. **Date and source answer the
  real question; a grade would invent a dimension that doesn't exist.**
- **It keeps the expensive thing expensive.** Talking to people is the costly, valuable act BOSS
  exists to push founders toward. Anything that makes the ledger cheaper to fill makes BOSS worse at
  its job.

## Falsifier

*What would prove this wrong, and by when?*

1. **Findings get orphaned.** If, across **n ≥ 3 real projects**, research consistently has no
   artifact to live in — a founder researches something genuinely useful and there is nowhere honest
   to put it — then "lives where it is used" is too clever and a real store is warranted.
2. **The distinction stops being legible.** If a `boss case` render, or a founder reading their own
   canvas, cannot tell sourced-research from graded-evidence at a glance, then labelling was not
   enough and the two need stronger separation than a citation style.
3. **The conscience misreads context as evidence anyway.** If a moment goes quiet because
   `docs/competition/` filled up, the isolation failed in exactly the way this decision exists to
   prevent, and the ledger read needs to be made explicit about what counts.

**Check at `revisit_by` 2026-11-20, or on the second occurrence of any, whichever is first.**

## Consequences

- **IDEA-066's Tier 1 is unblocked** — market sizing, pricing anchors, channel research and why-now
  all now have a defined home and provenance rule, and none of them needs new machinery.
- **`/evidence` should say the boundary out loud.** A founder who has just run `/comp-eval` may
  reasonably try to file a finding as evidence; the skill should name why it doesn't belong rather
  than silently accepting it.
- **The market-sizing sharpen already complies** — it demands a source you can say out loud, which is
  this rule stated before the rule existed.
- **The honest cost:** research findings are less *countable* than `EVID` records. There is no
  "you have 12 research findings" number, and there will be moments where one would be convenient.
  Accepted — a count is exactly the thing that would make it feel like evidence.
