---
id: EXTR-003
type: extraction
owner: mentor-architect
status: recorded
created: 2026-10-04
trigger: IDEA-136 · B8 (BOSS's own engineering written down — docs/ENGINEERING.md)
---

# EXTR-003 — what BOSS's own engineering hands up to a founder, and what stays home

## Recent context

IDEA-136 wrote BOSS's own engineering ecosystem down from the code (`docs/ENGINEERING.md`): five
principles, every rule marked enforced / partly / written-only, a layer map and a *find this before
you write one* table. Five research passes ran alongside (IDEA-136 · R1–R6). This record sorts each
piece: **UP** into what BOSS ships a founder (the A track), **DOWN** as a fact of BOSS's own code only.
The A track builds only what is routed UP here.

## Candidate 1: every rule carries an enforcement mark — E, P or W

- **What it is:** a rule says what enforces it — a named check (E), something partial (P), or nothing
  (W, written only). The W list is the list that rots.
- **Where it lives now:** `docs/ENGINEERING.md` §1. Found because BOSS's own two broken rules (an
  import cycle, a drifted boundary copy) were both W, and nothing marked them so.
- **Route:** **UP**
- **Rationale:** stack-neutral, costs one letter per rule, and it is the honest answer to the design
  system's own lesson — *documented conventions decay; enforced ones hold* — applied to the reader
  instead of the writer. A founder can see at a glance which of their rules an agent can quietly
  break. Also proposed to IDEA-137 · C7 for every ecosystem.
- **If UP:** the rule lines in the founder's seed (A2) carry the mark; the practice (A1) explains it.

## Candidate 2: the *find this before you write one* table — need · use · not

- **What it is:** the code map an agent reads before writing a helper, shaped as three columns: what you
  need, the helper that already does it, and **the attractive wrong thing** to avoid.
- **Where it lives now:** `docs/ENGINEERING.md` §3, built from 15 duplicate families found in B7.
- **Route:** **UP**
- **Rationale:** it is the code twin of `COMPONENTS.md`, and the research shaped it independently: list
  only what an agent can't infer from the code; point at a live helper, never a pasted snippet; say why
  the wrong thing is attractive (R5's fit vote). The *Not* column is the part an overview lacks — and an
  overview is what a 2026 study found doesn't help.
- **If UP:** the map slot in the founder's seed (A2, A4), authored at MVP; the reuse check reads it (A5).
  **Claim limit:** no study shows a list like this improves consistency; the practice must not say it does.

## Candidate 3: name a decision at two, write the helper at three — and inline back on the tell

- **What it is:** a second copy is a note in the map; the third is the helper. When a shared helper
  grows a new parameter plus a new conditional for one caller, inline it back.
- **Where it lives now:** `docs/ENGINEERING.md` §1 principle 2; BOSS's own consolidations
  (`ui`, `frontmatter`, `config`, `args`) each happened at the third copy or later.
- **Route:** **UP**
- **Rationale:** resolves the tension R1 found between the design side (*twice is a pattern*) and the
  code field (rule of three) as two rules for two moves (R5), and adds the fifth row the design
  system's reuse table lacks (Metz's tell). Three separate *projects* stays the bar for BOSS's own UP.

## Candidate 4: forgive what a person wrote; refuse what a machine must trust

- **What it is:** a reader of human-authored files tolerates malformed input and says so; a reader about
  to overwrite machine state refuses when it can't parse. The error policy goes in the function's name.
- **Where it lives now:** `src/config.js`, `src/registry.js`, `src/frontmatter.js`; enforced by
  `test/silent-damage.test.js`.
- **Route:** **UP**, narrowed — as a guideline, stack-neutral.
- **Rationale:** it is BOSS's own form of *parse at the boundary, fail loud inside*, which R3 found in four
  separate layers of an app (data, API, config, AI calls). Founders meet it the first time an agent
  writes code that reads a config or a request.

## Candidate 5: test the contract a person touches — and a bug fix adds a test

- **What it is:** tests drive the surface a person uses; a bug fix adds a test named for the bug; only an
  intended behaviour change edits an existing test; never loosen an assertion to pass; structural and
  behavioural change in separate commits; reproduce before you fix.
- **Where it lives now:** `docs/ENGINEERING.md` §1 principle 5; 61 `REGRESSION:` tests; CLAUDE.md rule 8.
- **Route:** **UP**
- **Rationale:** BOSS's practice and three research passes agree (Google's four kinds of change; Beck's
  structure-vs-behaviour split; agents editing tests to pass). **What does not go up:** a TDD mandate —
  R4 found no support for it with agents.
- **If UP:** the testing slot in the founder's seed (A8).

## Candidate 6: a copy a boundary forces is pinned by a parity test

- **What it is:** where two surfaces can't share code (client and server, a shipped hook and the CLI),
  the copy says so in its header and a test holds the two in step.
- **Where it lives now:** `test/yaml-parity.test.js`; broken where it's missing (IDEA-136 · F2).
- **Route:** **UP**, narrowed — a guideline under candidate 3, arriving with a second surface (web and
  mobile, app and API), not at seed.

## What stays home (DOWN — facts of BOSS's own code)

- **Zero dependencies.** A choice for a tool that installs into other people's repos. The founder
  version is narrower and comes from R3, not from here: *adding a dependency is a decision* — confirm
  an agent-named package exists, commit the lockfile.
- **`BOSS_HOME`, the hook lib below `src/`, plan-then-`--apply`, atomic writes with a lock.** CLI and
  concurrent-session specifics. Right for BOSS, ceremony for most apps.
- **A WHY header on every module.** BOSS's voice, not a founder default. What generalises is narrower:
  *a rule carries its reason* (Google's software engineering book, ch. 8) — which candidate 1 already
  puts beside every rule.
- **The empty parts (planting moment, write-time checks, drift reader).** BOSS's code holds without
  them; a founder's agent-written code is the case they exist for. The A track fills them for founders
  — that is new work, not an extraction.

## Not yet

- **The import-cycle rule as a check.** It's W in BOSS and already broken (F1). It earns a check only
  through principle 4 — a bug that reached a user — not because a rule exists.
