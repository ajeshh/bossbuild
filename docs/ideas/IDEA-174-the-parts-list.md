---
id: IDEA-174
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
proof: none
proof_note: done is one exported parts list in src/ that the floor presets and adopt's plan both read
program: PROG-006
relates: DEC-024, IDEA-163, IDEA-173, IDEA-166, IDEA-167, IDEA-168
gist: BOSS as named parts — each a name plus the files, hooks and settings it lays down, read from stages/ — so every floor is a list of part names and adopt plans from the same list.
next: inventory today's L0/L1 templates into named parts, starting from IDEA-163's parts table (2026-10-08)
---

# IDEA-174 — The parts list

DEC-024 rule 1: floors are presets over parts. The parts export was IDEA-163's next step, and IDEA-163
is paused until the floors are built (Ajesh: *"lets pause before the ladder system is complete because
it may help cure a lot of adopt"*). The floors are the first thing that needs parts, so the parts list
is built here, once, and IDEA-163 reuses it when it re-opens (PROG-006 Q13, answered 2026-10-08:
*"it needs to be a new idea in prog-006"*).

## Shape

- **A part** is a name plus the set of files, hooks and settings it lays down, read from `stages/`,
  never copied. Starting point: IDEA-163's parts table (working rules, records, project management,
  session memory, agents by discipline, skill groups, design system, playbook, guards, ecosystem).
- **A floor preset** is a list of part names: Security, Mailroom, Office, Studio, Boardroom. Each
  includes the one below.
- **Adopt's plan and preview** read the same list (IDEA-163's `planStageSafe` takes a file set).
- **`--take <part>`** stays IDEA-163's, re-opened after the floors.

## Tasks

- [ ] Inventory every file in `stages/L0-quickstart/template/` and `stages/L1-mvp/template/` into a
  named part; a file in no part is a finding.
- [ ] Export the list from one module in `src/`; floors and adopt both import it.
- [ ] Presets for floors 1–5 as part names; Security's must equal what IDEA-172 lays down today.

## Found while building
