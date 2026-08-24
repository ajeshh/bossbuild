---
id: ai-failure-state-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Husain (failure-mode categorization), Liu (structured outputs make detection possible), Karpathy (the failure surface IS the design surface)]
also_relevant: [Mollick, Rauch, Willison]
entry:
  - count_at_least:
      path_glob: $source
      pattern: '(anthropic|@anthropic-ai/sdk|openai|OpenAI\(|Anthropic\(|messages\.create|chat\.completions\.create|generateText|streamText)'
      min: 1
exit:
  - exists: { path: docs/ai-failure-states.md }
  - count_at_least:
      path_glob: $source
      pattern: '(handleGarbageResponse|handleRefusal|handleHallucination|handleTimeout|handleCostSpike|ai-handlers|aiHandlers|on_refusal|on_hallucination|on_timeout)'
      min: 1
drift_moment: failure-mode
---

# Loop: ai-failure-state (MVP)

The discipline that **names the failure before the user finds it.** When code contains an LLM
SDK call but no `docs/ai-failure-states.md`, the founder is shipping a happy-path UI that will
meet the five guaranteed failure modes (garbage / refusal / hallucination / timeout / cost
spike) without a declared response. This loop opens at the first LLM call and closes when
both the design doc exists AND the code references at least one failure-handler.

`runner_type: hook` — the conscience evaluates this loop on every UserPromptSubmit. Entry
predicate requires ≥1 LLM SDK call site (same pattern as `cost-budget-loop` — they share the
inflection point: *the first time code touches the model*).

When open, the conscience surfaces the `failure-mode` moment: *"The code calls an LLM but no
failure-states doc exists. What does the UI do when the model returns garbage / refuses /
hallucinates / times out / costs too much? Run `/ai-failure-states` to declare it."*

## Entry artifact

`src/` contains ≥1 LLM SDK call site (same regex as `cost-budget-loop`). The five failure
modes exist the moment the first call exists; the loop opens at parity with the cost loop.

## Purpose

Force the failure-states design into the open before the user encounters them. The skill
(`/ai-failure-states`) walks the founder through:
- The five failure states + a project-specific concrete example for each
- The declared response for each (in code-level detail; not "handle gracefully")
- Stub fallback handlers in code (so the discipline is wired even if implementation is
  incremental)
- Cohort-aware delivery (first-product gets named patterns; eng-builder gets lint-anchored
  unhandled-path discipline; domain-expert gets the human-in-the-loop discipline for
  high-stakes domains)

## Exit artifact

`docs/ai-failure-states.md` exists AND `src/` contains ≥1 reference to a failure-handler
function name (the regex covers the canonical TypeScript names and snake_case Python
equivalents). The dual requirement matters: a design doc without code references is
declaration without contract; handlers without a doc is code without rationale.

## Drift

Entry satisfied (≥1 LLM SDK call) AND exit not satisfied (no design doc OR no handler refs)
→ loop is open → conscience emits `failure-mode` moment.

Confidence: low on first detection (one call site might be exploratory); medium with a
handful of calls; high when LLM calls touch user-visible code paths (heuristic: presence of
the regex AND presence of `export`, `route`, `app.`, `Router`, `handler` near the call sites).

The voice (cohort-aware via v0.20's framing): name the gap in one line, point at
`/ai-failure-states`, hand the decision back. Never blocks. Override recorded in devlog per
IDEA-008.

## How to remix

- **Skip:** legitimate when the LLM use is genuinely throwaway (dev-only script, no
  user-facing path). Override:
  ```
  - **OVERRIDE:** skipped `ai-failure-state-loop` — rationale: <e.g., LLM call is in a
    dev-only script; no user-facing path; not deployed>.
  ```
- **Swap discipline:** the five failure states are the floor, not the ceiling. Some projects
  need rate-limit handling, model-deprecation discipline, regulatory-failure-mode design
  (for `domain-expert` cohort projects). Add them in the doc; the loop's exit predicate just
  needs *one* handler reference, so additional handlers are additive, not gated.
- **Author your own:** a domain-specific failure discipline (e.g., a
  `multimodal-fallback-loop` for projects where image/audio generation has its own failure
  shape; or a `tool-use-failure-loop` for agentic workflows where the model picks the wrong
  tool).

## When this loop re-opens

- Failure-states doc deleted → exit predicate fails again.
- All handler references removed (refactor that strips them out) → ditto.
- New LLM provider added that introduces a new failure surface (e.g., a multimodal API with
  image-safety refusal patterns the existing doc didn't cover) → the founder should re-run
  the skill to extend the doc; loop doesn't auto-detect this, but the founder should know.
- Real-production failure surprise → the failure-state doc was incomplete. Add the new mode
  + handler; refresh the declared response.

## Cite

Husain's *"categorize failures by mode — failure modes are more valuable than success
modes"* applied to UX, not just evals. Liu (structured outputs make garbage detection
mechanical, not vibes). Karpathy (the failure surface IS the design surface for AI-mediated
products — designing the happy path is the easy 20%).
