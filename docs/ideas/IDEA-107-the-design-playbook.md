---
id: IDEA-107
type: idea
owner: designer
status: captured (prototype v0 published 2026-09-13 — its own space, linked to the playbook; react, then decide the mechanism)
gist: The founder's own design guidelines — foundations, components, patterns, content, accessibility, resources — rendered as one on-brand HTML space in the class of HIG / Material / Carbon / Fluent / Ant, generated from `docs/design/*` and the code so it cannot drift; and the honest answer to "add Figma support" (tokens two-way via DTCG, everything else refused — RVW-082).
proof: none
proof_note: Captured with a gap table and a prototype, not built. If it earns a build it is the IDEA-106 renderer over `docs/design/`, emitting a sibling space (one renderer, three spaces — playbook · design · board — linked in one family bar; the V1 `/design-library` contained, never duplicated). The one mechanism change worth making regardless is DTCG as a guaranteed file.
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

## Three rules from the second seed (Ajesh, 2026-09-13)

*"Same as we are doing for the actual website, we should be able to copy any of the values. I think
of this website as being very key for engineers and designers … we need to build a very awesome
way."* · *"figma integration as its own feature"* → [[IDEA-108]] · *"analyze carbon … go deeper"* →
the read below · *"Im wondering if UX research should also show up on this"* → the answer below.

