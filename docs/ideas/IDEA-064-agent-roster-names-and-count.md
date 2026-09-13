---
id: IDEA-064
type: idea
owner: product-lead
status: shipped (v0.189.0 — all 5 slices; 7 of 8 proposed renames landed, 1 rejected by the gate)
gist: 15 agents, 10 of whose names fail BOSS's own voice rule — and two of those rows are count problems wearing naming clothes. Subtract first, name second, or you rename twice.
proof: stages/L0-quickstart/template/.claude/agents/mentor-founder.md
proof_note: Slices 1, 2, 3 and 5 have shipped and their artifacts are on disk —
  `stages/L1-mvp/template/.claude/agents/designer.md` and
  `stages/L1-mvp/template/.claude/hooks/schema-guard.js` exist; `ui-designer`, `ux-designer` and
  `db-architect` are gone from `stages/` entirely. The tripwire this record laid for slice 3 fired
  exactly as intended: the file appeared, so the record got updated. What REMAINS is slice 4, which
  produces a decision and not a file — it is gated on running the eight proposed renames past
  `persona-first-product` and `persona-indie-hacker`. Hence `proof: none`: the outstanding work has
  no artifact, and claiming one would be the drift this field exists to catch.
created: 2026-08-20
decides: DEC-005
source: Ajesh, 2026-08-20 — "should we have better names for the agents and mentors, that is better
  more clearer naming. some may stay, some need improvement?" — then, on being shown the grade-
  "i like the designer combining, also i think we should bring designer into mvp, and not keep it at
  v1? im also thinking what if the db-architect is elevated into just one architect? its kinda like a
  cto role, and maybe the mentor and role for architect can be combined? not sure."
program: public-surface
---

# IDEA-064 — The roster has a count problem wearing a naming problem's clothes

> The build record under [[DEC-005]]. The decision holds the *why*; this holds the *slices*.

## The finding

BOSS ships **15 agents**. Graded against its own voice rule — *assume intelligence, never assume
knowledge* — **10 of the 15 names fail**, in three distinct modes:

| Mode | Agents | What breaks |
|---|---|---|
| **Acronym / abbreviation** | `pm`, `mentor-gtm`, `db-architect`, `ui-designer`, `ux-designer` | Needs knowledge, not intelligence. The `first-product`, `non-tech-founder` and `vibe-coder-newbie` cohorts cannot read "GTM". `pm` and `program-manager` also **collide by initialism** and ship side by side. |
| **Named for the discipline, not the question** | `mentor-business`, `mentor-talent`, `mentor-venture` | A founder arrives with a question, not a discipline. "Business" is everything, so it is nothing. **`mentor-venture` reads as VC** — and it is the cornerstone, the first and only mentor at Quickstart, which is the most venture-shaped word in the product for a cohort BOSS thinks is right-sized. |
| **Named for BOSS's internals** | `coder-generalist` | "generalist" describes BOSS's roadmap (it splits into `coder-rust` later), not the founder's need. Its own description opens *"The builder for {{PROJECT_NAME}}."* |

**Kept as-is:** `tester` (plain, honest, universally understood), `mentor-architect`,
`mentor-fundraising`, `mentor-pitch` (all exact).

🔴 **The lead finding is that two of those rows are not naming problems at all.**
`ui-designer`/`ux-designer` and `mentor-architect`/`db-architect` are **count** problems.
Renaming either pair makes the collision easier to read and leaves the duplication standing —
and each rename burns an **append-only** `supersedes.json` entry on a name that then gets deleted.
**Subtract first, name second, or you rename twice.** See [[DEC-005]].

## Slices

