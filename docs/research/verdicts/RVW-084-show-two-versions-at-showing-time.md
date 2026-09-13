---
id: RVW-084
type: verdict
owner: product-lead
status: recorded
created: 2026-08-24
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/prototype (step 6 only, conditional)
sources:
  - https://www.billbuxton.com/rightDesign.pdf
  - https://www.cs.cmu.edu/~spdow/files/PrototypingParallel-TOCHI10.pdf
  - docs/research/sessions/SESSION-2026-08-24-prototype-generation-craft.md
---

# RVW-084 — "show two rough versions, not one best one"

## The claim
- **Source:** [`SESSION-2026-08-24-prototype-generation-craft`](../sessions/SESSION-2026-08-24-prototype-generation-craft.md) §4.1, arriving already 3-vote-narrowed.
- **Core assertion:** when a founder is about to put the sketch in front of another person, **two**
  rough versions get more candid reactions than one. Showing-time only; never the default output of
  generation.
- **Broad form already killed:** "generate N variants" — see the session record §2/§8.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | The content, no. **The proposed home, yes — #2.** Step 6 fires after *every* run, including the majority where no viewer exists, at the one spot the skill says *"don't bury it in narration."* |
| 2 | Evidence grade | **Single un-replicated lab study, N=48, 2006, paper prototypes.** Below the bar for a default; sufficient for an offer-once suggestion. H3 **failed** — it buys candour, not ideas. |
| 3 | Duplicate or sharpen? | **Sharpen.** `/pretotype` measures behaviour instead of reactions; `/interview` + `/evidence` discount reactions *after*. Nothing addresses the showing moment itself — and `/prototype`'s own *"When to run it"* names it (*"show someone the gist"*) then says nothing about how. |
| 4 | Serves / harms? | Serves `first-product`, `vibe-coder-newbie`, `non-tech-founder` — the cohorts most likely to show one precious thing to a kind friend and bank the praise. Taxes `eng-builder` / `vibe-virtuoso` **only if unconditional**. |
| 5 | Cost / ceremony | Unconditional = taxes 100% of runs for the fraction with a viewer. **Conditional = one sentence, once.** Composes two things the skill already holds; survives EVID-001. |

## Verdict: ADAPT
The kernel earns a narrow keep — it is the only literal 1-vs-N study, its **social** mechanism applies
precisely (a human viewer with feelings to spare, which is exactly why the generation-time version
died), and it fills a seam none of `/interview`, `/pretotype`, `/evidence` or `/persona` covers. But
the proposed home is wrong. Adopted **only** as a conditional, offer-once, viewer-triggered nudge.

## If ADOPT / ADAPT
- **What to do:** append to step 6, fired **only** when showing is actually the next move. Offer;
  generate the second version only on a yes. One sketch stays the default output, always.
- **Modified from the original:** two, not three · showing-time, not generation-time · conditional,
  not standing · rough and differing in one dimension (Tohidi held fidelity constant and LOW).

## Attribution
**Verified.** Tohidi/Buxton/Baecker/Sellen CHI 2006 read against the primary PDF; N=48, 12/cell,
hand-drawn marker on index cards, H3 null quoted verbatim. Dow 2010 verified **not** to support the
broad form (prototype count held constant).

## Notes
- Prior related: [[RVW-071]] (compare-in-parallel, founder-facing iteration — different mechanism).
- BOSS version when recorded: 0.222.0 (in flight, peer-held).
