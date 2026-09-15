---
id: IDEA-082
type: idea
owner: product-lead
status: deferred (trigger-gated — a real non-founder joiner asks for it, in their own words; the record does its whole job by existing)
program: founding-teams
proof: >
  [VERIFIED BY EXPERIMENT, 2026-09-08, at v0.251.0] A throwaway `boss new` project was committed and
  cloned into a second directory to stand in for a second person on a second machine. What TRAVELS:
  `.boss/config.json`, `.boss/manifest.json`, `.boss/managed.json` and all of `docs/` — `boss status`
  and `boss board` both ran correctly in the clone with zero setup and printed the venture's real
  position ("You are here: Quickstart"). What does NOT: the clone was **never registered** in
  `~/.boss/registry.json` (which still held only the original path), and `boss team` in the clone
  printed **"Solo venture. You: @ajeshh"** — the founder's own handle, because the roster is written
  by the founder and the joiner is not in it. Read against the code: `addCollaborator`
  ([src/team.js](../../src/team.js)) only ever adds *someone else*, so a joiner cannot declare
  themselves; and `cmdAdopt` ([src/cli.js](../../src/cli.js)) hard-refuses any directory that already
  has `.boss/manifest.json`. FOUNDER DEMAND is [n=0] — nobody has asked for this.
proof_note: >
  The positive half is stronger than expected and should be protected, not rebuilt: the venture
  record already travels through git, so a joiner who clones is **already oriented**. Every gap below
  is about IDENTITY and STANCE — who BOSS thinks it is talking to — not about state that fails to
  move. Do not design sync. It works.
gist: >
  Every founding-team record BOSS has written points one way: the founder is the BOSS user, and they
  invite people in. This inverts it. The adopter is a cofounder or first hire who brings BOSS to a
  venture that does not have it, to shape and fill the gaps — bottom-up adoption, which is how dev
  tools actually spread. The entry point is `boss adopt` (Ajesh, 2026-09-08: *"adopt is the way"*),
  not `boss new` and not `boss team add`. Two things break: BOSS has no way for a non-owner to say
  who they are, and BOSS's whole ceremony is owner-shaped — `/decide` stamps `decided_by: founder`,
  mentors coach "the founder," the conscience serves the person who owns the call. A first hire
  filling gaps would be authoring decisions they do not own.
created: 2026-09-08
source: >
  Ajesh, 2026-09-08 — "what if its not an entrepreneur but someone from the first hired team or a
  cofounder who wants to use boss to help shape and fill in the gaps. would Boss work for them?"
  Then, on the assessment: "adopt is the way."
---

# IDEA-082 — The joiner is the adopter

## What is actually new here

BOSS has two records in this program already, and **both assume the founder is the BOSS user**:

- [[IDEA-037]] (*BOSS for founding teams*) — slices 1–5a shipped via [[FEAT-021]]: `/decide`,
  `mentor-cofounder`, `boss team`, and the [[DEC-001]] state cut. Its scenarios are *"solo → duo"*
  and *"two friends starting together"*. In every one, **the founder adds the second person.**
- [[IDEA-052]] (*the extended team*) — names this population precisely and parks it: *"people the
  founder hires… they are not cofounders: different stakes, different access, different conscience
  relationship. FEAT-021 built the cofounder layer; hires need a class, not a copy."* But its
  mechanism is `boss team add @handle --role contractor|employee` — again, **founder-initiated.**

This record is the **direction inverted**. Nobody has written down what happens when the person who
finds BOSS is not the one who owns the venture. That is not a config flag on the team layer; it is a
different adoption path with a different first command and a different posture.

It also matters commercially, which is why it is worth a record rather than a footnote: the founder
is a harder person to reach than the engineer who joined them. Bottom-up is how dev tools spread.

## The entry point is `boss adopt`, and it has exactly two branches

`boss adopt` is the right door — it already exists, it is already non-destructive (copy-if-absent +
additive settings merge), and [[IDEA-005]]'s *"adopt at the register the app has earned"* is exactly
the posture a joiner needs: the venture is mid-flight, and handing it Quickstart's spin-up arc would
be the wrong ceremony. `detectStage` already caps at MVP and never auto-climbs to V1.

But the joiner meets one of two repos, and BOSS handles them differently:

**Branch A — the venture never used BOSS** (the common case, and the one Ajesh means). `boss adopt`
runs and works. The problem is silent: it stamps the repo, registers the project, and **assumes the
person who ran it is the founder**. Nothing asks. The joiner is now the implicit owner of a venture
they do not own, and every `/decide` they run will stamp `decided_by: founder`.

