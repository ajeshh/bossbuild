---
id: PROG-007
type: program
owner: Ajesh
status: active
created: 2026-10-08
graduated_from: IDEA-169
gist: How an agent comes to know what it needs, and how that knowing stays true — context woven from its sources (code, records, outside pages) and never kept as a hand-made copy; every link says what it was last confirmed against; context reaches the agent by the strongest route that works, preloading last.
---

# PROG-007 — Context

**Graduated 2026-10-08**, straight from IDEA-169's general form. Ajesh: *"i feel like the context work
we did earlier, memory features, and this should maybe live in a program focused on 'Context' and its
all about how we help weaving and interconnecting everything right?"* — then *"context ecosystem?"* —
then, after the weighing below, *"Yes lets grad to program."*

**Members:** every record with `program: PROG-007` — `boss board PROG-007`.

| Member | What it is |
|---|---|
| IDEA-169 | Feature contracts computed from the code, and the general form: links that record what they were confirmed against |
| IDEA-154 | Its open T2: subtract what's always loaded |

**Lineage — shipped, not moved:** IDEA-020/FEAT-020 (JIT working context with a lifecycle) · IDEA-078
(compaction is the unit) · IDEA-080 (durable memory ships as a pointer — answered no) · IDEA-085 (the
description budget) · IDEA-094 (the session interior) · IDEA-102 (RESUME's window) · IDEA-153 (context
that survives the session) · IDEA-158 (one home per fact) · IDEA-162 (resume computed from the records).
`registry/flows.json` (PROG-002, C2) is the path-level seed of the link check.

## What ties them

**In one line** (Ajesh, 2026-10-08, sharpened): *code gets a second language — signals in comments
and types that tools and agents read and the running program never sees.* Not secret: written in plain
sight, never executed. Its words so far: `@feature` tags (where a file belongs), contract types (what
is promised), promise lines (what it must never do), links stamped with what they were confirmed
against.

**Context is woven from its sources, never a copy kept by hand.** Every member is one consequence:

- **One home per fact** (IDEA-158): a fact in two places drifts.
- **Views are computed** (IDEA-162, IDEA-169's cards): RESUME, the board, a feature's card are readings,
  never edited.
- **Every link says what it was last confirmed against** (IDEA-169): a version of the target's meaning,
  so a change to the target is an event the doc hears about, not a date it waits for.

A dhun measurement (IDEA-169) shows what happens without this: a wiki three times the size of the code,
mostly unchanged since May, 9 of its 13 code references dead. Nobody was careless; nothing could tell.

## Testing: promises, not lines

Ajesh, 2026-10-08: *"how can this improve how testing happens… changing fundamental the weakness of
letting AI write your tests or badly written or under written tests?"*

The weakness: tests written from the code pass with the code's bugs; agents under pressure special-case
or edit tests (about half the time when tests contradicted the spec, in one measured setting); line
coverage hides it (one suite: 100% coverage, 4% mutation score). IDEA-154 T1 and T4 already put the
seeds in BOSS: a sanctioned stop when a test and the FEAT disagree, and each criterion naming its test.
The second language carries them further:

1. **Tests are written from promises, not from code.** The writer, person or agent, reads the promise
   line in the contract, never the implementation.
2. **Promise coverage over line coverage.** Every promise names its test or reads *unchecked*.
3. **A test counts only if breaking its promise breaks it.** Confirmation for a test link is a planted
   break of the promise (a mutation) that makes the test fail.
4. **A change on either side is an event.** The test↔promise link is stamped like any other: the
   promise moves → the test is flagged; the test moves (an assertion loosened) → flagged, and a person
   who didn't loosen it re-confirms.
5. **A feature that relies on a promise owns a test of it,** run in the providing feature's suite
   (consumer-driven contracts).

Gap on record: no study measures mutation testing against agents weakening their own tests.

### Does AI + TDD work? (research 2026-10-08)

Ajesh, who worked in a TDD environment: *"this is bringing more of TDD and BDD but in a way that works
in AI… does AI and TDD work, and this proves it can?"* Full reports, names and links:
`docs/research/sessions/SESSION-2026-10-08-tdd-with-agents.md` (local).

**The answer the evidence gives:** TDD as a ritual the agent performs — no. TDD's guarantees built into
what the agent can and can't touch — yes, piece by piece.

- **Agent-run TDD showed no gain.** A practitioner trial found no quality or mutation-score advantage,
  3–8.5× the tokens, and agents faking the red step; its author stopped asking agents to test first.
  On a large benchmark, prompting agents for more of their own tests didn't change solve rates (Chen et
  al., 2026).
