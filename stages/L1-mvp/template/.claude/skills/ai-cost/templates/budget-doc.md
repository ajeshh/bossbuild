# `/ai-cost` — the budget doc skeleton (bundled resource)

> Loaded **on demand** from step 6 of `SKILL.md`. Write this to `docs/ai-cost-budget.md`.
> Frontmatter included so it's discoverable like every other BOSS doc.

```markdown
---
id: ai-cost-budget
type: budget
owner: product-lead
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

One row per place the app calls a model. Name the model by the **id you actually call** — this is
the one doc where the name belongs, because it's the record of a decision you made on a date.

| Call site / FEAT | Model | Why this model | Cheaper-model A/B status |
|---|---|---|---|
| <FEAT-001 / classify-intent> | <the id you call> | <quality requires it: the classifier fails below this> | <tested YYYY-MM-DD: cheaper 92%, current 96% — kept current> |

> **The "why" column is the load-bearing one.** *"It's what the example used"* is not a reason, and
> it's the most common one. If you can't state what breaks on a cheaper model, you haven't tested it —
> which is itself the answer for the A/B column.

## Cost levers (revisit when budget breached)
- [ ] **Prompt caching** for stable system prompts — usually the highest-ROI, lowest-effort lever;
      reach for it *before* downgrading models
- [ ] Response caching (identical prompts within <N> minutes)
- [ ] Batch API (anything not realtime)
- [ ] Downgrade the model for non-load-bearing calls
- [ ] Truncate context (do you really need the whole document?)
- [ ] Structured outputs — smaller schemas mean smaller responses

## Review cadence
- **Weekly during MVP** — read `.boss/cost-log.jsonl`, total by FEAT + by user, sanity-check.
- **Monthly during V1** — daily totals, cohort cost-per-user, cost as % of revenue.

## Breach grammar (per IDEA-008)
- When per-user/day exceeds budget by <Y%>, the hook surfaces the `cost` moment.
- Override (when legitimate) — record in `docs/devlog.md`:
  - **OVERRIDE:** `cost-budget-loop` overrun on <date> — rationale: <one power user running a long
    workflow; not representative; expected back in budget by week-end>.
```
