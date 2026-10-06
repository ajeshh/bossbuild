---
id: ai-failure-states
type: design-decisions
owner: product-lead
status: declared
updated: 2026-09-24
---

# AI failure states — Kettlewick

## Cohort + context
- Cohort: non-tech-founder
- AI-mediated surfaces: one. FEAT-007 drafts the ask to three carers (`src/ask/draft.ts`). The model
  writes a sentence per carer; code does everything else.
- Stakes: moderate. A bad draft can't cover the wrong visit, because the owner confirms every fill
  (FEAT-001). It can mislead a carer about a visit, or lean on them, in the owner's name. The client
  is never in the prompt (DEC-005), so no failure here can leak one.

**The one rule under all five:** every failure ends in the template ask, the plain wording the app
sent before FEAT-007, in the same sheet, with the same Ask button. The owner never waits on the model
and never sees why it failed. She sees one line:

> The usual wording this time.

The template, per carer: `{first name}, can you take a visit {when} in {area}? Yes or no here: {link} — {owner}`

## The five failure states

### 1. Garbage output
- **Looks like:** the reply isn't `{ asks: [{ carer, text }] }`, or a text is empty, or longer than
  300 characters (two text messages), or there aren't exactly three.
- **Declared response:** retry once with the same four fields and a stricter instruction. If the
  second reply fails too, the template. The sheet shows a draft or the template inside 4 seconds
  either way; the retry shares that budget.
- **Fallback handler:** `handleGarbageResponse()` in `src/lib/ai-handlers.ts`
- **Eval-tested:** `feat-007-fail-001`, `feat-007-fail-002`

### 2. Refusal
- **Looks like:** the provider's refusal stop reason, or a text that starts "I can't" / "I'm not
  able". Most likely on a word in an area name that trips a filter.
- **Declared response:** no retry. The same prompt gets the same answer. The template, and a line in
  the app log with the area name so Ola can see whether it repeats.
- **Fallback handler:** `handleRefusal()`
- **Eval-tested:** `feat-007-fail-003`

### 3. Hallucination
- **Looks like:** the draft says something we never told it. It gives a length ("a quick 30-minute
  one"), a reason ("Jo's off sick"), a carer we didn't name, or a client. The model knows four
  fields, so anything beyond them is made up.
- **Declared response:** checked in code, not trusted. Each text must name its own carer and no
  other, contain no number that isn't in the time, and contain no capitalised name that isn't the
  carer, the area, or a day. A failed draft is discarded with no retry, and the template goes out.
  A made-up detail is worse than plain wording.
- **Fallback handler:** `handleHallucination()`
- **Eval-tested:** `feat-007-fail-004`, `feat-007-fail-005`

### 4. Timeout / network failure
- **Looks like:** it's 7:40, the owner taps Ask, and the provider is slow or down.
- **Declared response:** the template at 4 seconds, whatever the provider is doing. No spinner past
  that, no "try again" button. Nothing is queued to redraft later, because the ask is already in
  her hands.
- **Hard timeout (ms):** 4000
- **Fallback handler:** `handleTimeout()`
- **Eval-tested:** `feat-007-fail-006`

### 5. Cost spike
- **Looks like:** a prompt far bigger than four fields. That would mean the prompt builder took
  more than it should, such as a mis-imported carer list with forty names, which is also a DEC-005
  question. Or a reply that runs on.
- **Declared response:** over the input cap, no call; the template, and a loud line in the app log,
  because a big prompt here means the allowlist broke. At the output cap the reply is cut off, fails
  the schema check, and the template goes out.
- **Per-call token cap (in / out):** 1,200 / 200 (a real prompt is about 450 / 85)
- **Fallback handler:** `handleCostSpike()`
- **Eval-tested:** `feat-007-fail-007`, `feat-007-fail-008` (added 2026-09-24 from the cost review: one live reply hit the output cap on 2026-09-22 and fell back as declared)

### 6. Pressure (our own sixth)
- **Looks like:** the draft leans on the carer: "we're really stuck", "sorry to ask again", "urgent". The
  first dev drafts did exactly this (`docs/evals/seen/`). PROG-001 says no guilt, and a model reaches
  for it because that's how most cover texts in the world are written.
- **Declared response:** a short word list checked in code. A hit discards the draft and the template
  goes out. The prompt says it too, but the check is what holds it.
- **Fallback handler:** `handleHallucination()` (the same discard path, reason `pressure`)
- **Eval-tested:** `feat-007-fail-009`

## Verification cadence
- Eval set covers each failure state: yes. `docs/evals/FEAT-007.yml` has at least one `should-fail`
  case per state, and the five handlers are exercised with a stubbed provider, so those cases cost nothing.
- Production telemetry: every fallback writes one line to the app log (the reason, the agency id, no
  text). The weekly cost review reads the ledger. Until the timeout line lands (REVIEW-2026-09-24),
  timeouts show only in the app log.
- Review cadence: weekly during MVP, with the cost review.

## Override grammar
No state is a STUB, and no override is recorded. If one is ever kept as a stub, it goes in
`docs/devlog.md`:
- **OVERRIDE:** kept <failure-state-N> as STUB on <date> — rationale: <why; the re-open condition>.
