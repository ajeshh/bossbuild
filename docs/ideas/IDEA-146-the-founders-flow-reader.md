---
id: IDEA-146
type: idea
kind: capability
owner: mentor-architect
program: PROG-002
status: deferred (trigger: the first observed break in a flow the founder made, or in a BOSS file they edited — every break so far was in files BOSS ships, which BOSS's own build already catches)
proof: none
proof_note: nothing built. Likely lives inside an existing verb (`boss map` or `/close`), not a new one; the proof is that verb's diff when the trigger fires.
gist: The flow reader BOSS runs on its own files (registry/flows.json, check-refs class 7), turned toward the founder's project — quiet in Quickstart, counts the hand-offs the founder made as legitimate, and says one broken-flow line where they act. Never a liveliness score.
created: 2026-10-05
relates: IDEA-137, IDEA-145, DEC-003, DEC-016
spun_from: IDEA-137
---

# IDEA-146 — The founder's flow reader

Split out of IDEA-137 on 2026-10-05 (C8, with the parts that only mean anything inside it), when that
record graduated to [PROG-002](../programs/PROG-002-ecosystems.md). The full reasoning, the research
and the reader BOSS already runs on itself are in IDEA-137 § C2, C6.4 and § Mechanics M2.

## Current shape

- **What:** BOSS's own reader binds every file that reads a path to what writes it, and caught nine
  real breaks the first time it ran. A founder's project gets no such reader. This one would be
  theirs: it reads the hand-offs in *their* project — a component list the reuse check follows, a
  canvas path a skill reads — and says one line when one breaks, where they are already acting.
- **Who it's for:** a founder whose project has grown past one discipline, after something they
  edited quietly broke a hand-off.

## What it must do (each from IDEA-137, where its full text lives)

- **C8.1 · Quiet in Quickstart; speaks once, where they act.** Likely `boss map` or `/close`.
- **N6 · Ecosystems that stand alone.** Each *take* says what it does without its giver, so the reader
  can tell *not planted yet* (silent) from *the giver moved* (a break). **Without this it cries wolf on
  every young project.**
- **N14 · Flows the founder made count.** Hand-offs outside BOSS's map are legitimate, not noise.
- **C5, the founder half (H1):** a broken-flow line only — never a liveliness reading or a score; BOSS
  gives a position, never a grade (DEC-003). Falsifier for anything more: a founder asks for it,
  unprompted, twice.
- **F1 · What a founder meets** — cohort-aware wording, read by `designer` and `mentor-humane` before
  any founder-facing word ships.
- **C8.2 · Kettlewick demo record** if a new record type appears; a CHANGELOG bullet.

## Open questions

- `boss map` or `/close`? Lean: `/close` — the moment exists and is already where BOSS says one thing.
- Does a founder's flow need declaring at all, or can the reader infer it from sentences, as BOSS's does?

## Capture log
- **2026-10-05** — spun out of IDEA-137 (C8) at its graduation to PROG-002 (IDEA-145 S6; Ajesh: *"yup"*).
