# `/cost-review` — the review file skeleton (bundled resource)

> Loaded **on demand** from step 5 of `SKILL.md`. Write this to `docs/cost-reviews/REVIEW-{{DATE}}.md`.

```markdown
---
id: REVIEW-{{DATE}}
type: cost-review
owner: pm
status: recorded
created: {{DATE}}
budget_version: <date the budget doc was last updated>
window: <last 7 days | since-last-review | custom>
---

# AI cost review — {{PROJECT_NAME}} — {{DATE}}

## Headline
_One sentence the founder reads in the inbox / Slack scroll. If only this line is read, the
review should still land. Examples: "On-budget; one outlier user worth investigating."
"Over by 18%; classifier FEAT is the culprit; consider Haiku A/B." "Under; safe to ship the
deferred AI feature."_

## Numbers
- **Window:** <date range>
- **Total spend:** $X.XX  (<N> calls, <M> distinct users, <K> distinct FEATs)
- **Per-user/day:** observed $X.XX (median) / $Y.YY (p95)  vs. declared budget $Z.ZZ
- **Monthly run-rate:** $X.XX/month projected  vs. declared cap $Y.YY
- **By FEAT** (top 3): FEAT-NNN $X, FEAT-MMM $Y, FEAT-PPP $Z
- **By model** (top 3): <model> $X (<%>), <model> $Y (<%>), <model> $Z (<%>)

## Gross margin (when a price/ARPU is known — the margin-trap check)
_Only when a price is set (skip pre-revenue). This is the section that answers the **margin-trap
conscience moment**: cost against the *price*, not just the budget. In an AI product, cost-per-user
scales with engagement, so your heaviest users can be your least profitable (AI gross margins run
50–65% vs SaaS 70–85%)._
- **Cost-per-active-user:** $X.XX  vs  **price/ARPU:** $Y.YY
- **Gross margin:** ~Z%  (flag if cost is **>10–15% of ARPU** — the margin-trap heuristic; name the
  heaviest users if they're the ones below margin)
- **Evergreen-Ratio (cached ÷ total input tokens):** W%  (prompt-caching leverage — low = a cheap
  margin win is on the table; see `/ai-cost` caching)
- **Struggle check (humane):** what share of spend is retries/regenerations? A big share = you're
  paid more when the product works *less* — design it out, don't monetize it (PRINCIPLE #6).

## Variance against budget
- <line for each declared budget item: under / at / over + delta>

## Surprises
_Concrete findings from §4 above. One bullet per real surprise. Empty section is honest;
"no surprises" is a finding worth recording when it's true._
- <example: "FEAT-007 cost 4x its expected median — single user ran a 14k-token prompt repeatedly; investigate.">
- <example: "Sonnet share grew from 30% → 65% over the window; no budget update recorded — stale rationale.">

## Actions
_What the founder is doing about it. Concrete, dated. The point of the review is to drive
action, not to file numbers._
- [ ] <action 1 — owner — by when>
- [ ] <action 2>

## Next review
- Cadence: weekly / monthly / event-driven
- Next planned: <YYYY-MM-DD>
```
