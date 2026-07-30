# How to use BOSS

The read-once walkthrough. It explains what you're doing at each stage and when to move on —
not every command (that's [`SKILLS.md`](SKILLS.md)) and not the whole map at once (that's
[`CHEATSHEET.md`](CHEATSHEET.md)).

Two of these live *inside* a project, always current to where you are:
- **`/welcome`** — run it once in a fresh project; a short, cohort-aware orientation that defines
  terms as it goes. The live version of this guide's opening.
- **`boss map`** — run it anytime; shows where you are, what you can run now, and what the next
  unlock adds.

This file is here for the moment *before* that — when you're deciding whether BOSS is for you, or
you want the shape of the whole thing in one read.

---

## The one idea

You can now build faster than you can tell whether you *should*. AI makes a polished prototype
cheap, which makes a new mistake cheap too: shipping a **pseudo app** — an impressive demo with no
proven pain, no real workflow fit, no one who'd pay — and mistaking it for a **real business**.

BOSS is the layer between those two. It helps you build fast *without fooling yourself*: catch the
drift early, scale the ceremony to the evidence, and get out of the way when you're in flow. That's
the whole product. Everything below is how it does it.

Three mechanics carry it:

- **Modes** scale how much structure you get to how far along you are: **Quickstart → MVP → V1 →
  Scale.** You unlock the next one when you've earned it. Nothing turns on before you need it; a
  project that stays in Quickstart forever is a real project.
- **The conscience** is the one piece of BOSS that speaks on its own. When the work drifts from the
  bet you named, it says one thing, hands the decision back, and goes quiet. It never blocks. You
  can pause the whole thing (`boss conscience pause --for 8h`) or turn down a single nudge
  (`boss conscience mute <moment>`), and every override is recorded, never punished.
- **A board of advisors** — *mentors* coach you on the founder-craft code can't teach (business,
  architecture, GTM, fundraising, pitch, talent, and a humane lens that can override the *other
  mentors* — though never you). *Builders*
  (PM, coder, tester, designers) make the thing.

---

## Start where you are

Pick the line that matches your situation. It changes where you start and how fast you climb —
nothing else. (In a project, `/welcome` asks you this and tunes itself; you can skip it.)

- **This is the first thing you've built.** New to building *and* to AI coding. → Run `/welcome`,
  then `/boss`. Stay in Quickstart a while — capture ideas, pressure-test one, let the conscience
  teach you the rhythm. Don't rush to `unlock`; the next mode will still be there.

- **You've shipped a couple of small things.** A few months on Claude Code; the *building*
  feels possible, the *what's-worth-finishing* less so. → Start at `/boss`. Capture freely with
  `/triage`; the payoff is `/canvas` — that's where BOSS earns its keep for you. `unlock mvp` when
  you're actually building, not before.

- **You've shipped real products before.** Strong engineer, or a returning founder. → You don't need
  the tour — `/welcome` gives you the 30-second version. BOSS's value for you isn't the scaffolding;
  it's the conscience catching drift you'd rationalize, and the mentor board for the parts that
  aren't engineering. Move fast through the unlocks.

- **You're building somewhere being wrong has real costs.** Health, legal, money, safety. → Same
  path, but turn the harm lens on early: `/ai-failure-states` from the start, and lean on
  `mentor-humane` (it can override the other mentors). Go slower on any claim your product makes.

- **You already started — there's a repo.** You built something before you found BOSS. → Don't start
  over: `cd` into it and run **`boss adopt`** (add `--mode mvp` if it already has real users). It lays
  BOSS down *non-destructively* — your files are untouched — at the lightest register that fits, and
  you `unlock` up from there. Add `--ai` to have BOSS read the repo and tailor the scaffold
  (`/comprehend`).

---

## The walk, rung by rung

Each mode is additive — unlocking the next never removes what you had. `boss unlock <mode>` is
always your call.

