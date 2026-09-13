---
id: IDEA-017
type: idea
owner: product-lead
status: deferred (trigger-gated)
proof: library/practices/founder-domain-practices.md
created: 2026-06-02
---

# Founder-facing domain best-practices, accreted JIT

> **PARKED 2026-08-20** (Ajesh: *"any other idea worth parking / archiving"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written in this file.
>
> **The record already wrote the trigger and then stayed `exploring` anyway:** *"the day a real
> project… declares MCP in its app surface. **Until then this stays *exploring*** / decision-legible
> only."* Written before `deferred` had a lane on the board. Nothing about the read has changed — a
> JIT shelf of domain playbooks is a large surface to accrete for founders BOSS does not yet have.

## Current shape
- **What:** A fresh shelf of *how-to-build-X* domain knowledge that BOSS hands a founder **at the
  decision where their app earns it** — kept current through the existing `/vet` → `/boss-learn` loop
  rather than frozen into a skill. **MCP is the first instance** (a founder building an app with MCP
  aspects), but the idea is the general capability, not MCP specifically.
- **The gap (stated precisely — it's narrower than "we have no MCP practices"):**
  1. BOSS already has the *mechanism* to accrete best-practices — `/vet` (judge an unproven outside
     claim) → `/boss-learn` (route what proves out UP into `library/practices/`). What's missing is
     that the vet/learn loop today curates **how to build BOSS**, not **how to build a founder's app**
     (e.g. an MCP server). No *founder-facing domain* has been run through the pipe yet.
  2. There's no **JIT delivery surface** that puts founder-facing domain knowledge in front of a
     founder at the moment their project earns it.
- **Why this is home turf:** positioning is *"the thinking layer for AI-native founders."* In 2026
  "do I expose my product as an MCP server / consume MCP / neither?" is a genuine AI-native
  architecture decision — adjacent to what `/ai-first-init`, `/ai-cost`, `/ai-failure-states` already
  cover. The shelf belongs next to those, not as a bolt-on.
- **The staleness constraint decides the shape (load-bearing):** MCP is ~18 months old and moving;
  hand-authored "MCP best practices" would be partly wrong within months — exactly the **RVW-001
  anti-pattern** `/vet` already rejected (static best-practice rules regress toward brittleness). So
  the content **must ride the vet/learn loop** (fresh, earned, dated), not freeze into a skill. This
  makes IDEA-017 the **founder-facing twin of [[IDEA-014]]**: "ride the model curve on purpose"
  → "ride the *ecosystem* curve on purpose." Same staleness problem, different fast-moving substrate.
- **Is it earned yet? Honestly, no (Principle 2).** As of capture, the founder of this AI-native
  incubator doesn't know MCP well and isn't blocked on it — so BOSS's founders almost certainly
  aren't either. This is a *coming* need, not a *present blocked* one. **Capture, don't build.**
  Re-open trigger below.
- **Smallest version (when earned):** one decision added to `/ai-first-init` —
  *"Does your product expose tools to other AI apps (MCP **server**), consume external tools (MCP
  **client**), or **neither**?"* — that, on "yes", hands off to a `library/practices/` doc kept
  current via vet/learn. Reuse what already exists rather than inventing: an MCP tool call is just
  another AI call → `/ai-failure-states` applies; an MCP server is an attack surface → a
  `mentor-humane`/security beat; "build **on** MCP vs **for** it" → `mentor-architect`. **Not** a
  front-loaded MCP module shown to every founder.

## Capture log
- 2026-06-02 — captured from a conversation that started on MCP host-portability ([[IDEA-006]], "can
  BOSS run outside Claude Code?") and crossed an axis to "we have no mentor/best-practices for a
  founder building an app *with* MCP aspects — maybe add best practices along the way as needed."
  Reframed from "add MCP best practices" into the general capability: founder-facing domain knowledge
  accreted JIT via the loop BOSS already has, with MCP as the first instance. Distinct from
  [[IDEA-006]] (that axis = BOSS-as-guest; this axis = founder's-app-as-domain).

## Open questions (carried forward)
- **Re-open trigger:** the day a real project (Ajesh's own, `betabeta`, `margin`, or a founder)
  declares MCP in its app surface. Until then this stays *exploring* / decision-legible only.
- **Where does the shelf physically live?** `library/practices/` is BOSS-internal (superset
  practices). Founder-facing domain playbooks may want a distinct shelf (the AI-MVP playbook in
  `docs/dossier/` and `docs/mentor-practitioners.md` are the closest precedents). Name the shelf
  before the first doc lands so it doesn't get conflated with BOSS-build practice.
- **Freshness mechanism:** does the shelf carry a "last vetted" date + a re-vet cadence, so a
  stale-domain doc trips a moment the way `cost-stale` does? (The IDEA-014 rhyme made operational.)
- **First-instance scope:** for MCP specifically — server vs client vs neither is the decision; what
  are the 3–5 best practices per branch that are stable enough to be worth writing *now* vs. the ones
  too volatile to commit (and should stay a `/deep-research` + `/vet` pull at build time)?
- **Is the general capability itself premature?** Capturing the general idea (vs. just an MCP note)
  risks over-abstracting from n=1 domain. Hold the general framing as the *capture*, but the first
  *build* should be the concrete MCP slice — let the second domain prove the generalization.

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
