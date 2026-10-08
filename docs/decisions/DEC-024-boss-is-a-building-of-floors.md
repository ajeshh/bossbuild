---
id: DEC-024
type: decision
owner: "@ajeshh"
decided_by: ai-suggested-ratified
status: decided
created: 2026-10-08
reversibility: costly
scope: venture
revisit_by: 2027-01-08
supersedes: DEC-009 §3 (no new declared axis) — in part
program: PROG-006
---

# DEC-024 — BOSS is a building, and a project chooses its floor

## Context

BOSS installed itself one way: the whole venture ladder, from Quickstart up. Two things it could
not serve:

- **Many projects, little memory.** Ajesh, 2026-10-08: *"when a user has many different projects or
  apps… its like ADHD, remembering which project is at what status, what are they trying to build
  next, which window… is on which project."* `boss board` reads one project, and `boss list` prints a
  name, a mode and a version. A side project, or a repo that isn't Ajesh's, had no way in that didn't
  bring the venture half with it.
- **Not every project is a business** (IDEA-067). DEC-009 fixed the one place this bit and deliberately
  built no declared axis for *what a project is for* (§3), at n=0. DEC-011 has since changed the
  positioning (§5).

Sorting what ships showed the two questions are one: *how much BOSS does this project want?* That
cuts across modes. The skills that keep RESUME current (`/close`, `/log`) ship at MVP, yet a project
that only wants its context held needs them first.

The options were: a lighter "BOSS-lite" as a separate install, an `intent` field gating canvas cells
(IDEA-067 rung 2), or one ladder of install levels. Worked through in PROG-006, Q1–Q10.

## Decision

**BOSS is a building. A project chooses its floor, and each floor carries every floor below it.**

| | Floor | What it holds |
|---|---|---|
| outside | **Lobby** | Seen in HQ, nothing written into the repo. For repos you don't own. |
| 0 | **Basement** | The safety floor: deny/ask rules, the secrets pre-commit check, the `.gitignore` block. Under every floor. |
| 1 | **Mailroom** | Tracked: a registry row with *what this is* and *next*; its card in HQ. |
| 2 | **Office** | Context: working rules, RESUME, the idea pool; `/idea` `/inbox` `/decide` `/close` `/log`, re-entry. |
| 3 | **Studio** | Building: the build agents and skills, with no venture half. |
| 4 | **Boardroom** | Today's BOSS: the mentors, conscience, canvas, evidence, money — and the four modes. |

Its rules:

1. **Floors are presets over IDEA-163's adopt parts**, with `--take` adding or dropping one part. One
   mechanism, not two.
2. **The floor is declared** (`room:` on the project's stamp; a registry row for the Mailroom and the
   Lobby), never inferred from which files happen to be present.
3. **Modes live only inside the Boardroom.** A mode is a venture stage behind a venture gate; the
   floors below have no venture to gate. Entering the Boardroom starts at Quickstart and keeps what the
   lower floors installed.
4. **A door and an elevator.** `boss adopt` (existing folder), `boss new` and `/boss` (new) enter at the
   Basement and ride to the floor you came for; nothing defaults to the top. **`boss up`** moves a
   project later: next floor, and inside the Boardroom, next mode (`boss unlock` stays an alias). BOSS
   names a threshold once when it sees one, never nags, and the founder decides.
5. **No migration.** Every existing project is a Boardroom project at its current mode.
6. **A floor is where a project lives, not its rank.** HQ never pushes a project upward.

Named with Ajesh: *HQ*, the Mailroom (*"the bottom level is the mailroom like in a big corp"*), the
Basement (*"Its the "foundation" of the building"*), the cumulative ladder and the elevator (*"you
start in the basement and then go up, each time you go up you get all the perks of the previous
floor"*). The structure (floors as presets, declared not derived, modes inside the Boardroom) was
proposed by Claude and taken by Ajesh.

## Why

- **One ladder answers both needs.** A project that isn't a venture lives in the Office or Studio, and
  is never asked the venture questions. That is what IDEA-067 wanted, without the `intent` field that
  would gate canvas cells (rung 2). Ajesh: *"this solves 067."*
- **Cumulative is easier to remember**, and AI work should start inside the right container (Ajesh, on
  why the Basement comes with every floor). The Lobby keeps the zero-write case for repos that aren't
  yours, outside the building, so the ladder stays clean.
- **Compose and subtract.** Floors regroup what ships; they add no skill. The new parts are HQ, two
  registry fields, and the floor lists.
- **Rejected:** *BOSS-lite as a separate install* (a second copy of every file it shares, and nothing
  to climb). *An `intent` field* (asks what a project is for before it knows, and gates rather than
  omits). *Inferring the floor from files* (wrong the first time someone deletes a skill). *Floors each
  carrying their own modes* (two ladders to read on every card, for venture stages a Studio project
  doesn't have).

## Falsifier — what would prove this wrong, and by when?

By **2027-01-08**, with the Mailroom and the Office shipped:

- **The presets are cut wrong** if most adoptions reach for `--take` to get what they came for.
- **The ladder doesn't hold** if Ajesh's own non-BOSS projects (dhun and the others) aren't on a floor,
  or have been moved down or out within a month of going in.
- **The names don't carry** if someone reading the site can't say which floor they want.

## Consequences

- **DEC-009 §3 is superseded in part:** `room:` is a declared axis. It answers *how much BOSS*, not *what
  is this for*, and gates nothing. DEC-009's other sections stand; IDEA-067 rung 3 (a body of
  non-commercial support) stays deferred. DEC-011's positioning stands; the site will now say there are
  different ways to use BOSS, and must not claim support that does not exist.
- **Adopt changes shape** (IDEA-163): a bare `adopt --apply` already takes the safety floor, which is
  now the Basement; `--take` and the default parts set wait on this record.
- **The project stamp and the registry row gain a field** (`room:`; `what`/`next` on rows). Undoing it
  later means a migration for every project that has one, which is why this is `costly`.
- **Every surface that explains BOSS** (site, `/welcome`, `/boss`, `boss help`, README) gets one shared
  story of the building, landing with the first floor that ships.
