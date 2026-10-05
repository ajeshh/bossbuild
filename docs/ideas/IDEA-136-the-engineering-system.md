---
id: IDEA-136
type: idea
kind: capability
owner: mentor-architect
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
- **Where it gets captured:** a tracked document that can become an *Engineering* page on the site.
  The site itself waits for the freeze (correctness-only until `copy_install` shows traffic; first read
  2026-10-14) — see A15.
- **Mandate:** compose and subtract, never add a skill. Keeping BOSS current with the craft of
  building with agents is its own warrant (no founder evidence needed); a new *gate* still needs a bug
  that reached a user.

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

## Work — every item has an id; cite as `IDEA-136 · B3`

**R — bring the research in (first; feeds both tracks)**
- [ ] **R1** · Read at source the "atomic design for code" lineage and senior-engineering thinking
  (module design, boundaries, naming, abstraction thresholds, testing, agent-era conventions). Cited
  session record in `docs/research/sessions/` (gitignored — outside sources never named in tracked
  text); person and standard citations may travel into the practice.
- [ ] **R2** · Verify every attribution that makes it into tracked text (the memory note: claims bend
  on who said it). Killed claims recorded beside confirmed ones.

**B — BOSS's own code (extract from practice, don't invent)**
- [ ] **B1** · Inventory the conventions `src/`, `scripts/`, `test/` and the hooks actually keep, each
  with a file:line receipt. Include the deliberate exceptions (parity duplicates) — an exception with a
  reason is a convention too.
- [ ] **B2** · Sort each into principle / guideline / rule. Test: could a reasonable person argue the
  opposite? Three to five principles, no more.
- [ ] **B3** · Mark every rule *enforced (by which check or test)* or *written only*. The written-only
  list is the rot list (the checkers-state-intents heuristic).
- [ ] **B4** · BOSS's code map — what each of the 42 modules owns, and the shared helpers an agent must
  find before writing one (`atomic`, `frontmatter`, `paths`, `clock`, `args`, `records`, …).
- [ ] **B5** · BOSS's testing conventions as practised: regression test named for the bug, reproduce
  first, `test:ci` vs `check`, the staged-tree hook, gates name their bug.
- [ ] **B6** · Write it as BOSS's engineering document (tracked; renderable later) and move the code
  rules out of CLAUDE.md into it, leaving a pointer — CLAUDE.md is past the length where it gets read.
- [ ] **B7** · Read the one duplicate (`section`) and anything B1 turns up: real reuse miss, or a
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
- [ ] **A15** · The *Engineering* page on the site — **waits on the freeze** (first read 2026-10-14).

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
