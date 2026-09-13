---
id: IDEA-055
type: idea
owner: product-lead
status: deferred (axis landed in pieces — v0.179.0, v0.191.0, v0.262.0, v0.231.0; facets 2 and 4 re-open on an OBSERVED session)
gist: A usability pass over the whole CLI: the words are great and the pixels do almost none of the work. Re-graded by EVID-001 into the orientation-and-progress axis — knowing where you are, like a train line.
proof: src/ui.js
proof_note: `src/ui.js` is the colour/glyph layer this record proposed and it exists. EVID-001 RE-GRADED the record past that scope to the orientation-and-progress axis, and that half is no longer unbuilt: `boss status`'s Already-built line (v0.179.0) and the v0.191.0 board pass (correct columns, per-card gist, Parked, `boss board <ID>`) both land on it. Three EVID-001 facets remain — see the 2026-08-20 re-grade at the foot of this file.
created: 2026-07-23
source: Ajesh, 2026-07-23 — "do a usability assessment of the boss tool and see what could be
  improved… make a list of all things it could help further make a better experience overall. also
  with the text formatting assess bold, colors, hints, helpers and all."
---

# IDEA-055 — CLI usability + visual encoding (the words are great; the pixels do almost none of the work)

> **RE-GRADED 2026-07-23 by real external evidence ([[EVID-001]]).** This idea was filed as *"polish, not
> the risk… low-cost housekeeping… none of this moves the riskiest assumption."* **A real non-Ajesh founder
> just called this same gap the reason BOSS "isn't ready."** The *what* was right; the *weight* was wrong.
> The founder's ask is broader than color/glyph encoding — it's **orientation + progress + focus** as a felt
> experience ("a train line where I can see where I am and that I'm moving"), which subsumes this idea's
> visual-encoding layer and adds a **positive/headway register** BOSS entirely lacks. Do **not** re-grade this
> into a build queue from n=1 stated-pain (BOSS's own "loud ≠ important" rule: request → evidence, never a
> spec). The re-grade is of *priority and framing*, not of the "capture, don't build" discipline. When a
> build is earned, the mandate is **compose + subtract the existing surface into one "you are here," never add
> a 23rd skill** — the founder's fear is *bloat*, and answering it with more surface is the trap. See
> [[EVID-001]] for the decomposed pain and the thesis-lands-execution-doesn't split.

## The seed

A usability pass over the whole CLI surface — ran every read-only command live (`boss`, `map`, `status`,
`board`, `insights`, error paths) against the rendering layer (`src/cli.js`, `map.js`, `insights.js`,
`conscience.js`, `modes.js`), the first-touch README, and the conscience control surface.

## The one-line finding

**BOSS is unusually thoughtful about *voice* and *when to speak*, and almost the entire gap is in *visual
encoding and wayfinding* — the layer between "the right words" and "the founder actually sees them."**
"Calm" is currently being achieved partly by *under-using* color and weight, which reads to a scanning
founder as *"I can't tell what worked, what's a warning, or what to do next."* The fix is not louder; it's
*legible*. The voice restraint is an asset and must survive the change.

## Text formatting — the direct read (colors · bold · glyphs · hints · helpers)

- **Color is monochrome-plus-gray.** The only ANSI code anywhere is `dim` (`\x1b[90m`), defined
  **byte-identical three times** (`src/cli.js:19`, `src/brain.js:31`, `src/conscience.js:328`). `map.js`
  and `insights.js` use no color at all. Consequences seen live:
  - A warning looks exactly like a success — `⚠ over-fire smell` / `⚠ untested` render in the same
    default color as `✦ Created`. The **glyph is the only signal**, and glyphs are easy to skim past.
  - Errors have no visual distinction — `fail()` (`src/cli.js:575`) prints `boss: <msg>` in plain text to
    stderr; no red, no `Error` frame. In a busy terminal it disappears.
  - Success has no pop — `✦ Unlocked MVP mode` competes for attention with everything around it.
- **No bold anywhere in the CLI.** Section headers ("Available now", "Anytime", "conscience state") are
  distinguished only by indentation. The README leans on `**bold**` heavily (and it renders); the actual
  tool is visually flat — nothing anchors the eye.
- **Glyphs carry 100% of the semantic load, and they're overloaded.** `·` = stale AND missing AND
  unopenable. `⚠` = empty AND untested AND over-firing. `✓ ⚠ ·` differ only subtly at a glance. And
  **nothing ever explains the legend** — a founder must infer `⊘` = retired, `·` = dormant. Glyphs also
  don't render on every font and convey no meaning to a screen reader.
