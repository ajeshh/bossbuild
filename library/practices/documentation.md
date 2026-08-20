---
id: PRACTICE-documentation
type: practice
owner: pm
status: active
host: stack-neutral
provenance: consolidated from BOSS's own shipped discipline — the seven capture artifacts (/triage, /canvas, /evidence, /decide, /spec, /log, /close) had been distributed across eight skills and zero practices since v0.1, so nothing could refresh, cite, or hold them to a standard. Assessment - docs/dossier/documentation-and-progress-pass-001.md (2026-08-20). Externally grounded in Anthropic's *Effective context engineering for AI agents* (compaction · structured note-taking · JIT retrieval), Hartwig Grabowski's *Spec Growth Engine* (arXiv 2606.27045, June 2026 — spec-anchored / code-coupled / drift-enforced), and Marty Cagan's *Discovery vs. Documentation* (SVPG). The formatting layer is new and unvetted by anyone outside BOSS. §7 (user-facing docs) added 2026-08-20 from the llms.txt / AI-readable-docs sweep — the llms.txt adoption status is explicitly caveated in the text and MUST be re-checked on refresh; it is the fastest-moving claim in this doc.
provenance_public: Consolidated from BOSS's own shipped capture discipline: seven artifacts spread across eight skills and no practice, so nothing could refresh, cite, or hold them to a standard. Externally grounded in Anthropic's *Effective context engineering for AI agents* (compaction, structured note-taking, JIT retrieval), Hartwig Grabowski's *Spec Growth Engine* (arXiv 2606.27045, June 2026 — spec-anchored, code-coupled, drift-enforced), and Marty Cagan's *Discovery vs. Documentation*. The formatting layer is new and unvetted by anyone outside BOSS; the llms.txt adoption claim is the fastest-moving thing in the doc and is caveated in the text.
last_reviewed: 2026-08-20
review_by: 2027-02-16
curve: craft-ai
---

# Practice — Documentation for a project built with AI

> **Where this sits.** [`context-discipline.md`](context-discipline.md) owns *what loads into the
> context window*. This owns *what gets written down in the first place* — which artifacts exist,
> when each earns its keep, how they're formatted, and how they retire. The two are halves of one
> discipline: a doc this practice sanctions badly is a doc that practice then has to pay for on
> every turn.

Documentation used to be a cost you paid so humans could coordinate. With an agent in the loop it
became something else: **the durable half of the model's memory.** The model forgets everything
between sessions; the files don't. That makes a project's docs load-bearing in a way they weren't
before — and it makes *bad* docs expensive in a way they weren't before, because now something reads
all of them, every time, and can't tell which parts went stale.

## The line

**Write the doc that changes a decision. Delete the doc that only proves work happened.**

Cagan's framing survives the shift intact: documentation is legitimate *after* the thinking, and
harmful *instead of* it. A generated PRD is not discovery, and an agent that can produce twenty pages
in nine seconds has made the "instead of" failure nearly free. The scarce thing was never the writing.

---

## 1. The artifact spine — seven docs, each with one job

A project needs fewer documents than it thinks, but each one has to be genuinely distinct. These
seven are distinct because each answers a question the others structurally can't:

| Artifact | Answers | Shape |
|---|---|---|
| **Idea** | What might we build? | Living — a *current shape* you rewrite, an append-only *capture log* you don't |
| **Canvas** | Is it worth building? | A snapshot with honest blanks; names the riskiest assumption |
| **Evidence** | What's actually true? | One signal, one file, graded on a fixed ladder |
| **Decision** | Why did we choose this? | Context · decision · why · **falsifier** · consequences |
| **Spec** | What does done mean? | Goal, acceptance criteria, a check that proves it landed |
| **Devlog** | What happened? | Append-only, newest first, including what *didn't* work |
| **Resume** | Where am I? | Rewritten every session — state, next tasks, open decisions |

Three properties make the spine work, and each is a rule you can break by accident:

- **Append-only where the record matters; rewritten where currency matters.** A capture log you edit
  is a history you've falsified. A state doc you append to is a briefing that grew into an archive.
  Getting these backwards is the most common failure.
- **Stable IDs.** `IDEA-NNN`, `EVID-NNN`, `DEC-NNN`, `FEAT-NNN`. An ID is what lets a doc be
  *referenced* rather than *restated* — and restating is how two copies of a fact start disagreeing.
