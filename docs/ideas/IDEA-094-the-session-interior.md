---
id: IDEA-094
type: idea
owner: product-lead
status: shipped (parts 0–2 and 6 on disk; 3–4 deferred until the host ships a session-list primitive again; 5 folded into IDEA-093 part 6)
gist: BOSS models the session's two boundaries well and its interior not at all — the checklist exists, is durable, and nothing loads it, updates it, or checks it while the work is happening.
program: working-memory
proof: stages/L0-quickstart/template/.claude/hooks/lib/task-hygiene.js
proof_note: >
  Nothing on disk yet. Part 1 is a correction to a file that already ships, so its proof is a
  deletion or a writer — not a new artifact. Deliberately not stubbed: an empty checklist section
  in a file nothing writes is how this record's subject came to exist in the first place.
created: 2026-09-10
relates: IDEA-077, IDEA-078, IDEA-076, IDEA-020, IDEA-093, EVID-001, EVID-003
---

# IDEA-094 — the session interior: the checklist exists and nothing reads it while you work

> Seed: Ajesh, 2026-09-10 — *"we know what idea or feature we are working on… but often I see the
> chat forgetting the checklist of items it's working on, being able to refer where it is in
> completing, and ensuring nothing is missed, or when new stuff is ID'd adding to the list… or open
> questions that still need to be explored. And later on, it's hard to remember the finer details of
> exactly where that feature / idea / program is left and what it's still trying to build."*

> **Sharpened by Ajesh the same day, and it moved the target:** *"the todo issue is happening
> frequently in boss, where **it forgets what it was trying to accomplish as it ids tasks**, and then
> it needs to **reassess everything it built** in the chat session or last, to recollect. It's more
> of **hygiene around remembering tasks id'd**."*

## 🔴 The re-aim — the list that goes missing is not the one BOSS writes down

The first pass of this record audited the **planned** checklist: the FEAT's acceptance criteria,
written at spec time, ticked at `/close`. That audit is still correct and its findings still hold.
**It was aimed at the wrong list.**

The list that actually goes missing is the **emergent** one — the tasks identified *while working*,
which were never in the FEAT because nobody knew about them an hour ago. *"As it ids tasks"* is the
whole phrase: the forgetting happens at the moment of identification, not at the moment of planning.

**BOSS has no artifact for the emergent list at all.** Every mechanism it owns is aimed at work that
was decided in advance:

| The list | Where it lives | Survives the session? |
|---|---|---|
| planned — what we agreed to build | FEAT acceptance criteria | ✅ durable, ticked at `/close` |
| **emergent — what we found while building** | **the conversation, and nowhere else** | ❌ |
| new *scope* found while building | `spun_to:` → a new id | ✅ — but this is a **refusal**, and correctly so |

The third row is why the second one stayed invisible. `spun_to:` looks like the answer and is not:
it exists to stop a FEAT growing criteria mid-flight, and it is right to. **But "this also needs a
migration" is not new scope — it is a task**, and BOSS's only mechanism for a mid-build discovery
pushes it out of the record with nowhere to land.

### The recovery cost is the tell, and it is the same inversion BOSS keeps catching

*"It needs to reassess everything it built to recollect."* That is reconstructing **intent from
artifacts** — and BOSS already has the sentence for why that fails, in `boss craft
testing-with-agents`: *a test derived from the implementation cannot fail.* Same shape here.

> **Re-reading what you built tells you what you did. It can never tell you what you meant to do
> next.** The three things that vanish are precisely the three that left no artifact: the task you
> identified and had not started, the reason you chose this order, and the question you were going
> to come back to.

So the cost is not just the minutes spent re-reading. It is that the re-read **silently returns a
shorter list than the real one** and reads as complete — which is the failure mode this repo
catalogs under a different name every few releases.

## 🔴 Read this before the ladder: this one is evidence-aimed

The design program (IDEA-091/092) and the product program (IDEA-093) were both **craft-driven**, and
both say so. **This one is not.** It is the closest thing BOSS has to a founder describing a
mechanism they want:

> [[EVID-001]] — *"hard to gauge where i am / which stage / how it aligns with my roadmap; **i forget
> what feature i'm building / get adhd**; help me keep focus; **knowing exactly where i am like a
> train line, seeing my progress**; more visual cues to feel like i'm making great headway."*