1. **Every value is copyable, in the form each reader wants.** A colour copies as hex, as its token
   name, or as `var(--…)`; a type role as its font stack or its token; a spacing step as `px` or its
   token; an import line as itself; an icon as its SVG. Copy on the *block* (106's rule) stays for
   decks; copy on the *value* is for the editor. An engineer never re-types a hex from a swatch, and
   a designer never re-types a token name into a variable — that is the whole "reuse existing"
   argument at the level where reuse actually fails.
2. **The audience is engineers and designers, and the site is their reference** — so per-component
   depth beats site breadth. The Carbon read says what depth means.
3. **Research shows up on the thing it bears on, and in one ledger.** Never a second Evidence chapter.

## Carbon, read at source (2026-09-13) — what to take, grepped against BOSS first

Read from `carbon-design-system/carbon-website` `src/pages/` (the exact page tree) and the `carbon`
monorepo `packages/`, not from the rendered site (a JS app; the fetch returned nothing).

| Carbon has | Where (at source) | BOSS today (grepped) | Sort |
|---|---|---|---|
| **Every component page has four tabs: Usage · Style · Code · Accessibility** — Usage holds *anatomy, sizes, emphasis, content, states, best practices per variant*; Style holds the spec with tokens annotated; Accessibility holds *keyboard interactions*, *what Carbon provides*, *design recommendations*, *development considerations* | `components/button/{usage,style,code,accessibility}.mdx` | a card holds **Code** (import, variants, states) and nothing else. `anatomy`: 0 hits. `keyboard`: a reviewer's checklist line in `designer.md` / `design-review`, never a per-component table | **the big one — three slots per component**, filled per project (not the refused catalog): *Usage* = when / when not (the `when it applies` column, moved onto the card) · *Style* = anatomy with the token each part uses (derivable from the source by the guard) · *Accessibility* = the keyboard table + what has been tested with a person. Prototype v1 draws all four on Button |
| **A definition of done per component** — Draft → Preview candidate → Preview → Stable — with a checklist across *design spec · code · testing · docs · kit* (rows include *4.5:1 on all text*, *works to ~320px*, *strings parameterized*, *screen reader manually tested in three readers*, *VRT*, *AVT*) | `contributing/component-checklist` | `Status` column (stable · experimental · deprecated); `definition of done`: 0 hits in the design surface; the *rows* map one-to-one onto BOSS's own mechanisms — `contrast-guard`, the layout hole, the i18n seam, *not checked* | **task:** a `done:` row per component in the manifest, mechanical where a guard exists (tokens · states · contrast · narrow · strings) and *not checked* where a person is needed (screen reader). Rendered as the checklist on the card; *Stable* is earned, never asserted |
| **Patterns, 17 named** — common actions · dialog · disabled states · disclosures · empty states · filtering · fluid styles · forms · global header · loading · login · notification · overflow content · read-only states · search · status indicator · text toolbar | `patterns/*` | 10 AI-interaction patterns UP; `PATTERNS.md` seeds only what the project holds; the general catalog is **refused** ([[IDEA-092]]) | **practice row, not shipped text:** name Carbon's list, dated, as the seed vocabulary a founder can pick *one row at a time* — so nobody reinvents "empty state" under another name. The refusal (inventing a catalog) stands |
| **Data visualization as its own section** — getting started · chart anatomy · chart types · color palettes · axes and labels · legends · dashboards · simple / spatial / flow / gantt | `data-visualization/*` (11 pages) | `chart`: 0 hits | confirms 107 gap row 3. The palette question first (`color.chart.*` categorical · sequential · diverging, derived from the token layer); the rest earned at the first chart |
| **Elements as packages** — colors · type · layout · grid · motion · themes · icons · pictograms | `packages/{colors,type,layout,grid,motion,themes,icons,pictograms}` | one DTCG file → one derived stack file | fine as is for one product; the *icon build* (SVG source → generated) is the one to copy: **icons live as SVG files, the site renders from them** |
| **2x Grid** as a first-class element | `elements/2x-grid` | layout: 0 hits — the hole on the prototype | confirms gap row 2 |
| **Themes** (White · Gray 10 · Gray 90 · Gray 100) as token sets with a code page | `elements/themes` | deferred by rule (092) | not a gap; the dark *slot* on the prototype is the honest render |
| **Carbon for AI** guideline + an `ai-label` component | `guidelines/carbon-for-ai`, `components/ai-label` | `ai-ux-patterns.md` (10 patterns, UP) — provenance / "why this" / confidence as a register | BOSS already holds the *guidance*; Carbon shipped the *component*. Nothing to add; note that the market now has a named component for pattern 1 |
| **Carbon MCP** (public preview) with a *Token conservation* page | `developing/carbon-mcp/{overview,onboarding,prompts,token-conservation}` | `manifest.json` is the retrieval substrate ([[RVW-078]]); no server (host's job, [[RVW-081]]) | confirmation, not a build — IBM arrived at the same two conclusions BOSS did (retrieval over instruction; context tokens are a budget) |
| **Migrating** + codemods · **Contributing** · **Community** · **Meetups** | `migrating/`, `contributing/`, `community/`, `whats-happening/` | versioning refused ([[RVW-080]]); multi-team ceremony | not for a solo founder; the *contributing* idea survives as BOSS's reuse / adjust / new boundary, already shipped |
| **All about Carbon** — why it looks like this | `all-about-carbon` | the brief layer: `BRAND.md` + the anchor `DEC` | exists; chapter 1 of the prototype |
| **Design kits** (Figma, Sketch) with a kit row in the definition of done | `designing/kits` | no design-tool link anywhere (`design tool`: 1 hit, prose) | → [[IDEA-108]] row 3: `design:` link + kit coverage |

**The read in one line:** Carbon's depth is *per component* (four tabs, a definition of done, a
keyboard table), not per site. BOSS's cards are one tab deep. That is where "go deeper" lands.

## The field, read at source (2026-09-13) — seven systems, one table

Ajesh: *"the organization of content needs to be better … check fluent … the level of detail and
the content around principles, and depth … not just fluent, but also apple, material design and
any other that you recommend."*

**What was opened.** Fluent 2: the home page, `/design-principles`, `/color`, `/design-tokens`,
`/layout`, and the React Button usage page (fetched; the site renders content server-side).
GOV.UK, Polaris (Shopify), Primer (GitHub) and USWDS: the exact page trees from their public site
repos, plus GOV.UK's `check-answers`, `button`, `component-lifecycle-statuses`,
`continuous-research` and `contribution-criteria` pages, Polaris's `experience-values`, Primer's
`component-lifecycle`. Carbon: the previous section. **Apple HIG and Material 3 are JS shells with
no readable endpoint from here** (Apple's DocC JSON 404s); their structure below is from memory and
is marked — verify before any of it reaches shipped text.

| Axis | Fluent 2 | Carbon | GOV.UK | Polaris | Primer | Apple HIG *(memory)* | Material 3 *(memory)* | BOSS today | Take |
|---|---|---|---|---|---|---|---|---|---|
| **Organization** | Design (get started → principles → language → tokens → a11y) → Components by platform → Patterns → Resources | All about → Elements → Components → Patterns → Data viz → Designing / Developing / Contributing | Get started → Styles → Components → Patterns → Accessibility → Community | Getting started → Foundations → Design → Components → Patterns → Content → Tokens → Tools | Foundations → Components → UI patterns → Guides | Foundations → Patterns → Components → Inputs → Technologies | Foundations → Styles → Components | prototype v1 grouped by *kind of file* | **every one of them is a reader's path: why → language → parts → patterns → resources.** Prototype v2 adopts it, with *Start here* per reader |
| **Principles** | **4, one sentence each** (*natural on every platform · built for focus · one for all, all for one · unmistakably Microsoft*) — and every page below descends from them | "All about Carbon" (the why) | "Design principles" as GOV.UK's service standard; the system itself leads with *styles* | **6 experience values, one word each** (considerate · empowering · crafted · efficient · trustworthy · familiar) | (guides) | *(memory)* clarity · deference · depth, retired in favour of per-platform pages | *(memory)* none stated as principles; "foundations" | 3–5 **with a tradeoff each** — sharper than any of these — but **no rule below names the principle it descends from** (`principle:` as a field: 0 hits) | **traceability, as a mechanism:** a `principle:` on every pattern row and component usage rule; the site counts descendants; a principle with zero descendants renders as a finding (*a slogan*). Prototype v2 draws the chips |
| **Per-component page** | Usage page = *Resources · Types · Behavior · Layout · Accessibility · Content*, with do/don't pairs | Usage · Style · Code · Accessibility tabs; anatomy; keyboard table | *when to use · when not · how it works · **research on this component*** | usage · best practices · accessibility · content guidelines | usage · accessibility · props; lifecycle badge | *(memory)* best practices · platform considerations | *(memory)* guidelines · specs · accessibility | one tab (v0) → four tabs on Button (v1) | add Fluent's two: a **Layout** line (placement, alignment, RTL) and a **Content** line per component; GOV.UK's *Research on this component* is the Research chip |
| **Patterns** | product patterns | 17 UI patterns | **service patterns** — check answers · confirm an email · create accounts · addresses · bank details · dates | layouts (resource index, app settings) · common actions · new features | saving · loading · degraded experiences · feature onboarding · progressive disclosure · empty states · navigation · data viz | *(memory)* ~25 (onboarding, searching, undo, settings, loading…) | *(memory)* few | 10 AI-interaction patterns UP; `PATTERNS.md` per project; **the founder's flows in `FLOWS.md`** | **a flow that recurs is a service pattern.** GOV.UK's list is what `/spec` writes one FEAT at a time; `design-pattern-loop` promotes near-duplicate *components* — the same loop over near-duplicate *flows* is the composition |
| **Research on the page** | — | — | **yes, per page** — a *Research on this component* section citing the backlog issue; *always-on* research programme since 2026-03; *share research findings* as a contribution path | — | — | *(memory)* — | *(memory)* — | Research section (v1); chips on the pattern | confirmed by the one system that does it; **the mechanism is an `about:` on `EVID` that can name a design object** — the same question as 106's open Q2 (what ties an EVID to a cell), generalized |
| **Tokens** | global → alias, "named so the function is immediately recognizable"; theming by re-aliasing | @carbon/{colors,type,layout,motion,themes,…} packages; four themes | Sass settings; a new type scale (2024) | **eleven token families** — border · breakpoints · color · font · height · motion · shadow · space · text · width · z-index | primitives | *(memory)* system colours, Dynamic Type | *(memory)* design tokens as a foundation; Material Theme Builder | 3-layer DTCG, 6 families guarded; `tokens.json` guaranteed (dedb7ca) | families BOSS lacks that Polaris names: **breakpoints · z-index** (0 hits each). Both are the layout slot's tokens |
| **Layout** | base unit 4 → spacing ramp → grid anatomy → grid types → alignment → responsive techniques → **six named breakpoints with values** | 2x Grid | page templates; a width container | design/layout + tokens/breakpoints | foundations/layout + responsive | *(memory)* Layout, Spatial layout | *(memory)* Layout, adaptive design | **the hole** (0 layout hits; the extraction loop's "breakpoint" is a different word) | the slot now has Fluent's six sub-slots (prototype v2); `breakpoint.*` tokens; the guard's next family once tokens exist |
| **Interaction states** | on the Color page — rest → hover → selected get darker | per-component | focus states in get-started | **`design/interaction-states` as its own page** | — | *(memory)* per component | *(memory)* foundations/interaction states | five states per component; **no system-level rule** (0 hits) | one paragraph in the Colour slot: *how a state changes a colour*; drawn in v2 |
| **Content design** | Content per component | guidelines/content | style guide (the strongest in the field) | **content/** — alternative text · error messages · grammar and mechanics · inclusive language · naming · fundamentals | foundations/content | *(memory)* Writing | *(memory)* content design | voice · tone · terminology · error copy; **alt text 1 hit, inclusive language 0** | two lines in the Content slot: *alternative text* and *inclusive language* (the humane lens already owns the second — name it here) |
| **Lifecycle** | — | Draft → Preview candidate → Preview → Stable + a checklist | *trial* components; "research on component statuses" | — | **Experimental · Alpha · Beta · Stable · Deprecated · Removed** | — | — | stable · experimental · deprecated · retired; definition of done (v1) | nothing to add — BOSS's *done* is earned per row, which is stricter than a badge |
| **Data viz** | — | its own site | — | design/data-visualizations | ui-patterns/data-visualization | *(memory)* Charting data | *(memory)* — | 0 hits | **the gap is confirmed four times.** The palette question first |
| **Sound · haptics · illustration · pictograms** | — | pictograms | — | sounds · illustrations | — | *(memory)* haptics, playing audio | — | 0 (deliberately) | deferred-by-rule row; render nothing, say why once |
| **Contributing / propose** | — | contributing + checklist + PDLC | contribution criteria · propose a component · community | contributing | contribute | — | — | reuse / adjust / new boundary; `component-reuse-guard` | for a solo founder the proposer is the agent; already the mechanism |

**The read in three lines.** (1) Organization is settled by unanimity — a reader's path, not a
folder tree. (2) BOSS's principles are *sharper* than the field's (a tradeoff each) and *less
connected* — nothing below them says which one it serves; the fix is a field, not prose. (3) The
depth the field has and BOSS doesn't is at two ends: **layout** (a whole foundation with tokens) and
**research on the page** (GOV.UK alone does it, and it is the most BOSS-shaped thing here).

## What to invest in — ranked, each sorted

| # | Investment | Cost | Sort |
|---|---|---|---|
| 1 | **Reader's-path organization** for the site (and for `docs/design/` itself: the README the folder lacks — *who reads what*) | decided; v2 drawn | **task** — the renderer's section order, when it earns a build |
| 2 | **`principle:` on every rule** — a column in `PATTERNS.md`, a line per component usage rule, a chip on the render, a descendant count per principle, *zero descendants* rendered as a finding | one column, one render rule | **task** — measure first: how many of BOSS's own seeded pattern rows can name a principle today? if most can't, the rule is wrong, not the field |
| 3 | **Layout slot** to Fluent's six sub-slots + `breakpoint.*` and `z-index.*` token families in the DTCG template; the guard's spacing family stays off, a breakpoint literal becomes its own family once tokens exist | slots + two families | **task** (IDEA-107 step 3, now shaped) |
| 4 | **Research on the design object** — an `about:` on `EVID` that may name a pattern, component, flow or canvas cell; the site renders the chip from it | one field, read by the render | **open question** — the same as 106 Q2; grep who reads `assumption:` before adding anything |
| 5 | **Flows that recur become service patterns** — `design-pattern-loop`'s near-duplicate read over `FLOWS.md` rows | a loop predicate over a file that exists | **new scope** — its own id when a real project has two flows that rhyme; not before |
| 6 | Interaction-state rule · alt text · inclusive language — three lines in slots that exist | three lines | **task** |
| 7 | Data viz palette | a question on the token skill | **open question** (107 gap row 3, unchanged) |

Nothing here is a verb. Nothing here is evidence. The standing line holds.

## UX research on the site — yes, and where

Research is evidence about design objects. BOSS already records it (`EVID` records graded on the
ladder, personas with a `synthetic / real` ledger, `ux-check` findings marked *observed* /
*inferred*, the persona's *what we don't know*), and the playbook's chapter 9 renders the ledger by
date. The design site renders the **same records by the object they bear on**:

- **On the block** — a pattern carries `EVID ×2 · stated-pain`; a component carries *tested with a
  person: no*; a flow carries drop-off per step once `/measure` runs. Already the rule for the
  canvas; the same chip, here.
- **One Research section** — the ledger cut by rung: **observed** (someone was watched using it — n=0
  today, so a hole with the verb: *hand the caregiver's yes / no screen to one caregiver*), **stated**
  (what people said that bears on a design choice), **inferred** (what the founder assumed — the
  persona's guesses, marked), and **the open questions** the personas hold. Plus the interview guide
  as a printable block, because the persona's *don't know* list *is* one.
- **Never** a second Evidence chapter. The playbook's chapter 9 links here and back.

Carbon does not do this — its research is internal and unpublished. A design site that shows
*which of its rules a real person has ever tested* would be BOSS's own thing, and it is the humane
lens applied to the design system: the accessibility floor already says *not checked* is not a pass;
research says the same about *nobody has watched a caregiver use this*.

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

### Prototype v0 — published 2026-09-13

**https://claude.ai/code/artifact/d907896e-c1c7-4b5d-a4f3-d5bb861a435c** (private until shared). Hand-written
single-file HTML over **Tidewell**, its own artifact; the playbook (v1.1, same link as before) now
carries the family bar and its Brand chapter links across. Same visual system, same Link · Copy ·
Slide · Present on every block, same *Brand / No brand yet* toggle, light and dark.

Thirteen sections in three groups: **Brand** (current shape · the anchor as DEC-001 with its falsifier) ·
**Foundations** — Colour (nine semantic swatches, each with *chosen — DEC-001* or *derived*; dark as a
dormant slot), Type (six roles as specimens; scale ratio as a named-but-unearned slot), Space / shape /
icons (spacing bars, two radii, two elevations, five icons *as the decisions*; motion dormant), **Layout
as a hole** · **Language** — Principles (three, each with its cost, each a rendered do/don't pair),
Patterns (*Ours* first — Cover a shift with its five states — then two seeded rows), Flows (five steps,
the two asks, the three paths), Content (voice · tone by moment · terminology, six rows), Accessibility
(**eleven contrast pairs computed** — the prototype's own palette has three real findings: `text.muted`
3.63:1 at 11px, `text.placeholder` 2.54:1 on hole text, `signal.stale` 3.85:1 on chips — with the
token-level fix; five rules; five *not checked*, said once) · **The parts** — Components (the index with
status, usage counts and findings; Button in five states; ShiftRow with *empty* as a rendered gap;
StatusChip with states *n/a*; `CoverButton` as a near-duplicate with an off-token hex and a `kind` prop),
Exceptions (three against *one primary per view* → a verdict on the rule; one against *no raw values*
→ holds), Resources (a **real DTCG `tokens.json`** with Copy; the rest of the resources by direction
and how real each is).

**React to, in order:** (1) does a founder with four components and a tokens file feel like they *have
a design system*, or like they are being shown how little there is · (2) do the holes — layout, dark,
motion, the scale ratio — read as honest or as thin · (3) is a rendered do/don't pair the block that
carries into a deck, or is it the component card · (4) does the Resources block read as a handoff a
designer would accept · (5) the family bar — is three spaces the right count, and is *Design* the word.

### Prototype v1 — republished 2026-09-13 (same link)

Bug fixed first (Ajesh: *"the same bug that was on playbook for slide, where the slide takes over"*):
the overlay's class was `.slide` and so was the *Slide* button's, so every block's button inherited
`position: fixed; inset: 0` and covered the page. Overlay renamed; the same collision the playbook's
v2 fixed — carried in from v0 by copying the code. Drawn in from the second seed: **every value copyable** (click a swatch, a type role, a spacing
step, an import line, an icon — a small menu offers hex · token · `var(--…)` where it applies; the
Colour block gains *Copy all as CSS*) · **Button as a four-tab component page** (Usage · Style ·
Code · Accessibility — Carbon's shape: anatomy with the token each part uses, a keyboard table, what
has and has not been tested with a person) · a **definition-of-done row** on the component index
(tokens · states · contrast · narrow · strings · screen reader — mechanical where a guard exists,
*not checked* where it needs a person) · **Open in your design tool** on components (one linked,
three *no design file yet*; kit coverage *1 of 4* in the Resources table) · the Resources table says
*two-way for Enterprise; a tokens plugin for everyone else; native import unverified* · **14 ·
Research** — observed (a hole with the verb) · stated · inferred · the open questions · the interview
guide as a block.

**React to, in addition:** (6) is the value menu the right size, or should click copy the token
name and hold the menu for a second click · (7) do four tabs on one card read as depth or as a
wall · (8) is Research a section a designer would open, or is the chip on the block enough.

### Prototype v2 — republished 2026-09-13 (same link)

Reorganised as a reader's path: *Why it looks like this* (Start here · Principles) → *The language*
(Colour · Type · Space, shape, icons · Layout) → *The parts* (Components · Patterns · Flows) →
*Every screen* (Content · Accessibility) → *Take it with you* (Resources) → *Kept honest* (Exceptions ·
Research). A *Who reads what* block for designer · engineer · the agent · the founder. Every rule
carries an *↑ principle* chip and each principle counts its descendants. The Layout hole has
Fluent's six sub-slots. Colour gains *how a state changes a colour* and *where the accent may not
go*; Button's Usage gains a *Layout* line. **React to:** (9) is the group naming right (*The
language* is Fluent's phrase; *Kept honest* is BOSS's) · (10) do the principle chips read as
lineage or as clutter · (11) is *Start here* the page a designer would actually start on.

### The plan it was drawn from

Hand-written, over **Tidewell**. Draw: Brand → Foundations with three swatches and their
`DEC` lines and computed ratios, one failing pair · a type specimen · one principle as a do/don't ·
one pattern as a do/don't with its five states · one component card in five states with one
*off-token* badge and one missing-state gap · the layout slot as a hole · Resources with the DTCG
download. What it answers: does a founder with three components and a tokens file feel like they
*have a design system* · do the holes (layout, icons, dark mode) read as honest or as thin · is a
do/don't pair the thing that carries in a deck · does the Resources block read as a handoff.

## Recommended next steps — in order

1. ~~The Design space on the Tidewell prototype~~ **published (above)**. Reactions into this record's capture log.
2. **`tokens.json` as a guaranteed file** — the one build that stands on its own: a one-paragraph
   edit to `/design-tokens-init`, a `check` that the file parses as DTCG, a bullet under
   `## Unreleased`. Do not wait for the playbook.
3. **Rows 2 and 3 of the gap table** as slots: a *Layout* section in the style-guide template and
   a `color.chart.*` question on the token skill — named, empty, earned.
4. **Then decide** whether the chapter ships at MVP (a fifth reader of the same files, no new verb)
   or waits for `/design-library` at V1. Answer with the prototype in hand and 106's mechanism
   decision, not before.

## Decided 2026-09-13 — its own space, one family

Ajesh: *"it should be a part of tidewell, but almost its own page.. that can be published independently
of the other prototype. I could see the board, design, being independent, but being linked between the
2."* And the why, which is the retrieval argument in the founder's own words: *"a lot of the key ways
some of the best apps (apple, material…) they have their own robust websites. A lot of designers and
teams use it as a reference and ensure they are reusing existing."*

So: **one renderer, three spaces** — the playbook (106), the design guidelines (this), the board
(`boss board --html`, already shipped) — each its own single file with its own URL, joined by a
**family bar** in the top bar (*Playbook · Design · Board*). A designer gets the design URL alone;
an investor gets the playbook alone; both can walk across. The reuse claim is the same one BOSS
already makes for the agent (retrieval beats instruction, [[RVW-078]]): the site is the human-readable
half of the index the agent reads before component number two. Open question 1 below is closed;
question 2 stays.

## Open questions — written as questions

1. ~~Chapter of 106, or its own space with its own URL?~~ **Answered above — its own space, one family bar.**
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
- 2026-09-13 — **decided: its own space, one family** (Ajesh, second message — the reference-site
  argument: *"designers and teams use it as a reference and ensure they are reusing existing"*).
  **Prototype v0 published** as a sibling artifact; playbook republished v1.1 with the family bar and a
  Brand → Design link. Found while drawing it: the prototype's own palette fails its own contrast
  arithmetic in three places (muted, placeholder, stale-on-soft) — the page shows them as findings
  with a token-level fix rather than hiding them, which is the whole point of computing the pairs.
- 2026-09-13 — **second seed** (Ajesh): copy any value · design-tool integration as its own
  feature → [[IDEA-108]] · read Carbon deeper · should research show up. Carbon read at source
  (page tree from the website repo, packages from the monorepo); Figma's Variables API found to be
  Enterprise-only both ways (RVW-082 correction note). Three rules added; prototype v1 republished.
- 2026-09-13 — **third seed** (Ajesh): organization; Fluent 2's principles and depth; *"not just
  fluent, but also apple, material design and any other that you recommend."* Seven systems read —
  five at source, two from memory and marked; one table, three lines, seven investments sorted.
  Prototype v2 republished as a reader's path with principle chips and the Layout slot shaped.