- **Tests the model didn't write do help.** Human-written tests in the prompt raised pass rates, more on
  small tasks than large (Mathews & Nagappan, 2024). Users approving model-proposed tests judged the
  code correctly 0.84 of the time vs 0.40 (Fakhoury, Lahiri et al., 2024).
- **Tests written from the code copy its bugs:** 14% of faults caught vs 25% when written independently
  (Konstantinou, Tambon & Papadakis, 2026).
- **A large company's production system already gates on planted breaks:** an engineer writes a
  plain-text concern, a model plants realistic faults for it, a test is kept only if it catches one;
  engineers accepted 73%. But only ~36% of the accepted tests were judged on the stated concern.
- **The arrangement here is unmeasured end to end.** No completed study isolates "a person states or
  approves, the agent writes the code." T3 would be first-hand evidence.

**What it changes in the design:**

1. **The person approves; they don't author tests.** They write one promise line and approve the
   agent's tests, the arrangement with measured support. Typing expected outputs did worse.
2. **Independence is structural, not a prompt.** The test-writing agent runs in a separate context that
   sees the promise lines and the contract, never the implementation.
3. **Promises and tests are read-only to the coding agent,** with an explicit exit: *"this promise
   conflicts with the code — a person decides."* Read-only beat hidden tests; instructions alone failed.
4. **Every planted break names the promise it breaks,** and the reviewer checks that link, not only that
   the test is strong (the 36% on-concern lesson). Breaks are plausible wrong implementations of the
   promise, not random operator flips; no-op breaks are filtered first.
5. **The red step moves from the agent's habits to the system.** Never prescribe red-green-refactor to
   an agent; the planted break is the red, done mechanically, so it can't be faked.
6. **Promises are listed one by one.** Left to find properties themselves, the best model tested 21%
   of the documented ones (Vikram et al., 2023).
7. **Show people only filtered work.** Approve tests that already catch their promise's break; raw
   candidates are noisy.

Still unexamined anywhere found: tests owned by a dependent feature, run in the providing feature's suite.

## Checks, by strength

1. **A machine checks the truth.** Compiler and tests — code only.
2. **A machine checks that the other side moved.** A meaning-hash, a commit, a re-fetch — anything with a
   version. Catches an event, not elapsed time.
3. **A person or a model checks the meaning.** Weakest, and asked only when (2) says something moved.

The rules for (2) come from the prior art (IDEA-169 § Prior art): hash the meaning, not the file;
early cutoff; confirmation belongs to the pair of contents; links are declared, inference only proposes.

## How context reaches an agent — strongest route first

*Proposed 2026-10-08, to be confirmed by IDEA-169 T1.* Answers the warning in the prior art: in the
context-file study, codebase overviews **did not help agents reach the right files sooner**. Agents
already search well. What search can't do is three things, and each has its own route:

| Route | What it solves | Example | Cost |
|---|---|---|---|
| **1. Enforce** | stops the mistake without being read | the contract as types; the build fails on a broken promise | none at read time |
| **2. Arrive at the crossing** | the rules that apply when one feature reaches into another | the agent opens or edits a file tagged `@feature crates` → crates' card arrives, once | ~500 tokens, only when crossing |
| **3. Look up on demand** | "does this already exist, under another name?" | the index as something to search (names, aliases, one line each), not something loaded | a search, when asked |
| **4. Preload** | only what is non-standard and true every session | a repo-specific rule a model wouldn't follow by itself | every turn — keep it minimal |

