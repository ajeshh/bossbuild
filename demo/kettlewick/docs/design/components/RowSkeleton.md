---
component: RowSkeleton
status: stable
source: src/components/RowSkeleton.tsx
updated: 2026-09-04
---

# RowSkeleton

**Why it exists:** new — the shape of a row while the day loads; the product has no spinner anywhere.

## When it applies
- the day view and the carers list, for the first second

## When it doesn't
- anything past a few seconds — that is a sentence ("Still loading the day…"), not a shape

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | the row's exact shape | a generic grey block |

## Content
- none; three rows of the row's shape

## Layout
- identical box to `VisitRow` so nothing jumps when rows arrive (PAT-9)

## Accessibility
- `aria-busy` on the list; the skeleton is hidden from the reader; `prefers-reduced-motion` stops the shimmer
- *not checked:* nothing

## Research
- (none — a craft floor, not a finding; retire the row if a person ever mentions it)
