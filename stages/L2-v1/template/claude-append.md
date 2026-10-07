## V1 working rules (added on `boss unlock v1`)

> {{MODE}} mode is *ready for a real, shippable release*: the design layer turns on and discipline
> tightens where real users meet the product. Nothing imposed until earned — these are earned now.

1. **Design tokens are authoritative.** Every style value comes from `docs/design/DESIGN_TOKENS.md`;
   new colors go into the tokens, never inline. `design-tokens-guard` catches a raw value at the write
   (dormant until `/design-tokens-init` turns it on). `design-drift-loop` sees only raw hex — near-duplicate
   components are `/design-library`'s to find.
2. **Five states, before code and after.** `/design-review` holds them; `/design-library` renders the
   system from your code and reports the component drift a regex can't see.
3. **`/board` is the sequencing surface** — `planner`'s *when*: blocked, parallel, next.
4. **Data shape is a decision.** `/spec`'s data-shape step reviews schema before code; migrations are
   first-class, ad-hoc column adds are flagged.
5. **`mentor-capital`'s remit widens; no new mentor.** Real users make two questions answerable: should
   you raise (it defaults to *don't*) and how you tell this. Advisory only.
6. **The conscience still runs** — every earlier moment keeps firing.

## What V1 adds (alongside MVP)

**Run `boss map`** for this rung's skills and loops, live from the install. In short: `/board` (the
sequencing surface `planner` reads), `/design-library`, and `design-drift-loop` (raw hex in source →
the `coherence` moment). No new mentor (rule 5). `docs/design/STYLE_GUIDE.md` says how tokens compose;
`docs/architecture/` holds the schema decisions `/spec` shaped. When the team grows and the org gets
real → `boss unlock scale`.
