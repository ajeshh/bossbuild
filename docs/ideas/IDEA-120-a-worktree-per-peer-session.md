---
id: IDEA-120
type: idea
kind: capability
owner: Ajesh
status: seedling
proof: none
proof_note: a trial record in this file (what broke in one worktree session) is the first proof; a CLAUDE.md rule change is the second
gist: Peer sessions share one checkout, which is why CLAUDE.md carries never-checkout, never-stash and stage-one-hunk. The host can now give an agent or a session its own git worktree. Trial it in one session before any rule moves.
created: 2026-09-23
program: harness
relates: IDEA-087, IDEA-119
---

# IDEA-120 — A worktree per peer session

## Current shape

Raised 2026-09-23 while asking what the Opus 5.5 era changes about BOSS's *own* workflow. The shared
tree costs three standing rules in CLAUDE.md (no `git checkout`, no `git stash`/pop, stage one hunk
via synthetic blob) and at least four recorded incidents on 2026-09-13 alone. The host now offers
worktree isolation for subagents (`isolation: "worktree"`) and for a session (`EnterWorktree`).

## Open questions

- Does a worktree session still see gitignored single-copy state it needs (`.boss/`, `docs/evidence/`)?
  A worktree has no gitignored files — that may be the whole blocker, or the point.
- Merge-back: who rebases onto `main`, and does `registry/CHANGELOG.md` `## Unreleased` still conflict?
- Does `npm i -g ~/Projects/bossbuild` (the install every session tests against) point at the right tree?

## Tasks

- [ ] Trial in one session on a one-file change; record what broke.
- [ ] Only if it holds: rewrite the three CLAUDE.md rules as one, and say which incidents it closes.
