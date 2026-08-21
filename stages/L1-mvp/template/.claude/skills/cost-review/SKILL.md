---
name: cost-review
description: Read the AI cost ledger and produce a dated review. Reads .boss/cost-log.jsonl (the per-call ledger /ai-cost wires), summarizes spend by FEAT + user + cohort, compares against docs/ai-cost-budget.md, flags overages and surprises, and writes docs/cost-reviews/REVIEW-YYYY-MM-DD.md. Closes the cadence that /ai-cost only declared. Cohort-aware. Usage - /cost-review
---

# /cost-review — read the bill, not just the budget

`/ai-cost` writes the **budget** — what you intend to spend. `/cost-review` reads the
**ledger** — what you actually spent. The discipline only works when both halves run.

The v0.25 audit named this as a gap: *"the weekly review cadence is declared in `/ai-cost` but
no skill reads `.boss/cost-log.jsonl`. The cadence is unenforced."* This skill closes that. It
doesn't replace the founder's judgment — it surfaces the numbers so the judgment has data.

## When to run it

- The conscience surfaced the `cost-stale` moment (cost-review-loop opened — you have a
  budget declared but no review on record).
- Weekly during MVP — pair with `/close` at session end on the first session of each week.
  The ritual is what makes the discipline stick.
- Monthly during V1 — daily totals; cost-per-active-user; cost-as-%-of-revenue if pricing
  exists.
- After a real-bill surprise. The invoice IS the signal; this skill is the post-mortem doc.
- After any change to model selection, prompt structure, caching layer, or rate-limit
  posture. Cost shapes shift; the ledger should be re-read.

## How to run it

### 1. Orient

Read, silently:
- `docs/ai-cost-budget.md` — the declared contract (per-user/day, monthly cap, model rows,
  cohort, levers checked off).
- `.boss/cost-log.jsonl` — the running ledger written by the logger wrapper.
- `docs/cost-reviews/` (if it exists) — prior reviews; the cadence trend lives here.
- `.boss/config.json` — cohort (decides framing) and any conscience pause state.

Don't announce these reads. Just orient.

### 2. Parse the ledger

`.boss/cost-log.jsonl` is one JSON object per line, each shape:

```json
{
  "ts": "2026-05-24T14:32:11Z",
  "feat": "FEAT-007",
  "model": "<the model id the call used>",
  "userId": "u_abc",
  "input_tokens": 1240,
  "output_tokens": 89,
  "estimated_usd": 0.0017
}
```

Aggregate three ways:
- **By FEAT** — which features dominate spend?
- **By user (or `userId == null` for dev calls)** — is there a power-user skewing the
  numbers? Is the dev/test traffic noise level reasonable?
- **By model** — is the model-mix matching the budget's stated rationale, or did a recent
  change shift toward a more expensive model?

Compute totals: last 7 days, last 30 days, since-last-review (if any).

### 3. Compare against the budget

For each declared budget line in `docs/ai-cost-budget.md`, name the actual:
- **Per-user/day budget vs. observed:** declared $X, observed $Y. *Under / at / over.*
  Compute the percentage of users above the alert threshold.
- **Monthly cap vs. observed run-rate:** declared $X cap, observed run-rate $Y/month
  (extrapolate from the last 14 days).
- **Per-model rationale check:** for each call-site row in the budget, look at actual
  usage. If the budget says *"using Sonnet because Haiku fails this classifier,"* but the
  ledger shows 90% Haiku calls, the rationale is stale.

### 4. Flag surprises

The whole point of the review is to find things you'd otherwise miss. Look for:
- **Cost outliers** — calls > 10x the median. Probable causes: prompt injection eating
  context, runaway output, a workflow that's looping when it shouldn't.
- **User outliers** — single users spending > 10x the cohort median. Either a power user
  (interesting; flag for product) or a misbehaving client (interesting; flag for fix).
- **FEAT skew** — one FEAT eating > 80% of spend that wasn't designed to. Often a sign
  the cheaper-model A/B never got run.
- **Quiet drift** — gradual upward trend over weeks with no FEAT explanation. Often a model
  swap or prompt change that wasn't captured in the budget doc.

### 5. Write the review file

Writes `docs/cost-reviews/REVIEW-{{DATE}}.md`. Skeleton: **[`templates/review-file.md`](templates/review-file.md)**.

