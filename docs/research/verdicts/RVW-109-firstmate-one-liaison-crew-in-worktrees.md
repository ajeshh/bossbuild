---
id: RVW-109
type: verdict
owner: pm
status: recorded
created: 2026-09-24
verdict: NOT-YET
route: n/a
sources:
  - https://github.com/kunchenguid/firstmate (README read at source 2026-09-24; 7,140 stars, created 2026-06-12, pushed 2026-09-24)
  - https://www.youtube.com/watch?v=kPN564Kol14 (title and author via oEmbed only; not watched)
---

# RVW-109 — firstmate: talk to one agent, and it runs a crew in disposable worktrees

## The claim
- **Source:** linked in the RVW-108 thread by u/hotmerc007 ("no relationship… utterly amazing").
- **Core assertion:** to run parallel agent work without tab-juggling, talk to one liaison agent.
  It spawns workers, each in a clean git worktree inside a visible terminal session, supervises
  them with a zero-token bash watcher that wakes the liaison only when needed, keeps all state on
  disk so it survives restarts, and hands back PRs or reports. The liaison is read-only over the
  projects, and workers make changes behind a configured merge authority.
- **Inbox file:** none.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Real, adopted open-source artifact** (7k stars in three months, maintained today). There is no outcome data: stars measure interest, not quality. |
| 3 | Duplicate or sharpen? | **For founders: duplicate.** `git-workflow.md` already prescribes one worktree per task, capped at ≈2–4 by review capacity, and the host now ships worktree isolation natively. **For BOSS's own tree: a sharpening of IDEA-120.** This checkout carries three standing rules and several incidents *because* six peer sessions share one HEAD. firstmate's shape (one integrator that never edits, workers in disposable worktrees, state on disk) is the most complete worked answer to IDEA-120's open questions that BOSS has seen. |
| 4 | Who serves / harms? | For founders, it serves `vibe-virtuoso` and `eng-builder` with fleets, and harms everyone below the review cap: more agents than you can review is "unreviewed code with your name on the merge" (`git-workflow.md`). |
| 5 | Cost / ceremony | Heavy for a founder (tmux or another backend, a distro, a watcher). For BOSS's own practice it would *remove* the three shared-tree rules if it held. |

## Verdict: NOT-YET
Nothing ships to founders: the mandate is to subtract, and the practice already names the
primitive. The altitude where it has value is **BOSS's own practice**, as reference material for the
IDEA-120 worktree trial that is already next on RESUME's list. The two answers worth borrowing are
*the integrator is read-only* (single-writer, as in RVW-024) and *supervision state lives on disk*.
Install nothing.

## If REJECT / NOT-YET
- **Re-open condition:** the IDEA-120 trial holds and more than one peer session needs coordinating.
  Then read firstmate's `docs/architecture.md` before designing BOSS's own merge-back. The founder
  side re-opens only if a real founder is observed running more than four parallel agents.

## What BOSS learns from it (read at source: `AGENTS.md` §1–12, 2026-09-24)

Taken as mechanisms, not as a product to install. Each is sorted by altitude.

**BOSS's own practice (this tree):**
1. **Open items print themselves until they are closed.** Every session start prints `OPEN DECISIONS`,
   and a wake stays on disk until the turn that *handled* it acknowledges it. An interruption leaves it
   there to be handled again. BOSS's version is rule 3b (prose) plus a timestamp reminder that is
   "never a referee", and a hand-typed *Waiting on Ajesh* list with items marked "offered 09-23,
   unanswered". **Lesson: derive the waiting list; don't type it.** Candidate, not built.
2. **Contradiction between two records is surfaced, never resolved silently.** `RECORD DIVERGENCE`
   fires when the log says a call was answered but the item is still held. BOSS already has the
   shape in `unticked-shipped`. Extending it to decisions is the same move.
3. **A second session that can't take the lock is read-only, and says so.** The integrator never
   edits a project; workers do, each in a disposable worktree. This is IDEA-120's answer to six peers
   on one HEAD.
4. **The code that tears down is the code that decides "landed".** Teardown refuses rather than
   trusting the caller. BOSS had that guard in `boss remove` (after the 08-21 loss) but not
   everywhere; see the audit below.

**What BOSS ships (founder-facing):**
5. **Talk in outcomes, with a translation table.** firstmate lists its internal words (worktree,
   hold, gate, wake, fail-closed…) with the plain word each becomes before it reaches the captain,
   and forbids relaying status lines verbatim. BOSS's voice rule ("assume intelligence, never assume
   knowledge") has no such list and no check, and BOSS's own output carries FEAT, rung, loop, RVW and
   moment. **Lesson: the voice rule wants a table, which is checkable where prose is not.** Candidate.
6. **Keep the founder's words verbatim in the brief, and name what's out of scope.** firstmate's
   `Captain's intent` holds the ask word for word and is never widened into a goal, "because the
   reviewer treats that as acceptance criteria"; any generalisation becomes follow-up work. This bears
   on `/spec`: are acceptance criteria the founder's words, or BOSS's widening of them? Unchecked.
7. **Silence is a reply shape.** Unchanged state is not progress, and the no-op answer is one fixed
   line. BOSS already believes this ("stays quiet the rest of the time"), so this is confirmation.

**Lesson 6 checked against `/spec` (2026-09-24, Ajesh: "lets go"):** out-of-scope, the assumptions
list and new-scope-gets-a-new-id were all already there; the assumptions list is *stronger* than
firstmate's rule. The gap was the founder's words: step 3's "one concrete instance, in their words"
(the skill's own highest-yield question) had no home in the FEAT template, so it died with the chat
and the coder never saw it. None of this repo's 19 FEATs carries one. **Landed:** the template quotes
it under Goal, and step 3 says it is what criteria are checked against.

**Lessons 1 and 2 (2026-09-24, Ajesh: "continue"):** reproduced first: RESUME's hand list carried
IDEA-087 (shipped 09-13) and IDEA-098's gate (closed 09-11) as open. **Landed:** `waiting_on:` read
by `boss board --blocked` and `--json`; `/close` and both `IDS.md` copies say where a question goes;
RESUME keeps only questions with no record. **Lesson 2 folded into 1**, because deriving the list
removes the second copy that drifts, and a mechanical check would misfire (a shipped record can
legitimately still owe an answer, as IDEA-129 does). Not done: DEC records (the board doesn't read
`docs/decisions/`, so DEC-018's question stays in RESUME), and the HTML board shows no waiting flag.

**Lesson 4 audited (2026-09-24):** every delete in `src/`. `boss remove` keeps edited files and
backs up `.boss/` first; `sync --remove` never deletes an edited orphan; `remove --global` previews
unless `--apply`; the scaffold's `claude-append.md` and the atomic-write lock are BOSS's own
transient files. **One gap, reproduced:** `boss hooks disable` deleted an edited hook outright and
then promised `enable` would bring it back. **Fixed:** the hook is unregistered and kept if it
differs from what BOSS ships; the test failed first.

Already on BOSS's shelf, so nothing to take: knowledge routed to its most specific owner (IDEA-102);
"a current explicit instruction overrides a standing rule, never by analogy"; prune over append.

## Attribution
The README was verified at source. The video is by the repo's author (Kun Chen) and is their own
promotion; its title claims "L8 Principal", which was not verified. The recommender's "no
relationship" cannot be checked.

## Notes
- Prior related verdicts: RVW-024, RVW-012. Idea: IDEA-120 (add as reference).
- BOSS version when recorded: 0.327.0
