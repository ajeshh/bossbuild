---
id: RVW-127
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: ADAPT
route: DOWN src/design.js (Start here gains a generated "I need to…" index)
sources:
  - a design lead's post on why design-system docs go stale, on a design-system vendor's blog, 2026-03 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-127 — docs organized by component name fail the person who arrives with a job; add a task layer

## The claim
- **Source:** a design lead (the same author as RVW-122/135).
- **Core assertion:** docs go stale because they live away from the work, nothing fires when they
  drift, and updates aren't part of "done". Fix that by generating the facts (props, tokens),
  treating docs as part of the component contract, and tracking doc age. **Separately:** docs
  ordered by component name only work for people who already know the name. People arrive with a
  task (*"I need to let users do something destructive"*), and one team that added a task-based
  layer (*"showing loading states", "communicating errors"*) saw component usage *"noticeably up"*
  the next quarter. Lead with what someone needs now and link out for depth.
- **Inbox file:** `~/Projects/inbox/bossbuild/Why your design system documentation goes stale…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | n=1 anecdote, unquantified ("noticeably up"). The mechanism is the same one RVW-110 **reproduced in BOSS**: a person (or an agent) searches in the words of their job, not the component's name. |
| 3 | Duplicate or sharpen? | **The staleness half is duplicate**: generated manifest, a source hash marking cards stale, the usage page as part of done (`component-reuse-guard` asks *reuse, adjust, or new?* at the write), `--check` for CI. **The task half sharpens the playbook.** `boss design` is organized as a book: *Why it looks like this → The language → The parts → Every screen*. That reads well end to end and is hard to enter mid-task. The raw material for a task index **already exists and is already in the user's words**: every usage page's *When it applies* bullets (the template asks for *"the situations, in the user's words"*), and PATTERNS.md's *when it applies*. The playbook renders them per component and never gathers them. |
| 4 | Who serves / harms? | Serves the newcomer Ajesh named (a designer joining, a cofounder, the founder returning) and the founder's own *"where's the thing for…?"*. Harms no one. On a project with no usage pages it's a hole that says what fills it. |
| 5 | Cost / ceremony | Neutral for the founder: no new slot, it's a projection of text already written. A modest render change for BOSS. |

## Verdict: ADAPT
Take the task layer, generated and never composed. *Start here* gains **"I need to…"**: one line per
*When it applies* bullet across usage pages and patterns, each linking to its component or pattern
card, deduplicated and sorted. It is the "page of quick links" from RVW-116 and the "Where to start"
index from RVW-128, made from words the founder already wrote. That is IDEA-106's rule (a
projection, never prose BOSS writes) applied to onboarding.

## If ADOPT / ADAPT
- **What to do (DOWN, `src/design.js`):** collect `u.applies` from every usage page (non-retired)
  and the *when it applies* cells of PATTERNS.md. Render under *Start here* as **"I need to…"**:
  the bullet, then the target. With fewer than three lines, show a hole: *"each usage page's 'When
  it applies' becomes a way in; /design-review writes them."* Make it searchable with the
  playbook's existing in-page find, if it has one, and build no new search. Test: a project with
  two usage pages produces their bullets linked to their cards. A project with none produces the
  hole.
- **What's modified:** no doc-age metrics, page-view tracking or feedback form (no telemetry; BOSS
  is local). No hand-curated task list: if the founder wants a task in the index, they write a *When
  it applies* bullet, which improves the usage page too.

## Attribution
The author's own argument and anecdote; the atomic-design quote attributed to its author was not
re-checked and is not used. The metadata point attributed to another practitioner (code-only
props) was not followed.

## Notes
- Prior related verdicts: RVW-110 (the words someone would search for), RVW-116, RVW-128, IDEA-106 §5.
- Outcome (2026-10-05): landed DOWN. `readTasks()` gathers *When it applies* (non-retired, non-proposed components) and Ours situations. *Start here* shows **I need to…** at three or more lines and a hole below that. Verified on a throwaway `boss new` project. Tests written failing first.
- BOSS version when recorded: 0.329.0
