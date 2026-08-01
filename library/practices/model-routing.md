---
id: PRAC-model-routing
type: practice
owner: mentor-architect
status: active
host: host-neutral
curve: craft
last_reviewed: 2026-08-01
review_by: 2027-08-01
provenance: Extracted at v0.135.0 from a real mistake. BOSS pinned `model: fable` in 8 shipped agent files + hardcoded model ids and per-token prices in `.boss/model-profile.json`. Within four weeks the pin was stale (the session model moved on), the prices were unverifiable, and nobody could confirm the alias even resolved in a founder's install — while `/recalibrate`, the discipline built to catch exactly this, never fired. The audit (REVIEW-2026-07-28 §E2) caught it instead. Root cause named by BOSS's own PRINCIPLE #3 - a model name buried in an agent file is *locked into code*; the reusable thing is the INTENT, which is stable, not the name, which is not.
---

# Practice — Route by capability, never by model name

## The rule

**Name what the work needs. Never name the model.**

A model name is the most perishable fact in an AI-native codebase. It changes every few months, it
differs per host, it differs per founder's plan, and it is invisible when it silently fails to
resolve. The *need* behind it — "this call wants deliberation more than speed" — has not changed in
three years and won't.

> **The Principle #3 test, applied:** *could a sibling project reuse this without copy-pasting?*
> A `model: fable` line fails it — there is nothing to reuse but a string that will be wrong soon.
> "This work wants deliberation" passes it: it's true on any host, in any year.

## Why this is not just tidiness

Four costs, all of them paid:

1. **It rots on a clock you don't control.** A pin is stale the moment the vendor ships. You inherit
   a maintenance obligation with no trigger — and a discipline that fires on nothing is a discipline
   that doesn't exist.
2. **It fails silently.** An unrecognised model name doesn't throw. It falls back, or it errors
   somewhere the founder never sees, and the agent quietly runs on something else. You cannot debug
   what doesn't announce itself.
3. **It overrides a choice the founder already made.** They picked a model when they opened their
   host — for cost, for speed, for their plan. Second-guessing that from a template is presumptuous,
   and on a cheaper plan it can mean the pin simply doesn't work.
4. **It welds you to one host.** A frontmatter key is a *Claude Code* concept. Every pin is a line
   of the port you'll owe if BOSS ever runs anywhere else (IDEA-006).

## The three capability shapes, and the questions behind them

You almost never need "a model." You need one of three shapes. Name the shape; let the host bind it.

| Shape | The work | The question it answers |
|---|---|---|
| **deliberation** | rare, high-stakes, ambiguous. A mentor's judgment call, an adversarial pass, a verdict that shapes a decision. | *Would being wrong here cost a week?* If yes, deliberation is worth its premium — precisely **because** it's rare, the premium is trivial in absolute terms. |
| **volume** | frequent, well-specified, the default. Building, editing, reading, the session's actual work. | *Is this most of what happens?* Then it wants the balanced default the founder already chose. |
| **cheap-bulk** | high-frequency, low-stakes, mechanical, or public-facing at scale. Classification, extraction, a demand surface anyone can hit. | *Could this run ten thousand times?* Then unit cost dominates and quality has headroom. |

**Most work is `volume`, and `volume` means "whatever the founder is already using."** That is not a
cop-out — it's the correct default, and it's free.

## How to apply it

**In a shipped artifact (a template, a skill, an agent): say nothing.** Omit the model key. Inherit.
The founder's host has already resolved the question, and the artifact stays portable and un-rottable.

**When a shape genuinely matters, name the shape in prose, not the model in frontmatter:**

> This mentor is invoked rarely and its output shapes a decision you'll live with for months — it's
> worth running on your most deliberate model if your host lets you choose per-agent.

That sentence is true forever, on any host, and it hands the founder the decision instead of taking it.

**When you must bind concretely** — a paid API surface where you're spending real money per call, like
a public demand page — bind it in **one place, locally, and say why**: a single config the operator
owns, never scattered across artifacts. One place to update beats twelve places to discover.

## The honest exception

Bind a concrete model when the *behaviour itself* is load-bearing and version-specific: a
reproducible eval, a graded transcript, a published benchmark. Then the version **is** the fact
you're recording, and pinning it is correct — record it *next to the result*, as provenance, not in
a template that ships to strangers.

## Related

- `.boss/model-profile.json` — the local, operator-owned binding (capability shapes → whatever you
  actually use). Not shipped; regenerable; safe to be wrong.
- `/recalibrate` — the standing pass. Since v0.135.0 it no longer chases model names; it asks whether
  the *shape of the tradeoff* moved (did a new tier change what "cheap" means?), which is a much
  rarer and more meaningful event.
- `context-discipline.md` — the sibling cost lever. Routing is what you pay per call; context is how
  much you pay each time.
- **PRINCIPLE #3** (nothing valuable gets locked into code) and **#4** (stack-neutral; stacks are
  learned, not assumed). This practice is #4 applied to models instead of frameworks.
