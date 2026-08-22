---
id: PRACTICE-deceptive-patterns
type: practice
owner: designer
status: active
host: stack-neutral
provenance: "The other limit — a rule is evidence, not a verdict" added v0.202.0 (2026-08-21) from FOUNDER JUDGMENT, not a research sweep. No RVW backs it and it must not be cited as one; its three questions are modelled on the `deception` moment's effect-not-narrative shape and on the canvas's "name the worst-served person, not an abstraction." · split out of ai-ux-patterns.md at v0.190.0 (2026-08-20). That file had absorbed five sweeps of catalog growth (RVW-031 CDT taxonomy · RVW-056/057 classic-web families + regulatory teeth · RVW-059/060/061/062/063 cohort & frontier · the 2026-07-23 generated-code and metering pass) until 46% of an AI-interaction practice was a bad-pattern list, and `boss craft` was flagging it as the shelf's one 2x-median outlier. The catalog now lives as DATA (library/deceptive-patterns.json) so it can grow without growing the dose; this file is the judgment that data cannot carry.
provenance_public: The three-question test under *The other limit* is BOSS's own judgment — no research backs it, and it should not be read as though any did. The named patterns come from CDT's *Dark Patterns in AI Chatbots* (2026, CC-BY), Brignull's deceptive.design, Mathur et al.'s *Dark Patterns at Scale*, Gray et al.'s CHI-2024 ontology, and successive research sweeps covering accessibility, minors, agentic products, algorithmic management, and the patterns a model writes into generated code (Vaccaro et al., CHI 2026).
last_reviewed: 2026-08-20
review_by: 2026-11-18
curve: humane
---

# Practice — Deceptive patterns (the catalog is data; this is the judgment)

> **Where this sits.** [`ai-ux-patterns.md`](ai-ux-patterns.md) owns how an AI feature *should*
> behave toward a person. This owns the manipulative inverse — the named bad shapes, so a founder
> can catch one **while building it**. The harm axes they are reasoned against live in
> [`harm-taxonomy.md`](harm-taxonomy.md). The runtime tests are `/red-team --humane` (behaviour)
> and `/ux-check` (the shipped markup).

**The patterns are not in this file.** They are in `library/deceptive-patterns.json`, and you read
them filtered:

```
boss craft deceptive-patterns --shape mobile-app        which surfaces you have at all
boss craft deceptive-patterns --surface checkout-and-pricing    the rows, when you're on it
```

That split is deliberate and it is the whole design. **The catalog has promised to keep growing;
the dose has promised to stay small.** Both promises are only keepable if they are different
objects. A real vibe-coder read the old 279-line version and said it exactly: *"I don't read lists.
I scan for the one example that looks like the thing on my screen. Doubling the list halves my odds
of finding mine."* So the library may hold three hundred patterns and a CLI founder standing on
their install path still sees four. `npm run check:patterns` is what keeps that honest — it warns
when any single surface passes twelve rows, because twelve is roughly where a list stops being read.

## Shape, then surface — why the filter is two steps

Nobody arrives thinking *"I am in the Sneaking family."* They arrive thinking *"I am building a
checkout."* So the catalog is indexed by **the thing the founder is standing on**, not by taxonomy.

- **Shape** — what you're building: `cli`, `dev-tool`, `mobile-app`, `web-app`, `marketing-site`,
  `chatbot`, `ai-feature`, `agent`, `marketplace`, `ecommerce`, `edtech`, `health-or-regulated`,
  `social-or-ugc`, `hardware-or-iot`. **Shapes are tags, not buckets** — an edtech mobile app with a
  chatbot is all three, and should be.
- **Surface** — where deception actually shows up, derived from the shape: the consent dialog, the
  checkout, the delete flow, the permission prompt, the install path, the AI's own voice, the markup
  the model wrote. Each surface carries its own rows and its own honest version.

**A surface is a PLACE in the product — and that rule earns its keep by what it excludes.** The
catalog briefly carried a `minors` surface, and it never worked: it stalled at two rows while every
minors-related pattern kept wanting to live somewhere else. The reason was structural. "Minors" is a
property of the *user*, not a place in the product, so it could never hold anything except rules that
already belonged to a checkout, a signup, or a notification. It is now a **modifier** — rows carry an
optional *stricter when a minor may be present* line, read where you actually build
(`boss craft deceptive-patterns --minors` lists them together). **When a cell stays thin, check the
shape before you fill it**: a thin cell is sometimes a hole and sometimes a category that does not
exist, and filling the second kind makes a wrong model more expensive to change.

