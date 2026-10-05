---
id: IDEA-140
type: idea
kind: capability
owner: product-lead
program: business-profile
status: captured
proof: none
gist: The playbook deck exports a whole cut (VC · Story · Internal · All) as one PDF. Two shapes are missing — export ONE slide (a block's own Slide → its own page), and pick what to export without starting from BOSS's cut. Half of the second already exists: removals in a cut already drop out of Export PDF.
created: 2026-10-05
relates: FEAT-026, FEAT-029, IDEA-106
---

# Export one slide, or a hand-picked set

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What exists (read from `src/playbook.js`, 2026-10-05):** four cuts in the Present bar — VC cut,
  Story, Internal, All. *Export PDF* prints the **current cut minus its removals**
  (`exportPdf()` walks `list()`, the same list the deck steps through; removals are per-cut in
  `localStorage`). So "everything as one doc" = All → Export PDF, and "customise" today =
  pick the nearest cut → remove what doesn't fit → export.
- **Gap 1 — one slide.** Every block has *Copy* and *Slide*; nothing exports a single slide. The
  job: drop one slide into an email, a Notion page, someone else's deck. Cheapest shape: an
  *Export this slide* in the deck chrome (print a one-`.sl` printdeck), maybe *Copy as image*
  later.
- **Gap 2 — pick, not prune.** Removal is subtractive from BOSS's draft. To send six slides out of
  forty, the founder removes thirty-four. Candidate shapes, smallest first:
  1. a **Custom** cut that starts empty and fills from each block's *Slide*/a checkbox ("add to
     custom") — same `localStorage` mechanism, one more key;
  2. *only these* — select in the deck, export the selection;
  3. named saved cuts (*"Thursday investor"*) — probably over-built until a founder keeps two.
- **Rules carried from FEAT-029:** a selection lives in the browser, never in a record; BOSS composes
  no slide; page order stays the order (no reordering — still out of scope unless asked).

## Open questions
- Is gap 2 real, or does remove-from-All already serve it? FEAT-029's falsifier was "nobody removes
  a slide" — no founder has used the deck yet, so neither answer is evidenced.
- One slide as PDF, PNG, or both? PNG needs a rasteriser the zero-dep page doesn't have
  (print-to-PDF is free; an image is not).

## Capture log
- 2026-10-05 — Ajesh: someone can export all the slides as one doc, and there are cuts like VC;
  wondering about one-slide export, or customising what to export. Captured; checked the code first —
  customise-by-removal already reaches the PDF.
