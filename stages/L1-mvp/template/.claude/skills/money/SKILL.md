---
name: money
description: The money verb, from the first dollar to operating it. Reads where you actually are and routes - no yes yet → /interview to GET one; a real yes but no way to pay → take the first dollar (entity, ToS+privacy, payment rail, refund posture, the first price) and record the commitment-grade EVID; paying customers already → operate it (behavior-triggered upgrades, dunning for involuntary churn, the humane price raise, aligned expansion) while watching the margin underneath. Bright line - pointers to professionals, never legal or tax advice; records the EVENT, never the stream (no MRR dashboard — that's your payment provider's job). Usage - /money [upgrade | dunning | price-raise | expansion]
---

# /money — take the first dollar, then run it honestly

One verb for the whole money arc. It was two (`/first-dollar` and `/monetize`) until v0.157.0, and
each one's honest answer, when it didn't apply, was *"go run the other one"* — which meant the founder
had to know which stage they were in before picking the skill that would have told them.

**The bright line, throughout:** pointers to a real lawyer / accountant, **never legal or tax
advice.** And BOSS records the **event** (a durable EVID), never the **stream** — no MRR dashboard.
Your payment provider already does that better, and a revenue meter is a thing you'd tend instead of
a product you'd ship.

## Step 0 — read where you actually are

Look before asking: is there a payment link in the repo, a Stripe key in the env, a `docs/first-dollar/`
record, an EVID graded `commitment`?

- **No real willingness-to-pay signal — nobody has said yes.** → **Stop. Don't build a payment rail
  for a customer who doesn't exist.** But don't close empty-handed — **the seam is one sentence: in a
  conversation you are already having, say a number out loud and watch the face.** Not an entity, not a
  pricing page, not ToS — a number, said aloud. You will talk to a finite number of early users and each
  one is a single-use willingness-to-pay probe; every conversation you finish without naming a price is a
  data point you cannot re-collect, because going back later changes the question — by then they know you.
  The move is `/interview` or `/pretotype` to *get* the yes. Say
  so plainly.
- **Someone has said yes, but there's no way to pay you.** → **Part A.** This is the sharpest
  just-in-time moment in the lifecycle.
- **Paying customers already exist.** → **Part B.** (Part A's records are worth a glance first — if
  the price or refund posture was never decided, decide it now.)

---

# Part A — the first dollar

The highest-grade evidence event BOSS will ever see: the interviews were `stated-pain`; **this is
someone giving up money.**

## A1 — walk the five moves (detect what exists, skip it, defer what's deferrable)

For each, *look* first (is there already a payment link? a ToS page? an entity?) and skip what's done.
For what's missing, give the move **and its honest "defer if…" line** — most of these can wait, and
saying so is the point.

1. **Entity** — needed to lawfully invoice a business in most places. *Defer if* a first informal
   sole-prop sale is legal where you are (pointer to counsel or a registered-agent service — **not
   advice**). Don't run the first dollar through a personal-name account you'll have to untangle.
2. **ToS + privacy policy** — the minimum surface once you take money *and* data. *Defer if*
   pre-revenue with no PII. Collecting personal data? Hand to **`/trust`** (data-minimisation policy
   + subprocessor list); a real lawyer before real scale.
3. **Payment rail** — **cheapest reversible thing first: a payment link** (Stripe / Lemon Squeezy /
   Paddle) before any billing system. *Defer if* you can invoice the first few by hand — and do,
   because it teaches you the terms. **Don't build subscriptions or dunning before ~3 customers.**
4. **Refund posture** — decide it **now**, calm, before the first request arrives. A clear, slightly
   generous default (no-questions within N days) beats an ad-hoc panic and buys trust cheaply.
5. **The first price** — **one number, said out loud.** `mentor-business` owns the *menu* (tiers,
   metering, on-ramp); this forces the *first number*, so fear doesn't defer it forever. Name it. You
   can change it.

## A2 — record the two load-bearing calls

Price and refund posture are exactly the decisions future-you will have forgotten the reasoning for.
Offer to record each as a **`/decide` DEC** (what, why, how reversible). Cheap, and it stops the
"wait — what did we decide to charge?" drift.

## A3 — capture the commitment-grade EVID (the whole point)

The last act: **write the `commitment`-grade EVID** (`/evidence`) — who paid, for what, and what it
proves about the riskiest assumption. **First revenue is the data point the canvas has been waiting
for; don't let it evaporate into memory.** After it exists, the conscience shifts register from
*validate* → *deliver*: someone is paying — is it working for them?

---

# Part B — operating it

Route to the move that's actually the live question (ask which, or read the argument).

