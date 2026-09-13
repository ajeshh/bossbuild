---
id: RVW-062
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md
---

# RVW-062 — FTC Junk Fees Rule (total-price prominence)

## The claim
- **Source:** `/humane-refresh` pass 2 (verified 3-0) — [SESSION](../sessions/SESSION-2026-06-21-humane-refresh.md).
  Primary: FTC final **Junk Fees Rule** (Dec 17 2024, effective May 12 2025).
- **Core assertion:** hiding total prices and dripping mandatory fees is now *prohibited* (ticketing +
  short-term lodging) — the true all-in total must be disclosed up front and shown **more prominently than
  any other price**; the FTC will pursue drip pricing in other industries case-by-case.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Strong — FTC final rule, 3-0. |
| 3 | Duplicate or sharpen? | **Sharpens** [RVW-056](RVW-056-canonical-dark-pattern-superset.md) — drip/partitioned pricing is already in the Sneaking family; this adds the *enforced* bar and the "most prominent" specificity. |
| 4 | Who serves / harms? | Any founder with a paid product; harms none. |
| 5 | Cost / ceremony | Net-light — one clause on the existing Sneaking entry + one line on the regulatory pointer. |

## Verdict: ADAPT
Not a new pattern — it's *teeth + a sharper bar* for one BOSS already adopted (drip pricing, RVW-056).
Fold in: (a) on the Sneaking "drip pricing" line, add that the humane bar is **the all-in total, shown most
prominently, before any commitment** (the FTC standard); (b) add the **FTC Junk Fees Rule** to the
regulatory-teeth reference pointer (RVW-057). No standalone catalog section.

## If ADOPT / ADAPT
- **What to do:** sharpen the drip-pricing humane alternative + add Junk Fees Rule to the teeth pointer in
  `ai-ux-patterns.md`. → `/boss-learn` (UP).
- **What's modified:** demoted from "new pattern" to "sharpening of RVW-056/057."

## Notes
- Prior related verdicts: [RVW-056](RVW-056-canonical-dark-pattern-superset.md), [RVW-057](RVW-057-dark-pattern-regulatory-teeth.md).
- Scope caveat: rule is ticketing + lodging only (narrowed from the 2023 all-industry proposal); state the
  scope, don't overclaim a blanket ban. Decoy/anchoring/partitioned pricing + BNPL did **not** survive
  verification this run — not adopted.
- BOSS version when recorded: 0.95.0 (→ bump on implementation).
</content>
