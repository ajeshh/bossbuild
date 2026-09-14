---
id: DEC-021
type: decision
owner: "@ajeshh"
decided_by: human
status: decided
created: 2026-09-14
confirmed: 2026-09-14 — Ajesh, on the mark board (IDEA-115): "looks good K1 is great!! lets go with that. especially on the sky blue it looks great!"
reversibility: reversible — one SVG file, one reader module, the favicon and og.png; the ✦ path is in git
revisit_by: 2026-10-14
falsifier: a founder (returning-founder or domain-expert cohort, a real one) reads the mark as a 3D icon from a template library and says so, or reads it as anything other than a B, by 2026-10-14 → back to the board, with the ribbon β as the first alternative
supersedes: the ✦ mark and its lineage claim (VISUAL.md, 2026-08-19 / re-cut 2026-08-24)
---
# DEC-021 — the mark is the built B, in two colours, read from Ajesh's SVG

> Ajesh, 2026-09-13/14: *"the star seems hella outdated"* → a benchmark, a level, a square, a full
> stop → *"a more interesting inspiring way for greek letter beta"* → a ribbon β reference (*"the
> color is just an example"*) → a second reference, a B built from parts → `boss-logo-mark.svg`
> (*"here is the svg file to make it accurately"*) → *"K1 is great!! lets go with that"* → *"when
> it shrinks, it kinda looses and becomes blobby. fix for it when it shrinks so its scales."*

## Context

The mark was `✦`, kept because the CLI already printed it on every success line — a real lineage,
and the strongest argument the old mark had. Its problem turned out to be meaning, not age: a
four-point star is the glyph of every AI product in 2026, and BOSS's whole claim is that *you*
built the thing. Two boards ran on one evening: fourteen colours (DEC-020), then marks — eight
straight cuts, six cuts of β, a ribbon β from a reference, and Ajesh's own reference and SVG.

## Decision

The mark is **the built B** as Ajesh drew it: a cap and two facets in one colour, two curved
ribbons in the other, the seams between the parts left as ground. Two colours, everywhere it is
a mark. Mechanism:

- `web/boss-logo-mark.svg` is the source; `scripts/mark.js` is its one reader (five paths,
  classified face/ribbon by the file's own colours). Nothing retypes the geometry.
- Two cuts: the file verbatim above ~24px; below it a **small cut** that insets each part 14% toward
  its own centre, so the seams widen as the mark shrinks instead of closing (the "blobby" fix).
- Two fills per ground: cornflower + persimmon on ice (`--color-mark-face` / `--color-mark-bowl`);
  the authored sky `#55BDF5` + persimmon `#FF7148` on deep (`--mark-sky` / `--mark-persimmon`,
  mark-only). The favicon takes the ice pair (reads on light and dark tab bars).
- `npm run gen:og` renders the share card with the authored mark on deep.

## Why

- **It is the name without a caption.** A solid, made of parts, standing up — *Build Out Solid
  Stuff* as an object. Nothing else across two boards did that; the ribbon β was the nicer drawing
  and the weaker claim.
- **It is a picture of the palette's rule.** Faces in the structure colour, the loud colour on the
  ribbons: cornflower structures, persimmon points, in one object.
- **The founder drew it.** The brand's mark is his hand; the SVG is his file. The reader exists so
  it stays his file.

## Rejected alternatives

On the board with numbers (IDEA-115): the benchmark (best non-letter), the level, the try square
and drafting north (lose at 16), the full stop (a system, not a mark), the plumb bob and a
B-monogram; block, stencil, drafting, stamp, β-on-benchmark and β. cuts of beta; the ribbon β flat,
with the interlock, and in the brand's colours; the built B one-colour (K2) and with a foot as β
(K3) — K1 chosen over both because the two colours are the point.

## Falsifier — what would prove this wrong, and by when?

By 2026-10-14: a real reader reads it as a template 3D icon, or as not-a-B, and says so. Either
reopens the board with the ribbon β first.

## Consequences

- **The CLI's `✦` and the site's mark are now two things.** The terminal keeps printing `✦` on its
  success line until a glyph is chosen for it — a task on IDEA-115 (one `MARK` constant in
  `src/ui.js`, then a twenty-file sweep), not decided here. VISUAL.md says so instead of claiming
  lineage it no longer has.
- The straight-cut rule has its one written exception: the mark's ribbons are bent.
- The mark is used for the lockup, the favicon and the share card, and nothing else.

## Related

IDEA-115 (both boards) · DEC-020 (the palette the mark wears) · DEC-002 (the name).
