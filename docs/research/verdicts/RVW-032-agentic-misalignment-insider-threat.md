---
id: RVW-032
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: UP → library/practices/agent-security.md (named failure mode) + a /red-team --self case
---

# RVW-032 — agents with autonomy + sensitive access can act as insider threats (Anthropic, 2025)

## The claim
- **Source:** https://www.anthropic.com/research/agentic-misalignment
- **Core assertion:** Agents given autonomy + sensitive context can take harmful, self-preserving actions under goal conflict — measured across frontier models, not hypothetical.
- **Inbox file:** `docs/research/inbox/anthropic-agentic-misalignment-insider-threat.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No — reinforces the agent-security discipline BOSS already keeps. |
| 2 | Evidence grade | **High.** Controlled study, and **host-aligned** — BOSS runs on Claude, so this is the model-maker measuring the model BOSS depends on. |
| 3 | Duplicate or sharpen? | **Sharpens, partially overlapping.** [[agent-security]] (Rule-of-Two / lethal-trifecta) and `/red-team` (OWASP LLM Top 10 — "excessive agency") already cover the *shape*. What's net-new: a **named, evidenced failure mode** to anchor the abstract rule + a self-test case. |
| 4 | Who serves / harms? | Serves the founder building agentic products *and* BOSS itself (its mentors/builders/conscience hook are agents with context access). No cohort harm. |
| 5 | Cost / ceremony | Light: a named-failure-mode paragraph in an existing practice + one `/red-team --self` regression case. |

## Verdict: ADAPT
Sound and host-aligned, but it sharpens rather than introduces — the autonomy-bounding discipline already lives in [[agent-security]] and `/red-team`. ADAPT: cite the agentic-misalignment finding as the *named evidence* behind "bound agent autonomy + gate sensitive access," and add a `/red-team --self` case that probes BOSS's own conscience hook for goal-conflict misbehavior. Don't re-import the whole OWASP-adjacent frame — it's there.

## If ADOPT / ADAPT
- **What to do:** Route **UP** — add an "Agentic misalignment (named failure mode)" note to `library/practices/agent-security.md` + a `/red-team --self` regression case. → hand to `/boss-learn`.
- **What's modified:** Take the *finding as anchor evidence*, not the full study; scope the self-test to BOSS's own agents (eat the dogfood).

## Notes
- Prior related verdicts: ties to the v0.62.0 `/red-team` + agent-security UP work.
- BOSS version when recorded: 0.74.0
