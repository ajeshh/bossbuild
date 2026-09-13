---
component: Button
status: stable
source: src/components/Button.tsx
updated: 2026-09-05
---

# Button

**Why it exists:** new — the one act a screen exists for; nothing else commits the owner or the carer to anything.

## When it applies
- the one act a screen exists for — *Ask*, *Confirm Priya*, *Keep it*
- the yes / no pair on the carer's ask card (two `secondary`s that fill the width, primary below)

## When it doesn't
- navigation — that is a link, and it is never in the accent
- a state change that isn't an act — the chip is not a button
- anything that appears on every row — that is `ghost`, and only one primary per view

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| primary | the act | a second act on the same view |
| secondary | the way out — *Not now*, *Keep it* | a decoy that looks like a second primary |
| ghost | an act on a row — *Ask* | the only control on a screen |
| danger | the confirm on a destructive dialog | anywhere else; the label repeats the consequence |

## Content
- verb first, two or three words, sentence case; no ellipsis unless a dialog follows
- loading: the label becomes the participle and the button stays put — "Asking…"

## Layout
- last on the right in a dialog; first on a row; never two primaries in one line
- on the phone the yes / no pair fills the width, primary below; 44px minimum (`target.min`)

## Accessibility
- the label is the accessible name — never an icon alone
- focus: 2px `color.action.primary` outline, 2px offset
- *not checked:* the loading state's announcement to a screen reader

## Research
- EVID-003 — an owner covered a visit from the school gate with one thumb; the ghost *Ask* on the row is why she could