[[EVID-003]] is the second, independent founder and lands on the same axis from the other side —
`/boss` *"jumped straight into building, rather than checking or saying back."* **n=2 independent,
still `stated-pain`.** Nobody has been observed losing a session to this, and convergence raises
conviction without raising the grade. But it does mean this program **outranks** the two before it,
and that is a real ordering fact, not a preference.

⚠️ **The trap is named in advance, because BOSS already catalogs it.** [[IDEA-076]] is held for
exactly this reason: *a progress surface that cannot go down is a comfort device.* The obvious cure
here — a checklist that fills up and shows a rising bar — is a dark pattern BOSS ships a catalog
against. **Anything built from this record must be able to un-tick.**

## The one move

The checklist **already exists and is already durable.** `/spec` writes acceptance criteria as
`- [ ]`, `/close` ticks them, `boss board` renders `[3/7 criteria]`. That is a real mechanism and it
is not the problem.

The problem is that all three of those happen at the **edges** of a session:

```
session start   →  reentry hook: what you last landed, what you said was next   ✅
      ⋯                                                                         ⟵ nothing
session end     →  /close: tick criteria, write RESUME, write the Build log     ✅
```

**BOSS models the session's two boundaries well and its interior not at all.** Everything the seed
describes — forgetting the list, not knowing where you are *right now*, new items with nowhere to
go, open questions going quiet — lives in that gap. **And the emergent list is the part of the
interior with no artifact at either boundary either**, which is why it is the one that vanishes
rather than merely going stale.

The same shape has now appeared three times: design had a floor and a roof and no middle; product
had both ends of the loop and no return path; this has both boundaries of a session and no interior.
**Worth noticing as a habit, not just as three findings.**

## The ladder — what working memory actually holds

