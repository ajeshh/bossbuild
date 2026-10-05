---
id: RVW-117
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: UP library/practices/design-system.md + stages/L1-mvp design-tokens-init (wording, no mechanism)
sources:
  - a token-system how-to by a design-tokens spec contributor, on a design-system vendor's blog, 2026-06 (name and URL: docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-117 — start with two token layers, not three, and keep value and theme out of every name

## The claim
- **Source:** a practitioner how-to for a team's first token system (PDF in Ajesh's inbox drop).
- **Core assertion:** start small: one brand, one theme, one platform. **Two layers, core and
  semantic, and no component tokens.** Name semantic tokens for intent, and keep anything that could
  change (a value, *a theme*) out of the name: `color-bg-strong`, not `color-bg-dark`. Store DTCG
  JSON in git and write down decisions as ADRs.
- **Inbox file:** `~/Projects/inbox/bossbuild/How to start a design token system with confidence…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. "Start small, expand when earned" is PRINCIPLE #2 almost word for word. |
| 2 | Evidence grade | One practitioner's guidance, no data. The author's bio claims a role in the tokens spec group, which this pass did not verify. **The verdict does not rest on it**: the finding below is BOSS contradicting itself, and that stands whoever pointed at it. |
| 3 | Duplicate or sharpen? | **Mostly duplicate, with a contradiction it exposes.** DTCG JSON in git, decisions as records (DEC + `chosen — DEC-NNN`), intent names and starting small are all shipped. **The contradiction:** BOSS *calls* itself three-layer everywhere (the `/design-tokens-init` description, step 87, the CLAUDE.md block it writes at line 323, `design-system.md` line 124, `/design-review` line 75). But it **scaffolds two**. Its own Layer 3 reads *"occasionally needed… If you're reaching for it at MVP, you're probably premature."* And the practice's stated reason for three, *"Three layers gives the AI a semantic name to grab (`color.action.primary` not `blue.500`)"*, is the case for having a **semantic** layer, which is layer two. **The gap:** the init says *"Names describe the role, not the value"*. It never says *not the theme*. That is the exact hole IDEA-092 held open as a question: dark mode is cheap only if the semantic layer is honest. |
| 4 | Who serves / harms? | Serves `eng-builder` and `returning-founder`, who read "three-layer" and either build a component layer they don't need or distrust a description that doesn't match the files. It harms no one. `first-product` never sees the word (it gets *"name the first color for what it means"*). |
| 5 | Cost / ceremony | **Lighter.** The fix is a word change in five places, plus one clause. The current label oversells the ceremony BOSS actually asks for. |

## Verdict: ADAPT
Take the naming clause and correct BOSS's own label. Leave the rest, which BOSS already does. BOSS
says "three layers" and builds two, and the reason it gives for three is the reason for two. That is
a claim outliving its mechanism (the IDEA-092 failure shape), and this time it is in the description
line a founder reads first. The theme-in-the-name rule is one clause, and it is the cheapest answer
anyone has offered to IDEA-092's dark-mode question.

## If ADOPT / ADAPT
- **What to do:**
  1. Wherever BOSS says "three-layer", say **"two layers (primitive → semantic), and a component
     layer when a component earns one"**. That covers the `/design-tokens-init` description and
     step 87, the CLAUDE.md block the init writes, `design-system.md` § minimum architecture (and
     rewrite its "two is fragile" sentence, which is really about *one* layer), and `/design-review`'s
     "three-layer architecture preserved" check, which already checks semantic-over-primitive. Keep
     Curtis's layer-cake credit; it describes the layers, not a required count.
  2. Init § Layer 2: *"Names describe the role, never the value **or the theme**:
     `color.surface.strong`, not `color.surface.dark`. A name that says dark is a retheme waiting to
     lie."* Add one line to IDEA-092's dark-mode note saying this is the sentence it asked for.
  → hand to `/extract` (UP, `library/practices/design-system.md` + `stages/L1-mvp`). A CHANGELOG
  bullet if a founder would feel it (the description line, yes).
- **What's modified from the original:** the layer count is a *label correction*, not a mechanism
  change. BOSS keeps an optional third layer, because the source's "never component tokens" is an
  enterprise-team rule, and a V1 project can earn one. The how-to's numbers are not taken (6/3/2
  text styles, ten-step ramps, a 4px base with 20 steps, OKLCH): they are one author's starting
  kit, and BOSS's distinctiveness pass exists to stop everyone starting from the same kit.

## Attribution
Partly verified. The guidance is the author's own and unsourced. The spec-group role is from the
author's bio, not checked. The contradiction in BOSS was verified in the tree (line refs above).

## Notes
- Prior related verdicts: RVW-071 (confirmed "the three-layer token architecture", and **missed this**),
  RVW-079 (DTCG kept as the format), IDEA-092 (the dark-mode question).
- Outcome (2026-10-05): landed UP. "Three-layer" corrected in `/design-tokens-init` (description, cohort lines, heading, the do-list), `design-system.md`, the `designer` agent, `/design-review`, and the design page (`web/` + `site/`, a correctness fix under the site freeze). Layer 2 now says *never the value or the theme*. IDEA-092's dark-mode note points here.
- BOSS version when recorded: 0.329.0
