---
id: IDEA-106
type: idea
owner: product-lead
status: captured
gist: Everything a founder has uncovered about the venture — the why, the people, the canvas as boxes, the rivals, the evidence, the decisions — rendered as one beautifully designed, on-brand, single-file HTML space whose every block is built to be lifted into a deck. A view over records, never a document; holes and the evidence ledger survive the polish.
proof: none
proof_note: Captured with a design, not built. If it earns a build, the path is `src/playbook.js` (the fourth use of the `boss board --html` pattern) and the first slice is the canvas-as-boxes page alone.
created: 2026-09-13
source: Ajesh, 2026-09-13 — "so we have the canvas. does it generate a visual html that looks like a
  canvas ..if the user wants to see how the boxes filled out? Also with all the research, competitive,
  market analysis or anything else. I wonder if it helps to create a visual html playbook, that visually
  amazingly renders it. I can imagine them being able to easily copy paste stuff into a presentation for
  internal presentations, vcs, or other presentations. I would love for the business acumen stuff being
  presented. Its almost like an internal playbook of business related. that looks like a great website.
  Also eventually if they have a logo or branding colors, it can look like it.. ?" → "its a very
  beautifully designed space, it compromises also of personas, the why of the company, vision, values,
  anything we uncover .. and it builds this very visually striking html."
relates: IDEA-065, IDEA-104, FEAT-025, IDEA-063, DEC-004, IDEA-031, IDEA-097
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
that a founder is proud to open it, in their own brand once they have one, and built so that any
block on it lifts cleanly into a presentation. The canvas renders **as a canvas** — boxes, in the
frame's grid — not as a table. Nothing on the site is written by BOSS; every word is the founder's
record, and every hole is a hole.

## Where it sits — three ids already hold pieces of this

| Id | What it holds | What it does *not* say |
|---|---|---|
| [[IDEA-063]] / [[FEAT-025]] | one answer store, several frames; the four-rung ladder; Layer 3 (holes render, ledger, freshness, no grades) | how any of it *looks* |
| [[IDEA-065]] the living dashboard (parked) | a private, read-only HTML workbench over everything, so a founder can *find* their material; the line is *state, not page count* | design quality, brand, or getting a block *out* into a deck |
| [[IDEA-104]] `boss case` + the deck (deferred) | rungs 3–4: the data room and the deck, gated on a founder asking | a render a founder can look at before any of that is earned |

**New here, and why it is its own id:** (1) the canvas rendered *as a canvas*; (2) presentation-grade
design in the founder's brand; (3) the copy-out affordance — the unit of the site is a block sized
for a slide. None of the three above is about the render's *quality*; this one is about exactly that.
If it is built, most of 065's remaining scope is the nav across chapters, and 104's deck rung
becomes "slide mode" over the same blocks — see the open questions.

## How it should look — the design plan

### 1. One space, in reading order

A single generated site under `docs/playbook/` — gitignored, regenerated on demand, exactly like
`boss board --html`. `index.html` plus one page per chapter; inline CSS; no framework; logo inlined
as a data URI; opens from `file://`. Light and dark.

Chapters in the order a *stranger* needs them, not the order the files were made:

1. **Why** — the cover. The founder's why (`motivation:` and `success_looks_like:` from the IDEA doc,
   [[IDEA-097]]), the Promise (canvas *Promises*), the values (canvas *Principles*). Vision lives here.
2. **Who** — *People* plus its market sharpen (*how many are there, and how do you know* — the
   bottom-up count, never a "$50B"), and the personas from `docs/personas/` as cards, each carrying
   its `synthetic N% · real N%` ledger.
3. **The problem, and who else fixes it** — *Problem* plus `docs/competition/README.md` as the table,
   then one card per rival. **"Why they might win" is the headline of the card**, not the footnote.
4. **The canvas** — the boxes (§2).
5. **How it sustains itself** — *Business Model*, both branches; *Cost Structure* and the other
   dormant cells once live.
6. **What we know** — the evidence ledger. Every `EVID` on the three-rung ladder as a dated timeline.
   (This is the "traction timeline" FEAT-025 resolved as render-only — here it is rendered.)