| # | Layer | What it holds | BOSS today | Verdict |
|---|---|---|---|---|
| 0 | **The unit** | what am I building | `FEAT-NNN`, `boss board --next` | ✅ strong |
| 1 | **The list** | what's in it, what's done | `- [ ]` criteria · `/close` ticks · `[3/7]` on the board | ✅ exists — **updated once a session, at the end** |
| 2 | **Live position** | where am I *right now* | — | **absent** — the board shows where you were at the last `/close` |
| 3 | **The inbox** | new items found mid-build | `spun_to:` — a *refusal* for new scope | **absent for sub-tasks**, which are not scope |
| 4 | **Open questions** | what is still unresolved | FEAT *Still unknown (didn't guess)* | written at spec time, **never read back** |
| 5 | **Surviving the middle** | what happens when context dies | `reentry.js` fires on `startup`/`resume` — **deliberately not `compact`** | **absent**, and the designated file is an orphan |
| 6 | **The handoff** | where did I leave this | `/close` → RESUME + devlog + the FEAT's Build log | ✅ strong |
| 7 | **Program state** | where is this multi-part thing | `program:` roll-up | **`--html` only** — one call site, in the HTML renderer |
| 8 | **The gate** | did anything get missed | — | **absent** — nothing catches a FEAT going `shipped` with unticked criteria |

## The five findings, each checked against the filesystem

**1. `.claude/rules/feature-context.md` has zero writers, and it promises a mechanism that does not
exist.** `grep -rln "feature-context" stages/ src/` returns **nothing but the file itself**. It ships
in every MVP project, it is the designated working-state file, and:

- nothing writes it, and no skill, hook, or CLAUDE.md line tells anyone to;
- it says *"When the feature ships, `/close` will compress this to a one-line outcome"* — **`/close`
  has never read this file.** That is [[checkers-state-intents-they-dont-enforce]] again, in a file
  that loads into agent context;
- it holds **Active FEAT · Local decisions · Gotchas** — no checklist, no progress, no open
  questions. It is missing all three things the seed asks for;
- its `paths: src/**` scoping means it loads when Claude opens source code, **not at session start.**

**2. The criteria are ticked at `/close`, so the number is always stale.** `boss board` says
`[3/7 criteria]`, and what it means is *3 of 7 as of the last time you ran `/close`*. Mid-session —
which is all of the session — it is a historical figure. And `/close` is a rule that depends on
remembering, which `src/brain.js` records Ajesh's own verdict on: *"a rule that depends on someone
remembering is not a mechanism."*

**3. The host has a native in-session checklist and BOSS has never once mentioned it.** `TodoWrite`
appears **nowhere** in the shipped surface. This is the same blind spot [[IDEA-077]] found for
`SessionStart` — the host had the primitive the whole time — and it is the single largest lever on
the seed's first complaint, because *"the chat forgetting the checklist"* is a description of a
first-class host feature going unused.

**4. Nothing catches a FEAT shipping with unticked criteria.** `criteriaProgress()` has one
consumer: the renderer. `src/records.js` compares `status` against `proof` and does not look at the
list. So *"ensuring nothing is missed"* has **no gate at the one moment it is cheaply checkable** —
the moment the status line changes to `shipped`.

**5. The one hook at the forgetting event deliberately does not fire there.** `reentry.js` sets
`ARRIVALS = new Set(['startup', 'resume'])` and comments that *"`clear` and `compact` are the founder
mid-session."* **That decision is right for what the hook says** — a "welcome back" line mid-session
is noise. But compaction *is* the forgetting event, [[IDEA-078]] verified the host exposes
`PreCompact`/`PostCompact` and that BOSS uses neither, and the result is that the one moment working
memory actually dies has nothing standing at it.

## The mechanism — checked on this machine, 2026-09-10, and it is better than expected

The question that decides whether anything here can be a **boundary** rather than another sentence
asking the model to remember: **can something outside the model see the list?**

- ✅ **The host has the primitive.** `TodoWrite` is a first-class in-session checklist. It appears
  **nowhere** in BOSS's shipped surface — same blind spot [[IDEA-077]] found for `SessionStart`.
- 🔴 **BOSS's own `.claude/settings.json` *allows* `TodoWrite` in its permission list and nothing
  ever instructs its use.** Permission without practice — the tool is one word away from being used
  and has never been used in this repo's sessions.
- ✅ **The transcript records every tool call with its full input**, and hooks receive
  `transcript_path` on stdin. Verified by parsing a live session: 601 lines, every `tool_use` block
  present with inputs intact. **So the latest todo list is readable from outside the model** — which
  is what turns "keep a list" from a filter into something checkable.
- ⚠️ **`~/.claude/todos/` does not exist on this version** (checked 2026-09-10). The transcript is
  the route, and that is a **host-version-dependent fact with a date on it** — exactly the kind of
  claim `library/practices/` requires a freshness stamp for, and exactly the kind that rots.
- ✅ **The composition point already exists and fires every turn.** BOSS owns a `UserPromptSubmit`
  hook (`conscience.js`) in the shipped template **and at its own repo root**. Nothing new needs
  registering; this is a signal added to a hook that is already running.

**That last point is what makes this cheap.** The mandate says compose and subtract. The highest-
frequency hook BOSS has is already installed in both places, and the state it would need to read is
already on disk.

## The governing constraints

1. **No new verbs.** The mandate holds. Part 1 is a **deletion or an adoption**; the rest are a
   field, a reader, a gate on an existing check, and a hook event the host already sends.
2. **It must be able to go down.** [[IDEA-076]]'s warning is load-bearing here, not a footnote. A
   checklist is honest only if un-ticking is as easy as ticking, and if "7 criteria, 3 done" can
   become "8 criteria, 3 done" without that reading as failure.
3. **The FEAT is the source of truth; the session list is a working copy.** Any sync has one
   authoritative direction. Two lists that can both be right is how the number stops meaning
   anything.
4. **Do not turn the interior into ceremony.** The seed is about *not losing the thread*, not about
   status reporting. If any part of this makes the founder maintain a board instead of building,
   it is the failure mode, and `/roadmap`'s refusal of the backlog-you-tend is the precedent.

## The parts, in order

Ordered by *cost of deferring × cheapness*.

### Part 0 — the emergent list gets a home and a keeper · **shipped v0.293.0**

This is the part the sharpened seed asks for, and it did not exist in the first draft's ordering.
Two halves, and the second is what makes it a mechanism instead of advice.

**The home.** The tasks identified mid-work go somewhere durable the moment they are identified —
the adopted `feature-context.md` (Part 1) under a **Found while building** heading, each row one
line: what it is, and whether it is a task, new scope, or an open question. **The three-way sort is
the whole discipline**, because they have different destinations and only one of them already has a
mechanism: a task stays on the list, new scope becomes `spun_to:` (which is what that field is
actually for), and an open question goes to the questions block so it stops being carried in
someone's head.

**The keeper.** A sentence telling the model to write things down is a filter, and BOSS's own
verdict on filters is on record — *"a rule that depends on someone remembering is not a
mechanism."* The keeper is a signal on the `UserPromptSubmit` hook **that already fires every turn
in both trees**: read the latest `TodoWrite` list from the transcript, compare it against what is on
disk, and fire only on the honest gap — **there are open items in the session's list and nothing
durable holds them.**

Three properties it has to have, and each one is a refusal:

- **It fires on the gap, not on the count.** Not *"you have 6 todos"* — the model can see that. The
  signal is *"4 of these exist only in this conversation."*
- **Silence is the normal output.** A per-turn hook that speaks often gets turned off, and a hook
  that is off is worse than none because the founder believes it is on. Once per session at most,
  and never while the list and the file agree.
- **It never writes the list itself.** Same rule as the `harvest` moment: an artifact updated in the
  background launders a guess into a record. It says the gap exists; the writing is the founder's or
  the model's, in the open.

⚠️ **Named risk, and it is the real one:** this reads host state through a **transcript format BOSS
does not own**, on a host version checked once, on one machine. It must fail silent and fail open —
an unparseable transcript means no signal, never an error and never a guess. And the fact needs a
date on it wherever it is written down, because it is exactly the kind that rots quietly.

### Part 1 — the orphan is adopted or deleted, and it carries the three missing sections · **shipped v0.293.0, inside Part 0**
`feature-context.md` is the artifact this whole record is about and it is currently inert. Either it
gets writers — `/spec` stamps the active FEAT, the session updates it, `/close` compresses it, which
is what it already claims happens — or it goes, because a working-state file nothing writes is worse
than none: it reads as though something is holding the thread.

If adopted, it gains exactly what the seed named and nothing else: **the live list** (mirroring the
FEAT's criteria, not a second set), **found-along-the-way** (the inbox that `spun_to:` correctly
refuses to be, because a discovered sub-task is not new scope), and **open questions**. Its stale
`/close` promise is fixed either way — that sentence is in always-on agent context, which is the
worst place in the repo for a claim that isn't true. *A correction first, a feature second.*

### Part 2 — nothing ships with an unticked list in silence · **shipped 2026-09-13 (Unreleased)**
`recordDrift` gained `unticked-shipped`; `boss status` says *"FEAT-NNN says shipped with acceptance
criteria still open"*, `boss records` names the fraction. First run on BOSS's own tree found FEAT-021 —
six of six unticked since v0.60, every one true on disk: *finished and forgot to tick*. Ticked.
The cheapest real boundary on this list, and the direct answer to *"ensuring nothing is missed."*
`src/records.js` already runs the status-vs-disk comparison; this adds one question to it: a FEAT
whose status says `shipped` with criteria still open either finished and forgot to tick, or didn't
finish. **Both are worth one line.** It reports; it does not block — and unticking stays free, so
this can never become a surface you satisfy by editing checkboxes.

### Part 3 — seed the host's list from the FEAT, and reconcile one way · **DEFERRED — the primitive is gone**
**Claude Code 2.1.268 withdrew `TodoWrite`** (v0.315.0 stopped reading it). There is no host list
to seed. Re-open when the host ships an in-session list primitive again; until then the FEAT's
criteria are the list, and Part 2 is the gate on them.
At the `/spec` → build handoff (and at session start when a FEAT is in flight), the acceptance
criteria become the session's working list on the host primitive BOSS has never used. **One
authoritative direction: the FEAT is truth, the session list is the copy.** This is what makes the
list survive the model's own attention rather than the founder's memory, and it is the part that
speaks to *"the chat forgetting."*

### Part 4 — the list updates when the work happens, not when the session ends · **DEFERRED with Part 3**
Same substrate, same trigger. What survives without the host list: `/log` ticks criteria today;
the *tick-on-`/smoke`-pass* idea stays here as the shape to build if the primitive returns.
`/close` stays, and stops being the only writer. The cheapest honest trigger is the one that already
exists and already means something: **`/smoke` passing**, plus the moment a criterion's acceptance is
actually demonstrated. **The tick is a claim, so it needs the same honesty bar as everything else
here** — ticked because it was shown, never because the turn ended optimistically.

### Part 5 — open questions get read back · **folded into [[IDEA-093]] part 6**
The record itself said design them together; 093's return path is the one place a written-at-
spec-time field gets opened again.
*Still unknown (didn't guess)* is written at the founder's most honest moment and opened again never.
**This is the identical shape to [[IDEA-093]]'s return path** — a field written at decision time that
nothing revisits — and the two should be designed together rather than twice. The natural readers
already exist: `/close`, and the moment a FEAT's status moves.

### Part 6 — program state leaves the HTML · **already shipped — v0.186.0, `boss records --programs`**
The finding was written against `programRollup()`'s one HTML call site and missed the terminal
roll-up that had shipped three weeks earlier under `records`. Nothing to build.
`programRollup()` has one call site and it is inside the HTML renderer, so *"where is this program
left"* — the seed's last clause, and the exact question IDEA-091's seven parts and IDEA-093's eight
raise — is answerable only by generating a web page. A terminal roll-up is the same function with a
different printer.

### Part 7 — the compaction seam · **VETTED 2026-09-11 → REJECT (duplicate), and the vet found the real cause**

Proposed after Part 0 shipped: a `compact` branch on `reentry.js` that re-injects the working file
when the host throws the chat away. Ajesh: *"just need to see thru vetting if this is worth it or
chasing too much."* It was chasing too much.

**The host already does it.** Claude Code's compaction summary carries a **`Pending Tasks:`**
section. Measured on this machine: **7 real compactions, 7 carried the open work forward**, with
surrounding context a file re-read would not have. Caveats kept: one machine, and 2 of the 7
summaries did not follow the standard section template — preservation is *usual*, not guaranteed.
Verdict: **REJECT — duplicate of the host.** Do not re-propose without a compaction observed to
drop a listed task.

🔴 **What the vet surfaced, and it re-diagnoses the seed.** If compaction preserves pending tasks,
the forgetting is not compaction losing the list — it is **tasks that never entered a list**:
identified in prose, never in `TodoWrite`, never in a file. Invisible to the host's Pending Tasks,
to Part 0's keeper, to everything. Consistent with the earlier finding that `TodoWrite` had zero
uses across every BOSS transcript parsed, in a repo that explicitly allows it. **The model narrates
tasks; it does not list them.** So the whole in-chat problem reduces to one behaviour — a task goes
into `TodoWrite` at the moment it is identified — and everything downstream already works from
there.

**The part that replaces this one:** Part 0's keeper watches *list has outrun the files* and cannot
see *there is no list*. A second predicate on the same lib, same hook: **many tool calls, zero
`TodoWrite` calls.** A count, never prose-matching (refused above — it would false-positive
constantly). Fires once, same silences. ~15 lines, no new hook, no new file.

### Part 7 (original) — the compaction seam · **held, and it is [[IDEA-078]]'s deferral, not a new one**
`PreCompact` is where *"the chat forgot"* literally happens. It is held on the same terms IDEA-078
set: the host curve moves, the founder demand is **n=0 for this specific mechanism** (the seed
describes the symptom, not the event), and a hook that writes state at an unpredictable mid-session
moment is the kind of thing that is much easier to ship than to un-ship. **Parts 1–4 make the
symptom smaller without it**, which is the honest test of whether this part is needed: if the list
lives in a file and on the host's own list, compaction costs less.

## Refusals — recorded so they are not re-proposed

1. **A task tracker.** No tickets, no sprints, no burndown. The FEAT's criteria are the list, and a
   second list is the thing this record exists to stop.
2. **A progress bar that only goes up.** Named in the constraints; refused by [[IDEA-076]] already.
3. **A status surface the founder maintains.** Same refusal `/roadmap` makes about the
   backlog-you-tend. Everything here is written by work happening, not by reporting on it.
4. **Estimates, velocity, or time-in-task.** `boss board` already ages a card and that is the
   ceiling; measuring a solo founder's throughput is a comfort device with worse side effects.
5. **Auto-updating the list without the founder seeing it.** The `harvest` moment's rule applies —
   an artifact refreshed in the background launders a guess into a record.
