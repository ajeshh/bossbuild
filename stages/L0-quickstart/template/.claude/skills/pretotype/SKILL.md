---
name: pretotype
description: Test demand BEFORE you build (not /prototype, which builds). Savoia's discipline applied to {{PROJECT_NAME}} - a fake-door, wizard-of-oz, Mechanical-Turk or impresario test for the riskiest demand assumption, in days not weeks. Page-shaped tests can be PUBLISHED in one turn as a real URL. Usage - /pretotype [IDEA-NNN]
---

# /pretotype — test demand, then build

**"Most new products fail not because they're built poorly, but because they're the wrong product."**
— Alberto Savoia. A pretotype is a *pretend prototype* — designed to test whether anyone actually
wants the thing, *before* you build the thing. You captured the idea with `/idea` and
pressure-tested it with `/canvas`. Now the canvas has a sharp riskiest assumption (the canvas-loop
closed). The next discipline is **demand-testing it** — not prototyping it (that's after) and not
shipping it (also after). Pretotype first; build only what demand justified.

This skill ships in **Quickstart**, on the near side of `boss unlock mvp`, because the canvas earns
the question and the canvas is a Quickstart artifact. It shipped at MVP until v0.271.0, which meant
the cheapest way to find out nobody wants this sat behind the command that hands you the build
tools — so the only route to *don't build it yet* ran through *here is everything you need to build
it*. **A demand test is worth most in the hour before the first line of code, and that hour is
here.** Its two page-shaped siblings stay at MVP on purpose: `/landing` and `/ship` make a page you
intend to keep, and keeping is a build.

## When to run it

- An IDEA has a `/canvas` with a *real* riskiest-assumption line (the canvas-loop has closed).
- You're about to write code against the idea. **Don't.** Pretotype first.
- A previous pretotype gave you a clear answer (yes/no/maybe) and the idea pivoted — re-pretotype
  the new bet before building against it either.

## How to run it

1. **Pick the IDEA.** `[IDEA-NNN]` if given, else the most active idea with a filled canvas.
2. **Read the canvas.** Especially: People (who), Problem (the tension), Promises (the value),
   riskiest assumption (what could kill this).
2b. **Read `docs/competition/` if it exists (v0.294.0) — it changes the question.** If a rival
   already does this and is marked *in evidence* (a real person named them), the honest demand test
   is not *"would you use it?"* but **"would you switch?"** — a materially harder bar, and the one
   most fake doors quietly dodge by not mentioning the incumbent. If the rival is a `watch` row
   (filed, nobody has named them), keep the ordinary test and note the row. Either way the
   *"doing nothing"* row is the alternative the pretotype is really up against, and the page should
   say what people do today rather than pretend the field is empty. No competition file? Skip this;
   the canvas Problem cell's *what do they use instead* is the right-sized version at this rung.

3. **Pick a pretotype pattern.** Match the pattern to the riskiest assumption:

| Pattern | Best for | Example |
|---|---|---|
| **Fake door** | Will anyone click? | A landing page describing the product with a "sign up" button that captures emails for a list. No product behind. *(BOSS can publish this page for you — see below.)* |
| **Wizard of Oz** | Does the experience deliver value when it works? | The "AI" is humans answering manually. Founders behind the curtain. Test the value before the build. |
| **Mechanical Turk** | Same — humans do what code will eventually do | A spreadsheet + a human + a few hours daily. Test demand-and-value-together. |
| **Pinocchio** | Does it feel real enough to be used? | A non-functional mockup that *seems* real — clickable Figma, low-fi HTML. Test the workflow, not the engine. |
| **YouTube test** | Will people get the pitch? | A 60-90s video showing the product working (recorded mockup). Share with target audience; count: how many ask to try? |
| **Impresario** | Will anyone commit before you build? | Announce the product + take signups / pre-orders / waitlist. Count the friction-overcome behavior, not stated interest. |

### Publishing a fake door in one turn (no deploy, no host, no cost)

Savoia's whole argument is that a demand test must be **cheap and fast** — and the usual reason a
fake door never happens is the *page*: design it, build it, find somewhere to put it. If the founder
is running a **fake door**, **Pinocchio** or **Impresario** pattern, offer to publish the page as an
**Artifact** instead: a real, shareable URL in this turn.

**Compose it from what BOSS already holds** — don't interview them for copy they've written already:
the canvas's **People** (who it's for), **Problem** (the tension, in their words), and **Promises**
(the value), plus **`docs/BRAND.md`** voice and the design tokens if they exist. **No brand doc?**
Seed one — it is a living, lens-neutral file that any skill can start and none owns (`/landing`
carries the skeleton at `templates/brand-doc.md`); mark it `nascent` and move on. A fake door
generated from a nascent brand should read *plainer* than the real thing will, never invent
personality to fill the gap. One screen: what
it is, who it's for, one honest claim, one call to action.

**Capture is external, and you must say so plainly.** A published page is sandboxed — it makes no
network calls and **stores nothing**, so it cannot collect an email by itself. That is a hard limit,
not a detail to gloss:

> "The page can't collect emails on its own. Make a free form first — Tally, Formspark, a Google
> Form — and I'll wire the button to it. Your signup count lives there; that's your metric."

The button is an ordinary link out to that form. **Never imply the page is capturing anything it
isn't** — a fake door that silently drops signups is worse than no test, because the founder acts on
a zero that was really a plumbing bug.

