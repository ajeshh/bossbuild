---
id: RVW-079
type: verdict
owner: product-lead
status: recorded
created: 2026-08-20
verdict: NOT-YET
route: n/a (two sub-ideas already taken as ADAPT in v0.169.0; the FORMAT itself is deferred)
---

# RVW-079 — should BOSS emit DESIGN.md as its design-system format?

## The claim
- **Source:** [github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md)
  (Apache-2.0) · [spec.md](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
- **Core assertion:** DESIGN.md is becoming the standard file for describing a visual identity to
  coding agents, so BOSS should emit it instead of its bespoke `DESIGN_TOKENS.md` + `STYLE_GUIDE.md`
  + inlined `CLAUDE.md` map.
- **Inbox file:** `docs/research/inbox/design-md-portable-format.md`

## Attribution — VERIFIED (primary spec read directly)

The spec was read at source, not summarized: YAML frontmatter tokens + markdown prose · eight ordered
sections · `{path.to.token}` cross-references · components as `map<string, map<string,string>>` with
state variants · unknown content preserved, duplicate headings rejected · **`version: alpha`** ·
**visual design only, no voice/tone/content.**

⚠️ **What does NOT verify: adoption.** "Becoming the standard" is the claim's load-bearing word and
nothing establishes it. `awesome-design-md` and `getdesign.md` are community/vendor artifacts, and
getdesign.md's "64K+ onboarding responses" is a vendor's own funnel metric, not adoption evidence.
**A spec from a large lab is not the same as a settled spec** — `mcp.md`'s lesson was that what
mattered wasn't features but the moment the protocol acquired *rules for how it changes*. DESIGN.md
has no lifecycle policy, no deprecation window, no stability commitment.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **Not directly, and it cuts both ways on #5 (optionality).** Emitting a portable format *preserves* choice; adopting an **alpha** spec *forecloses* it if the format churns. Net: no contradiction, but #5 argues for waiting rather than moving. |
| 2 | Evidence grade | **Primary-verified for what the spec IS; unverified for whether anyone uses it.** The load-bearing claim (standardization) is the unevidenced half. |
| 3 | Duplicate or sharpen? | **Substantially duplicate.** BOSS converged on the same architecture independently — tokens + prose rationale + inlining into `CLAUDE.md` so *"the agent inherits the brand for free on every turn."* That's the DESIGN.md thesis, written before the spec existed. **Two genuine sharpenings were extracted and already shipped (v0.169.0):** a Do/Don't section, and **states encoded as structural variants** (`button-primary-hover`). |
| 4 | Who serves / harms? | Portability serves everyone in principle. **Alpha churn harms `first-product` / `vibe-coder-newbie` most** — they cannot evaluate a spec revision and would experience a breaking format change as their tooling breaking. |
| 5 | Cost / ceremony | **Heavier.** A second emitted format is a maintenance surface, and BOSS already points at **DTCG** for token portability. Emitting both is ceremony; picking wrong is churn. |

## Verdict: NOT-YET

The architecture is validated — which is *reassuring about BOSS's judgment*, not a reason to switch
formats. The two ideas worth having were extracted and shipped without adopting the container. What
remains is a bet on an **alpha spec with unverified adoption**, and BOSS's own MCP lesson says the
thing to wait for is not features but a **lifecycle policy**.

Not REJECT: the portability argument is real and is BOSS's own (*"don't monetize lock-in"*; DTCG is
already emitted on exactly this reasoning). It just hasn't earned the switch.

## Re-open condition
Any **one** of:
1. DESIGN.md ships a **stable version with a stated deprecation policy** (the `mcp.md` bar).
2. A founder arrives **already carrying** a DESIGN.md — then BOSS should read it, which is a smaller
   and cheaper commitment than emitting it.
3. A second agent host BOSS cares about consumes DESIGN.md natively.

Added as a **tap** under build-craft watchlist domain 7 so it can't rot unnoticed.

## Notes
- Prior related: [[RVW-078]] (same sweep, same "take the mechanism, refuse the container" shape).
- **Do not re-litigate on popularity alone.** Adoption counts from a vendor's funnel are not the
  re-open condition; a lifecycle policy is.
- BOSS version when recorded: 0.171.0

## Addendum — 2026-09-12: re-open condition #2 became the common case; the read-side shipped

- **Spec status unchanged:** still `alpha` (*"Expect changes to the format as it matures"*); CLI
  grew `lint`/`diff`/`export` (Tailwind, DTCG); `@google/design.md` 0.4.0 on npm; ★27.9k.
  Condition #1 (stable version + deprecation policy) **not met**.
- **Condition #3 inverted rather than met:** `impeccable` (★67.5k, 17 hosts) now writes a root
  `DESIGN.md` in **its own format** (Color/Type/Shape/Components, no YAML), mentioning Google's spec
  only as a comparison. Two tools, one filename, two formats. That is a namespace collision, not a
  second consumer — and it argues *harder* for NOT-YET on emitting.
- **Condition #2 is now ordinary:** any founder who installed impeccable or ui-ux-pro-max
  (`design-system/<slug>/MASTER.md`) arrives carrying a design system. The verdict's own answer —
  *read it, cheaper than emitting it* — shipped in **v0.307.0**: `/design-tokens-init` step 0 looks
  for root `DESIGN.md`, `PRODUCT.md`, `.impeccable/**`, `design-system/*/MASTER.md`, and treats a
  hit as prior art to build on, never as a signal to generate a second system beside it.
- Verdict on the FORMAT: **NOT-YET, reaffirmed.** Source: `docs/competition/design-system-tooling.md`.
