---
id: RVW-025
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: ADAPT
route: DOWN stages/L1-mvp/template/.claude/skills/evals (one-line trajectory note)
---

# RVW-025 — evaluate agents on the trajectory (tool/decision path), not just the endpoint

## The claim
- **Source:** inspect.aisi.org.uk (UK AISI Inspect) + the 2026 eval discourse
- **Core assertion:** a right answer via a dangerous/wrong tool sequence is still a failure; assert on the
  *trajectory*, not only the final output.
- **Inbox file:** `docs/research/inbox/trajectory-based-agent-eval.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Sound principle; AISI Inspect is a credible reference implementation. |
| 3 | Duplicate or sharpen? | BOSS's `/evals` judges endpoints + failure-modes; the gate/judgment split + `/judge-traces` already exist. Trajectory-eval is a mild sharpening for multi-step tool flows — not present, but rarely needed at BOSS's scale. |
| 4 | Serves / harms? | Serves `eng-builder`/`domain-expert` with real tool chains; irrelevant to `first-product` with none. |
| 5 | Cost / ceremony | A one-line guidance addition is cheap; rebuilding an Inspect-style harness is not. |

## Verdict: ADAPT
Adopt the *principle* as a one-line addition to `/evals` guidance — *"for a multi-step tool flow, assert
on the path, not just the endpoint; a right answer via a bad sequence is still a fail"* — and **point to
AISI Inspect as the graduation reference** rather than building a trajectory harness. Don't push it on
cohorts with no tool chains.

## If ADOPT / ADAPT
- **What to do:** one sentence in `/evals` (the trajectory caveat + the Inspect pointer). → `/boss-learn`
  DOWN.
- **Modified from original:** guidance + reference, not a built harness; scoped to multi-step-tool FEATs.

## Notes
- Prior related: the gaps dossier (Tier 3, "partial gap").
- BOSS version when recorded: 0.66.0

## Routed via /boss-learn — APPLIED v0.67.0 (2026-06-20)
The ADAPT landed as specified above. See registry/CHANGELOG.md 0.67.0.
