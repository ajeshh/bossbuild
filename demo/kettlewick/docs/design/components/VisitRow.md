---
component: VisitRow
status: stable
source: src/components/VisitRow.tsx
updated: 2026-09-05
---

# VisitRow

**Why it exists:** new — the unit of the product: one visit, its state as a shape, who has the ask, and the one act, on one line. No other component holds a visit.

## When it applies
- every visit in the day view, on the laptop and the phone
- the printed Monday (one colour, the same three shapes)

## When it doesn't
- the carer's side — a carer sees an `AskCard`, never a row of someone else's day
- a summary count — that is text, not a row

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | one shape, three states via the chip | a "compact" row — density is one |

## Content
- time first, in mono; then the client's first name only; then the chip; then who has the ask; then the act
- the note, if there is one, is a second line and never a link

## Layout
- laptop: one line; phone: the who stacks under the when (reflow), the act keeps its 44px
- `space.2` between rows; `border.subtle` under each; no card

## Accessibility
- the row is a list item; the chip's shape has a name; the act is the only control
- *not checked:* reading order on the phone after reflow

## Research
- EVID-003 — watched an owner read the day row by row with a thumb; she never opened anything
