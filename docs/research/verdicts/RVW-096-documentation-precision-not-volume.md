---
id: RVW-096
type: verdict
owner: pm
status: recorded
created: 2026-09-10
verdict: ADAPT
route: UP library/practices/context-discipline.md (sharpen an existing practice; NOT a new file)
sources:
  - https://arxiv.org/pdf/2407.09726
---

# RVW-096 — supplying documentation to a model should be gated on the model's uncertainty, not on completeness

## The claim
- **Source:** arXiv:2407.09726v1 — Jain, Kwiatkowski, Ray, Ramanathan & Kumar,
  *On Mitigating Code LLM Hallucinations with API Documentation* (AWS / Columbia, 13 Jul 2024).
  Fetched and read in full via `pdftotext`.
- **Core assertion:** You should supply a model documentation *selectively* — where it is likely
  ignorant — because supplying irrelevant documentation measurably degrades output on subjects it
  already knows. Precision of what you supply matters more than completeness.
- **Session:** SESSION-2026-09-10-documentation-craft (§1, the only surviving spine claim)

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it argues FOR #2.** "Just-in-time support, never premature ceremony" is the same shape one level down: supply the context the moment it is needed and not before. |
| 2 | Evidence grade | **Strongest grade this shelf has seen for a context claim.** Peer-reviewed-venue preprint, purpose-built benchmark (CloudAPIBench), five model families, an ablation over documentation *detail level*, and a retriever-precision sweep. Numbers read from the primary, not a summary. **Survived a 3-vote adversarial pass that KILLED the unconditional version** — the condition is load-bearing and now carried. |
| 3 | Duplicate or sharpen? | **Sharpens.** `context-discipline.md:42-46` already says *"cut anything the model already knows from training"* and `:327-331` already cites context rot. What it does NOT have is the **inverse and non-obvious half**: that supplying docs the model does not need is not merely wasteful but **actively harmful**, and that the fix is a *confidence gate*, not a shorter document. |
| 4 | Who serves / harms? | Serves `eng-builder` and `vibe-virtuoso` directly (they build retrieval). Serves `first-product` / `non-tech-founder` **only** if it stays a one-line principle — the paper's mechanism (uncertainty-gated retrieval) is not a thing they will implement. Harms nobody if scoped as guidance. |
| 5 | Cost / ceremony | **Net neutral-to-lighter.** It argues for supplying *less*, and it lands as sentences inside a practice that already exists. No new file, no new skill, no gate. |

## Verdict: ADAPT

The finding is real and the evidence is the best of this pass, but **the adoptable part is one
paragraph inside an existing practice, not a practice of its own.** What gets integrated is the
inverse framing — *irrelevant context is a cost, not just a waste, so gate on uncertainty rather
than trimming for length* — because that is the part `context-discipline.md` does not already say.

The unconditional form ("documentation degrades output where the model knows the subject") is
**explicitly not adopted**: the 3-vote pass killed it. Under accurate retrieval there is no penalty
at all (+0.49 with uncertainty-gated retrieval), and the −39.02 figure is GPT-4o's worst case under
a deliberately imprecise 50%-precision retriever, with the other four models at 17.56–25.85.

## If ADOPT / ADAPT
- **What to do:** add a short subsection to `library/practices/context-discipline.md` — *"the cost of
  context you did not need"* — carrying the narrowed claim, the retriever-precision threshold
  (~80% to break even), and the `sources.json` entry with the URL. Hand to `/boss-learn` to route UP.
- **What's modified from the original claim:** the qualifier is restored and made structural. The
  practice must state the *condition* (imprecise retrieval), not the effect alone, or it will be
  read as "docs are bad for models," which is the opposite of what the paper found.
- **Do NOT carry:** the raw −39.02 as a headline number. Use the range, or the ~80% precision
  threshold, which is the actionable figure.

## Attribution
**Verified.** Authors, affiliations, venue and date read from the primary PDF. All eleven cited
figures confirmed verbatim against Tables 2–3 and Figures 6–7 by an independent adversarial pass.
The *inference* was refuted and has been narrowed accordingly; the *attribution* holds completely.

## Notes
- Prior related verdicts: RVW-002 (ADAPT — lean CLAUDE.md; the recency-window half went DOWN).
- The killed sibling claims from the same session are recorded in
  SESSION-2026-09-10-documentation-craft §2 — five of them, and four were killed for the same
  reason: BOSS already holds the position, more sharply, in-repo.
- BOSS version when recorded: 0.273.0