- **One home per fact.** Every fact has exactly one file that owns it; everything else links. The
  second copy is the one that goes stale, and nothing will tell you which one it was.

**Ration the artifacts to the stage.** A project with no users doesn't need a decision log; a
prototype doesn't need a spec. Introducing an artifact before its question is live is ceremony, and
ceremony is what makes founders stop writing anything at all.

---

## 2. Two audiences, one file

Every doc is read by **a tired human scanning for one thing** and **a model loading it whole and
paying per token**. Design for both, because you can't fork the file:

| | The human wants | The model wants |
|---|---|---|
| Structure | Scannable — headings, one idea per block | Distinct sections under explicit headers |
| Emphasis | A landmark to jump to | Near-neutral; a bolded wrong thing misdirects |
| Length | Short | Short — long context dilutes attention, not just budget |
| Tables | Excellent for comparison | Fine, until cells hold prose |
| Ambiguity | Fills it in from context | Cannot, and will guess confidently |

**They agree far more than they conflict** — which is the useful finding. Optimizing for the tired
human mostly optimizes for the model. Where they genuinely diverge: the human wins on emphasis, the
model wins on removing ambiguity. Write the pronoun out. Name the file. Say the version.

---

## 3. Formatting is a readability contract

Markdown's devices are a small vocabulary, and their value comes entirely from **using each for one
thing**. A doc that bolds everything and tables everything has no vocabulary left.

- **Bold is scarcity.** It marks the load-bearing phrase, so a scanner can reconstruct the argument
  from the bold alone. **One per paragraph, two at the outside.** Past that it stops meaning anything
  and starts meaning *the author was anxious*.
- **Blockquote is the aside that survives skimming** — the framing or warning to read even if nothing
  else gets read. Never a second body voice.
- **Table when the content is enumerable and comparable.** List when it's sequential. Prose when it's
  an argument. A table of paragraphs is a wall wearing a grid.
- **Code span is a literal** — a path, flag, command, ID, or filename. Never emphasis. This one has a
  second payoff: literals in backticks are the tokens an agent can act on directly.
- **Stop at three heading levels.** Wanting a fourth means the doc wants to be two docs.
- **Emoji only as a bounded status glyph.** Pick a fixed set with fixed meanings and never extend it
  — a stop marker, a caution, a verified-true. Decorative emoji is noise both audiences pay for.
- **Markdown has no color, and the workarounds are traps.** Inline HTML, badge images, and colored
  diff fences break in plain-text readers, render inconsistently across editors, and cost tokens
  everywhere. **Color belongs to rendered surfaces** — a terminal, an HTML view, a site — never to
  the `.md` itself.

### Where color does belong, use semantic tokens

A rendered surface should carry **a handful of named tokens, each documented with *when* it's used**,
not a palette of hexes chosen per-view:

```
dim   the aside / secondary detail
bold  structure — section headers, the word that anchors
ok    success — a thing happened and it worked
warn  worth a look, not a failure
err   the command could not do the thing
```

Five is enough. The discipline is the one-line *when*, not the count — a token without a stated
occasion gets used decoratively within a week. And every rendered surface a project ships must draw
from **one** token set. A second view with its own accent color isn't a design choice; it's drift
that nobody filed.

---

## 4. Planning — the documentation comes from the corrections

The hardest part of planning is not writing the plan; it's that **the person with the answers doesn't
know which questions are open.** Hand a model a rough idea and it will produce a complete, fluent,
confident spec — completing every gap it finds, because that's what fluency does. The founder then
reads it, recognizes most of it, and approves the parts they never actually decided.

The fix is one step, and it's cheap: **separate what you were told from what you filled in, and show
the difference.**

- **State the assumptions as rejectable claims.** One line each, phrased so "no" is a complete answer.
  A guess the founder can see is a guess they can correct; a guess buried in fluent prose is a
  decision they didn't know they were making.
- **Ask for one concrete worked example.** Highest-yield question available at plan time. A single
  instance walked start to finish surfaces states, vocabulary, and constraints that no template
  thinks to ask for — and it's easy to answer, which matters more than it sounds.
- **Ask what "wrong" looks like.** *"What would make you say this is broken even though it technically
  works?"* Most real acceptance criteria live here. The goal restated as criteria is not criteria.
- **Say what you deliberately did not guess.** A named blank is a working artifact. A confident
  invention is the failure this whole step exists to catch.

