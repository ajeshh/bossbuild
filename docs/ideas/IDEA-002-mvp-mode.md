---
id: IDEA-002
type: idea
owner: product-lead
status: shipped (v0.14.0)
gist: The 'ready to build the first working version' layer, authored by extracting the practices already working in this repo UP into a mode: /spec + FEAT, a smoke gate, the devlog, /close.
proof: stages/L1-mvp/manifest.json
created: 2026-05-21
shipped_on: 2026-05-22
---

# Author MVP mode (L1-mvp)

## Current shape
- **What:** The "ready to build the first working version" layer. Authored by **extracting the
  practices already working in this very repo UP** into `stages/L1-mvp/{manifest.json,template/}`.
- **Contents:** `/spec` + `FEAT-NNN`, `/smoke` build gate (stack-configured), devlog + `/log`,
  `/close` + `RESUME.md` convention, `tester` + `program-manager` agents. Additive `claude-append.md`.
- **Who it's for:** any project graduating from Quickstart; BOSS itself (currently MVP, hand-retrofitted).
- **Smallest version:** manifest + template with the skills/agents above; `boss unlock mvp` works;
  additive CLAUDE.md append (no overwrite of user files).

## Capture log
- 2026-05-21 — `applyStage` overwrites files; MVP must add NEW files only + append to CLAUDE.md via a `claude-append.md` mechanism (build into `boss unlock`).
- 2026-05-22 — **Shipped in v0.14.0.** `stages/L1-mvp/{manifest.json,template/}` authored. Skills: `/spec` (`IDEA→FEAT-NNN`), `/smoke` (stack-configured via `.boss/smoke.json`), `/log` (devlog), `/close` (RESUME ritual). Builder agents: `tester` (surfaces, doesn't fix), `program-manager` (the *when*). Mentor agents: `mentor-architect` (load-bearing decisions + what to defer), `mentor-gtm` (first 100, humane before viable). Working rules via `claude-append.md` — additive under `boss:L1-mvp` marker; never overwrites Quickstart. End-to-end tested in `/tmp`: scaffold → unlock mvp → 4 skills + 4 agents land, CLAUDE.md gets the MVP block, stamp merges correctly, re-unlock is a no-op, `boss sync` shows everything as up-to-date.

## Open questions
- `/smoke` is stack-specific — template ships a placeholder smoke skill the spin-up fills per stack.

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
