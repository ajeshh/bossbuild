---
id: DEC-019
type: decision
owner: "@ajeshh"
decided_by: AI-suggested-ratified
status: decided
created: 2026-09-13
confirmed: 2026-09-12 — Ajesh, on the recommendation ("yes, as a DEC with a falsifier, and I'd implement it in the same pass"): "keep going on both"
reversibility: reversible — three files change back (CLAUDE.md rule 5, scripts/release.js, the CHANGELOG heading); nothing a founder installed depends on it
revisit_by: 2026-10-12
falsifier: a collision on the `## Unreleased` section, or a session that cannot tell what shipped from what merely landed, by 2026-10-12 → revert
---
# DEC-019 — a version is stamped when it is published, not when a capability lands

> Written the night the board assessment (`docs/retros/2026-09-12-board-assessment.md`) found that
> eight of seventeen reviewers had converged, independently, on the same line: the version is the
> wrong unit.

## Context

CLAUDE.md rule 5 said *every capability bump = VERSION bump + CHANGELOG entry*. With six concurrent
sessions that produced ~11 versions a day (76 in the week to 2026-09-12), five collisions on one
integer, a manual mtime handshake in prose, and `npm` 18 versions behind — because publishing is
Ajesh's act alone and happens every few weeks. The canvas lists release count as an anti-metric; it
was the only number moving. A founder can install only a published version, so between publishes
every number BOSS minted was a number nobody could receive.

## Decision

A capability lands as a **commit plus a bullet under `## Unreleased`** at the top of
`registry/CHANGELOG.md`. `VERSION` does not move. When Ajesh publishes, `npm run stamp`
(`scripts/release.js --stamp`) turns that heading into the next number and date, moves `VERSION`,
`package.json` and `plugin.json` with it, and runs the gate; then `npm publish` as before. Stamping
is explicit — running the gate never mints a version.

## Why

- The collision unit disappears: sessions append lines to one section instead of contending an
  integer. Conflicts get cheaper, not gone.
- "N behind" stops being a number: landed-but-unpublished is the ordinary state, named honestly by
  `VERSION is honest` (stale reads and hand-bumps without an entry still fail).
- Founders and `boss sync` see only stamped versions — `parseEntries` never read an unversioned
  heading, so nothing downstream changed.
- One releaser, one act. The release becomes a thing Ajesh does on purpose rather than a side effect
  of every session's afternoon.

## Consequences

- CLAUDE.md rule 5 and the operating-conditions paragraph on collisions are rewritten; the RESUME
  prompt's per-capability ritual loses the bump.
- The `For you:` rule applies to the Unreleased section as a whole once stamped: write bullets the
  way a stamped entry reads.
- What this does not fix: nobody receiving the releases. That is outreach, still.
