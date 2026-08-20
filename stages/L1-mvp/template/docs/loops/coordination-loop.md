---
id: coordination-loop
type: loop
stage: L1-mvp
runner_type: hook
attributed_to: [Ajesh Shah (PRINCIPLES — the conscience holds the seam AI erodes)]
also_relevant: [Ju & Aral 2025 (human-AI teams' social/emotional comms drop ~27% while perceived quality stays flat — the invisible drift), Noam Wasserman (cofounder dynamics), Amy Edmondson (psychological safety)]
entry:
  - any_file_matches:
      path_glob: .boss/config.json
      pattern: '"handle"'
  - count_at_least:
      path_glob: docs/devlog.md
      pattern: '^## \d{4}-\d{2}-\d{2}'
      min: 3
exit:
  - count_at_least:
      path_glob: docs/decisions/DEC-*.md
      pattern: '^id:\s*DEC-\d'
      min: 1
drift_moment: coordination
---

# Loop: coordination (MVP) — the cofounder seam AI quietly erodes

This is the founder layer's conscience moment (IDEA-037 / FEAT-021 slice 5b). It exists because of the
single most-replicated finding in human-AI teaming: **AI accelerates each individual but does not hold the
team together** — and worse, the human-to-human seam erodes *invisibly* (Ju & Aral RCT, n=2,234:
social/emotional communication dropped ~27% while *perceived* teamwork quality stayed flat). A two-person
team can feel productive while quietly building in parallel, each in their own AI session, never actually
deciding anything *together*.

The shared decision log (`DEC-NNN`) is the artifact that makes that drift visible. **A team that has been
building for a while and has never recorded a single decision together** is the structural signal that work
may be flowing *through* each founder's agent and *around* the cofounder.

## Dormant-solo by construction

The entry requires a cofounder on the roster (`.boss/config.json` carries a `"handle"`). A solo founder
never opens this loop — there is no seam to watch. It only lights up once `boss team add` has put a second
person on the venture. This is the same dormant-solo guarantee the rest of the founder layer holds.

## The judgment the predicate can't make (and the model can)

The predicate gate is coarse: *it's a team · real work has happened (devlog ≥3) · zero `DEC` recorded.*
Regex can confirm those facts; it cannot tell whether the empty decision log means **the founders are
genuinely deciding in parallel and drifting apart** (the real seam problem) or **they decided everything on
a call and simply didn't write it down** (a quiet log that's perfectly healthy). That call is the model's,
and it's the whole value of the moment.

So the loop opens the door; the model walks through with judgment. When the door is open, the conscience
reads a bounded slice — the decisions directory (empty), the board (`boss board`), who's on the team
(`boss team`) — nothing wider. Then it judges: is one founder's solo-agent velocity high while the shared
log sits untouched by the other, or is this honest parallel work with the deciding happening off-repo? If
the former, name it in one spare line and ask the *coordination* question. If the latter, **stay silent** —
a quiet log is not proof of a problem (this is the weakest-transfer evidence in the research; over-firing
here would punish a team that simply talks on calls).

## Entry artifact

**A team building without deciding together** — `.boss/config.json` has a collaborator (`"handle"`) AND
`docs/devlog.md` has ≥3 dated entries (real work has happened — same "enough has happened" gate the drift
and capture loops use). Below 3 entries it's too early; a brand-new team isn't nagged before there's work.

## Exit artifact

**At least one shared decision recorded** — `docs/decisions/DEC-*.md` has ≥1 `DEC` (its `id:` frontmatter
matches). Recording a single decision together closes the loop: the founders have proven they *do* decide
jointly, and the never-decided-together smell no longer applies. The good outcome of a coordination nudge
is a `/decide`.

## Drift

`entry: satisfied` (a team + ≥3 devlog entries) AND `exit: not satisfied` (no `DEC` yet) = loop OPEN →
conscience emits the `coordination` moment. The model composes the voice (per `boss-voice`: seasoned hand,
assume intelligence), reads only the bounded slice, and **judges before speaking** — never a "your teamwork
score is low" read, never a satisfaction prompt (self-report is *proven blind* to the drift). The value is
the specific, structural observation: *building a while, nothing decided together, are you two actually in
this jointly?* It serves the **partnership as the unit** and **never takes a side** between the cofounders —
it surfaces the seam; it never says whose fault it is. Pairs with `mentor-cofounder` for the deeper coaching.

## Cost (BOSS eating its own dogfood)

- The **predicate gate is the cost control** — the model reads the bounded slice only after the cheap Node
  checks confirm (team + work + no decision). Every other prompt the hook emits nothing.
- The read is **bounded** — decisions dir + board + team roster, never the whole project.
- The model fires **at most once per session** and stays silent when the parallel work is honest.

## Known limitation (documented, like focus-loop's)

Exit is "≥1 `DEC` *ever*," so the moment targets the never-decided-together case and goes quiet after the
first shared decision — even if the founders later drift back into parallel solo work. A "decided together
*recently*" semantic would need a date-windowed count the predicate vocabulary doesn't have yet (the same
gap `building_since` aging fills on the board side). The evidence here is weak-transfer to begin with, so
the conservative once-and-quiet behavior is the right default; revisit if a real team shows the rebuilt-drift
case matters. **This is design-from-principle, labeled a bet** — there is no peer-reviewed study on
async multi-human/multi-AI founding teams; the loop watches the artifact channel the research points at,
and fires conservatively.

## How to remix

- **Skip / override:** legitimate when the deciding genuinely happens off-repo (a distributed pair who talk
  daily and just don't write `DEC`s). Override grammar:
  ```
  - **OVERRIDE:** skipped `coordination-loop` — rationale: <e.g. we decide on our daily call; the log lags
    on purpose, we're not drifting>.
  ```
  Or mute it outright: `boss conscience mute coordination`.
- **Tune the threshold:** a team that writes decisions rarely by preference might raise the devlog gate.

## Cite

PRINCIPLES.md (the conscience holds the seam). Ju & Aral 2025 (invisible human-AI team drift — the
motivating evidence), Wasserman (cofounder dynamics), Edmondson (psychological safety). The loop is the
*when*; the model's judgment + `boss board` + `/decide` (record one together) + `mentor-cofounder` are the
*how*.
