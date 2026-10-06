---
id: RVW-139
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
---

# RVW-139 — give every clarifying question a recommended answer, so "yes" is a complete reply

## The claim
- **Source:** Spec Kit `clarify.md:141-165` (opened 2026-10-05): *"Present EXACTLY ONE question at a time"*,
  *"Present your recommended option prominently"*, *"accept the recommendation by saying 'yes'"*. The same
  shape appears in Kiro Plan (numbered multiple choice) and BMAD `forge-idea`.
- **Core assertion:** a suggested answer on each question makes clarifying cheap and fast.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Not a principle. It does contradict a rule `/spec` holds on purpose: *"Corrections are the documentation… Keep their wording."* |
| 2 | Evidence grade | **Pattern.** Three tools converged on it independently. That is real, but it is evidence that it is *fast*, not that it gets the founder's head onto the page. |
| 3 | Duplicate or sharpen? | **Duplicate for the part that fits.** `/spec` step 3 already lists *"every gap you filled… each phrased so it can be rejected in one word"*. That **is** a recommended answer, which the founder accepts by silence. The parts with no recommendation are open **on purpose**. *"Walk me through one concrete instance"* must be *"in their words… unedited"*. *"What would make you say this is broken"* is the inverse question. The path questions must not be invented: *"a fabricated negative path is worse than none"*. |
| 4 | Who serves / harms? | It would serve speed for `eng-builder`. It harms `first-product` and `non-tech-founder`, who will say "yes" to a recommended concrete instance they never lived, and the FEAT then records BOSS's guess as their words. |
| 5 | Cost / ceremony | Lighter per question, but at the cost of the one thing the step exists to catch. |

## Verdict: REJECT
BOSS already recommends where a recommendation is safe: the assumptions list. It leaves the rest open,
because those answers are only worth anything in the founder's own words. A recommended *concrete
instance* is the failure step 3 was written to stop: *"a model asked to spec a feature will complete every
gap fluently, and the founder cannot correct a guess they never saw."*

## If REJECT / NOT-YET
- **Why not:** a duplicate where it fits, and harmful where it doesn't.

## Attribution
**Verified** — `clarify.md:141`, `:154-155`, `:165`.

## Notes
- The one-at-a-time half was also considered. BOSS's *one numbered message* (`spec/SKILL.md` step 3) is a
  deliberate choice against rounds, and this claim brings no evidence that rounds do better.
- BOSS version when recorded: 0.329.0
