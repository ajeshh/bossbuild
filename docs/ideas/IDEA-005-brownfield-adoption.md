---
id: IDEA-005
type: idea
owner: product-lead
status: shipped
proof: src/detect.js
created: 2026-05-21
---

# Brownfield adoption — `boss adopt` for an already-started app

## Current shape
- **What:** A way to bring BOSS into a repo that already exists, non-destructively. Today
  [`boss new`](../../src/cli.js#L37) refuses an existing directory (`'name' already exists here.`),
  so the only supported entry is greenfield. There's no `boss adopt` / `boss init`.
- **Why it's already half-built (sharpened while building v0.13.0):** the hard part — *not clobbering
  the founder's work* — already has the right primitives, just not yet behind one `adopt` command.
  - The CLAUDE.md append is a marked, idempotent block ([scaffold.js:50](../../src/scaffold.js#L50),
    guard at [:54-55](../../src/scaffold.js#L54-L55)).
  - **The sync engine already does non-destructive adoption**: `planSync`/`applySync`
    ([sync.js](../../src/sync.js)) write only `new`/`changed` managed files (skip `ok`), and as of
    v0.13.0 `computeSettingsMerge` folds hook registrations into an *existing* `settings.json`
    additively (preserves the user's keys). The registry can stamp any path.
  - **Correction:** there is no `cpSafe`. The scaffold's `cpSync` ([scaffold.js:71](../../src/scaffold.js#L71))
    *clobbers*. So `boss adopt` must **reuse the sync apply path, not `cpSync`** — that's the whole trick.
  - **So `boss adopt` ≈ `boss sync` into an unstamped existing dir:** stamp `.boss/` at the chosen
    register, then run the additive sync apply. Almost no new machinery — mostly composition.
- **The "lite version" is the design, not a fallback (Principle 2):** you don't drop a half-built app
  into Quickstart's spin-up arc it has outgrown. Adopt at the **lightest register that matches where
  the app already is** — likely just the conscience moments + capture, no spin-up — then `boss unlock`
  upward on evidence. A brownfield app with real users might adopt straight into MVP-register and skip
  Quickstart entirely. "Lite BOSS" = BOSS meeting the app where it is, which is the whole ethos.
- **Who it's for:** anyone who started building (with or without an AI tool) before hearing about
  BOSS — the largest realistic adoption path, and the one people keep asking about.
- **Smallest version:** `boss adopt [--mode <m>]` in an existing repo → stamp `.boss/` (mode +
  not-self-hosted), append the marked CLAUDE.md block, drop in the mode's skills/agents via `cpSafe`,
  register the project. Touch nothing else. Detect mode heuristically or ask; default to the lightest.

## Capture log
- 2026-05-21 — captured from a positioning conversation ("can I install BOSS on an app I already
  started, or only a lite version?"). Confirmed against the CLI: greenfield-only today; non-destructive
  primitives already exist. The "lite version" instinct reframed as the correct Principle-2 answer
  (adopt at the register the app has earned, unlock up).
- 2026-05-22 — while building the v0.13.0 sync fix (carry hooks + merge `settings.json`), the design
  got much closer: **`boss adopt` ≈ `boss sync` into an unstamped existing dir.** Stamp `.boss/` at the
  chosen register, then run the additive `applySync` (writes new-only managed files; `computeSettingsMerge`
  merges hook registrations) — reuse that engine, *not* the clobbering `cpSync`. Corrected the earlier
  `cpSafe` reference (no such function exists). So the remaining work is mostly: a `boss adopt [--mode]`
  command that stamps + calls the sync apply, plus mode-detect (ask, default lightest).

## Open questions (carried forward)
- **Mode detection:** can BOSS infer the right adopt-register from the repo (tests? users? CI? a
  funding doc?) or must it always ask? Leaning: ask once, default lightest.
- **Conscience without the arc:** a brownfield app has no BOSS memory/RESUME/canvas history — the
  story-holder substrate the moments stand on. Does adopt need a "catch-up" pass that reads the repo to
  seed enough arc for the conscience to fire well? Or does the arc just start accumulating from adopt-day?
- **Relation to `boss sync`:** once adopted, a brownfield project is just a registered project and
  rides the normal [IDEA-001](IDEA-001-learning-loop.md) sync loop. Confirm no special-casing needed.
- Overlap with the founder's existing CLAUDE.md conventions — append-only handles non-collision, but
  what if their rules contradict a mode's? (Same merge question carried by IDEA-001.)

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
