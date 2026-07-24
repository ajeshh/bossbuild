---
name: ai-cost
description: Establish AI spend discipline for {{PROJECT_NAME}} — declare per-user / per-feature / monthly budgets, name the model choices, wire a per-call cost logger, set a review cadence. Cohort-aware (first-product gets a tight cap; vibe-virtuoso gets inspect-only; domain-expert gets privacy-first logging). Run at the first inflection where the app actually calls an LLM. Usage - /ai-cost
---

# /ai-cost — name the bill before it surprises you

The cost of an AI-mediated app is the single most-load-bearing operating decision you make once
your code reaches the model. Token math is small per call and large per cohort. *"Just call GPT-5
and see"* is a perfectly fine demo posture and a perfectly destructive production posture.

This skill is the gate between *"the app calls an LLM"* and *"the app is in front of users."* It
makes you declare the budget BEFORE the bill, wire a logger so you can SEE the bill, and pair
the cost shape with the right mentor (architecture for shape; business for unit economics).

## When to run it

- A FEAT puts an LLM call in the user-facing control flow (not a one-off dev script).
- You're about to ship that FEAT to anyone other than yourself.
- You see the conscience's `cost` moment open — the `cost-budget-loop` detected LLM calls in
  `src/` and no `docs/ai-cost-budget.md`. Run this skill to close the loop.
- After a model swap or prompt rewrite. The bill changes; the budget should be re-checked.
- After a real-bill surprise. The bill IS the design signal — codify the lesson here.

## What this skill produces

1. **`docs/ai-cost-budget.md`** — the declared contract. Budgets, model choices, alert
   thresholds, review cadence. The single file your future-self reads when the bill spikes.
2. **A cost-logger wrapper** — a small function in your stack that wraps every LLM SDK call,
   records `{ feat, model, input_tokens, output_tokens, estimated_usd, ts }` to a local ledger.
3. **`.boss/cost-log.jsonl`** — the running ledger (gitignored; local-only by default; ship to
   a real datastore when you have real users).

## How to run it

### 1. Read the cohort

Read `cohort` from `.boss/config.json`. The cohort decides the default posture. If unset, ask the
one open question from `/boss` step 6, then continue with the answer.

### 2. Survey the LLM surface

Scan `src/` for LLM SDK call sites (`anthropic`, `openai`, `@anthropic-ai/sdk`, `messages.create`,
`chat.completions.create`, `generateText`, `streamText`, `Anthropic(`, `OpenAI(`, etc.). For each
hit, identify:
- **Which FEAT** it serves (link to a `FEAT-NNN`).
- **Which model** it uses (e.g., `claude-sonnet-4-6`, `gpt-5-mini`, `claude-haiku-4-5`).
- **Per-call shape** — prompt size order-of-magnitude (small / medium / large), expected outputs.
- **Call frequency** — once per session? Per user action? Per page render?

Don't audit every call — find the **three most expensive call patterns** by order of magnitude.
Most apps are 80/20: a small number of call patterns dominate cost.

### 3. Pick the budget shape (cohort-aware)

Walk the founder through the budget framework. Cohort defaults below are *starting points*,
not prescriptions — they're calibrated to the cohort's risk and operating style. The founder
picks; the skill records.

| Cohort | Default per-user/day | Monthly cap | Posture |
|---|---|---|---|
| `first-product` | $5 | $100 | Conservative. Hard cap. Auto-fallback to cheaper model on breach. |
| `vibe-coder-newbie` | $5 | $50 | Strict — protect from runaway. Define cap in plain dollars, not tokens. |
| `non-tech-founder` | $10 | $200 | Plain-language framing. Show: *"each user costs about $X/day."* |
| `vibe-virtuoso` | (inspect-only) | (inspect-only) | No gate. Logger on; budget tracked; show the numbers. Override-friendly. |
| `eng-builder` | (BYO) | (BYO) | Logger on; no opinion on caps. Transparent + inspectable; they'll wire alerts themselves. |
| `indie-hacker` | $3 (sustainable margin) | $50 | Frame as **% of revenue per user** (target: <30% of MRR per user). Calm-company math. |
| `returning-founder` | $10 | $300 | Frame as **cost-per-acquired-user** + **cost-per-active-user**. They know unit economics. |
| `domain-expert` | $20 | $500 | Higher per-user is fine in regulated domains. **Privacy-first logging — NO PII, NO prompt body unless redacted.** Cite the regulatory context. |
| _(no cohort declared)_ | $10 | $200 | Generic conservative; revisit when cohort sharpens. |

