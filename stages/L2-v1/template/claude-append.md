## V1 working rules (added on `boss unlock v1`)

> {{MODE}} mode is *ready for a real, shippable release*. The design layer turns on, the second
> tier of mentors arrives, and discipline tightens on the parts that matter when real users meet
> the product. Same JIT principle — nothing imposed until earned — but the V1-stage ceremonies
> are now earned.

1. **Design tokens are authoritative.** Every style value comes from `docs/design/DESIGN_TOKENS.md`
   + the corresponding code file. New colors are added to the tokens, never inline — and
   `design-tokens-guard` catches a raw style value the moment one is written — color, radius, type,
   spacing, elevation, each gated on your tokens file defining that family. It shipped at MVP and is
   dormant until you turn it on; `/design-tokens-init` offers it once.
   **What `design-drift-loop` watches is raw hex codes in source, and that is all** — one regex.
   It cannot see near-duplicate components or a tokens file going stale while components grow.
   Those are component-shaped failures, and `/design-library` is what reads them.
2. **You already have `/design-review`** (before code and after), and the 5-state requirement is
   non-optional. What V1 adds is the
   half that needs a real component set to exist first: `/design-library` renders the system from
   your code — foundations, rule sets, every component in all five states — and reports the
   component-shaped drift the regex loop cannot reach.
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

**Run `boss map`** for this rung's skills and loops, live from the install. In short: `/board` (the
sequencing surface `planner` reads), `/design-library`, and `design-drift-loop` (raw hex in source →
the `coherence` moment). No new mentor (rule 5). `docs/design/STYLE_GUIDE.md` says how tokens compose;
`docs/architecture/` holds the schema decisions `/spec` shaped. When the team grows and the org gets
real → `boss unlock scale`.
