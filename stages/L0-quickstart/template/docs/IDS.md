---
id: IDS
type: index
owner: pm
status: active
---

# ID System — {{PROJECT_NAME}}

Stable IDs make work addressable across sessions and docs. New types unlock as the project matures.

## Active in Quickstart mode

| Prefix | Means | Lives in |
|---|---|---|
| `IDEA-NNN` | A raw idea, bug, or ask | `docs/ideas/` |
| `EVID-NNN` | One real signal about your riskiest assumption, honestly graded | `docs/evidence/` |
| `DEC-NNN` | A load-bearing or hard-to-reverse call, with a falsifier. Supersede, don't edit | `docs/decisions/` |

## Unlocks later

| Prefix | Means | Unlocks in mode |
|---|---|---|
| `FEAT-NNN` | A scoped feature with a spec | MVP |
| `PRAC-NNN` | A craft learning worth keeping — and sharing with a cofounder | MVP |
| `EXTR-NNN` | A pattern extraction decision (UP into the library / DOWN into app core; PRINCIPLE #1) | MVP |
| `RFC-NNN` | A decision document | Scale |
| `EXP-NNN` | A lab experiment | Scale |

## Frontmatter (required on every new doc)

```yaml
---
id: <ID or slug>
type: <idea | feature | fix | decision | index | spec | ...>
owner: <agent or person>
status: <one of the seven below>
---
```

## Status — a closed vocabulary

**The file's frontmatter is truth.** Any index, board, or summary is a *view* of it. When the two
disagree, the file wins and the view is what gets corrected.

| Status | Means |
|---|---|
| `seedling` | Captured, not yet thought about. |
| `exploring` | Being thought about. No build committed. |
| `ready` | Thought through, waiting on a build slot. |
| `building` | Started and not finished — including *partly* finished, where some slices shipped and named ones remain. |
| `shipped` | It exists, and a user can reach it. |
| `deferred` | Deliberately NOT being built, with a **written re-open trigger**. A decision, not a backlog item. |
| `dropped` | Decided against. Keep the file for the reasoning. |

**The status must START with one of those seven words.** Everything after is free-form detail and is
encouraged — `shipped (v0.4, read-only slice)` and `building (steps 1–3 done, 4 open)` both say more
than the base word alone.

**Why the list is closed.** The moment `implemented`, `built`, `done`, and `resolved` all show up in
one project, four words mean *shipped* and no reader — you, a teammate, or an agent — can tell them
apart. Your board quietly disagrees with your files and nothing announces it. A vocabulary nobody can
enumerate is not a vocabulary.

## Numbering

Allocate the next free integer per prefix. Before reserving one, grep all of `docs/` — not just an
index — so planning docs that reserve numbers ahead of folders don't get clobbered.

**IDs are never reused, and a gap is free.** Two files claiming the same number makes every reference
to that number ambiguous, including references already written down somewhere you've forgotten. If
you're unsure, take the next number up. Nothing is owed to a tidy sequence.
