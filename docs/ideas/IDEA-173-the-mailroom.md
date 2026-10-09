---
id: IDEA-173
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
proof: none
proof_note: done is a Mailroom preset on main, and a `--floor mailroom` adopt in a test laying down the inbox and idea capture
program: PROG-006
relates: DEC-024, IDEA-165, IDEA-174
gist: Level 2 — where things arrive for a project and get sorted: its inbox, idea capture, and notes delivered from HQ's machine-wide inbox.
next: waits on the parts list (IDEA-174); then the Mailroom preset (2026-10-08)
---

# IDEA-173 — The Mailroom

Level 2 (DEC-024). The name is Ajesh's: *"the bottom level is the mailroom like in a big corp."* Split
out of IDEA-165 on 2026-10-08 so each floor is its own record (*"all the floors shd be their own
idea"*); IDEA-165 keeps the Lobby.

## What it holds

Everything in Security, plus:

- the project's inbox: `/inbox`, `docs/source/`
- idea capture: `/idea`, `docs/ideas/` + `INDEX.md`, `docs/IDS.md`
- **delivery from HQ:** a note with no project yet waits in `~/.boss/inbox/` (PROG-006 Q4); assigning it
  delivers it into this project's inbox, or onto a Lobby project's row *next*

## Why it's its own floor

Catching is its own job. A project that is still mostly ideas needs a place for them before it needs
continuity (the Office) or a build team (the Studio).

## Tasks

- [ ] The Mailroom preset, as a list of parts (IDEA-174).
- [ ] `~/.boss/inbox/` and the assign step.
- [ ] `whereLabel` for floor 2.

## Found while building
