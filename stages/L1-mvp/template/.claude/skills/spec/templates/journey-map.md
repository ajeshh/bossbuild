# `/spec` — the journey map (bundled resource)

> Loaded **on demand**. Write this to `docs/product/JOURNEY.md` the first time a FEAT with a
> user-facing surface names its flow. **One page for the whole product, written once and edited
> rarely** — it does not grow a section per feature, and if it starts to, that is the sign it has
> become a second copy of `docs/design/FLOWS.md`.

## Why this is not a section of the flow index

`FLOWS.md` holds **in-app sequences**: entry → steps → exit, one per flow, owned by a FEAT. That is
the right shape for *doing a thing in the product*, and it is structurally unable to hold the two
places users are most often lost — **before they ever sign up**, and **after they have succeeded
once and are deciding whether you are part of their week.**

A journey is the tier above. It is the arc a person travels from *first hearing about this* to
*being the kind of person who uses it*, and its job is to make the **gaps between flows** visible —
because that is where the product loses people and no single FEAT owns it.

**The tell that you need this file:** four skills are already standing on different parts of this
arc — `/landing` (they hear about it), `/onboard` (they reach value), `/measure` (do they come back),
`/health` (where the curve dies) — and until this file exists **none of them shares a map.** Each one
optimizes its own segment, which is exactly how a product ends up with a good landing page, a good
first run, and nobody in week three.

## Authored, for the same reason flows are

An AI review moves feedback and scannability; it moves **sequence** by almost nothing. No amount of
checking produces a journey nobody drew. So, like `FLOWS.md`, this is a **filter and not a
boundary**, and it is cheap on purpose — a table you can fill in one sitting, honestly.

> ⚠️ **Write it from what you actually know, and mark the rest.** A journey map invented at a desk
> is a story about a person who does not exist, and it is more dangerous than no map because it
> *looks* like research. Every stage gets a **source**: observed, said-in-an-interview, or assumed.
> An assumed row is fine — most of them start that way. An assumed row that stops being labelled is
> the failure mode.

```markdown
---
id: journey
type: product
owner: product-lead
status: active
updated: {{DATE}}
---

# The journey — {{PROJECT_NAME}}

> From first hearing about this to using it without thinking about it. **The gaps between the
> flows are the point.** One page; the detail lives in `docs/design/FLOWS.md` and the FEATs.

| # | Stage | What they're trying to do | What they meet | Serving flow | Where they leave | Source |
|---|---|---|---|---|---|---|
| 1 | Hear about it | work out if this is for them | the landing page | — (`/landing`) | it doesn't say what they'd get | assumed |
| 2 | Try it | see whether it works for their case | signup → first item | Signup → first project | signup asks too much too early | observed |
| 3 | First value | get one real thing done | the empty state | Signup → first project | nothing to look at, no example | observed |
| 4 | Come back | do it again, on their own work | re-entry, their data | — | they forgot it existed | assumed |
| 5 | Rely on it | make it part of the week | the thing they now expect | Invite a teammate | it broke once and nobody said sorry | assumed |

## The gaps

_The stages above with **no serving flow** and the ones whose "where they leave" has no owner.
This is the list this file exists to produce — it is usually short and usually uncomfortable._

- Stage 4 has no flow and no FEAT. Nothing in the product is responsible for a second session.

## Edge users

_Not edge **cases** — the three paths in each FEAT already cover those. These are **people** the
happy journey quietly assumes away. Name the ones that are real for this product; delete the rest
rather than answering them all._

| Who | Where the journey breaks for them | What we do about it |
|---|---|---|
| the user with no data yet | stage 3 — the whole product is empty | the magic first run (`/onboard`) |
| the user with 10,000 rows | stage 3 — the screen was designed for 5 | not yet decided |
| **the person who is not the buyer** | stage 5 — they can't approve the spend | not yet decided |
| someone using a screen reader | every stage | `/ux-check` accessibility pass |
| someone acting in bad faith | stage 2 — signup is the attack surface | `/red-team --paths` |

## What changed, and when

_Dated, append-only. A journey is a claim about people; when you learn they were doing something
else, the correction is the most valuable line on the page._

- {{DATE}} — first draft, mostly assumed.
```

## Rules

- **One page, for the product.** Not one per persona, not one per feature. If you genuinely serve
  two users with different arcs, that is a segments question, and it is bigger than this file.
- **Label every stage's source.** Observed > said > assumed. Unlabelled rows become "research" in
  about six weeks, to you as much as to anyone else.
- **The gaps section is the output.** A journey where every stage has a flow and an owner is
  either a finished product or a map drawn to look tidy.
- **Edge users are people, not error paths.** The FEAT's three paths own the code; this owns who the
  happy story was written without.
- **Edit it when you learn something, not on a schedule.** This is not a document you maintain —
  it is one you correct.
