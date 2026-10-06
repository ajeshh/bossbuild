---
id: FEAT-007
type: feature
owner: product-lead
status: shipped
gist: Draft the ask — when a visit is uncovered, a model drafts the text to each of the three carers in the owner's words; she reads it, edits if she likes, and asks.
for: marta
created: 2026-09-12
shipped_on: 2026-09-19
from: IDEA-001
program: PROG-001
---

# Draft the ask

## Goal
The ask a carer gets reads like the owner wrote it, so the owner stops sending her own text after ours.

> "Sunday, ten to seven. Jo texts she's poorly, can't do the 9 o'clock in Church End tomorrow. I tap
> Ask on the visit and there it is: 'Evening Priya, could you take a visit tomorrow at 9 in Church
> End?' That's what I'd have written. I tap Ask. Priya says yes at five past." — Marta

## Assumptions (the plan-time record)
- **Assumed:** the draft goes straight out, to keep the cover flow one tap → _corrected to: "Nothing
  goes out in my name that I haven't seen. One look, then Ask."_
- **Assumed:** the model could use the client's first name to make the text warmer → _corrected to:
  "Priya sees Mrs H's name on the card when she opens it. The model never gets it." (DEC-005)_
- **Assumed:** a "write it again" button for a draft she doesn't like → _corrected to: "If it's wrong
  I'll fix it myself. Three seconds."_ Cut, see Flow.
- **Assumed:** the draft goes only to the three carers the cover flow already picks → _confirmed._

**Still unknown (didn't guess):**
- Whether carers answer a drafted ask faster than the template. Nine agencies is too few to time it.
- Whether owners will want a say in the tone (brief, or chattier). Nobody has asked yet.

## Acceptance criteria
- [x] Tapping Ask on an uncovered visit shows one draft per carer, each naming only that carer, in under 4 seconds.
- [x] Every draft is editable, and nothing sends until the owner taps Ask on the draft sheet.
- [x] The prompt carries the visit's day, time and area and the three carers' first names, and nothing
      else: no client name, address or care note (DEC-005; `feat-007-fail-010`).
- [x] On any model failure the plain template ask fills the same sheet and says "The usual wording
      this time." The owner's next tap is the same Ask (`docs/ai-failure-states.md`).
- [x] A draft made after 8pm queues like any ask and the sheet says "Goes out at 6:30." (PROG-001).
- [x] The eval set passes before it ships: 14 cases on 2026-09-18, pass^2 on the five that call the model.

## What "wrong" looks like
- A carer reads their text and can see who else was asked. That's the league table DEC-003 refused, made by a sentence.
- The draft says something we never told it: "a quick 30-minute one", "near the school". A carer
  plans their morning on a detail the model made up.
- The draft leans: "we're really stuck", "sorry to ask again". PROG-001 says no guilt. A model is
  very good at guilt.
- The owner spends longer reading and fixing the draft than she spent writing her own text.

## Paths that must not break (rungs 2–4 of the testing ladder)
- **Money path:** the ask is the core action, and it must go out when the model doesn't. Tested for
  real with `ASK_MODEL` unset and with the provider unreachable: the template fills the sheet, Ask sends it.
- **Destructive path:** this sends a text in the owner's name. Human gate: the Ask tap on the draft
  sheet. Test: a draft comes back, nobody taps, and the send queue stays empty.
- **Negative path:** Priya's text never names Sam or Dee (`feat-007-pass-003`). The model provider
  never receives a client's name, address or care note (`feat-007-fail-010`, run on every eval run).

## Flow (only if this FEAT has a user-facing surface)

Indexed in `docs/design/FLOWS.md`.

| # | Step | Asks the user for | Why it's needed *now* |
|---|---|---|---|
| 1 | Ask, on the uncovered visit's row | the tap she already makes | it's the act that starts cover; unchanged from FEAT-001 |
| 2 | The draft sheet: three short texts, one per carer | a read, an edit if she wants one | the text goes out in her name |
| 3 | Ask, on the sheet | one tap | the human gate on a send |

**Cut**

| Cut | Why |
|---|---|
| Send the draft without showing it | a text in her name she hasn't read; the destructive path's gate |
| "Write it again" | editing is faster than a reroll, and a reroll means paying more when the draft works less |
| A tone picker on each ask | a choice at 7:40 on a Monday; if owners ask for it, it's one setting, once |

- **First-run path** — an owner's first ask gets the same draft. The model sees no history, so
  there is nothing to learn first and nothing to be empty.
- **Failure path** — the template ask fills the sheet with "The usual wording this time." above it.
  She keeps everything, and Ask works the same.

## Data shape
- Two booleans on the existing ask row: `drafted` (the text came from the model, so this row is
  model-generated) and `edited` (the owner changed it before asking). No draft text is kept beyond
  the ask text FEAT-001 already stores. Reversible: two nullable columns.

## Smoke check
- With `ASK_MODEL` unset, tap Ask on a test visit: the template ask appears in under a second and the
  sheet says "The usual wording this time."
- Build a prompt from a test visit row that carries a client name, address and note. None of the three
  appears in it.

## Validated learning (Ries discipline)
- **Learning hypothesis:** owners send their own follow-up text because ours reads like a system, not
  because they don't trust it. A draft in their words ends the follow-up.
- **What result would change the plan:** if at the 2026-10-03 check-ins owners still say they text
  after ours, the voice wasn't the reason. Unset `ASK_MODEL`, go back to the template, and ask them what is.

## Model or code (for AI-mediated FEATs only)
- **Model does:** writes one short sentence per carer, given four fields. That's all.
- **Code does (and why):** picks the three carers (FEAT-001, deterministic), phrases the time
  ("tomorrow at 9", PROG-001 C1), builds the prompt from the four-field allowlist (DEC-005), adds
  the owner's sign-off and the answer link, checks every draft (schema, length, names, numbers,
  the no-guilt word list), and holds the send for the owner's tap. Each of those could go wrong in a
  model, and none of them needs one.

