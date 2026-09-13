---
id: IDEA-099
type: idea
owner: designer
status: shipped (v0.305.0, 2026-09-11 — the board's subtracted scope; `--idea` deferred with its spec)
gist: A founder's first five minutes with BOSS are all BOSS's furniture and none of their idea — install, name a folder, cd, restart, and only then does anyone hear what they're building. The plugin makes the reorder possible for the first time - hear it, say it back, THEN offer to scaffold. Value before the scaffold.
program: mirror
proof: plugin/skills/welcome/SKILL.md
proof_note: >
  Step 3 "hear it first (step 0 of the ladder)": asks what you're building, points at the `## 2.
  Shape it` heading of the shipped /boss skill under ${CLAUDE_PLUGIN_ROOT}, offers once, writes
  nothing. checkPluginPointers in scripts/check-manifests.js verifies the path and heading (fails
  --strict on a renamed heading — proved). /canvas's "no rung below" line names step 0. `claude
  plugin validate --strict` passes. NOT verified: a live founder walking the door — n=0, which is
  the point of the three behaviours to measure. Two of BOSS's three evidence records describe the
  old ordering (EVID-002, EVID-003); pattern from product-discovery's FIRST-LAUNCH rule.
created: 2026-09-11
relates: EVID-002, EVID-003, DEC-017, IDEA-096, IDEA-097, IDEA-098, COMP-founder-plugins-source-read
---

# IDEA-099 — the door hears the idea first

> Seed: product-discovery's FIRST-LAUNCH rule, read at source 2026-09-11 — *"deliver the result in
> the chat. This is the moment the tool proves its value. Do not mention templates, checklists, or
> CONTEXT.md yet. Then offer persistence (one line)… An unsaved good answer beats a saved empty
> scaffold."* Design target: **TTFV ≤ 60 seconds.** Ajesh: *"like it! lets see how to best go about it."*

## What the founder walks through today

**Plugin path (v0.302.0):** install → `/boss:welcome` → the paragraph → *"idea or repo?"* → *"what
name?"* → `boss new <name>` → `cd` → **restart Claude Code** (hooks load at session start) →
`/welcome` → `/boss <idea>` → *now* someone says the idea back. The idea is heard at step nine.

**npm path:** `npm i -g oyeboss` → `boss new <name>` → `cd` → open Claude → `/boss <idea>`. Heard at
step five, and this path cannot change: `boss new` is a zero-dep CLI with no model in it.

Both paths put the folder before the founder. EVID-003's founder installed, got a scaffold, ran
`/boss`, and felt it *"jumped straight into building."* v0.214.0 moved the reflection ahead of the
repo / licence / cohort questions — inside a project that already existed.

## The reorder — plugin path only

`/boss:welcome` is the first thing that runs *with a model*, so it is the only place the order can
flip:

1. **Hear it.** *"What are you building?"* replaces *"idea or repo?"* — if they type an idea,
   that answered both. (A repo answer still routes to `boss adopt`, unchanged.)
2. **Say it back — the value.** What / Who / Smallest version (`/boss` step 2), plus IDEA-097's
   *why you* and the one interpretation line. This is the artifact. It is in the chat, not in a
   file, and that is fine.
3. **Then offer, in one line:** *"Want me to set this up as a project here?"* Name derived from the
   idea (kebab-cased), shown, confirmable.
4. **On yes:** `boss new <name> --idea <file>` — the plugin writes what it heard to a temp file;
   `boss new` seeds `docs/ideas/IDEA-001-<slug>.md` in exactly `/idea`'s shape, capture-log line in
   their words, IDEA-097's fields set. Then the existing hand-off: `cd`, restart, `/welcome`.
5. **In the project, `/boss` finds a seedling IDEA with a capture-log line dated today** and skips
   steps 1–3 — goes straight to 3.5 (*"ready to build, or more?"*) and the paperwork. Nothing is
   asked twice.
6. **On no or silence:** keep talking. Offer once more after the next thing they say that is about
   the idea. Never block on setup.

**Why the file matters more here than anywhere:** the restart at step 4 kills the chat context. The
reflection would be the one thing the founder got, and it would be gone. `--idea` is what carries
it across.

## Three ways to build the reflection into the plugin, and which one

| Option | How | Cost |
|---|---|---|
| **A. Point, don't copy** | The plugin's skill says *"follow steps 1–3 of `${CLAUDE_PLUGIN_ROOT}/stages/L0-quickstart/template/.claude/skills/boss/SKILL.md`"* — the plugin *is* the repo, so the file is there | zero duplication; one source of truth; the skill text stays a door |
| B. Duplicate the steps | Paste `/boss` steps 1–3 into `plugin/skills/welcome/SKILL.md` | two copies drift; `check:*` would need a sameness gate — the *patch* haytham's constitution warns against |
| C. Plugin writes the IDEA doc itself | Skip `--idea`; the plugin creates the file after `boss new` | breaks DEC-017's *"the CLI is the only writer"*; founder-owned content, but still the plugin reaching into the project |

**Recommendation: A + `boss new --idea`.** The plugin points at the shipped skill; the CLI does the
writing, deterministically, from a file the model wrote in their words. `boss new --ai` already
exists as precedent for a flag that changes what the scaffold does.

## The founder's framing — step 0 (Ajesh, 2026-09-11)

> *"its like scaffolding, we dont need to implement all of boss, but its almost like step 0.
> everything is there but only a few things are setup and then more is setup right?"*

Right — and it is the better name. BOSS's ladder is just-in-time ceremony: Quickstart → MVP → V1 →
Scale, each rung set up only when earned. **The door is that ladder extended one rung down.** Step 0
is *zero things set up* — no folder, no files; the founder's words and BOSS saying them back.
`boss new` is step 1 and sets up the few things Quickstart needs. `boss unlock` sets up more.
*"Everything is there"* is literally true: the plugin carries the whole repo under
`${CLAUDE_PLUGIN_ROOT}` and deploys none of it until the founder says go.

It also says why the board's subtraction below is the right scope and not a compromise: **at step 0
the value is the mirror; at step 1 the value is the mirror remembered.** You build the remembering
(`--idea`) when someone reaches step 1 and needs it — the same rule every other rung already keeps.

*Correction this implies for BOSS's own text:* `/canvas` says *"there is no rung below this one —
the canvas IS the seed."* There is one now. Fix the line when the door ships.

## The board's read — `/consult`, 2026-09-11 (the first run of IDEA-098's movement round)

Convened `mentor-founder`, `mentor-architect`, `mentor-customers`, in isolation, then the two that
split heard each other once.

**Where they converged.** Hear it first — all three. Both evidence records came from the npm path,
which cannot change; **n=0 has walked the plugin door**, so *"the first minute is where we lose
them"* is an inference stitched from two signals about other surfaces — a good one, not a finding.
A three-line reflection is table stakes against raw Claude; the only thing raw Claude would not do
is the stated reading and the one question, and the only thing that survives the restart is the
file.

**Where they split — the load-bearing point.** *Build `boss new --idea` (the carrying) now, or ship
the reordered door as skill text only and measure first?* Architect: the file is the seam that makes
the door honest, and the failure to prevent is the **second ask** (restart, `/boss` re-asks *"what
are you building?"* — EVID-003's sensation, twice). Founder + customers: no plumbing before anyone
has walked through; *"a flag nobody exercises is neither cheap nor observable."*

**What moved.** `mentor-architect` moved on *sequence* on hearing the founder's subtraction — the
second ask *"stops being a bug to prevent and becomes the measurement… a failure dataset for
free."* `mentor-founder` moved on *shape* on hearing the architect's contract — *"a better `--idea`
than the one IDEA-099 sketched; I take both"* — and **held on sequence**: *"ship the hearing, let the
second ask happen to someone, build `--idea` to the architect's spec the day it does."*

**Humane check (run by the conductor, no chair holds it).** The door asks once and offers once;
nothing scaffolds without a go; the reflection is four lines. No attention or agency cost found.
The one thing to hold: the door must not become a vestibule — if it ever needs cohort or
motivation, it has stopped being a door.

**The converged scope — smaller than this file proposed:**
1. `/boss:welcome`'s first question becomes *"What are you building?"* (a repo answer still routes to
   `boss adopt`).
2. It **points, by heading, at `/boss` step 2 only** — What / Who / Smallest / one stated reading.
   Not steps 1–3 (step 1 snapshots into `docs/source/`, step 3 runs `boss id` — both presume a
   project). Not 3.5 — motivation and *it worked* stay in the project where the fields live.
3. **Verify `${CLAUDE_PLUGIN_ROOT}` resolves inside a skill body** before writing the pointer (a
   five-minute experiment, not an assumption), and add a `check:*` that the pointed-at heading exists.
4. Then the offer, one line: *"want me to set this up here as a project?"*
5. **Ship nothing that writes.** No `--idea`, no temp file, no skip branch in `/boss`.

**Deferred, written so it is not rebuilt worse later:** *if carrying is ever earned, `boss new
--idea <file>` places and validates a model-authored IDEA doc — refusing one without frontmatter or a
`^- YYYY-MM-DD` capture-log line — and never composes one; it does not pass through `stampManaged`,
or `boss remove` would one day delete a founder's idea.*

**What to measure, three behaviours, not compliments** (`mentor-customers`): did they *correct* the
reflection (the first observed-behaviour BOSS would ever hold) · did they say *go* to the scaffold ·
did they open a second session within seven days. *"If corrections happen and returns do not, the
door was never the problem."* And `mentor-founder`'s standing point: EVID-003's third question —
*did you come back a second time?* — is still cheaper than any of this and still unasked.

## Open questions — answered by the board where they could be

- ~~Does `/boss:welcome` still fit "three commands is the ceiling"?~~ **Answered:** yes, if the door
  reflects only What / Who / Smallest / one reading — four lines — and never 3.5's questions.
- ~~Where does the temp file live?~~ **Moot:** nothing writes in the converged scope.
- `boss adopt --idea` too? **Deferred with `--idea` itself.**
- Does the npm path get anything? **Still open, and small:** `boss new` could end by naming the next
  step — *"open Claude here and tell it what you're building — `/boss <idea>`"*. Not decided.
- **New, from the board:** does `${CLAUDE_PLUGIN_ROOT}` resolve inside a skill body? Test before
  writing the pointer.

## Refusals

- **No generated value beyond the reflection.** product-discovery delivers *hypotheses*; haytham
  delivers a *verdict*. BOSS's first artifact is the founder's own idea said back plainly, with
  one question — because a founder corrects a wrong reflection faster than they answer anything.
- **Never scaffold without the go.** DEC-017 and the existing skill both say it; the reorder makes
  the go more informed, not optional.
- **No "save this?" nag.** One offer, one re-offer on the next idea-shaped message, then silence.
- **The npm path stays as it is.** A CLI cannot hear an idea.

## Gate

Exploring → ready when the open questions above have answers written here and IDEA-097 has shipped
(the door needs the fields to seed). Build after IDEA-097 and IDEA-098; dogfood IDEA-098's
movement round on this idea's central split (ceremony-first vs value-first) before deciding.

## Capture log

- 2026-09-11 — seeded from the source read. Filed as its own id rather than an IDEA-096 slice: 096
  is *presence* (where founders find BOSS); this is *first contact* (what happens in the first
  minute). Design options and a recommendation recorded; status stays *exploring* until Ajesh reads them.
- 2026-09-11 — the board convened (IDEA-098's first live run). Split on `--idea` now-vs-later;
  the movement round moved both sides — architect on sequence, founder on shape — to a scope
  smaller than this record proposed: the door's question + a pointer to `/boss` step 2 + a check,
  nothing that writes. The call is handed back to Ajesh (step 5 of `/consult`).
- 2026-09-11 — Ajesh: *"build."* **Shipped v0.305.0** at the board's scope. His framing —
  *step 0: everything is there, only a few things are set up, then more* — is the record's name
  for it now, and corrected `/canvas`'s "no rung below" line on the way out.
