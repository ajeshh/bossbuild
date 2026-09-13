---
id: IDEA-043
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: Six jobs an agentic build has to do, used as a checklist against BOSS's 360° claim. Not tools BOSS should own — moments BOSS should have a voice at.
proof: library/practices/agentic-build-jobs.md
created: 2026-07-02
---

# IDEA-043 — The agentic-build "six-job" checklist (does BOSS's 360° hold?)

> **PARKED 2026-08-20** (Ajesh: *"any other idea worth parking / archiving"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written in this file.
>
> **The record already reached a verdict and it was NOT-YET:** its `/vet` outcome was **ADAPT** — one
> sliver adopted (prompt-thrash → eval data, routed via [[IDEA-025]]) — and the remainder graded
> *"**NOT-YET** — re-open when a real founder build ships an agent loop and gets stuck."* The adopted
> sliver shipped; the parked half is engineering guidance for **n=0 agents**, which the record itself
> warns against pre-authoring.

> Seed: Ajesh, 2026-07-02 — a Reddit/FlowStacks infographic ("Six GitHub repos for building
> agentic workflows, grouped by the job they do") surfaced as *possible competition*. First read:
> **not** competition — those are engineering-layer parts (frameworks/infra), BOSS is the incubator
> layer that decides *which parts, when, and whether to build at all*. But Ajesh's sharper reframe:
> *"we're not trying to be the best engineering tool, but holistically 360° — this might be table
> stakes / best-practice we should have a stance on."* So this is **capture, don't build** (CLAUDE.md
> #3): a holding pen for the question *does a 360° incubator have a point of view at each of these six
> build-moments, so a founder isn't left exposed?*

## The reframe (why this is a lens, not a feature request)

The six jobs aren't tools BOSS should own. They're a **checklist that validates BOSS's 360° claim**:
when a founder's build includes an AI agent, does BOSS's scaffolding *and conscience* have a voice at
each moment? Owning a sandbox is not BOSS-shaped. Having a stance — "you're about to give this agent a
tool; here's the dual-use question" — is.

## Coverage map (checked against `library/practices/`, 2026-07-02)

| Job (their tool) | The *practice* behind it | BOSS stance today | Verdict |
|---|---|---|---|
| Run code safely (E2B) | sandbox AI-gen/untrusted code | `agent-security.md` | ✅ covered |
| Evals & red-team (promptfoo) | verify before ship | `revalidation.md`, `ship-it-live.md`, `/red-team` ([[IDEA-033]]), `harm-taxonomy.md` | ✅ strong (our best) |
| Give agents real tools (MCP) | tools as dual-use surface | `agent-security.md`, `context-discipline.md`; founder-facing = [[IDEA-017]]; publishing = [[IDEA-033]] | 🟡 partial (security yes; "how to add one" no) |
| Start from verified recipes (awesome-ai) | proven-not-vibes patterns | the whole library → `/vet` → `/boss-learn` → hardened-core model | ✅ this *is* BOSS |
| **Agent loop (smolagents)** | how you structure an agent at all | — | ❌ gap |
| **Prompt optimization (DSPy)** | stop hand-tuning; optimize on eval data | — | ❌ gap |

**Read: 4 of 6 already covered** — and the two BOSS is strongest on (verify-before-ship, verified
recipes) are the two the infographic itself flags as riskiest ("eval quality depends on your tests",
"a starting point, not a final standard"). The 360° claim mostly *passes*.

## The two genuine gaps (the only build candidates — each earn-it-gated)

1. **Agent-loop guidance** — BOSS has no stance on structuring an agent (loop/tools/termination/
   observability). Candidate shape: a `library/practices/` note, *host-neutral* ([[IDEA-032]]),
   pointing at patterns not baking a framework. **Caution:** most engineering-shaped of the six; risks
   pulling BOSS toward "best eng tool" — the exact thing this idea says we are *not*.
2. **Prompt-optimization-as-a-smell** — the DSPy insight isn't "adopt DSPy," it's the *conscience*
   read: **hand-tuning prompts in circles is a signal you need eval data, not more fiddling.** This is
   BOSS-shaped (a moment/voice, not a tool) and ties directly to trace-native evals ([[IDEA-025]]) and
   upstream conscience ([[IDEA-026]]).

## Do NOT re-solve

Sandbox, red-team, MCP-security, verified-recipes machinery — already have homes. This IDEA must not
duplicate [[IDEA-033]] (red-team/MCP-publishing/constrained-decoding) or [[IDEA-017]] (founder-facing
MCP). If a gap here overlaps one of those, it belongs *there*, not in a new build.

## Smallest worthy slice (if either gap earns it)

Gap 2 first (it's on-voice): one line into `ai-ux-patterns.md` / a conscience read that names
prompt-thrash as an evals signal, riding [[IDEA-025]]. Gap 1 stays parked until a real founder build
actually ships an agent loop and gets stuck — don't pre-author engineering guidance for n=0 agents.

## Notes
- Twin caution: reacting to a competitor screenshot by adding roadmap is the scope-creep BOSS's own
  Principle warns against. The value here was the *audit* (360° holds), not the additions.
- Verdict of record: [RVW-065](../research/verdicts/RVW-065-flowstacks-six-agentic-build-jobs.md) —
  **ADAPT.** Rejected the "adopt the six as table-stakes" framing (4/6 already covered; blanket
  adoption fails #2/#4 + R&H #1). Adopt one sliver: gap 2 (**prompt-thrash → get eval data**) as a
  conscience read via [[IDEA-025]], handed to `/boss-learn` DOWN. Gap 1 (agent-loop guidance) =
  **NOT-YET** — re-open when a real founder build ships an agent loop and gets stuck.
