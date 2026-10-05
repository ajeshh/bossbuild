---
id: IDEA-142
type: idea
kind: capability
owner: Ajesh
status: building
proof: none
proof_note: both gaps reproduced in a throwaway project on 2026-10-05 before anything was built (a live-key-shaped string committed silently; the shipped settings had no `ask` block)
gist: What BOSS ships a founder for git is sound at the practice level; five gaps sit at the one-way doors — a key reaches history before /ship scans for it, destructive git commands run unasked, no save point after /prototype, unpushed work isn't a backup, and worktrees are recommended untried.
created: 2026-10-05
program: harness
relates: IDEA-120, IDEA-070, IDEA-136
---

# IDEA-142 — Git safety for founders

## Current shape

Asked 2026-10-05 (Ajesh): *"how we have git setup for founders, is there anything more we can do?"*
Altitude: what BOSS **ships** to a founder, not BOSS's own tree.

Today a founder gets: `git init` at `boss new`; `/boss` creating the repo (private default, licence
on purpose, noreply email repo-locally); a three-tier `.gitignore` with the reason beside each rule;
the secrets deny floor; at MVP trunk-based + smoke-before-commit, the opt-in `smoke-guard`, `/ship`'s
deploy-on-push at the second hand ship; `boss craft git-workflow`; `/prototype` commits before it runs.

The gaps all sit where something can't be undone. Each composes into a surface that already exists —
no new skill (the founder-evidence mandate: compose and subtract).

## Tasks

- [x] **T1 — a key is caught at the commit, not at `/ship`.** Reproduced: a `sk_live_`-shaped string
      committed with no word. `/ship` scans after the history already holds it, and its own text says
      the history is the one-way door. A zero-dep git pre-commit scan of the staged diff for
      high-confidence key shapes (and a force-added `.env`), laid down at `boss new` / `adopt` /
      `sync --apply`, only where the founder has no pre-commit hook of their own.
- [x] **T2 — destructive git commands ask first.** Shipped `settings.json` had no `ask` rules. Add
      them for force-push, `reset --hard`, `clean`, discarding checkout/restore, `stash drop|clear`,
      `branch -D`. Merged by `boss sync` like the deny floor: an ask entry can only add a prompt,
      never grant (docs 2026-10-05: ask beats a user's allow, is split per subcommand, and is honored
      in auto and bypass modes).
- [ ] **T3 — a save point at every working point.** After `/prototype`, nothing establishes the commit
      habit; for the non-technical cohort git is the only real undo (`/rewind` misses shell and
      subagent edits). One line in `coder`: commit when it works, say *"saved — you can get back here."*
- [ ] **T4 — unpushed work named at `/close`.** The `.gitignore` says pushing backs up your thinking;
      nothing notices a week of commits on one laptop. `/close` step 4 adds the unpushed count.
- [ ] **T5 — worktrees: trial before recommending.** The practice recommends one worktree per agent;
      BOSS's own trial (IDEA-120) is open. Known snag: a fresh worktree has no `.env`, so the app
      won't run there — the host's `.worktreeinclude` (confirmed in host docs 2026-10-05) is the
      answer to name. Then `/practice-refresh git-workflow` (last reviewed 2026-06-20; predates
      the host's worktree isolation and `/code-review`).

## Built (2026-10-05)

- T1: `stages/L0-quickstart/template/.claude/hooks/lib/commit-secrets.js` (the scan) +
  `src/commit-guard.js` (the per-clone shim, written into `.git/hooks/pre-commit` with its mode set —
  not `core.hooksPath`, which would hang on npm keeping an exec bit and would switch off the founder's
  other hooks). Called by `boss new`, `boss adopt`, `boss sync --apply`. `test/commit-secrets.test.js`.
- T2: `permissions.ask` in the L0 template settings; `src/sync.js` merges `deny` and `ask` alike.
- Found while building, not done: `boss remove --apply` leaves the shim behind (harmless — it exits 0
  when the scan file is gone — but it is a BOSS-written file left in `.git/hooks/`).

## Open questions

- A cofounder's fresh clone has no shim (git copies no hooks). Today they get it from their own
  `boss sync --apply`. Should the reentry hook lay it down at session start instead? It would be a
  quiet write into `.git/` — not decided.
- GitHub's own push protection: free on public repos; for private repos it may be a paid product.
  Unverified — not to be stated in shipped text until checked at source.
