---
component: ImportRow
status: stable
source: src/components/ImportRow.tsx
updated: 2026-09-06
---

# ImportRow

**Why it exists:** adjust — a `VisitRow` before it is a visit: the parsed line, as read, so the owner checks it before it becomes the day.

## When it applies
- the check screen after a paste — every line of the sheet, read or not

## When it doesn't
- the day view — once confirmed, it is a `VisitRow`

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| read | the parse is confident: time · client · carer | hiding what it guessed |
| couldn't-read | the line as typed, marked | dropping the line |

## Content
- read: the three parts in the row's order; couldn't-read: the raw text and "couldn't read this one — the rest will import"

## Layout
- the same rhythm as `VisitRow`; couldn't-read rows carry an amber left rule, never red

## Accessibility
- the state is in the text, not only the rule colour
- *not checked:* forty rows on the phone

## Research
- EVID-003 — the parse got a row wrong in front of the owner; the check screen exists because she didn't trust the rest until she saw it
