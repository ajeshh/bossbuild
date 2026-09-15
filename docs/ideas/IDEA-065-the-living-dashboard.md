---
id: IDEA-065
type: idea
owner: product-lead
status: shipped (as IDEA-106 → FEAT-026..029, 2026-09-13 — the workbench is `boss playbook`, browsed; folded on Ajesh's "lets combine all ideas into one")
superseded_by: IDEA-106
gist: A local, read-only HTML surface over everything a project has made — canvas, personas, evidence, decisions, board, dossier — so a founder can find their own material instead of recalling where it went.
proof: src/playbook.js
proof_note: The tripwire was laid as src/dashboard.js; the file that shipped is src/playbook.js (`boss playbook`, FEAT-026..029). Tripwire laid in advance, following the `src/board.js` precedent. Nothing is built — this record is deliberately capture-don't-build, and the file named here should not exist until a founder has asked for it.
created: 2026-08-20
source: Ajesh, 2026-08-20 — "im wondering as the lean canvas, personas, other business or ux research
  related or other content is created, if we should have an html local only site, that has all the
  content nicely organized way to surface, so that they can use that content to build the pitch
  deck?" → "maybe its a full dashboard, that also includes the board. and the user can see all the
  documents as sub pages or stuff.." → "and then it can include more components. almost the dashboard
  becomes its own living peak into the entire app. maybe this needs a bigger idea instead of doing it
  piecemeal right now"
relates: FEAT-025, IDEA-015, IDEA-034, IDEA-063
---

# IDEA-065 — The living dashboard

> **FOLDED INTO [[IDEA-106]] on 2026-09-13.** The playbook is one renderer over the same records; the
> *two products* warning below survives there as the *cannot flatter* rule — the evidence state is
> unremovable in every mode. Kept for the reasoning; not a live record.

> **PARKED 2026-08-20** (Ajesh: *"lets park this idea for now"*). `deferred` is the deliberate
> status — a decision, not a backlog item — and the re-open trigger is written at the foot of this
> file. **Captured, not started.** The last line of the seed is the instruction: *"maybe this needs a
> bigger idea instead of doing it piecemeal right now."* This was on its way into [[FEAT-025]] as a
> Layer-5 bolt-on when Ajesh stopped it. He was right — it is not a rung of the business profile, it
> is a surface with its own shape, and grafting it onto a build contract would have committed the
> architecture by accident.

## The idea

A **local, generated, read-only HTML surface** over everything a project has made — canvas, personas,
evidence, decisions, the board, the dossier, research — organized well enough that a founder can
*find their own material* instead of remembering where it went. Over time it becomes "a living peek
into the entire app."

## Don't invent the mechanism — BOSS has proven it three times

- **`boss board --html`** — *"a self-contained HTML page (no server, no deps, no JS framework)… a
  pure projection of the files."* Gitignored deliberately: committing it means a 200-line diff every
  time the board moves, for a file nobody reads from git.
- **`/design-library`** — `index.html` + `components/<name>.html` + `manifest.json`. **Multi-page
  already has precedent**, and it solved the hard part: a **source hash per component**, so a card
  whose source moved renders **stale on the card itself** — *"drift renders ON the component instead
  of in a report nobody reopens."*
- **`/pretotype`** — publishes a real shareable page in one turn, no host, no account.

Whatever this becomes, it is a fourth use of a pattern BOSS already owns, not a new capability.

## 🔴 The line it must respect — and it is not the one you'd expect

BOSS has twice refused to build "the app" ([[IDEA-015]], [[IDEA-034]]: drag-drop, swimlanes,
story-points, a `board.json`; [[IDEA-037]]: server, accounts, multiplayer daemon). A *full dashboard
with sub-pages* sounds like it crosses that line. **It doesn't — because the line is state, not page
count.**

> A **view** is a pure projection, regenerated on demand, holding no truth of its own.
> An **app** holds state and gets edited in, and therefore becomes a second source of truth.

A read-only multi-page dashboard regenerated from `docs/` is still a view. It stays one exactly as
long as **nothing is ever edited in it**. The moment a founder can type into it, `docs/` and the
dashboard disagree, and frontmatter-is-truth is dead. **That is the whole guardrail, and it is worth
more than any feature this surface could gain.**

## What it must show, or it becomes a flattery machine

A tidy dashboard makes a thin record look substantial — the same instinct that produces a confident
deck over no evidence, which [[FEAT-025]] Layer 3 exists to refuse. So every artifact renders **with
its evidence state on it**, `/design-library`-style:

| Artifact | What renders beside it |
|---|---|
| persona | its `synthetic% · real%` ledger |
| canvas | its `_(not yet)_` count, not only its filled cells |
| `EVID` | the grade (stated-pain / observed-behavior / commitment), never a bare count |
| `DEC` | whether its falsifier is past `revisit_by` |
| anything generated | **stale**, when its source moved since generation |

That last row matters more here than anywhere else. **It is the closest thing BOSS has to the
staleness primitive its loop runtime cannot express** ([[FEAT-025]] Layer 4: `loop-runtime.js`
has a closed three-predicate vocabulary — `exists`, `count_at_least`, `any_file_matches` — all
content/existence, none temporal, so every conscience moment is an *absence* predicate).
A source-hash badge is not a conscience moment — but it is a real staleness signal, and it already
works in `/design-library`.

## Two products, not one — the merge is the failure mode

| | **The dashboard** (this) | **`boss case` / one-pager / deck** ([[FEAT-025]] rungs 2–4) |
|---|---|---|
| Audience | the founder, privately | someone outside |
| Contents | everything made | a curated selection |
| Gate | none — show it all | gated on record completeness |

**The dashboard is the workbench the deck gets built from. It is not the deck.** Merged, you get a
private workbench that looks like a pitch, and a thin record starts reading as a strong one.

## Open questions (the reason this is `exploring`)

1. **Single page with drill-down, or multi-page?** `board --html` says one file; `/design-library`
   says a tree. Volume probably decides, and volume is unknown until a real project has run a while.
2. **What is the unit of navigation** — the artifact type, the idea it belongs to, or time? A
   founder looking for "what do I know about my user" and one looking for "what happened in July"
   want different spines.
3. **Does it subsume `boss board --html`, or contain it?** Two HTML surfaces that both render the
   board is the duplication this record should prevent.
4. **What stops it growing into the app?** "It can include more components" is the seed's own phrase
   and its own risk. A written refusal list, up front, like [[IDEA-034]]'s.
5. **Does it ship at all, or stay a BOSS-local tool?** A founder's need to browse their own docs is
   real; whether it is *BOSS's* job is not obvious.

## Gate

⚠️ **n=0.** No founder has asked for this. The mechanism is cheap precisely because the records
already exist — which is exactly the condition under which something gets built because it would
demo well rather than because someone needed it. EVID-001's compose-and-subtract mandate applies.

**Re-open trigger:** a founder (or Ajesh, on a real project) goes looking for their own material —
a persona, a canvas cell, an old decision — and cannot find it without grepping. That is the
symptom this surface treats. Until then it is a good idea with no demand attached.
