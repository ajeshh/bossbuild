---
id: RVW-050
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → mentor-architect (the concept now); a new evals-driven-development practice gated MVP→V1
---

# RVW-050 — "evals are the new PM spec" + the Gulf of Specification

## The claim
- **Source:** Hamel Husain & Shreya Shankar (2025) — "you can't be a PM on AI products without evals"; the **Gulf of Specification** = the gap between loosely-worded intent and what the model actually does. Evals force you to specify format, scope, and tradeoffs traditional software left implicit.
- **Core assertion:** For an AI product, the eval *is* the spec — defining quality before building is the new product discipline.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | [THOUGHT-LEAD], but battle-tested (trained 2,000+ PMs at frontier labs); the underlying error-analysis practice is the field standard. |
| 3 | Duplicate or sharpen? | **Partly new.** BOSS has `/evals` (the mechanics) but no *product-judgment* framing of evals-as-spec; the "Gulf of Specification" is the cleanest articulation of *why a founder must define quality first*. |
| 4 | Who serves / harms? | Serves MVP→V1 founders shipping AI features. **Harm = prematurity:** for a Quickstart founder, evals are over-ceremony (#2). |
| 5 | Cost / ceremony | Concept = light; the full practice = moderate, must be JIT-gated. |

## Verdict: ADAPT
Adopt the *concept*, defer the *machinery*. The Gulf of Specification is a genuinely sharp framing of BOSS's own "define quality before you build" instinct — fold it into mentor-architect's existing "what about evals?" trigger now. The fuller `evals-driven-development` practice is a NOT-YET-until-MVP item (a Quickstart founder doesn't need eval ceremony — Principle #2). Reuse `/evals` for the mechanics; this adds the product-judgment layer above it.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → mentor-architect gains the "evals = your spec; mind the Gulf of Specification" framing (voiced at MVP+). Capture the standalone `evals-driven-development.md` practice as a JIT-gated follow-on. → hand to `/boss-learn`.
- **What's modified:** Concept now, practice gated to MVP→V1; never imposed at Quickstart.

## Notes
- Prior related: [[RVW-043]] (pass^k), [[RVW-049]] (demoware), Hamel error-analysis (already in /judge-traces).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.87.0, mentor-architect bundle)
- **Concept routed UP** (with [[RVW-041]]/[[RVW-046]]/[[RVW-053]]). `mentor-architect`'s Reliability bullet
  now names **eval = the spec** + the **Gulf of Specification** (Husain/Shankar): define the quality bar
  before building; `/evals` is the machinery, this is the judgment above it. **Machinery deferred** — the
  standalone `evals-driven-development.md` practice stays a NOT-YET-until-MVP→V1 follow-on (a Quickstart
  founder doesn't need eval ceremony, Principle #2), as the verdict scoped. Captured as a queue item.
