---
id: PROG-006
type: program
owner: product-lead
status: active
created: 2026-10-08
gist: Every project on the machine in one building — HQ shows where each stands and what's next, and each project lives in the room that holds as much BOSS as it wants, from the Mailroom (just track it) to the Boardroom (the whole venture).
next: Phase 1, the Mailroom (IDEA-165) — registry row gains room/what/next; DEC-024 settled the model (2026-10-08)
relates: DEC-024, IDEA-005, IDEA-049, IDEA-055, IDEA-067, IDEA-162, IDEA-163, DEC-009, PROG-001, PROG-004
---

# PROG-006 — HQ

**Opened 2026-10-08**, from a conversation. Ajesh: *"when a user has many different projects or apps
(can be side projects or others)… its like ADHD, remembering which project is at what status, what are
they trying to build next, which window (CLI, VScode or such) is on which project."* Then: *"boss board
is just for that project, not for all projects. like we have dhun or other projects already on this
machine. there is no way to get a status, visual, and remember what the project is about."*

The pain behind it is on record: EVID-001's founder named orientation, forgetting what they are
building, and a visual sense of headway. That is the warrant for the *orientation* half. **Nobody has
yet asked for the many-projects view** — Ajesh's own machine is the first case. See Q3.

**Members:** every record with `program: PROG-006` — `boss board PROG-006`.
[[IDEA-164]] the HQ dashboard · [[IDEA-165]] the Mailroom · [[IDEA-166]] the Office ·
[[IDEA-167]] the Studio · [[IDEA-168]] the Boardroom.

## The reasoning no single member holds

**HQ is the building; each project lives in one of its rooms.** *From the mailroom to the boardroom*
— a phrase people already know.

| Room | You're saying | In the repo |
|---|---|---|
| **Mailroom** | *"hey, track this"* | Nothing. A registry row with *what this is* and *next*; git fills in the rest. |
| **Office** | *"help me hold the context"* | Working rules, RESUME, the idea pool; re-entry and `/close` keep it current. |
| **Studio** | *"help me build it, skip the venture talk"* | The building agents and skills — spec, smoke, ship, design review. |
| **Boardroom** | *the whole thing* | Today's BOSS: the mentors, the conscience, canvas, evidence, money. |

**Rooms are a second axis, not a rename of modes.** Modes (Quickstart → MVP → V1 → Scale) say how far
along the *venture* is. Rooms say how much *BOSS* is in the project. Sorting today's files proved they
cut across: `/close` and `/log` — the two skills that keep RESUME current — ship in MVP, yet the Office
needs them. So a room takes from several modes. How the two axes meet is Q1.

**The dashboard reads; it never adds a skill.** The EVID-001 re-aim still holds — compose and
subtract. HQ reads what each project already holds (`boss board --json`, RESUME, git). The rooms
mostly *regroup* what ships; the new parts are HQ itself, two fields on the registry row, and a way to
say which room a file belongs to.

## Rules every change carries

- **A room is where a project lives, never its rank.** A side project in the Mailroom forever is
  fine. HQ never nags a project upward, never badges a quiet one red, never counts a streak. Busy
  projects read loud; the rest rest. `/sunset` is offered from HQ, as permission to put one down.
- **Machine-local, one way.** HQ reads this machine's projects; nothing leaves it
  (DEC-016). No cross-machine sync until someone needs it.
- **Zero-dependency in BOSS.** `boss hq` and its `--json` live in `src/` on Node built-ins. Anything
  native (the menubar app) is a separate repo that only reads that JSON.
- **Promotion is one command and reversible.** Moving a project up a room adds files; moving it down
  removes only what BOSS added (`boss remove` semantics), never the founder's own.

## Phases

**Rooms first, then HQ** (Ajesh, 2026-10-08: *"we build the floors, and then HQ"*). HQ reads what the
rooms hold, so it is built once there is something to read. Q1 is decided before phase 1 starts,
since every room writes `room:`.

1. **The Mailroom** — [[IDEA-165]]: `room:` on the registry row, *what* and *next*, the portfolio inbox.
   `boss list` shows the room meanwhile.
2. **The Office** — [[IDEA-166]]: the room list file, and a project whose RESUME keeps itself.
3. **The Studio** — [[IDEA-167]].
4. **The Boardroom** — [[IDEA-168]]: today's BOSS gets its `room:`, and moving up into it.
5. **HQ** — [[IDEA-164]]: `boss hq` + `--json`, the local page, window awareness.
6. **The menubar** — a native app over `boss hq --json`, its own repo, only if the page gets used.

