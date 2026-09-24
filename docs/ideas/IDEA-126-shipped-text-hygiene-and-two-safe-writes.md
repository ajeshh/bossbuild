---
id: IDEA-126
type: idea
kind: capability
owner: Ajesh
status: building
proof: none
proof_note: each task names its own check — a grep that comes back empty, a test that fails on the old code, a word count
gist: Three leftovers from the 2026-09-23 review. Shipped skills still tell BOSS's history and cite its internal ids. settings.json is written non-atomically. The board strips frontmatter with a regex blind to CRLF. And the longest skill carries every branch inline.
created: 2026-09-23
relates: IDEA-121, IDEA-123, IDEA-125
---

# IDEA-126 — Shipped-text hygiene and two safe writes

## Current shape

Found in the 2026-09-23 build review (the same four lanes as IDEA-121) and not covered by it.
Ajesh: *"3,4,5 lets go."*

- [x] **History out of shipped skill bodies.** Runtime instructions that narrate BOSS's own past
  (*"This paragraph used to claim…"* in `/canvas`, *"this step used to say `retired`"* in `/sunset`,
  *"because it used to"* in `/consult`, *"Three verbs used to…"* in `/evidence`, *"have always done
  this and this skill never did"* in `/design-tokens-init`) and BOSS's internal record ids
  (`IDEA-010` in `/design-tokens-init` and `/design-review`). The founder has their own IDEA-010;
  the model may open it. Keep the rule, drop the story. Check: a grep for `used to|IDEA-0` over
  those bodies returns only lines that are about the founder's records. Coordinated with IDEA-123
  step 3, which owns skill *wording*.
  *Done 2026-09-23: nine lines across the six; each keeps its rule and the consequence, drops how
  BOSS got there. A sweep of every shipped SKILL.md finds no other history lines — the remaining
  `IDEA-012`-style hits are examples of the founder's own ids.*
- [x] **`.claude/settings.json` is written with a plain truncate-then-write** in five places
  (`src/cli.js`, `src/hooks.js` ×2, `src/sync.js`, `src/remove.js`). Claude Code reads it live; a
  torn write breaks a founder's hooks. `src/atomic.js` exists and is used only by the registry and
  config. Check: every settings.json write goes through `writeFileAtomic`.
  *Done 2026-09-23: all five go through it, and `writeFileAtomic` retries a rename that Windows
  refuses with EPERM/EBUSY while another process holds the file. Hardening, not a reproduced bug.*
- [x] ~~**`src/board.js:142` strips frontmatter with a regex blind to CRLF.**~~ **Not a bug —
  checked 2026-09-23.** A CRLF record (with and without an H1) gets the same card line as its LF
  twin on the unchanged code; the gist path downstream absorbs it. The test that would have guarded
  the fix passed on the old code, so neither shipped. The reviewer's claim was read from the regex,
  never run — the same shape as IDEA-121's "measure the gap before building the gate".
- [ ] **The longest skill carries every branch inline.** `/design-tokens-init` is ~6k words; the
  per-surface branches (web / CLI / agent / mobile) belong in `reference/` files read only on that
  branch. Check: body word count before and after, and the branches still reachable from step 1.
