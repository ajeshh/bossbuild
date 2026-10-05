---
id: IDEA-137
type: idea
kind: capability
owner: mentor-architect
status: exploring (research landed 2026-10-04; nothing built)
program: ecosystem-of-ecosystems
proof: none
proof_note: this record holds the cross-ladder reasoning, which belongs to no single ladder — the graduation test for a `PROG-NNN` in docs/IDS.md § program. It graduates when the PROG record type is built (records.js keeps it deliberately unbuilt until a real program needs it — this may be that program).
gist: Inside a founder's project, BOSS lays down an ecosystem of ecosystems — design, engineering, evidence, claims, trust… each governing itself, all living by one set of principles, with governance and support for liveliness between them. Scaffolding is how the first ones get planted. BOSS → project flows one way.
created: 2026-10-04
---

# IDEA-137 — the ecosystem of ecosystems: governance and support for liveliness, inside the founder's project

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

> **Reframed by Ajesh, 2026-10-04:** *"its not about the land.. but the ecosystem of ecosystems, and
> how there is governance and support for liveliness, while still living in principles."* And:
> *"inside ones own implementation of boss inside their app it should create an ecosystem of
> ecosystems"* — **within one founder's project**. Between projects, **BOSS → project flows one way,
> by design** (no channel back; DEC-016, the no-telemetry promise). Scaffolding is one part: how the
> first ecosystems get planted.
>
> The three layers, renamed: **principles** every ecosystem lives by (was *the land*) · **the
> ecosystems** each governing itself (was *the beds*) · **governance and support for liveliness**
> between them (was *the relationships*). The draft text below keeps the old words where it records
> what was thought at the time.

- **What:** BOSS grows ladders one discipline at a time — design ([[IDEA-091]]), engineering
  ([[IDEA-136]]), agents ([[IDEA-124]]), product ([[IDEA-093]]) — and each was designed alone. This
  program names three layers:
  1. **The land** — one governing scaffold architecture every ladder shares: structure is earned,
     seed only what gets dearer to reverse, arrive on a trigger, retire on purpose. The same anatomy
     for every bed.
  2. **The beds** — each ladder keeps its own governance. Design governs design; engineering governs
     engineering. Different soil, different seed.
  3. **The relationships** — how the beds feed, shelter and compost into each other. **This layer
     exists today only as one-off wiring** (canvas Promises → `/landing`; tokens → the page; an EVID
     grade → a `/roadmap` bet; the copy glossary → code names, IDEA-136 · A7) **and is designed
     nowhere.** IDEA-093's finding — BOSS records a bet in four places and reads none back — is this
     layer's absence, seen once.
- **Who it's for:** the founder growing a venture past one discipline, and the agent that works in
  one bed and cannot see the others.
- **Lineage (Ajesh's, not borrowed):** permaculture is in Ajesh's own humane-tech corpus
  (*Small and Slow Solutions*, citing Holmgren). Ajesh named the companions on 2026-10-04: Alexander's
  *A Pattern Language*, Brand's *How Buildings Learn*, software gardening.
- **Altitude:** both, in order — BOSS's own land first (BOSS is self-hosted and already has four
  beds), then the shape UP to what ships. The IDEA-136 rule holds: extract from practice, don't invent.
- **Mandate:** compose and subtract, never add a skill. A metaphor that changes no behaviour is a pitch,
  not architecture — every mechanic below must name the behaviour it changes or be cut. A new gate
  still needs a bug that reached a user.
- **Claim discipline:** *"nobody else does this"* — **killed 3-0 at R4** for the metaphor and for
  cross-discipline checks in general. What may survive (unverified): checking an output is *read*,
  across non-code disciplines, in a founder scaffold. Nothing goes on the site before a `/comp-eval`,
  and then only the mechanism, never the metaphor.

## The anatomy every bed shares (draft — from what design and engineering have in common)

1. Principles → guidelines → rules (a principle a reasonable person could argue against)
2. A seed that scales (decide early only what gets dearer to reverse)
3. A map of what exists (checked before making a new one)
4. A planting moment (the trigger)
5. Checks at the write
6. A drift reader (V1)
7. Retirement

