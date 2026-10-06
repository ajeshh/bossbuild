---
id: prototypes
type: design
owner: designer
status: active
updated: 2026-09-14
---

# Prototype registry — Kettlewick

> Every prototype here **imports `docs/design/DESIGN_TOKENS.md`** — or is explicitly marked
> `sketch`, meaning it is not a design decision and nothing should be implemented from it.

Started 2026-09-13, when the draft sheet became the second mockup since the tokens existed. The rows
before that are written from the devlog and the decisions, so the answers they bought are not paid
for twice. Prototypes live in `prototype/`. A discarded one is deleted once its row is here; an
adopted one stays until the components that replace it exist.

## Live

| Prototype | Explores | Tokens | Status | Notes |
|---|---|---|---|---|
| `prototype/draft-sheet.html` | three drafted asks, one per carer, read and edited before one Ask | ✅ imports | `adopted` → `FEAT-007` | started 2026-09-13; reviewed 2026-09-14 (`reviews/FEAT-007.md`) |
| `prototype/day-view.html` | the Monday on one phone screen, uncovered first | ✅ imports since 2026-09-02 | `adopted` → `FEAT-002` | a sketch on 2026-07-02, redrawn on the tokens when DEC-004 landed; deleted, `DayViewPage` replaced it |
| `prototype/ask-card.html` | the carer's yes / not this one, one thumb | ✅ imports since 2026-09-02 | `adopted` → `FEAT-001` | deleted, `AskCard` replaced it |

**Status vocabulary** — `sketch` (throwaway, off-system, decides nothing) · `exploring` (live
question) · `adopted` (graduated to a FEAT — link it) · `discarded` (answered; keep the row).

## Discarded — and what they answered

| Prototype | Explored | Why discarded | Answered on |
|---|---|---|---|
| `prototype/office-screen.html` (sketch) | cover from the office screen first (DEC-001) | four owners covered from a phone in June; the office screen was where the rival lives, not where Monday happens (DEC-002) | 2026-07-02 |
| `prototype/carer-profile.html` (sketch) | a carer card with a photo and a yes-rate, so the owner picks who to ask | a yes-rate is a league table and a photo is picking by face (DEC-003, IDEA-005 dropped) | 2026-07-20 |
| `prototype/pick-your-three.html` (sketch) | the owner chooses which three carers get the ask | it made the ranking in her head visible, which is the league table again; the three are the ones who could (FLOWS, *Find cover*) | 2026-08-26 |
| `prototype/draft-in-the-row.html` | the drafts opened inside the row instead of a sheet, so the row stays the unit (PAT-2) | three text fields in a row pushed the rest of Monday off the phone; the sheet keeps the day visible above it | 2026-09-14 |

## Graduation checklist

Before a prototype becomes product code:

- [ ] It imports the token system (no raw hex survived the move)
- [ ] All five states exist, not just the happy one the screenshot showed
- [ ] It's referenced from the FEAT that adopts it
- [ ] Its row here says `adopted` and names the FEAT
