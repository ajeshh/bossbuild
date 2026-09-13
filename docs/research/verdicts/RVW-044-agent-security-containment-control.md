---
id: RVW-044
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → library/practices/agent-security.md (2026 containment + control defaults)
---

# RVW-044 — harden agent-security with 2026 containment + control patterns

## The claim
- **Source:** Anthropic, *How we contain Claude across products* — https://www.anthropic.com/engineering/how-we-contain-claude (**2026-05-25**; URL and date added 2026-09-12 — this verdict carried neither, which is why the 2026-09-08 sweep could claim the blog was silent since April) (May 2026 — mount-mode tiers, egress allowlists, MITM proxy inspecting tool returns; principle "match isolation to the user's capacity for oversight") + Redwood Research, AI Control (Nov 2025 — gate irreversible/critical tool calls behind a cheaper trusted check or a human).
- **Core assertion:** Beyond the abstract Rule-of-Two, there are *concrete* containment defaults: tiered mounts (read-only / no-delete), egress allowlists, inspect-tool-returns-before-context, and gating irreversible actions.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Operational, but unusually concrete + **host-native** (BOSS runs on Claude Code's own sandbox); Redwood adds quantified protocol comparisons [EVIDENCE]. |
| 3 | Duplicate or sharpen? | **Sharpens.** `agent-security.md` names the trifecta/Rule-of-Two abstractly and says "sandbox by default" — this supplies the *actual mechanisms* beneath it. |
| 4 | Who serves / harms? | Serves founders shipping agents with tool access; no harm. |
| 5 | Cost / ceremony | Light — deepen one existing practice's "concrete defaults" section; no new file. |

## Verdict: ADAPT
The highest-leverage security find because it's host-native: BOSS literally runs on the sandbox Anthropic describes. ADAPT (deepen, don't duplicate): add concrete containment defaults to `agent-security.md` — mount-mode tiers, egress allowlists, the "isolation ∝ oversight" principle, and Redwood's single deployable nugget ("gate irreversible/critical tool calls behind a cheaper check or a human"). Drop the lab/enterprise framing — keep the founder-usable mechanisms.

## If ADOPT / ADAPT
- **What to do:** Route **UP** → expand `agent-security.md`'s "concrete defaults" with the containment tiers + gate-the-irreversible rule. → hand to `/boss-learn`.
- **What's modified:** Mechanisms only (mounts/egress/gate), not the AI-control research framing; "isolation ∝ oversight" stated as the JIT principle BOSS already preaches.

## Notes
- Prior related: [[RVW-032]], [[RVW-042]] (ASI threat model this defends against).
- BOSS version when recorded: 0.74.0
