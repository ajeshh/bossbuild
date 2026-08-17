---
name: onboard
description: Design the path from signup to the aha-moment — the highest-leverage number in the funnel (activation > acquisition; fix it and every downstream cohort lifts at once). Derives the aha-moment from data (the behavior that separates your best-retained cohort from the churned — not a whiteboard guess), shrinks time-to-value (cut every step between signup and first value; seed a "magic first run" so the first output is good before the user works), and sets up concierge onboarding you do BY HAND for the first users (Superhuman-style; do-things-that-don't-scale — it doubles as /interview). Humane by construction — activation means getting them to SUCCESS fast, not HOOKED fast; refuses fake-progress/gamified/forced-tutorial dark patterns. The top-of-curve fix /retain routes to. At n<10, don't model it — watch them onboard by hand. Usage - /onboard
---

# /onboard — get new users to the aha-moment, fast (and honestly)

The runner over `boss craft activation`. Activation is the **first-session success rate** — the % of
new users who reach real value — and it's the highest-leverage number you have, because it's the *top of the
retention curve*. This is the fix `/retain` routes to when the curve dies at the D0→D1 cliff.

## Step 0 — the JIT gate

Read the new-user count (`/measure`, `/ship` context, the EVID ledger).
- **n<10 → don't model an activation funnel. Watch them onboard one at a time, by hand** (that hand-watching IS
  the practice — Step 3). Point at `/interview`.
- **n≥~30 (a readable activation rate) → proceed** — you can see what fraction reach value and derive the aha.

## Step 1 — derive the aha-moment from data (don't guess it)

The **aha-moment** is the first action that reliably predicts retention. Derive it, don't whiteboard it
(Bangaly Kaba's best-retained-users method): compare your **best-retained cohort** against your **churned**
cohort and find the early behavior that separates them — *what did the retained users do in their first session
that the churned didn't?* That behavior, at that threshold, is the aha. (Facebook's "connect with N friends
early" is the canonical *illustration of the method*, not a number to copy.) **For an AI product the aha is
almost always a first *successful* output the user keeps** — anchor it to `/measure`'s Task-Completion-Rate, not
"they clicked generate."

## Step 2 — shrink time-to-value (TTV)

Map every step between signup and the aha; each one leaks users. Cut fields, defer configuration, pre-fill
sensible defaults, skip the tour, reach value *before* the account if you can. **Name and measure TTV**
(signup → aha) and drive it down — the single most improvable lever. Strong AI default: a **"magic first run"** —
seed the empty state with real sample data or a one-click example so the first output is *good* before the user
has done any work. (The empty state is where activation dies; design it first.)

## Step 3 — concierge onboarding, shamelessly

For the first users, onboard them **by hand** — a call, a shared screen, a manual first-run you do *for* them
(Superhuman did white-glove onboarding for every early user for years; do-things-that-don't-scale — Graham). It's
unscalable on purpose: it's how you *learn* what the automated flow must eventually do, and it doubles as
`/interview` (real users hitting real friction in front of you). **Extract the scalable onboarding *from* the
concierge version — never guess it ahead of the hand-done one.**

## Step 4 — the humane line (success fast, not hooked fast)

- **Onboarding serves the user reaching value, not the metric reaching a number.** The moment you're designing
  steps to lift "activation %" rather than to get the user to their goal, it's manipulation.
- **Refuse the hook-onboarding kit** by name: fake progress bars, gamified "complete your profile" nags, forced
  tutorials that gate the product, streaks/variable-reward bolted onto first-run, guilt at the skip button.
- **The test:** a user who reached what they came for and left satisfied is fully activated, box-ticking or not.

## Output

A short `docs/onboard/ONBOARD-<date>.md`: the **aha-moment** (and the data it was derived from), the current
**TTV** and the steps you're cutting, the **magic-first-run** design (for AI products), and the **concierge
plan** for the next N users. Name the ONE activation metric so `/measure` can track it. First-session success is
`observed-behavior` **EVID** — record it via `/evidence`.

## Cohort-aware
- `first-product` / `vibe-coder-newbie`: define "aha" inline ("the first moment it's actually useful to them").
  If n<10, don't model — watch five people use it and note exactly where they get stuck.
- `non-tech-founder`: business-language — "how fast do they get their first win, and what's in the way?"; the
  concierge step is natural to them (they've onboarded clients by hand before).
- `eng-builder` / `returning-founder`: terse; the best-retained-vs-churned derivation + TTV instrumentation +
  the magic-first-run empty-state pattern; skip the basics.
- `indie-hacker`: calm-company — concierge onboarding as a feature, not a stopgap; personal is the moat.
- `domain-expert` / regulated: the aha must include *safe* first value; don't optimize TTV by skipping the
  step that makes a high-stakes first output trustworthy.

## Rules
- **Say no at n<10** — don't model a funnel; watch them by hand (that's the practice).
- **Derive the aha from data**, best-retained vs churned — never a whiteboard guess.
- **Shrink time-to-value** — every step between signup and the aha is a leak; the magic-first-run kills the
  empty state.
- **Concierge first, automate second** — extract the scalable flow from the hand-done one; it doubles as
  `/interview`.
- **Success fast, not hooked fast.** Refuse fake-progress / gamified / forced-tutorial dark patterns by name.
- **One activation metric**, handed to `/measure`. This is `/retain`'s top-of-curve fix — close that loop.
