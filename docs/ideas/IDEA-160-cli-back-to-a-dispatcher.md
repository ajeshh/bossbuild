---
id: IDEA-160
type: idea
kind: capability
owner: product-lead
status: exploring
created: 2026-10-07
proof: none
proof_note: a move, not a new file — done is `wc -l src/cli.js` near 1,300 and no `cmd` handler body left in it beyond dispatch
relates: IDEA-150, IDEA-136, IDEA-120
gist: cli.js goes back to being the dispatch line — each command handler moves into the module it already calls, one per commit, with no change in behaviour.
---

# IDEA-160 — cli.js back to a dispatcher

Ajesh, 2026-10-07: *"as boss's own code base has grown, im wondering if we need to rearchitect or
refactor any part of boss to continue improve."* BOSS's own code, not what it ships.

## Measured first (2026-10-07)

**No rearchitecture.** `src/` is 15k lines across 45 files, still zero dependencies. The decisions
that get dearer to reverse (ENGINEERING.md §2) are holding, and none is under strain. The known
bends were each examined in IDEA-136 and closed without a bug: the `board ↔ playbook ↔ design` cycle
is a stated exception (F1), and the four missing helpers merge only with a change in behaviour (F3).
The big renderers are big because they render pages; the size limit stays deferred.

**One rule has stopped holding.** ENGINEERING.md §3 says *"`cli.js` shrinks as it's touched"*
(IDEA-150 D3). It grew instead:

| Date | `src/cli.js` lines |
|---|---|
| 2026-08-20 | 1,209 |
| 2026-09-11 | 1,743 |
| 2026-10-04 | 1,937 |
| 2026-10-07 (IDEA-155 landed) | 2,242 |

87 of 707 commits in 60 days touched it, more than any other file, and it is where concurrent
worktrees collide. A rule with no runner (the 🔎 heuristic: checkers state intents they don't
enforce). No gate is proposed: the collisions cost BOSS's own sessions, and no founder has hit a
bug from them, so they don't meet the bar for a new gate. The fix is to do the moves.

## The rule for every slice

1. **One handler per commit**, moved into the domain module it already calls. `cli.js` keeps the
   dispatch line.
2. **No change in behaviour.** The CLI tests run `bin/boss`, so they are the contract and pass
   unchanged. Plus rule 6's `/tmp` exercise of the moved command.
3. **Imports still point down.** A moved handler never imports `cli.js`; what it needs from there
   moves down first (S0).
4. **Move as-is, never merge on the way.** `readStamp` throws on a bad manifest and
   `registry.readProjectStamp` returns null. Each caller relies on its own behaviour (F3), so they
   stay two functions.
5. Land between peers' work, not across it: before each slice, check the open worktrees for
   `src/cli.js` (`git -C <wt> diff --name-only main...HEAD`).

## Tasks

- [x] **S0** · Move the helpers the handlers share down out of `cli.js` (2,242 → 2,193). `STAMP`/
  `readStamp`/`writeStamp` → `registry.js` beside `readProjectStamp` (two readers kept, header says
  why); `stageVars` → `scaffold.js`; `commitGuardLine` → `hooks.js`; `fail`/`failJson`/
  `failNotAProject` → new `fail.js`, which owns the `--json` switch (`setJsonErrors`, set once by
  `run()`). `claudeInstalled` stays: only `new`/`adopt` use it, so it moves with them (Q3).
  Verified: 822 tests; `/tmp` new, status, sync, adopt, the not-a-project hint, and `board --json`
  outside a project byte-identical to main.
- [ ] **S1** · `cmdSync` (~171 lines) → `sync.js`. This is the doc's own example.
- [ ] **S2** · `cmdRemove` (~112) → `remove.js`
- [ ] **S3** · `cmdStatus` (~95) and its `print*` helpers → see Q2
- [ ] **S4** · `cmdUnlock` (~165) → see Q3
- [ ] **S5** · `cmdNew` (~108) → see Q3
- [ ] **S6** · `cmdAdopt` (~186) → see Q3
- [ ] **S7** · ENGINEERING.md §3: the new line count and the map's layer table; the "shrinks as it's
  touched" line says the handlers left, not that they will.

**Done when:** `cli.js` is around 1,300 lines or fewer, `npm run check` is clean, and every moved
command passes its `/tmp` exercise.

## Open questions

- ~~**Q1**~~ · Answered in S0: `src/fail.js`, a state reader (it reads the registry), owns the switch.
- **Q2** · Is `cmdStatus` a renderer (beside `orientation`/`readiness`) or does it need a home of
  its own? Read its `print*` helpers before choosing.
- **Q3** · `new`/`adopt`/`unlock` all install a stage. `scaffold.js` sits in the state-reader layer
  and doesn't print. One new domain module (`install.js`) for the three, or keep them apart?
  Fewer moving parts argues for one.

## Found while building

- **`boss id` offers a number a peer's worktree already holds.** Reproduced 2026-10-07 10:36 from the
  main checkout: `node bin/boss id` answered `IDEA-159` while `work/idea-159` held
  `docs/ideas/IDEA-159-the-status-line-in-claude-code.md` in a commit (53da856a). The behaviour
  `test/id-sees-open-worktrees.test.js` pins does not happen here. Not this record's concern: it
  needs its own id and a reproduction in a test.
