# `/spec` — model or code (bundled resource)

> Loaded **on demand** from `SKILL.md`, before the first model call in a FEAT.

Before the first LLM call in a FEAT, fill its **Model or code** section: which step genuinely needs the
model, and which stays deterministic. The instinct is to route everything through the model; every
step kept in code is one that can't hallucinate, and costs nothing per call. The rungs, lowest first:
a script on a schedule → a fixed path with one schema'd model *step* → an agent loop → several agents.
**Climb on a failure you actually hit, never one you anticipate** (`boss craft automation`).

Then the three that make a model step safe to ship, each its own verb: an eval set before it ships
(`/evals` — five cases beat none), a declared response to each failure state (`/ai-failure-states`),
and a budget with a logger (`/ai-cost`). For the output shape, reach for the provider's **native
strict structured output** first; keep Zod/Pydantic for ranges, enums and cross-field rules. If the
step reads untrusted input *and* can reach private data *and* can act, that's the lethal trifecta —
remove one leg (`boss craft agent-security`).
