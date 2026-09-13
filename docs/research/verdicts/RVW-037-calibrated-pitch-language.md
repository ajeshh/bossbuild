---
id: RVW-037
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → stages/L2-v1 mentor-pitch (calibrate-claims-to-evidence heuristic)
---

# RVW-037 — overclaiming measurably hurts fundraising; calibrate pitch claims to evidence (HBR, 2025)

## The claim
- **Source:** Harvard Business Review, Aug 2025 ("4 Research-Backed Ways to Strengthen Your Pitch")
- **Core assertion:** Founders raise more when pitch language is **calibrated to evidence strength**; overclaiming measurably hurts outcomes.
- **Inbox file:** `docs/research/inbox/hbr-calibrated-pitch-language.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it *backs* BOSS's anti-hype posture and the conscience's "name the cost, don't oversell" voice. |
| 2 | Evidence grade | Study-backed (HBR reporting an empirical finding) — above typical management-press anecdote. |
| 3 | Duplicate or sharpen? | **Sharpens.** BOSS's voice/conscience already resists overclaiming ([[boss-voice]], anti-hype), but `mentor-pitch` has no *measured, fundraising-specific* version of it. This gives the posture empirical teeth + a concrete application. |
| 4 | Who serves / harms? | Serves every founder pitching (esp. `vibe-virtuoso`/`returning-founder`, prone to polish over substance). No harm — it's calibration, not suppression. |
| 5 | Cost / ceremony | Light: one attributed heuristic in an agent that already exists. |

## Verdict: ADAPT
Sound and squarely on-voice — but it sharpens an existing stance rather than introducing a new one, so ADAPT not ADOPT. Add a single attributed heuristic to `mentor-pitch`: *calibrate every claim to the strength of your evidence; overclaiming measurably lowers what you raise* — which turns BOSS's anti-hype instinct into a fundraising-specific, evidence-backed coaching point. Inherit the conscience's "voice the tension, don't filter" line — it's a calibration nudge, not a gag.

## If ADOPT / ADAPT
- **What to do:** Route **UP** into `stages/L2-v1/template/.claude/agents/mentor-pitch.md` — a "calibrate claims to evidence (overclaiming hurts the raise)" heuristic, attributed to the HBR study. → hand to `/boss-learn`.
- **What's modified:** Framed as calibration coaching, not a blocking check; tied to the existing anti-hype voice rather than added as a separate gate.

## Notes
- Prior related verdicts: aligns with [[boss-voice]] (anti-hype) and conscience-voicing.
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (v0.90.0, final /vet sweep bundle)
- **Routed UP** into `stages/L2-v1/template/.claude/agents/mentor-pitch.md` — one attributed heuristic in
  "Your job": *calibrate every claim to the strength of the evidence; overclaiming measurably lowers what
  you raise* (HBR 2025), with verb-to-proof matching (shows/suggests/we believe/we're testing) and the
  conscience's voice-the-tension framing (calibration, not suppression). Tied to the existing anti-hype
  voice, not a new gate, exactly as scoped. **Shipped in v0.90.0** (consolidated final-sweep bundle,
  commit `b35ac66`).

## ⚠️ CONSOLIDATION NOTE — 2026-08-24: the seat in `route:` no longer exists

`route:` above names an **L2-v1 agent that was removed** when the mentor ladder was consolidated
(`88ef851` v0.189.0 → `ac60d47` v0.190.0–v0.195.0). `mentor-pitch`, `mentor-fundraising` and
`mentor-business` were merged into a single shipped seat — **`stages/L1-mvp/template/.claude/agents/
mentor-capital.md`** — which states the reasoning itself: *"a real incubator does not staff a pricing
specialist, a fundraising specialist and a pitch coach. One partner covers all three and grows with
the company."*

**This verdict's adopted content was checked line-by-line on 2026-08-24 and SURVIVES in
`mentor-capital`.** Nothing was lost in the merge; only the routing record rotted. The `route:` field
is left as written because it records the decision as it was actually made — read it with this note.

Found while vetting [[RVW-089]], which nearly re-litigated this verdict's claim without noticing that
the file it pointed at was gone.
