---
id: FEAT-001
type: feature
owner: product-lead
status: shipped
gist: The cover flow — one tap on the visit, the ask to three carers, the first yes fills it, the owner confirms.
for: marta
created: 2026-06-14
shipped_on: 2026-08-28
from: IDEA-001
program: cover
---

# The cover flow

## Goal
An owner covers a visit from their phone in under five minutes without a call.

## Acceptance criteria
- [x] A tap on an uncovered visit sends the ask to the three nearest qualified free carers.
- [x] The first yes fills the visit; the others are told it's taken.
- [x] The owner confirms; nothing is marked covered until they do.

## Paths that must not break
- **Money path:** none yet — the first month is free.
- **Destructive path:** a fill is never final without the owner's confirm.
- **Negative path:** a carer sees only their own asks — never another carer's rota.

## Build log
- 2026-08-28 — shipped to nine owners.
