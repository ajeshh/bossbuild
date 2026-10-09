---
id: IDEA-172
type: idea
kind: capability
owner: product-lead
status: shipped — built under IDEA-163 (ac154e8a, d14b63b5), recorded as its own floor 2026-10-08
created: 2026-10-08
proof: test/adopt.test.js
proof_note: a bare `boss adopt --apply` lays down Security and nothing else; the test pins it
program: PROG-006
relates: DEC-024, IDEA-163, IDEA-142
gist: Level 1 — the badge every floor above needs: deny/ask rules for the AI, a secrets check on every commit, and the .gitignore block.
next: nothing open here; `boss up` (PROG-006) takes over the climb from floor 1 (2026-10-08)
---

# IDEA-172 — Security

Level 1 of the building (DEC-024). Ajesh named the step (*"Its the "foundation" of the building"*) and
then moved it above the Lobby (*"its one floor below? so how do you pass it to go up? doesnt make
sense"*): you sign in at the Lobby, get your badge at Security, then go up.

## What it lays down (as built by IDEA-163)

- deny/ask rules merged from L0 settings, with no hooks registered
  (`computeSettingsMerge(dir, layers, { hooks: false })`, `src/sync.js`)
- `.claude/hooks/lib/commit-secrets.js` and its git pre-commit shim (IDEA-142)
- the `.gitignore` block from L0
- stamp `{ floor: 1, installedLayers: [], adopted, adoptedFrom, theirs }`; registry row `floor: 1`

Built inside IDEA-163, before every floor became its own record (Ajesh, 2026-10-08: *"all the floors
shd be their own idea"*). This record is where Security's own changes go from now on.

## Found while building
