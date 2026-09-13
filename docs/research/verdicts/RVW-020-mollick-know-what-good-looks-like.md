---
id: RVW-020
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: DOWN stages/L1-mvp/template/.claude/skills/spec (delegation checklist kernel)
---

# RVW-020 — the scarce skill is knowing what good looks like + specifying it (delegate: goal/limits/DoD/checkpoints)

## The claim
- **Source:** oneusefulthing.org/p/management-as-ai-superpower (Ethan Mollick, Jan 2026)
- **Core assertion:** the differentiating skill is management/specification, not technical skill; delegate
  by stating goal + authority limits + definition-of-done + required outputs + checkpoints.
- **Inbox file:** `docs/research/inbox/mollick-know-what-good-looks-like.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Respected practitioner (Mollick). |
| 3 | Duplicate or sharpen? | The **delegation checklist** (goal / limits / DoD / verify) partly sharpens `/spec` (which has goal + acceptance criteria + smoke; "authority limits" + "what to verify" could be lightly added). The "know what good looks like" half is a platitude. |
| 4 | Serves / harms? | The checklist serves. The "have taste / know what good looks like" framing **harms `first-product`** — they by definition don't yet, and being told to is shaming. |
| 5 | Cost / ceremony | The checklist is light; the platitude is free but corrosive to the cohort. |

## Verdict: ADAPT
Take the concrete, vettable kernel — the **delegation checklist** — and reject the unfalsifiable
"know what good looks like" platitude (it's the problem restated, and it shames the exact cohort BOSS
serves). `/spec` already forces goal + done; the gap is "what should the founder *verify*" and "what's
out of the agent's authority."

## If ADOPT / ADAPT
- **What to do:** add to `/spec` a one-line "what will you check / what's out of scope for the agent"
  prompt (the verify + authority-limits half), reinforcing the existing acceptance-criteria + out-of-scope
  fields. → `/boss-learn` DOWN.
- **Modified from original:** drop the "taste/know-good" framing entirely; ship only the checklist kernel.

## Notes
- BOSS version when recorded: 0.66.0

## Routed via /boss-learn — APPLIED v0.67.0 (2026-06-20)
The ADAPT landed as specified above. See registry/CHANGELOG.md 0.67.0.
