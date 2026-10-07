---
name: health
description: Is the shipped thing working, and if not, where is it breaking? First run sets up the reading - the analytics seam, ONE activation metric, ONE retention curve, at most ten events (plus task-completion and edit rate for an AI product). Later runs give the verdict - product-market fit, honestly, defaulting to pre-PMF - and say where the curve dies. At n<10, talk to them. Usage - /health
---

# /health — is this working, and if not, where is it breaking?

The one post-launch verb. You have users, or you're about to; the question underneath every other
decision is *have I found fit, and if the curve is sagging, which part is broken?* That was three
skills (fit, retention, and a third for setting up what they read), and keeping them apart
made a founder pick which question they had before they had the answer that tells them.

**Set up once, then a verdict and a diagnosis — never a dashboard.** It reads, it calls it, it names
the one next move, it writes one dated file. No score tracked over time (that's a meter you'd tend
instead of a product), and no second source of truth: it reads the EVID ledger, the measurement it
set up, the cost log, and your honest answers. Full judgment on the setup half:
`boss craft analytics-for-ai-products`.

## Step 0 — look, then plant the seam (whatever the user count)

**First, look for what's already there.** A `posthog-js` / `plausible` / `@vercel/analytics` /
`mixpanel` dependency, a `track(` call in `src/`, a `created_at` column in the schema, a
`docs/measure/` file from an earlier run. A project that arrived with analytics does not need them
installed again — read what it already collects and work from that.

**Then check the seam — before the user count, because the founder who just shipped to nobody is the
one who most needs it.** Starting to measure later is only cheap if one half is already there, and that
half *cannot be bought back*:

- **`created_at` on user rows and core object rows.** You can add a tracking call any day; you cannot
  add the past. With timestamps you can reconstruct cohorts and a retention curve for the months
  *before* anyone thought about analytics — without them, the day you finally measure is day zero.
  Missing? A one-line migration now.
- **One `track(event, props)` stub** that console-logs or no-ops. Turns "adopt a tool later" into
  implementing one function instead of editing forty call sites.

That's the whole seam: **a timestamp column and a stub function.** If you find yourself naming events
or designing an `events` table here, stop — that's Step 1, and it isn't earned yet.

## Step 0b — the gate, and the default is *not yet*

Read the real user count (ask, or read `/ship` context, `docs/measure/`, the EVID ledger).

- **Fewer than ~10 real users → stop here, with the seam planted.** You cannot measure fit or
  retention on a handful; you're pre-PMF by definition. The honest output is a **conversation**, not a
  survey or a dashboard — point at `/interview`. Running the lenses on 8 users produces theater, and the
  theater is the dangerous part: it manufactures false confidence to scale on.
- **~10–40:** run the lenses, but read the verdict as *directional*. Weight the qualitative — the
  pull, the interviews — over the percentages. Instrument (Step 1) once you can no longer eyeball every
  session by hand — roughly **n≥30**.
- **~40+ who reached core value:** the lenses carry real signal.

## Step 1 — set up the reading (first run with users; skip when `docs/measure/` already has it)

