---
id: IDEA-136
type: idea
kind: capability
owner: mentor-architect
program: ecosystem-of-ecosystems
status: building (B — BOSS's own engineering — written; A — what ships to founders — open)
proof: docs/ENGINEERING.md
proof_note: docs/ENGINEERING.md is the B track (BOSS's own code). The record is done when the A track ships to founders — the practice (A1) and the seed in the founder's template (A2) — so the proof moves there then.
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
- **Order (Ajesh, 2026-10-04):** *"wait for idea-137… we will first build that before building this,
  as it will create more guidance for how to build this."* [[IDEA-137]] — the ecosystem of ecosystems
  (principles every discipline lives by, each governing itself, the support between them) — is built
  first; this record is one of its ecosystems and takes its shape from it. Until then: **investigate,
  don't build.** No B2/B6/A-track writing before IDEA-137 lands.
- **Hold lifted (Ajesh, 2026-10-04): *"lift hold"*.** IDEA-137 produced what this waited for — build
  engineering **as the first ecosystem planted from [`docs/ECOSYSTEMS.md`](../ECOSYSTEMS.md)** (a draft;
  this record is its second real instance, after design):
  1. **Fill the engineering column** of the eight-part anatomy (principles → guidelines → rules · seed ·
     map · planting moment · checks at the write · drift reader · retirement · amendment) — and leave a
     part empty rather than invent it.
  2. **Name its centre** and what it's planted with (§ *Building a new ecosystem*).
  3. **Declare its flows** in `registry/flows.json` as they're built — gives, takes, the giver's write
     and the reader's read must name the same path; `npm run check:refs` (class 7) holds them. No
     backfill sweep: each ecosystem declares its own.
  4. **Where engineering disagrees with the draft, write it down** — IDEA-137 · C7 finalises the guide
     from the overlaps between design and engineering, not before.
  5. Live by DEC-022 (the second repair offers a check) and DEC-023 (BOSS can always be needed less).
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
- [x] **F1** · `board ↔ playbook ↔ design` is a three-way import cycle, against the rule `args.js:3-5`
  states (verified 2026-10-04). Exception with a reason, or a small records-text leaf module — which
  would also take most of F3.
  **Done (40cc037, 73ba0f2):** a stated exception — every edge annotated with its condition and its exit. Breaking the cycle waits for a bug (principle 4).
- [x] **F2** · Boundary copies drift: 1 of 6 is pinned by a parity test. `NOT_A_COMPONENT` already
  differs — `src/design.js:704` excludes `*Page/*Route/*Layout`, `component-reuse-guard.js:64` does not
  (verified). Founder-facing: the guard can ask about a file `boss design` would never list.
  **Fixed (3873700):** reproduced — the guard asked about `DashboardPage`/`SettingsLayout`/`UserRoute`, and `boss design` listed `App`. One `notAComponent` in both, pinned by `test/not-a-component-parity.test.js`.
- [x] **F3** · Same-job duplicates in `src/`: the markdown section slicer (×4: design, playbook,
  changelog, recap — playbook's interpolates a string into a regex unescaped); title-from-H1 (~13, each
  strips the id differently); the project stamp read 3 ways, `installedLayers || [stamp.stage]` retyped
  7×, `insights.js:84` answers differently.
  **Closed, not refactored:** the stamp fallbacks give the same answer at all eight sites (the inventory's "answers differently" did not reproduce); the four section slicers stop at different places and each caller relies on its own — merging is a behaviour change with no bug. Kept in `docs/ENGINEERING.md` §3 as *helpers that don't exist yet*.
- [x] **F4** · Script copies of `src/` helpers: `esc` (gen-site's turns `0` into `''`), ANSI colours
  ignoring NO_COLOR, `cmpVersion`, a day formatter, three timed HTTP `get`s, a byte-identical placeholder
  cleaner.
  **NO_COLOR fixed (landed inside a peer's 29a0889 — the shared index swept it):** reproduced, 5 escapes under `NO_COLOR=1`; both scripts use `src/ui.js`, held by `test/scripts-honour-no-color.test.js`. `esc(0)` didn't reproduce (every call passes a string); `cmpVersion`, timed `get`, placeholder cleaner are identical duplicates — noted, not refactored.
- [x] **F5** · ~10 bare-regex frontmatter reads; `check-backlog.js:106` would read a folded `proof: >` as
  `">"` — latent (no shipped record folds `proof:` today).
  **Fixed (5f6ae4d):** reproduced in a worktree; check-backlog uses the shared `field`; test fails on the old script.
- [x] **F6** · Hooks are "self-contained" by claim: 1 of 13 is run from a scaffolded copy; the 9 L1
  hooks are tested in place, where an import from `src/` would still resolve.
  **Verified, no check added:** 0 of 13 hooks import outside their own folder; opt-in hooks import only built-ins. No bug, so no gate (principle 4).
- [x] **F7** · Local-day stamps held in `src/`, broken in 4 scripts; `check-freshness.js:219` and
  `helpers.daysAgo` default to UTC (not reproduced).
  **Fixed (ba8509f):** reproduced live ("as of 2026-10-05" at 20:21 Pacific on the 4th); four scripts and `test/helpers.js` use `isoDay`; test runs two zones 25h apart.
- [x] **F8** · `demo.test.js:86-88` writes the working tree; tests isolated only through `HOME` inherit an
  exported `BOSS_HOME` (not reproduced).
  **Fixed (e393b62):** demo probes sandboxed; and reproduced worse than suspected — with `BOSS_HOME` exported the suite wrote 8 files (a registry, a `boss remove` backup) and 11 tests failed. `test/env-guard.js` preloaded by both test scripts; 0 files after.
- [x] **F9** · Written-only rules with no runner: CHANGELOG bullet per capability; CHANGELOG shows no
  research; `kind: capability` has no reader; reproduce-before-fix and gates-name-their-bug held by habit;
  zero-dep enforced only because CI has no install step. Not all need a gate — B3 asks which do.
  **Decided, no mechanism:** each rule stays W until a bug reaches a user (principle 4); they're marked W in `docs/ENGINEERING.md` so the rot list is visible.
- [x] **F10** · Four core modules (`cli`, `paths`, `scaffold`, `sync`) have no WHY header.
  **Done (c3e1833):** 42 of 42 modules carry a header.
- [ ] **F11** · 🔴 **A misattribution, live on the site.** *"Documented conventions rot; enforced
  conventions compound"* is shipped in quotation marks as Factory.ai's — `scalable-architecture.md`
  (spine + both provenance fields), `library/sources.json` (`factory-ai.for`, so the Credits page
  credits them with it), `smoke-guard.js:9`, `smoke/SKILL.md:63`, two CHANGELOG entries, and the
  generated `site/engineering.html` + `site/credits.html`. R2 downloaded the source the research
  compendium cites and Factory's two nearest pages: the words are not there (killed 3-0). It is BOSS's
  own compression. Repair: keep the line as BOSS's, unquoted, and credit Factory for the sentence they
  did write (lint-enforced guidelines). Correctness — the freeze allows it; regenerating and deploying
  stay Ajesh's. Old CHANGELOG entries are history: correct forward, don't rewrite.
  **Deferred (Ajesh, 2026-10-04: *"no"* to fixing it now)** — stays open, not dropped.
- [x] **F12** · `library/practices/design-system.md:620` says demotion uses the *"same threshold as
  promotion"* — but promotion is **twice** (`:570`, `:608`) and demotion is **three exceptions**
  (verified 2026-10-04). Shipped text disagreeing with itself. Either the sentence is wrong or the
  asymmetry is intended and should say why (R5: promotion is cheap and reversible; a rule is not).
  **Fixed (be0a992):** the sentence now says why two and three differ.

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

## R5 findings (2026-10-04) — pattern libraries for code

`docs/research/sessions/SESSION-2026-10-04-code-pattern-library.md`: five angles, 38 sources read,
20 claims to the panel. **Only the evidence verifier reported** (13 confirmed, 7 with caveats, 0
refuted). The fit and attribution votes landed late and are folded in (R6, done): the 3-vote is
complete for all 20 claims. Inputs, not decisions.

- **The record form is small.** The minimum the pattern community agreed: name · context · problem ·
  forces · solution; the rest optional, and a weak placeholder is worse than a gap. A one-sentence
  problem and one-sentence solution is already a table row. **The design `PATTERNS.md` has no *forces*
  (why) column** — the field says that is the part that makes a pattern reusable.
- **Two vs three, resolved rather than chosen (sharpens R1's tension).** "Rule of three" is two rules:
  three uses *inside one codebase* before you abstract (Roberts), and three *independent systems*
  before a pattern is published (the pattern community). A single project can only meet the first. So:
  **name the decision at two, write the helper at three, and three separate projects is the bar for
  `/extract` UP** — never for the project's own list.
- **A proto-pattern tier** — a named, short, not-yet-proven entry. The design side has none.
- **The exit door (new, and the most portable):** a pattern lives at three levels — written in prose,
  built as a helper, absorbed by the language or framework until it disappears (Norvig). When the
  project writes the helper or the framework absorbs it, **the entry leaves the list.** Retiring
  patterns is historically hard (the original authors' own attempts stayed drafts) — so it needs a
  mechanism, not good intentions.
- **Keeping a list alive:** cite entries by shorthand in review (the design side already does — `PAT-n`);
  admit a pattern only if it is not a duplicate; update the entry in the same change as the code it describes;
  flag new uses of anything deprecated so a retired pattern can't creep back.
- **The agent era — a caution for A4 (the code map):** one 2026 study found agents *follow*
  context-file instructions, yet the files did not generally raise task success and cost 20%+ more;
  repository overviews did not help. Another: context files grow by small additions and almost never
  shrink. A tuned-guidance study points the other way (kept as counter-evidence). **Nothing found
  tests a named pattern list against "copy the nearest code"** — the open question for this whole idea.
- **The fit vote — what survives for one founder, one repo, an agent reading at write time:**
  - **Fewer columns, not more.** Name · context · rule · maybe forces; the old-book headings don't scale
    down. List only what an agent **would not infer by reading the code** — the context-file study's
    own finding is that guidance helps with *non-standard* practice, and its cost argues for brevity.
  - **Point at a live file, never a pasted snippet** — snippets drift, and the agent copies the example
    literally, flaws included. So never cite a file that contains the anti-pattern.
  - **The anti-pattern row's useful shape:** why the wrong thing looks attractive, and what to use
    instead — agents choose the attractive wrong thing.
  - **A smell is a prompt to look, not a ban.**
  - **Doesn't transfer:** trial-then-stable after six months (one person just leaves entries in limbo);
    "three systems" (nothing to count across in one repo); the small single-author study.
  - **Don't claim a list improves consistency** — no study found measures it.
- **Attribution, for whoever writes the practice:** cite the GoF headings as *Fowler's summary of the
  GoF form* (second-hand); the three-systems rule as *Appleton (2000), reporting community usage*; Johnson
  only *as quoted by Dominus*; the review-comments page as *the Go Wiki*, not "the Go team". **Refuted:**
  *"Coplien (1996) originated the rule of three"* — his 1996 text never says it. The A4 study is
  confirmed at source (add *"on average"* to its 20%).
- **Killed:** R1's *"16 of 23 GoF patterns vanish"* (Norvig wrote *invisible or simpler*, for some
  uses); treating the two rules of three as one; *"Coplien established the rule of three"*
  (snippet only); a paper about training data cited as evidence agents copy nearby code; and three more.
- **Name collision:** BOSS's own `docs/PATTERNS.md` is an outward essay, not a pattern list — a code
  `PATTERNS.md` beside it would collide (Q8).

## R3 findings (2026-10-04) — the layers BOSS's own code can't demonstrate

`docs/research/sessions/SESSION-2026-10-04-layers.md`: six finders (one per layer), ~150 sources read,
28 load-bearing claims 3-voted — 24 confirmed (most narrowed), 2 killed outright plus 17 sub-claims.
Inputs, not decisions; the record ends with six candidate layer rows.

- **One principle runs across four layers** (data, API, config, AI calls) and came from the sources,
  not a metaphor: **parse at the boundary, fail loud inside** (fail-fast — Shore; parse, don't validate
  — Alexis King). Evidence for IDEA-137's question of whether principles are shared between ecosystems.
- **API arrives on a test, not a feeling:** published vs public (Fowler) — can you find and change every
  caller? The large API guides say in their own text that their strict rules don't apply to an API one
  team calls. That is the *second consumer* trigger, sourced.
- **Errors & observability at MVP traffic:** an error-rate alert fires on a single failure (Google SRE
  workbook), and an uptime check must look for expected content, not just a 200.
- **Dependencies:** before installing a package an agent named, confirm it exists and is the one meant;
  commit the lockfile; set a minimum release age. **After a leak, revoke the key first.**
- **AI calls:** a model id change is a code change — retired ids fail, old request settings 400 on new models.
- **Killed:** *agents swallow errors more than humans* (one author, own scanner); *agent commits leak
  secrets 2×* (vendor, method gated); *UUIDs stop enumeration* and *RFC 9562 recommends v7 over v4* (it
  prefers v7 over v1/v6, and says UUIDs must not be security capabilities); *a fifth of AI-suggested
  packages don't exist* (mostly early-2024 open models; commercial 5.2%); *Twelve-Factor now says no env
  vars for secrets*; *"a dependency is a liability"* is not Cox's line.
- **Open:** no primary source answers *which module may write a table*; how often tool-using agents
  install hallucinated packages is unmeasured.

**Flagged in BOSS's shipped practices — each a task, reproduce before changing (rule 8):**
- [x] **F13** · `context-discipline.md:226` — *"a `Read(...)` deny does NOT block Bash (`cat .env` still
  works)"* may be stale: R3 reports the host's deny rules now cover `cat`/`head`/`tail`/`sed`/`tee`.
  **Fixed (9faad31):** host docs confirm Read/Edit deny rules reach `cat/head/tail/sed/tee` and redirections, not `grep -r` or scripts.
- [x] **F14** · `context-discipline.md:243-247` and `agent-security.md` call `secrets-guard` *the
  boundary*; it matches tool-call text, so a script or `grep -r` that reads `.env` without naming it
  passes. The host — and the practice's own sandbox section — say the sandbox is the boundary.
  **Fixed (9faad31):** reproduced — `cat .env` caught, `node scripts/load-config.js` and `grep -r API_KEY .` pass. Both practices now say the sandbox is the boundary.
- [x] **F15** · `model-routing.md:36` *"it fails silently"* — false on the API surface (a bad id
  errors); check the host surface before rewording.
  **Narrowed (9faad31):** host docs — a skill's pin is silently unused; an agent's falls back with a warning only interactively. "Fails quietly", with the documented behaviour.
- [x] **F16** · `data-schema.md:78` gives enumeration as the reason for UUIDs (verified). Narrow it:
  enumeration is how the hole gets *found*; a UUID is not the protection (RFC 9562).
  **Fixed (be0a992):** a UUID makes rows harder to guess, never protects them.
- [x] **F17** · `agent-security.md` says *pin and review* with no lockfile, minimum release age, upgrade
  path or post-leak step.
  **Fixed (9faad31):** confirm an agent-named package exists, commit the lockfile, minimum release age, revoke a leaked key first.
- [x] **F18** · `data-schema.md:67` keeps the *"Schema decisions are one-way doors"* header a 2026-08-24
  research session refuted.
  **Fixed (be0a992):** *schema shape is cheap to change; what it remembers is not.*
- [x] **F19** · During R3 a guard refused a grep over downloaded public docs because the *pattern*
  contained `.env` — a false positive, not reproduced; which guard fired is unknown.
  **Did not reproduce:** `secrets-guard` lets a grep whose pattern contains `.env` through. Whatever blocked the research agent was its own session's settings. Nothing shipped.
- **Confirmed, no change:** `agent-security.md`'s OWASP 2026 claim (release dated 2026-08-04).

## R4 findings (2026-10-04) — Extreme Programming, and XP with agents

`docs/research/sessions/SESSION-2026-10-04-xp-and-agents.md`: five angles, 47 sources read, 22
load-bearing claims 3-voted — 15 confirmed (most with caveats), 3 narrowed, 4 killed, 3 transfers
killed. Inputs, not decisions.

- **Restraint is only safe beside the practices that keep change cheap.** XP's own premise (Beck 1999;
  Fowler 2004): YAGNI and simple design hold *only* when tests, CI and refactoring keep change cheap. An
  agent removes refactoring's natural host — so "build only what's needed" loses its licence unless the
  enabling practices arrive **with or before** the restraint. (Argument; Beck's cost-curve evidence is
  his own anecdote.) Bears on every ecosystem in IDEA-137, not only code.
- **XP's answer to "authors can't test their own code" was the pair.** An agent writing and checking its
  own tests is the arrangement XP designed out (sharpens `testing-with-agents.md` §2). **A red test counts
  only if someone checks *why* it is red.**
- **Discard on red:** first-edition CI — if the tests can't get to 100%, throw the change away and start
  again (lineage to test-commit-revert and Beck's own restarts). Cheap when an agent wrote the change.
- **Parallel change** — the old and new implementation side by side, then switch — named by Beck as the
  technique agents lack.
- **Beck, 2025–26:** XP *"manufactured trust"*; the practice set for agent work is *"not yet settled"*;
  YAGNI survives free code generation. One measured echo: refactoring cut an agent's input tokens per
  change by 83% (one app, July 2026).
- **Pace and the human:** comprehension falls when AI writes the code (an RCT, n=52: 50% vs 67%, biggest
  gap in debugging); cognitive debt; small batches help but *feel* slower (DORA 2025). Survivor rule:
  **at least one human understands what changed and why.**
- **Shape inputs:** XP 2nd edition's *primary vs corollary* practices is a seed-that-scales shape;
  *"just rules"* — a rule may change if you say how you will judge the change; XP's own documented
  retirement of practices (metaphor dropped as a practice) is a precedent for retirement in IDEA-137.
- **Contradictions to carry:** once-and-only-once vs Metz / rule of three (a third voice in the
  widen-vs-inline tension); agent-internal TDD is contested — **no support for a TDD mandate** (agent
  runs with tests first showed no benefit; the human-writes-the-test mode is untested); Beck is now
  *"iffy about simplicity as a value"*; **XP assumes a team** — every claim resting on a second human
  fails to transfer, and every survivor assumes the founder can read code or read what a test checks.
- **Killed / corrected:** the "3,308 students" figure belongs to a 2017 meta-analysis, not Hannay 2009;
  Arisholm 2007 doesn't refute "about the same time" but does undercut "better code"; *"make it work,
  make it right, make it fast"* is not Beck's; *"TDD is a superpower"* is a newsletter heading, not Beck;
  *"energized work replaced the 40-hour week"* is a commentator's reading.

## Work — every item has an id; cite as `IDEA-136 · B3`

**R — bring the research in (first; feeds both tracks)**
- [x] **R1** · Read at source the "atomic design for code" lineage and senior-engineering thinking
  (module design, boundaries, naming, abstraction thresholds, testing, agent-era conventions). Cited
  session record in `docs/research/sessions/` (gitignored — outside sources never named in tracked
  text); person and standard citations may travel into the practice.
- [x] **R2** · Verify every attribution that makes it into tracked text (the memory note: claims bend
  on who said it). Killed claims recorded beside confirmed ones.
- [x] **R3** · Research the layers BOSS can't demonstrate (data, API, errors/observability,
  dependencies, prompts-as-code) — a second pass once R1 lands, so R1 stays focused.
- [x] **R4** · Extreme Programming at source — the values, principles and practices (Beck 1999/2004:
  pairing, TDD, simple design, refactoring, collective ownership, coding standards, small releases,
  continuous integration, sustainable pace) — and **XP with AI and agents** (2024–26): what
  practitioners carry over, what breaks, what the agent changes about pairing and test-first.
- [x] **R5** · Pattern libraries for code — the design side has `docs/design/PATTERNS.md`; what is the
  code twin? Gang of Four, Fowler's enterprise patterns and refactoring catalogue, the Portland Pattern
  Repository, pattern form (name · problem · forces · solution · consequences), anti-patterns, and how
  a project keeps *its own* pattern list alive. Builds on IDEA-137's Alexander research, doesn't repeat it.
- [x] **R6** · Finish R5's verification — the **attribution** vote on its claim list (the fit vote
  landed late, folded in below) — and re-check the A4 study (arXiv 2602.11988 v3) at source before the
  code map leans on it.

**B — BOSS's own code (extract from practice, don't invent)**
- [x] **B1** · Inventory the conventions `src/`, `scripts/`, `test/` and the hooks actually keep, each
  with a file:line receipt. Include the deliberate exceptions (parity duplicates) — an exception with a
  reason is a convention too.
- [x] **B2** · Sort each into principle / guideline / rule. Test: could a reasonable person argue the
  opposite? Three to five principles, no more.
- [x] **B3** · Mark every rule *enforced (by which check or test)* or *written only*. The written-only
  list is the rot list (the checkers-state-intents heuristic).
- [x] **B4** · BOSS's code map — what each of the 42 modules owns, and the shared helpers an agent must
  find before writing one (`atomic`, `frontmatter`, `paths`, `clock`, `args`, `records`, …).
- [x] **B5** · BOSS's testing conventions as practised: regression test named for the bug, reproduce
  first, `test:ci` vs `check`, the staged-tree hook, gates name their bug.
- [x] **B6** · Write it as BOSS's engineering document (tracked; renderable later) and move the code
  rules out of CLAUDE.md into it, leaving a pointer — CLAUDE.md is past the length where it gets read.
  **Done 2026-10-04:** `docs/ENGINEERING.md` — the eight parts, five principles (P5 concurrency, P6
  reason-in-code and P8 derive-don't-restate folded in as guidelines), every rule marked E / P / W, the
  map and the helpers table. **Held back:** moving the code rules out of CLAUDE.md — CLAUDE.md carries
  another session's uncommitted edits; do it when that lands (task **B6b**). Engineering column of
  `docs/ECOSYSTEMS.md` filled; four disagreements with the draft guide recorded in ENGINEERING.md for C7.
- [ ] **B6b** · **Proposed, not done — Ajesh's call:** CLAUDE.md loads every session and docs/ENGINEERING.md doesn't, so moving rules out lowers how often agents see them; the alternative is one pointer line. Original task: Move the code rules out of CLAUDE.md into `docs/ENGINEERING.md`, leaving a pointer —
  after the uncommitted CLAUDE.md edits from another session land.
- [x] **B7** · Read the one duplicate (`section`) and anything B1 turns up: real reuse miss, or a
  name collision with two jobs?
- [x] **B8** · `/extract` the result: what routes UP (the shape) and what stays BOSS-only. EXTR record. **Done:** `docs/extractions/EXTR-003-the-engineering-ladder.md` — six
  candidates UP (E/P/W marks; the need·use·not map; two-then-three with the inline-back tell; forgive what
  a person wrote; test the contract and add a test per bug; parity-pin forced copies), four stay home.

**A — what ships to a founder (after B8)**
- [x] **A1** · The practice: engineering principles ladder, a seed-that-scales table for code, reuse /
  adjust / new for code, promotion and demotion thresholds, leverage-or-own for linters. Extend
  `scalable-architecture.md` rather than add a practice, unless R1 shows it is a different subject.
  **Done 2026-10-04:** a new practice, `library/practices/engineering-system.md` — not an extension of
  `scalable-architecture` (a different subject: the code twin of `design-system`, which owns the climb). In
  the Engineering page's *Building with agents* group; site regenerated (practice count 34 → 35), not deployed.
- [x] **A2** · The founder's seed: fill `.claude/rules/your-app-code.md` (ships at Quickstart, loads
  only when code is open) — principles slot, module map slot, testing slot. **Floors pre-filled,
  values blank until earned** (`design-system.md` § Craft floors).
- [x] **A3** · The planting moment — where the seed gets filled in, with no new skill (see Q3).
  **Done 2026-10-04 (A2, A3, A8, A10, A12):** `/smoke`'s first run offers `.claude/rules/engineering.md`
  from `skills/smoke/templates/engineering.md` — founder-owned (not in `manifest.rules`, so sync never
  touches it; the template reaches existing projects as a skill resource — verified with `boss sync`).
  Floors pre-filled, principles and map blank; code + testing + data; every rule marked E/P/W; looks for
  an existing conventions home first. `coder` reads it before changing code; `tester` holds its testing
  rules. Two flows declared in `registry/flows.json` (smoke → coder, smoke → tester), and the check was
  broken on purpose to see it fire. **Not exercised end to end:** the planting itself is Claude following
  `/smoke`; the CLI test covers what ships, not the model's run of it.
- [x] **A4** · The code map at MVP: authored, read before creating a module or helper; carries the
  negative-finding rule (an agent's "nothing like this exists" is a claim about its searches — synonym
  pass first, `testing-with-agents.md`).
  **Done:** the map slot in the seed, with the negative-finding rule beside it.
- [ ] **A5** · Reuse for code: widen `component-reuse-guard` (or a mode of it) to check a new
  module/helper name against the map. Advisory, once per new name.
- [ ] **A6** · Boundaries for every surface: `ui-boundary-guard` reads its layers from the map, not only
  from `ui/` + `features/`, so a CLI, API or agent gets one-way imports too.
- [ ] **A7** · One word per concept, in code: the copy glossary also names identifiers.
- [x] **A8** · Testing guidelines that ship: tests from acceptance criteria before code; a negative test
  for each of the three must-not-break paths; reproduce before fix; a regression test named for its
  bug; never weaken an assertion to pass; model output goes to `/evals`, not `assert`.
- [ ] **A9** · Candidate: an assertion-weakening guard (test assertion loosened in the turn that changed
  the source). Only with a named incident (Q4).
- [x] **A10** · Step 0 for brownfield and experienced founders: read the lint config, CONTRIBUTING,
  AGENTS.md first; offer, don't seed over. Cohort-aware like `/design-tokens-init`.
- [x] **A11** · Retirement for code: deprecate with a successor, delete the unused, three exceptions
  means the rule is wrong.
  **Done:** the seed's *Changing these* and the practice's thresholds (three exceptions; an absorbed pattern leaves).
- [x] **A12** · Wire the agents: `coder.md` and `tester.md` point at the seed; `mentor-architect` owns it.
- [ ] **A13** · V1 drift reader (generated code map + duplicate finder, the `/design-library` twin) —
  **deferred**; re-open when a project's authored map is seen going stale.
- [x] **A14** · Kettlewick demo record if a new record type appears (standing rule); CHANGELOG bullet
  in product terms only.
  **N/A:** no new record type — the seed is a rule file, not a playbook record.
- [x] **A15** · On the site: **the Engineering page already exists** (`site/engineering.html`), generated
  from `library/practices/*.md` and grouped by `ENG_GROUPS` in `scripts/gen-site.js` — which fails if
  a practice is in no group. So capturing A1 as a practice puts it on the page at the next regenerate:
  one row in `ENG_GROUPS` and a `provenance_public:` line, no new page, nothing the freeze forbids.
  Regenerating and deploying stay Ajesh's.
  **Done (not deployed):** the practice is on the Engineering page by regeneration; deploy is Ajesh's.

## Open questions
- **Decided (Ajesh, 2026-10-04, A-track shape):** **Q2** the rule file only — no founder `docs/` doc;
  **Q5** the MVP rung; **Q3** filled at `/smoke`'s first run (which already plants strict types and a
  formatter); **Q7** code + testing + data in the first slice — the other layers stay practice rows on
  their triggers.
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
- **Q8** · One pattern record shape for every ecosystem (IDEA-137) — design and code as two lists of
  one form, with a *forces* column and a proto tier — or separate files? And what to call the code list
  so it doesn't collide with BOSS's own `docs/PATTERNS.md`. · settles after IDEA-137.
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
- **2026-10-04 · Ajesh** — *"also im wondering if we should expand this to database and other stuff as
  well"* → the Scope table, Q7, R3.
- **2026-10-04 · Ajesh** — F11: *"no"* (not now). *"anything from extreme programming, especially extreme
  programming with AI and agentic AI… Also pattern library. also wait for idea-137… we will first build
  that before building this… lets continue expanding our investigation"* → R4, R5, R3 launched; the
  build waits on IDEA-137.
- **2026-10-04 · Ajesh** — *"lets build it, where we capture it, so that we can put it on our website
  under engineering if needed"*; bring in existing practice and research — atomic design for code, and
  senior engineering thinking → R1/R2.
