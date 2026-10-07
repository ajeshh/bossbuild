---
id: IDEA-161
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-07
proof: none
proof_note: a bug, not a file — done is a case in `test/id-sees-open-worktrees.test.js` that failed before the fix
relates: IDEA-160, IDEA-120
gist: `boss id` offered a number a peer's worktree already held in a commit, though a test exists for exactly that.
---

# IDEA-161 — `boss id` misses a peer worktree's record

Found 2026-10-07 while starting IDEA-160 (its *Found while building*). Not reproduced in a test yet.

## What was seen

From the main checkout, `node bin/boss id` answered **`IDEA-159`** twice (10:33 and 10:36) while
`.claude/worktrees/idea-159` (branch `work/idea-159`) held
`docs/ideas/IDEA-159-the-status-line-in-claude-code.md` in a commit (53da856a, committed 10:36:15;
the first answer may predate it, the second does not). IDEA-160 took the next number by hand, so
nothing collided.

`test/id-sees-open-worktrees.test.js` pins this exact behaviour (*nextId skips a number a peer
worktree already holds*) and passes. So the difference is between the test's fixture and the real
tree — candidates, none checked: the worktree's location or how it was created (`scripts/worktree.js`
links gitignored records into it), the branch naming (`work/<id>`), or how `nextId` lists worktrees.

## Tasks

- [ ] Reproduce in a test first (rule 8): make the fixture look like a `scripts/worktree.js` worktree
  until the case fails on today's code. If it never fails, record that and close this — no fix.
- [ ] Fix, with the failing case kept.
