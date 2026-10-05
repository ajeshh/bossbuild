---
id: RVW-128
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - an editor's starter guide on a design-system vendor's blog, 2026-02 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-128 — start a design system from the pain: three patterns, short guidance, a minimal living styleguide

## The claim
- **Source:** an editor's starter guide on a design-system vendor's blog, 2026-02.
- **Core assertion:** Start when you feel repeated work. Collect the basics, write *when to use / when not / one example* per component, sync design and code, ship a small searchable styleguide, and measure. For adoption: put docs where people work, keep pages scannable (*summary, visual, copyable snippet: value in 30 seconds*), use one template, link docs from PRs, and add a *"Where to start"* index for new people.
- **Inbox file:** `~/Projects/inbox/bossbuild/How do you start a design system…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No; *start small* is PRINCIPLE #2. |
| 2 | Evidence grade | Starter guidance wrapped around a product walkthrough. |
| 3 | Duplicate or sharpen? | **Duplicate.** BOSS's design system starts at the first UI commit (`design-tokens-init`), not as a project. The usage-page template is *when it applies / when it doesn't*. Copy on every value is `boss design` (*"every value copies"*). The living styleguide is the playbook, generated so it can't drift. The one unshipped item, the *Where to start* index, is taken in RVW-127 from words founders already write. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
Everything here is BOSS's MVP design rung. The single useful pointer is carried by RVW-127. Page-view metrics and PR-link counts are telemetry BOSS doesn't collect.

## If REJECT / NOT-YET
- **Why not:** duplicate; the one new piece lives in RVW-127.

## Attribution
The author's own guide; the linked documentation-timing article was not followed.

## Notes
- BOSS version when recorded: 0.329.0
