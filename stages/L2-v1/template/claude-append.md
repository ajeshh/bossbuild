## V1 working rules (added on `boss unlock v1`)

> {{MODE}} mode is *ready for a real, shippable release*. The design layer turns on, the second
> tier of mentors arrives, and discipline tightens on the parts that matter when real users meet
> the product. Same JIT principle — nothing imposed until earned — but the V1-stage ceremonies
> are now earned.

1. **Design tokens are authoritative.** Every style value comes from `docs/design/DESIGN_TOKENS.md`
   + the corresponding code file. The `design-drift-loop` watches for drift — raw hex codes,
   near-duplicate components, tokens-file-untouched-while-components-grow. New colors are added
   to the tokens, never inline. (Future: PostToolUse hook for hardcoded-style detection lands in
   v0.23.)
2. **You already have `/design-review` and `/ux-check`** — they arrived at MVP with `designer`
   (v0.189.0), and the 5-state requirement has been non-optional since then. What V1 adds is the
   half that needs a real component set to exist first: `/design-library` renders the system from
   your code, and `design-drift-loop` enforces it.
3. **`/board` is the sequencing surface.** Cross-FEAT prioritization. Read by `planner`
   (the *when*, not the *what*). What's blocked, what's parallelizable, what's next.
4. **Data shape is a decision, not an accident.** You settled this at MVP — `/spec`'s data-shape step reviews schema before code, even
   in solo-builder mode. Schema migrations are first-class; ad-hoc column adds are flagged.
5. **The venture coach's remit widens here — no new mentor arrives.** `mentor-capital` has been
   seated since MVP for the model and the price. At V1 real users make two more questions
   answerable, so they become live for the *same* agent: **should you raise** (Janz, Skok —
   defaulting to *don't*, and it says so out loud) and **how do you tell this** (Raskin spine,
   Miller story-driven, Neumeier simplicity). One seat that deepens, rather than three that arrive
   — DEC-006. It is required to surface its own money-vs-raise tension rather than resolve it
   quietly, and it won't draft a deck while the raise question is still open. All advisory; never
   binding legal/financial/medical.
6. **The conscience still runs.** Every prior moment (caution, Done, restraint, coherence) keeps
   firing — V1 doesn't replace earlier discipline, it adds the V1-specific surface.

## What V1 adds (alongside MVP)

- **Skills:**
  - `/board` — cross-FEAT sequencing surface (`planner`'s authoritative view)
- **Mentor agents:** none new. V1 is a skills rung — `mentor-capital`'s remit widens instead (above).
- **Loops:**
  - `design-drift-loop` — V1-stage; emits the `coherence` moment when system-vs-code drift
    exceeds threshold (raw hex codes appearing, near-duplicate components, tokens file
    stale while components grow)
- **Conventions:**
  - `docs/design/DESIGN_TOKENS.md` is authoritative (created at MVP via `/design-tokens-init`;
    enforced at V1)
  - `docs/design/STYLE_GUIDE.md` documents how tokens compose into patterns
  - `docs/architecture/` carries your schema decisions (shaped at `/spec` time, reviewed by
    `mentor-architect`, guarded by `schema-guard`)
  - `docs/board.md` (or live-state computed from FEAT frontmatter) drives `/board`
- **Graduation:** when the team grows, the org gets real, and a product council needs to be a
  thing — `boss unlock scale`.
