---
name: vet
description: The skeptical inbox — vet an unproven outside claim (a Reddit thread, a blog post, a paper, a "you must do X" best-practice) against BOSS's principles and existing practice, and return one honest verdict. The INVERSE of /extract (which routes a pattern you already proved); this judges a claim from a stranger that has earned nothing. Reads docs/research/inbox/, scores against a NO-biased rubric (contradicts a principle? evidence grade? duplicate or sharpen? who does it harm? added ceremony?), names who it serves and harms, and writes docs/research/verdicts/RVW-NNN-*.md — ADOPT (hand to /extract), ADAPT, REJECT (with reason, logged), or NOT-YET. Deliberate-invoke, never a hook moment. Usage - /vet [path-or-paste]
---

# /vet — the skeptical inbox

> *"Reddit is full of best practices, but that doesn't mean all are good ideas."* — the seed.

`/extract` routes a pattern **you already proved** — you built it, it worked, it repeated — UP
into the library or DOWN into the app. Its input has *earned trust*.

`/vet` is the inverse. It takes a claim **from a stranger** — a Reddit thread, an HN comment, a blog
post, a paper, a "you must do X" tweet — that has **earned nothing**. Its whole job is the part
`/extract` never has to do: decide whether an unproven outside claim deserves to become practice
at all. **The filter is the product.** A drop folder with no judgment is a bookmark pile; the value
is the skeptical read that pressure-tests the claim against what BOSS already believes and already
does.

The default answer is **no**. Most best practices on the internet don't apply to you, at your stage,
for your thesis. `/vet` is a good skeptic, not an eager adopter — it leans REJECT / NOT-YET and makes
the claim *earn* an ADOPT.

## Scope (internal-first)

