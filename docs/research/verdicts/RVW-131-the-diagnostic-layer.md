---
id: RVW-131
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a design-systems consultancy founder's three-part series, 2026-05 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-131 — a three-part series: ephemeral UI is coming, the check-engine light is on, and a diagnostic layer (tokens + component contracts) is the prerequisite

## The claim
- **Source:** a design-systems consultancy founder's three-part series, 2026-05.
- **Core assertion:** Products are moving to **ephemeral UI**, generated per user and per intent, which needs a *complete* design system. Most enterprise systems quietly drift (designers and engineers with no structural channel, values colour-picked from screenshots). The fix is a **diagnostic layer** between design and code: **tokens** (the aesthetic canon) plus **component contracts** (structured specs of props, states, a11y and behaviour), validating both directions.
- **Inbox file:** `~/Projects/inbox/bossbuild/The future of design systems – parts 1–3…pdf (three files)`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | n=1 consultancy reporting its own engagements, unverifiable, and partly promotional. The ephemeral-UI outcome is an anecdote. |
| 3 | Duplicate or sharpen? | **Duplicate on the mechanism.** Tokens plus contracts *is* `tokens.json` plus `manifest.json` (name · purpose · variants · states · tokens · composes) plus usage pages, with drift rendered on the card and caught at the write. **Code → design** is the direction RVW-082 refused as unevidenced, and the series offers no evidence beyond its own clients. **Ephemeral UI** is a product thesis about what founders build, not something BOSS's design system should assume. |
| 4 | Who serves / harms? | Ephemeral UI framing could push a `vibe-virtuoso` toward generated-per-user interfaces before anyone has used the static one. |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
BOSS already has the diagnostic layer at founder scale and enforces it before the drift instead of reporting it after. The forward-looking half is a bet BOSS doesn't need to make for its founders.

## If REJECT / NOT-YET
- **Why not:** duplicate of tokens + manifest + guards; code→design refused in RVW-082; ephemeral UI is out of scope.

## Attribution
The author's own engagements; nothing checkable.

## Notes
- BOSS version when recorded: 0.329.0
