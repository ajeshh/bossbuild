---
id: ai-cost-budget
type: budget
owner: product-lead
status: declared
updated: 2026-09-15
---

# AI cost budget — Kettlewick

## Cohort + posture
- Cohort: non-tech-founder
- Posture: strict cap, in plain money. The cohort's starting frame ($10 a user a day, $200 a month)
  was written for products where the model is the product. Here it drafts one sentence per carer, so
  Marta set the numbers against what an agency pays. An agency is the "user": it pays, and the ledger
  counts by agency (`ag_01`…), never by person.

**In one line:** each draft costs about a tenth of a US cent. An agency asks for cover three or four
times a week, so the model costs it under a penny a month, against £32 a month for a typical
eight-carer agency.

## Budgets
- **Per agency, per day:** $0.05 (alert at 80%, $0.04). That's about 70 drafts. An honest Monday is
  three or four, so the alert means a loop, not a busy day.
- **Per agency, per month:** $0.50 (about 38p, a little over 1% of an eight-carer agency's £32).
- **Monthly cap (all agencies):** $10 (hard ceiling: drafting pauses and every ask uses the template
  until the month turns. Owners see "The usual wording this time.", and nothing else changes).
- **Per call:** 1,200 tokens in, 200 out. A real prompt is about 450 in and 85 out.

Prices are the provider's, in US dollars; revenue is in pounds. Conversions here use about $1.33 to
the pound (2026-09-15).

## Model choices (one row per call site)

One call site. The deploy sets the model in `ASK_MODEL`; the logger prices it from the table in
`src/lib/ai-cost-logger.ts`, last checked 2026-09-15 by Ola against the provider's pricing page
($0.80 per million tokens in, $4.00 out). This page is public, so it names the shape. The table
and the ledger use the key `small-fast`.

| Call site / FEAT | Model | Why this model | Cheaper-model A/B status |
|---|---|---|---|
| FEAT-007 / `src/ask/draft.ts`, one call per ask | `small-fast`: the provider's small, fast hosted tier | speed requires it: the owner is holding the draft sheet open, and the timeout is 4 seconds. A short sentence from four fields needs nothing bigger. | it is already the cheapest tier the provider offers. Not A/B'd against a larger one: the evals pass on this one, and a larger tier would be slower at the one moment speed matters. |

## The logger
`src/lib/ai-cost-logger.ts` wraps the one call in `src/ask/draft.ts` and appends a line to
`.boss/cost-log.jsonl`: `ts`, `feat`, `model`, `userId` (the agency id), `input_tokens`,
`output_tokens`, `estimated_usd`, `priced`. Token counts and ids only, never the prompt or the
draft. The draft is a carer's first name and the area, and the ledger has no reason to hold it.
Nothing in `src/` imports the provider SDK except through the wrapper.

## Cost levers (revisit when budget breached)
- [ ] **Prompt caching.** Not available: the fixed part of the prompt is about 380 tokens, under the
      provider's minimum for a cache. Revisit if the prompt ever passes 1,000.
- [ ] Response caching. No: no two asks have the same day, time, area and carers.
- [ ] Batch API. No: the owner is waiting.
- [x] Downgrade the model. Already the smallest tier.
- [x] Truncate context. The prompt is four fields by design (DEC-005).
- [x] Structured outputs. One small schema: `{ asks: [{ carer, text }] }`.

## Review cadence
- **Weekly during MVP.** Read `.boss/cost-log.jsonl`, total by agency, sanity-check. First review
  due 2026-09-24, after a week of live asks.
- The bill that matters is the texts (about 40p a carer a month, the canvas's Cost Structure). This
  budget exists to catch a runaway, not to save pennies on the average.

## Breach grammar
- When an agency's day passes $0.04, the `cost` moment says so once.
- Override (when legitimate), recorded in `docs/devlog.md`:
  - **OVERRIDE:** `cost-budget-loop` overrun on <date> — rationale: <why; when it's back in budget>.
