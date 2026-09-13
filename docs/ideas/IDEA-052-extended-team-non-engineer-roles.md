---
id: IDEA-052
type: idea
owner: product-lead
status: deferred (trigger-gated)
program: founding-teams
proof: stages/L2-v1/template/.claude/agents/mentor-finance.md
created: 2026-07-02
source: fable-campaign lifecycle pass (Fable 5, 2026-07-02 — "how does BOSS extend to finance, legal, marketing, hires, consultants?")
---

# IDEA-052 — The extended team: how BOSS meets the people who aren't engineers

> **PARKED 2026-08-20** (Ajesh: *"park for now, we can see if we need to bring back later"*). `deferred` is the deliberate status — a decision, not a
> backlog item — and the re-open trigger is written at the foot of this file.
>
> **Parked with a fired trigger, deliberately — and that is the unusual part.** This record gates
> `mentor-operations` on *"first-dollar exists somewhere"*; `/money` shipped in **v0.157.0**, so the
> trigger **has fired** and the seat is buildable on its own terms. It is parked anyway, because what
> it would do is **add a seat** — and [[EVID-001]]'s standing mandate is compose-and-subtract, from a
> founder who named app bloat as their own fear. A fired trigger is a fact, not an obligation.
>
> ⚠️ **Two things a future session must not misread as permission:** the `/brief` handoff prompt below
> carries a hard stop — *confirm a real professional engagement exists to shape it against; if not,
> stop* — and Ajesh's 2026-08-20 override of that stop **stands unspent while the stop stands unmet.**
> Parking does not spend it. Re-ask, or find the engagement.

## The reframe (the load-bearing design call)

> **↔ [[IDEA-082]]** takes population 2 below — the hire who *“needs a class, not a copy” — and asks
> what happens when **they** are the one who adopts BOSS, rather than being added to it. This record’s
> hard humane line (the conscience never fires at an employee) carries over there unchanged.


The instinct is "add finance/legal/accounting mentors and give hires BOSS accounts." Both halves are half
wrong. The honest design splits **three different populations** that "non-engineer help" conflates:

1. **Professionals the founder *engages*** (lawyer, accountant, bookkeeper, fractional CFO) — they will
   **never use BOSS**, and shouldn't. They have their own tools, their own liability, their own letterhead.
   BOSS's job is to make the founder a *competent client*: know when you need one, what to bring, what to
   ask, what it should cost, what's a red flag. **The interface is a brief, not a login.**
