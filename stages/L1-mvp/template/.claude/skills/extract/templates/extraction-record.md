# `/extract` — the EXTR record skeleton (bundled resource)

> Loaded **on demand** from step 4 of `SKILL.md`. Write this to `docs/extractions/EXTR-NNN-<slug>.md`.
The frontmatter and the `Route` line are what make the file detectable by `extraction-loop`.

```markdown
---
id: EXTR-NNN
type: extraction
owner: pm
status: recorded
created: {{DATE}}
trigger: <devlog-3-entries | FEAT-NNN-shipped | mode-unlock | third-repetition | manual>
---

# EXTR-NNN — <one-line summary of the extraction>

## Recent context
_What was in the air at the breakpoint — last 3-5 devlog entries summarized in 2-3 sentences,
last commits referenced. Future-you reads this to remember why this extraction happened._

## Candidate 1: <name>
- **What it is:** <one line>
- **Where it lives now:** <file paths, scope>
- **Route:** UP | DOWN | NOT-YET
- **Rationale:** <why this route — answer the routing questions briefly>
- **If UP:** target `library/<category>/<name>` — run `boss learn <src-path> --as <cat>` next.
- **If DOWN:** target `src/<path>` — refactor target named + the smallest valuable cut.
- **If NOT-YET:** re-open condition: <what would change the answer to UP or DOWN>.

## Candidate 2: <name>
(same structure)

## Candidate 3: <name>
(same structure — omit if fewer than 3 candidates)

## What didn't make the cut
_Patterns you considered and explicitly rejected. Naming what's NOT an extraction is half the
discipline — it prevents over-extraction the next time the loop fires._
- <pattern> — <why not>

## Notes
- Source devlog entries: <date range>
- Related FEATs: <FEAT-NNN refs>
- BOSS version when this was recorded: <from VERSION>
```
