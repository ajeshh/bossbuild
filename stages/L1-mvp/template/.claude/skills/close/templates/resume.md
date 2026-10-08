# /close — the RESUME template (used when none exists yet)

```markdown
---
id: RESUME
type: resume
owner: product-lead
status: active
updated: {{today}}
---

# RESUME — {{PROJECT_NAME}}

**Read this first each session.** Where each piece of work stands is not written here —
`boss board --next` reads it from the records. This file keeps what no record holds.
**Window: 200 lines.** What has shipped lives in `docs/devlog.md` (history, append-only); what a
command can compute is not written here; standing rules live in `CLAUDE.md`. `boss status` says
when this file is past its window — move, don't trim.

## What this project is
_One paragraph. The current articulation — sharpen as the project sharpens._

## State (current)
- _What's true now that no record says: the stack, the smoke command, what's live._
- _Anything uncommitted worth knowing about._

## Priority (in order)
1. _FEAT-NNN — a few words of why it comes first._
2. …

## Found, no record yet
- _A task or question found this session with no record to live on._

## Open decisions
- _Question — tentative lean — what would close it._

## Prompt for the next session
> _**Keep this evergreen** — a pointer + procedure, never a status report._
>
> Continue {{PROJECT_NAME}}. Read `docs/RESUME.md` (this file), `CLAUDE.md`, then run
> `boss board --next` — where each piece of work stands, read from the records. Cross-check
> `git log -3` against *State* — if they disagree, re-establish ground truth first. Then pick up
> in *Priority* order; within it, the board's *Pick up* order.

## Working reminders
- _Commands, env vars, things easy to forget._
```
