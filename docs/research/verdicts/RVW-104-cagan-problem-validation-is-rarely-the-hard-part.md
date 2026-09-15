---
id: RVW-104
type: verdict
owner: pm
status: recorded
created: 2026-09-14
verdict: ADAPT
route: DOWN stages/L0-quickstart/template/.claude/skills/canvas/SKILL.md (one line on the riskiest-assumption step) · the arc itself unchanged
sources:
  - https://www.svpg.com/strong-opinions-loosely-held/ — "Strong Opinions, Loosely Held", Marty Cagan, SVPG, 2026-09-11 (verified at source, read in full; a keynote narrative, no data)
---

# RVW-104 — Cagan: "whether enough people have this problem is rarely hard, and not where the real work is"

## The claim
- **Source:** Cagan's 2026-09-11 keynote narrative, reversal #2 of ten. Inbox:
  `docs/research/inbox/cagan-2026-strong-opinions-loosely-held.md`.
- **Core assertion:** product people over-invest in *problem* discovery — gatekeeping whether a problem
  is worth solving, chasing "the most important problem" (which he calls unanswerable) — and leave too
  little for *solution* discovery. "When a product fails, it's almost always because the solution the
  team came up with just wasn't good enough."

## Attribution
- **Verified at source.** SVPG, 2026-09-11, Cagan's own words, read in full from the page (not the
  fetch summary, whose "quotes" were paraphrases — one of them, *"gatekeepers for determining if they
  have a problem worth solving,"* was real; *"the problem lacked validity"* was not on the page).
- **What it is:** a named practitioner BOSS already cites (`cagan-svpg` in `library/sources.json`),
  speaking from experience, in a keynote. **No data.** Its audience is product teams inside companies
  that have customers — the Product Operating Model — which matters for the rubric below.

## Rubric
| # | Question | Read |
|---|---|---|
| 1 | Contradicts a principle? | **No.** Principle 3 (*build faster without fooling yourself — real pain, real workflows, real buyers*) does not say *validate the problem first*; it says don't fool yourself. Cagan's sentence is compatible: the place people fool themselves is the solution. |
| 2 | Evidence grade | **Practitioner opinion, primary, no data.** A strong name; still n=one career. It is a *reversal* by the person who set the earlier norm, which is worth more than a fresh opinion and less than a study. |
| 3 | Duplicate or sharpen? | **Mostly duplicate, one sharpen.** BOSS already prices *"people say they have this problem"* at the floor of the evidence ladder (`stated-pain`), ships `/prototype` as a legitimate first step (*"build-first is legitimate"*), tests demand with a fake door for a **solution** (`/pretotype` — Savoia's *build the right it*, which is solution discovery in Cagan's terms), and as of today sequences nothing between the canvas and a conversation. The sharpen: the canvas coaches *"the single riskiest assumption"* without saying where it usually lives. Founders write *"people have this problem"* there because it is the easiest cell to feel sure about — and Cagan's line says that is rarely the bet. |
| 4 | Who it serves / harms | Serves `returning-founder` and `eng-builder`, who over-research to avoid building. **Harms `first-product` and `vibe-virtuoso` if read as permission** — "validation is over-invested" becomes "skip talking to anyone," which is the site's snag #2 (*"I built the whole thing and still don't know if anyone wants it"*). And Cagan's *"rarely hard"* assumes customers to ask; a founder on day 0 has none. Scoped, not blanket. |
| 5 | Cost / ceremony | **None added.** One sentence on an existing step; nothing new to run. |

## Verdict: ADAPT
Cagan's point about *form* holds and BOSS already mostly has it: the arc does not gate building on
problem validation, and today's ruling (*no fixed order* between the canvas and the conversation)
removed the last sequencing. What earns a line is the *content* of the riskiest-assumption cell —
say that the bet is usually about the solution, the buyer, or the channel, and that *"people have
this problem"* is the answer to reach for last. The rest — *"validation is rarely the hard part"* —
is **not** adopted as a rule: BOSS's founders start at n=0, and the ladder's floor exists because a
compliment is not a receipt. Cagan's own closing line (AI made delivery cheap, which made discovery
*more* relevant) is the part that agrees with BOSS's front page word for word.

## What changes
- `/canvas` step 5, one sentence after *"name the single riskiest assumption"*: where it usually
  lives, and where it rarely does. Applied in this pass.
- Not changed: `/interview`, `/evidence`, the ladder, `/pretotype`, the Quickstart arc.

## Re-open
- If a real founder's canvas names *"people have this problem"* as the bet and the conversation
  proves it trivially true while the product fails on the solution — Cagan's exact case — the line
  becomes a `caution` frame, not just canvas copy.
- Reversals #1 (business viability) and #5 (predictability — roadmaps as an enabler of thinking we
  know) are worth their own `/vet` against the canvas's Business Model cell and `/roadmap`.
