---
id: IDEA-117
type: idea
kind: capability
owner: Ajesh
status: shipped (pass one, 2026-09-14, under Unreleased — items 1–10; pass two open)
gist: The front door (oyeboss.build) is 4,231 words in one visual grammar, with the mark at 40px and the generated pages behind a text link. Make it seen rather than read — four pictures, two clicks — and make it findable where its audience actually looks (the Claude Code ecosystem, AI answers, distribution), with the click counted so the change can be graded.
created: 2026-09-14
program: distribution
relates: IDEA-047, IDEA-057, IDEA-106, IDEA-115, IDEA-116, DEC-020, DEC-021
---

# IDEA-117 — The front door: seen, not read

## Current shape

Ajesh (2026-09-14), in order: *"i wanna make my website more seo friendly, so it gets a high rank"* →
*"making it highly discoverable for agentic coding, vibe coding, vibe coding for entrepreneurs"* →
*"put on your marketing hat on how we make boss site more attractive. Also should we have a bigger
logo somewhere on the front page?"* → *"open to ideas for more visualizations or ways to present or
reduce amount of reading text needed"* → *"i dont think we need 'vibe coding' open to other smart
ideas, also how to win at seo… what would be helpful in today's market"* → *"idea and then execute."*

**Measured before opining (2026-09-14, live site):**

- **4,231 words on the homepage** — a ~17-minute read. One column, one grammar (rail label + prose)
  for every section, so a scroller cannot see where the argument turns. The only picture above the
  fold is a terminal printing `boss new`.
- **The mark is 18px in the nav and ~40px in the hero rail** — the largest it appears anywhere on
  the site, the day after DEC-021 made it. The only large render is `og.png`.
- **The generated pages (playbook / design space / board) are a text link** — *"One venture, every
  page, generated"* — under the install commands. The strongest proof BOSS has is not shown.
- **The best line is below the fold**: *"Building got cheap. Being wrong didn't."* is the h2 of
  section two; the h1 is PRINCIPLES.md's sentence (a decision — quote it, don't rewrite it).
- **Lighthouse desktop 88 / 100 / 100 / 92, Agentic Browsing 2/2; mobile LCP 3.5s.** Own JS is ~20
  lines; the unused/legacy-JS and long-task audits are `gtag.js` and Cloudflare's injected challenge
  script. Render-blocking = the two stylesheets (45 KB, `max-age=3600`). The SEO dent is the nav
  label **Start** (on Lighthouse's non-descriptive-link list). Fully responsive (real breakpoints at
  46/44/40/30rem, system fonts, CLS 0).
- **Keyword presence on the homepage**: *Claude Code* 2, *founder* 3, *scaffold* 2; *agentic*,
  *entrepreneur*, *AI-native*, *incubator* 0. No `llms.txt` (404), no JSON-LD.
- **Title tag** — *"BOSS — the team you hire, just in time"* — a good line nobody types.

**Shipped the same day, before this record** (three commits on `main`): GA4 on the shell
(`G-FDV098KCD2`); a `copy_install` event on every Copy button (`method` npm|brew, `placement`
page|footer — GA attaches the page, which is the flow); consent denied by default with no banner, so
GA sets no cookies and EU/UK visitors get the same page as everyone. That last is IDEA-047's *"count
the click"* landed — the front door now measures itself, so every change below can be graded by
copies-per-visit rather than by taste.

## The read

**Marketing.** The honesty is the differentiation; the risk is that it reads as a document, not a
product. Above the fold is 100% text; the lede does three jobs (pitch, differentiator, trust line);
the twelve *snags* are twelve posts, one snag → one skill, and each is a search query verbatim.
No social proof and none to fake: n=2, the footer says so, keep saying so.

**SEO, 2026.** AI Overviews / AI Mode take most informational clicks; ranking for a generic phrase is
worth a fraction of what it was. A new domain at 0 stars will not rank for *vibe coding* and should
not try (Ajesh: *"i dont think we need 'vibe coding'"*). What wins: **(1) a category term people
already type** — *Claude Code skills / plugins / project setup / for startups* — rising volume, thin
competition, exactly the audience; the title-tag word, the README's first line, the plugin listing.
**(2) Being what AI assistants cite** — one clear "what it is" sentence, the same on site / GitHub /
npm; JSON-LD; `llms.txt`; the README is crawled harder and cited more than the site. **(3)
Distribution is the ranking signal** — the Claude plugin directory (built, waiting on Ajesh — RESUME),
`awesome-claude-code` lists, a Show HN, r/ClaudeAI + r/ClaudeCode (Reddit threads rank directly),
one 60-second recording (the second-largest search engine; the thing every post pastes). Brand search
(*oyeboss*) is the endgame and only the channels produce it.

**Reading.** Not fewer ideas; four of them get a picture and the rest become opt-in. The homepage's
job is two clicks — Copy and Demo. Target ~1,200 words visible; the deep paragraphs stay honest under
`<details>` or move to `guide.html`. Nothing deleted; it stops being mandatory.

## Plan — one commit each, graded by `copy_install` per visit

