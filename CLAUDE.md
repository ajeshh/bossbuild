# CLAUDE.md — BOSS

> BOSS is **self-hosted**: its own first project (mode: MVP). What it *is*: [`PRINCIPLES.md`](PRINCIPLES.md)
> (quote its one-line definition, don't rewrite it). How the code is built: [`docs/ENGINEERING.md`](docs/ENGINEERING.md).
> Every rule below carries its record id; the history is in that record and the devlog.

## Working rules

1. **Read [`docs/RESUME.md`](docs/RESUME.md) at session start; update it at session end.**
2. **Apply BOSS's principles to BOSS.** Especially #1: when work pauses, sort patterns UP (BOSS practice) or DOWN (BOSS's own code).
3. **Capture before building.** Ideas → `docs/ideas/IDEA-NNN`, tracked in `docs/ideas/INDEX.md` — **grep it, never read it whole** (~168 KB, ~42k tokens). Every IDEA here is `kind: capability`; BOSS's venture is the canvas (IDEA-114).
3b. **Write a found task down before you act on it** — in the record of the work you're in: its *Tasks* (a FEAT's *Found while building*), a program's *Tasks*, or *Open questions*. A **task** stays on a list, **new scope** gets its own id, an **open question** is written as a question. Every session start, compaction and `/clear` included, reads those back (IDEA-153); what is only in the chat is not. `task-hygiene` fires on a timestamp — a reminder, never a referee.
3c. **When compacting, keep:** the worktree and record id, the files changed and why, the decisions made, and every task or question not yet written into a record.
4. **Zero-dependency CLI.** `src/` uses Node built-ins only; machine state is JSON (`.boss/`, `registry/`).
5. **Every capability = a commit + a bullet under `## Unreleased` in `registry/CHANGELOG.md`**, beneath its weight heading (*What you'll notice* · *Smaller improvements* · *Under the hood*; IDEA-151). **VERSION does not move** (DEC-019) — Ajesh stamps at publish. A bullet written after a stamp goes under Unreleased, not the stamped version. BOSS-only plumbing gets no bullet.
   **The CHANGELOG never shows research** (Ajesh, 2026-10-04): no founder's or user's words, quoted or paraphrased; no EVID, interview or session content, grades or counts; no RVW verdicts or their sources. Product terms only — *"a founder couldn't tell where they were"* is the most it says. It is public and ships to every founder.
6. **Test the CLI before claiming done**: a throwaway in `/tmp` with `BOSS_HOME=$(mktemp -d)`, exercise it, delete both. Without `BOSS_HOME`, prune the `~/.boss/registry.json` row by hand.
   For a lived-in project, `npm run demo` (IDEA-149): Kettlewick outside the repo with its own `BOSS_HOME`; `source $TMPDIR/boss-kettlewick/env.sh`, `--fresh` rebuilds.
7. **Small, reversible steps.** One concern per change. Don't break the working `boss` CLI. Before `land`, a fresh subagent reads the diff against the record and names what no task names (IDEA-158); you decide what stays.
8. **Reproduce before you fix or gate.** If the test passes on the old code, there is no bug: record that, ship nothing.

## Operating conditions of this tree

- **Concurrent sessions are the norm.** Each piece of work gets its own worktree; the main checkout only
  lands (IDEA-120). `node scripts/worktree.js <ID>` creates it — or **joins** a peer already on that id,
  so check `git log --all` for the id first. `land <ID>` rebases and fast-forwards main, and stops if
  main holds a dirty copy of a file the work touched; `done <ID>` removes it. Never `git checkout` a
  branch in the main checkout; never `git stash` anywhere (one stack for every worktree — to compare
  against a clean baseline, `git show HEAD:<file>` or a throwaway worktree). In the main checkout (the fallback): `git
  status` first, stage only your own hunks.
- **Tracked vs gitignored** (IDEA-087): `.gitignore` is the list. The test for tracking is *"fine public
  forever?"*, never *"is the repo private"*. Real people's words (`evidence/`), the brain (`.boss/`),
  research inbox/sessions, `ideas/CANVAS.md` (Ajesh's) stay out.
- 🔴 **Never open a file for writing before you have finished reading it** — `open(p,'w')` truncates on
  open. Read fully, close, then write, or compose to a new path and `mv`. Two gitignored single-copy
  files were lost this way and to `boss remove --apply` in this checkout; **never "restore" a lost
  record by re-deriving it** — that manufactures a record nobody wrote.
- **`npm publish` and `npm run bump:formula` are Ajesh's.** `check:published` is their number, not a task.
- **Every commit runs the staged tree through `npm run test:ci`** (`scripts/hooks/pre-commit`; `npm run
  hooks` turns it on per clone). **Verify with `npm run check`**, never a loop over `check:*` (several
  exit 0 without `--strict`). `node scripts/release.js` is not read-only — it regenerates docs and `site/`.
- **A new gate needs a bug that reached a user** (Ajesh, 2026-09-23); name that bug in its header.
- **Site work:** `docs/programs/PROG-001` — subtract before you add a page; preview the built `site/`,
  never `web/*.html`.
- **Commits** use the GitHub noreply env-var, never global config:
  `NR=$(gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"')`. After CLI changes:
  `npm i -g ~/Projects/bossbuild`; `npm run pack:preview` confirms only the package ships.
- **Confirm the altitude before analysing**: *BOSS's own practice* and *what BOSS ships a founder* are the
  same files. Ask which one is meant; the npm `files` list is the exact test of what ships.

- **One home per fact** (IDEA-158). A rule for every session → this file · about Ajesh, how they decide
  → auto-memory · a decision → `docs/decisions/` DEC · a pattern with cases → a record
  (`docs/research/heuristics/`, gitignored) and memory keeps the lesson + pointer · what's in flight → its
  record · what's next → RESUME · what happened → devlog. A fact in two homes drifts; move, don't copy.

## Where things are

`bin/boss`, `src/` (the CLI) · `stages/L{0..3}-*/` (what each mode ships — agents, skills, hooks) ·
`library/` (practices, sources) · `registry/` (CHANGELOG, supersedes) · `docs/` (ideas, programs,
decisions, RESUME, devlog) · IDs and frontmatter: `docs/IDS.md` · agents: `docs/MENTORS.md`.
