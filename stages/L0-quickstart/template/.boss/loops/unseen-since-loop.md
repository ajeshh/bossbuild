---
id: unseen-since-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ajesh Shah ("done is a threshold — where the work is met by someone else")]
also_relevant: [Teresa Torres (continuous discovery — contact with customers as a standing rhythm), Martin Fowler (YAGNI — the cost of carry), Ryan Singer / Basecamp (Shape Up — no extension by default)]
entry:
  - outpaced_by:
      path_glob: $source
      behind: docs/evidence/EVID-*.md
      min: 6
exit:
  - outpaced_by:
      path_glob: docs/evidence/EVID-*.md
      behind: $source
      min: 1
drift_moment: focus
---

# Loop: unseen since (Quickstart) — a lot built since anyone last saw it

The twin of `unseen-loop`. That one fires when nobody outside has ever seen the work;
this one fires when someone has, and the build has since run on without anyone else seeing it.

## What it watches

**Entry**: six or more of the founder's own source files (`$source`) changed after the newest
evidence record in `docs/evidence/`. `outpaced_by` is a relation between two dates, not an age
guess: the code moved after the last time a person was heard from. Six is a guess to tune; the
unit is files, not features, so the model judges what is behind it.

**Exit**: an evidence record newer than the newest source change. Writing down what someone
did with the latest work closes it. (So does the code standing still; the entry stops holding.)

## Why it is judgment-gated, and what it says

The same as `unseen-loop`: files changed say nothing about whether this is one thing deepening or
many things started, so the model reads the shape of the recent work before saying a word, asks
rather than asserts whether someone has seen it, and stays silent when the work is one thing
getting deeper. The frame names the count, the true cost, and the four doors (show it, throw away
or restart, park it, or `/evidence` if someone already saw it).

## Fails quiet

A fresh clone resets modification times, so everything looks the same age and this under-fires.
Code outside the `$source` globs is not counted. Under-firing is the right direction: a missed
nudge costs nothing, a false one spends trust.
