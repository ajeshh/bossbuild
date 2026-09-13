---
id: IDEA-030
type: idea
owner: product-lead
status: shipped
gist: Idea in, hit go, a running thing you can click in five minutes. BOSS stops at scaffold today; the magic moment is a live prototype real enough to react to.
proof: stages/L0-quickstart/template/.claude/skills/prototype
created: 2026-06-20
reopened: 2026-08-24 — see the change list appendix. Shipped since v0.52 with a misattributed
  citation and a rule built on its fabricated half; three further changes are evidenced.
relates: IDEA-074, EVID-001, EVID-003, SESSION-2026-08-24-prototype-generation-craft
---

# IDEA-030 — "Drop an idea and hit go" (fast path to a runnable prototype)

> **DECIDED + BUILT v0.52** (Ajesh, 2026-06-20): *"not just vibe coding, but not gatekeeping until so
> much thought… building first in a lean cycle is a place to start, not waiting until the other 2 are
> clear. People can fill in the missing pieces after they get the gist out of their head and see
> something tangible."* This resolves the tension **in favor of building** + answers the open
> questions: **(1)** a new `/prototype` L0 skill (not a `--go` flag — it's its own move); **(2)**
> minimal = the ONE core interaction, mock data freely; **(3)** the conscience fires **AFTER** the
> thing runs (never a gate before — building first IS the legitimate first move); **(4)** stack =
> fastest-time-to-click per idea, not a locked default. Shipped as `stages/L0-quickstart/.../skills/prototype/`.

> Seed: Ajesh, 2026-06-20 — *"if there is a way to quickly build a prototype or actual app quickly
> [it] helps app builders quickly understand an idea and bring it to life quickly… I could see
> someone wanting to drop an idea and hit go."* **Capture + a concrete proposal** — this one is
> philosophically loaded (see the tension), so it wants a shape decision with Ajesh before it's built.

## The want

After `boss new` + `/boss`, BOSS shapes the idea, recommends a stack, and creates the repo — but it
stops at *scaffold*. There's no *"…and here's a running thing you can click in 5 minutes."* The user
wants the magic moment: idea in → **hit go** → a live prototype that makes the idea real enough to
react to. The 2026 research backs the value: vibe coding "raises the floor" (Karpathy); the now-standard
**graduate workflow** is *prototype fast → graduate to a real build* — BOSS could own both ends.

## The tension (why this isn't a no-brainer)

BOSS exists because *AI makes a polished prototype cheap, which creates the pseudo-app trap* — an
impressive demo with no proven pain/fit/willingness-to-pay (PRINCIPLES, the why). A naive "hit go →
app" button is **a pseudo-app factory** — the exact thing BOSS warns founders against. Build it wrong
and BOSS contradicts its own conscience.

## The resolution (how it stays on-principle)

Frame the fast prototype as a **learning instrument, not a product** — honestly, in BOSS's voice:

- **See-it, not sell-it.** The output is explicitly "a thing to *react to and learn from*," never
  "your MVP." The conscience rides along: the moment it runs, the nudge is *what did seeing it teach
  you — and what would it take to know someone wants it?* (→ `/pretotype`, `/canvas`).
- **JIT + optional** (Principle #2) — offered after spin-up, never forced; a Quickstart idea can stay
  a sentence.
- **The graduate ladder is the honesty mechanism** — the prototype is a Quickstart artifact; turning
  it into something real is exactly the `unlock mvp → /spec → /evals` path BOSS already gates. Fast to
  *see*, deliberate to *build for real*.
- **Humane-before-viable holds** — speed serves the founder's *understanding* (Karpathy: the one thing
  they can't outsource), not a rush to ship.

## Concrete proposal (the slice to debate, not yet build)

A **`/prototype`** skill (L0) — or a `--go` branch on `/boss`:
1. Reads the captured IDEA + (if present) the canvas Promises cell for brand anchor.
2. Picks the **fastest runnable stack for *this* idea** (Principle #4, stack-neutral): often a single
   Vite/React page or one HTML file — whatever gets to "click it" fastest, not the "right" production
   stack.
3. Scaffolds a **minimal working slice** (the one core interaction, with the 5-token distinctiveness
   pass from `/design-tokens-init` so it doesn't look generic) and **runs it** (reuses `/run`).
4. Frames it see-not-sell + drops the conscience nudge toward `/pretotype` / `/canvas`.
5. Cohort-aware: `first-product` / `vibe-coder-newbie` get the magic moment + plain narration;
   `eng-builder` gets stack control + an escape hatch; `domain-expert` gets the "this is a sketch, not
   a clinical tool" guardrail up front.

**Staisfies the want without the trap:** fast to a clickable thing; honest that it's a sketch; wired to
the validation discipline so it's a *door into* BOSS, not a detour around it.

## Open questions for Ajesh (the shape decision)

- New `/prototype` skill vs. a `--go` mode on `/boss`?
- How minimal is "minimal" — single interaction only, or a thin end-to-end?
- Does the conscience fire *immediately* on first run (risk: stepping on the magic moment) or on the
  second visit?
- Stack default for the speed path — lock one fast default (Vite) for predictability, or let the coder
  pick per idea?

## Links
`/pretotype` (Savoia — test demand before building) · `/canvas` · `/run` · `/design-tokens-init`
(5-token pass) · [[IDEA-026]] (upstream conscience — the nudge timing question is the same one) ·
PRINCIPLES (the pseudo-app vs real-value spine this must honor).

---

# APPENDIX 2026-08-24 — the change list, graded by confidence

Source: [`SESSION-2026-08-24-prototype-generation-craft`](../research/sessions/SESSION-2026-08-24-prototype-generation-craft.md)
(6 angles, 35 sources, 12 skeptics). Seed: Ajesh — *"how we generate, update, the way it can be
further optimized."* **Nothing here adds a skill.** Ordered by confidence, and the top tier is not a
judgment call.

## TIER 1 — verified defects in shipped text. Fix regardless of everything else.

### 1a. The citation block (SKILL.md:24–29) — three errors in one parenthetical

Ships today: *"**The frame, plainly (Marty Cagan, 2026):** this is building to **learn** — **a
throwaway** to discover whether the idea's worth it… the two modes **stay separate on purpose**."*

- **Cagan credits Jeff Patton in the very article BOSS cites** — *"product coach Jeff Patton… coined
  the phrase."* Patton's talk is ~2018.
- **"a throwaway" is Brooks 1975, which Brooks retracted in 1995.** Zero hits for
  `throw|discard|scratch|rewrit|restart` across all four cited SVPG articles; Cagan says the opposite
  (*"'productize' the live-data prototype"*, *"prototype as spec"*).
- **"stay separate on purpose" contradicts Cagan's footnote 3** — *"not to think of discovery and
  delivery as phases, as in practice these are both continuous."*

**Replacement (drop-in):**

> **The frame, plainly — Jeff Patton's phrase (~2018), popularised by Marty Cagan (2026):** this is
> *building to **learn***, a build whose only job is to answer whether the idea is worth it — value,
> usability, feasibility, viability. Building it *for real* is *building to **earn***: commercial
> quality you can sell, service and support. Cheap delivery made producing bad products faster, so
> the two **purposes** stay distinct. Note they are not *phases* — Cagan is explicit that discovery
> and delivery run continuously — and the sketch you make here often carries forward as the spec.

### 1b. The rule built on the fabricated half (SKILL.md:110–114)

Ships today: *"When the sketch earns a real build, **restart it** on the deliberate path… don't grow
the sketch into production. Fast to see; **rebuild to keep**."* The diagnosis above it is well
attested; the remedy is not. **No RCT, quasi-experiment or matched-cohort comparing rewrite against
incremental hardening exists** — the taproot citation (Brodie & Stonebraker 1993) rests on one
uncited sentence. Boeing names BOSS's exact hazard (*"Reified Prototyping… high-cost
re-engineering"*) and prescribes **incremental upgrade**. 89.3% of AI-introduced issues are code
smells and **77.3% are resolved in place**.

**What IS evidenced, and it is narrower and sharper:**
- **Security** — Veracode 2025: *"only 55% of generation tasks result in secure code… in 45% of the
  tasks the model introduces a known security flaw"*, flat across two years and 150+ models.
  Architectural security failures are not lint you refactor away.
- **Comprehension** — Willison: *"I won't commit any code to my repository if I couldn't explain
  exactly what it does to somebody else."*
- **Naur (1985)** licenses discarding the **text**, never the knowledge — so the sketch stays as spec.

**Replacement shape:** keep *"don't let it quietly become the MVP"* (real, well-attested). Replace
*"restart it"* with a two-question gate at the moment it earns a real build — **"can you explain what
this does?"** and **"where does this touch auth, secrets, or someone's data?"** — then `boss unlock
mvp` → `/spec`, **keeping the sketch as the spec**, not deleting it.

## TIER 2 — evidenced sharpenings

### 2a. "Mock freely" (SKILL.md:104) → right shape, unmistakably fake content

Ships today: *"Sample data, hardcoded values, **fake** responses — all fine for a sketch."* The word
*fake* is carrying a real safety property; do not lose it. But **shape** is where defect-discovery
value lives, and content is where the hazard lives — Omar et al. (*Communications Medicine* 5(1):330,
2025) measured **50–82%** hallucination on fabricated clinical details, mitigation only 66%→44%.

> **Mock in the right shape, never in the right content.** Get the *structure* real — correct field
> types, realistic lengths, the long name that breaks the layout, the empty state, the zero row.
> Keep the *values* unmistakably synthetic: `example.com`, `555-01xx`, obviously-placeholder names.
> **Never invent a domain value that could be mistaken for a fact** — no plausible lab results,
> dosages, case citations, or market figures.

This is the internet's settled convention (RFC 2606 reserves `.invalid` for names *"obvious at a
glance"* to be invalid; NANP reserves 555-0100–555-0199; test card numbers are Luhn-valid). It also
**strengthens the existing `domain-expert` guardrail** and stays consistent with two already-adopted
entries in `library/deceptive-patterns.json` (`claims-fabricated-activity`,
`voice-hallucination-as-truth`).

### 2b. Plurality at SHOWING time — the one place multiple alternatives is evidenced

Tohidi, Buxton, Baecker & Sellen (CHI 2006, N=48) is the only literal 1-vs-3 study: a single design
draws inflated ratings and less criticism. **But the mechanism is social** (*"removed any concern
users might have had in causing disappointment"*) and their H3 **failed** — it identifies problems,
it does not produce solutions. So it belongs at step 6, where the founder shows someone — *"if you're
about to put this in front of someone, two rough versions get you straighter answers than one"* — and
**never as the default output of generation.**

## TIER 3 — the seed's actual question: UPDATE. Thinnest evidence, biggest gap.

`/prototype` is 114 lines with **zero** instances of *iterate*, *again*, *re-run* or *variant*. Step 6
offers the second turn and the skill then says nothing about it. Vendor sources are listicles
(Lovable's history page 404s), so the only rigorous primary is **the host's own** — and it is exactly
what a founder needs to be told:

- **Claude Code checkpointing tracks Write/Edit/NotebookEdit only.** *"Changes made through Bash
  commands are not tracked"*, subagent edits are not tracked, *"Creating, moving, or deleting
  directories is not undone"*, and *"It does not rewind the conversation itself."*
- **So the founder's real safety net is git, and `/prototype` never mentions it.**

**Proposed additions (all inside the existing skill):**
1. **Step 4.5 — one commit before the first run.** `git init` if needed, commit the sketch. One line
   to the founder: *"committed, so you can always get back to this version."* This is the highest-value
   change in the whole list and it costs one command.
2. **A "coming back to it" step** — on a second `/prototype` against an existing sketch: read what's
   there, **change that**, don't regenerate. Say which file changed.
3. **Name the escape hatch in plain words** — *"`/rewind` puts the files back; it won't undo anything
   I did with shell commands, and git is what actually protects you."* ⚠️ Host fact — pin the Claude
   Code version, not a date (the v0.218.0 lesson).

## ⛔ REFUSED — searched for and rejected, with reasons

| Proposal | Why refused |
|---|---|
| Generate 3 variants by default | Dow held prototype count **constant**; divergence did not predict quality; AI examples **increase** fixation (BF=124, CHI 2024); choosing among 3 AI options buys **zero** ownership over being handed 1 (p>.99); the number 3 has no empirical parent. Contradicts time-to-first-click and deletes step 2's correctable one-line pick. |
| Sketchy/ugly styling so it reads as unfinished | The doctrine is **N=1** (Wong, CHI '92 poster). Landay's own lab failed to confirm it: "finished" 8.13→7.13 **ns**, and critique shifted to **visual nitpicking**. The one controlled test of sketchy rendering is null. Aesthetic-usability effect runs the other way. |
| Domain-realistic mock content | 50–82% fabrication on domain details; JAMA Ophthalmology 2023 (fabricated "300 eyes… 250 patients"); Replit's *"4,000-record database full of fictional people"*. Obvious fakeness **is** a safety label. |
| A new skill / a 23rd verb | [[EVID-001]]/[[EVID-003]] standing mandate: compose and subtract. |
| Any ceremony before the first click | The skill's whole thesis, and it survived the pass intact. |

## Next steps, in order

1. **Tier 1 is a release** — it changes shipped founder-facing text. ⚠️ **Blocked right now:** a peer
   session holds an uncommitted **v0.222.0** (VERSION + CHANGELOG modified 09:55, `mentor-architect.md`
   and L0 `CLAUDE.md` modified 09:54). Do not bump into it. Land Tier 1 after v0.222.0 commits.
2. **`/vet` the three Tier-2/3 survivors** — they arrive already 3-vote-narrowed; tell `/vet` it is
   judging the narrow form, not the original claim.
3. **Tier 3 needs one verification** — whether `/run` and `/rewind` are guaranteed present for every
   founder's host, and at which Claude Code version. Pin the version.
4. **Still unresearched:** the schema/DB half (shared with [[IDEA-074]]) — the only stated gap left
   open across both records, and the most defensible next research angle.

