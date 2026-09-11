---
id: COMP-frontend-design
type: competition
owner: product-lead
status: living
sort: watch
checked: 2026-09-11
source: ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design (the marketplace's own cache, pulled 2026-09-11 09:27) · homepage declared in marketplace.json — github.com/anthropics/claude-plugins-public/tree/main/plugins/frontend-design
prior: RVW-014 (2026-06-20, ADAPT — vetted an EARLIER version of the same skill)
updated: 2026-09-11
---

# frontend-design — Anthropic's own skill for the same problem, at a different altitude

> **Read from the primary.** Everything below comes from the 71-line `SKILL.md` (9,390 bytes), the
> `README.md`, `plugin.json` and the marketplace entry, as cached by the official marketplace on
> 2026-09-11. Not from a summary, a blog, or memory. Where this file says *"the skill says"*, it is
> quoting.

## What it is

A **single skill file** — one `SKILL.md`, no runtime, no templates, no hooks, no state — shipped by
Anthropic in the official plugin marketplace. Authors: Prithvi Rajasekaran and Alexander Bricken.
**Apache-2.0.** Category `development`. Marketplace blurb: *"Create distinctive, production-grade
frontend interfaces with high design quality. Generates creative, polished code that avoids generic
AI aesthetics."* The README says *"Claude automatically uses this skill for frontend work."*

**Its whole mechanism is a prompt read at generation time.** It tells Claude to act as *"the design
lead at a design studio known for giving every client a distinct visual identity"*, to ground design
in the subject matter, to work in two passes (plan a compact token system → review it against the
brief for genericness → build), and to self-critique. Then it stops. Nothing is written to disk.
Nothing carries to the next session.

**It fills the row this file's README named and had not researched** — *"community `CLAUDE.md` /
agent-skill packs: guidance files for the same host, without a runtime or a conscience"* — except it
is from the host's own maker, which makes it the strongest possible member of that row.

## Pricing

Free. It is a file in a public repository, installed with `/plugin`. There is nothing to compare.

## Why they might win

Honest, and in order of how much it should worry BOSS:

1. **It is current, and BOSS's catalog is not.** The skill names the five clusters generated design
   converges on *right now*, with hex values: *warm cream (~`#F4F1EA`) + high-contrast serif +
   terracotta (~`#D97757` — "Anthropic's own Claude-interaction accent, so on a user's brief it reads
   as a tell")* · *near-black + one acid green or vermilion* · *the broadsheet: hairline rules, zero
   radius, dense columns* · *the SaaS-card kit: identical rounded cards, one radius everywhere, the
   same `rgba(0,0,0,.1)` shadow, gradient washes* · *template chrome: tracked-out ALL-CAPS eyebrows,
   `A · B · C` middle dots, `WORD — fragment` spaced em dashes, tinted near-black (`#0B0B0B`, `#111`)
   for black, mono for small labels, `→` on every link.*
   **BOSS's anti-slop list is Inter, Tailwind blue-500, purple gradients and "the shadcn trap" — a
   2024 list.** Grepped 2026-09-11: zero occurrences of cream, terracotta, broadsheet, eyebrow or
   middle-dot anywhere in the design practice or `/design-tokens-init`. The tells moved and BOSS's
   catalog didn't. **This is the single most valuable thing in the file.**
2. **Zero ceremony.** Auto-triggers on frontend work. No init, no files, no decisions to record. A
   founder who has never heard of a design system gets a better first screen for free.
3. **The genericness self-test is genuinely clever.** *"Work through a similar prompt to see if you
   arrive somewhere similar"* — before building, ask whether this plan is what you'd produce for any
   similar brief, and revise the part that is. BOSS has no equivalent. It is a filter, but it is a
   filter aimed at exactly the failure BOSS names.
4. **Typographic specifics BOSS deliberately withholds.** *Line lengths under 80 characters; serifs
   slightly longer with more line-height; one family or two, clearly distinct; a scale "following
   The Elements of Typographic Style."* BOSS's composition slots ship empty on purpose (*name the
   slot, earn the value*). The skill hands over craft floors on turn one. **Both are defensible, and
   the skill's version produces a better screen faster.**
5. **The writing section is as good as BOSS's and shorter.** *"A CTA says exactly what happens: 'Save
   changes,' not 'Submit.' The button that says 'Publish' produces a toast that says 'Published.'
   Errors don't apologize. An empty screen is an invitation to act."* Parity with BOSS's voice and
   terminology rules — in a third of the words.
6. **"Spend your boldness in one place."** BOSS calls this *the signature token*. The skill's phrase
   is better, and it comes with Chanel: *"before leaving the house, remove one accessory."*

## Where they're weak

Also honest, and the pattern in every row is the same word: **stateless.**

1. **It makes screen one distinctive and has no way to keep screen fifteen the same kind of
   distinctive.** The two-pass process builds *"a compact token system with color, type, layout, and
   principles"* — **per brief, in the conversation, then discarded.** The next session starts over.
   That is precisely the failure BOSS is built around: not a bad first screen, but *the 47 blues* —
   drift across screens, each one reasonable, no source of truth surviving. The skill cannot see it
   because it has no memory to see it with.
2. **Its own text names the gap.** *"Human creatives have memory and always try to do something new,
   so if you have a space to quickly jot down notes about what you've tried, it can help you in future
   passes."* **That "space" is BOSS.** Tokens, the style guide, the brand doc, the pattern set, the
   decisions and the exceptions table are the notes it wishes it could keep. The skill asks for
   persistence in a subordinate clause and ships none.
3. **No reuse.** No component index, no *reuse first*, no reuse/adjust/new. The opposite pressure,
   actually — *"take each project as a chance to experiment and learn"* — which is exactly right for
   a page and exactly wrong for a product on its fortieth component.
4. **100% filter, 0% boundary.** Every rule in it holds only while the model is reading it. Nothing
   fires on a raw hex, a duplicate component, a failing contrast pair, or a rule with three exceptions.
5. **Web only, and says so.** *"For web designs, the hero is the first thing viewers will see."* No
   shape gate; a CLI or a chatbot gets studio-designer advice about heroes.
6. **Brand is asked for, not kept.** *"If the brief does not identify the subject matter, identify it
   yourself and confirm with the client."* Right instinct — and it re-asks every time, because there
   is nowhere for the answer to live.
7. **Nothing above the screen.** No patterns, no flows, no demotion, no learning loop. It is a
   single-surface skill and does not claim otherwise.

## Where it breaks

- **On the fifteenth screen**, for the reason above.
- **When the founder's brand is nascent.** The skill's job is *distinctiveness*; a founder who does
  not yet know what they are will get a confident, distinctive, wrong identity — a complete-looking
  answer arrived at with no information. BOSS's `BRAND.md` starts `nascent` and says so on purpose.
- **When the tells move again.** It is current *today* because its authors updated it — the June
  version RVW-014 vetted preached *"bold maximalism"*; the September version preaches restraint and
  names the cream-and-terracotta cluster the June version would have produced. **The skill drifts
  toward the tells it doesn't yet name, and only its authors can move it.** BOSS's catalog has the
  same problem with a worse update cadence — which is the learning, not a consolation.

## How they do it — design reference, not parity

Per this set's own rule (v0.295.0): *how-they-do-it* is a reference for what to learn, never a list
of features to match.

### The calibration list · **learn from it, now**

Five named clusters of *current* AI-design output, with hex values and the specific chrome. The
insight underneath is portable: **the tells are not a fixed list, they are the current attractor**,
and any anti-slop catalog needs a date and an owner or it becomes a list of last year's tells. BOSS's
distinctiveness pass warns against a look no longer produced by default and says nothing about the
one that is.

### The generic-default test · **learn from it**

*"Review the plan against the brief before building: if any part reads like the generic default you
would produce for any similar page — work through a similar prompt to see if you arrive somewhere
similar — revise that part, say what you changed and why."* One sentence, and it belongs in
`/design-review` and the distinctiveness pass. It does the thing a review usually can't: it makes
*sameness* checkable by the model that produced it.

### Craft floors vs brand values · **a distinction BOSS should make**

The skill hands over *line length < 80*, *one or two families*, *serif line-height*, *reduced motion
respected*, *visible focus*. BOSS's composition slots ship empty under *name the slot, earn the
value* — and that rule is right for **values** (a type scale, an accent, a radius) and wrong for
**floors** (measure, family count, focus, motion). A slot can carry its floor and leave its value
blank. Today it carries neither.

### The two-pass process · **already have it, differently**

Plan a token system → review for genericness → build. BOSS's `/design-tokens-init` → `/design-review`
→ build is the same shape with the middle step missing (see above) and the first step *persisted*.

## What I did not find

- **Any evidence of use.** No download counts, no issues, no discussion visible from the cache.
  Whether founders install it, and whether it changes what they ship, is unverified.
- **A changelog.** The June → September shift is visible only because BOSS vetted the earlier
  version; the plugin carries no version history of its own.
- **Any accessibility beyond one sentence** — *"visible keyboard focus, reduced motion respected,
  visually accessible."* Which may be more effective than a practice nobody reads, and is honest about
  its size.

## The read

**Not a rival. A layer BOSS doesn't have, that doesn't have BOSS's layers.** It operates at
*generation time* and is stateless; BOSS operates at *project time* and is all state. A founder using
BOSS should probably install it too — there is no conflict, and the first screen gets better.

The competitive fact is narrower and sharper: **Anthropic maintains a current list of what generated
design looks like today, and BOSS's equivalent is from 2024.** That is the row to act on.

## Change log

- **2026-09-11** — filed. Read from the marketplace cache pulled the same morning. Supersedes the
  factual half of RVW-014, whose source was an earlier version of the skill that has since moved
  toward the restraint BOSS's ADAPT added.
