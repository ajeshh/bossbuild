---
id: PRACTICE-activation
type: practice
owner: mentor-gtm
status: active
host: stack-neutral
provenance: post-launch program (2026-07-23 SESSION, JOB 1). The gap the map found — BOSS *reads* the activation metric (/measure) but was silent on *designing* activation. Distilled from Casey Winters (activation > acquisition — the highest-leverage retention lever) + Bangaly Kaba (find the behavior that predicts retention — the "best-retained-users" method) + the aha-moment / time-to-value canon (Chamath's magic-moment framing; the Facebook "friends in N days" illustration, treated as illustration not template) + Superhuman (concierge onboarding, do-it-shamelessly) + Paul Graham (do things that don't scale). Pairs with retention.md (activation-failure is its top-of-curve decay), /onboard (the runner), /measure (reads the activation metric), /pmf-check (the 40% test surveys the *activated* core), /interview (concierge onboarding IS talking to your first users). BOSS v0.122.0.
last_reviewed: 2026-07-23
review_by: 2027-01-19
curve: market
---

# Practice — Activation (get them to *success* fast — not *hooked* fast)

> **Where this sits.** `/measure` *reads* an activation metric; this designs the thing being measured, and
> `/onboard` is its runner. The load-bearing idea: **activation is the first-session success rate — the % of new
> users who reach real value — and it's the highest-leverage number in the whole funnel**, because it's the top
> of the retention curve. Fix activation and every downstream cohort lifts at once (Winters: *activation >
> acquisition*). It is **not** signup, and it is **not** "engaged" — it's the moment the user first gets the thing
> they came for.

## First, the JIT boundary

You need enough new users to *read* an activation rate — roughly **n≥30** (a cohort where you can see what
fraction reach value). **At n<10, don't model activation — watch the users onboard, one at a time, by hand**
(that hand-watching *is* the practice — see concierge, below). "Design the activation funnel" on 8 users is
premature ceremony; the honest move is to sit with them.

## Step 1 — find the aha-moment (don't guess it — derive it)

The **aha-moment** is the first action that reliably predicts retention — the point where a user *gets it*. The
mistake is inventing it in a whiteboard. **Derive it from data** (Bangaly Kaba's best-retained-users method):
take your **best-retained cohort** and your **churned cohort**, and find the early behavior that separates them —
what did the retained users *do in their first session* that the churned ones didn't? That behavior, at that
threshold, is your aha. (The canonical illustration is Facebook's "connect with N friends in your first days" —
treat it as an *illustration of the method*, not a number to copy; yours will be specific to your product, e.g.
"sent their first real document," "got one useful answer they kept.") For an AI product the aha is almost always
**a first *successful* output the user actually keeps** — tie it to `/measure`'s Task-Completion-Rate, not to
"they clicked generate."

## Step 2 — shrink time-to-value (TTV)

Once you know the aha, the job is getting the user there **fast** — every step between signup and first value is
a place they leak. Cut fields, defer configuration, pre-fill with sensible defaults, skip the tour, let them
reach value *before* asking for the account if you can. **Measure TTV** (signup → aha) and drive it down; it's
the single most improvable activation lever. For an AI product, a strong default here is a **"magic first run"** —
seed the empty state with real sample data or a one-click example so the first output is *good* before the user
has done any work (the empty-state-is-where-activation-dies rule).

## Step 3 — do concierge onboarding shamelessly

For your first users, **onboard them by hand** — a call, a shared screen, a personal setup, a manual first-run
you do *for* them (Superhuman ran a white-glove onboarding for every early user for years; do-things-that-don't-
scale, Graham). It looks unscalable because it *is* — that's the point: it's how you *learn* what the automated
onboarding must eventually do, and it doubles as `/interview` (you're watching real users hit real friction in
real time). The scalable version is *extracted from* the concierge version, never guessed ahead of it.

## The humane line (PRINCIPLE #6 — the differentiator)

**Activation means getting the user to *success* fast — not *hooked* fast.** This is the exact fork where
onboarding turns dark, so name it:
- **Onboarding serves the user reaching value, not the metric reaching a number.** The moment you're designing
  steps to lift "activation %" rather than to get the user to their goal, you've crossed into manipulation.
- **Refuse the hook-onboarding kit:** fake progress bars, gamified "complete your profile" nags, forced
  multi-step tutorials that gate the product, streaks and variable-reward loops bolted onto first-run, guilt at
  the skip button. These lift a first-week number and are the patterns `ai-ux-patterns.md` catalogs.
- **The honest test:** if the user reached what they came for and *left satisfied*, that's a fully activated
  user even if they didn't tick every onboarding box. Success-and-leave beats hooked-and-stuck.

## Ties + altitude

Silent until a project is live with new users past n<10. Activation-failure is **`/retain`'s top-of-curve
decay** (a D0→D1 cliff routes here — this is that fix); the aha becomes a **`/measure` activation metric**; the
activated cohort is exactly who **`/pmf-check`'s 40% test** must survey; concierge onboarding *is* `/interview`
pointed at your first users. Surfaces via **`/onboard`** (the runner). Real first-session success is
`observed-behavior` **EVID**. Cite: Winters (activation > acquisition), Bangaly Kaba (best-retained-users →
the aha), the aha/TTV canon (illustration not template), Superhuman (concierge), Graham (do things that don't
scale).

## What BOSS refuses here (name it, don't build it)

Gamified/streak onboarding designed to hook rather than help; forced tutorials that gate the product; "complete
your profile" dark-pattern nags; an onboarding *analytics dashboard* (the one activation metric lives in
`/measure`); A/B onboarding tooling (premature for essentially every BOSS founder — concierge + eyeballs beat it
until real volume).
