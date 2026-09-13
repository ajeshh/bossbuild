---
component: TextField
status: stable
source: src/components/TextField.tsx
updated: 2026-09-06
---

# TextField

**Why it exists:** new — one thing typed; the only input in the product, in two heights.

## When it applies
- a carer's name and phone; the pasted week (multiline); the visit note

## When it doesn't
- a choice — there are none to make (no picker, no select: principle 3)
- a search — the day is short enough to read

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| single | a name, a number | a paragraph |
| multiline | the pasted sheet, the note | a name |

## Content
- a visible label that stays; the placeholder is an example ("07700 900123"), never the label; the error sits under the field and names the fix

## Layout
- full width on the phone; 360px on the laptop; label above; `space.2` inside

## Accessibility
- label bound to the field; the error is announced; 44px on the phone
- *not checked:* autofill behaviour on the phone number field

## Research
- EVID-003 — an owner pasted her whole sheet into the first field she saw; the multiline variant is that field
