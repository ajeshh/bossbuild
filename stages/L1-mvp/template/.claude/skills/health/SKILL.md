---
name: health
description: The post-launch verdict AND the diagnosis, in one read - is this working, and if it isn't, where exactly is it breaking? Renders product-market fit honestly (pre / at / post, defaulting to pre-PMF because scaling before fit is the #1 way startups die), and when the curve is decaying, says WHERE it dies — at the top (activation), in the middle (engagement), or at the wallet (failed payments) — and routes to the one real fix. Reads what you already hold (the EVID ledger, /measure's curve, the cost log, your honest answers); never instruments for itself, never keeps a score. At n<10 the honest output is "you can't measure this yet — go talk to them." Usage - /health
---

# /health — is this working, and if not, where is it breaking?

The one post-launch verb. You have users; the question underneath every other decision is *have I
found fit, and if the curve is sagging, which part is broken?* Those were two skills (`/pmf-check`
and `/retain`) until v0.157.0, and keeping them apart made a founder pick which question they had
before they had the answer that tells them.

**A verdict and a diagnosis — never a dashboard.** It reads, it calls it, it names the one next move,
it writes one dated file. No score tracked over time (that's a meter you'd tend instead of a
product), and no second source of truth: it reads the EVID ledger, `/measure`'s output, the cost
log, and your honest answers.

## Step 0 — the gate, and the default is *not yet*

Read the real user count (ask, or read `/ship` context, `docs/measure/`, the EVID ledger).

- **Fewer than ~10 real users → stop here.** You cannot measure fit or retention on a handful;
  you're pre-PMF by definition. The honest output is a **conversation**, not a survey — point at
  `/interview`. Running the lenses on 8 users produces theater, and the theater is the dangerous
  part: it manufactures false confidence to scale on.
- **~10–40:** run the lenses, but read the verdict as *directional*. Weight the qualitative — the
  pull, the interviews — over the percentages.
- **~40+ who reached core value:** the lenses carry real signal.

## Step 1 — read the curve, rebased

Pull `/measure`'s retention curve and **rebase past the AI-tourist wave** before you read it: the
week-2–5 curiosity spike (signups who try it once and vanish) flatters every number in both
directions. **Read the Month-3 cohort.** The true floor is what's left after the novelty burns off,
never the launch spike.

Then read the *shape*, because the shape decides which half of this skill you're in:
- **Decays toward zero** — no cohort stays. That's a **fit** problem: go to Step 2 and expect
  pre-PMF.
- **Flattens to a plateau** — some cohort stays indefinitely. Fit may be real; Step 2 confirms it,
  and Step 3 tells you where the leak is if the plateau is lower than it should be.

## Step 2 — the verdict (three lenses; fit is when they *agree*)

No single lens is proof.

**1. The Sean-Ellis 40% test — only on users who reached core value.** Ask the people who actually
hit the aha-moment (not signups, not tourists): *"How would you feel if you could no longer use
this?"* **≥40% "very disappointed"** is the empirical threshold (Ellis, across ~100 startups). The
detail founders skip and that changes the answer: **survey the activated core, not everyone who ever
signed up** — the latter drags the number down with people who never got the value, and hides real
fit with a specific segment. No survey yet? The Mom-Test-clean interview proxy: did they ask for it
back? did they tell someone else? (route via `/interview` → graded `EVID`).

**2. Curve flattening.** PMF looks like a plateau; no-PMF looks like decay to zero. The *existence*
of a plateau tells you **whether** you have fit; its *height* tells you **how big**.

**3. Pull vs push — the gut-check that catches the other two lying.** Are users pulling the product
out of you, or are you pushing it onto them? Pull = they find you, they nag for access, usage grows
when you're not looking. Push = every user is a shove, growth stops the moment you stop selling. You
can fake a survey and misread a curve; you can't fake the feeling that the market is pulling. **If
the numbers say fit but it feels like pushing a boulder, trust the boulder.**

### Call it — and name which job the founder is actually in

The hinge gates a *role transition* (`boss craft founder-role-shifts`); premature scaling is a
founder doing the leader's job before they've done the operator's.

- **🔴 pre-PMF — the default.** Lenses disagree or fall short. **You're still a seller**; the job is
  fit, not growth. More `/interview`, sharper segment focus, product changes that move the 40% —
  **not** hiring, not paid acquisition, not a raise narrative. Say it plainly and without apology:
  *most products are here, most of the time, and that is not failure — it's the actual work.*
  Spending on growth now doesn't buy growth; it buys a faster, more expensive way to learn you
  didn't have fit.
- **🟡 at-PMF.** The lenses are starting to agree in one segment. The seller→operator transition is
  beginning. **Keep the fit you found** — go to Step 3 and fix the leak — and confirm it holds across
  a second and third cohort before treating it as won.
- **🟢 post-PMF.** They clearly agree, across cohorts, over time. **Now the leader's work — scaling,
  hiring, delegation — has finally earned its place.** This is the one verdict that *licenses* the
  growth machinery the earlier rungs correctly refuse. Point forward: `mentor-gtm`, `mentor-business`,
  `mentor-talent`. Watch the margin trap — scaling a thin-margin product is how post-PMF companies
  still die.

