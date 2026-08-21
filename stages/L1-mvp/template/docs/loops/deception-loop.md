---
id: deception-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Harry Brignull, Colin Gray, Kari Vaccaro, Ajesh Shah]
also_relevant: [Arunesh Mathur, Center for Democracy & Technology]
entry:
  - count_at_least:
      path_glob: src/*,src/components/*,src/app/*,app/*,components/*,pages/*,lib/*
      pattern: '(defaultChecked|checked=\{true\}|countdown|expires? in|only \d+ left|\d+ (people|others) (are )?viewing|No thanks, I)'
      min: 1
exit:
  - any_file_matches:
      path_glob: docs/design/ux-check-*.md,docs/red-team/RT-*.md,docs/decisions/DEC-*.md
      pattern: '(deceptive|dark.?pattern|countdown|pre-tick|confirmsham)'
drift_moment: deception
---

# Loop: deception (MVP)

The one loop about **code the founder may not have written.**

Every other conscience moment watches what the founder decided. This one watches what the *model*
decided on their behalf. Ask an LLM for an ordinary signup flow, checkout, or upgrade modal and it
frequently ships a manipulative one unprompted — a countdown with no deadline behind it, a
pre-ticked opt-in, confirmshaming in the decline copy — patterns nobody asked for, pulled from the
average of its training data (Vaccaro et al., *Deception at Scale: Deceptive Designs in 1K
LLM-Generated Ecommerce Components*, CHI 2026).

So a founder can ship a deceptive pattern they never designed and never *saw*. That is the sharpest
case of **effect, not intent** — the intent wasn't even theirs — and it is the one gap a catalog
cannot close on its own, because **the failure happens while someone is typing a prompt, not while
they are reading a doc.** A pattern you only find if you already suspect it is not a defense.

`boss craft deceptive-patterns --surface generated-markup`

## Entry artifact

At least one match, across the common source locations, for the *injected* shapes: a pre-checked
input (`defaultChecked`, `checked={true}`), an urgency or scarcity string (`countdown`, `expires in`,
`only N left`, `N people viewing`), or the opening of a confirmshaming decline (`No thanks, I`).

**Threshold of 1, deliberately** — unlike `design-tokens-loop`, where three files signal a real
interface forming, a single pre-ticked consent box is already the whole finding. There is no
"exploratory" version of it.

**The predicate is a gate, not a finding, and it will false-positive.** A countdown can be a real
deadline; a checked box can be a genuine user preference rather than a consent. That is why
`deception` is a `JUDGE_MOMENT`: the frame induces a bounded read of the matched lines *in context*
before anything is voiced, and **silence is frequently the correct output.** Firing on someone's
honest limited-run sale is exactly how a conscience gets muted.

Confidence scales with match count: 1 match low, 2 medium, 3+ high.

**Honest limit:** the glob is single-level per path, so a component nested deeper than the listed
directories is not scanned. Widen `path_glob` for your layout if that matters — this catches the
common shapes, not every file.

## Exit artifact

A **recorded result** — a `docs/design/ux-check-*.md`, a `docs/red-team/RT-*.md`, or a
`docs/decisions/DEC-*.md` that actually mentions the walk. Same standard `verification-loop` holds:
**a result counts, an intention counts for nothing.** Reading the file and thinking "that's fine"
does not close this; writing down what you found does.

Note what the exit deliberately *allows*: a `DEC` recording that the founder **kept** the pattern
closes the loop just as cleanly as removing it. That is conscience-not-censor working as designed —
BOSS names the cost once and makes the crossing accountable; it never blocks the choice, and never
nags a decision that has already been made and written down.

## Drift

Entry satisfied (≥1 injected shape in source) AND exit not satisfied (nothing recorded) → the loop
is open → the conscience emits a `deception` moment. The voiced ask is one sentence and answerable
in four seconds:

> *"There's a countdown in `Checkout.tsx:42`. Is there a real deadline behind it, or did the model
> write the countdown?"*

No taxonomy, no statute numbers, no lecture. A founder with a real sale says "real" and moves on. If
it isn't real, they learned it from their own code rather than from a doc — which is the only way
this teaches.

## What this loop does NOT catch

The `tracking-and-telemetry` surface — a pixel, an SDK, a session-replay recorder, a training-data
default. Those have no markup to match and no UI to look at. `/trust` owns them, at Step 3.5. Don't
let a clean `deception` loop read as a clean privacy posture.

## How to remix

- **Skip:** legitimate when the matched strings are genuinely honest — a real limited run, a real
  event countdown. Record it and the loop closes:
  ```
  - **OVERRIDE:** skipped `deception-loop` — rationale: <the countdown in Checkout.tsx is a real
    campaign end date, set in the CMS; the checked box is a display preference, not consent>.
  ```
- **Widen it:** add the shapes your stack ships — a `Badge` component that renders social proof, a
  pricing table that hardcodes a strike-through reference price.
- **Author your own:** the same shape works for any pattern family that leaves a fingerprint in the
  source. The families that don't leave one need a different runner, not a wider regex.
