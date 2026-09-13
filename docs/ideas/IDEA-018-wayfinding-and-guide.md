---
id: IDEA-018
type: idea
owner: product-lead
status: shipped
gist: There was no 'how to use BOSS' guide at all — the README is a pitch, not wayfinding, and nothing answered 'I ran boss new and typed /boss; now what?'
proof: docs/GUIDE.md
created: 2026-06-02
---

# Wayfinding + the "how to use BOSS" guide

## Occasion
- 2026-06-02 — A docs-health pass found the README had drifted **19 releases** (claimed v0.23.0 /
  23 releases / 5+7 skills; reality v0.42.0 / 6+13). Fixed in the same session. But the deeper
  finding: there is **no "how to use BOSS" guide at all** — the README is the entire user-facing
  surface, and it's a *pitch*, not wayfinding. Nothing answers "I ran `boss new`, typed `/boss` —
  now what?", no skill reference, no map, no who-to-ask routing.

## The framing that decides the shape (load-bearing)
- **The trap is the matrix.** Three axes — personas (8 cohorts), aspects (business / eng / design /
  GTM), modes (4) — cross to an 8×4×N manual nobody reads and we can't maintain.
- **A heavy guide contradicts BOSS's own pitch** ("Not a framework you have to learn. First hour:
  `boss new`, `/boss`, `/triage`") and **fails R&H #1** (BOSS bloats into ceremony). So the guide
  must itself be **JIT and minimal — wayfinding, not manual.** BOSS's own discipline applied to
  BOSS's docs.
- **"Guide" is ~5 distinct doc-jobs** that want different shapes: onboard · map/cheatsheet ·
  mental-model · skill-reference · who-to-ask. Conflating them is why one drifting README felt like
  "all our docs." Separate them.

## Decisions locked (this session, with Ajesh)
1. **Spine = the mode ladder** (Quickstart → MVP → V1 → Scale). The other two axes are *overlays*,
   not backbones: **persona = entry filter** (where you start, how fast you climb); **aspect =
   who-to-ask** (the mentor per rung — *not* a chapter; a chapter would compete with the
   practitioner lineage and the mentors themselves). Rationale: the ladder is BOSS's core mechanic,
   it's linear/teachable, and it **rations content to your current rung** (you don't see MVP docs
   until you `unlock mvp`).
2. **Cheatsheet = both** a generated static poster **and** a live `boss map` command. Static = the
   wall-poster for README/website (someone pre-install). Live = `boss map` renders *your* rung +
   what's one unlock away, always accurate. Follows the **`boss board` precedent** (render state,
   own nothing) — a static-only sheet would lie about what's available *to you* and rot.
3. **Audience = split.** `boss map` (a command) ships into every founder project. GUIDE.md + static
   cheatsheet + skill-reference live in the **BOSS repo + website** for evaluators/new users. A
   founder in their own project gets `/welcome` (live onboard) + `boss map` (live cheatsheet), **not
   a templated copy of the meta-guide** — avoids duplicating `/welcome`. (Founder-project
   distribution of the prose can be reconsidered once the shape is proven.)
4. **Scope = durable core first** (small, reversible — rule #7). Pass 1 builds the non-rotting
   machinery; the hand-written prose comes after, written *against* the generated surfaces.

## Artifact set (5 pieces; only ONE is hand-authored prose)
1. **`docs/GUIDE.md`** — the spine; the only judgment-heavy piece. Mode-ladder walkthrough; each rung
   answers exactly four things: *what it's for · the 2–3 skills you actually use · the signal you're
   ready to unlock next · which mentor to ask here.* Opens with a tiny **persona router** and a
   one-paragraph **mental model** (modes / conscience / loops / builders-vs-mentors — consolidated
   from PRINCIPLES + README, not re-derived). Ends pointing at `/welcome` as the live twin.
2. **`boss map` (CLI)** — live cheatsheet. Reads `.boss/` stamp + manifests → *You are here ·
   available now · one unlock away*. Reuses the `boss board` projection pattern.
3. **Static cheatsheet** — whole ladder at once, the poster. **Generated** from the same data.
4. **Skill reference** — one line per skill, grouped by mode. **Generated** from each `SKILL.md`
   frontmatter description.
5. **The generator** — `boss docs` verb (or `scripts/gen-docs.js`) emitting #3 + #4 from manifests +
   frontmatter. **This is the freshness fix** — the lists become a build artifact, not a memory
   test, so we never repeat the 19-release README rot.

## Best-practices threading
- `library/practices/` content stays put, surfaced JIT by the conscience. The guide links a
  **generated index** of practices per rung — never inlines them (that re-types Dunford/Ries the
  mentors already own). Rhymes with [[IDEA-017]]'s "ride the loop, don't freeze into a skill."

## Build sequence
- **A.** `boss map` + the generator → **B.** generate cheatsheet + skill-ref → **C.** write
  `GUIDE.md` against them → **D.** wire README ↔ GUIDE ↔ `/welcome` cross-links.
- **Pass 1 = A + B — SHIPPED v0.43.0.** `boss map` (CLI, ships to founders), `src/modes.js` (shared
  source), `scripts/gen-docs.js` (`npm run gen:docs`), `docs/CHEATSHEET.md` + `docs/SKILLS.md`
  (generated). Tested end-to-end in `/tmp`; eval suite clean; zero-dep held.
- **Pass 2 = C — SHIPPED 2026-06-02.** `docs/GUIDE.md` written against the generated surfaces:
  situational pace-group router (per [[IDEA-019]] — *situation not person*; 4 groups), one-paragraph
  mental model (consolidated from PRINCIPLES' pseudo-app-vs-real-business spine), per-rung walk (what
  it's for · few skills you actually use · climb signal · who to ask), mentor-routing table, two
  "remember" beats. Repo-level (not templated to founders, per the split-audience decision); points
  *at* `/welcome` + `boss map` rather than duplicating them.
- **Pass D — DONE 2026-06-02.** README → GUIDE pointer added; generated CHEATSHEET already links
  GUIDE. `/welcome` deliberately NOT linked to GUIDE (founders don't have the repo-level file; their
  in-project surfaces are `/welcome` + `boss map`). Wayfinding arc complete.

## Open questions (carried forward)
- **Freshness enforcement:** is a generated-doc staleness check worth a moment/loop (the way
  `cost-stale` fires), or is "regenerate on release" + a CI check enough? (Don't over-build — the
  19-release rot happened with *zero* mechanism; even a CI diff-check is a large step up.)
- **`boss map` vs `/welcome --map`:** the live cheatsheet as a CLI verb (works before opening Claude)
  vs a skill flag (in-session). Leaning CLI verb for parity with `boss board`/`boss status`.
- **Does the static poster want a real visual** (SVG/HTML render, like the deferred `boss board
  --html`) or is a generated markdown table enough for v1? Start markdown; earn the visual.
- **Persona router depth:** 8 cohorts collapse to ~3–4 pace-groups (fast-skip / standard / mentor-
  heavy / high-stakes). Confirm the grouping when writing GUIDE.md so it doesn't bloat to 8 paths.
  **Decided 2026-06-02 (see [[IDEA-019]]):** the GUIDE persona-router uses **situation-based**
  pace-groups, never character-portraits — *describe the situation, never the person* (turnstile, not
  tattoo; zero BOSS jargon). The richer "founder-facing personas" idea got reframed into a separate,
  deferred recruiting surface (IDEA-019); the GUIDE only needs the lightweight situational router.

## Canvas
_Covered by BOSS's overall canvas ([CANVAS.md](CANVAS.md))._
