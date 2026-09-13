---
id: IDEA-095
type: idea
owner: coder
status: shipped (v0.296.0 → v0.300.0 — matrix green on six cells, README/site claim three OSes, exec-form hooks; `engines` floor left as a one-line follow-up)
gist: BOSS runs on Linux already and is wrong on Windows in four places, all the same shape — a path built with `join()` then handled as a `/`-string. Nothing proves either, because there is no CI. Mechanism first, claim second.
program: host-and-portability
proof: .github/workflows/ci.yml
proof_note: >
  The matrix ran three times on 2026-09-11: 22 red → 1 red → all six green, Windows smoke
  included. README and site now claim the three OSes. The record closes on the exec-form decision
  below; everything else is done.
created: 2026-09-11
relates: IDEA-006, IDEA-096, IDEA-032
---

# IDEA-095 — cross-platform: Windows and Linux

> Seed: Ajesh, 2026-09-11 — *"how do we make boss compliant with windows, linux"*

## The read, in one line

**Linux: already fine. Windows: four real bugs, one of them silent and bad. Both: unproven.**

The audit was done by reading, not by running — no Windows box was touched. Everything below is a
hypothesis until the matrix in *Plan* step 2 goes green.

## What was checked (2026-09-11, v0.295.0)

`src/` is Node built-ins only. Paths go through `join()` / `homedir()`; `~/.boss` is
`join(homedir(), '.boss')` ([paths.js:22](../../src/paths.js)). Git is called with `execFileSync`
(no shell). The browser opener already branches three ways ([cli.js:655](../../src/cli.js)). The
shipped hooks are `.js` under `node`; no `.sh` anywhere in the shipped tree. `engines: node >=18`.

That is why Linux needs nothing. The README's only OS-specific line is `brew … # macOS`, and the
npm line above it already covers Linux.

## Windows — the defects, all one shape

A path is built with `join()` (backslashes on Windows) and then treated as a `/`-separated string.

| Where | What breaks | Severity |
|---|---|---|
| [records.js:502](../../src/records.js) `f.slice(f.lastIndexOf('/') + 1)` | `lastIndexOf` returns -1, the "basename" is the full path, `^IDEA-\d+` never matches. **Next-id allocation silently restarts → duplicate ids.** Line 505 `f.startsWith(r + '/')` also never matches, so the prose scan for reserved ids is skipped. | 🔴 silent data defect |
| [scaffold.js:206](../../src/scaffold.js) same `lastIndexOf('/')` | `isTextFile` gets a full path. Works by accident for `.md` (extension check); **dotfiles like `.gitignore` miss `{{placeholder}}` substitution.** | 🟡 |
| [cli.js:1336](../../src/cli.js) `p.path.startsWith(process.cwd() + '/')` | The "you're one level above your project" hint never fires. | 🟢 cosmetic |
| ~~[remove.js:41,134](../../src/remove.js), [managed.js:56](../../src/managed.js)~~ | **Re-examined 2026-09-11: not a bug.** Both sides of every comparison are `relative()` or `join()` output on the same OS, so they agree. Would only matter for a `.boss/managed.json` written on one OS and read on another. Left alone. | ⚪ downgraded |

**Do not "fix" these — they are correct as-is:** [ladder.js:67](../../src/ladder.js) and
[loop-runtime.js:187](../../stages/L0-quickstart/template/.claude/hooks/lib/loop-runtime.js) split
on `/` because the input is a **config pattern string**, not a filesystem path; both `join()` the
segments afterwards.

## Two things to verify on a real box, not by reading

- **The hook wiring.** [settings.json:43](../../stages/L0-quickstart/template/.claude/settings.json)
  runs `node "$CLAUDE_PROJECT_DIR/.claude/hooks/conscience.js"` — POSIX shell syntax. Claude Code on
  Windows requires Git Bash and is believed to run hooks through it, so this likely works. If a
  founder's setup routes hooks through cmd/PowerShell, **the conscience never fires and never says
  why** — a silent failure in the one thing that makes BOSS BOSS. If it fails: a shell-neutral form
  (`boss hook conscience` as a subcommand) beats escaping for two shells.
- [team.js:19](../../src/team.js) shells `gh api user` / `git config` through `execSync` — the one
  string-through-shell call. Should be fine; check it.

Dev-only, not shipped: `npm test` uses `node --test test/*.test.js`. cmd.exe does not expand globs
(Node ≥22 expands them itself). Expect this to be the first red on Windows CI, and it is not a
founder-facing bug.

## Plan

1. ~~Capture.~~ This record.
2. **Prove before claiming.** Add `.github/workflows/ci.yml`: matrix `ubuntu-latest` /
   `windows-latest` / `macos-latest` × Node 18 + 22, running `npm test` plus a scaffold smoke —
   `boss new` into a temp dir → `boss status` → `boss records`. It goes red on Windows first, which is
   the point. There is **no CI in this repo today**; the release gate runs only on Ajesh's Mac.
