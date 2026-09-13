---
id: RVW-045
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → mentor-humane (a harm taxonomy to reason against)
---

# RVW-045 — give the humane lens a named harm taxonomy instead of vibes

## The claim
- **Source:** Anthropic **Unified Harm Framework** (Aug 2025 — 5 dimensions: physical, psychological, economic, societal, individual-autonomy) + Ada Lovelace advanced-AI-assistant harms (manipulation, dependence, anthropomorphism, overreliance).
- **Core assertion:** The humane lens should reason against *named axes* of harm, not improvise "who could this hurt?" each time.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — it operationalizes #6. |
| 2 | Evidence grade | Operational/host-aligned (Anthropic) + policy-analysis (Ada); neither is eval-data, but both are credible structured lenses. |
| 3 | Duplicate or sharpen? | **Sharpens.** mentor-humane voices "who could this harm?" but has no taxonomy; "individual autonomy" maps onto BOSS's attention/agency/dignity language; Ada adds the *relationship-level* failure modes BOSS most cares about. |
| 4 | Who serves / harms? | Serves the humane lens directly; no cohort harm. |
| 5 | Cost / ceremony | Light — a prompt enrichment for one agent; combine both sources in one update. |

## Verdict: ADAPT
A clean sharpen of the lens that most defines BOSS. ADAPT: fold the 5 harm dimensions + Ada's four relationship-harms into mentor-humane as the *taxonomy it reasons against* — turning "who could this harm?" from vibes into a checklist. Explicitly **drop** Anthropic's 6-stage enterprise safeguard lifecycle (wrong altitude for a solo founder). Note the self-referential value: anthropomorphism/overreliance also discipline BOSS's *own* voice (the "seasoned hand who doesn't need the credit" resists para-social pull).

## If ADOPT / ADAPT
- **What to do:** Route **UP** → mentor-humane prompt gains the harm taxonomy (5 dims + 4 relationship-harms), attributed. → hand to `/boss-learn`.
- **What's modified:** Taxonomy only, not the lifecycle; framed for a founder's product, and reflexively for BOSS's own design.

## Notes
- Prior related: [[RVW-031]] (dark patterns — the product-design twin of this lens), conscience-voicing.
- BOSS version when recorded: 0.74.0

## `/boss-learn` outcome — 2026-06-20 (corrected v0.84.0)
- **First attempt (v0.82.0) misrouted:** landed in `.claude/agents/mentor-humane.md`, which is *gitignored* (BOSS-local) — shipped to nobody. `mentor-architect` reframed it: the humane lens is **cross-cutting**, so it belongs in a practice every mentor + the conscience can cite, not inside one agent ("the agent was the wrong container, not just the wrong location").
- **Re-homed (v0.84.0):** new shippable **`library/practices/harm-taxonomy.md`** (5 harm dimensions + 4 relationship-harms), citable by the conscience, every mentor, and `/canvas` §3. The BOSS-local agent edit stays as harmless dogfood; the practice is canonical. Surfaced the mentor internal/shipped boundary fix in `docs/MENTORS.md` + IDEA-038/039 + an architecture decision record.
