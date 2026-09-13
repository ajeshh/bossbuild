---
id: IDEA-037
type: idea
owner: product-lead
status: building (slices 1–5a shipped via FEAT-021; the rest gated on a real team, n=0)
program: founding-teams
promoted_to: FEAT-021, FEAT-023
proof: stages/L1-mvp/template/.claude/agents/mentor-cofounder.md
proof_note: Slices 1–5a shipped (`/decide`, `/practice`, `mentor-cofounder`, coordination-loop). Slice 6 — the non-tech cofounder's no-terminal door — is the distinctive, harder half and is gated on a real team. n=0 today; demand is the risk, not the build.
created: 2026-06-20
---

# IDEA-037 — BOSS for founding teams (two+ cofounders, incl. tech + non-tech, distributed)

> Seed: Ajesh, 2026-06-20 — *"can BOSS be used by teams? 2 cofounders, one tech one non-tech, not
> colocated, both on GitHub. How do we make BOSS team-usable?"* Then: *"capture the idea — needs full
> assessment — and research best practices for how teams could and should share, or how to think about
> this."* So this file is the holding pen + the assessment brief. **Capture, don't build** (CLAUDE.md #3).
> Research pass → [SESSION-2026-06-20-founding-teams](../research/sessions/SESSION-2026-06-20-founding-teams.md).

## Why this is a real gap (the diagnosis)

> **↔ [[IDEA-082]] is this record with the direction reversed** (captured 2026-09-08). Every
> scenario below has the **founder** inviting someone in. IDEA-082 covers the joiner who brings BOSS
> to a venture that does not have it — a different first command (`boss adopt`), and a person the
> roster below structurally cannot express, because `addCollaborator` only ever adds *someone else*.


BOSS today is **single-founder, single-machine by construction** — not by accident:

- `/.boss/` is gitignored ([.gitignore:29](../../.gitignore)) — the board, the **venture brain**
  (`read.md` / `relationship.md`), `conscience-log.jsonl`, `trace.jsonl` never travel.
- The registry is machine-local (`~/.boss/registry.json`, out of the repo since v0.7).
- `docs/RESUME.md`, `docs/ideas/`, the canvas, research — all gitignored working material.

So the only thing two cofounders share today is the **product code** (via GitHub). The entire BOSS
*layer* — canvas, ideas, board, conscience, brain — is invisible to the second person. The conscience's
`relationship.md` learns *what it said to you and what you did with it* — single-voice by design
([[IDEA-022]] FEAT-022).

## The reframe: "teams" is two problems wearing one coat

**Problem 1 — shared venture state (the easy half).** Both on GitHub, both want the same canvas / board
/ ideas / specs. This is *almost* a non-problem because git is already the substrate. The work isn't
building sync — it's a **decision: what is venture-level (travels) vs. founder-level (stays local)?**
This state cut is the load-bearing open question for the whole idea.
- *Venture-level, should travel:* canvas, specs, ideas/INDEX, the board projection — facts about the
  company. Today gitignored as "working material"; for a team some of that line moves.
- *Founder-level, must stay local:* `relationship.md`, your trace, your conscience-log — per-person by
  their nature. Sharing them is a category error (and a humane-lens problem — see below).

**Problem 2 — the non-technical cofounder (the hard half, and the opportunity).** BOSS lives *inside
Claude Code* = a terminal/IDE. A non-technical cofounder may never open one. So tech+non-tech "team
support" is not a sync feature — it's an **interface** problem: the non-tech person needs a door that
isn't the CLI (a rendered board — `boss board --html` already exists — a readable canvas, a way to drop
an idea or react to a spec without `/spec`). This is where BOSS could be genuinely distinctive: the
tech+non-tech founding pair is real and underserved, and a *shared conscience that holds the venture's
memory* is **more** valuable when two heads disagree than when there's one.

## The traps to refuse (restraint — Principle 2 + "build the view, refuse the app")

- **No server, no accounts, no multiplayer state daemon.** The moment BOSS needs a backend to be a team
  tool it stops being zero-dep and stops being calm. Same call the board already made ([[IDEA-034]]):
  build the view, refuse the app.
