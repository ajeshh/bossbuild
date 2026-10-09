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
gist: Each named feature gets a short contract the rest of the app reads instead of its code, computed from the code so it can't quietly go stale; in general, every doc's link records the version of what it was last confirmed against, so any doc (PRD, research, design) flags when the thing under it moves.
program: PROG-007
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

## The general form: every link records what it was last confirmed against

Ajesh, 2026-10-08: *"does this approach… work for markdown docs, design docs, prototypes and anything
else. im wondering if we are uncovering something really big in a way to link it all. including not
code itself… Im thinking PRDs, competition research, anything"*

Contracts are one case. In general, a doc that makes claims about something else records two things
per link: **what it's about**, and **the version of that thing it was last confirmed against** (a
commit, a hash, a content fingerprint). When the other side changes, the doc reads *unconfirmed* until
someone checks it again.

| Doc | Depends on | What the link records | Flags when |
|---|---|---|---|
| PRD | the features it specs; the evidence behind it | each feature's contract version; each EVID | a promise changes, or its evidence is graded down |
| Competition research | a rival's pricing or docs page | URL + content hash at read time | the page changes (re-fetch, compare) |
| Design doc | tokens, components, a design file | the token file's version; component names | a token or component it names changes or goes |
| Prototype | the IDEA it tests | the IDEA's version | the idea is re-shaped: it may be testing an old question |
| Code card | the code | tags + contract types | the compiler fails |

Three strengths of check, strongest first:

1. **A machine checks the truth.** Compiler and tests; code only.
2. **A machine checks that the other side moved.** A hash, a commit, a re-fetch; anything with a
   version. This catches an event, not just elapsed time.
3. **A person or a model checks the meaning.** "Does this PRD still say what we want?" Weakest, but now
   asked only when something actually changed.

**What keeps it quiet: link to contracts, not raw files.** A PRD pinned to crates' whole source flags on
every typo fix; pinned to crates' contract, it flags only when a promise changes. The contracts above
are what make the general form livable.

**Where BOSS stands.** Its records already declare their links (IDs, `relates:`, sources) and its views
are computed (IDEA-162). What's missing is the version on the link: staleness today is a date
(`review_by:`, `curve:`), and `scripts/check-freshness.js` states its own limit — *"cadence catches
slow rot. It cannot catch an EVENT."* A confirmed-against version on each link is that missing half.

**Not a knowledge graph** (declined 2026-08-20): no inferred edges, only declared ones, each with a
check. **Not a skill:** the check rides links that already exist.

## Prior art (T0, 2026-10-08)

Three reads at source; the full reports, tables and every URL are in
`docs/research/sessions/SESSION-2026-10-08-links-that-stay-true.md` (local). What they change:

**Where this stands in the field.** Personal note and wiki tools keep a link
*resolving* through renames, or transclude the target live, or expire trust on a timer; none detects
that a target's *meaning* changed. The open structured-knowledge base comes closest: each reference records a retrieved date and
an archive snapshot. Requirements tools have done it for decades as "suspect links", and the newest of
them keys a link's validity on *the contents of both ends*, not on an edit date. So the idea isn't new
in kind. What's new is putting it in a solo founder's git repo, across code, docs and outside sources,
lightly enough to live with.

**Design rules the prior art hands us:**

1. **Pin to a hash of the meaning, not the file, the commit or a date.** Hash the targeted section or
   the contract, normalized (whitespace, formatting and names out, as a content-addressed language does), so a typo fix
   doesn't move it. File modification time is the wrong signal everywhere it was tried.
2. **Early cutoff.** From build systems: when a target is re-checked and its meaning-hash is unchanged,
   nothing downstream goes unconfirmed. Without it, one edit spreads through every linked doc.
3. **Confirmation belongs to the pair of contents** (the newest requirements tool; consumer-driven contract testing). A revert or a branch
   with the same content inherits "confirmed" for free.
4. **Each kind of link declares which fields count, and its direction.** Every requirements tool ended
   up here; one needed a plug-in to get there, which says the default was too noisy. Default: contract
   fields only.
5. **Fix mechanical changes, flag meaningful ones.** Renames and moves are repaired automatically (docs-coupled-to-code tools,
   note tools); the rest is classified, breaking vs informational (API spec diff tools). A new dependency starts
   *pending*, not red (contract testing). No one-click "clear all", which teaches clearing without looking.
