---
name: ai-first-init
description: Bake the AI-first discipline into {{PROJECT_NAME}} from day one. Conductor skill — walks the founder through declaring what's AI-mediated (docs/ai-first.md), seeding structured outputs (Liu — docs/schemas/), running the eval set early (Husain — /evals), declaring the cost budget upfront (/ai-cost), and designing failure states before they happen (/ai-failure-states). The "from day one" sequence. Cohort-aware. Run during MVP unlock for AI-native projects, or any time the project becomes AI-mediated. Usage - /ai-first-init
---

# /ai-first-init — bake the AI-first discipline upfront

Most AI-mediated apps bolt on discipline after a surprise. Cost budget after the bill. Eval
set after the bug report. Failure-states after the production incident. Structured outputs
after the third schema-violation bug. This skill is the upfront sequence: declare the
discipline *before* shipping the first user-visible LLM call, so the next FEAT inherits a
spine instead of inventing one under pressure.

It's the move that earns BOSS its name. Cursor + a folder is "AI-native." BOSS + this skill
is *"AI-first with discipline from day one."*

## What "AI-first" means here

A project is **AI-first** when the model is *load-bearing* — the product doesn't work without
it. Not "we have a chat feature." Not "we use Claude to summarize." AI-first means:

- The core value proposition depends on the model behaving correctly.
- Failure modes (garbage / refusal / hallucination / timeout / cost-spike) are user-visible.
- Unit economics live or die on token math.
- The "engineering" task is half prompt design, half eval design, half schema discipline.
  (Yes, that's 1.5 — the AI part *crowds out* deterministic work.)

If you're using AI as a feature inside a non-AI app, you may not need this whole sequence —
run pieces (`/ai-cost` for sure; `/evals` for any LLM in control flow). If you're building
something the model can't be removed from, run this whole skill.

## The five-step AI-first sequence

This skill is the **conductor**. Each step calls a sub-skill or writes a doc. The founder
runs them in order; the skill keeps state in `docs/ai-first.md`.

### Step 1 — Declare what's AI-mediated

Write `docs/ai-first.md` with the founder's answer to four questions:
- **What's AI-mediated?** Which features depend on the model.
- **What's deterministic?** Which features explicitly DON'T touch the model (and why —
  keeping a deterministic core is usually correct).
- **What's the load-bearing model decision?** Which model, which version, what would change
  if it got swapped.
- **What's the cost shape?** Order-of-magnitude tokens per user-action; whether this is
  a per-user-day or per-action cost model.

Template: **[`templates/ai-first-declaration.md`](templates/ai-first-declaration.md)**.

The hardest line to fill honestly is *what stays deterministic* — the instinct is to route everything
through the model. Every row on that side is a row that can't hallucinate.


### Step 2 — Seed structured outputs (Liu)

Free-form prose is for human eyeballs only. If the LLM output drives subsequent code (control
flow, data routing, decisions), **schema it**. Pydantic-first / Zod-first / any-structured-
output. Single practice that eliminates ~80% of LLM-pipeline brittleness.

Create `docs/schemas/` with one starter file per AI-mediated feature:

```typescript
// docs/schemas/feature-name.schema.ts (or .py for Pydantic)
import { z } from 'zod';

export const FeatureOutputSchema = z.object({
  // Define the strict shape the model is expected to return.
  // Validation at runtime; tests against this schema in evals.
  result: z.string(),
  confidence: z.number().min(0).max(1),
  // ...
});

export type FeatureOutput = z.infer<typeof FeatureOutputSchema>;
```

The schema becomes the **contract** between the model and the rest of the code. Evals assert
on the schema; failure-state handler #1 (garbage) IS schema-validation-failure.

**2026 update — native strict outputs first.** All three major providers (including Anthropic) now ship
**native strict structured outputs / strict tool-use** — constrained decoding compiles your schema to a grammar
the model literally *cannot* violate (a mathematical guarantee, >99.8% conformance). So on current models the
"re-prompt until it parses" reask loop is obsolete: reach for the provider's native `output_format` / `strict:
true` first. Keep Pydantic/Zod for what native strict can't express — *typed + semantic* validation (ranges,
enums, cross-field rules) and provider-portability. Net: "get valid JSON" is a solved provider feature; "get
*correct* data" is still your eval set's job. (And if a feature needs external tools, **MCP is the durable
cross-vendor standard** now — see `boss craft mcp` for the consume/expose/build decision before you
wire one in.)

### Step 3 — Seed the eval set early (Husain)

Don't wait for production. Run `/evals --new <feature-name>` (creates `docs/evals/FEAT-NNN.yml`)
for each AI-mediated feature in step 1. Even 5 cases per feature beats 0. Categorize:
should-pass / should-fail-by-mode (hallucinates / refuses-wrongly / format-violation / over-
applies / etc.).

Set the eval as a **gate before shipping the FEAT**, not retrofitted after. The MVP rule:
*"20 examples beats 0."*

### Step 4 — Declare the cost budget (`/ai-cost`)

Run `/ai-cost`. It walks the founder through `docs/ai-cost-budget.md` — per-user/day budget
(cohort-aware default), per-call model rationale, the cost-logger wrapper, the review
cadence. Cross-reference the cost shape from step 1.

This step is non-negotiable for AI-first projects. The bill IS the design constraint; you
cannot design around something you haven't named.

### Step 5 — Design failure states (`/ai-failure-states`)

Run `/ai-failure-states`. It walks the founder through the five failure modes (garbage /
refusal / hallucination / timeout / cost-spike), each with a project-specific declared
response, and writes stub handlers in code so the discipline is wired before the first user
sees a failure.

This step closes `ai-failure-state-loop` and finalizes the AI-first declaration.

### Step 5.5 — Name the security surface (the lethal trifecta)

The moment an AI feature reads untrusted input (a web page, a user's pasted text, an email, a
dependency), takes consequential action, *and* can reach private data, you've assembled the
attacker's ideal surface. Security here is **architectural, not a prompt** — you can't ask a model
to never be tricked, only constrain what a tricked model can *do*. Name it once now:

- **Lethal trifecta** — danger needs all three together: *untrusted input* + *access to private
  data* + *ability to act/exfiltrate*. Remove any one for a given step and the attack can't complete.
- **Rule of Two** — prefer that any single step has at most two of the three. Reading untrusted web
  content? Don't also hand that step secrets and an open network.
- **Enforce in the harness, not the prose** — the `permissions.deny` floor ships with every BOSS
  project; high-stakes/regulated cohorts add the `secrets-guard` hook (a *deterministic* guard;
  never trust a non-deterministic safety classifier alone). Sandbox untrusted-input steps; pin deps;
  put a real stop on the irreversible (push / deploy / delete / send).

Full practice: `boss craft agent-security` (Willison 2026). For a day-one Quickstart this
is one sentence; it earns more ceremony as the app reads untrusted input or handles regulated data.

### Step 6 — Update `docs/ai-first.md` cross-reference fields

After the sub-skills run, return to `docs/ai-first.md` and flip the cross-reference fields:
- Failure states designed: **yes**
- Eval set exists: **yes**
- Categorization: **yes**
- Schemas declared: **yes** / **partial**

The doc becomes the **AI-first checklist** for this project. Future-you reads it before
starting work; new contributors read it to onboard.

## Cohort-aware delivery

| Cohort | Posture |
|---|---|
| `first-product` | Walk through each step as a teaching moment. Name what the discipline is *for* (not just what to do). Show the failure-mode-that-this-prevents in each step. |
| `vibe-coder-newbie` | Show + do. Don't lecture. After step 1 they may want to skip to building; gently insist on cost + failure-states upfront (those bite hardest). |
| `non-tech-founder` | Plain-language framing. Each step described as *"the answer to a question the model will ask you later when it breaks."* They likely don't need to write schemas themselves; they need to know they exist + delegate. |
| `eng-builder` | Terse. Hand them the checklist; they'll execute. The discipline names + citations matter to them (Liu, Husain). Skip the patter. |
| `vibe-virtuoso` | They've shipped a lot. They likely *skipped* the discipline last time. *Don't coach the discipline they've read books about.* Ask sharper: "which of these did the last project burn you on? Start there." |
| `indie-hacker` | Calm-company framing. The discipline IS the calm; each declared response is a non-panic posture. Frame cost as % of revenue. |
| `returning-founder` | Skip the 101. *"Which of these is non-obvious for THIS project?"* Likely they want to focus on one or two steps; let them. |
| `domain-expert` | **Stakes are real.** Hallucination handling defaults to **human-in-the-loop**; cost budget is privacy-first; failure states cite the regulatory frame. Take the full sequence seriously; this is the cohort where AI-first discipline most reduces real harm. |

## When to run it

- During `boss unlock mvp` when the project is AI-native — the `/boss` skill should have
  recommended it during spin-up.
- When a Quickstart project pivots to AI-mediated (e.g., the founder runs `/canvas` and the
  Promises cell becomes "the model writes the answer").
- After a real-production AI-failure surprise — re-run to extend the doc with the new mode.

## Connection to other loops + skills

- **Subroutines:** `/evals`, `/ai-cost`, `/ai-failure-states`.
- **Upstream:** `canvas-loop` closed (riskiest assumption named — the model is the bet).
- **Downstream:** future FEAT specs reference `docs/ai-first.md`; future `/spec` runs include
  the failure-states field; the conscience surfaces `cost` and `failure-mode` moments when
  drift accumulates against the declarations.
- **Adjacent:** `/spec` — for AI-mediated FEATs, the spec template includes failure-states
  field (v0.26.0+); `/evals` — eval set sits alongside the failure-state design.

## What this skill is NOT

- **Not a code generator.** It walks the founder through *declarations*; it stubs handlers
  but doesn't implement them. The founder owns the implementation.
- **Not a one-time ritual.** Re-run when the AI-mediated surface changes substantially.
- **Not for AI-as-a-feature apps.** If the model is bolted onto a deterministic core, run
  pieces (`/ai-cost`, maybe `/ai-failure-states` for the AI-touching code paths) but skip
  the conductor.

## Rules

- **Day one means day one.** This skill runs *before* the first AI-mediated FEAT ships. Not
  after the first user. Not after the first bill. Not after the first hallucination report.
- **The doc IS the contract.** Future FEATs read `docs/ai-first.md`; if it says
  "deterministic" for a feature and a PR puts an LLM call in there, that's a real change
  worth a re-spec.
- **Override grammar applies (IDEA-008).** Skipping a step is legitimate when the founder
  has a real reason; record it in devlog. Skipping silently is the failure mode.
- **Domain-expert cohort doesn't skip.** In high-stakes domains, every step matters
  disproportionately. The hour spent here saves harm later.
- **Cite the lineage.** When you author this skill in real practice, cite the spine: Husain
  (evals + failure-mode categorization), Liu (structured outputs), Karpathy/Willison (the
  failure surface IS the design surface), Mollick (cost as design input).
