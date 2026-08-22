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
      path_glob: docs/devlog.md, .git/logs/HEAD
      days: 45
exit:
  - outpaced_by:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      behind: docs/devlog.md
      min: 1
drift_moment: sustaining
---

# Loop: sustaining (Quickstart)

**The only loop in BOSS that watches for silence, and the only one whose subject is the
arrangement rather than the product.**

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

## Why it can only fire when you're here

The conscience is a hook. **It only runs while the founder is here** — nothing observes them while
they are away. So this never fires *at* an absent person. It fires when they **come back**, which is
both the only observable moment and the only kind one. That is a property of the architecture, not a
promise in the copy.

## What it watches

**Entry** — a devlog exists (real work happened), the canvas has a Business Model cell, and
**neither the devlog nor the repository** has moved in **45 days**. Forty-five, not twenty-one:
three weeks is a holiday, six is a pattern.

> 🔴 **Watch the repo, not the diary — and this was shipped wrong for one release.** v0.206.0 keyed
> `quiet_for` on `docs/devlog.md` alone. A founder who commits most weekends and writes a devlog
> entry twice a year would have been told they had gone quiet **while they were working**, which
> does not read as a tool being tactless — it reads as a tool that **cannot see the project**, and
> that costs the whole install rather than the one moment. Found by the `indie-hacker` persona on
> the pre-ship read, v0.208.0. The sensor is now the newest of the devlog **or** `.git/logs/HEAD`,
> which the reflog touches on every commit. Stack-neutral (Principle 4) — no `src/` glob, because
> BOSS assumes no layout; git activity catches every stack at once. A project with no git falls
> back to the devlog alone, which is the old behaviour and correct for that case.
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

⛔ **It never remarks on the absence, and never states how long it was.** No "welcome back", no "it's
been a while", no asking where you went — and no sympathy for a reason it invented, because 45 days
of a new baby and 45 days in the sun look identical from here. It picks the conversation up
mid-sentence and talks about the sentence you wrote, not the time that passed. An elapsed-time figure
is a streak wearing a coat.

⛔ **Once ever, not once per session.** It checks `.boss/conscience-log.jsonl` before speaking. A
moment that greets you every time you open a quiet project is one you will mute, and you would be
right to.

⛔ **Three ways forward, and it argues for none of them.** Rewrite the answer so it is true again
(`/canvas`). End it on purpose (`/sunset`). **Or change nothing at all** — dormant is a real answer
and often the right one, and it has to be said out loud: a founder who does not know they may decline
will invent an answer to satisfy the tool, and **an invented canvas answer is worse than a stale
one.** Never suggest the ending first, never tack it on last as the resigned option — and **never
defend any of them.** Arguing that a door isn't a failure is how you tell someone it looks like one.

⛔ **The bus factor is never raised as a criticism.** *"Nobody else could carry this"* is the ordinary
condition of almost every good small project.
