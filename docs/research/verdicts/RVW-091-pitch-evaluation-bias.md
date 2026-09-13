---
id: RVW-091
type: verdict
owner: mentor-humane
status: recorded
created: 2026-08-24
verdict: ADAPT
route: DOWN stages/L1-mvp/template/.claude/agents/mentor-capital.md (one bullet, raise-question section)
sources:
  - https://www.hbs.edu/ris/Publication%20Files/Brooks%20Huang%20Kearney%20Murray_59b551a9-8218-4b84-be15-eaff58009767.pdf
  - https://doi.org/10.1073/pnas.1321202111
---

# RVW-091 — the funding filter is not neutral, and a mentor coaching "tell it better" is giving incomplete advice

## The claim
- **Source:** `docs/research/inbox/hbs-pitch-evaluation-bias.md`
- **Core assertion:** Investor evaluation of an identical pitch varies by the presenter's gender and
  appearance — so a mentor coaching only narrative craft is optimizing a variable the evidence says
  is not the only one operating.
- The inbox file marked itself **NOT verified** — *"the publication venue is unconfirmed (I believe
  this line of work appeared in PNAS, but I have not checked, and guessing a venue is the exact
  failure `/vet` step 3 was added for). Do not cite until the primary source is opened."* **Opening
  it was this pass's job.**

## Step 3 — attribution: ✅ VERIFIED FROM THE PRIMARY (PDF fetched and parsed in full)

- **Title:** *Investors prefer entrepreneurial ventures pitched by attractive men.*
- **Authors:** Alison Wood Brooks (HBS), Laura Huang (Wharton), Sarah Wood Kearney (MIT Sloan),
  Fiona E. Murray (MIT Sloan). ✅ All four, as claimed.
- **Venue — the unconfirmed half, now confirmed:** **PNAS**, `10.1073/pnas.1321202111`. Edited by
  Nancy Hopkins (MIT), **approved 20 February 2014** (received 11 Nov 2013). **The guess was right;
  it is no longer a guess.**
- **Design — three studies, and the sample matters:**
  - **Study 1 (field):** 90 pitches from **three US pitch competitions over 3 years**, judged by
    panels of **angel investors** awarding real funding prizes. Observational.
  - **Study 2:** **521 nationally representative Americans** via Mechanical Turk, incentivized to
    make optimal investment decisions, watching two real venture pitches with content held constant.
  - **Study 3:** **194 behavioral-lab participants.**
- 🔴 **Two corrections to how the claim was framed, both from the abstract:**
  1. *"This effect is moderated by male physical attractiveness: attractive males were particularly
     persuasive, whereas **physical attractiveness did not matter among female entrepreneurs**."*
     The inbox's "gender and appearance" reads as symmetric. It is not — **appearance moved the
     needle for men only.**
  2. **The causal experiments were run on laypeople, not investors.** Real investors appear only in
     Study 1, which is observational. The honest sentence is "across a field study of angel-judged
     pitches and two controlled experiments," never "investors, in an experiment."

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — **Principle #6 pulls toward it.** `mentor-humane` holds override authority here and the finding is squarely its lens. |
| 2 | Evidence grade | **PNAS, four named authors at HBS/Wharton/MIT, three studies including a real-money field setting, read in full.** The strongest-sourced of the five claims in this sweep. |
| 3 | Duplicate or sharpen? | **New.** Verified absent: zero mentions of bias in the shipped `harm-taxonomy.md` or `mentor-capital.md`. BOSS's canvas asks who a *product* could harm; nothing anywhere says the *funding process itself* is a biased filter. |
| 4 | Who serves / harms? | 🔴 **The whole difficulty is here, and the inbox named it: "how does a mentor raise it without telling a founder their odds are fixed?"** Told badly — to a founder about to present — it is demoralizing and useless, and reads as a critique of their craft. Told at the right moment it is information about the room. Resolved by *placement*, below. |
| 5 | Cost / ceremony | One bullet in an agent that exists. No new surface, no new skill — **compose, not add** ([[EVID-001]]/[[EVID-003]] mandate satisfied). |

## Verdict: ADAPT
Adopt the **fact**, refuse the **coaching**. BOSS has no business telling a founder how to present
in the face of this, and any "so do X" would be advice the evidence does not support. What it does
earn is one honest sentence in the seat that already asks the prior question.

The placement is what makes it humane rather than deflating, and the inbox file found it: it lands
on `mentor-capital`'s existing *"right-sized is good, not a fallback"* line. **If the filter is
biased, then "stay right-sized" stops being a consolation and becomes, for some founders, the
better-reasoned call.** That is the same sentence doing double duty — naming a real cost of the
venture path while strengthening an option BOSS already believes in.

## If ADOPT / ADAPT
- **What to do:** one bullet in `mentor-capital.md` → *When the raise question is live (V1+)*,
  directly under the venture-scale bullet. Carries: the correct population (angel judges, 90 pitches,
  three competitions, plus two controlled experiments), the correct citation (Brooks, Huang, Kearney
  & Murray, *PNAS* 2014), and **the men-only attractiveness moderation**, which is the half most
  likely to be dropped in retelling.
- **Two rules shipped with it, both from rubric Q4:** say it *when the raise question is live, not
  when they ask for pitch help*; and **never present it as their odds.**
- **Modified from the original claim:** dropped "and appearance" as a symmetric effect (false);
  dropped any implication that the experiments observed investors (they did not); added nothing
  prescriptive.

## Notes
- ⚠️ **A convergence across this sweep worth carrying:** both pitch studies BOSS was weighing observe
  **angel investors** — this one's Study 1 panels, and [[RVW-090]]'s California angel network — and in
  both cases the word **"VC" gets attached in the retelling** (HBR's own 2017 headline does it). If
  the shipped mentor ever describes this literature, it says *investors* or *angels*, never *VCs*.
- Prior related verdicts: [[RVW-090]] (NOT-YET, same literature), [[RVW-037]] (the shipped incumbent
  on pitch honesty).
- BOSS version when recorded: 0.227.0
