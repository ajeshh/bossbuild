---
component: StatusChip
status: stable
source: src/components/StatusChip.tsx
updated: 2026-09-05
---

# StatusChip

**Why it exists:** new — the signature: a visit's state as a shape before a colour, so it reads on paper, in one colour, and to anyone who cannot see amber.

## When it applies
- on every `VisitRow`; on the carer's `AskCard` once answered

## When it doesn't
- navigation — never as a badge, never a count
- anything that is not a visit's state

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| uncovered | a hollow ring, `signal.uncovered` | red |
| asked | a half-filled ring, `signal.asked` | a spinner |
| covered | a filled disc, `signal.covered` — the settled green, never the copper | a tick — the disc is the tick |

## Content
- the word beside the shape on the laptop; the shape alone on the phone row, with its accessible name

## Layout
- 16px on a row, 20px on the ask card; never scaled

## Accessibility
- shape carries meaning; colour is the second channel; the name is the third
- *not checked:* the half-filled ring at 16px for low vision — a review with a person

## Research
- EVID-001 — owners described "ringing round" as a state they hold in their head; the chip is that state, outside the head