## Mechanics — after research: fourteen drafts → three, plus a charter written last

Research: `docs/research/sessions/SESSION-2026-10-04-the-land.md` (gitignored — 4 outside angles, 13
claims 3-vote verified, 5 killed). Ids keep their draft numbers so citations hold.

**What the research changed.** The sources support the scaffold's **engineering** half strongly
(repair over replacement, Alexander 1975; group what changes at the same rate, Foote & Yoder 1997) —
and the part **between** disciplines, which is this program's real novelty, **least**. Every uptake
of a pattern language lost the links or the order, Alexander's own included. And each source runs on
years or decades: before product-market fit a venture's *why* is its **fastest**-moving layer, so
borrowed "slow controls fast" rules invert. The mechanics left are the ones BOSS's own repo proves it
needs — B1 found six broken flows, all of one class.

- **M2 · The flow map — gives, takes, and a reader** *(the core; absorbs M6, M7, M9, M10)*. Each bed
  declares what it **gives** and **takes** — sideways links in frontmatter (the index), up/down links
  in the practice's own prose (the language). A reader reports: a *take* nothing writes; a *give*
  nothing reads (Mollison's pollutant — *"an output… not being used productively by any other
  component"*); a path only one end changed. An output kept on purpose is marked a **store** and is
  not pollution. Each *take* names who owns the seam. A report, never a gate.
  *Changes:* B1.1–B1.6 become findable by a run, not by an audit; `POSTMORTEM.md` (zero readers) and
  `/sunset` get a reader or an honest `store`. *Builds on:* `registry/surface-ladder.json` (already
  declares outputs — wrongly in six places) and `scripts/check-refs.js` (checks links, not reader/writer
  pairs).
- **M12 · Succession that's followed** — a pioneer names its successor **and** the readers follow it;
  it leaves when the successor **matures**, not on a date (Holmgren P12). Some pioneers should stay.
  *Changes:* B1.1 — the reuse guard going silent when the component index moves to the manifest —
  can't recur unnoticed. This is a special case of M2 (the successor is a *give* the guard must *take*).
- **M11 · Repair from the weakest place** — before adding, name where the existing whole is weakest
  and what this strengthens; prefer the simplest change (Alexander 1975 for repair; the centres
  framing is his later work). **From MVP up** — in Quickstart, replacement (pretotype, prototype,
  pivot) is right. *Changes:* the reuse check generalises past UI components; the escape hatch "a new
  centre, say why" stays (Gabriel: over-compression hurts habitability).
- **M1 · The charter — written last.** From B1–B2's receipts, by noticing where the beds' languages
  overlap (Alexander's *structure of structures*, reached bottom-up), with a revision path. Its test:
  several throwaway scaffolds — do the beds hang together?

**Kept as candidates, demoted:**
- **M3 · Pace, read not assigned** — a layer's pace is read from how often it changes × how much
  depends on it (Foote & Yoder), never named by noun; modes set how hard a layer is to change (Q5:
  orthogonal, coupled). A conscience moment that names a slow-layer crossing, never a gate. Brand's
  six building layers do **not** carry over.
- **M5 · Planted around a centre** — beds planted together around one thing (the landing page; the
  first table). Not called a *guild* (Ferguson & Lovell: the word means near the opposite in ecology).
- **M8 · Outside forces** — include **welcome** ones (a new model capability), and the answer is
  placement, not only a watcher.
- **M13** folds into anatomy #2: a bed yields on first use **or** is named a store.
- **M14** is already held — only with its pair, consolidation (PRINCIPLES #1, `/extract`).

**Parked:** **M4 · zones** — placement by *needed* attention, and nothing observes reads today (the
trace holds writes only). Re-open if reads are ever observed.

**Words not to use** (killed in the session): *edges are productive*; *guild*; *slow it, spread it,
sink it* (attribution is only its coiner's own organisation, and *slow* is the opposite of BOSS's
job); *"software is more like gardening than construction"* (not the text — Hunt & Thomas wrote
*"Rather than construction, software is more like gardening — it is more organic than concrete"*);
*"the first permaculture scaffold"* or *"nobody declares cross-discipline flows"* — killed 3-0: tools
that check requirements against design against tasks exist. **What may survive, unverified:** checking
that an output is **read** rather than merely *covered*, across **non-code** disciplines (evidence,
claims, design, trust) in a founder scaffold. Say the mechanism, never the first.

**Already held, named for the map, not new:** succession = the modes; observe before you design =
`/read-repo`; self-regulation and feedback = the conscience; small and slow = the mandate itself.

## Work — every item has an id; cite as `IDEA-137 · R2`

**R — research (first)**
- [x] **R1–R5** · done 2026-10-04 — `SESSION-2026-10-04-the-land` (gitignored). Kept below for the
  record of what was asked.
- [x] **R1** · Permaculture at source: Holmgren's twelve principles, Mollison's zones, sectors, guilds,
  succession, stacking functions, edge effect. Attribute each to its originator (the corpus note is a
  summary that has not been checked).
- [x] **R2** · Alexander: *A Pattern Language* (pattern form, links between scales), *The Timeless Way*,
  *The Nature of Order* (centres, structure-preserving transformations, the fifteen properties), and
  how the software-patterns movement took him up — and what it dropped.
- [x] **R3** · Brand: shearing/pace layers (and whose idea it was first), low road vs high road,
  *"all buildings are predictions"*; the software-gardening lineage (the gardening metaphor,
  habitability, piecemeal growth, the big ball of mud's shearing layers).
- [x] **R4** · Novelty: who else builds a founder or developer scaffold on these ideas — tools,
  frameworks, essays. Feeds the claim, and `/comp-eval`.
- [x] **R5** · For each M: does the source support it, contradict it, or show where it failed? Killed
  mechanics recorded beside kept ones.

- [x] **R6** · Permaculture **beyond scaffolding**, every connection that applies: the three ethics;
  Holmgren's domains beyond land (culture, health, finance, governance, tools); the design process;
  every principle and concept (not only the ones M1–M14 used) — mapped at three scales: inside a
  project, the founder and the venture, and the network of projects (BOSS's commons, where every
  project feeds BOSS). Each graded held / sharpens / new / stretch, BOSS grepped first.
- [x] **R7** · Verify Ajesh's ◌ list (title, author, year, the core idea at source) — then each
  verified lens gets a short card of its operative ideas, consulted when a bed is built.

**R6 findings (2026-10-04 — 76 connections at three scales: 52 already held, 7 sharpen, 2 new, 15 stretch)**

Almost everything permaculture names, BOSS already holds in its own words. ~~**The real gap is the
network scale: PRINCIPLES #1 says every project feeds UP, but a founder's learning has no way back
unless that founder is Ajesh** — `boss learn` needs a BOSS source checkout, `/extract` parks UP
candidates as pending, `/feedback` carries version/mode/OS only. The library pushes (sync) and
receives nothing: in permaculture's own history, that shape is the franchise its critics named.~~
**Wrong read, corrected by Ajesh:** the one-way flow is the design, not a gap. R6's network-scale
rows (c) are out of scope; what stands is the in-project scale (a) and the founder scale (b).

- [~] ~~**N1 · Seeds back to the library**~~ **REFUSED (Ajesh, 2026-10-04): BOSS → project flows one way; the network of projects is not how it connects.** (NEW, c1) — when `/extract` parks an UP candidate or
  `/sunset` harvests a lesson, offer once to send the generalised text through `/feedback`, shown in
  full, sent only on a yes (DEC-016 and the no-telemetry promise hold). L1 `extract`, L0 `feedback`,
  L0 `sunset`. **The cheapest step that makes the network scale real** — Q8's mechanism.
- [~] ~~**N2 · A founder's edit is a seed**~~ **REFUSED with N1, same reason.** (sharpens, c3) — `/boss-sync` §4 already calls a locally
  edited file "a signal about what BOSS got wrong", asks what changed, and drops the answer. Route it
  through N1. (Holmgren P1: locally evolved models outperform ones introduced from outside.)
- [ ] **N3 · Where a practice was proven** (sharpens, c2) — a `grown_in:` line (mode, stack class,
  n projects); `/boss-sync` says *"proven in BOSS's own repo only"* or *"in 3 projects like yours"*.
  Most practices are n=1.
- [ ] **N4 · Founder stamina on the earning branch too** (sharpens, b2) — `/canvas` asks whose hours
  carry it and what would make you stop only when the project won't earn (`:266-275`); ask once on
  the earning branch until it pays. A canvas question, never a hook.
- [ ] **N5 · Chop and drop** (sharpens M2/M7, a30) — `/sunset FEAT` writes its lesson into the
  FEAT/IDEA record `/spec` and `/roadmap` already read, not a `POSTMORTEM.md` nothing reads. Fixes a
  B1 broken flow **without adding a reader**.
- [ ] **N6 · Beds that stand alone** (sharpens M2, a13) — each *take* says what its bed does without
  its giver, so M2's reader can tell *not planted yet* (silent in Quickstart) from *the giver moved*
  (the B1 class). **Without this M2 cries wolf on every young project.** (Holmgren P4.)
- [ ] **N7 · BOSS is the pioneer that leaves** (sharpens M12, c11) — at V1+, `/boss-sync` lists BOSS
  skills whose job a venture-owned thing now does (their CI doing `/smoke`'s job) and offers
  retirement through the existing `--remove` consent.
- [ ] **N8 · Name the missing reader, not the pile** (minor, a16) — Mollison's *"not an excess of
  snails but a deficiency of ducks"*: M2 reports a pile-up as the reader it lacks.
- [ ] **N9 · Concentration at V1** (new, low, b18) — `/money` operate names one customer or channel
  carrying most revenue. Ordinary business lore; pre-fit, focus is right.

**What we missed (audit, 2026-10-04 — Ajesh: *"have we missed anything"*)**
- [x] **R8** · 🔴 **Ajesh's thinkers, read for this frame.** The 25 books are verified to *exist*;
  none has been *read* for governance and liveliness, and several bear on the reframe more directly
  than permaculture does — Ostrom (governance of a shared resource), Meadows and Capra (flows,
  self-organisation, what makes a system alive), Wheatley, Senge, Alexander's *Nature of Order*
  (*life* — Q9), Mang & Haggard and Sanford (regenerative), brown (emergence, fractal), Kimmerer
  (reciprocity), McKeown (subtraction), Johnson (the adjacent possible). Each read at source into a
  **lens card**: 3–5 operative ideas, verbatim where fetched, mapped to M2/M11/M12/N6/Q9, graded
  held / sharpens / new / stretch, BOSS grepped first.
- [x] **R9** · **Ajesh's own corpus, mined.** `docs/research/inbox/humane-tech/` (Compass, Kinship
  Network, Small and Slow, Space Design…) is where these lists came from and is the generative half
  of BOSS's lens; nobody has read it for ecosystems, governance or liveliness.
- [ ] **R10** · The rest of the list feeds **other ecosystems**, not this frame — culture (Schein,
  Brown, Palmer, the Clarks, Kornfield), the founder and the why (Sinek, Whyte, Macy & Johnstone,
  Bateson, Scharmer), craft (Sennett), rethinking (Grant), designing with people (Jordan & Fuller).
  Lens cards when that ecosystem is being built, not now.
- [ ] **H1** · 🔴 **The humane check hasn't run.** *Governance* can become ceremony or surveillance;
  a *liveliness* reading can become a score — and BOSS gives a position, never a grade (DEC-003).
  `mentor-humane` and `designer` before M2's report has a founder-facing word.
- [ ] **L1** · Link the related records: [[IDEA-132]] (the design system as a graph — M2 inside the
  design ecosystem, already shipped), [[IDEA-004]] (temple culture, parked — the culture ecosystem and
  its council of thinkers), [[IDEA-093]], [[IDEA-135]], [[IDEA-133]] (the why — the founder scale).
- [ ] **F1** · No founder-side read yet — what a founder *meets* (cohort-aware). After M2 exists.
- [ ] **S1** · Session end: commit, `docs/RESUME.md`, devlog line. IDEA-136 was touched (one
  `program:` line) — check no peer holds it before committing.

**R9 finding (2026-10-04) — Ajesh already designed the ecosystem of ecosystems.** The humane-tech
corpus (gitignored; detail in the session record) holds it as practice, not theory: **the Menu** —
~15 culture pillars, each a dish, all on one shared anatomy (thali, banchan, bibimbap: *ingredients
keep their flavour and come together*); a **Welcome → Vision → Values → Done** cycle between pillars,
with Done as where *the ecosystem of the work becomes visible*; the **Compass**, which moved *from
scoring toward navigation*; the **Atom of Work** (the user story as the nucleus where disciplines
meet); and **jugalbandi** — call and response between equals inside a shared raga — as the picture of
the layer between ecosystems. Ajesh's words already name what this record borrowed from outside: a
ritual nobody engages is *a sign for renewal* (before Mollison's pollutant), *cultural debt* (M11),
*graceful transitions* (M12), *stewards, not owners* (the seam), *invitation, not mandate*
(governance). **So the program extracts Ajesh's frame first and uses the outside thinkers to test
it — not the other way round.** Two tensions for Ajesh: *Small and Slow* leans on slow, which the
research found inverts before fit; the Compass's 1–5 scoring tool pulls toward the score their own
navigation move left behind.
- [ ] **R9.1** · Read the Menu's anatomy and the Done cycle against IDEA-137's anatomy and M2 — does
  Ajesh's anatomy replace the draft one?
- [ ] **R9.2** · Q9 candidate in Ajesh's words: *engagement as a pulse* (used), *Living Inertia*
  (changes), *repairing cultural debt* (repairs), *graceful transitions* (sheds) — read at **Done**
  moments (`/close`, a mode graduation), not as a standing dashboard.

**R8 synthesis (2026-10-04 — 13 thinkers read at source, lens cards in the session record)**

The thinkers converge — and converge on **Ajesh's own frame** (R9), from outside it.

- **Q9 answered, no score.** An ecosystem is alive when information flows through it in the
  project's own hands. Four yes/no signs, each about **one flow with its file:line**, never a level,
  never a total:
  1. **it metabolises** — the founder's work has rewritten it since BOSS planted it (Capra:
     self-generation; git can see it) — *Living Inertia*;
  2. **its outputs reach someone deciding** (Meadows: feedback *"to the right place"*) — *engagement
     as a pulse*;
  3. **it can subtract as well as add** — *graceful transitions*;
  4. **it is authored from within** — the founder can amend what it watches, and mute it (Ostrom:
     users make and monitor their rules) — *stewards, not owners; invitation, not mandate*.
  Read **by comparison, not absolutely** (Alexander: two states compared; Sanford: *"what has evolved
  since the last time… what's next"*), **once, where the founder already acts** (`/close`, `/boss`,
  a conscience moment — Ajesh's *Done*), never a dashboard. It says what it **cannot** read: whether
  reading an output changed anything. **The line it lives behind: read the plumbing, never the
  gardener** (Sanford — feedback on people makes them dependent; M2 reads flows between files).
- **Whether the ecosystems form a system is "an empirical question"** (Ostrom) — M2's reader is that
  test; *mechanism first, claim second* has a pedigree. Wheatley & Kellner-Rogers: *"To create better
  health in a living system, connect it to more of itself."*
- **M11 reworded** — not *the weakest place* but **the latent centre whose strengthening most helps
  the whole** (Alexander, *Harmony-Seeking Computations* 2009); his later word is *wholeness-extending*,
  not *structure-preserving*. As first drafted M11 could send a founder to shore up a weak, irrelevant
  corner.
- **The reader maintains; it cannot make anything alive** (Krone's levels of work, via Regenesis).
  Supporting liveliness = leaving the founder more able to read their own ecosystems, then stepping
  back (M12, N7).

**New mechanics from R8** (candidates; each changes a behaviour, none adds a skill):
- [ ] **N10 · A return path on every take** (Kimmerer, Johnson) — each take names what it gives back
  to its giver; most of B1's absent flows are missing returns (pretotype → EVID, landing → /trust,
  sunset → spec). Design's *three exceptions → demote the rule* is the one return path BOSS built,
  and the healthiest seam in the inventory. **No Kimmerer wording in shipped text** — her reciprocity
  is an Indigenous ethic between persons; borrowing it for files without return breaks its first rule.
- [ ] **N11 · The second repair hands over** (Senge, *shifting the burden*) — the second time BOSS
  repairs the same kind of thing, it names a check the founder's own project could own and offers
  that instead. Tension with DEC-003's *"BOSS does the migration"* — fair once, harmful as a habit.
- [ ] **N12 · Every ecosystem names how its rules get amended, and by whom** (Ostrom: operational /
  collective-choice / constitutional). A founder who disagrees **amends the rule**, not mutes the hook.
  Anatomy item 8.
- [ ] **N13 · BOSS aims to be needed less** (Sanford's test; Meadows: *"restore… the system's own
  ability… then remove yourself"*) — nothing in the repo names this aim; N7 retires skills, not the
  conscience's voice. Ajesh: *"Let Go of Ownership."*
- [ ] **N14 · Flows the founder made count** (Capra) — M2 treats flows outside BOSS's map as
  legitimate, and each ecosystem carries a one-line purpose (*a boundary of meaning*).

**Order, confirmed twice over** (brown's critical connections over critical mass; McKeown's clarity
paradox): **seams before ecosystems** — M2's reader and B1.1–B1.6 before naming any new ecosystem (B4).

**Tensions for Ajesh:** Wheatley says identity must be the stablest part — the research found the
venture's why moves fastest before fit (resolution to test: the *principles* are stable, the why is
not) · Regenesis's *potential, not problem* runs against BOSS's own why (real pain) — it fits inside
the ecosystems, not the venture test · Small and Slow, and the Compass's scoring tool (R9).

**More words not to use:** Alexander's fifteen properties as **checks** (vocabulary for a person
only — the lineage has already been turned into a PageRank score); Kimmerer's Honorable Harvest
wording; *liveliness score*; "five capacities" (Sanford's list is three criteria); McKeown as the
source of *clear yes / clear no* or *less but better* (Sivers; Rams); *adjacent possible* as
Johnson's (Kauffman's). Wheatley's articles are **Wheatley & Kellner-Rogers**; most Regenesis quotes
are **Mang & Reed**.

**B — BOSS's own land (extract, don't invent)**
- [x] **B1** · Inventory the flows that already exist between BOSS's beds, each with a file:line
  receipt — working / broken / declared and never read.
- [ ] **B2** · Write the anatomy from what design (IDEA-091) and engineering (IDEA-136) share; mark
  what differs and why.
- [ ] **B3** · Classify BOSS's own artifacts by pace layer and zone; read the trace for visit
  frequency rather than guessing.
- [ ] **B4** · Name the beds BOSS has and the candidates (claims, data & trust, operations, money,
  team) with their planting triggers.

**B1 findings (2026-10-04, read-only inventory — 44 flows with file:line receipts)**

The pattern: design → engineering flows are mostly **code** (hooks); evidence → conscience/playbook
flows are code; claims, money, trust and ops flows are almost all **skill-step reads or hand-offs**
("point at /trust"). **Every broken flow is a path or succession change that only one end saw** —
the exact class an M2 gives/takes reader would catch. Each below is a task; rule 8 holds —
reproduce in a `/tmp` scaffold before fixing.

- [ ] **B1.1** · 🔴 **COMPONENTS.md → manifest.json handover isn't wired.** At V1 `/design-library`
  replaces `COMPONENTS.md` with a pointer and moves deprecated rows to the manifest
  (`stages/L2-v1/template/.claude/skills/design-library/SKILL.md:220-226`); `component-reuse-guard.js`
  reads only `COMPONENTS.md` (`:58`, `:103-111`) and exits on zero rows (`:172`) — **the reuse and
  deprecated-import checks go silent at V1.** The CLAUDE.md line `/design-tokens-init` writes still
  says "Open COMPONENTS.md" (`design-tokens-init/SKILL.md:334-336`). `src/design.js:1008` already
  knows. M12's failure, live.
- [ ] **B1.2** · Skills that read only `docs/ideas/CANVAS.md` while `/canvas` writes
  `IDEA-NNN-canvas.md` (the IDEA-118 bug, fixed in `src/recap.js:98-101`, still in prose):
  `design-tokens-init:169,175`, `design-review:62`, `agents/designer.md:34`, `mentor-capital.md:165`,
  `sunset:54`, L3 `mentor-hiring.md:51`.
- [ ] **B1.3** · BRAND path drift: `conscience-voicing.md:140` and `celebration-of-done.md:106` say
  `docs/design/BRAND.md`; `src/design.js:554` (`readLogo`) bypasses the `brandPath` resolver.
- [ ] **B1.4** · `/drift-deep` reads FEATs at `docs/specs/` (`:49`); they live in `docs/ideas/`.
- [ ] **B1.5** · `/spec` Step 0 looks in `docs/features/` and `docs/specs/**` (`:15`) — it writes to
  `docs/ideas/`, so it can't find its own output.
- [ ] **B1.6** · `registry/surface-ladder.json` declares outputs the skills don't write (canvas `:43`,
  spec `:55`, health `:210`, onboard `:225`, money `:247`, trust `:261-269`), so `src/ladder.js`'s
  "already built" misses them. **This file is the nearest existing thing to M2's *gives*.**
- [ ] **B1.7** · PROSE-ONLY flows: `/onboard`'s activation metric → `/health` (health never reads
  `docs/onboard/`); `/pretotype` threshold → `/landing --demand`; `/ship` and `/money` privacy →
  `/trust` (hand-off only); schema one-way door → `/decide` (`schema-guard` covers RLS only);
  `trace.jsonl` listed as per-person (`person-state.js:4,40`) but written in-project.

**Absent flows the land assumes** (candidate work, not tasks yet): no claims register (EVID →
landing headline unchecked) · glossary → identifiers (IDEA-136 A7) · `/sunset`'s `POSTMORTEM.md` has
**zero readers** (M7's pollutant, live) · pretotype result → EVID · `/landing --demand` email capture
never triggers `/trust` · `/spec` never reads DECs · `/drift-deep` never reads `docs/evidence/` · `/trust`
never reads the schema (no personal-data inventory) · `coder.md` names no design or engineering
artifact · `check-refs.js` checks links but not that a path a skill **reads** is **written** by
something (M2's reader, unbuilt) · **nothing observes reads** — `trace.jsonl` holds writes only, so
M4 can't be measured from the trace as drafted.

**A — what ships (after B, after the mechanics are cut down)**
- [ ] **A1** · Which mechanics ship, and as what — practice text, frontmatter, a report, a conscience
  moment. No new skill.
- [ ] **A2** · The first guild to plant for a founder (lean: launch).

## Open questions
- **Q1** · ~~Is M2 the same as M10?~~ **Settled at R5:** one mechanism, two link axes — sideways in
  frontmatter (the index), up/down in prose (the language); the reader is what makes either real.
- **Q2** · ~~Name.~~ **Settled by Ajesh 2026-10-04: the ecosystem of ecosystems.** The founder may
  still never need the phrase — they meet the ecosystems, not the word.
- **Q9** · *Liveliness* — what makes an ecosystem alive, and can it be read? Candidates: it is used
  (its outputs are read — M2), it changes (not frozen), it repairs (M11), it sheds what it outgrew
  (M12). Alexander's *life* in *The Nature of Order* is the lineage (book not read). · before M1.
- **Q3** · Does this program graduate to the first `PROG-NNN`? IDS says yes when cross-member
  reasoning exists; this record is that reasoning. · settles when IDEA-136 lands its first slice.
- **Q4** · Which design-system program (`program: design-system`, IDEA-091) records move under the
  land, and which stay their own program? · settles at B4.
- **Q5** · ~~Pace layers vs modes?~~ **Settled at R5:** orthogonal, coupled — modes are a sequence,
  layers a stack; climbing modes is what slows a layer (a Quickstart schema is V1 structure).
- **Q6** · Where M2's reader lives: a new class in `check-refs.js`, `registry/surface-ladder.json`
  corrected and generalised, or `boss map`? · settles before A1.
- **Q8** · Is scaffolding one part of a larger thing — **BOSS lays down a venture's internal
  ecosystems** (and the scaffold is how the first ones get planted)? That touches the one sentence in
  `PRINCIPLES.md` (*"sets a project up with only the structure it has earned"*), which is quoted
  everywhere and changes only by `/decide`. Discipline: **mechanism first, claim second** — the
  sentence moves after M2's reader shows the ecosystems are real in BOSS's own repo, not before.
  · Ajesh's call. **R6 bears on it:** Holmgren widened permaculture from land to seven domains, then
  wrote that the conception was *"so global in its scope that its usefulness is reduced"* and
  re-scoped it to *design principles that provide the organising framework* — *"permaculture is not
  the landscape."* Read for BOSS: BOSS lays down the ecosystems and the principles they live by; what
  grows in them is the founder's. **Ajesh's frame (2026-10-04): an ecosystem of ecosystems inside the
  founder's project, with governance and support for liveliness** — the network scale is out (one-way
  by design). Mechanism first: M2's reader shows the ecosystems are real in BOSS's own repo, then the
  sentence moves.
- **Q7** · Fix B1.1–B1.6 one by one now (each a reproduced bug), or let M2's reader find them first and
  fix what it reports — the reader's own acceptance test?

## Capture log
- **2026-10-04 · Ajesh** — *"I think there is a governing principle for all ladders.. but its like
  different seeds… they each have their own governance, but maybe there is a basic overall architecture
  for scaffolding, and how to scale, and how and when."* → the land / the beds.
- **2026-10-04 · Ajesh** — *"permaculture principles… how do different parts of the land, help share
  ideas, resourcing, regeneration, support, water, wind protection, mulch… growing a farm that has
  several ecosystems that are interlinked, and supportive"* → the relationships layer.
- **2026-10-04 · Ajesh** — *"i love a pattern language, how buildings learn, software gardening… capture
  yes, but its also a program. its pretty big, and we need to think carefully how to build it. continue
  research. and coming up with our own mechanics"* → R1–R5, M1–M14.
- **2026-10-04 · Ajesh** — *"we need all of the permaculture to software connect that applies… did we
  look at permaculture just as a principle for scaffolding or even beyond!?"* → **No — R1 looked at
  scaffolding mechanics only.** Not yet examined: the ethics (earth care, people care, fair share), the
  domains beyond land, the design process, and the network of farms (projects feeding each other).
  → R6. And a reading list of ~35 living-systems thinkers, captured in `docs/mentor-practitioners.md`
  § The land (✓ read at source / ◌ to verify; section kept its first name) → R7.
- **2026-10-04 · Ajesh** — *"Im wondering if the scaffolding is just a part of it.. but its this idea
  that boss helps lay down the internal ecosystems ?"* → **Q8.** A reframe of what BOSS *is*, not
  only of this program — see Q8.
- **2026-10-04** — research landed: 4 outside angles + B1; 13 claims 3-vote verified, 5 killed;
  mechanics cut 14 → 3 + charter (M2 the flow map, M12 succession followed, M11 repair from the
  weakest place, M1 last). B1: 44 flows, 6 broken — one class, a change only one end saw.
- **2026-10-04 · Ajesh** — *"network of projects is not how it needs to connect, its suppose to flow
  one way… inside ones own implementation of boss inside their app it should create an ecosystem of
  ecosystems… its not about the land.. but the ecosystem of ecosystems, and how there is governance and
  support for liveliness, while still living in principles"* → renamed; N1, N2 refused; network scale
  out; Q2 settled; Q9 (liveliness) opened.
