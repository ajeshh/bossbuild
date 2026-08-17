---
name: consult
description: Convene the mentor board on a cross-cutting question — route it to the mentors who actually have a stake, get each one's take in their own lens, and synthesize the answer with the disagreements kept visible (not averaged away). The humane lens can override. Advisory only — the mentors inform; you decide. Usage - /consult <question>
---

# /consult — convene the board on a real question

Some questions don't belong to one mentor. *"Should I raise now, or grow to profitability first?"*
touches fundraising, business model, GTM, and the humane lens at once. `/consult` puts the question in
front of the mentors who actually have a stake, gets each one's honest take **in their own lens**, and
hands you a synthesis that **keeps the disagreement visible** — because where seasoned advisors
disagree is exactly where the real decision lives.

It's the orchestration layer over the individual `mentor-*` agents: instead of asking them one at a
time and holding the threads in your head, `/consult` runs the panel and composes the result.

## When to run it

- A decision spans more than one domain (raise vs. bootstrap, pricing vs. positioning, hire vs.
  contract, ship-fast vs. get-it-right).
- You're about to make a call you can't easily reverse and want the board's read first.
- A single mentor gave advice and you want to pressure-test it against the others' lenses.

## How to run it

**1. Read the question.** If none given, ask for it in one line. Note what's really being decided.

**2. Pick the mentors who have a stake** — only the relevant ones, not the whole roster (convening
mentors who have nothing to add is noise). Read which mentors are installed (`.boss/manifest.json`
`agents`, the `mentor-*` ones) — the board grows by mode, so consult what's seated:
- MVP seats `mentor-architect` + `mentor-gtm` + `mentor-cofounder`; V1+ adds `mentor-business`,
  `mentor-fundraising`, `mentor-pitch`, `mentor-talent`. `mentor-venture` is seated from Quickstart and
  **always** gets a voice on a real decision.
- Map the question to lenses: a raise question → fundraising + business + venture; a build-speed
  question → architect + venture; a pricing question → business + gtm.
- **The humane lens has no chair, on purpose** — an ethics advisor is a door you can decline to open.
  *You* carry it, in step 4, on every panel. Don't route it to an agent; there isn't one.

**3. Get each mentor's take in their own voice.** Consult each relevant mentor (their agent), with the
*same* question + enough context (read the canvas / RESUME / the relevant FEAT so they're grounded).
Each returns their honest read — including pushback. Don't homogenize; a mentor's job is their lens,
not consensus.

**4. Synthesize — keep the disagreement visible.** Compose the panel's answer:
- **Where they converge** — the points all (or most) lenses agree on. Usually the safe ground.
- **Where they diverge** — name it plainly: *"fundraising says raise now to fund the GTM motion;
  business says your unit economics aren't ready and a raise just buys time you'll burn."* The
  divergence is the actual decision — don't paper over it with an average.
- **The humane override — you run it, every panel, before you synthesize.** No mentor holds this
  lens, so ask it yourself: *who could this harm, who gets excluded, what does it cost them in
  attention, agency or dignity?* Ground it in the canvas's **Risks & Harms** cell and
  `boss craft harm-taxonomy`. If a real harm surfaces, **that lens wins regardless of the viability
  case** — say so plainly, and say which mentor it overrules (Principle #6, *humane before viable*).
- **The riskiest assumption** — tie the decision back to the canvas's named bet where relevant.

**5. Hand the decision back.** End with the call that's *yours* to make, framed: *"the board's split is
real; the question under the question is <X> — which way you lean depends on <the thing only you
know>."* Mentors are advisory. They inform; you decide. Record the call (and which lens you followed,
and why) in `docs/devlog.md` so future-you sees the reasoning, not just the outcome.

## If a venture brain exists
If `.boss/brain/` is present (the conscience's persistent read on this venture — IDEA-022), read it
for context before convening, and append a one-line note on what was decided after. The board's reads
sharpen the brain; the brain grounds the board. (Skip silently if it isn't there.)

## Rules

- **Relevant mentors only.** Convening a mentor with no stake is noise. Pick the lenses that bear on
  *this* question.
- **Disagreement is the product.** Never average seasoned advisors into mush. The split is where the
  decision is — surface it.
- **Humane can override.** A real humane concern outranks the viability case (mentor-humane's standing
  authority). Say when it's been invoked.
- **Advisory, never a gate.** `/consult` informs; it never blocks or decides. The founder decides and
  records the call.
- **Ground them.** Mentors reading nothing give generic advice. Feed each the canvas + relevant
  context so the read is about *this* venture, not ventures-in-general.