3. **Fix the four sites.** One helper, not four ad-hoc edits: `basename()` from `node:path` for the
   two `lastIndexOf('/')` sites; a `toPosix(rel)` (`split(sep).join('/')`) applied where
   `relative()` output becomes a key; `startsWith(cwd + sep)` at cli.js:1336. One commit each.
4. **Test the hook path on Windows** — throwaway project, `claude`, one prompt, confirm the conscience
   fires. Only then decide about a shell-neutral hook form.
5. **Copy.** README install block: *"macOS, Linux, Windows via npm; Homebrew on macOS."* VERSION bump
   + CHANGELOG entry.

Step 2 before step 3, deliberately — the matrix is the checker; the fixes are what it checks.

## Refusals

- **No `process.platform` branches in `src/` beyond the one that exists.** The bugs are string
  handling, not platform behaviour; `node:path` already knows the answer.
- **No "Windows supported" line in the README before the matrix is green.** A claim without a checker
  is the pattern this repo keeps catching in itself.
- **No WSL-only answer.** "Use WSL" is a Linux answer wearing a Windows hat; a founder on Cursor for
  Windows is not in WSL.

## Found tasks (emergent list — kept here per CLAUDE.md rule 3b)

- [x] CI matrix — `.github/workflows/ci.yml`, ubuntu/windows/macos × Node 22/24 (v0.296.0)
- [x] `npm run test:ci` — the clean-checkout-honest subset; `npm test` itself is red on a clean
      clone (`check-refs` → gitignored docs, `check-dogfood` → `.boss/`) and that is IDEA-087's call
- [x] `scripts/smoke-cli.js` — node-only smoke, exercises the exact defect, prunes its registry row
- [x] records.js basename + `sep` fix
- [x] scaffold.js basename fix
- [x] cli.js:1336 `sep` fix
- [x] ~~toPosix at the relative() boundaries~~ — re-examined, consistent, not a bug (see table)
- [x] citations.test.js 1-in-10 `index.lock` flake — retry on both add and un-stage
- [x] CHANGELOG 0.296.0
- [x] Pushed; three runs. **Run 1: 22 red on Windows** in three clusters the reading audit had
      NOT predicted — CRLF checkouts (both frontmatter parsers + 32 line readers, v0.297.0),
      `expandGlob` matching a `/`-regex against `\\` paths (the "correct as-is" call was half
      right), and `HOME` not redirecting a Windows home in tests. **Run 2: 1 red** — three release
      gates guarded `main` with `import.meta.url === \`file://${argv[1]}\``, never true on Windows,
      so they exited 0 having run nothing (v0.298.0 + `test/main-guard.test.js`). **Run 3: green ×6.**
- [x] README / site: "macOS, Linux, Windows" — earned by run 3
- [x] Hook-path question — **answered from Claude Code's docs, not a box, and it is a real gap:**
      native Windows without Git for Windows is supported; hooks then run via PowerShell, where
      `$CLAUDE_PROJECT_DIR` is an undefined PS variable → the conscience runs
      `node "/.claude/hooks/conscience.js"` → silent. Fix = exec form, Claude Code ≥ 2.1.139.
- [x] **DECIDED and shipped v0.300.0 — exec form.** (was: switch the shipped `settings.json` to exec form?) `{"command":"node",
      "args":["${CLAUDE_PROJECT_DIR}/.claude/hooks/conscience.js"]}` — fixes Windows-without-Git-Bash,
      sets a floor of Claude Code 2.1.139 (current 2.1.268; native installs auto-update). Below the
      floor, `args` is ignored and bare `node` runs → a visible hook error, not a silent one.
      **Ajesh's own machine is 2.1.132** — update it either way. `boss sync` would carry the change
      to existing projects as a reviewed diff.
- [ ] Node 18/20 dropped from the matrix (both EOL); `engines` still says `>=18`. Decide whether
      `engines` follows, in its own release.

## Closed — 2026-09-13

All six matrix cells green, three OSes claimed, exec-form hooks shipped v0.300.0 (the record's one
decision, landed by a peer session 2026-09-11 and never ticked here). The `engines` floor is a
one-line release of its own when Node's EOL bites; not a reason to hold this open.

## Capture log
- 2026-09-11 (later) — Ajesh: *"lets execute the easy tasks and then slowly scale the rest."* Shipped
  as v0.296.0: matrix, `test:ci`, smoke, three fixes, flake retry. First finding on the way: `npm
  test` had never been run on a clean checkout and fails at step one there. Item 4 downgraded.
- 2026-09-11 — captured from Ajesh's question; audit by grep over `src/`, `bin/`, the shipped
  hooks and `settings.json`. No Windows machine involved. Same conversation produced IDEA-096 and
  a dated correction to IDEA-006.
