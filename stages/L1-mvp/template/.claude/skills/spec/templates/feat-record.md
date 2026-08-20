# `/spec` — the FEAT record template (bundled resource)

> Loaded **on demand** from `SKILL.md`. Write this to `docs/ideas/FEAT-NNN-<slug>.md` —
> **the same folder as the ideas**, which is where `boss board` reads FEATs from. A FEAT written
> anywhere else is invisible to the board and to every skill that looks for one.
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

## Assumptions (v0.172.0+ — the plan-time record)
_Every place the spec was filled in **without being told**. One line each, phrased so it can be
rejected in a word. The founder corrects these before a line of code is written — and a correction
here is the highest-value sentence in this file, because it is precisely the thing a competent
reader got wrong._
- **Assumed:** … → _confirmed / corrected to: …_
- **Assumed:** … → _confirmed / corrected to: …_

**Still unknown (didn't guess):**
- …

## Acceptance criteria
_Checkable. A reader who's never seen the code should be able to verify these._
_Tick them as they land — `/close` does this, and `boss board` renders the fraction._
- [ ] …
- [ ] …
- [ ] …

## What "wrong" looks like
_The inverse of the criteria, and where most of the real ones come from: what would make you say
this is broken **even though it technically works**? Failure modes, not missing features._
- …

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

## Build log (v0.172.0+ — the feature's own story, append-only)
_This is the one place a feature's arc lives end-to-end. The devlog is per **session** and the
changelog is per **release**; a feature that lands across several of either has its story shattered
across them. This section is where it stays whole — appended each time a part lands, never rewritten._

**Write the decision and the surprise, not the narration.** What you chose and what you rejected;
what turned out not to be true. Those are the parts you genuinely cannot reconstruct in six weeks —
and the only parts worth reading later, whether the reader is you, a new collaborator, or whoever
writes the guide. **Nothing readable was ever mined from "then I did X."**

_The test: would you write this entry if nobody ever read it? If no, don't write it. An empty build
log at ship time is an honest signal that the feature was routine — never a checklist failure, and
never a reason to hold a ship._

- {{today}} — <what landed, and the decision or surprise behind it>
```
