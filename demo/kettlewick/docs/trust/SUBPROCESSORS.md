---
id: subprocessors
type: trust
owner: "@marta"
status: active
updated: 2026-09-17
---

# Subprocessors — Kettlewick

Every company outside Kettlewick that touches data about an agency, its carers or its clients. The
list comes from what the app actually calls: Ola checked it against the code on 2026-09-17. Each
provider is named in the agency contract. This page names the job and the data.

| Who | What they do for us | What they get | Since | Where |
|---|---|---|---|---|
| **The hosting provider** | runs the app and its database | everything on [PRIVACY.md](PRIVACY.md): the owner's account, carers' names and numbers, the schedule's day, time, area and client first name, asks and answers | 2026-08-28 | UK region |
| **The text provider** | sends the asks and carries the yes/no replies | carers' mobile numbers; the text of each ask (the carer's first name, the day, time and area, the owner's first name, the answer link) | 2026-08-28 | UK and EU |
| **The model provider** | drafts the ask (FEAT-007) | per ask: the day, the time, the area, and the three carers' first names. **No client name, address or care note** (DEC-005). Training on our data: off, confirmed 2026-09-17. Kept up to 30 days for abuse checks, then deleted. | 2026-09-19 | US; transfer under its standard terms (a question for counsel, PRIVACY.md) |
| **The payments provider** | takes the monthly card payment (FEAT-003) | the owner's card and billing email, and the carer count on the invoice. No carer or client data. | **not live yet.** Listed now so the page is right on the day it is. | UK and EU |

## Not on this list, on purpose
- **Analytics or tracking.** There isn't any (DEC-003). We learn how it's going by asking owners.
- **Error tracking.** Errors go to the server log on the hosting provider (14 days).
- **Email marketing.** We don't send any.

## When this changes
A new subprocessor means the code calls something new, so this page changes in the same commit,
and the agencies hear about it by text before it goes live.
