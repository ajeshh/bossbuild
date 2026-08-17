---
name: monetize
description: Run the money once customers exist — the layer after /first-dollar. mentor-business is the pricing MENU, /first-dollar is the FIRST sale; this operates the machine: behavior-triggered upgrades (a moment of value, not a nag), dunning/involuntary-churn recovery (20-40% of churn and the cheapest revenue — plumbing, point at Stripe, don't build billing), the humane price-raise (raise on value, with an escape clause — grandfather or real notice + a path out, never a stealth raise), and expansion ONLY when usage tracks the customer's success (never lock-in or struggle). Watches the margin underneath (cost-per-user vs price — ties to the margin-trap moment + /cost-review). Humane by construction: dunning not dark-patterns, graceful offboarding, expansion aligned to the customer's success. Premature pre-revenue; the honest output with no paying customers is "come back when someone's paying." Usage - /monetize [upgrade | dunning | price-raise | expansion]
---

# /monetize — operating the money machine (after the first dollar)

The runner over `boss craft monetization-in-practice`. `/first-dollar` got you the first sale; this is
what you do with the machine once it's running — and the whole job is doing it *without* becoming the
dark-pattern SaaS the humane lens exists to catch.

## Step 0 — the JIT gate

- **No paying customers yet → stop.** Every move here needs revenue to operate. If there's no first dollar, that's
  `/first-dollar`'s job; if there's no *yes* yet, it's `/interview`'s. Say so.
- **Paying customers exist → proceed**, and route to the move that's actually live (the argument, or ask which of
  the four is the real question).

## The four moves (route to the one that's the question)

### `upgrade` — behavior-triggered, a moment of value not a nag
Design the upgrade prompt to fire **when a user hits a limit *while succeeding*** — real value, real benefit from
more. Not an ever-present "Upgrade!" nag, not an interstitial on every screen. The test: would this help a user
who's clearly winning? Trigger on the value moment, show it once, easy to dismiss.

### `dunning` — recover the involuntary churn (the cheapest revenue)
**20–40% of churn is involuntary** — failed cards, expiries, declines — and it's the most recoverable bucket
(the customer already chose to stay). **Plumbing, not persuasion: point at the payment processor** (Stripe Smart
Retries / Billing, Chargebee, Recurly) — retry logic, pre-expiry update prompts, smart timing, a grace period.
**Do not build a billing system.** (Same bucket `/retain` flags as "the curve dies at the wallet.") Wire this at
the first paying user — it needs no cohort to justify it.

### `price-raise` — raise on value, with an escape clause (the "should I raise prices?" moment)
Legitimate, often overdue — but *how* is everything. **Raise on new value delivered**, not just because you can.
**Give existing customers an escape clause**: grandfather them, or real notice (30–60 days) + a clear
downgrade/opt-out/leave-with-data path. **Communicate it plainly, yourself** — a price change a customer learns
about from their bank statement is an unrecoverable trust event. Offer to record the raise as a `/decide` DEC
(what, why, notice, escape). Never a stealth raise, never a surprise line-item.

### `expansion` — only when usage tracks the customer's success
Expansion is the healthiest growth *when aligned*: they pay more **because they're getting more value**. Refuse
expansion extracted from **lock-in or struggle** (revenue that grows because they can't leave, or metering that
charges more when the product works *less* — retries/regens). The test: would the customer say the extra spend
was worth it? First check the **margin** (below) — expanding a below-margin user loses money faster.

## Step 1 — check the margin underneath (don't operate blind)

In an AI product, **cost-per-user scales with engagement — your heaviest, most-expandable users can be your least
profitable** (AI gross margins 50–65% vs SaaS 70–85%). Before an upgrade/expansion push, read the gross margin:
run **`/cost-review`** (its gross-margin band: cost-per-active-user vs price + the Evergreen-Ratio of cached÷total
tokens), and heed the **margin-trap conscience moment** if it's fired. Expanding below margin just loses money
faster.

## Step 2 — the humane line (PRINCIPLE #6)

- **Dunning, not dark-patterns** — recover the *accidental* churn; never manufacture friction to trap the
  deliberate kind.
- **Graceful offboarding** — one-click cancel, clean data export, no roach-motel, no "are you *sure*?" guilt gate
  (refused; ties to `/trust`). Easy to leave earns easy to stay.
- **Expansion aligned to the customer's success**, never their entrapment.
- **Honest price changes, always** — by you, with an escape clause.

## Output

A short `docs/monetize/MONETIZE-<date>.md`: which move you ran, the concrete change (the upgrade trigger, the
dunning wiring pointed at the processor, the price-raise script + notice, or the expansion decision + margin
check), and the humane guardrail you held. Record price/expansion calls as `/decide` DECs. **Record the event,
never the stream** — no MRR dashboard (the payment provider owns that).

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: usually only `dunning` is live (turn on Stripe retries) and maybe one
  upgrade trigger; defer the rest. Plain language.
- `non-tech-founder`: they get the trust framing instantly; focus on the honest price-raise script + graceful
  offboarding.
- `eng-builder` / `returning-founder`: terse; the margin check before expansion + the "don't build billing, wire
  Stripe" line.
- `indie-hacker`: calm-company — grandfathering and a clean cancel are features, not costs; expansion only where
  it's genuinely fair.
- `domain-expert` / regulated: offboarding data-export is often a compliance obligation, not just courtesy —
  route to `/trust`.

## Rules
- **Say no pre-revenue** — no paying customers, no monetization operations.
- **Dunning is plumbing — point at Stripe; never build a billing system.**
- **Raise on value, with an escape clause** — grandfather or real notice + a path out; never stealth.
- **Expand only when usage tracks the customer's success** — never lock-in or struggle.
- **Check the margin before expanding** (`/cost-review` + the margin-trap moment) — below-margin expansion loses
  money faster.
- **Graceful offboarding, honest price changes** — easy to leave; no dark-pattern cancellation. Record the event,
  not the stream.
