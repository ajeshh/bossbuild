---
id: IDEA-081
type: idea
owner: product-lead
status: shipped (2026-09-13 — priorities 1–3 landed as DEC-015, DEC-016, IDEA-077; Finding 4's BOSS-side half closed by tracking RESUME (IDEA-087); the founder sentence in /close and Finding 5 ride IDEA-078)
proof: none
verified: >
  [VERIFIED] mechanically against Claude Code 2.1.132's shipped binary (strings + zod schemas +
  UI copy), and one claim verified by EXPERIMENT. What Remote Control is: a bridge from a session
  running on the founder's own machine out to claude.ai/code and the Claude mobile app —
  `claude remote-control`, `--rc`, `/remote-control`, the `remoteControlAtStartup` setting, the
  `disableRemoteControl` managed setting. Its own dialog: *"Serve a directory to claude.ai"*,
  *"Kick off a long task, close your laptop, check progress from your phone."* Spawn modes are
  *"Each session gets its own git worktree (requires a git repo)"* or all sessions share one
  directory. `/teleport` pulls a web-started session into the terminal with full history.
  `PushNotification` pushes to the founder's phone WHEN RC IS CONNECTED. `subscribePR` lets a
  session watch a PR and push fixes. `isolatePeerMachines` gates `SendMessage` reaching a session
  on another machine. Background/cloud sessions (`claude agents`, `--bg`, `/background`) are a
  SEPARATE fleet — *"Remote Control is not available inside a remote session."*
  EXPERIMENT: a scratch repo with BOSS's shipped `.gitignore` was worktree-added; the new worktree
  carried `.boss/manifest.json`, `.boss/brain/read.md` and `docs/RESUME.md`, and carried NEITHER
  `.boss/conscience-log.jsonl` NOR `.boss/brain/relationship.md`.
  FOUNDER DEMAND is [n=0]. Nobody has asked for any of this. It is `curve: host` movement.
proof_note: >
  The single most important verified fact is the NEGATIVE one, and it should stop a build: Remote
  Control does not move the project. The repo, `.boss/`, `docs/` and `.claude/` all stay on the
  founder's machine; RC is a control surface onto a local session. **BOSS does not need a sync
  layer, a server, or a hosted anything.** Every finding below is about SURFACE and about state
  that was already machine-local — not about relocating BOSS.
gist: >
  Remote Control does not change where BOSS lives. It changes where the founder is standing. Every
  answer BOSS gives about orientation — `boss status`, `boss map`, `boss board`, `boss brain`,
  `boss hooks` — is a terminal command, and a founder on a phone has no terminal. At the same time
  the worktree spawn mode hands the conscience a session where it remembers the venture and has
  forgotten every nudge it ever fired, because the two files that hold that memory are gitignored
  by a decision that was right when there was one machine. And `PushNotification` quietly makes
  BOSS able to reach a founder who is away — the exact thing `src/orientation.js` argues it must
  never do.
created: 2026-09-08
source: >
  Ajesh, 2026-09-08 — "because of claude's new Remote Control. Im wondering how we should make
  boss work with an app being developed via remote, or continue development via remote, especially
  with resume, context sharing and such."
---

# Remote Control — when the keyboard leaves the machine

## First, the thing that is NOT a problem

Remote Control serves a **local directory** to claude.ai and the mobile app. The session runs on the
founder's machine. `.boss/`, `docs/`, `.claude/`, the git repo — none of it moves, and nothing about
BOSS's file-based state model is invalidated.

This is worth writing down because the obvious reaction to "remote" is to design sync, and that
would be a large, wrong build. **The correct posture is that BOSS's substrate already works. What
breaks is narrower and cheaper.**

## Finding 1 — every orientation answer is a terminal command

| The founder asks | BOSS answers via | Reachable from a phone |
|---|---|---|
| where am I? | `boss status`, `boss map` | ✗ |
| what's in flight? | `boss board` | ✗ |
| what do you make of this venture? | `boss brain` | ✗ |
| what can I turn on? | `boss hooks` | ✗ |
| what was I doing? | `boss status` re-entry read | ✗ |

Every one of these is a CLI invocation. RC's own pitch is *"close your laptop, check progress from
your phone"* — and checking progress is precisely what BOSS answers only in a terminal.

**This converts [[IDEA-077]] from a nicety into the load-bearing move.** A `SessionStart` hook fires
inside the session regardless of whether the keyboard is a laptop, a browser tab, or a phone. It is
the only channel BOSS has that survives the surface change, and the answer it would carry
(`src/orientation.js`) is already written.

## Finding 2 — the conscience gets amnesia in a worktree, and DEC-001 is why

RC's worktree spawn mode gives each session its own git worktree. Verified by experiment against
BOSS's shipped `.gitignore`:

