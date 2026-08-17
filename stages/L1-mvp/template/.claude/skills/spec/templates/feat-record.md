# `/spec` — the FEAT record template (bundled resource)

> Loaded **on demand** from `SKILL.md`. Write this to `docs/features/FEAT-NNN-<slug>.md`.
> The Evals and Failure-states sections apply **only** to FEATs with an LLM in the control flow —
> omit them entirely otherwise rather than filling them with `n/a`.

```markdown
---
id: FEAT-NNN
type: feature
owner: pm
status: building
created: {{today}}
building_since: {{today}}
source: IDEA-NNN
---

# <Feature name — one plain line, present tense>

## Goal
_One sentence. The user-visible change. Not the implementation._

## Acceptance criteria
_Checkable. A reader who's never seen the code should be able to verify these._
- [ ] …
- [ ] …
- [ ] …

## Smoke check
_How `/smoke` proves this didn't break things. One or two commands, or one manual path._
- …

## Validated learning (v0.21.0+ — Ries discipline)
_If this FEAT works perfectly, **what do we learn**? Not "the feature works" — what does it teach
us about the bet that we didn't already know? If the answer is "the feature works" or "users like
it," **don't build this**. The MVP is the minimum experiment that produces validated learning, not
the minimum product to polish (Eric Ries, **The Lean Startup**). Smallest cut, highest leverage._
- **Learning hypothesis:** …
- **What result would change the plan:** …

## Evals (v0.21.0+ — for AI-mediated FEATs only)
_If this FEAT involves an LLM call in control flow, name the eval set this FEAT ships against. See
`/evals` skill + the conscience-evals pattern. Failure modes categorized (Husain discipline)._
- Eval set path: `docs/evals/FEAT-NNN.yml` _(or omit this section if no LLM in control flow)_

## Failure states (v0.26.0+ — for AI-mediated FEATs only)
_If this FEAT puts an LLM in the user-visible path, name which of the five failure states it
must handle (per `docs/ai-failure-states.md`). At minimum: which fallback handler is called for
each applicable state. See `/ai-failure-states` skill._
- **Garbage output:** <declared response in this FEAT — e.g., schema-validate; on fail call `handleGarbageResponse()`>
- **Refusal:** <e.g., detect refusal pattern; route to /support; never loop>
- **Hallucination:** <e.g., verify citations against database; if low confidence, surface "double-check" UI>
- **Timeout:** <e.g., 8s hard cap; on timeout return last-known-good with `handleTimeout()` annotation>
- **Cost spike:** <e.g., 4k input cap / 1k output cap; on cap return labeled-truncated result>

_Omit this section if no LLM in user-visible path. Acceptance criteria above should reference
at least one failure-state path (e.g., "refusal routes to /support, not the spinner")._

## Out of scope
_What this FEAT explicitly does NOT do. Future FEATs may; this one doesn't._
- …

## Notes
_Open questions, links to the idea/canvas, anything the builder needs._
- Source idea: [IDEA-NNN](IDEA-NNN-<slug>.md)
- Canvas (if any): [IDEA-NNN-canvas.md](IDEA-NNN-canvas.md)
```
