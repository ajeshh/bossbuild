---
name: pretotype
description: Test demand BEFORE you build (not /prototype, which builds). Savoia's discipline applied to {{PROJECT_NAME}} - a fake-door, wizard-of-oz, Mechanical-Turk or impresario test for the riskiest demand assumption, in days not weeks. Page-shaped tests can be PUBLISHED in one turn as a real URL. Usage - /pretotype [IDEA-NNN]
argument-hint: "[IDEA-NNN]"
---

# /pretotype — test demand, then build

**"Most new products fail not because they're built poorly, but because they're the wrong product."**
— Alberto Savoia. A pretotype is a *pretend prototype* — designed to test whether anyone actually
wants the thing, *before* you build the thing. You captured the idea with `/idea` and
pressure-tested it with `/canvas`. Now the canvas has a sharp riskiest assumption (the canvas-loop
closed). The next discipline is **demand-testing it** — not prototyping it (that's after) and not
shipping it (also after). Pretotype first; build only what demand justified.

This skill ships in **Quickstart**, on the near side of `boss unlock mvp`, because the canvas earns
the question and the canvas is a Quickstart artifact. It used to sit at MVP, which meant
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
2b. **Read `docs/competition/` if it exists — it changes the question.** If a rival
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
| **Fake door** | Will anyone click? | A landing page describing the product with a "sign up" button that captures emails for a list. No product behind. *(BOSS can publish this page for you — see [`publish.md`](publish.md).)* |
| **Wizard of Oz** | Does the experience deliver value when it works? | The "AI" is humans answering manually. Founders behind the curtain. Test the value before the build. |
| **Mechanical Turk** | Same — humans do what code will eventually do | A spreadsheet + a human + a few hours daily. Test demand-and-value-together. |
| **Pinocchio** | Does it feel real enough to be used? | A non-functional mockup that *seems* real — clickable Figma, low-fi HTML. Test the workflow, not the engine. |
| **YouTube test** | Will people get the pitch? | A 60-90s video showing the product working (recorded mockup). Share with target audience; count: how many ask to try? |
| **Impresario** | Will anyone commit before you build? | Announce the product + take signups / pre-orders / waitlist. Count the friction-overcome behavior, not stated interest. |

If the pattern is page-shaped — **fake door**, **Pinocchio** or **Impresario** — open
[`publish.md`](publish.md) and follow it: publishing the page in one turn, and the line a fake door
does not cross.

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

   **Then record the result with `/evidence`.** A number from real people is the strongest thing a
   pretotype produces, and in the log alone it never reaches the canvas, the roadmap or the conscience.
   A signup is `observed-behavior` (it measures curiosity); a pre-order or a deposit is `commitment`.
   `/evidence` grades it — say which assumption it tests.

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
  Different question. **`/prototype` is a real skill on this same rung and it is one letter
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