**Then, in order:** publish → **tell them it is private until they share it** (that's a real step,
not an assumption) → they send the URL to the audience the canvas named → the count accrues in the
form tool → they bring it back and you write it into the pretotype log below.

**What this is not.** It is not a host. The moment someone says yes, the product needs a real home —
that's `/ship`, which arrives with `boss unlock mvp`. Keep the handoff explicit so demand-testing and
delivery stay separate; **needing a host is a result, not a prerequisite.**

**And it is not the only page BOSS builds — know which one you want.** `/landing --demand` builds the
same door *in the repo*: version-controlled, on-brand from the token system, deployed through `/ship`.
Both of those are MVP verbs. The split is about what the page has to survive, not about which is
better — and the rungs they sit on say the same thing the table does:

| | **Publish here (Artifact)** | **`/landing --demand`** |
|---|---|---|
| Available | now, in Quickstart | after `boss unlock mvp` |
| Cost to first URL | this turn — no host, no account | a deploy |
| Lives in | the artifact, not the repo | the repo, under version control |
| Best when | you are testing and expect to throw it away | the page will outlive the test, or the brand matters |

**Default to publishing here for the test.** A demand test that waits on a deploy is the delay Savoia's
whole argument is about, and most fake doors *should* be thrown away. Reach for `/landing` when the page
is going to stick around — and **if you find yourself wanting it to stick around before anyone has said
yes, that is the pretotype telling you something.**

**The line a fake door does not cross** (`ai-ux-patterns.md`, PRINCIPLE #6). Testing demand for
something that doesn't exist yet is honest. These are not:
- impersonating a real company, or borrowing one's branding to seem legitimate;
- implying the thing is **live and purchasable** when it isn't, or taking money for it;
- fabricated social proof — invented testimonials, fake user counts, "join 10,000 others";
- manufactured urgency, fake scarcity, or confirmshaming the decline ("no thanks, I like wasting time").
- The full set for a fake door: `boss craft deceptive-patterns --surface social-proof-and-claims`.

The test is whether you could **follow up honestly**: if someone signs up and you email them "we're
building this, you're on the list" — does that match what the page led them to believe? If not, the
page is lying, and the signal it produces is worthless anyway.

4. **Design the test.** Three required pieces (the **TRI metric** — Savoia):
   - **Tangible** — concrete behavior, not stated preference. Signups, click-throughs,
     pre-orders, not "I'd use it."
   - **Real-time** — this week or this month, not last quarter's user-research.
   - **Imminent** — actionable; the result *immediately* changes the plan.

5. **Run it.** Days, not weeks. The pretotype is meant to be cheap; if it takes more than a
   week to construct, you're overbuilding.

6. **Capture results in the idea's pretotype log.** Append to `docs/ideas/IDEA-NNN.md`:

   ```markdown
   ## Pretotype log
   - YYYY-MM-DD — Pattern: <fake-door / WoZ / etc.>
     - Designed to test: <riskiest assumption>
     - Tangible metric: <signups / click-throughs / pre-orders / etc.>
     - Threshold for "yes": <N — set BEFORE running, per Maurya's discipline>
     - Result: <number — vs. threshold>
     - Decision: <persevere / pivot / kill the bet>
   ```

7. **YODA — Your Own Data > Anything.** Don't lean on benchmarks, surveys, or "the market." Run
   *your own* pretotype with *your* audience in *your* context.

8. **Set the threshold BEFORE running** (Ries's pivot-or-persevere discipline). If you set
   it after, you'll rationalize whatever happened.

## Connection to other loops

- **Upstream:** canvas-loop closed (riskiest assumption named).
- **Downstream:** if pretotype gives a yes, *now* unlock and spec the FEAT (`boss unlock mvp`, then
  `/spec`) — and that yes is the best reason to cross that gate anyone gets. If pretotype gives a no,
  pivot the canvas or kill the bet (record in the idea's status) — **and you kept the build tools in
  the box, which was the whole point.** If maybe, refine the pretotype.

## What this is NOT

- **Not a prototype.** Prototype = "does it work in code." Pretotype = "does anyone want it."
  Different question. 🔴 **`/prototype` is a real skill on this same rung and it is one letter
  away** — if the founder typed one and meant the other, say which one you are about to run and
  why, before running it. Reaching for `/prototype` here is not a typo to correct silently; it is
  usually the honest instinct this skill exists to interrupt.
- **Not a survey.** Surveys ask what people would do. Pretotypes ask what they actually do.
  Behavior, not stated preference.
- **Not a "soft launch."** Soft launch is shipping cautiously to real users. Pretotype is
  testing the bet without shipping a product at all.

## Rules

- **Test the riskiest assumption FIRST.** Order pretotypes by what could kill the model (Maurya),
  not what's cheapest or most fun to build.
- **Time-box ruthlessly.** Pretotypes that take longer than a week are pretending. You're
  overbuilding.
- **Set the threshold before running.** Otherwise you'll move the goalposts in either direction.
- **Behavior over stated preference.** "Would you use this?" → trash answer. "Did they click?" →
  real answer.
- **Right It before It right** (Savoia). Build the right product right, not the wrong product
  beautifully.
- **Cite Savoia** when you author the practice or share results.
