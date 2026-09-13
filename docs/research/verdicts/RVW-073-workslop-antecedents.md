---
id: RVW-073
type: verdict
owner: product-lead
status: recorded
created: 2026-08-17
verdict: ADAPT
route: UP library/practices/ai-adoption-culture.md
---

# RVW-073 — workslop has antecedents, so restructure `ai-adoption-culture.md` around the causal chain

## The claim
- **Source:** "Workslop: Examining the prevalence, antecedents and consequences of low-quality
  AI-generated content at work" — OSF preprint `10.31234/osf.io/5f78h_v1`, published 2026-02-05,
  n=962 US full-time desk workers. The 2026 follow-on to the BetterUp × Stanford HBR 2025 piece BOSS
  already cites (Niederhoffer / Liebscher / Hancock lineage).
- **Core assertion:** high AI trust + low agency + an org mandate + low psych safety are the
  *antecedents* of workslop, so the practice's four "independent" sections are really one causal
  chain and should be rewritten around that spine.
- **Inbox file:** `docs/research/inbox/workslop-antecedents-causal-chain-2026.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | The content doesn't; **the restructure does.** Rewriting a practice that is *dormant for solo founders* (its own Altitude section) for a cohort of n=0 (IDEA-037 is a lead) is **#2** ceremony, and "causal chain" language a cross-sectional self-report cannot support contradicts PRINCIPLES.md's own bar — *BOSS not overclaiming its own promise* — and `SOURCES.md`'s two-lane rule. |
| 2 | Evidence grade | **[EVIDENCE]-pending.** Preprint, not peer-reviewed; cross-sectional self-report; source language verified as associational ("more common among"). Disclosed n=962 keeps it out of pure [THOUGHT-LEAD]. **Same lineage as the already-cited 2025 piece cuts against it** — a follow-on by the same authors is the same tap flowing twice, not independent corroboration. Enough for a hedged citation and a number refresh; never enough for a restructure or the word "causal." |
| 3 | Duplicate or sharpen? | **The claim's premise is false against the file.** The practice does not present four independent sections — the preamble already *is* the spine ("people hide their AI use, ship each other sloppy AI output, resent the mandate… the failure isn't the tool, it's the rollout"), §2 already ties psych safety to a mandate, §4 is already framed as "The stakes." Genuinely new: the spine had **no citation of its own**; sender-side prevalence (52.7%); the manager/leadership pair; fresher receiver figures. |
| 4 | Who serves / harms? | **Serves nobody today** — dormant for every solo cohort (`vibe-virtuoso`, `indie-hacker`, `first-product`, `vibe-coder-newbie`); founding teams are n=0. The one piece with real cohort fit is the **founder-as-sender edge**: serves `eng-builder` / `returning-founder` / `indie-hacker` at the first-collaborator moment and protects the `non-tech-founder` cofounder — the RVW-039 shape exactly. Harm risk: preachiness; keep it one norm-flip, not a lecture. |
| 5 | Cost / ceremony | Restructure = churn on a dormant file for a zero-n cohort = Risk #1 energy. The narrow edit (annotate the spine, sharpen §4, one cross-link, provenance) is genuine **compose+subtract** and costs minutes. The claim's "possibly a `mentor-cofounder` line" is new machinery for a cohort that doesn't exist — **#2** violation. |

## Verdict: ADAPT (narrow) — the restructure is REJECTED
The headline routing dies on its own premise: the spine it wants to install is already the practice's
opening thesis, so the restructure would churn a dormant file to say what it already says — on the
strength of one non-peer-reviewed, same-lineage self-report survey. What survives is smaller and real:
that spine was **asserted without citation for a year**, and this preprint (properly hedged as
associational) is its first supporting evidence, plus the founder-as-sender edge the practice entirely
lacked. NOT-YET was weighed and rejected as incoherent — the practice already cites the 2025
predecessor at the same grade, so refusing the 2026 follow-on would apply two bars to one lineage.

## What changed (`library/practices/ai-adoption-culture.md`)
- **Preamble annotation** — the rollout thesis gets its first evidence, stated as association, with the
  explicit note that the four antecedents *are* §1 and §2 standing next to §4.
- **§4 sharpen** — sender-side prevalence (52.7% admit sending), the manager/leadership pair (55% / 85%),
  and the founder-as-sender edge; the norm now points **down**, not just sideways. BOSS's inference is
  labeled as inference.
- **Competence-gate cross-link** — worded as a *rhyme* with [[RVW-039]], explicitly not a mechanism.
- **Provenance** records the 2026-08-17 sharpen; **the freshness clock was deliberately left alone**
  (`last_reviewed` stays 2026-06-20). A targeted citation update is not a sweep — the WORKBank,
  Edmondson and Mollick material was not re-checked against 2026 — so the doc should still come due on
  its original date. *Worth recording: the first attempt restamped `last_reviewed` while holding
  `review_by`, and **the release gate rejected it** — the curve tiers enforce
  `review_by = last_reviewed + window`, so "freshened a little" is not a state the mechanism allows you
  to claim. Either you swept it or you didn't.*

**Explicitly rejected:** the word "causal" and any "mandates cause workslop" framing · the 61%
correlational effect size · the in-place restructure · a `mentor-cofounder` line · replacing (rather
than pairing) the 2025 figures.

**EVID-001 compatible:** yes, for the narrow edit only — library shelf, not the founder-facing offering;
no new skill, agent, hook, or section.

**Re-open condition (deeper integration):** peer review, an independent-lineage replication, or IDEA-037
graduating from lead to an observed real team.

## Notes
- Prior related: [[RVW-038]] (created this practice), [[RVW-039]] (competence gate — cross-link target),
  [[RVW-035]] (Edmondson psych-safety — precedent that this practice absorbs sharpen-grade material
  rather than restructuring around it).
- BOSS version when recorded: 0.150.0
