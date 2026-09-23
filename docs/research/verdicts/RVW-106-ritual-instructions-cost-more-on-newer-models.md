---
id: RVW-106
type: verdict
owner: pm
status: recorded
created: 2026-09-23
verdict: ADAPT
route: DOWN only: the five contradictions the measurement found, fixed in the shipped template (coder, product-lead, mentor-founder, 7 MVP agents, CLAUDE.md, the MVP claude-append). No practice line, because the shelf already holds the doctrine.
sources:
  - https://claude.com/blog/what-a-task-costs-on-opus-5-5
---

# RVW-106: instructions written for an older model make a newer one do more

## The claim
- **Source:** Anthropic, *What a task costs on Opus 5.5*, claude.com/blog, 2026-09-22.
- **Core assertion:** ritual instructions (a mandatory six-step procedure, a scratchpad rule, a
  verify-twice rule, instructions that contradict each other) make Opus 5.5 write more and repeat tool
  calls. Auditing them out cut a further 9% of cost.
- **Inbox file:** `docs/research/inbox/ritual-instructions-cost-more-on-newer-models.md`

## The measurement (RVW-102's precedent: measure the surface before ruling)
The instrument, `/claude-api prompt-audit`, **did not run**: a subagent's `Skill` call was blocked by
permission rules, and the session didn't route around the block. The categories named in the post
were applied by hand to a fresh `boss new` + `boss unlock mvp` scaffold: 46 files (~7,950 lines), with
CLAUDE.md, AGENTS.md, 2 rules, 11 agents and 31 skills.

- **Verify-twice: 0. Scratchpad / think-step-by-step: 0. ALL-CAPS emphasis: 0.**
- **Rituals: 2, both soft.** AGENTS.md's *"Every idea, bug or ask becomes an `IDEA-NNN`… before code"*
  is Principle #1's capture-first, so it was kept on purpose. coder's *"must run `/smoke`"* is one gate
  per task, and smoke-guard is dormant by default, so it was kept.
- **Contradictions: 5, all verified by the session, all fixed:**
  1. After `boss unlock mvp`, CLAUDE.md said *"This project is in **Quickstart** mode"*, and so did
     `coder`, `product-lead` and `mentor-founder`. `{{MODE}}` renders the rung a file *came from*,
     while the text read it as the mode the project is *in*, so every unlock left the earlier rungs
     wrong (and L1's seven agents would say MVP at V1). The fix removes the claim rather than
     re-rendering it: `boss status` names the mode.
  2. coder called `/smoke` a *"build + type + test gate"*; the smoke skill says *"A smoke check is not a
     test suite."*
  3. coder recorded a stack choice as *"an `IDEA-NNN` note… or a spec"*; the template's own convention
     is `DEC-NNN` via `/decide`, which ships at Quickstart.
  4. MVP rule 2 (*"red is information — fix or document the regression"*) vs the git section
     (*"`/smoke` green before every commit"*). The git line now points back to rule 2.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It is Principle #2 (no premature ceremony) pointed at the prompt itself. |
| 2 | Evidence grade | **First-party measurement, vendor-graded, n=44 tickets.** Anthropic measuring its own product's cost. The direction is credible and the number is theirs. |
| 3 | Duplicate or sharpen? | **Duplicate as doctrine.** `harness-engineering.md` holds *"delete scaffolding the model outgrew"*; `skill-authoring.md` §1 holds explanatory-over-prescriptive; RVW-101 holds rules growing by negative constraint. **New only as a measurement**, and the measurement found the one named category BOSS has: contradictions. |
| 4 | Who serves / harms? | The fixes serve every cohort. A `first-product` founder whose agents say "Quickstart" after they unlocked MVP has no way to tell which is true. Nobody is harmed. |
| 5 | Cost / ceremony | **Net lighter.** Twelve always-on agent descriptions/openers each lost a phrase. Nothing was added. |

## Verdict: ADAPT
The doctrine is already on the shelf, so no practice line was added. The claim earned its place as a
**measurement**: running its categories over the MVP surface found BOSS free of the rituals it names
and carrying five contradictions, one of which (the frozen mode) rots again at every unlock. All five
are fixed in the template.

## Re-open condition
Run the real `/claude-api prompt-audit` on the scaffold once the `claude-api` skill is allowed. Its
checklist may name categories the hand pass did not. If it finds rituals the hand pass missed, re-open
this verdict.

## Attribution
**Verified.** All three quotes were read from the saved page (2026-09-23). The 9% figure is *"a
further 9%"* on top of the model change, not 9% on its own.

## Notes
- Prior related: RVW-101 (negative-constraint growth), RVW-102 (measure the surface first).
- Not counted, noted: change-history prose inside the always-loaded CLAUDE.md block and the canvas
  skill (*"This paragraph used to claim…"*). That is the bookkeeping-in-the-brief shape
  `checkShippedText` guards for ids and versions, not for prose.
- BOSS version when recorded: 0.326.0 (+ Unreleased).
