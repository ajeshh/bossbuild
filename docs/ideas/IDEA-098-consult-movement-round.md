---
id: IDEA-098
type: idea
owner: product-lead
status: shipped (v0.304.0, 2026-09-11 — gate closed: Ajesh read both versions, kept the round)
gist: /consult's mentors answer in isolated contexts and never see each other — so the synthesis can show WHERE they split but never whether one would MOVE on hearing the other. One conditional round, only for the disagreeing pair, turns the split from a list into a movement.
program: mentors
proof: stages/L1-mvp/template/.claude/skills/consult/SKILL.md
proof_note: >
  Step 3.5 (the round, conditional on a split) and the "What moved" line in step 4. Dogfooded
  the same day on IDEA-099's split — see that record's "The board's read": mentor-architect moved
  on sequence, mentor-founder moved on shape and held on sequence. The shape is Karpathy's
  llm-council; the reason is personal-council's. Ajesh's read of whether the movement line beat
  the split is the second gate leg, still open.
created: 2026-09-11
relates: IDEA-097, IDEA-099, COMP-founder-plugins-source-read
---

# IDEA-098 — the movement round in `/consult`

> Seed: the five-plugin source read, 2026-09-11. personal-council (repo now gone) promised *"a
> 3-round debate… that protects you from confirmation bias without letting any single model
> dominate."* Ajesh, on the recommendation to add one conditional round: *"yes."*

## What is true today

`/consult` step 3 consults each relevant mentor's agent separately, same question, same context.
Step 4 synthesizes *keeping the disagreement visible* — *"never average seasoned advisors into
mush."* That is already the hard half: the five-strangers problem (one model writing every voice
knows what the others will say) is solved because each mentor is a separate subagent. But no
mentor ever reads another's take. The founder gets *"capital says X, customers says Y"* and has to
guess whether either would hold that position after hearing the other.

## The shape

**Step 3.5 — only when step 3 produced a split on the load-bearing point.** For the disagreeing
pair (or trio — never the whole panel):

1. Show each the other's take, one paragraph, unedited.
2. Ask: *"Does this move you? Say what moved, or hold — in one paragraph."*
3. Carry the answer into step 4 as a **movement line**: *"mentor-capital moved on hearing
   mentor-customers' point about X — it now says Y; mentor-customers held."*

If nobody split, step 3.5 does not run and nothing is said about it.

## Tasks

1. The conditional step in `/consult` — ~10 lines; the trigger is *disagreement on the
   load-bearing point*, judged by the skill, not a count.
2. The movement line in step 4's synthesis format, beside *converge / diverge / humane override*.
3. Dogfood once on a real BOSS question the same day it lands — IDEA-099's *"should the door hear
   the idea before scaffolding?"* is a genuine split (ceremony vs value-first) and the right test.
4. `/tmp` test: a scaffolded MVP project runs `/consult` on a pricing question and the round fires
   only when `mentor-capital` and `mentor-customers` actually differ.

## Refusals

- **No weights.** Weighting seasoned advisors is the averaging the skill already forbids.
- **No fixed round count.** One round, conditional. A second round is where mush begins.
- **No all-mentor rebuttal.** Only the pair that split; the others' takes stand as given.
- **No cross-provider routing.** personal-council's *three model lineages* catches correlated
  blind spots one lineage cannot; BOSS is host-bound by design (`model-routing.md`) and answers
  with grounding in records and `/vet`. That is a real structural limitation and it is named in
  the competition record, not hidden here.

## Gate

Ships when the dogfood run produces a movement line a reader finds more useful than the split it
replaced — judged by Ajesh reading both. Falsifier: three consults in a row where nobody moves —
then the round is cost without movement and comes out.

## Capture log

- 2026-09-11 — seeded from the source read; approved (*"yes"*), held for the batch.
- 2026-09-11 — **shipped v0.304.0.** First live run, on IDEA-099: three mentors split on
  `--idea` now-vs-later; the round moved both sides and the converged scope was *smaller* than the
  proposal. Movement line as rendered: *"`mentor-architect` moved on hearing the founder's
  subtraction — the second ask 'stops being a bug to prevent and becomes the measurement'; 
  `mentor-founder` moved on shape — 'a better `--idea` than the one IDEA-099 sketched; I take both' —
  and held on sequence."* The trigger judgment held: `mentor-customers` agreed with founder and was
  not re-asked. Gate leg 2 (Ajesh reads split vs movement) open.
- 2026-09-11 — **gate leg 2 closed.** Ajesh read the split-only version beside the movement version
  and chose the round: *"yeah I like it."* Falsifier stays live (three consults with no movement →
  it comes out).
