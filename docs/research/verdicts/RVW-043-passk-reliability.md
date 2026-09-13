---
id: RVW-043
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADOPT
route: UP → /evals (the pass^k reliability idea)
---

# RVW-043 — pass^k: run it k times, count how often it ALL works (τ-bench)

## The claim
- **Source:** τ-bench / τ²-bench (Sierra, 2024–2025, arXiv 2406.12045 / 2506.07982). The transferable idea: **pass^k** — measure whether an agent succeeds across *k independent trials*, exposing reliability/consistency rather than single-shot luck.
- **Core assertion:** A founder should rate their agent by *consistency* (does it work all k times?), not a single happy-path demo.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it's the anti-demoware discipline in measurement form. |
| 2 | Evidence grade | [EVIDENCE] — peer-reviewed benchmark, public leaderboards. |
| 3 | Duplicate or sharpen? | **Sharpens.** `/evals` teaches correctness; pass^k adds the *reliability/variance* axis non-deterministic AI specifically needs. |
| 4 | Who serves / harms? | Serves every founder shipping a non-deterministic feature. No harm. |
| 5 | Cost / ceremony | **Near-zero — and zero-dependency.** "Run it k times, count how often it all works" is teachable in one line; the benchmark itself stays a pointer, never a CLI dep. |

## Verdict: ADOPT
The cleanest, cheapest reliability concept in the eval mining pass — and exactly BOSS-shaped (zero-dep, one-line, anti-demoware). A founder running their own agent N times on the same task and counting full successes is the consistency check that single-shot evals miss. Adopt the *concept* into `/evals`; the τ-bench framework stays an ADAPT-as-pointer reference.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → `/evals` gains a pass^k note ("non-deterministic ≠ run-once; measure success across k trials"). → hand to `/boss-learn`.
- **If ADAPT (the framework):** τ-bench/Inspect named as the "graduate to a real harness" pointers, never dependencies.

## Notes
- Prior related: [[RVW-050]] (evals-as-spec), Hamel/Shankar error-analysis (already cited in /judge-traces).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.90.0, /evals bundle)
- **Routed UP** (with [[RVW-040]]). `/evals` Sharpening section gains a **pass^k** bullet + a Rules line:
  non-deterministic ≠ run-once — run each load-bearing case k times and count how often it *all* succeeds;
  that consistency rate is the reliability signal. Kept zero-dependency (a loop around the existing case);
  τ-bench / UK AISI Inspect named as graduate-grade pointers, never CLI deps — exactly the BOSS-shaped
  ADOPT the verdict called for.