- **The conscience must not become a cofounder-arbitrator.** "Whose `relationship.md`?" has a humane
  answer: the conscience speaks to a *person*, learns per-person, and **never adjudicates between two
  founders**. It can surface a tension both can see; it can't pick a winner. mentor-humane overrides
  anything that drifts there (the override is over mentors, never over a founder — v0.71.0).
- **Don't let "team mode" become premature ceremony** at n=0 real teams (twin of [[IDEA-019]]/[[IDEA-021]]:
  demand is the risk, not features).

## Go / no-go + the ownership · accountability · credit spine (Ajesh steer, 2026-06-20)

Ajesh corrected the framing: *non-tech founders can do git/CLI/VSCode now* — so the "second door" is a
nicety, not a blocker, and the interface objection (Problem 2) is **weaker than the first pass implied**.
He named the real scenarios + the real spine:
- **Solo → duo** (one starts; someone joins later).
- **Two friends starting together**, wanting to *ensure they're actually collaborating* on the idea.
- The spine: **extend ownership, accountability, and credit-where-credit-is-due for contribution.**

**Verdict: conditional GO** — but build a thin **founder layer**, not a "teams feature," gated by one test:

> **The solo test:** build only what *also* earns its place for a single founder at n=1. A duo benefits
> more, but the artifact must stand alone (your future self is the second "founder"). Anything that is
> pure team-overhead — that a solo founder gets nothing from — **defers** until a real duo exists (n=0).

This keeps BOSS honest at n=0 real teams while making the duo case real, because the spine maps onto
substrate BOSS **already has** — no server, no new infrastructure:

- **Ownership** = the `owner:` frontmatter that's *already on every doc* (IDEA/FEAT/spec/canvas), extended
  to name a **person** (DRI per decision — research: one named decider). Frontmatter-is-truth → the board
  can project *who owns what's in flight* the same way it projects status ([[IDEA-034]]/[[IDEA-015]]).
