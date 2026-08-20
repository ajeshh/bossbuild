---
id: spec-loop
type: loop
stage: L1-mvp
runner_type: skill
attributed_to: [Eric Ries, Marty Cagan]
also_relevant: [Ash Maurya, Hamel Husain, Jason Liu]
entry:
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md
      pattern: 'Riskiest assumption:\*\*\s+[^_].*[a-zA-Z0-9]{3,}'
      related_idea_not_matching: '^status:\s+dropped'
exit:
  - count_at_least:
      path_glob: docs/ideas/FEAT-*.md
      pattern: '^# '
      min: 1
drift_moment: restraint
---

# Loop: spec (MVP)

The discipline that gates spec writing on canvas validation. Encodes **moment #4 — restraint
(premature ceremony)** from IDEA-008's collapsed-moments architecture: when the founder reaches
for `/spec` without canvas-loop having closed, the conscience surfaces a restraint nudge — name
what's missing, offer to back up, hand the decision back. Never block.

`runner_type: skill` because `/spec` itself is the detector (reads canvas-loop state at run time
and surfaces restraint). The hook doesn't auto-fire restraint nudges on every prompt — that would
nag any time the founder was in MVP mode with an unfinished canvas. The skill detection is
cleaner: it fires *when the founder is attempting the downstream loop.*

## Entry artifact

Canvas-loop has closed for *some* active idea — i.e., at least one canvas exists with a real
filled riskiest-assumption line, attached to a non-dropped idea. This is the literal Quickstart
canvas-loop's exit predicate, reused as spec-loop's entry.

## Purpose

Turn validated ideas into buildable features. The FEAT spec captures: goal, acceptance criteria,
smoke check, validated learning (Ries — v0.21.0+), evals (Husain — if AI-mediated), out-of-scope.
A clean handoff to `coder`.

## Exit artifact

`docs/ideas/FEAT-NNN-<slug>.md` exists with all required sections. (The exit predicate is loose
today — `any_file_matches` on `FEAT-*.md` — but the skill's expectation is the full template.
Future tighter predicate could check for the validated-learning + smoke-check sections being
filled.)

## Drift

`entry: not satisfied` (no canvas exists with a real riskiest assumption) AND `/spec is being
invoked` → moment #4 restraint fires from the skill. The skill reads:
- The cohort declaration in `.boss/config.json` (for cohort-aware voice composition)
- The canvas-loop state for the active idea
- Surfaces a Fitzpatrick-plain nudge: *"There's no canvas yet for this idea — want to pressure-
  test it first? `/canvas IDEA-NNN`. Or, if you've thought it through deeply already, you can
  proceed with the spec and record the override in the devlog."*

## How to remix

- **Skip:** legitimate — sometimes you've done the validation outside of `/canvas`. Override
  grammar:
  ```
  - **OVERRIDE:** proceeded `spec-loop` without `canvas-loop` exit — rationale:
    canvas-equivalent thinking done in <where>; riskiest assumption is <X>;
    test plan is <Y>.
  ```
  The override is the contract; the conscience respects it.
- **Swap discipline:** Maurya-style explicit canvas vs. Cagan-style "discovery-then-delivery"
  vs. Christensen-JTBD framing. Same loop entry shape (some pressure-test artifact exists);
  different practice inside.
- **Author your own:** a domain-specific validation loop (e.g., a regulatory-canvas-loop for a
  medical product) that satisfies spec-loop's entry differently. Author the loop spec.

## When this loop re-opens

- A new IDEA gets a canvas → spec-loop is openable for that idea
- An existing FEAT is revised significantly → re-enter spec-loop for the new shape
- Validated-learning section fails its experiment (Ries pivot) → re-open the canvas-loop
  upstream first, then re-spec