### Quickstart — *get the idea out of your head*
Capture an idea, shape it, pressure-test whether it's real. Almost no ceremony.
- **You'll actually use:** `/triage` (capture an idea and keep adding to it), `/prototype` (drop an
  idea and hit go — BOSS builds the smallest clickable version so you can *see* it, not just argue
  with a blank page), `/canvas` (pressure-test it as a humane business — who's served, what's the bet,
  what could kill it), `/persona` (your target user as a consultable voice — guide *and* QA, never a
  replacement for talking to a real one), `/import` (bring existing material in — a doc, a folder, or
  a URL becomes durable context in `docs/source/` that BOSS builds from).
- **Talk to someone:** `/interview` is the bridge the conscience keeps pointing at. Run it before a
  customer call and it hands you one printable page of Mom-Test questions (past behavior, their life,
  no pitching); run `/interview debrief` after and paste your notes — it pulls out the real signals,
  grades them, flags the one moment you pitched instead of listened, and names the next commitment to
  ask for. BOSS preps and debriefs; it never fakes the conversation.
- **Already have a transcript?** `/research` digests a whole one — an interview recording, a sales
  call, a support thread — into graded `EVID` at scale plus synthesized product context (the pain in
  your users' own words, the job they're hiring for, the workarounds they use today, what they *didn't*
  care about), and flags the spots where you led the witness. It analyzes what's actually there; it
  never invents a quote. The sibling of `/interview`, at transcript scale.
- **Where evidence lives:** when you actually talk to someone (the conscience will tell you a
  15-minute call beats another canvas pass), the result lands in `docs/evidence/` as an `EVID-NNN`
  — one signal per file, graded `stated-pain` → `observed-behavior` → `commitment`. Capture one with
  `/evidence` (paste your notes; BOSS grades it honestly and pushes back on inflation). The conscience
  reads that ledger: it gets *specific* when you have only stated pain and no commitments, and it goes
  *quiet* once real commitments show up — evidence is how you earn its silence.
- **Ask:** `mentor-venture` — is this worth building, what's the riskiest assumption.
- **Ready to climb when:** you're done capturing and ready to *build* one of these for real.
  → `boss unlock mvp`

### MVP — *build the first working version*
Spec discipline, a build-health gate, demand-testing, and AI-cost/eval/failure-state discipline if
your product leans on a model.
- **You'll actually use:** `/spec` (an idea becomes a buildable FEAT with acceptance criteria),
  `/smoke` (is it even running?), `/pretotype` (test demand *before* you build), `/log` + `/close`
  (keep a devlog + a clean session-end — and the conscience updates its read on your venture),
  `/revalidate` (the 3-line gate before paused work re-enters the build, so you never ship a zombie
  feature). If you're AI-native: `/ai-first-init`, `/ai-cost` (+ `/cost-review` to read the spend ledger against
  budget), `/evals`, `/ai-failure-states`,
  `/judge-traces` (error-analysis on your real sessions), `/red-team` (test your defenses against the
  OWASP LLM Top-10 — turns prevention into evidence).
- **Ask:** `mentor-architect` (load-bearing tradeoffs, what to defer), `mentor-gtm` (first users,
  channels), or **`/consult`** to convene several mentors on one cross-cutting decision (it keeps the
  disagreement visible instead of averaging it away).
- **Ready to climb when:** you have real users and the app needs design rigor, a real database, and
  prototypes. → `boss unlock v1`

### V1 — *make it shippable*
The design layer turns on, plus the next tier of mentors.
- **You'll actually use:** `/design-review` (before you code), `/ux-check` (after), `/board`
  (sequence work across features).
- **Ask:** `mentor-business` (model, pricing), `mentor-fundraising`, `mentor-pitch`, `mentor-talent`
  — promoted in here because these questions get real at V1.
- **Ready to climb when:** the team grows and the org needs to be a thing. → `boss unlock scale`