Two reasons for this order:

- **What isn't read can't mislead.** A preloaded line costs every turn and is followed whether it helps
  or not: the study saw agents use a tool about 1.6 times per task when a file named it, and almost never
  otherwise. A wrong preloaded line is a wrong instruction followed faithfully.
- **Each route fires on an event,** the same idea as the links: context arrives because something
  happened (a crossing, a question, a failed build), not because a session started.

## Direction (Ajesh, 2026-10-08)

*"I think of it as the next evolution of whats better than [a knowledge-graph tool]. How we build this, should be
eventually if needed spun into its own tool for other existing projects or if people only want this
part… We already do a lot of what [it] is or have learnt. so this is like taking it one LEAP
forward."*

- **One leap past knowledge-graph tools.** They infer a graph from a snapshot of the files and answer
  *"what's connected that I didn't know?"*, the best of them labelling each edge as found or guessed.
  This answers *"is what I rely on still true?"*: links declared, each confirmed against a version of
  its target, flagged when that target moves. The two compose. Inference proposes a link (rule 6 of
  IDEA-169's prior art), a person declares it, and the confirmed link becomes the record. A graph tool
  is a good source of proposals.
- **Separable by design.** Built inside BOSS first, shaped so it can leave: zero-dependency like the
  CLI, its own module boundary, and a link format that doesn't require BOSS's records to mean anything.
  A design constraint on every member, not a task yet.
- **Told as a story, with its proof.** The essay (a shared doc, internal first) tells how context is
  usually kept, what the AI-era attempts left hanging, how BOSS began and iterated, and where it goes,
  citing the research where a claim needs it. The full notes stay in the research sessions.

## Where this sits

- **Not an ecosystem (PROG-002).** Ecosystems are planted in a founder's project and connect through
  declared flows; context is what they connect *through*. When IDEA-169's tests show the founder-side
  half working, that half may plant as an ecosystem, and `flows.json` may gain versions on its takes.
- **The research engine (PROG-005)** owns how BOSS finds outside truth (`/scout`); this program owns the
  shape of the link a finding is cited by (URL, meaning-hash, snapshot). `/scout` writes it.
- **BOSS → project flows one way** (DEC-016). Nothing here reads back from a founder.

## Rules

- **Compose and subtract, never add a skill.** Each mechanism rides something that exists.
- **Declared, never inferred, as the record.** Inference may propose a link; a person declares it.
- **A nudge before a gate.** A new gate needs a bug that reached a user.
- **Measure context in size, not lines** — bytes to tokens, per mode.

## Open questions

- **Altitude first:** BOSS's own records and code, or what BOSS ships a founder? IDEA-169 T2 (BOSS's own
  records) is cheaper and comes first either way.
- **Does arriving at the crossing pay for itself?** A hook on every file read has a cost; T1 measures it
  against the other routes.
- **Is the index worth keeping at all,** once it is a search target rather than preloaded? T1's index arm.
- **Naming outside tools in the public essay.** The standing rule says tools we learn from are named by
  their shape in anything public; research papers are cited by author. Does the essay keep that rule, or
  is it the exception, since its job is to prove the approach?

## Tasks

- [ ] **E1 — The essay, told as a story.** How context is usually kept → the AI-era attempts and where
  they leave you → how BOSS began (records, one home per fact) and iterated (resume computed, the
  handoff ledger) → what this program adds → where it goes. Citations where a claim needs proof.

## Log

- **2026-10-08** — graduated from IDEA-169's general form. Prior art read the same day (three reads; full
  reports local in `docs/research/sessions/SESSION-2026-10-08-links-that-stay-true.md`). Members: IDEA-169,
  IDEA-154. Weighed as an ecosystem under PROG-002 and placed here instead (§ Where this sits). Delivery
  order proposed in answer to the overview finding; T1 decides it.
