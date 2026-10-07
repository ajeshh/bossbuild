---
id: IDEA-162
type: idea
kind: capability
owner: product-lead
status: exploring
created: 2026-10-07
proof: test/resume-reading.test.js
relates: IDEA-102, IDEA-153, IDEA-158, IDEA-078, IDEA-120, IDEA-159
gist: Each record carries its own resume point, and RESUME becomes a computed reading of the work in flight — how close each piece is, said in words a fraction can't fake — plus Ajesh's short priority list.
---

# IDEA-162 — Resume lives in the record

Ajesh, 2026-10-07: *"for resume as it gets more complicated, and many features are left uncompleted, im
wondering if there is a resume in the feature/idea/program, and it just points to it. there is a time
stamp and a state of complete, and a way to pick it back up based on what is close to finishing or what
is next. dont solve for just this. lets reassess resume as a whole."* Then, on the first proposal:
*"fraction is deciving, so some how else, lets solve and make it better."*

## What RESUME is today (measured 2026-10-07)

- **17.5 KB, ~4.4k tokens, mostly a second copy.** The ten bullets under *Now* each restate a record's
  state (IDEA-160, PROG-005, IDEA-144, 136, 145, 114, 109, PROG-004, 132, 135). *Held* repeats re-open
  triggers its `deferred` records already carry (IDEA-130, 076, 075, 089). By IDEA-158's one home per
  fact, it is the largest duplicate in the tree.
- **Its dates are its own.** What it says about a record is as fresh as the last `/close` that rewrote it.
- **No sense of near-done or gone-cold.** A flat list; each session re-derives the order.
- **Blind to worktrees.** The session start names open worktrees; RESUME does not.

## What the records already carry

Status (the seven words + free detail) · `waiting_on:` (`boss board --blocked`) · `revisit_by:` ·
deferred triggers · a program's *Tasks* and *Open questions* · IDEA-153's re-load of the work in flight
at every session start · the board's criteria count (`criteriaProgress`, `src/board.js`) — FEATs only.

**53 records are open:** 5 building, 5 active programs, 30 deferred, 1 ready, the rest seedling or exploring.

## Why a fraction deceives — four real cases (each replayed through the record's own git history)

| Record | The fraction says | What its history says |
|---|---|---|
| PROG-005 | 17/21 — nearly done | Open went 8 → 4 over two days while done went 8 → 17: **~9 tasks were found on the way**. Its **5 open questions never moved.** Closing, but still uphill. |
| IDEA-154 | 4/5 — one to go | **Stuck on the last item since 10-06**, across three commits that touched it. Stalled, not close. |
| PROG-004 | 0/9 — nothing done | Grew 8 → 9; B1 is paused. **A backlog, not a build** — its list isn't scope. |
| IDEA-153 | shipped, 3 open | The three are *Found while building* after it shipped: never its scope. A fraction calls a done thing unfinished. |

The denominator is *how much has been written down so far*, not *how big the work is*, and it grows
as the work goes. A ratio of two moving numbers flatters when tasks are found, alarms when a backlog is
long, and says nothing about the questions that actually decide whether something is close.

## The reading that replaces it — three facts, all derived, said in words

1. **Unknowns: uphill or downhill.** The hill chart's honest cut (still finding out what the work is ·
   only known work left), **derived, not declared**: any unanswered line under *Open questions* →
   uphill, and the count says how many. PROG-005 is uphill whatever its ticks say.
2. **Direction: closing, growing, or stalled.** Replay the open count across the commits that touched
   the record: *"8 → 4 open since 10-06"* (closing), *"8 → 9"* (growing), *"1 open since 10-06,
   3 touches, no tick"* (stalled). A trend between two dates, never a percentage.
3. **Scope: what's left inside the line.** Count only the committed list — a record's *Tasks*, a FEAT's
   *Acceptance criteria*. *Found while building* and a program's *Backlog* are shown beside it
   (*"+3 found, not in scope"*, *"9 saved, none picked"*) and never enter the count.

Beside those, two plain facts: **last worked** = the newest commit naming the id
(`git log --all --grep=<ID>`; file dates lie — sweep commits put IDEA-107 at 10-04 when its last work
was 09-23, IDEA-070 at 10-05 against 08-23), and **next** = the record's `next:` line, else its first
open task.

What it would print (illustrative, from today's tree):

```
Pick up
  IDEA-154  downhill · 1 left, stalled since 10-06       next: <its open task>
  PROG-005  closing (8 → 4 open in 2 days) · uphill: 5 questions open
Status looks stale
  IDEA-155  every task ticked, still `building`
Backlogs, not builds
  PROG-004  9 saved, none picked
Gone cold   (in flight, no commit naming it in 14 days)
  IDEA-107  last worked 09-23
```

**Order of *Pick up*:** downhill before uphill (known work finishes); within downhill, stalled-at-the-
last-item first (the cheapest finish), then closing; a worktree that exists always shows. The
**priority** is still Ajesh's: the computed reading says what is *close*, the hand-written list says
what *matters*, and both show.

## What RESUME becomes

The *Ground truth* commands · a short **Priority** list (ids + a few words of why — the judgment, Ajesh's) ·
the cross-cutting items with no record (publish, outreach) · the evergreen prompt · a pointer to the
computed reading. Everything else moves to its record. ~200 lines → ~40. `/close` updates each touched
record's `next:` and the priority list, instead of rewriting a page of prose.

## Tasks

- [ ] **S1 · `next:`** — one optional frontmatter line on IDEA / FEAT / PROG, dated; absent → the first
  open task. Documented in `docs/IDS.md` beside `waiting_on:`.
- [ ] **S2 · The reading** — a lib that, per in-flight record, derives unknowns, direction (replaying the
  open count through its commits), in-scope left vs found/backlog, last worked, next. Test first against
  the four cases above as fixtures (each must read the way the table says).
- [ ] **S3 · Where it shows** — a command (`boss resume`, or a mode of `boss status`; settle the name in
  S3 — the host's `/resume` collision is named in IDEA-078), and the top three *Pick up* lines at session
  start beside IDEA-153's re-load.
- [ ] **S4 · RESUME moves** — each *Now* / *Held* bullet to its record (move, don't copy; IDEA-158);
  RESUME rewritten to the shape above.
- [ ] **S5 · `/close`** (BOSS's own) writes `next:` and the priority list, not a status page.
- [ ] **S6 · The founder's side** — MVP's `/close` and `templates/resume.md` follow, once S1–S5 have run
  on this tree for a while. A founder's in-flight work is FEATs, so the reading covers them first.

## Open questions

- Should a record be able to say `hill: downhill` by hand when its open questions are really answered
  but not yet removed, or is that the cue to clean the questions up?
- How many days is "gone cold" — 14 for BOSS's pace, and a different number for a founder's?
- Does a program read as one line (its tasks), or as its members (each IDEA/FEAT under it)?
- Does *stalled* need a minimum number of touches, so one quiet day doesn't read as stuck?

## Considered, not adopted (and why)

- **A percentage, a bar, or `n/m`.** The four cases above. The board's own comment already warns that a
  flattering number is worse than none.
- **Counting "left" alone (`4 left`).** Better than a ratio, still blind to found tasks and to open
  questions — PROG-005 would read as close.
- **A hand-set hill position for every record.** One more field to keep honest; the open questions
  already say it. Kept only as an open question (an override).
- **Time estimates.** Nobody here writes them, and a guessed date is the same flattery in a new unit.

## Log

- 2026-10-07 · captured after a reassessment of RESUME; the four cases replayed from git history the same day.
