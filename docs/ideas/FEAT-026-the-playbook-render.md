---
id: FEAT-026
type: feature
owner: product-lead
status: shipped (slice 1, `55502e9`, under Unreleased — the FEAT closed at the scope it wrote; slices 2–4 are FEAT-027..029)
gist: `boss playbook` renders a founder's records — canvas cells as boxes first, then the other chapters — into one self-contained, on-brand HTML page under `.boss/`, with a stable id, Copy and Slide on every block, holes rendered as holes, and the evidence ledger in the chrome. A view, never an app.
for: a founder in Quickstart or MVP whose canvas, personas, rivals, evidence and decisions exist as files and cannot be looked at together or handed to a room (no persona in `docs/personas/` here — BOSS's own personas are agents)
created: 2026-09-13
shipped_on: 2026-09-13
from: IDEA-106
program: business-profile
relates: FEAT-025, DEC-004, IDEA-065, IDEA-104
---

# The playbook render — a founder's records, drawn as a page

> Slices, in order. **This FEAT closes at slice 1 + the frame.** Later slices are named here so the
> first one is built as a renderer and not as a canvas page; each lands as its own commit and
> CHANGELOG bullet. New scope — a person record, a `cell:` on evidence, a screenshot at ship — is
> the *Kicked up* table in [IDEA-106](IDEA-106-the-playbook-the-venture-rendered.md), not a
> criterion here.

| Slice | Renders | Lands as |
|---|---|---|
| **1 · the canvas as boxes** | `docs/ideas/*-canvas.md` → the Humane grid, Lean grid, the DEC-004 floor band, holes dashed, dormant with its condition, a chip per cell, the ledger in the chrome, Link · Copy · Slide per block, light/dark, brand from `docs/BRAND.md` or the neutral default | **this FEAT** |
| 2 · the pitch chapters | Vision · Product · Customers (`docs/personas/` as **snippets** — `who` line, tiles, ledger chip, link to the Design space's full card; Ajesh 2026-09-13 via IDEA-107) · Problem · Market · Competition (`docs/competition/`) · Business model | FEAT-027 |
| 3 · the proof chapters | Evidence (`docs/evidence/` — grades and dates only, never quotes on a shareable copy) · Health · Learnings · Decisions · Risks | FEAT-028 |
| 4 · the deck | Present with profiles (VC cut / internal / everything), remove-and-restore, Export PDF | FEAT-029 |

Prototype v6 is the rendered mockup for all four: **a sketch, not on-system** — it carries its own
CSS because a founder's page is in *their* brand, not BOSS's site tokens. Implement the *behaviour*
from it, never copy its hexes.

## Goal
A founder runs `boss playbook` and gets `.boss/playbook.html` — their canvas as boxes, every cell's
answer in their own words, every hole visible, in their brand if they have one — and can open it,
link to a cell, copy a cell into a slide, or show a cell as one.

## Assumptions (the plan-time record)
- **Assumed:** the output lives at `.boss/playbook.html`, gitignored, exactly where `boss board --html`
  puts `.boss/board.html` — one precedent, one place → _confirmed / corrected to: …_
- **Assumed:** a CLI command (`src/playbook.js`, zero-dep), not a skill — it composes nothing, so it
  needs no judgment (IDEA-106 §7) → _confirmed / corrected to: …_
- **Assumed:** the canvas is read from `docs/ideas/*-canvas.md` in the `| **Cell** | Answer |` table
  shape `/canvas` writes; a cell whose answer carries revision history (BOSS's own canvas does)
  renders the **whole** cell — the render never decides which paragraph is current → _confirmed /
  corrected to: …_
- **Assumed:** a chip is `EVID ×N` only when an `EVID` record's `assumption:` phrase names the cell
  by its heading word (`People`, `Problem`…) or the record lists the cell explicitly; otherwise the
  cell is `asserted`. No `cell:` field is added to `/evidence` in this FEAT → _confirmed / corrected
  to: …_
- **Assumed:** the brand read is three fields from `docs/BRAND.md` — an `accent:` hex, a `wordmark:`
  (else the project name), a `tagline:` — each `unknown` or absent falls back to the neutral default
  for that field only; no logo file in slice 1 → _confirmed / corrected to: …_
- **Assumed:** `--open` opens the file in the default browser (`open` on macOS, `xdg-open` on
  Linux) and is the only flag; the frame toggle is on the page, not a CLI option → _confirmed /
  corrected to: …_
- **Assumed:** no canvas at all renders a full page of holes with the prompts and `/canvas` named —
  the first-run path is a real render, not an error → _confirmed / corrected to: …_

**Still unknown (didn't guess):**
- Which BMC grid BOSS commits to — the prototype drew Humane and Lean only; BMC's nine-box layout
  is written in `/canvas` but no mapping to a grid exists. Slice 1 ships Humane + Lean; BMC is a
  found task, not a criterion.
- Whether a founder's canvas ever carries revision history inside a cell, or only BOSS's does.

## Acceptance criteria
- [x] `boss playbook` in a project with a canvas writes `.boss/playbook.html` and prints the path;
      `--open` opens it. The file is single-file: no external script, style or font request; opens
      from `file://`.
- [x] Every cell in the canvas file renders as a box with the cell's heading and its full answer;
      **no cell is omitted** and **no word is added** — the page contains no sentence that isn't in a
      record or a prompt the `/canvas` template already holds.
- [x] `_(not yet)_` renders as a dashed box carrying the cell's humane prompt and the verb
      (`/canvas`); a dormant cell (`_(live once…)_`, `_(live when…)_`, `_(live only if…)_`) renders at
      full size with its condition. Neither is collapsed or hidden in any frame.
- [x] The page has a Humane ⇄ Lean toggle; in Lean the answers move into Maurya's grid and **Risks &
      Harms and Principles render as a full-width band beneath it** under the heading `/canvas`
      already uses (*"two questions this canvas asks that Lean doesn't"*). The frame's credit line
      renders (Humane Product Canvas · Ajesh Shah / Lean Canvas · Ash Maurya).
- [x] Every box carries a chip: `EVID ×N · <top grade>` when evidence names the cell, else
      `asserted`; and a source line (`canvas · <cell> · rev. <date>` when a date is derivable).
- [x] The chrome carries the ledger: `N of M cells backed by graded evidence · K signals, all/top
      <grade> · newest <days> ago` — numbers computed from the files, never typed.
- [x] Every box has a stable id (`#canvas-<slug>`), a Link (copies the deep link), a Copy (rich HTML
      + plain text, carrying the chip and source line), and a Slide (the box alone, 16:9, brand
      chrome, Esc closes; ← → step between boxes).
- [x] Brand: `docs/BRAND.md`'s accent/wordmark/tagline apply; missing or `unknown` fields fall back
      per-field to the neutral default; the footer says which (`brand: <name> · docs/BRAND.md` /
      `brand: nascent — /landing seeds it`). Light and dark both render through tokens.
- [x] With no canvas file, the page renders every cell as a hole with its prompt and `/canvas`, the
      ledger reads `0 of M`, and the command exits 0.
- [x] The renderer never writes to any file except `.boss/playbook.html`; `.boss/playbook.html` is
      gitignored in both templates with the same comment `board.html` carries.
- [x] `boss help` lists `playbook`; the CHANGELOG bullet is under `## Unreleased`; tests cover the
      criteria above (`test/playbook.test.js`) and `npm run check` is at its baseline.

## What "wrong" looks like
- A cell paraphrased, shortened, or "cleaned up" — one changed word and the page is BOSS's, not the
  founder's.
- A hole that reads as finished: a `_(not yet)_` box that looks like the others, or a dormant cell
  quietly dropped because it "wasn't answered".
- A number in the chrome that was typed rather than counted; a ledger that says `3 of 13` when a
  fourth EVID exists.
- Risks & Harms below the fold, smaller, or collapsed in Lean — the floor eroding exactly the way
  DEC-004 predicted it would.
- A readiness score, a percentage complete, a traffic light, a grade. Position, never a verdict.
- An invented colour when `BRAND.md` says `unknown`; a page that looks branded for a founder who has
  no brand yet.
- Any request that leaves the machine — a font, a script, a beacon.
- A Copy that pastes as a picture where a table was expected (slice 1 ships rich HTML; the
  Keynote/Slides/PowerPoint paste is verified by hand, criterion below).

## Paths that must not break
- **Destructive path:** the command writes exactly one file, `.boss/playbook.html`, and nothing
  under `docs/`; a test asserts the docs tree is byte-identical before and after a render. No human
  gate — it overwrites only its own output.
- **Negative path:** single-user, local. Nothing on a `file://` page can be seen by anyone the
  founder didn't hand the file to. *The shareable copy* (slice 3+) is where the quotes in
  `docs/evidence/` must not travel unasked — named now so it isn't forgotten, tested then.

## Flow
Indexed in `docs/design/FLOWS.md`.

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | `boss playbook [--open]` | nothing | it reads what exists; there is no question worth asking before showing them their own words |
| 2 | the page opens; the canvas is the page | nothing | the value moment is *seeing it* |
| 3 | hover a box → Link · Copy · Slide | a click | only when they want to take a piece somewhere |

**Cut**

| Cut | Why |
|---|---|
| `--frame lean` as a CLI flag | the frame is a reading, not a render — a toggle on the page asks nothing and re-renders nothing |
| "which idea?" prompt when several canvases exist | pick the newest, say which in the footer; asking blocks the value moment for the common single-canvas case |

- **First-run path** — no canvas: every box is a hole with its prompt and the verb; the ledger reads
  `0 of M`; the footer says *this page fills itself as you answer* — a real render, not an error.
- **Failure path** — a canvas file that doesn't parse (no cell table): the page renders with one
  box saying which file couldn't be read and why, the rest of the chrome intact; exit 0, the error
  also printed to stderr.

## Smoke check
- `boss playbook` in a `/tmp` scaffold with the template canvas → file exists, `grep -c '<article'`
  ≥ 13, `grep -c 'https://' .boss/playbook.html` = 0 (nothing fetched), exit 0.
- Same scaffold, canvas deleted → exit 0, page renders holes.

## Validated learning
- **Learning hypothesis:** a founder who can *see* their canvas fills more of it — the holes, drawn
  as holes, pull answers that a markdown table never did.
- **What result would change the plan:** a founder renders it once and never again (nothing to
  look at twice → the site half is wrong and only the deck matters), or fills holes to make the
  page look complete rather than because they know the answer (the render is a flattery machine →
  make holes *quieter*, not louder).

## Out of scope
- Every chapter but the canvas (slices 2–3), the deck with profiles (slice 4), a shareable copy.
- BMC's grid — mapping written, not drawn.
- Any change to a record's shape: no `cell:` on evidence, no `photo:` on personas, no person record,
  no `vision:` line — all in IDEA-106's *Kicked up* table with their own sort.
- Charts (slice 3, over counted numbers only).

## Notes
- Source idea: [IDEA-106](IDEA-106-the-playbook-the-venture-rendered.md) — the design plan (§1–§13),
  the mentor reviews, the 27 kicked-up rows.
- Precedent to reuse, not re-invent: `src/board.js` (`esc`, the self-contained page, the
  gitignore comment), `src/frontmatter.js`, `src/records.js` (`readRecords`, `nextId`),
  `src/help-html.js`.
- Prototype: https://claude.ai/code/artifact/e3f72fdf-dc50-4ebe-9f78-0d0f66684c35 (v6, a sketch).
- Out of the agent's authority: adding a dependency (there are none); writing anywhere but
  `.boss/`; changing the `/canvas` template's cell names or prompts to make parsing easier — the
  parser bends to the template, never the reverse.
- What Ajesh verifies before it's done: open the page in a `/tmp` scaffold, toggle Lean, copy one
  box into Keynote or Slides, and read the ledger against the files by hand.

## Build log
- 2026-09-13 — **slice 1 landed** (`55502e9`, under Unreleased). Surprises: BOSS's own canvas
  rendered first time, history-in-cells and all — the "render the whole cell" decision cost nothing
  and would have been wrong the other way. The typo suggester keeps its own command list (a test
  caught it; a founder typing `playbok` would have been sent to `board`). `check:refs` counted the
  gitignored `docs/design/FLOWS.md` that `/spec` itself created as "repo-only" — eight shipped files
  flagged; same class as `manifest.json`, listed. Rejected: a slate accent for the no-brand default
  — the conscience pointed at two generated pages with two hand-inlined palettes, so the neutral is
  now `board.html`'s greys and monochrome, BOSS's own rule. Not done: the Keynote/Slides paste
  (Ajesh's hand), the BMC grid (found task).
- 2026-09-13 — specced from IDEA-106 after six prototype rounds. Slice 1 is the canvas page alone;
  the deck and the other chapters are named so the renderer is built as one. Decision: `.boss/`
  not `docs/playbook/` — one precedent for generated views. Decision: the whole cell renders when a
  cell carries history; the render never picks a paragraph.
