---
id: RVW-053
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → conscience + the /prototype→MVP boundary marker
---

# RVW-053 — the 70% problem: AI gets you 70%, the last 30% is the skill you still own

## The claim
- **Source:** Addy Osmani, *The 70% Problem* (Dec 2024) + GitClear telemetry (211M LOC: copy-pasted lines overtook moved lines in 2024; refactoring 25%→<10%; clone blocks up ~8x).
- **Core assertion:** AI accelerates the part you already understand and stalls on the part you don't; juniors accept "house of cards" code they can't shape. The 30% gap *is* the skill you still have to own.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it's the pseudo-app trap in build form. |
| 2 | Evidence grade | [THOUGHT-LEAD] (Osmani) backed by [EVIDENCE] (GitClear telemetry). |
| 3 | Duplicate or sharpen? | **Sharpens** the `/prototype`→MVP ceremony ramp with a memorable boundary marker — BOSS has the ramp but not this framing. |
| 4 | Who serves / harms? | Serves `vibe-coder-newbie`/`first-product` most (the ones who can't debug the last 30%). No harm. |
| 5 | Cost / ceremony | Light — one conscience line / mentor-architect framing. |

## Verdict: ADAPT
The cleanest one-liner for the prototype/MVP boundary BOSS already enforces. ADAPT: use "AI gets you 70%; the last 30% is the part you still have to own" as the marker between `/prototype` (sketch freely) and `/spec`/MVP (now you must understand it) — voiced by the conscience / mentor-architect. Pair Osmani (memorable) with GitClear (data). Suggestive, not a gate.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → the 70%-problem framing at the `/prototype`→MVP graduation + a conscience line. → hand to `/boss-learn`.
- **What's modified:** A boundary-marker framing on the existing ramp, not a new gate.

## Notes
- Prior related: [[RVW-049]] (demoware test — the twin boundary marker), [[RVW-039]] (competence-gate).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.87.0, mentor-architect bundle)
- **Routed UP** (with [[RVW-041]]/[[RVW-046]]/[[RVW-050]]). The "70% problem" lands as the second bullet of
  `mentor-architect`'s "jagged frontier" section — the **`/prototype`→MVP boundary marker**: AI gets you
  ~70% (what you understand), stalls on the last 30% (what you don't); can't-shape-the-30% is the slow-down
  signal. Osmani (memorable) + GitClear (data). Suggestive, never a gate — landed at the mentor-architect
  surface (the L1 build-judgment home) rather than adding a new conscience predicate.
