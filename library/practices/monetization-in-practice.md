---
id: PRACTICE-monetization-in-practice
type: practice
owner: mentor-capital
status: active
host: stack-neutral
provenance: post-launch program (2026-07-23 SESSION, JOB 4, Tier 2). The gap the map found — mentor-capital has the pricing *menu*, /money has the *first sale*, but nobody owned *running the money live*: upgrades, dunning, the price-raise, the margin trap. Distilled from Patrick Campbell / ProfitWell (dunning + involuntary churn is 20–40% and the cheapest revenue) + Kyle Poyar (usage-based + expansion when usage tracks value) + the margin-trap thread (a16z/Tunguz — cost scales with engagement). Pairs with mentor-capital (the menu), /money (the first sale), /money (the runner), retention.md (the involuntary-churn bucket), the margin-trap conscience moment + /cost-review's gross-margin band (JOB 4 build #1), /trust (offboarding + data export). BOSS v0.126.0.
last_reviewed: 2026-07-23
review_by: 2027-01-19
curve: market
---

# Practice — Monetization in practice (running the money once customers exist)

> **Where this sits.** `mentor-capital` is the *menu* (what to charge, tiers, metering basis). `/money`
> is the *first sale*. This is the layer nobody owned: **what you do with the money machine once it's running** —
> upgrades, involuntary churn, the price-raise, and the margin underneath it all. `/money` is its runner.

## The JIT boundary

Silent until there are **paying customers**. Pre-revenue this is all premature ceremony — the questions here
(should I raise prices? is my dunning working? is expansion fair?) are meaningless without revenue to operate.
The one piece that fires at the *first* paying user is dunning/card-failure recovery (it's plumbing; wire it
once money starts flowing).

## Move 1 — behavior-triggered upgrades (a moment of value, not a nag)

Surface an upgrade **when the user hits a limit *while succeeding*** — they're getting real value and would
genuinely benefit from more. That's a service, not a sale. The anti-pattern is the ever-present "Upgrade!" nag,
the upsell interstitial on every screen, the feature dangled-then-yanked. **The honest test:** would this prompt
help a user who's clearly winning, or is it designed to interrupt a user who isn't? Trigger on the *value moment*,
show it *once*, make it easy to dismiss.

## Move 2 — dunning / involuntary-churn recovery (the cheapest revenue there is)

**20–40% of subscription churn is involuntary** — failed card charges, expired cards, hard declines — and it's
the single most recoverable bucket (Campbell/ProfitWell). Recovered revenue is the *cheapest* revenue you'll
ever get, because the customer already chose to stay. It's **plumbing, not persuasion**: card-retry logic,
pre-expiry update prompts, smart retry timing, a grace period. **Point at the payment processor** — Stripe Smart
Retries / Billing, Chargebee, Recurly — **BOSS does not build a billing system.** (Same bucket `retain` diagnoses
as "the curve dies at the wallet"; here it's a standing operational discipline, not just a diagnosis.) This is
the most humane retention move there is: the user didn't *choose* to leave, so recovery is fixing an accident.

## Move 3 — the humane price-raise (raise on value, with an escape clause)

Raising prices is legitimate and often overdue — but *how* is the whole thing. The humane script:
- **Raise on new value delivered**, not just because you can. Tie the increase to what's genuinely better.
- **Give existing customers an escape clause** — grandfather them (keep their price), or give real notice (30–60
  days) with a clear **downgrade / opt-out / leave-with-your-data path**. Never a stealth raise, never a
  surprise line-item, never a raise that's easier to miss than to avoid.
- **Communicate it plainly, yourself** — what's changing, why, when, and exactly what they can do about it. A
  price change a customer finds out about from their bank statement is a trust event you don't recover from.

## Move 4 — expansion only when usage tracks success

Expansion revenue (upsells, higher tiers, usage growth) is the healthiest growth *when it's aligned*: the
customer pays more **because they're getting more value** — their usage tracks *their* success, so more spend is
fair. The anti-pattern is expansion extracted from **lock-in or struggle**: revenue that grows because the
customer can't leave, or because your metering charges more when the product works *less* (retries,
regenerations). That's the margin-trap's cousin, and it's the exact line PRINCIPLE #6 draws. **Only expand when
the customer would say the extra spend was worth it.**

## The margin underneath it all

Everything above sits on gross margin, and in an AI product margin is not a given: **cost-per-user scales with
engagement, so your heaviest (most expandable) users can be your least profitable** (a16z/Tunguz — AI gross
margins 50–65% vs SaaS 70–85%). Watch it: the **margin-trap conscience moment** fires when it's slipping, and
**`/cost-review`'s gross-margin band** (cost-per-active-user vs price + the Evergreen-Ratio of cached÷total
tokens) is where you read it. Don't run Move 4 (expansion) blind to Move-0 (margin) — expanding a below-margin
user just loses money faster.

## The humane clause (PRINCIPLE #6 — non-negotiable)

- **Dunning, not dark-patterns.** Recover the accidental churn (Move 2); never manufacture friction to trap the
  deliberate kind.
- **Graceful offboarding.** Cancellation is one click, data exports cleanly, no roach-motel flow, no "are you
  *sure* you want to abandon everything?" guilt gate (the `ai-ux-patterns` catalog — refused). Easy to leave is
  how you earn easy to stay. Ties to `/trust` (data export as respect).
- **Expansion aligned to the customer's success, never their entrapment.** If the extra revenue doesn't track
  extra value for *them*, it's extraction.
- **Honest price changes, always.** Communicated by you, with an escape clause.

## What BOSS refuses here (name it, don't build it)

A billing/subscription/dunning *system* (point at Stripe — plumbing, not a product you build); an MRR/revenue
*dashboard* (the payment provider owns the stream; BOSS records evidence *events*); aggressive upsell-nag
mechanics; dark-pattern cancellation / roach-motel flows; surprise or stealth price hikes; usage-based pricing
that punishes engagement (the margin trap in reverse). Ties: `/money` (runner), `mentor-capital` (menu),
`/money` (first sale), `retention.md` (the involuntary bucket), the margin-trap moment + `/cost-review`
(the margin), `/trust` (offboarding + data export).
