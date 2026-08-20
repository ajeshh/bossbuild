---
name: ai-failure-states
description: Design what {{PROJECT_NAME}} does when the AI fails — the five failure states (garbage / refusal / hallucination / timeout / cost-spike) and the declared response for each. Names the UX *before* the failure happens, not after. Cohort-aware (first-product gets named patterns; eng-builder gets lint-anchored unhandled-path discipline; domain-expert gets humane-fallback when stakes are real). Run during /ai-first-init, or any time a FEAT puts an LLM in the user-facing path. Usage - /ai-failure-states
---

# /ai-failure-states — name the failure before the user finds it

Most AI-mediated apps ship the **happy path** and discover the **failure modes** in production.
The failure modes were always going to happen. What was missing was the *declared response* —
the UX answer for each, designed before the user encountered it.

This skill is the design step that costs an hour and saves the next ten. Five failure states.
One declared response per state. Cohort-aware delivery. Recorded in `docs/ai-failure-states.md`
so the next FEAT inherits the discipline.

## Step 0 — does it already exist, and is this the right rung?

**Look for designed AI failure states before you make one** — `docs/ai-failure-states.md`. If it's there: say so and stop
when it's fine (a complete outcome, not a failure to act), or name the *specific* gap and offer the
*specific* edit when it's behind. Never quietly generate a second one.

**Rung: MVP.** Applies only when the project makes its first LLM call. If this project is **earlier** than that, don't run this — and there is **no seam** worth planting, which is a complete answer rather than a gap: A failure-state design costs the same written later. The recoverable-only-now half is the specific weird output you saw and closed the tab on — that seam belongs to `evals`, and duplicating it here would be a second ask for the same habit.

## The five failure states

These are the failure modes that **always exist** in AI-mediated code. Naming each one + its
declared response IS the design. The skill walks you through each in order.

| # | Failure | What it looks like | Default declared response |
|---|---|---|---|
| 1 | **Garbage output** | Model returns nonsense, malformed JSON, off-topic prose, content that violates the schema. | Reject + retry once with a "be more careful" preamble; on second failure, surface the structured-error UI. |
| 2 | **Refusal** | Model refuses ("I can't help with that"), gives an over-cautious non-answer, returns a safety-template. | Detect refusal patterns; route to a human-handoff or a deterministic fallback. Don't loop on the same prompt. |
| 3 | **Hallucination** | Model returns confidently-wrong content (made-up citations, invented APIs, fabricated facts). | If the FEAT depends on factual accuracy: add a verification step (citation lookup, schema validation, second-pass cross-check); if not, lower the temperature + tighten the prompt. |
| 4 | **Timeout / network failure** | The call hangs, the network drops, the provider returns 5xx. | Hard timeout (declared per call site); on timeout, return the *last-known-good* result, a graceful degradation, or a queued retry — never the spinner-forever. |
| 5 | **Cost spike** | A request consumes 10x the expected tokens (long input, runaway output, prompt injection eating context). | Per-call token cap (input AND output); on cap-hit, truncate gracefully with a labeled response ("this answer was capped at N tokens — refine your question or upgrade"). |

Other failure modes exist (rate-limit, model deprecation, eval regression, etc.) but these five
are the **load-bearing** ones — every AI-mediated FEAT has all five. Design responses for each.

## When to run it

- During `/ai-first-init` — the conductor calls this as step 5.
- Before any FEAT that puts an LLM call in the user-visible path ships (acceptance criteria
  should reference the failure-state response, not assume the happy path).
- When the `ai-failure-state-loop` opens — the conscience surfaces a `failure-mode` moment
  saying *"the code calls an LLM but no failure-states doc exists; what does the UI do when
  the model fails?"*
- After a real-production failure surprise — codify the new failure mode here so the next
  FEAT inherits the answer.

## How to run it

### 1. Read the cohort + the project's AI-first declaration