## Evals (for AI-mediated FEATs only)
- Eval set path: `docs/evals/FEAT-007.yml`

## Failure states (for AI-mediated FEATs only)
- **Garbage output:** schema-check the reply; retry once; then the template (`handleGarbageResponse()`).
- **Refusal:** no retry; the template (`handleRefusal()`).
- **Hallucination:** a draft that names a carer we didn't give it, or a number that isn't in the time,
  is discarded; the template (`handleHallucination()`).
- **Timeout:** 4-second cap; the template (`handleTimeout()`). The sheet never spins.
- **Cost spike:** 1,200 tokens in, 200 out. Over the input cap we don't call; at the output cap the
  reply is discarded; the template (`handleCostSpike()`).

## Out of scope
- Drafting the owner's confirm, the "it's covered" message, or anything a carer sends.
- Learning an owner's voice from her past texts. Those carry clients' names (DEC-005).
- A tone setting.

## Notes
- Source idea: [IDEA-001](IDEA-001-kettlewick.md)
- Canvas: [IDEA-001-canvas.md](IDEA-001-canvas.md)
- Decision: [DEC-005](../decisions/DEC-005-the-model-never-sees-a-client.md)
- Budget: `docs/ai-cost-budget.md` · failure states: `docs/ai-failure-states.md`

## Build log
- 2026-09-12 — specced from the two-week check-ins: five of nine owners said they text their carers
  after Kettlewick's ask "so they know it's me". The template was doing the job and losing the voice.
- 2026-09-13 — DEC-005 before a line of the prompt: four fields, no client. The warmer draft would
  have needed the client's name, and the card already shows it.
- 2026-09-16 — the first dev drafts invented a visit length ("a quick 30-minute one") and leaned on
  one carer ("we're really stuck"). Both went into `docs/evals/seen/` and became cases; the number
  check and the no-guilt word list came from them.
- 2026-09-18 — eval run: 14 of 14, pass^2 on the five model cases. Shipped to the nine owners the next morning.
- 2026-09-24 — first week: 22 asks, 20 drafts shown, 2 fell back to the template (one timeout, one
  reply cut off at the output cap). Owners edited 6 of the 20 and sent 14 as drafted. The cut-off
  reply became `feat-007-fail-008`.
