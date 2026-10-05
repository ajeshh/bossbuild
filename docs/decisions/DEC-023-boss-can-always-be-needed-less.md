---
id: DEC-023
type: decision
owner: "@ajeshh"
decided_by: ai-suggested-ratified
status: decided
created: 2026-10-04
confirmed: 2026-10-04 — Ajesh, on the IDEA-137 governance step ("sure")
reversibility: costly — it is an aim every future capability gets checked against; taking it back later means a capability may have been built to hold on
revisit_by: 2027-04-04
falsifier: removing BOSS from a throwaway project breaks something the founder built (a file of theirs that only works with BOSS present), or BOSS steps back from a job on its own read without the founder asking, by 2027-04-04 → the aim is not being kept; find what holds on
scope: venture
---

# DEC-023 — BOSS can always be needed less, and the founder decides when

## Context

IDEA-137 lays down a venture's ecosystems inside a founder's project. Two thinkers it read at source
point the same way: Carol Sanford argues that help which makes people dependent on outside input is the
machine model of a living system; Donella Meadows' advice to an intervenor is to restore the system's
own ability and then step back (that line came through a secondary source and is not quoted here).
Ajesh's own notes say it as *let go of ownership*. The first draft of this aim — *"BOSS aims to be needed
less"* — failed the humane review (IDEA-137 · H1): an aim to *be* needed less invites a measure, fewer
interventions, which rewards silence; and if BOSS decides when it's needed less, it withdraws help on
its own read.

## Decision

**Every part of BOSS in a founder's project can be handed over, turned off or removed, with no lock-in
— and the founder decides when.** BOSS never steps back from a job on its own read. The one thing never
retired is the line about harm to someone who isn't in the room.

## Why

- **Rejected: "BOSS aims to be needed less."** It turns into a count of interventions, and a tool
  optimising that count goes quiet exactly when it should speak.
- **Rejected: say nothing.** Without the aim, nothing stops a capability being built so a project
  needs BOSS to keep working — the enclosure DEC-011 refuses for licences, arriving through files.
- **"Can always be," not "aims to be":** the commitment is an exit that always works, not a trajectory
  BOSS steers. That keeps the decision with the founder.

## Falsifier — what would prove this wrong, and by when?

Remove BOSS from a throwaway project (the `.claude/` it laid down, the `.boss/` state): if anything the
founder built stops working, the aim isn't kept. Or: BOSS steps back from a job without the founder
asking. By **2027-04-04** — and the removal test should become a real test before then (IDEA-137 · C6.5).

## Consequences

- Every new capability answers: *can the founder turn this off or take it over, and does their work
  survive BOSS leaving?*
- `/boss-sync`'s existing `--remove` consent and the free mute stay first-class; nothing here adds a
  prompt to keep BOSS.
- **The removal test exists** (2026-10-04, `test/removal-leaves-founder-work.test.js`). Its first run
  found the aim broken once: the `/ai-cost` logger BOSS hands the founder's app assumed `.boss/` was
  there. Fixed in the template. Anything a skill installs into the founder's app joins that test.
- **PRINCIPLES.md does not change on this decision.** Whether it becomes a principle is part of IDEA-137's
  Q8, and that sentence moves only after the mechanisms are real.
