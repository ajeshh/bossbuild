---
id: IDEA-100
type: idea
owner: mentor-architect
status: shipped (the /log pilot, 2026-09-13 — body +4%, the newest-first invariant now code; the other four do not convert on that number)
gist: BOSS ships 48 skills and 0 executable scripts. That is not wrong by construction — judgment belongs in prose — but a skill whose steps are a fixed recipe the agent re-derives every run (append a dated entry, count, compare dates) is a script wearing a skill hat, and it costs tokens and varies each time. The test is per skill, not a direction; the pilot is /log.
proof: stages/L1-mvp/template/.claude/skills/log/scripts/entry.js
proof_note: >
  Nothing built; the pilot (/log script) has not been written. The measurement that would prove it - words loaded on invoke before/after, and whether the devlog entry format stopped varying - does not exist yet.
created: 2026-09-12
relates: RVW-099, IDEA-085, SESSION-2026-09-12-agentic-practice-since-the-harness-sweep
---

# IDEA-100 — recipe-shaped skills become scripts (a per-skill test, not a direction)

> Seed: Ajesh, 2026-09-12 — *"is it better to have more scripts than skills?"* — after Galster et al.
> (arXiv 2602.14690, RVW-099) found that *"Skills predominantly rely on static instructions rather than
> executable scripts,"* and BOSS measured itself: **48 shipped skills, 0 executable scripts.** The 12
> skills that carry extra files carry markdown or HTML templates. BOSS's executable half is its hooks,
> `npm run check`, and the `boss` CLI — not its skills.
> Decision the same day: **file it, don't build it** — one concern per change; the description trim
> (v0.316.0) lands first and gets used once.

## The answer to the question, as recorded

Scripts are not better than prose. **Prose is the right form for judgment** — `/vet`, `/canvas`,
`/interview`: the steps change with the input, and a script would have to encode a decision tree it
cannot see. **Scripts are the right form for a fixed recipe** — the agent would otherwise re-derive
the same grep / count / append / compare on every run, spending tokens to reach a result a script
reaches identically, and occasionally reaching it differently. The host loads a SKILL.md's body only
on invoke, so a prose recipe costs nothing until it runs; when it runs, it costs the whole body.

So the test is per skill: **would a careful engineer, asked to run this by hand a fifth time, have
written a script by the third?** If yes, the skill keeps its prose for the judgment (when to run it,
what to do with the result) and calls a small zero-dep script for the recipe.

## Candidates (from reading the 48, not from running them — unverified until the pilot)

| Skill | Recipe-shaped part | Judgment part (stays prose) | Read |
|---|---|---|---|
| `/log` | append a dated entry to `docs/devlog.md` in the house format | what landed / what surprised you | **pilot** — smallest, clearest |
| `/close` | the `/log` append + the RESUME state stamp | the state read, next tasks, open decisions | after the pilot; reuses `/log`'s script |
| `/smoke` | run the stack-configured command, report alive/dead | none — already the closest to a script; may just *be* one | measure whether the body adds anything the command doesn't |
| `/cost-review` | sum `.boss/cost-log.jsonl` by FEAT/user/cohort, compare to budget | the surprises, the review prose | the arithmetic is a script; the review is not |
| `/board` | already backed by `boss board` (CLI) — the skill is the judgment layer over it | — | the model to copy, not a candidate |

Everything else read as judgment-shaped on first pass. `/extract`, `/judge-traces`, `/drift-deep` are
readers, not recipes — the reading *is* the product.

## What must NOT be concluded

- Not "convert the shelf." Five candidates in 48 is the finding; a direction would be the mistake.
- Not "scripts in `src/`." A skill's script lives in its own skill directory and ships with it; `src/`
  stays the zero-dep CLI. The host runs the script through Bash, which means the skill's `allowed-tools`
  (if any) has to say so — check what the shipped skills declare before assuming.
- Not a new mechanism. `/board` over `boss board` is already the pattern; this names it and applies it
  to a handful of verbs that reached for prose because prose was the only tool the skill had.

## The pilot — 2026-09-13, measured

Built: `skills/log/scripts/entry.js` (zero-dep; seeds the devlog, inserts newest-first, four tests;
`boss sync` walks skill subdirectories so it ships like `templates/`). Steps 1–2 of the skill became
one command with the format block kept as the reference the model fills from.

| | before | after |
|---|---|---|
| SKILL.md body (words, loaded on invoke) | 1,140 | 1,186 |
| the recipe (find the header, insert above the first `##`, seed if missing) | prose the model re-derives | code, tested |

**No token gain — the body grew 4%**, because the command needs its flags named, the fallback for a
host without Node, and the format still has to be shown. **The gain is the invariant:** newest-first
under one header, which prose stated and could not hold (the failure mode is an entry at the bottom
of a newest-first file — the one nobody reads). That is a correctness gain, not a size one.

**Decision on the other four, on this number:** none convert. The only reason to script is an
invariant that keeps breaking, and `/close` already gets this one by calling `/log`; `/smoke` is a
one-line command already; `/cost-review`'s arithmetic has n=0 cost logs to run on; `/board` is the
CLI. This record closes with the measurement written down — exactly the exit it named.

## Re-open condition (as written)

After v0.316.0 has been used in at least one real session: build `/log`'s script, measure the body
before/after (words loaded on invoke, and whether the entry format stopped varying), and decide the
other four on that number. If `/log` shows no gain, close this with the measurement written down.
