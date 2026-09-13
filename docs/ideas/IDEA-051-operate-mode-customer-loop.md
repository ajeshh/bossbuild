---
id: IDEA-051
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: Everything BOSS ships is build-facing. The moment real customers arrive the centre of gravity flips to the people using the thing — and BOSS goes silent exactly when the founder's job changes most.
program: post-launch
proof: stages/L3-scale/template/.claude/skills/operate
created: 2026-07-02
source: fable-campaign lifecycle pass (Fable 5, 2026-07-02 — "what about the 1000th customer?")
---

# IDEA-051 — Operate mode: the customer loop (1st → 1000th customer)

> **Capture, don't build.** This + [[IDEA-040]] (org rung) + [[IDEA-052]] (extended team) are the real
> content of the stubbed **Scale mode** — captured now so Scale gets authored from design, not improvised.

## The gap

Everything BOSS ships is **build-facing**: `/triage` ingests the *founder's* ideas, the board tracks the
*founder's* bets, evidence comes from interviews the *founder* ran. The moment real customers arrive, the
center of gravity flips — the most important signal source becomes **people using the thing**, and the
discipline shifts from *build* to *operate*: support, reliability, incidents, churn. BOSS goes silent
exactly when the founder's job changes most. Between customer 1 and customer 1000, three new loops exist
that BOSS has no opinion on:

1. **The feedback loop flips.** User feedback ≠ founder ideas — it's higher-grade evidence
   (observed-behavior/commitment by definition, [[IDEA-045]]'s ladder) but noisier. `/triage` needs a
   customer-feedback register: separate the bug (fix), the friction (observe more), the feature request
   (a *stated-pain* EVID, not a to-do — the trap is treating requests as specs), and the churn signal
   (the loudest evidence there is). Evidence source shifts **interviews → live behavior**; the canvas's
   riskiest assumption should start citing usage, not conversations.
2. **Things break at 3am.** No incident discipline: what's the honest status page, what's the fix-first
   rule, what does an incident post-mortem look like (the [[IDEA-044]] `/sunset` post-mortem shape, scoped
   to one outage — blameless, one page, feeds `/boss-learn`). Ties to `ship-it-live`'s rollback-≠-reversible
   line and `scalable-architecture`'s migration discipline — the practices exist; the *moment* doesn't.
3. **Retention is the only scoreboard that matters, and BOSS can't see it.** Not analytics (never a
   dashboard — the payment/analytics provider owns numbers); a *question discipline*: the conscience's
   deliver-register ([[IDEA-050]]) matures into "who churned this month, and did you find out why?" —
   churn interviews are `/interview` ([[IDEA-046]]) pointed at leavers, the highest-yield conversation a
   founder can have and the one they most avoid.

Plus the **unit-economics moment** at real volume: AI cost per customer (the `/ai-cost` skill grown up),
margin honesty, the price revisit — `mentor-business` advisory exists; the JIT *moment* (fires at real
volume, not before) doesn't.

## Shape (when earned)

Not a new surface — **registers added to existing verbs**: `/triage --feedback`, an `/incident` skill
(post-mortem + status honesty), `/interview` pointed at churn, the conscience's deliver-register questions,
one `operate` practice UP. Refuse: dashboards, CRM, support-ticket systems, SLO tooling — build the
discipline, refuse the app (the IDEA-034/037 rule).

## Trigger

A registered project (any founder) with **real recurring users** — observed, not claimed: support requests
arriving, or a second month of paying customers. Promote via `/spec` then; author Scale mode's operate rung
from what that project actually hit. **No handoff prompt** — premature building is the failure mode.
