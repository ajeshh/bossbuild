---
id: IDEA-143
type: idea
kind: capability
owner: Ajesh
status: active (Ajesh lifted the freeze for this pass 2026-10-05: "lets make them"; home reorder shipped `5ff59d8`)
proof: none
proof_note: a backlog for the next website pass, not a build. Nothing on the site changes while it is frozen (CLAUDE.md, 2026-09-23); its proof is the pass itself, recorded when it runs.
gist: The website backlog. When the site freeze lifts, assess the overall overview first, as one read of the whole site, before adding anything. Items wait here as maybes until that pass, starting with how the ecosystem shows up without a page about it.
created: 2026-10-05
relates: IDEA-137, IDEA-138, IDEA-060, IDEA-110
---

# The website pass after the freeze — assess the overview first

## Current shape
_The best articulation so far. Rewrite this as the idea sharpens._

- **What:** the website backlog. Site work is frozen except for correctness until `copy_install` shows
  traffic (first read 2026-10-14). When it lifts, the first move is **an assessment of the overall
  overview**: read the whole site as a stranger would and ask whether it still says what BOSS is,
  before any item below is added. Items here are **maybes**. The pass picks, cuts or keeps them.
- **Why the overview first** (Ajesh, 2026-10-05): *"when we are updating the website, we should assess
  overall overview."* Adding pieces one at a time is how a site drifts away from one story.
