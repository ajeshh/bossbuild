---
id: IDEA-165
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-006
relates: IDEA-005, IDEA-044
gist: "Hey, track this" — any project, BOSS or not, gets a card in HQ with nothing written into its repo.
next: settle PROG-006 Q4 (where unassigned notes live), then add the two registry fields (2026-10-08)
---

# IDEA-165 — The Mailroom

The bottom room. Ajesh: *"the bottom level is the mailroom like in a big corp."* Things arrive, get
logged and sorted; nothing is built here.

## What it is

- **`boss track [path]`** (name open) — adds a registry row for a folder BOSS did not start, and writes
  **nothing** into the repo. For dhun, client repos, anything you don't want BOSS touching.
- **Two fields on the row:** *what this is* (one line) and *next* (one line). Typed once, edited from
  HQ or the CLI. Git supplies everything else on the card.
- **The portfolio inbox:** a note that belongs to no project yet waits in the Mailroom
  (`~/.boss/inbox/`?). Assigning it moves it into that project's `boss inbox`, or onto its row's
  *next* for a project with no BOSS in it.

## Why nothing in the repo

The registry is already machine-local and keyed by path (`src/paths.js`). Keeping the Mailroom there
means tracking a project is free and leaves no trace — and removing the row is the whole undo.

## Tasks

- [ ] Registry schema: add *what* and *next* to a row without breaking `boss list` or older rows.
- [ ] `boss track` (or `boss adopt --mailroom`) — pick one verb; `adopt` today means "install BOSS",
  which the Mailroom does not do.
- [ ] Portfolio inbox location and the assign step (PROG-006 Q4).

## Found while building
