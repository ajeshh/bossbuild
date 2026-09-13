---
id: RVW-008
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: ADAPT
route: founder-facing (mentor-architect coaching frame + /spec or /ai-first-init triage) — scope-gated, modest
---

# RVW-008 — "agent" is an umbrella; categorize by architecture, start at Category 1

## The claim
- **Source:** Lenny's Newsletter — Hamza Farooq & Jaya Rajwani. `docs/research/inbox/three-categories-of-ai-agents.md`
- **Core assertion:** *Don't prioritize agent ideas on one impact/effort matrix — they're
  architecturally different (deterministic automation / ReAct / multi-agent network). Classify first;
  that determines complexity, cost, timeline, metrics. **Start at Category 1; earn your way up.***

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — strongly aligns.** "Start simplest, earn the ceremony" *is* PRINCIPLE #2 + the pseudo-app-vs-real-app thesis. The per-category outgrowth signals mirror BOSS's mode-unlock triggers. |
| 2 | Evidence grade | Practitioner + enterprise examples + real metrics + IBM/Levels-of-Autonomy references. **But Hamza corpus** — apply the author-concentration discount (this is 1 of 6 of his pieces in the batch). |
| 3 | Duplicate or sharpen? | **Mostly duplicate at a new altitude.** The principle is BOSS's core thesis at the *project-mode* level. At the *agent-architecture* level the vocabulary is new — a modest **sharpen**: a "which category is this agent / are you over-building?" triage for AI-native FEATs. |
| 4 | Who serves / harms? | Serves AI-native founders building agent products. **Scope mismatch:** written for enterprise teams (Fortune 500, ML teams, investor pressure) prioritizing a *backlog*; BOSS serves solo/small founders. Adopt the principle, not the framing. |
| 5 | Cost / ceremony | A triage question is low ceremony. The **tool taxonomy (n8n/LangGraph/ADK) violates PRINCIPLE #4** (stack-neutral; stacks are learned) — strip it. |

## Verdict: ADAPT (modest)

The categorize-then-start-simplest principle is a real but **modest** sharpen — it restates PRINCIPLE
#2 at the agent-architecture altitude. Worth folding into `mentor-architect`'s coaching of AI-native
founders ("which of the three is this, and are you starting at the right one?") and possibly a `/spec`
or `/ai-first-init` triage line. Not a new skill.

## If ADOPT / ADAPT
- **What's modified:** keep the three-category lens + "start Cat-1, earn up" + the outgrowth signals;
  **strip the enterprise framing and the stack/tool taxonomy** (PRINCIPLE #4). Reframe for one
  founder, not an agent-team backlog.
- **What to do (scope-gated):** a `mentor-architect` talking point + an optional `/spec` /
  `/ai-first-init` question for AI-mediated FEATs. Founder-facing/mentor surface → queued, light.
- **Self-check (logged):** BOSS *is* a Category-3 multi-agent system, and the post even names Claude
  Code as the Category-2 exemplar. Worth a wry audit that BOSS *earned* its multi-agent shape rather
  than defaulting to it — the board work (v0.36) + R&H #1 already guard this; no action needed, just
  noted.

## Notes
- [[RVW-011]] (n8n travel-agent tutorial) is the **worked example** of this framework — folded in
  there, not vetted separately on its merits.
- Author-concentration discount applied (Hamza corpus). The *independent* backing is the cited
  IBM / Levels-of-Autonomy work, not the newsletter itself.
- BOSS version when recorded: 0.41.0
