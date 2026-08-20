---
id: PRACTICE-landing-page
type: practice
owner: mentor-customers
status: active
host: stack-neutral
provenance: distilled from the 2026-07-23 research sweep (landing-page thread) — Julian Shapiro (value-prop table), Demand Curve / CXL (above-the-fold, clarity-over-cleverness), Harry Dry / MarketingExamples ("write with the delete key", back a bold claim with proof), 37signals (clarity not cleverness), Amelie Pollak (persuasion vs manipulation), the Tailwind "indigo apology" (AI-default sameness). Pairs with design-system.md (look), ai-ux-patterns.md (honest conversion), /pretotype (the demand page) and /ship (deploy). BOSS v0.112.0. The share-card section was added 2026-08-20 from IDEA-060 — the practice had ZERO coverage of og:/meta/preview while BOSS's own site shipped the tags, the classic never-sorted-UP shape.
last_reviewed: 2026-07-23
review_by: 2027-01-19
curve: market
---

# Practice — The first landing page (get it out the block, on-brand, honest — don't become a CRO shop)

> **Where this sits.** [`design-system`](design-system.md) owns how it *looks* (tokens, the anti-slop 5%);
> [`ai-ux-patterns`](ai-ux-patterns.md) owns *honest* conversion (the dark patterns a landing page breeds).
> This owns the one job: a founder's *first* page, clear enough that a stranger gets it in five seconds and
> on-brand enough not to look like every other AI-built site. BOSS's edge here is structural — it already
> holds the brand (`BRAND.md`), the tokens, and the canvas Promises, and the founder is already *inside Claude
> Code*, so an on-brand page in-repo is the lowest-lock-in option in the whole 2026 landscape. The line we do
> **not** cross: becoming a landing-page/CRO expert (A/B infra, funnels, heatmaps — useless at n≈0 anyway).

## The minimum that converts (boring on purpose)

The evidence is stable and unglamorous: **clarity beats cleverness, one page = one job, back a bold claim with
proof, cut the rest.**

- **A descriptive headline = the value prop, not a slogan.** Shapiro's test: *if the visitor reads only this,
  do they know exactly what you sell?* Kill "Improve your workflow!"
- **A subhead that does two jobs:** how it works + which feature makes the headline believable.
- **One CTA, repeated** — phrased as a continuation of the headline's promise, not "Request a meeting." No
  competing actions.
- **Proof in the eye-path** (headline → subhead → hero visual → proof → CTA). Real testimonials / counts only.
- **A hero that shows the product working** (screenshot/GIF) — removes uncertainty.
- **No nav** (a landing page has one job; nav is an escape hatch), **fast, mobile-first**.
- **A share card** — `og:title`, `og:description`, `og:image`, `twitter:card`, `canonical`.
- **Clarity over cleverness** — the most-supported, least-glamorous finding (Shapiro's *Desire − (Labor +
  Confusion)*; CXL's simpler-copy A/B lifts; 37signals; Harry Dry's "write with the delete key"). Use Shapiro's
  value-prop table — *Bad Alternative → Better Solution → Action Statement* — to birth the headline from the
  canvas Promises cell.

## Two shapes — ask which one first

| | **Product page** | **Waitlist / demand page** |
|---|---|---|
| Job | Convert to a user/customer of a thing that works | Test whether anyone wants it *before you build* |
| CTA | Start / buy → real product | Join → email capture |
| Hero | Show it working | The promise (you may have no product) |
| Validates | Willingness to use/pay | **Curiosity, not intent** (a free signup commits to nothing) |

The demand page **is** `/pretotype`'s fake door — a `/landing` demand page is the tool that builds the door
`/pretotype` designs. Set the threshold before running (Savoia/YODA); a signup measures the *communication*,
not the problem. The trap to name: "a survey with a hero image."

## The page most people see first is the card, not the page

Every rule above assumes a visitor who *arrived*. Most don't — they meet the page as a **link preview**:
pasted into Slack, sent in iMessage, quoted in a group chat, unfurled in a DM. That preview is rendered
from four meta tags, and if they're absent the founder's carefully-built hero renders as **a bare grey
URL** — the one impression they never tested, on the path most of their early traffic actually takes.

This is not SEO and it is not growth-hacking. It is the same job as the headline, one layer earlier:

