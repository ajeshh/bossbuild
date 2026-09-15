---
id: IDEA-068
type: idea
owner: product-lead
status: shipped (v0.198.0)
gist: The Humane Product Canvas published as a free CC BY-SA artifact — the only thing BOSS has that works without installing BOSS. Shipped after the attribution question was answered.
proof: web/canvas.html
proof_note: The page plus web/humane-product-canvas.md (the CC BY-SA template, shipped as a root asset). The attribution question that gated this was answered directly by Ajesh on 2026-08-21.
created: 2026-08-21
source: Ajesh, 2026-08-21 — "since the humane canvas is there, that i built i'm wondering if we should
  add it to the website as an offer .. it may need tweaks but maybe we offer it as an option for folks
  to use on their own. and we can offer it as a free tool for folks."
relates: DEC-004, DEC-009, IDEA-034, EVID-001
---

# IDEA-068 — The canvas as a free standalone tool

> ✅ **UNBLOCKED 2026-08-21 — asked directly, answered directly.** Ajesh: *"Im the creator of the
> canvas."* **Sole authorship; the shipped credit was correct as written.** Erica's hackathon is the
> **venue and the network** the canvas was released at, not a co-authorship — two different
> relationships that my own lineage note had blurred, and the note is now corrected to say so.
> **Shipped v0.198.0** as `/canvas` on the site plus a CC BY-SA 4.0 Markdown template.
>
> **The flag was still right to raise.** The cost of asking was one question; the cost of being wrong
> would have been a public byline on someone else's work, which is a correction rather than an edit.

## 🔴 The blocker, and it is not a technical one *(RESOLVED — see above)*

**Settle the attribution before a single line is published.**

The canvas is credited in exactly two places — `canvas/SKILL.md` and the v0.191.0 changelog — and both
say **"Humane Product Canvas by Ajesh Shah."** Searching this whole repo for a co-creator returns
nothing.

**My standing note on its lineage says otherwise:** that the Humane Product Canvas came out of a
hackathon Ajesh built **with Erica** around June 2025, and that BOSS is the continuation of that work.
**I cannot resolve that from the repo, and I am not going to assume either way.** The two readings
lead to different pages:

- **The hackathon was the lineage** — the humane thinking, the project BOSS continues — and the canvas
  itself is Ajesh's. Then the current credit is right and nothing changes.
- **The canvas is genuinely co-created.** Then the current credit under-attributes, and **publishing it
  publicly under one name makes that permanent in a way an internal cell layout never was.**

**Why this is load-bearing now and wasn't before.** Today the credit sits inside a skill file that
ships to a few installs. Published as a free framework it becomes a public claim of authorship,
indexed, cited, and printed on other people's walls. **Walking that back later is not an edit; it is a
correction.** And BOSS's own `/governance` page holds exactly this line: *"attribution is checked
before the claim is graded… an attribution is a citation's load-bearing half."* It would be a poor
look to publish a framework under a contested byline on the same site that lectures about it.

**One question to Ajesh: is Erica a co-author of the canvas itself, or of the project it came out of?**
Everything below is ready to build the moment that is answered.

---

## The case for doing it — and it is genuinely strong

**It is the only thing BOSS has that works without installing BOSS.** Every other surface needs the
CLI plus Claude Code. A canvas is a page and a set of questions; someone can use it on a napkin. That
makes it the only asset that can give value *before* asking for anything.

**It is the shape frameworks actually spread in.** Lean Canvas and the Business Model Canvas both
became standards by being freely published, attributed and reusable — not by shipping inside a tool.
[[DEC-004]] already leans on both by name.

**And it has a real differentiator to lead with.** Two cells no conventional canvas has: **Risks &
Harms** and **Principles.** That is the entire pitch, and it is honest — the canvas asks two questions
Lean doesn't.

**It also answers the EVID-001 signal better than a feature would.** The one piece of external
evidence BOSS has says *the vision lands, the offering isn't ready.* A canvas someone can just use is a
far lower-commitment entry than "install this CLI," and publishing something that already exists is
not the kind of building EVID-001 told us to stop doing.

## What it would actually be

**A static page plus a downloadable template. Nothing else.**

- The three sections as they stand — Human Foundation · Product Expression · Stewardship
- Each cell with its humane prompt and its sharpen
- Risks & Harms and Principles, presented as the point rather than as extras
- The riskiest assumption + the one-week experiment, which is what makes it a working tool rather than
  a poster
- A **print/markdown download**, because that is how canvases get used

## The tweaks — what has to come off

The shipped skill is an interview flow with BOSS couplings all through it. Stripping them is the
actual work:

| Drop | Why |
|---|---|
| `EVID-NNN` ids, `/comp-eval`, `/interview`, `/persona` references | meaningless without BOSS installed |
| `boss unlock mvp` and the graduation gate | the canvas is not a gate for anyone outside BOSS |
| The live/dormant conditional-cell machinery | it exists to keep a JIT interview short; a static template just marks cells optional |
| The Lean / BMC frames | **that is BOSS's rendering feature, not the canvas.** Publishing the humane canvas is the offer; multi-frame rendering is the reason to install the tool |

**Keep the questions. Drop the machinery.** If the standalone version needs BOSS to make sense, it
isn't standalone.

## The line it must hold

**Build the view, refuse the app** ([[IDEA-034]]). A fill-in-the-boxes web app with saved state is a
product with accounts, sync and a support burden attached — the thing BOSS has refused three times.
**A page you read and a template you take away is the whole offer.** If people want it to remember
their answers, that is what BOSS is for, and saying so is honest rather than coy.

## The licensing question, which is nearly decided by precedent

Lean Canvas and the Business Model Canvas are both **CC BY-SA**. A humane canvas published under
anything more restrictive would be conspicuous.

**And there is a neat consistency available here:** v0.195.0 was the release where BOSS stopped
assuming every project is a business and made room for Creative Commons work. Publishing its own
canvas under CC would be BOSS doing the thing it just made room for, rather than recommending it.

## Positioning — checked against [[DEC-009]], and it does not conflict

DEC-009 said the positioning does not change. **That was about not advertising a body of
non-commercial support that isn't built.** Publishing an artifact BOSS already has is a different
act: it adds no support surface, claims no capability, and creates nothing to maintain beyond a static
page. Worth stating explicitly so the two don't get read as contradictory later.

## Recommendation

**Yes — and it is cheap, differentiated and on-strategy. Gated on the attribution question, which is
the only thing here that gets harder to fix with time.** Static page plus template, CC BY-SA, no
interactive state, frames left out.

## Gate — cleared, and the licence with it

~~⛔ Do not publish until attribution is settled.~~ **Cleared 2026-08-21.** Sole authorship confirmed
by Ajesh; published under his name, CC BY-SA 4.0.

✅ **And the licence is settled too — [[DEC-010]], decided before the door closed.** Ajesh: *"sa 4.0
is great."* **CC BY-SA 4.0**, confirmed while the site is still undeployed and the grant still
theoretical, rather than discovered afterwards. The reasoning that made it more than precedent-
following: **as sole copyright holder he can always offer the work under a *more* permissive licence
later, but nothing can claw back distributed copies — so BY-SA preserves optionality and BY spends
it.** Same axis as `/boss`'s proprietary default, one notch along.

**Nothing about this idea is open any more.**
