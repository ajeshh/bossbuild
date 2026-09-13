---
id: IDEA-054
type: idea
owner: product-lead
status: shipped (keystone; folded into /evidence 2026-09-12 — one verb reads the size and does the record, the debrief, or the digest)
proof: stages/L0-quickstart/template/.claude/skills/evidence/SKILL.md
created: 2026-07-02
source: Ajesh, 2026-07-02 — "should we give best UX research: how to interview, set up & record,
  surveys, prototype testing, observing usage, how to ask, recruiting beta testers? and then input
  the transcript and BOSS analyzes it and builds product context?"
---

# IDEA-054 — the founder research toolkit (the validate-half study family)

## The seed

Right after `/interview` shipped ([[IDEA-046]]), Ajesh asked the natural next question: should BOSS teach
the *whole* craft of talking to users — interview technique, recording setup, surveys, prototype tests,
usage observation, how to ask, how to recruit beta testers — and then ingest the raw material (a
transcript) and analyze it into product context and graded evidence?

This is the right instinct pointed at the right half. BOSS's whole diagnosed weakness (the Fable step-back,
[[F-step-back-whats-missing]]) is that **it builds superbly and validates thinly.** Every item here is on
the *validate* side of that fault line — so the bias is "yes, but shaped," not "no."

## The unifying insight (the load-bearing design decision)

Do **not** build a research-methods textbook. A pile of "how to run a survey / how to recruit" content
modules fights two BOSS commitments at once: the voice (*assume intelligence, never assume knowledge* — a
competent founder doesn't need a lecture on what an interview is) and Principle #2 (*no premature
ceremony*). BOSS is not Nielsen Norman.

Instead: **every research modality is the same loop, and BOSS owns three of its four steps.**

> **plan the study → (you run it — BOSS never fakes it) → ingest the raw material → extract honestly-graded
> `EVID` → feed product context.**

`/interview` is already the first instance. The family is thin study-type front ends over **one shared
debrief-and-grade spine** that all write into the `EVID` ledger ([[IDEA-045]]). The value BOSS adds is
never "here's how surveys work" — it's *plan the right study for your riskiest assumption, keep you honest
while you run it, and turn what comes back into graded evidence the conscience can read.* The craft tips
ride along JIT and one line at a time, never as a curriculum.

## The modalities, ranked by signal (Mom-Test epistemology)

The `EVID` grade ladder (`stated-pain` → `observed-behavior` → `commitment`) is also the ranking of these
methods. That ordering is the whole point — it stops the toolkit from treating a survey as equal to a
commitment test.

| Modality | Best grade it yields | Status / recommendation |
|---|---|---|
| **Interview** (Mom Test) | stated-pain, sometimes commitment (the ask) | ✅ **shipped** ([[IDEA-046]]). Add a 2-line recording-setup tip JIT; not a module. |
| **Transcript analyze → product context** | inherits the source's grade | ⭐ **build next.** The missing keystone below — Ajesh will use it this week on the June-20 notes. |
| **Usability observation** (watch them use it) | observed-behavior — its sweet spot | IDEA, gated: build when there's a real `/prototype` to put in front of someone. Pairs with [[IDEA-030]]. |
| **Survey** | stated-pain (weakest; Mom Test warns) | IDEA, gated + explicitly ranked *below* talking to people. Useful for reach/segmentation once a bet is roughly known — never as the first move. |
| **Recruiting beta testers** | (enables the others) | IDEA, gated. This is **distribution/GTM muscle** (`mentor-gtm` + [[IDEA-041]]), not the research-debrief spine — keep it in that lane, gated on "you have something worth recruiting *for*." |

## ⭐ The keystone to build next — transcript ingest → analyze → product context

The highest-leverage piece, and the one that partially exists: `/import` already pulls raw material into
`docs/source/`; `/interview debrief` already extracts `EVID` from pasted notes. The gap is a dedicated flow
that takes a **real research transcript** (an interview recording's transcript, a sales call, a support
thread) and:

1. **Extracts graded `EVID`** at scale (many signals from one long transcript, each graded honestly, grade
   inflation pushed back on — the [[IDEA-045]] spine, run over paragraphs instead of a short paste).
