---
id: IDEA-106
type: idea
owner: product-lead
status: captured (prototype next — a mock over a fictional venture, before any mechanism is chosen)
gist: Everything a founder has uncovered about the venture — the why, the people, the canvas as boxes, the rivals, the evidence, the decisions — rendered as one beautifully designed, on-brand, single-file HTML space; every block deep-linkable and copyable into a deck. A view over records, never a document; holes and the evidence ledger survive the polish. Absorbs the living dashboard (065) and the case + deck (104).
proof: none
proof_note: Captured with a design and a prototype plan, not built. If it earns a build, the path is `src/playbook.js` (the fourth use of the `boss board --html` pattern) and the first slice is the canvas-as-boxes page alone.
created: 2026-09-13
absorbs: IDEA-065 (the living dashboard — the workbench half), IDEA-104 (rungs 3–4 of FEAT-025 — the case and the deck)
source: Ajesh, 2026-09-13 — "so we have the canvas. does it generate a visual html that looks like a
  canvas ..if the user wants to see how the boxes filled out? Also with all the research, competitive,
  market analysis or anything else. I wonder if it helps to create a visual html playbook, that visually
  amazingly renders it. I can imagine them being able to easily copy paste stuff into a presentation for
  internal presentations, vcs, or other presentations. I would love for the business acumen stuff being
  presented. Its almost like an internal playbook of business related. that looks like a great website.
  Also eventually if they have a logo or branding colors, it can look like it.. ?" → "its a very
  beautifully designed space, it compromises also of personas, the why of the company, vision, values,
  anything we uncover .. and it builds this very visually striking html." → "lets combine all ideas into
  one. also i think it needs to easily linkable, there should be a copy option if there is anything
  worth copying to easily paste into a presentation. I think lets first create a prototype of the idea
  to see how an example would look."
