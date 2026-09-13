---
id: RVW-070
type: verdict
owner: mentor-architect
status: recorded
created: 2026-08-11
verdict: ADAPT (sit-on at a seam; author nothing)
route: UP library/practices/harness-engineering.md · DOWN stages/L1-mvp/.../spec/SKILL.md step 6 · dossier HOST-SUBTRACTION-PASS-002 — shipped v0.144.0
---

# RVW-070 — "Claude ships a Plan agent; BOSS should integrate it"

## The claim

- **Source:** the Claude Code host — built-in `Explore` and `Plan` subagents, each in its own context
  window with a scoped toolset; `Plan` is the research agent that runs during plan mode to gather
  context and return an implementation plan. Primary (host docs + the agent registry).
- **Ajesh, 2026-08-11:** *"there is now the plan agent to research and plan feature as part of claude.
  trying to figure out how to integrate the best of claude to this."*
- **The question underneath:** is this competition for `/spec`, a replacement for it, or something else?

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it tests one.** IDEA-028's rule is *when the harness absorbs a mechanism, re-rolling it is drift.* The honest reading is that the host **added** a layer BOSS never built, rather than absorbing one it had. |
| 2 | Evidence grade | **Primary and structural** — a shipped host capability, not a claim to weigh. The only judgment call is where it sits relative to BOSS. |
| 3 | Duplicate or sharpen? | **Neither — it's adjacent, and mistaking it for a duplicate is the trap.** `/spec` answers *should we build this and how will we know it's done*; `Plan` answers *what's the file-by-file route*. Different inputs (the bet vs. the codebase), different rot (the founder's bet vs. the code). |
| 4 | Who serves / harms? | Serves `eng-builder` / `returning-founder` most (they'd reach for plan mode anyway). **The risk is to beginners** — a founder who reads a confident implementation plan can mistake it for validation that the feature is worth building. The mitigation is the framing, and it is the load-bearing part of what shipped. |
| 5 | Cost / ceremony | **One optional question in `/spec`.** Not a new agent, not a new skill, no new machinery. The cheapest possible integration. |

## Verdict: ADAPT — sit on it at a seam, author nothing

**Compose, don't merge:** `/spec` (judgment) → **plan mode** (route) → coder → `/smoke` + the
test-diff read. The line that carries it:

> **`/spec` decides the destination; the plan picks the road.**
> A route that arrives without a spec is a well-planned trip to nowhere.

Three things follow, and the third is the one with teeth:

1. **Never author a BOSS planner agent.** That would be re-rolling an absorbed mechanism — the exact
   drift IDEA-028 exists to prevent. Same for a codebase-search agent: `Explore` already exists.
2. **The offer must be skippable and the framing must not oversell.** An implementation plan is not
   acceptance criteria and cannot tell you whether the work was worth doing. `/spec` says so out loud.
3. **Sit on a host primitive only at a seam you could close by hand.** ← *new, and the real output.*

## The lesson that sharpens IDEA-028 (worth more than the integration)

**Ultraplan was removed this month** — a research preview since spring, gone, with plan mode named as
the replacement. BOSS lost nothing, having built on it never. But it is the **first observed case of a
host primitive vanishing**, and it upgrades the audit question:

- Pass 001 asked: *has the host absorbed this?*
- Pass 002 must also ask: **what happens to us when the host un-ships it?**

The resulting rule: **prefer host primitives at the boundaries of BOSS's flows, not in their
interiors.** `/spec` → plan mode is safe precisely because if plan mode disappeared, step 6 degrades
to what it already did — hand the FEAT to the coder. That is a seam. A primitive load-bearing *inside*
a BOSS mechanism would be a dependency, and on a preview-heavy host, dependencies rot.

## What shipped (v0.144.0)

- `docs/dossier/host-subtraction-pass-002.md` — per-primitive verdicts (`Plan` sit-on · `Explore`
  sit-on · `/doctor` adopt · Artifacts opportunistic · cross-session messaging not-yet · Workflows
  sit-on, unchanged · conscience keep, unchanged).
- `library/practices/harness-engineering.md` — **"Don't author what the host ships — name the seam"**,
  with the vanish test stated as a question a founder can actually apply.
- `stages/L1-mvp/.../spec/SKILL.md` step 6 — the offer, bounded, with the explicit degradation note
  for hosts without plan mode.

## The line to keep

**A planning agent can tell you the best way to build the wrong thing.** BOSS's value is the question
asked one altitude earlier, and no built-in subagent asks it. The moat didn't move.
