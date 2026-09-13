---
component: Rail
status: stable
source: src/components/Rail.tsx
updated: 2026-09-05
---

# Rail

**Why it exists:** new — the three places, in one component that is a rail on the laptop and a bottom bar on the phone; nothing else navigates.

## When it applies
- every owner screen: Today · Carers · Settings

## When it doesn't
- the carer's side — the ask card is the carer's whole product; no rail
- the printed Monday

## Variants, and when
| Variant | Use it for | Never for |
|---|---|---|
| (none) | one component, two surfaces by re-architecting | a hamburger; a fourth place |

## Content
- the three words, never icons alone; the current place is marked by weight, not the accent

## Layout
- laptop: 240px left rail; phone: a bottom bar with three 44px targets (`target.min`); the re-architect technique from the Layout slot

## Accessibility
- `nav` with an accessible name; the current place has `aria-current`
- *not checked:* the bottom bar under a phone's home indicator

## Research
- EVID-001 — owners named three things they do: today's cover, "who I've got", and "the settings I never touch"; the rail is those three
