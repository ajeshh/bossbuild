---
id: DEC-002
type: decision
owner: "@ajeshh"
decided_by: founder
status: decided
created: 2026-06-23
reversibility: costly
revisit_by: 2026-09-23
---

# DEC-002 — Rebrand: "BlueprintOS" → BOSS (Build Out Solid Stuff)

> Not a supersede of [DEC-001](DEC-001-founder-layer-brain-cut.md) (different subject). BOSS's second
> dogfooded `/decide`. Full identity captured in the brand bible: docs/design/BRAND.md.

## Context

"BlueprintOS" collides with **[gj1342/blueprint-os](https://github.com/gj1342/blueprint-os)** — a
"portable, tool-agnostic AI agent workflow system / operating system for AI agents" using the same
`skills/standards/specs`-as-markdown vocabulary and `npx blueprint-os init`. Same name + adjacent
framing → staying would read as the derivative one (weaker SEO, constant disambiguation).

Ajesh wanted to keep **BOSS** (it kept winning the "is anything as catchy?" test) but rebrand the
long form. A ~21-name lane sweep confirmed the 2026 AI-dev-tooling namespace is **saturated** —
every warm, obvious word (Beacon, Keel, Cairn, Faber, Kiln, Bloom, FirstMate, DryDock…) is already
taken in or beside our lane. The only clean real-word survivor was an obscure one (Stead). So the
durable move is to keep the earned BOSS wordmark and re-found its meaning.

## Decision

- **Name stays BOSS.** Retire "BlueprintOS", "Blueprint", and the "Operating System" framing (the
  collision *and* a label that was never accurate — BOSS is an incubator with a conscience, not an OS).
- **Canonical full form: B.O.S.S. = Build Out Solid Stuff.** (Easter-egg expansions on the About page:
  *Builds, Or Stays Silent* · *Bosses Only Self-Sabotage*.)
- **Slogan: "Make it real."** (tagline only — `makeitreal.com` is an in-lane AI-dev studio; safe as a
  line, not as a name/domain.)
- **Brand story:** the bad-boss-flipped narrative ("the name's a joke; the conscience isn't").
- **Distribution:** domain **boss.build** (backups `boss.sh` / `getboss.dev`); npm package **`bossbuild`**
  (`boss`/`boss-cli` taken); Homebrew via a **tap** (`brew install ajeshh/boss/boss`); GitHub repo →
  `ajeshh/bossbuild`; **CLI command stays `boss`** (package ≠ command — the bin name is always ours).

## Why

- **Kills the collision** the moment "Blueprint" leaves the long form — no namespace fight, no
  disambiguation tax.
- **Sharpens positioning, not just dodges:** dropping "OS" exits the other repo's "OS for agents"
  category and re-asserts the real one (incubator + humane conscience).
- **Keeps the earned identity:** the voice, agents, PRINCIPLES, and muscle memory all survive — a full
  rebrand would have torched accumulated meaning to solve a problem scoped to the *long form*.
- **The full form now says the mission:** "Build Out Solid Stuff" is the anti-pseudo-app thesis
  (PRINCIPLES "why") in the name itself — and it sounds like the seasoned-hand *voice* (unpretentious,
  a little swagger) rather than a deck line.
- **Rejected — full rebrand to a new word:** ~21 candidates, all collided in-lane or were duller than
  BOSS; coining a neologism was an option but threw away earned recognition for ownership we don't need.
- **Rejected — keep BlueprintOS:** the collision is real and adjacent; reads derivative.

## Falsifier — what would prove this wrong, and by when?

Before any public launch (revisit ~2026-09-23): if (a) **boss.build is registered/unavailable** and no
acceptable on-brand domain exists, or (b) the **"boss" word-crowding** proves to actively confuse first
founders / tank discoverability in testing, or (c) a trademark check surfaces a real conflict for a
dev-tool in this class — then reconsider (a coined mark via the path already scoped). Cheap check: the
domain grab + a handful of first-founder reactions settle it before we've sunk rename + launch cost.

### TESTED 2026-08-20 (five weeks early, on Ajesh's *"maybe there's a better name"*) — decision HOLDS

Falsifier **(a) half-fired.** `boss.build` **is registered** — since **2026-01-16**, five months before
this decision picked it — and both named backups are gone (`boss.sh` 2025, `getboss.dev`), as is
`bossbuild.com` (2008). The record here said *"unregistered last checked"*; that came from a WebFetch
seeing no server, which this document itself flagged as *"promising but not proof."* **It was never
true.** But (a)'s second half — *"and no acceptable on-brand domain exists"* — is **false**: several
do. New primary **`oyeboss.build`**, verified at the registry. Falsifier **(b) untested** — the one real
founder ([EVID-001]) reacted to the *offering*, never to the name; n=0 on word-crowding confusion.
**(c)** not run.

**Three independent naming sweeps now agree.** This decision's ~21 craft words (Beacon, Keel, Cairn,
Kiln, DryDock…); 2026-08-19's ~38 trueness words (plumb, assay, datum, touchstone, stead); and a
person/role sweep (guv, honcho, chief, caddie, second). **Two clean survivors in ~75 candidates**
(`stead`, coined `unfool`), both rejected by Ajesh as *"boring — not as catchy as BOSS."* Same verdict
this decision reached in June, from disjoint candidate sets.

