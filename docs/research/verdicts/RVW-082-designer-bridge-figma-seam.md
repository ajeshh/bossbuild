---
id: RVW-082
type: verdict
owner: product-lead
status: recorded
created: 2026-08-20
verdict: ADAPT
route: DOWN stages/L2-v1 (designer handoff — shipped v0.169.0) + UP design-system.md (token seam, named generically); code→design round-trip REFUSED
---

# RVW-082 — should BOSS bridge to design tools and onboard a designer?

## The claim
- **Source:** Figma Code Connect + *Design Systems and AI* (vendor) · Figma Variables API ·
  Tokens Studio · Figma Console MCP (third-party) · assorted 2026 round-trip posts
- **Core assertion (load-bearing):** when a founder brings in a designer and connects a design tool,
  BOSS should bridge the divide — ideally as a two-way street.
- **Inbox file:** `docs/research/inbox/designer-bridge-and-figma-seam.md`
- **Sub-claims surfaced, not vetted here:** the designer-onboarding brief (acted on — see below) and
  the seed-that-scales test (shipped v0.166.0; deserves its own pass if challenged).

## Attribution — SPLIT BY DIRECTION, and this is the whole finding

| Layer | Direction | Status |
|---|---|---|
| **Tokens** | code ⇄ design tool | ✅ **Verified mechanically sound.** The Variables API reads *and* writes; tokens are structured data with stable IDs. Real two-way. |
| **Components** | design → code | ✅ **Verified as a real product feature** (Code Connect returns import path + usage snippet). ⚠️ **Vendor-sourced** — *"the #1 way to get consistent component reuse"* is Figma marketing. Direction, not multiplier. |
| **Components** | code → editable design file | ❌ **DOES NOT VERIFY.** Sources were a **personal blog, a third-party community MCP, and a GitHub issue.** No vendor primary doc, no reproduction. "Round-trip validated end-to-end" is an unsupported claim. |

**"Two-way street" is one phrase covering three mechanisms of wildly different maturity** — and
collapsing them is how a founder ends up expecting round-trip magic and rebuilding by hand.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **#4 (stack-neutral) constrains the shape.** Figma is a vendor. BOSS may name the **standard** (DTCG) and the **seam** (the token layer); it must not make Figma the mechanism. Same rule as [[RVW-078]]'s shadcn refusal — consistent, and the consistency matters more than either call. |
| 2 | Evidence grade | **Verified for the token layer; vendor-grade for design→code; unevidenced for code→design.** The verdict follows the split exactly. |
| 3 | Duplicate or sharpen? | **Mostly already owned.** DTCG emission shipped long ago; the designer handoff shipped v0.169.0. The genuine contribution is **naming which direction actually works** — BOSS had the bridge and never said so. |
| 4 | Who serves / harms? | **Serves** founders who hire a designer (rare pre-PMF, real at V1) and `non-tech-founder` most, since they're likeliest to hire design early. **Harms nobody directly — but an unqualified "two-way" promise harms everyone**, because the rebuild lands after the money's spent. |
| 5 | Cost / ceremony | **Light.** Composition from artifacts that already exist. No new dependency, no integration to maintain. |

## Verdict: ADAPT

Ship the **seam**, refuse the **vendor**, and **be explicit about direction**. Tokens genuinely
round-trip and BOSS already emits DTCG — so the bridge largely existed and was never named. The
designer handoff composes from artifacts BOSS already generates. Neither needs a Figma integration.

**The code→editable-design round-trip is refused as unevidenced** and BOSS should not repeat it.
If a founder wants it, the honest answer is *"watch it work on your own components before you plan
around it."*

## If ADAPT — what changes
- **Keep** (shipped v0.169.0): the designer handoff in `/design-library`; the token seam described
  **generically** (DTCG, "your design tool's variables"), never as a Figma feature.
- **Recorded in [[IDEA-052]]:** a designer is the population its three-way split misses — someone
  who **joins the work** *and* **brings an interoperating tool.** Deliberately **not** built as
  `/brief designer`: that slice's gate (*no brief content without a real engagement*) is right for
  professionals-you-engage and doesn't apply to an artifact assembled from state BOSS already holds.
- **Refuse** any code→design round-trip guidance until a vendor primary doc or a witnessed run exists.

## Notes
- Prior related: [[RVW-078]] (the same name-the-rung-not-the-vendor call), [[RVW-081]].
- Nice symmetry worth keeping: **Code Connect exists because "without it, the model is guessing"** —
  the same disease as [[RVW-078]]'s registry finding, in a different ecosystem. A portable component
  index is the vendor-free half of the same cure.
- BOSS version when recorded: 0.171.0

## Correction note — 2026-09-13

The *Tokens · code ⇄ design tool · verified two-way* row is true **for Enterprise plans only**:
developers.figma.com/docs/rest-api/variables/ gates both reading and writing variables to the
Enterprise plan (read: "Any organization member … Enterprise"; write: "Full seats, admins …
Enterprise"). Native import of a DTCG JSON without a plugin is **unverified** (not on the variables
help page). For a founder on a free or professional plan the working path is a tokens plugin.
The verdict's shape stands — the token layer is still the only honest seam — but "two-way" needs
"for enterprises" after it in any shipped sentence. Found while drawing [[IDEA-107]]; the
integration list lives in [[IDEA-108]].