The section that earns its place is **gross margin** — cost-per-user against the price you charge.
A cost review that reports spend without margin tells you the bill went up; it can't tell you whether
the business works.


### 6. Update the budget doc if the rationale shifted

If §3's per-model rationale check flagged stale rows (the budget says *"using model X because
Y"* but the ledger shows the actual usage diverged), update `docs/ai-cost-budget.md`'s
model-choices table. The rationale should match reality OR explicitly name the gap with a
TODO + a check-by date.

### 7. If overages are real — surface the mentor handoff

When the review shows overages > 10% of monthly cap:
- `mentor-architect` for **shape**: is this a batching/caching/cheaper-fallback issue?
  *"`mentor-architect`, our cost shape is breaking the budget; what architecture decisions
  does that imply?"*
- `mentor-capital` for **economics**: does the cost-per-active-user fit the pricing?
  *"`mentor-capital`, our cost-per-active-user is $X; what should the pricing carry?"*

Don't auto-invoke either. Surface the question; let the founder decide whether to consult.

## Cohort-aware delivery

| Cohort | Posture |
|---|---|
| `first-product` | Plain-dollar framing. "You spent $X this week; budget was $Y." Define alert threshold inline. Lean conservative. |
| `vibe-coder-newbie` | Show the top 3 cost outliers with one-line *"this is probably because..."* explanations. Teach by example. |
| `non-tech-founder` | Plain language. "Each user costs ~$X/day on average; one user cost $Y this week (review their usage)." No token-math jargon. |
| `eng-builder` | Inspectable. Show raw numbers + percentiles; let them choose the interpretation. They'll write their own follow-ups. |
| `vibe-virtuoso` | They want to ship faster. Lead with the *biggest lever* (the one optimization that would unblock budget) — not the full inventory. |
| `indie-hacker` | Cost-as-%-of-revenue (or path-to-revenue) framing. Calm-company math: *"current run-rate is N% of MRR per user; sustainable margin = <X%>; you're at <Y%>."* |
| `returning-founder` | Unit economics framing. Cost-per-acquired-user + cost-per-active-user; LTV/CAC implications. Skip the explanation. |
| `domain-expert` | **Privacy-first framing first.** Confirm the ledger contains no PII / prompt bodies before showing any review data. Then standard surfacing. Cite the regulatory context if relevant. |

## Connection to other loops + skills

- **Upstream:** `cost-budget-loop` closed (budget doc + logger wired). Without that, there's
  nothing to review.
- **Same loop:** `cost-review-loop` — opens when the budget exists but no review has been
  recorded. Closes when this skill writes the first review file.
- **Adjacent:** `/ai-cost` (re-run if the budget shape needs to change based on review
  findings); `/ai-failure-states` (cost-spike handler is in scope here too — if reviews show
  recurring cost-spikes, the handler should fire).

## What this skill is NOT

- **Not a real-time dashboard.** This is a periodic review pattern. For real-time monitoring
  the founder ships the ledger to an actual datastore + observability layer when users are
  real. The skill is the discipline; the tooling scales beyond it.
- **Not a budget-enforcement gate.** It surfaces variance; it doesn't block calls. The
  override grammar (per IDEA-008) applies — if the review shows a legitimate overage (single
  product launch event, expected spike), record the override in the review file itself.
- **Not a substitute for the budget doc.** `/ai-cost` declares; this skill reads. Both halves
  required; running only one is half the discipline.

## Rules

- **Numbers before narrative.** Lead with the top-line spend, then the percentile, then the
  variance. The founder's eye goes to numbers; structure for that.
- **Surprises are the point.** A review with no surprises section is a stamp; a review with
  named surprises is a tool. Empty *"no surprises"* is honest when it's true; never fabricate.
- **Actions are dated.** *"Improve cost"* is not an action. *"A/B Haiku on FEAT-007 by
  2026-06-15"* is.
- **Privacy-first for domain-expert cohort.** No PII, no prompt bodies, no model output text
  in the review. Token counts + metadata only.
- **The review IS the cadence.** A skill that's run once isn't enforcing a cadence — it's a
  one-off. Pair with `/close` weekly; consider `/cost-review` part of session-end ritual.
- **Cite the budget version.** Reviews compare against a specific budget snapshot. When the
  budget changes, name which version this review was against.
