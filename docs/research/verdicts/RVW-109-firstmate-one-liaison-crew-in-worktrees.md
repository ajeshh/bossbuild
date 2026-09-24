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

## Attribution
The README was verified at source. The video is by the repo's author (Kun Chen) and is their own
promotion; its title claims "L8 Principal", which was not verified. The recommender's "no
relationship" cannot be checked.

## Notes
- Prior related verdicts: RVW-024, RVW-012. Idea: IDEA-120 (add as reference).
- BOSS version when recorded: 0.327.0