6. **Declared links are the record; inference only proposes.** Without enforcement about 60% of commits
   carry their link (Rath et al.); model-inferred requirement-to-code links score F1 ≈0.25–0.55 (Fuchß et al., ICSE 2025).
   An inferred link can be suggested, never stored as fact. A dangling link fails loud.
7. **Computed views are read-only; the confirmation is the one written field,** with who and when.
8. **Outside sources keep a snapshot.** URL, content hash and what was read, so a changed page can be
   compared, not just re-dated. The largest online encyclopedia puts a link's median lifespan at about a year.

**What the research says about the cards themselves:**

- **Signatures beat whole files.** A skeleton (signatures, fields, module comments) found the right
  code more often than full files, at about a seventh of the cost (Xia et al., 2024). Supports the contract
  written as types.
- **More context can hurt.** Expanding a code graph to ~10.5k tokens *lowered* success (Ouyang et al., ICLR 2025).
  Supports the ~500-token cap.
- **⚠ Codebase overviews did not help agents reach the right files sooner** (Gloaguen et al., 2026). The
  always-loaded one-line index is the piece most at risk. T1 tests it separately from the cards.
- **Drift is cheap to catch on names.** 28.9% of the top-1000 GitHub projects had docs naming a code
  identifier that no longer existed (Tan, Wagner & Treude), found with plain identifier matching, no model.
- **No published study** compares typed module contracts with full-code retrieval for cross-module
  work. T1 would be first-hand evidence.

## Why this isn't the wiki BOSS already declined

- **Context files mostly don't help** (Gloaguen et al., arXiv 2602.11988, verified at source in T0): no
  gain in task success, ~20% more cost, machine-written slightly negative (not significant). The
  authors recommend keeping only minimal, repo-specific requirements, but show no success gain even for
  those. A contract is repo-specific facts no model can guess; whether that helps is T1's to show.
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
- What does a link record as its version, per kind of target: a git blob hash, a contract hash, an
  EVID's grade, a page's content hash? And what counts as "the same" (whitespace, reordering)?
- Who clears an *unconfirmed* mark, and what does clearing write: a new version, a date, who checked?
- Does the general form split into its own IDEA once the research is in?

## Tasks

- [x] **T0 — Prior art before design.** Done 2026-10-08 → § Prior art. Ajesh: *"if we need to investigate other research to help us
  design this before we implement it lets do it."* Three reads, sources opened at source: note tools
  (links, backlinks, rename-updates and computed views; block references; verified pages); engineering traceability (requirements tools' "suspect links", docs-coupled-to-code
  tools, contract tests, content-addressed pinning); the research on doc drift, traceability recovery,
  context files and generated repo maps for agents. Findings land here before any design.
- [ ] **T2 — The general form on BOSS's own records.** Add a confirmed-against version to the links of
  one program's records, change a record one of them depends on, and see that the right record is
  flagged and nothing else.
- [ ] **T3 — A promise proves its test.** On T1's feature: draft its promise lines from its spec (acceptance criteria and the
  paths that must not break), approve the high-stakes ones, have an agent in a separate context write tests from the promise lines alone (never the code), plant a break of each
  promise (a plausible wrong implementation, naming the promise it breaks) and count which tests fail.
  Compare against tests an agent writes after seeing the code. Then, with tests read-only to the coding
  agent, let an agent try to loosen one assertion and check the test↔promise link flags it. PROG-007
  § Testing, *Does AI + TDD work?*

- [ ] **T1 — One feature, by hand, in a throwaway dhun branch.** *Runs on Larder first (IDEA-175 L4); a live app only after.* Tag one feature's files, write its
  contract file, render its card by hand. Give a fresh agent a change that crosses into that feature,
  and run it once per route from PROG-007 § How context reaches an agent: (a) nothing, search only;
  (b) the index preloaded; (c) the card arriving when the agent first opens a tagged file; (d) the
  contract types alone, the compiler as the only guide. Compare files read, tokens, and whether it broke
  the feature. Several runs per arm; one run is an anecdote.
- [ ] **Found while researching — IDEA-154 T2 overstates the context-file paper.** It says *"files help
  for non-standard practices"*; the paper (v3) recommends minimal requirements but shows no success gain
  for them, and reports developer-written +2.4% (not significant; v1 said +4%). Correct it in IDEA-154.