7. **What we decided** — `DEC` cards: the decision, the falsifier, the revisit date.
8. **Risks & Harms** — a chapter, never a footer.
9. **What's next** — the `/roadmap` bets and the NO-list.

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
- The box shows the **current** answer. What to do with a cell that carries its own revision history
  (BOSS's own canvas does — `🟢 v0.5 — RE-AIMED…`) is an open question below.

### 3. Built to be lifted — the block

The unit of the site is a **block**: one idea, one card, proportioned for a slide (16:9, with a
4:3-safe area). A canvas box is a block; so is a rival, a persona, one `DEC`, the ledger.

Two affordances on every block, both zero-dep:

- **Copy** — rich HTML + plain text to the clipboard, so a table pastes as a table and a list as a
  list into Slides, Keynote, Docs, Notion.
- **Slide** — the block alone, full viewport, brand chrome, ready to screenshot. Screenshot is the
  one path into *every* deck tool; the copy path is the nicer one where it works. A **present** mode
  walks the blocks with arrow keys — rung 4's deck without BOSS composing a single slide.

**What travels with the copy:** the source line (`docs/competition/README.md · checked 2026-08-20`)
and, for a rival, its URL. The founder may delete it in their deck; BOSS never pre-deletes it.

A print stylesheet: one block per page, 16:9 page size → a PDF in one keystroke.

### 4. The brand

- Reads `docs/BRAND.md` — accent, type pairing, the voice line, a logo path — and `docs/design/tokens/`
  when `/design-tokens-init` has run. Logo inlined. No fonts fetched: system stacks, the named pairing
  when it is installed.
- **A field marked `unknown` falls back to the neutral default for that field only.** Never invent a
  colour. A nascent brand renders neutral and says so in the footer (*brand: nascent — `/landing`
  seeds it*). This follows the brand doc's own rule: a confident answer with no information is worse
  than a blank.
- **The neutral default has to be good enough that a founder with no brand is proud of it.** That is
  most founders at Quickstart; the default is the product for them, not a fallback.

### 5. What keeps it honest — the polish *is* the risk

[[IDEA-065]] named it: *"a private workbench showing everything and a curated artifact shown to someone
outside are two products, and merging them makes a thin record read as a strong one."* A beautiful
render of thin records is precisely the thing that makes a raise feel closer than the evidence
supports — the failure mode FEAT-025 Layer 3 exists to refuse. So:

- **The ledger is in the chrome.** Every page header, and every slide-block in small type: *N of M
  claims backed by graded evidence · newest signal DATE*. Coverage is a fact; readiness is a verdict.
  **No %, no grade, no traffic light, no "investor-readiness"** — position, never a grade.
- **Holes survive the render and survive the copy.**
- **Freshness on every block** — source path and date; a record past its `revisit_by` or `checked`
  date renders *stale on the block itself* (the `/design-library` source-hash precedent: drift
  renders on the component, not in a report nobody reopens).
- **At n=0 the cover is a conscience moment** — *"3 of 41 things on this site are backed by someone
  outside this room"* — the honest first page, in the founder's own brand.
- **No composed prose.** Ordering and layout are BOSS's; every word is the founder's. The render
  never writes a sentence the records don't hold.
- **Regenerated, never edited** — a view, not an app. The line is state, not page count.

### 6. Mechanism — a recommendation, not a decision

- **CLI, not skill:** `boss playbook [--open] [--frame humane|lean|bmc]` → `src/playbook.js`, zero-dep,
  the fourth use of the `boss board --html` pattern. The one-pager went to the *skill* at v0.272.0
  because it composes — chooses which evidence, in what order, in prose. This composes nothing, so it
  needs no judgment and wants no skill.
- **Parsers exist:** `frontmatter.js`, `records.js`, the canvas `| **Cell** | Answer |` table, the
  competition table, `EVID` grades, `DEC` fields, `docs/personas/<slug>.md`.
- **Shareable** — single-file, so `/pretotype`'s Artifact publish path already carries it the day a
  founder wants to send a link. Not in the first slice.
- **First slice, if it earns a build:** the canvas-as-boxes page alone, with chips and holes. Every
  other chapter is the same renderer over a different folder.

## Open questions — written as questions, not carried

1. Does [[IDEA-065]] fold into this (the workbench *is* this, with a nav), or does 065 stay as the
   private "everything" view and this is the curated one? 065's own warning says they are two products.
2. When a canvas cell carries its own revision history, does the box show the latest paragraph or the
   whole cell — and is the history a founder's canvas ever holds, or only BOSS's?
3. **What ties an `EVID` to a cell?** `assumption:` is a free phrase pointing at the riskiest
   assumption, not a cell id. The per-box chip needs either a `cell:` field or judgment — grep who
   reads `assumption:` before adding a field nobody reads.
4. Does a rich-HTML clipboard write paste as a native table into Keynote, Google Slides and PowerPoint?
   **Test this with one hand-made block before building the affordance** — it is the load-bearing claim.
5. Is *playbook* the word? To a founder a playbook is a how-to; this is a *portrait* of the venture.

## Trigger

`captured`, with a design. The mandate stands — compose and subtract; n=3 signals, all stated-pain,
nobody observed — and [[IDEA-104]]'s trigger is a founder, not BOSS, asking for a deck. The smallest
honest next step is not a build: **a mock** — one static page over BOSS's own records (its canvas, its
seven-file competition set, its 19 DECs, its ledger) so the design can be reacted to rather than
argued about. `/prototype`'s rule: react to something tangible, not a blank page.

## Capture log

- 2026-09-13 — seed, both messages (Ajesh). The design plan above written the same session, before any
  build, so it survives a compaction. Lineage read: 063 → FEAT-025 → 104, and 065 parked 2026-08-20
  with the same seed sentence (*"so that they can use that content to build the pitch deck"*).
