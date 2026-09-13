---
id: components
type: design
owner: designer
status: active
updated: 2026-09-09
---

# Component index — Kettlewick

> **Open this before creating a component.** Reuse first, extend second, create last.
> A new component gets its row in the same change that creates it.

| Component | What it's for | Import | Variants | Missing states | Status |
|---|---|---|---|---|---|
| `Button` | the one act on a screen | `import { Button } from '@/components/Button'` | primary · secondary · ghost · danger | — | stable |
| `VisitRow` | one visit, its state, who has the ask, the act | `import { VisitRow } from '@/components/VisitRow'` | — | — | stable |
| `StatusChip` | a visit's state, shape first | `import { StatusChip } from '@/components/StatusChip'` | uncovered · asked · covered | — | stable |
| `AskCard` | the carer's yes / no, one thumb | `import { AskCard } from '@/components/AskCard'` | — | — | stable |
| `EmptyState` | what a day shows when nothing is uncovered | `import { EmptyState } from '@/components/EmptyState'` | — | — | draft |

**Missing states** names the holes in the five-state requirement. A dash means none are missing.

| Concept | We call it | Never |
|---|---|---|
| the visual variation | `variant` | `type`, `kind`, `style` |
| the primary action handler | `onAsk` | `onClick`, `onPress` |
| the off state | `disabled` | `isDisabled`, `inactive` |
| the loading state | `loading` | `isLoading`, `pending` |

## Retired

| Component | Why retired | On |
|---|---|---|
| `CoverButton` | was `Button variant="primary"` with the label "Ask" all along — merged | 2026-09-01 |
| `Card` | every use was a `VisitRow`; the surface tokens do the rest | 2026-09-03 |
