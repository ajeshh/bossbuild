---
id: IDEA-136
type: idea
kind: capability
owner: mentor-architect
program: the-land
status: exploring (B first — BOSS's own code — then A, what ships)
proof: docs/ENGINEERING.md
gist: Code gets the same ladder the design system has — principles a reasonable person could argue with, a map of what exists to check reuse against, rules an agent can act on, checks at the write, and a way to retire them — extracted from BOSS's own src/ before it ships to a founder.
created: 2026-10-04
---

# The engineering system — the design system's ladder, for code

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** BOSS ships a design system that scales — principles → guidelines → rules, a seed that
  scales, an index the agent opens before making component two, guards at the write, a drift reader
  at V1, and a way to retire a rule. **Code has the knowledge and almost none of the ladder.** A
  founder's agent can grow the app with no principles to argue from, no map of what already exists,
  and reuse checked only for UI components. This idea gives code the same shape: engineering
  principles, naming, scoping, modules, reuse and testing, held the way the design system holds style.
- **Who it's for:** the founder doing agentic work, and above all **the agent building the next
  module** — the reader that re-derives the codebase every session and cannot ask.
- **Altitude (Ajesh, 2026-10-04):** what BOSS **ships to a founder**. Order: **B then A** — write
  BOSS's own engineering principles from what `src/` actually does, then extract the shape UP. That is
  how MVP mode was built, and it gives the founder version a real example instead of an invented one.
- **Where it gets captured:** BOSS's own principles in a tracked `docs/ENGINEERING.md` (B6); the
  founder-facing system as a practice in `library/practices/` (A1), which the site's existing
  *Engineering* page renders by generation — see A15.
- **Mandate:** compose and subtract, never add a skill. Keeping BOSS current with the craft of
  building with agents is its own warrant (no founder evidence needed); a new *gate* still needs a bug
  that reached a user.

## Scope — the same ladder, one row per layer (Ajesh, 2026-10-04: *"expand this to database and other stuff as well"*)

Not a second system per layer: **one shape, applied layer by layer**, and the seed-that-scales test
decides which layers a founder meets at seed and which wait. Each row gets the same parts — a
principle, the seed decisions, what goes in the map, a rule an agent can act on, a check if one is
earned, and how it retires.

| Layer | When it arrives (rung / trigger) | What BOSS already holds | Gap |
|---|---|---|---|
| **Code** (modules, naming, reuse, boundaries) | first real build | `scalable-architecture`, `ui-boundary-guard`, `component-reuse-guard` (UI only) | the ladder, the map, reuse for code — the rest of this record |
| **Testing** | first shipped FEAT | `testing-with-agents`, `/smoke`, `smoke-guard`, `verification-loop`, `/evals` | conventions in the repo (A8) |
| **Data / database** | the first table — one-way door | `data-schema` (RLS, migrations, reviewing agent schema), `schema-guard`, `/red-team --paths` | the data half of the map (tables, who owns each, which module may write it); naming one word per concept across schema and code (A7) |
| **API / contracts** | a second consumer (mobile, a partner, a public API) | nothing | candidate row — contract-first, versioning; deferred until a second consumer |
| **Config & secrets** | first deploy | `secrets-guard`, `ship-it-live`, `agent-security` | one place for config — probably a seed row, not a practice |
| **Errors & observability** | first real user | `analytics-for-ai-products` (product events only) | **nothing on error handling or logs** — candidate row; `/ship` "who hears when it's down" is the nearest |
| **Dependencies** | first package added | scattered mentions | candidate row — add a dependency like a decision (agents add packages freely; supply chain) |
| **AI calls** (prompts, models, evals) | first LLM call in the product | `model-routing`, `ai-failure-states`, `/evals`, `/ai-cost` | prompts as versioned code — candidate row |
| **Infra / performance / jobs** | V1→Scale, symptom-gated | `seed-to-scale`, `feature-flags`, `retrieval` | none needed yet — premature at MVP |

**B-then-A only reaches some rows.** BOSS has no database, no API, no LLM call in its own code, so
those rows can't be extracted from BOSS's practice. BOSS's *data layer* is JSON and frontmatter
(`.boss/`, `registry/`, record files) with atomic writes and `check:backlog` as its schema check —
a real analogue for the data row's principles, not for SQL. The rows BOSS can't demonstrate come
from R1 research and an outside reference app, and say so.

## What exists today (read 2026-10-04, before proposing anything)

| Design-system layer | Design side (ships) | Engineering side (ships) |
|---|---|---|
| Principle → guideline → rule ladder | `design-system.md` § Authoring your design principles; founder writes them into `STYLE_GUIDE.md` (template) | **none** — no ladder, no template |
| Seed that scales (decide early only what gets dearer to reverse) | `design-system.md` § seed-that-scales table | partial — `scalable-architecture.md` (modular monolith, schema is the one-way door), `/smoke` first run plants formatter + strict types |
| An index to check reuse against | `COMPONENTS.md` → V1 `manifest.json` | **none** — `.claude/rules/your-app-code.md` is two "(example)" lines |
| Planting moment | `/design-tokens-init`, opened by `design-tokens-loop` | none — `coder.md` says "specialize this file" when the stack is picked; nothing checks |
| Guards at the write | tokens, component-reuse, contrast, design-decisions, ui-boundary | `ui-boundary-guard` (**only** when a `ui/` + `features/` layout exists — and only `/design-tokens-init` plants that, so a CLI/API/agent founder never gets boundaries), `schema-guard`, `smoke-guard` |
| Reuse / adjust / new | `component-reuse-guard` — UI components only | **none for code** — a helper written three times is invisible |
| Naming | tokens named by purpose (DTCG); one word per concept (`content-terminology-guard`, copy only) | none — the glossary never reaches identifiers |
| Testing | — | `testing-with-agents.md` (strong); in the repo: `/smoke`, `verification-loop` (is *anything* checking), `tester`, `/evals`, `/red-team --paths`. **No test conventions in the repo.** |
| Drift reader | `design-drift-loop`, `/design-library` | none |
| Retirement / demotion | deprecated tables; three exceptions → the rule is wrong | none |

**BOSS's own `src/` already keeps conventions it never wrote down in one place** (the B material):
every gate's header names the bug that reached a user (`scripts/check-boundary.js`); deliberate
duplicates across a ship boundary are pinned by a parity test (`test/yaml-parity.test.js` — hook YAML
reader vs CLI frontmatter reader); writes are atomic with a lock (`src/atomic.js`); zero dependencies;
reproduce before you fix; `test:ci` tests the staged tree. A scan of top-level function names across
42 modules found one duplicate name (`section`, in `design.js` and `playbook.js`) — not yet read.

## B1 findings (2026-10-04) — the inventory is a working draft, gitignored beside the research

`docs/research/sessions/B1-2026-10-04-boss-engineering-inventory.md` — every claim carries a file:line
receipt or a grep count. Held **in every instance checked**: zero-dep (492/492 imports `node:`); a WHY
header on 38/42 modules, 61/62 tests, 14/16 gates; `src/` never calls `process.exit()` (only `bin/boss`);
all 13 shipped hooks exit 0; error policy in the name (`readConfig` forgives, `readConfigForWrite`
throws); `render*` pure, `print*` writes (16/16); the hook lib sits *below* `src/`; 61 tests labelled
`REGRESSION:`, driving the contract a person touches.

**Candidate principles (inputs to B2, not decisions):** fewer moving parts over convenience · a
mechanism over a remembered rule, where a bug reached a user · one home per fact, and pin the copies a
boundary forces · honest output over confident (forgive on read, refuse on write, never guess) · built
for concurrent writers · the reason in the code · test the contract a person touches · (weaker) pure
projection over stored state.

**Found while building — each a task; reproduce before fixing (rule 8). Ids `F`, cited `IDEA-136 · F2`.**
- [ ] **F1** · `board ↔ playbook ↔ design` is a three-way import cycle, against the rule `args.js:3-5`
  states (verified 2026-10-04). Exception with a reason, or a small records-text leaf module — which
  would also take most of F3.
- [ ] **F2** · Boundary copies drift: 1 of 6 is pinned by a parity test. `NOT_A_COMPONENT` already
  differs — `src/design.js:704` excludes `*Page/*Route/*Layout`, `component-reuse-guard.js:64` does not
  (verified). Founder-facing: the guard can ask about a file `boss design` would never list.
- [ ] **F3** · Same-job duplicates in `src/`: the markdown section slicer (×4: design, playbook,
  changelog, recap — playbook's interpolates a string into a regex unescaped); title-from-H1 (~13, each
  strips the id differently); the project stamp read 3 ways, `installedLayers || [stamp.stage]` retyped
  7×, `insights.js:84` answers differently.
- [ ] **F4** · Script copies of `src/` helpers: `esc` (gen-site's turns `0` into `''`), ANSI colours
  ignoring NO_COLOR, `cmpVersion`, a day formatter, three timed HTTP `get`s, a byte-identical placeholder
  cleaner.
- [ ] **F5** · ~10 bare-regex frontmatter reads; `check-backlog.js:106` would read a folded `proof: >` as
  `">"` — latent (no shipped record folds `proof:` today).
- [ ] **F6** · Hooks are "self-contained" by claim: 1 of 13 is run from a scaffolded copy; the 9 L1
  hooks are tested in place, where an import from `src/` would still resolve.
- [ ] **F7** · Local-day stamps held in `src/`, broken in 4 scripts; `check-freshness.js:219` and
  `helpers.daysAgo` default to UTC (not reproduced).
- [ ] **F8** · `demo.test.js:86-88` writes the working tree; tests isolated only through `HOME` inherit an
  exported `BOSS_HOME` (not reproduced).
- [ ] **F9** · Written-only rules with no runner: CHANGELOG bullet per capability; CHANGELOG shows no
  research; `kind: capability` has no reader; reproduce-before-fix and gates-name-their-bug held by habit;
  zero-dep enforced only because CI has no install step. Not all need a gate — B3 asks which do.
- [ ] **F10** · Four core modules (`cli`, `paths`, `scaffold`, `sync`) have no WHY header.
- [ ] **F11** · 🔴 **A misattribution, live on the site.** *"Documented conventions rot; enforced
  conventions compound"* is shipped in quotation marks as Factory.ai's — `scalable-architecture.md`
  (spine + both provenance fields), `library/sources.json` (`factory-ai.for`, so the Credits page
  credits them with it), `smoke-guard.js:9`, `smoke/SKILL.md:63`, two CHANGELOG entries, and the
  generated `site/engineering.html` + `site/credits.html`. R2 downloaded the source the research
  compendium cites and Factory's two nearest pages: the words are not there (killed 3-0). It is BOSS's
  own compression. Repair: keep the line as BOSS's, unquoted, and credit Factory for the sentence they
  did write (lint-enforced guidelines). Correctness — the freeze allows it; regenerating and deploying
  stay Ajesh's. Old CHANGELOG entries are history: correct forward, don't rewrite.

## R1 findings (2026-10-04) — the research session is gitignored beside the inventory

`docs/research/sessions/SESSION-2026-10-04-engineering-system.md`: six angles, 52 sources read in
full, 15 load-bearing claims put to three adversarial verifiers — 12 survived (most with caveats),
3 killed. **Inputs, not decisions.**

- **Principles with lineage:** hide the decision most likely to change, one per module (Parnas, 1972 —
  the seed-that-scales test, pointed at modules); deep modules over shallow, and over-decomposition is
  its own failure (Ousterhout); fewest elements (Beck's rules of simple design).
- **Two tensions with what BOSS ships — to settle at A1, not paper over:**
  1. *Widen vs inline.* `design-system.md`'s reuse table says *widen the one that exists*; Metz says
     duplication is cheaper than the wrong abstraction, and the tell is **a new parameter plus a
     conditional** in shared code — the fix is to inline back. Code may need a fifth row the UI table lacks.
  2. *Two vs three.* The design side promotes at two (*twice is a pattern*); the code field abstracts
     at three (rule of three — Don Roberts, popularised by Fowler). Possibly both right: a design
     decision recurring twice is cheap to name; a code abstraction is expensive to undo.
- **Boundaries:** layers by responsibility, imports point down, no sibling imports within a layer —
  stack-neutral; already held for UI only (A6). Counter-evidence kept: a boundary tool enforces a
  *wrong* map faithfully; push enforcement only where the map is right.
- **Testing:** of four kinds of change, only a *behaviour* change edits an existing test; a bug fix
  *adds* one (Google SWE book, ch. 12); never mix structural and behavioural change in one commit
  (Beck). Agents edit tests to pass, and read-only tests remove that move (a 2025 benchmark — measured
  on deliberately impossible tasks). Mutation testing over coverage. → A8, A9.
- **Enforcement:** guides steer before, sensors check after; the fix goes *in* the failure message;
  dependency rules beat prose for holding structure; asking an agent in a context file to run checks
  was unreliable; a sensor that never fires is a removal candidate (Böckeler, 2026 — one practitioner,
  one app). Rules only cost what must be *remembered* — automated ones are free (Google SWE book, ch. 8).
- **Killed:** the Factory.ai quote (F11); every *"AI causes N× more clones"* figure (one vendor, four
  incompatible numbers — only the direction survives); *atomic design's five levels transfer to code*
  (the method transfers, the levels don't — size-layering gives business logic no home).
- **Dated, not wrong:** Shopify's 2.8M lines is a 2020 figure and needs its year in the practice.

## Work — every item has an id; cite as `IDEA-136 · B3`

**R — bring the research in (first; feeds both tracks)**
- [x] **R1** · Read at source the "atomic design for code" lineage and senior-engineering thinking
  (module design, boundaries, naming, abstraction thresholds, testing, agent-era conventions). Cited
  session record in `docs/research/sessions/` (gitignored — outside sources never named in tracked
  text); person and standard citations may travel into the practice.
- [x] **R2** · Verify every attribution that makes it into tracked text (the memory note: claims bend
  on who said it). Killed claims recorded beside confirmed ones.
- [ ] **R3** · Research the layers BOSS can't demonstrate (data, API, errors/observability,
  dependencies, prompts-as-code) — a second pass once R1 lands, so R1 stays focused.

**B — BOSS's own code (extract from practice, don't invent)**
- [x] **B1** · Inventory the conventions `src/`, `scripts/`, `test/` and the hooks actually keep, each
  with a file:line receipt. Include the deliberate exceptions (parity duplicates) — an exception with a
  reason is a convention too.
- [ ] **B2** · Sort each into principle / guideline / rule. Test: could a reasonable person argue the
  opposite? Three to five principles, no more.
- [x] **B3** · Mark every rule *enforced (by which check or test)* or *written only*. The written-only
  list is the rot list (the checkers-state-intents heuristic).
- [x] **B4** · BOSS's code map — what each of the 42 modules owns, and the shared helpers an agent must
  find before writing one (`atomic`, `frontmatter`, `paths`, `clock`, `args`, `records`, …).
- [x] **B5** · BOSS's testing conventions as practised: regression test named for the bug, reproduce
  first, `test:ci` vs `check`, the staged-tree hook, gates name their bug.
- [ ] **B6** · Write it as BOSS's engineering document (tracked; renderable later) and move the code
  rules out of CLAUDE.md into it, leaving a pointer — CLAUDE.md is past the length where it gets read.
- [x] **B7** · Read the one duplicate (`section`) and anything B1 turns up: real reuse miss, or a
  name collision with two jobs?
- [ ] **B8** · `/extract` the result: what routes UP (the shape) and what stays BOSS-only. EXTR record.

**A — what ships to a founder (after B8)**
- [ ] **A1** · The practice: engineering principles ladder, a seed-that-scales table for code, reuse /
  adjust / new for code, promotion and demotion thresholds, leverage-or-own for linters. Extend
  `scalable-architecture.md` rather than add a practice, unless R1 shows it is a different subject.
- [ ] **A2** · The founder's seed: fill `.claude/rules/your-app-code.md` (ships at Quickstart, loads
  only when code is open) — principles slot, module map slot, testing slot. **Floors pre-filled,
  values blank until earned** (`design-system.md` § Craft floors).
- [ ] **A3** · The planting moment — where the seed gets filled in, with no new skill (see Q3).
- [ ] **A4** · The code map at MVP: authored, read before creating a module or helper; carries the
  negative-finding rule (an agent's "nothing like this exists" is a claim about its searches — synonym
  pass first, `testing-with-agents.md`).
- [ ] **A5** · Reuse for code: widen `component-reuse-guard` (or a mode of it) to check a new
  module/helper name against the map. Advisory, once per new name.
- [ ] **A6** · Boundaries for every surface: `ui-boundary-guard` reads its layers from the map, not only
  from `ui/` + `features/`, so a CLI, API or agent gets one-way imports too.
- [ ] **A7** · One word per concept, in code: the copy glossary also names identifiers.
- [ ] **A8** · Testing guidelines that ship: tests from acceptance criteria before code; a negative test
  for each of the three must-not-break paths; reproduce before fix; a regression test named for its
  bug; never weaken an assertion to pass; model output goes to `/evals`, not `assert`.
- [ ] **A9** · Candidate: an assertion-weakening guard (test assertion loosened in the turn that changed
  the source). Only with a named incident (Q4).
- [ ] **A10** · Step 0 for brownfield and experienced founders: read the lint config, CONTRIBUTING,
  AGENTS.md first; offer, don't seed over. Cohort-aware like `/design-tokens-init`.
- [ ] **A11** · Retirement for code: deprecate with a successor, delete the unused, three exceptions
  means the rule is wrong.
- [ ] **A12** · Wire the agents: `coder.md` and `tester.md` point at the seed; `mentor-architect` owns it.
- [ ] **A13** · V1 drift reader (generated code map + duplicate finder, the `/design-library` twin) —
  **deferred**; re-open when a project's authored map is seen going stale.
- [ ] **A14** · Kettlewick demo record if a new record type appears (standing rule); CHANGELOG bullet
  in product terms only.
- [ ] **A15** · On the site: **the Engineering page already exists** (`site/engineering.html`), generated
  from `library/practices/*.md` and grouped by `ENG_GROUPS` in `scripts/gen-site.js` — which fails if
  a practice is in no group. So capturing A1 as a practice puts it on the page at the next regenerate:
  one row in `ENG_GROUPS` and a `provenance_public:` line, no new page, nothing the freeze forbids.
  Regenerating and deploying stay Ajesh's.

## Open questions
- **Q1** · One ladder per discipline, or one *system* shape with design and engineering as two
  instances of it? (Lean: one shape, two files — the thresholds table in `design-system.md` already
  generalizes.) · settles at A1.
- **Q2** · Where the founder's engineering principles live: grow the JIT rule file (agents consume
  rules) or a `docs/` document beside `STYLE_GUIDE.md` (people read principles) — or principles in the
  doc, rules in the rule file? · settles at A2.