- **Rules every item carries:** a line on the site is no stronger than what backs it (IDEA-138, the
  claims ecosystem, applied to BOSS's own front door); no *"only BOSS"* claim before a `/comp-eval`;
  PRINCIPLES' one sentence moves only by Ajesh's `/decide`.

## How the site is run (2026-10-05)

There is no weekly cadence; the site moves with releases. Three loops, each with a trigger:

- **Every deploy** (Ajesh's: stamp → publish → `npm run deploy`): clear what `npm run check:site`
  lists as *trailing* (18 pages on 2026-10-05) — re-read the page against what moved, then bump its
  `reviewed:`. Broken claims already block the release; trailing pages never did, so they pile up.
- **The overview pass** — whole site read as a stranger, reorganise or *subtract* — runs when the
  freeze lifts, then **quarterly**, or sooner when real evidence says a reader couldn't place BOSS
  (EVID-002, EVID-005). Adding a page is the last answer, not the first (EVID-002's falsifier).
- **Intake:** a shipped capability a founder would *feel* gets a one-line maybe below, the same day.
  Internal plumbing doesn't (the CHANGELOG rule). Evidence about the site is cited by id here, never
  quoted — the words stay in `docs/evidence/`.

## Backlog — maybes, for the overview pass to sort

- [x] **M0 · Start where the founder already is** (2026-10-05, EVID-005, EVID-002). A non-technical
  founder, already building with AI tools and unhappy with what they'd built, read the site and could
  not say how or when BOSS would help; it read as too long. The overview pass's first test: **can that
  reader, on the first screen, see their situation and what BOSS does about it?** Not a new page.
  - **Two doors, not one** (Ajesh, same day: *"its not just for folks who built something with ai,
    but its also for folks starting a new app idea. How do they supercharge it like a Boss?"*).
    *Starting from an idea* → `/boss <idea>`; *already building, and it's drifting* → `boss adopt`.
    Both exist; on 2026-10-05 the home page reaches them only after the definition line and the
    install commands, and the second door is a one-line aside.
  - **Order the first screen by the reader, not the product:** which door is yours → what BOSS does
    on day one for that door (one concrete before/after each) → *then* install. Requirements (Node,
    Claude Code) after the reader has a reason to care.
  - Ajesh's *"supercharge it like a Boss"* is a candidate line for the voice pass, not copy yet; the
    one sentence in PRINCIPLES stays the definition and moves only by `/decide`. The marketing read
    (2026-10-05) argues against it: *supercharge* sells speed, which these founders already have
    too much of; the page already owns *"You're the boss. BOSS just has your back."* (`index.html:605`).

## Review 2026-10-05 — marketing + design/mobile reads (live site at 0.329.0)

Screenshots and measurements were session-local (scratchpad, not kept). Home: **18.2 phone screens,
12.5 desktop, ~2,700 rendered words** (start ~800, demo ~300). *What it does for you* first appears at
screen 3 on a phone; *is this for me* (the shape picker) at screen 5.8.

**Correctness — allowed under the freeze:**
- [x] **C1 · Home scrolls sideways on phones.** `.quirks` `minmax(24rem,1fr)` (`web/styles/site.css:691`)
  is wider than a 390px column; layout viewport measured 413. Fix: `minmax(min(24rem,100%),1fr)`. **Fixed 2026-10-05** — 390 measured 390.
- [x] **C2 · `start.html:78` "asks three things nobody else does"** is an *only BOSS* claim with no
  `/comp-eval` behind it, and our own competition notes contradict it. **Fixed 2026-10-05** — *asks three things*.
- [x] **C3 · Terminals clip or scroll sideways** (3 of 4 on home at 390; a line cut mid-sentence on
  start at desktop). `.terminal pre { white-space: pre-wrap }` under 46rem (`site.css:114`). **Fixed 2026-10-05** at every width (no terminal draws boxes); 0 overflowing at 390 and 1440.

**Maybes — for the overview pass:**
- [x] **P1 · Hero line.** Lead with the reader's situation; keep the PRINCIPLES sentence verbatim as
  the definition line under it (a placement, not a rewrite — Ajesh's call whether that needs
  `/decide`). Candidates: *"Your AI can build anything. BOSS keeps it building the one thing."* ·
  *"Ten features in, and not sure what it's for?"* · promote the existing h2 *"Building got cheap.
  Being wrong didn't."*
- [x] **P2 · Reorder home:** hero → the two doors (move the shape picker, `index.html:193–302`, up;
  cut to *new idea* / *a repo I already have*; drop *several at once*) → install → requirements →
  proof. The door-2 panel (`:236–241`) describes a live, paying app; door 2 is *already building and
  drifting* — rewrite, with a short sample of what `/read-repo` says back.
- [x] **P3 · Subtract:** 28 snags (`:317–441`) → the ~5 that describe this reader (`:321, :325, :352,
  :356, :360`); the rest to guide.html or one `<details class="walk">`. *It working* (`:471–542`)
  keeps setup + the one line BOSS says; hook JSON to conscience.html. Band (`:609–626`) → one line,
  below the CTA (it is the biggest persimmon object on a phone — two loud things, DEC-020).
  *Three ways down* (`:652–664`) → three links.
- [x] **P4 · "Not for" gets:** *not on Claude Code yet — not for you today* (`:295`). Kinder than
  finding out at install.
- [x] **D1 · Phone hero:** hide `.hero .rail` under 46rem (the nav already carries the mark — +170px);
  nav one row or not sticky (now 133px pinned = 16% of every screen; links 24px tall, under 44);
  one install command (npm), Homebrew as a link — the wrapped brew box makes two persimmon buttons.
- [ ] **D2 · Proof tiles** render ~280px wide and unreadable: one large tile + two thumbnails, or
  crop each to one legible region. **demo.html has no images** — reuse the tiles there.
- [ ] **D3 · Small:** `.yield` default `ul` padding (`site.css:654`); picker tabs 34px; inline code
  11.6px; footer Copy buttons misaligned (shared width, or drop brew).

**Shipped 2026-10-05** (`5ff59d8` home, `6ee90f0` demo; live on Ajesh's next deploy): hero *"Your AI
can build anything. BOSS keeps it building the one thing."* with the PRINCIPLES sentence verbatim under
it; two doors directly under the hero; 5 snags shown, 23 folded; hook JSON folded under the spoken
line; band → one line; Not-for names Claude Code; phone hero = one mark, one-row unpinned nav, 44px
targets, `--step-3` h1, one install command. Measured on a local build: **18 → 14 phone screens**,
install at 0.72, doors at 1.16 (was 5.8), no sideways scroll; desktop 12.5 → 9.6. demo.html carries
the three renders. D3 done except the footer.

**Still open:**
- [ ] **D2b · Proof tiles are unreadable at any size** — the renders are 640px captures of a 1280px
  page (`gen-proof.js`), so enlarging only blurs. Needs a sharper render or tight crops of one region.
- [ ] **D4 · Footer install:** npm + brew Copy buttons land at different x on desktop (`_shell.html:82–90`).
- [ ] **D5 · *How it thinks* subnav** adds ~570px on a phone, so /design's first screen is nav + h1.
- [ ] **V1 · Watch one reader with the new first screen** — the hero line is a candidate until a
  stranger reads it aloud (the watched sessions below). If they still can't say how or when, the line
  changes, not the length.
- [ ] **CLAUDE.md's freeze line** still says frozen until the 10-14 read; Ajesh's call whether it
  stands for the next pass.

**Distribution, ranked by cost-to-signal** (not site work; recorded so the pass doesn't forget):
watched sessions on real drifting repos (read the home page aloud 5 min, then `boss adopt` →
`/read-repo`; each an EVID) → one before/after write-up of `/read-repo` on Ajesh's own project, UTM
per channel → the plugin directory listing → one program-director conversation (IDEA-109) after a
session exists. Deferred: launch-day sites, paid, anything with countdowns or invented proof.
The 10-14 `copy_install` read will be near zero either way — evidence, not traffic, should decide M0.

- [ ] **M1 · The ecosystem, shown not named** (2026-10-05). No *Ecosystems* page and no architecture
  diagram. The ecosystem is real only where BOSS's parts hand work to each other, so show the hand-offs
  as one-line moments on the pages that already exist (`design.html`, `engineering.html`,
  `governance.html`). Each must be true and tested when it goes up:
  - *Your components moved to the manifest at V1; the reuse check moved with them.* (the flow reader, IDEA-137)
  - *`/landing` won't write a line your evidence doesn't back.* (claims, IDEA-138)
  - *`/evals` starts from what already failed.* (AI behaviour, IDEA-139)
  - *BOSS flags an unused component and asks; it doesn't delete it.* (`948ff12`)
  - **At most one sentence naming the whole**, and only after C8 (the founder-side reader) catches a
    real break in a founder's project: *"Design, code, claims and AI each keep their own rules, and BOSS
    keeps the hand-offs between them from breaking."* It touches the one sentence → `/decide` (IDEA-137 Q8).
  - **Never on the site:** *ecosystem of ecosystems* as a heading, *liveliness, alive, dead, pulse,
    healthy, pollutant*, the permaculture/Alexander lineage (credited in `docs/ECOSYSTEMS.md`, not
    marketed), a count of ecosystems, *nobody else does this* (killed 3-0, IDEA-137 R4).
- **Already waiting elsewhere, for the same pass:** what the site shares (`SHARE-SORT-2026-10-04`,
  RESUME's *Waiting on Ajesh*) · the Kettlewick showcase rework (RESUME, FEAT-039).

## Capture log
- **2026-10-05 · Ajesh** — *"i wonder how do we talk about the ecosystem overall in the website, whats
  the best marketing approach without over documentation?"* → show the mechanism, never the metaphor
  (M1). Then: *"add it to website backlog as maybe. i think when we are updating the website, we should
  assess overall overview."* → this record; the overview comes first.
