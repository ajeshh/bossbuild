---
id: IDEA-158
type: idea
kind: capability
owner: product-lead
status: building
created: 2026-10-07
relates: IDEA-153, IDEA-157, IDEA-150
gist: What was decided NOT to do survives a compaction, what got built beyond the record is named by a reviewer that didn't build it, and every fact has one home.
---

# IDEA-158 — The no-list, and one home per fact

Ajesh, 2026-10-07: *"one of my assumption is that it compensates also for claude to go off and build
something extra or a bit much. and also how we store and organize the memory.. open to ideas"* — then
*"go for it"* on the three steps below.

## The read behind it

Over-building has three causes, and context fixes one:

1. **It forgot what was decided.** A compaction summary keeps what was done and drops what was decided
   *not* to do. IDEA-153's re-load brings back open criteria, found tasks, questions and program rules —
   not the no-list. → T1.
2. **Eagerness** — the flag, the refactor along the way, the tidy-up. Measured in IDEA-150: 2 of 3 runs
   deleted an unused component unasked, against the scaffold's own *ask before deletes*. `/log` already
   says "what got built that nobody asked for", but the session that built it is the one grading it. → T3.
3. **Saying more than it knows** — verification, not context (rule 8). Three in one session on
   2026-10-06, all caught by Ajesh. Not this record's.

Memory, measured 2026-10-07: 34 auto-memory files; six repeat rules CLAUDE.md now holds; three had
become case logs (53 KB, 19 KB, 10 KB). → T2.

## Tasks

- [x] **T1 · The no-list comes back after a compaction.** `working-state.js` reads *Out of scope*,
  *Considered, not adopted* and a program's refusals, labelled *Decided not to do*.
- [x] **T2 · One home per fact.** Done 2026-10-07: 34 → 28 memory files; the index 4,425 → 3,922 bytes,
  with the sort rule at its top. Retired (each read first; the only unique lines moved to CLAUDE.md):
  never-stash-pop, changelog-never-shows-research, internal-plumbing, confirm-the-altitude,
  peer-session-version-collision (its procedure used `git stash`, now forbidden), resume-is-a-briefing.
  Moved whole, summary included: checkers-state-intents (53 KB) and vet-verify-attribution (19 KB) →
  `docs/research/heuristics/`; memory keeps a ~1 KB lesson + pointer. `boss-ethos` stays — it is about
  Ajesh, which is what memory is for. Was: A rule for every session → CLAUDE.md · about Ajesh → memory · a
  decision → DEC · a pattern with cases → a record, memory keeps the lesson and a pointer. Retire the
  duplicates (after checking each holds nothing CLAUDE.md lacks); move the three case logs to
  `docs/research/heuristics/` (gitignored — memory was never public); the sort rule into CLAUDE.md.
- [ ] **T3 · A scope check that didn't build it.** `/log`'s "built that nobody asked for" runs in a fresh
  subagent that sees only the diff and the record, reports only what no criterion, task or found item
  names, and never deletes. BOSS's own land gets the same line.
- [ ] **T4 · Tests, CHANGELOG, land, push.**

## Found while building

- [ ] ~50 EVID and ~140 RVW citations still sit in older CHANGELOG entries (the 2026-10-04 research rule
  removed 13 quotes; the rest was left for a pass "when no peer is mid-release on the file"). Carried
  here from the retired memory — it was a task living in memory, the thing T2 stops.

## Log

- 2026-10-07 · captured; built in worktree `idea-158`.
