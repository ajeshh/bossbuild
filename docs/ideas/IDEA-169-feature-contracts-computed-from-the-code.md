---
id: IDEA-169
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
proof: none
proof_note: done is a fresh agent building a cross-feature change better with a feature's generated card than without it (T1)
relates: IDEA-154, IDEA-158, IDEA-163
gist: Each named feature gets a short contract the rest of the app reads instead of its code, and the contract is computed from the code (types, tags, comments), so it can't quietly go stale the way a wiki does.
---

# IDEA-169 — Feature contracts, computed from the code

Ajesh, 2026-10-08: *"as an app gets more complex, things start to get named, feature concepts and write
ups become essential, its like an internal wiki of all the key features… as different features try to
talk to different features, they dont need to investigate every line of code to learn about it. its
just enough for it to start building. the question is really how can they quickly get it, and then
start building / validating as the concept grows. so its just in time context?"* Then, on where the
write-up lives: *"is there a smart engineering trick of keeping the comments in another file, still
computable but also not in the execution pathway?"*

## What a large app's wiki does (dhun, measured 2026-10-08)

dhun was the reference, not the target. It already has the wiki, and the wiki is where it fails:

- **The feature docs outgrew the code.** 427 files, ~12 MB under `docs/features` for 32 features, about
  3× the frontend source. One feature alone: 62 files, 1.2 MB, a 47 KB README.
- **They are build docs, not contracts.** Research, phases, architecture v1 and v2, kickoffs: the story
  of how a feature was made. A second feature that needs to call it has no short "how to use me."
- **Freshness fell through.** Most READMEs were last touched in late May; the code moved on (one
  feature: 17 commits to 41 files since). 19 of 32 READMEs name no code path at all, so nothing could
  tell them they had drifted; of the 13 that do, 9 name a path that no longer exists.
- **The code is organized by layer** (`components/`, `stores/`, `hooks/`, `lib/`), so a feature has no
  single folder a doc could sit next to.

What failed is the design, not the discipline: a doc held fresh by memory alone goes stale.

## The shape

Three layers. People write only the meaning; the rest is computed.

1. **Tag the code, not the doc.** A header tag (`/** @feature crates */`) on each file that belongs to a
   feature. A script collects a feature's files from its tags. A moved or renamed file carries its tag,
   so a contract can't name a dead path.
2. **The contract is a types-only file.** The feature's public surface as an interface, with the
   meaning in doc comments on it: what it is for, what it guarantees, what it must never do. The code
   declares `satisfies <Contract>`, so the compiler fails the build when the two disagree. Comments and
   types are erased before anything runs, so none of it is on the execution path. Same parts elsewhere:
   a Rust trait plus `///`, a Python `Protocol` plus docstrings.
3. **The card is generated.** A script renders each feature's card (about one page, ~500 tokens) and a
   one-line-per-feature index from (1) and (2). The index is always within reach, so the whole app's
   map fits in one read; the card loads when an agent touches the feature; the code is searched for
   depth. Nobody edits the card.

What's left to go stale is the plain-language lines. Each can name the test that proves it, the way
the engineering file's E/P/W marks (a check fails · something catches some of it · written only) do.

Also part of the shape:

- **Build docs stay, as history.** Dated, labelled, allowed to age. Only the contract has to be true
  today.
- **A contract is born when a second feature first calls the feature,** never up front. It can start as
  a promise and harden as the code arrives.

## Why this isn't the wiki BOSS already declined

- **Context files mostly don't help** (IDEA-154 T2): no gain in task success, ~20% more cost,
  machine-written prose slightly negative. They help only for what a model wouldn't do anyway. A
  contract is exactly that: facts about this app no model can guess.
- **A knowledge graph over the docs was declined** (2026-08-20) as a second source of truth that goes
  stale while looking authoritative. Here the source of truth is the code; the card is a rendering.

## What BOSS already has

The FEAT record (intent, before the build) · the engineering file, path-scoped and loaded on demand,
with its "imports point one way… through that feature's public entry" rule and its *Find this before
you write one* table · the E/P/W marks.

## Open questions

- **Which altitude first:** what BOSS ships a founder (their app's features), or BOSS's own code
  (commands, hooks, the conscience)?
- Does a card earn its place over plain search at all? T1 decides; if search wins, there is nothing to
  build.
- Where it lands in BOSS without adding a skill: a section of the engineering file, a line in `/spec`
  ("who calls this?"), a renderer in the CLI?
- Is the "card is stale" reading a line on `boss board`, a question before `land`, or both? A nudge,
  not a gate, until a bug reaches a user.

## Tasks

- [ ] **T1 — One feature, by hand, in a throwaway dhun branch.** Tag one feature's files, write its
  contract file, render its card by hand. Give a fresh agent a change that crosses into that feature,
  with and without the card; compare files read, tokens, and whether it broke the feature.
