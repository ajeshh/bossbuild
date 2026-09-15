---
id: IDEA-118
type: idea
kind: capability
owner: Ajesh
status: shipped (2026-09-14, under Unreleased)
proof: src/clock.js
gist: After the 2026-09-10→14 overhaul (202 commits), the surfaces tell one story but the seams between them don't — a rule stated in one reader and not applied in its sibling. Walked end to end (site → boss new → the Quickstart skills → the readers on day 0, day 1, after unlock); seven seams, each small, each a place a first founder would trip.
created: 2026-09-14
program: founder-path
relates: IDEA-114, IDEA-117, IDEA-111, IDEA-106, IDEA-107
---

# IDEA-118 — The seams after the overhaul

## Current shape

Ajesh (2026-09-14): *"weve done a pretty big overhaul of boss in the last few days, i wonder if in
the ux or language or better flow we are missing anything."* Altitude confirmed: the whole founder
path plus the shipped skills' language.

**Method.** Read the site as a stranger (home, Start); `boss new` in a throwaway; read `/welcome`,
`/boss`, `/idea`, `/canvas` as written; ran `status / map / playbook / design / board / recap` on
day 0 (empty), day 1 (one `kind: venture` idea, no evidence), and after `boss unlock mvp`; fired the
conscience hook; read the Kettlewick demo; counted the competing nouns across site / skills / CLI.

**Finding.** Not a wrong surface — a rule kept in one place and not in its neighbour. Seven of them.

## Tasks (the found list — rule 3b)

- [x] **A. Day-0 collapse.** With no `kind: venture` idea, `boss playbook` prints a 32-item line and
  `boss design` 17 ("The ask — mentor-capital — arrives with the next mode…"). `boss board` prints one
  sentence. Same shape for all three: nothing yet → `/boss <your idea>`; the page keeps the questions.
- [x] **B. Day-0 holes point at `/idea`**, the verb that by its own rule asks nothing (`playbook.js`
  vision-why, vision-few-years, product-shape). No venture record → `/boss <your idea>`; `/idea`
  only once the record exists.
- [x] **C. Gate the verbs in every reader, not two.** `verbLine` (arrives with the next mode) is used
  by playbook + design. Ungated on a Quickstart project: `boss recap` → `/log`, `boss status`
  re-entry → `/close`, `boss board` footer → `/spec`. Site, same class: Start's "being wrong has real
  costs" tab says `/ai-failure-states` *from the start* and `/red-team --humane` — both MVP.
- [x] **D. "Who is building it" drawn twice** from one missing `docs/team/` (Vision + Team chapters).
  Dedupe the questions list by source.
- [x] **E. The cohort question in one vocabulary.** Start asks it as four plain phrases; `/welcome`
  and `/boss` as eight slugs. Ask in the phrases, store the slug. Also: a skip writes `null`, which
  `/boss` step 6 reads as never-asked and asks again — `"skipped"` instead. And Start's "changes
  where you start and how fast you climb" — it changes tour depth and the conscience's framing, not
  the mode.
- [x] **F. Copy seams.** Start: `/boss` "asks two things" — it asks three. `/boss` description:
  "stack and stage" → mode. `boss new`: `cd my-app` then `code my-app` → `code .`. `boss unlock`:
  "Now available (7 agents · 16 skills)" describes what was *added*. `boss recap`'s window and every
  `added <date>` use `toISOString()` — UTC; 21:00 PDT on the 14th prints the 15th (14 sites in `src/`
  + the `/log` script).
- [x] **G. The conversation-before-canvas sequence — Ajesh's ruling: no fixed order** (*"talking can
  come whenever"*). So `boss status`'s `Next: /canvas` and the playbook's `start: /canvas` stand. The
  places that *sequenced* it, now unsequenced (*"continue"*, 2026-09-14): the template CLAUDE.md arc
  (*capture → pressure-test · talk to one person (either order) → unlock*), the manifest summary,
  `/boss`'s router row and its demand row, `/welcome`'s closing paragraph, the site's snag line, and
  `boss map`'s loop — a `coreLoop` step may now be a list of verbs with no order inside it, drawn
  `canvas · interview` between the arrows (`coreLoopSteps`; the guide's chips carry no arrows).

## The MVP rung (Ajesh: *"post mvp do we need to check anything"*, 2026-09-14)

Same walk, next rung: a venture idea + canvas + one signal, `boss unlock mvp`, a FEAT at building,
then shipped. The MVP skills' hand-offs are clean (every verb they name is installed by MVP or said
*at V1*). Five seams in the readers:

