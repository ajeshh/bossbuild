---
id: IDEA-107
type: idea
owner: designer
status: captured (a chapter of the IDEA-106 prototype next — see it before choosing a mechanism)
gist: The founder's own design guidelines — foundations, components, patterns, content, accessibility, resources — rendered as one on-brand HTML space in the class of HIG / Material / Carbon / Fluent / Ant, generated from `docs/design/*` and the code so it cannot drift; and the honest answer to "add Figma support" (tokens two-way via DTCG, everything else refused — RVW-082).
proof: none
proof_note: Captured with a gap table and a prototype plan, not built. If it earns a build it is the IDEA-106 renderer over `docs/design/` (one renderer; the V1 `/design-library` contained, never duplicated). The one mechanism change worth making regardless is DTCG as a guaranteed file.
created: 2026-09-13
program: design-system
relates: IDEA-106, IDEA-091, IDEA-092, RVW-082, RVW-081, RVW-079, RVW-080, DEC-004
source: Ajesh, 2026-09-13 — "like we are creating a visual html of all the business content. Im
  wondering if we should build also the design playbook, that has all the design guidelines, which
  includes all the key details, fonts, patterns, components, design principles, layout, and anything
  else. I could see it rivaling apple human interface guidelines or material design guidelines or
  carbon / fluent2 / ant.design. As we are building this, lets also learn whats missing from our
  existing design playbook feature wise. One thing I did spot along the way is a figma export. So
  maybe as we are building this, we add a figma support for tighter integration for designers to
  converge on to it?"
