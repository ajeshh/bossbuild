---
id: COMP-superpowers
type: competition
owner: product-lead
status: living
sort: watch
checked: 2026-09-11
source: github.com/obra/superpowers — README.md, .claude-plugin/plugin.json, hooks/hooks.json, skills/ tree, repo metadata via the GitHub API, all read 2026-09-11
updated: 2026-09-11
---

# superpowers — the build-craft methodology, at 285k stars, on every host

> **Read from the primary.** The README (346 lines), the plugin manifest (v6.3.0), the hooks file,
> the skills directory listing, and the repository's own metadata. Not a blog post, not memory.
> Where this says *"it says"*, it is quoting.

## What it is

*"A complete software development methodology for your coding agents, built on top of a set of
composable skills and some initial instructions that make sure your agent uses them."* — Jesse
Vincent (obra), created 2025-10-09, **MIT**. Marketplace blurb: *"Core skills library for Claude
Code: TDD, debugging, collaboration patterns, and proven techniques."*

**14 skills**, one `SessionStart` hook, no agents, no state directory. The skills: brainstorming ·
writing-plans · executing-plans · subagent-driven-development · test-driven-development ·
systematic-debugging · verification-before-completion · requesting-code-review ·
receiving-code-review · using-git-worktrees · finishing-a-development-branch ·
dispatching-parallel-agents · writing-skills · using-superpowers.

**The workflow it enforces** (its own numbering): brainstorming *"activates before writing code…
saves design document"* → git worktree → a plan *"clear enough for an enthusiastic junior engineer
with poor taste, no judgement, no project context, and an aversion to testing"* → subagent per
task with two-stage review → TDD RED-GREEN-REFACTOR (*"deletes code written before tests"*) →
code review → finish branch. *"Mandatory workflows, not suggestions."*

**Scale, from the API on 2026-09-11:** ★285,233 · 25,509 forks · 353 open issues · 1 commit in
the last 30 days · latest tag v6.3.0. It is in Anthropic's **official** marketplace
(`/plugin install superpowers@claude-plugins-official`) and runs its own marketplace
(`obra/superpowers-marketplace`, ★1,256).

**It ships to fourteen hosts from one repo.** Top-level directories: `.claude-plugin`
`.codex-plugin` `.cursor-plugin` `.devin-plugin` `.hermes-plugin` `.kimi-plugin` `.opencode` `.pi`
`gemini-extension.json` `GEMINI.md` `AGENTS.md` `CLAUDE.md`. The README installs for Claude Code,
Antigravity, Codex App, Codex CLI, Cursor, Devin, Factory Droid, Gemini CLI, Copilot CLI, Grok Build,
Kimi, OpenCode, Pi, Hermes. *"If you use more than one, install Superpowers separately for each."*

**Commercial layer:** *"If you're using Superpowers in enterprise and could benefit from commercial
support, additional tooling, or managed spending… sales@primeradiant.com."*

## Pricing

Free, MIT. Enterprise support: **not public** — a sales email, no page.

## Why they might win

- **It is the default.** 285k stars and a slot in the official marketplace mean a founder who
  asks *"what should I install first?"* is told this. BOSS's own `boss craft` shelf cites the same
  disciplines (TDD, plans, worktrees); a founder can get the craft half of BOSS in one command,
  from the tool everyone already recommends.
- **Fourteen hosts, one repo.** The question IDEA-096 holds — *where do founders find it?* — is one
  superpowers answered by brute force: a per-host adapter directory for every agent CLI that exists.
  Whatever host a founder is on, it is there.
- **It fires without being asked.** *"Because the skills trigger automatically, you don't need to
  do anything special."* One `SessionStart` hook injects the methodology; the skills are
  model-invoked. Zero ceremony to adopt, which is exactly the property EVID-001's cohort wants.
