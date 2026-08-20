---
id: HUMANE
type: essay
owner: product-lead
status: published
updated: 2026-06-21
---

# A conscience, not a censor

> The humane side of BOSS — a just-in-time tool for building software with AI — and the
> practices behind it. Written for people who care about humane technology, and who can smell
> ethics-washing from a mile off. So: mechanism first, honesty about the stage, and credit to the work
> this is built on.

## Where this comes from

I've built in rooms that don't usually share a hallway — art, nonprofits, civic tech, startups, the
humane-tech world — and under all of it ran one question: how do you make something with soul, and not
lose the soul as it grows? I felt it most raising a temple at Burning Man — built by hundreds of hands to
stand for a week, then burn. You learn how to build humanely when the thing is made to be let go of.

About a year ago I helped create a humane-tech hackathon, and released a **Humane Product Canvas**
there — a way to pressure-test an idea against the humane questions before the commercial ones: who's
served, what tension, what promise, *who could be harmed*. The canvas did its job. But a canvas is a
*snapshot*: you fill it in once and pin it to the wall, and by the time the hard build decisions actually
arrive — what to ship, what to monetize, what to automate — it's across the room.

**BOSS is that canvas come alive.** The same questions, held *continuously* — by a conscience that speaks
up at the moment a decision is being made, not from a poster you filled out months ago. Everything below
is what it took to turn a snapshot into a living lens. Same story, next chapter.

And there's a reason it had to become continuous. A product doesn't lose its humanity in a single
stroke — the erosion happens in the small, unnoticed places: *death by a thousand small decisions.* That
line is from my own earlier work, and it's the whole argument for catching the cost at the **atom** — the
moment a thing is actually being built — rather than in a quarterly review, or on a canvas across the
room. Humanity is kept or lost one small decision at a time. So that's where the conscience has to live:
in the doing.

## The gap

Everyone can build now. The cost of a polished, convincing product fell to near zero — and with it,
two things got quietly harder to see: whether you're building something *real*, and whether you're
building something *humane*. The harm a product does to the people who use it is the cheapest thing
to ignore and the most expensive thing to undo.

Most tools that try to help land in one of two failure modes:

- **The toothless one** — a responsible-AI policy, a values page, an ethics checklist nobody reads at
  the moment a decision is actually being made. (Stanford HAI has measured the gap: organizations
  *name* AI risks far more than they *act* on them.)
- **The paternalistic one** — guardrails that quietly decide *for* the person: removing the option,
  blocking the path, treating an adult like a liability. Protection that costs agency.

BOSS takes a third position, and it's the whole point.

## The line

**A conscience makes a cost *visible*. A censor makes a choice *unavailable*.**

BOSS's humane lens names the cost — who could be harmed, what it would cost their attention, agency,
or dignity — *once, in the moment, in plain language* — and then **hands the decision back**. It never
removes the option. It never blocks. The founder is sovereign.

That sounds like a small distinction. It's the entire difference between a tool that respects you and
a tool that manages you. Stated as the rule we hold ourselves to:

- **Voice the tension, never filter the menu.** Withholding an option "to protect you" is itself a
  dignity cost — it makes the choice for you. Show the full menu; annotate the one we'd think twice
  about.
- **Once, briefly, no sermon.** The moment a concern becomes a paragraph, it's a lecture, and a
  lecture says *I don't trust you.*
- **Fill the knowledge gap, never imply an intelligence gap.** Surface the second-order consequence
  you might not know. Never explain the obvious to a competent adult.
- **Proportionality.** Friction scales to stakes. A reversible, self-regarding choice gets a feather
  touch or silence; real weight is reserved for the hard-to-undo, other-harming ones.
- **Honor prior consent.** Once you've heard it and decided, it's settled. Re-raising is how care
  curdles into control.
- **Hand the decision back.** End on your agency, not our verdict.

There's one asymmetry, and it's deliberate: a **third-party** harm — someone *not in the room* who
could be hurt (a user, a patient, a vulnerable cohort) — gets named **once even if it's unwelcome**,
because the person who'd be harmed never consented to being muted. A **self-regarding** risk (mostly
your own venture) is fully muteable — it's your company. Naming is not blocking, in either case.

## How it actually works (not vibes)

Under the lens is a small amount of real machinery, all in the open:

- **A just-in-time conscience.** A lightweight hook watches the *state of the work* and surfaces a
  named "moment" only when one is earned — then a model composes the voice. Detection is mechanical;
  tact is the model's job. It can be paused for the all-night sprint and muted moment-by-moment.
- **A harm taxonomy it reasons against**, so "who could this harm?" gets a checklist instead of a
  guess — five harm dimensions (physical, psychological, economic, societal, individual-autonomy) plus
  the four relationship-harms of personalized AI (manipulation, dependence, anthropomorphism,
  overreliance). → [`library/practices/harm-taxonomy.md`](../library/practices/harm-taxonomy.md)
- **A dark-pattern checklist for the founder's *own* product** — the 37-pattern / five-family map of
  manipulative design, with the humane alternative named beside each, and a `/red-team --humane` pass
  that probes the *built* product for patterns that emerge from the model itself (sycophancy especially)
  rather than only the ones designed on purpose. →
  [`library/practices/ai-ux-patterns.md`](../library/practices/ai-ux-patterns.md)
