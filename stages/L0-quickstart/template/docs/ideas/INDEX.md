---
id: IDEAS-INDEX
type: index
owner: pm
status: active
---

# {{PROJECT_NAME}} — Idea Pool

**Ideas live as files in this folder** — one `IDEA-NNN-<slug>.md` each, captured with
`/triage <thought>`. Each file's frontmatter carries its own `status`, and that frontmatter is
the only place status is recorded.

## Where to see everything at once

```
boss board          # the live view: Captured → Taking shape → Building → Shipped
boss board --html   # the same read, as a page
boss board --next   # just: what should I pick up?
```

**The board is rendered from the files themselves, so it cannot drift.** There is deliberately no
table here to keep in sync — a hand-maintained index and the frontmatter it copies will eventually
disagree, and nothing tells you which one is lying. One home per fact: the file.

## Status values (set in each idea's frontmatter)

- `seedling` — captured, not yet examined
- `exploring` — being thought through
- `ready` — scoped, ready to build (promote to `FEAT` in MVP mode)
- `building` — in progress
- `shipped` — done
- `dropped` — decided against (keep the file; record why)

> Allocating the next free `IDEA-NNN` or `FEAT-NNN`? Read the **files**, not this page —
> see [`docs/IDS.md`](../IDS.md).
