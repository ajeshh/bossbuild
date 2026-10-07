---
id: PROG-005
type: program
owner: product-lead
status: active
created: 2026-10-06
graduated_from: research-engine
gist: Every way BOSS finds out what is true outside its own head — deep research, vetting, refreshes, competitive and market research, intake — rebuilt as one engine: a shared method founders and BOSS both read, per-domain front ends, and sources ranked by what has held up.
---

# PROG-005 — The research engine

**Graduated 2026-10-06**, the same day as its first member. Ajesh: *"this deep research engine can also
apply to competitive eval, market research as well… apply cross functional items but then have
customization where needed. Eventually this can be a program of 'Research Engine'"* — then: *"in a way
we are rethinking everything on how we do research externally… that means also renaming existing
skills and reengineering them. think of it as a major refactor."* The reasoning no single member holds
is the architecture below: what is shared, what each domain keeps, and where it lives.

**Members:** every record with `program: PROG-005` — `boss board PROG-005`. [[IDEA-155]] (the
inventory, ~40 improvements A–H, and the measurement that set the order). Related, not moved:
IDEA-016 (`/vet`), IDEA-042 (humane refresh), IDEA-054 (founder research toolkit), IDEA-066 (market
research — the founder-side trigger still holds), IDEA-086 (the three user-research doors).

## Why a refactor, not a polish

Five surfaces research today, built in five sessions for five reasons — three for BOSS curating itself,
two for a founder — and none was designed as part of a system ([[IDEA-155]] § baseline). The result,
measured 2026-10-06: the same method written five ways, eleven grading scales with no crosswalk,
sources ranked by fame with no date, and a track record that cannot be computed because claims are
not tied to sources in any readable way. Polishing each surface keeps the five copies. The refactor
writes the method **once**.

## The architecture

```
             library/practices/research.md      ← THE ENGINE (tracked, ships, `boss craft research`)
             the loop · the claim row · four axes · standing · page-is-data · what it refuses
                 │                                  library/practices/outside-claims.md ← the judge
     ┌───────────┼──────────────┬───────────────┐   (already shipped, v0.237.0 split of /vet)
  BOSS's own     │           founder-facing     │
  finder ─ judge ─ refresh   rivals · market · intake
  (internal skills,           (shipped skills — thin front ends that cite the engine
   thin front ends)            for the shared steps and keep only their domain's own)
```

**Rules every change carries**

- **The method lives in one tracked file.** A skill restates nothing the engine says; it cites the
  step and adds what is genuinely its domain's. A second copy of "fetch the primary" is a bug.
- **BOSS reads what it ships.** BOSS's own research follows `library/practices/research.md` exactly as
  a founder's would — dogfood, and the reason the engine is not in the gitignored workspace. (The
  internal skills are single-copy and untracked; refactoring them in place is the shape of both
  recorded losses. The method moves to git first; the skills shrink after.)
- **Four axes, never blended:** what kind of source · was it read · did the claim survive · does it fit
  you. A fifth thing — what a *person* did — keeps its own ladder (EVID). No single score.
- **Standing is earned by verification, not fame**, counted forward from claim rows; rank decides where
  to look first, never what to believe.
- **Compose and subtract.** A rename that merges two verbs is the goal; a new verb needs a founder who
  hit the wall (EVID-001). Renames ship with a `registry/supersedes.json` row, so `boss sync` says why.
- **Find ≠ judge ≠ route.** The finder never argues adoption; the judge defaults to NO; routing is
  `/extract`'s. The refactor keeps those seams even where it merges files.

## The skill map — today → proposed

| Today | Kind | Proposed | Why |
|---|---|---|---|
| `/deep-research` | internal finder | **renamed** (name: open Q1) | thin: domain + since + the engine's loop |
| `/vet` | internal judge | `/vet` (kept) | the name works; skeleton gets the claim rows + `sources:` |
| `/practice-refresh` · `/humane-refresh` · `/recalibrate` | internal refresh ×3 | **one `/refresh <domain>`** (open Q2) | the same loop three ways, with different buckets |
| `/comp-eval` | shipped, MVP | **renamed and widened** (open Q3) | rivals is one view of the market; sizing / why-now / pricing join it behind IDEA-066's trigger |
| `/import` | shipped, L0 | `/import` (kept) | intake, not research; cites the engine for source rules |
| `outside-claims` | shipped practice | kept, linked as the judge | already the founder half of `/vet` |
| `/persona` enrich · `/canvas` sharpen | shipped | cite the engine | web research gets a URL and a date (F2) |

