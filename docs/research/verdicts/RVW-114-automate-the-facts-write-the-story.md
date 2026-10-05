---
id: RVW-114
type: verdict
owner: pm
status: recorded
created: 2026-10-05
verdict: REJECT
route: n/a
sources:
  - a post on documentation automation on a design-system vendor's blog, 2026-08 (docs/research/sessions/SESSION-2026-10-05-design-system-reading.md, gitignored)
---

# RVW-114 — automate the facts, write the story: mirrored / distilled / authored docs

## The claim
- **Source:** a vendor-blog how-to on syncing repo markdown into a docs platform.
- **Core assertion:** sort design-system docs into **mirrored** (props, token values, status: generate
  them, and the docs are wrong by definition if they disagree), **distilled** (changelogs, migration
  notes: a machine drafts, a human signs) and **authored** (why, when-not, intent: human only,
  because a machine asked to write them fabricates). Generated docs must be **deterministic,
  idempotent and CI-enforced**.
- **Inbox file:** `~/Projects/inbox/bossbuild/How to automate your design system documentation…pdf`

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | No. |
| 2 | Evidence grade | Practitioner guidance; no data. Sound by construction. |
| 3 | Duplicate or sharpen? | **Duplicate, and a useful confirmation.** Mirrored: `manifest.json` generated from code, with a source hash that marks a card *stale*, and `/design-library --check` for CI. Authored: the usage page is written *"never from its name alone"*, and IDEA-106 §5 refuses composed prose. Distilled: BOSS's CHANGELOG discipline is human-written by rule. The three-property test (deterministic, idempotent, CI-enforced) describes `src/design.js` as it stands. |
| 4 | Who serves / harms? | n/a |
| 5 | Cost / ceremony | n/a |

## Verdict: REJECT
BOSS made this split before this source did, and made it mechanically. Worth keeping as an outside
statement: *the authored half is the half a machine can only fabricate*. That is the reason BOSS
refuses composed prose, put in a sentence a founder could repeat.

## If REJECT / NOT-YET
- **Why not:** duplicate of `/design-library` (generation + stale hash + `--check`) and IDEA-106 §5.

## Attribution
Vendor how-to; nothing attributed to others.

## Notes
- Prior related verdicts: RVW-079 (format), RVW-081 (content hash).
- BOSS version when recorded: 0.329.0
