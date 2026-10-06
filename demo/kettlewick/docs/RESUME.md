---
id: RESUME
type: resume
owner: product-lead
status: active
updated: 2026-09-24
---

# RESUME — Kettlewick

**Read this first each session.** State + next tasks + open decisions.
**Window: 200 lines.** What has shipped lives in `docs/devlog.md` (history, append-only); what a
command can compute is not written here; standing rules live in `CLAUDE.md`. `boss status` says
when this file is past its window — move, don't trim.

## What this project is
Kettlewick finds a stand-in carer when one calls in sick, for small home-care agencies: one tap, the
right three carers get the ask, the first yes takes the visit, the owner confirms. The schedule stays
the owner's spreadsheet. £4 a carer a month, free for carers.

## State (current)
- Nine owners on; one paying (EVID-004). Payment links for October went to three more on 2026-09-21.
- Shipped: the cover flow, the Monday view, quiet hours, cancel in one tap, and since 2026-09-19 the
  drafted ask (FEAT-007), which falls back to the old template on any failure.
- Building: FEAT-003, the card form. Parked behind the links until three agencies have paid that way
  (MONEY-2026-09-20).
- Smoke: `npm run smoke`. Tests: `npm test`. Deploy recipe: PRAC-002.
- Open on purpose: the draft route has no session check (RT-2026-09-17). It reads no data; it lands
  with FEAT-003's accounts.

## Next tasks (in order)
1. Read the three payment-link answers by 2026-09-30; write each as an EVID, yes or no.
2. Move the canvas heartbeat's experiment line from the card form to the links (DRIFT-2026-09-22).
3. Log timed-out model calls to the cost ledger, by 2026-10-01 (REVIEW-2026-09-24). `/ai-cost review`
   weekly; next 2026-10-01.
4. The 2026-10-03 check-ins: do owners still text after ours? (FEAT-007's learning hypothesis.)
5. Check first names at import (letters, spaces, hyphens, apostrophes, 30 characters) and add the
   injected-name case to the eval set (RT-2026-09-17).

## Open decisions
- **If two of three links come back no** — does the schedule question reopen early? Lean: yes, it is
  DEC-002's falsifier arriving early; talk to both before deciding anything.
- **Bet 2, the Sunday-night line to the owner** — a feature, or Marta texting by hand for two Sundays
  first? Lean: by hand first, the same way the nudge was tested.

## Prompt for the next session
> Continue Kettlewick. Read `docs/RESUME.md` (this file — *State* + *Next tasks* + *Open
> decisions*), `CLAUDE.md`, then the newest `docs/devlog.md` entry. Cross-check `git log -3` against
> what RESUME claims — if they disagree, RESUME is stale; re-establish ground truth first. Then pick
> up *Next tasks* top down.

## Working reminders
- The model's kill switch is unsetting `ASK_MODEL`; every ask falls back to the template, no deploy.
- Nothing sends between 8pm and 6:30. Any new send inherits it (PROG-001).
