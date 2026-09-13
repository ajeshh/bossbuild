---
id: IDEA-016
type: idea
owner: product-lead
status: shipped
gist: A drop folder for outside claims plus the skeptical panel that pressure-tests each one. Reddit is full of best practices; that doesn't make them good ideas. The filter IS the product.
proof: .claude/skills/vet
created: 2026-06-01
---

# IDEA-016 — Research intake + vetting (the skeptical inbox)

> **Phase 1 shipped v0.40.0:** `/vet` (BOSS-local meta-skill) + drop zone `docs/research/inbox/` +
> verdict log `docs/research/verdicts/` + `RVW-NNN` ID type. Internal-curation version; single
> skeptical pass. **The founder-facing version (UP candidate) + the mentor+persona panel upgrade
> stay deferred** until the internal version earns them (the riskiest assumption below — does `/vet`
> beat a careful read? — is tested in *use* now).

> **The inverse of `/boss-learn`.** `/boss-learn` routes a pattern *you already proved* (built it,
> it worked, it repeated) UP or DOWN. This routes a claim *from a stranger* — a Reddit thread, a
> blog post, a paper, a "you must do X" tweet — that has **earned nothing**. Its whole job is the
> part `/boss-learn` never has to do: decide whether an unproven outside claim deserves to become
> practice at all.

## The seed

Ajesh, 2026-06-01: *"if i have new research or best practices, we should have a way where i can just
drop it in, and then our mentors and such review and see what we should integrate. reddit is full of
best practices, but that doesnt mean all are good ideas."*

The last sentence is the design. The deliverable is **not** an inbox — a drop folder with no
judgment is a bookmark pile. The deliverable is the **skeptical panel** that pressure-tests each
claim. The filter *is* the product.

## Decisions taken at capture (2026-06-01)

1. **Scope: internal curation first** — built for Ajesh curating BOSS (drop research → BOSS's own
   mentors/personas decide whether *BOSS* should adopt it). The founder-facing version (a founder
   drops a Reddit thread → BOSS reads it against *their* canvas/stage/cohort) is a strong **UP
   candidate** (PRINCIPLE #1) — named here, deferred until the internal version earns it (PRINCIPLE
   #2). Every founder drowns in the same firehose; this is profoundly BOSS-shaped.
2. **Review weight: single skeptical pass** to start — one reasoning pass that holds the rubric +
   relevant principles + a couple cohort lenses and returns the verdict. The full mentor+persona
   *panel* (independent reviewers → synthesis, like the v0.36 board convening) is the upgrade if the
   single pass proves too shallow — not the starting point.

## Shape (Phase 1)

```
docs/research/inbox/        ← you drop a link / paste / PDF / .md note
        │  /vet  (deliberate skill — never a hook moment)
        ▼
   single skeptical pass (Opus):
     reads the claim + PRINCIPLES.md + existing practice + cohort lenses
     scores against the rubric (below), biased toward NO
        ▼
   verdict doc → docs/research/verdicts/RVW-NNN-*.md
     ADOPT → hand to /boss-learn        (now earned enough to become practice)
     ADAPT → integrate a modified version, modification reasoned
     REJECT — recorded with why         (so the same thread isn't re-litigated)
     NOT-YET → sound, but needs a trigger/evidence we don't have
```

- **Drop zone:** `docs/research/inbox/` — a file, a paste, a URL in a one-line `.md`. Low-ceremony in.
- **Skill:** `/vet` (working name) — **deliberate-invoke**, like `/extract` and `/drift-deep`. A
  heavyweight review for every blog post you skim is exactly the ceremony BOSS refuses (PRINCIPLE
  #2). It fires only when you ask.
- **Verdict record:** `docs/research/verdicts/RVW-NNN-*.md`, new `RVW-NNN` ID type (see `docs/IDS.md`).

## The rubric (the skeptical gate — biased toward NO)

1. **Does it contradict a PRINCIPLE?** (e.g. "growth-hack your onboarding" fails #6 instantly →
   rejected, no further debate.)
2. **Evidence grade.** n=1 vibe / pattern-with-data / named practitioner BOSS already respects. Most
   Reddit "best practices" die here.
3. **Duplicate or sharpen?** Does BOSS already do this, or does it genuinely improve something we
   have?
4. **Who does it serve — and harm?** A practice great for `eng-builder` can be toxic for
   `first-product`. The personas earn their keep here, not just the mentors. The humane lens can veto.
5. **Cost / ceremony.** Does adopting it add weight BOSS's own thesis warns against?

Default verdict leans **REJECT / NOT-YET** — most best practices genuinely don't apply to you at
your stage. The skill is a good skeptic, not an eager adopter.

## Why each design choice

- **Inverse of `/boss-learn`, not a fork of it.** boss-learn's input has earned trust; this input
  has earned nothing. Different trust model → different machinery. ADOPT *hands to* boss-learn; it
  doesn't reimplement it.
- **Mirrors `/extract`'s UP/DOWN/NOT-YET routing** — the precedent for deliberate, judgment-required
  skills that route to one of a small set of honest outcomes.
- **REJECT-with-reason is the quietly important outcome.** Without a recorded "no + why," the same
  claim resurfaces every month and costs the same debate. The verdict log is institutional memory of
  what BOSS deliberately *didn't* adopt.

## Riskiest assumption (resolve before building Phase 1)

**That a vetting mechanism is used enough to deserve to exist — vs. Ajesh just reading the thread
and deciding.** The honest test: does the skill add something a careful read doesn't? It does *iff*
(a) it reliably catches principle-contradictions and harm-to-a-cohort that a fast skim misses, and
(b) the REJECT log compounds (saves re-litigation). If a first few real drops produce verdicts Ajesh
would have reached anyway in 30 seconds, it's ceremony — keep it a folder + a habit, not a skill.

## Cite

PRINCIPLE #1 (the founder-facing version is a superset practice — UP candidate), PRINCIPLE #2 (the
rule that keeps it deliberate-invoke and internal-first), PRINCIPLE #6 (the humane lens as a hard
veto in the rubric). Connects: [[IDEA-001]] / `/boss-learn` (the inverse — proven-pattern router),
`/extract` (the UP/DOWN/NOT-YET precedent), `/drift-deep` (deliberate deep-read skill, not a hook
moment), the proto-personas (the who-does-it-harm reviewers), [[IDEA-003]] (the mentor board — the
Phase-2 panel upgrade). Seed: Ajesh, 2026-06-01.
