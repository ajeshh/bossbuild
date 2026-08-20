---
id: PRACTICE-seed-to-scale
type: practice
owner: pm
status: active
host: stack-neutral
provenance: generalized 2026-08-20 from the one place BOSS had already solved it — the "But leave the seam" section of analytics-for-ai-products.md (v0.176.0), which named a history seam and a call seam for measurement and stopped there. The same shape was already live in three other places and never named as one thing: data-schema.md's one-way doors (a `created_at` you cannot backfill), design-tokens-loop (the tokens file that gets exponentially more expensive per screen), and /design-tokens-init's "refactor one existing component so you see the pattern." The existing-artifact half comes from the v0.177.0 finding that `boss sync` distributes FILES and never asks whether the founder already built the THING — /landing read BRAND.md, tokens and the canvas (its inputs) and never looked for a landing page. Pairs with modes (PRINCIPLES #2), analytics-for-ai-products.md, data-schema.md.
last_reviewed: 2026-08-20
review_by: 2027-08-20
curve: craft
---

# Practice — Seed to scale: does it exist, what rung is it on, and what seam does it leave?

A capability almost never meets an empty project. It meets a founder who is somewhere on a ladder,
who may already have a version of the thing, and who is about to be handed either too much ceremony
or a "not yet" that quietly costs them something they can't get back.

Three questions, in this order, every time. They are cheap; skipping them is what isn't.

## 1. Does it already exist?

**Look for the artifact before generating one.** Not the inputs — the *output*. A landing page, a
tokens file, a deploy config, a privacy policy, a smoke command. The founder who arrived with a repo
(most of them) has some of these, and generating a second one is the single most disrespectful thing
a build tool can do: it says *what you already built doesn't count*.

Four honest answers, and only one of them is "generate":

- **Nothing there** → generate. The normal path.
- **It exists and it's fine** → say so and leave it. *"You've got a landing page at `app/page.tsx`.
  I read it — it does the job. Nothing to do here."* This is a complete and successful outcome.
- **It exists and it's behind** → name the specific gap, offer the specific edit. Not *"want me to
  regenerate it?"* — that's the same disrespect wearing a question mark. *"Your page has no
  `og:image`, so it renders as a bare grey URL when anyone pastes it. Four tags. Want them?"*
- **It exists under another name** → then the gap is BOSS's blindness, not their discipline. Say that.
  A founder with a `Makefile` target called `verify` has a smoke gate; the tool just couldn't see it.

> The failure this prevents is not cosmetic. A capability that can't see existing work can only ever
> be run once, safely, on a fresh project — which means every improvement BOSS ever makes to it is
> unreachable by everyone who already used it.

## 2. What rung is this project on, and what rung does this belong to?

The ladder is Quickstart → MVP → V1 → Scale, and **a practice has a rung too**. Compare them:

- **At its rung** → run it. This is what JIT means.
- **Below its rung** (they're earlier than the practice) → **don't run it.** Go to question 3.
- **Above its rung** (they're further along than the practice assumes) → run it, and drop the 101.
  A project with real users doesn't need the *why measurement matters* preamble.

The mode a project is *installed* at and the rung its *work* is at are different numbers, and the
gap is information. `boss adopt` caps its guess at MVP deliberately, so a real repo often reads
ahead of its mode. Read the work, not the label.

**The expensive direction is over-shooting.** Ceremony added is ceremony that stays, and a founder
who is handed V1 discipline at Quickstart doesn't conclude "wrong rung," they conclude "this tool is
heavy." The tie goes to less.

## 3. If it's above their rung — what's the seam?

This is the half that makes the "not yet" honest, and it is the whole reason this practice exists.

**A seam is the cheapest thing you can do now that you cannot do later.** Not a smaller version of
the practice. Not "the basics." The specific one-way door that closes quietly if nobody names it.

The test, and it is a single question:

> **If they skip this entirely and come back in six months, what is *gone* — versus merely
> *undone*?**

*Undone* is fine. Undone is what "not yet" means, and most work is undone: a privacy policy, a
runbook, an onboarding flow, a design library. You write those on the day you need them and pay the
same price you'd have paid earlier.

*Gone* is different. Gone is the months of history a missing `created_at` column can't reconstruct.
Gone is the failing model output you deleted, which was going to be eval case #1. Gone is the API
key that's in git history now, and stays there after you move it to `.env`. Gone is the person who
visited your page before you had a way to reach them.

**When something is gone, name it, and plant only the thing that stops it going.**

### The seam is not a smaller feature

The failure mode here is real and it runs in exactly one direction: "leave a seam" becomes a licence
to add a little bit of everything, everywhere, and the JIT boundary dies of a thousand small
exceptions. The guard is that a seam is *structurally* smaller than the practice, not just lighter:

| Practice | The seam | Not the seam |
|---|---|---|
| Analytics | a `created_at` column, a `track()` stub | an event taxonomy, a tool account, a dashboard |
| Evals | keep the failing outputs in a folder | an eval harness, a judge, a CI gate |
| Cost discipline | log what each call cost | a budget doc, a review cadence, alerts |
| Secrets / deploy | env vars from commit one | a host, a pipeline, a rollback runbook |
| Tokens / design | name the first color semantically | a three-layer token system, a component library |
| Trust / privacy | don't collect what no feature reads | a policy, ToS, a subprocessor list, a trust page |

Read the right column: every entry is the practice itself. If your proposed seam needs a document,
a decision, a dependency, or a name for something that doesn't exist yet, it's the practice, and
you've crossed back over. **A seam is a column, a stub, a folder, or a habit.** If it's bigger than
that, it isn't one.

### Sometimes there is no seam, and saying so is the point

Not every practice has a one-way door, and inventing one to seem helpful is how a JIT tool becomes a
checklist. Incident response has no seam worth planting at MVP beyond *keep timestamped error logs*
— the runbook genuinely costs the same written later. A design library costs the same at V1 as it
would have at MVP, minus the components you hadn't built yet.

**"Nothing to do here, and here's why nothing is the right answer"** is a first-class outcome, and
it buys more trust than a seam nobody needed. Record the `null` honestly. A practice whose seam
column is empty is not an unfinished practice.

## The ongoing half — this is not a one-time check

The three questions are asked at three different moments, and only the first is obvious:

**At generation time** — a skill runs, and asks all three before writing anything.

**When the practice moves** — BOSS improves `/landing`, and a founder who already *has* a landing
page should hear about it. This is the one that gets forgotten, because distribution mechanisms
naturally compare *file to file* and stop there. A sync that reports *"the landing skill changed by
40 lines"* has told the founder nothing; a sync that reports *"the share-card section is new, and
you have a page"* has told them the only thing that matters. **The unit of an update is the
artifact, not the file.**

The bar is high on purpose, and it's the same bar as the CHANGELOG's `> **For you:**` line: mention
it only when the change would alter something already built. Re-running a generator over a page that
converts is churn, and churn dressed as an update is worse than silence.

**When BOSS builds something new** — every new capability answers the three questions at authoring
time, or it ships as another thing that only works once, on a fresh project, for a founder who
doesn't exist yet. This is a gate, not a habit: BOSS's own build fails if a capability that produces
a durable artifact can't say what it produces, what rung it's on, and what seam it leaves.

## Altitude / JIT

This practice is *how* every other practice arrives, so it is never a step the founder runs. It
fires inside other skills (their step 0), inside `boss sync` (artifact-aware reporting), and inside
BOSS's own authoring gate. If a founder ever sees a message that says "seed to scale," something has
leaked.

## The test

*Point the capability at a project that already has the thing, at the wrong rung. Does it notice, and
does it say what's actually missing?*

If it generates a second one, it fails. If it says "not yet" and walks away from a door that's
closing, it fails. If it plants a whole practice and calls it a seam, it fails.
