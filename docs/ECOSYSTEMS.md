---
id: ECOSYSTEMS
type: reference
owner: mentor-architect
status: draft — a hypothesis, tested by the flow reader (IDEA-137 · C2) and revised by what it finds
feeds: IDEA-137 (the program), IDEA-136 (the first ecosystem built from this)
created: 2026-10-04
---

# The ecosystem of ecosystems — how BOSS grows a discipline inside a project

> **Draft.** Written before the mechanism that tests it, on purpose: IDEA-136 (engineering) waits on
> it. Everything here is a hypothesis drawn from what BOSS's design system already does, a read of 44
> real flows in BOSS's own repo, and a research pass (IDEA-137). The flow reader (C2) will contradict
> some of it; when it does, this file changes, not the reader. It moves to `library/practices/` — and
> reaches founders — only after that (C7).

## What this is

Inside one founder's project, BOSS lays down **ecosystems**: design, engineering, evidence, claims,
data & trust, money, operations, culture. Each **governs itself**. All of them **live by a few shared
principles**. And between them sits the part nobody designs on purpose: **governance and support for
liveliness** — what each one feeds the others, who looks after the seam, and how anyone can tell
it's still alive.

Scaffolding is how the first ecosystems get planted. It isn't the whole of it.

BOSS → the project flows **one way**. Nothing here sends anything back.

**Who reads this:** anyone — a session, an agent, Ajesh — about to build a new ladder in BOSS. It is
the answer to *"we built design's ladder; how do we build the next one without starting over?"*

## The three layers

| Layer | What it holds | Where it lives |
|---|---|---|
| **Shared principles** | the few rules every ecosystem lives by | § below — five, no more |
| **Each ecosystem** | its own principles, seed, map, checks — its own soil | its practice (`design-system.md`, and next `ENGINEERING.md`) |
| **Between them** | what flows where, who stewards each seam, how liveliness is read | the declarations (§ Connections) and the reader |

The same idea, in the founder's own frame from before BOSS existed: many small dishes, each keeping
its flavour, one meal.

## The shared principles

Five. Each passes the test the design system uses for its own: *could a reasonable person argue the
opposite?* If one stops passing, it goes.

1. **Structure is earned.** An ecosystem arrives on a trigger, not a schedule, and at seed it decides
   only what gets dearer to reverse. *Opposite:* set the whole thing up front so nothing is missing
   later. (The seed-that-scales test, `design-system.md`; `seed-to-scale.md`.)
