---
component: AskCard
status: stable
source: src/components/AskCard.tsx
updated: 2026-09-08
---

# AskCard

**Why it exists:** new — the carer's whole product: one visit, one question, yes or no with one thumb, between visits. Nothing else is the carer's.

## When it applies
- the carer's phone, when an ask arrives (7am–8pm only — DEC-003)
- the carer's phone, after answering — the same card says who covered it

## When it doesn't
- the owner's side — the owner confirms on the `VisitRow`, never on a card
- more than one visit — one card per ask, never a list to triage

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | one card; its states are the five | a "compact" version |

## Content
- the time and the client's first name; who is asking; *Yes* / *Not this one* — never "Accept" / "Decline"
- after 8pm the card is disabled and says "This ask goes out at 7am" (the disabled state says why)

## Layout
- fills the phone width; yes / no fill the width side by side, 44px each; nothing above the fold but the visit and the two buttons

## Accessibility
- the two buttons are the only controls; the card is announced as one region
- *not checked:* the answered state's announcement

## Research
- EVID-002 — the owner's word for the ask today is "I ring round"; the card is what the ring becomes
