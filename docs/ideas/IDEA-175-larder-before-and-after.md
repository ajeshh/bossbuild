---
id: IDEA-175
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-007
proof: none
proof_note: done is the essay's Tuesday replayed on both halves of Larder by a fresh agent, several runs each, with the differences measured and written down
relates: IDEA-169, IDEA-176
gist: Larder, the made-up pantry app from the essay, built small and twice — once "by the book", once in Pakka — so the language is tried, measured and changed on something we control before any live app or BOSS itself.
---

# IDEA-175 — Larder, before and after

Ajesh, 2026-10-08: *"for prog-007 before we dog food, we should create an idea, for this app we
reference, and build out an app that is short n sweet, and lives inside.. and show a before and after
pakka. that way we can learn and iterate on it, before we try it with a live app, and then we
eventually bring it in to boss."*

## What it is

Larder is the household pantry and meal-planning app the essay invents: **Pantry, Recipes, Meal plan,
Shopping list**. Short and sweet: four features, one command to run, small enough to read in a sitting.
It is built twice from the same stories:

| | Before: by the book | After: pakka |
|---|---|---|
| Stories | a PRD and user stories | the same, with `&keeps` lines for what must hold |
| Docs | a wiki page per feature, a rules file for the agent, generated summaries | the same docs, each tied by `&about` / `&from` to what it describes |
| Code | features calling each other freely | `&belongs` tags, a types-only contract per feature, `&relies` where one feature leans on another |
| Tests | written after the code | written from the promises, `&proves`, each proven by a planted break |
| What an agent reads | the wiki and the code | the index, the card at the crossing, the code for depth |

The prologue's promise is in both: *marking an item used never deletes it.*

## Why it comes first

- **Learn on something we control.** Every rule in PROG-007 is still a proposal. Larder lets the
  language change shape cheaply, before a live app (dhun, a founder's project) and before BOSS's own
  code, where a bad word costs more to take back.
- **It turns the essay's two scenes into runs.** The prologue (the agent breaks the promise) and the
  epilogue (the same Tuesday, with the guardrails) become something anyone can replay and check.
- **It is IDEA-169's testbed.** T1 (the four context routes) and T3 (promises prove their tests) run
  here first, not in a throwaway branch of a live app.

## How "before" gets its months of drift

A fresh "before" has no rot to show. Its history is generated, the way the Kettlewick demo generates
its commits from its records' dates: renames land in the code while the wiki keeps the old names; a
rule changes and the rules file doesn't; a summary is regenerated once and then left. The drift is
scripted, so every replay starts from the same state.

## The replay

The Tuesday request, on both halves: *"when a recipe goes on the meal plan, add any missing
ingredients to the shopping list."* A fresh agent, several runs per half. Measured: files read,
tokens, whether *never deletes* broke, whether a planted break was caught, and, after an edit to the
spec, which links lit up and whether anything else did.

## Open questions

- **Stack.** The smallest that runs anywhere with one command and no install step? Its choice should
  not make Pakka look language-specific; the "after" half may need a second language for one feature to
  show that `&` lines live anywhere.
- **Which agents run the replay.** More than one kind, so the result isn't one model's habit (IDEA-176's
  "any agent" claim depends on it).
- **Where it lives.** Inside Pakka's public home (IDEA-176) as its example, with a pointer from BOSS.

## Tasks

- [ ] **L1 — Larder, minimal.** Four features, the stories, one command to run.
- [ ] **L2 — The "before" half,** with its docs and a scripted history of drift.
- [ ] **L3 — The "after" half in Pakka.** Note every word that felt wrong while writing it; those
  notes feed PROG-007's dictionary (E3).
- [ ] **L4 — Replay the Tuesday** on both halves, several runs, more than one kind of agent. This is
  IDEA-169 T1 and T3, run here.
- [ ] **L5 — Write down what changed,** in the language and in the essay, before anything moves into a
  live app or BOSS.
