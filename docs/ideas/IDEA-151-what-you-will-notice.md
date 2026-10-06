---
id: IDEA-151
type: idea
kind: capability
owner: product-lead
status: shipped (S1–S5, 2026-10-05; open: O1, O2)
shipped_on: 2026-10-05
proof: src/changelog.js
proof_note: done when every Unreleased bullet carries a weight (the stamp refuses one that doesn't), `boss whatsnew` leads with What you'll notice, and the first command after an update says so once.
gist: Release notes that separate what a founder will notice from the rest, and a line after an update that says what changed. The weight lives on each bullet, written by whoever writes it.
created: 2026-10-05
relates: DEC-019, IDEA-102
altitude: what BOSS ships a founder (the notes and the update line); the writing rule is BOSS's own practice
---

# IDEA-151: What you'll notice

## Current shape

- **What:** every CHANGELOG bullet sits under one of three headings: *What you'll notice*, *Smaller
  improvements*, *Under the hood*. Every reader groups by them, and the first `boss` command after an
  update says once what changed.
- **Why:** Ajesh, 2026-10-05: *"when people update boss locally, how do we inform them that with the
  upgrade, these are all the new features? … our release notes dont really distinguish important end
  user func vs the rest."*
- **The bug behind the check:** the founder half was one `> **For you:**` line per release. DEC-019
  made a release a bundle of 20–60 bullets and the line stopped being written (0.327.0: 1; 0.328.0,
  0.329.0: 0). `boss whatsnew` on 0.329.0 printed *"Internal release — nothing here changes what you
  do"*, and the site's What's new stopped at 0.327.0. The weight moved to the unit that exists now.

## Slices

- [x] S1 `src/changelog.js`: `WEIGHTS`, `weighed`, `unweighed`, `founderFacing`, `addUnreleased`,
      `newsBetween`; the stamp drops empty headings and reseeds all three.
- [x] S2 Readers: `boss whatsnew` (notice in full up to six, improvements one line each, the rest as a
      count; old releases keep For-you), the site's What's new and feed, `/boss-sync` step 0.
- [x] S3 Writers: `boss learn` writes under *Smaller improvements*; `npm run stamp` refuses a loose
      bullet; a test keeps Unreleased weighed at every commit.
- [x] S4 After an update: `~/.boss/seen-version.json` (local, no network); one line on the first
      command at a terminal after the version moves. A first run or downgrade is silent.
- [x] S5 Backfill: Unreleased (35), 0.329.0 (22), 0.328.0 (12) sorted; text unchanged.

## Open

- O1 Founders who never type `boss` (they live in Claude Code) don't see the update line. The
  project's hooks ship alone and can't see the install. Possible: SessionStart compares the
  project's pin with `boss version` when the CLI is on PATH. Wait for a founder who missed an update.
- O2 Releases 0.327.0 and older stay on the For-you reading; backfilling them is not worth it.
