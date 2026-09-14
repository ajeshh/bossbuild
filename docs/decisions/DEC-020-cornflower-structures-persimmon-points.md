---
id: DEC-020
type: decision
owner: "@ajeshh"
decided_by: human
status: decided
created: 2026-09-13
confirmed: 2026-09-13 — Ajesh, on the board (IDEA-115): "ok lets go with O"
reversibility: reversible — one token file plus five literal copies (help.css, og-card, the demo ribbon, board.js, BRAND.md accent) and VISUAL.md; the previous palette is in git and in DEC-018
revisit_by: 2026-10-13
falsifier: a returning-founder or domain-expert read that calls the site "playful" or "clinical" rather than calm, OR a rendered-page tap that finds cornflower used to point (two loud things), by 2026-10-13 → the rule has failed, not the hue; fix the use before reconsidering the colour
supersedes: DEC-018 (partly — the ground; its two findings are kept, see Consequences)
---
# DEC-020 — the brand is five colours with one job each: cornflower structures, persimmon points

> Ajesh, 2026-09-13, over one afternoon: *"go back to the drawing board and think of potential new
> color options for boss brand"* → *"i disagree on being adjacent to claude. i dont think people
> care… not boring mandatory blue. in general i think we can break the mold"* → a pair (ice
> `#D7EFFF`, persimmon `#FF5C34`) → a cornflower swatch → *"so its 3-4 colors, and offwhite"* →
> *"ok lets go with O."*

## Context

The site's palette was concrete, graphite and one hi-vis orange — "site & signage", chosen
2026-08-19 and corrected a day before this decision (DEC-018: the ground had been warm cream at
13% saturation while the comment said it wasn't). With the demo and the product's own page shell
landed, Ajesh wanted the brand re-opened. A board (IDEA-115, published as an artifact) put fourteen
candidates through five jobs — the mark at 16px, a fill under text, a text-weight twin per ground,
never a state, survive the tab row — with the WCAG arithmetic done rather than eyeballed. Round
one was the safe field; round two the mold-breakers; then Ajesh's own set, sharpened.

## Decision

Five tokens, one job each (`web/styles/tokens.css`, the mechanism):

| token | hex | job |
|---|---|---|
| paper | `#F6F6F3` | the ground — 1% saturated, 60°: a sheet, not cream, not a tint |
| ice | `#D7EFFF` | a **surface** — the install box, a note, a table head; the page is never ice |
| cornflower | `#5089E0` (text `#2A5BAD` / `#7FB0F5`) | **structure** — links, the current-page underline, a chip, a step number, the train line's travelled segment |
| persimmon | `#FF5C34` (text `#A82E14` / `#FF8A6A`) | **the one loud thing** — the mark, the CTA, the band, the hazard rule, the current station |
| ink / deep | `#14202B` / `#0E1C28` | text on paper; the dark ground, where the ink becomes ice |

The sentence that keeps them five instead of two loud ones: **cornflower structures, persimmon
points.** `site.css` keeps it by token name — `--color-structure` and `--color-brand` are
different handles, and the split was assigned use by use (fourteen sites moved to structure, the
mark/CTA/band/hazard/station stayed brand).

The stop state moved from red (`#B71616`, 0°) to crimson (`#B0123A`, 345°): persimmon sits at 12°,
and a brand twelve degrees from the error colour is a brand that reads as an error.

## Why

- **One temperature, one warm signal.** The three blues are one family (204°–216°) at three
  lightnesses; persimmon is the only warm thing on the page. That is the calm-until-it-points
  behaviour the previous world wanted, with more range to do it in.
- **Ice as a surface, not a ground, is what made the set work.** The pair (N on the board) tinted
  every surface; Ajesh's "3–4 colours and off-white" put the blue on the objects and left the page
  paper. Every pair was checked before it was written — the only two that need a twin are raw
  cornflower as body text (3.2 → `#2A5BAD`) and the mark on paper (2.8, exempt: it is the
  logotype, WCAG 1.4.11).
- **Persimmon is the old hi-vis with the blue channel opened.** The mark, the button and the
  terminal line that already worked kept working (ink on it 5.4); nothing had to be re-drawn.
- **It was chosen, not defaulted.** The board held the AI-cluster options (cream + terracotta,
  near-black + acid, purple) out on purpose and said so; what was picked has no cluster to belong to.

## Rejected alternatives

The board (IDEA-115) carries all fourteen with numbers. In one line each: mandatory blue (the ISO
instruction colour — *"boring"*); survey/rani pink (the set-out colour and the vocative's — the
strongest single hue, lost on tone); copper (Kettlewick wears it — the demo would look like BOSS);
the shell's stone + teal (a founder's placeholder, not the brand); cyanotype (BlueprintOS with the
name filed off); no accent (a tab you cannot find); marigold-on-indigo, cadmium, chalkboard (all
dark-first — a different-sized decision, named and not taken); a rani + lime flag pair (one loud
colour per surface — a rule BOSS did not need once cornflower took structure); Klein blue (noted).

## Falsifier — what would prove this wrong, and by when?

By 2026-10-13: a real reader (returning-founder or domain-expert cohort, not a persona) calls the
site *playful* or *clinical* rather than calm; or a rendered-page tap finds cornflower pointing —
a CTA, a band, a hero device in blue. The second failure is the rule's, not the hue's: fix the
use. Only the first reopens the colour.

## Consequences

- `web/styles/tokens.css` is the mechanism; `library/help/help.css`, `scripts/og-card.html`
  (og.png re-rendered), `scripts/gen-demo.js` (the ribbon), `src/board.js` and BRAND.md's
  `accent:` are copies and moved with it. `docs/design/VISUAL.md` carries the world and the table.
- DEC-018's two findings survive in the new values and are cited in tokens.css: the ground must
  not be warm cream, and the comment is not the mechanism — every number here was measured first.
- The product shell's default (`src/page-shell.js`: warm stone + teal) is **not** changed. It is a
  placeholder for a venture with no palette, and the board said why making it match would be wrong.
- The CLI is unchanged: `src/ui.js` binds to ANSI, so a founder's terminal theme resolves the mark.

## Related

IDEA-115 (the board and its rounds) · DEC-018 (the ground, partly superseded) · DEC-002 (the name)
· IDEA-107 / FEAT-039 (the design space and the demo, whose arrival re-opened the question).
