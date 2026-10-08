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

**Context is woven from its sources, never a copy kept by hand.** Every member is one consequence:

- **One home per fact** (IDEA-158): a fact in two places drifts.
- **Views are computed** (IDEA-162, IDEA-169's cards): RESUME, the board, a feature's card are readings,
  never edited.
- **Every link says what it was last confirmed against** (IDEA-169): a version of the target's meaning,
  so a change to the target is an event the doc hears about, not a date it waits for.

A dhun measurement (IDEA-169) shows what happens without this: a wiki three times the size of the code,
mostly unchanged since May, 9 of its 13 code references dead. Nobody was careless; nothing could tell.

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
  reports local in `docs/research/SESSION-2026-10-08-links-that-stay-true.md`). Members: IDEA-169,
  IDEA-154. Weighed as an ecosystem under PROG-002 and placed here instead (§ Where this sits). Delivery
  order proposed in answer to the overview finding; T1 decides it.
