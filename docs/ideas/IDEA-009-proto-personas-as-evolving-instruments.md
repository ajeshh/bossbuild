---
id: IDEA-009
type: idea
owner: product-lead
status: deferred (trigger-gated)
gist: Proto-personas as one instrument doing two jobs — steering what to build before it exists, and reacting to what got built after. Not a fixed cast: an artifact that evolves as real founders are met.
proof: library/practices/persona-instruments.md
created: 2026-05-23
---

# Proto-personas as evolving, build-integrated research instruments

> **PARKED 2026-08-20** (Ajesh: *"any other idea worth parking / archiving"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written in this file.
>
> **Parked as a build; the instrument is already in daily use.** Eight proto-personas ship and get
> consulted; what this record proposes is the *next* thing — evolving them from synthetic to
> evidence-backed, and eventually publishing the method. Its own Status section has said *"not
> promoting to FEAT yet"* since 2026-06-20, and ~170 releases later that is still the right call:
> the record's own bar for the mirror half is **≥3 real founders watched**, and BOSS has watched
> zero. *"A mirror you hand someone before watching a single real founder look into one reflects your
> assumptions, not them."*

> Captured after v0.19 shipped 8 proto-personas + the persona-reactions-loop. Ajesh's
> follow-up: *"some of our experts have shared best practices for personas, or potentially for
> AI. has anyone created that? I wonder if this is an unexplored part of AI vibe coding?"*
> Plus the load-bearing clarification: *"these are just beginner personas — with actual
> feedback and external proper user research they can continue to actually help vs using them,
> so keep refactoring and grow them."*
>
> Quick research pass (NN/Group, Indi Young, IxDF, syntheticusers.com, recent arXiv) shows
> the field is more developed than I'd assumed — but there IS a narrower gap BOSS could
> contribute against. **The deepest gap, and what BOSS's frame names most cleanly:** the
> *continuous-refactoring* lifecycle — beginner-personas-that-grow-via-real-evidence as a
> first-class engineering practice integrated with the build loop, not a research deliverable
> filed once and consulted occasionally. This idea names that gap honestly.

## Rethink + status (2026-06-20)

The "rethink our approach" Ajesh asked for, resolved by two realizations:

1. **It's BOTH guidance and QA — one instrument, two directions** (Ajesh: *"its also the QA, its both
   right?"*). A persona-agent both **guides what to build** (the user's voice steering product
   decisions, *before/during* build) **and evaluates what got built** (Husain-discipline structured
   reactions, *after*). Same evolving artifact; two jobs. This pass (below) was the QA direction; the
   guidance direction is the bigger product idea, now split out as **[[IDEA-031]]** (the *founder's
   target-user* persona — "the app is for moms → the first persona is moms"). IDEA-009 = BOSS's own
   *founder-cohort* instrument (designs BOSS); IDEA-031 = the founder's *target-user* instrument
   (designs their app). Same methodology, different subject + owner.
2. **n≈0 real founders → broaden the evidence sources.** The original design waited on real-founder
   calls. The rethink: a persona evolves from **any** evidence — the 2026 research, BOSS's own
   dogfooding (Ajesh *is* a real builder, n≥1), and the **build-integrated reactions themselves**.
   Don't block on the one source that's missing.