altitude: what BOSS ships a founder (not BOSS's own practice)
---

# IDEA-107 — the design playbook: the founder's own guidelines, rendered

## The idea, and the one reframe it needs

[[IDEA-106]] renders the *venture* — the why, the people, the canvas, the rivals, the evidence — as
one on-brand HTML space. This is the same move over the *design system*: everything
`/design-tokens-init`, `/spec`, `/design-review` and `/decide` have written into `docs/design/` and
`docs/BRAND.md`, rendered so a founder, a designer joining later, and the agent can all *look at it*.

**The reframe:** HIG, Material, Carbon, Fluent and Ant are authored by teams of writers over years,
and they document *a system someone else built for you to adopt*. BOSS refuses composed prose
(106 §5) and refuses shipping a UI kit (PRINCIPLE #4, [[IDEA-091]] refusals). So this cannot rival
them in volume and must not try. **What it can do that none of them do: be generated from the
founder's own code and records, show drift on the page, and leave every hole visible.** The
comparison to make is not *Apple's HIG* but *this founder's HIG* — the guidelines their product
actually has, at the size it actually is, with nothing invented to fill the shape.

That is also why it is a chapter of 106 and not a fourth product. Chapter 11 (*Brand*) already
renders swatches and a type specimen; this record is that chapter grown to its full size.

## What BOSS already holds — read before naming any gap

This program has the worst doc-rot record in the repo ([[IDEA-091]] constraint 4). Every row below
was grepped on 2026-09-13, not remembered.

| Layer (HIG/Material/Carbon shape) | BOSS today | Rung |
|---|---|---|
| Foundations — color · type · spacing · radius · elevation · motion | `DESIGN_TOKENS.md`, 3-layer DTCG, `design-tokens-guard` (5 families), `contrast-guard` (v0.289.0) | MVP |
| Principles with tradeoffs, do/don't, five states, signature, exceptions | `STYLE_GUIDE.md`; composition layer (type roles · rhythm · surface · hierarchy) v0.286.0 | MVP |
| Patterns with guidance | `PATTERNS.md` — *when it applies* · anti-pattern column · Ours-first; `design-pattern-loop` | MVP |
| Flows | `FLOWS.md` via `/spec` step 7b | MVP |
| Components — the reuse index | `COMPONENTS.md` (authored, MVP) → `library/manifest.json` (generated, V1) | MVP / V1 |
| Content — voice · tone · terminology | `STYLE_GUIDE.md` + `content-terminology-guard`; voice in `docs/BRAND.md` | MVP |
| Accessibility | a11y floor in the style guide · `contrast-guard` · `boss craft accessibility` · honest `not checked` labels | MVP |
| Brand | `docs/BRAND.md` (living, v0.288.0); the anchor as a `DEC` | MVP |
| **The lookable thing** | `/design-library` — foundations + rules + every component in five states + drift badges + designer handoff | **V1 only** |
| Designer handoff | `HANDOFF.md`; "a URL, not a repo checkout" | V1 |

**The one-line read: the *material* exists from MVP; the *rendering* of it arrives two rungs later.**
A founder at MVP holds six markdown files and a tokens file and cannot look at any of them.
`/design-library` says the gallery *"costs the same at V1 as it would have at MVP, minus the
components that did not exist yet"* — true for the component cards, and not true for foundations,
rules, patterns and brand, which exist from the first UI commit. That is the gap this record is
actually about.

## What is missing — against the five sites named, grepped

| # | The five sites have | BOSS has | Sort |
|---|---|---|---|
| 1 | **Foundations · rules · patterns rendered at any rung** | markdown until V1 | **the record's whole point** — the 106 renderer over `docs/design/` at MVP |
| 2 | **Layout** — grid, breakpoints, containers, responsive rules | 0 hits for `grid` / `breakpoint` in the token skill, the style-guide template and the gallery; spacing tokens + *Density & rhythm* as a weak proxy ([[IDEA-092]] row *Layout* ❌, still open after the composition layer) | **task:** a layout slot in `STYLE_GUIDE.md` (name the slot, earn the value — 092's rule) |
| 3 | **Data visualization** (Carbon has a whole section; Fluent and Ant ship chart palettes) | 0 hits anywhere in the shipped surface | **question:** does a chart palette belong in the token file (a `color.chart.*` family, categorical + sequential + diverging) or is it earned at the first chart? Seed-that-scales says: a categorical palette invented per chart is the 47 blues again |
| 4 | **Iconography** as a foundation (set, sizes, stroke, naming) | v0.290.0 — *the decisions icons force*, not a family | thin, deliberately; render what the decision recorded |
| 5 | **Per-component usage guidance** — when to use / when not / anatomy / a11y notes / content | ⛔ refused as a general catalog (092); the middle path is `PATTERNS.md`'s *when it applies* column, grown one row at a time | **render, don't write:** the column *is* the usage guidance, per project. No catalog |
| 6 | **Dark mode · theming · density · motion** | deferred by the seed-that-scales table; 092 says do not re-propose | **not a gap** — but the playbook itself renders light and dark (106 does), which quietly tests whether the semantic layer is honest (092's held question). A token that breaks in the playbook's own dark mode is a finding |
| 7 | **Resources** — design kit, code package, icon download | `HANDOFF.md`; DTCG *"where the stack allows"* | **task, and the Figma answer** (below) |
| 8 | **Component status lifecycle** (stable · experimental · deprecated) | `COMPONENTS.md` `Status` column; `$deprecated` on tokens | exists; render it as the badge Carbon uses |
| 9 | **Release notes / what changed** | refused for a solo founder ([[RVW-080]]); design `DEC`s + the exceptions table + 106's *story so far* chapter | **render the lineage** — *chosen — DEC-NNN* beside every swatch (the gallery already does this at V1) |
| 10 | **Search** across the guidelines | — | single-file client-side find; cheap; not before the content exists |
| 11 | **Writing / content design** as its own chapter | `STYLE_GUIDE.md` voice + terminology; `BRAND.md` *how it sounds* | exists in two homes (092 named it); the render is the one reader that joins them |
| 12 | **Accessibility** as a first-class chapter | floor + `contrast-guard` + craft | render the computed pairs; motor/cognitive stay `not checked`, said once |

Rows 2, 3, 7 are the real findings. Everything else is *material that exists and has no render*.

## Figma — the answer already on record, and the one thing it was missing

[[RVW-082]] (ADAPT, 2026-08-20) split "two-way with the design tool" into three mechanisms and
graded each:

| Layer | Direction | Verdict |
|---|---|---|
| Tokens | code ⇄ design tool | ✅ **real two-way** — Variables API reads and writes; DTCG is the interchange |
| Components | design → code | ✅ real, vendor-sourced (Code Connect) — direction, not a multiplier |
| Components | code → editable design file | ❌ **does not verify** — personal blog, community MCP, a GitHub issue |

Two standing rules shape what "Figma support" can mean here: **PRINCIPLE #4** (name the standard
and the seam, never make the vendor the mechanism — the same call as [[RVW-078]]'s shadcn refusal)
and Ajesh's own rule of 2026-09-12 that `stages/**` names the *class* of tool. So shipped text says
*"your design tool's variables (DTCG)"*; the practice may say Figma with a date.

**What the verdict missed, found by grepping for the file it depends on:** `/design-tokens-init`
emits DTCG *"where the stack allows."* That is a filter, not a file. A designer arriving today may
find no `tokens.json` to import — the seam BOSS *claims* has no guaranteed artifact behind it. DTCG
is JSON; it does not depend on the stack at all.

So, concretely, in order of how real each is:

1. **Always write `docs/design/tokens.json` (DTCG 2025.10)** beside `DESIGN_TOKENS.md`, whatever the
   stack. The stack file (CSS variables, a TS module) is derived *from* it. This is the one mechanism
   change worth making regardless of the playbook — it turns the seam from a sentence into a file.
2. **A *Resources* block on the playbook:** the DTCG file as a download, the import line for the
   founder's design tool (named by class), the icon set if one was chosen, the component index.
   That is the export Ajesh spotted, in the direction that verifies.
3. **The return trip, on the same layer:** a designer edits variables in their tool and exports
   DTCG; `/design-library --check` (or the playbook's regenerate) diffs it against `tokens.json` —
   the founder decides per token. Tokens have stable IDs, which is why this is the one layer where
   a diff is honest.
4. **Refuse, as before:** an MCP or plugin BOSS ships or depends on · Code Connect as a BOSS
   mechanism · any code → editable-design round-trip claim, until a vendor primary doc or a
   witnessed run exists (082's re-open condition, unchanged).

## How it should look — a chapter, in the 106 renderer

- **One renderer, one space.** The playbook (106) gains a *Design* chapter; 106's *Brand* chapter
  folds into it as the first section. At V1, `/design-library`'s component cards render *inside*
  it — contained, never duplicated (the same rule 106 §1 applies to the board). Two galleries over
  one tokens file is the two-definitions-of-a-button trap the library skill exists to refuse.
- **Sections, in the order a designer reads them:** Brand (who it's for, what it promises, what it
  refuses, how it sounds, the name and why) · Foundations (swatches with the semantic name and the
  *chosen — DEC-NNN* line; the computed contrast ratio on every text/surface pair; type roles as a
  specimen; spacing bars; radius, elevation; layout when a slot exists) · Principles (each with its
  tradeoff, rendered as a do/don't pair) · Patterns (Ours first, then seeded; each a do/don't pair
  with the five-state table) · Flows (the ordered steps, the three paths) · Content (voice, tone by
  context, the terminology table) · Accessibility (the computed pairs; what stays `not checked`,
  said once) · Components (the index at MVP; the cards at V1, with drift badges) · Exceptions
  (grouped by rule, counted) · Resources.
- **A slot with nothing in it renders as a hole** with the verb that fills it. The composition
  layer ships empty by design (092: *name the slot, earn the value*); the hole is the honest render.
- **Every block is a block** — Link, Copy where worth copying, Slide, Present — so a swatch row or a
  do/don't pair lifts into a deck exactly as a canvas box does.
- **Surface-gated like its siblings:** a `cli` / `agent` shape renders the verb table, the error copy
  and the voice tables, not a colour cake ([[IDEA-092]] surface-gating, v0.286.0/v0.287.0).
- **Generated, never authored; drift on the page** — the `sourceHash` and `contrast-guard`
  precedents carried in.

## Refusals — so the seed's own phrase ("anything else") has a wall

A shipped UI kit · a general UI-element catalog · composed usage prose · `DESIGN.md` as the format
([[RVW-079]]) · versioning machinery ([[RVW-080]]) · a sync engine, hosting surface or card index
([[RVW-081]]) · a vendor name in `stages/**` · a headless browser to check appearance (092 item 5 —
this playbook checks values, names, structure and presence; it cannot check appearance, and says so).

## The prototype — see it before choosing

Same method as 106: hand-written, over **Tidewell**, published to the same artifact as a *Design*
chapter (12 → 13 chapters, or 11 grown). Draw: Brand → Foundations with three swatches and their
`DEC` lines and computed ratios, one failing pair · a type specimen · one principle as a do/don't ·
one pattern as a do/don't with its five states · one component card in five states with one
*off-token* badge and one missing-state gap · the layout slot as a hole · Resources with the DTCG
download. What it answers: does a founder with three components and a tokens file feel like they
*have a design system* · do the holes (layout, icons, dark mode) read as honest or as thin · is a
do/don't pair the thing that carries in a deck · does the Resources block read as a handoff.

## Recommended next steps — in order

1. **The Design chapter on the Tidewell prototype** (above). Reactions into this record's capture log.
2. **`tokens.json` as a guaranteed file** — the one build that stands on its own: a one-paragraph
   edit to `/design-tokens-init`, a `check` that the file parses as DTCG, a bullet under
   `## Unreleased`. Do not wait for the playbook.
3. **Rows 2 and 3 of the gap table** as slots: a *Layout* section in the style-guide template and
   a `color.chart.*` question on the token skill — named, empty, earned.
4. **Then decide** whether the chapter ships at MVP (a fifth reader of the same files, no new verb)
   or waits for `/design-library` at V1. Answer with the prototype in hand and 106's mechanism
   decision, not before.

## Open questions — written as questions

1. Chapter of 106, or its own space with its own URL? (A designer wants the design guidelines
   alone; an investor never does. One renderer either way — the question is the nav.)
2. When `/design-library` exists at V1, is the playbook's Design chapter *it*, or does it link out?
   (106 answered this for the board: contained. Is a 40-card gallery containable in one page?)
3. Does the return trip (step 3 under Figma) need a verb, or is it `--check` reading a second file?
4. Is *playbook* the word here either? Designers say *guidelines* or *system*; 106's Q4 applies twice.

## Gate

`captured`. [[IDEA-091]] and [[IDEA-092]] both closed with the same sentence — *none of this is
evidence; no founder asked for any of it by using BOSS; publish and Phase 3 outreach outrank every
row* — and then shipped seventeen releases. This would be the third design program at n=0 observed.
The prototype chapter is a **mock to react to**; step 2 is a real gap in a claim BOSS already makes.
Everything past those two waits on the same trigger as 106: **a founder (or Ajesh on a real
project) goes looking for their own design material and cannot find it, or a designer arrives and
asks what to import.**

## Capture log

- 2026-09-13 — seed (Ajesh, one message, three asks: the design playbook · what's missing ·
  Figma). Grepped before writing: the material exists from MVP, the render arrives at V1; layout,
  data viz and a guaranteed DTCG file are the three real gaps; Figma was vetted in [[RVW-082]] and
  the token layer is the only direction that verifies. Written as a chapter of 106, not a fourth
  product.
