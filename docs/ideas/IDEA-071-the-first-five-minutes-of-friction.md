---
id: IDEA-071
type: idea
owner: product-lead
status: shipped (v0.218.0 — `defaultMode: auto` gone, `$schema` in, allow list dropped; the sandbox and `init.sh` named in the practices; nothing left that is a build)
proof: stages/L0-quickstart/template/.claude/settings.json
proof_note: Evidence grade was stated-pain (secondary — community complaint, not a BOSS founder) and the field used to carry that grade instead of a path. Nobody has told BOSS that BOSS's scaffold is prompt-noisy. The pain is real and widely reported about the *host*; the claim that BOSS's defaults make it better or worse is unproven. But F1 and F2 below need no proof — they are verified defects in a file BOSS already ships.
gist: BOSS already writes the founder's permission file — and one line of it has been inert since Claude Code v2.1.142, while the host's single biggest prompt-reduction lever (the Bash sandbox, 84% by Anthropic's own measurement) is absent from it entirely. The idea is not a new skill. It is: make the file BOSS already ships true, and name the seam to the host commands that own the rest.
created: 2026-08-22
source: Ajesh, 2026-08-22 — "knowing what permissions to write, edit, create, and so forth to reduce
  the amount of effort to keep hitting confirmation for different file types, a lot of folks have
  shared they get frustrated. but being able to set permissions early on, to make it easier great.
  could be a default, and then people can easily ask boss for further .. anything to reduce workflow
  drag that are just best practices for CLI based workflow, especially agentic.. Boss should be great
  at setting up the CLI or vscode environ for smooth sailing in setting up a new project quickly. we
  already do this, but just need to continue to invest in it."
relates: EVID-001, IDEA-014, IDEA-055, DEC-011, library/practices/context-discipline.md, library/practices/harness-engineering.md, library/practices/agent-security.md
---

# IDEA-071 — The first five minutes of friction

## The seed, and the correction it contains

*"We already do this, but just need to continue to invest in it."* Both halves are true, and the
second one is more urgent than the seed assumed. BOSS does ship the founder's permission file. **It
also ships one line in it that the host stopped honouring, and it teaches that line as a practice.**

So this record is not "should BOSS set up permissions?" — it already does. It is: **the config BOSS
writes on a founder's behalf is a claim about their environment, and claims rot.** Nobody has swept
this one since the host moved.

## What BOSS ships today (verified, not remembered)

[`stages/L0-quickstart/template/.claude/settings.json`](../../stages/L0-quickstart/template/.claude/settings.json)
— the only settings file in any of the four modes, inherited by MVP/V1/Scale:

- `permissions.defaultMode: "auto"`
- `permissions.allow`: `Read`, `Edit`, `Write`, `Glob`, `Grep`, `Bash`, `Agent`, `TodoWrite` — all bare tool names
- `permissions.deny`: a 29-entry secret-path floor (`.env`, `secrets/`, `*.pem`, `.ssh`, `.aws`, and the
  `cat`/`base64`/`printenv` read-arounds). This floor is merged forward by `boss sync`
  ([`src/sync.js:143`](../../src/sync.js#L143)) — the one permission key BOSS ever touches after scaffold.
- the `UserPromptSubmit` conscience hook

[`library/practices/context-discipline.md`](../../library/practices/context-discipline.md) owns the
prose, including a "Permission modes" section added 2026-08-11.

**Not shipped anywhere, in any mode:** a `sandbox` block, a `$schema` line, an `init.sh`, or a
`.vscode/` directory.

---

## F1 🔴 — `defaultMode: "auto"` is inert where BOSS puts it, and it silently overrides the founder

Claude Code's own documentation, verbatim:

> `permissions.defaultMode` in a settings file. **An `"auto"` value in `.claude/settings.json` or
> `.claude/settings.local.json` doesn't take effect, and Claude Code then uses the built-in default
> rather than a `defaultMode` from `~/.claude/settings.json`.** The other values apply from any
> settings file.

and, in the troubleshooting section:

> In Claude Code **v2.1.142 and later**, `auto` doesn't take effect from those files. Move it to
> `~/.claude/settings.json`.

Two failures, and the second is worse than the first:

1. **It does nothing.** BOSS's line at
   [`settings.json:3`](../../stages/L0-quickstart/template/.claude/settings.json#L3) is a project
   file. `auto` is the one value the host ignores there.
2. **It is not neutral — it displaces the founder's own setting.** The presence of an `auto` value in
   the project file makes the host fall back to its *built-in* default **instead of reading the
   founder's `~/.claude/settings.json`**. A founder who deliberately set `"defaultMode": "default"`
   machine-wide — the careful, security-conscious founder — has that preference dropped by a file
   BOSS wrote into their repo without asking. **BOSS's most cautious user is the one it overrides.**

And the practice teaches it:
[`context-discipline.md:204`](../../library/practices/context-discipline.md#L204) says *"BOSS already
ships `"defaultMode": "auto"` in the L0 template — this change makes the host agree with a call BOSS
made earlier, and nothing in a scaffolded project needs to move"*, and the snippet at
[line 221](../../library/practices/context-discipline.md#L221) hands the founder
`{ "permissions": { "defaultMode": "auto" } }` **without saying which file it goes in** — the single
fact that decides whether it works.

> **Fourteenth instance of the audit heuristic** ([checkers state intents they don't enforce]): a
> config key whose *name* asserts a behavior — and which nothing in `npm run check` verifies, because
> the truth source is a host doc, not a file in this repo. The practice's own header calls this out
> and was not obeyed: *"Re-verify the syntax below when the host changes; flags and frontmatter
> formats drift."* Its `review_by` is 2026-11-09, so the cadence had not yet fired — **this is
> exactly the event-trigger case `/practice-refresh --event` exists for.**

## F2 — the allow list is a blanket grant the founder is asked to approve before they can read it

Every entry in BOSS's `allow` array is a **bare tool name**. Per the host docs, *"to match all uses of
a tool, use only the tool name without parentheses."* So `"Bash"` allows **every shell command**, with
the deny floor as the only thing beneath it. The deny floor is doing all of the work; the allow list
is not narrowing anything.

Compounding it: `permissions.allow` in a project file **waits for workspace trust** —

> `permissions.allow` rules and `permissions.additionalDirectories` entries in a project's
> `.claude/settings.json` grant capability, so Claude Code applies them only after you accept the
> workspace trust dialog for that folder. `deny` and `ask` rules aren't affected, since they only
> restrict.

which means a **day-one founder's first interaction with BOSS is a trust dialog listing a blanket
Bash grant they have no way to evaluate.** That is a humane-lens problem before it is a config one:
BOSS asks for consent at the exact moment consent is least informed, for a grant it never explained.
(The deny floor, by contrast, applies immediately and needs no dialog — the asymmetry is already in
`sync.js`'s comment and was never carried into the template's design.)

## F3 — the 84% lever is absent

The host now ships an OS-level Bash sandbox (Seatbelt on macOS, bubblewrap on Linux/WSL2), configured
by a `sandbox` block in the same `settings.json` BOSS already writes, with an **auto-allow** mode that
runs sandboxed commands with no prompt at all. Anthropic's engineering post, verbatim:

> "In our internal usage, we've found that sandboxing safely reduces permission prompts by **84%**."

and the design constraint that makes it honest:

> "effective sandboxing requires *both* filesystem and network isolation. Without network isolation, a
> compromised agent could exfiltrate sensitive files like SSH keys; without filesystem isolation, a
> compromised agent could easily escape the sandbox and gain network access."

This is the single largest answer to the seed's question, it lives in a file BOSS already owns, and
BOSS says nothing about it. It also sits *precisely* on `agent-security`'s existing thesis —
**enforce in the harness, not the prompt** — one layer deeper than `permissions.deny`: OS-enforced,
inherited by child processes, and unlike the auto-mode classifier, **deterministic**.

Two things make it a real design question rather than a copy-paste:

- **A scaffolded project is `sandbox: { enabled: true }` away from far fewer prompts** — but the
  default write boundary is the working directory plus the temp dir, and a founder running `npm i`,
  `docker`, or a global toolchain will hit it. `filesystem.allowWrite` is stack-specific, and BOSS is
  **stack-neutral by principle (P4)**. A default that breaks `npm i` on day one is worse than no
  default.
- **Network isolation pre-allows nothing.** Useful (that *is* the exfiltration guard) and also the
  thing most likely to read as "BOSS broke my install."

## F4 — the cheap ones

- **No `$schema`.** One line —
  `"$schema": "https://json.schemastore.org/claude-code-settings.json"` — gives the founder
  autocomplete and inline validation of this file in VS Code, Cursor, and any schema-aware editor.
  The host docs recommend it. It costs nothing and it is the most literal possible answer to *"BOSS
  should be great at setting up the vscode environ."*
- **No `init.sh`.** [`harness-engineering.md`](../../library/practices/harness-engineering.md) already
  names this failure→fix pair in BOSS's own words — *"**Friction → an `init.sh`.** Every manual step
  between 'clone' and 'running' is a place the agent (and the next you) loses time and state. Script
  it."* — and no BOSS template ships one. **The practice shelf is ahead of the scaffold.**
- **The VS Code seam is real and undocumented.** The extension keeps its **own** starting-permission-mode
  list and **does not read project settings** for it, so anything BOSS writes into the project file is
  invisible to the VS Code founder — a second, independent reason F1's line does nothing. The
  extension's approval card also lets the founder choose which file a new rule lands in (including the
  shared project file, which changes it for everyone); the CLI always writes to the local file.

---

## The shape this should take (and the one it must not)

⛔ **Not a 23rd skill.** [[EVID-001]]'s standing mandate is **compose + subtract, never add** — and a
"`/setup-permissions`" skill would be the exact bloat the founder in that record named as their own
fear. The host also already ships the interactive half: `/permissions`, `/sandbox`, `/doctor`, and a
bundled `fewer-permission-prompts` skill that reads your own transcripts and proposes an allowlist
from what actually prompted you. Re-rolling any of that is
[drift, not differentiation](../../library/practices/harness-engineering.md) — *"when the host absorbs
a mechanism, re-rolling it stops being differentiation."*

**What is left for BOSS is the part the host cannot do: the defaults at scaffold time, and the
judgment about when to widen them.** The host's own tools are all *reactive* — they need a founder who
has already been annoyed. BOSS writes the file before the first prompt ever fires. That is the seam,
and it is a good one.

So, in likely order:

1. **Make the shipped file true** (F1 + F4's `$schema`). A correction, not a feature: no new surface,
   two files, and the practice's snippet learns to name its file. This is unblocked and independent of
   every question below.
2. **Decide the allow list's shape** (F2) — narrow the bare grants to command-scoped rules the founder
   can actually read in the trust dialog, or drop the allow list entirely and let the deny floor plus
   the host's default mode carry it. *A blanket grant nobody reads is the permission-fatigue failure
   one layer up.*
3. **Name the sandbox in the practice before shipping any sandbox default** (F3) — voicing before
   mechanism, the shape BOSS has now used four times ([[IDEA-041]], [[FEAT-024]] slice 3,
   [[IDEA-039]], the schema gate).
4. **`init.sh` as a harness rung**, if and only if it can be stack-learned rather than stack-baked
   (P4). Possibly `/spec`-adjacent rather than scaffold-time.

## Closed — 2026-09-13: every step had already landed, the record never said so

Read against the shipped file and the practice: **F1** — `defaultMode: auto` dropped and `$schema`
present since v0.218.0 (2026-08-23). **F2** — the blanket `allow` list is gone; the deny floor
carries it alone, which was the record's own second option. **F3** — the practice names the sandbox
(`context-discipline.md`, *"the one that actually removes the prompts"*, host-doc version-pinned).
**F4/P4** — `init.sh` lives in `harness-engineering.md` as a harness rung, stack-learned, not
scaffolded. The record sat at `exploring` for three weeks after its last defect was fixed — the
same shape as IDEA-084 and IDEA-102, flipped the same day. The open questions below stand as
written; none of them is a build.

## Open questions

- **Whose file?** F1's fix has two forms: delete the line, or have BOSS *offer* to write `auto` into
  the founder's `~/.claude/settings.json`. The second actually delivers the seed's intent and is the
  first time BOSS would write outside the project. **`boss` has never touched a founder's home
  settings**, and `boss remove` could not cleanly take it back. Deleting is reversible; writing is not.
- **Is a prompt-free default even right for a first-time founder?** The whole cohort BOSS is built for
  is the one that cannot yet evaluate what it is approving. Reducing drag for `persona-vibe-virtuoso`
  and reducing drag for `persona-first-product` may be opposite instructions — and the host's own data
  cuts both ways: 93% of prompts get approved (so the prompt is mostly theatre), which is *also* the
  argument that the remaining 7% is the only review happening.
- **Does this rot faster than BOSS can sweep it?** F1 was true for some window before v2.1.142 and
  false after. `context-discipline`'s own header already says permission modes *"moved three times in
  2026."* If BOSS ships host config, BOSS signs up for a sweep cadence — **the honest options are a
  `--event` trigger on host release, or shipping less host config.** This is [[IDEA-014]]'s question
  pointed at the permission surface, and it may be the most important thing in this record.
- **Does any of this belong in `boss doctor`?** There is no such command. A read-only "your
  environment vs. what BOSS assumes" check is the natural home for host-drift detection — and is also
  a new surface, which needs its own justification.

## Evidence grades (do not launder these upward)

| claim | grade | source |
|---|---|---|
| `auto` doesn't take effect from project settings; displaces `~/.claude` value | **documented host behavior**, version-pinned (v2.1.142+) | [permission-modes](https://code.claude.com/docs/en/permission-modes) |
| bare tool name matches all uses; allow rules wait for workspace trust | **documented host behavior** | [permissions](https://code.claude.com/docs/en/permissions) |
| sandboxing reduces prompts by 84% | **vendor-measured, internal usage** — not independently reproduced | [Anthropic engineering](https://anthropic.com/engineering/claude-code-sandboxing) |
| users approve 93% of permission prompts | **vendor-measured** | [Anthropic engineering, auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) |
| "1,053 testers, only 143 caught a planted dangerous command" | 🔴 **UNVERIFIED — do not cite.** Widely repeated in secondary blogs; **not present** in Anthropic's auto-mode post, which reports classifier false-positive/negative rates instead. A second circulating figure (97% approval) contradicts the primary source's 93%. | secondary only |
| "add an allow rule the second time a prompt annoys you, not the first" | **community heuristic**, unvetted — would need `/vet` before adoption | secondary blogs |
| practitioners run `bypassPermissions` on a disposable VM | **single practitioner** (Domenic Denicola, 2026-07), explicitly accepting the risk on a throwaway machine — **not a founder-safe default** | [domenic.me](https://domenic.me/agentic-coding-setup/) |

The three primary-source findings (F1, F2, F3) are **documented host behavior, not stranger-claims**,
so they do not need `/vet` — they need re-verification against the host on a cadence. The community
heuristics in the last two rows do, if anyone proposes adopting them.
