---
id: IDEA-109
type: idea
owner: mentor-customers
status: seedling (a positioning, not a build — the next step is one conversation)
waiting_on: Ajesh — README §License says "never the CLI itself", which closes a door this shape may want open: keep, soften, or write the DEC? (since 2026-09-13)
gist: Position BOSS so an incubator hires Ajesh — a coach-in-residence role (the kind accelerators already have) where he coaches their cohorts AND brings BOSS as the tool that runs alongside every company. An acqui-hire shape, not a sale; the buyer gets the person, the year of judgment calls, and a head start they can run in ten minutes.
proof: none
proof_note: Captured. n=0 founders outside Ajesh have used BOSS; the wedge for this shape is n=1 — one founder in a target incubator's orbit who ran it and said something.
created: 2026-09-13
program: venture
relates: IDEA-106, DEC-009, DEC-011, DEC-019, EVID-001, EVID-003
source: Ajesh, 2026-09-13 — "i could see boss potentially being acquired… but i do plan to keep boss
  free to use" → "its more of an acqui-hire. and them wanting me to build this tool for their offering"
  → "position boss in such a way, that an incubator would wanna hire me.. like yc has a role or other
  incubators have a role, where i could be their coach, but also leverage this kind of tool to help
  their cohorts or companies."
altitude: BOSS's own venture (the Business Model cell), not what BOSS ships a founder
---

# IDEA-109 — the coach-in-residence positioning

## The shape, sharpened over one conversation

It started as *acquisition* and ended as something more specific and more reachable: **a role at an
incubator that already has one** — the coach / EIR / program-side builder — where Ajesh coaches the
cohort and BOSS is the tool he brings. The buyer is not buying a product; they are hiring the person
who spent a year deciding what this thing should and should not do, and getting a running head start
in the same motion.

This is a **third branch** for the Business Model cell, next to *earn* and *sustain* ([[DEC-009]]):
the tool stays free, the person is what is paid for, and the tool's job is to make the person
obviously the right hire.

## What the tree said when checked (2026-09-13)

| A buyer would ask | Answer, measured |
|---|---|
| Stars / forks | 0 / 0 |
| npm downloads, last month | 1,784 — but 13 versions were published in the window, so most of it is mirrors and own installs |
| Commits | 196 of 196 are Ajesh's; bus factor 1 (`CANVAS.md`, Business Model cell) |
| Riskiest assumption | *will a real founder return, and will it change a decision* — **n=0**, with a self-set stopping date of **2026-11-21** |
| Evidence | 3 signals, all stated-pain, none observed, no commitment |
| Licence | MIT everywhere it ships: `LICENSE`, `package.json`, the site footer on every page, `charter.html` (*"take any of it into your own thing"*), `README.md` §License + shape |

**For a sale, those numbers say there is nothing to sell except the person. For an acqui-hire, that
is the whole point.** The bar drops from *prove founders return* to *prove you are the one who can
build this inside our program, and that what exists is a real head start, not a prompt pack.*

## What carries the acqui-hire shape

1. **The demo, not the deck.** `npm i -g oyeboss` → `/read-repo` on one of *their* founders' repos,
   live, ten minutes. Zero deps, no account, nothing to provision. [[IDEA-106]]'s deck is aimed at
   investors; its *Proof* chapter needs a re-aim to *"what I'd build inside your offering."*
2. **The paper trail is the résumé.** 320 releases is a number; 19 DECs, ~100 RVW verdicts with the
   rejections logged, three refresh disciplines, the conscience eval suite — a year of legible
   judgment about *what not to build*. That is the thing an incubator cannot hire generically.
   Bus factor 1 stops being the risk and becomes *you get all of it.*
3. **MIT is an asset here, not a liability.** They can take it in with no licence negotiation. What
   matters instead is that nothing is welded to Ajesh's machine — `.boss/` local, registry
   per-machine, the 19 dev-workspace agents that ship to nobody. One pass to confirm a fresh clone
   runs clean is worth more than any licence change.
4. **One founder other than Ajesh.** n=1, stated-pain grade, is enough for this shape — *"a founder
   in your portfolio ran it on their repo"* is the sentence that gets the meeting, and it is how the
   person who would sponsor the hire hears about it at all. Acqui-hires happen when someone inside
   already wants it.

## The licence question, settled enough to stop carrying

Dropping *"open source"* from the site while `LICENSE` stays MIT and the repo stays public would be
a claim out of sync with its mechanism — the shape BOSS keeps catching in itself. Everything shipped
is MIT forever; a copy edit claws nothing back, and diligence reads the LICENSE file, not the page.
**Keep MIT and the words.** The two honest levers, if optionality matters later: a trademark on the
name and a CLA so copyright stays single-holder. The stronger commitment to reconsider is
[`README.md`](../../README.md) §License + shape — *"never the CLI itself"* — which closes a door
this positioning might want open; that is a DEC to write, not a copy edit.

Also noticed: *free to use* and *open source* pull opposite ways under a change of owner. Once
transferred, *free* is whatever the new owner decides; MIT on what shipped is the only version of
*free* that survives the transfer. If the intent is "BOSS stays free whoever owns it," open source is
the mechanism.

## Open questions (written as questions, not carried)

- Which incubators actually have this role, by name of the role, and who holds it today? (A list to
  grep, not a guess — `/comp-eval` shape.)
- Does the *Proof* chapter of [[IDEA-106]] get a second profile (*for a program*), or is it one
  chapter re-aimed?
- Does *"never the CLI itself"* stay?

## Next step (one, not a list)

`/interview` — prep the call with a founder in a target incubator's orbit (or its program director).
Mom-Test: how their cohort loses weeks today; one commitment ask. Not a feature. Not the deck.

## Gate

Capture; build nothing. Re-open the build side when one incubator conversation has happened and
says what they would need to see.

## Capture log

- **2026-09-19 — the paper trail as résumé, started as a folder.** Ajesh is building a personal site
  (ajesh.net) and wants BOSS on it as case studies plus one overarching piece, the argument being that
  five hats together (PM · designer · project manager · entrepreneur · engineer) are what made BOSS
  possible, with the humane lens as the tiebreaker. Lives **outside this tree** at
  `~/Projects/ajesh-net/` (its own repo; will become its own Claude project) — `README.md` there
  holds the study list, the exhibits to generate from this tree, and the do-not-inflate list.
  Classification settled: LinkedIn *Experience* (not Projects); the canvas as a separate Project;
  the essay under *Writing* on the site, not under BOSS. Carries item 2 of *What carries the
  acqui-hire shape* above. Nothing in this tree changes for it.
