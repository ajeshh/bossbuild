---
id: FEAT-029
type: feature
owner: product-lead
status: shipped (under Unreleased, 2026-09-13)
proof: src/playbook.js
shipped_on: 2026-09-13
gist: `boss playbook`'s deck — Present the page as slides in one of three cuts (VC cut · Internal · Everything), each a list of block ids computed at render from the records; remove any slide from the current cut and restore it (remembered in the browser, never in the records); Export this cut as PDF through the print sheet. The founder's delete is the last word; BOSS's cut is the first draft.
for: the same founder as FEAT-026 — has a room on Thursday and sixteen chapters
created: 2026-09-13
from: IDEA-106
program: business-profile
relates: FEAT-026, FEAT-027, FEAT-028, FEAT-036, DEC-004
---

# The playbook, slice 4 — the deck

The last of FEAT-026's four slices, built last by Ajesh's order. The prototype's deck (v6 — Present
with profiles, remove-and-restore, Export PDF) is the mockup; the page already carries a Slide
button per block and a one-slide-at-a-time overlay (`.deck` / `.sl`). This slice gives that overlay
its cuts, its edits, and its export.

## Goal
A founder opens **Present**, picks a cut, steps through the slides a room should see, removes the
two that don't fit, and exports what's left as a PDF — without a record changing, and without BOSS
composing a word. The VC cut is *a cut of the playbook*, never the other way round (IDEA-106 §13).

## Assumptions (the plan-time record)
- **Assumed:** three cuts, each a **list of block ids in page order**, computed at render time in
  `src/playbook.js` from the data: **Everything** = every block on the page, holes included;
  **Internal** = every block that is filled (no holes, no dormant) with the canvas cells a chapter
  already renders dropped from the grid (Modes, Metrics, Partnerships … stay); **VC cut** = a fixed
  arc — the Vision blocks, *What it is today*, *What has shipped*, personas whose ledger reads real
  > 0 (a 100% synthetic persona stays on the page and off this cut — Ajesh's ruling on Priya), the
  Problem and Market cells, the competition table and key rivals, who pays / what it costs / prior
  capital / the ask, the evidence ladder, Risks & harms, the Health blocks when live, the Team
  cards, the brand anchor. A hole in the VC cut renders as a hole (*not yet*) — honest, and one
  click from removed → _confirmed / corrected to: …_
- **Assumed:** the **Present bar** sits at the top of `main` (the shell's top bar has no slot):
  the cut as a segmented control with its count, *Present*, *Export PDF*, and the removed slides as
  chips with ↺ to restore, *restore all*. Present opens the overlay at slide 1 of the cut; a
  block's own *Slide* button opens it in the current cut, or in Everything when the block isn't in
  the cut (said in the chrome) → _confirmed / corrected to: …_
- **Assumed:** **removals live in the browser** (`localStorage`, one key per cut, block ids), never
  in a record or in `.boss/` — a hidden slide is not a deleted fact (kicked-up #26). A re-render
  keeps them; a block id that no longer exists is ignored → _confirmed / corrected to: …_
- **Assumed:** **Export PDF** = `window.print()` over a print-only container holding the current
  cut's slides, one per landscape page, in the deck's own type — the shell's print sheet hides the
  page, this one hides the shell. No library, no server → _confirmed / corrected to: …_
- **Assumed:** the deck chrome gains *Remove from this cut*, the cut name and position; keyboard
  unchanged (← → Esc); Present is an explicit click only — nothing opens on its own (Ajesh's
  ruling) → _confirmed / corrected to: …_
- **Assumed:** a slide is the block's title, body and foot as today, plus the chapter label as the
  eyebrow; images (a face, the logo) come along since they are inline → _confirmed / corrected to: …_

**Still unknown (didn't guess):** what a browser's print dialog does with `@page { size: landscape }`
across hosts — Ajesh's hand-check in the sandbox stands.

## Acceptance criteria
- [x] `deckCuts(data)` returns the three lists; a test asserts the VC cut omits a 100% synthetic
      persona and includes one with real > 0, that Internal has no hole/dormant id and no
      chapter-duplicated canvas cell, that Everything is every block id in page order.
- [x] The page carries the Present bar, the cut JSON, the print container; the deck chrome carries
      Remove; removals round-trip through `localStorage` (a test asserts the key names and that
      the JS reads and writes them; behaviour is Ajesh's hand-check).
- [x] Export PDF is a print of the current cut only (a test asserts the print CSS hides `.shell`
      and shows `.printdeck`, one `.sl` per page).
- [x] Nothing fetched; one file written; docs/ byte-identical; CHANGELOG bullet.

## What "wrong" looks like
- A removal that edits a record or writes a file — the render is read-only.
- A slide BOSS composed (a summary slide, a title slide with prose that isn't the founder's).
- The VC cut carrying a synthetic persona, or hiding the evidence ledger.
- Present opening on load, on scroll, or on hover.

## Paths that must not break
- **Destructive path:** none — removal is per-browser and reversible; the records never move.
- **Negative path:** a printed cut can carry a real person's face and a rival's name — both are
  already on the page by the founder's own choice; the PDF adds no new exposure.

## Flow
`boss playbook --open` → **Present** → pick a cut → ← → → *Remove from this cut* (↺ in the bar
to restore) → **Export PDF** → the browser's print dialog. No row in `docs/design/FLOWS.md`.

## Smoke check
- `/tmp` scaffold with the template canvas, two personas (one `synthetic 100% · real 0%`, one
  `60/40`), two EVIDs, a person file → `boss playbook`; `grep -c 'data-cut="vc"'` = 1; the VC
  list excludes `persona-<synthetic>`; `printdeck` present once.

## Validated learning
- **Learning hypothesis:** founders present from Internal and export VC — the cut they show a
  room is the one they trimmed by hand, not the one BOSS drafted.
- **What result would change the plan:** nobody removes a slide (drop the edit layer) or every
  VC export starts from Everything (the VC arc is wrong — re-read Sequoia's ten against it).

## Out of scope
- Speaker notes, transitions, a title slide with a composed line, per-slide reordering (page order
  is the order), themes beyond the brand accent.

## Notes
- Source: IDEA-106 §3 (Slide), §8 (the deck is the chapter order read aloud), §9 (the Sequoia
  map), §13 (the cut is editable; Priya stays on the page); kicked-up #26.
- Out of the agent's authority: writing outside `.boss/`; any composed slide.
- What Ajesh verifies: Present → VC cut on a real project reads as a pitch; Export PDF in the
  sandbox prints one slide per page; a removed slide stays removed after `boss playbook` re-runs.

## Build log
- 2026-09-13 — **landed.** Cuts are read off the rendered HTML (article ids and classes), not
  recomputed from data — the list can never name a block the page lacks. Surprise: the removed
  strip showed while empty because the page had no `[hidden]` rule (the artifact host's reset has
  one; a file in `.boss/` doesn't) — added. Ajesh's hand-check: Export PDF in the sandbox.
- 2026-09-13 — specced.