| File | In a fresh worktree | Why |
|---|---|---|
| `docs/RESUME.md`, `docs/devlog.md` | ✅ present | tracked — DEC-001's "shared thinking commits" |
| `.boss/manifest.json` | ✅ present | tracked |
| `.boss/brain/read.md` | ✅ present | tracked, deliberately |
| `.boss/conscience-log.jsonl` | ❌ **absent** | gitignored |
| `.boss/brain/relationship.md` | ❌ **absent** | gitignored — DEC-001, per-person |

So the conscience arrives with **full memory of the venture and zero memory of its own behaviour.**
The frequency ledger that `quiet_for` reads is empty, and the relationship log — the file whose
entire purpose is *"it won't re-nag a point you've already answered"* — is not there.

**A founder who overrode a nudge on their laptop gets it again, from the phone.** That is the single
worst possible failure for a conscience whose credibility rests on restraint, and it is produced by
a decision that was correct: DEC-001 kept per-person state local when there was one machine per
person. There is now more than one working directory per person.

This does not mean reverse DEC-001. The likely shape is that per-person state stops being
per-*directory* — a machine-local home (`~/.boss/`, which already exists and already holds the
registry and `removed/` backups) keyed by project, rather than a file inside a worktree that a
worktree cannot see. That keeps the teammate boundary exactly where DEC-001 put it while surviving
a second checkout. **It is a DEC, and it is the highest-value item in this record.**

## Finding 3 — RC makes absence-nudging possible, and the catalog says don't

`src/orientation.js` states the humane constraint as inherited law:

> *a CLI can only ever run while the founder is HERE. It can never observe an absence in real time.
> So the re-entry read does not fire AT someone who is away — it fires when they COME BACK, which
> is both the only observable moment and the only kind one.*

That was a statement about a **capability**, and it is now false. With RC connected,
`PushNotification` reaches the founder's phone. BOSS could, for the first time, nudge someone who
walked away.

`library/deceptive-patterns.json` already catalogs where that road goes. The decision needs writing
down *before* anyone has a reason to build it, because the reason will be a good one — a long build
finished, a PR went red, a deploy failed — and by then the constraint will be an obstacle rather
than a principle. **Proposed default: BOSS never initiates a push. If the founder asked for a
long-running task and it finished, the host's own notification is the host's business.**

## Finding 4 — `/close` rewrites RESUME, and there can now be two writers

`/close` **rewrites** `docs/RESUME.md`; `/log` appends. With RC serving several sessions off one
repo (or a phone session and a laptop session both open), two `/close` runs land on one file.

In a founder project RESUME is tracked, so this surfaces as a merge conflict in the file they are
told to read first — ugly, but honest. **BOSS's own repo has the worse version of this and has paid
for it four times** (RESUME.md is gitignored there, so concurrent writes produced silent duplicates
rather than conflicts). The founder-facing fix is probably one sentence in `/close`, not a locking
mechanism.

## Finding 5 — the vocabulary gap widens

`/teleport` (pull a web session into the terminal with full history), `/resume`, `--continue`,
`/clear`, `/background`. A founder using RC will meet all of these. BOSS names none — see
[[IDEA-078]]. The `/resume` name collision with `docs/RESUME.md` gets sharper, not softer, when
sessions are genuinely being resumed across surfaces.

## What this record does NOT propose

- No sync layer, no server, no hosted BOSS. See the note above.
- No mobile UI. `boss board --html` exists and is a projection; whether it is a phone answer is a
  separate question with n=0 behind it.
- **No new skill.** EVID-001's mandate holds: 48 before, 48 after.

## Priority (proposed)

1. **The DEC on per-person state** (Finding 2) — a real defect with a mechanical cause, and the
   only one that makes BOSS actively worse than silence.
2. **The DEC on push** (Finding 3) — free to write now, expensive to argue later.
3. **[[IDEA-077]]** — now the only orientation channel that works off-terminal.
4. Findings 4 and 5 — one sentence each, whenever the surrounding files are next touched.

## Related

- [[IDEA-077]], [[IDEA-078]], [[IDEA-080]] — RC raises the stakes on all three.
- DEC-001 — the decision Finding 2 has to be argued against, not around.

## Closed (2026-09-13)

Ajesh: *"i dont think there is anything more on idea-081 right?"* — right. Priority 1 → [[DEC-015]]
(per-person state keyed to a person). Priority 2 → [[DEC-016]] (never initiates contact with an
absent founder, with a test). Priority 3 → [[IDEA-077]] shipped. Finding 4's worse half — BOSS's
own untracked RESUME producing silent duplicates — closed the same day by [[IDEA-087]] (RESUME and
the devlog are tracked now; two writers get a merge conflict, which is the honest version). The
founder-facing sentence in `/close` and Finding 5's vocabulary gap are one line each and belong to
[[IDEA-078]] when it revives. Nothing here is a new id.

