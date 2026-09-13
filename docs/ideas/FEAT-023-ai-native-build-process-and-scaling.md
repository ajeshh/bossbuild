---
id: FEAT-023
type: feature
owner: product-lead
status: shipped
gist: The AI-native build process and the unauthored V1→Scale rung: trunk-based flow, agent parallelism, architecture that survives the climb. Not team-specific — a solo founder needs all of it.
program: founding-teams
from: IDEA-037
proof: library/practices/scalable-architecture.md
created: 2026-06-20
shipped_on: 2026-06-20
shipped_threads: "thread 1 (git-workflow) — v0.88.0; thread 2 (scalable-architecture) — v0.89.0; thread 3 spun out → IDEA-040 (trigger-gated)"
spun_to: IDEA-040 (thread 3 — the V1→Scale rung, split out when threads 1-2 shipped at v0.88.0/v0.89.0)
---

> **✅ SHIPPED 2026-06-20.** Scope was the solo-applicable build-process + architecture practices —
> **threads 1–2 both shipped** (`git-workflow` v0.88.0, `scalable-architecture` v0.89.0). Thread 3 (the
> V1→Scale org rung) was **not** part of this FEAT's buildable scope: it's a different altitude (org, not
> repo), not solo-applicable, and trigger-gated — so it was **split out to [[IDEA-040]]** rather than held
> open here. This FEAT is closed; IDEA-040 carries the deferral + the build trigger.

# FEAT-023 — AI-native build process & the V1→Scale rung (NOT team-specific)

> **Spun out of the IDEA-037 founding-teams triage** (2026-06-20). The research surfaced a body of work
> that is **not founding-teams-specific** — it serves *any* growing AI-native project, solo or team. Keeping
> it in FEAT-021 would have mis-scoped the founder layer. This is its own track. **Capture, don't build**
> until it clears the solo test + earns priority against the n=0-demand reality. Source: compendium B5
> (dev process / git workflow), B6 (roles + org), B7 (technical scaffolding).

## Why separate from FEAT-021

FEAT-021 is the *founding-team relationship* layer (decide-together, share, mentor the pair, credit/equity).
**This** is the *build-process + scaling discipline* — trunk-based flow, agent parallelism, architecture
that survives the climb, and the unauthored V1→Scale mode rung. A solo founder needs all of it. It rhymes
with FEAT-021 only where ownership/DRI overlaps (noted below), but it's a different concern at a different
altitude (the mode ladder, not the team).

## The three threads

### 1. `git-workflow` / `team-build-process` practice (B5) — ✅ SHIPPED v0.88.0
**Done:** `library/practices/git-workflow.md` (UP) + folded DOWN into the L1/MVP template
(`claude-append.md` "Git workflow" section). Everything below landed: trunk-based default, worktree cap =
review capacity, risk-tiered review with `/smoke`+`/evals`+`/red-team` as the high-risk tier, read-the-
test-diff-harder, whoever-clicks-merge-owns-it, mob-the-hard-problems, METR honesty anchor, and the shared
ownership principle. Eval gate 120/0; `/tmp`-verified (DOWN lands on `boss unlock mvp`).

The AI-native-building fundamentals, de-cargo-culted for 2–5 people:
- **Trunk-based default** (DORA: elite 2.3× more likely; <3 active branches, hours-long, merge daily);
  `/smoke` is the pre-commit gate that makes it safe. **CI is a practice, not a platform** — a small team's
  smoke check *is* its CI.
- **Git worktrees = the AI parallelism primitive**, capped at **≈2–4 = your *review* capacity, not your
  agent count** (the code-review bottleneck is the defining AI-native problem: ~4× output, ~12% delivered).
- **Risk-tiered review, not blanket gates.** **"Whoever clicks merge owns what the agent wrote"** (Osmani);
  **read the test diff harder than the code** (agents rewrite assertions to match broken behavior); wire
  BOSS's `/smoke` + `/evals` + `/red-team` in as **the high-risk tier**; the *other* human reviews high-risk.
- **Vertical slices + informal ownership** (a FEAT is a natural slice) avoid merge hell.
- A conscience nudge on **high-stakes accept-without-second-look** (the "AI-as-pair degrades the questioning
  reflex" finding) — *mob the two humans + agent on hard/novel problems.*
- **Honesty anchor:** METR (n=16) — experienced devs on *mature* repos were 19% slower with AI while
  *believing* 20% faster. The perception-gap caveat (opposite population to a greenfield startup).
- *Ownership principle shared with FEAT-021:* **ownership = prompt-author intent + reviewer acceptance**
  (the blameless-but-accountable answer to "who owns the AI bug") — state once, reference from both.

### 2. `scalable-architecture` / `conventions-as-code` practice (B7) — ✅ SHIPPED v0.89.0
**Done:** `library/practices/scalable-architecture.md` (UP). Covers modular-monolith-first, migrations-as-
code (schema = the one-way door + the AI-drift guardrail), conventions-as-code (formatting-as-law,
boundaries-as-lint, strict types), the ratchet (extends `quality-ratchet`, not restated), and the
one-canonical-context-file finding (points at `context-discipline`). **UP-only** — the `mentor-architect`
DOWN was deferred to avoid a live edit collision with a concurrent session (not a judgment call; wire it
when that session lands). Eval gate 120/0.

- **Modular-monolith-first, extract when forced** (Fowler) — defer the distributed-systems tax until a real
  seam demands it.
- **Migrations-as-code from day one** (the one thing that's expensive to retrofit).
- **The ratchet pattern** (Notion's eslint-seatbelt / quality-ratchet, already in BOSS's library) +
  **conventions-as-code** so standards are enforced, not remembered.

### 3. The V1→Scale rung of the mode ladder (B6) — ➡ SPLIT OUT to [[IDEA-040]]
This was never part of FEAT-023's buildable scope (different altitude — org, not repo; not solo-applicable;
trigger-gated). It now lives as its own captured, trigger-gated idea: **[IDEA-040 — the V1→Scale mode
rung](IDEA-040-v1-scale-mode-rung.md)**, which carries the full B6 spine (DRI + FACe + give-away-your-Legos
conscience moment + coordination-symptom breakpoints), the **DO-NOT-REHASH deferral note**, and the **build
trigger** (a real project at V1 hitting a coordination symptom — or the alternate teams handoff trigger).
Don't re-open the org rung here; FEAT-023 is closed at threads 1–2.

## Restraint / sequencing (as shipped)

- **Solo test:** threads 1–2 (build process + architecture) passed it cleanly — a solo founder benefits day
  one. **Shipped** as `git-workflow` (v0.88.0) and `scalable-architecture` (v0.89.0).
- **Thread 3 (the org rung) → [[IDEA-040]]**, deferred until a real V1-stage project (dogfood trigger), per
  the canvas's Scale-deprioritization. Splitting it out (rather than holding FEAT-023 "building") keeps the
  status honest — a feature that's done with its buildable scope is *shipped*, not perpetually open.

## Notes
- Source: [RESEARCH-COMPENDIUM-2026-06-20](../research/RESEARCH-COMPENDIUM-2026-06-20.md) B5–B7.
- Related: [[IDEA-040]] (thread 3, split out), [[IDEA-037]] (the team layer it was scoped out of), the
  existing `quality-ratchet` practice, [[IDEA-014]] (model-recalibration — the staleness discipline these
  practices inherit), the unauthored `L3-scale` stage.
