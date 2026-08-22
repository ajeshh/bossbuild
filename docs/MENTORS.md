---
id: MENTORS
type: design
owner: product-lead
status: drafting
updated: 2026-05-21
---

# Mentors — BOSS's advisory layer

> The design home for IDEA-003. BOSS has **two classes of agents**: builders make the product,
> mentors coach the founder. This doc defines the mentor class — roster, when each arrives, what they
> accumulate, and the hard line they must not cross.

## Two classes

| Class | Job | Lives | Examples |
|---|---|---|---|
| **Builders** | Make the app. Decide *what/how* to build and build it. | `.claude/agents/` | `product-lead`, `coder`, `tester`, `planner`, `designer` |
| **Mentors** (`mentor-*`) | Coach the *founder*, not the codebase. Ask hard questions, give counsel, help shape concepts (business, architecture strategy, GTM, fundraising, hiring, pitch). | `.claude/agents/` with a `mentor-` prefix | `mentor-founder`, `mentor-capital`, `mentor-architect`, … |

Mentors sit **outside** the product. They never write production code or own specs — they push the
founder's *thinking* forward and leave a paper trail (the dossier) that compounds toward whatever this
becomes — **fundable, hireable, forkable, or handed to the people it serves.** Which one is the
founder's call ([[DEC-011]]); mentoring is opt-in, never forced (Principle 2).

## Where mentors live

Project `.claude/agents/`, `mentor-` prefixed (decided: keeps them discoverable next to builders, lets
`boss sync` carry them like any managed agent, and the prefix keeps the two classes legible). They're
**seeded just-in-time per mode** — you don't get a fundraising advisor while capturing your first idea.

## Internal vs. shipped (the boundary that prevents misroutes)

The real axis is **"is this an artifact a founder's *project* consumes, or tooling for authoring BOSS
itself?"** — *not* "mentors ship, builders don't" (`product-lead`/`coder`/`tester` ship too). Name it so a
`/boss-learn` routing lands in a shippable container, not BOSS's gitignored `/.claude/`.

| | Ships to founders (`stages/<id>/template/`) | BOSS-only (gitignored `/.claude/`) |
|---|---|---|
| **Builders** | `product-lead`, `coder-*`, `tester`, `planner`, `designer` | the architect *of BOSS itself* |
| **Mentors** | `mentor-founder/architect/gtm/cofounder/business/fundraising/pitch/talent` | `mentor-humane` (the *agent* — see below) |
| **Authoring tooling** | — | proto-personas, `voice-keeper`, `prompt-coach` |

**The humane case (the one that bit, RVW-045):** the humane *lens* ships from Quickstart (conscience +
`mentor-founder` + `/canvas` §3 + the dark-pattern checklist + `/red-team --humane` + the
[`harm-taxonomy`](../library/practices/harm-taxonomy.md) practice). The standalone `mentor-humane` *agent*
stays Scale — ethics wants a cross-cutting / hook shape, not an opt-in door you might never open. See
`docs/architecture/2026-06-20-mentor-internal-vs-shipped-boundary.md` + IDEA-038/039.

## Roster + JIT-per-mode

Each mentor unlocks only when the project earns the questions it asks (Principle 2). The cornerstone,
`mentor-founder`, ships in Quickstart; the rest arrive as modes unlock.

