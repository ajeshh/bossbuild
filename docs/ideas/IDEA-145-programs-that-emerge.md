---
id: IDEA-145
type: idea
kind: capability
owner: product-lead
program: the-record-system
status: seedling
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
6. *(the opposite signal)* **A parent swallowing its members** — one record past a few hundred lines
   with sub-ids (C1…C8, N3…N14) that each could ship alone. That's a program wearing an idea's clothes.

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
