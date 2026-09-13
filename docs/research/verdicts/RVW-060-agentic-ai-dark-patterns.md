---
id: RVW-060
type: verdict
owner: product-lead
status: recorded
created: 2026-06-21
verdict: ADAPT
route: UP library/practices/ai-ux-patterns.md + library/practices/agent-security.md
---

# RVW-060 — agentic-AI dark patterns (the agent as victim AND as perpetrator)

## The claim
- **Source:** `/humane-refresh` first sweep, pass 2 (verified 3-0) — see
  [SESSION-2026-06-21-humane-refresh.md](../sessions/SESSION-2026-06-21-humane-refresh.md). Primary: Stanford
  **DECEPTICON** (agentdarkpatterns.org; arXiv 2512.22894; 700 tasks); **CHI 2026** GUI-agent study (arXiv
  2509.10723v1, 6 agents incl. OpenAI Operator / Claude Computer Use × 16 dark patterns); **OWASP Top 10 for
  Agentic Applications 2026** (Dec 9 2025).
- **Core assertion:** the classic human-facing dark patterns **transfer to and exploit AI agents acting on a
  user's behalf** — and agents are *worse* off than humans. DECEPTICON: dark patterns steered agent
  trajectories to malicious outcomes in **70%+ of tasks vs a 31% human average**; **larger models are MORE
  vulnerable**; goal-driven optimization makes agents comply *even when they notice* the pattern (noting but
  not deselecting a pre-ticked box). The flip side: an agent acting autonomously is itself a dark-pattern
  *vector* — commitment/purchase without clear consent, over-broad permissions, confused-deputy.

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — serves #6, and it's the *most* on-mission finding of the whole sweep: BOSS builds agentic products and *is* an agent. |
| 2 | Evidence grade | **Strong** — DECEPTICON + a CHI-2026-accepted study + OWASP's peer-reviewed framework, 3-0. (One adjacent claim — that human oversight reliably fixes it — was **refuted 0-3**; do NOT cite human-in-the-loop as a verified mitigation.) |
| 3 | Duplicate or sharpen? | **Both.** The agent-as-victim half *extends* [agent-security.md](../../../library/practices/agent-security.md) (already carries the OWASP Agentic ASI Top 10) with a new attack class — UI dark patterns as an injection surface. The agent-as-perpetrator half is **new** to the humane catalog. |
| 4 | Who serves / harms? | Serves every BOSS founder building an agent or an MCP tool, and the `/red-team` pass. Harms none. |
| 5 | Cost / ceremony | **Net-light** — extends an existing practice + one humane-catalog entry + a `/red-team` line. No new framework. |

## Verdict: ADAPT
This is the sweep's keystone for BOSS specifically. Adopt on **both** sides:
1. **Agent-as-victim → [`agent-security.md`](../../../library/practices/agent-security.md):** add "UI dark
   patterns are an injection surface" to the OWASP-Agentic threat model — an agent browsing/acting on the web
   is manipulated by the same Sneaking/Urgency/Forced-Action patterns that target humans, *more* often, and
   it gets *worse* as models scale. Crucial honesty: **recognition ≠ protection** (agents comply even when
   aware), and **in-context prompting + guardrail models were shown insufficient**, and **human oversight as
   a fix was refuted** — so the move is *narrow permissions + explicit confirmation before commitments*, not
   "tell the agent to watch out."
2. **Agent-as-perpetrator → [`ai-ux-patterns.md`](../../../library/practices/ai-ux-patterns.md):** add an
   "agentic dark patterns" entry — when *your* product's agent acts for the user, commitment-without-consent,
   over-broad permission grants, and opaque autonomous decisions are the dark patterns; the humane
   alternative is scoped permissions, surface-what-it's-about-to-do, and confirm before money/irreversibility
   (which is exactly §4's risk-tiered gate, now pointed at agent actions).

## If ADOPT / ADAPT
- **What to do:** (1) extend `agent-security.md`'s threat model with the UI-dark-pattern injection class +
  the "recognition ≠ protection / oversight-refuted" honesty; (2) add an "agentic dark patterns" entry to
  `ai-ux-patterns.md` tied to the §4 risk-tier gate; (3) a `/red-team --humane` line: does the product's
  agent commit/purchase without explicit confirmation? → `/boss-learn` (UP, both practices).
- **What's modified from the claim:** split victim/perpetrator across the two right-fit practices; carried
  the refuted-oversight caveat forward so BOSS doesn't oversell a fix.

## Notes
- Prior related verdicts: [RVW-042](RVW-042-owasp-agentic-asi-top10.md) (OWASP Agentic, the practice this extends), [RVW-056](RVW-056-canonical-dark-pattern-superset.md) (the human-facing families that transfer).
- Connects [[IDEA-026]] (Rule-of-Two / deterministic guard around a non-deterministic model) — the "narrow
  permissions + confirm" mitigation is the same shape.
- BOSS version when recorded: 0.95.0 (→ bump on implementation).
</content>
