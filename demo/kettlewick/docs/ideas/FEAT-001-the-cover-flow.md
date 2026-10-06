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
program: PROG-001
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
- **Negative path:** a carer sees only their own asks — never another carer's schedule.

## Build log
- 2026-08-28 — shipped to nine owners.
- 2026-09-20 — *qualified* is now the owner's call, not the app's: the register import keeps four fields (day, time, area, the client's first name — PRIVACY.md, DEC-005), so the three asked are the area's three free carers and the owner's confirm is where qualification is checked. The criterion above was met at ship; this is what it became. Re-open if an owner confirms a carer who couldn't do the visit.
