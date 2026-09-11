---
id: field-stale-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah (IDEA-093 — the product artifacts are write-only)]
also_relevant: [Rob Fitzpatrick (what they do beats what they said, and both have a date on them), Richard Rumelt (a diagnosis that has stopped being true is worse than none)]
entry:
  - exists: { path: docs/competition }
  - quiet_for:
      path_glob: docs/competition/*.md
      days: 90
exit:
  - quiet_for:
      path_glob: docs/competition/*.md
      days: 999999
drift_moment: field-stale
---

# Loop: field-stale (MVP) — the competitive picture has an age, and nobody is reading it

`/comp-eval` builds a genuinely good artifact: every factual cell carries a source URL and a
`checked` date or says `unverified`, every rival gets an honest *why they might win*, and rows past
~90 days **render with their age**.

**The defect is one word: *render*.** That age is shown when the founder re-runs the skill — which is
precisely what a founder who has forgotten the file will not do. So the honesty bar `/comp-eval`
built is real and is only ever seen by someone who already remembered. **A staleness warning that
requires you to remember is not a staleness warning.**

This loop is the reader. It fires once, when the field has gone untouched for a quarter.

## What it actually detects

Nothing clever: `docs/competition/` exists and no file in it has been written to in ~90 days.
Two things follow from the predicate being that dumb, and both are deliberate.

- **It cannot tell a stale rival from a stable market.** Some fields genuinely do not move for a
  year. So the moment asks rather than asserts, and *"nothing changed"* is a complete answer that
  closes it by touching the file — which is also how the honest record of "checked, still true"
  gets written, and that record is worth more than the check.
- **It is an mtime read, so it under-fires.** A fresh clone resets mtimes and this goes quiet. That
  is the same fail-safe direction as `outpaced_by` and `quiet_for`'s other users: a missed nudge
  costs nothing, a false one spends trust.

## Why 90 days, and why that number is the skill's, not this loop's

`/comp-eval` already declared the threshold — *"anything past ~90 days renders with its age.
Competitor pricing moves monthly; a table that hides its own age will get quoted into a pitch six
months late."* This loop does not get an opinion of its own about the number. **It enforces the one
the skill already published**, which is the difference between a boundary and a second opinion.

## What closes it

Touching the field — `/comp-eval recheck`, or adding a rival, or writing *"checked, nothing moved"*
into a row. **Not a full re-survey.** The exit predicate is deliberately unreachable-by-time (it can
only go false, never true, by waiting), which is the runtime's way of saying *the only thing that
closes this is the founder doing something to the file.* A quarter later it opens again.

## The honest limits

- **It watches recency, not accuracy.** A file edited yesterday with a price that was wrong in March
  passes this loop cleanly. Only `/comp-eval recheck` opening the actual page can catch that, and
  that skill's honesty bar — *if you did not open the page, you do not know the price* — is the only
  thing standing between the founder and a confidently invented number.
- **It says nothing about rivals you never found.** `/comp-eval`'s rule 4 asks you to name what you
  did *not* find; a loop reading mtimes cannot see an absence in a list it never had.

## Where it routes

`/comp-eval recheck` (the whole field, or one rival) · `/comp-eval add <name>` if what prompted the
thought was hearing about a new one · the canvas **Problem** cell, which cites this field rather
than duplicating it, and is the place a stale rival does the most damage. `/spec` reads the field
too as of v0.283.0, when the FEAT being written *is* the differentiator — which is the other half of
this artifact finally being read by something.
