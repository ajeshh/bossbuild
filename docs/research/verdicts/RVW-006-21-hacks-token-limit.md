---
id: RVW-006
type: verdict
owner: product-lead
status: recorded
created: 2026-06-02
verdict: REJECT
route: n/a
---

# RVW-006 — "21 hacks to never hit Claude's limit"

## The claim
- **Source:** Infographic, Ruben Hassid / "How to AI" (how-to-ai.guide). `docs/research/inbox/21-hacks-never-hit-claude-limit.md`
- **Core assertion:** *21 tactics to minimize Claude token/usage limits* (convert files, plan-in-chat,
  batch prompts, pick the cheap model, summarize every 15-20 msgs, new-topic-new-chat, spread across
  the 5-hour window, etc.). Plus a comment: *use separate conversations to plan / review / execute —
  "if your plan can't survive a new context window it's probably not ready to implement."*

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No single veto — but it's the wrong *altitude* for BOSS (token-thrift tips, not building-a-real-business discipline). |
| 2 | Evidence grade | **Low** — a content-marketing infographic (funnel to how-to-ai.guide), no data. The comment is better (a real discipline idea). |
| 3 | Duplicate or sharpen? | Mostly **out of scope** (Claude product/token usage BOSS doesn't own). Hack 3 ("ask me questions") **duplicates** [[RVW-001]]. The comment's "survive a fresh context window" *could* mildly sharpen `/spec`. |
| 4 | Who serves / harms? | N/A — these are end-user Claude efficiency tips, not a BOSS practice for any cohort. |
| 5 | Cost / ceremony | Adopting 21 disparate tips = noise; several are version-bound + vendor-specific (Cowork, wispr.ai, the 5-hour window). |

## Verdict: REJECT

A listicle, not a practice — low evidence, mostly token-usage tactics outside BOSS's scope and
altitude, with the few BOSS-adjacent items already covered ([[RVW-001]], [[RVW-010]]'s real version of
"keep context lean"). Rejected as a unit.

## If REJECT / NOT-YET
- **Why not:** scope + altitude (token-thrift ≠ BOSS's build-a-real-business thesis) + low evidence
  (marketing infographic).

## The one keeper

The comment — *"if your plan can't survive a new context window, it's probably not ready to be
implemented"* — is a genuine **plan-legibility test** and the only non-noise item. Logged as a small
candidate: a fresh-context legibility check for `/spec` acceptance, or a plan→review→execute
separation. **Not promoted now** (founder-facing, minor, and `/spec` already demands real acceptance
criteria). If it recurs from a stronger source, it earns its own drop.

## Notes
- Independent source — no author-concentration discount.
- BOSS version when recorded: 0.41.0