- [x] **H.** `boss status` on Quickstart: `Ready to build → /spec` — the gate class again; now
  `→ boss unlock mvp, then /spec` until the verb is installed.
- [x] **I.** `boss unlock` printed *Unlocking anyway… the deviation is yours to own* with every
  checkable condition ✓ — a reproach for a lapse that did not happen. A cleared bar says
  *Unlocking. What BOSS cannot check stays yours to judge.*
- [x] **J.** `boss recap`'s *The bet* opened only `docs/ideas/CANVAS.md` (BOSS's own shape), so a
  founder's `IDEA-NNN-canvas.md` with a named riskiest assumption read back as *No canvas yet*. Now
  reads the canvas the playbook reads (`findCanvas`).
- [x] **K.** After the first ship: `boss status` said *Nothing in flight yet — /boss or /idea to
  capture an idea* to someone who had just shipped; now *the board is all shipped — /spec the next
  piece, or /idea what came up while building*. And `boss map` dropped the seven earned skills
  entirely between the predicate flipping and `boss sync` (out of `held`, not yet on disk); now a
  fold line: *+7 earned — a FEAT shipped: /health, /landing, /measure … — `boss sync` lays them down*.
- [x] **L.** `✓ Ready for V1: everything BOSS can check is in place` — V1's bar is one checkable
  condition (a FEAT shipped) and two it cannot see (real users, more than one screen). No tally
  (`readiness.js` refuses one on purpose, and a test pins it); in words: *what BOSS can check is in
  place; the rest is yours to judge*.

Not changed, noted: at MVP with zero code, `boss status`'s standing seam line is V1's
(*a `created_at` on user rows…*) — true, cheap, and early. Leave until a founder says so.

## The adopted-repo door (*"do the adopted-repo door"*, 2026-09-14)

A throwaway repo with real code (manifest, source, tests, CI, a deploy config) at two sizes; `boss
adopt`, the readers, `boss hooks`, `boss remove`, `/read-repo`. Three seams, one family — a rule
added to `applyStage` (new/unlock) and not to `applyStageSafe` (adopt):

- [x] **M. Adopt kept none of the holds.** At MVP it laid down all 28 skills (unlock holds 12 until
  earned) and all ten opt-in hooks (new/unlock hold them until `boss hooks enable`). Now
  `applyStageSafe` takes the same `skipSkills`/`skipHooks`; adopt evaluates the earned predicates
  against the repo being adopted (`holdAtAdopt`) and prints the *held back … `boss sync` lays them
  down* line unlock prints.
- [x] **N. "Shipped" was board-only.** A live adopted repo — the deploy/CI + tests signal adopt itself
  calls *shipped and tested* — had `/measure`, `/health` folded as *for after you ship*. The stamp
  records `shippedBefore: true`; `hasShipped` reads it; the after-you-ship verbs are on disk and
  unfolded for an app that has users.
- [x] **O. The small-repo why line hid what it saw.** A repo under the five-file bar printed only
  *2 source file(s)* — the manifest, tests, CI and deploy it read went unsaid, so the founder could
  see neither why it stayed at Quickstart nor the bar. Now: *2 source file(s) — MVP starts at 5 with
  a build manifest · package.json · tests · CI · deploy config (vercel.json)*.
- [x] **P. `/read-repo`** named `/spec`, `/ai-first-init`, `/design-tokens-init`, `/red-team` with no
  rung (all MVP; a Quickstart adopt has none) and *opt into `secrets-guard`* without the command.
  One check-the-rung sentence and `boss hooks enable secrets-guard`.

Clean as found: the adopt output and Next block, `boss status`'s adopted branch, `/welcome`'s
Path 0, `boss remove`'s preview, the CLAUDE.md marked block.

## Not a task

- **The site's "No analytics" footer beside the GA tag** — raised; Ajesh: *"site has nothing to do
  with app."* The sentence is about the tool. Dropped.

## Capture log
- 2026-09-14 — the walk; seven seams; Ajesh took A–F, ruled G (no order), dropped the analytics note.
- 2026-09-14 — *"continue"*: G applied; A–G done.
- 2026-09-14 — the MVP rung walked (H–L); BOSS's own install synced (29 files, 13 retired loop copies removed, 7 BOSS-tuned agents kept).
- 2026-09-14 — the adopted-repo door walked (M–P). All three doors done: new, adopt, unlock through ship.