- **`og:title` is the value prop**, not the slogan and not the company name. Same test as the headline —
  if they read only this, do they know what you sell?
- **`og:description` is the subhead**, not the tagline. One sentence.
- **`og:image`** decides whether the card is looked at. Show the product working, same as the hero. Use
  `twitter:card: summary_large_image` **only if you actually have one** — `summary` is the honest default
  without an image, and a `summary_large_image` pointing at nothing renders worse than no card at all.
- **`canonical`** — one page, one URL. Two URLs serving the same page is the oldest self-inflicted bug
  in this whole area.

Four tags, an afternoon at the outside, and it is the cheapest distribution work available on the page.
The reason it's missing from most first landing pages is simply that **nobody sees it while building** —
it renders somewhere else, in someone else's client. Check it before you ship, not after someone shares it.

> ⚠️ **BOSS's own front door fails this**, which is how the gap was found: `web/_shell.html` ships
> `og:title`, `og:description`, `og:url` and `canonical` and **no `og:image`**, so every BOSS link
> unfurls text-only. Fixing it needs an asset and a registered domain — recorded, not hidden.

## Leverage the brand you already have (this is the anti-slop mechanism)

The failure mode is real and named by the tool ecosystem itself: **AI-default = indistinguishable from every
competitor** (the Tailwind `indigo-500` "apology"; purple gradient + Inter + three feature boxes = "made by
AI"). BOSS already holds every input to beat it — so *feed them into generation*, don't generate from a blank
"make me a landing page":
- **`BRAND.md`** (voice, positioning, story) → the **copy** brief. The headline is born from positioning, not
  from "write a hero."
- **Design tokens, referenced by *semantic name*** (`color.action.primary`, never `indigo-600`) → the visual
  brief (three-layer tokens survive AI generation).
- **The canvas Promises cell** → the value prop (ties to Shapiro's table above).
- Then the `design-system` five intentional choices (a committed palette, a real type pairing, a few motion
  moments) — with its guardrail: for a first-timer, **minimalism done precisely beats maximalism done loosely**,
  and a11y / five-states / performance are floors, not trade-offs. *Spend the hours the AI just saved on the 5%
  that's the brand* — the landing page is the highest-leverage place to spend it.

## Convert honestly (persuasion, not manipulation)

Landing pages are the densest breeding ground for the dark patterns in [`ai-ux-patterns`](ai-ux-patterns.md) —
fake countdowns, "127 viewing," confirmshaming ("No thanks, I like paying full price"), the pre-ticked box, the
card-required-at-a-free-trial. The line, quotable: **persuasion gives someone a reason and lets them decide;
manipulation exploits *how* they decide.** Two field tests:
- **The say-it-out-loud test** (confirmshaming): would you say that decline sentence to the person's face, in a
  shop? If it exposes a sneer, cut it.
- **The urgency-honesty rule:** a real deadline is a fact you can state; the manipulation is only in the
  *falsity*. Real deadlines and real inventory only.

And the argument for the founder who fears honesty costs signups: **the honest version *is* the high-converting
version** — clarity, one honest CTA, real proof (Harry Dry's "back a bold claim with a ridiculous amount of
proof") is literally the playbook above. Dark patterns lift short-term conversion and cost trust, retention,
and CAC. So run the generated page through **`/red-team --humane`** by default; surface-name-offer-alternative;
if the founder crosses anyway, **record it as a `DEC-NNN`** (conscience-not-censor), never block.

## Tooling — generate the simple case, hand off the rest

Because the founder is in Claude Code, **generate a real static/Next.js page in-repo** — zero lock-in, zero new
account, ships through `/ship`, under version control next to the product. That's the lowest-friction option in
the 2026 landscape *for this user*. But **hand off** — don't compete with — Framer / Carrd / Webflow when they
want a visual editor or a CMS they'll re-edit without an engineer. BOSS is not a website builder; it gets the
first honest, on-brand page **out the block**, then points onward.

## Altitude / JIT

Fires at two moments, never as ceremony: at **demand-page time** (inside `/pretotype`, to build the fake door)
and around **`/ship`** for a real product (`/ship`'s "who's the first real user?" voicing lands here perfectly).
Silent otherwise. The CRO machinery (A/B, funnels) is a `mentor-customers` pointer for *later*, once real traffic
exists — never a BOSS capability (Principle #2).
