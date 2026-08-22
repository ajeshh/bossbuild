---
id: sustaining-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ajesh Shah]
entry:
  - exists:
      path: docs/devlog.md
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      pattern: 'Business Model'
  - quiet_for:
      path_glob: docs/devlog.md
      days: 45
exit:
  - outpaced_by:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      behind: docs/devlog.md
      min: 1
drift_moment: sustaining
---

# Loop: sustaining (Quickstart)

**The only loop in BOSS that watches for silence, and the only one whose subject is the person
rather than the product.**

## The asymmetry it closes

[[DEC-009]] gave the canvas's Business Model cell a **second branch** for projects that are not
trying to earn — *what keeps this alive · who else could carry it · what happens when you get bored,
busy, or hit by a bus · what would make you stop* — on the grounds that **most open-source projects
die of maintainer exhaustion, not of a missing business model.**

The cell asks it. Nothing watched it. Meanwhile the *commercial* half of the same cell is watched
continuously — `drift` on the named bet, `margin-trap` on price against cost, `outpaced` on the canvas
falling behind shipped work, `cost` and `cost-stale` on spend. **The canvas asked both halves and the
conscience watched one**, which quietly made BOSS a tool for one kind of project while [[DEC-011]] and
[[DEC-012]] claimed otherwise.

## Why it needed a new predicate

The four existing predicates are all relations between two files. `outpaced_by` is temporal, but it
detects **presence** — N files newer than an artifact. The commons half is falsified by **absence**: a
maintainer running out of road does not ship three FEATs, they go quiet. **Silence cannot be written
as a relation between two files**, so `quiet_for` is the fifth member of a deliberately closed set,
and the first absolute-time one.

## Why it is not cruel, structurally

The conscience is a hook. **It only runs while the founder is here** — nothing observes them while
they are away. So this never fires *at* an absent person. It fires when they **come back**, which is
both the only observable moment and the only kind one. That is a property of the architecture, not a
promise in the copy.

## What it watches

**Entry** — a devlog exists (real work happened), the canvas has a Business Model cell, and the
devlog has not moved in **45 days**. Forty-five, not twenty-one: three weeks is a holiday, six is a
pattern.
**Exit** — the canvas is newer than the devlog. They came back and revisited the answer rather than
only resuming work. (Resuming work alone also closes the loop — it fails the entry.)

## Why the moment is judgment-gated

**The predicate counts days and knows nothing about why.** A baby, a job, an illness, or a fortnight
in the sun all look identical to `mtime`. So `sustaining` is in `JUDGE_MOMENTS` and the bar for
speaking is the highest of any moment: the model reads only the Business Model cell and the last few
devlog entries, and **stays silent unless the project is sustained by someone's own hours** *and*
either a stated stopping condition has actually fired or the stated arrangement has plainly become
untrue.

## The line it holds

⛔ **It is not a productivity nudge and must never sound like one.** No streaks, no "let's get back on
track", no encouragement-shaped scolding. A gap is data, not a verdict — and it is the most
*predicted* thing about this kind of project.

⛔ **Two doors, weighted equally.** Revise the answer to what is actually true (*"a weekend a month"*
beats *"indefinitely"*, and writing it down is a win) → `/canvas`. Or end it on purpose → `/sunset`,
which frames an ending as an experiment that returned an answer. **Never suggest the second first,
and never imply it is the disappointing one.**

⛔ **The bus factor is never raised as a criticism.** *"Nobody else could carry this"* is the ordinary
condition of almost every good small project.
