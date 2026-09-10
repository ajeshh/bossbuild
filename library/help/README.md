# library/help — the source of the in-project HTML guide

`boss help --html` renders `.boss/help.html` from two halves:

- **Generated** — where you are, your commands, your skills, your team, the glossary, the
  glyphs, the wayfinding map. Read live from the project's own stamp and BOSS's manifests,
  so it cannot drift. Nothing here to maintain.
- **Hand-written** — the fragments in this folder. Prose that explains *why*, which no
  manifest can generate.

The fragments carry the same frontmatter discipline as `web/`, and for the same reason:

```
covers:     paths whose change means this prose may now be wrong
reviewed:   when a human last read it against those paths
review_by:  when it must be re-read even if nothing changed
describes:  what it claims to explain (printed when it goes overdue)
section:    where it lands in the page
title:      the heading
```

`npm run check:help` compares each fragment's `reviewed:` date against the last change to
its `covers:` paths and reports what may be behind. **A fragment with no `covers:` fails the
gate** — prose nothing can invalidate is prose that will quietly go stale.

The rule that keeps the two halves apart: **if a manifest can answer it, never write it here.**
Counts, rosters, skill lists and usage lines are generated. This folder is for the sentence a
founder needs that no data structure contains.
