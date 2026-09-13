---
id: IDEA-111
type: idea
owner: product-lead
status: captured
gist: How the playbook's holes get filled over time without an intake wizard — three doors: a founder drops a document and BOSS assesses what it fills; a founder dumps into chat and BOSS sorts it into records; BOSS passively notices what the founder said this session that no record holds, and asks before writing. Notice passively, write explicitly, never invent.
proof: none
proof_note: Nothing built. If it earns a build it is three small changes to verbs that exist (`/import` gains an assessment and accepts pasted text; `/close` gains a noticing step; `boss playbook` prints the open questions), never a new skill.
created: 2026-09-13
source: Ajesh, 2026-09-13 — "do we also now capture more info from a founder to fill all the data, and
  create and organize all the docs in a way, and allow them to update. have we integrated asking all
  these questions to help populate it over time?" → "ok, its not an intake wizard, but people can drop
  in docs we can assess, they can also dump into chat. we need to think how to passively collect or if
  the founder wants to start dropping info." → "also lets think of this as a seed, basic info is canvas,
  but then it scales whenever the user chooses to do more. it could be at any time, not tied to the mvp
  scale lifecycle right?"
relates: IDEA-106, FEAT-026, FEAT-027, IDEA-107, IDEA-097
altitude: what BOSS ships a founder
---

# IDEA-111 — The intake: three doors, no wizard

## The idea

The playbook (IDEA-106) draws every record a founder has and every one they haven't as a hole with
a verb. That is the *pull*. This is the *push*: how the holes fill **over time**, at the founder's
pace, from what the founder already has and already says — never from a questionnaire on day one.
A confident answer with no information is worse than a blank (the brand doc's rule), and *"only the
structure it has earned"* applies to answers as much as files.

## A seed, not a lifecycle

Ajesh: *"basic info is canvas, but then it scales whenever the user chooses to do more … not tied
to the mvp scale lifecycle."* Right — and it is **the records that are ungated, not the verbs.**
Nothing stops a founder having `docs/competition/` at Quickstart; the playbook renders whatever
folder exists, at any mode. What *is* mode-gated is the verb that fills it: `/canvas`, `/idea`,
`/import`, `/persona`, `/evidence`, `/decide`, `/interview` ship at Quickstart; `/comp-eval`,
`/landing` (which seeds `BRAND.md`), `/money`, `/consult` arrive with MVP. So today a Quickstart
founder's Competition hole would point at a verb they don't have.

The seed model resolves it: **the canvas is the seed** (the one thing Quickstart asks for — it is
the Quickstart→MVP gate already); **every other chapter is opt-in at any time, through the doors**.
At Quickstart the universal fill for any hole is door 1 or 2 — *drop what you have, or say it* —
and `/import`'s assessment writes the record in the owning shape whether or not the specialised
verb has arrived. The verb, when the mode brings it, is the *deeper* way in, never the only one. A
hole's verb line therefore reads `/comp-eval — or drop what you know: /import` at Quickstart, and
just `/comp-eval` once it ships. The playbook grows at the founder's pace, and the mode only changes
how much help each door gives.

## The line, first

**Notice passively; write explicitly; never invent.** BOSS may read anything the founder drops or
says and *propose* which record it fills. It writes a record only when the founder says yes to that
record, in the owning verb's shape (a persona is `/persona`'s six fields, a signal is `/evidence`'s
graded record). A record written in the background launders a guess into a fact — the same rule
the task-hygiene and harvest moments already keep.

## Three doors — and what exists behind each today

