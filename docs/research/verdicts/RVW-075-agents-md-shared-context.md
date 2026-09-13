---
id: RVW-075
type: verdict
owner: product-lead
status: recorded
created: 2026-08-17
verdict: ADAPT
route: UP library/practices/context-discipline.md
---

# RVW-075 — AGENTS.md is the cross-tool shared context; a team's context file shouldn't be one founder's tool config

## The claim
- **Source:** AGENTS.md — OpenAI (Aug 2025) → Linux Foundation's Agentic AI Foundation (late 2025), the
  same steward as MCP. Reported read by 20+ tools / 60,000+ repos.
- **Core assertion:** `context-discipline.md` is `host: claude-code` and CLAUDE.md-centric, which stops
  being coherent the moment there are two founders — the shared layer belongs where every tool reads it.
- **Inbox file:** `docs/research/inbox/agents-md-shared-context-across-tools.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — the commitment was already made.** BOSS shipped the AGENTS.md/CLAUDE.md split at **v0.58.0 (2026-06-20)**, with the CHANGELOG citing **#5** (optionality) and **#4** (stack-neutral) and calling it a down-payment on [[IDEA-006]]. Documenting a shipped decision commits BOSS to nothing new. The live tension is the reverse: the practice as written *fought* the shipped product. |
| 2 | Evidence grade | **Split.** (a) Host mechanism: **PRIMARY** — verified 2026-08-17 against `code.claude.com/docs/en/memory` ("Claude Code reads `CLAUDE.md`, not `AGENTS.md`… create a `CLAUDE.md` that imports it"), and independently verified once before at v0.58.0. Strongest grade on the shelf. (b) Adoption figures (20+ tools / 60k repos / 170+ members): **THOUGHT-LEAD, unverified — banned from practice text.** (c) The team-pain story: **n=0 observed.** |
| 3 | Duplicate or sharpen? | **Product-level duplicate; practice-level real defect.** As an adoption pitch it's dead — v0.58.0 ships it. But `context-discipline.md` was **reviewed 2026-08-11, seven weeks *after* the split shipped**, and still said project constraints belong in `CLAUDE.md` while mentioning AGENTS.md **zero** times. Followed literally, BOSS's own context practice told a founder to put host-neutral rules in the Claude-only file — forking the shared layer BOSS's own scaffold creates. This is the `check:refs` class of bug (a reference is a dependency), not acceptable silence. |
| 4 | Who serves / harms? | The **team framing serves a cohort of zero** — killed. But the split also serves the **solo** sharp-fit cohort as the canvas defines it (*"used Claude Code **or Cursor** 3+ months"*): a solo `vibe-virtuoso`/`indie-hacker` switching tools, and `eng-builder`, who spots the practice-vs-scaffold contradiction instantly. Confusion risk for `first-product`/`vibe-coder-newbie` is contained — **their scaffold already contains both files**; today the practice fails to explain what they can already see. |
| 5 | Cost / ceremony | ~10 lines in one existing practice. No new file, no mechanism, no CLI change. **EVID-001:** the freeze is on *offering*-building; this is shelf maintenance that **removes a contradiction** — compose-shaped, not surface growth. It still adds lines (Risk #1), so it is capped at one bullet pair. |

## Verdict: ADAPT (narrow) — reject the claim, keep the defect it found
The claim's own ask is a duplicate: v0.58.0 shipped exactly that, verified against the same primary
page, two months before this inbox item was written. Its motivating story serves a cohort with zero
validated members and its adoption numbers are unverified — all rejected. What earns the ADAPT is the
drift the vet exposed: BOSS's context practice was swept *after* the split shipped and still directed
founders to do the thing the scaffold exists to prevent. Aligning the practice with BOSS's own shipped,
verified decision isn't adopting a stranger's claim — it's fixing a broken internal reference.

## What changed (`library/practices/context-discipline.md`, move #1)
One bullet pair replacing the bare `@path` imports line: the **primary-verified** host behavior (Claude
Code reads `CLAUDE.md`, not `AGENTS.md`; the import is the bridge), which side of the cut a new rule
belongs on, the Windows symlink caveat, the `/init` + `/import` adoption paths with the one-time-copy
drift warning — and the token-honesty point re-scoped: the split saves **zero** tokens, so the "keep it
tight" budget applies to `CLAUDE.md` + `AGENTS.md` **combined**.

**Explicitly rejected:** the team-collaboration framing as motivation (no cohort) · any
`mentor-cofounder` line · the adoption figures · an AGENTS.md generator or multi-tool context-sync
feature (the inbox file's own prohibition, held) · re-opening [[IDEA-006]].

**Re-open condition (rejected team half):** the first *observed* real-team session — then a one-line
team framing ("shared layer is a commons; the tool file is personal config") becomes vet-able.

## Notes
- Prior related: v0.58.0 / IDEA-032 (the shipped scaffold this duplicates), [[IDEA-006]] (portability —
  stays parked), [[IDEA-037]] (founding-teams lead), [[RVW-001]] / [[RVW-002]] (the lean-CLAUDE.md
  budget this re-scopes to the combined pair), [[RVW-019]] (the MCP/AAIF governance thread).
- BOSS version when recorded: 0.150.0
