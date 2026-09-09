---
id: DEC-004
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-20
reversibility: reversible
revisit_by: 2026-11-20
---

# DEC-004 — The canvas is an answer store with frames; humane is the floor, not the default

> BOSS's fourth dogfooded `/decide`, and the first to settle a choice that was never made in the
> first place. Occasioned by IDEA-063.
> Related: [DEC-003](DEC-003-position-not-verdict.md) (position, not verdict).

## Context

`/canvas` has run **the Humane Product Canvas as *the* spine** since v0.4.0 (2026-05-21). That
framing entered in a changelog sentence — *"Ajesh Shah's Humane Product Canvas … **as the spine**,
with Lean + Lenny-style prompts folded into each cell"* — and was inherited unexamined through
roughly 180 releases. **No `DEC` was ever written for it.**

Confirmed with the founder, 2026-08-20: *"the humane product canvas was just one type, it was not
supposed to be the only default"* and *"the humane part became default as we built more boss, but i
dont think it was intended so."* So this is drift by inheritance, not a decision being reversed.

The cost of the drift is measurable. Cell-by-cell against Lean Canvas and the BMC, the single spine
has no home for **Cost Structure, Key Resources, Key Activities, or Key Partnerships**, and covers
Channels, Early Adopters and Customer Relationships only partially. Cost Structure is the sharpest:
it is the only cell present in *both* conventional canvases and absent here, and revenue without
cost is a price, not a model.

That absence propagates. A separate audit of what a seed data room asks for found four facts BOSS
holds **no record of at all** — market sizing, competitive landscape, CAC/LTV, use of funds. Those
are not an independent gap; they are downstream of the cells the spine never asked for.

The tempting fix was a **framework chooser** — offer Lean, BMC and Humane, let the founder pick. It
demos well. It also asks a `first-product` founder to choose a business framework before they can
answer a single question about their idea, which is ceremony wearing the clothes of choice.

The opposite temptation was to **widen the one canvas** to the union of all three. That collides
head-on with the skill's own rule — *"Don't interrogate"*, ask 2–4 cells at a time — and turns a
pressure-test into an intake form.

## Decision

**The canvas is an answer store. Frames are views over it. The humane cells are required in every
frame.**

- **One record, several frames.** A canvas is a set of answers, not a layout. BOSS holds the union
  of cells and projects it: **Humane** (default while building), **Lean** (Maurya's nine),
  **BMC** (Osterwalder's nine), and **`boss case`** (the investor render). Same architecture as
  `boss board` — pure projection, frontmatter is truth, build the view and refuse the app.
- **The founder never picks a framework.** They answer questions. The frame is a view they can
  switch, and switching never loses an answer.
- **Frames gate which cells are *live*, not just how they display.** Cost Structure goes live when
  there's a price. Key Partnerships when the domain needs one. The JIT rule survives the wider
  union because frames do the gating.
- **Humane is the floor.** **Risks & Harms and Principles are required in every frame**, including
  Lean and BMC. Frames change layout and vocabulary; they never change the required set. A
  conventional frame is a different *view* of a humane canvas — never a way out of one.
- **The conventional cells are additions, not replacements.** Nothing currently in the Humane
  canvas is removed to make room.

## Why

- **It's what was actually intended.** The founder's own framing was "one type… an option." The
  single spine was never argued for; it was typed once and inherited. Restoring the intent needs a
  record this time, so the next person has to argue with it deliberately.
- **A chooser taxes the founder BOSS most needs to serve.** `first-product` and `non-tech-founder`
  cohorts cannot pick between Maurya and Osterwalder, and asking them to is the ceremony BOSS's
  whole mode ladder exists to defer. Answers-then-views inverts that correctly.
- **The differentiator is the required set, not the layout.** Risks & Harms and Principles are the
  two cells no conventional canvas has. If they survive only in one frame, BOSS's humane claim
  becomes a preference the founder can decline — which is the same argument already settled against
  an opt-in ethics mentor (`registry/boundary.json`, `mentor-humane`: *"an ethics mentor a founder
  can decline to open is weaker than a conscience they can't"*). Frames must not reopen that.
- **It unblocks the data room without a new artifact.** Most of the four missing investor facts are
  canvas cells that were never asked for. Adding the cells is cheaper and more honest than building
  a business-case generator on top of a record that can't support one. Compose and subtract
  (EVID-001) holds.
- **Covering conventional ground is a bigger claim, not a smaller one.** A canvas where "who could
  this hurt" sits next to Cost Structure is a position. A canvas that only asks the humane half is
  a niche, and one that only asks the conventional half is a commodity.

## Falsifier

*What would prove this wrong, and by when?*

**Two independent ways this fails, either of which reopens it:**

1. **Frames were ceremony.** If, across **n ≥ 3 real projects**, every canvas stays in the Humane
   frame and no founder ever switches to Lean or BMC or asks for a conventional cell, then the
   single spine was accidentally right and the frames are cost with no return. Cut them.
2. **The floor didn't hold.** If a founder in a conventional frame **treats Risks & Harms as an
   obstacle to route around** — leaves it `_(not yet)_` while completing every other cell, twice or
   more — then "required in every frame" is being satisfied on paper and not in practice, and the
   mechanism needs to be something other than a required field.

**Check at `revisit_by` 2026-11-20, or on the second occurrence of either, whichever comes first.**

## Consequences

- **`/canvas` gains a frame concept** — the answer store, the required-set floor, live-cell gating.
  The Humane frame stays the default; nothing existing is removed.
- **Four cells get added to the union** — Cost Structure, Key Resources, Key Activities, Key
  Partnerships — plus sharpened Channels, Early Adopters and Customer Relationships.
- **`boss case` becomes buildable** (IDEA-063 step 3) because the store finally holds what a data
  room asks for. It renders holes rather than filling them.
- **The credit line changes shape.** `/canvas` currently ends with *"Credit the framework: Humane
  Product Canvas by Ajesh Shah."* With three frames, each needs its own attribution — Maurya for
  Lean, Osterwalder for the BMC — and the humane frame keeps its own. Attribution per frame, not
  one blanket line.
- **Existing canvases must keep working.** Every scaffolded project holds a `IDEA-NNN-canvas.md` in
  today's shape. The frame model has to read those unchanged and treat the new cells as
  `_(not yet)_` — a migration, not a break.
- **The honest cost:** `/canvas` gets more complex to author and to explain, and "we support three
  canvases" is exactly the kind of feature-list sentence BOSS's own positioning avoids. Accepted —
  the complexity lives in BOSS, and what the founder sees is still one set of questions.
