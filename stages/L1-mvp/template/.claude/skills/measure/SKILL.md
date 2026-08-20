---
name: measure
description: The post-ship counterpart to /pretotype. /pretotype asks "will anyone want this?" BEFORE you build; /measure asks "given they're using it, is it working and are they staying?" AFTER you ship. Picks ONE activation metric + ONE retention curve, names 5-10 events max (kills analytics theater), defaults to the free/OSS/no-lock-in path, and for an AI product adds the metrics that classic analytics misses (task-completion, edit rate, cost-per-successful-outcome). Humane by construction — measures graduation/loop-closure, NOT engagement/DAU. At n<10 its honest output is "close this, go talk to your users" — but never empty-handed: it leaves the SEAM (a `created_at` on user + core rows, and one `track()` stub), because you can add a tracking call any day and you can never add the past. Usage - /measure
---

# /measure — is the shipped thing working, and are they staying?

The post-ship half of validation. Full judgment: `boss craft analytics-for-ai-products`. This is a
runner with a spine of restraint — its main job is to stop a founder from instrumenting 200 events and analyzing
none.

## Step 0 — the JIT gate (say no when the answer is no)

**First, look for what's already there.** A `posthog-js` / `plausible` / `@vercel/analytics` / `mixpanel`
dependency, a `track(` call in `src/`, a `created_at` column in the schema. A project that arrived with
analytics does not need them installed again — read what it already collects and work from that. If the
seam below is already planted, say so; that is a complete outcome.

Check the real user count (ask, or read `/ship` context / the EVID ledger). **If fewer than ~10 real users,
the correct output is: close this and go talk to them.** Analytics on ten users is noise; a conversation isn't.
Do not instrument. Point at `/interview`. Instrument only at roughly **n≥30–50** — when you can no longer eyeball
every session by hand.

**But don't leave empty-handed — check the seam before you close.** Saying "not yet" is only honest if
starting later is cheap, and one half of it *cannot be bought back*:

- **`created_at` on user rows and core object rows.** You can add a tracking call any day; you cannot add the
  past. With timestamps you can reconstruct cohorts and a retention curve for the months *before* anyone
  thought about analytics — without them, the day you finally measure is day zero. Missing? That's a one-line
  migration now, and the single highest-value thing this skill can hand a founder at n<10.
- **One `track(event, props)` stub** that console-logs or no-ops. Turns "adopt a tool later" into implementing
  one function instead of editing forty call sites.

That's the whole seam: **a timestamp column and a stub function.** If you find yourself naming events or
designing an `events` table, stop — that's the instrumentation step 0 just refused.

## Step 1 — pick ONE activation metric + ONE retention curve

Not a dashboard. One activation event (the moment a user first gets the core value — name it in the product's
terms, e.g. "sent first summary," "shipped first page") and one retention curve (do they come back — D1/D7/D30
or weekly, whichever matches the use). **5–10 events maximum**, each tied to activation or retention. Anything
else is analytics theater — refuse it, and say why.

If the retention curve you read is **decaying** (a cohort coming back less than the last, no plateau forming),
that's not a measurement job anymore — point at **`/health`**, which diagnoses *where* the curve dies (activation
/ engagement / involuntary) and routes to the one real fix. `/measure` reads the curve; `/health` fixes it.

## Step 2 — for an AI product, add what classic analytics misses

If the product is AI-mediated, plain funnels miss the truth (**model accuracy ≠ user success**). Add the few
that matter for *this* product (not all of them):
- **Task Completion Rate** — the AI north star (initiated → successful end state).
- **Edit rate / regeneration** — how much they change the output, how often they retry (dissatisfaction).
- **Containment** (agentic/support) — resolved without escalation.
- **Cost per *successful* outcome** — pair with `/ai-cost` (spend tied to a good outcome, not raw request cost).
- **Frustration Index** — rising frustration ≈ a leading churn signal (and a signal to *fix the product*).
Treat thumbs up/down as a starting point, not truth (self-selected).

Wire the loop, don't buy a platform: **traces → evals (`/evals`, `/judge-traces`) → these product metrics**,
joined on the user/session. Online evals = shadow-score a *sample* of live traffic, alert on drift, curate
failing traces back into the eval set.

## Step 3 — instrument the cheap, no-lock-in way

- **First app:** print-logging + a JSONL trace + a spreadsheet genuinely covers it. That *is* the practice.
- **When you outgrow eyeballing:** one tool, free tier — **PostHog** (analytics + flags + LLM analytics + session
  replay in one SDK) is the JIT-right pick for a technical/AI founder; **Plausible/Fathom/Matomo** if privacy-first
  aggregate is enough; **Langfuse/Phoenix** (OSS) for a dedicated LLM inner loop. Emit OTel-shaped traces so you
  can switch backends later without re-instrumenting.

## Step 4 — the humane line (measure success, not attention)

- **Measure graduation / task-success / loop-closure — NOT engagement, DAU, or time-in-app.** A humane product
  wants the user to *succeed and leave*, not to stay. Engagement-as-goal is the surveillance failure mode.
- **Measure the product, don't surveil the human** — aggregate/privacy-first; PII discipline. (The `/judge-traces`
  contract: the work leaves an honest trace; read the trace, don't instrument the person.)
- The Frustration Index is legitimate only *because it helps the user* (fix the struggle) — never to manipulate
  retention.

## Output

A short `docs/measure/MEASURE-<date>.md`: the one activation metric, the one retention curve, the 5–10 events,
the AI metrics chosen (and why the others were skipped), the tool + why, and the humane note. Post-ship
retention is `observed-behavior` / `commitment` **EVID** — record the real signal as an `/evidence` entry.

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: if n<10, *do not* instrument — send them to `/interview`. Otherwise one
  metric, plain language.
- `non-tech-founder`: PostHog/Plausible, no-code install; name the one activation metric in business terms.
- `eng-builder` / `returning-founder`: terse; OTel-shaped traces + the AI-specific metrics; skip the basics.
- `domain-expert` / regulated: privacy-first + aggregate by default; PII discipline is non-negotiable.

## Rules
- **Say no at n<10.** The honest output is a conversation, not a dashboard.
- **Say no — but leave the seam.** `created_at` + a `track()` stub, nothing more. The timestamp is the one
  piece that cannot be bought back later; refusing instrumentation without it costs the founder their history.
- **≤10 events. Refuse analytics theater.** More instrumentation is not more insight.
- **Measure success/graduation, never engagement-as-goal.** Humane by construction.
- **Extend `/evals` + `/ai-cost`, don't duplicate them.** Online/product metrics are the missing half, not a new silo.
