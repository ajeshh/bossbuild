---
id: FEAT-033
type: feature
owner: designer
status: shipped
gist: `boss design` gains the rest — Icons & logo (the set as the style guide decided it, every `docs/design/icons/*.svg` drawn from the file and copied as SVG or as one sprite; the mark and the wordmark as lockups from the brand's own files, never a placeholder mark), Resources (the DTCG file to copy or download, a CSS-variables block derived from it at render, the import lines as one list, kit coverage from `design:` links with the honest count) and Exceptions (the style guide's table grouped by the rule it departs from, counted against the template's own threshold) — the seventeenth section closes the plan in FEAT-030.
for: the same founder as FEAT-030; the designer who wants the icons in their tool and the engineer who wants the variables
created: 2026-09-13
building_since: 2026-09-13
shipped_on: 2026-09-13
proof: src/design.js
from: IDEA-107
program: design-system
relates: FEAT-030, FEAT-031, FEAT-032, IDEA-108
---

# The design space, slice 4 — icons & logo, resources, exceptions

> Slice 4, the last, of the plan in [FEAT-030](FEAT-030-the-design-space-render.md). The IA is
> prototype v4's seventeen sections; this slice adds 8 · Icons & logo, 15 · Resources and
> 16 · Exceptions and renumbers what follows.

## Goal
Open `boss design` and take it with you: the icon set drawn from the SVG files and copied as one
sprite; the mark and wordmark as lockups from the brand's own files; the tokens file as the one
download and the variables block derived from it; the honest count of components a designer's
file already covers; and every recorded exception grouped by the rule it departs from, so three
against one rule reads as a verdict on the rule.

## Assumptions (the plan-time record)
- **Assumed:** icons are `docs/design/icons/*.svg` (IDEA-107's kicks-up row; nothing writes the folder yet — a founder or designer drops files in). Each renders inline from the file, copies as its own SVG, and the set copies as one `<svg>` of `<symbol id="icon-<name>">`. The style guide's *1b. Icons* lines (the set · sizes · icon-only) render as the decision when filled → _confirmed — `docs/design/icons/*.svg`, inline from the file, the set as one `<symbol>` sprite_
- **Assumed:** the logo is a path in `docs/BRAND.md`'s frontmatter — `logo:` (the mark) and optionally `wordmark:` when it is a file rather than a name — relative to the project; lockups render from those files (mark on paper · mark on accent · the name in the display face beside the mark). No file → the slot, never a placeholder mark. A `## Logo` section in the style guide (clear space · minimum · colour · tagline · misuse) renders when present; it is a kicks-up slot, not yet in the template → _confirmed — `logo:` and `wordmark:` (when it ends in .svg/.png) from `docs/BRAND.md` frontmatter_
- **Assumed:** Resources offers `docs/design/tokens.json` verbatim (copy, and a `download` link — the page is a local file, so the attribute works), a `:root { --… }` block derived from the DTCG at render, the import lines as one copyable list, the sprite again, and says which path applies for a design tool by class (a tokens plugin on any plan · an enterprise API · native import unverified) → _confirmed_
- **Assumed:** kit coverage reads a `design` field per component in the manifest and a `Design` column in `COMPONENTS.md` when either exists, rendering *Open in your design tool* and *N of M have a design counterpart*; when nothing carries the field the number is 0 of M and the page names the field. Reading it does not add it to the template — that is IDEA-108's gated ask → _confirmed — `design` in the manifest or a `Design` column; a URL is what counts_
- **Assumed:** exceptions are the style guide's `| Date | Where | What | Why |` rows (a `Rule` column when present), grouped by the rule (the `Rule` cell, else the `What` cell); a group of three renders the template's own verdict (*the rule is wrong — narrow, split, or retire*), two *worth noticing*, one *an exception*; the template's blank row is skipped → _confirmed — a group of three renders *the rule is wrong — narrow it, split it, or retire it*_

**Still unknown (didn't guess):**
- Whether a zip of the icons is wanted — no dependency does it; the sprite is the honest download.
- Where a pattern's `design:` link lives (IDEA-108 open question 3) — components only here.

## Acceptance criteria
- [x] Icons & logo renders every `docs/design/icons/*.svg` from the file, each with SVG copy, and *Copy the set as a sprite*; the style guide's icon decision when filled; the lockups from the brand's files; holes with verbs otherwise, never a placeholder mark.
- [x] Resources offers tokens.json (copy + download), the derived variables block, the import list, the sprite, and the kit-coverage count with links.
- [x] Exceptions groups the rows by rule with the count and the threshold verdict; an empty table is *none recorded — healthy, or unrecorded* and not a hole.
- [x] Seventeen sections in the decided order; the rail carries *Take it with you* and *Kept honest* groups; the ledger counts sixteen slots (icons and logo added).
- [x] Tests cover: two icon files → the sprite with two symbols and the copy per icon; a brand with a mark file and one without; the derived CSS block equals the tokens; coverage 1 of 3 from a manifest `design` field; exceptions three-against-one rule; the empty table; every hole.

## What "wrong" looks like
- A placeholder mark drawn where no logo file exists.
- An icon rendered from anything but its file.
- A derived variable whose value is not the token's.
- Coverage counted from a link nobody wrote.

## Paths that must not break
- **Destructive path:** still exactly one file under `.boss/`; a test asserts nothing under `docs/` changes.

## Smoke check
- `node --test test/design.test.js`; by hand: the `/tmp` scaffold with three icon SVGs, a `logo:` path, four exceptions (three against one rule).

## Validated learning
- **Learning hypothesis:** the designer pastes the sprite once and stops asking for the icons; the engineer copies the variables block instead of retyping hexes.
- **What result would change the plan:** the download never happens — then Resources is a line in the footer.

## Log
- 2026-09-13 — specced from FEAT-030's slice table and IDEA-107's v4 notes.
- 2026-09-13 — **landed** (under Unreleased). Twenty-five design tests. The one look: a stroke icon
  whose file carries no `stroke` attribute draws invisible on the tile — the file is the file, and
  the page does not paint what the set didn't; worth a line in the icons decision (*the stroke is in
  the file, not in the CSS*). Kit coverage reads the field and adds nothing to the template — IDEA-108
  row 3 stays gated on a designer arriving with a file.