This is why shape matters as much as cohort. A CLI has no cookie banner and a marketing site has no
permission prompt; handing either founder the other's patterns is how a catalog teaches people to
skim. What a CLI *does* have — telemetry on install, opaque metering, a deprecation with no
migration path — was invisible in a catalog shaped like a chatbot.

## Effect, not intent

A deceptive pattern needs no malice. California law (CCPA § 1798.140(l)) judges it by its **effect
on the user's choice**, not the designer's intent — so you can ship one by accident: the checkout you
copied, the deletion flow you never built. **The one worth catching is the one you didn't mean to
build.** That is where a conscience earns its keep, and it is why testing the founder's *intent*
proves nothing.

Two sharpenings of that:

**It emerges from the model.** Some patterns aren't designed at all — they come out of training.
Sycophancy is canonical, and no longer soft: a controlled study found sycophantic models causally
reduce a user's willingness to repair a conflict and *raise* their conviction they're right, while
the user trusts them *more* (Cheng et al., *Science* 2026). Test the **built** product, not the plan.

**Your AI writes it for you.** Ask a model for an ordinary signup flow or upgrade modal and it
*frequently ships a manipulative one unprompted* — a fake countdown, a pre-ticked opt-in,
confirmshaming in the decline copy — pulled from the average of its training data (Vaccaro et al.,
*Deception at Scale*, CHI 2026). The founder never designed it and often can't see it. **A
vibe-coder is more exposed here, not less.** This is the sharpest case of effect-not-intent: the
intent wasn't even theirs. It is also the moment the catalog can't reach — the failure happens while
someone is *typing a prompt*, not while they're reading a doc. Hence the `deception` conscience
moment and `/ux-check`'s markup walk: read what the model wrote, not what the founder meant.

## Symmetry in choice — the testable bar

The concrete version of "keep every door open", codified in California's 11 CCR § 7004: the
privacy-protective path must be **no longer, harder, or slower** than the less-protective one.
Opt-out in as few steps as opt-in. "Decline All" as prominent as "Accept All". *If the good door
takes more clicks than the bad one, you've already failed.* One rule, checkable in ten seconds, and
it decides most of the consent surface on its own.

## Humane defaults — ship the fix, keep the door, record the crossing

The catalog is what to *catch*; this is what to *build by default*. **Ship the humane choice as the
default:** privacy on, consent opt-in, the escape hatch already wired, the action reversible. The
humane path becomes the path of least resistance because it's *already done for you* — not because
anything else was blocked.

**The asymmetry is the whole discipline, and the easy way to get it wrong.** You *remove* friction
from the humane path; you **never add** friction to the harmful one. Deliberately slowing, burying,
or complicating a choice you disapprove of is a deceptive pattern aimed at a goal you happen to
like — and manipulation is manipulation regardless of whose side it's on. You can't dark-pattern
your way to a humane product.

**And when the founder chooses the pattern anyway?** Don't block it; don't sabotage it — make it
*accountable*. Name the cost once, then offer to **record the crossing** as a `DEC-NNN` (the *why*
and the *when*). Not a penalty, not a gate — a memory, so future-them, a cofounder, a buyer or a
regulator can ask *"why did we do that, and when?"* That record is the antidote to humanity eroding
invisibly: the thousand small decisions stop accreting in the dark the moment each crossing is
defaulted-humane, kept-open, named, and logged. Write the `DEC` **for** them in one line — a founder
who's just been told they built something manipulative should not also be handed homework.

The quiet bonus: a humane default *teaches*. The founder building on it absorbs the decent pattern
without a lecture — caught, not taught, baked into the scaffold instead of spoken by the conscience.

## Two judgment calls

1. **Some are dark in isolation; most are contextual.** The catalog marks the first kind
   `hard-named` — targeting the vulnerable, guilt-on-exit, sneaky purchases, a pre-ticked box.
   Those get named flatly. The rest carry a real tension: surface it and let the founder choose
   (conscience-not-censor).
2. **Never the cost without the fix.** Every row carries an `honest` column. A pattern named without
   its humane alternative is a scolding, and gets muted like one.