### 1. Merge `ui-designer` + `ux-designer` → `designer` — ✅ SHIPPED v0.189.0
One agent owning both halves: the visual system (tokens, type, spacing, motion) and flow/state/
interaction (the five-state requirement, error/empty states, accessibility heuristics).
**Evidence:** BOSS's own gitignored workspace runs exactly one `designer` for the most opinionated
interaction surface in the repo. The split's descriptions require a gloss *every time* they are
named — *"what things look like"* vs *"what things do"*. When the gloss is mandatory, the name is
not what is broken.
**Proof:** `stages/L1-mvp/template/.claude/agents/designer.md` exists; the two old files do not.

### 2. Seat `designer` at MVP, not V1 — and move its tools with it — ✅ SHIPPED v0.189.0
MVP already ships `/design-tokens-init`, `design-tokens-guard.js`, `design-tokens-loop` and
`/landing`. `/design-review` + `/ux-check` move down with the agent. **`/design-library` and
`design-drift-loop` stay at V1** — the library needs a real component set to render from, and the
drift loop is enforcement, so V1's *"the design layer turns on"* story survives.
**Proof:** `stages/L1-mvp/manifest.json` `agents` contains `designer`, `skills` contains
`design-review` + `ux-check`; `stages/L2-v1/manifest.json` contains none of them.

### 3. One architect — and the schema chair becomes a gate — ✅ SHIPPED v0.189.0
`mentor-architect` is the only architect (the CTO-as-counsel). `db-architect` is **not** renamed
and kept: its *design schema before code, review schema before code* discipline ships as a
hook/loop plus a step in `/spec`. The mentor/builder line in `docs/MENTORS.md` is not crossed.
**⛔ Refused: folding schema into the builder.** That is self-review — the failure
`library/practices/testing-with-agents.md` names outright (*agents rewrite assertions to match
broken behavior*).
**Proof:** ✅ `stages/L1-mvp/template/.claude/hooks/schema-guard.js` exists and is unit-verified on
six cases (fires on a bare `CREATE TABLE`; silent when RLS **and** a policy are present; fires
separately on RLS-without-policy; handles quoted and schema-qualified identifiers; ignores
non-schema and seed paths). No `db-architect` string survives anywhere under `stages/`.