For each row, the founder edits to fit the actual bet. The numbers are a **starting frame**;
the founder's read of the business is the real signal.

### 4. Pick model choices deliberately

For each call site identified in step 2, name **why** the chosen model. Three valid answers:
- **"Quality requires it"** — name the failure mode that the cheaper model exhibits. (If you
  can't, the cheaper model probably works.)
- **"Speed requires it"** — name the latency budget. (If there's no SLA, latency probably
  doesn't require the bigger model.)
- **"Default we haven't tested"** — *valid only as a TODO.* Schedule the A/B against the
  cheaper model in the same `docs/ai-cost-budget.md`.

The most common cost win is **downgrading non-load-bearing calls** to cheaper models. The
second most common is **caching** (Anthropic prompt caching, response caching). The third is
**batching** (Anthropic batch API; OpenAI batch). Each gets a line in the budget doc.

### 4a. Prompt caching — the highest-ROI cost lever (the mechanics, not just a checkbox)

Of the levers, prompt caching is the cheapest to adopt and the biggest early win — but only if you know the
mechanics:
- **Cache-read is ~0.1× input (≈90% off); cache-write is 1.25× (5-min TTL) or 2× (1-hour).** Break-even is
  ~2 reads — so it pays the moment any stable prefix is hit repeatedly (a chat loop, an agent, a RAG system
  with a fixed system prompt).
- **The design pattern is forced by the mechanism: static content first, dynamic content last.** Order
  tools → system prompt → context/examples (stable) *before* the user's turn (changing), and set the cache
  breakpoint on the last stable block. A stray early timestamp defeats the whole cache.
- **Verify it's actually working** via `usage.cache_read_input_tokens` in the response — it's a silent no-op
  below the ~1k-token minimum. Mostly automatic in the SDK / Claude Code.

JIT: the first feature with a ≥~1k-token stable prefix hit repeatedly. For most AI apps this is the single
highest-ROI / lowest-effort lever on the list — reach for it before downgrading models.

### 5. Wire the logger

A ~30-line wrapper around the LLM SDK that records each call. Stack-agnostic shape:

```typescript
// src/lib/ai-cost-logger.ts
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

const LEDGER = join(process.cwd(), '.boss', 'cost-log.jsonl');

// Model price table — UPDATE WHEN YOU SWAP MODELS. The math is wrong otherwise.
const PRICE_PER_M_TOKENS = {
  'claude-sonnet-4-6':   { input: 3.00, output: 15.00 },
  'claude-haiku-4-5':    { input: 1.00, output:  5.00 },
  'claude-opus-4-7':     { input: 15.00, output: 75.00 },
  'gpt-5-mini':          { input: 0.25, output:  2.00 },
  // add yours
};

export function logCall({ feat, model, inputTokens, outputTokens, userId }) {
  const p = PRICE_PER_M_TOKENS[model] || { input: 0, output: 0 };
  const usd = (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
  const entry = {
    ts: new Date().toISOString(),
    feat, model, userId,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    estimated_usd: Number(usd.toFixed(6)),
  };
  appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
  return entry;
}
```

```python
# src/ai_cost_logger.py
import json, os, datetime

LEDGER = os.path.join(os.getcwd(), ".boss", "cost-log.jsonl")

PRICE_PER_M = {
    "claude-sonnet-4-6":   {"input": 3.00, "output": 15.00},
    "claude-haiku-4-5":    {"input": 1.00, "output":  5.00},
    "claude-opus-4-7":     {"input": 15.00, "output": 75.00},
    "gpt-5-mini":          {"input": 0.25, "output":  2.00},
}

def log_call(feat, model, input_tokens, output_tokens, user_id=None):
    p = PRICE_PER_M.get(model, {"input": 0, "output": 0})
    usd = (input_tokens * p["input"] + output_tokens * p["output"]) / 1_000_000
    entry = {
        "ts": datetime.datetime.utcnow().isoformat() + "Z",
        "feat": feat, "model": model, "user_id": user_id,
        "input_tokens": input_tokens, "output_tokens": output_tokens,
        "estimated_usd": round(usd, 6),
    }
    with open(LEDGER, "a") as f:
        f.write(json.dumps(entry) + "\n")
    return entry
```

Wrap each LLM call. The wrapper is the *only* path to the SDK — make it impossible to bypass:
add a lint rule or a code review note that says *"if you imported `@anthropic-ai/sdk` directly,
this is a bug — go through `lib/ai-cost-logger`."*

**Privacy note (domain-expert and any health/legal/financial project):** the logger above
records token counts and metadata, NOT prompt or response content. Keep it that way. If you
need to log content for debugging, do it in a separate file with explicit consent + retention,
and exclude it from any shared logs.

### 6. Write `docs/ai-cost-budget.md`

The contract doc. Use this skeleton (frontmatter included so it's discoverable like every other
BOSS doc):

```markdown
---
id: ai-cost-budget
type: budget
owner: pm
status: declared
updated: {{DATE}}
---

# AI cost budget — {{PROJECT_NAME}}

## Cohort + posture
- Cohort: <cohort name from .boss/config.json>
- Posture: <strict cap | inspect-only | BYO | % of revenue>

## Budgets
- **Per user, per day:** $X.XX  (alert at 80% — $X.XX)
- **Per user, per month:** $X.XX
- **Monthly cap (all users):** $X.XX  (hard ceiling: pause the feature, don't quietly overrun)

## Model choices (one row per call site)
| Call site / FEAT | Model | Why this model | Cheaper-model A/B status |
|---|---|---|---|
| <FEAT-001 / classify-intent> | <claude-haiku-4-5> | <quality requires it: classifier fails below this> | <tested 2026-MM-DD; haiku 92%, sonnet 96% — kept sonnet> |

## Cost levers (revisit when budget breached)
- [ ] Prompt caching (Anthropic prompt caching for stable system prompts)
- [ ] Response caching (identical prompts in <N> minutes)
- [ ] Batch API (non-realtime calls)
- [ ] Downgrade to cheaper model for non-load-bearing calls
- [ ] Truncate context (do you really need the whole document?)
- [ ] Structured outputs (Liu) — smaller schemas = smaller responses

## Review cadence
- Weekly during MVP — read `.boss/cost-log.jsonl`, total by FEAT + by user, sanity-check.
- Monthly during V1 — daily totals; cohort cost-per-user; cost-as-%-of-revenue.

## Breach grammar (per IDEA-008)
- When per-user/day exceeds budget by <Y%>, hook should surface the `cost` moment.
- Override (when legitimate): record in `docs/devlog.md`:
  - **OVERRIDE:** `cost-budget-loop` overrun on <date> — rationale: <e.g., one power user
    running a long workflow; not representative; expected to come back into budget by week-end>.
```

### 7. Set the review cadence

Add a reminder to `docs/RESUME.md` next-tasks: *"Review `.boss/cost-log.jsonl` weekly through
MVP."* This is the discipline part — without the cadence, the ledger fills up unread.

### 8. Pair with mentors (when warranted)

After writing the budget doc, optionally:
- **`mentor-architect`** — when the cost shape implies an architectural decision (batching vs.
  realtime, caching layer, model fallback strategy). Hand off with: *"`mentor-architect`, the
  cost shape says X — what architecture decisions does that imply?"*
- **`mentor-business`** — when unit economics get load-bearing (cost-per-acquired-user, cost
  vs. willingness-to-pay, pricing implications). Hand off with: *"`mentor-business`, our
  cost-per-active-user is X; what should the pricing carry?"*

Don't auto-invoke either. Surface the question; let the founder decide whether to consult.

## Connection to other loops

- **Upstream:** `pretotype-loop` closed — you know the demand exists. Don't optimize cost
  before you've validated the bet; you'll spend on the wrong thing.
- **Downstream:** `cost-budget-loop` — the conscience moment that fires when LLM calls are
  present and the budget doc is missing (or breaches it). This skill closes that loop.
- **Adjacent:** `/evals` — the eval set IS a cost lever (Husain). Cheaper models pass enough
  evals → ship the cheaper model.

## Rules

- **Declare BEFORE the bill.** A budget written after the surprise is a post-mortem, not a budget.
- **Token math is not optional once users are real.** "I'll watch it" is a budget of $0 with
  a guarantee of overrun.
- **Right It before It right (Savoia) — but also Right Costs before Costs Right.** Don't
  optimize the bill on a feature that hasn't earned its existence.
- **The logger is the only path to the SDK.** If founders can call the SDK directly, the
  ledger lies. Lint it; review it; convention it.
- **Privacy-first logging.** Token counts and metadata are fine. Prompt and response bodies
  are NOT fine to ship to shared logs without consent + retention discipline.
- **The cost moment is a nudge, not a gate.** The conscience surfaces drift; the founder
  decides. Override grammar in `docs/devlog.md` per IDEA-008.
- **Per-cohort math is real math.** A first-product cohort and a domain-expert cohort don't
  have the same budget shape; pretending they do produces wrong defaults for both.
