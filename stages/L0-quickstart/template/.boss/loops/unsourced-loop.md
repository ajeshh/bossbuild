---
id: unsourced-loop
type: loop
stage: L0-quickstart
runner_type: hook
attributed_to: [Ajesh Shah (a number you cannot say the source of does not go in)]
also_relevant: [Rob Fitzpatrick (facts about the world, not opinions about the future), Hans Rosling (a number without its source is a number you can't check)]
entry:
  - any_file_matches:
      path_glob: docs/ideas/*-canvas.md, docs/ideas/CANVAS.md
      pattern: '^(?:\|\s*\*\*People\*\*[^|\n]*\||[-*]\s*\*\*People:?\*\*:?)(?![^\n]*(?:https?:|docs/(?:source|research)|EVID-\d|\b(?:19|20)\d{2}\b|[Ss]ource|unverified|not read))[^\n]*(?:\b\d{1,3}(?:,\d{3})+\b|\b\d+(?:\.\d+)?\s?(?:k|K|M|bn|million|billion|thousand)\b|\b\d{4,}\b)'
      related_idea_not_matching: '^status:\s+dropped'
exit:
  - quiet_for:
      path_glob: docs/ideas/*-canvas.md
      days: 999999
drift_moment: unsourced
---

# Loop: unsourced (Quickstart) — a count of people on the canvas with nowhere it came from

The canvas's **People** cell already carries the rule — *a number you cannot say the source of does
not go in* — and `/scout market size` is how a number gets one. The defect is the usual one: the rule
is read when the cell is written, by someone who already cared. A figure pasted in from a deck, a
chat or memory sits there and gets quoted into a pitch, and nothing ever asks where it came from.

## Entry

A **People** line on an active canvas (table row or bullet) that holds a count — `6,400`, `12k`,
`3 million`, `4000` — and **nothing on the same line saying where it came from**: no link, no
`docs/source` or `docs/research` path, no `EVID`, no date or year, no word *source*, no `unverified`.

Deliberately narrow. Every other number on a canvas — a price, a goal, a cost — is the founder's own
decision and needs no source; this fires only on a claim about how many people there are. A year
counts as a source marker, so a line like *"2,000 agencies (2026 register)"* is silent, and so is a
bare *"2000 agencies"* — the predicate under-fires there, which is the safe direction for a
conscience.

## Exit

None the predicate can see: the moment goes quiet when the **entry** stops matching — the number got
a source, got marked `unverified`, or left the cell. That is the only intended outcome.

## What the moment says

One line, once a session: the count, and that it has nowhere it came from — then the doors: `/scout
market size` to find one, write the source beside it if they already know, or mark it `unverified` so
nobody quotes it as fact. Never a lecture on sourcing; never blocks.
