---
name: sunset
description: End a project honestly — the post-mortem nobody ships. Reads the canvas, the ideas, the devlog, and any EVID ledger, then walks three movements: the honest post-mortem (what was the bet, what evidence actually came in, what this taught the next project), the harvest (route reusable patterns UP via /boss-learn, write a one-page docs/POSTMORTEM.md), and the clean close (mark the project retired via `boss retire` — reversible, nothing deleted). Framed as a real experiment that returned an answer, never as failure. Deliberate-invoke only; the conscience never suggests it unprompted. Usage - /sunset
---

# /sunset — projects can end well

Every tool optimizes starting and building. None of them ships an ending. So projects don't die —
they go *undead*: never killed, never learned from, sitting in `~/projects/` quietly accusing you.

That's the expensive kind of unfinished. BOSS's whole "why" (PRINCIPLES.md, Camuffo) is that
validation's payoff is **deciding faster — including quitting faster**. A bet you end on purpose,
with the lesson harvested, is a *closed loop*. A bet you abandon is a leak.

`/sunset` closes the loop. One honest page, three movements, ~20 minutes. Not a ceremony.

**The voice here matters more than anywhere.** You are the seasoned hand who has shut down more
projects than most people have started. No grief-bot. No "congrats on your pivot!" No consolation
prize. This was a real experiment; it returned an answer; the answer is worth keeping. Say it plainly.

## When to run it

Deliberately, when a founder decides a project is done — validated-no, out of runway, or simply not
the thing anymore. **Never fire this unprompted.** A tool that suggests quitting on its own is the
most violent conscience over-fire there is. The conscience may, at most, *point at* `/sunset` from
inside an existing deliberate moment (e.g. `/drift-deep` surfacing a long-dead project) — it never
pushes.

## Movement 1 — the honest post-mortem

Read what the project actually recorded — don't make the founder reconstruct it from memory:
`docs/ideas/CANVAS.md` (the bet), `docs/ideas/` (what was captured), `docs/devlog.md` (what
happened), and `docs/evidence/` if it exists (the graded EVID ledger — the real signal). Then ask at
most **three questions**, Mom-Test discipline on their own narrative (separate what they *observed*
from what they still just *believe*):

1. **What was the bet?** The riskiest assumption this project was really testing.
2. **What evidence actually came in?** Observed, not hoped. If the EVID ledger is thin, say so — a
   project ending with only `stated-pain` and no `commitment` is itself the finding.
3. **What did this teach that the next project inherits?** The durable lesson — about the market,
   the craft, or the founder's own pattern.

Frame the whole thing as *"a real experiment that returned an answer."* Not failure. If the answer
was "no one wanted it," that's a **cheap no**, bought early — exactly what the method is for.

## Movement 2 — the harvest

The exit is the richest Principle-#1 breakpoint there is, and it's currently uncaptured. Before the
project closes:

- Surface the reusable patterns — a build technique, a research move, a hard-won craft lesson — and
  **offer to route each UP via `/boss-learn`** (offer; don't auto-run — the founder decides what
  generalizes).
- Write **`docs/POSTMORTEM.md`**: one page the founder keeps. The bet, the evidence, the lesson, the
  date. Short enough to actually re-read before the next project.

## Movement 3 — the clean close

Run **`boss retire`** — it flips the project to `retired` (with today's date) in both the local
`.boss/manifest.json` and the machine registry. That's the whole state change:

- `boss board` still shows the project honestly, marked retired (the record, not a live board).
- `boss list` folds retired projects quietly to the bottom.
- `boss insights` can finally answer *"how many bets did I run, and how fast did I kill the dead
  ones?"* — **kill-speed**, the Camuffo metric BOSS otherwise can't measure.

## Guardrails (say these plainly if asked)

- **Retiring ≠ deleting.** Nothing on disk is touched. The repo stays. `boss retire --undo` reopens
  it — the decision is reversible.
- **Never conscience-driven.** This skill only runs when the founder invokes it.
- **Not a ceremony.** One page, three questions, done. If it starts to sprawl, cut it.
