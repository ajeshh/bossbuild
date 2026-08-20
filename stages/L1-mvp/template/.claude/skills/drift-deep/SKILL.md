---
name: drift-deep
description: The deep, whole-project version of the conscience's drift check — "am I fooling myself across EVERYTHING I've built?" Reads the entire project (canvas, all devlog, all FEAT specs, the actual code, the ideas) and judges, honestly, whether the body of work is validating the named riskiest assumption or building around it. The deliberate, founder-invoked counterpart to the cheap always-on `drift` hook moment (which reads only the last ~5 entries). Uses the model's full context, not a bounded peek. Writes docs/drift-audits/DRIFT-YYYY-MM-DD.md. Run when you want the real audit, not the tripwire. Usage - /drift-deep
---

# /drift-deep — the whole-project "am I fooling myself?" audit

> *"BOSS helps founders build faster without fooling themselves — continuously checking the work
> against real pain, real workflows, real buyers, real economics, real distribution."* — PRINCIPLES.md.

The conscience's `drift` hook moment is a **cheap tripwire**: it reads ~5 recent entries and asks
"you named a risk, you're piling work, nothing tests it — is the recent work on-aim?" That's the
right thing to fire unprompted on every prompt, because it's affordable to.

This is the **deep version** — the one a bounded read can't do. You run it deliberately when you
want the honest, whole-body-of-work audit: *read everything I've built and tell me, across the
entire project, whether I'm actually validating my riskiest bet or quietly building around it.* It
uses the model's full context, not a peek. It costs more — which is exactly why it's a skill you
**invoke**, not a moment that fires automatically. (That restraint is the point; the conscience
must not become the expensive-AI app it warns founders about.)

It's broader than the hook moment in two ways:
- **It runs even when a validation plan exists.** A plan on the canvas closes the cheap gate — but
  did you *execute* it, or write the experiment line and then drift from running it? The deep audit
  judges the work, not the presence of a plan-line.
- **It reads the actual code, not just the devlog.** What you *built* is the ground truth of what
  you bet on. The deep pass reads `src/` structurally and checks it against the named risk.

## When to run it

- Before a mode unlock, a fundraise conversation, a milestone — any moment you want an honest "where
  do I actually stand against my bet" read, not a glance.
- When the cheap `drift` moment has fired a few times (check `boss conscience activity`) and you
  want the thorough version instead of the recurring nudge.
- When you *have* a validation plan but suspect you've drifted from executing it.
- Periodically on a longer project — the bounded hook moment can miss slow, cumulative drift that's
  only visible across the whole body of work.
- On BOSS itself (self-hosted) at each capability arc.

## How to run it

### 1. Read the whole project (this is the 1M-context move — read widely, on purpose)

Unlike the hook moment's bounded ~5-entry read, here you read **everything that bears on the bet**:

- **The canvas** — `docs/ideas/*-canvas.md`: the riskiest assumption (the bet), the experiment line
  (the plan, if any), and the surrounding cells (people, problem, metrics, risks & harms).
- **The full devlog** — `docs/devlog.md`, *all* entries, not the last five. The arc, not the tail.
- **Every FEAT spec** — `docs/specs/FEAT-*.md` (or wherever specs live): what was committed to build
  and its acceptance criteria. Specs are the stated intent; compare against the bet.
- **The actual code** — `src/` structurally: what modules/features exist, what the app *does*. What
  you built is the truest record of what you bet on. Read the shape, not every line; follow the
  parts that touch (or conspicuously avoid) the named risk.
- **The ideas + extractions + cost/drift history** — `docs/ideas/`, `docs/extractions/`,
  `docs/cost-reviews/`, prior `docs/drift-audits/` — the thinking record.

Read silently. For a large project, prioritize by relevance to the named risk, not by recency
alone — but don't quietly cap coverage; if you skip areas, say which and why in the audit.

### 2. Judge each area of work against the bet

For each meaningful body of work (a FEAT, a devlog cluster, a src/ area), ask the one question the
predicate can't: **does this *test* the riskiest assumption, or does it build *around* it?**

Be specific and honest. "Built the auth system" doesn't test "teams will switch from spreadsheets" —
it's necessary plumbing, but it's not validation. "Ran 4 migration sessions with target teams" does.
The judgment is: of everything built, how much points at the bet vs. away from it?

Watch for the sharpest drift signal: **building the very thing the risk says to defer** (e.g. the
risk is "buyers pay before integrations" and you built the integration framework). Name it plainly.

### 3. Reach a verdict — on-aim / drifting / mixed

- **on-aim** — the body of work is substantially testing the named risk. Say so plainly; this is
  the affirming read, the deep counterpart to staying silent. Don't manufacture concern.
- **drifting** — the work has been building around the bet. Name *where* and *what's missing*.
- **mixed** — some work tests the bet, some drifts. The common real case. Quantify honestly.