### 4. The renames — ✅ SHIPPED v0.189.0 (7 of 8; the gate rejected one)
These names are **read, not typed** (founders meet them in `README.md`, in `/consult`'s routing,
and in the host's agent picker), so the test is whether a founder can read the roster and know who
to ask. **Run the proposals past `persona-first-product` and `persona-indie-hacker` before
committing** — one tests the knowledge assumption, the other tests the venture-posture read.

| Now | Proposed | Why |
|---|---|---|
| `mentor-venture` | `mentor-founder` | "Venture" says VC; it is the cornerstone every founder meets first |
| `mentor-gtm` | `mentor-customers` | Acronym; the job is the first real users |
| `mentor-business` | `mentor-capital` | Vague; "business" covers everything, so it names nothing. **Landed as `mentor-capital`, not `mentor-money`** — see the note below |
| `mentor-talent` | `mentor-hiring` | HR-speak; the job is hire / delegate / keep |
| `mentor-cofounder` | `mentor-partnership` | Promises an AI cofounder; coaches a relationship between two humans |
| `pm` | `product` | Abbreviation; collides with `program-manager` |
| `program-manager` | `planner` | Concept is right (the WHEN vs the WHAT); the name collides |
| `coder-generalist` | `builder` | Later split becomes `builder-rust`; "generalist" is BOSS's word, not the founder's |

The `mentor-` prefix **stays** — it earns its keep by marking the exception (advisory). Prefixing
builders too would add ceremony to make a distinction the absence of a prefix already makes.
⚠️ **Honest cost:** `ui-designer`/`ux-designer`/`pm` are industry-standard. The `eng-builder` and
`returning-founder` cohorts know them, and plainer names read as less rigorous to those two.

### 5. Close the mechanism gap the by-hand audit found — ⚡ LANDED by a concurrent session
`scripts/check-refs.js` **class 4b is already rung-aware** and already does the job — the
`mentor-business` re-runging in v0.189.0 is what built it. Its blind spot is narrow:
``AGENT_REF = /`([a-z][a-z0-9-]*)`/g`` **only matches names in backticks**, so a frontmatter
`owner:` field is invisible. Two MVP templates carry `owner: ui-designer`, and
`templates/prototypes-registry.md` is **not in `FORWARD_OK` at all** — it has no backticked agent
name, so nothing ever asked the question about it.
**The rule:** *every doc BOSS scaffolds at mode N must have an `owner:` that exists at mode N.*

⚡ **Landed mid-write, 2026-08-20, by a parallel session** — `owner:`-frontmatter coverage is in the
v0.189.0 working tree (uncommitted), and **its first two findings are exactly the two templates
above**. `check:refs` is **currently red**. So this slice is no longer *build the checker*; it is
**dispose of the two findings**, and slice 2 is the disposition — seating `designer` at MVP makes
both references correct and the findings disappear.
⚠️ **The wrong fix is adding the two templates to `FORWARD_OK`** — that declares the gap
intentional at the exact moment it stopped being. Same trap as a stale exemption, one step earlier.
**Proof:** `npm run check:refs` green with **no new `FORWARD_OK` entry** for either template.
**Still owed:** a deliberately-broken `owner:` in a template fails the gate (a test, not a hope).

## Order, and what unblocks today

**5 → 1 → 2 → 3 → 4**, and **slice 5 is already done** — the checker landed first by accident
rather than by plan, which is the order this record wanted anyway: it is mechanical, it carries no
naming question, and it makes slices 1–3 verifiable instead of hand-swept. **The repo is red until
slice 2 lands**, so 1+2 are now the unblocked next step rather than a queued one. Slice 4 stays
last — the only one gated on evidence BOSS does not have yet.

## Refusals

- ⛔ **No new agents.** [[EVID-001]]'s mandate is compose **and subtract**. This record removes two
  and renames some; it adds none.
- ⛔ **The mentor/builder line does not move.** A merged mentor+builder architect was the obvious
  read of *"kinda like a CTO role"* and it collapses the one boundary `docs/MENTORS.md` calls hard.
- ⛔ **No rename without the supersede entry.** `supersedes.json` has **never carried a
  `kind: "agent"` entry**; every existing one is a skill. First use gets tested on a real synced
  project, not assumed.
- ⛔ **Not a `/boss-learn` UP-routing.** Nothing here is a proven pattern being promoted; it is
  BOSS's own shipped surface being corrected.

## Open

- **The `designer` name collides across the boundary.** `registry/boundary.json` holds BOSS's
  internal `designer` as `not-yet` *because* ui/ux hold the founder job at L2 — a reason slice 1
  deletes. And `check:boundary` *"fails on an `internal` or `not-yet` artifact that a shipped file
  names anyway."* One of the two must be renamed; the founder-facing one should keep the plain
  name, so **BOSS's internal designer is the one that moves.** Needs a call on what it becomes.
- **Does the schema gate belong at MVP or V1?** `/ai-first-init` at MVP already *"bakes in eval +
  cost + schema + failure-state design from day one"*, which argues MVP. `db-architect`'s own
  reasoning (*"at V1 the data model becomes load-bearing"*) argues V1. Unresolved.


## Shipped, 2026-08-20 (v0.189.0) — slices 1, 2, 5

**Verified end-to-end on a throwaway scaffold**, not just by grep: `boss new` → Quickstart has no
designer · `boss unlock mvp` → `designer.md` + `/design-review` + `/ux-check` land · `boss unlock v1`
→ adds `db-architect` + `/design-library` + `/board` and **does not** re-add a second designer. No
`ui-designer`/`ux-designer` string survives anywhere in a scaffolded project. **155/155 tests pass**;
`check:manifests`, `check:boundary`, `check:backlog`, `check:site`, `check:ladder`, `check:wayfinding`,
`check:dogfood`, `check:freshness` all green.

**What the ripple actually touched**, beyond the two merged files: both stage manifests (arrays +
summaries), `stages/L1-mvp/template/claude-append.md` (a manifest agent named nowhere in the
CLAUDE.md contribution *"will never be invoked"* — `check:manifests` catches this, and it caught it
here), `docs/MENTORS.md`'s internal-vs-shipped table, `web/design.html`, `test/scaffold.test.js`
(the v0.146.0 "read by three, written by nothing" test — its three consumers moved rung), and the
generated trio (`CHEATSHEET`, `site/`, `surface-freshness`).

⚠️ **Two stale `FORWARD_OK` exemptions were DELETED, not edited.** They had declared the
MVP-tokens/V1-designer gap intentional. Once the designer moved, the declaration would have silenced
a check that had just become correct — the failure mode named in [[DEC-005]]'s consequences.

🔴 **A race, worth recording as practice.** A parallel session was applying [[DEC-005]] from these
records at the same time. It got there first on `boundary.json`, `supersedes.json`, the template
`owner:` fields and the L2 summary — and the two sessions **both** appended `designer` to the L1
`agents` array, which shipped a duplicate entry that no gate caught (`check:manifests` validates that
every named agent exists, not that it is named once). Found by reading the array, not by a check.
**The generalisable bit: concurrent agents converging on one plan produce duplicates, not conflicts —
and duplicates pass most gates.**


## Shipped, 2026-08-20 (v0.189.0) — slice 3

**The judgment went to the mentor, the artifact to `/spec`, the enforcement to a hook.** Both
tempting shortcuts were refused and the refusals are the load-bearing part: merging `db-architect`
into `mentor-architect` would make an advisor that owns the schema answer *"is this premature?"*
with a stake in the answer; folding it into the coder is **self-review**.

🔴 **The strongest evidence arrived from BOSS's own history.** `library/practices/data-schema.md`
(v0.142.0) states in its provenance that it was written because *"the knowledge lived ONLY inside
the `db-architect` agent prompt (V1), so nothing could sweep it and no mode below V1 could see
it."* **That is the argument for deleting the agent, filed 47 releases before anyone made it.** The
extraction had already happened; only the chair was left.

**So the coverage got WIDER by removing an agent** — V1-and-opt-in became MVP-and-fires. The
founders in CVE-2025-48757 and MoltBook were nowhere near V1.

⚠️ **A self-caught error worth recording.** The first pass left `db-architect` named in three
SHIPPED template files as explanatory history. A founder scaffolding a *new* project would have
read archaeology about an agent they never had. **`check:refs` cannot catch this** — class 4 flags
a name that belongs to a *different* rung or to BOSS's workspace, and a fully-deleted agent is in
neither vocabulary. Found by reading the scaffolded output, not by a gate. The history belongs in
`supersedes.json`, which `boss sync` shows to projects that actually had the agent.

🔴 **A test-harness bug that would have shipped a broken hook as a working one.** The first
schema-guard test run reported the RLS-on-no-policy case as SILENT. The hook was correct; the
harness was passing invalid JSON, because `echo` expanded `\n` into a raw newline inside a JSON
string literal. **Two of six cases were silently untested and one of them read as a pass.** A
green result from a harness nobody verified is worth less than no result. Rebuilt the payloads
through `json.dumps`.


## Shipped, 2026-08-20 (v0.189.0) — slice 4, and the gate did its job

**The persona check was not a formality — it changed the answer three times.**

| # | proposal | outcome |
|---|---|---|
| 1 | `mentor-venture` → `mentor-founder` | ✅ shipped — strongest for `indie-hacker`; it reclaims a word that persona says has been *"hijacked"* |
| 2 | `mentor-gtm` → `mentor-customers` | ✅ shipped — `indie-hacker` settled the customers-vs-users question: *customers* is the right-sized word, *users* is the free-product framing |
| 3 | `mentor-business` → `mentor-capital` | ✅ shipped — **via `mentor-money`, which never left the release.** See note |
| 4 | `mentor-talent` → `mentor-hiring` | ✅ shipped |
| 5 | `mentor-cofounder` → `mentor-partnership` | 🔴 **REJECTED** |
| 6 | `pm` → ~~`product`~~ → `product-lead` | ✅ shipped, **name changed** |
| 7 | `program-manager` → `planner` | ✅ shipped |
| 8 | `coder-generalist` → ~~`builder`~~ → `coder` | ✅ shipped, **name changed** |

> ⚠️ **Slice 3's name changed once more inside the same unreleased version, and the ledger shows no
> two-hop.** The rename pass chose **`mentor-money`** — reasonable then, because the seat only did
> model/pricing/WTP and it paired with the `/money` skill. Hours later [[DEC-006]] merged the
> fundraising and pitch lenses into that same seat, and "money" undersold two-thirds of what it now
> holds (Ajesh: *"money sounds lame"*). It landed as **`mentor-capital`**.
>
> **`mentor-money` never shipped** — it was born and renamed inside v0.189.0 — so `supersedes.json`
> records `mentor-business → mentor-capital` **directly**, with no intermediate hop. That is
> deliberate: this repo already logged a *"rename's own two-hop trap"*, and a ledger entry pointing at
> a name no founder ever had would be a promise about a thing that never existed.
>
> **Also note what could NOT be used.** `mentor-venture` and `mentor-business` are both burnt names —
> the append-only ledger already sends them elsewhere — so the two most natural fits for a seat that
> now covers the raise were mechanically unavailable.

🔴 **The rejection is the most valuable output.** `mentor-cofounder` was proposed for rename on the
grounds that it over-promises an *AI cofounder*. But read as a **topic** — the way
`mentor-fundraising` and `mentor-pitch` are read — it is *the mentor about cofounders*, which is
exactly what it is. **And its trigger phrases are the founder's literal words** (*"how do I work
with my cofounder"*), so `mentor-partnership` would have made it **less findable for the query it
exists to serve.** A rename that improves the abstraction and degrades retrieval is a bad trade.

🔴 **Two names were changed by a collision check the original proposal never ran.**
- `builder` collides with **"Builders"**, one of BOSS's two agent classes (**59** bare-word uses).
  A `builder` agent sitting inside a class called Builders — alongside `tester` and `designer` —
  reproduces the exact confusion this slice existed to remove.
- `product` appears **352** times as an ordinary noun.

**The tiebreaker in both cases was BOSS's own prose**, which had already voted: the manifests and
CLAUDE.md say *"a PM + a coder"* and *"pm + coder"* wherever they speak plainly. **The name that
gets used naturally when nobody is naming things is the right name.**

⚠️ **A methodological limit, stated because it matters.** The two personas were run **inline from
their definitions rather than as independent agents**. That is the self-review failure this same
record refused for schema, one level up — so the pass was run adversarially (looking for reasons
each rename *fails*) and it did reject and revise. **It is still weaker than an independent run.**
If the renames are ever re-litigated, run the agents.

**Scope:** 93 files rewritten across `stages/`, `library/`, `scripts/`, `test/`, `web/` and the
founder-facing docs, plus 185 `owner: pm` frontmatter fields in BOSS's own records. `pm` was
replaced by **anchored patterns only** (backticked, `owner:`, `name:`, path, JSON literal) so that
`npm` could never match — the one substitution in this set that could have silently broken the
build. History (`CHANGELOG`, `supersedes`, `RESUME-ARCHIVE`, research sessions) deliberately keeps
the old names: a ledger that rewrites itself is not a ledger.

**Verified:** a throwaway scaffold walked all four modes — Quickstart (`coder`, `mentor-founder`,
`product-lead`) → MVP → V1 → Scale (13 agents) — with **no old name surviving anywhere** in the
generated project. 155/155 tests; 8 of 9 gates green.