**The integration-mechanism open question — answered (demonstrated, not just specced):** the mechanism
is *build-integrated reactions → synthesis → a dated `Notable refactor` ledger note + driven changes.*
**Manual by design** (Principle #2) — formalize into a `/persona-*` skill only if it proves out over a
few passes. First real run: **[2026-06-20-new-features](../dossier/persona-reactions/2026-06-20-new-features.md)**
— 4 personas reacted to `/prototype` + the kanban + the upstream conscience; the convergences drove
**real fixes to `/prototype` v0.55** (jargon-bounce nudge, 5-token-on-a-sketch contradiction, `--stack`
control, over-explanation). The instrument caught design issues *before a real founder hit them* — the
claim-#1 value (build-integrated eval channel), now evidenced once. Status note: this is *reaction*
evidence (weaker than real-founder), so it lands as ledger notes, **not** a real-weight shift.

## The core framing — beginner personas as a *living* artifact

The single point that should never get lost as this idea evolves:

> **Proto-personas are beginner instruments. They are useful immediately AS BEGINNER versions
> — for cheap-pre-filter signal, for cohort-aware design direction, for catching
> divergence-across-cohorts in builds. They EARN MORE WEIGHT as real evidence arrives. The
> discipline is continuous refactoring: synthetic content shrinks as real content grows;
> never the reverse. The persona is *the same artifact* across its life — the version that
> exists today is just earlier in that life.**

This framing is what distinguishes BOSS's practice from:

- *Synthetic users as a research replacement* (NN/G + Young's critique — dangerous)
- *Proto-personas as one-shot deliverables* (classical persona-card practice — decays)
- *AI personas as ephemeral prompts* ("act as X and...") — no continuity
- *Persona evidence ledgers* (already named in the field; useful; but typically attached to
  research artifacts not living agents)

BOSS's version is: *one persona, evolving, versioned in git, used at every life-stage, never
confused with real evidence.*

## What's already published (field survey, 2024-2026)

Before claiming novelty, the honest pass on what's actually been written:

### Established practices (well-developed in the literature)

- **Synthetic users / AI personas as a category exists** and has a vendor (syntheticusers.com)
  + multiple consulting frameworks. NN/Group, IxDF, EPAM, parallelhq, articos, delve.ai have all
  published guides. *No greenfield here.*
- **"Persona evidence ledger"** — a traceability artifact recording what data informed each
  persona and when it was updated. Already named in the field. (BOSS's intuition about
  "evidence log on each persona" is not novel — it's a re-application of this.)
- **"Balanced operating model"** — synthetic weekly for ideation/iteration, real customer
  research monthly/quarterly for validation. Already published as the prescribed cadence.
- **The synthetic-as-pre-filter, real-as-validation discipline.** "Run synthetic interviews
  first to sharpen questions, then sit down with real users with sharper hypotheses." This
  IS the exact frame the v0.19 persona-reactions-loop encodes — *and the field already named
  it.*
- **Lifecycle thinking** — Pruitt & Adlin's *Persona Lifecycle* (2006) — already established
  that personas should be living, versioned artifacts, not one-shot deliverables.

### The legitimate critiques (Indi Young, NN/G, others)

These critiques are load-bearing — BOSS needs to honor them:

- **LLMs produce averaged-internet stereotypes** (Young). The synthetic persona reflects
  training-data averages, not specific cohorts; critical nuances vanish.
- **"Synthetic users praise every concept; real users balance interest with concerns."**
  Cheerleading bias is the most-cited failure mode. *Sanity check on the v0.19 reactions:
  several personas DID push back (eng-builder, returning-founder, indie-hacker, first-product,
  vibe-virtuoso). The bias is real, but with explicit pushback instructions in the persona
  files we partially compensate. Test this assumption.*
- **LLMs cannot do behavior** — they can simulate language about behavior, not behavior
  itself. "Cannot use a product like a human does." This is the hard limit; no methodology
  fixes it.
- **The meaning problem (Young)** — *"ChatGPT does not communicate meaning — we infer it,
  with meaning arising only in the mind of the beholder."* This is the deepest critique. The
  persona reactions are *language about reactions*, not reactions themselves. Cheap; useful;
  *not the real thing*.

### Recent specifics worth tracking

- arXiv 2508.13047 — "Using AI for User Representation: An Analysis of 83 Persona Prompts"
  (2025). Academic survey of how persona prompts are being constructed in practice.
- arXiv 2509.12491 — "Good Vibrations? A Qualitative Study of Co-Creation, Communication,
  Flow, and Trust in Vibe Coding" (2025). The vibe-coding literature is just starting to touch
  persona work — this is the one paper that explicitly bridges them.
- Smashing Magazine (2025-12) — "Giving Users A Voice Through Virtual Personas." Practical
  patterns for using personas as design tools.

## What's actually novel in BOSS's frame (narrower than I first thought)

Five claims, each calibrated against the field:

### 1. Personas integrated INTO the build process via a loop primitive

**Field norm:** persona work happens UPSTREAM of build (research phase, then build, then
maybe revisit). Even the "balanced operating model" treats persona-research and product-build
as separate workflows that share data.

**BOSS's contribution:** the persona-reactions-loop is *part of every shipped capability*.
v0.19 demonstrated this on the conscience moment-1; the design says every v0.20+ release goes
through a persona-reactions pass before commit. The personas aren't documents you make once
and consult occasionally — they're an *eval channel running on every release*, parallel to
the conscience-evals (which test detection) and unit tests (which test code).

This pattern is **not in the published literature.** Worth claiming.

### 2. Cohort-aware product behavior driven BY persona signal

**Field norm:** personas inform DESIGN upstream of build, but the product behaves the same
for everyone. (Some segmentation exists, but it's typically business-rule based — not
persona-derived.)

**BOSS's contribution:** the v0.20 cohort-aware conscience direction uses persona reactions
to *drive product variants.* The model composing the conscience voice will read the project's
declared cohort (`.boss/config.json`) and tailor — first-product gets *teaching*; returning-
founder gets *harder question*; vibe-virtuoso gets *sharper architecture*. The personas are
not just informing design; they're *named drivers of behavior at runtime.*

This is also **not in the published literature** the way BOSS is framing it. The synthetic-
users vendors don't do this; the academic work surveys prompt patterns but doesn't tie them
to product behavior. Worth claiming.

### 3. Personas as evals with categorized failure modes (Husain discipline applied to qual)

**Field norm:** persona reactions are typically captured as free-form qualitative notes.
Useful for understanding; hard to regression-test.

**BOSS's contribution:** the v0.19 reactions doc structures each persona's response into the
same five fields (first feeling / what they'd do / where they bounced / what they'd want
different / real-founder test this informs) AND synthesizes across personas (convergences,
divergences, surprises) AND categorizes design changes as concrete deliverables. This is
**Husain's eval discipline applied to qualitative reactions** — failure modes named,
categorized, comparable across versions.

When the v0.20 cohort-aware conscience ships, the SAME 8 personas re-react to the SAME
scenario; the diff between v0.19 reactions and v0.20 reactions IS the design measurement.
That's an actual regression test for qualitative experience.

**Possibly novel.** Need to look at whether IxDF or similar has formalized structured persona
reactions; my read is they haven't.

### 4. The override-and-record discipline applied to persona DISAGREEMENT

**Field norm:** when a team disagrees with a persona reaction, they typically just dismiss
it. ("That persona is wrong about this.") No record; no learning.

**BOSS's contribution:** when the team (Ajesh) disagrees with a persona's reaction, IDEA-008's
override grammar applies — *"this reaction was discounted because <substantive reason>."*
Recorded. Future-team can re-evaluate; the disagreement IS data. Same discipline as the
override of advisory-pass #1's real-founder-calls recommendation.

This is genuinely BOSS-specific — it's a downstream application of the IDEA-008 override
primitive. Not in the persona-research field.

### 5. Personas as remixable named-loop primitives

**Field norm:** persona templates are usually filled-out cards. Maybe a poster. Not composable
artifacts.

**BOSS's contribution:** each persona is an agent (`.claude/agents/persona-*.md`) AND a
participant in named loops. Founders can fork the 8 BOSS-default personas, edit for their
domain (`persona-pet-grooming-founder.md`? `persona-municipal-policy-staff.md`?), author new
ones, and contribute back via `/boss-learn` UP into `library/personas/`. The persona library
grows from real practice across projects.

This is a direct application of IDEA-008's remix model. Not in the persona-research field —
but it's not BOSS's invention either; it's IDEA-008 applied. Worth claiming as a *combined*
contribution.

## The shape of what BOSS could publish (eventually)

Honest scope: BOSS isn't inventing AI personas as a category. The contribution is a *specific
methodology* sitting at the intersection of:

- IDEA-008's loop primitive + remix model (BOSS-original)
- Husain's eval discipline (existing — applied to qual reactions)
- The "persona evidence ledger" pattern (existing — applied per-persona)
- Cohort-aware runtime behavior driven by persona signal (BOSS-original framing)
- Synthetic/real attribution discipline (existing)

Combined into a coherent practice: ***personas as evolving, versioned, build-integrated, eval-
channel, cohort-aware, remixable research instruments.***

What this would look like written up:

- **Title candidates:** *"Living personas: a build-integrated practice"* / *"Personas as code:
  the evolving-instrument pattern"* / *"From synthetic to real: a continuity discipline for
  AI personas."*
- **Venue:** likely `library/practices/` as a BOSS practice doc (first), promotable to a
  blog post / arXiv when the practice has been used on 3+ real projects (not just BOSS-on-
  BOSS).
- **Acknowledgements explicit:** NN/Group on synthetic-user limits, Indi Young on meaning,
  Pruitt & Adlin on lifecycle, Mollick on AI-as-different-roles, Husain on evals, IDEA-008.

## Concrete next moves (if this idea graduates)

### Phase 1 — light retrofit to existing personas (LANDED 2026-05-23)

**Done.** All 8 persona files now carry an `## Evidence ledger` section with three subsections:

- **Synthetic (calibrated reads — current weight: N%)** — what's based on cohort archetype +
  Claude's reading. Today: 100% for all 8.
- **Real (real-founder evidence — current weight: N%)** — empty for all 8 today; awaits
  override-lift on advisory-pass #1. Goal is for this section to GROW as the synthetic
  section SHRINKS into the persona body via refactoring.
- **Notable refactors** — dated bullets when real evidence reshapes the persona.

Each persona's ledger names *its specific* synthetic source, and several name *what real
evidence would most challenge or validate this archetype* (so the next-step is concrete when
real evidence arrives).

Per-persona notes added in the retrofit:
- `persona-first-product`: explicitly flagged that LLM training data is biased toward
  experienced voices — *this cohort needs real evidence disproportionately*.
- `persona-vibe-virtuoso`: this cohort is observable on public timelines (Twitter/X build-in-
  public culture), so synthetic reads have more grounding than most.
- `persona-indie-hacker`: BOSS's stated shape (calm-company / OSS default) aims at this
  cohort; if persona reactions converge with real signal, positioning is landing; if not,
  the positioning is drifting and real evidence will reveal it.
- `persona-returning-founder`: the v0.19 reaction surfaced a load-bearing prediction
  (*"wants a HARDER question, not softer"*) that drives v0.20's cohort-aware conscience
  design. *If real evidence contradicts this, the v0.20 design assumption was wrong.*
- `persona-domain-expert`: flagged that domain-specific stakes (regulatory, safety, ethical)
  are NOT in LLM training data with enough specificity; synthetic reads will MISS critical
  nuance. *Eventually may split into domain-specific personas (medical, legal, financial)
  once real evidence justifies the split.*

### Phase 2 — make personas first-class loop participants (v0.20+)

When cohort-aware conscience ships (v0.20), persona files declare which cohort they represent
in frontmatter (`cohort_id`). The `.boss/config.json` declares the project's cohort. The
conscience runtime reads BOTH to compose the voice.

### Phase 3 — author the practice doc (v0.24+ — externalization)

In `library/practices/personas-as-evolving-instruments.md`. Cites the field honestly. Claims
the specific contribution narrowly. Documents the lifecycle, the synthetic/real attribution,
the build-integration via loops, the cohort-aware behavior pattern.

### Phase 4 — share externally (v0.25+)

Blog post + possibly an arXiv preprint if BOSS has run this on 3+ external projects by then.
Conference talk if the practice surfaces interesting field-level questions.

## What this idea does NOT do

- It does **not** claim BOSS invented AI personas. It didn't.
- It does **not** claim BOSS solved the cheerleading-bias problem. Partial mitigation (explicit
  pushback instructions in persona files) — not a solve.
- It does **not** claim personas can substitute for real-founder research. Young's meaning
  critique stands.
- It does **not** propose shipping the practice externally until BOSS has used it on > 1
  project (BOSS itself + at least 2-3 external). Don't preach what we haven't lived.

## Open questions

- **Cheerleading-bias test:** the v0.19 reactions HAD pushback (especially first-product and
  vibe-virtuoso). Is that because the persona files explicitly instructed pushback, or because
  Claude happened to produce pushback this time? *We could test by re-running v0.19 reactions
  with the pushback instructions stripped — does the cheerleading bias re-emerge?*
- **Real-evidence integration mechanism:** when a real-founder call eventually happens
  (override lifts), HOW does the evidence land in the persona file? Manual update? A skill
  (`/persona-update`)? A loop?
- **Persona drift over time:** as a persona file accumulates evidence, does it become more
  accurate, or does it drift away from the original cohort archetype? Versioning helps but
  doesn't answer this fully.
- **Cross-project persona library:** if 5 projects each fork `persona-vibe-coder-newbie` and
  evolve it differently, how do their evolutions converge back into the library? `/boss-learn`
  pulls UP, but conflict-resolution for personas is harder than for skills/agents.
- **The publishability question:** should BOSS publish the methodology now (before any
  external project has used it) — riskier, but potentially establishes a name — or wait?
  Leaning toward wait. *Mentor-pitch's view: pitch comes after positioning earned.*

## Status

`exploring` — captured the field survey, named the narrow contribution, sketched the four
phases. **Not promoting to FEAT yet.** Phase 1 (light retrofit) can ship in v0.19.x as a docs
follow-up if Ajesh wants. Phase 2+ awaits v0.20+ work.

## Gate

**Re-open trigger:** BOSS has watched **three or more real founders** react to something — via
`/interview`, a live session, or an `EVID` record graded past `stated-pain`. That is this record's
own stated bar and it is the honest one: every phase past the light retrofit turns a synthetic
persona into an evidence-backed one, and there is no evidence to back it with yet.

Phase 1 (the light retrofit) stays cheap and remains available on request — parking the record is
not a refusal of the hour's work, it is a refusal to schedule the other three phases at n=0.

## Canvas

_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
