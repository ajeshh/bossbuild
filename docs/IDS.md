---
id: IDS
type: index
owner: pm
status: active
---

# ID System — BOSS

| Prefix | Means | Lives in |
|---|---|---|
| `IDEA-NNN` | A raw idea / planned capability | `docs/ideas/` |
| `FEAT-NNN` | An idea in active build (promoted from IDEA) | `docs/ideas/` (or a `docs/features/` folder if it grows) |
| `DEC-NNN` | A load-bearing / hard-to-reverse decision record (ADR-lite; `status: decided \| superseded`, supersede-don't-edit) | `docs/decisions/` |
| `PRAC-NNN` | A shared craft learning — a better way to build with AI (`status: active \| stale \| retired`, staleness-aware via `review_by:`) | `docs/practices/` |
| `EVID-NNN` | A single piece of evidence bearing on a canvas assumption — one signal per file, graded on a fixed 3-rung ladder (`stated-pain` → `observed-behavior` → `commitment`) | `docs/evidence/` |
| `RVW-NNN` | A `/vet` verdict on an unproven outside claim (ADOPT/ADAPT/REJECT/NOT-YET) | `docs/research/verdicts/` |
| `vX.Y.Z` | A released BOSS version | `registry/CHANGELOG.md` |

Frontmatter on every doc: `id`, `type`, `owner`, `status` (`seedling | exploring | ready | building | shipped | dropped`).