### `upgrade` — a moment of value, not a nag
Fire the prompt **when a user hits a limit *while succeeding*** — real value landed, real benefit from
more. Not an ever-present "Upgrade!", not an interstitial on every screen. The test: *would this help
a user who's clearly winning?* Trigger on the value moment, show it once, easy to dismiss.

### `dunning` — recover involuntary churn (the cheapest revenue there is)
**20–40% of churn is involuntary** — failed cards, expiries, declines — and it's the most recoverable
bucket, because the customer already chose to stay. **Plumbing, not persuasion: point at the payment
processor** (Stripe Smart Retries / Billing, Chargebee, Recurly) for retry logic, pre-expiry prompts,
smart timing, a grace period. **Do not build a billing system.** Same bucket `/health` names as *"the
curve dies at the wallet."* Wire it at the first paying user — it needs no cohort to justify it.

### `price-raise` — raise on value, with an escape clause
Legitimate and often overdue — but *how* is everything. **Raise on new value delivered**, not just
because you can. **Give existing customers an escape clause:** grandfather them, or real notice
(30–60 days) plus a clear downgrade / opt-out / leave-with-your-data path. **Communicate it plainly,
yourself** — a price change a customer learns about from their bank statement is an unrecoverable
trust event. Offer to record it as a `/decide` DEC (what, why, notice, escape). **Never a stealth
raise.**

### `expansion` — only when usage tracks the customer's success
The healthiest growth *when aligned*: they pay more **because they're getting more value.** Refuse
expansion extracted from **lock-in or struggle** — revenue that grows because they can't leave, or
metering that charges more when the product works *less* (retries, regenerations). The test: *would
the customer say the extra spend was worth it?*

## B1 — check the margin underneath before you push anything

In an AI product, **cost-per-user scales with engagement — your heaviest, most expandable users can be
your least profitable** (AI gross margins ~50–65% vs SaaS 70–85%). Before an upgrade or expansion
push, read the gross margin: run **`/cost-review`** (cost-per-active-user vs price, plus the
Evergreen-Ratio of cached ÷ total tokens), and heed the **margin-trap** conscience moment if it has
fired. **Expanding below margin just loses money faster.**

---

## The humane line (PRINCIPLE #6)

- **Charge honestly from the first dollar** — no hidden fees, no fake "was $X now $Y", no dark-pattern
  checkout. The precedent you set here compounds.
- **The refund posture is respect, not a leak.** Generous-and-clear is cheaper than what stingy costs
  in trust.
- **A price said plainly is honest; free-forever-because-asking-is-scary is avoidance** — and it denies
  you the one piece of evidence that matters most.
- **Dunning, not dark patterns** — recover the *accidental* churn; never manufacture friction to trap
  the deliberate kind.
- **Graceful offboarding** — one-click cancel, clean data export, no roach motel, no "are you *sure*?"
  guilt gate (refused by name; ties to `/trust`). Easy to leave earns easy to stay.
- **Honest price changes, always** — by you, with an escape clause.

## Output

One short `docs/money/MONEY-<date>.md`. **Part A:** which of the five moves are done or deferred (and
the defer reason), the first price, the refund posture, and a pointer to the `commitment` EVID — plus
the DECs. **Part B:** which move was run, what changed, the margin read, and any DEC (a price raise
always gets one). **Record the event, never the stream.**

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: plain language, one move at a time. The first price is the
  scary one — name that it's scary, then help them say a number. Defer everything deferrable.
- `non-tech-founder`: business language throughout; for dunning, say "failed payments you can
  recover" and point at the processor's settings (no code required).
- `eng-builder` / `returning-founder`: terse; lead with the defer-lines and the margin read. They
  don't need the case for charging.
- `indie-hacker`: calm-company framing — a price you can defend and a customer who can leave easily
  beats extraction. Expansion is optional; sustainable is the goal.
- `vibe-virtuoso`: the sharp cut — 50 shipped things, has any one taken a dollar? This is the verb
  that turns a portfolio into a business.
- `domain-expert` / regulated: entity and ToS come *earlier*, not later; point hard at real counsel,
  and treat the privacy surface as load-bearing (`/trust`) rather than deferrable.

## Rules
- **Say no when the yes doesn't exist.** Pre-WTP, the honest output is `/interview`, not a payment rail.
- **Pointers to professionals, never legal or tax advice.** Name the bright line out loud.
- **Cheapest reversible move first** — a payment link before a billing system, by-hand invoices before
  either.
- **Record the EVENT, never the stream.** No MRR dashboard; a `commitment` EVID and a DEC.
- **Don't build billing.** Dunning is a processor setting.
- **Never a stealth price raise**, and never expansion built on lock-in or struggle.
- **Check the margin before pushing upgrades or expansion** — heaviest users can be the least profitable.
