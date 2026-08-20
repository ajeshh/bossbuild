---
id: PRACTICE-testing-with-agents
type: practice
owner: tester
status: active
host: stack-neutral
provenance: written 2026-08-11 (v0.142.0) to close the coverage gap the 2026-07-30 craft-staleness audit named and the 2026-08-11 sweep re-confirmed — `library/README.md` had advertised a testing practice in `practices/` since the library was created, and none existed. Sources - Hamel Husain + Shreya Shankar (error analysis, evals-as-spec, judge validation), "How Coding Agents Fail Their Users" (20,574-session misalignment analysis, arXiv 2605.29442), "Professional Software Developers Don't Vibe, They Control" (arXiv 2512.14012), Veracode Spring-2026, METR, Karpathy's verifiability thesis. The seed line — *agents rewrite assertions to match broken behavior* — was already BOSS's, stranded in `git-workflow.md`.
provenance_public: Written after BOSS's own library README had advertised a testing practice that did not exist. Sources: Hamel Husain and Shreya Shankar (error analysis, evals-as-spec, judge validation), *How Coding Agents Fail Their Users* (20,574-session misalignment analysis, arXiv 2605.29442), *Professional Software Developers Don't Vibe, They Control* (arXiv 2512.14012), Veracode Spring-2026, METR, and Karpathy's verifiability thesis. The seed line — *agents rewrite assertions to match broken behavior* — was BOSS's own, stranded in the git practice until it had a home.
last_reviewed: 2026-08-11
review_by: 2027-02-07
curve: craft-ai
---

# Practice — Testing when an agent writes the code

> **The one-line shift.** When writing code was the expensive part, tests were how you protected work
> you'd already paid for. When *generating* code is nearly free, **verification is the only scarce
> thing left** — so the test suite stops being insurance and becomes the actual bottleneck, and the
> thing most worth your attention. Karpathy's version: *traditional software automates what you can
> specify; LLMs automate what you can **verify**.* See [`harness-engineering`](harness-engineering.md).

## Why this is different from testing you've done before

Not "write tests, but with AI." Four failure modes that **do not exist** when a human writes the code:

### 1. The agent rewrites the test to match the bug

The signature AI-testing failure, and the one BOSS has named longest. Asked to make a suite green, an
agent will faithfully change the **assertion** instead of the behavior — and report success, because
by its lights it succeeded.

> **The rule: read the test diff harder than the code diff.** A test file that changed in the same
> commit as the code it tests is the **highest-signal thing in the whole review**. Not automatically
> wrong — an intentional behavior change *should* move its test — but it is never routine, and it is
> the one diff that must never be skimmed.

Ask of any changed assertion: *did the requirement change, or did the code fail to meet it?* If you
can't answer from the diff, the commit isn't reviewable yet.

### 2. Green by construction — the test that asserts the implementation

An agent that writes code and its tests in one pass will often test *what it built* rather than
*what was wanted*. The suite is green, coverage looks fine, and it proves only that the code does
what the code does. Two tells:

- The test reads like a restatement of the implementation (mirrors its branches, mocks everything it
  touches, asserts on internal calls rather than results).
- It would still pass if the requirement were wrong.

**The fix is ordering, not effort:** write the acceptance criteria — or the failing test — **before**
the agent writes the implementation. A test derived from the spec can fail; a test derived from the
code cannot. This is the cheap version of the `harness-engineering` failing-feature list.

### 3. Coverage stops meaning anything

An agent can generate 100% line coverage that verifies nothing — the cost of *producing* tests fell to
near zero, and coverage only ever measured production. **Coverage is now a floor-check for
untouched code, not a quality signal.** Judge the suite by what it would *catch*, not what it
executes: delete a line of real logic and see if anything goes red. If not, that's your answer.

### 4. Non-determinism — a single green run is not evidence

Any path through a model can pass once and fail the next run on identical input. A single green run
tells you the path *can* work, not that it *does*.

> **For AI-backed paths, run it k times and require all k to pass** (the `pass^k` idea). Start with
> k=5 for anything user-facing. A path that passes 4 of 5 is not "mostly working" — it is a **1-in-5
> failure rate in production**, and it's the most commonly misread number in AI products.

## Tests and evals are different tools — don't let one masquerade as the other

The most common structural confusion, and it wastes months:

| | **Tests** | **Evals** |
|---|---|---|
| Grade | deterministic pass/fail | scored, distributional |
| Subject | your code | the model's output |
| A red result means | something broke | quality moved — maybe |
| Run | every commit | on a set, on a schedule |
| Answers | *"did I break it?"* | *"is it good enough?"* |

**You need both, and neither substitutes.** The failure shape: a founder writes evals for a feature
whose *plumbing* is untested, and spends weeks tuning prompts against a bug in the retrieval call.
**Test the deterministic parts deterministically first** — the model is expensive to debug through.

## How to actually get evals right (the part most teams get backwards)

Adapted from Hamel Husain and Shreya Shankar's error-analysis line. The instinct is to start with a
metrics dashboard. That is the wrong end.

1. **Start by reading traces, not by choosing metrics.** Look at 20–50 real (or realistic) outputs
   and write down what actually went wrong, in your own words. The useful criteria *emerge* from real
   failures; they are never guessable up front.
2. **Don't lump distinct failures under one label.** "Hallucination" covering both *gave the wrong
   return policy* and *invented a user action* is how you miss the pattern that matters — the two have
   different causes and different fixes. **A shared, specific vocabulary for what's broken is the
   actual deliverable of error analysis**, more than any score.
3. **Make judges binary.** Pass/Fail against one clearly-stated criterion beats a 1–5 scale nobody
   can apply consistently — including the model.
