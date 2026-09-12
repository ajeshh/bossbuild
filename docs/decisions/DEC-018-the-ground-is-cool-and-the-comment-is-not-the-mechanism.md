---
id: DEC-018
type: decision
owner: "@ajeshh"
decided_by: AI-suggested-ratified
status: decided
created: 2026-09-12
confirmed: 2026-09-12 — Ajesh's brief for the session: "either it is not cream and the token comment is right (then say what it IS), or move it"; the record chooses "move it" and says why
reversibility: reversible
revisit_by: 2027-03-12
---

# DEC-018 — the ground is cool, and a token comment is not a mechanism

> Written the day BOSS pointed a rendered-page design linter at its own website for the first time
> and got forty findings back, five of them tells its own design practice ships to founders.

## Context

`web/styles/tokens.css` has said, since the site-and-signage world was chosen on 2026-08-19:

> `/* Ground: cool poured concrete — deliberately NOT warm cream. */`
> `--concrete: #E8E6E1;`

`docs/design/VISUAL.md` says the same thing at more length: *"Concrete is cool grey — a different
family, not a nudged version of the same one."* The design practice BOSS ships to founders
(`/design-tokens-init`, override #1) says: *give the neutral a temperature — and not warm cream;
cool, or a warm that isn't cream, or a genuine tint.*

On 2026-09-12 the build-craft watchlist's tap 1 was run for the first time:
`npx impeccable@4.1.0 detect https://oyeboss.build --json`. It reported `cream-palette` on
`rgb(232, 230, 225)`. The arithmetic agrees with the linter and not with the comment:

| value | hue | saturation | lightness |
|---|---|---|---|
| warm cream, the named 2026 tell (`#F4F1EA`) | 42° | 31% | 93.7% |
| `--concrete` as shipped (`#E8E6E1`) | **43°** | 13% | 89.6% |
| `--concrete-raised` / `--concrete-sunk` / `--bone` / `--rule-light` | 43–45° | 7–13% | — |
| `--graphite` and the whole dark half | **210°** | 6–9% | — |

The light neutrals were the cream's own hue with the saturation turned down — precisely *"a nudged
version of the same one"* — while every graphite value sat at 210°. The two halves of one palette
were 165° apart in hue, and the comment describing them was false on the day it was written.

Nothing caught it in 24 releases because nothing was pointed at it. `contrast-guard` checks ratios,
not temperature; `check:site` checks claims against manifests, not against colour arithmetic; the
comment was the only statement of intent and comments are not run.

## Decision

1. **The light neutral family moves to hue 210°, the graphite's own hue.** `--concrete #E4E6E8`,
   `--concrete-raised #F0F2F3`, `--concrete-sunk #D7DADD`, `--rule-light #C4C8CC`. `--bone` is
   renamed **`--chalk`** (`#E2E5E7`) because a name that means *warm off-white* would now be a lie.
   Light and dark are one temperature; the hi-vis accent (hue 22°) sits against a cool ground the way
   it does on real signage.
2. **The comment is rewritten to state the number and the correction**, not just the intent, and to
   cite this record. VISUAL.md carries the same correction beside the sentence that was wrong.
3. **`src/board.js` and `library/help/help.css` move with it.** Both hold copies of the palette (a CLI
   render and a single-file HTML guide cannot link a stylesheet). The help guide additionally had its
   *own* warm-cream palette (`#f4f2ec`, hue 45°) and a white-on-hi-vis label at 3.6:1 — the founder-
   facing surface was further from the rule than the website. Copies now say where they were copied
   from and that they move together.
4. **Two text inks darken at the same time, for the floor rather than the taste:** `--slate` `#5F656B`
   → `#565C62` and `--hivis-ink` `#B33900` → `#A63400`. Both failed AA only on `--concrete-sunk`, the
   `<code>` background (4.22:1 and 4.29:1) — eleven of the linter's forty findings were that one pair,
   because `<code>` inherits its parent's colour. Every text/surface pair is now ≥ 4.5:1 in both
   themes; the arithmetic lives in `contrast-guard.js` and was run against the token file before
   the values were committed.

## Why

- **The alternative was to rewrite the comment to match the value** — call `#E8E6E1` "a warm grey,
  not cream." That is defensible in isolation (13% saturation is not 31%) and the shipped practice
  allows *"a warm that isn't cream."* It was rejected because it would leave the palette split
  across two temperatures with no reason for the split, and because the world was chosen *as* cool
  concrete against hi-vis — the intent was right and the value was wrong. Fix the mechanism to match
  the claim when the claim is the one you'd defend.
- **The pattern is the one this repo keeps finding**: a claim that outlived — here, never had — its
  mechanism. The comment said "deliberately NOT" about a thing nobody had measured. A rule never
  pointed at yourself is a claim with better posture.
- **The tap is a measurement, not a dependency.** The linter runs via `npx` against a local
  `gen:site`; it is not in `package.json` and not a hook in BOSS's own `.claude/`. Its rule set is
  one opinion; the floors (contrast, measure, leading) are WCAG and typography, not the linter's.

## Rejected alternatives

- **Keep the value, fix the comment.** See above. Also fails the genericness test: a warm
  low-saturation neutral is what a 2026 model produces for any similar brief.
- **Move to a genuine tint (a green- or blue-tinted grey).** Would have been a *third* temperature
  in the palette. The graphite was already there and already cool; joining it is the smallest move.
- **Put a temperature check in `check:site`.** Hue arithmetic on a token is one regex and one
  formula, and it would have caught this. Not built today: one measured incident, and the rule that
  would encode it (*light and dark neutrals share a hue*) is a house rule, not a floor. Re-open if
  the palette drifts again.

## Falsifier — what would prove this wrong, and by when?

- If a founder or reviewer reads the cool ground as *clinical* or *generic dev-tool grey* — the 2026
  dark-mono sameness in a light coat — the temperature was the wrong fix and a genuine tint should
  be tried. **Check:** any unprompted remark about the site's colour before 2027-03-12.
- If the linter's `cream-palette` rule fires on `#E4E6E8`, the linter's threshold and this decision
  disagree and the record should say which one is right. **Check:** re-run the tap on the next
  release that touches `web/styles/`.

## Consequences

- `og.png` is re-rendered from `scripts/og-card.html` (graphite ground; only the wordmark's tint
  changed). The recipe and the binary agree again.
- Every text colour must clear AA on **every** light surface, including `--concrete-sunk`; the
  token file now says so beside `--slate`.
- `--hivis-rule` (a 3px brand edge on notes and yields — a card side-tab) is gone; `--turn-rule` is a
  1px ink hairline. Hi-vis stays a fill.
- Anyone changing a neutral runs the contrast arithmetic first and the hue arithmetic second, and
  re-runs the tap. The watchlist row for 2026-09-12 carries the before → after numbers.

## Related

- DEC-004 (the humane frame is the floor), IDEA-057 (the visual identity, and the first cluster BOSS
  walked into), IDEA-091/092 (the design program), RVW-079/081/082 (the tooling field).
- `docs/research/watchlists/build-craft.md` §7b — the tap this came out of.
- `library/practices/design-system.md` — *"The tells move"*, and the rule that skills name the class
  of tool while the practice names tools with a date.