**The corrections are the documentation.** When someone rejects an assumption, the sentence they
replace it with is the most valuable line in the file — it is, by construction, the thing that was
non-obvious enough that a competent reader got it wrong. That is the exact definition of what belongs
in an instructions file, a README gotcha, or an onboarding doc. **Keep their wording**; a
paraphrase loses the part that made it worth capturing.

**Then stop.** One pass, then build. A planning step that grows into a requirements interview has
become a document written *instead of* the thinking — which is the failure this practice opens with,
arriving through the back door.

---

## 5. The lifecycle — anchor, compact, subtract

Docs don't rot because people are lazy. They rot because **nothing in the writing step decides what
happens after.** Three moves fix that, and all three are cheap:

### Anchor the spec, don't discard it

There are two ways to run a spec, and the difference decides whether your docs describe your system
a month later:

- **Spec-first** — write it, generate against it, discard it at ship. The spec is scaffolding.
- **Spec-anchored** — the spec persists as the living description of that feature, and something
  re-checks it. The spec is the record.

Spec-first is legitimate for a prototype and a slow leak for anything you'll carry. If a feature is
going to be maintained, **something must re-read its acceptance criteria after it ships and ask
whether they're still true.** Grabowski calls the missing third leg *drift-enforced*, and its absence
is why most projects have specs that describe a system nobody has run in months. The check doesn't
need to be automated — it needs to be **scheduled and owned**.

### Compact on a rule, not on a panic

Append-forever state docs hit a wall, get hand-split under pressure, and lose entries in the split.
Decide the rule while the doc is still small: **keep a recency window, roll the rest to an archive,
and name which file is canonical for the full history.** Compaction is one of the four patterns
Anthropic names for long-running agents — preserve decisions and unresolved problems, discard
redundant detail. The same rule works on a file.

### Subtract the doc nothing trusts

The strongest signal a doc should die: **something in the system already routes around it.** A
hand-maintained index that a tool refuses to read because it drifts is not a doc with a maintenance
problem — it's a doc with a *existence* problem. Delete it, or generate it from the thing that's
actually true. Shipping a file you tell people to maintain and then don't believe is worse than
having no index.

### Keep the feature's story on one axis

Session logs and release notes are both legitimate, and **neither one holds a feature's arc.** Work
that lands across several sessions and several releases has its story split across both, with nothing
joining the pieces — so the reasoning is technically all written down and practically unreadable.

Give the feature's own record an append-only log, and write **the decision and the surprise** into
it: what was chosen, what was rejected, what turned out not to be true. Those are the parts that
cannot be reconstructed later, which is why they're worth the keystroke on their own — and, not
coincidentally, the only parts anything useful can be written from later. **Nothing readable was ever
mined from "then I did X."**

Two guards, because this is the artifact most likely to rot into theater:

- **Would you write it if nobody ever read it?** If no, don't. A log kept for a future audience that
  doesn't exist yet is content debt in a doc costume, and it gets abandoned by week three.
- **It never gates a ship.** An empty log at ship time honestly means the work was routine.

**The general form:** every doc should be *derived*, *owned*, or *dead*. A doc that is neither
generated nor has a named person who rewrites it is already stale; it just hasn't been caught.

---

## 6. Derive progress, never maintain it

"Where am I?" is the question a founder asks most and documentation answers worst — because the
obvious solution is a status document, and a status document is a **second source of truth** that
starts lying the first week.

The move is to **project progress out of artifacts that already exist**, so it cannot drift:

- **Status lives in frontmatter**, on the artifact itself. One field, one owner, changed when the
  work changes.
- **The view is a render, never a record.** No board file, no status JSON, nothing to sync. If the
  render is wrong, the fix is to change the work — not the view.
- **Show the empty column.** A stage with nothing in it is the most informative cell on the board,
  and hiding it is how a progress view becomes a morale instrument instead of a diagnostic.
- **Within a unit of work, progress needs a checkable object.** A spec whose acceptance criteria are
  prose can only ever be "in progress." The same criteria as checkboxes make *how far* a fact instead
  of a feeling — and cost nothing extra to write.

**Motion is not progress, and a progress surface is where that lie is easiest to tell.** Whatever you
render, keep the open bet visible next to it. Four columns of movement above an untested assumption
should read as a warning, not an achievement.

---

## 7. The docs your users read (the outward half)