**Pass one (this record's build):**

1. **The mark at ~100px in the hero rail**, stacked above the wordmark, large cut (DEC-021: >24px).
   Mocked and shown 2026-09-14; sits in its own column, level with the h1, does not fight it.
2. **"Building got cheap. Being wrong didn't." → one two-line diagram** — cost of building falling,
   cost of being wrong flat, the widening gap is where BOSS lives. Inline SVG, tokens only, both
   schemes, labelled *illustrative*, **no axis numbers** (a number typed by hand is the thing the
   site forbids).
3. **The hero terminal → the three generated pages.** A scaled, lazy-loaded frame of the real
   `demo/` pages, not a screenshot — it cannot drift from what `boss` prints (FEAT-039's own rule:
   *"a demo prettier than what `boss` prints is a lie"*). The lede shrinks to its first sentence.
4. **Title / description / README first line aligned on the category term** (*Claude Code*), no
   *vibe coding*. Nav label **Start → Get started** (Lighthouse SEO 92 → 100).
5. **`llms.txt` + JSON-LD `SoftwareApplication`, generated from the same page list as `sitemap.xml`**
   (cannot advertise a page that isn't there); **stylesheets inlined at gen time** (kills
   render-blocking, cache-lifetime and minify audits at once; mobile LCP under 2.5s).

6. **Wayfinding on the deep pages** (Ajesh, mid-build: *"Under how It thinks or anywhere, there is
   no way to get back to the top, also the secondary menu hides under scroll, no way to hop around
   between them!"*). The primary nav sticks (one row); the three-row subnav does not (180px of
   sticky is the wall it replaces) — it is repeated at the end of the content with a *back to top*
   link, so a reader who finished a page can hop without scrolling up.
7. **Terminal blocks were double-spaced** (Ajesh: *"the spacing in blocks could not have additional
   blank space"*) — a block per line inside `white-space: pre` also printed the newline. Fixed in 2/5.

8. **`guide.html` needs a design lift and an organisation** (Ajesh, mid-build: *"Seems like it could
   use a design lift, and a way to organize the content as well. open to other ideas"*). Read it
   before proposing; the same two moves apply — a picture where a section is a mechanism, and
   opt-in depth — plus a table of contents that stays reachable (item 6).

9. **`credits.html` — the *citation debt* section is internal bookkeeping on a public page** (Ajesh:
   *"seems unnecessary to have here"*); it belongs in `check:site`'s output, which already prints
   it. In its place, an open door: *"Maybe someone can hit me up if they have a cool new idea or
   approach? Happy to collab. HMU on LI"* — his words, a LinkedIn link, on voice.

10. **`design.html`, `product.html`, `project.html` describe the product as it was; the playbook is
    not on the site at all** (Ajesh, mid-build: *"The design and product and project spaces seem
    outdated, especially design. We did a lot of changes to further improve the depth of it.
    Especially the design guidelines, and more depth to the design system. We also add a whole
    playbook dashboard, which is so critical, for creating presentations and or content and to
    have an internal page for the team to align on, never got covered."*). A content pass, not a
    layout one: read FEAT-030…033 (the design lane — seventeen sections, `boss design`) and
    FEAT-026…029 / 035 / 036 (the playbook — sixteen chapters, Present → a deck or a VC cut, export
    PDF, the copy sheet) against what the three pages say, and give the playbook its own page under
    *what you get*. The `reviewed:` dates on those fragments said current; the content was not — a
    `reviewed:` stamp asserts someone read it, and cannot see what shipped since (the
    [[checkers-state-intents-they-dont-enforce]] shape). `check:site`'s `describes:` line is the
    hook: a fragment that `covers:` a FEAT could be flagged when that FEAT's record moved after the
    page's `reviewed:` date. **Correction, same hour:** it already does — `check:site` prints
    *"may be behind: product — stages… changed 2026-09-13, reviewed 2026-09-12"* and twelve more,
    counted as *13 trailing*. The checker was right and ran; nobody read it (the n=19 shape). The
    gap is that `design.html` `covers:` nothing the design lane touched, so it is not even trailing.

11. **The *How it thinks* pages, the same treatment as the playbook page; and `about.html`** (Ajesh,
    mid-build: *"like we are doing for playbook, maybe review how it thinks to see if we can make
    similar visual adjustments and improve readability. Also then for my about page, it looks a bit
    too much and not well distributed or designed."*). Read `team.html` first (it is the section's
    door), then `about.html`; measure words and grammar before touching either.

**Pass two (after a read of pass one):** the two-week timeline for *four things*; the records → pages
flow for *what it adds up to*; the ladder with derived counts; the twelve snags as a scannable
you-say / BOSS-runs list with `<details>`; the conscience loop as four nodes.

**Not in this record:** the Show HN, the recording, the Reddit posts, the plugin submission — all
Ajesh's, all in RESUME's *Waiting on Ajesh*. This record makes the door ready for that traffic.

## Landed (2026-09-14, twelve commits on `main`, all under `## Unreleased`)

1–5 as planned · 6 the strip + end-of-page subnav + h2 ids · 7 the terminal spacing · 8 the guide by
the ladder (`RUNG_*` cards from the manifests; `{{TOC}}`) · 9 the credits door · 10 `playbook.html`,
the design space on `design.html`, pointers on keeping-track and product. `npm run check:site`:
0 broken, trailing 13 → 10. Pass two is untouched.

## Falsifier

By **2026-10-14**: `copy_install` per `page_view` on `/` does not move after pass one, or a real
reader still describes the site as *"a lot of reading"* — then the pictures were decoration and the
words were the point; revert to prose and keep the mark.

## Open

- Does the "cheap vs wrong" diagram belong on the OG card too? (It is the thesis; the card is the h1.)
- The snags as pages — twelve long-tail URLs — only if a snag query ever shows in Search Console.
- Cloudflare's challenge script costs ~5 perf points and is a dashboard toggle, not a repo change.
