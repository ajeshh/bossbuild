---
id: FEAT-035
type: feature
owner: product-lead
status: shipped (under Unreleased, 2026-09-13)
proof: stages/L0-quickstart/template/.claude/skills/import/SKILL.md
shipped_on: 2026-09-13
gist: The playbook's holes get filled at the founder's pace through three doors, none a wizard — `/import` accepts pasted text as well as files and, after folding a source into the idea, assesses what else it fills (a count for People, two rivals, a tagline, a person) and writes each record only on a yes, in the owning verb's shape; `/close` gains a noticing step for what the founder said this session that no record holds; `boss playbook --questions` is the target list both read. Notice passively, write explicitly, never invent.
for: the same founder as FEAT-026 — has a deck, a report, a head full of facts, and 23 questions open
created: 2026-09-13
from: IDEA-111
program: business-profile
relates: FEAT-026, FEAT-028, IDEA-106, DEC-008, DEC-003
---

# The intake doors — drop a document, dump into chat, or be noticed

[IDEA-111](IDEA-111-the-intake-three-doors-no-wizard.md)'s build order, minus the pull (already
landed, `590748f`). Three small changes to verbs that exist; no new skill.

## Goal
A founder who drops a deck into `docs/source/`, pastes three paragraphs into chat, or simply says
*"the register has 6,400 agencies"* mid-session sees the right record offered — the People cell, a
rival row, a persona line, a graded signal — and written only when they say yes. The holes close
over weeks, from what the founder already has and already says.

## Assumptions (the plan-time record)
- **Assumed:** `/import` accepts **pasted text** as a source (door 2) — the same steps, no
  `docs/source/` snapshot for a paste (the existing *don't over-capture* rule), a snapshot for a
  real document → _confirmed / corrected to: …_
- **Assumed:** the snapshot is **dated in its name**: `docs/source/YYYY-MM-DD-<original-filename>`
  (a URL: `YYYY-MM-DD-<slug>.md`, URL on line one) — kicked-up #13, and the shape the Market
  chapter and the new `docs/source/README.md` already describe → _confirmed / corrected to: …_
- **Assumed:** the **assessment** runs after the fold (a new step 3b): BOSS reads
  `boss playbook --questions` for the open holes, then names **at most five** things the source
  could fill — one line each: the record, the specific bit (with the page or paragraph), yes/no.
  Each yes is written in the owning verb's shape (a persona is `/persona`'s six fields, a rival is
  a row in `docs/competition/README.md` plus its file, a tagline is a `tagline:` line on
  `docs/BRAND.md`, a count for People is a canvas cell written *with its source and date*). A
  document's number is **a claim with a source, never evidence** (DEC-008) — it fills a cell, it
  never becomes an EVID → _confirmed / corrected to: …_
- **Assumed:** a **transcript** (someone else's words) routes to `/evidence` — graded, a real
  person's words — never to a canvas cell as fact; the assessment says so when it sees one →
  _confirmed / corrected to: …_
- **Assumed:** things with **no record yet** (a founder bio, prior capital, the five-year line)
  are named as *no record holds this yet* and skipped — the assessment never invents a home →
  _confirmed / corrected to: …_
- **Assumed:** `/close` gains **3d · what you said that no record holds** (door 3): re-read the
  session for facts the founder stated in their own words — a count, a price, a rival's name, a
  tagline, who's on the team — check them against `boss playbook --questions`, list at most five
  with the record each fills, ask, write on yes in the owning shape. Silence when nothing was said.
  `/close` is an MVP verb; at Quickstart the pull line and doors 1–2 are the whole intake →
  _confirmed / corrected to: …_
- **Assumed:** no field is added to any template and no loop is added — the harvest-loop precedent
  stays as is; the noticing is a step on a verb the founder already runs →
  _confirmed / corrected to: …_

**Still unknown (didn't guess):** whether `/import` should re-read an old snapshot when a hole it
could fill is still open weeks later (IDEA-111's first open question). Not built; the README tells
the founder to run `/import` on a file already in the folder, which is the manual form.

## Acceptance criteria
- [x] `/import` step 1 names pasted text as a source; step 2 writes dated snapshot names; a new
      step 3b runs the assessment with the five-line cap, the yes/no per record, the owning shapes,
      the DEC-008 line, and the transcript → `/evidence` routing.
- [x] `/close` has step 3d with the same cap and the same *ask, then write* rule; it reads
      `boss playbook --questions`; it says nothing when nothing was said.
- [x] Both skills still pass the shipped-text checks (`npm run check` at its baseline); no vendor
      names; no new field, loop or skill.
- [x] `docs/source/README.md` and the Market chapter agree with the dated-name rule.
- [x] CHANGELOG bullet under `## Unreleased`.

## What "wrong" looks like
- A record written without a yes — a background write launders a guess into a fact.
- A number from a report landing as an EVID, or a transcript's sentence landing in a canvas cell.
- More than five proposals in one pass — the interrogation by another door.
- A "home" invented for a fact BOSS has no record for.

## Paths that must not break
- **Destructive path:** the assessment writes records the founder already has (a persona, a rival
  row). It must **update against what's written** (*"People: the count moved from 6,400 to 5,900 —
  update?"*), never overwrite silently; the existing verbs' own rules hold.
- **Negative path:** a transcript is someone else's words — it never reaches a shareable page as
  fact (FEAT-028 keeps EVID bodies off the playbook).

## Flow
`/import <file|url|pasted text>` → snapshot (documents only) → fold into the idea → **assessment**
(≤5 lines, yes/no) → records written in their shapes → the single next step. `/close` unchanged
until 3d, then the noticing list, then the tree check. No row added to `docs/design/FLOWS.md` (the
flow is a step inside two existing ones).

## Smoke check
- Read both skills as the model would: the assessment step names the cap, the shapes, DEC-008 and
  the transcript route; `/close` 3d reads the questions line. `npm run check` at baseline; the
  quickstart scaffold still copies `docs/source/README.md`.

## Validated learning
- **Learning hypothesis:** holes close faster from what a founder already has than from any
  question BOSS could ask — the first ten founders' playbooks fill from `docs/source/` and chat,
  not from `/canvas` sessions.
- **What result would change the plan:** founders say no to most proposals (the assessment reads
  as noise → cap at two) or the noticing step in `/close` fires on things they meant to keep out of
  the records (→ door 3 goes).

## Out of scope
- Re-reading old snapshots against new holes (open question, above).
- A record for the fields with no home (person, prior capital, vision line) — IDEA-106's sorted list.
- Any change to `boss playbook` beyond what landed.

## Notes
- Source: [IDEA-111](IDEA-111-the-intake-three-doors-no-wizard.md); IDEA-106 kicked-up #13 and the
  sorted table. `/evidence`'s digest already does a version of the assessment for transcripts —
  door 1 on a transcript points there rather than duplicating it.
- Out of the agent's authority: adding a field to a template; writing a record without the yes;
  naming a vendor in shipped text.
- What Ajesh verifies: run `/import` on a real deck in a real project and count the proposals;
  are they the right five, and is a wrong one easy to say no to?

## Build log
- 2026-09-13 — **landed.** Surprise: the new `/import` description ran 472 B against the 420 B
  always-on cap — the gate caught it (`check:manifests`), shortened to 372 B. The three vendor names
  in `/import`'s body predate this FEAT; fixed while the file was open (the 2026-09-12 rule).
- 2026-09-13 — specced. `boss id FEAT` gave 035 (034 is reserved in FEAT-032's prose).
