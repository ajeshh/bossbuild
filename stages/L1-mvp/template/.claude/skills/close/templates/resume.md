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

**Read this first each session.** State + next tasks + open decisions.
**Window: 200 lines.** What has shipped lives in `docs/devlog.md` (history, append-only); what a
command can compute is not written here; standing rules live in `CLAUDE.md`. `boss status` says
when this file is past its window — move, don't trim.

## What this project is
_One paragraph. The current articulation — sharpen as the project sharpens._

## State (current)
- _What's real right now: shipped FEATs, the smoke command, the stack._
- _Anything uncommitted worth knowing about._

## Next tasks (in order)
1. _Concrete. Single-session-shaped if possible._
2. …

## Open decisions
- _Question — tentative lean — what would close it._

## Prompt for the next session
> _**Keep this evergreen** — a pointer + procedure, never a status report._
>
> Continue {{PROJECT_NAME}}. Read `docs/RESUME.md` (this file — *State* + *Next tasks* +
> *Open decisions*), `CLAUDE.md`, then `VERSION` + `CHANGELOG`. Cross-check `git log -3`
> against what RESUME claims — if they disagree, RESUME is stale; re-establish ground truth
> first. Then pick up *Next tasks* top down.

## Working reminders
- _Commands, env vars, things easy to forget._
```
