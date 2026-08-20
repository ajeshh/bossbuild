# BOSS

### Make it real.

*B.O.S.S. — Build Out Solid Stuff.*

> **Everyone can build now. Almost no one can tell a real business from a convincing demo.**
> **BOSS is the conscience that keeps you honest while you move fast** — the thinking layer that
> nudges when you're drifting and pauses on command. No growth-hacking pressure. Override-friendly.
>
> *(Vibe coding gets you a demo; the discipline on top gets you a business. BOSS is that discipline,
> just-in-time. Pause it any time.)*
>
> Cursor and Lovable generate the code. BOSS scaffolds the *thinking about what to build, when
> to ship, and when the discipline should get out of your way.* Brings a mentor board for the
> parts code can't teach, a conscience that catches drift early, modes that scale ceremony to
> evidence. Calm-company by default. Open. Inspectable. Local-only state.

## If this is you

You've been using Claude Code for a few months. You've shipped one project this
year. There are two more in `~/projects/` you didn't finish, and a folder of ideas you didn't
start. Each new project, you re-invent the same scaffolding — and somewhere around screen 3
the design starts drifting (47 different blues, every component a snowflake), or you realize
you never actually pressure-tested whether the bet was real.

The honest question AI raised: *if I can build anything, what should I build, and how do I
know if it's worth finishing?*

BOSS is one answer.

## What BOSS is, plainly

A CLI plus a set of skills, agents, and loops that run inside Claude Code:

- **`boss new my-app`** — scaffolds a project at the lightest level (Quickstart) in five seconds.
  Then `/boss <your idea>` to spin up — point it at a sentence, a doc, a Google Doc, an Obsidian
  note, a PDF, or a URL, and BOSS pulls the material in and shapes it. Optional private GitHub repo;
  a `CLAUDE.md` that fits on a screen.
- **`boss unlock mvp`** — adds the spec discipline (`/spec` with validated-learning + evals
  fields), the smoke gate, the demand-test step (`/pretotype` — Savoia), and JIT design-tokens
  scaffolding when your project earns it.
- **`boss unlock v1`** — adds full design review (`/design-review` + `/ux-check` + token
  enforcement), cross-FEAT sequencing (`/board`), and the next-tier mentors (business,
  fundraising, pitch, talent).
- **A conscience that nudges.** When you've captured three ideas and tested none, it speaks
  once. When you're spec'ing a feature your canvas never validated, it surfaces restraint.
  Cohort-aware (set yours during spin-up; it adjusts the voice). Always overridable; never
  blocking. Silence it for a sprint (`boss conscience pause --for 8h`), or turn down just one
  nudge while the rest keep speaking (`boss conscience mute <moment>`).
- **A mentor board.** Eight advisors for the parts code can't teach, seated as the project earns them:
  `mentor-venture` from day one; architect, GTM and cofounder at MVP; business, fundraising, pitch and
  talent at V1 — alongside the builders who make the thing (`pm` and a coder from the start, `tester`
  and `program-manager` at MVP, `db-architect` and the UI/UX designers at V1). **There's no ethics
  advisor you have to remember to open** — the humane lens is wiring instead: the conscience, `/canvas`'s
  Risks & Harms cell, the `harm-taxonomy` practice, and `/red-team --humane`, which probes your own AI
  product for dark patterns.
- **A user you can ask.** `/persona` derives your app's target user from your idea, grows it as real
  evidence arrives, and lets you consult it — both to guide what you build ("would she want this?")
  and to QA what you built ("how would she read this screen?"). A pre-filter that sharpens the
  questions you take to real users; never a substitute for talking to them.
- **Built for founding teams, not just solo.** Building with a cofounder? `boss team add @their-handle`
  lights up a shared way to decide (`/decide`), share what you're each learning about AI (`/practice`),
  a mentor for the partnership itself (`mentor-cofounder`), and a conscience that notices when you've
  drifted into building in parallel — all *dormant when you're solo*, and it never takes a side or scores
  your equity. See [`docs/GUIDE-teams.md`](docs/GUIDE-teams.md).

Built on Node — zero dependencies. Markdown + YAML everywhere a human reads; predicate-based
loops everywhere a machine evaluates. Lives in Claude Code. Everything runs locally.

## Does BOSS get between me and Claude?

No. You build with Claude exactly as you do now — describe it, have it built, argue with the result.
BOSS doesn't intercept any of that.

What it adds is verbs for the **seams**, the moments between building where things get lost:

- ***How* do I build this?"** → just ask Claude. No skill, no ceremony.
- ***Should* I build this? Is it working? What did I decide?"** → that's a BOSS verb (`/canvas`,
  `/evidence`, `/decide`).

You don't memorize them — `boss map` lists what your project has, and the conscience points at the
right one when it's relevant. The one worth remembering is **`boss status`**: run it when you come
back after a few days and it tells you where you are and what's next.

