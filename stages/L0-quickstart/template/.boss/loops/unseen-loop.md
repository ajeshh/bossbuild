---
id: unseen-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ajesh Shah ("done is a threshold — where the work is met by someone else")]
also_relevant: [Martin Fowler (YAGNI — the cost of carry), Kent Beck (functionality you didn't ask for is the sign the agent is off track), Shreyas Doshi (attached to, and shackled by, everything you build), Ryan Singer / Basecamp (Shape Up — the circuit breaker)]
entry:
  - count_at_least:
      path_glob: $source
      pattern: '^'
      min: 1500
  - count_at_most:
      path_glob: docs/evidence/EVID-*.md
      pattern: '^---'
      max: 0
exit:
  - count_at_least:
      path_glob: docs/evidence/EVID-*.md
      pattern: '^---'
      min: 1
drift_moment: focus
---

# Loop: unseen (Quickstart) — a lot built, nobody outside has seen it

**The build has outrun the evidence.** AI makes a line of code nearly free to write and
exactly as expensive to own. The founder this exists for asked for a small prototype to get
feedback, got ten half-built features, and reported progress as a count. They wrote no specs, no
canvas and no devlog, so every guard keyed on records (`focus-loop`, `drift-loop`, `spec-loop`,
`verification-loop`) stayed silent for exactly the case it exists for.

This loop reads the **build itself**, not the paperwork. Its twin, `unseen-since-loop`, covers the
founder who has heard from someone before and has built a lot since.

## What it watches

**Entry**: about 1,500 lines of the founder's own code (`$source`, counted by line starts), and
**no evidence record at all** in `docs/evidence/`. 1,500 sits well above a fresh scaffold (a
starter app is a few hundred lines) and well below ten features. It is a guess to tune on real
trees; the model judges what is behind it.

**Exit**: one evidence record exists. Showing it to a person and writing down what happened (`/evidence`)
is what closes it. Then `unseen-since-loop` takes over.

## Why it is judgment-gated

Lines say nothing about whether this is one thing deepening or ten things started. A founder
polishing one flow end to end is not the problem; one who has started many and finished none,
with nobody outside having seen any of it, is. So the moment reads only the source tree's shape
and recent history, and stays silent when the work is one thing getting deeper. It also cannot
know whether the founder has shown it to someone and not written it down, so it asks; it never
asserts.

## What it says (the frame composes the voice)

*Done is a threshold, not a finish line*: the point where the work is met by someone else. The
question is **who has seen it**, not *does it move a metric*. It names the count plainly, names the
true cost (each thing is one more to keep working: time, attention, the people waiting on you),
and offers four doors: show the smallest working thing to one person (`/interview` to pick who),
throw it away or restart (cheap now), park the rest, or, if someone already saw it, `/evidence` to
record it. Never blocks. Once per session.

## Fails quiet

Code outside the `$source` globs is blind (configurable in `.boss/config.json`). A source file over
512 KB is skipped. The `$source` walk is capped at 1,500 files.
