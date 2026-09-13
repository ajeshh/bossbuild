---
id: RVW-017
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: NOT-YET
route: n/a
---

# RVW-017 — enforce structured output with constrained decoding (grammar / validate-and-repair)

## The claim
- **Source:** github.com/dottxt-ai/outlines + the "enforce, don't request" discourse
- **Core assertion:** asking for JSON isn't enough; use grammar-based constrained decoding to *guarantee*
  schema-valid output, or an explicit validate-and-repair retry contract.
- **Inbox file:** `docs/research/inbox/constrained-decoding-structured-output.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | Constrained *decoding* needs a library → fights zero-dep. The validate-and-repair *pattern* doesn't. |
| 2 | Evidence grade | Real, proven infra technique — but for production LLM pipelines, not first-time founders. |
| 3 | Duplicate or sharpen? | BOSS already preaches the structured-output *discipline* (Liu, in `/evals` + `/ai-first-init`). Enforcement is the missing layer — but not needed at BOSS's scale. |
| 4 | Serves / harms? | Serves infra teams; over-engineering for the founder cohort BOSS serves. |
| 5 | Cost / ceremony | A forbidden dependency + machinery the cohort doesn't need. |

## Verdict: NOT-YET
The cohort-facing version (push constrained decoding on founders) is wrong — wrong audience, forbidden
dep. The narrow internal kernel — a *validate-and-repair retry* around the loop runtime's own LLM-judge
parse — is sound but unneeded: the judge-parse doesn't flake today. Capture, don't build.

## If REJECT / NOT-YET
- **Why not:** zero-dep conflict + wrong cohort; the internal need hasn't materialized.
- **Re-open condition:** the loop runtime's judge-parse actually flakes in practice (a malformed
  judge-output breaks a moment) — then add a zero-dep validate-and-repair retry there, not founder-facing.

## Notes
- BOSS version when recorded: 0.66.0
