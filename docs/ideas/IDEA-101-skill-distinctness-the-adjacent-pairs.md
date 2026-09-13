---
id: IDEA-101
type: idea
owner: product-lead
status: shipped (v0.322.0, 2026-09-12 — `/boss-learn` → `/extract`; `/pretotype` ↔ `/prototype` v0.317.0; nine keeps stand)
gist: 48 skills cost ~3k always-loaded tokens (v0.316.0) — small. What 48 costs is CHOICE - can the model, and the founder, pick the right one from the description alone? This is the written read of the adjacent pairs, judged on distinguishability, with keep / sharpen / merge proposals. No cut is made here.
proof: registry/supersedes.json
proof_note: >
  supersedes row `boss-learn → extract` since 0.322.0; stages/L0-quickstart/template/.claude/skills/boss-learn/
  gone; /extract step 6 is checkout-aware; boss sync on a 0.321.0-pinned throwaway printed the migration
  (verified 2026-09-12). Was: a read, not a build - proposals only. Proof would be the two per-pair decisions recorded (a `/boss-learn` scan mode replacing /extract, or a written no; the two first-sentence cross-references in /pretotype and /prototype) and, before any cut, a /skill-doctor run whose output is filed.
created: 2026-09-12
relates: RVW-099, IDEA-085, IDEA-086, IDEA-100, EVID-001
---

# IDEA-101 — skill distinctness: the adjacent pairs, read for "could the model tell them apart?"

> Seed: Ajesh, 2026-09-12 — *"should we be trying to reduce our bloat of skills?"* Answer recorded the
> same day: subtract by **indistinguishability, not by count.** The number that looked like the cost
> (48 descriptions, always loaded) was measured at ~4.7k tokens and trimmed to ~3.0k in v0.316.0; the
> cost that remains is Anthropic's line — *"if a human engineer can't definitively say which tool
> should be used in a given situation, an AI agent can't be expected to do better"* — which is also
> EVID-001's complaint from the founder's side. The mandate (compose and SUBTRACT, never add) applies.

**Method.** Each pair read from its *trimmed* description only — the first sentence and the `Usage -`
line, which is all the host and the founder see before choosing. Question asked of each: *given a
founder's plausible sentence, is there exactly one right door?* Verdicts are proposals; the instruments
that would make any of them a number (`/skill-doctor`, `claude plugin eval`) are still unrun.

## The read

| Pair / trio | What the descriptions say | Distinguishable? | Proposal |
|---|---|---|---|
| **`/extract` · `/boss-learn` · `/practice`** | extract - *"pause and sort patterns … routed UP via /boss-learn or DOWN"*; boss-learn - *"route a proven pattern UP or DOWN"*; practice - *"capture a craft learning as a shared PRAC-NNN"* | **No.** Three capture-a-learning verbs at MVP. `/extract` is the *finder* for `/boss-learn` and says so in its own step 6; a founder saying *"I learned something"* has three doors and the difference is who reads the record (BOSS's library / this app's core / the cofounder). | 🔴 **Merge candidate: `/extract` → `/boss-learn` (as its scan mode).** The router already exists; the finder is 175 lines of prose that ends by invoking it. **Open question, altitude:** what does UP mean *for a founder* — their project cannot write into BOSS's library. If `/boss-learn` at a founder's rung only ever routes DOWN or to a PRAC, then two of the three are one verb and `/practice` is the other. Needs a read of the shipped `/boss-learn` body before any cut. |
| **`/interview` · `/research` · `/evidence`** | one call (prep + debrief) · a whole transcript · one piece of evidence | **Yes, by input size** — and IDEA-086 already put a routing line at `/evidence`'s door for exactly this. | Keep — **overtaken v0.324.0 (peer lane, bossbuild-a8):** `/research` retired into `/evidence`, which now reads the size and does the record, the debrief or the digest; `/interview` keeps prep only. The re-check condition I wrote ("if `/research` never fires") was met by `/skill-doctor` the same day (0×) and the peer acted on it. Three doors → two. |
| **`/pretotype` · `/prototype`** | *"test demand BEFORE you build"* · *"get the idea onto the screen, fast"* | **The descriptions are distinct; the names collide** — one letter apart, and `pretotype` is Savoia's term, deliberate. A `first-product` founder will type the wrong one. | Keep both names (the term is the point). Sharpen: each description's first sentence should name the other in five words (*"not `/prototype` — that builds"*). One line each; no id. |
| **`/health` · `/measure`** | set up ONE metric + ONE curve · render the verdict from what's held | **Yes** — instrument vs read; same shape as `/ai-cost` · `/cost-review`. | Keep. |
| **`/design-review` · `/ux-check`** | before-code · after-code | **Yes**, if the founder knows whether code exists; both first sentences now lead with the timing. | Keep. |
| **`/idea` · `/import`** | capture a thought · bring existing material in and fold it into an idea | **Yes, by source.** | Keep. |
| **`/log` · `/close`** | any-time entry · session-end ritual that includes a `/log` | **Yes**, and `/close` names `/log`. | Keep; IDEA-100 makes the shared recipe a script. |
| **`/welcome` · `/boss` · `/read-repo`** | orientation · new idea · adopted repo | **Yes** — IDEA-099 sorted *idea or repo?* at the door. | Keep. |
| **`/sunset` · `/revalidate`** | end something · re-enter paused work | **Yes** — opposite verbs. | Keep. |
| **`/evals` · `/smoke` · `/red-team`** | correct · alive · secure | **Yes** — the trio is deliberate and each names the others. | Keep. |
| **`/judge-traces` · `/evals`** | what the *agents* did · whether the *FEAT* is correct | Mostly. `eng-builder` sees it; `first-product` may not. | Keep; watch. |

