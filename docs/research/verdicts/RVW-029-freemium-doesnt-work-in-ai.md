---
id: RVW-029
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: REJECT
route: n/a
---

# RVW-029 — "Freemium doesn't work for AI; charge on usage intensity / outcomes / compute modality"

## The claim
- **Source:** https://www.lennysnewsletter.com/p/why-saas-freemium-playbooks-dont — Vikas Kansal (product lead, Google AI subscriptions)
- **Core assertion:** SaaS freemium breaks for AI because every free interaction burns GPU/cash; instead, price on three pillars — usage intensity (tokens/fast-mode), outcomes delivered (e.g. Fin's $0.99/resolution), and gating compute-heavy modalities to paid tiers.
- **Inbox file:** docs/research/inbox/freemium-doesnt-work-in-ai.md

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No direct contradiction. But the **load-bearing premise — "every free user burns your GPUs" — does not apply to BOSS.** BOSS is a zero-dep CLI whose conscience is a hook that rarely calls a model; [[IDEA-013]] explicitly reframed cost→frequency because BOSS has ~zero marginal serving cost. The article is advice for GPU-heavy AI SaaS; BOSS isn't one. |
| 2 | Evidence grade | **Strong** — respected practitioner (Google AI subscriptions lead), real tier structures + named case studies (Midjourney, Intercom Fin). |
| 3 | Duplicate or sharpen? | **Duplicate** of [[RVW-023]] (per-seat collapsing → sell the outcome), which already ADAPTed the founder-facing metering axis into V1 `mentor-business`. This adds the Google case study but no new principle. |
| 4 | Who serves / harms? | Founder-facing relevance to `mentor-business` *only when BOSS revisits its own model* — but CANVAS v0.3 is explicit that no pricing decision is honest before WTP signal from a real cohort (n=0). No harm; just premature for BOSS-on-BOSS. |
| 5 | Cost / ceremony | Adopting as BOSS practice now = premature ceremony (#2) and building around the demand risk the canvas centers. |

## Verdict: REJECT
Two independent reasons. (1) For **BOSS judging itself**, the article's core premise — free users burning GPU — simply doesn't hold; BOSS's marginal cost is ~zero ([[IDEA-013]]), so the whole argument is inapplicable. (2) For **founder-facing guidance**, it duplicates [[RVW-023]], which already routed "sell the outcome, not the seat" into V1 `mentor-business`. The Google case study is a *citation that strengthens RVW-023*, not a new verdict.

## If REJECT / NOT-YET
- **Why not:** Premise inapplicable to BOSS + duplicate of RVW-023's already-routed founder-facing axis.
- **Use the good part:** fold the Kansal three-pillar framing in as a supporting citation inside the RVW-023 V1 `mentor-business` material when that's authored — not as its own practice.

## Notes
- Prior related verdicts: [[RVW-023]] (outcome-over-seat pricing — re-opened, ADAPT to V1 mentor-business). This is its near-duplicate.
- BOSS version when recorded: 0.69.0