While you're heads-down, BOSS does almost nothing, deliberately. That's the design, not a gap.

## A concrete moment

You've used `/triage` four times this week capturing ideas. You haven't run `/canvas` on any.
You submit a prompt — anything — and the conscience fires once:

> *"That's the fourth thing you've added here, and none of it's been tested. Who would you
> talk to first to find out if any of them are real? `/canvas` is one way to pressure-test
> it — but a 15-minute call with the right person beats it."*

Then it goes quiet. You decide.

That's the shape of every interaction. Discipline shows up when it can help, hands the
decision back, gets out of the way. Discipline never accumulates as ceremony you have to
work around.

## What you actually get

Four modes, unlocked additively as the project earns them:

> **Quickstart** (capture an idea) → **MVP** (build it) → **V1** (ship it) → **Scale** (grow it)

Each mode adds skills, agents, and loops; nothing is ever ripped out, and every unlock is your
call — a project that stays in Quickstart forever is a legitimate project. The exact, always-current
list of what each mode includes lives where it can't go stale:

- **`boss map`** — the live cheatsheet for *your* project: where you are, what each command does,
  and what's one unlock away.
- **[`docs/CHEATSHEET.md`](docs/CHEATSHEET.md)** + **[`docs/SKILLS.md`](docs/SKILLS.md)** — generated
  from the stage manifests and regenerated by the release gate, so a release can't ship them stale.
  (They *did* drift once — 56 releases — because the generator was a manual script wired to nothing.
  `npm run release` now fails on it. The lesson is BOSS's own: a check nobody runs isn't a check.)

## What BOSS isn't

- **Not a framework you have to learn.** First hour: `boss new`, `/boss`, `/triage`. That's
  the whole vocabulary you need.
- **Not a replacement for talking to real users.** `/persona` sharpens the questions you take to
  a real one; it never answers for them. A synthetic user likes your idea more than a real person
  will, and can't know what it wasn't told. BOSS says this once, then gets out of the way.
- **Not a YC.** Doesn't take equity. Doesn't push toward venture-scale. Defaults to *"you
  should probably not raise; you should probably not hire; you should probably stay right-
  sized"* until evidence says otherwise.
- **Not magic.** Each piece is inspectable. `boss status --conscience` shows what's open, what
  would close it, what overrides you've recorded. The source is plain Node.
- **Not opinionated about your stack.** Stack-neutral until your first build decision; then
  the coder specializes itself. Design tokens are stack-agnostic with per-stack patterns.

## Install + first 5 minutes

