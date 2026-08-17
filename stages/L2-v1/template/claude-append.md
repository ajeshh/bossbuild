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
2. **`/design-review` before code; `/ux-check` after.** Design choices that touch user-facing
   surfaces run through both. Review by `ui-designer` (token + visual authority) and `ux-designer`
   (flows + states). The 5-state requirement is non-optional: every interactive element specifies
   default / hover / active / disabled / empty (and loading where relevant).
3. **`/board` is the sequencing surface.** Cross-FEAT prioritization. Read by `program-manager`
   (the *when*, not the *what*). What's blocked, what's parallelizable, what's next.
4. **Data shape is a decision, not an accident.** `db-architect` reviews schema before code, even
   in solo-builder mode. Schema migrations are first-class; ad-hoc column adds are flagged.
5. **The mentor board has full V1 quorum.** `mentor-business` (model + pricing — Patrick Campbell,
   Madhavan Ramanujam, the right-sized voices). `mentor-fundraising` (Janz, Skok — defaulting to
   "don't raise" unless earned). `mentor-pitch` (Raskin spine, Miller story-driven, Neumeier
   simplicity). `mentor-talent` (Hughes Johnson, the right-sized team voices). All advisory; never
   binding legal/financial/medical.
6. **The conscience still runs.** Every prior moment (caution, Done, restraint, coherence) keeps
   firing — V1 doesn't replace earlier discipline, it adds the V1-specific surface.

## What V1 adds (alongside MVP)

- **Skills:**
  - `/board` — cross-FEAT sequencing surface (`program-manager`'s authoritative view)
  - `/design-review` — before-code design review against tokens + brand + 5 states
  - `/ux-check` — after-code review of flows, interaction patterns, Nielsen heuristics
- **Builder agents:**
  - `ui-designer` — token + visual authority. Cites Brad Frost (Atomic Design), Nathan Curtis
    (layer-cake tokens), Jina Anne (W3C DTCG). Refuses raw hex unless overridden; flags copy to
    whoever owns the words.
  - `ux-designer` — flows + states + interactions. Cites Don Norman (affordances), Jakob
    Nielsen (10 heuristics), Steve Krug (clarity), Luke Wroblewski (forms/mobile).
  - `db-architect` — schema design, indexes, query patterns. Cites the AI-native data voices
    (Liu on structured outputs) + classical (Stonebraker, Date, Codd).
- **Mentor agents** (promoted from BOSS-local in v0.15 to template here):
  - `mentor-business` — model, pricing, packaging, willingness-to-pay
  - `mentor-fundraising` — whether / when / how to raise; defaults to *don't*
  - `mentor-pitch` — story + deck + 60-second-version + demo arc
  - `mentor-talent` — first hires, contractor vs employee, operating cadence
- **Loops:**
  - `design-drift-loop` — V1-stage; emits the `coherence` moment when system-vs-code drift
    exceeds threshold (raw hex codes appearing, near-duplicate components, tokens file
    stale while components grow)
- **Conventions:**
  - `docs/design/DESIGN_TOKENS.md` is authoritative (created at MVP via `/design-tokens-init`;
    enforced at V1)
  - `docs/design/STYLE_GUIDE.md` documents how tokens compose into patterns
  - `docs/architecture/` carries db-architect's schema decisions
  - `docs/board.md` (or live-state computed from FEAT frontmatter) drives `/board`
- **Graduation:** when the team grows, the org gets real, and a product council needs to be a
  thing — `boss unlock scale`.
