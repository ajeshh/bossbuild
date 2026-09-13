---
id: RVW-063
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md
---

# RVW-063 — algorithmic management / gamblified labor (opaque scoring as a dark pattern)

## The claim
- **Source:** `/humane-refresh` pass 2 (verified 3-0) — [SESSION](../sessions/SESSION-2026-06-21-humane-refresh.md).
  Primary: Human Rights Watch **"The Gig Trap"** (May 2025, 155pp); Columbia Law Review "On Algorithmic Wage
  Discrimination" (Dubal).
- **Core assertion:** when a product *manages or pays people* via algorithm, **opaque, ever-changing pay/scoring
  the worker can't understand or predict** — plus **bonus/quest/surge schemes that induce risk-taking
  ("algorithmic gamblification")** — is a labor-side dark pattern. >50% of platform workers don't understand
  how they're paid; Uber/DoorDash declined to disclose the factors.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Strong source (HRW + Columbia Law Review), 3-0 — but **regulatory teeth are thin** (documentation, not a single binding US rule; EU/UK Platform Work directives exist but weren't sourced this run). |
| 3 | Duplicate or sharpen? | **New** — BOSS's catalog is user-facing; this is the *worker/managed-person* facing surface, not covered. |
| 4 | Who serves / harms? | Cohort-narrow (founders building marketplaces / gig / worker-scoring), but the *principle* generalizes: any product that scores, ranks, or pays people. Harmed party (the managed worker) is a non-consenting third party. |
| 5 | Cost / ceremony | Net-light — one generalized line, cohort-gated. |

## Verdict: ADAPT
Adopt as **one generalized pattern**, not a gig-economy module: *if your product scores, ranks, or pays
people, opaque/unpredictable scoring and gambling-style incentives are the dark pattern* — the humane
alternative is a **transparent, predictable formula the person can understand**, disclosed factors, and no
gambling-mechanic incentives. Surface it when the product manages people. Keep the teeth honest: this is
**documented harm, not (yet) a binding US rule** — name HRW/Columbia as the source and the EU/UK Platform Work
directives as the maturing-teeth re-open signal, don't imply enforcement that isn't there.

## If ADOPT / ADAPT
- **What to do:** add a cohort-gated "algorithmic management" line to the dark-patterns § (opaque scoring /
  gamblified labor → transparent predictable scoring + disclosed factors). → `/boss-learn` (UP).
- **What's modified:** generalized from gig-work to "any product that scores/ranks/pays people"; teeth
  honestly marked as documentation-grade.

## Notes
- Prior related verdicts: none directly.
- Re-open (for stronger teeth): the EU Platform Work Directive's algorithmic-management transparency
  provisions + any US state action — worth a targeted sweep when a founder actually builds a worker-managing
  product.
- BOSS version when recorded: 0.95.0 (→ bump on implementation).
</content>
