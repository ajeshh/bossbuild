---
id: IDEA-129
type: idea
kind: capability
owner: Ajesh
status: shipped (Unreleased, 2026-09-23 — task 9 waits on Ajesh)
proof: src/playbook.js
proof_note: read against two rendered playbooks (the Kettlewick demo and BOSS's own `.boss/playbook.html`), 2026-09-23; no founder has opened either
gist: The playbook, second pass — fix what a real record set breaks (hard-wrapped paragraphs shatter, a capability IDEA renders as the venture, a heading over an empty cut), then make it read as a story rather than a record dump - a cover, a picture of what's backed, long records folded not cut, quieter provenance in the room.
created: 2026-09-23
spun_from: IDEA-106 (its second pass, read against two rendered playbooks, 2026-09-23)
relates: IDEA-106, FEAT-026, FEAT-027, FEAT-028, FEAT-029, IDEA-114, EVID-001
---

# IDEA-129 — The playbook, second pass

## Current shape

Ajesh (2026-09-23): *"its been a great v1, both in content and look and feel… how we can push it
further"*, then with BOSS's own playbook as the second example: *"lets capture as an idea and lets
execute"*.

Two readings, and the second is the one that matters. **The Kettlewick demo** is written to fit the
renderer (one-line paragraphs, short cells), so it looks finished. **BOSS's own playbook** is a
real record set, and it breaks the page in three places a founder's records will too:

1. **Hard-wrapped paragraphs shatter.** `blockMd` makes every source line its own `<p>`. Records
   wrapped at ~100 columns (what an agent writes) render as broken lines, and inline markup that
   spans a wrap shows raw: `*"anything to overall improve how we do it for` / `shipped."*`.
2. **A capability renders as the venture.** With no `kind: venture` record, `readIdea` falls back
   to the newest IDEA — here IDEA-119, a capability — so BOSS's Vision and Product chapters lead
   with *"Ajesh (2026-09-23), after the model moved to Opus 5.5…"*. IDEA-114 named the two kinds;
   the fallback ignores the field.
3. **A heading over nothing.** In the VC cut, *Also on the field* stays while its only block is
   left out of the cut (both playbooks).

Then the look. Every chapter has one shape (label, serif line, 2–3 equal cards, a provenance line
on each), so nothing tells the eye where to go; long records make one card a 3,000-px column beside
two short ones; the page opens on a toolbar, not the venture; and the only picture is the evidence
ladder, though the page already counts which cells are backed.

**The rules stay** (FEAT-026): every word is the founder's, a hole is a hole, numbers are counted.
Nothing below composes a sentence.

## Tasks

- [x] **1. Paragraphs join.** Consecutive lines are one paragraph; an indented line continues the
  list item above it. Test with a hard-wrapped record and an emphasis that spans the wrap.
- [x] **2. A capability is never the venture.** `kind: capability` is excluded from the venture
  pick; the canvas-paired IDEA still wins. No venture → the Vision holes, which is the truth.
  _Landed with one correction:_ records with neither `kind:` nor `motivation:` (every /boss venture
  before 2026-09-11) fall back to the OLDEST, not the newest — the spin-up record. BOSS's own tree
  still reads IDEA-001 (a capability from before the field); the fix there is the record, not the render.
- [x] **3. No heading over an empty cut.** A tier title hides when every block under it is out of
  the current cut.
- [x] **4. Headline hygiene, no rewriting.** A chapter line drops a leading field label (`What:`)
  and a leading status mark / version stamp (`🟢 v0.5 (2026-08-21) —`). Metadata, not the sentence.
- [x] **5. Long records fold, never cut.** A block body past a length shows its first paragraph and
  the rest under *the whole record*; Copy and Slide still carry all of it. The FEAT list shows
  building + newest shipped, the rest under the same fold.
- [x] **6. A cover.** Mark (when the brand has one), name, tagline, and three counted numbers — cells
  backed, signals and top grade, FEATs shipped. Replaces opening on the Present bar.
- [x] **7. What's backed, as a picture.** The thirteen cells as a small grid, each coloured by the
  grade behind it (commitment · observed · stated · asserted · hole). The *"and how do you know?"*
  answer at a glance; lives on the cover and at the top of Evidence.
- [x] **8. Quieter provenance in the room.** In Present and print, the source line drops to the grade
  chip; the path stays on the page view.

  _Landed:_ the cover opens every cut and the deck; the tiles live on the cover only (one id per
  block — a second copy at the top of Evidence would duplicate them). A tile jumps to the chapter that
  renders its cell, else the canvas grid, and opens *All* when the cut hides the grid (Ajesh caught the
  first version jumping nowhere). Found on the way: the ledger counted an unanswered cell as backed when
  an EVID's assumption shared a word with its name — BOSS's own top bar said *2 of 13 backed* with
  zero answered cells backed. Fixed: backed means answered and evidenced.
- [x] **10. The deck is the brand's, on any screen.** Ajesh (2026-09-23): brand colours, not black
  and white, in Present and the PDF. They already took the tokens, but only in the light scheme, so a
  presenter in dark mode showed neutral dark slides. Now `.deck` and `.printdeck` always carry the
  light scheme plus the tokens; the page follows the viewer. Print keeps backgrounds (`print-color-adjust`).
- [ ] **9. BOSS's own records.** Its Vision and Product chapters read IDEA-001 (*Learning loop*), a
  capability written before `kind:` existed. The render is right for founder projects; this tree needs
  `kind: capability` on its old IDEAs, or a `kind: venture` record for BOSS itself. Ajesh's call.

## Open questions

- **Since you last shared it** — a strip of what changed since a date (+1 commitment, FEAT shipped,
  DEC overdue), counted from git dates. It is the *progress* EVID-001 asked for. But *since when*:
  the last export needs a stamp BOSS doesn't keep, a `--since` flag puts the burden on the founder.
  Not built in this pass.
- Does task 5 contradict FEAT-026 rule 2 (*"nothing is collapsed or omitted"*)? Read here as no:
  that rule is about holes and dormant cells; a fold keeps every word one click away and in Copy.

## Capture log

- 2026-09-23 — captured from two rendered reads (demo at 1440px, VC cut; BOSS's own, VC cut). The
  demo-only bug was first logged on IDEA-106.
