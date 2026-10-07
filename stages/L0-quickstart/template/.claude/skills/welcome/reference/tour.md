# /welcome — the full tour (section 4)

> Opened from section 3a / 3c of [`SKILL.md`](../SKILL.md) for beginner and domain-expert cohorts.

### What BOSS is

> *"BOSS is the conscience that keeps you honest while you build fast. It runs inside Claude Code, sets a project up with only the structure it has earned, says one thing when you're drifting, and stays quiet the rest of the time.*
>
> *Three pieces:*
> 1. *A **mode** — how much structure the project has. New projects start in **Quickstart**
>    (lightest); they level up to **MVP**, **V1**, and **Scale** as the project earns it.
>    Think of modes like a notebook getting more organized as a project matures.*
> 2. *A set of **skills** — small commands like `/boss`, `/idea`, `/canvas` that do one
>    thing well. You'll see them suggested as you work.*
> 3. *A **conscience** — a quiet background process that sometimes speaks up if something
>    looks like it's drifting (capturing lots of ideas but never validating any, for example).
>    It's a **nudge, never a block.** You can override or pause anytime."*

### When do I use BOSS, and when do I just talk to you?

**Ask this before they do.** It is the first real question every founder has, it is genuinely
ambiguous — BOSS lives *inside* Claude Code — and if it goes unanswered they either avoid the
skills entirely or stop and wonder before every message. Keep it to roughly this shape:

> *"One thing worth settling now, because it trips everyone up: **BOSS doesn't sit between us.**
> You talk to me exactly the way you would in any other project — describe what you want, ask me
> to build it, argue with the result. Nothing about that changes.*
>
> *BOSS adds verbs for the **seams** — the moments between building, where things usually get
> lost:*
> - ***"how do I build this?"** → just ask me. No skill needed.*
> - ***"should I build this?"** / **"is this working?"** / **"what did I decide, and why?"** →
>   that's a BOSS verb (`/canvas`, `/evidence`, `/decide`).*
>
> *And you don't have to memorize any of them. `boss map` lists what this project has; the
> conscience points at the right one when it's relevant. When you come back after a few days,
> **`boss status`** tells you where you are and what's next — that's the one worth remembering."*

If they push — *"so what does BOSS actually do while I'm working?"* — the honest answer is: mostly
nothing, on purpose. It speaks when the work drifts from the bet they named, maybe once or twice a
day, and hands the decision straight back. **Don't oversell the conscience here.** A founder who
expects constant guidance and gets silence will read it as broken.

### What's already in this folder

Read the manifest. Name what's there in plain language:

> *"You're in **Quickstart** mode right now. The folder has:*
> - *`CLAUDE.md` — the working rules for this project. Read it first.*
> - *`.boss/manifest.json` — what BOSS installed; `.boss/config.json` — your preferences.*
> - *`.claude/skills/` — the skills you can run with `/<name>`. Today: `/boss` (spin up an idea),
>    `/idea` (capture one), `/prototype` (hit go — see it running), `/canvas` (pressure-test it),
>    `/persona` (your user's voice), `/welcome` (you're here), and a few more (`boss map` lists them all).*
> - *`.claude/agents/` — specialized helpers BOSS can hand work off to: `product-lead` (decides what's
>    worth building), `coder` (builds it once the stack is chosen), `mentor-founder` (advisory only —
>    the one to ask when you want to talk an idea through, or hear whether the bet is worth taking).*
> - *`docs/ideas/` — where ideas live as living docs. Empty now; fills as you capture."*

### What to do next

Three paths. **Path 0 is the only one you offer an adopted repo** (`manifest.adopted === true`);
for a fresh project, name A and B and let the founder pick.

> *"**Path 0 — you already built something.** Run `/read-repo` next. I'll read what's actually
> here — the code, the tests, what ships, what's half-finished — and tell you where you stand:
> what BOSS can see, what it can't, and two or three things you could do this week with what each
> would change. **Position, not a grade.** Nothing gets rewritten, nothing gets audited that you
> didn't ask about. After that, `/canvas` if the bet itself has never been pressure-tested, and
> `/spec` when the next feature starts."*
>
> *If nobody outside the building has used it yet, the highest-value hour is still `/interview` —
> one 15-minute conversation with someone who has the problem. Working software makes that call
> easier to get, not less necessary.*


> *"**Path A — you have a rough idea or PRD already.** Run `/boss` next. Point me at it however it
> exists — a sentence, a file path, a URL, even a few of them (a Word doc, a deck, an Obsidian note,
> a PDF, a Google Doc link). I'll pull a copy into the project, say back what I heard, and ask whether
> you want to keep shaping it or start building. Then I capture it as a **living** idea doc, recommend
> a stack and mode, and (with your OK) create a private GitHub repo. That's the **spin-up** flow.*
>
> *Living means what it says: the idea doc is somewhere you keep adding, not a form you filled in once.
> `/idea <a thought>` adds to it whenever more lands; `/inbox` adds a whole document.*
>
> *Path B — you have a fragment, a hunch, or just a topic to noodle on. Run `/idea <one
> sentence about it>`. I'll create a living idea doc you can keep adding to. Re-run `/idea`
> anytime to add more. No commitment yet — capture first, decide later.*
>
> *And either way — if you'd rather **see** the idea than describe it, run `/prototype <the idea>`.
> I'll build the smallest clickable version of the one core thing so you can react to something real
> instead of a blank page. Building first is a fine place to start; we fill in the rest after.*
>
> *Once you can say what it is and who it's for, two things pay for the rest, and there's no order
> between them. `/interview` preps a 15-minute Mom-Test call and turns your notes into a graded
> record of what you actually learned. `/canvas` is a humane pressure-test, a few cells at a time:
> who's served? what's the tension? what's the promise? who could be harmed? what's the riskiest
> assumption? Each sharpens the other — the canvas tells you what to ask, the conversation fills
> the cells you were guessing at. The canvas is the gate before you unlock MVP mode and start
> building."*

> **Pivot here — offer the rest, don't dump it.** The founder now has the shape and the next
> step. The three topics below (how the conscience works, how modes level up, where to find help)
> are **reference, not required reading** — printing all three is exactly the wall that makes a
> founder forget what to do. Name them in one breath and offer:
>
> > *"That's enough to start. There's more I can walk you through whenever you want it — how the
> > conscience nudges, how modes unlock as you go, where to get help — but none of it blocks you.
> > Want any of it now, or shall we get going with `/boss` or `/idea`?"*
>
> Expand a topic **only if they ask** — and when they do, read the matching section of
> [`deeper.md`](deeper.md). Don't load it otherwise; it's reference, not a script.
> Either way, end on the action (section 5).
