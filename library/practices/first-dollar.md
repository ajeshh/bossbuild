---
id: PRACTICE-first-dollar
type: practice
owner: mentor-business
status: active
host: stack-neutral
provenance: IDEA-050 (fable-campaign lifecycle pass, Fable 5 2026-07-02 — "what about the first paid customer?"), built in the post-launch program (2026-07-23 SESSION, JOB 4, Tier 2). The conscience's founding question is "will anyone pay?" — BOSS had nothing for the moment someone actually will. A paid customer is a commitment-grade EVID by definition (the highest-grade evidence event BOSS ever sees). Pairs with /first-dollar (the runner), mentor-business (the pricing menu), the EVID ladder (/evidence), /ship (the cheapest-reversible pattern, applied to money), /trust (ToS/privacy, build #8), /decide (record the pricing/refund calls). BOSS v0.125.0.
---

# Practice — The first dollar (from "will anyone pay?" to "someone is paying")

> **The bright line, first and non-negotiable.** Everything below that touches law, tax, or entity structure is
> a **pointer at a professional**, never advice. BOSS prepares the founder with the questions to ask a real
> lawyer / accountant; it never plays one. (The `/decide` bright line extends here.)

Taking a first dollar is the sharpest just-in-time moment in the whole lifecycle and the **highest-grade
evidence event BOSS will ever see** — a paying customer is `commitment`-grade EVID *by definition*. Yet founders
stall right at the moment of maximum validation, because the money mechanics feel like a different universe from
the codebase. They're not that hard; they're just *unfamiliar*. Five moves, most deferrable, none a ceremony.

## The JIT boundary

This fires at exactly one moment: **someone has said yes** — a real willingness-to-pay signal (a person who
committed, a "take my money," a signed intent). **Before that, this is premature** — the honest move is
`/interview` / `/pretotype` to *get* the yes, not to build a payment rail for a customer who doesn't exist yet.
Don't set up billing in a vacuum.

## The five moves (each with a "defer if…" line and its named trap)

1. **Entity.** In most jurisdictions you can't lawfully invoice a business without one. *Defer if:* a first
   informal sale as a sole proprietor is legal where you are (varies — a pointer to counsel / a registered-agent
   service, not advice). **Trap:** charging through a Stripe account in your personal name and untangling it
   later; commingling funds before there's an entity to hold them.

2. **ToS + privacy policy.** The minimum legal surface the moment you take money *and* data. *Defer if:* truly
   pre-revenue with no PII. **Trap:** a copy-pasted ToS that doesn't match what you actually do, or no privacy
   policy while you're collecting personal data (this is where `/trust` picks up — data-minimization policy +
   the subprocessor list; a real lawyer before real scale).

3. **Payment rail.** The `/ship` pattern applied to money: **cheapest reversible first** — a Stripe / Lemon
   Squeezy / Paddle **payment link** before you build any billing system. *Defer if:* you can invoice the first
   few by hand (you can, and it teaches you the terms). **Trap:** building a billing system, subscriptions, and
   a dunning pipeline before you have three customers — the classic pre-revenue over-build.

4. **Refund posture.** Decide it **before** the first refund request, when you're calm. A clear, slightly
   generous default (no-questions-asked within N days) beats an ad-hoc panic and *builds* trust. **Trap:** no
   policy → every refund is a stressful one-off negotiation; or a hostile/hidden refund policy that saves one
   refund and costs the reputation.

5. **The first price.** One number, said out loud. `mentor-business` owns the *menu* (tiers, metering basis,
   on-ramp) — this **forces the first number now** so the fear doesn't defer it forever. **Trap:** free-forever
   creep because asking for money feels worse than building (the builder-who-won't-sell — the role-ladder's MVP
   failure), and underpricing to dodge the same fear. Name a price; you can change it.

## The evidence capture (don't let the first dollar evaporate)

The skill's last act, and the point of the whole thing: **write the `commitment`-grade EVID** (`/evidence`).
First revenue is the single data point the entire canvas has been waiting for — the interviews were
`stated-pain`, the pretotype was a signal; *this is someone giving up money.* It must not evaporate the way
early conversations do. Record who, what they paid for, and what it proves about the riskiest assumption.

## The conscience shifts register (no new hook)

Once a first-dollar EVID exists, the existing drift/caution voicings shift from **validate → deliver**: the
question stops being *"will anyone pay?"* and becomes *"someone is paying — is what they paid for actually
working for them?"* No new machinery — the conscience's evidence eye ([[IDEA-045]]) already reads the ledger;
the presence of `commitment` EVID is what quiets the "will anyone pay?" line and sharpens the delivery one.

## The humane line (PRINCIPLE #6)

- **Charge honestly from the first dollar** — it sets the precedent. No hidden fees, no fake discount off an
  invented "original" price, no dark-pattern checkout at the very first sale. The habits you set here compound.
- **The refund posture is respect**, not a leak to plug. A generous, clear refund is cheaper than the trust a
  stingy one costs.
- **A price said plainly is honest; free-forever-because-I'm-scared is not a kindness** — it's avoidance, and it
  denies you the one piece of evidence that matters most.

## What BOSS refuses here (name it, don't build it)

Legal/tax advice (pointer to a professional, always); a **revenue dashboard / MRR tracking** (that's the payment
provider's job — BOSS records the *event* as evidence, never the *stream* as analytics); a billing/subscription
system (point at Stripe — payment link first; the system is a much-later problem). Ties: `/first-dollar` (runner),
`mentor-business` (pricing menu), `/trust` (ToS/privacy), `/decide` (record the price + refund calls as DECs),
the monetization-in-practice practice (what happens *after* the first dollar — upgrades, dunning, the price-raise).
