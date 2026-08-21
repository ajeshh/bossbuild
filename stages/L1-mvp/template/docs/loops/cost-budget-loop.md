---
id: cost-budget-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Husain (look-at-your-data, applied to spend), Liu (structured outputs as cost lever), Mollick (cost-as-design-input)]
also_relevant: [Karpathy, Willison, Rauch]
entry:
  - count_at_least:
      path_glob: src/**
      pattern: '(anthropic|@anthropic-ai/sdk|openai|OpenAI\(|Anthropic\(|messages\.create|chat\.completions\.create|generateText|streamText)'
      min: 1
exit:
  - exists: { path: docs/ai-cost-budget.md }
  - count_at_least:
      path_glob: src/**
      pattern: '(logCall|log_call|ai-cost-logger|ai_cost_logger|costLogger)'
      min: 1
drift_moment: cost
---

# Loop: cost-budget (MVP)

The discipline that **names the bill before the bill names you.** When code contains an LLM SDK
call but no `docs/ai-cost-budget.md`, the founder is operating without unit economics for the
single most-load-bearing operating cost of an AI-native app. This loop opens the moment that
gap exists, and closes when the budget is declared AND a cost logger is in the codebase.

`runner_type: hook` — the conscience evaluates this loop on every UserPromptSubmit. The entry
predicate requires at least one LLM SDK call site, so it **doesn't fire on fresh projects** —
it opens only when the founder has actually reached for an LLM in code. This is the *"the app
is now AI-mediated"* inflection (IDEA-012's universal-cohort feature).

When open, the conscience surfaces the `cost` moment: *"You're calling an LLM in code without
a declared budget. Run `/ai-cost` to name what you'll spend per user, which models you chose,
and how you'll see the bill before it surprises you."*

## Entry artifact

`src/` contains ≥1 LLM SDK call site — regex covers the common patterns:
- `anthropic`, `@anthropic-ai/sdk`, `Anthropic(`
- `openai`, `OpenAI(`
- `messages.create`, `chat.completions.create`
- Vercel AI SDK: `generateText`, `streamText`

Threshold of 1 (not 3 like design-tokens-loop) because cost discipline is *deontic at the
first call* — there's no "exploratory" version of token spend. The first call hits a real
billing meter.

Stack misses: founders on stacks the regex doesn't catch (LangChain wrappers, Replicate, Cohere,
Bedrock client libs, etc.) can either edit this loop's entry pattern, or simply run `/ai-cost`
manually (the loop respects override).

## Purpose

Force the cost shape into the open before it accumulates. The skill (`/ai-cost`) walks the
founder through:
- Cohort-aware budget defaults (first-product gets a tight cap; vibe-virtuoso gets inspect-only;
  domain-expert gets privacy-first logging)
- Per-call-site model choice with explicit *why*
- A wrapper logger so every call writes to `.boss/cost-log.jsonl`
- Review cadence + breach grammar
- Optional handoff to `mentor-architect` (cost shape → architecture) or `mentor-capital`
  (cost-per-user → pricing)

## Exit artifact

`docs/ai-cost-budget.md` exists AND `src/` contains ≥1 reference to a cost-logging wrapper
(`logCall`, `log_call`, `ai-cost-logger`, `ai_cost_logger`, `costLogger`). The dual requirement
matters: a budget doc without instrumented code is theater (you wrote intent; you didn't wire
sight). Instrumentation without a budget is observability without a target.

## Drift

Entry satisfied (≥1 LLM SDK call) AND exit not satisfied (no budget file OR no logger refs)
→ loop is open → conscience emits `cost` moment.

Confidence is medium on first detection (one call site might be exploratory) and high once
there are multiple call sites — the math compounds with each user-facing path.

The voice (cohort-aware via v0.20's framing): name the gap in one line, point at `/ai-cost`,
hand the decision back. Never blocks. Override is recorded in devlog per IDEA-008.

## How to remix

- **Skip:** legitimate when the project's LLM use is genuinely throwaway (a one-off dev
  script that won't reach users). Override:
  ```
  - **OVERRIDE:** skipped `cost-budget-loop` — rationale: <e.g., this LLM call is in a
    dev-only script; not in user-facing code; not deployed>.
  ```
- **Swap discipline:** Husain's eval-driven cost reduction vs. caching-first (Anthropic prompt
  caching as default) vs. batch-first (non-realtime workloads) vs. tiered-model (Haiku as
  default, escalate to Sonnet only when needed). The loop's exit predicate checks for *some*
  cost-logger in code, not a specific tool; the budget doc is where the founder records which
  discipline they're applying.
- **Author your own:** a domain-specific cost discipline (e.g., a `gpu-spend-loop` for a
  fine-tuning project where the load-bearing cost is training, not inference; or a
  `vector-store-cost-loop` for a RAG-heavy project where embeddings + storage dominate).

## When this loop re-opens

- Cost-logger wrapper deleted or renamed → exit predicate fails again.
- Budget doc deleted → ditto.
- New LLM SDK added (e.g., founder integrates a second provider) → entry may grow; check the
  budget doc covers it; if not, treat as drift.
- Model swap on a load-bearing call site → the budget doc's model rows are stale; re-run
  `/ai-cost` to refresh.
- Real-bill surprise → the bill IS the design signal. Add the new failure mode to the budget
  doc; refine the levers.

## Cite

Husain's *"almost all AI quality problems are visible in the data, and almost no one looks"*
applied to spend: *almost all AI cost problems are visible in the ledger, and almost no one
keeps one.* Liu (structured outputs as a cost lever — smaller schemas, smaller bills).
Mollick (cost-as-design-input: the bill shapes the product, not the other way around).
