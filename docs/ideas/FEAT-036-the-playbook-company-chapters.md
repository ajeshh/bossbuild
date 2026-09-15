---
id: FEAT-036
type: feature
owner: product-lead
status: shipped (under Unreleased, 2026-09-13)
proof: src/team.js
shipped_on: 2026-09-13
gist: `boss playbook` grows the Company group — Team (a person record per founder, cofounder, team member and advisor, with a photo, written by hand from a README or stubbed by `boss team add`), Brand (BRAND.md's current shape, the accent and tagline as they are, the learned rows counted, a link to the Design space), and Values (the Principles cell as headlines plus a new `## How we build` section on BRAND.md — a headline, what it means, what it costs, per value). Photos inline as data URIs so a block still pastes.
for: the same founder as FEAT-026 — asked for a page on how we build and a face beside each name
created: 2026-09-13
from: IDEA-106
program: business-profile
relates: FEAT-026, FEAT-027, FEAT-028, FEAT-021, IDEA-107
---

# The playbook — the Company chapters

IDEA-106 §1's third group, minus Design (a sibling space, linked) and Roadmap · Board (not drawn;
Board is a sibling). Two of the three chapters render records that **did not exist** — kicked-up
#11 (a person) and #16 (values as a page), both new scope Ajesh asked for by name. Each gets the
smallest shape that is a record and not a form.

## Goal
A room asks *who is building this, and how do they work?* The Team chapter answers with a card per
person — the specific thing they've seen, built, sold or lived, what they bring and don't, a face
— and says plainly who is missing. Values reads as a page: a headline, then the paragraph, then
the cost, per value. Brand shows what the brand doc actually holds, `unknown`s included.

## Assumptions (the plan-time record)
- **Assumed:** a person is `docs/team/<slug>.md` — frontmatter `name`, `handle`, `role`
  (founder · cofounder · team · advisor), `photo` (a path beside the file, or `unknown`), and three
  sections: `## The specific thing`, `## What they bring, and don't`, `## Bio`. The Quickstart
  template ships `docs/team/README.md` with the shape; `boss team add @handle "Name"` also writes
  the stub when the file is absent (the roster in `.boss/config.json` stays as it is — FEAT-021's
  shared-vs-personal cut is untouched) → _confirmed / corrected to: …_
- **Assumed:** a photo renders only from a file on disk, inlined as a data URI when ≤ 600 KB (so a
  copied block carries the face); larger files render the name only with a note. **No file, no
  face, never a placeholder** (the brand-doc rule; the logo rule in `boss design`). Same for
  `photo:` on a persona file → _confirmed / corrected to: …_
- **Assumed:** Team renders founders first, then cofounders, team, advisors, each in a card;
  *Who is missing* is a hole pointing at `/consult · mentor-hiring` (a solo founder may want no
  one — the hole asks, it doesn't assume). No `docs/team/` → one hole: *write yourself down* →
  _confirmed / corrected to: …_
- **Assumed:** Values = the canvas Principles cell (the headlines, as the cell holds them) plus
  `docs/BRAND.md § How we build` — a bullet per value in the shape `- **headline** — what it
  means. *Costs:* what you give up.` — each a block: title, paragraph, cost line. The brand-doc
  template gains the section (Ajesh's ask, 2026-09-13: *"a page … one headline, and then more
  text describing it"*). Absent → a hole naming the section → _confirmed / corrected to: …_
- **Assumed:** Brand = BRAND.md's `## Current shape` lines as they are (`unknown` rendered as
  unknown), the accent as a swatch and the tagline as a specimen only when known, the *learned*
  table as a **count and dates** — never a row's *What happened* column, which can hold a real
  person's words — and a relative link to `design.html` when it exists. Nascent renders
  `nascent` → _confirmed / corrected to: …_
- **Assumed:** the rail's third group is **Company** (14 Team · 15 Brand · 16 Values); the
  single-file test now allows `<img src="data:…">` and nothing else →
  _confirmed / corrected to: …_

**Still unknown (didn't guess):** whether the person file should travel with the repo (`docs/`
commits) while the roster stays local. A bio is the person's own words about themselves; a photo
is theirs to add. The README says both are shared once committed.

## Acceptance criteria
- [x] `docs/team/README.md` ships in the Quickstart template with the shape; `boss team add` writes
      `docs/team/<handle>.md` from it when absent, and says so.
- [x] Team renders a card per person file, ordered by role, with the three sections and a data-URI
      photo when a file ≤ 600 KB exists; a persona's `photo:` renders the same way on its snippet.
- [x] Values renders the Principles cell and the `## How we build` bullets as blocks; the brand-doc
      template carries the section.
- [x] Brand renders the current-shape lines, swatch/specimen when known, the learned count, the
      Design link when the file exists; a test asserts no *What happened* cell text appears.
- [x] Rail Company group; 16 chapters; `--questions` lists the new holes; docs/ byte-identical;
      CHANGELOG bullet.

## What "wrong" looks like
- A silhouette, an initial in a circle, or any drawn stand-in for a person with no photo.
- A value BOSS wrote (a headline composed from the cell).
- A user's quote from the brand doc's learned table on the page.
- A card for someone on the roster who never wrote themselves down — the roster is handles, not people.

## Paths that must not break
- **Destructive path:** `boss team add` never overwrites an existing person file.
- **Negative path:** a photo on a page a founder pastes into a deck is the person's own choice to
  add — the README says so beside the `photo:` line.

## Flow
`boss team add @handle "Name"` → stub written → the person edits it → `boss playbook`. The
founder writes their own file by hand from the README (no `boss team me` — one more verb for one
file). No row in `docs/design/FLOWS.md`.

## Smoke check
- `/tmp` scaffold: two person files (one with a small PNG), BRAND.md with a `## How we build` of
  two bullets, a canvas with Principles → 16 chapters; `<img src="data:image/png` once; the learned
  table's text absent.

## Validated learning
- **Learning hypothesis:** the Team chapter is the first place a solo founder writes *who is
  missing* honestly, because the hole is on the page they show a room.
- **What result would change the plan:** nobody adds a photo (drop the data-URI path) or founders
  write values from imagination (the section moves behind the learned table's evidence).

## Out of scope
- Roadmap · Board chapters; the deck (FEAT-029); the persona card itself (Design space).

## Notes
- Source: IDEA-106 §1 (13–14), §11 (values), the sorted table (#11, #16); Ajesh's asks 2026-09-13.
- Out of the agent's authority: the roster's shared-vs-personal cut; any placeholder face.

## Build log
- 2026-09-13 — **landed.** Surprise: a stub's `<placeholders>` rendered as the person's words on the
  first pass — the card now drops any line that is only a placeholder. Photos are inlined; the
  fixture's 64×64 PNG copies with the block. Not done: `boss team me` (one verb for one file — the
  README says copy the shape).
- 2026-09-13 — specced. `boss id FEAT` → 036.