### Scale — *grow it*
Customers are real, someone besides you is in the work, and **coordination — not code — is the
bottleneck.** The rung most tempted by premature ceremony, so everything here is symptom-gated and
`boss unlock scale` names its own evidence bar *before* you cross it (recurring revenue · a
non-founder in the work · a coordination symptom you can name). It never blocks; missing a leg is
fine, it just says out loud what you'd be carrying unearned.
- **You'll actually use:** `/incident` (the blameless one-page post-mortem when something breaks in
  production — fix first, then one systemic learning routed UP), and `/triage --feedback` (the
  customer register: bug · friction · feature-request-as-evidence-not-spec · churn).
- **Deliberately not built yet:** unit economics at volume, `/code-health`, refactor waves, RFCs,
  collaborator roles, and the give-away-your-Legos conscience moment. Each waits on a real project
  hitting the symptom — the same discipline as every other rung.
- **Ready to climb when:** there is no next unlock. From here the loop is operate honestly,
  delegate deliberately, and let `/boss-learn` carry what you've proven back UP.

---

## After you ship — *the post-launch arc*

Shipping is the middle of the story, not the end. These live in MVP mode (you don't unlock anything
new for them), but they belong to a different job than *building* the MVP — so they're grouped here
rather than padding the rung above. **None of them are a cadence you owe anybody**; each fires when
its moment actually arrives, and most of them will say "not yet, go talk to your users."

- **Get it in front of someone.** `/ship` puts the app where a real user can hit it — the deploy half
  of building, with a pre-flight against the leak that keeps burning vibe-coded apps (client-bundled
  secrets, row-level security nobody actually switched on). `localhost` is not a product; the URL is
  the proof. `/landing` writes the first honest landing page from your brand voice, tokens, and the
  canvas's Promises cell — it will refuse fake urgency and confirmshaming.
- **Find out if it's working.** `/measure` picks ONE activation metric and ONE retention curve —
  ten events, not an analytics department — plus the numbers classic tools miss for AI products
  (task-completion rate, edit-rate, cost per *successful* outcome). At fewer than ten users it tells
  you to go talk to them instead.
- **The one verdict that matters.** `/pmf-check` reads what BOSS already holds and calls it:
  pre-PMF, at-PMF, or post-PMF. It **defaults to "you're probably still pre-PMF, don't scale yet,"**
  because scaling early is the single most reliable way to kill a startup — and only post-PMF
  licenses the leader's work (hiring, raising, scaling).
