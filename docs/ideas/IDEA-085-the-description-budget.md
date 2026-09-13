---
id: IDEA-085
type: idea
owner: product-lead
status: shipped
proof: none
proof_note: The measurement is reproducible from the manifests today. The proof of a fix would be a description-budget rule in scripts/check-manifests.js — deliberately unbuilt until the cap is set from the real distribution rather than guessed.
program: front-door
created: 2026-09-08
source: |
  Measured 2026-09-08 while cutting the always-on CLAUDE.md tax in v0.258.0 — the second half of
  the same bill, and the half nobody had looked at.
---

# IDEA-085 — the other always-on context cost: 24 KB of skill descriptions

## The measurement

v0.258.0 cut what `CLAUDE.md` + `AGENTS.md` spend on every turn (25.4 KB → 14.9 KB at MVP). That is
not the whole bill. **A skill's `description:` frontmatter is loaded so the host can decide when the
skill applies** — so every installed skill's description is in context too, whether or not it is
ever run.

| rung | skills | total `description:` bytes |
|---|---|---|
| Quickstart | 16 | **8.1 KB** |
| MVP | 29 | **16.0 KB** |
| V1 | 2 | 0.9 KB |
| Scale | 1 | 0.5 KB |

A project at MVP therefore carries **~24 KB of descriptions** — larger than the prose file this repo
just spent a release trimming, and completely unmeasured until now. The longest single ones:
`/sunset` 1,389 bytes, `/red-team` 1,235, `/onboard` 928, `/ship` 918, `/trust` 855.

## Why they got long, and why that is not a villain

Nothing was careless. A description is BOSS's only chance to say *when* a skill applies, and these
carry real routing content — `/sunset`'s three scopes, `/red-team`'s four modes. The cost was simply
never on anyone's ledger, so there was no pressure in the other direction.

## The shape of the fix

- **A budget with a check.** `check-manifests` already validates manifest/skill agreement; a
  per-description cap (~400 bytes?) and a per-rung total would make the cost visible at release
  time instead of never. **Set the cap from the current distribution, not from a guess** — the
  median is the honest starting point, and the outliers are the finding.
- **Trigger sentence, not a summary.** The description's job is *when do I fire*; the *what* belongs
  in the body, which loads only when the skill runs. Several long ones are summarising the body.
- **Watch the boundary.** Trimming a description too hard makes a skill fail to fire, which is worse
  than the tokens — the failure is silent and looks like the skill not existing. Any cut wants the
  cheap test: does the host still route to it from the phrasings the skill claims to serve?

## The rule worth extracting either way

**Whatever the host loads unprompted is a standing cost, and BOSS pays it out of the founder's
budget.** Three surfaces qualify today — `CLAUDE.md`/`AGENTS.md`, skill descriptions, and the hooks'
own output. Only the first has ever been measured. That generalization is the real finding here, and
it is what would go UP as a practice.

## Capture log

- **2026-09-09 — SHIPPED, v0.266.0.** Ten descriptions trimmed to the trigger (`/sunset` 1402 → 495 B,
  `/red-team` 1248 → 662, plus eight more); **MVP carries 21.0 KB instead of 24.3 KB, on every turn.**
  Before cutting a clause, its body heading was verified to exist — the record's own boundary warning
  (a description trimmed too hard fails silently and looks like the skill not existing) is the one
  thing no check can see, so it was handled by reading rather than by rule.
- **The cap was DERIVED, exactly as this record demanded.** Measured across all 48 skills first:
  median 485 B, p75 633 B, max 1402 B. 700 sits just above p75, so three quarters already complied
  and the ten that did not were the finding — which is the repo's own rule (a flood means the rule is
  wrong; a handful means only enforcement was missing).
- **The per-rung total is PRINTED and never fails**, and that asymmetry is deliberate: a budget on
  the total would improve when BOSS ships fewer skills — a denominator built from an inventory rather
  than a truth, the [[checkers-state-intents-they-dont-enforce]] n=20 shape. Only the per-skill cap
  fails a release, because only it names a file someone can fix.
- **The generalization this record called the real finding is still unshipped as a practice.**
  *Whatever the host loads unprompted is a standing cost, and BOSS pays it out of the founder's
  budget.* Two of three surfaces are now measured (CLAUDE.md/AGENTS.md, descriptions); the **hooks'
  own output** has never been. That is the residue worth carrying UP.
- **2026-09-09 — the third surface is MEASURED, and the generalization in this record is WRONG as
  written.** *"Whatever the host loads unprompted is a standing cost"* holds for two of the three
  surfaces and not the third. Measured against a real fire: both registered hooks emit **0 bytes**
  unless a moment fires, and **1,417 bytes** when one does. The bill is therefore:

  | surface | when | cost |
  |---|---|---|
  | `CLAUDE.md` + `AGENTS.md` | every turn, unconditional | 14.9 KB |
  | skill `description:` frontmatter | every turn, unconditional | 21.0 KB |
  | hook output | only when a moment fires | 0 B / ~1.4 KB |

  **The corrected rule: two surfaces are STANDING and one is EPISODIC, and the episodic one is the
  only one that was designed with its cost in mind.** The conscience's silent early-exit is a real,
  measurable discipline — it is the surface nobody had measured and the surface that turned out to
  need no fixing. The 36 KB that matters is the unconditional half.
- **Measuring it required making the hook fire, and that is what found [[IDEA-088]]** — BOSS's own
  repo has no conscience installed and its frequency ledger is 0 lines. A 0-byte reading is
  indistinguishable from a broken probe; insisting on a positive control is what turned a null
  result into a finding.
