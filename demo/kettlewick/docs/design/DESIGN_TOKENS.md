---
id: design-tokens
type: design
owner: designer
status: active
updated: 2026-09-09
source: docs/design/tokens.json
---

# Design tokens — Kettlewick

> The human-readable spec over `docs/design/tokens.json` (W3C DTCG), which is the one file a value is
> a fact in. This file holds the **names and the reasons**; the values live in the JSON, and
> `src/styles/tokens.css` / `tokens.ts` are generated from it (`npm run tokens`). Never edit either
> code file by hand, and never copy a hex into this one.

Written 2026-09-09. The token system has existed since the first UI commit (DEC-004, 2026-09-02);
re-running `/design-tokens-init` found the JSON and the derived CSS in place and one gap: nobody had
written down what each name is *for*. This is that file.

## Primitives — the raw values, named by value

| Name | For |
|---|---|
| `color.gray.100` · `300` · `500` · `900` | the warm greys every semantic surface, border and text colour points at |
| `space.1` · `2` · `3` · `4` · `6` · `8` | a 4px base; the steps the day list actually uses (12 is the row gutter, DEC-004) |
| `type.size.label` · `small` · `body` · `heading` · `display` | five sizes, no more; times use `font.mono`, not a size of their own |

## Semantic — the names UI code reaches for

### Colour
| Name | For |
|---|---|
| `color.surface.ground` | the page — oat, the kitchen table; never pure white, so paper reads as raised |
| `color.surface.paper` | a bounded thing on the ground: a row, a card, a dialog |
| `color.surface.raised` | paper that floats — only with `shadow.raised` |
| `color.text.body` | reading text — brown-black, not black (DEC-004) |
| `color.text.muted` | secondary text, still AA on ground and paper |
| `color.text.on-primary` · `color.text.on-danger` | text on the act, text on the destructive confirm |
| `color.action.primary` | **the one act a screen exists for** — the kettle copper, the owned accent (DEC-004) |
| `color.action.primary-hover` | the act, under a pointer |
| `color.action.danger` | the confirm on a destructive dialog, nowhere else |
| `color.signal.uncovered` | a visit nobody has — amber, never red (principle 1) |
| `color.signal.asked` | three carers have the ask; waiting is quiet |
| `color.signal.covered` | done — a settled green, not the accent: the accent is for the act still to take |
| `color.border.default` · `color.border.subtle` | the rule under a row; the edge of a field |

### Type
| Name | For |
|---|---|
| `font.display` | the promise — headings and the wordmark (Newsreader) |
| `font.body` | the work (Public Sans) |
| `font.mono` | times and counts, so 09:00 and 10:30 line up down the day |

### Shape, depth, layout
| Name | For |
|---|---|
| `radius.control` | anything you tap: buttons, chips, fields |
| `radius.surface` | anything that holds content: rows, cards, the sheet, dialogs |
| `shadow.raised` | **the signature's other half: the only shadow.** Things that float take it; things that sit take a border (PAT-5) |
| `target.min` | a thumb between visits — every tap target on the phone |
| `breakpoint.phone` · `breakpoint.laptop` | the carer between visits; the owner at the kitchen table on Monday |
| `z-index.sticky` · `overlay` · `toast` | the three layers the app has, named so two overlays never fight by number |

## The signature
The status chip: **a shape before a colour** — a hollow ring (*uncovered*), a half-filled ring
(*asked*), a filled disc (*covered*). The colour is the second channel, so the printed Monday and a
colour-blind owner read the same day (PAT-1).

## Component layer
None. Nothing at this size has a constraint the semantic layer can't name. The first candidate
would be the chip's three shapes, if a second surface (the carer's side) needs them at another size.

## Deprecated

| Old | Use instead | Why |
|---|---|---|
| `color.text.placeholder` | `color.text.muted` | failed AA on paper (2026-08-30); a placeholder is an example, never the label |
