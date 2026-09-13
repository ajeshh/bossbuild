---
component: ConfirmDialog
status: stable
source: src/components/ConfirmDialog.tsx
updated: 2026-09-05
---

# ConfirmDialog

**Why it exists:** new — the one place a destructive act is confirmed; no other component asks a question and closes.

## When it applies
- cancelling a visit; removing a carer — the two acts that tell someone something they can't un-hear

## When it doesn't
- anything reversible — an ask can be withdrawn from the row, no dialog
- anything the owner works *in* — that is a page, never a modal

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | one question | a dialog with tabs, a form, or a second dialog |

## Content
- the title is the consequence: "Cancel the 9 o'clock. Priya will be told."; the danger button repeats it; the way out is *Keep it*

## Layout
- `surface.raised` with `shadow.raised` — the only thing that floats (PAT-5); centred, 360px, the two buttons in a row with the danger last

## Accessibility
- focus moves in and returns to the row's control on close (overlays prompt); Esc keeps it
- *not checked:* the screen reader's announcement of the title

## Research
- EVID-002 — the owner's fear of "telling the wrong person the wrong thing" is why the consequence is the title
