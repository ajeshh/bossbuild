---
id: PRACTICE-automation
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: written 2026-08-20 (v0.165.0) to close a coverage gap found by the MCP-and-automation assessment — 28 practices and none about automation, while `/ai-first-init` step 1 has been shipping the load-bearing line ("the hardest line to fill honestly is what stays deterministic") with nothing backing it. Same shape as testing-with-agents.md: a stranded line gets a home. Rung 0 + the four-rung ladder extend RVW-008's three categories downward (most founder "automation" is a cron job; the categories start one rung too high). RVW-011 governs the vendor tier — name the rung, never the stack (PRINCIPLE #4). The rent-don't-author rule is harness-engineering.md's host-seam rule applied to automation for the first time.
provenance_public: Written to close a coverage gap: BOSS had been shipping the load-bearing line — *the hardest line to fill honestly is what stays deterministic* — with no practice behind it. The four-rung ladder deliberately starts one rung lower than the usual categories, because most founder "automation" is a cron job. The vendor tier follows PRINCIPLE #4: name the rung, never the stack.
last_reviewed: 2026-08-20
review_by: 2027-02-16
curve: craft-ai
---

# Practice — Automation (rent the runner, own the decision)

> **Where this sits.** [`harness-engineering.md`](harness-engineering.md) owns the thing you build *around
> the model while you work*. [`mcp.md`](mcp.md) owns the protocol decision. This owns the question
> underneath both, and the one a founder actually hits first: **should this run without me, and in which
> shape?** Blast radius and the failure channel are here; the agentic attack surface is
> [`agent-security.md`](agent-security.md).

## BOSS already ships the answer's first half

`/ai-first-init` step 1 asks the founder what's AI-mediated and what is **explicitly deterministic**, and
tells them *"the hardest line to fill honestly is what stays deterministic — the instinct is to route
everything through the model."*

That is the whole 2026 automation consensus in one line: **a deterministic core for reliability, an agentic
surface only for the genuinely ambiguous part.** Every row on the deterministic side is a row that can't
hallucinate, can't drift with a model release, and can be tested by something cheaper than an eval. This
practice is the ladder underneath that line — nothing more exotic.

## The ladder — four rungs, earn upward

RVW-008's three categories (deterministic automation → agent loop → multi-agent network) are right, and they
**start one rung too high**. Most of what a founder means by "can this be automated" is rung 0.

- **Rung 0 — a script and a schedule.** A shell script, a `Makefile` target, a cron entry, a CI job. No
  model. This is the correct answer far more often than it gets picked, because it is boring and legible and
  fails loudly.
- **Rung 1 — deterministic automation with a model *step*.** Fixed path, known branches; the model does one
  bounded job (classify, extract, draft) and returns a **schema'd** result the surrounding code can trust.
  The path does not change based on what the model decides.
- **Rung 2 — an agent loop.** The model chooses the next step. Earn this only when the path genuinely
  branches on something you cannot enumerate in advance. If you *can* enumerate the branches, rung 1 is
  cheaper, faster, and debuggable.
- **Rung 3 — multiple agents.** Earn it last, and mostly don't. The restraint is Principle #2, and the
  evidence favours it: the field's own best results come from *one* controlled loop with clear handoffs.

**Climb only on a failure you actually hit**, not on an anticipated one. Dropping a rung is cheap; the
reverse is where the weeks go.

## Three questions before anything runs without you

1. **What breaks if this runs wrong at 3am?** Blast radius before capability. An automation that can send
   mail, move money, delete rows or post publicly is a different object from one that writes a file. Bound
   what a wrong run can *do*, rather than trying to make it never be wrong.
2. **Is there a verification signal?** Karpathy's line, via `harness-engineering.md`: *LLMs automate what you
   can verify.* If nothing can say pass/fail without you reading it, it is not ready to run unattended — you
   have not automated the work, you have moved it to a worse time of day.
3. **Who gets told when it fails?** An unattended loop with no failure channel is a silent one, and silence
   reads as success for exactly as long as it takes to become expensive. Name the channel before the trigger.

A "no" to any of the three is not a veto — it's the thing to build before the automation, not after.

## Retries live in the runner, never in the model

State, retry limits, backoff and escalation belong to the orchestration layer. A model asked to handle its
own retry will retry itself, confidently, into your bill — and each attempt re-enters a context that now
contains the failed one. The same split applies to memory: what you cannot afford to lose belongs in a
durable log outside the context window, not in the loop's head.

Idempotency is the cheap insurance. An automation that runs twice should produce the same result, because
sooner or later it will run twice.

## Rent the runner — the host already ships most of this

The rule from [`harness-engineering.md`](harness-engineering.md) applies here unchanged, and this is its
largest instance: **don't author what the host ships; sit on a primitive at a seam you could close by hand.**

- **In-session, deterministic, on-event** → your host's hook mechanism. Runs every time, no model call, no
  interpretation. This is what BOSS's own conscience is.
- **Out-of-session, on a schedule or a trigger** → the host's scheduled/triggered agents (Claude Code ships
  Routines: cron, webhook, or repo event), or plain CI. You do not need to build a scheduler.
- **Connecting SaaS to SaaS** → the no-code tier is a real answer and often the cheapest one. BOSS names the
  **rung**, never the vendor (Principle #4) — the tools move faster than any doc, and a baked-in recipe is
  the thing this shelf refuses to become.
- **Long-running work behind a tool call** → MCP's Tasks extension: the server mints a durable handle you
  poll, instead of holding a connection open. See [`mcp.md`](mcp.md).

The seam test, applied: *if this primitive vanished tomorrow, what breaks?* "One step becomes a manual
command" is a seam. "The business stops" is a dependency you took on without deciding to.

## What an automation costs that a feature doesn't

- **It runs when nobody is looking**, so its failures are discovered late and in aggregate.
- **It accrues.** Ten automations is ten things to re-verify the next time the model, the host or the API
  underneath them moves. The shelf's own anti-rot rule applies to them too.
- **It is the cheapest possible way to do the wrong thing efficiently.** Automating a step you have never
  done by hand automates your guess about it. Do it manually until it is boring; boring is the signal.

## Altitude / JIT

Silent on a Quickstart — a founder with no product has nothing worth running unattended. Surfaces the first
time someone says *"can this run on a schedule / without me / overnight?"*, and then **one rung at a time**,
never as the whole ladder. `mentor-architect` carries it into the AI-MVP decision set; `/ai-first-init` step
1 is where the deterministic-core half already lands.

## One line for the conscience

*"Automating something you haven't yet done by hand buys you a faster way to be wrong. Deterministic core,
model only where the path genuinely branches — and rent the runner, because the schedule is not the part
worth owning."*
