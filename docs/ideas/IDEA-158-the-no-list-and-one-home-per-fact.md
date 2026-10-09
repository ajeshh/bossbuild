---
id: IDEA-158
type: idea
kind: capability
owner: product-lead
status: shipped
shipped_on: 2026-10-07
proof: test/working-state.test.js
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
  Kept after the scope review named them as unasked: the heading match also takes *not doing*, *won't
  do*, *decided not* (the same no, other words); the no-list reads back **before** the open work (the
  first thing read is the one heeded); and the FEAT template's *Out of scope* now says it is read back
  (a founder writing it should know it is load-bearing).
- [x] **T2 · One home per fact.** Done 2026-10-07: 33 → 27 memories; the index 4,425 → 3,922 bytes,
  with the sort rule at its top. Retired (each read first; the only unique lines moved to CLAUDE.md):
  never-stash-pop, changelog-never-shows-research, internal-plumbing, confirm-the-altitude,
  peer-session-version-collision (its procedure used `git stash`, now forbidden), resume-is-a-briefing.
  Moved whole, summary included: checkers-state-intents (53 KB) and vet-verify-attribution (19 KB) →
  `docs/research/heuristics/`; memory keeps a ~1 KB lesson + pointer. `boss-ethos` stays — it is about
  Ajesh, which is what memory is for. Was: A rule for every session → CLAUDE.md · about Ajesh → memory · a
  decision → DEC · a pattern with cases → a record, memory keeps the lesson and a pointer. Retire the
  duplicates (after checking each holds nothing CLAUDE.md lacks); move the three case logs to
  `docs/research/heuristics/` (gitignored — memory was never public); the sort rule into CLAUDE.md.
- [x] **T3 · A scope check that didn't build it.** `/log`'s "built that nobody asked for" runs in a fresh
  subagent that sees only the diff and the record, reports only what no criterion, task or found item
  names, and never deletes. BOSS's own land gets the same line.
- [x] **T4 · Tests, CHANGELOG, land, push.** The scope review ran on this branch before landing (a fresh
  subagent, diff + record only): nothing crossed the no-list; three unasked items named, kept, recorded above.

## Found while building

- [ ] ~50 EVID and ~140 RVW citations still sit in older CHANGELOG entries (the 2026-10-04 research rule
  removed 13 quotes; the rest was left for a pass "when no peer is mid-release on the file"). Carried
  here from the retired memory — it was a task living in memory, the thing T2 stops.
- [x] **The scope review needs modes** (Ajesh, 2026-10-08: *"maybe a text review or a code review, or
  bypass options"*). Rule 7 runs one review for every land; a change that is only a record and an INDEX
  row (IDEA-170's) got the same line as a code change. Shape it: a text review (does it say what the
  record says, nothing it doesn't), a code review (what got built unasked), and a named bypass, recorded
  when used. **Decided (Ajesh, 2026-10-08): the diff picks by default**, so only records and docs
  changed means a text review and any code means a code review. The bypass is always a deliberate choice,
  so a review is never skipped by accident. Done 2026-10-08 in `scripts/worktree.js`: `review <ID>` names
  the mode and lists each file as text or code (`.md`/`.txt` is text, anything else is code); `land` says
  which review the diff called for; `land <ID> --skip-review "why"` refuses without a why and keeps it as
  a note on the tip (`git log --notes=review`). Kept as a nudge, not a gate: no bug reached a user, so
  `land` names the review and never refuses for want of one.
- [ ] Does the founder's `/log` scope check (its done step, `stages/L1-mvp/.../log/SKILL.md`) get the same
  two modes? It reviews a FEAT's diff, which is nearly always code, so the case is weaker there; left
  for when a founder's docs-only FEAT is seen.

## Log

- 2026-10-07 · captured; built in worktree `idea-158`.
- 2026-10-07 · shipped: T1–T3; the scope check dogfooded on its own branch.
