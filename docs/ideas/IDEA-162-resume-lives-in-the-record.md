---
id: IDEA-162
type: idea
kind: capability
owner: product-lead
status: shipped
shipped_on: 2026-10-07
created: 2026-10-07
proof: test/resume-reading.test.js
proof_note: the reading and its test land at S2; shipped is RESUME in its new shape and `/close` writing `next:` (S4–S5)
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
| PROG-005 | 17/21 — nearly done | Created with 3 open, grew to 11, closed to 4 in two days: **16 tasks were found on the way**. One question (Q5) is still open. Closing, but still uphill. |
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
3. **Scope: what's left inside the line.** Every checkbox counts as scope (a record's *Tasks*, a FEAT's
   *Acceptance criteria*, a program's *Phases*…) except findings and backlogs. *Found while building* and a program's *Backlog* are shown beside it
   (*"+3 found, not in scope"*, *"9 saved, none picked"*) and never enter the count.

Beside those, two plain facts: **last worked** = the newest commit naming the id
(`git log --all --grep=<ID>`; file dates lie — sweep commits put IDEA-107 at 10-04 when its last work
was 09-23, IDEA-070 at 10-05 against 08-23), and **next** = the record's `next:` line, else its first
open question when it is uphill, else its first open task.

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
computed reading. Everything else moves to its record. Projected ~200 lines → ~40; landed at 199 → 131
lines, 18.2 → 9.5 KB (~4.6k → ~2.4k tokens) — *Waiting on Ajesh* and *Held* are most of what is left, and
they have no record to move to. `/close` updates each touched
record's `next:` and the priority list, instead of rewriting a page of prose.

## Tasks

- [x] **S1 · `next:`** — one optional frontmatter line on IDEA / FEAT / PROG, dated; absent → the first
  open task. Documented in `docs/IDS.md` beside `waiting_on:`.
- [x] **S2 · The reading** — `stages/L0-quickstart/template/.claude/hooks/lib/resume-reading.js` (zero-dep,
  shared by the CLI and the hooks, like `loop-runtime.js`): unknowns, direction, in-scope left vs
  found/backlog, last worked, next. Four git calls in the common case (one log for the names, `rev-parse` + a `--raw` log + one
  `cat-file --batch` for the history; one more per record no commit names), ~0.1 s on this tree. `test/resume-reading.test.js` — the four
  cases as fixtures, written first.
- [x] **S3 · Where it shows** — no new verb or flag: **`boss board --next`** was already *"what should I
  pick up?"*, so its *Finish* list became the reading (*Pick up*, then *Status looks stale*, *Backlogs,
  not builds*, *Gone cold*); *Start / Pressure-test / Pick / Blocked* are unchanged. `boss status` adds
  the reading's line under *Building now*; the session start in a main checkout carries the top three
  (a worktree's session is already on its work).
  `waiting_on:` and `revisit_by:` stay where they're read now (`boss board --blocked`, `boss status`) —
  not repeated here.
- [x] **S4 · RESUME moves** — every *Now* / *Next* / *Held* item checked against its record: nearly all were
  already there (RESUME was the copy). Two had their only copy in RESUME and moved first (the ladder order →
  PROG-002 B4/C11; the showcase notes → FEAT-039). Two were stale (IDEA-114 "open: the board's split";
  "0. Worktree trial" — IDEA-120 shipped). RESUME rewritten: Ground truth · Priority · Found, no record yet ·
  Waiting on Ajesh · Held · the prompt.
- [x] **S5 · `/close`** (BOSS's own) writes `next:` and the priority list, not a status page. BOSS's `/close`
  is the shipped MVP file synced into gitignored `.claude/skills/close/` — so this edit lives in the main
  checkout's copy only (untracked), and **a `boss sync` would put the shipped text back** until S6 ships it.
- [x] **S6 · The founder's side** — shipped the same day (Ajesh, 2026-10-07: *"lets fix any issues and lets
  ship"*), which also ended the S5 split: MVP's `/close` writes `next:` and keeps RESUME to what no record
  holds; `templates/resume.md` has *Priority* and *Found, no record yet* in place of *Next tasks*; the
  founder's `docs/IDS.md` documents `next:`. BOSS's own copy is the shipped file again, so `boss sync` is safe.

## Found while building

- [x] **`land` re-stamps every commit's date.** It rebases, so the committer date is the landing time:
  PROG-005's two days read as one, and IDEA-154's stall as a day late. The reading uses the author date
  (when the work was written); a test fails on the committer date.
- [x] **A young record grows before it closes.** PROG-005 went 3 → 11 → 4 open in two days; measured
  from its first commit it read *"growing: 3 → 4"*. Closing is measured from the peak open count.
- [x] **The main board still prints `[n/m criteria]`** on a Building card (and `boss status` used to
  lean on it). Acceptance criteria are written before the build, so that fraction moves less than a
  task list's — but it is the same shape. Ajesh: *"solve for main board if needed"* — done: *on now*, the HTML
  card (its segments and `n/m` removed) and the card view (*how close*) say it in words; *no acceptance
  criteria* stays a named hole; `--json` keeps its counts (a machine contract).
- [ ] **`boss board --json` doesn't carry the reading** — the agent-readable view still has only the
  columns. Add it when an agent needs it (`planner` reads `--next` as text today).
- [x] **The pre-land review (a fresh reviewer, IDEA-158) found three bugs, each reproduced in a test first:** a
  project in a subfolder of its repo lost its history (git paths are repo-root-relative); `found` matched
  *founder* / *foundations* headings; a ticked `- [x]` open question still counted. Fixed. Small things built
  beyond the tasks, kept: the `⬆` high-priority marker carried over from the old *Finish* list, blocked cards
  left out of *Pick up* (they're under *Blocked*), and `boss status`'s *+N more* pointing at `--next`.
- [ ] **`git log --all` over a very large history** runs at every main-checkout session start (~0.1 s here). Cap
  it (`--since`) if a real tree shows it slow; past the cap, "no commit names it" is cold anyway.
- [x] **Small:** `~~~` fences are skipped; `--program prog-5` matches `PROG-005` (`programId()`). Left as is:
  the lib's `ready` bucket and `readingLines`' full mode are only exercised by the test (the board renders its own).
- [x] **PROG-005's Q1–Q4 were answered only in the heading** — every reader counted five open. Each
  line now says so (its own commit). The reading's *uphill* is also a cue to tidy a record's questions.

## Open questions

- ~~Should a record be able to say `hill: downhill` by hand?~~ **Decided: no.** When the questions are
  answered, the record says so on each line (`~~…~~`, *answered*, *settled*); the uphill flag is the cue
  to tidy, and a second field would be one more thing to keep honest.
- ~~How many days is "gone cold"?~~ **Ajesh, 2026-10-07: 14.** One number for now (`COLD_DAYS`); a
  founder's pace is S6's question.
- ~~Does a program read as one line, or as its members?~~ **Decided (Ajesh: "whatever you decide"):
  one line** — its own tasks and questions — naming its members in flight; each member also has its
  own line, so nothing is counted twice.
- ~~Does *stalled* need a minimum number of touches?~~ **Decided: two edits since the last tick, with
  work left.** A quiet record isn't stalled; past 14 days it's cold.

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
- 2026-10-07 · open questions settled (cold = 14 days, Ajesh; the rest decided here); S2 built test-first.
