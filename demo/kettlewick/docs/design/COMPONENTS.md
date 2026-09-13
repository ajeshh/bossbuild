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
| `ConfirmDialog` | the one destructive question — cancel a visit, remove a carer | `import { ConfirmDialog } from '@/components/ConfirmDialog'` | — | — | stable |
| `Toast` | the result of an act, said once and gone | `import { Toast } from '@/components/Toast'` | success · error | — | stable |
| `Rail` | the three places: Today · Carers · Settings — the laptop's rail, the phone's bottom bar | `import { Rail } from '@/components/Rail'` | — | — | stable |
| `TextField` | one thing typed: a carer's name, a phone number, the pasted sheet | `import { TextField } from '@/components/TextField'` | single · multiline | — | stable |
| `CarerRow` | one carer: name, phone, the days they usually can | `import { CarerRow } from '@/components/CarerRow'` | — | — | stable |
| `ImportRow` | one parsed line of the pasted sheet, on the check screen | `import { ImportRow } from '@/components/ImportRow'` | read · couldn't-read | — | stable |
| `RowSkeleton` | the shape of a row while the day loads | `import { RowSkeleton } from '@/components/RowSkeleton'` | — | — | stable |
| `PrintSheet` | the printed Monday — one colour, the three shapes, time order | `import { PrintSheet } from '@/components/PrintSheet'` | — | — | draft |

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
