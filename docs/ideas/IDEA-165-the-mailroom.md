---
id: IDEA-165
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-006
relates: IDEA-005, IDEA-044
gist: "Hey, track this" — the first floor above the Basement, where a project gets its HQ card; the Lobby beside it holds repos you don't own, with nothing written into them.
next: settle PROG-006 Q4 (where unassigned notes live), then add the two registry fields (2026-10-08)
---

# IDEA-165 — The Mailroom (and the Lobby)

The bottom room. Ajesh: *"the bottom level is the mailroom like in a big corp."* Things arrive, get
logged and sorted; nothing is built here.

## What it is

- **Entered by the door** — `boss adopt`, picking the Mailroom: the Basement plus a registry row
  (PROG-006 Q7). No separate `track` verb.
- **Two fields on the row:** *what this is* (one line) and *next* (one line). Typed once, edited from
  HQ or the CLI. Git supplies everything else on the card.
- **The portfolio inbox:** a note that belongs to no project yet waits in the Mailroom
  (`~/.boss/inbox/`?). Assigning it moves it into that project's `boss inbox`, or onto its row's
  *next* for a project with no BOSS in it.

## The Lobby (Q8, 2026-10-08)

The Basement now comes with every floor, Mailroom included (PROG-006 Q6), so tracking writes the safety
floor into the repo. For a repo you don't own, the **Lobby** keeps the zero-write case: a registry row
with *what* and *next*, git for the rest, nothing in the repo. Same row, no Basement, outside the
building.

## Why the row lives in the registry

The registry is already machine-local and keyed by path (`src/paths.js`). Keeping the Mailroom there
means the row itself costs nothing and removing it is the whole undo for the Lobby; a Mailroom project also has the Basement to take back out.

## Tasks

- [ ] Registry schema: add *what* and *next* to a row without breaking `boss list` or older rows.
- [ ] The Lobby: how a row is marked as a visitor, and how it moves into the building (`boss up`).
- [ ] Portfolio inbox location and the assign step (PROG-006 Q4).

## Found while building
