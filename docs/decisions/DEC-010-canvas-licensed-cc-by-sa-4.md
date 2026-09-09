---
id: DEC-010
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-08-21
reversibility: one-way (loosening stays possible; revocation never does)
revisit_by: 2027-02-21
---

# DEC-010 — The Humane Product Canvas is published CC BY-SA 4.0

> The one irreversible bit flagged in IDEA-068
> and shipped in v0.198.0. Ajesh, asked directly before the site deploys: *"sa 4.0 is great."*

## Context

v0.198.0 published the canvas as a free standalone artifact — a page plus a Markdown template. The
attribution question was settled first (IDEA-068: sole authorship, confirmed directly). **The
licence was the remaining one-way door**, and BOSS's own `/boss` skill states the principle it turns
on: *"a permissive open-source grant, once published, cannot be revoked."*

The site is not deployed yet, so this was decided **before** the grant becomes real rather than after.

## Decision

**The Humane Product Canvas is licensed CC BY-SA 4.0** — attribution required, adaptations shared
under the same terms, commercial use permitted.

## Why

- **Precedent, and it is the whole field.** The [Lean Canvas](https://leanstack.com/lean-canvas) and
  the [Business Model Canvas](https://www.strategyzer.com/library/the-business-model-canvas) are both
  CC BY-SA. A humane canvas published under stricter terms than the two frameworks it sits beside
  would be conspicuous in exactly the wrong way.
- 🔴 **It is the reversible-in-the-useful-direction choice, and this is the load-bearing reason.**
  As sole copyright holder Ajesh can *always* offer the same work under a more permissive licence
  later — BY-SA → BY is a loosening, available any day. What no licence choice can do is **claw back
  copies already distributed.** So of the two credible open options, **BY-SA preserves optionality and
  BY spends it.** This is the same argument `/boss` uses to default a founder's project to
  proprietary, applied one notch along the same axis: *start at the tighter end of the acceptable
  range, because you can move outward and never back.*
- **Share-alike is the point, not a hedge.** The canvas's value is that adaptations exist — a version
  for regulated domains, for research, for classrooms. SA means those come back to the commons rather
  than being enclosed. A framework whose derivatives can be closed loses the thing that made
  publishing it worthwhile.
- **Commercial use is deliberately allowed.** NC would block consultancies, accelerators and
  educators — precisely the people who spread a canvas — and would have been the wrong trade.
- **It is consistent with what BOSS just shipped.** v0.195.0 stopped assuming every project is a
  business and made room for Creative Commons work. Licensing its own canvas CC is BOSS doing that
  rather than recommending it.

## Falsifier

*What would prove this wrong, and by when?*

1. **Share-alike blocks real adoption.** If, across **n ≥ 2 concrete cases**, someone who wants to use
   the canvas properly is stopped by SA — a company whose legal team refuses SA material in internal
   docs, a publisher who cannot take it — then SA is costing more reach than it buys, and offering it
   additionally under BY is the fix. **That remedy stays available forever**, which is why this is a
   soft falsifier rather than a hard one.
2. **No adaptations ever appear.** SA's entire justification is that derivatives return to the
   commons. If by `revisit_by` nobody has adapted it at all, SA is protecting a commons of one and is
   pure friction.

**Check at `revisit_by` 2027-02-21, or on the second occurrence of either.**

## Consequences

- **`web/canvas.html` and `web/humane-product-canvas.md` both carry the licence and the byline.** Any
  future copy must too — that is what BY requires of everyone including us.
- **The grant becomes real at deploy, not now.** Until the site is live this is still changeable.
  After that, only loosening is available.
- ⚠️ **BOSS's own repo is MIT and the canvas is CC BY-SA — deliberately different, and not a
  mistake.** MIT is a software licence and fits a CLI; CC BY-SA is a content licence and fits a
  framework. Recorded because a future reader will notice the mismatch and should find the reason
  rather than "fix" it.