**Branch B — the founder already ran BOSS.** `cmdAdopt` refuses outright:
*"already a BOSS project (.boss/manifest.json here). Use `boss sync`…"*. That refusal is correct for
its original purpose and useless here — the joiner's actual need is **to join**, and the message
points them at two commands that do something else. This is the branch the experiment covered, and
`boss team` compounds it by telling the joiner they are a *"Solo venture."*

## What is already right, and must not be rebuilt

The read side works, verified. `.boss/config.json`, `manifest.json`, `managed.json` and `docs/` all
commit ([[DEC-001]] drew this line deliberately), so a clone lands with the canvas, the decisions,
the board and the position already in place. **A joiner who clones is oriented before they type
anything.** That is most of the value of the idea, and it is already shipped.

So the honest scope of this record is small. It is not a "teams feature." It is:

1. **A way for a non-owner to say who they are** — the one thing `boss team` structurally cannot
   express today, because the roster is written from the founder outward.
2. **A stance** — read-and-propose instead of decide.

## The stance problem (the half that is not mechanical)

BOSS's ceremony is **owner-shaped** throughout. `/decide` stamps `decided_by: founder`. The mentors
coach "the founder." The conscience speaks to a person and learns per-person ([[DEC-001]]) on the
assumption that person owns the call. A first hire filling gaps cannot make those calls — and if
BOSS lets them, it quietly manufactures a decision record with the wrong authority on it, which is
worse than no record.

[[IDEA-052]] already drew the hard line from the other side and it holds here without amendment:
*"the conscience serves the founder(s). It never fires at an employee, never evaluates one, never
surfaces founder-tensions to one."* A joiner-adopted BOSS that starts nudging a hired engineer about
the venture's riskiest assumption is workplace-surveillance-adjacent — the exact thing
`harm-taxonomy.md` exists to refuse.

**The resolution this record proposes (not builds):** a joiner does not get a lesser BOSS, they get a
**different verb set**. They can capture (`/triage`), read (`boss status`, `boss board`), and
*propose* — but a decision they author is stamped as proposed, and stays proposed until the owner
ratifies it. `/decide` already carries a `decided_by` taxonomy (founder vs AI-suggested-ratified vs
AI-autonomous); this is one more value in a field that already exists, not a new machine.

## The traps to refuse

- **No accounts, no server, no permissions system.** Same call [[IDEA-037]] already made: build the
  view, refuse the app. Identity is the GitHub login BOSS already resolves, or it is nothing.
- **Don't build a "joiner mode."** A second mode ladder is exactly the roster bloat [[IDEA-052]]
  refuses. The EVID-001 mandate is standing and unspent: **compose and subtract.** Every piece
  above is a composition of something shipped — `boss adopt`, the `decided_by` field, the roster.
- **Don't let this re-open the non-tech-cofounder door** ([[IDEA-037]] slice 6). Different problem.
- **The solo test still governs** ([[IDEA-037]]): build only what also earns its place at n=1. A
  `proposed` decision status passes it — your future self proposes things too. A joiner *role* does
  not.

## Smallest version, if the trigger ever fires

In order, each shippable alone:

1. **`boss adopt` asks one question**: *"Is this your venture, or did you join it?"* — one line,
   default founder, written to `.boss/config.json`. Nothing else changes for a solo founder.
2. **Branch B stops refusing blindly**: when `.boss/manifest.json` exists and the operator's handle
   is not in the roster, say so and point at the one useful action, rather than at `boss sync`.
3. **`proposed` as a `decided_by` value** in `/decide`, with the owner ratifying. Composition, no
   new surface.

## 🔒 Promote trigger (do not build before this fires)

**n=0, and this is a hypothesis about a person who has not spoken.** BOSS's whole evidence discipline
says a plausible persona is not a signal. This promotes to a FEAT via `/spec` when — and only when —
**a real person who is not the founder of their venture asks for it**, in their own words. The two
most plausible arrivals: someone in EVID-003's orbit (a teammate of a founder who already
installed BOSS), or an engineer who finds BOSS and says *"I joined a startup and it has no spine."*

Absent that, this record is doing its whole job by existing.

## Capture log

- 2026-09-08 — captured from Ajesh's question ("someone from the first hired team or a cofounder…
  would BOSS work for them?"). Assessed before capture: the clone/joiner path was **run**, not
  reasoned about (see `proof:`). Prior art located in [[IDEA-037]] and [[IDEA-052]]; both point the
  opposite direction, which is what makes this its own record rather than a thread on either.
  Ajesh confirmed the entry point: *"adopt is the way."*
