---
id: PRACTICE-accessibility
type: practice
owner: designer
status: active
host: stack-neutral
provenance: authored 2026-09-10 after Ajesh named the gap directly — *"it's more about the principle rather than being able to enforce accessibility, but knowing the guidelines and being able to recommend or look up based on best practices."* BOSS had shipped a11y as scattered reminders (a four-line floor in the STYLE_GUIDE skeleton, bullets in /design-review and /ux-check, honest `not checked` labels) with **no practice behind them** — so its agents could repeat rules without being able to reason from a basis or point anywhere. Structure is W3C's own (the four POUR principles + WCAG conformance levels), which is deliberate: the lookup structure should match the standard's, or a founder cannot follow a recommendation back to its source. The checkable/not-checkable split is BOSS's own and comes from `/ux-check`'s observed/inferred discipline (v0.218.0). The beyond-the-visual half was an open gap on IDEA-092.
provenance_public: Structured on W3C's own framing — the four POUR principles and the WCAG conformance levels — so a recommendation can always be followed back to the standard it came from. The split between what a tool can check and what needs a person is BOSS's, inherited from the observed/inferred discipline its after-code review already uses.
last_reviewed: 2026-09-10
review_by: 2027-09-10
curve: craft
---

# Practice — Accessibility: the guidelines, not the compliance theatre

> **What this is for.** So BOSS can *recommend from a basis and point somewhere*, rather than repeat
> four rules it happens to remember. The founder's framing, and it sets the altitude:
>
> *"It's more about the principle than being able to enforce accessibility — knowing the guidelines,
> and being able to recommend or look up based on best practices."*
>
> **Enforcement is the smaller half and always will be.** Exactly one property in this whole document
> is arithmetic; everything else is a judgment someone has to make. A tool that leads with enforcement
> teaches a founder that accessibility is the set of things a linter catches, which is the most
> expensive wrong idea available here.

## The structure to think in — POUR

W3C organizes the Web Content Accessibility Guidelines under four principles, and **the value of
knowing them is that they are a lookup index, not a checklist.** When something feels wrong and you
cannot name it, the principle it violates is usually obvious, and the principle is how you find the
specific guidance.

| Principle | The question | Where it usually breaks in a young product |
|---|---|---|
| **Perceivable** | can they sense it at all? | colour as the only signal · contrast · no alt text · video with no captions |
| **Operable** | can they *use* it? | keyboard traps · no visible focus · targets too small · a timeout they can't extend |
| **Understandable** | can they follow it? | errors that name the failure instead of the fix · inconsistent navigation · jargon |
| **Robust** | does it survive their setup? | a `<div>` with a click handler and no role · custom controls no screen reader can name |

**Conformance levels: A, AA, AAA.** **AA is the working floor** — it is what most public-sector and
procurement requirements reference, and it is achievable by a solo founder. AAA is not a stretch goal
to aspire to across a whole product; W3C itself does not recommend AAA as a general policy because
some criteria cannot be satisfied for all content. **Target AA; reach AAA where it is cheap.**

⚠️ **Version and specifics: look it up, don't quote this file.** WCAG is a living standard with more
than one current version in circulation and a successor in draft. **Cite the criterion you actually
opened**, and treat any number in this document as a prompt to check rather than an answer. That
caution is the practice, not a disclaimer on it — this is exactly the class of knowledge that rots,
which is why this file carries a `review_by`. **Practically, for you: open the quick-reference rather
than trusting a remembered criterion number — including one remembered by an AI.**

**Where to look it up** — the primary sources, in the order they are actually useful:

- **W3C WAI — the WCAG *Quick Reference*.** The filterable view of the criteria. This is the one to
  open; the spec itself is written for implementers of the spec.
- **W3C WAI tutorials** (forms, tables, images, menus). Pattern-shaped and readable.
- **The ARIA Authoring Practices Guide (APG).** Keyboard behaviour for custom widgets — the answer to
  *"what should arrow keys do in this thing I just invented?"*
- **The platform's own guidance** where you are not on the web: Apple's accessibility documentation
  for iOS/macOS, Android's accessibility guides. **They are not WCAG restated** — VoiceOver rotor
  order and Dynamic Type have no web equivalent.
- **Your platform's built-in auditor** (the browser's own accessibility inspector, Xcode's
  Accessibility Inspector, Android's Accessibility Scanner). Free, already installed, and it catches
  the mechanical half without a single dependency.

## The founder-scale floor — what actually matters before you have users

Not a compliance programme. Six things, and they are cheap if you do them while building and
expensive afterwards:

1. **Contrast on the token pairs.** Arithmetic. See below.
2. **A visible focus state on everything interactive.** The single most common failure in generated
   UI, because `outline: none` is in every reset and nothing puts it back.
3. **Keyboard reachability.** Tab through the flow you just built. If you cannot complete it without
   a mouse, neither can a screen-reader user, and you found it in thirty seconds.
4. **Never colour alone.** A red border is not an error message. Pair every colour signal with text,
   an icon, or a shape.
5. **Real semantics.** A `<button>` rather than a `<div onClick>`. This is the one that decides
   whether assistive technology can describe your app at all, and it costs nothing at write time.
