---
id: IDEA-145
type: idea
kind: capability
owner: product-lead
program: the-record-system
status: building (S1–S7 landed 2026-10-05; the other 23 umbrellas not yet read against E1–E6)
proof: src/records.js
proof_note: done when programs() reads PROG records and flags grown ones (S1–S2), the board filters by program (S3–S4), and /idea and /close carry the offer (S5).
gist: Programs should emerge, not be declared. BOSS notices when related work wants a parent — the same rule restated across records, an IDEA that is really recurring upkeep, one topic split across slugs — and offers the elevation once, in a sentence. The founder never has to know `program:` exists to get one.
created: 2026-10-05
relates: PROG-001, IDEA-143, IDEA-114, IDEA-137
altitude: both — BOSS's own practice first (PROG-001 was done by hand), then what ships a founder
---

# IDEA-145: Programs that emerge, not declared

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** the program ladder (`program:` slug → `PROG-NNN`, [IDS.md](../IDS.md)) is right, but every
  rung is explicit: someone has to know the field exists, pick a slug, and decide when to graduate.
  In ~145 records BOSS made one program record, and only after Ajesh noticed a chore filed as an idea.
  BOSS should **know when to elevate** and say so — once, in a sentence, at a moment that already exists.
- **Why:** Ajesh, 2026-10-05: *"when we have an idea that should be connected to the main idea, it
  should not be its own idea but a subset right for better context?"* and *"we should know when to
  elevate it to program."* Without a parent, the reasoning that belongs to no single member has
  nowhere to live, so it gets copied into each member or lost.
- **The guard:** subsets cut both ways. IDEA-137 is 725 lines because so much folded into it, and
  every agent that opens it reads all of it. The parent holds the *why* and the shared rules; the
  members hold the work. **The test for subset vs own record stays the IDS.md one: could it ship
  alone and be worth something?**

## Signals — what PROG-001 showed, done by hand

Each signal was present before anyone acted; none needs a new record type to read.

1. **An IDEA that is really upkeep.** IDEA-143's body said *every deploy*, *quarterly*, *intake* — a
   cadence. An idea gets to be done; upkeep never is. → it belongs to a program (or a loop), not the board.
2. **A standing-rules file points at an IDEA.** CLAUDE.md sent every session to `IDEA-143` for how the
   site is run. A rule's home that can ship and close is the wrong home.
3. **One topic under several slugs, or none.** Site work sat in `public-surface`, `distribution`
   (IDEA-117) and nowhere (IDEA-110).
4. **The same rule restated across siblings** — the freeze, *overview first*, *no stronger than what
   backs it* appeared in several records instead of one parent.
5. **A new IDEA whose `relates:` all share one program** — at capture, it is probably a member, or a
   task inside one.
6. **One topic that grew** (Ajesh, 2026-10-05: *"one topic that has grown in size as more
   complexity"*) — a record still in flight that now holds several **tracks** of work, each with its
   own ids (C1…C8, N3…N14, R1…R11). Measured 2026-10-05: line count is the wrong test (IDEA-106 is
   657 lines of shipped narrative); tracks are the right one. IDEA-137: 9 tracks, 20 open items,
   created the day before — grown in scope, not age. That's a program wearing an idea's clothes.

## The rules (2026-10-05 — the set to build against)

**When to elevate.** Any one of these, read off the files:

| # | Rule | Read by |
|---|---|---|
| E1 | **Shared reasoning** — a rule or decision applies to two or more members, and would otherwise be restated in each (signal 4; the IDS.md seam test) | judgment — `/close` |
| E2 | **Upkeep** — work with a cadence and no finish line is a program's standing work, never an IDEA (signal 1) | judgment — `/close`, `/idea` |
| E3 | **A rules file points at a closable record** as the home of standing rules (signal 2) | judgment — `/close` |
| E4 | **One topic, several umbrellas** — or none (signal 3) | judgment — the one-time sweep |
| E5 | **Grown** — an in-flight record with **3+ tracks still open** (ids in its checklists; a finished track is history), or **12+ open items** (signal 6) | code — `boss records --programs` |
| E6 | **Capture lands inside one** — a new IDEA whose `relates:` all share one program (signal 5) | `/idea`, at capture |

**Where new work goes** (the IDS.md test, unchanged): could it ship alone and be worth something?
No → a task in the program's backlog. Yes → its own IDEA with `program:` pointing at the parent.

**How BOSS acts on a rule.**
- **Offer, never do.** One sentence at a moment that already exists (`/idea`, `/close`, `boss records
  --programs`). BOSS never creates a PROG record or moves a member unasked.
- **Once.** A *no* is an answer; the same pair isn't offered again unless the record grows a new track.
- **Never on a count of members.** Five records sharing a slug is a grouping, not a program.
- **A grown record elevates by becoming the program's first page**, not by being rewritten: its
  tracks that could ship alone become members (own ids, `program:` back); the rest stay as tasks.
- **A program closes** when every member is shipped/dropped and it has no upkeep: `status: done`.
  A program with upkeep (PROG-001) never closes, and that is fine.

## Program work on the kanban — the answer

- **Members are cards**, in the columns they already sit in. A card shows its program as a chip;
  `boss board --program <slug|PROG-NNN>` (and a filter on the HTML board) shows only that program's
  cards — a swimlane without a second board.
- **Tasks inside a program are not cards.** The board's standing rule is *criteria, not todos* (RESUME,
  board pass 2026-09-13). A program's open tasks are a count on its row, not cards in a column.
