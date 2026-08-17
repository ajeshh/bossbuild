---
name: landing
description: Generate the founder's FIRST landing page — on-brand, honest, out the block to scale. Composes what BOSS already holds (BRAND.md voice/positioning, the design tokens, the canvas Promises cell) into a real page in-repo, runs the humane check so it converts without dark patterns, and hands off to /ship. Asks one thing first — does the product exist (product page) or not yet (waitlist/demand page = the /pretotype fake door)? Generates the simple on-brand case; hands off to Framer/Carrd/Webflow when they want a visual editor or CMS. Not a CRO tool — it gets a first honest page out the block, then points onward. Usage - /landing [--demand | --product]
---

# /landing — get the first page out the block, on-brand and honest

You are already in Claude Code, holding the founder's brand and product context — which makes an on-brand page
*in the repo* the lowest-lock-in option in the whole landscape. This skill composes surfaces BOSS already owns;
it does **not** turn BOSS into a website builder or a CRO shop. Full judgment: `boss craft landing-page`.

## Step 0 — read the brief (refuse to generate from blank)

The whole anti-slop mechanism is that the page is born from the brand, not from "make me a landing page." Read,
and if missing, say so and offer to fill the gap first:
- **`docs/design/BRAND.md`** (or the project's brand doc) → voice, positioning, story = the **copy** brief.
- **The design tokens** (`DESIGN_TOKENS.md` / the token layer) → visuals, referenced **by semantic name**
  (`color.action.primary`, never `indigo-600` — that's the AI-slop default).
- **The canvas Promises cell** → the value proposition (feed it through Shapiro's *Bad Alternative → Better
  Solution → Action Statement*).

If there's no brand/tokens/canvas yet, the honest move is to generate a *plainer* page and name what's missing —
never invent a brand the founder didn't choose.

## Step 1 — product page or demand page?

Ask once (or read the flag). This decides the whole shape:
- **Product page** (`--product`): the thing works → CTA to the real product, hero **shows it working**
  (screenshot/GIF).
- **Demand / waitlist page** (`--demand`): not built yet → CTA to email capture, hero = the promise. **This is
  `/pretotype`'s fake door** — this skill builds the door `/pretotype` designs. Set the threshold *before* it
  ships (Savoia); remember a signup measures curiosity, not intent. A confirmation page that restates + asks one
  qualifying question beats a dead "thanks."

## Step 2 — generate a real page in-repo

Static HTML or a Next.js page + the project's CSS/Tailwind, tokens **by name**. Apply the minimum-that-converts:
- Descriptive **headline = the value prop** (not a slogan; Shapiro's "would they know exactly what you sell?").
- A subhead that does two jobs (how it works + why the claim is believable).
- **One CTA, repeated**, phrased as the headline's promise continued. No nav. Fast, mobile-first.
- **Proof in the eye-path** — real testimonials/counts only.
- The `design-system` anti-slop pass: one committed palette, a real type pairing, a couple of intentional
  motion moments — *spend the saved hours on the 5% that's the brand*. Floors are non-negotiable: a11y, the five
  states, performance.

## Step 3 — run the humane check by default

Run **`/red-team --humane`** on the copy + UI (it also now scans generated markup for injected dark patterns).
No fake countdowns, no "127 viewing," no confirmshaming, no pre-ticked boxes, symmetric choices, real proof
only. The line: *persuasion gives a reason and lets them decide; manipulation exploits how they decide.* The
say-it-out-loud test on any decline copy. Surface → name the cost → offer the honest alternative. If the founder
crosses anyway, **record it as a `DEC-NNN`** — conscience-not-censor, never a block. (The honest version is also
the high-converting version — clarity + one honest CTA + real proof *is* the playbook.)

## Step 4 — hand off to /ship (and know when to hand off entirely)

- Deploy via **`/ship`** — its "who's the first real user, and how do they hit this?" voicing lands here.
- **Hand off, don't compete:** if the founder wants a visual editor, a CMS, or a marketing site they'll keep
  re-editing without an engineer, point at **Framer / Carrd / Webflow**. BOSS gets the first honest, on-brand
  page out the block, then points onward.

## Cohort-aware

- `first-product` / `vibe-coder-newbie`: generate the whole thing, explain the five parts in plain language,
  default to precise minimalism (don't hand them a maximalist page to maintain).
- `non-tech-founder`: lead with the copy/positioning from `BRAND.md`; offer the Carrd/Framer handoff early.
- `eng-builder` / `returning-founder`: terse; hand back clean Next.js + tokens, skip the explanation.
- `indie-hacker`: calm, no growth-bro urgency; the honest-conversion argument resonates here most.

## Rules

- **The brief is mandatory.** Never generate a brand the founder didn't choose (that's the slop default).
- **Humane by default, never a gate.** Name the cost, offer the alternative, record a crossing — don't block.
- **Generate the simple case; hand off the CMS/visual-editor case.** BOSS is not a website builder or a CRO tool.
- **Point at `/ship` for deploy and `mentor-gtm` for positioning/CRO depth** — don't reinvent them here.
