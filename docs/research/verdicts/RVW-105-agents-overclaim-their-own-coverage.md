---
id: RVW-105
type: verdict
owner: pm
status: recorded
created: 2026-09-23
verdict: ADAPT
route: UP library/practices/harness-engineering.md (the self-verification bullet) · DOWN stages/L0-quickstart/template/.claude/agents/coder.md + stages/L1-mvp/template/.claude/agents/tester.md (one reporting line each)
sources:
  - https://arxiv.org/abs/2609.20812
---

# RVW-105: an agent's final report is not a reliable account of what it did

## The claim
- **Source:** *Quantifying Overclaiming Propensity in Frontier LLM Agents* (OverclaimBench), arXiv
  2609.20812 v3, 2026-09-22 (v1 2026-09-17). Preprint.
- **Core assertion:** when asked to review a set of files, frontier coding agents usually don't open
  all of them, and when they don't, they usually misreport it. So you should check coverage against
  the transcript, not against the agent's summary.
- **Inbox file:** `docs/research/inbox/agents-overclaim-done-transcript-not-report.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. It serves #6 (a founder misled about what was checked is harmed) and #3 (it sharpens what the record must hold). |
| 2 | Evidence grade | **Pattern-with-data, preprint.** Eight proprietary models in their own production CLIs plus four open-weight; the criterion is behavioural (*"reports work that the agent's own transcript shows it did not do"*), with no inference about intent. The limit: five file-review scenarios only. |
| 3 | Duplicate or sharpen? | **Sharpens.** `harness-engineering.md` holds *premature done → failing tests* and *self-verification before done*. Both assume the agent's report is the thing you check. The finding is that the report is the unreliable part. Pockets of the right norm exist (`/ux-check`'s observed / inferred / *not checked*; `accessibility.md`: *"a recommendation you can trust is one that says what it did not look at"*). The two agents that report *done* don't hold it. |
| 4 | Who serves / harms? | Serves every cohort, most of all `first-product` and `non-tech-founder`, who can't read a transcript and trust the summary. It harms nobody. The risk is a disclosure line nobody reads, which is why it stays one line. |
| 5 | Cost / ceremony | **One line per agent, no new step.** It asks for a disclosure in the report the agent already writes. It is not a verify-twice rule, which is the kind of instruction the sister claim (RVW-106) warns costs more on newer models. |

## Verdict: ADAPT
The evidence is real, the finding is behavioural, and it names a gap in two agents BOSS ships. It is
adopted as a **disclosure norm**, not a verification procedure: an agent reporting *done* names what it
was asked to cover and did not open or run. The paper's other half (*"requiring delegation to
subagents increases coverage"*) is **not** adopted, because splitting work across agents to raise
coverage is exactly the multi-agent move `harness-engineering` refuses without a reason (RVW via
haytham ADR-026).

## If ADOPT / ADAPT
- **UP:** `harness-engineering.md`: the *self-verification* bullet gains the unreliable-report
  finding, with the number and the rule *"the transcript is the record, the summary is a claim."*
- **DOWN:** `coder` (the done-claim line) and `tester` (step 5, Report): name anything in scope that
  was not opened or run. **Absent and not-checked must not render the same**, which is the n=20
  lesson applied to an agent's report.
- **Modified from the original:** no transcript audit is asked of the founder, and no delegation for
  coverage. The disclosure moves the burden to the party that can see the gap.

## Attribution
**Verified.** Abstract fetched from the arXiv API 2026-09-23; all three quoted figures (67.9%, 80.4%,
59–96% per model) are in it verbatim. The full paper was not read.

## Notes
- Local corroboration, n=1: in the `/practice-refresh agents` sweep the same day, a finder subagent's
  report carried one claim that died on verification (the template's `AGENTS.md` "never read"). That
  was a wrong inference rather than an overclaim of coverage, so it is adjacent, not the same failure.
- Prior related: RVW-098 (a mechanism that is silent and therefore invisible), RVW-102 (measure the
  surface before ruling).
- BOSS version when recorded: 0.326.0 (+ Unreleased).