| Door | Today | The gap | The move (compose, don't add) |
|---|---|---|---|
| **1 · Drop a document** — a deck, a report, a Notion page, a transcript | `/import` snapshots it to `docs/source/` and folds it into the **IDEA doc only** (capture-log entry, current shape) | it never says *what else* the document could fill — a count for People, two rivals, a tagline, a founder bio, a market report's figures — so those stay holes while the answer sits in `docs/source/` | `/import` step 3 grows an **assessment**: *"this speaks to People (a count of 6,400 — source p.4), Competition (Rotawise, CareSheet), Brand (a tagline). Write those in?"* — one line per record, yes/no each, position never grade; then writes in the owning shapes. Kicked-up #13 (dated import) lands here |
| **2 · Dump into chat** — *"here's everything I know about my company"* | `/idea` appends a thought to the capture log; `/evidence` takes what a *person* said; nothing sorts an unstructured dump into records | a founder who types three paragraphs about their team, price and rivals gets one capture-log entry | `/import` **accepts pasted text** (it already says a one-liner needs no `docs/source/` file) and runs the same assessment. Not a new verb: the drop door and the dump door are one door with two mouths |
| **3 · Passive collection** — what the founder said in a session without meaning to file it | the `harvest-loop` watches for a record that *stopped being true* (evidence outpaced the persona → `/persona enrich`); `/close` reads the session and writes RESUME + devlog | nothing notices *"you said the register has 6,400 agencies; the People cell doesn't hold it"* | `/close` gains a **noticing step**: the facts said this session that no record holds, listed with the record each would fill — *ask, then write*. `boss playbook`'s open-questions line is what makes the noticing targeted |

**And the pull that makes all three land:** `boss playbook` prints the open questions after the
path — *"11 questions open · /canvas ×4 · /persona derive · /comp-eval · /decide"* — cheapest
first. The page already computes them; the terminal line is what a founder sees without opening it.

## Where the answers go — organised by the verbs, not by the intake

Every record already has a home and a shape: `docs/ideas/` (the idea, the canvas), `docs/personas/`,
`docs/competition/`, `docs/evidence/`, `docs/decisions/`, `docs/source/`, `docs/BRAND.md`. The
intake writes **into those shapes** and nowhere else; the playbook renders them the day they're
written. The fields with no home yet (IDEA-106 kicked-up: a person record, a `vision:` line, prior
capital, the compliance stance, the AI-defensibility question) get homes in the verbs that own the
adjacent question — one JIT line each, never a new skill.

## The folder — where a founder's own files live

Ajesh: *"how we organize all the business docs in a folder, and text files or anything else they
organize would be clutch."* Today there is one drop folder and it already works passively:
`docs/source/` is where `/import` snapshots a document, and the playbook's Market chapter lists
whatever is in it by name and date — a founder who copies a PDF there by hand, no verb, sees it on
the page at the next render. So the folder exists; what it lacks is (a) a name that says *put your
stuff here* — `source` reads as BOSS's, not theirs — and (b) anything that reads the files beyond
listing them.

**Recommendation, to be ruled on:** one flat folder, dated filenames (`2026-09-13-deck-v3.pdf`),
and **no sub-folders by chapter** — sorting a file into *market* or *competition* is exactly the
judgment door 1's assessment makes, and asking the founder to make it first is the wizard by
another name. The records are the organisation; the folder is the inbox. Every file type BOSS can
read (md, txt, csv, pdf via the host's reader) gets assessed; the rest are listed with their name
and left to the founder. Open: rename `docs/source/` → `docs/inbox/`? (BOSS's own tree uses
`research/inbox/` for the same job — the name already means this here.) A rename touches the
`/import` skill, the Market chapter, `.gitignore`s and every project that has the old folder —
`boss sync` would have to carry it. Cheaper: keep the path, and let the README the scaffold drops
in it say *drop anything here*.

## Updating

By the same doors. A founder who re-drops a newer deck gets the assessment against what's already
written (*"People: the count moved from 6,400 to 5,900 — update?"*). The page is never edited in
place; the records are, and the page re-renders.

## Open

- Does the assessment read `docs/source/` material *once* at import, or re-read it when a hole it
  could fill is still open weeks later? (The second is passive collection over documents — cheap,
  and the founder may have forgotten the deck says it.)
- What the founder says in chat is theirs; what a *transcript* says is someone else's words —
  door 1 on a transcript routes to `/evidence`, graded, never to a canvas cell as fact.
- `/close`'s noticing step: at most N proposals a session, or it becomes the interrogation by
  another door.

## Trigger

Build order, if it earns it (FEAT-031): the pull line on `boss playbook` (an hour) → `/import`'s
assessment + pasted text (door 1 and 2) → `/close`'s noticing (door 3). Each is a change to a verb
that exists.

## Capture log

- 2026-09-13 — the pull landed: `boss playbook` prints the open questions and `--questions` lists
  them; the page's hole verbs and the terminal share one line (`verbLine`), gated verbs point at
  `/import` when the record is droppable. Ajesh, same day: *"the nudge when they see the html and
  it's empty — a prompt in the box to go fill it out"* → the rail now carries `N open · start:
  /canvas`; each hole already carried its prompt and verb. And the folder question, above.
- 2026-09-13 — seed (Ajesh), after the playbook's first two slices landed and the question *"have
  we integrated asking all these questions?"* got an honest *no*.
