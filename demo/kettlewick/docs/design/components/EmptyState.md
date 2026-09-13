---
component: EmptyState
status: draft
source: src/components/EmptyState.tsx
updated: 2026-09-09
---

# EmptyState

**Why it exists:** new — what a day shows when nothing is uncovered: the product's best case, which is also the one owners see least and trust least.

## When it applies
- the day view when no visit is uncovered
- the carer's inbox when there is no ask

## When it doesn't
- loading — that is the skeleton of a row, not this
- an error — that is copy on the row that failed

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | one message, one action at most | an illustration with no action |

## Content
- "Nothing uncovered today." — and no action, because there is nothing to do; the carer's reads "No asks. Enjoy the gap."

## Layout
- centred in the list's space; the same margins as a row

## Accessibility
- plain text; nothing to operate

## Research
- EVID-004 — the owner who pre-paid said the empty day was "the first time it felt finished"; draft until a second owner says so
