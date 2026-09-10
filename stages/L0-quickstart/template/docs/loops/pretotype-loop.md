---
id: pretotype-loop
type: loop
stage: L0-quickstart
runner_type: skill
attributed_to: [Alberto Savoia, Ash Maurya]
also_relevant: [Eric Ries, Rob Fitzpatrick]
entry:
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md
      pattern: 'Riskiest assumption:\*\*\s+[^_].*[a-zA-Z0-9]{3,}'
      related_idea_not_matching: '^status:\s+dropped'
exit:
  - count_at_least:
      path_glob: docs/ideas/IDEA-*.md
      pattern: '^## Pretotype log'
      min: 1
---

# Loop: pretotype (Quickstart)

The discipline that gates *build* on *demand-test*. Encodes Savoia's *"make sure you're building
the right It, before you build It right."*

`runner_type: skill` — the `/pretotype` skill is the detector + runner. The loop's purpose is
*recording* the discipline as a project-level artifact + giving spec-loop a clean dependency to
declare ("pretotype should have happened before spec," when the project wants to be that strict).

This loop is **structural by default** — no `drift_moment` declared. The conscience doesn't nag
about un-pretotyped ideas at every prompt; that's exactly the over-fires-on-fresh-project failure
mode the v0.16 evals catch. Instead, the pretotype is *invited* by `/canvas`'s graduation moment
("Done!") and by the founder's own initiative via `/pretotype`. The loop tracks that it happened.

(Future v0.22+: a project could optionally add `drift_moment: caution` to this loop spec if they
want the conscience to nudge on un-pretotyped ideas accumulating. JIT principle: don't make this
the default ceremony.)

## Entry artifact

Canvas-loop has closed (a real riskiest assumption exists). Same entry as spec-loop — but spec-loop
lives one rung up, and that asymmetry is the point. Difference: spec-loop produces a FEAT;
pretotype-loop produces *demand evidence about the FEAT before it's built.* The discipline of
*running the pretotype between the canvas and the spec* is what this loop encourages — and the spec
is on the far side of `boss unlock mvp`, so this loop opens while the founder still has nothing to
defend.

> **Why this loop sits at Quickstart, though it used to sit at MVP.** Its entry predicate reads a
> Quickstart artifact — the canvas — and `/canvas`'s own graduation moment invites the pretotype by
> name. For as long as the runner shipped at MVP, the loop could open on a rung where nothing could
> answer it, and the only route to the demand test ran through the build unlock. That inverts the
> sentence this loop exists to encode. A demand test you can only reach by first taking the build
> tools is not a gate on building; it is a reward for having decided to.

## Purpose

Test demand for the bet via a fake-door / wizard-of-oz / Mechanical-Turk / Pinocchio / YouTube
test / impresario pattern. Record what was tested, the threshold, the result, and the persevere/
pivot/kill decision. YODA — Your Own Data > Anything (Savoia).

The `/pretotype` skill is the runner.

## Exit artifact

The active idea's file (`docs/ideas/IDEA-NNN.md`) contains a `## Pretotype log` section with
at least one dated entry recording: pattern, what was tested, threshold (set BEFORE running),
result, decision. The `count_at_least` exit predicate looks for this section across all idea
files.

## How to remix

- **Skip:** legitimate when the founder has external validation already (e.g., a customer
  pre-paid; an existing audience said yes; a similar product validated in the past). Record:
  ```
  - **OVERRIDE:** skipped `pretotype-loop` for IDEA-NNN — rationale: <external
    validation cited; what would re-open the loop if the validation turns out
    weaker than thought>.
  ```
- **Swap discipline:** Savoia-pretotype vs. Ries-MVP-experiment vs. Maurya-riskiest-assumption-
  test vs. Fitzpatrick-Mom-Test-conversation. Same loop shape; different practice. Note the
  swap in the idea's pretotype log: `Pattern: mom-test (instead of pretotype)` + the Fitzpatrick
  rationale.
- **Author your own:** a domain-specific demand test (e.g., regulatory-precedent-check for a
  legal-tech product). The shape stays: tangible/real-time/imminent metric, threshold-before-
  running, decision-after.

## When this loop re-opens

- The active idea pivoted significantly (riskiest assumption changed) → re-pretotype
- A previous pretotype result was ambiguous → re-design with a sharper test
- An external signal contradicts the original pretotype result → re-pretotype

## Cross-loop note

Pretotype-loop and spec-loop are *parallel*, not strictly sequential. Both depend on canvas-loop.
A project could pretotype-then-spec (the "test demand first" lineage) OR spec-then-pretotype
(less common; sometimes you need the spec to *describe* what you're pretotyping). The discipline
doesn't force order; just records that both happened before significant code lands.
