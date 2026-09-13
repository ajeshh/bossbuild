---
id: RVW-023
type: verdict
owner: product-lead
status: re-opened
created: 2026-06-20
reopened: 2026-06-20
verdict: ADAPT (re-opened; was NOT-YET)
route: ADAPT → stages/L2-v1 mentor-business (founder-facing metering axis)
---

# RVW-023 — per-seat pricing is collapsing; sell the outcome (hybrid base+usage / per-outcome)

## The claim
- **Source:** getmonetizely.com 2026 pricing guide + indiehackers.com (2026)
- **Core assertion:** pure per-seat fell 21%→15% in a year, hybrid (base+usage) is now ~41% and standard;
  direction is per-seat → per-conversation → per-outcome. "Sell the outcome, not the tool."
- **Inbox file:** `docs/research/inbox/outcome-over-seat-pricing-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Mixed: outcome-pricing is anti-lock-in-compatible (#5), but metering cost-variable compute can recreate the nickel-and-dime / surveillance dynamics #6 opposes. |
| 2 | Evidence grade | Largely vendor/consultancy content marketing (Monetizely et al.) with a stake in selling usage-metering — hype dressed as inevitability. The one solid signal: per-seat assumptions *are* stale. |
| 3 | Duplicate or sharpen? | This is **founder-facing** pricing guidance — `mentor-business` territory (V1), not BOSS-core. mentor-business isn't deeply authored yet. |
| 4 | Serves / harms? | Outcome-pricing needs attributable outcomes most indie products can't cleanly measure; pushing it could harm. |
| 5 | Cost / ceremony | As taught guidance: light. But premature — the mentor that would carry it arrives at V1. |

## Verdict: NOT-YET
The durable signal ("per-seat assumptions are stale; consider hybrid/outcome") is real but it's
founder-facing pricing guidance that belongs to `mentor-business`, which BOSS hasn't authored in depth
(V1). Capturing it now as a BOSS-core practice is premature; the corpus is too vendor-tainted to ADOPT.

## If REJECT / NOT-YET
- **Why not:** wrong layer (mentor-business/V1, not core) + vendor-heavy evidence.
- **Re-open condition:** `mentor-business` is authored (V1) and a founder is at the pricing decision — fold
  in the "per-seat-is-stale, consider hybrid/outcome" lens with a *skeptical line on metering* (don't
  recreate surveillance/nickel-and-dime — humane lens).

## Re-opened — 2026-06-20 → ADAPT

Two things changed since the NOT-YET:

1. **The re-open condition fired.** `mentor-business` is now authored at V1
   (`stages/L2-v1/template/.claude/agents/mentor-business.md` exists) — the first half of the
   condition is met.
2. **The evidence is no longer just vendor marketing.** Outcome/hybrid pricing is live in production:
   Intercom ($0.99/resolution), Zendesk ($1.50), SAP (per-reconciliation), Adobe (announced). The
   "per-seat is stale" signal is corroborated by real examples, not only consultancy hype.

**The correction baked in — the original NOT-YET conflated two questions:**

| Question | Who decides | Verdict |
|---|---|---|
| Should *BOSS* adopt outcome/usage pricing for itself? | BOSS (sovereign over its own model) | Still **NOT-YET** — calm-company/patronage stands; a legitimate self-hosted call. |
| Should BOSS *tell founders* these models exist? | The founder | **ADAPT now** — this is the menu, not BOSS's choice. Withholding it gatekeeps the founder's agency. |

Parking a model for BOSS-the-product ≠ withholding it from a founder's menu. The original verdict
answered the first question and accidentally applied the answer to the second.

**What ADAPT means here:** fold a **metering-basis axis** (per-seat → usage → hybrid → outcome →
service-as-software → agent-to-agent) into the founder-facing `mentor-business`, each with its named
humane tension as an *overridable note*, under the rule **voice the tension, never filter the menu.**
The skeptical line on metering survives — as a voiced caution, not a filter. Agent-to-agent / x402 is
named as frontier, not recommended (volatile; volume down ~77% from its Nov-2025 peak).

Applied to `stages/L2-v1/template/.claude/agents/mentor-business.md` on 2026-06-20.

## Notes
- BOSS version when recorded: 0.66.0

## ⚠️ CONSOLIDATION NOTE — 2026-08-24: the seat in `route:` no longer exists

`route:` above names an **L2-v1 agent that was removed** when the mentor ladder was consolidated
(`88ef851` v0.189.0 → `ac60d47` v0.190.0–v0.195.0). `mentor-pitch`, `mentor-fundraising` and
`mentor-business` were merged into a single shipped seat — **`stages/L1-mvp/template/.claude/agents/
mentor-capital.md`** — which states the reasoning itself: *"a real incubator does not staff a pricing
specialist, a fundraising specialist and a pitch coach. One partner covers all three and grows with
the company."*

**This verdict's adopted content was checked line-by-line on 2026-08-24 and SURVIVES in
`mentor-capital`.** Nothing was lost in the merge; only the routing record rotted. The `route:` field
is left as written because it records the decision as it was actually made — read it with this note.

Found while vetting [[RVW-089]], which nearly re-litigated this verdict's claim without noticing that
the file it pointed at was gone.
