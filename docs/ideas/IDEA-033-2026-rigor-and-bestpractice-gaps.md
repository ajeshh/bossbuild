---
id: IDEA-033
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: A bundle of smaller 2026 rigor gaps held in one place — per-skill versioning, validate-and-repair enforcement, and the rest — none of which earns its own record yet.
proof: library/practices/rigor-2026.md
created: 2026-06-20
---

# IDEA-033 — 2026 rigor + best-practice gaps (the bundle)

> **PARKED 2026-08-20** (Ajesh: *"any other idea worth parking / archiving"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written in this file.
>
> **A shelf, not a decision — and every item on it is already gated.** The record's own section
> heading is *"The bundle (each independently **earn-it-gated**)"*, and each entry carries its own
> condition (*"build when a founder needs to pin/upgrade one skill independently"*, and so on). A
> record where nothing is buildable now renders on the board as one card of live backlog, which is
> exactly backwards: it is a **holding bin kept so the research isn't lost**, and that is a good
> reason to keep a file and a bad reason to occupy a column.

> Seed: the 2026-06-20 Anthropic-appeal + gaps research
> ([dossier](../dossier/anthropic-appeal-and-gaps-2026.md)). A **catch-all backlog** for the smaller,
> genuinely-missing 2026 practices — captured so they're not lost, each earn-it-gated. Deliberately NOT
> a green-light to build all of it (the same restraint the conscience preaches — don't accrete ceremony).

## The bundle (each independently earn-it-gated)

1. **Per-skill versioning.** BOSS versions at the repo level (VERSION + CHANGELOG); skills carry no
   `version:` frontmatter and `boss sync` operates on bundles, not versioned skill units. Add a
   `version:` to SKILL.md frontmatter + a per-skill diff/upgrade path. *Build when a founder needs to
   pin/upgrade one skill independently.* (https://claude.com/blog/skills)
2. **Constrained-decoding / validate-and-repair enforcement.** `/evals` + the structured-output
   *discipline* exist (design); the frontier is *enforcement* — grammar-based decoding that guarantees
   schema-valid output, or an explicit validate-and-repair retry contract for the loop runtime's own
   LLM-judge parsing. *Build when a loop's judge-parse actually flakes.* (https://github.com/dottxt-ai/outlines)
3. **`/red-team` skill (OWASP 2025 LLM Top 10).** BOSS is strong on *prevention* (secrets-guard,
   lethal-trifecta, agent-security). The gap is a *testing* discipline: a skill that runs the OWASP Top
   10 (Prompt Injection, Excessive Agency, Unbounded Consumption…) against a FEAT — turning defense into
   *evidence*. Also red-teams BOSS's **own** conscience hook against injection. *High value for
   domain-expert / regulated cohorts.* (https://genai.owasp.org/llm-top-10/)
4. **Trajectory-eval assertion mode.** `/evals` has the Husain substance + judges endpoints; add an
   optional assertion on the *tool/decision path* (a right answer via a dangerous sequence is still a
   fail). Point to **UK AISI Inspect** as the graduation reference; don't rebuild it.
   (https://inspect.aisi.org.uk/)
5. **MCP publishing/registry awareness.** The official MCP Registry launched (preview). A *be-ready*
   skill for publishing/consuming MCP servers (with the trust/moderation caveat) — readiness, not a
   dependency. (https://registry.modelcontextprotocol.io/)
6. **Skill-eval harness (with/without comparison).** From Anthropic's `skill-creator`
   ([[RVW-013]]): a `workspace/iteration-N/eval-ID/` harness that runs a skill *with* and *without*
   itself on representative prompts and scores the delta. The *principles* of skill-authoring already
   landed (`library/practices/skill-authoring.md`); this is the deferred *machinery*. *Build when a
   shipped skill's value is genuinely disputed and a careful read can't settle it* — until then it
   duplicates `/vet` + `conscience-evals/`. (https://skillsmp.com/creators/anthropics/skills/skills-skill-creator)
7. **UI/UX pre-delivery checklist (a11y + touch + safe-area).** Mined from the `ui-ux-pro-max` skill
   (machinery rejected — CLI + searchable DB conflicts with zero-dep ethos; checklist kept): a
   verification gate for V1 UI — contrast/light-dark parity, 44×44px touch targets, no-emoji-as-icons
   (SVG only), reduced-motion respect, safe-area compliance, no layout shift on interaction. *Fold
   into the design-system practice's V1 enforcement when `/ux-check` is authored.*
   (https://skillsmp.com/creators/nextlevelbuilder/ui-ux-pro-max-skill)
8. **`/spec` + `/consult` question discipline.** ~~Harvested from obra/superpowers' `brainstorming`~~
   — **AUDITED, NOT A GAP (2026-06-20). Closed.** Both micro-techniques are already present, or
   deliberately bounded:
   - **One question at a time** — already embodied, *better* than the generic version. `/spec`'s
     Moment #4 surfaces **one substantive** question ("who is this for, what's the bet that could sink
     it?") and explicitly says *"don't surface a checklist gap; surface the substantive one."* `/consult`
     takes a single question. Neither dumps a questionnaire.
   - **Propose 2–3 approaches w/ trade-offs + a recommendation** — `/consult` does the approaches +
     trade-offs (its whole "where they converge / where they diverge" synthesis) but **deliberately
     withholds the single recommendation** — *"never average seasoned advisors into mush; the call is
     yours."* Adopting "+a recommendation" would **contradict** `/consult`'s advisory thesis, not
     improve it. `/spec` correctly doesn't generate approaches (out of scope — that's `/canvas` /
     `/triage` upstream of the build contract).
   - **Verdict:** nothing to adopt. The one piece BOSS doesn't do (collapse to a single rec) it
     withholds *on purpose*. Recorded so the claim doesn't resurface.
   (https://skillsmp.com/creators/obra/superpowers/skills-brainstorming)

## Explicitly NOT in scope (research said: covered / hype / host-provided)
- **OTel-GenAI semconv** — pre-stable (schema URL still TODO). Design the trace schema *mappable* to
  `gen_ai.*` later; do **not** conform to a moving target now.
- **Model routing** — covered by [[IDEA-014]]; only minor add (fallback-on-failure line in
  `ai-failure-states`). Don't build a router (cohort is founders, not infra teams).
- **Cost controls** — covered (`/ai-cost`, `/cost-review`); ahead of most tools.
- **Sandboxing / checkpointing** — host-provided (Claude Code native); document reliance, don't rebuild
  (host-binding boundary, [[IDEA-006]]).
- **"Deterministic replay / EDD"** — already practiced (golden-transcript replay; the eval discipline
  under a newer name).

## Note
The single biggest capability upgrade the research named — **living/self-pruning memory** (the write +
evict side) — is **not** in this bundle: it belongs to the venture-brain spine ([[IDEA-022]] Track 0),
where `src/brain.js` + `.boss/brain/` live. Captured there.

## Ledger — 2026-09-12 read against what is on disk

Three of the seven open items have shipped under other records; the bundle never got told. **#3
`/red-team`** shipped (its own CHANGELOG entry cites this record). **#6 the with/without skill-eval
harness** shipped as [[IDEA-103]] (`plugin/evals/`, `npm run eval:plugin`, Δ scored) — the trigger
this item named (*"a shipped skill's value is genuinely disputed"*) fired as *"does the plugin change
what the model does"*, the same question. **#7 the a11y checklist** is inside `/ux-check` (touch
targets, contrast, motion). Still parked, still un-triggered: **#1** per-skill versioning, **#2**
validate-and-repair, **#4** trajectory assertions, **#5** MCP registry readiness. A bundle that is
half shipped is still a bundle; nothing here un-parks it.

## Gate

**Re-open trigger:** any single item on the bundle's list has **its own** trigger fire — most
plausibly per-skill versioning, the day a founder needs to pin or upgrade one skill independently
of the rest. When that happens the item leaves this record and becomes its own, rather than
un-parking the shelf.

**This record is not re-opened by "we have time now."** A bundle exists so that gated research is
findable later; the moment it becomes a to-do list, it stops being either.
