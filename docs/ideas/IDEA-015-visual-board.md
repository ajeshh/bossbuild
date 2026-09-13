---
id: IDEA-015
type: idea
owner: product-lead
status: shipped
gist: A board showing what's in flight — captured, taking shape, building, shipped — so the arc is visible at a glance instead of reconstructed from scattered files. Trello in spirit; its opposite in mechanics: nothing is maintained, everything is projected.
program: the-record-system
proof: src/board.js
created: 2026-06-01
---

# Visual board — a live read of what's in flight

> Building as the `boss board` CLI command (Phase 1 shipped v0.36.0). HTML + Obsidian
> are designed-but-deferred phases below.

## Current shape
- **What:** A board that shows what's in flight — captured ideas, ones taking shape, what's
  building, what shipped — so a founder (or BOSS) can *see the arc at a glance* instead of
  reconstructing it from scattered files. Trello-shaped in spirit; the opposite of Trello in
  mechanics.
- **Who it's for:** Any founder with more in flight than they can hold in their head. Sharpest
  for the `vibe-virtuoso` cohort (many starts, weak follow-through) — but see the warning below;
  this cohort is also the one a *maintained* board would fail.
- **Smallest version that proves it:** `boss board` — a read-only terminal render derived entirely
  from files that already exist. Shipped v0.36.0.

## The decision: build the *view*, refuse the *app*

Occasioned by Ajesh's "internal kanban / fire a html site / Obsidian / almost a Trello board" idea.
Convened six advisors (mentor-venture, mentor-architect, mentor-humane, designer + two persona
reactions: vibe-virtuoso, indie-hacker). **Unanimous**, and it collapses to one fork:

- A board BOSS **renders** from state it already holds is humane and probably valuable — it
  externalizes the arc for a tired brain.
- A board BOSS **becomes** (a thing you log into, drag cards in, keep in sync) is the photo-negative
  of BOSS: an engagement surface that rewards motion over evidence, in a tool whose entire pitch is
  the opposite. It's also Canvas R&H #1 ("BOSS bloats into a heavy framework") wearing a friendly UI.

**Build the view. Refuse the app.** The founder never touches the board — they change the work
(`/triage`, `/canvas`, `/spec`) and the board re-renders. That single line is the whole product.

### Why this dissolves the "out of order / random add" worry
Ajesh's constraint — "even if something picks something out of order or randomly adds a task" — is
satisfied not by clever merge logic but by **statelessness**. A derived render has no hand-placed
positions to invalidate, so concurrent/agent/out-of-order edits can't corrupt it. An agent captures
IDEA-017 mid-flow → it just appears in the right column next render. Calm comes from there being
nothing to disturb.

## Data-model decision (load-bearing)
- **Frontmatter is truth — read the files, not `docs/ideas/INDEX.md`.** INDEX is itself a
  hand-maintained table that drifts; a board that trusts a drifting source lies. (Confirmed on the
  first run: the board read IDEA-003 and IDEA-014 as `building` from their frontmatter while INDEX
  still listed them `exploring`. The board was right; INDEX was stale.)
- **Pure projection. No `.boss/board.json`.** A board-specific state file would be a *second source
  of truth* for status — a one-way door into reconciliation logic and exactly the drift the
  conscience exists to fight. It would also violate PRINCIPLE #3 (nothing valuable locked in code)
  in its own state file. Deferred indefinitely; the rule if it's ever revisited: **a sidecar may hold
  presentation (column order, pinned/collapsed), never truth (status).**
- **Uncaptured tasks don't get a card.** If it's not an IDEA/FEAT yet, it isn't on the board — the
  board's emptiness *is* the capture nudge (PRINCIPLE #1) made visible. Held strictly for v1.

## Column model
BOSS's own flow, surfaced as plain words (designer):

```
Captured        →   Taking shape       →   Building          →   Shipped
(IDEA, raw)         (canvas + a real       (FEAT building,       (status:
                     riskiest assumption)   or IDEA building)     shipped/done)
```

A promoted idea is represented by its **FEAT** card, not double-counted (FEAT with `source: IDEA-NNN`
suppresses the IDEA card). Blocked FEATs render in Building flagged `· blocked`.

## Humane constraints (mentor-humane override — non-negotiable)
The dark pattern is **board-as-progress**: grooming columns / a satisfying "Done" pile becomes
self-administered productivity theater. Design *against* it:
1. **It's a render, never a primary surface.** Generate it; don't log into it. (This is the same fork
   as above, stated as a humane rule.)
2. **The riskiest assumption sits ABOVE the columns.** "Motion but no evidence" must be *more* visible
   here than in a normal kanban. Implemented as the evidence line: when there's capture but nothing
   pressure-tested, the board says so plainly and points at `/canvas`.
3. **Empty columns are shown, not hidden.** The empty cell is the diagnostic.
4. **No completion-celebration, no gamification, no notifications/badges/pull.** Plain factual copy
   (voice-keeper). Only the conscience marks "done", against a real threshold — the board only
   *shows* it.
5. **Generate-on-demand, not live.** A static render has no push channel; that's the healthy shape.

## Architecture
- **CLI subcommand (`boss board`), not a skill.** It's deterministic projection (`readFile` + string
  template) — no model judgment to add, so spending model tokens on it would be the anti-pattern the
  v0.34 frequency-ledger work fought. Lives in [src/board.js](../../src/board.js), dispatched next to
  `boss status`. Ships with the binary → available in every project automatically; no manifest change.
