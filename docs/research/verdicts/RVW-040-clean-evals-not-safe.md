---
id: RVW-040
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → /evals + /red-team (adversarial-pass requirement) + positioning; extends RVW-033
---

# RVW-040 — a clean eval pass isn't safety; report capability, hide responsibility (AI Index 2026)

## The claim
- **Source:** Stanford HAI **AI Index 2026**, Responsible-AI chapter — 362 AI incidents in 2025 (up from 233); safety ratings hold under standard use but **degrade across all models under adversarial/jailbreak prompts**; frontier developers report capability benchmarks but almost never responsible-AI benchmarks.
- **Core assertion:** Measuring an AI feature's correctness is not the same as measuring its safety; a clean eval means little without an *adversarial* pass — and the industry systematically under-reports the responsibility half.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | [EVIDENCE] — large aggregated dataset, transparent method. |
| 3 | Duplicate or sharpen? | **Sharpens.** BOSS already has `/evals` (correctness) and `/red-team` (adversarial) as *separate* skills; this supplies the evidence that you need *both* — and extends [[RVW-033]] (the 2025 implementation gap) with the operational consequence. |
| 4 | Who serves / harms? | Serves any founder shipping an AI feature; no harm. |
| 5 | Cost / ceremony | Light — a one-line requirement ("a clean /evals pass isn't done until /red-team runs") + a positioning citation. |

## Verdict: ADAPT
Not a new mechanism — BOSS already has both rails — but a genuine sharpen: the AI Index gives the evidence for *coupling* them, so a founder doesn't mistake a clean correctness pass for a safe feature. ADAPT: add a line to `/evals` pointing at `/red-team` as the required adversarial half (the "safety degrades under adversarial prompts" finding is the why), and use the report-capability-hide-responsibility data in positioning as the asymmetry BOSS corrects at the founder level. Don't import the specific benchmark numbers (they stale fast).

## If ADOPT / ADAPT
- **What to do:** Route **UP** → `/evals` gains an explicit "correctness ≠ safety; run `/red-team` before calling it done" note; positioning dossier cites the AI Index asymmetry. → hand to `/boss-learn`.
- **What's modified:** Use the *direction* (clean≠safe), not the year's exact incident counts/benchmarks.

## Notes
- Prior related: [[RVW-033]] (extends it), [[RVW-042]] (the OWASP Agentic list is what the adversarial pass should test).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.90.0, /evals bundle)
- **Routed UP** (with [[RVW-043]]). `/evals` gains a "Correctness ≠ safety — the adversarial half" section
  + a Rules line: a green `/evals` pass isn't *done* until `/red-team` runs the adversarial half (its
  OWASP-Agentic battery is what to probe). Used the *direction* (clean≠safe, the report-capability /
  hide-responsibility asymmetry), not the year's exact incident counts. Shipped in **v0.90.0** (commit
  `b35ac66`) — the consolidated final-sweep bundle, after holding for the concurrent FEAT-023 stream.
- **Positioning half filed (2026-06-20, no version bump):** added to `positioning-pass-001.md` §9b — the
  capability-reported / responsibility-hidden asymmetry as the [EVIDENCE] behind BOSS's §9a "won't the
  model eat this?" answer (BOSS makes the responsibility half a build-time gate). Gitignored dossier.
