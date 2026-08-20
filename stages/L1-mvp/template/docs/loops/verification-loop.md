---
id: verification-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Hamel Husain, Andrej Karpathy]
also_relevant: [Shreya Shankar, Kent Beck]
entry:
  - count_at_least:
      path_glob: docs/ideas/FEAT-*.md
      pattern: '^status:\s*(shipped|done)'
      min: 1
  - count_at_least:
      path_glob: src/**
      pattern: '\S'
      min: 1
exit:
  - exists: { path: .boss/smoke.json }
  - any_file_matches:
      path_glob: docs/red-team/RT-*.md
      pattern: 'Negative path'
    when:
      - any_file_matches:
          path_glob: docs/ideas/FEAT-*.md
          pattern: 'status:\s*(shipped|done)[\s\S]*^-\s*\*\*Negative path:\*\*\s*\S'
drift_moment: unverified
---

# Loop: verification (MVP)

The moment a founder has **shipped something real and has no way to find out it broke.** Entry is
deliberately `focus-loop`'s exit predicate — *at least one FEAT reached `shipped`* — plus real source
on disk. So the chain reads: canvas → spec → build → **ship one thing** → *and now, what tells you
it's still alive?*

`runner_type: hook` because this one **has to be unprompted.** Every other verification surface BOSS
owns (`/smoke`, `/evals`, `/red-team`, the `tester` agent) fires only when the founder already
remembers to ask — and a founder who remembers to ask about verification is not the founder this
moment exists for.

## Why this loop exists at all

BOSS ships fourteen conscience loops and, until this one, **none of them was about testing** — in a
tool whose own practice says *agents rewrite assertions to match broken behaviour.* The domain where
an AI agent most reliably fools the person it's working for was the one domain the conscience never
spoke about. `tester` holds the sharpest line in the product and it only ever fires on request.

## Entry artifact

A FEAT marked `shipped`/`done`, **and** a non-empty `src/`. Both halves matter: a shipped spec with
no code is a planning artifact, and code with no shipped FEAT is a prototype. Neither has earned this
question yet (PRINCIPLE #2 — a Quickstart sketch gets silence).

## Exit artifacts — one unconditional, one that only exists for projects that earned it

**1. `.boss/smoke.json`** — the one command that answers *"is the app alive right now?"*, recorded
once by `/smoke`. That is a deliberately **low** bar. This loop is not asking for coverage or a
suite; it is asking whether **anything at all** can tell the founder the thing they shipped still
works. The deeper question (are these tests any good?) belongs to the judgment below, not to the
predicate.

**2. A negative-path result in `docs/red-team/RT-*.md` — guarded, and silent unless the founder
themselves said this feature has one.** Smoke is rung 1 of the six-rung ladder in
`boss craft testing-with-agents`. Recording one smoke command used to close this loop
permanently, which meant **the conscience went quiet exactly where the real gap starts** — rungs 2–4
(money path, destructive path, negative path) had no verb at all, so there was nowhere higher to
point. Now they do, and this is the one rung the practice calls **non-negotiable**: *"can user A
reach user B's data?"* — the headline vibe-coded breach class (`ship-it-live`, `data-schema`).

The guard is what keeps this from becoming a nag. The predicate carries a `when:` clause that reads
the project's own FEATs: it applies **only if a FEAT that has actually shipped names a negative
path** — the line `/spec` writes when the founder answers *who must NOT be able to see this?* with
something other than "nobody, it's single-user." Both halves are load-bearing, and the shipped half
mirrors the entry predicate's own logic: a negative path on a FEAT still in `building` is a plan, the
same way a shipped spec with no code is a plan. **Nothing is exposed until it ships.** So:

- **A static site, a solo tool, a demo with no user data** — no FEAT names a negative path, the
  guard is unmet, the predicate is vacuously satisfied, and one smoke command still closes the loop.
  Byte-identical to the behaviour before this existed.
- **An app where the founder said there is data one user must not see** — the bar is now rung 4, and
  it stays open until there is *evidence*, not an intention. `/red-team --paths` records it.

**The bar rises because the founder described a risk, not because BOSS decided they were ready.**
That distinction is the whole reason this is a guard on the exit rather than a third entry
predicate: an entry predicate would have closed the loop for every project the rung doesn't apply to.

## Drift

`entry` satisfied AND `exit` not satisfied → **moment `unverified`** fires from the hook.

The predicate is only the gate. The frame carries the judgment it can't make: read the shipped FEAT's
acceptance criteria and whatever test files exist, then decide whether this founder actually has
verification under another name — a `npm test`, a CI job, a `Makefile` target. **If they do, the gap
is BOSS's blindness, not their discipline**, and the honest move is to say so and offer to record it,
not to nag. And if tests *do* exist, the sharper read is the one `tester` owns: were they written
against the spec, or against whatever the code already did?

## How to remix

- **Skip:** entirely legitimate. A throwaway, a demo that ships once, a project where the founder
  verifies by hand every time and knows it. Override grammar:
  ```
  - **OVERRIDE:** proceeded without `verification-loop` — rationale: <how you actually
    know it works>; blast radius if it breaks silently is <X>.
  ```
  Naming the blast radius is the point of the override — that's the question the loop is really
  asking, and a founder who can answer it has done the thinking.
- **Swap discipline:** Beck-style test-first, Husain-style evals-as-spec for AI-mediated work, or a
  hand-run checklist. Same loop shape (*something answers "is it alive"*); different practice inside.
- **Author your own:** a domain-specific verification loop — for a regulated product, an
  audit-trail-exists loop with a much higher bar than one smoke command.

## When this loop re-opens

- `.boss/smoke.json` is deleted or the recorded command stops being run
- A new FEAT ships that the existing smoke command doesn't touch at all
- **A FEAT names a negative path for the first time** — the moment the founder writes down that some
  data belongs to one user and not another, rung 4 turns on and this loop re-opens until there's a
  result to point at. This is the loop's only *upward* re-open: everything else here is a regression
- The smoke command starts passing while the app is visibly broken — the worst case, and the reason
  `/smoke`'s own rule is *"if smoke is intermittent, fix the smoke; being trustworthy is its one job"*

## What this loop deliberately does NOT do

- **It does not fix anything.** `/smoke` already states the stance: surface it, let the founder or
  `tester` decide. Self-healing *infrastructure* (retry, reseed, restart a flaky harness) is fine;
  self-healing *assertions* is BOSS automating its own named failure mode.
- **It never mentions coverage.** A percentage rewards testing the easy half.
- **It does not fire at Quickstart.** Nothing has shipped; there is nothing to regress.
- **It does not decide that a project needs rung 4.** The guard reads what the *founder* wrote in a
  FEAT. BOSS never infers "you probably have user data, so" — an inferred bar is a nag, and a nag is
  how a conscience earns being muted. If they never name a negative path, this rung never speaks.