The verdict is a judgment, not a score. State your confidence and what you couldn't see.

### 4. Name the smallest re-aim

If drifting or mixed: the single next step that would point the work back at the risk — the smallest
experiment, interview, or instrument that tests the bet. Point at `/canvas` (to set or sharpen the
experiment line) or `/pretotype` (to run a cheap demand test). One step, not a plan.

If on-aim: name what to keep doing, and the next checkpoint where drift could creep in.

### 5. Write `docs/drift-audits/DRIFT-YYYY-MM-DD.md`

```markdown
---
id: DRIFT-YYYY-MM-DD
type: drift-audit
owner: product-lead
status: recorded
created: {{DATE}}
verdict: on-aim | drifting | mixed
---

# Drift audit — YYYY-MM-DD

## The named bet
- **Riskiest assumption:** <verbatim from the canvas>
- **Validation plan on record:** <the experiment line, or "none recorded">

## What the body of work actually does (vs. the bet)
| Area | What it does | Tests the bet? |
|---|---|---|
| <FEAT / devlog cluster / src area> | <one line> | yes / no / partial |
| … | … | … |

## Verdict: <on-aim / drifting / mixed>
<2-4 sentences, honest. Where you started, what's solid, where the work points.>

## The specific gaps
- <where the work diverged from the risk — name the work and why it doesn't test the bet>

## Smallest re-aim
- <the one next step that points work at the risk> → `/canvas` (set the experiment) or
  `/pretotype` (run it)

## Confidence + what this audit couldn't see
- <areas skipped and why; ambiguity; cohort caveats>
```

## Cohort-aware delivery

| Cohort | Posture |
|---|---|
| `first-product` | Teach what "test your riskiest bet" *means* with examples from THIS project. The verdict is a mirror, never a grade — name what's solid first. Define terms inline. |
| `vibe-coder-newbie` | Show the per-area table concretely (their actual FEATs). Avoid abstract "validation" talk; say "does building X tell you whether Y is true?" |
| `non-tech-founder` | Plain language. Lead with the business bet, not the code. The audit is "are you building toward the thing that makes this work, or away from it?" |
| `eng-builder` | Terse, inspectable, evidence-first. They'll accept a hard verdict if the per-area evidence is concrete. Skip the teaching. |
| `vibe-virtuoso` | This is the cohort the deep audit serves most — they ship a lot and validate little. Be direct: of N things built, how many test the bet? Sharper question, not praise. |
| `indie-hacker` | Calm-company framing. "Is the work earning its keep against the bet?" Understatement; "this is fine" is high praise. |
| `returning-founder` | Skip the 101. The harder cut: "is the body of work at the level of conviction this bet needs — or are you busy?" They can take it straight. |
| `domain-expert` | High-stakes: an *un-validated* risk in a regulated domain is a who-could-be-harmed question, not just a business one. Lead with the humane lens — mentor-humane has override authority. Name the real-world stakes of the bet being wrong, conservatively. |

## Connection to the conscience

- **The deep counterpart to the `drift` hook moment** (`drift-loop`). The hook moment is the cheap,
  bounded, always-on tripwire; this is the deliberate, whole-project, founder-invoked audit. The
  moment can *point here* for the thorough version.
- **Routes back to** `/canvas` (set/sharpen the experiment) and `/pretotype` (run the demand test).
- **Not a loop, not a new moment** — there is no `drift-deep-loop` and no nudge to "run your audit."
  It's on-demand by design; making it a recurring obligation would be the premature ceremony BOSS
  avoids. You run it when you want the truth, not when a predicate says to.

## What this skill is NOT

- **Not the cheap moment.** Don't reach for `/drift-deep` reflexively — the hook `drift` moment is
  the everyday tripwire. This is the deliberate, more-expensive audit. Restraint is the design.
- **Not a gate.** It judges and reports; it never blocks. If you disagree with the verdict, record
  why (the override grammar) and move on.
- **Not graded by the judgment-eval surface.** Like `/extract`, this is a deliberate skill judgment;
  its quality is tested in use, not by `conscience-evals/judgment/` (which covers the hook moments).

## Rules

- **Read widely, then judge — don't judge from the tail.** The whole point is the full body of
  work. If you only read recent entries, you've just done the cheap moment by hand.
- **The verdict is honest, not kind.** on-aim when it's earned; drifting when it's true. Manufacturing
  concern erodes trust as much as missing real drift.
- **Name the work, not the founder.** "FEAT-003 builds X, which doesn't test the bet" — never "you
  wasted time." It's an audit of the work against the bet.
- **No silent caps.** If the project's too big to read fully, say what you skipped and why — don't
  let partial coverage read as a whole-project verdict.
- **Cite the bet verbatim.** The audit is only as honest as the riskiest-assumption it's measured
  against. Quote it; if it's vague, that's the first finding (point at `/canvas`).
