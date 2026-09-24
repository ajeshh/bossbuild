---
id: IDEA-128
type: idea
kind: capability
owner: Ajesh
status: seedling
proof: none
proof_note: follow-ups from IDEA-123's measured pass; the warrant is the same (BOSS's own rule, measured), and none of the three has been measured yet
spun_from: IDEA-123 (the three follow-ups left when the voice pass itself shipped, 2026-09-23)
gist: Finish what IDEA-123 measured but didn't close — make judged proportionality count in the verdict, give the other judged conscience moments the shared voicing clause once they have graded cases, and record whether each fire ended in speech or silence.
created: 2026-09-23
relates: IDEA-123
---

# IDEA-128 — The conscience voice: three follow-ups

## Current shape

IDEA-123 shipped the pass: proportionality is now checkable (the judge's `stakes` / `proportion` /
`unneeded_sentences`, plus `voice-lint.js`), the drift/caution/capture/humane frames and every
flagged skill were tightened, and the Opus 5.5 regrade went 8 → 14 of 17 right-sized with 0 tics, 0
skill menus, 0 labels and 43/43 decisions still matching their labels. Three things were left open
on purpose:

1. **Make judged proportionality count.** It's report-only today, by design: it measured the
   baseline before the frames changed. Now that they have changed, decide what counts as a fail (an
   "under" on heavy stakes, surely; an "over" by one sentence, probably not, because single-vote
   judges flip on it) and move that into `replay.js`'s verdict. Needs a second vote, or a threshold,
   before it can block.
2. **The other judged moments.** focus, margin-trap, coherence, sustaining, unverified, deception,
   harvest and outpaced don't carry `VOICE_CRAFT`, and none of them has graded cases, so there is
   nothing to measure a change against. Build the cases first (the `sustaining.judgment.yml` shape),
   then add the clause and re-grade. Not the other way round: that's step 2 before step 1, the
   mistake IDEA-123 was careful to avoid.
3. **Voiced vs silent per moment.** Relayed by a peer session as Ajesh-approved on 2026-09-23 and
   **not yet confirmed with Ajesh directly.** Today `logActivity` records injected characters, not
   whether a fire ended in speech or silence, so a moment that mostly fires for nothing can't be
   seen, or retired on evidence. Design constraint: the UserPromptSubmit hook only injects; whether
   the model then spoke is only visible after the turn (a Stop-time read of the transcript). Two data
   points from 2026-09-23: task-hygiene fired and was right; focus-loop fired on parallel work being
   finished and was noise.

## Open questions

- (1) Two votes per judged case, or a threshold across a set? A single vote flipped smoke A between
  "right" and "over" on one optional sentence.
- (3) Confirm with Ajesh, then decide where the Stop-time read lives: a new dormant hook, or the
  existing smoke-guard/auto-log Stop path.

## Capture log

- 2026-09-23: spun out of IDEA-123 when its pass shipped.
