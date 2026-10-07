## Step 2 — read the curve, rebased

Pull the retention curve Step 1 set up and **rebase past the AI-tourist wave** before you read it: the
week-2–5 curiosity spike (signups who try it once and vanish) flatters every number in both
directions. **Read the Month-3 cohort.** The true floor is what's left after the novelty burns off,
never the launch spike.

Then read the *shape*, because the shape decides which half of this skill you're in:
- **Decays toward zero** — no cohort stays. That's a **fit** problem: go to Step 3 and expect
  pre-PMF.
- **Flattens to a plateau** — some cohort stays indefinitely. Fit may be real; Step 3 confirms it,
  and Step 4 tells you where the leak is if the plateau is lower than it should be.

## Step 3 — the verdict (three lenses; fit is when they *agree*)

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

- **pre-PMF — the default.** Lenses disagree or fall short. **You're still a seller**; the job is
  fit, not growth. More `/interview`, sharper segment focus, product changes that move the 40% —
  **not** hiring, not paid acquisition, not a raise narrative. Say it plainly and without apology:
  *most products are here, most of the time, and that is not failure — it's the actual work.*
  Spending on growth now doesn't buy growth; it buys a faster, more expensive way to learn you
  didn't have fit.
- **🟡 at-PMF.** The lenses are starting to agree in one segment. The seller→operator transition is
  beginning. **Keep the fit you found** — go to Step 4 and fix the leak — and confirm it holds across
  a second and third cohort before treating it as won.
- **🟢 post-PMF.** They clearly agree, across cohorts, over time. **Now the leader's work — scaling,
  hiring, delegation — has finally earned its place.** This is the one verdict that *licenses* the
  growth machinery the earlier rungs correctly refuse. Point forward: `mentor-customers` and `mentor-capital`, both seated here — and `mentor-hiring` once you
  unlock Scale, which is the rung that seats it. Watch the margin trap — scaling a thin-margin product is how post-PMF companies
  still die.

**When the read is genuinely ambiguous, call it pre-PMF and say why.** The asymmetry is the whole
argument: wrongly believing you have fit (hire, raise, spend, scale, *then* discover it was noise) is
catastrophic and hard to reverse; wrongly believing you don't (keep talking to users) is cheap and
reversible. ~70% of startups scale prematurely and most never clear a real revenue floor
(Startup Genome).

## Step 4 — where does the curve die? (the diagnosis, and the one fix)

Only worth running when a curve exists. **There is no retention hack — the fix is always the
product; this says which part.**

**3a. Dies at the top — the D0→D1 cliff (activation failure).** Most users never hit the aha; there
was nothing to retain. **Highest-leverage lever** — one fix lifts every downstream cohort. Route →
**`/onboard`**: shorten time-to-value, find the aha via the best-retained-users method, concierge the
first users by hand. Don't work middle-funnel retention while the top leaks.

**3b. Dies in the middle (engagement decay — no plateau forms).** They got value once; the product
doesn't earn a return. Read the edit-rate / regeneration / frustration index Step 1 set up to tell which:
**quality slid** (the AI output stopped being good → `/evals` + `/judge-traces`), **no trigger back
in**, or **genuinely one-and-done** (an honest ceiling — maybe price and position for twice-a-year
use instead of fighting it). Route → the product and `/roadmap`, and **`/interview` the churned** to
hear why. Feed the roadmap with the *churn* signal, not the loudest surviving user.

**3c. Dies at the wallet (involuntary churn).** Paying users lost to failed card charges — not
dissatisfaction. **20–40% of churn, and the most recoverable bucket.** Route → dunning: card-retry
logic, pre-expiry prompts, smart retry timing, a grace period. **Point at the payment processor**
(Stripe Smart Retries / Billing, Chargebee, Recurly) — **do not build a billing system.** Also
reachable from `/money`, which operates this once revenue exists.
