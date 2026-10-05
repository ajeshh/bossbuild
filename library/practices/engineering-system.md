---
id: PRACTICE-engineering-system
type: practice
owner: mentor-architect
status: active
host: stack-neutral
provenance: IDEA-136 (2026-10-04). Extracted UP from BOSS's own engineering ecosystem (the ENGINEERING reference, routed by EXTR-003) and five research passes, each claim 3-vote verified at source — R1 (atomic design for code, module design, enforcement), R3 (data, API, errors, dependencies, config, AI calls), R4 (Extreme Programming and XP with agents), R5/R6 (pattern libraries for code); session records gitignored. Shaped by IDEA-137's ecosystems guide as the second ecosystem after design.
provenance_public: Extracted from how BOSS's own code is actually built — its conventions read from the source with receipts, its broken rules counted — and from five research passes read at source and checked claim by claim. Lineage — David Parnas (hide the decision most likely to change, 1972), John Ousterhout (deep modules), Sandi Metz (duplication is cheaper than the wrong abstraction), Don Roberts' rule of three as popularised by Martin Fowler, Kent Beck (simple design; structure and behaviour in separate changes), Google's software engineering book (the four kinds of change; rules cost what must be remembered), Peter Norvig (patterns the language absorbs), Eric Evans (one language per context), Alexis King (parse, don't validate), Birgitta Böckeler (guides and sensors for coding agents).
last_reviewed: 2026-10-04
review_by: 2027-04-02
curve: craft-ai
anatomy: 2
---

# Practice — The engineering system: the design system's ladder, for code

> **The spine.** An agent re-reads your codebase from scratch every session and copies whatever it
> finds nearest. So the code needs what the design system gives the screens: **a few principles you
> can argue with, a map of what already exists, rules an agent can act on — each saying what enforces
> it — and a way to retire them.** Not more rules. Fewer, marked honestly, at the rung that earned them.

## The ladder — principle, guideline, rule

Same three levels as the design system, because each does a different job and only the last is
something an agent can check itself against:

| Level | What it is | Example | Who it steers |
|---|---|---|---|
| **Principle** | a direction that contains a tradeoff | *"Fewer moving parts over convenience."* | you, in an argument |
| **Guideline** | how to approach it | *"Write the thirty lines when the library would bring a tree."* | you and the agent, in a decision |
| **Rule** | a direct, checkable instruction | *"Adding a package is a decision, never just an import."* | the agent, and a check |

**The test for a principle: could a reasonable person argue the opposite?** If not, it's a mood. Three
to five, no more.

**The part the design system didn't have: every rule says what enforces it.**

| Mark | Means |
|---|---|
| **E** | a named check fails when the rule is broken |
| **P** | something catches some of it |
| **W** | written only — nothing fails |

Write the mark next to the rule. **The W list is the list that rots**, and it's the one to read when
something breaks. A rule only costs what has to be *remembered* — an automated one is free — so a W
rule that keeps getting broken is asking for a check, and a W rule nobody breaks may not need one.

## The seed — decide early only what gets dearer to reverse

| Decide at seed | Why it can't wait | Ceremony? |
|---|---|---|
| **Imports point one way** — shared code knows nothing about features; features don't reach into each other | reversing a dependency direction later is a rewrite of both sides | no — a folder habit |
| **Check input once, at the edge; fail loud inside** | validation scattered through the code can't be found or trusted later | no — a habit |
| **One word per concept** — the same noun in the schema, the code and the copy | renaming a core noun later hits routes, tables, tests and screens | no — a list |
| **Strict types and a formatter, on** | the most painful thing to retrofit onto code an agent has grown for months | two config lines |
| **A home for shared helpers, with a map** — never a `utils` dump | an agent writes a fourth `formatPrice` when it can't find the first | low |
| **A test beside each feature's acceptance criteria** | a codebase with no tests can't be refactored, so it can't stay simple | low |

**Defer:** services, plugin systems, dependency-injection frameworks, caching, an abstraction before
the third copy, coverage targets.

**Restraint is only safe beside the practices that keep change cheap.** *Build only what's needed*
works because tests and refactoring make the later change cheap (Beck). An agent writes fast and never
stops to refactor on its own, so the enabling half — the test, the refactor, the small batch — has to
arrive **with or before** the restraint, not after it.

## The map — check it before writing a helper

The code twin of the component index. Three columns:

| You need | Use | Not |
|---|---|---|
| a day a person reads | `formatDay()` in `lib/time` | `toISOString().slice(0, 10)` — it's UTC, and looks right until evening |
| … | … | … |

- **List only what an agent can't infer by reading the code.** An overview of the repo doesn't help
  (a 2026 study of context files found they cost ~20% more on average and didn't generally raise
  success). The non-obvious — *this exists, use it, here's the tempting wrong thing* — is what does.
- **Point at a live file, never a pasted snippet.** Snippets drift, and the agent copies the example
  literally, flaws included. Never point at a file that contains the thing you're warning against.
- **The *Not* column says why the wrong thing is attractive.** Agents pick the attractive wrong thing.
- **Before acting on "nothing like this exists," search by three or four other names and by behaviour.**
  An agent's negative finding is a claim about the searches it ran, not about your code.