Everything above is **inward-facing** — the record you keep so the project can be built. This section
is the other half, and it fails differently: an internal doc that goes stale costs you a bad
afternoon, a user-facing one that goes stale costs you a user who concluded the product was broken.

### Ask first whether the doc should exist

**The best help doc is the one nobody needed.** A help article is often a defect report about the
interface, written by the team that shipped the defect. Before writing one, check whether the honest
fix is upstream:

- **An empty state that explains itself** beats an article on what to do first.
- **A better label or an inline hint** beats an FAQ entry about what a control means.
- **A worked example in the product** beats a tutorial about the product.

Write the article when the thing genuinely is complex, irreducible, or reference material someone
needs open in another tab. Don't write it to compensate for a screen you could fix. And **never
write docs as a substitute for the activation path** — that's the same *documentation-instead-of-the-work*
failure this practice opens with, wearing a user-facing hat.

### Your docs now have two readers, and only one of them can file a bug

The two-audience cut from section 2 applies harder here, because the second reader changed. It is no
longer only the model working in your repo — it is **an assistant answering "how do I do X in your
product" for a person who never opened your site.** On many documentation sites, agent traffic
already exceeds human traffic.

What that changes, concretely:

- **Say the product's name and the exact object names** in the text, not just in the nav. A model
  quoting your docs needs the noun; a human had the page title for context and the model may not.
- **One page per task, with the answer near the top.** A page that buries the procedure under
  positioning is a page that gets summarized into something wrong.
- **Publish clean markdown, not just rendered HTML.** It is what both readers parse best.
- **Version and date what's version-specific.** A model has no way to know your screenshot is from
  eighteen months ago; a stale doc becomes a confidently wrong answer at scale.

### `llms.txt` — cheap, worth doing, and don't oversell it

A markdown file at your domain root linking your canonical pages with one-line descriptions. **The
honest status matters:** as of early 2026 **no major model provider has publicly committed to reading
it in production.** It is shipped by Stripe, Vercel, Cloudflare, Anthropic and Cursor anyway, because
the coding agents their users run consume it *today*.

**Treat it as a content-authority play, not access control** — you're pointing models at what's
canonically true about your product so they invent less. It costs an afternoon and it cannot hurt.
It is not a growth channel, and anyone selling it as one is selling something.

### Keep the corpus small enough that retrieval never becomes the plan

The published guidance converges on **fitting the whole corpus in one context window** — practically,
staying under a couple hundred thousand tokens. That is worth reading as what it is: the docs-side
statement of [`retrieval.md`](retrieval.md)'s rung 0. **A corpus small enough to be read whole needs
no index, no embeddings, and no graph** — and a small, current corpus beats a large one with good
search, for both readers.

So the discipline is **subtraction, not infrastructure**: prune dead pages, merge near-duplicates,
delete anything describing a version nobody runs. If you genuinely outgrow one context window, climb
`retrieval.md`'s ladder on a metric — one rung at a time — rather than reaching for the top of it.

## Self-check before writing a doc

1. **What decision does this change?** No answer means don't write it.
2. **Does a fact in here already live somewhere else?** Then link; don't restate.
3. **Append-only or rewritten?** Say which at the top, and match the structure to it.
4. **Who rewrites this, or what generates it?** "Neither" means it's already stale.
5. **When does it get compacted, archived, or deleted?** Decide now, not at 600 lines.
6. **Read only the bold.** Does the argument still stand up? If bold is everywhere, or the skimmed
   version says nothing, the emphasis is decorative.

## What's left out (deliberately)

- **A doc generator.** Docs that nobody chose to write are the ones nobody reads. The bottleneck is
  judgment about what deserves a file, and generation makes that worse, not better.
- **A documentation coverage metric.** It would immediately be gamed by writing files, which is the
  behavior this practice exists to discourage.
- **Externally-standardized spec formats.** If a project already has a spec artifact with an ID and
  acceptance criteria, importing a second format buys nothing and costs a translation layer.
- ⚠️ **Model-facing site conventions** (`llms.txt` and kin) — **this exclusion is superseded by §7
  (2026-08-20) and is kept here only so the reversal is visible.** The distinction it drew is still
  true: those conventions serve *websites* answering models, and a repo's agent-facing contract is its
  instructions file. The conclusion was wrong, because a project ships **both** — §7 owns the website
  half, sections 1–6 own the repo half. Left standing for one release after §7 landed, which is exactly
  long enough for a reader to get two answers from one file.