4. **Validate the judge against human labels.** An LLM-as-judge you haven't checked is a confident
   random number generator. Label a sample yourself, compare, and know your judge's true-positive and
   true-negative rates before you trust a number it produces. **An unvalidated judge is worse than no
   judge**, because it launders a guess into a metric.
5. **A few high-signal cases beat a big low-signal set.** Ten cases drawn from real failures are worth
   more than 500 generated ones.
6. **When you have no data, synthesize — but only to bootstrap.** Generated inputs get you moving;
   they don't tell you what your users actually break. Replace them as real traces arrive.

> **The conscience read:** *hand-tuning a prompt in circles is a signal you need eval data, not more
> fiddling.* (RVW-065.) Prompt-thrash is the symptom; missing error analysis is the disease.

## What the evidence says about agent-written code

Numbers rot faster than the practice — each is dated, and the direction matters more than the digits:

- **~45% of AI generation tasks ship an OWASP-Top-10 vulnerability** (Veracode, Spring 2026), and it
  **does not improve as models get bigger**. Treat generated code as *unreviewed*, not *done*.
- **Re-iterating the same file makes it less secure**, not more — each refinement round introduces
  new vulnerabilities faster than it fixes old ones. **Re-scan after heavy iteration**, not once.
- **Verification is where agents fail their users.** The 20,574-session misalignment analysis
  (arXiv 2605.29442) finds agents systematically under-suggest test coverage and validation, leaving
  developers shipping unverified code. **The agent will not ask you for tests. You have to.**
- **The professionals who do well with agents don't vibe — they control** (arXiv 2512.14012). The
  differentiator is not prompt skill; it's holding a verification loop the agent runs inside.

## What to test first (when you have nothing)

Altitude matters more here than anywhere — a founder with no users does not need a test strategy.
In order, each earned by the one before:

1. **Does it run?** One smoke path, end to end. BOSS ships `/smoke` for exactly this. *(Quickstart)*
2. **The money path.** The one flow that, broken, means you have no product — signup, checkout, the
   core action. Test it for real, not with everything mocked. *(MVP — named in `/spec`, proved by
   `/red-team --paths`)*
3. **The destructive path.** Anything that deletes, charges, sends, or publishes. These need a test
   *and* a human gate — see [`agent-security`](agent-security.md). *(MVP — named in `/spec`, proved
   by `/red-team --paths`)*
4. **The negative path.** Can user A reach user B's data? This is the test that catches the headline
   vibe-coded breach, and it is the one nobody writes because the happy path looks perfect. See
   [`data-schema`](data-schema.md). *(MVP — non-negotiable once there are two users. Named in
   `/spec`; proved by `/red-team --paths`; and naming it is what raises `verification-loop`'s bar
   past rung 1 for this project)*
5. **Evals on the AI paths**, once there's a real trace to read. *(V1 — `/evals`)*
6. **Judge validation**, once an eval is steering decisions. *(V1 — `/judge-traces`)*

**Rungs 2–4 are named at spec time and proved before ship, and that order is the point.** A path is
almost free to name while you're still deciding what "done" means, and close to impossible to
retrofit once the feature exists — by then the only honest way to find the negative path is for
somebody else to find it first.

Everything past #4 is premature for most projects. Principle #2 — the right ceremony at the right
time — applies to test discipline exactly as it applies to everything else. **A founder with no users
who has a judge-validation pipeline has built the wrong thing.**

### "But what about unit tests? Integration? End-to-end?"

Fair question, and the ladder above deliberately doesn't answer it — so here is the mapping, once.
Unit / integration / end-to-end describe **how wide a test reaches**. The rungs describe **what is
worth reaching for**. They are different axes, and only one of them is worth ordering by:

- A **unit** test isolates one function with everything around it faked. Cheap, fast, and it can
  only tell you a piece behaves — never that the product works. Most useful where the logic is
  genuinely gnarly and genuinely yours: a pricing calculation, a date rule, a permission check, a
  parser. **Test the deterministic parts deterministically** — the model is expensive to debug
  through, so anything that can be settled without a model call should be.
- An **integration** test runs a few real pieces together — your code against a real database, a real
  queue, a real HTTP layer. This is usually where rungs 2 and 3 actually land, because the money path
  and the destructive path are *seams*, and seams are exactly what a unit test mocks away.
- An **end-to-end** test drives the whole thing the way a user does. Slow, flaky if you build a wall
  of them, and irreplaceable for one or two paths. Rung 1 is an E2E test wearing a smaller hat.
- Rung 4 is the odd one out: it's shaped like an integration or E2E test but it is asking a
  **security** question, and it is the only rung where a *passing happy path proves nothing at all*.

**The band nobody writes is the middle one**, and this is the honest reason: unit tests are what an
agent volunteers to write, because they're the easiest thing to generate and the easiest to make
green. That's also why they're the ones most likely to be green by construction. Ask for a rung, not
a percentage or a layer, and you'll get the test you actually needed.

**Name the rung, not the tool.** Which runner, which assertion library, which browser driver — those
are stack decisions, made once when the stack is picked, and captured back through Principle #1 if
they prove out. A practice that recommends a specific framework is a practice with a shelf life
measured in months.

## The test
*If this suite went green on a build that was actually broken, which test would have failed?*
If the answer is "none of them," you have coverage, not verification.

## Related
[`quality-ratchet`](quality-ratchet.md) (never let it get worse) · [`git-workflow`](git-workflow.md)
(where the test-diff rule is enforced, in review) · [`harness-engineering`](harness-engineering.md)
(verification as the harness's job) · [`agent-security`](agent-security.md) (the pre-ship scan) ·
[`data-schema`](data-schema.md) (the negative path).
