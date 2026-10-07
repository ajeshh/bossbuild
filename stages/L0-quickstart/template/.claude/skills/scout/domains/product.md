---
domain: product
for: how others solved a flow, what good looks like, and what users of similar products expect
kinds: flow <name> · references <screen or pattern> · benchmark <feature>
open_first: the product itself (sign up, click through), its help docs and changelog, then pattern libraries and design systems that publish their reasoning
verify_by: look at the thing — a screenshot you took with its date beats any description of it
lands: docs/research/product/ (commits); a rival's flow goes in its docs/competition/<slug>.md under `## How they do it` (local)
ages: months — products redesign
sensitive_when: it's a rival's (stays with the rival, local); anything behind a login you were given access to
---

# `/scout product` — how others solved it

**Read this after you've decided what to build, never to decide it.** How a rival does a feature is
design reference for a spec you've already chosen; read before the decision it becomes the parity
trap — building their feature list. If the feature isn't decided, say so and point at the canvas
instead.

- **`flow <name>`** — the steps, in order, the defaults (what happens if the user does nothing),
  what's asked vs done automatically, the limits, and where people get stuck (their help articles
  exist because people got stuck there). Three to five products, not a catalogue.
- **`references`** — pattern libraries and design systems that explain *why*, not galleries of
  pretty screens. A pattern with its reasoning transfers; a screenshot rarely does.
- **`benchmark <feature>`** — what users of similar products now expect as normal. Read 4–5★ reviews
  here, and only here: *"I love that it just…"* is the bar your version will be measured against.
- **Where it goes next:** `/spec` reads `docs/research/product/` when it writes a feature's flow.
