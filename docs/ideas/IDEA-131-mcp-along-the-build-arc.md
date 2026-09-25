---
id: IDEA-131
type: idea
kind: capability
owner: product-lead
status: shipped (Unreleased)
proof: library/practices/mcp.md
gist: Founders ask "should we have a smart way of doing MCP — when, how, when does it pay off?" as they build up a new idea; BOSS answers the architecture question but not the timing one.
created: 2026-09-25
---

# MCP along the build arc — when it fits how a founder builds up an idea

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._
- **What:** The founder's real question isn't "is my MCP config safe?" or "which of three shapes?" —
  it's *"where does MCP belong in the way I'm building this idea up, and at which point does it start
  paying for itself?"* A pattern over the arc (idea → canvas → prototype → MVP → V1), not a one-off
  architecture call.
- **What BOSS has today:** a decision doc (`library/practices/mcp.md` — three shapes: use it in your
  dev loop, consume a server, expose your product as one), a row in `mentor-architect`, the security
  half in `agent-security.md`, and secrets-guard asking on `mcp__` calls that touch secrets. All of it
  answers *which shape and is it safe* — none of it places MCP on the founder's timeline.
- **Who it's for:** founders building in Claude Code (and the claude.ai "Connectors" crowd who don't
  know that's the same thing) who feel they *should* have an MCP strategy and don't know when.
- **Shipped 2026-09-25 (Unreleased): candidates 1 and 3, as text.** `library/practices/mcp.md` gained
  *Along the arc* (the table by mode + the replace question, and the impulse named); `mentor-architect`'s
  integration row asks the replace question when the ask is *when*. No skill, no hook. Candidate 2 not built.
- **Candidates as captured:**
  1. The practice gains an "along the arc" section — what MCP is worth at each mode (Quickstart: probably
     nothing, or one research/docs server; MVP: the dev-loop servers for the stack you picked; V1: consume
     at runtime when a FEAT needs it; Scale: expose, if it's a channel). Text only; `mentor-architect`
     already routes to it.
  2. A read of the connected servers (`.mcp.json`, settings) in `boss status` / `/read-repo`: list them,
     run the existing pre-install checklist, flag the lethal trifecta, count their per-turn tokens.
     **Ajesh doubts the value** (2026-09-25) — it's a safety check, not an answer to the question founders ask.
  3. A conscience-moment framing: the "oo we should do MCP" impulse is often shiny-object drift; the
     useful reply is "what would it replace that you do by hand today?"

## Capture log
_Append-only. Newest at the bottom. Don't edit old entries._
- 2026-09-25 — Ajesh, after a read of how BOSS treats MCP: *"not sure what value it has. i think often
  founders are like oo we should have a smart way of how we do mcp, when to do it, how to do it, when is
  it beneficial in their work system pattern of building up a new idea"*. Came in as a capture of the
  config-read idea (candidate 2); reframed by that sentence into the timing question.
- 2026-09-25 — Ajesh: *"go for it"* on 1 + 3. Shipped as text in the practice and the mentor. Candidate 2
  stays unbuilt: nothing has shown it answers a question a founder asks.
- 2026-09-25 — Ajesh: *"lets continue with implementation"*. The practice had no route in Quickstart
  (mentor-architect arrives at MVP), so the guide's WAYFINDING map gained a row in founder words →
  `boss craft mcp` + `@mentor-architect`; `boss craft` joined STANDING_COMMANDS. Rendering it exposed a
  bug since v0.275.0: the HTML map printed every token as a locked skill "at undefined". Fixed, with a
  test that fails on the old renderer.

## Open questions
- Is this real founder demand or our guess at it? n=0 founders have asked (see
  [[first-external-evidence-reaim]] — compose and subtract, never add a skill). The EVID-001/003 asks
  were orientation, progress, focus — does "when does MCP fit" belong under *orientation*?
- Is the right answer mostly "not yet" — and if so, is the value in saying *that* well, at the moment the
  impulse shows up?
- Does candidate 1 fit inside `mcp.md` (which says "decide whether it matters yet") or is the arc the
  thing that doc is missing?
- Related: [[IDEA-017]] (founder-facing domain shelf; MCP was its first instance, parked) ·
  [[IDEA-006]] (BOSS-as-MCP-server; the other altitude — BOSS's own relationship with MCP).