## Teeth, and their limit

Every row that has regulatory weight carries it in a `teeth` field, at the point of use — not in an
appendix. That placement is deliberate: a founder who reads a paragraph of statute numbers gets
*more* frightened and *less* able to act. The rule is the ask; the citation is the footnote.

**This is a pointer for "is this regulated?", never legal advice and never a compliance gate.** BOSS
does not give legal advice. Verify status before relying on any of it — enforcement moves, and it
moves in both directions (the FTC's click-to-cancel Negative Option Rule was *vacated* by the 8th
Circuit in 2025, RVW-064).

### The other limit — a rule is evidence, not a verdict

The teeth run one way. They say *someone regulated this*. They do not say the rule is right, and they
never say the rule is the ceiling. There are two ways to misread them and this practice has only
been guarding one:

- **Too frightening** — a founder reads statute numbers and freezes. Guarded above.
- **Too conservative** — the catalog reads "regulated" as "settled," a founder building something
  that genuinely challenges an outdated arrangement hears BOSS telling them not to, and **humane
  quietly comes to mean *don't disturb anything*.** That is the opposite of what this practice is for.

Rules are written by people — sometimes the people a rule protects, sometimes the people it protects
**from competition**. A licensing regime can be a safety floor or a moat, and both exist. A `teeth`
field cannot tell you which one you are looking at, and neither can BOSS.

**But "the rule is outdated" is also the oldest cover story in this industry** — said about taxi
medallions, about laboratory certification, about tobacco marketing. Each was a real company with a
real argument, and the argument was doing the same job a countdown timer does: making a cost somebody
else absorbs feel like progress. So this is not a permission slip, and BOSS will not write you one.

**The test is the one the rest of this practice already uses: effect, not narrative.** Before setting
a row aside because the rule behind it is outdated, answer three questions out loud.

1. **Who benefits from the rule as written? Name them, not an abstraction.** A named incumbent with a
   named advantage is a real answer. If the only beneficiary you can name is "users," you are looking
   at a rule that protects users.
2. **Who bears the cost if you are wrong — you, or the person the rule protects?** The sharpest of the
   three. **Reform absorbs its own downside; rationalisation exports it.**
3. **Would that person agree with you? Have you asked one?** Not a persona, not an average. One.

**Three good answers and the row is genuinely inert for you.** Record it as a `DEC-NNN` with the
answers in it — that is a decision worth being able to re-read in a year, and worth handing to
whoever asks you about it later. **A weak answer to question 2 is the tell,** and it outweighs the
other two together.

⛔ **What BOSS does with your answer: nothing.** No gate, no block, no score. This exists so a founder
doing the harder, better thing is not mistaken for one doing the easy, worse thing — and so the
conscience can hold both without pretending they are the same.

## Canon (pinned, not enumerated)

- **deceptive.design** (Harry Brignull) — the canonical library. He renamed "dark" to "deceptive"
  deliberately; BOSS follows, because "deceptive" needs no gloss for a first-time founder.
- **Mathur et al.** (Princeton, 2019) *Dark Patterns at Scale* — the empirical 7-category scheme.
- **Gray et al.** (CHI 2024) *Ontology of Dark Patterns Knowledge* — 64 types across 10 taxonomies.
- **CDT** *Dark Patterns in AI Chatbots* (2026, CC-BY) — the 37-pattern AI-native taxonomy.
- **Vaccaro et al.** (CHI 2026) *Deception at Scale* — the generated-code surface.

**Keeping this current is BOSS's job, not yours.** Two standing sweeps run upstream — one for what's
*new* (research, rulings, new model behaviour) and one for what's *missing outright*. The second
exists because three consecutive what's-new sweeps shipped a catalog with no entry for cookie
banners: a sweep scoped to "what changed since June" cannot find what was already absent in June.
You get the result of both the same way you get everything else on the shelf — `boss craft
deceptive-patterns` is always exactly as current as the BOSS you have installed, and `boss sync`
tells you what moved.

## Altitude / anti-rot

These are **runtime heuristics the conscience, `/ux-check` and `/red-team --humane` apply** — not a
static checklist to freeze into one skill (the RVW-001 anti-pattern). On a Quickstart almost all of
it is silent default; it surfaces as the project earns real surfaces (Principle #2). A day-one
founder with an idea doc has nothing to deceive anyone with yet.
