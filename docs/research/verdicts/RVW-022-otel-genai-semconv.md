---
id: RVW-022
type: verdict
owner: product-lead
status: recorded
created: 2026-06-20
verdict: NOT-YET
route: n/a
---

# RVW-022 — adopt OpenTelemetry GenAI semantic conventions for agent traces

## The claim
- **Source:** opentelemetry.io/docs/specs/semconv/gen-ai
- **Core assertion:** conform agent/LLM telemetry to `gen_ai.*` spans so traces are portable/interoperable;
  map BOSS's `.boss/trace.jsonl` to the standard.
- **Inbox file:** `docs/research/inbox/otel-genai-semantic-conventions.md`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | OTel needs an SDK → zero-dep conflict; BOSS's trace is local-only by design. |
| 2 | Evidence grade | The semconv is **pre-stable** (schema URL still TODO, 100+ open issues) — a moving target. |
| 3 | Duplicate or sharpen? | BOSS's `auto-log` trace already exists, bespoke + minimal. |
| 4 | Serves / harms? | No founder need; interop matters only if BOSS exports telemetry (it doesn't). |
| 5 | Cost / ceremony | Conforming to an unstable spec = churn. |

## Verdict: NOT-YET
Don't chase a moving target. The honest move (already noted in IDEA-033) is to keep the trace schema
*mappable* to `gen_ai.*` later — small, recognizable field names — without conforming or taking the SDK now.

## If REJECT / NOT-YET
- **Why not:** pre-stable spec + zero-dep + local-only; no interop need.
- **Re-open condition:** the GenAI semconv reaches stable **and** BOSS (or a founder's project) actually
  needs to export traces to an observability tool.

## Notes
- BOSS version when recorded: 0.66.0
