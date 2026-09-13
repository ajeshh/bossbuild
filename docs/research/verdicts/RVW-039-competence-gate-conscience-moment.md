---
id: RVW-039
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → conscience moment + mentor-venture; also the load-bearing "why BOSS exists" citation
---

# RVW-039 — AI advice amplifies judgment, it doesn't supply it (the competence-gate)

## The claim
- **Source:** Otis, Clarke, Delecourt, Holtz & Koning, *The Uneven Impact of Generative AI on Entrepreneurial Performance* (HBS WP 24-042, RCT, 640 entrepreneurs) — high performers ~+15%, low performers ~−8% with a GPT-4 advisor; the struggling couldn't tell when advice was wrong. + Microsoft/CMU CHI 2025 (automation bias: more confidence in AI → less critical checking). Verified primary source: `docs/source/` (HBS PDF read).
- **Core assertion:** AI advice/output amplifies the judgment a founder already has — it can actively *harm* the founder least able to evaluate it. The missing intervention is a layer that flags "are you equipped to grade this answer?"

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it's the empirical case *for* BOSS's whole thesis (build without fooling yourself). |
| 2 | Evidence grade | **[EVIDENCE] — the strongest in the session.** A true field RCT on the actual population (founders), plus a peer-reviewed automation-bias study. |
| 3 | Duplicate or sharpen? | **New.** BOSS's conscience exists to be exactly this equalizer, but no moment *names* the competence-gate, and the citation is used nowhere. |
| 4 | Who serves / harms? | Serves the green cohorts most (`first-product`, `vibe-coder-newbie`) — precisely the ones the RCT shows AI can mislead. No harm; it's a humility prompt, not a gate. |
| 5 | Cost / ceremony | Light — one conscience line + a load-bearing citation for mentor-venture / positioning. |

## Verdict: ADAPT
This is the empirical backbone of BOSS itself, and it's currently named nowhere. ADAPT (not a standalone ADOPT) because the *mechanism* already exists — the conscience — and what's needed is a **specific voicing**, not a new machine: a moment that fires when a founder leans on AI for a decision they may not be able to grade, asking "are you equipped to evaluate this?" rather than answering for them. Keep it suggestive and rare (over-firing would be its own failure). Use the RCT as mentor-venture's and positioning's load-bearing citation.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → add the competence-gate framing to the conscience's caution/drift voice + cite Otis et al. in mentor-venture and the positioning dossier. → hand to `/boss-learn`.
- **What's modified:** A voicing sharpen, not a new hook/gate; pair the RCT (advice quality by skill) with the CHI study (confidence ⟂ checking) as one "AI raises the stakes on knowing what to ask" point.

## Notes
- Prior related: [[RVW-033]] (HAI implementation gap — same "responsibility is the gap" family), [[RVW-047]] (validation-evidence honesty).
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.86.0, thesis bundle)
- **Routed UP** (with [[RVW-047]] + [[RVW-049]]). Two homes, no new machinery — exactly the "voicing
  sharpen, not a new hook/gate" the verdict insisted on:
  1. **`conscience-voicing.md`** — new "competence-gate" subsection: a voicing the `caution`/`drift`
     moments can reach for ("are you set up to judge this answer?" + point at who'd know), citing the
     Otis RCT + CHI automation-bias study. Explicitly **not** a new hook predicate (no signal detects
     over-trust — don't manufacture one); a lens the model draws on when composing voice.
  2. **`mentor-venture`** — the third "evidence you carry" coaching line, with the Otis RCT as the
     load-bearing citation (the empirical backbone of why BOSS exists).
- Kept suggestive + rare (over-firing is its own failure). Otis et al. now cited where the thesis is made.
