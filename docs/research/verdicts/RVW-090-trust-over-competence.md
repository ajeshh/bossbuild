---
id: RVW-090
type: verdict
owner: pm
status: recorded
created: 2026-08-24
verdict: NOT-YET
route: n/a
sources:
  - https://hbr.org/2017/05/how-venture-capitalists-really-assess-a-pitch
---

# RVW-090 — "investors read for character, not competence" — plausible, paywalled, and about ANGELS

## The claim
- **Source:** `docs/research/inbox/hbr-vcs-assess-character-over-competence.md` — HBR, May 2017.
- **Core assertion:** VCs' interest in a startup was *"driven less by judgments that the founder was
  competent than by perceptions about character and trustworthiness"* — so `mentor-capital`'s
  narrative-craft lens may be optimizing the wrong variable.

## Step 3 — attribution: ⚠️ PARTLY VERIFIED, and it bends on the population

- **The article is real** — *How Venture Capitalists Really Assess a Pitch*, HBR May–June 2017.
- 🔴 **The inbox file names no author at all.** The author is **Lakshmi Balachandra** (Babson
  College). A claim carried for four days with the venue but not the researcher is half a citation —
  the same gap that produced this step in the first place.
- 🔴 **The primary is PAYWALLED.** WebFetch returned only the standfirst (and surfaced the
  *illustrator's* byline, Justyna Stasik, as "the author" — a trap worth noting). **The load-bearing
  quote could not be read at its source**; it traces only to secondary summaries. Per
  `/deep-research`: a source behind a paywall you could not read is not a source you have.
- 🔴 **The population is wrong.** The trust-over-competence result comes from work with **a
  California network of angel investors** hearing 20-minute pitches monthly — not venture
  capitalists. The separate 185-pitch study everyone quotes alongside it is a *different* study
  (body language, sound off). **HBR's headline says "Venture Capitalists"; the data is angels**, and
  the inbox file inherited the headline's word.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | **Cannot be graded honestly yet.** With the borrowed authority removed — unread primary, unnamed author, misdescribed population — what remains is a management-press summary of a study I have not seen. |
| 3 | Duplicate or sharpen? | Genuinely **not** a duplicate. `mentor-capital` covers what investors *probe* (usage, retention, WTP, defensibility) — that is substance. Nothing shipped says anything about what they are *reading for*. |
| 4 | Who serves / harms? | Would serve any founder pitching. Slight harm risk: "be trustworthy" coaching drifts easily into performing sincerity, which is the opposite of the finding. |
| 5 | Cost / ceremony | Light if adopted — one heuristic in an agent that exists. |

## Verdict: NOT-YET
The claim is plausible, sits well with BOSS's grain (a founder who names their riskiest assumption
out loud *demonstrates* the trait rather than performing it), and fills a real gap. It fails only on
step 3 — and it fails there in the precise way this repo has been bitten ten times: **the
attribution is doing the persuading.** "VCs assess character over competence" is a much stronger
sentence than "in one angel network, projected trustworthiness moved funding odds," and only the
second one is supported by what I could confirm.

## If REJECT / NOT-YET
- **Why not:** primary unread (paywall), author absent from the record, and the investor population
  misdescribed as VCs when the study observed angels.
- **Re-open condition:** read Balachandra's **peer-reviewed** paper (not the HBR summary), and
  restate the claim with the population named correctly. If it holds, the route is the shipped
  `mentor-capital`, one heuristic — **never** the gitignored `mentor-pitch` (see the note below).

## Notes
- 🔴 **Altitude, checked before grading ([[confirm-the-altitude-first]]):** the inbox file proposed
  changing `mentor-pitch` / `mentor-fundraising`. **Both live only in this repo's gitignored
  `/.claude/` and ship to NOBODY.** They are BOSS's own mentors, coaching Ajesh. The founder-facing
  seat is `stages/L1-mvp/template/.claude/agents/mentor-capital.md`, which states outright that *"a
  real incubator does not staff a pricing specialist, a fundraising specialist and a pitch coach.
  One partner covers all three."* Any future route goes there. This is the standing
  [[dev-workspace-described-as-shipped]] trap, caught **before** the work rather than after.
- BOSS version when recorded: 0.227.0
