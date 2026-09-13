---
id: RVW-068
type: verdict
owner: product-lead
status: recorded
created: 2026-08-11
verdict: ADOPT (partial — 2 shifts adopted, 2 confirmed already-held, 1 reconciled, 1 deferred)
route: UP library/practices/skill-authoring.md + context-discipline.md · DOWN stages/L0/welcome + src/sync.js — shipped v0.141.0
retroactive: true
---

# RVW-068 — "The six shifts of Claude 5 context engineering"

## The claim

- **Source:** Anthropic — [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models), 2026-07-24. **Primary, first-party, with an experiment behind it.**
- **Core assertion:** Anthropic deleted **80%+ of Claude Code's own system prompt** for the Claude 5
  generation with **no measurable loss on coding evals**. A prompt their team had hand-tuned for older
  models was *actively getting in the way* of newer ones. Six shifts follow: rules → judgement ·
  examples → interface design · upfront → progressive disclosure · repetition → simple descriptions ·
  manual memory → auto-memory · simple specs → rich references.

## Rubric

| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | **No — it is R&H #1 and Principle #2 aimed at BOSS's own output.** "Add ceremony only when earned" applied to instruction text. |
| 2 | Evidence grade | **The highest a practice claim gets.** First-party, an actual ablation (80% deleted), measured against evals, published by the team that owns the host. Not an opinion about prompting. |
| 3 | Duplicate or sharpen? | **Split.** Shifts **1 and 3 were already held** — `skill-authoring` §1 (*"ALWAYS/NEVER in caps is usually fear talking"*) and §2 (the three-level loading model), written 2026-06-20, **a month before Anthropic published**. Shift 4 held *within* a skill. Shifts **2 and 6 not held at all**. Shift 5 **contradicted across two BOSS docs**. |
| 4 | Who serves / harms? | Serves every cohort, invisibly — shorter instructions are a **quality** lever, not just cost. Most serves beginners, who are least able to tell over-explanation from necessary detail. **Harms:** nobody, if done by splitting rather than deleting. Deleting content a founder needed would harm `first-product` most, which is why the welcome fix **split** rather than cut. |
| 5 | Cost / ceremony | **Negative cost** — this removes surface. The only real cost is the engineering it exposed (see below). |

## Verdict: ADOPT (partial)

Per shift, honestly:

| Shift | Verdict | Why |
|---|---|---|
| 1 · rules → judgement | **CONFIRMED, no change** | `skill-authoring` §1 already says it, better. |
| 2 · examples → interface design | **ADOPT — new** | Nothing on the shelf covered designing a skill's *argument shape* so it teaches its own use. |
| 3 · upfront → progressive disclosure | **CONFIRMED in doctrine · VIOLATED in practice** | See below — this is the finding. |
| 4 · repetition → simple descriptions | **ADOPT, narrowed** | Held within a skill; the cross-file case was the live bug. |
| 5 · manual memory → auto-memory | **RECONCILE** | `memory-seed/README.md` already routed to auto-memory; `context-discipline` move #1 was still all hand-tending. Two BOSS docs, two models. |
| 6 · simple specs → rich references | **ADOPT — new** | `/spec` writes markdown; Artifacts are a host capability BOSS wasn't using. |

**The finding worth more than any single shift:** BOSS **held the rule and broke it in what it ships.**
7,163 lines of `.claude/*.md` across four stage templates; an L1 founder receives 4,169. `/welcome` —
a founder's *first contact* — was 262 lines, of which three sections were explicitly marked
*"reference — expand only if asked"* and loaded on every single run anyway.

A knowledge gap is fixed by research. **A compliance gap is fixed by doing the work you already
documented** — and it is the more embarrassing of the two, because nothing new had to be learned.

## What shipped (v0.141.0)

- `skill-authoring.md` — new **§3 Design the interface, don't supply examples**; the progressive-disclosure
  section sharpened with Anthropic's stronger *"divide long skills into multiple files"* and the
  `/doctor` tooling pointer; a new **Interface test** in the self-check.
- `context-discipline.md` — move #1 gains the auto-memory bullet (resolving the contradiction) and
  records that the `CLAUDE.md` line is **confirmed** by Anthropic's own guidance.
- `stages/L0-quickstart/.../welcome/` — **262 → 214 lines**, three reference sections moved to
  `reference/deeper.md`, loaded on demand. Two `Rules` entries deduped, one of which **contradicted**
  the wrap-up ("three doors" vs "one literal command") — shift 4's context-clash, live in the template.
- `src/sync.js` — see the defect below.

## The defect this exposed (the reason to do the work rather than just write it down)

Splitting a skill surfaced a real bug: **`boss sync` tracked only `SKILL.md`.** Any bundled resource
would ship once at scaffold and **never update again** — precisely the dormant-hook bug fixed in
v0.108.0, about to be reintroduced through a different door. Fixed with a recursive walk over the
skill directory, plus a regression test.

**This is the argument against adopting a practice on paper only.** The doctrine ("use progressive
disclosure") had been on the shelf since June and was harmless as long as nobody followed it. The
moment BOSS actually complied, the tooling gap became visible. *An unpracticed practice hides its own
prerequisites.*

## ~~Deferred~~ → CLOSED in v0.143.0

The remaining template surface was carried as an open item for one version, then done. The per-skill
read paid off: **the split was principled, not arbitrary.** Every worst offender had the *same*
shape — a large **embedded output template** (the doc or code the skill writes) sitting in the
always-loaded body, which is exactly the level-3 bundled resource `skill-authoring` §2 already names.

`ai-cost` 265→163 · `ai-failure-states` 226→157 · `cost-review` 218→163 · `ai-first-init` 238→201 ·
`extract` 210→172 · `spec` 196→158. **L1 always-loaded: 4,169 → 3,861**, with 382 lines moved to
load-on-demand.

**Total bytes went up.** That is the correct outcome and worth stating plainly, because a naive
line-count metric would call this a regression: progressive disclosure doesn't shrink what exists, it
shrinks **what you pay for every session**. The right measure is always-loaded surface, not repo size.

Three of the six had a duplicated lead-in left behind by the extraction (*"Use this skeleton"*
immediately followed by *"Skeleton:"*). Deduped — **shift 4 caught in BOSS's own output for the second
time in three versions**, which is a fair argument that repetition is the shift hardest to self-police.
