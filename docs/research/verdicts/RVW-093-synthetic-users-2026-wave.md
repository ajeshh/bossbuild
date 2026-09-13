---
id: RVW-093
type: verdict
owner: product-lead
status: recorded
created: 2026-08-24
verdict: REJECT
route: n/a (one one-line sharpening carried into RVW-092's /ux-check change)
---

# RVW-093 — AI-generated users are now good enough to stand in for real UX research

## The claim
- **Source:** PerceptUI, *LLM Agents as Human-Aligned Synthetic Users for UI/UX Evaluation* —
  Bougie, Ye, Marconi, Watanabe. arXiv:2606.05697, 4 Jun 2026. <https://arxiv.org/abs/2606.05697>
  Plus the surrounding 2026 blog wave.
- **Core assertion:** synthetic users have reached "human-level realism" and generalize to unseen
  personas — so run discovery and UI evaluation against them.
- **Inbox file:** `docs/research/inbox/synthetic-users-2026-wave.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **#6, at the point of use.** NN/g states the ethics plainly: *"Do not present synthetic-user research findings as real-user research findings. This is an unethical way to share what you've learned."* A tool that lets a founder mistake a synthetic yes for a real one fails humane-before-viable — and fails the founder commercially, which is worse. |
| 2 | Evidence grade | **The claim is the weakest source in its own field.** PerceptUI is an unrefereed preprint whose abstract carries **no human-vs-agent numbers**. Against it: Lewis & Sauro (MeasuringU, 14 Apr 2026) reviewing **12 peer-reviewed papers — 9 encouraging vs 14 discouraging**, with only **21%** of classic replications succeeding (Park et al.), systematic **variance collapse and effect exaggeration**, and the conclusion that reliance is *"premature ... for critical decision-making."* Grade: **contradicted by the measurement literature.** |
| 3 | Duplicate or sharpen? | **Duplicate — and BOSS already states it better than the field does.** `/persona` ships, verbatim: *"A synthetic persona will tend to like your idea more than a real person would, and it can't know what it wasn't told."* That is NN/g's sycophancy finding, already in a founder's hands. `/persona` also ships the **`Evidence ledger: synthetic <N%> · real <N%>`** — which is exactly the labelling NN/g calls an ethics requirement, implemented as a mechanism rather than a warning. And [[RVW-015]] already **REJECTED** the adjacent claim (let an AI *run* your customer interviews). |
| 4 | Who serves / harms? | **Harms `vibe-virtuoso` and `first-product` hardest** — the cohorts most likely to accept a synthetic yes and skip the conversation. Teutloff's founder-specific study is the sharpest warning available: synthetic-only themes were **"amplified false positives and trauma blind spots."** A false positive is the single most expensive thing you can hand a pre-PMF founder. |
| 5 | Cost / ceremony | **Heavier for no gain** — a new research surface duplicating one BOSS ships. |

## Verdict: REJECT

Duplicate of a practice BOSS already ships, and the one genuinely new claim — PerceptUI's
"human-level realism" — is an unrefereed preprint contradicted by a 12-paper review four months
earlier. BOSS's existing `/persona` framing is *ahead* of the 2026 blog wave, not behind it.

**One distinction is worth keeping**, because it is the only thing in the pile BOSS didn't already
know: **a digital twin grounded in a real person's own data is not the same artifact as a persona
conjured from a prompt.** Budiu (NN/g, 15 Aug 2025) puts twins at 0.85 on GSS and r=0.98 on
effect-size correlation, far above demographic/persona models. That is a real result — and it is
**unreachable for BOSS's founders**, who by definition don't yet have a corpus of their user's own
data. It sharpens the refusal rather than softening it: the thing that works needs the very evidence
the founder is trying to skip.

## If REJECT — why not
- **The killing finding:** the claim's own field measured it and said no. Nothing here beats what
  `/persona` already tells a founder in two sentences before getting out of the way.
- **The one sharpening that survives** (folded into RVW-092's change, not built separately):
  `/ux-check` step 11 says *"Pair with personas where relevant"* and carries **none** of `/persona`'s
  discount. The guard exists in the skill that *creates* the persona and not in the skill that
  *consumes* it. One line, in the same edit — not a second pass.

## Attribution
**Partly verified, and two attributions actively fail:**
- ✅ NN/g sycophancy + ethics — **Rosala & Moran, 21 Jun 2024**, read directly.
- ✅ MeasuringU 12-paper review — **Lewis & Sauro, 14 Apr 2026**, read directly.
- ✅ Founder-specific false positives — **Teutloff, arXiv:2509.02605**, 29 Aug 2025 (preprint).
- ❌ **"NN/g's State of UX 2026 report" DOES NOT VERIFY.** *The State of UX* is **UX Collective**
  (Fabricio Teixeira and Caio Braga). A LinkedIn post plus SEO blogs blended the two, and a search
  summary then returned blog content *as* NN/g findings. **The attribution was doing the persuading.**
- ❌ **"2026 research shows synthetic users are sycophantic" — the finding is 2024, re-dated.** The
  Aug-2025 NN/g three-studies article contains no sycophancy claim; it is about variance and
  magnitude. Its three studies are **external** (Kim & Lee; Stanford-Google; Arora), not NN/g's own.
- ⚠️ **Not cited, primary never opened:** "97% use AI / 8% trust synthetic participants" and
  "99.3% of researchers reject standalone synthetic use" — marketing-blog figures.

## Notes
- Prior related verdicts: [[RVW-015]] (AI-moderated customer interviews — REJECT; same family,
  same reason). [[RVW-028]] (professional vibe coder).
- **n=12 for the verify-the-attribution heuristic**, and a new flavour: **the misattribution was
  manufactured by the search summary itself**, not by any single source — three blogs blended into
  one confident "NN/g found." Search summaries are hypotheses about documents; this one invented a
  publisher.
- BOSS version when recorded: 0.229.0