- **Accountability** = owner + a **shared decision log** + board projection. "Who decided this, why, and
  is it moving." The conscience may *surface* a stalled owned item — it **never arbitrates** between
  founders (the F18/F19 result; facilitate, don't pick a winner).
- **Credit** = **read the trace BOSS's work already leaves** — git author/log/blame over the venture's
  *artifacts* (ideas, specs, decisions), surfaced honestly ([[IDEA-021]]: read the trace, don't instrument
  the human). **Not a points system, not a leaderboard** (mentor-humane gate: credit-tracking turns
  competitive/surveillance fast). Honest contribution, not gamified throughput.

## The fuller arc — contribution → credit → ownership → portability (Ajesh, 2026-06-20 cont.)

Two clarifications widened the spine into a full arc:
- **"It's not about a leaderboard but credit."** Credit is the *goal*, not a thing to merely guard
  against. Honest-trace is the *method*; anti-gamification is the *only* guard — **not** a reason to
  under-deliver attribution. Recognition of who contributed what is a first-class, *positive* outcome.
- **"It could lead to ownership questions and resolution on who contributed what — and can they take it
  with them."** The arc runs: **contribution → credit → ownership → resolution → portability (exit).**

The whole arc is BOSS-shaped because of one fact: **git makes contribution legible by construction.**
Every artifact — idea, spec, decision, line of code — is authored, timestamped, attributed *already*.
So:
- **Credit isn't a tracking feature to bolt on — it's an honest *read* of history** ([[IDEA-021]]). And
  credit is more than recognition: it's the **evidence base** for the ownership conversation.
- **Portability is already TRUE, not a feature to build.** BOSS is git-native, zero-dep, local-first,
  MIT — the founder **owns their build by construction**, no platform lock-in, nothing held hostage. If a
  duo splits, each can fork and walk. This *is* the canvas's "don't monetize lock-in" made real. The work
  is to **make it explicit/legible**, not to engineer it.

### The bright line (the load-bearing restraint)

BOSS is **evidence + the prompt + the record** — never the **arbiter** or the **cap table**:
- **Evidence:** surface the honest contribution record (git trace over the venture's artifacts).
- **The prompt:** a conscience *moment* that raises the ownership/equity/vesting conversation at the right
  time ("you two haven't recorded how equity/ownership splits — here's the conversation to have"),
  pointing *at* the founder-agreement / vesting / deadlock wisdom (YC/PG/Wasserman; research §4) the way
  BOSS points at security best-practices — **never replacing a lawyer.**
- **The record:** what they *decided* lands in a `DEC-NNN` decision record ("equity X/Y, 4-yr vest, on a
  split each takes Z"). BOSS holds the *agreement they wrote*, not a computed verdict.

**BOSS does NOT:** compute who deserves what · hold a cap table · arbitrate a split · adjudicate a
deadlock · take a side (research F18/F19 — four ethics traditions + impossibility results agree). Humans
+ lawyers resolve; BOSS makes the inputs legible, prompts the conversation, and records what was agreed.
The one neutrality override stays **harm, not preference** (mentor-humane).

This *raises the stakes* on the n=0 restraint: ownership/exit is exactly where a half-built feature that
*looks* authoritative does real damage (the GitHub-draft "input rots invisibly" failure, but with equity).
So the arc is **capture + design now**; build only the evidence/record substrate, and only when it passes
the solo test — never the resolution/arbitration layer.

## The two faces + the hive-mind reframe (Ajesh, 2026-06-20 cont.)

Ajesh widened the vision from *protective* to *generative*: *"share key docs / coding + agentic-dev best
practices / dev/research/business items if needed — but not all may wanna be shared… how they whiteboard,
share the kanban, build different pieces → creates signals, adds insights the other hadn't thought of, so
both get richer — a true hive mind… reciprocity, ownership, partnership."*

So the founder layer has **two faces on one substrate**:
- **Partnership / hive mind (generative, positive-sum)** — selectively shared docs, practices, board,
  whiteboard signals; each founder enriches the other; cross-pollination fills blind spots; **reciprocity
  + partnership** are the goal. The *warm* face.
- **Ownership / accountability / credit / exit (protective, who-did-what)** — the earlier arc. The *fair*
  face. Credit and portability are what make the hive mind *safe to pour into* (I'll share freely because
  I know I'm credited and can walk with what's mine).

**The unifying mechanism — and it resolves the architect's load-bearing question.** The consent tension
Ajesh named (*"not all may wanna be shared"*) and the hive-mind mechanism are the **same gesture**:

> **Capture is personal; sharing is by promotion.** Nothing leaves a founder's private space until they
> *promote* it into the shared mind — which is exactly BOSS's existing `/boss-learn` "sort UP" gesture,
> and exactly the research's universal pattern (*"promotion personal→shared is human-gated"*). The hive
> mind is a **commons both founders voluntarily pour into**, not total transparency.

This gives all of it at once: consent ("not all shared" = default-personal), the hive mind (promote to
enrich), reciprocity (both promote), and partnership (a shared pool both tend). It also answers the
architect's keystone (below): **raw capture stays private; commitment/insight travels — on promotion.**

What the hive mind shares (each opt-in, promoted): **craft knowledge** (a vetted coding/agentic-dev
practice flows to the shared `library/` both use — Principle #1 UP, now duo-scoped); **venture POV** (a
*shared* brain read both enrich — distinct from the per-founder `relationship.md` which never travels);
**the board/canvas/decisions** (shared signals — "what my partner is building/thinking"); **promoted
ideas/docs** (raw idea private → promote when ready to collaborate on it).

**Cross-pollination signal** (the "richer together" part): because shared artifacts carry signals, the
conscience *could* surface positive-sum cross-founder nudges ("you're both touching onboarding";
"your partner's spec has a constraint your idea is missing"). Lower-stakes than the equity moment —
but still **surface facts, never judge**, structural-trigger-only, no inferring tension (mentor-humane).

**Reciprocity, honestly (not a tally).** The hive mind can show *what's been shared* (per-artifact
provenance) and a thin-vs-rich shared pool — never *who shared more* (that's the V1 scoreboard harm).
Reciprocity as a *norm and a health signal*, never a score.

## Mentor pressure-test (2026-06-20) — guardrails + the one decision

Three mentor passes (humane · business · architect) on the full arc. Convergent verdict: **spine is
sound; the work is at the seams.** The non-negotiables:

**mentor-humane (the relationship is a third party at the keyboard):**
- **Credit = per-artifact provenance, never a per-person score/ratio/ranking.** A *shape* constraint, not
  a tone note — computing-and-showing the comparison *is* the harm, and a git-only tally **systematically
  under-credits the non-tech founder** (sales/discovery/relationship work isn't in commits). Every credit
  surface carries a standing **blind-spot disclosure** ("reflects what landed in the repo; not a measure
  of worth").
- **The equity/ownership moment is BOSS's first *third-party-harm* moment** → must be **symmetric** (lands
  in the shared record both see, never a private nudge that primes one founder), **structural-trigger-only**
  (fires on "2nd `owner:` + no `DEC` on the split" — *never* on inferred tension), **once-ever**, consent
  at the door. The inferred-tension / private-prime version is **OVERRIDDEN** (the one thing not to build).
- **Harm override, concretely:** deception of a co-principal · irreversible split without the other's
  informed participation · BOSS's own credit-read weaponized to justify "you deserve less." Name once,
  never block; disown ("this record is not a measure of who is owed what").
- **Portability must be *equal*, not just present:** on a split, both retain full copies (nothing revoked),
  each keeps their private brain/relationship (nothing leaked), and the join moment seeds the 2nd founder's
  brain from *shared* state so they aren't memory-poor. (Adds Risks #8–11 to CANVAS.)

**mentor-business (blunt):**
- **GO on capture + the bright line; this is *brand-integrity / proof-of-stance*, NOT a revenue surface.**
  Team support *forecloses* the classic monetization (seats/hosting/lock-in) by design — stop reaching for
  "wedge/moat." Portability is **table-stakes as mechanism, differentiator only as *stance*** (moves the
  burned-once / returning-founder cohort, invisible to the solo sharp-fit cohort).
- **Solo test, scored:** only **slice 1 (decision log)** cleanly passes on business value at n=1.
  `owner:`-as-person = cheap future-proofing. **`boss credits` has no solo customer** (solo = "me, all of
  it") and the worst drift profile — *demote it below the file's enthusiasm*; its only real use is a dispute.
- **The honest cost:** every hour here is an hour not on the canvas's actual riskiest assumption — *does
  one non-Ajesh founder want this at all* (n=0). This is premature; the demand experiment comes first.
- Equity prompt = credible *iff* it stays prompt+record+pointer-to-a-lawyer; **caveat every equity/vesting
  moment to a real attorney** (uninsurable otherwise).

**mentor-architect (frontmatter-is-truth, pure projection, zero-dep):**
- Spine is **BOSS-shaped** — `board.js` already proves "project by frontmatter, no second source of truth."
- **DEC-NNN:** new ID, `docs/decisions/DEC-NNN-<slug>.md`, **fold capture into `/log` (don't build
  `/decide` yet)**, available in **L0**, frontmatter adds `reversibility:` + `supersedes:`, `owner:` =
  the DRI. Board projects it **only** as a `↻ review-due` flag (reuses existing machinery) — a Decisions
  column/dashboard is scope creep.
- **`boss credits` = a hedged *read* of git+frontmatter at call time** (like `boss board`) — **no
  `credits.json`, no tally**. Credit the *artifact* (`owner:`/`author:` frontmatter), corroborated by git;
  when they diverge, surface the divergence, don't resolve it. Adopt a **`Co-Authored-By:`** convention so
  pairing + AI co-authorship are nameable.
- **THE ONE DECISION Ajesh must make — the shared/personal state cut** (costly-to-reverse: you can't
  un-share what founders thought was private). Recommended: per-founder private state under a
  per-principal path `/.boss/founders/<id>/` (relationship.md, trace, conscience-log, brain POV) —
  structurally can't collide; `docs/decisions/` **born-shared**; and the sharp sub-call → **keep raw
  `docs/ideas/IDEA-*` personal, let them travel only on promotion** to canvas/FEAT/DEC. *(The hive-mind
  reframe above independently lands on exactly this: capture personal, commitment/insight shared on
  promotion. The two converge — that's the cut.)*
- **Eval gap to name now:** there's no eval for "does the conscience fire at the right *moment*" — pair the
  equity-prompt + `boss credits` hedging with `tester` before either ships.

## Concrete mechanism decisions (Ajesh, 2026-06-20 cont.)

Ajesh got concrete — and each lands on something git/GitHub already provides (zero new infrastructure):

1. **Principal identity = GitHub username.** BOSS already resolves it (`gh api user` — the noreply-email
   commit convention in CLAUDE.md). So `owner: @username` in frontmatter, and the architect's per-founder
   path becomes `/.boss/founders/<github-username>/`. **No accounts to build** — `gh` already knows who
   you are. This is the principal-id every other piece keys on (research F15: namespace by principal).
2. **Per-*piece* provenance = `git blame`, surfaced as a discussion anchor.** Not just per-doc `owner:` —
   *who added this section/line*, so "if they need to discuss a piece, they can go back and discuss." This
   is the **warm, humane-blessed use of credit**: provenance *attached to the artifact, as a pointer to a
   person to talk to* — exactly what mentor-humane endorsed (per-artifact provenance, never a per-person
   score). Credit-for-conversation, not credit-for-ranking. A `boss credits <file>` (or just rendered
   `git blame` for prose) is a *read*, no stored state.
   - **Honest caveat (architect + humane):** blame is lossy/gameable (pairing, one person commits both,
     AI co-authorship). So surface it as *"git says @sam shaped this — go talk to @sam,"* never *"@sam owns
     this piece."* Hedge it; pair with the `Co-Authored-By:` convention so pairing/AI are nameable.
3. **Multi-person-gated — dormant solo, activates on the 2nd identity.** *"This is only when there are
   multiple people."* This is the **elegant answer to mentor-business's "no solo value" critique**: the
   founder layer isn't *overhead* for a solo founder — it's **inert**. It shows nothing, costs nothing,
   and adds no ceremony until a second GitHub identity appears in the venture's history. Solo, BOSS is
   unchanged; duo, the layer lights up. (This also sidesteps the architect's costly-to-reverse worry: the
   *display/activation* is gated, even if the substrate ships earlier.)

4. **Suss out solo-vs-team at first-run, flippable anytime.** `boss new` / `/welcome` already asks
   cohort questions — add *"building solo, or with others?"* And it's never locked: solo→duo is a named
   scenario, so the mode can flip at any later point (or auto-detect when a 2nd committer identity shows
   up in history). This is the activation switch for the dormant layer (#3).

These four reframe the build economics: the layer is **zero-cost-when-solo + git-native-when-duo**, which
is the shape that clears both the solo test (inert ≠ overhead) and the zero-dep rule.

**On demand (Ajesh: "there is demand — people often want to work on ideas together; sometimes solo,
sometimes more").** Fair, and it sharpens the business read rather than overturning it. The *category*
demand — people building ideas together — is real, observable, and huge (it's the entire premise of
GitHub); that's a genuine **tailwind, not a speculation**. What's still unproven is **BOSS-specific pull**
(will founders adopt *this* conscience+commons as how they collaborate) — n=0 there. The two reconcile in
the design we converged on: **zero-cost-when-solo + git-native** is precisely how you *ride* the real
collaboration demand **without** over-betting before BOSS-pull is proven. So the demand point doesn't
green-light a heavy build — it green-lights this *cheap, dormant-by-default* one, which was the plan.

**Sourcing correction (Ajesh, 2026-06-20):** the demand narrative below — the collaboration/hive-mind
framing, the value reframes, and Pains A/B/C — is **from real founder conversations, relayed by Ajesh —
NOT Ajesh's own product imagination.** This materially upgrades the evidence: it is **field signal from
actual founders**, which is the precise antidote to the canvas's central anxiety (Risk #6: 22 releases
leaned on *persona/Ajesh's-model* signal as if it were demand). *(Ajesh's own contributions are the
**mechanism** ideas — GitHub-username identity, `git blame` provenance, install-time detection — clearly
distinct from the founder-sourced demand.)*

**First primary-source pull (founder conversations, relayed by Ajesh, 2026-06-20):** *"BOSS-specific pull
— from when I talked to founder friends."* This is the **first real demand signal** for BOSS, and it's specifically on the
collaborate-on-an-idea-together use case — it moves BOSS-pull from *unknown* → *early-positive*, which is
genuinely new (every prior IDEA carries the "n=0 real founders" caveat). **Mom-Test hardening still owed
before it counts as validated:** founder-friends-say-they'd-like-it is the signal most prone to
false-positive (friendly, hypothetical, not behavior). What turns it into evidence: did they describe a
*past* collaboration that actually hurt (lost work, a split, a blind-sided cofounder)? did the pain come
up *unprompted*? would they *commit* (try it on a real shared repo, intro another pair)? **Route the
hardened signal to `CANVAS.md` demand cell** — this is the canvas's riskiest assumption finally getting
its first datapoint.

**What they actually said (Ajesh, 2026-06-20):** they want BOSS to (a) **create a shared way to build**
and (b) **help mentor folks on the team** — *"this is where BOSS can really scale up in its value."*
Two reframes fall out:
- **The value prop sharpens from "shared state" (commodity) to "a shared way to build + team mentorship"
  (differentiated).** Mentor-the-team is **BOSS-unique** — no collaboration tool (GitHub/Linear/Notion)
  *mentors*. The mentor layer + conscience, which the canvas calls the moat, pointed at a *team* is the
  scale story. This widens the design beyond the protective arc: the headline is the *generative* face
  (the hive mind) **plus BOSS's mentors coaching the whole team**.
- **It updates the cohort hypothesis.** The canvas's sharp-fit People cell is *solo* (vibe-virtuoso /
  eng-builder / indie-hacker / returning-founder). "Founding teams who want shared-build + team-mentorship"
  is an **adjacent cohort** — a real canvas update, not just a demand tick.

**Honest grade against the canvas's own bar:** this is *expressed intention*, specific and differentiated
— the strongest version of the **weakest** kind of evidence (Risk #6: signal-as-demand; "want to use" ≠
"used it on a real shared repo and came back"). So it does **not** validate demand — it **unblocks the
experiment**: the canvas's whole v0.3 bet was stalled on *"get BOSS in front of 1–3 real founders"*, and
Ajesh now has **warm leads who asked first.** The move it green-lights is **not** a big team build — it's
*put the cheap first slice in front of one of these friend-teams and watch* (do they come back; does a
mentor/conscience moment change a decision). That single observed session is the validation; the friends'
enthusiasm is the door to it. **Caution the conscience must voice to its own author:** the excitement
("this is where BOSS scales!") is exactly the moment Risk #1 (bloat) + Risk #6 (signal-as-demand) bite —
ride the lead *cheaply*, prove it with a real team *using* it, don't build the full layer on a "yes."

**The pain, articulated (Ajesh relaying the founder-friend conversations, 2026-06-20) — the demand
narrative:** *"It's difficult with AI to collaborate on an idea — to keep everyone in the loop on what's
being built and what research is being uncovered. Founders have different founding skill sets: an engineer
who's a CTO (or building a full-stack app for the first time), or a product/non-tech person who doesn't
know how to work with an engineer cofounder on building an app together."* This is the strongest signal
yet because it's a **problem statement, not a tool wish** — and it names two underserved pains BOSS is
unusually built for:
1. **AI-native building is *solo-shaped by construction.*** Each founder is in their own Claude Code /
   Cursor session; the AI keeps *no one else in the loop*. Build progress and **research uncovered** live
   in separate silos. BOSS's git-native shared commons is exactly the **bridge that makes two separate AI
   sessions share a brain** — the hive mind, now grounded in a concrete pain (not an abstraction).
2. **The skill-set gap between cofounders** — especially *"a non-tech person who doesn't know how to work
   with an engineer cofounder."* This is **BOSS's mentor layer's home turf**: the mentors already coach
   the founder across exactly these gaps; pointed at a *pair*, they can coach **the collaboration itself**
   (how a non-tech founder works with an eng cofounder; how a first-time full-stack CTO holds the line).
   No collaboration tool does this — it's the differentiated "mentor the team" value made concrete.

So the value prop crystallizes: **BOSS keeps a founding team in the loop on what AI is building & finding
across their separate sessions, and mentors them across their skill-set gaps — a shared way to build.**
This is Problem/Promises-cell material for `CANVAS.md`, and the sharpest articulation of the team thesis
so far. (Still: reported pain from friends, not yet observed/committed — strong lead, not validation.)

**Pain C — staying *current* on the fast-moving agentic-AI craft (founder conversations, 2026-06-20):** *"either could be
discovering best new ways to use agentic AI (it changes so fast); they want to keep sharing + staying
updated, using current best practices, so they can focus on building — with mentorship through BOSS
keeping them focused and not worrying whether they're outdated or expensive."* This is the **most
BOSS-differentiated pain of the three, because BOSS already has the entire machinery** — the team version
is just pointing it at a *shared* commons:
- **Discover → vet → promote** = `/vet` (skeptical inbox) → `/boss-learn` (UP/DOWN router) → shared
  `library/practices/`. One founder finds a new agentic-AI practice, vets it, it flows into the commons
  *both* use. The hive mind for **craft knowledge**, not just project state.
- **Stay current as models move** = the **model-recalibration discipline** ([[IDEA-014]], and Ajesh's
  standing direction that adapting to new models be a discipline, not ad-hoc). Team-scoped: both ride the
  curve together.
- **Not outdated / not expensive** = `/ai-cost` + `/cost-review` (already shipped) + the **mentors**
  removing the *anxiety* ("am I doing this the outdated/expensive way?") so the founders **focus on
  building**. The mentorship *is* the anxiety-removal.

So there are **two kinds of "in the loop"**: **project-state** (what *we're* building/researching — Pain A,
more commodity) and **craft-state** (how to build *best, currently* — Pain C, BOSS-native + differentiated).
The BOSS-distinctive value concentrates in **B (mentor the skill gap) + C (shared, always-current craft +
anxiety-removal)** — the mentors and the learning loop — *not* in bare shared-docs. **This sharpens the
demonstrator:** the cheapest *and* most differentiated first slice to put in front of a friend-team may be
the **shared best-practice commons + a "you're current — focus on building" mentor moment** (machinery
already exists: `/vet`→`/boss-learn`→`library/`), rather than a project-state shared view.

## Slice 3 — the state cut is mostly already drawn (Ajesh's released-vs-dev insight, confirmed in code)

Ajesh's reframe (2026-06-20): *"we learnt with BOSS — there's a released app and a dev codebase; all the
docs can live there and be shared, right? Help entrepreneurs back up their info, and also back up + share
critical info."* Checked against the actual scaffold template `.gitignore` — **he's right, and it's
already ~90% built:**

- **A scaffolded venture does NOT gitignore `docs/`.** The template ignores only build artifacts, `.env`/
  `secrets/`, and the per-person `.boss/cost-log.jsonl` + `.boss/conscience-log.jsonl`. So a venture's
  `docs/ideas/`, canvas, `docs/decisions/` (`DEC-NNN`!), research, and `RESUME.md` **already commit** — a
  cofounder who clones the repo already sees them, and pushing = they're **backed up**. *Keep-in-the-loop +
  backup already work by construction* the moment a team shares a (private) GitHub repo.
- **BOSS gitignores its OWN `docs/`** — but that's the **released-app** choice (don't ship Ajesh's private
  strategy in the public OSS package). It is *not* what ventures inherit. This is exactly Ajesh's
  released-vs-dev distinction, confirmed: the *released app* hides its dev docs; a *venture* (private dev
  codebase) commits them. The cut a founder needs was already drawn correctly — just never named.

**So slice 3 shrinks to three concrete pieces:**
1. **Name + lean into what already works (the backup/share win).** Make explicit in onboarding that pushing
   the repo **backs up your thinking and keeps your cofounder in the loop** — a real, *solo-passing* value
   (your ideas/decisions/canvas survive a dead laptop), with the team bonus for free. Cheap, reversible.
2. **Plug the one per-person leak (reversible, safe — slice 3a).** The template gitignores the conscience
   *logs* but **not** `.boss/brain/relationship.md` (what the conscience said to **me** + what I did) or
   `.boss/trace.jsonl` — so today those would *commit*, leaking one founder's private nudge history to the
   other. Fix: gitignore the per-person conscience files in the template (ideally namespaced
   `.boss/founders/<handle>/` per the architect). This is the genuine privacy fix, and it's reversible.
3. **The ONE real decision (DEC-worthy): is the venture brain shared or per-person?** `.boss/brain/read.md`
   (the conscience's POV on the venture) — **shared** (both founders enrich one hive-mind read — the
   generative vision) or **per-person** (the architect's "learned memory private by default")? This is the
   only genuinely costly-to-reverse call left, and the right one to record as BOSS's **own first `DEC`**.

**The big de-risk:** because docs already share-by-default for ventures (wanted, not a surprise), the
"can't un-share what was private" one-way-door risk mostly evaporates — it only really applies to the
brain decision (#3) and the leak fix (#2) *prevents* the accidental version. Backup-and-share is the
honest framing, not "privacy vs sharing."

## Smallest worthy slices (if/when it earns a build) — sequenced cheap → distinctive

Re-sequenced by the solo test (passes solo → build sooner; team-only → defer):

1. **Shared decision log — `DEC-NNN` (PASSES SOLO; build first).** ADR-lite: `docs/decisions/` with
   Context / Decision / **Why** / Decider (DRI) / Reversibility flag. Research's single highest-leverage
   artifact, and it earns its place at n=1 (decision rationale for your future self is *why ADRs exist*).
   Reuses BOSS's ID + frontmatter conventions; the board can flag `↻ revisit` on reversible ones.
2. **`owner:` as a person + board projection (PASSES SOLO; cheap).** Already in frontmatter; let it name
   a founder; `boss board` groups/flags by owner. Clarity even solo, future-proofs the duo.
3. **Contribution/credit from the trace — `boss credits` or fold into `boss insights` (PASSES SOLO;
   humane-gated).** Read git author/log over the venture's BOSS artifacts → honest "who created which
   ideas / shipped which FEATs / drove which decisions." **No leaderboard.** mentor-humane gates the tone.
4. **The join moment, solo→duo (TEAM-ONLY; defer to a real duo).** A thin `boss invite`/onboarding skill:
   second founder clones, BOSS hands them the venture brain + canvas, they claim ownership areas + start
   their own per-founder `relationship.md`. Mostly orchestration of things that exist.
5. **Per-founder conscience identity (TEAM-ONLY; defer).** The brain already separates POV (`read.md`)
   from relationship; "team" just means `relationship.md` is keyed to *who* (namespaced by principal —
   research F15). Builds on FEAT-022.
6. **A non-tech read door (NICETY; defer — Ajesh: non-tech can do CLI/git now).** `boss board --html` +
   rendered canvas already cover most of it; a `boss share` export is the cheap extension if ever needed.

## Full-assessment brief (what "needs full assessment" means here)

Open questions to resolve before any build earns its place — route through the mentors:
- **mentor-architect** — the state cut (Problem 1); does git-as-substrate hold without conflict pain, or
  does shared canvas/board invite merge collisions a single source-of-truth must avoid? Where does the
  non-tech door mount without a new host ([[IDEA-006]])?
- **mentor-humane** — per-person vs. shared conscience memory; consent when one founder's relationship
  data would inform a nudge the other sees; the conscience-not-arbitrator boundary.
- **mentor-venture / mentor-business** — is "founding teams" a wedge or scope creep at n=0? Does it
  change who BOSS is for, or just widen an existing user's surface? (Don't build around the demand risk.)
- **mentor-gtm** — the tech+non-tech pair as a positioning shape vs. a feature.
- **Personas** — react with `persona-non-tech-founder` + `persona-eng-builder` as the literal cofounder
  pair: where does each hit a wall today?

## Notes
- Related: [[IDEA-006]] (host portability — the non-tech door is a host question), [[IDEA-022]] (venture
  brain — the thing that becomes per-founder), [[IDEA-034]] (board — already the shared view), [[IDEA-021]]
  (read-the-trace-don't-instrument — applies to *whose* trace), [[IDEA-019]] (n=0 demand is the real risk).
- Research + external best practices: [SESSION-2026-06-20-founding-teams](../research/sessions/SESSION-2026-06-20-founding-teams.md).
</content>
</invoke>
