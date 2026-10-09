---
id: IDEA-176
type: idea
kind: capability
owner: product-lead
status: seedling
created: 2026-10-08
program: PROG-007
proof: none
proof_note: done is a public home a stranger can land on, read the README, and apply Pakka with whatever coding agent they use — tested with more than one kind of agent
relates: IDEA-175, IDEA-169, IDEA-138
gist: Pakka as its own public thing inside BOSS's GitHub: a README, docs, the Larder example, Pakka shown in every kind of doc (PRD, marketing, design, engineering), and short instructions any AI agent can follow.
---

# IDEA-176 — Pakka's public home

Ajesh, 2026-10-08: *"while we build it, we should also build it like its own thing, its both in boss
but can be seperate, maybe its own git page that is public, and then it should have the example but
also example of different docs, prd, marketing, design, eng, and how its being used. maybe it also has
agentic instructions also on how to have your app (make it open for any type of AI agent… it should be
universal), where any agentic development can easily apply the principles. The page lives inside
boss's own github but as a public offering. and have a full readme, and documentation and such."*

This is PROG-007 § Direction's *separable by design* made concrete.

## What it holds

1. **A README** that lands a stranger: what Pakka is in one line, the aha, one promise followed from
   story to test, and how to try it on one feature this afternoon and strip it tomorrow.
2. **Documentation:** the language reference (PROG-007 E3 moves here), the values and principles, and
   later the how-to page with many examples (E4).
3. **The Larder example** (IDEA-175), before and after, runnable.
4. **Pakka in every kind of doc**, one per sense and beyond:
   - a **PRD** whose acceptance criteria and must-not-break paths carry `&keeps` lines
   - a **design** note and a component description with `&shows` (what a person must see)
   - **engineering:** contracts, `&belongs`, `&proves`, `&relies` across more than one language
   - **marketing:** a landing-page claim tied to the promise behind it, so marketing can't claim what
     isn't pakka (kin to BOSS's claims ecosystem, IDEA-138)
   - **research:** a finding with `&cites` and its snapshot
5. **Instructions any AI agent can follow.** Plain Markdown, no tool-specific format required: a short
   file in the cross-tool agent-instructions convention, plus a prompt anyone can paste into any chat
   assistant or coding agent. They teach the language and its rules (carry `&` lines from the story
   into the code, write tests from promises never from the code, never edit a promise or test to get
   green, say when a promise conflicts), not a codebase overview. Kept short: agents follow what's
   written whether or not it helps (PROG-007 § Testing).

## Shape

- **Zero-dependency,** like BOSS's CLI: the checker, the card renderer and `strip` run on a bare
  runtime.
- **BOSS → project flows one way** (DEC-016). BOSS uses Pakka the way any project would; Pakka doesn't
  depend on BOSS's records to mean anything.
- **Public means fine public forever.** No real people's words, no vendor or rival names in its text,
  examples fictional (Larder).

## Gates

- **The name is cleared first** (PROG-007 E5): a trademark search before the home is public.
- **Publishing is Ajesh's** (npm, the repo going public), as with BOSS.

## Open questions

- **Its own repo, or a folder in bossbuild published as its own site?** Ajesh: *"inside boss's own
  github but as a public offering."* A folder is cheaper to start and keeps one history; a repo is what
  "its own thing" looks like to a stranger and to anyone who wants only this part. A folder shaped to
  lift out may be both.
- **How BOSS takes it back in.** BOSS's CLI is zero-dependency, so a package dependency is out:
  vendored, or BOSS's own records simply written in Pakka?
- **Licence.**
- **"Any agent" needs proof:** which agents the instructions are tested with, and what counts as passing.

## Tasks

- [ ] **H1 — Decide the home** (repo or folder). Ajesh's call.
- [ ] **H2 — README and docs skeleton,** the reference moved in (E3).
- [ ] **H3 — The example docs,** one per kind above, all about Larder.
- [ ] **H4 — The agent instructions,** then tried with more than one kind of agent on Larder (IDEA-175 L4).
- [ ] **H5 — The how-to page** (E4), once the language has settled through Larder.