**ONE activation metric + ONE retention curve.** Not a dashboard. One activation event (the moment a
user first gets the core value — named in the product's terms, e.g. "sent first summary") and one
retention curve (D1/D7/D30 or weekly, whichever matches the use). **5–10 events maximum**, each tied to
activation or retention. Anything else is analytics theater — refuse it, and say why.

**If `/onboard` has run, its metric is the one.** Read the newest `docs/onboard/ONBOARD-*.md` first: it
names the aha-moment and the ONE activation metric, derived from who stayed. Track that event rather
than naming a second one — two activation metrics is a disagreement nobody decided.

**For an AI product, add what classic analytics misses** (model accuracy ≠ user success) — the few
that matter for *this* product, not all of them:
- **Task Completion Rate** — the AI north star (initiated → successful end state).
- **Edit rate / regeneration** — how much they change the output, how often they retry.
- **Containment** (agentic/support) — resolved without escalation.
- **Cost per *successful* outcome** — pair with `/ai-cost`, spend tied to a good outcome.
- **Frustration Index** — a leading churn signal, and a signal to *fix the product*.
Treat thumbs up/down as a starting point, not truth (self-selected). Wire the loop, don't buy a
platform: traces → evals (`/evals`, `/judge-traces`) → these metrics, joined on the user/session.

**Instrument the cheap, no-lock-in way.** First app: print-logging + a JSONL trace + a spreadsheet
genuinely covers it. Outgrown eyeballing: one tool, free tier — PostHog-class (analytics + flags + LLM
analytics + replay in one SDK) for a technical/AI founder; a privacy-first aggregate tool
(Plausible/Fathom/Matomo) if that's enough; an OSS LLM-trace tool (Langfuse/Phoenix) for the inner loop.
Emit OTel-shaped traces so you can switch backends without re-instrumenting.

Write `docs/measure/MEASURE-<date>.md`: the one activation metric, the one retention curve, the 5–10
events, the AI metrics chosen (and why the others were skipped), the tool + why. **Then stop** — a
curve needs weeks of data before Step 2 means anything.

## Steps 2–4 — the verdict and the diagnosis (a reading run)

When `docs/measure/` already holds the setup and the curve has weeks of data behind it, open [`verdict.md`](verdict.md) and follow it.

## The humane line (PRINCIPLE #6)

- **Fit is measured on user *success*, not engagement.** The 40% matters precisely because losing it
  would *hurt* them. A high-DAU product people can't quit is not PMF; it might be a hook.
- **A user who succeeded and left is a win.** Don't pathologize a healthy exit into "churn."
- **Resurrection is an invitation, never a winback dark pattern.** (The exit rows in full:
  `boss craft deceptive-patterns --surface cancel-and-delete`.) *"Here's what's new, come see if
  it's useful now"* is fine; guilt-trips, fake scarcity, confirmshaming the cancel and roach-motel
  cancellation are refused by name (`boss craft ai-ux-patterns`).
- **Don't scale a thing that isn't yet helping people.** Scaling before fit multiplies a product that
  doesn't work across more lives. The pre-PMF default is a humane guard, not only a financial one.
- **Do the involuntary-churn fix wholeheartedly** — the one move that's pure gain for both sides.
- **Measure graduation and task-success, never engagement, DAU or time-in-app as a goal** — and
  **measure the product, don't surveil the human**: aggregate, privacy-first, PII discipline. The
  Frustration Index is legitimate only *because it helps the user*.

## Output

The setup run writes `docs/measure/MEASURE-<date>.md` (Step 1) and stops. A reading run writes one
short `docs/health/HEALTH-<date>.md`: the user count and the n-gate call, the three-lens read
(the 40% or its interview proxy, the curve shape, the honest pull/push answer), the **verdict**
(pre/at/post + which role-ladder job that puts you in), the **diagnosis** if the curve is sagging
(top / middle / wallet), and the **one next move**. If the signal is real it's `observed-behavior`
(or `commitment`) EVID — record it via `/evidence`. **A verdict, dated. Re-run when the inputs have
genuinely moved, not on a schedule.**

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: define fit in one plain line — *"do the people who tried it
  actually need it back?"* At n<10, plant the seam and send them to `/interview`. Teach, don't grade.
- `vibe-virtuoso`: the sharp cut — 50 shipped things, has any one earned a flattening curve? The
  pull/push lens is the one they can't argue with. Fit, not another launch.
- `returning-founder`: terse; they know the 40% test. The value is the honest default-to-no and the
  role-ladder framing of what premature scaling costs.
- `indie-hacker`: calm-company framing — a durable plateau you can live on beats a rising curve;
  twice-a-year usage can be a real business, priced for it.
- `non-tech-founder`: a no-code analytics install, the activation metric named in business terms;
  plain-language verdict and diagnosis; for involuntary churn, name it "failed
  payments you can recover" and point at the processor's dunning settings (no code).
- `eng-builder`: terse; OTel-shaped traces and the AI-specific metrics; skip the basics.
- `domain-expert` / regulated: privacy-first, aggregate-by-default measurement. Fit includes **safe** fit — a high-stakes workflow isn't at PMF until
  it's reliable enough to trust. Quality-slide is the first suspect for engagement decay; reliability
  *is* retention here.

## Rules
- **Default to pre-PMF.** You earn your way off it; ambiguity resolves to "not yet."
- **Plant the seam first, whatever n is.** `created_at` + a `track()` stub — the timestamp is the one
  piece that cannot be bought back later.
- **Say no at n<10** — the honest output is a conversation, not a number.
- **≤10 events. Refuse analytics theater.** More instrumentation is not more insight.
- **A verdict, never a meter.** No score-over-time dashboard; that's ceremony you'd tend instead of ship.
- **Read what you already hold.** Never a second source of truth; extend `/evals` and `/ai-cost`,
  don't duplicate them.
- **Survey the activated core, not all signups** — the single most common way founders misread the 40%.
- **Fit is when the three lenses agree.** One green light is a hypothesis.
- **Rebase past the AI-tourist wave** before reading any curve.
- **Post-PMF is the only verdict that licenses scaling.** Pre/at, the leader's job stays refused.
- **Feed the roadmap with churn, not the loudest survivor** (the "loud ≠ important" check at `/spec`).