- **Q3** · The planting moment: the stack `/decide`, the coder's specialize step, or `/smoke`'s first
  run (which already plants formatter + strict types)? · settles at A3.
- **Q4** · Does an assertion guard clear the bar — a bug that reached a user — or stay a rule? · A9.
- **Q5** · Rung: does the seed belong at Quickstart (where `your-app-code.md` already ships) or MVP?
- **Q7** · Which layer rows ship in the first slice? Lean: code + testing + data (the three a founder
  meets before anything is live); API, errors, dependencies, AI calls as candidate rows with triggers;
  infra deferred. · settles after B8.
- **Q6** · Naming conventions: own or leverage? Lean: leverage the stack's linter for casing and style
  (stack-bound), own only what is stack-neutral — domain vocabulary, names say purpose, one job per name.

## Capture log
- **2026-10-04 · Ajesh** — *"like we have the design system that scales, im wondering if we need more
  architectural direction for the code and how engineering follows the best practices for reusing code,
  naming convention, scoping, components… engineering principles like we have for design system. Also
  for testing… dont start building. lets think this thru, see what we have and then grow it."* → read
  what exists (table above).
- **2026-10-04 · Ajesh** — altitude: *"what boss ships to the founder, for their agentic work"*; B then
  A; *"ID all the work"*; capture as an idea.
- **2026-10-04 · Ajesh** — *"lets build it, where we capture it, so that we can put it on our website
  under engineering if needed"*; bring in existing practice and research — atomic design for code, and
  senior engineering thinking → R1/R2.
