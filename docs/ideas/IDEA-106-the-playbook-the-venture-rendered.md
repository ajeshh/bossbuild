---
id: IDEA-106
type: idea
owner: product-lead
status: shipped (FEAT-026..029, all four slices, 2026-09-13; FEAT-035/036/039 grew from it)
shipped_on: 2026-09-13
promoted_to: FEAT-026, FEAT-027, FEAT-028, FEAT-029, FEAT-036
spun_to: IDEA-129
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

> Building as [FEAT-026](FEAT-026-the-playbook-render.md) — slice 1, the canvas as boxes. Ajesh, 2026-09-13: *"lets start building this out!!!"*

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

Chapters named the way the audience names them (Ajesh, 2026-09-13: *"competition should be
competition. Think of your audience, and being able to easily ID the content"*), in three groups —
17 as of prototype v3. Each is a projection over records that exist; the source is named per chapter.

**Pitch** — the arc a stranger reads first
1. **Vision** — the Promise, the founder's why, `success_looks_like`, Principles, who is building it,
   and *In five years* (a hole until the IDEA doc carries a `vision:` line — the far-horizon question
   BOSS never asks; Sequoia's tenth section).
2. **Product** — what it is *today*, what has shipped, what it is not.
3. **Customers** — every `docs/personas/*.md` as a **snippet**, not the full card (Ajesh, 2026-09-13,
   relayed from the Design lane: *"maybe personas from playbook should be here? and a snippet
   there?"*): the `who` line, the two stat tiles, the `synthetic · real` ledger chip, and a link
   across to the Design space's `#persona-<slug>`, where the full card lives — the design space is
   where a persona is *used*, the venture space is where it is *presented* (IDEA-107, "the fourth
   seed"). Primary first, secondary after, a hole for the next. Multiple personas are the normal case.
4. **Problem** — the pain · how it's handled today and where each falls short · **Why now** (its own
   block; the Story cell's second half surfaced — Sequoia's fourth section, previously buried).
5. **Market** — how many and how you know (the People sharpen) · **the ceiling by arithmetic** (two
   cells multiplied, labelled *not a forecast* — FEAT-025's line holds) · **research you've
   imported** (`/import` → `docs/source/`, each with its date and what it changed; the intake path
   for market research and sizing).
6. **Competition** — the table · **key rivals as briefs** (direct, or named in evidence) · the watch
   list one line each · the matrix over decided features.
7. **Canvas** — the boxes, Humane ⇄ Lean ⇄ BMC, the floor band.
8. **Business model** — who pays, how much · what it costs to serve · **the ask, as a hole with the
   reason** (`mentor-capital`'s *not yet* sentence, quoted from the dossier).

**Proof** — what backs the pitch
9. **Evidence** — every `EVID` on the ladder, dated. *(not drawn)*
10. **Learnings** — the story so far, dated, read from five logs.
11. **Decisions** — `DEC` cards; a hole page when none.
12. **Risks & harms** — the chapter, with Trust inside it. *(not drawn)*

**Company** — who and how
13. **Team** — a bio per person: the specific thing seen/built/sold/lived, why a stranger should
    believe it, what they bring and don't; **who is missing written as plainly** (the cofounder
    hole, the advisors hole). Photo storage per person.
14. **Brand** — current shape, the anchor as swatches and specimen, `unknown`s shown.
15. **Design** — the guidelines and tokens; a **sibling space** (the peer session's Design artifact),
    linked from the family nav and the rail, not duplicated here.
16. **Roadmap** — bets and the NO-list. *(not drawn)*
17. **Board** — `boss board` contained, not duplicated. *(not drawn; sibling in the family nav)*

**Sibling spaces.** A second session added a family nav — *Playbook · Design · Board* — on
2026-09-13. One product, several spaces, one brand and one ledger across them; the playbook is the
one a stranger reads, the others are the founder's.

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

### 8. How it tells the story — the deck is the chapter order, read aloud

Ajesh, 2026-09-13: *"I wanna keep developing how we story tell."* The playbook has two readings of
the same records — the site (browse, rich, everything) and the deck (present, one thing at a time)
— and the story is the same in both because **the chapter order is the pitch arc**: why → the
product → who → the problem and who else fixes it → the canvas → how it sustains → what we know →
what we've learned → what we decided → risks → brand → what's next.

- **Every chapter opens with one line, and that line is the story.** Read in sequence the chapter
  lines *are* the pitch: *A home-care agency shouldn't lose its Sunday to a spreadsheet · One tap
  when someone calls in sick · Dee, 52, runs nine caregivers from the kitchen table · Every Sunday
  night the owner rebuilds the week by phone …* In the deck each becomes a full-bleed chapter slide.
- **Where the line comes from — BOSS writes none of them.** The rule: *a chapter's line is the first
  sentence of the record it renders.* Why ← the Promise cell · The product ← the IDEA doc's current
  shape · Who ← the persona's `who` line · Problem ← the Problem cell · Learned ← the newest
  *surprised* line · Decided ← the newest DEC · Brand ← the tagline. A record whose first sentence
  makes a bad chapter line is a record worth a better first sentence — the render tells the founder
  that, it doesn't fix it.
- **Slides are composed per block type, not enlarged.** A canvas cell = the cell name small, the
  answer in display type; a rival = *why they might win* as the headline; a persona = the card; a
  table or timeline = itself, wider. The cover slide is the promise + the conscience line.
- **The deck exports.** *Export PDF* prints one slide per page at 16:9 (13.33 × 7.5 in) — the
  universal path into any deck tool, and the artifact a founder mails.

### 10. Charts — only over numbers a record holds, one hue, to scale

Ajesh, 2026-09-13: *"graphs like pie chart or bars … for market research or for anything."* The
rule that keeps a chart honest here is the same as for prose: **the render draws a number only if a
record holds it, and says which one.** Counted numbers (the register by size band, signals by rung,
cells by state) get a chart; a number nobody counted stays a hole, not a placeholder bar.

- **Form follows the job**: magnitude → bars, one hue (the accent), direct labels, a recessive grid,
  a table under a disclosure for every chart. **No pies** — a part-to-whole reads better as bars, and
  every categorical palette derived from this brand failed the CVD/chroma validator (the greys are
  the brand; a chart can't borrow them for identity). Semantic amber stays reserved for *stale*.
- **Where a number would come from**, per chapter: Market ← `/import`ed sources with a table in them
  (the register CSV) · Evidence ← `EVID` grades · Canvas ← cell states · Business model ← Cost
  structure once filled · Health ← `/measure`, post-ship. A chart on the Roadmap or the Team is
  decoration; none is drawn.
- **Kicked up:** nothing in BOSS holds a *table*. `/import` copies a document; nothing extracts a
  series with a source and a date the render could plot (row 15).

### 11. Values as a page, not three lines

Ajesh: *"the principles, values, it doesnt look more interesting, just 3 lines … a page sharing
how we build, what are our values, one headline, and then more text describing it."* Drawn as
**How we build** on the cover: one card per principle — the canvas line as the headline, a
paragraph on what it means in practice, **what it costs us** (a principle with no cost is a slogan),
and where it came from (the founder's, or an `EVID`). The headlines exist in the Principles cell;
the paragraphs and costs have no home — proposed as `docs/BRAND.md § How we build` (row 16).

### 9. Against the canonical deck — what a VC expects that the records don't hold

Ajesh, 2026-09-13: *"do some research on what other content shd be there that we dont have."*
Fetched at source on 2026-09-13: **Sequoia Capital, "Writing a Business Plan"** (Team Sequoia; page
dated 2026-09-11) — ten sections: company purpose · problem · solution · why now · market potential ·
competition/alternatives · business model · team · financials · vision. **Not cited:** YC's seed-deck
guide (a JS app; the HTML carries only its title) and Kawasaki's 10/20/30 page (bot-check) —
neither readable at source, so neither used ([[vet-verify-attribution]]).

| Sequoia asks for | The playbook has | The gap, and where it lives |
|---|---|---|
| a single declarative sentence | the Promise cell | — |
| problem · how addressed today · shortcomings | Problem + alternatives + rivals' *where weak* | — |
| solution, why unique | Product + Story + UVP | — |
| **why now** | the Story cell's second half | **render** — its own block (v3) |
| **market potential** | the bottom-up count | **record** — sizing beyond the count; `/import` is the intake, nothing reads it into a chapter yet |
| competition, direct and indirect | Competition | — |
| business model | Business model cell | — |
| **team** — *"the story of your founders"* | one paragraph on the cover | **record** — no person record, no bio, no photo (kicked up #11) |
| financials, *"if you have any"* | price × cost at today's numbers; projections refused | by design (FEAT-025) |
| **vision** — *"five years"* | `success_looks_like` asks three months | **record** — BOSS never asks the far horizon (kicked up #12) |

Kept that Sequoia doesn't ask for, on purpose: the evidence ladder, Risks & harms, Principles,
Decisions, Learnings, Brand — and the ask rendered as a hole with its reason.

### 12. The mentor reviews and the 2026 read (2026-09-13)

Ajesh: *"anything else missing from this? lets have vc mentor review, and also anything else around
how to get funding in 2026 and what we should be presenting that might be missing."* Two mentors
read the record and prototype v4; the research ran in parallel.

**`mentor-fundraising` — what an investor probes, in order:** (1) willingness to pay — the canvas
names its own kill-question and shows it untested (`asserted · 0 paying`); (2) the ceiling — £2.5M a
year is the whole pond at today's price: *right-sized, not venture-shaped*, and the honest end of
most VC conversations; (3) what happened after ship — sixteen days of a live product and not one
number. **The not-yet sentence, now real** (it replaces the fictional one in the prototype):
*"Not yet — nobody outside the founder's circle has paid or been watched using it, and at £4 a
caregiver across 6,400 agencies the whole pond is £2.5M a year, so the open question isn't when to
raise but whether this is a venture at all; it reopens when a stranger has paid for a second month,
and the honest answer then may still be 'stay right-sized'."* **Hide from a shareable view:** Priya
(`synthetic 100%`, a labelled fake quote) and the persona bars' false precision (fixed: ordinal
rank). **Keep refused, agreed:** projections, readiness score, cap table, invented photos. **Keep
shown:** the £2.5M ceiling and the 3/0/0 ladder — *"a founder who hides them is raising on the wrong
story."* **What changed by 2026, confident only:** shipping signals little (an AI-built MVP is
assumed cheap), so distribution, retention and willingness to pay are probed harder; *"is AI just a
feature here"* is a standard objection and the credible answer is a moat that isn't the model; a solo
non-technical founder building with AI draws a data-security and code-ownership question that didn't
exist for this profile before. Unsure, and said so: round sizes, traction norms, UK instruments.

**`mentor-pitch` — the deck:** the chapter lines read alone are *nearly a pitch* (§8's rule works),
with two faults — solution lands before problem, and **three chapter lines are BOSS's, not the
founder's** (Canvas *"read as boxes"*, Learnings *"in the order it happened"*, Decisions *"nothing
recorded yet"* describe the render; the room tunes out exactly there). Open on the tension (Problem's
line), close on Team → the ask → the tagline, not on swatches. **~50 slides is not a deck:** proposed
a mechanical profile — an ordered id list, a per-chapter cap, a hole policy — investor 12 / internal
20 (built in v5 as `PROFILES`). **The missing slide: what it looks like** — no record holds an image,
so there is no product-in-use slide, and a 2026 room asks that before market (row 10 again).
**Honesty devices in the room:** ledger on the cover, the close and every PDF page — not every slide
(moved to the deck's bottom bar); the cover conscience line is *the best slide for the right investor*;
keep two hole slides (the ask, the cofounder — they read as judgment), skip *"Nothing recorded yet"*
full-bleed; `asserted` reads as *made up* to a stranger — the chip stays, two words max. **Visual:**
tables and personas at 13px are *"a website with big text"*; rival slides hid the rival's name
(fixed); machine syntax leaked (`_(not yet)_`, `motivation: own-problem` — fixed).

**The research, graded.** Readable at source: **Sequoia** (2026 page, ten sections — §9) and
**DocSend/Dropbox** (Justin Izzo, 2025-04-01, data from their 2020 pre-seed report): 12 sections in
four buckets — overview (purpose, team, problem, solution, product) · monetization (business model,
financials) · product-market fit (market size, **why now**, traction, competition) · **the ask**;
investors spend under three minutes; funded decks put **product and why-now earlier**, **always had
a competition section**, **none had a table of contents**; ~20 pages, ~50 words a slide. **Not
readable at source, therefore not cited:** Carta Q1 2026 (bot-check), DocSend's 2026 seed post
(bot-check), YC (JS app). **Circulating unverified** (vendor blogs only — pitchwise, eqvista,
flowjam): a $24M median seed post-money, *"$300–500K ARR expected at seed"*, AI screening of decks
before a partner reads them. Filed as claims, not facts.

**What the reviews add to the chapter list:** Problem before Product in the deck order (the site
order is not the room order — the profile carries its own); a **Health** chapter drawn the moment
`/ship` has run (its trigger *fired* for Tidewell and the chapter wasn't there — v5 draws it as a hole
page); the compliance stance inside Risks & harms (data basis, the regulator by name, safeguarding
when *covered* isn't); and the AI-era question — *why doesn't the incumbent add a model that makes
the cover call next quarter?* — which no cell asks.

### 13. Ajesh's rulings on the reviews (2026-09-13) — the audience is the founder first

- **Who it is for.** *"This is not just for VCs, its also for the team and entrepreneur to stay
  grounded."* The playbook is the founder's and the team's; **the VC deck is a cut of it**, never
  the other way round. So the fundraising mentor's *hide Priya* is overruled: *"priya is a
  proto-persona, as we get real data the entrepreneur can fill it in … to remember who they are
  solving for."* A synthetic persona stays on the site with its `synthetic 100%` ledger; the VC cut
  simply doesn't carry it. The profile mechanism resolves the disagreement without a rule.
- **The cut is editable.** *"a VC-Deck cut export option that focuses only on the key slide, but
  they can also easily delete slides."* Present has *VC cut · 12*, *Internal · 20*, *Everything*; any
  slide can be **removed from the current cut** (remembered per cut, in the browser) and restored;
  *Export this cut as PDF* prints what is left. The founder's delete is the last word; BOSS's
  profile is the first draft.
- **After the first user, what matters is market signals**: *"user acquisition, retention, and
  being able to show how its going … when does it start to get market signals right."* Health is a
  chapter of three — **acquisition** (are they coming, and from a channel or by hand), **activation**
  (did the aha happen, how many days in), **retention** (did she use it a second Sunday) — each
  with the day it *starts to mean something*: a hand-delivered first user is a test; the signal
  starts with the first stranger; retention reads at n≈10; below that, `/health`'s own rule — talk
  to them, never a score. The first retention number is also the first `observed-behavior` rung.
- **The record gaps stand** (rows 17–22): *"Yes."* Those are intake work for BOSS, not render work.

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
| 9 | a persona **card** with photo, quote, bars, stat tiles, demographics | six fields, no quote, no numbers, no face — deliberately (a synthetic persona that looks finished lies better). Ajesh: *"our existing personas is weak"* | **new scope:** `/vet` the three pages he handed over, per field — inboxed as `docs/research/inbox/persona-record-is-thin-against-the-craft.md` |
| 10 | slides that feel like *"the best presentations today"* | the render can only be as rich as the record; a cell is one paragraph, a rival is a table row, and no record holds an image | **question:** which chapters earn a visual the records don't hold (a chart from `/measure`, a screenshot from `/ship`, a photo from a real interview) — and where does each come from? |
| 11 | **a bio and a photo per person** — founder, cofounder, team, advisors — and a photo per persona | no person record exists; the founder is a sentence in the Modes cell's sharpen, `mentor-cofounder` and `mentor-hiring` have nowhere to write a person down, `/persona` has no `photo:` | **new scope:** a person record (`docs/team/<slug>.md` + `<slug>.jpg`, and `photo:` on personas) — fields: the specific thing seen/built/sold/lived, why believable, brings / doesn't, role, since. Readers: the playbook, `/landing`'s about, `mentor-cofounder` |
| 12 | **In five years** | `success_looks_like` asks three months; nothing asks the far horizon | **question:** does BOSS ask it at all (a `vision:` line on the IDEA doc), or is the five-year answer exactly the confident-with-no-information sentence the brand doc refuses? |
| 13 | **intake for market research and sizing** — *"we should be able to intake content and keep adding it"* | `/import` exists and folds material into the IDEA doc; nothing routes an imported report to a chapter or a cell, and nothing dates it on the way in | **task:** `/import` writes a `docs/source/<slug>.md` header (date, origin, what it changed) the render can list; sizing beyond the count stays a hole until a source is imported |
| 14 | **sibling spaces** — Design, Board, later others | a second session built a Design artifact and linked it by hand | **question:** one renderer with chapters, or several spaces with one brand and one ledger? The family nav is the answer for now; the mechanism decision (§7) has to include it |
| 15 | **charts** over market research, evidence, anything counted | no record holds a *table*; `/import` copies a document whole; `EVID` grades and cell states are countable at render, nothing else is | **task:** an imported source that carries a series gets it extracted with a date and origin (`docs/source/<slug>.md` + a small CSV) so the render can plot it and cite it |
| 16 | **values as a page** — headline · meaning · cost · origin | the Principles cell holds one-liners; the meaning and the cost of each have no home | **new scope:** `docs/BRAND.md § How we build` — one paragraph and one cost per principle; the cell stays the headline. Readers: the playbook, `/landing`, `voice-keeper` |
| 17 | **use of funds · milestones the money buys · round size · instrument** | absent by design at n=0; when the question reopens, nothing holds *"£X buys these three observed-behaviour milestones"* | **new scope:** an *ask* record, gated on `mentor-capital`'s not-yet flipping — milestones written as EVID rungs to reach, never revenue lines |
| 18 | **prior capital and ownership** — *has anyone put money in; are you sole owner* | cap table refused (rightly); a one-line fact pointer is not securities content | **task:** `prior_capital:` on the IDEA doc — *none* / *see lawyer* / a sentence; the first fact-question every investor asks |
| 19 | **unit economics** — CAC, payback, gross margin, churn | Cost structure is a hole; `/measure` picks one activation metric, not the set; `/ai-cost` holds cost-per-user for AI products only | **question:** which of these does a pre-PMF founder honestly hold, and does BOSS refuse the rest as projections? |
| 20 | **AI-era defensibility** — *why doesn't the incumbent add a model that does this next quarter; why doesn't a nephew build it in a weekend* | the matrix is over features; *Unfair advantage* holds domain trust (the right answer) but no cell asks the question | **question:** a sharpen on *Modes of engagement*, or a new Risks & harms line? |
| 21 | **compliance stance** for a care product — data basis, the regulator by name, safeguarding when *covered* isn't | Risks & harms holds *harm*; `/trust` holds the privacy posture; nothing holds the regulatory relationship | **task:** Risks & harms gains a *stance* half; `/trust` writes the data-basis line into it |
| 22 | **founder runway** — *full-time* with no burn or personal-runway line | nothing | **question:** is this BOSS's to ask? It decides whether "three months" is a plan or a hope |
| 23 | **the product, seen** — a screenshot or a 30-second recording | no record holds an image; `/ship` hands back a URL and nothing else | **task:** `/ship` (or `/log` at ship) captures one screenshot into `docs/product/`; the playbook renders it before Market |
| 24 | **Health** — the chapter's trigger fired (shipped 2026-08-28) and the chapter wasn't drawn | `/measure` and `/health` exist; nothing renders their output | **render** — drawn as a hole page in v5; the real render reads `docs/measure*` when they exist |
| 25 | **three chapter lines are BOSS's** (Canvas, Learnings, Decisions) — §8's rule has no source for them | the chapters render *the render*, not a record with a first sentence | **question:** derive the line from the newest record in the chapter (newest DEC's title, newest *surprised* line, the Promise for Canvas) — or accept that some chapters have no line and get no slide |
| 26 | **a VC cut a founder can edit** — remove a slide, export what's left | nothing in BOSS holds a *selection* over records; the deck profile is render-side | **render:** the cut and its removals live in the render (browser or `docs/playbook/cut.json`), never in the records — a hidden slide is not a deleted fact |
| 27 | **Health from `/measure`'s events** — acquisition · activation · retention with the day each starts to mean something | `/measure` picks one activation metric and one retention curve; nothing writes *acquired from a channel vs by hand*; nothing dates *when the signal begins* | **task:** `/measure` records the channel per first user (`hand` / `<channel>`) and the install date; the render derives *days-to-aha* and *second-Sunday* from them |
| 8 | **the ask** as a hole with a reason | `mentor-capital` defaults to *not yet*; nothing records *why not yet* in a place a render can quote | **task:** the not-yet needs a sentence on disk, or the hole has no reason to show |

### Sorted — 2026-09-13, after FEAT-028

The 27 rows, three ways (CLAUDE.md rule 3b). A row appears once.

**Done or answered** — 5 (one date convention, `readLearnings` joins devlog + capture logs) · 6 and 7
(Ajesh: phrase match, whole cell) · 14 (one shell, several spaces — `src/page-shell.js`) · 24 (Health
rendered, dormant until a file) · 25 (a chapter's line is its newest record's — built) · 2 in part
(the Design space renders tokens and brand; the playbook's Brand chapter links across, like personas).

**Tasks** (a list, each with its home):
- 8 — `mentor-capital`'s *not yet* needs a sentence in `docs/dossier/mentor-capital.md`; the ask
  hole already quotes it when present → the agent's own output step.
- 13 — `/import` dates and heads its `docs/source/<slug>.md` snapshot → the intake FEAT (IDEA-111).
- 15 — a series extracted from an imported source, with date and origin → after 13; no chart before
  a record holds a table.
- 23 — `/log` at ship captures one screenshot into `docs/product/` → when `/ship` next moves.
- 27 — `/measure` records channel per first user and the install date → when a project has users.
- 21 — Risks & harms gains a *stance* half written by `/trust` → with the next `/trust` edit.
- 1 — a matrix over *decided* features from the rivals' `## How they do it` → when a project has
  three FEATs and two rivals with those sections; not before.

**New scope** (each wants its own id when picked up):
- 11 — a person record: `docs/team/<slug>.md` (bio, the specific thing seen/built/sold/lived, photo
  path), for founder · cofounder · team · advisors; `/persona` gains `photo:`. `boss team` holds
  handles only. → the Team chapter (Company group).
- 16 — values as a page: `docs/BRAND.md § How we build` — a headline, a paragraph, a cost per
  principle; the cell stays the headline. → the Values chapter.
- 9 — the persona record against the craft → `/vet` the three inboxed pages, then `/persona`.
- 4 — *the product today* as a record → hold; `## Current shape` + FEATs + *What it is NOT* serve.
- 17 — an ask record, gated on the capital mentor flipping → hold at n=0.
- 26 — the cut lives in the render, never the records → FEAT-029 (last, by Ajesh's order).

**Questions for Ajesh — answered 2026-09-13, built the same day:** 12 → yes, as *in a few years*
(`in_a_few_years:` on the IDEA doc; `/boss` 3.5, `/canvas`, Vision chapter) · 18 → yes
(`prior_capital:`; `/canvas` on the earning branch; beside the ask) · 22 → a sharpen on Cost
Structure, not a field · 20 → a sharpen on Risks & Harms · 21 → the stance line on Risks & Harms,
`/trust` reads it · 19 → price and cost to serve only; the rest refused as projections · 3 → the
`who` line (RVW-103). Still open: 10 (which chapters earn a visual the records don't hold) — the
answer so far is the photo (Team, personas) and the logo (Brand); nothing drawn.

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
7. **Where does the file live, and what is it called?** (Ajesh, 2026-09-13: *"the html should be
   filed by the name of the app.html and in the project folder to easily bookmark?"*) Today
   `.boss/playbook.html`, the `board.html` precedent — hidden in Finder, one gitignore rule. A
   browser bookmark takes the page's `<title>` (*Tidewell — Playbook*) and the path already carries
   the project folder, so the bookmark is named right as it is; the friction is finding the file
   from Finder, not from the browser. Options: (a) keep the path, and have `--open` print the
   `file://` URL to bookmark; (b) `.boss/<name>-playbook.html` — visible name, still hidden folder;
   (c) `<name>.html` at the project root — findable, but a generated file in the founder's repo needs
   a gitignore rule in every template and in `boss adopt`, and `boss sync` to carry it to existing
   projects. Recommend (a) now, (c) only if a founder is seen looking for the file. Ajesh's call.
   **Decided (Ajesh, 2026-09-13): (a)** — keep `.boss/playbook.html`; `boss playbook` prints the URL.

## Gate

`captured`. The mandate stands — compose and subtract; n=3 signals, all stated-pain, nobody observed.
The prototype is a **mock to react to**, not a build; it costs one file and decides nothing. The
*build* trigger, carried in from 065 and 104 together: **a founder (or Ajesh on a real project) goes
looking for their own material and cannot find it without grepping, or asks for something to show a
room** — the symptom this surface treats. Until then it is a good idea with a prototype attached.

## Prototype v6 — republished 2026-09-13 (same link)

**Health** drawn as three market signals — acquisition (1 agency, hand-delivered; 0 from a channel),
activation (hole: the aha never counted), retention (hole: two Sundays passed, nobody wrote down
where the second sick call went) — each naming the day it starts to mean something. **VC cut** —
the investor profile renamed; *Remove slide* / *Restore* per cut, remembered in the browser;
*Export this cut as PDF*. 18 chapters, 16 drawn.

## Prototype v5 — republished 2026-09-13 (same link)

The mentors' concrete fixes: the matrix no longer cites a DEC that doesn't exist; *2 owners* not
*2 founders*; chips cut to two or three words; no `_(not yet)_` or `motivation:` on the page; rival
slides carry the rival's name; persona bars are an ordinal rank (1st–4th), not a percentage; the
ask block carries the real not-yet sentence. **Deck profiles** in the deck chrome — *Investor · 12*
(problem → why now → Dee → product → count → the incumbent → who pays → the ladder → Maya → the
ask → close), *Internal · 20* (+ values, built/not, Priya, matrix, timeline, the cofounder hole),
*Everything*. The ledger moved to the deck's bottom bar; each slide's foot carries its source only.
A closing slide (the tagline + the ledger). **Health** drawn as a hole page — 18 chapters, 15 drawn.

## Prototype v4 — republished 2026-09-13 (same link)

Three single-hue bar charts over counted numbers (agencies by size band · signals by rung, two
rungs at zero · canvas cells by state), each with a table under it; **Evidence** drawn (14 of 17)
with the ladder chart and three `EVID` cards, the third saying why it isn't graded higher yet;
**How we build** — four value cards with headline, meaning, cost, origin — replaces the
three-line Principles block on the cover.

## Prototype v3 — republished 2026-09-13 (same link, built on the peer session's version)

Chapters renamed to the audience's words and regrouped **Pitch / Proof / Company** (17; 13 drawn).
New: **Product** and **Problem** split from the old chapter 4, **Why now** as its own block,
**Market** (count · ceiling-by-arithmetic · imported-research hole), **Competition** on its own,
**Business model** with the ask as a reasoned hole, **Customers** with two full persona cards + a
hole (Priya, the caregiver: `synthetic 100%`, her quote labelled *not a quote — the founder's
expectation*), **Team** (founder bio with photo slot; cofounder and advisors as holes), **In five
years** as a hole on the cover, the Design sibling linked from the rail. Merged over the family nav
another session added.

## Prototype v2 — republished 2026-09-13 (same link)

**The hopping was a class-name collision, not focus:** the per-block *Slide* button and the
full-screen overlay both used `.slide`, so hovering any block turned its button into a
`position: fixed; inset: 0` box over the page, the pointer "left" the block, it vanished, and it
flickered back. Overlay renamed `.deck`. Slide now opens only on an explicit click.

**Present rebuilt as a deck** (39 slides from 8 chapters): cover (promise + conscience line) →
full-bleed accent chapter slides carrying each chapter's line → block slides composed per type →
a hole chapter is a dashed slide. Progress bar, click-zones for touch, ← → Space PgUp/PgDn Esc.
**Export PDF** in the top bar and in the deck (prints the deck, one 16:9 slide per page — needs
verifying inside the artifact sandbox; on `file://` it is plain `⌘P`).

**Persona redrawn as the classic card** (Ajesh's example image): photo column (a placeholder —
*no photo of a real person will be invented*), name, About with `unknown` where the record has no
answer (income), Core needs / Motivation / Pain points, four bars labelled *ranked from 2
conversations · n=2, not a survey*, one quote attributed to its EVID, two stat tiles, a Sunday at
8:40pm, and the *don't know* box. The record's six fields map onto the card; the card shows which
of the classic fields the record doesn't hold — that is the point of drawing it.

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
- 2026-09-13 — **ruling via the Design lane** (bossbuild-a1): full persona cards move to the Design
  space; the playbook keeps a snippet + a link. Chapter 3 rewritten; lands in FEAT-027.
- 2026-09-13 — **promoted** → FEAT-026 (slice 1: the canvas as boxes; slices 2–4 named). Program `business-profile` with FEAT-025.
- 2026-09-13 — the pull (IDEA-111) landed on `boss playbook`: the open questions printed, `--questions`
  lists them, the rail says `N open · start: /canvas`. Three of Ajesh's pushes the same day: the
  empty-page nudge (done — rail line + each hole's verb), the founder's own files folder (→ IDEA-111
  *The folder*), the file name / location (→ open question 7 above).
- 2026-09-13 — **v5 rulings** (Ajesh): A — *yes all*; after the first user it's acquisition,
  retention, showing how it's going, and *when do market signals start* · B — yes · C — Priya stays,
  a proto-persona for the entrepreneur, not for VCs · E — the playbook is for the founder and team
  to stay grounded; a **VC-deck cut** export, slides deletable. §13 written; v6 built. Rows 26–27.
- 2026-09-13 — **v4: mentor reviews + the 2026 read** (Ajesh: *"anything else missing? lets have vc
  mentor review … how to get funding in 2026"*). `mentor-fundraising` and `mentor-pitch` reviews in
  §12; research graded (two primaries, three bot-blocked, vendor claims filed unverified). v5 applies
  the cheap fixes and deck profiles. Kicked-up rows 17–25.
- 2026-09-13 — **prototype v3 reactions** (Ajesh): charts for market research and anything counted ·
  the principles read as *"just 3 lines"* — wants a page: one headline, then the text. v4: three
  charts (one hue, validator-driven — no pies, no categorical palette), Evidence drawn, How we
  build. Kicked-up rows 15–16.
- 2026-09-13 — **prototype v2 reactions** (Ajesh): *"way better!!!!"* · chapter names should be the
  audience's (*"competition should be competition"*) · multiple personas · *"we are merging in
  multiple sections like design, board … a full playbook"* · intake for market research and sizing ·
  research what a VC deck has that we don't (done: Sequoia at source; YC and Kawasaki unreadable) ·
  a photo and bio per persona, founder and team · *"keep capturing"*. v3 built on the peer session's
  version (family nav). Kicked-up rows 11–14.
- 2026-09-13 — **prototype v1 reactions** (Ajesh): *"I think of personas visually"* + an example
  card (photo · About · Core needs · Motivation · bars · quote · stat · Pain points) + three pages on
  persona practice — *"lets also assess the content separately.. i think our existing personas is
  weak"* → inboxed for `/vet` · still hopping → the `.slide` collision found and fixed · *"maybe
  slide is only when clicked explicitly"* → yes, now · *"add an export into pdf"* → done · *"the
  presentation is pretty meh visually … the website part looks way richer"* → deck rebuilt with
  per-type slides · *"some of the content is still pretty mid"* → kicked-up row 10 · *"keep
  developing how we story tell"* → §8 written: the chapter line is the first sentence of the record.
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
- 2026-09-13 — **the design half spun out as [[IDEA-107]]** (Ajesh: *"should we build also the design
  playbook… rivaling apple HIG… whats missing… figma support"*). Chapter 11 (*Brand*) is the seed of
  a full *Design* chapter in the same renderer; *Kicked up* row 2 (the one place a colour is a fact)
  is answered there — a guaranteed DTCG `tokens.json`. Decided the same day: **one renderer, three
  spaces** (playbook · design · board), each its own file and URL, joined by a family bar in the top
  bar; prototype v1.1 carries it and chapter 11 links across. Nothing else here changes.
- 2026-09-23 — **found on the rendered demo (VC cut):** the tier title *Also on the field* stays on the
  page while its only block (`competition-watch`) is left out of the cut, so a heading sits over nothing
  (`src/playbook.js:728`). A task, not new scope. Same read, as open questions for Ajesh ("push it
  further"): a cover page · headlines from a field chosen for the job, not the first sentence · a
  provenance line for the room and a separate one for the founder · pictures from counts already on the
  page (evidence-by-cell, health 9→6→1) · *since you last shared it*.
