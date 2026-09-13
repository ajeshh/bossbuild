---
component: Toast
status: stable
source: src/components/Toast.tsx
updated: 2026-09-05
---

# Toast

**Why it exists:** new — the result of an act said once and gone; the only component that speaks without being on a row.

## When it applies
- after a confirm — "Covered. Priya's on the 9 o'clock."
- after an ask fails to send — "Couldn't reach anyone — try again, or ask three more."

## When it doesn't
- a standing fact ("3 asks go out at 7am") — that is the proposed `QuietNotice`, not a toast
- anything with a question in it — a toast never asks

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| success | the act worked | a count or a celebration |
| error | the act didn't, and what to do next | a stack trace |

## Content
- one sentence from the tone table; no exclamation marks; an *Undo* only when the act is reversible

## Layout
- bottom of the phone, above the bar; bottom-left on the laptop; 4s, paused on hover; `z-index.toast`

## Accessibility
- `role="status"` — announced without stealing focus; the error variant stays until dismissed
- *not checked:* the timing for a slow reader

## Research
- EVID-003 — the owner covered a visit from the school gate and "didn't wait to see"; the toast is what she'd have seen
