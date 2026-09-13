---
id: IDEA-008
type: idea
owner: product-lead
status: shipped (v0.18.0)
gist: Loops keyed to evidence instead of time — because AI broke the link between wallclock and output, and every sprint-shaped scaffold inherited the rot.
program: the-record-system
proof: stages/L0-quickstart/template/.boss/loops
created: 2026-05-22
shipped_on: 2026-05-22
---

# Evidence-keyed loops + the remix model

> The next scaffolding primitive. Captured after Ajesh observed that **time is the wrong unit**
> (people belt out companies in weekends; "Week 1, Week 2" framing is dead) **and** that **each
> founder will remix methods — borrow from Ries here, Savoia there, invent their own there.**
> Those two observations resolve into one design.

## Current shape

### The diagnosis (why this is needed)

- **Time was the unit by accident** — pre-AI, it correlated with effort; effort correlated with
  output. AI broke the chain. Now wallclock has near-zero correlation with output. The unit is
  vestigial; the scaffolds built on it (sprints, weeks, quarterly planning) inherit the rot.
- **Effort isn't the right replacement either.** "How hard did you work" is the vanity metric of
  project planning (Ries's distinction, applied one level up). The only useful metric is
  *validated learning produced.* Output is the unit, not input.
- **The boomerang pattern Ajesh named is the real cost.** People skip discipline steps because
  they can move fast; then they double-back when something they skipped becomes load-bearing. The
  cost of that double-back compounds, *and is invisible to time-keyed scaffolding* — by wallclock,
  the founder "made progress." By learning, they didn't.
- **And each founder will remix.** Some will be Maurya-canvas-first; some will be Karpathy-tight-
  loop-first; some will invent something neither person taught. **BOSS prescribing one method is
  itself the Principle-2 trap.** What BOSS can prescribe is the *type system* for evidence —
  what counts as "I earned this" — not the curriculum.

These two facts (time-isn't-the-unit + founders-remix) point at the same primitive.

### The primitive — *loop*

A **loop** is the unit of scaffolded progress. It has exactly four fields:

| Field | Meaning |
|---|---|
| **Entry artifact** | The specific evidence that must exist *before* this loop opens. A sharp canvas cell. A deployed URL. A transcribed user call. An LLM call in the codebase. Concrete, namable, checkable. |
| **Purpose** | The *one learning* this loop is designed to produce. Not "build feature X" — *learn whether assumption Y is real.* |
| **Exit artifact** | The concrete output that proves the loop closed. A signup count from a fake door. 5 transcribed interviews + 3 synthesized patterns. An eval set with N labeled examples passing. A pivot/persevere verdict written in the canvas. |
| **Drift signal** | The condition the conscience watches for — *"this loop is being attempted without its entry artifact"* (skipped a step) **or** *"this loop has been open for too many sub-actions without progress on its exit artifact"* (loop is stalling). Both are forms of the same thing: the dependency graph being violated. |

Loops are:

- **Time-agnostic.** A loop can close in 20 minutes or 3 weeks. Both are fine; both are progress.
- **Partially-ordered, not sequential.** Loops form a *DAG* over their entry/exit artifacts —
  the dependency is *artifact*, not *order in time*. Many loops can be open simultaneously; some
  can be paused; one can be re-opened when new evidence forces it.
- **Re-entrant.** Closing a loop doesn't mean it's done forever — new evidence can re-open it.
  ("The pretotype said yes; the prototype said no — re-open the pretotype loop with a sharper
  test.")

### The remix model

BOSS ships a **library of named loops** — each attributed to its source practitioners, each with
the four fields filled in. The founder composes their own loop graph by:

1. **Picking which named loops to open** — they don't have to open all of them. Skipping is fine
   *as long as the next loop they open doesn't have a missed-artifact dependency.*
2. **Remixing a loop in place** — swap the practitioner whose discipline runs it. ("I want the
   eval loop, but I'm using Liu's structured-output rigor, not Husain's example-set rigor — I'll
   note that.") The loop's *type* (entry/exit) stays the same; the *practice* inside changes.
3. **Authoring their own loops.** A founder can define a new loop with the four fields and
   contribute it back (via `/boss-learn` UP into `library/practices/loops/`). Over time, the
   named-loop library grows from real practice.
4. **Overriding the conscience consciously.** When the conscience says "you're opening loop X
   without artifact Y" — the founder can override. The override is *captured* as part of the
   project's record. ("Skipped pretotype on 2026-05-29; rationale: prior similar product
   validated; check in if prototype hits resistance.") That capture *is* the remix evidence.

The principle: **BOSS makes deviation conscious, not impossible.** Override is always available;
it's always *recorded*. Over enough projects, the overrides themselves become signal — they tell
us which named loops are too rigid, which are universally skipped (suspicious), which the
specific founder always skips (their personal style).

### The conscience becomes generic

The big elegance: **moments #3 (capture) and #4 (restraint) stop being bespoke detectors.** They
collapse into one mechanism:

> *The conscience fires when an artifact dependency is violated in the live loop graph.*

- **"Captured a lot, validated nothing"** (moment #1) → you opened the canvas loop without its
  upstream artifact (a real captured idea past N notes); or you're attempting a build loop
  without canvas's exit artifact (the sharp riskiest assumption).
- **"Done!"** (moment #2) → an exit artifact just landed that closes a load-bearing loop. The
  conscience names what crossed.
- **"Reusable value at a breakpoint"** (moment #3) → during a loop, the founder produced an
  artifact that's broader than this loop's exit — a generalizable practice. The conscience
  notices and offers `/boss-learn` UP.
- **"Premature ceremony"** (moment #4) → the founder is opening a loop downstream of their
  current evidence. (Spec loop without canvas exit; eval loop without an LLM call existing.)

**One detector type, four (and counting) surface behaviours.** This is the bigger architecture
win than the cadence itself.

### How the tensions resolve

Ajesh named several tensions implicitly:

| Tension | How loops + remix resolve it |
|---|---|
| **Speed vs. discipline** (Group A vs. Group B in the v1 playbook) | Each loop is one practitioner's discipline; the founder opens loops at the speed they want. Speed is opening more loops in parallel + closing them tighter; discipline is closing them on real exit artifacts. Both are loop-graph properties. |
| **BOSS's opinions vs. founder's remix freedom** | BOSS *names* good (the loop library); the conscience *checks types* (artifact dependencies); the founder *chooses methods*. Method ≠ type. |
| **Named methods vs. invented methods** | The four-field primitive accepts both. Author your own loop; it composes with the rest. `/boss-learn` carries it UP if it's generalizable. |
| **One canonical loop set vs. many possible sets** | One *primitive* (the loop), many *instances* (named or invented). The graph for each project is the founder's. |
| **Discipline (do the upstream) vs. autonomy (skip if you must)** | The conscience surfaces the dependency; the founder decides. Every skip is recorded. Conscience makes the skip *conscious*; it never gates. |

### Worked example — the eval loop, fully designed

The eval loop is the next thing BOSS itself needs to build (per the advisory pass — the highest-
leverage gap is that the conscience has no evals). It's also a clean test case for the loop
primitive.

```
LOOP: eval-loop
  attributed-to: Hamel Husain (primary), Jason Liu (secondary — for structured outputs)
  also-relevant: Karpathy (think in distributions), Willison (evals as code, version them)

  ENTRY ARTIFACT:
    Any LLM-mediated control-flow point exists in the project.
    Concretely for BOSS: the conscience hook returns additionalContext to Claude
    (i.e., the project's behavior depends on a model output).
    Checkable by: `git grep` for hook returns, LLM API calls, prompt strings used in flow.

  PURPOSE:
    Produce a labeled "should fire / should NOT fire" example set so the LLM-mediated
    behavior can be measured, regressed, and iterated on with evidence, not vibes.

  EXIT ARTIFACT:
    docs/architecture/conscience-evals.md (or equivalent per project) containing:
      - ≥20 should-fire examples per moment, each with: project state, user input,
        expected detection signal, the *why*.
      - ≥20 should-NOT-fire examples per moment, *categorized by failure mode* —
        over-fires-on-fresh-project, fires-mid-other-work, repeats-itself, etc.
      - A runner that exercises the detector against this set and reports pass/fail
        per case (CI-runnable or local-runnable).
    + the hook refactored to ship structured `{moment, confidence, evidence, suppress_if}`
      instead of free-form `additionalContext` (Liu's discipline — schema, not prose).

  DRIFT SIGNAL (the conscience watches for):
    - **Skipped:** a new conscience moment (#3, #4) is being designed/built without
      this loop having closed for it. (You'd be shipping detection logic with no way
      to know if it's right — vibes-based AI in BOSS, the thing it's supposed to
      prevent in others.)
    - **Stalled:** loop is "open" but the example set hasn't grown in N sub-actions.
      Time-agnostic; counts work, not days.

  HOW TO REMIX:
    - Skip: legitimate if the LLM call is truly throwaway (one-off script). Override
      captured. For a load-bearing detector like the conscience: skipping it is the
      override, and it should be the kind of override that re-opens itself on the
      next bug report.
    - Swap discipline: instead of Husain's example-set-first, use Liu's
      programmatic-instruction-tuning-style (same prompt, eval-set, prompt-variants,
      measure deltas). Same loop type; different practice inside.
    - Author your own: e.g., a domain-expert-review loop where a real human (not the
      LLM) labels failures — useful when stakes are high (legal, medical, etc.).
      That's a different *named loop* with a similar exit shape.

  WHEN THIS LOOP RE-OPENS:
    - A new moment is added → re-open with that moment's labeled set
    - A real-user report says the detector fired wrongly → add the case + re-run
    - The model shifts (host upgrade, prompt change) → re-run the existing set
```

This is what one loop spec looks like. It's about a screenful of structured prose; it survives
remix; the conscience can check entry/exit/drift mechanically.

### What this changes for BOSS itself

1. **The v1 playbook is superseded as the prescribed cadence**, but its practitioner material is
   reusable — each section becomes a *practice* attached to one or more loops. Don't delete; mark
   `draft-pending-loops-spec` and treat as raw material.
2. **The eval loop spec above becomes the first real artifact** the loops primitive is tested on.
   If the primitive holds (entry/exit are unambiguous, drift is checkable, remix is possible
   without breaking the conscience), generalize. If not, refine before shipping more loops.
3. **The conscience refactor (structured output) is now inside a loop, not a free-floating
   capability.** It has an entry artifact (the LLM-mediated point), an exit artifact (the
   schemafied hook + the example set), and a drift signal. Means it's natively measurable.
4. **Moments #3 and #4 should not be built as bespoke detectors.** They should be built as
   *applications* of the generic artifact-dependency-violation detector. One mechanism, many
   surface behaviours — far more leverage.
5. **`/spec` (already shipped in MVP) gets a Loop-graph field** — every FEAT names which loop it
   advances, what entry artifact it requires, what exit artifact it produces. Pulls the loops
   primitive into the existing scaffold without a new skill.

### What this changes for projects BOSS scaffolds

- **Modes (Quickstart → MVP → V1 → Scale) stay** — they're the macro scaffold, evidence-keyed
  already. Loops are the micro scaffold *inside* a mode.
- **Each mode ships a default loop library** (e.g., Quickstart's loops: capture-loop, canvas-loop;
  MVP's loops: pretotype-loop, prototype-loop, eval-loop, conversation-loop, decision-loop). The
  founder remixes within the mode.
- **The mode's CLAUDE.md / working rules name the loop library + the conscience's role**
  ("BOSS catches missing artifacts; it doesn't pick your method"). The founder ships their own
  loop graph in `docs/loops/` (or similar) — a project-level artifact that captures their remix.
- **Skills like `/triage`, `/canvas`, `/spec`, `/smoke`, `/log`, `/close` become loop operations**
  — they're how the founder *runs* a loop, not separate ceremonies.

## Capture log

- 2026-05-22 — Ajesh: "most people have stopped using time in building out an app. We need to find
  another way to quantify or qualify effort. In a day/hour/weekend/weeks people are belting out
  full new companies." Plus: "each person may wanna remix and create their own method." These
  resolve into one primitive: artifact-keyed loops that compose freely. The conscience becomes
  method-agnostic; it checks type dependencies, not curriculum compliance.

## Resolved decisions (each can be refined when the eval loop runs)

### 1. Smallest set of named loops at MVP — **5 loops: pretotype, prototype, eval, conversation, decision**

Tried to collapse and couldn't:

| Loop | Entry | Purpose | Exit | Lead practitioners |
|---|---|---|---|---|
| **pretotype-loop** | Sharp riskiest assumption named on canvas | Test *demand* before building | Demand signal recorded (signups, click-throughs, "yes I'd buy" commitments) | Savoia, Maurya |
| **prototype-loop** | Demand signal + sharp UVP | Build smallest live version | Deployed URL doing the smallest thing | Rauch, Karpathy, Mollick, Willison |
| **eval-loop** | Any LLM-mediated control-flow point | Make AI behavior measurable | ≥20 should-fire + ≥20 should-NOT-fire examples (categorized) + structured outputs | Husain, Liu |
| **conversation-loop** | A working pretotype OR prototype OR a sharp hypothesis | Hear from real humans, not the model | ≥5 transcribed interviews + ≥3 synthesized patterns | Fitzpatrick, Maurya, Torres |
| **decision-loop** | Other loops have produced their exit artifacts | Close the cycle with a verdict | Written pivot/persevere/kill decision in canvas | Ries, Maurya |

The five are irreducible — each has a distinct entry, purpose, exit, and lead discipline. Could
argue conversation is *part of* pretotype/decision, but Ries/Fitzpatrick treat it as its own
discipline (the question is different in each); keep separate.

### 2. Loop-graph storage — **`docs/loops/<name>.md` is the single source of truth**

Human-authored markdown with YAML frontmatter. No `.boss/loops.json`. The conscience reads the
markdown at hook time and parses the predicates (next decision). Same pattern as `docs/ideas/` —
one file = one entity, frontmatter is structured, body is rationale.

Rationale: dual sources of truth drift; the JSON would just be a derived index. Defer it until
performance forces it (Node can parse 5–20 markdown files in <50ms; that's well inside the hook
budget). When/if it's needed, generate it from the docs, never the other way.

### 3. Generic artifact-dependency checking — **predicate vocabulary in the loop frontmatter; one Node evaluator replaces the hand-coded hook**

Each loop's entry/exit artifact is declared as a predicate the conscience can evaluate against
the project's filesystem. A small, closed vocabulary:

| Predicate | Meaning | Example |
|---|---|---|
| `exists: <path>` | A file exists at this path | `exists: docs/ideas/IDEA-NNN-canvas.md` |
| `contains: { path, pattern }` | File matches a regex on a line | `contains: { path: docs/ideas/*-canvas.md, pattern: 'Riskiest assumption:\*\*\\s+[^_]' }` |
| `count_at_least: { path_glob, pattern, min }` | ≥N matches across globbed files | `count_at_least: { path_glob: docs/ideas/IDEA-*.md, pattern: '^- \\d{4}-\\d{2}-\\d{2}', min: 3 }` |
| `recorded_at: <path>` | Founder wrote external signal at a known path | `recorded_at: docs/loops/pretotype/signal.md` |

The conscience hook becomes a generic loop-evaluator: load all `docs/loops/*.md`, evaluate each
loop's entry-artifact predicates against the project state, classify each loop as
`unopenable / openable / open / closed`, detect drift (an "open" loop with no recent progress on
its exit predicate, or a user attempting downstream work without upstream artifacts). Returns the
same `additionalContext` shape — Claude composes the voice.

The current hand-coded hook becomes ONE instance of this vocabulary (the count-at-least + the
contains predicates on canvas state). Implementation effort: ~1 day once the predicate set
survives the eval loop's first run.

### 4. Override capture — **devlog with a structured tag**

When a founder skips a loop or proceeds with an unmet upstream artifact, the override is captured
inline in `docs/devlog.md` (the existing append-only journal). One tag, one grammar:

```markdown
## 2026-05-29
- **OVERRIDE:** skipped `pretotype-loop` — rationale: prior similar product validated;
  re-open if prototype hits resistance.
- **OVERRIDE:** proceeded `eval-loop` without `prototype-loop` exit — rationale: evals are
  for the conscience itself, prototype doesn't apply.
```

Grammar (regex-grep-able by the conscience): `^- \*\*OVERRIDE:\*\* (skipped|proceeded) \`(\S+)\` — rationale: (.+)$`

The conscience reads overrides at hook time so it doesn't re-fire on already-acknowledged drift.
The founder owns their record; future-them sees the rationale; the conscience respects the
choice. This makes deviation conscious without making it bureaucratic.

### 5. FEAT promotion timing — **Path B: run the eval loop *as a user* of the primitive first; promote to FEAT after**

Don't spec IDEA-008 as a buildable feature yet. Write `docs/loops/eval.md` by hand using the
four-field shape; run it; produce the example set + the schemafied hook. See if the four fields
held up unambiguously, whether the predicate vocabulary above covered what the loop needed,
whether the override-capture format was natural.

Two outcomes possible:

- **The primitive holds:** promote IDEA-008 → FEAT-NNN. Spec covers: predicate evaluator (~1 day),
  generic conscience hook reading `docs/loops/*.md` (~half-day), MVP-template's loop library
  populated with 5 loop docs (~1 day). Retire moment #1's bespoke hook by porting it into the
  generic evaluator — net code *decreases*.
- **The primitive doesn't hold:** refine IDEA-008's shape *before* any code. Specifically: which
  field was ambiguous? Did a real loop need a 5th field? Did the predicates fail to cover a
  case? Capture that, iterate the spec, re-run.

This is the Savoia move on the meta-design itself: don't build the framework; pretotype one
instance and let it teach you the framework's shape.

### 6. Conflict check with existing IDEAs — **no conflicts; three refinements to apply**

- **IDEA-003 (mentor practitioners → encoded UP):** *refinement* — what `/boss-learn` carries UP
  is now *loop specs* with the four fields, not free-floating practice docs. Sharpens the IDEA-003
  finish task: practitioner encoding produces named loops (or named *variants* of existing loops),
  attributed, citable, composable. Loops are the artifact shape that makes practitioner
  encoding load-bearing rather than decorative.
- **IDEA-004 (temple culture):** *no conflict, fits underneath* — temple values become predicates
  attached to specific loops (e.g., a values-check predicate on decision-loop's exit: "does this
  decision pass the do/avoid/escalate filter?"). Loops carry temple; temple uses loops.
- **IDEA-005 (brownfield adoption):** *no conflict, gets simpler* — `boss adopt` declares which
  loops are already closed-by-existing-evidence in a brownfield project (the app shipped years
  ago; the prototype-loop is closed by definition). Loops give brownfield a clean way to *skip
  past* upstream artifacts without losing the conscience.
- **IDEA-006 (host portability):** *no conflict, gets sharper* — loops cleanly separate two
  layers: the predicate evaluator (host-agnostic filesystem checks, plain Node) and the
  signal-injection (host-bound; Claude Code's `additionalContext` today, something else
  elsewhere). The host contract IDEA-006 needs to name is now just "signal-injection," which is
  ~10 lines of API surface, not the whole conscience.
- **IDEA-007 (brand spectrum):** no interaction.

## Meta-learnings from running the eval loop (v0.16.0 — first proof of primitive)

The eval loop was run as the first real instance of the primitive. Artifacts produced: the loop
spec at `docs/loops/eval.md`, 84 labeled examples across two moments (43 + 41), a zero-dep
Node runner with a custom YAML parser, the hook refactored to structured `{moment, confidence,
evidence, suppress_if}` output. The runner: **43/43 pass on every runnable case; 41 skipped
as future-work (documented).** Caught + fixed 3 real hook bugs the evals exposed (single-char
placeholders like `?` slipped through; dropped ideas weren't being excluded from drift counts).

What the run taught us about the primitive itself:

- ✅ **The four fields held up.** Entry, purpose, exit, drift were all unambiguous and useful.
  No need for a 5th field. The proposed `lead practitioners` + `also relevant` + `how to remix`
  + `when this loop re-opens` belong in the loop *body*, not as additional structured fields —
  prose handles them better than fields would.
- ✅ **Predicate vocabulary survived.** `exists`, `contains`, `count_at_least`, `recorded_at`
  covered everything the eval loop needed. The runner constructs synthetic project state from
  these and runs the actual hook against it — no abstraction leaks observed.
- ✅ **Multi-part exit artifacts are fine.** The eval loop had 5 exit artifacts (two YAML
  files, README, runner, structured hook output). The primitive correctly modeled this as a
  list under `exit:` rather than forcing one-artifact-per-loop.
- ✅ **Eval-first discipline worked exactly as Husain says.** 3 bugs surfaced in ~30 min of
  running — one (status-aware filtering) was a hole nobody would have written a test for
  retroactively; only `should-NOT-fire` discipline surfaces it.
- ✅ **Skip-with-reason is the right runner pattern.** ~49% of examples (41/84) test features
  not yet implemented (`suppress_if` cases, devlog awareness, moment-2 which lives in `/canvas`
  skill, signal-text violations). Skipping with categorized reasons (vs failing) keeps the eval
  set forward-looking without breaking the green gate.

What the run *did* surface that needs Ajesh's read:

- ⚠️ **Moment-2 isn't hook-detected — it's a `/canvas` skill behavior.** The eval set captures
  expected behavior; the runner has no way to *execute* the detector today (the skill prompt
  is in markdown, not code). This isn't a flaw in the loop primitive — the eval loop's exit
  artifact (the labeled set + the structured signal where applicable) is still right. It does
  mean **future loops will need different *runners*** depending on whether the detector is
  code (hook), prompt (skill), or human (manual review). Worth naming as a *runner type* axis
  alongside the predicate vocabulary.
- ⚠️ **m1-snf-021 (single-idea-deepening) is a real ambiguity that needs Ajesh's call.** Is
  3+ captures on ONE idea drift, or is it deep iteration on one bet (the opposite of drift)?
  Current hook treats it as drift (counts total). The eval marks it `should-not-fire` with
  category `false-positive-not-drift` — but is that right? Honest case for either reading.

What was deferred and remains future work:

- `suppress_if` implementation requires session-state tracking (recently-fired, state-hash
  comparison) — the structured output is in place, the runtime suppression logic isn't.
- Devlog awareness (`acknowledged_in_devlog` override) — the most useful unimplemented
  suppress_if. Honest founder-respect requires this.
- Project-config opt-out (CLAUDE.md amendments disabling a moment) — implementation TBD.
- Signal-text evals — moment-2's `performed-warmth` / `removes-agency` categories test the
  signal *text*, which needs a separate runner (likely LLM-as-judge with examples of the judge
  being wrong, per Husain).

**Verdict on the primitive: the four-field shape is correct and ready to promote to FEAT.**
Build the generic conscience evaluator (replaces hand-coded moment-1 detector), add 2-3 more
named loops (pretotype, conversation, decision), retire moment #1's bespoke trigger by porting
it into the generic evaluator. Net code *decreases* as the abstraction lands.

## Still-open (need Ajesh's read, not more thinking)

- The single-idea-deepening case (m1-snf-021): drift or depth? Affects how the generic detector
  treats per-idea vs aggregate counts.
- Whether to add a `runner_type` field to loop specs (`hook | skill | manual | external`) so
  the evaluator knows what kind of detector to invoke. (Probably yes — surfaced by moment-2.)
- Override-capture grammar: was the `**OVERRIDE:** action `loop` — rationale: ...` format we
  declared in resolved-decisions section #4 right? Not yet tested — needs to be exercised by
  a real override in some loop before we can know.

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