relates: FEAT-025, IDEA-063, DEC-004, IDEA-031, IDEA-097, IDEA-034
altitude: what BOSS ships a founder (not BOSS's own practice)
---

# IDEA-106 — The playbook: the venture, rendered so someone wants to read it

## The idea

The canvas today renders as a markdown table in four frames (Humane / Lean / BMC / onepager). The
competition set is a table in `docs/competition/`. Personas, evidence, decisions, the roadmap, the
founder's own *why* — each is a well-shaped record in its own folder, and none of them can be
*looked at*. A founder who wants to show a cofounder, an advisor or a room what they have found so
far either reads files aloud or re-types everything into slides.

**The playbook is one generated, self-contained HTML space over all of it** — designed well enough
that a founder is proud to open it, in their own brand once they have one, where every block has a
link and anything worth copying has a Copy. The canvas renders **as a canvas** — boxes, in the
frame's grid. Nothing on the site is written by BOSS; every word is the founder's record, and every
hole is a hole.

## What this record absorbed, and the one warning it keeps

Three ids held pieces of this. On 2026-09-13 Ajesh folded them into one (*"lets combine all ideas
into one"*).

| Was | Held | Now |
|---|---|---|
| [[IDEA-063]] / [[FEAT-025]] (shipped) | one answer store, several frames; the four-rung ladder; Layer 3 — holes render, ledger, freshness, no grades | **stays shipped**; this is the render over it |
| [[IDEA-065]] the living dashboard (parked 08-20) | a private read-only HTML workbench over everything, so a founder can *find* their material; *the line is state, not page count*; every artifact renders with its evidence state on it | **absorbed** — the workbench is this site, browsed |
| [[IDEA-104]] `boss case` + the deck (deferred 09-12) | rungs 3–4: the data room and the deck; the amended refusal — never a deck BOSS has to *invent the content for* | **absorbed** — the deck is present mode over the same blocks; the case is the site, shared |

**065 said the merge was the failure mode**: *"a private workbench showing everything and a curated
artifact shown to someone outside are two products, and merging them makes a thin record read as a
strong one."* That warning is right and it survives the merge in a different place. There is one
site, one renderer, one set of blocks — and **the evidence state is unremovable in every mode**.
The workbench and the shareable view differ only in what the founder chooses to show, never in what
a block is allowed to hide. A copied block carries its ledger chip and its source line; a present-mode
slide carries them in the chrome; a hole stays a hole in all three. The guardrail moved from *two
products* to *one product that cannot flatter*.

## How it should look — the design plan

### 1. One space, in reading order

A single generated site under `docs/playbook/` — gitignored, regenerated on demand, like
`boss board --html`. `index.html` plus one page per chapter; inline CSS; no framework; logo inlined
as a data URI; opens from `file://`. Light and dark.

Chapters in the order a *stranger* needs them, not the order the files were made (revised
2026-09-13 after prototype v0 — Ajesh: *"there is more story to be shared"*):

1. **Why** — the cover. The founder's why (`motivation:` and `success_looks_like:` from the IDEA doc,
   [[IDEA-097]]), the Promise (canvas *Promises*), the values (canvas *Principles*), and **the
   team** — who is building it and what makes that believable to a stranger (the *Modes of
   Engagement* unfair-advantage sharpen, FEAT-025's "team" row). Vision lives here.
2. **The product** — what it is *today*, in one paragraph: the IDEA doc's *current shape*, what has
   shipped (`FEAT` records at `shipped`), what is being built, the landing page's promise if one
   exists. The chapter a stranger reads first and BOSS has no single record for — see *Kicked up*.
3. **Who** — *People* plus its market sharpen (*how many are there, and how do you know* — the
   bottom-up count, never a "$50B"), then **the personas as stories**: `docs/personas/<slug>.md`
   rendered as a person — the `who` line as the headline, `context` as a day in their life, `jobs`
   / `pains` / `values` as the portrait, `what we DON'T know yet` as the open questions, and the
   `synthetic N% · real N%` ledger on the card.
4. **The problem, and who else fixes it** — *Problem*, then the competition in two tiers, both
   from records `/comp-eval` already writes: **key rivals** (`direct`, or in evidence — a real
   person named them) each get a **brief**: what it is, how they'd win, where it breaks, the two or
   three things identified about them; **the rest** (`watch`, `adjacent`) render as a list, one line
   each, no deep dive. Then **a matrix** — rivals × *the three-to-five features that touch the bet*
   (the `## How they do it` sections `/comp-eval` writes per decided feature), never a catalog.
5. **The canvas** — the boxes (§2).
6. **How it sustains itself** — *Business Model*, both branches; *Cost Structure* and the other
   dormant cells once live; the first dollar (`/money`); **the ask** renders as a hole *with the
   reason* until `mentor-capital` says the raise question is live.
7. **What we know** — the evidence ledger. Every `EVID` on the three-rung ladder as a dated timeline.
8. **What we've learned — the story so far.** Dated, newest last: the IDEA capture log, the canvas
   revisions, `BRAND.md`'s *What we've learned*, the devlog's *what surprised you* lines, each `EVID`
   and `DEC` as a point on the same line. The chapter that answers *"as we continue to learn about
   the company"* — and the first reader BOSS's five append-only logs have ever had.
9. **What we decided** — `DEC` cards: the decision, the falsifier, the revisit date, past-due marked.
10. **Risks & Harms** — a chapter, never a footer. **Trust** sits here: what the product refuses
    to do with people's data (`/trust`, the *What it refuses* line of `BRAND.md`).
11. **Brand** — the guidelines: who it's for, what it promises, what it refuses, how it sounds,
    what it is NOT, the name and why — then the anchor as swatches and a type specimen (accent,
    neutral, radius, type pairing) *when* tokens exist. A nascent brand renders its `unknown`s.
12. **What's next** — the `/roadmap` bets and the NO-list. The board (`boss board --html`) is
    *contained* here, not duplicated — one renderer, one board (065's Q3, answered).

Candidates not drawn, each with its trigger: **Health** (post-ship — `/measure`, `/health`) ·
**The interview guide** (the persona's *what we don't know* block *is* one; render it as a
printable page) · **The glossary** (the domain's terms, for a reader outside it).

**A chapter with nothing under it renders as a hole page**: the question it would answer and the verb
that answers it (`/persona derive`, `/comp-eval`, `/evidence`, `/decide`). It stays in the nav. An
absent chapter is the most honest thing on the site.

### 2. The canvas as boxes

- **The frame picks the grid; the answers don't move.** Humane = three bands (Human Foundation ·
  Product Expression · Stewardship). Lean = Maurya's grid (Problem · Solution · UVP · Unfair Advantage
  · Customer Segments over Key Metrics · Channels, with Cost · Revenue beneath). BMC = Osterwalder's
  nine. Same answer store as `/canvas --frame`; this is the fifth way to read it.
- **The floor holds on the page** ([[DEC-004]]): in Lean and BMC, *Risks & Harms* and *Principles*
  render as a band beneath the grid — same width, same type size — under *"two questions this canvas
  asks that Lean doesn't"*. Not smaller, not collapsed, not a footnote.
- **A hole looks like a hole.** `_(not yet)_` renders as a box with a dashed border and the humane
  prompt in placeholder ink. Dormant cells render *the condition that would wake them*, at full size.
- **Every box carries an evidence chip**: `EVID ×2 · stated-pain`, or `asserted`. The chip is the whole
  difference between this and a canvas tool.
- Credit line per frame — the skill already requires it (Maurya · Osterwalder · Humane Product Canvas).
- The box shows the **current** answer; what to do with a cell that carries its own revision history
  is an open question below.

### 3. Built to be lifted — the block, the link, the copy

The unit of the site is a **block**: one idea, one card, proportioned for a slide (16:9, with a
4:3-safe area). A canvas box is a block; so is a rival, a persona, one `DEC`, the ledger, a bet.

Three affordances on every block, all zero-dep:

- **Link** — every block has a stable id (`#canvas-people`, `#rival-acme`, `#dec-004`), a hover anchor,
  and a *copy link* that puts the deep link on the clipboard. Chapters and blocks are addressable from
  a chat message, a commit, a devlog line. On a published copy the same anchors are a URL someone
  outside can open on a phone.
- **Copy** — on anything worth copying: rich HTML + plain text to the clipboard, so a table pastes as
  a table and a list as a list into Slides, Keynote, Docs, Notion. Not on chrome, nav, or hole
  boxes — *worth copying* is the rule; a Copy on everything is noise.
- **Slide** — the block alone, full viewport, brand chrome, screenshot-ready. Screenshot is the one
  path into *every* deck tool; Copy is the nicer one where it works. **Present** mode walks the
  blocks with arrow keys — rung 4's deck without BOSS composing a single slide.

**What travels with the copy:** the ledger chip, the source line (`docs/competition/README.md ·
checked 2026-08-20`) and, for a rival, its URL. The founder may delete it in their deck; BOSS never
pre-deletes it.

A print stylesheet: one block per page, 16:9 page size → a PDF in one keystroke.

### 4. The brand

- Reads `docs/BRAND.md` — accent, type pairing, the voice line, a logo path — and `docs/design/tokens/`
  when `/design-tokens-init` has run. Logo inlined. No fonts fetched: system stacks, the named pairing
  when it is installed.
- **A field marked `unknown` falls back to the neutral default for that field only.** Never invent a
  colour. A nascent brand renders neutral and says so in the footer (*brand: nascent — `/landing`
  seeds it*). The brand doc's own rule: a confident answer with no information is worse than a blank.
- **The neutral default has to be good enough that a founder with no brand is proud of it.** That is
  most founders at Quickstart; the default is the product for them, not a fallback.

### 5. What keeps it honest — the polish *is* the risk

- **The ledger is in the chrome.** Every page header, and every slide-block in small type: *N of M
  claims backed by graded evidence · newest signal DATE*. Coverage is a fact; readiness is a verdict.
  **No %, no grade, no traffic light, no "investor-readiness"** — position, never a grade.
- **Holes survive the render, survive the copy, survive the slide.**
- **Freshness on every block** — source path and date; a record past its `revisit_by` or `checked`
  date renders *stale on the block itself* (the `/design-library` source-hash precedent).
- **At n=0 the cover is a conscience moment** — *"3 of 41 things on this site are backed by someone
  outside this room"* — the honest first page, in the founder's own brand.
- **No composed prose.** Ordering and layout are BOSS's; every word is the founder's.
- **Regenerated, never edited** — a view, not an app. The line is state, not page count (065). The
  moment a founder can type into it, `docs/` and the site disagree and frontmatter-is-truth is dead.

### 6. Refusals — written up front so the seed's own phrase ("it can include more components") has a wall

From [[IDEA-034]], [[IDEA-065]] and [[FEAT-025]], carried in: no editing in the page · no server,
accounts, daemon or sync · no invented numbers on any block · no cap table, entity or securities
content · no financial projections (price × cost at today's numbers is *Cost Structure*, already a
cell) · no readiness score · no investor update until n>0 · no second board renderer.

### 7. Mechanism — a recommendation, not a decision

- **CLI, not skill:** `boss playbook [--open] [--frame humane|lean|bmc]` → `src/playbook.js`, zero-dep,
  the fourth use of the `boss board --html` pattern. The one-pager went to the *skill* at v0.272.0
  because it composes; this composes nothing, so it needs no judgment and wants no skill.
- **Parsers exist:** `frontmatter.js`, `records.js`, the canvas `| **Cell** | Answer |` table, the
  competition table, `EVID` grades, `DEC` fields, `docs/personas/<slug>.md`.
- **Shareable** — single-file, so `/pretotype`'s Artifact publish path already carries it the day a
  founder wants to send a link; the block anchors become URLs.
- **First slice, if it earns a build:** the canvas-as-boxes page alone, with chips, holes and links.
  Every other chapter is the same renderer over a different folder.

## The prototype — see it before choosing any of the above

Ajesh, 2026-09-13: *"lets first create a prototype of the idea to see how an example would look …
how it should visually look, how to interact with it, how dummy content would appear."*

- **A fictional venture, not BOSS's own.** Dummy content lets the prototype *deliberately* show every
  state — a filled box, a hole, a dormant cell, a stale rival, an `asserted` cell beside an
  evidenced one, a nascent brand beside a set one — where BOSS's own canvas would show one
  idiosyncratic record (revision history inside cells; Ajesh's private words). Cohort: a
  `non-tech-founder`, so the example reads to the widest audience.
- **Hand-written HTML, one file, published as a private artifact.** Not a renderer — a picture of
  what the renderer would emit. Three chapters, not nine: **Why** (cover, ledger in the chrome),
  **the Canvas** (boxes, Humane and Lean toggle, chips, holes, the DEC-004 band), **Rivals** (table
  + cards, one stale). Link / Copy / Slide / Present on every block, working, so the *interaction*
  can be felt, not described.
- **What it answers:** does the neutral default feel like something to be proud of · do holes read
  as honest or as embarrassing · is the chip legible or clutter · does present mode feel like a deck
  or like a website with big text · does a copied block land in a real slide tool as a table.
- **What it does not decide:** CLI vs skill, the parser, the field that ties `EVID` to a cell.

## Recommended next steps — in order

1. **The prototype** (above). Fictional venture, three chapters, every affordance live. Published
   private; reactions go in this record's capture log, not in chat.
2. **The one test that is load-bearing, by hand:** copy one block from the prototype and paste it
   into Keynote, Google Slides and PowerPoint. If it lands as a table in two of three, Copy is real;
   if it lands as a screenshot everywhere, Slide mode *is* the copy path and Copy shrinks to text.
3. **A second look at the prototype through two lenses**, one pass each, in writing: `designer`
   (the visual system, the five states, the rhythm of a chapter) and `persona-non-tech-founder` +
   `persona-returning-founder` (does it flatter? does it respect experience?). Two personas, not
   eight — the two whose reactions would change the design.
4. **Then decide the mechanism** and answer the open questions with the prototype in hand. Not before.
5. **Build the first slice** only against a trigger (below), and only the canvas page.

## Kicked up — what building the render shows about BOSS (found tasks, written as found)

Ajesh, 2026-09-13: *"as we are building this, its highlighting things we may not be doing in boss,
or properly doing. so lets track what other work it kicks up."* Each is a task, a new scope, or a
question — not a fix made in passing.

| # | What the render wants | What BOSS holds today | Sort |
|---|---|---|---|
| 1 | a **matrix** and a **key / not-key** tier of rivals | `/comp-eval` writes `direct`/`adjacent` and `watch`/in-evidence, and says *"there is no feature-comparison matrix and there is not going to be one"* — a catalog has no vote in `/roadmap` | **question:** is a matrix over *decided* features (the `## How they do it` sections it already writes) a render of the refusal or a breach of it? *Key* = direct or in-evidence — no new field needed |
| 2 | **brand guidelines** as swatches and a type specimen | `BRAND.md` is prose with `unknown`s; the anchor (neutral, radius, type pairing, accent) is a `DEC`; tokens live in `/design-tokens-init`'s file — three sources, none parseable as a unit | **task:** decide the one place a colour is a fact (tokens) and make `BRAND.md` point at it, not restate it |
| 3 | a persona **with key demographics, as a story** | `/persona` writes *"the situation, not demographics"* on purpose; the `who` line carries the little demographics it allows | **question:** render the `who` line as the demographic headline and stop there, or does the persona record want a `demographics:` line? Ask a founder, not the render |
| 4 | **an overall product description** | none exists as a record — the IDEA doc's *current shape* is pre-build, `FEAT`s are slices, `/landing` holds the promise. Composing one from those is the closest the render comes to writing prose | **new scope:** where does "what the product is today" live? A `## The product today` section on the IDEA doc, maintained by `/log` at ship? |
| 5 | **the story so far**, dated | learning is scattered across five append-only logs (IDEA capture log, canvas revisions, `BRAND.md` learned, devlog, `EVID`/`DEC` dates) with no reader that joins them | **task:** the render is the reader; the parse needs one date convention across all five |
| 6 | an **evidence chip per cell** | `EVID` carries `assumption:` as a free phrase, no `cell:` | **question** (open question 2) |
| 7 | the **current answer** in a box | BOSS's own canvas cells carry their revision history inline (`🟢 v0.5 — RE-AIMED…`) | **question** (open question 1) — a founder's canvas may never do this |
| 8 | **the ask** as a hole with a reason | `mentor-capital` defaults to *not yet*; nothing records *why not yet* in a place a render can quote | **task:** the not-yet needs a sentence on disk, or the hole has no reason to show |

## Open questions — written as questions, not carried

1. When a canvas cell carries its own revision history (BOSS's own does), does the box show the
   latest paragraph or the whole cell — and does a founder's canvas ever hold history, or only BOSS's?
2. **What ties an `EVID` to a cell?** `assumption:` is a free phrase pointing at the riskiest
   assumption, not a cell id. The per-box chip needs either a `cell:` field or judgment — grep who
   reads `assumption:` before adding a field nobody reads.
3. Does a rich-HTML clipboard write paste as a native table into Keynote, Google Slides and PowerPoint?
   (Step 2 above answers it.)
4. Is *playbook* the word? To a founder a playbook is a how-to; this is a *portrait* of the venture.
5. Single page with sections, or multi-page? (065's Q1 — volume decides; the prototype is one page.)
6. Does it ship to every founder, or is it a BOSS-local tool? (065's Q5 — a founder's need to browse
   their own docs is real; whether it is BOSS's job is not obvious. Answer from a founder, not a demo.)

## Gate

`captured`. The mandate stands — compose and subtract; n=3 signals, all stated-pain, nobody observed.
The prototype is a **mock to react to**, not a build; it costs one file and decides nothing. The
*build* trigger, carried in from 065 and 104 together: **a founder (or Ajesh on a real project) goes
looking for their own material and cannot find it without grepping, or asks for something to show a
room** — the symptom this surface treats. Until then it is a good idea with a prototype attached.

## Prototype v1 — republished 2026-09-13 (same link)

Bug fixed (Space on the focused Close button both stepped and closed — the overlay takes focus
now). Drawn in: **2 · The product** (today / shipped / not) · **3 · Who** (Dee as a story, ledger
60/40, the caregiver as a hole) · **4** in two tiers — two key briefs, a four-line watch list, and a
**matrix over the four decided features** (`unchecked` is its own answer) · **8 · What we've
learned** (eight dated points from five logs) · **11 · Brand** (current shape, swatches, type
specimen — *proposed, not decided*, so chapter 9 stays a hole honestly) · a team block on the cover.
Now 8 of 12 chapters drawn; 6, 7, 10, 12 not.

## Prototype v0 — published 2026-09-13

**https://claude.ai/code/artifact/e3f72fdf-dc50-4ebe-9f78-0d0f66684c35** (private until shared). Source:
hand-written single-file HTML, no renderer behind it; fictional venture **Tidewell** (home-care rota
cover, `non-tech-founder`, `motivation: own-problem`). Drawn: Why (cover + conscience line), Rivals
(table + four cards, one stale at 134 days), the Canvas (Humane ⇄ Lean, 13 cells: 3 evidenced, 6
asserted, 2 holes, 2 dormant, the DEC-004 floor band), and chapter 7 as a hole page. Live: Link ·
Copy (rich HTML + text) · Slide · Present (arrow keys) · brand ⇄ no-brand toggle · light/dark · print
one block per page. Not drawn: chapters 2, 5, 6, 8, 9.

**React to, in order:** (1) is the no-brand default something to be proud of · (2) do the dashed
holes read as honest or as embarrassing · (3) chip: legible or clutter · (4) Present: a deck, or a
website with big text · (5) paste one copied block into Keynote / Slides / PowerPoint — table or
picture? Write the reactions into the capture log below.

## Capture log

- 2026-09-13 — seed, three messages (Ajesh). Design plan written before any build. Lineage read:
  063 → FEAT-025 → 104; 065 parked 08-20 with the same seed sentence (*"so that they can use that
  content to build the pitch deck"*).
- 2026-09-13 — **prototype v0 reactions** (Ajesh): a bug — *"the switch between slides and just
  content keeps hopping between the 2"* (Space on the focused Close button both advanced and closed;
  fixed in v1 — the overlay takes focus, not a button) · competitive eval with **key rivals as briefs**,
  non-key as a list, and **a matrix** · **brand guidelines** as a chapter · **personas as stories** with
  demographics · **track what it kicks up about BOSS** · *"more story to be shared"* — how the company,
  the why, the who and the problem were learned over time · **an overall product description** ·
  *"wondering what else?"*. Chapters revised 9 → 12; *Kicked up* table opened with eight rows.
- 2026-09-13 — **folded**: 065 and 104 → this record (Ajesh: *"lets combine all ideas into one"*).
  065's *two products* warning kept as the *cannot flatter* rule. Added: linkable blocks, Copy only
  where worth copying, the prototype plan (fictional venture, three chapters), the ordered next steps.