## What this read cannot see

It reads descriptions, not sessions. The failure that matters — a founder picking `/research` when they
meant `/interview`, or never finding `/extract` at all — is observable only in real use, and BOSS has
n=0 observed sessions. So the honest outputs are: **one merge candidate with an open altitude question
(`/extract` → `/boss-learn`), one sharpening (`/pretotype` ↔ `/prototype` name each other), and nine
keeps.** Nothing here is a cut until Ajesh says so per pair, and nothing here should be cut before the
`/skill-doctor` number exists — a subtraction that sounds like the mandate is still a change to a
founder's surface.

## The altitude read (2026-09-12, same day) — it reverses the merge direction

Read the shipped `/boss-learn` (L0) before touching anything. Its own step 2a: *"routing UP needs a BOSS
source checkout, and most installs don't have one … **If you installed BOSS from npm or Homebrew, that is
you.** The honest outcome then is to capture the pattern where you are (`/extract` records it, with the
reason it couldn't go up)."* `src/learn.js` confirms: no `$BOSS_SRC`, no self-hosted registry entry, not
standing in a checkout → *"cannot locate the BOSS source repo"* and stop.

So for every founder BOSS has: **UP does not exist.** `/boss-learn`'s main branch says "use `/extract`";
`/extract`'s step 6 says "invoke `/boss-learn`". Three facts fall out:

1. The merge candidate was pointed the wrong way. Not `/extract` → `/boss-learn`; **`/boss-learn` →
   `/extract`** — one founder-facing verb that records the pattern (EXTR-NNN), routes DOWN in prose,
   and *when a checkout exists* shells to `boss learn`. The finder is the surviving verb.
2. `/boss-learn` is the internal verb — BOSS curating BOSS — and BOSS already has a home for those:
   the root-only `.claude/skills/` set (`/vet`, `/deep-research`, `/humane-refresh`, `/practice-refresh`,
   `/recalibrate`, `/regrade`) that never enters a template. It belongs there, not at **Quickstart**, where
   it is today the lightest rung's only verb that needs a source checkout to act.
3. `/practice` is untouched by this — it is the *team's* record (PRAC-NNN), a third thing, and stays.

**Not done here.** This is a template change to a founder's surface (one skill leaves L0, one at L1 gains
a branch) and it is the mandate's own shape — compose and subtract. It still waits for the per-pair yes,
and for `/skill-doctor` to say whether `/boss-learn` is ever loaded-and-unused in a scaffolded project,
which would make this a measured cut rather than a reasoned one.

## Decisions waiting (per pair)

1. ✅ **`/boss-learn` → `/extract`** — **shipped v0.322.0** after `/skill-doctor` gave the number (`boss-learn` 4× / `extract` 0×). Ajesh: *"go for it i guess."* Not moved to the internal set after all: BOSS's own workspace uses `/extract` too — one verb, two altitudes.
2. ✅ `/pretotype` ↔ `/prototype` each name the other in their first sentence — **shipped v0.317.0**, 2026-09-12.
