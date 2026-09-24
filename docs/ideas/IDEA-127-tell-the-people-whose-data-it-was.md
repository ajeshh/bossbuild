---
id: IDEA-127
type: idea
kind: capability
owner: Ajesh
status: seedling
proof: none
proof_note: found by the IDEA-123 text audit (2026-09-23), not by a founder; a humane gap in shipped text, the same warrant as a checker finding
gist: When a project with live users is retired, or an incident exposes or loses their data, nothing BOSS ships says to tell them. Feature-level /sunset drafts an honest user message; project retire and /incident don't.
created: 2026-09-23
relates: IDEA-123
---

# IDEA-127 — Tell the people whose data it was

## Current shape

Found by the IDEA-123 read of all 72 founder-facing files, and confirmed at source on 2026-09-23:

- **Project-level `/sunset`** (L0, Movement 3) runs `boss retire`, which flips a status flag and
  touches nothing on disk. There's no step for the live users: tell them it's ending, let them take
  their data, and delete what should be deleted. **Feature-level** `/sunset` already has *"Move 3 —
  draft the honest user message (no euphemism)"*, so the pattern exists one level down.
- **`/incident`** (L3) asks *"what the user actually saw — and was the status message honest?"*.
  That's the outage message, not the people whose data was **exposed or lost**. It has no step for
  telling them, saying what was exposed, or saying what they should do (and, in many places, a
  regulator on a clock).

Why it matters: this is harm to people who aren't in the room, the category the conscience's consent
boundary says is named once even when unwelcome. Both gaps sit exactly where it lands.

## Open questions

- Should project retire ask *"does this have live users?"* first, and borrow feature-level Move 3
  when it does?
- `/incident`: a plain step, *"if anyone's data was exposed or lost, who tells them, what exactly,
  and by when"*, with **no legal advice**, pointing at `/trust`'s deletion path. How much is
  jurisdiction-specific enough to need a "check your obligations" line and nothing more?

## Capture log

- 2026-09-23: captured from the IDEA-123 audit. Not built.