- **Host-binding:** lands in IDEA-006's **Layer 1** (CLI + state — already agent-agnostic). Zero host
  contract; a plain-terminal or Codex user gets the board with no Claude dependency.
- **Relationship to the V1 `/board` skill:** complementary, no collision (one is a CLI verb, one is a
  Claude skill). `boss board` is the portable, all-modes, glance-level read; the `/board` skill is the
  `program-manager`-owned cross-FEAT *sequencing* surface (what's next/blocked/parallelizable) for
  projects with many FEATs. The CLI is the floor; the skill is the depth.

## Deferred phases (designed, not built)
- **`boss board --html`** — a single self-contained `.html` file written to `.boss/board.html`
  (gitignored), stamped with render time, **read-only** (no drag, no save-back), same data model +
  one template function. Zero-dep (`writeFileSync` of a string; inline `<style>`). **Gate:** earn it
  first — if `boss board` (terminal) becomes a thing run unprompted each session, build the render.
  If it's built and never run, the gate saved the work. (Savoia pretotype logic; unanimous.)
- **Obsidian** — mostly *not a build*. `docs/` already is a markdown vault; pointing Obsidian at it
  works today (documentation, not code). An optional later `boss board --md` could write a
  Kanban-plugin-shaped `docs/board.md` — **but** that plugin writes back on drag, so a regenerator
  would clobber edits. Decision required before building: generated-and-read-only, or don't ship the
  writer. Deferred until the HTML phase is earned.
- **Staleness-as-pressure (vibe-virtuoso's reframe — strongest idea in the convening):** a board that
  surfaces *"fourth new card this week, the Tuesday thing has zero users — want to look at it?"*
  instead of *options-as-candy*. That's conscience territory, not board territory — likely a future
  moment, not a board column. Captured here so it isn't lost.

## Open questions
- Does `boss board` get run unprompted? (The HTML gate.) Dogfood it on this repo and watch.
- Strict "uncaptured tasks get no card" — right discipline, or does a loose-task source eventually
  earn its place? Live with strict for a release and see if it itches.

## Convening record
Six advisor reactions captured this session; persona reactions written to
`docs/dossier/persona-reactions/kanban-board.md` (vibe-virtuoso) and
`kanban-board-indie-hacker.md` (indie-hacker). Both cohorts *bounced* the Trello framing — for
different reasons (vibe-virtuoso: "it feeds my build-addiction"; indie-hacker: "ceremony in an
anti-ceremony tool; don't own pixels") — and both endorsed the render-only reframe.

## v0.191.0 — the projection was mis-reading the vocabulary it was built on

Seed: Ajesh, 2026-08-20 — *"maybe reorganize or rename features currently the way ideas show on the
board, its hard to see what it is or the description is not right… right now its a bit hard to
remember ideas."* Read as a legibility complaint. **Half of it was a bug.**

- 🔴 **`status === 'shipped'` vs. the declared vocabulary.** [`docs/IDS.md`](../IDS.md) says a status
  must *start* with one of seven words and calls the free-form detail after it **encouraged**. This
  file's own module compared the whole string, so `shipped (v0.104.0 — the one question in /close)`
  never matched and fell through to `Captured`. **12 of the 31 cards in BOSS's Captured column were
  shipped (8) or in build (4).** The founder's read — *"the description is not right"* — was
  literally correct, and the record system's most-looked-at surface had been wrong about a third of
  its own backlog for ~155 releases.
- **The header comment three screens above it said "Frontmatter is truth" the whole time.** Fourth
  instance of the pattern in [[checkers-state-intents-they-dont-enforce]]: read the intent, then
  test the code against it. `src/records.js` already had the right parser (`baseStatus()`) and this
  module never imported it — so the *fix* was a deletion, not an addition.
- **Parked.** `deferred`/`dropped` are decisions with written re-open triggers, and standing them
  beside fresh captures asks the founder to re-read a settled question every time they open the
  board. They fold out of the flow and out of `--next`. Never deleted: [[IDEA-040]] and [[IDEA-049]]
  both say **DO-NOT-REHASH** in their own bodies, and `--next` was cheerfully offering to `/canvas`
  them.
- **`gist:`** — the one line answering *"what IS this again?"*, which is the half of the ask that
  was **not** a bug. A card is an id and a title; after sixty records a title is a name, not a
  reminder. Authored wins, derived (the record's own opening prose) fills the silence — the same
  posture `shipped_on:` takes with its git fallback, and for the same reason: **a field someone has
  to remember to fill in is a rule with no mechanism.** Backfilled across all 72 records — 44
  authored where the record opens with provenance rather than content, 28 derived.
- **Hover + expansion** on `--html` (CSS-only, keyboard-reachable), and `boss board <ID>` as the
  terminal's equivalent. **Refused:** a JS disclosure widget on a page that has never shipped a
  script, and a hand-maintained short-title field — a second name to keep in sync is the drift this
  whole module was designed to avoid.

**What was NOT done, deliberately:** the ask's other reading — *"rename features"* — would mean
rewriting 66 record titles, which are the founder's own words. Fixing the columns and adding a gist
addresses the same complaint without BOSS editing the founder's language. If titles still read
wrong after living with the gist, that is a separate and much more invasive call.

## Canvas
_Not started. This is BOSS-internal tooling; the canvas gate is for product ideas. Promote with
`/canvas` only if it grows past internal tooling._
