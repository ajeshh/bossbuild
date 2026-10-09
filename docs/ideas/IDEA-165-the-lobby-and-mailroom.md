---
id: IDEA-165
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-006
relates: IDEA-005, IDEA-044, IDEA-163, DEC-024
gist: Every project signs in at the Lobby (name, what it is, what's next) and gets its HQ card with nothing written into the repo; the Mailroom one floor up is where things arrive for it and get sorted.
next: once DEC-024 lands — the registry row's what/next and the floor field, then the door's ownership check (2026-10-08)
---

# IDEA-165 — The Lobby and the Mailroom

Phase 1 and 2 of PROG-006. The model is DEC-024.

## The Lobby — reception

Ajesh: *"its like enter the lobby and then go to the floor. lobby is just the what is the name of this
project."* Every project passes through it, on the way to any floor.

- **Signing in is the registry row:** the name, *what this is* (one line), *next* (one line). Typed once,
  edited from HQ or the CLI. Git supplies the rest of the card. The registry is already machine-local
  and keyed by path (`src/paths.js`).
- **Staying is allowed.** A project that signs in and goes no higher has nothing written into its repo,
  and removing the row is the whole undo. This is where a repo that isn't yours waits.
- **The floor field:** `floor: 0–5` on the row; on the project's stamp too from Security up. A Lobby
  project has a row and no stamp.
- **The door's ownership check:** BOSS assumes the repo is yours. When git says otherwise (a remote
  owned by someone else), the door asks before writing anything: *"This repo belongs to acme-corp. Going
  up writes N files here. Stay in the Lobby instead?"* (PROG-006 Q12.)

## The Mailroom — things arrive and get sorted

The name comes from Ajesh: *"the bottom level is the mailroom like in a big corp."* It now sits at level 2, above Security: a Mailroom project has its badge.

- The project's inbox: `/inbox`, `docs/source/`.
- Idea capture: `/idea`, `docs/ideas/` + `INDEX.md`, `docs/IDS.md`.
- **Delivery from HQ:** a note with no project yet waits in `~/.boss/inbox/` (PROG-006 Q4). Assigning it
  delivers it into that project's inbox; for a Lobby project, onto its row's *next*.

## Tasks

- [ ] Registry schema: *what*, *next* and `floor` on a row without breaking `boss list` or older rows.
- [ ] `floor:` on the stamp; every existing project reads as `5` with no migration (DEC-024 rule 5).
- [ ] The door's ownership check (PROG-006 Q12).
  Reuse IDEA-163's `projectName(dir)` (`src/detect.js`, on work/idea-163): it returns
  `{ name, from, remote? }`, pure; parse the owner from `remote`. Don't read the remote a second time.
- [ ] The Mailroom preset, as a list of IDEA-163 part names.
- [ ] `~/.boss/inbox/` and the assign step.

## Found while building
