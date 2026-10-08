---
id: PROG-006
type: program
owner: product-lead
status: active
created: 2026-10-08
gist: Every project on the machine in one building — HQ shows where each stands and what's next, and each project lives in the room that holds as much BOSS as it wants, from the Mailroom (just track it) to the Boardroom (the whole venture).
next: Ajesh takes or changes the Q1 recommendation, then /decide it — it blocks phase 1, the Mailroom (2026-10-08)
relates: IDEA-005, IDEA-049, IDEA-055, IDEA-067, IDEA-162
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
[[IDEA-164]] the HQ dashboard · [[IDEA-165]] the Mailroom · [[IDEA-166]] the Desk ·
[[IDEA-167]] the Floor · [[IDEA-168]] the Boardroom.

## The reasoning no single member holds

**HQ is the building; each project lives in one of its rooms.** *From the mailroom to the boardroom*
— a phrase people already know.

| Room | You're saying | In the repo |
|---|---|---|
| **Mailroom** | *"hey, track this"* | Nothing. A registry row with *what this is* and *next*; git fills in the rest. |
| **Desk** | *"help me hold the context"* | Working rules, RESUME, the idea pool; re-entry and `/close` keep it current. |
| **Floor** | *"help me build it, skip the venture talk"* | The building agents and skills — spec, smoke, ship, design review. |
| **Boardroom** | *the whole thing* | Today's BOSS: the mentors, the conscience, canvas, evidence, money. |

**Rooms are a second axis, not a rename of modes.** Modes (Quickstart → MVP → V1 → Scale) say how far
along the *venture* is. Rooms say how much *BOSS* is in the project. Sorting today's files proved they
cut across: `/close` and `/log` — the two skills that keep RESUME current — ship in MVP, yet the Desk
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
2. **The Desk** — [[IDEA-166]]: the room list file, and a project whose RESUME keeps itself.
3. **The Floor** — [[IDEA-167]].
4. **The Boardroom** — [[IDEA-168]]: today's BOSS gets its `room:`, and moving up into it.
5. **HQ** — [[IDEA-164]]: `boss hq` + `--json`, the local page, window awareness.
6. **The menubar** — a native app over `boss hq --json`, its own repo, only if the page gets used.

## Tasks — too small to ship alone

- [ ] `boss list` and `boss hq` overlap. Decide: does `hq` replace `list`, or does `list` stay the
  terse admin view (pins, ghosts, `--prune`)? Write the answer here.
- [ ] Name the rooms in `docs/glossary` / `src/glossary.js` once Q1 is answered, so the words are
  defined in one place.

## Open questions

**Answered 2026-10-08 (Ajesh):** **Q3 — yes**, Ajesh's own projects are warrant enough to build past
Phase 1. **Q1 — recommendation below, awaiting Ajesh's call**; once taken it is a DEC (load-bearing,
hard to reverse once projects carry a `room:`). **Q2 — explained to Ajesh, reading below, open.**

**Q1 recommendation:**
1. **Rooms are the outer axis; modes live only in the Boardroom.** A mode is a venture stage, and its
   gate (the canvas, Quickstart→MVP) is a venture gate. A Desk or Floor project has no venture to
   gate, so it has no mode. The Floor installs its whole build kit at once.
2. **Room is declared, not derived.** One `room:` on the project's stamp (the Mailroom, which has no
   stamp, is a registry row). Deriving it from the files present breaks the first time a founder
   deletes a skill.
3. **Rooms are lists, not copies.** One file names which skills, agents and hooks each room carries,
   drawn from the existing `stages/`; Desk ⊂ Floor ⊂ Boardroom. Every file still has one home.
4. **Moving into the Boardroom enters Quickstart**, keeping what the lower room installed; the mode
   ladder unlocks from there as it does today.
5. **No migration:** every existing project is a Boardroom project at its current mode.

**Q2 reading:** IDEA-067 rung 2 is an `intent` field (*what is this for?*) that would gate canvas
cells; rung 3 is a body of non-commercial support (maintainer burnout, succession). DEC-009 deferred
both at n=0 and kept the positioning as *incubator*. The Floor is **neither**: it gates nothing and
adds no support, it only leaves the venture half uninstalled. So DEC-009 does not need reversing. It
does touch DEC-009 §5: the site must not start promising "BOSS for non-ventures" beyond what the Floor
actually is. DEC-009's `revisit_by: 2026-11-21` is the natural place to look again.

- **Q1. How do rooms meet modes?** Is the Boardroom simply "today's modes, all four", with the Floor
  and Desk as subsets? Or does each room carry its own mode ladder (a Floor project at MVP)? The file
  sort says rooms cut across modes; the answer decides whether a project stamp gets a new `room:`
  field or whether room is derived from what is installed.
- **Q2. Is the Floor the same thing as IDEA-067's open rungs** ("not every project is a business",
  rungs 2–3 set aside by DEC-009)? If so, DEC-009's reasoning applies and may need revisiting.
- **Q3. What earns Phase 3 and beyond?** Ajesh's own machine is one case. Is that enough, or does a
  founder's multi-project use need to be on record first?
- **Q4. Where do Mailroom notes go that belong to no project yet** — `~/.boss/inbox/`, and how does
  one get assigned into a project's own `boss inbox`?

## Log

- **2026-10-08** — opened. Names chosen with Ajesh: *HQ* for the dashboard and the building
  (*"I like HQ!"*); the room ladder from Ajesh's *"the bottom level is the mailroom like in a big
  corp"*. Earlier working names, not taken: Junction, Concourse, Chowk; `listed / mini / boss`;
  `track / keep / build / boss`.
