---
id: DEC-004
type: decision
owner: "@marta"
status: decided
date: 2026-09-02
revisit_by: 2026-12-01
relates: DEC-002, DEC-003
---

# DEC-004 — The brand anchor: kettle copper, green-black, two radii, one shadow

The five choices that get expensive to reverse, chosen once at the first UI commit:

- **The one owned accent** is `color.action.primary` (#A84D18, the kettle copper) — the same hex as
  the brand's `accent:`; it appears on the one act and on *covered*, nowhere else.
- **The neutral** is `color.text.body` (#17211E, green-black, not black) on a cool ground
  (`color.surface.ground`), so paper reads as raised without a shadow.
- **Radius** is two values: `radius.control` (6) for anything you tap, `radius.surface` (8) for
  anything that holds content.
- **Type pairing** is Newsreader over Public Sans, with JetBrains Mono for times.
- **The signature** is the status chip — a shape before a colour.

Off the scale on the day it was decided: the day list's 14px gutter → `space.3` (12).

**Revisit by 2026-12-01:** if nine owners become forty, the accent needs a second value for the
carer's side, and this decision says which.
