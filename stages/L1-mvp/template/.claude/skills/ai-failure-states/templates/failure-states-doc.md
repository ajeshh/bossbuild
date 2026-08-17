# `/ai-failure-states` — the declaration doc skeleton (bundled resource)

> Loaded **on demand** from step 3 of `SKILL.md`. Write this to `docs/ai-failure-states.md`.

The **Eval-tested** field on each state (v0.30.0+) is what closes the *"stub forever"* loophole:
naming the eval case that actually exercises a handler turns a declaration into a contract.

```markdown
---
id: ai-failure-states
type: design-decisions
owner: pm
status: declared
updated: {{DATE}}
---

# AI failure states — {{PROJECT_NAME}}

## Cohort + context
- Cohort: <cohort name from .boss/config.json>
- AI-mediated surfaces: <which features depend on the model; pulled from docs/ai-first.md>
- Stakes: <low / moderate / high — names the regulatory or human-stakes context>

## The five failure states

### 1. Garbage output
- **Looks like:** <project-specific example>
- **Declared response:** <what the UI does, in code-level detail>
- **Fallback handler:** <name the function/component that owns this — e.g., `handleGarbageResponse()`,
  `<ErrorBoundary kind="malformed">`>
- **Eval-tested:** _(v0.30.0+)_ <eval case id that exercises this — e.g., `feat-007-fail-001-garbage`>
  or **STUB** (handler exists but no eval — record an override or write the eval).

### 2. Refusal
- **Looks like:** ...
- **Declared response:** ...
- **Fallback handler:** ...
- **Eval-tested:** <eval case id> or **STUB**

### 3. Hallucination
- **Looks like:** ...
- **Declared response:** ...
- **Fallback handler:** ...
- **Eval-tested:** <eval case id> or **STUB**

### 4. Timeout / network failure
- **Looks like:** ...
- **Declared response:** ...
- **Hard timeout (ms):** <per-call-site declaration>
- **Fallback handler:** ...
- **Eval-tested:** <eval case id> or **STUB**

### 5. Cost spike
- **Looks like:** ...
- **Declared response:** ...
- **Per-call token cap (in / out):** <numbers>
- **Fallback handler:** ...
- **Eval-tested:** <eval case id> or **STUB**

## Verification cadence
- Eval set covers each failure state (Husain): yes / no / partial.
  See `docs/evals/FEAT-NNN.yml`. **v0.30.0+: the `/evals` skill requires AI-mediated FEATs
  to include at least one `should-fail` case per declared failure state, categorized by
  `failure_mode` matching the names above.**
- Production telemetry: how do we know a failure happened? <log signal, alert, etc.>
- Review cadence: <weekly during MVP / monthly during V1>

## Override grammar (per IDEA-008)
When a failure-state response is intentionally not implemented (legitimate skip — e.g., feature
is dev-only and not user-facing yet) OR when **Eval-tested = STUB** is acceptable for now,
record in `docs/devlog.md`:
- **OVERRIDE:** skipped <failure-state-N> response on <date> — rationale: <why; expected
  re-open condition>.
- **OVERRIDE:** kept <failure-state-N> as STUB on <date> — rationale: <e.g., handler is a
  stub because production traffic hasn't surfaced this failure yet; will write the eval +
  implementation when FEAT-MMM ships>.
```