## Tasks — too small to ship alone

- [ ] `boss list` and `boss hq` overlap. Decide: does `hq` replace `list`, or does `list` stay the
  terse admin view (pins, ghosts, `--prune`)? Write the answer here.
- [ ] Name the rooms in `docs/glossary` / `src/glossary.js` once Q1 is answered, so the words are
  defined in one place.
- [ ] **Tell people the ways to use BOSS** (Ajesh, 2026-10-08: *"this is also a new usecase for Boss,
  so we need to communicate to users, that different ways to use boss"*). One explanation of the four
  rooms, written once, read by the site (PROG-001), the front door — `/welcome`, `/boss`, `boss help`
  (PROG-004) — and the README. Lands with the first room that ships, not before (no overclaiming).
- [ ] **The site tells the building as a story** (Ajesh: *"storytelling using the names of each floor…
  make it relateable and which floor they want"*). Walk the building from the Basement up; each room
  says who it is for in their words; the reader leaves knowing which room they want. One page or one
  section, PROG-001's subtract-first rule applies.
- [ ] **`boss new` and `boss adopt` ask which room** (Ajesh: *"it also applies when someone initiates
  boss in a new or existing project"*). Coordinate with IDEA-163 (adopt shows its plan first), told
  2026-10-08: keep its install step parameterizable by file set and its preview per part.

## Open questions

**Answered 2026-10-08 (Ajesh):** **Q3 — yes**, Ajesh's own projects are warrant enough to build past
Phase 1. **Q2 — the rooms are the answer to IDEA-067** (*"yes to 067… this solves 067"*), see below.
**Q1 — recommendation below, awaiting Ajesh's call.** Q1 and Q2 go into **one DEC**: it is
load-bearing, hard to reverse once projects carry a `room:`, and it supersedes part of DEC-009.

**Q1 — items 1–5 taken by Ajesh 2026-10-08** (items 6–7 taken earlier). DEC to be written once the
Basement and the door below are settled, so one record holds the whole room model.
1. **Rooms are the outer axis; modes live only in the Boardroom.** A mode is a venture stage, and its
   gate (the canvas, Quickstart→MVP) is a venture gate. A Office or Studio project has no venture to
   gate, so it has no mode. The Studio installs its whole build kit at once.
2. **Room is declared, not derived.** One `room:` on the project's stamp (the Mailroom, which has no
   stamp, is a registry row). Deriving it from the files present breaks the first time a founder
   deletes a skill.
3. **Rooms are lists, not copies.** One file names which skills, agents and hooks each room carries,
   drawn from the existing `stages/`; Office ⊂ Studio ⊂ Boardroom. Every file still has one home.
4. **Moving into the Boardroom enters Quickstart**, keeping what the lower room installed; the mode
   ladder unlocks from there as it does today.
5. **No migration:** every existing project is a Boardroom project at its current mode.
6. ✅ **Taken (Ajesh, 2026-10-08: *"room over parts"*). Rooms are presets over IDEA-163's parts; `--take` is the per-part edge.** IDEA-163 already splits
   what adopt installs into parts (working rules, records, session memory, agents by discipline,
   skill groups, guards…) and plans file by file. A room names a set of parts; `--take` adds or drops
   one. One mechanism, not two. (From IDEA-163 Q9, 2026-10-08.)
7. ✅ **Taken, and named: the safety floor is the Basement** (Ajesh: *"Its the "foundation" of the
   building. Its the basement."*). Every room above stands on it; it is not a room you choose. IDEA-163
   Q7 (Ajesh, 2026-10-08) made a bare `adopt --apply` take only the safety floor: deny/ask rules, the
   secrets pre-commit check, the `.gitignore` block. The Office starts from that floor. The Mailroom
   writes nothing, so it has none.

**Q2 — settled by Ajesh: the rooms solve IDEA-067.** IDEA-067 asked how BOSS serves a project that
isn't a business. Its rung 2 was an `intent` field (*what is this for?*) and rung 3 a body of
non-commercial support; DEC-009 deferred both at n=0 and kept the positioning as *incubator*. Ajesh's
read: a project that isn't a venture simply lives on the Office or the Studio, so the venture half is
never asked of it — no `intent` field, no cell gating. What that changes, for the DEC to say:
- **DEC-009 §3** (*no new declared axis*) — superseded in part: `room:` is a declared axis. It answers
  *how much BOSS*, which carries *what this is for* without asking it.
- **DEC-009 §5** (*the positioning does not change*) — superseded: BOSS now says there are different
  ways to use it. The no-overclaiming rule stays: the site says what each room *is*, never a body of
  non-commercial support that does not exist (rung 3 stays deferred).
- IDEA-067's status moves when the Studio ships, pointing here.

- **Q1. How do rooms meet modes?** Is the Boardroom simply "today's modes, all four", with the Studio
  and Office as subsets? Or does each room carry its own mode ladder (a Studio project at MVP)? The file
  sort says rooms cut across modes; the answer decides whether a project stamp gets a new `room:`
  field or whether room is derived from what is installed.
- **Q2. Is the Studio the same thing as IDEA-067's open rungs** ("not every project is a business",
  rungs 2–3 set aside by DEC-009)? If so, DEC-009's reasoning applies and may need revisiting.
- **Q3. What earns Phase 3 and beyond?** Ajesh's own machine is one case. Is that enough, or does a
  founder's multi-project use need to be on record first?
- **Q5. (IDEA-163 Q9)** Are rooms presets over adopt's parts, with `--take` as the per-part edge? And
  is the safety floor its own room or what every room above the Mailroom carries? Proposed answers:
  Q1 items 6 and 7. IDEA-163 holds `--take` and a default parts set until Q1 is decided.
- **Q4. ✅ Answered (Ajesh, 2026-10-08):** notes with no project yet live in `~/.boss/inbox/`;
  assigning one moves it into that project's `boss inbox`, or onto its row's *next* if it has no BOSS.
- **Q6. ✅ Answered (Ajesh, 2026-10-08): the building is one cumulative ladder, Basement first.**
  *"as you go up the level, including the previous levels make it easier to remember… if they are
  using AI then isnt it better to first create the right container the right way?"* So:
  **Basement → Mailroom → Office → Studio → Boardroom**, each floor carrying every floor below. A tracked
  project always has the Basement; the Mailroom is no longer zero-write. Open edge, Q8.
- **Q7. ✅ Direction (Ajesh, 2026-10-08): a door, then an elevator.** *"its like moving up a floor by the
  lift, you start in the basement and then go up, each time you go up you get all the perks of the
  previous floor… helping people id when they are crossing a threshold and being intentional."*
  - **The door** (`boss adopt` for an existing folder, `boss new` / `/boss` for a new one) is how you
    enter: always the Basement, then you ride to the floor you came for. Nothing defaults to the top.
  - **The elevator** moves a project up later, one deliberate command, with the same preview adopt
    shows. BOSS **names a threshold when it sees one** — once, never a nag — and the founder decides.
    Modes already do this (`boss unlock`, `src/readiness.js`); floors reuse that reading.
- **Q8. ✅ Answered (Ajesh, 2026-10-08): the Lobby.** A repo you don't own (a client's, an employer's,
  an open-source one) can wait in the Lobby: HQ shows its card from git plus a *what* and *next* you
  type, and nothing is written into the repo. The Lobby is outside the building, so the ladder stays
  clean: everything *in* the building stands on the Basement.
- **Q9. ✅ Answered (Ajesh, 2026-10-08): every level is its own kind of place.** *"everything is a
  different type of floor."* The build room was "the Floor", which collided with *which floor*; it is
  now the **Studio**. The Desk was furniture among rooms; it is now the **Office**.
- **Q10. ✅ Answered (Ajesh, 2026-10-08): `boss up`** is the elevator, one verb everywhere: next floor,
  and inside the Boardroom, next mode (`boss unlock` stays as an alias). Open, for IDEA work: the
  signal that names each threshold (Mailroom→Office, Office→Studio, Studio→Boardroom).

**Recorded as DEC-024.** **The building, as decided 2026-10-08:** *Lobby* (outside: seen, not touched) · **Basement** (the
safety floor) → **Mailroom** (tracked) → **Office** (context) → **Studio** (building) → **Boardroom**
(the venture). Each floor carries every floor below; a door to enter, an elevator to go up.

## Log

- **2026-10-08** — renamed the same day: Desk → **Office**, Floor → **Studio**; added the **Basement**
  and the **Lobby** (Q6–Q9). Records and files renamed (IDEA-166, IDEA-167).
- **2026-10-08** — opened. Names chosen with Ajesh: *HQ* for the dashboard and the building
  (*"I like HQ!"*); the room ladder from Ajesh's *"the bottom level is the mailroom like in a big
  corp"*. Earlier working names, not taken: Junction, Concourse, Chowk; `listed / mini / boss`;
  `track / keep / build / boss`.
