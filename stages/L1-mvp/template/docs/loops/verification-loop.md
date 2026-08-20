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

## Exit artifact

`.boss/smoke.json` — the one command that answers *"is the app alive right now?"*, recorded once by
`/smoke`. That is a deliberately **low** bar. This loop is not asking for coverage or a suite; it is
asking whether **anything at all** can tell the founder the thing they shipped still works. The
deeper question (are these tests any good?) belongs to the judgment below, not to the predicate.

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
- The smoke command starts passing while the app is visibly broken — the worst case, and the reason
  `/smoke`'s own rule is *"if smoke is intermittent, fix the smoke; being trustworthy is its one job"*

## What this loop deliberately does NOT do

- **It does not fix anything.** `/smoke` already states the stance: surface it, let the founder or
  `tester` decide. Self-healing *infrastructure* (retry, reseed, restart a flaky harness) is fine;
  self-healing *assertions* is BOSS automating its own named failure mode.
- **It never mentions coverage.** A percentage rewards testing the easy half.
- **It does not fire at Quickstart.** Nothing has shipped; there is nothing to regress.
