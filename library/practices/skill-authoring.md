---
id: PRACTICE-skill-authoring
type: practice
owner: pm
status: active
host: claude-code
provenance: adapted from Anthropic's own skill-creator skill via /vet RVW-013 — the wisdom, not the harness (the with/without eval machinery is deferred; see "What's left out"). Ground for anyone authoring a skill — BOSS authoring its own, and (UP candidate) a founder authoring one in a scaffolded project. Frontmatter added 2026-07-30 (v0.135.0) — this doc predated the practice frontmatter convention, which is why no refresh discipline could see it.
last_reviewed: 2026-08-11
review_by: 2026-11-09
curve: host
---

# Practice: Skill authoring — write skills the model actually triggers and follows

> Adapted from Anthropic's own `skill-creator` skill via [RVW-013](../../docs/research/verdicts/RVW-013-skill-creator-authoring-discipline.md).
> The wisdom, not the harness: the with/without eval machinery is deferred (see *What's left out*).
> This is ground for anyone authoring a skill — BOSS authoring its own, and (UP candidate) a founder
> authoring one in their scaffolded project.

A skill is a behavior you're handing to a model, not a config file. It fails two ways: it never
fires when it should (under-triggering), or it fires and the model can't follow it (rigid or vague).
Four disciplines fix most of both.

## 1. Explanatory over prescriptive

Tell the model *why*, and it generalizes to the cases you didn't enumerate. Give it a wall of rules,
and it follows them literally past the point of sense — and rots the moment the model improves
underneath it (the IDEA-014 problem: frozen behavior fighting a better model).

> Yellow flag: if you're writing `ALWAYS` / `NEVER` in all caps, or nesting rigid step-structures,
> stop. That's usually fear talking, not clarity. State the reasoning and trust the model to apply it.

A handful of caps for genuine load-bearing invariants is fine. A skill *made of* them is a skill
that doesn't trust its reader — and BOSS's voice assumes intelligence. (Re-read your own draft: most
`ALWAYS` lines become a single "because" sentence.)

## 2. Progressive disclosure — three levels of loading

Context is a budget. Structure the skill so each level loads only when needed:

1. **Metadata (the `description`)** — always in context, ~100 words. This is what the model reads to
   *decide whether to trigger*. It earns the most care (see #4).
2. **The SKILL.md body** — loaded only when the skill fires. Keep it tight (the source says <500
   lines; most should be far shorter). This is the *how*.
3. **Bundled resources** — templates, examples, reference files — loaded on demand from the body,
   never up front.

Don't pour the whole method into the description, and don't make the body re-explain what the
description said. Each level does its own job once.

### The 2026-08 sharpening: split, don't just shorten

Anthropic deleted **80%+ of Claude Code's own system prompt** for the Claude 5 generation with **no
measurable loss on coding evals** — the prompt their team had hand-tuned for older models was
*actively getting in the way* of the newer ones. Their instruction for skills is stronger than the
line above: **"divide long skills into multiple files"** and *reference* specialized skills from the
main document rather than embedding everything up front.

So "<500 lines" is a ceiling, not a target. The real test is structural: **does this file make the
reader load things they don't need yet?** A 200-line skill where 140 lines are one rarely-hit branch
is worse than two files. And there is now tooling — **`/doctor` rightsizes skills and `CLAUDE.md`
files**; run it instead of eyeballing.

> The failure mode this prevents is specific and it compounds: every over-explained skill is paid for
> on every session that loads it, and the model it was written to compensate for no longer exists.
> **Instructions written for a weaker model become a tax on a stronger one.**

**The boundary of this rule — because it got misapplied once (RVW-071).** Progressive disclosure is
about *what loads without being asked for*. It applies to a `SKILL.md` body, a `CLAUDE.md`, an agent
prompt — anything the context window pays for whether or not it's needed. It does **not** apply to a
document someone opens on purpose: a practice, a reference doc, a spec you go and read. A deliberate
reader wants the whole thing, and splitting it there buys indirection and nothing else. When a
deliberately-read doc gets uncomfortably long, the honest question is **what can be deleted**, not
where to cut it in two — file-splitting makes unbounded growth *look* solved while hiding it.

## 3. Design the interface, don't supply examples

*(Added 2026-08-11 — this was the shift BOSS's shelf did not hold.)*

The instinct when a skill misfires is to add an example. Usually the right fix is one level down:
**make the shape of the thing teach its own use.** A well-named argument with a real enumeration
communicates more, and rots less, than three worked examples — because examples are a sample of the
space and the model treats them as its *boundaries*, so it explores less than it could.

- **Name arguments for what they mean, not what they hold.** `--since <date>` beats `--arg1`;
  `mode: prep | debrief` beats prose explaining the two ways to run it.
- **Enumerate where the set is genuinely closed.** An enum is a constraint the model can't
  misread. Prose saying "usually one of prep or debrief" is one it can.
- **Reach for an example only for a genuinely non-obvious shape** — a format that can't be inferred
  from its name. Then one example, not three.
- **If you're writing an example to compensate for a confusing argument, rename the argument.**

The same rule governs any tool a founder's own agent exposes: the parameter list *is* the
instruction, and it's the half that stays true when the model improves underneath it.

## 4. Descriptions earn their triggers

Under-triggering is the common failure: a useful skill that never fires because its description is
shy. The fix is an *explicit*, specific description — name the trigger phrases, the situations, the
adjacent cases — so the model recognizes the moment. The source skill calls this writing "pushy"
descriptions.

**The BOSS adaptation:** pushy ≠ shouting. A description earns its triggers by being *concrete*
("when the user asks X, or is doing Y, or says any of …"), not by adding urgency words. List the
real trigger phrases; name what it is *not* for (the boundary is as load-bearing as the trigger).
Look at the existing skills — `/vet`, `/boss-learn`, `/consult` — for the pattern: a one-line *what*,
then a precise *when*, then the inverse it's distinct from.

## Self-check before shipping a skill

A short read, not a harness:

- **Trigger test:** read only the `description`. Would *you* know exactly when to fire it, and when
  not to? If the boundary is fuzzy, the model's will be fuzzier.
- **Rigidity test:** count the `ALWAYS`/`NEVER`/caps. Each one — can it become a "because"?
- **Level test:** is anything in the body that belongs in a bundled resource? Anything in the
  description that belongs in the body? Would `/doctor` call this file oversized?
- **Interface test:** for every example in the file — could a better-named argument or a real enum
  have carried it instead?
- **Voice test:** does it assume intelligence and never assume knowledge? (Hand to `voice-keeper` if
  unsure.)

## What's left out (deliberately)

The source skill ships a **with-skill vs without-skill eval harness** (`workspace/iteration-N/eval-ID/`,
parallel runs, scored comparison). BOSS does **not** adopt that yet — it's real ceremony, and it
duplicates the question `/vet` and `conscience-evals/` already ask ("does this beat the baseline?").
**Re-open** when a shipped skill's value is genuinely disputed and a careful read can't settle it;
then a with/without comparison earns its weight. Logged in [IDEA-033](../../docs/ideas/IDEA-033-2026-rigor-and-bestpractice-gaps.md).