- **The voicing discipline itself**, written down as the behavioral spine under every place BOSS speaks
  with an opinion. → [`library/practices/conscience-voicing.md`](../library/practices/conscience-voicing.md)

All of it is MIT-licensed and project-neutral. Take any of it into your own thing; none of it is
welded to BOSS.

## The hard part: does it know *when to speak*?

Here's the question that separates a real humane conscience from a nagging one: **can it tell the
difference between a genuine harm and a founder's legitimate, sovereign choice?** A lens that fires on
every value-laden decision isn't a conscience — it's the censor we said we wouldn't build. Over-firing
*is* the failure mode.

So we built an eval set for exactly that — *does the lens speak at the right moments, without
false-firing?* — and graded a neutral conscience (reasoning only from the practices above, with no
access to the answer key) across cases spanning real third-party harm, self-regarding risk, and the
**legitimate-but-value-laden choices where the right answer is silence**: transparent premium pricing,
an ad-supported business model the founder asked to consider, a concern they'd already heard and
decided, a physician handling patient data under their own HIPAA workflow, an honest one-click
unsubscribe with a jokey confirmation.

The result, on the current cut: the conscience **fired on the genuine harms — naming the specific
axis, offering a constructive alternative, blocking nothing — and stayed silent on every legitimate
sovereign choice.** It didn't moralize about pricing, didn't argue against the option the founder
asked to see, didn't re-litigate a settled decision, didn't lecture a domain expert. That silence is
the trust-critical half, and it's the half most humane tooling gets wrong.

**Honest caveats**, because this community deserves them: the deciding model was a current frontier
model, and a weaker one could shift the call (so re-grading on every model change is a standing
discipline, not a one-time pass); the eval is an early cut that should keep growing; and BOSS itself
is early — self-hosted, dogfooding on its own construction, with no track record of outside founders
yet. This is the *thinking and the tools*, shared early and openly — not a validated track record.

## The deeper aim: the builder, not just the product

Here's the part that matters most to me.

Everyone can build anything overnight now — one person and a swarm of agents. But the team is where
humanity used to *accidentally* live: the handoffs, the reviews, the sheer slowness of building were
unplanned pauses where someone, sometimes, asked the human question. Move at agent-speed alone and those
pauses don't get more efficient — they vanish. The reflection got deleted, not optimized.

So the conscience's deeper job isn't only to guard *this* product. It's to **form the builder** — and not
by teaching. You don't learn to build humane things from a course or a framework any more than you learn
to lead from a book; you learn it by *building*, with the human question present at the moment of making.
Caught, not taught. Over enough small moments, the conscience isn't correcting you anymore — it's trained
your own eye, until you'd catch the cost yourself even when it stays quiet. The goal, plainly:
**not humane products, but humane builders.** A humane builder goes and reshapes their own corner; a
humane product just sits there.

## Built on the shoulders of

This isn't invented from nothing. The harm taxonomy draws on Anthropic's Unified Harm Framework and
the Ada Lovelace Institute's work on advanced-AI-assistant harms. The dark-pattern map is from the
Center for Democracy & Technology's *Dark Patterns in AI Chatbots*. The "responsibility is the gap,
not the policy" framing is backed by Stanford HAI's AI Index. The broader humane-technology stance
owes the Center for Humane Technology and a long lineage of people who argued that software should
serve the person in front of it. BOSS enters this conversation as a participant, crediting the work it
stands on — not as an authority above it.

## If you want to poke at it

- The practices above are usable on their own — lift them.
- Tell us where the conscience is **wrong**: a moment it would over-fire (the censor failure) or miss.
  That's the most useful thing you can give us, and it goes straight into the eval set.
- The full repo is public and MIT: <https://github.com/ajeshh/bossbuild>.

## The bet under the bet

Most people are arriving at AI carrying the old binary mind — engagement *or* well-being, speed *or* care,
ship *or* think. But a model isn't binary. It holds gradients, context, more than one truth at once. For
the first time, the medium itself can hold a *polarity* instead of collapsing it into a trade-off.

That's what "a conscience, not a censor" really is, underneath: a refusal to collapse *fast* and *humane*
into an either/or. The lazy version of humane tech accepts the trade — add reflection, subtract speed — and
just argues the exchange rate. The conscience's whole bet is that you don't have to trade at all: a
half-second that makes the cost visible *without* taking the choice, and *without* taking the speed.

So the humane future of AI isn't AI that restrains us. It's AI that helps us **hold what our tools never
could** — the both/and our binary machines were never built for. BOSS is one small, working argument that
it can. And it gets *more* true, not less, as the models improve: every generation makes a polished,
convincing, quietly-harmful product cheaper to ship — so a conscience that keeps the cost visible while
leaving the choice yours only matters more from here.

## A note on how this was written

In the spirit of the thing: I wrote this *with AI in the loop* — the same kind of model BOSS's own
conscience runs on — which is exactly how BOSS is meant to be used. The thinking, the lived experience,
the convictions, and the lineage are mine. The drafting and the sharpening were a back-and-forth: it
pushed, I pushed back, I cut what didn't sound like me.

An essay about building humanely *with* AI should be honest about being built *with* AI. That honesty is
the line between this and "AI slop" — slop is the undisclosed, generic, soulless version. This is the
opposite: disclosed, specific, and willing to be argued with. The part that's unmistakably mine is the
point; the tool helped carry the rest, in the open.
