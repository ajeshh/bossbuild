---
id: IDEA-053
type: idea
owner: product-lead
status: shipped (v0.105.0 — `founder-role-shifts.md` + the mode unlocks)
proof: library/practices/founder-role-shifts.md
created: 2026-07-02
source: fable-campaign lifecycle pass (Fable 5, 2026-07-02 — "help the entrepreneur keep developing THEMSELVES")
---

# IDEA-053 — The role-shift ladder: each mode asks you to become someone slightly different

## The gap

BOSS develops the *venture* (modes), the *craft* (PRAC), the *product* (everything else) — and says nothing
about the **founder's own transformation**, which is the thing real incubators actually sell. The
uncomfortable truth of the lifecycle Ajesh's questions trace: at each rung the founder's *job title
secretly changes* — Quickstart asks for a **builder**, MVP asks for a **seller** (the interviews, the first
dollar), V1 asks for an **operator** (the customer loop), Scale asks for a **leader** (the extended team,
give-away-your-Legos). Most founder failure at each transition isn't tooling — it's *continuing to do the
previous rung's job because it's the comfortable one*. (The vibe-virtuoso persona is exactly this: a
builder who never becomes a seller, 50 repos, zero users.)

BOSS already *implies* the ladder — the whole conscience exists because builders over-build — but never
names what each stage asks **of the person**.

## The shape (deliberately small — text, not machinery)

**One paragraph at each `boss unlock`, plus one practice.** When a founder unlocks a mode, alongside "here's
what you get" (current behavior), one honest paragraph of "here's what this stage tends to ask of *you*":

- **→ MVP**: *"This rung's hardest work isn't in the editor. Builders who thrive here spend afternoons
  talking to strangers about their problem. The tool half is `/interview` and `/pretotype`; the personal
  half is that asking feels worse than building — and matters more."*
- **→ V1**: *"You're about to have users, which means support, incidents, and churn. The operator's
  question replaces the builder's: not 'what should I make?' but 'is what I made working for the people
  paying for it?'"*
- **→ Scale**: *"This rung is about becoming dispensable in the right places — give away your Legos."*
  (IDEA-040's language, arriving as self-development instead of org design.)

Plus `library/practices/founder-role-shifts.md` (UP): the ladder named once, with the classic failure mode
at each transition and which BOSS verbs + mentors serve it. Mentors can cite it (`mentor-venture`'s "what
should I be doing next?" gains a spine).

## Humane guardrails (this one is delicate)

- **Describes the situation, never the person** (the IDEA-019 rule, verbatim). "This stage tends to ask…"
  — never "you are stuck as a builder."
- Never a hook, never an assessment, never a "founder level." No progress bar on a human being. The
  paragraph appears **once, at unlock, at the founder's own invoked moment** — the most consensual possible
  delivery.
- A founder who stays a builder forever is legitimate (the README already promises "a project that stays
  in Quickstart forever is a legitimate project" — the same dignity extends to people).
- Voice: the seasoned hand naming what the road is like ahead, not a coach demanding growth.

## Why it's earned now

It's nearly free (template text + one practice), it's the incubator half of the product finally speaking
(the mentor board coaches decisions; nothing coaches *transitions*), and it makes the mode ladder mean
something human. It also gives the four lifecycle IDEAs ([[IDEA-050]]/[[IDEA-051]]/[[IDEA-052]]/[[IDEA-040]])
their narrative spine: the modes aren't feature tiers, they're **who you're becoming**.

## OPUS HANDOFF PROMPT

```
You are implementing IDEA-053 (the role-shift ladder) for BOSS. Repo:
~/Projects/bossbuild. Read CLAUDE.md, docs/RESUME.md,
docs/ideas/IDEA-053-founder-role-shift-ladder.md, and library/practices/conscience-voicing.md
(the voicing craft applies to this text) first. This is template text + one practice — no src/
logic changes beyond, at most, where unlock messaging already lives.

TASKS
1. New practice library/practices/founder-role-shifts.md: the ladder
   (builder → seller → operator → leader mapped to Quickstart → MVP → V1 → Scale), the classic
   failure mode at each transition (builder-who-won't-sell; seller-who-won't-operationalize;
   operator-who-won't-delegate), and the BOSS verbs + mentors serving each. Header carries the
   humane guardrails from the idea file verbatim (situation-not-person; no levels; staying is
   legitimate).
2. Unlock moments: find where `boss unlock mvp|v1` presents its "here's what you get" output
   (src/ or the unlock skill/template text — locate it first). Add the one role-shift paragraph
   per mode transition, drawn from the idea file, voice-checked (seasoned hand, no coach-speak,
   no performed warmth). If unlock output is CLI-side (src/), the paragraph is static template
   text — zero-dep holds. Scale's paragraph ships only if a Scale unlock path exists; otherwise
   note it in the practice for when Scale is authored.
3. mentor-venture (shipped template): one line citing the practice at "what should I be doing
   next?" moments.
4. Voice review: run the paragraphs against the voice-keeper bar (or invoke the voice-keeper
   agent) before finalizing — this text is the most person-adjacent BOSS ships; performed warmth
   or judgment would be worse than shipping nothing.
5. Wayfinding untouched (no new verbs). VERSION minor bump + registry/CHANGELOG.md entry
   ("mode unlocks name what each stage asks of the founder — the role-shift ladder;
   situation-not-person throughout"). /tmp smoke test: boss new + unlock mvp shows the paragraph,
   0 placeholders; clean /tmp + prune registry/projects.json.
Do not add hooks, assessments, levels, or any founder-state tracking. Do not commit unless asked.
```