- **No `NO_COLOR` / `FORCE_COLOR` support.** `dim` is TTY-guarded (degrades when piped — good), but the
  de-facto `NO_COLOR` standard is ignored.
- **Hints/helpers are strong in spots, absent in others.** The `Next:` blocks after `boss new`/`boss adopt`
  (`cli.js:112`) are the best pattern in the tool — three next steps taught inline. Not reused: `boss board`
  and `boss insights` **end on philosophy, not a next action.** `boss map`'s "One unlock away" preview is
  excellent — but it **truncates every gloss at 64 chars mid-word** (`map.js:41`), routinely cutting the
  half that says what the skill does. No `boss help <command>`. Unknown commands **silently dump the full
  manual** with no "unknown command 'x'" line first (`cli.js:599` default case) — the user never learns
  they typo'd. The bare `boss` help is a 20-line wall at uniform weight (`boss new` == `boss brain forget`).

## Two real inconsistencies caught live

1. **BOSS's own dogfood is 114 versions behind its own pin.** `boss status` here: `pinned 0.6.0 / current
   0.120.0` + `⟳ newer practices available`. The flagship self-hosted example is maximally drifted — it
   undercuts the "sync keeps you current" story in the one place a skeptic looks first. (Housekeeping, but a
   bad look in the demo.)
2. **`board` and `insights` disagree on the same number.** `board` says `1 building`; `insights` says
   `4 building` for the same project. Different projections (board reads FEAT frontmatter status; insights
   counts `FEAT-*.md` files), but to a user they look like they should match.

## The punch-list (prioritized)

**P0 — cheap, high-impact, aesthetic-preserving**
1. **Extract one `src/ui.js`** — `dim` + `bold`, `ok` (green ✓), `warn` (yellow ⚠), `err` (red), all
   `NO_COLOR`/TTY-aware. Kills the 3× duplication; lets the palette evolve coherently. (Zero-dep: raw ANSI
   in one module — Principle 4 intact.)
2. **Color the three states that matter** — success `✦` green, `⚠` yellow, `fail()` red with a real `Error`
   frame. One accent per state, not a rainbow. Stays calm; stops being invisible.
3. **Fix the unknown-command case** — `boss: unknown command 'x' — did you mean 'board'?` *before* the help,
   to stderr, exit 1.
4. **Bold the CLI section headers** so the eye has anchors.
5. **Reconcile the board-vs-insights "building" count** (or label the difference explicitly).

**P1 — wayfinding**
6. **Group the `boss` help** into Start here / Daily / When you're deeper. The 20 flat lines are the single
   biggest first-run overwhelm.
7. **Add a symbol legend** — a one-line footer on `map`/`board`/`insights`, or `boss help symbols`.
8. **Stop truncating map glosses mid-word** — wrap a second line for the installed set, or cap at a sentence
   boundary, not 64 chars.
9. **End every surface with a next action, not philosophy** — mirror the `Next:` blocks on `board`/`insights`.
10. **Add `boss help <command>`** for per-command detail.

**P2 — the calm-tool paradox**
11. **`boss status --conscience` is the busiest screen in the tool** (pause + mutes + cohort + fires + per-loop
    + overrides, all at once) — for the feature meant to feel calm. Give it a one-line summary with
    `--verbose` for the full dump (progressive disclosure — the principle the skills already follow).
12. **Clarify the two command languages** — a newbie can't tell `/boss` is typed *in Claude* and `boss board`
    is typed *in the shell*; `boss map` mixes both namespaces unmarked. A tiny `(in Claude)` / `(in terminal)`
    cue removes a real early stumble.
13. **Fix BOSS's own pin drift** (housekeeping; sync the flagship repo).

## Guardrails (so the fix doesn't become the problem)

- **Restraint is the asset, not the accident.** No rainbow, no emoji-spam, no progress bars. One accent per
  semantic state (ok/warn/err), bold for structure, gray for the aside. If it doesn't help a scanning
  founder answer "did it work / is this a warning / what now?", it doesn't ship.
- **Color is enhancement, never the only channel.** Keep the glyph *and* the word — color is the third layer
  for the sighted-at-a-glance case, so `NO_COLOR` / a plain pipe / a screen reader loses nothing.
- **Zero-dep holds** — no `chalk`/`kleur`. Raw ANSI in one `src/ui.js`, TTY- and `NO_COLOR`-aware.
- **~~This is polish, not the risk.~~ Superseded 2026-07-23 (see the RE-GRADED note above / [[EVID-001]]).**
  The original line read: *"none of this moves the riskiest assumption — only founder contact does… low-cost
  housekeeping, not roadmap priority."* Founder contact then happened, and it named **this** as a core reason
  BOSS "isn't ready." So the honest line now: this *is* on the demand axis, not beside it — orientation is part
  of the offering a real founder is asking to see mature. The discipline that still holds is **capture-don't-
  build from n=1** and **compose-don't-add** when a build is earned — not "this is cosmetic."

## Relationships

- **Direct sibling of [[IDEA-018]]** (wayfinding + `boss map` + the generated cheatsheet) — this is the
  *visual-encoding* half of the same "can the founder find their way" problem IDEA-018 opened.
- **Twin of [[IDEA-035]]** (wayfinding-drift) — the board-vs-insights count mismatch and the 114-version pin
  drift are exactly the prose-vs-reality drift IDEA-035 watches for, surfaced in the CLI instead of the docs.
- **Voice-bound** — every string change routes through `voice-keeper`; the *encoding* changes (color/weight)
  are the designer's call. The two must not fight (loud color undercutting a restrained sentence is
  voice-mode bleed in a new channel).

## Recommendation

**Do P0 (1–5) as one small release** — an afternoon, aesthetic-preserving, closes most of the "I can't tell
what happened" gap. **P1 next when the docs/wayfinding surface is open** (rides IDEA-018). **P2 as earned.**
Run the whole thing past `designer` (encoding) + `voice-keeper` (any changed strings) before shipping.

## Implementation notes (2026-07-23) — built, 2 commits, VERSION bump pending

Built the **entire punch-list (P0+P1+P2 code) + a wave 2** responding to [[EVID-001]], on Ajesh's "run the
full idea and complete it" + "continue expanding." Two commits on `main`, **src-only** (see the concurrency
note): `dd70947` (wave 1) + `f3fa1e4` (wave 2).

**Wave 1 (`dd70947`) — the punch-list, all 13 items:**
- **`src/ui.js`** (NEW) — the one styling module: `dim/bold/ok/warn/err`, zero-dep raw ANSI, TTY + `NO_COLOR`
  + `FORCE_COLOR` aware, specific close codes so spans nest. Replaced the `dim` defined 3× byte-identical.
- Colored the three states (success green · warn yellow · error red `Error` frame); bolded section headers
  across map/board/status/insights/brain/team; unknown-command → did-you-mean (Levenshtein), exit 1.
- Grouped `boss help` (Start here / Everyday / Conscience / Keeping current) + `boss help <command>` +
  `boss help symbols` legend; word-boundary map glosses (no mid-word cuts); `(in Claude)`/`(in terminal)` cues.
- `boss status --conscience` progressive disclosure (calm summary + `--verbose`).
- **Reconciled board vs insights "building"** — insights now reads the same `collectBoard` projection, so they
  can never disagree again (was: insights called every FEAT file "building," incl. shipped ones).
- **Reviewed by `designer` + `voice-keeper`** (per the recommendation) — no ship-blockers; ~8 refinements
  applied ("level up"→"climb a rung", gray-⚠→warn, `●`/`▸` de-dup, "waiting" reconcile, performed-warmth trim).

**Wave 2 (`f3fa1e4`) — the orientation home (EVID-001 facets 1, 3, 7):**
- Shared `renderLadder()` drives BOTH `boss map` and `boss status` — one "you are here" train line.
- **`boss status` is now the orientation home**: leads with the ladder + **`▸ Building now:`** (the one thing
  in flight) + **`✓ Recent headway:`** (last shipped FEAT + how long ago — the *positive register* BOSS
  lacked), then the version metadata. Empty project → "Nothing in flight yet — /boss or /triage."
- `boss board` gained a **`▸ on now:`** anchor at the top (the current build isn't buried below a wall of
  Captured cards on a long board).

**Discipline held:** zero new skills (compose + subtract); gate **129/0** throughout (conscience runtime
untouched); `/tmp` fresh-scaffold verified incl. empty-state; registry pruned.

**⚠ Deferred / open:**
- **VERSION + `package.json` + `registry/CHANGELOG.md` bump NOT done** — a parallel session held those files
  uncommitted mid-release (`/trust` 0.127.0) all through this work; bumping would have clobbered it. **Next
  session: once 0.127.0 lands, bump to the next minor + add a CHANGELOG entry for these two commits.**
- **Not built (correctly — needs real evidence, not n=1 overnight adds):** EVID-001 facet 2 (roadmap
  alignment as one view), facet 4 (bloat/focus guard — the `focus-loop` already partly covers), facet 5
  (rearchitect-timing prompt). These are the rest of the "train line" and want their own evidence-gated pass.
- **Designer nit left:** `🔇` (muted-moments) is the one full-color emoji breaking the otherwise-monochrome
  palette — swap to a monochrome mark/label when next in `conscience.js`.
- **#13 pin-drift** (BOSS's own repo pinned 0.6.0) still stands — housekeeping, unrelated to the CLI code.

## RE-GRADE #2 — 2026-08-20: the axis is being built, one accident at a time

Asked *"any that now are a great fit for where we are"*, this record came up — and re-reading it
against what actually shipped produced a more uncomfortable answer than "yes, build it."

**What has landed on the re-graded axis, without anyone deciding to build it:**

| Release | What it did | EVID-001 facet |
|---|---|---|
| v0.179.0 | `boss status` Already-built line | 1 — *"hard to gauge where I am"* |
| v0.191.0 | The board classified **12 of 31 cards into the wrong column**, fixed | 1 + 3 |
| v0.191.0 | `gist:` — one line per record, so a card is a reminder and not just a name | 3 — *"I forget what feature I'm building"* |
| v0.191.0 | **Parked** — decided work leaves the flow | 4 — *bloat / focus* |
| v0.191.0 | `boss board <ID>` · `--detail` · hover on `--html` | 1 + 3 |

**Still not built, and still correctly gated:** facet 2 (roadmap alignment as one view), facet 5
(rearchitect-timing prompt), and the wider half of facet 4 (the bloat guard beyond folding parked
work away).

🔴 **The observation worth more than the status change.** [[EVID-001]] said **CAPTURE + RE-AIM, BUILD
NOTHING YET** — hold until a second signal or until that founder moves from `stated-pain` to
`observed-behavior`. **No second signal has arrived.** And yet two releases have now put real work on
the exact axis the hold was about. Neither was a violation in the moment: v0.179.0 was a status line,
v0.191.0 was a **bug fix** the founder asked for directly. But the net effect is that *the held axis
is being built incrementally, by things that individually don't look like building it.*

That is not an argument to stop — the v0.191.0 work was a defect and defects get fixed. It is an
argument to **stop calling this record held.** A hold that erodes through small legitimate work while
its status still reads `exploring` is a hold that has stopped describing reality, which is the same
failure this release just fixed one level down. Hence `building`, honestly, with the remaining facets
named as the gated part.

**What this does NOT change:** the compose-and-subtract mandate. Every piece above **subtracted or
corrected** — no new skill, no 23rd surface; the parked lane made the board *smaller*. That constraint
is what kept the erosion harmless, and it is the thing to keep, not the status word.

**Closed from the punch-list this pass:** **#13 pin-drift** — BOSS's own `.boss/manifest.json` was
pinned at `0.6.0` and still carried a `retired` stamp; fixed alongside this re-grade. Also worth
noting the same file named **four agents deleted in v0.189.0**, which #13 predates and never caught.

## Re-grade 2026-09-09 — the argument for `building` has been overtaken by its own success

**The v0.191.0 re-grade chose `building` for a good reason and it no longer holds.** Its case was:
*"a hold that erodes through small legitimate work while its status still reads `exploring` is a
hold that has stopped describing reality."* True then. But the erosion has since **completed the
unblocked part**: v0.231.0 gave `boss status` the re-entry + evidence reads, and v0.262.0 closed
facet 5 (rearchitect timing) as a **vocabulary** gap in `mentor-architect`, not a coverage one.

What is left is facet 2 (roadmap alignment as one view) and the wide half of facet 4 (the bloat
guard) — **both gated on a signal that has not arrived**, and the obvious cure for the position half
is a dark pattern this repo already catalogs (*a progress surface that cannot go down is a comfort
device*). That is not underdeveloped work; it is a decision with a written trigger.

**`deferred`, same trigger as [[IDEA-076]]: an OBSERVED session, not a third statement of pain.**
The compose-and-subtract constraint the old note wanted preserved is preserved — it lives in
[[EVID-001]], where it governs everything, not in this record's status word.
