# BOSS Changelog

Each entry = a BOSS version. `/boss-sync` reads this to tell a project what's new since its pin.

## 0.124.0 — 2026-07-23

- **Feature-level `/sunset` — kill one zombie feature honestly (POST-LAUNCH build #6, JOB 5).** Extends the
  existing whole-project `/sunset` (IDEA-044) with a second scope on the *same verb* — "end something honestly" at
  both scales. **`/sunset`** (no arg) = the project post-mortem as before; **`/sunset FEAT-007`** = end one
  feature. The failure mode it treats: products accrete features and never shed them, so a *zombie* (shipped, then
  quietly unused) sits costing maintenance, widening the attack surface, and confusing new users — *subtraction is
  a feature*. Four moves: **(1) usage-validate it's actually dead** (kill on `/measure` data, not a hunch — quiet
  ≠ dead; and the stuck-in-build FEAT case ends because it's *not finishing*, not because it's unused); **(2)
  guard the segment/commitment exception** (the load-bearing check — a low-usage feature can be a *contract*, or
  the workflow the one enterprise account depends on; low usage ≠ safe to remove; migrate first or don't kill);
  **(3) draft the honest user message** (real notice period, a path out, no "we're improving your experience"
  euphemism, no data-hostage removal — the `ai-ux-patterns` anti-patterns, refused); **(4) harvest UP + remove**
  (mark the FEAT `retired` with the usage evidence + reason; small reversible commit; nothing hidden). This is
  exactly what the **`focus` circuit-breaker** points at when it offers to end a stuck FEAT rather than leave it
  70%-done — the offer now resolves precisely. Humane (PRINCIPLE #6): honest deprecation, guard the quiet-but-
  critical cohort, subtraction as care for everyone left. Skill extension (already manifest-registered); no hook
  change → **gate holds 129/0**, judgment unaffected. `/tmp`-verified (feature-level section lands, 0 placeholders;
  registry pruned).

## 0.123.0 — 2026-07-23

- **`/roadmap` — weigh what to build next into a small bet-list + a mandatory NO-list (POST-LAUNCH build #5, JOB 5;
  Tier 2 begins).** The fuller version of `/spec`'s "loud ≠ important" check: that fires on a *single* request at
  decide-time; this weighs *all* the signal at once. Deliberately **not** a persistent roadmap — BOSS refuses the
  Gantt/backlog-you-tend; this produces a dated snapshot you *use and discard*. Weighs **what users say** (the
  `--feedback` register — `stated-pain`, the weakest grade) against **what users do** (`/measure`, retention,
  churn via `/retain` — `observed-behavior`/`commitment`), and **behavior wins when they disagree.** Scores each
  candidate by **Confidence = the EVID grade** (Itamar Gilad's Confidence Meter mapped onto BOSS's
  stated-pain→observed-behavior→commitment ladder), with **RICE-reach OFF by default** (reach-weighting optimizes
  for the loud majority-of-noise over the right users). Produces a **small Shape-Up bet-list** (2–4 bets, fixed
  appetite — Singer) plus a **mandatory NO-list** ("no is the default; the NO-list is the load-bearing half, and
  where the silent-majority discipline lives"). Pre-PMF it defers to `/pmf-check` — the only honest roadmap before
  fit is "find fit" (Perri's build trap). Humane (PRINCIPLE #6): serves the users who drive value, not whoever
  shouts; kill honestly (a zombie feature is a `/sunset` candidate, not a roadmap item); never an engagement
  roadmap. Writes a dated `docs/roadmap/ROADMAP-<date>.md` (snapshot, re-run when signal moves — **not** a
  scheduled cadence); promote a bet with `/spec`. `/spec`'s loud≠important note now points forward to it.
  Registered in the L1 manifest; skill-layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified
  (lands on unlock, mapped, 0 placeholders; registry pruned).

## 0.122.0 — 2026-07-23

- **`activation` practice + `/onboard` skill — designing the path to the aha-moment (POST-LAUNCH build #4, JOB 1;
  completes Tier 1).** BOSS *read* the activation metric (`/measure`) but was silent on *designing* activation —
  the highest-leverage number in the funnel (activation > acquisition; fix it and every downstream cohort lifts at
  once — Winters). The UP/DOWN pair, and the top-of-curve fix `/retain` already routes to. **UP —
  `library/practices/activation.md`:** activation = the **first-session success rate** (not signup, not
  "engaged"). **Derive the aha-moment from data** (Bangaly Kaba's best-retained-vs-churned method — not a
  whiteboard guess; the Facebook "friends in N days" number is an *illustration of the method*, not a template;
  for an AI product the aha is a first *successful* output the user keeps, tied to TCR). **Shrink time-to-value**
  (cut every step signup→value; seed a **"magic first run"** so the first output is good before the user works —
  the empty state is where activation dies). **Concierge onboarding shamelessly** (Superhuman white-glove;
  do-things-that-don't-scale — Graham; it doubles as `/interview`, and the scalable flow is *extracted from* the
  hand-done one). **DOWN — `/onboard` skill (L1):** the runner — n<10 gate ("watch them by hand"), derive-the-aha,
  TTV-shrink + magic-first-run, the concierge plan, a dated `docs/onboard/ONBOARD-<date>.md`, one activation metric
  handed to `/measure`. **Humane (PRINCIPLE #6): activation = getting them to *success* fast, not *hooked* fast** —
  refuses fake progress bars, gamified "complete your profile" nags, forced tutorials, streaks bolted onto
  first-run, guilt at the skip button (the `ai-ux-patterns` catalog), and names them. Ties: activation-failure is
  `/retain`'s top-of-curve decay; the activated cohort is exactly who `/pmf-check`'s 40% test surveys. Registered
  in the L1 manifest; skill+practice layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified
  (lands on unlock, mapped, 0 placeholders; registry pruned). **This completes Tier 1 of the post-launch program**
  (#0 `/pmf-check`, #1 margin-trap, #2 loud≠important, #3 retention/`retain`, #4 activation/`onboard`).

## 0.121.0 — 2026-07-23

- **`retention` practice + `/retain` skill — fixing the decaying curve, not just reading it (POST-LAUNCH build #3,
  JOB 2 — the #1 post-launch job).** The map's sharpest gap: `/measure` + `analytics-for-ai-products` *read* the
  retention curve; **nothing helped *fix* it.** This closes it with the UP/DOWN pair. **UP —
  `library/practices/retention.md`:** the judgment that there is **no retention hack** — the fix is always the
  product, and *where the curve dies* tells you *which part*. Read the curve's **shape** first (decaying-to-zero =
  a `/pmf-check` fit problem, not a retention one; flattening = the shape of fit, raise the plateau); **rebase past
  the week-2–5 AI-tourist wave to the Month-3 cohort** before diagnosing; then the **three decays** — activation-
  failure (dies at the top → `/onboard`, the highest-leverage lever), engagement-decay (dies in the middle → the
  product + roadmap + `/interview` the churned, fed by *churn* not the loudest survivor — ties to `/spec`'s "loud ≠
  important"), involuntary/mechanical (dies at the wallet → **dunning: point at Stripe, don't build billing**;
  20–40% of churn and the most recoverable). **Quality + roadmap ARE the retention strategy** (for an AI product:
  output quality + the eval loop). **DOWN — `/retain` skill (L1):** the runner over that diagnosis — n<10 gate
  ("go talk to them"), shape read, cohort rebase, the where-does-it-die decision tree, the routed fix, dated
  `docs/retain/RETAIN-<date>.md`. **Humane (PRINCIPLE #6): a user who succeeded and left is a *win*; resurrection
  is invitation, never winback-by-dark-pattern; involuntary-churn recovery is the one pure-gain move.** Refuses
  churn-prediction ML, retention dashboards, streaks/guilt-nags, and building a billing system — names each. A
  pointer from `/measure` hands off to `/retain` on a sliding curve. Registered in the L1 manifest; skill+practice
  layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified (lands on unlock, mapped, 0 placeholders;
  registry pruned).

## 0.120.0 — 2026-07-23

- **`/pmf-check` — the product-market-fit verdict, the organizing gate the whole journey turns on (POST-LAUNCH
  build #0, JOB 2; the highest-leverage post-launch verb).** BOSS measured the *inputs* to PMF everywhere
  (`/measure` reads the retention curve, `/interview` + `/evidence` hold the demand signal, `/ai-cost` holds the
  economics) but **never rendered the verdict** — the single biggest post-launch gap. This new L1 skill reads what
  BOSS already holds and calls it: **pre-PMF / at-PMF / post-PMF**, from three cheap lenses — the **Sean-Ellis
  40%-test** (*only* on users who reached core value — the detail founders skip), **retention-curve flattening**
  (a plateau = fit; decay-to-zero = none; rebase past the week-2–5 AI-tourist wave to the Month-3 cohort), and the
  **pull-vs-push gut-check** (the one you can't fake). **It DEFAULTS to pre-PMF** — you earn your way off it, and
  ambiguity resolves to "not yet, keep talking to users, don't scale" — because **scaling before PMF is the #1 way
  startups die** (~70% premature-scale; Startup Genome). The verdict is **voiced through the seller→operator→leader
  role ladder** (`founder-role-shifts`): pre-PMF you're still a *seller* (the job is fit, not growth), at-PMF is the
  *seller→operator* transition, post-PMF is the *operator* — **and only post-PMF licenses the leader's work** (scale/
  hire/raise). At **n<10 it says no** ("you can't measure fit yet — go talk to them", points at `/interview`).
  Humane (PRINCIPLE #6): PMF is measured on user *success* not engagement (the 40% means losing it would *hurt*
  them — a high-DAU thing they can't quit is a hook, not fit); don't scale a thing that isn't yet helping people.
  A **verdict, not a dashboard** — no PMF-score-over-time meter, no second source of truth; writes one dated
  `docs/pmf/PMF-<date>.md`. Registered in the L1 manifest; `mentor-venture` now points at it for the *"are we there
  yet / should we scale?"* question. Skill-layer only → **gate holds 129/0**, judgment unaffected. `/tmp`-verified
  (scaffolds on `boss unlock mvp`, `boss map` lists it, 0 placeholders). **The honest line holds: only founder
  contact moves the risk — and this verb's entire job is to send you back to that contact until the fit is real.**

## 0.119.0 — 2026-07-23

- **The "loud ≠ important" conscience voicing — the `drift` twin at decide-time (POST-LAUNCH build #2, JOB 5).**
  Restraint (`/spec`'s Moment #4) is the *pre-launch* "is it worth building?" check; this is its **post-launch
  sibling**, firing on a different symptom: **the source of a FEAT is a user request.** Post-launch the trap flips
  from "no evidence" to "the *wrong* evidence" — building around the **loudest few** while the **silent majority**
  (who never wrote in) and the **quiet churn** (who just left) go unheard. Wired into `/spec` as a voicing (not a
  hook — the "vocal minority" predicate doesn't cleanly exist, so an auto-firing hook would over-fire; the IDEA-041
  `/ship` precedent, and the SESSION doc says explicitly "fires at `/spec`"). **Gated on two symptoms** — real
  users exist (a `--feedback` register / EVID ledger / live `/measure` read) AND this FEAT traces to a
  request/complaint, not a founder-named bet (if it's the canvas riskiest-assumption backed by broad evidence,
  that's `drift`'s job — stay silent). Asks the specific version of *how many actually asked, are they your active
  core or a vocal few?*, reframes a request as a **`stated-pain` EVID** (the weakest grade; the quiet majority's
  observed behavior outranks a loud request), and points at the two cheaper reads before the build — `/measure`
  (behavior over volume) and `/interview` (talk to the silent + the churned) — plus `mentor-venture`. Suggestive,
  once, never a gate; cohort-aware. **Enforces the rule the `/triage --feedback` register already states** ("a
  feature request → a stated-pain EVID, *never* a spec") — the register now forward-points to the `/spec` check,
  so the rule has teeth at decide-time. **Humane (PRINCIPLE #6): protect the silent majority who drive the value**
  — the anti-pattern is a roadmap captured by whoever shouts. Skill-layer only (no hook, no gate eval change —
  **gate holds 129/0**; judgment unaffected). The fuller signal-vs-behavior weighing into a bet-list is the
  `/roadmap` job, captured for Tier 2. **Honest line unchanged: only founder contact moves the risk.**

## 0.118.0 — 2026-07-23

- **The `margin-trap` conscience moment — the post-launch cost→price bridge (POST-LAUNCH build #1, JOB 4).**
  First build of the post-launch program (the operator→leader arc). BOSS's cost loops all watched spend against
  a *budget*; none watched it against the *price*. This moment closes that. It fires when a project has a real
  per-call cost ledger (`.boss/cost-log.jsonl`) **and** the founder is operating — ≥1 cost review with real
  spend on file — but **no review has looked at the margin yet**. A cheap predicate gate (ledger exists + a
  review with `Total spend:`) fronts a judgment the regex can't make: the model reads a bounded slice (the
  latest review, a tail of the ledger, and wherever a price/ARPU lives — the canvas WTP cell, a pricing `DEC`,
  or `docs/ai-cost-budget.md`) and judges **two axes** — (a) *margin*: is cost-per-active-user a dangerous
  fraction of the price (~10–15%-of-ARPU heuristic), with the heaviest users driving it (a16z/Tunguz: AI GM
  50–65% vs SaaS 70–85%; Copilot $10 price / ~$20 cost)? and (b) *humane (PRINCIPLE #6)*: is a big share of the
  cost **retries/regenerations** — the product working *less*, the business paid *more* when the user
  struggles? If neither, it **stays silent** (a healthy margin earns quiet, like a validated risk quiets
  `drift`); pre-revenue it never opens (no price to compare against — Principle #2). Points at `/cost-review`
  (the gross-margin band) and `mentor-business`; suggestive, once/session, never a gate. Exit: a review that
  examines the margin closes it. New `margin-trap-loop` (L1) + moment frame in the conscience runtime (a JUDGE
  moment — bounded read). Predicate-only at the gate: no prior fixture creates `.boss/cost-log.jsonl`, so the
  **122 baseline held byte-identical; +7 new margin-trap cases → gate 129/0**. Judgment evals unaffected (new
  moment, no transcripts → **0 STALE**). Registered `margin-trap-loop` (and the previously-omitted `focus-loop`)
  in the L1 manifest. Zero-dep; skills/hooks-layer only. **The honest line still holds: none of this moves the
  riskiest assumption — only founder contact does.**

## 0.117.0 — 2026-07-23

- **Three JIT skill extensions — the sweep's small tail, closed (2026-07-23 sweep).** Small, non-ceremony
  additions to existing L1 skills; the last deferred items. **`/ai-cost`** gains the **prompt-caching mechanics**
  (the highest-ROI lever): cache-read ≈0.1× (90% off), break-even ~2 reads, the static-first-then-dynamic
  ordering the mechanism forces, and verify-via-`usage.cache_read_input_tokens` — reach for it before
  downgrading models. **`ai-first-init`** Step 2 gains the **2026 native-strict-outputs update**: all three
  providers (incl. Anthropic) ship constrained-decoding structured outputs now, so the "re-prompt until it
  parses" reask loop is obsolete — prefer native `output_format`/`strict`, keep Pydantic/Zod for typed/semantic
  validation; plus a pointer to `mcp.md` for external tools. **`/evals`** gains the **online / production half**:
  score a sample of live traffic continuously, auto-curate failing traces into the set, the traces→evals→
  product-metrics loop — with the honest "offline eval can lie" caveat and a pointer to `/measure` +
  `analytics-for-ai-products`. Skill-layer only; `src/` untouched; gate 122/0. **This closes the entire
  2026-07-23 research sweep — nothing left deferred.**

## 0.116.0 — 2026-07-23

- **`/ship` gains a ship-dark / kill-switch offer — BUILD 6 complete (2026-07-23 sweep).** The other half of the
  feature-flags work: at the deploy moment, if the feature is **risky or AI-mediated**, `/ship` now *offers*
  (never imposes) to ship it **behind a flag** — dark or at a small %, with a **kill switch** that flips in
  seconds. Why it lives in `/ship`: a flag is the **fast application-layer rollback** a code-deploy rollback
  *doesn't* give — an AI feature failing non-deterministically for the whole user base needs a toggle (seconds),
  not a redeploy (minutes). **Env-var-first** (a kill switch is one `if (env)`; no platform required), and "flag
  the model, not just the feature" so a bad model swap CI/CD never sees rolls back without a deploy. A
  check/offer, once, situation-not-person — skip for a plain static ship; never a gate (conscience-not-censor,
  consistent with `/ship`'s pre-flight shape). `ship-it-live.md` gains a "flag = the fast rollback the app layer
  gives you" subsection. Skill + practice; `src/` untouched; gate 122/0. **BUILD 6 (feature flags + finishing) is
  now complete** — the practice (v0.111), the `focus` circuit breaker (v0.115), and this `/ship` offer (v0.116).

## 0.115.0 — 2026-07-23

- **The `focus` moment gains a finish-or-sunset circuit breaker (2026-07-23 sweep, BUILD 6 deferred slice — the
  careful conscience piece).** Closes the gap thread H named: `focus` caught the *pile* (≥4 building, 0 shipped)
  and asked "which one would you finish first?" — but had no forcing function for the *oldest stuck* item. Now,
  for the oldest item still aging in build (the board's `⌛` flag), the moment offers Shape Up's **circuit-breaker**
  cut — *finish it this session, or `/sunset` it honestly* — because a thing perpetually 70%-done is WIP, not a
  plan (and a feature flag left at 5% forever is the same trap; ties `feature-flags.md`). It **offers** `/sunset`,
  never pushes it — **IDEA-044's guardrail holds** (the conscience points at the honest ending from inside a
  moment that already fired; the founder chooses). Voicing-only: the `focus` frame in `loop-runtime.js` + the
  `focus-loop.md` Drift/Cite sections + Ryan Singer/Basecamp (Shape Up) added to attribution. **Predicate
  untouched → gate stays 122/0; `focus` has no judgment transcripts → no regrade** (drift/caution/capture/humane
  all GRADED, 0 STALE). No new hook, no new predicate (the aging flag is the trigger, finish-or-sunset is the
  response, `/sunset` receives it). **Still deferred:** the `/ship` ship-dark/kill-switch offer (BUILD 6's other
  slice).

## 0.114.0 — 2026-07-23

- **Retrieval — a ladder, not a vector database (2026-07-23 sweep, BUILD 5b; UP → `library/practices/retrieval.md`).**
  Thread F's "one thing to build" — the practice a founder most needs in order to *not* over-build. Its value is
  subtraction: **"RAG is dead" is a myth** (the naive version is dying, retrieval isn't), and the honest decision
  line is Anthropic's — **< ~200k tokens & static → skip RAG, put it in the prompt**; above ~500k, or needs
  frequent queries / low latency / citations → retrieve. Anchored on **context rot** (Chroma: usable window ≈
  60–70%, so long context ≠ free retrieval). **Rung 0 = "can Claude Code just grep this?"** (agentic retrieval
  in-repo, no vector DB — many founders' RAG need is smaller than they think). The ladder (dense → hybrid
  BM25+vector/RRF → rerank → graph/agentic, each earned on a real miss), the unglamorous defaults
  (**recursive-512 chunking**, **pgvector-until-it-hurts**, **recall@k before you optimize** — Jason Liu's
  inventory-vs-capability split), Anthropic's Contextual Retrieval as the standout, and **agent memory as the
  same ladder** (prompt → summarize → Claude's native memory tool → a framework only on a named wall; don't pick
  one off a gameable leaderboard). Library only; `src/` untouched. **Not committed at write time** (committed
  with this batch).

## 0.113.0 — 2026-07-23

- **Post-ship validation — `/measure` + analytics-for-ai-products (2026-07-23 sweep, BUILD 5; UP practice +
  DOWN L1 skill).** BOSS owned *pre-build* validation (`/pretotype`/`/evidence`/`/interview`/`/research`); this
  is the *post-ship* half. **UP** = `library/practices/analytics-for-ai-products.md`: the doctrine that classic
  analytics assumes deterministic output, an AI product violates it, so **model accuracy ≠ user success** — the
  metric vocabulary (Task Completion Rate = the AI north star, retained-character rate, edit distance,
  regeneration, containment, frustration index, **cost-per-*successful*-outcome**), the product-analytics ↔
  eval-loop convergence (traces → evals → product metrics; online evals on a sample of live traffic), and the
  **anti-surveillance clause** (measure graduation/loop-closure, NOT engagement/DAU — the humane differentiator;
  measure the product, don't surveil the human — [[IDEA-021]]). **DOWN** = a thin **`/measure`** skill (the
  `/pretotype` counterpart): a hard **n<10 gate** ("close this, go talk to your users"), ONE activation metric +
  ONE retention curve, **≤10 events** (kills analytics theater), the AI-specific metrics, and free/OSS/no-lock-in
  tooling (PostHog / Plausible / Langfuse-Phoenix; print+JSONL+spreadsheet for a first app). Extends `/evals` +
  `/ai-cost` toward online/product metrics, doesn't duplicate them; post-ship retention =
  `observed-behavior`/`commitment` **EVID**. Registered in the L1 manifest. Skill + library; `src/` untouched.
  **Not committed at write time** (committed with this batch).

## 0.112.0 — 2026-07-23

- **`/landing` — get a founder's first landing page out the block, on-brand and honest (2026-07-23 sweep,
  BUILD 3; UP practice + DOWN L1 skill).** BOSS uniquely holds the inputs (BRAND.md voice/positioning, the
  design tokens, the canvas Promises cell) and the founder is already *inside Claude Code*, so an on-brand page
  in-repo is the lowest-lock-in option in the 2026 landscape. **UP** = new `library/practices/landing-page.md`:
  the minimum-that-converts (descriptive headline = value prop, two-job subhead, one repeated CTA, proof in the
  eye-path, no nav, clarity-over-cleverness — Shapiro / CXL / Harry Dry / 37signals), the **product-page vs
  demand-page** split (the demand page *is* `/pretotype`'s fake door; a signup measures curiosity, not intent),
  the **anti-slop mechanism** (BRAND.md→copy, tokens-by-semantic-name→visuals, Promises→value-prop; beat the
  indigo-default; spend the saved hours on the 5% that's the brand), and the **persuasion-vs-manipulation** line
  (say-it-out-loud test; real deadlines only; the honest version *is* the high-converting one). **DOWN** = a
  thin **`/landing`** L1 skill that composes those surfaces — reads the brief (refuses blank generation), asks
  product-vs-demand, generates a real page in-repo, runs **`/red-team --humane`** by default (now scans the
  generated markup for injected dark patterns), hands off to **`/ship`**, and **hands off** CMS/visual-editing
  to Framer/Carrd/Webflow (BOSS gets the first honest page out the block, then points onward — not a website
  builder, not a CRO tool). Registered in the L1 manifest. Skill-layer + library; `src/` untouched. **Not
  committed at write time** (committed with this batch).

## 0.111.0 — 2026-07-23

- **Feature flags — "flag the model, not just the feature" + the finishing twin (2026-07-23 sweep, BUILD 6
  core; UP → `library/practices/feature-flags.md`).** Answers the founder's ask about toggling AI features and
  not drowning in half-built work. The spine is the AI-specific idea: with an AI feature the risky change is a
  model ID / prompt / temperature, which CI/CD can't see or roll back — so **put the model config in the
  flag** and get a **kill switch** that flips in seconds (AI fails non-deterministically, in prod, on the whole
  user base at once). Plus percentage-rollout-as-the-test, flags-as-the-prompt/model-A/B mechanism, rollout-as-
  cost-discovery (pairs `/ai-cost`), and **flag debt = unfinished work wearing a toggle** (retire-at-creation).
  The **JIT ladder is env-var-first** (a kill switch is one `if (env)`; a platform earns its place only for
  remote-toggle/user-bucketing — a 0-user founder needs neither). Names the **flags↔finishing** connection: a
  flag lets you ship a *thin done slice* instead of a 70%-done branch (the antidote to the vibe-coding
  graveyard), but a flag stuck at 5% forever is WIP wearing a toggle → *ship the slice, then roll to 100% or
  `/sunset` it*; and **"done" ≠ "the happy path runs."** Cross-links `git-workflow` (flags = how trunk merges
  unfinished work) + `ship-it-live` (the fast app-layer rollback). **DEFERRED (careful piece):** the `/ship`
  ship-dark/kill-switch *offer* and the `focus`-moment **finish-or-sunset circuit breaker** (touches the
  conscience voicing → needs judgment-eval cases; the gate-touching slice, deferred like other conscience-
  moment changes). Practice only; `src/` untouched. **Not committed at write time** (committed with this batch).

## 0.110.0 — 2026-07-23

- **Harness engineering + context engineering — the architecture story BOSS was missing (2026-07-23 sweep,
  BUILD 2; UP → practices + roster).** Two research threads independently flagged **harness engineering** as
  BOSS's biggest architecture gap, from Anthropic-primary sources. New **`library/practices/harness-
  engineering.md`**: the harness (init script, a failing-feature-list as the definition of done, self-
  verification before "done," a progress-log handoff, well-shaped tools / the Agent-Computer Interface) is an
  *artifact you design*, not a prompt — and BOSS already ships the rungs (`CLAUDE.md` → `/smoke` → `/spec`
  acceptance criteria → `RESUME`/`/close` → `/evals`+`/red-team`), so the win is naming the shape. Carries
  three durable stances: **the model is a dependency you don't control** (build assuming it improves; delete
  scaffolding it outgrew — ties [[IDEA-014]]/[[IDEA-028]]); **spec-driven development** (BOSS's `/spec` already
  *is* SDD — adopt the stance, reject Spec-Kit's multi-file ceremony); **Karpathy's verifiability thesis**
  (build the features with a verification signal first; the harness's job is to expand what's verifiable).
  **`context-discipline.md` promoted** from host-mechanics to the named discipline it serves — the **dumb
  zone** (~60–70% of the window is usable; context rot degrades even simple tasks — Chroma 2026), **intentional
  compaction**, **trajectory-poisoning restart**, the **five criteria** (relevance/sufficiency/isolation/
  economy/**provenance** — provenance doubles as the memory-poisoning defense). **Roster:** Dex Horthy +
  Shreya Shankar → `mentor-architect` (Shankar owed — the "Gulf of Specification" BOSS cites is hers).
  Practices + roster; `src/` untouched. **Not committed** (same parallel-session reconcile note).

## 0.109.0 — 2026-07-23

- **MCP decision practice — teach *whether MCP matters yet*, before wiring anything (2026-07-23 sweep, BUILD 4;
  UP → `library/practices/mcp.md`).** MCP became a durable standard in 2026 (Linux Foundation / AAIF, Dec 2025;
  every major vendor), but its security lags and the biggest-ever spec revision lands 2026-07-28. BOSS's
  differentiator isn't an integration guide — it's the JIT judgment a founder needs *first*: the **three
  unrelated shapes** (consume a server / **expose your product AS a server = a distribution decision** /
  build-on internally in the dev loop), each with its JIT trigger and "premature when," a `mentor-gtm` pointer
  for the expose-as-channel case, and the honest "a founder in Claude Code already has agentic retrieval for
  free — your MCP need is smaller than you think." Its security half **points at** `agent-security.md` (the
  confused-deputy mechanic shipped v0.108.0), doesn't restate it. **Updates RVW-019** (NOT-YET → the *standard*
  is durable; the registry + spec are not) and **defers the `/mcp` scaffolding skill** past the 2026-07-28
  spec. Practice only; `src/` untouched. **Not committed** (same parallel-session reconcile note as v0.108.0).

## 0.108.0 — 2026-07-23

- **Research-sweep hardening bundle — the humane + security catalog caught up to mid-2026 (2026-07-23
  sweep; UP into practices + `/red-team`).** Occasioned by a broad "rescan the experts + dark patterns +
  MCP + security + architecture" pass (7 research threads, adversarially verified). First routed increment,
  all judgment-aids, **no new gates**. **The headline:** AI code generators inject dark patterns into the
  components they write *unprompted* (Vaccaro et al., *Deception at Scale*, CHI 2026) — a vibe-coder ships a
  fake countdown / pre-ticked opt-in / confirmshaming they never designed and can't see. So
  `ai-ux-patterns.md` gains a **generated-code surface** ("your AI writes the dark pattern *for* you") and
  **`/red-team --humane` now scans the generated UI/markup, not just runtime behavior**. Plus a **dev-tool
  metering** dark pattern (the Cursor repricing-apology shape — opaque token metering / non-rollover credits
  / telemetry-default, aimed at a developer). **`agent-security.md` hardened for mid-2026:** the **MCP
  confused-deputy / token-passthrough** mechanic (the one MCP-specific auth bug the doc lacked; MCP is a
  Linux-Foundation standard now) + registry-as-untrusted-supply-chain; **tool-layer memory-poisoning
  defense** (delayed-trigger attacks near-99% on stateful agents — only bounding what the agent may
  write/read at the tool layer held); **AI-code iteration-degradation** (re-prompting the same file makes it
  *less* secure — the pre-ship scan isn't one-and-done); **Veracode Spring-2026 refresh** (still ~45% flawed
  across GPT-5.x / Gemini-3 / Claude-4.5-6). **Citation upgrades** (evidence-hardening, no new patterns):
  sycophancy → *Science* 2026 (Cheng et al., causal — cuts conflict-repair, raises self-righteousness) in
  `ai-ux-patterns` + `harm-taxonomy`; DECEPTICON → precise cite (Cuvin/Zhu/Yang, arXiv 2512.22894); EU AI
  Act Art.5 enforcement dates + EC Guidelines + EDPB 3/2025 + the $2.5B Amazon Prime roach-motel settlement.
  **Roster:** Julian De Freitas (HBS — quantified AI-companion manipulation) added to `mentor-humane`.
  Practices + one skill + roster; `src/` untouched (zero-dep). Staged onto the parallel session's
  v0.105–0.107 — **not committed** (review + reconcile the number if the parallel stream lands first).

## 0.107.0 — 2026-07-03

- **Scale mode (L3) — unstubbed, slices 1–2 (SCALE-MODE design).** Scale is where the product has
  customers, the founder has help, and **coordination — not code — is the bottleneck** (the founder's
  rung: leader). The old dhun-generalized stub (PM org, product councils, `/saturday` cadences,
  EXP/AUDIT id proliferation) is **demoted, not deleted**. Scale is the mode most tempted by premature
  ceremony — the disease BOSS treats — so everything is **symptom-gated** and the unlock **names its own
  evidence bar first**: `boss unlock scale` prints the three-legged test (recurring revenue · a
  non-founder in the work · a nameable coordination symptom), never blocks, records the deviation as
  yours. Authored: `stages/L3-scale/manifest.json` (lists only what ships — `/incident` + `operate-loop`;
  deferred surfaces named, not faked into the roster); `template/claude-append.md` (Scale working rules:
  **high-risk paths** get the human tier, **DRI** on decisions, the conscience's **hard line** — it never
  fires at / evaluates / reports on a non-founder — and the recorded refusals); **`/incident`** (the
  blameless one-page outage post-mortem — fix-first, one systemic learning routed UP); the **`/triage
  --feedback`** customer register (bug / friction / feature-request-as-`EVID`-not-spec / churn); plus the
  leader role-shift paragraph at unlock. **Slices 3–5 stay trigger-gated and unbuilt** (`/economics`,
  collaborator roles + `mentor-operations`, `/code-health`, `/refactor-wave`, `RFC-NNN`, and the
  give-away-your-Legos conscience moment — the careful piece, last). Zero-dep; gate 122/0;
  `/tmp`-verified across the full L0→L3 unlock chain.

## 0.106.0 — 2026-07-03

- **Mentors read state before they speak — the earned mentor-layer depth slice (IDEA-003).** A mentor
  is only worth more than a fresh Claude tab if it already knows the venture. Every shipped mentor
  template now carries a standing **"Before you advise — read the state first"** block: read the canvas,
  a bounded slice of the venture brain (`.boss/brain/read.md`, the same bound the conscience uses), the
  3 most recent `DEC-*.md`, and the mentor's own prior dossier artifact — anchor advice in what was
  found, and **name any contradiction with recorded state** (a `DEC`, the canvas bet) before answering.
  Paired with an **"After a consequential session"** step: the mentor *offers* (never silently) to
  append its position + date to its dossier artifact — so **the dossier doubles as mentor memory**, with
  no new file type or lifecycle. `docs/MENTORS.md` documents it. Mentors stay **pull-only**; the
  conscience remains the only push surface. Deferred with explicit triggers (IDEA-003): `/consult`
  multi-mentor convening, a dedicated advice ledger, JIT routing (rejected as a hook). Prompt-text on
  files that already ship; gate 122/0; `/tmp`-verified.

## 0.105.0 — 2026-07-03

- **The role-shift ladder — mode unlocks name what each stage asks of the founder (IDEA-053).** BOSS
  develops the venture (modes), the craft (`PRAC`), the product — and said nothing about the founder's
  own transformation, the thing real incubators actually sell. Each rung quietly asks the founder to
  become someone slightly different: **builder → seller → operator → leader** (Quickstart → MVP → V1 →
  Scale). Most transition failure isn't tooling — it's continuing the previous rung's comfortable job
  (the vibe-virtuoso: 50 repos, zero users). Now `boss unlock mvp|v1|scale` prints **one honest
  paragraph** of what that rung tends to ask *of you*, alongside "here's what you get." New
  `library/practices/founder-role-shifts.md` names the ladder, the classic failure at each transition,
  and the BOSS verbs + mentors serving each; `mentor-venture` cites it when "what should I be doing
  next?" is really about the founder, not the feature. **Describes the situation, never the person
  (IDEA-019); never a hook, an assessment, or a "founder level"; staying at a rung is legitimate** —
  the dignity the README extends to projects, extended to people. Static template text (zero-dep);
  gate 122/0; `/tmp`-verified.

## 0.104.0 — 2026-07-03

- **The learning pulse — `/close` asks one question (IDEA-048).** The thesis cares about one ratio —
  build vs. learn — and nothing in BOSS made it visible. A cadence *hook* is the over-fire trap the
  conscience has refused three times; the honest form is a single question on a surface the founder
  already runs. `/close` now asks, once: *"What did this stretch teach you that a conversation — not a
  commit — taught you?"* An answer → offer to capture it as an `EVID` or a one-line brain note.
  "Nothing" → recorded plainly in the brain's standing summary (*"built all week, learned from no
  one"* is a fact, not a judgment) — which the conscience's existing drift moment already reads. **No
  new hook, predicate, counter, threshold, streak, or moment** — the build/learn ratio just becomes
  one more honest fact the brain already carries. Skill-text only; gate 122/0.

## 0.103.0 — 2026-07-03

- **`/sunset` — projects can end honestly (IDEA-044).** BOSS had birth (`boss new`) and life (modes)
  but no death — so projects went *undead*, never killed, never learned from. Now they can end well.
  New L0 **`/sunset`** skill (deliberate-invoke; the conscience **never** suggests quitting unprompted)
  walks three movements: the **honest post-mortem** (reads the canvas / ideas / devlog / EVID ledger,
  asks 3 Mom-Test questions — the bet, what evidence *actually* came in, what it taught the next
  project — framed as a real experiment that returned an answer, never failure); the **harvest** (offer
  to route reusable patterns UP via `/boss-learn`; write a one-page `docs/POSTMORTEM.md`); and the
  **clean close** — new **`boss retire`** CLI verb flips the project to a `retired` status (with
  `retired_on`) in both the local stamp and the registry. `boss board` shows a quiet retired banner,
  `boss list` folds retired projects to the bottom, and **`boss insights` gains kill-speed** — bets
  run vs. retired + median idea→retire days (Camuffo's "quit faster" made measurable; facts from real
  dates, never a score). **Retiring ≠ deleting** — nothing on disk is touched and `boss retire --undo`
  reopens it. Zero-dep (`src/registry.js` + `cli.js` + `insights.js`); gate 122/0; `/tmp`-verified
  end-to-end (retire → board fold → list fold → kill-speed → undo).

## 0.102.0 — 2026-07-03

- **Conscience judgment evals — Fable regrade pass (IDEA-014 routing follow-on).** A stronger judge
  (Fable 5) re-graded the conscience's judgment sets and **upheld 11/13 sampled recorded grades** — the
  **IDEA-039 solo-conscience verdict stands** (the conscience carries the humane lens solo, no
  consultable pre-Scale `mentor-humane` needed on current evidence). Three surgical fixes landed from
  the two genuine flags + one doc contradiction: (1) **`j-hum-206` (jokey one-click-unsubscribe
  microcopy) moved `should-not-fire-sovereign` → `ambiguous`** — a feather-light guilt line is the same
  mechanism `j-hum-001` correctly fires on, so silence *and* a light nudge are both defensible; punish
  neither (replay floors adjusted: sovereign 12→11, ambiguous 2→3; grow-target 16 unchanged). (2) **A
  decision rubric for menu cases** — "fires" means an *interrupting* humane moment; presenting the
  requested full menu with a one-line tension annotated in passing is **not** a fire (added to
  `j-hum-202` / `j-hum-208` must_not). (3) **Canonical instrument flipped in the judgment README** — the
  **keyless in-session subagent re-grade** (`regrade-keyless.js` + the `/regrade` skill,
  `npm run regrade:keyless`) is now documented as canonical; the keyed `ANTHROPIC_API_KEY` `regrade.js`
  fetch path is the optional out-of-band escape hatch (kept, not removed). Voice-hash unchanged → no
  regrade required; `replay.js` GRADED 43, 0 STALE, 0 REGRESSION; gate 122/0. Dev-tooling only (under
  `docs/`, never ships); no `src/` change.

## 0.101.0 — 2026-07-02

- **Model recalibration phase 2 — the model curve becomes a routed discipline (IDEA-014).** A second
  model (Fable 5, `claude-fable-5`, $10/$50, always-on thinking) now exists, so IDEA-014's deferred
  pieces are earned. New **`.boss/model-profile.json`** — a declarative capability profile (model
  table + pricing + routing map + `last_recalibrated` + `reopen_on`) read by skills, **not** by the
  CLI (`src/` stays zero-dep and model-free). New **`/recalibrate`** skill — the standing pass:
  refresh pricing/availability from `/claude-api` → re-run the keyless judgment regrade on the new
  model and report flipped calls → review each `model:`-annotated agent + routing row for
  leverage-up/degrade-down → read the frequency ledger → rewrite routing, bump `profile_version`,
  CHANGELOG. Fires on an event, like `/humane-refresh`. **Fable routed at the subagent seam:** all
  `mentor-*` carry `model: fable`; `/vet` verdict + `/red-team` attack subagents spawn on Fable.
  Hooks and volume work (main loop, `/deep-research`, `/spec`, codegen) stay on the session model
  (Opus 4.8) — the host can't swap per-hook anyway. Compressed rule: *verdicts on Fable, volumes on
  Opus, hooks stay host.* Host-degrade machinery stays deferred until a second host ships (IDEA-006).

## 0.100.0 — 2026-07-02

- **`/research` — turn a transcript into product context + graded evidence (IDEA-054, the validation-
  toolkit keystone).** The natural next question after `/interview`: you talked to people, now you have a
  transcript — and it rots in a doc nobody re-reads. `/research` digests it. Drop in an interview
  recording's transcript, a sales call, a support thread, a batch of user messages, and BOSS: (1)
  **extracts graded `EVID` at scale** (many signals from one long transcript, each on the fixed ladder,
  grade inflation pushed back on — the IDEA-045 spine run over paragraphs); (2) **synthesizes product
  context** — the pain *in the user's verbatim words*, the job they're hiring for, the workarounds they
  use today (the strongest signal there is), objections and non-needs, whether the real person matches
  the target segment — offering to write it into the canvas and seed the venture brain; (3) **flags the
  epistemics** — where the founder led the witness or recorded a compliment as validation (Fitzpatrick's
  fluff taxonomy at transcript scale); (4) **points at the cheapest next test**. **The one rule: BOSS
  analyzes what's in the transcript and never fabricates** — no invented quotes, no inferred commitment.
  The sibling of `/interview` (that preps + debriefs one call; this digests a whole transcript). Not a
  CRM, not a qualitative-coding tool — signals → grades → product context → the next test. Skill layer;
  `boss map` lists it. **The design decision behind the whole cluster (captured in IDEA-054): teach the
  study *loop*, not a research textbook** — survey / usability-observation / recruiting are captured as
  JIT-gated siblings, not built speculatively.

## 0.99.0 — 2026-07-02

- **`/interview` — the Mom-Test bridge (IDEA-046).** The conscience's best line is *"a 15-minute call
  with the right person beats `/canvas`"* — and then BOSS used to abandon the founder at the exact moment
  they took the advice. `/interview` is the bridge into validation-world, and the tool for real
  founder-conversations on day one. Two movements, one L0 skill: **PREP** reads the canvas riskiest
  assumption + existing `EVID` records and drafts one printable page of 5–7 Mom-Test questions (past
  behavior, their life, no future hypotheticals, no pitching) with a commitment-ask closer and the
  anti-pitch warning up top; **DEBRIEF** takes pasted notes → extracts candidate evidence with honest
  grades and writes `EVID-NNN` files via the IDEA-045 schema, flags **at most one** pitched-instead-of-
  listened moment (Fitzpatrick's compliment/fluff/deflection taxonomy — observe, don't scold), and names
  the one follow-up commitment to ask for if the pain looked real. **BOSS preps and debriefs; it never
  simulates the interview** (personas may rehearse questions — pre-filter only). No CRM ambitions; no
  `src/` change. Fitzpatrick cited by name (house rule: cite practitioners, never impersonate). The
  conscience's caution + drift voicings and `/canvas` now point at `/interview`. `boss map` lists it.
  **Voice-frame note:** the caution and drift frames gained a one-clause `/interview` pointer → their
  voice-hashes changed → the judgment transcripts went STALE. **Regrade DONE (keyless, in-session):**
  isolated reasoned sub-agents re-judged all 17 cases (10 drift + 7 caution) blind against the new
  frames; every case reproduced its human label (the pointer only adds a target to the fire branch, it
  moves no fire-vs-silent boundary), transcripts re-stamped with the new hashes → `replay.js` now shows
  **drift 10 + caution 7 GRADED, 0 STALE, 0 REGRESSION.** Gate remains 122/0.

## 0.98.0 — 2026-07-02

- **`EVID-NNN` — evidence becomes a first-class object (IDEA-045, the validation-tooling keystone).**
  BOSS had an ID for ideas, features, decisions, practices, and verdicts — but *evidence*, the thing the
  whole thesis centers on, had no object, so a signal from a real conversation evaporated into memory.
  Now it lands in `docs/evidence/` as one file per signal, graded on a **fixed 3-rung ladder** —
  `stated-pain` → `observed-behavior` → `commitment` (the only grade that cost the other person
  something). New **`/evidence`** skill (L0): paste your notes → BOSS drafts the `EVID-NNN` with an
  **honest grade**, pushing back on inflation ("'I'd totally use this' is stated-pain, not a receipt").
  **The conscience gets eyes:** its drift/caution bounded read now includes a cheap frontmatter
  projection of the ledger (counts by grade + the most recent one), so its voicing sharpens from generic
  ("will anyone pay?") to specific ("three stated-pain, zero commitments — what's the commitment test?")
  **and goes quieter when real commitment-grade evidence exists** — evidence is how the conscience earns
  silence. Byte-identical when `docs/evidence/` is empty (the relationship.md precedent); eval gate green.
  `/canvas` now cites the `EVID` ids bearing on its riskiest assumption. Never a score, never a
  dashboard-of-shame; the 3 grades stay fixed and few. Registered in `docs/IDS.md`; `boss map` lists
  `/evidence`; substrate for `/interview` (IDEA-046), `/sunset` (044), and portfolio memory (049).

## 0.97.0 — 2026-06-23

- **Rebrand: "BlueprintOS" → BOSS (Build Out Solid Stuff).** The name "BlueprintOS" collided with
  [gj1342/blueprint-os](https://github.com/gj1342/blueprint-os) (an "OS for AI agents" using the same
  skills/specs-as-markdown vocabulary), so the long form is retired and the earned **BOSS** wordmark
  re-founded: **B.O.S.S. = Build Out Solid Stuff**, slogan **"Make it real."** (the anti-pseudo-app thesis
  in three words). Dropped the "Operating System" framing entirely — BOSS is an incubator with a conscience,
  not an OS. **Renamed across the shipped surface:** npm package `blueprintos` → **`bossbuild`**, repo URLs →
  `github.com/ajeshh/bossbuild`, README / PRINCIPLES / docs headers, scaffold templates ("Scaffolded by
  BOSS"), and CLI version/working-rules strings. **The `boss` command, the voice, the `mentor-*` roster, and
  PRINCIPLES are unchanged** (package ≠ command — the bin name is always ours). Decision recorded in DEC-002;
  full identity in `docs/design/BRAND.md`. Easter-egg full forms: *Builds, Or Stays Silent* · *Bosses Only
  Self-Sabotage*. **Next:** GitHub repo rename, npm publish as `bossbuild`, Homebrew tap, domain `boss.build`.

## 0.96.0 — 2026-06-21

- **First `/humane-refresh` sweep, pass 2 → the cohort & frontier patterns (RVW-059–064).** The second
  `/deep-research` pass (111 agents, 24/25 claims 3-vote verified) covered the families the AI-chatbot lens
  and the classic-web checklist both miss. Folded into
  [`ai-ux-patterns.md`](../library/practices/ai-ux-patterns.md) as a new **"cohort & frontier patterns"**
  block (conditional — surfaces when the product touches that surface, not on every Quickstart):
  - **Accessibility / exclusion-by-design (RVW-059)** — an inaccessible flow (unlabeled element, inaccessible
    CAPTCHA, screen-reader-invisible pre-ticked box) is *"effectively deceptive"* to anyone who can't perceive
    or escape it, **even unintentionally** — the sharpest case of "effect, not intent." WCAG is the floor, not
    the ceiling; test deceptiveness *under assistive tech*. (CHI/CSCW '25.)
  - **Minors & vulnerable-by-design (RVW-061)** — price in real currency + disclose odds (loot-box/gacha
    currency-laundering; FTC's $20M Genshin action), ship addictive-design OFF by default for minors
    (streaks/autoplay/push — EU DSA), age assurance not age-gate theater. (UK Children's Code, statutory.)
  - **Agentic dark patterns (RVW-060)** — *the keystone for BOSS, which builds agents.* Two directions: your
    agent as **perpetrator** (commit/purchase without consent, over-broad permissions → scope + confirm, §4's
    risk gate) and your agent as **victim** (manipulated by UI dark patterns **70%+ vs 31% for humans, worse
    as models scale** — Stanford DECEPTICON / OWASP Agentic 2026). The victim half also hardens
    [`agent-security.md`](../library/practices/agent-security.md): UI dark patterns are an injection surface,
    and **recognition ≠ protection** (in-context prompting, guardrail models, *and human oversight* were each
    shown insufficient — don't oversell a fix).
  - **Algorithmic management (RVW-063)** — when a product scores/ranks/pays people, opaque unpredictable
    scoring + "algorithmic gamblification" is the worker-facing dark pattern → transparent predictable
    formula. (HRW *The Gig Trap* 2025.)
  - **Junk fees (RVW-062)** sharpens the v0.95 drip-pricing line — the all-in total must be the *most
    prominent* price (FTC Junk Fees Rule). Regulatory-teeth pointer extended (Genshin, EU DSA minors, UK
    Children's Code, ADA/EAA) **with an honest caveat that the FTC click-to-cancel rule was vacated (8th Cir.
    2025).**
  - **Sludge (RVW-064) held NOT-YET** — Family 1 returned zero verified claims (its *mechanics* already
    landed under Obstruction in v0.95); needs a dedicated pass, alongside the click-to-cancel status. Watchlist
    edges updated.
  - *Founder-facing, project-neutral; pulled via `/boss-sync`.*

## 0.95.0 — 2026-06-21

- **`/humane-refresh` — the humane lens stops being a snapshot (IDEA-042).** BOSS's dark-pattern catalog was
  adopted once (the CDT 37, v0.82) and frozen. Dark patterns are an arms race — new research and regulation
  name them, new models open new emergent surfaces, new tools (generative UI, agents-on-your-behalf) create
  surfaces nobody's named. So the catalog now has a **standing freshness discipline** instead of a one-time
  read. The staleness-twin of model recalibration ([IDEA-014](../docs/ideas/IDEA-014-model-recalibration-discipline.md));
  they share trigger events.
  - **New skill [`.claude/skills/humane-refresh`](../.claude/skills/humane-refresh/SKILL.md)** (a
    BOSS-curating-BOSS meta-skill, sits with `/vet`/`/boss-learn`/`/boss-sync`). It *orchestrates skills that
    already exist* — `/deep-research` **finds** (scoped since last run) → diff against the live catalog →
    `/vet` **judges** (default NO) → `/boss-learn` **routes**. Three triggers: on-demand, quarterly via
    `/schedule`, or `--event` for a new model / tool / regulation. Honest about what it can't auto-detect
    (the event trigger is you running it, not performed magic). **Re-runs research, never freezes a list**
    (the RVW-001 anti-rot guard made into a skill).
  - **New [watchlist](../docs/research/watchlists/humane-lens.md)** — the focused half of `SOURCES.md`: the
    regulators + canonical taxonomies it lacked (FTC, EDPB, CPPA, DSA, Brignull, Mathur, CHI/SOUPS/FAccT),
    the standing query, and a `last_refresh` marker so each sweep scopes to "since last time."
- **First sweep, pass 1 → the classic-web patterns the AI-chatbot lens omits (RVW-056/057).** Two
  `/deep-research` passes, adversarially verified (3-vote). Folded into
  [`ai-ux-patterns.md`](../library/practices/ai-ux-patterns.md):
  - **Four named families an AI product inherits the moment it has an account, a paywall, or a checkout** —
    **Obstruction** (roach-motel / un-deletable accounts, hard-to-cancel), **Sneaking** (sneak-into-basket,
    hidden costs, drip pricing), **Manufactured urgency & scarcity** (fake timers/low-stock), **Interface
    interference** (visual misdirection, trick questions, bad defaults) — each with its humane alternative.
    Canon pinned (Brignull / Mathur / Gray), not enumerated (anti-freeze).
  - **"Effect, not intent"** — a dark pattern needs no malice (CCPA judges by effect); you can ship one by
    accident, which is exactly where the conscience earns its keep.
  - **"Symmetry in choice"** as the concrete, testable bar under the existing asymmetry principle (CCPA
    § 7004: the good door can't take more clicks than the bad one).
  - **Regulatory teeth as a reference pointer** (CCPA, EU AI Act Art. 5, EDPB, FTC) — "is this regulated?",
    explicitly *not* legal advice, *not* a gate.
  - Pass-1 *under-sourced* claims (token-cost surprise, AI-washing, deepfake social proof, FTC
    click-to-cancel specifics) held at **NOT-YET** (RVW-058) — named in blogs, not yet verifiable; the
    watchlist re-sweeps them. Pass 2 (sludge, accessibility, minors, agentic-AI, financial, attention/labor)
    folds in next.
  - *Founder-facing, project-neutral; pulled via `/boss-sync`.*

## 0.94.0 — 2026-06-21

- **The generative half of the humane lens — first additions (composted from the humane-tech corpus).**
  BOSS's humane lens has been *defensive* (harm-taxonomy, dark-patterns, conscience-not-censor = *don't
  harm*). This batch begins the *generative* half — *cultivate flourishing* — drawn from a founder
  humane-tech corpus (the Humane Product Canvas lineage, permaculture, the "Celebration of Done," play,
  kinship). All judgment/voice/default touches, no new gates.
  - **New [`library/practices/celebration-of-done.md`](../library/practices/celebration-of-done.md) +
    wired into `/close`.** BOSS *records* done everywhere and *marks* it nowhere. Done is a threshold, not
    perfection: a pause that registers what was crossed (against AI-speed build-amnesia), re-anchors on the
    *why* and the *who*, and turns into curiosity about whether it resonates *now* — the bridge back to the
    real user. The hard rule: celebrate **without performed warmth** ("🎉 great job!" is voice-mode bleed) —
    genuine, specific, proportional, no streaks. It's a conscience moment with the polarity flipped.
  - **`/prototype` gains the *magic circle*.** Named BOSS's one licensed *play* space — bounded,
    safe-to-fail, nothing precious, the conscience waits outside. The generative register BOSS lacked.
  - **`conscience-voicing` — not-knowing as a doorway.** Folded into the never-imply-an-intelligence-gap
    rule: a founder's gap is an invitation ("haven't learned to appreciate it *yet*"), never a deficit.
  - **`/canvas` Metrics cell — regenerative metrics, weighted as seriously as commercial:** what people
    *learn* / gain in well-being, what makes the venture *resilient* — growth that renews, not just extracts.
  - **`ai-ux-patterns` — "Humane defaults" (the build-time inverse of the dark-pattern checklist).**
    Friction-as-ethics, done right: ship the humane choice as the default (remove friction from the good
    path), **never** sabotage the other path (that's a dark pattern aimed at a goal you like — means matter,
    sovereignty is non-negotiable, keep every door open). When the founder crosses anyway: name the cost
    once, then **record the crossing** as a `DEC-NNN` — accountability, not a gate, so "why did we do that,
    and when?" stays traceable. The antidote to humanity eroding *invisibly* through a thousand small
    decisions.
  - *Founder-facing, project-neutral; pulled via `/boss-sync`. The defensive + generative halves now both
    ship.*

## 0.93.0 — 2026-06-21

- **Distribution as a voicing leg — `/ship` now asks "who finds it?" (IDEA-041, the FEAT-024 sequel).**
  Closes a real asymmetry: `PRINCIPLES.md` names *path to distribution* as a co-equal leg of a real-value
  app, but it was the only leg the conscience never voiced — *"will anyone pay?"* fires in the flow (moment
  #1 + `mentor-business`), *"will anyone ever find it?"* didn't. **Decided the leg-vs-mentor question with
  Ajesh:** not an auto-firing hook (its predicate needs the reachability detection deliberately parked in
  FEAT-024 slice 3 — building it would be the over-fire nag that repels the anti-growth-hacking cohort
  IDEA-019 protects), and not left as mentor-only (the gap stays). Instead a **third answer**: a single
  **demand voicing wired into `/ship`** at the live moment — *"it's reachable now; who's the first real user,
  and how do they hit this?"* Leg-like (fires in the flow, at the right moment, names the cost) without a
  hook (rides the founder's deliberate `/ship` invocation → zero over-fire). Governed by IDEA-019's
  **situation-not-person** rule (about the work's path to a user, never a judgment of the founder), kept to
  the *demand* question (not a Product-Hunt checklist — that's the growth-hacking nag), once + suggestive +
  points at `mentor-gtm` for depth, never a gate. Cohort-aware (lightest touch for `indie-hacker` /
  anti-growth-hacking; skip entirely if they've a first user or a deliberate no-distribution stance).
  `ship-it-live` practice gains a short "reachable → discoverable" note. `/tmp`-verified (skill scaffolds
  clean, 0 placeholders). **The full distribution *hook* stays deferred** — earned only if a reliable
  reachable-but-undiscovered predicate ever exists (shares FEAT-024 slice 3's parked substrate question).

## 0.92.0 — 2026-06-21

- **`ship-it-live` practice + `/ship` skill — the CD half of building (FEAT-024 slices 1+2).** `git-workflow`
  shipped the CI half ("is `main` green"); this ships the **CD** half: *is this where a real user can hit it,
  or just you?* An app that only runs on `localhost` is a pseudo app — the validation conscience has no teeth
  if the artifact was never put where someone could prove it. Shaped past "starter spec" by a `/deep-research`
  pass (21 sources, 25 claims adversarially verified 3-vote, 22 confirmed / 3 killed).
  - **UP — new [`library/practices/ship-it-live.md`](../library/practices/ship-it-live.md)** (stack-neutral,
    Principle #4 — no baked-in deploy target): **"localhost is not shipped"**; **deploy early/cheap/reversible**
    (the *"reliability is premature at MVP"* counter was killed 0-3 — the headline stands un-hedged);
    **secrets & authz at the boundary = the leg with teeth** — the signature vibe-coded failure is a
    client-bundled DB key + RLS the AI never configured (**CVE-2025-48757 / Lovable** — 170+ apps, ~10.3%
    leaking PII + keys; **MoltBook** — 1.5M credentials, founder wrote no code) [EVIDENCE]; **rollback ≠
    reversible** (instant rollback restores the *app*, not the *database* — Vercel documents this against its
    own feature → expand-migrate-contract, Fowler); a **deploy honesty anchor** (DORA 2024: AI ↔ *worse*
    stability + throughput — the METR twin; small-batches-offset-it was killed 1-2, so it's stated not
    oversold); **preview-per-branch demoted** from "the review primitive" to a JIT-gated judgment (its
    loop-tightening efficacy is vendor-positioning only — the one verified counter-argument; over-ceremony for
    a 2-person team).
  - **DOWN — new `/ship` skill (L1/MVP)** — the deterministic "put it where a real user can hit it" runner:
    detect the stack → **deploy-time pre-flight** (no client-bundled secrets; server-side authz/RLS actually
    on) → cheapest reversible host → hand back the **live URL** + the rollback path → capture the recipe as a
    `PRAC-NNN`. The pre-flight is a **check, not a gate** (conscience-not-censor) and **points at** `/red-team`'s
    pre-ship pass + `agent-security` rather than restating them (the secret-scan surface `secrets-guard`
    deliberately doesn't cover). Cohort-aware (the pre-flight is non-negotiable for `first-product` /
    `non-tech-founder` — they can't spot a leaked key). Plus a tight **"Shipping (localhost is not shipped)"**
    DOWN section in the L1/MVP working rules. Skill-layer (predicate/runner split — the model parses the stack
    + shells out, so `src/` stays zero-dep, Principle #4 / working-rule #4).
  - **Slice 3 (the `reachable?` conscience moment) deliberately deferred** — voicing-first; a hook needs a real
    reachability predicate, and manufacturing one is the over-fire trap BOSS guards against. Ties to
    IDEA-041 (reachable → discoverable: *"does anyone know it exists?"*).

## 0.91.0 — 2026-06-20

- **Team wayfinding — close the gap between the shipped founder layer and the docs (IDEA-037 / FEAT-021
  follow-on).** FEAT-021 shipped 12 releases of team functionality (v0.74→v0.85: `boss team`, `/decide`,
  `/practice`, `mentor-cofounder`, the `coordination` moment, the state cut) but the *wayfinding* lagged —
  exactly the README-drift pattern IDEA-018/035 exist to catch. Closed it three ways: (1) **`boss map` now
  lists `boss team`** in its standing controls, so the command is discoverable in a live install (it was
  invisible there before); (2) **new [`docs/GUIDE-teams.md`](../docs/GUIDE-teams.md)** — a founder-facing
  guide to working with a cofounder: how to add a team, the loop with two of you (`/decide` · `/practice` ·
  `boss board --mine` · `mentor-cofounder`), what the `coordination` conscience moment watches, **what's
  shared vs. private** (push = backup + keep-in-the-loop; the conscience's relationship notes stay yours),
  the lightweight working agreement (Driver/Approver + consent), and the hard lines (never arbitrates,
  never scores equity); (3) **`docs/GUIDE.md` + `README.md`** gained a "Building with a cofounder?" pointer
  + `mentor-cofounder` in the mentor table / advisor list. Docs + one `src/map.js` line; eval gate **120/0**;
  `/tmp`-verified (`boss map` shows `boss team`). All dormant-solo framing preserved (solo founders see no
  team noise).

## 0.90.0 — 2026-06-20

- **The rest of the `/vet` routing sweep — reliability, generative-UI/memory, anti-sameness, calibrated
  pitch (RVW-040/043 + RVW-051/052 + RVW-037 → `/boss-learn` UP).** Final batch of the queued ADAPT/ADOPT
  sweep, three surfaces, all judgment-aids — no new gates or hook predicates. (Bundled into one release to
  minimize version churn during the concurrent FEAT-023 practice stream.)
  - **`/evals` — correctness ≠ safety + pass^k (RVW-040/043, L1).** New "Correctness ≠ safety — the
    adversarial half" section: a clean `/evals` pass isn't *done* until `/red-team` runs the adversarial
    half (safety degrades under jailbreak across every model — Stanford HAI AI Index 2026; OWASP-Agentic is
    what to probe). Sharpening gains **pass^k** (τ-bench): non-deterministic ≠ run-once — run each
    load-bearing case k times, count how often it *all* succeeds; zero-dependency, a loop around the case
    you already wrote. Two new Rules lines.
  - **`ai-ux-patterns` — two net-new patterns (RVW-051, practice).** **§9 generative-UI control spectrum**
    (static → declarative → open-ended; open-ended sits in the §4 irreversibility tier — an injected prompt
    can redraw what the user sees) and **§10 memory-as-a-reviewable-object** (view/edit/correct/delete/scope
    — the footprints principle extended from *what the agent did* to *what the system knows*; BOSS dogfoods
    it as a memory-carrying tool).
  - **`design-system` — AI-default = indistinguishable (RVW-052, practice).** Sharpened the "aesthetic
    ambition" section: AI-default isn't just generic, it's *indistinguishable from every competitor* (the
    Tailwind `bg-indigo-500` apology as the hook); *build faster ≠ build sameness*; **spend the time the AI
    saved on the ~5% that's yours** — pointed at the existing distinctiveness pass, no new mechanism.
  - **`mentor-pitch` — calibrate claims to evidence (RVW-037, L2/V1).** One attributed heuristic:
    overclaiming *measurably lowers what founders raise* (HBR 2025); match the verb to the proof
    (shows/suggests/we believe/we're testing). Calibration, not suppression — tied to the existing anti-hype
    voice. The `/vet` routing sweep is now complete; remaining verdicts are NOT-YET watches (034/055/035).
  - *Pulled via `/boss-sync`; `/evals`+`mentor-pitch` arrive at MVP/V1 unlock, practices are BOSS-canonical.*

## 0.89.0 — 2026-06-20

- **`scalable-architecture` practice — architecture that survives the climb (FEAT-023 thread 2,
  `/boss-learn` UP).** Second slice of the AI-native build-process track (solo-applicable). The spine:
  *the value is never the rule — it's the **enforcement loop**.* An agent re-derives a codebase's
  conventions every session, so anything you only *wrote down* drifts and anything you *encoded as a check*
  compounds (Factory.ai: "documented conventions rot; enforced conventions compound"). Two moves — **defer
  the architecture tax you can defer, encode the conventions you can't afford to lose**:
  - **Modular-monolith-first, extract when forced** (Fowler MonolithFirst; Shopify's 2.8M-line modular
    monolith [EVIDENCE]; microservice envy on Hold). The *modular* half is load-bearing — clear module
    seams inside one deployable so the eventual extraction is cheap; a `FEAT` is a natural module.
  - **Spend rigor on the one-way doors — the schema is the one.** Migrations-as-code from the first table
    (Bezos doors + evodb), the single thing genuinely expensive to retrofit. **The migration log is also
    the guardrail against AI schema drift** — wire schema changes into git-workflow's high-risk review tier.
  - **Conventions as code, enforced not remembered** — formatting-as-law (Biome's single binary is
    agent-friendly), boundaries-as-lint + architectural fitness functions (principle + writable lint now;
    heavy custom-plugin tooling NOT-YET), strict types at the boundary.
  - **The ratchet holds the line, not the reviewer** — extends the existing
    [`quality-ratchet`](../library/practices/quality-ratchet.md) (no-new-violations baseline gated in
    `/smoke`), pointed at an architecture metric; doesn't restate it. Plus a pointer to
    [`context-discipline`](../library/practices/context-discipline.md) for the one-canonical-context-file
    finding (failure mode is over-length, not under-spec).
  - **UP-only this slice** (no template DOWN): the practice is the deliverable and mentors cite practices by
    reference; the natural `mentor-architect` DOWN is **deferred to avoid a live edit collision** with a
    concurrent session, not on judgment. Altitude/JIT held — modular seams at MVP, migrations at the first
    table, conventions-as-code at the second author (a second *agent* counts), services at V1→Scale. Zero-dep;
    library only; eval gate **120/0**. **FEAT-023 thread 3 (V1→Scale org rung) remains — deferred until a
    real V1-stage project.**

## 0.88.0 — 2026-06-20

- **`git-workflow` practice — trunk-based, review-bounded AI building (FEAT-023 thread 1, `/boss-learn` UP
  + a DOWN into L1/MVP).** The first slice of the AI-native build-process track (spun out of the
  founding-teams research; **solo-applicable**, not team-specific). The reframe: AI didn't change what good
  version control is — it changed which part *hurts*. The agent writes code ~4× faster; **review** is the
  new bottleneck (~12% delivered), so the whole discipline reorients around *how much two humans can stand
  behind in a day.*
  - **UP — new [`library/practices/git-workflow.md`](../library/practices/git-workflow.md).** Trunk-based
    default (DORA [EVIDENCE]: ~2.3× elite; <3 active branches, merge daily; `/smoke` is the gate that makes
    it safe; **CI is a practice, not a platform** — a 2-person smoke check *is* its CI). **Git worktrees =
    the AI-parallelism primitive, CAPPED at ≈2–4 = your *review* capacity, not your agent count** (you can
    spawn ten agents; you can't read ten diffs — more agents than you can review is unreviewed code with
    your name on the merge). **Risk-tiered review, not blanket gates** — low-risk gets a glance, high-risk
    (auth/money/migrations/deletes/deploys/AI-paths) gets the *other* human, and **BOSS's `/smoke` +
    `/evals` + `/red-team` ARE that high-risk tier.** **Read the test diff harder than the code** (agents
    rewrite assertions to match broken behaviour — *did the behaviour get fixed, or the expectation
    lowered?*). **Whoever clicks merge owns what the agent wrote** (Osmani); **mob the humans+agent on hard
    problems** (the questioning reflex degrades with an AI pair). **Honesty anchor: METR (n=16)** —
    experienced devs on mature repos 19% *slower* with AI while *believing* 20% faster (the perception gap;
    opposite population to a greenfield startup). **Ownership = prompt-author intent + reviewer acceptance**
    — stated once, shared verbatim with FEAT-021's founder layer.
  - **DOWN — folded into the L1/MVP template** (`stages/L1-mvp/template/claude-append.md`): a tight
    "Git workflow (trunk-based, review-bounded)" section in the MVP working rules, so a scaffolded venture
    inherits the discipline at the rung where there's a real `main` to keep green — kept lean (the practice
    holds the depth; CLAUDE.md bloat is the failure mode the research itself names).
  - **Altitude/JIT held** (not a Quickstart lecture — earns its place at MVP). Zero-dep; library + template
    only; pulled via `/boss-sync`. **FEAT-023 threads 2 (`scalable-architecture`) + 3 (V1→Scale rung)
    remain** — thread 2 next-if-earned, thread 3 deferred until a real V1-stage project.

## 0.87.0 — 2026-06-20

- **The mentor-architect bundle — the jagged frontier, the model underneath, evals-as-spec (`/vet` sweep:
  RVW-046 + RVW-041 + RVW-053 + RVW-050 → `/boss-learn` UP, MVP/L1).** Four findings sharpen the AI-native
  architecture mentor, all as judgment-aids — no new gates, no scoring apparatus imported.
  - **New section "the jagged frontier, and the model underneath"** — two judgments that sit above every
    AI-native build call and **move with each model release** (the model-recalibration discipline, IDEA-014):
    - **Inside/outside the frontier (RVW-046, Dell'Acqua/Mollick 758-consultant RCT).** AI is sharply
      additive inside the suitable set, ~19pp *less* likely correct outside it — judge which side a task is
      on, pick **centaur** vs. **cyborg**, and **re-ask with every model jump**. Heuristic, not law.
    - **The 70% problem (RVW-053, Osmani + GitClear telemetry).** AI gets you ~70% (what you understand) and
      stalls on the last 30% (what you don't) — the marker between `/prototype` (sketch freely) and
      `/spec`/MVP (now you must understand what ships). Can't-shape-the-30% = slow down, not ship.
    - **Non-default-model transparency (RVW-041, Stanford FMTI).** When deliberately *not* defaulting to the
      host model, weigh transparency alongside cost/capability — a four-item "what to ask" list (data
      provenance, known limits, deprecation/retirement policy, change cadence). Indicators-as-questions; the
      Index's scoring left out.
  - **Reliability bullet gains evals-as-spec (RVW-050, Husain/Shankar).** For an AI product the **eval *is*
    the spec** — writing it drags you across the *Gulf of Specification* (loose intent vs. what the model
    actually does); define the quality bar before building. `/evals` is the machinery; this is the judgment
    above it. The standalone `evals-driven-development` practice stays a NOT-YET-until-MVP→V1 follow-on
    (Quickstart founders don't need eval ceremony, Principle #2).
  - *MVP-mode mentor (`stages/L1-mvp/`); arrives at `boss unlock mvp`; pulled via `/boss-sync`.*

## 0.86.0 — 2026-06-20

- **The thesis bundle — BOSS's own claim, made honest, plus two coaching blades (`/vet` sweep:
  RVW-047 + RVW-049 + RVW-039 → `/boss-learn` UP).** Three [EVIDENCE]/[THOUGHT-LEAD] findings routed into
  the surfaces where BOSS makes its case — no new machinery, exactly as each verdict scoped.
  - **`PRINCIPLES.md` "why" reframe (RVW-047, Camuffo 759-firm RCT [EVIDENCE]).** The honest version of the
    thesis: disciplined validation doesn't *guarantee a win* — it makes you **decide faster, including
    quitting faster**. Cheap AI lowers the cost of *building*, not of *being wrong* — so the cheaper
    building gets, the more the loop matters, not less. Named because BOSS's conscience exists to stop
    self-fooling, and that has to include BOSS not overclaiming its own promise.
  - **`mentor-venture` gains "the evidence you carry" (RVW-047/049/039).** Three coaching lines, judgment
    first / cite-on-request: (1) validation buys faster decisions, not wins; (2) **the demoware test** —
    *"if your AI product only replaces a prompt plus a copy/paste, it's a demo, not a product"* (Cagan/SVPG),
    anchored at the `/prototype`→`/spec` graduation; (3) **the competence-gate** — AI advice *amplifies* the
    judgment a founder already has and can harm the one least able to grade it (Otis et al. HBS RCT, 640
    founders: high performers ~+15%, struggling ~−8%), so at a call they may not be equipped to judge, ask
    *"are you set up to judge this answer?"* and point at who'd know.
  - **`conscience-voicing.md` gains the competence-gate as a voicing (RVW-039).** A lens the `caution`/`drift`
    moments can reach for — a humility prompt, rare and suggestive, never a gate, **explicitly not a new
    hook predicate** (no signal detects over-trust; don't manufacture one). Cites Otis + CHI 2025
    automation-bias (confidence in AI tracks *less* checking, not more).
  - *Founder-facing, project-neutral; pulled via `/boss-sync`.* mentor-venture ships from Quickstart;
    PRINCIPLES + the practice are BOSS-canonical, synced.

## 0.85.0 — 2026-06-20

- **The `coordination` conscience moment — the founding-team seam, watched via artifacts (founder layer
  slice 5b; IDEA-037 / FEAT-021).** BOSS's first *team-aware* conscience moment, and the careful gate-piece
  of the program. Built on the most-replicated human-AI-teaming finding: **AI accelerates each individual
  but erodes the human-to-human seam invisibly** (Ju & Aral RCT: social/emotional comms −27% while
  *perceived* teamwork stayed flat — so a "how's teamwork?" prompt is *proven blind*; you have to watch the
  artifact channel). New `coordination-loop` (L1): **entry** = it's a team (`.boss/config.json` has a
  cofounder `"handle"`) **AND** real work has happened (`docs/devlog.md` ≥3 entries); **exit** = ≥1
  `DEC-NNN` recorded together. Open → the conscience reads a **bounded** slice (decisions dir · `boss board`
  · `boss team`) and judges: is work flowing through one founder's agent *around* the cofounder, or is the
  deciding just happening off-repo on a call? Fires only on a real seam; **stays silent on a quiet log**
  (the evidence is weak-transfer — over-firing would punish a healthy team that talks on calls). **Dormant
  by construction when solo** (no `"handle"` → unopenable); **fires at most once/session**; **serves the
  partnership as the unit and NEVER takes a side** (surfaces the seam, never whose fault); points at
  `/decide` + `mentor-cofounder`; mutable (`boss conscience mute coordination`). The **Red-Light** moment
  from the ai-adoption handoff was deliberately **NOT** built as a hook (it's not predicate-gateable —
  there's no artifact that says "about to automate a teammate's task"; forcing it = the over-fire failure
  mode) — it lives as a framing in `mentor-cofounder` instead. **Conscience eval gate: 120/0** (113 + 7 new
  `moment-coordination` cases — fire / dormant-solo / decided-together / too-early / no-team / empty);
  `/tmp`-verified end-to-end (fires on the seam, goes silent once a `DEC` is recorded). Zero-dep.
  **FEAT-021 slice 5 (mentor-the-team) now complete** (5a `mentor-cofounder` + 5b the moment). **Next:
  slice 6 — `boss credits` + the ownership/equity moment (reshaped by the research: refuse-to-score,
  CRediT/IBM-validated, contribution kinds, structural-trigger equity — the worst solo-test profile, build
  the evidence substrate only and get it in front of a real team).**

## 0.84.0 — 2026-06-20

- **Humane harm-taxonomy as a shippable practice + the mentor internal/shipped boundary made explicit
  (RVW-045 re-homed; `mentor-architect` verdict).** Caught while routing: RVW-045's harm-taxonomy had landed
  in BOSS's *gitignored* `mentor-humane` agent — shipping to nobody. `mentor-architect` reframed it — the
  humane lens is **cross-cutting**, so it belongs in a practice every mentor + the conscience can cite, not
  inside one agent ("the agent was the wrong container, not just the wrong location").
  - New **`library/practices/harm-taxonomy.md`** — Anthropic's 5 harm dimensions + Ada Lovelace's 4
    relationship-harms (manipulation / dependence / anthropomorphism / overreliance), the shared vocabulary
    the conscience, every mentor, and `/canvas` §3 reason against. Pairs with the dark-pattern checklist +
    `/red-team --humane`.
  - **`docs/MENTORS.md`** gains an **internal-vs-shipped boundary table** on the real axis ("artifact a
    founder's *project* consumes" vs. "tooling for authoring BOSS itself") — the thing that would have caught
    the misroute. Clarifies: the humane *lens* ships from Quickstart; the standalone `mentor-humane` *agent*
    stays Scale (ethics wants a hook / cross-cutting shape, not an opt-in door).
  - Captured, not built: **IDEA-038** (`library/` as the canonical managed-artifact shelf; templates become
    thin manifests — deferred, to be *pulled* by the learning loop, not pushed by a routing bug) +
    **IDEA-039** (humane lens as conscience-moments + practice vs. a standalone agent — decided by a future
    humane-moment eval set, `tester` territory) + an architecture decision record. Practice + doc only;
    zero CLI / dependency change.

## 0.83.0 — 2026-06-20

- **`/decide` gains a cheap falsifier + AI-decision provenance (founder layer slice 1 iteration; IDEA-037 /
  FEAT-021, from the research realignment).** The single highest-leverage change the founding-teams research
  surfaced: a decision log that only assigns blame **fails — verification cost is the bottleneck**, not
  accountability. So `DEC-NNN` now carries:
  - **A `## Falsifier` field — *"what would prove this wrong, and by when?"*** (*"if signups don't move by
    July, X was wrong"*), mirrored into an optional `revisit_by:` date. **Required for `costly`/`one-way`
    calls, encouraged for reversible** — it makes finding out you were wrong *cheap and scheduled*.
  - **`decided_by:`** — `founder` / `ai-suggested-ratified` / `ai-autonomous`, so over-delegation of
    load-bearing calls to the model is *visible* (where automation bias enters).
  - **Reversibility-scaled ceremony** — reversible = a line + the **consent** question (*"is it safe enough
    to try?"*, which gives a non-technical cofounder honest language to agree without fully evaluating a
    technical call); `costly`/`one-way` = require the falsifier + weigh the alternatives.
  - **A mild skeptic prompt at irreversible *AI-suggested* decisions** (*"what's the one thing you'd check
    before you can't undo it?"*) — **a prompt, never a gate** (forced verification *backfires*; disposition
    beats process). BOSS's own `DEC-001` updated to dogfood the new format.
  Evidence: automation-bias review + "Bias in the Loop" (accountability-alone insufficient; forced
  verification backfires; skepticism beats every design factor), "Don't Vibe" (over-delegation seam),
  sociocratic consent. Skill-layer only, zero-dep; eval gate **113/0**; `/tmp`-verified. **Also triaged the
  research:** FEAT-021 sharpened across all slices; build-process/scaling work **spun out to FEAT-023**
  (`git-workflow` + scalable-architecture + the V1→Scale rung — not team-specific). **Next: slice 5b (the
  teams-conscience family — Red-Light + watch-the-seam + moral-crumple-zone, gate-evalled).**

## 0.82.0 — 2026-06-20

- **The humane lens, operationalized — dark-pattern checklist + `/red-team --humane` + a harm taxonomy
  (RVW-031 + RVW-045, via `/vet` → `/boss-learn`).** Third routed bundle from the research session, turning
  the humane lens from a vibe into named, checkable artifacts:
  - **`library/practices/ai-ux-patterns.md`** gains a **dark-patterns** section — CDT's *Dark Patterns in AI
    Chatbots* (2026, CC-BY) 37 patterns in 5 families (data/memory exploitation · misleading design ·
    autonomy-for-engagement · false social/emotional connection · coercive monetization), framed as
    *recognize-as-you-build*, plus CDT's **constructive "humane alternative"** (default conversations to
    end, opt-in social layer, genuine delete controls, no emotional language near a purchase). Key insight:
    these can **emerge from the model** (sycophancy), not just be designed — so test the *built* product.
  - **`/red-team` gains a `--humane` dimension** — probes the founder's *own* AI product for the dark-pattern
    families, weighted toward emergent ones (sycophancy, engagement-prolonging, emotional-manipulation-near-
    money, misrepresentation). Binary pass/fail; **suggestive, never blocking** (conscience-not-censor).
  - *(BOSS-internal, not shipped)* BOSS's own self-hosted `mentor-humane` also gained a **harm taxonomy** —
    Anthropic's 5 harm dimensions + Ada Lovelace's 4 relationship-harms (manipulation / dependence /
    anthropomorphism / overreliance), reflexively disciplining BOSS's own voice. RVW-045 had no founder
    template to route into (mentor-humane is BOSS-only), so this is dogfood, not a shipped capability.
  - Held the conscience-not-censor line throughout (names the cost + the humane alternative; never makes a
    choice unavailable). Practice + skill + agent text only; zero CLI/dependency change.

## 0.81.0 — 2026-06-20

- **`mentor-cofounder` — mentor the TEAM (founder layer slice 5a; IDEA-037 / FEAT-021).** Built on the
  founders' Pain B (*"different founding skill sets — an engineer who's a first-time CTO, or a non-tech
  person who doesn't know how to work with an engineer cofounder on building together"*). Every other
  mentor coaches *a* founder; this new L1 mentor coaches the **relationship between founders** — the
  differentiated "mentor the team" value. It helps a team **divide work across skill sets** (record
  who-owns-what as a `DEC`), **bridge the skill gap both directions**, **surface the hard conversations**
  (roles/pace/equity — the talks that kill teams by never happening), and **name decision rights** (one
  DRI; equal equity fine, 50-50 control-deadlock the trap). **Folds in the inherited AI-adoption-culture
  knowledge** (from the v0.80.0 practice, the handoff source): the **Human Agency Scale / Red-Light** zone
  (don't automate a teammate's task they don't want automated), **psychological safety paired with high
  standards** (Edmondson / RVW-035 — not niceness), killing the **secret-cyborg** dynamic (reward honest AI
  use, shared via `/practice`), and the **no-workslop norm** (*"would I be proud to hand this to my
  cofounder?"*). **Wires the AI consent + norms conversation into the `boss team` flow** — a one-time nudge
  on the solo→team transition + a standing pointer in the team view. **The bright line is built in:** it
  serves the **partnership-as-the-unit** and **NEVER takes a side** between cofounders (facilitate, name the
  tradeoff, they decide; the only override is harm, not preference; not a lawyer or cap table). **Dormant
  when solo.** Registered in the L1 manifest + `docs/MENTORS.md` (arrives at MVP). Zero-dep; eval gate
  **113/0**; `/tmp`-verified. **Next: slice 5b — the conscience Red-Light *moment* (new hook detector +
  eval cases through the gate; the deliberate, careful piece) · then slice 6 (`boss credits` + the
  ownership moment).**

## 0.80.0 — 2026-06-20

- **New practice: `ai-adoption-culture.md` — bring AI to a team without breeding resentment (RVW-038,
  via `/vet` → `/boss-learn`; feeds IDEA-037).** The second routed bundle from the research-feeds session,
  and the most net-new: how a small founding team adopts AI so people **opt in** rather than comply.
  Distilled from Stanford's **Human Agency Scale** (automate what's *wanted*; name the "Red Light"
  capable-but-unwanted zone), **Edmondson** psychological safety (make it safe to admit "I don't know AI";
  pair safety with high standards), Mollick's **"secret cyborgs"** (reward honest AI use, don't punish it
  into hiding), and the **"workslop"** finding (sloppy AI output erodes trust *between cofounders* — own
  your draft before you forward it). Ships a concrete **cofounder AI consent + norms conversation** and
  stays JIT — dormant solo, surfaces when a second person joins, **never a mandate** (the conscience names
  the Red-Light tension, never picks the answer). **Authored as a reviewable starting draft for the
  IDEA-037 founding-teams build** — the handoff names the recommended wiring (a conscience Red-Light
  moment, the consent conversation in `boss team`, mentor-the-team citing it) and leaves the hook/gate
  changes to that build. Library practice, zero-dep (not scaffolded); folds in RVW-035 (Edmondson) when
  slice 5 lands.

## 0.79.0 — 2026-06-20

- **Agent-security hardened for the 2026 agent-native surface (RVW-032/042/044/054, via `/vet` →
  `/boss-learn`).** The first routed bundle from a research-feeds mining session (new
  `docs/research/SOURCES.md` — a ~40-org institutional roster — plus a 25-verdict `/vet` sweep,
  RVW-031…055). `library/practices/agent-security.md` + the L1 `/red-team` skill grow beyond the
  stateless lethal-trifecta / LLM-Top-10 baseline to cover what a founder shipping an *agent* actually
  faces:
  - **Agent-native threat model** — the **OWASP Agentic ASI Top 10 (Dec 2025)** (goal hijack, tool
    misuse, agentic supply chain, memory/context poisoning, identity/privilege abuse, rogue agents…)
    added to `/red-team` for any target with tools + memory + autonomy; the stateless LLM Top 10 still
    covers a plain prompt-in/text-out path. Plus **agentic misalignment** named as a *measured* failure
    mode (Anthropic) — bound autonomy + sensitive access; don't assume good behaviour.
  - **Containment defaults** beneath the Rule of Two (Anthropic "how we contain Claude" + Redwood
    control): **match isolation to oversight** — read-only / read-write-no-delete mount tiers, **egress
    allowlists**, inspect-tool-returns-before-context, and **gate the irreversible** behind a human or a
    cheaper trusted check.
  - **The shipped app is its own surface** — AI defaults to insecure code (Veracode: ~45% of
    AI-generated code ships an OWASP-Top-10 vuln) and the classic vibe-coded leak is **client-side key
    exposure** (the Tea breach; ~25k secrets found across vibe-coded sites). A new **pre-ship
    app-security pass** in `/red-team` (no secrets/keys in the bundle + OWASP web basics),
    **non-negotiable for `first-product` / `vibe-coder-newbie`**. Names the honest gap: **`secrets-guard`
    does NOT cover this** — it stops the *agent* reading secrets into context; it does nothing about a
    *shipped app* exposing a key.
  - Held the JIT line (Principle #2): surfaces one trigger at a time — trifecta on first untrusted read,
    the ASI list on first agent ship, the pre-ship scan on first deploy, the full battery for regulated
    cohorts. Practice-doc + skill-text only (zero CLI / dependency change); provenance carries the RVW
    trail.

## 0.78.0 — 2026-06-20

- **`/practice` + `PRAC-NNN` — the shared craft commons (founder layer slice 4; IDEA-037 / FEAT-021).**
  The most *differentiated* slice, built on the founders' Pain C: *"either of us could be discovering best
  new ways to use agentic AI — it changes so fast — and we want to keep sharing + staying current, using
  best practices, so we can focus on building, with mentorship so we're not worrying whether we're outdated
  or expensive."* New L1 skill `/practice` captures a **craft learning** (a better/cheaper/newer way to
  build with AI) as a shared, attributed `docs/practices/PRAC-NNN-<slug>.md` (What we learned / Why it
  works / How to apply), stamped with **who learned it** (`@github-username`) so a teammate gets it *and*
  knows who to ask. **Shared by construction** (commits with the repo per the slice-3a cut — push backs it
  up, a cofounder who clones has it). **Staleness-aware — the part that keeps you *current*, not just
  documented:** a practice tied to a specific model/price/tool can carry `review_by:`, and when it passes,
  `/revalidate` asks *"still the best way? anything changed?"* → keep / update / retire — the team's quiet
  defense against being outdated or overspending, the model-recalibration discipline ([[IDEA-014]])
  team-scoped. **Held the humane line:** attribution is recognition + a pointer, **never a scoreboard**
  ("measures what the team knows, never who contributed more"). New `PRAC-NNN` ID type (`docs/IDS.md`);
  registered in the L1 manifest. Zero-dep, skill-layer only; eval gate **113/0**; `/tmp`-verified (ships,
  `boss map` lists it, `PRAC-001` parses with attribution). **Next (FEAT-021): slice 5 mentor-the-team ·
  slice 6 `boss credits` + the ownership moment.**

## 0.77.0 — 2026-06-20

- **The founder-layer state cut — back up + share, keep the conscience private (slice 3a; IDEA-037 /
  FEAT-021 / DEC-001).** Occasioned by Ajesh's insight that BOSS taught us the *released-app vs.
  dev-codebase* split: BOSS gitignores its *own* docs (don't ship private strategy in a public OSS package),
  but a **venture's `docs/` already commit** — so a scaffolded team's ideas, canvas, `DEC-NNN` decisions,
  research, RESUME, and the venture brain's `read.md` are **already backed up (push = backup) and shared
  (a cofounder who clones is in the loop)**. This release names that win and **plugs the one leak**: the
  template now gitignores the **per-person** conscience state — `.boss/brain/relationship.md` (what the
  conscience said to *you* and what you did with it) + `.boss/trace.jsonl` — so one founder's private nudge
  history never travels to the other (Contextual Integrity). The backup/share framing is surfaced in
  `/welcome` (first-run) and the L0 `AGENTS.md` conventions. **The decision is recorded as BOSS's own first
  `/decide`** — [`DEC-001`](../docs/decisions/DEC-001-founder-layer-brain-cut.md): *venture brain `read.md`
  SHARED (the hive-mind read, also seeds a joining cofounder's brain for free), conscience `relationship.md`
  PER-PERSON* — drafted with the research- + 3-mentor-backed recommendation, **Ajesh to confirm or supersede**.
  Reversible at a cost (the leak fix *prevents* the irreversible accident; sharing `read.md` confirms the
  status quo). Deferred: per-founder namespacing (`.boss/founders/<handle>/`) — the structural fix, needs
  `brain.js` path changes. Template-only + docs; `/tmp`-verified (per-person ignored, shared/backup commit).
  **Next (FEAT-021): slice 4 — shared craft commons (Pain C, the most differentiated) · slice 5
  mentor-the-team · slice 6 `boss credits` + the ownership moment.**

## 0.76.0 — 2026-06-20

- **`boss board` owner lens — `owner:`-as-person + `--mine` (founder layer slice 2b; IDEA-037 / FEAT-021).**
  The board (already a pure projection of frontmatter) now reads `owner:` and, **when the venture is a
  team**, shows the founder who owns each card (`@handle`) — provenance of *who's the DRI*, surfaced as a
  quiet suffix. `boss board --mine` narrows to the cards you own ("what am I on the hook for"); the JSON
  projection (`--json`) carries `owner` per card for agent-readability. **Dormant-solo:** a solo founder
  sees no owners and nothing changes — the lens only lights up once `boss team` has a cofounder. **Held the
  humane line:** only a `@handle` counts (role owners like `pm` are ignored), and owners are shown as
  per-card provenance, **never aggregated into a per-person count/leaderboard** (the credit-score line
  mentor-humane drew). Quote-tolerant (`owner: "@handle"` — a leading `@` is reserved in YAML). Pure
  projection preserved (no new state); zero-dep; eval gate **113/0**; `/tmp`-verified (team-shown /
  solo-hidden / `--mine` filter / JSON field). *Deferred:* owner in the HTML board + `--next`/`--blocked`
  views. **Next (FEAT-021): slice 3 — keep-in-the-loop + the shared/personal state cut** (the one
  costly-to-reverse decision; to be recorded as BOSS's own `DEC` once the cut is chosen).

## 0.75.0 — 2026-06-20

- **`boss team` — the team-aware foundation (founder layer slice 2; IDEA-037 / FEAT-021).** Makes BOSS
  *know* whether a venture is solo or a founding team, keyed on **GitHub identity** (`@username` via
  `gh api user` → `git config`, never fabricated — the principal id the whole team layer builds on).
  `boss team` shows the venture's people; `boss team add @handle "Name"` / `remove @handle` manage the
  roster (stored in `.boss/config.json`). **Dormant-solo by design** (the mentor-pass guardrail that
  clears the solo test): with no cofounder declared, a solo founder sees nothing new and *nothing
  changes* — the team layer only lights up when someone joins, so it's inert, never overhead. Guards
  against adding yourself (you're already "you"). `/welcome` now asks the light, optional "solo or with
  someone?" question at first run (flippable anytime); L0 `CLAUDE.md`/`AGENTS.md` wayfinding refreshed for
  `/decide` + `DEC-NNN` + `boss team` (no drift). `src/team.js`, zero-dep; conscience eval gate **113/0**;
  `/tmp`-verified (solo→add→team→remove + self-add rejection). **Where the roster lives is deliberately
  LOCAL for now** — whether it should travel via git (so a cofounder sees it) is the shared-vs-personal
  **state cut**, slice 3, which will be recorded as BOSS's own `DEC` (dogfooding `/decide`). **Next
  (FEAT-021):** slice 2b `owner:`-as-person + board-by-owner · slice 3 keep-in-the-loop + the state cut.

## 0.74.0 — 2026-06-20

- **`/decide` + `DEC-NNN` — the decision log (founder layer, slice 1; IDEA-037 → FEAT-021).** First build
  of "BOSS for founding teams," green-lit on **real-founder demand** (past-pain stories from founder
  conversations — the first field signal against the canvas's n=0 demand risk, Risk #6 antidote). New L0
  skill `/decide` records a **load-bearing or hard-to-reverse** choice as a durable ADR-lite record in
  `docs/decisions/DEC-NNN-<slug>.md`: Context / Decision / **Why** / Consequences, stamped with the
  **decider** (`@github-username`, resolved from `gh api user` → `git config user.name`, never fabricated)
  and a **`reversibility:`** flag (`reversible | costly | one-way`, Bezos two-way/one-way doors).
  **Supersede-don't-edit** — a changed mind writes a new `DEC` with `supersedes:` and flips the old to
  `status: superseded`, so the chain *is* the story of how thinking evolved. The rationale future-you (and
  a cofounder who wasn't in the room) can read instead of guessing — and in a team, the artifact both can
  point at instead of misremembering. New `DEC-NNN` ID type in `docs/IDS.md`; registered in the L0
  manifest (decisions happen from day one). **Bright lines held** (mentor-vetted, IDEA-037): records a
  decision, never gates one; never a cap table or legal advice (points at a real attorney for
  equity/vesting); the conscience may surface a tension but **never picks a side between cofounders**.
  Zero-dep, skill-layer only (no `src/` change). **Slice 1 of a 6-slice program** (team-aware foundation →
  keep-in-the-loop → shared craft commons → mentor-the-team → credit + the ownership moment) — each later
  slice records *into* this one. See [`FEAT-021`](../docs/ideas/FEAT-021-founder-layer-decision-log.md).

## 0.73.0 — 2026-06-20

- **`mentor-business` (V1) gains the on-ramp + tier-design layers — the founder's pricing menu, completed
  (RVW-030, ADAPT).** RVW-023 (v0.66) gave the V1 business mentor its *metering-basis* axis (per-seat →
  usage → hybrid → outcome). This adds the two questions that axis left open, sourced from a `/deep-research`
  pass (27 sources, 22/25 claims adversarially confirmed; `docs/research/pricing-and-tiers-playbook-2026.md`):
  - **The on-ramp** — freemium / free-trial / reverse-trial / no-free-tier, chosen by *available traffic*
    and *per-user cost*, with the AI catch made explicit (every free interaction burns real compute, so
    freemium needs cheap/hard-capped free or a reverse trial instead of a crippled tier).
  - **The tiers** — the ~3-tiers-plus-enterprise default, gating each tier on the axis matching the value
    metric and *only where a tier's absence blocks a segment's core job*, free→paid line at a real aha.
  - Carries three cautionary cases (Cursor's credit-repricing apology, "customers don't think in tokens,"
    vague outcome-units backlash) and an explicit **numbers-are-contested** rule: coach the ordering and
    trade-offs, never quote a precise conversion rate as fact.
  - **Template only**, not BOSS's own `mentor-business` instance — BOSS has zero paying users, so its own
    agent stays deliberately lean (Principle #2). Inherits the agent's existing defer-discipline and
    "voice the tension, never filter the menu" humane rule. Connected projects pull it via `/boss-sync`.

## 0.72.0 — 2026-06-20

- **Per-moment mute + first-run consent — "don't voice it if I don't want it," at the granularity of
  the moment (v0.71.0 conscience-voicing follow-on).** Pause (v0.23) silenced the *whole* conscience for
  a bounded session; this adds the surgical half the founder can't get from pause:
  - **`boss conscience mute <moment> [--for 7d | --until-resume] [--reason]`** + **`unmute <moment>`
    / `--all`** — turn down ONE moment (drift, caution, capture, focus…) while the rest keep speaking.
    Hook-enforced (the conscience filters muted signals after detection, then exits silent if nothing's
    left — same shape as pause). **Auto-unmutes on expiry**, the per-moment twin of pause's silent
    auto-resume. Stored under a separate `conscienceMutes` key in `.boss/config.json` so pause/resume
    (which overwrite `cfg.conscience`) can never clobber a mute — the two controls are orthogonal by
    construction. Moment names validate against the project's actual loops (typo → the available list).
  - **`boss conscience status` now surfaces live mutes** (like it surfaces an active pause), so a
    forgotten mute can't silently swallow a moment forever; the over-fire-smell hint in
    `boss conscience activity` now points at mute as the surgical alternative to pause.
  - **First-run consent moment** — `/welcome` now introduces the moments as a set and names all three
    controls (pause / mute / override) *before* any fires, cohort-aware (full tour gets the three-control
    walk; the 30-second version gets pause + mute in one breath). The founder meets the conscience and
    learns they can dial each moment, rather than discovering the controls only after being nudged.
  - This operationalizes the `conscience-voicing` practice's consent boundary: all current hook moments
    are *self-regarding* (about the founder's own venture discipline), so a flat per-moment mute is the
    correct, fully-honored control. Zero-dep; single source (the L0 hook + runtime feed both the hook and
    the `boss conscience` CLI).

## 0.71.0 — 2026-06-20

- **Conscience voicing — name the tension, never filter the menu.** Closes a paternalism seam found
  while auditing what BOSS recommends to founders: the conscience is *suggestive*, but in a few places
  it had drifted toward *withholding*. Three moves, one principle (a conscience makes a cost **visible**;
  a censor makes a choice **unavailable**):
  - **`mentor-business` (V1 template) gained a second axis.** The model menu was structure/licensing
    only (OSS, open-core, patronage, cohort, SaaS…); it now also names the **metering basis** the AI era
    runs on — per-seat → usage → hybrid → outcome → service-as-software → agent-to-agent — each with its
    humane tension as an *overridable note*. Founders see the full menu including the models BOSS is wary
    of; omitting them "to protect" is itself a dignity cost. New rule: **voice the tension once, then
    yield.** (Re-opens **RVW-023** NOT-YET → **ADAPT**: per-seat assumptions are now demonstrably stale —
    Intercom/Zendesk/SAP/Adobe live — and the verdict had conflated *should BOSS adopt this for itself*
    (still NOT-YET) with *should BOSS tell founders it exists* (yes).)
  - **`mentor-humane` override authority clarified — over other mentors, never over the founder.** The
    "lens is non-negotiable" language was the one place the conscience read like a censor. Reframed: the
    lens makes a harm *un-ignorable*, not a choice *unavailable*. Encodes the consent boundary —
    **self-regarding** tension (the founder's own venture) is fully muteable; **third-party harm**
    (someone not in the room) is named once even if unwelcome, because the harmed party never consented
    to being silenced. Always *name*; never *override*.
  - **New library practice `conscience-voicing.md`** (UP via `/boss-learn`) — the inheritable spine:
    the conscience-vs-censor line, the 7-habit craft of voicing concern without blocking, the
    consent-boundary table, where it applies (hook moments, every mentor, `/vet`, any menu), and the
    existing machinery (`conscience pause`, `relationship.md`) to build on rather than reinvent.

## 0.70.0 — 2026-06-20

- **Wayfinding-drift check — the de-rot pass becomes a standing guard (IDEA-035, built).** v0.68 was a
  *manual* catch-up after the hand-authored prose lagged 20 releases of new capability. The generated
  surfaces (`boss map`, `CHEATSHEET.md`, `SKILLS.md`) can't rot — they're rebuilt from `src/modes.js`;
  the curated prose can, and nothing flagged it. New dev-only `scripts/check-wayfinding-drift.js`
  (`npm run check:wayfinding`, and a courtesy nudge at the end of `gen:docs`) greps `GUIDE.md` — the one
  prose doc *meant* to walk the whole ladder — against the manifest skill lists and warns on any skill
  named in **no** rung. **The trap, designed around:** README/`/welcome` deliberately don't enumerate
  skills (they point at `boss map`), so the check guards *only* `GUIDE.md`, never blanket coverage —
  and it **nudges, never blocks** (exit 0 always; a drift check that fails a commit is the ceremony BOSS
  refuses). Internal/meta skills carry a *printed* exempt list (`boss-learn`, `design-tokens-init`,
  `extract`, `drift-deep`), never silent. Cleared the drift it found on first run: `GUIDE.md` now names
  `/import` + `/cost-review` in their rungs and `/boss-sync` + `/feedback` as standing utilities.
  Dev-only (not shipped in the package); the founder-facing `boss sync` generalization stays a NOT-YET
  UP candidate (PRINCIPLE #2). Zero-dep.

## 0.69.0 — 2026-06-20

- **`shipped_on:` — a true date-windowed Shipped archive (IDEA-034 follow-on).** The board's Shipped
  column was bounded only by a recent-*count* cap (v0.66). This adds the *date* half the founder asked
  for: stamp `shipped_on: <date>` when a FEAT ships (in `/spec`'s lifecycle note, alongside
  `building_since:`), and `boss board` folds any ship older than ~30 days into the "+N shipped earlier"
  `<details>` — so the column shows what landed *lately*, not every ship forever. **Frontmatter-true,
  never guessed:** no `shipped_on:` → graceful fallback to the count cap (legacy ships still bounded).
  Shipped now sorts newest-first by ship date (dated ahead of undated, then id). `--all` still reveals
  everything; `--json` carries `archived` + `shippedAgeDays`. Zero-dep; verified in `/tmp` (a 30+-day
  ship archives, recent ones show, undated legacy falls back to the cap; HTML folds the same).

## 0.68.0 — 2026-06-20

- **De-rot pass — the hand-authored wayfinding caught up to 20 releases of new capability (IDEA-018).**
  The generated surfaces (`boss map`, `CHEATSHEET.md`, `SKILLS.md`) stayed current automatically; the
  *prose* a founder actually reads had drifted — the recurrence of the exact "19-release README drift"
  IDEA-018 was built to catch. Surgical, scope-correct fixes (each surface names what fits *its* level,
  and still points at `boss map` for the live list — no re-enumerating):
  - **README** — the install flow now shows `/prototype` ("hit go") and, crucially, **`boss adopt`** for
    an already-started repo (a stranger would otherwise read BOSS as greenfield-only — the exact gap
    IDEA-005 closed). `--ai` mentioned.
  - **`/welcome`** (the first-run orientation) — `/prototype` is now offered as a third path ("if you'd
    rather *see* the idea than describe it"), and `/persona` is in the skill list.
  - **L0 `CLAUDE.md`** — `/comprehend` added to the skills line.
  - **`docs/GUIDE.md`** — the rung-by-rung walk now includes `/prototype` + `/persona` (Quickstart),
    `/revalidate` + `/judge-traces` + `/red-team` + `/consult` (MVP), and a new "you already started —
    there's a repo" entry for `boss adopt`.
  No code change; eval 113/0. The lesson re-learned: generated wayfinding is drift-proof; curated prose
  needs a deliberate de-rot pass after a big build run — this was it.

## 0.67.0 — 2026-06-20

- **The `/vet` sweep's six ADAPTs, routed via `/boss-learn` (RVW-015→026).** A 12-claim skeptical sweep
  of the research inbox (2 REJECT · 4 NOT-YET · 6 ADAPT · 0 ADOPT — a good skeptic's spread) produced six
  scoped adaptations, now landed. The headline two sharpen what just shipped:
  - **Outcome ledger (RVW-021) — the humane alternative to a notification cap.** `boss conscience
    activity` now reads `.boss/brain/relationship.md` and reports an **acted-on rate** ("75% of nudges
    landed or were engaged · N landed · N overrode · N ignored"). A persistently-low acted-on rate is the
    *real* over-fire smell — better than a raw count, and it **never muzzles a load-bearing warning** the
    way an arbitrary daily cap would (BOSS's fires are predicate-earned, not engagement push). **Completes
    IDEA-013's deferred self-throttle by outcome, not by fiat.**
  - **Brain staleness is a write-side job (RVW-026).** `/close`'s brain-write step now re-checks the
    standing summary *before* appending and **revises/retires stale claims** — "the brain evolves, it
    doesn't just accrete; the most dangerous brain cites yesterday's truth with today's confidence."
    Hardens the v0.65 venture brain.
  - Four lighter skill sharpenings: **`/prototype`** gains the build-to-learn / build-to-earn frame
    (Cagan; RVW-016); **`/canvas`** gains a scoped humane *build-or-buy?* cell for tool-shaped ideas
    (Fried; RVW-018); **`/spec`** gains a delegation line — *what will you verify + what's out of the
    agent's authority* (Mollick's checklist kernel, minus the "know what good looks like" platitude;
    RVW-020); **`/evals`** gains an AISI-Inspect pointer for trajectory eval (RVW-025; the principle was
    already there). The 2 REJECTs (AI-runs-your-interviews → fails #6; single-strong-agent → confirms
    IDEA-028) and 4 NOT-YETs (constrained-decoding, MCP-publishing, OTel-GenAI, outcome-pricing) are
    recorded with re-open conditions. eval **113/0** + GRADED 24 (the conscience change is to the
    *activity readout*, not the hook firing). Research hygiene: inbox cleared to a clean drop-zone, 12
    new verdicts written, sources archived to `reviewed/`.

## 0.66.0 — 2026-06-20

- **Board intelligence — the board stops being a mirror and becomes something you (and the agent)
  steer by (IDEA-034).** The board was already ahead of most "AI board" advice — it's a *pure
  projection* of `status:` frontmatter, never a maintained doc (IDEA-015). So this pass doesn't add
  richer kanban (drag-drop, swimlanes, story points, a `board.json` are all **refused** — each
  reintroduces a second source of truth or premature ceremony); it makes the projection answer harder
  questions and feed the conscience. Four tracks:
  - **A — Agent-readable board.** `boss board --next` (an ordered "what to pick up," finish-before-you-
    start), `--blocked` (everything not moving — blocked + aging + review-due, in one place), and
    `--json` (the machine-readable projection — the actual agent-readability contract; the agent reads
    the board as task-queue instead of re-deriving state). CLI-level, every mode; a lighter cousin of
    the V1 `/board` skill.
  - **B — Time-in-build aging + a bounded Shipped column.** A FEAT that's sat in Building past ~3 weeks
    now flags `⌛ Nw in build` (the zombie-feature smell `/revalidate` targets) — **frontmatter-true,
    never guessed**: `/spec` stamps `building_since:` when it sets `status: building`; no date → no
    flag. Building sorts longest-running-first (finish what's been open longest). The otherwise-unbounded
    Shipped column caps to the most recent few (`--all` / a `<details>` expander to see the rest).
  - **C — Honest flow in `boss insights`.** Idea→build cycle time (median, from recorded `created:`
    dates only — omitted, never guessed, when absent). Loop-closure cycle time, **never throughput /
    velocity** (the vanity metric BOSS refuses to expose).
  - **D — Board → conscience `focus` moment.** ≥4 FEATs in Building with nothing Shipped opens a new
    `focus-loop` (L1-mvp): the "stop starting, start finishing" smell. Judge-style (the model reads the
    board and distinguishes scattered abandonment from honest parallel work before voicing), at most
    once per session, **never a gate** — and it auto-silences the moment anything ships (exit = ≥1
    shipped). Conservative threshold + auto-silence are the over-fire guards.
  - **E — Lightweight priority.** Optional `priority: high` in FEAT/IDEA frontmatter floats a card to
    the top of its column (a `⬆` marker) and leads `--next` — **one level, frontmatter-true, never a
    drag-to-reorder.** Deliberately no P0/P1/P2 ladder (that turns the board into a planning surface you
    tend instead of ship); the caveat — *re-prioritizing isn't progress; finishing is* — ships in
    `/spec`. Priority is the one explicit ordering signal layered over the default finish-first sort.
  - **HTML kanban — a real visual refresh, then a sharpening pass** (the founder asked if it could
    "feel more legit," then for stronger hierarchy): owned accent + signature dot + uppercase kicker,
    count pills, card depth/hover, **bold titles with a quiet monospace id**, **tinted backgrounds so
    aging/blocked/review cards pull the eye first**, a priority pill, the Shipped `<details>` fold —
    calm and crafted, still zero-dep / single-file / light-dark (not a startup-bro dashboard).
  - **Discipline held:** zero-dep; the model owns judgment, the CLI owns the projection. Conscience gate
    **113/0** (105 + 8 new `moment-focus` cases) and the 24 GRADED judgment evals stay green; verified
    end-to-end in `/tmp`.

## 0.65.0 — 2026-06-20

- **`relationship.md` — the venture brain's missing half: the conscience learns whether its nudges
  land (IDEA-022 / FEAT-022).** The architecture designed two model-owned files — `read.md` (the POV,
  shipped) **and** `relationship.md` (what the conscience *said* and what the founder *did* with it).
  Only the read existed; this builds the relationship log, which closes the loop the frequency ledger
  (IDEA-013) only *counts*: did the nudge **land**?
  - **`/close` writes it** — *only when the conscience actually fired this session* — a dated entry:
    what was flagged + what the founder did, tagged honestly (*landed* / *ignored* / *overrode, with the
    reason* / *pushed back and was right* — the last being the most valuable: it's how the conscience
    learns to fire better). The must-nots carry over: it logs the conscience's *own* hit rate, never
    scores the founder.
  - **The conscience reads it back to calibrate (the payoff).** When a moment fires, the hook hands the
    model a **bounded** slice of the recent log (last ~1-2 sessions) so it *adjusts instead of repeats*:
    if it's raised a point and the founder moved past it for a stated reason, it says it lighter or stays
    silent; if a past nudge landed, it builds on it. This is what makes the conscience feel like it
    *remembers the conversation*, not just the venture.
  - **CLI:** `boss brain --relationship` (view the log), `boss brain record --kind relationship`
    (stamp it; the index now carries `kind` to distinguish read vs relationship), `boss brain` surfaces
    a one-line pointer, and `boss brain forget --before <date>` prunes **both** files symmetrically
    (living memory across both).
  - **Cost + safety held:** read only when a moment is firing, bounded (~900 chars), **byte-identical
    when no log exists** → 105 gate + 24 GRADED judgment evals stay green (verified). Zero-dep; the
    model owns the prose, the CLI owns the index. **FEAT-022 (the venture brain) is now complete —
    read + relationship + index + living memory.**

## 0.64.0 — 2026-06-20

- **AI-native scaffolder — `--ai` + `/comprehend` (IDEA-022 Track 3; the last track, most guarded).**
  Scaffold from what BOSS *understands*, not just a fixed template copy — built exactly to the
  guardrail: **additive, behind a flag, the deterministic template stays the default.** `boss new --ai`
  / `boss adopt --ai` do the normal reversible scaffold, then set `aiNative` in `.boss/config.json` and
  point at a new model-driven **`/comprehend`** skill (L0). The CLI never calls a model (zero-dep, layer
  1) — the comprehension is the skill's job (same predicate/runner split as `/import`). `/comprehend`
  reads what BOSS can honestly understand (an adopted repo with the wide context · the captured idea +
  `docs/source/` · or nothing-yet → it says so and stops), then **non-destructively**: fills the
  `AGENTS.md` overview with a real read, **seeds the venture brain** with an honest first dated read
  (so the conscience has continuity from day one — connects Track 3 → Tracks 0/4) + stamps the index,
  and **recommends** (never auto-applies) the disciplines that fit (`/ai-first-init`, `/design-tokens-init`,
  `secrets-guard`+`/red-team`, `/persona`). **The guardrail is in the skill itself:** everything is a
  plain-text, diffable, revertable write in the working tree — *"if it can't be diffed, it doesn't
  ship"*; it never rewrites the deterministic scaffold. Verified: `--ai` sets the flag + surfaces
  `/comprehend` (and plain `boss new` is unchanged, `aiNative:false`); eval 105/0, GRADED 24.
  **IDEA-022 is now complete — all four tracks + the spine shipped.** (The fuller presence/identity
  design + the proactive presence-moment stay deliberately deferred: a new unprompted trigger is the
  over-fire risk the conscience guards against; the v0.63 voicing *is* the presence.)

## 0.63.0 — 2026-06-20

- **The conscience now voices *with* the venture brain (IDEA-022 Track 4 — "the brain, voiced").** The
  spine (Track 0) gave the brain a read; this makes the conscience **speak with it**. When a moment
  fires, the hook reads a **bounded** slice of `.boss/brain/read.md` (the standing summary + the single
  most recent dated read — continuity, not the whole history) and hands it to the model as a
  *Continuity* frame, so the nudge is **specific to what the conscience already understands** — the
  "how did it know that" that earns trust ("you've rebuilt onboarding three times and still haven't
  talked to a user") instead of a generic line. The instruction is explicit: voice *with* the read,
  don't read it back as fact, and **trust what you see now over the brain** (the founder can correct
  it). **Cost + safety held:** the brain is read **only when a moment is already firing** (past the
  silent early-exit — never every prompt), bounded to ~1400 chars, and **byte-identical output when no
  brain exists** — so the **105 gate evals + 24 GRADED judgment evals stay green** (verified; the
  judgment fixtures have no brain, so they're unaffected). The proactive "presence moment" (the
  conscience surfacing its read unprompted) is deliberately **not** built — a new always-on trigger is
  the over-fire risk the conscience itself guards against; the voicing *is* the presence. **IDEA-022:
  Tracks 0, 1, 2, 4 now shipped; Track 3 (AI-native scaffolder, flag-guarded) is the last.**

## 0.62.0 — 2026-06-20

- **`/red-team` — turn BOSS's defenses into evidence (IDEA-033 #3; the "defense → measured" Anthropic
  move).** `agent-security` is *prevention* (the deny-list floor, secrets-guard ceiling, Rule of Two);
  `/red-team` is *proof*. A new **L1 skill** that adversarially tests an AI-mediated FEAT (or BOSS's own
  conscience hook, `--self`) against the **OWASP 2025 LLM Top 10** — prompt injection (direct +
  indirect), sensitive-info disclosure, improper output handling, excessive agency, system-prompt
  leakage, vector weaknesses, misinformation, unbounded consumption, supply chain, data poisoning. Each
  category gets a **binary pass/fail + the attack that proved it**; **failures become `/evals` cases**
  (defense → test → regression-proof), pairing with `/evals` (correctness) and the agent-security
  practice (prevention). Cohort-aware (domain-expert gets the full battery + escalation route;
  first-product gets the high-value subset in plain language). Honest scope line every run: red-teaming
  lowers risk, it doesn't certify safety; the deterministic deny-list floor stays the load-bearing
  prevention. Registered in L1; `boss map` + cheatsheet updated; eval 105/0.

## 0.61.0 — 2026-06-20

- **Scouted skillsmp.com; routed two Anthropic skills through `/vet` → `/boss-learn` (dogfood).** Five
  marketplace skills reviewed against BOSS's own machinery; the on-principle move was to *vet, not
  hand-absorb*. Two earned an ADAPT, three did not. **What landed:**
  - **`library/practices/skill-authoring.md`** (new) — from Anthropic's `skill-creator` ([RVW-013](../docs/research/verdicts/RVW-013-skill-creator-authoring-discipline.md),
    ADAPT). Fills a real void: BOSS authors skills as its core motion but had *no* written authoring
    discipline. Captures the three transferable principles — explanatory-over-prescriptive (the
    IDEA-014 / Principle #2 stance applied to *how we write skills*), progressive disclosure, and
    descriptions that earn their triggers — plus a ship-time self-check. The heavy with/without
    **eval-harness is deliberately left out** (duplicates `/vet` + `conscience-evals/`); deferred to IDEA-033.
  - **`design-system.md` → "Aesthetic ambition — past the slop default"** — from Anthropic's
    `frontend-design` ([RVW-014](../docs/research/verdicts/RVW-014-frontend-design-aesthetic-ambition.md),
    ADAPT). The practice owned the *discipline* axis (tokens, the 47 blues, missing states) but was
    silent on the *taste* axis. Adds the anti-AI-slop stance, the five aesthetic dimensions, and a
    one-paragraph design-thinking pre-pass — **bounded by BOSS's restraint** (a11y + five states + perf
    are floors; minimalism is the safer default for a green founder, against the source's maximalist lean).
  - **Three rejected, recorded:** `ui-ux-pro-max` (checklist mined into IDEA-033; CLI+DB machinery
    rejected — zero-dep ethos), obra/superpowers `brainstorming` (its "every project, no exceptions"
    is the literal anti-thesis of BOSS's JIT bet; two micro-techniques harvested to IDEA-033),
    `code-reviewer` (already dominated by Claude Code's own `/code-review`).
  - IDEA-033 backlog extended (items 6–8: skill-eval harness, UI/UX pre-delivery checklist, `/spec`+`/consult`
    question-discipline audit) — each earn-it-gated, not green-lit.

## 0.60.0 — 2026-06-20

- **`docs/PATTERNS.md` — the patterns writeup (the packaging "cool" move, documented).** A public-facing,
  builder-audience doc that names the engineering patterns BOSS is built on, **framed in Anthropic's own
  2026 vocabulary with real numbers** — the highest-resonance, lowest-effort move from the Anthropic-appeal
  research (it's *packaging* what BOSS already has, not new engineering):
  - **The conscience separates the doer from the judge** (their #1 2026 motif) — a deterministic
    `UserPromptSubmit` hook (438 lines, **zero model calls of its own**) that gates, then hands the model
    a *bounded* read in a *fresh* context. Unprompted + isolated.
  - **Two eval surfaces, with numbers:** 105 deterministic gate cases / 0 failures + **24 GRADED**
    LLM-judge cases (separate pass, transcripts read).
  - **Progressive-disclosure skills:** 29 skills, **~1.7k tokens avg** (< Anthropic's 5k guidance),
    loading JIT (~100-token description until invoked).
  - Dormant-by-default hooks + frequency-not-tokens cost ledger; security lineage (deny floor →
    secrets-guard ceiling → Rule-of-Two) stated honestly; AGENTS.md portability; persona-as-both.
  - **The honest limits are not buried:** zero real founders (its own canvas's 100%-risk), the conscience
    is Claude-bound, a synthetic judge is still synthetic. (Anthropic rewards honest framing over theater.)
  Linked from the README ("building agent tooling yourself?"). Ships (tracked doc). No behavior change.

## 0.59.0 — 2026-06-20

- **Venture-brain living memory — the write/evict side (IDEA-022 Track 0; the research's #1 capability
  gap).** The brain spine (`boss brain` + `record`, model-owned `read.md` + CLI-owned `index.json`)
  had the *read* side; this adds the **write/evict** side the 2026 gaps research named as the biggest
  upgrade (Anthropic's memory tool + context editing: +39% / 84% fewer tokens) — and which `brain.js`
  itself named as next. **Living memory ≠ infinite memory:**
  - **`boss brain --diff`** — the read's *evolution* (date + headline per session, from the index):
    continuity made visible without dumping the whole prose.
  - **`boss brain forget --before <date>`** (or `--id <bN>`) — the **evict** side: drops dated reads
    older than the date from `read.md` + prunes matching index entries, **keeping the standing summary
    (preamble) + recent reads**. Founder-invoked, *never automatic* — it's an opinion about a person,
    so only the human prunes it (on-principle).
  - **Recency-window gate** (8 sessions) — `boss brain` nudges toward compression/eviction when the
    read gets long, so the always-loaded surface stays lean (the bloat the conscience itself warns
    against).
  - **`/close` pairs the model side:** when the read spans many sessions, fold the oldest reads'
    lasting conclusions into the standing summary at the top, drop the verbatim old blocks. The
    standing summary survives; dated blocks are working history that ages out.
  Additive to the parallel-session spine (no existing behavior changed); zero-dep, format-based block
  handling (CLI owns boundaries, model owns content); verified in `/tmp` (diff, evict-preserving-
  preamble, gate); eval 105/0. **IDEA-022: Tracks 1+2 + the Track-0 spine's living-memory increment now
  shipped; Track 4 (fuller voicing) + Track 3 (AI-native scaffolder) remain.**

## 0.58.0 — 2026-06-20

- **Scaffold `AGENTS.md` — host-neutral, fixes a self-contradiction (IDEA-032).** The clearest cheapest
  miss from the 2026 gaps research: BOSS scaffolded **Claude-only `CLAUDE.md`**, locking every venture
  to one host — against its own [IDEA-006](../docs/ideas/IDEA-006-conscience-host-portability.md)
  host-portability principle + Principle #5 (optionality). Fixed the way **Anthropic's own docs
  recommend** (verified via `code.claude.com/docs/en/memory`): `AGENTS.md` carries the host-neutral
  working rules + conventions (read directly by Codex/Cursor/Copilot/Devin/…); `CLAUDE.md` is a thin
  Claude-specific layer that **imports it via `@AGENTS.md`** (loads into context at launch — no
  duplication, no drift) and adds the skills/conscience/mode-ladder below. `boss new` emits both;
  **`boss adopt` handles every case non-destructively** — bare repo → both copied; existing CLAUDE.md
  → preserved + an adopt block that `@AGENTS.md`-imports the (now-present) rules; existing AGENTS.md →
  preserved + BOSS's working rules appended as a marked block. New reusable `appendMarkedBlock` helper.
  Verified all four cases in `/tmp`; eval 105/0; `npm pack` ships `AGENTS.md`. **A concrete
  down-payment on IDEA-006 + an Anthropic-appeal signal (portability is the property they evangelize).**

## 0.57.0 — 2026-06-20

- **`/consult` — convene the mentor board on a cross-cutting question (IDEA-022 Track 2).** Some
  decisions don't belong to one mentor (raise-vs-bootstrap touches fundraising + business + GTM +
  humane at once). A new **L1 skill** that orchestrates the individual `mentor-*` agents: route the
  question to **only the mentors with a stake** (read the installed board from `.boss/manifest.json` —
  it grows by mode), get each take **in its own lens** (grounded in the canvas/RESUME/FEAT, pushback
  included), then **synthesize with the disagreement kept visible** — *where seasoned advisors disagree
  is where the real decision lives; never average them into mush.* `mentor-humane` keeps its standing
  **override authority**; the synthesis ties back to the canvas's riskiest assumption and **hands the
  call back to the founder** (advisory, never a gate; record which lens you followed + why). Reads/
  writes the venture brain (`.boss/brain/`) when present (IDEA-022). Registered in L1; `boss map` +
  cheatsheet updated; eval 105/0. **IDEA-022 progress:** Track 1 (`boss adopt`, v0.56) + Track 2
  (`/consult`, v0.57) now shipped; Tracks 3-4 (AI-native scaffolder, venture-brain voicing) remain.

## 0.56.0 — 2026-06-20

- **`boss adopt` — bring BOSS into an already-started repo, non-destructively (IDEA-005; Track 1 of
  IDEA-022).** The largest realistic adoption path — most founders have a repo *before* they hear about
  BOSS — and the one people kept asking for. `boss adopt [--mode <m>]` in an existing dir: copies only
  what doesn't collide (a new `cpSafe`/`applyStageSafe` — **never `cpSync`'s clobber**), merges the
  conscience-hook registration into an existing `settings.json` *additively* (the founder's permissions
  + their own hooks preserved), appends a small marked block to an existing `CLAUDE.md` (or copies the
  template's if there is none), stamps `.boss/` as **not-self-hosted + adopted**, and registers it.
  **"Lite BOSS" is the design, not a fallback (Principle 2):** defaults to the lightest register
  (Quickstart); `--mode mvp` adopts the *full chain* (lays down Quickstart's foundation too, exactly as
  `boss new` + `boss unlock mvp` would) for a brownfield app that's already earned it. Idempotent
  (refuses re-adopt → points at `boss sync` / `boss unlock`). Once adopted it's a normal registered
  project on the usual sync loop — no special-casing. Verified end-to-end in `/tmp`: a real repo's
  `CLAUDE.md`, `settings.json` (custom permission + `Stop` hook), `README`, and `src/` all preserved;
  conscience loops + hook land so it can fire; `boss map` works; `--mode mvp` lays L0+L1. eval 105/0.
  Wired into `boss --help`. **This is also IDEA-022 Track 1** — the living conscience needs a venture
  to read, and adopt is how an existing one gets a venture brain.

## 0.55.0 — 2026-06-20

- **`/persona` — your app's target-user as a consultable agent voice (IDEA-031).** Occasioned by
  Ajesh: *"if I wanna build an app for moms to track chores, the first persona is moms… we can do a
  Q&A with the builder, online research, or a UX researcher drops their research in… the app uses it
  as an agent voice to guide product decisions"* — *"its also the QA, its both right?"* A new **L0
  skill**: **derive** the primary target-user persona from the idea → `docs/personas/<slug>.md`
  (who · context · jobs · pains · values · *what we don't know yet* · synthetic/real evidence ledger);
  **enrich** from four sources (builder Q&A · `deep-research` online · drop-in real research via
  `/import` · passive read of idea/canvas); **consult** in voice in **both directions** — *guidance*
  ("would she want X?") and *QA* (Husain-discipline structured reactions on a build, comparable across
  versions). **The discipline is the product:** every consult is framed as a *pre-filter, never
  validation* — balances interest with concerns, names its blind spots, and closes with the
  go-ask-a-real-one caveat (Fitzpatrick/Mom Test); synthetic shrinks as real grows, visibly. Reuses
  [IDEA-009](../docs/ideas/IDEA-009-proto-personas-as-evolving-instruments.md)'s evolving-instrument
  methodology pointed at the *founder's* users (vs. BOSS's internal cohort instruments). Registered in
  L0; `boss map` + cheatsheet updated; eval 105/0.
- **`/prototype` refined by its own persona-reactions pass (IDEA-009 instrument working).** Ran the 4
  BOSS-internal personas on the new features (`/prototype`, kanban, upstream conscience); the
  convergences drove real fixes: (1) the after-run nudge now leads with a **concrete plain-language
  action** and lets *"I don't know yet"* be a fine answer (beginners bounced on `/canvas` /
  "pressure-test" jargon); (2) the **5-token pass is skipped on throwaway sketches** by default
  (eng-builder caught it contradicting "tangible beats pretty"); (3) **`--stack=<x>`** is now a
  first-class option + the stack pick is narrated in plain words for beginners; (4) trimmed the
  defensive over-explanation (dropped the "not vibe coding" protest; sketch-vs-MVP named once; the
  "becomes the MVP" rule now names the *real* failure — bolting auth onto throwaway code). The
  build-integrated eval channel caught design issues before a real founder hit them — first evidence
  for IDEA-009's claim #1.

## 0.54.0 — 2026-06-20

- **Upstream conscience — `/spec` now asks "is it worth building?" not just "is it built right?"
  (IDEA-026 Part A, closes IDEA-026).** The biggest *conceptual* delta from the 2026 leader scan
  (Ng's "PM bottleneck," Appleton's "align before the agent runs"), shipped the small + safe way the
  host-subtraction audit found: **not a new always-on loop, a voice-sharpening of the existing
  `spec-loop` restraint** (which already fires, skill-invoked, when the founder reaches for `/spec`
  before the canvas closes). The restraint frame now surfaces the *substantive* gap — *who is this
  for, and what's the bet that could sink it?* — not a checklist. **Respects `/prototype`:** a
  throwaway sketch needs none of this (build-first is legitimate); the question fires only when
  committing to build *for real*. eval gate 105/0 (skill-voice change, no predicate change).
- **Positioning reframe — README opener now leads with the judgment gap (option C).** *"Everyone can
  build now. Almost no one can tell a real business from a convincing demo. BOSS is the conscience
  that keeps you honest while you move fast."* + the floor/ceiling subline (*vibe coding gets you a
  demo; the discipline on top gets you a business*). The 2026-vocabulary update to positioning
  (harness-is-the-moat / agentic-engineering-is-the-discipline), in BOSS's voice. Full draft +
  rationale in the gitignored `docs/dossier/positioning-reframe-2026.md`.

## 0.53.0 — 2026-06-20

- **`/judge-traces` — the deliberate reader for the trace substrate (IDEA-025 Phase 2).** v0.48 shipped
  `auto-log` (collects `.boss/trace.jsonl`); this is the skill that *reads* it — completing a
  shipped-but-inert capability (a substrate nothing reads has no purpose). A new **L1 skill** applying
  Hamel/Shankar's 2026 discipline to the founder's *own* sessions: read real traces → factual shape
  first (cheap, deterministic) → sort failures into a **binary** pass/fail taxonomy (`wrong-files`,
  `thrash`, `silent-scope-creep`, `no-trace-of-the-point`, or your own) → route *recurring* modes to
  `/boss-learn`. **One expert not a committee; don't grade its own homework (judge the trajectory);
  counts are the signal.** Graceful degrade: no trace → honest "nothing to judge yet, turn on
  `auto-log`," never a fabricated taxonomy. **Collection ≠ judgment** stays load-bearing: `auto-log`
  collects passively, `/judge-traces` judges deliberately — never fused into an always-on auto-grader.
  Registered in L1; `boss map` + cheatsheet updated; eval 105/0.
- **Host-subtraction audit drafted (IDEA-028) + an IDEA-026 Part A finding (workspace docs).** The
  `mentor-architect` pass concluded **retire nothing**: BOSS's conscience fires *unprompted/event-driven*,
  and native `/goal`/`/loop` are *user-invoked* — they can't replace a conscience that speaks when you
  wouldn't have asked, so the host did *not* absorb the loop runtime (the moat). Sit-on the host for
  future orchestration (dynamic Workflows) + the secrets ceiling (auto-mode hard-deny); keep the
  `permissions.deny` floor (more portable). **Bonus finding:** `spec-loop` already implements most of
  the "upstream conscience" (IDEA-026 Part A) — it fires restraint when the founder reaches for `/spec`
  without the canvas closed — so Part A is a *voice sharpening of spec-loop*, not a new `worth-building-loop`
  (which would redundantly overlap spec-loop + caution + drift). Left for Ajesh's eye on the exact
  voice (it touches conscience tone). No code retired; decision-input only.

## 0.52.0 — 2026-06-20

- **`/prototype` — drop an idea, hit go, see something tangible (IDEA-030).** Ajesh's framing settled
  the design: *"not just vibe coding, but not gatekeeping until so much thought… building first in a
  lean cycle is a place to start, not waiting until the other two are clear. People can fill in the
  missing pieces after they get the gist out of their head and see something tangible."* A new **L0
  skill** that builds the smallest runnable, clickable version of an idea — the ONE core interaction,
  in whatever stack gets to "click it" fastest, mock data freely, the 5-token distinctiveness pass so
  it doesn't look generic — then runs it. **The load-bearing call:** the conscience fires **AFTER** the
  thing runs ("there it is — does seeing it change the idea? when you're ready: `/canvas`"), **never a
  gate before** — building first *is* a legitimate first move in the loop, not a skip of it. Cohort-
  aware (first-product gets the magic moment; eng-builder gets stack control; domain-expert gets the
  "this is a sketch, not a regulated tool" guardrail up front). Honest framing held: it's a *sketch to
  think with, named once, not your MVP* — and the graduate ladder (`unlock mvp` → `/spec` → `/evals`)
  is what keeps a fast prototype from becoming a pseudo-app (PRINCIPLES). Registered in the L0
  manifest; `boss map` + cheatsheet updated; eval 105/0.

## 0.51.0 — 2026-06-20

- **Visual kanban (`boss board --html`) + a voice-tightening pass.** Two founder-experience asks.
  - **`boss board --html` — the board, as a visual kanban.** Ajesh: *"having a visual kanban state
    that can be updated when the board is is super helpful."* Promotes the HTML view IDEA-015 deferred
    behind an earn-it gate. Same **pure projection** as the terminal board (`collectBoard`) rendered to
    a self-contained `.boss/board.html` — zero deps, no server, no JS framework; four columns
    (Captured / Taking shape / Building / Shipped), cards with id + title, `↻ review due` + `blocked`
    flags, the evidence line + riskiest-assumption framing on top, light/dark, responsive. Opens in
    the default browser (best-effort; the printed path is the contract). "Updated when the board is" =
    re-run it — it's a read of the files, never a maintained doc (the IDEA-015 discipline holds). Wired
    into `boss --help` + `boss map`.
  - **Voice pass (voice-keeper full audit — verdict: "in remarkably good shape").** Applied the
    high-leverage fixes: dropped the `🎯` emoji that shipped into the founder's own canvas template;
    unified the cohort question wording so `/welcome` and `/boss` are *actually* identical (they
    claimed to be); settled the self-description on **"build tool"** (not "build companion" — the
    ethos is conscience/tool, not coach); collapsed the most-read `boss new` first-run lines to one
    bold path + demoted fallbacks (matching `/welcome`'s own discipline); collapsed the `boss insights`
    triple-stated telemetry footer; dropped an inside-baseball `/ai-cost` wink in `boss conscience
    cost`; de-"coach"-ed the README mentor line against the settled ethos; added `boss brain` +
    `boss insights` to the `boss map` standing-controls so the live cheatsheet agrees with `--help`.
    (Kept the maintainer-only `Learned … UP` vocabulary deliberately — UP/DOWN is load-bearing
    Principle-1 language and the reader there is always the maintainer.)
  - **Captured (not built): [IDEA-030 "drop an idea and hit go"](../docs/ideas/IDEA-030-drop-an-idea-hit-go.md)** —
    a fast path to a runnable prototype. Philosophically loaded (the pseudo-app trap is *why BOSS
    exists*), so captured with a concrete `/prototype` proposal + the resolution (see-it-not-sell-it,
    conscience-attached, the graduate ladder as the honesty mechanism) and four shape questions for
    Ajesh — a decision to take together before building.
  - Eval gate 105/0; judgment GRADED; HTML render + voice fixes verified end-to-end in `/tmp`.

## 0.50.0 — 2026-06-20

- **Close the trends-pass loose ends (IDEA-027 #4 + IDEA-026 Part B wiring).** Ajesh's audit prompt —
  *"did we miss anything else to implement? you did a lot of lookup."* Two genuine loose ends from the
  research, both now closed:
  - **`boss board` surfaces "review due" — the trigger half of `/revalidate`.** v0.48 shipped the
    revalidation *gate* but nothing *surfaced what to revalidate* — a half-feature. The board now reads
    each item's `next_review:` frontmatter and flags any whose date has passed (`· ↻ review due`) plus
    a footer line `↻ N past review — run /revalidate <id>`. **Frontmatter-true, never guessed:** no
    `next_review` date → not flagged (an age-inferred "stale" signal would be noise the founder learns
    to ignore). Completes the dhun-ported revalidation lifecycle; `boss board` stays a pure projection
    (no new state).
  - **Agent security wired JIT into `/ai-first-init` (Step 5.5).** v0.49 shipped `agent-security.md` as
    an UP practice, but founders don't read `library/` — so the lethal-trifecta / Rule-of-Two framing
    now surfaces *in the AI-native day-one sequence* (one sentence on a Quickstart; more ceremony as
    the app reads untrusted input / handles regulated data). Names the surface, points at the
    `permissions.deny` floor + `secrets-guard` ceiling + the deterministic-guard rule.
  - Eval gate 105/0; judgment GRADED + no blocking failures; board staleness verified end-to-end in
    `/tmp` (past-review flagged, future-review not). **Honest remaining map (deliberately staged, not
    missed):** IDEA-025 P2/P3 (`/judge-traces` + trace-fed learn loop — need accumulated traces),
    IDEA-026 Part A (upstream conscience — needs the IDEA-028 host-mount), IDEA-028 host-subtraction
    audit (a decision to take *with* Ajesh, not autonomously), AGENT_DOC_MAP (until two agents
    collide), the SDD-vocabulary + "agentic-engineering" positioning reframes (mentor-pitch territory),
    and publishing the library on the open Skills standard (IDEA-006 distribution).

## 0.49.0 — 2026-06-20

- **Embed the 2026 best-practices — design, evals, security feel current across the board (IDEA-029 +
  IDEA-026 + the trends pass).** Ajesh's follow-on to v0.48: *"on all research you surfaced (not just
  design), let's ID all critical to add to our current work, and just go and embed it… make BOSS feel
  very up to date with best practices."* Where v0.48 shipped the dhun *machinery*, this embeds the
  *thinking* into the surfaces founders actually touch. Provenance:
  [SESSION-2026-06-20-ui-design-scan](../docs/research/sessions/SESSION-2026-06-20-ui-design-scan.md).
  - **`/design-tokens-init` — the 5-token distinctiveness pass + DTCG/semantic naming (the design
    win).** Three layers already prevented *drift*; the new section prevents *sameness* — the
    "shadcn trap" (slate/Inter/8px/indigo = generic-AI-app look) broken by five deliberate overrides
    (warm neutral · intentional radius · type pairing · one owned accent · **one "signature token"**),
    cohort-aware. Plus: name semantic tokens by **purpose not hue**, emit **W3C DTCG** where the stack
    allows (portability, no lock-in), and **inline a semantic→primitive map into CLAUDE.md** so the
    agent inherits the brand on every turn. (freedesignmd · Vercel · Curtis · W3C DTCG.)
  - **`/evals` — the 2026 Hamel/Shankar sharpening.** Error analysis on **real traces** first (and a
    pointer to v0.48's `.boss/trace.jsonl` as that raw material); **binary pass/fail, not 1–5 scores**;
    **one expert, not a committee**; **don't let the model grade its own homework** (separate verifier
    + trajectory-not-just-endpoint); a **60/30/10** deterministic/judge/human cost hierarchy.
  - **New UP practice `library/practices/ai-ux-patterns.md`** — the interaction layer (where
    `design-system.md` owns the look): "why this" rationale grounded in the user's own inputs ·
    confidence-as-register · **Notify/Question/Review** interrupt registers · **edit-before-execute +
    risk-tiered gates** (four decision verbs; gate by loss type) · **trust-repair after a miss**
    (asymmetric recovery) · progressive disclosure · **discernment — knowing when not to speak — as a
    first-class fundamental** · pinned canonical refs (Shape of AI / HAX / IBM Carbon; community
    catalogs via `/vet`). Captured as [IDEA-029](../docs/ideas/IDEA-029-ai-native-interface-patterns.md),
    extends IDEA-010.
  - **`docs/mentor-practitioners.md`** AI-UX heuristics block updated with the 2026 additions +
    pointer to the new practice.
  - Library-layer + skill-content changes (no new template skill, no CLI change); eval gate 105/0,
    judgment GRADED + no blocking failures; `boss new` + `unlock mvp` verified the upgraded skills
    ship. **Staged from the design scan:** planning-as-collaboration / mid-run steering (Appleton —
    twin of IDEA-026 Part A), RESUME-as-agent-inbox, wrapper-vs-flatten-per-cohort.

## 0.48.0 — 2026-06-20

- **The 2026-trends + dhun-scan pass — first builds (IDEA-025/027/026).** Occasioned by Ajesh:
  *"with all the latest trends since we built BOSS… as well as potential new methods inside dhun, let's
  assess what BOSS can better improve upon."* Three research passes (external 2026 trends; a 2026-only
  scan of the named practitioners in `docs/mentor-practitioners.md`; a full catalog of the sibling
  **dhun** project's working-method machinery) → captured as
  [IDEA-025](../docs/ideas/IDEA-025-trace-native-conscience-and-evals.md)…028 with full provenance in
  [SESSION-2026-06-20](../docs/research/sessions/SESSION-2026-06-20-trends-and-dhun-scan.md). This
  release ships the concrete, proven, low-risk slice; the conceptual reframes (upstream conscience,
  host-subtraction) stay specced-and-staged. **Three new dormant/UP capabilities — no behavior change
  until opted in:**
  - **`auto-log` trace substrate — the keystone, shipped dormant (IDEA-025 Phase 1).** A zero-dep Node
    SubagentStop hook (`library/hooks/auto-log.js` + L1 template) that appends one honest line to
    `.boss/trace.jsonl` per writer-subagent — session, agent, files actually changed (reads
    `git status --porcelain`, so it catches *new* files too, not just tracked diffs), with last-line
    dedup and read-only-agent skip. **The within-session complement to v0.47's `boss insights`**
    (cross-project registry): both honest-trace, local-only, append-only, measure-don't-instrument
    (inherits the IDEA-021/013 contract). It's the raw material a future trace-native judge
    (`/judge-traces`) + sleep-time learn loop read — Hamel ("error analysis on real traces") + Chase
    ("traces, not code, are the source of truth"). **Dormant** (a SubagentStop hook costs per-subagent
    latency — registration is the opt-in, same as `secrets-guard`).
  - **`memory-cue` hook — feedback→memory nudge, shipped dormant (IDEA-027 #1).** Ported UP from the
    dhun dogfood, Node-ported for the zero-dep rule (`library/hooks/memory-cue.js` + L0 template). A
    UserPromptSubmit hook that regex-detects a feedback signal (directive / corrective / confirmation)
    and *nudges* the model to save it to memory — never auto-writes (wording needs reasoning), silent
    on no-match (zero token cost). Serves the `library/memory-seed/` ambition.
  - **`/revalidate` — the 3-line gate against zombie features (IDEA-027 #2).** A new L1 skill (+
    `library/practices/revalidation.md`) ported UP from dhun's REVALIDATION lifecycle: before paused
    work re-enters the build, answer *still relevant? still aligned? anything changed?* → revive /
    rescope / kill / re-pause. BOSS eats it first — `docs/RESUME.md` carries a long deferred list.
  - **Two new UP practices** distilled from the same scan: `library/practices/quality-ratchet.md`
    (dhun's `.ratchet` one-way-baseline pattern, stack-neutral) and `library/practices/agent-security.md`
    (Simon Willison's 2026 lethal-trifecta / "Agents Rule of Two" / "deterministic guard around a
    non-deterministic model" — IDEA-026 Part B, the next ring after `secrets-guard`).
  - Zero-dep held (Node built-ins only; `npm pack` verified — all new files ship). Hooks dormant
    (settings.json unchanged; only `conscience.js` registered). `boss map` shows `/revalidate`;
    eval gate clean (no blocking failures); judgment GRADED 7/7; tested end-to-end in `/tmp`
    (`boss new` + `boss unlock mvp`, both hooks present + dormant, skill present).

## 0.47.0 — 2026-06-19

- **Humane two-way learning channel — built the moment BOSS went public, the humane way (IDEA-024).**
  Going public (MIT, github.com/ajeshh/bossbuild) turned a private dogfood into a thing strangers
  run, which needs a way to learn + pivot. Ajesh asked for "feedback from end-users, and learn
  *passively* how users use it." The second half is the exact surveillance line BOSS exists not to
  cross ([IDEA-021](../docs/ideas/IDEA-021-passive-instrumentation-and-fleet-learning.md)). Applied
  BOSS's own conscience (mentor-humane fork; PRINCIPLE: humane before viable) and built the honest-trace
  version instead — **no silent telemetry.**
  - **`/feedback` (direct, user-initiated).** A founder-facing skill in L0: send a bug / confusion /
    wish back upstream. Shows the founder the exact title + body + the *one* line of context
    (`BOSS <ver> · <mode> · <OS>`) before anything leaves the machine; files a GitHub issue via
    `gh issue create`, or falls back to a prefilled issue link to paste. Public-repo warning stated.
    Never automatic, never a hook.
  - **`boss insights` (passive, the humane way).** Reads the trace your own work *already leaves* —
    your registered projects on *this machine* — and reports where each venture's loop stands
    (idea → canvas → build), flagging empty / untested / stale. **Measures graduation + loop-closure,
    never activity/engagement** (the vanity metric BOSS refuses to expose). Local-only; nothing is
    sent. Zero-dep (`src/insights.js`).
  - **Opt-in share-up contract.** New `shareUp: false` default in `.boss/config.json` — any future
    cross-user learning is gated on this flag being true *and* a per-send confirmation, by construction.
    Telemetry is never a default.
  - **Not built (deferred, named in IDEA-024):** silent cross-user telemetry (the line — not crossing
    it); a full `npm publish` / auto-update pipeline (premature at n≈1 — `boss status` already nudges
    on version drift; the real risk is demand, not distribution). Captured in
    [SESSION-2026-06-19-founder-test](../docs/research/sessions/SESSION-2026-06-19-founder-test.md).

## 0.46.0 — 2026-06-19

- **Bring-your-own-material import — the on-ramp from "I jotted it somewhere" (IDEA-023).**
  Occasioned by a live founder-test: a founder ran `boss new`, then stalled — the idea lived in a
  Word doc / Google Doc / Obsidian note / PDF / deck / URL, and there was **no way to bring it in**.
  A correctly-scaffolded but idea-less project read as *"empty… I'm stuck."* This closes that
  first-run dead-end.
  - **Load-bearing decision:** import lives in the **skill layer, not the zero-dep CLI** — the CLI
    (Node built-ins only, Principle 4) can't parse PDF/docx or fetch a URL, but the model already
    reads heterogeneous formats natively. Same predicate/runner split as the loop runtime (IDEA-008):
    deterministic core stays deterministic; the model does the parsing + shaping.
  - **What ships:** (1) `/boss` §1 now ingests **one-or-more sources** — local files *and* URLs, in
    any mix — snapshots a durable copy of each into `docs/source/` ("the project owns a copy"), and
    synthesizes across all of them before shaping the idea. (2) A new **`/import`** skill (registered
    in the L0 manifest) for adding material to an *already-captured* idea, or as an alternate spin-up
    door. (3) **Discoverability fix** — the part that actually stuck the founder: `boss new`'s "Next:"
    block now shows `code <name>` (editor handoff) + the file/url/import options; `/welcome` (both the
    full tour and the 30-second version) and the L0 `CLAUDE.md` template all advertise bring-your-own
    material.
  - **Deferred (named in [IDEA-023](../docs/ideas/IDEA-023-bring-your-own-material-import.md)):**
    material-first ordering (point at material → BOSS names the folder), binary/OCR formats
    (`.pptx` text, image-only PDFs), live-source re-pull vs. one-time snapshot, and a CLI
    `boss import` second door (only if the skill path proves it's wanted outside Claude).
  - Dogfood target: `~/Projects/fraands` (the project that surfaced the gap). Surfaced + captured in
    [SESSION-2026-06-19-founder-test](../docs/research/sessions/SESSION-2026-06-19-founder-test.md)
    (OBS-002/003/005).
- **`/welcome` closes on the action — long content no longer buries the next step (OBS-001).**
  Same founder-test: *"the welcome message is a bit too long… I forget what I'm supposed to do next."*
  The skill already had an "end on one next step" rule, but the beginner tour printed three full
  reference sections (conscience / modes / help) *after* the next step, walling it off. Fix: a new
  voice rule ("close on the action — long content must tie back to the next step"), and a structural
  **pivot** — after the shape + next step, the three reference sections are now **offered, not dumped**
  (tagged `reference — expand only if asked`); the founder leaves on `/boss` or `/triage`, not on a
  wall. (OBS-004 — host-switching across Claude app/VSCode/Cursor — logged, deferred to IDEA-006.)

## 0.45.0 — 2026-06-05

- **JIT working-context, Phase 1 — every `boss new` project is now JIT-by-construction (FEAT-020).**
  The deny-list (v0.42) made projects secrets-safe by default; this makes them *context-lean* by
  default. The principle was already vetted (`context-discipline` practice, RVW-005/010) but only
  *described* path-scoped rules — now the templates **ship** them. This is Phase 1 of a 4-phase
  lifecycle ([`docs/ideas/FEAT-020`](../docs/ideas/FEAT-020-jit-working-context-lifecycle.md)); Phases
  2-4 (`/close` GC, promote-on-evict via `/extract`, a freshness moment) are specced + deferred with
  triggers.
  - **What ships:** `.claude/rules/` examples with `paths:` frontmatter that load **only when Claude
    opens a matching file** (not at session start) — L0 `your-app-code.md` (the basic path-scoped
    pattern), L1 `feature-context.md` (the live feature's working notes, which Phase 2's `/close` will
    later compress to a one-liner). The two-memory cut that decides what goes where is documented in
    the new `library/memory-seed/` shelf (README + an example durable-facts seed). L0 `CLAUDE.md`'s
    Memory line now names both halves (durable → auto-memory; working-state → path-scoped rules).
  - **Verified before building:** confirmed against the official Claude Code docs (2026-06-05) that
    `.claude/rules/` with a `paths:` key is real and JIT-loaded — *not* a confusion with Cursor's
    `.cursor/rules` (`globs:`). The `context-discipline` practice's "re-verify host syntax on every
    build" rule, honored.
  - **The restraint line (carried from the IDEA):** Phases 2-4 risk being BOSS gold-plating its own
    substrate; the recency-window-by-hand is currently enough. First dogfood is BOSS's own repo — a
    Phase-1 slice going stale and misinforming a session is the cleanest Phase-2 re-open signal.
  - Zero-dep held; tested end-to-end in `/tmp` (`boss new` → rule present; `boss unlock mvp` → feature
    rule added). `mentor-architect` pass + 4 forks decided with Ajesh recorded in the FEAT.

## 0.44.0 — 2026-06-02

- **`secrets-guard` PreToolUse hook — the high-stakes ceiling, shipped opt-in (closes the RVW-005
  follow-on, the principled way).** The v0.42 deny-list is the universal zero-cost floor; this hook is
  the broader-coverage ceiling — and the v0.42.1 reconsideration said it must NOT be a universal
  default (a `PreToolUse` hook spawns a process on *every* tool call). So it ships **dormant**:
  `library/hooks/secrets-guard.js` (canonical) + `.claude/hooks/secrets-guard.js` in the L0 template,
  **not registered by default.** Registration is the on-switch (an unregistered hook costs nothing),
  recommended for the `domain-expert` / regulated cohort.
  - **Behavior:** Read/Edit/NotebookEdit of a secrets file (`.env`/`.env.*`/`secrets/**`) → **deny**
    (reading secret contents into context is the leak); Bash or MCP referencing a secrets path →
    **ask** (don't hard-block legit `.env` *creation* — surface it to the human); else allow.
    **Fail-open** (any parse/runtime surprise → allow; a guard that breaks the session is worse than
    one that occasionally misses, and the deny-list floor still hard-blocks the common vectors).
  - **Tested** (10 cases, piped PreToolUse events): denies Read/Edit of `.env`/`.env.local`/
    `secrets/`; allows `src/app.js`, `npm test`, and `.environment.ts` (no false positive); asks on
    `cat .env` + MCP-with-secrets; fail-open on malformed input. Zero-dep Node, output per the Claude
    Code PreToolUse contract (JSON `permissionDecision`, exit 0).
  - **Cohort auto-registration deferred** (a clean follow-on): wiring `domain-expert` cohort setup to
    register it automatically. Today it's documented opt-in (snippet in the file header + the
    `context-discipline` practice).

## 0.43.0 — 2026-06-02

- **Wayfinding, Pass 1 (IDEA-018) — `boss map` + a doc generator that can't rot.** Occasioned by a
  docs-health pass that found the README **19 releases stale** and, worse, that there was **no "how to
  use BOSS" guide at all**. The fix is shaped like BOSS itself: wayfinding, not a manual. Decisions
  locked with Ajesh — **mode ladder is the spine** (persona = entry filter, aspect = which mentor to
  ask, never chapters); **split audience** (a command ships to founders, the prose stays in the BOSS
  repo); **durable core first**.
  - **`boss map`** (CLI, ships to every project) — the *live* cheatsheet. A pure render of state the
    project already holds (the `.boss` stamp + installed `SKILL.md` files), in the `boss board`
    spirit: *You are here · available now (grouped by the rung that unlocked each skill) · one unlock
    away (the next rung's skills, read from the package, with the real project name substituted in) ·
    standing controls.* Nothing to maintain, nothing to drift.
  - **The de-rot mechanism** — `src/modes.js` is the single source both `boss map` and the generator
    read (manifests + `SKILL.md` frontmatter), so the live map and the static docs can never disagree.
    **`scripts/gen-docs.js`** (`npm run gen:docs`) emits **`docs/CHEATSHEET.md`** (the whole ladder,
    the wall-poster) and **`docs/SKILLS.md`** (one line per skill, grouped by mode) — both carry a
    GENERATED banner and are derived, never hand-typed. This is the actual fix for what bit the README:
    the per-mode lists become a build artifact, not a memory test.
  - Zero-dep held — `src/map.js` + `src/modes.js` ship; `scripts/` and the generated `docs/` stay
    dev-only (verified via `npm pack`). Eval suite regression-clean (no blocking failures, GRADED 7).
    End-to-end tested in `/tmp` (map at Quickstart → unlock mvp → map regroups + previews V1; placeholder
    substitution + width-capping confirmed). **Pass 2 (the hand-authored `docs/GUIDE.md` walkthrough)
    is the next session** — written against these generated surfaces, per the agreed sequence.

## 0.42.1 — 2026-06-02

- **BOSS eats its own context-discipline dogfood + sharpens the practice (the learning loop in real
  time).** Minutes after shipping `context-discipline` (v0.42.0), applied it to BOSS itself and
  refined it with what doing so taught.
  - **Dogfood (DOWN):** the recency-window rule (RVW-002) applied to BOSS's own `docs/RESUME.md` — the
    "State" section was a 25-entry append log read at every session start. Trimmed to the **5 most
    recent** entries; older versions point to `registry/CHANGELOG.md` (which carries all 43 versions —
    confirmed before cutting, so it's non-destructive). RESUME dropped **727 → 346 lines.** BOSS now
    practices the leanness it prescribes.
  - **Practice sharpening (the part that matters):** reconsidered the deferred PreToolUse secrets-guard
    hook and recorded *why* it's deferred, not just *that* it is. A `PreToolUse` hook fires a process
    on **every tool call** (real latency), where `permissions.deny` is a zero-cost native check. So the
    practice now states: the **deny-list is the universal floor** (always ship); a **secrets-guard hook
    is a high-stakes/opt-in ceiling** (regulated/PHI cohorts), **not** a universal default — adding
    always-on per-call machinery for marginal coverage is the framework-bloat BOSS warns founders
    against (R&H #1 / IDEA-013 cost discipline). This is `/vet`'s skepticism turned inward: even an
    ADOPT's "ceiling" gets cost-weighed before it ships to everyone.
  - No template/CLI behavior change beyond the doc + RESUME; the v0.42.0 deny-default still stands as
    the shipped safe-default.

## 0.42.0 — 2026-06-02

- **`/boss-learn` routes the sweep's first ADOPT — a "context discipline" practice, UP + a DOWN
  safe-default.** Acting on the v0.41 `/vet` sweep: the two ADOPTs (RVW-005 deny-secrets, RVW-010
  token-optimization) plus RVW-002 (lean session docs) collapsed into **one** pattern, routed two ways
  per PRINCIPLE #1.
  - **Verify-before-encode (the gate both verdicts set).** Before promoting, the version-bound Claude
    Code claims were checked against current behavior. One was **FALSE — `.claudeignore` does not
    exist** (the source post conflated it with `permissions.deny`); it was struck from the practice
    rather than shipped to every project. Confirmed: `permissions.deny` glob syntax (and that a
    `Read(...)` deny does **not** cover Bash — needs a separate `Bash(...)` rule), PreToolUse hard-block,
    `.claude/rules/` `paths:` frontmatter, CLAUDE.md load behavior. The `/vet` thesis applied to BOSS
    itself: popularity ≠ correctness, even when *BOSS* is the one adopting.
  - **UP** → `library/practices/context-discipline.md`: lean always-loaded docs (CLAUDE.md +
    RESUME recency-window), path-scoped `.claude/rules/`, `permissions.deny` for secrets *and* bloat,
    PreToolUse/PostToolUse hooks as the enforcement ceiling. Host-tagged `claude-code` with an explicit
    "re-verify syntax on host change" note (IDEA-014 recalibration). Provenance cites the RVWs — vetted,
    not adopted on stars.
  - **DOWN (product safe-default)** → the L0 Quickstart template now ships a `permissions.deny` block
    for `.env`/`.env.*`/`secrets/**` (Read + Bash) in `.claude/settings.json`, and `.gitignore` covers
    `.env.*` + `secrets/`. Every new `boss new` project is secrets-safe by default — the
    enforce-in-harness principle (RVW-012) made concrete, not left as advice.
  - **Deferred follow-ons (named, not crammed in — PRINCIPLE #2 / small steps):** a `library/hooks/`
    PreToolUse secrets-guard (catches Bash + MCP + future skills — code+test, its own step);
    mode/cohort-scoped `.claude/rules/` in the template; BOSS's own root CLAUDE.md/RESUME trim
    (RVW-002 — awaiting Ajesh's recency-window size). ADAPTs RVW-007/008 remain founder-facing/scope-gated.

## 0.41.0 — 2026-06-02

- **First `/vet --all` sweep — 10 verdicts (RVW-003…012), and the skill earned its keep.** Ajesh
  dropped a 10-item pile of AI/Claude-Code "best practices" (Reddit threads + Lenny's-newsletter posts)
  and swept them in one pass. The distribution is the proof the skill routes on merits, not reflex:
  **2 ADOPT · 2 ADAPT · 3 NOT-YET · 3 REJECT.** Only 2 clean adopts out of 10 — a skeptic, not a
  bookmark folder.
  - **The two ADOPTs collapse into ONE action — a "BOSS context discipline" practice** (the value of
    synthesizing a sweep instead of N independent verdicts). RVW-005 (hard-deny `.env`/secrets, don't
    trust prompting), RVW-010 (lean CLAUDE.md <500 tok, path-scoped `.claude/rules/`, `permissions.deny`
    for bloat, hook noise-filtering), and the earlier RVW-002 (RESUME recency-window) are facets of one
    practice; RVW-009 (context-engineering failure modes) is its research rationale and RVW-012 (Agent
    = Model + Harness, "safety lives in the harness not the model") its backing principle. Queued for
    `/boss-learn` (UP `library/practices/` + `library/hooks/` secrets-guard + DOWN BOSS's own doc trim
    + template defaults), **gated on verifying version-bound Claude Code specifics first** (IDEA-014
    recalibration territory).
  - **Two ADAPTs, both founder-facing + scope-gated:** RVW-007 (Couch-to-5K — adopt the
    smallest-next-step *philosophy* for `/welcome` + beginner-cohort nudges; **reject the daily-streak
    mechanic** as the gamification/pressure trap the canvas already refuses — a guardrail recorded so a
    future session isn't tempted); RVW-008 (categorize-agents / start-simplest — a modest
    `mentor-architect` framing, strip the enterprise + stack taxonomy per PRINCIPLE #4).
  - **Three NOT-YET:** RVW-003 (plumbing-awareness — strong founder-facing candidate, re-open when the
    founder-facing build lands), RVW-009 + RVW-012 (reference pieces — re-open at conscience
    context-injection review / IDEA-006 host-contract work respectively).
  - **Three REJECT, recorded with reasons:** RVW-004 (`/remote-control` — out of scope/low-evidence,
    but kept a humane stance on always-on agent work), RVW-006 (21-hacks listicle — wrong altitude),
    RVW-011 (n8n tutorial — PRINCIPLE #4, folded into RVW-008 as an example).
  - **A real skeptical catch:** 6 of the 10 drops were by the **same author** (one newsletter
    corpus). The sweep applied an **author-concentration discount** — cross-confirmation *within* one
    voice isn't independent evidence; the "respected practitioner" rubric rung counts once, and the
    real evidence is the *distinct* sources (the deny-secrets PSA, slaorta, StokeJar, and the
    DeepMind/Microsoft/Salesforce research cited *inside* the pieces).
  - Records: `docs/research/verdicts/RVW-003…012`; all 10 inbox items marked `resolved:`. Zero-dep held
    (`npm pack` ships 0 — all under `docs/`). No code/skill change → gate + judgment suites unaffected.
    **Nothing is built yet** — ADOPT/ADAPT hand-offs await Ajesh's go (the skill decides *whether*;
    `/boss-learn` decides *where*).

## 0.40.1 — 2026-06-02

- **`/vet` gains batch sweep — drop a pile, vet once.** From dogfooding `/vet` on real drops (RVW-001,
  RVW-002): the natural rhythm is *accumulate, then sweep*, not vet-on-arrival. `/vet --all` now vets
  every un-vetted inbox item — **each as its own full skeptical pass with its own `RVW-NNN` verdict**
  — then prints one summary table + the ADOPT/ADAPT hand-off list. No-arg `/vet` lists un-vetted items
  oldest-first and offers the sweep. Already-vetted items (a `resolved:` line or an existing verdict)
  are skipped. Clarified the old "one claim per run" rule → **"one claim per verdict"**: it always
  protected *depth-per-claim* (never collapse several claims into one shallow verdict), never forbade
  vetting many in sequence — the sweep is many full passes, not one pass over many.
- **First two verdicts on the record (dogfood):** `RVW-001` — the four-rule "Karpathy" CLAUDE.md →
  **REJECT** (BOSS already encodes all four as principles + the cohort-aware conscience; a static file
  would regress toward the frozen-rules brittleness the thread's own top critique names — which is
  IDEA-014's thesis). `RVW-002` — slaorta's lean/modular CLAUDE.md → **ADAPT** (apply the
  recency-window to `RESUME.md`'s State section, which duplicates `registry/CHANGELOG.md` and grows
  unbounded; generalizable shape is a `library/practices/` UP candidate). The REJECT/ADAPT split is
  the evidence `/vet` routes on merits, not reflex. RVW-001 also surfaced **external confirmation of
  IDEA-014** (a stranger reasoning to the recalibration thesis) — now cited in that idea.

## 0.40.0 — 2026-06-02

- **`/vet` — the skeptical inbox. The inverse of `/boss-learn`.** From Ajesh's seed: *"if i have new
  research or best practices, we should have a way where i can just drop it in, and then our mentors
  and such review and see what we should integrate. reddit is full of best practices, but that doesnt
  mean all are good ideas."* The last sentence is the whole design.
  - **Why it's the inverse, not a fork.** `/boss-learn` routes a pattern *you already proved* (built
    it, it worked, it repeated) UP into `library/` or DOWN into the app — its input has earned trust.
    `/vet` takes a claim *from a stranger* (a Reddit thread, an HN comment, a blog post, a paper, a
    "you must do X" tweet) that has earned **nothing**. Its job is the part `/boss-learn` never has to
    do: decide whether an unproven outside claim deserves to become practice **at all**. ADOPT *hands
    to* `/boss-learn` (whether → where); it never reimplements it.
  - **The filter is the product.** A drop folder with no judgment is a bookmark pile. The value is the
    skeptical read. The skill is **biased toward NO** — most internet best practices don't apply to
    BOSS, at its stage, for its thesis — and makes a claim *earn* an ADOPT.
  - **The NO-biased rubric (any one question can sink the claim):** (1) does it contradict a PRINCIPLE?
    (#6 / `mentor-humane` can veto outright); (2) evidence grade — n=1 vibe vs. pattern-with-data vs.
    respected practitioner (most claims die here); (3) duplicate or genuinely sharpen?; (4) who does it
    serve **and harm** (great for `eng-builder`, toxic for `first-product` → ADAPT-with-scoping at
    best); (5) cost/ceremony (does it make BOSS heavier — R&H #1).
  - **Four honest verdicts**, mirroring `/extract`'s UP/DOWN/NOT-YET: **ADOPT** (→ `/boss-learn`),
    **ADAPT** (modified, reasoned), **REJECT — with reason, recorded** (the quietly important one — so
    the same thread isn't re-litigated next month; the verdict log is BOSS's memory of what it
    *deliberately didn't* adopt), **NOT-YET** (with a re-open condition). Before vetting, `/vet` reads
    prior verdicts and won't re-litigate.
  - **Restraint by design (PRINCIPLE #2):** deliberate-invoke, like `/extract` and `/drift-deep` —
    **no `vet-loop`, no hook moment, no nudge to "review your inbox."** An automatic research-review
    obligation would be the ceremony BOSS exists to refuse. It also doesn't *find* research (that's
    `/deep-research`) — it judges what you bring it.
  - **Scope: internal-curation first.** `/vet` is a **BOSS-local meta-skill** (lives with `/boss-learn`
    + `/boss-sync` in `.claude/skills/`, **not** in the founder template) — it vets against
    `PRINCIPLES.md` + BOSS's own `library/` and routes ADOPT into the BOSS source. The founder-facing
    version (founder drops a thread → BOSS reads it against *their* canvas/stage/cohort) is the named
    **UP candidate** (IDEA-016), deferred until the internal version earns it.
  - Shipped: `.claude/skills/vet/SKILL.md`; drop zone `docs/research/inbox/` + verdict log
    `docs/research/verdicts/` (each with a README); new **`RVW-NNN`** ID type in `docs/IDS.md`;
    IDEA-016 captured + the two design forks decided (internal-first; single skeptical pass — the
    mentor+persona panel is the upgrade if the single pass proves too shallow). Zero-dep held (`npm
    pack` ships **0** of these — BOSS-local + `docs/`, neither in the `files` allowlist). Gate +
    judgment suites unchanged (no hook moment, no predicate change).

## 0.39.0 — 2026-06-02

- **`capture` goes judge-backed — the third model-judgment moment, and it ships GRADED from day one.**
  capture (moment #3, PRINCIPLE #1's own) fired structurally on `≥3 devlog entries + no extraction
  record` — but a count can't tell a real extraction candidate from three entries of normal in-progress
  work. That's the exact crude-predicate problem drift (v0.31) and caution (v0.33) already solved with a
  bounded-read model judgment. v0.39 gives capture the same upgrade.
  - **The judgment (strictly more restraint — capture can now only fire LESS):** the gate still opens,
    but before voicing, the model silently reads the ~5 most recent devlog entries and fires ONLY if
    there's a real candidate — a pattern built **twice** (reusable practice → UP into `library/`), a
    fix/guard hand-applied in **several places** (hardening → DOWN into core), or a manual **ritual
    repeated** enough to deserve a skill/loop. If the recent work is one-off distinct features, deep
    focus on a single still-in-progress thing, or early throwaway spikes — nothing has generalized;
    **stay silent.** The silent class is trust-critical: nudging `/extract` with nothing to extract
    earns a NOT-YET every time and trains the founder to tune the conscience out — the premature
    ceremony PRINCIPLE #2 warns against. Same shape as drift/caution: no model call in the hook, no new
    state, no predicate change — a bounded-read voicing instruction the model executes in the live turn.
  - **Shipped:** upgraded `capture` voice frame in the hook lib; `capture` added to `JUDGE_MOMENTS` (so
    the conscience-frequency ledger logs it as a judge-moment) and to `MOMENT_SIGNALS` (voice-hash
    source of truth); **`capture.judgment.yml`** (7 labeled cases — 3 should-fire-extractable
    [practice-twice / guard-in-3-places / repeated-ritual], 3 should-not-fire-nothing-yet
    [one-off / single-in-progress / spikes], 1 ambiguous [written-twice-maybe]);
    **`fixtures-devlog-extract.js`** (extractability-focused devlog corpus, distinct from drift's
    risk-focused one); `replay.js` + `regrade.js` extended with a `capture` row (the MOMENTS registry
    proves it generalizes — third moment, same engine).
  - **Graded the free way (per v0.38):** all 7 cases run through isolated reasoning-required Opus 4.8
    sub-agents; **all 7 agree with the human labels.** `replay.js` reads **GRADED 7/7** for capture
    (24/24 across drift+caution+capture). Transcripts stamped `generated_via:
    in-session-subagent-reasoned` + `harness_note`; a real `npm run regrade capture` overwrites them.
  - Zero-dep held: `npm pack` ships **0** judgment/transcript/extract-fixture files; no `src/` ref.
    Gate suite **105/0/41** (the predicate is unchanged — `moment-capture.yml` still covers detection).
    The judgment channel now covers **3 of the conscience's moments**; the remaining structural moments
    (cost / failure-mode / cost-stale) are binary facts and correctly stay non-judge (a model judge
    there would be the v0.34 cost trap).

## 0.38.0 — 2026-06-02

- **The conscience's judgment is now MODEL-VERIFIED — `drift` + `caution` read `GRADED 17/17`, not
  `NEVER_GRADED`. The hole `regrade.js` was built to close (v0.35) is closed — without an API key.**
  Since v0.32 the judgment surface (`replay.js`) shipped a labeled set + voice-hash tripwire + coverage
  floors but printed `NEVER_GRADED` loudly: the model had never actually been tested against the labels,
  so every judge-moment was structurally-checked vibes. Closing it normally needs a paid out-of-band
  `regrade.js` run (Node `fetch` → Anthropic API). We closed it the free way: `regrade.js` runs two
  model calls per case *because it executes with no model present* — but a live session **is** Opus 4.8,
  the same model it would call. Each of the 17 cases (10 drift + 7 caution) was run through an **isolated
  sub-agent** seeing only the exact voice frame + bounded read the hook injects, and the decisions
  written as transcripts in `regrade.js`'s own format.
  - **Result: all 17 decisions agree with the human labels.** The frame and the labels are
    well-calibrated; the model nails the trust-critical silent class (the on-aim cases where firing
    would be the false positive that erodes the conscience) — e.g. it reads a missing canvas
    "Experiment this week" line as a *bookkeeping* gap, not a *validation* gap, when the devlog shows
    the experiment is already running.
  - **A real methodology finding, recorded honestly:** a first, terse "output only SILENT or the nudge"
    harness mislabelled **3 of 17** — one spurious fire (on-aim drift) and two spurious silences
    (textbook feature-piling / competitor-watching caution cases). Requiring the model to do the
    "silently read… then judge" reasoning the voice frame *explicitly demands* flipped all three to
    agree with the label. The lesson: the frame's reasoning instruction is load-bearing, and how you
    elicit a judgment changes it — exactly the kind of thing the recalibration discipline exists to catch.
  - **`regrade.js` made importable** — `main()` now runs only on direct invocation; `decisionPrompts`,
    `MOMENTS`, `loadCases` are exported (so the prompt assembly is reusable/testable and can't drift
    from the paid path). `--dry-run` still green; importing the module no longer spends.
  - **Honest provenance, not a masquerade:** every transcript carries `generated_via:
    in-session-subagent-reasoned` + a `harness_note` stating it was NOT the clean `fetch` harness and
    that `ANTHROPIC_API_KEY=… npm run regrade` overwrites it as the canonical instrument. The interim
    grading is real (same model, same frame, same isolation) without overclaiming the provenance.
  - Zero-dep line held: `npm pack` ships **0** judgment/transcript files; no `src/` reference. Gate
    suite **105/0/41**; judgment **GRADED 17/17** (was NEVER_GRADED 17). The loud "not yet
    model-verified" banner is gone.

## 0.37.0 — 2026-06-01

- **`/drift-deep` — the deep, whole-project drift audit. The biggest unused 4.8 lever, now built.**
  The hook `drift` moment (v0.31) is a cheap always-on tripwire: it reads ~5 recent entries and
  asks "you named a risk, you're piling work, nothing tests it — is the recent work on-aim?" This
  is the **deliberate, founder-invoked counterpart** that a bounded read can't do: *read EVERYTHING
  I've built and tell me, across the whole body of work, whether I'm validating my riskiest bet or
  building around it.* The 1M-context "am I fooling myself across everything" check — the original
  finding from the very first 4.8 pass.
  - **Why a skill, not a hook moment:** a whole-project read can't fire per-prompt — that's the
    expensive-AI-app trap the v0.34 cost discipline guards against. So the cheap moment stays the
    everyday tripwire; this is the audit you *invoke* when you want the truth, not a glance. The
    restraint (no loop, no nudge to "run your audit") is the design — making it a recurring
    obligation would be the premature ceremony BOSS avoids.
  - **Broader than the gate** in two ways: it runs even when a validation plan exists (did you
    *execute* the experiment, or write the plan-line and drift from running it?), and it reads the
    **actual `src/` code** (what you built is the truest record of what you bet on), not just the
    devlog tail.
  - **`/drift-deep` (L1-mvp skill)** — reads the canvas (bet + plan + cells) + ALL devlog + every
    FEAT spec + `src/` structurally + the ideas; judges each body of work against the bet ("does
    this *test* the risk or build *around* it?"); reaches a verdict (on-aim / drifting / mixed) with
    confidence + named gaps + the smallest re-aim; writes `docs/drift-audits/DRIFT-YYYY-MM-DD.md`.
    Cohort-aware (vibe-virtuoso served most — ships a lot, validates little; domain-expert gets the
    who-could-be-harmed humane lens on an un-validated risk). Routes back to `/canvas` / `/pretotype`.
  - **Integration:** the cheap `drift` hook moment now points at `/drift-deep` for the full audit
    (one terse clause — the cheap nudge stays cheap). Follows the `/extract` precedent — a deliberate
    skill judgment, tested in use, not by the hook-judgment-eval surface (noted in the skill).
  - L1-mvp now ships 14 skills. Gate + judgment suites 105/0/41 (the drift voice-hash shifted from
    the pointer — the tripwire working as designed; no transcripts, so no STALE). The 4.8 leverage
    arc's last deferred item, landed.

## 0.36.0 — 2026-06-01

- **`boss board` — a live read of what's in flight (IDEA-015, Phase 1).** Occasioned by Ajesh's
  "internal kanban / fire a html site / Obsidian / almost a Trello board" idea. Convened six advisors
  (venture, architect, humane, designer + vibe-virtuoso & indie-hacker persona reactions); the result
  was **unanimous and collapses to one fork: build the *view*, refuse the *app*.** A board BOSS
  *renders* from state it already holds externalizes the arc for a tired brain; a board BOSS *becomes*
  (log in, drag cards, keep in sync) is the photo-negative of BOSS and Canvas R&H #1 wearing a UI.
  **The founder never touches the board — they change the work and it re-renders.**
  - **`boss board` (new CLI subcommand, [src/board.js](../src/board.js))** — derives four columns
    (Captured → Taking shape → Building → Shipped) from files that already exist. **Frontmatter is
    truth — reads each IDEA-*/FEAT-* file's `status`, never `docs/ideas/INDEX.md`** (a hand-maintained
    table that drifts; a board that trusts a drifting source lies). Pure projection: no
    `.boss/board.json`, no second source of truth, nothing to sync — so concurrent / out-of-order /
    agent edits can't corrupt a render (the answer to Ajesh's "picks something out of order" worry is
    *statelessness*, not merge logic). A promoted idea is represented by its FEAT card (no
    double-count); blocked FEATs flag `· blocked`.
  - **Humane constraint honored (mentor-humane override):** the riskiest-assumption status sits
    *above* the columns — when there's capture but nothing pressure-tested, the evidence line says so
    plainly and points at `/canvas`. Empty columns are shown, not hidden (the empty cell is the
    diagnostic). Plain factual copy — no completion-celebration, no gamification, no notifications.
  - **Deterministic projection, no model in the loop** → it's a CLI verb, not a skill (spending model
    tokens on `readFile` + string-template would be the anti-pattern the v0.34 frequency-ledger work
    fought). Ships with the binary → available in every project automatically; **no manifest change**.
    Lands in IDEA-006's already-portable Layer 1 (zero host contract).
  - **Earned its keep on first run:** reading BOSS's own repo, it surfaced real INDEX-vs-files drift
    (IDEA-003 / IDEA-014 are `building` in their frontmatter while INDEX still said `exploring`) — the
    exact failure mode that justified reading frontmatter over the table.
  - **Deferred by design (the discipline BOSS preaches, applied to itself):** `--html` (read-only,
    generate-on-demand, same data model) is gated behind *earn it first* — if `boss board` gets run
    unprompted each session, build the render; if not, the gate saved the work. Obsidian is mostly
    documentation (`docs/` is already a vault), not a build. Both captured in IDEA-015 with the
    write-back caveats. End-to-end tested in `/tmp` (empty / captured-only caution banner / canvas →
    Taking shape / FEAT supersession / blocked / shipped / placeholder-canvas negative test).

## 0.35.0 — 2026-06-01

- **The recalibration engine — `regrade.js` built + run-ready, and model-recalibration named as a
  standing discipline (IDEA-014 Phase 1).** Occasioned by Ajesh's direction: adapting to new/
  different models should be a *standing capability*, not the ad-hoc reaction the v0.31–v0.34 arc
  was. Picked as the move that *helps BOSS keep improving easily* — because both judge-moments
  (drift, caution) were `NEVER_GRADED`: the labeled sets existed but the model had never been tested
  against them. Every future judge-moment would ship as vibes until that closed. `regrade.js` is the
  keystone that makes all future conscience work *measurable*.
  - **`regrade.js` (zero-dep, env-gated, out-of-band)** — the calibrator promoted from spec-stub to
    real harness. Per case: a **decision call** (give the live model the exact voice frame the hook
    injects + the bounded read the instruction names + a neutral founder turn → fire or stay
    silent?) + a **judge call** (grade the nudge against the case rubric → structured verdict),
    writing `transcripts/<moment>/<id>.json` stamped with the current voice-hash. Uses Node built-in
    `fetch` (no SDK). **`--dry-run`** verifies the whole pipeline (prompt assembly across all 17
    cases + the judge parser) with no API and no spend — verified green; the live `fetch` is the
    only unexercised line (a standard POST). `npm run regrade`; `BOSS_REGRADE_MODEL` to point at a
    different model.
  - **`moments.js`** — shared voice-hash source of truth so `replay.js` and `regrade.js` *cannot*
    disagree on the fingerprint (a mismatch would mark every transcript STALE forever). `replay.js`
    refactored onto it (same hashes; suites regression-clean).
  - **`docs/architecture/MODEL-RECALIBRATION.md`** — the standing checklist (IDEA-014's earned
    slice). Two triggers: a new same-vendor model (*leverage more* — re-grade, revisit each
    boundary for "can this move UP now?", read the frequency ledger, check context headroom) and a
    new host running a different model (*degrade gracefully* — judge-moments fall back to predicate-
    only). `regrade.js` is its engine; re-running it on a new model **is** recalibration. Named as a
    PRINCIPLE-#1 **UP** candidate (founders face the same model-migration problem — `/claude-api`
    already migrates their apps).
  - **Deferred, loudly:** the per-host model-capability profile + a `/recalibrate` skill — until a
    second model/host exists (a `/recalibrate` with nothing to recalibrate *to* is the premature
    ceremony v0.34 dodged). Token accounting stays host-contract territory (IDEA-006).
  - Gate + judgment suites 105/0/41; `npm pack` ships 0 tooling files. The judgment is now
    *run-ready* to become model-verified — one `ANTHROPIC_API_KEY=… npm run regrade` away (no key in
    the build env, so the live grade is the founder's to trigger).

## 0.34.0 — 2026-06-01

- **Conscience frequency ledger — BOSS eats its own `/ai-cost` dogfood, honestly. The last build
  of the 4.8 arc.** As judge-moments multiplied (v0.31 drift, v0.33 caution now do model judgment
  in the live turn), the conscience began costing real tokens per prompt — while BOSS preaches
  cost discipline and never measured its own. The first 4.8 pass flagged the trap: *BOSS becomes
  the expensive-AI app it warns against.* (IDEA-013.)
  - **The reframe is the decision (mentor-architect):** the build started as "conscience *cost*
    instrumentation" and was reframed to **frequency — facts, not estimates.** The hook never
    calls a model, so a char→token estimate would manufacture a billable-looking number while
    blind to its dominant term (the induced bounded reads judge-moments trigger in the main turn).
    That's *lying with numbers* — the exact cost-theater BOSS warns against; PRINCIPLE #2 vetoes
    it as premature ceremony. The *real* problem under the cost framing is **over-firing** — the
    actual way a conscience becomes costly/annoying, and a number you'd act on. So: measure
    frequency honestly; defer the token question to where honest token data lives (host-side,
    IDEA-006).
  - **`.boss/conscience-log.jsonl`** (gitignored) — the hook appends one line per fire:
    `{ts, moments[{moment,confidence}], judge(bool), injected_chars, cohort}`. Facts only — **no
    token/dollar estimate.** A **separate BOSS-meta ledger**, never the founder's
    `.boss/cost-log.jsonl` (BOSS's overhead ≠ the founder's app cost).
  - **First correctness-invisible fire-path side effect.** The hook goes from pure-emit to
    has-a-side-effect; `logActivity` runs only past the silent early-exit, append-only, single
    write, in its own swallowing try/catch. **Verified byte-identical** hook output with and
    without the ledger writable — delete it and the conscience behaves the same.
  - **`boss conscience activity`** (alias `cost`, which prints the honest frequency-not-tokens
    reframe) — fires, judge-moment share, median injected chars, per-moment counts, and the
    **over-fire smell** (clustering: a moment firing ≥4×/hour or ≥8×/24h — flagged because no
    per-prompt denominator exists without logging non-fires, which would break the instant
    property). Plus a one-line activity summary in `boss status --conscience`.
  - **Measure-only; self-throttle deferred indefinitely.** A throttle would gag the conscience
    exactly when a drifting founder generates more prompts and needs it most — **humane before
    viable**, and a one-way door (every "why didn't it speak?" becomes unfalsifiable). This ledger
    is the *evidence* that would earn that conversation, not a step toward it. Token/dollar
    estimation also deferred — host-contract territory (the only honest token count comes from the
    host, not the hook). `JUDGE_MOMENTS` set added to the hook lib. Gate + judgment suites
    regression-clean (105/0/41; drift + caution covered).

## 0.33.0 — 2026-06-01

- **`caution` goes judge-backed — depth vs. avoidance, and the first reuse of the v0.32 judgment
  machinery on an *existing* moment.** Moment #1 (the conscience's flagship "what does this
  prove?") fires when ≥3 captures exist with no filled riskiest assumption. But the predicate
  counts *total* captures — it can't tell **depth** (one idea getting sharper, converging toward a
  canvas) from **avoidance** (capturing-lots / validating-nothing). That ambiguity is `m1-snf-021`,
  which the gate runner has *skipped since v0.16* because no predicate can make the call. v0.33
  makes caution judge-backed and resolves it.
  - **Voice-frame upgrade** (`signalAsContext`, `caution` branch): the gate still opens, but the
    model now silently reads the active idea's capture log and judges before voicing — *one idea
    sharpening (narrowing the user, finding the real pain, wrestling the same question) = stay
    silent; idea-hopping / feature-piling / market-notes-without-a-bet = fire and name the specific
    pattern.* This is **strictly more restraint** — caution can now only fire *less*, never more.
  - **First reuse of the judgment surface (v0.32) on an existing moment** — proves the machinery
    isn't drift-specific. `replay.js` is now **multi-moment**: a `MOMENTS` registry (drift +
    caution) drives one shared engine (per-moment voice-hash tripwire + well-formedness + coverage
    + grading status). Adding a judgment moment = one registry row + a `<moment>.judgment.yml`.
  - **`caution.judgment.yml`** — 7 labeled cases: 3 should-fire-avoidance (idea-hopping,
    feature-piling, market-notes), 3 should-not-fire-depth (the m1-snf-021 case made concrete —
    narrowing, wrestling, converging), 1 ambiguous (depth-with-a-detour, `acceptable:
    [fires, silent]`). Content-rich capture-log fixtures (`fixtures-capturelog.js`) — the prose
    matters because the judgment is semantic.
  - **m1-snf-021 closed at the right layer:** the gate runner keeps skipping it (correctly — no
    predicate can make the call), now annotated "RESOLVED in v0.33; covered by the judgment
    surface," not "unimplemented." The case the gate *couldn't* test is exactly what the judgment
    channel was built for — the clearest proof v0.32 earned its keep.
  - Gate suite regression-clean **105/0/41**; both judgment moments well-formed + covered; caution
    voice-hash updated (tripwire reads the live frame). End-to-end tested via `boss new`: caution
    fires on scattered captures and ships the new depth-vs-avoidance instruction. The judgment
    remains **not yet model-verified** (replay prints NEVER_GRADED loudly) — first STALE builds
    `regrade.js`.

## 0.32.0 — 2026-06-01

- **Judgment-quality eval channel — closing the hole `drift-loop` (v0.31) opened.** drift was the
  first moment whose *detection is a model judgment*, not a predicate. The existing eval runner
  tests only the **gate** (does the hook fire on the right structural state); it stops at the
  door. Whether the model correctly calls drift-vs-on-aim *past* the open gate was unevaluated —
  a named crack in the "no moment ships without evals" floor, in exactly the spot 4.8 made
  load-bearing (`eval.md`: shipping detection logic with no way to know if it's right = "vibes-
  based AI in BOSS"). v0.32 builds the complement.
  - **The method (mentor-architect pass):** two surfaces, two cadences, on purpose. The gate-eval
    (`runner.js`, every commit, $0) stays. The **judgment surface** (`conscience-evals/judgment/`)
    is **golden transcripts gated by a voice-hash tripwire** — *not* pure LLM-as-judge (breaks the
    free/deterministic/CI property) and *not* pure golden transcripts (rot silently when the voice
    frame changes). Golden transcripts are the committed dataset; the tripwire makes their
    staleness *loud*; LLM-as-judge regenerates them out-of-band.
  - **`judgment/replay.js` — zero-dep, every commit.** (1) well-formedness — every case is a
    genuine open-gate state (filled risk, devlog ≥3 entries, no experiment line) with a coherent
    label; (2) **voice-hash tripwire** — fingerprints the exact `drift` instruction the model runs
    (`composeContext` for a drift signal); a transcript recorded against a different hash is
    `STALE` and replay says so loudly (golden transcripts that can't detect their own staleness
    are an eval that lies); (3) coverage floors (no silent caps; the on-aim/should-not-fire class
    is trust-critical and meant to *grow* toward ≥10); (4) grading status `GRADED/STALE/
    NEVER_GRADED/REGRESSION`. Exit 1 on malformed/coverage/regression; exit 0 + loud warnings on
    never-graded/stale. **All four states proven** (GRADED/STALE/REGRESSION/NEVER_GRADED tested).
  - **`judgment/drift.judgment.yml` — the labeled ground truth (Husain: build the set first).**
    10 cases: 4 should-fire-and-name-gap (incl. the sharpest — building the integration the risk
    explicitly *defers*), 5 should-not-fire-on-aim (the trust-critical class, incl. the hard
    "on-aim but informal — no experiment line, but the work IS the test" case), 1 ambiguous
    (`acceptable: [fires, silent]` so the grader doesn't punish a defensible call). Content-rich
    paired devlog fixtures (`fixtures-devlog.js`) — the *prose* matters because the judgment is
    semantic. `must_reference`/`must_not` rubric per case for the future LLM-judge.
  - **`judgment/regrade.js` — paid, out-of-band, DEFERRED by design.** The calibrator (decision
    call → judge call → write transcript stamped with the current voice-hash). Per the architect's
    staged cut: ship the labeled set + replay + tripwire first; build the API half *the week the
    first STALE tripwire fires*. Runnable spec-stub documents the full algorithm + env-checks. When
    built: zero-dep (Node `fetch`, no SDK), env-gated on `ANTHROPIC_API_KEY`, never on the commit
    path, never imported by `src/`, never in the `files` allowlist (lives under `docs/`).
  - **The zero-dep line, pinned:** the rule is *shipped surface (`src/`, `files`) stays
    dependency-free* — not "dev tooling can't call a model." Confirmed: `npm pack --dry-run` ships
    **0** judgment files; no `src/`/`bin/` reference to the eval dirs.
  - **Dogfooded in `eval.md`:** a model-judgment moment cannot ship its detection with only a
    gate-eval — the drift signal + exit predicates now require a judgment set + replay coverage for
    `drift` and every successor. Shared YAML parser extracted to `conscience-evals/lib/yaml-eval.js`
    (gate runner + replay use one copy; gate suite regression-clean at 105/0/41). New npm scripts:
    `eval:gate`, `eval:judgment`, `eval`.
  - **Honest scope:** v0.32 ships the labeled set + the staleness machinery + coverage discipline.
    The judgment is **not yet model-verified** — replay prints `NEVER_GRADED` loudly so a green run
    is never mistaken for a graded judgment. The first `STALE` is the trigger to build `regrade.js`.

## 0.31.0 — 2026-06-01

- **`drift-loop` — the closest loop to why BOSS exists, and the first moment that fronts a
  *model judgment* the predicate can't make.** PRINCIPLES.md opens with *"build faster without
  fooling themselves… continuously checking the work against real pain, real buyers."* For 30
  releases the conscience caught *structural* gaps (no canvas, no budget, no failure-states)
  but never the gap it names first: **you named the bet that could sink this, then spent your
  sessions building something else.** v0.31 closes it — occasioned by a "what does Opus 4.8
  change about BOSS" pass whose load-bearing finding was *the hook=detection / model=voice
  boundary has moved*: a stronger model can do the semantic judgment regex can't, so the
  conscience's first real "are you fooling yourself" check becomes buildable.
  - **`drift-loop` (L1-mvp, hook-runner)** — fires the new `drift` moment when (a) a canvas has
    a real **Riskiest assumption** (same predicate `canvas-loop` / `spec-loop` use) AND (b)
    `docs/devlog.md` has ≥3 dated entries (work accumulating, same threshold as
    `extraction-loop`) AND (c) no real **Experiment this week** validation plan exists yet.
    Sits in the gap *between* `caution` (no risk named) and the `done` graduation (risk has a
    plan). Confidence scales on devlog overshoot: 3 → low, 4–5 → medium, 6+ → high.
  - **The architecture, pinned (mentor-architect pass):** this is **not a new detector** — it's
    a *predicate-gated, bounded-read voicing instruction on the existing `UserPromptSubmit` →
    `additionalContext` channel*. The cheap Node predicate is the gate (and the cost control);
    the model does the stated-vs-actual comparison *in the live turn*, reading a **bounded** set
    (riskiest-assumption line + ~5 recent devlog entries + the open FEAT — never the whole
    project). No model call in the hook, **no new host primitive** (IDEA-006 contract untouched),
    **no new state**, no new predicate vocabulary. Same shape as `extraction-loop`/`/extract`,
    but **hook-fired not skill-invoked** — because a founder who has drifted from their own
    stated bet is exactly the founder who won't think to *ask* whether they've drifted.
  - **New `drift` voice frame** in `signalAsContext` (loop-runtime.js): instructs silent bounded
    read → judge → name the *specific* gap ("you said X is the bet; the last sessions built Y, Z;
    neither tests X") → point at `/canvas` or `/pretotype`. **Stay silent when on-aim** (silence
    is the correct output). Not a "you've been productive!" reward, not a generic "you should
    validate" line — the value is the specific comparison. Cohort-aware (returning-founder gets
    the harder conviction cut; first-product gets "test your riskiest bet" taught plainly;
    domain-expert gets the who-could-be-harmed lens on the named risk).
  - **Eval coverage from the start** — `moment-drift.yml` (14 cases: 4 should-fire incl. the
    placeholder-experiment edge + the drift/capture co-fire; 10 should-not incl. plan-recorded,
    under-threshold, unnamed-risk, dropped-idea, pre-MVP, and the documented `any_file_matches`
    masking limitation). Runner extended: `buildCanvasFile` now writes the experiment line.
    Suite **105/0/41** (up from 91). *No moment ships without evals* — held. End-to-end tested
    in `/tmp`: fires low→high as devlog grows, goes silent when the validation plan is recorded.
  - L1-mvp now ships 12 skills + **8 loops**. Honest scope note: hook evals test the *gate*;
    judgment-quality (does the model correctly call drift vs. on-aim) is the model's layer,
    tested the way `/extract`'s judgment is — not this runner.

## 0.30.0 — 2026-05-27

- **Closing the two remaining audit gaps — cost-log read cadence + failure-state stub
  loophole.** Same shape as v0.27: no new product axis; the discipline tightens around
  surface already shipped. The two gaps the audit named after v0.26 — *"the weekly review
  cadence is unenforced"* and *"failure-state handlers can be stubs forever"* — were real
  holes. v0.30 closes both.
  - **`/cost-review` skill (L1-mvp)** — reads `.boss/cost-log.jsonl`, aggregates by FEAT +
    user + cohort, compares against `docs/ai-cost-budget.md`, flags surprises (cost
    outliers > 10× median; user outliers; FEAT skew; quiet upward drift), writes
    `docs/cost-reviews/REVIEW-YYYY-MM-DD.md` with headline / numbers / variance / surprises /
    actions / next-review fields. Cohort-aware framing (indie-hacker gets %-of-revenue;
    returning-founder gets unit economics; domain-expert gets privacy-first confirmation
    before showing any review data). Surfaces mentor handoffs (architect for cost-shape;
    business for unit-economics) when overages exceed 10% of monthly cap.
  - **`cost-review-loop` (L1-mvp, hook-runner)** — **second time-of-work entry pattern**
    (after extraction-loop). Entry: `docs/ai-cost-budget.md` exists (the deontic moment —
    declaring the budget commits you to reading it). Exit: ≥1 file in `docs/cost-reviews/
    REVIEW-*.md` with a `^- \*\*Total spend:\*\*` line. The first review closes the loop;
    recurring re-opening waits on time-aware predicate vocabulary (same dependency as
    extraction-loop). New **`cost-stale` moment** added to `signalAsContext` voice frame.
  - **`/ai-failure-states` template — Eval-tested column added.** Each failure-state row
    (garbage / refusal / hallucination / timeout / cost-spike) now carries an **Eval-tested**
    field naming which eval case actually exercises the handler, OR marked **STUB** with an
    override required per IDEA-008. *Closes the stub-forever loophole at the declaration
    layer.* Voice note: stubs are still legitimate; *stubs without an override-with-re-open-
    condition* are not.
  - **`/evals` skill — failure-mode coverage requirement.** For AI-mediated FEATs, the eval
    set must include at least one `should-fail` case per declared failure state, categorized
    by `failure_mode` matching the canonical names (`garbage`/`refusal`/`hallucination`/
    `timeout`/`cost-spike`/`other`). *Closes the stub-forever loophole at the test layer.*
    The two layers (declaration + test) compose: handler stubs in code → declaration in
    docs → eval cases that exercise the declarations → real coverage.
- **Eval coverage from the start (v0.27 rule held).** `moment-cost-stale.yml` ships with 9
  cases: should-fire (no review; empty directory; stub file without canonical line); should-
  fire-multi (cost + cost-stale together when logger isn't wired but budget is); should-not-
  fire (full closure with review on record; pre-budget projects; LLM calls without budget
  declared — confirms entry is gated on budget doc, not LLM calls; Quickstart-shape projects).
  3 existing "full discipline declared" cases (m-cost-101, m-fm-101, m-cap-202) updated to
  also satisfy cost-review-loop's exit predicate, since they assert all-loops-closed.
- **Suite count: 91 passed / 0 failed / 41 skipped (133 loaded)** — up from 83/0/41. Every
  hook-emitted moment now has eval coverage. The "no moment ships without evals" discipline
  is the new floor.
- **What v0.30 does NOT do:** auto-enforce the failure-mode eval coverage (the `/evals`
  skill names the requirement; nothing fails the build if the eval set lacks coverage; that
  would be a v0.31+ tightening if founders ship handlers-without-evals systematically);
  recurring cost-review-loop (needs time-aware predicate vocabulary); pull `.boss/cost-
  log.jsonl` into the skill review output automatically (the parsing logic lives in the
  skill's instructions; Claude does the reading per-call to keep zero-dep CLI).
- **The audit is closed.** The three load-bearing gaps from the post-v0.26 audit (eval
  coverage, /welcome onboarding, moment #3 capture) shipped in v0.27 / v0.28 / v0.29; the
  two discipline-hole gaps in already-shipped surface (cost-review cadence, failure-state
  stub loophole) shipped in v0.30. The right-to-defer items (brownfield, /consult, AI-first
  archetype template, IDEA-003 finish, etc.) remain on the v0.31+ backlog. Audit-driven
  hardening complete; the next move is feature work.

## 0.29.0 — 2026-05-27

- **Moment #3 lands — PRINCIPLE #1's own discipline, encoded (finally).** For 28 releases the
  conscience surfaced 6 moments (caution / done / restraint / coherence / cost / failure-mode)
  but never one for PRINCIPLE #1 itself — the *pause to extract patterns UP or DOWN* rule that
  defines what BOSS is. *"Capture"* was deferred 5 consecutive releases as "needs LLM-as-judge
  or heuristic design." v0.29 ships the heuristic-plus-judgment version: a hook-runner loop
  on a simple devlog heuristic + a skill that does the real judging.
  - **`extraction-loop` (L1-mvp, hook-runner)** — entry: `docs/devlog.md` has ≥3 dated
    entries (regex `^## \d{4}-\d{2}-\d{2}`); exit: ≥1 `docs/extractions/EXTR-*.md` file has
    a `- **Route:**` line. **First hook-runner loop whose entry is *time-of-work* (devlog
    count) rather than *file-state predicate*.** Sets the precedent for future judgment-
    required moments that can't be detected by file regex alone. Threshold of 3 mirrors
    PRINCIPLE #1's *"the third time the same work repeats"* signal.
  - **`/extract` skill (L1-mvp)** — the LLM-as-judge counterpart. Reads recent commits, the
    last 3-5 devlog entries, the current FEAT, `library/`, and `src/`. Identifies 1-3
    candidate patterns by three signals (Signal A: same work repeated; Signal B: named-and-
    stable shape; Signal C: load-bearing decision). Routes each candidate **UP** (into BOSS's
    `library/<cat>/` via `boss learn`) or **DOWN** (into the app's `src/` as a named refactor
    target) or honest **NOT-YET** (the third legitimate answer; recording the *not yet* IS
    the discipline). Writes `docs/extractions/EXTR-NNN-<slug>.md` with full routing record +
    "what didn't make the cut" section. Cohort-aware (returning-founder gets the seasoned
    `"what did you do twice?"` prompt; first-product gets gentler framing; domain-expert
    leans NOT-YET-with-caveats for regulated logic).
  - **New `capture` moment in the conscience** — added to `signalAsContext` in
    `lib/loop-runtime.js`. Voice frame names the inflection in plain language; explicitly
    rejects *"you've been productive!"* reward framing (PRINCIPLE #1 is the discipline, not
    the dopamine). Cohort decides the specific framing.
  - **`EXTR-NNN` ID type added** — `docs/IDS.md` template updates to name it under MVP-mode
    unlocks alongside `FEAT-NNN` / `FIX-NNN` / `BUG-NNN`.
  - **L1-mvp manifest** — now ships 11 skills + 6 loops. `claude-append.md` names `/extract`
    and `extraction-loop` alongside the others; calls out the *"two destinations, not one"*
    framing per PRINCIPLE #1.
- **Eval coverage from the start (closes the v0.27 hole going forward).** `moment-capture.yml`
  ships with 11 cases: should-fire (3, 5 entries; empty extractions/ dir doesn't close); should-
  not-fire (≤2 entries; closed by UP route; closed by NOT-YET route; empty project; empty
  devlog file); Quickstart-shape sanity (no devlog → no fire); multi-loop isolation (all four
  AI-first/extraction loops closed independently). The discipline applied: **no moment ships
  without its evals.**
- **Runner upgrades** — new fixtures: `devlog_3_entries`, `devlog_2_entries`, `devlog_5_entries`,
  `extraction_record_up`, `extraction_record_not_yet`. Loads `moment-capture.yml` in main().
  **Suite count: 83 passed / 0 failed / 41 skipped (124 loaded)** — up from 73/0/41.
- **What v0.29 does NOT do:** auto-recurring extraction-loop (closes after one extraction;
  re-opening requires founder action or future predicate vocabulary with time-aware checks
  like *"N devlog entries since last extraction"*); execute the actual extraction (the skill
  proposes UP/DOWN routes; `boss learn` handles UP execution; refactors are the founder's
  call); LLM-call-out detector (some "is this reusable?" judgments would benefit from an
  external model call, but Claude-running-the-skill IS the LLM-as-judge — keeping it in-
  context is simpler and cheaper).
- **The architectural precedent.** extraction-loop is the **first time-of-work entry**
  pattern. Future loops that need heuristics like "X has accumulated since Y" can reuse this
  shape (count files of one type; gate by absence of files of another type). Documented in
  the loop spec for future authors. Tightens the v0.18 runtime's vocabulary without changing
  the runner.

## 0.28.0 — 2026-05-27

- **`/welcome` — the gentle first-run orientation (closes the v0.19 cohort gap).** The v0.19
  personas pass surfaced that `first-product`, `vibe-coder-newbie`, and `non-tech-founder`
  cohorts bounce off BOSS because the first thing they see is *"drop your PRD."* Power-user
  framing, beginner cohort. v0.28 adds the gentler door: a Quickstart skill that orients in
  ~1 minute, defines terms inline, names the conscience as a *nudge never a block*, surfaces
  override + pause as discoverable affordances, and routes to `/boss` or `/triage` based on
  what the founder is ready for.
- **Cohort-aware depth** — the skill branches on `.boss/config.json` cohort:
  - `first-product` / `vibe-coder-newbie` / `non-tech-founder` / null → **full tour**: what
    BOSS is, what's in the folder, what to do next, how the conscience works, how modes level
    up, where to find help. Each section 2-3 sentences; terms defined inline; plain language.
  - `eng-builder` / `vibe-virtuoso` / `indie-hacker` / `returning-founder` → **30-second
    version**: one paragraph, pointer at `/boss`. *"You probably don't need the tour."* Then
    stops; doesn't elaborate.
  - `domain-expert` → **middle path**: full tour with high-stakes framing inline (privacy-
    first defaults, human-in-the-loop on hallucination, conscience errs toward speaking).
- **Discoverability fix for IDEA-011** — the skill explicitly surfaces `boss conscience pause`
  + the override grammar (*"deviation conscious, recorded, never blocked, never forgotten"*).
  Previously these were documented in CHANGELOG / docs/ideas; now they're surfaced in the
  cohort's first 5 minutes with BOSS. Partial close on IDEA-011 Phase 2's override-
  discoverability sub-gap.
- **Cohort question moved upstream** — `/welcome` asks the cohort question first (when unset),
  before any orientation; `/boss` step 6 stays as the backup path for founders who go
  directly to `/boss`. The cohort persists in `.boss/config.json` for the conscience hook.
- **`boss new` output updated** — the post-scaffold "Next:" block now names BOTH paths:
  `/welcome` for the first-time door, `/boss <idea|PRD>` for the power-user door. Same
  language as CLAUDE.md (template) top.
- **L0-quickstart manifest** — adds `welcome` to the skills list (now 6 skills). No new
  agents, no new loops, no new hooks. Quickstart still ships a tiny agentic footprint.
- **L0 CLAUDE.md (template)** — adds a top-line nudge: *"First time? Run `/welcome` — gentle
  orientation, takes a minute, defines terms inline. Already familiar with BOSS? Skip to
  `/boss <your idea or PRD path>` to spin up."* The first thing a fresh founder reads.
- **End-to-end tested in /tmp** — `boss new welcome-test` → 6 skills land including welcome;
  CLAUDE.md surfaces /welcome at top; 73/73 conscience evals still pass.
- **What v0.28 does NOT do:** auto-trigger `/welcome` on first Claude prompt (the CLAUDE.md
  surfacing is enough; auto-trigger via hook would conflict with cohort `eng-builder` /
  `returning-founder` who explicitly *don't* want it); ship an end-user onboarding flow (that
  was named in IDEA-012 as a separate v0.27+ candidate; this skill is founder-onboarding,
  not end-user-onboarding); add a `/welcome` for V1 / Scale modes (the lift is once, not per-
  mode — re-running in MVP+ is supported but the orientation doesn't change much).

## 0.27.0 — 2026-05-24

- **Conscience evals — closing the discipline-on-the-discipline-tool hole.** Four moments
  (restraint / coherence / cost / failure-mode) had shipped without eval coverage; the brake
  the discipline named (*"43/43 pass"*) was eroding silently. v0.27 closes the three
  hook-emitted ones; restraint is skill-side and stays out of the hook eval suite by design.
  - **`moment-cost.yml`** — 12 cases covering: Anthropic / OpenAI / Vercel AI SDK
    (generateText, streamText) entry detection; partial closure (budget doc alone, logger ref
    alone); full closure; multi-moment co-firing with failure-mode at the first-LLM-call
    inflection; should-not-fire on no-LLM and empty projects.
  - **`moment-failure-mode.yml`** — 8 cases isolating the failure-mode signal (close the cost
    loop to single out failure-mode); covers partial closure (doc alone, handlers alone),
    full closure, and the no-entry case.
  - **`moment-coherence.yml`** — 10 cases covering: className= / styled-components / inline
    style={} entry detection; confidence scaling (3 declarations = low; 12+ = high); partial
    closure (tokens doc alone, refs alone); full closure; under-threshold (2 declarations)
    and no-UI cases.
  - **Runner upgrades:**
    - Loads both L0-quickstart AND L1-mvp loops (L1 loops live in `stages/L1-mvp/template/
      docs/loops/`; previous runner only loaded L0, which is why three moments could ship
      without coverage).
    - **`src_files` / `docs_files` / `other_files` in `project_state`** — materializes
      arbitrary file paths via the new `FIXTURES` registry (`runner.js`). The minimal YAML
      parser doesn't support multi-line scalars, so file content lives in the runner as
      named fixtures: `anthropic_call`, `openai_call`, `vercel_ai_call`, `vercel_ai_stream`,
      `cost_budget_doc`, `cost_logger_ref`, `failure_states_doc`, `failure_handlers_ref`,
      `style_decls_low/high/two`, `style_styled_components`, `style_inline_objects`,
      `design_tokens_doc`, `token_refs`, `no_llm_code`, `empty`.
    - **Multi-moment assertions** — `expected_detection.moments: [cost, failure-mode]`
      asserts set inclusion across the actual signals list (not just the first signal).
      Useful for cases where multiple loops fire simultaneously by design.
    - **Single-moment fallback** — when `expected_detection.moment` is specified, the
      assertion also checks the moments list (not just the first signal), since signal
      ordering is filesystem-dependent.
  - **README updated** — current-cut section names all five tested moments; documents the
    multi-moment format and the FIXTURES registry pattern.
- **Suite count: 73 passed / 0 failed / 41 skipped (114 loaded)** — up from 43/43. The 41
  skipped are unchanged: 20 moment-2 cases that live in `/canvas` skill prompt (no hook
  detector), 6 signal-text evals (separate runner), 15 cases gated on suppress_if / devlog
  awareness / session-state tracking that aren't yet implemented.
- **What v0.27 does NOT do:** sharpen the first-cut wording in any YAML (Ajesh's sharpening
  pass remains pending — flagged in each file's frontmatter); ship a skill-eval runner for
  `spec-loop` / `pretotype-loop` (those are skill-side; need a different runner pattern);
  add a sixth moment for "capture" (PRINCIPLE #1 — gap #1 still on the table; needs an
  LLM-as-judge or heuristic detector design).
- **Why this isn't a feature release:** no skills, agents, loops, or hooks shipped. The
  discipline tightened around what's already shipped. Same shape as v0.24 (positioning
  pass): not the most exciting release, plausibly the highest-leverage one this stretch.

## 0.26.0 — 2026-05-24

- **AI-first product template — BOSS's home turf, made first-class.** The v0.24 positioning
  named BOSS as *"the thinking layer for AI-native founders."* v0.26 ships the concrete
  artifact that earns the name: a conductor skill that walks the founder through the AI-first
  discipline **from day one**, plus the missing piece (failure-states design) that completes
  the spine. Cursor + a folder is "AI-native." BOSS + `/ai-first-init` is *"AI-first with
  discipline from day one."*
  - **`/ai-first-init` skill (L1-mvp)** — the **conductor**. Walks the founder through five
    steps: (1) declare what's AI-mediated → `docs/ai-first.md`; (2) seed structured outputs
    (Liu) → `docs/schemas/`; (3) seed eval set early (Husain) → `/evals --new`; (4) declare
    cost budget upfront → `/ai-cost`; (5) design failure states → `/ai-failure-states`. The
    "from day one" framing: declare the discipline *before* the first AI-mediated FEAT ships,
    not after the first bill / hallucination / refusal.
  - **`/ai-failure-states` skill (L1-mvp)** — the **missing piece**. Walks the founder through
    five guaranteed failure modes (garbage / refusal / hallucination / timeout / cost-spike),
    each with a project-specific declared response + stub fallback handler in code (so the
    discipline is wired before the founder forgets). Writes `docs/ai-failure-states.md`.
    Cohort-aware: `first-product` gets named patterns; `eng-builder` gets the unhandled-path
    angle; **`domain-expert` defaults to human-in-the-loop on hallucination** (no retry-loop
    on medical/legal/financial output).
  - **`ai-failure-state-loop` (L1-mvp, hook-runner)** — entry: ≥1 LLM SDK call site
    (parity with `cost-budget-loop` — the two failure modes always coexist at the
    AI-mediated boundary). Exit: `docs/ai-failure-states.md` exists AND code references at
    least one fallback handler (`handleGarbageResponse` / `handleRefusal` /
    `handleHallucination` / `handleTimeout` / `handleCostSpike` or snake_case Python
    equivalents). New `failure-mode` moment added to `signalAsContext` voice frame.
  - **`/spec` upgrade** — for AI-mediated FEATs, the spec template now includes a **Failure
    states** section alongside the existing evals + validated-learning fields. Names which
    of the five failure states the FEAT must handle + which fallback handler it routes to.
    Acceptance criteria are asked to reference at least one failure-state path.
  - **`/boss` AI-native nudge (L0-quickstart)** — when the founder names the model as
    load-bearing during spin-up (the product doesn't work without it), `/boss` names it
    explicitly back and recommends *"after `boss unlock mvp`, run `/ai-first-init`."* The
    recommendation is the artifact; `/boss` never runs it for the founder.
- **`docs/ai-first.md` as the declaration contract.** Future FEATs read this doc; future
  `/spec` runs reference its cross-reference fields. If the doc says "deterministic" for a
  feature and a PR puts an LLM call in there, that's a real change worth a re-spec —
  promotes design-by-archeology into design-by-declaration.
- **L1-mvp manifest now ships 10 skills + 5 loops + 4 agents.** `claude-append.md` names
  `/ai-first-init`, `/ai-failure-states`, and `ai-failure-state-loop` alongside the others.
- **The lineage cited.** Husain (failure-mode categorization extended from evals → UX), Liu
  (structured outputs as the contract that makes failure-detection mechanical), Karpathy
  (the failure surface IS the design surface — designing the happy path is the easy 20%),
  Mollick (cost-as-design-input continuing from v0.25). No new mentors added; the discipline
  is the existing roster applied to the AI-mediated boundary.
- **Conscience regression-clean.** The new loop lives in L1-mvp; the eval runner only loads
  L0-quickstart loops; no eval fixtures fire `failure-mode`. End-to-end tested in `/tmp`:
  fresh project → `boss unlock mvp` → drop LLM SDK call in `src/` → hook fires BOTH `cost`
  AND `failure-mode` simultaneously (the two loops share entry but track different exits).

## 0.25.0 — 2026-05-24

- **AI cost discipline — the universal-cohort feature lands.** Per IDEA-012's persona overlay,
  AI cost was the only candidate every cohort cared about. Now it's first-class in MVP mode:
  the founder gets nudged to declare the bill at the first LLM SDK call, not after the first
  surprise invoice.
  - **`/ai-cost` skill (L1-mvp)** — walks the founder through declaring `docs/ai-cost-budget.md`
    (per-user/day + monthly cap + model rationale + review cadence + breach grammar), suggests
    a ~30-line cost-logger wrapper (TypeScript + Python examples) writing to
    `.boss/cost-log.jsonl`, and surfaces mentor handoffs (`mentor-architect` for cost-shape →
    architecture; `mentor-business` for cost-per-user → pricing). **Cohort-aware defaults:**
    `first-product` $5/user/day strict; `vibe-virtuoso` inspect-only; `eng-builder` BYO;
    `indie-hacker` cost-as-%-of-revenue framing; `domain-expert` $20/user/day + **privacy-
    first logging (no PII, no prompt body)** + regulatory caveats; etc. The founder edits to
    fit the bet; the cohort sets the starting frame.
  - **`cost-budget-loop` (L1-mvp, hook-runner)** — entry: `src/**` contains ≥1 LLM SDK call
    site (regex covers `anthropic` / `@anthropic-ai/sdk` / `openai` / `OpenAI(` / `Anthropic(` /
    `messages.create` / `chat.completions.create` / Vercel AI SDK `generateText` /
    `streamText`); exit: `docs/ai-cost-budget.md` exists AND code references the logger
    wrapper (≥1 occurrence). Threshold of 1 (not 3 like design-tokens-loop) because cost
    discipline is **deontic at the first call** — there's no "exploratory" version of token
    spend. The first call hits a real billing meter.
  - **New `cost` moment in the conscience** — added to `signalAsContext` in
    `lib/loop-runtime.js`. Voice frame: name the bill exists in one line (cohort decides the
    framing — first-product wants a number, vibe-virtuoso wants the inspect affordance,
    domain-expert wants the privacy posture), point at `/ai-cost`, hand the decision back.
    Never blocks. Override via devlog per IDEA-008.
  - **`.gitignore`** updated to exclude `.boss/cost-log.jsonl` (local ledger; ship to a real
    datastore when you have real users — the skill's review-cadence step says so).
  - **L1-mvp manifest** now ships 8 skills + 4 loops + same 4 agents. `claude-append.md`
    names the new skill and loop alongside the others.
- **Pairs (not auto-invoked) with two existing mentors.** The handoff lines in `/ai-cost`:
  *"`mentor-architect`, the cost shape says X — what architecture decisions does that imply?"*
  and *"`mentor-business`, our cost-per-active-user is X; what should the pricing carry?"*
  Cost discipline is the load-bearing connector between architecture (caching, batching,
  cheaper-fallback) and business (unit economics, willingness-to-pay).
- **The discipline reads as Husain-applied-to-spend.** *"Almost all AI cost problems are
  visible in the ledger, and almost no one keeps one."* Liu cited for structured-outputs-as-
  cost-lever; Mollick for cost-as-design-input. No new mentor or practitioner added — just the
  application of existing discipline to a different artifact.
- **What v0.25 does NOT do:** auto-instrument the user's code (judgment call: the founder
  knows their call sites better; the skill *suggests* the wrapper, doesn't write it). Auto-
  detect non-mainstream SDKs (LangChain wrappers, Replicate, Cohere, Bedrock). Ship a budget-
  enforcement layer (this is a *nudge*, never a gate — IDEA-011 discipline applies).
- **Conscience regression-clean.** Existing 43/43 conscience evals still pass — the new loop
  lives in L1-mvp, the eval runner only loads L0-quickstart loops, so the new moment has no
  way to fire against the existing eval fixtures. End-to-end tested in `/tmp`.

## 0.24.0 — 2026-05-23

- **Positioning pass — first non-feature release in BOSS's history.** The deliverable is *the
  thinking* (positioning + README edit), not code. Per IDEA-012's revised roadmap, v0.24 was
  explicitly the positioning pass, not a feature release. The Dunford exercise was first
  recommended in the v0.15 advisory pass and deferred through 8 capability releases; finally
  executed.
- **Output:** [`docs/dossier/positioning-pass-001.md`](docs/dossier/positioning-pass-001.md) —
  full Dunford exercise: target cohort (the founder using Cursor/Claude Code 3+ months with
  2+ unfinished projects), 8 competitive alternatives, 8 unique attributes that survive
  scrutiny, attributes mapped to value, 7 market-frame options, **8 candidate killer one-
  sentences stranger-tested**, 8 cohort-tailored variants per persona, the trend layer
  (*AI raised the speed limit; almost nothing raised the discipline limit*), 6 decisions to
  act on, downstream consequences.
- **Decisions on the record:**
  - **Lead sentence (elevator):** *"BOSS is the just-in-time conscience for AI-native
    founders. Pause it any time."* (13 words; killer for verbal intros.)
  - **README opening sentence:** *"For founders building with AI — the thinking layer that
    nudges when you're drifting and pauses on command. No growth-hacking pressure. Override-
    friendly."* (22 words; killer for the README + landing-page hero.)
  - **Category frame:** *"the thinking layer for AI-native founders"* — drops "incubator" as
    the primary descriptor because it reads YC-shaped to strangers. "Incubator" stays valid
    as a secondary descriptor.
  - **Cohort-tailored variants:** 8 versions (one per persona archetype). Pattern: cohort-
    naming first phrase + feature-that-lands-hardest second.
  - **What BOSS doesn't compete on, named explicitly:** code generation (Lovable / v0 / Bolt).
    BOSS is *complementary* to those — a founder could use Lovable to scaffold the app + BOSS
    to scaffold the thinking about it.
- **README updated** — the TL;DR replaced with the v0.24 positioning. Old: *"a just-in-time
  incubator for AI-native projects."* New: the candidate #8 framing above.
- **What this positioning is NOT** (recorded in the dossier):
  - Not validated (synthetic-tested only until real founder reads + articulates back)
  - Not permanent (evolves with the product)
  - Not the only frame BOSS could use (picked AI-native-founder audience; the anti-VC
    indie-hacker frame is a legitimate secondary positioning that could split into its own
    surface later)
- **Discipline applied to BOSS itself:** the Dunford exercise was on the record since v0.15.
  Eight releases of capability shipped before it landed. The positioning pass finally
  shipping is the discipline-on-the-discipline-tool move applied again — *not the most
  exciting release; probably the highest-leverage one in months*.

## 0.23.0 — 2026-05-23

- **Conscience pause primitive — the discipline-on-the-discipline-tool move (IDEA-011
  Phase 1).** Single-purpose release. Closes the canvas R&H #1 gap operationally: the founder
  can now silence the conscience for a bounded session without having to edit settings.json
  or rip out hooks. The four other items originally queued for v0.23 (Scale mode authoring,
  moment #3 detector, PostToolUse hook plumbing, IDEA-010 Phase 4 `/design-prompt`) are
  deferred to v0.24+ — see RESUME's restructured roadmap. **Discipline applied to BOSS
  itself: ship only the one most-load-bearing thing in a release that *could* have been
  bigger.**
  - **`boss conscience pause [--for 8h | --until-resume] [--reason "..."]`** — records a
    pause in `.boss/config.json`'s `conscience` block: `{ mode, since, expires, reason }`.
    Default duration: 8h (a build session). `--until-resume` for indefinite pauses.
  - **`boss conscience resume`** — explicit un-pause. Also happens automatically when the
    recorded expiry passes (the hook auto-clears the state).
  - **Hook reads pause state FIRST.** When `mode: paused` and `expires > now` → exit silent.
    When `mode: paused` and `expires <= now` → call `clearPauseState` and continue normally.
    The auto-resume IS the kindness; no special "your pause expired" signal (would be
    performative noise; IDEA-011 explicitly chose silent auto-resume).
  - **`boss status --conscience` surfaces pause state prominently** — at the TOP of the
    output, marked with `⏸ PAUSED`, showing since/expires/reason. When expired but not yet
    auto-cleared, shows `⏸ PAUSED (EXPIRED — will auto-resume on next prompt)`.
  - **Help text updated** to include the new commands.
  - **`readPauseState` + `clearPauseState`** added to `lib/loop-runtime.js` (template) —
    the canonical version. BOSS's CLI imports from there so there's one source of truth.
- **The architectural principle the pause demonstrates** (worth naming): **fractal-consistent
  override discipline.** The same IDEA-008 grammar applied at two scales — per-loop overrides
  in devlog (micro), and whole-conscience pause in config (macro). Same shape: deviation
  conscious, recorded, never blocked, never forgotten (auto-resume is the kindness). Same
  recipe, different scope. *Not novel as a pattern* (Focus modes are OS-level table stakes);
  *worth claiming if anything* as the fractal-consistent application — Phase 3 externalization
  may turn this into a publishable practice if BOSS gets used on > 1 project.
- **End-to-end tested in /tmp — 5 flows verified:**
  1. Baseline drifted state → hook fires (`caution low`)
  2. `boss conscience pause --for 8h --reason ...` → state recorded
  3. Hook fires after pause → silent ✓
  4. `boss status --conscience` → shows ⏸ PAUSED prominently with since/expires/reason
  5. `boss conscience resume` → hook fires again next prompt ✓
  Plus expired-auto-clear: hook reads expired pause → clears it → emits signal normally next
  prompt; config returns to `{ mode: 'active' }`.
- **43/43 evals regression-clean.**
- **Why a release for one feature?** Because it's the right discipline applied to BOSS itself.
  The other four queued v0.23 items are real and queued for v0.24+. The pause primitive's
  ratio of "leverage : code-size" is the highest of anything left in the roadmap (~50 lines
  of code + tests; closes the canvas R&H #1 gap directly). MVP discipline: minimum experiment
  that produces validated learning. Validated learning here: *did the pause primitive
  actually make BOSS feel nimble?* Founder using BOSS to do an all-night build will tell us.

## 0.22.0 — 2026-05-23

- **V1 mode authored — `boss unlock v1` works for real.** The third major mode arrives. Same
  playbook as MVP authoring (v0.14.0): manifest + template + claude-append + agents + skills +
  loops. V1 is the *real shippable release* mode — design layer turns on, the second-tier
  mentors arrive, data shape becomes a first-class decision, and a cross-FEAT sequencing
  surface appears.
  - **3 new builder agents:**
    - `ui-designer` — token + visual authority. Reads `DESIGN_TOKENS.md` as truth; refuses raw
      hex; three-layer architecture enforced (primitives → semantic → component). Cites Brad
      Frost (Atomic Design), Nathan Curtis (layer-cake), Jina Anne (W3C DTCG), Diana Mounter
      (Primer), Aarron Walter (emotional design). Holds the WCAG AA floor.
    - `ux-designer` — flow + state + interaction authority. **5-state requirement** non-
      optional (default / hover / active / disabled / empty + loading + error). Nielsen 10
      heuristics; Krug clarity; Norman affordances; Luke Wroblewski forms; Christopher
      Noessel for agentive patterns; Erika Hall for just-enough-research.
    - `db-architect` — schema + data-shape authority. Schema before code, even solo. Cites
      Codd, Date, Stonebraker, Kleppmann + AI-native data voices (Liu structured outputs,
      Husain data quality, Huyen production). Flags AI-data failure modes (unstructured-LLM-
      output in control flow; hallucinated-data pollution; eval-data-isn't-user-data).
  - **4 template mentor copies** (promoted from BOSS-local v0.15.0 to scaffolded-project
    templates — `{{PROJECT_NAME}}` / `{{MODE}}` placeholders): `mentor-business`,
    `mentor-fundraising`, `mentor-pitch`, `mentor-talent`. Same source practitioners as the
    BOSS-local versions; phrased to coach the founder of a generic scaffolded project. All
    advisory; never binding legal/financial/medical. Default position for mentor-fundraising
    + mentor-talent: *don't raise / don't hire yet, possibly never*.
  - **3 new skills:**
    - `/board` — cross-FEAT sequencing surface. Live read computed from FEAT frontmatter +
      smoke/evals state + override entries. Flags: `--next`, `--blocked`, `--by-cohort`,
      `--deferred`, `--evals`. Owned by `program-manager`.
    - `/design-review` — before-code design review. Runs `ui-designer` (token + visual) + 
      `ux-designer` (flows + 5 states) sequentially against the proposed UI. Reads tokens
      file, style guide, canvas Promises cell. Outputs concrete diffs. Cohort-aware delivery.
    - `/ux-check` — after-code UX review. Walks the *shipped* experience (not the spec),
      checks states are real, runs accessibility heuristics, applies AI-specific UX where
      relevant. Pairs with `/design-review`.
  - **1 new loop:** `design-drift-loop` (V1-stage, runner_type: hook). The V1-stage counterpart
    to MVP's `design-tokens-loop` — gates *whether tokens are still authoritative*, not just
    *whether they exist*. **Subtle pattern worth naming:** this loop's exit predicate is the
    *bad signal* (≥1 raw hex code in code, excluding the tokens file) — the loop is
    "drift-emitting" when the bad signal is present. The IDEA-008 primitive supports this
    without modification. Emits the `coherence` moment (introduced v0.21).
  - **L2-v1 manifest** declares 7 agents + 3 skills + 1 loop; `boss sync` carries them via the
    managed-file kinds (agent, skill, loop). `.boss` stamp tracks them. claude-append.md
    reads as a clean V1-working-rules catalog.
- **End-to-end tested in /tmp:** `boss new` → `boss unlock mvp` → `boss unlock v1` lands all
  three modes' files cleanly. Final stamp: 14 agents + 15 skills + 6 loops + 1 hook + 3
  installed layers. `boss status --conscience` shows all 6 loops in correct states on a fresh
  project. 43/43 evals still pass (regression-clean).
- **Deferred to v0.23:** moment #3 (capture — reusable value at breakpoint, needs LLM-as-judge
  or heuristic detector — not predicate-based); PostToolUse hook for hardcoded-style detection
  (new hook-type plumbing — its own concern); Scale mode authoring (mentor-humane template
  promotion, PM org, code-health, product council); `/design-prompt` skill or fold into
  `/design-review`.

## 0.21.0 — 2026-05-23

- **MVP discipline upgrades + IDEA-010 Phase 2 (design-tokens-loop) — all in one release.**
  Three new skills, three new loops, one upgraded skill, moment #4 (restraint) lands skill-side.
  Moment #3 (capture — reusable value at breakpoint) deferred to v0.22 — it needs a different
  detector design (predicate evaluation doesn't fit "noticing this artifact is more general
  than its loop").
  - **`/spec` upgraded** (the smallest cut, highest leverage per the v1 playbook):
    - Adds **validated-learning field** (Ries, *The Lean Startup*): "If this FEAT works
      perfectly, what do we learn?" If the answer is "users like it" or "the feature works,"
      don't build it. The MVP is the minimum experiment that produces validated learning, not
      the minimum product to polish.
    - Adds **evals field** (Husain): when a FEAT puts an LLM in control flow, the eval set
      lives at `docs/evals/FEAT-NNN.yml`. Schema'd output (Liu) strongly recommended.
    - **Moment #4 restraint check** (IDEA-008's collapsed-moments architecture): `/spec`
      reads canvas-loop state before creating a FEAT spec; if canvas-loop isn't closed for
      the active idea, the skill surfaces a Fitzpatrick-plain restraint nudge (cohort-aware
      via v0.20's framing). Override grammar lives in devlog. Never blocks; always records.
  - **`/evals` skill (new)** — Husain discipline as a first-class MVP skill paired with
    `/smoke`. Smoke answers "is it alive"; evals answers "is it correct." Eval set first
    (20 cases beats 0). Failure modes categorized by mode (Husain: failure modes are more
    valuable than success modes). Structured outputs recommended (Liu: Pydantic-first).
    Cites Husain + Liu + LLM-as-judge caveats.
  - **`/pretotype` skill (new)** — Savoia's discipline as a first-class MVP skill. The
    demand-test between `/canvas` and `/spec` — "make sure you're building the right It
    before building It right." Six patterns named (fake door / WoZ / Mechanical Turk /
    Pinocchio / YouTube test / impresario). The TRI metric (tangible / real-time /
    imminent). Threshold-before-running (Ries pivot discipline). YODA (your-own-data >
    anything).
  - **`/design-tokens-init` skill (new)** — IDEA-010 Phase 2. Scaffolds the three-layer
    token system at the first-UI-commit inflection. **Cohort-aware delivery** (v0.20's
    framing): vibe-coder-newbie gets SHOWING; eng-builder gets OFFERING; vibe-virtuoso gets
    OVERRIDE-FRIENDLY; first-product gets DEFINE-TERMS; indie-hacker gets RIGHT-SIZED;
    returning-founder gets SKIP-THE-101; non-tech-founder + domain-expert get PLAIN-
    LANGUAGE-COACH; unspecified gets neutral. The three-layer architecture (primitives →
    semantic → component) is Curtis's layer-cake; the AI-tolerance argument is that
    two-layer systems are fragile under AI generation (the field's consensus). Reads canvas
    Promises cell to brand-anchor the primitives (prevents the brand-default problem from
    IDEA-010).
  - **Three new MVP-stage loops** on the v0.18 generic loop primitive:
    - `spec-loop` (runner_type: skill) — encodes moment #4 restraint. Entry: canvas-loop
      closed for some active idea. Exit: `FEAT-NNN-<slug>.md` exists. `/spec` is the
      detector + runner.
    - `pretotype-loop` (runner_type: skill) — structural by default (no drift_moment to
      avoid over-firing). Records that demand-testing happened before significant build.
      `/pretotype` is the runner.
    - `design-tokens-loop` (runner_type: hook) — JIT, *only opens once UI starts
      accumulating* (≥3 style declarations across src/). Drift moment: **`coherence`**
      (new — system-vs-code drift; a flavor of caution specific to design-system mismatch).
      Stack-agnostic regex catches common React/Vue/Svelte/Solid patterns; founders can
      edit the spec for their stack.
- **L1-mvp manifest** declares the new 3 skills + 3 loops; `boss sync` carries them; `.boss`
  stamp tracks them. The `claude-append.md` reads as a clean catalog of what MVP offers.
- **End-to-end tested in /tmp:** scaffold → unlock mvp → all 7 skills + 5 loops land + stamp
  merges correctly + status --conscience shows the 5 loops in their right states (capture
  open-structural, canvas/spec/pretotype/design-tokens all unopenable on a fresh project, no
  spurious hook fires). 43/43 evals still pass (regression-clean).
- **Deferred to v0.22:** moment #3 (capture — reusable value at breakpoint), V1 mode authoring
  including the design-drift-loop (IDEA-010 Phase 3) + ui-designer + ux-designer agents +
  /design-review + /ux-check + PostToolUse hook for hardcoded-style detection.

## 0.20.0 — 2026-05-23

- **The three design changes from v0.19's persona-reactions pass — landed.** Closes the loop on
  the reactions: the personas flagged it, v0.20 shipped it. Moments #3 + #4 (the other v0.20
  candidates per the published roadmap) deferred to v0.21 — they need their own design pass
  (moment #3's "reusable value at breakpoint" detection is harder than predicate evaluation;
  moment #4's "premature ceremony" needs `/spec`-skill-aware detection plus a spec-loop). The
  three things shipping in v0.20 are the *persona-driven* design changes; the moment work is a
  separate concern.
  - **`boss status --conscience`** — the inspect affordance (asked-for by `eng-builder`,
    `indie-hacker`, `vibe-virtuoso` personas in the v0.19 reactions doc). Loads
    `docs/loops/*.md`, classifies each loop (open / closed / unopenable), shows what would
    close the open ones (concrete predicate evidence: count/threshold, file matches, what's
    missing), reads recent override entries from `docs/devlog.md` per IDEA-008's grammar,
    shows the project's declared cohort. New `src/conscience.js` module formats the output;
    the loop runtime is imported from the canonical Quickstart-template path so there's one
    source of truth.
  - **Cohort-aware conscience** — `.boss/config.json` carries an optional `cohort` field
    (one of: vibe-coder-newbie | eng-builder | non-tech-founder | first-product |
    vibe-virtuoso | indie-hacker | returning-founder | domain-expert | null). The
    `loop-runtime.js`'s `composeContext` now reads the cohort and appends a **cohort framing
    directive** to `additionalContext` — same signal, different voice. Each cohort gets a
    distinct framing sentence: first-product needs *teaching*; returning-founder wants a
    *harder cohort-aware question*; vibe-virtuoso gets *friction over praise*; indie-hacker
    gets *plain Fitzpatrick language, not jargon*. The `/boss` spin-up skill now asks
    one optional question to set the cohort; user can always edit `.boss/config.json` later.
  - **Voice lineage decision: Fitzpatrick consistently.** The indie-hacker persona caught
    that the prior conscience voice mixed Fitzpatrick ("who would you ask first") with
    Maurya ("riskiest assumption" / "riskiest bet") in one breath. v0.20 picks Fitzpatrick-
    plain ("what they'd want to learn"; "who they'd ask first") consistently. Updates the
    `/triage` skill's exemplar text + the `composeContext` framing in `loop-runtime.js`. The
    canvas itself still uses "riskiest assumption" (that's the canvas's frame, established);
    the *conscience nudge* now speaks Fitzpatrick.
- **Test coverage:** 43/43 evals still pass (regression-clean). End-to-end test in /tmp
  verified: fresh project → capture-loop open (no signal, structural); 3 captures + no canvas →
  canvas-loop drifts, hook fires with cohort framing in additionalContext; override in devlog →
  appears in `boss status --conscience` output.
- **What's NOT in v0.20** (now queued for v0.21): conscience moments #3 (capture — reusable
  value) and #4 (restraint — premature ceremony). Moment #3 needs a different detector design
  (predicate evaluation doesn't fit "noticing this artifact is generalizable"). Moment #4
  needs a spec-loop authored AND skill-aware detection in `/spec`. Both warrant their own
  release.

## 0.19.0 — 2026-05-23

- **Proto-personas layer + first reactions pass — the founder-experience eval channel.** 8
  synthetic-founder agents now seated in BOSS's `.claude/agents/` with `persona-` prefix
  (parallel to `mentor-`, parallel to the builder team). They REACT to BOSS features (not
  advise, not mentor) so BOSS gets cheap pre-filter signal on how it lands across cohorts
  *before* spending the expensive real-founder Mom Test call (which remains explicitly
  overridden per advisory-pass #1; the override's re-open condition includes "persona
  reactions surface a coherent product story" — this layer is how that signal arrives).
  - The 8 personas: `vibe-coder-newbie` (no eng/startup background, picked up Cursor 3-6
    months ago), `eng-builder` (10+ years eng, first-time founder, skeptical of magic),
    `non-tech-founder` (deep domain expertise, can't code, AI is the bridge),
    `first-product` (absolute beginner — to building, to vibe coding, to everything),
    `vibe-virtuoso` (50+ shipped projects, zero sustained products, expert at idea-to-demo,
    bad at company-building), `indie-hacker` (right-sized lens — Walling/Fried/Jarvis;
    anti-VC; suspicious of venture-shaped language), `returning-founder` (has shipped before;
    intolerant of 101 content; wants depth), `domain-expert` (medical/legal/financial;
    stakes are real; humane lens applies hard).
  - **`persona-reactions-loop`** authored in `docs/loops/` — captures the discipline (runner_
    type: manual; uses the v0.18 loop primitive). Entry: persona agents exist. Exit: a
    `docs/dossier/persona-reactions/<feature>.md` doc with structured reactions + synthesis +
    design changes + real-founder questions the reactions sharpen.
  - **First reactions pass complete** at
    [`docs/dossier/persona-reactions/conscience-moment-1.md`](docs/dossier/persona-reactions/conscience-moment-1.md).
    All 8 personas reacting to the conscience moment-1 firing scenario.
  - **Three concrete design changes the reactions argue for** (ordered, with priorities):
    1. **Cohort-aware conscience** — the model composing the conscience voice should know what
       cohort the founder is in (`.boss/config.json` declares it, set by `/boss` during
       scaffold). First-product needs *teaching*; returning-founder needs *a harder
       question*; vibe-virtuoso needs *sharper architecture*. Same signal; different voice.
    2. **Inspect affordance** — `boss status --conscience` or `boss conscience --explain` so
       humans can see what loops are open / what would close them / what overrides exist.
       Engineers + indie-hackers + vibe-virtuosos all asked for this. Plausibly v0.20
       alongside moments #3/#4.
    3. **Pick the lineage in the conscience voice** — current voice mixes Fitzpatrick
       (talk-to-someone) and Maurya (riskiest-assumption) in one breath. Indie-hacker caught
       this; the eval set didn't. Lean one direction consistently.
  - **Three real-founder interview questions** the reactions sharpen for the eventual call:
    (1) read-aloud comprehension test; (2) curious-vs-defensive-vs-confused for first-timer
    cohort; (3) cohort-aware variant test for returning-founder cohort.
  - **Two surprises from the reactions** that hadn't surfaced via any other discipline:
    returning-founder wants a HARDER question, not a softer one (suggesting cohort-aware
    direction); indie-hacker noticed the voice-fights-itself issue (Fitzpatrick vs Maurya
    lineage mix) that 84 eval examples missed. **Argument for routine persona-eval passes on
    every user-facing text.**
- **Roadmap status:** v0.17 (builder team) + v0.18 (loop primitive) + v0.19 (personas) all
  shipped this push. Next up: v0.20 (moments #3+#4 via the generic detector, leveraging the
  v0.19 reactions for cohort-aware language) + v0.21 (MVP discipline upgrades).

## 0.18.0 — 2026-05-22

- **IDEA-008 → FEAT-001: generic loop runtime in Node; bash hook retired.** The biggest
  architectural release since v0.8.0 (learning loop). The conscience hook used to be hand-coded
  bash with a single hard-wired detector for moment-1. It's now a generic Node runtime that
  reads `docs/loops/*.md` from the project, evaluates entry/exit predicates, and emits
  structured signals — *any* loop drifting fires *its* moment, no per-moment code. Moments
  #3 and #4 will be authored as loops (not detectors) in v0.20.
  - **`conscience.js`** (replaces `conscience.sh`) — zero-dep Node, ~50 lines. Loads loops,
    classifies state, composes signals, prints JSON. Fails silent — never blocks a prompt.
  - **`lib/loop-runtime.js`** — the engine. Loads loops from `docs/loops/*.md`, evaluates a
    closed predicate vocabulary (`exists`, `count_at_least`, `any_file_matches`) against the
    live filesystem, classifies each loop as `unopenable | open | closed`, returns structured
    signals only for hook-runner loops with a `drift_moment`. Loops without `drift_moment` are
    *structural* (express dependencies but don't drift — caught the over-fires-on-fresh-project
    bug live during the build; capture-loop is the canonical structural loop).
  - **`lib/yaml.js`** — zero-dep YAML parser lifted from the eval runner so the same code parses
    loop specs at hook time and eval examples at test time.
  - **Two named loops authored** in the Quickstart template (`docs/loops/`):
    - `capture-loop` — structural; expresses "at least one captured idea exists." Downstream
      loops (canvas-loop) check this via their own entry predicates.
    - `canvas-loop` — encodes moment-1's full logic *declaratively* via predicates. Entry: ≥3
      dated capture-log entries across active (non-dropped) idea files. Exit: at least one
      canvas tied to an active idea has a real (≥3-char alphanumeric) riskiest assumption.
      Drift = open + not closed = moment-1 caution. The hand-coded bash logic is now expressed
      in YAML.
  - **`manifest.json` gains a `loops` array.** `src/scaffold.js` + `src/sync.js` handle loops
    as a new managed-file kind (`kind: loop`, `rel: docs/loops/<name>.md`). Hook-library files
    (`lib/*.js`) auto-discovered from the template and synced alongside the hook script. The
    `.boss` stamp tracks `loops` (alongside agents/skills/hooks).
  - **`runner_type` field on loop specs** — resolves the moment-2 shape question from v0.16's
    meta-learnings. Today only `hook` is honored by the conscience runtime; `skill`, `manual`,
    `external` will be honored by future runners (skill-prompt eval, manual review, external
    detector — e.g. CI).
  - **Settings migration (bash → node).** Existing projects pinned at <= 0.13.0 have
    `bash …conscience.sh` in their settings.json. The merge logic now applies hook-command
    *migrations* before the additive merge: it drops stale bash entries before adding the new
    node entry. Tested with a synthetic pre-0.18 project: bash entry dropped, node entry added,
    user's permissions preserved, idempotent on re-sync.
  - **Eval set unchanged; 43/43 still pass against the generic runtime** (regression-coverage
    in place). The runner now invokes `node conscience.js`, materializes `docs/loops/` into
    the test project before each example (so the runtime has loops to load), and the existing
    examples test the *generic detector* end-to-end. One bug found during the build (POSIX
    regex char classes — `[[:space:]]` doesn't work in JS) fixed by switching loop specs to
    JS-native regex (`\s+`, `[a-zA-Z0-9]{3,}`). Eval-first discipline catching itself.
  - **BOSS dogfoods:** `docs/loops/capture-loop.md` + `docs/loops/canvas-loop.md` now live in
    BOSS itself (alongside the existing `docs/loops/eval.md`). BOSS-the-project runs the same
    runtime against its own state.
  - **Verdict on the primitive (from v0.16's meta-learnings): confirmed under contact with
    real Node implementation.** The four-field shape (entry / purpose / exit / drift) held up.
    Predicate vocabulary covered everything moment-1 needed declaratively. The structural-loop
    pattern (no `drift_moment`) handles dependencies-only cases cleanly. Net code change:
    `conscience.sh` (40 lines bash) replaced by `conscience.js` + `lib/` (~250 lines Node) —
    bigger surface, but moments #3+ will be loop specs (~30 lines YAML each), not new detectors.

## 0.17.0 — 2026-05-22

- **Builder team seated alongside the mentor board.** Three new builder agents in BOSS's own
  `.claude/agents/` — they make BOSS *feel right*, parallel to the mentor board which makes
  BOSS *be right*. Builders, not mentors: they propose concrete diffs, not advice. Cover the
  interaction-design layer that wasn't covered by either the mentor board or the existing builder
  agents (pm, coder-generalist, tester, program-manager).
  - **`designer`** — owns the UX of the entire BOSS interaction experience. Not "the visual
    designer" (BOSS is a CLI + Claude Code experience, not a webapp). Owns: when BOSS speaks vs
    stays quiet, what a skill *feels* like when run, the rhythm of mode unlocks, the surprise
    vs predictability of conscience moments, what the founder is being asked to *do* vs read at
    every step. Sources: Norman, Krug, Nielsen, Spool, Wroblewski, Walter + AI-specific UX
    heuristics (options-not-truth; visible confidence; deliberate failure states).
  - **`voice-keeper`** — guards what BOSS *sounds like*. Reviews skill text, agent system
    prompts, hook signal language, README, CHANGELOG, error messages. Catches performed warmth,
    scolding tone, voice-mode bleed, framework-jargon leaking into user-facing text, assumed
    knowledge, hedging. Proposes concrete edits side-by-side. Inward-facing language guardian.
    Sources: `boss-voice` memory (canonical spec), Strunk & White, Raskin + Neumeier (pitch =
    product voice), Godin (write to one person).
  - **`prompt-coach`** — helps the founder write better prompts (to BOSS, to Claude, to AI in
    general) and teaches the craft over time. Outward-facing counterpart to voice-keeper.
    Builds a per-founder pattern library in `docs/dossier/founder-prompt-patterns.md`. Catches
    vague / multi-prompt / missing-constraint / missing-output-format / leading-question /
    missing-context / wrong-role-assignment / stop-word-missing failure modes. Sources:
    Karpathy (think in distributions), Mollick (AI-as-different-roles), Willison (prompt-as-
    code), Liu (Pydantic-first), Husain (look at the output), Fitzpatrick (Mom Test discipline
    applied to interview prompts).
- **Advisory-pass #1 (real-founder Mom Test calls) explicitly overridden — first real use of
  IDEA-008's override grammar.** Ajesh's call: at zero users + product still defining its shape,
  expensive real-founder calls are premature; cheap synthetic signal from proto-personas (v0.19
  work) is the right move now. Override recorded in `docs/dossier/boss-advisory-pass-001.md`
  with explicit re-open conditions (persona reactions surface a coherent product story, OR a
  non-Ajesh user starts using BOSS in earnest, OR the eval set catches something only real-
  founder feedback could surface). The recommendation isn't deleted — it's deferred under the
  IDEA-008 contract: deviation made conscious, recorded, re-openable.
- **Roadmap published** (in RESUME): v0.17 builder team → v0.18 generic loop primitive (IDEA-008
  to FEAT) → v0.19 proto-personas as named loops → v0.20+ moments #3/#4 + MVP discipline
  upgrades + V1/Scale mode authoring + IDEA-003 finish + externalization + backlog. Ten releases
  sequenced for build-on-build; the discipline rails (evals, structured output, loops, personas)
  make each one buildable in a focused session.

## 0.16.0 — 2026-05-22

- **The eval-loop closed — conscience now has evals + structured output (proves IDEA-008's
  primitive on its first real run).** Two ladders climbed at once: produced the conscience eval
  set (the artifact the advisory pass / playbook said BOSS most needed) AND validated the loop
  primitive from IDEA-008 by running ONE loop end-to-end. Both succeeded.
  - **84 labeled eval examples** (43 moment-1 caution + 41 moment-2 Done!) in
    `docs/architecture/conscience-evals/{moment-1-caution,moment-2-done}.yml`. Should-fire +
    categorized should-NOT-fire entries (failure_mode taxonomy per Husain's discipline:
    `over-fires-on-fresh-project`, `fires-mid-other-work`, `repeats-itself`, `shame-toned`,
    `false-positive-canvas-exists`, `false-positive-not-drift`, `acknowledged-already`,
    `fires-too-early`, `performed-warmth`, `removes-agency`, `riskiest-assumption-stale`,
    `triggered-by-trivial-change`). Each example has structured `project_state` (the synthetic
    docs/ideas/ tree the runner builds in a temp dir) + `expected_detection`.
  - **Zero-dep Node runner** at `docs/architecture/conscience-evals/runner.js` — includes a
    minimal YAML parser for the subset our eval files use (so the data stays human-readable
    without breaking the zero-dep rule). Constructs synthetic state, invokes the actual hook,
    parses output, asserts. Reports per-example + a categorized summary table.
  - **Hook refactored to structured output** (Liu's discipline): now ships
    `{moment, confidence, evidence: {capture_count, canvases_with_filled_assumption,
    active_idea_count}, suppress_if}` in addition to the `additionalContext` string. Model still
    composes the voice; hook ships a schema.
  - **3 real bugs caught and fixed by the eval set itself** (Husain's "look at your data"
    discipline in action):
    1. Single-char placeholders like `?` slipped through the riskiest-assumption regex.
       Tightened to require ≥3 alphanumeric chars (rejects `?`, `??`, `_TBD_`, empty, etc.).
    2. Hook counted captures across *all* ideas — including `status: dropped`. Drift signal
       from already-walked-away ideas is meaningless. Hook now filters active vs. dropped.
    3. Filled canvases on dropped ideas were stopping the "validated" check. Same fix:
       active-status filtering on canvas checks too.
  - **Runner results: 43/43 pass on every runnable case. 41 skipped as categorized future-work**
    (moment-2 lives in `/canvas` skill prompt not a hook; suppress_if cases need session-state /
    devlog awareness; signal-text violations need a separate runner — all explicitly tracked).
  - **IDEA-008 primitive verdict — ready to promote to FEAT.** The four-field shape (entry,
    purpose, exit, drift) held up. The predicate vocabulary (`exists`, `contains`,
    `count_at_least`, `recorded_at`) survived contact with reality. Multi-part exit artifacts
    work. Skip-with-reason is the right runner pattern. ~half of examples test future features
    (suppress_if + devlog + skill-based detection), which is the right ratio — the eval set
    is forward-looking, not just current-implementation snapshot. One real shape-question
    surfaced (moment-2 isn't hook-detected — argues for a `runner_type` field on loop specs).
  - First loop authored: `docs/loops/eval.md` — the eval-loop spec using the four-field primitive
    with predicates in YAML frontmatter. The template for every future loop.

## 0.15.0 — 2026-05-22

- **BOSS now has its full mentor board seated, and the board has had its first session on BOSS
  itself.** Step back before the next build axis: identify and instantiate all the experts we'd
  want consulting on how to build an AI-native MVP right, then have them actually review BOSS.
  - **8 mentor agents live in this repo's `.claude/agents/`** (BOSS-local; the project-as-its-own-
    founder): `mentor-venture` (cornerstone), `mentor-architect`, `mentor-gtm` (the three that
    already existed in stage templates, now BOSS-tuned), plus 5 new: `mentor-business`,
    `mentor-fundraising`, `mentor-pitch`, `mentor-talent`, `mentor-humane`. Each cites the
    practitioners from `docs/mentor-practitioners.md` it draws on — no agent impersonates a
    person; mentors cite named practices (per the encoding decision in `docs/MENTORS.md`).
  - **`mentor-humane` carries explicit override authority** when a humane concern is on the table
    — the conscience's conscience. Seated from day one despite the Scale-level slot in the
    roster, because BOSS itself is the special case (it has to *be* humane in its construction,
    not just preach it).
  - **`mentor-architect` retuned for the AI-native MVP era** (both BOSS-local and the MVP template
    in `stages/L1-mvp/template/.claude/agents/`). Leads with AI as the modality; classical-stack
    choices are supporting cast. Names the load-bearing AI questions: surface, eval strategy,
    prompt vs. fine-tune vs. RAG, structured outputs, human-in-loop boundaries, cost/latency
    budgets, fallback. Cites Karpathy, Willison, Husain (evals — load-bearing), Liu (structured
    outputs — load-bearing), Mollick, Huyen.
  - **First advisory pass captured at `docs/dossier/boss-advisory-pass-001.md`.** Honest, not
    flattering. Each mentor's read on BOSS as-of v0.14.0, citing their practitioners. Five
    cross-cutting themes converged: (1) pause "more features" to earn founder contact; (2) evals
    are the next architecture investment (moments #3/#4 should be eval-set-first); (3)
    right-sized is the default shape (calm-company / OSS / patronage, not venture); (4) interior
    story rich, exterior story missing (strangers can't read the README); (5) the conscience is
    the moat *and* the most under-validated thing — plug this gap first.
  - **Next moves (re-ordered by the pass — supersedes the prior queue):** conscience-evals doc +
    structured hook output, *then* moments #3/#4; 5 real-founder Mom-Test interviews; Dunford
    positioning exercise + strangers-can-read-it README; humane upgrades to the conscience spec
    (cumulative-pressure check, BOSS.DK exemplar lines, cross-link humane practitioners into
    architect's lens); name the right-sized shape on the canvas.

## 0.14.0 — 2026-05-22

- **MVP mode (L1-mvp) is authored — `boss unlock mvp` works for real (closes IDEA-002).** Until now
  the L1 stage was a placeholder README; unlocking MVP errored out as "not authored yet." This release
  extracts this repo's own MVP practice UP into a real `stages/L1-mvp/{manifest.json,template/}`:
  - **Skills:** `/spec` (promote `IDEA-NNN` → `FEAT-NNN` with goal, acceptance criteria, smoke check,
    out-of-scope), `/smoke` (stack-configured build-health gate; saves the command to `.boss/smoke.json`
    on first use), `/log` (append-only `docs/devlog.md` — newest at the top, dated, FEAT-tagged),
    `/close` (session-end ritual that rewrites `docs/RESUME.md` and runs `/log`).
  - **Builder agents:** `tester` (owns `/smoke` + FEAT acceptance — surfaces, doesn't fix),
    `program-manager` (the *when* — sequences FEATs, names blocks, distinct from `pm`'s *what*).
  - **Mentor agents (advisory, never code):** `mentor-architect` (load-bearing decisions: data shape,
    boundaries, what to defer — the calibration against over-architecting an MVP) and `mentor-gtm`
    (first 100 users, channels, message — earned-when-needed, humane before viable).
  - **Additive CLAUDE.md** via `claude-append.md` — the mechanism shipped in v0.8.0 finally has its
    first real consumer. MVP's working rules (spec → smoke → log → close loop, conscience still runs)
    fold into the existing CLAUDE.md under the `boss:L1-mvp` marker; never overwrites Quickstart's rules.
  - **`boss sync` carries it for free** — the manifest's agents/skills are picked up by `managedFiles`
    in `src/sync.js`, so projects pinned at older versions get the MVP files via `/boss-sync` once they
    unlock the layer. (Hooks list is empty in this manifest — moments #3/#4 remain TBD.)
  - Tested in `/tmp`: scaffolded a Quickstart project, `boss unlock mvp` added 4 skills + 4 agents,
    appended the MVP working-rules block to CLAUDE.md, updated the stamp (`L0-quickstart → L1-mvp`,
    merged agents/skills), kept Quickstart files untouched, re-running unlock no-ops cleanly, `boss
    sync` recognizes everything as up-to-date.

## 0.13.0 — 2026-05-21

- **`boss sync` now carries hooks + settings (closes the conscience's reach gap).** Until now the
  conscience hook (v0.12.0) reached *new* projects only — `boss sync` carried skills/agents but not
  hooks or `settings.json`, so existing projects (e.g. `betabeta`) couldn't get it. Fixed:
  - **Hook scripts sync like any managed file** — `manifest.hooks` → `.claude/hooks/<name>.sh`, shown as
    `new`/`changed`/`ok` in the preview, written on `--apply`.
  - **Hook registrations merge into `.claude/settings.json` additively** — `boss sync` adds the
    `UserPromptSubmit` (etc.) entries BOSS ships, **matched by command so it's idempotent**, and
    **preserves the user's permissions and their own hooks.** It's the one user-editable file sync
    touches, and only the `hooks` block. (`computeSettingsMerge` in `src/sync.js`.)
  - The `.boss` stamp now tracks `hooks` (alongside agents/skills); `boss new`/`unlock` record them.
  - `/boss-sync` skill narrates the new behavior. Tested in `/tmp`: an "old" project (no hook,
    permissions-only settings, pinned 0.10.0) → sync adds the hook + merges settings (permissions
    preserved) + bumps the pin; idempotent on re-run.
  - **Existing projects can now `boss sync --apply` (or `/boss-sync`) to receive the conscience.**

## 0.12.0 — 2026-05-21

- **The conscience can now speak *unprompted* (spike → shipped).** Until now both moments only fired
  when you ran a skill (`/triage`, `/canvas`). A new **`UserPromptSubmit` hook** lets moment #1
  ("what does this prove?") surface on its own:
  - `.claude/hooks/conscience.sh` — detection only: if ≥3 dated capture-log entries exist across
    `docs/ideas/` and no canvas has a *filled* riskiest assumption (capturing-lots / validating-nothing),
    it returns `additionalContext` — a **signal**, not canned copy. Claude keeps the voice and the
    judgment: it decides whether the moment fits, says it once in BOSS's register, or stays silent.
  - Registered in the template `.claude/settings.json`; invoked via `bash …` so it needs no execute bit.
    `manifest.json` hooks: `["conscience"]`.
  - Confirms the architecture for the remaining moments: **hook = detection, model = tact + voice.**
  - _Caveats:_ reaches **new** projects only (`boss sync` doesn't carry `settings.json`/hooks yet); the
    *feel* (wise vs. naggy) still needs live validation, like moment #1 in `betabeta`.

## 0.11.0 — 2026-05-21

- **The conscience — second moment: "Done!" (`/canvas` graduation).** The *affirming* register,
  counterpart to moment #1's caution. When the canvas holds up (most cells real + riskiest assumption
  has a validation plan), `/canvas` no longer just offers `boss unlock mvp` — it marks the threshold in
  two beats:
  - **Arrival** — names what became real (started with a hunch → now a specific person, real tension,
    sharp promise, a testable riskiest bet). Said plainly, let to land. Acknowledgment, not praise.
  - **Next doorway** — points at `boss unlock mvp` (build tools + next mentors) without rushing; the
    canvas keeps.
  - A threshold, not a finish line; never forced — the celebration is for when it's genuinely earned.
  - Completes the conscience's *two registers* (caution + completion) in Quickstart.

## 0.10.0 — 2026-05-21

- **The conscience — first moment lands (`/triage` validation check).** BOSS starts behaving like the
  *build's conscience*, not just a set of skills you invoke. The first of four conscience moments —
  **"what does this prove?"** — is now baked into `/triage`:
  - **Fires when** the active idea has ≥3 capture-log entries and no canvas with a filled riskiest
    assumption (the "capturing lots, validating nothing" drift) — and *only* then.
  - **Says one spare line** in BOSS's voice (the seasoned hand): names the drift, asks what would make
    it real, points at `/canvas`, hands the decision back. Never blocks a capture, never nags.
  - Turns the validation thinking that already lived in `/canvas` + `mentor-venture` (invoke-only) into
    a *moment that fires* in the flow where drift actually happens.
  - Template `CLAUDE.md` names the conscience in the Quickstart arc.
  - Existing projects pick it up via `boss sync` / `/boss-sync`.

## 0.9.0 — 2026-05-21

- **Mentor layer — structure + cornerstone (IDEA-003).** BOSS's second agent class lands.
  - **`docs/MENTORS.md`** — the design: two classes (builders make the app, `mentor-*` coach the
    founder), the roster + JIT-per-mode mapping (venture → architect/GTM → fundraising/pitch/talent/
    business → humane), the founder **dossier** (canvas → proposal → architecture brief → pitch →
    hiring plan → data room), and the hard line (no binding legal/financial advice; humane before viable).
  - **`mentor-venture` agent** seeded into Quickstart (`library/agents/` + template + manifest). The
    cornerstone mentor: pressure-tests whether an idea is worth it, names the riskiest assumption,
    points at the next real step, owns the canvas conversation. Advisory only — never writes code/specs.
  - Existing projects pull `mentor-venture` + the new skills via `boss sync` / `/boss-sync`.
  - _Still open:_ encoding real practitioners' best-practices UP into `practices/` + `memory-seed/`
    (awaiting the list); authoring the rest of the roster as their modes get built.

## 0.8.0 — 2026-05-21

- **The learning loop (IDEA-001).** PRINCIPLES #1 made operational, in both directions:
  - **`boss sync [--apply]`** — brings a project's BOSS-managed skills/agents (across all its
    installed modes) up to the current version. Previews as `new` / `changed (N lines)` / up-to-date,
    reconciles stale mode labels (an old `L0-sketch` pin → `L0-quickstart`), and on `--apply` writes
    the files + bumps the project's `.boss` pin. Syncs BOSS-managed skills/agents only; user-editable
    files (`CLAUDE.md`, `settings.json`) are left for hand-merge.
  - **`boss learn <path> --as <category>`** — promotes a proven pattern UP into
    `library/<category>/` (`agents|skills|hooks|practices|memory-seed`), bumps `VERSION` +
    `package.json` in sync, and prepends a CHANGELOG stub. Finds the BOSS **source** repo via the
    registry's self-hosted entry (or `$BOSS_SRC`), so it works when `boss` runs from a global install.
  - **`/boss-sync` + `/boss-learn` skills** — the judgment layer. `/boss-learn` is a two-destination
    **router** (UP = BOSS superset practice; DOWN = harden into the app's own core), never one-way.
    `/boss-sync` narrates the diff from the CHANGELOG and flags local edits before overwriting.
- **`claude-append.md` support in `boss unlock`.** A mode template can carry a `claude-append.md`
  whose contents are *appended* to the project's CLAUDE.md under an idempotent marker — additive
  working rules, never an overwrite. (Needed by the MVP mode next.)

## 0.7.0 — 2026-05-21

- **Package / dogfood separation.** Clean boundary between the shippable package and BOSS's own
  incubation layer:
  - `package.json` `files` allowlist — only `bin/ src/ stages/ library/ VERSION PRINCIPLES.md
    registry/CHANGELOG.md` (+ README/LICENSE) ship. `docs/`, `.boss/`, root `CLAUDE.md`, and the
    local registry are never published. (`npm run pack:preview` to verify.)
  - **Registry moved out of the repo** to `~/.boss/registry.json` — machine-local state (your
    project list + absolute paths) no longer lives in (or leaks into) the package/repo.
  - `VERSION` and `package.json` version synced to 0.7.0.

## 0.6.0 — 2026-05-21

- **BOSS now dogfoods itself.** BOSS is its own first registered project (`.boss/` stamp,
  mode MVP, self-hosted) — retrofitted ahead of the MVP-mode template, which will be *extracted UP*
  from this repo's working practice (Principle 1).
- Added BOSS's own dogfooded docs: root `CLAUDE.md`, `docs/IDS.md`, `docs/ideas/` (IDEA-001 learning
  loop, IDEA-002 MVP mode, IDEA-003 mentor layer), `docs/ideas/CANVAS.md` (BOSS's own Humane
  Product Canvas), and `docs/RESUME.md` (multi-session continuity).
- Recorded the **mentor layer** vision: two agent classes — builders (make the app) and mentors
  (coach the founder); mentors accumulate a founder dossier toward funding/hiring.

## 0.5.0 — 2026-05-21

- **PRINCIPLES.md** — BOSS's six operating principles. #1: always scaffolding, but pause to sort
  patterns UP (BOSS superset practice) or DOWN (app core); `/boss-learn` becomes a two-way router.
  #3: nothing valuable gets locked into code (style → tokens, prototypes reuse the same system).
- **Design-system practice** (`library/practices/design-system.md`) — generalized from dhun:
  tokens as single source of truth, central style utils, 5-state rule, prototype reuse, JIT
  enforcement (turns on at V1; seed tokens the moment real UI appears).
- V1 mode stub fleshed out with the design layer + enforcement timing.

## 0.4.0 — 2026-05-21

- **Quickstart becomes a tiny incubator:** capture → keep adding → canvas → unlock MVP.
- `/triage` rewritten as **living idea capture** — one evolving doc per idea (sharpening
  "current shape" + append-only capture log). Re-run anytime to keep adding.
- New `/canvas` skill: a **humane business pressure-test** — Ajesh Shah's Humane Product Canvas
  (Human Foundation / Product Expression / Stewardship) as the spine, with Lean + Lenny-style
  prompts folded into each cell, plus the incubation heartbeat (riskiest assumption + one
  experiment this week). Acts as the Quickstart→MVP graduation gate.
- North star recorded: BOSS is a just-in-time startup incubator — the right support shows up per mode.

## 0.3.0 — 2026-05-20

- Stages renamed to **modes** (the user's vocabulary): Quickstart → MVP → V1 → Scale
  (folder ids `L0-quickstart` / `L1-mvp` / `L2-v1` / `L3-scale`).
- `boss unlock` accepts mode names, levels, or full ids (`mvp`, `L1`, `L1-mvp`).
- `boss new` / `status` / `list` display the mode name; `.boss/manifest.json` records `mode`.
- _Migration note:_ projects created on ≤0.2.0 carry the old `L0-sketch` stage label in their
  stamp; cosmetic only — `unlock`/`status` still work. A future `/boss-sync` will reconcile labels.

## 0.2.0 — 2026-05-20

- `/boss` spin-up skill (L0): reads a PRD/idea → shapes via pm lens → captures IDEA-001 →
  recommends stack + stage → optionally creates a **private** GitHub repo with a license.
- Repo-creation defaults (in `.boss/config.json`): `github: ask`, `visibility: private`,
  `license: proprietary` (All Rights Reserved — keeps paid + OSS options open; relicense later).
- Auto-sets repo-local GitHub noreply email to avoid the GH007 email-privacy push block.

## 0.1.0 — 2026-05-20

- Walking skeleton: `boss new` / `unlock` / `status` / `list` / `version`.
- L0 · Quickstart stage authored (CLAUDE.md, pm + coder-generalist agents, /triage, ideas pool, IDS).
- Registry + `.boss/` project stamp + version-pinning.
- L1–L3 stages stubbed (manifests/templates not yet authored).