- **Don't claim the map makes the code consistent.** No study measures that. It's a better filter; a check
  that fires when a new helper is written without a row is what turns it into a boundary.

## Reuse, adjust, inline, or new

The decision that happens every time something gets written: *this already exists, and my need is
eighty percent of it.*

| What you have | The answer |
|---|---|
| same job, different input | a parameter |
| same job, slightly different need | widen the one that exists — **unless** it would need a new parameter *and* a new conditional for this one caller |
| that tell — a flag that only one caller sets | **inline it back.** Duplication is cheaper than the wrong abstraction (Metz) |
| different job that happens to look alike | genuinely new |
| two existing things doing one job | reconcile — propose the merge; the blast radius is your call |
| can't tell | **copy it and note it in the map.** (The design system says *variant* here. Code differs: a wrong abstraction costs more than a duplicate, and the third copy will tell you what the shared shape really is.) |

**Thresholds.** Name the decision at two (a note in the map). Write the helper at three (Roberts' rule
of three). A pattern three separate *projects* share is a candidate for something bigger than this repo.

**A pattern the code has absorbed leaves the list.** Patterns live in prose, then as a helper, then
absorbed by the language or framework until you stop noticing them (Norvig). Once there's a helper,
the prose entry goes.

## Testing — the conventions that hold with agents

- **Reproduce before you fix.** Write the test that fails on the current code first. If it passes,
  there's no bug — ship nothing.
- **A bug fix adds a test, named for the bug. Only an intended behaviour change edits an existing test.**
  An agent loosening an assertion until it passes is how a broken thing goes green.
  (Google's four kinds of change: refactor, new feature, bug fix, behaviour change — only the last
  touches an existing test.)
- **Structural change and behaviour change go in separate commits** (Beck), so a red test points at one.
- **Test the contract a person touches** — the route, the command, the screen — not the internals.
- **A red test counts only if someone checks *why* it's red.** XP's answer to *authors can't test their
  own code* was a second person; an agent writing and checking its own tests is the arrangement XP
  designed out.
- **Discard on red.** If an agent's change can't get the tests green, throwing it away and starting
  again is often cheaper than repairing it — and with an agent, it usually is.
- **No test-first mandate.** The evidence that test-first helps when an agent writes both the test and
  the code isn't there. The mode where *you* write or approve the test hasn't been measured — try it.
- **At least one human understands what changed and why.** Comprehension falls when AI writes the code
  (one controlled study: 50% vs 67%, widest in debugging). Small batches help, and feel slower.
- Model output is judged by evals, not `assert`.

## The other layers — same ladder, one row each, on its own trigger

| Layer | Arrives when | The first rule |
|---|---|---|
| **Data** | the first table | migrations are code, reviewed like code — the depth is in `data-schema` |
| **Errors & monitoring** | the first real user | fail loud inside; an uptime check looks for the page's content, not just a 200; at low traffic one failure is an alert |
| **Dependencies** | the first package | confirm an agent-named package exists and is the one you meant; commit the lockfile; set a minimum release age |
| **Config & secrets** | the first deploy | one place for config; secrets never in code or in the agent's context; after a leak, revoke the key first |
| **AI calls** | the first model call in the product | a model id change is a code change — retired ids fail; prompts are versioned like code, judged by evals |
| **API contract** | a **second consumer** — can you still find and change every caller? (Fowler's published-vs-public) | until then the big API style guides say their strict rules don't apply |

Each row is silent until its trigger. A project without a database has no data row, and nothing is
missing.

## Enforcement — guides before, sensors after

- **Guides** steer before the agent writes (the map, the rules file). **Sensors** check after (a test, a
  lint rule, a hook). Asking an agent in a context file to run the checks itself is unreliable; a hook
  that runs them is not (Böckeler, 2026 — one practitioner, one app).
- **Put the fix in the failure message.** The agent reads it and acts on what it says.
- **Advisory first; block only with an incident.** A check that never fires is a candidate for removal.
- **Three exceptions to the same rule mean the rule is wrong.** Narrow it, split it, or retire it.

## Altitude — the right rung

**Quickstart:** nothing — prototypes are meant to be thrown away. **MVP:** the seed, the map once a second
copy appears, the testing conventions with the first shipped feature, layer rows on their triggers.
**V1:** the map is generated rather than authored; the reuse check reads it; drift becomes visible.
**Scale:** a second team, and with it contribution rules and the API contract.

## Relationship

The code half of [`design-system`](design-system.md) — same ladder, same thresholds table, one honest
difference (*can't tell → copy*, not *variant*). [`scalable-architecture`](scalable-architecture.md)
owns the climb (modular monolith, the schema as the one-way door); [`testing-with-agents`](testing-with-agents.md)
owns why an agent going green isn't the code being right; [`data-schema`](data-schema.md) and
[`agent-security`](agent-security.md) own their layers in depth; [`quality-ratchet`](quality-ratchet.md)
is how a W rule becomes an E without a big-bang cleanup.