- **Fix the curve, don't hack it.** `/retain` diagnoses *where* retention dies — the top (people
  never reach the value → `/onboard`), the middle (the product isn't worth returning to → roadmap),
  or the wallet (cards failing → dunning). There is no retention hack; the fix is always the
  product, and this tells you which part. `/onboard` is the top-of-curve fix: derive the aha-moment
  from your *data* (best-retained vs churned), then cut every step between signup and it.
- **Decide what's next.** `/roadmap` weighs requests against behavior — behavior wins — into a small
  bet-list with a mandatory NO-list. A dated snapshot you use and discard, never a backlog you tend.
- **Get paid, honestly.** `/first-dollar` runs the five deferrable moves when someone has actually
  said yes (entity · terms · the cheapest reversible payment rail · refund posture · the price said
  out loud), then records the first paying customer as commitment-grade evidence. `/monetize` is the
  layer after: upgrades triggered by a moment of value rather than a nag, recovering involuntary
  churn, and raising a price the honest way (on value, with a real path out).
- **Earn trust.** `/trust` covers the load-bearing privacy set without the compliance theater — a
  data-minimization policy, the subprocessor list derived from what your app actually calls, and the
  step founders skip: *did you actually turn on your AI provider's training opt-out?* It explicitly
  defers SOC 2 until a named enterprise deal asks for it. Pointers to a real lawyer, never legal
  advice.
- **Subtract.** `/sunset FEAT-NNN` ends one zombie feature — usage-validated, with the honest
  deprecation notice written for you. A bloated product serves no one.

### Ending well — *a project can end at any rung*
Not every bet works, and that's the point — validation's payoff is deciding faster, including
quitting faster. When a project is done (validated-no, out of runway, or just not the thing anymore),
`/sunset` closes the loop honestly: one page, three questions — what was the bet, what evidence
actually came in, what this taught the next project — then it harvests any reusable patterns UP and
marks the project **retired** (`boss retire`; reversible, nothing deleted). `boss insights` then knows
your **kill-speed** — how fast you kill the dead ones. A real experiment that returned an answer, not
a failure. It only ever runs when *you* run it; the conscience never suggests quitting on its own.

---

## When you're stuck, ask a mentor

The mentors are advisory — they coach, they don't decide, and none of them gives binding legal or
financial advice (they point you at the real expert and caveat hard).

| The question on your mind | Who to ask |
|---|---|
| Is this worth building? What's the riskiest assumption? | `mentor-venture` |
| What's the load-bearing technical call? What can I defer? | `mentor-architect` |
| How do I get the first users? What's the positioning? | `mentor-gtm` |
| How do I work with my cofounder? Are we deciding together? | `mentor-cofounder` *(dormant when solo)* |
| What's the model? Should this be free? What would someone pay? | `mentor-business` |
| Should I raise? When? | `mentor-fundraising` |
| How do I explain this? Is the deck working? | `mentor-pitch` |
| Should I hire? Who first? | `mentor-talent` |
| Who could this harm? Is this dark-pattern-y? | `mentor-humane` *(can override the others)* |

---

## Building with a cofounder?

There's a whole other axis to BOSS that stays invisible until a second person joins: a shared way to
**decide** (`/decide`), **share what you're learning** (`/practice`), get **coached on the partnership**
(`mentor-cofounder`), and a conscience that notices when you've drifted into building in parallel. Add a
cofounder with `boss team add @their-handle "Name"` — then see **[GUIDE-teams.md](GUIDE-teams.md)** for how
it fits together (the loop with two of you, what stays private vs. shared, and the hard lines BOSS won't
cross — it never takes a side, never scores your equity).

---

## Three hooks that ship switched off

Every BOSS project gets three extra hooks in `.claude/hooks/` that **do nothing until you turn
them on**. A hook runs a process on every matching event, so BOSS won't spend your latency without
you asking — an unregistered script costs exactly zero.

- **`secrets-guard`** — stops a tool from reading a secret's *contents* into the model's context.
  The `permissions.deny` block in your settings is the free floor; this is the ceiling, for
  regulated or high-stakes work.
- **`memory-cue`** — notices when you say something durable ("from now on…", "no, don't…") and
  nudges Claude to save it. Worth it once you're repeating the same correction across sessions.
- **`auto-log`** — writes one honest line per writer-subagent to a local `.boss/trace.jsonl`.
  **`/judge-traces` reads this file and will be empty until you switch this on.**

Run **`boss help hooks`** for what each costs and when it's worth it; each file's header has the
exact block to paste into `.claude/settings.json`. `boss sync` keeps them current either way.

---

## Two things worth remembering

- **The conscience is on your side, not on your back.** It speaks when the work drifts from the bet
  you named, then stops. If it's firing at the wrong time, pause it — that's a feature, not a
  failure. Overriding it is normal; it just gets recorded so future-you can see the deviation.
- **Less is a legitimate answer.** Staying in Quickstart, not raising, not hiring, keeping the team
  at one — BOSS defaults to right-sized and makes you *earn* the heavier path on evidence. It will
  never push you toward a shape because the shape is impressive.

---

## Reference

- **`boss map`** — the live version of this guide, current to your project.
- **[`CHEATSHEET.md`](CHEATSHEET.md)** — the whole ladder on one page.
- **[`SKILLS.md`](SKILLS.md)** — one line per skill, grouped by mode.
- **[`../PRINCIPLES.md`](../PRINCIPLES.md)** — the six rules that define BOSS.
- **[`../README.md`](../README.md)** — what BOSS is and why.

Two standing utilities, available in any mode (they're about BOSS itself, not a rung step):
- **`/boss-sync`** — pull the latest BOSS practices into your project when a new version ships.
- **`/feedback`** — tell the people who build BOSS what got in your way; it shows you exactly what it
  sends before it sends anything.
