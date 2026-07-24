---
name: pmf-check
description: The product-market-fit verdict — the one gate the whole post-launch journey turns on. BOSS already measures the *inputs* to PMF (/measure reads the retention curve, /interview + /evidence hold the demand signal, /ai-cost holds the economics) but never renders the verdict. This does: it reads what you already have and calls it — pre-PMF / at-PMF / post-PMF — from three cheap lenses (Sean-Ellis 40%-test on users who hit core value + retention-curve flattening + the pull-vs-push gut-check). It DEFAULTS to "you're probably still pre-PMF — keep talking to users, don't scale yet," because scaling before PMF is the #1 cause of startup death. Voiced through the seller→operator→leader role ladder: it says what job you're actually in, and it says no to the leader's job before you've done the operator's. At n<10 the honest output is "you can't measure fit yet — go talk to them." Usage - /pmf-check
---

# /pmf-check — are you actually at product-market fit? (and the honest default is: not yet)

The single highest-leverage post-launch verb. Not because it does much — it reads what you already
have — but because it renders the **one verdict** every other decision hangs on: *have you found fit, or
are you about to scale something that hasn't earned it?* Marc Andreessen: *the only thing that matters is
getting to product-market fit.* The corollary nobody acts on: **scaling before you have it is the #1 way
startups die** — ~70% of startups scale prematurely; the vast majority of those never clear a real revenue
floor (Startup Genome). BOSS measures the inputs to this hinge everywhere; this is the one place it says
the word.

**This is a verdict, not a dashboard.** It reads, it calls it, it points at the one next move, it writes
one dated file. It does not track a "PMF score" over time (that's a meter you'd tend instead of a product)
and it never builds a second source of truth — it reads the EVID ledger, `/measure`'s output, the cost
log, and your own honest answers.

## Step 0 — the JIT gate (the default is NO)

Read the real user count (ask, or read `/ship` context / `docs/measure/` / the EVID ledger). **The default
verdict is pre-PMF** — you have to earn your way off it, not onto it.

- **Fewer than ~10 real users → stop here. You cannot measure fit yet; you're pre-PMF by definition.** The
  honest output is a conversation, not a survey. Point at `/interview`. Do not run the lenses on 8 users —
  the numbers would be theater and the theater is dangerous (it manufactures false confidence to scale on).
- **~10–40 users:** you can run the lenses, but read the verdict as *directional*, not decisive — small-n
  noise is real. Weight the qualitative (pull, the interviews) over the percentages.
- **~40+ users who reached core value:** the lenses carry real signal.

## The three lenses (read what you already hold; don't instrument for this)

Render the verdict from three cheap reads. No single one is proof; **fit is when they agree.**

### 1. The Sean-Ellis 40% test — *only* on users who reached core value
Ask the users who actually hit the aha-moment (not signups, not tourists): **"How would you feel if you
could no longer use this?"** — *very disappointed / somewhat disappointed / not disappointed.* **≥40% "very
disappointed" is the empirical PMF threshold** (Ellis, across ~100 startups). The load-bearing detail founders
skip: **survey only the activated core.** Asking everyone who ever signed up drags the number down with people
who never got the value — and hides the fit you might actually have with a specific segment. If you can't run
the survey yet, the interview equivalent is the Mom-Test-clean read: did they ask for it back? did they tell
someone else? (route via `/interview` → graded `EVID`).

### 2. Retention-curve flattening — does a cohort *stay*?
Read `/measure`'s retention curve. **PMF looks like a curve that flattens to a stable plateau** — some cohort
keeps coming back indefinitely. **No PMF looks like a curve that decays to zero** — everyone eventually leaves.
The height of the plateau tells you *how big* the fit is; the *existence* of a plateau tells you *whether* you
have one. The AI-era wrinkle (fold in `/measure` + the retention practice when built): discount the week-2–5
**"AI-tourist" wave** (curiosity signups who spike then vanish) — **rebase to the Month-3 cohort**; the true
retention floor is what's left after the novelty burns off, not the launch spike.

### 3. Pull vs push — the gut-check that catches the other two lying
Andy Rachleff / Andreessen's felt test: **are users pulling the product out of you, or are you pushing it onto
them?** Pull = they find you, they nag you for access, usage grows when you're not looking, word of mouth
shows up in the register. Push = every single user is a shove, growth stops the moment you stop selling, the
pipeline is all outbound. You can fake the survey and misread a curve; you can't fake the feeling that the
market is pulling. If the numbers say fit but it *feels* like pushing a boulder, trust the boulder.

## The verdict — rendered through the role ladder (`founder-role-shifts`)

Call it, and say **which job the founder is actually in** — because the whole point of the hinge is that it
gates a *role transition*, and premature scaling is a founder trying to do the leader's job before they've
done the operator's.

