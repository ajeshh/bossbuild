---
id: COMP-bmad
type: competition
owner: product-lead
status: watch
rival: BMAD Method (BMad Code, LLC)
kind: adjacent — an agent-team method (analyst, PM, UX, architect, dev) that plans and builds inside the same hosts as BOSS
checked: 2026-10-05
sort: watch — no EVID names them (EVID-001…005 checked 2026-10-05). Filed on Ajesh's ask.
source: github.com/bmad-code-org/BMAD-METHOD, read in clones of `main` (8f2c13d, 2026-10-04) and tag v6.12.1 — README, LICENSE, TRADEMARK.md, CHANGELOG.md, skills/*, docs/*. Also gh api (issues, discussions, module repos), registry.npmjs.org/bmad-method with npm downloads, docs.bmad-method.org and bmadcode.com.
---

# BMAD Method

> **In their words** (README, checked 2026-10-05): *"Agile Ai Driven Development — turn an idea or
> change request into working software without giving up the thinking."* — *"the process sizes itself
> to the work. Small changes go straight to build. Complex work gets the depth it needs."*
> Docs: *"BMad helps you decide what to build and then build it."*

## What it is

A set of skills with five persona agents: **Mary** (analyst), **John** (PM), **Sally** (UX),
**Winston** (architect) and **Amelia** (dev). They carry an idea through brief, PRD, UX and architecture
into a condensed `spec-<slug>.md` (Problem, Capabilities, Constraints, Non-goals, Success signal), then
tickets and **Build**, one session per unit. Optional modules include a Creative Intelligence Suite
(brainstorming, design thinking, a business-model "innovation strategist"), a test architect, game dev,
and **BMad Loop**, which builds a whole epic unattended. It installs into 48 hosts, Claude Code
among them.

**Two products right now.** The published v6.12.1 installs with `npx bmad-method install`. Unreleased
`main` (6.13.0-next, effectively v7) installs as skills and needs `uv`. The README already describes v7,
and users are confused by it (#2841).

**The twist, against BOSS's bet.** From the outside, the cast looks like BOSS's builders and mentors.
Inside, it isn't. BMAD's agents are **all builders**: they write documents that lead to code. None of
them is about the founder. There's no venture layer, nothing after launch (BMAD's own grep found zero
post-launch files), and no evidence from a real person. Its "user interviews" interview the person
using BMAD, and its user-voice research mines forums. **The closest thing to BOSS's ground is
`bmad-forge-idea`.** It asks *"who asked for this? My recommended answer is nobody did"*, and ends in
Hardened, Killed or Clearer. The docs say *"Let it kill the idea."* That is BOSS's `/canvas` and
`/sunset` instinct, done in one session from desk research. No switch test yet. The overlap is a
mindset, not a mechanism.

## Pricing — opened 2026-10-05

Free. MIT for the code (`LICENSE`). **The marks are not MIT** (`TRADEMARK.md` forbids names like "BMad
Pro"). README: *"no paywalled workflows or gated community."* The business is consulting, plus
certification that *"opens soon"* (bmadcode.com). No prices are published.

## Why they might win

- **Scale and momentum.** ★53.8k, 75k npm downloads in the last month, minor releases roughly monthly
  since v6.0 (2026-02-17), a Discord and a YouTube channel.
- **It now decides how much ceremony to use after looking** (v6.12.0): *"Build decides how much ceremony
  a change needs after investigating it, not before."* After reading the code it judges three things:
  **intent gaps, irreversible actions, footprint**. If all are clean, it takes the light path. Anything
  flagged gets a written plan to approve first.
- **It subtracts.** The cast went from nine agents to five (SM, QA and quick-flow folded into dev in v6.3.0;
  the tech writer retired in v6.11.0). Sharding was removed outright. v6.11.0 deleted about 1,900 more
  lines than it added. They A/B-tested a "cynical reviewer" persona and dropped it because it *"made no
  difference"*. Requiring ten concrete findings did make a difference.

## Where they're weak — their users' words

- **Who is it for?** *"an inexperienced or non-technical user does not have the skills to read and
  understand a complex mountain of code, nor to make architectural decisions… Either the method is for
  inexperienced/non-programmer users… or it requires technical supervision"* (#2003, 2026-03-15).
- **Tokens.** *"80k–100k tokens per step"* in create-story (#1235, 2026-01-01). Build and code review run
  *"three byte-identical review layers"*, and a story gets *"permanently stuck at `review`… it looks
  complete, but the sprint tracking says otherwise"* (#2760, open).
- **The human operates the machine.** *"the framework requires WAY more work from a human than is
  needed (operating the implementation cycle, for example - switching between agents etc)"* (discussion
  #1354, 2026-01-18).
- **Churn.** A user following the v7 README ended up with 29 new skills next to 47 old ones (#2841, open).

## How they do it — what touches BOSS's bet

- **Re-entry.** `.memlog.md` is an append-only decision log written only through `memlog.py`. Each line
  is typed `decision|change|override|assumption|event`. At Finalize, every logged item is accounted for:
  it went into the brief, the addendum, or was set aside. `bmad-build` with no argument *"offers any plan
  you left unfinished, then takes the next ready ticket."*
- **Project context with an admission test** (`bmad-project-context`). *"anything derivable from
  source is read live and never stored"*: `pnpm test` stays out, while *"the suite takes eleven minutes"*
  goes in. Paths are re-verified against `git log` on refresh. Mistakes agents keep making are recorded
  as "pitfalls".
- **Fast vs Coaching path, set by stakes.** The brief reads the stakes first (*"passion project…
  investor input"*). Fast batches the gaps and drafts with `[ASSUMPTION]` tags. Coaching pushes back
  section by section.
- **Honest desk research** (`deep-recon` user-voice). Freshness windows. Two independent communities
  for any prevalence claim. *"count distinct voices, not thread length."* *"feature-request boards measure
  willingness to wait, not willingness to pay."*
- **Retirement as data.** `retired.toml` per module, migrations with read-only `detect` signals, and
  forwarding shims, so renames don't strand users. Setup *"never changes a value inside a file."*

## What BOSS could take — candidates for `/vet`

1. **Decide the rung after reading the code: intent gaps, irreversible actions, footprint.** BOSS's
   `/spec` step 0 decides FEAT-or-not from *named slices or more than one release*, which is the
   founder's estimate. BMAD's three facts are observable, and the second is already BOSS's destructive
   path. Worth `/vet` against step 0.
2. **The admission test for context**, in one sentence. *"Derivable from source → read live, never
   stored."* That is BOSS's *facts a command computes are not written here* rule (RESUME), said in a
   way a founder's CLAUDE.md could use. Checked 2026-10-05: of the shipped files, only `/close` says it (about
   RESUME); the founder's `CLAUDE.md` template and `engineering.md` rules don't.
3. **Typed lines in the decision log.** BOSS's devlog and FEAT `## Build log` are prose. Typing
   `assumption` lines would let re-entry list the open ones. Weakest of the three: it may be ceremony.

**Not to take:** the persona names and cast. BMAD itself is folding them back into fewer roles. Also not
desk research presented as user evidence: BOSS's ladder already refuses it.

## What I did not find

Discord and YouTube sizes. Certification and consulting prices (none published). Whether the live docs
site serves v6 or v7 page by page. Whether `bmad-ticket` and `bmad-build` behave as documented (not run).
The platform count disagrees with itself: CHANGELOG v6.5.0 says 42, and v6.12.1's yaml lists 48.

## Change log

- **2026-10-05** — filed on Ajesh's ask.
