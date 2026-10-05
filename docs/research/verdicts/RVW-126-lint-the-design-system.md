---
id: RVW-126
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a front-end writer's post on design-system linting, 2026-03 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-126 — introduce linting for design-system hygiene, gradually on a mature system

## The claim
- **Source:** a front-end writer's post on design-system linting, 2026-03.
- **Core assertion:** Linting is the automated version of what maintainers already do by hand (catch the raw hex, the off-grid padding), at three levels: the token data, the design file, the code. It takes ego out of review. On a mature system, adopt gradually (per component, per attribute, or new work only) so the first run isn't demoralizing; on a new one, lint from the start.
- **Inbox file:** `~/Projects/inbox/bossbuild/How to introduce linting for design system hygiene…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Practitioner guidance; standard advice. |
| 3 | Duplicate or sharpen? | **Duplicate.** BOSS's guards are linting at the write: `design-tokens-guard` (raw colour, deprecated names), `contrast-guard`, `content-terminology-guard`, `component-reuse-guard`, `ui-boundary-guard`. They fire on writes, so on an adopted repo they lint **only new work** by construction, which is the article's gradual path with no backlog shown up front. Token-data linting is the guard reading `tokens.json`. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
BOSS already lints from the first UI commit, at the moment of writing, and the write-time design gives the gentle rollout for free. Nothing to add. The named tools are vendor- and stack-specific.

## If REJECT / NOT-YET
- **Why not:** duplicate of the shipped guards.

## Attribution
The author's own guidance.

## Notes
- BOSS version when recorded: 0.329.0
