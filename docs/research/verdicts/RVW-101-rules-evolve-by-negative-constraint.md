---
id: RVW-101
type: verdict
owner: pm
status: recorded
created: 2026-09-12
verdict: ADAPT
route: UP library/practices/context-discipline.md (a citation on an existing line; no new rule)
---

# RVW-101 — "rule files grow by negative constraint after an AI error; repos hold formatting rules while devs want architecture" (Cai et al.)

## The claim
- **Source:** Cai, Li, Liang, Li, Shahin — *Rule Taxonomy and Evolution in AI IDEs: A Mining and Survey Study*,
  arXiv 2606.12231, submitted 2026-06-10, *"submitted to a Journal"*, not yet reviewed, no funding/COI
  statement. https://arxiv.org/abs/2606.12231 — fetched; every number panel-verified.
- **Core assertion:** 83 projects, 7,310 rules, 1,540 evolution events, 99 practitioners. (1) 77.78% modify
  rules *"primarily to correct AI errors, typically by adding new negative constraints"*; (2) practitioners
  rank architectural constraints highest, yet repo rule files are mostly low-level workflow and formatting;
  (3) compliance rose 49.14% → 72.13% after rule updates — **before/after on 160 artifacts, no control.**
- **Inbox file:** `docs/research/inbox/rules-evolve-by-negative-constraint-cai-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. A rule of "every correction becomes a negative constraint" would, in practice, fight #2 — CLAUDE.md compliance drops past ~200 lines (context-discipline move #1) — so the *naive* adoption is refused. |
| 2 | Evidence grade | **Pattern-with-data, preprint.** Mining numbers are solid; the survey is n=99 self-report; the compliance lift is uncontrolled. Enough to *corroborate* a line BOSS holds, not enough to *author* a new one. |
| 3 | Duplicate or sharpen? | **Corroborates.** Finding (2) is `context-discipline.md` move #1 in the paper's own data — *"only what would genuinely surprise an experienced dev … against-default architecture decisions."* Finding (1) is what BOSS's auto-memory `feedback` type and `/practice` already do, aimed at the person rather than the rule file. Nothing in BOSS says how rule files *evolve*, and the panel confirmed that gap — but the paper's evidence for a *rule* about evolution is the uncontrolled half. |
| 4 | Who serves / harms? | Serves every cohort as a citation; the evolution rule, adopted literally, harms `first-product` (an accreting deny-list they did not write and cannot prune). |
| 5 | Cost / ceremony | A citation is free. A "rule-evolution" section is a new discipline on a preprint — heavier than the evidence supports. |

## Verdict: ADAPT
Take the half that corroborates, refuse the half that would legislate. Add the paper as `[EVIDENCE]` on the
existing architecture-over-formatting line in `context-discipline.md`, with the caveat that the compliance
figure is before/after. Do **not** add a rule-evolution section; the observation *"rules grow from
corrections"* is worth one clause on that same line, phrased as what the population does, not as what a
founder should do.

## If ADOPT / ADAPT
- **What to do** → hand to `/boss-learn` UP: one citation + one clause on `context-discipline.md` move #1;
  `library/sources.json` row with the arXiv URL. **Freshness clock does not move** (a citation is not a
  sweep — the v0.150.0 rule). The next real context-discipline sweep still owns 2026-12-07.
- **If ADAPT:** modified from the claim by dropping the prescriptive reading (add negative constraints on
  every error) and the uncontrolled number as a headline; kept as corroboration and as a population fact.

## Attribution
**Verified** — authors, all counts, the 77.78% and 49.14→72.13% figures, and the absence of a control, by
two skeptics against the paper. Preprint status confirmed.

## Notes
- Prior related verdicts: none on rule evolution; `context-discipline.md` carries the 2026-08-11 Anthropic
  corroboration on the same line, so this becomes the second independent source for it.
- Found by the arXiv cs.SE tap added to domain 1 on 2026-09-08 — first sweep, first hit.
- BOSS version when recorded: 0.314.0