**Prerequisites:** [Node.js](https://nodejs.org) 18+ and [Claude Code](https://claude.com/claude-code)
(BOSS runs *inside* Claude Code — the CLI scaffolds, the skills run in Claude).

> **Installs clean under npm v12's new security defaults.** As of npm v12, dependency lifecycle
> scripts, git dependencies and remote-URL dependencies are all off unless you explicitly allow
> them — so most CLIs now need an approval step. BOSS needs none: **zero dependencies, zero dev
> dependencies, and no `preinstall`/`install`/`postinstall` script.** There's nothing to approve and
> nothing to build. (Not a reaction to the change — Principle #4 has required a dependency-free
> `src/` since the beginning. It just happens to be exactly what the new defaults reward.)

```bash
# pick one — all three put `boss` on your PATH (zero runtime deps)
npx bossbuild new my-app        # no install; try it first
npm install -g bossbuild        # the usual
brew install ajeshh/boss/boss   # macOS, via the tap

boss new my-app                 # 5 seconds — scaffolds + git-inits + registers
cd my-app
code .                          # open the folder in your editor (or `claude` in the terminal)
claude                          # open Claude Code (terminal or editor panel)
> /welcome                      # first time? ~1 min orientation
> /boss <idea | file | url>     # spin up — point at a sentence, a doc, or a link; BOSS pulls it in
> /prototype <your idea>        # or just hit go — BOSS builds the smallest clickable version to react to
```

**Contributing / want the source?** `git clone https://github.com/ajeshh/bossbuild.git && cd bossbuild
&& npm install -g .` links your checkout globally. `npm run release` is the gate every change has to
pass.

**Changed your mind?** `boss remove` takes BOSS back out — preview first, `--apply` to do it. It
removes only what BOSS wrote: your code, your ideas and decisions under `docs/`, your own skills, and
any BOSS file you edited all stay; your `CLAUDE.md` keeps everything except BOSS's marked block. A
clean exit is what makes the entrance safe to try. (`boss remove --global` for the machine.)

**Already started building?** You don't have to start over. `cd` into your existing repo and run
`boss adopt` — it **reads how far along you already are** (a build manifest, source files, tests, CI,
a deploy config), tells you what it found, and starts you at the mode that matches instead of
assuming you're at square one. It lays BOSS down *non-destructively*: your files are untouched, and
an existing `CLAUDE.md` gets a marked block appended, never replaced. It caps its own guess at MVP —
V1 means committing to a design system and a db discipline, and that's your call, not a Dockerfile's.
`--mode <m>` overrides it outright. Then run `/comprehend` inside Claude to have BOSS read the repo
properly and tailor the scaffold to it.

After that:

```bash
boss map                        # where you are + what each command does + what's one unlock away
boss status                     # mode + pinned BOSS version + drift
boss status --conscience        # loops state + recent overrides + cohort
boss unlock mvp                 # earn the next layer when ready
boss conscience pause --for 8h  # silence everything for a bounded sprint
boss conscience resume          # bring it back
boss conscience mute caution    # turn down ONE moment; unmute (or --all) to restore
```

`boss map` is the live cheatsheet — run it any time to see what's available in your current mode and
what the next unlock adds. For the read-once walkthrough, see [`docs/GUIDE.md`](docs/GUIDE.md); the
whole ladder at a glance lives in [`docs/CHEATSHEET.md`](docs/CHEATSHEET.md).

## The principle

Six rules in [`PRINCIPLES.md`](PRINCIPLES.md). The one that matters most: **humane before
viable.** A tool that exists to help founders build well must itself behave well. BOSS pauses
on command. Overrides every loop on request. Records every override so future-you sees the
deviation. Refuses to nag. Refuses to grade. *The seasoned hand who's built many things and
doesn't need the credit.*

The other five rules govern when to add ceremony (only as earned), when to capture practice
UP into BOSS's library (when reusable across projects), when to push practice DOWN into a
project (when validated), how to keep changes small (each release the minimum experiment that
produces validated learning), and how to keep style decoupled from code (design tokens as
authority).

## Where this is

All four modes authored — Quickstart, MVP and V1 in full; Scale's first slices (`/incident`, the
customer register, the working rules, the evidence-gated unlock), with its later surfaces
deliberately trigger-gated until a real project hits the symptom. Many capability releases in. For
the exact current release, see [`VERSION`](VERSION) + the [changelog](registry/CHANGELOG.md).
Self-hosted (BOSS itself runs in MVP mode, using BOSS). All discipline patterns demonstrated
by BOSS-on-BOSS before they ship anywhere else.

**This is alpha.** The conscience runs a gate-eval suite (136 passing) plus a model-verified
judgment surface — its drift / caution / capture calls are graded against labeled sets, not
just vibes. But it's been pressure-tested mostly against synthetic personas; real-founder
validation hasn't happened yet (a deliberate, recorded override).
If you try BOSS and it falls down, *that's the most useful thing you can tell me* — run
`/feedback` and it goes straight to this repo's issues.

## License + shape

Open source. Calm-company by default. No monetization of lock-in. No telemetry. Local-only
state — your project's data stays in your repo + `~/.boss/registry.json` on your machine. If
a business model ever emerges, it'll be hosted advisory sessions or patronage; never the CLI
itself.

BOSS pressure-tests its own bet with a **Humane Product Canvas** — People, Problem, Promises,
Risks & Harms, Principles, and the live riskiest assumption. It's the same `/canvas` skill BOSS
hands you, turned on itself.

## Acknowledgements

BOSS draws on a roster of practitioners — Don Norman, Brad Frost, Nathan Curtis, Jakob
Nielsen, Steve Krug, Ash Maurya, Eric Ries, Alberto Savoia, Rob Fitzpatrick, Bob Moesta,
Teresa Torres, Andrej Karpathy, Simon Willison, Ethan Mollick, Guillermo Rauch, Hamel Husain,
Jason Liu, Christopher Noessel, Indi Young, John Maeda, April Dunford, Andy Raskin, Jason
Fried & DHH, Rob Walling, Paul Jarvis, Erika Hall, Mike Monteiro, Tristan Harris, Cathy
O'Neil, Cal Newport, and many more. Mentor agents cite specific practices by attribution;
**no agent impersonates a person**.

The Humane Product Canvas framework is by Ajesh Shah; reused as the spine of BOSS's `/canvas`
skill.

---

*[For the interior architecture — how the CLI works, how the loop primitive composes, how
the conscience hook reads predicates, how the registry tracks projects, how sync works —
read [`PRINCIPLES.md`](PRINCIPLES.md) and the source under [`src/`](src/). Not necessary for
first-use.]*

*[Building agent tooling yourself? [`docs/PATTERNS.md`](docs/PATTERNS.md) names the engineering
patterns BOSS is built on — the doer/judge split, two eval surfaces with real numbers,
progressive-disclosure skills, dormant-by-default hooks, AGENTS.md portability — with the honest
limits included.]*
