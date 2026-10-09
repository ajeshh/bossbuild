---
id: PROG-006
type: program
owner: product-lead
status: active
created: 2026-10-08
gist: Every project on the machine in one building — each signs in at the Lobby, gets its badge at Security, and lives on the floor that holds as much BOSS as it wants, up to the Boardroom (the whole venture); HQ shows them all.
next: land DEC-024 after the pre-land review, then phase 1 — the Lobby and the floor field (IDEA-165) (2026-10-08)
relates: DEC-024, IDEA-005, IDEA-049, IDEA-055, IDEA-067, IDEA-162, IDEA-163, DEC-009, PROG-001, PROG-004
---

# PROG-006 — HQ

**Opened 2026-10-08**, from a conversation. Ajesh: *"when a user has many different projects or apps
(can be side projects or others)… its like ADHD, remembering which project is at what status, what are
they trying to build next, which window (CLI, VScode or such) is on which project."* Then: *"boss board
is just for that project, not for all projects. like we have dhun or other projects already on this
machine. there is no way to get a status, visual, and remember what the project is about."*

The orientation pain is on record (EVID-001). That warrants the *orientation* half. The many-projects view
is warranted by Ajesh's own machine (Q3, answered).

**Members:** every record with `program: PROG-006` — `boss board PROG-006`.
[[IDEA-164]] the HQ dashboard · [[IDEA-165]] the Lobby and the Mailroom · [[IDEA-166]] the Office ·
[[IDEA-167]] the Studio · [[IDEA-168]] the Boardroom · IDEA-171 rooms side by side at the top (deferred).

## The model — DEC-024

**The decision is DEC-024; this section is a summary, and the DEC wins where they differ.**

| | Floor | Its one job |
|---|---|---|
| 0 | **Lobby** | Reception. Every project signs in: name, *what it is*, *next* — a registry row and an HQ card. Nothing written into the repo; a project may stay here. |
| 1 | **Security** | Your badge: deny/ask rules for the AI, the secrets pre-commit check, the `.gitignore` block. |
| 2 | **Mailroom** | Things arrive and get sorted: the project's inbox, idea capture, notes delivered from HQ's inbox. |
| 3 | **Office** | Continuity: working rules, RESUME, decisions; `/close` and `/log` keep the HQ card current. |
| 4 | **Studio** | Building: the build agents and skills, no venture half. |
| 5 | **Boardroom** | Today's BOSS, the venture, and the four modes. |

Each floor carries every floor below it. You enter through the door (`boss adopt`, `boss new`,
`/boss`), sign in at the Lobby, pass Security, and ride straight to the floor you came for; `boss up` is the elevator
after that. The floor is stored as a number (`floor: 0–5`); the names are labels. Floors are presets
over IDEA-163's adopt parts. Ownership is consent, asked at the door only when git says the repo is
someone else's.

**Floors are a second axis, not a rename of modes.** Modes say how far along the *venture* is; floors
say how much *BOSS* is in the project. They cut across: `/close` and `/log` ship in MVP today, yet the
Office needs them.

**HQ reads; it never adds a skill.** The EVID-001 re-aim still holds — compose and subtract. Floors
regroup what ships; the new parts are HQ, the Lobby's row fields, and the floor presets.

## Rules every change carries

- **A floor is where a project lives, never its rank.** A side project that stays in the Lobby or the
  Mailroom forever is fine. HQ never nags a project upward, never badges a quiet one red, never counts
  a streak. Busy projects read loud; the rest rest. `/sunset` is offered from HQ, as permission to put
  one down.
- **Machine-local, one way.** HQ reads this machine's projects; nothing leaves it (DEC-016).
- **Zero-dependency in BOSS.** `boss hq` and its `--json` live in `src/` on Node built-ins. Anything
  native (the menubar app) is a separate repo that only reads that JSON.
- **Going up shows before it writes; going down removes only what BOSS added**, never the founder's own.

## Phases

**Floors first, then HQ** (Ajesh, 2026-10-08: *"we build the floors, and then HQ"*). HQ reads what the
floors hold, so it is built once there is something to read.

1. **The Lobby and the floor field** — [[IDEA-165]]: the registry row's *what* and *next*, `floor:` on
   the stamp and the row, the door's ownership check. `boss list` shows the floor meanwhile.
2. **The Mailroom** — [[IDEA-165]]: inbox and capture as a preset; HQ's machine-wide inbox delivering
   into it.
3. **The Office** — [[IDEA-166]]: a project whose RESUME keeps itself.
4. **The Studio** — [[IDEA-167]].
5. **The Boardroom** — [[IDEA-168]]: today's BOSS gets `floor: 5`, and moving up into it.
6. **HQ** — [[IDEA-164]]: `boss hq` + `--json`, the local page, window awareness.
7. **The menubar** — a native app over `boss hq --json`, its own repo, only if the page gets used.

## The seam with IDEA-163

