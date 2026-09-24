---
id: RVW-110
type: verdict
owner: pm
status: recorded
created: 2026-09-24
verdict: ADAPT
route: DOWN stages/L1-mvp/template/.claude/hooks/component-reuse-guard.js
sources:
  - https://www.reddit.com/r/DesignSystems/comments/1woulkg/why_ai_prototypes_dont_match_your_design_system/ (read via the thread's RSS feed, 2026-09-24)
  - https://medium.com/@amnkhtri9/why-ai-prototypes-dont-match-your-design-system-f8b747c4fc07 (403 to fetch; full text pasted by Ajesh 2026-09-24)
---

# RVW-110 — a design system is a retrieval surface: AI can't reuse what it can't find by name

## The claim
- **Source:** Aman Khatri (product designer), r/DesignSystems and Medium.
- **Core assertion:** AI tools invent components that already exist because retrieval fails, not
  because the prompt does. The real "Badge" was named `Tag / Status / Default` and buried among 19
  hits, only 3 of them described. Canonical names, descriptions with **search synonyms**, deprecated
  and scratch items kept out of the index, and a code mapping took 10 prompts from 0/10 to 10/10
  correct matches.
- **Inbox file:** none.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **n=1 practitioner experiment, 10 prompts, one library, self-caveated** ("directional to this setup rather than a controlled study"). The mechanism the article narrates (embedding search, a similarity threshold, "lost in the middle") is **asserted, not shown**. The enterprise cost extrapolation is untested arithmetic. The direction matches RVW-078's paper, and in this session it **reproduced on BOSS's own code** (below), which counts for more than the numbers. |
| 3 | Duplicate or sharpen? | **Mostly duplicate, with one real sharpening.** BOSS already ships retrieval-over-recall (RVW-078, `COMPONENTS.md`, `manifest.json`), a Status column so deprecated rows get read, `/design-library` generating the index from code, and the "genuinely new" answer (u/vchub402's "no existing component" case). **The gap:** `component-reuse-guard` matches a new component against the index *by name only*. |
| 4 | Who serves / harms? | Serves every UI-building cohort, with no one harmed. The fix sits inside an existing hook's existing message. |
| 5 | Cost / ceremony | Neutral: no new field, no new file, no new moment. |

## Verdict: ADAPT
The article's own failure, a synonym hiding the canonical component, **reproduces in BOSS's shipped
guard**. The hook scores index rows by shared words *in the name*, and when nothing shares a word
it lists the first five rows in file order. The `What it's for` column, which is the description
the article says to write, is displayed but never scored. Take the mechanism and leave the Figma
and Code Connect half (RVW-082: seam, not vendor).

**Reproduction (2026-09-24, throwaway project, 7-row index):** `Tag`'s purpose reads *"status badge /
pill: priority, state, counts"*, and it is row 7. Writing `components/Badge.tsx` makes the guard
list Button, Card, Modal, Input and Avatar, and not `Tag`. `StatusBadge.tsx` gives the same result.
The one row it needed to show is the one it leaves out.

## If ADOPT / ADAPT
- **What to do (DOWN):** in `component-reuse-guard.js`, score each row on name words **and**
  purpose words, with a name match weighted higher, so `Badge` surfaces `Tag` through "status
  badge". Add a test in `test/component-reuse-guard.test.js` using the repro above; it must fail on
  today's code first (rule 8). Then one line in `design-system.md` and the component-index template:
  *write the words someone would search for into "What it's for"*, which is the synonym advice with
  no new column.
- **What's modified from the original:** no aliases field, no Code Connect, no vector index. The
  purpose column BOSS already asks for becomes part of what gets searched.
- **Not built:** u/vchub402's labelled retrieval test (score retrieval apart from generation, with
  "no component" as a valid answer). It is sound, but it is eval work for a V1 `manifest.json`.
  Re-open if `/design-library` gains a search.

## Attribution
Partly verified. The author, experiment and numbers are the author's own and self-caveated. The
mechanism explanation (retrieval thresholds inside the tool) is the author's inference and does
not verify. The failure itself was independently reproduced here, in a different system.

## Notes
- Prior related verdicts: RVW-078 (retrieval beats instruction), RVW-081, RVW-082.
- u/minmidmax's "write deterministic tools that compose to your rules" is the guard itself; that
  point is already shipped.
- Outcome (2026-09-24, Ajesh: "learn and weave into us"): landed DOWN. The guard scores name and job; test written failing first; the template and `design-system.md` got one line each; CHANGELOG `## Unreleased`.
- BOSS version when recorded: 0.327.0