Read `cohort` from `.boss/config.json`. If `docs/ai-first.md` exists, read it — it names what's
AI-mediated in this project (decides which failure states warrant the most design).

### 2. Walk the founder through each failure state

For each of the five, ask **two questions**:
- **What does it look like in this project?** (Concrete, not abstract — "the user asked for
  a recipe and got a wall of unrelated text" beats "garbage output.")
- **What does the UI do?** (Concrete — "show the structured-error card with a retry button"
  beats "handle gracefully.")

Cohort-aware delivery:
- **`first-product`**: walk through each with a named example. Don't assume they know what
  hallucination looks like in practice. Show the pattern, then ask them to declare.
- **`vibe-coder-newbie`**: similar — patterns over abstractions. Cite "this is the thing
  where Claude makes up citations" not "epistemic failure mode #3."
- **`non-tech-founder`**: plain language. Each failure described as *"the user sees X; the
  app should do Y."*
- **`eng-builder`**: terse + inspectable. Hand them the table; they'll declare the responses
  in a paragraph. They'll likely add their own (e.g., "model deprecation = pin model
  version + feature flag for swap").
- **`vibe-virtuoso`**: ship a starter declaration in one pass; they'll edit. Don't coach.
- **`indie-hacker`**: frame failure as **cost-of-an-unhappy-customer**. Each declared
  response is a calm-company artifact (no panic UX; calibrated degradation).
- **`returning-founder`**: skip the 101. *"You've seen these — what's your declared
  response for each in this project?"*
- **`domain-expert`**: stakes are real. For **hallucination** in medical/legal/financial
  contexts: **the declared response is almost always a human-in-the-loop, not a retry.** For
  **refusal**: the route to a human escalation has to exist *as a first-class UI path,* not a
  fallback. Cite the regulatory frame in the doc itself.

### 3. Write `docs/ai-failure-states.md`

Skeleton: **[`templates/failure-states-doc.md`](templates/failure-states-doc.md)**.

The field that does the work is **Eval-tested** on each state — an eval case id, or the literal
`STUB`. A declared response nobody tested is a wish; naming the case (or admitting `STUB`) is what
makes it a contract.

### 4. Wire the fallback handlers in code (or stub them)

For each failure state, add at minimum a **stub handler** in the code path that wraps the LLM
call. This satisfies the `ai-failure-state-loop` exit predicate AND prevents the
forgot-to-handle-this regression.

```typescript
// src/lib/ai-handlers.ts — stubs for the five declared responses
export function handleGarbageResponse(raw: string, retry: () => Promise<unknown>) {
  // 1. Validate against schema (Liu discipline). If invalid: retry once with stricter prompt.
  // 2. On second failure: return structured error for the UI.
  throw new Error('TODO: implement per docs/ai-failure-states.md §1');
}

export function handleRefusal(modelText: string) { /* ... */ }
export function handleHallucination(...) { /* ... */ }
export function handleTimeout(...) { /* ... */ }
export function handleCostSpike(...) { /* ... */ }
```

The stubs exist so the founder *cannot forget*. The loop's exit predicate scans for these
handler names — if they exist (even as stubs), the loop closes. The discipline is that the
declaration exists *before* the FEAT ships; the implementation can happen incrementally.

### 5. Update existing AI-mediated FEAT specs

For each `docs/ideas/FEAT-NNN.md` that puts an LLM in the user-visible path:
- Add a **Failure states** section to the spec (the v0.26 `/spec` upgrade adds this field
  automatically for new FEATs).
- Reference the declared response from `docs/ai-failure-states.md`.
- Update **Acceptance criteria** to include at least one failure-state path (e.g., *"refusal
  routes to /support, not the spinner"*).

## The copy nobody reviewed (added v0.168.0)

Every failure state above ends in **words a user reads**, and those words are the least-reviewed
copy in an AI product. A designed failure state with default copy is only half designed — the founder
specified the *behavior* and let the model write the *sentence*.

Four surfaces that reach users and usually pass through no review at all:

| Surface | What ships if nobody decides | What it should do |
|---|---|---|
| **Refusal / hedge** | the model's stock decline, in the model's voice | say what it *won't* do and what the user *can* do instead |
| **Retry / rate limit** | *"Something went wrong. Try again."* | say whether waiting helps, and how long |
| **Streaming / latency** | a bare spinner | say what's happening if it's slow enough to worry about |
| **Pre-action confirm** | *"Are you sure?"* | name the consequence — what changes, and whether it's reversible |

**This is where the model's default voice does the most damage**, because it lands in the moments a
user is already frustrated — and it's the moment the product sounds least like itself. It is also the
copy no content review catches, because it isn't in the codebase as a string: it's generated at
runtime from a system prompt somebody wrote once.

**So the system prompt is product copy.** Write it against `STYLE_GUIDE.md`'s voice traits and
terminology table, the same as a button label. If the style guide says the product says *team*, a
system prompt that says *workspace* ships an inconsistency the terminology guard structurally cannot
see — it never appears as a literal in your source.

For each failure state, write the actual string, not a description of it. *"Tell them it failed"* is
not a decision; *"That's longer than I can read in one go — try under 50 pages."* is.

## Connection to other loops

- **Upstream:** `cost-budget-loop` closed (budget exists; cost-spike has a number to compare
  against). `/evals` running (eval set categorizes failure modes per Husain).
- **Same loop:** `ai-failure-state-loop` — opens when LLM call sites exist without a
  declared failure-states doc + at least one handler reference at the call site.
- **Downstream:** Structured outputs (Liu) — each declared response often *depends* on the
  output being schema-validated; if you haven't declared a schema, garbage detection is
  guesswork.

## What this skill is NOT

- **Not a UI library.** It declares the *response*, not the visual. The visual lives in your
  component library / design tokens.
- **Not a substitute for evals.** Evals catch the failures; the failure-states doc *names what
  to do* when they happen. Both are required.
- **Not a guarantee.** Designing the response doesn't mean it works on first try; it means
  the next FEAT inherits a starting point + the override grammar tells you when you skipped.

## Rules

- **Name the five.** Each AI-mediated FEAT has all five failure modes. Pretending one doesn't
  apply is the bug that produces the spinner-forever / silent-fail / wallet-drain bug a month
  later.
- **Concrete over abstract.** *"Show the structured-error card with retry"* beats *"handle
  gracefully."* If you can't name what the UI does, you haven't designed it.
- **Stubs over nothing — but not stubs forever.** A `handleHallucination()` that throws
  *"TODO: implement per §3"* is better than no function at all — it satisfies the loop AND
  prevents the silent regression. **But:** the `Eval-tested` field is what turns a stub
  into a contract. If you've shipped a stub, you've also committed to writing the eval case
  that will eventually exercise it — OR to recording the override per IDEA-008 with a
  re-open condition (v0.30.0+).
- **Domain-expert exception.** In high-stakes domains, the declared response for hallucination
  is **almost never a retry** — it's a human-in-the-loop escalation. Don't design AI-as-final-
  answer in regulated contexts.
- **Override is legitimate.** Skip a state when the founder has a real reason (dev-only
  feature; no user-facing path). Record the override in devlog per IDEA-008.
- **The doc is a living artifact.** When a new failure mode shows up in production, add it as
  a sixth (and seventh, etc.) — the five are the floor, not the ceiling.
- **Write the string, not a description of the string.** Every failure state ends in words a user
  reads. *"Handle it gracefully"* leaves the sentence to the model, and the model writes the mean.
- **The system prompt is product copy.** It's the one user-facing text that never appears as a
  literal in your source, so no check will ever catch it. Review it against the style guide's voice
  and terminology by hand, or it drifts silently forever.