## Phases

- [x] **P0 · Inventory and measure** — [[IDEA-155]]: two read passes, ~40 improvements, the
  track-record measurement (not computable; the claim row comes first). Hygiene G1–G2 done.
- [x] **P1 · The engine, written once** (2026-10-06) — `library/practices/research.md`: the loop, the claim row
  (A3), the four axes + crosswalk (A2), standing (B1–B4), page-is-data (A5). Ships as
  `boss craft research`.
- [ ] **P2 · BOSS's own surfaces on the engine** — rename the finder, merge the three refreshes, `/vet`'s
  skeleton (G3–G5 land here), session template = claim rows; source list gains dates and standing
  (B5); a generated research index (C1); ids not paths (C2).
- [ ] **P3 · The founder surfaces on the engine** — rename and widen `/comp-eval`, `/persona` and
  `/canvas` cite it, mentors cite with dates (F1–F3). Supersedes rows for every rename.
- [ ] **P4 · Review the four** — `/deep-research`, `/vet`, `/comp-eval`, `/import` against the built
  engine (IDEA-155 § H), and which market-research items it makes cheap.

## Decided 2026-10-06 — one verb: `/scout <domain>`

Ajesh, answering Q1–Q4: the finder is **`/scout`** (*"find could be taken by others… think about what
may not clash"* — checked: not a host built-in, not in any installed plugin; and the old name now
clashes, since the host ships its own `deep-research` skill). The refreshes merge (*"One /refresh
<domain>"*), and then further: *"shd it be merged… /scout rival xyz brand, same with market. im also
wondering if scout becomes our way finding main skill and then everything else is a sub domain?"* The
research skills get tracked.

**The shape this resolves to (proposed, awaiting go):**

```
/scout <domain> [subject] [--since DATE]      one door for everything OUTWARD
   rivals  <name|space>   ← today's /comp-eval (ships, MVP)      ┐ domains in the shipped skill
   market  size|why-now|pricing                                   ┘
   craft · humane · model ← today's three refreshes (BOSS only)   ← project-local domain files
   <yours>               ← a founder can add one (e.g. regulation)  docs/research/domains/<name>.md
/vet      stays — find ≠ judge
/import   stays — intake, not research
/boss     stays the wayfinding door ("where am I, what next"); /scout is the door for "what's out there"
```

- **Domains are files, not skills.** The shipped `/scout` carries the loop (citing `boss craft
  research`) and two domains; any project can add `docs/research/domains/<name>.md`. BOSS's own
  craft / humane / model domains live there — so BOSS-only curation never ships, and BOSS uses the
  same extension point a founder would. That *is* "customization where needed".
- **Five skills become one**: `/deep-research`, `/practice-refresh`, `/humane-refresh`,
  `/recalibrate` (internal) and `/comp-eval` (shipped). Supersedes rows for each, so `boss sync`
  says what replaced `/comp-eval` and why. `check:freshness` owners → `/scout <domain>`.
- **Not wayfinding.** `/boss` already answers *"where am I"*; making `/scout` that too would put two
  doors on one job (IDEA-086's lesson). `/scout` is the front door for the outside world.

## Decided 2026-10-06 — Ajesh's answers, round 1

- **`/scout` arrives whole at Quickstart** — sorting *and* searching from day one (not split by mode).
- **The inbox verb is `/inbox`** — `/inbox <file>` adds, bare `/inbox` shows what isn't processed.
- **Order: `/scout` first, hiding later** (the hide-by-default fix folds into the inbox work).
- **Defaults approved:** `/vet` stays the separate judge · founders can add their own `/scout`
  domains as files · processed is a view, files never move · **BOSS dogfoods it** — its own
  `docs/research/inbox/` runs on the same mechanism (*"like dogfood ourselves, if so then yes"*).

## Decided 2026-10-06 — round 2

- **`/scout market` ships now, with `rivals`.** Ajesh's call overrides IDEA-066's founder trigger
  (noted there).
- **Legal / HR material at Quickstart: kept locally, labelled, waits** — offered to its home when the
  mode that has one unlocks.
- **Naming: new and renamed verbs are BOSS-specific now; the generic existing ones get a clash
  audit later** — saved as PROG-004 B9 (*"save a new todo for later so we dont forget"*).
- **Team sharing: explore all three, then decide** — a team-only drive folder, a private docs repo,
  an internal MCP doc server. Task below.

## How wide `/scout` goes — the research most companies do (draft, 2026-10-06)

Ajesh: *"have we thought of everything scout can be, its not just rivals or market, its also product
research, or api documentation, or other technical research. needs to be wide."*

| Family | Kinds | Verified by | Ages in | Lands (founder) |
|---|---|---|---|---|
| **Market** | rivals · size and segments · pricing / WTP · why-now · channels · partners and ecosystem · investors in the space | open the primary page; bottom-up arithmetic | weeks (prices) – years (size) | competition table, canvas cells |
| **Customer (desk)** | what people say in public — reviews, forums, communities, complaints | quotes with links; never graded as EVID | months | persona (synthetic side), problem cell |
| **Product** | how others solved a flow · UX and design references · feature benchmarks | look at the thing itself | months | design / spec |
| **Technical** | API and SDK docs · build-vs-buy and tool choice · feasibility and prior art · security advisories for what you depend on · standards | **run it** — a probe or a test beats a doc | days – weeks | spec, architecture, a decision |
| **Legal and risk** | regulation and compliance · name / trademark / domain availability · platform terms you depend on | the authoritative text; never legal advice | months | trust, decisions |
| **People** | experts and advisors (standing, emerging voices) · hiring market, roles, pay | track record from claim rows | months | team, sources list |
| **BOSS only** | craft · humane · model | three skeptics | per curve | the library |

### Architectural questions this raises

- **A · Not every kind earns a domain file.** `/scout <question>` with no domain runs the general loop;
  a domain earns a file only when it adds something real (an order of sources, a way to verify, a
  landing place, a clock). Lean: ship families as domains, kinds as arguments.
- **B · Verification is not one method.** Three skeptics suit claims; technical claims are settled by
  running code; a price by opening the page; law by its text. The engine's step 5 must say *try to
  kill it the way this kind can die*.
- **C · "Research stays local" vs technical research.** API notes and build-vs-buy findings are about
  no person, and the coder agent, a teammate and a fresh worktree all need them in the repo. Lean:
  hide by **sensitivity** (people, confidential, rival intel), not by being research.
- **D · Compose the host, don't rebuild it.** The host already searches, has research skills, and
  can reach docs servers for APIs. `/scout` brings the method and the landing places; the fetching is
  the host's.
- **E · Depth.** A quick look (a price, one doc) vs a full pass (fan-out + skeptics). One flag, the
  loop sized to the stakes.
- **F · Does `/scout` ever speak first?** E.g. the conscience noticing an unsourced number in the
  canvas and offering `/scout`. PRINCIPLES: say one thing when drifting, quiet otherwise.

### Decided 2026-10-06 — round 3 (Ajesh)

- **C → hide by sensitivity.** People, confidential material and rival intel stay local; research about
  no one commits. T3 narrowed the same day before anything was stamped: `docs/research/` is NOT
  ignored; `docs/evidence/`, `docs/source/`, `docs/competition/` are. The engine says so
  (*Where it lives*).
- **A → families as domains, kinds as arguments.** `market · customer · product · technical · legal ·
  people` (+ BOSS's `craft · humane · model`); `/scout <question>` alone runs the general loop.
- **B → verify the way that kind can die.** Engine step 5 rewritten: skeptics for claims, run it for
  technical, open the page for a price, the authoritative text for law.
- **F → speaks first only through the conscience, once** — e.g. an unsourced number in the canvas
  gets one line offering `/scout`. (A conscience moment; designed in T1, built after.)
- D (compose the host) and E (a quick vs full depth flag) stand as written — no objection raised.

### Domains are open, not a starter pack (Ajesh, 2026-10-06)

*"the templates are for various types of research, but a user can add more, also we should be able to
add more templates in, so that way whichever the end user wants they can use. and not restricted by the
starter pack?"* The mechanism (proposed, part of T1):

- **Two shelves, one lookup.** BOSS's domains ship in the skill (`.claude/skills/scout/domains/`) and
  arrive or update through `boss sync` like any skill file. The founder's own live in
  `docs/research/domains/` — sync never touches that folder. `/scout` reads both; **a founder's file
  with the same name wins**, so a shipped domain can be replaced without being edited.
- **Editing a shipped one is safe too.** Sync's provenance already protects an edited file — it is
  reported, never overwritten.
- **Adding one is a sentence.** `/scout` asked for a kind it has no domain for offers to write one from
  a blank domain template (what to open first, how to verify, where it lands, how fast it ages) — every
  domain has the same five fields, which is also what makes them comparable.
- **BOSS grows the shelf over time** — a new domain is a new file in the skill and a CHANGELOG line;
  nothing about the verb changes.
- Open: a founder's domains across their own projects (copy, or a personal shelf in `~/.boss/`)?
  Not now — note it, wait for someone with two projects to want it.

### Tasks this program now owns

- [ ] **T1 · `/scout`**
  - [x] **T1a · the shipped half** (2026-10-06) — `/scout` at Quickstart: the core (two shelves,
    quick vs `--deep`, sort, sensitivity, desk research never `EVID`), six domains (`market` carries
    `/comp-eval` whole, plus size · why-now · pricing · channels; `customer`, `product`, `technical`,
    `legal`, `people`) and `_template.md`. `/comp-eval` retired with a supersedes row; ladder,
    freshness, playbook, places, help, GUIDE and web repointed. Upgrade walked end to end: an MVP
    project made by the old BOSS syncs to `/scout` and is told why.
  - [x] **T1b · BOSS's own half** (2026-10-06) — `craft`, `humane`, `model` are domain files in
    BOSS's `docs/research/domains/`, now tracked (`!docs/research/domains/`): BOSS uses the founder's
    shelf. `/deep-research`, `/practice-refresh`, `/humane-refresh`, `/recalibrate` are redirects to
    `/scout` (kept until this lands, so a peer calling one is pointed somewhere), with their full text
    kept locally at `docs/research/retired-skills/2026-10-06/`. Boundary rows, `check:freshness`
    owners, the two watchlists' headers and diagrams, `/vet`'s skeleton (G3–G5) updated.
    - [ ] **Remove the four redirects** once this has landed and BOSS has synced `/scout` into its own
      `.claude/skills/` (the boundary rows go with them).
    - [ ] **Tracking `/vet`** — `/.claude/` is ignored as a whole directory, so tracking one skill means
      restructuring the pattern, and `scripts/worktree.js` derives its links from `.gitignore`. Its own
      small change, tested against worktree creation; not folded in here.
  - [ ] **T1c · the conscience line** — an unsourced number in the canvas gets one line offering
    `/scout` (round 3, F).
- [ ] **T2 · `/inbox`** — `/import` renamed; local-only; the view (new / sorted / reference); hands to
  `/scout` in the same turn; records the original's location; BOSS's own inbox on it.
- [x] **T3 · Hide by default** (2026-10-06, done first at Ajesh's call) — the founder template ignores
  `docs/evidence/`, `docs/source/`, `docs/competition/` (narrowed from four, round 3); `boss sync` adds rules a
  later BOSS ships, only ones never offered before (`.boss/ignore-offered.json`), and names folders
  already committed with the `git rm -r --cached` line. `test/gitignore-sync.test.js` (3 of 4 fail on
  the old code; the fourth guards the new behaviour). `docs/inbox/` joins when T2 creates it.
  - [ ] **Found:** `/persona` copies one line a real person said from an EVID into
    `docs/personas/` (`quote:`), which still commits. Cite the EVID id only, or keep the quote local.
- [ ] **T4 · Team sharing, compared** — the three options written up against BOSS's refusals (no
  server so far, IDEA-037) before any choice.
- [ ] **T5 · The sort's sensitivity rule** — resumes, HR, contracts land only in local places; unsure →
  ask, default local.

## Open questions (Q1–Q4 answered above; kept for the reasoning)
- **Q5 · Does `/import` fold into `/scout`?** Ajesh 2026-10-06: *"scout is our intake of research,
  materials from outside… it can id if its research or something else."* **Pushed back — keep two
  verbs, share the routing:**
  - **Different direction.** `/import` brings in what you *already have* (your notes, your PRD — the
    founder's own material, IDEA-023); `/scout` goes out for what you *don't*. "Scout my notes.docx"
    names the wrong act, and the founder who most needs `/import` is the one who can't guess past a
    wrong name.
  - **Different rung.** `/import` is day one (L0) — it fixed *"empty… im stuck"*. `/scout` is MVP. One
    verb either drags a research loop into Quickstart or pushes the on-ramp out of it (PRINCIPLE #2).
  - **Distinguishable by input**, which is IDEA-101's test for keeping two doors: a path or paste you
    hold vs a question you can't answer yet. `/research` merged into `/evidence` because its input
    *wasn't* distinguishable.
  - **What survives of the idea:** each door recognises the other's input in one line and hands it
    over (IDEA-086's routing line) — a URL to a rival handed to `/import` → `/scout rivals`; a doc
    handed to `/scout` → filed through `/import`'s snapshot. Both cite the engine's source rules, so
    an imported source and a scouted one carry the same row. Awaiting Ajesh.
  - **Refined, in discussion (not built):** Ajesh — *"inbox import, so the inbox function is seperate,
    but the organizing and bringing it in to the right places should be scout."* Split by function:
    the inbox **receives** (dated snapshot, no judgment); `/scout` **sorts** (what kind is this, claim
    rows, file it where it belongs) for material handed in and material it went and found. Conditions
    raised: one gesture for the founder; the founder's own idea material still lands at L0; "processed"
    is a stamp, not a folder move (41 of 43 BOSS inbox items were never moved). Open: mode placement,
    the kinds the sort recognises.
  - **Agreed 2026-10-06:** the picture (inbox receives → `/scout` sorts → lands), `/import` then
    `/scout` in one gesture, "processed" is key. Ajesh: *"reorganizing it so it doesnt stay in inbox,
    or the inbox has its own sorting mechanism so that its easy to spot what is not yet processed"*;
    more kinds — **legal / regulatory, HR, team resumes**, other content; *"the inbox needs to grow into
    its own program or feature… and it needs to work with scout."* → **new scope: an intake program**,
    likely graduating from IDEA-111 / FEAT-035 (the three intake doors, shipped). 🔴 Resumes and
    contracts are other people's personal or confidential data — the inbox needs a sensitivity rule
    before it accepts them. Still talking; nothing built.
  - **Naming, Ajesh 2026-10-06:** *"I like import, but im thinking of helping users slightly learn boss
    specific terms like scout. so that it doesnt clash with another program."* The inbox verb may get a
    BOSS-specific name. Evidence for the rule: the host now ships its own `deep-research`, colliding with
    BOSS's — generic names get taken over time. A naming rule for every BOSS verb is PROG-004's (the
    front door) to own; candidates for the inbox verb under discussion.
  - **Decided, Ajesh 2026-10-06 — the inbox never leaves the machine.** *"we should know if its hr or
    resume then to auto gitignore… maybe the docs inbox is never git submitted. it stays locally."*
    Kinds agreed: legal / regulatory, HR / resumes. Consequences to design for: the risk point moves
    from the inbox to **the sort** (what `/scout` copies out into tracked records — sensitive kinds land
    only in ignored places, and when unsure, it asks and defaults to local); a local-only folder is a
    single copy (keep the original's location, so a lost copy is recoverable — BOSS's own two losses
    were single-copy gitignored files); existing projects may have already committed `docs/source/`,
    and a sync can add the ignore line but cannot un-commit history — say so, don't imply it.
  - 🔴 **Found while checking (2026-10-06), not yet acted on:** the founder template's `.gitignore`
    (`stages/L0-quickstart/template/.gitignore`) ignores `.boss/` logs and generated pages but **not
    `docs/source/`** (every `/import`) **nor `docs/evidence/`** (real people's words, verbatim). Neither
    skill says whether committing them is intended. BOSS ignores its own `evidence/` "for someone
    else's sake"; founders get the opposite default with no decision on record. Possibly deliberate
    (a cofounder needs the evidence — IDEA-037), possibly not. Needs Ajesh's call; may be worth fixing
    ahead of this program.
    **Decided, Ajesh 2026-10-06:** *"we should not commit research to git. it needs to get hidden.
    founder's interviews should be hidden."* → research, the inbox and `docs/evidence/` are local by
    default in a founder's project. **New open scope — team sharing:** *"If trying to share between team
    mates, then we should have some approach for having a doc repo mcp that is just internally accessed
    or someway to do file share. lets think about it."* Not git. To be explored (IDEA-037 is the team
    record; DEC-001 says per-person state never travels — evidence is venture state, so it may).

- **Q1 · The finder's name.** `/research` is taken in the supersedes ledger (retired into `/evidence`,
  v0.324.0) — reusing it would tell a syncing founder two different things.
- **Q2 · One `/refresh <domain>`, or keep three?** One file with domain sections vs three thin skills
  over the engine.
- **Q3 · `/comp-eval`'s new name and scope** — widen to the market now (rivals as the first view) or
  rename only, and widen when IDEA-066's trigger fires?
- **Q4 · Tracking the internal skills.** `/.claude/` is gitignored wholesale. With the method in
  `library/`, what is left in each skill is thin — track it (`!/.claude/skills/<name>/`, passes the
  *"fine public forever?"* test) or keep it local?
