---
name: retain
description: The decaying-curve doctor. /measure reads the retention curve; this diagnoses WHY it's dropping and routes to the one real fix. Rebases past the week-2-5 AI-tourist wave (to the Month-3 cohort), then finds WHERE the curve dies — at the top (activation failure -> /onboard), in the middle (engagement decay -> the product + roadmap + /interview the churned), or at the wallet (involuntary/card-failure churn -> dunning plumbing, point at Stripe). There is no retention hack — the fix is always the product; this says which part. Humane by construction — a user who succeeded and left is a win, resurrection is invitation not a dark-pattern winback, and involuntary-churn recovery is the one pure-gain move. At n<10 (no real curve) the honest output is "go talk to them." Usage - /retain
---

# /retain — the curve is dropping; which part of the product is the cause?

The runner over `boss craft retention`. Its whole job is to stop a founder from reaching for a
retention *hack* (streaks, guilt-emails, red-dot nags) when the honest fix is always the product — and to say
*which* part of the product, by reading *where* the curve dies. `/measure` reads the curve; this fixes it.

## Step 0 — the JIT gate (say no when there's nothing to diagnose)

Read the real user count + whether a retention curve exists (`docs/measure/`, `/ship` context, the EVID ledger).
- **n<10, or no real curve yet → stop. There's nothing to diagnose.** The honest output is `/interview`, not a
  cohort analysis. Point them there.
- **A curve exists (n≥~30–50) AND a cohort came back *less* than the last → proceed.** That decay is the signal.
- **The one earlier exception:** if there's a paying user, *involuntary/card-failure churn recovery* is worth
  wiring now (Step 3c) — it's plumbing and needs no cohort to justify it.

## Step 1 — read the curve's SHAPE (before touching anything)

From `/measure`'s retention curve, name the shape:
- **Decaying to zero** (every cohort flatlines at ~0%) → **this is a fit problem, not a retention problem.**
  Don't run retention tactics on a zero-bound curve — route to **`/pmf-check`** + `/interview`. Stop here.
- **Flattening to a plateau** → the shape of fit; the work is raising the plateau. Continue.
- **Smiling / rising** → excellent; the work is expansion, not rescue. (Light touch — read Step 2, then focus
  on what the returning cohort expands into.)

## Step 2 — rebase past the AI-tourist wave

Before diagnosing, **discount the week-2–5 curiosity wave** (signups who tried the novelty and vanished — the
AI-tourist bleed-off). **Rebase to the Month-3 cohort** (or the first cohort past the novelty burn-off). Diagnose
off *that* cohort's behavior — otherwise you'll misread tourists leaving as engagement decay and chase the wrong
fix.

## Step 3 — diagnose WHERE the curve dies, and route to the one fix

3a. **Dies at the top — D0→D1 cliff (activation failure).** Most users never hit the aha; there was nothing to
retain. **Highest-leverage lever** (activation > acquisition — one fix lifts every downstream cohort). Route →
**`/onboard`** + the activation practice: shorten time-to-value, find the aha (best-retained-users method),
concierge onboarding. Don't work middle-funnel retention while the top leaks.

3b. **Dies in the middle (engagement decay — no plateau forms).** They got value once; the product doesn't earn
a return. Read `/measure`'s edit-rate / regeneration / frustration index to tell which: **quality slid** (the AI
output stopped being good — fix the eval loop, `/evals` + `/judge-traces`), **no trigger back in** (nothing pulls
them to return), or **genuinely one-and-done** (an honest ceiling — maybe price/position for twice-a-year use
instead of fighting it). Route → **the product + the roadmap**, and **`/interview` the *churned*** to hear why.
Feed the roadmap with the *churn* signal, not the loudest surviving user (the **"loud ≠ important"** discipline
at `/spec`). **No nag. No hack.**

3c. **Dies at the wallet (involuntary / mechanical churn).** Paying users lost to failed card charges — not
dissatisfaction. **20–40% of churn, the most recoverable bucket.** Route → **dunning: card-retry logic,
pre-expiry update prompts, smart retry timing, a grace period. Point at the payment processor** (Stripe Smart
Retries / Billing, Chargebee, Recurly) — **do not build a billing system.** This is the most humane bucket:
the user didn't choose to leave, so recovery is fixing an accident, not clawing back a decision.

## Step 4 — the humane line (measure success, don't manufacture stickiness)

- **A user who succeeded and left is a *win*.** Don't pathologize a healthy exit into "churn."
- **Resurrection = invitation, never winback-by-dark-pattern.** "Here's what's new, come see if it's useful now"
  is fine; guilt-trips, fake scarcity, confirmshaming the cancel, roach-motel cancellation are the patterns BOSS
  refuses to build (`ai-ux-patterns.md`).
- **Do the involuntary-churn fix wholeheartedly** — it's the one retention move that's pure gain for both sides.

## Output

A short `docs/retain/RETAIN-<date>.md`: the curve shape, the rebased cohort, the **diagnosis** (top / middle /
wallet), and the **one fix** with its route. If the decay signal is real, it's `observed-behavior` EVID — record
it via `/evidence`. A diagnosis, dated; re-run when the curve has genuinely moved, not on a schedule.

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: if n<10, don't analyze — `/interview`. Otherwise one plain read: "where
  are people dropping off — the first try, later, or the payment?" Define aha inline.
- `non-tech-founder`: business-language diagnosis; for involuntary churn, name it as "failed payments you can
  recover" and point at the processor's dunning settings (no code).
- `eng-builder` / `returning-founder`: terse; the cohort-rebase + the edit-rate/regeneration read for engagement
  decay; skip the basics.
- `indie-hacker`: calm-company framing — a durable plateau you can live on beats chasing a rising curve; twice-a-
  year usage can be a real business, priced for it.
- `domain-expert` / regulated: quality-slide is the first suspect (reliability *is* retention in high-stakes
  workflows); weight the failure/eval read.

## Rules
- **Say no at n<10 / no real curve** — the honest output is a conversation.
- **Diagnose the shape first** — a zero-bound curve is a `/pmf-check` problem, not a retention one.
- **Rebase past the AI-tourist wave** before diagnosing engagement decay.
- **There is no retention hack** — the fix is always the product; this only says which part. Refuse streaks,
  guilt-emails, red-dot nags, and winback dark-patterns by name.
- **Point at Stripe for dunning; don't build billing.** Involuntary-churn recovery is plumbing, not a product.
- **Feed the roadmap with churn, not the loudest survivor** (ties to the `/spec` "loud ≠ important" check).