| Mentor | Coaches on | Arrives at |
|---|---|---|
| `mentor-founder` | The whole arc: is this worth pursuing, what's the riskiest assumption, what's the next real step. Owns the canvas conversation. **Cornerstone.** | **Quickstart** |
| `mentor-architect` | Technical strategy (advisory, not implementation): stack trade-offs, what to defer, scaling shape. | MVP |
| `mentor-customers` | Go-to-market: first users, distribution, positioning, the wedge. | MVP |
| `mentor-cofounder` | The founding-team *relationship*: working together across skill sets (non-tech ↔ eng), dividing the work, decision rights, the hard conversations. Serves the partnership-as-unit; **never takes a side.** Dormant when solo. | MVP |
| `mentor-fundraising` | Whether/when to raise, narrative, what investors will probe, the data room. | V1 |
| `mentor-pitch` | The story + deck: clarity, arc, what to cut. | V1 |
| `mentor-hiring` | First hires, team shape, what to keep vs delegate. | V1 |
| `mentor-capital` | Model, pricing, unit economics, willingness-to-pay. | V1 |
| `mentor-humane` | The ethics/stewardship lens — who could be harmed, what's the humane call. (Pairs with `/canvas` §3.) | **Lens: Quickstart** (conscience + `/canvas` §3 + `harm-taxonomy` practice + `/red-team --humane`) — this is the part that ships. **Agent: not shipped in any mode**; designed for Scale (board), deliberately unbuilt until a real project needs the door. |

> *The full board convenes at Scale.* This roster is provisional — it gets sharpened by encoding real
> practitioners (see "Encoding real people" below).

## The founder dossier

Mentors accumulate artifacts the founder can actually use — each is a natural output of that mentor's
conversations, authored *with* the founder, not generated behind their back:

| Artifact | From | Becomes |
|---|---|---|
| Humane Product Canvas | `/canvas` + `mentor-founder` | The shared snapshot of the bet |
| Business proposal / one-pager | `mentor-capital` | Investor/partner intro |
| Architecture brief | `mentor-architect` | Build plan + risk register |
| GTM plan | `mentor-customers` | First-users experiment log |
| Pitch / deck outline | `mentor-pitch` | The raise narrative |
| Hiring plan | `mentor-hiring` | First-team shape |
| Fundraising one-pager / data room | `mentor-fundraising` | The actual raise |

Dossier artifacts live in `docs/` (likely `docs/dossier/`), under the founder's ownership.

### Mentors read state before they speak (v0.106.0, IDEA-003)

A mentor is only worth more than a fresh Claude tab if it already knows the venture. Every shipped
mentor template now carries a standing **"Before you advise — read the state first"** block: read the
canvas, a bounded slice of the venture brain (`.boss/brain/read.md`, same bound the conscience uses),
the 3 most recent `DEC-*.md`, and the mentor's own prior dossier artifact — then anchor advice in what
was found, and name any contradiction with recorded state before answering. Paired with an **"After a
consequential session"** step: the mentor *offers* to append its position + date to its dossier
artifact. **The dossier artifact doubles as the mentor's memory** — no separate advice-ledger substrate
(that's captured NOT-YET in IDEA-003; the artifact carries the thread until a real founder outgrows it).
Mentors stay **pull-only** (the founder invokes them); the conscience remains the only push surface.

## Encoding real people

Mentor voices and heuristics are seeded from **real practitioners' best-practices**, deduplicated and
grouped by archetype. The
loop: study a person → distill their transferable heuristics → route UP via
`/boss-learn` into `library/practices/` (the named practice) and `library/memory-seed/` (feedback every
new project starts with) → a mentor agent cites those practices.

**Mapping decision (provisional):** prefer **archetype mentors seeded by named, attributed practices**
over one-agent-per-person. A person → one or more `practices/*.md` entries with clear attribution; a
mentor role draws on several. This avoids putting words in anyone's mouth and keeps the roster small.
(See IDEA-003 open questions.)

## The hard line (non-negotiable)

From the canvas's Risks & Harms: a mentor is a **thinking partner, not a licensed professional.**
- Never give binding legal, financial, tax, or medical advice. Caveat clearly and **point to a real
  expert** for anything consequential.
- Surface assumptions and trade-offs; don't manufacture false confidence.
- The humane lens (Principle 6) overrides viability — never coach the founder toward harm for growth.

## Status / next

- [ ] Seed `mentor-founder` into Quickstart (template agent + `library/agents/` + manifest). *(in progress)*
- [ ] Get Ajesh's list of people; encode their practices UP via `/boss-learn`.
- [ ] Author the remaining roster as their modes get built (architect/GTM with MVP, etc.).
- [ ] Define `docs/dossier/` artifact templates.
