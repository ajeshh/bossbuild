---
name: ai-cost
description: Establish AI spend discipline for {{PROJECT_NAME}} — declare per-user / per-feature / monthly budgets, name the model choices, wire a per-call cost logger, set a review cadence. Cohort-aware (first-product gets a tight cap; vibe-virtuoso gets inspect-only; domain-expert gets privacy-first logging). Run at the first inflection where the app actually calls an LLM. Usage - /ai-cost
---

# /ai-cost — name the bill before it surprises you

The cost of an AI-mediated app is the single most-load-bearing operating decision you make once
your code reaches the model. Token math is small per call and large per cohort. *"Just call the
biggest model and see"* is a perfectly fine demo posture and a perfectly destructive production one.

This skill is the gate between *"the app calls an LLM"* and *"the app is in front of users."* It
makes you declare the budget BEFORE the bill, wire a logger so you can SEE the bill, and pair
the cost shape with the right mentor (architecture for shape; business for unit economics).

## Step 0 — does it already exist, and is this the right rung?

**Look for an AI spend budget before you make one** — `docs/ai-cost-budget.md`, `.boss/cost-log.jsonl`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: MVP.** Applies only when the project makes its first LLM call. If this project is **earlier** than that, don't run this — leave the seam instead:
**One line per call: model, tokens in/out, timestamp. Append to a file. Nothing reads it yet.** That is the whole ask; it is *not* a budget, a review cadence, alerts, a dashboard, a per-user attribution scheme. Same shape as the analytics history seam — you cannot backfill what past calls cost, so the day you finally care about margin, your ledger starts at day zero and the whole build you already paid for is invisible.

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
- **Which model** it uses — the id you actually call, and which of the three shapes it is
  (`deliberation` / `volume` / `cheap-bulk`; see the model-routing practice).
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

A ~30-line wrapper around the LLM SDK that records each call, so the ledger `/cost-review` reads
actually fills. TypeScript and Python implementations, the wiring rules, and the privacy constraint
for regulated work: **[`templates/cost-logger.md`](templates/cost-logger.md)** — open it now.

The one thing to carry into that file: **the founder fills the price table from the provider's current
pricing page, at wire-time.** Not from the template, not from your memory — both are stale by
construction, and a cost log that quietly under-reports is worse than none.

### 6. Write `docs/ai-cost-budget.md`

The contract doc — budgets, one row per call site, the cost levers, the review cadence and the breach
grammar. Skeleton: **[`templates/budget-doc.md`](templates/budget-doc.md)**.

Push on the *"why this model"* column when you fill it. *"It's what the example used"* is the most
common answer and it isn't one — if the founder can't say what breaks on a cheaper model, that's the
A/B they haven't run.

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
