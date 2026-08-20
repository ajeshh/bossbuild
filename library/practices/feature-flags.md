---
id: PRACTICE-feature-flags
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (feature-flags + finishing thread) — GrowthBook ("flag the model, not just the feature"; A/B-testing non-deterministic LLMs), ConfigCat (flags as a vibe-coding safety net), Unleash/LaunchDarkly (trunk-based flags + flag-debt hygiene), Shape Up (circuit-breaker/appetite), Osmani (the 70%→80% problem). Pairs with git-workflow.md, ship-it-live.md, and the `focus` conscience moment / `/sunset` (IDEA-044). BOSS v0.111.0.
provenance_public: Distilled from GrowthBook ("flag the model, not just the feature"; A/B-testing non-deterministic LLMs), ConfigCat (flags as a vibe-coding safety net), Unleash and LaunchDarkly (trunk-based flags plus flag-debt hygiene), Shape Up (the circuit-breaker and appetite), and Addy Osmani on the 70%-to-80% problem.
last_reviewed: 2026-07-23
review_by: 2027-07-23
curve: craft
---

# Practice — Feature flags (decouple deploy from release — and flag the *model*, not just the feature)

> **Where this sits.** [`git-workflow`](git-workflow.md) says merge to trunk daily; a flag is *how* you merge
> unfinished work safely. [`ship-it-live`](ship-it-live.md) says a URL is the proof; a flag is the fast
> rollback the app layer gives you when that URL misbehaves. And the finishing discipline below is the twin
> BOSS already half-owns via the `focus` moment + `/sunset`. This practice connects the three.

## The one idea: deploy ≠ release

Code ships to production **disabled**; you decide separately when, and for whom, it turns on. Everything else
is a variation: **dark launch** (present but off), **kill switch** (one toggle disables a misbehaving feature —
no redeploy, no war room), **percentage rollout / canary** (`1% → 5% → 25% → 100%`, consistent user bucketing
so the same user always sees the same variant). This is the mechanism that lets trunk-based development merge a
half-built feature safely — the unfinished path serves `false` instead of rotting on a long-lived branch.

## Flag the model, not just the feature (the AI-specific part)

With an AI feature the risky change is often **not code** — it's a model ID, a system prompt, a temperature. A
prompt swap doesn't touch your repo, so your CI/CD has *no record of it and nothing to roll back* when it
degrades. So **put the model/prompt/params in the flag** as a single bundled payload (model + provider +
temperature + system prompt together — don't split them across flags or you get interaction effects you can't
reason about). The flag becomes the control plane that makes a model config as safe to change as any code. Why
it matters *more* for AI than for ordinary features:

- **The kill switch is more urgent.** AI fails **non-deterministically and in production** — a hallucination
  hits your whole user base at once, and testing can't replicate production's input diversity. The only
  rollback that operates at the speed the problem demands is a flag flip (seconds), not a redeploy (minutes).
- **Percentage rollout *is* the test.** You can't unit-test your way to confidence on an LLM output, so staged
  exposure with guardrail metrics is the test: watch latency / cost / a quality signal at 5%, auto-revert
  before the majority is touched. (Honest limit: automated guardrails catch latency and cost spikes; they
  **won't** catch "the summary is factually right but misses the point" — that still needs `/evals` +
  `/red-team --humane`.)
- **Flags are the A/B mechanism for prompts/models.** Deterministic user-ID hashing gives each user a stable
  variant, so you can compare prompt/model variants against the same user base and let the data pick — rollback
  is a toggle. (The AI-specific A/B cautions — nondeterminism means you test a *distribution*, randomize on
  users not requests, bigger variance-aware samples — live in the post-ship `analytics-for-ai-products` work.)
- **Rollout is cost discovery.** "$0.02/call at 1% tells you what 100% costs before you get there." Pairs with
  `/ai-cost`.

## Flag debt is just unfinished work wearing a toggle

A flag you never clean up is *another half-done thing* — and AI velocity creates it faster. So: **set the
retirement condition when you create the flag**, give it an owner, mark it stale once it passes its expected
life, and cap how many are live. A permanent flag is either a config setting (promote it) or a decision you
never made (make it). This is the same discipline as the finishing section below — a flag stuck at 5% forever
is WIP, not a rollout.

## The JIT ladder (a 0-user founder needs no flag *platform*)

1. **An env var / a `const FLAGS = {…}` boolean** — the correct start. A kill switch can be one
   `if (process.env.AI_SUMMARY_ON)`. Zero ceremony.
2. **PostHog / Statsig free tier** — when you want the flag *and* the analytics to measure the rollout in one
   tool (both have generous free tiers; open-source options exist).
3. **A dedicated platform (LaunchDarkly etc.)** — only when you genuinely need remote toggling a non-technical
   person can flip, or user-level bucketing for real experiments. Not before.

**JIT trigger:** a flag earns its place at the first feature you'd want to (a) ship *dark* / merge unfinished,
(b) roll back *instantly*, or (c) roll out *gradually* — and for a vibe-coding founder that's almost always the
first user-facing AI feature. Before that, a flag is ceremony (Principle #2).

## Flags and finishing are the same discipline seen twice

Flags **help you finish**: slice a big unfinished feature into a *thin done slice you ship now* (flag the rest
off) instead of holding a three-week 70%-done branch. That's the antidote to the AI-era sprawl — AI made
*starting* free, so WIP explodes (the vibe-coding graveyard: ~half of 2025's AI apps dead by 2026). But flags
also **let you avoid finishing**: 40 flags at 5%, none at 100%, none cleaned up — motion, not shipping. So:

- **Ship the slice, then decide: roll it to 100% or `/sunset` it.** A flag is a *temporary* state, not a
  parking lot. This is where the `focus` conscience moment's forcing function points (the finish-or-sunset
  circuit breaker — Shape Up's appetite + circuit-breaker: no default extension; ship what you have or kill it).
- **"Done" is not "the happy path runs."** AI self-defines done as the happy path; a founder's done is
  `/smoke` (alive) + `/evals` (correct) + `/red-team` (secure) + reachable + a real user. The conscience is the
  thing that knows the difference.

## Humane note

BOSS helps a founder **finish, ship, and kill honestly** — not hoard WIP and not *gamify flag-toggling*. Design
against the dashboard of 40 flags at 5% that *feels* like progress (the `focus` moment's original sin). Flag
hygiene + the finish-or-sunset breaker are the guardrails that keep a toggle from becoming a vibe-virtuoso
trophy shelf. Unfinished = unshipped = no evidence — so both features always point back at *a real user hitting
the finished slice*, never at the toggle count.

## Altitude / JIT

Silent on a Quickstart. Surfaces at the first risky/AI-mediated feature a founder wants to ship carefully, and
inside `/ship` (the ship-dark / kill-switch offer). Never a wall; env-var-first, always.