Agreed with that session, 2026-10-08. **IDEA-163 builds the adopt side:** Security as a bare
`adopt --apply`, the install plan built from named parts, `--take <part>`, and the preview. It
**exports the parts list** — each part a name plus the files, hooks and settings it lays down, read from
`stages/`, never copied. **PROG-006 builds on top:** the floor presets (each a list of part names),
`--floor <name>` resolving to them, `floor:` on the stamp, the Lobby's row, the door's ownership check,
and `boss up`. IDEA-163 builds Security only after DEC-024 lands on main.

**What IDEA-163 built (work/idea-163, 4dc87daf, told 2026-10-08, not landed):**
- Bare `boss adopt --apply` = Security only: deny/ask merged from L0 settings with no hooks
  (`computeSettingsMerge(dir, layers, { hooks: false })`, `src/sync.js`), `commit-secrets.js` and its
  pre-commit shim, the `.gitignore` block.
- **It already writes `floor`**: the stamp `{ floor: 1, installedLayers: [], adopted, adoptedFrom, theirs }`
  (no stage or mode) and the registry row `{ name, path, floor: 1, bossVersion, createdAt }`. IDEA-165
  builds on these fields; it does not add `floor` a second time.
- `boss adopt --apply --mode <m>` climbs from floor 1 to all of BOSS (`floor: 5`). **Interim:** this
  is the only way up until `boss up`; when `boss up` lands it owns 1 → n, and adopt's floor-1
  exception narrows to `--floor`.
- `whereLabel(stamp)` (`src/modes.js`) prints every "You are here"; it handles floor 1 and needs 0
  and 2–4. `boss status` on floor 1 prints the floor's contents and the way up.
- Still to come from IDEA-163: the exported parts list and `--take`.

## Tasks — too small to ship alone

- [ ] `boss list` and `boss hq` overlap. Decide: does `hq` replace `list`, or does `list` stay the
  terse admin view (pins, ghosts, `--prune`)? Write the answer here.
- [ ] Name the floors once in `src/glossary.js`, so every surface reads the same words.
- [ ] **Tell people the ways to use BOSS** (Ajesh, 2026-10-08: *"this is also a new usecase for Boss,
  so we need to communicate to users, that different ways to use boss"*). One explanation of the
  building, written once, read by the site (PROG-001), the front door — `/welcome`, `/boss`, `boss
  help` (PROG-004) — and the README. Lands with the first floor that ships, not before.
- [ ] **The site tells the building as a story** (Ajesh: *"storytelling using the names of each floor…
  make it relateable and which floor they want"*). First draft:
  `docs/stories/2026-10-08-the-building.html`. PROG-001's subtract-first rule applies.
- [ ] `docs/stories/` is new: internal story drafts that may become site content (its README says
  so). Keep it, or fold it into PROG-001, at the next site pass.
- [ ] **`boss new` and `boss adopt` ask which floor** (Ajesh: *"it also applies when someone initiates
  boss in a new or existing project"*), through IDEA-163's preview.
- [ ] IDEA-067's status moves when the Studio ships, pointing to DEC-024.
- [ ] `boss up` replaces the interim climb `adopt --apply --mode` from floor 1 (IDEA-163's exception).
- [ ] `whereLabel` covers every floor: 0 (Lobby) and 2–4, beside IDEA-163's 1 and today's 5.

## Open questions

- **Q11.** What signal names each threshold for `boss up` (Mailroom→Office, Office→Studio,
  Studio→Boardroom)? Modes already read readiness (`src/readiness.js`); which of it carries over?
- **Q12.** How does the door tell the repo is someone else's — remote owner vs the `gh` login, an org
  remote, no write access? And what does it do with no `gh` and no remote?

**Answered 2026-10-08, all now in DEC-024:** Q1 floors vs modes (modes only in the Boardroom; floor
declared) · Q2 the floors solve IDEA-067 (*"this solves 067"*) · Q3 Ajesh's own projects warrant the
build · Q4 notes with no project live in `~/.boss/inbox/` · Q5 floors are presets over adopt's parts ·
Q6 one cumulative ladder · Q7 a door and an elevator · Q8 the Lobby · Q9 every level a
different kind of place · Q10 `boss up`.

## Log

- **2026-10-08** — the Basement became **Security**, level 1, where you get your badge (Ajesh: *"its
  one floor below? so how do you pass it to go up? doesnt make sense"*). Levels are now 0–5.
- **2026-10-08** — the Lobby became reception (Ajesh: *"its like enter the lobby and then go to the
  floor. lobby is just the what is the name of this project"*); the Mailroom became inbox and capture,
  the Office continuity; ownership moved to the door as consent; the floor is stored as a number.
  DEC-024 corrected before landing; this record rewritten around it.
- **2026-10-08** — renamed the same day: Desk → **Office**, Floor → **Studio**; added the **Basement**
  (*"Its the "foundation" of the building"*) and the **Lobby**. Recorded as DEC-024.
- **2026-10-08** — opened. Names chosen with Ajesh: *HQ* for the dashboard and the building
  (*"I like HQ!"*); the ladder from Ajesh's *"the bottom level is the mailroom like in a big corp"*.
  Earlier working names, not taken: Junction, Concourse, Chowk; `listed / mini / boss`;
  `track / keep / build / boss`; Desk, Floor.
