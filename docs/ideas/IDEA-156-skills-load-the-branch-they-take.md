---
id: IDEA-156
type: idea
kind: capability
owner: product-lead
status: shipped
shipped_on: 2026-10-06
proof: stages/L0-quickstart/template/.claude/skills/canvas/frames.md
created: 2026-10-06
relates: IDEA-085
gist: A skill loads the branch it takes, not every branch it has — the long SKILL.md bodies keep the router and the common path, and move the rest to files opened only when a run needs them.
---

# IDEA-156 — Skills load the branch they take

Ajesh, 2026-10-06, after asking whether BOSS should host its own model to cut cost: *"the whole
model of domain and subdomain to break up the heavy pieces, so its not default but it knows when
to call up the extra?"* and then *"capture idea first and then lets start to split up wherever we
can not just the canvas."*

## What was measured first (2026-10-06, a throwaway Quickstart project, ~4 chars/token)

BOSS makes no model calls of its own, so its cost is the tokens it adds to a founder's session.
Three layers, two of them already handled:

| Layer | When it loads | Size | Already handled by |
|---|---|---|---|
| CLAUDE.md + AGENTS.md | every session | ~1.7k | v0.258.0 cut |
| Skill + agent descriptions | every session | ~1.6k Quickstart, +~2.8k MVP | IDEA-085 (420-byte cap, gated) |
| Hooks on a quiet turn | every turn | 0 bytes | by design |
| **A skill's body** | **each time it runs** | **3k–8.4k for 21 skills** | **nothing — this IDEA** |

The "domain" half of Ajesh's model already exists: a mode brings its own skills. The host already
does the first "subdomain" step (description always, body on call). What is missing is the step
*inside* a body: `/canvas` carries every frame though a run uses one; `/ai-cost` already shows the
fix (`review.md`, opened only on the review half), and `src/sync.js` already ships a skill's whole
tree, so no new machinery is needed.

## The rule

1. **SKILL.md keeps the router and the common path.** Step 0 (which branch is this run?), the
   steps every run takes, and the guardrails that apply to all branches.
2. **A branch only some runs take moves to a sibling file**, named for the branch (`review.md`,
   `frames.md`, `--humane.md`-style), and SKILL.md says *when* to open it, in the step that routes
   there: "open `<branch>.md` and follow it" (a real link to the file).
3. **Never move what every run needs** — splitting the common path only adds a read.
4. **Nothing is cut.** This is a move, not an edit of the advice. A phrase a test or a checker
   greps for either stays in SKILL.md or the test follows it to the file.

## Tasks

- [x] T1 · Split the 21 skills whose body is over ~3k tokens, where a real branch exists
- [x] T2 · Before/after: body tokens per skill, and a typical run's tokens (SKILL.md + the one file it opens)
- [x] T3 · `npm run check` + the suite green; a scaffold + `boss sync` in `/tmp` ships the new files
- [x] T4 · CHANGELOG bullet (Smaller improvements)
- [x] T5 · `test/scaffold.test.js` (shared doc with readers and no origin) scans only SKILL.md +
  `templates/` for the sentence that WRITES a doc — once a writing sentence moves into a branch
  file it false-flags. Widen the scan to the skill's whole folder (found by the red-team split)
- [x] T6 · `test/always-on-cost.test.js` "/evidence keeps the two halves" still passes on words left
  in SKILL.md, but the synthesis half now lives in `evidence/digest.md` — point the test at it

## Result (2026-10-06)

21 skills read; 12 split, 9 left whole because a typical run needs nearly all of the body (each
under ~15% to gain, or a checker pins the text to SKILL.md). SKILL.md tokens (bytes/4), which is
what a run of the common branch loads:

| Skill | Before | After | Cut |
|---|---|---|---|
| sunset | 3,813 | 1,519 | 60% |
| red-team | 5,586 | 3,040 | 45% |
| welcome | 5,075 | 2,793 | 44% |
| evidence | 3,587 | 2,233 | 37% |
| pretotype | 3,096 | 1,974 | 36% |
| health | 3,956 | 2,570 | 35% |
| boss | 6,153 | 4,218 | 31% |
| canvas | 8,395 | 5,959 | 29% |
| idea | 3,413 | 2,464 | 27% |
| close | 5,556 | 4,464 | 19% |
| ship | 5,130 | 4,213 | 17% |
| design-library | 6,898 | 5,872 | 14% |
| **Total** | **64,658** | **41,319** | **36%** |

Left whole: design-tokens-init, design-review (its after half was already `after.md`), landing,
spec (its branches already live in `templates/`), evals, comp-eval, ai-failure-states, trust, prototype.

Verified: full suite 791/791; check-manifests, check-refs, check-ladder clean; a scaffold + MVP
unlock ships every new file with placeholders filled; `boss sync --apply` on a project made by
the previous CLI adds the new files and updates each SKILL.md. `scripts/check-refs.js` FORWARD_OK
follows `mentor-hiring` from health/SKILL.md to health/verdict.md.

Pre-existing reds, not this work (also red in the main checkout): check-boundary (`boss-sync`
ledger row), check-dogfood (`.boss/trace.jsonl` owed but exists), check-roster-claims (module not found).

## Known costs of the split (accepted)

- `/boss` on day 0 reads SKILL.md + `setup.md`: slightly more than before. Every later run is ~31% less.
- `/evidence` on a whole transcript reads SKILL.md + `debrief.md` + `digest.md` (~3.7k vs 3.6k).
  A single record — the common case — is ~38% less.

## Open questions

- Should a gate cap a SKILL.md body the way IDEA-085 caps descriptions? Not yet — no bug reached a
  founder (CLAUDE.md: a new gate needs one). Revisit if bodies regrow.
