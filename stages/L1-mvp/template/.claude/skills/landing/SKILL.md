---
name: landing
description: Generate the founder's FIRST landing page — on-brand, honest, out the block to scale. Composes what BOSS already holds (BRAND.md voice/positioning, the design tokens, the canvas Promises cell) into a real page in-repo, runs the humane check so it converts without dark patterns, and hands off to /ship. Looks for a page you already have before making one; asks one thing first — does the product exist (product page) or not yet (waitlist/demand page = the /pretotype fake door)? Generates the simple on-brand case; hands off to Framer/Carrd/Webflow when they want a visual editor or CMS. Not a CRO tool — it gets a first honest page out the block, then points onward. Usage - /landing [--demand | --product]
---

# /landing — get the first page out the block, on-brand and honest

You are already in Claude Code, holding the founder's brand and product context — which makes an on-brand page
*in the repo* the lowest-lock-in option in the whole landscape. This skill composes surfaces BOSS already owns;
it does **not** turn BOSS into a website builder or a CRO shop. Full judgment: `boss craft landing-page`.

## Step 0a — does a page already exist? (look before you make one)

**This is the first thing you do, and on an adopted repo it is the most valuable.** Most founders who
point BOSS at a repo already have a page. Generating a second one says *what you built doesn't count*.

Check `app/page.tsx`, `src/app/page.tsx`, `pages/index.tsx`, `app/routes/_index.tsx`,
`src/routes/+page.svelte`, `index.html`, `public/index.html`, `site/`, `landing/`. **Then ask** — a
landing page very often lives *outside* the repo: Framer, Carrd, Webflow, a Notion page, a GitHub
Pages branch. A page you cannot see is still a page they have.

Four honest answers, and only one of them is "generate":

- **Nothing there** → continue to Step 0b. The normal path.
- **It exists and it does the job** → *"You've got a page at `app/page.tsx`. I read it — it works.
  Nothing to do here."* **A complete outcome, not a failure to act.** Stop.
- **It exists and it's behind** → name the *specific* gap and offer the *specific* edit. Not *"want me
  to regenerate it?"* — that's the same disrespect wearing a question mark. *"Your page has no
  `og:image`, so it renders as a bare grey URL when anyone pastes it into Slack. Four tags. Want them?"*
  Then apply the section below that's actually missing — the share card, the one-CTA rule, the proof
  in the eye-path — not the whole skill.
- **It's somewhere you can't read** → ask them to paste it, work from that, and hand back copy/markup
  they can move into Framer or Carrd themselves. Don't pull them into the repo to fix a page that lives
  elsewhere.

**Rung: MVP for the product page, Quickstart for the demand page** (that's `/pretotype`'s fake door —
Step 1 decides which). **If they're earlier than both, the seam is one line: if anything of yours is
public — a page, a repo, a post — leave one way for a stranger to reach you.** An email field, a link,
anything. Not a waitlist product, not a CRM, not an email tool. You can rewrite a page any day; you
cannot go back and ask the people who already showed up and left, and at this rung those are the only
people who found you without being told to.

## Step 0b — read the brief (refuse to generate from blank)

The whole anti-slop mechanism is that the page is born from the brand, not from "make me a landing page." Read,
and if missing, say so and offer to fill the gap first:
- **`docs/design/BRAND.md`** (or the project's brand doc) → voice, positioning, story = the **copy** brief.
- **The design tokens** (`DESIGN_TOKENS.md` / the token layer) → visuals, referenced **by semantic name**
  (`color.action.primary`, never `indigo-600` — that's the AI-slop default).
- **The canvas Promises cell** → the value proposition (feed it through Shapiro's *Bad Alternative → Better
  Solution → Action Statement*).
- **`docs/design/library/`** if it exists (V1) → the components to compose from, instead of redrawing them.

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
- **Write the share card.** `og:title`, `og:description`, `og:image`, `twitter:card`, and a `canonical`.
  Most people meet this page as a *preview* — pasted into Slack, iMessage, a group chat — so the card is
  the real above-the-fold and a missing one renders as a bare grey URL. It costs four tags and it is the
  cheapest distribution work on this page. Same discipline as the headline: `og:description` is the value
  prop, not the slogan. Use `summary_large_image` only if you actually have an image; `summary` is the
  honest default without one.

**If `docs/design/library/` exists, compose from it — don't redraw it.** At V1 the library holds real,
on-brand, five-state components. A landing page that reinvents the button ships a second definition of
your product's most-clicked element, on the one page a stranger judges you by.

**Generate three variants, then pick — don't generate one and refine it.** `design-system`'s iteration
rules apply here more than anywhere: *compare in parallel, don't refine in series*, because serial
"make it better" re-averages toward the mean on every pass, and the mean is exactly the AI-default
sameness this skill exists to escape. Vary **one** dimension across the three — the headline's angle, or
the visual register — never all of them, or you learn nothing about which one worked. Then stop: the stop
rule is when the next change isn't visible to someone who isn't you.

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
- **Point at `/ship` for deploy and `mentor-customers` for positioning/CRO depth** — don't reinvent them here.