**Four candidates died on in-lane collision** — [BELAY Solutions](https://belaysolutions.com) (550
people, sells to entrepreneurs) · [Reckon](https://www.reckon.com/au/) (ASX-listed, 600k SMBs) ·
[Honcho](https://github.com/plastic-labs/honcho) (AI agent memory library, npm SDK, MCP) ·
[HeyBoss AI](https://heyboss.ai) ($3.5M seed led by the OpenAI Startup Fund, no-code AI app builder
for non-technical founders). **All four were the legible ones.** That is the durable finding: in the
2026 AI-dev namespace, instantly-readable words are taken *because* they are instantly readable — so
availability-first sweeps can only return what nobody wanted. **Do not re-run this sweep** without a
new trigger; it has now converged three times.

## Consequences

- **EXECUTED 2026-06-23 (shipped as v0.97.0).** Full rename sweep across the shipped surface: `package.json`
  (`blueprintos` → `bossbuild`, v0.97.0, description, repo/homepage URLs), `VERSION`, `registry/CHANGELOG.md`
  (0.97.0 entry), `README.md` (slogan + full form added), `PRINCIPLES.md`, `docs/` headers (IDS/PATTERNS/
  HUMANE), scaffold templates (L0 CLAUDE.md/AGENTS.md → "Scaffolded by BOSS"), CLI strings (`src/cli.js`,
  `src/learn.js` self-detection kept robust: `/^(boss|bossbuild|blueprintos)$/i`), live `CLAUDE.md` title, and
  local state (`.boss/manifest.json` + `~/.boss/registry.json` name → BOSS, board regenerated). Stray
  `blueprintos-0.96.0.tgz` removed. CLI smoke-tested (`boss --version` → 0.97.0; `boss map` → "BOSS · map").
  Done **irrespective of domain** (Ajesh's call). Intentionally-kept "blueprintos" mentions: the learn.js
  self-detection regex + this CHANGELOG entry (describing the old name / the other repo).
- **Reversible-but-costly:** still cheap to reverse *locally* (nothing published yet); costly once boss.build
  is live, npm is published, and recognition accrues — hence `costly`, not `one-way`.
- **Distribution DONE 2026-06-23:** (a) GitHub repo renamed `ajeshh/BlueprintOS` → **`ajeshh/bossbuild`**
  (commit `38453fa` pushed; remote updated; old URLs auto-redirect); (b) **npm published — `bossbuild@0.97.0`
  is live** (`npx bossbuild`, public); (c) **Homebrew tap live — `ajeshh/homebrew-boss`** (`brew install
  ajeshh/boss/boss` → `boss 0.97.0`, install + run verified).
- **SWEEP COMPLETED 2026-08-05 (v0.140.0) — the 06-23 pass was not as complete as this record claimed.**
  It swept the L0 template's `CLAUDE.md`/`AGENTS.md` but never entered the template's `.claude/`, so for
  six weeks **every scaffolded project** shipped `pm`, `coder-generalist` and `/boss` saying *"scaffolded by
  BlueprintOS"*, a `/welcome` pointing at the old README URL, and — the only functional break — a
  `/feedback` skill filing founder issues against `ajeshh/BlueprintOS` in all three paths (the `gh` call,
  the browser fallback, and the consent line shown to the founder). It survived on GitHub's rename redirect.
  BOSS's own eleven `.claude/agents/*.md` were also still on *"the X for BlueprintOS (BOSS)"*. All fixed;
  a fresh scaffold now greps clean and 61/61 tests pass.
  **Root cause worth keeping:** `.claude/` is gitignored and this machine's `grep` honors `.gitignore` and
  skips hidden dirs — a root `grep -ri blueprintos .` returned 8 files and reported clean on the 16 that
  were dirty. **Identity sweeps here need `find -exec grep`.**
- **SUPERSEDED 2026-08-20 — the domain is `oyeboss.build`, and `boss.build` was never available.** See the
  TESTED block above and BRAND.md. **The wordmark, CLI (`boss`), npm package
  (`bossbuild`) and Homebrew tap are all unchanged** — only the domain moves. Rationale: **"BOSS" alone
  is a title; "oye boss" is a greeting between equals**, and non-hierarchy is the ethos's hidden agenda.
  The disarming currently lives in prose (the bad-boss story, on the About page); the vocative puts it
  in the URL. Runner-up `arreboss` (free on every TLD incl. `.com`) is the closer fit to the
  conscience's *asks-never-blocks* manner — hold it as the fallback if "oye" reads peremptory.
- **Still open: actually register `oyeboss.build`** — verified available 2026-08-20, **not yet bought.**
  ~$15–20/yr. `.ai` was considered and rejected (human vocative, machine TLD). Blocks a *public
  launch*, not the install paths, which all work.
  **This record says "selected," not "owned," on purpose** — writing an unbought domain down as fact is
  the exact mistake that made `boss.build` sit here unverified for eight weeks.
