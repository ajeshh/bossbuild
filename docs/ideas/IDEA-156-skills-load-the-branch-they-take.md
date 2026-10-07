---
id: IDEA-156
type: idea
kind: capability
owner: product-lead
status: building
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
   there: "open [`x.md`](x.md) and follow it."
3. **Never move what every run needs** — splitting the common path only adds a read.
4. **Nothing is cut.** This is a move, not an edit of the advice. A phrase a test or a checker
   greps for either stays in SKILL.md or the test follows it to the file.

## Tasks

- [ ] T1 · Split the 21 skills whose body is over ~3k tokens, where a real branch exists
- [ ] T2 · Before/after: body tokens per skill, and a typical run's tokens (SKILL.md + the one file it opens)
- [ ] T3 · `npm run check` + the suite green; a scaffold + `boss sync` in `/tmp` ships the new files
- [ ] T4 · CHANGELOG bullet (Smaller improvements)

## Open questions

- Should a gate cap a SKILL.md body the way IDEA-085 caps descriptions? Not yet — no bug reached a
  founder (CLAUDE.md: a new gate needs one). Revisit if bodies regrow.
