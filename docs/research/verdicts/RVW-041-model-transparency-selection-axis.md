---
id: RVW-041
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → mentor-architect (model-selection: a "what to ask about your model" axis)
---

# RVW-041 — model transparency as a selection axis, not just price/capability (Stanford FMTI)

## The claim
- **Source:** Stanford **Foundation Model Transparency Index**, Dec 2025 (mean score fell 58→41; six majors disclose nothing on basic model info; only 30% of companies engaged, down from 74%).
- **Core assertion:** A founder picking a foundation model should weigh *transparency* (what's disclosed about data, training, limits) as a real axis — opacity upstream becomes the founder's blind spot downstream.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | [EVIDENCE] — structured 100-indicator rubric, peer-reviewed method. |
| 3 | Duplicate or sharpen? | **New, small.** mentor-architect coaches model choice on capability/cost; transparency-as-an-axis isn't there. |
| 4 | Who serves / harms? | Serves founders making a build-on-which-model call; mild — most early founders default to the host model (Claude) anyway. |
| 5 | Cost / ceremony | Light — a short "what to ask about your model" checklist distilled from the FMTI indicators; do NOT import the scoring apparatus. |

## Verdict: ADAPT
Sound but narrow. A founder won't read the Index, and most BOSS founders sensibly default to the host model — so this is a *light* ADAPT: distill the FMTI's indicators into a handful of "what to ask before you build on a model" questions (data provenance, known limits, deprecation/retirement policy, change cadence) inside mentor-architect. Don't adopt the rubric/scoring itself. Pairs naturally with the model-recalibration discipline ([[RVW-046]] / IDEA-014).

## If ADOPT / ADAPT
- **What to do:** Route **UP** → mentor-architect gains a brief transparency checklist for model selection. → hand to `/boss-learn`.
- **What's modified:** Indicators-as-questions, not the Index's scoring; scoped to "when you're choosing a non-default model."

## Notes
- Prior related: [[RVW-046]] (model-recalibration), IDEA-014.
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.87.0, mentor-architect bundle)
- **Routed UP** (with [[RVW-046]]/[[RVW-050]]/[[RVW-053]]). `mentor-architect` "jagged frontier, and the
  model underneath" section gains the third bullet: *choosing a non-default model? weigh transparency* —
  a four-item "what to ask" list (data provenance, known limits, deprecation/retirement policy, change
  cadence), scoped to the deliberate non-host-model case. FMTI indicators-as-questions only; the scoring
  apparatus deliberately left out, exactly as scoped.