6. **Text alternatives for anything meaningful.** And *nothing* for anything decorative — an empty
   `alt` is the correct answer for a decorative image, not a missing one.

**What is NOT the floor at this stage:** a VPAT, an audit, an overlay widget, an accessibility
statement page. **Overlay widgets deserve a specific warning** — they are marketed as a one-line fix
and are widely criticised by disabled users and accessibility practitioners; they do not substitute
for accessible markup and can actively interfere with a person's own assistive technology. If BOSS is
ever asked for one, this is the answer.

## What a tool can check, and what it cannot — the honest split

This is the half BOSS is unusual for having, and it is what makes its recommendations worth
anything: **a recommendation you can trust is one that says what it did not look at.**

| | Checkable mechanically | Needs a person |
|---|---|---|
| **Contrast** | ✅ **declared token pairs — pure arithmetic** (`contrast-guard`) | text over an image, a gradient, or any translucent overlay — composited at runtime |
| **Semantics** | partly — a `<div>` with a click handler is greppable | whether the role you chose is the *right* one |
| **Alt text** | its *presence* | whether it says anything useful. `alt="image"` passes every checker ever written |
| **Focus** | `outline: none` with no replacement is greppable | whether the focus order makes sense |
| **Keyboard** | ❌ | walking the flow. Thirty seconds, and no tool substitutes |
| **Screen reader** | ❌ | listening to it. Nothing else is evidence |
| **Cognitive load** | ❌ | a person who is tired, distracted, or new |

**BOSS ships no renderer**, so every visual verdict it gives is `inferred` unless something computed
it. That is stated rather than hidden: `/ux-check` marks findings `observed` / `inferred` /
`not checked`, and **`not checked` is never a pass.**

**The one exception is contrast**, and it is worth understanding *why* it is the exception rather than
treating it as the start of a trend: WCAG contrast is a published function of two colour values —
relative luminance, then a ratio. It needs no browser and no judgment, so `contrast-guard` computes it
exactly over the pairs your tokens declare. **Nothing else in this table is going to join it.**

## Beyond the visual — the half that gets left out

The floor above is almost entirely about sight, because that is what checkers see. Two other groups
matter at least as much and have no mechanism at all:

- **Motor.** Target size and spacing · does anything *require* a drag, a hover, or a precise gesture ·
  is there a keyboard path to every action · are destructive controls adjacent to routine ones. A
  hover-only affordance is invisible on touch and unusable with a switch device.
- **Cognitive.** Plain language over clever language · one idea per screen · no timeouts on
  anything consequential, or an extendable one · errors that survive a wrong answer without losing
  what was typed · consistent placement so recognition beats recall. **For a beginner-cohort product
  this is the highest-impact group and the least measured**, and it overlaps almost entirely with
  simply good design — which is the argument for it, not against it.

**Neither is a checker's job.** Both are questions `designer` should be able to *ask*, which is what
this practice exists to make possible.

## The AI-generated-UI angle

Generated UI fails accessibility in a predictable, nameable set of ways, and naming them is most of
the fix:

- `outline: none` survives from a CSS reset and nothing replaces it.
- A `<div>` with a click handler, because it is fewer characters than a button with the same styling.
- Placeholder text used as a label. It disappears on focus, and a screen reader may never announce it.
- An icon-only button with no accessible name.
- Colour as the only state signal, because a colour token is the thing most readily to hand.
- A custom dropdown, tab set or modal with no keyboard model — **the APG exists precisely for this**,
  and an agent that has been pointed at it writes a very different component.

**The leverage is upstream, not in review.** These are prompt-time and component-time facts, which is
why the accessibility floor lives in `STYLE_GUIDE.md` (read on every design turn) rather than only in
a review checklist. A component built right once is accessible on every screen that imports it —
which is the same argument the component index makes, pointed at a different failure.

## Where this shows up in BOSS

- **`STYLE_GUIDE.md` → Accessibility floor** — non-negotiable, and deliberately short.
- **`designer`** — the lens. Reasons from POUR; grades its own visual findings honestly.
- **`/design-review`** (before code) and **`/ux-check`** (after) — the checks, with the
  observed / inferred / not-checked split.
- **`contrast-guard`** — the arithmetic half, and the only one.
- **`/design-library`** — renders contrast per swatch pair, computed rather than estimated.
- **Surface-gating matters here too.** A terminal product's accessibility is a different set of
  questions — `NO_COLOR`, screen-reader-friendly output ordering, no reliance on cursor positioning —
  and the four POUR principles still organize them.

## Rules

- **Recommend from the principle, then point at the source.** *"That's Operable — no visible focus
  state; the WAI quick-reference has the criterion"* is worth ten reminders to check contrast.
- **Say what you didn't check.** A clean accessibility note that doesn't name its blind spots is worse
  than no note, because it reads as clearance.
- **AA is the target.** AAA where it is free. Neither is a substitute for asking a real person.
- **Never claim compliance.** BOSS can improve accessibility; it cannot certify it, and the difference
  is legal as well as technical.
- **Cite the criterion you opened, not the one you remember.** This is a living standard with more
  than one version in play, and a confidently-recalled criterion number is the single easiest thing
  to get wrong here. Open the quick-reference; it takes a minute.
