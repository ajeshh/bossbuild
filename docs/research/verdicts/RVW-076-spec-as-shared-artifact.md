---
id: RVW-076
type: verdict
owner: product-lead
status: recorded
created: 2026-08-17
verdict: REJECT
route: n/a (already shipped v0.136.0)
---

# RVW-076 — the spec is the artifact a non-technical cofounder can actually review

## The claim
- **Source:** "DORA 2026" (as the bottleneck shifting to specification + verification) · arXiv
  2605.01160 · arXiv 2603.25773 · adjacent 2606.22484.
- **Core assertion:** as AI accelerates generation the bottleneck moves to specification and
  verification; the team consequence BOSS has never said is that the spec — not the diff — is what a
  non-technical cofounder can review. Route: a `mentor-cofounder` line, possibly one in
  `git-workflow.md`. No new skill.
- **Inbox file:** `docs/research/inbox/spec-as-the-shared-artifact-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | The composition idea doesn't — *acting on it now* does. Shipping the routing a second time, or echoing it into `git-workflow.md`, is added surface for zero new capability: **#2** and EVID-001's compose-and-subtract, against Risk #1 ("materializing"). |
| 2 | Evidence grade | **(a) Empirical half FAILS.** The load-bearing citation is **UNVERIFIED**: DORA's actual 2026 publication is *ROI of AI-Assisted Software Development (2026.01)*, an ROI report. The "bottleneck moves to specification" and "specifications are the scarce resource" phrasings trace to secondary blog summaries and the preprints, **not** to verified DORA text. 2603.25773 is explicitly framed as *hypotheses*; 2605.01160 is a preprint. Letting "DORA 2026" sit beside `git-workflow.md`'s genuine [EVIDENCE]-grade DORA citations would corrode that bar. **(b) Team-composition half:** BOSS's own judgment — needs no citation, must be labeled as judgment. |
| 3 | Duplicate or sharpen? | **DUPLICATE — already shipped.** `stages/L1-mvp/template/.claude/agents/mentor-cofounder.md:41-51` at HEAD already carries the whole routing — *"Point the non-technical founder at the spec, not the diff — it's the review surface they can actually hold"* — composed with `/spec`'s goal + acceptance criteria + smoke check, and already ending with the judgment label the inbox file demands, with **no** DORA citation. `registry/CHANGELOG.md` v0.136.0 (2026-07-31 — the same day as the scan that produced this file) records it as "pure composition — no new surface." |
| 4 | Who serves / harms? | Serves the non-technical half of a founding pair — real population **zero**. Safety edge: "the spec is what you review" could mislead a non-technical cofounder into treating spec review as a *substitute* for anyone reading the 400-line diff. The shipped mentor text mitigates this by framing the spec as *their half*; a context-free line in `git-workflow.md` would carry the harm without the framing. |
| 5 | Cost / ceremony | The endorsed composition cost was already paid in v0.136.0. Everything remaining is added surface: a duplicate statement in a second file, a duplicate CHANGELOG entry, or an unverifiable citation entering the corpus. Zero remaining benefit, positive remaining cost. |

## Verdict: REJECT — already shipped, and the headline citation failed verification
The claim's entire suggested routing shipped in **v0.136.0** and sits committed at HEAD; this inbox
file is a leftover of work already done, not a candidate. The one unshipped fragment ("possibly one
line in `git-workflow.md`") was optional in the claim's own words and is now a cross-file restatement
with a safety downside and no verified source behind it. Independently, the load-bearing DORA
attribution does not verify — **the second failed second-hand attribution in this session** — so even
absent the duplication, the empirical half could not enter BOSS's corpus as stated.

**Killing finding:** `stages/L1-mvp/template/.claude/agents/mentor-cofounder.md:41-51` already contains
the exact proposed change, judgment-labeled and citation-clean, recorded in CHANGELOG v0.136.0.

**Citation quarantine (binding on any revisit):** "DORA 2026 says the bottleneck moves to
specification/verification" must **NOT** be cited. The verified 2026 DORA publication is the ROI
report, and the only corroborated DORA-adjacent framing is the narrower *"gains show up elsewhere as
costs: more changes waiting for review, more rework, more broken tests, more risk reaching
production."* arXiv 2605.01160 / 2603.25773 are preprints/hypotheses — frame-reading only, never
evidence. The spec-as-cofounder-review-surface framing is BOSS's own judgment and stays labeled as such.

**Re-open condition (the `git-workflow.md` fragment only):** all three of — (1) a primary, verified
DORA or peer-reviewed text actually stating the specification-bottleneck claim; (2) a real founding-team
cohort using BOSS; (3) evidence that the `mentor-cofounder` placement alone failed to reach them at the
review moment.

## Notes
- Prior related: [[RVW-050]] (evals-as-PM-spec → `mentor-architect` — the prior that makes this a
  composition, not a discovery), [[RVW-035]], [[RVW-038]] (same agent), [[RVW-053]], [[RVW-020]],
  [[RVW-072]] (the Karpathy claim — same second-hand-attribution failure pattern, same session).
- The inbox file's own honest-grading section predicted **both** failure modes (the DORA verification
  and the judgment label). The grading discipline worked; the claim still died.
- BOSS version when recorded: 0.150.0
