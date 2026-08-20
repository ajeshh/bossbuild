# `/ai-first-init` — the AI-first declaration skeleton (bundled resource)

> Loaded **on demand** from step 1 of `SKILL.md`. Write this to `docs/ai-first.md`.

```markdown
---
id: ai-first
type: declaration
owner: product-lead
status: declared
updated: {{DATE}}
---

# AI-first declaration — {{PROJECT_NAME}}

## What's AI-mediated
- <feature 1> — uses <model> for <purpose>; the output drives <user-visible behavior>.
- <feature 2> — ...

## What's deterministic (and stays deterministic)
- <feature> — no LLM. Reason: <correctness requires it / cost-prohibitive at scale / etc.>

## Load-bearing model decisions
- **Primary model:** <the `volume`-shape model your host already resolves to — name the id you actually call>
- **Why this one:** <quality / speed / cost rationale>
- **Pinned version:** <yes/no — pin during MVP; unpin when evals cover regressions>
- **Fallback model (when primary fails):** <a `cheap-bulk`-shape model, or deterministic only>

## Cost shape (order-of-magnitude)
- Per user-action: ~<N> input tokens, ~<M> output tokens
- Per user-day: ~<N> actions → ~$<X>/user/day (matches docs/ai-cost-budget.md)

## The five failure states (cross-references docs/ai-failure-states.md)
- Designed: <yes/no — set to yes when /ai-failure-states has run>

## Eval discipline (cross-references docs/evals/)
- Eval set exists: <yes/no — set to yes when /evals has seeded the first set>
- Categorization: <yes/no — Husain failure-mode categorization in place>

## Structured outputs (Liu)
- Schemas declared: <yes/no — set to yes when docs/schemas/ has stubs>
- Schema enforcement: <none / runtime validation / both>
```
