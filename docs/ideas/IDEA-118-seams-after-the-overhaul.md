---
id: IDEA-118
type: idea
kind: capability
owner: Ajesh
status: building
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

- [ ] **A. Day-0 collapse.** With no `kind: venture` idea, `boss playbook` prints a 32-item line and
  `boss design` 17 ("The ask — mentor-capital — arrives with the next mode…"). `boss board` prints one
  sentence. Same shape for all three: nothing yet → `/boss <your idea>`; the page keeps the questions.
- [ ] **B. Day-0 holes point at `/idea`**, the verb that by its own rule asks nothing (`playbook.js`
  vision-why, vision-few-years, product-shape). No venture record → `/boss <your idea>`; `/idea`
  only once the record exists.
- [ ] **C. Gate the verbs in every reader, not two.** `verbLine` (arrives with the next mode) is used
  by playbook + design. Ungated on a Quickstart project: `boss recap` → `/log`, `boss status`
  re-entry → `/close`, `boss board` footer → `/spec`. Site, same class: Start's "being wrong has real
  costs" tab says `/ai-failure-states` *from the start* and `/red-team --humane` — both MVP.
- [ ] **D. "Who is building it" drawn twice** from one missing `docs/team/` (Vision + Team chapters).
  Dedupe the questions list by source.
- [ ] **E. The cohort question in one vocabulary.** Start asks it as four plain phrases; `/welcome`
  and `/boss` as eight slugs. Ask in the phrases, store the slug. Also: a skip writes `null`, which
  `/boss` step 6 reads as never-asked and asks again — `"skipped"` instead. And Start's "changes
  where you start and how fast you climb" — it changes tour depth and the conscience's framing, not
  the mode.
- [ ] **F. Copy seams.** Start: `/boss` "asks two things" — it asks three. `/boss` description:
  "stack and stage" → mode. `boss new`: `cd my-app` then `code my-app` → `code .`. `boss unlock`:
  "Now available (7 agents · 16 skills)" describes what was *added*. `boss recap`'s window and every
  `added <date>` use `toISOString()` — UTC; 21:00 PDT on the 14th prints the 15th (14 sites in `src/`
  + the `/log` script).
- [ ] **G. The conversation-before-canvas sequence — Ajesh's ruling: no fixed order** (*"talking can
  come whenever"*). So `boss status`'s `Next: /canvas` and the playbook's `start: /canvas` stand. The
  places that *sequence* it are the ones out of step: `/boss`'s router row (*an IDEA, no EVID → one
  conversation*), the site's snag line (*usually a conversation, not a canvas*), `boss map`'s loop
  order. His call whether to soften them; not touched in this pass.

## Not a task

- **The site's "No analytics" footer beside the GA tag** — raised; Ajesh: *"site has nothing to do
  with app."* The sentence is about the tool. Dropped.

## Capture log
- 2026-09-14 — the walk; seven seams; Ajesh took A–F, ruled G (no order), dropped the analytics note.