This is the **BOSS-curating-BOSS** version: you drop research, the skill judges whether *BOSS itself*
should adopt it, measured against `PRINCIPLES.md` and BOSS's own `library/` + practice. It sits with
the other meta-skills (`/extract`, `/boss-sync`), not in the founder template. The founder-facing
version — a founder drops a thread, BOSS reads it against *their* canvas/stage/cohort — is the named
UP candidate (IDEA-016), deferred until this earns it (PRINCIPLE #2).

## When to run it

- You found something promising (a thread, a post, a paper) and want a principled read before it
  changes how BOSS works.
- You have a few things piled in `docs/research/inbox/` and want them triaged honestly.
- Someone told you "you should be doing X" and you want it tested against the thesis, not vibes.

Run it **deliberately** — it is not a hook moment and never fires on its own. A heavyweight review
for every post you skim is exactly the ceremony BOSS refuses (PRINCIPLE #2).

## How to run it

### 1. Get the claim in front of you

The claim arrives one of three ways — handle whichever you're given:
- **A file in the drop zone** — `docs/research/inbox/*` (a `.md` note, a paste, a saved article, a
  one-line file holding a URL). If `/vet` is run with **no argument**, list the un-vetted inbox items
  (those with no `resolved:` line and no matching verdict) oldest-first, then vet the oldest — or, if
  there are several, ask whether to **sweep them all** (see *Batch sweep* below).
- **A sweep** — `/vet --all` vets *every* un-vetted inbox item, each as its own full skeptical pass
  with its own `RVW-NNN` verdict, then prints one summary table. Drop a pile, sweep once.
- **A path or URL passed inline** — `/vet docs/research/inbox/onboarding.md` or `/vet <url>`. If it's
  a URL, fetch it (WebFetch) and read the actual content, not the headline.
- **Pasted text** — vet it directly.

Distill the claim to its **core assertion** in one or two sentences before judging — "you should X
because Y." If the source makes several claims, name them and vet the load-bearing one (one per run).

### 2. Orient against what BOSS already believes and does (silent)

Read, silently — this is the rubric's evidence base, not the claim's:
- `PRINCIPLES.md` — all six. The claim is measured against these first.
- `docs/ideas/CANVAS.md` — BOSS's own bet, riskiest assumption, risks & harms.
- `library/practices/` and `library/sources.json`, plus the shipped agents, skills and hooks under
  `stages/*/template/.claude/` (the library holds no agents/skills/hooks/memory-seed since v0.246.0 —
  `library/README.md`). Does BOSS already encode this?
- The relevant proto-personas (`.claude/agents/persona-*`) — the cohorts a practice would land on.
- Prior verdicts — `docs/research/verdicts/*.md`. **Has this claim, or one like it, already been
  ruled on?** If so, don't re-litigate; cite the prior RVW and either confirm or note what changed.

Don't announce these reads. Just orient.

### 3. Verify who actually said it — *before* you grade anything

**This step exists because it caught three claims in one session and BOSS had no place for it.**
An attribution is a citation's **load-bearing half**: rubric question 2 grades evidence partly on
*"a named practitioner BOSS already respects,"* which is worth nothing if the practitioner never
said it. Grading first and checking later means the grade is already anchored when the truth arrives.

**The rule: no claim reaches the rubric with an unverified second-hand attribution.**

For every *"X said Y" / "X shared this" / "per the N report"* in the claim:

- **Go to the primary source.** The lecture, the paper, the report itself — not a summary, not a
  thread, not a post *about* it. If the claim arrives as "so-and-so shared this," verify **both** what
  they shared *and* that it says what the sharer implies.
- **Check the organisation actually published what's attributed to it.** *"DORA 2026 says the
  bottleneck moves to specification"* does not verify: DORA's real 2026 publication is *ROI of
  AI-Assisted Software Development* (2026.01), an ROI report. The phrasing traces to blog summaries
  and preprints. **The attribution was doing the persuading, and it was wrong.**
- **Watch for the borrowed-authority blend** — a vendor's number sitting next to a respected name so
  it reads as theirs. `git-workflow.md` carried *"(DORA names it directly; agentic PRs already sit
  ~5.3× longer before pickup)"*: the multiplier was an unverified vendor figure wearing DORA's
  credibility. This is the lane-blend `SOURCES.md` forbids, and it is easy to reproduce by accident.
- **Record the outcome in the verdict either way** — *verified*, *partly verified* (say which half),
  or *does not verify*. A quarantined attribution is a finding, not an embarrassment.
- **🔗 Write down the URL you actually opened.** Not the thread that pointed at it — the primary
  source you verified against. Put it in the verdict's `sources:` block, and if the claim is later
  adopted, carry it into `library/sources.json` so the name can become a link.
  **An attribution without a URL is half a citation:** it can't be re-checked when the practice comes
  up for review, it can't be credited publicly, and the next person has to redo the search you already
  did. This rule exists because BOSS discovered it had **41 named sources across its practice shelf and
  URLs for two of them** — every provenance line named who, and almost none said where. The verification
  work had been done and thrown away.

**What it does to the grade.** Unverified → the evidence grade drops to what the claim can prove on
its *own* merits, with the borrowed authority removed. Contradicted → that alone is usually enough
for REJECT or NOT-YET, because a claim whose headline citation is wrong has told you something about
how carefully the rest was assembled.

> **The three that produced this rule (n=3 → Principle #1, sort UP):** [[RVW-072]] — *"Karpathy shared
> this"* was half-right (the lecture is real; the second video was an unrelated older explainer), and
> **the evidence grade swung on the verification**. [[RVW-076]] — the DORA attribution above, which
> does not verify at all. And the review-sandwich claim, resting on a second-hand GitHub-internal
> number nobody could trace. **Three of four claims in one session bent here.**

### 4. Score against the rubric (biased toward NO)

Five questions. Any one can sink the claim on its own.

| # | Question | What kills the claim |
|---|---|---|
| 1 | **Does it contradict a PRINCIPLE?** | A claim that fails a principle is **rejected outright**, no further debate. ("Growth-hack the onboarding funnel" fails #6 — the humane lens. `mentor-humane` has veto here.) |
| 2 | **Evidence grade.** Is this n=1 anecdote, a pattern with real data, or a named practitioner BOSS already respects? | Most internet "best practices" die here. n=1-vibe with confident tone → NOT-YET at best. Name the grade explicitly. **Grade only what step 3 verified** — an unverified "named practitioner" is an n=1 blog post wearing a borrowed name. |
| 3 | **Duplicate or sharpen?** Does BOSS already do this, or does it genuinely improve something we have? | Pure duplicate → REJECT (cite where BOSS already does it). A real sharpening of an existing practice → that's the ADOPT/ADAPT path. |
| 4 | **Who does it serve — and who does it harm?** | A practice great for `eng-builder` can be toxic for `first-product`. If it helps one cohort and harms another, that's ADAPT-with-scoping at best, not a blanket ADOPT. The humane lens can veto on harm alone. |
| 5 | **Cost / ceremony.** Does adopting it add weight BOSS's own thesis warns against? | A claim that makes BOSS heavier, naggier, or more expensive fights R&H #1 (BOSS bloats into a framework). High ceremony, low payoff → REJECT. |

Be specific. Cite the principle number, name the cohort, point at the existing practice. Vague
approval is the failure mode — make the claim survive concrete scrutiny.

> **Model routing (shape, not name):** a verdict is *deliberation*-shaped — rare, short output,
> adversarial depth is the whole point (`library/practices/model-routing.md`). When you delegate it to
> a subagent, ask for that shape: the most deliberate model the host offers, or a higher `effort:` on
> the session model, whichever the host resolves. If it declines, fall back to the session model and
> say so in the verdict. Reading the inbox and writing the file stay on the session model. No model
> is named here on purpose — the name rots, the shape doesn't.

### 5. Reach one verdict — ADOPT / ADAPT / REJECT / NOT-YET

- **ADOPT** — earns its place as-is. It doesn't contradict a principle, the evidence is real, it
  sharpens (not duplicates), it serves without harming, and it doesn't add net ceremony. → hand to
  `/extract` to route UP (library) or DOWN (app). `/vet` decides *whether*; `/extract` decides
  *where*.
- **ADAPT** — sound in part. Integrate a **modified** version, with the modification reasoned (scope
  it to one cohort, strip the harmful half, soften the ceremony). Name exactly what changes and why.
- **REJECT — with reason, recorded.** This is the quietly important outcome. Without a recorded "no +
  why," the same thread resurfaces next month and costs the same debate. The verdict log is BOSS's
  memory of what it *deliberately didn't* adopt.
- **NOT-YET** — sound, but needs a trigger or evidence BOSS doesn't have. Name the **re-open
  condition** — what would flip it to ADOPT (a second host? a real founder hitting this? data?).

When in doubt between two verdicts, pick the more conservative one and say why. The skill is a
skeptic.

### 6. Write `docs/research/verdicts/RVW-NNN-<slug>.md`

Allocate the next free `RVW-NNN` by grepping `docs/research/verdicts/*.md`. Use this skeleton:

```markdown
---
id: RVW-NNN
type: verdict
owner: pm
status: recorded
created: {{DATE}}
verdict: ADOPT | ADAPT | REJECT | NOT-YET
route: <UP library/<cat> | DOWN src/<path> | n/a>   # only if ADOPT/ADAPT
sources:                # step 3: the URLs you actually opened. A vendor or outside repo: describe it by shape, "URL kept local"
  - <url>
---

# RVW-NNN — <one-line: the claim, plainly>

## The claim
- **Source:** <url / where it came from / "pasted">
- **Core assertion:** <1-2 sentences — "you should X because Y">
- **Inbox file:** <docs/research/inbox/... , if any>

## Rubric
| # | Question | Finding |
|---|---|---|
| 1 | Contradicts a PRINCIPLE? | <which # / no> |
| 2 | Evidence grade | <n=1 vibe / pattern-with-data / respected practitioner> |
| 3 | Duplicate or sharpen? | <duplicate of X / sharpens Y / new> |
| 4 | Who serves / harms? | <cohorts served; cohorts harmed> |
| 5 | Cost / ceremony | <net lighter / neutral / heavier> |

## Verdict: <ADOPT / ADAPT / REJECT / NOT-YET>
<2-4 sentences, honest. The dominant reason, named.>

## If ADOPT / ADAPT
- **What to do:** <the concrete change> → hand to `/extract` (UP `library/<cat>` or DOWN `src/`).
- **If ADAPT:** what's modified from the original claim, and why.

## If REJECT / NOT-YET
- **Why not:** <the killing finding>
- **Re-open condition (NOT-YET only):** <what would change the verdict>

## Attribution
<verified / partly verified (say which half) / does not verify — and what the primary source actually said>

## Notes
- Prior related verdicts: <RVW-NNN refs, if any>
- BOSS version when recorded: <from VERSION>
```

### 7. If ADOPT or ADAPT — hand to `/extract`

`/vet` decides *whether* a claim earns a place; `/extract` decides *where* (UP/DOWN) and does the
promotion. After you confirm the verdict:
- Generalize the claim into the concrete artifact (a practice doc, a skill change, a memory seed).
- Invoke `/extract` on it. **`/extract` may disagree and re-route or decline** — that's the
  check on the check. Record the outcome (did it go UP? bump VERSION? CHANGELOG line?) in the RVW.

### 8. Tidy the inbox

Once vetted, move (or note) the inbox item as resolved — the verdict file is now the record. Don't
delete the source if the verdict was NOT-YET (you'll want it when the re-open condition hits).

## Batch sweep (`/vet --all`)

The intended rhythm: **accumulate, then sweep.** Drop claims into `docs/research/inbox/` as you find
them — no need to vet each on arrival — then run `/vet --all` to triage the whole pile at once.

The sweep is **many full passes in sequence, not one pass over many.** Each un-vetted item gets the
complete treatment — its own orient → rubric → verdict → `RVW-NNN` file. The skill does not get
shallower because the queue is longer; if the pile is large, say so and work through it, don't skim.

After the sweep, print one summary table so the pile is legible at a glance:

```
| RVW | Claim | Verdict | One-line why |
|-----|-------|---------|--------------|
| 001 | four-rule CLAUDE.md | REJECT | already encoded as principles + cohort-aware conscience |
| 002 | lean/modular CLAUDE.md | ADAPT | apply the recency-window to RESUME.md State |
| …   | …     | …       | … |
```

Then list the ADOPT/ADAPT items that want a `/extract` hand-off, so the actionable ones don't get
lost in the triage. Skip already-vetted items (those with a `resolved:` line or an existing verdict).

## What this skill is NOT

- **Not `/extract`.** That routes proven patterns; this judges unproven claims. ADOPT *hands to*
  `/extract`; it never reimplements it.
- **Not a hook moment.** No `vet-loop`, no nudge to "review your inbox." Deliberate-invoke by design;
  an automatic research-review obligation would be the ceremony BOSS warns against.
- **Not a research assistant.** It doesn't go *find* best practices (that's `/scout`). It
  judges the ones you bring it.
- **Not graded by the judgment-eval surface.** Like `/extract` and `/drift-deep`, this is a
  deliberate skill judgment; its quality is tested in use, not by `conscience-evals/judgment/`.

## Rules

- **The default is NO.** Make the claim earn an ADOPT. A skeptic that approves everything is a
  bookmark folder.
- **Verify who said it before you grade what they said** (step 3). An attribution is a citation's
  load-bearing half, and it is the half most likely to be wrong — three of four claims bent there in
  one session. Every verdict records *verified / partly / does not verify*.
- **Cite the principle, name the cohort, point at the existing practice.** Vague approval/rejection
  is the failure mode. Every verdict is anchored in something concrete.
- **REJECT is recorded, with the reason.** A no without a written why isn't institutional memory —
  it's a debate you'll have again.
- **The humane lens vetoes.** Principle #6 / `mentor-humane` can sink a claim on harm alone, even one
  that's otherwise sound and well-evidenced.
- **One claim per verdict.** Each claim gets its *own* full pass and its *own* `RVW-NNN` file — never
  collapse several claims into one shallow verdict. A single source making several claims → vet the
  load-bearing one, surface the rest as their own inbox items. Batch sweep (`/vet --all`) is fine and
  encouraged: it's many full passes in sequence, and depth-per-claim is exactly what this rule
  protects.
- **Whether, not where.** `/vet` decides if a claim earns a place; `/extract` decides UP vs DOWN.
  Don't collapse the two — the separation is the check.