**When the read is genuinely ambiguous, call it pre-PMF and say why.** The asymmetry is the whole
argument: wrongly believing you have fit (hire, raise, spend, scale, *then* discover it was noise) is
catastrophic and hard to reverse; wrongly believing you don't (keep talking to users) is cheap and
reversible. ~70% of startups scale prematurely and most never clear a real revenue floor
(Startup Genome).

## Step 3 — where does the curve die? (the diagnosis, and the one fix)

Only worth running when a curve exists. **There is no retention hack — the fix is always the
product; this says which part.**

**3a. Dies at the top — the D0→D1 cliff (activation failure).** Most users never hit the aha; there
was nothing to retain. **Highest-leverage lever** — one fix lifts every downstream cohort. Route →
**`/onboard`**: shorten time-to-value, find the aha via the best-retained-users method, concierge the
first users by hand. Don't work middle-funnel retention while the top leaks.

**3b. Dies in the middle (engagement decay — no plateau forms).** They got value once; the product
doesn't earn a return. Read `/measure`'s edit-rate / regeneration / frustration index to tell which:
**quality slid** (the AI output stopped being good → `/evals` + `/judge-traces`), **no trigger back
in**, or **genuinely one-and-done** (an honest ceiling — maybe price and position for twice-a-year
use instead of fighting it). Route → the product and `/roadmap`, and **`/interview` the churned** to
hear why. Feed the roadmap with the *churn* signal, not the loudest surviving user.

**3c. Dies at the wallet (involuntary churn).** Paying users lost to failed card charges — not
dissatisfaction. **20–40% of churn, and the most recoverable bucket.** Route → dunning: card-retry
logic, pre-expiry prompts, smart retry timing, a grace period. **Point at the payment processor**
(Stripe Smart Retries / Billing, Chargebee, Recurly) — **do not build a billing system.** Also
reachable from `/money`, which operates this once revenue exists.

## The humane line (PRINCIPLE #6)

- **Fit is measured on user *success*, not engagement.** The 40% matters precisely because losing it
  would *hurt* them. A high-DAU product people can't quit is not PMF; it might be a hook.
- **A user who succeeded and left is a win.** Don't pathologize a healthy exit into "churn."
- **Resurrection is an invitation, never a winback dark pattern.** *"Here's what's new, come see if
  it's useful now"* is fine; guilt-trips, fake scarcity, confirmshaming the cancel and roach-motel
  cancellation are refused by name (`boss craft ai-ux-patterns`).
- **Don't scale a thing that isn't yet helping people.** Scaling before fit multiplies a product that
  doesn't work across more lives. The pre-PMF default is a humane guard, not only a financial one.
- **Do the involuntary-churn fix wholeheartedly** — the one move that's pure gain for both sides.

## Output

One short `docs/health/HEALTH-<date>.md`: the user count and the n-gate call, the three-lens read
(the 40% or its interview proxy, the curve shape, the honest pull/push answer), the **verdict**
(pre/at/post + which role-ladder job that puts you in), the **diagnosis** if the curve is sagging
(top / middle / wallet), and the **one next move**. If the signal is real it's `observed-behavior`
(or `commitment`) EVID — record it via `/evidence`. **A verdict, dated. Re-run when the inputs have
genuinely moved, not on a schedule.**

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: define fit in one plain line — *"do the people who tried it
  actually need it back?"* At n<10, don't run anything; `/interview`. Teach, don't grade.
- `vibe-virtuoso`: the sharp cut — 50 shipped things, has any one earned a flattening curve? The
  pull/push lens is the one they can't argue with. Fit, not another launch.
- `returning-founder`: terse; they know the 40% test. The value is the honest default-to-no and the
  role-ladder framing of what premature scaling costs.
- `indie-hacker`: calm-company framing — a durable plateau you can live on beats a rising curve;
  twice-a-year usage can be a real business, priced for it.
- `non-tech-founder`: plain-language verdict and diagnosis; for involuntary churn, name it "failed
  payments you can recover" and point at the processor's dunning settings (no code).
- `domain-expert` / regulated: fit includes **safe** fit — a high-stakes workflow isn't at PMF until
  it's reliable enough to trust. Quality-slide is the first suspect for engagement decay; reliability
  *is* retention here.

## Rules
- **Default to pre-PMF.** You earn your way off it; ambiguity resolves to "not yet."
- **Say no at n<10** — the honest output is a conversation, not a number.
- **A verdict, never a meter.** No score-over-time dashboard; that's ceremony you'd tend instead of ship.
- **Read what you already hold.** Never a second source of truth, never instrument *for* this.
- **Survey the activated core, not all signups** — the single most common way founders misread the 40%.
- **Fit is when the three lenses agree.** One green light is a hypothesis.
- **Rebase past the AI-tourist wave** before reading any curve.
- **Post-PMF is the only verdict that licenses scaling.** Pre/at, the leader's job stays refused.
- **Feed the roadmap with churn, not the loudest survivor** (the "loud ≠ important" check at `/spec`).
