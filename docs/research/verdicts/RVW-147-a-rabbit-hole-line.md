---
id: RVW-147
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
---

# RVW-147 — every FEAT names the part most likely to blow up its scope

## The claim
- **Source:** the open-source spec toolkit's idea-assessment "shape" step, which asks each option for its
  likeliest scope blow-up and treats appetite as a budget (`docs/research/sessions/SESSION-2026-10-05-spec-driven-reading.md` (gitignored; names and URLs live there)).
- **Core assertion:** naming the rabbit hole up front stops the overrun.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **One tool's design**, from a well-known shaping method. |
| 3 | Duplicate or sharpen? | **Covered.** `/roadmap` holds appetite and the NO-list. `/spec` step 0 checks the FEAT's criteria against the bet's appetite. The FEAT has *Out of scope* and *Still unknown*, and *new scope gets a new id* handles the overrun when it comes. |
| 4 | Who serves / harms? | A neutral line for most founders, and one more field to fill for `first-product`. |
| 5 | Cost / ceremony | One more section on every FEAT. |

## Verdict: REJECT
Four places already hold this concern, and a fifth field adds ceremony without a mechanism.

## Attribution
**Verified** by the deep-dive pass.

## Notes
- BOSS version when recorded: 0.329.0
