---
id: capture-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ajesh Shah]
also_relevant: [Bob Moesta, Teresa Torres]
entry:
  - exists: { path: docs/ideas }
exit:
  - count_at_least:
      path_glob: docs/ideas/IDEA-*.md
      pattern: '^- [0-9]{4}-[0-9]{2}-[0-9]{2}'
      not_path_glob: docs/ideas/*-canvas.md
      exclude_files_matching: '^status:\s+dropped'
      min: 1
# No drift_moment — this loop is *structural*. It expresses the dependency that
# downstream loops (canvas-loop, etc.) check via their own entry predicates. It
# does NOT emit a drift signal when open at fresh-project state — that would be
# the conscience's over-fires-on-fresh-project failure mode (see moment-1 evals).
---

# Loop: capture (Quickstart)

The smallest possible scaffolding loop. The founder has *thought of something*, and BOSS gives
them a place to put it. That's all this loop is for. Its job is to make sure the founder isn't
trying to do downstream work (canvas, spec, build) on a thought that hasn't even been written
down yet.

## Entry artifact

`docs/ideas/` exists. Created by `boss new`. Always satisfied in a real BOSS project.

## Purpose

Get the founder's thought *into a document* with low ceremony. The `/idea` skill is how this
loop is run. The exit is one dated capture-log entry in any active idea file.

## Exit artifact

≥1 dated capture-log entry in any active (non-dropped) `IDEA-NNN.md` file.

## Drift

This loop "drifting" means the project has a `docs/ideas/` directory but no captured ideas yet.
The signal: *the founder is reaching for downstream work — `/canvas`, `/spec`, `boss unlock` —
on nothing.* That's restraint (moment #4) coming through the loop-graph: trying to open a
downstream loop without this one's exit being satisfied.

For most projects this loop closes within the first minute of use (running `/boss` or `/idea`
once). It exists as a primitive so the loop-graph has a coherent foundation, not because the
discipline of capture-something-before-thinking-bigger needs much policing.

## How to remix

- **Skip:** never legitimate. If you haven't captured a thought yet, every downstream loop is
  fiction. Override would only make sense for a brownfield project — see IDEA-005 (`boss adopt`)
  for how a project that already exists declares its captures as already-closed.
- **Swap discipline:** Bob Moesta's *forces of progress* lens vs. Ajesh's living-doc capture
  lens. Same loop shape; different framing of *what's worth capturing.* Note in the IDEA's
  frontmatter (`captured_via: moesta-forces`) if remixing.
- **Author your own:** rare — capture is foundational. If you find yourself wanting a
  *structured* capture loop instead of the living-doc one, that's a different upstream entirely
  (maybe `interview-loop`?). Author it; `/boss-learn` UP if generalizable.
