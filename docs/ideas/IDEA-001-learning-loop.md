---
id: IDEA-001
type: idea
owner: product-lead
status: shipped
gist: The two-way router that closes Principle #1 — a proven pattern goes UP into BOSS's library as a reusable practice, or DOWN into the app's own core, and `boss sync` carries it back to every project.
proof: src/learn.js
created: 2026-05-21
shipped_on: 2026-05-21
---

# Learning loop — `/boss-learn` (two-way router) + `/boss-sync`

## Current shape
- **What:** Close the bidirectional loop from PRINCIPLES #1. `boss learn` stages a proven pattern
  and routes it: **UP** into `library/` as a reusable superset practice (bump VERSION + CHANGELOG),
  or **DOWN** as guidance to harden it into the app's own core. `boss sync` brings an existing
  project's BOSS-managed files (skills/agents for installed modes) up to the current version, as a
  reviewable diff, then bumps the project's `.boss` pin.
- **Who it's for:** every connected project (esp. `margin`, stuck on v0.2.0) + BOSS itself.
- **Smallest version:** `boss sync` preview + `--apply` for skills/agents of installed modes;
  `boss learn <path> --as <category>` to copy a file UP + version bump. Skills wrap with judgment.

## Capture log
- 2026-05-21 — decided `/boss-learn` is a two-destination **router** (UP=BOSS practice, DOWN=app core), not one-way.
- 2026-05-21 — **shipped in v0.8.0.** `boss sync [--apply]` (DOWN distribution, label reconciliation,
  pin bump), `boss learn <path> --as <cat>` (UP into `library/`, VERSION+package.json+CHANGELOG),
  `claude-append.md` in `boss unlock` (additive CLAUDE.md), and the `/boss-sync` + `/boss-learn`
  skills. Proven end-to-end by syncing `margin` 0.2.0 → 0.8.0.

## Open questions (carried forward)
- Sync of user-editable files (CLAUDE.md, settings.json) — merge vs leave. v1 syncs BOSS-managed
  skills/agents only; the synced `margin` still carries its old `L0-sketch` CLAUDE.md header (cosmetic).
- `boss sync` never *removes* files a mode dropped — additive only. Revisit if a mode deprecates a skill.

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
