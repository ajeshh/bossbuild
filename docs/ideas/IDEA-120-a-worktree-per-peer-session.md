---
id: IDEA-120
type: idea
kind: capability
owner: Ajesh
status: shipped
proof: none
proof_note: a trial record in this file (what broke in one worktree session) is the first proof; a CLAUDE.md rule change is the second
gist: Chat windows share one checkout, so each can commit another's half-done work — which is why CLAUDE.md carries never-checkout, never-stash and stage-one-hunk. One worktree per piece of work, named by its ID; a second window on the same work joins it; the main checkout only lands.
created: 2026-09-23
program: harness
relates: IDEA-087, IDEA-119
---

# IDEA-120 — A worktree per piece of work, which chats join

## Current shape

**Rescoped 2026-10-05 (Ajesh): a worktree per piece of WORK, which chats join — not per chat.**
*"people often have multiple chat windows open, so its about best managing, and not letting that
chat checkin or commit code for someone else … maybe someone can say, hey its part of the same
thing that is being built on another window?"* Each window is its own session; all they share is
the disk, so a window cannot know another is building the same thing unless told. So the unit is
the work, named by its ID (`.claude/worktrees/idea-142`, branch `work/idea-142`): a new piece of work
gets one; a second window on the same work joins it by naming the ID; everything inside belongs to
that work, so committing all of it is right. The main checkout is for landing only. A session start
names the open work once, so joining is a reply, not a rule to remember. Proved here first; the
same shape then ships (agent-shape rung 4, the planner's parallel FEATs).

**Decided 2026-09-23 (Ajesh: yes) — trial it next session.** One session works in its own worktree;
this file records what broke. Today's case for it: two staging sweeps, an `index.lock` collision and
a pre-commit bug (empty folders of a deleted skill) that only showed because the shared tree is
tested through a throwaway copy — all in one evening, on top of the three standing rules.

Raised 2026-09-23 while asking what the Opus 5.5 era changes about BOSS's *own* workflow. The shared
tree costs three standing rules in CLAUDE.md (no `git checkout`, no `git stash`/pop, stage one hunk
via synthetic blob) and at least four recorded incidents on 2026-09-13 alone. The host now offers
worktree isolation for subagents (`isolation: "worktree"`) and for a session (`EnterWorktree`).

## Open questions

- Does a worktree session still see gitignored single-copy state it needs (`.boss/`, `docs/evidence/`)?
  A worktree has no gitignored files — that may be the whole blocker, or the point.
- Merge-back: who rebases onto `main`, and does `registry/CHANGELOG.md` `## Unreleased` still conflict?
- Does `npm i -g ~/Projects/bossbuild` (the install every session tests against) point at the right tree?

## Reference (2026-09-24, RVW-109)

An open-source crew runner (source in the gitignored sessions file RVW-109 names) is the most complete worked answer to the
open questions above: one integrator that **never edits** the projects (single-writer), every worker in a
disposable worktree, supervision state **on disk** so a restart or compaction loses nothing, and a
zero-token watcher that wakes the integrator only on an event. Read its `docs/architecture.md` before
designing merge-back here. Borrow the shape; install nothing.

## Trial (2026-10-05) — it holds

One session, one real change (`boss remove` takes IDEA-142's commit shim back out: `src/remove.js`
+ a test + a CHANGELOG clause), done start to finish in `.claude/worktrees/idea-120` on branch
`trial/idea-120`. Same session, earlier that day, in the shared tree: four commits staged hunk-by-hunk
through synthetic blobs to keep a peer's uncommitted INDEX row out, one wait on a peer's `index.lock`,
two lane-claim messages. In the worktree: a plain `git add`, a green pre-commit (9.2s), a clean rebase.

What broke or rubbed, in the order it happened:

1. **The host branches from `origin/main` by default** (`worktree.baseRef: fresh`), 5 commits behind
   local main — the worktree would have lacked the code being changed. Created by hand at local HEAD
   (`git worktree add -b <branch> .claude/worktrees/<name> HEAD`), then entered by path.
2. **Every gitignored thing is absent**: `.boss/`, `docs/evidence/`, the research sessions, CANVAS,
   and all of `.claude/` — so a session *started* in a worktree runs with none of BOSS's own hooks or
   settings. No `node_modules` to miss (zero deps): `npm run test:ci` passed (732) untouched.
3. **`npm run check` went red — 73 broken links**, every one into a gitignored record; the `&&` chain
   stopped there, so the later checks never ran.
4. **Symlinks, not copies.** The records are the single-copy files behind both unrecoverable losses;
   a copy per worktree is a fork. Linking the main tree's paths keeps one copy. The set is DERIVED
   (walk the main tree, `git check-ignore --no-index` from the worktree), and two traps: a directory
   ignored as a whole can still hold tracked files (`docs/research/verdicts/`, `docs/architecture/`) —
   linking it would hide the worktree's own tracked copies, so descend and link the ignored children;
   and never link `.claude/worktrees` (a loop). With the links, the check matched main's exactly.
5. **A trailing-slash ignore rule doesn't match a symlink** (git sees a file), so 12 links showed as
   untracked — one `git add -A` from committing absolute paths into a public repo. Fixed locally in
   `.git/info/exclude` (shared by every worktree, tracked by none).
6. **CLAUDE.md's list of what is gitignored is incomplete** — it omits `docs/architecture/*` (most),
   `docs/design/`, the research compendium/SOURCES/watchlists, `docs/exports/`, `docs/loops/`,
   `docs/fable-campaign/`, `plugin/evals/results/`. The derivation found them; the list never would.
7. **The host fences the session in.** It refuses any git command aimed at the main checkout, and any
   command it can't prove stays inside — a `find -path ./.git`, a Python heredoc whose text mentions
   git. Workable: git commands alone, file edits through the editor tool. The fence is the point.
8. **Testing the CLI needs no global install** — `node <worktree>/bin/boss` in a throwaway with
   `BOSS_HOME` set. The `npm i -g` question answers itself: don't, from a worktree.
9. **Merge-back**: `git rebase main` in the worktree was clean, `## Unreleased` included (737 green
   after). Landing is one `git merge --ff-only trial/idea-120` run IN the main checkout — the single
   moment the shared tree is touched, and git refuses rather than clobbers if a peer holds a dirty
   copy of a touched file. Never `git push . HEAD:main` from the worktree: it would move main's ref
   under a checkout whose files didn't move.
10. **…and it did refuse — the finding that matters most.** A peer working *in the main checkout*
    held an uncommitted row in `docs/ideas/INDEX.md`; the fast-forward touched that file, so git
    aborted (safely — nothing of theirs moved). Main also moved twice while landing (peer commits), so
    the rebase ran three times. The INDEX change came out of the branch and went in by the old blob
    dance. **Worktrees retire the staging pain only when the main checkout is nobody's workbench:**
    if one session still edits there, every landing that touches a shared file waits on it. The rule
    has to be all sessions, or it is a fourth rule beside the three.

## Tasks

- [x] Trial in one session on a one-file change; record what broke. (2026-10-05, above)
- [x] Rewrite the three CLAUDE.md rules (no checkout, no stash/pop, stage one hunk) as one: *work in
      your own worktree; land with `--ff-only` from the main checkout.* Closes the 2026-09-13 stash
      incident (five UU files), the five staging sweeps, and the `index.lock` collisions. **Ajesh's call**
      — CLAUDE.md is read by every peer, and the rule changes how all of them work.
- [x] `scripts/worktree.js <ID>` — create the work's worktree at local HEAD or join it if it exists;
      link the derived gitignored records; exclude the links; list open work; land (rebase, then
      `--ff-only` from the main checkout, refusing loudly); `done` (unlink, remove, delete the merged
      branch). Was gated on the rule; Ajesh 2026-10-05 said build it with the rescope.
- [x] The session start names the open work (the reentry hook): one line — which worktrees exist, how
      far ahead, how fresh — so a new window can say "that's mine" and join. Silent with none.
      Built 2026-10-05: `hooks/lib/open-work.js` (shared by the hook and the script),
      `test/worktree-script.test.js`. Building it found one more trap: a `dir/` ignore rule matches
      nothing in `check-ignore --stdin` unless the path carries its trailing slash.
      Built inside `.claude/worktrees/idea-120` and landed with the script itself.
- [x] Correct CLAUDE.md's gitignored list (finding 6) or point it at the derivation instead.
- Done 2026-10-05 (Ajesh: *"fine to make changes to claude as needed"*): CLAUDE.md's concurrent-
  sessions bullet now says *each piece of work gets its own worktree; the main checkout only lands*,
  with editing in main kept as the named fallback; the gitignored list points at the derivation.
  Only checkout and lane-claims were in CLAUDE.md — the stash and stage-one-hunk rules lived in
  memory, now pointed at this rule. Landed by hunk from main: a peer's uncommitted CLAUDE.md
  paragraph would have stopped a worktree landing (finding 10, live).
- [ ] **Found 2026-10-05 (IDEA-145's session): `check:refs` scans `.claude/worktrees/`.** With one
      worktree open it read 1,453 markdown files instead of 873 and reported a broken link in the
      worktree's copy of `landing/SKILL.md` (a link to a gitignored file the worktree doesn't link);
      gone the moment `done` removed it. So `npm run check` can go red on a false finding whenever
      any session has a worktree open. Likely fix: skip `.claude/worktrees/` in the scanners' walk —
      reproduce first (open a worktree, run `check:refs`), and look for the same walk in the other checks.
