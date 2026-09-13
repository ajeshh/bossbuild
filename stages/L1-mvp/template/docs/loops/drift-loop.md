---
id: drift-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah (PRINCIPLES — "build faster without fooling themselves")]
also_relevant: [Eric Ries (validated learning), Ash Maurya (riskiest assumption first), Rob Fitzpatrick (talk to someone before you build)]
entry:
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      pattern: 'Riskiest assumption:\*\*\s+[^_].*[a-zA-Z0-9]{3,}'
      related_idea_not_matching: '^status:\s+dropped'
  - count_at_least:
      path_glob: docs/devlog.md
      pattern: '^## \d{4}-\d{2}-\d{2}'
      min: 3
exit:
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      pattern: 'Experiment this week:\*\*\s+[^_].*[a-zA-Z0-9]{3,}'
      related_idea_not_matching: '^status:\s+dropped'
drift_moment: drift
---

# Loop: drift (MVP) — the work vs. the named risk

> *"BOSS helps founders build faster without fooling themselves — compressing the loop from idea
> to evidence while continuously checking the work against real pain, real workflows, real buyers,
> real economics, and real distribution."* — PRINCIPLES.md, the why.

This is the closest loop to the reason BOSS exists. The other moments catch *structural* gaps —
no canvas, no budget, no failure-states. This one catches the gap PRINCIPLES.md names first and
that no predicate can fully see: **you named the bet that could sink this, and then you spent your
sessions building something else.**

It fires in the gap *between* moment #1 (`caution` — no riskiest assumption named yet) and the
graduation moment (`done` — the riskiest assumption has a validation plan). Caution covers "you
haven't named the risk." This covers "you named it, you've been building for a few sessions, and
nothing you've built tests it."

## The judgment the predicate can't do (and the model can)

The predicate gate is deliberately cheap and structural: *a riskiest assumption is filled in, work
has accumulated (≥3 devlog entries), and no "Experiment this week" validation plan exists yet.*
That's all regex can prove. It cannot read the five recent devlog entries and tell whether the work
is **about** the named risk or **around** it. That semantic comparison — stated bet vs. actual
work — is the model's job, and it's the whole value of this moment.

So the loop **opens the door**; the model walks through it with judgment. When the door is open,
the conscience hands the model a bounded instruction (read the riskiest-assumption line + the most
recent ~5 devlog entries + the open FEAT/spec, nothing wider) and asks it to judge: is this work
testing the risk, or building past it? If drifted, name the specific gap — *"you said X is the bet
that could sink this; the last sessions built Y and Z; neither tests X"* — and ask what the smallest
experiment on the risk would be. If the work **is** engaging the risk, stay silent. Silence is the
correct output when the founder is on-aim.

This is the same shape as `extraction-loop` / `/extract`: a cheap heuristic gate fronting a model
judgment the regex can't make. The difference is host-binding — `/extract` is a skill the founder
invokes; this fires *unprompted* through the hook, because a founder who has drifted from their own
stated bet is precisely the founder who won't think to ask whether they've drifted.

## Entry artifact

Two predicates, both required:

1. **A named risk** — at least one active (non-dropped) idea's canvas has a real riskiest-assumption
   line (same predicate `canvas-loop` uses for its exit; the `[^_]` rejects `_(placeholder)_` fills).
2. **Accumulated work** — `docs/devlog.md` has ≥3 dated entries (`^## YYYY-MM-DD`). Same threshold
   and surface as `extraction-loop`: three sessions in is the inflection where "still building the
   first thing" becomes "have I been building toward the bet?"

Confidence scales with devlog overshoot (the runtime reads the count predicate): 3 entries → low,
4–5 → medium, 6+ → high. More sessions deep without a validation plan = a louder signal.

## Purpose

Keep the work pointed at the riskiest assumption. The failure mode this prevents is the one
PRINCIPLES.md opens with: a *pseudo app* — an impressive, polished build that never tested the
thing most likely to kill it. AI makes that failure cheaper and more convincing every model
generation; this loop is the counter-pressure.

## Exit artifact

The canvas's **Experiment this week** line is filled with a real validation plan (not the
`_(the smallest test…)_` placeholder) — the same artifact the `done` graduation moment looks for.
Recording how you'll test the risk closes the loop. The good outcome of a drift nudge is the
founder writing (or running) that experiment.

## Drift

`entry: satisfied` (risk named AND ≥3 devlog entries) AND `exit: not satisfied` (no validation
plan recorded) = loop is OPEN → conscience emits the `drift` moment.

The model composes the voice (per `boss-voice`: seasoned hand, assume intelligence, never assume
knowledge), reads only the bounded set named above, and judges before speaking. **Not** a
"you've been productive!" reward and **not** a generic "you should validate" lecture — the value
is the *specific* stated-vs-actual comparison. Cohort-aware: returning-founder gets the harder
"is your conviction here where it needs to be for 12 months" cut; first-product gets "here's what
'test your riskiest bet' actually means" taught plainly; domain-expert gets the who-could-be-harmed
lens on the named risk.

## Cost (BOSS eating its own dogfood)

This moment reads more context than the cheap predicate moments, so it has to respect the same
discipline `/ai-cost` preaches or BOSS becomes the expensive-AI-app it warns against:

- The **predicate gate is the cost control.** The model only reads wider context when the cheap
  Node predicate has already confirmed the precondition. On every other prompt the hook emits
  nothing.
- The read is **bounded** — riskiest-assumption line + ~5 recent devlog entries + the open FEAT.
  Never "read the whole project." Bounded inputs are structured-output discipline applied to the
  input side.
- The model fires **at most once per session** and stays silent when on-aim.

## How to remix

- **Skip / override:** legitimate when the founder is *deliberately* de-risking in a different
  order (e.g. building a thin slice first specifically to make the risk testable). Override grammar:
  ```
  - **OVERRIDE:** skipped `drift-loop` — rationale: <e.g. building the minimal slice this week
    precisely so the riskiest-assumption experiment becomes runnable next week; risk is named and
    sequenced, not forgotten>.
  ```
- **Swap discipline:** the "riskiest assumption + one experiment" heartbeat is one framing
  (Maurya / Ries). A `jobs-to-be-done` validation plan, a `Mom Test` interview plan (Fitzpatrick),
  or a `pretotype` demand test (Savoia) are all legitimate exits — note the framing in the canvas.
- **Author your own:** a domain-specific drift loop (e.g. a `compliance-drift-loop` for a regulated
  product, where the named risk is regulatory and the validation plan is a legal review).

## When this loop re-opens

- The riskiest assumption changes (a new bet is named) without a fresh experiment line.
- An experiment ran and *disconfirmed* — the founder clears the validation plan to re-aim.

## Known limitation (consistent with `canvas-loop`)

`any_file_matches` is satisfied by *any* canvas, so a single graduated idea (risk + experiment
both filled) closes the loop even if a second active idea has a named risk and no plan. This is the
same `any`-semantics limitation `canvas-loop` carries; for the common single-active-idea case it's
correct, and the model — reading the actual canvases when the loop *is* open — can catch the masked
case anyway. A per-idea drift check would need cross-file pairing the predicate vocabulary doesn't
have yet; deferred until there's evidence it matters.

## Cite

PRINCIPLES.md (the why) — *"build faster without fooling themselves… continuously checking the work
against real pain, real workflows, real buyers."* Ries (validated learning), Maurya (riskiest
assumption first), Fitzpatrick (talk to someone before you build). The loop is the *when*; the
model's judgment + `/canvas` / `/pretotype` are the *how*.