2. **Connect it to more of itself.** Every output has a reader; every input names where it comes from
   and what it gives back. Inside BOSS's own repo, an output nothing reads is a defect — *"an output
   of any system component that is not being used productively by any other component of the system"*
   (Mollison's definition of a pollutant, quoted by Holmgren). **In a founder's project it is never
   called that, and never reported by default:** a postmortem, a journal, an EVID with no decision
   yet are theirs to keep. *Opposite:* keep the parts independent, so one can't break another. (Both
   are true — see this principle's partner below, *each ecosystem stands alone*.)
3. **Repair before addition.** Before adding a part, find *"the latent center that is most salient:
   the center that seems most likely, if strengthened in the next step, to strengthen the wholeness of
   the larger configuration"* (Alexander, *Harmony-Seeking Computations*, 2009) — and strengthen that.
   **From MVP up.** In Quickstart, replacing is right: throwaway prototypes, pivots. **Offered, never
   gated** — *"add it anyway"* is a legitimate answer. *Opposite:* add what's asked, cleanly, and
   leave the rest alone.
4. **Every rule can be changed by the people who live with it — and retired.** Each ecosystem says how
   its rules get amended and by whom — **an extra door, never a replacement for muting: mute stays
   free, first-class, and never feeds any reading**; three exceptions to a rule mean the rule is wrong; a part that
   has outgrown its job names its successor and leaves. *Opposite:* rules are stable so they can be
   trusted.
5. **Read the plumbing, never the gardener.** BOSS reads flows between files — what's written, what's
   read, what moved — and says what it found, once, where the founder already stops. Never a score,
   never a level, never a reading of the founder's effort. (DEC-003: a position, never a grade.)
   *Opposite:* measure progress so the founder can see it.

**The tension to keep, not resolve:** principle 2 connects; every ecosystem must also **stand alone**
— do its job with its neighbours not planted. A project has missing neighbours by design — and not
only a young one: a commons with no money ecosystem is not behind (DEC-011). An ecosystem that breaks
without its neighbours was planted wrong.

**Quiet is not broken.** A project that rested for three months has changed nothing, and nothing in
it is wrong.

## The anatomy — eight parts every ecosystem has

Read from what the design system already does. The engineering column was filled from BOSS's own code
(IDEA-136, 2026-10-04) — and left empty where engineering has nothing, rather than invented.

| # | Part | What it does | Design has it as | Engineering (IDEA-136) |
|---|---|---|---|---|
| 1 | **Principles → guidelines → rules** | taste the founder argues with → decisions → what an agent can check | `STYLE_GUIDE.md`; § *Authoring your design principles* | five in `docs/ENGINEERING.md` §1, each rule marked enforced / partly / written-only |
| 2 | **A seed that scales** | the few decisions that get dearer to reverse; everything else deferred | the seed-that-scales table | zero-dep, ESM, state under `BOSS_HOME`, hook lib below `src/`, atomic writes, plan-then-apply (§2) |
| 3 | **A map of what exists** | the thing an agent checks before making a new one | `COMPONENTS.md` → `manifest.json` at V1 | the layer map + *find this before you write one* (§3) |
| 4 | **A planting moment** | the trigger, and what gets planted then | `design-tokens-loop` → `/design-tokens-init` | **empty** — BOSS's grew; the founder's is IDEA-136 · Q3 |
| 5 | **Checks at the write** | they fire when the file is written, and each says whether it **stops** (waits for a person) or **warns** (the work goes on) — a warning is not a boundary | the design guards (tokens, reuse, decisions, boundary, terminology) — all **warn** | **empty at the write** — at commit (pre-commit `test:ci`, **stops**) and on push (CI) |
| 6 | **A drift reader** | how far the real thing has moved from the map (V1) | `/design-library` | **empty** — done once by hand (IDEA-136 · B1/B3/B7 → F1–F10) |
| 7 | **Retirement** | what leaves, and what replaces it | unused → delete in this pass; `deprecated → X` | a helper absorbs its copies and its header names them; `supersedes.json` for shipped parts |
| 8 | **Amendment** | how a rule changes, and who changes it | three exceptions → the rule is wrong; a DEC to override | three exceptions → the rule is wrong; a `/decide` record; Ajesh decides |

**The fractal test:** the whole should have the same anatomy as each part. Today the ecosystem of
ecosystems has its principles (above), a map (`registry/flows.json`), a drift reader (`scripts/flows.js`,
`npm run check:refs`), retirement for paths (a declared succession binds every reader of the old one)
and part 8 (this file changes when the reader disagrees). It lacks a planting moment of its own and
checks at the write — the reader runs at commit, not when a skill is written. That is the build list,
stated as anatomy.

**Two anatomies, not one** (IDEA-137 · R9.1). The eight parts are how an ecosystem *runs*. Ajesh's
culture frameworks give every pillar a second anatomy, for how it *explains itself to a person*:
Concept · Importance · Key Learnings · Ways to Implement · Ingredients · Thinkers. They meet in three
places — *Ingredients* is part 2's seed, *Ways to Implement* is part 1's guidelines, *Thinkers* is a
practice's lineage — and the purpose line in step 2 below is *Concept* and *Importance* in one. The
governance parts (3, 5, 6, 7, 8) appear in no pillar's anatomy: in Ajesh's frameworks they live
**between** pillars (co-governance, renewal, graceful transitions) — which is this guide's third layer.

## Connections — what an ecosystem declares

Every ecosystem says, for each thing it exchanges with another:

| Declaration | Means | Design example |
|---|---|---|
| **gives** | an output another ecosystem reads | tokens → every code write (`design-tokens-guard`) |
| **takes** | an input, and **which giver** it comes from | `/landing` takes the brand, the tokens and the canvas's promises |
| **returns** | what the taker gives back to the giver | a design review's exceptions → the rule demoted (the one return path BOSS has built, and its healthiest seam) |
| **store** | an output kept on purpose with no reader yet — not a pollutant | an EVID kept for a later decision |
| **not planted** | a take whose giver doesn't exist in this project — silent, not broken, and never listed to the founder (*"yet"* assumes the project will climb) | the landing page with no brand |
| **steward** | who looks after the seam — *stewards, not owners* | the component index, for design ↔ engineering |

**What the reader reports.** On **BOSS's own repo** (C2): a *take* nothing writes · a *give* nothing
reads, unless it's a `store` · a path that only one end changed · a *take* with no *return*. One line
each, with the file and line. **In a founder's project** (C8), only the class the evidence supports:
**a path one end changed** — offered as a fix, silent otherwise.

**What the reader may read:** declared paths and files BOSS planted — never a crawl of the founder's
files. **Paths, never authors:** no `git log --author`, no blame, no flow attributed to a person.

**Why this, first:** in BOSS's own repo, all six broken flows are one shape — a path or a handover
changed, and only one end noticed (IDEA-137 · B1). At V1 the reuse guard keeps reading
`COMPONENTS.md` after the components moved to `manifest.json`, and goes silent exactly when the
project scales. Declarations plus a reader make that class visible on the day it happens.

## Building a new ecosystem — the steps

For IDEA-136 first, then claims, data & trust, operations.

1. **Find it already living.** Before writing a principle, inventory what the project (or BOSS's own
   repo) already does in this discipline, with file:line receipts. Extract, don't invent.
2. **Name its centre and its purpose.** What does it grow around? (Design: the component. Claims: the
   landing page. Data & trust: the first table holding personal data.) It gets planted *with* its
   neighbours around that centre, not alone. And one line: **what it is for, and what the project is
   worse at without it** — the boundary that says what belongs inside it. (Ajesh's own culture
   frameworks open every pillar this way, *Concept* then *Importance*, before any practice.)
3. **Fill the eight parts** — and leave a part empty rather than invent it. An empty seam column is
   an honest answer. Then say **where it learns what changed outside it** — no part does that on its
   own; for a founder's ecosystem it is BOSS's refresh disciplines, arriving by `boss sync`.
4. **Write its trigger and its yield.** It gives something on first use, **or** it is named a store —
   a one-way door whose yield comes later.
5. **Declare its connections** — gives, takes, returns, steward. Check each *take* stands alone when
   its giver is missing.
6. **Write how its rules get amended**, and by whom.
7. **Write how it leaves.** What replaces each part as the project grows; readers follow the successor.
   And ask, for each part: **could the founder do its job by hand from what this ecosystem wrote down?**
8. **Run the test** (below) before calling it planted, then stamp its record or practice with
   `anatomy: N` — the revision of this guide (§ Revisions) it was planted against.
9. **When this guide moves, every ladder follows.** A change to a principle, a part, a declaration or
   a step gets a row in § Revisions saying what a ladder must do about it (*review — …* or
   *nothing*). `npm run check:freshness` then names each ladder behind it. Read the revision, change
   the ladder or write in its record why not, and set `anatomy:` — a stamp is set by the review,
   never by touching the file.

## Liveliness — a design test for BOSS, never a reading of the founder

**The word stays internal.** Its opposite is *dead*, and a project that can die can be neglected —
the virtual-pet guilt a calm tool must not make. **A founder never sees** *liveliness, alive, dead,
dormant, pulse, healthy, metabolise, pollutant.* They see the mechanism: *connected*, *broken*,
*this check stopped reading X*.

**For BOSS's own ecosystems** — the test a new ecosystem must pass before it ships, never shown to a
founder:

| Sign | What BOSS checks in its own work | The founder's own word for it |
|---|---|---|
| **it doesn't drift from its seed unnoticed** | when something the seed governs moves away from it, the ecosystem can say so (*tokens say 8px; three components since use 10px*) — drift, **never** "unchanged since planted" (a seed right the first time is not a failure) | *Living Inertia* |
| **its outputs have a reader** | every *give* is read by something | *engagement as a pulse* |
| **it can let go as well as grow** | retirement and amendment **exist** — a missing one fails BOSS's build, never the founder | *graceful transitions* |
| **it is authored from within** | the founder **can** change what it watches and mute it — whether they *have* is never read | *stewards, not owners* |

**For a founder — one line, only when there is something to fix** (C5): a flow that was working and
is now broken because one end moved, as one item in `/close`'s existing numbered list, in DEC-003's
shape — *"The reuse check still reads `COMPONENTS.md`; your components moved to `manifest.json`, so it
stopped checking. Point it at the manifest?"* Otherwise nothing. No grid, no row per ecosystem, no
count, no *"since last time"* (after a gap that only ever says *things went quiet*). Never in the same
close as a mode graduation; at a graduation, only the flows the new mode would break, offered to wire.

**What can't be read:** whether reading an output changed anything. That stays the founder's
judgment. The reader keeps flows from breaking; **it cannot make anything alive.**

**Falsifier (DEC-003's shape):** show founders anything beyond the broken-flow line only if a real
founder, unprompted, asks twice how their project's parts are connected.

## Handing over and stepping back

- **A pioneer leaves when its successor matures, and its readers follow.** Name the successor; check
  the readers moved (the `COMPONENTS.md` → manifest break is what happens when they don't). Some
  pioneers should stay.
- **The second repair offers a check** *(decided — DEC-022, refines DEC-003)*. Only for breaks the
  **founder's work** causes — BOSS's own breaks (all six B1 found) get fixed upstream and arrive by
  `boss sync`; handing those over would shift BOSS's burden onto the founder. Only when the **same
  file and the same class** recur. Worded without counting or blame — *"This has come up before. I've
  fixed it. Want a check that catches it at the write? I'll write it."* — with **"keep fixing it for
  me"** as a first-class answer, recorded once, never re-offered for that kind. Repairing quietly
  forever stops the founder's own capacity from growing — *if they didn't choose it*.
- **BOSS can always be needed less** *(decided — DEC-023; whether it becomes a principle waits on IDEA-137 Q8)*. Every part
  can be handed over, turned off or removed, with no lock-in — **the founder decides when; BOSS never
  steps back on its own read.** (An aim to *be* needed less invites a measure — fewer interventions —
  that rewards silence.) The one thing never retired: the line about harm to someone not in the room.
  Test: remove BOSS from a throwaway scaffold; nothing the founder built breaks.
  That keeps the founder's **files**. The second test keeps their **ability**: could they do each
  part's job by hand from what the ecosystem wrote down? A tool people can no longer work without is
  noticed only when it's too late, so this is asked when the ecosystem is planted (step 7) — never
  read off the founder.

## The test

*Plant the ecosystem in a throwaway project at the wrong rung, with one neighbour missing and one
neighbour's path moved.* Does it stand alone? Does the reader stay silent on the missing neighbour
and name the moved one, with the file and line? Does it fit the eight parts — or did you invent a
part to fill a row?

And for the whole: plant three ecosystems in three throwaway projects. Do they hang together — the
same anatomy at every scale — or is each a different shape wearing the same name?

## Lineage, and words not to use

**Built from:** BOSS's own design system (the anatomy is its shape); Ajesh's humane-tech frameworks
(the Menu of pillars on one anatomy, the Welcome → Vision → Values → Done cycle, the Compass's move
from scoring to navigation); a humane review before anything was built (IDEA-137 · H1); and, read at source, Christopher Alexander, Elinor Ostrom, David
Holmgren and Bill Mollison, Donella Meadows, Margaret Wheatley & Myron Kellner-Rogers, Fritjof Capra,
Carol Sanford, Edgar Schein, Brian Foote & Joseph Yoder, Richard Gabriel; and since revision 5,
Stafford Beer (the viable system's recursion), W. Ross Ashby, Shigeo Shingo (control versus warning),
Ivan Illich (radical monopoly) and James C. Scott (a map is judged by what its job needs). The research
and its killed claims: IDEA-137.

**Don't use:** *edges are productive* · *guild* · *slow it, spread it, sink it* · Alexander's
fifteen properties as **checks** (they're vocabulary for a person) · Kimmerer's Honorable Harvest
wording (an Indigenous ethic between persons; borrowing it for files breaks its own first rule) ·
*liveliness score* · *the first permaculture scaffold* (others apply these ideas; say the mechanism).
**In anything a founder sees:** *liveliness, alive, dead, dormant, pulse, healthy, metabolise,
pollutant, not planted yet.*

## What the reader will test (open)

- Are the eight parts right, or is one of them two (or two of them one)?
- Do *returns* exist for most flows, or is it rare and the declaration noise?
- Does *not planted* separate cleanly from *broken* on a real Quickstart project?
- Is principle 2's partner — *stands alone* — a sixth principle or a property of the first?

## Revisions

What changed in this guide, and what each ladder must do about it. A ladder's `anatomy:` names the
last revision it was reviewed against; `npm run check:freshness` names a ladder behind a revision
that asks for a review. Rows 1–3 were written after the fact, from git (`60bb3c9`, `f6de36a`,
`bf0a180`) — a change that only filled one ecosystem's own column (`64b5f25`, engineering) is not a
revision.

| Rev | Date | What changed | A ladder must |
|---|---|---|---|
| 1 | 2026-10-04 | Drafted: five shared principles, the eight parts, the connection declarations, steps 1–8, liveliness as a design test, handing over, the test | review — fill the eight parts (empty where empty), declare its connections, say how its rules are amended and how it leaves |
| 2 | 2026-10-04 | Handing over decided: the second repair offers a check (DEC-022); BOSS can always be needed less, held by the removal test (DEC-023) | review — a founder-caused break that recurs here gets a check offered; whatever this ladder installs in the app survives `boss remove` |
| 3 | 2026-10-04 | Step 2 gains the purpose line — what the ecosystem is for, and what the project is worse at without it; two anatomies (how it runs, how it explains itself) | review — write the purpose line |
| 4 | 2026-10-05 | Steps 8–9: a ladder stamps `anatomy:`, and follows this guide when it moves; this table | nothing — the stamp is the step |
| 5 | 2026-10-05 | Three lenses read at source (IDEA-137 · R11): step 3 says where an ecosystem learns what changed outside it; part 5 marks each check **stops** or **warns**; step 7 and § Handing over ask whether the founder could do each part's job by hand | review — name where it learns of outside change; mark each of its checks stops or warns; answer the by-hand question per part |
