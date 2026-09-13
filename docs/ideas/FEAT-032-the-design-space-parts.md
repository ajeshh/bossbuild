---
id: FEAT-032
type: feature
owner: designer
status: shipped
gist: `boss design` gains the parts — Components (the index as it is written at MVP or generated at V1, a definition-of-done row per component, **Code** and **SVG** on every card), Patterns (Ours first, then the inherited groups, the refusals, and the style guide's do/don't pairs side by side), Flows (the index, and per flow the three paths and the cut test), Content (terminology, voice, tone by context — the real strings) and Accessibility (the floor, the computed pairs once, and one honest list of what stays *not checked*).
for: the same founder as FEAT-030, and the engineer who wants the import line and the designer who wants the frame in their tool
created: 2026-09-13
building_since: 2026-09-13
shipped_on: 2026-09-13
proof: src/design.js
from: IDEA-107
program: design-system
relates: FEAT-030, FEAT-031, IDEA-108
---

# The design space, slice 3 — the parts

> Slice 3 of the plan in [FEAT-030](FEAT-030-the-design-space-render.md). Closes when the five
> chapters render from the files that exist and hole honestly when they don't. Icons, logo,
> resources and exceptions are slice 4 (FEAT-033).

## Goal
Open `boss design` and find every part the product has — each component with the line that
imports it and a drawing a design tool pastes as editable vectors; every pattern with its rule and
its anti-pattern side by side; every flow with its three paths and the step that cannot say why it
is needed now; the words the product uses and refuses; and an accessibility chapter that computes
the one thing that is arithmetic and says *not checked* once for everything that needs a person.

## Assumptions (the plan-time record)
- **Assumed:** the component index is `docs/design/library/manifest.json` when it exists (V1, generated: `name · source · sourceHash · purpose · import · variants · states · usedIn · findings`) and `docs/design/COMPONENTS.md` otherwise (MVP, authored: `Component · What it's for · Import · Variants · Missing states · Status`, plus the API-shape table and the Retired table). Both on disk at once is itself a finding — the skill says the manifest supersedes → _confirmed_
- **Assumed:** **Code** on a card copies what is on disk: the import line always; the component's source file when the manifest names it or the import line resolves to a real file (`@/x` → `src/x`, the usual extensions). Nothing is generated from a guess about the props → _confirmed_
- **Assumed:** **SVG** on a card is a *spec frame* — name, purpose, variants, the five states as filled or missing boxes — drawn in the project's own tokens, never a render of the component (nothing here runs the code). The card says so → _confirmed_
- **Assumed:** the definition-of-done row holds only columns something on disk can answer: *on tokens* (manifest findings of kind `raw-value`/`off-token`; *not checked* at MVP), *five states* (manifest `states`, else the index's *Missing states* cell — blank means nobody checked, a dash means none missing, else the style guide's five-state table), *stale* (a manifest `sourceHash` that no longer matches the file). *To 320px*, *screen reader*, *a person* render *not checked* once for all, above the table → _confirmed_
- **Assumed:** patterns are `PATTERNS.md`'s tables as `/design-review` seeds them; groups are the `##`/`###` headings; *Ours* carries `PAT-n` ids and renders first; *Refused* last; the placeholder row is skipped. The style guide's *Do / Don't* table renders in the same chapter as pairs → _confirmed_
- **Assumed:** flows are `FLOWS.md`'s index rows plus each `## <flow>` section: the happy-path table, the cut list, the first-run and failure paragraphs. A step whose *why it's needed now* cell is empty is flagged as *the step to cut*; a section that defers the paths to the FEAT says so and is not a hole → _confirmed — an empty *why now* cell renders *cannot say — the step to cut*_
- **Assumed:** content is the style guide's Terminology table, the three voice traits, the tone-by-context table (a row counts when its *Real string* is filled) and the surfaces lines; an empty voice section renders *deferred by rule* with the template's own reason → _confirmed — the empty voice section renders the dormant *deferred by rule* block_
- **Assumed:** accessibility renders the floor as written in the guide, the contrast result once as a count with a link to the pairs table (never the table twice), which guards are registered in `.claude/settings.json` (`contrast-guard`, `design-tokens-guard`, `component-reuse-guard`, `content-terminology-guard`), and one list of what stays *not checked* → _confirmed — `GUARDS` in `src/design.js` reads the four hooks from `.claude/settings.json`_

**Still unknown (didn't guess):**
- Where the `design:` link lives (IDEA-108 #3) — not read here; kit coverage is slice 4's.
- Whether a founder wants the whole source file on the clipboard or just the import — both are offered; the sheet shows which.

## Acceptance criteria
- [x] Components renders the index (name · purpose · variants · used in · status · findings) from the manifest or `COMPONENTS.md`; retired rows struck with their reason; the API-shape words as a line; both files on disk → a finding line.
- [x] Every component card carries **Code** (import line; source file when resolvable) and **SVG** (the spec frame in the project's tokens, labelled as a frame) and the copy sheet shows the payload.
- [x] The definition-of-done table answers only from disk; *not checked* is said once, above it, for the columns nothing can answer.
- [x] Patterns renders *Ours* first with ids, then the inherited groups, then *Refused*; the style guide's do/don't pairs render side by side; no file → a hole with the verb.
- [x] Flows renders the index and, per flow, the three paths present or missing and the steps with an empty *why now* flagged; no file → a hole.
- [x] Content renders terminology, voice traits, tone rows with a real string, surfaces; the voice hole carries the template's *deferrable* reason.
- [x] Accessibility renders the floor, the pairs count with a link, the registered guards, and the *not checked* list once; the rail gains five entries under *The parts* and the ledger counts fourteen slots.
- [x] Tests cover: manifest and `COMPONENTS.md` each; both on disk; a resolvable and an unresolvable import; the SVG frame carries the token hex; a pattern file with Ours + Refused; a flow with an empty why-now cell; a voice section left as placeholders; guards on/off; all five holes.

## What "wrong" looks like
- A prop table or a usage snippet invented from the component's name.
- The SVG presented as what the component looks like.
- A *five states* ✓ for a row whose *Missing states* cell was blank.
- The contrast table rendered twice.
- A pattern's anti-pattern column dropped — the pair is the point.

## Paths that must not break
- **Destructive path:** still exactly one file under `.boss/`; a test asserts nothing under `docs/` changes.

## Smoke check
- `node --test test/design.test.js`; by hand: the `/tmp` scaffold with a `COMPONENTS.md` of three rows and one retired, a `PATTERNS.md` with one PAT row, a `FLOWS.md` with one flow and an empty why-now, the style guide's tables half-filled.

## Validated learning
- **Learning hypothesis:** the engineer copies the import line from the card instead of grepping; the designer pastes the frame and starts from the real tokens instead of a screenshot.
- **What result would change the plan:** nobody uses Code or SVG — then the card is the index row and the buttons go.

## Log
- 2026-09-13 — specced from FEAT-030's slice table. `boss id FEAT` reports FEAT-034 because the slice table already names 032 and 033 — the number was reserved by the plan, not taken.
- 2026-09-13 — **landed** (under Unreleased). Twenty-one design tests. Two frame lessons from the one
  look: the first surface-like token was the page ground, not the paper — a card frame wants
  `paper|card|elevated` first — and the first `fontFamily` token was the display face; the frame is
  set in the body face. Hole verbs now go through the playbook's `verbLine` (peer's 590748f) so a gated
  verb reads the same on both pages.
