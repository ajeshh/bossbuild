---
id: IDEA-153
type: idea
kind: capability
owner: product-lead
status: shipped
shipped_on: 2026-10-06
proof: test/working-state.test.js
created: 2026-10-06
relates: IDEA-078, IDEA-094, IDEA-102, IDEA-120
gist: The work in flight survives a compaction — a feature's and a program's working state live in their own records, and the session start re-loads them after a compaction instead of staying silent.
---

# IDEA-153 — Context that survives the session

Ajesh, 2026-10-06, after an assessment of how BOSS keeps context (its own practice and what it ships),
measured against the host's docs and published research: *"its not just feature context, but program
context as well. so yes lets do all of that work. and fix or improve all above and anything new we
need to adopt lets do it."*

## What the assessment found (measured 2026-10-06)

- **Compaction is unguarded, and the one seam the host sanctions is switched off.** IDEA-078 framed the
  cue as `PreCompact`; the host's hooks reference says `PreCompact` can only block and `PostCompact`
  only observes — the way back in is `SessionStart` with `source: compact`. `reentry.js` returns early
  on exactly that source.
- **The working-state file is in the one place compaction drops.** `.claude/rules/feature-context.md` is
  path-scoped, and the host's context-window doc says path-scoped rules are summarised away at
  compaction (they reload only when a matching file is read again). BOSS's own copy still described
  FEAT-030 from September: `/close` step 1b promised to compress it and didn't. IDEA-078's re-open test
  ("a real project has a feature-context.md someone wrote") is met here — and what it shows is rot, not
  emptiness.
- **Program state has no carrier at all.** A PROG record holds *Rules every change carries*, *Tasks* and
  *Open questions*; nothing re-loads them when a member is being built, and the template's `Program:`
  line pointed at the record without bringing any of it.
- **The conscience's injection was over the host's cap — and is not now.** 80 fires logged since
  2026-09-09; 17 were 10,155–13,153 chars. The hooks reference (checked 2026-10-06): past 10,000 the host
  saves the string to a file and passes a path plus a 2,000-character preview, so most of those frames
  never reached the model. **All 17 are from before 2026-09-24**, when IDEA-121's one-voiced-frame cut
  reached this install; every fire since is 5.6–6.6k. The assessment's first read ("heavy, and over the
  cap") was wrong about the present — corrected here by dating the ledger before fixing anything.
- **Size windows count lines, not bytes** — and size is the cost (Ajesh, 2026-10-06: *"i thought its not
  abt lines but size"*). RESUME 199/200 lines = 18 KB; `docs/ideas/INDEX.md` 199 lines = 168 KB (~42k
  tokens to read whole). The shipped CLAUDE.md + AGENTS.md, by mode: Quickstart 7.0 KB (~1.7k tokens/turn)
  · MVP 13.0 KB (~3.3k) · V1 16.3 KB (~4.1k) · Scale 19.8 KB (~5.0k).
- **BOSS's own traces are off.** `auto-log.js` (SubagentStop) is unregistered here, so `/judge-traces` has
  nothing to read in the repo that makes it.
- **Rule 3b leans on a moment that cannot see the files** (task-hygiene is time-only since RVW-098).

## Tasks

- [x] **T1 · Working state lives in its record.** The FEAT template carries *Found while building* and
  *Open questions*; a PROG's *Rules every change carries / Tasks / Open questions* are its working state.
  `feature-context.md` retires from the MVP template; a founder's existing one is still read (never deleted).
- [x] **T2 · `lib/working-state.js`** — which work is in flight (the worktree's id first, then FEATs
  `status: building`), its program, and the open lines of each, capped well under the host's limit.
- [x] **T3 · `reentry.js` answers `compact`** (and `clear`, and a worktree's start) with the working state.
  It writes nothing.
- [x] **T4 · `/spec`, `/close`, task-hygiene, moment frames, coder, claude-append, CLAUDE.md rule 3b**
  point at the record instead of the rules file.
- [x] **T5 · `/spec` ends with a fresh session to build** (the plan travels in the record, not the chat),
  and an approved plan is written into the FEAT's Build log.
- [x] **T6 · A compaction-steering line** in the shipped CLAUDE.md and BOSS's own.
- [x] **T7 · Conscience injection under the cap** — reproduced first: fixed since 2026-09-24 (above). A test
  holds the worst case (every moment × every cohort, caps full) under 10,000.
- [x] **T8 · Size, not lines.** BOSS's CLAUDE.md says to grep the index, never read it whole (with its
  size). V1 and Scale stop listing what `boss map` lists. **Not built: a `boss status` size warning** —
  BOSS's own Scale scaffold is ~5k tokens, so it would fire on every Scale project for BOSS's text.
- [x] **T9 · Quickstart's compaction** — no FEAT yet, so the re-load is the idea's current shape.
- [x] **T10 · BOSS's own traces on** — register `auto-log.js` in this repo's settings.
- [x] **T11 · The practice catches up** — `context-discipline` (compaction re-entry, rules lost at
  compaction, steering, hook context persists, lost-in-the-middle, the context-file study, the host's
  side-question / partial-summary / completion-condition commands), `retrieval` (lost-in-the-middle).
- [x] **T12 · IDEA-078 reopened and absorbed here**; INDEX rows; CHANGELOG.

## Found while building

- [ ] **The MVP rules are dense** — `claude-append.md` is ~6 KB in 53 lines, the largest single cost in a
  founder's always-loaded files. A rewrite for size is founder-facing voice work: Ajesh's call, not done here.
- [ ] **BOSS's own `.claude/rules/feature-context.md`** (main checkout, gitignored) is retired: its two live
  questions moved to PROG-003. Deleting it was refused to this session — Ajesh deletes it; until then the
  re-load shows its leftover lines as legacy.
- [ ] **`retrieval.md` is due 2026-10-21** — lost-in-the-middle landed in `context-discipline`; the
  practice's own sweep is `/practice-refresh`'s, not this record's.

## Open questions

- Should every session start in the main checkout re-load *all* building FEATs, or only a worktree's? Built:
  all (max two in full). Watch whether it reads as noise in a project with several in flight.

## Considered, not adopted (and why)

- **JSON for state the agent must not rewrite** (the long-running-harness post). BOSS's criteria are
  ticked only by `/log` with evidence, in a file the founder reads; JSON would trade the founder's reading
  for a guard against an overwrite nobody has seen here. Re-open on one overwritten criterion.
- **`isolation: worktree` on the shipped `coder`.** BOSS's worktree flow is explicit and founder-visible;
  a builder that silently forks the tree splits the founder's work where they can't see it.
- **`/doctor prompt-audit`.** Named in the assessment from the research pass; not found at source. The host's
  `/doctor` "proposes cuts for content it can derive from the codebase" — that is in the practice instead.
- **A gate on INDEX.md's size.** A gate needs a bug that reached a user (CLAUDE.md); this one reaches
  only BOSS's own sessions. The rule in CLAUDE.md is the right weight.

## Log

- 2026-10-06 · captured from the assessment; built in worktree `idea-153`.
- 2026-10-06 · built: `lib/working-state.js`, `reentry.js` on every source, FEAT template sections, `/spec`
  6b/8/9, `/close` 1b, task-hygiene reads the records, CLAUDE.md compaction lines (shipped + BOSS's),
  practices, `auto-log` on in BOSS's own settings. Tests: `test/working-state.test.js` (the compaction
  ones fail on the old hook).
