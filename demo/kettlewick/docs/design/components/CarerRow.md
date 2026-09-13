---
component: CarerRow
status: stable
source: src/components/CarerRow.tsx
updated: 2026-09-06
---

# CarerRow

**Why it exists:** adjust — widened from `VisitRow`'s shape for a different job: one carer, not one visit. Same rhythm, no chip, no act on the row.

## When it applies
- the Carers list; the three names on an *asked* visit

## When it doesn't
- ranking — there is no order but the alphabet (DEC-003)
- a profile page — there is none; the row is all there is

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | one shape | a "compact" list |

## Content
- name, phone, the days they usually can — in the owner's words ("most mornings"), never a percentage

## Layout
- the same rhythm as `VisitRow`: `space.2` between rows, `border.subtle` under each

## Accessibility
- a list item; the phone number is a link on the phone
- *not checked:* the reading order of "the days they usually can"

## Research
- EVID-002 — the owner keeps carers "in her head, not in a system"; the row is deliberately as thin as her head's version
