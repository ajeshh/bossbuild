---
id: IDEA-022
type: idea
owner: product-lead
status: shipped
program: ai-native-boss
promoted_to: FEAT-022
proof: src/brain.js
created: 2026-06-12
---

# IDEA-022 — AI-native BOSS: the living conscience (program)

> **The north star for the 2026-06-12 → 06-22 build window.** Not a feature — a program with four
> tracks and one center. Founder (Ajesh) deliberately relaxed the external-validation gate for this
> capability window: a frontier model ("the model jump") makes things buildable now that weren't
> before, and the call is to go big, multi-track, and make the conscience *feel like its own AI* —
> then earn viral attention for what's built.

> **Re-alignment (2026-06-20, the trends+dhun session).** Still the north star, still building, still
> aligned — the session *fed* it rather than diverting it: the **trace substrate** (IDEA-025
> `auto-log`) + **`/judge-traces`** are now the honest inputs a living/learning conscience needs (Track 4);
> **`/prototype`** (IDEA-030) is a new front-door the venture brain should read; the **upstream
> conscience** sharpen (IDEA-026) is the same "fire on judgment, not output" thesis one step earlier.
> Unbuilt tracks remain: **`boss adopt`** (Track 1, [[IDEA-005]]), **`/consult`** multi-mentor (Track 2,
> [[IDEA-003]] mentors now seated), the **AI-native scaffolder** (Track 3, flag-guarded), and the
> venture-brain read fully voiced (Track 4, `src/brain.js` + `/close → .boss/brain/` partially there).
> No re-scope — carry on; the demand-risk frame ([[CANVAS]]) still governs *why*.
> **Track 1+2 shipped 2026-06-20:** `boss adopt` (Track 1, v0.56) + `/consult` (Track 2, v0.57). Tracks 3-4 (AI-native scaffolder, venture-brain voicing) remain.

## The honest frame (the conscience on itself)

[`CANVAS.md`](CANVAS.md) v0.3 concluded the conscience's **internal-quality risk is retired**
(GRADED 24/24, frequency-instrumented, pausable) and **external-demand risk is 100% of remaining
risk, 0% addressed** — n=0 real founders after 45 releases. By that light, "build more" is building
around the risk. This program does not pretend otherwise. Its claim to legitimacy is **which** builds
it picks:

- **Two of the four tracks attack the demand risk directly:** `boss adopt` (meets a founder at the
  repo they already have — the cheapest path to n≥1) and the **living conscience** (the shareable
  artifact that creates pull). 
- **Two deepen the moat** (`/consult` mentors, AI-native scaffolder) — named honestly as moat work,
  justified only as the *body* that makes the conscience's intelligence real.

If the window closes without a real-founder session, the canvas verdict still stands. The bet is that
adopt + a conscience worth screenshotting is the build *most likely to produce* that session.

## The one move

BOSS stops being **templates + predicates** and becomes genuinely **AI-native**, with a conscience
that has a **mind** at the center. The four tracks are one thesis:

| Track | What it is | Relation to the center |
|---|---|---|
| **0 · The venture brain** (spine) | A persistent, model-maintained understanding the conscience owns — its evolving *read* on the founder's venture + memory of the relationship. | **The center.** Everything else seeds, feeds, or reads it. |
| **1 · `boss adopt` + comprehension** | Brownfield adoption: read an existing repo (1M ctx), infer earned mode, **seed the brain** so the conscience fires well from day one. | Seeds the brain. The door. (IDEA-005) |
| **2 · Incubator brain (`/consult`)** | Multi-mentor orchestration; the board reasons over the *whole* brain, not generic prompts. | Feeds + reads the brain. (IDEA-003) |
| **3 · AI-native scaffolder** | Scaffold from what BOSS *understands*, not a fixed L0–L3 template copy. | Reads the brain. **Highest blast radius — see guardrail.** |
| **4 · The living conscience** | Continuity + a point of view + presence. The conscience that knows your whole story and tells you the truth. The viral center. | **Is** the brain, voiced. |

## The spine: the venture brain

The load-bearing build. What makes the conscience feel like its own AI is **not voice — it's
continuity + a held point of view.** It remembers you across sessions and holds an evolving read on
your venture, so its truth-telling is *earned* by knowing your story.

Distinct from what exists (must not duplicate):
- **canvas** = a formal, founder-authored artifact (snapshot).
- **RESUME** = task state.
- **conscience-log.jsonl** = frequency facts (v0.34).
- **memory-seed** = durable facts (FEAT-020).
- **venture brain (NEW)** = the conscience's *subjective, evolving read on you + the venture*, with
  relationship memory. First-person. Model-maintained. The thing that makes continuity real.

**Open design questions (handed to specialists this session):**
- *Where does it live / what shape?* State (JSON/markdown in `.boss/`) vs. a model artifact regenerated
  on read. Zero-dep must hold; must stay inspectable + overridable (canvas Modes-of-Engagement moat).
  → **mentor-architect**.
- *What makes it FEEL alive — and shareable?* Presence, the continuity moment, the screenshot-worthy
  truth, where BOSS speaks-as-a-being vs. stays a tool. → **designer**.

## Sequencing (dependency graph)

```
  Track 0 (venture brain spine)  ── built first, sequential, careful
         │
         ├──► Track 1 (adopt seeds it)      ─┐
         ├──► Track 2 (consult feeds/reads)  ├─ fan out in parallel once spine lands
         └──► Track 4 (conscience voices it) ─┘
                                              
  Track 3 (scaffolder rebuild) ── LAST + GUARDED (see below). Behind a flag; the
                                  deterministic template path stays the default until proven.
```

## Guardrail on Track 3 (the rebuild)

The AI-native scaffolder trades against a *load-bearing* moat: declarative / inspectable / reversible
/ zero-dep (canvas §2 Modes-of-Engagement). Rule: **additive, behind a flag, template path stays the
default.** We add an `--ai` generate mode; we do not delete `stages/L{0..3}`. A model-generated
scaffold that can't be diffed/reverted is the thing BOSS warns founders against. Build it as an
*augmentation* of JIT scaffolding, not a replacement of the deterministic core.

## The viral logic

A conscience that *actually knows your startup* says piercing, specific, true things — "you've
rebuilt onboarding three times and still haven't talked to a user." **Founders screenshot truth.**
That's the shareable artifact. `boss adopt` is the distribution mechanism (works on the repo they
already have → trying it is free). The name is the asset: **BOSS** — *"my BOSS told me to kill the
feature."* GTM track = mentor-gtm + mentor-pitch, run *after* the conscience is worth screenshotting,
not before.

## Tracks → IDs (promote to FEATs as each track starts building)

- Track 0 → **FEAT-022** (venture brain) — the spine.
- Track 1 → IDEA-005 → **FEAT** when started.
- Track 2 → IDEA-003 → **FEAT** when started.
- Track 3 → **FEAT** when started (flagged, guarded).
- Track 4 → folds into FEAT-022 (the brain, voiced) + a presence/identity design.

## Cite

PRINCIPLE #2 (the rebuild guardrail — don't tear out the deterministic core), PRINCIPLE #6 (the
honest frame — demand is the real risk; this program picks builds that bend toward it).
Connects: [[IDEA-005]] (adopt), [[IDEA-003]] (mentor layer), [[IDEA-014]] (this *is* the
ride-the-model-curve leverage pass, gone big), [[CANVAS]] (the demand-risk verdict this program
answers to). Seed: Ajesh, 2026-06-12 — *"go big, multi-track, make the conscience feel like its own
AI, then get viral attention for what we've built."*
