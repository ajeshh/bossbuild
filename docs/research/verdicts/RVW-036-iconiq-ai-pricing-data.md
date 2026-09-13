---
id: RVW-036
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: REJECT
route: n/a
---

# RVW-036 — ICONIQ 2025 AI-pricing data (hybrid+usage rising, ~37% repricing/yr)

## The claim
- **Source:** https://www.iconiq.com/growth/reports — 2025 State of AI / State of GTM (N≈300)
- **Core assertion:** AI-native pricing is shifting — hybrid subscription+usage rising, ~37% reprice within a year, AI-native trial-to-paid materially higher than SaaS.
- **Inbox file:** `docs/research/inbox/iconiq-2025-state-of-ai-pricing.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Solid (disclosed N≈300) + a VC wrapper (ICONIQ talks its growth-stage book). |
| 3 | Duplicate or sharpen? | **Duplicate.** BOSS routed a full, adversarially-verified pricing playbook *today*: [[RVW-030]] (`pricing-and-tiers-playbook-2026.md`, 27 sources, 22/25 claims confirmed) + the metering axis [[RVW-023]]. Hybrid-base+usage, on-ramp choice, and tier mechanics are **already in** `mentor-business`. |
| 4 | Who serves / harms? | Same surface RVW-030 already serves; nothing net-new to add. |
| 5 | Cost / ceremony | Re-opening a just-shipped agent for redundant data is negative-value churn. |

## Verdict: REJECT
Covered. RVW-030 already routed the best-evidenced pricing guidance BOSS has vetted, hours ago, into the V1 `mentor-business` agent — and it explicitly subsumed the on-ramp + tier-design + metering-axis content this ICONIQ data restates. Adopting it would be re-litigating a closed call. Recorded so the same report doesn't cost the debate again.

## If REJECT / NOT-YET
- **Why not:** Duplicate of [[RVW-030]] / [[RVW-023]] — already in `mentor-business`.
- **Re-open condition (soft):** Only if the next pricing refresh shows the *numbers materially drifted* from the v0.73.0 playbook — then refresh `pricing-and-tiers-playbook-2026.md` as data maintenance, not a new adoption.

## Notes
- Prior related verdicts: [[RVW-030]], [[RVW-023]], [[RVW-029]].
- BOSS version when recorded: 0.74.0
