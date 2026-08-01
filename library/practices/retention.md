---
id: PRACTICE-retention
type: practice
owner: mentor-gtm
status: active
host: stack-neutral
provenance: post-launch program (2026-07-23 SESSION, JOB 2). The gap the map found — /measure *reads* the retention curve; nothing helped *fix* it. Distilled from Casey Winters (activation > acquisition; the retention curve must flatten) + Bangaly Kaba (best-retained-users method) + Brian Balfour (retention is the engine, not a metric) + a16z/ChartMogul (the AI-"tourist" churn wave; rebase to Month 3) + Lincoln Murphy / ProfitWell-Campbell (involuntary churn is 20–40% of the total and the most recoverable) + Lenny Rachitsky (there is no retention silver bullet — it's the product). Pairs with analytics-for-ai-products.md (the measuring half), /retain (the runner), /onboard + activation (build #4), /pmf-check (a flattening curve IS a PMF lens), the humane lens (ai-ux-patterns.md). BOSS v0.121.0.
last_reviewed: 2026-07-23
review_by: 2027-01-19
curve: market
---

# Practice — Fixing the retention curve (there is no hack; the fix is always the product — the question is *which part*)

> **Where this sits.** `analytics-for-ai-products.md` + `/measure` *read* the retention curve. This is the
> other half: **the curve is decaying — now what?** The load-bearing idea founders miss: retention is not a
> lever you pull, it's an *outcome you diagnose.* There is no notification-nag, no "we miss you" email, no
> streak mechanic that fixes a curve the product earned. The fix is always the product — but *where* the curve
> dies tells you *which* part of the product to fix, and that diagnosis is the whole value here.

## First, the JIT boundary (say no when there's nothing to diagnose)

You need **a real retention curve** to fix one. At **n<10 there is no curve** — the honest move is `/interview`,
not a cohort analysis. This practice earns its keep when: a project is live past n≥~30–50 (a curve you can
read), **AND a cohort came back *less* than the previous one** (a real decay signal, not launch noise). Before
that, "improve retention" is premature ceremony (Principle #2). The one exception that fires earlier:
**involuntary/card-failure churn recovery becomes relevant at the first paying user** — it's plumbing, and it
doesn't need a cohort to justify it.

## The curve must flatten — read the shape before you touch anything

Retention curves come in three shapes, and the shape *is* the diagnosis's first bit:

- **Decaying to zero** — every cohort eventually flatlines at ~0%. **You do not have product-market fit**;
  this is not a retention problem to fix with tactics, it's a fit problem to solve with `/pmf-check` +
  `/interview`. Retention work on a zero-bound curve is rearranging deck chairs.
- **Flattening to a plateau** — the curve drops, then *holds* at some stable % that keeps coming back forever.
  **This is the shape of fit** (Balfour/Winters). The plateau's *height* is your ceiling; the work is raising
  it. This is where retention practice actually operates.
- **Smiling / rising** — the plateau ticks *up* over time (returning users expand usage). Rare and excellent;
  the work becomes expansion, not rescue.

## The AI wrinkle — rebase to Month 3 before you diagnose

AI products have a distinctive false signal: a **week-2–5 "tourist" wave** — curiosity signups who try the
novelty, spike your early numbers, then vanish (a16z/ChartMogul). If you diagnose retention off the launch
cohort, you'll misread the tourist bleed-off as "engagement decay" and go chase the wrong fix. **Rebase to the
Month-3 cohort** (or the first cohort past the novelty burn-off): the true retention floor is what's left after
the tourists leave, and *those* are the users whose behavior you should be reading.

## The three decays — where the curve dies tells you what to fix

This is the diagnostic spine. Find *where* on the curve the drop happens:

1. **Activation-failure decay — the curve dies at the top (D0→D1 cliff).** Most users never reached the
   aha-moment, so there was never anything to retain. **This is the highest-leverage lever** — "activation >
   acquisition" (Winters/Pinterest): fixing the first-session success rate lifts every downstream cohort at
   once. Fix → **`/onboard` + the activation practice**: shorten time-to-value, find the aha (Bangaly Kaba's
   best-retained-users method), do concierge onboarding shamelessly. Don't touch middle-of-funnel retention
   while the top is leaking.

2. **Engagement decay — the curve dies in the middle (the plateau never forms).** Users *did* reach value once,
   but the product doesn't earn a return. Usually one of: the core value is **one-and-done** (a real ceiling,
   not a bug — maybe the honest answer is it's a tool people use twice a year, and you price/position for that,
   not fight it); or there's **no trigger** back into it (no natural reason to return); or, for an AI product,
   **the quality slid** (the output stopped being good enough to come back to — read `/measure`'s edit-rate /
   regeneration / frustration index). Fix → **the product and the roadmap** (see the next section), and
   `/interview` the *churned* to hear why. Never a nag.

3. **Involuntary / mechanical churn — the curve dies at the wallet, not the product.** Paying users lost to
   *failed card charges*, expired cards, and hard declines — not dissatisfaction. **This is 20–40% of total
   churn for most subscription products, and the single most recoverable bucket** (ProfitWell/Murphy). Fix →
   **dunning: retry logic, pre-expiry card-update prompts, smart retry timing, a grace period.** It's *plumbing,
   not persuasion* — point at the payment processor (**Stripe Smart Retries / Billing dunning**, Chargebee,
   Recurly); **BOSS does not build a billing system.** And it's the *most humane* bucket to work, because the
   user didn't choose to leave — recovering them is fixing an accident, not clawing back a decision.

## Quality and the roadmap ARE your retention strategy (the anti-hack core)

For engagement decay, resist every "retention tactic" the growth-hacking playbook sells. There is no silver
bullet (Rachitsky): streaks, guilt-emails, red-dot notifications, and manufactured FOMO lift a vanity number
for a week and cost you trust for good. **For an AI product specifically, the retention lever is output
*quality* (does it keep working — the eval loop) and the *roadmap* (does it keep being worth returning to).**
That's it. Retention is downstream of the product being good; the honest work is making it good, informed by
the *right* signal — which is why this ties straight to the **"loud ≠ important"** discipline: fix what the
silent-majority *churn* is telling you, not what the loudest surviving user is asking for.

## The humane clause (PRINCIPLE #6 — non-negotiable)

- **A user who succeeded and left is a *win*, not churn to claw back.** A humane product measures
  graduation/loop-closure, not engagement — some products are *supposed* to be used and finished. Don't
  pathologize healthy exits.
- **Resurrection is invitation, never winback-by-dark-pattern.** A genuine "here's what's new since you left,
  come see if it's useful now" is fine; guilt-tripping, fake scarcity, confirmshaming the cancel button, and
  roach-motel cancellation flows are the exact patterns `ai-ux-patterns.md` catalogs — and they *are* the thing
  BOSS refuses to help build.
- **Involuntary-churn recovery is humane because the user didn't choose to go** — it's the one retention move
  that's pure gain for both sides. Do that one wholeheartedly.

## What BOSS refuses here (name it, don't build it)

Churn-prediction ML (premature for essentially every BOSS founder — the curve + a few `/interview`s tell you
more than a model you can't yet train or trust); a retention *dashboard* (the curve lives in `/measure`, one
number); winback dark-patterns and engagement-maximization mechanics (anti-humane by construction); a billing/
dunning *system* (point at Stripe — it's plumbing, not a product you build).

## Ties + altitude

Silent until a project is live with a real, decaying curve past n≥~30–50 (involuntary-churn plumbing earlier,
at first paying user). Surfaces via **`/retain`** (the runner) and a pointer from `/measure` when it reads a
sliding curve. Feeds `/pmf-check` (a flattening curve is one of its three fit lenses) and [[IDEA-051]]
(operate-mode customer loop). Post-ship retention is `observed-behavior` / `commitment` **EVID** — record the
real signal. Cite: Winters (activation > acquisition; the curve must flatten), Bangaly Kaba (best-retained-
users), Balfour (retention is the engine), a16z/ChartMogul (AI-tourist wave; rebase to Month 3), Murphy/Campbell
(involuntary churn is 20–40% and the most recoverable), Rachitsky (no silver bullet — it's the product).