2. **Synthesizes product context** — pains, jobs-to-be-done, the words the user actually used (verbatim,
   for the copy later), workarounds observed, objections. Feeds the canvas ([[IDEA-045]] already wires
   receipts into the riskiest-assumption cell) and the venture brain (`read.md`).
3. **Flags the epistemics** — where the founder led the witness / pitched, where "sounds cool" got recorded
   as validation (Fitzpatrick's fluff taxonomy, same as `/interview`'s pitch-detector, at transcript
   scale).
4. **Never fabricates** — it analyzes what's in the transcript; it does not invent quotes or infer
   commitment that isn't there. Synthetic-vs-real honesty stays mechanical.

**Why now (the only honest reason):** Ajesh has the June-20 founding-team conversations to write up as
BOSS's own first `EVID`s. This flow serves that real founder contact — which is the *only* thing that moves
BOSS's riskiest assumption. Building it because "BOSS should have a research suite" would be the exact
build-more-surface trap. Building it because Ajesh will run it on Monday's notes is legitimate.

## Guardrails (hold these across the whole family)

- **BOSS plans and analyzes; it never runs the study or fakes the data.** Personas may *rehearse* questions
  (pre-filter only, standing "personas are not validation" caveat) — they never stand in for a subject.
- **JIT, one tip at a time.** No research curriculum. A recording tip, a sample-size caveat, a leading-
  question warning — each surfaces at the moment it's needed, never as a lesson to read.
- **The grade ladder is the ranking.** A survey is not an interview is not a commitment test. The toolkit
  must make weaker methods *feel* weaker, not flatten them into "research."
- **Recruiting stays GTM, not research.** Don't let it smuggle a CRM/pipeline in ([[IDEA-046]] already drew
  this line for one call; it holds for the family).
- **The whole cluster is downstream of the n=0 truth.** It deepens *validate*; it must never become a
  reason to defer actual founder contact. If a founder is using the toolkit instead of talking to someone,
  the conscience should notice.

## Recommendation

**Build the transcript-analyze keystone next** (serves the June-20 write-up); **capture usability-
observation, survey, and recruiting as JIT-gated sibling IDEAs** with the build-triggers above; **leave
interview as-is** plus a one-line recording tip. Do not build the full suite speculatively.

**Build triggers for the gated siblings** (each earns its build only on a real occasion, per Principle #2):
- *Usability observation* — a real `/prototype` exists and a real person will use it in front of you.
- *Survey* — a bet is roughly known and the question is reach/segmentation across many people, not depth.
- *Recruiting* — you have a specific thing (a beta, a pilot) worth recruiting *for*, and it routes through
  `mentor-gtm`.

## Implementation notes (v0.100.0, 2026-07-02) — keystone shipped

Built the recommended keystone: **`/research`** (new L0 skill,
`stages/L0-quickstart/template/.claude/skills/research/SKILL.md`). Digests a real transcript → graded
`EVID` at scale (IDEA-045 spine over paragraphs) + synthesized product context (verbatim pain / job /
workarounds / objections / segment-fit → canvas + venture brain) + Fitzpatrick fluff-flagging at
transcript scale + the cheapest-next-test pointer. One rule enforced throughout: **analyzes what's in the
transcript, never fabricates.** Seams: `/import` (pull transcript → `docs/source/`), `/evidence` (EVID
schema), `/interview` (its single-call sibling), canvas + `read.md`. Wayfinding: L0 `manifest.json`
(skills + summary), template `CLAUDE.md`, `docs/GUIDE.md`. VERSION → 0.100.0 + `registry/CHANGELOG.md`.
Skill-layer only → conscience eval gate unaffected (**122/0**); `/tmp` verified (`boss map` lists
`/research`, 0 placeholders), registry pruned. **Not committed.**

**The three siblings remain captured-and-gated, NOT built** (survey / usability-observation / recruiting) —
per the recommendation and the n=0 guardrail. `/interview` left as-is (a recording-tip line is a trivial
future JIT add, not worth its own change). The cluster's design decision — *teach the study loop, not a
research textbook* — is the durable takeaway.
