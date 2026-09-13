---
id: FEAT-021
type: feature
owner: product-lead
status: shipped
gist: The founding-team layer, slice by slice: /decide + DEC records, `boss team`, the owner lens, and the cut between what a team shares and what stays private.
program: founding-teams
from: IDEA-037
proof: stages/L0-quickstart/template/.claude/skills/decide
created: 2026-06-20
shipped_on: 2026-06-20
note: "Slices 1–5 shipped (v0.74–v0.85); slice 6 retired as ~90% already delivered (see build program). Functionally complete. The one held piece — an unprompted equity conscience-moment — waits on a real founding team, tracked in IDEA-037."
---

# FEAT-021 — Founder-layer slice 1: the decision log (`/decide` + `DEC-NNN`)

> Promoted from [IDEA-037](IDEA-037-boss-for-founding-teams.md) (BOSS for founding teams). Green-lit for
> full dev on **real-founder demand** (past-pain stories, not just wishes — see IDEA-037 §demand). The
> program is "start small, build it out fully": this is **slice 1 of a phased build** (map below). It's
> the foundational artifact every later slice records into, and it passes the solo test (ships value at
> n=1), so it is never team-only charity.

## The build program (IDEA-037, "build it out fully") — sequenced cheap → differentiated

1. **Decision log — `/decide` + `DEC-NNN`** ✅ *shipped v0.74.0; iterated v0.83.0* — ADR-lite shared decision
   record with a named decider (`@username`) + reversibility. **v0.83 added the cheap Falsifier ("what would
   prove this wrong, by when?") + `decided_by:` (AI-decision provenance) + reversibility-scaled ceremony +
   consent framing + a skeptic prompt** (the research's highest-leverage change — verification cost is the
   bottleneck, not accountability). Solo-valuable; the substrate for ownership/accountability/credit.
2. **Team-aware foundation** — *2a `boss team`* ✅ *shipped v0.75.0* (solo/team mode, `@github-username`
   identity, dormant-solo roster, `/welcome` asks at first-run). *2b owner lens* ✅ *shipped v0.76.0*
   (`boss board` reads `owner:`-as-person, shows it team-only + `--mine` + JSON field; no leaderboard).
3. **Keep-in-the-loop + the state cut** — *3a* ✅ *shipped v0.77.0* (the cut was ~90% already drawn —
   ventures commit `docs/` by default = backup + share; plugged the per-person leak so
   `.boss/brain/relationship.md` + `trace.jsonl` stay local; recorded as BOSS's own [`DEC-001`](DEC-001…),
   `read.md` shared / relationship per-person — Ajesh to confirm). *Deferred:* per-founder namespacing.
4. **Shared craft commons (Pain C, most differentiated)** ✅ *shipped v0.78.0* — `/practice` + `PRAC-NNN`:
   shared, attributed, **staleness-aware** craft learnings (`review_by:` + `/revalidate` = the team's
   defense against being outdated/expensive); recognition not a scoreboard.
5. **Mentor-the-team (Pain B)** — *5a `mentor-cofounder`* ✅ *shipped v0.81.0* (coaches the partnership across
   skill sets; folds in the AI-adoption-culture knowledge — Red-Light / psych-safety+standards / secret-cyborgs
   / no-workslop; wires the AI consent conversation into `boss team`; never takes a side). *5b* ✅ *shipped
   v0.85.0* — the **`coordination`** conscience moment (team + work + no joint `DEC` → watch the seam via
   artifacts, never satisfaction prompts; dormant-solo; never takes a side; eval 120/0). The **Red-Light**
   moment was *not* built as a hook (not predicate-gateable → over-fire trap) — it lives as a
   `mentor-cofounder` framing instead. **Slice 5 complete.**
6. **Credit + the ownership/equity moment** — *RETIRED (2026-06-20), not abandoned: ~90% already delivered.*
   On inspection, slice 6 dissolves: **ownership** ✅ shipped (2b `owner:`-as-person + board); **credit/
   provenance** ✅ already attributed per-artifact (every `owner:`/`decided_by:`/who-learned-it/git author —
   the research's "provenance-is-credit" is already true); the **equity conversation** ✅ covered by
   `mentor-cofounder` (surfaces it, points at a lawyer) + `/decide` (records it). What's left is *correctly
   not built*: an **aggregate `boss credits`** read = the leaderboard form, no solo value, the humane
   line — **don't build**; an **unprompted equity conscience-moment** = BOSS's first third-party-harm
   trigger, the worst solo-test profile, n=0 = the risk — **HOLD for a real founding team** (the
   `coordination` moment + `mentor-cofounder` already serve the need). **Nothing critically unblocked →
   FEAT-021 is functionally complete.**

## Research realignment (2026-06-20 — RESEARCH-COMPENDIUM / IDEA-037-founding-teams-ai-design-input)

A parallel research session produced evidence-grounded design input. Triaged: most sharpens FEAT-021
slices (below); the build-process/scaling material **spun out to [FEAT-023](FEAT-023-ai-native-build-process-and-scaling.md)**
(it applies to solo founders too — not team-specific). Three EVIDENCE pillars validate the whole bet:
AI accelerates individuals but **doesn't fix coordination** (456K-PR study); it **erodes the human seam
invisibly** (Ju & Aral RCT: −27% social comms, perceived quality flat); and **a decision log that only
assigns blame fails — verification cost is the bottleneck** (accountability-alone proven insufficient).
*Population caveat: no study is on non-technical/first-time cofounders — transfer the **mechanism**, never
a number. And the research re-confirms n=0 real teams is the actual risk; slice 6 has the worst solo-test
profile (only real use is a dispute) — build the evidence substrate only, get it in front of a real team.*

**Per-slice sharpenings (iterations owed on already-shipped slices + reshaped 5b/6):**
- **slice 1 `/decide` — iterate (THE highest-leverage change).** Add a **cheap-falsifier field** —
  *"what would prove this wrong, and by when?"* ("use X" → "if signups don't move by July, X was wrong").
  Stamp **who decided** (founder / AI-suggested-then-ratified / AI-autonomous — makes over-delegation of
  load-bearing calls visible). **Reversibility-scaled** (reversible = one line; one-way = force the
  falsifier + alternatives weighed). A **mild skeptic prompt** at irreversible *AI-suggested* decisions
  ("this came from the model — what would you check before you can't undo it?"). **Never a hard block**
  (forced verification *backfired* in the evidence). Add **consent / "safe enough to try"** (sociocracy) as
  the partner to the reversibility flag — gives the non-tech cofounder language to consent to a reversible
  call without fully evaluating it. *Solo-valuable → passes the solo test.*
- **slice 4 `/practice` — iterate.** `builds-on PRAC-NNN` links (collective-reasoning visibility); role/
  relevance tags → **ONE shared store, role-filtered** (the evidence says *not* two stores); keep records
  **metaphor-neutral** (cofounders hold divergent metaphors for their AI).
- **slice 5a `mentor-cofounder` — iterate** (shipped v0.81; cite ai-adoption + RVW-035 ✅). Add **Team Flow's
  7 prerequisites** (esp. *aligned personal goals* → a `/decide` prompt), **task-vs-relationship conflict
  framing** (name a tension as a task disagreement, never personal — now the *cited* backbone of the
  pick-no-side rule), **swift-trust = small kept commitments + predictable comms** (a behavior the mentor
  can nudge, not "rapport").
- **slice 5b conscience (teams) — reshaped, not just the Red-Light moment.** Watch the relational channel
  via **in-repo artifacts, NOT a "how's teamwork?" prompt** (self-report is proven blind): signal = work
  flowing *through the agent, around the cofounder* (one founder's solo velocity high + the shared log
  untouched by the other) → "you two haven't decided anything together in N sessions" *(weak-transfer —
  don't over-fire; a quiet log can mean they talked on a call)*. **Surface DEC contradiction at write-time**
  (not at merge). The **Red-Light moment** (from the ai-adoption handoff) is one detector in this family.
  Design against the **"moral crumple zone"** (AI-as-buffer keeps blame *off* a cofounder *without*
  dissolving ownership — **ownership = prompt-author intent + reviewer acceptance**, the industry-solved
  answer). All gate-evalled.
- **slice 6 `boss credits` + equity — reshaped (this is the "rethink").** Recognition/provenance is
  **solved + externally validated** (CRediT 14 roles · All Contributors ~32 kinds · **IBM already extended
  CRediT to AI** — split human direction/review from AI generation) — BOSS's "provenance not score" guard
  *is* the best practice. `boss credits` = a **read** at call time (no `credits.json`, no score/ranking),
  names contribution **kinds** (`direction`·`judgment`·`discovery`·`decision`·`craft`·`execution`·`review`
  — so the **non-tech founder's judgment is legible**, which a git-only tally under-credits), names **AI as
  a disclosed `execution` contributor** (never a principal/share). Equity = **refuse to score** (Wasserman:
  making relative worth legible-and-permanent *manufactures* the unfairness; vesting + an honest forward
  conversation already solves it); the **equity moment** = a **structural trigger** (2nd identity + no `DEC`
  on the split / a raise / a first hire), symmetric, once-ever, lands in the shared record, points at
  YC-Seibel + Wasserman + **a real attorney**, **never arbitrates**.
- **New team operating primitives (fold into FEAT-021):** a **one-page working agreement** (only two
  primitives — **Driver/Approver** who breaks the tie, and **consent**; *reject DACI/RACI/RAPID matrices*) +
  **declared response-time norms** (prevents misreading silence as conflict) + where shared state lives; a
  **blameless build-retro `/practice`** (Allspaw/Dekker — how not who, balanced so it keeps accountability)
  paired with the conscience's post-failure framing; **one** humane loneliness nudge (cofounders are
  "functionally alone with the most important things" — name the hard thing neither will say first), *not*
  a wellness feature.

## Goal (slice 1)

A founder (solo or duo) can record a load-bearing decision as a durable, referenceable `DEC-NNN` record —
Context / Decision / Why / Consequences — stamped with **who decided** (`@github-username`) and **how
reversible** it is, so the *rationale* survives (for future-you, and for a cofounder who wasn't in the room).

## Why ADR-lite (research + mentors)

- The research's single highest-leverage team artifact is a written decision log that captures the **why**
  (ADRs exist because rationale is the hardest thing to recover). Small, supersede-not-edit, match ceremony
  to reversibility (two-way vs one-way doors).
- **mentor-architect:** new ID `DEC-NNN`, home `docs/decisions/`, available in **L0** (decisions happen
  from day one), `owner:` doubles as the DRI, board projects it *only* as a `↻ review-due` flag (no new
  column). *He recommended folding capture into `/log` rather than a new skill;* **deviation recorded:** a
  dedicated, minimal `/decide` is built instead — green-lit full dev + a first-class artifact (own ID/home)
  reads clearer than a `/log` branch; splitting later would be the costly direction, so a clean skill now.

## Acceptance criteria

- [x] New ID type `DEC-NNN` documented in `docs/IDS.md`.
- [x] `/decide` skill in L0 template: creates `docs/decisions/DEC-NNN-<slug>.md` with the ADR-lite
      frontmatter (`id`, `type: decision`, `owner: @<decider>`, `status: decided`, `created`,
      `reversibility: reversible|costly|one-way`, optional `supersedes:`) + body (Context/Decision/Why/
      Consequences).
- [x] Decider resolved from the GitHub identity (`gh api user` → fallback `git config user.name`); never
      fabricated — blank/`@you` if unknown.
- [x] Skill registered in the L0 manifest; `boss map` shows it.
- [x] Superseding (not editing) an old decision works: new DEC with `supersedes:`, old flips to
      `status: superseded`.
- [x] Zero new deps. Skill-layer only (no `src/` change required for slice 1).

## Smoke (how we know it's alive)

In a `/tmp` scaffold: `boss new`, confirm the `decide` skill is present in the L0 template + listed by
`boss map`; create a `DEC-001` by hand following the skill's recipe; confirm frontmatter parses and the
file lands in `docs/decisions/`. (No runtime code path to exercise — slice 1 is a skill + convention.)

## Deferred to later slices (named, not missed)

Board `↻ review-due` projection of decisions (slice 2, with the board work) · `owner:`-as-person across all
artifacts (slice 2) · `boss credits` + the equity moment (slice 6, humane-gated) · the shared/personal
state cut (slice 3, recorded as its own DEC).