2. **People the founder *hires*** (employee #1, a contractor, a marketer) — they join the *work*, so they
   touch the artifacts (board, docs, decisions) but they are **not cofounders**: different stakes,
   different access, different conscience relationship. FEAT-021 built the cofounder layer; hires need a
   *class*, not a copy.
3. **Functions the founder must *carry themselves* until someone else does** (bookkeeping-lite, runway
   math, a marketing cadence) — mentor territory, JIT.

## The three shapes

**1. Briefs-as-interface (`/brief <profession>`) — the distinctive piece, and the cheapest.**
When a professional engagement becomes real, BOSS generates a one-page engagement brief *from the venture's
own state*: what the company is (canvas), what's decided (DECs — entity choices, equity splits), what's at
stake, the questions to ask, the red flags for this profession, roughly what it should cost. The accountant
receives a competent client instead of a shoebox of receipts. Extends the bright line BOSS already holds
(*point at real experts, never impersonate them*) from a disclaimer into a **tool**. UP practice per
profession accretes via the loop (`working-with-your-first-accountant.md`, `-lawyer.md` — earned one real
engagement at a time, the IDEA-017 JIT-domain pattern).

**2. Collaborator classes in `boss team` — cofounder ≠ employee ≠ consultant.**
`boss team add @handle --role contractor|employee` (default stays cofounder). Role changes three things:
- **Access posture**: venture-level artifacts (board, GUIDE, relevant docs/) yes; the founder's brain,
  `relationship.md`, dossier, equity-adjacent surfaces **no** (the DEC-001 state cut already draws this
  line for per-person data — extend it per-role).
- **Conscience posture**: the conscience serves *the founder(s)*. It never fires at an employee, never
  evaluates one, never surfaces founder-tensions to one. A hired marketer sees a build tool; the
  conscience is not their business. (Hard humane line — a workplace-surveillance-adjacent misstep here
  would betray everything in `harm-taxonomy.md`.)
- **Onboarding artifact**: a role-scoped orientation (what this project is, how we work, where things
  live) generated from state — the give-away-your-Legos handoff [[IDEA-040]] names, arriving earlier.

**3. The back-office mentor seat — one, not four.**
Not mentor-finance + mentor-accounting + mentor-legal + mentor-ops (roster bloat; C1's own critique).
**One `mentor-operations`** covering money-hygiene (books from day one, personal/business separation,
runway math), compliance calendar awareness, and *when to escalate to a real professional* (its main verb
is pointing at `/brief`). Hard bright lines inherited: never legal/tax advice, never a cap table.
`mentor-talent` (exists, "not yet") activates for the *hiring* questions: first-hire shape, contractor vs
employee (a `/brief lawyer` moment, not an answer), JD drafting, the delegation question ("what should you
keep?"). Marketing already has a seat (`mentor-gtm`).

## ⚠️ The population this split doesn't cover: the designer (added 2026-08-20)

The three-population cut above is right and **a designer falls between two of them.**

Population 1 (lawyer, accountant) *"will never use BOSS, and shouldn't"* — the interface is a brief.
Population 2 (employee, contractor) joins the work and touches the artifacts. **A designer is
population 2 who also arrives carrying their own tool that must interoperate with the repo.** Neither
the brief-only interface nor the repo-access model fits alone, and the interop half is the part
neither anticipated.

**This does NOT need the `/brief` slice, and shouldn't wait on its gate.** The handoff prompt below
rightly refuses to author brief content without a real engagement — knowing what an accountant needs,
what it costs, what the red flags are, is knowledge you can only get from having done it. **The
designer case has no such dependency**, because it isn't imagined: it composes entirely from
artifacts BOSS already generates — the canvas Promises cell, `DESIGN_TOKENS.md` (and its DTCG export,
which is the actual interop seam), `STYLE_GUIDE.md`'s principles and five-state table, the open
`/ux-check` findings, and the component library. Nothing there requires a real engagement to write;
it's assembly.

**So it shipped where it belongs — inside `/design-library`** (`docs/design/HANDOFF.md`, v0.169.0),
next to the system it hands over, rather than as a `/brief designer` that would inherit a gate it
doesn't need. If `/brief` is later built for the genuine professional-engagement cases, the designer
should **stay put**: the brief pattern is *"make the founder a competent client of someone external"*;
this one is *"make a collaborator productive inside the work."* Different job, different home.

The **collaborator-class** half (access posture, conscience posture) still applies to a designer and
still waits on its stated trigger — a real project adding a first non-cofounder.

## What BOSS refuses (say it now, before the temptation)

No HR system, no payroll, no CRM, no document-signing, no seats/accounts/permissions server — every one is
a second-source-of-truth app BOSS's principles reject (build the view/brief, refuse the app). Access
control is git + the state cut, not an auth layer.

## Sequencing + triggers

- **`/brief`** — the earned-first slice: cheap (skill + practice pattern), serves the *current* solo
  cohort (every founder eventually needs an accountant), and dogfoodable the day Ajesh next talks to a
  professional about BOSS itself. Buildable on a real engagement (his or a founder-friend's).
- **Collaborator classes** — trigger: a real project adds a first non-cofounder (the FEAT-021 pattern:
  demand was real founders, build followed).
- **`mentor-operations`** — trigger: first-dollar exists somewhere ([[IDEA-050]]) — money hygiene is
  meaningless before money.

## 2026-08-20 — status: the gate was overridden, the build was not done

Ajesh asked where BOSS is weak on finance / HR / onboarding / culture / governance. The sweep
confirmed this file's read and dated it: `payroll` 0 · `bookkeep` 0 · `compensation` 0 ·
`handbook` 0 · `performance review` 0 across the whole shipped surface. **"Early finance" today
means the LLM bill and the first dollar.**

- **`mentor-operations`' stated trigger has FIRED and nobody noticed.** This file gates it on
  *"first-dollar exists somewhere"*; `/money` shipped in v0.157.0. The seat is now buildable on its
  own terms — still **one** seat, not four.
- **`/brief` was NOT built.** The handoff prompt below carries a hard stop — *confirm a real
  professional engagement exists to shape it against; if not, stop.* **Ajesh overrode that stop on
  2026-08-20**, then the build was pulled back on **scope** in the same session. So: the override
  stands **unspent**, and the stop stands **unmet**. A future session must not read the override as
  a green light it already earned — re-ask, or find the engagement.
- **What DID ship (v0.173.0) is the routing half, not the surface.** `mentor-talent` and
  `mentor-business` already said *"point at a real lawyer / accountant"* and never said what to
  bring them. Both now carry the competent-client handoff. That is a **posture**, not
  professional-domain content, so it needed no engagement to shape it — and it is the cheap 80% of
  `/brief`'s value living on agents that already exist. **Zero new skills.**

## OPUS HANDOFF PROMPT (for the `/brief` slice only; the rest waits on triggers)

```
You are implementing the /brief slice of IDEA-052 for BOSS. Repo: ~/Projects/bossbuild.
Read CLAUDE.md, docs/RESUME.md, docs/ideas/IDEA-052-extended-team-non-engineer-roles.md, and
docs/MENTORS.md (the internal-vs-shipped boundary + the never-impersonate rule) first.
CONFIRM WITH AJESH a real professional engagement exists to shape it against (his own or a
founder-friend's) — if not, stop; the brief content must come from a real engagement, not
imagination.

TASKS
1. New L1/MVP skill /brief (stages/L1-mvp template): /brief <profession> (accountant | lawyer |
   bookkeeper | marketer | other) generates docs/briefs/BRIEF-<profession>-<date>.md from venture
   state: company one-liner (canvas), relevant DECs (entity/equity/money decisions), what's at
   stake now, 5-7 questions to ask THIS profession, red flags, honest cost ranges phrased as
   "commonly reported, verify locally." Degrade gracefully when state files are absent. Bright-
   line header in every brief: "BOSS prepared this so you can brief a real professional. It is
   not legal, tax, or financial advice."
2. New practice library/practices/working-with-professionals.md: the general pattern (when you
   need one, what to bring, what it costs, red flags, the competent-client posture) + a note that
   per-profession practices accrete via /boss-learn one real engagement at a time (RVW-001
   anti-rot rule: earned, not imagined).
3. mentor-business + mentor-talent (shipped templates only): one line each pointing at /brief at
   the relevant moments (money questions → accountant brief; hiring questions → lawyer brief).
4. Wayfinding (boss map + GUIDE one-liner), VERSION minor bump + registry/CHANGELOG.md entry,
   /tmp smoke test (skill lands on boss unlock mvp, 0 placeholders, a brief generates from a stub
   canvas), clean /tmp + prune registry/projects.json.
DO NOT build: collaborator classes, mentor-operations, any access-control machinery — trigger-
gated per the idea file. Do not commit unless asked.
```

## Gate

**Re-open trigger (either one):**

1. A **real professional engagement** exists to shape `/brief` against — an actual accountant,
   lawyer or bookkeeper whose questions BOSS can write down. This is the record's own hard stop and
   the reason the 2026-08-20 override was never spent.
2. A founder **hits the operations wall** for real — payroll, bookkeeping, a handbook, a performance
   conversation — rather than BOSS predicting they will. The 2026-08-20 sweep measured the gap and
   dated it (`payroll` 0 · `bookkeep` 0 · `compensation` 0 · `handbook` 0 across the shipped
   surface); measuring a gap is not the same as someone falling into it.

**Already shipped and NOT parked:** the routing half (v0.173.0) — `mentor-hiring` and
`mentor-capital` now say *what to bring* a real professional, not just *go find one*. That was a
posture, needed no engagement to shape, and is the cheap 80% living on agents that already exist.

⛔ **Still refused regardless of trigger:** collaborator classes, four separate professional
mentors, any access-control machinery. One seat, not four — and not yet.
