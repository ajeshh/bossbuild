---
id: COMP-founder-plugins-source-read
type: competition
owner: product-lead
status: living
sort: watch
checked: 2026-09-11
source: four repos cloned at HEAD and read at the file level 2026-09-11 — arslan70/haytham, lenar-amirov/product-pipeline-public, sohaibt/founder-mode, ice-ice-bear/harnesskit; LEGO-SUDO/personal-council returns 404 (repo gone) and is read from its marketplace.json description only
updated: 2026-09-11
---

# Five founder plugins, read at the source — what BOSS should learn, adopt, or refuse

> **Why this file exists.** [claude-plugin-field.md](claude-plugin-field.md) read these rivals at
> README depth. Ajesh, 2026-09-11: *"see what we could potentially learn and improve or are good
> ideas to integrate… we may also not be doing things that they are, but we shd do it."* So this
> pass opens the skills, the hooks, the design docs and the retirement notes — and, before naming
> any gap, **greps BOSS for whether it already does the thing.** Several "gaps" from the shallow
> read turned out to exist in BOSS already; they are listed as confirmations, with the file that
> holds them, so nobody re-proposes them.
>
> **What could not be read.** `personal-council` is gone from GitHub (404 on the repo and on the
> author's account). Everything said about it below is from its 60-word marketplace description
> and from its nearest readable kin (Karpathy's llm-council shape, Balogh's *Council* plugin). Treat
> it as a *lens*, not a rival.

## The one-paragraph read

Two of the five are alive and thoughtful (haytham, product-discovery); both **subtracted their
way to what they are** — haytham cut 23 agents to 10 and retired its "control plane" ambition;
product-discovery retired its workflow templates *and its Claude Code plugin*. Both keep a written
record of what they tried and abandoned, and both records read like BOSS's own memory notes.
founder-mode is twelve stateless framework prompts for a scale-stage CEO — the wrong rung for
BOSS's cohort, with two lenses worth borrowing. harnesskit is a code-harness with one genuinely
new idea for BOSS (re-fitting the guardrail level from observed behaviour). personal-council's
one idea — voices that cannot see each other's drafts — BOSS already has by construction and
lacks the second half of.

---

## haytham — `arslan70/haytham` · ★13 · MIT · retired to a personal tool 2026-07

**What it actually is (from source).** Four phases, each a command that orchestrates named
subagents and writes files under `.haytham/session/`; a `PreToolUse` hook on `Agent` blocks a
phase-2 agent from launching until `phase-1-why/gate-decision.json` exists
(`scripts/check_phase_prereqs.sh`); a `PostToolUse` hook on `Write` schema-validates every
output. Verdict = GO / PIVOT / NO-GO with a composite score. `AGENTS.md` (their CLAUDE.md) is the
most useful document in the five repos: a "collaboration stance", a constitution, eight
*PITFALL* sections with numbers, and "Agent UX Standards".

**What BOSS already does, verified.**
- *Say the idea back.* `/boss` step 2 reflects What / Who / Smallest-version *"in their words… don't
  smooth it"* ([SKILL.md:47-56](../../stages/L0-quickstart/template/.claude/skills/boss/SKILL.md)),
  and step 3.5 stops for *"ready to build, or is there more?"* (v0.214.0). haytham's Step 1 digest
  is the same move with more fields.
- *LLM judges; hooks enforce.* haytham's PITFALL *"never let LLM text override deterministic
  rules"* is BOSS's predicate-gated conscience — regex opens the door, the model walks through
  ([focus-loop.md](../../stages/L1-mvp/template/docs/loops/focus-loop.md)).
- *Never fabricate a number.* haytham: *"tag as [estimate: basis]"*. BOSS's canvas People cell:
  *"a number you cannot say the source of out loud does not go in this cell."*
- *Roadmap first / frame every agent call in plain language / guided review questions with a
  low-effort escape* — BOSS's skills mostly do this; worth a voice-keeper sweep rather than a rule.

**What BOSS does not do, and should consider.**

1. 🔴 **Ask the founder's own intent at intake.** haytham's Step 0 asks three things before any
   analysis — *why are you building this* (learning / revenue / community / credibility / own
   problem), *what does success look like in 3 months*, *what are you working with* (solo +
   bootstrapped / funded / small team) — writes them to `founder_context`, and **every downstream
   agent calibrates to them**: a `learning` founder gets no revenue tables; `community` motivation
   is not scored on willingness-to-pay
   ([report-synthesizer.md](https://github.com/arslan70/haytham/blob/main/agents/report-synthesizer.md),
   "Founder Intent Calibration"). BOSS asks What / Who / Smallest — never *why you*, never *what
   success means to you*. `grep -ri motivation stages/ src/` finds one hit, and it is `/idea`'s rule
   *never to invent one*. The canvas gets at the venture's model (the *"if it won't earn"* branch,
   DEC-011's company / co-op / commons) — but that is the *venture's* shape at canvas time, not the
   *founder's* motivation at intake, and the conscience's evidence-ladder nudges assume a
   founder who wants a paying customer. **This is the single cheapest thing in the five repos**:
   one line in `/boss` 3.5, one field the brain and the mentors read. It is also squarely on the
   *BOSS emits and never mirrors* axis — asking why is the mirror.
2. **Surface the interpretation you chose.** `idea-analyst` flags up to three ambiguous terms with
   *the reading it took, the alternatives, and why it matters* (`term_flags`), and proceeds — it
   does not stop to ask. BOSS's reflection could carry the same one line: *"I read 'members' as
   paying subscribers; if it's a closed community, say so."* Cheaper than a question, and exactly
   the *"no, it's actually…"* the `/boss` skill already says is its best tool.
3. **A concept anchor that downstream skills must not genericize.** haytham's #1 failure mode
   across 29 ADRs was *"progressive genericization"* — each agent hedges, and by phase 3 *"a gym
   leaderboard with anonymous handles"* has become *"a community engagement platform with privacy
   features."* Their fix: extract the founder's specific nouns/verbs/constraints once, pass them
   unchanged to every agent, post-check they survive. BOSS's `Current shape` + `gist:` is the
   anchor; nothing checks that `/canvas`, `/spec`, `/landing` still use those words. **Cheap
   check, not a build:** the `voice-keeper`/`check:refs` family could grep a FEAT or landing page
   for the IDEA's gist nouns. Measure the gap before building the gate.
4. **Load-bearing assumptions, plural, each graded.** haytham's report ends with *"Of N
   assumptions, X Supported, Y Belief, Z Untested"* and refuses a composite above 3.5 when zero are
   Supported. BOSS grades *evidence* (three rungs) and links each EVID to **one** assumption
   (`assumption:` in frontmatter). The canvas asks to *"rank the assumptions that could kill the
   idea"* and then only the top one ever gets a ledger. **Composable, not new:** group EVIDs by
   `assumption:`, render highest-grade-per-assumption in `boss status`. Low priority until a
   founder has more than one assumption under test — today nobody has.

**Outside evidence that supports BOSS's existing design (cite it).**
- ADR-026: a single agent with full context scored **8 PASS / 4 PARTIAL / 0 FAIL** on report
  quality; a 4-agent + 6-validator pipeline on the same inputs scored **1 / 3 / 8**. *"If you're
  adding a validator to fix disagreements between two agents, you have an architecture problem."*
  This is the argument for `/consult` synthesizing in one place and against ever splitting the
  conscience's judgment across agents. Gathering: split. Synthesizing: don't.
- ADR-023: *"if you can't name the upstream data that populates a score, delete the score"* —
  three of eight scoring dimensions were being hallucinated. This is BOSS's n=20 denominator
  lesson stated as a design rule before the fact. Belongs in `library/practices/` as a sentence.
- ADR-029's honest trade-off list for going plugin-shaped: instruction-following replaces a state
  machine, *"probabilistic, not guaranteed"*; their mitigations are exactly BOSS's — file
  checkpoints, hook validation, prerequisite checks.

**Refuse.**
- **The verdict.** GO / NO-GO from model-generated market research graded as evidence. The canvas
  says it in one line — *"Coverage is a fact; readiness is a verdict. BOSS never renders a verdict
  about your venture"* ([canvas SKILL.md:122](../../stages/L0-quickstart/template/.claude/skills/canvas/SKILL.md)).
  The ladder refuses synthetic research as an EVID. Founders *want* to be told; haytham's own
  README says *"That's the point."* BOSS's bet is that being told by a web search is the comfort
  device. n=0 on both sides.
- **Hard phase gates enforced by hook.** BOSS shows readiness at `boss unlock` and lets the
  founder walk; the one hard gate it keeps is the one-pager needing ≥1 EVID. Keep that ratio.

---

## product-discovery — `lenar-amirov/product-pipeline-public` · ★12 · MIT · alive (1.4.1, 2026-07-20)

**What it actually is (from source).** A cloned repo you work *inside*; `SessionStart` runs
`status.py` (dashboard) + `scan-initiatives.py` (cross-initiative digest) + `validate-evidence.py`
(audit). State is `hypotheses.json` — a registry where every hypothesis carries `type`
(REAL / SYNTHETIC / INFERRED / AMBIGUOUS), a confidence range **enforced per type** (REAL 0.6–1.0,
SYNTHETIC 0.2–0.4), sources required for REAL, and **a history of every transition**. The rule
that makes it work: *"A finding that lives only in a markdown file is invisible to the coverage
map, the gates, and `/next`"* (`.claude/rules/evidence-typing.md`). Gates have machine
preconditions (≥2 REAL-confirmed hypotheses, no unreconciled contradictions, frame set).

**What BOSS already does, verified.**
- *Re-entry.* `src/orientation.js` — the how-long-away / what-was-I-doing read (v0.231.0).
- *Progress from state, never from commands run.* `src/readiness.js` (IDEA-076) computes each
  rung's bar from durable records, can go back to unmet, has `unknown` as a first-class state.
- *Remember what the founder did with advice.* `.boss/brain/relationship.md` — what the conscience
  said and whether the founder acted / ignored / overrode; `OVERRIDE:` grammar in the devlog.
  product-discovery's `.product-corrections.md` is the same object, PM-flavoured.
- *Synthetic is not real.* `/persona` carries an explicit ledger *"synthetic <N%> · real <N%>
  (starts 100% synthetic)"* and calls a repo-derived persona *synthetic*. BOSS types it; it just
  refuses to let it into `docs/evidence/`.
- *Jobs, not steps.* Their 1.3→1.4 redesign — *"you come with a moment… call the matching job"*,
  numbered pipeline demoted to internal structure, templates retired — is where BOSS started.

**What BOSS does not do, and should consider.**

5. 🔴 **Value before the scaffold.** Their FIRST-LAUNCH rule: run the matching job on whatever the
   founder typed, *deliver the artifact in the chat*, and only then offer *"save this as an
   initiative?"* — *"An unsaved good answer beats a saved empty scaffold."* Design target: **TTFV
   ≤ 60 seconds**. BOSS's front door is `boss new` (scaffold: repo, licence, cohort) → open Claude →
   `/boss` (the reflection). EVID-003 — *"jumped straight into building rather than saying back what
   the idea was"* — and EVID-002 — *"the value is not being seen"* — are both this ordering.
   v0.214.0 moved the reflection ahead of the *paperwork questions*; it did not move it ahead of the
   *scaffold*. The v0.302.0 plugin makes the reorder possible for the first time: `/boss:welcome`
   can hear the idea and say it back **before** `boss new` runs. **Not a build — a design question
   for IDEA-096/DEC-017's next slice, and the strongest candidate in this file for the "mirror"
   axis.**
6. **Don't re-explain the frame.** `CONTEXT.md` holds metric / segment / baseline / constraints
   *"never re-explained"*, and the digest surfaces overlap with a *past* initiative before a new one
   starts (*"you have an active initiative targeting the same segment"*). BOSS is per-project;
   `~/.boss/registry.json` knows every project on the machine and `boss insights` reads them, but
   nothing says *"your IDEA-004 in `other-project` had this problem too."* Composable from what
   exists; worth it only once a founder has two ventures. Park.
7. **External dependencies with an owner and a date.** `status.json → dependencies[]` — work
   waiting on someone else, flagged OVERDUE on the dashboard. BOSS has no object for *"waiting on
   the lawyer / the API key / the pilot customer's reply."* `/money` and `/interview` both generate
   exactly these waits. A one-line `waiting_on:` in the FEAT/IDEA frontmatter that `boss status`
   renders would do it. Small; real; not urgent at n=0.

**The plugin they killed — read this before the 90-day recheck of DEC-017.**
`docs/ONE-PATH-1.4.md` (2026-07-06, in Russian) deletes their `.claude-plugin/` for three stated
reasons: (1) Claude Code does not load a plugin's CLAUDE.md into the user's project, so the plugin
was a wrapper around "copy files"; (2) marketplace auto-updates never reach scaffolded projects —
*"the format's main promise is an illusion here"*; (3) maintenance — a 222-line installer, two
manifests, a version bump every release, and **two desyncs that shipped** (fixed in 1.0.1). They
kept git-clone as the single path and named the accepted risk: losing the marketplace as a
*discovery* channel — *"reversible: a thin plugin returns in a day."*

BOSS's v0.302.0 plugin is that thin plugin, and it dodges each reason by construction: it carries
no CLAUDE.md (one skill + `bin/` on PATH); a plugin update ships the new **CLI**, and `boss sync`
is how a scaffolded project catches up — the two update paths compose instead of competing; and the
release gate already checks `plugin.json` version against `VERSION` (the n=19 lesson). **What to
carry into the recheck:** their reason (2) as a test — *does a founder who installed via plugin
actually run `boss sync`?* — and their honest note that the marketplace is a discovery channel
whose conversion nobody has measured. Same n=0.

**Refuse.**
- **The coverage counter.** `Frame 2/4 · Evidence 3/3 · Solution 0/2` is exactly the *"2 of 3"*
  `readiness.js` refuses (IDEA-065). Be fair about why: theirs is computed from state and *can go
  down*, so it is not a comfort device in the streak sense. BOSS's objection is to the counter
  *form* — a number invites optimizing the number. Decided; untested on both sides.
- **SYNTHETIC as an admissible evidence type.** Capping it at 0.4 is more honest than most tools,
  but it still lets a persona simulation sit in the same registry as an interview. BOSS's ladder
  keeps synthetic out of `docs/evidence/` and inside `/persona`'s own ledger. Keep the wall.
- **Your work lives in their folder.** Structural; their README admits it.

---

## founder-mode — `sohaibt/founder-mode` · ★3 · MIT · one commit, 2026-04-21

**What it actually is (from source).** Twelve `SKILL.md` files, each a scoring framework with
`$ARGUMENTS` and no state — founder-audit (7 dimensions, 1–10), org-health, hiring-scorecard,
review-cadence, skip-level-planner, delegation-scorer, crisis-catalyst, launch-story, founder-quiz,
decision-check, bureaucracy-detector, add-a-zero. Six primary sources (Chesky, Graham, YC). Well
written; nothing persists; nothing reads the project.

**Wrong rung, on purpose.** Ten of twelve are for a CEO with layers to skip and executives to
score. BOSS's `mentor-hiring` defaults to *"not yet"* for the same reason. Not a rival for anyone
BOSS has evidence of.

**Two lenses worth folding into mentors, not skills.**

8. **`add-a-zero` → the 2x insight.** Multiply the goal by ten, list the five constraints that make
   it feel impossible, name three qualitatively different strategies — then the real product:
   *"after thinking about 10x, what becomes obvious about 2x, and why couldn't you see it?"* This is
   a `mentor-founder` / `mentor-customers` move for a stuck growth question, not a command. One
   paragraph in the agent prompt.
9. **`bureaucracy-detector`'s last line, turned on BOSS.** Twelve anti-patterns, then: *"9–12:
   Kill it. Or just stop doing it and see what breaks."* BOSS is at 48 skills / 19 loops with a
   standing mandate to *compose and subtract*, and the two alive rivals in this file both
   subtracted their way to health. **The question for `/extract` or the next `/retro`: which
   skills, if stopped, would nobody notice?** `boss insights` can already say which have never been
   run on this machine. That is the denominator to measure before any 49th skill.

Also noted: `decision-check`'s *two-way door* test is `/decide`'s reversibility stamp; `launch-story`'s
*"the story dictates the product"* is the canvas Promises cell feeding `/landing`. Confirmations.

---

## harnesskit — `ice-ice-bear/harnesskit` · ★2 · MIT · 0.4.3, quiet since 2026-05

**What it actually is (from source).** Detect → Configure → Observe → Improve. Zero-token
bash+jq hooks on `SessionStart` / `PreToolUse` / `PostToolUse` / `Stop` log errors, tool-call
sequences and time-per-task-type to `.harnesskit/`; `/insights` (model) reads ten sessions of logs
and proposes skill / hook / rule changes as diffs; `/apply` executes them with an optional A/B
eval against the current state; `insights-history.json` prevents re-proposing rejected ideas.
Three presets — beginner / intermediate / advanced — set guardrail strictness, briefing verbosity,
and whether low-risk improvements auto-apply. 122 shell tests. A Korean-language "bible" of
harness principles.

**What BOSS already does, verified.**
- *Cheap gate, model only when open* — the conscience's predicate/judgment split is harnesskit's
  "zero-token hooks, Claude only for insights", arrived at independently.
- *Read your own trace, route to improvement* — `/judge-traces` → `/boss-learn` is `/insights` →
  `/apply` with a human in between.
- *"Marketplace first, customize later"* — IDEA-028's *rent the machinery, keep the judgment*.
- *Feature switching.* harnesskit counts `current-feature.txt` changes per session; BOSS's
  `focus-loop` reads the board's *shape* (≥4 FEATs building, none shipped) and lets the model tell
  scattered abandonment from legitimate parallel tracks. BOSS's is the better instrument for
  EVID-001's *"I forget what feature I'm building."*
- *Don't re-suggest what was declined* — `relationship.md` + `OVERRIDE:` entries.

**What BOSS does not do, and should consider.**

10. **Re-fit the cohort from behaviour — propose, never apply.** harnesskit's `/insights` §5
    upgrades a preset on *0 BLOCKs in 10 sessions AND >1 feature/session AND 0 repeated errors*,
    downgrades on *same error in 3 of 5 sessions OR failure rate > 50%*. BOSS declares `cohort`
    once in `.boss/config.json` and never revisits it, while the whole register (`/boss` 3.5's
    ordering, `/welcome`'s length, the conscience's tone) hangs on it. A `first-product` founder is
    not one six weeks later. **The humane shape is harnesskit's own:** a *proposal* the founder
    accepts, never a silent reclassification — BOSS's `read.md` rule that any opinion about the
    person must be inspectable applies. **Park until observed-behaviour evidence exists**; write the
    thresholds down when it does, and make them from records (`/close` count, EVID grades, FEATs
    shipped), not from tool-call telemetry BOSS refuses to collect (IDEA-021).
11. **Time-per-task-type.** Their session log buckets tool calls into task types and flags one
    eating >30% of time across 3+ sessions. BOSS's `.boss/trace.jsonl` could support the same read
    in `/judge-traces`. Only worth it if a founder ever asks *"where does my time go"* — none has.

**Refuse.** Guardrails on the code (confirm destructive ops, test-before-commit) — the host and
superpowers own that layer; BOSS's conscience is about the venture. Auto-apply of improvements —
BOSS's `/boss-learn` is a judgment, deliberately.

---

## personal-council — `LEGO-SUDO/personal-council` · **repo 404** · description only

**What its 60 words claim.** *"5-voice weighted think tank for founders… brutally honest 3-round
debate across three model lineages with a decision table that protects you from confirmation
bias without letting any single model dominate."* Kin: Karpathy's llm-council (propose →
cross-examine → synthesize, across providers); Balogh's *Council* plugin, whose stated reason is
that *one model writing five voices in one context knows what the other four will say — staged
disagreement.*

**What BOSS already does, verified.** `/consult` step 3 consults *each mentor's agent* separately
with the same question and context, and step 4 synthesizes *keeping the disagreement visible* —
so the five-strangers problem is solved by construction (isolated subagent contexts), and the
synthesis is single-context, which haytham's ADR-026 says is the right place for it.

**What BOSS does not do, and should consider.**

12. **A cross-examination round.** BOSS's mentors never see each other's takes; the synthesis sees
    all of them, but no mentor gets to *change their mind* on hearing another. The llm-council
    shape adds one round: each voice reads the others' first drafts and revises or rebuts. Cheap
    (one more subagent call per mentor), only when the first round actually split, and it turns
    *"where they disagree"* from a list into a movement. Worth a line in `/consult` step 3.5, gated
    on disagreement existing. Not weights — weighting seasoned advisors is the *averaging into
    mush* the skill already forbids.

**Accept, and name, the blind spot.** Three model lineages catch correlated errors one lineage
cannot see. BOSS is host-bound to one (by design — `library/practices/model-routing.md`). Its
answer is grounding in records and `/vet`, not model diversity. That is a real structural
limitation and belongs in the *Where we're weak* column, not hidden.

---

## The list, ranked — "things they do that we should"

| # | From | The thing | Shape in BOSS | Fits the mandate? |
|---|---|---|---|---|
| 1 | haytham | **Ask why you're building it, what success means to you, what you have** — at intake; mentors, canvas, conscience read it | one line in `/boss` 3.5 + a field the brain reads | ✅ compose; mirror axis; DEC-011 needs it |
| 5 | product-discovery | **Value before scaffold** — say the idea back before `boss new` | a design slice of IDEA-096 / DEC-017 via `/boss:welcome` | ✅ subtract ceremony; hits EVID-002 + EVID-003 directly |
| 2 | haytham | **Name the interpretation you chose** for an ambiguous term | one sentence in `/boss` step 2 | ✅ compose |
| 12 | personal-council | **One cross-examination round** in `/consult`, only when mentors split | a step 3.5 | ✅ compose; cheap |
| 9 | founder-mode | **"Stop doing it and see what breaks"** — measure never-run skills before skill 49 | a `/retro` question with `boss insights` as the denominator | ✅ this *is* the mandate |
| 3 | haytham | **Concept-anchor check** — do downstream artifacts still use the founder's nouns | a grep in `check:*`, after measuring the gap | ⚠️ measure first |
| 8 | founder-mode | **10x → 2x** as a mentor move | a paragraph in `mentor-founder` | ✅ tiny |
| 4 | haytham | **Assumptions plural, each with its best grade** | group EVIDs by `assumption:` in `boss status` | 🅿 park — nobody has two |
| 7 | product-discovery | **`waiting_on:` with owner + date** | frontmatter field + `boss status` line | 🅿 park |
| 10 | harnesskit | **Re-fit cohort from records — propose, never apply** | thresholds over `/close` / EVID / FEAT records | 🅿 park until observed-behaviour |
| 6 | product-discovery | Cross-project overlap at intake | **Ajesh 2026-09-11: too much — sharing between projects should be passive, on demand.** It already is, in two seams: `boss learn` pushes a proven pattern UP into the library and `boss sync` carries it to every other project; `/import <path>` pulls one record (a persona, a comp-eval, a practice) from a sibling project's `docs/` into this one. Nothing to build; the digest-style *detection* stays refused | ✅ exists — two seams, named |
| 11 | harnesskit | Time-per-task-type in `/judge-traces` | trace read | 🅿 park — nobody asked |

And two things to *cite*, not build: haytham's **8/4/0 vs 1/3/8** single-vs-split synthesis
result, and **"if you can't name the data that populates a score, delete the score"** — both
belong in `library/practices/` as outside evidence for rules BOSS already keeps.

## The refused list, so it stays refused

GO/NO-GO verdicts · synthetic research as evidence (even capped) · the coverage counter · hard
phase gates on more than the one-pager · founder-mode's scale-stage content · code-level
guardrails · auto-applied improvements · weighted voices · multi-provider routing (accepted
blind spot, named).

## Change log

- 2026-09-11 — filed. Four repos cloned and read at file level; personal-council unreadable
  (404) and evaluated from its description. Twelve candidates, five worth doing now, seven parked
  with the condition that would unpark them. Same day: Ajesh approved #1, #3, #4 (→ IDEA-097,
  IDEA-098), asked for the design on #2 (→ IDEA-099), and reframed #6 as passive sharing — which
  turned out to already exist (`boss learn` UP + `/import` across). Every "BOSS already does this" was verified against a
  file in `stages/` or `src/` the same day.
