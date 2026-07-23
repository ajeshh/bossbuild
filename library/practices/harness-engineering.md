---
id: PRACTICE-harness-engineering
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (architecture + experts threads) — Anthropic engineering ("Effective harnesses for long-running agents"; "Scaling managed agents"; the Agent-Computer Interface), Dex Horthy (12-factor agents), Karpathy (verifiability thesis), the spec-driven-development lineage (GitHub Spec Kit / AWS Kiro). Named by two independent threads as BOSS's biggest architecture gap. BOSS v0.110.0.
---

# Practice — Harness engineering (design the thing *around* the model, not just the prompt)

> **Where this sits.** [`context-discipline`](context-discipline.md) owns the *context* leg of the model's
> environment; this owns the whole environment. The 2026 progression is **prompt engineering → context
> engineering → harness engineering**: the frontier is no longer the prompt, it's the repo-resident
> scaffolding — init scripts, a definition of done, verification gates, a handoff log, well-shaped tools —
> that makes an agent reliable *across* context windows and *as models change*. BOSS already builds slices of
> this (skills, `/smoke`, `RESUME.md`, the conscience) without ever naming it. Name it, so a founder builds it
> on purpose instead of by accident.

## The harness is an artifact you design

Anthropic's finding: on long-horizon work, the **harness structure itself** is a bigger lever than raw model
capability. Four failure→fix pairs a founder can steal directly:

- **Premature "done" → a failing-feature list.** The agent will declare victory when the happy path runs.
  Give it a checklist of *failing tests that must pass* as the definition of done — the spec is the target,
  not the vibe. (This is what `/spec`'s acceptance criteria + `/smoke` + `/evals` already are; wire them as
  the *gate*, not an afterthought.)
- **Buggy handoffs → a progress log + a startup health check.** A fresh context window must be able to resume.
  Keep an append-then-compacted progress note (BOSS's `RESUME.md` / `/close`) and an `init.sh` that gets a
  clean checkout running in one command. The handoff note *is* the harness's memory.
- **Unvalidated features → self-verification before "done."** The agent should check its own work (run the
  tests, hit the endpoint, screenshot the page) before it claims completion — not hand you the first draft.
- **Friction → an `init.sh`.** Every manual step between "clone" and "running" is a place the agent (and the
  next you) loses time and state. Script it.

Anthropic also names the **Agent-Computer Interface (ACI)** — *tool design is a first-class discipline*, the
HCI of agents. A tool with a clear name, tight schema (strict tool-use now guarantees the arguments), and an
error message the model can act on is worth more than a cleverer prompt.

## The model is a dependency you don't control

The load-bearing stance, and the one that keeps a harness from rotting: **build assuming the model gets
better.** Harnesses "encode assumptions about what the model can't do — and those assumptions go stale as
models improve" (Anthropic). So put the deterministic guardrails around the nondeterministic core (the
`agent-security` shape), and **don't hardcode a workaround for a limitation the next model won't have.** This
is the same discipline as model-recalibration ([[IDEA-014]]) pointed at the harness: re-ask what the harness
needs to do every time the model jumps, and *delete* scaffolding the model outgrew (the host-subtraction
instinct, [[IDEA-028]]).

## Spec-driven, before it had the name

2026's loudest build-workflow idea — **spec-driven development** (GitHub Spec Kit, AWS Kiro: *the spec is the
durable artifact, the code is regenerable output*) — is a strong form of what BOSS's `/spec` already does
(IDEA → FEAT → acceptance criteria → smoke). **Adopt the stance** (the spec, not the code, is the source of
truth an agent regenerates against) and **reject the ceremony** — the multi-file `specify → plan → tasks →
implement` scaffold is premature for a day-one founder (Principle #2). A one-page FEAT spec with acceptance
criteria *is* the executable artifact; you don't need the framework to get the discipline.

## Verifiability decides what to build first (Karpathy)

*"Traditional software automates what you can specify; LLMs automate what you can **verify**."* Before you
build an AI feature, ask: *does this feature have an automatic reward/verification signal?* Features with one
(a test can say pass/fail, an eval can grade it) sit on the smooth side of the jagged frontier — the agent
will nail them, and the harness can gate them. Features without one (taste, judgment, "did it capture the
*point*") stay on the jagged side — human-verified, no matter how the harness grows. **The harness's job is
to expand what's verifiable** (more tests, more evals, a `/smoke` that actually exercises the path) so more of
the product moves to the side the agent can be trusted on.

## Altitude / JIT (the harness accretes; don't build it day one)

A Quickstart founder does not sit down and "design a harness." It **accretes**, one rung at a time, and BOSS
already ships the rungs: `CLAUDE.md` (the context) → `/smoke` (aliveness gate) → `/spec` acceptance criteria
(definition of done) → `RESUME.md` + `/close` (the handoff) → `/evals` + `/red-team` (verification). The value
of naming it is that at MVP+ the founder can see the *shape* and fill the missing rung on purpose, instead of
wondering why the agent keeps declaring done on a broken build. Never a wall on day one (Principle #2).

## Relationship to BOSS

**BOSS is itself a harness** — skills are tools, hooks are gates, `/smoke` + `/evals` are the verification
loop, `RESUME.md` is the handoff, and the conscience is a guardrail around a nondeterministic founder+model.
It sits with [`context-discipline`](context-discipline.md) (the context leg), [`scalable-architecture`](scalable-architecture.md)
(conventions as the harness's rules), [`git-workflow`](git-workflow.md) (the daily flow), and
[`agent-security`](agent-security.md) (the deterministic guard). The natural place to surface this JIT to a
founder is `mentor-architect`.
