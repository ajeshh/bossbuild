---
id: IDEA-004
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: Values as a decision infrastructure agents can actually consult — a do/avoid/escalate table per value, plus an elevation ladder where humans and agents earn scope instead of being granted it by prompt quality.
proof: library/practices/temple-culture.md
created: 2026-05-21
---

# Temple culture layer — human-agent collaboration as decision infrastructure

> **PARKED 2026-08-20** (Ajesh: *"archive ideas: 004, 007"*). `deferred` is the deliberate status — a
> decision, not a backlog item — and the re-open trigger is written at the foot of this file. The
> two cores below (the do/avoid/escalate table, the elevation ladder) still pass this record's own
> discipline test; what they do not have is a project to be built against. BOSS is one person and a
> tool, [[IDEA-052]] already holds the extended-team question, and [[IDEA-037]] holds the
> founding-team one. Building a culture layer for a team of one is the ceremony Principle #2 exists
> to refuse.

## Source
Distilled from Ajesh's vision doc (`~/Documents/stuff/founder_mentor_process_map_temple.md`,
"Temple culture, collaboration, and human-agent participation"). The doc's deepest claim is that this
is BOSS's *differentiator*: most agent products optimize for task completion; BOSS can optimize for
**collaborative capacity** — humans and agents building together through purpose, values, context, and
shared elevation. The lens is lived: large values-led volunteer projects that start from zero each year
and create coherence through scaffolding, not command.

## Current shape
- **What:** A culture layer that makes *values operational* — not a values statement, but a decision
  infrastructure that humans and agents both run on. Two concrete, actionable cores (the rest of the
  source doc is framing that only earns a place if it reduces to one of these):
  1. **Values as do/avoid/escalate rules.** Each project value translates into a table an agent can
     actually consult when a path is ambiguous. Example:

     | Value | Do | Avoid | Escalate when |
     |---|---|---|---|
     | Participation | Create entry points for different skill levels | Designing only for experts | A decision excludes affected stakeholders |
     | Stewardship | Consider long-term impact | Optimize only for short-term metrics | Growth creates harm or misaligned incentives |
     | Clarity | Make context legible | Hide assumptions or decisions | People/agents act without shared context |
     | Care | Protect dignity, trust, agency | Use shame, manipulation, pressure | A workflow affects vulnerable people |

  2. **The elevation ladder** (humans *and* agents earn scope, never granted it by prompt quality):
     Observer → Helper → Contributor → Steward → Lead, each with a Boss support artifact
     (orientation brief → starter tasks → review checklist → decision rules → strategy context).
     "A well-written prompt is not the same as integration." Agent autonomy tracks demonstrated
     performance, not hype.
- **Who it's for:** founders building a *team* (human, agent, or both) and who want the way they build
  to reflect the thing they're building. Routes in when collaboration/community/inclusion/scaling-from-
  small is central.
- **Why it fits BOSS:** extends Principle 1 (scaffolding) from project-shape to *culture* — vision →
  values → scaffolding → action — and gives Principle 6 (humane) teeth as runnable rules. Also frames
  BOSS's own agent behavior (the source doc's 10-point "Agent behavior code": serve the purpose not the
  prompt; preserve human agency; make context visible; hand off with care; support learning not dependency).

## The discipline (so this doesn't become abstract)
The source doc has ~450 lines of culture prose (story holder, wayfinder, collaboration-as-ecology,
elevation-over-replacement). Most of it is *inspiration*, not buildable. The test before anything from
this layer enters BOSS: **does it reduce to a rule, a check, or an artifact?** The two cores above pass.
Resist new canvases (Humane Business Model Canvas, Human-Agent Temple Canvas in the doc) unless a real
project pulls for them — the Humane Product Canvas is already the spine (Principle 6).

## Open questions
- Does this become a `library/practices/` entry (a culture/values practice every project can adopt),
  a `mentor-culture` agent, or framing baked into existing mentors? (Lean: a practice + the do/avoid/
  escalate table as a `/canvas`-adjacent artifact; revisit a `mentor-culture` agent at Scale.)
- Where does the values table live in a project — `.boss/values.json`, a doc, or canvas §? When is it
  authored (Quickstart is likely too early; values are *discovered* through tradeoffs, per the doc)?
- The elevation ladder overlaps the mentor JIT-per-mode logic (IDEA-003) and contributor onboarding —
  is it one mechanism or two?

## Relationship to other ideas
Pairs with [IDEA-003](IDEA-003-mentor-layer.md) (mentors coach the founder; this coaches *how the team —
human + agent — works*). The "values are discovered, not declared" insight is a candidate `/canvas`
heartbeat prompt. Likely lands as a practice via `/boss-learn`, not a mode feature.

## Gate

**Re-open trigger:** a real project running BOSS has **more than one human** making decisions
together — a cofounder, a first hire, a volunteer — and hits an actual ambiguity a values table
would have settled (someone made a call others would have made differently, and nothing written
down could adjudicate it). The elevation-ladder half re-opens on its own trigger: a project runs
**agents at more than one level of trust** and needs a rule for which one is allowed what.

Until one of those fires, this is inspiration with no project to be tested against — and the
discipline written into this record ("does it reduce to a rule, a check, or an artifact?") cannot
be run without one.
