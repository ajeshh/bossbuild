---
id: RVW-030
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → stages/L2-v1 mentor-business (add on-ramp + tier-design layers); JIT-delivered, inherits RVW-023 defer-discipline
---

# RVW-030 — Adopt a 2026 freemium/subscription-tier playbook as founder-facing mentor-business guidance?

## The claim
- **Source:** [docs/research/pricing-and-tiers-playbook-2026.md](../pricing-and-tiers-playbook-2026.md) — synthesized from a `/deep-research` run (27 sources, 22/25 claims adversarially confirmed). Primaries: ChartMogul 2026 (n=200), BVP, Google, Sequence/Intercom, Lenny's/Kansal.
- **Core assertion:** BOSS should encode a modern pricing framework as founder-facing `mentor-business` guidance — per-seat is declining; AI margins (~50–60%) break the freemium/zero-marginal-cost assumption; default to hybrid base+usage with quotas; choose on-ramp (freemium/trial/reverse-trial/no-free) by traffic + cost; three tiers + enterprise; gate on the axis that matches your value metric; outcome pricing only under strict conditions.
- **Research artifact (not an inbox drop):** the playbook itself; occasioned by [RVW-029](RVW-029-freemium-doesnt-work-in-ai.md).

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — and the "premature" worry is weaker than it first looks.** `mentor-business` is already authored at V1 (`stages/L2-v1/template/.claude/agents/mentor-business.md`) and RVW-023 just enriched it *today*. The real #2/#6 constraint is narrower: that agent already carries a **defer-discipline** ("many V1 products are too early for a pricing decision — defer") and a **"voice the tension, never filter the menu"** humane rule. New content must *inherit* both, not turn a coach into a pricing-pusher. |
| 2 | Evidence grade | **Strongest item vetted to date.** Primary data (ChartMogul n=200, Google, BVP) + adversarial verification (22 confirmed, 3 over-precise stats killed). Directional findings = high; specific percentages = contested (the playbook already grades this honestly). |
| 3 | Duplicate or sharpen? | **Sharpens, with a duplicate to avoid.** The **metering-basis axis** (per-seat/usage/hybrid/outcome) is *already in* mentor-business via RVW-023 — don't re-add it. What's genuinely NEW: (a) the **on-ramp choice** (freemium vs free-trial vs reverse-trial vs no-free-tier) and (b) **tier-design mechanics** (how many tiers, what to gate, free→paid boundary, anchoring). Neither is in the agent today. Also subsumes RVW-029's "fold Kansal in." |
| 4 | Who serves / harms? | Serves every cohort *at the pricing moment* (esp. `non-tech-founder`, `indie-hacker`, `returning-founder`). **Harm = wrong-timing:** dumping Enterprise-tier theory on `first-product`/`vibe-coder-newbie` is the ceremony BOSS refuses — which is exactly what the agent's existing defer-discipline guards against. Inherit it. |
| 5 | Cost / ceremony | Light: appending two sections to an agent that already exists and already frames the topic. The discipline (defer + voice-don't-filter + grade-the-numbers) is what keeps it from bloating into a pricing lecture. |

## Verdict: ADAPT
The content earned more than a flat REJECT — best-evidenced item we've vetted, and it fills two real gaps (on-ramp choice + tier-design) in the V1 `mentor-business` agent RVW-023 just extended today. It's not premature: the home exists and was touched hours ago. The ADAPT is the *discipline*, not a delay — **add the on-ramp + tier-design layers (not the metering axis, already there), and make them inherit the agent's existing defer-rule and "voice the tension, never filter the menu" humane line.** Numbers stay graded (ranges, not the three killed stats).

## If ADOPT / ADAPT
- **What to do:** Route **UP** into `stages/L2-v1/template/.claude/agents/mentor-business.md` — append an **on-ramp** sub-axis (freemium / free-trial / reverse-trial / no-free-tier, chosen by traffic + per-user cost) and a brief **tier-design** note (≈3 tiers + enterprise; gate on the axis matching your value metric; free tier must reach a real aha, not a demo). Carry the cautionary cases (Cursor credit crisis, "customers don't think in tokens") as teaching color. Point [[RVW-023]] and this playbook at each other; mark RVW-029's "fold-in" satisfied. → hand to `/boss-learn` to confirm UP routing + exact edit.
- **What's modified from the original claim:** (1) drop the metering axis (duplicate of RVW-023's same-day edit); (2) subordinate everything to the **defer-discipline** — the agent must still say "you may be too early to price" first; (3) keep "voice the tension, never filter the menu"; (4) numbers as graded ranges, never the killed stats.

## If REJECT / NOT-YET
- n/a (ADAPT). The conservative half — "deliver JIT, never push; defer when too early" — is carried by the agent's existing discipline, not a separate gate.

## `/boss-learn` outcome — 2026-06-20 (routed UP, v0.73.0)
- **Direction confirmed: UP.** Project-neutral founder-facing mentor knowledge.
- **Landed in:** `stages/L2-v1/template/.claude/agents/mentor-business.md` — appended an **on-ramp**
  block (freemium / free-trial / reverse-trial / no-free-tier) + a **tier-design** note (~3 tiers +
  enterprise; gate where absence blocks a segment's core job; free→paid at a real aha) + three
  cautionary cases + an explicit "numbers are contested, coach the ordering not the digits" rule.
- **Did NOT re-add** the metering axis (RVW-023's same-day edit) — confirmed no duplication.
- **Template only**, not BOSS's own `.claude/agents/mentor-business.md` — that instance is
  deliberately lean (BOSS has 0 paying users; Principle #2). The check held: routing to BOSS's own
  copy would have been the bloat to avoid.
- **VERSION** 0.72.0 → **0.73.0**; `package.json` bumped; `registry/CHANGELOG.md` entry added.
  Connected projects pull via `/boss-sync`.

## Notes
- Prior related verdicts: [[RVW-023]] (per-seat→outcome, the stub this fills); [[RVW-029]] (freemium-for-AI, REJECT — its "use the Kansal citation" is now subsumed here); thesis-family neighbors RVW-016, RVW-020.
- BOSS version when recorded: 0.69.0 (verdict) → applied at 0.73.0

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
