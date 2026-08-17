---
name: first-dollar
description: Take the first dollar — the sharpest JIT moment in the lifecycle and the highest-grade evidence event BOSS ever sees (a paying customer is commitment-grade EVID by definition). Fires only when someone has actually said yes (a real WTP signal) — pre-revenue it sends you to /interview to GET the yes. Walks five deferrable moves, detecting what already exists and skipping it: entity, ToS+privacy, payment rail (cheapest reversible — a payment link before a billing system, the /ship pattern applied to money), refund posture (decided before the first request), and the first price (one number, said out loud). Ends by writing the commitment-grade EVID so the first dollar doesn't evaporate like the interviews did. Bright line: pointers to professionals, never legal/tax advice; records the EVENT (evidence), never the STREAM (no MRR dashboard — that's your payment provider's job). Usage - /first-dollar
---

# /first-dollar — someone will pay; here's how to let them (without stalling)

The runner over `boss craft first-dollar`. The conscience's founding question is *"will anyone pay?"*
This is the moment someone actually will — and founders stall right here, at maximum validation, because the
money mechanics feel like a different universe from the code. They're just unfamiliar. Five moves, most
deferrable, ~20 minutes.

> **Bright line, stated up front:** every item touching law, tax, or entity is a **pointer at a professional**,
> never advice. BOSS prepares you with the questions to ask a real lawyer/accountant; it never plays one.

## Step 0 — the JIT gate (has someone actually said yes?)

- **No real WTP signal yet** (no one has committed) → **stop. Don't build a payment rail for a customer who
  doesn't exist.** The honest move is `/interview` / `/pretotype` to *get* the yes. Say so.
- **Someone has said yes** (a real "take my money," a committed intent, a first buyer) → proceed. This is the
  moment.

## Step 1 — walk the five moves (detect what exists; skip it; defer what's deferrable)

For each, first *look* (is there already a Stripe link in the repo? a ToS page? an entity?) and skip what's
done. Then, for what's missing, give the move + its "defer if…" honesty line:

1. **Entity** — needed to lawfully invoice a business in most places. *Defer if* a first informal sole-prop sale
   is legal where you are (pointer to counsel / a registered-agent service — not advice). Don't run the first
   dollar through a personal-name Stripe you'll have to untangle.
2. **ToS + privacy policy** — the minimum surface once you take money *and* data. *Defer if* pre-revenue with no
   PII. If you're collecting personal data, hand off to **`/trust`** (data-min policy + subprocessor list); a
   real lawyer before real scale.
3. **Payment rail** — **cheapest reversible: a payment link** (Stripe / Lemon Squeezy / Paddle) before any
   billing system. *Defer if* you can invoice the first few by hand (do — it teaches you the terms). Don't build
   subscriptions/dunning before ~3 customers.
4. **Refund posture** — decide it **now**, calm, before the first request. A clear, slightly generous default
   (no-questions within N days) beats an ad-hoc panic and builds trust.
5. **The first price** — **one number, said out loud.** `mentor-business` owns the menu (tiers, metering,
   on-ramp); this forces the *first* number so fear doesn't defer it forever. Name it; you can change it.

## Step 2 — record the decisions (so future-you isn't guessing)

The price and the refund posture are load-bearing calls — offer to record each as a **`/decide` DEC** (what, why,
how reversible). Cheap, and it stops the "wait, what did we decide to charge?" drift.

## Step 3 — capture the commitment-grade EVID (the whole point)

The skill's last act: **write the `commitment`-grade EVID** (`/evidence`) — who paid, what for, what it proves
about the riskiest assumption. First revenue is the single data point the canvas has waited for; the interviews
were `stated-pain`, this is someone *giving up money*. Don't let it evaporate. (After this exists, BOSS's
conscience shifts register from *validate* → *deliver* — "someone is paying; is it working for them?")

## The humane line (PRINCIPLE #6)

- **Charge honestly from the first dollar** — no hidden fees, no fake "was $X now $Y" discount, no dark-pattern
  checkout. The precedent you set here compounds.
- **The refund posture is respect, not a leak.** Generous-and-clear is cheaper than the trust stingy costs.
- **A price said plainly is honest; free-forever-because-asking-is-scary is avoidance** — and it denies you the
  one piece of evidence that matters most.

## Output

A short `docs/first-dollar/FIRST-DOLLAR-<date>.md`: which of the five moves are done / deferred (and the defer
reason), the first price + refund posture, and a pointer to the `commitment` EVID written. Plus the DEC(s) for
price and refund. **Record the event, never the stream** — no MRR/revenue dashboard; that's your payment
provider's job.

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: define each move in one plain line; heavily bias to *defer* (a payment
  link + a named price is the whole MVP of "taking money"). Reassure: naming a price is allowed to feel scary.
- `non-tech-founder`: they often know this better than the tech (they've invoiced before) — skip the basics,
  focus on the payment-link-before-billing-system bias and the ToS/privacy handoff.
- `eng-builder` / `returning-founder`: terse; the "don't build billing before 3 customers" line + the EVID
  capture; they'll over-engineer the rail if you let them.
- `indie-hacker`: calm-company — a payment link and a fair refund policy *is* the business; no VC-scale billing
  infra needed.
- `domain-expert` / regulated: the entity + ToS/privacy moves are load-bearing early (regulated sales); route
  the compliance surface to `/trust` and a real lawyer before the first regulated dollar.

## Rules
- **Say no if no one has said yes** — build the rail for a real buyer, not a hypothetical one.
- **Pointers to professionals, never legal/tax advice** — prepare the founder for the expert; don't play one.
- **Cheapest reversible** — payment link before billing system; invoice by hand before automating.
- **Name the first price out loud** — free-forever creep is avoidance, not generosity.
- **Capture the `commitment` EVID** — the first dollar is the highest-grade evidence BOSS ever sees; don't lose it.
- **Record the event, not the stream** — no MRR dashboard; the payment provider owns analytics.