- **The program view is `boss board PROG-001`** — the same one-card detail the board already does for
  an id, widened for a program: its gist, members by column, open tasks, and any member that has grown
  (E5). The HTML roll-up row names the program by title and links to the same.
- **A grown idea** (IDEA-137) is flagged on that view and by `boss records --programs` as *might want
  to be a program*; its own card is unchanged.

## Build — slices, smallest first (kicked off 2026-10-05, Ajesh: *"lets kick off this and set it off"*)

- [x] **S1 · Read the PROG record.** `programs()` reads `docs/programs/PROG-*.md` — title, gist, status,
  open/done tasks; `boss records --programs` and the HTML roll-up print the title, not the bare id.
- [x] **S2 · E5 in code.** A record's tracks and open items, counted; `boss records --programs` ends with
  *might want a program* for in-flight records over the line. Test on the threshold both ways.
- [x] **S3 · The kanban.** Program chip on HTML cards; `boss board --program <x>` in the terminal.
  *Not built:* a filter on the HTML board — the page has no script, by design; the roll-up row names
  the program and `--program` is the filter.
- [x] **S4 · The program view.** `boss board PROG-001` — gist, members by column, open tasks, grown members.
- [x] **S5 · The judgment rules in the skills.** `/idea` (E2, E6 at capture) and `/close` (E1–E3), one
  offer each, both copies; the founder's IDS.md gains the rules in its own words, cohort-aware.
- [x] **S6 · The one-time sweep** (2026-10-05, Ajesh: *"yup"*). IDEA-137 → PROG-002: C8 → IDEA-146, C7 + B2
  → IDEA-147, the rest as program tasks. **Correction on the way:** C5 looked like a third idea, but H1
  had already made the four signs a design test, never a founder reading — its founder half is one line
  of IDEA-146, the rest a BOSS-only task. *Read the record's own decisions before splitting it.*
- [x] **S7 · CHANGELOG bullet** (a founder feels S3–S5), and the standing demo rule: Kettlewick's
  `cover` graduates to its own PROG-001 (the board on the demo names it), and `check:demo` now
  requires `docs/programs/`.

**Found while building S2 (2026-10-05):** a track counts only while it has an open item. Run on a
throwaway scaffold, a record whose tracks were all ticked read as *grown*; a finished track is
history. IDEA-137 still crosses the line (6 of its 9 tracks open). `PROG-1` pads to `PROG-001`, as
card ids already do.

## Candidates — compose, no new skill

- **`/idea` asks once at capture:** *"This reads like part of PROG-001 (the website). Add it there as a
  task, or keep it as its own idea?"* — only when signal 5 fires. Default to the founder's answer, never
  to a silent merge.
- **`/close` or the harvest loop notices signals 1–2** and offers the elevation in one line; it never
  creates the PROG record unasked.
- **`boss records --programs` and `boss board --html` read a graduated program's title and gist**
  (today they print the bare id `PROG-001` — found 2026-10-05).
- Founder side: the same moments, cohort-aware, without ever saying the word *program* to someone who
  doesn't need it — *"these four belong together; want one place for what they share?"*

## Open questions

- Which signal is cheapest and least noisy to read first? Lean: 5 at `/idea` (the moment exists, the
  data is the `relates:` line), then 1 at `/close`.
- Is upkeep a program or a loop? PROG-001 holds its loop as a section; `docs/loops/` holds machine-read
  loops. Does a program's cadence ever need to be machine-read?
- Should FEAT-039 (the Kettlewick showcase) and the site generators sit in PROG-001? Left out on
  2026-10-05 — the demo is also a playbook surface.
- Does a slug left with one member (none today) un-graduate, or is that fine?

## Tasks

- [ ] `boss records --programs` / board HTML: show a PROG record's title (found 2026-10-05).
- [ ] Look across the 24 slugs for signals 3 and 6 once — which others have earned a PROG? (Candidates
  on sight: `ecosystem-of-ecosystems` — IDEA-137 is signal 6; `business-profile`, 10 members.)

## Capture log
- **2026-10-05 · Ajesh** — *"i feel like the website pass was more of a chore not an idea… This also
  makes me think like when we have an idea that should be connected to the main idea, it should not be
  its own idea but a subset right for better context?"* → PROG-001 made by hand. Then: *"we might need to
  think about how we do programs more natural, rather than explicit. Like we should know when to elevate
  it to program."* → this record.
