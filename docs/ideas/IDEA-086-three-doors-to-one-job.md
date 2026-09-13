---
id: IDEA-086
type: idea
owner: product-lead
status: shipped
proof: none
proof_note: The cheap resolution is a routing line inside the existing /evidence skill; the proof would be that line in stages/L0-quickstart/template/.claude/skills/evidence/SKILL.md. Held until a founder is observed bouncing between the three.
program: front-door
created: 2026-09-08
source: |
  Surfaced 2026-09-08 while making /interview the lead verb of the Quickstart arc (v0.258.0) —
  choosing which of three overlapping verbs to lead with is what made the overlap visible.
---

# IDEA-086 — three doors to one job: `/interview`, `/research`, `/evidence`

## The observation

All three turn *something a real person said* into a graded `EVID-NNN`:

- **`/evidence`** — you paste notes or describe what happened; it drafts the record and grades it.
- **`/interview`** — preps a Mom-Test call, then debriefs your notes into records, flagging where
  you pitched instead of listened.
- **`/research`** — digests a whole transcript into records at scale, plus synthesized product
  context, flagging where the witness got led.

The seam between them is **input size and whether BOSS helped you prepare** — which is a real
distinction, and also one the founder has to already understand in order to pick. At the moment
they need it most (they have just had a conversation and want to write it down), the three names
give them no way to choose, and picking wrong costs them the prep step or the transcript synthesis
without ever telling them it existed.

## Why this is not automatically a subtraction

The honest read cuts both ways, and the case *against* merging is strong:

- `/interview`'s prep half has no counterpart in the other two — it runs *before* the conversation,
  and it is the half the conscience actually points at.
- `/research`'s synthesis half (pains, jobs, verbatim words, workarounds, objections → canvas +
  brain) is not evidence capture at all; it is product context, at a scale one call never reaches.
- BOSS has merged verbs before on exactly this reasoning (`pmf-check` + `retain` → `/health`,
  `first-dollar` + `monetize` → `/money`) and those were sound because *the same question* had two
  doors. Here it may be three questions that share an output type.

## The cheapest resolution, and it is not a build

**One door that routes**, the way `/money` already does — *"no yes yet → …; a real yes but no way to
pay → …; paying customers → …"*. `/evidence` is the natural front (it is the one a founder reaches
for by name) and it could open with the routing question: *is this a conversation you have not had
yet (→ `/interview` prep), notes from one you just had (→ debrief), or a whole transcript
(→ `/research`)?* That is a re-narration inside one existing skill, not a merge — reversible, and it
gets the routing knowledge out of the founder's head without deleting anything.

**What would justify an actual merge:** evidence that founders bounce between the three, or reach
for one and never discover the others. That is observable the moment there is a founder to observe,
and unknowable before then. Do the routing line; hold the merge.

## Related

- [[IDEA-084]] — the same shape one rung up: too many verbs arriving at once.
- The v0.257.0 vocabulary pass, which renamed the two verbs whose *names* named the wrong job. This
  is the harder version: three verbs whose names are all accurate and still do not help you choose.

## Capture log

## Capture log

- **2026-09-09 — the routing line SHIPPED, v0.266.0; the merge is still held.** Exactly what this
  record specified: a *"The door you're at — route before you capture"* section inside
  `/evidence`, the door founders reach for by name. It names the cost of picking wrong out loud —
  capturing a transcript here gets one record and **loses the synthesis without telling you** —
  because a silent loss is the whole reason the routing exists.
- **The merge stays refused on this record's own reasoning**, unchanged: `/interview`'s prep half
  and `/research`'s synthesis half have no counterpart elsewhere, so merging would cost real
  capability to fix a naming problem. The trigger for revisiting is still a founder OBSERVED
  bouncing between the three, and there is still no founder to observe.