- **The brainstorming skill is a real front door.** *"It steps back and asks you what you're really
  trying to do… teases a spec out of the conversation… shows it to you in chunks short enough to
  actually read."* That is `/spec`'s job, done before the founder knows to ask.

## Where they're weak

- **It has no venture.** Not one skill asks *why*, *for whom*, or *what would prove this wrong*.
  Brainstorming refines *"rough ideas"* into a design document — the design of the software, never
  the bet. No canvas, no evidence, no riskiest assumption, no mode. It makes a founder better at
  building the wrong thing faster, and its philosophy section (*TDD · systematic over ad-hoc ·
  complexity reduction · evidence over claims*) is entirely about code.
- **No memory across sessions.** The design doc and plan are files, but nothing reads them back
  next week. No re-entry, no "where was I", no arc. The "evidence over claims" principle applies
  to *is the test green*, never to *did anyone want this*.
- **One register for everyone.** *"Mandatory workflows, not suggestions."* The enthusiastic-junior
  framing is a good joke and a fixed ceremony: a first-product founder gets git worktrees and
  two-stage subagent review on day one. Nothing scales the process to the maturity of the project.
- **Telemetry by logo.** The README's last section: *"Because skills and plugins don't provide any
  feedback to creators, we have no idea how many of you are using Superpowers. By default, the Prime
  Radiant logo on brainstorming's optional visual companion feature is loaded from our website."*
  A remote image as a usage beacon, on by default. BOSS's `/feedback` is user-initiated and shows
  what leaves the machine; this is the opposite choice, stated openly. It is also the honest
  admission that plugin authors are blind — which is BOSS's situation too.
- **Velocity has slowed.** One commit in thirty days against 353 open issues, at v6.3.0. Mature or
  stalled — the next recheck will say which.

## How they do it — design reference, not parity

- **Hook wiring on Windows.** `hooks.json` uses shell form with an explicit `"shell": "bash"` and a
  polyglot `run-hook.cmd` launcher. BOSS chose exec form (v0.300.0) instead — no shell at all —
  which is the form Claude Code's docs now recommend and needs no launcher file. Two answers to the
  same PowerShell gap; BOSS's is newer and simpler, theirs runs on Claude Code versions before
  2.1.139.
- **One `SessionStart` hook, matcher `startup|clear|compact`**, injecting the methodology so it
  survives a `/clear` and a compaction. BOSS's `reentry.js` hook deliberately excludes `compact`
  (IDEA-094 records why); worth re-reading that decision against this.
- **Per-host adapter directories.** `.cursor-plugin/`, `.codex-plugin/`, `GEMINI.md` etc. — the
  layout for "one repo, N hosts". If IDEA-006 ever re-opens, this is the shape to study first.
- **The junior-engineer plan spec.** Plans written so an agent with *"no project context"* can
  execute them is the same discipline as BOSS's FEAT acceptance criteria, stated more vividly.

## What I did not find

- Any pricing page or enterprise tier — a sales email only.
- Any usage number beyond stars. Their own README says they have none.
- The visual companion itself (an optional web UI referenced from `brainstorming`); not opened.
- Whether the Cursor/Codex/Gemini adapters carry the *hook* or only the skills — the README says
  Antigravity *"runs the plugin's session-start hook"*, which implies at least one host does not.

## The read

**Adjacent, and the strongest adjacent row in this table — it is the build-craft half of BOSS,
done well, at scale, with no venture half at all.** A founder can run both: superpowers for how to
build, BOSS for whether and what. The overlap is `boss craft` (BOSS's practice shelf) and `/spec`'s
build-discipline half; the non-overlap is everything BOSS exists for. **The lesson is not a
feature — it is distribution:** one repo, fourteen hosts, the official marketplace, and a
`SessionStart` hook that makes adoption invisible. IDEA-096's presence question has a worked
example now.

## Change log

- 2026-09-11 — filed. Ajesh: *"superpowers is potentially our competitor, maybe. not most direct."*
  Verdict after reading: adjacent, not direct — `watch`.
