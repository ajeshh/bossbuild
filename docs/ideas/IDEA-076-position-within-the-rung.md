---
id: IDEA-076
type: idea
owner: product-lead
status: deferred (re-open on an OBSERVED session, not a third statement of the pain)
proof: >
  ⚠️ Two separable claims, two grades. (1) The DEFECT — BOSS renders which of four rungs you are on
  and never where you are INSIDE one, and computes readiness to climb for exactly one rung — is
  [VERIFIED] mechanically against shipped code (`renderLadder` in src/map.js; `graduationHint` is a
  static manifest string; only `cmdUnlock`'s L3-scale branch names a bar). (2) FOUNDER DEMAND is
  [stated-pain], the lowest rung of the ladder — EVID-001 and EVID-003, two independent
  founders, both asking for orientation and progress. Nobody has been OBSERVED failing at this.
proof_note: >
  The gap between the two grades is the whole risk in this record. The defect is real and checkable;
  the CURE is not specified by the evidence at all. A founder saying "I want to see my progress" does
  not tell you what to count, and the obvious answers are the dangerous ones — see the anti-flattery
  constraint below. This record must not be read as authorising a progress bar.
gist: >
  The ladder shows four station NAMES and bolds the one you are at. A founder spends weeks inside a
  single rung, and for those weeks the surface says exactly the same thing on day 1 and day 40.
  EVID-001's own words were "knowing exactly where i am like a train line, seeing my progress" —
  and a train line's whole information content is the stations you have passed and the ones ahead.
  BOSS ships the line's name. The second half — when do I climb, and am I ready — is unanswered too:
  `graduationHint` is a fixed sentence from the manifest, not a read of the project, and only
  `boss unlock scale` names an evidence bar, which is the rung almost nobody reaches. The two rungs
  people actually climb unlock in silence.
created: 2026-08-24
source: >
  Ajesh, 2026-08-24 — "continuing to review existing ux and design of boss, .. anything to improve
  experience, flow, cues, overall experience." Found by WALKING the shipped surface (scaffold →
  unlock → populate → return after 12 days), not by reading it. The walk's other six findings shipped
  as v0.232.0; this one is the residue that could not be fixed in a line, and is held on purpose.
---

# Position within the rung — the half of the train line that is still missing

## What is actually true today

`renderLadder` (src/map.js) maps the four modes to their names and bolds the current one:

```
    Quickstart → MVP → V1 → Scale
```

That is the entire progress surface for a founder standing inside a rung. It is correct, it is
honest, and it does not change for as long as they stay there.

Three things now sit near it and none of them close the gap:

- **v0.231.0** added the RE-ENTRY read — *how long you were away, what you last landed, what you said
  was next.* That answers *where was I*, which is a different question from *how far am I*.
- **v0.231.0** also added the EVIDENCE ladder to `boss status` (`stated-pain · observed · commitment`).
  This is the closest thing BOSS has to within-rung position, and it is worth studying before
  building anything new — it is a real ladder, it is read from real records, and **it can go down**.
- **v0.232.0** gave `Building now:` a way back into the card. That is orientation, not progress.

## Why this is not a quick fix, and why it is filed instead of built

**The obvious cure is the one BOSS's own catalog names as a dark pattern.** A percentage, a streak, a
"you're 60% through MVP" — `engage-streaks-variable-rewards` is a live row in
`library/deceptive-patterns.json`, and [[IDEA-065]]'s rule is already written down in
`src/orientation.js`: *a progress surface that cannot go down is a comfort device.* Any counter built
from work STARTED rather than work LEARNED would flatter exactly the founder BOSS most needs to slow
down — `vibe-virtuoso`, 50+ repos, zero traction, who would read a filling bar as traction.

**And "how far through MVP" may not be a real quantity.** MVP has 29 skills and no required subset;
a founder can ship a real product having run four of them. A denominator built from "skills not yet
run" would be the [[checkers-state-intents-they-dont-enforce]] n=20 failure in a new costume — a
metric whose denominator is an inventory rather than a truth, which improves when BOSS ships fewer
skills and worsens when it ships more.

## The shape a real answer probably has

Recorded as a direction to pressure-test, **not** as a decision:

1. **Stations should be EVIDENCE, not activity.** BOSS already has a three-rung grade ladder that can
   go down and is read from durable records. "You are here" inside a rung is plausibly a read of the
   EVID ledger + the board, never a count of skills invoked.
2. **Readiness should be COMPUTED where BOSS has ground truth, and silent where it does not.**
   `unlock scale` names three conditions in prose. Whether the equivalent for MVP→V1 is checkable
   (real users? a shipped FEAT? a commitment-grade EVID?) is the open question. If it is not
   checkable, it should stay a sentence rather than become a fake gate.
3. **It is a composition, and it belongs in `boss status`.** EVID-001's mandate is compose + SUBTRACT.
   There must be no 49th skill and no new command — `boss status` is already where the question is
   asked, and v0.231.0 + v0.232.0 both answered their halves there.
4. **Silence is a legal answer.** A project with nothing captured should get nothing, the way the
   re-entry line stays quiet for a founder who worked yesterday.

## What would move this

- An **observed** session — a founder actually using BOSS while someone watches — rather than a third
  statement of the same pain. EVID-001's standing instruction is to hold until a founder moves
  from stated-pain to observed-behavior, and that has not happened.
- Or a founder who climbs a rung and gets it WRONG in a way BOSS could have caught — which would tell
  us readiness is real and checkable, instead of assumed.

## Explicitly not covered

- Whether founders want this rendered at all, versus wanting BOSS to just tell them the next action
  (which v0.232.0 now does). **These are different products and the evidence does not separate them.**
- Anything about V1 or Scale. Both signals came from founders at or below MVP.

## Capture log

## Capture log

- **2026-09-09 — the READINESS half shipped, v0.266.0; the POSITION half is still open.** This
  record named two gaps and only one of them was checkable. Point 2 (*"readiness should be COMPUTED
  where BOSS has ground truth, and silent where it does not"*) is built: `src/readiness.js` gives
  every rung a bar, reads the legs it can check, and `boss unlock` no longer crosses two of the
  three rungs in silence. Point 3 was honoured — no 49th skill, no new command.
- **Point 1 — stations as evidence — is NOT built, and should not be read as done.** What shipped
  answers *am I ready to climb*, not *how far am I inside this rung*, which is the question
  EVID-001 actually asked. A founder mid-MVP still sees the same surface on day 1 and day 40. The
  hold stands: it wants an OBSERVED session, not a third statement of the same pain.
- **The constraints in this record were treated as binding and all four held.** No counter of any
  kind. Nothing derived from skills-run. `unknown` is a first-class state, so the legs BOSS cannot
  see (real users hitting it; a coordination symptom you can name) are named and left unjudged
  rather than quietly passing — a condition silently treated as met because it cannot be seen is a
  fake gate, which is worse than no gate. And the surface **goes down**: superseding the EVID behind
  it retracts the line, which is the one property a test now guards.