- **🔴 pre-PMF (the default).** The lenses disagree or fall short (<40% very-disappointed, a curve still
  decaying, more push than pull). **You're still a *seller*** — the job is *fit*, not growth. The move is
  more `/interview`, sharper segment focus, and product changes that move the 40% number — **not** hiring,
  not paid acquisition, not a Series A narrative. Say this plainly and without apology: *most products are
  here, most of the time, and that is not failure — it's the actual work.* Spending on growth now doesn't
  buy growth; it buys a faster, more expensive way to learn you didn't have fit.
- **🟡 at-PMF (the hinge itself).** The lenses are starting to agree — ~40% very-disappointed, a curve that's
  flattening, real pull in one segment. **This is the seller→operator transition beginning.** The move is to
  *keep the fit you found*: nail retention (`/retain` when built; `/measure` now), tighten onboarding so more
  users reach the value that's landing (`/onboard` when built), and only *then* pour fuel. Don't declare
  victory — confirm it's durable across a second and third cohort before you treat it as won.
- **🟢 post-PMF.** The lenses clearly agree, across cohorts, over time. **Now you're an *operator*, and the
  *leader's* work (scaling, hiring, delegation) has finally earned its place** — this is the one verdict that
  *licenses* the growth machinery the earlier rungs correctly refuse. Point forward: `mentor-gtm` (growth
  channels, now that manipulation isn't load-bearing because there's real pull), `mentor-business` (pricing/
  packaging on proven value), `mentor-talent` (the first hire, when cost-of-mistake > cost-of-salary). The
  margin-trap moment matters most here — scaling a thin-margin product is how post-PMF companies still die.

## The premature-scaling guard (why the default is NO)

If the read is genuinely ambiguous, **call it pre-PMF and say why.** This is deliberate and it is the humane
call: the cost of wrongly believing you have fit (hire, raise, spend, scale — then discover the fit was
noise) is *catastrophic and hard to reverse*; the cost of wrongly believing you don't (keep talking to users,
keep sharpening) is *cheap and reversible*. When the downside is that asymmetric, the honest default is the
conservative one. BOSS says no to scaling before the hinge the same way it says no to building before the
canvas — not to slow you down, but because the graveyard is full of the other choice.

## The humane line (PRINCIPLE #6)

- **PMF is measured on user *success*, not engagement.** The 40% "very disappointed" is meaningful precisely
  because it means the product genuinely *helps* — losing it would hurt them. A high-DAU product people can't
  quit is not PMF; it might be a hook. Measure whether it works for them, not whether they can't leave.
- **Don't scale a thing that isn't yet helping people.** Scaling before fit doesn't just waste the founder's
  money — it multiplies a product that doesn't work across more lives. The pre-PMF default is a humane guard,
  not only a financial one.

## Output

A short `docs/pmf/PMF-<date>.md`: the user count (and the n-gate call), the three-lens read (the 40% number
or its interview proxy, the curve shape, the pull/push honest answer), the **verdict** (pre/at/post + which
role-ladder job that puts the founder in), and the **one next move**. If real, the retention/40% signal is
`observed-behavior` (or `commitment`) — record it as an `/evidence` EVID too. A verdict, dated; re-run it
when the inputs have genuinely changed, not on a schedule.

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: define PMF in one plain line ("do the people who tried it actually
  need it back?"). If n<10, *don't* run the lenses — send them to `/interview`. Teach, don't grade.
- `vibe-virtuoso`: the sharp cut — 50 shipped things, has any one earned a flattening curve? The pull/push
  lens is the one they can't argue with. Fit, not another launch.
- `returning-founder`: terse; they know the 40% test — the value is the honest *default-to-no* and the
  role-ladder framing of what scaling prematurely costs.
- `indie-hacker`: calm-company framing — fit for a *sustainable* segment beats fit-at-any-scale; you don't
  need hypergrowth PMF, you need a plateau you can live on.
- `non-tech-founder`: plain-language verdict; "are they pulling it out of your hands, or are you pushing?"
- `domain-expert` / regulated: fit includes *safe* fit — a high-stakes workflow isn't at PMF until it's
  reliable enough to trust; weight the failure/quality read, not just the demand read.

## Rules
- **Default to pre-PMF.** You earn your way off it; ambiguity resolves to "not yet."
- **Say no at n<10** — you can't measure fit on a handful; the honest output is a conversation.
- **A verdict, never a meter.** No PMF-score-over-time dashboard; that's ceremony you'd tend instead of ship.
- **Read what you already hold** — EVID ledger, `/measure`, the cost log, honest answers. Never a second
  source of truth, never instrument *for* this.
- **Survey the activated core, not all signups.** The single most common way founders misread the 40%.
- **Fit is when the three lenses agree** — one green light is a hypothesis, not a verdict.
- **Post-PMF is the only verdict that licenses scaling.** Pre/at-PMF, the leader's job stays refused.
