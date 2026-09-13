---
id: IDEA-084
type: idea
owner: product-lead
status: shipped (fix 1, v0.324.0 — `earned` in the MVP manifest: 16 verbs at unlock; postLaunch lays down after the first ship, aiMediated on the first model call. Fix 2 refused; fix 3 was already `boss map`)
proof: src/earned.js
proof_note: Fix 1 landed as `earned` in the MVP manifest (v0.324.0) — the predicate that lays a group down when the project earns it, not the rung. The count-first rule was overtaken by the board assessment of 2026-09-12; the split is by project property, which is what fix 1 asked for.
shipped_on: 2026-09-12
program: front-door
created: 2026-09-08
source: |
  Measured during the 2026-09-08 partner-review pass. Not reported by anyone — counted off the
  manifests while doing the vocabulary work in v0.257.0.
---

# IDEA-084 — `boss unlock mvp` adds 29 verbs in one command

## The measurement

Skills per rung, from the manifests:

| rung | skills | running total |
|---|---|---|
| Quickstart | 16 | 16 |
| **MVP** | **29** | **45** |
| V1 | 2 | 47 |
| Scale | 1 | 48 |

One command takes a founder from 16 verbs to 45. **That is not a ladder, it is a step and then a
cliff**, and it is Principle 2 ("just-in-time support, never premature ceremony") violated by the
mechanism built to enforce it. `boss map` already softens the *reading* — `postLaunch` folds the
after-you-ship arc, and v0.257.0's `aside` folds BOSS's own upkeep — but folding a list is not the
same as not installing the thing.

## What is actually inside MVP

At least three distinguishable arcs are wearing one rung:

- **The build spine** — `/spec`, `/smoke`, `/log`, `/close`, `/extract`. The declared `coreLoop`.
- **The AI-native set** — `/ai-first-init`, `/ai-cost`, `/cost-review`, `/ai-failure-states`,
  `/evals`, `/judge-traces`, `/red-team`. Load-bearing *only if the product puts an LLM in its own
  control flow*, which is a property of the project, not of the rung.
- **The post-launch arc** — `/measure`, `/health`, `/money`, `/onboard`, `/roadmap`, `/trust`,
  `/landing`, `/ship`. Already folded from the map, still installed on day one.

## The candidate fixes, cheapest first

1. **Condition on the project, not the rung.** The AI-native set has an existing detector
   (`cost-budget-loop` and `ai-failure-state-loop` both open at *the first LLM SDK call in `src/`*).
   That predicate is already trusted to fire a conscience moment — it could gate installation.
2. **Split MVP's manifest into an inner ladder** (`mvp` → `mvp --ai` / post-launch), which is the
   honest version of what `postLaunch` and `aside` are approximating in the renderer.
3. **Do nothing to installation and improve the read.** Cheapest, and possibly correct: an
   unfolded skill costs nothing but a line — *except* that each one's `description:` frontmatter is
   loaded for skill discovery, which is [[IDEA-085]], and that cost is real.

**Measure before building the gate** (this repo's own rule): before splitting anything, count how
many real projects at MVP ever invoke the AI-native set. If most do, the rung is right and only the
narration is wrong.

## Why it is captured rather than built

Fix 1 or 2 is a change to what `boss unlock` *installs*, which is the least reversible thing BOSS
does to a founder's repo — `boss sync` can add, and removal needs a `supersedes` entry and consent.
Getting this wrong strands files in every project that unlocked MVP. It wants a decision, not a
sweep.

## Capture log

- **2026-09-09 — CONFIRMED on the real path, not off the manifests.** The `boss adopt` walk
  (v0.265.0) adopted six real-shaped repos; three landed at MVP, and `boss map` listed **36 verbs
  at once** in each — after the `postLaunch` and `aside` folds already ran. The count in this
  record was derived from manifest arithmetic; this is the number a founder actually reads,
  thirty seconds after handing BOSS a working codebase.
- **Still not built, and the reason is unchanged.** What `boss unlock` installs is the least
  reversible thing BOSS does to a founder's repo. The rule in this record stands: measure how many
  real MVP projects ever invoke the AI-native set before splitting anything.

- **2026-09-09 — fix 3's REAL cost is now measured and partly paid ([[IDEA-085]], v0.266.0).** This
  record's cheapest option was *"do nothing to installation and improve the read"*, with the caveat
  that an unfolded skill is not free because its `description:` is loaded every turn. That cost is
  now on the ledger and 3.3 KB of it is gone. **It does not close this record**: 36 verbs still
  arrive at once on the real adopt path, and the reading problem is separate from the installing
  problem.
- **Fixes 1 and 2 remain unbuilt for the unchanged reason.** What `boss unlock` installs is the
  least reversible thing BOSS does to a founder's repo. The rule stands: count how many real MVP
  projects ever invoke the AI-native set before splitting anything. That count is still 0 projects
  observed, not 0 usage.
